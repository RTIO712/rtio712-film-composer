const PASSWORD = '0712';
const genres = [
  ['drama','드라마','Drama'],['thriller','스릴러','Thriller'],['horror','공포','Horror'],['action','액션','Action'],
  ['romance','로맨스','Romance'],['melo','멜로','Melo'],['experimental','실험적인','Experimental'],['trailer','예고편','Trailer']
];
const repoOwner = 'rtio712';
const repoName = 'rtio712-film-composer';
const branch = 'main';
const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
const genreCards = document.getElementById('genreCards');
const librarySections = document.getElementById('librarySections');
const data = {};
function esc(s){return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')}
function titleFromFile(file){return decodeURIComponent(file).replace(/\.mp3$/i,'').replace(/[-_]+/g,' ').trim()}
function audioPath(genre,file){return `assets/audio/${genre}/${encodeURIComponent(file).replaceAll('%2F','/')}`}
async function fetchJson(path){const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error(path); return r.json()}
async function loadGenre(genre){
  try { const tracks = await fetchJson(`assets/audio/${genre}/tracks.json`); return Array.isArray(tracks) ? tracks.filter(Boolean).slice(0,50) : []; }
  catch(e){ return []; }
}
function normalizeTrack(t){ if(typeof t==='string') return {file:t,title:titleFromFile(t)}; return {file:t.file||'',title:t.title||titleFromFile(t.file||'')}; }
function renderGenreCards(){
  genreCards.innerHTML='';
  genres.forEach(([key,ko,en])=>{
    const list=(data[key]||[]).map(normalizeTrack);
    const latest=list[0];
    const card=document.createElement('article'); card.className='genre-card';
    card.innerHTML=`<h3>${ko}</h3><small>${en}</small><span class="genre-count">${list.length} / 50 Tracks</span><div class="latest">${latest?`<b>${esc(latest.title)}</b><span>${esc(latest.file)}</span><audio controls preload="none" src="${audioPath(key,latest.file)}"></audio>`:`<div class="empty">아직 등록된 MP3가 없습니다.<br>GitHub에 MP3와 tracks.json을 올려주세요.</div>`}</div>`;
    card.onclick=()=>document.getElementById(`lib-${key}`).scrollIntoView({behavior:'smooth',block:'start'});
    genreCards.appendChild(card);
  });
}
function downloadWithPassword(url,file){
  const input=prompt('다운로드 비밀번호를 입력하세요.');
  if(input!==PASSWORD){ alert('비밀번호가 맞지 않습니다.'); return; }
  const a=document.createElement('a'); a.href=url; a.download=file; document.body.appendChild(a); a.click(); a.remove();
}
function renderLibraries(){
  librarySections.innerHTML='';
  genres.forEach(([key,ko,en])=>{
    const list=(data[key]||[]).map(normalizeTrack);
    const sec=document.createElement('section'); sec.className='library-section'; sec.id=`lib-${key}`;
    let html=`<div class="library-head"><div><p class="eyebrow">${en}</p><h3>${ko}</h3></div><span class="genre-count">${list.length} / 50 Tracks</span></div>`;
    if(!list.length){ html += `<div class="empty">${ko} 장르에 등록된 MP3가 없습니다.</div>`; }
    list.forEach((t,i)=>{ const url=audioPath(key,t.file); html += `<div class="track-row"><div class="no">#${String(i+1).padStart(2,'0')}</div><div class="title">${esc(t.title)}</div><div class="file">${esc(t.file)}</div><audio controls preload="none" src="${url}"></audio><button class="btn-download" data-url="${esc(url)}" data-file="${esc(t.file)}">Download</button></div>`; });
    sec.innerHTML=html; librarySections.appendChild(sec);
  });
  document.querySelectorAll('.btn-download').forEach(btn=>btn.onclick=()=>downloadWithPassword(btn.dataset.url,btn.dataset.file));
}
async function init(){
  for(const [key] of genres){ data[key]=await loadGenre(key); }
  renderGenreCards(); renderLibraries();
}
init();
