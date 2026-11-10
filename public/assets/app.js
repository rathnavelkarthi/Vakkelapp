const paths={home:'M3 10 12 3l9 7v10H3z M9 20v-7h6v7',search:'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',spark:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',book:'M12 6v15 M3 3c4-1 7 0 9 3 2-3 5-4 9-3v15c-4-1-7 0-9 3-2-3-5-4-9-3z',bookmark:'M6 3h12v18l-6-4-6 4z',folder:'M3 6h7l2 3h9v12H3z M3 6V3h7l2 3',activity:'M3 12h4l3-8 4 16 3-8h4',globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c5 5 5 13 0 18-5-5-5-13 0-18',shield:'M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7z M8 12l3 3 5-6',file:'M5 3h9l5 5v13H5z M14 3v6h5 M8 13h8 M8 17h6',lock:'M6 10h12v11H6z M8 10V7a4 4 0 0 1 8 0v3',check:'M5 12l4 4L19 6'};
function icon(name){return `<svg class="od-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.file}"/></svg>`;}
function icons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{const name=el.dataset.icon;el.insertAdjacentHTML('afterbegin',icon(name));delete el.dataset.icon;});}icons();
const $=s=>document.querySelector(s), modal=$('#modal'),dynamic=$('#dynamic-view');let user=null,current='assistant',searchType='all',query='',page=1,requestId=0;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,options={}){if(location.protocol==='file:')throw new Error('Start the local application with npm start, then open http://127.0.0.1:3000 to use connected features.');let res;try{res=await fetch(path,{...options,headers:{'Content-Type':'application/json',...options.headers}});}catch{throw new Error('Cannot reach the application server. Start it with npm start and try again.');}let data;try{data=await res.json();}catch{throw new Error('The application server is unavailable. Open the app through its local server to use this feature.');}if(!res.ok)throw new Error(data.error||'Request failed.');return data;}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').hidden=true,5500);}
function showModal(html){
 const content = $('#modal-content');
 content.innerHTML = html;
 const title = content.querySelector('.modal-title');
 title.id = 'modal-title';
 title.tabIndex = -1;
 if (!modal.open) modal.showModal();
 title.focus();
 icons(modal);
}
$('.modal-close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
function info(title,text){showModal(`<h2 class="modal-title">${escape(title)}</h2><p class="modal-copy">${escape(text)}</p><button class="primary" id="close-info">Got it</button>`);$('#close-info').onclick=()=>modal.close();}
function auth(register=false){if(user){showModal(`<h2 class="modal-title">Your account</h2><p class="modal-copy">${escape(user.name)}<br>${escape(user.email)}</p><button class="primary" id="logout">Sign out</button>`);$('#logout').onclick=async()=>{try{await api('/api/auth/logout',{method:'POST',body:'{}'});user=null;syncUser();modal.close();if(current==='saved')navigate('saved');}catch(e){toast(e.message);}};return;}
 showModal(`<p class="eyebrow">YOUR PRIVATE WORKSPACE</p><h2 class="modal-title">${register?'Start your research journey.':'Welcome to Vakeelapp.'}</h2><p class="modal-copy">${register?'Create a local account to save your legal searches.':'Sign in to keep your research in one place.'}</p><form id="auth-form">${register?'<label class="field">Full name<input name="name" autocomplete="name" maxlength="100" required></label>':''}<label class="field">Email address<input type="email" name="email" autocomplete="email" required></label><label class="field">Password<input type="password" name="password" autocomplete="${register?'new-password':'current-password'}" minlength="12" maxlength="256" required><small>At least 12 characters</small></label><p id="auth-error" class="form-error" role="alert" hidden></p><button class="primary" type="submit">${register?'Create account':'Sign in'}</button><button class="secondary" type="button" id="switch-auth">${register?'Already have an account?':'Create an account'}</button></form>`);
 $('#switch-auth').onclick=()=>auth(!register);$('#auth-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='Please wait…';$('#auth-error').hidden=true;try{const data=await api('/api/auth/'+(register?'register':'login'),{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(form)))});if(register){auth(false);toast(data.message);}else{user=data;syncUser();modal.close();toast('You are signed in.');if(current==='saved')navigate('saved');}}catch(err){$('#auth-error').textContent=err.message;$('#auth-error').hidden=false;}finally{button.disabled=false;button.textContent=register?'Create account':'Sign in';}};
}
function syncUser(){$('#profile-name').textContent=user?.name||'Guest workspace';$('#profile-sub').textContent=user?.email||'Sign in to save your work';$('.avatar').textContent=user?.name?.[0]?.toUpperCase()||'G';$('#signin-label').textContent=user?'My account':'Sign in';}
$('#signin').onclick=()=>auth();$('#profile').onclick=()=>auth();
const workspaceSidebar = $('#workspace-sidebar');
const sidebarToggle = $('#sidebar-toggle');
const compactWorkspace = matchMedia('(max-width: 767px)');

function setSidebarOpen(open) {
 const restoreFocus = !open && workspaceSidebar.contains(document.activeElement);
 const label = open ? 'Hide sidebar' : 'Show sidebar';
 workspaceSidebar.hidden = !open;
 sidebarToggle.setAttribute('aria-expanded', String(open));
 sidebarToggle.setAttribute('aria-label', label);
 sidebarToggle.title = label;
 if (restoreFocus) sidebarToggle.focus();
}

setSidebarOpen(!compactWorkspace.matches);
sidebarToggle.disabled = false;
sidebarToggle.addEventListener('click', () => {
 const open = workspaceSidebar.hidden;
 setSidebarOpen(open);
 if (open && compactWorkspace.matches) workspaceSidebar.scrollIntoView({ block: 'start' });
});
compactWorkspace.addEventListener('change', event => setSidebarOpen(!event.matches));
workspaceSidebar.addEventListener('keydown', event => {
 if (event.key === 'Escape') setSidebarOpen(false);
});

const titles={home:'Overview',search:'Legal search',assistant:'AI legal assistant',statutes:'Acts & legislation',saved:'Saved research',documents:'Document locker',tracking:'Tracked cases',professional:'Professional workspace',sources:'Source transparency'};
function viewHeader(eyebrow,title,sub){return `<p class="eyebrow">${eyebrow}</p><h1 class="view-title">${title}</h1><p class="view-sub">${sub}</p>`;}
function navigate(view) {
 requestId++;
 current = view;
 $('#home-view').hidden = view !== 'home';
 $('#assistant-view').hidden = view !== 'assistant';
 dynamic.hidden = view === 'home' || view === 'assistant';
 $('#breadcrumb').textContent = titles[view] || 'Workspace';
 document.querySelectorAll('.nav-item').forEach(button => {
  const active = button.dataset.view === view;
  button.classList.toggle('active', active);
  if (active) button.setAttribute('aria-current', 'page');
  else button.removeAttribute('aria-current');
 });
 if (dynamic.hidden) {
   focusViewHeading(view === 'assistant' ? $('#assistant-view') : $('#home-view'));
   return;
 }
 if(view==='search'||view==='statutes')renderSearch(view==='statutes');
 if(view==='saved')renderSaved();
 if(view==='sources')renderSources();
 if(view==='documents'||view==='tracking')dynamic.innerHTML=viewHeader('YOUR LEGAL SPACE',view==='documents'?'A private place for your documents.':'Stay close to the cases that matter.',view==='documents'?'Document storage must be confidential, access-controlled and auditable.':'Source-backed updates, with the time and origin of every recorded change.')+`<div class="empty-state">${icon(view==='documents'?'lock':'activity')}<h2>${view==='documents'?'Secure uploads are not yet enabled.':'Case monitoring is not connected.'}</h2><p>${view==='documents'?'Encrypted object storage, malware scanning and document processing are required before accepting files. No sensitive files are collected by this release.':'There is no active court connector or notification service. You can search imported records, but this application does not claim live case updates.'}</p><button class="secondary" id="back-search">Go to legal search →</button></div>`;
 if(view==='professional')dynamic.innerHTML=viewHeader('FOR ADVOCATES & LAW FIRMS','The foundation for a connected practice.','Professional features will be released after the legal-data foundation passes its acceptance gates.')+'<div class="notice">Not available in this foundation release. No firm workspace or matter-level permission system is represented as operational.</div><div class="roadmap">'+[['Matters & clients','Private matters, authorised members and client records.'],['Tasks & hearings','Assigned tasks, recorded hearings and clear source labels.'],['Research & drafting','Source-linked briefs and drafts requiring lawyer review.'],['Team administration','Firm roles, access policies and subscription controls.']].map(([t,p])=>`<article class="record"><small>PLANNED CAPABILITY</small><h2>${t}</h2><p>${p}</p></article>`).join('')+'</div>';
 if($('#back-search'))$('#back-search').onclick=()=>navigate('search');
 focusViewHeading(dynamic);
}
function focusViewHeading(view) {
 const heading = view.querySelector('h1');
 heading.tabIndex = -1;
 heading.focus();
}
function renderSearch(statutes=false){if(statutes)searchType='statute';dynamic.innerHTML=viewHeader('LEGAL INTELLIGENCE',statutes?'Explore the law, at its source.':'Find your legal starting point.','Search imported legal records with source provenance and verification timestamps.')+`<div class="search-bar"><label class="sr-only" for="query">Search query</label><input class="research-query" id="query" value="${escape(query)}" placeholder="Case name, number, section or legal topic"><button class="primary" id="run-search">Search resources ↗</button></div><div class="filters"><label>Resource <select id="resource-type"><option value="all">All resources</option><option value="case">Cases</option><option value="judgment">Judgments</option><option value="statute">Legislation</option></select></label><label>Court <input id="court-filter" placeholder="Exact court name"></label></div><div class="notice">Live sources are not connected. Search covers authorised records imported into this installation only.</div><div class="result-tools"><span id="result-count" role="status"></span><button class="secondary" id="save-search">${icon('bookmark')} Save this search</button></div><div id="results"></div>`;
 $('#resource-type').value=searchType;$('#run-search').onclick=()=>{query=$('#query').value.trim();searchType=$('#resource-type').value;page=1;loadResults();};$('#query').onkeydown=e=>{if(e.key==='Enter')$('#run-search').click();};$('#resource-type').onchange=()=>$('#run-search').click();$('#save-search').onclick=saveSearch;loadResults();}
async function loadResults(){const id=++requestId;$('#results').innerHTML='<p class="notice" role="status">Searching available records…</p>';try{const court=$('#court-filter').value.trim();const data=await api(`/api/search?q=${encodeURIComponent(query)}&type=${searchType}&court=${encodeURIComponent(court)}&page=${page}`);if(id!==requestId)return;$('#result-count').textContent=`${data.total} ${data.total===1?'record':'records'} found`;$('#results').innerHTML=data.results.length?data.results.map(r=>`<article class="record"><div class="record-meta"><span>${escape(r.type)}</span><span>${escape(r.court)}</span><span>${escape(r.decision_date)}</span></div><h2>${escape(r.title)}</h2><p>${escape(r.body.slice(0,240))}${r.body.length>240?'…':''}</p><div class="record-meta"><span>Source: ${escape(r.source_name)}</span><span>${escape(r.status)}</span></div><button data-record="${escape(r.id)}">Read record & provenance →</button></article>`).join('')+`<div class="pagination"><button class="secondary" id="prev" ${page===1?'disabled':''}>← Previous</button><span>Page ${page}</span><button class="secondary" id="next" ${page*10>=data.total?'disabled':''}>Next →</button></div>`:'<div class="empty-state">'+icon('search')+'<h2>No matching legal records.</h2><p>No records are fabricated to fill this space. Try a different query, or ask your administrator to import authorised source documents with provenance.</p></div>';dynamic.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>record(b.dataset.record));if($('#prev'))$('#prev').onclick=()=>{page--;loadResults();};if($('#next'))$('#next').onclick=()=>{page++;loadResults();};}catch(e){if(id!==requestId)return;$('#result-count').textContent='Search unavailable';$('#results').innerHTML=`<p class="error-box">${escape(e.message)}</p>`;}}
async function record(id){try{const r=await api('/api/cases/'+encodeURIComponent(id));requestId++;dynamic.innerHTML=`<button class="secondary" id="return-results">← Back to results</button>`+viewHeader(escape(r.type.toUpperCase()),escape(r.title),escape(r.court)+' · '+escape(r.decision_date))+`<article class="record"><pre>${escape(r.body)}</pre></article><article class="record"><h2>Source & verification</h2><p>Source: ${escape(r.source_name)}<br>Status: ${escape(r.status)}<br>Retrieved: ${escape(r.retrieved_at)}<br>Last verified: ${escape(r.verified_at)}</p><pre>SHA-256: ${escape(r.checksum)}</pre><a href="${escape(r.source_url)}" target="_blank" rel="noopener noreferrer">Open original source ↗</a><p>No additional case events or related proceedings have been inferred.</p></article>`;$('#return-results').onclick=()=>renderSearch();}catch(e){toast(e.message);}}
async function saveSearch(){query=$('#query').value.trim();if(!query)return toast('Enter a search before saving it.');if(!user)return auth();try{await api('/api/saved',{method:'POST',body:JSON.stringify({query})});toast('Search saved to your private workspace.');}catch(e){toast(e.message);}}
async function renderSaved(){dynamic.innerHTML=viewHeader('YOUR RESEARCH LIBRARY','Good research is worth keeping.','Your saved searches are private to your account.')+'<div id="saved-content" role="status">Loading saved searches…</div>';if(!user){$('#saved-content').innerHTML='<div class="empty-state">'+icon('bookmark')+'<h2>Make room for your next insight.</h2><p>Sign in to save and revisit your searches. Your research is not shared with other accounts.</p><button class="secondary" id="saved-signin">Sign in to your workspace →</button></div>';$('#saved-signin').onclick=()=>auth();return;}const id=++requestId;try{const data=await api('/api/saved');if(id!==requestId)return;$('#saved-content').innerHTML=data.items.length?data.items.map(s=>`<article class="record saved-item"><div><h2>${escape(s.title)}</h2><p>Saved ${escape(new Date(s.created_at).toLocaleDateString())}</p></div><div><button data-saved-query="${escape(s.query)}">Run search →</button><button class="secondary" data-delete="${s.id}">Delete</button></div></article>`).join(''):'<div class="empty-state"><h2>Your library is ready.</h2><p>Save a query from legal search to start your collection.</p><button id="begin" class="secondary">Explore legal search →</button></div>';if($('#begin'))$('#begin').onclick=()=>navigate('search');dynamic.querySelectorAll('[data-saved-query]').forEach(b=>b.onclick=()=>{query=b.dataset.savedQuery;searchType='all';navigate('search');});dynamic.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{showModal('<h2 class="modal-title">Delete saved search?</h2><p class="modal-copy">This removes the search from your private library.</p><button class="primary" id="confirm-delete">Delete search</button><button class="secondary" id="cancel-delete">Keep search</button>');$('#cancel-delete').onclick=()=>modal.close();$('#confirm-delete').onclick=async()=>{try{await api('/api/saved/'+b.dataset.delete,{method:'DELETE',body:'{}'});modal.close();renderSaved();}catch(e){toast(e.message);}};});}catch(e){if(id===requestId)$('#saved-content').innerHTML=`<p class="error-box">${escape(e.message)}</p>`;}}
async function renderSources(){dynamic.innerHTML=viewHeader('TRUST & TRANSPARENCY','Every record needs a source.','Public availability does not imply unrestricted permission to store or redistribute.')+'<div class="notice">Official and licensed sources are distinguished. No live court connectors are configured; no CAPTCHA or access restrictions are bypassed.</div><div id="sources-content" role="status">Loading source registry…</div>';const id=++requestId;try{const data=await api('/api/sources');if(id!==requestId)return;$('#sources-content').innerHTML=data.sources.length?data.sources.map(s=>`<article class="record"><small>${escape(s.kind)}</small><h2>${escape(s.name)}</h2><p>Usage permission: ${escape(s.permission)}</p><a href="${escape(s.url)}" rel="noopener noreferrer" target="_blank">Source website ↗</a></article>`).join(''):'<div class="empty-state">'+icon('shield')+'<h2>No sources have been imported.</h2><p>The administrator can import records only with a source URL, usage permission, retrieval date, verification date and content checksum. Court connectors require separate authorisation and implementation.</p></div>';}catch(e){if(id===requestId)$('#sources-content').innerHTML=`<p class="error-box">${escape(e.message)}</p>`;}}
document.querySelectorAll('[data-view]').forEach(button => {
 button.onclick = () => {
   const view = button.dataset.view;
   if (view === 'search') searchType = 'all';
   if (compactWorkspace.matches) setSidebarOpen(false);
   navigate(view);
 };
});
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>navigate(b.dataset.open));
$('#main-search').onclick=()=>{searchType=$('input[name=search-category]:checked').value;query=$('#main-query').value.trim();page=1;navigate('search');};$('#main-query').onkeydown=e=>{if(e.key==='Enter')$('#main-search').click();};document.querySelectorAll('[data-query]').forEach(b=>b.onclick=()=>{query=b.dataset.query;searchType='all';page=1;navigate('search');});
$('#trust-more').onclick=()=>navigate('sources');$('#professional').onclick=()=>navigate('professional');$('#start-saving').onclick=()=>navigate('search');
$('#language').onchange=()=>{const lang=$('#language').value;info(lang==='ta'?'மொழி ஆதரவு':lang==='hi'?'भाषा समर्थन':'Language support','English is available in this foundation release. Full Tamil and Hindi translations and multilingual legal retrieval are not yet implemented. Original legal text will always remain accessible.');$('#language').value='en';};
const assistantForm = $('#assistant-form');
const assistantQuestion = $('#ai-question');
const assistantError = $('#assistant-error');

