---
title: "useId"
---

<Intro>

`useId` הוא React __TK_ ליצירת מזהים ייחודיים2__ אפשר להעביר למאפיינים נגישות.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useId()` {/*useid*/}

קראו ל-`useId` ברמה העליונה של הקומפוננטה כדי ליצור מזהה ייחודית:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

`useId` לא מקבל פרמטרים.

#### מחזירה {/*returns*/}

`useId` מחזיר מחרוזת מזהה ייחודית שמשויכת לקריאה הספציפית הזו ל-`useId` בתוך הקומפוננטה הספציפית הזו.

#### אזהרות {/*caveats*/}

* `useId` הוא Hook, אז אפשר לקרוא לו **רק ברמה העליונה של הקומפוננטה** או של Hooks משלכם. אי אפשר לקרוא לו בתוך לולאות או תנאים. אם צריך את זה, חלצו קומפונטה חדשה והעבירו אליה את ה-state.

* **לא צריך להשתמש ב-`useId` כדי להשתמש במפתחות** ברשימה. [Keys צריכים להיווצר מהנתונים שלכם.](/learn/rendering-lists#where-to-get-your-key)

---

## שימוש {/*usage*/}

<Pitfall>

**אל תקראו ל-`useId` כדי למפתחות ברשימה.** [Keys צריכים להיווצר מהנתונים שלכם.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### יצירת מזהים ייחודיים למאפיינים נגישות {/*generating-unique-ids-for-accessibility-attributes*/}

קראו ל-`useId` ברמה העליונה של הקומפוננטה כדי ליצור מזהה ייחודית:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

לאחר מכן אפשר להעביר את <CodeStep step={1}>המזהה אנשים</CodeStep> למאפיינים שונים:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**בואו נעבור על דוגמה כדי לראות מתי זה שימושי.**

[מאפיינים נגישות ב-HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) כמו [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) מאפשרים לציין ששתי תגיות קשורות זו לזו. למשל, אפשר לציין שאלמנט אחד (כמו קלט) מתואר על ידי אלמנט אחר (כמו פסקה).

ב-HTML רגיל, הייתם כותבים כך:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

אבל קידוד קשיח של מזהים כך הוא לא פרקטיקה טובה ב-React. קומפוננטה יכולה להירנדר יותר מפעם אחת בעמוד, אבל זיהויים חייבים להיות ייחודיים. במקום קוד קשיח של ID, צרו ID ייחודי עם `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

עכשיו, גם אם `PasswordField` מופיעה פעמים על המסך.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[צפו בסרטון הזה](https://www.youtube.com/watch?v=0dNzNcuEuOo) כדי לראות את ההבדל בחוויית המשתמש עם טכנולוגיות מסייעות.

<Pitfall>

עם [עיבוד שרת](/reference/react-dom/server), **`useId` דורש עץ קומפוננטות זהה בצד השרת ובצד הלקוח**. אם העצים הם מרנדרים בשרת ובלקוח לא תואמים בדיוק, המזהים אנשים לא אתאימו.

</Pitfall>

<DeepDive>

#### למה useId עדיף על מונה עולה? {/*why-is-useid-better-than-an-incrementing-counter*/}

אולי אתם שואלים למה `useId` עדיף על הגדלת ranking גלובלי כמו `nextId++`.

זהו המרכזי של `useId` הוא ש-React מבטיחה שהיא עובדת עם [עיבוד שרת.](/reference/react-dom/server) בזמן רינדור שרת, הקומפוננטות מייצרות פלט HTML. אחר כך, חוץ מלקוחות, [hydration](/reference/react-dom/client/hydrateRoot) מחבר את מטפלי האירועים ל-HTML עבור HTML. כדי ש-hydration יעבוד, פלט הלקוח חייב להתאים ל-HTML של השרת.

קשה מאוד זאת עם מונה עולה, כי סדר ה-hydration של רכיבי לקוח עשוי לא להתאים לסדר שבו ה-HTML נוצר בשרת. בקריאה ל-`useId`, אתם מבטיחים שה-hydration יעבוד, ושהפלט מתאים בין השרת ללקוח.

בתוך React, `useId` נוצר מתוך "נתיב אב" של הקומפוננטה הקוראת. לכן, אם העץ בלקוח ובשרת זהה, ה-"נתיב ההורים" יתאים בלי קשר לסדר הרינדור.

</DeepDive>

---

### יצירת IDs לכמה אלמנטים קשורים {/*generating-ids-for-several-related-elements*/}

אם צריך לתת מזהים לכמה אלמנטים קשורים, אפשר לקרוא ל-`useId` כדי ליצור קידומת משותפת עבורם:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

כך אפשר מקריאה ל-`useId` עבור כל קוד זיהוי בודד.

---

### הגדרת קידומת משותפת לכל ה-IDs תכונות {/*specifying-a-shared-prefix-for-all-generated-ids*/}

אם אתם מרנדרים כמה אפליקציות React עצמאיות באותו עמוד, העבירו `identifierPrefix` כאופציה לקריאות [`createRoot`](/reference/react-dom/client/createRoot#parameters) או [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) שלכם. כך מובטח שה-IDs מתאים בשתי האפליקציות לא נגשו, כי כל מזהה עובד עם __T בק_3__ יתחילידומת הייחודית שהגדרתם.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### שימוש באותה קידומת ID בלקוח ובשרת {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

אם אתם [מרנדרים כמה אפליקציות שReact עצמאיות באותו עמוד](#specifying-a-shared-prefix-for-all-generated-ids), וחלק מהאפליקציות האלה מרונדרות בשרת, ודאו שה-`identifierPrefix`הם מעבירים לקריאה ל-[`hydrateRoot`](/reference/react-dom/client-___2) מעבירים ל-[שרת APIs](/reference/react-dom/server), כמו [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

אין צורך להעביר `identifierPrefix` אם יש לכם רק אפליקציית React אחת בעמוד.
