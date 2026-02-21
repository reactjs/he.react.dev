---
title: "use"
canary: true
---

<Canary>

ה-`use` Hook זמין כרגע רק בערוצים הקנריים והניסיוניים של React. למידע נוסף על ערוצי ההפצה של [React כאן](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`use` הוא React Hook המאפשר לך לקרוא את הערך של משאב כמו [הבטחה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) או [הקשר](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `use(resource)` {/*use*/}

התקשר ל-`use` ברכיב שלך כדי לקרוא את הערך של משאב כמו [הבטחה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) או [הקשר](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

בניגוד לכל React Hooks האחרים, ניתן לקרוא ל-`use` בתוך לולאות ו-stateמנטים מותנים כמו `if`. כמו React Hooks אחרים, הפונקציה שקוראת ל-`use` חייבת להיות Component או Hook.

כאשר קוראים עם הבטחה, ה-`use` Hook משתלב עם [`Suspense`](/reference/react/Suspense) ו-[גבולות שגיאה](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). הרכיב הקורא ל-`use` *משהה* בזמן שההבטחה שהועברה ל-`use` ממתינה. אם הרכיב שקורא ל-`use` עטוף בגבול Suspense, ה-fallback יוצג.  לאחר פתרון ההבטחה, ההחלפה Suspense מוחלפת ברכיבים שניתנו באמצעות הנתונים המוחזרים על ידי `use` Hook. אם ההבטחה שהועברה ל-`use` תדחה, תוצג החזרה של גבול השגיאה הקרוב ביותר.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `resource`: זהו המקור של הנתונים שמהם אתה רוצה לקרוא ערך. משאב יכול להיות [הבטחה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) או [הקשר](/learn/העברת-data-deeply-with-context).

#### מחזירה {/*returns*/}

ה-`use` Hook מחזיר את הערך שנקרא מהמשאב כמו הערך שנפתר של [הבטחה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) או [הקשר](/learn/pass-data-deeply-with-context).

#### אזהרות {/*caveats*/}

* יש לקרוא ל-`use` Hook בתוך רכיב או Hook.
* בעת שליפת נתונים ב-[רכיב שרת](/reference/react/use-שרת), העדיפו `async` ו`await` על פני `use`. `async` ו`await` קולטים רינדור מהנקודה שבה `await` הופעל, ואילו `use` מעבד מחדש את הרכיב לאחר פתרון הנתונים.
* העדיפו יצירת הבטחות ב-[Server Components](/reference/react/use-server) והעברתם ל-[Client Components](/reference/react/use-client) על פני יצירת הבטחות ברכיבי לקוח. הבטחות שנוצרו ברכיבי לקוח נוצרות מחדש בכל עיבוד. הבטחות המועברות מרכיב שרת לרכיב לקוח יציבות בעיבודים חוזרים. [ראה דוגמה זו](#streaming-data-from-server-to-client).

---

## שימוש {/*usage*/}

### קריאה בהקשר עם `use` {/*reading-context-with-use*/}

כאשר [הקשר](/learn/העברת-data-deeply-with-context) מועבר ל-`use`, זה עובד בדומה ל-[`useContext`](/reference/react/useContext). בעוד ש-`useContext` חייב להיקרא ברמה העליונה של הרכיב שלך, ניתן לקרוא ל-`use` בתוך תנאים כמו `if` ולולאות כמו `for`. `use` מועדף על פני `useContext` מכיוון שuse הוא גמיש יותר.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` מחזירה את <CodeStep step={2}>ערך ההקשר</CodeStep> עבור <CodeStep step={1}>context</CodeStep> שעברת. כדי לקבוע את ערך ההקשר, React מחפש בעץ הרכיבים ומוצא את **ספק ההקשר הקרוב ביותר לעיל** עבור ההקשר המסוים הזה.

כדי להעביר הקשר ל-`Button`, עטוף אותו או אחד ממרכיבי האב שלו לספק ההקשר המתאים.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

זה לא משנה כמה שכבות של רכיבים יש בין הספק ל-`Button`. כאשר `Button` *בכל מקום* בתוך `Form` קורא `use(ThemeContext)`, הוא יקבל `"dark"` כערך.

בניגוד ל-[`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> ניתן לקרוא בתנאים וללולאות כמו <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> is called from inside a <CodeStep step={1}>`if`</CodeStep> statement, allowing you to conditionally read values from a Context.

<Pitfall>

כמו `useContext`, `use(context)` תמיד מחפש את ספק ההקשר הקרוב ביותר *מעל* הרכיב שקורא לו. הוא מחפש כלפי מעלה ו**לא** מחשיב ספקי הקשר ברכיב שממנו אתה קורא ל-`use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### הזרמת נתונים מהשרת ללקוח {/*streaming-data-from-server-to-client*/}

ניתן להזרים נתונים מהשרת ללקוח על ידי העברת הבטחה כאביזר מ<CodeStep step={1}>רכיב שרת</CodeStep> ל<CodeStep step={2}>רכיב לקוח</CodeStep>.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

<CodeStep step={2}>רכיב לקוח</CodeStep> לאחר מכן לוקח את <CodeStep step={4}>ההבטחה שקיבל כפרופסיה</CodeStep> ומעביר אותה ל-<CodeStep step={5}>`use`</CodeStep> Hook. זה מאפשר ל<CodeStep step={2}>רכיב לקוח</CodeStep> לקרוא את הערך מ<CodeStep step={4}>ההבטחה</CodeStep> שנוצרה בתחילה על ידי רכיב השרת.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
מכיוון שuse <CodeStep step={2}>`Message`</CodeStep> עטוף ב-<CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, ההחלפה תוצג עד לפתרון ההבטחה. כאשר ההבטחה תיפתר, הערך ייקרא על ידי <CodeStep step={5}>`use`</CodeStep> Hook והרכיב <CodeStep step={2}>`Message`</CodeStep> יחליף את ה-fallback Suspense.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Note>

בעת העברת הבטחה מרכיב שרת לרכיב לקוח, הערך שנפתר שלה חייב להיות ניתן לסידרה כדי לעבור בין שרת ללקוח. סוגי נתונים כמו פונקציות אינם ניתנים לסידרה ואינם יכולים להיות הערך הפתור של הבטחה כזו.

</Note>


<DeepDive>

#### האם עלי לפתור הבטחה ברכיב שרת או לקוח? {/*resolve-promise-in-server-or-client-component*/}

ניתן להעביר הבטחה מרכיב שרת לרכיב לקוח ולפתור אותו ברכיב הלקוח עם ה-`use` Hook. אתה יכול גם לפתור את ההבטחה ברכיב שרת עם `await` ולהעביר את הנתונים הנדרשים לרכיב הלקוח בתור אביזר.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

אבל שימוש ב-`await` ב-[רכיב שרת](/reference/react/components#server-components) יחסום את העיבוד שלו עד לסיום ה-`await` statement. העברת הבטחה מרכיב שרת לרכיב לקוח מונעת מההבטחה לחסום את העיבוד של רכיב השרת.

</DeepDive>

### התמודדות עם הבטחות שנדחו {/*dealing-with-rejected-promises*/}

במקרים מסוימים הבטחה שהועברה ל-`use` עלולה להידחות. אתה יכול לטפל בהבטחות שנדחו על ידי:

1. [הצגת שגיאה ל-users עם גבול שגיאה.](#displaying-an-error-to-users-with-error-boundary)
2. [מתן ערך חלופי עם `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
לא ניתן לקרוא ל-`use` בבלוק טרי-catch. במקום חסימת try-catch [עטפו את הרכיב שלך ב-Error Boundary](#displaying-an-error-to-users-with-error-boundary), או [ספק ערך חלופי ל-use בשיטת `.catch` של ההבטחה](#providing-an-catch-alternative-mise-value).
</Pitfall>

#### הצגת שגיאה ל-users עם גבול שגיאה {/*displaying-an-error-to-users-with-error-boundary*/}

אם תרצה להציג שגיאה ל-users שלך כאשר הבטחה נדחתה, אתה יכול use [גבול שגיאה](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). כדי use גבול שגיאה, עטוף את הרכיב שבו אתה קורא את `use` Hook בגבול שגיאה. אם ההבטחה שהועברה ל-`use` נדחתה, החזרה לגבול השגיאה תוצג.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### מתן ערך חלופי עם `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

אם ברצונך לספק ערך חלופי כאשר ההבטחה שהועברה ל-`use` נדחתה, תוכל use שיטת <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep>) של ההבטחה.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

כדי use שיטת <CodeStep step={1}>`catch`</CodeStep> של ה-Promise, קרא <CodeStep step={1}>`catch`</CodeStep> באובייקט ה-Promise. <CodeStep step={1}>`catch`</CodeStep> לוקח ארגומנט בודד: פונקציה שלוקחת הודעת שגיאה כארגומנט. כל מה ש<CodeStep step={2}>יוחזר</CodeStep> על ידי הפונקציה המועברת ל-<CodeStep step={1}>`catch`</CodeStep> יהיה used כערך שנפתר של ההבטחה.

---

## פתרון בעיות {/*troubleshooting*/}

### "Suspense חריג: זו לא שגיאה אמיתית!" {/*suspense-exception-error*/}

או שאתה קורא ל-`use` מחוץ לרכיב React או פונקציה Hook, או קורא ל-`use` בלוק של try-catch. אם אתה קורא `use` בתוך בלוק try-catch, עטוף את הרכיב שלך בגבול שגיאה, או התקשר ל-`catch` של ההבטחה כדי לתפוס את השגיאה ולפתור את ההבטחה עם ערך אחר. [ראה דוגמאות אלה](#dealing-with-rejected-promises).

אם אתה קורא ל-`use` מחוץ לרכיב React או פונקציה Hook, העבר את הקריאה `use` לרכיב React או פונקציה Hook.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ the function calling `use` is not a Component or Hook
    const message = use(messagePromise);
    // ...
```

במקום זאת, קרא ל-`use` מחוץ לכל סגירת רכיבים, כאשר הפונקציה שקוראת ל-`use` היא רכיב או Hook.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` is being called from a component. 
  const message = use(messagePromise);
  // ...
```
