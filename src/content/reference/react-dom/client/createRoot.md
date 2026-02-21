---
title: "createRoot"
---

<Intro>

`createRoot` מאפשר לך ליצור שורש להצגת רכיבי React בתוך צומת DOM של הדפדפן.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

התקשר ל-`createRoot` כדי ליצור שורש React להצגת תוכן בתוך אלמנט DOM בדפדפן.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React תיצור שורש ל-`domNode`, וישתלט על ניהול ה-DOM בתוכו. לאחר שיצרת שורש, עליך לקרוא ל-[`root.render`](#root-render) כדי להציג בתוכו רכיב React:

```js
root.render(<App />);
```

לאפליקציה בנויה במלואה עם React תהיה בדרך כלל רק קריאה אחת `createRoot` עבור רכיב השורש שלה. דף שuses "מפזרים" של React עבור חלקי הדף עשוי להיות בעל כמה שורשים נפרדים לפי הצורך.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `domNode`: אלמנט [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React יצור שורש עבור אלמנט DOM זה ויאפשר לך לקרוא לפונקציות בשורש, כגון `render` כדי להציג תוכן React שניתנו.

* **אופציונלי** `options`: אובייקט עם אפשרויות עבור שורש React זה.

* **אופציונלי** `onRecoverableError`: התקשרות חוזרת נקראת כאשר React מתאושש אוטומטית משגיאות.
  * **אופציונלי** `identifierPrefix`: קידומת מחרוזת React uses עבור מזהים שנוצרו על ידי [`useId`.](/reference/react/useId) שימושי כדי למנוע התנגשויות בעת שימוש במספר שורשים באותו עמוד.

#### מחזירה {/*returns*/}

`createRoot` מחזיר אובייקט בשתי שיטות: [`render`](#root-render) ו-[`unmount`.](#root-unmount)

#### אזהרות {/*caveats*/}
* אם האפליקציה שלך מעובדת בשרת, השימוש ב-`createRoot()` אינו נתמך. השתמש במקום זאת ב-[`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* סביר להניח שתהיה לך רק שיחת `createRoot` אחת באפליקציה שלך. אם אתה use מסגרת, היא עשויה לעשות את הקריאה הזו עבורך.
* כאשר אתה רוצה לרנדר קטע של JSX בחלק אחר של העץ DOM שאינו צאצא של הרכיב שלך (לדוגמה, מודל או הסבר כלים), use [`createPortal`](/reference/react-dom/createPortal) במקום `createRoot`

---

### `root.render(reactNode)` {/*root-render*/}

התקשר ל-`root.render` כדי להציג קטע של [JSX](/learn/writing-markup-with-jsx) ("צומת React") לתוך הצומת DOM של הדפדפן React השורש.

```js
root.render(<App />);
```

React יציג את `<App />` ב-`root`, וישתלט על ניהול ה-DOM שבתוכו.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*root-render-parameters*/}

* `reactNode`: צומת *React* שברצונך להציג. זה בדרך כלל יהיה חלק של JSX כמו `<App />`, אבל אתה יכול גם להעביר אלמנט React שנבנה עם [`createElement()`](/reference/react/createElement), מחרוזת, מספר, `null`, או `undefined`.


#### מחזירה {/*root-render-returns*/}

`root.render` מחזירה `undefined`.

#### אזהרות {/*root-render-caveats*/}

* בפעם הראשונה שאתה קורא `root.render`, React ינקה את כל התוכן HTML הקיים בתוך השורש React לפני עיבוד הרכיב React לתוכו.

* אם הצומת DOM של השורש שלך מכיל HTML שנוצר על ידי React בשרת או במהלך הבנייה, use [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) במקום זאת, אשר מצרף את מטפלי האירועים ל-HTML הקיים.

* אם תתקשר ל-`render` באותו שורש יותר מפעם אחת, React יעדכן את ה-DOM לפי הצורך כדי לשקף את ה-JSX האחרון שעברת. React יחליט אילו חלקים של DOM ניתן מחדשused ואילו צריך ליצור מחדש על ידי ["התאמת אותו"](/learn/preserving-and-resetting-state) עם העץ שניתנו בעבר. קריאה ל-`render` על אותו שורש שוב דומה לקריאה לפונקציה [`set`](/reference/react/useState#setstate) על רכיב השורש: React מונעת עדכוני DOM מיותרים.

---

### `root.unmount()` {/*root-unmount*/}

התקשר ל-`root.unmount` כדי להרוס עץ שעבר עיבוד בתוך שורש React.

```js
root.unmount();
```

אפליקציה שנבנתה במלואה עם React בדרך כלל לא תבצע שיחות אל `root.unmount`.

זה בעיקר useמלא אם הצומת DOM של השורש React שלך (או כל אחד מאבותיו) עלול להיות מוסר מה-DOM על ידי קוד אחר. לדוגמה, דמיינו חלונית לשונית jQuery שמסירת כרטיסיות לא פעילות מה-DOM. אם כרטיסייה תוסר, כל מה שבתוכה (כולל שורשי React בפנים) יוסר גם מה-DOM. במקרה כזה, עליך לומר ל-React "להפסיק" לנהל את תוכן השורש שהוסר על-ידי קריאה ל-`root.unmount`. אחרת, הרכיבים בתוך השורש שהוסר לא יידעו לנקות ולפנות משאבים גלובליים כמו מנויים.

קריאה ל-`root.unmount` תבטל את הטעינה של כל הרכיבים בשורש ו"תנתק" את React מהצומת השורש DOM, כולל הסרת מטפלי אירועים או state בעץ.


#### פרמטרים {/*root-unmount-parameters*/}

`root.unmount` אינו מקבל פרמטרים כלשהם.


#### מחזירה {/*root-unmount-returns*/}

`root.unmount` מחזירה `undefined`.

#### אזהרות {/*root-unmount-caveats*/}

* קריאה ל-`root.unmount` תבטל את כל הרכיבים בעץ ו"תנתק" את React מהצומת השורש DOM.

* ברגע שאתה קורא ל-`root.unmount` אינך יכול לקרוא שוב ל-`root.render` באותו שורש. ניסיון להתקשר ל-`root.render` על שורש לא מותקן יגרום לשגיאה "לא ניתן לעדכן שורש לא מותקן". עם זאת, אתה יכול ליצור שורש חדש עבור אותו צומת DOM לאחר ביטול הטעינה של השורש הקודם עבור אותו צומת.

---

## שימוש {/*usage*/}

### עיבוד אפליקציה בנויה במלואה עם React {/*rendering-an-app-fully-built-with-react*/}

אם האפליקציה שלך בנויה במלואה עם React, צור שורש יחיד עבור האפליקציה כולה.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

בדרך כלל, אתה צריך להפעיל את הקוד הזה רק פעם אחת בעת ההפעלה. זה יהיה:

1. מצא את <CodeStep step={1}>צומת הדפדפן DOM</CodeStep> המוגדר ב-HTML שלך.
2. הצג את <CodeStep step={2}>React רכיב</CodeStep> עבור האפליקציה שלך בפנים.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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

**אם האפליקציה שלך בנויה במלואה עם React, לא תצטרך ליצור שורשים נוספים, או להתקשר שוב ל-[`root.render`](#root-render).**

מנקודה זו ואילך, React ינהל את ה-DOM של האפליקציה כולה. כדי להוסיף עוד רכיבים, [קנן אותם בתוך הרכיב `App`.](/learn/importing-and-exporting-components) כאשר אתה צריך לעדכן את ממשק המשתמש, כל אחד מהרכיבים שלך יכול לעשות זאת על ידי [באמצעות state.](/reference/react/useState) כאשר אתה צריך להציג תוכן נוסף כמו __t __de, כמו state. זה עם פורטל.](/reference/react-dom/createPortal)

<Note>

כאשר HTML שלך ריק, ה-user רואה דף ריק עד שקוד ה-JavaScript של האפליקציה נטען ופועל:

```html
<div id="root"></div>
```

זה יכול להרגיש איטי מאוד! כדי לפתור את זה, אתה יכול ליצור את ה-HTML הראשוני מהרכיבים שלך [בשרת או במהלך הבנייה.](/reference/react-dom/server) ואז המבקרים שלך יכולים לקרוא טקסט, לראות תמונות וללחוץ על קישורים לפני טעינת כל אחד מהקוד JavaScript. We recommend [using a framework](/learn/start-a-new-react-project#production-grade-react-frameworks) that does this optimization out of the box. Depending on when it runs, this is called *server-side rendering (SSR)* or *static site generation (SSG).*

</Note>

<Pitfall>

**אפליקציות המשתמשות בעיבוד שרת או יצירה סטטית חייבות לקרוא ל-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) במקום `createRoot`.** React לאחר מכן *ידחה* (reuse) את הצמתים DOM מה-HTML שלכם במקום להרוס אותם וליצור מחדש.

</Pitfall>

---

### עיבוד דף בנוי חלקית עם React {/*rendering-a-page-partially-built-with-react*/}

אם הדף שלך [לא בנוי במלואו עם React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), תוכל להתקשר ל-`createRoot` מספר פעמים כדי ליצור שורש לכל חלק ברמה העליונה של UI_3 המנוהל על ידי `createRoot`. אתה יכול להציג תוכן שונה בכל שורש על ידי קריאה ל-[`root.render`.](#root-render)

כאן, שני רכיבי React שונים מעובדים לשני צמתים DOM המוגדרים בקובץ `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

אתה יכול גם ליצור צומת DOM חדש עם [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) ולהוסיף אותו למסמך באופן ידני.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // You can add it anywhere in the document
```

כדי להסיר את עץ React מהצומת DOM ולנקות את כל המשאבים used על ידו, התקשר ל-[`root.unmount`.](#root-unmount)

```js
root.unmount();
```

זה בעיקר useמלא אם רכיבי React שלך נמצאים בתוך אפליקציה שנכתבה במסגרת אחרת.

---

### עדכון רכיב שורש {/*updating-a-root-component*/}

אתה יכול לקרוא ל-`render` יותר מפעם אחת באותו שורש. כל עוד מבנה עץ הרכיבים תואם למה שעובד קודם לכן, React [ישמר את ה-state.](/learn/preserving-and-resetting-state) שימו לב כיצד ניתן להקליד את הקלט, מה שאומר שהעדכונים מקריאות חוזרות ונשנות של `render` אינם הרסניים בכל שנייה בדוגמה זו:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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

זה נדיר להתקשר ל-`render` מספר פעמים. בדרך כלל, הרכיבים שלך [עדכנו את state](/reference/react/useState) במקום זאת.

---
## פתרון בעיות {/*troubleshooting*/}

### יצרתי שורש, אבל שום דבר לא מוצג {/*ive-created-a-root-but-nothing-is-displayed*/}

ודא שלא שכחת למעשה *לעבד* את האפליקציה שלך לשורש:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

עד שתעשה זאת, שום דבר לא מוצג.

---

### אני מקבל שגיאה: "מיכל היעד אינו אלמנט DOM" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

שגיאה זו פירושה שכל מה שאתה מעביר ל-`createRoot` אינו צומת DOM.

אם אינך בטוח מה קורה, נסה לרשום את זה:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

לדוגמה, אם `domNode` הוא `null`, זה אומר ש-[`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) החזיר `null`. זה יקרה אם אין צומת במסמך עם המזהה הנתון בזמן השיחה שלך. עשויות להיות כמה סיבות לכך:

1. המזהה שאתה מחפש עשוי להיות שונה מהמזהה שציינת בקובץ HTML. בדוק אם יש שגיאות כתיב!
2. התג `<script>` של החבילה שלך לא יכול "לראות" שום צמתים של DOM המופיעים *אחריו* ב-HTML.

דרך נפוצה נוספת לקבל שגיאה זו היא לכתוב `createRoot(<App />)` במקום `createRoot(domNode)`.

---

### אני מקבל הודעת שגיאה: "הפונקציות אינן תקפות כילד React." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

שגיאה זו פירושה שכל מה שאתה מעביר ל-`root.render` אינו רכיב React.

זה עלול לקרות אם תתקשר ל-`root.render` עם `Component` במקום `<Component />`:

```js {2,5}
// 🚩 Wrong: App is a function, not a Component.
root.render(App);

// ✅ Correct: <App /> is a component.
root.render(<App />);
```

או אם תעביר פונקציה ל-`root.render`, במקום התוצאה של קריאה לה:

```js {2,5}
// 🚩 Wrong: createApp is a function, not a component.
root.render(createApp);

// ✅ Correct: call createApp to return a component.
root.render(createApp());
```

---

### השרת שלי HTML שבוצע מחדש נוצר מחדש מאפס {/*my-server-rendered-html-gets-re-created-from-scratch*/}

אם האפליקציה שלך מעובדת בשרת וכוללת את ה-HTML הראשוני שנוצר על-ידי React, ייתכן שתבחין שיצירת שורש וקריאה ל-`root.render` מוחקת את כל ה-HTML הזה, ולאחר מכן יוצרת מחדש את כל הצמתים DOM מאפס. זה יכול להיות איטי יותר, מאפס את עמדות המיקוד והגלילה, ועלול לאבד קלט user אחר.

אפליקציות המעובדות על ידי שרת חייבות להיות use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) במקום `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

שימו לב שה-API שלו שונה. בפרט, בדרך כלל לא תהיה שיחת `root.render` נוספת.
