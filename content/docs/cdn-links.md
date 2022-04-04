---
id: cdn-links
title: קישורי CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

React ו-ReactDOM זמינים דרך הCDN.

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

הגרסאות המצוינות לעיל מתייחסות לפיתוח ולא מתאימות ל-production. גרסאות ממוזערות ומאופטמות של production של React זמינות כך:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
על מנת לטעון גרסא ספציפית של `React` ו-`react-dom`, החלף את המספר `17` במספר גרסא אחר.
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

### למה משמשת תכונת `crossorigin`? {#why-the-crossorigin-attribute}

אם תשתמש בReact דרך הCDN, אנו ממליצים להשתמש בסט מאפייני [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

בנוסף, אנו ממליצים לוודא שהCDN בו משתמשים משתמש בHTTP header - `Access-Control-Allow-Origin: *`.

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

שימוש זה מאפשר [חווית טיפול בשגיאות](/blog/2017/07/26/error-handling-in-react-16.html) טובה יותר בגרסאת 16 ומעלה של ריאקט.
