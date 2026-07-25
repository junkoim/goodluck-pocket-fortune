from pathlib import Path
from math import sin, cos, pi
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "cards"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 768, 1075
GOLD = (216, 184, 106)
DEEP_GOLD = (130, 95, 38)
NAVY = (8, 11, 29)
PURPLE = (56, 34, 88)
BLACK = (4, 5, 12)

CARDS = [
    ("00", "wanderer", "circle", "white rose"),
    ("01", "magician", "wand", "infinity"),
    ("02", "priestess", "crescent", "veil"),
    ("03", "empress", "wheat", "venus"),
    ("04", "emperor", "crown", "mountain"),
    ("05", "hierophant", "keys", "temple"),
    ("06", "union", "twin lights", "heart"),
    ("07", "chariot", "wheels", "banner"),
    ("08", "strength", "lion", "lemniscate"),
    ("09", "hermit", "lantern", "staff"),
    ("10", "wheel", "wheel", "stars"),
    ("11", "justice", "scales", "sword"),
    ("12", "hanged", "halo", "branch"),
    ("13", "death", "gate", "flower"),
    ("14", "temperance", "cups", "river"),
    ("15", "devil", "horns", "chain"),
    ("16", "tower", "tower", "lightning"),
    ("17", "star", "large star", "water"),
    ("18", "moon", "moon", "path"),
    ("19", "sun", "sun", "garden"),
    ("20", "judgement", "trumpet", "rays"),
    ("21", "world", "wreath", "orbit"),
]

def gradient(base1, base2):
    img = Image.new("RGB", (W, H), base1)
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        for x in range(W):
            r = int(base1[0] * (1 - t) + base2[0] * t)
            g = int(base1[1] * (1 - t) + base2[1] * t)
            b = int(base1[2] * (1 - t) + base2[2] * t)
            px[x, y] = (r, g, b)
    return img

def starfield(draw, seed):
    for i in range(120):
        x = (i * 97 + seed * 53) % W
        y = (i * 211 + seed * 31) % H
        if 90 < x < W - 90 and 120 < y < H - 120:
            c = (180 + (i * 7) % 60, 160 + (i * 3) % 50, 110 + (i * 5) % 80)
            draw.ellipse((x, y, x + 2, y + 2), fill=c)

def frame(draw):
    draw.rounded_rectangle((35, 35, W - 35, H - 35), radius=34, outline=GOLD, width=8)
    draw.rounded_rectangle((62, 62, W - 62, H - 62), radius=22, outline=DEEP_GOLD, width=3)
    draw.rectangle((86, 102, W - 86, H - 102), outline=(235, 205, 128), width=2)
    for x, y in [(78, 78), (W - 78, 78), (78, H - 78), (W - 78, H - 78)]:
        draw.ellipse((x - 16, y - 16, x + 16, y + 16), outline=GOLD, width=3)

def glow_layer():
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse((145, 195, W - 145, H - 305), fill=(216, 184, 106, 34))
    return layer.filter(ImageFilter.GaussianBlur(34))

