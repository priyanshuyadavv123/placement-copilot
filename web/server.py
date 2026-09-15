"""
PlacementCopilot AI — Web API Server
Zero-dependency HTTP REST API & Static Asset Server.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import urllib.parse

from core.company_intel import get_all_companies, get_company_intel
from core.ats_engine import ATSEngine
from core.interview_engine import InterviewEngine

WEB_DIR = os.path.dirname(os.path.abspath(__file__))

class PlacementServerHandler(BaseHTTPRequestHandler):
    ats_engine = ATSEngine()
    interview_engine = InterviewEngine()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/index.html":
            self._serve_file(os.path.join(WEB_DIR, "index.html"), "text/html")
        elif path == "/styles.css":
            self._serve_file(os.path.join(WEB_DIR, "styles.css"), "text/css")
        elif path == "/app.js":
            self._serve_file(os.path.join(WEB_DIR, "app.js"), "application/javascript")
        elif path == "/api/companies":
            companies = get_all_companies()
            self._json_response(200, {"success": True, "companies": companies})
        elif path.startswith("/api/companies/"):
            company_id = path.replace("/api/companies/", "").strip()
            intel = get_company_intel(company_id)
            self._json_response(200, {"success": True, "intel": intel})
        else:
            self.send_error(404, "File Not Found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        try:
            data = json.loads(post_body)
        except json.JSONDecodeError:
            data = {}

        if path == "/api/ats/analyze":
            resume_text = data.get("resume_text", "")
            company_id = data.get("company_id", "tcs_digital")
            custom_jd = data.get("custom_jd", "")

            if not resume_text.strip():
                self._json_response(400, {"success": False, "error": "Resume text cannot be empty."})
                return

            result = self.ats_engine.analyze(resume_text, company_id, custom_jd)
            self._json_response(200, {"success": True, "data": result})

        elif path == "/api/interview/questions":
            company_id = data.get("company_id", "tcs_digital")
            result = self.interview_engine.get_questions(company_id)
            self._json_response(200, {"success": True, "data": result})

        elif path == "/api/interview/evaluate":
            company_id = data.get("company_id", "tcs_digital")
            question = data.get("question", "")
            answer = data.get("answer", "")
            category = data.get("category", "technical")

            if not answer.strip():
                self._json_response(400, {"success": False, "error": "Answer cannot be empty."})
                return

            result = self.interview_engine.evaluate_answer(company_id, question, answer, category)
            self._json_response(200, {"success": True, "data": result})

        else:
            self.send_error(404, "Endpoint Not Found")

    def _serve_file(self, filepath, content_type):
        if not os.path.exists(filepath):
            self.send_error(404, f"File {filepath} not found")
            return
        with open(filepath, "rb") as f:
            content = f.read()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def _json_response(self, code, data):
        content = json.dumps(data).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

def run_server(port=8080):
    server_address = ("0.0.0.0", port)
    try:
        httpd = HTTPServer(server_address, PlacementServerHandler)
        print(f"\n=======================================================")
        print(f"🚀 PlacementCopilot AI Dashboard Live:")
        print(f"👉 http://localhost:{port}")
        print(f"👉 http://127.0.0.1:{port}")
        print(f"=======================================================\n")
        httpd.serve_forever()
    except OSError as e:
        if port < 5010:
            print(f"Port {port} in use, trying {port + 1}...")
            run_server(port + 1)
        else:
            raise e
