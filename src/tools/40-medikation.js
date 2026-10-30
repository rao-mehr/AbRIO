/* ---------- Medikation: Rifampicin-Interaktionen, Monitoring unter Langzeittherapie ---------- */
/* Rifampicin ist starker Induktor von CYP3A4, CYP2C9/2C19, P-gp und UGT. */
var RIX=[
  ['doak','DOAKs (Apixaban, Rivaroxaban, Edoxaban, Dabigatran)','bad','Spiegel stark gesenkt – Kombination meiden. Für die Dauer der Rifampicin-Therapie auf NMH umstellen.'],
  ['vka','Vitamin-K-Antagonisten (Phenprocoumon, Warfarin)','bad','Wirkung stark abgeschwächt, meist deutliche Dosissteigerung nötig. INR engmaschig. Nach Absetzen von Rifampicin INR-Anstieg – Dosis wieder senken.'],
  ['tx','Tacrolimus, Ciclosporin, Everolimus, Sirolimus','bad','Spiegel fallen massiv – Abstoßungsgefahr. Nur mit Transplantationszentrum; Rifabutin oder Verzicht erwägen.'],
  ['azol','Voriconazol, Posaconazol, Isavuconazol','bad','Kontraindiziert (Spiegel nicht therapeutisch). Fluconazol-Spiegel ebenfalls gesenkt.'],
  ['hiv','HIV-Therapie (Proteasehemmer, viele NNRTI/Integrasehemmer)','bad','Meist kontraindiziert – HIV-Behandler einbinden.'],
  ['ctr','Hormonelle Kontrazeption (Pille, Pflaster, Ring, Implantat)','bad','Unwirksam. Barrieremethode oder Kupferspirale bis 4 Wochen nach Rifampicin-Ende.'],
  ['opi','Opioide (Oxycodon, Fentanyl, Methadon, Tramadol, Morphin)','mid','Wirkverlust bis Entzug. Schmerzkontrolle prüfen, Dosis titrieren; nach Absetzen Überdosierungsgefahr.'],
  ['ster','Kortikosteroide (Prednisolon, Dexamethason, Hydrocortison)','mid','Wirkung etwa halbiert – Dosis anpassen; bei Substitution (Addison) Krisengefahr.'],
  ['aep','Antiepileptika (Lamotrigin, Valproat, Phenytoin, Carbamazepin)','mid','Spiegel sinken – Anfallsgefahr. Spiegel kontrollieren, Neurologie einbinden.'],
  ['stat','Statine (Simvastatin, Atorvastatin)','mid','Wirkung deutlich reduziert. Für die Therapiedauer meist tolerierbar; ggf. Rosuvastatin/Pravastatin.'],
  ['kv','Kalziumantagonisten, Betablocker (Amlodipin, Nifedipin, Verapamil, Metoprolol)','mid','Blutdruck/Frequenz entgleisen möglich – RR und Puls kontrollieren.'],
  ['dm','Orale Antidiabetika (Sulfonylharnstoffe, Repaglinid)','mid','Blutzucker steigt – BZ engmaschiger, nach Absetzen Hypoglykämiegefahr.'],
  ['psy','Antidepressiva/Antipsychotika (Sertralin, Quetiapin, Haloperidol, Aripiprazol)','mid','Wirkverlust möglich – Psychiatrie bzw. Spiegel bei Bedarf.'],
  ['thy','Levothyroxin','mid','Bedarf kann steigen – TSH nach 4–6 Wochen.'],
  ['ab','Antibiotika-Partner: Clindamycin, Linezolid, Doxycyclin, Cotrimoxazol','mid','Spiegel gesenkt, bei Clindamycin und Linezolid deutlich. Linezolid + Rifampicin nicht PIF-Standard; bei Clindamycin keine verlässliche Kombination.']
];
var RIS={};
function renderRif(){var el=document.getElementById('dxRi');if(!el)return;
  var h='<div class="dxq">Komedikation des Patienten antippen:</div><div class="dxchips dxcol">'
    +RIX.map(function(x){var on=!!RIS[x[0]];return '<button class="dxchk'+(on?' on':'')+'" data-k="ri" data-v="'+x[0]+'" aria-pressed="'+on+'"><span class="dxbox">'+(on?'✓':'')+'</span>'+x[1]+'</button>';}).join('')+'</div>';
  var sel=RIX.filter(function(x){return RIS[x[0]];});
  h+='<div class="dxres">';
  if(!sel.length)h+='<div class="dxnote">Keine Komedikation gewählt.</div>';
  else{var bad=sel.filter(function(x){return x[2]==='bad';}).length;
    h+='<div class="dxverdict" style="background:'+(bad?'var(--bad)':'var(--mid)')+'">'+(bad?bad+'× Kombination meiden / umstellen':'Anpassung und Kontrolle nötig')+'</div>'
     +sel.map(function(x){return dxRow(x[1],x[2],x[3]);}).join('');}
  h+='<div class="dxnote"><b>Zeitverlauf:</b> Induktion beginnt nach wenigen Tagen, ist nach 1–2 Wochen maximal und klingt nach dem Absetzen über etwa 2 Wochen ab – in dieser Phase Dosierungen wieder zurücknehmen.</div>'
    +'<div class="dxnote"><b>Rifabutin</b> induziert schwächer und ist bei kritischen Interaktionen eine Option (Vergleichsstudie RIFAMAB läuft) – nur nach Infektiologie.</div>'
    +'<div class="dxnote">Außerdem: Orangefärbung von Urin, Tränen und weichen Kontaktlinsen; Hepatotoxizität. Liste nicht vollständig – im Zweifel Interaktionscheck/Fachinformation und klinische Pharmazie.</div></div>';
  el.innerHTML=h;}
