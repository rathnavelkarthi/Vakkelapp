import { scenarioIcons as paths, scenarios } from "./scenarios.js";
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[el.dataset.icon]}"/></svg>`;});
const $ = selector => document.querySelector(selector);
$('#menu-toggle').onclick=()=>{const open=$('#menu-toggle').getAttribute('aria-expanded')!=='true';$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#nav-links').classList.toggle('open',open);};$('#nav-links').querySelectorAll('a').forEach(a=>a.onclick=()=>{$('#menu-toggle').setAttribute('aria-expanded','false');$('#nav-links').classList.remove('open');});
let intake={topic:null,text:'',state:'',city:'',goal:''},intakeStep=0;
const states=['Tamil Nadu','Karnataka','Delhi','Maharashtra','Kerala','Other state / union territory'];
function safe(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const question = $('#question');
const questionError = $('#question-error');
const questionDescription = question.getAttribute('aria-describedby');

function clearQuestionError() {
  questionError.hidden = true;
  question.removeAttribute('aria-invalid');
  question.setAttribute('aria-describedby', questionDescription);
}

question.addEventListener('input', () => {
  if (question.value.trim()) clearQuestionError();
});

function chat(topic) {
  if (topic) question.value = scenarios[topic].question;
  const text = question.value.trim();
  if (!text) {
    questionError.hidden = false;
    question.setAttribute('aria-invalid', 'true');
    question.setAttribute('aria-describedby', questionError.id + ' ' + questionDescription);
    question.focus();
    return;
  }
  clearQuestionError();
  intake={topic:topic||(/landlord|rent|house|deposit/i.test(text)?'housing':/traffic|police|fine/i.test(text)?'traffic':/salary|work|employer/i.test(text)?'work':'notice'),text,state:'',city:'',goal:''};intakeStep=0;renderIntake();focusIntakeStep();}
function renderIntake(){const box=$('#chat-response');box.hidden=false;let content='';
if(intakeStep===0)content=`<h3>Where did this happen?</h3><p>Legal context can depend on location. Choose a state or union territory first.</p><label class="intake-field">State / union territory<select id="intake-state"><option value="">Choose location</option>${states.map(s=>`<option ${intake.state===s?'selected':''}>${s}</option>`).join('')}</select></label>`;
if(intakeStep===1)content=`<h3>Which city or district?</h3><p>A broad location is enough. Do not include your address.</p><label class="intake-field">City / district<input id="intake-city" name="city" autocomplete="off" maxlength="80" value="${safe(intake.city)}" placeholder="For example, Chennai"></label>`;
if(intakeStep===2)content=`<h3>What would help you right now?</h3><p>Choose a next step. This preview does not assess your legal position.</p><label class="intake-field">Your goal<select id="intake-goal"><option value="">Choose your goal</option><option value="understand" ${intake.goal==='understand'?'selected':''}>Understand the situation</option><option value="lawyer" ${intake.goal==='lawyer'?'selected':''}>Speak with a lawyer</option><option value="deadline" ${intake.goal==='deadline'?'selected':''}>I have a stated deadline or urgent concern</option></select></label>`;
if(intakeStep===3)content=`<h3>Your next step, made clearer.</h3><p>${intake.goal==='understand'?'Explore source-linked information in the local research workspace. A connected assistant would need verified material before explaining the law.':intake.goal==='deadline'?'This preview cannot assess urgency or deadlines. Consider contacting a qualified lawyer promptly; no appointment or emergency response is arranged here.':'Compare relevant professional experience and consultation preferences before choosing someone to contact.'}</p><p class="intake-summary">${safe(intake.city)} · ${safe(intake.state)} · ${safe(intake.topic)} topic</p><div class="intake-actions">${intake.goal==='understand'?'<a class="button" href="/workspace">Explore available research ↗</a>':''}<button class="button" id="intake-match">Browse example lawyer profiles ↗</button></div><small>No legal answer or live booking was generated. Location is used in this browser preview only.</small>`;
box.innerHTML=`<span class="response-label">Preview · Guided intake · Step ${Math.min(intakeStep+1,3)} of 3</span>${content}<p id="intake-error" role="alert" hidden></p><div class="intake-actions">${intakeStep>0?'<button id="intake-back">← Back</button>':''}${intakeStep<3?'<button class="button" id="intake-next">Continue →</button>':'<button id="intake-restart">Start again ↺</button>'}</div>`;
const fields = [
  ['state', '#intake-state', 'Choose a state or union territory.'],
  ['city', '#intake-city', 'Enter a city or district.'],
  ['goal', '#intake-goal', 'Choose what you would like help with.'],
];
const nextButton = $('#intake-next');
if (nextButton) {
  const [key, selector, message] = fields[intakeStep];
  const field = $(selector);
  const error = $('#intake-error');
  field.addEventListener('input', () => {
    if (!field.value.trim()) return;
    error.hidden = true;
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  });
  nextButton.onclick = () => {
    const value = field.value.trim();
    if (!value) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', error.id);
      error.hidden = false;
      error.textContent = message;
      field.focus();
      return;
    }
    intake[key] = value;
    intakeStep++;
    renderIntake();
    focusIntakeStep();
  };
}
if($('#intake-back'))$('#intake-back').onclick=()=>{intakeStep--;renderIntake();focusIntakeStep();};if($('#intake-restart'))$('#intake-restart').onclick=()=>{intakeStep=0;renderIntake();focusIntakeStep();};if($('#intake-match'))$('#intake-match').onclick=()=>{clearFilterSelections();$('#practice').value=({housing:'Housing',traffic:'Traffic',work:'Employment'})[intake.topic]||'all';const city=[...$('#location').options].find(o=>o.value.toLowerCase()===intake.city.toLowerCase());if(city)$('#location').value=city.value;applyFilters();focusHeading('#lawyers h2');};}
function focusIntakeStep() {
  focusHeading('#chat-response h3');
}

function focusHeading(selector) {
  const heading = $(selector);
  heading.tabIndex = -1;
  heading.focus();
}

$('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  chat();
});
$('#question').addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    chat();
  }
});
document.querySelectorAll('[data-topic]').forEach(button => {
  button.addEventListener('click', () => chat(button.dataset.topic));
});
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-try-scenario]');
  const topic = trigger?.dataset.tryScenario;
  if (topic && Object.hasOwn(scenarios, topic)) chat(topic);
});
const profiles=[{id:'a',name:'Example Advocate A',initials:'A',practice:'Housing',city:'Chennai',years:12,age:39,cases:320,languages:'English, Tamil',fee:1500,modes:['Online','In person']},{id:'b',name:'Example Advocate B',initials:'B',practice:'Traffic',city:'Bengaluru',years:7,age:34,cases:180,languages:'English, Kannada',fee:750,modes:['Online']},{id:'c',name:'Example Advocate C',initials:'C',practice:'Employment',city:'New Delhi',years:19,age:48,cases:560,languages:'English, Hindi',fee:2500,modes:['Online','In person']}];
const shortlist=new Set(),filterIds=['practice','experience','location','language-filter','fee','mode','age','cases'];
function renderLawyers(){const filtered=profiles.filter(p=>($('#practice').value==='all'||p.practice===$('#practice').value)&&p.years>=Number($('#experience').value)&&p.cases>=Number($('#cases').value)&&($('#location').value==='all'||p.city===$('#location').value)&&($('#language-filter').value==='all'||p.languages.includes($('#language-filter').value))&&(!Number($('#fee').value)||p.fee<=Number($('#fee').value))&&($('#mode').value==='all'||p.modes.includes($('#mode').value))&&($('#age').value==='all'||($('#age').value==='under40'?p.age<40:p.age>=40)));
$('#lawyer-count').textContent=`${filtered.length} fictional example profile${filtered.length===1?'':'s'}`;
$('#lawyer-grid').innerHTML=filtered.length?filtered.map(p=>`<article class="lawyer-card"><div class="profile-top"><span class="avatar">${p.initials}</span><span class="fiction-label">Preview · Fictional</span></div><h3>${p.name}</h3><p>${p.practice} · ${p.city}</p><div class="profile-stats"><div><strong>${p.years} yrs</strong><small>Experience</small></div><div><strong>${p.cases}</strong><small>Cases handled*</small></div><div><strong>₹${p.fee}</strong><small>Example fee</small></div></div><p class="profile-extra">${p.languages}<br>${p.modes.join(' / ')}</p><label class="shortlist-label"><input type="checkbox" data-shortlist="${p.id}" ${shortlist.has(p.id)?'checked':''}> Shortlist for comparison</label><button data-profile="${p.id}">View example profile <span>↗</span></button><small class="case-disclaimer">*Fictional count, not a success rate or verified credential.</small></article>`).join(''):'<div class="no-profiles"><h3>No examples match these preferences.</h3><p>Try another city or practice area, or view all fictional profiles.</p><button class="button" id="empty-reset">Show all example profiles</button></div>';if($('#empty-reset'))$('#empty-reset').onclick=resetFilters;updateShortlist();}
const filterControls = filterIds.map(id => $('#' + id));

