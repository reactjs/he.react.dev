---
id: components-and-props
title: קומפוננטות ו-Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

קומפוננטות מאפשרות לכם לפצל את ממשק המשתמש לחתיכות עצמאיות המאפשרות שימוש חוזר, ולחשוב על כל חתיכה בנפרד. דף זה מספק מבוא לרעיון של קומפוננטות. תוכלו למצוא [הסבר מפורט של ה-API של קומפוננטות כאן](/docs/react-component.html).

מבחינה תפיסתית, קומפוננטות הן כמו פונקציות JavaScript. הן מקבלות קלט שרירותי (נקרא "props") ומחזירות אלמנטים של React המתארים מה אמור להופיע על המסך.

## קומפוננטות מסוגי פונקציות ומחלקות {#function-and-class-components}

הדרך הפשוטה ביותר להגדיר קומפוננטה היא לכתוב פונקציית JavaScript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

פונקציה זו היא קומפוננטת React חוקית משום שהיא מקבלת ארגומנט אובייקט נתונים יחיד מסוג "props" (קיצור של המילה תכונות, properties באנגלית) ומחזירה אלמנט React. אנו מכנים קומפוננטות כאלה "קומפוננטת פונקציה" משום שהם פשוט פונקציות JavaScript.

תוכלו גם להשתמש ב[מחלקה של ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) כדי להגדיר קומפוננטה:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

שתי הקומפוננטות מעלה הן זהות מנקודת המבט של React.

לקומפוננטות פונקציה ומחלקות יש כמה פיצ'רים נוספים שנדבר עליהם [בקטעים הבאים](/docs/state-and-lifecycle.htm).

## רינדור של קומפוננטה {#rendering-a-component}

עד כה, נתקלנו רק ברכיבי React שמייצגים תגי DOM:

```js
const element = <div />;
```

עם זאת, אלמנטים יכולים גם לייצג קומפוננטות המוגדרות על ידי המשתמש:

```js
const element = <Welcome name="Sara" />;
```

כאשר React רואה אלמנט המייצג קומפוננטה שהודגרה על ידי המשתמש, היא מעבירה את המאפיינים שהוגדרו ב-JSX ואת ה"ילדים" לקומפוננטה זו כאובייקט יחיד. אנו קוראים לאובייקט זה "props".

לדוגמה, הקוד הזה מרנדר "Hello, Sara" על העמוד:

```js{1,6}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <Welcome name="Sara" />;
root.render(element);
```

