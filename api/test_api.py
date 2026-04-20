import json
import unittest

from index import app


def run_app(query: str):
    environ = {
        "REQUEST_METHOD": "GET",
        "QUERY_STRING": query,
    }
    captured = {}

    def start_response(status, headers):
        captured["status"] = status
        captured["headers"] = headers

    payload = b"".join(app(environ, start_response))
    body = json.loads(payload.decode("utf-8"))
    return captured["status"], body


class RoboAdvisorApiTests(unittest.TestCase):
    def test_inferred_mode_shape(self):
        status, body = run_app("mode=inferred_profile&risk=7&horizon=20")
        self.assertEqual(status, "200 OK")
        self.assertIn("strategic_weights", body)
        self.assertIn("tactical_overlays", body)
        self.assertIn("final_weights", body)
        self.assertIn("inferred_profile", body)
        self.assertEqual(body["mode_requested"], "inferred_profile")
        self.assertAlmostEqual(sum(body["final_weights"].values()), 100.0, places=1)

    def test_manual_override_requires_weights(self):
        status, body = run_app("mode=manual_override&risk=5&horizon=10")
        self.assertEqual(status, "400 Bad Request")
        self.assertIn("manual_override mode requires all manual weights", body["error"])

    def test_manual_override_infers_profile(self):
        query = (
            "mode=manual_override&risk=5&horizon=10"
            "&manual_spym=50&manual_vea=15&manual_agg=35"
        )
        status, body = run_app(query)
        self.assertEqual(status, "200 OK")
        self.assertEqual(body["mode_requested"], "manual_override")
        self.assertGreaterEqual(body["inferred_profile"]["fit_score"], 0)
        self.assertLessEqual(body["inferred_profile"]["fit_score"], 100)
        self.assertAlmostEqual(sum(body["final_weights"].values()), 100.0, places=1)

    def test_clamping_and_constraints(self):
        query = (
            "mode=inferred_profile&risk=10&horizon=30&liquidity_need=1&drawdown_tolerance=10"
            "&macro_growth=2&macro_rates=-2&macro_inflation=2&macro_volatility=-2&tactical_intensity=10"
        )
        status, body = run_app(query)
        self.assertEqual(status, "200 OK")
        final_weights = body["final_weights"]
        self.assertLessEqual(final_weights["spym"], 80.0)
        self.assertGreaterEqual(final_weights["agg"], 10.0)
        self.assertAlmostEqual(sum(final_weights.values()), 100.0, places=1)

    def test_invalid_mode(self):
        status, body = run_app("mode=abc")
        self.assertEqual(status, "400 Bad Request")
        self.assertIn("mode must be inferred_profile or manual_override", body["error"])

    def test_portfolio_dashboard_blends_by_risk(self):
        status_lo, body_lo = run_app("portfolio_type=core&risk=1")
        self.assertEqual(status_lo, "200 OK")
        status_hi, body_hi = run_app("portfolio_type=core&risk=10")
        self.assertEqual(status_hi, "200 OK")
        self.assertAlmostEqual(sum(body_lo["weights"].values()), 100.0, places=1)
        self.assertAlmostEqual(sum(body_hi["weights"].values()), 100.0, places=1)
        self.assertEqual(body_lo["risk_profile"], "Very Conservative")
        self.assertEqual(body_hi["risk_profile"], "High Growth")
        # Lower risk holds more fixed income than higher risk
        self.assertGreater(
            body_lo["weights"]["fixed"],
            body_hi["weights"]["fixed"],
        )
        self.assertGreater(
            body_hi["weights"]["us_eq"],
            body_lo["weights"]["us_eq"],
        )

    def test_portfolio_dashboard_mid_risk(self):
        status, body = run_app("portfolio_type=core&risk=5")
        self.assertEqual(status, "200 OK")
        self.assertEqual(body["risk_score"], 5)
        self.assertEqual(body["risk_profile"], "Moderate")


if __name__ == "__main__":
    unittest.main()
