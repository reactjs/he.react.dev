---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

האובייקט `ReactDOMServer` מאפשר לעבד קומפוננטות ל-markup סטטי. בדרך כלל, נעשה בו שימוש בשרת Node:

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## סקירה כללית {#overview}

ניתן להשתמש במתודות הבאות הן בסביבת השרת והן בסביבות דפדפן:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

מתודות נוספות אלה תלויות בחבילה (`stream`) אשר **זמינה בשרת בלבד**, ולא יפעלו בדפדפן.

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## סימוכין {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

מרנדר קומפוננטת React ל-HTML הראשוני שלה. React יחזיר מחרוזת HTML. ניתן להשתמש בשיטה זו כדי ליצור HTML בשרת ולשלוח את ה-markup על הבקשה הראשונית עבור טעינות דף מהירות יותר ועל מנת לאפשר למנועי חיפוש לסרוק את הדפים שלכם למטרות SEO.

<<<<<<< HEAD
אם תקראו ל-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) על איבר שכבר כולל את ה-markup שרונדר על-ידי השרת, React תשמר אותו ורק תצמיד מטפלי אירועים, דבר המאפשר לכם לבצע חוויית טעינה-ראשונה עם ביצועים טובים מאוד.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

דומה ל-[`renderToString`](#rendertostring), מלבד העובדה שאינה יוצרת מאפייני DOM נוספים ש-React משתמשת בהם באופן פנימי, כגון `data-reactroot`. אפשרות זו שימושית אם ברצונך להשתמש ב-React כמחולל של דפים סטטיים פשוטים, שכן הסרת המאפיינים הנוספים יכולה לחסוך כמה בתים.

<<<<<<< HEAD
אם אתם מתכננים להשתמש ב-React על מנת להפוך את ה-markup לאינטראקטיבי, אל תשתמשו במתודה זו. במקום זאת, השתמשו ב-[`renderToString`](#rendertostring) בצד השרת וב-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) בצד הלקוח.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

מרנדר קומפוננטת React ל-HTML הראשוני שלה. מחזירה [זרם קריא (Readable stream)](https://nodejs.org/api/stream.html#stream_readable_streams) שמיצא מחרוזת HTML. פלט ה-HTML מזרם זה שווה בדיוק למה ש-[`ReactDOMServer.renderToString`](#rendertostring) יחזיר. ניתן להשתמש במתודה זו כדי ליצור HTML בשרת ולשלוח את ה-markup על הבקשה הראשונית עבור טעינות דף מהירות יותר ועל מנת לאפשר למנועי חיפוש לסרוק את הדפים שלכם למטרות SEO.

<<<<<<< HEAD
אם תקראו ל-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) על איבר שכבר כולל את ה-markup שרונדר על-ידי השרת, React תשמר אותו ורק תצמיד מטפלי אירועים, דבר המאפשר לכם לבצע חוויית טעינה-ראשונה עם ביצועים טובים מאוד.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> שימו לב:
>
> שרת בלבד. ממשק API זה אינו זמין בדפדפן.
>
> הזרם המוחזר ממתודה זו יחזיר זרם בתים מקודד ב-utf-8. אם תזדקקו לזרם בקידוד אחר, הסתכלו על פרויקט כמו [iconv-lite](https://www.npmjs.com/package/iconv-lite), המספק זרמי טרנספורמציה עבור קידוד טקסט.



* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

דומה ל-[`renderToNodeStream`](#rendertonodestream), מלבד העובדה שאינה יוצרת מאפייני DOM נוספים ש-React משתמשת בהם באופן פנימי, כגון `data-reactroot`. אפשרות זו שימושית אם ברצונך להשתמש ב-React כמחולל של דפים סטטיים פשוטים, שכן הסרת המאפיינים הנוספים יכולה לחסוך כמה בתים.

פלט ה-HTML המוחזר מזרם זה זהה למה ש-[`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) תחזיר.

<<<<<<< HEAD
אם אתם מתכננים להשתמש ב-React על מנת להפוך את ה-markup לאינטראקטיבי, אל תשתמשו במתודה זו. במקום זאת, השתמשו ב-[`renderToNodeStream`](#rendertonodestream) בצד השרת וב-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) בצד הלקוח.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> שימו לב:
>
> שרת בלבד. ממשק API זה אינו זמין בדפדפן.
>
> הזרם המוחזר ממתודה זו יחזיר זרם בתים מקודד ב-utf-8. אם תזדקקו לזרם בקידוד אחר, הסתכלו על פרויקט כמו [iconv-lite](https://www.npmjs.com/package/iconv-lite), המספק זרמי טרנספורמציה עבור קידוד טקסט.