function restoreFilters() {
  const params = new URLSearchParams(location.search);
  for (const control of filterControls) {
    const value = params.get(control.id);
    const option = [...control.options].find(option => option.value === value);
    control.value = option?.value ?? control.options[0].value;
    if (control.selectedIndex > 0) {
      const details = control.closest('details');
      if (details) details.open = true;
    }
  }
  renderLawyers();
}

function applyFilters() {
  const url = new URL(location.href);
  for (const control of filterControls) {
    if (control.selectedIndex === 0) url.searchParams.delete(control.id);
    else url.searchParams.set(control.id, control.value);
  }
  if (url.href !== location.href) history.replaceState(history.state, '', url);
  renderLawyers();
}

function clearFilterSelections() {
  for (const control of filterControls) control.selectedIndex = 0;
}

function resetFilters() {
  clearFilterSelections();
  applyFilters();
  $('#practice').focus();
}

for (const control of filterControls) control.addEventListener('change', applyFilters);
$('#reset-filters').onclick = resetFilters;
window.addEventListener('popstate', restoreFilters);
function updateShortlist(){$('#compare-tray').hidden=shortlist.size===0;$('#shortlist-count').textContent=`${shortlist.size} of 3 shortlisted · Choose at least 2 to compare`;$('#compare-button').disabled=shortlist.size<2;if(!$('#comparison').hidden)renderComparison();}
$('#lawyer-grid').addEventListener('change',e=>{const id=e.target.dataset.shortlist;if(!id)return;e.target.checked?shortlist.add(id):shortlist.delete(id);updateShortlist();});$('#clear-shortlist').onclick=()=>{shortlist.clear();$('#comparison').hidden=true;renderLawyers();$('#practice').focus();};$('#compare-button').onclick=()=>{$('#comparison').hidden=false;renderComparison();focusHeading('#comparison h3');};
function renderComparison(){const selected=profiles.filter(p=>shortlist.has(p.id));if(selected.length<2){$('#comparison').hidden=true;return;}$('#comparison').innerHTML=`<h3>Side-by-side · Fictional profiles</h3><p>Compare relevant expertise first. All details below are illustrative and unverified.</p><div class="comparison-grid">${selected.map(p=>`<article><h4>${p.name}</h4><dl>${[['Practice area',p.practice],['Experience',p.years+' years'],['City',p.city],['Languages',p.languages],['Example fee','₹'+p.fee],['Mode',p.modes.join(' / ')],['Cases handled',p.cases+' · fictional, not a success rate'],['Age (optional)',p.age+' · not a competence measure']].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><button class="button" data-book="${p.id}">Preview consultation →</button></article>`).join('')}</div>`;}
const dialog=$('#profile-dialog');let lastTrigger=null,booking={};
function openDialog(html,trigger){lastTrigger=trigger||document.activeElement;$('#profile-content').innerHTML=html;if(!dialog.open)dialog.showModal();}
$('#close-dialog').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>{if(lastTrigger?.isConnected)lastTrigger.focus();else $('#practice').focus();});
function showProfile(p,trigger){openDialog(`<span class="eyebrow">Preview · Fictional profile</span><h2 id="profile-title">${p.name}</h2><p>${p.practice} · ${p.city}<br>${p.years} years of example experience<br>${p.languages}</p><p>Example fee: ₹${p.fee} · ${p.modes.join(' / ')}<br>Example age: ${p.age}<br>Example cases: ${p.cases} — not verified or a success rate.</p><p>This is not a real professional or an offer of legal services. Verification and consent are required before launch.</p><button class="button" data-book="${p.id}">Explore consultation steps →</button>`,trigger);}
function bookingView(p,step=0){const titles=['Choose your preferences','Review the request','Await lawyer acceptance','Confirmation comes last'];let content='';
if(step===0)content=`<p>Preview only. No personal details or payment are collected.</p><label class="intake-field">Consultation mode<select id="book-mode">${p.modes.map(m=>`<option ${booking.mode===m?'selected':''}>${m}</option>`).join('')}</select></label><label class="intake-field">Preferred time of day<select id="book-time"><option ${booking.time==='Morning'?'selected':''}>Morning</option><option ${booking.time==='Afternoon'?'selected':''}>Afternoon</option><option ${booking.time==='Evening'?'selected':''}>Evening</option></select></label><p>No actual times or appointments are available. Illustrative fee: ₹${p.fee}.</p>`;
if(step===1)content=`<p>${p.name} · fictional<br>${booking.mode} · ${booking.time}<br>Illustrative fee: ₹${p.fee}</p><p>In a live service, you would review the scope, fee, privacy terms and cancellation policy before explicitly submitting a request. Nothing will be sent here.</p>`;
if(step===2)content='<p>A real request would remain pending until the lawyer accepts or declines. Choosing a preferred time does not confirm availability.</p><p>This is a walkthrough: no lawyer has been contacted and no request has been created.</p>';
if(step===3)content='<p>A real booking would be confirmed only after acceptance and any required user confirmation. Appointment details and the agreed fee would then be shown.</p><p><strong>Preview finished. No appointment exists and no payment was taken.</strong></p>';
$('#profile-content').innerHTML=`<span class="eyebrow">Preview · Consultation walkthrough</span><h2 id="profile-title">${titles[step]}</h2><div class="booking-progress" aria-label="Step ${step+1} of 4">${['Preferences','Review','Acceptance','Confirmation'].map((x,i)=>`<span class="${i===step?'current':''}">${i+1}. ${x}</span>`).join('')}</div>${content}<div class="intake-actions">${step>0?'<button id="booking-back">← Back</button>':''}<button class="button" id="booking-next">${step===3?'Finish preview':'Next preview step →'}</button></div>`;
$('#booking-next').onclick=()=>{if(step===3)return dialog.close();if(step===0){booking.mode=$('#book-mode').value;booking.time=$('#book-time').value;}bookingView(p,step+1);};if($('#booking-back'))$('#booking-back').onclick=()=>bookingView(p,step-1);
if (!dialog.open) dialog.showModal();
focusHeading('#profile-title');
}
document.addEventListener('click',e=>{const profile=e.target.closest('[data-profile]'),book=e.target.closest('[data-book]');if(profile)showProfile(profiles.find(p=>p.id===profile.dataset.profile),profile);if(book){const p=profiles.find(p=>p.id===book.dataset.book);booking={mode:p.modes[0],time:'Morning'};if(!dialog.open)lastTrigger=book;bookingView(p);}});
restoreFilters();
