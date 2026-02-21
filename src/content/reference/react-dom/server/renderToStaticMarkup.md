---
title: "renderToStaticMarkup"
---

<Intro>

`renderToStaticMarkup` מרנדר עץ React לא אינטראקטיבי למחרוזת HTML.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

בצד השרת, קראו ל-`renderToStaticMarkup` כדי לרנדר את האפליקציה שלכם ל-HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

הפונקציה תייצר פלט HTML לא אינטראקטיביות של קומפונטות React שלכם.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `reactNode`: React צומת שברצונכם לרנדר ל-HTML. למשל, צומת JSX כמו `<Page />`.
* **אופציונלי** `options`: אובייקט עבור רינדור שרת.
  * **אופציונלי** `identifierPrefix`: מחרוזת קידומת ש-React משתמשת בה עבור מזהים עובדים על ידי [`useId`.](/reference/react/useId) שימושי למניעת התנגשויות כשמשתמשים בכמה שורשים באותו עמוד.

#### מחזירה {/*returns*/}

מחרוזת HTML.

#### אזהרות {/*caveats*/}

* אי אפשר לבצע הידרציה לפלט של `renderToStaticMarkup`.

* ל-`renderToStaticMarkup` יש תמיכה מוגבלת ב-Suspense. אם פונתה מבצעת suspend, `renderToStaticMarkup` שולחת מיד את ה-fallback שלה כ-HTML.

* `renderToStaticMarkup` עובדת גם בדפדפן, אבל לא מומלץ להשתמש בה בקוד לקוח. אם צריך לרנדר קומפונטה ל-HTML בדפדפן, [קבלו את ה-HTML על ידי רינדור ל-DOM node.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## שימוש {/*usage*/}

### רינדור עץ React לא אינטראקטיבי כ-HTML למחרוזת {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

קראו ל-`renderToStaticMarkup` כדי לרנדר את האפליקציה למחרוזת HTML אפשר לשלוח בתגובת השרת:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

כך יתקבל פלט ה-HTML הראשוני הלא אינטראקטיבי של קומפונטות React שלכם.

<Pitfall>

המתודה הזו מרנדרת **HTML לא אינטראקטיבי שאי אפשר לבצע לו הידרציה.** זה שימושי אם רוצים להשתמש ב-React כמחולל עמודים סטטיים פשוט, או אם מרנדרים תוכן סטטי לחלוטין כמו אימיילים.

אפליקציות אינטראקטיביות צריכות להשתמש ב-[`renderToString`](/reference/react-dom/server/renderToString) בצד השרת וב-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) לקוח נוסף.

</Pitfall>
