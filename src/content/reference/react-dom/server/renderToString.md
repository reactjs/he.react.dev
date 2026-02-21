---
title: "renderToString"
---

<Pitfall>

`renderToString` לא תומכת ב-streaming או בהמתנה לנתונים. [ראו חלופות.](#alternatives)

</Pitfall>

<Intro>

`renderToString` מרנדרת עץ React למחרוזת HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

בשרת, קראו ל-`renderToString` כדי לרנדר את האפליקציה שלכם ל-HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

בצד, קראו ל-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) כדי להפוך את ה-HTML בשרת לאינטראקטיביות.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `reactNode`: React צומת שברצונכם לרנדר ל-HTML. למשל, צומת JSX כמו `<App />`.

* **אופציונלי** `options`: אובייקט עבור רינדור שרת.
  * **אופציונלי** `identifierPrefix`: מחרוזת קידומת ש-React משתמשת בה עבור מזהים עובדים על ידי [`useId`.](/reference/react/useId) שימושי למניעת התנגשויות כשמשתמשים בכמה שורשים באותו עמוד. חייב להיות זהה לקידומת שמועברת ל-[`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### מחזירה {/*returns*/}

מחרוזת HTML.

#### אזהרות {/*caveats*/}

* ל-`renderToString` יש תמיכה מוגבלת ב-Suspense. אם פונתה מבצעת suspend, `renderToString` שולחת מיד את ה-fallback שלה כ-HTML.

* `renderToString` עובדת בדפדפן, אבל שימוש בה בקוד לקוח [לא מומלץ.](#removing-rendertostring-from-the-client-code)

---

## שימוש {/*usage*/}

### רינדור עץ React כ-HTML למחרוזת {/*rendering-a-react-tree-as-html-to-a-string*/}

קראו ל-`renderToString` כדי לרנדר את האפליקציה שלכם למחרוזת HTML אפשר לשלוח בתגובת השרת:

```js {5-6}
import { renderToString } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

כך יתקבל פלט ה-HTML הראשוני הלא אינטראקטיבי של קומפונטות React שלכם. בצד תצטרכו לקרוא ל-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) כדי לבצע *hydration* ל-HTML בשרת ולהפוך אותו לאינטראקטיבי.


<Pitfall>

`renderToString` לא תומכת ב-streaming או בהמתנה לנתונים. [ראו חלופות.](#alternatives)

</Pitfall>

---

## חלופות {/*alternatives*/}

### המשך מ-`renderToString` למתודת הזרמת בצד שרת {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` מחזירה מחרוזת מיד, לא תומכת ב-streaming או בהמתנה לנתונים.

כשאפשר, מומלץ להשתמש בחלופות המלאות האלה:

* אם אתם משתמשים ב-Node.js, השתמשו ב-[`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* אם אתם משתמשים ב-Deno או זמן ריצה מודרני של edge עם [זרמי אינטרנט](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), השתמשו ב-[`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

אפשר להמשיך להשתמש ב-`renderToString` אם סביבת השרת שלכם לא תומכת ב-streams.

---

### הסרת `renderToString` מקוד לקוח {/*removing-rendertostring-from-the-client-code*/}

לפעמים `renderToString` משתמשת בצד לקוח כדי להמיר קומפונטה ל-HTML.

```js {1-2}
// 🚩 Unnecessary: using renderToString on the client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // For example, "<svg>...</svg>"
```

ייבוא ​​של `react-dom/server` **בצד לקוח** מגדיל את גודל ה-bundle ללא צורך ממנו. אם צריך לרנדר קומפונטה ל-HTML בדפדפן, השתמשו ב-[`createRoot`](/reference/react-dom/client/createRoot) וקראו את ה-HTML מתוך ה-DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // For example, "<svg>...</svg>"
```

הקריאה ל-[`flushSync`](/reference/react-dom/flushSync) חייבת כדי שה-DOM יתעדכן לפני שקוראים את המפיין [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).

---

## פתרון תקלות {/*troubleshooting*/}

### כשקומפונטה מבצעת suspend, ה-HTML תמיד כולל fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` לא תומכת באופן מלא ב-Suspense.

אם קומפוננטה בכל מבצעת suspend (מכאן שהיא מוגדרת עם [`lazy`](/reference/react/lazy) או מביא נתונים), `renderToString` לא תחכה שהתוכן שלה ייפתר. במקום זאת, `renderToString` תמצא את גבול ה-[`<Suspense>`](/reference/react/Suspense) הקרוב ביותר מעליה ותרנדר את הפרופס ה-`fallback` שלו בתוך ה-HTML. התוכן לא יופי עד שטעינת קוד הלקוח תושלם.

כדי לפתור זאת, השתמשו באחד מ-[פתרונות ה-streaming המומלצים.](#migrating-from-rendertostring-to-a-streaming-method-on-the-server) הם יכולים להזרים תוכן במקטעים בזמן נפתר בשרת, כך שהמשתמש יראה את העמוד מתמלא בהדרגה עוד לפני שקוד הלקוח נטען.
