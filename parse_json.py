import urllib.request
import json

url = "https://chatgpt.com/backend-api/shared/m_6a6cba5760448191a922be172a25435f"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req).read().decode('utf-8')
    data = json.loads(resp)
    
    # Traverse mapping to find images
    mapping = data.get("mapping", {})
    images = []
    for key, val in mapping.items():
        message = val.get("message", {})
        if message:
            content = message.get("content", {})
            parts = content.get("parts", [])
            for part in parts:
                if isinstance(part, dict) and "asset_pointer" in part:
                    images.append(part["asset_pointer"])
                elif isinstance(part, dict) and part.get("content_type") == "image_asset_pointer":
                    images.append(part.get("asset_pointer"))
                elif isinstance(part, dict) and "metadata" in message:
                    pass
            
            # also check message metadata
            metadata = message.get("metadata", {})
            if "dalle" in metadata:
                # might contain the url
                pass
                
    print(json.dumps(data)[:2000]) # Print beginning of JSON to inspect structure
except Exception as e:
    print("Error:", e)
