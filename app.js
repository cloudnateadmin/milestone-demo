'use strict';
/* ============================================================
   MILESTONE — front-end only clinical decision platform mock
   All data below is synthetic / illustrative, not real PHI.
   ============================================================ */

/* ---------------- time helpers ---------------- */
const NOW = new Date();
function hoursAgo(h){ return new Date(NOW.getTime() - h*3600*1000); }
function daysAgo(d){ return hoursAgo(d*24); }
function fmtDateTime(d){
  return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) + ', ' +
         d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
}
function fmtDate(d){ return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function fmtTime(d){ return d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); }
function hoursSince(d){ return (NOW - d)/3600000; }
function calcBSA(heightCm, weightKg){ return Math.sqrt((heightCm*weightKg)/3600); } // Mosteller formula
function daysSince(d){ return hoursSince(d)/24; }
function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function uid(prefix){ return prefix + Math.random().toString(36).slice(2,8); }

/* ---------------- icon set (feather-style, hand-authored) ---------------- */
const ICONS = {
  dashboard:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  triage:'<path d="M3 5h18"/><path d="M6 5v3l5 6v5"/><path d="M18 5v3l-4 4.8"/>',
  cases:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
  assessment:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M9 15h6M9 11.5h3"/>',
  library:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15A2.5 2.5 0 0 0 6.5 23H20"/>',
  pathways:'<circle cx="5" cy="6" r="2.4"/><circle cx="5" cy="18" r="2.4"/><circle cx="19" cy="12" r="2.4"/><path d="M7.2 7l9.6 4M7.2 17l9.6-4"/>',
  program:'<path d="M4 22V4"/><path d="M4 4h13l-3 4 3 4H4"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>',
  phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  chevronDown:'<path d="M6 9l6 6 6-6"/>',
  chevronRight:'<path d="M9 6l6 6-6 6"/>',
  chevronLeft:'<path d="M15 6l-6 6 6 6"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  checkCircle:'<circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.3 2.3L16 9"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 19v3"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  alert:'<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.4-2"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15 14.2c2.6.4 4.5 2.4 4.5 5.8"/>',
  activity:'<path d="M22 12h-4l-3 8-5-16-3 8H2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  trendUp:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  trendDown:'<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  filter:'<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  hospital:'<path d="M4 21V7l8-4 8 4v14"/><path d="M12 3v4M9 21v-6h6v6"/><path d="M9 11h1M14 11h1M9 14h1M14 14h1"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  download:'<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  stetho:'<path d="M5 3v6a4 4 0 0 0 8 0V3"/><path d="M9 13v2a6 6 0 0 0 12 0v-2"/><circle cx="20" cy="10" r="1.5"/>',
  flag:'<path d="M5 3v18"/><path d="M5 4h13l-2.5 4L18 12H5"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
  sun:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/>',
  moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3z"/>',
  network:'<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2V12M12 12L6.4 17.2M12 12l5.6 5.2"/>',
  layers:'<path d="M12 2l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
  shield:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/>',
};
function icon(name, size){
  size = size||18;
  return '<svg class="icon" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||'')+'</svg>';
}

/* ---------------- department color coding ---------------- */
const DEPT = {
  'Medical Oncology': {c:'#b45309', bg:'#fef3e2', dbg:'#2c2311'},
  'Radiology': {c:'#1d4ed8', bg:'#e8f0fe', dbg:'#0f1f3a'},
  'Thoracic Surgery': {c:'#15803d', bg:'#e7f6ec', dbg:'#122a1c'},
  'Surgery': {c:'#15803d', bg:'#e7f6ec', dbg:'#122a1c'},
  'Radiation Oncology': {c:'#6d28d9', bg:'#f1eafe', dbg:'#221a33'},
  'Pathology': {c:'#be123c', bg:'#fde8ee', dbg:'#301620'},
  'Pathology / Molecular': {c:'#a21caf', bg:'#fbe8fb', dbg:'#301530'},
  'Colorectal Surgery': {c:'#15803d', bg:'#e7f6ec', dbg:'#122a1c'},
  'Enterostomal Nurse': {c:'#0f766e', bg:'#e6f5f3', dbg:'#0f2924'},
  'CNS': {c:'#0f766e', bg:'#e6f5f3', dbg:'#0f2924'},
  'Cardiology': {c:'#0e7490', bg:'#e3f6f8', dbg:'#0e2a2d'},
  'Anaesthesia': {c:'#7c3aed', bg:'#f1eafe', dbg:'#221a33'},
  'Nephrology': {c:'#a16207', bg:'#fdf3d8', dbg:'#2c2410'},
  'Pulmonology': {c:'#0891b2', bg:'#e0f7fa', dbg:'#0e2a2d'},
  'ICU': {c:'#dc2626', bg:'#fdecea', dbg:'#301613'},
  'Emergency Medicine': {c:'#dc2626', bg:'#fdecea', dbg:'#301613'},
  'Endocrinology': {c:'#a16207', bg:'#fdf3d8', dbg:'#2c2410'},
  'Nursing': {c:'#0f766e', bg:'#e6f5f3', dbg:'#0f2924'},
  'Palliative Care': {c:'#0f766e', bg:'#e6f5f3', dbg:'#0f2924'},
  'Gynaecologic Oncology': {c:'#a21caf', bg:'#fbe8fb', dbg:'#301530'},
};
function deptColor(name){ return DEPT[name] || {c:'#54655f', bg:'#eef1f0', dbg:'#1c2422'}; }
function deptChip(name){
  const d = deptColor(name);
  return '<span class="chip" style="background:'+d.bg+';color:'+d.c+';border-color:transparent;">'+esc(name)+'</span>';
}
function avatarHtml(initials, dept, sizeClass){
  const d = deptColor(dept);
  return '<div class="avatar '+(sizeClass||'')+'" style="background:'+d.bg+';color:'+d.c+';">'+esc(initials)+'</div>';
}

/* ---------------- tier / status helpers ---------------- */
const TIER_META = {
  1:{label:'Tier 1 · Protocol', badge:'badge-tier1', desc:'Auto-generated guideline plan, single-specialist sign-off, no meeting'},
  2:{label:'Tier 2 · Async', badge:'badge-tier2', desc:'Asynchronous audio/text response within 48–72h'},
  3:{label:'Tier 3 · Synchronous', badge:'badge-tier3', desc:'Short live meeting, complex cases only'},
};
/* override lets a case whose tier was driven by the newer per-node OR-gate schema
   (rather than the app's own 1/2/3 triage scale) show the SAME number and color
   everywhere, instead of the case-level TIER_META label (which uses this app's own
   1/2/3 vocabulary and can read as a different tier, or a different meaning for the
   same number, than what escalated it). */
function tierBadge(tier, override){
  const m = override || TIER_META[tier] || {label:'Tier —', badge:'badge-neutral'};
  return '<span class="badge '+m.badge+'"><span class="badge-dot"></span>'+m.label+'</span>';
}
function statusBadge(status){
  const map = {
    'Pending Triage':'badge-neutral',
    'Awaiting Responses':'badge-info',
    'Decision Locked':'badge-locked',
  };
  return '<span class="badge '+(map[status]||'badge-neutral')+'">'+esc(status)+'</span>';
}

/* ---------------- current user (composer persona) ---------------- */
const ME = {name:'Dr. A. Rao', role:'Medical Oncology', initials:'AR'};

/* ---------------- pathway metadata ---------------- */
const PATHWAY_META = {
  'Oncology MDT': {
    icon:'stetho', title:'Multidisciplinary Care Pathways',
    depts:['Oncology','Radiology','Pathology','Nursing','Palliative Care'],
    desc:'Tumour-board review across the full cancer care journey — from diagnosis to survivorship.'
  },
  'High-Risk Pre-Op': {
    icon:'shield', title:'High-Risk Pre-Op Clearance',
    depts:['Surgery','Anaesthesia','Cardiology','Pulmonology','Nephrology'],
    desc:'Joint clearance review before major surgery in patients with significant comorbidity burden.'
  },
  'Complex Medical': {
    icon:'activity', title:'Complex Medical Decisions',
    depts:['Medicine','Cardiology','Nephrology','Endocrinology','Pharmacy'],
    desc:'Cross-specialty input for medically complex, multi-system inpatients.'
  },
  'Rapid Escalation': {
    icon:'alert', title:'Rapid Escalation Cases',
    depts:['Emergency Medicine','ICU','Surgery','Radiology','Consults'],
    desc:'Time-critical cases that need same-day cross-department input.'
  },
};

/* ---------------- disease-specific structured templates ---------------- */
const TEMPLATES = {
  Lung: {
    label:'Lung', medianTime:'3 min 40 s',
    sections:[
      {key:'risk', title:'Patient & Risk Factors', icon:'users',
        fields:[
          {key:'age', label:'Age', type:'number', unit:'years', required:true},
          {key:'sex', label:'Sex', type:'select', options:['M','F'], required:true},
          {key:'smoking', label:'Smoking history', type:'select', options:['Never','Current smoker','Ex-smoker'], required:true},
          {key:'packYears', label:'Pack-years', type:'number', required:false},
          {key:'referralSource', label:'Referral source', type:'select', options:['GP','ED','Screening program','Incidental imaging','Other specialty'], required:false},
          {key:'priorCancer', label:'Prior cancer', type:'select', options:['No','Yes'], required:true},
          {key:'familyHxLung', label:'Family history lung cancer (1st-degree)', type:'select', options:['No','Yes'], required:false},
        ]},
      {key:'presenting', title:'Presenting Features', icon:'stetho',
        fields:[
          {key:'cough', label:'Cough', type:'check'},
          {key:'dyspnea', label:'Dyspnea', type:'check'},
          {key:'hemoptysis', label:'Hemoptysis', type:'check'},
          {key:'weightLoss', label:'Weight loss', type:'select', options:['Yes','No'], required:true},
          {key:'weightLossPct', label:'% body weight lost (3–6 months)', type:'number', unit:'%', required:false},
          {key:'fever', label:'Fever', type:'check'},
          {key:'durationWeeks', label:'Duration', type:'number', unit:'weeks', required:true},
        ]},
      {key:'clinical', title:'Clinical & Performance Status', icon:'activity',
        fields:[
          {key:'ecog', label:'ECOG PS', type:'select', options:['0','1','2','3','4'], required:true},
          {key:'chestPain', label:'Chest pain', type:'select', options:['Yes','No'], required:true},
          {key:'bonePain', label:'Bone pain', type:'select', options:['Yes','No'], required:true},
          {key:'hoarseness', label:'Hoarseness', type:'select', options:['Yes','No'], required:false},
          {key:'svc', label:'SVC syndrome', type:'select', options:['Yes','No'], required:false},
          {key:'heightCm', label:'Height', type:'number', unit:'cm', required:true},
          {key:'weightKg', label:'Weight', type:'number', unit:'kg', required:true},
          {key:'preExistingLungDisease', label:'Pre-existing lung disease', type:'select', options:['None','COPD','Pulmonary fibrosis–ILD'], required:true},
        ]},
      {key:'workup', title:'Baseline Investigations Ordered', icon:'image',
        fields:[
          {key:'ctOrdered', label:'CT chest + upper abdomen with contrast (incl. adrenals)', type:'check'},
          {key:'cbcOrdered', label:'CBC + platelets', type:'check'},
          {key:'chemistryOrdered', label:'Chemistry profile', type:'check'},
          {key:'smokingCessationDelivered', label:'Smoking-cessation counselling delivered (5 A’s)', type:'check'},
          {key:'palliativeCareScreen', label:'Palliative-care needs screen', type:'check'},
        ]},
    ]
  },
  Breast: {
    label:'Breast', medianTime:'3 min 05 s',
    sections:[
      {key:'risk', title:'Patient & Risk Factors', icon:'users',
        fields:[
          {key:'age', label:'Age', type:'number', unit:'years', required:true},
          {key:'menopausal', label:'Menopausal status', type:'select', options:['Pre-menopausal','Post-menopausal'], required:true},
          {key:'familyHx', label:'Family history', type:'select', options:['Yes','No'], required:false},
          {key:'brca', label:'BRCA status', type:'select', options:['Positive','Negative','Untested'], required:false},
        ]},
      {key:'presenting', title:'Presenting Features', icon:'stetho',
        fields:[
          {key:'lumpSize', label:'Lump size', type:'number', unit:'cm', required:true},
          {key:'skinChanges', label:'Skin changes', type:'check'},
          {key:'nippleDischarge', label:'Nipple discharge', type:'check'},
          {key:'axillaryNodes', label:'Axillary nodes', type:'select', options:['Palpable','Not palpable'], required:true},
        ]},
      {key:'clinical', title:'Clinical Status', icon:'activity',
        fields:[
          {key:'ecog', label:'ECOG PS', type:'select', options:['0','1','2','3','4'], required:true},
          {key:'priorSurgery', label:'Prior breast surgery', type:'select', options:['Yes','No'], required:false},
        ]},
      {key:'workup', title:'Diagnostic Workup', icon:'image',
        fields:[
          {key:'mammogram', label:'Mammogram / USG', type:'select', options:['Done','Pending'], required:true},
          {key:'biopsyGrade', label:'Biopsy grade', type:'select', options:['1','2','3'], required:true},
          {key:'er', label:'ER', type:'select', options:['Positive','Negative'], required:true},
          {key:'pr', label:'PR', type:'select', options:['Positive','Negative'], required:true},
          {key:'her2', label:'HER2', type:'select', options:['Positive','Negative','Equivocal'], required:true},
          {key:'ki67', label:'Ki-67', type:'number', unit:'%', required:false},
        ]},
      {key:'staging', title:'Staging Summary', icon:'flag',
        fields:[
          {key:'tStage', label:'T stage', type:'select', options:['T1','T2','T3','T4'], required:true},
          {key:'nStage', label:'N stage', type:'select', options:['N0','N1','N2','N3'], required:true},
          {key:'mStage', label:'M stage', type:'select', options:['M0','M1'], required:true},
          {key:'clinicalStage', label:'Clinical stage', type:'select', options:['I','II','III','IV'], required:true},
        ]},
    ]
  },
  Colorectal: {
    label:'Colorectal', medianTime:'3 min 20 s',
    sections:[
      {key:'risk', title:'Patient & Risk Factors', icon:'users',
        fields:[
          {key:'age', label:'Age', type:'number', unit:'years', required:true},
          {key:'sex', label:'Sex', type:'select', options:['M','F'], required:true},
          {key:'lynchHx', label:'Family history (Lynch)', type:'select', options:['Yes','No'], required:false},
          {key:'priorPolyps', label:'Prior polyps', type:'select', options:['Yes','No'], required:false},
        ]},
      {key:'presenting', title:'Presenting Features', icon:'stetho',
        fields:[
          {key:'bleeding', label:'Rectal bleeding', type:'check'},
          {key:'bowelHabit', label:'Altered bowel habit', type:'check'},
          {key:'weightLoss', label:'Weight loss', type:'select', options:['Yes','No'], required:true},
          {key:'obstruction', label:'Obstruction', type:'select', options:['Yes','No'], required:true},
        ]},
      {key:'clinical', title:'Clinical Status', icon:'activity',
        fields:[
          {key:'ecog', label:'ECOG PS', type:'select', options:['0','1','2','3','4'], required:true},
          {key:'cea', label:'CEA', type:'number', unit:'ng/mL', required:false},
        ]},
      {key:'workup', title:'Diagnostic Workup', icon:'image',
        fields:[
          {key:'colonoscopy', label:'Colonoscopy', type:'select', options:['Done','Pending'], required:true},
          {key:'msi', label:'MSI status', type:'select', options:['MSI-H','MSS','Pending'], required:true},
          {key:'kras', label:'KRAS', type:'select', options:['Mutant','Wild-type','Pending'], required:false},
          {key:'nras', label:'NRAS', type:'select', options:['Mutant','Wild-type','Pending'], required:false},
          {key:'braf', label:'BRAF', type:'select', options:['Mutant','Wild-type','Pending'], required:false},
        ]},
      {key:'staging', title:'Staging Summary', icon:'flag',
        fields:[
          {key:'tStage', label:'T stage', type:'select', options:['T1','T2','T3','T4'], required:true},
          {key:'nStage', label:'N stage', type:'select', options:['N0','N1','N2'], required:true},
          {key:'mStage', label:'M stage', type:'select', options:['M0','M1'], required:true},
          {key:'clinicalStage', label:'Clinical stage', type:'select', options:['I','II','III','IV'], required:true},
        ]},
    ]
  },
  'Head & Neck': {
    label:'Head & Neck', medianTime:'4 min 10 s',
    sections:[
      {key:'risk', title:'Patient & Risk Factors', icon:'users',
        fields:[
          {key:'age', label:'Age', type:'number', unit:'years', required:true},
          {key:'sex', label:'Sex', type:'select', options:['M','F'], required:true},
          {key:'tobacco', label:'Tobacco use', type:'select', options:['Yes','No'], required:true},
          {key:'alcohol', label:'Alcohol use', type:'select', options:['Yes','No'], required:true},
        ]},
      {key:'presenting', title:'Presenting Features', icon:'stetho',
        fields:[
          {key:'neckMass', label:'Neck mass', type:'check'},
          {key:'dysphagia', label:'Dysphagia', type:'check'},
          {key:'odynophagia', label:'Odynophagia', type:'check'},
          {key:'voiceChange', label:'Voice change', type:'check'},
        ]},
      {key:'clinical', title:'Clinical Status', icon:'activity',
        fields:[
          {key:'ecog', label:'ECOG PS', type:'select', options:['0','1','2','3','4'], required:true},
          {key:'weightLossPct', label:'Weight loss', type:'number', unit:'%', required:false},
        ]},
      {key:'workup', title:'Diagnostic Workup', icon:'image',
        fields:[
          {key:'primarySite', label:'Primary site', type:'select', options:['Oropharynx','Larynx','Oral cavity','Hypopharynx','Nasopharynx'], required:true},
          {key:'hpv', label:'HPV / p16', type:'select', options:['Positive','Negative','Pending'], required:true},
          {key:'panEndoscopy', label:'Pan-endoscopy', type:'select', options:['Done','Pending'], required:true},
          {key:'petct', label:'PET-CT', type:'select', options:['Done','Pending'], required:true},
        ]},
      {key:'staging', title:'Staging Summary', icon:'flag',
        fields:[
          {key:'tStage', label:'T stage', type:'select', options:['T1','T2','T3','T4'], required:true},
          {key:'nStage', label:'N stage', type:'select', options:['N0','N1','N2','N3'], required:true},
          {key:'mStage', label:'M stage', type:'select', options:['M0','M1'], required:true},
          {key:'clinicalStage', label:'Clinical stage', type:'select', options:['I','II','III','IVA','IVB'], required:true},
        ]},
    ]
  },
  Cervix: {
    label:'Cervix', medianTime:'3 min 50 s',
    sections:[
      {key:'risk', title:'Patient & Risk Factors', icon:'users',
        fields:[
          {key:'age', label:'Age', type:'number', unit:'years', required:true},
          {key:'parity', label:'Parity', type:'number', required:false},
          {key:'hpvStatus', label:'HPV status', type:'select', options:['Positive','Negative','Unknown'], required:false},
          {key:'priorScreening', label:'Prior screening', type:'select', options:['Yes','No'], required:false},
        ]},
      {key:'presenting', title:'Presenting Features', icon:'stetho',
        fields:[
          {key:'abnormalBleeding', label:'Abnormal bleeding', type:'check'},
          {key:'postcoitalBleeding', label:'Postcoital bleeding', type:'check'},
          {key:'pelvicPain', label:'Pelvic pain', type:'check'},
          {key:'discharge', label:'Vaginal discharge', type:'check'},
        ]},
      {key:'clinical', title:'Clinical Status', icon:'activity',
        fields:[
          {key:'ecog', label:'ECOG PS', type:'select', options:['0','1','2','3','4'], required:true},
          {key:'tumourSize', label:'Tumour size', type:'number', unit:'cm', required:true},
        ]},
      {key:'workup', title:'Diagnostic Workup', icon:'image',
        fields:[
          {key:'histology', label:'Histology', type:'select', options:['Squamous cell','Adenocarcinoma','Other'], required:true},
          {key:'mriPelvis', label:'MRI pelvis', type:'select', options:['Done','Pending'], required:true},
          {key:'petct', label:'PET-CT', type:'select', options:['Done','Pending'], required:false},
          {key:'parametrial', label:'Parametrial involvement', type:'select', options:['Yes','No','Uncertain'], required:true},
        ]},
      {key:'staging', title:'Staging Summary', icon:'flag',
        fields:[
          {key:'figoStage', label:'FIGO stage', type:'select', options:['IB1','IB2','IB3','IIA','IIB','IIIA','IIIB','IIIC1','IIIC2','IVA','IVB'], required:true},
          {key:'nStage', label:'N stage', type:'select', options:['N0','N1'], required:true},
          {key:'mStage', label:'M stage', type:'select', options:['M0','M1'], required:true},
        ]},
    ]
  },
};

/* ============================================================
   CASE DATA — synthetic demo patients across tumour types
   and non-oncology pathways.
   ============================================================ */
/* The lung worked case is kept here for reference only — it is not part of the cases list. */
const ARCHIVED_CASES = [
  /* ---- Worked case: Stage IIIB (T4N2M0), per-node Tier 1/2 sign-off chain broken by the
     surgeon at the resectability node — the OR-gate escalation the whole schema exists for. */
  {
    id:'7101', tumourType:'Lung', pathway:'Oncology MDT', department:'Thoracic Oncology',
    patient:{initials:'V.N.', age:63, sex:'M', mrn:'7101', height:170, weight:68},
    diagnosis:'RUL adenocarcinoma', stage:'cT4 N2 M0 — Stage IIIB (AJCC 9th ed.)',
    keyFacts:['Ex-smoker, 40 pack-years, quit at diagnosis','ECOG 1','4.9cm RUL mass abutting SVC/mediastinal fat','Multi-station N2b (4R + 7)','EGFR/ALK/ROS1 negative · PD-L1 30%','FEV₁ 62% / DLCO 54% predicted · ThRCRI 0'],
    biomarkers:{ stage:'IIIB', histology:'Non-squamous', egfr:'Negative', alk:'Negative', pdl1:30, ecog:1, age:63, resection:'Non-surgical' },
    evidenceLinks:[],
    /* This case's tier is driven entirely by the per-node OR-gate schema (see the
       Surgical Resectability node's tierMark) — the document's own vocabulary is
       binary Tier 1 / Tier 2, and its Tier 2 means exactly what this app calls a
       synchronous board (quorum met, full round table), not this app's own "Tier 2 =
       async" meaning. tierBadgeOverride keeps every display of this case's tier
       reading "Tier 2" — the same number, in the same red, everywhere — instead of
       switching to this app's differently-defined Tier 2 label if c.tier were set to
       2 directly, or reading "Tier 3" (a number the source document never uses) if
       left on this app's own synchronous-tier number. */
    tier:2, tierBadgeOverride:{label:'Tier 2 · Synchronous MDT', badge:'badge-tier3'}, status:'Decision Locked',
    createdAt: daysAgo(23), lockedAt: daysAgo(1),
    quorum:{invited:7, responded:7},
    specialists:[
      {name:'Dr. A. Rao', role:'Medical Oncology', status:'responded', initials:'AR'},
      {name:'Dr. P. Menon', role:'Radiology', status:'responded', initials:'PM'},
      {name:'Dr. S. Krishnan', role:'Thoracic Surgery', status:'responded', initials:'SK'},
      {name:'Dr. N. Iyer', role:'Radiation Oncology', status:'responded', initials:'NI'},
      {name:'Dr. R. Kulkarni', role:'Pathology', status:'responded', initials:'RK'},
      {name:'Dr. K. Babu', role:'Pulmonology', status:'responded', initials:'KB'},
      {name:'Dr. R. Menon', role:'Cardiology', status:'responded', initials:'RM'},
    ],
    thread:[
      {author:'Dr. A. Rao', role:'Medical Oncology', time:daysAgo(2), text:'Confirmed T4N2b (multi-station) adenocarcinoma, driver-negative, PD-L1 30%, ECOG 1, DLCO 54%. The surgeon has flagged resectability. Is this patient for definitive concurrent chemoradiation + durvalumab, or should we consider induction with reassessment for surgery? And what is our fallback if he progresses or can’t tolerate the plan?', kind:'question'},
      {author:'Dr. P. Menon', role:'Radiology', time:daysAgo(1.9), text:'Re-confirm T4 by mediastinal/SVC abutment with fat-plane loss, no encasement; N2b (4R + 7), contralateral mediastinum negative. No occult M1. Radiologically this is T4N2 — the abutment is real but not deep vascular invasion.', action:'View images'},
      {author:'Dr. R. Kulkarni', role:'Pathology', time:daysAgo(1.85), text:'Adenocarcinoma, driver-negative. Multi-station N2 is pathologically confirmed on separate node stations (4R and 7) — genuine N2b, not a single-station N2.'},
      {author:'Dr. K. Babu', role:'Pulmonology', time:daysAgo(1.8), text:'He is fit for concurrent chemoradiation. He would tolerate a lobectomy but ppoDLCO ~45% makes a right pneumonectomy dangerous — if surgery ever required a pneumonectomy, functional risk becomes prohibitive. DLCO <60% also means I’d want conservative lung constraints if we irradiate.'},
      {author:'Dr. S. Krishnan', role:'Thoracic Surgery', time:daysAgo(1.7), text:'My concern is honesty about resectability. Multi-station N2b with T4 disease is, by STS and NCCN, generally not a surgical candidate up-front, and we should not give induction purely to try to convert unresectable to resectable. Given N2b + the reserve issue, I do not think up-front or planned surgery is the right path. I’m comfortable this is non-surgical, but I wanted the board to make that call explicitly rather than defaulting.', action:'View plan'},
      {author:'Dr. N. Iyer', role:'Radiation Oncology', time:daysAgo(1.6), text:'For fit unresectable Stage IIIB, definitive concurrent chemoradiation (60 Gy) is category 1, and the central location is treatable within heart/lung constraints. With DLCO 54% I’ll tighten lung V20. Strong radiation candidate.', action:'View plan'},
      {author:'Dr. A. Rao', role:'Medical Oncology', time:daysAgo(1.5), text:'Driver-negative, PD-L1 30%, PS 1, no autoimmune disease — consolidation durvalumab for up to 12 months is category 1 after cCRT with no progression. EGFR is negative, so durvalumab is the correct consolidation agent, not osimertinib.', action:'View plan'},
      {author:'Dr. A. Rao', role:'Medical Oncology', time:daysAgo(1.45), text:'Surgeon — is there any scenario where we reassess for surgery?', kind:'question'},
      {author:'Dr. S. Krishnan', role:'Thoracic Surgery', time:daysAgo(1.44), text:'Only if restaging showed a major nodal downstaging AND a lobectomy (not pneumonectomy) would achieve R0 — unlikely here; I would not plan it.'},
      {author:'Dr. A. Rao', role:'Medical Oncology', time:daysAgo(1.43), text:'Radiation onc — can you meet lung constraints with DLCO 54%?', kind:'question'},
      {author:'Dr. N. Iyer', role:'Radiation Oncology', time:daysAgo(1.42), text:'Yes, with V20 ≤ 30–35% and conservative planning; pneumonitis risk counseled.'},
      {author:'Dr. A. Rao', role:'Medical Oncology', time:daysAgo(1.41), text:'Med onc — durvalumab eligibility if he has a pneumonitis flare on RT?', kind:'question'},
      {author:'Dr. A. Rao', role:'Medical Oncology', time:daysAgo(1.4), text:'Would reassess; consolidation only starts if no progression and pneumonitis controlled.'},
    ],
    decision:{
      plan:'Definitive concurrent chemoradiation — carboplatin AUC 5 + pemetrexed 500 mg/m² q21d ×4, with concurrent thoracic RT to 60 Gy (conservative lung dose constraints given DLCO 54%) → consolidation durvalumab 1500 mg IV q4w for up to 12 months, provided no progression and performance status maintained.',
      reasoning:'Multi-station N2b (4R + 7) with T4 disease by mediastinal abutment is guideline-concordant for definitive chemoradiation, not upfront or induction-to-convert surgery; borderline pulmonary reserve (ppoDLCO ~45%) makes a pneumonectomy high-risk if surgery were ever pursued.',
      alternatives:'Induction chemoimmunotherapy then surgical reassessment — rejected (guideline-concordant not to attempt conversion surgery in multi-station N2b with borderline reserve); neoadjuvant immunotherapy — N/A, biomarker-driven consolidation is the correct sequence here, not induction ICI.',
      risks:'Radiation pneumonitis given DLCO 54% (mitigated with conservative V20 ≤ 30–35%); progression or intolerance interrupting the concurrent phase.',
      disagreement:'None substantive. The surgeon’s escalation was to force an explicit board decision on resectability rather than to argue for surgery — documented as “resectability formally adjudicated as unresectable by consensus.”',
      contingency:'If radiation pneumonitis or intolerance interrupts cCRT → complete RT with sequential rather than concurrent chemo; durvalumab can be considered as consolidation after sequential CRT. If restaging shows progression → re-biopsy / reassess for systemic therapy per metastatic pathway. If unexpected major nodal response and a lobectomy (not pneumonectomy) would give R0 → re-present to MDT before any surgical plan.',
      intent:'Curative', restagingPoint:null,
      resectability:'Unresectable', resectDecidedBy:'Dr. S. Krishnan · Thoracic Surgery', resectBasis:['Nodal extent (single- vs multi-station)'], intentionToTreat:true,
      meetingType:'Live in-person', reasonForDiscussion:'Resectability in question', consensusStatus:'Full consensus',
      trialScreening:'No suitable trial', trialId:'—', notifyLead:'Dr. A. Rao', notifyMethod:'In-person clinic',
    },
    timeline:[
      {stage:'Presentation & History', owner:'Intake / Pulmonology', enteredBy:'Dr. A. Rao', date:daysAgo(21),
        summary:'63M, 6 weeks dry cough, 2 episodes scant hemoptysis, ~4kg weight loss over 2 months. Ex-smoker, 40 pack-years, quit at diagnosis. ECOG 1. No SVC obstruction, stridor or cord compression. No palpable supraclavicular nodes; chest clear.',
        opinion:'Clinically locally advanced NSCLC; needs full diagnostic + staging + pre-treatment workup before any decision. Autoimmune history absent, so immunotherapy not contraindicated on history.',
        structuredFindings:{symptoms:['Cough','Hemoptysis','Weight loss'], redFlags:[], smokingStatus:'Quit at diagnosis', smokingPackYears:'40', occupationalExposure:'None', asbestosExposure:'None', priorMalignancy:'None', comorbidities:['Hypertension (well controlled)'], ecog:'1', examFindings:'No palpable supraclavicular nodes; chest clear; no SVC signs.'},
        tierMark:{tier:1, reason:'Presentation complete, no red flags, workup can proceed on protocol.'},
        images:[{caption:'Clinical diagram — tumor position schematic (distance from verge n/a, thoracic primary)', keyImage:false}]},
      {stage:'CT Chest/Abdomen (Diagnostic Imaging)', owner:'Radiology', enteredBy:'Dr. P. Menon', date:daysAgo(19),
        summary:'4.9cm spiculated RUL mass abutting SVC/mediastinal fat, fat-plane loss ~1.5cm, no frank encasement (<180°). Station 4R (1.8cm) and 7 (1.4cm) nodes enlarged. No pleural effusion; liver/adrenals clear.',
        opinion:'Radiologically T4 by mediastinal abutment (fat-plane loss), N2 (ipsilateral 4R + 7). Contralateral mediastinum clear. Recommend PET/CT + tissue confirmation of nodes.',
        structuredFindings:{tumorSizeCm:'4.9', morphology:'Spiculated', mediastinalAbutment:'Abuts, no encasement', fatPlaneStatus:'Lost (<2 cm)', svcFillingDefect:false, station4rSizeCm:'1.8', station7SizeCm:'1.4', contralateralNodes:'None', pleuralEffusion:false, liverAdrenalLesion:'No lesion'},
        tierMark:{tier:1, reason:'Imaging interpretation guideline-concordant; staging descriptors assigned, no imaging ambiguity that needs the board.'},
        images:[{caption:'Axial CT (mediastinal window) — SVC/mediastinal contact circled, lost fat plane arrowed. T4 — abutment over ~1.5cm, <180° contact, no intraluminal filling defect.', keyImage:true, modality:'CT Chest + Contrast'},
                {caption:'Axial CT at carina — station 4R node, caliper 1.8cm', keyImage:false},
                {caption:'Axial CT subcarinal — station 7 node, caliper 1.4cm', keyImage:false},
                {caption:'Coronal reconstruction — craniocaudal extent and relationship to carina', keyImage:false}]},
      {stage:'PET-CT (Metabolic Staging)', owner:'Radiology', enteredBy:'Dr. P. Menon', date:daysAgo(16),
        summary:'Intense uptake RUL primary (SUVmax 14.2). FDG-avid station 4R (SUVmax 6.1) and 7 (SUVmax 5.4). No contralateral mediastinal, supraclavicular or distant uptake.',
        opinion:'PET consistent with T4 N2 M0. PET-positive mediastinal nodes require pathologic confirmation before treatment (per NCCN). Recommend EBUS-TBNA of 4R and 7.',
        structuredFindings:{primarySuvmax:'14.2', station4rSuvmax:'6.1', station7Suvmax:'5.4', contralateralMediastinalUptake:false, supraclavicularUptake:false, distantUptake:false},
        tierMark:{tier:1, reason:'Metabolic staging concordant; nodes flagged for mandatory pathologic confirmation — a protocol step, not a controversy.'},
        images:[{caption:'PET/CT fusion, axial — RUL primary, SUVmax 14.2', keyImage:true, modality:'PET-CT'},
                {caption:'Fusion — stations 4R and 7, hot nodes with SUVmax 6.1 / 5.4 annotated', keyImage:false},
                {caption:'MIP whole-body — no distant/contralateral uptake', keyImage:false}]},
      {stage:'Bronchoscopy (Airway Assessment)', owner:'Interventional Pulmonology', enteredBy:'Dr. K. Babu', date:daysAgo(14),
        summary:'RUL bronchus: extrinsic compression + mucosal infiltration at the orifice; main carina sharp and mobile; no tumor within 2cm of carina. No endobronchial obstruction requiring debulking.',
        opinion:'Central-ish tumor with RUL orifice involvement but carina uninvolved; airway not immediately threatened. Proceed to EBUS same session for nodal sampling.',
        structuredFindings:{extrinsicCompression:true, mucosalInfiltration:true, carinaStatus:'Sharp and mobile', distanceFromCarina:'≥2 cm', endobronchialObstruction:false},
        tierMark:{tier:1, reason:'Airway findings documented; no airway emergency.'},
        images:[{caption:'Endoscopic photo — RUL orifice, mucosal infiltration + extrinsic compression', keyImage:true},
                {caption:'Endoscopic photo — main carina, sharp and mobile (carina uninvolved)', keyImage:false}]},
      {stage:'EBUS-TBNA (Nodal Tissue Staging)', owner:'Interventional Pulmonology', enteredBy:'Dr. K. Babu', date:daysAgo(14),
        summary:'Station 4R: 4 passes, ROSE malignant. Station 7: 3 passes, ROSE malignant. Station 4L (contralateral check): sampled, benign. Tissue allocated for histology + molecular.',
        opinion:'Pathologically confirmed N2 (multi-station: 4R + 7 = N2b); contralateral 4L negative. Adequate tissue for full biomarker panel. N2, not N3.',
        structuredFindings:{station4rPasses:'4', station4rRose:'Malignant', station7Passes:'3', station7Rose:'Malignant', contralateralStation:'4L', contralateralRose:'Benign', otherStationsAssessed:'10R, 11R — sonographically normal, not sampled', tissueAdequateForMolecular:true, complication:'None'},
        tierMark:{tier:1, reason:'Nodal staging complete and adequate; guideline-concordant — EBUS as first staging modality, contralateral checked.'},
        images:[{caption:'EBUS still — station 4R, needle-in-node, Doppler vascular-avoidance frame', keyImage:true},
                {caption:'EBUS still — station 7, needle-in-node', keyImage:false},
                {caption:'EBUS still — station 4L, sonographically normal (N2-not-N3 evidence)', keyImage:false},
                {caption:'Node map schematic — stations sampled, color-coded (4R+7 positive, 4L negative)', keyImage:false}]},
      {stage:'Pathology (Histo + IHC)', owner:'Pathology', enteredBy:'Dr. R. Kulkarni', date:daysAgo(11),
        summary:'Invasive adenocarcinoma, acinar predominant. TTF-1 positive, p40 negative. Cell blocks from 4R and 7 both diagnostic; tumor cellularity sufficient for molecular.',
        opinion:'Adenocarcinoma confirmed in mediastinal nodes; diagnosis and sampling are guideline-concordant. Reflexing to molecular/NGS + PD-L1.',
        tierMark:{tier:1, reason:'Diagnosis definitive, tissue adequate, guideline-concordant from pathology’s side.'},
        images:[{caption:'H&E microphotograph — acinar-predominant adenocarcinoma', keyImage:true},
                {caption:'IHC — TTF-1 positive / p40 negative (lineage proof)', keyImage:false}]},
      {stage:'Molecular NGS + PD-L1', owner:'Molecular Pathology', enteredBy:'Dr. R. Kulkarni', date:daysAgo(8),
        summary:'EGFR: no exon 19 deletion, no L858R. ALK/ROS1 not rearranged. RET/MET exon14/BRAF/KRAS/NTRK: no actionable alteration. PD-L1 (22C3) TPS 30%.',
        opinion:'Driver-negative, PD-L1 30%. No EGFR exon 19/L858R → if the case goes to definitive chemoradiation, consolidation durvalumab (not osimertinib) is the correct biomarker-matched agent. Biomarker profile complete and guideline-concordant.',
        tierMark:{tier:1, reason:'Complete multigene panel + PD-L1; result directly determines consolidation agent — concordant, no debate.'},
        images:[{caption:'PD-L1 (22C3) IHC — membranous staining, TPS 30% annotated', keyImage:true},
                {caption:'NGS report page — EGFR/ALK/ROS1 variant table, QC metrics', keyImage:false}]},
      {stage:'Brain MRI + Stage Assignment', owner:'Radiology', enteredBy:'Dr. P. Menon', date:daysAgo(6),
        summary:'Brain MRI with/without contrast: no intracranial metastasis. Integrated stage: cT4 (mediastinal abutment) N2b (4R + 7) M0. AJCC 9th ed. Stage IIIB.',
        opinion:'Confirmed Stage IIIB (T4N2M0), M0 after PET + brain MRI. Staging complete.',
        structuredFindings:{intracranialMets:false, integratedTnm:'cT4 N2b M0', ajccStageGroup:'Stage IIIB (AJCC 9th ed.)'},
        tierMark:{tier:1, reason:'Staging complete and internally consistent.'},
        images:[{caption:'Brain MRI, axial post-contrast T1 + FLAIR — no intracranial metastasis', keyImage:true}]},
      {stage:'Fitness / Functional Assessment', owner:'Pulmonology / Thoracic Surgery', enteredBy:'Dr. K. Babu', date:daysAgo(5),
        summary:'FEV₁ 2.05L (62% predicted); FVC 78% predicted; FEV₁/FVC 0.66. DLCO 54% predicted. Predicted post-op (RUL lobectomy, segment method): ppoFEV₁ ≈ 52%, ppoDLCO ≈ 45%. 6MWT 430m, SpO₂ nadir 93%.',
        opinion:'DLCO 54% and ppoDLCO ~45% place him at moderate functional risk. Fit for concurrent chemoradiation (FEV₁ well above the ≥40% threshold), but DLCO <60% flags higher radiation-pneumonitis risk — conservative lung dose constraints warranted. Borderline reserve is relevant only if an extended resection (e.g. pneumonectomy) were ever proposed — he would tolerate a lobectomy but not a right pneumonectomy well.',
        tierMark:{tier:1, reason:'Fit for radical non-surgical therapy; pulmonary findings concordant — flagging that reserve limits the surgical option for the surgeon to weigh.'},
        images:[{caption:'Spirometry flow-volume loop — obstructive curve, FEV₁/FVC 0.66', keyImage:true},
                {caption:'DLCO report — 54% predicted', keyImage:false},
                {caption:'6-minute walk trace / SpO₂ nadir — 430m, nadir 93%', keyImage:false}]},
      {stage:'Cardiac Assessment', owner:'Cardiology', enteredBy:'Dr. R. Menon', date:daysAgo(5),
        summary:'ThRCRI 0 (no ischemic heart disease, no CVD, normal creatinine, no pneumonectomy planned) → Class A, low cardiac risk. ECG sinus rhythm, no ischemic changes.',
        opinion:'Low perioperative and on-treatment cardiac risk. No contraindication to platinum-based chemotherapy, thoracic radiation, or surgery. If definitive RT is chosen, keep mean heart dose within constraints given the central tumor location; no baseline cardio-oncology referral required at this risk level.',
        structuredFindings:{rcriScore:'0', riskClass:'Class A (low)', ischemicHeartDisease:'None', ecgFindings:'Sinus rhythm, no ischemic changes', tteIndicated:'Not indicated', clearanceStatus:'Cleared'},
        tierMark:{tier:1, reason:'Cardiac clearance straightforward, guideline-concordant.'},
        images:[{caption:'12-lead ECG strip — sinus rhythm, no ischemic changes', keyImage:true}]},
      {stage:'Surgical Resectability Assessment', owner:'Thoracic Surgery', enteredBy:'Dr. S. Krishnan', date:daysAgo(3),
        summary:'Primary abuts SVC/mediastinal fat without frank encasement or intraluminal invasion; carina free. Nodal disease multi-station N2 (4R + 7 = N2b). Complete R0 resection would likely require an extended right resection; borderline DLCO (ppoDLCO ~45%) makes pneumonectomy high-risk.',
        opinion:'This is a genuinely borderline resectability question. By guideline, T4N2 (especially multi-station N2b) is predominantly unresectable and routed to definitive chemoradiation — but the tumor is T4 by abutment rather than deep invasion, and abutment is not always true invasion. Whether this patient is definitively unresectable for cCRT + durvalumab, or a candidate to reassess for surgery, is not a decision I should make alone and is not purely guideline-automatic. Resectability must be decided up-front by the full board.',
        structuredFindings:{resectabilityCall:'Unresectable', basis:[]},
        tierMark:{tier:2, reason:'Cross-disciplinary resectability decision — T4 by abutment (not clear invasion) plus multi-station N2b and borderline reserve; the board, not one specialist, must make this call.'},
        images:[{caption:'Surgeon’s overlay on the radiologist’s Stop 2 axial CT — “abutment vs. invasion — R0 uncertain” marked on the SVC contact (two annotation layers, same image)', keyImage:true, modality:'CT Chest + Contrast'},
                {caption:'Bronchoscopy carina photo (from the Bronchoscopy node) — supporting evidence the carina is free', keyImage:false}]},
      {stage:'MDT Decision Lock', owner:'All specialties', enteredBy:'Dr. A. Rao', date:daysAgo(1),
        summary:'Tier 2 synchronous MDT, quorum met (7/7: Thoracic Surgery, Medical Oncology, Radiation Oncology, Radiology, Pathology, Pulmonology, Cardiology async note).',
        decision:'Definitive concurrent chemoradiation (carboplatin AUC 5 + pemetrexed q21d ×4, RT to 60 Gy) → consolidation durvalumab up to 12 months.',
        reasoningLong:'Multi-station N2b with T4 disease by mediastinal abutment — guideline-concordant for definitive chemoradiation; board confirmed non-surgical after the surgeon’s escalation.'},
      {stage:'Neoadjuvant Therapy', owner:'Medical Oncology', date:null, summary:'Not yet started — concurrent chemoradiation (carboplatin AUC 5 + pemetrexed 500mg/m² q21d ×4, with concurrent thoracic RT to 60Gy) to begin per the locked MDT decision. Tracked in the Treatment Log.'},
      {stage:'Restaging / Resectability', owner:'Radiology + MDT', date:null, summary:'N/A for this pathway — non-surgical, definitive chemoradiation; no pre-surgical restaging gate.'},
      {stage:'Surgery', owner:'Thoracic Surgery', date:null, summary:'Not performed — non-surgical pathway (definitive chemoradiation). Board would re-open only on unexpected major nodal response allowing a lobectomy (not pneumonectomy) to achieve R0.'},
      {stage:'Surgical Pathology', owner:'Pathology', date:null, summary:'N/A — no resection performed.'},
      {stage:'Adjuvant Therapy', owner:'Medical Oncology', date:null, summary:'Consolidation durvalumab 1500mg IV q4w, up to 12 months, planned after concurrent chemoradiation completes — provided no progression and performance status maintained.'},
      {stage:'Surveillance', owner:'All', date:null, summary:'Pending — surveillance schedule begins once consolidation durvalumab completes.'},
    ],
    outcome:'On concurrent chemoradiation pathway',
    biopsyAssessment:(function(){
      const nodes = {};
      ['2R','2L','3P','4R','4L','7','10R','10L','11R','11L','12-13'].forEach(code=>{ nodes[code] = {examined:false, sizeMm:'', passes:'', rose:'', cytology:'Pending'}; });
      nodes['4R'] = {examined:true, sizeMm:'18', passes:'4', rose:'Malignant', cytology:'Positive'};
      nodes['7'] = {examined:true, sizeMm:'14', passes:'3', rose:'Malignant', cytology:'Positive'};
      nodes['4L'] = {examined:true, sizeMm:'', passes:'1', rose:'Benign', cytology:'Negative'};
      nodes['10R'] = {examined:true, sizeMm:'', passes:'', rose:'', cytology:'Pending'};
      nodes['11R'] = {examined:true, sizeMm:'', passes:'', rose:'', cytology:'Pending'};
      return {
        primarySide:'R', procedureDateTime:'2026-09-10T09:00', sedation:'Moderate', indication:'Both',
        airwaySurveyDone:true, visibleLesion:'Present', lesionAppearance:'Extrinsic (peribronchial) compression', lesionLocation:'RUL', airwayPatency:'Patent',
        samplingMethods:['Endobronchial TBNA'], forcepsCount:'', radialEbus:false, roseDone:'Yes', roseResult:'Malignant',
        systematicSurveyDone:true, combinedEusB:false, needleGauge:'22G',
        nodes,
        molecularPasses:true, sentForPdl1:true, ngsCollected:true,
        cnConfirmed:'N2b',
        airwayNarrative:'RUL bronchus: extrinsic compression + mucosal infiltration at the RUL orifice; main carina sharp and mobile; no tumor within 2cm of main carina. No endobronchial obstruction requiring debulking.',
        notableFindings:'Stations 4R and 7 EBUS-TBNA malignant (multi-station N2b); station 4L benign (contralateral check); stations 10R/11R sonographically normal, not sampled.',
        completedBy:'Dr. K. Babu · Pulmonology', completedAt:daysAgo(14),
      };
    })(),
    stagingAssessment:(function(){
      const nodes = {};
      ['1R','1L','2R','2L','4R','4L','5','6','7','8','9','10R','10L','11R','11L'].forEach(code=>{ nodes[code] = {positive:false, sizeMm:'', petAvid:'No', pathConfirm:'Not yet obtained'}; });
      nodes['4R'] = {positive:true, sizeMm:'18', petAvid:'Yes', pathConfirm:'Positive (EBUS-TBNA)'};
      nodes['7'] = {positive:true, sizeMm:'14', petAvid:'Yes', pathConfirm:'Positive (EBUS-TBNA)'};
      return {
        ctDone:'Done', ctDate:'2026-09-05', petDone:'Done', petDate:'2026-09-08', brainDone:'Done', brainDate:'2026-09-18', reportSignout:'2026-09-18',
        tis:false, tumorSizeMm:'49', laterality:'RUL', endobronchial:'None', atelectasis:false, pleuralInvasion:false, adjacentLobeInvasion:false,
        t3Checklist:[], t4Checklist:['Mediastinum'], superiorSulcus:false,
        nodes,
        mStatus:'No (cM0)', m1aFlag:false, m1bFlag:false, m1c1Flag:false, m1c2Flag:false, metSites:[], numMetSites:'',
        impression:'cT4 (mediastinal abutment, fat-plane loss) N2b (4R + 7) M0 — AJCC 9th ed. Stage IIIB. No intracranial metastasis on brain MRI.', otherFindings:'No pleural effusion. Liver/adrenals — no lesion.',
        cT:'T4', cN:'N2b', cM:'M0', stage:'IIIB',
        completedBy:'Dr. P. Menon · Radiology', completedAt:daysAgo(6),
      };
    })(),
    pathologyAssessment:{
      accessionNumber:'SP-7101-EBUS', specimenSource:'EBUS-TBNA', anatomicSite:'Mediastinal lymph nodes (stations 4R, 7)', numParts:'2',
      receivedDateTime:'2026-09-13T09:15', grossedDateTime:'2026-09-13T14:00', signoutDateTime:'2026-09-15T16:30', fixatives:['10% NBF (FFPE)','Cell block'],
      adequacy:'Adequate', tumorPresent:'Malignant', cellularityPct:'40', pdl1CellsSufficient:'Yes', necrosisFlag:false, necrosisPct:'',
      primaryDx:'Non-small cell carcinoma', nsclcSubtype:'Adenocarcinoma', basisOfSubtyping:'Morphology + IHC', neSubtype:'', ki67:'', suspectedMet:'No',
      ihcAdeno:['TTF-1'], ihcSquamous:[], ihcNE:[], ihcMeso:[], ihcMetWorkup:[],
      molecularTissueReserved:'Yes – block reserved', molecularPanelOrdered:['NGS multigene panel ordered','PD-L1 ordered'], molecularSentDateTime:'2026-09-15T17:00',
      comment:'Adenocarcinoma confirmed in mediastinal nodes (4R, 7), acinar predominant. TTF-1 positive, p40 negative. Diagnosis and sampling guideline-concordant; reflexing to molecular/NGS + PD-L1.', tierSelector:'Tier 1',
      completedBy:'Dr. R. Kulkarni · Pathology', completedAt:daysAgo(11),
    },
    fitnessAssessment:{
      cardiacConditions:['None'], rcriScore:'0', cardiologyClearance:'Not required',
      ecog:'1', heightCm:'170', weightKg:'68', weightLossPct:'5.6', albumin:'', frailty:'Normal', spo2:'93',
      fev1Pct:'62', fev1L:'2.05', fvcPct:'78', fev1FvcRatio:'0.66', dlcoPct:'54', resectionExtent:'Lobectomy', segmentsResected:'3', totalSegments:'19',
      exerciseTest:'Low-technology (6MWT)', swtDistance:'430', stairClimbHeight:'', desaturationPct:'',
      vo2peak:'', vo2peakPctPred:'', veVco2Slope:'',
      neoadjuvantPlanned:'No', clinicianNote:'',
      ppoFEV1:52, ppoDLCO:45, classification:'MODERATE', drivenBy:'satisfactory low-tech exercise test',
      completedBy:'Dr. K. Babu · Pulmonology', completedAt:daysAgo(5),
    },
    molecularAssessment:{
      linkedSpecimen:'EBUS-TBNA cell block (station 7)', specimenType:'EBUS-TBNA cell block', orderDate:'', receivedDate:'', reportedDate:'',
      testingLab:'In-house', accreditedLabConfirmed:true,
      tumorCellularityPct:'40', adequacy:'Adequate', pdl1CellsSufficient:true,
      testingMethods:['DNA-based NGS (multigene panel)','RNA-based NGS (fusion / exon-skipping)','IHC (ALK/ROS1/HER2/c-Met screen)'],
      genes:{
        EGFR:{result:'Negative', detail:'No exon 19 deletion, no L858R', vus:false},
        ALK:{result:'Negative', detail:'', vus:false},
        RET:{result:'Negative', detail:'', vus:false},
        ROS1:{result:'Negative', detail:'', vus:false},
        BRAF:{result:'Negative', detail:'', vus:false},
        KRAS:{result:'Negative', detail:'', vus:false},
        MET:{result:'Negative', detail:'', vus:false},
        ERBB2:{result:'Not tested', detail:'', vus:false},
        NTRK:{result:'Negative', detail:'', vus:false},
        NRG1:{result:'Not tested', detail:'', vus:false},
      },
      ihc:{HER2_IHC:'Not tested', CMET_IHC:'Not tested'},
      pdl1Tested:'Yes', pdl1Assay:'22C3', pdl1Tps:'30',
      ctdnaPerformed:false, ctdnaFractionDetectable:'Detectable', ctdnaDriver:'Not tested',
      interpretiveComment:'Driver-negative, PD-L1 30%. If definitive chemoradiation is pursued, consolidation durvalumab (not osimertinib) is the biomarker-matched agent.',
      notableFindings:'Adequate tissue for full biomarker panel from EBUS station 7.',
      completedBy:'Dr. R. Kulkarni · Pathology', completedAt:daysAgo(8),
    },
    treatmentLog:{
      regimen:'Carboplatin (AUC 5) + Pemetrexed, concurrent with thoracic RT to 60 Gy', intent:'Definitive concurrent chemoradiation',
      numCycles:4, cycleLengthDays:21,
      drugs:[
        {name:'Carboplatin (AUC 5)', dosing:'fixed', refDose:750, unit:'mg'},
        {name:'Pemetrexed', dosing:'bsa', refDosePerM2:500, unit:'mg/m²'},
      ],
      cycles:[
        {index:1, plannedDate:daysAgo(-3), status:'pending', actualDate:null, delayDays:0, delayReason:null, doses:null, toxicities:[], actionTaken:null, labsEntered:false},
        {index:2, plannedDate:daysAgo(-24), status:'pending', actualDate:null, delayDays:0, delayReason:null, doses:null, toxicities:[], actionTaken:null, labsEntered:false},
        {index:3, plannedDate:daysAgo(-45), status:'pending', actualDate:null, delayDays:0, delayReason:null, doses:null, toxicities:[], actionTaken:null, labsEntered:false},
        {index:4, plannedDate:daysAgo(-66), status:'pending', actualDate:null, delayDays:0, delayReason:null, doses:null, toxicities:[], actionTaken:null, labsEntered:false},
      ],
    },
  },
];

const CASES = [
  /* Worked case #3 (rectal, surveillance). Only the patient banner is built so far. The banner
     rows are the source document's banner table verbatim — do not reword or reorder them. */
  {
    id:'33-55-902', tumourType:'Colorectal', pathway:'Oncology MDT', department:'Medical Oncology',
    patient:{name:'[Demo Patient C]', initials:'DPC', age:57, sex:'F', mrn:'33-55-902'},
    banner:[
      {label:'Name / ID', value:'[Demo Patient C] / MRN 33-55-902'},
      {label:'Age / Sex', value:'57 / Female'},
      {label:'ECOG PS', value:'0'},
      {label:'Case owner (primary)', value:'Medical Oncology — Dr. [X]'},
      {label:'Diagnosis', value:'Low–mid rectal adenocarcinoma'},
      {label:'Clinical stage', boldLabel:true, value:'**cT3c N1b M0 — Stage IIIB** ; MRF threatened; EMVI-positive'},
      {label:'Biomarkers', value:'**pMMR / MSS** ; KRAS G12V mutant; BRAF WT; HER2 negative'},
      {label:'Location', value:'6 cm from anal verge, ~40% circumference'},
      {label:'Strategy locked (Trial box)', boldLabel:true, value:'**OPRA — consolidation arm (CRT→consolidation chemo), organ-preservation intent**'},
      {label:'Current phase', boldLabel:true, value:'**WATCH-AND-WAIT SURVEILLANCE (our hospital)**'},
      {label:'Case-level tier', value:'**TIER 2** (escalated at Surgery node)'},
    ],
    diagnosis:'Low–mid rectal adenocarcinoma', stage:'cT3c N1b M0 — Stage IIIB',
    keyFacts:[], evidenceLinks:[],
    tier:2, tierBadgeOverride:{label:'Tier 2', badge:'badge-tier3'}, status:'Decision Locked',
    defaultTab:'summary', hasNodeForms:true,
    /* SUMMARY TAB — "Story so far", 7 stacked strips, content verbatim from the source document.
       Read-only by design (the document defines it as a projection of the nodes); it is held here
       as data only until the timeline nodes it will be computed from are built. */
    summary:{
      status:{
        state:'stable',
        headline:'57F • Low rectal adenocarcinoma • cT3c N1b M0 (Stage IIIB) • pMMR/MSS',
        phase:'WATCH-AND-WAIT SURVEILLANCE — rectum preserved, cCR sustained',
        timeSinceCcr:'Time since cCR: 8 months', riskWindow:'High-risk window (0–24 mo)',
        nextDue:[{what:'Flexible sigmoidoscopy + DRE (q3–4 mo)', when:'in 3 weeks'},{what:'MRI (q6 mo)', when:'in 2 months'}],
        alerts:'Open alerts: none active', lastCea:'Last CEA 2.1 (normal)',
      },
      ribbon:[
        {label:'Dx', done:true},{label:'Stage', done:true},{label:'Surgery(T2)', tier2:true},{label:'MDT', tier2:true},
        {label:'OPRA-consol', box:true},{label:'chemoRT', done:true},{label:'CAPEOX×5', done:true},{label:'cCR', done:true},
        {label:'SURVEILLANCE', here:true, hereNote:'you are here'},
      ],
      tier2Events:1,
      diagnosis:[
        {label:'Histology', value:'Adenocarcinoma, moderately differentiated (G2) [44]'},
        {label:'Stage', value:'cT3c N1b M0 — **Stage IIIB**'},
        {label:'High-risk features', flags:[{t:'MRF threatened (1.6 mm, anterior)', red:true},{t:'EMVI-positive', red:true},{t:'cN1b'}], cite:'[38]'},
        {label:'Location', value:'6 cm from anal verge, anterior, ~40% circumference'},
        {label:'Molecular', value:'pMMR/MSS • KRAS G12V • BRAF WT • HER2− [44]'},
        {label:'Baseline CEA', value:'7.1 ng/mL'},
      ],
      treatment:[
        {phase:'Strategy (locked)', delivered:'OPRA — consolidation arm, organ-preservation intent [32]', key:'Board-decided (Tier 2)'},
        {phase:'Chemoradiation', delivered:'50.4 Gy / 28 fx + concurrent capecitabine 825 mg/m² BID [32]', key:'Completed on schedule'},
        {phase:'Consolidation chemo', delivered:'CAPEOX × 5 cycles [31]', key:'**Overall RDI ~88%** (oxaliplatin reduced C3, held C4–5 for neuropathy)'},
        {phase:'Worst toxicity', delivered:'Grade 2 cumulative neuropathy (stable); grade 1 HFS', key:'No grade ≥3; no red-flags'},
        {phase:'Response', delivered:'**Complete clinical response** — DRE + endoscopy + MRI + CEA all concordant [35]', key:'cCR confirmed → WW'},
      ],
      surveillance:{
        schedule:'NOM schedule (REC-10A) [27]',
        rows:[
          {modality:'DRE + flexible sigmoidoscopy', cadence:'q3–4 mo', last:'1 mo ago', result:'Flat white scar, no regrowth', ok:true, next:'**3 weeks**'},
          {modality:'Rectal MRI', cadence:'q6 mo', last:'4 mo ago', result:'Fibrotic scar, no restricted diffusion', ok:true, next:'**2 months**'},
          {modality:'CEA', cadence:'q3–6 mo', last:'1 mo ago', result:'2.1 (normal)', ok:true, next:'with next visit'},
          {modality:'CT chest/abdomen', cadence:'q6–12 mo', last:'6 mo ago', result:'No lung/liver lesion', ok:true, next:'4 months'},
          {modality:'Colonoscopy', cadence:'at 1 y', last:'pending', result:'—', next:'4 months'},
        ],
      },
      risk:{
        timeBar:{here:8, note:'94% of W&W regrowth occurs <2 y [32]', bands:[{from:0,to:24,level:'red'},{from:24,to:36,level:'amber'},{from:36,to:60,level:'green'}]},
        body:{note:`weighted by this patient's EMVI+/threatened-CRM/N+ features [29][59][46]`, zones:[
          {key:'rectum', label:'Rectal tumor bed (local regrowth — the signature W&W failure, yr 1–2)', level:'red'},
          {key:'lungs', label:'Lungs', level:'amber'},
          {key:'liver', label:'Liver', level:'amber'},
          {key:'nodes', label:'Mesorectal/lateral nodes', level:'amber'},
        ]},
      },
      keyImages:[
        {caption:'Baseline MRI (MRF caliper)', modality:'MRI Pelvis'},
        {caption:'Endoscopic tumor', modality:'Endoscopy (rectal tumor)'},
        {caption:'cCR scar — endoscopy', modality:'Endoscopy (restaging)'},
        {caption:'cCR scar — MRI', modality:'MRI Pelvis (restaging)'},
        {caption:'Worst-cycle HFS photo', modality:'Clinical photo (hand-foot syndrome)'},
      ],
      outstanding:{none:true},
      careStamp:'Surveillance transferred in from [external center]; inbound protocol + delivered doses + cCR restaging verified',
    },
    createdAt: daysAgo(495), lockedAt: daysAgo(440),
    quorum:{invited:7, responded:7},
    specialists:[
      {name:'Dr. [X]', role:'Medical Oncology', status:'responded', initials:'MO'},
      {name:'Colorectal surgeon', role:'Colorectal Surgery', status:'responded', initials:'CS'},
      {name:'Radiation oncologist', role:'Radiation Oncology', status:'responded', initials:'RO'},
      {name:'Radiologist', role:'Radiology', status:'responded', initials:'RD'},
      {name:'Pathologist / molecular pathologist', role:'Pathology / Molecular', status:'responded', initials:'PM'},
      {name:'Enterostomal nurse', role:'Enterostomal Nurse', status:'responded', initials:'EN'},
      {name:'CNS / coordinator', role:'CNS', status:'responded', initials:'CN'},
    ],
    /* "Each specialist's opinion (recorded, attributed)" — the round table, in the document's order. */
    thread:[
      {author:'Radiology', role:'Radiology', time:daysAgo(441), text:`Confirms threatened anterior MRF 1.6 mm + EMVI+ → neoadjuvant therapy mandatory, upfront surgery inadvisable; **MRI will be the primary restaging + surveillance tool** alongside DRE/endoscopy. [38][31]`},
      {author:'Pathology/Molecular', role:'Pathology / Molecular', time:daysAgo(441), text:`pMMR/MSS → immunotherapy arm off the table; conventional TNT applies; tissue banked for possible later metastatic biomarker use. [44]`},
      {author:'Radiation Oncology', role:'Radiation Oncology', time:daysAgo(441), text:`**Long-course chemoradiation over short-course** given high-risk features (threatened MRF, EMVI+, cN-positive) — cites the RAPIDO 5-year locoregional-recurrence signal against short-course in high-risk disease. [40]`},
      {author:'Medical Oncology (chair)', role:'Medical Oncology', time:daysAgo(441), text:`If organ preservation is the goal, choose **consolidation sequencing** — OPRA showed higher long-term organ preservation with consolidation and no DFS penalty. Backbone **FOLFOX or CAPEOX**. [32][28]`},
      {author:'Colorectal Surgery', role:'Colorectal Surgery', time:daysAgo(441), text:`Agrees; upfront TME is the wrong first move with a threatened margin; supports **consolidation-TNT organ-preservation intent** with strict restaging — records a caution (below).`},
      {author:'Enterostomal nurse', role:'Enterostomal Nurse', time:daysAgo(441), text:`Pre-emptive stoma siting + education regardless, so salvage APR (if ever needed) is not delayed.`},
    ],
    mdtRecord:{
      trigger:`Surgery node — threatened CRM in a low-mid tumor; **which strategy/trial** to follow.`,
      quorumPresent:['Medical Oncology (chair/owner)','Colorectal Surgery','Radiation Oncology','Radiology','Pathology/Molecular','Enterostomal nurse','CNS'],
      patientPriority:`avoid a permanent stoma if it is safe.`,
      caseSummary:`57F, ECOG 0. **cT3c N1b M0**, 6 cm from verge, anterior, **MRF threatened 1.6 mm, EMVI+**, **pMMR/MSS**. CEA 7.1. No distant disease.`,
      strategiesIntro:`The MDT is explicitly choosing **between named strategies**, each of which will become the uploaded protocol:`,
      strategies:[
        {name:'**OPRA — consolidation arm** (CRT → consolidation chemo, then W&W if cCR)', commits:'Long-course chemoRT first, then FOLFOX/CAPEOX; restage; **organ preservation** if complete response', bestWhen:'Organ preservation is the goal; low tumor; stoma-averse', evidence:'Higher 5-yr TME-free survival with consolidation **54% vs 39%** (induction); DFS equivalent [32]', chosen:true},
        {name:'**OPRA — induction arm** (chemo → CRT, then W&W if cCR)', commits:'Chemo first, then chemoRT; restage', bestWhen:'Concern for early micrometastatic risk; still organ-preservation-capable', evidence:'Same DFS; **lower** organ preservation than consolidation [32][28]'},
        {name:'**Conventional TNT → mandatory TME** (RAPIDO/PRODIGE-style)', commits:'TNT then planned resection regardless of response', bestWhen:'Margin safety prioritized over rectum preservation', evidence:'Pooled WW vs mandatory-TME: **equivalent DFS/OS** [51]'},
        {name:'**Short-course RT → consolidation**', commits:'5×5 Gy then chemo', bestWhen:'Logistics/older patients', evidence:'**Higher locoregional recurrence** with short-course in high-risk (RAPIDO 5-yr) — a caution here [40]'},
      ],
      dissent:[
        {role:'Colorectal Surgery', text:`I support organ-preservation intent, but the board must log the trade-off: watch-and-wait carries a meaningful local-regrowth risk, and most regrowth happens in the first 2 years — surveillance has to be genuinely intensive, or this is unsafe. [32]`},
        {role:'Radiation Oncology', text:`Restaging must meet all cCR criteria (DRE + endoscopy + MRI). MRI overstages residual disease post-CRT; do not commit to W&W on imaging alone. [35]`},
      ],
    },
    decision:{
      plan:`**Strategy = OPRA consolidation arm.** Long-course chemoRT (capecitabine 825 mg/m² PO BID on RT days, **50.4 Gy/28 fx**) → **consolidation FOLFOX/CAPEOX** → restage → **W&W if cCR**. [32][31]`,
      conditions:`**Organ-preservation intent** declared; restaging within the NCCN window; W&W offered only if **cCR** on DRE + endoscopy + MRI. [35]`,
      contingency:`**If not cCR / regrowth / progression → TME (anticipated LAR vs APR)**, stoma pathway pre-prepared. [35]`,
      alternatives:[
        `Upfront TME — rejected (threatened margin, would forfeit organ-preservation chance). [35]`,
        `Short-course RT — rejected (high-risk locoregional-recurrence signal). [40]`,
        `Induction sequencing — considered; consolidation preferred for organ preservation. [32]`,
        `Neoadjuvant immunotherapy — N/A (pMMR/MSS). [44]`,
      ].join('\n'),
      lockedBy:'Medical Oncology (chair / case owner) — Dr. [X]',
    },
    ceaTrend:[
      {label:'Baseline', value:7.1, date:daysAgo(466)},
      {label:'Restaging (cCR)', value:2.1, date:daysAgo(243)},
      {label:'Surveillance', value:2.1, date:daysAgo(30)},
    ],
    timeline:[
      {stage:'Presentation', date:daysAgo(490), docTitle:'STOP 1 — PRESENTATION', hideImages:true,
        docLines:[
          {l:'Owner', t:`**Medical Oncology (case owner) + surgical DRE**`},
          {l:'Finding', t:`57F, ECOG 0. PR bleeding, tenesmus, narrowed stool caliber ~8 weeks. **DRE:** firm anterior mass, lower edge ~5–6 cm from anal verge, ~40% circumference, mobile/partly tethered, **sphincter tone intact**; no palpable inguinal nodes. No weight loss, no obstructive symptoms.`},
          {l:'Case-specific opinion', t:`"Classic low–mid rectal cancer presentation, resectable-range on exam, sphincter function preserved. History and exam are complete for a rectal primary — nothing here is off-pathway. Tier 1 from my side; proceeding to tissue and local staging."`},
          {l:'Images tab', t:`clinical diagram of tumor position (distance from verge, clock-face, % circumference); optional perineal/DRE schematic. No photographic image at this node.`},
          {l:'Tier mark', t:`**Tier 1.**`, tier:1},
        ],
        summary:`57F, ECOG 0. PR bleeding, tenesmus, narrowed stool caliber ~8 weeks. DRE: firm anterior mass, lower edge ~5–6 cm from anal verge, ~40% circumference, mobile/partly tethered, sphincter tone intact; no palpable inguinal nodes. No weight loss, no obstructive symptoms.`,
        opinion:`Classic low–mid rectal cancer presentation, resectable-range on exam, sphincter function preserved. History and exam are complete for a rectal primary — nothing here is off-pathway. Tier 1 from my side; proceeding to tissue and local staging.`,
        owner:'Medical Oncology (case owner) + surgical DRE', tierMark:{tier:1, reason:''},
        images:[{caption:'Clinical diagram of tumor position (distance from verge, clock-face, % circumference)', keyImage:false, modality:'Schematic diagram'},
                {caption:'Optional perineal/DRE schematic', keyImage:false, modality:'Schematic diagram'}]},
      {stage:'Colonoscopy + Biopsy', date:daysAgo(482), docTitle:'STOP 2 — COLONOSCOPY + BIOPSY',
        docLines:[
          {l:'Owner', t:`**Endoscopy / Gastroenterology**`},
          {l:'Finding', t:`Full colonoscopy to cecum — **no synchronous proximal lesion or polyp**. Fungating mass at 6 cm from verge, biopsied (≥6 adequate cold-forceps samples), **India-ink tattoo placed** just distal to the lesion for future localization. No perforation.`},
          {l:'Case-specific opinion', t:`"Complete clearing scope, no synchronous disease, adequate tissue obtained, lesion tattooed. This is a guideline-concordant staging colonoscopy — Tier 1 from endoscopy." [44]`},
          {l:'Images tab', t:`endoscopic photos — **★KEY IMAGE** of the mass at 6 cm; retroflexed view of distal rectum; tattoo-placement still. Optional short video clip of the lesion.`},
          {l:'Tier mark', t:`**Tier 1.**`, tier:1},
        ],
        summary:`Full colonoscopy to cecum — no synchronous proximal lesion or polyp. Fungating mass at 6 cm from verge, biopsied (≥6 adequate cold-forceps samples), India-ink tattoo placed just distal to the lesion for future localization. No perforation.`,
        opinion:`Complete clearing scope, no synchronous disease, adequate tissue obtained, lesion tattooed. This is a guideline-concordant staging colonoscopy — Tier 1 from endoscopy. [44]`,
        owner:'Endoscopy / Gastroenterology', tierMark:{tier:1, reason:''},
        images:[{caption:'Endoscopic photo — mass at 6 cm from verge', keyImage:true, modality:'Endoscopy (rectal tumor)'},
                {caption:'Retroflexed view of distal rectum', keyImage:false, modality:'Endoscopy (rectal mucosa)'},
                {caption:'Tattoo-placement still', keyImage:false, modality:'Endoscopy (rectal mucosa)'},
                {caption:'Optional short video clip of the lesion', keyImage:false, modality:'Endoscopy (rectal tumor)'}]},
      {stage:'Pathology', date:daysAgo(476), docTitle:'STOP 3 — PATHOLOGY (diagnostic biopsy)',
        docLines:[
          {l:'Owner', t:`**Pathology**`},
          {l:'Finding', t:`**Invasive adenocarcinoma, moderately differentiated (G2)**, arising in a tubulovillous background. Tissue block adequate in quantity/quality for downstream NGS. Time-to-receipt and time-to-report logged.`},
          {l:'Case-specific opinion', t:`"Unequivocal adenocarcinoma, adequately sampled, block sufficient for molecular testing — no ambiguity in the diagnosis. Guideline-concordant → Tier 1 from pathology."`},
          {l:'Images tab', t:`H&E microphotograph (★KEY IMAGE); whole-slide-image (WSI) link; block-adequacy annotation for the molecular lab.`},
          {l:'Tier mark', t:`**Tier 1.**`, tier:1},
        ],
        summary:`Invasive adenocarcinoma, moderately differentiated (G2), arising in a tubulovillous background. Tissue block adequate in quantity/quality for downstream NGS. Time-to-receipt and time-to-report logged.`,
        opinion:`Unequivocal adenocarcinoma, adequately sampled, block sufficient for molecular testing — no ambiguity in the diagnosis. Guideline-concordant → Tier 1 from pathology.`,
        owner:'Pathology', tierMark:{tier:1, reason:''},
        images:[{caption:'H&E microphotograph', keyImage:true, modality:'H&E microphotograph'},
                {caption:'Whole-slide-image (WSI) link', keyImage:false, modality:'H&E microscopy'},
                {caption:'Block-adequacy annotation for the molecular lab', keyImage:false, modality:'H&E microscopy'}]},
      {stage:'Rectal MRI', date:daysAgo(470), docTitle:'STOP 4 — RECTAL-PROTOCOL MRI (the decision-heavy read)',
        docLines:[
          {l:'Owner', t:`**Radiology (abdominal/pelvic)**`},
          {l:'Finding — synoptic report', t:`tumor 6 cm from verge, mid–low rectum, anterior; **cT3c** (extramural depth 9 mm); **MRF (CRM) threatened — shortest tumor-to-fascia distance 1.6 mm anterior**; **EMVI-positive**; **cN1b** (2 morphologically abnormal mesorectal nodes); no lateral pelvic nodes; sphincter complex not involved.`},
          {l:'Case-specific opinion', t:`"The read itself is standard and complete — the tumor is accurately characterized. What matters clinically is the threatened anterior margin plus EMVI positivity. I am confident in the read, so from imaging this is a Tier 1 report — but I am flagging that the threatened margin will drive the treatment decision, and MRI will be the primary restaging/surveillance tool." [38]`},
          {l:'Images tab', t:`axial T2 **★KEY IMAGE** with **MRF caliper (1.6 mm) and threatened margin circled**; sagittal T2 for height/verge distance; DWI. This same image is re-opened and re-annotated by the surgeon at Stop 8 — one image, two specialist layers.`},
          {l:'Tier mark', t:`**Tier 1 for the read.** (The read is concordant; the consequence of the finding is what the surgeon later escalates — the radiologist does not raise the tier for an accurate report.)`, tier:1},
        ],
        summary:`tumor 6 cm from verge, mid–low rectum, anterior; cT3c (extramural depth 9 mm); MRF (CRM) threatened — shortest tumor-to-fascia distance 1.6 mm anterior; EMVI-positive; cN1b (2 morphologically abnormal mesorectal nodes); no lateral pelvic nodes; sphincter complex not involved.`,
        opinion:`The read itself is standard and complete — the tumor is accurately characterized. What matters clinically is the threatened anterior margin plus EMVI positivity. I am confident in the read, so from imaging this is a Tier 1 report — but I am flagging that the threatened margin will drive the treatment decision, and MRI will be the primary restaging/surveillance tool. [38]`,
        owner:'Radiology (abdominal/pelvic)', tierMark:{tier:1, reason:''},
        images:[{caption:'Axial T2 with MRF caliper (1.6 mm) and threatened margin circled', keyImage:true, modality:'MRI Pelvis'},
                {caption:'Sagittal T2 for height/verge distance', keyImage:false, modality:'MRI Pelvis'},
                {caption:'DWI', keyImage:false, modality:'MRI Pelvis'}]},
      {stage:'CT Chest / Abdomen / Pelvis', date:daysAgo(468), docTitle:'STOP 5 — CT CHEST / ABDOMEN / PELVIS',
        docLines:[
          {l:'Owner', t:`**Body imaging (Radiology)**`},
          {l:'Finding', t:`No pulmonary nodules, no hepatic lesions, no distant adenopathy → **M0**. Baseline lung/liver parenchyma documented (becomes the surveillance comparator).`},
          {l:'Case-specific opinion', t:`"No distant disease; this is an M0 staging CT with a clean baseline. Guideline-concordant → Tier 1. Note the clean lung/liver baseline is the reference for surveillance CTs."`},
          {l:'Images tab', t:`representative lung-window and liver-window slices, saved as the **baseline** for later side-by-side surveillance comparison.`},
          {l:'Tier mark', t:`Tier 1.`, tier:1},
        ],
        summary:`No pulmonary nodules, no hepatic lesions, no distant adenopathy → M0. Baseline lung/liver parenchyma documented (becomes the surveillance comparator).`,
        opinion:`No distant disease; this is an M0 staging CT with a clean baseline. Guideline-concordant → Tier 1. Note the clean lung/liver baseline is the reference for surveillance CTs.`,
        owner:'Body imaging (Radiology)', tierMark:{tier:1, reason:''},
        images:[{caption:'Representative lung-window slice, saved as the baseline for later side-by-side surveillance comparison', keyImage:false, modality:'CT Abdomen'},
                {caption:'Representative liver-window slice, saved as the baseline for later side-by-side surveillance comparison', keyImage:false, modality:'CT Abdomen'}]},
      {stage:'CEA', date:daysAgo(466), docTitle:'STOP 6 — CEA (baseline tumor marker)',
        docLines:[
          {l:'Owner', t:`**Medical Oncology (labs)**`},
          {l:'Finding', t:`**Baseline CEA 7.1 ng/mL** (mildly elevated). Plotted as the first point on the longitudinal CEA trend that will run through treatment and surveillance.`},
          {l:'Case-specific opinion', t:`"Mildly elevated baseline CEA — expected, and useful because a marker that normalizes and then re-rises is one of our surveillance triggers. Tier 1; baseline anchored."`},
          {l:'Images tab', t:`n/a (numeric trend graph rather than image).`},
          {l:'Tier mark', t:`**Tier 1.**`, tier:1},
        ],
        summary:`Baseline CEA 7.1 ng/mL (mildly elevated). Plotted as the first point on the longitudinal CEA trend that will run through treatment and surveillance.`,
        opinion:`Mildly elevated baseline CEA — expected, and useful because a marker that normalizes and then re-rises is one of our surveillance triggers. Tier 1; baseline anchored.`,
        owner:'Medical Oncology (labs)', tierMark:{tier:1, reason:''}, images:[]},
      {stage:'Molecular / NGS', date:daysAgo(460), docTitle:'STOP 7 — MOLECULAR / NGS (branch-gate)',
        docLines:[
          {l:'Owner', t:`**Molecular Pathology**`},
          {l:'Finding', t:`**pMMR / MSS** (IHC + PCR concordant); **KRAS G12V mutant; BRAF wild-type; HER2 negative**. Tissue banked for possible later metastatic biomarker use.`},
          {l:'Case-specific opinion', t:`"MMR/MSI is the gate here. She is **pMMR/MSS**, so the dostarlimab neoadjuvant-immunotherapy arm (REC-14) is **off the table**, and the case routes down the **pMMR/MSS TNT algorithm (REC-6)**. Testing is complete and correctly performed → Tier 1 from molecular. Had this returned dMMR/MSI-H, I would have re-routed the entire downstream skeleton." [44]`},
          {l:'Images tab', t:`MMR IHC panel (MLH1/PMS2/MSH2/MSH6 all retained); NGS report page.`},
          {l:'Tier mark', t:`**Tier 1 (branch-gate).**`, tier:1},
        ],
        summary:`pMMR / MSS (IHC + PCR concordant); KRAS G12V mutant; BRAF wild-type; HER2 negative. Tissue banked for possible later metastatic biomarker use.`,
        opinion:`MMR/MSI is the gate here. She is pMMR/MSS, so the dostarlimab neoadjuvant-immunotherapy arm (REC-14) is off the table, and the case routes down the pMMR/MSS TNT algorithm (REC-6). Testing is complete and correctly performed → Tier 1 from molecular. Had this returned dMMR/MSI-H, I would have re-routed the entire downstream skeleton. [44]`,
        owner:'Molecular Pathology', tierMark:{tier:1, reason:'branch-gate'},
        images:[{caption:'MMR IHC panel (MLH1/PMS2/MSH2/MSH6 all retained)', keyImage:false, modality:'H&E microscopy'},
                {caption:'NGS report page', keyImage:false, modality:'Report page'}]},
      {stage:'Surgical Evaluation', date:daysAgo(450), docTitle:'STOP 8 — SURGICAL EVALUATION',
        redNode:true, redReason:'threatened CRM — strategy decision',
        docLines:[
          {l:'Owner', t:`**Colorectal Surgeon**`},
          {l:'Finding', t:`Independent flex-sig + DRE — anterior low–mid tumor at 6 cm, partly tethered; sphincter tone intact. Reviewed radiologist's annotated MRI directly.`},
          {l:'Case-specific opinion (verbatim style)', t:`"Threatened anterior MRF (1.6 mm) plus a low-mid anterior tumor means upfront TME risks a positive margin and likely commits her toward a low anterior resection with a high stoma risk — possibly APR. But she is exactly the OPRA-type patient in whom consolidation TNT could achieve a complete clinical response and let us preserve the rectum. Which strategy we pick — conventional TNT→TME vs organ-preservation watch-and-wait — is a whole-team and patient decision. Marking Tier 2." [32][35]`},
          {l:'Images tab', t:`Surgeon annotation layer **stacked on the radiologist's axial T2**, captioned "threatened CRM + low-mid anterior tumor → TME/APR vs organ-preservation — needs board."`},
          {l:'Tier mark', t:`**TIER 2 — escalate to synchronous MDT.**`, tier:2},
        ],
        summary:`Independent flex-sig + DRE — anterior low–mid tumor at 6 cm, partly tethered; sphincter tone intact. Reviewed radiologist's annotated MRI directly.`,
        opinion:`Threatened anterior MRF (1.6 mm) plus a low-mid anterior tumor means upfront TME risks a positive margin and likely commits her toward a low anterior resection with a high stoma risk — possibly APR. But she is exactly the OPRA-type patient in whom consolidation TNT could achieve a complete clinical response and let us preserve the rectum. Which strategy we pick — conventional TNT→TME vs organ-preservation watch-and-wait — is a whole-team and patient decision. Marking Tier 2. [32][35]`,
        owner:'Colorectal Surgeon', tierMark:{tier:2, reason:`threatened CRM in a low-mid tumor; which strategy/trial to follow`},
        images:[{caption:`Surgeon annotation layer stacked on the radiologist's axial T2 — "threatened CRM + low-mid anterior tumor → TME/APR vs organ-preservation — needs board."`, keyImage:false, modality:'MRI Pelvis'}]},
      {stage:'Tier 2 MDT', kind:'mdt', date:daysAgo(440), docTitle:'STOP 9 — TIER 2 SYNCHRONOUS MDT (strategy selection)', owner:'MDT chair / case owner',
        redNode:true, redReason:'threatened CRM — strategy decision',
        summary:`Tier 2 synchronous MDT — strategy selection.`,
        images:[{caption:'Decision-tree diagram comparing four rectal cancer strategies', keyImage:false, modality:'Strategy decision tree'}]},
      {stage:'Trial Box', date:daysAgo(440), docTitle:'STOP 10 — TRIAL BOX (the locked strategy becomes the protocol)', owner:'Case owner (Med Onc)',
        docLines:[{l:'Owner', t:`**Case owner (Med Onc)**`}],
        summary:`Populated automatically from the MDT decision.`},
      {stage:'Long-Course Chemoradiation', date:daysAgo(390), docTitle:'STOP 11 — LONG-COURSE CHEMORADIATION',
        docLines:[
          {l:'Owner', t:`**Radiation Oncology + Med Onc**`},
          {l:'Finding / delivered', t:`50.4 Gy in 28 fractions to mesorectum ± nodal basins, concurrent capecitabine 825 mg/m² BID on RT days. Completed on schedule; acute toxicity: grade 1 proctitis, grade 1 dermatitis. [32]`},
          {l:'Images tab', t:`RT plan isodose screenshot; on-treatment CBCT thumbnails; toxicity photos if relevant.`},
          {l:'Tier mark', t:`**Tier 1** (protocol-concordant delivery).`, tier:1},
        ],
        summary:`50.4 Gy in 28 fractions to mesorectum ± nodal basins, concurrent capecitabine 825 mg/m² BID on RT days. Completed on schedule; acute toxicity: grade 1 proctitis, grade 1 dermatitis. [32]`,
        owner:'Radiation Oncology + Med Onc', tierMark:{tier:1, reason:'protocol-concordant delivery'},
        images:[{caption:'RT plan isodose screenshot', keyImage:false, modality:'RT plan'},
                {caption:'On-treatment CBCT thumbnails', keyImage:false, modality:'CBCT'},
                {caption:'Toxicity photos if relevant', keyImage:false, modality:'Clinical photo'}]},
      {stage:'Consolidation Chemotherapy', date:daysAgo(278), docTitle:'STOP 12 — CONSOLIDATION CHEMOTHERAPY (auto-generated blocks + dose-intensity tracking)', owner:'Medical Oncology',
        docLines:[
          {l:'Owner', t:`**Medical Oncology**`},
        ],
        docText:`The clinician only **selects the regimen** (here CAPEOX ×5, per protocol); Milestone builds the **5 cycle blocks** and computes dates, planned vs actual dose, and **dose intensity**. Example populated blocks:`,
        docLinesAfter:[
          {l:'Tier mark', t:`**Tier 1** (protocol-concordant; toxicity captured, graded, photographed, and managed on-protocol — flags surfaced, no new decision).`, tier:1},
        ],
        summary:`The clinician only selects the regimen (here CAPEOX ×5, per protocol); Milestone builds the 5 cycle blocks and computes dates, planned vs actual dose, and dose intensity.`,
        tierMark:{tier:1, reason:'protocol-concordant; toxicity captured, graded, photographed, and managed on-protocol — flags surfaced, no new decision'}},
      {stage:'Restaging (cCR)', date:daysAgo(243), docTitle:'STOP 13 — RESTAGING / RESPONSE ASSESSMENT (cCR determination)',
        docLines:[
          {l:'Owner', t:`**Colorectal Surgery + Radiology + Med Onc (joint)**`},
          {l:'Finding — full cCR work per NCCN REC-H criteria', t:`[35]\n**DRE:** smooth flat scar, no nodularity/ulcer.\n**Endoscopy:** pale flat white scar with telangiectasia, **no residual ulcer/mass** → ★KEY IMAGE.\n**MRI (T2 + DWI):** fibrotic low-signal scar, **no restricted diffusion**, no suspicious nodes → ★KEY IMAGE.\n**CEA:** normalized to 2.1 ng/mL.\n**All cCR criteria met.**`},
          {l:'Case-specific opinion', t:`Complete clinical response documented on all three modalities per protocol → **eligible for watch-and-wait**, consistent with locked plan and patient preference. [35][32]`},
          {l:'Tier mark', t:`**Tier 1** (cCR meets pre-agreed criteria; proceeds on the already-locked Tier 2 plan — no re-escalation needed). If cCR had **not** been met, the pre-agreed contingency (→ TME) would fire and a **new surgical-planning node** would open.`, tier:1},
        ],
        summary:`Full cCR work per NCCN REC-H criteria: DRE: smooth flat scar, no nodularity/ulcer. Endoscopy: pale flat white scar with telangiectasia, no residual ulcer/mass. MRI (T2 + DWI): fibrotic low-signal scar, no restricted diffusion, no suspicious nodes. CEA: normalized to 2.1 ng/mL. All cCR criteria met. [35]`,
        opinion:`Complete clinical response documented on all three modalities per protocol → eligible for watch-and-wait, consistent with locked plan and patient preference. [35][32]`,
        owner:'Colorectal Surgery + Radiology + Med Onc (joint)', tierMark:{tier:1, reason:'cCR meets pre-agreed criteria; proceeds on the already-locked Tier 2 plan — no re-escalation needed'},
        images:[{caption:'Endoscopy: pale flat white scar with telangiectasia, no residual ulcer/mass', keyImage:true, modality:'Endoscopy (restaging)'},
                {caption:'MRI (T2 + DWI): fibrotic low-signal scar, no restricted diffusion, no suspicious nodes', keyImage:true, modality:'MRI Pelvis (restaging)'}]},
      {stage:'Surveillance Dashboard', date:daysAgo(230), docTitle:'STOP 14 — SURVEILLANCE DASHBOARD (our hospital picks up here)', owner:'shared — Med Onc + Colorectal Surgery + Radiology; coordinated by CNS',
        docLines:[
          {l:'Owner', t:`**shared — Med Onc + Colorectal Surgery + Radiology; coordinated by CNS**`},
        ],
        docText:`This is the phase the referring center hands over to us. The dashboard has three linked panels.`,
        summary:`This is the phase the referring center hands over to us.`,
        tierMark:{tier:1, reason:'while stable; auto-re-escalates to Tier 2 on any trigger above'}},
    ],
    trialBox:{
      pdfName:'OPRA consolidation arm',
      schemaSteps:['CRT','consolidation chemo','restage','selective W&W'], cite:'[32]',
      params:[
        {label:'RT', value:'50.4 Gy / 28 fractions, concurrent capecitabine', cite:'[32]'},
        {label:'Consolidation chemo', value:'**FOLFOX (8 × q2-week cycles) or CAPEOX (5 × q3-week cycles)**', cite:'[31]'},
        {label:'Restaging window + cCR criteria', value:'', cite:'[35]'},
        {label:'Surveillance cadence if W&W', value:'', cite:'[27][31]'},
      ],
    },
    chemo:{
      regimen:'CAPEOX', numCycles:5, cycleDays:21, cite:'[31]', overallRdi:'~88%', rdiFlagBelow:85,
      drugs:[
        {key:'oxali', name:'Oxaliplatin', dose:'130 mg/m² d1', mgm2PerCycle:130},
        {key:'cape', name:'Capecitabine', dose:'1000 mg/m² BID d1–14', mgm2PerCycle:28000},
      ],
      cycles:[
        {n:1, day:0, date:daysAgo(364), actual:'100%', reduction:'none', delay:'none', delayDays:0, rdi:'100%', rdiNum:100, oxaliPct:100, capePct:100,
          toxicities:[{key:'nausea', grade:1},{key:'neuropathy_chronic', grade:1}], photos:[]},
        {n:2, day:21, date:daysAgo(343), actual:'100%', reduction:'none', delay:'none', delayDays:0, rdi:'100%', rdiNum:100, oxaliPct:100, capePct:100,
          toxicities:[{key:'neuropathy_chronic', grade:2},{key:'diarrhea', grade:1}], photos:[]},
        {n:3, day:44, date:daysAgo(320), actual:'Oxaliplatin **75%** (neuropathy)', reduction:'Oxali −25%', delay:'+2 d', delayDays:2, rdi:'~88%', rdiNum:88, oxaliPct:75, capePct:100,
          toxicities:[{key:'neuropathy_chronic', grade:2},{key:'fatigue', grade:1}], photos:[]},
        {n:4, day:65, date:daysAgo(299), actual:'Oxaliplatin **held**, cape 100%', reduction:'Oxali held', delay:'none', delayDays:0, rdi:'~80%', rdiNum:80, oxaliPct:0, capePct:100,
          toxicities:[{key:'neuropathy_chronic', grade:2, note:'stable'},{key:'hfs', grade:1}],
          photos:[{tox:'hfs', grade:1, caption:'Palms and soles — cycle 4 (worst cycle)', keyImage:true, modality:'Clinical photo (hand-foot syndrome)', ts:daysAgo(299)}]},
        {n:5, day:86, date:daysAgo(278), actual:'Cape 100% (oxali held)', reduction:'—', delay:'none', delayDays:0, rdi:'—', rdiNum:null, oxaliPct:0, capePct:100,
          toxicities:[{key:'fatigue', grade:1}], photos:[]},
      ],
    },
    survDash:{
      endpoint:'NOM', nowMonth:8,
      handover:{from:'[external center]', required:[
        {label:'Protocol used', stage:'Trial Box'},
        {label:'Delivered doses / RDI', stage:'Consolidation Chemotherapy'},
        {label:'Restaging that established cCR', stage:'Restaging (cCR)'},
      ]},
      bands:[
        {from:0, to:24, level:'red', why:`in OPRA W&W, **94% of local regrowths occurred within 2 years**; in surgical series **~80% of all recurrences occurred within ~2.2 years**. [32][59]`},
        {from:24, to:36, level:'amber', why:`residual hazard: **99% of regrowth by 3 years**. [32]`},
        {from:36, to:60, level:'green', why:`regrowth after 3 years is rare; taper cadence. [32]`},
      ],
          },
  },
];

/* ============================================================
   EXTERNAL / OUTSIDE RECORDS — Stop 0
   Per "External / Outside Records Tab" spec: a dedicated node before
   Stop 1, holding claims (not confirmed facts) from care that happened
   elsewhere. Every item is tagged "External — not verified in-house"
   until repeated or formally re-read here.
   ============================================================ */
const EXTERNAL_DOC_TYPES = [
  {tab:'imaging', label:'CT chest w/contrast'},
  {tab:'imaging', label:'PET/CT'},
  {tab:'imaging', label:'MRI'},
  {tab:'imaging', label:'Chest X-ray (CXR)'},
  {tab:'imaging', label:'Bone scan'},
  {tab:'imaging', label:'Ultrasound'},
  {tab:'imaging', label:'V/Q scan'},
  {tab:'pathology', label:'Biopsy report'},
  {tab:'pathology', label:'Cytology report'},
  {tab:'pathology', label:'Outside slides (for review)'},
  {tab:'pathology', label:'Prior molecular / NGS report'},
  {tab:'pathology', label:'PD-L1 report'},
  {tab:'labs', label:'CBC'},
  {tab:'labs', label:'Chemistry panel'},
  {tab:'labs', label:'LFTs'},
  {tab:'labs', label:'Tumour markers'},
  {tab:'labs', label:'Coagulation profile'},
  {tab:'labs', label:'ABG'},
  {tab:'functional', label:'PFTs / spirometry'},
  {tab:'functional', label:'DLCO'},
  {tab:'functional', label:'Echocardiogram'},
  {tab:'functional', label:'ECG'},
  {tab:'functional', label:'6-minute walk test'},
  {tab:'priorTx', label:'Prior chemotherapy record'},
  {tab:'priorTx', label:'Prior radiotherapy record (dose/fractions)'},
  {tab:'priorTx', label:'Prior surgery / op note'},
  {tab:'priorTx', label:'Prior immunotherapy record'},
  {tab:'discharge', label:'Referral letter'},
  {tab:'discharge', label:'Discharge summary'},
  {tab:'discharge', label:'Clinic letter'},
  {tab:'discharge', label:'Outside MDT note'},
  {tab:'other', label:'Other'},
];
const EXTERNAL_TAB_META = {
  imaging:{label:'Imaging', icon:'image'},
  pathology:{label:'Pathology / Slides', icon:'assessment'},
  labs:{label:'Labs', icon:'library'},
  functional:{label:'Functional', icon:'stetho'},
  priorTx:{label:'Prior Treatment', icon:'timer'},
  discharge:{label:'Discharge / Referral', icon:'book'},
  other:{label:'Other', icon:'assessment'},
};
const EXT_VERIFY_META = {
  'External – not verified': {cls:'badge-neutral'},
  'In-house re-read requested': {cls:'badge-gold'},
  'Confirmed in-house': {cls:'badge-tier1'},
  'Superseded by in-house': {cls:'badge-info'},
};
const EXTERNAL_RECORDS_DATA = {
  '4417': {
    sourceFacility:'Sunrise Family Clinic',
    referredDate: daysAgo(23),
    nutshell:'Referred from Sunrise Family Clinic after an outside CXR showed a RUL opacity — full diagnostic workup and staging completed in-house.',
    docs:[
      {id:'ext-4417-1', tab:'imaging', docType:'Chest X-ray (CXR)', sourceFacility:'Sunrise Family Clinic', dateOfInvestigation:daysAgo(24), dateReceived:daysAgo(23), uploadedBy:'Dr. A. Rao', verificationStatus:'Superseded by in-house', keyFinding:'RUL opacity suspicious for mass; recommend CT chest for further characterisation.', linkedStop:'Staging (CT / PET / Brain MRI)', files:['CXR report.pdf','CXR image.jpg']},
      {id:'ext-4417-2', tab:'discharge', docType:'Referral letter', sourceFacility:'Sunrise Family Clinic', dateOfInvestigation:daysAgo(23), dateReceived:daysAgo(23), uploadedBy:'Dr. A. Rao', verificationStatus:'External – not verified', keyFinding:'Persistent cough and 4kg (11%) weight loss over 8 weeks; ex-smoker, 35 pack-years; ECOG 1. CXR shows RUL opacity — refer for full diagnostic workup.', autoExcerpted:true, linkedStop:'Presentation & History', files:['Referral letter.pdf']},
    ],
  },
  '3782': {
    sourceFacility:'Lakeview Pulmonology Clinic',
    referredDate: daysAgo(62),
    nutshell:'Referred from Lakeview Pulmonology Clinic for a chronic cough of 10 weeks in a current smoker — full diagnostic workup completed in-house.',
    docs:[
      {id:'ext-3782-1', tab:'discharge', docType:'Referral letter', sourceFacility:'Lakeview Pulmonology Clinic', dateOfInvestigation:daysAgo(62), dateReceived:daysAgo(62), uploadedBy:'Dr. A. Rao', verificationStatus:'External – not verified', keyFinding:'Chronic cough 10 weeks; current smoker, 48 pack-years; ECOG 1. Referred for further pulmonology workup.', autoExcerpted:true, linkedStop:'Presentation & History', files:['Referral letter.pdf']},
    ],
  },
  '7101': {
    sourceFacility:'District General Hospital',
    referredDate: daysAgo(23),
    nutshell:'Referred from District General Hospital after an outside contrast CT (done for cough + blood-streaked sputum) showed a right upper lobe mass with enlarged mediastinal nodes — full diagnostic workup, staging and pre-treatment assessment completed in-house.',
    docs:[
      {id:'ext-7101-1', tab:'imaging', docType:'CT chest (outside)', sourceFacility:'District General Hospital', dateOfInvestigation:daysAgo(24), dateReceived:daysAgo(23), uploadedBy:'Dr. A. Rao', verificationStatus:'Superseded by in-house', keyFinding:'4–5cm right upper lobe mass, mediastinal nodes enlarged — incidental finding on CT done for 3 weeks of cough + one episode of blood-streaked sputum. Re-read requested in-house.', autoExcerpted:true, linkedStop:'CT Chest/Abdomen (Diagnostic Imaging)', files:['Outside CT chest.pdf']},
      {id:'ext-7101-2', tab:'discharge', docType:'Referral letter', sourceFacility:'District General Hospital', dateOfInvestigation:daysAgo(23), dateReceived:daysAgo(23), uploadedBy:'Dr. A. Rao', verificationStatus:'External – not verified', keyFinding:'63M, 6 weeks dry cough, 2 episodes scant hemoptysis, ~4kg weight loss over 2 months. Ex-smoker, 40 pack-years. Outside CT shows RUL mass with enlarged mediastinal nodes — refer for full diagnostic workup and staging.', autoExcerpted:true, linkedStop:'Presentation & History', files:['Referral letter.pdf']},
    ],
  },
  '33-55-902': {
    sourceFacility:'[external center]',
    referredDate: daysAgo(495),
    nutshell:`Referred from an outside center. Inbound documents attached: outside colonoscopy report + still images, outside biopsy slides (for in-house review), one prior CT. Discharge summary auto-parsed into the banner (demographics, presenting complaint, referring diagnosis "rectal mass").`,
    docTitle:'STOP 0 — EXTERNAL RECORDS INTAKE',
    docLines:[
      {l:'Owner', t:`**Case coordinator / CNS (data-entry + verify)**`},
      {l:'Finding', t:`Referred from an outside center. Inbound documents attached: outside colonoscopy report + still images, outside biopsy slides (for in-house review), one prior CT. Discharge summary auto-parsed into the banner (demographics, presenting complaint, referring diagnosis "rectal mass").`},
      {l:'Case-specific opinion', t:`"External material logged and flagged for in-house re-read where it drives management (slides to our pathology; imaging to our radiology). Nothing external is auto-trusted as a finding until re-verified."`},
      {l:'Images tab', t:`outside colonoscopy stills + outside CT, all stamped **[ext] read-only** so they can never be confused with in-house acquisitions.`},
      {l:'Tier mark', t:`**Tier 1** (intake/verify step — no clinical decision).`, tier:1},
    ],
    docs:[],
  },
  '2910': {
    sourceFacility:'City General Hospital — Emergency Dept',
    referredDate: daysAgo(86),
    nutshell:'Referred urgently from City General Hospital ED after hemoptysis with a suspicious outside CXR finding — full diagnostic workup and staging completed in-house.',
    docs:[
      {id:'ext-2910-1', tab:'imaging', docType:'Chest X-ray (CXR)', sourceFacility:'City General Hospital', dateOfInvestigation:daysAgo(86), dateReceived:daysAgo(86), uploadedBy:'Dr. A. Rao', verificationStatus:'Superseded by in-house', keyFinding:'Right-sided opacity, suspicious for malignancy; urgent referral recommended.', linkedStop:'Staging (CT / PET / Brain MRI)', files:['CXR report.pdf']},
      {id:'ext-2910-2', tab:'discharge', docType:'Referral letter', sourceFacility:'City General Hospital — Emergency Dept', dateOfInvestigation:daysAgo(86), dateReceived:daysAgo(86), uploadedBy:'Dr. A. Rao', verificationStatus:'External – not verified', keyFinding:'Hemoptysis — red-flag referral. Ex-smoker, 30 pack-years; ECOG 1. Urgent CXR shows right-sided opacity.', autoExcerpted:true, linkedStop:'Presentation & History', files:['ED referral letter.pdf']},
    ],
  },
};
/* Every case gets a Stop 0 node, whether populated or not — the structural slot for
   "where the patient's story truly began" always exists, per the spec's timeline mock. */
CASES.forEach(c=>{
  const ext = EXTERNAL_RECORDS_DATA[c.id];
  c.externalRecords = ext || null;
  c.timeline.unshift({
    stage:'External Records', owner: ext ? ext.sourceFacility : null, date: ext ? ext.referredDate : null,
    summary: ext ? ext.nutshell : 'No outside records on file — presented directly for in-house workup.',
    external:true, naByDesign: !ext,
  });
});

/* ---------------- untriaged referral queue (for Triage screen) ---------------- */
const REFERRALS = [
  {
    id:'REF-9001', patient:{initials:'N.C.', age:56, sex:'F'}, tumourType:'Breast',
    diagnosis:'Left breast lump, 2.1cm, palpable axillary node',
    signals:{guidelineConcordant:false, specialtiesNeeded:2, imagingAmbiguous:false, borderlineResectable:false},
    chips:['Nodal involvement suspected','Standard workup complete'],
    createdAt:hoursAgo(3),
  },
  {
    id:'REF-9002', patient:{initials:'G.V.', age:64, sex:'M'}, tumourType:'Lung',
    diagnosis:'Incidental 8mm RUL nodule on CT, low-risk profile',
    signals:{guidelineConcordant:true, specialtiesNeeded:1, imagingAmbiguous:false, borderlineResectable:false},
    chips:['Guideline-concordant surveillance','Low nodule risk score'],
    createdAt:hoursAgo(9),
  },
  {
    id:'REF-9003', patient:{initials:'H.S.', age:49, sex:'F'}, tumourType:'Cervix',
    diagnosis:'FIGO IIB cervical cancer, parametrial involvement uncertain on MRI',
    signals:{guidelineConcordant:false, specialtiesNeeded:4, imagingAmbiguous:true, borderlineResectable:true},
    chips:['Imaging ambiguous','Multi-specialty input needed','Borderline surgical candidate'],
    createdAt:hoursAgo(14),
  },
];

/* ---------------- notifications ---------------- */
const NOTIFICATIONS = [];

/* ============================================================
   APP STATE
   ============================================================ */
const STATE = {
  page:'start',
  params:{}, onbStep:0,
  casesFilter:{search:'', tier:'all', pathway:'all', status:'all'},
  libraryFilter:{search:'', dept:'all', tier:'all', outcome:'all', dissentOnly:false, teaching:false},
  assessmentTemplate:'Lung',
  assessmentValues:{},
  assessmentAccordion:{},
  autoFilledFields:{}, // templateKey -> Set(fieldKey) of AI-extracted, not-yet-verified fields
  stepZero:{ files:{summary:false, petct:false, biopsy:false}, fileNames:{}, panelOpen:false },
  workspaceTab:{}, // caseId -> tab name
  timelineActive:{}, // caseId -> stage index
  chemoActive:{}, // caseId -> selected consolidation-chemo cycle index
  formNode:{}, formDraft:{}, formErrors:{}, // Node Forms tab: selected node, in-progress drafts, sign-out errors
  treatmentCycleActive:{}, // caseId -> cycle index
  adjuvantCycleActive:{}, // caseId -> adjuvant infusion cycle index
  oralReviewActive:{}, // caseId -> oral-TKI review index
  surveillanceVisitActive:{}, // caseId -> surveillance visit index
  fitnessDraft:{}, // caseId -> in-progress Stop 5 fitness-calculator field values
  redFlags:[], // New Assessment (Stop 1) — checked red-flag emergency items, reset after case creation
  comorbidities:[], // New Assessment (Stop 1) — checked comorbidity items, reset after case creation
  cycleStatusDraft:{}, // cycle uid -> 'Given'|'Delayed'|'Cancelled', selected before logging
  emrFetched:{}, // caseId -> whether Clinical History intake fields were auto-fetched from the hospital EMR/LIS/RIS (demo)
};

function findCase(id){ return CASES.find(c => c.id === id); }
function caseTitle(c){ return (c.tumourType && c.tumourType!=='—') ? c.tumourType+' · '+c.diagnosis : c.diagnosis; }
function pathwayOf(c){ return c.pathway; }

/* Generic fallback pathway (non-lung tumour types, where a full guideline-mapped
   stop sequence hasn't been specified yet). */
const GENERIC_STAGES = [
  {stage:'Presentation', owner:'Intake / Referral'},
  {stage:'Endoscopy', owner:'Procedural service'},
  {stage:'Biopsy', owner:'Pathology'},
  {stage:'Imaging', owner:'Radiology'},
  {stage:'Molecular', owner:'Molecular Pathology'},
  {stage:'Surgery', owner:'Surgery'},
  {stage:'Pathology', owner:'Pathology'},
  {stage:'Adjuvant', owner:'Medical Oncology'},
];
/* The 13-stop NSCLC pathway, mapped to NCCN anchors — this is the guideline-mirrored
   sequence a patient actually moves through, not a generic placeholder list. */
const LUNG_STOPS = [
  {stage:'Presentation & History', owner:'Intake / Pulmonology'},
  {stage:'Diagnostic Workup / Biopsy', owner:'Interventional Pulmonology'},
  {stage:'Pathology (Histo + IHC)', owner:'Pathology'},
  {stage:'Staging (CT / PET / Brain MRI)', owner:'Radiology'},
  {stage:'Fitness / Functional Assessment', owner:'Pulmonology / Thoracic Surgery'},
  {stage:'Molecular NGS + PD-L1', owner:'Molecular Pathology'},
  {stage:'MDT Decision Lock', owner:'All specialties'},
  {stage:'Neoadjuvant Therapy', owner:'Medical Oncology'},
  {stage:'Restaging / Resectability', owner:'Radiology + MDT'},
  {stage:'Surgery', owner:'Thoracic Surgery'},
  {stage:'Surgical Pathology', owner:'Pathology'},
  {stage:'Adjuvant Therapy', owner:'Medical Oncology'},
  {stage:'Surveillance', owner:'All'},
];
function stagesForTumourType(tumourType){
  return (tumourType==='Lung' ? LUNG_STOPS : GENERIC_STAGES).map(s=>({stage:s.stage, owner:s.owner, date:null, summary:'Not yet recorded.'}));
}
/* "On lock, the milestone is created on the patient timeline" (Stop 7 spec) — every
   decision-lock action in the app calls this to mark its matching timeline stop
   complete, rather than leaving pre-seeded cases as the only ones with a populated
   Clinical History stepper. */
function markStageComplete(c, stageName, summary, extra){
  const stage = c.timeline.find(t=>t.stage===stageName);
  if(!stage) return;
  stage.date = new Date();
  stage.summary = summary;
  if(extra) Object.assign(stage, extra);
}

function computeReferralTier(signals){
  if(signals.borderlineResectable || signals.specialtiesNeeded>=4 || signals.imagingAmbiguous) return 3;
  if(!signals.guidelineConcordant || signals.specialtiesNeeded>=2) return 2;
  return 1;
}

/* ---------------- toast ---------------- */
function toast(msg){
  const host = document.getElementById('toastHost');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .25s'; setTimeout(()=>el.remove(),260); }, 3200);
}

/* ---------------- modal ---------------- */
function openModal(innerHtml, opts){
  opts = opts || {};
  const host = document.getElementById('modalHost');
  host.innerHTML =
    '<div class="modal-backdrop" id="modalBackdrop">'+
      '<div class="modal '+(opts.wide?'modal-wide':'')+'" role="dialog" aria-modal="true">'+innerHtml+'</div>'+
    '</div>';
  const backdrop = document.getElementById('modalBackdrop');
  backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', escCloseOnce);
}
function escCloseOnce(e){ if(e.key==='Escape'){ closeModal(); } }
function closeModal(){
  document.getElementById('modalHost').innerHTML = '';
  document.removeEventListener('keydown', escCloseOnce);
}

/* ---------------- nav config ---------------- */
const NAV = [
  {group:'Overview', items:[
    {id:'start', label:'Getting started', icon:'dashboard'},
  ]},
  {group:'Workflow', items:[
    {id:'cases', label:'Cases', icon:'cases', count:()=>CASES.length},
  ]},
];
const PAGE_META = {
  start:{title:'Getting started', sub:'How Milestone brings every specialist and every record into one case'},
  triage:{title:'Triage Queue', sub:'Automated case triage — route referrals to the right tier'},
  cases:{title:'Cases', sub:'Worked cases — referral through locked MDT decision and surveillance'},
  workspace:{title:'Case Workspace', sub:''},
  assessment:{title:'New Assessment', sub:'Disease-specific structured intake, built for the MDT'},
  library:{title:'Case Library', sub:'Institutional memory — searchable reasoning, outcomes, and dissent'},
  pathways:{title:'Pathways', sub:'One platform, every department'},
};

/* ============================================================
   ROUTER
   ============================================================ */
function navigate(page, params){
  STATE.page = page;
  STATE.params = params || {};
  const hash = '#/'+page+(params && params.id ? '/'+params.id : '');
  if(location.hash !== hash) history.pushState(null,'',hash);
  renderPage();
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
}

function parseHash(){
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  return {page: parts[0] || 'start', id: parts[1] || null};
}

window.addEventListener('popstate', ()=>{
  const {page, id} = parseHash();
  STATE.page = page;
  STATE.params = id ? {id} : {};
  renderPage();
});

function renderSidebar(){
  const nav = document.getElementById('navList');
  nav.innerHTML = NAV.map(group =>
    '<div class="nav-label">'+esc(group.group)+'</div>' +
    group.items.map(item => {
      const active = STATE.page === item.id;
      const count = item.count ? item.count() : null;
      return '<a class="nav-link '+(active?'active':'')+'" data-nav="'+item.id+'" title="'+esc(item.label)+'">' +
        icon(item.icon) + '<span>'+esc(item.label)+'</span>' +
        (count!=null ? '<span class="count">'+count+'</span>' : '') +
      '</a>';
    }).join('')
  ).join('');
  nav.querySelectorAll('[data-nav]').forEach(a=>{
    a.addEventListener('click', ()=> navigate(a.getAttribute('data-nav')));
  });
}

function renderPage(){
  renderSidebar();
  const meta = PAGE_META[STATE.page] || PAGE_META.start;
  document.getElementById('pageTitle').textContent = meta.title;
  document.getElementById('pageSubtitle').textContent = meta.sub;
  const content = document.getElementById('content');

  let html = '';
  switch(STATE.page){
    case 'start': html = renderOnboarding(); break;
    case 'triage': html = renderTriage(); break;
    case 'cases': html = renderCases(); break;
    case 'workspace': html = renderWorkspace(STATE.params.id); break;
    case 'assessment': html = renderAssessment(); break;
    case 'library': html = renderLibrary(); break;
    case 'pathways': html = renderPathways(); break;
    default: html = renderOnboarding();
  }
  content.innerHTML = '<div class="page active">'+html+'</div>';
  wirePageEvents();
  syncTabScroll();
  syncStepperScroll();
}
/* The timeline stepper is re-drawn on every click; keep where it was scrolled to, and make
   sure the active step is never left off-screen (steps past the fold need scrolling right). */
function syncStepperScroll(){
  if(!STATE.stepperScroll) STATE.stepperScroll = {};
  document.querySelectorAll('.stepper[id^="stepper-"]').forEach(el=>{
    const key = el.id;
    if(STATE.stepperScroll[key]) el.scrollLeft = STATE.stepperScroll[key];
    const cur = el.querySelector('.step.current');
    if(cur){
      const er = el.getBoundingClientRect(), cr = cur.getBoundingClientRect();
      if(cr.left < er.left || cr.right > er.right) el.scrollLeft += (cr.left + cr.right)/2 - (er.left + er.right)/2;
    }
    STATE.stepperScroll[key] = el.scrollLeft;
    el.addEventListener('scroll', ()=>{ STATE.stepperScroll[key] = el.scrollLeft; });
  });
}
function updateTabScrollArrows(el){
  if(!el) return;
  const row = el.closest('.tabs-row');
  row.classList.toggle('at-start', el.scrollLeft<=1);
  row.classList.toggle('at-end', el.scrollLeft >= el.scrollWidth-el.clientWidth-1);
  if(!STATE.workspaceTabScroll) STATE.workspaceTabScroll = {};
  if(STATE.params && STATE.params.id) STATE.workspaceTabScroll[el.id+'::'+STATE.params.id] = el.scrollLeft;
}
function syncTabScroll(){
  /* Two independent scrollable tab bars can coexist (top-level + the Supplementary
     sub-tab row) — iterate all of them rather than assuming a single #workspaceTabs. */
  document.querySelectorAll('.tabs-row .tabs[id]').forEach(el=>{
    const saved = (STATE.workspaceTabScroll && STATE.params && STATE.params.id) ? STATE.workspaceTabScroll[el.id+'::'+STATE.params.id] : null;
    if(saved) el.scrollLeft = saved;
    /* The saved scroll position is from whatever tab was active last time — if a jump
       link (e.g. "Open Fitness Assessment form") just switched to a different tab, that
       tab can land outside it, hidden past the scroll arrows. Correct for that here
       rather than trusting the saved position blindly. */
    const activeBtn = el.querySelector('.tab-btn.active');
    if(activeBtn){
      const elRect = el.getBoundingClientRect(), btnRect = activeBtn.getBoundingClientRect();
      if(btnRect.left < elRect.left || btnRect.right > elRect.right){
        activeBtn.scrollIntoView({inline:'nearest', block:'nearest'});
      }
    }
    updateTabScrollArrows(el);
    el.addEventListener('scroll', ()=>updateTabScrollArrows(el));
  });
}

/* ============================================================
   PAGE: STEP 0 — EXTERNAL RECORDS INTAKE
   Scope rule: extraction from outside documents may only pre-fill
   Presentation & History (Stop 1) fields. Everything past that —
   diagnostic workup, staging, molecular — stays blank for this
   center's own structured capture.
   ============================================================ */
const STEP0_DOCS = [
  {key:'summary', label:'Discharge Summary', icon:'assessment'},
  {key:'petct', label:'PET-CT Report', icon:'image'},
  {key:'biopsy', label:'Biopsy / Pathology Report', icon:'assessment'},
];
function renderExternalRecordsPanel(){
  const open = STATE.stepZero.panelOpen;
  const files = STATE.stepZero.files;
  const anyAttached = Object.values(files).some(Boolean);
  return '<div class="accordion-item '+(open?'open':'')+'" data-stepzero-panel style="border-color:var(--gold);">'+
    '<div class="accordion-head" data-stepzero-toggle style="background:var(--gold-soft);">'+
      '<div class="ai-icon" style="background:var(--surface);color:var(--gold-strong);">'+icon('download',15)+'</div>'+
      '<h4>Have outside records? Upload here first</h4>'+
      '<span class="chev">'+icon('chevronDown',16)+'</span>'+
    '</div>'+
    '<div class="accordion-body">'+
      '<div class="callout callout-info" style="margin-bottom:14px;">Uploads from an outside hospital or referring physician pre-fill <strong>Patient &amp; Risk Factors, Presenting Features, and Clinical &amp; Performance Status</strong> below only. Diagnostic workup, staging and molecular sections are left blank for this center to capture directly at their own stops.</div>'+
      '<div class="grid grid-3" style="margin-bottom:14px;">'+
        STEP0_DOCS.map(d=>intakeUploadCard(d)).join('')+
      '</div>'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">'+
        '<div style="font-size:12px;color:var(--ink-muted);max-width:480px;line-height:1.55;">An agent pipeline reads the attached document(s) and pre-fills the sections below. Every field it touches arrives flagged <strong>"AI &middot; verify"</strong> until confirmed or edited.</div>'+
        '<button class="btn btn-gold" id="extractBtn" '+(anyAttached?'':'disabled')+'>'+icon('sparkle',15)+' Extract with AI</button>'+
      '</div>'+
      '<hr class="divider" style="margin:14px 0;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">'+
        '<div style="flex:1;min-width:220px;"><div style="font-size:11px;color:var(--ink-faint);margin-bottom:6px;">Or fetch directly by CR number / patient ID</div>'+
          '<input type="text" id="emrCrNumber" placeholder="e.g. CR-2026-08341" style="width:100%;max-width:240px;padding:7px 10px;border:1px solid var(--border-strong);border-radius:7px;font-family:var(--font-mono);font-size:12.5px;"></div>'+
        '<button class="btn btn-secondary" id="emrFetchBtn"><span class="icon">'+icon('download',15)+'</span> Fetch from EMR</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}
function intakeUploadCard(d){
  const attached = STATE.stepZero.files[d.key];
  const fname = STATE.stepZero.fileNames[d.key];
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:9px;align-items:center;text-align:center;border-style:'+(attached?'solid':'dashed')+';border-color:'+(attached?'var(--good)':'var(--border-strong)')+';">'+
    '<div style="width:38px;height:38px;border-radius:10px;background:'+(attached?'var(--good-soft)':'var(--surface-2)')+';color:'+(attached?'var(--good-ink)':'var(--ink-faint)')+';display:flex;align-items:center;justify-content:center;">'+icon(attached?'checkCircle':d.icon,18)+'</div>'+
    '<div style="font-weight:700;font-size:13px;">'+esc(d.label)+'</div>'+
    '<div style="font-size:11px;color:var(--ink-faint);word-break:break-all;">'+(attached?esc(fname||'Attached'):'Not attached')+'</div>'+
    '<label class="btn btn-secondary btn-sm" style="cursor:pointer;">'+(attached?'Replace file':'Attach file')+'<input type="file" data-intake-file="'+d.key+'" style="display:none;"></label>'+
  '</div>';
}
function applyStepZeroExtraction(source){
  const key = 'Lung';
  STATE.assessmentTemplate = key;
  const values = STATE.assessmentValues[key] || (STATE.assessmentValues[key] = {});
  const extracted = {
    age:64, sex:'M', smoking:'Ex-smoker', packYears:38,
    cough:true, dyspnea:true, hemoptysis:false, weightLoss:'Yes', fever:false, durationWeeks:9,
    ecog:'1', chestPain:'No', bonePain:'No', hoarseness:'No', svc:'No',
  };
  Object.assign(values, extracted);
  STATE.autoFilledFields[key] = new Set(Object.keys(extracted));
  const acc = STATE.assessmentAccordion[key] || (STATE.assessmentAccordion[key] = {});
  acc.risk = true; acc.presenting = true; acc.clinical = true;
  acc.workup = false;
  STATE.stepZero.panelOpen = false;
  navigate('assessment');
  const via = source==='emr' ? 'the hospital EMR record' : 'the uploaded report(s)';
  toast('Demo extraction — in production this would be parsed via OCR/NLP from '+via+'. Baseline investigations are left blank on purpose — staging and molecular results belong to their own stops, not here.');
}
/* Clinical History (existing-case) auto-fetch — same agent-pipeline motif as
   Stop 0's "Fetch from EMR", but pulls into the read-only intake fields grid
   shown against an already-open case, not the new-assessment draft form. */
function applyClinicalHistoryEmrFetch(caseId){
  if(!STATE.emrFetched) STATE.emrFetched = {};
  STATE.emrFetched[caseId] = true;
  renderPage();
  toast('Demo extraction — in production this would be parsed via HL7/FHIR feeds from the hospital EMR, LIS and RIS.');
}

/* ---------------- agentic pipeline modal (shared UI motif) ---------------- */
function agentStepRow(s, idx){
  return '<div class="agent-step" id="agentStep-'+idx+'" style="display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:9px;background:var(--surface-2);border:1px solid var(--border);transition:border-color .2s;">'+
    '<div class="agent-step-icon" style="width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:var(--surface);color:var(--ink-faint);">'+icon('clock',13)+'</div>'+
    '<div style="min-width:0;"><div style="font-size:12.5px;font-weight:700;">'+esc(s.label)+'</div><div style="font-size:11px;color:var(--ink-faint);">'+esc(s.detail)+'</div></div>'+
  '</div>';
}
function setAgentStepState(idx, state){
  const row = document.getElementById('agentStep-'+idx);
  if(!row) return;
  const iconWrap = row.querySelector('.agent-step-icon');
  if(state==='running'){
    iconWrap.style.background='var(--accent-soft)'; iconWrap.style.color='var(--accent-strong)';
    iconWrap.innerHTML = icon('sparkle',13);
    row.style.borderColor='var(--accent)';
  } else if(state==='done'){
    iconWrap.style.background='var(--good-soft)'; iconWrap.style.color='var(--good-ink)';
    iconWrap.innerHTML = icon('check',13);
    row.style.borderColor='var(--border)';
  }
}
function openAgentPipeline(title, steps, onDone, continueLabel){
  const html = ''+
    '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">'+esc(title)+'</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div style="display:flex;flex-direction:column;gap:9px;">'+steps.map((s,i)=>agentStepRow(s,i)).join('')+'</div>'+
      '<div id="agentDone" hidden style="margin-top:8px;">'+
        '<div class="callout callout-good" style="margin-bottom:12px;">'+icon('checkCircle',14)+' Nothing here is treated as final until you review it.</div>'+
        '<button class="btn btn-gold btn-block" id="agentContinueBtn">'+icon('chevronRight',15)+' '+esc(continueLabel || 'Continue')+'</button>'+
      '</div>'+
    '</div>';
  openModal(html);
  let i = 0;
  (function step(){
    if(i>0) setAgentStepState(i-1,'done');
    if(i>=steps.length){ const d=document.getElementById('agentDone'); if(d) d.hidden=false; return; }
    setAgentStepState(i,'running');
    i++;
    setTimeout(step, 650);
  })();
  const btn = document.getElementById('agentContinueBtn');
  if(btn) btn.addEventListener('click', ()=>{ closeModal(); onDone(); });
}

/* ============================================================
   PAGE: GETTING STARTED — onboarding walkthrough
   Wording is taken from the worked case (#33-55-902) and the rectal node proforma.
   ============================================================ */
function onbChip(t, tone){
  const m = {red:['var(--crit-soft)','var(--crit)'], green:['var(--good-soft)','var(--good)'], gold:['var(--gold-soft)','var(--gold-strong)'], accent:['var(--accent-soft)','var(--accent-strong)'], plain:['var(--surface-2)','var(--ink-muted)']}[tone||'plain'];
  return '<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:700;background:'+m[0]+';color:'+m[1]+';white-space:nowrap;">'+t+'</span>';
}
function onbBox(inner, x){
  return '<div style="border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:12px 14px;'+(x||'')+'">'+inner+'</div>';
}
function onbCap(t){ return '<div class="onb-cap">'+t+'</div>'; }

/* Small illustrations of each screen (schematic — not live data). */
function onbMock0(){
  const scatter = ['EMR notes','Endoscopy report','Pathology slides','MRI / PACS','CEA lab','NGS report'];
  const rows = [['Endoscopy','Tier 1'],['Pathology','Tier 1'],['Radiology','Tier 1'],['Surgery','Tier 2'],['MDT','Decision locked']];
  return '<div style="display:flex;gap:16px;align-items:stretch;flex-wrap:wrap;">'+
    '<div style="flex:1;min-width:200px;">'+onbCap('Scattered across the EMR')+
      '<div style="display:flex;flex-wrap:wrap;gap:8px;padding:14px;border:1px dashed var(--border-strong);border-radius:12px;background:var(--surface-2);">'+
        scatter.map((t,i)=>'<span style="padding:5px 10px;border-radius:8px;background:var(--surface);border:1px solid var(--border);font-size:11.5px;transform:rotate('+((i%3-1)*3)+'deg);">'+t+'</span>').join('')+
      '</div><div style="font-size:11.5px;color:var(--ink-muted);margin-top:8px;">Each specialist sees only their own slice.</div></div>'+
    '<div style="display:flex;align-items:center;color:var(--accent);">'+icon('chevronRight',22)+'</div>'+
    '<div style="flex:1;min-width:200px;">'+onbCap('One shared case in Milestone')+
      onbBox(rows.map((r,i)=>{
        const red = r[1]==='Tier 2', last = r[0]==='MDT';
        return '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;'+(red||last?'background:var(--crit-soft);':'')+'">'+
          '<span style="width:8px;height:8px;border-radius:50%;background:'+(red||last?'var(--crit)':'var(--good)')+';"></span>'+
          '<span style="flex:1;font-size:12.5px;font-weight:600;">'+r[0]+'</span>'+onbChip(r[1], red||last?'red':'green')+'</div>';
      }).join(''), 'padding:8px;')+
      '<div style="font-size:11.5px;color:var(--ink-muted);margin-top:8px;">Each step is owned by one specialist.</div></div>'+
  '</div>';
}
function onbMock1(){
  const c = CASES[0] || {id:'—'};
  return onbBox(
    '<div style="display:grid;grid-template-columns:1.3fr 2fr .7fr 1fr 1fr;gap:8px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);padding-bottom:8px;border-bottom:1px solid var(--border);"><span>Case</span><span>Diagnosis</span><span>Tier</span><span>Status</span><span>Quorum</span></div>'+
    '<div style="display:grid;grid-template-columns:1.3fr 2fr .7fr 1fr 1fr;gap:8px;align-items:center;padding-top:10px;font-size:12.5px;">'+
      '<strong>#'+esc(c.id)+'</strong><span>Low–mid rectal adenocarcinoma<br><span style="font-size:11px;color:var(--ink-faint);">cT3c N1b M0 — Stage IIIB</span></span>'+
      onbChip('Tier 2','red')+onbChip('Decision Locked','accent')+
      '<span><span style="display:block;height:5px;border-radius:99px;background:var(--good);"></span><span style="font-size:11px;color:var(--ink-faint);">7/7</span></span></div>'+
    '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">'+onbChip('Search','plain')+onbChip('All tiers','plain')+onbChip('All pathways','plain')+onbChip('All statuses','plain')+'</div>');
}
function onbMock2(){
  const f = (k,v) => '<div><div style="font-size:10px;color:var(--ink-faint);">'+k+'</div><div style="font-size:12px;font-weight:600;">'+v+'</div></div>';
  return '<div style="display:flex;flex-direction:column;gap:10px;">'+
    onbBox('<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;">'+f('Name / ID','[Demo Patient C] / MRN 33-55-902')+f('Clinical stage','cT3c N1b M0 — Stage IIIB')+f('Biomarkers','pMMR / MSS')+f('Case owner','Medical Oncology')+f('Current phase','WATCH-AND-WAIT SURVEILLANCE')+f('Case-level tier', onbChip('TIER 2','red'))+'</div>')+
    '<div style="display:flex;gap:6px;">'+['Summary','Timeline','Supplementary'].map((t,i)=>'<span style="padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;'+(i===0?'background:var(--accent);color:#fff;':'background:var(--surface-2);color:var(--ink-muted);')+'">'+t+'</span>').join('')+'</div>'+
  '</div>';
}
function onbMock3(){
  const strips = [
    ['1','Status header','WATCH-AND-WAIT SURVEILLANCE · next due · alerts · last CEA'],
    ['2','Journey ribbon',''],
    ['3','Diagnosis & stage at a glance','Histology · stage · high-risk features · location · molecular · CEA'],
    ['4','Treatment delivered','Chemoradiation · consolidation chemo · toxicity · response'],
    ['5','Surveillance status','Cadence · last done · result · next due'],
    ['6','Relapse-risk map','Where and when relapse is most likely'],
    ['7','Key images + outstanding','One representative image per phase'],
  ];
  return '<div style="display:flex;flex-direction:column;gap:6px;">'+strips.map(s=>
    '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border:1px solid var(--border);border-radius:9px;background:var(--surface);">'+
      '<span style="min-width:20px;height:20px;border-radius:50%;background:var(--accent-soft);color:var(--accent-strong);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;">'+s[0]+'</span>'+
      '<span style="font-size:12px;font-weight:700;min-width:150px;">'+s[1]+'</span>'+
      (s[0]==='2' ? '<span style="display:flex;gap:4px;flex-wrap:wrap;">'+['Dx','Stage'].map(t=>onbChip(t,'green')).join('')+onbChip('Surgery','red')+onbChip('MDT','red')+onbChip('Chemo','green')+onbChip('You are here','accent')+'</span>' : '<span style="font-size:11px;color:var(--ink-muted);">'+s[2]+'</span>')+
    '</div>').join('')+'</div>';
}
function onbMock4(){
  const nodes = [['External','g'],['Presentation','g'],['Colonoscopy','g'],['Pathology','g'],['MRI','g'],['CT','g'],['CEA','g'],['Molecular','g'],['Surgery','r'],['MDT','r'],['Trial box','a'],['ChemoRT','g'],['Chemo','g'],['Restaging','g'],['Surveillance','a']];
  const col = {g:['var(--good-soft)','var(--good)'], r:['var(--crit-soft)','var(--crit)'], a:['var(--accent-soft)','var(--accent-strong)']};
  const line = (k,v) => '<div style="display:flex;gap:8px;font-size:12px;"><span style="min-width:74px;color:var(--ink-faint);">'+k+'</span><span>'+v+'</span></div>';
  return '<div style="display:flex;flex-direction:column;gap:12px;">'+
    '<div style="display:flex;flex-wrap:wrap;gap:5px;">'+nodes.map(n=>'<span style="padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;background:'+col[n[1]][0]+';color:'+col[n[1]][1]+';">'+n[0]+'</span>').join('')+'</div>'+
    onbBox('<div style="font-size:12.5px;font-weight:700;margin-bottom:8px;">Surgical Evaluation '+onbChip('Tier 2','red')+'</div>'+
      line('Owner','Colorectal Surgeon')+line('Finding','Independent flex-sig + DRE …')+line('Opinion','“…Which strategy we pick is a whole-team and patient decision. Marking Tier 2.”')+line('Images','★ surgeon annotation on the axial T2')+line('Tier mark','Tier 2 — threatened CRM; strategy decision'))+
  '</div>';
}
function onbMock5(){
  const th = [['RD','Radiology','var(--info)','Agree'],['PM','Pathology/Molecular','var(--accent)','Agree'],['RO','Radiation Oncology','var(--gold)','Agree'],['CS','Surgery','var(--good)','Agree'],['EN','Enterostomal nurse','var(--warn)','Agree']];
  return '<div style="display:flex;flex-direction:column;gap:8px;">'+
    th.map(t=>'<div style="display:flex;align-items:center;gap:8px;"><span style="width:28px;height:28px;border-radius:50%;border:2px solid var(--good);display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:700;color:'+t[2]+';">'+t[0]+'</span>'+
      '<div style="flex:1;border-left:3px solid '+t[2]+';background:var(--surface-2);border-radius:4px 12px 12px 4px;padding:6px 10px;font-size:12px;">'+t[1]+' — opinion, in their own words</div>'+onbChip('Agree','green')+'</div>').join('')+
    '<div style="border:1px solid var(--crit);background:var(--crit-soft);border-radius:10px;padding:8px 12px;font-size:12px;"><strong style="color:var(--crit);">Recorded dissent</strong> — attributed by name, not smoothed over</div>'+
    '<div style="border:1px solid var(--good);background:var(--good-soft);border-radius:10px;padding:8px 12px;font-size:12px;display:flex;align-items:center;gap:8px;">'+icon('lock',14)+'<span><strong>Decision locked</strong> · alternatives rejected · contingency · → Trial box</span></div>'+
  '</div>';
}
function onbMock6(){
  const btn = t => '<span style="padding:5px 10px;border-radius:8px;border:1px solid var(--border-strong);font-size:11.5px;font-weight:700;background:var(--surface);">'+t+'</span>';
  const fld = (l,v) => '<div><div style="font-size:10.5px;color:var(--ink-faint);">'+l+'</div><div style="border:1px solid var(--border);border-radius:7px;padding:5px 8px;font-size:12px;background:var(--surface);">'+v+'</div></div>';
  return '<div style="display:flex;flex-direction:column;gap:10px;">'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;padding:8px 10px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);"><span style="font-size:10.5px;font-weight:700;text-transform:uppercase;color:var(--ink-muted);">Fill this form</span>'+btn('Pull from EMR')+btn('Upload document · AI')+btn('Edit manually')+'</div>'+
    onbBox('<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;">'+fld('Distance from anal verge (cm)','6')+fld('Morphology','Fungating')+fld('Lumen','Traversable')+fld('Tattoo placed','Yes (distal to lesion)')+'</div>')+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;">'+onbChip('1 · Opinion','plain')+onbChip('2 · Tier mark','plain')+onbChip('3 · Images ★','plain')+'</div>'+
  '</div>';
}
function onbMock7(){
  const card = (tab, ic, t, d) => '<div data-onb-open="'+tab+'" style="cursor:pointer;border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:12px 14px;display:flex;gap:10px;align-items:flex-start;">'+
    '<span style="color:var(--accent);">'+icon(ic,18)+'</span><div><div style="font-size:13px;font-weight:700;">'+t+'</div><div style="font-size:12px;color:var(--ink-muted);line-height:1.5;">'+d+'</div></div></div>';
  return '<div style="display:flex;flex-direction:column;gap:8px;">'+
    card('forms','assessment','Node Forms','One form for each node.')+
    card('imaging','image','Imaging','Every image from every stop, grouped by where it was taken. Switch between key images and all images; select one to enlarge.')+
    card('note','book','Discharge Note','Compiles every completed stop into one continuous account. Nothing is invented, and a clinician verifies it before it counts as final.')+
  '</div>';
}
function onbMock8(){
  const items = ['One shared case, instead of results scattered across the EMR','Each specialist owns and signs their own step','Tier marks show early where the team needs to talk','The MDT works from the same facts, records dissent openly and locks one decision','The locked protocol drives everything that follows','Surveillance and escalation stay in the same place'];
  return onbBox('<div style="display:flex;flex-direction:column;gap:10px;">'+items.map(t=>'<div style="display:flex;gap:9px;align-items:flex-start;font-size:13px;line-height:1.45;"><span style="color:var(--good);display:inline-flex;margin-top:1px;">'+icon('checkCircle',16)+'</span><span>'+t+'</span></div>').join('')+'</div>');
}

const ONBOARDING = [
  {label:'The idea', title:'One case, every specialist, one place',
    lead:'A cancer decision depends on many people, each holding one piece: the endoscopist, the pathologist, the radiologist, the lab, the molecular result, the surgeon’s own exam. When those pieces sit in separate parts of the EMR, nobody sees the whole picture. Milestone brings them into one shared case.',
    points:['Every step of the case (a “node”) is owned by one specialist, who reviews only their slice.','Each node is a 4-part card: Finding → the specialist’s own Opinion → Images → Tier mark.','“Guideline-concordant from my side” means Tier 1. While every specialist marks Tier 1, no meeting is scheduled.','The moment one specialist marks Tier 2, the whole case escalates to a synchronous MDT.'],
    why:'Every specialist works from the same case, in the same order, and the point where the team needs to talk is flagged as it happens.',
    mock:onbMock0},
  {label:'Cases screen', title:'Start on the Cases screen', open:{label:'Open the Cases screen', target:'cases'},
    lead:'Every case begins here: one row per case, so you can see at a glance what needs the team.',
    points:['Search, and filter by tier, pathway and status.','Each row shows the case number, diagnosis and stage, the Tier badge, the pathway, the status (for example Decision Locked), how many of the invited specialists have responded (quorum), and days open.','Tier 1: every specialist marked their part guideline-concordant. Tier 2: at least one specialist raised the case for discussion.','Select Open to go into the case.'],
    why:'One list of every case and where it stands, instead of chasing results across systems.',
    mock:onbMock1},
  {label:'Inside a case', title:'Open a case: the banner and three tabs', open:{label:'Open the worked case', target:'summary'},
    lead:'Inside a case, a banner stays on screen as you move around, so you always know who the patient is and where the case stands.',
    points:['Banner: name and ID, age and sex, ECOG, case owner, diagnosis, clinical stage, biomarkers, location, the strategy locked by the MDT, current phase and the case-level Tier.','The banner collapses when you need the space.','Three tabs: Summary (the whole case on one screen), Timeline (every step in order) and Supplementary (imaging, node forms and the discharge note).'],
    why:'The same identity and status show on every screen of the case.',
    mock:onbMock2},
  {label:'Summary', title:'Summary: the story so far', open:{label:'Open the Summary', target:'summary'},
    lead:'A single, fast screen for the covering clinician, the surveillance nurse or the next MDT who needs the whole case in about 15 seconds. Seven panels, most actionable first.',
    points:['Status header: who, what stage, current phase, time since complete response, what is due next, open alerts and the last CEA.','Journey ribbon: the whole case as one row of tier-coloured steps. Tier 2 steps stay red, and you can jump to any step.','Diagnosis & stage at a glance: histology, stage, high-risk features, location, molecular result and baseline CEA.','Treatment delivered: what actually happened, not what was planned.','Surveillance status: each check with its cadence, last result and next due.','Relapse-risk map: where relapse is most likely for this patient.','Key images and outstanding items: one representative image per phase.'],
    why:'You can answer “where is this patient and what happens next” without opening a single step.',
    mock:onbMock3},
  {label:'Timeline', title:'Timeline: every step, in order', open:{label:'Open the Timeline', target:'timeline'},
    lead:'The timeline is chronological and deep: every node, every image, every dose.',
    points:['Each stop is owned by one specialist and shows the Finding, the Opinion in their own words, the Images (★ marks key images) and their Tier mark.','Outside records are stamped [ext] and read-only, so they are never mistaken for in-house findings.','The step where a specialist raised Tier 2, and the MDT it triggered, stay red with a one-line reason, for example “threatened CRM — strategy decision”.','After the decision, the Trial box holds the chosen protocol. The chemoradiation, chemotherapy blocks with dose intensity and side-effect tracking, and restaging that follow are laid out against it.','The last stop is the surveillance dashboard: schedule, time-hazard shading, relapse-risk map and escalation rules.'],
    why:'Anyone reopening the chart can see who said what, when the case was escalated and why.',
    mock:onbMock4},
  {label:'The MDT', title:'The MDT: one decision, everyone at the table', open:{label:'Open the MDT', target:'mdt'},
    lead:'One Tier 2 anywhere sends the whole case to a synchronous MDT. The MDT stop is the main event of the case, and it sits on the Timeline as its own red stop.',
    points:['Trigger and quorum: why the case came to the board and which specialties are present. The patient’s own priority is on file.','Case summary read into the record, so everyone starts from the same facts.','The strategies on the table: what each commits the patient to, when it fits best, and the evidence behind it.','Each specialist’s opinion, attributed, tagged Agree or Dissent. Dissent is recorded by name, not smoothed over.','The decision is locked, with the alternatives considered and rejected and the contingency if the plan does not work.','The locked strategy becomes the protocol in the Trial box.'],
    why:'Radiology, pathology, oncology, surgery and nursing work from one shared record. Disagreement is visible, and the reasoning behind the decision stays with the case.',
    mock:onbMock5},
  {label:'Node forms', title:'Node forms: how each step is filled in', open:{label:'Open the Node Forms', target:'forms'},
    lead:'Under Supplementary → Node Forms, every node has its own form: the input side of the timeline stop it belongs to.',
    points:['Findings are entered with pick-lists and checkboxes, so data is captured the same structured way each time. The owner is shown at the top of each form.','Every form ends with the same three blocks: Opinion (in the specialist’s own words), Tier mark (Tier 1, or Tier 2 with a reason) and Images (attach, caption, ★ key image, add another).','Three ways to fill a form: Pull from EMR, Upload a document and interpret it with AI, or edit manually. Anything filled by EMR or AI is flagged until a clinician confirms it.','Once the MDT decision is locked, its form is read-only.','In this demo the forms are representational: nothing you enter is saved.'],
    why:'Data that already exists in the EMR is brought in rather than retyped, and each specialist adds only their own opinion.',
    mock:onbMock6},
  {label:'Supplementary', title:'Also under Supplementary', open:{label:'Open Imaging', target:'imaging'},
    lead:'Beside the Node Forms, the Supplementary tab gathers the rest of the case.',
    points:['Node Forms: the input side of every node.','Imaging: every image from every stop in one place.','Discharge Note: one continuous account of every completed stop, verified by a clinician before it counts as final.'],
    why:'Nothing about the case lives outside it.',
    mock:onbMock7},
  {label:'Together', title:'Putting it together', open:{label:'Open the worked case', target:'summary'},
    lead:'From referral to surveillance, one platform holds the case, and every specialist adds to it in the same place.',
    points:[],
    why:'Decisions are taken by the whole team, from the same facts, with the reasoning kept.',
    mock:onbMock8},
];

const ONB_ICONS = ['users','cases','flag','assessment','timer','users','layers','image','checkCircle'];
function onbOpen(target){
  if(target==='cases'){ navigate('cases'); return; }
  const c = CASES[0]; if(!c) return;
  if(target==='mdt'){ target = 'timeline'; const k = c.timeline.findIndex(isMdtStage); if(k>=0) STATE.timelineActive[c.id] = k; }
  STATE.workspaceTab[c.id] = target;
  navigate('workspace', {id:c.id});
}
function renderOnboarding(){
  const n = ONBOARDING.length, i = Math.max(0, Math.min(STATE.onbStep||0, n-1)), st = ONBOARDING[i];
  const rail = ONBOARDING.map((s,k)=>{
    const cur = k===i, done = k<i;
    return '<button data-onb-step="'+k+'" style="all:unset;box-sizing:border-box;cursor:pointer;position:relative;z-index:1;display:flex;align-items:center;gap:11px;padding:8px 10px;border-radius:11px;width:100%;'+(cur?'background:var(--accent-soft);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 35%,transparent);':'')+'">'+
      '<span style="min-width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;'+(cur?'background:linear-gradient(135deg,var(--accent),var(--accent-strong));color:#fff;box-shadow:0 2px 6px color-mix(in srgb,var(--accent) 45%,transparent);':done?'background:var(--good);color:#fff;':'background:var(--surface);color:var(--ink-muted);border:2px solid var(--border-strong);')+'">'+(done?icon('check',13):(k+1))+'</span>'+
      '<span style="font-size:13px;line-height:1.3;'+(cur?'font-weight:700;color:var(--accent-strong);':done?'color:var(--ink);':'color:var(--ink-muted);')+'">'+esc(s.label)+'</span></button>';
  }).join('');
  const points = st.points.length ? '<ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:9px;">'+st.points.map(p=>'<li style="display:flex;gap:9px;font-size:13px;line-height:1.5;"><span style="color:var(--accent);display:inline-flex;margin-top:3px;flex-shrink:0;">'+icon('check',13)+'</span><span>'+esc(p)+'</span></li>').join('')+'</ul>' : '';
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    '<div class="card card-pad" style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;padding-top:14px;padding-bottom:14px;">'+
      '<div style="flex:1;min-width:260px;"><h3 style="margin:0;font-size:17px;">Welcome to Milestone</h3>'+
        '<div style="font-size:12.5px;color:var(--ink-muted);margin-top:3px;line-height:1.5;">One shared case where every relevant specialist takes the decision together, instead of chasing data scattered across the EMR.</div></div>'+
      '<div style="min-width:220px;flex:0 1 300px;"><div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;color:var(--ink-muted);margin-bottom:5px;"><span>Step '+(i+1)+' of '+n+'</span><span>'+Math.round((i+1)/n*100)+'%</span></div>'+
        '<div style="height:6px;border-radius:99px;background:var(--surface-2);overflow:hidden;"><div style="height:100%;width:'+Math.round((i+1)/n*100)+'%;border-radius:99px;background:var(--accent);"></div></div></div>'+
    '</div>'+
    '<div class="onb-layout">'+
      '<div class="card card-pad onb-rail" style="padding:12px 10px;display:flex;flex-direction:column;gap:4px;position:sticky;top:12px;">'+
        '<div style="position:absolute;left:23px;top:30px;bottom:30px;width:2px;background:var(--border);"></div>'+
        '<div style="position:absolute;left:23px;top:30px;width:2px;height:calc((100% - 60px) * '+(i/(n-1))+');background:var(--good);"></div>'+rail+'</div>'+
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:16px;min-width:0;">'+
        '<div style="display:flex;gap:16px;align-items:flex-start;">'+
          '<span style="width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,var(--accent-soft),color-mix(in srgb,var(--accent) 22%,var(--surface)));color:var(--accent-strong);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(ONB_ICONS[i]||'sparkle',26)+'</span>'+
          '<div><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--accent-strong);">Step '+(i+1)+' · '+esc(st.label)+'</div>'+
          '<h2 style="margin:4px 0 8px;font-size:22px;">'+esc(st.title)+'</h2><div style="font-size:14px;line-height:1.65;color:var(--ink-muted);">'+esc(st.lead)+'</div></div></div>'+
        '<div class="onb-body"><div style="display:flex;flex-direction:column;gap:14px;">'+points+
          '<div style="border-left:3px solid var(--good);background:var(--good-soft);border-radius:0 10px 10px 0;padding:10px 14px;font-size:13px;line-height:1.5;"><strong>Why it matters.</strong> '+esc(st.why)+'</div></div>'+
          '<div style="min-width:0;">'+st.mock()+'</div></div>'+
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;border-top:1px solid var(--border);padding-top:14px;">'+
          '<button class="btn btn-ghost" data-onb-step="'+(i-1)+'" '+(i===0?'disabled':'')+'>Back</button>'+
          (i<n-1 ? '<button class="btn btn-secondary" data-onb-step="'+(i+1)+'">Next '+icon('chevronRight',14)+'</button>' : '<button class="btn btn-ghost" data-onb-step="0">Start again</button>')+
          (st.open ? '<button class="btn btn-gold" style="margin-left:auto;" data-onb-open="'+st.open.target+'">'+esc(st.open.label)+' '+icon('chevronRight',14)+'</button>' : '')+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}

/* ============================================================
   PAGE: TRIAGE QUEUE
   ============================================================ */
function renderTriage(){
  return ''+
  '<div class="grid cols-2-1">'+
    '<div style="display:flex;flex-direction:column;gap:14px;">'+
      (REFERRALS.length ? REFERRALS.map(r=>renderReferralCard(r)).join('') :
        '<div class="card"><div class="empty-state">'+icon('checkCircle',30)+'<div>All referrals triaged. New referrals will appear here.</div></div></div>')+
    '</div>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:14px;height:fit-content;">'+
      '<h3>Triage Policy</h3>'+
      tierPolicyCard(1)+ tierPolicyCard(2)+ tierPolicyCard(3)+
      '<div class="callout callout-info">Auto-triage scores each referral on guideline concordance, imaging ambiguity, resectability, and number of specialties required — then routes it to the lightest-touch pathway that is still safe.</div>'+
    '</div>'+
  '</div>';
}
function tierPolicyCard(tier){
  const m = TIER_META[tier];
  return '<div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 14px;">'+
    tierBadge(tier)+'<div style="font-size:12px;color:var(--ink-muted);margin-top:7px;line-height:1.5;">'+m.desc+'</div></div>';
}
function renderReferralCard(r){
  return '<div class="card card-pad" id="ref-'+r.id+'">'+
    '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">'+
      '<div>'+
        '<div style="font-size:11px;color:var(--ink-faint);font-family:var(--font-mono);">'+r.id+' &middot; '+Math.round(hoursSince(r.createdAt))+'h ago</div>'+
        '<div style="font-weight:700;font-size:14.5px;margin-top:2px;">'+r.patient.age+esc(r.patient.sex)+' &middot; '+esc(r.tumourType)+'</div>'+
        '<div style="font-size:13px;color:var(--ink-muted);margin-top:2px;">'+esc(r.diagnosis)+'</div>'+
      '</div>'+
      '<div id="ref-result-'+r.id+'"></div>'+
    '</div>'+
    '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:12px;">'+r.chips.map(c=>'<span class="chip">'+esc(c)+'</span>').join('')+'</div>'+
    '<div style="margin-top:14px;display:flex;gap:8px;">'+
      '<button class="btn btn-primary btn-sm" data-triage="'+r.id+'">'+icon('sparkle',14)+' Run Auto-Triage</button>'+
    '</div>'+
  '</div>';
}

/* ============================================================
   PAGE: CASES (worklist)
   ============================================================ */
function renderCases(){
  const f = STATE.casesFilter;
  const pathways = Array.from(new Set(CASES.map(c=>c.pathway)));
  const rows = CASES.filter(c=>{
    if(f.tier!=='all' && String(c.tier)!==f.tier) return false;
    if(f.pathway!=='all' && c.pathway!==f.pathway) return false;
    if(f.status!=='all' && c.status!==f.status) return false;
    if(f.search){
      const hay = (c.id+' '+c.diagnosis+' '+c.tumourType+' '+c.patient.initials).toLowerCase();
      if(!hay.includes(f.search.toLowerCase())) return false;
    }
    return true;
  });

  return ''+
  '<div class="card card-pad">'+
    '<div class="filter-bar">'+
      '<div class="search-wrap" style="flex:0 1 240px;"><span class="icon" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink-faint);">'+icon('search',15)+'</span>'+
        '<input type="text" id="casesSearch" placeholder="Search cases…" value="'+esc(f.search)+'" style="padding-left:32px;"></div>'+
      '<select id="filterTier"><option value="all">All tiers</option><option value="1"'+(f.tier==='1'?' selected':'')+'>Tier 1</option><option value="2"'+(f.tier==='2'?' selected':'')+'>Tier 2</option><option value="3"'+(f.tier==='3'?' selected':'')+'>Tier 3</option></select>'+
      '<select id="filterPathway"><option value="all">All pathways</option>'+pathways.map(p=>'<option value="'+esc(p)+'"'+(f.pathway===p?' selected':'')+'>'+esc(p)+'</option>').join('')+'</select>'+
      '<select id="filterStatus"><option value="all">All statuses</option><option value="Pending Triage"'+(f.status==='Pending Triage'?' selected':'')+'>Pending Triage</option><option value="Awaiting Responses"'+(f.status==='Awaiting Responses'?' selected':'')+'>Awaiting Responses</option><option value="Decision Locked"'+(f.status==='Decision Locked'?' selected':'')+'>Decision Locked</option></select>'+
      '<div style="margin-left:auto;font-size:12px;color:var(--ink-faint);">'+rows.length+' of '+CASES.length+' cases</div>'+
    '</div>'+
  '</div>'+
  '<div class="card">'+
    '<div class="table-wrap"><table><thead><tr><th>Case</th><th>Diagnosis</th><th>Tier</th><th>Pathway</th><th>Status</th><th>Quorum</th><th>Days Open</th><th></th></tr></thead><tbody>'+
      (rows.length ? rows.map(c=>{
        const days = c.status==='Decision Locked' ? ((c.lockedAt-c.createdAt)/86400000).toFixed(1) : daysSince(c.createdAt).toFixed(1);
        const qpct = Math.round(c.quorum.responded/c.quorum.invited*100);
        return '<tr data-open-case="'+c.id+'">'+
          '<td><div style="font-weight:700;font-family:var(--font-mono);font-size:12.5px;">#'+c.id+'</div><div style="font-size:11px;color:var(--ink-faint);">'+c.patient.age+esc(c.patient.sex)+' &middot; '+esc(c.patient.initials)+'</div></td>'+
          '<td style="max-width:240px;"><div style="font-weight:600;">'+esc(c.diagnosis)+'</div><div style="font-size:11px;color:var(--ink-faint);">'+esc(c.stage)+'</div></td>'+
          '<td>'+tierBadge(c.tier, c.tierBadgeOverride)+'</td>'+
          '<td>'+deptChip(c.pathway)+'</td>'+
          '<td>'+statusBadge(c.status)+'</td>'+
          '<td style="min-width:110px;"><div class="progress" style="margin-bottom:4px;"><div style="width:'+qpct+'%;"></div></div><span style="font-size:10.5px;color:var(--ink-faint);font-family:var(--font-mono);">'+c.quorum.responded+'/'+c.quorum.invited+'</span></td>'+
          '<td class="mono" style="font-size:12px;">'+days+'</td>'+
          '<td><button class="btn btn-ghost btn-sm" data-open-case="'+c.id+'">Open '+icon('chevronRight',13)+'</button></td>'+
        '</tr>';
      }).join('') : '<tr><td colspan="8"><div class="empty-state">'+icon('search',26)+'<div>No cases match these filters.</div></div></td></tr>')+
    '</tbody></table></div>'+
  '</div>';
}

/* ============================================================
   PAGE: CASE WORKSPACE
   ============================================================ */
/* ---------------- coordination pathway (the MDT process itself, not the clinical journey) ---------------- */
const COORD_STAGES = ['Referral Received','Triaged','Specialist Input','Consensus','Decision Locked'];
function coordinationStates(c){
  const locked = c.status === 'Decision Locked';
  const quorumMet = c.quorum.responded >= c.quorum.invited;
  const blocked = !!c.conflict && !locked;
  if(locked){
    return ['completed','completed','completed','completed','completed'];
  }
  if(!quorumMet){
    return ['completed','completed', blocked?'blocked':'awaiting-specialist-input', 'pending','pending'];
  }
  return ['completed','completed','completed', blocked?'blocked':'active', 'pending'];
}
const COORD_STATE_META = {
  completed:{icon:'check', color:'var(--good)', bg:'var(--good-soft)', label:'Completed'},
  active:{icon:'sparkle', color:'var(--accent)', bg:'var(--accent-soft)', label:'Active'},
  blocked:{icon:'alert', color:'var(--crit)', bg:'var(--crit-soft)', label:'Blocked'},
  'awaiting-specialist-input':{icon:'clock', color:'var(--warn)', bg:'var(--warn-soft)', label:'Awaiting input'},
  pending:{icon:null, color:'var(--ink-faint)', bg:'var(--surface-2)', label:'Not started'},
};
function renderPathwayBar(c){
  const states = coordinationStates(c);
  return '<div>'+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);margin-bottom:8px;">MDT Pathway Progress</div>'+
    '<div style="display:flex;align-items:flex-start;">'+
      COORD_STAGES.map((label,i)=>{
        const st = states[i];
        const m = COORD_STATE_META[st];
        return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;position:relative;min-width:0;">'+
          (i>0 ? '<div style="position:absolute;top:12px;right:50%;width:100%;height:2px;background:'+(states[i-1]!=='pending'?'var(--good)':'var(--border)')+';z-index:0;"></div>' : '')+
          '<div style="width:24px;height:24px;border-radius:50%;background:'+m.bg+';color:'+m.color+';display:flex;align-items:center;justify-content:center;z-index:1;border:2px solid var(--surface);'+(st==='active'?'box-shadow:0 0 0 3px '+m.bg+';':'')+'">'+(m.icon?icon(m.icon,12):'<span style="width:5px;height:5px;border-radius:50%;background:currentColor;"></span>')+'</div>'+
          '<span style="font-size:9.5px;font-weight:700;text-align:center;color:'+(st==='pending'?'var(--ink-faint)':'var(--ink)')+';line-height:1.25;">'+esc(label)+'</span>'+
        '</div>';
      }).join('')+
    '</div>'+
  '</div>';
}

function avatarStack(specialists){
  return '<div class="avatar-stack">'+specialists.slice(0,5).map(s=>{
    const d = deptColor(s.role);
    const respondedRing = s.status==='responded' ? 'var(--good)' : 'var(--border-strong)';
    return '<div class="avatar avatar-sm" title="'+esc(s.name)+' · '+esc(s.role)+(s.status==='responded'?' (responded)':' (awaiting)')+'" style="background:'+d.bg+';color:'+d.c+';box-shadow:0 0 0 2px '+respondedRing+';">'+esc(s.initials)+'</div>';
  }).join('')+'</div>';
}

/* Wrapping chips, one per specialist — as compact as the old overlapping avatarStack
   circles, but each chip still names who it is and shows a live status dot instead of
   forcing a hover/tooltip to find out. Once a case is locked, everyone reads as
   responded regardless of their raw pre-lock status flag — a stale "Awaiting" next to
   an already-locked decision is misleading, not accurate. */
function renderTeamRoster(c){
  const locked = c.status === 'Decision Locked';
  return '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
    c.specialists.map(s=>{
      const d = deptColor(s.role);
      const responded = locked || s.status==='responded';
      return '<span class="chip" style="padding:3px 9px 3px 3px;gap:6px;" title="'+esc(s.role)+' &middot; '+(responded?'Responded':'Awaiting')+'">'+
        '<span class="avatar avatar-sm" style="width:20px;height:20px;font-size:8.5px;background:'+d.bg+';color:'+d.c+';">'+esc(s.initials)+'</span>'+
        '<span style="font-size:11.5px;">'+esc(s.name)+'</span>'+
        '<span style="width:6px;height:6px;border-radius:50%;background:'+(responded?'var(--good)':'var(--ink-faint)')+';flex-shrink:0;"></span>'+
      '</span>';
    }).join('')+
  '</div>';
}
/* Team invite/apply-team controls — moved off the case header (which now only shows
   basic identity) onto Discussion, where team composition is actually acted on. */
function renderTeamInviteBar(c, availableRoles){
  if(c.status==='Decision Locked') return '';
  const tpl = teamTemplateFor(c);
  const tplMissing = tpl ? tpl.roles.filter(r=>!c.specialists.map(s=>s.role).includes(r)) : [];
  if(!tplMissing.length && !availableRoles.length) return '';
  return '<div style="display:flex;flex-direction:column;gap:0;padding:9px 11px;border:1px dashed var(--border-strong);border-radius:8px;">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">'+
      '<span style="font-size:11.5px;color:var(--ink-faint);">'+icon('users',12)+' Team: '+c.specialists.length+' invited</span>'+
      '<div style="display:flex;gap:6px;">'+
        (tplMissing.length ? '<button class="btn btn-ghost btn-sm" data-apply-team="'+c.id+'" style="padding:2px 7px;" title="'+esc(tpl.label)+'">'+icon('users',12)+' Apply team</button>' : '')+
        (availableRoles.length ? '<button class="btn btn-ghost btn-sm" data-invite="'+c.id+'" style="padding:2px 7px;">'+icon('plus',12)+' Invite</button>' : '')+
      '</div>'+
    '</div>'+
    (availableRoles.length ? '<div id="inviteBox-'+c.id+'" hidden style="margin-top:8px;padding:9px;border:1px dashed var(--border-strong);border-radius:8px;background:var(--surface-2);">'+
      '<div style="font-size:10.5px;color:var(--ink-faint);margin-bottom:6px;">Invite a specialist:</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+availableRoles.map(r=>'<button class="btn btn-secondary btn-sm" data-add-specialist="'+c.id+'" data-role="'+esc(r)+'">'+esc(r)+'</button>').join('')+'</div>'+
    '</div>' : '')+
  '</div>';
}

function primaryActionMeta(c){
  const locked = c.status === 'Decision Locked';
  const quorumMet = c.quorum.responded >= c.quorum.invited;
  if(locked) return {label:'Decision Locked', kind:'locked'};
  if(c.pendingDecision){
    const signed = c.pendingDecision.signatures.length, total = c.specialists.length;
    return {label:'Awaiting Sign-off ('+signed+'/'+total+')', kind:'signoff'};
  }
  if(quorumMet) return {label:'Propose Final MDT Decision', kind:'lock'};
  return {label:'Review Responses', kind:'review'};
}
function renderPrimaryAction(c){
  const m = primaryActionMeta(c);
  if(m.kind==='locked'){
    return '<button class="btn btn-secondary btn-block" data-primary-action="'+c.id+'" data-action-kind="locked">'+icon('lock',15)+' '+esc(m.label)+'</button>';
  }
  const cls = m.kind==='lock' ? 'btn-gold' : 'btn-primary';
  return '<button class="btn '+cls+' btn-block" data-primary-action="'+c.id+'" data-action-kind="'+m.kind+'">'+icon(m.kind==='lock'?'lock':'users',15)+' '+esc(m.label)+'</button>';
}

/* Best-effort keyword match so the always-visible clinical snapshot reads at
   a glance instead of as a wall of same-weight text — not exhaustive, just
   covers the vocabulary these chips actually use across the mock cases. */
function factIcon(text){
  const t = text.toLowerCase();
  if(t.includes('pack-year') || t.includes('smoker')) return 'activity';
  if(t.includes('ecog')) return 'stetho';
  if(t.includes('pet')||t.includes(' ct')||t.includes('mri')||t.includes('node')||t.includes('nodule')||t.includes('usg')||t.includes('mammogram')||t.includes('x-ray')) return 'image';
  if(t.includes('ebus')||t.includes('tbna')||t.includes('biopsy')) return 'assessment';
  if(t.includes('pd-l1')||t.includes('driver')||t.includes('egfr')||t.includes('alk')||t.includes('kras')||t.includes('mss')||t.includes('her2')||t.includes('ki-67')) return 'network';
  if(t.includes('resection')||t.includes('r0')||t.includes('r1')||t.includes('r2')) return 'flag';
  return null;
}
function renderKeyFactsChips(c){
  return '<div style="display:flex;flex-wrap:wrap;gap:5px;">'+c.keyFacts.map(k=>{
    const ic = factIcon(k);
    return '<span class="chip" style="font-size:11px;padding:3px 8px;display:inline-flex;align-items:center;gap:4px;">'+(ic?icon(ic,11):'')+esc(k)+'</span>';
  }).join('')+'</div>';
}

/* Slim, always-visible identity/status bar with a collapsible drawer for the
   heavier detail (key facts, pathway stepper, decision status) — the tab
   content below (Clinical History by default view) is the main event now,
   not squeezed into a persistent half-width sidebar card. */
/* Down to identity only — tier, status, diagnosis, stage and key facts all now live
   on the Summary tab's Case Snapshot, so the header no longer repeats them on every
   other tab. Conflict stays as a persistent safety cue since it's actionable, not
   descriptive. */
/* Banner values are rendered verbatim. The case-level tier row is the only one styled
   (same coloured badge the tier shows on other cases); its text is unchanged. */
function bannerValueHtml(c, r){
  if(/tier/i.test(r.label)){
    const badge = (c.tierBadgeOverride && c.tierBadgeOverride.badge) || 'badge-tier3';
    return '<span class="badge '+badge+'" style="white-space:normal;height:auto;line-height:1.35;padding:3px 10px;font-weight:400;"><span class="badge-dot"></span>'+withCites(r.value)+'</span>';
  }
  return withCites(r.value);
}
function renderPatientBanner(c){
  const collapsed = !!(STATE.bannerCollapsed && STATE.bannerCollapsed[c.id]);
  const chevron = '<span style="display:inline-block;transform:rotate('+(collapsed?'90deg':'-90deg')+');">'+icon('chevronRight',14)+'</span>';
  const toggle = '<button class="icon-btn" data-toggle-banner="'+c.id+'" style="width:30px;height:30px;flex-shrink:0;" aria-label="'+(collapsed?'Expand':'Collapse')+' banner" aria-expanded="'+(!collapsed)+'">'+chevron+'</button>';
  if(collapsed){
    const nameRow = c.banner[0], tierRow = c.banner.find(r=>/tier/i.test(r.label));
    return '<div class="card card-pad" style="margin-bottom:14px;padding:10px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">'+
      '<div style="font-size:13px;font-weight:700;">'+esc(nameRow.value)+'</div>'+
      (tierRow ? '<div>'+bannerValueHtml(c, tierRow)+'</div>' : '')+
      '<div style="margin-left:auto;">'+toggle+'</div>'+
    '</div>';
  }
  return '<div class="card card-pad" style="margin-bottom:14px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px;">'+
    '<div style="flex:1;min-width:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 20px;">'+
      c.banner.map(r=>'<div style="padding:7px 0;">'+
        '<div style="font-size:10.5px;color:var(--ink-faint);'+(r.boldLabel?'font-weight:700;':'')+'">'+esc(r.label)+'</div>'+
        '<div style="font-size:13px;font-weight:400;margin-top:2px;">'+bannerValueHtml(c, r)+'</div>'+
      '</div>').join('')+
    '</div>'+
    toggle+
  '</div>';
}
function renderWorkspaceHeader(c){
  if(c.banner) return renderPatientBanner(c);
  const conflict = c.conflict && c.status!=='Decision Locked';
  const locked = c.status === 'Decision Locked';
  return '<div class="card card-pad" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-color:'+(conflict?'var(--crit)':'var(--border)')+';margin-bottom:14px;padding:14px 16px;">'+
      avatarHtml(c.patient.initials, c.department, '')+
      '<div style="min-width:0;">'+
        '<div style="font-weight:700;font-size:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'+
          '<span>'+c.patient.age+esc(c.patient.sex)+' &middot; '+esc(c.patient.initials)+'</span>'+
          tierBadge(c.tier, c.tierBadgeOverride)+
          (conflict?'<span class="badge badge-tier3">'+icon('alert',11)+' Conflict</span>':'')+
        '</div>'+
        '<div style="font-size:10.5px;color:var(--ink-faint);font-family:var(--font-mono);">MRN '+esc(c.patient.mrn)+'</div>'+
      '</div>'+
      '<div style="margin-left:auto;display:flex;align-items:center;gap:8px;flex-shrink:0;">'+
        (locked ? '' : '<div style="width:230px;">'+renderPrimaryAction(c)+'</div>')+
        '<div style="position:relative;">'+
          '<button class="icon-btn" data-more-actions="'+c.id+'" style="width:34px;height:34px;" aria-label="More actions">'+icon('menu',15)+'</button>'+
          '<div class="search-results" id="moreActions-'+c.id+'" style="width:200px;right:0;left:auto;top:calc(100% + 4px);" hidden>'+
            '<div class="menu-item" data-fhir="'+c.id+'">'+icon('shield',14)+'FHIR / mCODE export</div>'+
            '<div class="menu-item" data-copy-link="'+c.id+'">'+icon('download',14)+'Copy case link</div>'+
            '<div class="menu-item" data-toast="Case summary PDF would be generated here (demo).">'+icon('assessment',14)+'Print summary</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
  '</div>';
}
function renderWorkspace(id){
  const c = findCase(id);
  if(!c){
    return '<div class="card"><div class="empty-state">'+icon('alert',30)+'<div>Case not found.</div><button class="btn btn-secondary btn-sm" data-go="cases" style="margin-top:12px;">Back to Cases</button></div></div>';
  }
  if(c.hasNodeForms && !c.forms) seedRectalForms(c);
  let tab = STATE.workspaceTab[c.id] || c.defaultTab || 'summary';
  /* There is no separate Discussion tab: the MDT lives on its own stop of the Timeline. */
  if(tab==='discussion'){
    tab = 'timeline'; STATE.workspaceTab[c.id] = 'timeline';
    const mdtIdx = c.timeline.findIndex(isMdtStage); if(mdtIdx>=0) STATE.timelineActive[c.id] = mdtIdx;
  }
  const invitedRoles = c.specialists.map(s=>s.role);
  const availableRoles = Object.keys(DEPT).filter(r => !invitedRoles.includes(r)).slice(0,6);

  const supplementaryTabs = [
    c.forms ? {id:'forms', icon:'assessment', label:'Node Forms'} : null,
    {id:'imaging', icon:'image', label:'Imaging'},
    c.tumourType==='Lung' ? {id:'biopsy', icon:'assessment', label:'Biopsy / EBUS'} : null,
    c.tumourType==='Lung' ? {id:'pathology', icon:'library', label:'Pathology'} : null,
    c.tumourType==='Lung' ? {id:'staging', icon:'flag', label:'Staging'} : null,
    c.tumourType==='Lung' ? {id:'fitness', icon:'stetho', label:'Fitness Assessment'} : null,
    c.tumourType==='Lung' ? {id:'molecular', icon:'layers', label:'Molecular'} : null,
    c.tumourType==='Lung' && c.treatmentLog ? {id:'restaging', icon:'network', label:'Restaging'} : null,
    c.treatmentLog ? {id:'treatment', icon:'timer', label:'Treatment Log'} : null,
    c.surgicalPortal ? {id:'surgery', icon:'stetho', label:'Surgery Portal'} : null,
    c.adjuvantPortal ? {id:'adjuvant', icon:'flag', label:'Adjuvant Therapy'} : null,
    c.surveillance ? {id:'surveillance', icon:'shield', label:'Surveillance'} : null,
    {id:'note', icon:'book', label:'Discharge Note'}
  ].filter(Boolean);
  const isSupplementary = supplementaryTabs.some(t=>t.id===tab);
  /* The top-level "Supplementary" button's data-tab is whichever sub-tab is (or should be)
     showing, so the generic data-tab click handler works with no special-casing. */
  const supplementaryTarget = isSupplementary ? tab : supplementaryTabs[0].id;
  const supplementaryIcon = (supplementaryTabs.find(t=>t.id===supplementaryTarget)||supplementaryTabs[0]).icon;

  return ''+
  '<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink-faint);">'+
    '<a data-go="cases" style="cursor:pointer;color:var(--accent-strong);font-weight:600;">Cases</a> '+icon('chevronRight',12)+' <span class="mono">#'+c.id+'</span>'+
  '</div>'+
  renderWorkspaceHeader(c)+

    /* ---- main: full-width tabs, timeline-first ---- */
    '<div class="card" style="min-width:0;">'+
      '<div class="tabs-row">'+
        '<button class="tab-scroll-btn" data-tab-scroll="left" aria-label="Scroll tabs left">'+icon('chevronLeft',14)+'</button>'+
        '<div class="tabs" style="opacity:.85;" id="workspaceTabs">'+
          tabBtn('summary', tab, 'assessment', 'Summary')+
          tabBtn('timeline', tab, 'activity', 'Timeline')+
          tabBtn(supplementaryTarget, tab, supplementaryIcon, 'Supplementary')+
        '</div>'+
        '<button class="tab-scroll-btn" data-tab-scroll="right" aria-label="Scroll tabs right">'+icon('chevronRight',14)+'</button>'+
      '</div>'+
      (isSupplementary ?
        '<div class="tabs-row" style="border-top:1px solid var(--line);">'+
          '<button class="tab-scroll-btn" data-tab-scroll="left" aria-label="Scroll supplementary tabs left">'+icon('chevronLeft',14)+'</button>'+
          '<div class="tabs" style="opacity:.85;" id="workspaceSubTabs">'+
            supplementaryTabs.map(t=>tabBtn(t.id, tab, t.icon, t.label)).join('')+
          '</div>'+
          '<button class="tab-scroll-btn" data-tab-scroll="right" aria-label="Scroll supplementary tabs right">'+icon('chevronRight',14)+'</button>'+
        '</div>' : '')+
      '<div class="card-pad" data-workspace-body="'+c.id+'">'+
        (tab==='summary' ? renderTabSummary(c) :
         tab==='imaging' ? renderTabImaging(c) :
         tab==='timeline' ? renderTabTimeline(c) :
         tab==='biopsy' && c.tumourType==='Lung' ? renderTabBiopsy(c) :
         tab==='pathology' && c.tumourType==='Lung' ? renderTabPathology(c) :
         tab==='staging' && c.tumourType==='Lung' ? renderTabStaging(c) :
         tab==='fitness' && c.tumourType==='Lung' ? renderTabFitness(c) :
         tab==='molecular' && c.tumourType==='Lung' ? renderTabMolecular(c) :
         tab==='restaging' && c.tumourType==='Lung' && c.treatmentLog ? renderTabRestaging(c) :
         tab==='treatment' && c.treatmentLog ? renderTabTreatment(c) :
         tab==='surgery' && c.surgicalPortal ? renderTabSurgery(c) :
         tab==='adjuvant' && c.adjuvantPortal ? renderTabAdjuvant(c) :
         tab==='surveillance' && c.surveillance ? renderTabSurveillance(c) :
         tab==='note' ? renderTabNote(c) :
         tab==='forms' && c.forms ? renderTabForms(c) :
         renderTabDiscussion(c, availableRoles))+
      '</div>'+
    '</div>';
}
function tabBtn(id, active, iconName, label){
  return '<div class="tab-btn '+(active===id?'active':'')+'" data-tab="'+id+'">'+icon(iconName,15)+' '+esc(label)+'</div>';
}

/* The structured New Assessment intake fields — now shown as the "Presentation
   & History" stage detail in Clinical History (that's literally what Stop 1
   captures), not as the Summary tab. */
function renderIntakeFieldsSummary(c){
  const t = TEMPLATES[c.tumourType];
  if(!t){
    return '<div class="callout callout-info">This case belongs to the <strong>'+esc(c.pathway)+'</strong> pathway, which uses a free-form structured intake rather than a tumour-specific template.</div>';
  }
  const fetched = !!(STATE.emrFetched && STATE.emrFetched[c.id]);
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    '<div class="callout '+(fetched?'callout-good':'callout-info')+'" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">'+
      '<span>'+(fetched
        ? icon('checkCircle',13)+' Auto-filled from the hospital EMR/LIS/RIS &middot; captured via the <strong>'+esc(t.label)+' Initial Assessment Template</strong>. Review flagged fields before treating as final.'
        : 'Captured via the <strong>'+esc(t.label)+' Initial Assessment Template</strong> at point of care — structured, not narrative.')+
      '</span>'+
      '<button class="btn '+(fetched?'btn-ghost':'btn-gold')+' btn-sm" data-emr-fetch-history="'+c.id+'">'+icon('download',13)+' '+(fetched?'Re-fetch from Hospital System':'Auto-fetch from Hospital System')+'</button>'+
    '</div>'+
    t.sections.map(sec=>
      '<div><div style="font-size:11.5px;font-weight:700;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">'+esc(sec.title)+'</div>'+
      '<div class="fields-grid">'+sec.fields.map(f=>{
        const val = fetched ? sampleFieldValue(c,f) : null;
        return '<div><div style="font-size:10.5px;color:var(--ink-faint);display:flex;align-items:center;gap:5px;">'+esc(f.label)+(val!=null?autoFillBadge():'')+'</div>'+
          '<div style="font-size:13px;font-weight:600;'+(val==null?'color:var(--ink-faint);font-style:italic;font-weight:400;':'')+'">'+(val==null ? 'Not yet fetched' : esc(val)+(f.unit?' '+f.unit:''))+'</div></div>';
      }).join('')+'</div></div>'
    ).join('')+
  '</div>';
}
/* ============================================================
   SUMMARY TAB — CASE SNAPSHOT PANEL
   Per "Case Snapshot Panel (Summary Beside Timeline)" design spec:
   read-only, auto-derived from locked timeline stops, ordered by
   decision-relevance (not chronology), progressive (pending fields
   grey out rather than showing blank), monochrome except FLAGS,
   and every field taps through to the timeline stop it came from.
   Nothing here is typed twice — it only ever mirrors what a stop
   has already locked.
   ============================================================ */
/* A stage with no date can still be "resolved" if its summary explicitly says the
   stage doesn't apply to this case's pathway (N/A, bypassed, not performed) — those
   must not read as outstanding work or as the next milestone. */
function isInapplicableStage(t){
  if(t.naByDesign) return true;
  return /^(n\/a|not performed|not applicable)\b/i.test((t.summary||'').trim());
}
function caseStateBadge(c){
  const locked = c.status === 'Decision Locked';
  if(!locked) return {label:'Awaiting MDT', cls:'badge-info'};
  const openWork = c.timeline.some(t => !t.date && !isInapplicableStage(t));
  return openWork ? {label:'On treatment', cls:'badge-gold'} : {label:'Active', cls:'badge-tier1'};
}
function snapshotStageIdx(c, names){ return c.timeline.findIndex(t=>names.includes(t.stage)); }
function snapshotJumpAttr(c, names){
  const idx = snapshotStageIdx(c, names);
  return idx>=0 ? (c.id+'::'+idx) : '';
}
const PENDING_HTML = '<span style="color:var(--ink-faint);font-style:italic;">— pending —</span>';
function snapshotRow(label, contentHtml, jumpAttr, iconName){
  return '<div class="snapshot-row"'+(jumpAttr?' data-snapshot-jump="'+jumpAttr+'"':'')+'>'+
    '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);margin-bottom:4px;display:flex;align-items:center;gap:5px;">'+(iconName?icon(iconName,11):'')+esc(label)+'</div>'+
    '<div style="font-size:13px;line-height:1.55;">'+contentHtml+'</div>'+
  '</div>';
}
/* A single snapshot row can bundle lines sourced from different stops (e.g. Diagnosis:
   histology from Pathology, biomarkers from Molecular) — each such line gets its own
   tap target instead of the whole row sharing one jump, so traceability stays per-field. */
function jumpLine(innerHtml, jumpAttr){
  return jumpAttr ? '<div class="snapshot-subline" data-snapshot-jump="'+jumpAttr+'">'+innerHtml+'</div>' : '<div>'+innerHtml+'</div>';
}
/* Secondary snapshot facts (smoking, site, biomarkers, cycle progress...) render as the
   same rounded .chip pill the case-header's key-facts row already uses, so the panel
   picks up that same visual language instead of looking like a plain data dump. */
function snapshotChip(iconName, text){
  return '<span class="chip" style="font-size:11px;padding:3px 9px;">'+(iconName?icon(iconName,11):'')+esc(text)+'</span>';
}
/* Every node can flag exactly one ★ key image (per the image-module spec); this collects
   them across the whole timeline for the Case Snapshot strip and the MDT image board —
   auto-assembled from node data, never manually curated. Returns [] for any case that
   doesn't use the per-node images schema, so this is a no-op everywhere else. */
function collectKeyImages(c){
  const out = [];
  c.timeline.forEach((t,i)=>{
    (t.images||[]).forEach(im=>{ if(im.keyImage) out.push({stageIdx:i, stageName:t.stage, caption:im.caption, modality:im.modality, external:im.external}); });
    if(c.chemo && t.stage==='Consolidation Chemotherapy'){
      c.chemo.cycles.forEach(cy=>(cy.photos||[]).forEach(ph=>{ if(ph.keyImage) out.push({stageIdx:i, stageName:t.stage, caption:ph.caption, modality:ph.modality}); }));
    }
  });
  return out;
}
/* Key images are reviewed one at a time in a modal, not dumped as a cramped inline strip
   — this one button + counter is reused everywhere a case's key images need surfacing
   (Case Snapshot, the MDT image board), so there's exactly one place to fix the layout. */
function reviewImagesButton(c, label){
  const keyImages = collectKeyImages(c);
  if(!keyImages.length) return '';
  return '<button class="btn btn-secondary btn-sm" data-open-image-review="'+c.id+'" data-start-idx="0">'+icon('image',13)+' '+esc(label||'Review')+' ('+keyImages.length+')</button>';
}
/* A single node's own gallery (not just its ★ key image) — same one-by-one modal engine
   as the case-wide key images, so there's exactly one image-viewing pattern in the app,
   never an inline strip of tiny thumbnails. */
function nodeImagesButton(c, stageIdx, stage){
  if(!stage.images || !stage.images.length) return '';
  const n = stage.images.length;
  return '<div><button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-open-node-image-review="'+c.id+'::'+stageIdx+'">'+icon('image',13)+' View image'+(n===1?'':'s')+' ('+n+')</button></div>';
}
function imagesForReview(c, mode, stageIdx){
  if(mode==='node'){
    const stage = c.timeline[stageIdx];
    const base = (stage && stage.images) ? stage.images.map(im=>({stageIdx, stageName:stage.stage, caption:im.caption, modality:im.modality, external:im.external, keyImage:im.keyImage})) : [];
    const photos = (c.chemo && stage && stage.stage==='Consolidation Chemotherapy') ? c.chemo.cycles.reduce((a,cy)=>a.concat((cy.photos||[]).map(p=>({stageIdx, stageName:stage.stage, caption:'Cycle '+cy.n+' — '+p.caption, modality:p.modality, keyImage:p.keyImage}))), []) : [];
    return base.concat(photos);
  }
  return collectKeyImages(c);
}
function renderImageReviewModal(c, mode, stageIdx, idx){
  const images = imagesForReview(c, mode, stageIdx);
  const n = images.length;
  if(!n) return '<div class="modal-body"><div class="empty-state">'+icon('image',24)+'<div>No images to review.</div></div></div>';
  idx = ((idx % n) + n) % n;
  const ki = images[idx];
  const navBase = c.id+'::'+mode+'::'+(mode==='node'?stageIdx:'')+'::';
  return '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">'+(mode==='node'?esc(ki.stageName):'Key Images')+' · Case #'+c.id+'</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;flex-direction:column;gap:12px;align-items:center;">'+
      '<div style="width:100%;max-width:680px;height:min(46vh,430px);">'+imageBox(ki.modality || ki.stageName, 'viewer')+'</div>'+
      '<div style="text-align:center;max-width:420px;">'+
        '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">'+(ki.keyImage?icon('sparkle',10)+' ':'')+(mode==='keyImages'?esc(ki.stageName):'Image '+(idx+1))+(ki.external?' · [ext]':'')+'</div>'+
        '<div style="font-size:13px;line-height:1.55;margin-top:5px;">'+esc(ki.caption)+'</div>'+
      '</div>'+
      '<div style="position:sticky;bottom:0;z-index:2;width:100%;background:var(--surface);border-top:1px solid var(--border);padding:10px 0 2px;display:flex;flex-direction:column;align-items:center;gap:8px;">'+
      '<div style="display:flex;align-items:center;gap:16px;">'+
        '<button class="btn btn-secondary btn-sm" data-image-review-nav="'+navBase+(idx-1)+'" '+(n<2?'disabled':'')+'><span style="display:inline-block;transform:scaleX(-1);">'+icon('chevronRight',14)+'</span> Prev</button>'+
        '<span class="mono" style="font-size:11px;color:var(--ink-faint);">'+(idx+1)+' of '+n+'</span>'+
        '<button class="btn btn-secondary btn-sm" data-image-review-nav="'+navBase+(idx+1)+'" '+(n<2?'disabled':'')+'>Next '+icon('chevronRight',14)+'</button>'+
      '</div>'+
      (mode==='keyImages' ? '<button class="btn btn-gold btn-sm" data-image-review-jump="'+c.id+'::'+ki.stageIdx+'">'+icon('chevronRight',13)+' Jump to '+esc(ki.stageName)+'</button>' : '')+
      '</div>'+
    '</div>';
}
function openImageReviewModal(caseId, idx){
  const c = findCase(caseId); if(!c) return;
  openModal(renderImageReviewModal(c, 'keyImages', null, idx||0), {wide:true});
}
function openNodeImageReviewModal(caseId, stageIdx, idx){
  const c = findCase(caseId); if(!c) return;
  openModal(renderImageReviewModal(c, 'node', Number(stageIdx), idx||0), {wide:true});
}
function renderCaseSnapshot(c){
  const locked = c.status === 'Decision Locked';
  const isOnco = c.tumourType && c.tumourType !== '—';
  const state = caseStateBadge(c);
  const presIdx = ['Presentation & History','Presentation'];
  const molIdx = ['Molecular NGS + PD-L1','Molecular'];
  const histIdx = ['Pathology (Histo + IHC)','Biopsy'];
  /* Extra fallback names cover cases built on the newer per-node stop names (e.g. the
     Bronchoscopy/EBUS-TBNA split, or CT/Brain-MRI as their own stops) so the jump link
     still resolves instead of silently going dead for a case that doesn't use the
     original coarse 'Diagnostic Workup / Biopsy' / 'Staging (...)' stage names. */
  const siteIdx = ['Diagnostic Workup / Biopsy','Biopsy','EBUS-TBNA (Nodal Tissue Staging)','Bronchoscopy (Airway Assessment)'];
  const stagingIdx = ['Staging (CT / PET / Brain MRI)','Imaging','Brain MRI + Stage Assignment','CT Chest/Abdomen (Diagnostic Imaging)'];
  const planIdx = ['Neoadjuvant Therapy','Adjuvant Therapy','Surgery'];

  /* Patient */
  const ecogFact = c.keyFacts.find(k=>/ecog/i.test(k));
  const smokingFact = c.keyFacts.find(k=>/smoker|pack-year/i.test(k));
  const patientHtml = '<strong>'+c.patient.age+esc(c.patient.sex)+'</strong> &middot; MRN '+esc(c.patient.mrn)+(ecogFact?' &middot; '+esc(ecogFact):'')+
    (smokingFact ? '<div style="margin-top:5px;">'+snapshotChip('activity', smokingFact)+'</div>' : '');

  /* Diagnosis: histology (Stop 3 / Pathology), site (Stop 2/4 laterality) and
     biomarkers (Stop 6 / Molecular) are three separately-sourced fields per the
     spec's field map — each line taps through to its own stop, not one shared jump.
     Each prefers the LIVE assessment a clinician actually submitted through that
     stop's own tab over the case's seeded label — c.diagnosis/c.stage/c.biomarkers
     are never overwritten (they're used as case titles/labels throughout the rest
     of the app), so nothing already on screen is ever lost; this only changes what
     the Snapshot *reads* once a stop has real submitted data to prefer instead. */
  const livePathDx = c.pathologyAssessment ?
    (c.pathologyAssessment.primaryDx==='Non-small cell carcinoma' ? c.pathologyAssessment.nsclcSubtype : c.pathologyAssessment.primaryDx) : null;
  const histLine = jumpLine('<strong>'+esc(livePathDx || c.diagnosis)+'</strong>', snapshotJumpAttr(c, histIdx));
  /* Site priority, per the Stop 2/Stop 4 developer specs: Stop 2's own lesionLocation
     is the spec-designated source, but it's only ever captured when a visible
     endobronchial lesion was found (peripheral nodules sampled by CT-guided biopsy
     never populate it) — so fall back to Stop 4's laterality, which is a required
     field there for its own nodal-side logic and so is populated far more often. */
  let siteLine = '';
  if(c.biopsyAssessment && c.biopsyAssessment.visibleLesion==='Present' && c.biopsyAssessment.lesionLocation){
    siteLine = jumpLine(snapshotChip('flag','Site: '+c.biopsyAssessment.lesionLocation), snapshotJumpAttr(c, siteIdx));
  } else if(c.stagingAssessment && c.stagingAssessment.laterality){
    siteLine = jumpLine(snapshotChip('flag','Site: '+c.stagingAssessment.laterality), snapshotJumpAttr(c, stagingIdx));
  } else {
    const SITE_TOKENS = ['RUL','RLL','LUL','LLL','RML','left breast','right breast','base of tongue'];
    const siteToken = SITE_TOKENS.find(tok=>c.diagnosis.toLowerCase().includes(tok.toLowerCase()));
    siteLine = siteToken ? jumpLine(snapshotChip('flag','Site: '+siteToken), snapshotJumpAttr(c, siteIdx)) : '';
  }
  /* Biomarkers: Stop 6 (Molecular) is the only stop that can ever make this field
     live — prefer its own submitted result summary over the seeded keyFacts chips. */
  const liveBiomarkerFacts = c.molecularAssessment ? molecularSummaryFacts(c.molecularAssessment) : null;
  const biomarkerFacts = liveBiomarkerFacts || c.keyFacts.filter(k=>factIcon(k)==='network');
  const molStageDated = snapshotStageIdx(c,molIdx)>=0 && c.timeline[snapshotStageIdx(c,molIdx)].date;
  const biomarkerLine = !isOnco ? '' : jumpLine(
    biomarkerFacts.length ? biomarkerFacts.map(f=>snapshotChip('network',f)).join(' ') :
      (molStageDated ? snapshotChip('network','No actionable driver reported') : PENDING_HTML),
    snapshotJumpAttr(c, molIdx)
  );
  /* Site and Biomarkers share one flex-wrap row so the tagged chips run sequentially
     instead of stacking one below the other — each keeps its own tap target since
     they're still two independent .snapshot-subline children of this shared row. */
  const secondaryRow = (siteLine || biomarkerLine) ? '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:5px;">'+siteLine+biomarkerLine+'</div>' : '';
  const diagnosisHtml = histLine+secondaryRow;

  /* Stage + nodal detail — prefer the Staging tab's own live-computed cT/cN/cM and
     stage group (submitStagingAssessment) over the case's seeded c.stage string. */
  const liveStage = c.stagingAssessment ?
    ('c'+c.stagingAssessment.cT+' '+c.stagingAssessment.cN+' '+c.stagingAssessment.cM+' — Stage '+c.stagingAssessment.stage) : null;
  const nodalFact = c.keyFacts.find(k=>/node|station/i.test(k));
  const stageHtml = '<strong>'+esc(liveStage || c.stage)+'</strong>'+(nodalFact ? '<div style="margin-top:5px;">'+snapshotChip('image', nodalFact)+'</div>' : '');

  /* A dated stage flagged with dissent (e.g. progression found at restaging) means
     the original locked decision no longer reflects the live plan — surface that
     on both Current Plan and Flags rather than silently showing a stale plan. */
  const dissentStage = c.timeline.find(t=>t.date && t.hasDissent);

  /* Current plan — trimmed to progress only, no repeated plan sentence. Tier, quorum,
     lock date and the full plan/contingency text now live once, together, in the
     Decision Locked card below (see renderTabSummary) instead of being duplicated here. */
  let planHtml = PENDING_HTML;
  if(locked){
    if(c.treatmentLog){
      const tl = c.treatmentLog;
      const given = tl.cycles.filter(cy=>cy.status==='given').length;
      planHtml = snapshotChip('timer','Cycle '+given+' of '+tl.numCycles+' given');
    } else if(c.adjuvantPortal && c.adjuvantPortal.regimenLocked && c.adjuvantPortal.log){
      const log = c.adjuvantPortal.log;
      const given = log.cycles.filter(cy=>cy.status==='given').length;
      planHtml = snapshotChip('timer', log.regimen+' — cycle '+given+' of '+log.numCycles+' given');
    } else {
      planHtml = '<span class="badge badge-tier1">'+icon('checkCircle',11)+' Locked — see Decision below</span>';
    }
    if(dissentStage) planHtml += '<div style="margin-top:5px;"><span style="color:var(--crit-ink);font-weight:600;">'+icon('alert',11)+' Reopened after '+esc(dissentStage.stage)+' — see Flags</span></div>';
  }

  /* Flags — the one place colour is allowed */
  const flags = [];
  if(c.conflict && !locked) flags.push(c.conflictNote || 'Unresolved tier conflict');
  if(locked && c.decision.disagreement && !/^none\b/i.test(c.decision.disagreement.trim())) flags.push(c.decision.disagreement);
  if(!locked && c.deferredItem) flags.push('Deferred: awaiting '+c.deferredItem.item);
  if(dissentStage) flags.push(dissentStage.stage+': dissent recorded');
  if(c.treatmentLog){
    const sevTox = c.treatmentLog.cycles.flatMap(cy=>cy.toxicities||[]).filter(t=>t.grade>=3);
    if(sevTox.length) flags.push(sevTox.map(t=>t.name+' G'+t.grade).join(', '));
  }
  const flagsHtml = flags.length
    ? '<div style="display:flex;flex-wrap:wrap;gap:5px;">'+flags.map(f=>'<span class="badge badge-tier3">'+icon('alert',11)+' '+esc(f)+'</span>').join('')+'</div>'
    : '<span class="badge badge-neutral">'+icon('checkCircle',11)+' None active</span>';

  /* Key Anatomy — pulled from the CT node's own structured findings when present, never
     re-typed. Additive: absent for every case without a CT node carrying
     structuredFindings, so this is a no-op everywhere except a case built on the new
     per-node schema. */
  const ctStage = c.timeline.find(t=>t.stage==='CT Chest/Abdomen (Diagnostic Imaging)');
  const ctF = ctStage && ctStage.structuredFindings;
  let keyAnatomyHtml = '';
  if(ctF && ctF.tumorSizeCm){
    const nodeParts = [];
    if(ctF.station4rSizeCm) nodeParts.push('4R '+ctF.station4rSizeCm+'cm');
    if(ctF.station7SizeCm) nodeParts.push('7 '+ctF.station7SizeCm+'cm');
    const anatomyText = ctF.tumorSizeCm+'cm mass'+(ctF.mediastinalAbutment && ctF.mediastinalAbutment!=='None' ? ', '+ctF.mediastinalAbutment.toLowerCase() : '')+(nodeParts.length ? '; nodes '+nodeParts.join(', ') : '');
    keyAnatomyHtml = jumpLine(snapshotChip('flag', anatomyText), c.id+'::'+c.timeline.indexOf(ctStage));
  }

  /* Function — pulmonary + cardiac one-liner, pulled from the Fitness assessment and
     the Cardiac node's own structured findings when both exist. */
  const cardiacStage = c.timeline.find(t=>t.stage==='Cardiac Assessment');
  const cardiacF = cardiacStage && cardiacStage.structuredFindings;
  let functionHtml = '';
  if(c.fitnessAssessment){
    const fa = c.fitnessAssessment, fnParts = [];
    if(fa.fev1Pct) fnParts.push('FEV₁ '+fa.fev1Pct+'% pred');
    if(fa.dlcoPct) fnParts.push('DLCO '+fa.dlcoPct+'% pred');
    if(cardiacF && cardiacF.rcriScore!=null && cardiacF.rcriScore!=='') fnParts.push('ThRCRI '+cardiacF.rcriScore);
    const fitnessIdx = c.timeline.findIndex(t=>t.stage==='Fitness / Functional Assessment');
    if(fnParts.length) functionHtml = jumpLine(snapshotChip('stetho', fnParts.join('; ')), c.id+'::'+fitnessIdx);
  }

  /* Overall Tier — every worked-case spec's Case Snapshot table carries this as its own
     row with a source node ("Overall tier: TIER 2 → MDT (Surgeon node)"), not just a
     badge up in the page header disconnected from the rest of the snapshot. Shows the
     escalating node when the per-node tier schema is in use; otherwise just the badge,
     so this is additive for every other case. */
  const tier2Idx = c.timeline.findIndex(t=>t.tierMark && t.tierMark.tier===2);
  const tierHtml = tierBadge(c.tier, c.tierBadgeOverride)+(tier2Idx>=0
    ? '<div class="snapshot-subline" data-snapshot-jump="'+c.id+'::'+tier2Idx+'" style="margin-top:5px;font-size:11.5px;color:var(--ink-muted);">'+icon('chevronRight',10)+' → MDT, triggered at '+esc(c.timeline[tier2Idx].stage)+'</div>'
    : '');

  /* Next milestone */
  const nextStage = c.timeline.find(t=>!t.date && !isInapplicableStage(t));
  const nextIdx = nextStage ? c.timeline.indexOf(nextStage) : -1;
  const nextHtml = nextStage ? '<span class="badge badge-gold">'+icon('clock',11)+' '+esc(nextStage.stage)+'</span>' : '<span class="badge badge-tier1">'+icon('checkCircle',11)+' Pathway complete</span>';

  return '<div class="card">'+
    '<div class="card-pad" style="display:flex;flex-direction:column;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:10px;">'+
        '<div style="display:flex;align-items:center;gap:8px;">'+
          '<div style="width:24px;height:24px;border-radius:7px;background:var(--accent-soft);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon('layers',13)+'</div>'+
          '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);">Case Snapshot</div>'+
        '</div>'+
        '<span class="badge '+state.cls+'"><span class="badge-dot"></span>'+esc(state.label)+'</span>'+
      '</div>'+
      '<hr class="divider">'+
      (c.externalRecords ? snapshotRow('Referral', '<span class="chip" style="font-size:10px;background:var(--gold-soft);color:var(--gold-strong);border-color:transparent;margin-right:6px;">EXT</span>'+esc(c.externalRecords.nutshell), snapshotJumpAttr(c,['External Records']), 'download') + '<hr class="divider">' : '')+
      snapshotRow('Patient', patientHtml, snapshotJumpAttr(c, presIdx), 'users')+
      '<hr class="divider">'+
      snapshotRow('Diagnosis', diagnosisHtml, '', 'assessment')+
      '<hr class="divider">'+
      snapshotRow('Stage', stageHtml, snapshotJumpAttr(c, stagingIdx), 'flag')+
      (keyAnatomyHtml ? '<hr class="divider">'+snapshotRow('Key Anatomy', keyAnatomyHtml, '', 'flag') : '')+
      (functionHtml ? '<hr class="divider">'+snapshotRow('Function', functionHtml, '', 'stetho') : '')+
      '<hr class="divider">'+
      snapshotRow('Overall Tier', tierHtml, '', 'shield')+
      '<hr class="divider">'+
      snapshotRow('Current Plan', planHtml, snapshotJumpAttr(c, planIdx), 'checkCircle')+
      '<hr class="divider">'+
      snapshotRow('Flags', flagsHtml, '', 'alert')+
      '<hr class="divider">'+
      snapshotRow('Next Milestone', nextHtml, nextIdx>=0 ? (c.id+'::'+nextIdx) : '', 'clock')+
      (function(){
        const btn = reviewImagesButton(c, 'Review key images');
        return btn ? '<hr class="divider">'+snapshotRow('Key Images', btn, '', 'image') : '';
      })()+
    '</div>'+
  '</div>';
}
/* ---------------- Summary tab: "story so far" strips (surveillance-phase layout) ---------------- */
function withCites(t){
  return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(\d+)\]/g, '<span style="color:var(--ink-faint);font-size:.85em;">[$1]</span>');
}
const SUMMARY_LEVEL = {
  red:{c:'var(--crit)', bg:'var(--crit-soft)', ink:'var(--crit-ink)'},
  amber:{c:'var(--warn)', bg:'var(--warn-soft)', ink:'var(--warn-ink)'},
  green:{c:'var(--good)', bg:'var(--good-soft)', ink:'var(--good-ink)'},
};
const SUMMARY_PHASE_STATE = {stable:'green', alert:'amber', recurrence:'red'};
function summaryStrip(title, bodyHtml){
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
    (title ? '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">'+esc(title)+'</div>' : '')+
    bodyHtml+
  '</div>';
}
function summaryDot(level){ return '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+SUMMARY_LEVEL[level].c+';flex-shrink:0;"></span>'; }
function summaryTable(headers, rowsHtml){
  return '<div class="table-wrap"><table><thead><tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rowsHtml+'</tbody></table></div>';
}
function renderSummaryStatusHeader(s){
  const lv = SUMMARY_LEVEL[SUMMARY_PHASE_STATE[s.state] || 'green'];
  const sep = '<span style="color:var(--ink-faint);">•</span>';
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:9px;border-left:4px solid '+lv.c+';">'+
    '<div style="font-size:15px;font-weight:700;">'+esc(s.headline)+'</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;">'+
      '<span style="font-weight:700;letter-spacing:.03em;">CURRENT PHASE:</span>'+
      '<span class="badge" style="background:'+lv.bg+';color:'+lv.ink+';white-space:normal;height:auto;line-height:1.35;padding:3px 10px;">'+summaryDot(SUMMARY_PHASE_STATE[s.state]||'green')+'&nbsp;'+esc(s.phase)+'</span>'+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:700;">'+
      '<span>'+esc(s.timeSinceCcr)+'</span>'+sep+
      '<span class="badge" style="background:'+SUMMARY_LEVEL.red.c+';color:#fff;font-weight:700;">'+icon('clock',11)+'&nbsp;'+esc(s.riskWindow)+'</span>'+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:700;">'+
      '<span style="display:inline-flex;align-items:center;gap:4px;">'+icon('chevronRight',13)+' NEXT DUE:</span>'+
      s.nextDue.map(n=>'<span>'+esc(n.what)+' — '+esc(n.when)+'</span>').join('<span style="color:var(--ink-faint);">|</span>')+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:700;">'+
      '<span style="display:inline-flex;align-items:center;gap:4px;">'+icon('alert',13)+' '+esc(s.alerts)+'</span>'+sep+'<span>'+esc(s.lastCea)+'</span>'+
    '</div>'+
  '</div>';
}
function renderSummaryRibbon(c, s){
  const pills = s.ribbon.map(p=>{
    const lv = p.tier2 ? SUMMARY_LEVEL.red : (p.here ? SUMMARY_LEVEL.green : null);
    const style = lv ? 'background:'+lv.bg+';color:'+lv.ink+';border-color:'+lv.c+';' : '';
    return '<span class="chip" style="'+style+'font-size:12px;padding:4px 11px;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;'+(p.here?'font-weight:700;':'')+'">'+
      (p.tier2 ? summaryDot('red') : p.here ? summaryDot('green') : p.box ? icon('layers',12) : '')+
      esc(p.label)+(p.done ? ' '+icon('check',12) : '')+(p.hereNote ? ' <span style="font-weight:500;">('+esc(p.hereNote)+')</span>' : '')+
    '</span>';
  }).join('<span style="color:var(--ink-faint);">—</span>');
  return summaryStrip('Journey ribbon',
    '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">'+pills+'</div>'+
    '<div><span class="badge" style="background:'+SUMMARY_LEVEL.red.bg+';color:'+SUMMARY_LEVEL.red.ink+';">'+s.tier2Events+' Tier-2 event'+(s.tier2Events===1?'':'s')+'</span></div>');
}
function renderSummaryDiagnosis(s){
  const rows = s.diagnosis.map(r=>{
    const val = r.flags
      ? r.flags.map(f=>(f.red?summaryDot('red')+' ':'')+esc(f.t)).join(' <span style="color:var(--ink-faint);">•</span> ')+(r.cite?' '+withCites(r.cite):'')
      : withCites(r.value);
    return '<div style="padding:8px 0;border-top:1px solid var(--border);display:grid;grid-template-columns:160px 1fr;gap:12px;align-items:baseline;">'+
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-faint);">'+esc(r.label)+'</div>'+
      '<div style="font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">'+val+'</div>'+
    '</div>';
  }).join('');
  return summaryStrip('Diagnosis & stage at a glance', '<div>'+rows+'</div>');
}
function renderSummaryTreatment(s){
  return summaryStrip('Treatment delivered', summaryTable(['Phase','Delivered','Key number'],
    s.treatment.map(r=>'<tr><td style="font-weight:600;">'+esc(r.phase)+'</td><td>'+withCites(r.delivered)+'</td><td>'+withCites(r.key)+'</td></tr>').join('')));
}
function renderSummarySurveillance(s){
  const sv = s.surveillance;
  return summaryStrip('Surveillance status',
    '<div style="font-size:12px;color:var(--ink-muted);">Against the loaded '+withCites(sv.schedule)+'</div>'+
    summaryTable(['Modality','Cadence','Last done','Result','Next due'],
      sv.rows.map(r=>'<tr>'+
        '<td style="font-weight:600;">'+esc(r.modality)+'</td><td>'+esc(r.cadence)+'</td><td>'+esc(r.last)+'</td>'+
        '<td>'+esc(r.result)+(r.ok ? ' <span style="color:var(--good);display:inline-flex;vertical-align:middle;">'+icon('check',13)+'</span>' : '')+'</td>'+
        '<td>'+withCites(r.next)+'</td></tr>').join('')));
}
/* Anatomical schematic (torso, front view): organ outlines carry the risk colour, numbered
   markers tie each organ to its legend row. Colour is the only data. */
function summaryBodyMapSvg(zones){
  const lvl = k => (zones.find(z=>z.key===k)||{}).level || 'green';
  const col = k => SUMMARY_LEVEL[lvl(k)].c;
  const organ = (k, d) => '<path d="'+d+'" fill="'+col(k)+'" fill-opacity=".5" stroke="'+col(k)+'" stroke-width="1.6" stroke-linejoin="round"/>';
  const badge = (n, x, y, k) => '<circle cx="'+x+'" cy="'+y+'" r="8.5" fill="'+col(k)+'" stroke="var(--surface)" stroke-width="1.5"/><text x="'+x+'" y="'+(y+3.6)+'" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="inherit">'+n+'</text>';
  return '<svg viewBox="0 0 200 290" style="width:100%;max-width:190px;display:block;flex-shrink:0;" role="img" aria-label="Relapse-risk anatomical map">'+
    '<path d="M84 4 L84 18 Q56 22 36 34 Q26 50 34 90 Q40 150 36 200 Q34 240 52 272 L148 272 Q166 240 164 200 Q160 150 166 90 Q174 50 164 34 Q144 22 116 18 L116 4 Z" fill="var(--surface-2)" stroke="var(--border-strong)" stroke-width="1.6" stroke-linejoin="round"/>'+
    '<path d="M100 18 L100 56 M100 56 L84 70 M100 56 L116 70" fill="none" stroke="var(--border-strong)" stroke-width="1.4" stroke-linecap="round"/>'+
    '<path d="M38 124 Q100 102 162 124" fill="none" stroke="var(--border-strong)" stroke-width="1.1" stroke-dasharray="3 3"/>'+
    '<ellipse cx="100" cy="228" rx="46" ry="40" fill="none" stroke="var(--border-strong)" stroke-width="1.2" stroke-dasharray="3 3"/>'+
    organ('lungs','M68 34 Q46 48 48 92 Q50 118 76 113 Q94 108 94 84 Q96 56 82 38 Q76 31 68 34 Z')+
    organ('lungs','M132 34 Q154 48 152 92 Q150 118 126 113 Q112 109 110 98 Q120 92 110 78 Q106 54 118 38 Q124 31 132 34 Z')+
    organ('liver','M42 130 Q72 116 110 124 Q120 131 112 143 Q92 162 62 156 Q40 150 42 130 Z')+
    '<rect x="92" y="190" width="16" height="74" rx="8" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.4"/>'+
    '<circle cx="100" cy="236" r="20" fill="'+col('rectum')+'" fill-opacity=".22"/>'+
    '<circle cx="100" cy="236" r="12" fill="'+col('rectum')+'" stroke="var(--surface)" stroke-width="1.5"/>'+
    [[80,214],[120,214],[100,184],[76,240],[124,240]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="'+col('nodes')+'" fill-opacity=".85" stroke="var(--surface)" stroke-width="1.2"/>').join('')+
    badge(1,140,262,'rectum')+badge(2,160,56,'lungs')+badge(3,30,146,'liver')+badge(4,150,200,'nodes')+
  '</svg>';
}
function renderSummaryRisk(s){
  const r = s.risk, tb = r.timeBar, total = 60;
  const pct = m => (m/total*100)+'%';
  const segs = tb.bands.map(b=>'<div style="width:'+((b.to-b.from)/total*100)+'%;background:'+SUMMARY_LEVEL[b.level].c+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;white-space:nowrap;">'+b.from+'–'+b.to+' mo</div>').join('');
  const ticks = [0,12,24,36,48,60].map(m=>'<span style="position:absolute;left:'+pct(m)+';transform:translateX('+(m===0?'0':m===60?'-100%':'-50%')+');display:flex;flex-direction:column;align-items:'+(m===0?'flex-start':m===60?'flex-end':'center')+';">'+
    '<span style="width:1px;height:5px;background:var(--border-strong);"></span><span style="font-size:10.5px;color:var(--ink-faint);white-space:nowrap;">'+m+(m===60?' mo':'')+'</span></span>').join('');
  const bar = '<div style="position:relative;padding-top:34px;">'+
      '<div style="position:absolute;top:0;left:'+pct(tb.here)+';transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;">'+
        '<span style="background:var(--ink);color:var(--surface);font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap;">you are here @ '+tb.here+' mo</span>'+
        '<span style="width:2px;height:8px;background:var(--ink);"></span>'+
      '</div>'+
      '<div style="display:flex;height:26px;border-radius:8px;overflow:hidden;">'+segs+'</div>'+
      '<div style="position:relative;height:24px;margin-top:2px;">'+ticks+'</div>'+
    '</div>';
  const noteParts = tb.note.split(' ');
  const stat = '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;background:'+SUMMARY_LEVEL.red.bg+';border-left:4px solid '+SUMMARY_LEVEL.red.c+';">'+
      '<span style="font-size:28px;font-weight:800;line-height:1;color:'+SUMMARY_LEVEL.red.c+';">'+esc(noteParts[0])+'</span>'+
      '<span style="font-size:13px;color:var(--ink);">'+withCites(noteParts.slice(1).join(' '))+'</span>'+
    '</div>';
  const legend = r.body.zones.map((z,i)=>'<div style="display:flex;align-items:flex-start;gap:9px;font-size:12.5px;line-height:1.4;">'+
    '<span style="width:20px;height:20px;border-radius:50%;background:'+SUMMARY_LEVEL[z.level].c+';color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+(i+1)+'</span>'+
    '<span style="padding-top:1px;">'+esc(z.label)+'</span></div>').join('');
  return summaryStrip('Relapse-risk map + time-hazard',
    '<div class="grid grid-2" style="gap:28px;align-items:start;">'+
      '<div style="display:flex;flex-direction:column;gap:14px;">'+
        bar+stat+
      '</div>'+
      '<div style="display:flex;gap:18px;align-items:center;">'+
        summaryBodyMapSvg(r.body.zones)+
        '<div style="display:flex;flex-direction:column;gap:10px;min-width:0;">'+legend+
          '<div style="font-size:11.5px;color:var(--ink-muted);margin-top:4px;">'+withCites(r.body.note)+'</div>'+
        '</div>'+
      '</div>'+
    '</div>');
}
function renderSummaryImages(s){
  /* Only modalities with a real reference image get a picture; the rest get a neutral labelled
     placeholder rather than the lung-CT drawing ctMock falls back to. */
  const tiles = s.keyImages.map(k=>{
    const ref = IMAGING_REFS[k.modality];
    const box = ref
      ? refImg(ref, k.modality)
      : '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#6c827a;">'+icon('image',22)+'<span style="font-size:10px;font-family:var(--font-mono);">'+esc(k.modality)+'</span></div>';
    const files = ref ? (ref.files ? ref.files.map(f=>f.file) : [ref.file]).join('|') : '';
    const lb = files ? ' data-lightbox="'+esc(files)+'" data-lb-cap="'+esc(k.caption)+'"' : '';
    return '<div style="flex:0 0 150px;">'+
      '<div'+lb+' '+(files ? 'title="Click to enlarge" ' : '')+'style="width:150px;height:150px;border-radius:12px;overflow:hidden;background:'+((ref&&ref.bg)||'#05100f')+';'+(files?'cursor:zoom-in;':'')+'">'+box+'</div>'+
      '<div style="font-size:11px;font-weight:600;margin-top:5px;line-height:1.35;">'+icon('sparkle',10)+' '+esc(k.caption)+'</div>'+
      (files ? '<button type="button" class="btn btn-ghost btn-sm"'+lb+' style="margin-top:5px;padding:2px 9px;">'+icon('eye',12)+' Enlarge</button>' : '')+'</div>';
  }).join('');
  const o = s.outstanding;
  const credits = [...new Set(s.keyImages.map(k=>IMAGING_REFS[k.modality]).filter(Boolean).map(r=>r.credit))];
  return summaryStrip('Key images row + outstanding items',
    '<div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;">'+tiles+'</div>'+
    '<div style="font-size:10px;color:var(--ink-faint);line-height:1.5;">De-identified reference images, not this patient · '+credits.map(esc).join(' · ')+'</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-top:10px;border-top:1px solid var(--border);">'+
      '<span style="font-size:12px;font-weight:700;">Outstanding / action:</span>'+
      (o.none ? '<span class="badge" style="background:'+SUMMARY_LEVEL.green.bg+';color:'+SUMMARY_LEVEL.green.ink+';">None</span>'
              : o.items.map(i=>'<span class="badge" style="background:'+SUMMARY_LEVEL.red.bg+';color:'+SUMMARY_LEVEL.red.ink+';">'+esc(i)+'</span>').join(''))+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:8px;font-size:12px;"><span style="color:var(--good);display:inline-flex;">'+icon('checkCircle',14)+'</span><span><strong>Care-ownership stamp:</strong> “'+esc(s.careStamp)+'”</span></div>');
}
function renderSurveillanceSummary(c){
  const s = c.summary;
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    renderSummaryStatusHeader(s.status)+
    renderSummaryRibbon(c, s)+
    renderSummaryDiagnosis(s)+
    renderSummaryTreatment(s)+
    renderSummarySurveillance(s)+
    renderSummaryRisk(s)+
    renderSummaryImages(s)+
  '</div>';
}
function renderTabSummary(c){
  if(c.summary) return renderSurveillanceSummary(c);
  const locked = c.status === 'Decision Locked';
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    renderCaseSnapshot(c)+
    /* Process (pathway bar) and team (roster) together, directly under the
       progress line, in one card — separate from the decision reasoning below. */
    '<div class="card card-pad">'+
      renderPathwayBar(c)+
      '<hr class="divider" style="margin:14px 0;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:6px;">'+
        '<div style="display:flex;align-items:center;gap:8px;">'+tierBadge(c.tier, c.tierBadgeOverride)+
          (locked ? '<span class="mono" style="font-size:11px;color:var(--ink-faint);">Decision locked '+fmtDate(c.lockedAt)+'</span>' : '<span style="font-size:11px;color:var(--ink-muted);">MDT in progress</span>')+
        '</div>'+
        '<span style="font-size:11px;color:var(--ink-muted);">'+c.quorum.responded+'/'+c.quorum.invited+' responded</span>'+
      '</div>'+
      renderTeamRoster(c)+
    '</div>'+
    (locked ? renderDecisionCard(c.decision, true) : '')+
    renderCaseStory(c)+
  '</div>';
}
/* The one place a first-time reader gets the entire journey as a single, readable
   account — not scattered across nodes they'd have to click through one by one, and
   not hidden behind a "Generate Discharge Summary" button in a tab named for a
   different purpose. Reuses composeNarrative (the same engine the Discharge Note
   uses) so there's one narrative-composition path, not two that could drift apart.
   This is the difference from a plain EMR: someone landing here should come away
   having effectively sat through the whole case, not just read a chart. */
/* A structured, scannable list — not the prose paragraphs composeNarrative() builds
   for the Discharge Note (that's meant to be read/edited as a signed clinical note;
   this is meant to be scanned in a few seconds). Each node gets its own compact row:
   stage + tier chip on one line, the finding in muted text, the owner's opinion as an
   indented quote — the same visual language the Clinical History cards already use,
   just condensed. The round table is a list of name/quote pairs, not one run-on
   paragraph. The locked decision isn't re-stated in full here — the Decision Locked
   card right above already does that; repeating it would just be more clutter. */
function renderCaseStory(c){
  const nodeEntries = c.timeline.filter(s=>s.date && !isMdtStage(s) && !isInapplicableStage(s));
  if(!nodeEntries.length) return '';
  const expanded = !!(STATE.caseStoryExpanded && STATE.caseStoryExpanded[c.id]);
  const header = '<button data-toggle-case-story="'+c.id+'" style="all:unset;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;">'+
      '<div style="display:flex;align-items:center;gap:7px;">'+icon('sparkle',13)+'<h3 style="margin:0;font-size:13px;">Case Story — the entire journey so far</h3></div>'+
      '<span style="font-size:11px;color:var(--accent-strong);font-weight:600;display:flex;align-items:center;gap:3px;white-space:nowrap;flex-shrink:0;">'+(expanded?'Collapse':'Read full story')+
        '<span style="display:inline-block;transform:rotate('+(expanded?'-90deg':'90deg')+');">'+icon('chevronRight',12)+'</span>'+
      '</span>'+
    '</button>';
  if(!expanded){
    return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;">'+header+
      '<div style="font-size:11.5px;color:var(--ink-faint);">'+nodeEntries.length+' nodes reviewed'+(c.thread&&c.thread.length?', ending in a full MDT discussion':'')+' — every specialist’s own words.</div>'+
    '</div>';
  }
  const nodeRows = nodeEntries.map(s=>{
    const t2 = s.tierMark && s.tierMark.tier===2;
    return '<div style="padding:8px 0;border-top:1px solid var(--border);">'+
      '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;">'+
        '<span style="font-size:12px;font-weight:700;">'+esc(s.stage)+'</span>'+
        (s.tierMark ? '<span class="badge '+(t2?'badge-tier3':'badge-tier1')+'" style="font-size:9.5px;padding:1px 7px;flex-shrink:0;">Tier '+s.tierMark.tier+'</span>' : '')+
      '</div>'+
      '<div style="font-size:11.5px;color:var(--ink-muted);margin-top:3px;line-height:1.5;">'+esc(s.summary)+'</div>'+
      (s.opinion ? '<div style="font-size:12px;font-style:italic;color:var(--ink);margin-top:5px;padding-left:10px;border-left:2px solid var(--accent-soft);">“'+esc(s.opinion)+'” <span style="font-style:normal;color:var(--ink-faint);font-size:10px;">— '+esc(s.owner||'')+'</span></div>' : '')+
    '</div>';
  }).join('');
  const roundTable = (c.thread||[]).filter(m=>m.kind!=='system');
  const roundTableRows = roundTable.map(m=>
    '<div style="padding:6px 0;border-top:1px solid var(--border);">'+
      '<div style="font-size:11.5px;"><strong>'+esc(m.author)+'</strong> <span style="color:var(--ink-faint);">'+esc(m.role)+'</span></div>'+
      '<div style="font-size:12px;font-style:italic;margin-top:2px;line-height:1.5;">“'+esc(m.text)+'”</div>'+
    '</div>'
  ).join('');
  return '<div class="card card-pad" style="display:flex;flex-direction:column;">'+header+
    '<div style="margin-top:6px;">'+nodeRows+'</div>'+
    (roundTableRows ? '<div style="margin-top:4px;">'+
      '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);padding-top:8px;display:flex;align-items:center;gap:5px;">'+icon('users',11)+' MDT Round Table</div>'+
      roundTableRows+
    '</div>' : '')+
    (c.decision ? '<div style="margin-top:8px;padding-top:10px;border-top:2px solid var(--accent-soft);font-size:12px;line-height:1.55;"><strong>Outcome:</strong> '+esc(c.decision.plan)+'</div>' : '')+
  '</div>';
}
function sampleFieldValue(c,f){
  // derive a plausible display value from the case's free-text fields for demo purposes
  const hay = (c.keyFacts.join(' ') + ' ' + c.stage + ' ' + c.diagnosis).toLowerCase();
  if(f.key==='age') return c.patient.age;
  if(f.key==='sex') return c.patient.sex;
  if(f.key==='ecog'){ const m = hay.match(/ecog\s*(\d)/); return m ? m[1] : '1'; }
  if(f.key==='tStage'||f.key==='nStage'||f.key==='mStage'||f.key==='clinicalStage'||f.key==='figoStage') return '—';
  if(f.type==='check') return hay.includes(f.label.toLowerCase()) ? 'Yes' : 'No';
  if(f.type==='select' && f.options){
    const match = f.options.find(o=>o!=='Pending' && hay.includes(o.toLowerCase()));
    return match || f.options[0];
  }
  if(f.type==='number'){
    const unitPattern = f.unit ? f.unit.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') : '';
    const m = hay.match(new RegExp('(\\d+(?:\\.\\d+)?)\\s*'+unitPattern));
    if(m) return m[1];
  }
  return '—';
}

/* One image box: the real reference image when we have one, otherwise a calm labelled placeholder. */
function imageBox(modality, size){
  const ref = IMAGING_REFS[modality];
  const dim = size==='viewer' ? 'width:100%;height:100%;' : size==='fill' ? 'width:100%;aspect-ratio:4/3;' : 'width:'+size+'px;height:'+size+'px;';
  if(ref) return '<div style="'+dim+'border-radius:12px;overflow:hidden;background:'+(ref.bg||'#05100f')+';flex-shrink:0;">'+refImg(ref, modality)+'</div>';
  return '<div style="'+dim+'border-radius:12px;background:var(--surface-2);border:1px dashed var(--border-strong);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--ink-faint);flex-shrink:0;">'+icon('image',22)+'<span style="font-size:11px;text-align:center;padding:0 8px;">'+esc(modality)+'</span></div>';
}
function imageTile(attrs, modality, caption, key, ext){
  return '<div class="img-tile" '+attrs+' style="cursor:pointer;display:flex;flex-direction:column;gap:8px;">'+imageBox(modality,'fill')+
    '<div style="font-size:12.5px;line-height:1.45;">'+esc(caption)+'</div>'+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">'+(key?'<span class="badge badge-gold">★ Key image</span>':'')+(ext?'<span class="badge badge-neutral">[ext]</span>':'')+'<span class="chip" style="font-size:10.5px;">'+esc(modality)+'</span></div></div>';
}
function renderTabImaging(c){
  const keyImages = collectKeyImages(c);
  const groups = [];
  c.timeline.forEach((t,i)=>{
    const imgs = imagesForReview(c, 'node', i);
    if(imgs.length) groups.push({idx:i, stage:t.stage, imgs});
  });
  const total = groups.reduce((a,g)=>a+g.imgs.length, 0);
  if(!total && !keyImages.length){
    const withImage = c.timeline.find(t=>t.hasImage);
    return '<div class="grid grid-2">'+
      '<div>'+ ctMock(withImage) +'</div>'+
      '<div style="display:flex;flex-direction:column;gap:10px;">'+
        '<h3 style="margin-bottom:4px;">Imaging Review</h3>'+
        (withImage ? (kv('Modality', withImage.modality)+kv('Key finding', withImage.keyFinding)+kv('Study date', withImage.date ? fmtDate(withImage.date) : '—')+
          (withImage.hasDissent ? '<div class="badge badge-tier3" style="margin-top:6px;">'+icon('alert',12)+' Dissent recorded</div>' : ''))
        : '<div class="empty-state">'+icon('image',26)+'<div>No imaging linked to this case yet.</div></div>')+
      '</div></div>';
  }
  if(!STATE.imagingView) STATE.imagingView = {};
  const view = STATE.imagingView[c.id] || 'key';
  const seg = (v, label, n) => '<button data-imaging-view="'+c.id+'::'+v+'" style="all:unset;box-sizing:border-box;cursor:pointer;padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:700;'+(view===v?'background:var(--accent);color:#fff;':'color:var(--ink-muted);')+'">'+label+' <span style="opacity:.75;font-weight:600;">'+n+'</span></button>';
  let body = '';
  if(view==='key'){
    const byStage = {};
    keyImages.forEach((ki,i)=>{ (byStage[ki.stageIdx] = byStage[ki.stageIdx] || []).push({ki, i}); });
    body = Object.keys(byStage).map(k=>{
      const list = byStage[k];
      return imagingGroup(c, Number(k), c.timeline[Number(k)].stage, list.map(x=>imageTile('data-open-image-review="'+c.id+'" data-start-idx="'+x.i+'"', x.ki.modality || x.ki.stageName, x.ki.caption, true, x.ki.external)).join(''), list.length);
    }).join('');
  } else {
    body = groups.map(g=>imagingGroup(c, g.idx, g.stage, g.imgs.map((im,ii)=>imageTile('data-open-node-image-review="'+c.id+'::'+g.idx+'" data-start-idx="'+ii+'"', im.modality || g.stage, im.caption, im.keyImage, im.external)).join(''), g.imgs.length)).join('');
  }
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">'+
      '<div><h3 style="margin:0;">Imaging</h3><div style="font-size:12px;color:var(--ink-muted);margin-top:3px;">Images from every stop, grouped by where they were taken. Select an image to enlarge.</div></div>'+
      '<div style="display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:var(--surface-2);border:1px solid var(--border);">'+seg('key','Key images',keyImages.length)+seg('all','All images',total)+'</div>'+
    '</div>'+body+
  '</div>';
}
function imagingGroup(c, idx, stageName, tilesHtml, n){
  return '<div style="border:1px solid var(--border);border-radius:12px;background:var(--surface);overflow:hidden;">'+
    '<div style="padding:10px 16px;background:var(--surface-2);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap;">'+
      '<span style="font-size:13px;font-weight:700;">'+esc(stageName)+'</span><span class="chip" style="font-size:10.5px;">'+n+' image'+(n===1?'':'s')+'</span>'+
      '<button class="btn btn-ghost btn-sm" style="margin-left:auto;" data-snapshot-jump="'+c.id+'::'+idx+'">'+icon('chevronRight',12)+' Open stop</button></div>'+
    '<div style="padding:14px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px;">'+tilesHtml+'</div></div>';
}
function kv(k,v){
  return '<div style="padding:8px 0;border-top:1px solid var(--border);"><div style="font-size:10.5px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em;">'+esc(k)+'</div><div style="font-size:13px;font-weight:600;margin-top:2px;">'+esc(v||'—')+'</div></div>';
}
/* real, freely-licensed reference images (public domain / CC0 / CC-BY / CC-BY-SA) — de-identified teaching images, not this patient */
const PROJECT_IMG_CREDIT = 'Reference image supplied for this project';
const IMAGING_REFS = {
  'MRI Pelvis': {file:'images/mri-pelvis-rectal.jpeg', credit:PROJECT_IMG_CREDIT, fit:'contain', bg:'#0b1d3a'},
  'CT Abdomen': {file:'images/ct-abdomen-pelvis-rectal-lesion.jpeg', credit:PROJECT_IMG_CREDIT, fit:'contain', bg:'#fff'},
  'Endoscopy (rectal tumor)': {file:'images/colonoscopy-rectal-mass.jpeg', credit:PROJECT_IMG_CREDIT, fit:'contain', bg:'#fff'},
  'H&E microphotograph': {file:'images/he-adenocarcinoma.jpeg', credit:PROJECT_IMG_CREDIT, fit:'contain', bg:'#fff'},
  'Strategy decision tree': {file:'images/node9-strategy-decision-tree.jpeg', credit:PROJECT_IMG_CREDIT, fit:'contain', bg:'#fff'},
  'Endoscopy (rectal mucosa)': {file:'images/endoscopy-rectum-normal.jpg', credit:'melvil — CC BY-SA 4.0, via Wikimedia Commons'},
  'Clinical photo (hand-foot syndrome)': {files:[{file:'images/hfs-feet-hands.jpeg', bg:'#1b6b5a'}, {file:'images/hfs-hands-serial.jpeg', bg:'#fff'}], credit:PROJECT_IMG_CREDIT, bg:'#fff'},
  'MRI Pelvis (restaging)': {file:'images/node13-mri-response.jpeg', credit:PROJECT_IMG_CREDIT, fit:'contain', bg:'#fff'},
  'Endoscopy (restaging)': {file:'images/node13-endoscopy-response.jpeg', credit:PROJECT_IMG_CREDIT, fit:'contain', bg:'#fff'},
  'RT plan': {files:[{file:'images/rt-isodose-imrt-1.jpeg', bg:'#000'}, {file:'images/rt-isodose-imrt-2.jpeg', bg:'#fff'}], credit:PROJECT_IMG_CREDIT, bg:'#fff'},
};
/* Other supplied images used outside the modality registry */
const TRIAL_PROTOCOL_PREVIEW = {file:'images/node10-opra-protocol.jpeg', caption:'Protocol PDF — OPRA consolidation arm'};
const TOX_SPRITE = {nausea:[0,0], neuropathy_acute:[1,0], neuropathy_chronic:[1,0], diarrhea:[2,0], hfs:[0,1], fatigue:[1,1], stomatitis:[2,1]};
function refImg(ref, alt){
  const title = 'De-identified reference image, not this patient · '+ref.credit;
  if(ref.files) return '<div style="display:flex;gap:2px;width:100%;height:100%;">'+ref.files.map(f=>'<img src="'+f.file+'" alt="'+esc(alt)+' reference image" title="'+esc(title)+'" style="flex:1 1 0;min-width:0;height:100%;object-fit:contain;background:'+(f.bg||'#fff')+';display:block;">').join('')+'</div>';
  return '<img src="'+ref.file+'" alt="'+esc(alt)+' reference image" title="'+esc(title)+'" style="width:100%;height:100%;object-fit:'+(ref.fit||'cover')+';display:block;">';
}
function strategyTreeFigure(){
  const f = IMAGING_REFS['Strategy decision tree'].file;
  return '<button type="button" data-lightbox="'+esc(f)+'" data-lb-cap="" title="Click to enlarge" style="all:unset;box-sizing:border-box;cursor:zoom-in;display:block;max-width:560px;border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#fff;"><img src="'+esc(f)+'" alt="" style="width:100%;height:auto;display:block;"></button>';
}
function toxIcon(key){
  const p = TOX_SPRITE[key];
  if(!p) return key==='cardiotox' ? '' : '<span aria-hidden="true" style="display:inline-block;flex-shrink:0;width:46px;"></span>';
  return '<span aria-hidden="true" style="display:inline-block;flex-shrink:0;width:46px;height:46px;border-radius:9px;border:1px solid var(--border);background:#fff url(images/stop12a-toxicity-icons.jpeg) no-repeat;background-size:138px auto;background-position:'+(-p[0]*46)+'px '+(-p[1]*46)+'px;"></span>';
}
function lightboxThumb(file, caption, w, h){
  return '<button type="button" data-lightbox="'+esc(file)+'" data-lb-cap="'+esc(caption)+'" title="'+esc(caption)+' — click to enlarge" style="all:unset;box-sizing:border-box;cursor:zoom-in;display:inline-flex;flex-shrink:0;width:'+w+'px;height:'+h+'px;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:#fff;"><img src="'+esc(file)+'" alt="'+esc(caption)+'" style="width:100%;height:100%;object-fit:contain;display:block;"></button>';
}
function openImageLightbox(file, caption){
  openModal('<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">'+esc(caption)+'</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;justify-content:center;align-items:center;gap:8px;background:#fff;">'+String(file).split('|').map(f=>'<img src="'+esc(f)+'" alt="'+esc(caption)+'" onload="this.style.flexGrow=(this.naturalWidth/this.naturalHeight).toFixed(3)" style="flex:1 1 0;min-width:0;height:auto;max-height:70vh;object-fit:contain;display:block;">').join('')+'</div>', {wide:true});
  if(String(file).split('|').length>1){ const m = document.querySelector('#modalHost .modal'); if(m) m.style.maxWidth = '1100px'; }
}
function ctFallbackSvg(stage){
  // stylised illustration built from primitives, used only when no sourced reference image exists for this modality
  return '<svg viewBox="0 0 300 300" style="width:100%;border-radius:12px;background:#05100f;display:block;">'+
    '<ellipse cx="150" cy="155" rx="120" ry="110" fill="#0c1e1c"/>'+
    '<ellipse cx="100" cy="150" rx="55" ry="80" fill="#14302c"/>'+
    '<ellipse cx="200" cy="150" rx="55" ry="80" fill="#14302c"/>'+
    '<ellipse cx="150" cy="150" rx="18" ry="70" fill="#1e2a28"/>'+
    (stage ? '<circle cx="118" cy="118" r="13" fill="none" stroke="#e0685a" stroke-width="2.5"/><circle cx="118" cy="118" r="4" fill="#e0685a"/>' : '')+
    '<text x="150" y="290" text-anchor="middle" fill="#6c827a" font-size="10" font-family="IBM Plex Mono, monospace">'+(stage?esc(stage.modality):'No study linked')+'</text>'+
  '</svg>';
}
function ctMock(stage){
  const ref = stage && IMAGING_REFS[stage.modality];
  if(!ref) return ctFallbackSvg(stage);
  const fbId = 'ctfb'+Math.random().toString(36).slice(2,9);
  return '<div style="position:relative;border-radius:12px;overflow:hidden;background:#05100f;aspect-ratio:1/1;">'+
      '<img src="'+ref.file+'" alt="'+esc(stage.modality)+' reference image" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display=\'none\';var f=document.getElementById(\''+fbId+'\');if(f)f.style.display=\'flex\';">'+
      '<div id="'+fbId+'" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;color:#6c827a;font-size:10px;font-family:\'IBM Plex Mono\',monospace;text-align:center;padding:0 10px;">Reference image unavailable</div>'+
      '<div style="position:absolute;left:0;right:0;bottom:0;padding:5px 10px;background:linear-gradient(transparent, rgba(0,0,0,.78));color:#d7e6e2;font-size:10px;font-family:var(--font-mono);">'+esc(stage.modality)+'</div>'+
    '</div>'+
    '<div style="font-size:9px;color:var(--ink-faint);padding:4px 2px 0;line-height:1.35;">De-identified reference image, not this patient &middot; '+esc(ref.credit)+'</div>';
}

/* Auto-assembled from every node's ★ key image — never manually curated. This is a
   summary + a button, not an inline gallery: images are reviewed one at a time in
   the modal (renderImageReviewModal), never dumped as a cramped strip. */
function renderMdtImageBoard(c){
  const keyImages = collectKeyImages(c);
  if(!keyImages.length) return '';
  return '<div class="card card-pad" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">'+
    '<div style="display:flex;align-items:center;gap:10px;">'+
      '<div style="width:30px;height:30px;border-radius:7px;background:var(--accent-soft);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon('image',15)+'</div>'+
      '<div><div style="font-weight:700;font-size:13px;">MDT Image Board</div><div style="font-size:11.5px;color:var(--ink-muted);">'+keyImages.length+' key image'+(keyImages.length===1?'':'s')+' auto-collected from the workup — the evidence this escalation was raised on.</div></div>'+
    '</div>'+
    reviewImagesButton(c, 'Review images')+
  '</div>';
}
/* The moment the OR-gate actually fires: one node marked Tier 2 is enough to bring the
   whole case to a synchronous board, regardless of how many other nodes stayed Tier 1.
   This makes that escalation an explicit, visible event rather than an inferred badge. */
function renderEscalationBanner(c){
  const idx = c.timeline.findIndex(t=>t.tierMark && t.tierMark.tier===2);
  if(idx<0) return '';
  const node = c.timeline[idx];
  return '<div class="card card-pad" style="background:var(--crit-soft);border-color:var(--crit);display:flex;gap:10px;align-items:flex-start;">'+
    '<div style="width:30px;height:30px;border-radius:50%;background:var(--crit);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon('alert',16)+'</div>'+
    '<div style="flex:1;min-width:0;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--crit-ink);">Tier 2 raised at '+esc(node.stage)+' → case escalated to Tier '+c.tier+' (synchronous MDT, full quorum)</div>'+
      '<div style="font-size:12px;color:var(--ink-muted);margin-top:4px;line-height:1.55;">'+esc(node.owner)+': “'+esc(node.tierMark.reason)+'”</div>'+
      '<div style="font-size:11px;color:var(--ink-faint);margin-top:6px;line-height:1.55;">Every node signs its own Tier 1 (guideline-concordant, no meeting needed) or Tier 2 (raises a decision the board must make). Every other node on this case stayed Tier 1 — this single Tier 2 mark is what brought the whole case to a live board meeting, which is why the case-level coordination tier is now '+c.tier+' rather than routine.</div>'+
      '<button class="btn btn-ghost btn-sm" style="margin-top:6px;padding:2px 8px;" data-snapshot-jump="'+c.id+'::'+idx+'">'+icon('chevronRight',12)+' View that node</button>'+
    '</div>'+
  '</div>';
}
function renderTabDiscussion(c, availableRoles){
  const locked = c.status === 'Decision Locked';
  const anyTier2 = c.timeline.some(t=>t.tierMark && t.tierMark.tier===2);
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    (anyTier2 ? renderEscalationBanner(c) : '')+
    (anyTier2 ? renderMdtImageBoard(c) : '')+
    /* the Decision Locked card itself now lives on the Summary tab, alongside the presentation narrative */
    (locked && c.biomarkers ? renderEvidencePanel(c) : '')+
    '<div style="background:var(--surface-2);border-left:3px solid var(--gold);border-radius:8px;padding:12px 14px;font-size:12.5px;line-height:1.6;">'+
      '<span class="mono" style="font-weight:700;">MRN '+esc(c.patient.mrn)+'</span> &middot; '+c.patient.age+esc(c.patient.sex)+' &middot; '+esc(c.diagnosis)+' &middot; '+esc(c.stage)+
    '</div>'+
    (!locked ? renderTeamInviteBar(c, availableRoles||[]) : '')+
    (!locked && c.deferredItem ? '<div class="callout callout-gold" style="display:flex;align-items:center;gap:8px;">'+icon('clock',15)+' Decision deferred by '+esc(c.deferredItem.notedBy)+' — awaiting: <strong>'+esc(c.deferredItem.item)+'</strong>. Case stays open, not closed.</div>' : '')+
    (!locked && !c.pendingDecision ? renderPendingResponsesPanel(c) : '')+
    (!locked && c.specialists.length>1 ? renderTierVotePanel(c) : '')+
    (!locked && c.pendingDecision ? renderSignOffPanel(c) : '')+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">'+icon('users',11)+' '+(anyTier2?'MDT Discussion — round table':'Discussion')+'</div>'+
    '<div id="threadList-'+c.id+'">'+c.thread.map(m=>renderMsg(m)).join('')+'</div>'+
    (!locked ? renderComposer(c) : '<div style="font-size:12px;color:var(--ink-faint);text-align:center;padding:6px;">Discussion closed — decision locked '+fmtDateTime(c.lockedAt)+'.</div>')+
  '</div>';
}
function renderMsg(m){
  const d = deptColor(m.role==='Auto-Triage' ? 'Nursing' : m.role);
  const border = m.kind==='system' ? 'var(--gold)' : d.c;
  return '<div class="msg" style="border-left-color:'+border+';">'+
    (m.kind!=='system' ? avatarHtml((m.author.match(/[A-Z]/g)||['?']).slice(-2).join(''), m.role, '') : '<div class="avatar" style="background:var(--gold-soft);color:var(--gold-strong);">'+icon('sparkle',15)+'</div>')+
    '<div style="flex:1;min-width:0;">'+
      '<div class="msg-head"><span class="msg-name">'+esc(m.author)+'</span><span class="msg-role">'+esc(m.role)+'</span><span class="msg-time">'+fmtDateTime(m.time)+'</span></div>'+
      '<div class="msg-text">'+(m.text.indexOf('**')>=0 ? withCites(m.text) : esc(m.text))+'</div>'+
      (m.action ? '<div class="msg-actions"><button class="btn btn-secondary btn-sm" data-toast="'+esc(m.action)+' would open the linked record here (demo).">'+icon(m.action.includes('image')?'image':m.action.includes('report')?'assessment':'assessment',13)+' '+esc(m.action)+'</button></div>' : '')+
    '</div>'+
  '</div>';
}
function renderComposer(c){
  return '<div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;">'+
    '<textarea id="composerText-'+c.id+'" rows="2" placeholder="Post your opinion as '+esc(ME.name)+' ('+esc(ME.role)+')…" style="width:100%;border:none;outline:none;resize:vertical;font-family:inherit;font-size:13px;background:transparent;"></textarea>'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">'+
      '<button class="btn btn-ghost btn-sm" data-toast="Audio capture is a UI demo only — not wired to a backend.">'+icon('mic',14)+' Record audio</button>'+
      '<button class="btn btn-primary btn-sm" data-post="'+c.id+'">Post opinion</button>'+
    '</div>'+
  '</div>';
}
function renderDecisionCard(dec, showLockMeta, c){
  if(!dec) return '';
  return '<div class="card" style="border-color:var(--accent);background:var(--accent-soft);">'+
    '<div class="card-pad" style="display:flex;flex-direction:column;gap:12px;">'+
      '<div style="display:flex;align-items:center;gap:8px;color:var(--accent-ink);font-weight:700;font-size:13px;">'+icon('lock',15)+' Decision Locked'+(c && c.lockedAt ? ' · '+fmtDateTime(c.lockedAt) : '')+(dec.lockedBy ? ' · '+esc(dec.lockedBy) : '')+'</div>'+
      (dec.meetingType ? '<div class="grid grid-3" style="gap:10px;">'+
        kv('Meeting type', dec.meetingType)+kv('Reason for discussion', dec.reasonForDiscussion)+kv('Consensus', dec.consensusStatus)+
        kv('Trial screening', dec.trialScreening+(dec.trialId&&dec.trialId!=='—'?' · '+dec.trialId:''))+kv('Patient notified by', dec.notifyLead)+kv('Notification method', dec.notifyMethod)+
        (dec.intent ? kv('Treatment intent', dec.intent) : '')+
        (dec.resectability ? kv('Resectability', dec.resectability+(dec.resectDecidedBy?' · '+dec.resectDecidedBy:'')) : '')+
        (dec.restagingPoint ? kv('Restaging point', dec.restagingPoint) : '')+
      '</div>' : '')+
      decisionRow('checkCircle','Decision', dec.plan, 'var(--good)')+
      decisionRow('flag','Intent & conditions', dec.conditions, 'var(--accent)')+
      (dec.conditions ? decisionRow('flag','Contingency', dec.contingency, 'var(--accent)') : '')+
      decisionRow('sparkle','Reasoning', dec.reasoning, 'var(--info)')+
      decisionRow('network', dec.conditions ? 'Alternatives considered and explicitly rejected (recorded)' : 'Alternatives Rejected · Why', dec.alternatives, 'var(--gold)')+
      decisionRow('alert','Risks & Uncertainty', dec.risks, 'var(--crit)')+
      decisionRow('users','Disagreement Logged', dec.disagreement, 'var(--crit)')+
      (dec.conditions ? '' : decisionRow('flag','Contingency', dec.contingency, 'var(--accent)'))+
    '</div>'+
  '</div>';
}
function decisionRow(iconName,label,text,color,emphasize){
  if(!text) return '';
  return '<div style="display:flex;gap:10px;">'+
    '<div style="width:26px;height:26px;border-radius:7px;background:var(--surface);color:'+color+';display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(iconName,14)+'</div>'+
    '<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-muted);">'+esc(label)+'</div><div style="'+(emphasize?'font-size:14.5px;font-weight:600;color:var(--ink);':'font-size:12.5px;')+'margin-top:2px;line-height:1.55;white-space:pre-line;">'+withCites(text)+'</div></div>'+
  '</div>';
}

/* Shared heading for the Lung-pathway data-entry tabs (Biopsy, Pathology, Staging, etc.) —
   text always sourced from the same c.timeline stage name shown in Clinical History, so the
   two views never drift apart into near-duplicate but differently-worded headings. */
function dataEntryStageHeader(c, stageName){
  const stage = c.timeline.find(t=>t.stage===stageName);
  return '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">'+
      '<h3 style="margin:0;">'+esc(stageName)+'</h3>'+
      (stage && stage.date ? '<span style="font-size:11px;color:var(--ink-faint);font-family:var(--font-mono);">'+fmtDate(stage.date)+'</span>' : '<span class="badge badge-neutral">Pending</span>')+
    '</div>'+
    (stage && stage.owner ? '<div style="font-size:10.5px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em;font-weight:700;">Owner: '+esc(stage.owner)+'</div>' : '');
}
function lastDatedStageIndex(timeline){
  let idx = -1;
  timeline.forEach((t,i)=>{ if(t.date) idx = i; });
  return idx;
}
/* Stop 6 — the live-rendered ICI-eligibility banner. Previously this only existed as prose
   baked into a stage summary string; it must be an actual computed component, not narrative. */
function renderIciEligibilityBanner(c){
  const bm = c.biomarkers;
  const driverName = bm.egfr==='Positive' ? 'EGFR' : bm.alk==='Positive' ? 'ALK' : null;
  const green = !driverName;
  return '<div class="card card-pad" style="background:'+(green?'var(--good-soft)':'var(--crit-soft)')+';border-color:'+(green?'var(--good)':'var(--crit)')+';display:flex;align-items:center;gap:10px;">'+
    '<div style="width:30px;height:30px;border-radius:50%;background:'+(green?'var(--good)':'var(--crit)')+';color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(green?'checkCircle':'x',16)+'</div>'+
    '<div><div style="font-weight:700;font-size:13px;color:'+(green?'var(--good-ink)':'var(--crit-ink)')+';">ICI-eligibility banner: '+(green?'GREEN':'RED')+'</div>'+
    '<div style="font-size:12px;color:var(--ink-muted);">'+(green?'No EGFR/ALK driver detected — perioperative/adjuvant ICI pathway permissible.':esc(driverName)+' driver present — ICI not recommended; targeted-therapy pathway.')+'</div></div>'+
  '</div>';
}
function renderTabTimeline(c){
  const decisionIdx = c.timeline.findIndex(t=>t.decision);
  const defaultIdx = decisionIdx >= 0 ? decisionIdx : Math.max(0, lastDatedStageIndex(c.timeline));
  const activeIdx = STATE.timelineActive[c.id] ?? defaultIdx;
  const stage = c.timeline[Math.max(0,activeIdx)];
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;">'+
      '<span class="badge badge-locked">'+icon('shield',12)+' FHIR / mCODE &middot; interoperability by design</span>'+
    '</div>'+
    '<div style="display:flex;align-items:flex-start;gap:4px;">'+
      '<button class="icon-btn" style="margin-top:8px;flex-shrink:0;" data-stepper-scroll="'+c.id+'::prev" aria-label="Scroll timeline left"><span style="display:inline-block;transform:scaleX(-1);">'+icon('chevronRight',15)+'</span></button>'+
      '<div class="stepper" id="stepper-'+c.id+'">'+c.timeline.map((t,i)=>{
        const done = !!t.date;
        const isCurrent = i===activeIdx;
        const isExt = !!t.external;
        const isTier2 = !!(t.tierMark && t.tierMark.tier===2) || !!t.redNode;
        return '<div class="step '+(done?'done':'')+' '+(isCurrent?'current':'')+' '+(isExt?'step-ext':'')+' '+(isTier2?'step-tier2':'')+'" data-tl-stage="'+c.id+'" data-idx="'+i+'">'+
          '<div class="step-line"></div>'+
          '<div class="step-dot">'+(isExt ? 'EXT' : (done?icon('check',15):(i+1)))+'</div>'+
          '<span class="step-label">'+esc(t.stage)+(t.extAttached?' '+icon('download',10):'')+'</span>'+
        '</div>';
      }).join('')+'</div>'+
      '<button class="icon-btn" style="margin-top:8px;flex-shrink:0;" data-stepper-scroll="'+c.id+'::next" aria-label="Scroll timeline right">'+icon('chevronRight',15)+'</button>'+
    '</div>'+
    '<div class="card" style="background:var(--surface-2);border-style:dashed;">'+
      '<div class="card-pad" style="display:flex;flex-direction:column;gap:12px;">'+
        (stage.external ? renderExternalRecordsStageDetail(c, stage) : renderInHouseStageDetail(c, stage))+
      '</div>'+
    '</div>'+
  '</div>';
}
function linkedExternalDocs(c, stageName){
  return (c.externalRecords ? c.externalRecords.docs.filter(d=>d.linkedStop===stageName) : []);
}
function renderLinkedExternalDocs(docs){
  return '<div style="display:flex;flex-direction:column;gap:6px;padding:10px;border:1px dashed var(--border-strong);border-radius:8px;background:var(--surface);">'+
    '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">'+icon('download',11)+' Linked external record(s)</div>'+
    docs.map(d=>renderExternalDocCard(d)).join('')+
  '</div>';
}
function renderExternalDocCard(d){
  const meta = EXT_VERIFY_META[d.verificationStatus] || {cls:'badge-neutral'};
  return '<div class="card card-pad" style="background:var(--surface);gap:6px;display:flex;flex-direction:column;">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">'+
      '<div style="font-weight:700;font-size:12.5px;">'+esc(d.docType)+'</div>'+
      '<span class="badge '+meta.cls+'">'+esc(d.verificationStatus)+'</span>'+
    '</div>'+
    '<div style="font-size:10.5px;color:var(--ink-faint);">'+esc(d.sourceFacility)+' &middot; investigated '+fmtDate(d.dateOfInvestigation)+'</div>'+
    (d.keyFinding ? '<div style="font-size:12.5px;line-height:1.5;">'+esc(d.keyFinding)+'</div>' : '')+
    (d.files && d.files.length ? '<div style="display:flex;flex-wrap:wrap;gap:5px;">'+d.files.map(f=>'<span class="chip" style="font-size:10.5px;">'+icon('assessment',10)+' '+esc(f)+'</span>').join('')+'</div>' : '')+
    (d.autoExcerpted ? '<span class="chip" style="font-size:10px;align-self:flex-start;background:var(--gold-soft);color:var(--gold-strong);border-color:transparent;">'+icon('sparkle',10)+' Auto-excerpted &middot; confirmed</span>' : '')+
  '</div>';
}
/* Which data-entry tab actually owns this stage's form, for a given case — resolved
   per-case (not a static map) since a couple of stages are handled by different tabs
   depending on what portals this specific case has (e.g. Adjuvant Therapy is either
   the dedicated Adjuvant tab or, pre-portal, the Treatment Log). Returns null when no
   fillable form exists for this stage (e.g. non-Lung pathways, or MDT Decision Lock,
   which is the header's lock button + Discussion, not a tab of its own). */
function formTabForStage(c, stage){
  const s = stage.stage, isLung = c.tumourType === 'Lung';
  if(s==='Diagnostic Workup / Biopsy' && isLung) return {tab:'biopsy', label:'Biopsy / EBUS'};
  if(s==='Pathology (Histo + IHC)' && isLung) return {tab:'pathology', label:'Pathology'};
  if(s==='Staging (CT / PET / Brain MRI)' && isLung) return {tab:'staging', label:'Staging'};
  if(s==='Fitness / Functional Assessment' && isLung) return {tab:'fitness', label:'Fitness Assessment'};
  if(s==='Molecular NGS + PD-L1' && isLung) return {tab:'molecular', label:'Molecular'};
  if(s==='Restaging / Resectability' && isLung && c.treatmentLog) return {tab:'restaging', label:'Restaging'};
  if(s==='Neoadjuvant Therapy' && c.treatmentLog) return {tab:'treatment', label:'Treatment Log'};
  if(s==='Surgery' && c.surgicalPortal) return {tab:'surgery', label:'Surgery Portal'};
  if(s==='Adjuvant Therapy'){
    if(c.adjuvantPortal) return {tab:'adjuvant', label:'Adjuvant Therapy'};
    if(c.treatmentLog) return {tab:'treatment', label:'Treatment Log'};
  }
  if(s==='Surveillance' && c.surveillance) return {tab:'surveillance', label:'Surveillance'};
  return null;
}
/* A stop rendered exactly as the source document lays it out: heading, then each labelled
   line (Owner / Finding / Case-specific opinion / Images tab / Tier mark) word for word. */
function findingRowsHtml(rows){
  return '<div class="grid grid-2" style="gap:6px 24px;">'+rows.map(r=>{
    const tone = r.tone ? SUMMARY_LEVEL[r.tone] : null;
    return '<div style="font-size:13px;line-height:1.55;"><span style="color:var(--ink-muted);">'+esc(r.label)+':</span> '+
      (tone ? '<span class="badge" style="background:'+tone.bg+';color:'+tone.ink+';white-space:normal;height:auto;">'+esc(r.value)+'</span>' : '<strong>'+esc(r.value)+'</strong>')+'</div>';
  }).join('')+'</div>';
}
/* Timeline stops always show the source document as written; the node forms never write to them. */
function docStageLines(c, stage){ return stage.docLines || []; }
/* Stops whose source text has no "Images tab" line still show their images, inline. */
function stageImageStrip(stage){
  const tiles = (stage.images||[]).filter(im=>IMAGING_REFS[im.modality]).map(im=>{
    const ref = IMAGING_REFS[im.modality], files = (ref.files ? ref.files.map(f=>f.file) : [ref.file]).join('|');
    return '<div style="flex:1 1 300px;max-width:460px;display:flex;flex-direction:column;gap:6px;">'+
      '<div data-lightbox="'+esc(files)+'" data-lb-cap="'+esc(im.caption)+'" title="Click to enlarge" style="cursor:zoom-in;">'+imageBox(im.modality, 'fill')+'</div>'+
      '<div style="font-size:12px;line-height:1.45;">'+(im.keyImage?'★ ':'')+esc(im.caption)+'</div></div>';
  });
  if(!tiles.length) return '';
  return '<div style="border:1px solid var(--border);border-radius:10px;padding:11px 14px;background:var(--surface);display:flex;flex-direction:column;gap:8px;">'+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);">Images</div>'+
    '<div style="display:flex;gap:16px;flex-wrap:wrap;">'+tiles.join('')+'</div></div>';
}
function renderDocStage(c, stage){
  const idx = c.timeline.findIndex(t=>t.stage===stage.stage);
  const formKeys = c.forms ? RECTAL_NODE_FORMS.filter(f=>f.stage===stage.stage).map(f=>f.key) : [];
  const line = ln => {
    if(ln.meta) return '<div style="font-size:11px;color:var(--ink-faint);">'+esc(ln.meta)+'</div>';
    if(ln.tier){
      const t2 = ln.tier===2;
      return '<div style="font-size:13px;line-height:1.65;padding:9px 12px;border-radius:8px;border-left:4px solid '+(t2?'var(--crit)':'var(--good)')+';background:'+(t2?'var(--crit-soft)':'var(--good-soft)')+';'+(t2?'color:var(--crit-ink);font-weight:700;':'')+'"><strong>'+esc(ln.l)+':</strong> '+withCites(ln.t)+'</div>';
    }
    if(ln.l==='Owner') return '<div style="font-size:13px;line-height:1.65;font-weight:700;">Owner: '+esc(ln.t.replace(/\*\*/g,''))+'</div>';
    const opinion = /^Case-specific opinion/.test(ln.l);
    return '<div style="border:1px solid var(--border);'+(opinion?'border-left:4px solid var(--accent);':'')+'border-radius:10px;padding:11px 14px;background:var(--surface);display:flex;flex-direction:column;gap:6px;">'+
        '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);">'+esc(ln.l)+'</div>'+
        (ln.html ? ln.html : '<div style="font-size:13px;line-height:1.65;white-space:pre-line;">'+withCites(ln.t)+'</div>')+
        (ln.l==='Images tab' && !stage.hideImages ? nodeImagesButton(c, idx, stage) : '')+
      '</div>';
  };
  return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">'+
      '<h3 style="margin:0;">'+esc(stage.docTitle)+'</h3>'+
      (stage.date ? '<span style="font-size:11px;color:var(--ink-faint);font-family:var(--font-mono);">'+fmtDate(stage.date)+'</span>' : '')+
    '</div>'+
    (stage.redReason ? '<div><span class="badge badge-tier3" style="white-space:normal;height:auto;line-height:1.35;padding:3px 10px;">'+icon('alert',11)+'&nbsp;'+esc(stage.redReason)+'</span></div>' : '')+
    (formKeys.length ? '<div style="display:flex;gap:8px;flex-wrap:wrap;">'+formKeys.map(k=>'<button class="btn btn-gold btn-sm" data-open-node-form="'+c.id+'::'+k+'">'+icon('chevronRight',13)+' Open form'+(formKeys.length>1?' '+formDef(k).num:'')+'</button>').join('')+'</div>' : '')+
    (function(){
      const L = docStageLines(c, stage);
      const strip = (!isMdtStage(stage) && !stage.hideImages && !L.some(x=>x.l==='Images tab')) ? stageImageStrip(stage) : '';
      if(!strip) return L.map(line).join('');
      const ti = L.findIndex(x=>x.tier);
      return ti>=0 ? L.slice(0,ti).map(line).join('')+strip+L.slice(ti).map(line).join('') : L.map(line).join('')+strip;
    })()+
    (stage.docText ? '<div style="font-size:13px;line-height:1.65;">'+withCites(stage.docText)+'</div>' : '')+
    renderNodeExtras(c, stage)+
    (stage.docLinesAfter||[]).map(line).join('')+
    (isMdtStage(stage) && c.status==='Decision Locked' ? renderMdtNodeDiscussion(c) : '');
}
function renderInHouseStageDetail(c, stage){
  if(stage.docTitle) return renderDocStage(c, stage);
  const linkedDocs = linkedExternalDocs(c, stage.stage);
  const formLink = formTabForStage(c, stage);
  const stageIdx = c.timeline.indexOf(stage);
  const dedicatedFindings = dedicatedFindingsFor(c, stage);
  return '<div style="display:flex;align-items:center;justify-content:space-between;">'+
      '<h3>'+esc(stage.stage)+'</h3>'+
      (stage.date ? '<span style="font-size:11px;color:var(--ink-faint);font-family:var(--font-mono);">'+fmtDate(stage.date)+'</span>' : '<span class="badge badge-neutral">Pending</span>')+
    '</div>'+
    /* "Entered by" attribution: who actually recorded this node, not just which role owns
       it — every worked-case spec names the entering clinician, so this shouldn't be
       inferable only from the discussion thread. Falls back to the old role-only line for
       every existing case that doesn't carry a named enteredBy. */
    (stage.enteredBy ? '<div style="font-size:11px;color:var(--ink-muted);display:flex;align-items:center;gap:5px;">'+icon('users',11)+' Entered by <strong>'+esc(stage.enteredBy)+'</strong>'+(stage.owner?' &middot; '+esc(stage.owner):'')+(stage.date?' &middot; '+fmtDate(stage.date):'')+'</div>' :
      (stage.owner ? '<div style="font-size:10.5px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em;font-weight:700;">Owner: '+esc(stage.owner)+'</div>' : ''))+
    (stage.redReason ? '<div><span class="badge badge-tier3" style="white-space:normal;height:auto;line-height:1.35;padding:3px 10px;">'+icon('alert',11)+'&nbsp;'+esc(stage.redReason)+'</span></div>' : '')+
    (formLink ? '<div><button class="btn btn-gold btn-sm" data-open-form-tab="'+c.id+'::'+formLink.tab+'">'+icon('chevronRight',13)+' Open '+esc(formLink.label)+' form</button></div>' :
      (NODE_FIELD_SCHEMAS[stage.stage] ? '<div><button class="btn btn-gold btn-sm" data-open-node-capture="'+c.id+'::'+esc(stage.stage)+'">'+icon('chevronRight',13)+' '+(stage.opinion?'Edit':'Record')+' finding</button></div>' : ''))+
    /* The Finding is structured data (per every worked-case spec's own rule: "never
       free-typed") — once a node has structuredFindings, that table IS the finding, so
       the free-text summary paragraph is dropped here rather than duplicating the same
       facts as prose. Nodes without a structured schema (dedicated-tab stages, MDT lock,
       legacy cases) keep the plain summary exactly as before. */
    ((stage.structuredFindings || dedicatedFindings.length || (isMdtStage(stage) && c.mdtRecord)) ? '' : '<div style="font-size:13px;line-height:1.6;">'+esc(stage.summary)+'</div>')+
    /* Only show the live point-of-care intake widget while presentation is still being
       captured — once the stage is dated, the structured findings/summary above are the
       record, and a wall of "Not yet fetched" placeholders for already-known facts is
       just noise. */
    ((stage.stage==='Presentation & History' || stage.stage==='Presentation') && !stage.date ? renderIntakeFieldsSummary(c) : '')+
    (stage.hasImage ? '<div style="max-width:280px;">'+ctMock(stage)+'</div>' : '')+
    /* Order matches how a specialist actually works a node: the (auto-extracted)
       finding first, then their own opinion on it, the images that finding is based
       on alongside it, and the Tier sign-off last — that's the crux, the decision
       that comes out of everything above it, not a middle step. */
    renderStructuredFindings(stage)+
    renderFindingsCard(dedicatedFindings)+
    renderNodeExtras(c, stage)+
    renderNodeOpinion(stage)+
    nodeImagesButton(c, stageIdx, stage)+
    renderNodeTierBadge(stage)+
    /* A first-time viewer of the chart shouldn't have to discover a separate Discussion
       tab to see how the board actually got to this decision — the full round table
       (and the Q&A round) is embedded right here, on the node itself. This is the
       difference between this chart and a plain EMR: someone landing here for the
       first time should come away having effectively sat through the meeting. */
    (isMdtStage(stage) && c.status==='Decision Locked' && c.thread.length ? renderMdtNodeDiscussion(c) :
      ((stage.decision ? decisionRow('checkCircle','Decision', stage.decision, 'var(--good)') : '')+
      (stage.reasoningLong ? decisionRow('sparkle','Reasoning', stage.reasoningLong, 'var(--info)') : '')+
      (stage.hasDissent ? '<div class="badge badge-tier3" style="align-self:flex-start;">'+icon('alert',12)+' Dissent recorded</div>' : '')))+
    (stage.stage==='Molecular NGS + PD-L1' && c.biomarkers ? renderIciEligibilityBanner(c) : '')+
    (linkedDocs.length ? renderLinkedExternalDocs(linkedDocs) : '')+
    (stage.stage==='Presentation & History' || stage.stage==='Presentation' ? '' :
      '<div><button class="btn btn-ghost btn-sm" data-attach-ext="'+c.id+'::'+esc(stage.stage)+'">'+icon('download',13)+' + Attach external document</button></div>');
}
/* ============================================================
   RECTAL WORKED CASE — timeline node components
   Config (toxicity templates, surveillance schedules, relapse rules) is kept as versioned data,
   so a new regimen / endpoint / guideline update is a config change, not a code change.
   ============================================================ */
function isMdtStage(s){ return s.stage==='MDT Decision Lock' || s.kind==='mdt'; }
function stageIndexByName(c, name){ return c.timeline.findIndex(t=>t.stage===name); }
function nodeJumpChip(c, stageName, label){
  const idx = stageIndexByName(c, stageName);
  const done = idx>=0 && !!c.timeline[idx].date;
  return '<button class="chip" '+(idx>=0 ? 'data-snapshot-jump="'+c.id+'::'+idx+'"' : '')+' style="cursor:pointer;font-size:11.5px;padding:4px 10px;display:inline-flex;align-items:center;gap:5px;">'+
    (done ? '<span style="color:var(--good);display:inline-flex;">'+icon('check',12)+'</span>' : '')+esc(label||stageName)+'</button>';
}
function extrasCard(title, iconName, bodyHtml){
  return '<div class="card card-pad" style="background:var(--surface-2);display:flex;flex-direction:column;gap:10px;">'+
    '<div style="display:flex;align-items:center;gap:7px;">'+
      '<div style="width:22px;height:22px;border-radius:6px;background:var(--gold-soft);color:var(--gold-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(iconName||'sparkle',12)+'</div>'+
      '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">'+esc(title)+'</div>'+
    '</div>'+bodyHtml+
  '</div>';
}
function toneCallout(level, html){
  const l = SUMMARY_LEVEL[level];
  return '<div class="callout" style="display:flex;align-items:flex-start;gap:8px;background:'+l.bg+';border-color:color-mix(in srgb, '+l.c+' 30%, transparent);color:'+l.ink+';">'+html+'</div>';
}
function refImageBox(modality, size){
  const ref = IMAGING_REFS[modality];
  const inner = ref
    ? refImg(ref, modality)
    : '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#6c827a;">'+icon('image',22)+'<span style="font-size:10px;font-family:var(--font-mono);text-align:center;padding:0 6px;">'+esc(modality)+'</span></div>';
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:12px;overflow:hidden;background:'+((ref&&ref.bg)||'#05100f')+';flex-shrink:0;">'+inner+'</div>';
}
function sparkSvg(values, maxV){
  const w = 130, h = 34, n = values.length;
  const x = i => n===1 ? w/2 : 6 + i*(w-12)/(n-1);
  const y = v => h-5 - (v/maxV)*(h-10);
  let d = '', pen = false;
  values.forEach((v,i)=>{ if(v==null){ pen = false; return; } d += (pen?'L':'M')+x(i)+' '+y(v)+' '; pen = true; });
  return '<svg viewBox="0 0 '+w+' '+h+'" style="width:130px;height:34px;flex-shrink:0;">'+
    '<path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>'+
    values.map((v,i)=> v==null ? '' : '<circle cx="'+x(i)+'" cy="'+y(v)+'" r="3" fill="var(--accent)"/>').join('')+
  '</svg>';
}

/* ---------- small per-node extras ---------- */
function renderCeaTrend(c){
  const pts = c.ceaTrend; if(!pts || !pts.length) return '';
  const W = 380, H = 116, pad = 40, maxV = Math.max.apply(null, pts.map(p=>p.value))*1.2;
  const x = i => pad + (pts.length===1 ? 0 : i*(W-2*pad)/(pts.length-1));
  const y = v => H-30 - (v/maxV)*(H-56);
  const line = pts.map((p,i)=>(i?'L':'M')+x(i)+' '+y(p.value)).join(' ');
  return extrasCard('CEA trend (ng/mL)', 'activity',
    '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;max-width:440px;">'+
      '<path d="'+line+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>'+
      pts.map((p,i)=>'<circle cx="'+x(i)+'" cy="'+y(p.value)+'" r="4.5" fill="var(--accent)"/>'+
        '<text x="'+x(i)+'" y="'+(y(p.value)-10)+'" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">'+p.value+'</text>'+
        '<text x="'+x(i)+'" y="'+(H-8)+'" text-anchor="middle" font-size="10" fill="var(--ink-faint)">'+esc(p.label)+'</text>').join('')+
    '</svg>');
}
/* ---------- Trial box (protocol engine) ---------- */
function renderTrialBox(c){
  const tb = c.trialBox; if(!tb) return '';
  const flow = tb.schemaSteps.map((st,i)=>'<span class="chip" style="font-size:12px;padding:4px 11px;background:var(--surface);">'+esc(st)+'</span>'+
    (i<tb.schemaSteps.length-1 ? '<span style="color:var(--ink-faint);display:inline-flex;">'+icon('chevronRight',14)+'</span>' : '')).join('');
  const rows = tb.params.map((r,i)=>'<div style="display:grid;grid-template-columns:minmax(150px,240px) 1fr auto;gap:6px 16px;align-items:baseline;padding:'+(i?'11px':'0')+' 0 0;'+(i?'border-top:1px solid var(--border);':'')+'">'+
      '<div style="font-size:13.5px;font-weight:700;">'+esc(r.label)+'</div>'+
      '<div style="font-size:13.5px;line-height:1.6;">'+(r.value ? withCites(r.value) : '')+'</div>'+
      '<div style="font-size:12px;">'+withCites(r.cite)+'</div></div>').join('');
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    mdtSection('What the box holds',
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">'+
        lightboxThumb(TRIAL_PROTOCOL_PREVIEW.file, TRIAL_PROTOCOL_PREVIEW.caption, 84, 118)+
        '<div style="display:flex;flex-direction:column;gap:2px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Uploaded protocol PDF</div>'+
          '<div style="font-size:14.5px;font-weight:700;">“'+esc(tb.pdfName)+'” <span style="font-size:12px;font-weight:400;">'+withCites(tb.cite)+'</span></div></div>'+
      '</div>'+
      '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">'+flow+'</div>')+
    mdtSection('Auto-extracted protocol parameters', rows, 'accent')+
  '</div>';
}

/* ---------- Consolidation chemo: blocks + side-effect module + picture tab ---------- */
const TOXICITY_TEMPLATES = {
  CAPEOX:{label:'CAPEOX', version:'1', rows:[
    {key:'neuropathy_acute', short:'acute neuropathy', max:4,
      label:'**Peripheral neuropathy — ACUTE** (cold-triggered paresthesia of hands/mouth/throat, jaw/laryngeal spasm, within hours of infusion)',
      expected:'Occurs in ~85–95% of oxaliplatin patients; ~94% with CapOx; transient, resolves in days (Kang et al., J Neurol 2021; Storey et al., Ann Oncol 2010)',
      action:'Counsel strict **cold avoidance**; **do not apply ice** (worsens acute neuropathy — oxaliplatin FDA label)'},
    {key:'neuropathy_chronic', short:'neuropathy', max:4, signature:true, rule:{minGrade:2, reason:'Neuropathy'},
      label:'**Peripheral neuropathy — CHRONIC / cumulative** (stocking-glove sensory loss, proprioceptive impairment; may “coast” and worsen 2–6 mo after stopping)',
      expected:'Dose-dependent; grade ≥2 in ~27% after TNT; grade 3 persistent in ~13%, and ~80% of grade 3 progress from prior grade 1–2 (Wurschi et al., Int J Cancer 2026; oxaliplatin FDA label; El-Shami et al., CA Cancer J Clin 2015)',
      action:'**Grade ≥2 → oxaliplatin dose-reduce; grade 3 → hold/stop oxaliplatin** (drives the reductions seen at C3–C5 above)'},
    {key:'hfs', short:'hand-foot syndrome', max:3, signature:true,
      label:'**Hand-foot syndrome** (palmar-plantar erythrodysesthesia — erythema, dysesthesia, desquamation of palms/soles)',
      expected:'Capecitabine-driven; ~50–60% any grade, severe 20–30%; **peaks by cycle 2, ~90% present by cycle 4** (Santhosh et al., Trials 2022; Baskarane et al., JAMA Dermatol 2026; XELODA FDA label 54–60%, grade 3 17%)',
      action:'Emollients/urea; **grade 2 limiting IADLs or grade 3 → capecitabine hold + dose-reduce**'},
    {key:'diarrhea', short:'diarrhea', max:4, label:'**Diarrhea**',
      expected:'~47–55% any grade; grade 3–4 ~12–13% (XELODA FDA label)', action:'Loperamide; hydration; **grade ≥3 → hold, rule out dehydration**'},
    {key:'nausea', short:'nausea', max:4, label:'**Nausea / vomiting**',
      expected:'~34–55% any grade (XELODA FDA label; SPRING-01)', action:'Prophylactic antiemetics per protocol'},
    {key:'stomatitis', short:'stomatitis', max:4, label:'**Stomatitis / mucositis**',
      expected:'~22–25% (XELODA FDA label)', action:'Oral care; analgesia'},
    {key:'myelosuppression', short:'myelosuppression', max:4,
      label:'**Myelosuppression — neutropenia / thrombocytopenia / anemia** (auto-linked to the pre-cycle CBC)',
      expected:'With CapOx, grade ≥3 neutropenia ~14%, thrombocytopenia and anemia common (Shibata et al., Cancer Chemother Pharmacol 2023; RESOLVE CapOx data)',
      action:'**ANC/platelet thresholds gate the next cycle**; hold + G-CSF per policy'},
    {key:'fatigue', short:'fatigue', max:4, label:'**Fatigue**', expected:'~16–42% (XELODA FDA label)', action:'Supportive'},
    {key:'cardiotox', short:'cardiotoxicity', redFlag:true,
      label:'**Cardiotoxicity — chest pain / coronary vasospasm** (RED-FLAG box)',
      expected:'Rare (~0.2%) but serious with fluoropyrimidines (Hoon et al., Cochrane 2021; FDA label)',
      action:'**Single tick → same-day cardiology + hold capecitabine**'},
    {key:'other', short:'other', max:4, other:true, label:'**Other** (free-text, only if none above fit)', expected:'—', action:'logged for MDT visibility'},
  ]},
};
function fmtMg(n){ return (Math.round(n*10)/10).toLocaleString('en-US'); }
function chemoTemplate(c){ return TOXICITY_TEMPLATES[c.chemo.regimen]; }
function chemoToxLine(c, cy){
  const rows = chemoTemplate(c).rows;
  const parts = cy.toxicities.map((t,i)=>{
    const r = rows.find(x=>x.key===t.key) || {short:t.key};
    const txt = (r.redFlag ? 'red-flag ' : 'grade '+t.grade+' ')+r.short+(t.note ? ' ('+t.note+')' : '');
    return i===0 ? txt.charAt(0).toUpperCase()+txt.slice(1) : txt;
  });
  return parts.length ? parts.join('; ') : '—';
}
function chemoReasonCodes(c, cy){
  return chemoTemplate(c).rows.filter(r=>r.rule).map(r=>{
    const t = cy.toxicities.find(x=>x.key===r.key);
    return (t && t.grade>=r.rule.minGrade) ? r.rule.reason : null;
  }).filter(Boolean);
}
function chemoSummary(c){
  const ch = c.chemo, cyc = ch.cycles;
  const oxaliPlanned = ch.drugs[0].mgm2PerCycle*cyc.length, capePlanned = ch.drugs[1].mgm2PerCycle*cyc.length;
  const oxali = cyc.reduce((a,cy)=>a+ch.drugs[0].mgm2PerCycle*cy.oxaliPct/100, 0);
  const cape = cyc.reduce((a,cy)=>a+ch.drugs[1].mgm2PerCycle*cy.capePct/100, 0);
  const longest = cyc.reduce((m,cy)=>cy.delayDays>m.d ? {d:cy.delayDays, n:cy.n} : m, {d:0, n:0});
  const neuro = cyc.map(cy=>{ const t = cy.toxicities.find(x=>x.key==='neuropathy_chronic'); return t ? t.grade : null; });
  return {span:cyc[cyc.length-1].day-cyc[0].day, oxali, oxaliPlanned, cape, capePlanned, longest, neuro};
}
function chemoAlerts(c){
  const rows = chemoTemplate(c).rows, out = [];
  c.chemo.cycles.forEach(cy=>cy.toxicities.forEach(t=>{
    const r = rows.find(x=>x.key===t.key);
    if(r && r.redFlag) out.push('Red-flag ticked at C'+cy.n+': '+r.short+' — same-day cardiology + hold capecitabine');
    else if(t.grade>=3) out.push('Grade '+t.grade+' '+(r?r.short:t.key)+' at C'+cy.n);
  }));
  return out;
}
/* Stop 12b — the four visual-toxicity photo categories, worded as in the source document. */
const CHEMO_PHOTO_CATEGORIES = [
  {key:'hfs', name:'Hand-foot syndrome', icon:'stetho', modality:'Clinical photo (hand-foot syndrome)',
    text:`standardized palms-and-soles photos each cycle (fixed framing), so grade 1→2→3 progression is visible side-by-side. HFS is the single most photograph-worthy CAPEOX toxicity because grading is visual and dose decisions hinge on it (Baskarane et al., JAMA Dermatol 2026).`},
  {key:'stomatitis', name:'Stomatitis / mucositis', icon:'alert', modality:'Clinical photo',
    text:`intra-oral photo when present.`},
  {key:'skin', name:'Skin — rash / dermatitis / RT-field dermatitis', icon:'layers', modality:'Clinical photo',
    text:`perineal/pelvic RT-field photo (bridges the chemoRT node) and any capecitabine rash.`},
  {key:'infusion', name:'Injection/infusion site', icon:'activity', modality:'Clinical photo', example:{file:'images/oxaliplatin-extravasation.jpeg', caption:'Reference example — oxaliplatin extravasation mid-infusion'},
    text:`oxaliplatin extravasation or venous-irritation photo if it occurs.`},
];
function chemoGradeColor(g){ return g>=3 ? 'var(--crit)' : g===2 ? 'var(--warn)' : 'var(--good)'; }
function chemoPhotoTile(a, size){
  const ref = IMAGING_REFS[a.p.modality];
  const files = ref ? (ref.files ? ref.files.map(f=>f.file) : [ref.file]).join('|') : '';
  const lb = files ? ' data-lightbox="'+esc(files)+'" data-lb-cap="'+esc(a.p.caption)+'"' : '';
  return '<div style="flex:0 0 '+size+'px;">'+
    (files ? '<div'+lb+' title="Click to enlarge" style="cursor:zoom-in;">'+refImageBox(a.p.modality, size)+'</div>' : refImageBox(a.p.modality, size))+
    (files ? '<button type="button" class="btn btn-ghost btn-sm"'+lb+' style="margin-top:6px;padding:2px 9px;">'+icon('eye',12)+' Enlarge</button>' : '')+
    '<div style="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">'+
      '<span class="chip" style="font-size:11px;padding:2px 9px;font-weight:700;">Cycle '+a.n+'</span>'+
      '<span class="badge" style="background:'+chemoGradeColor(a.p.grade)+';color:#fff;">Grade '+a.p.grade+'</span>'+
      (a.p.keyImage ? '<span style="color:var(--gold-strong);display:inline-flex;" title="Key image">'+icon('sparkle',13)+'</span>' : '')+
    '</div>'+
    '<div style="font-size:11.5px;line-height:1.4;margin-top:4px;">'+esc(a.p.caption)+'</div>'+
    (a.p.ts ? '<div style="font-size:10.5px;color:var(--ink-faint);margin-top:2px;">'+fmtDateTime(a.p.ts)+'</div>' : '')+
  '</div>';
}
function renderChemoTrend(c){
  const tpl = chemoTemplate(c), cyc = c.chemo.cycles, n = cyc.length;
  const rows = tpl.rows.filter(r=>!r.redFlag && cyc.some(x=>x.toxicities.some(t=>t.key===r.key)));
  if(!rows.length || n<2) return '';
  const W = 560, padL = 30, padR = 30, X = i => padL + i*(W-padL-padR)/(n-1);
  const guides = cyc.map((_,i)=>'<line x1="'+X(i)+'" x2="'+X(i)+'" y1="0" y2="52" stroke="var(--border)" stroke-width="1"/>').join('');
  const header = '<svg viewBox="0 0 '+W+' 18" style="width:100%;max-width:'+W+'px;height:auto;display:block;">'+cyc.map((cy,i)=>'<text x="'+X(i)+'" y="13" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink-muted)">C'+cy.n+'</text>').join('')+'</svg>';
  const body = rows.map((r,ri)=>{
    const vals = cyc.map(x=>{ const t = x.toxicities.find(y=>y.key===r.key); return t ? t.grade : null; });
    const Y = g => 42 - (g/r.max)*32;
    let d = '', pen = false;
    vals.forEach((v,i)=>{ if(v==null){ pen = false; return; } d += (pen?'L':'M')+X(i)+' '+Y(v)+' '; pen = true; });
    const peak = Math.max.apply(null, vals.map(v=>v==null?0:v));
    const pts = vals.map((v,i)=> v==null
      ? '<circle cx="'+X(i)+'" cy="42" r="3" fill="var(--border-strong)"/>'
      : '<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="10" fill="'+chemoGradeColor(v)+'" stroke="var(--surface)" stroke-width="2"/><text x="'+X(i)+'" y="'+(Y(v)+4)+'" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">'+v+'</text>').join('');
    return '<div style="display:grid;grid-template-columns:minmax(120px,190px) 1fr;gap:14px;align-items:center;padding:8px 0;'+(ri?'border-top:1px solid var(--border);':'')+'">'+
      '<div><div style="font-size:13px;font-weight:700;">'+esc(r.short.charAt(0).toUpperCase()+r.short.slice(1))+'</div>'+
        '<div style="font-size:11px;color:var(--ink-muted);margin-top:2px;">Peak grade '+peak+'</div></div>'+
      '<svg viewBox="0 0 '+W+' 52" style="width:100%;max-width:'+W+'px;height:auto;display:block;">'+guides+
        '<line x1="'+padL+'" x2="'+(W-padR)+'" y1="42" y2="42" stroke="var(--border-strong)" stroke-width="1" stroke-dasharray="3 3"/>'+
        '<path d="'+d+'" fill="none" stroke="var(--ink-faint)" stroke-width="2" stroke-linejoin="round"/>'+pts+'</svg></div>';
  }).join('');
  const legend = [['Grade 1','var(--good)'],['Grade 2','var(--warn)'],['Grade ≥3','var(--crit)']].map(l=>'<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--ink-muted);"><span style="width:10px;height:10px;border-radius:50%;background:'+l[1]+';"></span>'+l[0]+'</span>').join('')+
    '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--ink-muted);"><span style="width:6px;height:6px;border-radius:50%;background:var(--border-strong);"></span>not recorded</span>';
  return '<div style="border:1px solid var(--border);border-radius:10px;background:var(--surface);overflow:hidden;">'+
    '<div style="padding:9px 16px;background:var(--surface-2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">'+
      '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);">Per-toxicity trend across cycles</span>'+
      '<span style="display:flex;gap:14px;flex-wrap:wrap;">'+legend+'</span></div>'+
    '<div style="padding:10px 16px 6px;">'+
      '<div style="display:grid;grid-template-columns:minmax(120px,190px) 1fr;gap:14px;"><div></div><div>'+header+'</div></div>'+body+
    '</div></div>';
}
function renderChemoFilmstrip(c){
  const hfs = [];
  c.chemo.cycles.forEach(x=>(x.photos||[]).forEach(p=>{ if(p.tox==='hfs') hfs.push({n:x.n, p}); }));
  return '<div style="border:1px solid var(--border);border-radius:10px;background:var(--surface);overflow:hidden;">'+
    '<div style="padding:9px 16px;background:var(--surface-2);border-bottom:1px solid var(--border);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);">Hand-foot syndrome — serial photo filmstrip</div>'+
    '<div style="padding:14px 16px;">'+
      (hfs.length ? '<div style="display:flex;gap:16px;overflow-x:auto;padding-bottom:4px;">'+hfs.map(a=>chemoPhotoTile(a, 150)).join('')+'</div>'
                  : '<div style="font-size:12.5px;color:var(--ink-faint);">No hand-foot syndrome photos recorded yet.</div>')+
    '</div></div>';
}
function renderChemoPhotos(c, cyIdx, ro){
  const cy = c.chemo.cycles[cyIdx];
  const cats = CHEMO_PHOTO_CATEGORIES.map(cat=>{
    const mine = (cy.photos||[]).filter(p=>p.tox===cat.key);
    return '<div style="border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:10px;background:var(--surface);">'+
      '<div style="display:flex;align-items:flex-start;gap:10px;">'+
        '<span style="width:30px;height:30px;border-radius:8px;background:var(--accent-soft);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(cat.icon,15)+'</span>'+
        '<div style="font-size:13px;line-height:1.6;flex:1;min-width:0;"><strong>'+esc(cat.name)+':</strong> '+withCites(cat.text)+'</div>'+
        (ro ? '' : '<button class="btn btn-ghost btn-sm" style="flex-shrink:0;" data-chemo-photo-preset="'+cat.key+'">'+icon('plus',13)+' Add photo</button>')+
      '</div>'+
      (mine.length ? '<div style="display:flex;gap:16px;overflow-x:auto;">'+mine.map(p=>chemoPhotoTile({n:cy.n, p}, 132)).join('')+'</div>'
                   : '<div style="font-size:12px;color:var(--ink-faint);padding-left:40px;">No photo recorded for cycle '+cy.n+'.</div>')+
      (cat.example ? '<div style="display:flex;gap:14px;align-items:center;padding-top:10px;border-top:1px dashed var(--border-strong);">'+
        lightboxThumb(cat.example.file, cat.example.caption, 150, 96)+
        '<div><div class="onb-cap" style="margin-bottom:2px;">Reference example</div><div style="font-size:12px;line-height:1.5;">'+esc(cat.example.caption.replace(/^Reference example — /,''))+'</div><div style="font-size:11px;color:var(--ink-faint);">Not this patient</div></div></div>' : '')+
    '</div>';
  }).join('');
  const toxOpts = CHEMO_PHOTO_CATEGORIES.map(k=>[k.key, k.name]);
  return mdtSection('Stop 12b — Post-chemo picture tab (serial toxicity photos) — cycle '+cy.n,
    mdtPara(withCites('A dedicated **image tab on every chemo block** for photographing the toxicities that are visual — this is what lets a grade be defended and tracked over time, exactly like the diagnostic image tabs elsewhere in the timeline.'))+
    cats+
    (ro ? '' : '<details style="font-size:12.5px;"><summary style="cursor:pointer;font-weight:600;">Framing &amp; lighting guide</summary>'+
      '<div style="margin-top:6px;line-height:1.6;color:var(--ink-muted);">Same distance, angle and background every cycle; palms and soles flat with fingers relaxed; even, diffuse light without flash glare — so a grade can be compared cycle to cycle.</div></details>')+
    (ro ? '' : '<div style="border-top:1px solid var(--border);padding-top:12px;display:flex;flex-direction:column;gap:8px;">'+
      '<div style="font-size:11.5px;color:var(--ink-muted);">Each photo is timestamped and tied to the cycle number and the CTCAE grade it documents.</div>'+
      '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;">'+
        '<div class="field" style="flex:1;min-width:180px;"><label>Caption</label><input type="text" id="chemoPhotoCap" placeholder="e.g. Palms and soles — cycle '+cy.n+'"></div>'+
        '<div class="field"><label>Toxicity</label><select id="chemoPhotoTox">'+toxOpts.map(o=>'<option value="'+o[0]+'">'+esc(o[1])+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>CTCAE grade</label><select id="chemoPhotoGrade">'+[1,2,3,4].map(g=>'<option>'+g+'</option>').join('')+'</select></div>'+
        '<label class="checkline"><input type="checkbox" id="chemoPhotoKey"> ★ Worst-cycle key image</label>'+
        '<button class="btn btn-secondary btn-sm" data-chemo-add-photo="'+c.id+'::'+cyIdx+'">'+icon('plus',13)+' Add photo (demo)</button>'+
      '</div></div>'));
}
function renderChemoSideEffects(c, cyIdx, ro){
  const cy = c.chemo.cycles[cyIdx], tpl = chemoTemplate(c);
  const ref = cid => c.id+'::'+cyIdx+'::'+cid;
  const reasons = chemoReasonCodes(c, cy);
  const rows = tpl.rows.map(r=>{
    const t = cy.toxicities.find(x=>x.key===r.key);
    const on = !!t;
    const grade = r.redFlag ? null : (on ? '<select data-chemo-grade="'+ref(r.key)+'"'+(ro?' disabled':'')+' style="padding:4px 8px;border:1px solid var(--border-strong);border-radius:6px;background:var(--surface);">'+
        Array.from({length:r.max+1},(_,g)=>'<option value="'+g+'" '+(t&&t.grade===g?'selected':'')+'>'+g+'</option>').join('')+'</select>'
      : '<span style="color:var(--ink-faint);">0–'+r.max+'</span>');
    return '<tr'+(r.redFlag && on ? ' style="background:var(--crit-soft);"' : '')+'>'+
      '<td style="min-width:260px;'+(r.redFlag?'border-left:4px solid var(--crit);':'')+'"><label class="checkline"><input type="checkbox" data-chemo-tox="'+ref(r.key)+'" '+(on?'checked':'')+(ro?' disabled':'')+'> '+(r.redFlag ? '<span style="color:var(--crit);display:inline-flex;" title="Red flag">'+icon('flag',17)+'</span>' : '')+toxIcon(r.key)+'<span style="font-size:12px;">'+withCites(r.label)+'</span></label>'+
        (r.other && on ? '<input type="text" data-chemo-note="'+ref(r.key)+'" value="'+esc(t.note||'')+'" placeholder="describe" style="margin-top:5px;width:100%;padding:5px 8px;border:1px solid var(--border-strong);border-radius:6px;">' : '')+'</td>'+
      '<td>'+(r.redFlag ? (on ? '<span class="badge badge-tier3">present</span>' : '<span style="color:var(--ink-faint);">absent</span>') : grade)+'</td>'+
      '<td style="font-size:11.5px;color:var(--ink-muted);min-width:240px;">'+withCites(r.expected)+'</td>'+
      '<td style="font-size:11.5px;min-width:200px;">'+withCites(r.action)+'</td></tr>';
  }).join('');
  return '<div style="display:flex;flex-direction:column;gap:10px;">'+
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-faint);">Stop 12a — Post-chemo side-effect module (detailed, per cycle) — cycle '+cy.n+'</div>'+
    (reasons.length ? '<div style="font-size:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">Reason code written to this dose block: '+reasons.map(x=>'<span class="badge badge-gold">'+esc(x)+'</span>').join('')+'</div>' : '')+
    '<div class="table-wrap"><table><thead><tr><th>Side-effect (checkbox row)</th><th>CTCAE grade dropdown</th><th>Expected with '+esc(tpl.label)+' (design reference)</th><th>Action rule surfaced by the tool</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    renderChemoTrend(c)+
    renderChemoFilmstrip(c)+
  '</div>';
}
function renderChemoBlocks(c){
  const ch = c.chemo; if(!ch) return '';
  const active = Math.max(0, Math.min(STATE.chemoActive && STATE.chemoActive[c.id]!=null ? STATE.chemoActive[c.id] : ch.cycles.length-1, ch.cycles.length-1));
  const sum = chemoSummary(c), alerts = chemoAlerts(c);
  const drugText = ch.drugs.map(d=>d.name+' '+d.dose).join(' + ');
  const tr = ch.cycles.map((cy,i)=>{
    const flag = cy.rdiNum!=null && cy.rdiNum < ch.rdiFlagBelow;
    return '<tr data-chemo-cycle="'+c.id+'::'+i+'" style="cursor:pointer;'+(i===active?'background:var(--accent-soft);':'')+'">'+
      '<td style="font-weight:700;">C'+cy.n+'</td>'+
      '<td>Day '+cy.day+'<div style="font-size:10.5px;color:var(--ink-faint);">'+fmtDate(cy.date)+'</div></td>'+
      '<td style="font-size:12px;">'+(i===0 ? esc(drugText) : '″')+'</td><td>100%</td><td>'+withCites(cy.actual)+'</td><td>'+esc(cy.reduction)+'</td><td>'+esc(cy.delay)+'</td>'+
      '<td>'+esc(cy.rdi)+(flag ? ' <span class="badge badge-tier3" style="margin-left:4px;">&lt;'+ch.rdiFlagBelow+'%</span>' : '')+'</td>'+
      '<td style="font-size:12px;">'+esc(chemoToxLine(c, cy))+'</td></tr>';
  }).join('');
  return '<div id="chemoRoot-'+c.id+'" style="display:flex;flex-direction:column;gap:14px;">'+
    (alerts.length ? toneCallout('red', icon('alert',14)+'<span><strong>Flags raised for awareness</strong> (protocol-concordant toxicity management stays Tier 1): '+alerts.map(esc).join(' · ')+'</span>') : '')+
    extrasCard('Consolidation chemotherapy — '+ch.regimen+' × '+ch.numCycles+' (per protocol '+ch.cite+')', 'timer',
      '<div class="table-wrap chemo-tight"><table><thead><tr><th>Cycle</th><th>Date given</th><th>Drug</th><th>Planned dose</th><th>Actual dose given</th><th>Dose reduction</th><th>Delay</th><th>Relative dose intensity (RDI)</th><th>Post-cycle toxicity (boxes)</th></tr></thead><tbody>'+tr+'</tbody></table></div>'+
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-faint);">Auto-computed summary</div>'+
      '<div class="grid grid-3" style="gap:0 20px;">'+
        kv('Total treatment span', 'Day 0 → Day '+sum.span+' ('+sum.span+' days)')+
        kv('Cumulative delivered dose — oxaliplatin', fmtMg(sum.oxali)+' of '+fmtMg(sum.oxaliPlanned)+' mg/m²')+
        kv('Cumulative delivered dose — capecitabine', fmtMg(sum.cape)+' of '+fmtMg(sum.capePlanned)+' mg/m²')+
        kv('Overall RDI', ch.overallRdi)+
        kv('Longest delay', sum.longest.d ? '+'+sum.longest.d+' d (C'+sum.longest.n+')' : 'none')+
        '<div style="padding:8px 0;border-top:1px solid var(--border);"><div style="font-size:10.5px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em;">Neuropathy trend</div>'+sparkSvg(sum.neuro, 4)+'</div>'+
      '</div>')+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:14px;">'+
      '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-faint);margin-right:6px;">Cycle</span>'+
        ch.cycles.map((cy,i)=>'<button class="chip" data-chemo-cycle="'+c.id+'::'+i+'" style="cursor:pointer;font-size:12px;padding:4px 12px;'+(i===active?'background:var(--accent);color:#fff;border-color:transparent;font-weight:700;':'')+'">C'+cy.n+'</button>').join('')+'</div>'+
      renderChemoSideEffects(c, active, true)+
      renderChemoPhotos(c, active, true)+
    '</div>'+
  '</div>';
}
function refreshChemo(cid){
  const c = findCase(cid); if(!c) return;
  const root = document.getElementById('chemoRoot-'+cid);
  if(root) root.outerHTML = renderChemoBlocks(c);
  ['12a','12b'].forEach(p=>{ const el = document.getElementById('chemoForm'+p+'-'+cid); if(el) el.outerHTML = renderChemoFormPart(c, p); });
}

/* ---------- Surveillance dashboard (Stop 14) ---------- */
const SURVEILLANCE_SCHEDULES = {
  NOM:{id:'REC-10A', cite:'[27]', label:'watch-and-wait / NOM (NCCN REC-10A + OPRA W&W)', version:'1',
    cols:['Year 1–2','Year 3','Year 4–5'],
    rows:[
      {key:'hp', modality:'History & physical', cells:['q3–6 mo','q6 mo','q6 mo']},
      {key:'cea', modality:'CEA', cells:['q3–6 mo','q6 mo','q6 mo'], every:[3,6,6], shape:'diamond'},
      {key:'dre', modality:'DRE + proctoscopy / flexible sigmoidoscopy', cells:['**q3–4 mo**','q6 mo','q6 mo'], every:[3,6,6], shape:'circle', lane:'DRE + endoscopy'},
      {key:'mri', modality:'Rectal MRI', cells:['**q6 mo**','q6 mo (to 3 y)','per symptoms'], every:[6,6,0], shape:'square', lane:'Rectal MRI'},
      {key:'ct', modality:'CT chest/abdomen (± pelvis once MRI stops)', cells:['q6–12 mo','q6–12 mo','q6–12 mo'], every:[6,6,6], shape:'triangle', lane:'CT chest/abdomen'},
      {key:'colo', modality:'Colonoscopy', cells:['at 1 y (then per findings)','—','—'], at:[12], shape:'ring', lane:'Colonoscopy'},
    ]},
  RESECTION:{id:'REC-10', cite:'[34]', label:'post-operative (resection) — NCCN REC-10', version:'1',
    cols:['Year 1–2','Year 3','Year 4–5'],
    rows:[
      {key:'hp', modality:'History & physical', cells:['q3–6 mo','q6 mo','q6 mo']},
      {key:'cea', modality:'CEA', cells:['q3–6 mo','q6 mo','q6 mo'], every:[3,6,6], shape:'diamond'},
      {key:'ct', modality:'C/A/P CT', cells:['q6–12 mo','q6–12 mo','q6–12 mo'], every:[6,6,6], shape:'triangle', lane:'CT chest/abdomen'},
      {key:'colo', modality:'Colonoscopy', cells:['at 1 y','—','—'], at:[12], shape:'ring', lane:'Colonoscopy'},
    ]},
};
const RELAPSE_RULES_VERSION = '1';
const RELAPSE_RULES = [
  {key:'rectum', territory:'Rectal tumor bed / scar (endoluminal)', levelNote:'(yr 1–2)', why:'W&W endpoint → local regrowth is the signature event; peaks in first 2 y', watched:'DRE + endoscopy q3–4 mo, MRI q6 mo', cite:'[32][46]',
    hover:'Highest-risk zone months 0–24. This patient is on organ-preservation watch-and-wait; local regrowth is the dominant failure mode and 94% of regrowths occur within 2 years. Any new nodularity on DRE, mass on endoscopy, or restricted diffusion on MRI → suspect regrowth; biopsy not required to act. [32][35]',
    weights:[{when:f=>f.endpoint==='NOM', w:3, label:'Watch-and-wait endpoint — local regrowth is the signature failure'},{when:f=>f.crmThreatened, w:1, label:'Threatened CRM at baseline'}]},
  {key:'lungs', territory:'Lungs', levelNote:'(throughout 5 y)', why:'Lung is the most common distant site after rectal TNT', watched:'CT chest q6–12 mo', cite:'[59][29]',
    weights:[{when:()=>true, w:1, label:'Baseline distant-relapse risk after TNT'},{when:f=>f.emvi, w:1, label:'EMVI-positive'}]},
  {key:'liver', territory:'Liver', levelNote:'', why:'Second most common distant site', watched:'CT abdomen q6–12 mo', cite:'[59][29]',
    weights:[{when:()=>true, w:1, label:'Baseline distant-relapse risk after TNT'},{when:f=>f.emvi, w:1, label:'EMVI-positive'}]},
  {key:'nodes', territory:'Mesorectal / lateral pelvic nodes', levelNote:'', why:'Baseline cN1b, EMVI+ raise nodal/vascular relapse risk', watched:'MRI q6 mo', cite:'[29]',
    weights:[{when:f=>f.nPositive, w:1, label:'Node-positive at baseline'},{when:f=>f.emvi, w:1, label:'EMVI-positive'}]},
];
function relapseFeatures(c){
  const mri = ((c.timeline.find(t=>t.stage==='Rectal MRI')||{}).structuredFindings) || {};
  return {endpoint:c.survDash.endpoint, emvi:!!mri.emvi, crmThreatened:mri.mrfStatus==='Threatened' || mri.mrfStatus==='Involved', nPositive:!!mri.mrN && mri.mrN!=='N0'};
}
function computeRelapseMap(c){
  const f = relapseFeatures(c);
  return RELAPSE_RULES.map(r=>{
    const hits = r.weights.filter(x=>x.when(f));
    const score = hits.reduce((a,x)=>a+x.w, 0);
    return {rule:r, hits, score, level: score>=3 ? 'red' : score>=1 ? 'amber' : 'green'};
  });
}
function renderSurvSchedule(c){
  const sc = SURVEILLANCE_SCHEDULES[c.survDash.endpoint];
  return extrasCard('Panel A — Surveillance schedule (auto-loaded from the endpoint = watch-and-wait / NOM, NCCN REC-10A + OPRA W&W)', 'clock',
    '<div style="font-size:12.5px;line-height:1.55;">'+withCites(c.survDash.endpoint==='NOM' ? 'Because the locked endpoint is **organ preservation**, Milestone loads the **non-operative surveillance schedule** (not the post-resection one):' : 'The locked endpoint is **TME/resection**, so Milestone loads the **post-operative schedule**:')+'</div>'+
    '<div class="table-wrap"><table><thead><tr><th>Modality</th>'+sc.cols.map(x=>'<th>'+esc(x)+'</th>').join('')+'<th>Source</th></tr></thead><tbody>'+
      sc.rows.map(r=>'<tr><td style="font-weight:600;">'+esc(r.modality)+'</td>'+r.cells.map(x=>'<td>'+withCites(x)+'</td>').join('')+'<td>'+withCites(sc.cite)+'</td></tr>').join('')+
    '</tbody></table></div>'+
    (c.survDash.endpoint!=='NOM' ? '' : '<div style="font-size:12px;color:var(--ink-muted);line-height:1.5;">'+withCites('If the endpoint had instead been **TME/resection**, the tool would load **REC-10** (post-operative: H&P + CEA q3–6 mo ×2 y then q6 mo; C/A/P CT q6–12 mo; colonoscopy at 1 y) — the same dashboard, different schedule table. [34]')+'</div>'));
}
function survEventMonths(row){
  const out = [];
  if(row.at) return row.at.slice();
  if(!row.every) return out;
  let m = 0;
  for(;;){
    const step = m<24 ? row.every[0] : m<36 ? row.every[1] : row.every[2];
    if(!step) break;
    m += step; if(m>60) break;
    out.push(m);
  }
  return out;
}
function renderSurvTimeline(c){
  const sd = c.survDash, sc = SURVEILLANCE_SCHEDULES[sd.endpoint];
  const x0 = 150, W = 760, total = 60, X = m => x0 + m/total*W;
  const lanes = sc.rows.filter(r=>r.shape);
  const laneY = i => 60 + i*28;
  const H = 60 + lanes.length*28 + 46;
  const bandsSvg = sd.bands.map(b=>'<g><title>'+esc(b.why.replace(/\s*\[\d+\]/g,''))+'</title>'+
    '<rect x="'+X(b.from)+'" y="30" width="'+(X(b.to)-X(b.from))+'" height="'+(lanes.length*28+14)+'" fill="'+SUMMARY_LEVEL[b.level].c+'" fill-opacity=".16"/>'+
    '<rect x="'+X(b.from)+'" y="30" width="'+(X(b.to)-X(b.from))+'" height="4" fill="'+SUMMARY_LEVEL[b.level].c+'"/></g>').join('');
  const bandLabels = [['Months 0–24',0],['24–36',24],['36–60',36]].map((b,i)=>
    '<text x="'+((X(sd.bands[i].from)+X(sd.bands[i].to))/2)+'" y="22" text-anchor="middle" font-size="11" font-weight="700" fill="'+SUMMARY_LEVEL[sd.bands[i].level].c+'">'+b[0]+'</text>').join('');
  const shapeSvg = (shape, cx, cy, done) => {
    const fill = done ? 'var(--ink)' : 'var(--surface)', st = 'stroke="var(--ink)" stroke-width="1.6"';
    if(shape==='square') return '<rect x="'+(cx-5)+'" y="'+(cy-5)+'" width="10" height="10" fill="'+fill+'" '+st+'/>';
    if(shape==='triangle') return '<path d="M'+cx+' '+(cy-6)+' L'+(cx+6)+' '+(cy+5)+' L'+(cx-6)+' '+(cy+5)+' Z" fill="'+fill+'" '+st+'/>';
    if(shape==='diamond') return '<path d="M'+cx+' '+(cy-6)+' L'+(cx+6)+' '+cy+' L'+cx+' '+(cy+6)+' L'+(cx-6)+' '+cy+' Z" fill="'+fill+'" '+st+'/>';
    if(shape==='ring') return '<circle cx="'+cx+'" cy="'+cy+'" r="7" fill="'+fill+'" '+st+'/><circle cx="'+cx+'" cy="'+cy+'" r="3" fill="none" stroke="'+(done?'var(--surface)':'var(--ink)')+'" stroke-width="1.4"/>';
    return '<circle cx="'+cx+'" cy="'+cy+'" r="5.5" fill="'+fill+'" '+st+'/>';
  };
  const dots = lanes.map((r,i)=>
    '<text x="'+(x0-10)+'" y="'+(laneY(i)+4)+'" text-anchor="end" font-size="11" fill="var(--ink)">'+esc(r.lane||r.modality)+'</text>'+
    '<line x1="'+x0+'" x2="'+(x0+W)+'" y1="'+laneY(i)+'" y2="'+laneY(i)+'" stroke="var(--border)" stroke-width="1"/>'+
    survEventMonths(r).map(m=>shapeSvg(r.shape, X(m), laneY(i), m<=sd.nowMonth)).join('')).join('');
  const axisY = laneY(lanes.length-1)+26;
  const axis = [0,12,24,36,48,60].map(m=>'<line x1="'+X(m)+'" x2="'+X(m)+'" y1="'+(axisY-6)+'" y2="'+axisY+'" stroke="var(--border-strong)"/><text x="'+X(m)+'" y="'+(axisY+13)+'" text-anchor="middle" font-size="10.5" fill="var(--ink-faint)">'+m+(m===60?' mo':'')+'</text>').join('');
  const here = '<line x1="'+X(sd.nowMonth)+'" x2="'+X(sd.nowMonth)+'" y1="30" y2="'+(axisY-6)+'" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 3"/>'+
    '<rect x="'+(X(sd.nowMonth)-56)+'" y="'+(axisY+16)+'" width="112" height="20" rx="10" fill="var(--ink)"/><text x="'+X(sd.nowMonth)+'" y="'+(axisY+30)+'" text-anchor="middle" font-size="11" font-weight="700" fill="var(--surface)">you are here @ '+sd.nowMonth+' mo</text>';
  const bandNames = ['highest hazard', 'residual hazard', 'low hazard'];
  const captions = sd.bands.map((b,i)=>'<div style="display:flex;align-items:flex-start;gap:8px;font-size:12px;line-height:1.45;">'+summaryDot(b.level)+'<span><strong>Months '+b.from+'–'+b.to+'</strong> ('+bandNames[i]+') — '+withCites(b.why)+'</span></div>').join('');
  return extrasCard('Panel B — Surveillance timeline graph (monthly / 3-monthly), with the high-risk window in red', 'activity',
    '<div style="font-size:12.5px;line-height:1.55;">'+withCites('A horizontal 5-year timeline plots every scheduled event (each visit is a dot; MRI/endoscopy/CT icons differ). The **background is shaded by relapse hazard over time**:')+'</div>'+
    '<svg viewBox="0 0 '+(x0+W+20)+' '+(axisY+44)+'" style="width:100%;min-width:640px;" role="img" aria-label="Five-year surveillance timeline">'+bandsSvg+bandLabels+dots+axis+here+'</svg>'+
    '<div style="display:flex;flex-direction:column;gap:6px;">'+captions+'</div>');
}
function renderSurvRiskMap(c){
  const map = computeRelapseMap(c);
  const zones = map.map(m=>({key:m.rule.key, level:m.level}));
  const pill = (m) => '<span class="badge" style="background:'+SUMMARY_LEVEL[m.level].bg+';color:'+SUMMARY_LEVEL[m.level].ink+';">'+summaryDot(m.level)+'&nbsp;'+(m.level==='red'?'HIGH':m.level==='amber'?'Moderate':'Low')+(m.rule.levelNote?' '+esc(m.rule.levelNote):'')+'</span>';
  const rows = map.map(m=>'<tr'+(m.rule.hover?' title="'+esc(m.rule.hover)+'" style="cursor:help;"':'')+'>'+
    '<td style="font-weight:600;">'+esc(m.rule.territory)+'</td><td>'+pill(m)+'</td><td style="font-size:12px;">'+esc(m.rule.why)+'</td><td style="font-size:12px;">'+esc(m.rule.watched)+'</td><td>'+withCites(m.rule.cite)+'</td></tr>').join('')+
    '<tr><td style="font-weight:600;">Distant overall</td><td><span class="badge badge-neutral">Elevated vs local</span></td><td style="font-size:12px;">Post-TNT, <strong>distant metastasis (≈18–19%) &gt;&gt; locoregional (≈3–4%)</strong></td><td style="font-size:12px;">CT surveillance</td><td>'+withCites('[29]')+'</td></tr>';
  return extrasCard('Panel C — Relapse-risk MAP ("AI"): highlight the anatomic areas of highest relapse in red', 'network',
    '<div style="font-size:12.5px;line-height:1.55;">'+withCites('The map takes (a) the **chosen strategy** (W&W → local regrowth is the signature failure) and (b) **this patient’s own risk features** (EMVI+, threatened CRM at baseline, node-positive) and lights up the predicted **highest-risk territories**:')+'</div>'+
    '<div class="grid grid-2" style="gap:20px;align-items:start;grid-template-columns:auto 1fr;">'+
      summaryBodyMapSvg(zones)+
      '<div class="table-wrap"><table><thead><tr><th>Territory</th><th>Risk level for this patient</th><th>Why (patient-specific)</th><th>Watched by</th><th>Source</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '</div>'+
    '');
}
function renderSurvEscalation(){
  return extrasCard('Panel D — Auto-escalation rules (surveillance → recurrence workup)', 'alert',
    '<div style="font-size:12.5px;line-height:1.55;">'+withCites('If any surveillance trigger fires, Milestone opens a **recurrence-workup node (NCCN REC-11)** and can **re-escalate to Tier 2**:')+'</div>'+
    '<div style="display:flex;flex-direction:column;gap:8px;">'+
      '<div style="display:flex;gap:9px;font-size:12.5px;line-height:1.5;"><span style="color:var(--crit);display:inline-flex;margin-top:2px;">'+icon('alert',13)+'</span><span>'+withCites('**Serial CEA rise**, or suspected **local regrowth** on DRE/endoscopy/MRI, or new lung/liver lesion on CT → open REC-11 workup (exam, colonoscopy, C/A/P CT ± FDG-PET/CT) and flag MDT. [49]')+'</span></div>'+
      '<div style="display:flex;gap:9px;font-size:12.5px;line-height:1.5;"><span style="color:var(--crit);display:inline-flex;margin-top:2px;">'+icon('alert',13)+'</span><span>'+withCites('Suspected regrowth in W&W **does not require biopsy confirmation** to act — a high index of suspicion is sufficient to move to salvage surgery. [35]')+'</span></div>'+
    '</div>'+
    '<div style="font-size:12.5px;line-height:1.55;">'+withCites('**Tier mark for the surveillance node:** **Tier 1 while stable**; **auto-re-escalates to Tier 2** on any trigger above.')+'</div>');
}
function renderSurveillanceDashboard(c){
  if(!c.survDash) return '';
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    renderSurvSchedule(c)+renderSurvTimeline(c)+renderSurvRiskMap(c)+renderSurvEscalation()+
  '</div>';
}

/* Per-stage extras, rendered between the structured findings and the opinion. */
const NODE_EXTRAS = {
  'CEA': (c)=>renderCeaTrend(c),
  'Trial Box': (c)=>renderTrialBox(c),
  'Consolidation Chemotherapy': (c)=>renderChemoBlocks(c),
  'Surveillance Dashboard': (c)=>renderSurveillanceDashboard(c),
};
function renderNodeExtras(c, stage){
  const fn = NODE_EXTRAS[stage.stage];
  return fn ? fn(c, stage) : '';
}

/* The complete MDT story, embedded on the lock node itself: the escalation context, the
   image board the panel actually looked at, every specialist's opinion and the
   primary-physician Q&A (both live in c.thread, in order), and the full locked decision.
   Reuses the exact same components the Discussion tab uses — one source of truth, two
   places it's readable from. */
/* ============================================================
   RECTAL NODE FORMS — input side of every timeline node
   Field lists transcribed from the rectal node proforma. Dropdown value lists are versioned
   config (guideline-locked: NCCN REC-A/B/C, SAR/NAPRC MRI template, ICCR/CAP pathology
   dataset), so a guideline update is a config change, not a code change.
   Field spec: k = key, t = select | text | date | longtext | multi | check | readonly,
   show = conditional (↳) trigger, attach = 📎 per option.
   ============================================================ */
const FORM_LISTS_VERSION = '1';
const FM = {
  sel:(k,label,options,x)=>Object.assign({k, t:'select', label, options}, x||{}),
  txt:(k,label,x)=>Object.assign({k, t:'text', label}, x||{}),
  num:(k,label,x)=>Object.assign({k, t:'text', num:true, label}, x||{}),
  date:(k,label,x)=>Object.assign({k, t:'date', label}, x||{}),
  long:(k,label,x)=>Object.assign({k, t:'longtext', label}, x||{}),
  multi:(k,label,options,x)=>Object.assign({k, t:'multi', label, options}, x||{}),
  chk:(k,label,x)=>Object.assign({k, t:'check', label}, x||{}),
};
const FL = {
  orient:['Anterior','Posterior','Left lateral','Right lateral','Circumferential'],
  mobility:['Mobile','Tethered','Fixed'],
  sphincter:['None','Internal','Internal + external'],
  tone:['Normal','Reduced'],
  ecog:['0','1','2','3','4'],
  grade:['0','1','2','3','4'],
};
const RECTAL_NODE_FORMS = [
  {key:'n0', num:'0', stage:'External Records', title:'NODE 0 — EXTERNAL RECORDS INTAKE',
    owner:'Case coordinator / CNS (log + verify only)',
    groups:[
      {title:'Referral source', fields:[
        FM.sel('referralType','Referral type',['Internal','External hospital','GP','Screening program','Self']),
        FM.txt('refCenter','Referring center name'),
        FM.txt('refClinician','Referring clinician'),
        FM.date('dateReferred','Date referred'),
      ]},
      {title:'Documents attached (tick what is present)', fields:[
        FM.multi('documents','Documents attached',[
          'Outside colonoscopy report + stills',
          'Outside biopsy report / slides (flag "for in-house re-read")',
          'Outside imaging — MRI / CT / PET (flag modality)',
          'Discharge / clinic summary (auto-extract to banner)',
          'Prior treatment records (if previously treated elsewhere)',
        ], {attach:true}),
        FM.sel('imagingModality','Flag modality',['MRI','CT','PET'], {show:{k:'documents', has:'Outside imaging — MRI / CT / PET (flag modality)'}}),
      ]},
      {title:'Verification (each external item)', fields:[
        {k:'verifyStatus', t:'verifyEach', label:'Status', of:'documents', options:['[ext] logged — not yet verified','Re-read requested','Verified in-house']},
      ]},
    ],
    footer:{opinion:'required', tier:true, images:true, tierDefault:1}},

  {key:'n1', num:'1', stage:'Presentation', title:'NODE 1 — PRESENTATION',
    owner:'Colorectal Surgery / Medical Oncology (case owner) + DRE',
    groups:[
      {title:'Presenting symptoms', fields:[
        FM.multi('symptoms','Presenting symptoms',['PR bleeding','Change in bowel habit','Tenesmus','Narrowed stool caliber','Mucus PR','Obstructive symptoms','Incontinence','Pelvic/perineal pain','Weight loss','Anemia symptoms']),
        FM.num('durationWeeks','Symptom duration (weeks)'),
      ]},
      {title:'🚩 Red-flag block (single tick → same-day/urgent pathway)', flag:'redflag', fields:[
        FM.multi('redFlags','Red-flag block',['Bowel obstruction','Perforation/peritonism','Uncontrolled bleeding','Impending obstruction (near-total stenosis)']),
      ]},
      {title:'Risk / history', fields:[
        FM.sel('famHx','Family history colorectal cancer',['None','1st-degree','Suspected Lynch/FAP'], {flagWhen:{eq:'Suspected Lynch/FAP', text:'Genetics referral flag [49]'}}),
        FM.multi('riskHx','Risk history',['IBD','Prior polyps','Prior pelvic radiation','Prior malignancy']),
        FM.sel('ecog','ECOG performance status',FL.ecog),
      ]},
      {title:'Comorbidities (drive fitness for CRT/surgery)', fields:[
        FM.multi('comorbid','Comorbidities',['Hypertension','Cardiac disease','Diabetes','COPD','Renal impairment (eGFR box)','Anticoagulation','Immunosuppression']),
        FM.num('egfr','eGFR', {show:{k:'comorbid', has:'Renal impairment (eGFR box)'}}),
        FM.txt('comorbOther','Other'),
      ]},
      {title:'Digital rectal exam (DRE) [62]', fields:[
        FM.num('dreEdge','Distance of lower tumor edge from anal verge (cm)'),
        FM.num('dreRing','Distance from anorectal ring (cm)'),
        FM.sel('dreOrient','Orientation (clock-face) / wall',FL.orient),
        FM.num('dreCirc','% circumference involved'),
        FM.sel('dreMobility','Mobility',FL.mobility),
        FM.sel('dreSphincter','Sphincter involvement',FL.sphincter),
        FM.sel('dreTone','Sphincter tone',FL.tone),
        FM.sel('drePalpable','Tumor palpable',['Yes','No (non-palpable — note assessed endoscopically)']),
      ]},
    ],
    footer:{opinion:'required', tier:true, images:true, imagesHint:'tumor-position schematic (verge distance, clock-face, %circumference)'}},

  {key:'n2', num:'2', stage:'Colonoscopy + Biopsy', title:'NODE 2 — COLONOSCOPY + BIOPSY',
    owner:'Endoscopy / Gastroenterology',
    groups:[
      {title:'Procedure completeness', fields:[
        FM.sel('extent','Extent reached',['Cecum','Incomplete']),
        FM.txt('extentReason','Reason (obstructing lesion, prep, etc.)', {show:{k:'extent', eq:'Incomplete'}}),
        FM.sel('prep','Bowel prep quality (Boston BPS)',['Adequate','Inadequate']),
        FM.sel('sync','Synchronous lesion',['None','Polyp(s)','2nd cancer'], {flagWhen:{in:['Polyp(s)','2nd cancer'], text:'[49]'}}),
        FM.txt('syncSite','Site', {show:{k:'sync', in:['Polyp(s)','2nd cancer']}}),
        FM.txt('syncSize','Size', {show:{k:'sync', in:['Polyp(s)','2nd cancer']}}),
        FM.chk('syncTattoo','Tattooed/removed', {show:{k:'sync', in:['Polyp(s)','2nd cancer']}}),
      ]},
      {title:'Index tumor', fields:[
        FM.num('distVerge','Distance from anal verge (cm)'),
        FM.sel('morph','Morphology',['Polypoid','Ulcerated','Fungating','Annular/stenosing','Flat']),
        FM.num('circPct','Estimated % circumference'),
        FM.sel('lumen','Lumen',['Traversable','Non-traversable stricture'], {hint:'non-traversable predicts advanced stage [56]'}),
      ]},
      {title:'Biopsy / marking', fields:[
        FM.num('biopsies','Number of biopsies (target ≥6 adequate) [49]'),
        FM.sel('tattoo','Tattoo placed',['Yes (distal to lesion)','No','N/A (at verge)']),
        FM.chk('complication','Complication (perforation/bleed)'),
        FM.txt('complicationDetail','Detail', {show:{k:'complication', on:true}}),
      ]},
    ],
    footer:{opinion:'required', tier:true, images:true, imagesHint:'★endoscopic photo of tumor, retroflexed distal-rectum view, tattoo still, optional video clip'}},

  {key:'n3', num:'3', stage:'Pathology', title:'NODE 3 — PATHOLOGY (diagnostic biopsy)',
    owner:'Pathology',
    groups:[
      {title:'Turnaround', fields:[
        FM.date('dateReceived','Date specimen received'),
        FM.date('dateReported','Date reported'),
      ]},
      {title:'Diagnosis (ICCR/CAP core elements) [39][48]', fields:[
        FM.sel('histDx','Histologic diagnosis',['Adenocarcinoma','Mucinous adenocarcinoma','Signet-ring','Neuroendocrine','Squamous','Other','Adenoma only (no invasion)','Non-diagnostic']),
        FM.sel('grade','Differentiation (grade)',['Well (G1)','Moderate (G2)','Poor (G3)','Undifferentiated (G4)']),
        FM.chk('bgAdenoma','Background adenoma (tubulovillous, etc.)'),
      ]},
      {title:'Early-cancer risk factors (shown for polypectomy/local-excision specimens — drive local-excision eligibility) [54][62]', fields:[
        FM.sel('lvi','Lymphovascular invasion',['Present','Absent','Cannot assess']),
        FM.sel('pni','Perineural invasion',['Present','Absent']),
        FM.sel('budding','Tumor budding',['Low','Intermediate','High']),
        FM.sel('deepMargin','Deep-margin (if polyp/LE)',['Clear (>1 mm)','Involved','Indeterminate']),
      ]},
      {title:'Molecular adequacy (hand-off to Node 7)', fields:[
        FM.sel('blockAdequate','Block adequate for NGS/MMR',['Yes','No'], {flagWhen:{eq:'No', text:'Request re-biopsy'}}),
      ]},
    ],
    footer:{opinion:'required', tier:true, images:true, imagesHint:'★H&E microphotograph, whole-slide-image link'}},

  {key:'n4', num:'4', stage:'Rectal MRI', title:'NODE 4 — RECTAL-PROTOCOL MRI',
    owner:'Radiology (abdominopelvic)', 
    groups:[
      {title:'Tumor location & anatomy', fields:[
        FM.num('distMm','Distance anal verge → lower tumor edge (mm)'),
        FM.sel('third','Rectal third',['Low (<5 cm)','Mid (5–10 cm)','High (>10 cm)'], {hint:'[57]'}),
        FM.sel('reflection','Relationship to peritoneal reflection',['Above','Straddles','Below'], {hint:'[37]'}),
        FM.sel('sphincter','Sphincter involvement (low tumors)',FL.sphincter, {hint:'[37]'}),
        FM.num('length','Tumor length (mm)'),
        FM.sel('clock','Circumferential location (clock-face)',['Anterior','Posterior','Left','Right','Circumferential']),
        FM.sel('morph','Morphology',['Polypoid','Annular','Partly annular','Mucinous','Ulcerated','Perforated'], {hint:'[37]'}),
      ]},
      {title:'T category (SAR list — note MRI cannot reliably split T2 vs early T3) [66][70]', fields:[
        FM.sel('mrT','mrT',['T1','T2','T3a (<1 mm)','T3b (1–5 mm)','T3c (5–15 mm)','T3d (>15 mm)','T4a (peritoneal reflection)','T4b (adjacent organ)','Tx']),
        FM.num('emd','Extramural depth of invasion (mm) (≥5 mm = high-risk) [55]'),
      ]},
      {title:'Circumferential resection margin / MRF (the treatment-driving field) [37][52]', fields:[
        FM.num('mrfDist','Shortest tumor-to-MRF distance (mm)'),
        FM.sel('mrfStatus','MRF status',['Clear (>1 mm)','Threatened (≤1 mm)','Involved']),
        FM.txt('mrfLoc','Location of threatened/involved margin (clock-face + level)'),
      ]},
      {title:'Nodal status', fields:[
        FM.sel('mrN','mrN',['N0','N1','N2']),
        FM.num('nodeCount','Number of suspicious mesorectal nodes'),
        FM.chk('lateral','Suspicious extramesorectal / lateral pelvic nodes'),
        FM.txt('lateralStation','Station', {show:{k:'lateral', on:true}}),
        FM.num('lateralAxis','Short-axis (mm) (≥7 mm lateral threshold) [53]', {show:{k:'lateral', on:true}}),
        FM.sel('chain','Chain',['Locoregional (mesorectal/internal iliac/obturator)','Distant (external/common iliac, retroperitoneal)'], {hint:'[37]'}),
      ]},
      {title:'High-risk features [55][59]', badge:'highrisk', fields:[
        FM.multi('highRisk','High-risk features',['EMVI positive','Tumor deposits','T4','EMD ≥5 mm','Involved/threatened CRM','cN2','Enlarged lateral nodes']),
      ]},
    ],
    footer:{opinion:'required', opinionLabel:'required — the read + what will drive treatment', tier:true, images:true, imagesHint:'★axial T2 with MRF caliper + margin circled, sagittal T2 (height), DWI, EMVI image'}},

  {key:'n5', num:'5', stage:'CT Chest / Abdomen / Pelvis', title:'NODE 5 — CT CHEST / ABDOMEN / PELVIS (distant staging)',
    owner:'Body imaging (Radiology)',
    groups:[
      {title:'Distant staging', fields:[
        FM.sel('lung','Lung',['No lesion','Indeterminate nodule(s)','Metastasis']),
        FM.txt('lungSize','Size', {show:{k:'lung', in:['Indeterminate nodule(s)','Metastasis']}}),
        FM.num('lungCount','Count', {show:{k:'lung', in:['Indeterminate nodule(s)','Metastasis']}}),
        FM.sel('liver','Liver',['No lesion','Indeterminate','Metastasis']),
        FM.txt('liverSegment','Segment', {show:{k:'liver', in:['Indeterminate','Metastasis']}}),
        FM.num('liverCount','Count', {show:{k:'liver', in:['Indeterminate','Metastasis']}}),
        FM.chk('liverMri','MRI liver recommended [47]', {show:{k:'liver', in:['Indeterminate','Metastasis']}}),
        FM.sel('peritoneum','Peritoneum',['Negative','Suspicious']),
        FM.sel('distantNodes','Distant nodes',['Negative','Positive']),
        FM.sel('mCat','M category',['M0','M1a','M1b','M1c'], {hint:'[38]'}),
        FM.chk('baseline','Baseline lung/liver parenchyma saved as surveillance comparator'),
      ]},
    ],
    footer:{opinion:'required', tier:true, images:true, imagesHint:'representative lung-window + liver-window slices saved as baseline'}},

  {key:'n6', num:'6', stage:'CEA', title:'NODE 6 — CEA (baseline tumor marker)',
    owner:'Medical Oncology (labs)',
    groups:[
      {title:'Baseline CEA', fields:[
        FM.num('cea','Baseline CEA (ng/mL)'),
        FM.date('ceaDate','Date'),
        FM.sel('ceaInterp','Interpretation',['Normal','Elevated']),
      ]},
    ],
    footer:{opinion:'required', tier:true, images:false, imagesText:'n/a (numeric trend)'}},

  {key:'n7', num:'7', stage:'Molecular / NGS', title:'NODE 7 — MOLECULAR / NGS (branch-gate)',
    owner:'Molecular Pathology',
    groups:[
      {title:'Required biomarkers [49][60]', fields:[
        FM.sel('mmr','MMR/MSI',['pMMR / MSS','dMMR / MSI-H'], {flagWhen:{eq:'dMMR / MSI-H', text:'Route to immunotherapy algorithm (REC-14)', tone:'crit'}}),
        FM.sel('kras','KRAS',['WT','Mutant']),
        FM.txt('krasCodon','Codon', {show:{k:'kras', eq:'Mutant'}}),
        FM.sel('nras','NRAS',['WT','Mutant']),
        FM.sel('braf','BRAF',['WT','V600E mutant']),
        FM.sel('her2','HER2',['Negative','Positive']),
        FM.chk('pi3k','Somatic PI3K-pathway alteration (stage II–III)', {flagWhen:{on:true, text:'Aspirin eligibility flag [41]'}}),
        FM.sel('banked','Tissue banked for later metastatic testing',['Yes','No']),
      ]},
    ],
    footer:{opinion:'required', opinionLabel:'required — state the branch this sends the case down', tier:true, tierNote:'(branch-gate)', images:true, imagesHint:'MMR IHC panel, NGS report page'}},

  {key:'n8', num:'8', stage:'Surgical Evaluation', title:'NODE 8 — SURGICAL EVALUATION',
    owner:'Colorectal Surgeon',
    groups:[
      {title:'Independent proctoscopy/flex-sig + DRE [62]', fields:[
        FM.num('edge','Distance from anal verge (cm)'),
        FM.num('ring','From anorectal ring (cm)'),
        FM.sel('orient','Orientation/wall',FL.orient),
        FM.num('circ','% circumference'),
        FM.sel('mobility','Mobility (mobile/tethered/fixed)',FL.mobility),
        FM.txt('obstruction','Extent of obstruction'),
        FM.sel('sphincterInv','Sphincter involvement',FL.sphincter),
        FM.sel('tone','Sphincter tone',FL.tone),
      ]},
      {title:'Resectability & surgical intent', fields:[
        FM.sel('margin','Predicted margin (from MRI)',['R0 achievable','Threatened','Predicted R1–2'], {hint:'[62]'}),
        FM.sel('preserve','Candidate for sphincter preservation',['Yes','Borderline','No (APR anticipated)']),
        FM.sel('procedure','Anticipated procedure',['Transanal local excision','LAR + TME','APR','Coloanal','Extended/beyond-TME'], {hint:'[62]'}),
        FM.chk('stomaReferral','Enterostomal therapist referral for stoma siting [49]'),
      ]},
      {title:'Transanal local-excision eligibility checker (all criteria must be met) [62]', badge:'le', fields:[
        FM.multi('leCriteria','Criteria',['<3 cm','<30% circumference','Mobile/non-fixed','≤8 cm from verge','cT1 only','No LVI/PNI','Well–moderately differentiated','Node-negative on imaging']),
      ]},
    ],
    footer:{opinion:'required', opinionLabel:'required — the surgical judgment MRI cannot show', tier:true, tierNote:'(raise Tier 2 here if threatened margin / strategy choice)', images:true, imagesHint:'surgeon annotation layer stacked on radiologist’s axial T2'}},

  {key:'n9', num:'9', stage:'Tier 2 MDT', title:'NODE 9 — 🔴 TIER 2 SYNCHRONOUS MDT',
    owner:'MDT chair / case owner', kind:'mdt', lockable:true,
    groups:[
      {title:'Quorum (tick present)', fields:[
        FM.multi('quorum','Quorum',['Medical Oncology','Colorectal Surgery','Radiation Oncology','Radiology','Pathology/Molecular','Enterostomal nurse','CNS/coordinator']),
      ]},
      {title:'Auto-imported case summary (read-only, pulled from Nodes 1–8)', summary:true, fields:[]},
      {title:'Per-specialist opinion (each attributed + timestamped, required)', discussion:true, fields:[
        FM.long('opRadiology','Radiology', {tag:'tagRadiology'}),
        FM.long('opPathology','Pathology/Molecular', {tag:'tagPathology'}),
        FM.long('opRadOnc','Radiation Oncology', {tag:'tagRadOnc'}),
        FM.long('opMedOnc','Medical Oncology', {tag:'tagMedOnc'}),
        FM.long('opSurgery','Surgery', {tag:'tagSurgery'}),
        FM.long('opNurse','Nurse', {tag:'tagNurse'}),
      ], note:'Each specialist tags: Agree / Dissent → dissent recorded by name, not smoothed over'},
      {title:'Strategy selection', figure:'strategyTree', fields:[
        FM.sel('strategy','Strategy',['Upfront TME','TNT long-course CRT → TME','TNT consolidation (organ-preservation intent)','TNT induction','Short-course RT → chemo','Nonoperative (W&W)','Systemic (metastatic)'], {hint:'[41][45]'}),
        FM.txt('protocolName','Trial/protocol name'),
      ]},
      {title:'Locked decision block', fields:[
        FM.long('decision','Decision (required)', {rows:6}),
        FM.long('alternatives','Alternatives considered & rejected (required)', {rows:6}),
        FM.long('dissent','Recorded dissent', {rows:6}),
        FM.long('contingency','Contingency (“if not cCR / if progression → …”) (required)'),
        FM.long('patientPref','Patient preference on file'),
        FM.txt('ownerName','Decision-owner name (🔒 recorded with the lock timestamp)'),
      ]},
    ],
    footer:{opinion:'none', tier:false, images:false}},

  {key:'n10', num:'10', stage:'Trial Box', title:'NODE 10 — 📦 TRIAL BOX',
    owner:'case owner', kind:'trial', lockable:true,
    groups:[
      {title:'Protocol', fields:[ {k:'protocolPdf', t:'file', label:'Upload protocol PDF (named strategy/trial)'} ]},
      {title:'Auto-extracted parameters (confirm each)', confirm:true, fields:[
        FM.sel('rtDose','RT dose/fractions',['50.4 Gy / 28 fractions, concurrent capecitabine']),
        FM.sel('regimen','Chemo regimen',['CAPEOX (5 × q3-week cycles)','FOLFOX (8 × q2-week cycles)']),
        FM.num('cycles','Number of cycles'),
        FM.txt('restagingWindow','Restaging window'),
        FM.sel('ccrSet','cCR criteria set',['DRE + endoscopy + MRI (NCCN REC-H)']),
        FM.sel('cadence','Surveillance cadence',['NOM schedule (REC-10A)','Post-resection schedule (REC-10)']),
      ]},
    ],
    footer:{opinion:'none', tier:false, images:false}},

  {key:'n11', num:'11', stage:'Long-Course Chemoradiation', title:'NODE 11 — Long-course chemoRT',
    owner:'Radiation Oncology + Med Onc',
    groups:[
      {title:'Delivery', fields:[
        FM.sel('dose','Dose/fractions (e.g., 50.4 Gy/28)',['50.4 Gy / 28 fractions']),
        FM.sel('agent','Concurrent agent (capecitabine/5-FU)',['Capecitabine','5-FU']),
        FM.txt('completion','Completion status'),
      ]},
      {title:'CTCAE acute-toxicity checklist (proctitis, dermatitis, cystitis) [41]', fields:[
        FM.sel('proctitis','Proctitis',FL.grade),
        FM.sel('dermatitis','Dermatitis',FL.grade),
        FM.sel('cystitis','Cystitis',FL.grade),
      ]},
      {title:'Plan', fields:[ {k:'isodose', t:'file', label:'Isodose plan'} ]},
    ],
    footer:{opinion:'required', tier:true, images:true, imagesHint:'RT plan isodose screenshot; on-treatment CBCT thumbnails; toxicity photos if relevant'}},

  {key:'n12', num:'12', stage:'Consolidation Chemotherapy', title:'NODE 12 — Consolidation chemo blocks', kind:'chemoBlocks',
    owner:'Medical Oncology',
    groups:[], footer:{opinion:'required', tier:true, images:true}},
  {key:'n12a', num:'12a', stage:'Consolidation Chemotherapy', title:'NODE 12a — Per-cycle side-effect panel', kind:'chemoSide',
    owner:'Medical Oncology',
    intro:'Neuropathy (acute/chronic), hand-foot syndrome, diarrhea, nausea, stomatitis, myelosuppression, fatigue, 🚩 fluoropyrimidine chest pain.',
    groups:[], footer:{opinion:'none', tier:false, images:false}},
  {key:'n12b', num:'12b', stage:'Consolidation Chemotherapy', title:'NODE 12b — Side-effect picture tab', kind:'chemoPhotos',
    owner:'Medical Oncology',
    intro:'📎 timestamped photos bound to cycle + CTCAE grade (serial HFS palms/soles filmstrip, stomatitis, RT-field dermatitis).',
    groups:[], footer:{opinion:'none', tier:false, images:false}},

  {key:'n13', num:'13', stage:'Restaging (cCR)', title:'NODE 13 — Restaging / cCR',
    owner:'Colorectal Surgery + Radiology + Med Onc (joint)',
    groups:[
      {title:'Response assessment [62]', fields:[
        FM.sel('dre','DRE (scar/nodule/ulcer)',['Scar','Nodule','Ulcer']),
        FM.sel('endoscopy','Endoscopy (white scar / residual)',['White scar','Residual']),
        FM.sel('mri','MRI (fibrosis / residual / DWI)',['Fibrosis','Residual','DWI']),
        FM.num('cea','CEA'),
      ]},
    ],
    footer:{opinion:'required', tier:true, images:true, imagesHint:'endoscopy scar and MRI (T2 + DWI) key images'}},

  {key:'n14', num:'14', stage:'Surveillance Dashboard', title:'NODE 14 — Surveillance dashboard',
    owner:'shared — Med Onc + Colorectal Surgery + Radiology; coordinated by CNS',
    groups:[
      {title:'Surveillance endpoint', fields:[
        FM.sel('endpoint','Locked endpoint (W&W → REC-10A cadence)',['Watch-and-wait / NOM (REC-10A)','Resection (REC-10)']),
      ]},
      {title:'Escalation triggers (CEA rise / suspected regrowth — biopsy not required to act)', fields:[
        FM.multi('triggers','Surveillance triggers observed',['Serial CEA rise','Suspected local regrowth on DRE / endoscopy / MRI','New lung / liver lesion on CT']),
      ]},
    ],
    footer:{opinion:'required', tier:true, images:true}},
];

/* ============================================================
   NODE FORMS ENGINE — one reusable form component for every node:
   header (owner) + field groups + the fixed footer (Opinion / Tier mark / Images).
   Forms live in the Supplementary tab; saving a form re-populates the linked timeline stop.
   Each form can be filled three ways: pulled from the hospital EMR, uploaded as a document and
   interpreted with AI, or edited manually. EMR / AI-filled fields are flagged until confirmed.
   ============================================================ */
function isoDate(d){ if(!d) return ''; const x = new Date(d); return isNaN(x) ? '' : x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); }
function stripMd(t){ return t==null ? '' : String(t).replace(/\*\*/g,''); }
function formDef(key){ return RECTAL_NODE_FORMS.find(n=>n.key===key); }
function formKeyForStage(stageName){
  const n = RECTAL_NODE_FORMS.find(f=>f.stage===stageName && f.key!=='n12a' && f.key!=='n12b');
  return n ? n.key : null;
}
const FORM_SHORT = {n0:'External records', n1:'Presentation', n2:'Colonoscopy + biopsy', n3:'Pathology', n4:'Rectal MRI', n5:'CT chest / abdomen / pelvis', n6:'CEA', n7:'Molecular / NGS', n8:'Surgical evaluation', n9:'Tier 2 MDT', n10:'Trial box', n11:'Long-course chemoRT', n12:'Consolidation chemo blocks', n12a:'Side-effect panel', n12b:'Picture tab', n13:'Restaging / cCR', n14:'Surveillance dashboard'};
function formShortLabel(def){ return FORM_SHORT[def.key] || def.title; }

/* ---------- seeding: form values taken only from what the source document states ---------- */
const RECTAL_FORM_SEEDS = {
  n0:{referralType:'External hospital', refCenter:'[external center]', imagingModality:'CT',
    documents:['Outside colonoscopy report + stills','Outside biopsy report / slides (flag "for in-house re-read")','Outside imaging — MRI / CT / PET (flag modality)','Discharge / clinic summary (auto-extract to banner)'],
    att:{'Outside colonoscopy report + stills':['[ext] Outside colonoscopy report + stills'], 'Outside biopsy report / slides (flag "for in-house re-read")':['[ext] Outside biopsy slides'], 'Outside imaging — MRI / CT / PET (flag modality)':['[ext] Outside CT'], 'Discharge / clinic summary (auto-extract to banner)':['[ext] Discharge summary']}},
  n1:{symptoms:['PR bleeding','Tenesmus','Narrowed stool caliber'], durationWeeks:'8', redFlags:[], ecog:'0', dreEdge:'5–6', dreOrient:'Anterior', dreCirc:'40', dreMobility:'Tethered', dreTone:'Normal', drePalpable:'Yes'},
  n2:{extent:'Cecum', sync:'None', distVerge:'6', morph:'Fungating', biopsies:'≥6', tattoo:'Yes (distal to lesion)', complication:false},
  n3:{histDx:'Adenocarcinoma', grade:'Moderate (G2)', bgAdenoma:true, blockAdequate:'Yes'},
  n4:{distMm:'60', sphincter:'None', clock:'Anterior', mrT:'T3c (5–15 mm)', emd:'9', mrfDist:'1.6', mrfStatus:'Threatened (≤1 mm)', mrfLoc:'Anterior', mrN:'N1', nodeCount:'2', lateral:false, highRisk:['EMVI positive','EMD ≥5 mm','Involved/threatened CRM']},
  n5:{lung:'No lesion', liver:'No lesion', distantNodes:'Negative', mCat:'M0', baseline:true},
  n6:{cea:'7.1', ceaInterp:'Elevated'},
  n7:{mmr:'pMMR / MSS', kras:'Mutant', krasCodon:'G12V', braf:'WT', her2:'Negative', pi3k:false, banked:'Yes'},
  n8:{edge:'6', orient:'Anterior', mobility:'Tethered', tone:'Normal', margin:'Threatened'},
  n10:{rtDose:'50.4 Gy / 28 fractions, concurrent capecitabine', regimen:'CAPEOX (5 × q3-week cycles)', cycles:'5', ccrSet:'DRE + endoscopy + MRI (NCCN REC-H)', cadence:'NOM schedule (REC-10A)'},
  n11:{dose:'50.4 Gy / 28 fractions', agent:'Capecitabine', completion:'Completed on schedule', proctitis:'1', dermatitis:'1'},
  n13:{dre:'Scar', endoscopy:'White scar', mri:'Fibrosis', cea:'2.1'},
  n14:{endpoint:'Watch-and-wait / NOM (REC-10A)', triggers:[]},
};
function seedRectalForms(c){
  if(c.forms) return;
  const forms = {}, by = 'As documented';
  const stageOf = name => c.timeline.find(t=>t.stage===name);
  RECTAL_NODE_FORMS.forEach(def=>{
    const seed = JSON.parse(JSON.stringify(RECTAL_FORM_SEEDS[def.key] || {}));
    const st = stageOf(def.stage);
    const F = {v:seed, att:seed.att||{}, files:{}, src:{}, gates:{}, tags:{}, confirm:{}, opinion:'', tier:null, images:[], live:false, meta:{status:'signed', by:by, at:st&&st.date?st.date:null}};
    delete F.v.att;
    if(def.key==='n0'){
      const ext = c.externalRecords || {};
      F.v.dateReferred = isoDate(ext.referredDate);
      F.opinion = stripMd(ext.opinion || '');
      F.tier = {tier:1, reason:'intake/verify step — no clinical decision'};
      F.images = [{caption:'Outside colonoscopy stills [ext]', keyImage:false, ext:true, modality:'Endoscopy (rectal mucosa)'},{caption:'Outside CT [ext]', keyImage:false, ext:true, modality:'CT Abdomen'}];
    } else if(st && def.footer){
      if(def.footer.opinion!=='none') F.opinion = stripMd(st.opinion||'');
      if(def.footer.tier && st.tierMark) F.tier = {tier:st.tierMark.tier, reason:stripMd(st.tierMark.reason||'')};
      if(def.footer.images && st.images) F.images = JSON.parse(JSON.stringify(st.images));
    }
    if(def.key==='n6') F.v.ceaDate = isoDate(st && st.date);
    forms[def.key] = F;
  });
  /* Node 9 — the recorded MDT */
  const F9 = forms.n9, thread = c.thread||[], byRole = r => (thread.find(m=>m.author===r)||{}).text || '';
  F9.v = {quorum:['Medical Oncology','Colorectal Surgery','Radiation Oncology','Radiology','Pathology/Molecular','Enterostomal nurse','CNS/coordinator'],
    opRadiology:stripMd(byRole('Radiology')), opPathology:stripMd(byRole('Pathology/Molecular')), opRadOnc:stripMd(byRole('Radiation Oncology')),
    opMedOnc:stripMd(byRole('Medical Oncology (chair)')), opSurgery:stripMd(byRole('Colorectal Surgery')), opNurse:stripMd(byRole('Enterostomal nurse')),
    strategy:'TNT consolidation (organ-preservation intent)', protocolName:'OPRA consolidation arm',
    decision:stripMd([c.decision.plan, c.decision.conditions].join('\n')), alternatives:stripMd(c.decision.alternatives),
    dissent:stripMd((c.mdtRecord.dissent||[]).map(x=>x.role+': '+x.text).join('\n')), contingency:stripMd(c.decision.contingency),
    patientPref:c.mdtRecord.patientPriority||'', ownerName:'Dr. [X]'};
  F9.tags = {tagRadiology:'Agree', tagPathology:'Agree', tagRadOnc:'Agree', tagMedOnc:'Agree', tagSurgery:'Agree', tagNurse:'Agree'};
  F9.opAt = {};
  F9.lock = {at:c.lockedAt, by:c.decision.lockedBy};
  F9.summaryRecorded = [['Stage','cT3c N1b M0'],['Location','6 cm from verge, anterior'],['MRF / EMVI','MRF threatened 1.6 mm, EMVI+'],['Molecular','pMMR/MSS'],['CEA','7.1'],['M-status','No distant disease']];
  /* Node 10 — Trial box, locked with the decision */
  const F10 = forms.n10;
  F10.files = {protocolPdf:'OPRA consolidation arm.pdf'};
  ['rtDose','regimen','cycles','ccrSet','cadence'].forEach(k=>{ F10.confirm[k] = true; });
  F10.confirm.restagingWindow = false;
  F10.lock = {at:c.lockedAt, by:'Case owner (Med Onc)'};
  forms.n11.files = {isodose:'RT plan isodose screenshot'};
  /* Node 12 — per-cycle dose fields (mg are BSA-derived; the source record gives percentages only) */
  forms.n12.cycles = c.chemo.cycles.map(cy=>({plannedMg:'', actualMg:'', reasonCode: cy.n>=3 ? 'Neuropathy' : '', delayDays:String(cy.delayDays||0)}));
  c.forms = forms;
  c.formSeed = JSON.parse(JSON.stringify(RECTAL_FORM_SEEDS));
}

/* ---------- draft state ---------- */
function formDraft(c, key){
  if(!STATE.formDraft) STATE.formDraft = {};
  const id = c.id+'::'+key;
  if(!STATE.formDraft[id]) STATE.formDraft[id] = JSON.parse(JSON.stringify(c.forms[key]));
  return STATE.formDraft[id];
}
function formDirty(c, key){
  const id = c.id+'::'+key;
  return !!(STATE.formDraft && STATE.formDraft[id] && JSON.stringify(STATE.formDraft[id]) !== JSON.stringify(c.forms[key]));
}
function fieldShown(f, v){
  const s = f.show; if(!s) return true;
  const cur = v[s.k];
  if(s.eq!==undefined) return cur===s.eq;
  if(s.in) return s.in.indexOf(cur)>=0;
  if(s.has!==undefined) return Array.isArray(cur) && cur.indexOf(s.has)>=0;
  if(s.on) return !!cur;
  return true;
}
function visibleFields(def, d){
  const out = [];
  def.groups.forEach(g=>{
    if(g.gate && !(d.gates && d.gates[g.gate])) return;
    (g.fields||[]).forEach(f=>{ if(fieldShown(f, d.v)) out.push(f); });
  });
  return out;
}
function isFilled(v){ return Array.isArray(v) ? v.length>0 : (v!==undefined && v!==null && v!=='' && v!==false); }

/* ---------- auto-derived values (never double-entered) ---------- */
function deriveLE(v){
  const n = (v.leCriteria||[]).length;
  return n===8 ? {ok:true, text:'LE-eligible'} : {ok:false, text:'Not eligible ('+n+' of 8 criteria ticked)'};
}
/* ---------- rendering ---------- */
function nfId(c, key, k){ return c.id+'::'+key+'::'+k; }
function srcBadge(d, k){
  const s = d.src && d.src[k];
  return s ? ' <span class="chip" style="font-size:9.5px;padding:1px 6px;background:var(--gold-soft);color:var(--gold-strong);border-color:transparent;">'+icon('sparkle',10)+s+' · verify</span>' : '';
}
function renderNodeField(c, def, f, d, locked){
  const key = def.key, dis = locked ? ' disabled' : '';
  const id = nfId(c, key, f.k);
  const label = '<label>'+withCites(f.label)+srcBadge(d, f.k)+'</label>';
  const hint = f.hint ? '<div style="font-size:10.5px;color:var(--ink-faint);margin-top:3px;">'+withCites(f.hint)+'</div>' : '';
  const val = d.v[f.k];
  let flag = '';
  if(f.flagWhen){
    const w = f.flagWhen, hit = w.eq!==undefined ? val===w.eq : w.in ? w.in.indexOf(val)>=0 : w.on ? !!val : false;
    if(hit) flag = '<div style="margin-top:5px;"><span class="badge '+(w.tone==='crit'?'badge-tier3':'badge-gold')+'" style="white-space:normal;height:auto;line-height:1.35;padding:3px 10px;">'+icon('flag',11)+'&nbsp;'+withCites(w.text)+'</span></div>';
  }
  if(f.t==='select'){
    return '<div class="field">'+label+'<select data-nf="'+id+'"'+dis+'><option value="">—</option>'+f.options.map(o=>'<option value="'+esc(o)+'" '+(val===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select>'+hint+flag+'</div>';
  }
  if(f.t==='text'){
    return '<div class="field">'+label+'<input type="text" '+(f.num?'inputmode="decimal" ':'')+'data-nf="'+id+'" value="'+esc(val==null?'':val)+'"'+dis+'>'+hint+flag+'</div>';
  }
  if(f.t==='date'){
    return '<div class="field">'+label+'<input type="date" data-nf="'+id+'" value="'+esc(val||'')+'"'+dis+'>'+hint+'</div>';
  }
  if(f.t==='longtext'){
    const tag = f.tag ? '<select data-nf="'+nfId(c,key,f.tag)+'"'+dis+' style="margin-top:6px;max-width:170px;"><option value="">Tag: —</option><option '+(d.tags[f.tag]==='Agree'?'selected':'')+'>Agree</option><option '+(d.tags[f.tag]==='Dissent'?'selected':'')+'>Dissent</option></select>' : '';
    return '<div class="field" style="grid-column:1/-1;">'+label+'<textarea rows="'+(f.rows||3)+'" data-nf="'+id+'"'+dis+' style="width:100%;">'+esc(val||'')+'</textarea>'+tag+hint+'</div>';
  }
  if(f.t==='check'){
    return '<div style="align-self:end;"><label class="checkline"><input type="checkbox" data-nf-check="'+id+'" '+(val?'checked':'')+dis+'> '+withCites(f.label)+srcBadge(d, f.k)+'</label>'+flag+'</div>';
  }
  if(f.t==='multi'){
    const cur = Array.isArray(val) ? val : [];
    return '<div class="field" style="grid-column:1/-1;">'+label+'<div style="display:flex;flex-wrap:wrap;gap:6px 16px;">'+
      f.options.map(o=>{
        const on = cur.indexOf(o)>=0, files = (d.att && d.att[o]) || [];
        return '<div style="display:flex;flex-direction:column;gap:4px;min-width:200px;"><label class="checkline"><input type="checkbox" data-nf-multi="'+id+'::'+esc(o)+'" '+(on?'checked':'')+dis+'> '+esc(o)+'</label>'+
          (f.attach && on ? '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding-left:22px;">'+files.map(fn=>'<span class="chip" style="font-size:10.5px;">'+icon('assessment',10)+' '+esc(fn)+' <span style="color:var(--gold-strong);">'+icon('sparkle',10)+' auto-parsed</span></span>').join('')+
            (locked ? '' : '<label class="btn btn-ghost btn-sm" style="cursor:pointer;padding:2px 8px;">'+icon('download',12)+' 📎 Upload<input type="file" style="display:none;" data-nf-attach="'+id+'::'+esc(o)+'"></label>')+'</div>' : '')+
        '</div>';
      }).join('')+'</div>'+flag+'</div>';
  }
  if(f.t==='file'){
    const fn = (d.files && d.files[f.k]) || '';
    return '<div class="field" style="grid-column:1/-1;">'+label+'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'+
      (fn && f.k==='protocolPdf' ? lightboxThumb(TRIAL_PROTOCOL_PREVIEW.file, TRIAL_PROTOCOL_PREVIEW.caption, 70, 98) : '')+
      (fn && f.k==='isodose' ? lightboxThumb('images/rt-isodose-imrt-1.jpeg', 'RT plan isodose (1 of 2)', 96, 72)+lightboxThumb('images/rt-isodose-imrt-2.jpeg', 'RT plan isodose (2 of 2)', 96, 72) : '')+
      (fn ? '<span class="chip" style="font-size:11px;">'+icon('assessment',11)+' '+esc(fn)+'</span>' : '<span style="font-size:12px;color:var(--ink-faint);">No file attached.</span>')+
      (locked ? '' : '<label class="btn btn-secondary btn-sm" style="cursor:pointer;">'+icon('download',13)+' 📎 Upload<input type="file" style="display:none;" data-nf-file="'+id+'"></label>')+'</div></div>';
  }
  if(f.t==='readonly'){
    return '';
  }
  if(f.t==='verifyEach'){
    const docs = Array.isArray(d.v[f.of]) ? d.v[f.of] : [], st = d.verify || {};
    return '<div class="field" style="grid-column:1/-1;">'+label+(docs.length ? docs.map(o=>'<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px;"><span style="flex:1;min-width:220px;font-size:12.5px;">'+esc(o)+'</span><select data-nf-verify="'+id+'::'+esc(o)+'"'+dis+' style="max-width:280px;"><option value="">—</option>'+f.options.map(x=>'<option value="'+esc(x)+'" '+(st[o]===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>').join('') : '<div style="font-size:12px;color:var(--ink-faint);margin-top:4px;">Tick the documents that are present above.</div>')+'</div>';
  }
  return '';
}
function shortOpt(v){ return v==null ? '' : String(v).replace(/\s*\([^)]*\)/g,'').trim(); }
/* Auto-imported case summary (read-only, pulled from Nodes 1–8): exactly the six items the proforma
   names — stage, location, MRF/EMVI, molecular, CEA, M-status. For a locked MDT this is the summary
   as it was read into the record (worded as in the source document); while a MDT is still open it is
   derived live from the node forms. */
function mdtCaseSummary(c, d){ return (d && d.summaryRecorded) || []; }
/* Round-table specialists: a chat-style thread — colour-coded avatar per specialty, message bubble,
   Agree / Dissent tag, timestamp. Editable while the MDT is open, read-only once locked. */
const MDT_SPECIALISTS = [
  {op:'opRadiology', tag:'tagRadiology', label:'Radiology', dept:'Radiology', quorum:'Radiology', initials:'RD'},
  {op:'opPathology', tag:'tagPathology', label:'Pathology/Molecular', dept:'Pathology / Molecular', quorum:'Pathology/Molecular', initials:'PM'},
  {op:'opRadOnc', tag:'tagRadOnc', label:'Radiation Oncology', dept:'Radiation Oncology', quorum:'Radiation Oncology', initials:'RO'},
  {op:'opMedOnc', tag:'tagMedOnc', label:'Medical Oncology', dept:'Medical Oncology', quorum:'Medical Oncology', initials:'MO'},
  {op:'opSurgery', tag:'tagSurgery', label:'Surgery', dept:'Colorectal Surgery', quorum:'Colorectal Surgery', initials:'CS'},
  {op:'opNurse', tag:'tagNurse', label:'Nurse', dept:'Enterostomal Nurse', quorum:'Enterostomal nurse', initials:'EN'},
];
function mdtTagChip(tag){
  if(tag==='Agree') return '<span class="badge badge-tier1">'+icon('check',11)+' Agree</span>';
  if(tag==='Dissent') return '<span class="badge badge-tier3">'+icon('alert',11)+' Dissent</span>';
  return '<span class="badge badge-neutral">Not tagged</span>';
}
function mdtTagPills(cid, key, sp, cur, locked){
  const pill = (v, col, ic) => {
    const on = cur===v;
    return '<button type="button" data-nf-tag="'+cid+'::'+key+'::'+sp.tag+'::'+v+'"'+(locked?' disabled':'')+' style="all:unset;box-sizing:border-box;cursor:'+(locked?'default':'pointer')+';display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border-radius:999px;font-size:11.5px;font-weight:700;border:1px solid '+(on?col:'var(--border-strong)')+';background:'+(on?col:'transparent')+';color:'+(on?'#fff':'var(--ink-muted)')+';">'+icon(ic,11)+v+'</button>';
  };
  return pill('Agree','var(--good)','check')+pill('Dissent','var(--crit)','alert');
}
function mdtDiscussion(items){
  return '<div style="position:relative;display:flex;flex-direction:column;gap:16px;">'+
    '<div style="position:absolute;left:17px;top:20px;bottom:20px;width:2px;background:var(--border);"></div>'+
    items.map(it=>{
      const d = deptColor(it.sp.dept), dissent = it.tag==='Dissent', edge = dissent ? 'var(--crit)' : d.c;
      return '<div style="position:relative;display:flex;gap:12px;align-items:flex-start;">'+
        '<div title="'+(it.present?'Present in quorum':'Not ticked in quorum')+'" style="width:36px;height:36px;border-radius:50%;background:'+d.bg+';color:'+d.c+';border:2px solid '+(it.present?'var(--good)':'var(--border-strong)')+';display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;z-index:1;">'+esc(it.sp.initials)+'</div>'+
        '<div style="flex:1;min-width:0;">'+
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;min-height:26px;">'+
            '<strong style="font-size:13.5px;color:'+d.c+';">'+esc(it.sp.label)+'</strong>'+
            (it.present ? '' : '<span style="font-size:10.5px;color:var(--warn-ink);background:var(--warn-soft);padding:1px 7px;border-radius:999px;">not in quorum</span>')+
            '<span style="font-size:11px;color:var(--ink-faint);">'+it.at+'</span>'+
            '<span style="margin-left:auto;display:flex;gap:6px;flex-wrap:wrap;">'+it.tagHtml+'</span></div>'+
          '<div style="border:1px solid color-mix(in srgb, '+edge+' 35%, transparent);border-left:4px solid '+edge+';border-radius:4px 16px 16px 16px;background:color-mix(in srgb, '+edge+' 8%, var(--surface));padding:11px 15px;">'+it.body+'</div>'+
        '</div></div>';
    }).join('')+
  '</div>';
}
function mdtConsensus(items){
  const a = items.filter(i=>i.tag==='Agree').length, x = items.filter(i=>i.tag==='Dissent').length, u = items.length-a-x;
  const seg = (n, col) => n ? '<div style="flex:'+n+';background:'+col+';"></div>' : '';
  return '<div style="display:flex;flex-direction:column;gap:6px;">'+
    '<div style="display:flex;height:8px;border-radius:999px;overflow:hidden;background:var(--border);">'+seg(a,'var(--good)')+seg(x,'var(--crit)')+seg(u,'var(--border-strong)')+'</div>'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--ink-muted);">'+
      '<span><strong style="color:var(--good);">'+a+'</strong> agree</span><span><strong style="color:'+(x?'var(--crit)':'var(--ink-faint)')+';">'+x+'</strong> dissent</span>'+(u?'<span><strong>'+u+'</strong> not tagged</span>':'')+
      '<span style="margin-left:auto;">'+items.length+' specialist opinions</span></div></div>';
}
function mdtOpinionItems(c, d, locked, key){
  return MDT_SPECIALISTS.map(sp=>{
    const text = (d.v[sp.op]||''), tag = (d.tags && d.tags[sp.tag]) || '';
    const at = (d.opAt && d.opAt[sp.op]) ? fmtDateTime(new Date(d.opAt[sp.op])) : (text ? '' : 'not yet recorded');
    const body = locked
      ? '<div style="font-size:13.5px;line-height:1.7;white-space:pre-line;">'+withCites(text)+'</div>'
      : '<textarea rows="3" data-nf="'+c.id+'::'+key+'::'+sp.op+'" placeholder="'+esc(sp.label)+' opinion…" style="width:100%;border:none;outline:none;background:transparent;resize:vertical;font:inherit;font-size:13.5px;line-height:1.7;min-height:66px;">'+esc(text)+'</textarea>';
    return {sp, tag, at, body, present:(d.v.quorum||[]).indexOf(sp.quorum)>=0,
      tagHtml: locked ? mdtTagChip(tag) : mdtTagPills(c.id, key, sp, tag, false)};
  });
}
function renderMdtDiscussionForm(c, d, locked, key){
  const items = mdtOpinionItems(c, d, locked, key);
  const dissenters = items.filter(i=>i.tag==='Dissent').map(i=>i.sp.label);
  return mdtConsensus(items)+
    (dissenters.length ? toneCallout('red', icon('alert',14)+'<span><strong>Dissent recorded by name:</strong> '+dissenters.map(esc).join(', ')+' — kept in the record below, not smoothed over.</span>') : '')+
    mdtDiscussion(items)+
    (locked ? mdtDisabledComposer() : '');
}
/* Shown under a locked round-table: how a specialist enters an opinion (disabled — the record is locked). */
function mdtDisabledComposer(){
  const pill = (t, ic) => '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border-radius:999px;font-size:11.5px;font-weight:700;border:1px solid var(--border-strong);color:var(--ink-faint);">'+icon(ic,11)+t+'</span>';
  return '<div style="border:1px dashed var(--border-strong);border-radius:12px;background:var(--surface-2);padding:12px 14px;display:flex;flex-direction:column;gap:9px;opacity:.9;">'+
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);">Add a specialist opinion</div>'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><select disabled style="max-width:230px;"><option>Select specialty…</option></select>'+pill('Agree','check')+pill('Dissent','alert')+'</div>'+
    '<textarea disabled rows="3" style="width:100%;" placeholder="The specialist types their opinion here, in their own words. It is attributed and timestamped when recorded."></textarea>'+
    '<div><button class="btn btn-secondary btn-sm" disabled>Record opinion</button></div></div>';
}
/* Read-only version for the timeline stop (uses the Node 9 record when present, else the round-table thread). */
function mdtDiscussionReadonly(c){
  const F = c.forms && c.forms.n9;
  if(F) return mdtConsensus(mdtOpinionItems(c, F, true, 'n9'))+mdtDiscussion(mdtOpinionItems(c, F, true, 'n9'));
  return '';
}
function renderMdtAutoSummary(c, d){
  return '<div class="grid grid-3" style="gap:0 20px;">'+mdtCaseSummary(c, d).map(r=>kv(r[0], r[1])).join('')+'</div>';
}
function renderChemoBlocksForm(c, d, locked){
  const ch = c.chemo, dis = locked ? ' disabled' : '';
  const rows = ch.cycles.map((cy,i)=>{
    const x = d.cycles[i];
    const p = parseFloat(x.plannedMg), a = parseFloat(x.actualMg);
    const rdi = (p>0 && !isNaN(a)) ? Math.round(a/p*100) : cy.rdiNum;
    const flag = rdi!=null && rdi < ch.rdiFlagBelow;
    const ref = c.id+'::n12::'+i;
    return '<tr><td style="font-weight:700;">C'+cy.n+'</td>'+
      '<td><input type="text" inputmode="decimal" data-nf-cyc="'+ref+'::plannedMg" value="'+esc(x.plannedMg)+'" style="width:100px;"'+dis+'></td>'+
      '<td><input type="text" inputmode="decimal" data-nf-cyc="'+ref+'::actualMg" value="'+esc(x.actualMg)+'" style="width:100px;"'+dis+'></td>'+
      '<td><input type="text" data-nf-cyc="'+ref+'::reasonCode" value="'+esc(x.reasonCode)+'" style="width:130px;"'+dis+'></td>'+
      '<td><input type="text" inputmode="numeric" data-nf-cyc="'+ref+'::delayDays" value="'+esc(x.delayDays)+'" style="width:70px;"'+dis+'></td>'+
      '<td>'+(rdi==null ? '—' : rdi+'%')+(flag ? ' <span class="badge badge-tier3">&lt;'+ch.rdiFlagBelow+'%</span>' : '')+' <span class="chip" style="font-size:9.5px;padding:1px 6px;">auto</span></td></tr>';
  }).join('');
  return '<div class="table-wrap chemo-tight"><table><thead><tr><th>Cycle</th><th>Planned mg (BSA)</th><th>Actual mg</th><th>Reduction/hold reason code</th><th>Delay days</th><th>RDI</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
function renderChemoFormPart(c, part){
  const ch = c.chemo;
  const active = Math.max(0, Math.min(STATE.chemoActive && STATE.chemoActive[c.id]!=null ? STATE.chemoActive[c.id] : ch.cycles.length-1, ch.cycles.length-1));
  const chips = '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-faint);margin-right:6px;">Cycle</span>'+
    ch.cycles.map((cy,i)=>'<button class="chip" data-chemo-cycle="'+c.id+'::'+i+'" style="cursor:pointer;font-size:12px;padding:4px 12px;'+(i===active?'background:var(--accent);color:#fff;border-color:transparent;font-weight:700;':'')+'">C'+cy.n+'</button>').join('')+'</div>';
  return '<div id="chemoForm'+part+'-'+c.id+'" style="display:flex;flex-direction:column;gap:14px;">'+chips+
    (part==='12a' ? renderChemoSideEffects(c, active, true) : renderChemoPhotos(c, active, true))+'</div>';
}
function renderNodeFooter(c, def, d, locked){
  const ft = def.footer || {}, key = def.key, dis = locked ? ' disabled' : '';
  if(ft.opinion==='none' && !ft.tier && !ft.images) return ft.note ? '<div style="font-size:12px;color:var(--ink-muted);">'+esc(ft.note)+'</div>' : '';
  const block = (title, body) => '<div style="border:1px solid var(--border);border-radius:10px;background:var(--surface);padding:12px 14px;display:flex;flex-direction:column;gap:8px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);">'+title+'</div>'+body+'</div>';
  const out = [];
  if(ft.opinion && ft.opinion!=='none'){
    out.push(block('Opinion'+(ft.opinion==='required' ? ' (required'+(ft.opinionLabel?' — '+esc(ft.opinionLabel.replace(/^required — /,'')):'')+')' : ' (optional)')+' · specialist’s own words',
      '<textarea rows="4" data-nf-opinion="'+c.id+'::'+key+'"'+dis+' style="width:100%;">'+esc(d.opinion||'')+'</textarea>'));
  }
  if(ft.tier){
    const t = d.tier || {};
    out.push(block('Tier mark'+(ft.tierNote?' '+esc(ft.tierNote):''),
      '<div class="nf-fields"><div class="field"><label>Tier</label><select data-nf-tier="'+c.id+'::'+key+'"'+dis+'><option value="">—</option>'+
        '<option value="1" '+(t.tier===1?'selected':'')+'>Tier 1 (guideline-concordant, my part)</option><option value="2" '+(t.tier===2?'selected':'')+'>Tier 2 (raise for discussion)</option></select></div></div>'+
      '<div class="field"><label>Reason'+(t.tier===2?' (required for Tier 2)':'')+'</label><input type="text" data-nf-tier-reason="'+c.id+'::'+key+'" value="'+esc(t.reason||'')+'"'+dis+'></div>'));
  }
  if(ft.images){
    const list = (d.images||[]).map((im,i)=>'<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;"><span style="flex:1;">'+(im.keyImage?'★ ':'')+esc(im.caption)+(im.ext?' <span class="chip" style="font-size:9.5px;">[ext] read-only</span>':'')+'</span>'+
      (locked ? '' : '<button class="btn btn-ghost btn-sm" data-nf-rm-image="'+c.id+'::'+key+'::'+i+'">'+icon('x',12)+'</button>')+'</div>').join('');
    out.push(block('Images / Key visuals',
      (ft.imagesHint ? '<div style="font-size:11.5px;color:var(--ink-muted);">'+esc(ft.imagesHint)+'</div>' : '')+
      (ft.imagesNote ? '<div style="font-size:11.5px;color:var(--ink-muted);">'+esc(ft.imagesNote)+'</div>' : '')+
      (list || '<div style="font-size:12px;color:var(--ink-faint);">No images attached yet.</div>')+
      (locked ? '' : '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;">'+
        '<div class="field" style="flex:1;min-width:180px;"><label>Caption</label><input type="text" id="nfImgCap" placeholder="Caption"></div>'+
        '<label class="checkline"><input type="checkbox" id="nfImgKey"> ★ Key image</label>'+
        '<label class="btn btn-secondary btn-sm" style="cursor:pointer;">'+icon('download',13)+' 📎 Attach<input type="file" id="nfImgFile" style="display:none;"></label>'+
        '<button class="btn btn-ghost btn-sm" data-nf-add-image="'+c.id+'::'+key+'">'+icon('plus',13)+' Add another</button></div>')));
  } else if(ft.imagesText){
    out.push(block('Images / Key visuals', '<div style="font-size:12.5px;color:var(--ink-muted);">'+esc(ft.imagesText)+'</div>'));
  }
  if(ft.note) out.push('<div style="font-size:12px;color:var(--ink-muted);">'+esc(ft.note)+'</div>');
  return out.join('');
}
function renderNodeForm(c, key){
  const def = formDef(key), d = formDraft(c, key), saved = c.forms[key];
  const isLocked = !!saved.lock, locked = isLocked;
  const errs = (STATE.formErrors && STATE.formErrors[c.id+'::'+key]) || [];
  const srcBar = key==='n9' ? '' :
    '<div style="border:1px solid var(--border);border-radius:10px;background:var(--surface-2);padding:10px 14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'+
      '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-muted);margin-right:4px;">Fill this form</span>'+
      '<button class="btn btn-secondary btn-sm" data-nf-pull-emr="'+c.id+'::'+key+'" '+(locked?'disabled':'')+'>'+icon('download',13)+' Pull from EMR</button>'+
      '<label class="btn btn-secondary btn-sm" style="cursor:pointer;'+(locked?'opacity:.5;pointer-events:none;':'')+'">'+icon('sparkle',13)+' Upload document · interpret with AI<input type="file" style="display:none;" data-nf-upload="'+c.id+'::'+key+'"></label>'+
      '<button class="btn btn-secondary btn-sm" data-nf-manual="'+c.id+'::'+key+'" '+(locked?'disabled':'')+'>'+icon('assessment',13)+' Edit manually</button>'+
      ((locked || def.kind==='chemoSide' || def.kind==='chemoPhotos') ? '' : '<button class="btn btn-ghost btn-sm" data-nf-clear="'+c.id+'::'+key+'" style="margin-left:auto;">Clear form</button>')+
    '</div>';
  const groups = def.groups.map(g=>{
    if(g.gate){
      const on = !!(d.gates && d.gates[g.gate]);
      const toggle = '<label class="checkline"><input type="checkbox" data-nf-gate="'+c.id+'::'+key+'::'+g.gate+'" '+(on?'checked':'')+(locked?' disabled':'')+'> Specimen is a polypectomy / local excision</label>';
      if(!on) return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:6px;"><div style="font-size:13px;font-weight:700;">'+withCites(g.title)+'</div>'+toggle+'</div>';
      return groupCard(c, def, g, d, locked, toggle);
    }
    return groupCard(c, def, g, d, locked, '');
  }).join('');
  const special =
    def.kind==='mdt' ? '' :
    def.kind==='chemoBlocks' ? '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+renderChemoBlocksForm(c, d, locked)+'</div>' :
    def.kind==='chemoSide' ? renderChemoFormPart(c,'12a') :
    def.kind==='chemoPhotos' ? renderChemoFormPart(c,'12b') : '';
  const flags = [];
  if(key==='n1' && (d.v.redFlags||[]).length) flags.push(toneCallout('red', icon('alert',14)+'<span><strong>Red flag ticked</strong> — same-day / urgent pathway: '+d.v.redFlags.map(esc).join(' · ')+'.</span>'));
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">'+
      '<div><h3 style="margin:0;">'+esc(def.title)+'</h3><div style="font-size:12.5px;font-weight:700;margin-top:4px;">Owner: '+esc(def.owner)+'</div></div>'+
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'+
        (isLocked ? '<span class="badge badge-locked">'+icon('lock',11)+' Locked '+fmtDate(saved.lock.at)+'</span>' :
          '<span class="badge badge-tier1">'+icon('check',11)+' As documented</span>')+
        '<button class="btn btn-ghost btn-sm" data-snapshot-jump="'+c.id+'::'+stageIndexByName(c, def.stage)+'">'+icon('chevronRight',12)+' View on timeline</button>'+
      '</div></div>'+
    (def.intro ? '<div style="font-size:12.5px;line-height:1.55;color:var(--ink-muted);">'+withCites(def.intro)+'</div>' : '')+
    srcBar+
    (errs.length ? toneCallout('red', icon('alert',14)+'<span><strong>Cannot sign yet:</strong><br>'+errs.map(esc).join('<br>')+'</span>') : '')+
    flags.join('')+
    groups+special+
    renderNodeFooter(c, def, d, locked)+
    (isLocked
      ? '<div class="callout callout-info" style="display:flex;align-items:center;gap:8px;">'+icon('lock',14)+' Locked '+fmtDateTime(saved.lock.at)+' · '+esc(saved.lock.by)+'.</div>'
      : '<div><button class="btn btn-ghost" data-nf-discard="'+c.id+'::'+key+'">Reset form</button></div>')+
  '</div>';
}
function groupCard(c, def, g, d, locked, toggleHtml){
  const fields = (g.fields||[]).filter(f=>fieldShown(f, d.v));
  const hasGrid = fields.length>0;
  let extra = '';
  if(g.badge==='highrisk' && (d.v.highRisk||[]).length) extra = toneCallout('red', icon('alert',14)+'<span><strong>High-risk features:</strong> '+d.v.highRisk.map(esc).join(' · ')+'</span>');
  if(g.badge==='le'){ const le = deriveLE(d.v); extra = toneCallout(le.ok?'green':'red', icon(le.ok?'checkCircle':'x',14)+'<span><strong>'+esc(le.text)+'</strong></span>'); }
  if(g.summary) extra = renderMdtAutoSummary(c, d);
  if(g.figure==='strategyTree') extra = strategyTreeFigure();
  const flagged = g.flag==='redflag' && (d.v.redFlags||[]).length;
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:12px;'+(flagged?'border-color:var(--crit);':'')+'">'+
    '<div style="font-size:13px;font-weight:700;">'+withCites(g.title)+'</div>'+
    toggleHtml+
    (g.discussion ? renderMdtDiscussionForm(c, d, locked, def.key) : (hasGrid ? '<div class="nf-fields">'+fields.map(f=>renderNodeField(c, def, f, d, locked)).join('')+'</div>' : ''))+
    extra+
    (g.confirm ? renderParamConfirm(c, def, g, d, locked) : '')+
    (g.note ? '<div style="font-size:11.5px;color:var(--ink-muted);line-height:1.5;">'+withCites(g.note)+'</div>' : '')+
  '</div>';
}
function renderParamConfirm(c, def, g, d, locked){
  return '<div style="display:flex;flex-wrap:wrap;gap:6px 14px;">'+g.fields.map(f=>'<label class="checkline" style="font-size:12px;"><input type="checkbox" data-nf-confirm="'+c.id+'::'+def.key+'::'+f.k+'" '+(d.confirm[f.k]?'checked':'')+(locked?' disabled':'')+'> Confirm — '+esc(f.label)+'</label>').join('')+'</div>';
}
function renderTabForms(c){
  if(!STATE.formNode) STATE.formNode = {};
  const key = STATE.formNode[c.id] || 'n0';
  const nav = RECTAL_NODE_FORMS.map(def=>{
    const F = c.forms[def.key], sel = def.key===key;
    const dirty = formDirty(c, def.key);
    return '<button data-nf-node="'+c.id+'::'+def.key+'" style="all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;width:100%;'+(sel?'background:var(--accent-soft);':'')+'">'+
      '<span style="min-width:30px;height:22px;border-radius:11px;background:'+(sel?'var(--accent)':'var(--surface-2)')+';color:'+(sel?'#fff':'var(--ink-muted)')+';font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 6px;">'+esc(def.num)+'</span>'+
      '<span style="flex:1;font-size:12.5px;'+(sel?'font-weight:700;':'')+'line-height:1.35;">'+esc(formShortLabel(def))+'</span>'+
      (F.lock ? '<span style="color:var(--ink-faint);display:inline-flex;">'+icon('lock',12)+'</span>' : dirty ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--gold);"></span>' : '<span style="color:var(--good);display:inline-flex;">'+icon('check',13)+'</span>')+
    '</button>';
  }).join('');
  return '<div class="callout callout-info" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:14px;">'+icon('alert',14)+'<span><strong>Representational view.</strong> These forms show how each node is captured. Nothing entered here is saved, and the timeline and the case record are not changed.</span></div>'+
    '<div class="nf-layout" style="display:grid;grid-template-columns:260px minmax(0,1fr);gap:18px;align-items:start;">'+
    '<div class="card card-pad" style="padding:10px;display:flex;flex-direction:column;gap:2px;position:sticky;top:12px;">'+
      '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);padding:4px 10px 8px;">Node forms</div>'+nav+'</div>'+
    '<div id="nfPane-'+c.id+'" style="min-width:0;">'+renderNodeForm(c, key)+'</div>'+
  '</div>';
}
function refreshForm(cid){
  const c = findCase(cid), pane = document.getElementById('nfPane-'+cid);
  if(!c || !pane) return;
  pane.innerHTML = renderNodeForm(c, (STATE.formNode && STATE.formNode[cid]) || 'n0');
}

/* ---------- EMR pull / AI interpretation (simulated agents; nothing is final until reviewed) ---------- */
function applyFormSource(c, key, source){
  const d = formDraft(c, key), seed = (c.formSeed && c.formSeed[key]) || {};
  let n = 0;
  if(key==='n12'){ d.cycles = JSON.parse(JSON.stringify(c.forms.n12.cycles)); return d.cycles.length*3; }
  if(key==='n12a') return c.chemo.cycles.reduce((a,cy)=>a+cy.toxicities.length, 0);
  if(key==='n12b') return c.chemo.cycles.reduce((a,cy)=>a+(cy.photos||[]).length, 0);
  Object.keys(seed).forEach(k=>{
    if(k==='att'){ Object.assign(d.att, JSON.parse(JSON.stringify(seed.att))); return; }
    d.v[k] = JSON.parse(JSON.stringify(seed[k])); d.src[k] = source; n++;
  });
  if(key==='n0'){ d.v.dateReferred = (c.forms.n0.v.dateReferred); d.src.dateReferred = source; }
  if(key==='n6'){ d.v.ceaDate = c.forms.n6.v.ceaDate; d.src.ceaDate = source; }
  return n;
}
function startFormSource(cid, key, source, fileName){
  const c = findCase(cid), def = formDef(key); if(!c) return;
  const steps = source==='EMR' ? [
    {label:'EMR Connector Agent', detail:'Looking up patient record '+c.patient.mrn+' in the hospital EMR / LIS / RIS…'},
    {label:'Extraction Agent', detail:'Reading the fields for “'+formShortLabel(def)+'” from the chart…'},
    {label:'Handoff for Verification', detail:'Routing fetched fields to the clinician for mandatory review…'},
  ] : [
    {label:'Document Intake Agent', detail:'Reading “'+fileName+'”…'},
    {label:'Interpretation Agent', detail:'Mapping the document to the “'+formShortLabel(def)+'” pick-lists…'},
    {label:'Handoff for Verification', detail:'Flagging every AI-filled field for the clinician to confirm…'},
  ];
  openAgentPipeline(source==='EMR' ? 'Pulling from Hospital EMR' : 'Interpreting with AI', steps, ()=>{
    const n = applyFormSource(c, key, source);
    STATE.formNode[cid] = key;
    renderPage();
    toast('Demo '+(source==='EMR'?'EMR pull':'AI interpretation')+' — '+n+' field'+(n===1?'':'s')+' filled and flagged for review. In production this would be parsed via HL7/FHIR feeds or OCR/NLP.');
  }, 'Review in the form');
}

/* ---------- validation, save, timeline link ---------- */
/* ---------- input plumbing ---------- */
function nfSet(c, key, k, value){
  const d = formDraft(c, key);
  if(key==='n9' && /^op[A-Z]/.test(k)){ d.opAt = d.opAt || {}; d.opAt[k] = new Date().toISOString(); }
  if(k in (d.tags||{}) || /^tag[A-Z]/.test(k)) d.tags[k] = value; else d.v[k] = value;
  if(d.src) delete d.src[k];
}
function handleFormChange(t){
  const parse = attr => t.getAttribute(attr).split('::');
  if(t.hasAttribute('data-nf')){
    const [cid,key,k] = parse('data-nf'), c = findCase(cid); if(!c) return true;
    nfSet(c, key, k, t.value);
    if(t.tagName==='SELECT' || (key==='n9' && /^op[A-Z]/.test(k))) refreshForm(cid);
    return true;
  }
  if(t.hasAttribute('data-nf-verify')){
    const [cid,key,k,opt] = parse('data-nf-verify'), c = findCase(cid); if(!c) return true;
    const d = formDraft(c, key); d.verify = d.verify || {}; d.verify[opt] = t.value; return true;
  }
  if(t.hasAttribute('data-nf-check')){
    const [cid,key,k] = parse('data-nf-check'), c = findCase(cid); if(!c) return true;
    nfSet(c, key, k, t.checked); refreshForm(cid); return true;
  }
  if(t.hasAttribute('data-nf-multi')){
    const [cid,key,k,opt] = parse('data-nf-multi'), c = findCase(cid); if(!c) return true;
    const d = formDraft(c, key), cur = Array.isArray(d.v[k]) ? d.v[k].slice() : [];
    const i = cur.indexOf(opt);
    if(t.checked && i<0) cur.push(opt); if(!t.checked && i>=0) cur.splice(i,1);
    d.v[k] = cur; if(d.src) delete d.src[k];
    refreshForm(cid); return true;
  }
  if(t.hasAttribute('data-nf-gate')){
    const [cid,key,g] = parse('data-nf-gate'), c = findCase(cid); if(!c) return true;
    const d = formDraft(c, key); d.gates[g] = t.checked; refreshForm(cid); return true;
  }
  if(t.hasAttribute('data-nf-confirm')){
    const [cid,key,k] = parse('data-nf-confirm'), c = findCase(cid); if(!c) return true;
    formDraft(c, key).confirm[k] = t.checked; return true;
  }
  if(t.hasAttribute('data-nf-opinion')){
    const [cid,key] = parse('data-nf-opinion'), c = findCase(cid); if(c) formDraft(c, key).opinion = t.value; return true;
  }
  if(t.hasAttribute('data-nf-tier')){
    const [cid,key] = parse('data-nf-tier'), c = findCase(cid); if(!c) return true;
    const d = formDraft(c, key); d.tier = {tier: t.value ? Number(t.value) : null, reason:(d.tier && d.tier.reason) || ''}; refreshForm(cid); return true;
  }
  if(t.hasAttribute('data-nf-tier-reason')){
    const [cid,key] = parse('data-nf-tier-reason'), c = findCase(cid); if(!c) return true;
    const d = formDraft(c, key); d.tier = d.tier || {tier:null, reason:''}; d.tier.reason = t.value; return true;
  }
  if(t.hasAttribute('data-nf-cyc')){
    const [cid,key,i,k] = parse('data-nf-cyc'), c = findCase(cid); if(!c) return true;
    formDraft(c, key).cycles[Number(i)][k] = t.value; if(t.tagName==='SELECT' || k!=='reasonCode') refreshForm(cid); return true;
  }
  if(t.hasAttribute('data-nf-attach')){
    const [cid,key,k,opt] = parse('data-nf-attach'), c = findCase(cid); if(!c) return true;
    const f = t.files && t.files[0]; if(!f) return true;
    const d = formDraft(c, key); (d.att[opt] = d.att[opt] || []).push(f.name); refreshForm(cid); toast('“'+f.name+'” attached — auto-parse queued (demo).'); return true;
  }
  if(t.hasAttribute('data-nf-file')){
    const [cid,key,k] = parse('data-nf-file'), c = findCase(cid); if(!c) return true;
    const f = t.files && t.files[0]; if(!f) return true;
    formDraft(c, key).files[k] = f.name; refreshForm(cid); return true;
  }
  if(t.hasAttribute('data-nf-upload')){
    const [cid,key] = parse('data-nf-upload'), f = t.files && t.files[0]; if(!f) return true;
    startFormSource(cid, key, 'AI', f.name); t.value = ''; return true;
  }
  return false;
}
function handleFormClick(t){
  const parse = el => el.getAttribute.bind(el);
  let el;
  if((el = t.closest('[data-nf-node]'))){ const [cid,key] = el.getAttribute('data-nf-node').split('::'); STATE.formNode[cid] = key; STATE.formErrors && delete STATE.formErrors[cid+'::'+key]; renderPage(); return true; }
  if((el = t.closest('[data-nf-pull-emr]'))){ if(el.disabled) return true; const [cid,key] = el.getAttribute('data-nf-pull-emr').split('::'); startFormSource(cid, key, 'EMR'); return true; }
  if((el = t.closest('[data-nf-manual]'))){ const [cid,key] = el.getAttribute('data-nf-manual').split('::'); const pane = document.getElementById('nfPane-'+cid); const first = pane && pane.querySelector('input:not([type=file]):not([disabled]),select:not([disabled]),textarea:not([disabled])'); if(first){ first.scrollIntoView({block:'center'}); first.focus(); } toast('Manual edit — every field is editable; nothing is final until you Save & sign.'); return true; }
  if((el = t.closest('[data-nf-clear]'))){ const [cid,key] = el.getAttribute('data-nf-clear').split('::'); const c = findCase(cid); const d = formDraft(c, key); d.v = {}; d.att = {}; d.files = {}; d.src = {}; d.tags = {}; d.confirm = {}; d.opinion = ''; d.tier = null; d.images = []; if(key==='n12') d.cycles = c.chemo.cycles.map(()=>({plannedMg:'', actualMg:'', reasonCode:'', delayDays:'0'})); refreshForm(cid); return true; }
  if((el = t.closest('[data-nf-discard]'))){ const [cid,key] = el.getAttribute('data-nf-discard').split('::'); delete STATE.formDraft[cid+'::'+key]; if(STATE.formErrors) delete STATE.formErrors[cid+'::'+key]; refreshForm(cid); renderPage(); return true; }
  if((el = t.closest('[data-nf-tag]'))){
    const [cid,key,tagKey,val] = el.getAttribute('data-nf-tag').split('::'), c = findCase(cid); if(!c) return true;
    const d = formDraft(c, key);
    d.tags[tagKey] = d.tags[tagKey]===val ? '' : val;
    refreshForm(cid); return true;
  }
  if((el = t.closest('[data-nf-add-image]'))){
    const [cid,key] = el.getAttribute('data-nf-add-image').split('::'), c = findCase(cid); if(!c) return true;
    const cap = (document.getElementById('nfImgCap').value||'').trim();
    const f = document.getElementById('nfImgFile').files[0];
    if(!cap && !f){ toast('Add a caption or attach a file first.'); return true; }
    formDraft(c, key).images.push({caption: cap || f.name, keyImage: document.getElementById('nfImgKey').checked});
    refreshForm(cid); return true;
  }
  if((el = t.closest('[data-nf-rm-image]'))){ const [cid,key,i] = el.getAttribute('data-nf-rm-image').split('::'), c = findCase(cid); formDraft(c, key).images.splice(Number(i),1); refreshForm(cid); return true; }
  if((el = t.closest('[data-open-node-form]'))){ const [cid,key] = el.getAttribute('data-open-node-form').split('::'); STATE.workspaceTab[cid] = 'forms'; STATE.formNode[cid] = key; renderPage(); return true; }
  return false;
}

/* Strategy-selection MDT — same content and order as the source document, styled as separate
   readable sections: trigger/quorum, case summary, strategies table, attributed opinions,
   dissent, locked decision, alternatives rejected. */
function mdtSection(title, bodyHtml, tone){
  const head = tone==='crit' ? 'background:var(--crit-soft);color:var(--crit-ink);' : tone==='accent' ? 'background:var(--accent-soft);color:var(--accent-ink);' : 'background:var(--surface-2);color:var(--ink-muted);';
  const edge = tone==='crit' ? 'border-left:4px solid var(--crit);' : tone==='accent' ? 'border-left:4px solid var(--accent);' : '';
  return '<div style="border:1px solid var(--border);'+edge+'border-radius:10px;background:var(--surface);overflow:hidden;">'+
    (title ? '<div style="padding:9px 16px;border-bottom:1px solid var(--border);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;'+head+'">'+esc(title)+'</div>' : '')+
    '<div style="padding:14px 16px;display:flex;flex-direction:column;gap:12px;">'+bodyHtml+'</div>'+
  '</div>';
}
function mdtCard(title, ic, tone, bodyHtml){
  const col = tone==='crit' ? 'var(--crit)' : tone==='accent' ? 'var(--accent)' : tone==='gold' ? 'var(--gold)' : 'var(--ink-muted)';
  return '<div style="border:1px solid var(--border);border-radius:16px;background:var(--surface);overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05);">'+
    '<div style="display:flex;align-items:center;gap:10px;padding:12px 18px;background:linear-gradient(90deg,color-mix(in srgb,'+col+' 12%,var(--surface)),var(--surface));border-bottom:1px solid var(--border);">'+
      '<span style="width:28px;height:28px;border-radius:9px;background:'+col+';color:#fff;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(ic,15)+'</span>'+
      '<span style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--ink);">'+esc(title)+'</span></div>'+
    '<div style="padding:16px 18px;display:flex;flex-direction:column;gap:14px;">'+bodyHtml+'</div></div>';
}
function mdtInitials(q){ return q.replace(/\(.*?\)/g,'').trim().split(/[\s\/]+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join(''); }
function mdtDeptFor(q){
  const base = q.replace(/\(.*?\)/g,'').trim().toLowerCase();
  const k = Object.keys(DEPT).find(k=>base.indexOf(k.toLowerCase())>=0 || k.toLowerCase().indexOf(base)>=0);
  return deptColor(k || q);
}
function mdtPara(html){ return '<div style="font-size:13.5px;line-height:1.7;white-space:pre-line;">'+html+'</div>'; }
function mdtRolePill(label, colorRole){
  const d = deptColor(colorRole || label);
  return '<span style="display:inline-block;padding:3px 10px;border-radius:999px;background:'+d.bg+';color:'+d.c+';font-size:11.5px;font-weight:700;line-height:1.4;">'+esc(label)+'</span>';
}
function mdtAltIcon(text){
  if(/rejected/i.test(text)) return '<span style="color:var(--crit);display:inline-flex;margin-top:3px;">'+icon('x',14)+'</span>';
  if(/N\/A/i.test(text)) return '<span style="color:var(--ink-faint);display:inline-flex;margin-top:3px;">'+icon('flag',14)+'</span>';
  return '<span style="color:var(--info);display:inline-flex;margin-top:3px;">'+icon('clock',14)+'</span>';
}
function renderMdtVerbatim(c){
  const r = c.mdtRecord, d = c.decision, locked = c.status==='Decision Locked';
  const label = t => '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-faint);margin-bottom:3px;">'+t+'</div>';
  const opinions = c.thread.map((m,i)=>'<div style="display:grid;grid-template-columns:minmax(120px,190px) 1fr;gap:6px 16px;align-items:start;padding:'+(i?'12px':'0')+' 0 0;'+(i?'border-top:1px solid var(--border);':'')+'">'+
      '<div>'+mdtRolePill(m.author, m.role)+'</div>'+
      mdtPara(withCites(m.text))+'</div>').join('');
  const quorum = r.quorumPresent.map(q=>{
    const dc = mdtDeptFor(q);
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:5px;width:92px;text-align:center;">'+
      '<span style="position:relative;width:42px;height:42px;border-radius:50%;background:'+dc.bg+';color:'+dc.c+';border:2px solid var(--good);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;">'+esc(mdtInitials(q))+
        '<span style="position:absolute;right:-4px;bottom:-3px;width:16px;height:16px;border-radius:50%;background:var(--good);color:#fff;display:flex;align-items:center;justify-content:center;">'+icon('check',10)+'</span></span>'+
      '<span style="font-size:11.5px;line-height:1.25;font-weight:600;">'+esc(q)+'</span></div>';
  }).join('');
  const strategies = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;">'+
    r.strategies.map(s=>'<div style="border:1px solid var(--border);border-top:4px solid var(--accent);border-radius:12px;background:var(--surface-2);padding:13px 15px;display:flex;flex-direction:column;gap:10px;">'+
      '<div style="font-size:13.5px;line-height:1.4;">'+withCites(s.name)+'</div>'+
      '<div>'+label('What it commits the patient to')+'<div style="font-size:12.5px;line-height:1.55;">'+withCites(s.commits)+'</div></div>'+
      '<div>'+label('Best when…')+'<div style="font-size:12.5px;line-height:1.55;">'+esc(s.bestWhen)+'</div></div>'+
      '<div style="margin-top:auto;padding-top:9px;border-top:1px dashed var(--border-strong);">'+label('Evidence anchor')+'<div style="font-size:12.5px;line-height:1.55;">'+withCites(s.evidence)+'</div></div>'+
    '</div>').join('')+'</div>';
  const dissent = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;">'+r.dissent.map(x=>
    '<div style="border:1px solid color-mix(in srgb,var(--crit) 30%,var(--border));border-left:5px solid var(--crit);border-radius:12px;background:color-mix(in srgb,var(--crit) 5%,var(--surface));padding:13px 15px;display:flex;flex-direction:column;gap:8px;">'+
      '<div>'+mdtRolePill(x.role)+'</div>'+
      '<div style="display:flex;gap:8px;"><span style="font-family:Georgia,serif;font-size:30px;line-height:.9;color:var(--crit);">“</span><div style="font-size:13.5px;line-height:1.65;font-style:italic;">'+withCites(x.text)+'</div></div></div>').join('')+'</div>';
  const decisionCards = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">'+[d.plan, d.conditions, d.contingency].map((t,i)=>
    '<div style="border:1px solid color-mix(in srgb,var(--accent) 30%,var(--border));border-radius:12px;background:color-mix(in srgb,var(--accent) 6%,var(--surface));padding:14px 15px;display:flex;flex-direction:column;gap:9px;">'+
      '<span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-strong));color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;">'+(i+1)+'</span>'+
      '<div style="font-size:13.5px;line-height:1.65;white-space:pre-line;">'+withCites(t)+'</div></div>').join('')+'</div>';
  const alternatives = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;">'+String(d.alternatives||'').split('\n').filter(Boolean).map(t=>
    '<div style="display:flex;gap:10px;align-items:flex-start;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);padding:11px 14px;">'+mdtAltIcon(t)+'<div style="font-size:13px;line-height:1.6;">'+withCites(t)+'</div></div>').join('')+'</div>';
  return '<div style="display:flex;flex-direction:column;gap:16px;margin-top:6px;">'+
    /* hero: why the case is here, who is present, what the patient wants */
    '<div style="border-radius:18px;padding:20px 22px;background:linear-gradient(135deg,color-mix(in srgb,var(--crit) 13%,var(--surface)),var(--surface) 65%);border:1px solid color-mix(in srgb,var(--crit) 35%,var(--border));border-left:6px solid var(--crit);display:flex;flex-direction:column;gap:16px;">'+
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><span class="badge badge-tier3">'+icon('alert',11)+' TIER 2</span>'+
        (locked ? '<span class="badge badge-locked">'+icon('lock',11)+' Decision locked '+fmtDate(c.lockedAt)+'</span>' : '')+
        '<span class="chip">'+r.quorumPresent.length+' specialties present</span></div>'+
      '<div style="font-size:15px;line-height:1.6;"><strong>Trigger:</strong> '+withCites(r.trigger)+'</div>'+
      '<div>'+label('Quorum present')+'<div style="display:flex;flex-wrap:wrap;gap:12px 6px;margin-top:6px;">'+quorum+'</div></div>'+
      '<div style="display:flex;gap:12px;padding:14px 16px;border-radius:12px;background:var(--gold-soft);border:1px solid color-mix(in srgb,var(--gold) 35%,transparent);">'+
        '<span style="font-family:Georgia,serif;font-size:40px;line-height:.8;color:var(--gold);">“</span>'+
        '<div>'+label('Patient priority on file')+'<div style="font-size:15px;font-style:italic;line-height:1.5;">'+esc(r.patientPriority)+'</div></div></div>'+
    '</div>'+
    mdtCard('Case summary read into record', 'assessment', 'accent', '<div style="font-size:14px;line-height:1.7;">'+withCites(r.caseSummary)+'</div>')+
    mdtCard('The strategies (trials) on the table', 'layers', 'accent', '<div style="font-size:13px;line-height:1.6;color:var(--ink-muted);">'+withCites(r.strategiesIntro)+'</div>'+strategyTreeFigure()+strategies)+
    mdtCard('Specialist opinion', 'users', 'gold', mdtDiscussionReadonly(c) || opinions)+
    mdtCard('Recorded dissent / caution (attributed, not smoothed over)', 'alert', 'crit', dissent)+
    mdtCard('DECISION', 'lock', 'accent',
      '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-muted);">'+icon('lock',13)+' Locked '+fmtDateTime(c.lockedAt)+(d.lockedBy ? ' · '+esc(d.lockedBy) : '')+'</div>'+decisionCards)+
    mdtCard('Alternatives considered and explicitly rejected (recorded)', 'flag', 'plain', alternatives)+
  '</div>';
}
function renderMdtNodeDiscussion(c){
  if(c.mdtRecord) return renderMdtVerbatim(c);
  const anyTier2 = c.timeline.some(t=>t.tierMark && t.tierMark.tier===2);
  return '<div style="display:flex;flex-direction:column;gap:12px;border-top:1px solid var(--border);padding-top:14px;margin-top:2px;">'+
    (anyTier2 ? renderEscalationBanner(c) : '')+
    (anyTier2 ? renderMdtImageBoard(c) : '')+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">'+icon('users',11)+' MDT Discussion — full round table</div>'+
    '<div>'+c.thread.map(m=>renderMsg(m)).join('')+'</div>'+
    (c.decision ? renderDecisionCard(c.decision, true, c) : '')+
  '</div>';
}
/* ---------------- generic per-node structured findings / opinion / tier / images (read-only render) ----------------
   Renders whatever a node's structuredFindings/opinion/tierMark/images carry, using the
   node's own NODE_FIELD_SCHEMAS entry for human labels. All four are optional so every
   existing case (none of which populate these fields) renders exactly as before. */
/* Same kv()+grid pattern the Decision Locked card already uses for its meeting-detail
   fields (renderDecisionCard) — reused here rather than inventing a second "structured
   fields" look, so every structured-form display in the app reads the same way. */
function renderFindingsCard(rows){
  if(!rows || !rows.length) return '';
  const cells = rows.map(r=>kv(r.label, r.value)).join('');
  return '<div class="card card-pad" style="background:var(--surface-2);">'+
    '<div style="display:flex;align-items:center;gap:7px;margin-bottom:2px;">'+
      '<div style="width:22px;height:22px;border-radius:6px;background:var(--gold-soft);color:var(--gold-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon('sparkle',12)+'</div>'+
      '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Auto-Extracted Findings</div>'+
    '</div>'+
    '<div class="grid grid-3" style="gap:0 20px;">'+cells+'</div>'+
  '</div>';
}
function renderStructuredFindings(stage){
  const schema = NODE_FIELD_SCHEMAS[stage.stage];
  if(!schema || !stage.structuredFindings) return '';
  const rows = schema.map(f=>{
    const v = stage.structuredFindings[f.key];
    /* A checkbox's "No" is a deliberate, often clinically important negative (e.g. "no
       pleural effusion", "no contralateral uptake") — it must render as "No", never be
       silently hidden the way an unfilled text/select field is. */
    if(f.type==='check') return (v===undefined || v===null) ? null : {label:f.label, value:v?'Yes':'No'};
    /* Same rule for a multicheck: an empty array from a completed node (e.g. the
       red-flag block) is a deliberate "none present", not "not yet assessed" — show
       it, don't hide it. */
    if(f.type==='multicheck') return (v===undefined || v===null) ? null : {label:f.label, value: v.length ? v.join(', ') : 'None'};
    if(v===undefined || v===''|| v==null) return null;
    const display = v;
    return {label:f.label, value:String(display)};
  }).filter(Boolean);
  return renderFindingsCard(rows);
}
/* The dedicated-tab stops (Fitness, Pathology, Molecular) store their structured data on
   c.fitnessAssessment/c.pathologyAssessment/c.molecularAssessment instead of stage-level
   structuredFindings, since they already had their own full data-entry tab before this
   schema existed. This surfaces a Findings summary from that same data on the Clinical
   History card too, so those stops read as structured, not descriptive, just like every
   other node — without duplicating the dedicated tab's full form here. */
const DEDICATED_FINDINGS_EXTRACTORS = {
  'Fitness / Functional Assessment': c => {
    const d = c.fitnessAssessment; if(!d) return [];
    return [
      {label:'FEV₁ (% predicted)', value:d.fev1Pct!=='' && d.fev1Pct!=null ? d.fev1Pct+'%' : null},
      {label:'FEV₁ absolute', value:d.fev1L ? d.fev1L+' L' : null},
      {label:'FVC (% predicted)', value:d.fvcPct ? d.fvcPct+'%' : null},
      {label:'FEV₁/FVC ratio', value:d.fev1FvcRatio || null},
      {label:'DLCO (% predicted)', value:d.dlcoPct!=='' && d.dlcoPct!=null ? d.dlcoPct+'%' : null},
      {label:'ppoFEV₁ / ppoDLCO', value:(d.ppoFEV1!=null && d.ppoDLCO!=null) ? d.ppoFEV1+'% / '+d.ppoDLCO+'%' : null},
      {label:'Classification', value:d.classification},
      {label:'ECOG', value:d.ecog},
      {label:'6MWT distance', value:d.swtDistance ? d.swtDistance+' m' : null},
    ].filter(r=>r.value!=null && r.value!=='');
  },
  'Pathology (Histo + IHC)': c => {
    const d = c.pathologyAssessment; if(!d) return [];
    const dx = d.primaryDx==='Non-small cell carcinoma' ? d.nsclcSubtype : d.primaryDx;
    return [
      {label:'Diagnosis', value:dx},
      {label:'Adequacy', value:d.adequacy},
      {label:'Tumor cellularity', value:d.cellularityPct ? d.cellularityPct+'%' : null},
      {label:'IHC — adeno markers', value:(d.ihcAdeno||[]).join(', ') || null},
      {label:'IHC — squamous markers', value:(d.ihcSquamous||[]).join(', ') || null},
      {label:'Molecular tissue reserved', value:d.molecularTissueReserved},
    ].filter(r=>r.value!=null && r.value!=='').map(r=>({label:r.label, value:String(r.value)}));
  },
  'Molecular NGS + PD-L1': c => {
    const d = c.molecularAssessment; if(!d) return [];
    const genes = d.genes||{};
    const rows = ['EGFR','ALK','ROS1','RET','BRAF','KRAS','MET','NTRK'].map(k=>{
      const g = genes[k];
      return (g && g.result && g.result!=='Not tested') ? {label:k, value:g.result} : null;
    }).filter(Boolean);
    if(d.pdl1Tested==='Yes' && d.pdl1Tps!=='') rows.push({label:'PD-L1 TPS', value:d.pdl1Tps+'% ('+pdl1Category(d.pdl1Tps)+')'});
    return rows;
  },
};
function dedicatedFindingsFor(c, stage){
  const extractor = DEDICATED_FINDINGS_EXTRACTORS[stage.stage];
  return extractor ? extractor(c) : [];
}
function renderNodeOpinion(stage){
  if(!stage.opinion) return '';
  return '<div style="border-left:3px solid var(--accent);padding:7px 11px;background:var(--surface-2);border-radius:0 8px 8px 0;font-size:12.5px;font-style:italic;line-height:1.55;">“'+esc(stage.opinion)+'”</div>';
}
/* A .badge pill is nowrap-by-design (fine for "Tier 2" alone) — but the reason text
   riding along with it is a full sentence, so this needs a wrapping callout, not a pill. */
function renderNodeTierBadge(stage){
  if(!stage.tierMark) return '';
  const t2 = stage.tierMark.tier===2;
  return '<div class="callout" style="display:flex;align-items:flex-start;gap:8px;'+
      (t2 ? 'background:var(--crit-soft);border-color:color-mix(in srgb, var(--crit) 30%, transparent);color:var(--crit-ink);'
          : 'background:var(--good-soft);border-color:color-mix(in srgb, var(--good) 30%, transparent);color:var(--good-ink);')+
    '">'+icon(t2?'alert':'checkCircle',14)+
    '<span><strong>Tier '+stage.tierMark.tier+'</strong>'+(stage.tierMark.reason?' — '+esc(stage.tierMark.reason):'')+(t2?' — escalates the whole case to the board.':'')+'</span>'+
  '</div>';
}
function renderExternalRecordsStageDetail(c, stage){
  const ext = c.externalRecords;
  if(ext && ext.docLines) return renderDocStage(c, Object.assign({}, stage, {docTitle:ext.docTitle, docLines:ext.docLines}));
  if(!ext){
    return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">'+
        '<h3 style="margin:0;display:flex;align-items:center;gap:8px;">External Records <span class="badge badge-neutral">'+icon('shield',11)+' No outside records</span></h3>'+
      '</div>'+
      '<div class="empty-state">'+icon('download',26)+'<div>Patient presented directly for in-house workup — no outside records on file.</div></div>'+
      '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-attach-ext="'+c.id+'::External Records">'+icon('download',13)+' + Add external document</button>';
  }
  const groups = {};
  ext.docs.forEach(d=>{ (groups[d.tab] = groups[d.tab] || []).push(d); });
  const tabOrder = ['imaging','pathology','labs','functional','priorTx','discharge','other'];
  const notConfirmed = ext.docs.some(d=>d.verificationStatus==='External – not verified' || d.verificationStatus==='In-house re-read requested');
  const upcoming = c.timeline.filter(t=>!t.external && !t.date && !isInapplicableStage(t)).slice(0,3).map(t=>t.stage);
  return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">'+
      '<h3 style="margin:0;display:flex;align-items:center;gap:8px;">External Records <span class="badge badge-gold">'+icon('shield',11)+' EXT — not verified in-house</span></h3>'+
      (stage.date ? '<span style="font-size:11px;color:var(--ink-faint);font-family:var(--font-mono);">'+fmtDate(stage.date)+'</span>' : '')+
    '</div>'+
    '<div style="font-size:10.5px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em;font-weight:700;">Source: '+esc(ext.sourceFacility)+' &middot; Referred '+fmtDate(ext.referredDate)+'</div>'+
    (ext.opinion ? '<div style="font-size:13px;line-height:1.6;">'+esc(ext.nutshell)+'</div>' : '')+
    tabOrder.filter(t=>groups[t]).map(t=>
      '<div style="display:flex;flex-direction:column;gap:8px;">'+
        '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);display:flex;align-items:center;gap:5px;">'+icon(EXTERNAL_TAB_META[t].icon,12)+' '+esc(EXTERNAL_TAB_META[t].label)+'</div>'+
        groups[t].map(d=>renderExternalDocCard(d)).join('')+
      '</div>'
    ).join('')+
    (ext.opinion ? renderNodeOpinion({opinion:ext.opinion}) : '')+
    (ext.tierMark ? renderNodeTierBadge({tierMark:ext.tierMark}) : '')+
    '<div style="font-size:11.5px;padding:8px 10px;border-radius:8px;background:'+(notConfirmed?'var(--gold-soft)':'var(--good-soft)')+';color:'+(notConfirmed?'var(--gold-strong)':'var(--good-ink)')+';">'+
      (notConfirmed ? icon('clock',12)+' Outside records not yet fully confirmed in-house.' : icon('checkCircle',12)+' All outside items confirmed or repeated in-house.')+
      (upcoming.length ? '<br>&rarr; Next: '+esc(upcoming.join(', ')) : '')+
    '</div>'+
    '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-attach-ext="'+c.id+'::External Records">'+icon('download',13)+' + Add external document</button>';
}
/* "+ Attach external document" — available on the Stop 0 node itself and on every
   later stop, since outside material can arrive at any time (spec §1). */
function openAttachExternalDocModal(caseId, stageName){
  const optgroups = ['imaging','pathology','labs','functional','priorTx','discharge','other'].map(tab=>
    '<optgroup label="'+esc(EXTERNAL_TAB_META[tab].label)+'">'+
      EXTERNAL_DOC_TYPES.filter(d=>d.tab===tab).map(d=>'<option value="'+esc(d.label)+'" data-tab="'+tab+'">'+esc(d.label)+'</option>').join('')+
    '</optgroup>'
  ).join('');
  const html = ''+
    '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">Attach External Document</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;flex-direction:column;gap:12px;">'+
      '<div class="callout callout-info" style="font-size:11.5px;">'+icon('shield',13)+' Filed here, this stays tagged "External — not verified in-house" until repeated or formally re-read.'+(stageName!=='External Records' ? ' It will be linked to <strong>'+esc(stageName)+'</strong>.' : '')+'</div>'+
      '<div class="field"><label>Document type</label><select id="extDocType">'+optgroups+'</select></div>'+
      '<div class="field"><label>Source facility / clinician</label><input type="text" id="extSourceFacility" placeholder="e.g. City Hospital"></div>'+
      '<div class="field"><label>Date of investigation</label><input type="date" id="extDateOfInvestigation"></div>'+
      '<div class="field"><label>Key finding (short)</label><input type="text" id="extKeyFinding" placeholder="e.g. 3.1 cm RUL mass, suspicious"></div>'+
      '<label class="btn btn-secondary btn-sm" style="cursor:pointer;align-self:flex-start;">'+icon('download',13)+' Attach file (demo)<input type="file" id="extFileInput" style="display:none;"></label>'+
      '<button class="btn btn-gold" id="extSubmitBtn" data-case="'+caseId+'" data-stage="'+esc(stageName)+'">'+icon('download',15)+' File Document</button>'+
    '</div>';
  openModal(html);
}
function submitAttachExternalDoc(caseId, stageName){
  const c = findCase(caseId); if(!c) return;
  const sel = document.getElementById('extDocType');
  const opt = sel.options[sel.selectedIndex];
  const docType = opt.value, tab = opt.getAttribute('data-tab');
  const sourceFacility = document.getElementById('extSourceFacility').value || 'Unspecified facility';
  const dateVal = document.getElementById('extDateOfInvestigation').value;
  const dateOfInvestigation = dateVal ? new Date(dateVal) : new Date();
  const keyFinding = document.getElementById('extKeyFinding').value;
  const fileInput = document.getElementById('extFileInput');
  const fileName = (fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : (docType+' (demo).pdf');
  closeModal();
  const isReferralDoc = docType==='Referral letter' || docType==='Discharge summary';
  if(isReferralDoc){
    openAgentPipeline('Extracting from "'+fileName+'"', [
      {label:'OCR Agent', detail:'Reading scanned pages of the '+docType.toLowerCase()+'…'},
      {label:'Extraction Agent', detail:'Pulling presenting complaint, history and impression…'},
      {label:'Handoff for Verification', detail:'Nothing is saved until you confirm each field…'},
    ], ()=>openExternalExcerptConfirm(caseId, {tab, docType, sourceFacility, dateOfInvestigation, keyFinding, fileName, stageName}), 'Review extracted fields');
    return;
  }
  const doc = {
    id:'ext-'+caseId+'-'+Date.now(), tab, docType, sourceFacility, dateOfInvestigation, dateReceived:new Date(),
    uploadedBy:ME.name, verificationStatus:'External – not verified', keyFinding,
    linkedStop: stageName==='External Records' ? null : stageName, files:[fileName],
  };
  fileExternalDoc(c, doc, stageName);
}
function fileExternalDoc(c, doc, stageName){
  if(!c.externalRecords){
    c.externalRecords = {sourceFacility:doc.sourceFacility, referredDate:doc.dateOfInvestigation, nutshell:'Outside record on file from '+doc.sourceFacility+'.', docs:[]};
    const stop0 = c.timeline.find(t=>t.external);
    if(stop0){ stop0.date = doc.dateOfInvestigation; stop0.owner = doc.sourceFacility; stop0.summary = c.externalRecords.nutshell; stop0.naByDesign = false; }
  }
  c.externalRecords.docs.push(doc);
  if(stageName && stageName!=='External Records'){
    const stage = c.timeline.find(t=>t.stage===stageName);
    if(stage) stage.extAttached = true;
  }
  renderPage();
  toast('Filed "'+doc.docType+'" — tagged External, not verified in-house.');
}
function openExternalExcerptConfirm(caseId, draft){
  const c = findCase(caseId); if(!c) return;
  const presStage = c.timeline.find(t=>t.stage==='Presentation & History' || t.stage==='Presentation');
  const smokingFact = c.keyFacts.find(k=>/smoker|pack-year/i.test(k)) || '';
  const html = ''+
    '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">Auto-excerpt from "'+esc(draft.fileName)+'"</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div class="callout callout-info" style="font-size:11.5px;">Review each field. Nothing is saved until you tap Confirm.</div>'+
      '<div class="field"><label>Presenting complaint</label><input type="text" id="excPresenting" value="'+esc(presStage ? presStage.summary : (draft.keyFinding||'')) +'"></div>'+
      '<div class="field"><label>Smoking history</label><input type="text" id="excSmoking" value="'+esc(smokingFact)+'"></div>'+
      '<div class="field"><label>Outside imaging / finding</label><input type="text" id="excImaging" value="'+esc(draft.keyFinding||'')+'"></div>'+
      '<div class="field"><label>Impression</label><input type="text" id="excImpression" value="'+esc('?'+c.diagnosis)+'"></div>'+
      '<div class="field"><label>Referring facility</label><input type="text" id="excFacility" value="'+esc(draft.sourceFacility)+'"></div>'+
      '<div class="callout callout-gold" style="font-size:11px;">'+icon('alert',12)+' All fields will be tagged "External – not verified".</div>'+
      '<div style="display:flex;gap:8px;justify-content:flex-end;">'+
        '<button class="btn btn-secondary btn-sm" data-modal-close>Discard</button>'+
        '<button class="btn btn-gold btn-sm" id="excConfirmBtn">'+icon('checkCircle',14)+' Confirm &amp; File</button>'+
      '</div>'+
    '</div>';
  openModal(html);
  document.getElementById('excConfirmBtn').addEventListener('click', ()=>confirmExternalExcerpt(caseId, draft));
}
function confirmExternalExcerpt(caseId, draft){
  const c = findCase(caseId); if(!c) return;
  const presenting = document.getElementById('excPresenting').value;
  const smoking = document.getElementById('excSmoking').value;
  const imaging = document.getElementById('excImaging').value;
  const impression = document.getElementById('excImpression').value;
  const facility = document.getElementById('excFacility').value;
  closeModal();
  const presStage = c.timeline.find(t=>t.stage==='Presentation & History' || t.stage==='Presentation');
  const doc = {
    id:'ext-'+caseId+'-'+Date.now(), tab:draft.tab, docType:draft.docType, sourceFacility:facility, dateOfInvestigation:draft.dateOfInvestigation, dateReceived:new Date(),
    uploadedBy:ME.name, verificationStatus:'External – not verified', autoExcerpted:true,
    keyFinding:[presenting, smoking, imaging?('Outside imaging: '+imaging):'', impression?('Impression: '+impression):''].filter(Boolean).join(' '),
    linkedStop: draft.stageName==='External Records' ? (presStage ? presStage.stage : 'Presentation & History') : draft.stageName, files:[draft.fileName],
  };
  fileExternalDoc(c, doc, draft.stageName);
}

/* ============================================================
   TAB: TREATMENT LOG (Stop 8 — neoadjuvant / systemic therapy cycles)
   ============================================================ */
const TOXICITY_OPTIONS = ['Neutropenia / febrile neutropenia','Nausea / vomiting','Fatigue','Diarrhea / colitis','Pneumonitis','Rash'];
/* Doses are always stored/displayed as an absolute computed amount in mg —
   a drug's own `unit` field (e.g. "mg/m²") describes its *reference rate*,
   not the post-BSA total, so it must never label the computed dose. */
function computeRDI(tl){
  const given = tl.cycles.filter(cy=>cy.status==='given' && cy.doses);
  if(!given.length) return null;
  let plannedSum=0, actualSum=0;
  given.forEach(cy=>cy.doses.forEach(d=>{ plannedSum+=d.planned; actualSum+=d.actual; }));
  return plannedSum ? Math.round((actualSum/plannedSum)*1000)/10 : null;
}
function renderRDIBanner(tl){
  const rdi = computeRDI(tl);
  if(rdi==null) return '';
  const onProtocol = rdi >= 85;
  return '<div class="callout" style="background:'+(onProtocol?'var(--good-soft)':'var(--warn-soft)')+';border:1px solid transparent;color:'+(onProtocol?'var(--good-ink)':'var(--warn-ink)')+';">'+
    '<div style="display:flex;align-items:center;gap:8px;font-weight:700;margin-bottom:4px;">'+icon(onProtocol?'checkCircle':'alert',14)+' Relative Dose Intensity: '+rdi+'% — '+(onProtocol?'On-protocol intensity':'Reduced intensity flag')+'</div>'+
    (onProtocol ? '<div style="font-size:11.5px;">Cumulative delivered dose is ≥85% of planned protocol dose.</div>'
      : '<div style="font-size:11.5px;">Reduced dose intensity has been associated with modestly worse outcomes in adjuvant/first-line NSCLC series, but the effect is confounded by patient fitness (sicker patients get reduced doses). This is a flag for MDT attention — not a corrected prognosis.</div>')+
  '</div>';
}
function renderTabTreatment(c){
  const tl = c.treatmentLog;
  const bsa = (c.patient.height && c.patient.weight) ? calcBSA(c.patient.height, c.patient.weight) : null;
  const firstPending = tl.cycles.findIndex(cy=>cy.status==='pending');
  const activeIdx = STATE.treatmentCycleActive[c.id] ?? (firstPending>=0 ? firstPending : tl.cycles.length-1);
  const idx = Math.max(0, Math.min(activeIdx, tl.cycles.length-1));
  const cycle = tl.cycles[idx];
  const givenCount = tl.cycles.filter(cy=>cy.status==='given').length;
  const allSettled = tl.cycles.every(cy=>cy.status!=='pending');
  const statusLine = givenCount===0 ? 'Not yet started' :
    (allSettled ? givenCount+' of '+tl.numCycles+' cycles given — regimen complete or discontinued' :
     'Currently on Cycle '+givenCount+' of '+tl.numCycles+' given; next cycle pending');
  const stageName = /neoadjuvant/i.test(tl.intent) ? 'Neoadjuvant Therapy' : 'Adjuvant Therapy';
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,stageName)+
    '<div class="grid grid-3">'+
      kv('Regimen', tl.regimen)+
      kv('Intent', tl.intent)+
      kv('Body surface area', bsa ? bsa.toFixed(2)+' m² (Mosteller)' : 'Height/weight not on file')+
    '</div>'+
    '<div class="callout callout-info">'+icon('sparkle',13)+' '+esc(statusLine)+'</div>'+
    renderRDIBanner(tl)+
    '<div class="stepper">'+tl.cycles.map((cy,i)=>{
      const stCls = cy.status==='given' ? 'done' : (i===idx ? 'current' : '');
      const dotStyle = cy.status==='cancelled' ? 'background:var(--crit-soft);border-color:var(--crit);color:var(--crit);' : '';
      return '<div class="step '+stCls+'" data-tx-cycle="'+c.id+'" data-idx="'+i+'">'+
        '<div class="step-line"></div>'+
        '<div class="step-dot" style="'+dotStyle+'">'+(cy.status==='given'?icon('check',15):cy.status==='cancelled'?icon('x',14):(i+1))+'</div>'+
        '<span class="step-label">Cycle '+(i+1)+'</span>'+
      '</div>';
    }).join('')+'</div>'+
    renderCycleDetail(c, tl, cycle, idx, bsa)+
  '</div>';
}
function renderCycleDetail(c, tl, cycle, idx, bsa, mode){
  mode = mode || 'neo';
  if(cycle.status==='given'){
    return '<div class="card" style="background:var(--surface-2);">'+
      '<div class="card-pad" style="display:flex;flex-direction:column;gap:12px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;"><h3>Cycle '+(idx+1)+' — Given</h3><span class="mono" style="font-size:11px;color:var(--ink-faint);">'+fmtDate(cycle.actualDate)+'</span></div>'+
        (cycle.delayDays ? '<div class="chip">Delayed '+cycle.delayDays+' day(s) — '+esc(cycle.delayReason||'')+'</div>' : '')+
        '<div class="table-wrap"><table><thead><tr><th>Drug</th><th>Planned</th><th>Actual</th><th>Modification</th></tr></thead><tbody>'+
          cycle.doses.map(d=>'<tr><td>'+esc(d.drug)+'</td><td class="mono">'+d.planned+' mg</td><td class="mono">'+d.actual+' mg</td><td>'+(d.modification==='none'?'—':esc(d.modification))+'</td></tr>').join('')+
        '</tbody></table></div>'+
        '<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);margin-bottom:6px;">Toxicity (CTCAE v5.0)</div>'+
        (cycle.toxicities.length ? '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
          cycle.toxicities.map(t=>'<span class="badge '+(t.grade>=3?'badge-tier3':t.grade===2?'badge-tier2':'badge-tier1')+'">'+esc(t.name)+' · G'+t.grade+'</span>').join('')+
        '</div>' : '<div style="font-size:12.5px;color:var(--ink-faint);">No toxicity reported.</div>')+
        '</div>'+
        (cycle.toxicities.some(t=>t.grade>=3) ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);">'+icon('alert',13)+' Grade ≥3 toxicity — flagged for MDT re-review before the next cycle.</div>' : '')+
      '</div>'+
    '</div>';
  }
  if(cycle.status==='cancelled'){
    return '<div class="card" style="border-color:var(--crit);background:var(--crit-soft);"><div class="card-pad">'+
      '<div style="font-weight:700;color:var(--crit-ink);margin-bottom:4px;display:flex;align-items:center;gap:7px;">'+icon('x',14)+' Cycle '+(idx+1)+' cancelled</div>'+
      '<div style="font-size:12.5px;">Reason: '+esc(cycle.delayReason||'—')+'</div>'+
    '</div></div>';
  }
  return renderCycleLogForm(c, tl, cycle, idx, bsa, mode);
}
function renderCycleLogForm(c, tl, cycle, idx, bsa, mode){
  mode = mode || 'neo';
  const uid = c.id+'_'+idx;
  const logAttr = mode==='adj' ? 'data-log-adj-cycle' : 'data-log-cycle';
  const doses = tl.drugs.map(d=>({
    drug:d.name, refLabel: d.dosing==='fixed' ? 'fixed dose' : d.refDosePerM2+' '+d.unit,
    planned: d.dosing==='fixed' ? d.refDose : Math.round((d.refDosePerM2*bsa)/5)*5,
  }));
  const cycleStatus = STATE.cycleStatusDraft && STATE.cycleStatusDraft[uid] || 'Given';
  return '<div class="card" style="border-style:dashed;"><div class="card-pad" style="display:flex;flex-direction:column;gap:14px;">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;"><h3>Cycle '+(idx+1)+' — Log Administration</h3><span style="font-size:11px;color:var(--ink-faint);">Planned '+fmtDate(cycle.plannedDate)+'</span></div>'+
    '<div class="field"><label>Cycle status</label><select data-cycle-status="'+uid+'"><option '+(cycleStatus==='Given'?'selected':'')+'>Given</option><option '+(cycleStatus==='Delayed'?'selected':'')+'>Delayed</option><option '+(cycleStatus==='Cancelled'?'selected':'')+'>Cancelled</option></select></div>'+
    (cycleStatus!=='Given' ? '<div class="field"><label>'+(cycleStatus==='Delayed'?'Delay reason':'Cancellation reason')+'</label><select id="txdelayreason_'+uid+'">'+MOD_REASON_OPTIONS.map(o=>'<option>'+o+'</option>').join('')+'</select></div>' : '')+
    (cycleStatus==='Given' ? (''+
    '<div class="callout callout-info" style="font-size:11.5px;">Dosing Agent: '+(bsa ? 'planned doses calculated from BSA '+bsa.toFixed(2)+' m².' : 'planned doses are fixed per label.')+' Confirm or edit the actual dose given.</div>'+
    '<div class="table-wrap"><table><thead><tr><th>Drug</th><th>Reference rate</th><th>Planned</th><th>Actual</th></tr></thead><tbody>'+
      doses.map((d,i)=>'<tr><td>'+esc(d.drug)+'</td><td class="mono" style="color:var(--ink-faint);font-size:11.5px;">'+esc(d.refLabel)+'</td><td class="mono">'+d.planned+' mg</td><td><input type="number" id="txdose_'+uid+'_'+i+'" value="'+d.planned+'" style="width:90px;padding:5px 7px;border:1px solid var(--border-strong);border-radius:6px;"></td></tr>').join('')+
    '</tbody></table></div>'+
    '<div class="field"><label>Dose modification reason (if actual dose was reduced/held/omitted)</label><select id="txmodreason_'+uid+'"><option value="">Not modified</option>'+MOD_REASON_OPTIONS.map(o=>'<option>'+o+'</option>').join('')+'</select></div>'+
    '<div><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);margin-bottom:6px;">Premedication given</div>'+
      '<div style="display:flex;gap:14px;flex-wrap:wrap;">'+['Antiemetic','Steroid','Antihistamine'].map((p,i)=>'<label class="checkline"><input type="checkbox" id="txpremed_'+uid+'_'+i+'"> '+p+'</label>').join('')+'</div>'+
    '</div>'+
    '<div>'+
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);margin-bottom:6px;">Toxicity since last cycle (CTCAE v5.0)</div>'+
      '<div style="display:flex;flex-direction:column;gap:7px;">'+
      TOXICITY_OPTIONS.map((tx,i)=>'<div class="field-row">'+
        '<label class="checkline" style="min-width:230px;"><input type="checkbox" id="txtox_'+uid+'_'+i+'" data-tox-toggle="'+uid+'_'+i+'"> '+esc(tx)+'</label>'+
        '<select id="txgrade_'+uid+'_'+i+'" disabled style="padding:4px 8px;border:1px solid var(--border-strong);border-radius:6px;background:var(--surface);"><option value="1">Grade 1</option><option value="2">Grade 2</option><option value="3">Grade 3</option><option value="4">Grade 4</option><option value="5">Grade 5</option></select>'+
      '</div>').join('')+
      '</div>'+
    '</div>'+
    '<label class="checkline"><input type="checkbox" id="txlabs_'+uid+'"> Pre-cycle labs (CBC, metabolic panel) reviewed and acceptable</label>'
    ) : '')+
    '<button class="btn btn-gold" '+logAttr+'="'+c.id+'" data-cycle-idx="'+idx+'" data-uid="'+uid+'">'+icon('checkCircle',15)+' '+(cycleStatus==='Given'?'Mark Cycle '+(idx+1)+' as Given':'Save Cycle '+(idx+1)+' as '+cycleStatus)+'</button>'+
  '</div></div>';
}
const MOD_REASON_OPTIONS = ['Hematologic toxicity','Renal','Hepatic','Neuropathy','irAE','Patient choice','Other'];
function submitCycleLog(caseId, cycleIdx, uid){
  const c = findCase(caseId); if(!c) return;
  const tl = c.treatmentLog;
  const cycle = tl.cycles[cycleIdx];
  const cycleStatus = STATE.cycleStatusDraft && STATE.cycleStatusDraft[uid] || 'Given';
  if(cycleStatus!=='Given'){
    const reason = (document.getElementById('txdelayreason_'+uid)||{}).value || 'Other';
    cycle.status = cycleStatus.toLowerCase();
    cycle.delayReason = reason;
    if(cycleStatus==='Delayed') cycle.delayDays = 7;
    c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Cycle '+(cycleIdx+1)+' of '+tl.regimen+' recorded as '+cycleStatus+'. Reason: '+reason+'.'+(cycleStatus==='Cancelled'?' Escalated for MDT re-review.':''), kind:'system'});
    if(cycleStatus==='Cancelled') markStageComplete(c, 'Neoadjuvant Therapy', 'Cycle '+(cycleIdx+1)+' cancelled ('+reason+') — flagged for MDT re-review.');
    toast('Cycle '+(cycleIdx+1)+' recorded as '+cycleStatus+'.');
    renderPage();
    return;
  }
  const labsEl = document.getElementById('txlabs_'+uid);
  if(!labsEl || !labsEl.checked){ toast('Pre-cycle labs must be reviewed before this cycle can be marked given.'); return; }
  const bsa = calcBSA(c.patient.height, c.patient.weight);
  const modReason = (document.getElementById('txmodreason_'+uid)||{}).value || '';
  const doses = tl.drugs.map((d,i)=>{
    const planned = d.dosing==='fixed' ? d.refDose : Math.round((d.refDosePerM2*bsa)/5)*5;
    const actualEl = document.getElementById('txdose_'+uid+'_'+i);
    const actual = actualEl ? (Number(actualEl.value)||planned) : planned;
    return {drug:d.name, planned, actual, modification: actual===planned ? 'none' : (actual<planned?'reduced':'increased'), modReason: actual!==planned ? modReason : null};
  });
  const premedication = [0,1,2].filter(i=>{ const cb=document.getElementById('txpremed_'+uid+'_'+i); return cb&&cb.checked; }).map(i=>['Antiemetic','Steroid','Antihistamine'][i]);
  const toxicities = [];
  TOXICITY_OPTIONS.forEach((tx,i)=>{
    const cb = document.getElementById('txtox_'+uid+'_'+i);
    if(cb && cb.checked){
      const gradeSel = document.getElementById('txgrade_'+uid+'_'+i);
      toxicities.push({name:tx, grade:Number(gradeSel.value)});
    }
  });
  cycle.status = 'given';
  cycle.actualDate = new Date();
  cycle.doses = doses;
  cycle.premedication = premedication;
  cycle.toxicities = toxicities;
  cycle.labsEntered = true;
  const highGrade = toxicities.some(t=>t.grade>=3);
  cycle.actionTaken = highGrade ? 'MDT re-review' : 'none';
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(),
    text:'Cycle '+(cycleIdx+1)+' of '+tl.regimen+' logged as given.'+(highGrade?' Grade ≥3 toxicity reported — flagged for MDT re-review before the next cycle.':''), kind:'system'});
  toast('Cycle '+(cycleIdx+1)+' marked as given.'+(highGrade?' Escalated for MDT re-review.':''));
  renderPage();
}

/* ============================================================
   EVIDENCE ENGINE — cross-cutting feature, not a timeline stop.
   Attaches to any locked decision node. Computes eligibility/
   applicability against the uploaded trial, never displays an
   individual prognosis number, and is advisory-only throughout.
   ============================================================ */
const KNOWN_TRIALS = {
  'ADAURA': {
    regimen:'Osimertinib (adjuvant)', endpoint:'DFS', hr:0.27, ciLow:0.21, ciHigh:0.34, followUp:'~5 years',
    criteria:[
      {label:'Stage', requirement:'IB–IIIA (resected)', get:b=>b.stage, evaluate:b=>['IB','II','IIA','IIB','IIIA'].includes(b.stage)?'yes':'no'},
      {label:'Histology', requirement:'Any (NSCLC)', get:b=>b.histology, evaluate:()=>'yes'},
      {label:'Driver mutation', requirement:'EGFR ex19del / L858R', get:b=>'EGFR '+b.egfr, evaluate:b=>b.egfr==='Positive'?'yes':'no'},
      {label:'ECOG PS', requirement:'0–1', get:b=>String(b.ecog), evaluate:b=>b.ecog<=1?'yes':'no'},
      {label:'Resection status', requirement:'R0 (post-resection)', get:b=>b.resection, evaluate:b=>b.resection==='R0'?'yes':'no'},
    ],
  },
  'KEYNOTE-671': {
    regimen:'Pembrolizumab + platinum-doublet (perioperative)', endpoint:'EFS', hr:0.58, ciLow:0.46, ciHigh:0.72, followUp:'~25.2 months',
    criteria:[
      {label:'Stage', requirement:'II–IIIB, resectable', get:b=>b.stage, evaluate:b=>['II','IIA','IIB','IIIA','IIIB'].includes(b.stage)?'yes':'no'},
      {label:'Driver mutation', requirement:'EGFR/ALK negative (ICI-eligible)', get:b=>'EGFR '+b.egfr+' / ALK '+b.alk, evaluate:b=>(b.egfr==='Negative'&&b.alk==='Negative')?'yes':'no'},
      {label:'PD-L1', requirement:'Any (no minimum)', get:b=>b.pdl1+'%', evaluate:()=>'yes'},
      {label:'ECOG PS', requirement:'0–1', get:b=>String(b.ecog), evaluate:b=>b.ecog<=1?'yes':'no'},
    ],
  },
};
function computeMatchReport(trialKey, bio){
  const trial = KNOWN_TRIALS[trialKey];
  const rows = trial.criteria.map(cr=>({ criterion:cr.label, requirement:cr.requirement, patientValue:cr.get(bio), match:cr.evaluate(bio) }));
  const hasNo = rows.some(r=>r.match==='no');
  const hasWarn = rows.some(r=>r.match==='warn');
  const verdict = hasNo ? 'off-trial' : (hasWarn ? 'partial' : 'concordant');
  return {rows, verdict};
}
function evidenceTierForDocType(docType){
  if(docType==='Randomized controlled trial' || docType==='Meta-analysis / systematic review' || docType==='Guideline (NCCN/ASCO/ACCP)') return 1;
  if(docType==='Single-arm / phase 2 trial') return 2;
  return 3;
}
function renderEvidencePanel(c){
  const links = c.evidenceLinks || [];
  return '<div style="display:flex;flex-direction:column;gap:12px;">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;">'+
      '<h3 style="font-size:13px;">Evidence Engine</h3>'+
      '<button class="btn btn-secondary btn-sm" data-attach-evidence="'+c.id+'">'+icon('plus',14)+' Attach Evidence</button>'+
    '</div>'+
    (links.length ? links.map((ev,i)=>renderEvidenceCard(c,ev,i)).join('') :
      '<div class="callout callout-info" style="font-size:12px;">No evidence attached yet. Attach a trial or guideline to this locked decision to check applicability — the engine will never show a personal prognosis without first checking the patient matches.</div>')+
  '</div>';
}
/* Module 4 — Timeline Re-Sequencing Engine: Lane A (protocol-ideal) vs Lane B (actual),
   with advisory-only drift flags. Never silently reschedules anything. */
function renderResequencingModule(c, ev){
  const tl = c.timeline;
  const find = name => tl.find(t=>t.stage===name);
  const decisionStage = find('MDT Decision Lock');
  const neoStage = find('Neoadjuvant Therapy');
  const restageStage = find('Restaging / Resectability');
  const surgeryStage = find('Surgery');
  const adjStage = find('Adjuvant Therapy');
  const stagingStage = find('Staging (CT / PET / Brain MRI)');
  const anchor = (decisionStage && decisionStage.date) || c.lockedAt || c.createdAt;
  if(!anchor) return '';
  const addDays = (d,n)=> new Date(new Date(d).getTime() + n*86400000);
  const cycles = ev.protocolCycles || 4;
  const cycleDays = ev.protocolCycleDays || 21;
  const laneA = [{label:'Decision locked', date:anchor}];
  for(let i=1;i<=cycles;i++) laneA.push({label:'Cycle '+i+' (ideal)', date:addDays(anchor, (i-1)*cycleDays)});
  const lastCycleIdeal = addDays(anchor, (cycles-1)*cycleDays);
  laneA.push({label:'Restaging (ideal, ~9wk)', date:addDays(anchor, 63)});
  laneA.push({label:'Surgery (ideal, ≤6wk post-last-cycle)', date:addDays(lastCycleIdeal, 42)});
  const laneB = [];
  if(neoStage && neoStage.date) laneB.push({label:'Neoadjuvant started', date:neoStage.date});
  if(restageStage && restageStage.date) laneB.push({label:'Restaging', date:restageStage.date});
  if(surgeryStage && surgeryStage.date) laneB.push({label:'Surgery', date:surgeryStage.date});
  if(adjStage && adjStage.date) laneB.push({label:'Adjuvant started', date:adjStage.date});
  if(!laneB.length) return '';
  const flags = [];
  if(surgeryStage && surgeryStage.date && adjStage && adjStage.date){
    const gapWeeks = (adjStage.date - surgeryStage.date)/(7*86400000);
    if(gapWeeks > 8) flags.push('Surgery-to-adjuvant interval '+gapWeeks.toFixed(1)+' weeks — exceeds protocol window.');
  }
  if(restageStage && restageStage.date){
    const idealRestage = addDays(anchor,63);
    const diffWeeks = Math.abs(restageStage.date - idealRestage)/(7*86400000);
    if(diffWeeks > 2) flags.push('Restaging performed '+diffWeeks.toFixed(1)+' week(s) outside the protocol interval.');
  }
  if(stagingStage && stagingStage.date && surgeryStage && surgeryStage.date){
    const ageDays = (surgeryStage.date - stagingStage.date)/86400000;
    if(ageDays > 60) flags.push('Imaging is '+Math.round(ageDays)+' days old at the surgical decision — currency flag.');
  }
  return '<div style="display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:var(--radius-md);background:var(--surface-2);border:1px solid var(--border);">'+
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);">Timeline Re-Sequencing (protocol vs. actual)</div>'+
    '<div class="grid grid-2" style="gap:10px;">'+
      '<div><div style="font-size:10.5px;font-weight:700;color:var(--good-ink);margin-bottom:4px;">LANE A — Protocol-ideal</div>'+laneA.map(x=>'<div style="font-size:11.5px;padding:3px 0;border-top:1px solid var(--border);">'+esc(x.label)+' — '+fmtDate(x.date)+'</div>').join('')+'</div>'+
      '<div><div style="font-size:10.5px;font-weight:700;color:var(--info);margin-bottom:4px;">LANE B — Actual</div>'+laneB.map(x=>'<div style="font-size:11.5px;padding:3px 0;border-top:1px solid var(--border);">'+esc(x.label)+' — '+fmtDate(x.date)+'</div>').join('')+'</div>'+
    '</div>'+
    (flags.length ? flags.map(f=>'<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' '+esc(f)+'</div>').join('') : '<div style="font-size:11px;color:var(--ink-faint);">No timing-drift flags.</div>')+
    '<div style="font-size:10.5px;color:var(--ink-faint);font-style:italic;">Advisory only — re-sequencing suggestions must be accepted by a clinician; the engine never silently reschedules.</div>'+
  '</div>';
}
function renderEvidenceCard(c, ev, idx){
  const verdictMeta = {
    concordant:{label:'Trial-concordant', cls:'badge-tier1', color:'var(--good)'},
    partial:{label:'Partial match — interpret with caution', cls:'badge-tier2', color:'var(--warn)'},
    'off-trial':{label:'Off-trial — evidence does not directly apply', cls:'badge-tier3', color:'var(--crit)'},
  }[ev.verdict];
  const tierLabel = {1:'Level 1 · RCT/meta-analysis',2:'Level 2 · phase 2/prospective',3:'Level 3 · retrospective/real-world'}[ev.tier];
  return '<div class="card" style="border-color:'+verdictMeta.color+';">'+
    '<div class="card-pad" style="display:flex;flex-direction:column;gap:12px;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">'+
        '<div><div style="font-weight:700;font-size:13.5px;">'+esc(ev.trialName)+(ev.confirmed?'':' <span class="badge badge-tier2" style="margin-left:6px;">Unverified</span>')+'</div>'+
        '<div style="font-size:11px;color:var(--ink-faint);">'+esc(ev.regimen)+' · '+esc(ev.docType)+' · '+esc(tierLabel)+'</div></div>'+
        '<span class="badge '+verdictMeta.cls+'">'+esc(verdictMeta.label)+'</span>'+
      '</div>'+
      '<div class="table-wrap"><table><thead><tr><th>Criterion</th><th>Trial requirement</th><th>This patient</th><th></th></tr></thead><tbody>'+
        ev.rows.map(r=>'<tr><td>'+esc(r.criterion)+'</td><td>'+esc(r.requirement)+'</td><td class="mono">'+esc(r.patientValue)+'</td><td>'+(r.match==='yes'?'<span style="color:var(--good);">'+icon('check',14)+'</span>':r.match==='warn'?'<span style="color:var(--warn);">'+icon('alert',14)+'</span>':'<span style="color:var(--crit);">'+icon('x',14)+'</span>')+'</td></tr>').join('')+
      '</tbody></table></div>'+
      (ev.verdict==='off-trial' ?
        '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);">'+icon('alert',13)+' Uploaded evidence does not apply to this patient’s profile — prognosis display suppressed. See mismatched criteria above.</div>'
        :
        '<div style="display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:var(--radius-md);background:var(--surface-2);border:1px solid var(--border);">'+
          '<div style="font-size:12.5px;">In <strong>'+esc(ev.trialName)+'</strong> ('+esc(verdictMeta.label.split(' —')[0])+' match), reported <strong>'+esc(ev.endpoint)+' HR '+ev.hr.toFixed(2)+'</strong> (95% CI '+ev.ciLow.toFixed(2)+'–'+ev.ciHigh.toFixed(2)+'), median follow-up '+esc(ev.followUp)+'.</div>'+
          '<div style="font-size:11px;color:var(--ink-faint);font-style:italic;">Trial results describe average outcomes in a selected population. Individual risk depends on factors not captured by trial averages. Use for shared decision-making, not as a definitive individual prognosis.</div>'+
        '</div>'
      )+
      (ev.verdict!=='off-trial' ? renderResequencingModule(c, ev) : '')+
      '<div style="font-size:10.5px;color:var(--ink-faint);">Attached by '+esc(ev.attachedBy)+' · '+fmtDateTime(ev.attachedAt)+' · linked to '+esc(ev.attachedTo)+
        (ev.confirmed?'':' · <button class="btn btn-ghost btn-sm" style="padding:2px 8px;" data-confirm-evidence="'+c.id+'" data-idx="'+idx+'">Confirm extracted values</button>')+
      '</div>'+
    '</div>'+
  '</div>';
}
function openAttachEvidenceModal(caseId){
  const trials = Object.keys(KNOWN_TRIALS);
  const html = ''+
    '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">Attach Evidence</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;flex-direction:column;gap:12px;">'+
      '<div class="callout callout-info" style="font-size:11.5px;">Upload a trial, meta-analysis, or guideline that justifies the locked decision. The engine checks whether this patient matches before showing any outcome data — it never displays a personal survival number.</div>'+
      '<div class="field"><label>Document type</label><select id="evDocType"><option>Randomized controlled trial</option><option>Meta-analysis / systematic review</option><option>Guideline (NCCN/ASCO/ACCP)</option><option>Single-arm / phase 2 trial</option><option>Retrospective / real-world cohort</option></select></div>'+
      '<div class="field"><label>Matched trial (simulated extraction)</label><select id="evTrialName"><option value="">Select…</option>'+trials.map(t=>'<option value="'+esc(t)+'">'+esc(t)+'</option>').join('')+'</select></div>'+
      '<div id="evExtracted" hidden style="display:flex;flex-direction:column;gap:8px;padding:10px;border:1px dashed var(--border-strong);border-radius:8px;">'+
        '<div style="font-size:11px;color:var(--ink-faint);">Auto-extracted — confirm before use:</div>'+
        '<div id="evExtractedFields" style="font-size:12px;"></div>'+
      '</div>'+
      '<button class="btn btn-gold" id="evSubmitBtn" data-case="'+caseId+'" disabled>'+icon('sparkle',15)+' Run Applicability Check</button>'+
    '</div>';
  openModal(html, {wide:true});
  document.getElementById('evTrialName').addEventListener('change', function(){
    const key = this.value;
    const box = document.getElementById('evExtracted');
    const submitBtn = document.getElementById('evSubmitBtn');
    if(!key){ box.hidden = true; submitBtn.disabled = true; return; }
    const trial = KNOWN_TRIALS[key];
    document.getElementById('evExtractedFields').innerHTML =
      'Regimen: <strong>'+esc(trial.regimen)+'</strong><br>Primary endpoint: <strong>'+esc(trial.endpoint)+'</strong><br>Reported HR: <strong>'+trial.hr.toFixed(2)+'</strong> (95% CI '+trial.ciLow.toFixed(2)+'–'+trial.ciHigh.toFixed(2)+')<br>Median follow-up: <strong>'+esc(trial.followUp)+'</strong>';
    box.hidden = false;
    submitBtn.disabled = false;
  });
}
function submitAttachEvidence(caseId){
  const c = findCase(caseId); if(!c) return;
  const docType = document.getElementById('evDocType').value;
  const trialKey = document.getElementById('evTrialName').value;
  if(!trialKey) return;
  closeModal();
  openAgentPipeline('Checking Applicability', [
    {label:'Extraction Agent', detail:'Reading trial header, endpoint, and effect size…'},
    {label:'Applicability Gate Agent', detail:'Comparing this patient’s carried-forward data against trial eligibility…'},
    {label:'Guardrail Check', detail:'Confirming no individual prognosis will be shown without a passing match…'},
  ], ()=>{
    const trial = KNOWN_TRIALS[trialKey];
    const report = computeMatchReport(trialKey, c.biomarkers);
    const ev = {
      trialName:trialKey, docType, regimen:trial.regimen, endpoint:trial.endpoint,
      hr:trial.hr, ciLow:trial.ciLow, ciHigh:trial.ciHigh, followUp:trial.followUp,
      tier: evidenceTierForDocType(docType), confirmed:false,
      attachedBy: ME.name+' · '+ME.role, attachedAt:new Date(), attachedTo:'MDT Decision Lock',
      rows: report.rows, verdict: report.verdict,
    };
    if(!c.evidenceLinks) c.evidenceLinks = [];
    c.evidenceLinks.push(ev);
    toast('Applicability check complete: '+(report.verdict==='off-trial'?'Off-trial — prognosis suppressed.':report.verdict==='partial'?'Partial match — interpret with caution.':'Trial-concordant.'));
    renderPage();
  }, 'Review Match Report');
}
function confirmEvidence(caseId, idx){
  const c = findCase(caseId); if(!c || !c.evidenceLinks[idx]) return;
  c.evidenceLinks[idx].confirmed = true;
  toast('Extracted values confirmed.');
  renderPage();
}

/* ============================================================
   TAB: FITNESS ASSESSMENT (Stop 5 — physiologic risk calculator)
   "Stop 5 is a calculator, not a form": raw numbers in, the app
   hard-codes ERS/ESTS 2025 + ACCP thresholds and returns a
   green/amber/red classification — the clinician never picks the
   risk band by hand. Exercise-test blocks sequentially unlock
   based on the computed ppoFEV1/ppoDLCO values.
   ============================================================ */
const CARDIAC_CONDITIONS = ['Unstable angina','Recent MI','Decompensated HF','Significant arrhythmia','Severe valve disease','None'];
const CARDIOLOGY_CLEARANCE_OPTIONS = ['Not required','Pending','Cleared','Optimising'];
const RESECTION_EXTENT_OPTIONS_FITNESS = ['Wedge','Segmentectomy','Lobectomy','Bilobectomy','Pneumonectomy'];
function fitnessDraftFor(c){
  if(!STATE.fitnessDraft[c.id]){
    const fa = c.fitnessAssessment;
    STATE.fitnessDraft[c.id] = fa ? JSON.parse(JSON.stringify(fa)) : {
      cardiacConditions:[], rcriScore:'', cardiologyClearance:'Not required',
      ecog:'', heightCm:'', weightKg:'', weightLossPct:'', albumin:'', frailty:'Normal', spo2:'',
      fev1Pct:'', fev1L:'', fvcPct:'', fev1FvcRatio:'', dlcoPct:'', resectionExtent:'Lobectomy', segmentsResected:'', totalSegments:'19',
      exerciseTest:'', swtDistance:'', stairClimbHeight:'', desaturationPct:'',
      vo2peak:'', vo2peakPctPred:'', veVco2Slope:'',
      neoadjuvantPlanned:'No', clinicianNote:'',
    };
  }
  return STATE.fitnessDraft[c.id];
}
function bandDLCO(pct){
  if(pct===''||pct==null) return null;
  const v=Number(pct);
  if(v>=80) return {label:'Normal', color:'green'};
  if(v>=60) return {label:'Mild', color:'amber'};
  if(v>=40) return {label:'Moderate', color:'amber'};
  return {label:'High', color:'red'};
}
function bandPpoFitness(pct){
  if(pct==null) return null;
  if(pct>=60) return {label:'Normal', color:'green'};
  if(pct>=40) return {label:'Moderate', color:'amber'};
  return {label:'High', color:'red'};
}
function bandVO2(vo2, vo2pct){
  const v = vo2!==''&&vo2!=null ? Number(vo2) : null;
  const p = vo2pct!==''&&vo2pct!=null ? Number(vo2pct) : null;
  if(v==null && p==null) return null;
  if((v!=null && v>20) || (p!=null && p>75)) return {label:'Low', color:'green'};
  if((v!=null && v<10) || (p!=null && p<35)) return {label:'High / prohibitive', color:'red'};
  return {label:'Borderline / increased', color:'amber'};
}
function computeFitnessDerived(d){
  const segFrac = (d.segmentsResected!=='' && d.totalSegments) ? Math.min(1, Number(d.segmentsResected)/Number(d.totalSegments||19)) : null;
  const ppoFEV1 = (d.fev1Pct!=='' && segFrac!=null) ? Math.round(Number(d.fev1Pct)*(1-segFrac)) : null;
  const ppoDLCO = (d.dlcoPct!=='' && segFrac!=null) ? Math.round(Number(d.dlcoPct)*(1-segFrac)) : null;
  const dlcoBand = bandDLCO(d.dlcoPct);
  const ppoFEV1Band = bandPpoFitness(ppoFEV1);
  const ppoDLCOBand = bandPpoFitness(ppoDLCO);
  let exercisePath = null;
  if(ppoFEV1!=null && ppoDLCO!=null){
    if(ppoFEV1>60 && ppoDLCO>60) exercisePath='none';
    else if(ppoFEV1<30 || ppoDLCO<30) exercisePath='cpet';
    else exercisePath='lowtech';
  }
  let lowTechEscalate = false;
  if(exercisePath==='lowtech'){
    const swt = d.swtDistance!=='' ? Number(d.swtDistance) : null;
    const stair = d.stairClimbHeight!=='' ? Number(d.stairClimbHeight) : null;
    if((swt!=null && swt<400) || (stair!=null && stair<22)) lowTechEscalate = true;
  }
  const shownPath = lowTechEscalate ? 'cpet' : exercisePath;
  const vo2Band = bandVO2(d.vo2peak, d.vo2peakPctPred);
  const veVco2High = d.veVco2Slope!=='' && Number(d.veVco2Slope)>40;
  const cardiacActive = d.cardiacConditions && d.cardiacConditions.length && !d.cardiacConditions.includes('None');
  const cardiacBlocking = cardiacActive && d.cardiologyClearance!=='Cleared';
  let classification = null, drivenBy = [];
  if(cardiacBlocking){ classification='HIGH'; drivenBy.push('uncleared active cardiac condition'); }
  else if(ppoFEV1!=null && ppoFEV1<30){ classification='HIGH'; drivenBy.push('ppoFEV₁ '+ppoFEV1+'%'); }
  else if(ppoDLCO!=null && ppoDLCO<30){ classification='HIGH'; drivenBy.push('ppoDLCO '+ppoDLCO+'%'); }
  else if(vo2Band && vo2Band.color==='red'){ classification='HIGH'; drivenBy.push('VO₂peak '+(d.vo2peak||d.vo2peakPctPred+'% pred')); }
  else if(veVco2High){ classification='HIGH'; drivenBy.push('V̇E/V̇CO₂ slope '+d.veVco2Slope); }
  else if(exercisePath==='none' && ppoFEV1!=null && ppoDLCO!=null){ classification='LOW'; }
  else if(exercisePath==='lowtech' && !lowTechEscalate && (d.swtDistance!=='' || d.stairClimbHeight!=='')){ classification='MODERATE'; drivenBy.push('satisfactory low-tech exercise test'); }
  else if(vo2Band){ classification = vo2Band.color==='green'?'LOW':vo2Band.color==='amber'?'MODERATE':'HIGH'; if(!drivenBy.length) drivenBy.push('VO₂peak '+(d.vo2peak||d.vo2peakPctPred+'% pred')); }
  if(!drivenBy.length && classification==='LOW') drivenBy.push('cardiac cleared, both ppo values >60%');
  return {ppoFEV1, ppoDLCO, dlcoBand, ppoFEV1Band, ppoDLCOBand, exercisePath: shownPath, lowTechEscalate, vo2Band, veVco2High, cardiacActive, cardiacBlocking, classification, drivenBy};
}
function fitnessTierFlag(classification){
  if(classification==='LOW') return 1;
  if(classification==='MODERATE') return 2;
  if(classification==='HIGH') return 3;
  return null;
}
function ffText(c,key,label,opts){
  opts = opts||{};
  const d = fitnessDraftFor(c);
  return '<div class="field"><label>'+esc(label)+(opts.unit?' ('+esc(opts.unit)+')':'')+'</label>'+
    '<input type="'+(opts.type||'number')+'" data-fitness-field="'+key+'" data-case="'+c.id+'" value="'+esc(d[key]==null?'':d[key])+'" placeholder="'+(opts.ph||'')+'"></div>';
}
function ffSelect(c,key,label,options){
  const d = fitnessDraftFor(c);
  return '<div class="field"><label>'+esc(label)+'</label><select data-fitness-field="'+key+'" data-case="'+c.id+'">'+
    options.map(o=>'<option value="'+esc(o)+'" '+(d[key]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
}
function fitnessBandChip(band){
  if(!band) return '<span class="badge badge-neutral">Pending input</span>';
  const cls = band.color==='green'?'badge-tier1':band.color==='amber'?'badge-tier2':'badge-tier3';
  return '<span class="badge '+cls+'">'+esc(band.label)+'</span>';
}
function renderTabFitness(c){
  const d = fitnessDraftFor(c);
  const done = !!c.fitnessAssessment;
  const der = computeFitnessDerived(d);
  const classColor = der.classification==='LOW'?'var(--good)':der.classification==='MODERATE'?'var(--warn)':der.classification==='HIGH'?'var(--crit)':'var(--ink-faint)';
  const classBg = der.classification==='LOW'?'var(--good-soft)':der.classification==='MODERATE'?'var(--warn-soft)':der.classification==='HIGH'?'var(--crit-soft)':'var(--surface-2)';
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Fitness / Functional Assessment')+
    (done ? '<div class="callout callout-good">'+icon('checkCircle',14)+' Fitness assessment completed by '+esc(c.fitnessAssessment.completedBy)+' &middot; '+fmtDateTime(c.fitnessAssessment.completedAt)+'</div>' : '<div class="callout callout-gold">'+icon('clock',14)+' Stop 5 is a calculator, not a form — enter raw physiologic numbers below; the classification is auto-computed, never picked by hand.</div>')+
    '<div class="card card-pad" style="background:'+classBg+';border-color:'+classColor+';display:flex;flex-direction:column;gap:6px;">'+
      '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Fitness classification</div>'+
      '<div style="font-size:20px;font-weight:700;font-family:var(--font-display);color:'+classColor+';">'+(der.classification ? der.classification+' surgical risk' : 'Awaiting required fields')+'</div>'+
      (der.drivenBy.length ? '<div style="font-size:12px;color:var(--ink-muted);">Driven by: '+esc(der.drivenBy.join('; '))+'</div>' : '')+
      (der.classification ? '<div style="font-size:11.5px;color:var(--ink-faint);">Provisional tier flag: Tier '+fitnessTierFlag(der.classification)+(der.classification==='HIGH'?' — auto-escalates to synchronous MDT.':'')+'</div>' : '')+
    '</div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block A &middot; Gate 1: Cardiac clearance</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div style="font-size:11px;color:var(--ink-faint);">Active cardiac condition screen</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:10px;">'+CARDIAC_CONDITIONS.map(cc=>
        '<label class="checkline"><input type="checkbox" data-fitness-check="cardiacConditions" data-case="'+c.id+'" value="'+esc(cc)+'" '+(d.cardiacConditions.includes(cc)?'checked':'')+'> '+esc(cc)+'</label>'
      ).join('')+'</div>'+
      '<div class="fields-grid">'+
        ffText(c,'rcriScore','Revised Cardiac Risk Index (RCRI)',{ph:'0–6'})+
        ffSelect(c,'cardiologyClearance','Cardiology clearance status', CARDIOLOGY_CLEARANCE_OPTIONS)+
      '</div>'+
      (der.cardiacActive ? '<div class="callout" style="background:'+(der.cardiacBlocking?'var(--crit-soft)':'var(--good-soft)')+';border:1px solid transparent;color:'+(der.cardiacBlocking?'var(--crit-ink)':'var(--good-ink)')+';font-size:11.5px;">'+icon(der.cardiacBlocking?'alert':'checkCircle',13)+' '+(der.cardiacBlocking?'Active cardiac condition — blocks progression to pulmonary testing until cardiology clearance = Cleared.':'Cardiology cleared — pulmonary testing may proceed.')+'</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block B &middot; Performance status &amp; baseline factors</h3>'+
    '<div class="card card-pad"><div class="fields-grid">'+
      ffSelect(c,'ecog','ECOG performance status', ['0','1','2','3','4'])+
      ffText(c,'heightCm','Height',{unit:'cm'})+ffText(c,'weightKg','Weight',{unit:'kg'})+
      ffText(c,'weightLossPct','Weight loss',{unit:'%'})+ffText(c,'albumin','Albumin',{unit:'g/dL'})+
      ffSelect(c,'frailty','Frailty screen (age ≥70 / clinician concern)', ['Normal','Abnormal'])+
      ffText(c,'spo2','Resting SpO₂ on room air',{unit:'%'})+
    '</div>'+
    (d.heightCm && d.weightKg ? kv('BMI', (Number(d.weightKg)/Math.pow(Number(d.heightCm)/100,2)).toFixed(1)+' kg/m²') : '')+
    (d.weightLossPct!=='' && Number(d.weightLossPct)>10 ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' >10% weight loss — nutritional flag.</div>' : '')+
    (d.albumin!=='' && Number(d.albumin)<3.5 ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Albumin <3.5 g/dL — nutritional flag.</div>' : '')+
    (d.spo2!=='' && Number(d.spo2)<90 ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);font-size:11.5px;">'+icon('alert',13)+' SpO₂ <90% — hypoxemia, increased postoperative risk.</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block C &middot; Gate 2: Core pulmonary function (mandatory in all candidates)</h3>'+
    '<div class="card card-pad"><div class="fields-grid">'+
      ffText(c,'fev1Pct','FEV₁ (post-bronchodilator)',{unit:'% predicted'})+ffText(c,'fev1L','FEV₁ absolute',{unit:'L'})+
      ffText(c,'fvcPct','FVC',{unit:'% predicted'})+ffText(c,'fev1FvcRatio','FEV₁/FVC ratio')+
      ffText(c,'dlcoPct','DLCO',{unit:'% predicted'})+
      ffSelect(c,'resectionExtent','Planned resection extent', RESECTION_EXTENT_OPTIONS_FITNESS)+
      ffText(c,'segmentsResected','Segments to be resected',{ph:'of 19'})+ffText(c,'totalSegments','Total functional segments',{ph:'19'})+
    '</div>'+
    '<div class="grid grid-3" style="margin-top:10px;">'+
      kv('ppoFEV₁ (auto)', der.ppoFEV1!=null ? der.ppoFEV1+'%' : 'Pending input')+
      kv('ppoDLCO (auto)', der.ppoDLCO!=null ? der.ppoDLCO+'%' : 'Pending input')+
      kv('DLCO band', '')+
    '</div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:-6px;">'+fitnessBandChip(der.dlcoBand)+fitnessBandChip(der.ppoFEV1Band)+'</div>'+
    '</div></div>'+

    (der.exercisePath==='lowtech' ? '<div><h3 style="font-size:13px;margin-bottom:8px;">Block D1 &middot; Low-technology exercise test <span class="badge badge-tier2" style="margin-left:6px;">Unlocked — ppo 30–60%</span></h3>'+
      '<div class="card card-pad"><div class="fields-grid">'+
        ffSelect(c,'exerciseTest','Test performed', ['Shuttle walk','Stair climb','6-min walk'])+
        ffText(c,'swtDistance','Shuttle walk distance',{unit:'m'})+
        ffText(c,'stairClimbHeight','Stair-climb height',{unit:'m'})+
        ffText(c,'desaturationPct','Exercise desaturation',{unit:'% drop'})+
      '</div>'+
      (der.lowTechEscalate ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Poor low-tech performance (SWT <400m or stair climb <22m) — CPET (Block D2) now required.</div>' : '')+
      (d.desaturationPct!=='' && Number(d.desaturationPct)>4 ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Exercise desaturation >4% drop flagged.</div>' : '')+
    '</div></div>' : '')+

    (der.exercisePath==='cpet' ? '<div><h3 style="font-size:13px;margin-bottom:8px;">Block D2 &middot; Cardiopulmonary exercise test (CPET) <span class="badge badge-tier3" style="margin-left:6px;">Unlocked</span></h3>'+
      '<div class="card card-pad"><div class="fields-grid">'+
        ffText(c,'vo2peak','VO₂peak (measured)',{unit:'mL/kg/min'})+
        ffText(c,'vo2peakPctPred','VO₂peak (% predicted)',{unit:'%'})+
        ffText(c,'veVco2Slope','V̇E/V̇CO₂ slope')+
      '</div>'+
      '<div style="margin-top:8px;">'+fitnessBandChip(der.vo2Band)+(der.veVco2High?' <span class="badge badge-tier3">V̇E/V̇CO₂ slope >40 — high risk</span>':'')+'</div>'+
    '</div></div>' : '')+

    (der.exercisePath==='none' ? '<div class="callout callout-good">'+icon('checkCircle',14)+' Both ppo values >60% — no exercise test required (Block D skipped per ACCP branching logic).</div>' : '')+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block E &middot; Neoadjuvant re-assessment flag</h3>'+
    '<div class="card card-pad">'+
      ffSelect(c,'neoadjuvantPlanned','Neoadjuvant therapy planned/given?', ['No','Yes'])+
      (d.neoadjuvantPlanned==='Yes' ? '<div class="callout callout-info" style="margin-top:8px;">Re-test PFTs (FEV₁ + DLCO) after induction — DLCO can fall ~20% post-induction. Scheduled task created before Stop 10.</div>' : '')+
    '</div></div>'+

    '<div class="field"><label>Clinician note (optional)</label><textarea data-fitness-field="clinicianNote" data-case="'+c.id+'" rows="2" style="padding:8px 10px;border:1px solid var(--border-strong);border-radius:7px;font-family:inherit;">'+esc(d.clinicianNote)+'</textarea></div>'+

    (!done ? '<button class="btn btn-gold btn-block" data-submit-fitness="'+c.id+'">'+icon('checkCircle',15)+' Save Fitness Assessment</button>' :
      '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-edit-fitness="'+c.id+'">'+icon('sparkle',14)+' Re-open for edits</button>')+
  '</div>';
}
function submitFitnessAssessment(caseId){
  const c = findCase(caseId); if(!c) return;
  const d = fitnessDraftFor(c);
  const der = computeFitnessDerived(d);
  const missing = [];
  if(!d.cardiacConditions.length) missing.push('active cardiac condition screen');
  if(d.cardiacConditions.length && !d.cardiacConditions.includes('None') && d.cardiologyClearance==='Not required') missing.push('cardiology clearance status');
  if(d.ecog==='') missing.push('ECOG');
  if(d.spo2==='') missing.push('resting SpO₂');
  if(d.fev1Pct===''||d.dlcoPct==='') missing.push('FEV₁/DLCO');
  if(d.segmentsResected==='') missing.push('segments to be resected');
  if(der.exercisePath==='lowtech' && d.swtDistance==='' && d.stairClimbHeight==='') missing.push('low-technology exercise test');
  if(der.exercisePath==='cpet' && d.vo2peak==='' && d.vo2peakPctPred==='') missing.push('CPET VO₂peak');
  if(missing.length){ toast('Complete required fields first: '+missing.join(', ')+'.'); return; }
  c.fitnessAssessment = Object.assign({}, d, {
    ppoFEV1: der.ppoFEV1, ppoDLCO: der.ppoDLCO, classification: der.classification, drivenBy: der.drivenBy.join('; '),
    completedBy: ME.name+' · '+ME.role, completedAt: new Date(),
  });
  markStageComplete(c, 'Fitness / Functional Assessment', der.classification+' surgical risk — driven by '+(der.drivenBy.join('; ')||'cardiac cleared, ppo values normal')+'.');
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Fitness assessment (Stop 5) completed: '+der.classification+' surgical risk.'+(der.classification==='HIGH'?' Auto-escalation flag raised for Tier 3.':''), kind:'system'});
  toast('Fitness assessment saved: '+der.classification+' surgical risk.');
  renderPage();
}

/* ============================================================
   TAB: MOLECULAR NGS + PD-L1 (Stop 6 — biomarker profile that gates
   the systemic-therapy pathway). The single most important UI element
   here is the ICI-eligibility banner, auto-recomputed from EGFR/ALK:
   GREEN (no driver — ICI permissible), RED (driver present — ICI not
   recommended), AMBER (EGFR/ALK still pending). Everything is
   structured except two one-line free-text boxes.
   ============================================================ */
const MOLECULAR_SPECIMEN_TYPES = ['Core biopsy','EBUS-TBNA cell block','Cytology smear','Resection','Pleural fluid','Plasma (ctDNA)'];
const MOLECULAR_LAB_OPTIONS = ['In-house','Named send-out lab'];
const MOLECULAR_ADEQUACY_OPTIONS = ['Adequate','Insufficient – reflex to plasma','Insufficient – rebiopsy requested'];
const MOLECULAR_TESTING_METHODS = ['DNA-based NGS (multigene panel)','RNA-based NGS (fusion / exon-skipping)','Real-time PCR (targeted hotspots)','FISH (rearrangement / amplification)','IHC (ALK/ROS1/HER2/c-Met screen)','Plasma ctDNA NGS'];
const MOLECULAR_GENES = [
  {key:'EGFR', label:'EGFR', options:['Not tested','Negative','Exon 19 deletion','L858R (exon 21)','Exon 20 insertion','S768I','L861Q','G719X','T790M','Other'], required:true},
  {key:'ALK', label:'ALK fusion', options:['Not tested','Negative','Positive'], required:true},
  {key:'RET', label:'RET fusion', options:['Not tested','Negative','Positive'], required:true},
  {key:'ROS1', label:'ROS1 fusion', options:['Not tested','Negative','Positive'], required:false},
  {key:'BRAF', label:'BRAF', options:['Not tested','Negative','V600E','Non-V600E'], required:false},
  {key:'KRAS', label:'KRAS', options:['Not tested','Negative','G12C','Other'], required:false},
  {key:'MET', label:'MET exon 14 skipping', options:['Not tested','Negative','Positive'], required:false},
  {key:'ERBB2', label:'ERBB2 (HER2) mutation', options:['Not tested','Negative','Exon 20 ins/dup','Other activating'], required:false},
  {key:'NTRK', label:'NTRK1/2/3 fusion', options:['Not tested','Negative','Positive'], required:false},
  {key:'NRG1', label:'NRG1 fusion', options:['Not tested','Negative','Positive'], required:false},
];
const MOLECULAR_IHC_ONLY = [
  {key:'HER2_IHC', label:'HER2 IHC', options:['Not tested','0','1+','2+','3+']},
  {key:'CMET_IHC', label:'c-Met (HGF receptor) IHC', options:['Not tested','<50%','≥50% 3+']},
];
const MOLECULAR_PDL1_TESTED_OPTIONS = ['Pending','Yes','No'];
const MOLECULAR_PDL1_ASSAYS = ['22C3','28-8','SP263','SP142','Other'];
const MOLECULAR_CTDNA_FRACTION_OPTIONS = ['Detectable','Low or undetectable'];
function molecularDraftFor(c){
  if(!STATE.molecularDraft) STATE.molecularDraft = {};
  if(!STATE.molecularDraft[c.id]){
    const ma = c.molecularAssessment;
    if(ma){ STATE.molecularDraft[c.id] = JSON.parse(JSON.stringify(ma)); }
    else {
      const genes = {};
      MOLECULAR_GENES.forEach(g=>{ genes[g.key] = {result:'Not tested', detail:'', vus:false}; });
      const ihc = {};
      MOLECULAR_IHC_ONLY.forEach(g=>{ ihc[g.key] = 'Not tested'; });
      STATE.molecularDraft[c.id] = {
        linkedSpecimen:'', specimenType:MOLECULAR_SPECIMEN_TYPES[1], orderDate:'', receivedDate:'', reportedDate:'',
        testingLab:'In-house', accreditedLabConfirmed:false,
        tumorCellularityPct:'', adequacy:'Adequate', pdl1CellsSufficient:false,
        testingMethods:[],
        genes, ihc,
        pdl1Tested:'Pending', pdl1Assay:'22C3', pdl1Tps:'',
        ctdnaPerformed:false, ctdnaFractionDetectable:'Detectable', ctdnaDriver:'Not tested',
        interpretiveComment:'', notableFindings:'',
      };
    }
  }
  return STATE.molecularDraft[c.id];
}
function mxField(c,key,label,opts){
  opts=opts||{};
  const d = molecularDraftFor(c);
  return '<div class="field"><label>'+esc(label)+(opts.unit?' ('+esc(opts.unit)+')':'')+'</label>'+
    '<input type="'+(opts.type||'text')+'" data-molecular-field="'+key+'" data-case="'+c.id+'" value="'+esc(d[key]==null?'':d[key])+'" placeholder="'+(opts.ph||'')+'"></div>';
}
function mxSelect(c,key,label,options){
  const d = molecularDraftFor(c);
  return '<div class="field"><label>'+esc(label)+'</label><select data-molecular-field="'+key+'" data-case="'+c.id+'">'+
    options.map(o=>'<option value="'+esc(o)+'" '+(d[key]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
}
function mxCheck(c,key,label){
  const d = molecularDraftFor(c);
  return '<label class="checkline"><input type="checkbox" data-molecular-check="'+key+'" data-case="'+c.id+'" '+(d[key]?'checked':'')+'> '+esc(label)+'</label>';
}
function mxChecklist(c,key,label,options){
  const d = molecularDraftFor(c);
  return '<div><div style="font-size:11px;color:var(--ink-faint);margin-bottom:4px;">'+esc(label)+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;">'+
    options.map(o=>'<label class="checkline"><input type="checkbox" data-molecular-listcheck="'+key+'" data-case="'+c.id+'" value="'+esc(o)+'" '+(d[key].includes(o)?'checked':'')+'> '+esc(o)+'</label>').join('')+'</div></div>';
}
function mxGeneRow(c,g){
  const d = molecularDraftFor(c);
  const gd = d.genes[g.key];
  const isPositive = gd.result!=='Not tested' && gd.result!=='Negative';
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;background:'+(isPositive?'var(--crit-soft)':'var(--surface)')+';">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">'+
      '<div style="font-weight:700;font-size:12.5px;">'+esc(g.label)+(g.required?' <span style="color:var(--crit-ink);">*</span>':'')+'</div>'+
      '<select data-molecular-gene-field="'+g.key+':result" data-case="'+c.id+'" style="min-width:180px;">'+
        g.options.map(o=>'<option value="'+esc(o)+'" '+(gd.result===o?'selected':'')+'>'+esc(o)+'</option>').join('')+
      '</select>'+
    '</div>'+
    (isPositive ? '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">'+
      '<input type="text" data-molecular-gene-field="'+g.key+':detail" data-case="'+c.id+'" value="'+esc(gd.detail)+'" placeholder="Variant detail / VAF% / fusion partner (optional)" style="flex:1;min-width:220px;padding:6px 9px;border:1px solid var(--border-strong);border-radius:7px;font-size:12px;">'+
      '<label class="checkline" style="font-size:11.5px;"><input type="checkbox" data-molecular-gene-check="'+g.key+':vus" data-case="'+c.id+'" '+(gd.vus?'checked':'')+'> VUS (not actionable)</label>'+
    '</div>' : '')+
  '</div>';
}
function molecularActionableDrivers(d){
  return MOLECULAR_GENES.filter(g=>{
    const gd = d.genes[g.key];
    return gd.result!=='Not tested' && gd.result!=='Negative' && !gd.vus;
  });
}
function molecularICIStatus(d){
  const egfr = d.genes.EGFR.result, alk = d.genes.ALK.result;
  const egfrPositive = egfr!=='Not tested' && egfr!=='Negative' && !d.genes.EGFR.vus;
  const alkPositive = alk==='Positive' && !d.genes.ALK.vus;
  if(egfrPositive || alkPositive) return 'RED';
  if(egfr==='Not tested' || alk==='Not tested') return 'AMBER';
  return 'GREEN';
}
function pdl1Category(tps){
  if(tps==='' || tps==null) return null;
  const n = Number(tps);
  if(n<1) return 'Negative (<1%)';
  if(n<50) return 'Low (1–49%)';
  return 'High (≥50%)';
}
function molecularTAT(d){
  if(!d.orderDate || !d.reportedDate) return null;
  return Math.round((new Date(d.reportedDate) - new Date(d.orderDate)) / 86400000);
}
function molecularCompletionGate(d){
  const missing = [];
  if(!d.orderDate||!d.receivedDate||!d.reportedDate) missing.push('specimen/timeline dates (order, received, reported)');
  if(!d.accreditedLabConfirmed) missing.push('CLIA/accredited-lab confirmation');
  if(d.adequacy!=='Adequate') missing.push('tissue adequacy (must be Adequate, or resolve the insufficient-tissue reflex/rebiopsy task first)');
  if(d.genes.EGFR.result==='Not tested') missing.push('EGFR result');
  if(d.genes.ALK.result==='Not tested') missing.push('ALK result');
  if(d.genes.RET.result==='Not tested') missing.push('RET result');
  if(!(d.pdl1Tested==='No' || (d.pdl1Tested==='Yes' && d.pdl1Tps!==''))) missing.push('PD-L1 result (tested with a TPS value, or documented as untestable)');
  return missing;
}
function molecularSummaryFacts(d){
  const drivers = molecularActionableDrivers(d);
  const facts = [drivers.length ? 'Actionable driver: '+drivers.map(g=>g.label).join(', ') : 'Driver-negative'];
  if(d.pdl1Tested==='Yes' && d.pdl1Tps!=='') facts.push('PD-L1 '+d.pdl1Tps+'% ('+pdl1Category(d.pdl1Tps)+')');
  else if(d.pdl1Tested==='Pending') facts.push('PD-L1 pending');
  return facts;
}
function renderTabMolecular(c){
  const d = molecularDraftFor(c);
  const done = !!c.molecularAssessment;
  const gate = molecularCompletionGate(d);
  const ici = molecularICIStatus(d);
  const iciMeta = {GREEN:{bg:'var(--good-soft)',ink:'var(--good-ink)',dot:'var(--good)',text:'No EGFR/ALK driver — perioperative ICI pathway permissible.'},
    RED:{bg:'var(--crit-soft)',ink:'var(--crit-ink)',dot:'var(--crit)',text:'EGFR/ALK driver present — neoadjuvant chemo-immunotherapy NOT recommended; route to targeted-therapy / surgery-then-adjuvant pathway.'},
    AMBER:{bg:'var(--warn-soft)',ink:'var(--warn-ink)',dot:'var(--warn)',text:'EGFR/ALK pending — do not commit to an ICI-containing regimen yet.'}}[ici];
  const drivers = molecularActionableDrivers(d);
  const tat = molecularTAT(d);
  const showCtdna = d.testingMethods.includes('Plasma ctDNA NGS') || d.specimenType==='Plasma (ctDNA)';
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Molecular NGS + PD-L1')+
    (done ? '<div class="callout callout-good">'+icon('checkCircle',14)+' Molecular report completed by '+esc(c.molecularAssessment.completedBy)+' &middot; '+fmtDateTime(c.molecularAssessment.completedAt)+'</div>' :
      '<div class="callout callout-gold">'+icon('clock',14)+' Stop 6 gates every downstream treatment decision — EGFR, ALK, RET and PD-L1 are the minimum required biomarkers before any perioperative plan.</div>')+

    '<div class="card card-pad" style="background:'+iciMeta.bg+';border-color:'+iciMeta.dot+';display:flex;align-items:center;gap:12px;">'+
      '<div style="width:34px;height:34px;border-radius:50%;background:'+iciMeta.dot+';color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(ici==='GREEN'?'checkCircle':ici==='RED'?'x':'clock',18)+'</div>'+
      '<div><div style="font-weight:700;font-size:13.5px;color:'+iciMeta.ink+';">ICI-eligibility banner: '+ici+'</div><div style="font-size:12px;color:var(--ink-muted);">'+esc(iciMeta.text)+'</div></div>'+
    '</div>'+

    (!done && gate.length ? '<div class="callout callout-info" style="font-size:11.5px;">'+icon('alert',13)+' Molecular workup incomplete — not MDT-eligible for treatment planning. Missing: '+esc(gate.join('; '))+'.</div>' : '')+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block A &middot; Specimen &amp; timeline logging</h3>'+
    '<div class="card card-pad"><div class="fields-grid">'+
      mxSelect(c,'specimenType','Specimen type used for testing', MOLECULAR_SPECIMEN_TYPES)+
      mxField(c,'linkedSpecimen','Linked specimen (from Stop 2/3)',{ph:c.biopsyAssessment||c.pathologyAssessment?'e.g. '+(c.pathologyAssessment?'Stop 3 pathology specimen':'Stop 2 EBUS-TBNA specimen'):'No prior specimen on file'})+
      mxField(c,'orderDate','Date molecular test ordered',{type:'date'})+
      mxField(c,'receivedDate','Date specimen received by lab',{type:'date'})+
      mxField(c,'reportedDate','Date results reported',{type:'date'})+
      mxSelect(c,'testingLab','Testing laboratory', MOLECULAR_LAB_OPTIONS)+
    '</div>'+
    mxCheck(c,'accreditedLabConfirmed','CLIA / accredited lab confirmed')+
    (tat!=null ? '<div style="margin-top:8px;font-size:11.5px;color:'+(tat>10?'var(--warn-ink)':'var(--ink-muted)')+';">'+(tat>10?icon('alert',12):icon('clock',12))+' Molecular TAT: '+tat+' business day(s)'+(tat>10?' — exceeds the 10-day benchmark':'')+'</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block B &middot; Tissue adequacy</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div class="fields-grid">'+
        mxField(c,'tumorCellularityPct','Tumor cellularity',{type:'number',unit:'%'})+
        mxSelect(c,'adequacy','Adequacy for molecular testing', MOLECULAR_ADEQUACY_OPTIONS)+
      '</div>'+
      mxCheck(c,'pdl1CellsSufficient','PD-L1 viable tumor cells ≥100 present')+
      (d.tumorCellularityPct!=='' && Number(d.tumorCellularityPct)<20 ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Cellularity &lt;20% — standard NGS/PCR methods need ≥20% cancer cells unless high-sensitivity method used.</div>' : '')+
      (d.adequacy!=='Adequate' ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);font-size:11.5px;">'+icon('alert',13)+' Insufficient tissue — reflex plasma ctDNA or rebiopsy task generated; stop stays open until resolved.</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block C &middot; Testing method used</h3>'+
    '<div class="card card-pad">'+mxChecklist(c,'testingMethods','Method(s) — more than one may apply', MOLECULAR_TESTING_METHODS)+
      (d.testingMethods.includes('DNA-based NGS (multigene panel)') && !d.testingMethods.includes('RNA-based NGS (fusion / exon-skipping)') && !molecularActionableDrivers(d).length && d.genes.EGFR.result!=='Not tested' ?
        '<div class="callout callout-info" style="margin-top:8px;font-size:11.5px;">DNA-NGS driver-negative — RNA-based NGS recommended to capture fusions (ALK/ROS1/RET/NRG1/NTRK) and MET exon 14 skipping.</div>' : '')+
      (d.testingMethods.includes('Real-time PCR (targeted hotspots)') && d.testingMethods.length===1 ?
        '<div class="callout callout-info" style="margin-top:8px;font-size:11.5px;">Real-time PCR alone may under-detect EGFR exon 20 insertions and novel fusions.</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block D &middot; Molecular driver results</h3>'+
    '<div style="display:flex;flex-direction:column;gap:8px;">'+MOLECULAR_GENES.map(g=>mxGeneRow(c,g)).join('')+'</div>'+
    (drivers.length>1 ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;margin-top:8px;">'+icon('alert',13)+' Co-alteration — confirm: more than one actionable driver marked positive ('+drivers.map(g=>g.label).join(', ')+').</div>' : '')+
    '<div style="margin-top:8px;font-size:12.5px;font-weight:600;">'+(drivers.length ? 'Actionable driver detected: '+drivers.map(g=>g.label).join(', ') : 'No actionable driver detected.')+'</div>'+
    '<div style="margin-top:10px;"><div style="font-size:11px;color:var(--ink-faint);margin-bottom:6px;">IHC-only markers</div><div class="fields-grid">'+
      MOLECULAR_IHC_ONLY.map(g=>'<div class="field"><label>'+esc(g.label)+'</label><select data-molecular-ihc-field="'+g.key+'" data-case="'+c.id+'">'+g.options.map(o=>'<option value="'+esc(o)+'" '+(d.ihc[g.key]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>').join('')+
    '</div></div>'+

    '<div style="margin-top:14px;"><h3 style="font-size:13px;margin-bottom:8px;">Block E &middot; PD-L1</h3>'+
    '<div class="card card-pad"><div class="fields-grid">'+
      mxSelect(c,'pdl1Tested','PD-L1 tested', MOLECULAR_PDL1_TESTED_OPTIONS)+
      (d.pdl1Tested==='Yes' ? mxSelect(c,'pdl1Assay','PD-L1 antibody / assay', MOLECULAR_PDL1_ASSAYS) : '')+
      (d.pdl1Tested==='Yes' ? mxField(c,'pdl1Tps','PD-L1 Tumor Proportion Score (TPS)',{type:'number',unit:'%'}) : '')+
    '</div>'+
    (d.pdl1Tested==='Yes' && d.pdl1Tps!=='' ? '<div style="margin-top:6px;font-size:12px;font-weight:600;">Category: '+esc(pdl1Category(d.pdl1Tps))+' &middot; assay '+esc(d.pdl1Assay)+'</div>' : '')+
    '<div class="callout callout-info" style="margin-top:8px;font-size:11px;">PD-L1 predicts ICI response, but a LOW/NEGATIVE score does not by itself exclude neoadjuvant immunotherapy.</div>'+
    '</div></div>'+

    (showCtdna ? '<div><h3 style="font-size:13px;margin-bottom:8px;">Block F &middot; ctDNA / plasma</h3>'+
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
        mxCheck(c,'ctdnaPerformed','ctDNA assay performed')+
        '<div class="fields-grid">'+
          mxSelect(c,'ctdnaFractionDetectable','ctDNA tumor fraction', MOLECULAR_CTDNA_FRACTION_OPTIONS)+
          mxSelect(c,'ctdnaDriver','Driver detected on plasma', ['Not tested'].concat(MOLECULAR_GENES.map(g=>g.label)))+
        '</div>'+
        '<div class="callout callout-info" style="font-size:11px;">ctDNA does not replace tissue histologic diagnosis; a negative plasma result does not exclude a tissue-detectable driver.</div>'+
      '</div></div>' : '')+

    '<div class="fields-grid">'+
      '<div class="field"><label>Interpretive comment (optional, one line)</label><input type="text" data-molecular-field="interpretiveComment" data-case="'+c.id+'" value="'+esc(d.interpretiveComment)+'"></div>'+
      '<div class="field"><label>Notable findings not captured above (optional)</label><input type="text" data-molecular-field="notableFindings" data-case="'+c.id+'" value="'+esc(d.notableFindings)+'"></div>'+
    '</div>'+

    (!done ? '<button class="btn btn-gold btn-block" data-submit-molecular="'+c.id+'">'+icon('checkCircle',15)+' Save Molecular / PD-L1 Assessment</button>' :
      '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-edit-molecular="'+c.id+'">'+icon('sparkle',14)+' Re-open for edits</button>')+
  '</div>';
}
function submitMolecularAssessment(caseId){
  const c = findCase(caseId); if(!c) return;
  const d = molecularDraftFor(c);
  const missing = molecularCompletionGate(d);
  if(missing.length){ toast('Complete required fields first: '+missing.join('; ')+'.'); return; }
  c.molecularAssessment = Object.assign({}, JSON.parse(JSON.stringify(d)), { completedBy: ME.name+' · '+ME.role, completedAt: new Date() });
  /* Merge — never replace — c.biomarkers, since other stops and the evidence
     engine read stage/histology/age/ecog/resection from that same object. */
  const drivers = molecularActionableDrivers(d);
  c.biomarkers = Object.assign({}, c.biomarkers, {
    egfr: d.genes.EGFR.result==='Not tested' ? (c.biomarkers&&c.biomarkers.egfr) : (d.genes.EGFR.result==='Negative' ? 'Negative' : 'Positive'),
    alk: d.genes.ALK.result==='Not tested' ? (c.biomarkers&&c.biomarkers.alk) : d.genes.ALK.result,
    pdl1: (d.pdl1Tested==='Yes' && d.pdl1Tps!=='') ? Number(d.pdl1Tps) : (c.biomarkers&&c.biomarkers.pdl1),
  });
  const ici = molecularICIStatus(d);
  const tierSuggest = drivers.length ? 1 : (ici==='RED' ? 3 : 2);
  const summary = (drivers.length ? 'Actionable driver: '+drivers.map(g=>g.label).join(', ') : 'No actionable driver detected')+
    '. PD-L1 '+(d.pdl1Tested==='Yes' ? d.pdl1Tps+'% ('+pdl1Category(d.pdl1Tps)+')' : d.pdl1Tested)+
    '. ICI-eligibility: '+ici+'.';
  markStageComplete(c, 'Molecular NGS + PD-L1', summary);
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Stop 6 molecular/PD-L1 completed. '+summary+' Suggests Tier '+tierSuggest+'.', kind:'system'});
  toast('Molecular report saved. ICI-eligibility: '+ici+'.');
  renderPage();
}

/* ============================================================
   TAB: BIOPSY / EBUS (Stop 2 — tissue diagnosis + pathologic N)
   Two tabs sharing one procedure header: Tab A (bronchoscopy —
   airway survey + primary-lesion sampling) and Tab B (EBUS-TBNA —
   systematic nodal staging, repeatable per-station rows). The
   single most important architectural point per spec: nodal
   sampling is a repeatable row, not a fixed field set.
   ============================================================ */
const EBUS_STATIONS = [
  {code:'2R', side:'R', zone:'N2'}, {code:'2L', side:'L', zone:'N2'}, {code:'3P', side:'M', zone:'N2'},
  {code:'4R', side:'R', zone:'N2'}, {code:'4L', side:'L', zone:'N2'}, {code:'7', side:'M', zone:'N2'},
  {code:'10R', side:'R', zone:'N1'}, {code:'10L', side:'L', zone:'N1'},
  {code:'11R', side:'R', zone:'N1'}, {code:'11L', side:'L', zone:'N1'}, {code:'12-13', side:'M', zone:'N1'},
];
const LESION_APPEARANCE_OPTIONS = ['Exophytic endobronchial mass','Submucosal spread','Extrinsic (peribronchial) compression'];
const AIRWAY_SEGMENT_OPTIONS = ['Trachea','Carina','R main bronchus','L main bronchus','RUL','RML','RLL','LUL/Lingula','LLL','Segmental'];
const SAMPLING_METHODS = ['Forceps biopsy','Brushing','Washing','Endobronchial TBNA','Transbronchial biopsy (peripheral)','Radial-EBUS / navigational'];
const ROSE_RESULT_OPTIONS = ['Malignant','Atypical','Benign','Inadequate'];
const NODE_ROSE_OPTIONS = ['Malignant','Lymphocytes adequate','Atypical','Inadequate'];
const CYTOLOGY_RESULT_OPTIONS = ['Pending','Positive','Negative','Non-diagnostic'];
function biopsyDraftFor(c){
  if(!STATE.biopsyDraft) STATE.biopsyDraft = {};
  if(!STATE.biopsyDraft[c.id]){
    const ba = c.biopsyAssessment;
    if(ba){ STATE.biopsyDraft[c.id] = JSON.parse(JSON.stringify(ba)); }
    else {
      const nodes = {};
      EBUS_STATIONS.forEach(s=>{ nodes[s.code] = {examined:false, sizeMm:'', passes:'', rose:'', cytology:'Pending'}; });
      STATE.biopsyDraft[c.id] = {
        primarySide:'R', procedureDateTime:'', sedation:'Moderate', indication:'Both',
        airwaySurveyDone:false, visibleLesion:'None', lesionAppearance:LESION_APPEARANCE_OPTIONS[0], lesionLocation:AIRWAY_SEGMENT_OPTIONS[0], airwayPatency:'Patent',
        samplingMethods:[], forcepsCount:'', radialEbus:false, roseDone:'No', roseResult:'',
        systematicSurveyDone:false, combinedEusB:false, needleGauge:'22G',
        nodes,
        molecularPasses:false, sentForPdl1:false, ngsCollected:false,
        cnConfirmed:'',
        airwayNarrative:'', notableFindings:'',
      };
    }
  }
  return STATE.biopsyDraft[c.id];
}
function bxField(c,key,label,opts){
  opts=opts||{};
  const d = biopsyDraftFor(c);
  return '<div class="field"><label>'+esc(label)+(opts.unit?' ('+esc(opts.unit)+')':'')+'</label>'+
    '<input type="'+(opts.type||'number')+'" data-biopsy-field="'+key+'" data-case="'+c.id+'" value="'+esc(d[key]==null?'':d[key])+'" placeholder="'+(opts.ph||'')+'"></div>';
}
function bxSelect(c,key,label,options){
  const d = biopsyDraftFor(c);
  return '<div class="field"><label>'+esc(label)+'</label><select data-biopsy-field="'+key+'" data-case="'+c.id+'">'+
    options.map(o=>'<option value="'+esc(o)+'" '+(d[key]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
}
function bxCheck(c,key,label){
  const d = biopsyDraftFor(c);
  return '<label class="checkline"><input type="checkbox" data-biopsy-check="'+key+'" data-case="'+c.id+'" '+(d[key]?'checked':'')+'> '+esc(label)+'</label>';
}
function bxChecklist(c,key,label,options){
  const d = biopsyDraftFor(c);
  return '<div><div style="font-size:11px;color:var(--ink-faint);margin-bottom:4px;">'+esc(label)+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;">'+
    options.map(o=>'<label class="checkline"><input type="checkbox" data-biopsy-listcheck="'+key+'" data-case="'+c.id+'" value="'+esc(o)+'" '+(d[key].includes(o)?'checked':'')+'> '+esc(o)+'</label>').join('')+'</div></div>';
}
function renderTabBiopsy(c){
  const d = biopsyDraftFor(c);
  const done = !!c.biopsyAssessment;
  const positives = EBUS_STATIONS.filter(s=>d.nodes[s.code] && d.nodes[s.code].examined && d.nodes[s.code].cytology==='Positive');
  const suggestedCN = deriveCN(positives, d.primarySide);
  const mandatoryStations = ['2R','2L','4R','4L','7'];
  const unexaminedMandatory = mandatoryStations.filter(s=>!d.nodes[s].examined);
  const lowPassPositive = EBUS_STATIONS.some(s=>{ const n=d.nodes[s.code]; return n.examined && n.rose==='Malignant' && n.passes!=='' && Number(n.passes)<=3; });
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Diagnostic Workup / Biopsy')+
    (done ? '<div class="callout callout-good">'+icon('checkCircle',14)+' Biopsy/EBUS completed by '+esc(c.biopsyAssessment.completedBy)+' &middot; '+fmtDateTime(c.biopsyAssessment.completedAt)+' &middot; Provisional cN: <strong>'+esc(c.biopsyAssessment.cnConfirmed)+'</strong></div>' : '<div class="callout callout-gold">'+icon('clock',14)+' Two tabs, one procedure: airway survey + primary-lesion sampling, then systematic EBUS-TBNA nodal staging. Nodal sampling is a repeatable row, not a fixed field.</div>')+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Procedure header (shared)</h3>'+
    '<div class="card card-pad"><div class="fields-grid">'+
      '<div class="field"><label>Operator</label><input type="text" value="'+esc(ME.name)+' · '+esc(ME.role)+'" disabled></div>'+
      bxField(c,'procedureDateTime','Date/time of procedure',{type:'datetime-local'})+
      bxSelect(c,'sedation','Sedation', ['Moderate','Deep','General'])+
      bxSelect(c,'indication','Indication', ['Diagnosis','Staging','Both'])+
      bxSelect(c,'primarySide','Primary tumor side (for N laterality)', ['R','L'])+
    '</div></div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Tab A &middot; Bronchoscopy — airway survey &amp; primary lesion</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      bxCheck(c,'airwaySurveyDone','Airway survey performed')+
      '<div class="fields-grid">'+
        bxSelect(c,'visibleLesion','Visible endobronchial lesion?', ['None','Present'])+
        (d.visibleLesion==='Present' ? bxSelect(c,'lesionAppearance','Lesion appearance', LESION_APPEARANCE_OPTIONS) : '')+
        (d.visibleLesion==='Present' ? bxSelect(c,'lesionLocation','Lesion location', AIRWAY_SEGMENT_OPTIONS) : '')+
        bxSelect(c,'airwayPatency','Airway patency / obstruction', ['Patent','Partial','Complete obstruction'])+
      '</div>'+
      (d.visibleLesion==='Present' ? '<div class="callout callout-info" style="font-size:11.5px;">'+icon('image',13)+' Endobronchial photo attached (demo placeholder).</div>' : '')+
      bxChecklist(c,'samplingMethods','Sampling method(s) used', SAMPLING_METHODS)+
      '<div class="fields-grid">'+
        bxField(c,'forcepsCount','Number of forceps biopsies',{ph:'target ≥3 for visible lesion'})+
        bxSelect(c,'roseDone','ROSE performed', ['No','Yes'])+
        (d.roseDone==='Yes' ? bxSelect(c,'roseResult','ROSE preliminary result', ROSE_RESULT_OPTIONS) : '')+
      '</div>'+
      '<div>'+bxCheck(c,'radialEbus','Radial-EBUS / navigation used (peripheral nodule)')+'</div>'+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Tab B &middot; EBUS-TBNA — systematic nodal staging</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div style="display:flex;gap:16px;flex-wrap:wrap;">'+bxCheck(c,'systematicSurveyDone','Systematic survey performed (N3→N2→N1)')+bxCheck(c,'combinedEusB','Combined EUS-B performed')+'</div>'+
      bxSelect(c,'needleGauge','Needle gauge', ['21G','22G','19G'])+
      (unexaminedMandatory.length ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Mandatory systematic stations not yet marked examined: '+unexaminedMandatory.join(', ')+'.</div>' : '')+
      '<div style="font-size:11px;color:var(--ink-faint);">Add a sampled node by marking it examined; per-node fields appear inline. ≥4 passes recommended for a malignancy-suspected node (CHEST Strong Recommendation).</div>'+
      EBUS_STATIONS.map(s=>{
        const n = d.nodes[s.code];
        return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:6px 0;border-top:1px solid var(--border);">'+
          '<label class="checkline" style="min-width:100px;"><input type="checkbox" data-biopsy-node="'+s.code+'" data-case="'+c.id+'" '+(n.examined?'checked':'')+'> Station '+s.code+'</label>'+
          (n.examined ? (
            '<input type="number" data-biopsy-node-field="'+s.code+':sizeMm" data-case="'+c.id+'" value="'+esc(n.sizeMm)+'" placeholder="Short-axis mm" style="width:110px;">'+
            '<input type="number" data-biopsy-node-field="'+s.code+':passes" data-case="'+c.id+'" value="'+esc(n.passes)+'" placeholder="# passes" style="width:90px;">'+
            '<select data-biopsy-node-field="'+s.code+':rose" data-case="'+c.id+'" style="width:170px;"><option value=""'+(n.rose===''?' selected':'')+'>ROSE result…</option>'+NODE_ROSE_OPTIONS.map(o=>'<option '+(n.rose===o?'selected':'')+'>'+o+'</option>').join('')+'</select>'+
            '<select data-biopsy-node-field="'+s.code+':cytology" data-case="'+c.id+'" style="width:150px;">'+CYTOLOGY_RESULT_OPTIONS.map(o=>'<option '+(n.cytology===o?'selected':'')+'>'+o+'</option>').join('')+'</select>'+
            (n.passes!=='' && Number(n.passes)<=3 && n.rose==='Malignant' ? '<span class="badge badge-tier2">'+icon('alert',11)+' ≤3 passes on suspected malignancy</span>' : '')
          ) : '<span style="font-size:11px;color:var(--ink-faint);">Not sampled</span>')+
        '</div>';
      }).join('')+
      '<div class="card card-pad" style="background:var(--surface-2);margin-top:4px;">'+
        '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);margin-bottom:4px;">Derived cN (auto, 9th ed.) — confirm below</div>'+
        '<div style="font-size:16px;font-weight:700;">'+suggestedCN+'</div>'+
      '</div>'+
      bxSelect(c,'cnConfirmed','Confirm provisional cN', ['— Select —', suggestedCN].filter((v,i,a)=>a.indexOf(v)===i))+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Tissue routing for downstream testing</h3>'+
    '<div class="card card-pad" style="display:flex;gap:16px;flex-wrap:wrap;">'+bxCheck(c,'molecularPasses','Additional passes for molecular / PD-L1 obtained')+bxCheck(c,'ngsCollected','Cores / tissue for NGS collected')+bxCheck(c,'sentForPdl1','Sample sent for PD-L1')+'</div></div>'+

    (lowPassPositive ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);">'+icon('alert',14)+' A malignancy-suspected node has ≤3 passes — this may leave inadequate tissue for Stop 6 molecular/PD-L1 testing.</div>' : '')+

    '<div class="fields-grid">'+
      '<div class="field"><label>Airway survey narrative if abnormal (optional)</label><input type="text" data-biopsy-field="airwayNarrative" data-case="'+c.id+'" value="'+esc(d.airwayNarrative)+'"></div>'+
      '<div class="field"><label>Notable findings (optional)</label><input type="text" data-biopsy-field="notableFindings" data-case="'+c.id+'" value="'+esc(d.notableFindings)+'"></div>'+
    '</div>'+

    (!done ? '<button class="btn btn-gold btn-block" data-submit-biopsy="'+c.id+'">'+icon('checkCircle',15)+' Save Biopsy / EBUS Assessment</button>' :
      '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-edit-biopsy="'+c.id+'">'+icon('sparkle',14)+' Re-open for edits</button>')+
  '</div>';
}
function submitBiopsyAssessment(caseId){
  const c = findCase(caseId); if(!c) return;
  const d = biopsyDraftFor(c);
  const positives = EBUS_STATIONS.filter(s=>d.nodes[s.code] && d.nodes[s.code].examined && d.nodes[s.code].cytology==='Positive');
  const suggestedCN = deriveCN(positives, d.primarySide);
  const mandatoryStations = ['2R','2L','4R','4L','7'];
  const missing = [];
  if(!d.airwaySurveyDone) missing.push('airway survey');
  if(!d.systematicSurveyDone) missing.push('systematic survey confirmation');
  if(mandatoryStations.some(s=>!d.nodes[s].examined)) missing.push('mandatory systematic stations (2R/2L/4R/4L/7)');
  if(!d.cnConfirmed || d.cnConfirmed==='— Select —') missing.push('confirmed cN');
  if(missing.length){ toast('Complete required fields first: '+missing.join(', ')+'.'); return; }
  c.biopsyAssessment = Object.assign({}, d, { completedBy: ME.name+' · '+ME.role, completedAt: new Date() });
  const tierSuggest = d.cnConfirmed==='N0'||d.cnConfirmed==='N1' ? 1 : d.cnConfirmed==='N3' ? 3 : 2;
  markStageComplete(c, 'Diagnostic Workup / Biopsy', 'Bronchoscopy + systematic EBUS-TBNA. Provisional cN: '+d.cnConfirmed+'.');
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Stop 2 biopsy/EBUS completed. Provisional cN: '+d.cnConfirmed+' — suggests Tier '+tierSuggest+'.', kind:'system'});
  toast('Biopsy/EBUS saved. Provisional cN: '+d.cnConfirmed+'.');
  renderPage();
}

/* ============================================================
   TAB: PATHOLOGY (Stop 3 — diagnostic small-biopsy/cytology report)
   Tissue-stewardship is the single most important behaviour here:
   the form warns in real time on high IHC stain counts and forces
   the pathologist to record whether tissue remains for molecular
   testing — that hand-off is what most often fails Stop 6 downstream.
   ============================================================ */
const SPECIMEN_SOURCE_OPTIONS = ['Bronchoscopy–endobronchial biopsy','TBNA','EBUS-TBNA','TTNA-core','TTNA-FNA','Brushing','Washing','BAL','Pleural fluid','Other'];
const FIXATIVE_OPTIONS = ['10% NBF (FFPE)','Cell block','Direct smear','ThinPrep','Fresh','Decalcified (acid)'];
const ADEQUACY_OPTIONS = ['Adequate','Limited but diagnostic','Non-diagnostic–insufficient'];
const TUMOR_PRESENT_OPTIONS = ['Malignant','Atypical–suspicious','Benign','No lesional tissue'];
const PRIMARY_DX_OPTIONS = ['Non-small cell carcinoma','Small cell carcinoma','Other neuroendocrine','Non-epithelial','Benign','Non-diagnostic'];
const NSCLC_SUBTYPE_OPTIONS = ['Adenocarcinoma','Squamous cell carcinoma','NSCC favor adenocarcinoma','NSCC favor squamous cell carcinoma','NSCC-NOS','Adenosquamous features','Sarcomatoid features'];
const NE_SUBTYPE_OPTIONS = ['Small cell carcinoma','LCNEC-favor','Carcinoid-favor'];
const ADENO_MARKERS = ['TTF-1','Napsin A'];
const SQUAMOUS_MARKERS = ['p40','p63'];
const NE_MARKERS = ['Synaptophysin','Chromogranin','CD56/NCAM','INSM1'];
const MESO_MARKERS = ['WT-1','Calretinin','CK5/6','D2-40'];
const MET_WORKUP_MARKERS = ['CK7','CK20','CDX2','PAX8','GATA3','NKX3.1'];
const MOLECULAR_TISSUE_OPTIONS = ['Yes – block reserved','No – exhausted','Cell block only'];
const MOLECULAR_PANEL_OPTIONS = ['NGS multigene panel ordered','PD-L1 ordered','Deferred','Insufficient → ctDNA-plasma recommended'];
function pathologyDraftFor(c){
  if(!STATE.pathologyDraft) STATE.pathologyDraft = {};
  if(!STATE.pathologyDraft[c.id]){
    const pa = c.pathologyAssessment;
    STATE.pathologyDraft[c.id] = pa ? JSON.parse(JSON.stringify(pa)) : {
      accessionNumber:'', specimenSource:SPECIMEN_SOURCE_OPTIONS[2], anatomicSite:'', numParts:'',
      receivedDateTime:'', grossedDateTime:'', signoutDateTime:'', fixatives:[],
      adequacy:'Adequate', tumorPresent:'Malignant', cellularityPct:'', pdl1CellsSufficient:'Not assessed', necrosisFlag:false, necrosisPct:'',
      primaryDx:'Non-small cell carcinoma', nsclcSubtype:'Adenocarcinoma', basisOfSubtyping:'Morphology + IHC', neSubtype:'', ki67:'', suspectedMet:'No',
      ihcAdeno:[], ihcSquamous:[], ihcNE:[], ihcMeso:[], ihcMetWorkup:[],
      molecularTissueReserved:MOLECULAR_TISSUE_OPTIONS[0], molecularPanelOrdered:[], molecularSentDateTime:'',
      comment:'', tierSelector:'Tier 1',
    };
  }
  return STATE.pathologyDraft[c.id];
}
function pxField(c,key,label,opts){
  opts=opts||{};
  const d = pathologyDraftFor(c);
  return '<div class="field"><label>'+esc(label)+(opts.unit?' ('+esc(opts.unit)+')':'')+'</label>'+
    '<input type="'+(opts.type||'number')+'" data-pathology-field="'+key+'" data-case="'+c.id+'" value="'+esc(d[key]==null?'':d[key])+'" placeholder="'+(opts.ph||'')+'"></div>';
}
function pxSelect(c,key,label,options){
  const d = pathologyDraftFor(c);
  return '<div class="field"><label>'+esc(label)+'</label><select data-pathology-field="'+key+'" data-case="'+c.id+'">'+
    options.map(o=>'<option value="'+esc(o)+'" '+(d[key]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
}
function pxCheck(c,key,label){
  const d = pathologyDraftFor(c);
  return '<label class="checkline"><input type="checkbox" data-pathology-check="'+key+'" data-case="'+c.id+'" '+(d[key]?'checked':'')+'> '+esc(label)+'</label>';
}
function pxChecklist(c,key,label,options){
  const d = pathologyDraftFor(c);
  return '<div><div style="font-size:11px;color:var(--ink-faint);margin-bottom:4px;">'+esc(label)+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;">'+
    options.map(o=>'<label class="checkline"><input type="checkbox" data-pathology-listcheck="'+key+'" data-case="'+c.id+'" value="'+esc(o)+'" '+(d[key].includes(o)?'checked':'')+'> '+esc(o)+'</label>').join('')+'</div></div>';
}
function renderTabPathology(c){
  const d = pathologyDraftFor(c);
  const done = !!c.pathologyAssessment;
  const totalIHC = d.ihcAdeno.length+d.ihcSquamous.length+d.ihcNE.length+d.ihcMeso.length+d.ihcMetWorkup.length;
  const highIHC = totalIHC>4;
  const acidDecal = d.fixatives.includes('Decalcified (acid)');
  const needsRebiopsy = (d.cellularityPct!=='' && Number(d.cellularityPct)<10) || d.pdl1CellsSufficient==='No';
  const adenoFamily = ['Adenocarcinoma','NSCC favor adenocarcinoma','NSCC-NOS','Adenosquamous features'].includes(d.nsclcSubtype);
  const pureSquamous = d.nsclcSubtype==='Squamous cell carcinoma';
  let tierSuggest = 1;
  if(d.nsclcSubtype==='NSCC-NOS' || d.molecularTissueReserved==='No – exhausted' || d.suspectedMet==='Possible – panel performed') tierSuggest = 2;
  if(d.adequacy==='Non-diagnostic–insufficient' || d.primaryDx==='Non-diagnostic') tierSuggest = 3;
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Pathology (Histo + IHC)')+
    (done ? '<div class="callout callout-good">'+icon('checkCircle',14)+' Pathology report completed by '+esc(c.pathologyAssessment.completedBy)+' &middot; '+fmtDateTime(c.pathologyAssessment.completedAt)+'</div>' : '<div class="callout callout-gold">'+icon('clock',14)+' Diagnostic small-biopsy/cytology report only — resection-only fields (margins, pTNM, LVI, STAS) belong to Stop 11, not here.</div>')+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block A &middot; Specimen accessioning &amp; timeline</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div class="fields-grid">'+
        pxField(c,'accessionNumber','Pathology accession number',{type:'text'})+
        pxSelect(c,'specimenSource','Specimen source procedure', SPECIMEN_SOURCE_OPTIONS)+
        pxField(c,'anatomicSite','Anatomic site / nodal station',{type:'text'})+
        pxField(c,'numParts','Number of specimen parts / cores')+
      '</div>'+
      '<div class="fields-grid">'+
        pxField(c,'receivedDateTime','Date/time received',{type:'datetime-local'})+
        pxField(c,'grossedDateTime','Date/time grossed',{type:'datetime-local'})+
        pxField(c,'signoutDateTime','Date/time report signed out',{type:'datetime-local'})+
      '</div>'+
      pxChecklist(c,'fixatives','Fixative / preparation', FIXATIVE_OPTIONS)+
      (acidDecal ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Acid-decalcified — may compromise molecular testing.</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block B &middot; Specimen adequacy (gatekeeper)</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div class="fields-grid">'+
        pxSelect(c,'adequacy','Specimen adequate for diagnosis?', ADEQUACY_OPTIONS)+
        pxSelect(c,'tumorPresent','Tumor present?', TUMOR_PRESENT_OPTIONS)+
        pxField(c,'cellularityPct','Estimated tumor cellularity',{unit:'%'})+
        pxSelect(c,'pdl1CellsSufficient','Viable cells sufficient for PD-L1 (≥100)?', ['Not assessed','Yes','No'])+
      '</div>'+
      '<div>'+pxCheck(c,'necrosisFlag','Significant necrosis / crush artifact?')+'</div>'+
      (d.necrosisFlag ? pxField(c,'necrosisPct','Necrosis / crush artifact',{unit:'%'}) : '')+
      (needsRebiopsy ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);font-size:11.5px;">'+icon('alert',13)+' Cellularity/PD-L1 below usable threshold — consider rebiopsy or plasma/ctDNA testing. This flag carries forward to Stop 6.</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block C &middot; Histologic diagnosis (WHO 2021 small-specimen terms)</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      pxSelect(c,'primaryDx','Primary diagnostic category', PRIMARY_DX_OPTIONS)+
      (d.primaryDx==='Non-small cell carcinoma' ? '<div class="fields-grid">'+
        pxSelect(c,'nsclcSubtype','NSCLC subtype (small-specimen term)', NSCLC_SUBTYPE_OPTIONS)+
        '<div class="field"><label>Basis of subtyping</label><select data-pathology-field="basisOfSubtyping" data-case="'+c.id+'"><option '+(d.basisOfSubtyping==='Morphology alone'?'selected':'')+'>Morphology alone</option><option '+(d.basisOfSubtyping==='Morphology + IHC'?'selected':'')+'>Morphology + IHC</option></select></div>'+
      '</div>' : '')+
      (d.primaryDx==='Small cell carcinoma'||d.primaryDx==='Other neuroendocrine' ? '<div class="fields-grid">'+pxSelect(c,'neSubtype','Neuroendocrine subtype', NE_SUBTYPE_OPTIONS)+(d.neSubtype==='Carcinoid-favor'?pxField(c,'ki67','Ki-67',{unit:'%'}):'')+'</div>' : '')+
      pxSelect(c,'suspectedMet','Suspected metastasis rather than lung primary?', ['No','Possible – panel performed'])+
      (d.nsclcSubtype==='Squamous cell carcinoma' && d.primaryDx==='Non-small cell carcinoma' ? '<div class="callout callout-info" style="font-size:11.5px;">Note: any adenocarcinoma component in an otherwise-squamous biopsy should trigger molecular testing.</div>' : '')+
    '</div></div>'+

    (d.primaryDx==='Non-small cell carcinoma' && d.basisOfSubtyping==='Morphology + IHC' ? '<div><h3 style="font-size:13px;margin-bottom:8px;">Block D &middot; Immunohistochemistry (tissue-stewardship)</h3>'+
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
        pxChecklist(c,'ihcAdeno','Adenocarcinoma markers', ADENO_MARKERS)+
        pxChecklist(c,'ihcSquamous','Squamous markers', SQUAMOUS_MARKERS)+
        pxChecklist(c,'ihcNE','Neuroendocrine markers (only if NE morphology)', NE_MARKERS)+
        pxChecklist(c,'ihcMeso','Mesothelial markers (pleural only)', MESO_MARKERS)+
        (d.suspectedMet==='Possible – panel performed' ? pxChecklist(c,'ihcMetWorkup','Metastasis work-up panel', MET_WORKUP_MARKERS) : '')+
        kv('Total IHC slides consumed (auto)', String(totalIHC))+
        (highIHC ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' High IHC use (>4 stains) — confirm tissue remains for molecular testing.</div>' : '<div class="callout callout-good" style="font-size:11.5px;">'+icon('checkCircle',13)+' Minimal panel: one adeno marker (TTF-1/Napsin A) + one squamous marker (p40 preferred) usually suffices.</div>')+
      '</div></div>' : '')+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block E &middot; Tissue reserved for molecular / PD-L1</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      pxSelect(c,'molecularTissueReserved','Residual tissue block available for molecular testing?', MOLECULAR_TISSUE_OPTIONS)+
      pxChecklist(c,'molecularPanelOrdered','Molecular panel ordered / reflexed', MOLECULAR_PANEL_OPTIONS)+
      pxField(c,'molecularSentDateTime','Specimen sent to molecular lab',{type:'datetime-local'})+
      kv('PD-L1 sample adequate (from Block B)', d.pdl1CellsSufficient)+
      (d.molecularTissueReserved==='No – exhausted' || d.pdl1CellsSufficient==='No' ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);font-size:11.5px;">'+icon('alert',13)+' Tissue exhausted or PD-L1 inadequate — recommend rebiopsy or plasma ctDNA, visible at the MDT node.</div>' : '')+
      (adenoFamily ? '<div class="callout callout-info" style="font-size:11.5px;">Auto-flag: reflex full multigene panel + PD-L1 (adenocarcinoma-family histology).</div>' : '')+
      (pureSquamous ? '<div class="callout callout-info" style="font-size:11.5px;">Auto-flag: PD-L1 required; multigene panel — consider.</div>' : '')+
    '</div></div>'+

    '<div class="field"><label>Pathologist comment / synthesis (optional, ≤500 chars)</label><textarea data-pathology-field="comment" data-case="'+c.id+'" rows="2" maxlength="500" style="padding:8px 10px;border:1px solid var(--border-strong);border-radius:7px;font-family:inherit;">'+esc(d.comment)+'</textarea></div>'+

    (!done ? '<button class="btn btn-gold btn-block" data-submit-pathology="'+c.id+'">'+icon('checkCircle',15)+' Save Pathology Report (suggests Tier '+tierSuggest+')</button>' :
      '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-edit-pathology="'+c.id+'">'+icon('sparkle',14)+' Re-open for edits</button>')+
  '</div>';
}
function submitPathologyAssessment(caseId){
  const c = findCase(caseId); if(!c) return;
  const d = pathologyDraftFor(c);
  const missing = [];
  if(!d.receivedDateTime||!d.grossedDateTime||!d.signoutDateTime) missing.push('the three specimen timeline dates');
  if(!d.specimenSource) missing.push('specimen source');
  if(!d.adequacy||!d.tumorPresent) missing.push('adequacy + tumor status');
  if(!d.primaryDx) missing.push('primary diagnosis');
  if(d.primaryDx==='Non-small cell carcinoma' && !d.nsclcSubtype) missing.push('NSCLC subtype');
  if(!d.molecularTissueReserved) missing.push('residual tissue for molecular');
  if(missing.length){ toast('Complete required fields first: '+missing.join(', ')+'.'); return; }
  const adenoFamily = ['Adenocarcinoma','NSCC favor adenocarcinoma','NSCC-NOS','Adenosquamous features'].includes(d.nsclcSubtype);
  let tierSuggest = 1;
  if(d.nsclcSubtype==='NSCC-NOS' || d.molecularTissueReserved==='No – exhausted' || d.suspectedMet==='Possible – panel performed') tierSuggest = 2;
  if(d.adequacy==='Non-diagnostic–insufficient' || d.primaryDx==='Non-diagnostic') tierSuggest = 3;
  c.pathologyAssessment = Object.assign({}, d, { completedBy: ME.name+' · '+ME.role, completedAt: new Date() });
  const dxLabel = d.primaryDx==='Non-small cell carcinoma' ? d.nsclcSubtype : d.primaryDx;
  markStageComplete(c, 'Pathology (Histo + IHC)', dxLabel+'. Tissue for molecular: '+d.molecularTissueReserved+'.');
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Stop 3 pathology report completed: '+dxLabel+'.'+(adenoFamily?' Reflex full multigene panel + PD-L1 flagged.':'')+' Suggests Tier '+tierSuggest+'.', kind:'system'});
  toast('Pathology report saved: '+dxLabel+'.');
  renderPage();
}

/* ============================================================
   TAB: STAGING (Stop 4 — auto-staging engine)
   "Radiologist enters descriptors, the app computes the stage" —
   the hard rule this stop exists to enforce. No free-text stage
   field: cT/cN/cM and the AJCC 9th-edition stage group are all
   derived from a rules engine, never picked by hand.
   ============================================================ */
const NODAL_STATIONS = [
  {code:'1R', side:'R', zone:'N3'}, {code:'1L', side:'L', zone:'N3'},
  {code:'2R', side:'R', zone:'N2'}, {code:'2L', side:'L', zone:'N2'},
  {code:'4R', side:'R', zone:'N2'}, {code:'4L', side:'L', zone:'N2'},
  {code:'5', side:'L', zone:'N2'}, {code:'6', side:'L', zone:'N2'},
  {code:'7', side:'M', zone:'N2'}, {code:'8', side:'M', zone:'N2'}, {code:'9', side:'M', zone:'N2'},
  {code:'10R', side:'R', zone:'N1'}, {code:'10L', side:'L', zone:'N1'},
  {code:'11R', side:'R', zone:'N1'}, {code:'11L', side:'L', zone:'N1'},
];
const LATERALITY_OPTIONS = ['RUL','RML','RLL','LUL','LLL'];
const ENDOBRONCHIAL_OPTIONS = ['None','Lobar or more distal','Main bronchus (not carina)','Carina'];
const T3_CHECKLIST = ['Parietal pleura / chest wall','Pericardium','Phrenic nerve','Azygos vein','Separate nodule same lobe'];
const T4_CHECKLIST = ['Mediastinum','Trachea','Carina','Recurrent laryngeal nerve','Esophagus','Diaphragm','Heart','Great vessels','Vertebral body','Separate nodule different ipsilateral lobe'];
const MET_SITES = ['Brain','Bone','Liver','Adrenal','Contralateral lung','Distant nodes','Other'];
function stagingDraftFor(c){
  if(!STATE.stagingDraft) STATE.stagingDraft = {};
  if(!STATE.stagingDraft[c.id]){
    const sa = c.stagingAssessment;
    if(sa){ STATE.stagingDraft[c.id] = JSON.parse(JSON.stringify(sa)); }
    else {
      const nodes = {};
      NODAL_STATIONS.forEach(s=>{ nodes[s.code] = {positive:false, sizeMm:'', petAvid:'No', pathConfirm:'Not yet obtained'}; });
      STATE.stagingDraft[c.id] = {
        ctDone:'Done', ctDate:'', petDone:'Done', petDate:'', brainDone:'Done', brainDate:'', reportSignout:'',
        tis:false, tumorSizeMm:'', laterality:'RUL', endobronchial:'None', atelectasis:false, pleuralInvasion:false, adjacentLobeInvasion:false,
        t3Checklist:[], t4Checklist:[], superiorSulcus:false,
        nodes,
        mStatus:'No (cM0)', m1aFlag:false, m1bFlag:false, m1c1Flag:false, m1c2Flag:false, metSites:[], numMetSites:'',
        impression:'', otherFindings:'',
      };
    }
  }
  return STATE.stagingDraft[c.id];
}
function computeAutoCT(d){
  if(d.tis) return 'Tis';
  const size = d.tumorSizeMm!=='' ? Number(d.tumorSizeMm) : null;
  let sizeT = null;
  if(size!=null){
    if(size<=10) sizeT='T1a'; else if(size<=20) sizeT='T1b'; else if(size<=30) sizeT='T1c';
    else if(size<=40) sizeT='T2a'; else if(size<=50) sizeT='T2b'; else if(size<=70) sizeT='T3'; else sizeT='T4';
  }
  const T_ORDER = ['Tis','T1a','T1b','T1c','T2a','T2b','T3','T4'];
  let best = sizeT;
  const bump = (t)=>{ if(!best || T_ORDER.indexOf(t)>T_ORDER.indexOf(best)) best=t; };
  if(d.endobronchial==='Main bronchus (not carina)') bump('T2a');
  if(d.endobronchial==='Carina') bump('T4');
  if(d.atelectasis) bump('T2a');
  if(d.pleuralInvasion) bump('T2a');
  if(d.adjacentLobeInvasion) bump('T2a');
  if(d.t3Checklist.length) bump('T3');
  if(d.t4Checklist.length) bump('T4');
  return best;
}
/* shared 9th-edition N-derivation, used by both Stop 4 (radiology) and Stop 2 (EBUS) station pickers */
function deriveCN(positives, primarySide){
  if(!positives.length) return 'N0';
  const anyStation1 = positives.some(s=>s.code==='1R'||s.code==='1L');
  const anyContralateral = positives.some(s=> s.side!=='M' && s.side!==primarySide);
  if(anyStation1 || anyContralateral) return 'N3';
  const ipsiN2 = positives.filter(s=>s.zone==='N2' && (s.side==='M'||s.side===primarySide));
  if(ipsiN2.length>=2) return 'N2b';
  if(ipsiN2.length===1) return 'N2a';
  const ipsiN1 = positives.filter(s=>s.zone==='N1' && (s.side==='M'||s.side===primarySide));
  if(ipsiN1.length) return 'N1';
  return 'N0';
}
function computeAutoCN(d){
  const primarySide = d.laterality[0]; // 'R' or 'L'
  const positives = NODAL_STATIONS.filter(s=>d.nodes[s.code] && d.nodes[s.code].positive);
  return deriveCN(positives, primarySide);
}
function computeAutoCM(d){
  if(d.mStatus==='No (cM0)') return 'M0';
  if(d.m1c2Flag) return 'M1c2';
  if(d.m1c1Flag) return 'M1c1';
  if(d.m1bFlag) return 'M1b';
  if(d.m1aFlag) return 'M1a';
  return null;
}
function stageGroupFromTNM(cT,cN,cM){
  if(!cT||!cN||!cM) return null;
  if(cM==='M1a'||cM==='M1b') return 'IVA';
  if(cM==='M1c1'||cM==='M1c2') return 'IVB';
  if(cT==='Tis') return cN==='N0' ? '0' : null;
  const T1 = ['T1a','T1b','T1c'].includes(cT);
  const T2a = cT==='T2a', T2b=cT==='T2b', T3=cT==='T3', T4=cT==='T4', T2=T2a||T2b;
  if(T1 && cN==='N0') return cT==='T1a'?'IA1':cT==='T1b'?'IA2':'IA3';
  if(T2a && cN==='N0') return 'IB';
  if(T2b && cN==='N0') return 'IIA';
  if(T1 && cN==='N1') return 'IIA';
  if(T1 && cN==='N2a') return 'IIB';
  if(T2 && cN==='N1') return 'IIB';
  if(T3 && cN==='N0') return 'IIB';
  if(T1 && cN==='N2b') return 'IIIA';
  if(T2 && cN==='N2a') return 'IIIA';
  if(T3 && cN==='N2a') return 'IIIA';
  if((T3||T4) && cN==='N1') return 'IIIA';
  if(T4 && cN==='N0') return 'IIIA';
  if((T1||T2) && cN==='N3') return 'IIIB';
  if((T2||T3) && cN==='N2b') return 'IIIB';
  if(T4 && (cN==='N2a'||cN==='N2b')) return 'IIIB';
  if(T3 && cN==='N3') return 'IIIC';
  if(T4 && cN==='N3') return 'IIIC';
  return null;
}
function stagingTierFlag(stage){
  if(!stage) return null;
  if(['0','IA1','IA2','IA3'].includes(stage)) return 1;
  if(['IB','IIA','IIB','IIIA'].includes(stage)) return 2;
  return 3; // N2/N3/T4/IIIB/IIIC/IV
}
function sfField(c,key,label,opts){
  opts = opts||{};
  const d = stagingDraftFor(c);
  return '<div class="field"><label>'+esc(label)+(opts.unit?' ('+esc(opts.unit)+')':'')+'</label>'+
    '<input type="'+(opts.type||'number')+'" data-staging-field="'+key+'" data-case="'+c.id+'" value="'+esc(d[key]==null?'':d[key])+'" placeholder="'+(opts.ph||'')+'"></div>';
}
function sfSelect(c,key,label,options){
  const d = stagingDraftFor(c);
  return '<div class="field"><label>'+esc(label)+'</label><select data-staging-field="'+key+'" data-case="'+c.id+'">'+
    options.map(o=>'<option value="'+esc(o)+'" '+(d[key]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
}
function sfCheck(c,key,label){
  const d = stagingDraftFor(c);
  return '<label class="checkline"><input type="checkbox" data-staging-check="'+key+'" data-case="'+c.id+'" '+(d[key]?'checked':'')+'> '+esc(label)+'</label>';
}
function sfChecklist(c,key,label,options){
  const d = stagingDraftFor(c);
  return '<div><div style="font-size:11px;color:var(--ink-faint);margin-bottom:4px;">'+esc(label)+'</div><div style="display:flex;flex-wrap:wrap;gap:10px;">'+
    options.map(o=>'<label class="checkline"><input type="checkbox" data-staging-listcheck="'+key+'" data-case="'+c.id+'" value="'+esc(o)+'" '+(d[key].includes(o)?'checked':'')+'> '+esc(o)+'</label>').join('')+'</div></div>';
}
function renderTabStaging(c){
  const d = stagingDraftFor(c);
  const done = !!c.stagingAssessment;
  const cT = computeAutoCT(d), cN = computeAutoCN(d), cM = computeAutoCM(d);
  const stage = stageGroupFromTNM(cT,cN,cM);
  const tierFlag = stagingTierFlag(stage);
  const brainRequired = stage && !['0','IA1','IA2','IA3'].includes(stage);
  const brainSatisfied = d.brainDone==='Done' || d.brainDone==='CT head with contrast (MRI not possible)';
  const pendingConfirmations = [];
  NODAL_STATIONS.forEach(s=>{ const n=d.nodes[s.code]; if(n.positive && (n.petAvid==='Yes' || (n.sizeMm!=='' && Number(n.sizeMm)>=10)) && n.pathConfirm==='Not yet obtained') pendingConfirmations.push('Station '+s.code); });
  if(d.mStatus!=='No (cM0)' && d.metSites.length) pendingConfirmations.push(...d.metSites.map(s=>s+' (met.)'));
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Staging (CT / PET / Brain MRI)')+
    (done ? '<div class="callout callout-good">'+icon('checkCircle',14)+' Staging completed by '+esc(c.stagingAssessment.completedBy)+' &middot; '+fmtDateTime(c.stagingAssessment.completedAt)+'</div>' : '<div class="callout callout-gold">'+icon('clock',14)+' The radiologist enters raw descriptors below — cT/cN/cM and the AJCC stage group are computed automatically, never picked by hand.</div>')+
    '<div class="card card-pad" style="background:var(--surface-2);display:flex;flex-direction:column;gap:8px;">'+
      '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Computed output</div>'+
      '<div class="grid grid-4">'+kv('cT', cT||'Pending')+kv('cN', cN||'Pending')+kv('cM', cM||'Pending')+kv('AJCC 9th-ed. stage group', stage?('Stage '+stage):'Pending')+'</div>'+
      (tierFlag ? '<div style="font-size:11.5px;color:var(--ink-faint);">Provisional tier flag: Tier '+tierFlag+'</div>' : '')+
      (stage && brainRequired && !brainSatisfied ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Computed stage ≥ II — brain imaging is required but not yet logged. Staging incomplete.</div>' : '')+
      (pendingConfirmations.length ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Pathologic confirmation required before treating as final: '+esc(pendingConfirmations.join(', '))+'.</div>' : '')+
    '</div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block A &middot; Study log &amp; completeness</h3>'+
    '<div class="card card-pad"><div class="fields-grid">'+
      sfSelect(c,'ctDone','Contrast CT chest + upper abdomen', ['Done','Not done','Contraindicated'])+sfField(c,'ctDate','CT acquisition date',{type:'date'})+
      sfSelect(c,'petDone','FDG-PET/CT (skull base→mid-thigh)', ['Done','Not done','Not indicated'])+sfField(c,'petDate','PET acquisition date',{type:'date'})+
      sfSelect(c,'brainDone','Brain MRI with/without contrast', ['Done','CT head with contrast (MRI not possible)','Not done'])+sfField(c,'brainDate','Brain imaging date',{type:'date'})+
      sfField(c,'reportSignout','Report sign-out',{type:'datetime-local'})+
    '</div></div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block B &middot; Primary tumor (T) descriptors</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div class="fields-grid">'+
        sfField(c,'tumorSizeMm','Greatest tumor dimension',{unit:'mm'})+
        sfSelect(c,'laterality','Laterality & lobe', LATERALITY_OPTIONS)+
        sfSelect(c,'endobronchial','Endobronchial / main bronchus involvement', ENDOBRONCHIAL_OPTIONS)+
      '</div>'+
      '<div style="display:flex;gap:16px;flex-wrap:wrap;">'+sfCheck(c,'atelectasis','Atelectasis / obstructive pneumonitis to hilum')+sfCheck(c,'pleuralInvasion','Visceral pleural invasion')+sfCheck(c,'adjacentLobeInvasion','Invades adjacent lobe')+sfCheck(c,'superiorSulcus','Superior sulcus (Pancoast) location')+'</div>'+
      (d.superiorSulcus ? '<div class="callout callout-info" style="font-size:11.5px;">NCCN advises MRI spine + thoracic inlet for superior sulcus lesions.</div>' : '')+
      sfChecklist(c,'t3Checklist','T3 local-invasion checklist (any tick → at least T3)', T3_CHECKLIST)+
      sfChecklist(c,'t4Checklist','T4 local-invasion checklist (any tick → T4)', T4_CHECKLIST)+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block C &middot; Regional lymph nodes (IASLC station picker)</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;">'+
      '<div style="font-size:11px;color:var(--ink-faint);">Toggle each involved station; size/PET/pathologic-confirmation fields apply only to stations marked positive.</div>'+
      NODAL_STATIONS.map(s=>{
        const n = d.nodes[s.code];
        return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:6px 0;border-top:1px solid var(--border);">'+
          '<label class="checkline" style="min-width:90px;"><input type="checkbox" data-staging-node="'+s.code+'" data-case="'+c.id+'" '+(n.positive?'checked':'')+'> Station '+s.code+'</label>'+
          (n.positive ? (
            '<input type="number" data-staging-node-field="'+s.code+':sizeMm" data-case="'+c.id+'" value="'+esc(n.sizeMm)+'" placeholder="Short-axis mm" style="width:120px;">'+
            '<select data-staging-node-field="'+s.code+':petAvid" data-case="'+c.id+'" style="width:110px;"><option '+(n.petAvid==='Yes'?'selected':'')+'>Yes</option><option '+(n.petAvid==='No'?'selected':'')+'>No</option><option '+(n.petAvid==='N/A'?'selected':'')+'>N/A</option></select>'+
            '<select data-staging-node-field="'+s.code+':pathConfirm" data-case="'+c.id+'" style="width:190px;">'+['Not yet obtained','Confirmed positive','Confirmed negative','Pending'].map(o=>'<option '+(n.pathConfirm===o?'selected':'')+'>'+o+'</option>').join('')+'</select>'
          ) : '<span style="font-size:11px;color:var(--ink-faint);">Negative</span>')+
        '</div>';
      }).join('')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block D &middot; Distant metastasis (M)</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      sfSelect(c,'mStatus','Any distant metastasis identified?', ['No (cM0)','Yes'])+
      (d.mStatus==='Yes' ? ('<div style="display:flex;gap:16px;flex-wrap:wrap;">'+
        sfCheck(c,'m1aFlag','Pleural/pericardial nodules, malignant effusion, or contralateral-lobe nodule (→ M1a)')+
        sfCheck(c,'m1bFlag','Single extrathoracic metastasis, single organ (→ M1b)')+
        sfCheck(c,'m1c1Flag','Multiple metastases, single organ system (→ M1c1)')+
        sfCheck(c,'m1c2Flag','Multiple metastases, multiple organ systems (→ M1c2)')+
      '</div>'+sfChecklist(c,'metSites','Metastatic site checklist', MET_SITES)+sfField(c,'numMetSites','Number of metastatic sites')) : '')+
    '</div></div>'+

    '<div class="fields-grid">'+
      '<div class="field"><label>Radiology impression (optional)</label><input type="text" data-staging-field="impression" data-case="'+c.id+'" value="'+esc(d.impression)+'"></div>'+
      '<div class="field"><label>Other findings not captured above (optional)</label><input type="text" data-staging-field="otherFindings" data-case="'+c.id+'" value="'+esc(d.otherFindings)+'"></div>'+
    '</div>'+

    (!done ? '<button class="btn btn-gold btn-block" data-submit-staging="'+c.id+'">'+icon('checkCircle',15)+' Save Staging Assessment</button>' :
      '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-edit-staging="'+c.id+'">'+icon('sparkle',14)+' Re-open for edits</button>')+
  '</div>';
}
function submitStagingAssessment(caseId){
  const c = findCase(caseId); if(!c) return;
  const d = stagingDraftFor(c);
  const cT = computeAutoCT(d), cN = computeAutoCN(d), cM = computeAutoCM(d);
  const stage = stageGroupFromTNM(cT,cN,cM);
  const missing = [];
  if(d.ctDone==='Done' && !d.ctDate) missing.push('CT acquisition date');
  if(d.petDone==='Not done' || !d.petDone) missing.push('PET/CT status');
  if(!cT) missing.push('tumor size / T descriptors');
  if(!cM) missing.push('distant metastasis status');
  if(stage && !['0','IA1','IA2','IA3'].includes(stage) && !(d.brainDone==='Done'||d.brainDone==='CT head with contrast (MRI not possible)')) missing.push('brain imaging (required for computed stage ≥ II)');
  if(missing.length){ toast('Complete required fields first: '+missing.join(', ')+'.'); return; }
  c.stagingAssessment = Object.assign({}, d, { cT, cN, cM, stage, completedBy: ME.name+' · '+ME.role, completedAt: new Date() });
  markStageComplete(c, 'Staging (CT / PET / Brain MRI)', 'Computed cT'+cT+' cN'+cN+' cM'+cM+' — AJCC 9th-ed. Stage '+stage+'.');
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Stop 4 staging computed: cT'+cT+' cN'+cN+' cM'+cM+' — Stage '+stage+'.', kind:'system'});
  toast('Staging saved: Stage '+stage+' (cT'+cT+' cN'+cN+' cM'+cM+').');
  renderPage();
}

/* ============================================================
   TAB: RESTAGING (Stop 9 — go/no-go gate after neoadjuvant therapy)
   A 3-way progression selector (Progression / Stable / Response) —
   NOT a binary responder gate. Only progression diverts to salvage;
   stable disease and response both route forward to surgery.
   ============================================================ */
const RECIST_OPTIONS = ['Complete response','Partial response','Stable disease','Progressive disease'];
const PROGRESSION_OPTIONS = ['Progression','Stable disease','Response'];
const INVASIVE_MODALITY_OPTIONS = ['EBUS-TBNA','EUS(-B)-FNA','Combined EBUS+EUS','Mediastinoscopy'];
const INVASIVE_RESULT_OPTIONS = ['Negative','Positive','Non-diagnostic'];
const RESECTABILITY_RECONFIRM_OPTIONS = ['Resectable','Not resectable','Borderline'];
const FITNESS_RECHECK_OPTIONS = ['No change','Declined — re-assess PFTs','New comorbidity'];
function restagingDraftFor(c){
  if(!STATE.restagingDraft) STATE.restagingDraft = {};
  if(!STATE.restagingDraft[c.id]){
    const rs = c.restaging;
    STATE.restagingDraft[c.id] = rs ? JSON.parse(JSON.stringify(rs)) : {
      ctDone:false, ctDate:'', petDone:false, petDate:'', brainMriDone:false, brainMriDate:'',
      primarySizeCurrent:'', recist:'Stable disease', newLesion:false, suspectedNodalProgression:false,
      invasiveModality:'EBUS-TBNA', invasiveResult:'Negative',
      progressionStatus:'',
      plannedSurgeryDate:'', resectability:'Resectable', plannedProcedure:'Lobectomy', anticipatedR0:'Yes', fitnessRecheck:'No change',
      mdtNote:'',
    };
  }
  return STATE.restagingDraft[c.id];
}
function suggestProgressionStatus(d){
  if(d.recist==='Progressive disease' || d.newLesion) return 'Progression';
  if(d.recist==='Stable disease') return 'Stable disease';
  return 'Response';
}
function lastNeoadjuvantDoseDate(c){
  if(!c.treatmentLog) return null;
  const given = c.treatmentLog.cycles.filter(cy=>cy.status==='given' && cy.actualDate);
  if(!given.length) return null;
  return given.reduce((max,cy)=> cy.actualDate>max ? cy.actualDate : max, given[0].actualDate);
}
function rfField(c,key,label,opts){
  opts = opts||{};
  const d = restagingDraftFor(c);
  return '<div class="field"><label>'+esc(label)+(opts.unit?' ('+esc(opts.unit)+')':'')+'</label>'+
    '<input type="'+(opts.type||'number')+'" data-restaging-field="'+key+'" data-case="'+c.id+'" value="'+esc(d[key]==null?'':d[key])+'" placeholder="'+(opts.ph||'')+'"></div>';
}
function rfSelect(c,key,label,options){
  const d = restagingDraftFor(c);
  return '<div class="field"><label>'+esc(label)+'</label><select data-restaging-field="'+key+'" data-case="'+c.id+'">'+
    options.map(o=>'<option value="'+esc(o)+'" '+(d[key]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
}
function rfCheck(c,key,label){
  const d = restagingDraftFor(c);
  return '<label class="checkline"><input type="checkbox" data-restaging-check="'+key+'" data-case="'+c.id+'" '+(d[key]?'checked':'')+'> '+esc(label)+'</label>';
}
function renderTabRestaging(c){
  const d = restagingDraftFor(c);
  const done = !!c.restaging;
  const baselineImg = c.timeline.find(t=>t.stage==='Staging (CT / PET / Brain MRI)');
  const lastDose = lastNeoadjuvantDoseDate(c);
  const plannedDate = d.plannedSurgeryDate ? new Date(d.plannedSurgeryDate) : null;
  const intervalWeeks = (lastDose && plannedDate) ? Math.round((plannedDate-lastDose)/(7*86400000)*10)/10 : null;
  const suggestion = suggestProgressionStatus(d);
  const newBrainOrDistant = d.newLesion && d.progressionStatus==='Progression';
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Restaging / Resectability')+
    (done ? '<div class="callout '+(c.restaging.progressionStatus==='Progression'?'callout-info':'callout-good')+'">'+icon('checkCircle',14)+' Restaging completed by '+esc(c.restaging.completedBy)+' &middot; '+fmtDateTime(c.restaging.completedAt)+' &middot; Verdict: <strong>'+esc(c.restaging.progressionStatus)+'</strong></div>' : '<div class="callout callout-gold">'+icon('clock',14)+' Go/no-go gate after neoadjuvant therapy. This gate rules OUT progression — stable disease and response both route forward to surgery.</div>')+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block A &middot; Imaging performed (Radiology)</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      (baselineImg ? kv('Comparison prior study (Stop 4 baseline)', baselineImg.summary) : '')+
      '<div style="display:flex;gap:16px;flex-wrap:wrap;">'+rfCheck(c,'ctDone','Restaging chest CT with contrast done')+rfCheck(c,'petDone','FDG-PET/CT done')+rfCheck(c,'brainMriDone','Brain MRI repeated')+'</div>'+
      '<div class="fields-grid">'+
        rfField(c,'ctDate','CT date',{type:'date'})+rfField(c,'petDate','PET date',{type:'date'})+rfField(c,'brainMriDate','Brain MRI date',{type:'date'})+
      '</div>'+
      (!d.ctDone && !d.petDone ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' At minimum a contrast chest CT and/or FDG-PET/CT must be logged before this stop can complete.</div>' : '')+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block B &middot; Radiologic response read</h3>'+
    '<div class="card card-pad"><div class="fields-grid">'+
      rfField(c,'primarySizeCurrent','Primary tumor size — current',{unit:'mm'})+
      rfSelect(c,'recist','RECIST 1.1 category', RECIST_OPTIONS)+
    '</div>'+
    '<div style="margin-top:6px;">'+rfCheck(c,'newLesion','New lesion(s) since baseline')+'</div>'+
    '</div></div>'+

    '<div><h3 style="font-size:13px;margin-bottom:8px;">Block C &middot; Progression gate</h3>'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div class="callout callout-info" style="font-size:11.5px;">System suggests: <strong>'+esc(suggestion)+'</strong> (from RECIST + new-lesion flag). Radiologist confirms or overrides below — the gate rules OUT progression, it is not a binary responder test.</div>'+
      rfSelect(c,'progressionStatus','Progression status (confirm/override)', ['— Select —'].concat(PROGRESSION_OPTIONS))+
      rfCheck(c,'suspectedNodalProgression','Suspected nodal progression requiring tissue confirmation')+
    '</div></div>'+

    (d.suspectedNodalProgression ? '<div><h3 style="font-size:13px;margin-bottom:8px;">Block D &middot; Invasive nodal restaging <span class="badge badge-tier2" style="margin-left:6px;">Conditional — unlocked</span></h3>'+
      '<div class="card card-pad"><div class="fields-grid">'+
        rfSelect(c,'invasiveModality','Modality', INVASIVE_MODALITY_OPTIONS)+
        rfSelect(c,'invasiveResult','Result', INVASIVE_RESULT_OPTIONS)+
      '</div></div></div>' : '')+

    (d.progressionStatus==='Stable disease' || d.progressionStatus==='Response' ? '<div><h3 style="font-size:13px;margin-bottom:8px;">Block E &middot; Resectability re-affirmation</h3>'+
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
        (lastDose ? kv('Neoadjuvant last-dose date', fmtDate(lastDose)) : '<div class="callout callout-info" style="font-size:11.5px;">No neoadjuvant last-dose date on record for this case.</div>')+
        '<div class="fields-grid">'+
          rfField(c,'plannedSurgeryDate','Planned surgery date',{type:'date'})+
          rfSelect(c,'resectability','Resectability confirmed by thoracic surgeon', RESECTABILITY_RECONFIRM_OPTIONS)+
          rfSelect(c,'plannedProcedure','Planned procedure', RESECTION_EXTENTS)+
          rfSelect(c,'anticipatedR0','Anticipated R0 achievable', ['Yes','No'])+
          rfSelect(c,'fitnessRecheck','Fitness re-check — any decline during neoadjuvant?', FITNESS_RECHECK_OPTIONS)+
        '</div>'+
        (intervalWeeks!=null ? '<div class="callout" style="background:'+(intervalWeeks>6?'var(--warn-soft)':'var(--good-soft)')+';border:1px solid transparent;color:'+(intervalWeeks>6?'var(--warn-ink)':'var(--good-ink)')+';font-size:11.5px;">'+icon(intervalWeeks>6?'alert':'checkCircle',13)+' Interval last dose → surgery: '+intervalWeeks+' weeks.'+(intervalWeeks>6?' Exceeds 6 weeks — expedite surgery flag.':'')+'</div>' : '')+
      '</div></div>' : '')+

    (newBrainOrDistant ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);">'+icon('alert',14)+' New lesion with confirmed progression — auto-escalate to Tier 3 MDT re-review, surgery routing blocked.</div>' : '')+

    '<div class="field"><label>MDT note (optional, ≤ 2 lines)</label><textarea data-restaging-field="mdtNote" data-case="'+c.id+'" rows="2" style="padding:8px 10px;border:1px solid var(--border-strong);border-radius:7px;font-family:inherit;">'+esc(d.mdtNote)+'</textarea></div>'+

    (!done ? '<button class="btn btn-gold btn-block" data-submit-restaging="'+c.id+'">'+icon('checkCircle',15)+' Save Restaging Assessment</button>' :
      '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-edit-restaging="'+c.id+'">'+icon('sparkle',14)+' Re-open for edits</button>')+
  '</div>';
}
function submitRestagingAssessment(caseId){
  const c = findCase(caseId); if(!c) return;
  const d = restagingDraftFor(c);
  const missing = [];
  if(!d.ctDone && !d.petDone) missing.push('at least one restaging modality (CT and/or PET)');
  if(!d.progressionStatus || d.progressionStatus==='— Select —') missing.push('progression status');
  if(d.primarySizeCurrent==='') missing.push('primary tumor size');
  if((d.progressionStatus==='Stable disease' || d.progressionStatus==='Response') && (!d.plannedSurgeryDate || !d.resectability)) missing.push('Block E resectability re-affirmation');
  if(missing.length){ toast('Complete required fields first: '+missing.join(', ')+'.'); return; }
  c.restaging = Object.assign({}, d, { completedBy: ME.name+' · '+ME.role, completedAt: new Date() });
  const progressed = d.progressionStatus==='Progression';
  markStageComplete(c, 'Restaging / Resectability', 'Verdict: '+d.progressionStatus+' (RECIST: '+d.recist+').'+(progressed?' Routed to salvage pathway.':' Resectability reconfirmed — proceeds to Stop 10.'));
  if(c.surgicalPortal){
    c.surgicalPortal.stop9Verdict = progressed ? 'progression' : 'stable';
  }
  if(progressed){
    c.tier = 3;
    c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Stop 9 restaging: Progression confirmed. Routed to salvage pathway (definitive chemoRT / systemic therapy), bypassing surgery. Case flagged back to Tier 3 MDT.', kind:'system'});
    toast('Restaging saved: Progression — routed to salvage pathway.');
  } else {
    c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Stop 9 restaging: '+d.progressionStatus+'. Resectability reconfirmed ('+d.resectability+') — proceeds to Stop 10 (Surgery).', kind:'system'});
    toast('Restaging saved: '+d.progressionStatus+' — proceeds to surgery.');
  }
  renderPage();
}

/* ============================================================
   TAB: SURGERY PORTAL (Stop 10 — reactivated surgical decision portal)
   Two phases inside one node: Phase A (go/no-go, surgeon-owned lock)
   must lock before Phase B (operative record) unlocks. This is the
   pattern Milestone reuses whenever it "reactivates" a case (Stop 13's
   recurrence fork does the same thing).
   ============================================================ */
const RESECTION_EXTENTS = ['Lobectomy','Sleeve/bronchoplastic lobectomy','Bilobectomy','Segmentectomy','Wedge resection','Pneumonectomy'];
const APPROACH_OPTIONS = ['VATS','Robotic (RATS)','Open thoracotomy','MIS with open backup'];
function optionsWithFallback(options, plannedValue){
  const list = (plannedValue && !options.includes(plannedValue)) ? [plannedValue].concat(options) : options;
  return list.map(o=>'<option value="'+esc(o)+'" '+(o===plannedValue?'selected':'')+'>'+esc(o)+'</option>').join('');
}
function responseBadge(r){
  const map = {agree:'badge-tier1', disagree:'badge-tier3', defer:'badge-tier2', pending:'badge-neutral'};
  const label = {agree:'Agree', disagree:'Disagree', defer:'Defer', pending:'Pending'};
  return '<span class="badge '+(map[r]||'badge-neutral')+'">'+(label[r]||r)+'</span>';
}
function renderTabSurgery(c){
  const sp = c.surgicalPortal;
  if(sp.stop9Verdict === 'progression'){
    return '<div style="display:flex;flex-direction:column;gap:16px;">'+
      dataEntryStageHeader(c,'Surgery')+
      '<div class="card" style="border-color:var(--crit);background:var(--crit-soft);"><div class="card-pad">'+
        '<div style="font-weight:700;color:var(--crit-ink);display:flex;align-items:center;gap:8px;margin-bottom:6px;">'+icon('x',15)+' Proceed to Resection — Disabled</div>'+
        '<div style="font-size:12.5px;">Stop 9 restaging verdict: <strong>Progression</strong>. Per protocol, this routes to the salvage pathway (definitive chemoradiation / systemic therapy) rather than surgery.</div>'+
      '</div></div>'+
    '</div>';
  }
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Surgery')+
    '<div class="grid grid-3">'+
      kv('Auto-invited quorum (Tier '+sp.tier+')', sp.quorum.map(q=>q.name+' · '+q.role).join('; '))+
      kv('Stop 9 gate', sp.stop9Verdict ? ('Verdict: '+sp.stop9Verdict) : 'N/A — upfront surgery')+
      kv('Interval note', sp.intervalNote)+
    '</div>'+
    '<div class="grid grid-3">'+
      kv('ECOG', sp.fitness.ecog)+
      kv('ppoFEV₁ / ppoDLCO', sp.fitness.ppoFEV1+'% / '+sp.fitness.ppoDLCO+'%')+
      kv('Anesthesia', sp.fitness.anesthesia)+
    '</div>'+
    renderPhaseA(c, sp)+
    renderPhaseB(c, sp)+
  '</div>';
}
function renderPhaseA(c, sp){
  const pa = sp.phaseA;
  if(pa.locked){
    return '<div class="card" style="border-color:var(--accent);background:var(--accent-soft);">'+
      '<div class="card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
        '<div style="display:flex;align-items:center;gap:8px;color:var(--accent-ink);font-weight:700;font-size:13px;">'+icon('lock',15)+' Phase A Locked — '+esc(pa.lockedBy)+' · '+fmtDateTime(pa.lockedAt)+'</div>'+
        decisionRow('checkCircle','Go / No-Go', pa.goNoGo==='proceed'?'Proceed to resection':'Do not resect', 'var(--good)')+
        decisionRow('sparkle','Rationale', pa.rationale, 'var(--info)')+
        decisionRow('flag','Planned procedure', pa.plannedExtent+' · '+pa.plannedApproach, 'var(--accent)')+
        decisionRow('users','Nodal strategy', pa.nodalStrategy, 'var(--accent)')+
        decisionRow('alert','Contingency', pa.contingency, 'var(--crit)')+
        (pa.dissent ? decisionRow('alert','Dissent logged', pa.dissent, 'var(--crit)') : '')+
        '<div style="margin-top:4px;"><div style="font-size:10.5px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);margin-bottom:6px;">Quorum confirmations</div>'+
          '<div style="display:flex;flex-direction:column;gap:6px;">'+sp.quorum.map(q=>
            '<div style="display:flex;align-items:center;gap:8px;font-size:12px;"><span style="min-width:190px;">'+esc(q.name)+' · '+esc(q.role)+(q.isOwner?' (owner)':'')+'</span>'+responseBadge(q.response)+'<span style="color:var(--ink-faint);flex:1;">'+esc(q.comment)+'</span></div>'
          ).join('')+'</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  }
  const uid = c.id;
  return '<div class="card" style="border-style:dashed;"><div class="card-pad" style="display:flex;flex-direction:column;gap:14px;">'+
    '<h3>Phase A — Resectability Decision</h3>'+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);">Quorum confirmations</div>'+
    '<div style="display:flex;flex-direction:column;gap:6px;">'+sp.quorum.map(q=>
      '<div style="display:flex;align-items:center;gap:8px;font-size:12px;"><span style="min-width:190px;">'+esc(q.name)+' · '+esc(q.role)+(q.isOwner?' (owner)':'')+'</span>'+responseBadge(q.response)+'<span style="color:var(--ink-faint);flex:1;">'+esc(q.comment)+'</span></div>'
    ).join('')+'</div>'+
    '<div class="fields-grid">'+
      '<div class="field"><label>Go / No-Go</label><select id="spGoNoGo_'+uid+'"><option value="proceed">Proceed to resection</option><option value="no">Do not resect — divert to non-surgical</option></select></div>'+
      '<div class="field"><label>Planned extent</label><select id="spExtent_'+uid+'">'+RESECTION_EXTENTS.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label>Planned approach</label><select id="spApproach_'+uid+'">'+APPROACH_OPTIONS.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select></div>'+
    '</div>'+
    '<div class="callout callout-info" style="font-size:11.5px;">Selecting Pneumonectomy auto-escalates this decision to Tier 3 (full surgical board, live).</div>'+
    '<div class="field"><label>Resectability rationale</label><input type="text" id="spRationale_'+uid+'" placeholder="One line — why this call, in this patient"></div>'+
    '<div class="field"><label>Nodal strategy</label><input type="text" id="spNodal_'+uid+'" placeholder="e.g. Formal ipsilateral dissection: 4R, 7, 2R + N1 stations"></div>'+
    '<div class="field"><label>Contingency plan</label><input type="text" id="spContingency_'+uid+'" placeholder="e.g. Convert to open if hilar fibrosis; definitive chemoRT if unresectable"></div>'+
    '<div style="font-size:11px;color:var(--ink-faint);">Only the assigned thoracic surgeon (<strong>'+esc((sp.quorum.find(q=>q.isOwner)||{}).name||'—')+'</strong>) can lock this decision in production. Locking here is a demo action taken as that role.</div>'+
    '<button class="btn btn-gold" data-lock-phasea="'+uid+'">'+icon('lock',15)+' Lock Phase A</button>'+
  '</div></div>';
}
function renderPhaseB(c, sp){
  const pa = sp.phaseA, pb = sp.phaseB;
  if(!pa.locked || !pb){
    return '<div class="card" style="background:var(--surface-2);"><div class="card-pad">'+
      '<div style="color:var(--ink-faint);font-size:12.5px;display:flex;align-items:center;gap:8px;">'+icon('lock',14)+' Phase B (operative record) unlocks once Phase A is locked.</div>'+
    '</div></div>';
  }
  if(pb.status==='complete'){
    return '<div class="card" style="background:var(--surface-2);">'+
      '<div class="card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;"><h3>Phase B — Operative Record</h3><span class="mono" style="font-size:11px;color:var(--ink-faint);">'+fmtDateTime(pb.completedAt)+'</span></div>'+
        (pb.actualExtent!==pa.plannedExtent ? '<div class="chip">Actual extent differs from planned ('+esc(pa.plannedExtent)+')</div>' : '')+
        '<div class="grid grid-3">'+
          kv('Extent / Approach', pb.actualExtent+' · '+pb.actualApproach+(pb.conversionReason?' (converted: '+pb.conversionReason+')':''))+
          kv('Operative time / EBL', pb.operativeTimeMin+' min · '+pb.estBloodLossMl+' mL')+
          kv('Resection status', pb.resectionStatus)+
        '</div>'+
        '<div class="grid grid-3">'+
          kv('Nodal stations', pb.n1Count+' N1 · '+pb.n2Count+' N2')+
          kv('Complete dissection', pb.completeDissection)+
          kv('Highest mediastinal node', pb.highestNodeStatus)+
        '</div>'+
        (pb.qualityFlag ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);">'+icon('alert',13)+' Does not meet NCCN 3+1 nodal quality criterion (≥1 N1 + ≥3 N2 stations).</div>' : '')+
        (pb.complications.length ? '<div style="display:flex;gap:6px;flex-wrap:wrap;">'+pb.complications.map(x=>'<span class="badge badge-tier3">'+esc(x)+'</span>').join('')+'</div>' : '<div style="font-size:12px;color:var(--ink-faint);">No intraoperative complications.</div>')+
        (pb.narrative ? '<div style="font-size:12.5px;padding-top:8px;border-top:1px solid var(--border);">'+esc(pb.narrative)+'</div>' : '')+
      '</div>'+
    '</div>';
  }
  const uid = c.id;
  return '<div class="card" style="border-style:dashed;"><div class="card-pad" style="display:flex;flex-direction:column;gap:14px;">'+
    '<h3>Phase B — Operative Record</h3>'+
    '<div class="fields-grid">'+
      '<div class="field"><label>Actual extent</label><select id="pbExtent_'+uid+'">'+optionsWithFallback(RESECTION_EXTENTS, pa.plannedExtent)+'</select></div>'+
      '<div class="field"><label>Actual approach</label><select id="pbApproach_'+uid+'">'+optionsWithFallback(APPROACH_OPTIONS.concat(['Converted to open']), pa.plannedApproach)+'</select></div>'+
      '<div class="field"><label>Conversion reason (if converted)</label><select id="pbConvReason_'+uid+'"><option value="">N/A</option><option>Bleeding</option><option>Adhesions</option><option>Hilar fibrosis</option><option>Anatomy</option><option>Oncologic</option></select></div>'+
      '<div class="field"><label>Operative time (min)</label><input type="number" id="pbOpTime_'+uid+'" placeholder="e.g. 145"></div>'+
      '<div class="field"><label>Est. blood loss (mL)</label><input type="number" id="pbBloodLoss_'+uid+'" placeholder="e.g. 150"></div>'+
      '<div class="field"><label>N1 stations sampled</label><input type="number" id="pbN1_'+uid+'" placeholder="≥1 required" min="0"></div>'+
      '<div class="field"><label>N2 stations sampled</label><input type="number" id="pbN2_'+uid+'" placeholder="≥3 required" min="0"></div>'+
      '<div class="field"><label>Complete lymph node dissection</label><select id="pbDissection_'+uid+'"><option value="Yes">Yes</option><option value="No">No</option></select></div>'+
      '<div class="field"><label>Highest mediastinal node</label><select id="pbHighNode_'+uid+'"><option>Negative</option><option>Positive</option><option>Pending pathology</option></select></div>'+
      '<div class="field"><label>Resection status</label><select id="pbResection_'+uid+'"><option value="R0">R0 — complete, negative margins</option><option value="R1">R1 — microscopic positive margins</option><option value="R2">R2 — gross residual tumor</option></select></div>'+
    '</div>'+
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);">Intraoperative findings</div>'+
    '<div class="fields-grid">'+
      '<div class="field"><label>Pleural adhesions</label><select id="pbAdhesions_'+uid+'"><option>None</option><option>Mild</option><option>Moderate</option><option>Severe</option></select></div>'+
      '<div class="field"><label>Hilar fibrosis</label><select id="pbFibrosis_'+uid+'"><option>None</option><option>Mild</option><option>Moderate</option><option>Severe</option></select></div>'+
      '<div class="field"><label>Unexpected N2/N3 disease found</label><select id="pbUnexpectedN2_'+uid+'"><option value="No">No</option><option value="Yes">Yes</option></select></div>'+
    '</div>'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;">'+['Bleeding','Air leak','Vascular injury'].map((x,i)=>'<label class="checkline"><input type="checkbox" id="pbComp_'+uid+'_'+i+'" value="'+esc(x)+'"> '+esc(x)+'</label>').join('')+'</div>'+
    '<div class="field"><label>Operative narrative</label><textarea id="pbNarrative_'+uid+'" rows="2" placeholder="Free-text operative summary"></textarea></div>'+
    '<button class="btn btn-gold" data-complete-phaseb="'+uid+'">'+icon('checkCircle',15)+' Complete Operative Record</button>'+
  '</div></div>';
}
function submitPhaseALock(caseId){
  const c = findCase(caseId); if(!c) return;
  const sp = c.surgicalPortal;
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  const extent = val('spExtent_'+caseId);
  const goNoGo = val('spGoNoGo_'+caseId);
  const owner = sp.quorum.find(q=>q.isOwner);
  if(extent === 'Pneumonectomy' && sp.tier < 3){
    sp.tier = 3;
    toast('Pneumonectomy selected — auto-escalated to Tier 3 (full surgical board, live). Lock proceeds as a demo override.');
  }
  sp.phaseA = {
    locked:true, goNoGo,
    rationale: val('spRationale_'+caseId) || 'Rationale not entered.',
    plannedExtent: extent, plannedApproach: val('spApproach_'+caseId),
    nodalStrategy: val('spNodal_'+caseId) || '—',
    contingency: val('spContingency_'+caseId) || '—',
    lockedBy: (owner?owner.name:'Assigned surgeon')+' · Thoracic Surgery', lockedAt: new Date(),
    dissent: sp.phaseA.dissent || null,
  };
  if(owner) owner.response = 'agree';
  if(goNoGo==='proceed'){
    sp.phaseB = { status:'pending', actualExtent:'', actualApproach:'', conversionReason:'', operativeTimeMin:'', estBloodLossMl:'', n1Count:'', n2Count:'', completeDissection:'', highestNodeStatus:'', resectionStatus:'', adhesions:'', hilarFibrosis:'', unexpectedN2:'', complications:[], narrative:'', completedAt:null };
  }
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Surgical decision portal (Stop 10) Phase A locked: '+(goNoGo==='proceed'?'proceed to resection ('+extent+').':'do not resect — diverted to non-surgical pathway.'), kind:'system'});
  toast('Phase A locked.'+(goNoGo==='proceed'?' Operative record (Phase B) unlocked.':''));
  renderPage();
}
function submitPhaseB(caseId){
  const c = findCase(caseId); if(!c) return;
  const sp = c.surgicalPortal;
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  const n1 = Number(val('pbN1_'+caseId))||0, n2 = Number(val('pbN2_'+caseId))||0;
  const complications = [];
  [0,1,2].forEach(i=>{ const cb = document.getElementById('pbComp_'+caseId+'_'+i); if(cb && cb.checked) complications.push(cb.value); });
  sp.phaseB = {
    status:'complete',
    actualExtent: val('pbExtent_'+caseId), actualApproach: val('pbApproach_'+caseId), conversionReason: val('pbConvReason_'+caseId),
    operativeTimeMin: val('pbOpTime_'+caseId)||'—', estBloodLossMl: val('pbBloodLoss_'+caseId)||'—',
    n1Count:n1, n2Count:n2, completeDissection: val('pbDissection_'+caseId), highestNodeStatus: val('pbHighNode_'+caseId),
    resectionStatus: val('pbResection_'+caseId),
    adhesions: val('pbAdhesions_'+caseId), hilarFibrosis: val('pbFibrosis_'+caseId), unexpectedN2: val('pbUnexpectedN2_'+caseId),
    complications, narrative: val('pbNarrative_'+caseId),
    qualityFlag: (n1<1 || n2<3),
    completedAt: new Date(),
  };
  const stage = c.timeline.find(t=>t.stage==='Surgery');
  if(stage){
    stage.date = new Date();
    stage.summary = sp.phaseB.actualExtent+' via '+sp.phaseB.actualApproach+'. Resection status: '+sp.phaseB.resectionStatus+'. '+(complications.length?'Complications: '+complications.join(', ')+'.':'No intraoperative complications.');
  }
  const pathStage = c.timeline.find(t=>t.stage==='Surgical Pathology');
  if(pathStage && !pathStage.date){ pathStage.summary = 'Specimen received '+fmtDate(new Date())+' — awaiting pathology report.'; }
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Operative record completed. Resection status: '+sp.phaseB.resectionStatus+'.'+(sp.phaseB.qualityFlag?' Flag: does not meet NCCN 3+1 nodal quality criterion.':''), kind:'system'});
  toast('Operative record completed.'+(sp.phaseB.qualityFlag?' Nodal quality flag raised.':''));
  renderPage();
}

/* ============================================================
   TAB: ADJUVANT THERAPY (Stop 12 — computed regimen engine)
   The regimen picker is a pure function of 5 inherited gate inputs,
   not a free menu. Three hard rules are enforced: no double
   chemotherapy, no ICI switching (continuation lock), and a
   driver-mutation lock that disables all ICI options outright.
   ============================================================ */
function computeAdjuvantEligibility(g){
  if(g.driverMutation && g.driverMutation !== 'None'){
    const map = {
      EGFR:{name:'Osimertinib', dose:'80 mg PO once daily', duration:'3 years', type:'oral_tki', reviewWeeks:8, monitor:['LFTs','ILD/pneumonitis screen','QTc screen']},
      ALK:{name:'Alectinib', dose:'600 mg PO twice daily', duration:'2 years', type:'oral_tki', reviewWeeks:8, monitor:['LFTs','CPK','ILD/pneumonitis screen']},
      RET:{name:'Selpercatinib', dose:'Per label', duration:'Per label', type:'oral_tki', reviewWeeks:8, monitor:['LFTs','QTc screen']},
    };
    return { branch:'targeted', options:[map[g.driverMutation]],
      disabledReason:'Driver-mutation lock: '+g.driverMutation+'-positive disease disables all PD-1/PD-L1 checkpoint-inhibitor options — only the matching targeted agent is offered.' };
  }
  if(g.priorNeoadjuvant && g.priorNeoadjuvant.indexOf('Chemo + ')===0){
    const agent = g.priorNeoadjuvant.replace('Chemo + ','');
    const map = {
      Pembrolizumab:{name:'Pembrolizumab (continuation)', drugName:'Pembrolizumab', fixedDose:200, dose:'200 mg IV q3w', duration:'up to 39 weeks (≈13 cycles)', type:'infusion', cycles:13, cycleLengthDays:21},
      Durvalumab:{name:'Durvalumab (continuation)', drugName:'Durvalumab', fixedDose:1500, dose:'1500 mg IV q4w', duration:'up to 12 cycles', type:'infusion', cycles:12, cycleLengthDays:28},
      Nivolumab:{name:'Nivolumab (continuation)', drugName:'Nivolumab', fixedDose:480, dose:'480 mg IV q4w', duration:'up to 12 cycles (1 yr)', type:'infusion', cycles:12, cycleLengthDays:28},
    };
    return { branch:'ici_continuation', options:[map[agent]],
      disabledReason:'ICI-continuation lock: the adjuvant agent must be the same one used neoadjuvantly ('+agent+') — switching is disabled. No double chemotherapy: adjuvant chemo is disabled since chemo was already given neoadjuvantly.' };
  }
  if(g.priorNeoadjuvant === 'None'){
    const chemo = { name:(g.histology==='Squamous'?'Cisplatin + Gemcitabine':'Cisplatin + Pemetrexed'), drugName:(g.histology==='Squamous'?'Gemcitabine':'Pemetrexed'), fixedDose:(g.histology==='Squamous'?1250:500), dose:'Platinum doublet', duration:'4 cycles', type:'infusion', cycles:4, cycleLengthDays:21 };
    const iciOptions = [];
    if(g.pdl1Band !== '<1%'){
      iciOptions.push({ name:'Adjuvant chemo → Atezolizumab', drugName:'Atezolizumab', fixedDose:1200, dose:'1200 mg IV q3w (after chemo)', duration:'16 cycles (1 year)', type:'infusion', cycles:16, cycleLengthDays:21 });
    }
    iciOptions.push({ name:'Adjuvant chemo → Pembrolizumab', drugName:'Pembrolizumab', fixedDose:200, dose:'200 mg IV q3w (after chemo)', duration:'up to 1 year', type:'infusion', cycles:17, cycleLengthDays:21 });
    return { branch:'chemo_then_ici', options:[chemo].concat(iciOptions),
      disabledReason:'No neoadjuvant therapy given — adjuvant chemotherapy is available; de novo ICI requires prior adjuvant platinum chemo.' };
  }
  return { branch:'observation', options:[],
    disabledReason:'Prior neoadjuvant chemo alone, with no matching continuation agent — adjuvant chemotherapy remains disabled (no double chemotherapy).' };
}
function branchLabel(b){
  return {targeted:'Targeted adjuvant therapy (driver-positive)', ici_continuation:'ICI continuation (same agent as neoadjuvant)', chemo_then_ici:'Adjuvant chemotherapy ± de novo ICI', observation:'Observation only'}[b] || b;
}
function renderTabAdjuvant(c){
  const ap = c.adjuvantPortal;
  const g = ap.gateInputs;
  const elig = computeAdjuvantEligibility(g);
  const header = '<div class="grid grid-4">'+
    kv('Histology', g.histology)+kv('Driver mutation', g.driverMutation)+kv('PD-L1', g.pdl1Band)+kv('Prior neoadjuvant', g.priorNeoadjuvant)+
  '</div>'+
  '<div class="grid grid-4">'+kv('Resection status', g.resectionStatus)+'</div>';
  const eligBanner = '<div class="callout callout-gold"><strong>Eligible pathway: '+esc(branchLabel(elig.branch))+'</strong><br>'+esc(elig.disabledReason||'')+'</div>';
  const safetyGateNeeded = ap.regimenLocked && ap.regimenType!=='observation' && !ap.safetyGateConfirmed;
  let body;
  if(!ap.regimenLocked) body = renderRegimenSelector(c, elig);
  else if(safetyGateNeeded) body = renderAdjuvantSafetyGate(c);
  else if(ap.regimenType==='oral_tki') body = renderOralTKIPanel(c, ap);
  else if(ap.regimenType==='observation') body = '<div class="card card-pad"><div style="font-weight:700;margin-bottom:4px;">Observation — no adjuvant systemic therapy</div><div style="font-size:12.5px;color:var(--ink-muted);">Reason: '+esc(ap.regimen.reason)+'</div></div>';
  else body = renderAdjuvantInfusionPanel(c, ap);
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+dataEntryStageHeader(c,'Adjuvant Therapy')+header+eligBanner+body+
    (ap.regimenLocked ? renderCompletionStatus(c, ap) : '')+
  '</div>';
}
const SAFETY_GATE_ITEMS = [
  'Baseline CBC + CMP within 3 days',
  'Baseline TSH / free T4 (ICI)',
  'Baseline renal function adequate for chosen platinum',
  'Autoimmune disease / immunosuppression screen (ICI contraindication check)',
  'Patient counseled / consent recorded',
  'Medical oncology referral confirmed',
];
function renderAdjuvantSafetyGate(c){
  if(!STATE.adjuvantSafetyGate) STATE.adjuvantSafetyGate = {};
  const checked = STATE.adjuvantSafetyGate[c.id] || (STATE.adjuvantSafetyGate[c.id] = []);
  return '<div class="card" style="border-style:dashed;border-color:var(--warn);"><div class="card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
    '<h3>Block C &middot; Pre-treatment Safety Gate</h3>'+
    '<div style="font-size:11.5px;color:var(--ink-muted);">Must be green before the cycle log opens.</div>'+
    '<div style="display:flex;flex-direction:column;gap:6px;">'+SAFETY_GATE_ITEMS.map((item,i)=>
      '<label class="checkline"><input type="checkbox" data-safety-gate="'+c.id+'" data-gate-idx="'+i+'" '+(checked.includes(i)?'checked':'')+'> '+esc(item)+'</label>'
    ).join('')+'</div>'+
    '<div style="font-size:11.5px;color:var(--ink-faint);">'+checked.length+' of '+SAFETY_GATE_ITEMS.length+' complete.</div>'+
    '<button class="btn btn-gold" data-confirm-safety-gate="'+c.id+'" '+(checked.length<SAFETY_GATE_ITEMS.length?'disabled':'')+'>'+icon('checkCircle',15)+' Confirm Safety Gate & Open Cycle Log</button>'+
  '</div></div>';
}
function submitAdjuvantSafetyGate(caseId){
  const c = findCase(caseId); if(!c) return;
  const ap = c.adjuvantPortal;
  const checked = (STATE.adjuvantSafetyGate && STATE.adjuvantSafetyGate[caseId]) || [];
  if(checked.length < SAFETY_GATE_ITEMS.length){ toast('Complete every safety-gate item before opening the cycle log.'); return; }
  ap.safetyGateConfirmed = true;
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Pre-treatment safety gate confirmed (Stop 11, Block C) — cycle log opened.', kind:'system'});
  toast('Safety gate confirmed — cycle log opened.');
  renderPage();
}
function renderRegimenSelector(c, elig){
  const uid = c.id;
  return '<div class="card" style="border-style:dashed;"><div class="card-pad" style="display:flex;flex-direction:column;gap:12px;">'+
    '<h3>Select Regimen</h3>'+
    '<div style="display:flex;flex-direction:column;gap:8px;">'+
      elig.options.map((o,i)=>'<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border-strong);border-radius:8px;cursor:pointer;">'+
        '<input type="radio" name="regimenChoice_'+uid+'" value="'+i+'" '+(i===0?'checked':'')+'>'+
        '<span style="flex:1;"><strong>'+esc(o.name)+'</strong> — '+esc(o.dose)+', '+esc(o.duration)+'</span>'+
      '</label>').join('')+
      '<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px dashed var(--border-strong);border-radius:8px;cursor:pointer;">'+
        '<input type="radio" name="regimenChoice_'+uid+'" value="observation" data-obs-radio="'+uid+'" '+(elig.options.length?'':'checked')+'>'+
        '<span style="flex:1;"><strong>Observation</strong> — no adjuvant systemic therapy</span>'+
      '</label>'+
    '</div>'+
    '<div class="field" id="obsReasonWrap_'+uid+'" hidden><label>Reason for observation</label><input type="text" id="obsReason_'+uid+'" placeholder="e.g. stage, comorbidity, patient choice, toxicity"></div>'+
    '<button class="btn btn-gold" data-lock-regimen="'+uid+'">'+icon('lock',15)+' Confirm & Lock Regimen</button>'+
  '</div></div>';
}
function renderAdjuvantInfusionPanel(c, ap){
  const tl = ap.log;
  const firstPending = tl.cycles.findIndex(cy=>cy.status==='pending');
  const activeIdx = STATE.adjuvantCycleActive[c.id] ?? (firstPending>=0 ? firstPending : tl.cycles.length-1);
  const idx = Math.max(0, Math.min(activeIdx, tl.cycles.length-1));
  const cycle = tl.cycles[idx];
  const givenCount = tl.cycles.filter(cy=>cy.status==='given').length;
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    '<div class="callout callout-info">'+icon('sparkle',13)+' '+esc(tl.regimen)+' — '+givenCount+' of '+tl.numCycles+' cycles given.</div>'+
    renderRDIBanner(tl)+
    '<div class="stepper">'+tl.cycles.map((cy,i)=>{
      const stCls = cy.status==='given' ? 'done' : (i===idx?'current':'');
      return '<div class="step '+stCls+'" data-adj-cycle="'+c.id+'" data-idx="'+i+'">'+
        '<div class="step-line"></div><div class="step-dot">'+(cy.status==='given'?icon('check',15):(i+1))+'</div>'+
        '<span class="step-label">Cycle '+(i+1)+'</span></div>';
    }).join('')+'</div>'+
    renderCycleDetail(c, tl, cycle, idx, null, 'adj')+
  '</div>';
}
function submitAdjCycleLog(caseId, cycleIdx, uid){
  const c = findCase(caseId); if(!c) return;
  const tl = c.adjuvantPortal.log;
  const cycle = tl.cycles[cycleIdx];
  const labsEl = document.getElementById('txlabs_'+uid);
  if(!labsEl || !labsEl.checked){ toast('Pre-cycle labs must be reviewed before this cycle can be marked given.'); return; }
  const doses = tl.drugs.map((d,i)=>{
    const planned = d.refDose;
    const actualEl = document.getElementById('txdose_'+uid+'_'+i);
    const actual = actualEl ? (Number(actualEl.value)||planned) : planned;
    return {drug:d.name, planned, actual, modification: actual===planned ? 'none' : (actual<planned?'reduced':'increased')};
  });
  const toxicities = [];
  TOXICITY_OPTIONS.forEach((tx,i)=>{
    const cb = document.getElementById('txtox_'+uid+'_'+i);
    if(cb && cb.checked){
      const gradeSel = document.getElementById('txgrade_'+uid+'_'+i);
      toxicities.push({name:tx, grade:Number(gradeSel.value)});
    }
  });
  cycle.status = 'given'; cycle.actualDate = new Date(); cycle.doses = doses; cycle.toxicities = toxicities; cycle.labsEntered = true;
  const highGrade = toxicities.some(t=>t.grade>=3);
  cycle.actionTaken = highGrade ? 'MDT re-review' : 'none';
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(),
    text:'Adjuvant cycle '+(cycleIdx+1)+' of '+tl.regimen+' logged as given.'+(highGrade?' Grade ≥3 toxicity or immune-related AE — flagged for MDT re-review before the next cycle.':''), kind:'system'});
  toast('Adjuvant cycle '+(cycleIdx+1)+' marked as given.'+(highGrade?' Escalated for MDT re-review.':''));
  renderPage();
}
function generateOralReviews(opt){
  return Array.from({length:5}, (_,i)=>({
    index:i+1, scheduledDate: daysAgo(2 - i*opt.reviewWeeks*7), status:'pending',
    adherencePct:null, doseAction:null, doseReason:null, labsOk:null, ildScreen:null, qtcScreen:null, restagingDate:null, ongoing:null, completedAt:null,
  }));
}
function renderOralTKIPanel(c, ap){
  const opt = ap.regimen;
  const reviews = ap.reviews;
  const firstPending = reviews.findIndex(r=>r.status==='pending');
  const activeIdx = STATE.oralReviewActive[c.id] ?? (firstPending>=0 ? firstPending : reviews.length-1);
  const idx = Math.max(0, Math.min(activeIdx, reviews.length-1));
  const review = reviews[idx];
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    '<div class="callout callout-info">'+icon('sparkle',13)+' '+esc(opt.name)+' — '+esc(opt.dose)+', '+esc(opt.duration)+'. Oral-TKI long-run template: interval reviews every '+opt.reviewWeeks+' weeks, not infusion cycles.</div>'+
    '<div class="stepper">'+reviews.map((r,i)=>{
      const stCls = r.status==='completed' ? 'done' : (i===idx?'current':'');
      return '<div class="step '+stCls+'" data-oral-review="'+c.id+'" data-idx="'+i+'"><div class="step-line"></div><div class="step-dot">'+(r.status==='completed'?icon('check',15):(i+1))+'</div><span class="step-label">Review '+(i+1)+'</span></div>';
    }).join('')+'</div>'+
    '<div style="font-size:11px;color:var(--ink-faint);">Continues every '+opt.reviewWeeks+'–12 weeks through the full '+opt.duration+' course.</div>'+
    renderOralReviewDetail(c, opt, review, idx)+
  '</div>';
}
function renderOralReviewDetail(c, opt, review, idx){
  if(review.status==='completed'){
    const flagged = review.ildScreen==='Positive' || review.qtcScreen==='Prolonged' || review.labsOk===false;
    return '<div class="card" style="background:var(--surface-2);"><div class="card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;"><h3>Review '+(idx+1)+' — Completed</h3><span class="mono" style="font-size:11px;color:var(--ink-faint);">'+fmtDate(review.completedAt)+'</span></div>'+
      '<div class="grid grid-3">'+kv('Adherence', review.adherencePct+'%')+kv('Dose action', review.doseAction+(review.doseReason?' ('+review.doseReason+')':''))+kv('Restaging imaging', review.restagingDate||'—')+'</div>'+
      '<div class="grid grid-3">'+kv('Labs', review.labsOk?'Within normal limits':'Abnormal')+kv('ILD/pneumonitis screen', review.ildScreen)+(opt.monitor.includes('QTc screen')?kv('QTc screen', review.qtcScreen):kv('Status',review.ongoing))+'</div>'+
      (flagged ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);">'+icon('alert',13)+' Abnormal finding — flagged for re-MDT review.</div>' : '<span class="badge '+(review.ongoing==='Ongoing'?'badge-tier1':'badge-tier3')+'">'+esc(review.ongoing)+'</span>')+
    '</div></div>';
  }
  const uid = c.id+'_r'+idx;
  return '<div class="card" style="border-style:dashed;"><div class="card-pad" style="display:flex;flex-direction:column;gap:12px;">'+
    '<h3>Review '+(idx+1)+' — Scheduled '+fmtDate(review.scheduledDate)+'</h3>'+
    '<div class="fields-grid">'+
      '<div class="field"><label>Adherence (%)</label><input type="number" id="orAdh_'+uid+'" placeholder="e.g. 95" min="0" max="100"></div>'+
      '<div class="field"><label>Dose action</label><select id="orDoseAction_'+uid+'"><option>Continued unchanged</option><option>Held</option><option>Reduced</option><option>Discontinued</option></select></div>'+
      '<div class="field"><label>Reason (if held/reduced/discontinued)</label><input type="text" id="orDoseReason_'+uid+'" placeholder="e.g. ILD, LFT elevation, adherence"></div>'+
    '</div>'+
    '<div class="fields-grid">'+
      '<div class="field"><label>Monitoring labs</label><select id="orLabs_'+uid+'"><option value="Yes">Within normal limits</option><option value="No">Abnormal — flag</option></select></div>'+
      '<div class="field"><label>ILD / pneumonitis screen</label><select id="orIld_'+uid+'"><option value="Negative">Negative</option><option value="Positive">Positive — flag</option></select></div>'+
      (opt.monitor.includes('QTc screen') ? '<div class="field"><label>QTc screen</label><select id="orQtc_'+uid+'"><option value="Normal">Normal</option><option value="Prolonged">Prolonged — flag</option></select></div>' : '')+
    '</div>'+
    '<div class="field"><label>Restaging imaging date (if done)</label><input type="text" id="orRestage_'+uid+'" placeholder="e.g. leave blank if not due"></div>'+
    '<div class="field"><label>Status</label><select id="orOngoing_'+uid+'"><option value="Ongoing">Ongoing</option><option value="Stopped">Stopped</option></select></div>'+
    '<button class="btn btn-gold" data-complete-review="'+c.id+'" data-review-idx="'+idx+'" data-uid="'+uid+'">'+icon('checkCircle',15)+' Complete Review '+(idx+1)+'</button>'+
  '</div></div>';
}
function submitCompleteReview(caseId, reviewIdx, uid){
  const c = findCase(caseId); if(!c) return;
  const ap = c.adjuvantPortal;
  const review = ap.reviews[reviewIdx];
  const val = id => { const el=document.getElementById(id); return el?el.value:''; };
  review.adherencePct = Number(val('orAdh_'+uid))||0;
  review.doseAction = val('orDoseAction_'+uid);
  review.doseReason = val('orDoseReason_'+uid);
  review.labsOk = val('orLabs_'+uid)==='Yes';
  review.ildScreen = val('orIld_'+uid);
  review.qtcScreen = document.getElementById('orQtc_'+uid) ? val('orQtc_'+uid) : null;
  review.restagingDate = val('orRestage_'+uid) || null;
  review.ongoing = val('orOngoing_'+uid);
  review.status = 'completed'; review.completedAt = new Date();
  const flagged = review.ildScreen==='Positive' || review.qtcScreen==='Prolonged' || !review.labsOk;
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Oral-TKI interval review '+(reviewIdx+1)+' completed.'+(flagged?' Abnormal finding flagged for re-MDT review.':''), kind:'system'});
  toast('Review '+(reviewIdx+1)+' completed.'+(flagged?' Flagged for re-MDT review.':''));
  renderPage();
}
function renderCompletionStatus(c, ap){
  const options = ['Completed as planned','Discontinued for toxicity','Discontinued for recurrence/progression','Ongoing maintenance','Observation only'];
  return '<div class="card card-pad" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">'+
    '<div class="field" style="flex:1;min-width:240px;"><label>Completion status (routes to Stop 13 — Surveillance)</label><select id="adjCompletion_'+c.id+'">'+options.map(o=>'<option '+(ap.completionStatus===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>'+
    '<button class="btn btn-secondary btn-sm" data-save-completion="'+c.id+'">'+icon('checkCircle',14)+' Save Status</button>'+
  '</div>';
}
function submitLockRegimen(caseId){
  const c = findCase(caseId); if(!c) return;
  const ap = c.adjuvantPortal;
  const elig = computeAdjuvantEligibility(ap.gateInputs);
  const checked = document.querySelector('input[name="regimenChoice_'+caseId+'"]:checked');
  if(!checked) return;
  const val = checked.value;
  if(val==='observation'){
    const reason = (document.getElementById('obsReason_'+caseId)||{}).value || 'Not specified';
    ap.regimenLocked = true; ap.regimenType = 'observation'; ap.regimen = {name:'Observation', reason};
    markStageComplete(c, 'Adjuvant Therapy', 'Observation — no adjuvant systemic therapy. Reason: '+reason+'.');
    c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Adjuvant therapy: Observation selected. Reason: '+reason+'. Routes to Stop 13 — Surveillance.', kind:'system'});
    toast('Observation selected — routed to surveillance.');
    renderPage();
    return;
  }
  const opt = elig.options[Number(val)];
  if(!opt) return;
  ap.regimenLocked = true; ap.regimenType = opt.type; ap.regimen = opt;
  if(opt.type==='oral_tki'){
    ap.reviews = generateOralReviews(opt);
  } else {
    ap.log = { regimen:opt.name, intent:'Adjuvant', numCycles:opt.cycles, cycleLengthDays:opt.cycleLengthDays,
      drugs:[{name:opt.drugName, dosing:'fixed', refDose:opt.fixedDose, unit:'mg'}],
      cycles: Array.from({length:opt.cycles}, (_,i)=>({index:i+1, plannedDate: daysAgo(-(i*opt.cycleLengthDays)), status:'pending', actualDate:null, delayDays:0, delayReason:null, doses:null, toxicities:[], actionTaken:null, labsEntered:false})) };
  }
  markStageComplete(c, 'Adjuvant Therapy', 'Regimen locked: '+opt.name+' ('+opt.duration+').');
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Adjuvant regimen locked: '+opt.name+' ('+opt.duration+').', kind:'system'});
  toast('Regimen locked: '+opt.name+'.');
  renderPage();
}
function submitCompletionStatus(caseId){
  const c = findCase(caseId); if(!c) return;
  const ap = c.adjuvantPortal;
  ap.completionStatus = document.getElementById('adjCompletion_'+caseId).value;
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Adjuvant therapy completion status: '+ap.completionStatus+'.'+((ap.completionStatus==='Completed as planned'||ap.completionStatus==='Ongoing maintenance')?' Routes to Stop 13 — Surveillance.':''), kind:'system'});
  toast('Completion status saved: '+ap.completionStatus+'.');
  renderPage();
}

/* ============================================================
   TAB: SURVEILLANCE (Stop 13) — auto-booked imaging calendar +
   recurrence fork. The fork is where Milestone reactivates the
   MDT decision portal a second time, mirroring Stop 10's pattern.
   Also carries the two Evidence-Engine modules deferred from
   Phase 2: the relapse-hazard band and ctDNA/MRD integration.
   ============================================================ */
const SURVEILLANCE_BRANCHES = {
  branch1:{label:'Stage I–II, surgery ± systemic therapy (no RT)', desc:'H&P + chest CT ± contrast every 6 months for 2–3 years, then H&P + low-dose non-contrast chest CT annually.'},
  branch2:{label:'Stage I–II treated with RT, any Stage III, or oligometastatic Stage IV', desc:'H&P + chest CT ± contrast every 3–6 months for 3 years, then every 6 months for 2 years, then annual low-dose non-contrast CT.'},
};
const SURVEILLANCE_SYMPTOMS = ['New cough','Hemoptysis','Dyspnea','Chest/bone pain','Weight loss','New neurologic symptoms','Hoarseness'];
function extractStageGroup(stageStr){
  const m = String(stageStr).match(/Stage\s+(IV|III[ABC]?|II[AB]?|I[AB]?)/i);
  return m ? m[1].toUpperCase() : 'II';
}
function computeHazardInfo(stageStr){
  const g = extractStageGroup(stageStr);
  if(g.indexOf('III')===0) return {peak:13.5, note:'Stage III: highest, earliest peak ≈13–14 months, with a long tail to ≥3 years.'};
  if(g.indexOf('IV')===0) return {peak:14, note:'Oligometastatic Stage IV: pattern similar to Stage III — sustained risk.'};
  if(g.indexOf('II')===0) return {peak:12.5, note:'Stage II: hazard peak ≈12–13 months, long tail.'};
  return {peak:17.6, note:'Stage I: consistently low hazard; slight peak ≈17.6 months.'};
}
function renderHazardBand(c, sv){
  const info = computeHazardInfo(c.stage);
  const elapsed = sv.monthsElapsed;
  const diffFromPeak = elapsed - info.peak;
  const zone = Math.abs(diffFromPeak) <= 4 ? 'red' : (diffFromPeak < -10 || diffFromPeak > 18 ? 'green' : 'amber');
  const zoneMeta = {red:{color:'var(--crit)', label:'Peak-hazard window'}, amber:{color:'var(--warn)', label:'Rising hazard'}, green:{color:'var(--good)', label:'Low hazard'}}[zone];
  const totalMonths = 36;
  const pct = Math.min(97, (elapsed/totalMonths)*100);
  const peakPct = Math.min(90, Math.max(10,(info.peak/totalMonths)*100));
  const driverNote = (c.biomarkers && c.biomarkers.egfr==='Positive') ? ' EGFR-mutant disease shows a sustained high-risk phase — intensified surveillance is extended toward 3 years rather than tapering at 2.' : '';
  const gradient = 'linear-gradient(90deg, var(--good) 0%, var(--good) '+Math.max(0,peakPct-18)+'%, var(--warn) '+Math.max(0,peakPct-9)+'%, var(--crit) '+peakPct+'%, var(--warn) '+Math.min(100,peakPct+9)+'%, var(--good) '+Math.min(100,peakPct+20)+'%, var(--good) 100%)';
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;"><h3 style="font-size:13px;">Recurrence-Hazard Band</h3><span class="badge" style="background:'+zoneMeta.color+';color:#fff;">'+zoneMeta.label+'</span></div>'+
    '<div style="position:relative;height:14px;border-radius:8px;background:'+gradient+';">'+
      '<div style="position:absolute;top:-4px;left:'+pct+'%;width:2px;height:22px;background:var(--ink);"></div>'+
    '</div>'+
    '<div style="font-size:11px;color:var(--ink-faint);display:flex;justify-content:space-between;"><span>0 mo</span><span>Disease-free interval: '+elapsed.toFixed(1)+' months</span><span>36+ mo</span></div>'+
    '<div style="font-size:12px;">'+esc(info.note)+driverNote+'</div>'+
    (zone!=='green' ? '<div class="callout" style="background:var(--warn-soft);border:1px solid transparent;color:var(--warn-ink);font-size:11.5px;">'+icon('alert',13)+' Approaching or within the peak recurrence-hazard window — confirm next imaging is scheduled.</div>' : '')+
  '</div>';
}
function renderCtdnaSection(c, sv){
  const rising = sv.ctdnaLog.length>=2 && sv.ctdnaLog.slice(-2).every(l=>l.result==='Detected');
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;">'+
      '<div><h3 style="font-size:13px;">ctDNA / MRD Monitoring</h3><div style="font-size:11px;color:var(--ink-faint);">Investigational — not a standard scheduled test for Stage I–III NSCLC.</div></div>'+
      '<label class="switch"><input type="checkbox" id="ctdnaToggle_'+c.id+'" '+(sv.ctdnaEnabled?'checked':'')+'><span class="track"></span></label>'+
    '</div>'+
    (sv.ctdnaEnabled ? (
      (sv.ctdnaLog.length ? '<div style="display:flex;flex-direction:column;gap:6px;">'+sv.ctdnaLog.map(l=>'<div style="display:flex;gap:10px;font-size:12px;align-items:center;"><span class="mono">'+fmtDate(l.date)+'</span><span class="badge '+(l.result==='Detected'?'badge-tier3':'badge-tier1')+'">'+esc(l.result)+'</span></div>').join('')+'</div>' : '<div style="font-size:12px;color:var(--ink-faint);">No draws logged yet.</div>')+
      '<div style="display:flex;gap:8px;align-items:center;">'+
        '<select id="ctdnaResult_'+c.id+'" style="padding:6px 8px;border:1px solid var(--border-strong);border-radius:6px;background:var(--surface);"><option value="Not detected">Not detected</option><option value="Detected">Detected</option></select>'+
        '<button class="btn btn-secondary btn-sm" data-log-ctdna="'+c.id+'">'+icon('plus',13)+' Log Result</button>'+
      '</div>'+
      (rising ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);font-size:11.5px;">'+icon('alert',13)+' Two consecutive rising/positive ctDNA results — auto-proposes MDT reactivation ahead of the next scheduled scan.</div>' : '')
    ) : '')+
  '</div>';
}
function renderTabSurveillance(c){
  const sv = c.surveillance;
  const branchInfo = SURVEILLANCE_BRANCHES[sv.branch];
  const firstPending = sv.visits.findIndex(v=>v.status==='pending');
  const activeIdx = STATE.surveillanceVisitActive[c.id] ?? (firstPending>=0 ? firstPending : sv.visits.length-1);
  const idx = Math.max(0, Math.min(activeIdx, sv.visits.length-1));
  const visit = sv.visits[idx];
  return '<div style="display:flex;flex-direction:column;gap:16px;">'+
    dataEntryStageHeader(c,'Surveillance')+
    '<div class="callout callout-gold"><strong>Schedule: '+esc(branchInfo.label)+'</strong><br>'+esc(branchInfo.desc)+'</div>'+
    renderHazardBand(c, sv)+
    renderCtdnaSection(c, sv)+
    '<div class="stepper">'+sv.visits.map((v,i)=>{
      const stCls = v.status==='completed' ? 'done' : (i===idx?'current':'');
      const dotStyle = (v.imagingResult==='Suspected recurrence') ? 'background:var(--crit-soft);border-color:var(--crit);color:var(--crit);' : '';
      return '<div class="step '+stCls+'" data-visit-nav="'+c.id+'" data-idx="'+i+'">'+
        '<div class="step-line"></div><div class="step-dot" style="'+dotStyle+'">'+(v.status==='completed'?icon('check',15):(i+1))+'</div>'+
        '<span class="step-label">Visit '+(i+1)+'</span></div>';
    }).join('')+'</div>'+
    renderVisitDetail(c, sv, visit, idx)+
    renderSurvivorshipPanel(c, sv)+
  '</div>';
}
function renderVisitDetail(c, sv, visit, idx){
  if(visit.status==='completed'){
    const flagged = visit.imagingResult==='Suspected recurrence';
    return '<div class="card" style="background:var(--surface-2);'+(flagged?'border-color:var(--crit);':'')+'"><div class="card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;"><h3>Visit '+(idx+1)+' — Completed</h3><span class="mono" style="font-size:11px;color:var(--ink-faint);">'+fmtDate(visit.completedAt)+'</span></div>'+
      '<div class="grid grid-3">'+kv('Imaging result', visit.imagingResult)+kv('ECOG', visit.ecog)+kv('Smoking status', visit.smokingStatus)+'</div>'+
      (visit.brainMriIndicated ? '<div class="grid grid-3">'+kv('Brain MRI (risk-factor triggered)', visit.brainMriDone||'Not yet done')+'</div>' : '')+
      (visit.symptoms.length ? '<div style="display:flex;gap:6px;flex-wrap:wrap;">'+visit.symptoms.map(s=>'<span class="chip">'+esc(s)+'</span>').join('')+'</div>' : '<div style="font-size:12px;color:var(--ink-faint);">No new symptoms reported.</div>')+
      (flagged ? renderRecurrenceFork(c, visit) : '')+
    '</div></div>';
  }
  const uid = c.id+'_v'+idx;
  return '<div class="card" style="border-style:dashed;"><div class="card-pad" style="display:flex;flex-direction:column;gap:12px;">'+
    '<h3>Visit '+(idx+1)+' — Scheduled '+fmtDate(visit.scheduledDate)+'</h3>'+
    '<div>'+
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink-faint);margin-bottom:6px;">New symptoms since last visit</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:12px;">'+SURVEILLANCE_SYMPTOMS.map((s,i)=>'<label class="checkline"><input type="checkbox" id="svSym_'+uid+'_'+i+'" value="'+esc(s)+'"> '+esc(s)+'</label>').join('')+'</div>'+
    '</div>'+
    '<div class="fields-grid">'+
      '<div class="field"><label>Imaging result</label><select id="svImaging_'+uid+'"><option value="No evidence of disease">No evidence of disease</option><option value="Indeterminate">Indeterminate — short-interval re-image</option><option value="Suspected recurrence">Suspected recurrence</option></select></div>'+
      '<div class="field"><label>ECOG PS</label><select id="svEcog_'+uid+'"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></div>'+
      '<div class="field"><label>Smoking status</label><select id="svSmoking_'+uid+'"><option>Never</option><option>Former</option><option>Current</option></select></div>'+
    '</div>'+
    '<label class="checkline"><input type="checkbox" id="svCessation_'+uid+'"> Smoking-cessation counseling delivered (mandatory)</label>'+
    (visit.brainMriIndicated ? '<div class="field"><label>Brain MRI (risk-factor triggered — not routine)</label><select id="svBrainMri_'+uid+'"><option value="Not indicated this visit">Not indicated this visit</option><option value="Done — negative">Done — negative</option><option value="Done — positive">Done — positive</option></select></div>' : '')+
    '<button class="btn btn-gold" data-complete-visit="'+c.id+'" data-visit-idx="'+idx+'" data-uid="'+uid+'">'+icon('checkCircle',15)+' Complete Visit '+(idx+1)+'</button>'+
  '</div></div>';
}
function renderRecurrenceFork(c, visit){
  if(visit.classification){
    return '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);">'+icon('alert',13)+' Recurrence fork: FDG-PET/CT + Brain MRI auto-ordered. Classified as <strong>'+esc(visit.classification)+'</strong>. MDT reactivated for recurrence review — see Discussion tab.</div>';
  }
  return '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);display:flex;flex-direction:column;gap:8px;">'+
    '<div style="font-weight:700;display:flex;align-items:center;gap:7px;">'+icon('alert',14)+' Recurrence fork triggered</div>'+
    '<div style="font-size:12px;">Auto-ordered: FDG-PET/CT, Brain MRI with/without contrast (per NCCN NSCL-17). Classify the pattern and reactivate the MDT decision portal — this mirrors Stop 10’s reactivation pattern, not a fresh full board.</div>'+
    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">'+
      '<select id="recurClass_'+c.id+'" style="padding:6px 8px;border:1px solid var(--border-strong);border-radius:6px;background:var(--surface);"><option value="Locoregional recurrence">Locoregional recurrence</option><option value="Distant metastases">Distant metastases</option></select>'+
      '<button class="btn btn-danger btn-sm" data-reactivate-mdt="'+c.id+'">'+icon('users',13)+' Classify & Reactivate MDT</button>'+
    '</div>'+
  '</div>';
}
function renderSurvivorshipPanel(c, sv){
  const items = [
    {key:'immunizations', label:'Immunizations reviewed (influenza, zoster, pneumococcal, COVID, hepatitis)'},
    {key:'pulmRehab', label:'Pulmonary rehab referral (if COPD / post-lobectomy)'},
    {key:'psychosocial', label:'Psychosocial / financial-toxicity screen completed'},
    {key:'pcpHandoff', label:'Care-coordination handoff to primary care'},
  ];
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;">'+
    '<h3 style="font-size:13px;">Survivorship Checklist</h3>'+
    items.map(it=>'<label class="checkline"><input type="checkbox" data-survivorship="'+c.id+'" data-key="'+it.key+'" '+(sv.survivorship[it.key]?'checked':'')+'> '+esc(it.label)+'</label>').join('')+
  '</div>';
}
function submitCompleteVisit(caseId, visitIdx, uid){
  const c = findCase(caseId); if(!c) return;
  const visit = c.surveillance.visits[visitIdx];
  const val = id => { const el=document.getElementById(id); return el?el.value:''; };
  const symptoms = [];
  SURVEILLANCE_SYMPTOMS.forEach((s,i)=>{ const cb=document.getElementById('svSym_'+uid+'_'+i); if(cb&&cb.checked) symptoms.push(s); });
  visit.symptoms = symptoms;
  visit.imagingResult = val('svImaging_'+uid);
  visit.ecog = val('svEcog_'+uid);
  visit.smokingStatus = val('svSmoking_'+uid);
  visit.cessationCounseling = !!(document.getElementById('svCessation_'+uid)||{}).checked;
  if(visit.brainMriIndicated) visit.brainMriDone = val('svBrainMri_'+uid);
  visit.status = 'completed'; visit.completedAt = new Date();
  const recurrence = visit.imagingResult === 'Suspected recurrence';
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Surveillance visit '+(visitIdx+1)+' completed: '+visit.imagingResult+'.'+(recurrence?' Recurrence fork triggered — FDG-PET/CT and Brain MRI auto-ordered.':''), kind:'system'});
  toast('Visit '+(visitIdx+1)+' completed.'+(recurrence?' Recurrence fork triggered.':''));
  renderPage();
}
function submitReactivateMDT(caseId){
  const c = findCase(caseId); if(!c) return;
  const classSel = document.getElementById('recurClass_'+caseId);
  const classification = classSel ? classSel.value : 'Locoregional recurrence';
  const visit = c.surveillance.visits.find(v=>v.imagingResult==='Suspected recurrence' && !v.classification);
  if(visit) visit.classification = classification;
  c.tier = 3;
  c.status = 'Awaiting Responses';
  c.quorum = { invited: c.specialists.length, responded: 1 };
  c.specialists.forEach((s,i)=>{ s.status = i===0 ? 'responded' : 'pending'; });
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'Case reactivated for suspected recurrence ('+classification+'). Routed to Tier 3 synchronous MDT — recurrence/metastatic treatment pathway.', kind:'system'});
  toast('MDT reactivated for recurrence review. Case moved to Tier 3, Awaiting Responses.');
  STATE.workspaceTab[caseId] = 'discussion';
  navigate('workspace', {id:caseId});
}
function submitLogCtdna(caseId){
  const c = findCase(caseId); if(!c) return;
  const sel = document.getElementById('ctdnaResult_'+caseId);
  const result = sel ? sel.value : 'Not detected';
  c.surveillance.ctdnaLog.push({date:new Date(), result});
  const rising = c.surveillance.ctdnaLog.length>=2 && c.surveillance.ctdnaLog.slice(-2).every(l=>l.result==='Detected');
  toast('ctDNA result logged: '+result+'.'+(rising?' Rising trend — auto-proposed MDT reactivation.':''));
  renderPage();
}

/* ============================================================
   TAB: DISCHARGE NOTE (auto-composed narrative + clinician verification)
   ============================================================ */
function composeNarrative(c){
  const p = [];
  const md = t => (t==null ? t : String(t).replace(/[*][*]/g,''));
  p.push(c.patient.age+esc(c.patient.sex)+' with '+c.diagnosis+' ('+c.stage+').');
  c.timeline.forEach(s=>{
    if(!s.date || isMdtStage(s) || (c.summary && (s.stage==='Trial Box' || s.stage==='Consolidation Chemotherapy' || s.stage==='Surveillance Dashboard'))) return;
    /* Not just what was found — who reviewed it and what they made of it. A summary
       that only restates findings isn't "the entire journey"; the opinion and tier
       call are what a clinician reading this for the first time actually needs, the
       same way they'd get it from sitting in the room. */
    let para = s.summary;
    if(s.opinion) para += ' '+(s.owner||'The reviewing specialist')+'’s assessment: “'+s.opinion+'”';
    if(s.tierMark) para += s.tierMark.tier===2 ? ' Tier 2 — '+s.tierMark.reason+'.' : ' Tier 1, guideline-concordant from this specialty.';
    p.push(para);
  });
  /* The round table itself — every attributed opinion logged during discussion,
     not just the final decision that came out of it. */
  if(c.thread && c.thread.length){
    const roundTable = c.thread.filter(m=>m.kind!=='system').map(m=>m.author+' ('+m.role+'): “'+md(m.text)+'”').join(' ');
    if(roundTable) p.push('At multidisciplinary discussion, the following views were recorded — '+roundTable);
  }
  if(c.decision){
    let dp = 'Following multidisciplinary discussion ('+(c.tierBadgeOverride||TIER_META[c.tier]).label+'), the team elected to proceed with '+md(c.decision.plan)+(c.decision.reasoning ? ' Rationale: '+md(c.decision.reasoning) : '')+(c.decision.conditions ? ' '+md(c.decision.conditions) : '');
    if(c.decision.alternatives && c.decision.alternatives!=='—' && !c.decision.alternatives.trim().toUpperCase().startsWith('N/A')){
      dp += ' An alternative approach was considered and not taken forward: '+md(c.decision.alternatives);
    }
    if(c.decision.disagreement && !c.decision.disagreement.trim().toLowerCase().startsWith('none')){
      dp += ' Dissent was recorded: '+md(c.decision.disagreement);
    }
    if(c.decision.contingency && c.decision.contingency!=='—'){
      dp += ' Contingency plan: '+md(c.decision.contingency);
    }
    p.push(dp);
  } else {
    p.push('The case is currently '+c.status.toLowerCase()+'; a multidisciplinary decision has not yet been locked.');
  }
  if(c.summary){
    const S = c.summary;
    if(c.trialBox) p.push('Protocol (Trial box): “'+c.trialBox.pdfName+'” — '+c.trialBox.schemaSteps.join(' → ')+' '+c.trialBox.cite+'. '+c.trialBox.params.filter(x=>x.value).map(x=>x.label+': '+stripMd(x.value)+' '+x.cite).join('; ')+'.');
    p.push('Treatment delivered — '+S.treatment.map(r=>r.phase+': '+stripMd(r.delivered)+' ('+stripMd(r.key)+')').join('; ')+'.');
    p.push('Surveillance, '+stripMd(S.surveillance.schedule)+' — '+S.surveillance.rows.map(r=>r.modality+' '+r.cadence+' (last done '+r.last+(r.result && r.result!=='—' ? ': '+stripMd(r.result) : '')+'; next due '+stripMd(r.next)+')').join('; ')+'.');
    p.push(S.careStamp+'.');
  }
  if(c.treatmentLog){
    const given = c.treatmentLog.cycles.filter(cy=>cy.status==='given').length;
    p.push('Treatment log: '+given+' of '+c.treatmentLog.numCycles+' planned cycles of '+c.treatmentLog.regimen+' given to date.');
  }
  p.push('Current status: '+(c.outcome || (c.summary ? [c.summary.status.phase, c.summary.status.timeSinceCcr, c.summary.status.alerts, c.summary.status.lastCea].join('; ') : c.status))+'.');
  return p;
}
function renderTabNote(c){
  const ds = c.dischargeSummary;
  if(!ds){
    return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">'+
      '<div class="callout callout-info">Compiles every completed stop into one continuous account — nothing is invented, it only restates what has already been captured. A clinician must verify it before it counts as final.</div>'+
      '<button class="btn btn-gold" data-gen-summary="'+c.id+'">'+icon('sparkle',15)+' Generate Discharge Summary</button>'+
    '</div>';
  }
  const verified = !!ds.verifiedBy;
  const joined = ds.text.join('\n\n');
  const rows = Math.max(6, joined.split('\n').length + 2);
  return '<div style="display:flex;flex-direction:column;gap:14px;">'+
    (verified ?
      '<div class="callout callout-good" style="display:flex;align-items:center;gap:8px;">'+icon('checkCircle',15)+' Verified by <strong>'+esc(ds.verifiedBy)+'</strong> · '+fmtDateTime(ds.verifiedAt)+'</div>'
      : '<div class="callout callout-gold" style="display:flex;align-items:center;gap:8px;">'+icon('clock',15)+' Draft — editable until verified</div>'
    )+
    (verified ?
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;line-height:1.7;font-size:13px;">'+
        ds.text.map(para=>'<p style="margin:0;">'+esc(para)+'</p>').join('')+
        (ds.addendum ? '<p style="margin:0;padding-top:8px;border-top:1px solid var(--border);"><strong>Addendum:</strong> '+esc(ds.addendum)+'</p>' : '')+
      '</div>'
      : '<div class="card card-pad">'+
          '<textarea id="dischargeText_'+c.id+'" rows="'+rows+'" style="width:100%;border:none;outline:none;resize:vertical;font-family:inherit;font-size:13px;line-height:1.7;background:transparent;">'+esc(joined)+'</textarea>'+
        '</div>')+
    (!verified ?
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
        '<label class="checkline"><input type="checkbox" id="planUnchanged_'+c.id+'" checked> Treatment plan unchanged since last note</label>'+
        '<textarea id="addendum_'+c.id+'" rows="2" placeholder="Optional: note any change (e.g., dose held, plan revised)…" style="padding:8px 10px;border:1px solid var(--border-strong);border-radius:7px;font-family:inherit;"></textarea>'+
        '<div style="display:flex;gap:8px;">'+
          '<button class="btn btn-secondary btn-sm" data-regen-summary="'+c.id+'">'+icon('sparkle',14)+' Regenerate</button>'+
          '<button class="btn btn-gold" data-verify-summary="'+c.id+'">'+icon('checkCircle',15)+' Verify & Sign</button>'+
        '</div>'+
      '</div>'
      : '<button class="btn btn-secondary btn-sm" style="align-self:flex-start;" data-regen-summary="'+c.id+'">'+icon('sparkle',14)+' Regenerate (clears verification)</button>')+
  '</div>';
}
function applyGenerateSummary(caseId){
  const c = findCase(caseId); if(!c) return;
  c.dischargeSummary = { text: composeNarrative(c), generatedAt:new Date(), verifiedBy:null, verifiedAt:null, addendum:'' };
  renderPage();
}
function verifySummary(caseId){
  const c = findCase(caseId); if(!c || !c.dischargeSummary) return;
  const textEl = document.getElementById('dischargeText_'+caseId);
  if(textEl){
    const edited = textEl.value.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
    if(edited.length) c.dischargeSummary.text = edited;
  }
  const addEl = document.getElementById('addendum_'+caseId);
  if(addEl && addEl.value.trim()) c.dischargeSummary.addendum = addEl.value.trim();
  c.dischargeSummary.verifiedBy = ME.name+' · '+ME.role;
  c.dischargeSummary.verifiedAt = new Date();
  toast('Discharge summary verified and signed.');
  renderPage();
}
function regenerateSummary(caseId){
  applyGenerateSummary(caseId);
  toast('Summary regenerated from current data — verification cleared, please review and re-sign.');
}

/* ============================================================
   PAGE: NEW ASSESSMENT
   ============================================================ */
const RED_FLAG_ITEMS = [
  {key:'svc', label:'Facial/neck swelling, distended neck veins, or arm swelling', dx:'SVC obstruction'},
  {key:'airway', label:'Stridor or noisy/struggling breathing', dx:'Central airway obstruction'},
  {key:'cord', label:'Back pain with leg weakness, numbness, or bladder/bowel change', dx:'Spinal cord compression'},
  {key:'hemoptysis', label:'Coughing up large amounts of blood', dx:'Massive haemoptysis'},
  {key:'brainMet', label:'New confusion, one-sided weakness, or seizure', dx:'Brain metastasis'},
];
function renderRedFlagPanel(){
  const checked = STATE.redFlags;
  return '<div class="card card-pad" style="border-color:'+(checked.length?'var(--crit)':'var(--border)')+';background:'+(checked.length?'var(--crit-soft)':'var(--surface)')+';display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">'+
    (checked.length ? '<div style="display:flex;align-items:center;gap:8px;color:var(--crit-ink);font-weight:700;font-size:13px;">'+icon('alert',15)+' SAME-DAY REVIEW REQUIRED</div>' : '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Red-flag / emergency screen</div>')+
    '<div style="font-size:11px;color:var(--ink-faint);">Any tick fires a same-day escalation alert immediately — evaluated independent of screen completion.</div>'+
    '<div style="display:flex;flex-direction:column;gap:6px;">'+RED_FLAG_ITEMS.map(item=>
      '<label class="checkline"><input type="checkbox" data-redflag="'+item.key+'" '+(checked.includes(item.key)?'checked':'')+'> '+esc(item.label)+' <span style="color:var(--ink-faint);">('+esc(item.dx)+')</span></label>'
    ).join('')+'</div>'+
  '</div>';
}
function renderComorbidityPanel(values){
  const checked = STATE.comorbidities;
  const weights = {'COPD':1,'Cardiac':1,'Diabetes':1,'Renal':2,'Liver':1,'HIV':6,'Autoimmune':1};
  const charlson = checked.reduce((sum,k)=>sum+(weights[k]||0),0);
  const heightCm = Number(values.heightCm)||0, weightKg = Number(values.weightKg)||0;
  const bmi = (heightCm>0 && weightKg>0) ? (weightKg/Math.pow(heightCm/100,2)).toFixed(1) : null;
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;margin-top:14px;">'+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Comorbidities &amp; computed values</div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:10px;">'+Object.keys(weights).map(o=>
      '<label class="checkline"><input type="checkbox" data-comorbidity="'+esc(o)+'" '+(checked.includes(o)?'checked':'')+'> '+esc(o)+'</label>'
    ).join('')+'</div>'+
    '<div class="grid grid-3">'+kv('BMI (auto)', bmi?bmi+' kg/m²':'—')+kv('Charlson comorbidity index (auto)', String(charlson))+'</div>'+
  '</div>';
}
function renderAssessment(){
  const key = STATE.assessmentTemplate;
  const t = TEMPLATES[key];
  const values = STATE.assessmentValues[key] || (STATE.assessmentValues[key] = {});
  const allFields = t.sections.flatMap(s=>s.fields);
  const requiredFields = allFields.filter(f=>f.required);
  const filledRequired = requiredFields.filter(f=> values[f.key] !== undefined && values[f.key] !== '').length;
  const pct = requiredFields.length ? Math.round(filledRequired/requiredFields.length*100) : 100;

  return ''+
  (key==='Lung' ? renderExternalRecordsPanel() : '')+
  (key==='Lung' ? renderRedFlagPanel() : '')+
  '<div class="grid" style="grid-template-columns:200px 1fr;align-items:flex-start;">'+
    '<div class="card card-pad" style="display:flex;flex-direction:column;gap:6px;">'+
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);margin-bottom:4px;">'+icon('assessment',13)+' Select template</div>'+
      Object.keys(TEMPLATES).map(k=>
        '<button class="btn '+(k===key?'btn-primary':'btn-ghost')+' btn-sm" style="justify-content:space-between;" data-template="'+k+'">'+esc(TEMPLATES[k].label)+(k===key?icon('chevronRight',14):'')+'</button>'
      ).join('')+
      '<hr class="divider" style="margin:8px 0;">'+
      '<div style="font-size:11px;color:var(--ink-faint);">'+allFields.length+' structured fields</div>'+
    '</div>'+

    '<div class="card">'+
      '<div class="card-pad" style="padding-bottom:14px;">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">'+
          '<h3 style="font-size:16px;">'+esc(t.label)+' &mdash; Initial Assessment Template</h3>'+
          '<span class="chip"><span class="icon">'+icon('clock',13)+'</span> Median '+esc(t.medianTime)+'</span>'+
        '</div>'+
        '<div style="display:flex;align-items:center;gap:10px;margin-top:12px;">'+
          '<div class="progress" style="flex:1;"><div style="width:'+pct+'%;background:'+(pct===100?'var(--good)':'var(--accent)')+';"></div></div>'+
          '<span style="font-size:12px;font-weight:700;font-family:var(--font-mono);white-space:nowrap;">'+pct+'% &middot; '+(requiredFields.length-filledRequired)+' pending</span>'+
        '</div>'+
      '</div>'+
      '<hr class="divider">'+
      '<div class="card-pad" id="templateForm" data-template-key="'+key+'">'+
        t.sections.map((sec,si)=> renderAccordionSection(sec, si, values, key)).join('')+
        (key==='Lung' ? renderComorbidityPanel(values) : '')+
      '</div>'+
      '<hr class="divider">'+
      '<div class="card-pad" style="display:flex;align-items:center;justify-content:space-between;">'+
        '<div class="callout callout-good" style="border:none;padding:0;background:none;">'+icon('checkCircle',14)+' All mandatory fields captured &rarr; auto-populates the MDT summary. No re-typing.</div>'+
        '<button class="btn btn-gold" id="saveAssessmentBtn">'+icon('plus',15)+' Save & Create MDT Case</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}
function isAccordionOpen(tkey, skey, idx){
  const map = STATE.assessmentAccordion[tkey] || (STATE.assessmentAccordion[tkey] = {});
  if(!(skey in map)) map[skey] = (idx===0);
  return map[skey];
}
function renderAccordionSection(sec, idx, values, tkey){
  const open = isAccordionOpen(tkey, sec.key, idx);
  return '<div class="accordion-item '+(open?'open':'')+'" data-accordion data-section-key="'+esc(sec.key)+'">'+
    '<div class="accordion-head" data-accordion-toggle>'+
      '<div class="ai-icon" style="background:var(--accent-soft);color:var(--accent-strong);">'+icon(sec.icon,15)+'</div>'+
      '<h4>'+esc(sec.title)+'</h4>'+
      '<span class="chev">'+icon('chevronDown',16)+'</span>'+
    '</div>'+
    '<div class="accordion-body">'+
      '<div class="fields-grid">'+sec.fields.map(f=>renderField(f, values[f.key], tkey)).join('')+'</div>'+
    '</div>'+
  '</div>';
}
function isAutoFilled(tkey, fieldKey){
  const set = STATE.autoFilledFields[tkey];
  return !!(set && set.has(fieldKey));
}
function autoFillBadge(){
  return '<span class="chip" style="font-size:9.5px;padding:1px 6px;background:var(--gold-soft);color:var(--gold-strong);border-color:transparent;">'+icon('sparkle',10)+'AI · verify</span>';
}
function renderField(f, val, tkey){
  const id = 'f_'+f.key;
  const auto = isAutoFilled(tkey, f.key);
  const wrapStyle = auto ? 'border-left:2px solid var(--gold);padding-left:8px;' : '';
  if(f.type==='check'){
    return '<label class="checkline" style="align-self:end;'+wrapStyle+'"><input type="checkbox" id="'+id+'" data-field="'+f.key+'" '+(val?'checked':'')+'> '+esc(f.label)+(auto?' '+autoFillBadge():'')+'</label>';
  }
  if(f.type==='select'){
    return '<div class="field" style="'+wrapStyle+'"><label>'+esc(f.label)+(f.required?' <span class="req">*</span>':'')+(auto?' '+autoFillBadge():'')+'</label>'+
      '<select id="'+id+'" data-field="'+f.key+'"><option value="">Select…</option>'+
      f.options.map(o=>'<option value="'+esc(o)+'" '+(val===o?'selected':'')+'>'+esc(o)+'</option>').join('')+
      '</select></div>';
  }
  return '<div class="field" style="'+wrapStyle+'"><label>'+esc(f.label)+(f.required?' <span class="req">*</span>':'')+(auto?' '+autoFillBadge():'')+'</label>'+
    '<input type="'+(f.type==='number'?'number':'text')+'" id="'+id+'" data-field="'+f.key+'" value="'+esc(val==null?'':val)+'" placeholder="'+(f.unit?f.unit:'')+'">'+
    '</div>';
}

/* ============================================================
   PAGE: CASE LIBRARY
   ============================================================ */
function renderLibrary(){
  const f = STATE.libraryFilter;
  const closed = CASES.filter(c=>c.status==='Decision Locked');
  const depts = Array.from(new Set(closed.map(c=>c.department)));
  const rows = closed.filter(c=>{
    if(f.dept!=='all' && c.department!==f.dept) return false;
    if(f.tier!=='all' && String(c.tier)!==f.tier) return false;
    if(f.outcome!=='all' && c.outcome!==f.outcome) return false;
    if(f.dissentOnly && !c.decision.disagreement.toLowerCase().startsWith('none')===false) {
      // keep cases whose disagreement text is not "None"
    }
    if(f.dissentOnly && c.decision.disagreement.trim().toLowerCase().startsWith('none')) return false;
    if(f.search){
      const hay = (c.id+' '+c.diagnosis+' '+c.stage+' '+c.tumourType).toLowerCase();
      if(!hay.includes(f.search.toLowerCase())) return false;
    }
    return true;
  });
  const outcomes = Array.from(new Set(closed.map(c=>c.outcome).filter(Boolean)));

  return ''+
  '<div class="card card-pad">'+
    '<div class="filter-bar">'+
      '<div class="search-wrap" style="flex:0 1 260px;"><span class="icon" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink-faint);">'+icon('search',15)+'</span>'+
        '<input type="text" id="librarySearch" placeholder="Search diagnosis, stage, case #…" value="'+esc(f.search)+'" style="padding-left:32px;"></div>'+
      '<select id="libFilterDept"><option value="all">All departments</option>'+depts.map(d=>'<option value="'+esc(d)+'"'+(f.dept===d?' selected':'')+'>'+esc(d)+'</option>').join('')+'</select>'+
      '<select id="libFilterTier"><option value="all">All tiers</option><option value="1"'+(f.tier==='1'?' selected':'')+'>Tier 1</option><option value="2"'+(f.tier==='2'?' selected':'')+'>Tier 2</option><option value="3"'+(f.tier==='3'?' selected':'')+'>Tier 3</option></select>'+
      '<select id="libFilterOutcome"><option value="all">All outcomes</option>'+outcomes.map(o=>'<option value="'+esc(o)+'"'+(f.outcome===o?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select>'+
      '<label class="checkline"><input type="checkbox" id="libFilterDissent" '+(f.dissentOnly?'checked':'')+'> Dissent recorded</label>'+
      '<div style="margin-left:auto;display:flex;align-items:center;gap:8px;">'+
        '<span style="font-size:12px;color:var(--ink-muted);">Anonymised teaching mode</span>'+
        '<label class="switch"><input type="checkbox" id="teachingModeToggle" '+(f.teaching?'checked':'')+'><span class="track"></span></label>'+
      '</div>'+
    '</div>'+
  '</div>'+
  '<div class="grid grid-3">'+
    (rows.length ? rows.map(c=>renderLibraryCard(c,f.teaching)).join('') :
      '<div class="card" style="grid-column:1/-1;"><div class="empty-state">'+icon('book',28)+'<div>No cases match these filters.</div></div></div>')+
  '</div>';
}
function outcomeBadge(outcome){
  const good = ['R0 achieved','Surgery completed, no complications','Protocol pathway — surgery scheduled','Emergency surgery performed'];
  const warn = ['Converted to CRT','Awaiting restaging'];
  const crit = ['Progressed on NACT'];
  let cls = 'badge-neutral';
  if(good.includes(outcome)) cls='badge-tier1';
  else if(warn.includes(outcome)) cls='badge-tier2';
  else if(crit.includes(outcome)) cls='badge-tier3';
  return '<span class="badge '+cls+'">'+esc(outcome)+'</span>';
}
function renderLibraryCard(c, teaching){
  const label = teaching ? 'Patient '+String.fromCharCode(65 + (parseInt(c.id,10)%26)) : c.patient.age+esc(c.patient.sex)+' &middot; '+esc(c.patient.initials);
  const mrn = teaching ? '••••' : esc(c.patient.mrn);
  const dissent = c.decision && !c.decision.disagreement.trim().toLowerCase().startsWith('none');
  return '<div class="card" style="display:flex;flex-direction:column;overflow:hidden;">'+
    ctMock(c.timeline.find(t=>t.hasImage))+
    '<div class="card-pad" style="display:flex;flex-direction:column;gap:8px;flex:1;">'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">'+
        '<div><div style="font-size:11px;color:var(--ink-faint);font-family:var(--font-mono);">Case #'+c.id+' &middot; MRN '+mrn+'</div>'+
        '<div style="font-weight:700;font-size:13.5px;">'+label+'</div></div>'+
        tierBadge(c.tier, c.tierBadgeOverride)+
      '</div>'+
      '<div style="font-size:12.5px;color:var(--ink-muted);">'+esc(c.diagnosis)+' &middot; '+esc(c.stage)+'</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">'+outcomeBadge(c.outcome)+(dissent?'<span class="badge badge-tier3">'+icon('alert',11)+' Dissent</span>':'')+'</div>'+
      '<div style="margin-top:auto;padding-top:8px;"><button class="btn btn-secondary btn-sm btn-block" data-view-reasoning="'+c.id+'">'+icon('eye',14)+' View reasoning</button></div>'+
    '</div>'+
  '</div>';
}

/* ============================================================
   PAGE: PATHWAYS
   ============================================================ */
function renderPathways(){
  const keys = Object.keys(PATHWAY_META);
  return ''+
  '<div class="grid grid-2">'+
    keys.map(k=>{
      const m = PATHWAY_META[k];
      const count = CASES.filter(c=>c.pathway===k).length;
      return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:10px;cursor:pointer;" data-pathway-card="'+esc(k)+'">'+
        '<div style="display:flex;align-items:center;gap:10px;">'+
          '<div style="width:38px;height:38px;border-radius:10px;background:var(--accent-soft);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;">'+icon(m.icon,19)+'</div>'+
          '<div><h3 style="font-size:14.5px;">'+esc(k)+'</h3><div style="font-size:11px;color:var(--ink-faint);">'+count+' case'+(count!==1?'s':'')+'</div></div>'+
        '</div>'+
        '<div style="font-size:12.5px;color:var(--ink-muted);line-height:1.55;">'+esc(m.desc)+'</div>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">'+m.depts.map(d=>'<span class="chip">'+esc(d)+'</span>').join('')+'</div>'+
      '</div>';
    }).join('')+
  '</div>'+
  '<div class="card card-pad callout-gold" style="background:var(--gold-soft);border-color:transparent;">'+
    '<div style="display:flex;align-items:center;gap:10px;font-size:13.5px;line-height:1.6;">'+icon('trendUp',20)+
    '<span>Preoperative MDT discussion changed management in <strong>81%</strong> of high-risk non-cardiac surgical patients — and <strong>32%</strong> did not undergo surgery at all.</span></div>'+
  '</div>'+
  '<div class="grid cols-2-1">'+
    '<div class="card card-pad">'+
      '<h3 style="margin-bottom:6px;">Institutional Memory & Teaching</h3>'+
      '<p style="font-size:12.5px;color:var(--ink-muted);margin-bottom:14px;">Every complex decision, in every department, becomes a searchable, teachable record.</p>'+
      '<button class="btn btn-primary btn-sm" data-go="library">'+icon('library',15)+' Open Case Library</button>'+
    '</div>'+
    '<div style="display:flex;flex-direction:column;gap:12px;">'+
      pathwayFeature('search','Search across every department, every decision, every outcome.')+
      pathwayFeature('book','Teach real cases with full context and reasoning.')+
      pathwayFeature('trendUp','Learn from what worked, what didn’t, and why.')+
    '</div>'+
  '</div>';
}
function pathwayFeature(iconName, text){
  return '<div class="card card-pad" style="display:flex;align-items:center;gap:12px;">'+
    '<div style="width:34px;height:34px;border-radius:9px;background:var(--surface-2);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon(iconName,17)+'</div>'+
    '<div style="font-size:12.5px;line-height:1.5;">'+text+'</div>'+
  '</div>';
}

/* ============================================================
   ACTIONS — triage, discussion, decision, specialists, templates
   ============================================================ */
const SPECIALIST_POOL = {
  'Cardiology':['Dr. R. Menon','RM'], 'Anaesthesia':['Dr. S. Pillai','SP'], 'Nephrology':['Dr. A. George','AG'],
  'Pulmonology':['Dr. K. Babu','KB'], 'Endocrinology':['Dr. M. Iqbal','MI'], 'Pathology':['Dr. R. Kulkarni','RK'],
  'Radiology':['Dr. P. Menon','PM'], 'Surgery':['Dr. V. Nair','VN'], 'Thoracic Surgery':['Dr. S. Krishnan','SK'],
  'Radiation Oncology':['Dr. N. Iyer','NI'], 'Medical Oncology':['Dr. L. Fernandez','LF'], 'ICU':['Dr. C. Varma','CV'],
  'Emergency Medicine':['Dr. F. Alam','FA'], 'Nursing':['Dr. J. Thomas','JT'], 'Palliative Care':['Dr. J. Thomas','JT'],
  'Gynaecologic Oncology':['Dr. H. Suresh','HS'],
};

/* ---------------- pre-configured team templates (one action invites the standard roster for the department) ---------------- */
const TEAM_TEMPLATES = {
  'Thoracic Oncology': {label:'Standard Thoracic MDT Team', roles:['Radiology','Thoracic Surgery','Radiation Oncology','Pathology','Medical Oncology']},
  'Breast Oncology': {label:'Standard Breast MDT Team', roles:['Radiology','Surgery','Radiation Oncology','Pathology','Medical Oncology']},
  'GI Oncology': {label:'Standard GI MDT Team', roles:['Radiology','Surgery','Radiation Oncology','Pathology','Medical Oncology']},
  'Head & Neck Oncology': {label:'Standard Head & Neck MDT Team', roles:['Radiology','Surgery','Radiation Oncology','Pathology','Medical Oncology']},
  'Gynaecologic Oncology': {label:'Standard Gynae-Onc MDT Team', roles:['Radiology','Gynaecologic Oncology','Radiation Oncology','Pathology','Medical Oncology']},
  'Surgery': {label:'Standard Pre-Op Clearance Team', roles:['Surgery','Anaesthesia','Cardiology','Pulmonology']},
  'Nephrology': {label:'Standard Complex Medical Team', roles:['Nephrology','Cardiology','Endocrinology']},
  'ICU': {label:'Standard Rapid Escalation Team', roles:['ICU','Emergency Medicine','Surgery','Radiology']},
};
function teamTemplateFor(c){ return TEAM_TEMPLATES[c.department] || null; }
function applyTeamTemplate(caseId){
  const c = findCase(caseId);
  const tpl = c && teamTemplateFor(c);
  if(!c || !tpl) return;
  const invitedRoles = c.specialists.map(s=>s.role);
  const missing = tpl.roles.filter(r=>!invitedRoles.includes(r));
  if(!missing.length){ toast('The '+tpl.label+' is already fully invited on this case.'); return; }
  missing.forEach(role=>{
    const pick = SPECIALIST_POOL[role] || ['Dr. Specialist','DR'];
    c.specialists.push({name:pick[0], role, status:'invited', initials:pick[1]});
  });
  c.quorum.invited = c.specialists.length;
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:tpl.label+' applied — invited '+missing.join(', ')+' in one action.', kind:'system'});
  toast(tpl.label+' applied — '+missing.length+' specialist(s) invited.');
  renderPage();
}

function runAutoTriage(refId){
  const r = REFERRALS.find(x=>x.id===refId);
  if(!r) return;
  const tier = computeReferralTier(r.signals);
  r._tier = tier;
  const resultBox = document.getElementById('ref-result-'+refId);
  if(resultBox) resultBox.innerHTML = tierBadge(tier);
  const card = document.getElementById('ref-'+refId);
  const triageBtn = card && card.querySelector('[data-triage]');
  if(triageBtn){
    triageBtn.parentElement.innerHTML = '<button class="btn btn-gold btn-sm" data-confirm-triage="'+refId+'">'+icon('check',14)+' Confirm &amp; Create MDT Case</button>';
  }
  toast('Auto-triage complete — routed to Tier '+tier+'.');
}

function confirmTriageCreate(refId){
  const idx = REFERRALS.findIndex(x=>x.id===refId);
  if(idx<0) return;
  const r = REFERRALS[idx];
  const tier = r._tier || computeReferralTier(r.signals);
  const newId = String(5700 + Math.floor(Math.random()*90));
  const newCase = {
    id:newId, tumourType:r.tumourType, pathway:'Oncology MDT', department:r.tumourType+' Oncology',
    patient:{initials:r.patient.initials, age:r.patient.age, sex:r.patient.sex, mrn:newId},
    diagnosis:r.diagnosis, stage:'Staging in progress',
    keyFacts:r.chips.slice(),
    tier, status: tier===1 ? 'Decision Locked' : 'Awaiting Responses',
    createdAt:new Date(), lockedAt: tier===1 ? new Date() : undefined,
    quorum: tier===1 ? {invited:1,responded:1} : {invited:2,responded:0},
    specialists: tier===1 ?
      [{name:ME.name, role:ME.role, status:'responded', initials:ME.initials}] :
      [{name:ME.name, role:ME.role, status:'opened', initials:ME.initials},
       {name:SPECIALIST_POOL.Radiology[0], role:'Radiology', status:'pending', initials:SPECIALIST_POOL.Radiology[1]}],
    thread:[{author:'System', role:'Auto-Triage', time:new Date(),
      text:'Referral auto-triaged to Tier '+tier+' and routed for '+(tier===1?'single-specialist sign-off.':tier===2?'asynchronous review.':'a synchronous meeting.'), kind:'system'}],
    decision: tier===1 ? {
      plan:'Guideline-concordant protocol pathway applied.',
      reasoning:'Meets institutional criteria for a standard-of-care pathway without full board discussion.',
      alternatives:'N/A — protocol-concordant.',
      risks:'Standard risks discussed with patient directly.',
      disagreement:'None.',
      contingency:'Escalate to Tier 2 if any atypical finding emerges on workup.',
    } : null,
    timeline: stagesForTumourType(r.tumourType),
    outcome: tier===1 ? 'Protocol pathway applied' : null,
  };
  CASES.unshift(newCase);
  REFERRALS.splice(idx,1);
  toast('Case #'+newId+' created and routed to Tier '+tier+'.');
  navigate('workspace', {id:newId});
}

function addSpecialist(caseId, role){
  const c = findCase(caseId);
  if(!c) return;
  const pick = SPECIALIST_POOL[role] || ['Dr. Specialist','DR'];
  c.specialists.push({name:pick[0], role, status:'invited', initials:pick[1]});
  c.quorum.invited = c.specialists.length;
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:pick[0]+' ('+role+') invited to this case.', kind:'system'});
  toast(pick[0]+' invited to Case #'+c.id+'.');
  renderPage();
}

/* ---------------- per-specialist running tier votes (escalation only — a case never auto-downgrades) ---------------- */
function tierVotesFor(c){ return c.tierVotes || (c.tierVotes = {}); }
function castTierVote(caseId, name, tier){
  const c = findCase(caseId); if(!c) return;
  const votes = tierVotesFor(c);
  votes[name] = tier;
  const maxVote = Math.max.apply(null, Object.values(votes));
  if(maxVote > c.tier){
    const from = c.tier;
    c.tier = maxVote;
    c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:name+' cast a Tier '+tier+' opinion — case escalated from Tier '+from+' to Tier '+maxVote+' based on specialist input.', kind:'system'});
    toast('Case #'+c.id+' escalated to Tier '+maxVote+' following '+name+'’s opinion.');
  } else {
    toast(name+' recorded a Tier '+tier+' opinion on Case #'+c.id+'.');
  }
  renderPage();
}
function renderTierVotePanel(c){
  const votes = tierVotesFor(c);
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;">'+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Specialist Tier Opinions</div>'+
    '<div style="font-size:11.5px;color:var(--ink-muted);line-height:1.5;">Any invited specialist can independently flag that this case needs a higher coordination tier. The case escalates automatically to the highest opinion cast — it never auto-downgrades.</div>'+
    '<div style="display:flex;flex-direction:column;gap:6px;">'+c.specialists.map(s=>{
      const v = votes[s.name];
      return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;flex-wrap:wrap;">'+
        '<span style="min-width:190px;">'+esc(s.name)+' &middot; '+esc(s.role)+'</span>'+
        '<div style="display:flex;gap:4px;">'+[1,2,3].map(t=>
          '<button class="btn '+(v===t?'btn-primary':'btn-ghost')+' btn-sm" style="padding:2px 10px;" data-tier-vote="'+c.id+'" data-vote-name="'+esc(s.name)+'" data-vote-tier="'+t+'">T'+t+'</button>'
        ).join('')+'</div>'+
      '</div>';
    }).join('')+'</div>'+
  '</div>';
}
/* ---------------- pending-response quorum (demo stand-in for specialists other than the logged-in persona) ---------------- */
function markResponded(caseId, name){
  const c = findCase(caseId); if(!c) return;
  const sp = c.specialists.find(s=>s.name===name);
  if(!sp || sp.status==='responded') return;
  sp.status = 'responded';
  c.quorum.responded = c.specialists.filter(s=>s.status==='responded').length;
  c.thread.push({author:name, role:sp.role, time:new Date(), text:'Responded to this case.', kind:'system'});
  const remaining = c.quorum.invited - c.quorum.responded;
  toast(name+' responded.'+(remaining>0 ? ' '+remaining+' more response(s) pending on Case #'+c.id+'.' : ' Quorum met on Case #'+c.id+'.'));
  renderPage();
}
function renderPendingResponsesPanel(c){
  const pending = c.specialists.filter(s=>s.status!=='responded');
  if(!pending.length) return '';
  return '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;">'+
    '<div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-faint);">Pending Responses</div>'+
    '<div style="font-size:11.5px;color:var(--ink-muted);">Every invited specialist must respond before a decision can be proposed.</div>'+
    '<div style="display:flex;flex-direction:column;gap:6px;">'+pending.map(s=>
      '<div style="display:flex;align-items:center;gap:8px;font-size:12px;flex-wrap:wrap;">'+
        '<span style="min-width:190px;">'+esc(s.name)+' &middot; '+esc(s.role)+'</span>'+
        (s.name===ME.name ? '<span style="color:var(--ink-faint);font-size:11px;">Post an opinion below to respond</span>' : '<button class="btn btn-secondary btn-sm" data-mark-responded="'+c.id+'" data-responder-name="'+esc(s.name)+'">Respond as '+esc(s.name)+'</button>')+
      '</div>'
    ).join('')+'</div>'+
  '</div>';
}
function postReply(caseId){
  const c = findCase(caseId);
  if(!c) return;
  const ta = document.getElementById('composerText-'+caseId);
  const text = ta ? ta.value.trim() : '';
  if(!text){ toast('Write an opinion before posting.'); return; }
  c.thread.push({author:ME.name, role:ME.role, time:new Date(), text});
  const me = c.specialists.find(s=>s.name===ME.name);
  if(me && me.status!=='responded'){
    me.status = 'responded';
    c.quorum.responded = c.specialists.filter(s=>s.status==='responded').length;
  }
  toast('Opinion posted to Case #'+c.id+'.');
  renderPage();
}

function setAssessmentField(key, value){
  const tkey = STATE.assessmentTemplate;
  const values = STATE.assessmentValues[tkey] || (STATE.assessmentValues[tkey] = {});
  values[key] = value;
  const filled = STATE.autoFilledFields[tkey];
  if(filled) filled.delete(key); // editing a field counts as the clinician verifying/overriding it
}

function saveAssessmentAsCase(){
  const key = STATE.assessmentTemplate;
  const values = STATE.assessmentValues[key] || {};
  const t = TEMPLATES[key];
  const allFields = t.sections.flatMap(s=>s.fields);
  const requiredFields = allFields.filter(f=>f.required);
  const filled = requiredFields.filter(f=>values[f.key]!==undefined && values[f.key]!=='').length;
  if(filled < requiredFields.length){
    toast('Complete the '+(requiredFields.length-filled)+' remaining required field(s) first.');
    return;
  }
  const newId = String(5800 + Math.floor(Math.random()*90));
  const stagingSec = t.sections.find(s=>s.key==='staging');
  const stageStr = stagingSec ? stagingSec.fields.map(f=>values[f.key]).filter(Boolean).join(' ') : '';
  const redFlags = key==='Lung' ? STATE.redFlags.slice() : [];
  const escalated = redFlags.length>0;
  const redFlagLabels = redFlags.map(rk=>{ const item = RED_FLAG_ITEMS.find(i=>i.key===rk); return item ? item.dx : rk; });
  const newCase = {
    id:newId, tumourType:key, pathway:'Oncology MDT', department:key+' Oncology',
    patient:{initials:'New', age:Number(values.age)||0, sex:values.sex||'—', mrn:newId},
    diagnosis:key+' — new referral', stage: stageStr || 'Staging captured',
    keyFacts:(escalated ? redFlagLabels.map(l=>'RED FLAG: '+l) : []).concat(allFields.filter(f=>values[f.key]).slice(0,6).map(f=>f.label+': '+values[f.key])).slice(0,6),
    tier: escalated ? 3 : 2, status:'Awaiting Responses',
    createdAt:new Date(),
    quorum:{invited:2, responded:0},
    specialists:[
      {name:ME.name, role:ME.role, status:'opened', initials:ME.initials},
      {name:SPECIALIST_POOL.Radiology[0], role:'Radiology', status:'pending', initials:SPECIALIST_POOL.Radiology[1]},
    ],
    thread:(escalated ? [{author:'System', role:'Auto-Triage', time:new Date(), text:'SAME-DAY REVIEW REQUIRED — red flag(s) at intake: '+redFlagLabels.join(', ')+'. Escalated to Tier 3, bypassing normal tier default.', kind:'system'}] : [])
      .concat([{author:'System', role:'Auto-Triage', time:new Date(), text:'Case created from the '+key+' Initial Assessment Template — 98% structured completeness at capture.', kind:'system'}]),
    decision:null,
    timeline: (function(){
      const stages = stagesForTumourType(key);
      stages[0].date = new Date();
      stages[0].summary = 'Captured via the '+key+' Initial Assessment Template: '+
        allFields.filter(f=>values[f.key]).slice(0,5).map(f=>f.label+' '+values[f.key]).join(', ')+'.';
      return stages;
    })(),
    outcome:null,
  };
  CASES.unshift(newCase);
  STATE.redFlags = []; STATE.comorbidities = [];
  toast(escalated ? 'Case #'+newId+' created — SAME-DAY REVIEW REQUIRED, escalated to Tier 3.' : 'Case #'+newId+' created from the '+key+' template.');
  navigate('workspace', {id:newId});
}

/* ============================================================
   MODALS
   ============================================================ */
function openReasoningModal(caseId){
  const c = findCase(caseId);
  if(!c) return;
  const html = ''+
    '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">Case #'+c.id+' &middot; Reasoning</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body">'+
      '<div style="font-size:12.5px;color:var(--ink-muted);margin-bottom:12px;">'+esc(c.diagnosis)+' &middot; '+esc(c.stage)+'</div>'+
      (c.decision ? renderDecisionCard(c.decision, false, c) : '<div class="empty-state">'+icon('clock',24)+'<div>No locked decision yet for this case.</div></div>')+
    '</div>';
  openModal(html, {wide:true});
}

function lockField(id,label,ph){
  return '<div class="field"><label>'+esc(label)+'</label><textarea id="'+id+'" rows="2" placeholder="'+esc(ph)+'" style="padding:8px 10px;border:1px solid var(--border-strong);border-radius:7px;font-family:inherit;outline:none;"></textarea></div>';
}
function lockSelect(id,label,options){
  return '<div class="field"><label>'+esc(label)+'</label><select id="'+id+'">'+options.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select></div>';
}
const MEETING_TYPES = ['Live in-person','Virtual','Hybrid','Asynchronous thread'];
const DISCUSSION_REASONS = ['Resectability in question','Stage III multimodality planning','Discordant staging','Driver mutation strategy','Borderline fitness','Trial candidacy','Progression','Other'];
const CONSENSUS_OPTIONS = ['Full consensus','Majority with dissent','Deferred — needs more data'];
const TRIAL_SCREENING_OPTIONS = ['Yes — eligible','Yes — not eligible','No suitable trial','Not screened'];
const NOTIFY_METHODS = ['In-person clinic','Phone','Telehealth'];
/* Stop 7 spec, Block E/F: the primary plan and every alternative considered are picked
   from this same closed list — never free-typed — so a decision can't collapse into an
   unstructured one-liner and "what else was considered" is always machine-readable. */
const PRIMARY_PLAN_OPTIONS = ['Neoadjuvant chemo-immunotherapy → surgery','Upfront surgery → adjuvant','Definitive concurrent chemoRT → consolidation immunotherapy','Definitive chemoRT → consolidation osimertinib (EGFR+)','Systemic therapy (advanced)','SABR','Best supportive care','Other'];
const REASON_NOT_CHOSEN_OPTIONS = ['— reason not chosen —','Higher operative risk','No OS advantage in this scenario','Patient preference','Fitness','Molecular contraindication','Nodal burden','Toxicity concern','Other'];
const RESECTABILITY_OPTIONS = ['Resectable','Potentially resectable (neoadjuvant then re-evaluate)','Unresectable'];
const RESECTABILITY_BASIS = ['R0 achievable','Nodal extent (single- vs multi-station)','No vascular or airway encasement','Acceptable operative risk','Lobectomy (not pneumonectomy) feasible'];
const CONTINGENCY_TRIGGERS = ['— trigger —','Progression on induction','Stable-or-better on restaging','Becomes unresectable','Toxicity','Margin-positive at surgery','Persistent N2'];
const CONTINGENCY_ACTIONS = ['— action —','Proceed to surgery','Switch to definitive chemoRT','Adjuvant therapy','Palliative systemic','Re-present to MDT'];
const TREATMENT_INTENT_OPTIONS = ['Curative','Palliative'];
const DISSENT_OPTIONS = ['No','Yes'];
/* Tier 3 quorum per the Stop 7 spec — the minimum specialty set required to enable lock
   for a locally advanced / N2 case (ACoS Optimal Resources for Cancer Care 2024). */
const TIER3_REQUIRED_SPECIALTIES = ['Thoracic Surgery','Medical Oncology','Radiation Oncology','Radiology','Pathology'];
function tier3QuorumGaps(c){
  if(c.tier!==3) return [];
  const haveRoles = new Set(c.specialists.map(s=>s.role));
  return TIER3_REQUIRED_SPECIALTIES.filter(r=>!haveRoles.has(r));
}
/* Biomarker → consolidation-agent safety binding: the plan can never contradict the
   molecular node, because it reads straight off it rather than being typed independently. */
function suggestConsolidationAgent(biomarkers){
  if(!biomarkers) return null;
  const egfrPositive = /positive/i.test(biomarkers.egfr||'') || /exon *19|l858r/i.test(biomarkers.egfrDetail||'');
  return egfrPositive ? 'Osimertinib' : 'Durvalumab';
}

/* ============================================================
   GENERIC PER-NODE STRUCTURED CAPTURE (any tumour type, any stop)
   Config-driven so a new stop is a schema entry, not new plumbing — this is what lets the
   next worked case (a different tumour type entirely) reuse the same 4-part card without
   rework. Findings are always structured (never free-typed, per every worked-case spec's
   own rule) — Opinion is the one deliberately-prose field, and Tier 1/2 is the sign-off
   that drives the OR-gate escalation.
   ============================================================ */
const NODE_FIELD_SCHEMAS = {
  'CT Chest/Abdomen (Diagnostic Imaging)': [
    {key:'tumorSizeCm', label:'Primary tumor size (cm)', type:'number'},
    {key:'morphology', label:'Morphology', type:'select', options:['Spiculated','Smooth','Lobulated','Irregular']},
    {key:'mediastinalAbutment', label:'Mediastinal / SVC abutment', type:'select', options:['None','Abuts, no encasement','Encasement <180°','Encasement ≥180°']},
    {key:'fatPlaneStatus', label:'Fat-plane status', type:'select', options:['Preserved','Lost (<2 cm)','Lost (≥2 cm)']},
    {key:'svcFillingDefect', label:'Intraluminal SVC filling defect', type:'check'},
    {key:'station4rSizeCm', label:'Station 4R node size (cm)', type:'number'},
    {key:'station7SizeCm', label:'Station 7 node size (cm)', type:'number'},
    {key:'contralateralNodes', label:'Contralateral (N3) nodal enlargement', type:'select', options:['None','Present']},
    {key:'pleuralEffusion', label:'Pleural effusion present', type:'check'},
    {key:'liverAdrenalLesion', label:'Liver / adrenal lesion', type:'select', options:['No lesion','Lesion present']},
  ],
  'PET-CT (Metabolic Staging)': [
    {key:'primarySuvmax', label:'Primary SUVmax', type:'number'},
    {key:'station4rSuvmax', label:'Station 4R SUVmax', type:'number'},
    {key:'station7Suvmax', label:'Station 7 SUVmax', type:'number'},
    {key:'contralateralMediastinalUptake', label:'Contralateral mediastinal uptake', type:'check'},
    {key:'supraclavicularUptake', label:'Supraclavicular uptake', type:'check'},
    {key:'distantUptake', label:'Distant (extra-thoracic) uptake', type:'check'},
  ],
  'Bronchoscopy (Airway Assessment)': [
    {key:'extrinsicCompression', label:'Extrinsic compression at RUL orifice', type:'check'},
    {key:'mucosalInfiltration', label:'Mucosal infiltration at RUL orifice', type:'check'},
    {key:'carinaStatus', label:'Main carina', type:'select', options:['Sharp and mobile','Widened / fixed','Involved']},
    {key:'distanceFromCarina', label:'Tumor distance from main carina', type:'select', options:['<2 cm','≥2 cm','Not applicable']},
    {key:'endobronchialObstruction', label:'Endobronchial obstruction requiring debulking', type:'check'},
  ],
  'EBUS-TBNA (Nodal Tissue Staging)': [
    {key:'station4rPasses', label:'Station 4R — passes', type:'number'},
    {key:'station4rRose', label:'Station 4R — ROSE result', type:'select', options:['Not sampled','Inadequate','Benign','Malignant']},
    {key:'station7Passes', label:'Station 7 — passes', type:'number'},
    {key:'station7Rose', label:'Station 7 — ROSE result', type:'select', options:['Not sampled','Inadequate','Benign','Malignant']},
    {key:'contralateralStation', label:'Contralateral check station (sampled)', type:'text'},
    {key:'contralateralRose', label:'Contralateral — ROSE result', type:'select', options:['Not sampled','Inadequate','Benign','Malignant']},
    {key:'otherStationsAssessed', label:'Other stations assessed (sonographically normal, not sampled)', type:'text'},
    {key:'tissueAdequateForMolecular', label:'Tissue adequate for NGS + PD-L1', type:'check'},
    {key:'complication', label:'Procedural complication', type:'select', options:['None','Bleeding','Pneumothorax','Other']},
  ],
  'Brain MRI + Stage Assignment': [
    {key:'intracranialMets', label:'Intracranial metastasis present', type:'check'},
    {key:'integratedTnm', label:'Integrated T / N / M', type:'text'},
    {key:'ajccStageGroup', label:'AJCC stage group', type:'text'},
  ],
  'Cardiac Assessment': [
    {key:'rcriScore', label:'Revised Cardiac Risk Index (RCRI)', type:'number'},
    {key:'riskClass', label:'Risk class', type:'select', options:['Class A (low)','Class B','Class C','Class D (high)']},
    {key:'ischemicHeartDisease', label:'Ischemic heart disease', type:'select', options:['None','Present']},
    {key:'ecgFindings', label:'ECG', type:'select', options:['Sinus rhythm, no ischemic changes','Ischemic changes present','Arrhythmia']},
    {key:'tteIndicated', label:'TTE indicated by criteria', type:'select', options:['Not indicated','Indicated']},
    {key:'clearanceStatus', label:'Clearance status', type:'select', options:['Cleared','Cleared with conditions','Not cleared','Further workup needed']},
  ],
  'Surgical Resectability Assessment': [
    {key:'resectabilityCall', label:'Resectability call', type:'select', options:RESECTABILITY_OPTIONS},
    {key:'basis', label:'Basis for call', type:'multicheck', options:RESECTABILITY_BASIS},
  ],
  'Presentation & History': [
    {key:'symptoms', label:'Presenting symptoms', type:'multicheck', options:['Cough','Hemoptysis','Weight loss','Dyspnea','Chest pain','Hoarseness','Dysphagia','Bone pain','Neurological symptoms']},
    {key:'redFlags', label:'Red-flag block', type:'multicheck', options:['SVC obstruction','Stridor','Cord compression']},
    {key:'smokingStatus', label:'Smoking status', type:'select', options:['Never','Current','Quit at diagnosis','Former']},
    {key:'smokingPackYears', label:'Smoking history (pack-years)', type:'number'},
    {key:'occupationalExposure', label:'Occupational exposure', type:'select', options:['None','Present']},
    {key:'asbestosExposure', label:'Asbestos exposure', type:'select', options:['None','Present']},
    {key:'priorMalignancy', label:'Prior malignancy', type:'select', options:['None','Yes']},
    {key:'comorbidities', label:'Comorbidities', type:'multicheck', options:['Hypertension (well controlled)','Cardiac disease','Autoimmune disease','Immunosuppression']},
    {key:'ecog', label:'ECOG performance status', type:'select', options:['0','1','2','3','4']},
    {key:'examFindings', label:'Exam findings', type:'text'},
  ],
};
function genFieldHtml(f, value){
  const id = 'nf_'+f.key;
  if(f.type==='select'){
    return '<div class="field"><label>'+esc(f.label)+'</label><select id="'+id+'">'+
      '<option value="">—</option>'+f.options.map(o=>'<option value="'+esc(o)+'" '+(value===o?'selected':'')+'>'+esc(o)+'</option>').join('')+
    '</select></div>';
  }
  if(f.type==='check'){
    return '<label class="checkline"><input type="checkbox" id="'+id+'" '+(value?'checked':'')+'> '+esc(f.label)+'</label>';
  }
  if(f.type==='multicheck'){
    return '<div><div style="font-size:11px;color:var(--ink-faint);margin-bottom:4px;">'+esc(f.label)+'</div><div style="display:flex;flex-direction:column;gap:4px;">'+
      f.options.map(o=>'<label class="checkline"><input type="checkbox" name="'+id+'" value="'+esc(o)+'" '+((value||[]).includes(o)?'checked':'')+'> '+esc(o)+'</label>').join('')+
    '</div></div>';
  }
  return '<div class="field"><label>'+esc(f.label)+'</label><input type="'+(f.type==='number'?'number':'text')+'" id="'+id+'" value="'+esc(value==null?'':value)+'"></div>';
}
function renderNodeImagesList(){
  const images = STATE.nodeCapture.images;
  if(!images.length) return '<div style="font-size:11.5px;color:var(--ink-faint);">No images added yet.</div>';
  return '<div style="display:flex;flex-direction:column;gap:6px;">'+images.map((im,i)=>
    '<div style="display:flex;align-items:center;gap:8px;font-size:12px;"><span style="flex:1;">'+(im.keyImage?'★ ':'')+esc(im.caption)+'</span><button class="btn btn-ghost btn-sm" data-node-remove-image="'+i+'">'+icon('x',12)+'</button></div>'
  ).join('')+'</div>';
}
function renderNodeCaptureForm(c, stage){
  const schema = NODE_FIELD_SCHEMAS[stage.stage] || [];
  const findings = stage.structuredFindings || {};
  STATE.nodeCapture = {caseId:c.id, stageName:stage.stage, images: stage.images ? JSON.parse(JSON.stringify(stage.images)) : []};
  return '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">'+esc(stage.stage)+' · Case #'+c.id+'</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;flex-direction:column;gap:12px;">'+
      (stage.owner ? '<div style="font-size:10.5px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em;font-weight:700;">Owner: '+esc(stage.owner)+'</div>' : '')+
      (schema.length ? '<div class="fields-grid">'+schema.map(f=>genFieldHtml(f, findings[f.key])).join('')+'</div>' : '<div style="font-size:12px;color:var(--ink-faint);">No structured fields for this stop — record the opinion and tier below.</div>')+
      lockField('nodeOpinion','Opinion (specialist’s own words, required)','What does this finding mean, in your judgement?')+
      '<div class="fields-grid">'+
        '<div class="field"><label>Tier mark</label><select id="nodeTier">'+
          '<option value="">—</option>'+
          '<option value="1" '+(stage.tierMark && stage.tierMark.tier===1?'selected':'')+'>Tier 1 — guideline-concordant, no discussion needed</option>'+
          '<option value="2" '+(stage.tierMark && stage.tierMark.tier===2?'selected':'')+'>Tier 2 — raises a cross-disciplinary decision</option>'+
        '</select></div>'+
      '</div>'+
      '<div id="nodeTierReasonWrap" '+(stage.tierMark && stage.tierMark.tier===2?'':'hidden')+'>'+lockField('nodeTierReason','Reason (required for Tier 2)','Why does this need the board?')+'</div>'+
      '<div style="font-weight:700;font-size:12px;">Images / Key visuals</div>'+
      '<div id="nodeImagesList">'+renderNodeImagesList()+'</div>'+
      '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;">'+
        '<div class="field" style="flex:1;min-width:180px;"><label>Caption</label><input type="text" id="nodeNewImageCaption" placeholder="e.g. Axial CT — SVC abutment circled"></div>'+
        '<label class="checkline"><input type="checkbox" id="nodeNewImageKey"> ★ Key image</label>'+
        '<label class="btn btn-secondary btn-sm" style="cursor:pointer;">'+icon('download',13)+' Attach (demo)<input type="file" id="nodeNewImageFile" style="display:none;"></label>'+
        '<button class="btn btn-ghost btn-sm" id="nodeAddImageBtn">'+icon('plus',13)+' Add</button>'+
      '</div>'+
      '<button class="btn btn-gold btn-block" id="nodeCaptureSubmit">'+icon('checkCircle',15)+' Save Node</button>'+
    '</div>';
}
function openNodeCaptureModal(caseId, stageName){
  const c = findCase(caseId); if(!c) return;
  const stage = c.timeline.find(t=>t.stage===stageName); if(!stage) return;
  openModal(renderNodeCaptureForm(c, stage), {wide:true});
  const opinionEl = document.getElementById('nodeOpinion'); if(opinionEl) opinionEl.value = stage.opinion || '';
  const reasonEl = document.getElementById('nodeTierReason'); if(reasonEl) reasonEl.value = (stage.tierMark && stage.tierMark.reason) || '';
  const tierSel = document.getElementById('nodeTier');
  if(tierSel){
    tierSel.addEventListener('change', ()=>{
      document.getElementById('nodeTierReasonWrap').hidden = tierSel.value!=='2';
    });
  }
}
function addNodeImageToModal(){
  const caption = document.getElementById('nodeNewImageCaption').value.trim();
  if(!caption){ toast('Add a caption before attaching the image.'); return; }
  const keyImage = document.getElementById('nodeNewImageKey').checked;
  const fileInput = document.getElementById('nodeNewImageFile');
  const fileName = (fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : null;
  STATE.nodeCapture.images.push({caption: caption+(fileName?' ('+fileName+')':''), keyImage});
  document.getElementById('nodeImagesList').innerHTML = renderNodeImagesList();
  document.getElementById('nodeNewImageCaption').value = '';
  document.getElementById('nodeNewImageKey').checked = false;
}
function removeNodeImageFromModal(idx){
  STATE.nodeCapture.images.splice(idx,1);
  document.getElementById('nodeImagesList').innerHTML = renderNodeImagesList();
}
function submitNodeCapture(){
  const c = findCase(STATE.nodeCapture.caseId); if(!c) return;
  const stage = c.timeline.find(t=>t.stage===STATE.nodeCapture.stageName); if(!stage) return;
  const opinion = (document.getElementById('nodeOpinion').value||'').trim();
  const tierVal = document.getElementById('nodeTier').value;
  const tierReason = (document.getElementById('nodeTierReason').value||'').trim();
  if(!opinion){ toast('Record an opinion before saving this node.'); return; }
  if(!tierVal){ toast('Mark this node Tier 1 or Tier 2 before saving.'); return; }
  if(tierVal==='2' && !tierReason){ toast('A Tier 2 mark needs a one-line reason.'); return; }
  const schema = NODE_FIELD_SCHEMAS[stage.stage] || [];
  const findings = {};
  schema.forEach(f=>{
    if(f.type==='check'){ findings[f.key] = !!(document.getElementById('nf_'+f.key)||{}).checked; }
    else if(f.type==='multicheck'){ findings[f.key] = [...document.querySelectorAll('input[name="nf_'+f.key+'"]:checked')].map(cb=>cb.value); }
    else { const el = document.getElementById('nf_'+f.key); findings[f.key] = el ? el.value.trim() : ''; }
  });
  stage.structuredFindings = findings;
  stage.opinion = opinion;
  stage.tierMark = {tier:Number(tierVal), reason: tierVal==='2' ? tierReason : (tierReason || 'Guideline-concordant from this specialty.')};
  stage.images = STATE.nodeCapture.images.slice();
  if(!stage.date) stage.date = new Date();
  closeModal();
  if(stage.tierMark.tier===2){
    const from = c.tier;
    if(!c.tierBadgeOverride) c.tier = Math.max(c.tier||1, 3);
    c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:stage.stage+' marked Tier 2 ('+tierReason+') — case escalated to the synchronous MDT.', kind:'system'});
    toast(stage.stage+' marked Tier 2 — case escalated'+(c.tier!==from?' to Tier '+c.tier:'')+'.');
  } else {
    toast(stage.stage+' saved — Tier 1, guideline-concordant.');
  }
  renderPage();
}
function openLockModal(caseId){
  const c = findCase(caseId);
  if(!c) return;
  const multi = c.specialists.length > 1;
  const nodePositive = /\bN[1-3]\b/.test(c.stage||'') || /Stage III/i.test(c.stage||'');
  const quorumGaps = tier3QuorumGaps(c);
  const html = ''+
    '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">Propose MDT Decision &middot; Case #'+c.id+'</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;flex-direction:column;gap:12px;">'+
      '<div class="callout callout-info">This record becomes part of the permanent, searchable case history — including any dissent.'+(multi?' Every invited specialist must countersign below before it locks.':'')+'</div>'+
      (quorumGaps.length ? '<div class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);">'+icon('alert',14)+' Tier 3 quorum not met — missing: '+esc(quorumGaps.join(', '))+'. Invite these specialties before this can lock.</div>' : '')+
      '<div class="fields-grid">'+
        lockSelect('lockMeetingType','Meeting type', MEETING_TYPES)+
        lockSelect('lockReason','Reason for discussion', DISCUSSION_REASONS)+
      '</div>'+

      (nodePositive ? (
        '<div style="font-weight:700;font-size:12px;margin-top:4px;">Resectability determination</div>'+
        '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;">'+
          '<div class="fields-grid">'+
            '<div class="field"><label>Resectability call</label><select id="lockResectability">'+RESECTABILITY_OPTIONS.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select></div>'+
            '<div class="field"><label>Decided by (thoracic surgeon)</label><input type="text" id="lockResectDecidedBy" value="'+esc(c.specialists.find(s=>s.role==='Thoracic Surgery')?c.specialists.find(s=>s.role==='Thoracic Surgery').name:'')+'" placeholder="Thoracic surgeon name"></div>'+
          '</div>'+
          '<div><div style="font-size:11px;color:var(--ink-faint);margin-bottom:4px;">Basis for call</div><div style="display:flex;flex-wrap:wrap;gap:10px;">'+
            RESECTABILITY_BASIS.map(o=>'<label class="checkline"><input type="checkbox" data-resect-basis value="'+esc(o)+'"> '+esc(o)+'</label>').join('')+
          '</div></div>'+
          '<label class="checkline"><input type="checkbox" id="lockIntentionToTreat"> Intention-to-treat approach confirmed</label>'+
          '<div id="unresectableWarning" hidden class="callout" style="background:var(--crit-soft);border:1px solid transparent;color:var(--crit-ink);font-size:11.5px;">'+icon('alert',13)+' Unresectable — neoadjuvant-to-convert-to-resectable pathways are disabled below; not endorsed outside a trial.</div>'+
        '</div>'
      ) : '')+

      '<div style="font-weight:700;font-size:12px;margin-top:4px;">Consensus decision / primary plan</div>'+
      (suggestConsolidationAgent(c.biomarkers) ? '<div class="callout callout-info" style="font-size:11.5px;">'+icon('sparkle',13)+' Molecular node on file: EGFR '+esc(c.biomarkers.egfr||'—')+' → if this plan involves consolidation after chemoradiation, the biomarker-matched agent is <strong>'+suggestConsolidationAgent(c.biomarkers)+'</strong>.</div>' : '')+
      '<div class="fields-grid">'+
        '<div class="field"><label>Consensus reached?</label><select id="lockConsensus" data-consensus-select>'+CONSENSUS_OPTIONS.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>Treatment intent</label><select id="lockIntent">'+TREATMENT_INTENT_OPTIONS.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select></div>'+
      '</div>'+
      '<div class="field"><label>Primary plan</label><select id="lockPlan">'+PRIMARY_PLAN_OPTIONS.map((o,i)=>'<option value="'+esc(o)+'" data-plan-opt="'+i+'">'+esc(o)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label>Pre-agreed restaging point (if neoadjuvant)</label><input type="text" id="lockRestagingPoint" placeholder="e.g. after cycle 3, before surgery"></div>'+
      lockField('lockReasoning','Reasoning / nuance (optional, one line)','Why this plan, in this patient?')+

      '<div id="deferredItemWrap" hidden>'+lockField('lockMissingItem','Missing item','What specific data is needed before this can lock? (e.g., "await mediastinoscopy")')+'</div>'+

      '<div style="font-weight:700;font-size:12px;margin-top:4px;">Alternatives considered &amp; rejected</div>'+
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:6px;">'+
        PRIMARY_PLAN_OPTIONS.map((o,i)=>
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'+
            '<label class="checkline" style="min-width:260px;"><input type="checkbox" data-alt-check="'+i+'" value="'+esc(o)+'"> '+esc(o)+'</label>'+
            '<select data-alt-reason="'+i+'" style="flex:1;min-width:180px;">'+REASON_NOT_CHOSEN_OPTIONS.map(r=>'<option value="'+esc(r)+'">'+esc(r)+'</option>').join('')+'</select>'+
          '</div>'
        ).join('')+
      '</div>'+
      lockField('lockRisks','Risks & uncertainty (optional)','Known risks or open uncertainties')+

      '<div style="font-weight:700;font-size:12px;margin-top:4px;">Dissent log</div>'+
      '<div class="fields-grid">'+
        '<div class="field"><label>Any dissent recorded?</label><select id="lockDissentYn" data-dissent-select>'+DISSENT_OPTIONS.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select></div>'+
      '</div>'+
      '<div id="dissentDetailWrap" hidden>'+lockField('lockDisagreement','Dissenting opinion (name + specialty + statement)','e.g. "Dr. N. Iyer, Radiation Oncology: no randomized OS advantage for surgery in N2; favors definitive chemoRT"')+'</div>'+

      '<div style="font-weight:700;font-size:12px;margin-top:4px;">Contingency plan (at least one branch)</div>'+
      '<div class="card card-pad" style="display:flex;flex-direction:column;gap:8px;">'+
        [0,1].map(i=>
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'+
            '<span style="font-size:11px;color:var(--ink-faint);">If</span>'+
            '<select data-cont-trigger="'+i+'" style="flex:1;min-width:150px;">'+CONTINGENCY_TRIGGERS.map(t=>'<option value="'+esc(t)+'">'+esc(t)+'</option>').join('')+'</select>'+
            '<span style="font-size:11px;color:var(--ink-faint);">then</span>'+
            '<select data-cont-action="'+i+'" style="flex:1;min-width:150px;">'+CONTINGENCY_ACTIONS.map(t=>'<option value="'+esc(t)+'">'+esc(t)+'</option>').join('')+'</select>'+
          '</div>'
        ).join('')+
        '<label class="checkline"><input type="checkbox" id="lockResourcePrebooked"> Resource pre-booked</label>'+
        '<input type="text" id="lockResourceDetail" placeholder="e.g. CT-simulation slot held for restaging week" style="padding:6px 9px;border:1px solid var(--border-strong);border-radius:7px;font-size:12px;">'+
      '</div>'+

      '<div class="fields-grid">'+
        lockSelect('lockTrialScreening','Clinical trial screening', TRIAL_SCREENING_OPTIONS)+
        '<div class="field"><label>Trial name / ID</label><input type="text" id="lockTrialId" placeholder="If eligible"></div>'+
      '</div>'+
      '<div class="fields-grid">'+
        '<div class="field"><label>Patient/family informed by</label><input type="text" id="lockNotifyLead" value="'+esc(ME.name)+'"></div>'+
        lockSelect('lockNotifyMethod','Method', NOTIFY_METHODS)+
      '</div>'+
      '<button class="btn btn-gold btn-block" id="lockDecisionSubmit" data-case="'+c.id+'" '+(quorumGaps.length?'disabled':'')+'>'+icon('lock',15)+' '+(quorumGaps.length?'Quorum not met':(multi?'Submit for Sign-off':'Lock & Sign'))+'</button>'+
    '</div>';
  openModal(html, {wide:true});
  const consensusSel = document.getElementById('lockConsensus');
  const deferWrap = document.getElementById('deferredItemWrap');
  const submitBtn = document.getElementById('lockDecisionSubmit');
  const syncDeferredUI = ()=>{
    if(quorumGaps.length) return;
    const deferred = consensusSel.value === 'Deferred — needs more data';
    deferWrap.hidden = !deferred;
    submitBtn.innerHTML = icon(deferred?'clock':'lock',15)+' '+(deferred?'Save as Deferred':(multi?'Submit for Sign-off':'Lock & Sign'));
  };
  if(consensusSel){ consensusSel.addEventListener('change', syncDeferredUI); syncDeferredUI(); }
  const dissentSel = document.getElementById('lockDissentYn');
  const dissentWrap = document.getElementById('dissentDetailWrap');
  if(dissentSel){ dissentSel.addEventListener('change', ()=>{ dissentWrap.hidden = dissentSel.value!=='Yes'; }); }
  const resectSel = document.getElementById('lockResectability');
  if(resectSel){
    resectSel.addEventListener('change', ()=>{
      const unresectable = resectSel.value==='Unresectable';
      document.getElementById('unresectableWarning').hidden = !unresectable;
      const planSel = document.getElementById('lockPlan');
      [...planSel.options].forEach(opt=>{
        const isConvertPathway = /^Neoadjuvant/.test(opt.value);
        opt.disabled = unresectable && isConvertPathway;
        if(opt.disabled && opt.selected) planSel.value = PRIMARY_PLAN_OPTIONS.find(o=>!/^Neoadjuvant/.test(o));
      });
      document.querySelectorAll('[data-alt-check]').forEach(cb=>{
        const isConvertPathway = /^Neoadjuvant/.test(cb.value);
        cb.disabled = unresectable && isConvertPathway;
        if(cb.disabled) cb.checked = false;
      });
    });
  }
}
function submitDeferDecision(c, val){
  const item = val('lockMissingItem') || 'Additional data required';
  c.deferredItem = { item, notedBy: ME.name+' · '+ME.role, notedAt: new Date() };
  c.thread.push({author:'System', role:'Auto-Triage', time:new Date(), text:'MDT decision deferred — needs more data: '+item+'. Case remains open pending this item.', kind:'system'});
  closeModal();
  STATE.workspaceTab[c.id] = 'discussion';
  toast('Decision deferred for Case #'+c.id+' — follow-up item logged, case stays open.');
  renderPage();
}
function submitLockDecision(){
  const btn = document.getElementById('lockDecisionSubmit');
  if(!btn || btn.disabled) return;
  const caseId = btn.getAttribute('data-case');
  const c = findCase(caseId);
  if(!c) return;
  const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const checked = id => { const el = document.getElementById(id); return !!(el && el.checked); };
  if(val('lockConsensus') === 'Deferred — needs more data'){ submitDeferDecision(c, val); return; }

  /* Alternatives (Block F): every checked option pairs with its own "reason not
     chosen" dropdown, so this is built from structured picks, never free-typed. */
  const altParts = [];
  document.querySelectorAll('[data-alt-check]').forEach(cb=>{
    if(!cb.checked) return;
    const i = cb.getAttribute('data-alt-check');
    const reasonSel = document.querySelector('[data-alt-reason="'+i+'"]');
    const reason = reasonSel ? reasonSel.value : '';
    altParts.push(cb.value+(reason && reason!==REASON_NOT_CHOSEN_OPTIONS[0] ? ' — '+reason : ''));
  });
  const alternatives = altParts.length ? altParts.join('; ') : 'None recorded at this decision.';

  /* Contingency (Block H): up to two structured trigger→action branches, plus
     whether a resource for that branch is already pre-booked. */
  const contParts = [];
  [0,1].forEach(i=>{
    const trig = document.querySelector('[data-cont-trigger="'+i+'"]');
    const act = document.querySelector('[data-cont-action="'+i+'"]');
    if(trig && act && trig.value!==CONTINGENCY_TRIGGERS[0] && act.value!==CONTINGENCY_ACTIONS[0]){
      contParts.push('If '+trig.value+' → '+act.value+'.');
    }
  });
  if(checked('lockResourcePrebooked') && val('lockResourceDetail')) contParts.push('('+val('lockResourceDetail')+')');
  const contingency = contParts.length ? contParts.join(' ') : '—';

  /* Dissent (Block G): Yes/No first, attributed structured statement only if Yes. */
  const dissentYes = val('lockDissentYn')==='Yes';
  const disagreement = dissentYes ? (val('lockDisagreement') || 'Yes — dissent recorded, detail pending.') : 'None.';

  /* Resectability (Block D) — only rendered for node-positive/stage III cases. */
  const resectSel = document.getElementById('lockResectability');
  const resectability = resectSel ? resectSel.value : null;
  const resectBasis = [...document.querySelectorAll('[data-resect-basis]:checked')].map(cb=>cb.value);

  c.pendingDecision = {
    plan: val('lockPlan') || PRIMARY_PLAN_OPTIONS[0],
    reasoning: val('lockReasoning') || '—',
    alternatives, risks: val('lockRisks') || '—', disagreement, contingency,
    intent: val('lockIntent') || TREATMENT_INTENT_OPTIONS[0],
    restagingPoint: val('lockRestagingPoint') || null,
    resectability, resectDecidedBy: val('lockResectDecidedBy') || null, resectBasis,
    intentionToTreat: checked('lockIntentionToTreat'),
    meetingType: val('lockMeetingType') || MEETING_TYPES[0],
    reasonForDiscussion: val('lockReason') || DISCUSSION_REASONS[0],
    consensusStatus: val('lockConsensus') || CONSENSUS_OPTIONS[0],
    trialScreening: val('lockTrialScreening') || TRIAL_SCREENING_OPTIONS[0],
    trialId: val('lockTrialId') || '—',
    notifyLead: val('lockNotifyLead') || ME.name,
    notifyMethod: val('lockNotifyMethod') || NOTIFY_METHODS[0],
    proposedBy: ME.name+' · '+ME.role,
    proposedAt: new Date(),
    signatures: [],
  };
  c.deferredItem = null;
  closeModal();
  STATE.workspaceTab[c.id] = 'discussion';
  const me = c.specialists.find(s=>s.name===ME.name);
  if(me){ signDecision(c.id, me.name); }
  else { toast('Decision proposed for Case #'+c.id+' — awaiting specialist sign-off.'); renderPage(); }
}
function finalizeDecision(c){
  const pd = c.pendingDecision;
  c.decision = { plan:pd.plan, reasoning:pd.reasoning, alternatives:pd.alternatives, risks:pd.risks, disagreement:pd.disagreement, contingency:pd.contingency,
    intent:pd.intent, restagingPoint:pd.restagingPoint, resectability:pd.resectability, resectDecidedBy:pd.resectDecidedBy, resectBasis:pd.resectBasis, intentionToTreat:pd.intentionToTreat,
    meetingType:pd.meetingType, reasonForDiscussion:pd.reasonForDiscussion, consensusStatus:pd.consensusStatus,
    trialScreening:pd.trialScreening, trialId:pd.trialId, notifyLead:pd.notifyLead, notifyMethod:pd.notifyMethod };
  c.status = 'Decision Locked';
  c.lockedAt = new Date();
  c.pendingDecision = null;
  markStageComplete(c, 'MDT Decision Lock', 'Tier '+c.tier+' MDT, quorum met ('+c.specialists.length+'/'+c.specialists.length+'). Decision: '+pd.plan);
  /* Forward-compat only, nothing reads this yet: numbered, persistent history so a case
     that re-escalates later (a future regrowth/salvage-style case) isn't a breaking
     data-shape change when that pattern is built. */
  if(!c.mdtLog) c.mdtLog = [];
  c.mdtLog.push({number: c.mdtLog.length+1, lockedAt: c.lockedAt, tier: c.tier, decision: c.decision});
  toast('All specialists signed — decision finalized and locked for Case #'+c.id+'.');
}
function signDecision(caseId, name){
  const c = findCase(caseId);
  if(!c || !c.pendingDecision) return;
  if(!c.pendingDecision.signatures.includes(name)){
    c.pendingDecision.signatures.push(name);
    const sp = c.specialists.find(s=>s.name===name);
    c.thread.push({author:name, role:sp?sp.role:'', time:new Date(), text:'Countersigned the proposed decision.', kind:'system'});
  }
  if(c.specialists.every(s=>c.pendingDecision.signatures.includes(s.name))){
    finalizeDecision(c);
  } else {
    toast(name+' signed. '+(c.specialists.length-c.pendingDecision.signatures.length)+' signature(s) remaining on Case #'+c.id+'.');
  }
  renderPage();
}
function renderSignOffPanel(c){
  const pd = c.pendingDecision;
  return '<div class="card" style="border-color:var(--gold);background:var(--gold-soft);">'+
    '<div class="card-pad" style="display:flex;flex-direction:column;gap:10px;">'+
      '<div style="display:flex;align-items:center;gap:8px;color:var(--gold-strong);font-weight:700;font-size:13px;">'+icon('clock',15)+' Decision Proposed — Awaiting Multi-Party Sign-off</div>'+
      decisionRow('checkCircle','Proposed decision', pd.plan, 'var(--good)')+
      decisionRow('sparkle','Reasoning', pd.reasoning, 'var(--info)')+
      '<div style="font-size:11px;color:var(--ink-faint);">Proposed by '+esc(pd.proposedBy)+' &middot; '+fmtDateTime(pd.proposedAt)+'. Every invited specialist must countersign before this becomes the locked MDT decision.</div>'+
      '<div style="display:flex;flex-direction:column;gap:6px;">'+c.specialists.map(s=>{
        const signed = pd.signatures.includes(s.name);
        return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">'+
          '<span style="min-width:190px;">'+esc(s.name)+' &middot; '+esc(s.role)+'</span>'+
          (signed ? '<span class="badge badge-tier1">'+icon('check',11)+' Signed</span>' : '<button class="btn btn-secondary btn-sm" data-sign-decision="'+c.id+'" data-sign-name="'+esc(s.name)+'">Sign as '+esc(s.name)+'</button>')+
        '</div>';
      }).join('')+'</div>'+
    '</div>'+
  '</div>';
}

function openMobilePreview(){
  const c = CASES.find(x=>x.tier===2 && x.status==='Awaiting Responses') || CASES.find(x=>x.status==='Awaiting Responses') || CASES[0];
  const remaining = Math.max(0, 72 - hoursSince(c.createdAt));
  const pctRem = Math.max(0, Math.min(1, remaining/72));
  const r=48, circ=2*Math.PI*r;
  const dash = circ*pctRem;
  const navIcons = ['cases','activity','plus','bell','users'];
  const html = ''+
    '<div class="modal-head"><h3 style="font-family:var(--font-body);font-size:15px;">Mobile App Preview</h3><button class="icon-btn" data-modal-close>'+icon('x',16)+'</button></div>'+
    '<div class="modal-body" style="display:flex;justify-content:center;background:var(--surface-2);">'+
      '<div class="phone-frame"><div class="phone-screen">'+
        '<div style="padding:14px 16px 0;display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:var(--ink-faint);"><span>9:14</span>'+icon('bell',13)+'</div>'+
        '<div style="padding:10px 16px 0;font-weight:700;font-family:var(--font-display);font-size:15px;color:var(--ink);">MILESTONE</div>'+
        '<div style="margin:12px 16px 0;padding:12px;background:var(--surface);border-radius:12px;box-shadow:var(--shadow-sm);display:flex;gap:10px;align-items:flex-start;">'+
          '<div style="width:28px;height:28px;border-radius:8px;background:var(--accent-soft);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+icon('bell',14)+'</div>'+
          '<div style="font-size:11.5px;line-height:1.5;">You have been invited to MDT<br><strong>Case #'+c.id+'</strong></div>'+
        '</div>'+
        '<div style="margin:12px 16px 0;padding:16px;background:var(--surface);border-radius:12px;box-shadow:var(--shadow-sm);text-align:center;">'+
          '<div style="font-size:10.5px;color:var(--ink-faint);margin-bottom:8px;">Respond from anywhere</div>'+
          '<svg width="108" height="108" viewBox="0 0 108 108" style="margin:0 auto;display:block;">'+
            '<circle cx="54" cy="54" r="'+r+'" fill="none" stroke="var(--border)" stroke-width="8"/>'+
            '<circle cx="54" cy="54" r="'+r+'" fill="none" stroke="var(--accent)" stroke-width="8" stroke-dasharray="'+dash+' '+circ+'" stroke-linecap="round" transform="rotate(-90 54 54)"/>'+
            '<text x="54" y="50" text-anchor="middle" font-size="18" font-weight="700" font-family="Fraunces, serif" fill="var(--ink)">'+Math.round(remaining)+'h</text>'+
            '<text x="54" y="65" text-anchor="middle" font-size="8" fill="var(--ink-faint)">time remaining</text>'+
          '</svg>'+
        '</div>'+
        '<div style="margin:14px 16px 0;display:flex;flex-direction:column;align-items:center;gap:6px;">'+
          '<button style="width:52px;height:52px;border-radius:50%;background:var(--accent);color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;" data-toast="Audio capture is a UI demo only — not wired to a backend.">'+icon('mic',20)+'</button>'+
          '<span style="font-size:10px;color:var(--ink-faint);">Tap to record your opinion</span>'+
        '</div>'+
        '<div style="margin-top:auto;display:flex;justify-content:space-around;padding:12px 8px;border-top:1px solid var(--border);">'+
          navIcons.map((ic,i)=>'<span style="color:'+(i===0?'var(--accent-strong)':'var(--ink-faint)')+';">'+icon(ic,17)+'</span>').join('')+
        '</div>'+
      '</div></div>'+
    '</div>';
  openModal(html);
}

/* ============================================================
   GLOBAL SEARCH & NOTIFICATIONS
   ============================================================ */
function handleGlobalSearch(q){
  const box = document.getElementById('searchResults');
  if(!q){ box.hidden = true; box.innerHTML=''; return; }
  const ql = q.toLowerCase();
  const matches = CASES.filter(c => (c.id+' '+c.diagnosis+' '+c.tumourType+' '+c.patient.initials+' '+c.stage).toLowerCase().includes(ql)).slice(0,8);
  box.hidden = false;
  box.innerHTML = matches.length ? matches.map(c=>
    '<div class="sr-item" data-search-result="'+c.id+'"><b>#'+c.id+' &middot; '+esc(c.diagnosis)+'</b><span>'+esc(c.stage)+' &middot; '+esc(c.pathway)+'</span></div>'
  ).join('') : '<div class="search-empty">No matches for &ldquo;'+esc(q)+'&rdquo;</div>';
}
function renderNotifDot(){
  const unread = NOTIFICATIONS.some(n=>!n.read);
  const dot = document.getElementById('notifDot');
  if(dot) dot.hidden = !unread;
}
function toggleNotifPanel(){
  const panel = document.getElementById('notifPanel');
  if(panel.hidden){
    panel.innerHTML = NOTIFICATIONS.length ? NOTIFICATIONS.slice().sort((a,b)=>b.time-a.time).map(n=>
      '<div class="sr-item" data-notif="'+n.id+'" style="'+(n.read?'opacity:.55;':'')+'"><b>'+esc(n.text)+'</b><span>'+fmtDateTime(n.time)+'</span></div>'
    ).join('') : '<div class="search-empty">No notifications.</div>';
    panel.hidden = false;
  } else {
    panel.hidden = true;
  }
}

/* ---------------- theme ---------------- */
function isDarkActive(){
  const attr = document.documentElement.getAttribute('data-theme');
  if(attr) return attr==='dark';
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function updateThemeIcon(){
  const btn = document.getElementById('themeToggle');
  if(btn) btn.innerHTML = icon(isDarkActive() ? 'sun' : 'moon', 17);
}
function toggleTheme(){
  const next = isDarkActive() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try{ localStorage.setItem('milestone-theme', next); }catch(e){}
  updateThemeIcon();
}

/* ---------------- collapsible sidebar (desktop) ---------------- */
function isSidebarCollapsed(){
  return document.getElementById('app').classList.contains('sidebar-collapsed');
}
function updateSidebarCollapseBtn(){
  const btn = document.getElementById('sidebarCollapseBtn');
  if(btn){
    btn.innerHTML = icon('chevronLeft', 13);
    btn.title = isSidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar';
  }
}
function toggleSidebarCollapse(){
  const collapsed = document.getElementById('app').classList.toggle('sidebar-collapsed');
  try{ localStorage.setItem('milestone-sidebar-collapsed', collapsed ? '1' : '0'); }catch(e){}
  updateSidebarCollapseBtn();
}

/* ---------------- focus preservation for live-typing inputs ---------------- */
function preserveFocus(fn){
  const active = document.activeElement;
  const id = active && active.id;
  const selStart = (active && typeof active.selectionStart === 'number') ? active.selectionStart : null;
  const selEnd = (active && typeof active.selectionEnd === 'number') ? active.selectionEnd : null;
  fn();
  if(id){
    const el = document.getElementById(id);
    if(el){
      el.focus();
      if(selStart!=null && el.setSelectionRange){
        try{ el.setSelectionRange(selStart, selEnd); }catch(e){}
      }
    }
  }
}

/* ============================================================
   GLOBAL EVENT DELEGATION
   ============================================================ */
let GLOBAL_WIRED = false;
function wirePageEvents(){
  if(GLOBAL_WIRED) return;
  GLOBAL_WIRED = true;
  document.addEventListener('click', onGlobalClick);
  document.addEventListener('input', onGlobalInput);
  document.addEventListener('change', onGlobalChange);
  document.addEventListener('keydown', onGlobalKeydown);
}

function onGlobalKeydown(e){
  if(e.target && e.target.id==='globalSearch' && e.key==='Enter'){
    const first = document.querySelector('#searchResults [data-search-result]');
    if(first) first.click();
  }
}

function onGlobalInput(e){
  const t = e.target;
  if(t.id==='globalSearch'){ handleGlobalSearch(t.value); return; }
  if(t.id==='casesSearch'){ STATE.casesFilter.search = t.value; preserveFocus(renderPage); return; }
  if(t.id==='librarySearch'){ STATE.libraryFilter.search = t.value; preserveFocus(renderPage); return; }
  if(t.hasAttribute && t.hasAttribute('data-field') && t.tagName!=='SELECT' && t.type!=='checkbox'){
    setAssessmentField(t.getAttribute('data-field'), t.value);
    preserveFocus(renderPage);
  }
  if(t.hasAttribute && t.hasAttribute('data-fitness-field') && t.tagName!=='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ fitnessDraftFor(c)[t.getAttribute('data-fitness-field')] = t.value; preserveFocus(renderPage); }
  }
  if(t.hasAttribute && t.hasAttribute('data-restaging-field') && t.tagName!=='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ restagingDraftFor(c)[t.getAttribute('data-restaging-field')] = t.value; preserveFocus(renderPage); }
  }
  if(t.hasAttribute && t.hasAttribute('data-staging-field') && t.tagName!=='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ stagingDraftFor(c)[t.getAttribute('data-staging-field')] = t.value; preserveFocus(renderPage); }
  }
  if(t.hasAttribute && t.hasAttribute('data-staging-node-field')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const [code,field] = t.getAttribute('data-staging-node-field').split(':');
      if(field==='sizeMm'){ stagingDraftFor(c).nodes[code][field] = t.value; preserveFocus(renderPage); }
    }
  }
  if(t.hasAttribute && t.hasAttribute('data-biopsy-field') && t.tagName!=='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ biopsyDraftFor(c)[t.getAttribute('data-biopsy-field')] = t.value; preserveFocus(renderPage); }
  }
  if(t.hasAttribute && t.hasAttribute('data-biopsy-node-field')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const [code,field] = t.getAttribute('data-biopsy-node-field').split(':');
      if(field==='sizeMm'||field==='passes'){ biopsyDraftFor(c).nodes[code][field] = t.value; preserveFocus(renderPage); }
    }
  }
  if(t.hasAttribute && t.hasAttribute('data-pathology-field') && t.tagName!=='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ pathologyDraftFor(c)[t.getAttribute('data-pathology-field')] = t.value; preserveFocus(renderPage); }
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-field') && t.tagName!=='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ molecularDraftFor(c)[t.getAttribute('data-molecular-field')] = t.value; preserveFocus(renderPage); }
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-gene-field')){
    const c = findCase(t.getAttribute('data-case'));
    if(c && t.tagName!=='SELECT'){
      const [gene,field] = t.getAttribute('data-molecular-gene-field').split(':');
      molecularDraftFor(c).genes[gene][field] = t.value; preserveFocus(renderPage);
    }
  }
}

function onGlobalChange(e){
  const t = e.target;
  if(t.hasAttribute && handleFormChange(t)) return;
  if(t.hasAttribute && (t.hasAttribute('data-chemo-tox') || t.hasAttribute('data-chemo-grade') || t.hasAttribute('data-chemo-note'))){
    const attr = t.hasAttribute('data-chemo-tox') ? 'data-chemo-tox' : t.hasAttribute('data-chemo-grade') ? 'data-chemo-grade' : 'data-chemo-note';
    const [cid, i, key] = t.getAttribute(attr).split('::');
    const c = findCase(cid); if(!c || !c.chemo) return;
    const cy = c.chemo.cycles[Number(i)];
    const found = cy.toxicities.find(x=>x.key===key);
    if(attr==='data-chemo-tox'){
      cy.toxicities = cy.toxicities.filter(x=>x.key!==key);
      if(t.checked) cy.toxicities.push({key, grade:1});
    } else if(attr==='data-chemo-grade'){
      const g = Number(t.value);
      if(g===0) cy.toxicities = cy.toxicities.filter(x=>x.key!==key); else if(found) found.grade = g;
    } else if(found){ found.note = t.value; return; }
    refreshChemo(cid);
    return;
  }
  if(t.name && t.name.indexOf('regimenChoice_')===0){
    const uid = t.name.replace('regimenChoice_','');
    const wrap = document.getElementById('obsReasonWrap_'+uid);
    if(wrap) wrap.hidden = (t.value !== 'observation');
    return;
  }
  if(t.id && t.id.indexOf('ctdnaToggle_')===0){
    const caseId = t.id.replace('ctdnaToggle_','');
    const c = findCase(caseId);
    if(c && c.surveillance){ c.surveillance.ctdnaEnabled = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-fitness-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ fitnessDraftFor(c)[t.getAttribute('data-fitness-field')] = t.value; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-restaging-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ restagingDraftFor(c)[t.getAttribute('data-restaging-field')] = t.value; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-staging-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ stagingDraftFor(c)[t.getAttribute('data-staging-field')] = t.value; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-staging-check')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ stagingDraftFor(c)[t.getAttribute('data-staging-check')] = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-staging-listcheck')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const d = stagingDraftFor(c);
      const key = t.getAttribute('data-staging-listcheck');
      const val = t.value;
      d[key] = t.checked ? d[key].concat([val]) : d[key].filter(x=>x!==val);
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-staging-node')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ stagingDraftFor(c).nodes[t.getAttribute('data-staging-node')].positive = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-staging-node-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const [code,field] = t.getAttribute('data-staging-node-field').split(':');
      stagingDraftFor(c).nodes[code][field] = t.value;
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-biopsy-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ biopsyDraftFor(c)[t.getAttribute('data-biopsy-field')] = t.value; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-biopsy-check')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ biopsyDraftFor(c)[t.getAttribute('data-biopsy-check')] = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-biopsy-listcheck')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const d = biopsyDraftFor(c);
      const key = t.getAttribute('data-biopsy-listcheck');
      const val = t.value;
      d[key] = t.checked ? d[key].concat([val]) : d[key].filter(x=>x!==val);
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-biopsy-node')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ biopsyDraftFor(c).nodes[t.getAttribute('data-biopsy-node')].examined = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-biopsy-node-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const [code,field] = t.getAttribute('data-biopsy-node-field').split(':');
      biopsyDraftFor(c).nodes[code][field] = t.value;
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ molecularDraftFor(c)[t.getAttribute('data-molecular-field')] = t.value; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-check')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ molecularDraftFor(c)[t.getAttribute('data-molecular-check')] = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-listcheck')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const d = molecularDraftFor(c);
      const key = t.getAttribute('data-molecular-listcheck');
      const val = t.value;
      d[key] = t.checked ? d[key].concat([val]) : d[key].filter(x=>x!==val);
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-gene-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const [gene,field] = t.getAttribute('data-molecular-gene-field').split(':');
      molecularDraftFor(c).genes[gene][field] = t.value;
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-gene-check')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const [gene,field] = t.getAttribute('data-molecular-gene-check').split(':');
      molecularDraftFor(c).genes[gene][field] = t.checked;
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-molecular-ihc-field')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ molecularDraftFor(c).ihc[t.getAttribute('data-molecular-ihc-field')] = t.value; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-safety-gate')){
    if(!STATE.adjuvantSafetyGate) STATE.adjuvantSafetyGate = {};
    const caseId = t.getAttribute('data-safety-gate');
    const idx = Number(t.getAttribute('data-gate-idx'));
    const arr = STATE.adjuvantSafetyGate[caseId] || (STATE.adjuvantSafetyGate[caseId] = []);
    STATE.adjuvantSafetyGate[caseId] = t.checked ? arr.concat([idx]) : arr.filter(x=>x!==idx);
    renderPage();
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-cycle-status')){
    const uid = t.getAttribute('data-cycle-status');
    if(!STATE.cycleStatusDraft) STATE.cycleStatusDraft = {};
    STATE.cycleStatusDraft[uid] = t.value;
    renderPage();
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-redflag')){
    const key = t.getAttribute('data-redflag');
    STATE.redFlags = t.checked ? STATE.redFlags.concat([key]) : STATE.redFlags.filter(x=>x!==key);
    renderPage();
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-comorbidity')){
    const key = t.getAttribute('data-comorbidity');
    STATE.comorbidities = t.checked ? STATE.comorbidities.concat([key]) : STATE.comorbidities.filter(x=>x!==key);
    renderPage();
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-pathology-field') && t.tagName==='SELECT'){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ pathologyDraftFor(c)[t.getAttribute('data-pathology-field')] = t.value; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-pathology-check')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ pathologyDraftFor(c)[t.getAttribute('data-pathology-check')] = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-pathology-listcheck')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const d = pathologyDraftFor(c);
      const key = t.getAttribute('data-pathology-listcheck');
      const val = t.value;
      d[key] = t.checked ? d[key].concat([val]) : d[key].filter(x=>x!==val);
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-restaging-check')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){ restagingDraftFor(c)[t.getAttribute('data-restaging-check')] = t.checked; renderPage(); }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-fitness-check')){
    const c = findCase(t.getAttribute('data-case'));
    if(c){
      const d = fitnessDraftFor(c);
      const key = t.getAttribute('data-fitness-check');
      const val = t.value;
      let arr = d[key].slice();
      if(val==='None'){
        arr = t.checked ? ['None'] : [];
      } else {
        arr = arr.filter(x=>x!=='None');
        if(t.checked) arr.push(val); else arr = arr.filter(x=>x!==val);
      }
      d[key] = arr;
      renderPage();
    }
    return;
  }
  if(t.hasAttribute && t.hasAttribute('data-survivorship')){
    const c = findCase(t.getAttribute('data-survivorship'));
    if(c && c.surveillance){ c.surveillance.survivorship[t.getAttribute('data-key')] = t.checked; }
    return;
  }
  const casesMap = {filterTier:'tier', filterPathway:'pathway', filterStatus:'status'};
  if(casesMap[t.id]){ STATE.casesFilter[casesMap[t.id]] = t.value; renderPage(); return; }
  const libMap = {libFilterDept:'dept', libFilterTier:'tier', libFilterOutcome:'outcome'};
  if(libMap[t.id]){ STATE.libraryFilter[libMap[t.id]] = t.value; renderPage(); return; }
  if(t.id==='libFilterDissent'){ STATE.libraryFilter.dissentOnly = t.checked; renderPage(); return; }
  if(t.id==='teachingModeToggle'){ STATE.libraryFilter.teaching = t.checked; renderPage(); return; }
  if(t.hasAttribute && t.hasAttribute('data-field') && (t.tagName==='SELECT' || t.type==='checkbox')){
    setAssessmentField(t.getAttribute('data-field'), t.type==='checkbox' ? t.checked : t.value);
    renderPage();
  }
  if(t.hasAttribute && t.hasAttribute('data-intake-file')){
    const key = t.getAttribute('data-intake-file');
    if(t.files && t.files.length){
      STATE.stepZero.files[key] = true;
      STATE.stepZero.fileNames[key] = t.files[0].name;
      renderPage();
    }
  }
  if(t.hasAttribute && t.hasAttribute('data-tox-toggle')){
    const uid = t.getAttribute('data-tox-toggle');
    const sel = document.getElementById('txgrade_'+uid);
    if(sel) sel.disabled = !t.checked;
  }
}

function onGlobalClick(e){
  const t = e.target;

  const searchResult = t.closest('[data-search-result]');
  if(searchResult){
    navigate('workspace', {id: searchResult.getAttribute('data-search-result')});
    const gs = document.getElementById('globalSearch'); if(gs) gs.value='';
    const sr = document.getElementById('searchResults'); if(sr) sr.hidden = true;
    return;
  }

  const goBtn = t.closest('[data-go]');
  if(goBtn){ navigate(goBtn.getAttribute('data-go')); return; }

  const openCase = t.closest('[data-open-case]');
  if(openCase){ navigate('workspace', {id: openCase.getAttribute('data-open-case')}); return; }

  const tabBtn = t.closest('[data-tab]');
  if(tabBtn){
    const caseId = STATE.params.id;
    STATE.workspaceTab[caseId] = tabBtn.getAttribute('data-tab');
    renderPage();
    return;
  }

  const tlStage = t.closest('[data-tl-stage]');
  if(tlStage){
    STATE.timelineActive[tlStage.getAttribute('data-tl-stage')] = parseInt(tlStage.getAttribute('data-idx'),10);
    renderPage();
    return;
  }

  const openFormTabBtn = t.closest('[data-open-form-tab]');
  if(openFormTabBtn){
    const [caseId, tabId] = openFormTabBtn.getAttribute('data-open-form-tab').split('::');
    STATE.workspaceTab[caseId] = tabId;
    renderPage();
    return;
  }

  const txCycle = t.closest('[data-tx-cycle]');
  if(txCycle){
    STATE.treatmentCycleActive[txCycle.getAttribute('data-tx-cycle')] = parseInt(txCycle.getAttribute('data-idx'),10);
    renderPage();
    return;
  }

  const logCycleBtn = t.closest('[data-log-cycle]');
  if(logCycleBtn){
    submitCycleLog(logCycleBtn.getAttribute('data-log-cycle'), Number(logCycleBtn.getAttribute('data-cycle-idx')), logCycleBtn.getAttribute('data-uid'));
    return;
  }

  const lockPhaseABtn = t.closest('[data-lock-phasea]');
  if(lockPhaseABtn){ submitPhaseALock(lockPhaseABtn.getAttribute('data-lock-phasea')); return; }

  const completePhaseBBtn = t.closest('[data-complete-phaseb]');
  if(completePhaseBBtn){ submitPhaseB(completePhaseBBtn.getAttribute('data-complete-phaseb')); return; }

  const attachEvidenceBtn = t.closest('[data-attach-evidence]');
  if(attachEvidenceBtn){ openAttachEvidenceModal(attachEvidenceBtn.getAttribute('data-attach-evidence')); return; }

  const evSubmitBtn = t.closest('#evSubmitBtn');
  if(evSubmitBtn && !evSubmitBtn.disabled){ submitAttachEvidence(evSubmitBtn.getAttribute('data-case')); return; }

  const attachExtBtn = t.closest('[data-attach-ext]');
  if(attachExtBtn){
    const [caseId, stageName] = attachExtBtn.getAttribute('data-attach-ext').split('::');
    openAttachExternalDocModal(caseId, stageName);
    return;
  }

  const extSubmitBtn = t.closest('#extSubmitBtn');
  if(extSubmitBtn){ submitAttachExternalDoc(extSubmitBtn.getAttribute('data-case'), extSubmitBtn.getAttribute('data-stage')); return; }

  const openNodeCaptureBtn = t.closest('[data-open-node-capture]');
  if(openNodeCaptureBtn){
    const [caseId, stageName] = openNodeCaptureBtn.getAttribute('data-open-node-capture').split('::');
    openNodeCaptureModal(caseId, stageName);
    return;
  }
  const nodeAddImageBtn = t.closest('#nodeAddImageBtn');
  if(nodeAddImageBtn){ addNodeImageToModal(); return; }
  const nodeRemoveImageBtn = t.closest('[data-node-remove-image]');
  if(nodeRemoveImageBtn){ removeNodeImageFromModal(Number(nodeRemoveImageBtn.getAttribute('data-node-remove-image'))); return; }
  const nodeCaptureSubmitBtn = t.closest('#nodeCaptureSubmit');
  if(nodeCaptureSubmitBtn){ submitNodeCapture(); return; }

  const openImageReviewBtn = t.closest('[data-open-image-review]');
  if(openImageReviewBtn){
    openImageReviewModal(openImageReviewBtn.getAttribute('data-open-image-review'), Number(openImageReviewBtn.getAttribute('data-start-idx')||0));
    return;
  }
  const openNodeImageReviewBtn = t.closest('[data-open-node-image-review]');
  if(openNodeImageReviewBtn){
    const [caseId, stageIdx] = openNodeImageReviewBtn.getAttribute('data-open-node-image-review').split('::');
    openNodeImageReviewModal(caseId, stageIdx, Number(openNodeImageReviewBtn.getAttribute('data-start-idx')||0));
    return;
  }
  const imageReviewNavBtn = t.closest('[data-image-review-nav]');
  if(imageReviewNavBtn){
    const [caseId, mode, stageIdxStr, idxStr] = imageReviewNavBtn.getAttribute('data-image-review-nav').split('::');
    if(mode==='node') openNodeImageReviewModal(caseId, stageIdxStr, Number(idxStr));
    else openImageReviewModal(caseId, Number(idxStr));
    return;
  }
  const imageReviewJumpBtn = t.closest('[data-image-review-jump]');
  if(imageReviewJumpBtn){
    const [caseId, idxStr] = imageReviewJumpBtn.getAttribute('data-image-review-jump').split('::');
    closeModal();
    STATE.workspaceTab[caseId] = 'timeline';
    STATE.timelineActive[caseId] = parseInt(idxStr,10);
    renderPage();
    return;
  }
  const stepperScrollBtn = t.closest('[data-stepper-scroll]');
  if(stepperScrollBtn){
    const [caseId, dir] = stepperScrollBtn.getAttribute('data-stepper-scroll').split('::');
    const el = document.getElementById('stepper-'+caseId);
    if(el) el.scrollBy({left: dir==='prev' ? -220 : 220, behavior:'auto'});
    return;
  }
  const toggleBannerBtn = t.closest('[data-toggle-banner]');
  if(toggleBannerBtn){
    const caseId = toggleBannerBtn.getAttribute('data-toggle-banner');
    if(!STATE.bannerCollapsed) STATE.bannerCollapsed = {};
    STATE.bannerCollapsed[caseId] = !STATE.bannerCollapsed[caseId];
    renderPage();
    return;
  }

  const toggleCaseStoryBtn = t.closest('[data-toggle-case-story]');
  if(toggleCaseStoryBtn){
    const caseId = toggleCaseStoryBtn.getAttribute('data-toggle-case-story');
    if(!STATE.caseStoryExpanded) STATE.caseStoryExpanded = {};
    STATE.caseStoryExpanded[caseId] = !STATE.caseStoryExpanded[caseId];
    renderPage();
    return;
  }

  const confirmEvidenceBtn = t.closest('[data-confirm-evidence]');
  if(confirmEvidenceBtn){ confirmEvidence(confirmEvidenceBtn.getAttribute('data-confirm-evidence'), Number(confirmEvidenceBtn.getAttribute('data-idx'))); return; }

  const lockRegimenBtn = t.closest('[data-lock-regimen]');
  if(lockRegimenBtn){ submitLockRegimen(lockRegimenBtn.getAttribute('data-lock-regimen')); return; }

  const adjCycleNav = t.closest('[data-adj-cycle]');
  if(adjCycleNav){ STATE.adjuvantCycleActive[adjCycleNav.getAttribute('data-adj-cycle')] = parseInt(adjCycleNav.getAttribute('data-idx'),10); renderPage(); return; }

  const logAdjCycleBtn = t.closest('[data-log-adj-cycle]');
  if(logAdjCycleBtn){ submitAdjCycleLog(logAdjCycleBtn.getAttribute('data-log-adj-cycle'), Number(logAdjCycleBtn.getAttribute('data-cycle-idx')), logAdjCycleBtn.getAttribute('data-uid')); return; }

  const oralReviewNav = t.closest('[data-oral-review]');
  if(oralReviewNav){ STATE.oralReviewActive[oralReviewNav.getAttribute('data-oral-review')] = parseInt(oralReviewNav.getAttribute('data-idx'),10); renderPage(); return; }

  const completeReviewBtn = t.closest('[data-complete-review]');
  if(completeReviewBtn){ submitCompleteReview(completeReviewBtn.getAttribute('data-complete-review'), Number(completeReviewBtn.getAttribute('data-review-idx')), completeReviewBtn.getAttribute('data-uid')); return; }

  const saveCompletionBtn = t.closest('[data-save-completion]');
  if(saveCompletionBtn){ submitCompletionStatus(saveCompletionBtn.getAttribute('data-save-completion')); return; }

  const visitNav = t.closest('[data-visit-nav]');
  if(visitNav){ STATE.surveillanceVisitActive[visitNav.getAttribute('data-visit-nav')] = parseInt(visitNav.getAttribute('data-idx'),10); renderPage(); return; }

  const completeVisitBtn = t.closest('[data-complete-visit]');
  if(completeVisitBtn){ submitCompleteVisit(completeVisitBtn.getAttribute('data-complete-visit'), Number(completeVisitBtn.getAttribute('data-visit-idx')), completeVisitBtn.getAttribute('data-uid')); return; }

  const reactivateBtn = t.closest('[data-reactivate-mdt]');
  if(reactivateBtn){ submitReactivateMDT(reactivateBtn.getAttribute('data-reactivate-mdt')); return; }

  const logCtdnaBtn = t.closest('[data-log-ctdna]');
  if(logCtdnaBtn){ submitLogCtdna(logCtdnaBtn.getAttribute('data-log-ctdna')); return; }

  const genSummaryBtn = t.closest('[data-gen-summary]');
  if(genSummaryBtn){
    const cid = genSummaryBtn.getAttribute('data-gen-summary');
    openAgentPipeline('Compiling Discharge Summary', [
      {label:'Compilation Agent', detail:'Reading every completed stop’s structured data…'},
      {label:'Narrative Agent', detail:'Assembling one continuous, readable account…'},
      {label:'Handoff for Verification', detail:'This draft is not final until a clinician signs it…'},
    ], ()=>applyGenerateSummary(cid), 'Review Draft Summary');
    return;
  }

  const regenBtn = t.closest('[data-regen-summary]');
  if(regenBtn){ regenerateSummary(regenBtn.getAttribute('data-regen-summary')); return; }

  const verifyBtn = t.closest('[data-verify-summary]');
  if(verifyBtn){ verifySummary(verifyBtn.getAttribute('data-verify-summary')); return; }

  const triageBtn = t.closest('[data-triage]');
  if(triageBtn){ runAutoTriage(triageBtn.getAttribute('data-triage')); return; }

  const confirmTriage = t.closest('[data-confirm-triage]');
  if(confirmTriage){ confirmTriageCreate(confirmTriage.getAttribute('data-confirm-triage')); return; }

  const inviteBtn = t.closest('[data-invite]');
  if(inviteBtn){
    const box = document.getElementById('inviteBox-'+inviteBtn.getAttribute('data-invite'));
    if(box) box.hidden = !box.hidden;
    return;
  }

  const addSpec = t.closest('[data-add-specialist]');
  if(addSpec){ addSpecialist(addSpec.getAttribute('data-add-specialist'), addSpec.getAttribute('data-role')); return; }

  const submitPathologyBtn = t.closest('[data-submit-pathology]');
  if(submitPathologyBtn){ submitPathologyAssessment(submitPathologyBtn.getAttribute('data-submit-pathology')); return; }

  const editPathologyBtn = t.closest('[data-edit-pathology]');
  if(editPathologyBtn){
    const c = findCase(editPathologyBtn.getAttribute('data-edit-pathology'));
    if(c){ c.pathologyAssessment = null; renderPage(); }
    return;
  }

  const submitBiopsyBtn = t.closest('[data-submit-biopsy]');
  if(submitBiopsyBtn){ submitBiopsyAssessment(submitBiopsyBtn.getAttribute('data-submit-biopsy')); return; }

  const submitMolecularBtn = t.closest('[data-submit-molecular]');
  if(submitMolecularBtn){ submitMolecularAssessment(submitMolecularBtn.getAttribute('data-submit-molecular')); return; }

  const editMolecularBtn = t.closest('[data-edit-molecular]');
  if(editMolecularBtn){
    const c = findCase(editMolecularBtn.getAttribute('data-edit-molecular'));
    if(c){ c.molecularAssessment = null; renderPage(); }
    return;
  }

  const editBiopsyBtn = t.closest('[data-edit-biopsy]');
  if(editBiopsyBtn){
    const c = findCase(editBiopsyBtn.getAttribute('data-edit-biopsy'));
    if(c){ c.biopsyAssessment = null; renderPage(); }
    return;
  }

  const confirmSafetyGateBtn = t.closest('[data-confirm-safety-gate]');
  if(confirmSafetyGateBtn){ submitAdjuvantSafetyGate(confirmSafetyGateBtn.getAttribute('data-confirm-safety-gate')); return; }

  const tabScrollBtn = t.closest('[data-tab-scroll]');
  if(tabScrollBtn){
    const el = tabScrollBtn.closest('.tabs-row').querySelector('.tabs');
    if(el){ el.scrollBy({left: tabScrollBtn.getAttribute('data-tab-scroll')==='left' ? -180 : 180}); updateTabScrollArrows(el); }
    return;
  }

  const emrFetchHistoryBtn = t.closest('[data-emr-fetch-history]');
  if(emrFetchHistoryBtn){
    const caseId = emrFetchHistoryBtn.getAttribute('data-emr-fetch-history');
    const ec = findCase(caseId);
    openAgentPipeline('Fetching from Hospital EMR / LIS / RIS', [
      {label:'Connecting to Hospital Systems', detail:'Authenticating with EMR, LIS and RIS for MRN '+(ec?ec.patient.mrn:caseId)+'…'},
      {label:'Extraction Agent', detail:'Reading demographics, history and presenting findings from the patient chart…'},
      {label:'Handoff for Verification', detail:'Routing extracted fields to the clinician for mandatory review…'},
    ], ()=>applyClinicalHistoryEmrFetch(caseId), 'Review auto-filled fields');
    return;
  }

  if(handleFormClick(t)) return;
  const lbBtn = t.closest('[data-lightbox]');
  if(lbBtn){ openImageLightbox(lbBtn.getAttribute('data-lightbox'), lbBtn.getAttribute('data-lb-cap') || ''); return; }
  const onbStepBtn = t.closest('[data-onb-step]');
  if(onbStepBtn){ if(onbStepBtn.disabled) return; STATE.onbStep = Number(onbStepBtn.getAttribute('data-onb-step')); renderPage(); window.scrollTo(0,0); return; }
  const onbOpenBtn = t.closest('[data-onb-open]');
  if(onbOpenBtn){ onbOpen(onbOpenBtn.getAttribute('data-onb-open')); return; }
  const imagingViewBtn = t.closest('[data-imaging-view]');
  if(imagingViewBtn){
    const [cid, v] = imagingViewBtn.getAttribute('data-imaging-view').split('::');
    if(!STATE.imagingView) STATE.imagingView = {};
    STATE.imagingView[cid] = v; renderPage(); return;
  }
  const chemoCycleEl = t.closest('[data-chemo-cycle]');
  if(chemoCycleEl){
    const [cid, i] = chemoCycleEl.getAttribute('data-chemo-cycle').split('::');
    if(!STATE.chemoActive) STATE.chemoActive = {};
    STATE.chemoActive[cid] = Number(i);
    refreshChemo(cid);
    return;
  }
  const chemoPresetBtn = t.closest('[data-chemo-photo-preset]');
  if(chemoPresetBtn){
    const sel = document.getElementById('chemoPhotoTox'), cap = document.getElementById('chemoPhotoCap');
    if(sel) sel.value = chemoPresetBtn.getAttribute('data-chemo-photo-preset');
    if(cap){ cap.scrollIntoView({block:'center', behavior:'auto'}); cap.focus(); }
    return;
  }
  const chemoPhotoBtn = t.closest('[data-chemo-add-photo]');
  if(chemoPhotoBtn){
    const [cid, i] = chemoPhotoBtn.getAttribute('data-chemo-add-photo').split('::');
    const c = findCase(cid); if(!c || !c.chemo) return;
    const cy = c.chemo.cycles[Number(i)];
    const cap = (document.getElementById('chemoPhotoCap').value||'').trim();
    if(!cap){ toast('Add a caption before attaching the photo.'); return; }
    const tox = document.getElementById('chemoPhotoTox').value;
    cy.photos.push({tox, grade:Number(document.getElementById('chemoPhotoGrade').value), caption:cap, keyImage:document.getElementById('chemoPhotoKey').checked,
      modality: tox==='hfs' ? 'Clinical photo (hand-foot syndrome)' : 'Clinical photo', ts:new Date()});
    refreshChemo(cid);
    toast('Photo added to cycle '+cy.n+'.');
    return;
  }

  const snapshotJumpEl = t.closest('[data-snapshot-jump]');
  if(snapshotJumpEl){
    const [caseId, idxStr] = snapshotJumpEl.getAttribute('data-snapshot-jump').split('::');
    STATE.workspaceTab[caseId] = 'timeline';
    STATE.timelineActive[caseId] = parseInt(idxStr,10);
    renderPage();
    return;
  }

  const submitStagingBtn = t.closest('[data-submit-staging]');
  if(submitStagingBtn){ submitStagingAssessment(submitStagingBtn.getAttribute('data-submit-staging')); return; }

  const editStagingBtn = t.closest('[data-edit-staging]');
  if(editStagingBtn){
    const c = findCase(editStagingBtn.getAttribute('data-edit-staging'));
    if(c){ c.stagingAssessment = null; renderPage(); }
    return;
  }

  const submitFitnessBtn = t.closest('[data-submit-fitness]');
  if(submitFitnessBtn){ submitFitnessAssessment(submitFitnessBtn.getAttribute('data-submit-fitness')); return; }

  const editFitnessBtn = t.closest('[data-edit-fitness]');
  if(editFitnessBtn){
    const c = findCase(editFitnessBtn.getAttribute('data-edit-fitness'));
    if(c){ c.fitnessAssessment = null; renderPage(); }
    return;
  }

  const submitRestagingBtn = t.closest('[data-submit-restaging]');
  if(submitRestagingBtn){ submitRestagingAssessment(submitRestagingBtn.getAttribute('data-submit-restaging')); return; }

  const editRestagingBtn = t.closest('[data-edit-restaging]');
  if(editRestagingBtn){
    const c = findCase(editRestagingBtn.getAttribute('data-edit-restaging'));
    if(c){ c.restaging = null; renderPage(); }
    return;
  }

  const applyTeamBtn = t.closest('[data-apply-team]');
  if(applyTeamBtn){ applyTeamTemplate(applyTeamBtn.getAttribute('data-apply-team')); return; }

  const tierVoteBtn = t.closest('[data-tier-vote]');
  if(tierVoteBtn){ castTierVote(tierVoteBtn.getAttribute('data-tier-vote'), tierVoteBtn.getAttribute('data-vote-name'), Number(tierVoteBtn.getAttribute('data-vote-tier'))); return; }

  const signDecisionBtn = t.closest('[data-sign-decision]');
  if(signDecisionBtn){ signDecision(signDecisionBtn.getAttribute('data-sign-decision'), signDecisionBtn.getAttribute('data-sign-name')); return; }

  const markRespondedBtn = t.closest('[data-mark-responded]');
  if(markRespondedBtn){ markResponded(markRespondedBtn.getAttribute('data-mark-responded'), markRespondedBtn.getAttribute('data-responder-name')); return; }

  const postBtn = t.closest('[data-post]');
  if(postBtn){ postReply(postBtn.getAttribute('data-post')); return; }

  const lockBtn = t.closest('[data-lock]');
  if(lockBtn){ openLockModal(lockBtn.getAttribute('data-lock')); return; }

  const lockSubmit = t.closest('#lockDecisionSubmit');
  if(lockSubmit){ submitLockDecision(); return; }

  const fhirBtn = t.closest('[data-fhir]');
  if(fhirBtn){ toast('A FHIR/mCODE-formatted case bundle would be exported here (demo).'); closeAllMoreActions(); return; }

  const copyLinkBtn = t.closest('[data-copy-link]');
  if(copyLinkBtn){
    const cid = copyLinkBtn.getAttribute('data-copy-link');
    const url = location.origin + location.pathname + '#/workspace/' + cid;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(()=>toast('Case link copied.')).catch(()=>toast('Could not copy — copy manually: '+url));
    } else {
      toast('Case link: '+url);
    }
    closeAllMoreActions();
    return;
  }

  const moreActionsBtn = t.closest('[data-more-actions]');
  if(moreActionsBtn){
    const cid = moreActionsBtn.getAttribute('data-more-actions');
    const panel = document.getElementById('moreActions-'+cid);
    const wasHidden = panel.hidden;
    closeAllMoreActions();
    if(panel) panel.hidden = !wasHidden;
    return;
  }

  const primaryAction = t.closest('[data-primary-action]');
  if(primaryAction){
    const cid = primaryAction.getAttribute('data-primary-action');
    const kind = primaryAction.getAttribute('data-action-kind');
    if(kind==='lock'){ openLockModal(cid); }
    else { STATE.workspaceTab[cid] = 'discussion'; renderPage(); }
    return;
  }

  const toastBtn = t.closest('[data-toast]');
  if(toastBtn){ toast(toastBtn.getAttribute('data-toast')); closeAllMoreActions(); return; }

  const viewReasoning = t.closest('[data-view-reasoning]');
  if(viewReasoning){ openReasoningModal(viewReasoning.getAttribute('data-view-reasoning')); return; }

  const pathwayCard = t.closest('[data-pathway-card]');
  if(pathwayCard){
    STATE.casesFilter = {search:'', tier:'all', pathway:pathwayCard.getAttribute('data-pathway-card'), status:'all'};
    navigate('cases');
    return;
  }

  const stepZeroToggle = t.closest('[data-stepzero-toggle]');
  if(stepZeroToggle){
    STATE.stepZero.panelOpen = !STATE.stepZero.panelOpen;
    renderPage();
    return;
  }

  const accHead = t.closest('[data-accordion-toggle]');
  if(accHead){
    const tkey = STATE.assessmentTemplate;
    const skey = accHead.closest('.accordion-item').getAttribute('data-section-key');
    const map = STATE.assessmentAccordion[tkey] || (STATE.assessmentAccordion[tkey] = {});
    map[skey] = !map[skey];
    renderPage();
    return;
  }

  const templateBtn = t.closest('[data-template]');
  if(templateBtn){ STATE.assessmentTemplate = templateBtn.getAttribute('data-template'); renderPage(); return; }

  const saveAssessment = t.closest('#saveAssessmentBtn');
  if(saveAssessment){ saveAssessmentAsCase(); return; }

  const extractBtn = t.closest('#extractBtn');
  if(extractBtn && !extractBtn.disabled){
    openAgentPipeline('Extracting from Outside Records', [
      {label:'Extraction Agent', detail:'Reading uploaded reports for demographics, history and presenting findings…'},
      {label:'Summarization Agent', detail:'Building a structured case brief for Stop 1 — Presentation & History…'},
      {label:'Handoff for Verification', detail:'Routing extracted fields to the clinician for mandatory review…'},
    ], applyStepZeroExtraction, 'Review in New Assessment');
    return;
  }

  const emrFetchBtn = t.closest('#emrFetchBtn');
  if(emrFetchBtn){
    const crEl = document.getElementById('emrCrNumber');
    const cr = crEl ? crEl.value.trim() : '';
    if(!cr){ toast('Enter a CR number or patient ID to fetch.'); return; }
    openAgentPipeline('Fetching from Hospital EMR', [
      {label:'EMR Connector Agent', detail:'Looking up patient record '+cr+' in the hospital EMR…'},
      {label:'Extraction Agent', detail:'Reading demographics, history and presenting findings from the EMR chart…'},
      {label:'Handoff for Verification', detail:'Routing fetched fields to the clinician for mandatory review…'},
    ], ()=>applyStepZeroExtraction('emr'), 'Review in New Assessment');
    return;
  }

  const menuToggle = t.closest('#menuToggle');
  if(menuToggle){ document.getElementById('sidebar').classList.toggle('open'); return; }

  const sidebarCollapseBtn = t.closest('#sidebarCollapseBtn');
  if(sidebarCollapseBtn){ toggleSidebarCollapse(); return; }

  const themeToggle = t.closest('#themeToggle');
  if(themeToggle){ toggleTheme(); return; }

  const mobilePreviewBtn = t.closest('#mobilePreviewBtn');
  if(mobilePreviewBtn){ openMobilePreview(); return; }

  const notifBtn = t.closest('#notifBtn');
  if(notifBtn){ toggleNotifPanel(); return; }

  const notifItem = t.closest('[data-notif]');
  if(notifItem){
    const n = NOTIFICATIONS.find(x=>x.id===notifItem.getAttribute('data-notif'));
    if(n){
      n.read = true;
      renderNotifDot();
      document.getElementById('notifPanel').hidden = true;
      navigate('workspace', {id:n.caseId});
    }
    return;
  }

  const modalClose = t.closest('[data-modal-close]');
  if(modalClose){ closeModal(); return; }

  // click-away closes floating panels (only when the click hit neither the panel nor its trigger)
  if(!t.closest('#searchResults') && !t.closest('#globalSearch')){
    const sr = document.getElementById('searchResults'); if(sr) sr.hidden = true;
  }
  if(!t.closest('#notifPanel') && !t.closest('#notifBtn')){
    const np = document.getElementById('notifPanel'); if(np) np.hidden = true;
  }
  if(!t.closest('#sidebar') && !t.closest('#menuToggle')){
    const sb = document.getElementById('sidebar'); if(sb) sb.classList.remove('open');
  }
  if(!t.closest('[id^="moreActions-"]') && !t.closest('[data-more-actions]')){
    closeAllMoreActions();
  }
}
function closeAllMoreActions(){
  document.querySelectorAll('[id^="moreActions-"]').forEach(el => el.hidden = true);
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  try{
    const saved = localStorage.getItem('milestone-theme');
    if(saved) document.documentElement.setAttribute('data-theme', saved);
  }catch(e){}
  try{
    if(localStorage.getItem('milestone-sidebar-collapsed')==='1') document.getElementById('app').classList.add('sidebar-collapsed');
  }catch(e){}
  updateSidebarCollapseBtn();

  const searchIconSlot = document.querySelector('.search-wrap .icon');
  if(searchIconSlot) searchIconSlot.innerHTML = icon('search',16);
  const mpBtn = document.getElementById('mobilePreviewBtn');
  if(mpBtn) mpBtn.insertAdjacentHTML('afterbegin', icon('phone',18));
  const nBtn = document.getElementById('notifBtn');
  if(nBtn) nBtn.insertAdjacentHTML('afterbegin', icon('bell',18));
  const mBtn = document.getElementById('menuToggle');
  if(mBtn) mBtn.innerHTML = icon('menu',20);

  updateThemeIcon();
  renderNotifDot();
  wirePageEvents();

  const {page, id} = parseHash();
  STATE.page = page;
  STATE.params = id ? {id} : {};
  renderPage();
}

document.addEventListener('DOMContentLoaded', init);
