---
id: hooks-reference
title: עיון ב-Hooks API
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hooks* הם תוספת חדשה ב-React 16.8. הם נותנים לנו להשתמש ב-state ופיצ'רים אחרים של React מבלי לכתוב מחלקה.

עמוד זה מתאר את ה-APIs של ה-Hooks המובנים בתוך React.

אם הנושא של Hooks חדש לך, יכול להיות שתרצה לקרוא את [הסקירה הכללית](/docs/hooks-overview.html) קודם. יכול להיות שתמצא מידע שימושי [בסעיף שאלות נפוצות](/docs/hooks-faq.html).

- [Hooks בסיסיים](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Hooks נוספים](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## Hooks בסיסיים {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

מחזיר ערך stateful, ופונקציה על מנת לעדכן אותו.

בזמן הרינדור הראשוני, ה-state המוחזר (`state`) הוא שווה ערך לערך המועבר כארגומנט הראשון (`initialState`).

פונקציית ה-`setState` משמשת לעדכון ה-state. היא מקבלת ערך state חדש וקובעת רינדור מחדש של הקומפוננטה.

```js
setState(newState);
```

בזמן הרינדורים העוקבים, הערך הראשון שמוחזר על ידי `useState` תמיד יהיה ה-state האחרון לאחר יישום העדכונים.

>הערה
>
>React מבטיח שזהות פונקציית ה-`setState` יציבה ולא תשתנה בין רינדורים. זאת הסיבה שזה בטוח להשמיט

#### עדכונים פונקציונליים {#functional-updates}

אם ה-state החדש חושב באמצעות ה-state הקודם, ניתן להעביר פונקציה ל-`setState`. הפונקציה תקבל את הערך הקודם, ותחזיר ערך מעודכן. הנה דוגמה של קומפוננטת counter שמשתמשת בשתי הצורות של `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

כפתורי ה-"+" וה-"-" משתמשים בצורה הפונקציונלית, בגלל שהערך המעודכן מבוסס על הערך הקודם. אבל כפתור ה"Reset" משתמש בצורה הרגילה, בגלל שהוא תמיד מעדכן את הספירה חזרה לערך ההתחלתי.

> הערה
אם הפונקציה מחזירה ערך שווה לזה שקיים ב-state הנוכחי, הרינדור הבא ידולג לגמרי.
>
> בשונה ממתודת ה-`setState` שנמצאת בקומפוננטות מחלקה, `useState` לא ממזגת עדכוני אובייקטים באופן אוטומטי. ניתן לחקות התנהגות זו על ידי שילוב של מעדכן פונקציה עם אופן הכתיבה של object spread(שלוש נקודות '...'):
>
> ```js
> setState(prevState => {
>   // Object.assign גם יעבוד
>   return {...prevState, ...updatedValues};
> });
> ```
>
> אופציה נוספת היא `useReducer`, שמתאים יותר לניהול אובייקטי(objects) state שמכילים מספר רב של תת-ערכים.

#### Initial state עצלן {#lazy-initial-state}

הארגומנט `initialState` הוא ה-state שהשתמשנו בו ברינדור הראשון. ברינדורים עוקבים, מתעלמים ממנו. אם ה-state ההתחלתי הוא התוצאה של חישוב יקר, ניתן לספק פונקציה במקום, שתרוץ רק ברינדור ההתחלתי:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### יציאה מעדכון state {#bailing-out-of-a-state-update}

אם אתה מעדכן State Hook לערך ששווה לערך הנוכחי, React יצא מהפעולה מבלי רינדור הילדים או יריית אפקטים. (React משתמש [באלגוריתם ההשוואה `Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

שים לב שיכול להיות ש-React יצטרך לרנדר את הקומפוננטה הספציפית הזו לפני יציאה מהפעולה. זה לא אמור להיות מדאיג בגלל ש-React לא ילך שלא כצורך "עמוק" לתוך העץ. אם אתה מבצע חישובים יקרים בזמן רינדור, ניתן למטב אותם עם `useMemo`.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

מקבלת פונקציה שמכילה קוד חיוני, שכנראה גורם לאפקט כלשהו.

Mutations, subscriptions, טיימרים, לוגים, ותופעות לוואי אחרים לא מורשים בתוך ה-main body של קומפוננטת פונקציה (המכונה _שלב הרינדור_ של React). אי ציות לכך יגרום לבאגים מבלבלים ואי עקביות בממשק המשתמש.

במקום זאת, השתמש ב-`useEffect`. הפונקציה המועברת ל-`useEffect` תרוץ אחרי שהרינדור מופיע על המסך. ניתן לחשוב על אפקטים כפתח מילוט מהעולם הפונקציונלי של React לתוך העולם האימפרטיבי.

כברירת מחדל, אפקטים רצים אחרי כל רינדור שמסתיים, אבל ניתן לבחור להריץ אותם [רק כשערכים מסוימים שונו](#conditionally-firing-an-effect).

#### ניקוי אפקט {#cleaning-up-an-effect}

לעיתים קרובות, אפקטים יוצרים משאבים שדורשים ניקוי לפני שהקומפוננטה עוזבת את המסך, כמו subscription או timer ID. על מנת לעשות זאת, הפונקציה המועברת ל-`useEffect` תחזיר פונקציית נקיון. לדוגמה, על מנת ליצור subscription:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // ניקוי ה-subscription
    subscription.unsubscribe();
  };
});
```

פונקציית הנקיון רצה לפני הסרת הקומפוננטה מממשק המשתמש על מנת למנוע דליפות זיכרון. בנוסף לכך, אם קומפוננטה מתרנדרת מספר רב של פעמים (כמו שבדרך כלל קורה), **האפקט הקודם מנוקה לפני הרצת האפקט הבא**. בדוגמה שלנו, זה אומר ש-subscription חדש נוצר בכל עדכון. על מנת להימנע מיריית אפקט על כל עדכון, קרא את החלק הבא.

#### תזמון אפקטים {#timing-of-effects}

בשונה מ-`componentDidMount` ו-`componentDidUpdate`, הפונקציה שמועברת ל-`useEffect` נורה **לאחר** פריסה וצביעה(layout and paint), בזמן אירוע נדחה. זה עושה את זה מתאים להרבה תופעות לוואי, כמו הכנת subscriptions ו- event handlers, בגלל שרוב סוגי העבודה לא חוסמים את הדפדפן מלעדכן את המסך.

למרות זאת, לא ניתן לעכב את כל האפקטים. לדוגמה, מוטציית DOM שגלויה למשתמש צריכה להיות נורה באופן סינכרוני לפני הצבע הבא כך שהמשתמש לא יבחין בחוסר עקביות חזותי. (ההבחנה דומה מבחינה קונספטואלית למאזינים לאירועים פסיביים לעומת פעילים). בשביל סוגי האפקטים האלה, React מספק Hook נוסף שנקרא [`useLayoutEffect`](#uselayouteffect). יש לו את אותה חתימה כ-`useEffect`, ושונה ממנו כשהוא נורה.

אף על פי ש-`useEffect` מתעכב על שהדפדפן נצבע, זה מובטח שהוא נורה לפני רינדורים חדשים. React תמיד ינקה אפקטים של רינדורים קודמים לפני החלת עדכון חדש.

#### יריית אפקט לפי תנאי {#conditionally-firing-an-effect}

ההתנהגות הרגילה של אפקטים היא לירות את האפקט לאחר כל רינדור שהושלם. בדרך זו אפקט תמיד נוצר מחדש אם אחד מה-dependencies שלו משתנה.

למרות זאת, זה יכול להיות יותר מדי במקרים מסוימים, כמו דוגמת ה-subscription מהקטע הקודם. אנחנו לא צריכים ליצור subscription חדש על כל עדכון, רק אם ה-prop `source` שונה.

על מנת ליישם זאת, העבר ארגומנט שני ל-`useEffect` שהוא מערך של ערכים שהאפקט תלוי בהם. הדוגמה המעודכנת שלנו נראית כמו זה:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

עכשיו ה-subscription ייווצר מחדש רק כש-`props.source` משתנה.

>הערה
>
>אם אתה משתמש באופטימיזציה זו, וודא כי המערך מכיל **את כל הערכים מ-scope הקומפוננטה (כמו props ו-state) שמשתנים לאורך זמן ושהאפקט משתמש בהם**. אחרת, הקוד שלך יתייחס לערכים ישנים מרינדורים קודמים. למד עוד על [על איך לטפל בפונקציות](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) ומה לעשות [כשערכי המערך משתנים בתדירות גבוהה מדי](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>אם אתה רוצה להריץ אפקט ולנקות אותו רק פעם אחת (ב-mount ו-unmount), תוכל להעביר מערך ריק ( [] ) כארגומנט שני. זה אומר ל-React שהאפקט שלך לא תלוי *בשום* ערך מה-props או state, כך שהוא לא צריך לרוץ מחדש. זה לא מטופל כמקרה מיוחד – זה עובד כמו שמערך ה-dependencies תמיד עובד.
>
>אם אתה מעביר מערך ריק ( [] ), ה-props ו-state בתוך האפקט תמיד יכילו את הערכים ההתחלתיים שלהם. בזמן שהעברת `[]` כארגומנט שני יותר קרוב ל-`componentDidMount` ו-`componentWillUnmount` כמודל מנטלי, יש פתרונות [טובים](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [יותר](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) שעוזרים להימנע מהרצה מחדש של אפקטים בתדירות גבוהה מדי. בנוסף, אסור לשכוח ש-React מעכב הרצה של `useEffect` עד לאחר שהדפדפן נצבע, אז עשיית עבודה נוספת היא פחות בעיה.
>
>
>אנו ממליצים על שימוש בחוק [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) כחלק מחבילת ה- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) שלנו. הוא מזהיר מפני dependencies שמוגדרים לא נכון ומציע תיקון.

מערך ה-dependencies לא מועבר כארגומנטים לפונקציית האפקט. אבל באופן עקרוני, זה מה שהם מייצגים: כל ערך שמצוין בתוך פונקציית האפקט צריך להופיע במערך ה-dependencies. בעתיד, קומפיילר מתקדם יוכל ליצור את המערך באופן אוטומטי.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

מקבל אובייקט context (הערך המוחזר מ-`React.createContext`) ומחזיר את ערך ה-context הנוכחי לאותו context. ערך ה-context הנוכחי נקבע על ידי ה-prop `value` של `<MyContext.Provider` מעל הקומפוננטה הקוראת בעץ.

כש-`<MyContext.Provider>` מעל הקומפוננטה מתעדכן, ה-Hook מפעיל מרנדר עם `value` האחרון של ה-context, ואותו ערך מועבר ל- `MyContext` Provider.

אל תשכח שהארגומנט של `useContext` צריך להיות *אובייקט ה-context עצמו*:

**נכון:** `useContext(MyContext)`
**לא נכון:** `useContext(MyContext.Consumer)`
**לא נכון:** `useContext(MyContext.Provider)`

קומפוננטה שקוראת ל-`useContext` תמיד תתרנדר מחדש כשערך ה-context ישתנה. אם רינדור מחדש של הקומפוננטה הוא יקר, ניתן [למטב אותו על ידי שימוש ב-memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>טיפ
>
>אם אתה מכיר את ה-context API לפני Hooks, `useContext(MyContext)` הוא שווה ל-`static contextType = MyContext` במחלקה, או ל-`<MyContext.Consumer>`.
>
>`useContext(MyContext)` נותן לנו רק *לקרוא* את ה-context ולעשות subscribe לשינויים שלו. נצטרך עדיין `<MyContext.Provider>` מעל בעץ על מנת *לספק* את הערך ל-context זה.

## Hooks נוספים {#additional-hooks}

ה-Hooks הבאים הם או צורות אחרות של הבסיסיים מהסעיף הקודם, או כאלה שנצטרך רק במקרי קצה ספציפיים. לא צריך להילחץ מללמוד אותם בהתחלה.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

אלטרנטיבה ל-[`useState`](#usestate). מקבל reducer מסוג `(state, action) => newState`, ומחזיר את ה-state הנוכחי ביחד עם מתודת `dispatch`. (אם התעסקת בעבר עם Redux, זה כבר מוכר לך).

בדרך כלל `useReducer` עדיף על `useState` כשיש לך לוגיקת state מורכבת שמערבת מספר רב של תת-ערכים או כשה-state הבה תלוי ב-state הקודם. `useReducer` גם נותן לנו למטב ביצועים לקומפוננטות שמפעילות עדכונים עמוקים בגלל שניתן [להעביר את dispatch מטה במקום callbacks](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

הנה דוגמת ה-counter מהקטע הקודם על [`useState`](#usestate), נכתב מחדש עם שימוש ב-reducer:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>הערה
>
>React מבטיח שזהות פונקציית `dispatch` היא קבועה ולא תשתנה ברינדורים חוזרים. זאת הסיבה שזה בטוח להשמיט מרשימת ה-dependency של `useEffect` או `useCallback`.

#### ציון ה-state ההתחלתי {#specifying-the-initial-state}

ישנם שתי דרכים שונות לאתחל `useReducer` state. ניתן לבחור אחד מהם תלוי בשימוש. הדרך הפשוטה ביותר היא להעביר את ה-state ההתחלתי כארגומנט שני:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>הערה
>
>React לא משתמש במוסכמת הארגומנט `state = intialState` בניגוד ל-Redux. הערך ההתחלתי לפעמים תלוי ב-props ומכאן שהוא מוגדר בקריאת ה-Hook. אם זה לא לטעמך, ניתן לקרוא ל-`useReducer(reducer, undefined, reducer)` על מנת לחקות את התנהגות Redux, אבל זה לא מומלץ.

#### אתחול עצלן {#lazy-initialization}

ניתן גם ליצור state התחלתי בעצלתיים. על מנת לעשות זאת, ניתן להעביר פונקציית `init` כארגומנט שלישי. ה-state ההתחלתי ייקבע ל-`init(initialArg)`.

זה נותן לנו לחלץ את הלוגיקה לחישוב ה-state ההתחלתי מחוץ ל-reducer. זה גם שימושי לאיפוס ה-state לאחר מכן כתגובה לפעולה(action):

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### יציאה מ-dispatch {#bailing-out-of-a-dispatch}

אם אתה מעדכן State Hook לערך ששווה לערך הנוכחי, React יצא מהפעולה מבלי רינדור הילדים או יריית אפקטים. (React משתמש [באלגוריתם ההשוואה `Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

