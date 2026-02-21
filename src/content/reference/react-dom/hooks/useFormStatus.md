---
title: "useFormStatus"
canary: true
---

<Canary>

ה-Hook `useFormStatus` זמין כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useFormStatus` הוא Hook שמספק מידע סטטוס על שליחת הטופס האחרונה.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

ה-Hook `useFormStatus` מספק מידע סטטוס על שליחת הטופס האחרונה.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

כדי לקבל מידע סטטוס, רכיב `Submit` חייב להיות מרונדר בתוך `<form>`. ה-Hook מחזיר מידע כמו המאפיין <CodeStep step={1}>`pending`</CodeStep> שמציין האם הטופס כרגע בשליחה.

בדוגמה למעלה, `Submit` משתמש במידע הזה כדי להשבית לחיצות על `<button>` בזמן שהטופס נשלח.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

`useFormStatus` לא מקבל פרמטרים.

#### מחזירה {/*returns*/}

אובייקט `status` עם המאפיינים הבאים:

* `pending`: ערך בוליאני. אם TK_1__, היא `<form>` ההורה יש שליחה ממתינה. אחרת `false`.

* `data`: אובייקט שמממש את [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ומכיל את ש-`<form>` ההורה שולח. אם אין שליחה פעילה או שאין `<form>` הורה, הערך יהיה `null`.

* `method`: מחרוזת בערך `'get'` או `'post'`. מעוררת האם ה-`<form>` ההורה שולחת באמצעות `GET` או `POST` [שיטת HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). כברירת מחדל, `<form>` תשתמש ב-`GET`, ואפשר להגדיר זאת דרך המאפיין [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (קישור לתיעוד `<form>`. "קרא עוד על אביזר `action` על `<form>`." )
* `action`: הפניה לפונקציה שהועברה ל-prop בשם `action` של `form` ההורה. אם אין `<form>` הורה, המאפיין הוא `null`. אם סופק ערך URI ל-prop `action`, או שלא צוין `action`, הערך של `status.action` יהיה `null`.

#### אזהרות {/*caveats*/}

* ה-Hook `useFormStatus` חייב להיקרא מתוך קומפונטה שמרונדרת בתוך `<form>`.
* `useFormStatus` תחזיר מידע סטטוס רק עבור `<form>` הורה. היא לא תחזיר מידע סטטוס עבור `<form>` שמרונדרת באותו קומפונטה עצמה או בקומפוננטות ילדים.

---

## שימוש {/*usage*/}

### הצגת מצב בהמתנה בזמן שליחת טופס {/*display-a-pending-state-during-form-submission*/}
כדי להציג מצב בהמתנה בזמן שטופס נשלח, אפשר לקרוא ל-Hook `useFormStatus` בקומפוננטה שמרונדרת בתוך `<form>` ולקרוא את מאפיין `pending` שמוחזר.

כאן אנחנו משתמשים ב-`pending` כדי לציין שהטופס נשלח.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Pitfall>

##### `useFormStatus` לא תחזיר מידע סטטוס עבור `<form>` שמרונדרת באותה קומפונטה. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

ה-Hook `useFormStatus` מחזיר מידע סטטוס רק עבור `<form>` הורה ולא עבור `<form>` שמרונדרת באותה קומפוננטה שקוראת ל-Hook, או בקומפוננטות ילדים.

```js
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

במקום זאת, קראו ל-`useFormStatus` מתוך קומפוננתה נמצאת בתוך `<form>`.

```js
function Submit() {
  // ✅ `pending` will be derived from the form that wraps the Submit component
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // This is the <form> `useFormStatus` tracks
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### קריאת נתוני הטופס שנשלחים {/*read-form-data-being-submitted*/}

אפשר להשתמש במאפיין `data` מתוך מידע הסטטוס שמוחזר מ-`useFormStatus` כדי להציג אילו נתונים משתמש שולח.

כאן יש לנו טופס שבו משתמשים יכולים לבקש שם משתמש. אפשר להשתמש ב-`useFormStatus` כדי להציג הודעת סטטוס זמנית שמאשרת איזה משתמש הם ביקשו.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

---

## פתרון תקלות {/*troubleshooting*/}

### `status.pending` אף פעם לא `true` {/*pending-is-never-true*/}

`useFormStatus` תחזיר מידע סטטוס רק עבור `<form>` הורה.

אם הקומפוננטה שקוראת ל-`useFormStatus` אינה מקוננת בתוך `<form>`, הערך `status.pending` תמיד יהיה `false`. ודאו ש-`useFormStatus` נקראת בתוך קומפוננטה שהיא ילדה של אלמנט `<form>`.

`useFormStatus` לא תעקוב אחרי הסטטוס של `<form>` שמרונדרת במקביל. ראו [pitfall](#useformstatus-will-not-return-status-information-for-a-formed-in-the-the-component) לפרטים נוספים.
