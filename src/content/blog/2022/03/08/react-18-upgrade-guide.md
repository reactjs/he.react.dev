---
title: "כיצד לשדרג ל-React 18"
---

8 במרץ 2022 מאת [ריק הנלון](https://twitter.com/rickhanlonii)

---

<Intro>

כפי שנו ב-[release post](/blog/2022/03/29/react-v18), React 18 הצגת חלק תכלית המופעלות על ידי המעבד החדש שלנו, עם אסטרטגית אימוץ הדרגתית עבור יישומים קיימים. בפוסט זה נדריך אותך בשדרוג ל-React 18.

אנא [דווח על בעיות כלשהן](https://github.com/facebook/react/issues/new/choose) שנתקלת בה בעת השדרוג ל-React 18.

</Intro>

<Note>

עבור React Native users, React 18 יישלח בגרסה עתידית של React Native. זה בגלל שuse React 18 מסתמך על הארכיטקטורה המקורית של React כדי ליהנות מהיכולות החדשות המוצגות בפוסט זה בבלוג. למידע נוסף, ראה [React ההרצאה המרכזית כאן](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

---

## התקנת {/*installing*/}

כדי להתקין את הגרסה האחרונה של React:

```bash
npm install react react-dom
```

או אם אתה משתמש בחוט:

```bash
yarn add react react-dom
```

## עדכונים לעיבוד לקוח APIs {/*updates-to-client-rendering-apis*/}

כאשר תתקין לראשונה את React 18, תראה אזהרה במסוף:

<ConsoleBlock level="error">

ReactDOM.render אינו נתמך עוד ב-React 18. השתמש ב-createRoot במקום זאת. עד שתעבור ל-API החדש, האפליקציה שלך תתנהג כאילו היא פועלת React 17. למידע נוסף: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18 מציג שורש חדש API הספק ארגונומיה טובה יותר לניהול שורשים. השורש החדש API יכול גם את המעבד החדש, המאפשר לך להצטרף לפתרון.

```js
// Before
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
```

שינינו גם את `unmountComponentAtNode` ל-`root.unmount`:

```js
// Before
unmountComponentAtNode(container);

// After
root.unmount();
```

הסרנו גם את ההתקשרות חזרה מעיבוד, מה שבדרך כלל אין לו את התוצאה בעת שימוש ב-Suspense:

```js
// Before
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// After
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

אין תחליף אחד לאחד עבור העיבוד הישן API - זה תלוי במקרה use שלך. עיין בפוסט של קבוצת העבודה עבור [החלפת עיבוד ב-createRoot](https://github.com/reactwg/react-18/discussions/5) למידע נוסף.

</Note>

לבסוף, אם האפליקציה שלך use של עיבוד בצד השרת עם הידרציה, שדרג את `hydrate` ל-`hydrateRoot`:

```js
// Before
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// After
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Unlike with createRoot, you don't need a separate root.render() call here.
```

למידע נוסף, עיין ב[דיון בקבוצת העבודה כאן](https://github.com/reactwg/react-18/discussions/5).

<Note>

**אם האפליקציה שלך לא עובדת לאחר השדרוג, בדוק אם היא עטופה ב-`<StrictMode>`.** [מצב קפדני מחמיר ב-React 18](#updates-to-strict-mode), וייתכן שלא כל הרכיבים שלך יהיו עמידים לבדיקות חדשות שהיא מוסיפה פיתוח במצב. אם הסרת מצב קפדני מסדרת את האפליקציה שלך, תוכל לשלוח אותה לאחר השדרוג, להוסיף אותה בחזרה (בחלק העליון או עבור חלק מהעץ) לאחר שתתקן את הבעיות שהיא מציינת.

</Note>

## עדכונים לעיבוד שרת APIs {/*updates-to-server-rendering-apis*/}

במהדורה זו, אנו משפצים את ה-`react-dom/server` APIs כדי שלנו לתמוך באופן מלא ב-Suspense בשרת וב- Streaming SSR. כחלק משינויים אלה, אנו מוציאים משימוש את הזרמת Node API הישנה, ​​שיינה תומכת בהזרמת Suspense מצטברת בשרת.

שימוש ב-API הזה יזהיר עכשיו:

* `renderToNodeStream`: **הוצא שימוש ⛔️️**

במקום זאת, עבור סטרימינג בסביבות Node, use:
* `renderToPipeableStream`: **חדש ✨**

אנו גם מציגים API חדש לתמיכה בהזרמת SSR עם Suspense עבור סביבות זמן ריצה קצה מודרניות, בין עובדי Deno ו-Cloudflare:
* `renderToReadableStream`: **חדש ✨**

ה-APIs הבאים ימשיכו לעבוד, אך עם תמיכה מוגבלת עבור Suspense:
* `renderToString`: **מוגבל** ⚠️
* `renderToStaticMarkup`: **מוגבל** ⚠️

לבסוף, API זה ימשיך לעבוד לעיבוד הודעות דואר אלקטרוני:
* `renderToStaticNodeStream`

למידע נוסף על השינויים בעיבוד APIs בשרת, ראה את הפוסט של קבוצת העבודה בנושא [שדרוג ל-React 18 בשרת](https://github.com/reactwg/react-18/discussions/22), [צלילה עמוקה בארכיטקטורת Suspense SSR החדשה](https://github.com/reactwg/react-18/discussions/37),ה עמוקה ו-[Shaundai Person_2] Suspense SSR](https://github.com/reactwg/react-18/discussions/37), ו-[Shaundai Person's](__TK_2) Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) ב-React Conf 2021.

## עדכונים להגדרות TypeScript {/*updates-to-typescript-definitions*/}

אם הפרויקט שלך uses TypeScript, תצטרך לעדכן את התלות `@types/react` ו`@types/react-dom` שלך לגרסאות משפטיות. הסוגים החדשים בטוחים יותר ותופסים בעיות שuse יתעלמו מהן על ידי בודק הסוגים. השינוי הבולט ביותר הוא שכעת יש לרשום את הפריט `children` במפורש בעת הגדרת props, לדוגמה:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

ראה את [React 18 בקשת המשיכה של 18 הקלדות](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) לרשימה מלאה של שינויים סטייליים בלבד. הוא קשור לתיקונים לדוגמה בסוגי ספריות כדי לראות איך להתאים את הקוד שלך.

אם אתה מוצא באג בהקלדות, אנא [הגש בעיה](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) ב-repo DefinitelyTyped.

## אצווה אוטומטית {/*automatic-batching*/}

React 18 מוסיף שיפורי ביצועים מחוץ לקופסה על ידי ביצוע יותר אצווה כבר מחדל. אצווה היא כאשר React מקבץ עדכוני state מרובים לעיבוד מחדש יחיד לביצועים טובים יותר. לפני React 18, צירפנו רק עדכונים בתוך מטפלי אירועים של React. עדכונים בתוך הבטחות, setTimeout, מטפל אירועים מקוריים או כל אירוע אחר לא צורפו ב-React כברירת מחדל:

```js
// Before React 18 only React events were batched

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);
```


החל מ-React 18 עם `createRoot`, כל העדכונים יצטברו באופן אוטומטי, לא משנה מהיכן הם מגיעים. משמעות הדבר היא שעדכונים בתוך פסק זמן, הבטחות, רופא אירועים מקוריים או כל אירוע אחר יתבצע באותו אופן כמו עדכונים אירועי React:

```js
// After React 18 updates inside of timeouts, promises,
// native event handlers or any other event are batched.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

זהו שינוי שובר, אך אנו מצפים שזה יביא לעיבוד פחות עבודה, ביצועים טובים יותר. כדי לבטל את הסכמתך לאיסוף אוטומטי, אתה יכול use `flushSync`:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

למידע נוסף, ראה [צלילת אצווה עמוקה אוטומטית](https://github.com/reactwg/react-18/discussions/21).

## APIs חדשות לספריות {/*new-apis-for-libraries*/}

בקבוצת העבודה React 18 עבדנו עם מנהלי ספריות כדי ליצור APIs חדשים הדרושים כדי לתמוך בעיבוד מקביל עבור use מקרים מיוחדים למארז use שלהם אזורים כמו סגנונות וחנויות חיצוניות. כדי לתמוך ב-React 18, אפשר שחלק מהספריות יצטרכו לעבור לאחד מה-APIs הבאים:

* `useSyncExternalStore` הוא Hook חדש המאפשר לחנויות חיצוניות לתמוך בקריאה במקביל על ידי אילוץ עדכונים לחנות להיות סינכרוניים. API חדש זה מומלץ לכל ספרייה השתלבת עם state חיצונית ל-React. למידע נוסף, עיין ב[useSyncExternalStore פוסט סקירה](https://github.com/reactwg/react-18/discussions/70) ו-[useSyncExternalStore API פרטים](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` הוא Hook חדש המאפשר לספריות CSS-in-JS לטפל בבעיות ביצועים של הזרקת סגנונות בעיבוד. אלא אם כן כבר בנית ספריית CSS-in-JS, אנחנו לא מצפים ממך אי פעם use זה. Hook זה יפעל לאחר שה-DOM יעבור מוטציה, אך לפני אפקטי פריסה קרא את הפריסה החדשה. זה פותר בעיה שכבר קיימת ב-React 17 ומטה, אך חשובה עוד יותר ב-React 18 כי use React תשואות לדפדפן במהלך עיבוד במקביל, מה שנותן לו הזדמנות לחשב מחדש את הפריסה. למידע נוסף, עיין ב[מדריך לשדרוג הספרייה עבור `<style>`](https://github.com/reactwg/react-18/discussions/110).

React 18 מציג גם APIs חדשות לעיבוד מקביל כמו `startTransition`, `useDeferredValue` ו`useId`, עליהם אנו חולים עוד ב-[release post](/blog/2022/03/29/react-v18).

## עדכונים מצב קפדני {/*updates-to-strict-mode*/}

אפשר, נרצה להוסיף תכונה המאפשרת ל-React להוסיף ולהסיר חלקים של ממשק המשתמש תוך שמירה על state. לדוגמה, כאשר user מתרחק מהמסך ובחזרה, React אמור להיות מסוגל להסתכל מיד את המסך הקודם. לשם כך, React יבטל את הטעינה והרכבה מחדש של עצים באמצעות אותו רכיב state כמו קודם.

תכונה זו תעניק ל-React ביצועים טובים יותר מהקופסה, אך מחייבת רכיבים להיות עמידים בפני אפקטים שהוא תקנו והושמדו מספר פעמים. רוב האפקטים יפעלו ללא כל שינוי, אבל חלק מהאפקטים מנחים שהם מוקנים או מושמדים רק פעם אחת.

כדי לעזור לשטח את הבעיות הללו, React 18 מציג בדיקה חדשה לפיתוח בלבד מצב קפדני. הסימון החדש הזה יבטל את הטעינה והרכבה מחדש של כל רכיב, בכל פעם שרכיב נטען בפעם הראשונה, וישחזר את ה-state הקודם בהרכבה השנייה.

לפני השינוי הזה, React היה מעלה את הרכיב ויוצר את האפקטים:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
```

עם מצב קפדני ב-React 18, React ידמה ביטול הרכבה והרכבה מחדש של הרכיב במצב פיתוח:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates unmounting the component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates mounting the component with the previous state.
    * Layout effect setup code runs
    * Effect setup code runs
```

למידע נוסף, עיין בפוסטים של קבוצת העבודה עבור [הוספת מצב חוזר חוזר ל-StrictMode](https://github.com/reactwg/react-18/discussions/19) ו-[כיצד לתמוך במצב בר-שימוש חוזר בהשפעות](https://github.com/reactwg/react-18/discussions/18).

## הגדרת סביבת הבדיקה שלך {/*configuring-your-testing-environment*/}

כשתעדכן לראשונה את הבדיקה שלך ל-use `createRoot`, אפשר שתראה אזהרה זו במסוף הבדיקה שלך:

<ConsoleBlock level="error">

סביבת הבדיקה הנוכחית מוגדרת לתמוך ב-act(...)

</ConsoleBlock>

כדי לתקן זאת, הגדר את `globalThis.IS_REACT_ACT_ENVIRONMENT` ל-`true` לפני הפעלת הבדיקה שלך:

```js
// In your test setup file
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

מטרת הדגל לומר היא ל-React שהוא פועל בסביבה דמוית בדיקה של יחידה. React ירשום אזהרות מועילות אם תשכח לעטוף עדכון עם `act`.

אתה יכול גם להגדיר את הדגל ל-`false` כדי לומר ל-React שאין צורך ב-`act`. זה יכול להיות useמלא עבור בדיקות מקצה לקצה המדמות סביבת דפדפן מלאה.

בסוף דבר, אנו מצפים שספריות בדיקה יגדירו זאת באופן אוטומטי. לדוגמה, [הגרסה הבאה של React ספריית בדיקות כוללת תמיכה מובנית עבור React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) ללא כל תצורה נוספת.

[רקע נוסף על בדיקת `act` API ושינויים קשורים] (https://github.com/reactwg/react-18/discussions/102) זמין בקבוצת העבודה.

## ביטול התמיכה עבור Internet Explorer {/*dropping-support-for-internet-explorer*/}

במהדורה זו, React מפסיקה את התמיכה ב-Internet Explorer, [הפסקת התמיכה ב-15 ביוני 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). אנו מבצעים את השינוי הזה עכשיו שuse תכונות חדשות שהוצגו ב-React 18 נבנות שלא באמצעות תכונות דפד כפנויות ב-IE.

אם אתה צריך לתמוך ב-Internet Explorer, אנו ממליצים להישאר עם React 17.

## הוצאה שימוש {/*deprecations*/}

* `react-dom`: `ReactDOM.render` הוצא משימוש. עבודה בו יזהיר ויפעיל את האפליקציה שלך במצב React 17.
* `react-dom`: `ReactDOM.hydrate` הוצא משימוש. עבודה בו יזהיר ויפעיל את האפליקציה שלך במצב React 17.
* `react-dom`: `ReactDOM.unmountComponentAtNode` הוצא משימוש.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` הוצא משימוש.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` הוצא משימוש.

## שינויים חוזרים אחרים {/*other-breaking-changes*/}

* **תזמון useEffect עקבי**: React מסלק באופן אוטומטי סינכרון את הפונקציות האפקט אם עדכון הפעל אירוע קלט נפרד של user קליק קליק או אירוע מקלדת. בעבר, ההתנהגות לא תמיד הייתה צפויה או עקבית.
* **שגיאות היד מחמירות**: איותר התאמה של הידרציה עקב תוכן טקסט חסר או מי מטופלות עכשיו כשגיאות במקום אזהרות. React לא ינסה עוד "לתקן" צמתים בודדים על ידי הכנסה או מחיקה של צומת לקוח בניסיון להתאים את סימון השרת, ויחזור לעיבוד לקוח עד לגבול `<Suspense>` הקרוב ביותר בעץ. זה מבטיח שהעץ המשתלח יהיה עקבי ונמנע מחורים פוטנציאליים של פרטיות ואבטחה שיכולים להיגרם כused על ידי אי התאמה של הידרציה.
* **Suspense עצים תמיד עקביים:** אם רכיב מושהה לפני שהוא מתווסף לגמרי לעץ, React לא יוסיף אותו לעץ ב-state לא שלם או יפעיל את ההשפעות שלו. במקום זאת, React יזרוק את העץ החדש לחלוטין, ימתין לסיום פעולה הא-סינכרונית, ואז ינסה שוב לעבד שוב מאפס. React יציג את ניסיון החוזר בעבודה, ומבלי לחסום את הדפדפן.
* **אפקטי פריסה עם Suspense**: כאשר עץ מושהה מחדש וחוזר ל-fallback, React ינקה כעת כאשר אפקטי פריסה, הוא ייצור אותם מחדש כאשר התוכן בתוך הגבול יוצג שוב. זה פותר בעיה שמנעה מספריות רכיבים למדוד נכון את הפריסה כאשר used עם Suspense.
* **דרישות סביבת JS חדשות**: React תלוי כעת בשימוש הדפדפנים מודרניות כולל `Promise`, `Symbol` ו-`Object.assign`. אם אתה תומך בדפדפנים ובמכשירים יש יותר כגון Internet Explorer צור אותם מספקים תכלית דפדפן מודרנית מקורי או שיש יישומים מזמינים תואמים, שכלול polyfill גלובלי ביישום המף שלך.

## שינויים בולטים אחרים {/*other-notable-changes*/}

### React {/*react*/}

* **רכיבים יכולים לעבד את `undefined`:** React כבר לא מזהיר אם אתה מחזיר `undefined` צריך. זה יוצר את ערכי החזרת הרכיב המותר לעולים בקנה אחד עם הערכים המותרים באמצע רכיבי עץ. אנו מציעים use לנטר כדי למנוע טעויות כמו שכחת `return` statement לפני JSX.
* **בבדיקות, אזהרות `act` הן כרגע הסכמה:** אם אתה מפעיל בדיקות מקצה לקצה, אזהרות `act` אינן נחוצות. הצגנו מנגנון [הצטרפות](https://github.com/reactwg/react-18/discussions/102) כך אתם צריכים להפעיל אותם רק עבור בדיקות יחידה שבהן הם use מועילים.
* **אין אזהרה לגבי `setState` על רכיבים לא מורכבים:** בעבר, React הזהיר על דליפות memory כאשר אתה קורא ל-`setState` על רכיב לא מותקן. אזהרה זו נוספה עבור מנויים, אבל נתקלים בה בעיקר בתרחישים היא הגדרת הגדרה `setState` בסדר, ופתרונות עוקים מחמירים את הקוד. [הסרנו](https://github.com/facebook/react/pull/22114) אזהרה זו.
* **אין דיכוי של יומני מסוף:** כאשר אתה use מצב קפדני, React מעבד כל רכיב פעמיים כדי לעזור לך למצוא לוואי בלתי צפויות. ב-React 17, דיחקנו את יומני המסוף עבור אחד משני העיבודים כדי להקל על הקריאה של היומנים. בתגובה ל-[משוב מהקהילה](`undefined` לגבי זה מבלבל, הסרנו את הדיכוי. במקום זאת, אם התקנתם את React DevTools, העיבודים של היומן השני יוצגו באפור, ותהיה אפשרות (כבוי כברירת מחדל) לדכא אותם לחלוטין.
* **שימוש משופר ב-memory:** React מנקה עכשיו שדות פנימיות נוספות בעת ביטול הרכבה, מה שהופך את ההשפעה של דליפות memory לא מתוקנות שעשויות להתקיים בקוד האפליקציה שלך פחות חמורה.

### React DOM שרת {/*react-dom-server*/}

* **`renderToString`:** לא ישוגה עוד בזמן השעיה בשרת. במקום זאת, הוא יפלוט את ה-fallback HTML עבור גבול `<Suspense>` הקרוב ביותר כאשר ינסה שוב לעבד אותו תוכן בלקוח. עדיין מומלץ לעבור לסטרימינג API כמו `renderToPipeableStream` או `renderToReadableStream` במקום זאת.
* **`renderToStaticMarkup`:** לא ישוגה עוד בזמן השעיה בשרת. במקום זאת, הוא יפלוט את ה-fallback HTML עבור גבול `<Suspense>` הקרוב ביותר.

## יומן שינויים {/*changelog*/}

אתה יכול לראות את [יומן השינויים המלא כאן](https://github.com/facebook/react/blob/main/CHANGELOG.md).
