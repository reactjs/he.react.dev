---
title: "שרת React DOM APIs"
---

<Intro>

ה-APIs של `react-dom/server` מאפשרים לרנדר קומפונטות React ל-HTML בצד שרת. ה-APIs האלה משתמשים רק בצד שרת, ברמה העליונה של האפליקציה, כדי להשתמש ב-HTML הראשוני. [Framework](/learn/start-a-new-react-project#production-grade-react-frameworks) יכול לקרוא להם עבורכם. רוב הקומפוננטות שלכם לא צריכות לייבא או להשתמש בהם.

</Intro>

---

## שרת APIs עבור Node.js זרמים {/*server-apis-for-nodejs-streams*/}

המתודות האלה זמינות רק בסביבות עם [Node.js זרמים:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) מרנדר עץ React ל-[Node.js Stream](https://nodejs.org/api/stream.html) ניתן לבצע לו piping.
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) מרנדר עץ React לא אינטראקטיבי ל-[Node.js קריא זרם.](https://nodejs.org/api/stream.html#readable-streams)

---

## שרת APIs עבור זרמי אינטרנט {/*server-apis-for-web-streams*/}

המתודות האלה זמינות רק בסביבות עם [זרמי אינטרנט](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), כולל דפדפנים, Deno, וחלק מסביבות edge מודרניות:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) מרנדר עץ React ל-[זרם אינטרנט קריא.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## שרת APIs עבור סביבות ללא סטרימינג {/*server-apis-for-non-streaming-environments*/}

אפשר להשתמש במתודות האלה בסביבות שלא תומכות ב-streams:

* [`renderToString`](/reference/react-dom/server/renderToString) מרנדר עץ React למחרוזת.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) מרנדר עץ React לא אינטראקטיבי למחרוזת.

יש להן פונקציונליות מוגבלת בהשוואה ל-APIs של סטרימינג.

---

## שרת APIs שהוצאו לשימוש {/*deprecated-server-apis*/}

<Deprecated>

ה-APIs האלה יוסרו בגרסה ראשית עתידית של React.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) מרנדר עץ React ל-[Node.js זרם קריא.](https://nodejs.org/api/stream.html#readable-streams) (הוצא לשימוש.)
