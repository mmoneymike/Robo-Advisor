from datetime import datetime, timezone
from urllib.parse import parse_qs
import json


ASSETS = ["us_equity", "intl_equity", "bonds", "reits", "cash"]

ASSET_LABELS = {
    "us_equity": "US Equity",
    "intl_equity": "International Equity",
    "bonds": "Bonds",
    "reits": "REITs",
    "cash": "Cash",
}

CONSTRAINTS = {
    "us_equity": {"min": 15.0, "max": 70.0},
    "intl_equity": {"min": 5.0, "max": 35.0},
    "bonds": {"min": 15.0, "max": 70.0},
    "reits": {"min": 0.0, "max": 20.0},
    "cash": {"min": 0.0, "max": 25.0},
}

MODEL_VERSION = "saa_taa_v1"
ASSUMPTION_SET = "core5_hybrid_rules"


def _clamp(value: float, low: float, high: float) -> float:
    return min(max(value, low), high)


def _round_map(values: dict) -> dict:
    return {k: round(v, 2) for k, v in values.items()}


def _parse_float(qs: dict, key: str, default: float) -> float:
    try:
        return float(qs.get(key, [str(default)])[0])
    except (ValueError, IndexError):
        raise ValueError(f"{key} must be a number")


def _risk_band_equity_cap(risk: float) -> float:
    if risk <= 3:
        return 45.0
    if risk <= 6:
        return 65.0
    return 85.0


def _normalize_sum_100(values: dict) -> tuple[dict, float]:
    total = sum(values[k] for k in ASSETS)
    if total <= 0:
        even = 100.0 / len(ASSETS)
        return ({k: even for k in ASSETS}, 100.0)
    factor = 100.0 / total
    normalized = {k: values[k] * factor for k in ASSETS}
    return normalized, round(total - 100.0, 6)


def compute_saa(profile_inputs: dict) -> dict:
    risk = profile_inputs["risk"]
    horizon = profile_inputs["horizon"]
    liquidity_need = profile_inputs["liquidity_need"]
    drawdown_tolerance = profile_inputs["drawdown_tolerance"]

    risk_n = (risk - 1.0) / 9.0
    horizon_n = (horizon - 1.0) / 29.0
    liquidity_n = (liquidity_need - 1.0) / 9.0
    drawdown_n = (drawdown_tolerance - 1.0) / 9.0

    cash = 2.0 + (8.0 * liquidity_n) + (6.0 * (1.0 - drawdown_n))
    reits = 2.5 + (4.0 * horizon_n) + (2.0 * drawdown_n) - (2.5 * liquidity_n)
    equity_like = 30.0 + (35.0 * risk_n) + (20.0 * horizon_n) - (15.0 * liquidity_n)
    equity_like = _clamp(equity_like, 20.0, 90.0)

    intl_share = _clamp(0.2 + (0.15 * risk_n) + (0.1 * horizon_n), 0.15, 0.45)
    intl_equity = equity_like * intl_share
    us_equity = equity_like - intl_equity
    bonds = 100.0 - us_equity - intl_equity - reits - cash

    strategic = {
        "us_equity": us_equity,
        "intl_equity": intl_equity,
        "bonds": bonds,
        "reits": reits,
        "cash": cash,
    }
    strategic, _ = _normalize_sum_100(strategic)
    return strategic


def compute_taa_overlays(market_inputs: dict, tactical_intensity: float) -> tuple[dict, dict]:
    growth = market_inputs["growth"]
    rates = market_inputs["rates"]
    inflation = market_inputs["inflation"]
    volatility = market_inputs["volatility"]

    intensity_n = _clamp(tactical_intensity, 0.0, 10.0) / 10.0
    caps = {
        "us_equity": 5.0,
        "intl_equity": 5.0,
        "bonds": 7.0,
        "reits": 3.0,
        "cash": 5.0,
    }

    raw_signals = {
        "us_equity": (2.0 * growth) - (1.0 * rates) - (2.0 * volatility),
        "intl_equity": (1.5 * growth) + (0.5 * inflation) - (1.5 * volatility),
        "bonds": (-1.5 * growth) - (2.0 * rates) + (1.5 * volatility),
        "reits": (0.8 * growth) + (1.2 * inflation) - (1.4 * rates),
        "cash": (-1.0 * growth) + (0.8 * rates) + (1.5 * volatility),
    }

    pre_clipped = {}
    clipped_fields = []
    for asset, signal in raw_signals.items():
        cap = caps[asset] * intensity_n
        proposed = (signal / 6.0) * cap
        clipped = _clamp(proposed, -cap, cap)
        pre_clipped[asset] = clipped
        if round(clipped - proposed, 8) != 0:
            clipped_fields.append(asset)

    centered = pre_clipped.copy()
    mean_overlay = sum(centered.values()) / len(ASSETS)
    for asset in ASSETS:
        centered[asset] -= mean_overlay
        cap = caps[asset] * intensity_n
        centered[asset] = _clamp(centered[asset], -cap, cap)

    overlay_sum_pre = round(sum(pre_clipped.values()), 6)
    overlay_sum_post = round(sum(centered.values()), 6)

    diagnostics = {
        "overlay_sum_pre": overlay_sum_pre,
        "overlay_sum_post": overlay_sum_post,
        "overlay_clipped_fields": sorted(set(clipped_fields)),
    }
    return centered, diagnostics


