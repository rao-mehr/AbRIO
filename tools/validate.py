#!/usr/bin/env python3
"""Prueft data/erreger.json vor jedem Build.

FEHLER brechen den Build ab (Struktur, Pflichtfelder, erlaubte Werte).
WARNUNGEN sind inhaltliche Auffaelligkeiten, die ein Mensch pruefen soll
(uneinheitliche Dosierungen, widerspruechliche Therapiedauern usw.).

Aufruf:  python tools/validate.py            (Exit-Code 1 bei Fehlern)
         python tools/validate.py --strict   (auch Warnungen brechen ab)
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "erreger.json"

REQUIRED = ["n", "g", "impl", "route", "f", "a", "o", "olabel", "dur", "note",
            "pi", "pig", "syn", "syns", "w", "det"]
PIG_KEYS = {"head", "iv", "bio", "oral", "surg", "dur", "cave", "extra"}
GROUPS = {"Gram-positiv", "Gram-negativ", "Anaerobier", "Atypisch",
          "Mykobakterien", "Pilze", "Multiresistenz-Kategorien"}
IMPL = {
    "pji": {"ja", "selten", "nein"},
    "dair": {"möglich", "erschwert (DTT)", "Wechsel bevorz.", "—"},
    "rif": {"ja", "bedingt", "nein", "—"},
}
EV = {None, "PIF", "Leitlinie", "Fallserien", "Fallbericht", "Entwurf"}


def all_texts(e):
    """Alle Freitexte eines Eintrags (fuer Suche nach Mustern)."""
    out = [e.get("dur", ""), e.get("note", ""), e.get("pi", ""), e.get("wu", "")]
    for key in ("f", "a", "o"):
        for drug, dose in e.get(key, []):
            out.append(f"{drug} {dose}")
    for lst in e.get("pig", {}).values():
        if isinstance(lst, list):
            out.extend(lst)
        elif lst:
            out.append(lst)
    return out


def main():
    strict = "--strict" in sys.argv
    errors, warnings = [], []
    try:
        db = json.loads(DATA.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        print(f"FEHLER: {DATA} ist kein gueltiges JSON: {exc}")
        return 1

    names = defaultdict(int)
    for i, e in enumerate(db):
        tag = f"[{i}] {e.get('n', '?')}"
        names[e.get("n")] += 1
        for k in REQUIRED:
            if k not in e:
                errors.append(f"{tag}: Pflichtfeld '{k}' fehlt")
        if e.get("g") not in GROUPS:
            errors.append(f"{tag}: unbekannte Gruppe '{e.get('g')}'")
        for k, allowed in IMPL.items():
            v = e.get("impl", {}).get(k)
            if v not in allowed:
                warnings.append(f"{tag}: impl.{k}='{v}' (erlaubt: {sorted(allowed)})")
        if e.get("ev") not in EV:
            errors.append(f"{tag}: unbekanntes Evidenz-Label '{e.get('ev')}'")
        if set(e.get("pig", {}).keys()) != PIG_KEYS:
            errors.append(f"{tag}: pig-Schluessel weichen ab: {sorted(e.get('pig', {}).keys())}")
        for key in ("f", "a", "o"):
            for item in e.get(key, []):
                if not (isinstance(item, list) and len(item) == 2 and all(isinstance(x, str) for x in item)):
                    errors.append(f"{tag}: '{key}' enthaelt kein [Wirkstoff, Dosis]-Paar: {item!r}")
        texts = all_texts(e)
        if any("</script" in t.lower() for t in texts):
            errors.append(f"{tag}: Text enthaelt '</script' (wuerde das HTML zerbrechen)")

        # --- inhaltliche Plausibilitaet (Warnungen) ---
        for t in e["pig"].get("surg", []) + e["pig"].get("extra", []):
            if re.search(r"(Suppression|Unterdrückung)", t, re.I) and re.search(r"\+\s*Rifampicin", t):
                warnings.append(f"{tag}: Rifampicin in Langzeitsuppression: '{t}'")
        if e.get("impl", {}).get("pji") == "ja":
            for t in e["pig"].get("dur", []):
                if re.search(r"3-6 Monate|Schulter", t) and e["g"] == "Gram-positiv" and "Staph" in e["n"]:
                    warnings.append(f"{tag}: Staphylokokken-Dauer weicht von PIF v11 (12 Wochen) ab: '{t}'")

    for n, k in names.items():
        if k > 1:
            errors.append(f"Name doppelt: {n} ({k}x)")

    # Dosis-Konsistenz TMP/SMX in den PJI-Oralschemata der Staphylokokken
    # (andere Erreger, z. B. S. maltophilia, haben bewusst eigene Dosierungen)
    tmp = defaultdict(list)
    for e in db:
        if not (e["n"].startswith("Staphylococcus") or "CoNS" in e["n"]):
            continue
        for t in e["pig"].get("oral", []):
            if re.search(r"TMP/SMX|Cotrimoxazol", t):
                m = re.search(r"(?:TMP/SMX|Cotrimoxazol)\s*(\d[\d/]*\s*(?:DS|mg)[^,;)+]*?(?:alle \d+ h|\dx/d))", t)
                if m:
                    tmp[m.group(1)].append(e["n"])
    if len(tmp) > 1:
        lines = "; ".join(f"'{k}' ({len(v)}x)" for k, v in tmp.items())
        warnings.append(f"TMP/SMX-Dosis in PJI-Oralschemata uneinheitlich: {lines}")

    for w in warnings:
        print("WARNUNG:", w)
    for er in errors:
        print("FEHLER: ", er)
    print(f"\n{len(db)} Eintraege geprueft – {len(errors)} Fehler, {len(warnings)} Warnungen.")
    if errors or (strict and warnings):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
