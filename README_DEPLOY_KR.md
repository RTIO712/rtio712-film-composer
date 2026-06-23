# R.TIO.712 Film Composer Website - Fixed 10 Genres + Firebase Realtime Counter

이 버전은 기존 사이트 디자인과 기능을 유지하고, 장르 추가/삭제 관리 기능을 제거한 뒤 10개 고정 장르 카테고리로 정리한 버전입니다.

## 고정 장르 카테고리

1. 드라마/로맨스 -> assets/audio/drama-romance
2. 공포/서스펜스/스릴러 -> assets/audio/horror-suspense-thriller
3. 액션/범죄/느와르 -> assets/audio/action-crime-noir
4. 어드벤처 -> assets/audio/adventure
5. SF 공상과학/판타지 -> assets/audio/sf-fantasy
6. 코미디 -> assets/audio/comedy
7. 뮤지컬 -> assets/audio/musical
8. 다큐멘터리 -> assets/audio/documentary
9. 애니메이션 -> assets/audio/animation
10. 보컬 / 전체음악 -> assets/audio/vocal-all

## 음악 등록 방법

각 장르 폴더에 MP3 파일을 업로드하고 같은 폴더의 tracks.json에 제목과 파일명을 입력하세요.

예시:

```json
[
  { "title": "Main Theme", "file": "main-theme.mp3" }
]
```

파일명은 영어 소문자, 숫자, 하이픈(-) 조합을 권장합니다.

## Firebase 기능

- 전체 방문자 수 실시간 표시
- 음원별 재생 수 실시간 표시
- 다른 음원 재생 시 이전 음원 자동 정지

Firestore 규칙은 기존과 동일하게 stats 경로 읽기/쓰기가 가능해야 합니다.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /stats/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## GitHub 업로드

ZIP 파일을 그대로 올리지 말고 압축을 푼 뒤 아래 항목을 저장소 최상단에 업로드하세요.

- index.html
- style.css
- script.js
- README_DEPLOY_KR.md
- assets
