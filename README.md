# AbRIO – Antibiotika Referenz Index · Orthopädie

Offline-fähige Single-File-Web-App (PWA), ausgeliefert über GitHub Pages:
<https://rao-mehr.github.io/AbRIO/>

## Aufbau

Ausgeliefert werden nur `index.html` und `sw.js` im Root. **Beide werden gebaut – nicht direkt bearbeiten.**

| Pfad | Inhalt |
|---|---|
| `data/erreger.json` | Erreger-Datenbank (ein Eintrag pro Erreger) |
| `src/template.html` | HTML-Gerüst mit Platzhaltern |
| `src/styles.css` | Styles |
| `src/app.js` | App-Logik (Suche, Detail, Filter, Klassen, Logik-Tab) |
| `src/sw-register.js`, `src/update-check.js` | Service-Worker-Registrierung, Update-Hinweis |
| `src/sw.js` | Service Worker (Vorlage) |
| `assets/` | App-Icons (werden beim Build eingebettet) |
| `version.txt` | **einzige** Stelle für die Versionsnummer |
| `tools/validate.py` | Prüft die Datenbank (Fehler brechen den Build ab, Warnungen sind Prüfhinweise) |
| `tools/build.py` | Erzeugt `index.html` + `sw.js` |

## Ablauf bei Änderungen

1. Quellen bearbeiten (meist `data/erreger.json`).
2. Bei einem Release `version.txt` hochzählen (z. B. `2026.10.30.1`) – Modal, Update-Check und Cache-Name folgen automatisch.
3. `python tools/build.py` (validiert zuerst, dann baut es).
4. Commit inkl. gebauter `index.html`/`sw.js`.

Benötigt nur Python 3 (Standardbibliothek). Die GitHub Action „Prüfen“ schlägt fehl, wenn die Daten ungültig sind oder `index.html` nicht zu den Quellen passt.
