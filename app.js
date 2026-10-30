import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

// ====== 1. CONFIG: paste your Supabase values (Project Settings > API) ======
const SUPABASE_URL = 'https://aqfbraypafrpqavmahrd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmJyYXlwYWZycHFhdm1haHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMTc2MTgsImV4cCI6MjEwODg5MzYxOH0.Lc5w8K3HruEteu16YZznHNFXf42N5Ju2qsUaJ3LtSLU';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== 2. REFERENCE DATA (illustrative: replace with cited values) ======
// Dye bands by pH. Outer BTB is read on days 0-4, inner anthocyanin from day 4.
const BTB   = [{max:6.0,hex:'#e0c24a'},{max:6.8,hex:'#a9c24a'},{max:7.2,hex:'#3f9a63'},{max:7.6,hex:'#2f8a95'},{max:99,hex:'#3f63b5'}];
const ANTHO = [{max:6.5,hex:'#b83a6a'},{max:7.5,hex:'#85457a'},{max:8.5,hex:'#3f63b5'},{max:99,hex:'#2f9a88'}];
// pH by day [day, pH]. S. aureus and P. aeruginosa loosely follow broth data (PMC4331275); E. coli and healthy are estimates.
const ORG = {
  healthy:     [[0,7.0],[1,6.3],[2.5,6.0],[4,6.3],[6,6.8],[8,7.0],[10,7.0]],
  saureus:     [[0,7.0],[1,6.0],[2,6.5],[3,7.0],[10,7.2]],
  ecoli:       [[0,7.0],[1,6.3],[2,5.6],[3,5.4],[4,6.1],[5,6.9],[6,7.5],[7,8.0],[8,8.3],[10,8.4]],
  paeruginosa: [[0,7.0],[1,8.0],[2,8.5],[10,8.5]]
};
const ORGNAME = {saureus:'S. aureus', ecoli:'E. coli', paeruginosa:'P. aeruginosa'};

