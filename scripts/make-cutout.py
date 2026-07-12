# Requires: pip install "rembg[cpu]" pillow scipy numpy
# Usage: python scripts/make-cutout.py ~/Downloads/varsheni-2.png public/varsheni-2-cutout.png
import sys
import numpy as np
from rembg import remove, new_session
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGB")
out = remove(
    img, session=new_session("u2net"),
    alpha_matting=True, alpha_matting_foreground_threshold=250,
    alpha_matting_background_threshold=15, alpha_matting_erode_size=12,
).convert("RGBA")

arr = np.asarray(out).astype(np.uint8)
a = arr[:, :, 3].astype(np.float32) / 255.0
a[a < 0.35] = 0.0
binm = ndimage.binary_erosion(a > 0.5, iterations=2)
lbl, n = ndimage.label(binm)
if n > 1:
    sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
    binm = lbl == (int(np.argmax(sizes)) + 1)
a = np.where(binm, a, 0.0)
a_img = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
res = Image.fromarray(arr[:, :, :3], "RGB").convert("RGBA")
res.putalpha(a_img)
bbox = res.getbbox()
if bbox:
    res = res.crop(bbox)
res.save(dst)
print("saved", dst, res.size)