שים לב שיכול להיות ש-React יצטרך לרנדר את הקומפוננטה הספציפית הזו לפני יציאה מהפעולה. זה לא אמור להיות מדאיג בגלל ש-React לא ילך שלא כצורך "עמוק" לתוך העץ. אם אתה מבצע חישובים יקרים בזמן רינדור, ניתן למטב אותם עם `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

מחזיר [memoized callback](https://en.wikipedia.org/wiki/Memoization).

העבר callback ומערך של dependencies. `useCallback` תחזיר גרסה memorized של ה-callback שמשתנה רק אם אחד מה-dependencies משתנה. זה שימושי כשמעבירים callbacks לקומפוננטות ילדים ממוטבות שמסתמכות על השוואה לפי אזכור על מנת למנוע רינדורים מיותרים (לדוגמה `shouldComponentUpdate`).

`useCallback(fn, deps)` שווה ל-`useMemo(() => fn, deps)`.

> הערה
>
> מערך ה-dependencies לא מועבר כארגומנטים לפונקציית האפקט. אבל באופן עקרוני, זה מה שהם מייצגים: כל ערך שמצוין בתוך פונקציית האפקט צריך להופיע במערך ה-dependencies. בעתיד, קומפיילר מתקדם יוכל ליצור את המערך באופן אוטומטי.
>
>אנו ממליצים על שימוש בחוק [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) כחלק מחבילת ה- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) שלנו. הוא מזהיר מפני dependencies שמוגדרים לא נכון ומציע תיקון.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

מחזיר [ערך memoized](https://en.wikipedia.org/wiki/Memoization).

העבר פונקציית "create" ומערך של dependencies. `useMemo` תחשב מחדש רק את הערך ה-memoized כשאחד מה-dependencies שונה. מיטוב זה עוזר להימנע מחישובים יקרים בכל רינדור.

זכור כי הפונקציה שמועברת ל-`useMemo` רצה בזמן רינדור. אל תעשה דברים בתוכה שלא היית עושה בדרך כלל בזמן רינדור. לדוגמה, side effects שייכים ל-`useEffect`, לא `useMemo`.

אם סופק מערך כלשהו, ערך חדש יחושב בכל רינדור.

**ניתן להסתמך על `useMemo` כמיטוב ביצועים, לא כערבות סמנטית.** בעתיד, יכול להיות ש-React יבחר "לשכוח" חלק מהערכים ה-memoized ויחשב אותם מחדש ברינדור הבא, לדוגמה, על מנת לשחרר זיכרון לקומפוננטות offscreen. כתוב את הקוד שלך כך שהוא יעבוד בלי `useMemo` -- ואז תוסיף אותו על מנת למטב ביצועים.

> הערה
>
> מערך ה-dependencies לא מועבר כארגומנטים לפונקציית האפקט. אבל באופן עקרוני, זה מה שהם מייצגים: כל ערך שמצוין בתוך פונקציית האפקט צריך להופיע במערך ה-dependencies. בעתיד, קומפיילר מתקדם יוכל ליצור את המערך באופן אוטומטי.
>
> אנו ממליצים על שימוש בחוק [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) כחלק מחבילת ה- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) שלנו. הוא מזהיר מפני dependencies שמוגדרים לא נכון ומציע תיקון.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` מחזיר אובייקט ref שניתן לשינוי שמאפיין ה-`.current` שלו מאותחל לארגומנט המועבר (`intialValue`). האובייקט המוחזר יתמיד לכל מחזור החיים של הקומפוננטה.