// ====== 3. TRANSLATIONS (add a language: copy a block, add it to LANGS) ======
const LANGS = {en:'English', hi:'हिन्दी', mr:'मराठी'};
const L = {
en:{title:'Rakshasutra',lang:'Language',login:'Log in',signup:'Create account',logout:'Log out',email:'Email',password:'Password',name:'Full name',age:'Age',skin:'Skin tone',skin0:'Light',skin1:'Medium',skin2:'Dark',allergies:'Allergies (if any)',diabetic:'I have diabetes',
 start:'I got my suture today',startHelp:'Press this on the day of your surgery. Your 10-day check starts now.',day:'Day',of:'of 10',done:'Check-ins done (out of 20)',checkin:'Check-in',outer:'Outer layer',inner:'Inner layer',
 which:'Which colour is closest to your suture?',symptoms:'Do you have any of these?',fever:'Fever',redness:'Spreading redness',pus:'Pus or discharge',pain:'Worsening pain',save:'Save check-in',
 morning:'Morning',evening:'Evening',extra:'Extra',history:'Your check-ins',
 ok:'No concerning pattern detected. Keep checking in twice a day. This is not a medical clearance.',warn:'Consider a check-up. A doctor should take a look.',alert:'Please see a doctor today.',
 r_late:'Your suture colour is in a late-stage pattern.',r_fever:'You reported fever.',r_redness:'You reported spreading redness.',r_pus:'You reported pus or discharge.',r_pain:'You reported worsening pain.',r_dia:'You have diabetes, so we check more carefully.',
 ended:'Your 10-day window has ended.',patients:'Patients',likely:'Most consistent pattern (illustrative)',noPatients:'No patients yet.',back:'Back',error:'Something went wrong. Check your details and try again.',healthy:'Normal healing',
 lvl0:'No concern',lvl1:'Check-up',lvl2:'Urgent',btb0:'Yellow',btb1:'Yellow-green',btb2:'Green',btb3:'Green-blue',btb4:'Blue',an0:'Red-pink',an1:'Purple',an2:'Blue',an3:'Blue-green',
 disc:'Prototype. Reference data is illustrative. Not a medical device.',
 hello:'Hello',settings:'My preferences',textSize:'Text size',s0:'Normal',s1:'Large',s2:'Extra large',rem:'Reminder time',contact:'Emergency contact name',phone:'Phone number',savePrefs:'Save preferences',coach:'Care companion',explain:'Explain my result',askPh:'Ask about your recovery',send:'Ask',thinking:'Thinking...',due:'Your check-in is due now',aiErr:'The care companion is unavailable right now.',call:'Call'},
hi:{title:'रक्षासूत्र',lang:'भाषा',login:'लॉग इन',signup:'खाता बनाएं',logout:'लॉग आउट',email:'ईमेल',password:'पासवर्ड',name:'पूरा नाम',age:'उम्र',skin:'त्वचा का रंग',skin0:'गोरा',skin1:'गेहुँआ',skin2:'सांवला',allergies:'एलर्जी (यदि कोई हो)',diabetic:'मुझे मधुमेह है',
 start:'आज मुझे टांके लगे',startHelp:'सर्जरी वाले दिन यह दबाएं। आपकी 10 दिन की निगरानी अभी शुरू होगी।',day:'दिन',of:'/ 10',done:'पूरी हुई जाँचें (20 में से)',checkin:'जाँच',outer:'बाहरी परत',inner:'भीतरी परत',
 which:'आपके टांके का रंग किससे सबसे ज़्यादा मिलता है?',symptoms:'क्या आपको इनमें से कुछ है?',fever:'बुखार',redness:'फैलती हुई लालिमा',pus:'मवाद या रिसाव',pain:'बढ़ता दर्द',save:'जाँच सहेजें',
 morning:'सुबह',evening:'शाम',extra:'अतिरिक्त',history:'आपकी जाँचें',
 ok:'कोई चिंताजनक पैटर्न नहीं मिला। दिन में दो बार जाँच करते रहें। यह चिकित्सकीय मंज़ूरी नहीं है।',warn:'जाँच करवाने पर विचार करें। डॉक्टर को दिखाना चाहिए।',alert:'कृपया आज ही डॉक्टर को दिखाएं।',
 r_late:'आपके टांके का रंग देर-चरण वाले पैटर्न में है।',r_fever:'आपने बुखार बताया।',r_redness:'आपने फैलती लालिमा बताई।',r_pus:'आपने मवाद या रिसाव बताया।',r_pain:'आपने बढ़ता दर्द बताया।',r_dia:'आपको मधुमेह है, इसलिए हम अधिक सावधानी से जाँचते हैं।',
 ended:'आपकी 10 दिन की अवधि पूरी हो गई।',patients:'मरीज़',likely:'सबसे संगत पैटर्न (उदाहरण)',noPatients:'अभी कोई मरीज़ नहीं।',back:'वापस',error:'कुछ गलत हो गया। विवरण जाँचकर फिर कोशिश करें।',healthy:'सामान्य उपचार',
 lvl0:'कोई चिंता नहीं',lvl1:'जाँच',lvl2:'तत्काल',btb0:'पीला',btb1:'पीला-हरा',btb2:'हरा',btb3:'हरा-नीला',btb4:'नीला',an0:'लाल-गुलाबी',an1:'बैंगनी',an2:'नीला',an3:'नीला-हरा',
 disc:'प्रोटोटाइप। संदर्भ डेटा केवल उदाहरण है। यह चिकित्सा उपकरण नहीं है।',
 hello:'नमस्ते',settings:'मेरी पसंद',textSize:'अक्षर का आकार',s0:'सामान्य',s1:'बड़ा',s2:'बहुत बड़ा',rem:'याद दिलाने का समय',contact:'आपातकालीन संपर्क का नाम',phone:'फ़ोन नंबर',savePrefs:'पसंद सहेजें',coach:'देखभाल सहायक',explain:'मेरा परिणाम समझाएं',askPh:'अपनी रिकवरी के बारे में पूछें',send:'पूछें',thinking:'सोच रहा है...',due:'आपकी जाँच का समय हो गया है',aiErr:'देखभाल सहायक अभी उपलब्ध नहीं है।',call:'कॉल करें'},
mr:{title:'रक्षासूत्र',lang:'भाषा',login:'लॉग इन',signup:'खाते उघडा',logout:'लॉग आउट',email:'ईमेल',password:'पासवर्ड',name:'पूर्ण नाव',age:'वय',skin:'त्वचेचा रंग',skin0:'गोरा',skin1:'मध्यम',skin2:'सावळा',allergies:'ॲलर्जी (असल्यास)',diabetic:'मला मधुमेह आहे',
 start:'आज मला टाके घातले',startHelp:'शस्त्रक्रियेच्या दिवशी हे दाबा. तुमची 10 दिवसांची तपासणी आता सुरू होईल.',day:'दिवस',of:'/ 10',done:'पूर्ण झालेल्या तपासण्या (20 पैकी)',checkin:'तपासणी',outer:'बाहेरील थर',inner:'आतील थर',
 which:'तुमच्या टाक्यांचा रंग कोणत्या रंगाशी सर्वात जास्त जुळतो?',symptoms:'तुम्हाला यापैकी काही आहे का?',fever:'ताप',redness:'पसरणारा लालसरपणा',pus:'पू किंवा स्राव',pain:'वाढणारी वेदना',save:'तपासणी जतन करा',
 morning:'सकाळ',evening:'संध्याकाळ',extra:'अतिरिक्त',history:'तुमच्या तपासण्या',
 ok:'काळजी वाटावा असा कोणताही नमुना आढळला नाही. दिवसातून दोनदा तपासणी करत रहा. ही वैद्यकीय मंजुरी नाही.',warn:'तपासणी करून घेण्याचा विचार करा. डॉक्टरांनी पाहणे गरजेचे आहे.',alert:'कृपया आजच डॉक्टरांना दाखवा.',
 r_late:'तुमच्या टाक्यांचा रंग उशिरा टप्प्यातील नमुन्यात आहे.',r_fever:'तुम्ही ताप नोंदवला.',r_redness:'तुम्ही पसरणारा लालसरपणा नोंदवला.',r_pus:'तुम्ही पू किंवा स्राव नोंदवला.',r_pain:'तुम्ही वाढणारी वेदना नोंदवली.',r_dia:'तुम्हाला मधुमेह आहे, म्हणून आम्ही अधिक काळजीपूर्वक तपासतो.',
 ended:'तुमचा 10 दिवसांचा कालावधी संपला.',patients:'रुग्ण',likely:'सर्वात जुळणारा नमुना (उदाहरणादाखल)',noPatients:'अजून कोणतेही रुग्ण नाहीत.',back:'मागे',error:'काहीतरी चूक झाली. माहिती तपासून पुन्हा प्रयत्न करा.',healthy:'सामान्य उपचार',
 lvl0:'चिंता नाही',lvl1:'तपासणी',lvl2:'तातडीचे',btb0:'पिवळा',btb1:'पिवळा-हिरवा',btb2:'हिरवा',btb3:'हिरवा-निळा',btb4:'निळा',an0:'लाल-गुलाबी',an1:'जांभळा',an2:'निळा',an3:'निळा-हिरवा',
 disc:'प्रोटोटाइप. संदर्भ माहिती केवळ उदाहरणादाखल आहे. हे वैद्यकीय उपकरण नाही.',
 hello:'नमस्कार',settings:'माझ्या आवडीनिवडी',textSize:'अक्षरांचा आकार',s0:'सामान्य',s1:'मोठा',s2:'खूप मोठा',rem:'आठवणीची वेळ',contact:'आणीबाणी संपर्काचे नाव',phone:'फोन नंबर',savePrefs:'आवडीनिवडी जतन करा',coach:'काळजी सहाय्यक',explain:'माझा निकाल समजावून सांगा',askPh:'तुमच्या बरे होण्याबद्दल विचारा',send:'विचारा',thinking:'विचार करत आहे...',due:'तुमची तपासणी करण्याची वेळ झाली आहे',aiErr:'काळजी सहाय्यक सध्या उपलब्ध नाही.',call:'कॉल करा'}
};

