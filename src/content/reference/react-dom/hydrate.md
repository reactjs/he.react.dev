---
title: "מֵימָה"
---

<Deprecated>

ה-API הזה יוסר בגרסה ראשית עתידית של React.

ב-React 18, `hydrate` הוחלפה ב-[`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) שימוש ב-`hydrate` ב-React 18 יציג אזהרה שהאפליקציה שלכם תתנהג כאילו היא רצה על React 17 [כאן.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`hydrate` יכול להמציא קומפוננטות React בתוך DOM צומת של דפדפן, כשהתוכן ה-HTML נוצר קודם על ידי [`react-dom/server`](/reference/react-dom/server) ב-React 17 ומטה.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

ב-React 17 ומטה, קראו ל-`hydrate` כדי "לחבר" את React ל-HTML קיים רונדר על ידי React בסביבת שרת.

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React תתחבר ל-HTML שקיים בתוך `domNode`, ותיקח שליטה על ניהול ה-DOM שבתוכו. אפליקציה שבנויה לגמרי ב-React כלול בדרך כלל קריאת `hydrate` אחת בלבד עם קומפונטת השורש שלה.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `reactNode`: ‏"React node" ששימש לרינדור ה-HTML הקיים. בדרך כלל זו חתיכת JSX כמו `<App />` שרונדרה עם מתודת `ReactDOM Server` כמו `renderToString(<App />)` ב-React 17.

* `domNode`: [אלמנט DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) שרונדר כ-root element בשרת.

* **אופציונלי**: `callback`: פונקציה. אם הועברה, React תקרא לה אחרי שהקומפוננטה עוברת הידרציה.

#### מחזירה {/*returns*/}

`hydrate` מחזירה null.

#### אזהרות {/*caveats*/}
* `hydrate` מצפה שהתוכן המרונדר יהיה זה לתוכן שרונדר בשרת. React יכולה לתקן הבדלים בתוכן טקסט, אבל צריך להתייחס לחוסר התאמות כבאגים ולתקן אותם.
* במצב פיתוח, React מציגה אזרות על חוסר התאמות בזמן הידרציה. אין הבטחה שהבדלי תכונות יתוקנו במקרה של חוסר התאמה. זה חשוב לביצועים כי ברוב האפליקציות חוסר תאונות נדיר, זה מתאים מלא של כל ה-markup יהיה יקר מדי.
* סביר שתהיה לכם רק קריאת `hydrate` אחת באפליקציה. אם אתם משתמשים ב-framework, אתם יכולים לבצע את הקריאה הזו בשבילכם.
* אם האפליקציה שלכם מרונדרת בלקוח בלבד בלי HTML קיים, שימוש ב-`hydrate()` לא נתמך. השתמשו ב-[render()](/reference/react-dom/render) (עבור React 17 ומטה) או ב-[createRoot()](/reference/react-dom/client/createRoot) (עבור React 18+) במקום.

---

## שימוש {/*usage*/}

קראו ל-`hydrate` כדי לחבר <CodeStep step={1}>קומפונטת React</CodeStep> לתוך <CodeStep step={2}>DOM צומת של דפדפן שרו בשרת</CodeStep>.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

שימוש ב-`hydrate()` לרינדור אפליקציית לקוח בלבד (אפליקציה ללא HTML מרונדר שרת) לא נתמך. השתמשו ב-[`render()`](/reference/react-dom/render) (ב-React 17 ומטה) או ב-[`createRoot()`](/reference/react-dom/client/createRoot) (ב-React 18+) במקום.

### ביצוע הידרציה ל-HTML מרונדר שרת {/*hydrating-server-rendered-html*/}

ב-React, "hydration" הוא האופן שבו React "מתחברת" ל-HTML קיים רונדר על ידי React בסביבת שרת. בזמן הידרציה, React תנסה לחבר מאזיני אירועים ל-markup הקיים ולקחת שליטה על רינדור האפליקציה בצד הלקוח.

באפליקציות שבנויות לגמרי עם React, **בדרך כלל תבצעו הידרציה רק ​​ל"root" אחד, פעם אחת בזמן ההפעלה לכל האפליקציה**.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1></div>
```

```js src/index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

בדרך כלל לא צריך לקרוא ל-`hydrate` שוב או במקומות נוספים. מהנקודה הזו React תנהל את ה-DOM של האפליקציה. כדי לעדכן את ה-UI, הקומפוננטות שלכם [ישתמשו ב-state.](/reference/react/useState)

למידע נוסף על הידרציה, ראו את התיעוד של [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot)

---

### השתקת אזהרות hydratation dismatch בלתי נמנעות {/*suppressing-unavoidable-hydration-mismatch-errors*/}

אם תכונה של אלמנט בודד או תוכן טקסט שלו שונים בהכרח בין השרת ללקוח (לאחר חותמת זמן), אפשר להשתיק את אזהרת ה-hydration mismatch.

כדי להשתיק אזהרות הידרציה על אלמנט, הוסיפו `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: 01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
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

זה עובד לעומק של רמה אחת בלבד, ומיועד כ-escape hatch. אל תשתמשו בזה מעבר לנדרש. אלא אם מדובר בתוכן טקסט, React עדיין לא תנסה לתקן אותו, הוא יישאר לא עקבי עד עדכונים עתידיים.

---

### טיפול בתוכן שונה בין לקוח לשרת {/*handling-different-client-and-server-content*/}

אם אתם צריכים בכוונה לרנדר משהו שונה בשרת ובלקוח, אפשר לבצע רינדור בשני מעברים. קומפוננטות שמרנדרות משהו שלקוח יכול לקרוא [שינוי state](/reference/react/useState) כמו `isClient`, אפשר לקבוע ל-`true` בתוך [effect](/reference/react/useEffect):

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
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
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

תוכן כמו בשרת וימנע חוסר התאמות, אבל מעבר נוסף יתרחש באופן סינכרוני מיד אחרי הידרציה.

<Pitfall>

הגישה הזו הופכת הידרציה לאיתית יותר כי הקומפוננטות צריכות לרנדר פעמיים. שימו לב לחוויית משתמש בחיבורים איטיים. קוד JavaScript אולי להיטען הרבה אחרי רינדור ה-HTML הראשוני, זה רינדור UI שונה מיד אחרי הידרציה אולי להרגיש קופצני למשתמש.

</Pitfall>
