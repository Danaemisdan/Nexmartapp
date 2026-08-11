from PIL import Image
import os

img = Image.open(r'C:\Users\91844\.gemini\antigravity\brain\9e83ac76-5f70-4daa-8ade-0d9faa35bd66\.user_uploaded\media__1785510283854.jpg')
width, height = img.size

w = width // 3
h = height // 2

# We have 5 images in a left-aligned 3-column grid
coords = [
    (0, 0, w, h),
    (w, 0, 2*w, h),
    (2*w, 0, 3*w, h),
    (0, h, w, 2*h),
    (w, h, 2*w, 2*h)
]

filenames = [
    "prod-headset.jpg",
    "prod-watch.jpg",
    "prod-sofa.jpg",
    "prod-serum.jpg",
    "prod-sneakers.jpg"
]

out_dir = r"c:\Users\91844\Downloads\Nexmart App\public\placeholders"
os.makedirs(out_dir, exist_ok=True)

for i, box in enumerate(coords):
    cropped = img.crop(box)
    out_path = os.path.join(out_dir, filenames[i])
    cropped.save(out_path)
    print(f"Saved {filenames[i]}")
