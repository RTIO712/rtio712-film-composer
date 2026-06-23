# R.TIO.712 Film Composer Website - Firebase Global Counter Version

이 버전은 기존 사이트 디자인과 MP3 자동 목록 방식을 유지하면서 Firebase Cloud Firestore를 연결한 버전입니다.

## 추가 기능

- 전체 방문자 누적 수를 Firebase에 저장
- 각 음원별 전체 재생 누적 수를 Firebase에 저장
- 모든 방문자가 같은 누적 숫자를 확인
- 다른 음원을 재생하면 이전 음원이 자동 정지
- 다운로드 비밀번호: 0712

## 업로드 방법

ZIP 파일을 그대로 올리지 말고 압축을 푼 뒤 아래 파일과 폴더를 GitHub 저장소 최상단에 올리세요.

- index.html
- style.css
- script.js
- README_DEPLOY_KR.md
- assets

## Firebase Rules

Firestore Database > 규칙에 아래 규칙이 있어야 카운터가 작동합니다.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /stats/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 음악 추가 방법

예: 드라마 장르

1. `assets/audio/drama` 폴더에 MP3 파일 업로드
2. `assets/audio/drama/tracks.json` 수정

```json
[
  { "title": "Main Theme", "file": "main-theme.mp3" }
]
```

MP3 파일명은 영어 소문자, 숫자, 하이픈 사용을 추천합니다.
