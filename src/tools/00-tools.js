/* ---------- Tools-Tab: Register, Übersicht, Werkzeugseiten, Info-Seite ---------- */
/* Jedes Werkzeug: regTool({id, grp:'dx'|'med', t:Titel, s:Untertitel, ic:SVG-Pfad, c:Farbe,
   dom:Element-ID, render:Funktion, src:Quellenzeile, oninput:optional}).
   Klicks auf [data-k] innerhalb eines Werkzeugs gehen an TOOLKEY[k](wert, button). */
var TOOLS=[],TOOLKEY={},CURTOOL=null;
function regTool(o){TOOLS.push(o);}
var TGROUPS=[['dx','Diagnose & Strategie'],['med','Medikation']];
var PRINZ=[
  ['Sensibler Erreger','Beta-Laktam der 1. Wahl.'],
  ['MRSA / MRSE','Vancomycin (AUC 400–600 mg·h/L) oder Daptomycin.'],
  ['Rifampicin – wann, wann nicht','Nur bei Staphylokokken und Cutibacterium (dort PIF-Empfehlung, Evidenz schwach). Immer kombiniert, nie Monotherapie, erst ab trockener Wunde bzw. gezogenen Drainagen; beim zweizeitigen Wechsel erst nach Wiederaufbau der Prothese. >75 J.: 2×300 mg. Nicht in der Langzeitsuppression.'],
  ['Gramnegative mit Biofilm','Ciprofloxacin ist der orale Biofilm-Partner, nicht Rifampicin.'],
  ['Oraler Switch','Nur nach dokumentierter Sensibilität; sonst i.v. fortführen oder Suppression.']
];
function toolIcon(t){return '<span class="tl-ic" style="background:'+t.c+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+t.ic+'</svg></span>';}
function tools(){LAST=tools;CURTOOL=null;setActiveTab('Tools');go('#/tools');
  var h='<div class="pg-h"><div class="pg-t">Tools</div><div class="pg-s">Entscheidungshilfen am Bett</div></div>';
  TGROUPS.forEach(function(g){var ts=TOOLS.filter(function(t){return t.grp===g[0];});if(!ts.length)return;
    h+='<div class="recent-h tl-gh">'+g[1]+'</div><div class="tl-grid">'+ts.map(function(t){
      return '<button class="tl-tile" data-tool="'+t.id+'">'+toolIcon(t)+'<span class="tl-n">'+esc(t.t)+'</span><span class="tl-s">'+esc(t.s)+'</span></button>';}).join('')+'</div>';});
  h+='<div class="recent-h tl-gh">Therapieprinzipien</div><div class="acc">'+PRINZ.map(function(p){
    return '<details><summary>'+esc(p[0])+'</summary><div class="acc-b">'+esc(p[1])+'</div></details>';}).join('')+'</div>';
  h+='<div class="tl-foot">Legende, Abweichungen von den Pocket Guides und Evidenz-Updates stehen unter <button class="lnk" id="toInfo">Info</button>.</div>';
  var v=document.getElementById('view');v.innerHTML=h;
  v.querySelectorAll('.tl-tile').forEach(function(b){b.addEventListener('click',function(){tool(b.dataset.tool);});});
  var ti=document.getElementById('toInfo');if(ti)ti.addEventListener('click',info);
}
function tool(id){var t=TOOLS.filter(function(x){return x.id===id;})[0];if(!t){tools();return;}
  LAST=function(){tool(id);};CURTOOL=t;setActiveTab('Tools');go('#/tools/'+id);
  var h='<div class="navbar"><button class="backBtn" id="backBtn" aria-label="Zurück"><svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2L2 10l8 8"/></svg>Tools</button><span></span></div>'
   +'<div class="pg-h tl-ph">'+toolIcon(t)+'<div><div class="pg-t sm">'+esc(t.t)+'</div><div class="pg-s">'+esc(t.s)+'</div></div></div>'
   +'<div class="logic"><div class="dx" id="'+t.dom+'"></div></div>'
   +(t.src?'<div class="tl-src">Quelle: '+t.src+'</div>':'');
  document.getElementById('view').innerHTML=h;
  document.getElementById('backBtn').addEventListener('click',function(){if(NAVDEPTH>0)history.back();else tools();});
  t.render();window.scrollTo(0,0);
}
(function(){var v=document.getElementById('view');
  v.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('.dx [data-k]');if(!b||!CURTOOL)return;
    var f=TOOLKEY[b.getAttribute('data-k')];if(f)f(b.getAttribute('data-v'),b);});
  v.addEventListener('input',function(ev){var t=ev.target;if(!CURTOOL||!CURTOOL.oninput||!t.classList||!t.classList.contains('dxin'))return;CURTOOL.oninput(t);});
})();
function info(){LAST=info;CURTOOL=null;setActiveTab('Info');go('#/info');
  var h='<div class="pg-h"><div class="pg-t">Info</div><div class="pg-s">Version {{VERSION}}</div></div>'
   +'<div class="infocard"><div class="modal-logo">Antibiotika Referenz Index – Orthopädie (AbRIO)</div>'
   +'<p class="modal-copy">© 2026 Dr. Raouf Mehrabi — Alle Rechte vorbehalten.</p>'
   +'<p>Konzept, Idee, Aufbau und Inhalt dieser Anwendung sind geistiges Eigentum von Dr. Raouf Mehrabi. Die App und die ihr zugrunde liegende Idee dürfen ohne ausdrückliche schriftliche Genehmigung des Inhabers nicht kopiert, vervielfältigt, weitergegeben, veröffentlicht oder kommerziell genutzt werden.</p>'
   +'<p class="modal-dis">Nur für medizinisches Fachpersonal. Standarddosen gelten für Erwachsene mit normaler Nieren- und Leberfunktion; mit »Niere« gekennzeichnete Substanzen sind nach Nierenfunktion (GFR/CrCl) anzupassen. Lokale Resistenzraten und Infektiologiekonsil beachten. Diese Referenz ersetzt keine klinische Einzelfallentscheidung.</p>'
   +'<p class="modal-src">Datengrundlage: Pro-Implant Foundation · EBJIS · EUCAST v16.1 · PEG · Datenstand 10/2026 (Basis PIF v11 + Literatur-Update) · offline lauffähig</p></div>'
   +'<div class="logic">'
   +'<h4>Implantat-Chips lesen</h4>'
   +'<div class="ln"><b>PJI</b> — klinische Relevanz als Protheseninfekt-Erreger.</div>'
   +'<div class="ln"><b>DAIR</b> — biofilmtherapeutische Aussicht bei Implantaterhalt. <b>DTT</b> = difficult-to-treat, kein verlässlicher oraler biofilmaktiver Partner. Klinische DAIR-Kriterien (Symptome &lt;3–4 Wo., stabiles Implantat, kein Fistelgang) müssen zusätzlich erfüllt sein.</div>'
   +'<div class="ln"><b>Rifampicin</b> — Biofilm-Zusatznutzen: ja / bedingt / nein.</div>'
   +'<div class="ln"><b>Evidenz-Badge</b> — PIF-Protokoll (verifiziert) → Leitlinie → Fallserien → Fallbericht. <b style="color:var(--bad)">Entwurf</b> = noch nicht am PIF-Original geprüft.</div>'
   +'<h4>Abweichungen von den Pocket Guides</h4>'
   +'<div class="ln"><b>Vancomycin</b> — hier AUC-Monitoring (400–600 mg·h/L, IDSA/ASHP 2020); die Pocket Guides nennen noch Talspiegel 15–20 µg/ml. Bewusste Modernisierung.</div>'
   +'<div class="ln"><b>Penicillin G → Ampicillin/Sulbactam</b> — bei fehlender Verfügbarkeit klinisch gleichwertig für Streptokokken, Cutibacterium und grampositive Anaerobier.</div>'
   +'<div class="ln"><b>Rifampicin-Timing</b> — das PIF-Dogma (Tag 2–7, trockene Wunde) bleibt Standard. Kohorte 2024 (n=103) fand keine Timing-Outcome-Korrelation; RCTs laufen.</div>'
   +'<div class="ln"><b>PJI-Diagnose</b> — PIF v11 verwendet modifizierte EBJIS-Kriterien (wahrscheinlich ab ≥2 Kriterien inkl. Klinik + CRP); die App rechnet nach dem EBJIS-Original und zeigt die PIF-Einstufung als Zusatz.</div>'+'<div class="ln"><b>Problemerreger (PIF v11)</b> — nur Rifampicin-resistente Staphylokokken, Ciprofloxacin-resistente Gramnegative und Candida. Enterokokken und Streptokokken zählen nicht dazu.</div>'+'<h4>Evidenz-Updates (Stand 10/2026)</h4>'+'<div class="ln"><b>EUCAST v16 (ab 01/2026, aktuell v16.1)</b> — Cotrimoxazol-Breakpoint für Staphylokokken auf S ≤0,5 / R >0,5 mg/L gesenkt (vorher 2/4): mehr Isolate werden R, Oral-Switch mit Cotrimoxazol am aktuellen Antibiogramm prüfen. Cefoxitin-negative Staphylokokken: Cefazolin/Ceftriaxon & Co. werden als I (erhöhte Exposition) berichtet, also hoch dosieren; oral auf ausreichende Exposition achten. Daptomycin: Breakpoint nur für S. aureus. Angekündigt: Konsultationen zu Carbapenem- und Fluorchinolon-Breakpoints.</div>'+'<div class="ln"><b>ICM 2025</b> — der Konsens (J Arthroplasty 2026) setzt mindestens 12 Wochen Antibiose nach DAIR bei akuter PJI fest, deckungsgleich mit PIF v11.</div>'+'<div class="ln"><b>Therapiedauer</b> — 12 statt 6 Wochen: Nichtunterlegenheit von 6 Wochen nicht gezeigt, mehr persistierende Infektionen (DATIPO, NEJM 2021). Die 3-Monats-Angaben bleiben Standard.</div>'+'<div class="ln"><b>Oraler Switch</b> — früher Wechsel auf oral bei gut bioverfügbarer, wirksamer Substanz gleichwertig (OVIVA, NEJM 2019).</div>'+'<div class="ln"><b>Lokale Antibiotikaträger</b> — mit implantiertem, zugelassenem Träger war ≤7 Tage systemische Therapie nichtunterlegen gegenüber ≥4 Wochen (Versagen 11,1 % vs. 14,1 %), bei deutlich weniger Nebenwirkungen (SOLARIO, NEJM 09/2026). Überwiegend Osteomyelitis/FRI mit Calciumsulfat-Trägern; PMMA/Spacer nur ~14 % – Spannungsfeld zu DATIPO und ICM 2025 (≥12 Wochen nach DAIR). Gilt NICHT für DAIR und nur bei Erregern, die gegen den lokalen Wirkstoff sensibel sind.</div>'+'<div class="ln"><b>Ein- vs. zweizeitiger Wechsel</b> — einzeitig nichtunterlegen (2 J.: 97 % vs. 91 %) bei chronischer PJI nach Primärprothese, bekanntem Erreger, ohne Immunsuppression (Fehring et al., JBJS 2026; 97 % vs. 91 % nach 2 Jahren). Einträge mit »Zwei-Stufen-Wechsel bevorzugt« in diesem Licht lesen.</div>'+'<div class="ln"><b>Antibiotikapause vor Reimplantation</b> — kein belegter Vorteil, verlängert aber das Intervall (Scoping-Review, JBJS 2025).</div>'+'<div class="ln"><b>Rifampicin bei Staphylokokken</b> — Standard, aber auf Beobachtungsdaten gestützt. Laufende RCTs: RiCOTTA (Monotherapie vs. Rifampicin-Kombination nach DAIR), ROADMAP (Rifampicin-Domäne), RIFAMAB (Rifabutin vs. Rifampicin).</div>'+'<div class="ln"><b>Dalbavancin</b> — bei komplizierter S.-aureus-Bakteriämie nicht überlegen (DOTS, JAMA 2025; retiniertes Fremdmaterial ausgeschlossen). Bei PJI nur Beobachtungsdaten, v.a. Suppression.</div>'
   +'</div>';
  document.getElementById('view').innerHTML=h;window.scrollTo(0,0);
}
