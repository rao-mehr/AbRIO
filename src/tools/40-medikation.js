/* ---------- Medikation: Rifampicin-Interaktionen, Monitoring unter Langzeittherapie ---------- */
/* Rifampicin ist starker Induktor von CYP3A4, CYP2C9/2C19, P-gp und UGT. */
var RIX=[
  ['hiv','HIV-Therapie: Proteasehemmer, Doravirin, Etravirin, Nevirapin, Rilpivirin, Bictegravir, Cabotegravir, Cobicistat, Lenacapavir','ki','Kontraindiziert laut Fachinformation. Efavirenz, Dolutegravir, Raltegravir nur mit Dosisanpassung – HIV-Behandler einbinden.'],
  ['azol','Azol-Antimykotika','ki','Voriconazol kontraindiziert. Itraconazol/Ketoconazol nicht empfohlen. Fluconazol: laut FI alternatives Antimykotikum verwenden. Posaconazol/Isavuconazol nicht in der FI-Tabelle, gleiches Prinzip.'],
  ['doak','DOAKs (Apixaban, Rivaroxaban, Dabigatran, Edoxaban)','bad','Gleichzeitige Gabe nicht empfohlen (FI). Für die Dauer der Rifampicin-Therapie auf NMH umstellen. Edoxaban nicht in der FI-Tabelle, gleiches Prinzip.'],
  ['vka','Vitamin-K-Antagonisten (Phenprocoumon, Warfarin)','bad','Sollte vermieden werden (FI). Wenn unumgänglich: INR engmaschig, v. a. bei Beginn und nach Ende – nach Absetzen INR-Anstieg.'],
  ['tx','Tacrolimus, Ciclosporin, Everolimus, Sirolimus, Mycophenolat, Azathioprin','bad','Nicht empfohlen – Risiko der Transplantatabstoßung. Wenn nötig nur mit Spiegeln und Transplantationszentrum.'],
  ['ctr','Hormonelle Kontrazeption (Pille, Pflaster, Ring, Implantat)','bad','Unwirksam. Zusätzlich nicht-hormonelle Verhütung während und bis 28 Tage nach Rifampicin-Ende (FSRH 2022).'],
  ['cefa','Cefazolin und Cephalosporine mit MTT-Seitenkette','mid','FI: gleichzeitige Gabe sollte vermieden werden (Vitamin-K-abhängige Gerinnungsstörung). In der PIF-Kombination Cefazolin + Rifampicin üblich – dann Gerinnung (Quick/INR) kontrollieren, ggf. Vitamin K.'],
  ['para','Paracetamol','mid','FI: nicht empfohlen, Hepatotoxizitätsrisiko erhöht. Möglichst niedrig dosieren und Leberwerte kontrollieren.'],
  ['stat','Statine','mid','Simvastatin nicht empfohlen (AUC −87 %). Atorvastatin, Fluvastatin, Pravastatin: Wirkverlust möglich; Atorvastatin zeitgleich mit Rifampicin einnehmen.'],
  ['opi','Opioide (Morphin, Fentanyl, Buprenorphin, Methadon, Codein)','mid','Wirkverlust bis Entzug – eng überwachen, Dosis titrieren; nach Absetzen Überdosierungsgefahr. Oxycodon/Tramadol nicht in der FI-Tabelle, ebenfalls Wirkverlust zu erwarten.'],
  ['ster','Glukokortikoide','mid','Wirkung abgeschwächt – Dosisanpassung bei Beginn und Ende; bei Substitution (Addison) Krisengefahr.'],
  ['aep','Antiepileptika (Carbamazepin, Phenytoin, Valproat, Lamotrigin)','mid','Spiegel sinken – Spiegel/enge Überwachung, ggf. Dosiserhöhung; Neurologie einbinden.'],
  ['kv','Kalziumantagonisten, Betablocker','mid','Wirkverlust – RR und Puls kontrollieren; nach Absetzen erneut anpassen.'],
  ['dm','Antidiabetika (Sulfonylharnstoffe, Glinide, DPP-4-Hemmer, Insulin, Metformin)','mid','BZ engmaschiger; nach Absetzen Hypoglykämiegefahr.'],
  ['psy','Antidepressiva/Antipsychotika (Sertralin, Citalopram, Mirtazapin, TZA, Quetiapin, Clozapin, Haloperidol, Risperidon)','mid','Wirkverlust – klinischer Status bzw. Spiegel.'],
  ['thy','Levothyroxin','mid','TSH-Kontrolle, Anpassung bei Beginn und Ende.'],
  ['ab','Antibiotika-Partner','mid','Clarithromycin/Azithromycin nicht empfohlen. Doxycyclin: Dosiserhöhung nötig. Linezolid: Wirkverlust möglich. Cotrimoxazol erhöht den Rifampicin-Spiegel (Hepatotoxizität, Leberwerte). Ciprofloxacin/Moxifloxacin: keine Anpassung. Clindamycin (nicht in FI): Spiegel deutlich gesenkt.']
];
var RIS={};
function renderRif(){var el=document.getElementById('dxRi');if(!el)return;
  var h='<div class="dxq">Komedikation des Patienten antippen:</div><div class="dxchips dxcol">'
    +RIX.map(function(x){var on=!!RIS[x[0]];return '<button class="dxchk'+(on?' on':'')+'" data-k="ri" data-v="'+x[0]+'" aria-pressed="'+on+'"><span class="dxbox">'+(on?'✓':'')+'</span>'+x[1]+'</button>';}).join('')+'</div>';
  var sel=RIX.filter(function(x){return RIS[x[0]];});
  h+='<div class="dxres">';
  if(!sel.length)h+='<div class="dxnote">Keine Komedikation gewählt.</div>';
  else{var ki=sel.filter(function(x){return x[2]==='ki';}).length,bad=ki+sel.filter(function(x){return x[2]==='bad';}).length;
    h+='<div class="dxverdict" style="background:'+(bad?'var(--bad)':'var(--mid)')+'">'+(ki?ki+'× kontraindiziert':bad?bad+'× nicht empfohlen / umstellen':'Anpassung und Kontrolle nötig')+'</div>'
     +sel.map(function(x){return dxRow(x[1],x[2],x[3]);}).join('');}
  h+='<div class="dxnote"><b>Zeitverlauf:</b> Induktion nach etwa 1 Woche voll ausgeprägt, klingt nach dem Absetzen über etwa 2 (bis 4) Wochen ab. Die FI verlangt Dosisanpassungen bei Beginn und besonders nach Beendigung.</div>'
    +'<div class="dxnote"><b>Rifabutin</b> induziert schwächer und ist bei kritischen Interaktionen eine Option (RCT RIFAMAB rekrutiert, Ergebnisse ausstehend) – nur nach Infektiologie.</div>'
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
  src:'Fachinformation EREMFAT (Stand 02/2026), Abschn. 4.3–4.5 · FSRH CEU Drug Interactions with Hormonal Contraception 2022 · Niemi M et al. Clin Pharmacokinet 2003',
  ic:'<circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/>'});
regTool({id:'monitor',grp:'med',t:'Monitoring',s:'Labor unter Langzeittherapie',c:'var(--pi)',dom:'dxMo',render:renderMon,
  src:'Fachinformationen · IDSA-OPAT-Leitlinie 2018 · Vancomycin-Konsensus ASHP/IDSA 2020 · PIF v11 (Linezolid max. 4 Wochen)',
  ic:'<path d="M3 12h4l3-7 4 14 3-7h4"/>'});
