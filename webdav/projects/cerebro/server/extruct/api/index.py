from http.server import BaseHTTPRequestHandler
from datetime import datetime
import extruct
import requests
from w3lib.html import get_base_url
import json

class handler(BaseHTTPRequestHandler):
  def do_GET(self):
    self.send_response(200)
    self.send_header('Content-type', 'application/json')
    self.end_headers()
    path = self.path.replace('/', '', 1).replace('https:/', 'https://', 1).replace('https:///', 'https://', 1)
    r = requests.get(path)
    base_url = get_base_url(r.text, r.url)
    print("lol", base_url)
    data = extruct.extract(r.text, base_url=base_url, uniform=True)
    json_str = json.dumps(data)
    self.wfile.write(json_str.encode(encoding='utf_8'))
    return
