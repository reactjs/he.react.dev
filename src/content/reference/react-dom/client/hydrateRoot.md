---
title: "hydrateRoot"
---

<Intro>

`hydrateRoot` מאפשר לך להציג רכיבי React בתוך צומת DOM של דפדפן שתוכן ה-HTML שלו נוצר בעבר על ידי [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

התקשר ל-`hydrateRoot` כדי "לצרף" את React ל-HTML קיים שכבר בוצע על-ידי React בסביבת שרת.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React יתחבר ל-HTML שקיים בתוך ה-`domNode`, וישתלט על ניהול ה-DOM שבתוכו. לאפליקציה הבנויה במלואה עם React תהיה בדרך כלל רק קריאה אחת `hydrateRoot` עם רכיב השורש שלה.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `domNode`: אלמנט [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) שעובד כאלמנט השורש בשרת.

* `reactNode`: הצומת "React" used לעיבוד ה-HTML הקיים. זה בדרך כלל יהיה חלק של JSX כמו `<App />` שעובד בשיטה `ReactDOM Server` כמו `renderToPipeableStream(<App />)`.

* **אופציונלי** `options`: אובייקט עם אפשרויות עבור שורש React זה.

* **אופציונלי** `onRecoverableError`: התקשרות חוזרת נקראת כאשר React מתאושש אוטומטית משגיאות.
  * **אופציונלי** `identifierPrefix`: קידומת מחרוזת React uses עבור מזהים שנוצרו על ידי [`useId`.](/reference/react/useId) שימושי כדי למנוע התנגשויות בעת שימוש במספר שורשים באותו עמוד. חייבת להיות אותה קידומת כמו used בשרת.


#### מחזירה {/*returns*/}

`hydrateRoot` מחזיר אובייקט בשתי שיטות: [`render`](#root-render) ו-[`unmount`.](#root-unmount)

#### אזהרות {/*caveats*/}

* `hydrateRoot()` מצפה שהתוכן המעובד יהיה זהה לתוכן המעובד. עליך להתייחס לאי התאמה כאל באגים ולתקן אותם.
* במצב פיתוח, React מזהיר על אי התאמה במהלך הידרציה. אין ערובה לכך שההבדלים בתכונות יתוקנו במקרה של אי התאמה. זה חשוב מסיבות ביצועים מכיוון שuse ברוב האפליקציות, אי התאמה הן נדירות, ולכן אימות כל הסימון יהיה יקר מאוד.
* סביר להניח שתהיה לך רק שיחת `hydrateRoot` אחת באפליקציה שלך. אם אתה use מסגרת, היא עשויה לעשות את הקריאה הזו עבורך.
* אם האפליקציה שלך מעובדת ללא עיבוד של HTML כבר, השימוש ב-`hydrateRoot()` אינו נתמך. השתמש ב-[`createRoot()`](/reference/react-dom/client/createRoot) במקום זאת.

---

### `root.render(reactNode)` {/*root-render*/}

התקשר ל-`root.render` כדי לעדכן רכיב React בתוך שורש React hydrated עבור אלמנט דפדפן DOM.

```js
root.render(<App />);
```

React יעדכן את `<App />` ב-`root` המשתלח.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*root-render-parameters*/}

* `reactNode`: צומת "React" שברצונך לעדכן. זה בדרך כלל יהיה חלק של JSX כמו `<App />`, אבל אתה יכול גם להעביר אלמנט React שנבנה עם [`createElement()`](/reference/react/createElement), מחרוזת, מספר, `null`, או `undefined`.


#### מחזירה {/*root-render-returns*/}

`root.render` מחזירה `undefined`.

#### אזהרות {/*root-render-caveats*/}

* אם אתה קורא ל-`root.render` לפני שהשורש סיים את הלחות, React ינקה את תוכן ה-HTML הקיים של השרת ויעביר את השורש כולו לעיבוד לקוח.

---

### `root.unmount()` {/*root-unmount*/}

התקשר ל-`root.unmount` כדי להרוס עץ שעבר עיבוד בתוך שורש React.

```js
root.unmount();
```

אפליקציה שנבנתה במלואה עם React בדרך כלל לא תבצע שיחות אל `root.unmount`.

זה בעיקר useמלא אם הצומת DOM של השורש React שלך (או כל אחד מאבותיו) עלול להיות מוסר מה-DOM על ידי קוד אחר. לדוגמה, דמיינו חלונית לשונית jQuery שמסירת כרטיסיות לא פעילות מה-DOM. אם כרטיסייה תוסר, כל מה שבתוכה (כולל שורשי React בפנים) יוסר גם מה-DOM. עליך לומר ל-React "להפסיק" לנהל את תוכן השורש שהוסר על-ידי קריאה ל-`root.unmount`. אחרת, הרכיבים בתוך השורש שהוסר לא יתנקו ויפנו משאבים כמו מנויים.

קריאה ל-`root.unmount` תבטל את הטעינה של כל הרכיבים בשורש ו"תנתק" את React מהצומת השורש DOM, כולל הסרת מטפלי אירועים או state בעץ.


#### פרמטרים {/*root-unmount-parameters*/}

`root.unmount` אינו מקבל פרמטרים כלשהם.


#### מחזירה {/*root-unmount-returns*/}

`root.unmount` מחזירה `undefined`.

#### אזהרות {/*root-unmount-caveats*/}

* קריאה ל-`root.unmount` תבטל את כל הרכיבים בעץ ו"תנתק" את React מהצומת השורש DOM.

* ברגע שאתה קורא ל-`root.unmount`, אינך יכול לקרוא שוב ל-`root.render` בשורש. ניסיון להתקשר ל-`root.render` על שורש לא מותקן יגרום לשגיאה "לא ניתן לעדכן שורש לא מותקן".

---

## שימוש {/*usage*/}

### עיבוד לחות בשרת HTML {/*hydrating-server-rendered-html*/}

אם ה-HTML של האפליקציה שלך נוצר על ידי [`react-dom/server`](/reference/react-dom/client/createRoot), אתה צריך *להטמין* אותו בלקוח.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

פעולה זו תייבש את השרת HTML בתוך <CodeStep step={1}>צומת הדפדפן DOM</CodeStep> עם <CodeStep step={2}>React רכיב</CodeStep> עבור האפליקציה שלך. בדרך כלל, תעשה זאת פעם אחת בעת ההפעלה. אם אתה use מסגרת, היא עשויה לעשות זאת מאחורי הקלעים עבורך.

כדי לייבש את האפליקציה שלך, React "יצרף" את ההיגיון של הרכיבים שלך ל-HTML הראשוני שנוצר מהשרת. הידרציה הופכת את תמונת המצב הראשונית HTML מהשרת לאפליקציה אינטראקטיבית מלאה שפועלת בדפדפן.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

לא צריך להתקשר שוב ל-`hydrateRoot` או להתקשר אליו במקומות נוספים. מנקודה זו ואילך, React ינהל את ה-DOM של האפליקציה שלך. כדי לעדכן את ממשק המשתמש, הרכיבים שלך יהיו [use state](/reference/react/useState) במקום זאת.

<Pitfall>

העץ React שאתה מעביר ל-`hydrateRoot` צריך לייצר **אותו פלט** כפי שהוא עשה בשרת.

זה חשוב לחוויית user. ה-user יבלה זמן מה בהסתכלות על ה-HTML שנוצר על ידי השרת לפני שקוד ה-JavaScript שלך ייטען. עיבוד שרת יוצר אשליה שהאפליקציה נטענת מהר יותר על ידי הצגת תמונת המצב HTML של הפלט שלה. פתאום הצגת תוכן שונה שובר את האשליה הזו. זו הסיבה שפלט העיבוד של השרת חייב להתאים לפלט העיבוד הראשוני בלקוח.

ה-causes הנפוצים ביותר המובילים לשגיאות הידרציה כוללים:

* רווח לבן נוסף (כמו שורות חדשות) סביב React שנוצר HTML בתוך צומת השורש.
* שימוש בבדיקות כמו `typeof window !== 'undefined'` בלוגיקת העיבוד שלך.
* שימוש ב-APIs לדפדפן בלבד כמו [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) בלוגיקת העיבוד שלך.
* עיבוד נתונים שונים בשרת ובלקוח.

React מתאושש מכמה שגיאות הידרציה, אבל **עליך לתקן אותן כמו באגים אחרים.** במקרה הטוב, הן יובילו להאטה; במקרה הגרוע ביותר, מטפלי אירועים יכולים להיקשר לאלמנטים הלא נכונים.

</Pitfall>

---

### לחות של מסמך שלם {/*hydrating-an-entire-document*/}

אפליקציות שנבנו במלואן עם React יכולות להציג את המסמך כולו כ-JSX, כולל התג [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

כדי לייבש את המסמך כולו, העבר את ה-[`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) גלובלי כארגומנט הראשון ל-`hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### דיכוי שגיאות אי התאמה של הידרציה בלתי נמנעת {/*suppressing-unavoidable-hydration-mismatch-errors*/}

אם התכונה או תוכן הטקסט של רכיב בודד שונים באופן בלתי נמנע בין השרת ללקוח (לדוגמה, חותמת זמן), אתה עשוי להשתיק את אזהרת אי התאמה של הידרציה.

כדי להשתיק אזהרות הידרציה על אלמנט, הוסף את `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

זה עובד רק ברמה אחת בעומק, והוא נועד להיות פתח מילוט. אל תגזים use. אלא אם כן מדובר בתוכן טקסט, React עדיין לא ינסה לתקן אותו, כך שהוא עשוי להישאר לא עקבי עד לעדכונים עתידיים.

---

### טיפול בתוכן לקוח ושרת שונה {/*handling-different-client-and-server-content*/}

אם אתה צריך בכוונה לרנדר משהו שונה בשרת ובלקוח, אתה יכול לעשות רינדור שני מעברים. רכיבים שמציגים משהו שונה בלקוח יכולים לקרוא משתנה [state](/reference/react/useState) כמו `isClient`, אותו ניתן להגדיר ל-`true` ב-[Effect](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

בדרך זו העברת העיבוד הראשונית תציג את אותו תוכן כמו השרת, ימנע אי התאמה, אך מעבר נוסף יתרחש באופן סינכרוני מיד לאחר הידרציה.

<Pitfall>

גישה זו הופכת את ההידרציה לאטית יותר מכיוון שהרכיבים שלך צריכים לרנדר פעמיים. שים לב לחוויית user בחיבורים איטיים. הקוד JavaScript עשוי להיטען מאוחר משמעותית מהעיבוד הראשוני של HTML, כך שעיבוד ממשק משתמש אחר מיד לאחר הידרציה עשוי להרגיש צורם גם ל-user.

</Pitfall>

---

### עדכון רכיב שורש עם לחות {/*updating-a-hydrated-root-component*/}

לאחר שהשורש סיים לחות, אתה יכול לקרוא ל-[`root.render`](#root-render) כדי לעדכן את רכיב השורש React. **בניגוד ל-[`createRoot`](/reference/react-dom/client/createRoot), אתה בדרך כלל לא צריך לעשות זאת מכיוון שuse התוכן הראשוני כבר הוצג כ-HTML.**

אם אתה קורא ל-`root.render` בשלב מסוים לאחר הידרציה, ומבנה עץ הרכיב תואם למה שעובד קודם לכן, React ישמור את ה-state.](/learn/preserving-and-resetting-state) שימו לב כיצד תוכלו להקליד את הקלט, מה שאומר שהעדכונים חוזרים מ-TK_ בדוגמה זו אינם חוזרים על כל __1. הרסני:

<Sandpack>

```html public/index.html
<!--
  All HTML content inside <div id="root">...</div> was
  generated by rendering <App /> with react-dom/server.
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

זה נדיר לקרוא ל-[`root.render`](#root-render) על שורש hydrated. בדרך כלל, אתה [תעדכן state](/reference/react/useState) בתוך אחד הרכיבים במקום זאת.
