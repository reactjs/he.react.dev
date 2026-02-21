---
title: "React Hooks מובנים"
---

<Intro>

*Hooks* אפשר להשתמש באפשרויות שונות של React מתוך קומפונטות. אפשר להשתמש ב-Hooks המובנים, או לשלב בין כדי לבנות Hooks משלכם. העמוד הזה מציג את כל ה-Hooks המובנים ב-React.

</Intro>

---

## מצב Hooks {/*state-hooks*/}

*State* אפשר לקומפוננטה ["לזכור" מידע כמו קלט מהמשתמש.](/learn/state-a-components-memory) לדוגמה, קומפונטת טופס יכולה להשתמש ב-state כדי לשמור את הערך אינטלקטואלי לבחור תמונה, בעוד קומפונטת גלריית לשמור תמונות שיכולה להשתמש ב-stated.

כדי להוסיף state לקומפוננטה, השתמשו באחד מה-Hooks הבאים:

* [`useState`](/reference/react/useState) מצהיר על ranking state אפשר לעדכן בכלל.
* [`useReducer`](/reference/react/useReducer) מצהיר על ranking state עם לוגיקת העדכון בתוך [פונקציית מפחית.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## הקשר Hooks {/*context-hooks*/}

*הקשר* יכול לקומפוננטה [לקבל מהורים רחוקים בלי להעביר אותו מידע כ-props.](/learn/passing-props-to-a-component) למשל, קומפוננטת העליונה של האפליקציה יכולה להעביר את ערכת הנושא הנוכחית לכל הקומפוננטות מתחתיה, לא משנה כמה עמוק הן נמצאות.

* [`useContext`](/reference/react/useContext) קורא ל-הקשר ונרשם אליו.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs* מאפשרים לקומפוננטה [להחזיק מידע שלא משמש לרינדור,](/learn/referencing-values-with-refs) כמו DOM node או מזהה פסק זמן. נדרש ל-state, עדכון של ref לא מרנדר מחדש את הקומפוננטה. Refs הם "Escape hatch" מהפרדיגמה של React. הם שימושיים כשצריך לעבוד עם מערכות שאינן React, כמו APIs מובנים של הדפדפן.

* [`useRef`](/reference/react/useRef) מצהיר על ref. אפשר לשמור בו כל ערך, אבל לרוב משתמשים בו כדי לשמור על הצומת DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) יכול להתאים אישית את ה-ref שהקומפונטה חושפת. זה בשימוש נדיר.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## אפקט Hooks {/*effect-hooks*/}

*אפקטים* מאפשרים לקומפוננטה [להתחבר ולהסתנכרן עם מערכות חיצוניות.](/learn/synchronizing-with-effects) זה כולל עבודה עם רשת, DOM של הדפדפן, אנימציות, ווידג'טים שנכתבו בספריית UI אחרת, וקוד נוסף שאינו React.

* [`useEffect`](/reference/react/useEffect) מחבר קומפוננטה למערכת חיצונית.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

אפקטים הם "פתח בריחה" מהפרדיגמה של React. אל תשתמשו ב-Effects כדי לתזמר את זרימת האפליקציה. אם אתם לא מקיימים אינטראקציה עם חיצונית, [יכול להיות שאין מערכת.] ב-Effect(/learn/you-might-not-need-an-effect)

יש שתי וריאציות נדירות יותר של `useEffect` עם הבדלים בתזמון:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) מופעל לפני שהדפדפן מצייר מחדש את המסך. אפשר למדוד פריסה כאן.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) מופעל לפני ש-React מבצעת שינויים ב-DOM. ספריות יכולה להכניס כאן CSS דינמי.

---

## ביצועים Hooks {/*performance-hooks*/}

דרך נפוצה לאופטימיזציה של ביצועי רינדור מחדש לד היאלג על עבודה מיותרת. לדוגמה, אפשר לבקש מ-React להשתמש מחדש בחישוב שמור או לדלג על רינדור חוזר אם לא השתנו מאז הרינדור הקודם.

כדי לדלג על חישובים ורינדורים מיותרים, השתמשו באחד מה-Hooks הבאים:

- [`useMemo`](/reference/react/useMemo) יכול לשמור במטמון תוצאה של חישוב יקר.
- [`useCallback`](/reference/react/useCallback) מאפשר לשמור את הגדרת הפונקציה במטמון לפני שמעבירים אותה לקומפוננטה ממוטבת.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

לפעמים אי אפשר לדלג על רינדור מחדש כי המסך באמת צריך להתעדכן. במקרה כזה אפשר לשפר ביצועים על ידי הפרדה בין עדכונים חוסמים שחייבים להיות סינכרוניים (כמו הקלדה בשדה קלט) לבין עדכונים לא-חוסמים שלא צריכים לחסום את ממשק המשתמש (כמו עדכון גרף).

כדי לתעדף רינדור, השתמשו באחד מה-Hooks הבאים:

- [`useTransition`](/reference/react/useTransition) יכול לסמן להמשיך state כלא-חוסם ולאפשר לעדכונים אחרים להפריע לו.
- [`useDeferredValue`](/reference/react/useDeferredValue) אפשרות לדחות עדכון של חלק לא-קריטי ב-UI ולאפשר לחלקים אחרים להתעדכן קודם.

---

## משאב Hooks {/*resource-hooks*/}

*משאבים* ניתנים לגישה מתוך קומפונטה גם בלי להיות חלק מה-state שלה. לדוגמה, קומפוננטה יכולה לקרוא הודעה מתוך Promise או עיצוב עיצובי מתוך ההקשר.

כדי לקרוא ערך ממשאב, השתמשו ב-Hook הבא:

- [`use`](/reference/react/use) אפשר לקרוא ערך ממשאב כמו [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) או [context](/learn/passing-data-deeply-with-context).

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## Hooks נוספים {/*other-hooks*/}

ה-Hooks האלה שימוש בעיקר למחברי ספריות, ולא בשימוש נפוץ בקוד אפליקטיבי.

- [`useDebugValue`](/reference/react/useDebugValue) מאפשר להתאים את התווית ש-React DevTools מציג עבור custom Hook.
- [`useId`](/reference/react/useId) יכול לקומפוננטה לשייך לעצמה מזהה ייחודית. לרוב בשילוב עם APIs של נגישות.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) יכול לקומפוננטה להירשם לחנות חיצונית.

---

## Hooks משלכם {/*your-own-hooks*/}

אפשר גם [להגדיר custom Hooks משלכם](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) כפונקציות JavaScript.