assistantForm.addEventListener('submit', event => {
 event.preventDefault();
 const question = assistantQuestion.value.trim();
 if (!question) {
   assistantError.hidden = false;
   assistantQuestion.setAttribute('aria-invalid', 'true');
   assistantQuestion.setAttribute('aria-describedby', 'assistant-error assistant-availability');
   assistantQuestion.focus();
   return;
 }
 query = question;
 searchType = 'all';
 page = 1;
 navigate('search');
});
assistantQuestion.addEventListener('input', () => {
 if (!assistantError.hidden && assistantQuestion.value.trim()) {
   assistantError.hidden = true;
   assistantQuestion.removeAttribute('aria-invalid');
   assistantQuestion.setAttribute('aria-describedby', 'assistant-availability');
 }
});
assistantQuestion.addEventListener('keydown', event => {
 if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
   event.preventDefault();
   assistantForm.requestSubmit();
 }
});
assistantForm.querySelector('button[type="submit"]').disabled = false;
document.querySelectorAll('[data-starter-query]').forEach(button => {
 button.addEventListener('click', () => {
   assistantQuestion.value = button.dataset.starterQuery;
   assistantQuestion.dispatchEvent(new Event('input'));
   assistantQuestion.focus();
 });
 button.disabled = false;
});

document.addEventListener('keydown', event => {
 if (event.key !== '/' || modal.open || document.activeElement.matches('input, textarea, select, [contenteditable="true"]')) return;
 const input = current === 'assistant' ? assistantQuestion : current === 'home' ? $('#main-query') : $('#query');
 if (input) {
   event.preventDefault();
   input.focus();
 }
});
api('/api/me').then(u=>{user=u;syncUser();}).catch(()=>{});
