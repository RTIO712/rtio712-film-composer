# R.TIO.712 Film Composer Website (Black & White / 100 Upload Slots)

## 구성 파일
- `index.html`
- `style.css`
- `script.js`
- `assets/images/logo.svg`
- `assets/images/favicon.svg`
- `assets/images/og-cover.svg`
- `assets/audio/` (비어 있음, 필요 시 MP3 업로드)

## 특징
- 시크한 블랙 & 화이트 인터페이스
- 장르 8개
  - 드라마
  - 스릴러
  - 공포
  - 액션
  - 로맨스
  - 멜로
  - 실험적인
  - 예고편
- 각 장르별 100개 업로드 슬롯 인터페이스
- 각 슬롯에서 제목 입력 가능
- 각 슬롯에서 오디오 파일 선택 후 브라우저 미리듣기 가능

## 서버 업로드 방법
1. ZIP 압축을 풉니다.
2. 폴더 안의 파일 전체를 서버의 `public_html`, `www`, `htdocs` 같은 웹 루트 폴더에 업로드합니다.
3. 반드시 `index.html`이 가장 바깥에 있어야 합니다.

### 올바른 업로드 예시
- `public_html/index.html`
- `public_html/style.css`
- `public_html/script.js`
- `public_html/assets/images/logo.svg`

### 잘못된 업로드 예시
- `public_html/RTIO712_Film_Composer_Website_BlackWhite_100Tracks/index.html`

## GitHub Pages 업로드 방법
1. GitHub 저장소를 엽니다.
2. `index.html`, `style.css`, `script.js`, `assets` 폴더를 업로드합니다.
3. `Settings > Pages`에서 `Deploy from a branch`, `main`, `/root`로 설정합니다.
4. 저장 후 1~5분 기다리면 사이트가 배포됩니다.

## 연락처 반영 내용
- Email: `a0712345@naver.com`
- China: `+86 135 6014 4677`
- Korea: `+82 10 5146 7712`
- WeChat: `pstefan712`
- Kakao: `712pstefan`

## 업로드 슬롯 관련 주의사항
이 사이트의 업로드 슬롯은 브라우저 인터페이스입니다.
즉, 사용자가 파일을 선택하면 해당 브라우저 안에서만 미리듣기가 됩니다.
다른 방문자에게 같은 음악을 항상 들려주려면 실제 MP3 파일을 서버에 따로 업로드하고,
원하는 플레이어 소스를 연결하는 방식으로 확장해야 합니다.
