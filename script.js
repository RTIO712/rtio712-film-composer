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
const firebaseConfig = {
  apiKey: "AIzaSyDUeaGPqlORwjxenFslfgj4O3ZXUa6coLs",
  authDomain: "rtio712-film-composer.firebaseapp.com",
  projectId: "rtio712-film-composer",
  storageBucket: "rtio712-film-composer.firebasestorage.app",
  messagingSenderId: "463866408311",
  appId: "1:463866408311:web:0d0e1fb44af94b880f4572"
};
let db = null;
let firebaseReady = false;
let siteVisitUnsub = null;
let playCountUnsubs = [];
try {
  if (window.firebase && firebaseConfig && firebaseConfig.projectId) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    firebaseReady = true;
  }
} catch (error) {
  console.warn('Firebase connection failed. Local fallback is active.', error);
}
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
function firestoreTrackDocId(genre,file){return encodeURIComponent(trackId(genre,file)).replaceAll('.','%2E')}
function getPlayCounts(){return readStore(STORAGE.playCounts,{})}
function getLocalPlayCount(genre,file){return Number(getPlayCounts()[trackId(genre,file)]||0)}
function setLocalPlayCount(genre,file,count){const counts=getPlayCounts(); counts[trackId(genre,file)]=Number(count||0); writeStore(STORAGE.playCounts,counts)}
function incrementLocalPlayCount(genre,file){const counts=getPlayCounts(); const id=trackId(genre,file); counts[id]=Number(counts[id]||0)+1; writeStore(STORAGE.playCounts,counts); return counts[id]}
function requirePassword(message){const input=prompt(message||'비밀번호를 입력하세요.'); return input===PASSWORD}

