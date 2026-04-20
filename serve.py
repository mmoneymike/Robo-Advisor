"""
Local development server for the robo-advisor Python API.

Run from the project root:
    python3 serve.py          # runs on port 8000 (default)
    PORT=8001 python3 serve.py

The Vite dev server (npm run dev) proxies /api requests to this server.
"""

import os
import sys

# Ensure the project root is on sys.path so 'api.index' resolves correctly.
sys.path.insert(0, os.path.dirname(__file__))

from wsgiref.simple_server import make_server, WSGIRequestHandler
from api.index import app


class _QuietHandler(WSGIRequestHandler):
    def log_request(self, code="-", size="-"):
        print(f"  {self.command} {self.path} → {code}")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    with make_server("", port, app, handler_class=_QuietHandler) as httpd:
        print(f"Python API dev server running at http://localhost:{port}")
        print("Press Ctrl+C to stop.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