def symbol(draw, idx, primary, secondary):
    cx, cy = W // 2, H // 2 - 20
    draw.ellipse((cx - 164, cy - 164, cx + 164, cy + 164), outline=(216, 184, 106, 130), width=4)
    draw.ellipse((cx - 116, cy - 116, cx + 116, cy + 116), outline=(123, 91, 183, 120), width=3)
    kind = primary
    if kind in {"circle", "wheel", "orbit"}:
        for r in [68, 112, 150]:
            draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=GOLD, width=5)
        for a in range(0, 360, 45):
            x = cx + cos(a * pi / 180) * 150
            y = cy + sin(a * pi / 180) * 150
            draw.line((cx, cy, x, y), fill=DEEP_GOLD, width=3)
    elif kind in {"wand", "staff", "sword"}:
        draw.line((cx - 90, cy + 150, cx + 90, cy - 150), fill=GOLD, width=13)
        draw.polygon([(cx + 90, cy - 175), (cx + 120, cy - 112), (cx + 60, cy - 122)], fill=(235, 205, 128))
    elif kind in {"crescent", "moon"}:
        draw.ellipse((cx - 130, cy - 145, cx + 130, cy + 115), fill=(226, 208, 151))
        draw.ellipse((cx - 60, cy - 160, cx + 180, cy + 100), fill=(16, 18, 44))
    elif kind in {"wheat", "branch", "wreath"}:
        for side in [-1, 1]:
            for i in range(10):
                y = cy + 140 - i * 30
                x = cx + side * (70 + i * 8)
                draw.ellipse((x - 28, y - 12, x + 28, y + 12), fill=(183, 145, 62))
            if side < 0:
                draw.arc((cx - 180, cy - 210, cx, cy + 230), 90, 270, fill=GOLD, width=6)
            else:
                draw.arc((cx, cy - 210, cx + 180, cy + 230), -90, 90, fill=GOLD, width=6)
    elif kind in {"crown", "temple"}:
        draw.rectangle((cx - 145, cy - 35, cx + 145, cy + 130), outline=GOLD, width=8)
        draw.polygon([(cx - 145, cy - 35), (cx - 85, cy - 125), (cx, cy - 35), (cx + 85, cy - 125), (cx + 145, cy - 35)], fill=(120, 76, 44), outline=GOLD)
    elif kind in {"keys", "scales"}:
        draw.line((cx, cy - 150, cx, cy + 130), fill=GOLD, width=8)
        draw.line((cx - 150, cy - 55, cx + 150, cy - 55), fill=GOLD, width=6)
        for side in [-1, 1]:
            draw.arc((cx + side * 80 - 48, cy - 10, cx + side * 80 + 48, cy + 80), 0, 180, fill=GOLD, width=5)
    elif kind in {"twin lights", "cups"}:
        for side in [-1, 1]:
            draw.ellipse((cx + side * 75 - 52, cy - 115, cx + side * 75 + 52, cy - 12), outline=GOLD, width=7)
            draw.line((cx + side * 75, cy - 12, cx + side * 75, cy + 120), fill=GOLD, width=6)
    elif kind in {"wheels", "tower"}:
        draw.polygon([(cx - 95, cy + 160), (cx - 70, cy - 150), (cx + 75, cy - 135), (cx + 100, cy + 160)], fill=(28, 31, 59), outline=GOLD)
        draw.line((cx - 120, cy - 45, cx + 80, cy + 35), fill=(235, 205, 128), width=10)
    elif kind in {"lion", "horns"}:
        draw.ellipse((cx - 120, cy - 110, cx + 120, cy + 130), fill=(108, 67, 65), outline=GOLD, width=5)
        draw.polygon([(cx - 120, cy - 80), (cx - 185, cy - 155), (cx - 90, cy - 118)], fill=GOLD)
        draw.polygon([(cx + 120, cy - 80), (cx + 185, cy - 155), (cx + 90, cy - 118)], fill=GOLD)
    elif kind in {"lantern", "large star", "sun"}:
        points = []
        for i in range(16):
            r = 150 if i % 2 == 0 else 70
            a = -pi / 2 + i * pi / 8
            points.append((cx + cos(a) * r, cy + sin(a) * r))
        draw.polygon(points, fill=(221, 180, 73), outline=(255, 232, 154))
        draw.ellipse((cx - 45, cy - 45, cx + 45, cy + 45), fill=(247, 228, 153))
    elif kind in {"halo", "gate"}:
        draw.arc((cx - 135, cy - 170, cx + 135, cy + 120), 180, 360, fill=GOLD, width=10)
        draw.rectangle((cx - 130, cy - 15, cx + 130, cy + 170), outline=GOLD, width=8)
    else:
        draw.polygon([(cx, cy - 160), (cx + 140, cy), (cx, cy + 160), (cx - 140, cy)], outline=GOLD, width=8)
    for i in range(8):
        a = i * pi / 4 + idx * .09
        x = cx + cos(a) * 230
        y = cy + sin(a) * 230
        draw.line((cx + cos(a) * 180, cy + sin(a) * 180, x, y), fill=(216, 184, 106, 120), width=2)
    for i in range(5):
        x = cx - 120 + i * 60
        draw.ellipse((x - 7, H - 158, x + 7, H - 144), fill=(205, 170, 100, 150))

def make_card(idx, code, primary, secondary):
    img = gradient((7 + idx % 8, 10, 31 + idx % 19), (48 + idx % 20, 26, 72 + idx % 24)).convert("RGBA")
    img.alpha_composite(glow_layer())
    paint = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(paint)
    starfield(d, idx)
    for i in range(44):
        x = (idx * 41 + i * 83) % W
        y = (idx * 67 + i * 47) % H
        d.ellipse((x - 90, y - 24, x + 90, y + 24), fill=(255, 255, 255, 8))
    img.alpha_composite(paint.filter(ImageFilter.GaussianBlur(7)))
    d = ImageDraw.Draw(img, "RGBA")
    symbol(d, idx, primary, secondary)
    frame(d)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.4, percent=105, threshold=3))
    img.convert("RGB").save(OUT / f"{code}.webp", "WEBP", quality=82, method=6)

def make_back():
    img = gradient(NAVY, BLACK).convert("RGBA")
    d = ImageDraw.Draw(img, "RGBA")
    starfield(d, 33)
    for r in range(92, 330, 56):
        d.ellipse((W//2-r, H//2-r, W//2+r, H//2+r), outline=(216,184,106,70), width=3)
    for a in range(0, 360, 30):
        x = W//2 + cos(a*pi/180)*250
        y = H//2 + sin(a*pi/180)*250
        d.line((W//2, H//2, x, y), fill=(216,184,106,70), width=2)
    frame(d)
    img.convert("RGB").save(OUT / "back.webp", "WEBP", quality=84, method=6)
    img.resize((1200, 630)).convert("RGB").save(ROOT / "public" / "og-image.webp", "WEBP", quality=82, method=6)

for idx, (code, _slug, primary, secondary) in enumerate(CARDS):
    make_card(idx, code, primary, secondary)
make_back()
print("generated", len(CARDS) + 2, "webp files")