מקרה שימוש נפוץ הוא לגשת לילד כשרוצים:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` מצביע על אלמנט ה-text input 
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

במהותו, `useRef` הוא כמו "קופסה" שיכולה להחזיק ערך שניתן לשינוי בתוך מאפיין ה-`.current`.

אולי אתה מכיר refs בעיקר כדרך [לגשת ל-DOM](/docs/refs-and-the-dom.html). אם אתה מעביר אובייקט ref ל-React עם `<div ref={myRef}`, React יקבע את מאפיין ה-`.current` ל-DOM node המקביל כשאותו node משתנה.

למרות זאת, `useRef()` שימושי ליותר מתכונת ה-`ref`. הוא [שימושי לשמירת כל ערך שניתן לשינוי](/docs/hooks-faq.html#is-there-something-like-instance-variables) בדומה לדרך שהיית משתמש ב-instance fields במחלקות.

זה עובד בגלל ש`useRef()` יוצר אובייקט ג'אווהסקריפט פשוט. ההבדל היחיד בין `useRef()` ויצירת אובייקט `{current: …}` בעצמך היא ש-`useRef()` ייתן לך את אותו אובייקט ref בכל רינדור.

זכור ש-`useRef()` *לא* מודיע לך כשהתוכן שלו משתנה. שינוי של המאפיין `.current` לא גורם לרינדור מחדש. אם אתה רוצה להריץ קוד כש-React מצרף או מנתק ref מ-DOM node, אולי תרצה להשתמש ב-[callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) במקום.


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` מתאים אישית את הערך ה-instance שנחשף לקומפוננטות הורה בשימוש `ref`. כמו תמיד, כדאי להימנע מקוד אימפרטיבי בשימוש refs ברוב המקרים. כדאי להשתמש ב-`useImperativeHandle` עם `forwardRef`:

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

