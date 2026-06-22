# R.TIO.712 Film Composer Website - Server Ready

이 폴더는 서버에 바로 업로드 가능한 정적 웹사이트입니다.

## 업로드할 파일

서버 또는 GitHub 저장소의 가장 바깥 위치에 아래 파일들이 있어야 합니다.

```text
index.html
style.css
script.js
assets/images/logo.svg
assets/images/favicon.svg
assets/images/og-cover.svg
assets/audio/
```

## 음악 파일 업로드 방법

각 장르별 MP3 파일을 아래 이름으로 저장해서 `assets/audio` 폴더에 넣어 주세요.

```text
assets/audio/drama.mp3
assets/audio/thriller.mp3
assets/audio/horror.mp3
assets/audio/action.mp3
assets/audio/romance.mp3
assets/audio/melo.mp3
assets/audio/experimental.mp3
assets/audio/trailer.mp3
```

그 후 GitHub에 다시 업로드하면 사이트에서 각 장르별 오디오 플레이어가 재생됩니다.

## 브라우저에서 음악 파일 선택 기능

사이트 화면에서 각 장르 카드의 `음악 파일 선택 / Upload Audio` 버튼을 누르면, 내 컴퓨터의 MP3 파일을 임시로 미리듣기 할 수 있습니다.

주의: 이 기능은 방문자의 브라우저에서만 임시로 재생됩니다. 모든 방문자에게 고정으로 들리게 하려면 MP3 파일을 `assets/audio` 폴더에 직접 업로드해야 합니다.

## Contact 정보

- Email: a0712345@naver.com
- China: +86 135 6014 4677
- Korea: +82 10 5146 7712
- WeChat: pstefan712
- Kakao: 712pstefan

## GitHub Pages 배포

1. GitHub 저장소에 위 파일들을 업로드합니다.
2. `Settings -> Pages`로 이동합니다.
3. `Source: Deploy from a branch`를 선택합니다.
4. `Branch: main`, `Folder: / root`를 선택합니다.
5. Save 후 1~5분 기다립니다.

