---
title: "לְדַקלֵם"
---

<Deprecated>

ה-API הזה יוסר בגרסה ראשית עתידית של React.

ב-React 18, `render` הוחלפה ב-[`createRoot`.](/reference/react-dom/client/createRoot) שימוש ב-`render` ב-React 18 יציג אזהרה שהאפליקציה שלכם תתנהג כאילו היא רצה על React 17 [כאן.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`render` מרנדרת חתיכת [JSX](/learn/writing-markup-with-jsx) ("React node") לתוך DOM node של דפדפן.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

קראו ל-`render` כדי להציג קומפונטת React בתוך אלמנט DOM של דפדפן.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React תציג את `<App />` בתוך `domNode`, ותיקח שליטה על ניהול ה-DOM שבתוכו.

אפליקציה שבנויה כולה ב-React לרוב תכלול רק קריאת `render` אחת עם קומפוננטת השורש שלה. עמוד שמשתמש ב"sprinkles" של React בחלקים שונים עשויים לכלול כמה קריאות `render` לפי הצורך.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `reactNode`: ‏*React node* שברצונכם להציג. בדרך כלל זו תהיה חתיכת JSX כמו `<App />`, אבל אפשר גם להעביר React אלמנט עם [`createElement()`](/reference/react/createElement), מחרוזת, מספר, `null`, או `undefined`.

* `domNode`: [ אלמנט DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React תציג את `reactNode` שהעברתם בתוך אלמנט ה-DOM הזה. מהרגע הזה React תנהל את ה-DOM בתוך `domNode` ותעדכןT אותו_6__ ות__תכןT אותו_.

* **אופציונלי** `callback`: פונקציה. אם הועברה, React תקרא לה אחרי שהקומפוננתה הוכנסה ל-DOM.


#### מחזירה {/*returns*/}

`render` בדרך כלל מחזירה `null`. עם זאת, אם `reactNode` שהעברתם היא *רכיב כיתה*, יוחזר מופע של הקומפוננטה הזו.

#### אזהרות {/*caveats*/}

* ב-React 18, `render` הוחלפה ב-[`createRoot`.](/reference/react-dom/client/createRoot) השתמשו ב-`createRoot` עבור React 18 ומעלה.

* בפעם הראשונה שקוראים ל-`render`, React תנקה את כל התוכן ה-HTML הקיים בתוך `domNode` רינדור קומפוננטת React לתוכה. אם ה-`domNode` שלכם מכילה HTML אישית על ידי React בשרת או בזמן בנייה, השתמשו ב-[`hydrate()`](/reference/react-dom/hydrate) במקום, ברת שמח את מטפלי האירועים ל-HTML הקיים.

* אם תקראו ל-`render` על אותו `domNode` יותר מפעם אחת, React תעדכן את ה-DOM לפי הצורך לשקף את ה-JSX העדכני ביותר שהעברתם. React תחליט אילו חלקים ב-DOM אפשר למחזר כשצריך ליצור מחדש על ידי ["התאמה"](/learn/preserving-and-resetting-state) לעץ שרונדר קודם. קריאה נוספת ל-`render` על אותו `domNode` דומה לקריאה ל-[פונקציית `set`](/reference/react/useState#setstate) בקומפוננטת השורש: React נמנעת מעדכוני DOM מיותרים.

* אם האפליקציה שלכם בנויה לגמרי ב-React, כנראה שתהיה בה רק קריאת `render` אחת. (אם אתם משתמשים ב-framework, הוא יכול לבצע את הקריאה הזו עבורכם.) אתם רוצים לרנדר חתיכת JSX בחלק אחר של עץ ה-DOM שאינו ילד של הקומפוננטה שלכם (מודול אחר או tooltip), השתמשו ב-[`createPortal`](/reference/react-dom/createTK_) ב-__.

---

## שימוש {/*usage*/}

קראו ל-`render` כדי להציג <CodeStep step={1}>קומפונטת React</CodeStep> בתוך <CodeStep step={2}>DOM צומת של דפדפן</CodeStep>.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### רינדור קומפונטת השורש {/*rendering-the-root-component*/}

באפליקציות שבנויות לגמרי עם React, **בדרך כלל עושים את זה פעם אחת בלבד בזמן ההפעלה** — כדי לרנדר את קומפונטת ה"שורש".

<Sandpack>

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

בדרך כלל לא צריך לקרוא ל-`render` שוב או לקרוא לה במקומות נוספים. מהנקודה הזו React תנהל את ה-DOM של האפליקציה. כדי לעדכן את ה-UI, הקומפוננטות שלכם [ישתמשו ב-state.](/reference/react/useState)

---

### רינדור כמה שורשים {/*rendering-multiple-roots*/}

אם העמוד שלכם [לא בנוי כולו ב-React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), קראו ל-`render` עבור כל יחידת UI עליונה שמנוהלת על ידי React.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
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

אפשר להשמיד את העצים שרונדרו עם [`unmountComponentAtNode()`.](/reference/react-dom/unmountComponentAtNode)

---

### עדכון העץ המרונדר {/*updating-the-rendered-tree*/}

אפשר לקרוא ל-`render` יותר מפעם אחת על אותו DOM צומת. כל עוד מבנה עץ הקומפוננטות תואם למה שרונדר קודם, React [תשמר את ה-state.](/learn/preserving-and-resetting-state) שימו לב אפשרי ב-input, כלומר העדכונים מקריאות `render` חוזרות כל שנייה שנית הרסניים:

<Sandpack>

```js src/index.js active
import { render } from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
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

לא נפוץ לקרוא ל-`render` כמה פעמים. בדרך כלל תעדכנו [state](/reference/react/useState) בתוך הקומפוננטות במקום.
