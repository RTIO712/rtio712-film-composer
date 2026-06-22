# R.TIO.712 GitHub MP3 Auto List 안정 버전

## 핵심 방식
웹사이트에서 직접 업로드하지 않습니다. GitHub 저장소에 MP3 파일과 tracks.json 목록을 올리면 웹사이트가 자동으로 장르별 목록을 보여줍니다.

## 장르별 폴더
- assets/audio/drama
- assets/audio/thriller
- assets/audio/horror
- assets/audio/action
- assets/audio/romance
- assets/audio/melo
- assets/audio/experimental
- assets/audio/trailer

## 각 폴더 안에 필요한 파일
1. MP3 파일
2. tracks.json

예: assets/audio/drama/tracks.json
[
  { "title": "Main Theme", "file": "main-theme.mp3" },
  { "title": "Quiet Memory", "file": "quiet-memory.mp3" }
]

## 중요
- tracks.json에 적은 파일명과 실제 MP3 파일명이 정확히 같아야 합니다.
- 장르별 최대 50개까지만 표시됩니다.
- 다운로드 비밀번호는 0712입니다.
- 삭제는 웹사이트에서 하는 것이 아니라 GitHub 저장소에서 MP3와 tracks.json 항목을 삭제하면 됩니다.

## GitHub Pages 업로드
index.html, style.css, script.js, README_DEPLOY_KR.md, assets 폴더를 저장소 최상단에 업로드하세요.
