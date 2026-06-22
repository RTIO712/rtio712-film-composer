const genreConfig = [
  { key: 'drama', title: '드라마', en: 'Drama' },
  { key: 'thriller', title: '스릴러', en: 'Thriller' },
  { key: 'horror', title: '공포', en: 'Horror' },
  { key: 'action', title: '액션', en: 'Action' },
  { key: 'romance', title: '로맨스', en: 'Romance' },
  { key: 'melo', title: '멜로', en: 'Melo' },
  { key: 'experimental', title: '실험적인', en: 'Experimental' },
  { key: 'trailer', title: '예고편', en: 'Trailer' }
];

const PASSWORD = '0712';
const STORAGE_KEY = 'rtio712_final_portfolio_v2_password_0712';
const MAX_PER_GENRE = 50;

const state = {
  activeGenre: 'drama',
  tracks: loadTracks()
};

const genreSelect = document.getElementById('genreSelect');
const trackTitle = document.getElementById('trackTitle');
const audioFile = document.getElementById('audioFile');
const addTrackBtn = document.getElementById('addTrackBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const statusInline = document.getElementById('statusInline');
const genreCards = document.getElementById('genreCards');
const bannerList = document.getElementById('bannerList');
const activeGenreLabel = document.getElementById('activeGenreLabel');
const activeGenreTitle = document.getElementById('activeGenreTitle');
const activeGenreCount = document.getElementById('activeGenreCount');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function requestPassword(actionText){
  const input = prompt(`${actionText}\n비밀번호를 입력하세요.`);
  return input === PASSWORD;
}

function loadTracks(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}
function saveTracks(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tracks)); }
function getGenreMeta(key){ return genreConfig.find(g => g.key === key) || genreConfig[0]; }
function ensureGenreOptions(){
  genreConfig.forEach((g) => {
    const option = document.createElement('option');
    option.value = g.key;
    option.textContent = `${g.title} / ${g.en}`;
    genreSelect.appendChild(option);
  });
}
function escapeHtml(value){
  return String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function fileToDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function latestTrackForGenre(key){
  const list = state.tracks[key] || [];
  if (!list.length) return null;
  return [...list].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
}
function renderStatusInline(){
  statusInline.innerHTML = '';
  genreConfig.forEach((genre) => {
    const count = (state.tracks[genre.key] || []).length;
    const chip = document.createElement('div');
    chip.className = 'status-chip';
    chip.innerHTML = `<strong>${genre.title}</strong><span>${count} / ${MAX_PER_GENRE}</span>`;
    statusInline.appendChild(chip);
  });
}
function renderGenreCards(){
  genreCards.innerHTML = '';
  genreConfig.forEach((genre) => {
    const latest = latestTrackForGenre(genre.key);
    const count = (state.tracks[genre.key] || []).length;
    const card = document.createElement('article');
    card.className = `genre-card${state.activeGenre === genre.key ? ' active' : ''}`;
    let inner = `
      <div class="genre-top">
        <div>
          <div class="genre-title">${genre.title}</div>
          <span class="genre-sub">${genre.en}</span>
        </div>
        <div class="genre-count">${count} / ${MAX_PER_GENRE}</div>
      </div>
      <div class="latest-wrap">
        <span class="latest-label">Latest Upload</span>
    `;
    if (latest) {
      inner += `
        <div class="latest-title">${escapeHtml(latest.title || 'Untitled Track')}</div>
        <div class="latest-file">${escapeHtml(latest.fileName || '')}</div>
        <audio controls preload="none" src="${latest.dataUrl || ''}"></audio>
        <div class="protected-note">Download Password: 0712</div>
      `;
    } else {
      inner += `<div class="genre-empty">아직 업로드된 트랙이 없습니다.<br />Upload Studio에서 첫 번째 트랙을 추가해 주세요.</div>`;
    }
    inner += `</div>`;
    card.innerHTML = inner;
    card.addEventListener('click', () => {
      state.activeGenre = genre.key;
      renderAll();
      document.querySelector('.genre-view-shell').scrollIntoView({behavior:'smooth', block:'start'});
    });
    genreCards.appendChild(card);
  });
}
function downloadTrack(track){
  if (!requestPassword('음원을 다운로드하려면')) {
    alert('비밀번호가 올바르지 않습니다.');
    return;
  }
  if (!track.dataUrl) {
    alert('다운로드할 파일 데이터가 없습니다.');
    return;
  }
  const a = document.createElement('a');
  a.href = track.dataUrl;
  a.download = track.fileName || `${track.title || 'rtio712-track'}.mp3`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
function deleteTrack(track){
  if (!requestPassword('음원을 삭제하려면')) {
    alert('비밀번호가 올바르지 않습니다.');
    return;
  }
  const origin = state.tracks[state.activeGenre] || [];
  const targetIdx = origin.findIndex(item => item.createdAt === track.createdAt && item.fileName === track.fileName && item.title === track.title);
  if (targetIdx > -1) origin.splice(targetIdx, 1);
  state.tracks[state.activeGenre] = origin;
  saveTracks();
  renderAll();
}
function renderBannerList(){
  const meta = getGenreMeta(state.activeGenre);
  const list = state.tracks[state.activeGenre] || [];
  activeGenreLabel.textContent = `${meta.title} / ${meta.en}`;
  activeGenreTitle.textContent = `${meta.title} 장르 트랙 라이브러리`;
  activeGenreCount.textContent = `${list.length} / ${MAX_PER_GENRE} Tracks`;
  bannerList.innerHTML = '';
  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-banner';
    empty.innerHTML = `${meta.title} 장르에는 아직 업로드된 파일이 없습니다.<br />상단 Upload Studio에서 파일을 추가해 주세요.`;
    bannerList.appendChild(empty);
    return;
  }
  const sorted = [...list].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
  sorted.forEach((track, index) => {
    const row = document.createElement('article');
    row.className = 'banner-item';
    row.innerHTML = `
      <div class="slot">Track ${String(index + 1).padStart(2,'0')}</div>
      <div class="title">${escapeHtml(track.title || 'Untitled Track')}</div>
      <div class="file">${escapeHtml(track.fileName || 'No file')}</div>
      <div>${track.dataUrl ? `<audio controls preload="none" src="${track.dataUrl}"></audio>` : ''}</div>
      <div class="button-row"><button type="button" class="btn btn-light download-btn">다운로드</button><button type="button" class="btn btn-light delete-btn">삭제</button></div>
    `;
    row.querySelector('.download-btn').addEventListener('click', (event) => { event.stopPropagation(); downloadTrack(track); });
    row.querySelector('.delete-btn').addEventListener('click', (event) => { event.stopPropagation(); deleteTrack(track); });
    bannerList.appendChild(row);
  });
}
function renderAll(){ renderStatusInline(); renderGenreCards(); renderBannerList(); }

addTrackBtn.addEventListener('click', async () => {
  const genre = genreSelect.value;
  const title = trackTitle.value.trim();
  const file = audioFile.files && audioFile.files[0];
  if (!genre) return alert('장르를 선택해 주세요.');
  if (!title) return alert('트랙 제목을 입력해 주세요.');
  if (!file) return alert('오디오 파일을 선택해 주세요.');
  const list = state.tracks[genre] || [];
  if (list.length >= MAX_PER_GENRE) return alert('이 장르에는 최대 50개까지만 업로드할 수 있습니다.');
  const dataUrl = await fileToDataURL(file);
  list.push({ title, fileName:file.name, type:file.type, dataUrl, createdAt:Date.now() });
  state.tracks[genre] = list;
  state.activeGenre = genre;
  saveTracks();
  trackTitle.value = '';
  audioFile.value = '';
  renderAll();
  document.getElementById('genre-library').scrollIntoView({behavior:'smooth', block:'start'});
});

clearAllBtn.addEventListener('click', () => {
  if (!requestPassword('전체 업로드 데이터를 초기화하려면')) {
    alert('비밀번호가 올바르지 않습니다.');
    return;
  }
  if (!confirm('전체 업로드 데이터를 모두 삭제하시겠습니까?')) return;
  state.tracks = {};
  saveTracks();
  renderAll();
});

ensureGenreOptions();
renderAll();
