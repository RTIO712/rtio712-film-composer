# R.TIO.712 Film Composer Website - Luxe Black & White Upload Banner Version

## 주요 수정 사항
- 화이트 비중을 40% 이상 사용한 블랙 & 화이트 인터페이스
- 왼쪽 정렬과 중앙 정렬을 적절히 혼합한 구조
- 라인과 선 분할을 적극 활용한 고급스러운 UI
- Contact 박스 내부 오른쪽 정렬 적용
- 상단 전용 Upload Panel 추가
- 메인 Genre Library에서 장르를 클릭하면 업로드된 파일을 배너 형태로 확인 가능
- 장르별 최대 100개 업로드 가능

## 구성 파일
- index.html
- style.css
- script.js
- README_DEPLOY_KR.md
- assets/images/logo.svg
- assets/images/favicon.svg
- assets/images/og-cover.svg
- assets/audio/ (비어 있음)

## 업로드 방식 설명
이 버전은 상단 Upload Panel에서:
1. 장르 선택
2. 트랙 제목 입력
3. 오디오 파일 선택
4. "파일 업로드 추가" 클릭
순서로 파일을 추가합니다.

업로드된 파일은 브라우저 LocalStorage에 저장되며,
아래 Genre Library에서 장르별 배너 목록으로 보입니다.

## 중요한 주의사항
이 방식은 브라우저 기반 업로드 인터페이스입니다.
즉, 현재 브라우저 안에서만 데이터가 저장되고 재생됩니다.
다른 컴퓨터나 다른 브라우저에서 자동으로 동기화되지는 않습니다.

## 서버 업로드 방법
1. ZIP 압축을 풉니다.
2. 안의 파일 전체를 웹 서버의 public_html / www / htdocs 같은 루트 폴더에 업로드합니다.
3. 반드시 index.html이 가장 바깥에 위치해야 합니다.

## GitHub Pages 업로드 방법
1. GitHub 저장소를 엽니다.
2. index.html, style.css, script.js, README_DEPLOY_KR.md, assets 폴더를 업로드합니다.
3. Settings > Pages 에서 main / root 로 배포합니다.

## 연락처
- Email: a0712345@naver.com
- China: +86 135 6014 4677
- Korea: +82 10 5146 7712
- WeChat: pstefan712
- Kakao: 712pstefan
