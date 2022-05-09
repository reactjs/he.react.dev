---
id: add-react-to-a-website
title: הוספת React לאתר אינטרנט
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

השתמש בכמה שפחות או בכמה שיותר React לפי צרכיך.

React הונדסה מההתחלה לאימוץ הדרגתי, ו**אנו יכולים להשתמש בכמה שפחות או בכמה שיותר React שאנו צריכים**. יתכן שנרצה להוסיף כמה "נצנוצים של אינטראקטיביות" לדף קיים. קומפוננטות React הן דרך מעולה לעשות זאת.

הרוב המוחץ של אתרי האינטרנט הם לא, ולא צריכים להיות, יישומי דף-יחיד. בעזרת **כמה שורות קוד וללא כלי בנייה**, נסה את React בחלק קטן של אתר האינטרנט שלך. תוכל להגדיל בהדרגה את הנוכחות של React, או לשמור אותה מוגבלת לכמה יישומונים דינמיים בלבד.

---

- [הוסף את ריאקט בדקה](#add-react-in-one-minute)
- [אופציונאלי: נסה את ריאקט עם JSX](#optional-try-react-with-jsx) (no bundler necessary!)

## הוסף את ריאקט בדקה {#add-react-in-one-minute}

בחלק זה, נראה איך להוסיף קומפוננטת React לדף HTML קיים. תוכל לעקוב אחר צעדים אלו עם האתר שלך, או ליצור קובץ HTML ריק על מנת לתרגל.

לא יהיו כלים מורכבים או דרישות התקנה – **על מנת להשלים חלק זה, כל מה שתצטרך הוא חיבור אינטרנט ודקה מזמנך.**

<<<<<<< HEAD
אופציונאלי: [הורד את הדוגמה המלאה (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)
=======
Optional: [Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

### שלב ראשון: הוסף קונטיינר DOM לקובץ ה-HTML {#step-1-add-a-dom-container-to-the-html}

ראשית, פתח את עמוד ה-HTML שתרצה לערוך. הוסף תגית `<div>` ריקה על מנת לסמן את המקום בו אתה רוצה להציג משהו עם React. לדוגמה: 

```html{3}
<!-- ... HTML קיים ... -->

<div id="like_button_container"></div>

<!-- ... HTML קיים ... -->
```

הבאנו ל-`<div>` זה `id` ייחודי כמאפיין HTML. זה יאפשר לנו למצוא אותו מקוד ה-JavaScript מאוחר יותר ולהציג קומפוננטת React בתוכו.

>טיפ
>
>ניתן להציב "קונטיינר" `<div>` באופן זה **בכל מקום** בתוך תגית ה-`<body>`. יכולים להיות לך מספר בלתי מוגבל של קונטיינרים של DOM בעמוד אחד לפי צרכייך. הם בדרך כלל ריקים -- React תחליף כל תוכן קיים בתוך קונטיינר DOM.

### שלב שני: הוסף את תגיות הסקריפט {#step-2-add-the-script-tags}

לאחר מכן, הוסף שלוש תגיות `<script>` לדף ה-HTML ממש לפני תגית ה-`</body>` הסוגרת:

```html{5,6,9}
  <!-- ... HTML אחר ... -->

<<<<<<< HEAD
  <!-- טעינת ריאקט. -->
  <!-- שים לב: כשמעלים לאוויר, מחליפים את "development.js" עם "production.min.js". -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
=======
  <!-- Load React. -->
  <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

  <!-- טעינת קומפוננטת ה-React שלנו. -->
  <script src="like_button.js"></script>

</body>
```

שתי התגיות הראשונות טוענות את React. השלישית תטען את קוד הקומפוננטה שלך.

### שלב שלישי: יצירת קומפוננטת React {#step-3-create-a-react-component}

צור קובץ בשם `like_button.js` בצמוד לדף ה-HTML שלך.

פתח את **[הקוד ההתחלתי הזה](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** והדבק אותו בקובץ שיצרת.

>טיפ
>
>קוד זה מגדיר קומפוננטת React שנקראת `LikeButton`. אל תדאג אם אתה לא מבין את זה עדיין -- אנו נכסה את היסודות של React מאוחר יותר ב[מדריך המעשי](/tutorial/tutorial.html) וב[מדריך הקונספטים העיקריים](/docs/hello-world.html). בינתיים, בוא רק נדאג שזה יוצג על המסך!

<<<<<<< HEAD
אחרי **[הקוד ההתחלתי](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, הוסף שתי שורות לתחתית הקובץ `like_button.js`:
=======
After **[the starter code](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, add three lines to the bottom of `like_button.js`:
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

```js{3,4,5}
// ... the starter code you pasted ...

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));
```

<<<<<<< HEAD
שתי שורות אלו מוצאות את תגית ה-`<div>` שהוספנו לדף ה-HTML בשלב הראשון, ואז מציגות את קומפוננטת כפתור ה-"לייק" בתוכו.
=======
These three lines of code find the `<div>` we added to our HTML in the first step, create a React app with it, and then display our "Like" button React component inside of it.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

### זהו זה! {#thats-it}

אין שלב רביעי. **הרגע הוספת את קומפוננטת ה-React הראשונה לאתר האינטרנט שלך!**

ראה את הפרקים הבאים על מנת ללמוד עוד טיפים על שילוב React.

**[ראה את קוד הדוגמה המלא](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

<<<<<<< HEAD
**[הורד את הדוגמה המלאה (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**
=======
**[Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)**
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

### טיפ: שימוש חוזר בקומפוננטה {#tip-reuse-a-component}

לעיתים קרובות, נרצה להציג קומפוננטות React בכמה מקומות בדף ה-HTML. הנה דוגמה שמציגה את כפתור ה-"לייק" שלוש פעמים ומעבירה אליו מידע:

[ראה את קוד הדוגמה המלא](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

<<<<<<< HEAD
[הורד את הדוגמה המלאה (2KB zipped)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)
=======
[Download the full example (2KB zipped)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/279839cb9891bd41802ebebc5365e9dec08eeb9f.zip)
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

>הערה
>
>אסטרטגיה זו היא שימושית בעיקר כשחלקים בעמוד שמשתמשים ב-React מבודדים אחד מן השני. בתוך קוד React, קל יותר להשתמש [בחיבור קומפוננטות](/docs/components-and-props.html#composing-components) במקום.

### טיפ: צמצם JavaScript בפרודקשן {#tip-minify-javascript-for-production}

לפני העלת האתר לפרודקשן, צריך לזכור כי קוד JavaScript לא מצומצם יכול להאט באופן משמעותי את העמוד למשתמשים שלך.

אם צמצמת כבר את הסקריפטים של האפליקציה שלך, **האתר שלך יהיה מוכן לפרודקשן** במידה ואתה מוודא שה-HTML שהעלת טוען את גרסאות React המסתיימות עם `production.min.js`:

```js
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

אם אין לך שלב צמצום לסקריפטים שלך, [הנה דרך אחת לעשות זאת](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## אופציונאלי: נסה את React עם JSX {#optional-try-react-with-jsx}

בדוגמאות הקודמות, הסתמכנו רק על פיצ'רים שנתמכים באופן טבעי על ידי דפדפנים. זאת הסיבה שהשתמשנו בקריאה לפונקציית JavaScript על מנת לומר ל-React מה להציג:

```js
const e = React.createElement;

// הצג כפתור "לייק"
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

לעומת זאת, ריאקט מציע אפשרות להשתמש ב-[JSX](/docs/introducing-jsx.html) במקום:

```js
// "הצג כפתור "לייק
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

שתי דוגמאות הקוד זהות. למרות **ש-JSX  [הוא אופציונאלי לגמרי](/docs/react-without-jsx.html)**, מספר רב של אנשים מוצאים אותו יעיל עבור כתיבת קוד ממשק משתמש -- ב-React וגם בספריות אחרות.

תוכל להתנסות עם JSX באמצעות [ממיר אונליין זה](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.15.7).

### נסה את JSX במהירות {#quickly-try-jsx}

הדרך הכי מהירה לנסות את JSX בפרויקט שלך היא להוסיף את תגית ה-`<script>`הזו לעמוד שלך:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

עכשיו תוכל להשתמש ב-JSX בתוך כל תגית `<script>` על ידי הוספת מאפיין `type="text/babel"`. הנה [דוגמה של דף HTML עם JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) שתוכל להוריד ולהתנסות עמה.

גישה זו היא טובה ללמידה וליצירת הדגמות פשוטות. לעומת זאת, היא עושה את אתרך איטי והיא **אינה מתאימה לפרודקשן**. כשאתה מוכן להתקדם, הסר את תגית ה-`<script>` החדשה ואת מאפייני `type="text/babel"` שהוספת. במקום זאת, בפרק הבא נכין קדם-מעבד JSX שימיר את כל תגיות ה-`<script>` שלך באופן אוטומטי.

### הוספת JSX לפרויקט {#add-jsx-to-a-project}

הוספת JSX לפרוייקט אינה דורשת כלים מורכבים כמו באנדלר או שרת פיתוח. בעיקרון, הוספת JSX הוא **תהליך דומה להוספת קדם-מעבד CSS.** הדרישה היחידה היא ש-[Node.js](https://nodejs.org/) יהיה מותקן על מחשבך.

גש אל תיקיית הפרויקט שלך בשורת הפקודה, והדבק את שתי הפקודות הבאות:

1. **שלב ראשון:** הרץ את `npm init -y` (אם הוא נכשל, [הנה פיתרון](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **שלב שני:** הרץ את `npm install babel-cli@6 babel-preset-react-app@3`

>טיפ
>
>אנו **משתמשים ב-npm כאן על מנת להתקין את קדם-מעבד ה-JSX.** לא יהיה תצטרך אותו לדברים נוספים. גם React וגם קוד האפליקציה שלך יכולים להישאר בתגיות `<script>` ללא שינויים.

מזל טוב! הוספת הרגע **JSX מוכן לפורדקשן** לפרויקט שלך.


### הרצת קדם-מעבד JSX {#run-jsx-preprocessor}

צור תיקייה שנקראת `src` והרץ את הפקודה הבאה בשורת הפקודה:

```
npx babel --watch src --out-dir . --presets react-app/prod
```

>הערה
>
>`npx` אינה טעות כתיב -- זה [מריץ חבילות שבא עם npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>אם מופיעה לך הודעת השגיאה "You have mistakenly installed the `babel` package", יתכן שפספסת [את הצעד הקודם](#add-jsx-to-a-project). בצע זאת באותה התיקייה, ואז נסה שוב.

אל תחכה שהתהליך יסתיים -- פקודה זאת מתחילה צופה אוטומטי ל-JSX.

אם עכשיו תיצור קובץ שנקרא `src/like_button.js` עם **[קוד ה-JSX הבסיסי הזה](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, הצופה יצור קובץ `like_button.js` מעובד עם קוד ה-JavaScript שמתאים לדפדפן. כשאתה עורך את קוד המקור עם JSX, שינוי הצורה ירוץ שוב באופן אוטומטי.

כבונוס, זה נותן לך להשתמש בקוד JavaScript מודרני כגון מחלקות בלי לדאוג לגבי שבירת גרסאות דפדפן קודמות. הכלי שהשתמשנו בו הרגע נקרא Babel, ותוכל ללמוד עוד לגביו [מהדוקומנטציה שלו](https://babeljs.io/docs/en/babel-cli/).

אם אתה שם לב שאתה מתחיל להרגיש בנוח יותר עם כלי בנייה ואתה רוצה שהם יעשו יותר עבורך, [החלק הבא](/docs/create-a-new-react-app.html) מסביר על הכלים הפופולריים והנגישים ביותר. אם לא -- תגיות הסקריפט הללו יעשו את העבודה מצויין!