**[נסו את זה ב-codepen](https://codepen.io/gaearon/pen/YGYmEG?editors=1010)**

בואו נסכם מה קורה בדוגמה זו:

1. אנחנו קוראים ל-`ReactDOM.render()` עם האלמנט `<Welcome name="Sara" />`.
2. React קוראת לקומפוננטת `Welcome` עם `{name: 'Sara'}` בתור ה-props.
3. קומפוננטת `Welcome` שלנו מחזירה אלמנט `<h1>Hello, Sara</h1>` בתור התוצאה שלה.
4. React DOM מעדכן ביעילות את ה-DOM להיות תואם ל-`<h1>Hello, Sara</h1>`.

>**הערה:** יש להתחיל שמות קומפוננטות עם אות גדולה.
>
>React מתייחסת לקומפוננטות המתחילות באותיות קטנות בתור תגי DOM. לדוגמה, `<div />` מייצג תג div של HTML, אך `<Welcome />` מייצג קומפוננטה ומחייב את `Welcome` להיות ב-scope.
>
>כדי ללמוד עוד על הסיבות מאחורי קונבנציה זו, אנא קראו את [JSX באופן מעמיק](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## יצירת קומפוננטות {#composing-components}

קומפוננטות יכולות להתייחס לקומפוננטות אחרות בפלט שלהם. דבר זה מאפשר לנו להשתמש באותה הפשטת קומפוננטות עבור כל רמה של פירוט. לחצן, טופס, תיבת דו-שיח, מסך: באפליקציות React, כל אלה בדרך כלל באים לידי ביטוי כקומפוננטות.

למשל, אנו יכולים ליצור קומפוננטת `App` שמרנדרת את `Welcome` הרבה פעמים:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

**[נסו את זה ב-codepen](https://codepen.io/gaearon/pen/KgQKPr?editors=1010)**

בדרך כלל, אפליקציות React חדשות כוללות קומפוננטת `App` אחת בראש האפליקציה. עם זאת, אם תשלבו את React באפליקציה קיימת, תוכלו להתחיל מלמטה למעלה באמצעות קומפוננטה קטנה כגון `Button`, ובהדרגה להגיע לחלק העליון ביותר של הירארכיית התצוגה.

## חילוץ קומפוננטות {#extracting-components}

אל תפחדו לפצל קומפוננטות לקומפוננטות קטנות יותר.

למשל, הביטו בקומפוננטת `Comment` הבאה:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

**[נסו את זה ב-codepen](https://codepen.io/gaearon/pen/VKQwEo?editors=1010)**

היא מקבלת את `author` (אובייקט), `text` (מחרוזת) ו-`date` (תאריך) בתור props, ומתארת תגובה באתר אינטרנט של מדיה חברתית.

קומפוננטה זו יכולה להיות מסובכת לשינוי בגלל כל הקינון שבה, ובנוסף קשה לעשות שימוש חוזר בחלקים אינדיבידואלים שלה. בואו נחלץ מספר קומפוננטות ממנה.

ראשית, נחלץ את `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

ה-`Avatar` לא צריך לדעת שהוא מתרנדר בתוך `Comment`. זו הסיבה שבגללה נתנו ל-prop שלו שם גנרי יותר: `user` (משתמש) ולא `author` (מחבר).

אנו ממליצים על מתן שמות ל-props מנקודת המבט של הקומפוננטה עצמה ולא על סמך הקונטקסט שבו הם נמצאים בשימוש.

אנו יכולים כעת לפשט `Comment` מעט:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

בשלב הבא, נחלץ את קומפוננטת `UserInfo` שמרנדרת `Avatar` לצד שם המשתמש:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

זה מאפשר לנו לפשט את `Comment` אפילו יותר:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

**[נסו את זה ב-codepen](https://codepen.io/gaearon/pen/rrJNJY?editors=1010)**

חילוץ קומפוננטות אולי נראה כמו עבודה שחורה בהתחלה, אבל בעלות על מגוון קומפוננטות לשימוש חוזר משתלמת באפליקציות גדולות יותר. כלל אצבע טוב הוא שאם חלק מממשק המשתמש שלכם נמצא בשימוש מספר פעמים (`Button`, `Panel`, `Avatar`), או שהוא מורכב מספיק בכוחות עצמו (`App`, `FeedStory`, `Comment`), הוא מועמד טוב להיות מחולץ לקומפוננטה אחרת.

## Props הם לקריאה בלבד {#props-are-read-only}

בין אם אתם מצהירים על קומפוננטה [כפונקציה או כמחלקה](#function-and-class-components), אסור לה לעולם לשנות את ה-props שלה. הביטו בפונקציה `sum` הבאה:

```js
function sum(a, b) {
  return a + b;
}
```

פונקציות אלה נקראות ["טהורות"](https://en.wikipedia.org/wiki/Pure_function) מכיוון שהן לא מנסות לשנות את הקלטים שלהן, ותמיד מחזירות את אותה התוצאה עבור אותם קלטים.

לעומת זאת, פונקציה זו אינה טהורה משום שהיא משנה את הקלט שלה:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React היא די גמישה אבל יש לה כלל אחד נוקשה:

**כל קומפוננטות React חייבות לפעול כמו פונקציות טהורות ביחס ל-props שלהן.**

כמובן, ממשקי המשתמש של אפליקציות הם דינמיים ומשתנים עם הזמן. ב[חלק הבא](/docs/state-and-lifecycle.html), נציג את הקונספט החדש של "state" (מצב). ה-state מאפשר לקומפוננטות React לשנות את הפלט שלהן לאורך הזמן בתגובה לפעולות משתמש, תשובות מהרשת, וכל דבר אחר, מבלי להפר כלל זה.
