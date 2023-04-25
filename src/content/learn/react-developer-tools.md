---
title: React Developer Tools
---

<Intro>

ניתן להשתמש ב-React Developer Tools על מנת לבחון [קומפוננטות](/learn/your-first-component), לערוך [props](/learn/passing-props-to-a-component) ו-[state](/learn/state-a-components-memory), ובנוסף לאבחן בעיות שקשורות לביצועים.
</Intro>

<YouWillLearn>

* איך להתקין React Developer Tools

</YouWillLearn>

## תוסף דפדפן {/*browser-extension*/}

הדרך הקלה ביותר לדבג אתרים שכתובים בעזרת ריאקט היא להתקין את תוסף כלי המפתחים של ריאקט. הוא זמין בכמה דפדפנים:

* [התקן בדפדפן **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [התקן בדפדפן **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [התקן בדפדפן **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

לאחר ההתקנה, אם תיכנס לאתר **שכתוב בריאקט**, תראה את הפאנלים _Components_ ו-_Profiler_.

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari ודפדפנים אחרים {/*safari-and-other-browsers*/}
על מנת להשתמש בתוסף בדפדפנים אחרים כמו Safari, התקן את חבילת ה-npm הזו: [`react-devtools`](https://www.npmjs.com/package/react-devtools)
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

עכשיו פתח את כלי המפתחים מהטרמינל:
```bash
react-devtools
```

לאחר מכן התחבר לאתר שלך בעזרת הוספת תגית ה-`<script>` הבאה בתוך ה-`head` באתר שלך:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

טען מחדש את האתר על מנת לראות את הכלים באיזור כלי המפתחים:

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}
ניתן להשתמש בכלי המפתחים של ריאקט על מנת לבחון אפליקציות שנבנו בעזרת [React Native](https://reactnative.dev/). 

הדרך הקלה ביותר להשתמש בכלי המפתחים היא להתקין אותם גלובאלית:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

פתח את הכלים מהטרמינל:
```bash
react-devtools
```
הכלים אמורים להתחבר לכל אפליקציית react native שרצה לוקאלית.

> נסה לטעון מחדש את האפליקצייה אם הכלים לא מתחברים אליה תוך מספר שניות.

[למד עוד על דיבוג React Native.](https://reactnative.dev/docs/debugging)
