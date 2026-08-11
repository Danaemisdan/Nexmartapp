import urllib.request
import re
import json

url = "https://chatgpt.com/s/m_6a6cba5760448191a922be172a25435f"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    urls = re.findall(r'(https://files\.oaiusercontent\.com/[^\s\"\']+)', html)
    
    # Sometimes it's inside JSON, let's just find anything matching the domain
    print(set(urls))
except Exception as e:
    print("Error:", e)
