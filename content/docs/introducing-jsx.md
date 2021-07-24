---
id: introducing-jsx
title: היכרות עם JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

הביטו על הצהרת משתנה זו:

```js
const element = <h1>שלום, עולם!</h1>;
```

תחביר התג המצחיק הזה הוא לא מחרוזת ולא HTML.

הוא נקרא JSX, והוא הרחבת תחביר עבור JavaScript. אנו ממליצים להשתמש בו עם React כדי לתאר כיצד ממשק המשתמש אמור להיראות. JSX עשוי להזכיר לך שפת תבנית, אבל הוא מגיע עם מלוא העוצמה של JavaScript.

JSX מייצר "אלמנטים" של React. אנחנו נחקור כיצד לרנדר אותם ל-DOM ב[חלק הבא](/docs/rendering-elements.html). למטה, תוכלו למצוא את היסודות של JSX הדרושים על מנת שתוכלו להתחיל.

### למה JSX? {#why-jsx}

React מאמצת את העובדה כי לוגיקת הרינדור משולבת מיסודה עם יתר לוגיקת ממשק המשתמש: איך אירועים מטופלים, איך ה-state משתנה לאורך זמן, וכיצד מכינים את הנתונים לתצוגה.

במקום להפריד באופן מלאכותי בין *טכנולוגיות* על ידי השמת ה-markup והלוגיקה בקבצים נפרדים, React [מבצעת הפרדת *אחריות*](https://en.wikipedia.org/wiki/Separation_of_concerns) בעזרת יחידות המקושרות בצורה רופפת הנקראות "קומפוננטות" אשר מכילות את שניהם. נחזור לקומפוננטות ב[חלק אחר](/docs/components-and-props.html), אבל אם עדיין לא נוח לכם לשים את ה-markup ב-JS, [ההרצאה הזאת](https://www.youtube.com/watch?v=x7cQ3mrcKaY) עשויה לשכנע אתכם.

React [לא דורשת](/docs/react-without-jsx.html) שימוש ב-JSX, אבל רוב האנשים מוצאים את זה מועיל בתור סיוע ויזואלי בעת עבודה עם ממשקי משתמש בתוך קוד JavaScript. זה גם מאפשר ל-React להראות הודעות שגיאה והתרעה יותר שימושיות.

עכשיו שהסרנו את זה מהדרך, בואו נתחיל!

### הטמעת ביטויים ב-JSX {#embedding-expressions-in-jsx}

בדוגמה הבאה, אנו מכריזים על משתנה הנקרא `name` (שם) ולאחר מכן משתמשים בו בתוך JSX על ידי עטיפתו בסוגריים מסולסלים:

```js{1,2}
const name = 'גיא פרץ';
const element = <h1>שלום, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

ניתן לשים כל [ביטוי JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) חוקי בתוך סוגריים מסולסלים ב-JSX. לדוגמה, `2 + 2`, `user.firstName`, או `formatName(user)` הם כולם ביטויים חוקיים ב-JavaScript.

בדוגמה הבאה, אנו מטמיעים את התוצאה של קריאה לפונקציית ה-JavaScript, `formatName(user)`, לתוך אלמנט `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'הדר',
  lastName: 'פרץ'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

אנו מפצלים את JSX על מספר שורות עבור הקריאות. אף על פי שזה לא נדרש, כאשר עושים זאת, אנו ממליצים גם לעטוף אותו בסוגריים כדי למנוע את החסרונות של [הכנסת נקודה-פסיק אוטומטית](https://stackoverflow.com/q/2846283).

### JSX גם הוא ביטוי {#jsx-is-an-expression-too}

לאחר ההידור, ביטויים של JSX הופכים לקריאות רגילות של פונקציות JavaScript והם מחושבים לאובייקטים של JavaScript.

זה אומר שאתם יכולים להשתמש ב-JSX בתוך הצהרות `if` ולולאות `for`, להקצות אותו למשתנים, לקבל אותו כארגומנטים, ולהחזיר אותו מפונקציות:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### ציון מאפיינים עם JSX {#specifying-attributes-with-jsx}

ניתן להשתמש בגרשיים כדי לציין מחרוזות כמאפיינים:

```js
const element = <div tabIndex="0"></div>;
```

תוכלו גם להשתמש בסוגריים מסולסלים כדי להטמיע ביטוי ב-JavaScript במאפיין:

```js
const element = <img src={user.avatarUrl}></img>;
```

אל תוסיפו גרשיים סביב סוגריים מסולסלים בעת הטמעת ביטוי JavaScript במאפיין. עליכם להשתמש בגרשיים (עבור ערכי מחרוזת) או בסוגריים מסולסלים (עבור ביטויים), אך לא בשניהם באותו המאפיין.

>**אזהרה:**
>
>מכיוון ש- JSX קרוב יותר ל- JavaScript מאשר ל- HTML, React DOM משתמש בקונבנציית שמות מאפיינים בצורת `camelCase` במקום בשמות של תכונות HTML.
>
>לדוגמה, `class` הופך ל-[`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) ב-JSX, ו-`tabindex` הופך ל-[`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### ציון ילדים עם JSX {#specifying-children-with-jsx}

אם תגית כלשהי ריקה, באפשרותכם לסגור אותה מיידית עם `/>`, כמו ב-XML:

```js
const element = <img src={user.avatarUrl} />;
```

תגיות JSX יכולות להכיל ילדים:

```js
const element = (
  <div>
    <h1>שלום!</h1>
    <h2>טוב לראות אותך כאן.</h2>
  </div>
);
```

### JSX מונע התקפות הזרקה {#jsx-prevents-injection-attacks}

זה בטוח להטמיע קלט משתמש ב-JSX:

```js
const title = response.potentiallyMaliciousInput;
// זה בטוח:
const element = <h1>{title}</h1>;
```

כברירת מחדל, React DOM [מבצע escape](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) עבור ערכים מוטמעים ב-JSX לפני שהוא מרנדר אותם. דבר זה מבטיח שאף פעם לא תוכלו להזריק שום דבר שלא כתוב במפורש באפליקציה שלכם. כל דבר מומר למחרוזת לפני שהוא מרונדר. זה עוזר למנוע התקפות [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting).

### JSX מייצג אובייקטים {#jsx-represents-objects}

Babel מקמפל JSX לקריאות ל-`React.createElement()`.

שתי הדוגמות הבאות זהות:

```js
const element = (
  <h1 className="greeting">
    שלום, עולם!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'שלום, עולם!'
);
```

`React.createElement()` מבצעת כמה בדיקות כדי לעזור לכם לכתוב קוד ללא באגים אבל בעיקרון היא יוצרת אובייקט כזה:

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'שלום, עולם!'
  }
};
```

אובייקטים אלה נקראים "אלמנטים של React". אתם יכולים לחשוב עליהם כמו תיאורים של מה שאתם רוצים לראות על המסך. React קוראת את האובייקטים האלה ומשתמשת בהם כדי לבנות את ה-DOM ולשמור אותו מעודכן.

אנו נחקור את תהליך רינדור האלמנטים של React ל-DOM [בחלק הבא](/docs/rendering-elements.html).

>**טיפ:**
>
>אנו ממליצים להשתמש ב[הגדרת השפה של "Babel"](https://babeljs.io/docs/en/next/editors) עבור העורך שלך כך שגם קוד ES6 וגם קוד JSX מודגשים כראוי.
