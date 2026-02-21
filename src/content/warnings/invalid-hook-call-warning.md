---
title: "כללי Hooks"
---

כנראה הגעתם לכאן כי קיבלתם את הודעת השגיאה הבאה:

<ConsoleBlock level="error">

ניתן לקרוא ל-Hooks רק בתוך הגוף של רכיב פונקציה.

</ConsoleBlock>

יש שלוש סיבות נפוצות לכך:

1. אתה יכול **מפרים את כללי Hooks**.
2. ייתכן שיש לכם **גרסאות לא תואמות** של React ו-React DOM.
3. ייתכן שיש לכם **יותר מעותק אחד של React** באותה אפליקציה.

בואו נעבור על כל אחד מהמקרים.

## הפרת כללי Hooks {/*breaking-rules-of-hooks*/}

פונקציות שהשם שלהן מתחילות ב-`use` נקראות [*Hooks*](/reference/react) ב-React.

**אל תקראו ל-Hooks בתוך לולאות, תנאים או פונקציות קוננות.** במקום זאת, תמיד השתמשו ב-Hooks ברמה העליונה של פונקציית React שלכם, לפני כל חזרה מוקדמת. אפשר לקרוא ל-Hooks רק בזמן ש-React רכיב הפונקציה של מרנדר:

* ✅ קראו להם ברמה העליונה בגוף של [component function](/learn/your-first-component).
* ✅ קראו להם ברמה העליונה בגוף של [custom Hook](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

**לא** נתמך לקרוא ל-Hooks (פעולות שמתחילות ב-`use`) אחרות, למשל:

* 🔴 אל תקראו ל-Hooks בתוך תנאים או לולאות.
* 🔴 אל תקראו ל-Hooks אחרי משפט `return` מותנה.
* 🔴 אל תקראו ל-Hooks בתוך מטפלי אירועים.
* 🔴 אל תקראו ל-Hooks ב-class רכיבים.
* 🔴 אל תקראו ל-Hooks בתוך פונקציות שמועברות ל-`useMemo`, `useReducer`, או `useEffect`.

אם תפרו את הכללים האלה, ייתכן שתראו את השגיאה הזו.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

אפשר להשתמש ב-[`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) כדי לזהות טעויות כאלה.

<Note>

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *יכולים* לקרוא ל-Hooks אחרים (זו כל המטרה שלהם). זה עובד גם מותאם אישית Hooks אמורים להיקרא רק בזמן ש-function component מרונדר.

</Note>

## גרסאות לא תואמות של React ו-React DOM {/*mismatching-versions-of-react-and-react-dom*/}

ייתכן שאתה משתמש בגרסה של `react-dom` (פחות מ-16.8.0) או `react-native` (פחות מ-0.59) שעוד לא תומכת ב-Hooks. אפשר להריץ `npm ls react-dom` או `npm ls react-native` בתיקיית האפליקציה כדי לבדוק באיזו גרסה אתם משתמשים. אם מוצאים יותר מאחת, זה יכול ליצור בעיות נוספות.

## React כפול {/*duplicate-react*/}

כדי ש-Hooks יעבדו, ה-`react` ייבוא ​​מהקוד של האפליקציה צריך להיפתר לאותו מודול כמו ה-`react` ייבוא ​​מתוך החבילה `react-dom`.

אם שני ה-imports האלה של `react` נפתרים לשני אובייקטי ייצוא שונים, תראו את האזהרה הזאת. זה יכול לקרות אם **בטעות יש לכם שני עותקים** של החבילה `react`.

אם אתם משתמשים ב-Node לניהול חבילות, אפשר להריץ את הבדיקה הבאה בתיקיית הפרויקט:

<TerminalBlock>

npm ls מגיב

</TerminalBlock>

אם מופיעים יותר מעותק אחד של React, תצטרכו להבין למה זה קורה ולתקן את עץ התלות. לדוגמה, משתמשים בהגדירה את `react` כתלות רגילה במקום תלות עמיתים. עד שהספרייה תתוקן, [רזולוציות חוט](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) היא דרך אפשרית לעקיפה.

אפשר גם לנסות לדבג את הבעיה הזו על ידי הוספת לוגים והפעלה מחדש של שרת הפיתוח:

```js
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

אם יודפס `false`, כנראה שיש לכם שני עותקים של React וצריך לברר למה זה קרה. ב-[עניין הזה](https://github.com/facebook/react/issues/13991) יש סיבות נפוצות שהקהילה נתקלה בה.

הבעיה הזו יכולה להופיע גם כשמשתמשים ב-`npm link` או מקבילה שלו. במצב כזה ה-bundler עשוי "לראות" שני עותקים של React - אחת בתיקיית האפליקציה ואחד בתיקיית ספרייה. בהנחה ש-`myapp` ו-`mylib` הן תיקיות אחיות, פתרון אפשרי הוא להריץ `npm link ../myapp/node_modules/react` מתוך `mylib`. זה אמור לגרוםייה להשתמש בעותק React של האפליקציה.

<Note>

באופן כללי, React תומכת בכמה עותקים עצמאיים באותו עמוד (לדוגמה, אפליקציה ו-widget צד שמשתמשים בהתמודדות). זה נשבר רק אם `require('react')` נפתר אחרת בין הקומפוננטה והעותק של `react-dom` שאיתו היא רונדרה.

</Note>

## סיבות נוספות {/*other-causes*/}

אם שום דבר לא עזר, אנא הוסיפו תגובה ב-[עניין הזה](https://github.com/facebook/react/issues/13991) וננסה לעזור. מומלץ ליצור דוגמת שחזור קטן - הרבה פעמים מגלים את הבעיה כבר רק יצירת הדוגמה.
