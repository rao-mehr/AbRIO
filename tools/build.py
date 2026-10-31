#!/usr/bin/env python3
"""Baut aus den Quellen die ausgelieferte Single-File-App.

Quellen:   src/template.html, src/styles.css, src/*.js, data/erreger.json,
           assets/*.png, version.txt
Ausgabe:   index.html und sw.js im Repo-Root (werden von GitHub Pages ausgeliefert)

Aufruf:    python tools/build.py           (prueft vorher mit validate.py)
           python tools/build.py --check   (baut nur in den Speicher und meldet,
                                            ob index.html/sw.js aktuell sind)
Nur Python-Standardbibliothek, keine Abhaengigkeiten.
"""
import base64
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


def read(p):
    return (ROOT / p).read_text(encoding="utf-8")


def data_uri(p):
    return "data:image/png;base64," + base64.b64encode((ROOT / p).read_bytes()).decode("ascii")


def build():
    version = read("version.txt").strip()
    db = json.loads(read("data/erreger.json"))
    db_min = json.dumps(db, ensure_ascii=False, separators=(", ", ": "))
    if "</" in db_min:
        db_min = db_min.replace("</", "<\\/")

    html = read("src/template.html")
    parts = {
        "{{STYLE}}": read("src/styles.css"),
        "{{DB}}": db_min,
        "{{ICON_APPLE}}": data_uri("assets/apple-touch-icon.png"),
        "{{ICON_FAV}}": data_uri("assets/favicon.png"),
    }
    for js in ("app.js", "sw-register.js", "update-check.js"):
        parts["{{" + js + "}}"] = read("src/" + js)
    # Werkzeuge (src/tools/*.js, alphabetisch) laufen im selben Scope wie app.js
    tool_js = "".join(p.read_text(encoding="utf-8") for p in sorted((SRC / "tools").glob("*.js")))
    if "/*@TOOLS*/" not in parts["{{app.js}}"]:
        raise SystemExit("Build-Fehler: Marker /*@TOOLS*/ fehlt in src/app.js")
    parts["{{app.js}}"] = parts["{{app.js}}"].replace("/*@TOOLS*/", tool_js)
    # Lokale Antibiotika: data/lokal.json wird als Objekt LOK in app.js eingebettet
    lok = json.dumps(json.loads(read("data/lokal.json")), ensure_ascii=False, separators=(", ", ": "))
    parts["{{LOK}}"] = lok.replace("</", "<\\/")
    sub = json.dumps(json.loads(read("data/substanzen.json")), ensure_ascii=False, separators=(", ", ": "))
    parts["{{SUB}}"] = sub.replace("</", "<\\/")
    # Platzhalter in einem Durchgang ersetzen (Inhalte werden nicht erneut gescannt)
    for key, val in parts.items():
        html = html.replace(key, val.replace("{{VERSION}}", version))
    html = html.replace("{{VERSION}}", version)

    sw = read("src/sw.js").replace("{{CACHE_ID}}", _cache_id(version))

    missed = [k for k in list(parts) + ["{{VERSION}}"] if k in html]
    if missed or "{{CACHE_ID}}" in sw:
        raise SystemExit(f"Build-Fehler: nicht ersetzte Platzhalter: {missed}")
    return html, sw


def _cache_id(version):
    # 2026.10.26.1 -> 2026-10-26-1
    return version.replace(".", "-")


def main():
    check = "--check" in sys.argv
    if "--no-validate" not in sys.argv:
        rc = subprocess.call([sys.executable, str(ROOT / "tools" / "validate.py")])
        if rc != 0:
            print("Build abgebrochen: Validierung fehlgeschlagen.")
            return rc
    html, sw = build()
    targets = {ROOT / "index.html": html, ROOT / "sw.js": sw}
    if check:
        stale = [p.name for p, c in targets.items()
                 if not p.exists() or p.read_text(encoding="utf-8") != c]
        print("Aktuell." if not stale else f"Veraltet, bitte bauen: {', '.join(stale)}")
        return 1 if stale else 0
    for p, c in targets.items():
        # newline="\n": auch unter Windows LF schreiben (siehe .gitattributes)
        with open(p, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(c)
    print(f"Gebaut: index.html ({len(html.encode('utf-8')):,} Bytes), sw.js – Version {read('version.txt').strip()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