// ====== 4. STATE AND HELPERS ======
const S = {lang: localStorage.getItem('lang') || 'en', session:null, profile:null, rows:[], patients:[], all:[], sel:null, mode:'login'};
const t = k => L[S.lang]?.[k] ?? L.en[k] ?? k;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = id => document.getElementById(id);
const hoursSince = ts => (Date.now() - new Date(ts)) / 36e5;
const layerNow = () => hoursSince(S.profile.started_at) >= 96 ? 'inner' : 'outer';
const interp = (p, d) => { if (d <= p[0][0]) return p[0][1]; for (let i = 1; i < p.length; i++){ const [a,b] = p[i-1], [c,e] = p[i]; if (d <= c) return b + (e-b)*(d-a)/(c-a); } return p.at(-1)[1]; };
const band = (arr, ph) => { const i = arr.findIndex(x => ph < x.max); return i < 0 ? arr.length-1 : i; };
const colourName = r => t((r.layer === 'outer' ? 'btb' : 'an') + r.colour_idx);
const prefs = () => S.profile?.preferences || {};
async function savePrefs(patch){                       // merges into profiles.preferences for this user
  const p = {...prefs(), ...patch};
  const {error} = await sb.from('profiles').update({preferences:p}).eq('id', S.profile.id);
  if (!error) S.profile.preferences = p;
  return !error;
}

