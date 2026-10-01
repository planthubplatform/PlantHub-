"""
serve.py — put PlantHub on a local web address.

Run it:

    python serve.py

Then open the address it prints (http://localhost:5173 by default).

Why this file exists instead of `python -m http.server 5173`:

  1. If port 5173 is already taken — usually by a copy of this server left
     running from earlier — the plain command just fails. This one lets a
     port be handed to it, so a second copy can start on a free port instead
     of colliding. Claude Code's preview pane does that automatically.
  2. It tells the browser not to cache anything, so refreshing the page
     always shows your latest edit rather than yesterday's stylesheet.

To choose the port yourself:

    $env:PORT=5174; python serve.py     (PowerShell)
    PORT=5174 python serve.py           (Git Bash, macOS, Linux)

Press Ctrl+C to stop the server.
"""

import functools
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# Use the port we were handed, or 5173 when nobody said otherwise.
PORT = int(os.environ.get("PORT") or 5173)

# Serve the folder this file sits in, whatever folder the command was run from.
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(SimpleHTTPRequestHandler):
    """A normal file server that asks the browser to never cache."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # The default logs every single request, which buries anything useful.
        pass


def main():
    handler = functools.partial(NoCacheHandler, directory=PROJECT_DIR)
    ThreadingHTTPServer.allow_reuse_address = True

    with ThreadingHTTPServer(("127.0.0.1", PORT), handler) as server:
        print(f"PlantHub is running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
