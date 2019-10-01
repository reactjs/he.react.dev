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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## סימוכין {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

מרנדר קומפוננטת React ל-HTML הראשוני שלה. React יחזיר מחרוזת HTML. ניתן להשתמש בשיטה זו כדי ליצור HTML בשרת ולשלוח את ה-markup על הבקשה הראשונית עבור טעינות דף מהירות יותר ועל מנת לאפשר למנועי חיפוש לסרוק את הדפים שלכם למטרות SEO.

אם תקראו ל-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) על איבר שכבר כולל את ה-markup שרונדר על-ידי השרת, React תשמר אותו ורק תצמיד מטפלי אירועים, דבר המאפשר לכם לבצע חוויית טעינה-ראשונה עם ביצועים טובים מאוד.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

דומה ל-[`renderToString`](#rendertostring), מלבד העובדה שאינה יוצרת מאפייני DOM נוספים ש-React משתמשת בהם באופן פנימי, כגון `data-reactroot`. אפשרות זו שימושית אם ברצונך להשתמש ב-React כמחולל של דפים סטטיים פשוטים, שכן הסרת המאפיינים הנוספים יכולה לחסוך כמה בתים.

אם אתם מתכננים להשתמש ב-React על מנת להפוך את ה-markup לאינטראקטיבי, אל תשתמשו במתודה זו. במקום זאת, השתמשו ב-[`renderToString`](#rendertostring) בצד השרת וב-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) בצד הלקוח.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

מרנדר קומפוננטת React ל-HTML הראשוני שלה. מחזירה [זרם קריא (Readable stream)](https://nodejs.org/api/stream.html#stream_readable_streams) שמיצא מחרוזת HTML. פלט ה-HTML מזרם זה שווה בדיוק למה ש-[`ReactDOMServer.renderToString`](#rendertostring) יחזיר. ניתן להשתמש במתודה זו כדי ליצור HTML בשרת ולשלוח את ה-markup על הבקשה הראשונית עבור טעינות דף מהירות יותר ועל מנת לאפשר למנועי חיפוש לסרוק את הדפים שלכם למטרות SEO.

אם תקראו ל-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) על איבר שכבר כולל את ה-markup שרונדר על-ידי השרת, React תשמר אותו ורק תצמיד מטפלי אירועים, דבר המאפשר לכם לבצע חוויית טעינה-ראשונה עם ביצועים טובים מאוד.

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

אם אתם מתכננים להשתמש ב-React על מנת להפוך את ה-markup לאינטראקטיבי, אל תשתמשו במתודה זו. במקום זאת, השתמשו ב-[`renderToNodeStream`](#rendertonodestream) בצד השרת וב-[`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) בצד הלקוח.

> שימו לב:
>
> שרת בלבד. ממשק API זה אינו זמין בדפדפן.
>
> הזרם המוחזר ממתודה זו יחזיר זרם בתים מקודד ב-utf-8. אם תזדקקו לזרם בקידוד אחר, הסתכלו על פרויקט כמו [iconv-lite](https://www.npmjs.com/package/iconv-lite), המספק זרמי טרנספורמציה עבור קידוד טקסט.
