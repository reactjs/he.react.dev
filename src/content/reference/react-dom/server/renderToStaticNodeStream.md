---
title: "renderToStaticNodeStream"
---

<Intro>

`renderToStaticNodeStream` מרנדר עץ React לא אינטראקטיבי ל-[Node.js זרם קריא.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToStaticNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `renderToStaticNodeStream(reactNode, options?)` {/*rendertostaticnodestream*/}

בשרת, קראו ל-`renderToStaticNodeStream` כדי לקבל [Node.js זרם קריא](https://nodejs.org/api/stream.html#readable-streams).

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[עוד דוגמאות נוספות.](#usage)

ה-stream פיקציה פלט HTML לא אינטראקטיבי של קומפונטות React שלכם.

#### פרמטרים {/*parameters*/}

* `reactNode`: React צומת שברצונכם לרנדר ל-HTML. לדוגמה, אלמנט JSX כמו `<Page />`.

* **אופציונלי** `options`: אובייקט עבור רינדור שרת.
  * **אופציונלי** `identifierPrefix`: מחרוזת קידומת ש-React משתמשת בה עבור מזהים עובדים על ידי [`useId`.](/reference/react/useId) שימושי למניעת התנגשויות כשמשתמשים בכמה שורשים באותו עמוד.

#### מחזירה {/*returns*/}

[Node.js קריא זרם](https://nodejs.org/api/stream.html#readable-streams) שמפיק מחרוזת HTML. אי אפשר לבצע הידרציה ל-HTML שמתקבל.

#### אזהרות {/*caveats*/}

* אי אפשר לבצע הידרציה לפלט של `renderToStaticNodeStream`.

* המתודה הזו תחכה שכל [גבולות Suspense](/reference/react/Suspense) יסתימו לפני החזרת פלט.

* החל מ-React 18, המתודה הזו מאחסנת את כל הפל בבאפר, כך שהייתה מספקת יתרונות סטרימינג.

* ה-stream המוחזר הוא byte stream בקידוד utf-8. אם צריך להזרים בקידוד אחר, אפשר לבדוק פרויקט כמו [iconv-lite](https://www.npmjs.com/package/iconv-lite), שמספק להפוך זרמים להמרת קידוד טקסט.

---

## שימוש {/*usage*/}

### רינדור עץ React כ-HTML סטטי ל-Node.js זרם קריא {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

קראו ל-`renderToStaticNodeStream` כדי לקבל [Node.js זרם קריא](https://nodejs.org/api/stream.html#readable-streams) אפשר לבצע לו pipe לתגובת השרת:

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

ה-stream מפרט את פלט ה-HTML הראשוני הלא אינטראקטיבי של קומפונטות React שלכם.

<Pitfall>

המתודה הזו מרנדרת **HTML לא אינטראקטיבי שאי אפשר לבצע לו הידרציה.** זה שימושי אם רוצים להשתמש ב-React כמחולל עמודים סטטיים פשוט, או אם מרנדרים תוכן סטטי לחלוטין כמו אימיילים.

אפליקציות אינטראקטיביות צריכות להשתמש ב-[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) בצד השרת וב-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) לקוח נוסף.

</Pitfall>