// ====== 5. ASSESSMENT (rule-based: compares logged colours with expected colours per pattern) ======
function assess(profile, rows){
  if (!rows.length) return {level:0, ranking:[], reasons:[]};
  const ranking = Object.keys(ORG).map(k => {
    let n = 0, d = 0;
    for (const r of rows){
      const day = r.hours/24, ph = interp(ORG[k], day);
      const expected = r.layer === 'outer' ? band(BTB, ph) : band(ANTHO, ph);
      const w = 1 + day/10;                                    // later readings count more
      n += w * (1 - Math.min(Math.abs(r.colour_idx - expected), 2)/2);
      d += w;
    }
    return {k, score: n/d};
  }).sort((a,b) => b.score - a.score);
  const last = rows.at(-1), reasons = [];
  for (const s of ['fever','redness','pus','pain']) if (last[s]) reasons.push('r_' + s);
  const late = rows.some(r => r.layer === 'inner' && r.hours >= 96 && r.colour_idx >= 2);   // blue or blue-green inner
  const mid  = rows.some(r => r.layer === 'outer' && r.hours >= 48 && r.colour_idx >= 2);
  if (late) reasons.push('r_late');
  if (profile.diabetic && (mid || late)) reasons.push('r_dia');                              // lower threshold
  const symptom = reasons.some(r => !['r_late','r_dia'].includes(r));
  const level = (symptom || (late && ranking[0].k !== 'healthy')) ? 2 : reasons.length ? 1 : 0;
  return {level, ranking, reasons};
}

// ====== 6. DATA ======
async function load(){
  try {
    const {data:{session}} = await sb.auth.getSession(); S.session = session;
    if (!session){ S.profile = null; return render(); }
    const {data:p, error} = await sb.from('profiles').select('*').eq('id', session.user.id).single();
    if (error) throw error;
    S.profile = p;
    if (p.preferences?.lang) S.lang = p.preferences.lang;
    if (p.role === 'doctor'){
      const [a, b] = await Promise.all([
        sb.from('profiles').select('*').eq('role','patient').not('started_at','is',null),
        sb.from('checkins').select('*').order('taken_at')]);
      S.patients = a.data || []; S.all = b.data || [];
    } else {
      const {data} = await sb.from('checkins').select('*').eq('user_id', p.id).order('taken_at');
      S.rows = data || [];
      S.notes = (await sb.from('ai_notes').select('*').eq('user_id', p.id).order('created_at', {ascending:false}).limit(3)).data || [];
    }
  } catch (e) { console.error(e); S.session = null; S.profile = null; }
  render();
}

