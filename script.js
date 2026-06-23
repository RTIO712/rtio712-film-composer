const PASSWORD = '0712';
const DEFAULT_GENRES = [
  {key:'drama', ko:'드라마', en:'Drama'},
  {key:'thriller', ko:'스릴러', en:'Thriller'},
  {key:'horror', ko:'공포', en:'Horror'},
  {key:'action', ko:'액션', en:'Action'},
  {key:'romance', ko:'로맨스', en:'Romance'},
  {key:'melo', ko:'멜로', en:'Melo'},
  {key:'experimental', ko:'실험적인', en:'Experimental'},
  {key:'trailer', ko:'예고편', en:'Trailer'}
];
const STORAGE = {
  customGenres: 'rtio712_custom_genres_v1',
  deletedGenres: 'rtio712_deleted_genres_v1',
  playCounts: 'rtio712_play_counts_v1',
  visits: 'rtio712_visit_count_v1'
};
const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
const genreCards = document.getElementById('genreCards');
const librarySections = document.getElementById('librarySections');
const deleteGenreSelect = document.getElementById('deleteGenreSelect');
let genres = [];
const data = {};

function esc(s){return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')}
function titleFromFile(file){return decodeURIComponent(file||'').replace(/\.mp3$/i,'').replace(/[-_]+/g,' ').trim()}
function audioPath(genre,file){return `assets/audio/${genre}/${encodeURIComponent(file).replaceAll('%2F','/')}`}
async function fetchJson(path){const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error(path); return r.json()}
function readStore(key,fallback){try{const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback}catch(e){return fallback}}
function writeStore(key,value){localStorage.setItem(key,JSON.stringify(value))}
function normalizeTrack(t){ if(typeof t==='string') return {file:t,title:titleFromFile(t)}; return {file:t.file||'',title:t.title||titleFromFile(t.file||'')}; }
function trackId(genre,file){return `${genre}::${file}`}
function getPlayCounts(){return readStore(STORAGE.playCounts,{})}
function getPlayCount(genre,file){return Number(getPlayCounts()[trackId(genre,file)]||0)}
function incrementPlayCount(genre,file){const counts=getPlayCounts(); const id=trackId(genre,file); counts[id]=Number(counts[id]||0)+1; writeStore(STORAGE.playCounts,counts); return counts[id]}
function requirePassword(message){const input=prompt(message||'비밀번호를 입력하세요.'); return input===PASSWORD}

function updateVisitorCount(){
  const current = Number(localStorage.getItem(STORAGE.visits)||0) + 1;
  localStorage.setItem(STORAGE.visits,String(current));
  const node = document.getElementById('visitorCount');
  if(node) node.textContent = current.toLocaleString();
}
async function loadGenreList(){
  let base = DEFAULT_GENRES;
  try {
    const remote = await fetchJson('assets/audio/genres.json');
    if(Array.isArray(remote) && remote.length) base = remote.filter(g=>g && g.key).map(g=>({key:g.key, ko:g.ko||g.key, en:g.en||g.key}));
  } catch(e) {}
  const custom = readStore(STORAGE.customGenres,[]);
  const deleted = new Set(readStore(STORAGE.deletedGenres,[]));
  const merged = [...base];
  custom.forEach(g=>{ if(g && g.key && !merged.some(x=>x.key===g.key)) merged.push(g); });
  genres = merged.filter(g=>!deleted.has(g.key));
}
async function loadGenre(genre){
  try { const tracks = await fetchJson(`assets/audio/${genre}/tracks.json`); return Array.isArray(tracks) ? tracks.filter(Boolean).slice(0,50) : []; }
  catch(e){ return []; }
}
function renderGenreCards(){
  genreCards.innerHTML='';
  genres.forEach(({key,ko,en})=>{
    const list=(data[key]||[]).map(normalizeTrack);
    const latest=list[0];
    const card=document.createElement('article'); card.className='genre-card';
    card.innerHTML=`<h3>${esc(ko)}</h3><small>${esc(en)}</small><span class="genre-count">${list.length} / 50 Tracks</span><div class="latest">${latest?`<b>${esc(latest.title)}</b><span>${esc(latest.file)}</span><audio controls preload="none" data-genre="${esc(key)}" data-file="${esc(latest.file)}" src="${audioPath(key,latest.file)}"></audio><div class="play-stat">PLAY COUNT <strong data-count-for="${esc(trackId(key,latest.file))}">${getPlayCount(key,latest.file)}</strong></div>`:`<div class="empty">아직 등록된 MP3가 없습니다.<br>GitHub에 MP3와 tracks.json을 올려주세요.</div>`}</div>`;
    card.onclick=(event)=>{ if(event.target.closest('audio')) return; document.getElementById(`lib-${key}`).scrollIntoView({behavior:'smooth',block:'start'}); };
    genreCards.appendChild(card);
  });
}
function downloadWithPassword(url,file){
  if(!requirePassword('다운로드 비밀번호를 입력하세요.')){ alert('비밀번호가 맞지 않습니다.'); return; }
  const a=document.createElement('a'); a.href=url; a.download=file; document.body.appendChild(a); a.click(); a.remove();
}
function renderLibraries(){
  librarySections.innerHTML='';
  genres.forEach(({key,ko,en})=>{
    const list=(data[key]||[]).map(normalizeTrack);
    const sec=document.createElement('section'); sec.className='library-section'; sec.id=`lib-${key}`;
    let html=`<div class="library-head"><div><p class="eyebrow">${esc(en)}</p><h3>${esc(ko)}</h3></div><span class="genre-count">${list.length} / 50 Tracks</span></div>`;
    if(!list.length){ html += `<div class="empty">${esc(ko)} 장르에 등록된 MP3가 없습니다.</div>`; }
    list.forEach((t,i)=>{ const url=audioPath(key,t.file); html += `<div class="track-row"><div class="no">#${String(i+1).padStart(2,'0')}</div><div class="title">${esc(t.title)}<div class="play-stat">PLAY COUNT <strong data-count-for="${esc(trackId(key,t.file))}">${getPlayCount(key,t.file)}</strong></div></div><div class="file">${esc(t.file)}</div><audio controls preload="none" data-genre="${esc(key)}" data-file="${esc(t.file)}" src="${url}"></audio><button class="btn-download" data-url="${esc(url)}" data-file="${esc(t.file)}">Download</button></div>`; });
    sec.innerHTML=html; librarySections.appendChild(sec);
  });
  document.querySelectorAll('.btn-download').forEach(btn=>btn.onclick=()=>downloadWithPassword(btn.dataset.url,btn.dataset.file));
}
function renderGenreManager(){
  if(!deleteGenreSelect) return;
  deleteGenreSelect.innerHTML = '';
  genres.forEach(({key,ko,en})=>{
    const option=document.createElement('option'); option.value=key; option.textContent=`${ko} / ${en} (${key})`; deleteGenreSelect.appendChild(option);
  });
}
function bindAudioSinglePlay(){
  document.querySelectorAll('audio').forEach(audio=>{
    audio.addEventListener('play',()=>{
      document.querySelectorAll('audio').forEach(other=>{ if(other!==audio){ other.pause(); } });
      const genre=audio.dataset.genre; const file=audio.dataset.file;
      if(genre && file){ const count=incrementPlayCount(genre,file); updateCountLabels(genre,file,count); }
    }, {once:false});
  });
}
function updateCountLabels(genre,file,count){
  const id = trackId(genre,file);
  document.querySelectorAll(`[data-count-for="${CSS.escape(id)}"]`).forEach(node=>{ node.textContent=Number(count).toLocaleString(); });
}
function cleanGenreKey(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9_-]/g,'')}
function bindGenreActions(){
  const addBtn=document.getElementById('addGenreBtn');
  const deleteBtn=document.getElementById('deleteGenreBtn');
  if(addBtn){
    addBtn.onclick=async()=>{
      if(!requirePassword('장르 추가 비밀번호를 입력하세요.')){ alert('비밀번호가 맞지 않습니다.'); return; }
      const key=cleanGenreKey(document.getElementById('newGenreKey').value);
      const ko=document.getElementById('newGenreKo').value.trim();
      const en=document.getElementById('newGenreEn').value.trim();
      if(!key || !ko || !en){ alert('Genre Key, 한글명, English를 모두 입력하세요.'); return; }
      if(genres.some(g=>g.key===key)){ alert('이미 있는 장르입니다.'); return; }
      const custom=readStore(STORAGE.customGenres,[]);
      custom.push({key,ko,en}); writeStore(STORAGE.customGenres,custom);
      document.getElementById('newGenreKey').value=''; document.getElementById('newGenreKo').value=''; document.getElementById('newGenreEn').value='';
      await init();
    };
  }
  if(deleteBtn){
    deleteBtn.onclick=async()=>{
      if(!deleteGenreSelect.value) return;
      if(!requirePassword('장르 삭제 비밀번호를 입력하세요.')){ alert('비밀번호가 맞지 않습니다.'); return; }
      const deleted=readStore(STORAGE.deletedGenres,[]);
      if(!deleted.includes(deleteGenreSelect.value)) deleted.push(deleteGenreSelect.value);
      writeStore(STORAGE.deletedGenres,deleted);
      await init();
    };
  }
}
async function init(){
  await loadGenreList();
  for(const {key} of genres){ data[key]=await loadGenre(key); }
  renderGenreCards(); renderGenreManager(); renderLibraries(); bindAudioSinglePlay();
}
updateVisitorCount();
bindGenreActions();
init();
