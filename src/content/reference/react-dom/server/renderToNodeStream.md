---
title: "renderToNodeStream"
---

<Deprecated>

ה-API הזה יוסר בגרסה ראשית עתידית של React. השתמשו ב-[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) במקום.

</Deprecated>

<Intro>

`renderToNodeStream` מרנדר עץ React ל-[Node.js זרם קריא.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `renderToNodeStream(reactNode, options?)` {/*rendertonodestream*/}

בשרת, קראו ל-`renderToNodeStream` כדי לקבל [Node.js זרם קריא](https://nodejs.org/api/stream.html#readable-streams) אפשר לבצע לו pipe לתגובה.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

בצד, קראו ל-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) כדי להפוך את ה-HTML בשרת לאינטראקטיביות.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `reactNode`: React צומת שברצונכם לרנדר ל-HTML. לדוגמה, אלמנט JSX כמו `<App />`.

* **אופציונלי** `options`: אובייקט עבור רינדור שרת.
  * **אופציונלי** `identifierPrefix`: מחרוזת קידומת ש-React משתמשת בה עבור מזהים עובדים על ידי [`useId`.](/reference/react/useId) שימושי למניעת התנגשויות כשמשתמשים בכמה שורשים באותו עמוד. חייב להיות זהה לקידומת שמועברת ל-[`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### מחזירה {/*returns*/}

[Node.js זרם קריא](https://nodejs.org/api/stream.html#readable-streams) שמפיק מחרוזת HTML.

#### אזהרות {/*caveats*/}

* המתודה הזו תחכה שכל [גבולות Suspense](/reference/react/Suspense) יסתימו לפני החזרת פלט.

* החל מ-React 18, המתודה הזו מאחסנת את כל הפל בבאפר, שהייתה מספקת יתרונות סטרימינג. לכן מומלץ לעבור ל-[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

* ה-stream המוחזר הוא byte stream בקידוד utf-8. אם צריך להזרים בקידוד אחר, אפשר לבדוק פרויקט כמו [iconv-lite](https://www.npmjs.com/package/iconv-lite), שמספק להפוך זרמים להמרת קידוד טקסט.

---

## שימוש {/*usage*/}

### רינדור עץ React כ-HTML ל-Node.js זרם קריא {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

קראו ל-`renderToNodeStream` כדי לקבל [Node.js זרם קריא](https://nodejs.org/api/stream.html#readable-streams) אפשר לבצע לו pipe לתגובת השרת:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

ה-stream מפרט את פלט ה-HTML הראשוני הלא אינטראקטיבי של קומפונטות React שלכם. בצד תצטרכו לקרוא ל-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) כדי לבצע *hydration* ל-HTML בשרת ולהפוך אותו לאינטראקטיבי.
