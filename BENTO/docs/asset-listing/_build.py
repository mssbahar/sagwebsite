import html
from collections import OrderedDict
from pathlib import Path

root = Path(r"C:\Users\smart\SAG-WEB\ASSETS")
out = Path(r"C:\Users\smart\SAG-WEB\BENTO\docs\asset-listing")
out.mkdir(parents=True, exist_ok=True)

img_ext = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
vid_ext = {".mov", ".mp4", ".webm"}
files = sorted(
    [
        p
        for p in root.rglob("*")
        if p.is_file() and p.suffix.lower() in img_ext | vid_ext
    ],
    key=lambda p: str(p).lower(),
)


def file_uri(p: Path) -> str:
    return p.resolve().as_uri()


def short_group(p: Path) -> str:
    rel = p.parent.relative_to(root).as_posix()
    rel = rel.replace(
        "##NICE SELECTED-20260921T032334Z-1-001/##NICE SELECTED/", "001/"
    )
    rel = rel.replace(
        "##NICE SELECTED-20260921T032334Z-1-002/##NICE SELECTED/", "002/"
    )
    return rel


groups: OrderedDict[str, list[Path]] = OrderedDict()
for f in files:
    groups.setdefault(short_group(f), []).append(f)

parts = [
    """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SAG ASSETS listing</title>
<style>
  :root { --accent:#f6047c; --ink:#111; --muted:#666; --line:#ddd; --bg:#f6f6f7; }
  * { box-sizing: border-box; }
  body { margin:0; font: 14px/1.45 system-ui, sans-serif; color:var(--ink); background:var(--bg); }
  header { position:sticky; top:0; z-index:5; background:#111; color:#fff; padding:16px 24px; }
  header h1 { margin:0; font-size:18px; font-weight:650; }
  header p { margin:6px 0 0; color:#bbb; font-size:12px; }
  nav { display:flex; flex-wrap:wrap; gap:8px; padding:12px 24px; background:#fff; border-bottom:1px solid var(--line); }
  nav a { color:var(--ink); text-decoration:none; font-size:12px; padding:4px 8px; border:1px solid var(--line); border-radius:4px; }
  nav a:hover { border-color:var(--accent); color:var(--accent); }
  section { padding:24px; }
  h2 { margin:0 0 12px; font-size:15px; border-bottom:2px solid var(--accent); padding-bottom:6px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:12px; }
  figure { margin:0; background:#fff; border:1px solid var(--line); }
  figure img { display:block; width:100%; height:160px; object-fit:cover; background:#eee; }
  figcaption { padding:8px; font-size:11px; color:var(--muted); word-break:break-all; }
  figcaption strong { display:block; color:var(--ink); font-size:12px; margin-bottom:2px; }
  .video { padding:24px 8px; text-align:center; font-size:12px; color:var(--muted); }
  .note { margin:0 0 16px; color:var(--muted); font-size:13px; max-width:920px; }
</style>
</head>
<body>
<header>
  <h1>SAG ASSETS — full listing</h1>
  <p>All photos/videos from C:\\Users\\smart\\SAG-WEB\\ASSETS · open this HTML locally to see thumbnails</p>
</header>
"""
]

parts.append("<nav>")
for i, (g, items) in enumerate(groups.items()):
    parts.append(f'<a href="#g{i}">{html.escape(g)} ({len(items)})</a>')
parts.append("</nav>")
parts.append(
    """<section>
  <p class="note"><strong>What is here:</strong> workshop interiors, lifts, technicians, engine bays, brakes, overhaul, tyre change + 9 videos.
  <strong>Not in this dump:</strong> branch exteriors, reception, lounge, customer handover (branch photos already live in BENTO/public/images/branches).
  Photoshop folders are edited copies of the same shots — prefer Edited or originals.</p>
</section>
"""
)

for i, (g, items) in enumerate(groups.items()):
    parts.append(
        f'<section id="g{i}"><h2>{html.escape(g)} · {len(items)} files</h2><div class="grid">'
    )
    for f in items:
        name = html.escape(f.name)
        uri = file_uri(f)
        kb = round(f.stat().st_size / 1024)
        if f.suffix.lower() in vid_ext:
            parts.append(
                f'<figure><div class="video">VIDEO<br><a href="{uri}">{name}</a></div>'
                f"<figcaption><strong>{name}</strong>{kb} KB</figcaption></figure>"
            )
        else:
            parts.append(
                f'<figure><a href="{uri}" target="_blank"><img src="{uri}" alt="{name}" loading="lazy" /></a>'
                f"<figcaption><strong>{name}</strong>{kb} KB</figcaption></figure>"
            )
    parts.append("</div></section>")

parts.append("</body></html>")
(out / "index.html").write_text("\n".join(parts), encoding="utf-8")
print(f"groups={len(groups)} files={len(files)}")
