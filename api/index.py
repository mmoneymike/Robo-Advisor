from urllib.parse import parse_qs
import json


def calculate_allocation(risk: float, horizon: float) -> dict:
    """
    Return SPY/AGG weights given a risk score and time horizon.

    Replace the body of this function with the custom Gaard model.
    Inputs are already validated and clamped before arriving here.
    """
    equity_pct = ((risk / 10) * 60) + ((horizon / 30) * 40)
    equity_pct = round(min(max(equity_pct, 0), 100), 2)
    bond_pct = round(100 - equity_pct, 2)
    return {"spy_weight": equity_pct, "agg_weight": bond_pct}


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

    qs = parse_qs(environ.get("QUERY_STRING", ""))

    try:
        risk = float(qs.get("risk", ["5"])[0])
        horizon = float(qs.get("horizon", ["10"])[0])
    except (ValueError, IndexError):
        return _json_response(
            "400 Bad Request",
            {"error": "risk and horizon must be numbers"},
            start_response,
        )

    risk = min(max(risk, 1), 10)
    horizon = min(max(horizon, 1), 30)

    result = calculate_allocation(risk, horizon)
    result["risk"] = risk
    result["horizon"] = horizon

    return _json_response("200 OK", result, start_response)
