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

const STORAGE_KEY = 'rtio712_luxe_bw_uploads_v1';
const MAX_PER_GENRE = 100;

const genreSelect = document.getElementById('genreSelect');
const trackTitle = document.getElementById('trackTitle');
const audioFile = document.getElementById('audioFile');
const addTrackBtn = document.getElementById('addTrackBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const statusSummary = document.getElementById('statusSummary');
const genreTabs = document.getElementById('genreTabs');
const bannerList = document.getElementById('bannerList');
const activeGenreLabel = document.getElementById('activeGenreLabel');
const activeGenreTitle = document.getElementById('activeGenreTitle');
const activeGenreCount = document.getElementById('activeGenreCount');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const state = {
  activeGenre: 'drama',
  tracks: loadTracks()
};

function loadTracks(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : {};
  } catch (e) {
    return {};
  }
}

function saveTracks(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tracks));
}

function ensureGenreOptions(){
  genreConfig.forEach(g => {
    const option = document.createElement('option');
    option.value = g.key;
    option.textContent = `${g.title} / ${g.en}`;
    genreSelect.appendChild(option);
  });
}

function getGenreMeta(key){
  return genreConfig.find(g => g.key === key) || genreConfig[0];
}

function renderStatus(){
  statusSummary.innerHTML = '';
  genreConfig.forEach((genre) => {
    const count = (state.tracks[genre.key] || []).length;
    const row = document.createElement('div');
    row.className = 'status-item';
    row.innerHTML = `<strong>${genre.title} / ${genre.en}</strong><span>${count} / ${MAX_PER_GENRE}</span>`;
    statusSummary.appendChild(row);
  });
}

function renderGenreTabs(){
  genreTabs.innerHTML = '';
  genreConfig.forEach((genre) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `genre-tab${state.activeGenre === genre.key ? ' active' : ''}`;
    const count = (state.tracks[genre.key] || []).length;
    btn.innerHTML = `<strong>${genre.title}</strong><span class="sub">${genre.en} · ${count} Files</span>`;
    btn.addEventListener('click', () => {
      state.activeGenre = genre.key;
      renderGenreTabs();
      renderBannerList();
    });
    genreTabs.appendChild(btn);
  });
}

function createBanner(track, index){
  const banner = document.createElement('article');
  banner.className = 'banner-item';
  const audioMarkup = track.dataUrl
    ? `<audio controls preload="none" src="${track.dataUrl}"></audio>`
    : `<span class="file">오디오 데이터 없음</span>`;
  banner.innerHTML = `
    <div>
      <div class="slot">Track ${String(index + 1).padStart(2,'0')}</div>
      <div class="title">${escapeHtml(track.title || 'Untitled Track')}</div>
    </div>
    <div class="file">${escapeHtml(track.fileName || 'No file')}</div>
    <div>${audioMarkup}</div>
    <div><button class="btn btn-light delete-btn" type="button">삭제</button></div>
  `;
  banner.querySelector('.delete-btn').addEventListener('click', () => {
    const list = state.tracks[state.activeGenre] || [];
    list.splice(index, 1);
    state.tracks[state.activeGenre] = list;
    saveTracks();
    renderAll();
  });
  return banner;
}

function renderBannerList(){
  const meta = getGenreMeta(state.activeGenre);
  activeGenreLabel.textContent = `${meta.title} / ${meta.en}`;
  activeGenreTitle.textContent = `${meta.title} 장르 파일 목록`;
  const list = state.tracks[state.activeGenre] || [];
  activeGenreCount.textContent = `${list.length} Tracks`;
  bannerList.innerHTML = '';
  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-banner';
    empty.innerHTML = `${meta.title} 장르에는 아직 업로드된 파일이 없습니다.<br />상단 Upload Panel에서 파일을 추가해 주세요.`;
    bannerList.appendChild(empty);
    return;
  }
  list.forEach((track, index) => bannerList.appendChild(createBanner(track, index)));
}

function renderAll(){
  renderStatus();
  renderGenreTabs();
  renderBannerList();
}

function fileToDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value){
  return String(value)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

addTrackBtn.addEventListener('click', async () => {
  const genre = genreSelect.value;
  const title = trackTitle.value.trim();
  const file = audioFile.files && audioFile.files[0];

  if (!genre) {
    alert('장르를 선택해 주세요.');
    return;
  }
  if (!title) {
    alert('트랙 제목을 입력해 주세요.');
    return;
  }
  if (!file) {
    alert('오디오 파일을 선택해 주세요.');
    return;
  }

  const currentList = state.tracks[genre] || [];
  if (currentList.length >= MAX_PER_GENRE) {
    alert('이 장르에는 최대 100개까지만 업로드할 수 있습니다.');
    return;
  }

  const dataUrl = await fileToDataURL(file);
  currentList.push({
    title,
    fileName: file.name,
    type: file.type,
    dataUrl,
    createdAt: Date.now()
  });
  state.tracks[genre] = currentList;
  state.activeGenre = genre;
  saveTracks();
  trackTitle.value = '';
  audioFile.value = '';
  renderAll();
  document.getElementById('genre-library').scrollIntoView({behavior:'smooth',block:'start'});
});

clearAllBtn.addEventListener('click', () => {
  const ok = confirm('정말 전체 업로드 데이터를 모두 초기화하시겠습니까?');
  if (!ok) return;
  state.tracks = {};
  saveTracks();
  renderAll();
});

ensureGenreOptions();
renderAll();