def apply_constraints_and_normalize(
    weights: dict, constraints: dict, risk: float
) -> tuple[dict, list, dict]:
    adjusted = {k: weights[k] for k in ASSETS}
    events = []

    for asset in ASSETS:
        low = constraints[asset]["min"]
        high = constraints[asset]["max"]
        before = adjusted[asset]
        adjusted[asset] = _clamp(before, low, high)
        if round(before, 8) != round(adjusted[asset], 8):
            events.append(
                {
                    "type": "asset_bound",
                    "asset": asset,
                    "label": ASSET_LABELS[asset],
                    "requested": round(before, 4),
                    "applied": round(adjusted[asset], 4),
                    "min": low,
                    "max": high,
                }
            )

    equity_cap = _risk_band_equity_cap(risk)
    equity_assets = ["us_equity", "intl_equity", "reits"]
    equity_total = sum(adjusted[a] for a in equity_assets)
    if equity_total > equity_cap:
        excess = equity_total - equity_cap
        reducible = sum(
            max(adjusted[a] - constraints[a]["min"], 0.0) for a in equity_assets
        )
        if reducible > 0:
            for asset in equity_assets:
                room = max(adjusted[asset] - constraints[asset]["min"], 0.0)
                if room <= 0:
                    continue
                reduction = min(excess * (room / reducible), room)
                adjusted[asset] -= reduction
            adjusted["bonds"] += excess * 0.7
            adjusted["cash"] += excess * 0.3
            events.append(
                {
                    "type": "equity_cap",
                    "cap": equity_cap,
                    "before": round(equity_total, 4),
                    "after": round(sum(adjusted[a] for a in equity_assets), 4),
                }
            )

    normalized, drift = _normalize_sum_100(adjusted)

    # Second pass in case normalization moved values marginally out of bounds.
    second_pass = normalized.copy()
    bound_touched = False
    for asset in ASSETS:
        low = constraints[asset]["min"]
        high = constraints[asset]["max"]
        clipped = _clamp(second_pass[asset], low, high)
        if round(clipped, 8) != round(second_pass[asset], 8):
            second_pass[asset] = clipped
            bound_touched = True
    if bound_touched:
        second_pass, _ = _normalize_sum_100(second_pass)

    diagnostics = {
        "normalization_drift": drift,
        "constraint_event_count": len(events),
    }
    return second_pass, events, diagnostics


def infer_profile_from_final_allocation(final_weights: dict) -> dict:
    risk_score = 1.0 + ((final_weights["us_equity"] + final_weights["intl_equity"]) / 55.0) * 9.0
    horizon = 1.0 + ((100.0 - final_weights["cash"]) / 100.0) * 29.0
    liquidity_need = 1.0 + (final_weights["cash"] / 20.0) * 9.0
    drawdown_tolerance = 1.0 + (
        ((final_weights["us_equity"] + final_weights["intl_equity"] + final_weights["reits"]) / 85.0)
        * 9.0
    )

    inferred = {
        "risk": _clamp(risk_score, 1.0, 10.0),
        "horizon": _clamp(horizon, 1.0, 30.0),
        "liquidity_need": _clamp(liquidity_need, 1.0, 10.0),
        "drawdown_tolerance": _clamp(drawdown_tolerance, 1.0, 10.0),
    }

    fitted_weights = compute_saa(inferred)
    error = sum(abs(final_weights[a] - fitted_weights[a]) for a in ASSETS) / len(ASSETS)
    fit_score = _clamp(100.0 - (error * 5.0), 0.0, 100.0)
    inferred["fit_score"] = round(fit_score, 2)
    inferred["nearest_bucket"] = (
        "conservative"
        if inferred["risk"] <= 3.5
        else "balanced"
        if inferred["risk"] <= 7.0
        else "growth"
    )
    return inferred


def _parse_profile_inputs(qs: dict) -> dict:
    risk = _clamp(_parse_float(qs, "risk", 5), 1.0, 10.0)
    horizon = _clamp(_parse_float(qs, "horizon", 10), 1.0, 30.0)
    liquidity_need = _clamp(_parse_float(qs, "liquidity_need", 5), 1.0, 10.0)
    drawdown_tolerance = _clamp(_parse_float(qs, "drawdown_tolerance", 5), 1.0, 10.0)
    return {
        "risk": risk,
        "horizon": horizon,
        "liquidity_need": liquidity_need,
        "drawdown_tolerance": drawdown_tolerance,
    }


def _parse_market_inputs(qs: dict) -> dict:
    return {
        "growth": _clamp(_parse_float(qs, "macro_growth", 0), -2.0, 2.0),
        "rates": _clamp(_parse_float(qs, "macro_rates", 0), -2.0, 2.0),
        "inflation": _clamp(_parse_float(qs, "macro_inflation", 0), -2.0, 2.0),
        "volatility": _clamp(_parse_float(qs, "macro_volatility", 0), -2.0, 2.0),
    }