בדוגמה זו, קומפוננטת הורה שמרנדרת `<FancyInput ref={fancyInputRef} />` צריכה להיות מסוגלת לקרוא ל-`fancyInputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

מאפיין זה זהה ל-`useEffect`, אבל הוא יורה באופן סינכרוני לאחר כל שינויי DOM. השתמש בזה על מנת לקרוא layout מתוך ה-DOM ולרנדר מחדש באופן סינכרוני. עדכונים מתוזמנים בתוך `useLayoutEffect` ישטפו באופן סינכרוני, לפני שלדפדפן יש הזדמנות לצבוע.

העדף את `useEffect` הסטנדרטי מתי שאפשר על מנת להימנע מחסימת עדכונים ויזואליים. 

> טיפ
>
> אם אתה מזיז קוד מקומפוננטת מחלקה, שים לב ש-`useLayoutEffect` יורה באותו קצב כמו `componentDidMount` ו-`componentDidUpdate`. לעומת זאת, **אנו ממליצים להתחיל עם `useEffect` קודם** ולנסות את `useLayoutEffect` רק אם זה יוצר בעיה.
>
>אם אתה משתמש ב-server rendering, שים לב *שגם* `useLayoutEffect` וגם `useEffect` יכולים לרוץ עד שהג'אווהסקריפט הורד. זאת הסיבה ש-React מזהיר כשקומפוננטה שהיא server-rendered מכילה `useLayoutEffect`. על מנת לתקן זאת, או שתעביר את הלוגיקה ל-`useEffect` (אם זה לא נחוץ לרינדור הראשון), או המתן עם הצגת הקומפוננטה עד לאחר רינדור הקליינט (אם ה-HTML נראה שבור עד ש-`useLayoutEffect` רץ).
>
>על מנת להדיר קומפוננטה שצריכה layout effects מ-server-rendered HTML, רנדר אותה בתנאי עם `showChild && <Child />` ועכב את הצגתה עם `useEffect(() => { setShowChild(true); }, [])`. בדרך זו, ממשק המשתמש לא מופיע שבור לפני הידרציה.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

ניתן להשתמש ב-`useDebugValue` על מנת להציג label ל-hooks מותאמים אישית ב-React DevTools.

לדוגמה, שקול את ה-hook `useFriendStatus` שמתואר [ב"בניית Hooks משלך"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // הראה label ב-DevTools ליד ה-Hook הזה
  // לדוגמה "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> טיפ
>
> אנו לא ממליצים להוסיף ערכי debug לכל Hook מותאם אישית. זה נחוץ במיוחד ל-Hooks מותאמים אישית שחלק מספריות משותפות.

#### דחה formatting של ערכי debug {#defer-formatting-debug-values}

במקרים מסוימים לבצע formatting לערך יכול להיות פעולה יקרה. זה גם לא נחוץ אלא אם ה-Hook נבדק.

מסיבה זו `useDebugValue` מקבל פונקציית formatting כפרמטר שני אופציונלי. קוראים לפונקציה זו רק אם ה-Hooks נבדקים. היא מקבלת את ערך ה-debug כפרמטר וצריכה להחזיר ערך הצגה שעבר formatting.

לדוגמה Hook מותאם אישית שמחזיר ערך `Date` יוכל להימנע מלקרוא לפונקציית `toDateString` באופן לא נחוץ על ידי העברת ה-formatter הבא:

```js
useDebugValue(date, date => date.toDateString());
```
