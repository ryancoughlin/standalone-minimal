"""
Simple HTTP server for mock API endpoints
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from endpoints.api import mock_api

class MockAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        try:
            # Parse the path
            parsed_path = urllib.parse.urlparse(self.path)
            path = parsed_path.path
            
            # Handle CORS
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-CSRFToken')
            self.end_headers()
            
            # Route to mock API
            response = mock_api.handle_request(path, "GET")
            
            # Send response
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode())

    def do_POST(self):
        """Handle POST requests"""
        try:
            # Parse the path
            parsed_path = urllib.parse.urlparse(self.path)
            path = parsed_path.path
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8')) if post_data else {}
            
            # Handle CORS
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-CSRFToken')
            self.end_headers()
            
            # Route to mock API
            response = mock_api.handle_request(path, "POST", data)
            
            # Send response
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-CSRFToken')
        self.end_headers()

def run_server(port=8080):
    """Run the mock API server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, MockAPIHandler)
    print(f"🚀 Mock API server running on http://localhost:{port}")
    print("📋 Available endpoints:")
    print("  GET  /r/folder_list/")
    print("  GET  /r/all_folders_list/")
    print("  GET  /r/merged_replay_list/")
    print("  GET  /r/published_live_demo_list/")
    print("  GET  /r/default_url/{id}/")
    print("  GET  /r/replay_list/")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