// ====== 7. VIEWS ======
function authView(){
  const su = S.mode === 'signup';
  return `<section class="card"><form id="auth">
    ${su ? `<label>${t('name')}<input name="name" required></label>
      <label>${t('age')}<input name="age" type="number" min="1" max="120" required></label>
      <label>${t('skin')}<select name="skin"><option value="light">${t('skin0')}</option><option value="medium">${t('skin1')}</option><option value="dark">${t('skin2')}</option></select></label>
      <label>${t('allergies')}<input name="allergies"></label>
      <label class="chk"><input name="diabetic" type="checkbox"> ${t('diabetic')}</label>` : ''}
    <label>${t('email')}<input name="email" type="email" required autocomplete="email"></label>
    <label>${t('password')}<input name="password" type="password" minlength="6" required autocomplete="${su ? 'new-password' : 'current-password'}"></label>
    <p class="err" id="err"></p>
    <button class="primary">${su ? t('signup') : t('login')}</button></form>
    <button class="ghost" id="swap">${su ? t('login') : t('signup')}</button></section>`;
}

function patientView(){
  const p = S.profile;
  if (!p.started_at) return `<section class="card center"><p>${t('startHelp')}</p><button class="primary big" id="start">${t('start')}</button></section>`;
  const h = hoursSince(p.started_at), day = Math.min(Math.floor(h/24) + 1, 10), ended = h > 240;
  const layer = layerNow(), bands = layer === 'outer' ? BTB : ANTHO, pre = layer === 'outer' ? 'btb' : 'an';
  const done = new Set(S.rows.filter(r => r.slot !== 'extra').map(r => r.day_index + r.slot)).size;
  const a = assess(p, S.rows);
  const slotNow = new Date().getHours() < 15 ? 'morning' : 'evening';
  const due = !ended && !S.rows.some(r => r.day_index === Math.floor(h/24) && r.slot === slotNow);
  return `<section class="card hero"><div class="ring" style="--p:${Math.round(Math.min(done, 20)/20*100)}"><b>${done}</b><span>/20</span></div>
    <div><h2>${t('hello')}, ${esc(p.name)}</h2><p class="sub">${t('day')} ${day} ${t('of')}</p>
    ${due ? `<p class="due">${t('due')} (${t(slotNow)}${prefs()[slotNow] ? ', ' + esc(prefs()[slotNow]) : ''})</p>` : ''}</div></section>
  ${S.rows.length ? `<div class="strip">${S.rows.map(r => `<span class="chip sm" style="background:${(r.layer === 'outer' ? BTB : ANTHO)[r.colour_idx].hex}" title="${t('day')} ${r.day_index + 1}"></span>`).join('')}</div>` : ''}
  ${S.rows.length ? `<section class="card lvl${a.level}"><p>${t(['ok','warn','alert'][a.level])}</p>
     ${a.reasons.length ? `<ul>${a.reasons.map(r => `<li>${t(r)}</li>`).join('')}</ul>` : ''}</section>` : ''}
  ${ended ? `<section class="card"><p>${t('ended')}</p></section>` : `<section class="card"><h2>${t('checkin')}</h2><p class="sub">${t(layer)}</p>
  <form id="ci"><p>${t('which')}</p>
    <div class="sw">${bands.map((b,i) => `<label class="s"><input type="radio" name="c" value="${i}" required><span class="chip" style="background:${b.hex}"></span><span>${t(pre+i)}</span></label>`).join('')}</div>
    <fieldset><legend>${t('symptoms')}</legend>${['fever','redness','pus','pain'].map(k => `<label class="chk"><input type="checkbox" name="${k}"> ${t(k)}</label>`).join('')}</fieldset>
    <button class="primary">${t('save')}</button></form></section>`}
  ${S.rows.length ? `<section class="card"><h2>${t('history')}</h2><table>${[...S.rows].reverse().map(r =>
     `<tr><td>${t('day')} ${r.day_index + 1}</td><td>${t(r.slot)}</td><td>${colourName(r)}</td></tr>`).join('')}</table></section>` : ''}` + coachView() + settingsView();
}

