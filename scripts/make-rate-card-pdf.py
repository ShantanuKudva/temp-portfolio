#!/usr/bin/env python3
"""
Generates the placeholder rate-card PDF at public/rate-card.pdf.

Hand-rolls the PDF bytes so the repo needs no PDF dependency. Base-14
Helvetica only has WinAnsi glyphs, so prices read "Rs." rather than the rupee
sign used on the site — swap this whole file for Varsheni's real designed PDF
when she has one.
"""

from pathlib import Path

PACKAGES = [
    (
        "Single Review",
        "One product, one honest verdict.",
        ["1 reel (30-60s)", "3 story frames", "Usage rights (30 days)", "1 revision"],
        "from Rs. 25,000",
    ),
    (
        "Campaign Package",
        "A multi-touch push across a launch.",
        ["3 reels", "Story series", "Usage rights (90 days)", "2 revisions"],
        "from Rs. 75,000",
    ),
    (
        "Custom / Retainer",
        "Ongoing collaboration, bespoke scope.",
        ["Monthly deliverables", "Priority slots", "Extended rights", "Strategy input"],
        "from Rs. 1,50,000/mo",
    ),
]


def esc(s: str) -> str:
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def build_content() -> str:
    out = ["BT"]
    y = 780

    out += [f"/F1 26 Tf 1 0 0 1 60 {y} Tm ({esc('Varsheni')}) Tj"]
    y -= 26
    out += [f"/F2 12 Tf 1 0 0 1 60 {y} Tm ({esc('Tech UGC creator - honest reviews of apps & businesses')}) Tj"]
    y -= 40
    out += [f"/F1 15 Tf 1 0 0 1 60 {y} Tm ({esc('Rate card')}) Tj"]
    y -= 14
    out += [f"/F2 9 Tf 1 0 0 1 60 {y} Tm ({esc('Starting prices. Final scope and cost agreed per project.')}) Tj"]
    y -= 30

    for name, blurb, deliverables, price in PACKAGES:
        out += [f"/F1 13 Tf 1 0 0 1 60 {y} Tm ({esc(name)}) Tj"]
        out += [f"/F1 12 Tf 1 0 0 1 400 {y} Tm ({esc(price)}) Tj"]
        y -= 15
        out += [f"/F2 10 Tf 1 0 0 1 60 {y} Tm ({esc(blurb)}) Tj"]
        y -= 16
        for d in deliverables:
            out += [f"/F2 10 Tf 1 0 0 1 72 {y} Tm ({esc('- ' + d)}) Tj"]
            y -= 13
        y -= 16

    y -= 6
    out += [f"/F2 9 Tf 1 0 0 1 60 {y} Tm ({esc('Every review is disclosure-first and brand-safe. If a product is not worth')}) Tj"]
    y -= 12
    out += [f"/F2 9 Tf 1 0 0 1 60 {y} Tm ({esc('recommending, I will say so - that honesty is why the recommendation lands.')}) Tj"]
    y -= 26
    out += [f"/F2 9 Tf 1 0 0 1 60 {y} Tm ({esc('hello@varsheni.com')}) Tj"]
    y -= 20
    out += [f"/F2 8 Tf 1 0 0 1 60 {y} Tm ({esc('Placeholder rate card - replace with the real one in the admin panel.')}) Tj"]

    out.append("ET")
    return "\n".join(out)


def build_pdf() -> bytes:
    content = build_content().encode("latin-1")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length " + str(len(content)).encode() + b" >>\nstream\n" + content + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    ]

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = []
    for i, body in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf += f"{i} 0 obj\n".encode() + body + b"\nendobj\n"

    xref_at = len(pdf)
    pdf += f"xref\n0 {len(objects) + 1}\n".encode()
    pdf += b"0000000000 65535 f \n"
    for off in offsets:
        pdf += f"{off:010d} 00000 n \n".encode()
    pdf += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_at}\n%%EOF\n".encode()
    return bytes(pdf)


if __name__ == "__main__":
    out = Path(__file__).resolve().parent.parent / "public" / "rate-card.pdf"
    out.write_bytes(build_pdf())
    print(f"wrote {out} ({out.stat().st_size} bytes)")
