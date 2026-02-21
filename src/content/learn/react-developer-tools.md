---
title: "כלי הפיתוח של React"
---

<Intro>

השתמש ב-React כלים למפתחים על מנת לבחון [קומפונטות](/learn/your-first-component), לערוך [props](/learn/passing-props-to-a-component) ו-[state](/learn/__TK_component_5____), ובובעיות לבצע שקשורות.
</Intro>

<YouWillLearn>

* איך להתקין React כלים למפתחים

</YouWillLearn>

## תוסף דפדפן {/*תוסף-דפדפן*/}

הדרך הקלה ביותר לדבג אתרים שכתובים בעזרת ריאקט היא להתקין את תוסף כלי המפתחים של ריאקט. הוא זמין בכמה דפדפנים:

* [התקן בדפדפן **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=iw)
* [התקן בדפדפן **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [התקן בדפדפן **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

לאחר ההתקנה, אם תיכנס לאתר **שכתוב בריאקט**, תראה את הפאנלים _Components_ ו-_Profiler_.

![תוסף React כלים למפתחים](/images/docs/react-devtools-extension.png)

### Safari ודפדפנים אחרים {/*safari-and-other-browsers*/}
כדי להשתמש בתוכם בדפדפנים אחרים כמו ספארי, התקינו את חבילת ה-npm הזו: [`react-devtools`](https://www.npmjs.com/package/react-devtools)
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

עכשיו פתחו את כלי המפתחים מהטרמינל:
```bash
react-devtools
```

לאחר התחברו לאתר על ידי הוספת תגית ה-`<script>` הבאה בתוך ה-`head`:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

טענו מחדש את האתר כדי לראות את הכלים באזור כלי המפתחים:

![React כלים למפתחים בstate עצמאי](/images/docs/react-devtools-standalone.png)

## מובייל (React יליד) {/*mobile-react-native*/}
אפשר להשתמש בכל המפתחים של React כדי לבחון אפליקציות גם שנבנו עם [React Native](https://reactnative.dev/).

הדרך הקלה ביותר להשתמש בכלי המפתחים היא להתקין אותם גלובלית:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

פתחו את הכלים מהטרמינל:
```bash
react-devtools
```
הכלים אמורים להתחבר לכל אפליקציית React Native שרצה מקומית.

> אם הכלים לא מתחברים תוך כמה שניות, נסו לטעון מחדש את האפליקציה.

[למידע נוסף על ניפוי שגיאות ב-React יליד.](https://reactnative.dev/docs/debugging)