const noteHtml = n => `<div class="note-b"><p class="sub">${esc(n.question || t('explain'))}</p><p>${esc(n.answer)}</p></div>`;

function coachView(){
  return `<section class="card"><h2>${t('coach')}</h2>
    <button class="ghost line" id="explain">${t('explain')}</button>
    <form id="ask" class="askrow"><input name="q" placeholder="${t('askPh')}"><button class="primary">${t('send')}</button></form>
    <div id="aiOut">${(S.notes || []).map(noteHtml).join('')}</div></section>`;
}

function settingsView(){
  const x = prefs();
  return `<details class="card"><summary>${t('settings')}</summary><form id="prefs">
    <label>${t('textSize')}<select name="size">${[0,1,2].map(i => `<option value="${i}" ${(x.size ?? 0) == i ? 'selected' : ''}>${t('s' + i)}</option>`).join('')}</select></label>
    <label>${t('rem')}: ${t('morning')}<input type="time" name="morning" value="${esc(x.morning || '08:00')}"></label>
    <label>${t('rem')}: ${t('evening')}<input type="time" name="evening" value="${esc(x.evening || '20:00')}"></label>
    <label>${t('contact')}<input name="cname" value="${esc(x.cname || '')}"></label>
    <label>${t('phone')}<input name="cphone" type="tel" value="${esc(x.cphone || '')}"></label>
    <button class="primary">${t('savePrefs')}</button></form>
    ${x.cphone ? `<a class="call" href="tel:${esc(x.cphone)}">${t('call')} ${esc(x.cname || '')}</a>` : ''}</details>`;
}

function doctorView(){
  if (S.sel){
    const p = S.patients.find(x => x.id === S.sel), rows = S.all.filter(r => r.user_id === p.id), a = assess(p, rows);
    return `<button class="ghost" id="back">${t('back')}</button>
    <section class="card lvl${a.level}"><h2>${esc(p.name)}, ${esc(p.age)}</h2>
      <p class="sub">${esc(p.skin)}${p.diabetic ? ', ' + t('diabetic') : ''}${p.allergies ? ', ' + esc(p.allergies) : ''}</p>
      <p>${t('lvl' + a.level)}</p>${a.reasons.length ? `<ul>${a.reasons.map(r => `<li>${t(r)}</li>`).join('')}</ul>` : ''}</section>
    ${a.ranking.length ? `<section class="card"><h2>${t('likely')}</h2><ul>${a.ranking.map(r =>
      `<li>${r.k === 'healthy' ? t('healthy') : ORGNAME[r.k]}: ${Math.round(r.score*100)}%</li>`).join('')}</ul></section>` : ''}
    <section class="card"><table>${[...rows].reverse().map(r => `<tr><td>${t('day')} ${r.day_index + 1}</td><td>${t(r.slot)}</td><td>${colourName(r)}</td>
      <td>${['fever','redness','pus','pain'].filter(k => r[k]).map(t).join(', ')}</td></tr>`).join('')}</table></section>`;
  }
  const list = S.patients.map(p => ({p, a: assess(p, S.all.filter(r => r.user_id === p.id))})).sort((x, y) => y.a.level - x.a.level);
  return `<h2>${t('patients')}</h2>` + (list.length ? list.map(({p, a}) =>
    `<button class="row" data-pid="${p.id}"><span>${esc(p.name)}<br><span class="sub">${t('day')} ${Math.min(Math.floor(hoursSince(p.started_at)/24) + 1, 10)}</span></span>
     <span class="badge b${a.level}">${t('lvl' + a.level)}</span></button>`).join('') : `<p class="sub">${t('noPatients')}</p>`);
}

