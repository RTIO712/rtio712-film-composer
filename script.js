const genreConfig = [
  { key: 'drama', title: '드라마', en: 'Drama' },{ key: 'thriller', title: '스릴러', en: 'Thriller' },{ key: 'horror', title: '공포', en: 'Horror' },{ key: 'action', title: '액션', en: 'Action' },{ key: 'romance', title: '로맨스', en: 'Romance' },{ key: 'melo', title: '멜로', en: 'Melo' },{ key: 'experimental', title: '실험적인', en: 'Experimental' },{ key: 'trailer', title: '예고편', en: 'Trailer' }
];
const PASSWORD = '0712';
const DB_NAME = 'rtio712_film_score_db';
const STORE_NAME = 'tracks';
const MAX_PER_GENRE = 50;
const state = { activeGenre: 'drama', tracks: [] };
const genreSelect = document.getElementById('genreSelect');
const trackTitle = document.getElementById('trackTitle');
const audioFile = document.getElementById('audioFile');
const addTrackBtn = document.getElementById('addTrackBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const statusInline = document.getElementById('statusInline');
const genreCards = document.getElementById('genreCards');
const allGenreLists = document.getElementById('allGenreLists');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
function requestPassword(actionText){ return prompt(`${actionText}\n비밀번호를 입력하세요.`) === PASSWORD; }
function openDB(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME,1);
    req.onupgradeneeded = () => { const db = req.result; if(!db.objectStoreNames.contains(STORE_NAME)){ const store = db.createObjectStore(STORE_NAME,{keyPath:'id'}); store.createIndex('genre','genre',{unique:false}); store.createIndex('createdAt','createdAt',{unique:false}); } };
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
}
async function dbAction(mode, callback){ const db = await openDB(); return new Promise((resolve,reject)=>{ const tx = db.transaction(STORE_NAME,mode); const store = tx.objectStore(STORE_NAME); const result = callback(store); tx.oncomplete = () => resolve(result); tx.onerror = () => reject(tx.error); }); }
async function loadTracks(){ const db = await openDB(); return new Promise((resolve,reject)=>{ const tx = db.transaction(STORE_NAME,'readonly'); const req = tx.objectStore(STORE_NAME).getAll(); req.onsuccess = () => resolve(req.result || []); req.onerror = () => reject(req.error); }); }
async function addTrack(track){ return dbAction('readwrite', store => store.put(track)); }
async function deleteTrackById(id){ return dbAction('readwrite', store => store.delete(id)); }
async function clearTracks(){ return dbAction('readwrite', store => store.clear()); }
function getGenreMeta(key){ return genreConfig.find(g=>g.key===key) || genreConfig[0]; }
function escapeHtml(value){ return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;'); }
function objectUrl(track){ return track.blob ? URL.createObjectURL(track.blob) : ''; }
function ensureGenreOptions(){ genreConfig.forEach(g=>{ const option=document.createElement('option'); option.value=g.key; option.textContent=`${g.title} / ${g.en}`; genreSelect.appendChild(option); }); }
function byGenre(key){ return state.tracks.filter(t=>t.genre===key).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)); }
function latestTrackForGenre(key){ return byGenre(key)[0] || null; }
function renderStatus(){ statusInline.innerHTML=''; genreConfig.forEach(g=>{ const count=byGenre(g.key).length; const chip=document.createElement('div'); chip.className='status-chip'; chip.innerHTML=`<strong>${g.title}</strong><span>${count} / ${MAX_PER_GENRE}</span>`; statusInline.appendChild(chip); }); }
function renderGenreCards(){
  genreCards.innerHTML='';
  genreConfig.forEach(g=>{
    const latest = latestTrackForGenre(g.key); const count=byGenre(g.key).length; const card=document.createElement('article');
    card.className=`genre-card${state.activeGenre===g.key?' active':''}`;
    const audioHtml = latest && latest.blob ? `<audio controls preload="none" src="${objectUrl(latest)}"></audio>` : '';
    card.innerHTML=`<div class="genre-top"><div><div class="genre-title">${g.title}</div><span class="genre-sub">${g.en}</span></div><div class="genre-count">${count} / ${MAX_PER_GENRE}</div></div><div class="latest-wrap"><span class="latest-label">Latest Upload</span>${latest?`<div class="latest-title">${escapeHtml(latest.title)}</div><div class="latest-file">${escapeHtml(latest.fileName)}</div>${audioHtml}`:`<div class="genre-empty">아직 업로드된 트랙이 없습니다.<br>Upload Studio에서 첫 번째 트랙을 추가해 주세요.</div>`}</div>`;
    card.addEventListener('click',()=>{ state.activeGenre=g.key; renderAll(); document.getElementById('all-tracks').scrollIntoView({behavior:'smooth'}); });
    genreCards.appendChild(card);
  });
}
function downloadTrack(track){
  if(!requestPassword('음원을 다운로드하려면')){ alert('비밀번호가 올바르지 않습니다.'); return; }
  const url = objectUrl(track); const a=document.createElement('a'); a.href=url; a.download=track.fileName || `${track.title || 'rtio712-track'}.mp3`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function removeTrack(track){
  if(!requestPassword('음원을 삭제하려면')){ alert('비밀번호가 올바르지 않습니다.'); return; }
  await deleteTrackById(track.id); state.tracks = await loadTracks(); renderAll();
}
function renderAllGenreLists(){
  allGenreLists.innerHTML='';
  genreConfig.forEach(g=>{
    const list = byGenre(g.key); const block=document.createElement('section'); block.className='all-genre-block';
    block.innerHTML=`<div class="all-genre-head"><div><p class="eyebrow">${g.en}</p><h3>${g.title}</h3></div><span>${list.length} / ${MAX_PER_GENRE} Tracks</span></div><div class="track-list"></div>`;
    const listNode=block.querySelector('.track-list');
    if(!list.length){ const empty=document.createElement('div'); empty.className='empty-banner'; empty.textContent='아직 업로드된 음악이 없습니다.'; listNode.appendChild(empty); }
    list.forEach((track,index)=>{
      const row=document.createElement('article'); row.className='track-row'; const url = objectUrl(track);
      row.innerHTML=`<div class="slot">Track ${String(index+1).padStart(2,'0')}</div><div class="title">${escapeHtml(track.title)}</div><div class="file">${escapeHtml(track.fileName)}</div><div>${url?`<audio controls preload="none" src="${url}"></audio>`:''}</div><div class="button-row"><button type="button" class="btn btn-light download-btn">다운로드</button><button type="button" class="btn delete-btn">삭제</button></div>`;
      row.querySelector('.download-btn').addEventListener('click',()=>downloadTrack(track));
      row.querySelector('.delete-btn').addEventListener('click',()=>removeTrack(track));
      listNode.appendChild(row);
    });
    allGenreLists.appendChild(block);
  });
}
function renderAll(){ renderStatus(); renderGenreCards(); renderAllGenreLists(); }
addTrackBtn.addEventListener('click', async()=>{
  const genre=genreSelect.value; const title=trackTitle.value.trim(); const file=audioFile.files && audioFile.files[0];
  if(!genre) return alert('장르를 선택해 주세요.'); if(!title) return alert('트랙 제목을 입력해 주세요.'); if(!file) return alert('오디오 파일을 선택해 주세요.');
  if(byGenre(genre).length>=MAX_PER_GENRE) return alert('이 장르에는 최대 50개까지만 업로드할 수 있습니다.');
  await addTrack({id:`${Date.now()}_${Math.random().toString(16).slice(2)}`, genre, title, fileName:file.name, type:file.type, blob:file, createdAt:Date.now()});
  state.tracks=await loadTracks(); state.activeGenre=genre; trackTitle.value=''; audioFile.value=''; renderAll(); document.getElementById('genre-library').scrollIntoView({behavior:'smooth'});
});
clearAllBtn.addEventListener('click', async()=>{ if(!requestPassword('전체 업로드 데이터를 초기화하려면')){ alert('비밀번호가 올바르지 않습니다.'); return; } if(!confirm('전체 업로드 데이터를 모두 삭제하시겠습니까?')) return; await clearTracks(); state.tracks=[]; renderAll(); });
async function init(){ ensureGenreOptions(); state.tracks = await loadTracks(); renderAll(); }
init().catch(err=>{ console.error(err); alert('브라우저 저장소를 열 수 없습니다. 다른 브라우저 또는 HTTPS 주소에서 다시 시도해 주세요.'); });
