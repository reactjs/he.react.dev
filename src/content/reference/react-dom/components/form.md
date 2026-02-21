---
title: "<טופס>"
canary: true
---

<Canary>

ההרחבות של React ל-`<form>` זמינות כרגע רק בערוצים הקנריים והניסיוניים של React. במהדורות יציבות של React, `<form>` פועל רק כ[רכיב דפדפן HTML מובנה](https://react.dev/reference/react-dom/components#all-html-components). למידע נוסף על ערוצי ההפצה של [React כאן](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

[רכיב הדפדפן המובנה `<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) מאפשר לך ליצור פקדים אינטראקטיביים לשליחת מידע.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<form>` {/*form*/}

כדי ליצור פקדים אינטראקטיביים לשליחת מידע, עבד את [רכיב הדפדפן המובנה `<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[ראה דוגמאות נוספות למטה.](#usage)

#### אבזרים {/*props*/}

`<form>` תומך בכל [הרכיב המשותף props.](/reference/react-dom/components/common#props)

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): כתובת URL או פונקציה. כאשר כתובת URL מועברת אל `action` הטופס יתנהג כמו רכיב הטופס HTML. כאשר פונקציה מועברת אל `action` הפונקציה תטפל בהגשת הטופס. הפונקציה המועברת אל `action` עשויה להיות אסינכרונית ותכיל את הארגומנט [K_1] (__0) ניתן לעקוף את הטופס `action` על ידי תכונה `formAction` ברכיב `<button>`, `<input type="submit">` או `<input type="image">`.

#### אזהרות {/*caveats*/}

* כאשר פונקציה מועברת ל-`action` או `formAction`, שיטת ה-HTTP תהיה POST ללא קשר לערך של הפרופס `method`.

---

## שימוש {/*usage*/}

### טיפול בהגשת טופס בלקוח {/*handle-form-submission-on-the-client*/}

העבירו פונקציה למאפיין `action` של הטופס כדי להפעיל את הפונקציה כאשר הטופס נשלח. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) יועבר לפונקציה כארגומנט כדי שתוכל לגשת לנתונים שנשלחו על ידי הטופס. זה שונה מהפעולה הרגילה של [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action), שמקבלת רק כתובות URL.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### טיפול בהגשת טופס עם פעולת שרת {/*handle-form-submission-with-a-server-action*/}

עיבוד `<form>` עם כפתור קלט ושליחה. העבירו פעולת שרת (פונקציה המסומנת ב-[`'use server'`](/reference/react/use-server)) למאפיין `action` של הטופס כדי להפעיל את הפונקציה כאשר הטופס נשלח.

העברת פעולת שרת ל-`<form action>` מאפשרת ל-users לשלוח טפסים ללא JavaScript מופעל או לפני שהקוד נטען. זה מועיל ל-users שיש להם חיבור איטי, מכשיר או ש-JavaScript מושבתים ודומה לאופן שבו טפסים עובדים כאשר כתובת URL מועברת ל-`action` מאפיין.

אתה יכול use שדות טפסים מוסתרים כדי לספק נתונים לפעולה של `<form>`. פעולת השרת תיקרא עם נתוני שדה הטופס המוסתרים כמופע של [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

במקום שימוש בשדות טופס מוסתרים כדי לספק נתונים לפעולה של `<form>`, אתה יכול לקרוא לשיטת <CodeStep step={1}>`bind`</CodeStep> כדי לספק לה ארגומנטים נוספים. זה יקשר ארגומנט חדש (<CodeStep step={2}>`productId`</CodeStep>) לפונקציה בנוסף ל-<CodeStep step={3}>`formData`</CodeStep> שמועבר כארגומנט לפונקציה.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

כאשר `<form>` מוצג על ידי [רכיב שרת](/reference/react/use-client), ו-[פעולת שרת](/reference/react/use-שרת) מועברת למאפיין `action` של `<form>`, הטופס [__TK_3] משופר בהדרגה

### הצג state בהמתנה במהלך שליחת הטופס {/*display-a-pending-state-during-form-submission*/}
כדי להציג state בהמתנה כאשר טופס נשלח, אתה יכול לקרוא ל-`useFormStatus` Hook ברכיב שעובד ב-`<form>` ולקרוא את המאפיין `pending` שהוחזר.

כאן, אנו use המאפיין `pending` כדי לציין שהטופס נשלח.

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

למידע נוסף על `useFormStatus` Hook עיין ב[תיעוד ההפניה](/reference/react-dom/hooks/useFormStatus).

### עדכון אופטימי של נתוני טופס {/*optimistically-updating-form-data*/}
ה-`useOptimistic` Hook מספק דרך לעדכן בצורה אופטימית את ממשק user לפני שתסתיים פעולת רקע, כמו בקשת רשת. בהקשר של טפסים, טכניקה זו עוזרת לגרום לאפליקציות להרגיש רספונסיביות יותר. כאשר user שולח טופס, במקום לחכות לתגובת השרת שתשקף את השינויים, הממשק מתעדכן מיד בתוצאה הצפויה.

לדוגמה, כאשר user מקליד הודעה בטופס ולוחץ על כפתור "שלח", ה-`useOptimistic` Hook מאפשר להודעה להופיע מיד ברשימה עם תווית "שולח...", עוד לפני שההודעה נשלחה בפועל לשרת. גישה "אופטימית" זו נותנת רושם של מהירות והיענות. לאחר מכן, הטופס מנסה לשלוח באמת את ההודעה ברקע. לאחר שהשרת מאשר שההודעה התקבלה, התווית "שולח..." מוסרת.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

[//]: # 'בטל את ההערה לשורה הבאה, ומחק את השורה הזו לאחר פרסום דף התיעוד `useOptimistic` הפניה'
[//]: # 'למידע נוסף על `useOptimistic` Hook עיין ב[תיעוד ההפניה](/reference/react/hooks/useOptimistic).'

### טיפול בשגיאות שליחת טופס {/*handling-form-submission-errors*/}

במקרים מסוימים הפונקציה שנקראת על ידי `action` של `<form>` זורקת שגיאה. אתה יכול לטפל בשגיאות אלה על ידי עטיפה של `<form>` ב-Error Boundary. אם הפונקציה הנקראת על ידי משענת `action` של `<form>` זורקת שגיאה, החזרה לגבול השגיאה תוצג.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### הצג שגיאת שליחת טופס ללא JavaScript {/*display-a-form-submission-error-without-javascript*/}

הצגת הודעת שגיאה של שליחת טופס לפני טעינת החבילה JavaScript לצורך שיפור מתקדם דורשת:

1. `<form>` יעובדו על ידי [רכיב שרת](/reference/react/use-client)
1. הפונקציה המועברת למפרץ `action` של `<form>` תהיה [פעולת שרת](/reference/react/use-שרת)
1. ה-`useFormState` Hook יהיה used כדי להציג את הודעת השגיאה

`useFormState` לוקח שני פרמטרים: [פעולת שרת](/reference/react/use-שרת) ו-state ראשוני. `useFormState` מחזיר שני ערכים, משתנה state ופעולה. הפעולה המוחזרת על ידי `useFormState` צריכה להיות מועברת ל-`action` של הטופס. המשתנה state המוחזר על ידי `useFormState` יכול להיות used כדי להציג הודעת שגיאה. הערך המוחזר על ידי [פעולת השרת](/reference/react/use-server) המועבר ל-`useFormState` יהיה used כדי לעדכן את המשתנה state.

<Sandpack>

```js src/App.js
import { useFormState } from "react-dom";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, formAction] = useFormState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={formAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

למידע נוסף על עדכון state מפעולת טופס עם המסמכים [`useFormState`](/reference/react-dom/hooks/useFormState)

### טיפול במספר סוגי הגשה {/*handling-multiple-submission-types*/}

ניתן לעצב טפסים כך שיטפלו בפעולות הגשה מרובות בהתבסס על הכפתור שנלחץ על ידי ה-user. ניתן לשייך כל כפתור בתוך טופס לפעולה או התנהגות מובחנים על ידי הגדרת הפרופס `formAction`.

כאשר user מקיש על כפתור ספציפי, הטופס נשלח, ופעולה מתאימה, המוגדרת על ידי התכונות והפעולה של אותו כפתור, מבוצעת. לדוגמה, טופס עשוי לשלוח מאמר לבדיקה כברירת מחדל, אך יש לו לחצן נפרד עם `formAction` מוגדר לשמור את המאמר כטיוטה.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
