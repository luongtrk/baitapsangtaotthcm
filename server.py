import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"==================================================")
        print(f"  Game 'Theo Dấu Chân Người' - Bài Tập Sáng Tạo TTHCM")
        print(f"  Đang chạy máy chủ tại: {url}")
        print(f"  Nhấn Ctrl+C để dừng máy chủ.")
        print(f"==================================================")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        httpd.serve_forever()

if __name__ == "__main__":
    run()

