import json
import urllib.request

url = "http://127.0.0.1:8000/api/assistant"
data = {
    "message": "Please provide an analysis of the website and recommendations",
    "page": "home",
    "url": "/",
    "structured": True
}

req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=10) as resp:
    print(resp.read().decode())