def _parse_manual_weights(qs: dict) -> dict:
    values = {}
    missing = []
    for asset in ASSETS:
        key = f"manual_{asset}"
        if key not in qs:
            missing.append(key)
            continue
        values[asset] = _parse_float(qs, key, 0)
    if missing:
        raise ValueError(
            "manual_override mode requires all manual weights: " + ", ".join(missing)
        )
    return values


def _build_explanations(mode: str, events: list, diagnostics: dict, inferred_profile: dict) -> list[str]:
    messages = []
    if mode == "inferred_profile":
        messages.append("Final allocation is driven by your profile and tactical settings.")
    else:
        messages.append("Manual allocation override is active and profile values are inferred from your target mix.")

    if events:
        messages.append("One or more portfolio guardrails were applied to keep weights within policy bounds.")
    if diagnostics.get("overlay_clipped_fields"):
        labels = ", ".join(ASSET_LABELS[a] for a in diagnostics["overlay_clipped_fields"])
        messages.append(f"Tactical overlays were clipped for: {labels}.")

    messages.append(
        f"Inferred investor profile fit score: {inferred_profile.get('fit_score', 0):.2f}/100."
    )
    return messages


def _json_response(status, body, start_response):
    payload = json.dumps(body).encode("utf-8")
    headers = [
        ("Content-Type", "application/json"),
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Methods", "GET, OPTIONS"),
        ("Content-Length", str(len(payload))),
    ]
    start_response(status, headers)
    return [payload]


def app(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET")

    if method == "OPTIONS":
        return _json_response("204 No Content", {}, start_response)
    if method != "GET":
        return _json_response(
            "405 Method Not Allowed",
            {"error": "Only GET and OPTIONS are supported"},
            start_response,
        )

    qs = parse_qs(environ.get("QUERY_STRING", ""))
    mode = qs.get("mode", ["inferred_profile"])[0].strip().lower()
    if mode not in {"inferred_profile", "manual_override"}:
        return _json_response(
            "400 Bad Request",
            {"error": "mode must be inferred_profile or manual_override"},
            start_response,
        )

    try:
        profile_inputs = _parse_profile_inputs(qs)
        tactical_intensity = _clamp(_parse_float(qs, "tactical_intensity", 5), 0.0, 10.0)
        market_inputs = _parse_market_inputs(qs)
    except ValueError as exc:
        return _json_response("400 Bad Request", {"error": str(exc)}, start_response)

    if mode == "inferred_profile":
        strategic_weights = compute_saa(profile_inputs)
        tactical_overlays, overlay_diag = compute_taa_overlays(market_inputs, tactical_intensity)
        pre_constraints = {
            asset: strategic_weights[asset] + tactical_overlays[asset] for asset in ASSETS
        }
        final_weights, events, constraint_diag = apply_constraints_and_normalize(
            pre_constraints, CONSTRAINTS, profile_inputs["risk"]
        )
        inferred_profile = infer_profile_from_final_allocation(final_weights)
    else:
        try:
            manual_weights = _parse_manual_weights(qs)
        except ValueError as exc:
            return _json_response("400 Bad Request", {"error": str(exc)}, start_response)

        tactical_overlays = {asset: 0.0 for asset in ASSETS}
        overlay_diag = {
            "overlay_sum_pre": 0.0,
            "overlay_sum_post": 0.0,
            "overlay_clipped_fields": [],
        }
        final_weights, events, constraint_diag = apply_constraints_and_normalize(
            manual_weights, CONSTRAINTS, profile_inputs["risk"]
        )
        inferred_profile = infer_profile_from_final_allocation(final_weights)
        strategic_weights = compute_saa(inferred_profile)

    diagnostics = {**overlay_diag, **constraint_diag}
    explanations = _build_explanations(mode, events, diagnostics, inferred_profile)

    response = {
        "model_version": MODEL_VERSION,
        "assumption_set": ASSUMPTION_SET,
        "calc_timestamp": datetime.now(timezone.utc).isoformat(),
        "mode_requested": mode,
        "inputs": {
            "profile": _round_map(profile_inputs),
            "tactical_intensity": round(tactical_intensity, 2),
            "macro_scores": _round_map(market_inputs),
        },
        "strategic_weights": _round_map(strategic_weights),
        "tactical_overlays": _round_map(tactical_overlays),
        "final_weights": _round_map(final_weights),
        "inferred_profile": _round_map(
            {
                "risk": inferred_profile["risk"],
                "horizon": inferred_profile["horizon"],
                "liquidity_need": inferred_profile["liquidity_need"],
                "drawdown_tolerance": inferred_profile["drawdown_tolerance"],
            }
        )
        | {
            "fit_score": inferred_profile["fit_score"],
            "nearest_bucket": inferred_profile["nearest_bucket"],
        },
        "constraint_events": events,
        "diagnostics": diagnostics,
        "explanations": explanations,
    }

    return _json_response("200 OK", response, start_response)