TOOLKEY.ri=function(v){RIS[v]=!RIS[v];renderRif();};

var MON=[
  ['rif','Rifampicin',['Leberwerte (ALT, Bilirubin) vor Beginn, nach 2 Wochen, dann alle 2–4 Wochen','Interaktionen der Komedikation prüfen (Tool „Rifampicin-Interaktionen“)']],
  ['lin','Linezolid',['Blutbild wöchentlich (Thrombozytopenie, Anämie)','Maximal 4 Wochen (PIF v11); danach periphere und Optikus-Neuropathie','Laktatazidose; Serotonin-Syndrom mit SSRI/SNRI']],
  ['tmp','Cotrimoxazol',['Kalium und Kreatinin wöchentlich – Hyperkaliämie, v. a. mit ACE-Hemmer/Sartan/Spironolacton','Kreatinin-Anstieg durch gehemmte tubuläre Sekretion ohne echten GFR-Verlust möglich','Blutbild (Zytopenie, Folsäuremangel); Exanthem → sofort absetzen (SJS-Risiko)']],
  ['fq','Levofloxacin / Ciprofloxacin',['EKG (QTc) bei Risikofaktoren oder QT-verlängernder Komedikation','Sehnenbeschwerden (Risiko: >60 J., Kortikosteroide) → absetzen','Blutzucker-Entgleisung, Delir bei Älteren; Warnhinweis Aortenaneurysma']],
  ['dap','Daptomycin',['CK wöchentlich, häufiger mit Statin (Statin pausieren erwägen)','Eosinophile Pneumonie: neuer Husten/Fieber/Infiltrat']],
  ['van','Vancomycin',['AUC-gesteuert (Ziel 400–600 mg·h/l) oder Talspiegel','Kreatinin 2–3× pro Woche; Nephrotoxizität v. a. mit Piperacillin/Tazobactam']],
  ['gen','Gentamicin',['Talspiegel vor der nächsten Gabe <1 mg/l (Einmaldosierung)','Kreatinin; bei längerer Gabe Gehör/Gleichgewicht']],
  ['flu','Flucloxacillin (hochdosiert)',['Leberwerte (cholestatische Hepatitis, auch verzögert)','Blutbild nach >2 Wochen (Neutropenie)','Mit Paracetamol: metabolische Azidose mit hoher Anionenlücke (Pyroglutaminsäure)']],
  ['fos','Fosfomycin i.v.',['Natrium (Hypernatriämie, hohe Natriumlast) und Kalium (Hypokaliämie)']],
  ['cli','Clindamycin',['Diarrhö → C.-difficile-Diagnostik']]
];
var MOS={};
function renderMon(){var el=document.getElementById('dxMo');if(!el)return;
  var h='<div class="dxq">Laufende Antibiotika antippen:</div><div class="dxchips">'
    +MON.map(function(m){return dxChip('mo',m[0],m[1],!!MOS[m[0]]);}).join('')+'</div>';
  var sel=MON.filter(function(m){return MOS[m[0]];});
  h+='<div class="dxres"><div class="dxsec">Basis bei jeder Langzeittherapie</div><ul class="dxwhy"><li>Blutbild, Kreatinin, Elektrolyte, Leberwerte und CRP wöchentlich, solange i.v. bzw. in den ersten Wochen oral</li><li>Wunde, Klinik, Adhärenz; Nebenwirkungen aktiv abfragen</li></ul>';
  sel.forEach(function(m){h+='<div class="dxsec">'+esc(m[1])+'</div><ul class="dxwhy">'+m[2].map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>';});
  if(!sel.length)h+='<div class="dxnote">Substanz antippen für die spezifischen Kontrollen.</div>';
  h+='<div class="dxnote">Übersicht für den Alltag, ersetzt nicht die Fachinformation. Dosisanpassung an die Nierenfunktion: Tool „Kreatinin-Clearance“.</div></div>';
  el.innerHTML=h;}
TOOLKEY.mo=function(v){MOS[v]=!MOS[v];renderMon();};

regTool({id:'rif-ia',grp:'med',t:'Rifampicin-Interaktionen',s:'Komedikation prüfen',c:'#FF6B22',dom:'dxRi',render:renderRif,
  src:'Fachinformation Rifampicin · Interaktionsprofil starker CYP3A4/P-gp-Induktoren',
  ic:'<circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/>'});
regTool({id:'monitor',grp:'med',t:'Monitoring',s:'Labor unter Langzeittherapie',c:'var(--pi)',dom:'dxMo',render:renderMon,
  src:'Fachinformationen · IDSA-OPAT-Leitlinie 2018 · Vancomycin-Konsensus ASHP/IDSA 2020 · PIF v11 (Linezolid max. 4 Wochen)',
  ic:'<path d="M3 12h4l3-7 4 14 3-7h4"/>'});
