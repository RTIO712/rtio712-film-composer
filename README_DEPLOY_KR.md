# R.TIO.712 Film Composer Website - Firebase Realtime Counter Version

이 버전은 기존 사이트 디자인과 구조를 유지하면서 Firebase 실시간 카운터 기능을 추가한 버전입니다.

## 추가된 기능

1. 방문자 수 실시간 표시
2. 음원별 재생 수 실시간 표시
3. 새로고침 없이 숫자 자동 갱신
4. 한 곡 재생 시 이전 곡 자동 정지 및 처음 위치로 이동
5. 기존 장르/음원/다운로드 기능 유지

## GitHub Pages 업로드 방법

ZIP 파일을 그대로 올리지 말고 압축을 푼 뒤 아래 파일들을 저장소 최상단에 업로드하세요.

- index.html
- style.css
- script.js
- README_DEPLOY_KR.md
- assets

## Firebase Firestore 규칙

Firebase 콘솔에서 Firestore > 규칙에 아래 내용을 적용해야 작동합니다.

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

## MP3 추가 방법

예: 드라마 장르

1. `assets/audio/drama/main-theme.mp3` 업로드
2. `assets/audio/drama/tracks.json` 수정

```json
[
  { "title": "Main Theme", "file": "main-theme.mp3" }
]
```

## 다운로드 비밀번호

다운로드 비밀번호는 0712입니다.