function setVisitorDisplay(value){
  const node = document.getElementById('visitorCount');
  if(node) node.textContent = Number(value||0).toLocaleString();
}
function startVisitorRealtime(){
  if(!(firebaseReady && db)) return false;
  try{
    if(siteVisitUnsub) siteVisitUnsub();
    siteVisitUnsub = db.collection('stats').doc('site').onSnapshot((snap)=>{
      const total = snap.exists ? Number(snap.data().visits||0) : 0;
      setVisitorDisplay(total);
    }, (error)=>{
      console.warn('Firebase realtime visitor listener failed.', error);
    });
    return true;
  }catch(error){
    console.warn('Firebase realtime visitor listener setup failed.', error);
    return false;
  }
}
async function updateVisitorCount(){
  if(firebaseReady && db){
    const live = startVisitorRealtime();
    try{
      const ref = db.collection('stats').doc('site');
      await db.runTransaction(async tx=>{
        const snap = await tx.get(ref);
        const current = snap.exists ? Number(snap.data().visits||0) : 0;
        tx.set(ref,{visits: current + 1, updatedAt: firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      });
      return;
    }catch(error){
      console.warn('Firebase visitor count failed. Local fallback is active.', error);
      if(live && siteVisitUnsub){ siteVisitUnsub(); siteVisitUnsub = null; }
    }
  }
  const current = Number(localStorage.getItem(STORAGE.visits)||0) + 1;
  localStorage.setItem(STORAGE.visits,String(current));
  setVisitorDisplay(current);
}
async function getRemotePlayCount(genre,file){
  if(!(firebaseReady && db)) return getLocalPlayCount(genre,file);
  try{
    const doc = await db.collection('stats').doc('plays').collection('tracks').doc(firestoreTrackDocId(genre,file)).get();
    const count = doc.exists ? Number(doc.data().count||0) : 0;
    setLocalPlayCount(genre,file,count);
    return count;
  }catch(error){
    console.warn('Firebase play count read failed.', error);
    return getLocalPlayCount(genre,file);
  }
}
async function incrementPlayCount(genre,file){
  if(firebaseReady && db){
    try{
      const ref = db.collection('stats').doc('plays').collection('tracks').doc(firestoreTrackDocId(genre,file));
      await db.runTransaction(async tx=>{
        const snap = await tx.get(ref);
        const current = snap.exists ? Number(snap.data().count||0) : 0;
        tx.set(ref,{count: current + 1, genre, file, trackId: trackId(genre,file), updatedAt: firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      });
      return null;
    }catch(error){
      console.warn('Firebase play count write failed. Local fallback is active.', error);
    }
  }
  return incrementLocalPlayCount(genre,file);
}
function stopPlayCountRealtime(){
  playCountUnsubs.forEach(unsub=>{ try{unsub();}catch(e){} });
  playCountUnsubs = [];
}
function startPlayCountRealtime(){
  stopPlayCountRealtime();
  if(!(firebaseReady && db)) return false;
  try{
    genres.forEach(({key})=>{
      (data[key]||[]).map(normalizeTrack).forEach(t=>{
        const ref = db.collection('stats').doc('plays').collection('tracks').doc(firestoreTrackDocId(key,t.file));
        const unsub = ref.onSnapshot((snap)=>{
          const count = snap.exists ? Number(snap.data().count||0) : 0;
          setLocalPlayCount(key,t.file,count);
          updateCountLabels(key,t.file,count);
        }, (error)=>{
          console.warn('Firebase realtime play listener failed.', error);
        });
        playCountUnsubs.push(unsub);
      });
    });
    return true;
  }catch(error){
    console.warn('Firebase realtime play listener setup failed.', error);
    return false;
  }
}
async function syncAllPlayCounts(){
  const live = startPlayCountRealtime();
  if(live) return;
  const jobs=[];
  genres.forEach(({key})=>{
    (data[key]||[]).map(normalizeTrack).forEach(t=>jobs.push(getRemotePlayCount(key,t.file).then(count=>updateCountLabels(key,t.file,count))));
  });
  await Promise.allSettled(jobs);
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
    card.innerHTML=`<h3>${esc(ko)}</h3><small>${esc(en)}</small><span class="genre-count">${list.length} / 50 Tracks</span><div class="latest">${latest?`<b>${esc(latest.title)}</b><span>${esc(latest.file)}</span><audio controls preload="none" data-genre="${esc(key)}" data-file="${esc(latest.file)}" src="${audioPath(key,latest.file)}"></audio><div class="play-stat">REALTIME PLAY <strong data-count-for="${esc(trackId(key,latest.file))}">${getLocalPlayCount(key,latest.file)}</strong></div>`:`<div class="empty">아직 등록된 MP3가 없습니다.<br>GitHub에 MP3와 tracks.json을 올려주세요.</div>`}</div>`;
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
    list.forEach((t,i)=>{ const url=audioPath(key,t.file); html += `<div class="track-row"><div class="no">#${String(i+1).padStart(2,'0')}</div><div class="title">${esc(t.title)}<div class="play-stat">REALTIME PLAY <strong data-count-for="${esc(trackId(key,t.file))}">${getLocalPlayCount(key,t.file)}</strong></div></div><div class="file">${esc(t.file)}</div><audio controls preload="none" data-genre="${esc(key)}" data-file="${esc(t.file)}" src="${url}"></audio><button class="btn-download" data-url="${esc(url)}" data-file="${esc(t.file)}">Download</button></div>`; });
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
    if(audio.dataset.boundSinglePlay === '1') return;
    audio.dataset.boundSinglePlay = '1';
    audio.addEventListener('play', async ()=>{
      document.querySelectorAll('audio').forEach(other=>{
        if(other!==audio){
          other.pause();
          try{ other.currentTime = 0; }catch(e){}
        }
      });
      const genre=audio.dataset.genre; const file=audio.dataset.file;
      if(genre && file){
        const localFallbackCount=await incrementPlayCount(genre,file);
        if(localFallbackCount !== null) updateCountLabels(genre,file,localFallbackCount);
      }
    }, {once:false});
  });
}
function updateCountLabels(genre,file,count){
  const id = trackId(genre,file);
  document.querySelectorAll(`[data-count-for="${CSS.escape(id)}"]`).forEach(node=>{ node.textContent=Number(count||0).toLocaleString(); });
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
  renderGenreCards(); renderGenreManager(); renderLibraries(); bindAudioSinglePlay(); await syncAllPlayCounts();
}
updateVisitorCount();
bindGenreActions();
init();
