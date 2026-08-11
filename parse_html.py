import re

with open("chatgpt.html", "r", encoding="utf-16") as f:
    html = f.read()

urls = set(re.findall(r'https://files\.oaiusercontent\.com/[^\s\"\']+', html))
if urls:
    print("Found direct URLs:")
    print("\n".join(urls))
else:
    print("No direct URLs found. Searching for images in JSON...")
    # Sometimes it is inside JSON strings which are escaped
    urls = set(re.findall(r'https:\\/\\/files\.oaiusercontent\.com\\/[^\s\"\']+', html))
    if urls:
        print("Found escaped URLs:")
        print("\n".join([u.replace('\\/', '/') for u in urls]))
    else:
        print("No URLs found in HTML.")
