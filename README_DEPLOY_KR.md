# R.TIO.712 Film Composer 웹사이트 업로드 방법

이 폴더는 서버에 그대로 업로드 가능한 정적 웹사이트입니다.

## 폴더 구조

```text
index.html
style.css
script.js
assets/
  images/
    logo.svg
    favicon.svg
    og-cover.svg
  audio/
    여기에 mp3 파일 추가
```

## 일반 웹호스팅에 업로드

1. 호스팅 관리자 페이지에 접속합니다.
2. `public_html`, `www`, `htdocs` 같은 웹 루트 폴더를 엽니다.
3. 이 폴더 안의 파일 전체를 업로드합니다.
4. 반드시 `index.html`이 웹 루트 바로 아래에 있어야 합니다.

올바른 구조:

```text
public_html/index.html
public_html/style.css
public_html/script.js
public_html/assets/images/logo.svg
```

잘못된 구조:

```text
public_html/RTIO712_Film_Composer_Website/index.html
```

## Alibaba OSS / Tencent COS / S3 같은 Object Storage

1. 버킷을 만듭니다.
2. 정적 웹사이트 호스팅을 켭니다.
3. 기본 문서를 `index.html`로 설정합니다.
4. 이 폴더 안의 파일 전체를 업로드합니다.
5. 권한은 Public Read만 사용합니다.

## 음악 파일 교체

`assets/audio/` 폴더에 mp3 파일을 넣고 `index.html`에서 아래 부분을 수정하세요.

```html
<source src="assets/audio/drama-demo.mp3" type="audio/mpeg" />
```

예:

```html
<source src="assets/audio/my-film-score.mp3" type="audio/mpeg" />
```

## 연락처 수정

`index.html`에서 아래 부분을 실제 연락처로 바꾸세요.

```html
<a href="mailto:contact@example.com">contact@example.com</a>
<span>WeChat / KakaoTalk / Instagram ID</span>
```