function render(){
  document.documentElement.lang = S.lang;
  document.documentElement.style.fontSize = ['100%', '115%', '130%'][prefs().size ?? 0];
  const head = `<header><h1>${t('title')}</h1><div>
    <select id="lang" aria-label="${t('lang')}">${Object.entries(LANGS).map(([c, n]) => `<option value="${c}" ${c === S.lang ? 'selected' : ''}>${n}</option>`).join('')}</select>
    ${S.session ? `<button class="ghost" id="out">${t('logout')}</button>` : ''}</div></header>`;
  const body = !S.session ? authView() : S.profile?.role === 'doctor' ? doctorView() : patientView();
  $('app').innerHTML = head + `<main>${body}</main>`;
  $('disc').textContent = t('disc');
  bind();
}

// ====== 8. EVENTS ======
function bind(){
  $('lang').onchange = e => { S.lang = e.target.value; localStorage.setItem('lang', S.lang); if (S.profile) savePrefs({lang:S.lang}); render(); };
  if ($('out')) $('out').onclick = async () => { await sb.auth.signOut(); S.sel = null; load(); };
  if ($('swap')) $('swap').onclick = () => { S.mode = S.mode === 'signup' ? 'login' : 'signup'; render(); };
  if ($('back')) $('back').onclick = () => { S.sel = null; render(); };
  document.querySelectorAll('[data-pid]').forEach(b => b.onclick = () => { S.sel = b.dataset.pid; render(); });

  if ($('auth')) $('auth').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const r = S.mode === 'signup'
      ? await sb.auth.signUp({email:f.email, password:f.password, options:{data:{name:f.name, age:+f.age, skin:f.skin, allergies:f.allergies, diabetic:!!f.diabetic}}})
      : await sb.auth.signInWithPassword({email:f.email, password:f.password});
    if (r.error) return $('err').textContent = r.error.message;
    load();
  };
  if ($('start')) $('start').onclick = async () => {
    const {error} = await sb.from('profiles').update({started_at:new Date().toISOString()}).eq('id', S.profile.id);
    error ? alert(t('error')) : load();
  };
  const ask = async q => {                              // calls the gemini-coach Edge Function
    const out = $('aiOut'); out.innerHTML = `<p class="sub">${t('thinking')}</p>`;
    const a = assess(S.profile, S.rows);
    const {data, error} = await sb.functions.invoke('gemini-coach', {body:{question:q, lang:S.lang, level:a.level, reasons:a.reasons}});
    if (error || !data?.answer){ out.innerHTML = `<p class="err">${t('aiErr')}</p>`; return; }
    S.notes = [{question:q, answer:data.answer}, ...(S.notes || [])].slice(0, 3);
    out.innerHTML = S.notes.map(noteHtml).join('');
  };
  if ($('explain')) $('explain').onclick = () => ask('');
  if ($('ask')) $('ask').onsubmit = e => { e.preventDefault(); const q = (new FormData(e.target).get('q') || '').trim(); if (q) ask(q); e.target.reset(); };
  if ($('prefs')) $('prefs').onsubmit = async e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    (await savePrefs({size:+f.size, morning:f.morning, evening:f.evening, cname:f.cname, cphone:f.cphone})) ? render() : alert(t('error'));
  };
  if ($('ci')) $('ci').onsubmit = async e => {
    e.preventDefault();
    const f = new FormData(e.target), hrs = hoursSince(S.profile.started_at), di = Math.floor(hrs/24);
    let slot = new Date().getHours() < 15 ? 'morning' : 'evening';
    if (S.rows.some(r => r.day_index === di && r.slot === slot)) slot = 'extra';
    const {error} = await sb.from('checkins').insert({user_id:S.profile.id, hours:+hrs.toFixed(2), day_index:di, slot, layer:layerNow(),
      colour_idx:+f.get('c'), fever:f.has('fever'), redness:f.has('redness'), pus:f.has('pus'), pain:f.has('pain')});
    error ? alert(t('error')) : load();
  };
}

load();
