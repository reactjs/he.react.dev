---
id: add-react-to-a-website
title: Add React to a Website
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

השתמש בכמה שפחות או בכמה שיותר ריאקט לפי צרכיך.

ריאקט הונדסה מההתחלה לאימוץ הדרגתי, ואנו יכולים להשתמש **בכמה שפחות או בכמה שיותר ריאקט שאנו צריכים**. יתכן שנרצה להוסיף כמה מפזרים של אינטראקטיביות לדף קיים. קומפוננטות ריאקט הן דרך מעולה לעשות זאת.

הרוב המוחץ של אתרי האינטרנט הם לא, ולא צריכים להיות, יישומי דף יחיד. בעזרת **כמה שורות קוד וללא עזרי בנייה**, נסה את ריאקט בחלק קטן של אתר האינטרנט שלך. ואז תוכל להגדיל בהדרגה את הנוכחות של ריאקט, או לשמור את ריאקט בכמה יישומונים דינמיים. 

---

- [הוסף את ריאקט בדקה](#add-react-in-one-minute)
- [אופציונאלי: נסה את ריאקט עם JSX ](#optional-try-react-with-jsx) (no bundler necessary!)

## הוסף את ריאקט בדקה {#add-react-in-one-minute}

בפרק זה, אנו נראה איך להוסיף קומפוננטת ריאקט לדף HTML קיים. תוכל לעקוב אחר צעדים אלו עם האתר שלך, או ליצור קובץ HTML ריק על מנת לתרגל.

לא יהיו כלים מורכבים או דרישות התקנה – **על מנת להשלים פרק זה, כל מה שתצטרך הוא חיבור אינטרנט ודקה מזמנך.**

אופציונאלי: [הורד את הדוגמה המלאה (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### שלב ראשון: הוסף קונטיינר DOM לקובץ ה – HTML {#step-1-add-a-dom-container-to-the-html}

ראשית, פתח את עמוד ה – HTML שתרצה לערוך. הוסף תגית div ריקה על מנת לסמן את המקום בו אתה רוצה להציג משהו עם ריאקט. לדוגמה: 

```html{3}
<!-- ... HTML קיים ... -->

<div id="like_button_container"></div>

<!-- ... HTML קיים ... -->
```

הבאנו ל `<div>` זה `id` ייחודי כמאפיין HTML. זה יעזור לנו למצוא את זה מקוד הג'אווהסקריפט מאוחר יותר ולהציג קומפוננטת ריאקט בתוכו.

>טיפ
>
>ניתן להציב ''קונטיינר'' div **בכל מקום** בתוך תגית ה – body. יכול להיות לך מספר בלתי מוגבל של קונטיינרים DOM בעמוד אחד. הם בדרך כלל ריקים – ריאקט יחליף אותם בכל תוכן שקיים בקונטיינר DOM.

### שלב שני: הוסף את תגיות הסקריפט {#step-2-add-the-script-tags}

לאחר מכן, הוסף שלושה תגיות `<script>` לדף ה – HTML ממש לפני תגית ה -  `</body>` הסוגרת:

```html{5,6,9}
  <!-- ... HTML אחר ... -->

  <!-- טעינת ריאקט. -->
  <!-- שים לב: כשמעלים לאוויר, מחליפים את "development.js" ב- "production.min.js". -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- טעינת קומפוננטת הריאקט שלנו. -->
  <script src="like_button.js"></script>

</body>
```

השניים הראשונים טוענים את ריאקט. השלישי טוען את קוד הקומפוננטות שלך.

### שלב שלישי:   יצירת קומפוננטת ריאקט {#step-3-create-a-react-component}

ניצור קובץ שנקרא `like_button.js` צמוד לדף ה – HTML הקיים.

פתח את **[הקוד ההתחלתי הזה](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** ותעביר אותו לקובץ שיצרת.

>טיפ
>
>קוד זה מגדיר קומפוננטת ריאקט שנקראית `LikeButton`. אל תדאג אם אתה לא מבין את זה עדיין – אנו נכסה את היסודות של ריאקט לאחר מכן ב[מדריך המעשי](/tutorial/tutorial.html) וב[מדריך של היסודות המרכזיים](/docs/hello-world.html). בינתיים, רק נראה את זה על המסך!

אחרי **[הקוד ההתחלתי](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, הוסף שתי שורות לתחתית הקובץ `like_button.js`:

```js{3,4}
// ... the starter code you pasted ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

שתי שורות אלו מוצאות את תגית ה `<div>`  שהוספנו לדף הHTML בשלב הראשון, ומציגות את קומפוננטת כפתור הלייק בתוכו.

### זהו זה! {#thats-it}

אין שלב רביעי. **הרגע הוספנו את קומפוננטת הריאקט הראשונה לאתר האינטרנט שלך!**

ראה את הפרקים הבאים על מנת ללמוד עוד טיפים על שילוב ריאקט.

**[ראה את הקוד המלא](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[הורד את הדוגמה המלאה (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### טיפ: שימוש חוזר בקומפוננטה {#tip-reuse-a-component}

לעיתים קרובות, נרצה להציג קומפוננטות ריאקט בכמה מקומות בדף ה- HTML. הנה דוגמה שמציגה את כפתור הלייק שלוש פעמים ומעבירה מידע לכפתור:

[ראה את הקוד המלא](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[הורד את הדוגמה המלאה (2KB zipped)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>דגש
>
>אסטרטגיה זו היא שימושית בעיקר כשחלקים בעמוד שמשתמשים בריאקט מבודדים אחד מן השני. בתוך קוד ריאקט, זה קל יותר להשתמש  [בחיבור קומפוננטות](/docs/components-and-props.html#composing-components) במקום.

### טיפ: צמצם ג'אווהסקריפט בפרודקשן {#tip-minify-javascript-for-production}

לפני העלת האתר לפרודקשן, צריך לזכור כי קוד לא מצומצם יכול להאט באופן משמעותי את האתר למשתמשיך.

אם צמצמת כבר את הסקריפטים של היישום שלך, **הוא יהיה מוכן לפרודקשן** במידה ואתה מוודא שה-HTML שכתבת טוען את גרסאות ריאקט שנגמרות ב `production.min.js`.

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

אם אין לך שלב צמצום לסקריפטים שלך, [הנה דרך אחת לעשות זאת](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## אופציונאלי: נסה את ריאקט עם JSX {#optional-try-react-with-jsx}

בדוגמאות הקודמות, אנו הסתמכנו רק על פיצ'רים שנתמכים באופן טבעי על ידי הדפדפנים. זאת הסיבה שהשתמשנו בקריאת פונקציית ג'אווהסקריפט על מנת לומר לריאקט מה להציג:

```js
const e = React.createElement;

// הצג כפתור לייק
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

לעומת זאת, ריאקט מציע אפשרות להשתמש ב- [JSX](/docs/introducing-jsx.html) במקום:

```js
// הצג כפתור לייק
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

שתי דוגמאות הקוד הן שוות. למרות **ש- JSX  [הוא אופציונאלי לגמרי](/docs/react-without-jsx.html)**, מספר רב של אנשים מעדיפים לכתוב קוד UI – עם ריאקט וספריות אחרות.

תוכל להתנסות עם JSX באמצעות [ממיר זה](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=).

### נסה את JSX במהירות {#quickly-try-jsx}

הדרך הכי מהירה לנסות את JSX בפרויקט שלך היא להוסיף את תגית ה- `<script>`הזו לעמוד שלך:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

עכשיו תוכל להשתמש בJSX - בתוך כל תגית `<script>` על ידי הוספת מאפיין `type="text/babel"`. הנה [דוגמה של דף HTML עם JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) שתוכל להוריד ולהתנסות עמה.

גישה זו היא טובה ללמידה וליצירת הדגמות פשוטות. לעומת זאת, זה עושה את אתרך איטי וזה **אינו מתאים לפרודקשן**. כשאתה מוכן להתקדם, הסר את תגית ה- `<script>` החדשה ואת המאפיינים שהוספת( `type="text/babel"`). במקום זה, בפרק הבא נכין קדם-מעבד JSX שימיר את כל תגיות ה- `<script>` באופן אוטומטי.

### הוספת JSX לפרויקט {#add-jsx-to-a-project}

הוספת JSX לפרוייקט אינה דורשת כלים מורכבים כמו באנדלר או שרת פיתוח. בעיקרון, הוספת JSX הוא **תהליך דומה להוספת קדם-מעבד CSS.** הדרישה היחידה היא ש- [Node.js](https://nodejs.org/) יהיה מותקן על מחשבך.

בשורת הפקודה של תיקיית הפרויקט שלך, הדפס את שתי הפקודות הבאות:

1. 1.	**שלב ראשון:** הרץ את `npm init -y` (אם זה נכשל, [הנה פיתרון](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. 2.	**שלב שני:** הרץ את `npm install babel-cli@6 babel-preset-react-app@3`

>טיפ
>
>אנו **משתמשים בnpm כאן על מנת להתקין את קדם-מעבד ה- CSS.** לא יהיה צורך בnpm לדברים נוספים. גם ריאקט וגם קוד היישום שלך יכולים להישאר בתגיות ה- `<script>`  ללא שינוי.

מזל טוב! הוספת הרגע **JSX מוכן לפורדקשן** לפרויקט שלך.


### הרצת קדם-מעבד ה- JSX {#run-jsx-preprocessor}

צור תיקייה שנקראת `src` והרץ את הפקודה הבאה:

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

>דגש
>
>npx` זה לא טעות כתיב – זה [מריץ חבילות שבא עם npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>אם מופיעה לך ההודעה "You have mistakenly installed the `babel` package", יכול להיות שפספסת [את הצעד הקודם](#add-jsx-to-a-project). עשה זאת באותה התיקייה ונסה שוב.

אל תחכה שהתהליך יסתיים – פקודה זאת מתחילה צופה אוטומטי ל- JSX.

אם עכשיו תיצור קובץ שנקרא `src/like_button.js` עם **[הJSX - הזה](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, אם עכשיו תיצור קובץ שנקרא `src/like_button.js` עם קוד הJSX - הזה, הצופה יצור `like_button.js` מעובד עם קוד הג'אווהסקריפט שמתאים לדפדפן. כשאתה עורך את קוד המקור עם JSX, שינוי הצורה ירוץ באופן אוטומטי.

כבונוס, זה נותן לך להשתמש בקוד ג'אווהסקריפט מודרני כגון מחלקות בלי לדאוג לגבי שבירת גרסאות דפדפן קדומות. הכלי שהוספנו הרגע נקרא Babel, ותוכל ללמוד עוד לגביו [מהדוקומנטציה שלו](https://babeljs.io/docs/en/babel-cli/).

אם אתה שם לב שאתה מתחיל להסתדר יותר עם כלי בנייה ואתה רוצה שהם יעשו עוד בשבילך, [הפרק הבא](/docs/create-a-new-react-app.html) מסביר על הכלים הפופולריים והנגישים ביותר. אם לא – תגיות הסקריפט הללו יעשו את העבודה גם כן.
