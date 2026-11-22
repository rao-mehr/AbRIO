# Meldepflicht ❗, Syndrom-Dauern, neue Einträge (Stand 23.11.2026)

## Meldepflicht (Feld `mp` in `data/erreger.json`)
`mp: {"s": "ja" | "bedingt", "t": "<Rechtsgrundlage und Frist>"}` – nur bei Erregern, die in Österreich gelistet sind.
- **ja** (roter Kreis ❗): namentlich gelistet.
- **bedingt** (orange Umrandung): nur unter einer Bedingung (z. B. nur invasive Erkrankung) oder nicht namentlich gelistet – Zuordnung prüfen.
- Angezeigt im Erregerkopf (Banner mit Rechtsgrundlage), in Filterliste und Suche; Filter „Meldepflicht“ unter „Weitere“.

**Quelle:** RIS (ris.bka.gv.at), Fassung vom 23.11.2026 – EpiG 1950 §1 Abs. 1 Z 1/Z 2 und §2 (24 h), Verordnung „Anzeigepflichtige übertragbare Krankheiten 2020“, Tuberkulosegesetz §3/§5 (3 Tage), Geschlechtskrankheitengesetz §4 (beschränkte Meldepflicht, keine Frist). Ohne Rechtsgewähr; Erläuterungen/Epidemiologie-Leitfäden wurden nicht gelesen.

**Abweichungen von der Vorarbeit (Tabelle `AbRIO_Abgleich_Buch.xlsx`)**, weil der Gesetzestext es anders sagt:
- Tetanus und Q-Fieber (Coxiella) sind **nicht** gelistet → kein Marker.
- Echinococcus (granulosus/multilocularis) ist **gelistet** (Z 1) → „ja“ statt „bedingt“.
- Rickettsien nur Fleckfieber (R. prowazekii); Listeriose, Botulismus, Salmonellose nur über „bakterielle Lebensmittelvergiftung“ → „bedingt“.
- Pneumokokken/H. influenzae nur als „invasive bakterielle Erkrankung (Meningitis/Sepsis)“ → „bedingt“; Meningokokken ebenso, dort aber „ja“.
- C. difficile nur „schwere Erkrankungen“ → „bedingt“. Shigellose als „übertragbare Ruhr“ → „ja“.
- Nicht gelistet (kein Marker): Melioidose, Chlamydia trachomatis (nur LGV über GeschlKrG), Campylobacter, Yersiniose, Lyme, MRSA/ESBL/VRE/Candida auris.

## Datenkorrekturen (gegen das Lehrbuch geprüft)
Die Tabellennummern der Vorarbeit (11.7, 16.8, 18.8, 21.4) stimmten nur teilweise; maßgeblich sind: erregerspezifische PJI-Tabelle = 11.13, Problemkeime = 11.14, zoonotische/seltene Erreger = 15.6, septische Arthritis = 16.8, FRI = 18.8, Spondylodiszitis = 21.4.
- *C. acnes*: Metronidazol war bereits entfernt; ergänzt: Fosfomycin ungeeignet.
- *C. striatum*: Daptomycin aus den Alternativen entfernt (Resistenz unter Therapie bei 85,7 %), Dalbavancin ergänzt; Ciprofloxacin/Tetracyclin/Doxycyclin durchgehend resistent.
- *Kingella kingae*: PJI „ja“ → „selten“; Warnung, dass Erwachsenendosen nicht auf Kinder gelten; Kocher-Kriterien unzuverlässig. **Pädiatrische Dosen sind bewusst nicht eingetragen** (im Buch nicht vorhanden).
- *Tropheryma whipplei*: PJI „nein“ → „selten“, DAIR möglich (Cotrimoxazol/Pristinamycin, Suppression).
- *Pasteurella*: DAIR bei früher Diagnose oft möglich (Buch 15.6).
- *Yersinia enterocolitica*: Cefuroxim und PJI-Risikofaktoren ergänzt.
- *Viridans-/Milleri-Streptokokken*: Dauer nach Syndrom getrennt (Endokarditis nur bei Endokarditis).
- **PJI-Dauer vereinheitlicht** auf „12 Wochen (PIF v11)“ (vorher „3 Mo.“/„3-6 Mo.“) bei PIF-abgedeckten Gruppen. Die Vorarbeit schlug „6 Mo. bei anderen Gelenken“ vor – das ist nicht PIF v11 (12 Wochen gelten für alle Gelenke) und wurde nicht übernommen. VRE: Entfernung oder Suppression.
- Spondylodiszitis „6-12 Wo.“ → 6 Wochen nativ (DTS/SPILF 2022), 12 Wochen bei Implantat, länger bei Risikofaktoren.
- Ceftriaxon: Die Dosen sind indikationsspezifisch gewollt (Staphylokokken 2 g alle 12 h wegen EUCAST „I“, sonst 2 g 1×/d) – keine Änderung.

## Syndrom-Dauern (`syn.FRI`, `syn.SA`, `syn.SI`)
Nur für Standard-Eitererreger (Staphylokokken, Streptokokken, E. faecalis, Enterobacterales, Pseudomonas/Acinetobacter, C. acnes; SA zusätzlich Candida), soweit noch nicht vorhanden:
- FRI: 12 Wochen bei Erhalt/Wechsel, 6 Wochen nach Entfernung (AO/EBJIS, PIF FRI v4) – Buch 18.8.
- SA nativ: Tab. 16.8 (Staph./Enterokokken/Gramnegative 4 Wo.; Streptokokken 1–2 Wo.; Candida 6 Wo.).
- SI: 6 Wochen nativ, 12 Wochen mit Implantat (Buch 21.4).
Der Zeitbalken im Erregerkopf nutzt jetzt die syndromspezifische Dauer.
**Noch offen:** Die Wirkstoff-Linien (1. Linie, Alternativen, Oral) sind weiterhin für alle Syndrome gleich; syndromspezifische Wirkstoffe stehen nur im PIF-Block und im Hinweis „Für diesen Erreger“.

## Neue Einträge
| Eintrag | Evidenz-Label | Quelle |
|---|---|---|
| Kulturnegative Infektion (neue Gruppe „Kulturnegativ“) | PIF | PIF v11 (Lehrbuch Tab. 11.13), SA v2 (Tab. 16.8), FRI v4 |
| Echinococcus spp. | Fallbericht | Lehrbuch 15.6; EpiG |
| Candida parapsilosis (aus „Candida non-albicans“ ausgegliedert) | **Entwurf** | PIF v11 Candida-Zeile, ECMM/ISHAM/ASM 2025 (Buch 11.13) |
| Burkholderia mallei (Rotz) | **Entwurf** | in Analogie zu B. pseudomallei, EpiG |
| Yersinia pestis (Pest) | **Entwurf** | gängige Pest-Regime, EpiG |
| Corynebacterium diphtheriae | **Entwurf** | EpiG; Dosen nach Antibiogramm |
„Entwurf“ heißt: nicht am Original geprüft – vor Weitergabe an Kollegen gegen Primärquellen lesen. S. argenteus war bereits im Bestand.

## Oberfläche
Erregerkopf: „Auf einen Blick“ (1. Wahl, Oral, Rifampicin, DAIR, Dauer), farbige Linien („1. LINIE · I.V.“, „2. LINIE“, „ORAL · STEP-DOWN“), CAVE rot, Rifampicin-Hinweis gelb. Einklappbar: Therapiedauer (zu), Abklärung (offen, sicherheitsrelevant), Lokale Antibiotika (zu).
