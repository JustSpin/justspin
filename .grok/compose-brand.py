#!/usr/bin/env python3
"""Composite JustSpin lettering onto the existing dark-gold wheel art."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path("/workspace")
FONTS = ROOT / ".grok" / "fonts"
OUT = ROOT / ".grok"
INSPECT = OUT / "og-inspect"

JUST_FONT = FONTS / "fraunces_5.2.5_latin-600-normal.ttf"
SPIN_FONT = FONTS / "fraunces_5.2.5_latin-600-italic.ttf"
TAG_FONT = FONTS / "figtree_5.2.5_latin-500-normal.ttf"

PAPER = (18, 16, 14, 255)
CREAM = (243, 236, 228, 255)
GOLD = (212, 175, 106, 255)
GOLD_DEEP = (201, 168, 106, 255)
MUTED = (168, 159, 148, 255)


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def soft_cover(base: Image.Image, box: tuple[int, int, int, int], *, fade_right: int = 0, fade_y: int = 0) -> Image.Image:
    """Paint dark paper over a region so old lettering cannot ghost through."""
    x0, y0, x1, y1 = box
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    inner_x1 = x1 - fade_right
    inner_y0 = y0 + fade_y
    inner_y1 = y1 - fade_y
    draw.rectangle([x0, inner_y0, inner_x1, inner_y1], fill=PAPER)
    if fade_right > 0:
        for i in range(fade_right):
            a = int(255 * (1 - (i + 1) / fade_right))
            draw.line([(inner_x1 + i, inner_y0), (inner_x1 + i, inner_y1)], fill=(18, 16, 14, a))
    if fade_y > 0:
        for i in range(fade_y):
            a = int(255 * (1 - (i + 1) / fade_y))
            draw.line([(x0, inner_y0 - 1 - i), (inner_x1, inner_y0 - 1 - i)], fill=(18, 16, 14, a))
            draw.line([(x0, inner_y1 + i), (inner_x1, inner_y1 + i)], fill=(18, 16, 14, a))
    out = Image.alpha_composite(base.convert("RGBA"), overlay)
    return out


def dust(layer: Image.Image, rng_seed: int, box: tuple[int, int, int, int], n: int = 40) -> None:
    """A few gold motes so the covered region still reads as the poster paper."""
    import random

    rnd = random.Random(rng_seed)
    x0, y0, x1, y1 = box
    draw = ImageDraw.Draw(layer)
    for _ in range(n):
        x = rnd.randint(x0, x1)
        y = rnd.randint(y0, y1)
        r = rnd.choice((1, 1, 1, 2))
        a = rnd.randint(40, 110)
        draw.ellipse([x, y, x + r, y + r], fill=(212, 175, 106, a))


def wordmark(draw: ImageDraw.ImageDraw, xy: tuple[float, float], just_font, spin_font, *, fill_just=CREAM, fill_spin=GOLD, shadow=True) -> tuple[float, float, float, float]:
    x, y = xy
    just = "Just"
    spin = "Spin"
    if shadow:
        for dx, dy, col in ((0, 3, (0, 0, 0, 90)), (0, 1, (0, 0, 0, 50))):
            draw.text((x + dx, y + dy), just, font=just_font, fill=col)
    draw.text((x, y), just, font=just_font, fill=fill_just)
    just_box = draw.textbbox((x, y), just, font=just_font)
    spin_x = just_box[2] - 6
    if shadow:
        for dx, dy, col in ((0, 3, (0, 0, 0, 90)), (0, 1, (0, 0, 0, 50))):
            draw.text((spin_x + dx, y + dy), spin, font=spin_font, fill=col)
    draw.text((spin_x, y), spin, font=spin_font, fill=fill_spin)
    spin_box = draw.textbbox((spin_x, y), spin, font=spin_font)
    return (just_box[0], min(just_box[1], spin_box[1]), spin_box[2], max(just_box[3], spin_box[3]))


def compose_og() -> Image.Image:
    src = Image.open(ROOT / "public" / "og.jpg").convert("RGBA")
    w, h = src.size
    assert (w, h) == (1200, 630), (w, h)
    # Cover SpinBite lockup on the left; fade into the wheel.
    covered = soft_cover(src, (0, 70, 700, 470), fade_right=110, fade_y=24)
    type_layer = Image.new("RGBA", src.size, (0, 0, 0, 0))
    dust(type_layer, 7, (40, 90, 520, 430), n=36)
    draw = ImageDraw.Draw(type_layer)
    just_font = load_font(JUST_FONT, 108)
    spin_font = load_font(SPIN_FONT, 108)
    tag_font = load_font(TAG_FONT, 30)
    # Vertically center the lockup in the left panel.
    x = 72
    y = 188
    box = wordmark(draw, (x, y), just_font, spin_font)
    rule_y = box[3] + 22
    rule_x1 = x + 78
    draw.rectangle([x, rule_y, rule_x1, rule_y + 2], fill=GOLD)
    tag = "Can't decide? Just spin."
    draw.text((x, rule_y + 22), tag, font=tag_font, fill=MUTED)
    out = Image.alpha_composite(covered, type_layer)
    return out.convert("RGB")


def compose_poster() -> Image.Image:
    src = Image.open(ROOT / ".grok" / "spinbite-poster.jpg").convert("RGBA")
    w, h = src.size
    # Cover the top SpinBite and the bottom "Spin. Bite. Enjoy."
    covered = soft_cover(src, (0, 0, w, int(h * 0.175)), fade_right=0, fade_y=18)
    covered = soft_cover(covered, (0, int(h * 0.82), w, h), fade_right=0, fade_y=22)
    type_layer = Image.new("RGBA", src.size, (0, 0, 0, 0))
    dust(type_layer, 11, (80, 40, w - 80, int(h * 0.16)), n=28)
    dust(type_layer, 19, (80, int(h * 0.86), w - 80, h - 40), n=22)
    draw = ImageDraw.Draw(type_layer)
    just_font = load_font(JUST_FONT, 168)
    spin_font = load_font(SPIN_FONT, 168)
    tag_font = load_font(TAG_FONT, 46)
    # Measure to center the wordmark.
    probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    dummy = wordmark(probe, (0, 0), just_font, spin_font, shadow=False)
    mw = dummy[2] - dummy[0]
    x = (w - mw) / 2
    y = 78
    wordmark(draw, (x, y), just_font, spin_font)
    tag = "Can't decide? Just spin."
    tb = draw.textbbox((0, 0), tag, font=tag_font)
    tw = tb[2] - tb[0]
    draw.text(((w - tw) / 2, h - 168), tag, font=tag_font, fill=MUTED)
    out = Image.alpha_composite(covered, type_layer)
    # Match the in-app poster footprint (900×1338).
    return out.convert("RGB").resize((900, 1338), Image.Resampling.LANCZOS)


def main() -> None:
    INSPECT.mkdir(parents=True, exist_ok=True)
    og = compose_og()
    og.save(INSPECT / "og-preview.jpg", quality=92, subsampling=0)
    og.save(OUT / "og-raw.png")
    poster = compose_poster()
    poster.save(INSPECT / "poster-preview.jpg", quality=92, subsampling=0)
    poster.save(OUT / "poster-raw.png")
    print("og", og.size, "poster", poster.size)


if __name__ == "__main__":
    main()
