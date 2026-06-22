const genres = [
  {
    key: 'drama',
    number: '01',
    title: '드라마',
    subtitle: 'Drama',
    description: '잔잔한 피아노, 서정적인 스트링, 인물의 감정선을 따라가는 영화 음악.'
  },
  {
    key: 'thriller',
    number: '02',
    title: '스릴러',
    subtitle: 'Thriller',
    description: '차가운 질감과 반복되는 리듬, 서서히 압박하는 긴장감 중심의 스코어.'
  },
  {
    key: 'horror',
    number: '03',
    title: '공포',
    subtitle: 'Horror',
    description: '심리적 공기감, 노이즈, 공간감, 긴 침묵과 파열음을 설계하는 공포 음악.'
  },
  {
    key: 'action',
    number: '04',
    title: '액션',
    subtitle: 'Action',
    description: '하이브리드 오케스트라, 타악기, 베이스 중심의 추진력 있는 사운드.'
  },
  {
    key: 'romance',
    number: '05',
    title: '로맨스',
    subtitle: 'Romance',
    description: '따뜻한 멜로디, 기타와 피아노, 섬세한 감정의 거리감을 그리는 음악.'
  },
  {
    key: 'melo',
    number: '06',
    title: '멜로',
    subtitle: 'Melo',
    description: '절제된 여백과 서정성, 감정의 여운을 오래 남기는 장면 중심 스코어.'
  },
  {
    key: 'experimental',
    number: '07',
    title: '실험적인',
    subtitle: 'Experimental',
    description: '관습적인 형식에서 벗어나 사운드 디자인과 질감 중심으로 설계한 음악.'
  },
  {
    key: 'trailer',
    number: '08',
    title: '예고편',
    subtitle: 'Trailer',
    description: '빌드업, 드롭, 임팩트, 히트 포인트에 특화된 트레일러 음악.'
  }
];

const genreGrid = document.getElementById('genreGrid');
const managers = document.getElementById('genreManagers');
const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();

function createGenreSummary(genre){
  const article = document.createElement('article');
  article.className = 'genre-summary-card';
  article.innerHTML = `
    <div class="topline">
      <div>
        <span>${genre.number}</span>
        <strong>${genre.title}</strong>
        <div class="subtext">${genre.subtitle}</div>
      </div>
      <div class="slot-info">100 Upload Slots</div>
    </div>
    <p>${genre.description}</p>
    <a href="#manager-${genre.key}">업로드 스튜디오 열기 →</a>
  `;
  article.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    const card = document.getElementById(`manager-${genre.key}`);
    if (!card.classList.contains('open')) card.classList.add('open');
    card.scrollIntoView({behavior:'smooth', block:'start'});
  });
  return article;
}

function createSlot(genre, index){
  const slot = document.createElement('div');
  slot.className = 'track-slot';
  const titleId = `${genre.key}-title-${index}`;
  const fileId = `${genre.key}-file-${index}`;
  const audioId = `${genre.key}-audio-${index}`;
  const nameId = `${genre.key}-name-${index}`;

  slot.innerHTML = `
    <div class="track-number">
      <strong>#${String(index).padStart(2,'0')}</strong>
      <small>${genre.subtitle}</small>
    </div>
    <div>
      <label for="${titleId}">Track Title</label>
      <input type="text" id="${titleId}" placeholder="예: Main Theme ${index}" />
    </div>
    <div>
      <label for="${fileId}">Audio Upload</label>
      <input type="file" id="${fileId}" accept="audio/*" />
      <small id="${nameId}" style="display:block;margin-top:8px;color:#8d8d8d;word-break:break-all;">선택된 파일 없음</small>
    </div>
    <div class="audio-wrap">
      <label>Preview</label>
      <audio id="${audioId}" controls preload="none"></audio>
    </div>
    <div class="track-action">
      <button type="button" class="clear-btn">Clear</button>
    </div>
  `;

  const fileInput = slot.querySelector(`#${CSS.escape(fileId)}`);
  const audio = slot.querySelector(`#${CSS.escape(audioId)}`);
  const fileLabel = slot.querySelector(`#${CSS.escape(nameId)}`);
  const clearBtn = slot.querySelector('.clear-btn');
  let objectUrl = null;

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;
    audio.load();
    fileLabel.textContent = `선택된 파일: ${file.name}`;
  });

  clearBtn.addEventListener('click', () => {
    fileInput.value = '';
    slot.querySelector(`#${CSS.escape(titleId)}`).value = '';
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    fileLabel.textContent = '선택된 파일 없음';
  });

  return slot;
}

function createManagerCard(genre){
  const wrapper = document.createElement('section');
  wrapper.className = 'manager-card';
  wrapper.id = `manager-${genre.key}`;
  wrapper.innerHTML = `
    <button type="button" class="manager-header" aria-expanded="false">
      <div class="manager-title-wrap">
        <strong>${genre.number}. ${genre.title} <small style="font-size:.5em;color:#9d9d9d;font-weight:600;">${genre.subtitle}</small></strong>
        <span>${genre.description}</span>
      </div>
      <div class="manager-meta">
        <span class="meta-pill">100 TRACKS</span>
        <span class="meta-pill">BLACK & WHITE UI</span>
        <span class="arrow">⌄</span>
      </div>
    </button>
    <div class="manager-body">
      <div class="upload-toolbar">
        <div class="toolbar-note">${genre.title} 장르 전용 업로드 슬롯 100개입니다. 원하는 만큼 사용하고, 파일은 브라우저에서 바로 미리듣기 할 수 있습니다.</div>
      </div>
      <div class="slot-list"></div>
    </div>
  `;

  const header = wrapper.querySelector('.manager-header');
  const body = wrapper.querySelector('.manager-body');
  const slotList = wrapper.querySelector('.slot-list');
  let rendered = false;

  header.addEventListener('click', () => {
    const isOpen = wrapper.classList.toggle('open');
    header.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && !rendered) {
      const frag = document.createDocumentFragment();
      for (let i = 1; i <= 100; i += 1) {
        frag.appendChild(createSlot(genre, i));
      }
      slotList.appendChild(frag);
      rendered = true;
    }
  });

  return wrapper;
}

genres.forEach((genre) => {
  genreGrid.appendChild(createGenreSummary(genre));
  managers.appendChild(createManagerCard(genre));
});
