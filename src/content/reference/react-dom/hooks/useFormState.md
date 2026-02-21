---
title: "useFormState"
canary: true
---

<Canary>

ה-Hook `useFormState` זמין כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי שחרור](/community/versioning-policy#all-release-channels). בנוסף, צריך להשתמש ב-framework שתומך ב-[React רכיבי שרת](/reference/react/use-client) כדי לקבל את מלוא התועלת מ-`useFormState`.

</Canary>

<Intro>

`useFormState` הוא Hook שמאפשר לעדכן state על בסיס תוצאת פעולה של טופס.

```js
const [state, formAction] = useFormState(fn, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useFormState(action, initialState, permalink?)` {/*useformstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

קראו ל-`useFormState` ברמה העליונה של הקומפוננטה כדי ליצור state לקומפוננטה שמתעדכן [כשפעולת טופס מופעלת](/reference/react-dom/components/form). אתם מעבירים ל-`useFormState` פונקציית טופס פעולה קיים יחד עם state התחלתי, והפונקציה מחזירה פעולה חדשה שתשתמשו בה בטופס, יחד עם מצב הטופס העדכני ביותר. מצב הטופס העדכני גם מועבר לפונקציה שסיפקתם.

```js
import { useFormState } from "react-dom";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useFormState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

מצב הטופס הוא הערך שמוחזר מה-פעולה כשהטופס התפרסם לאחרונה. אם הטופס עדיין לא הוגש, זה יהיה ה-state ההתחלה שהעברתם.

בשימוש עם Server Action, ‏`useFormState` יכול להציע את תגובת השרת מהגשת הטופס עוד לפני שה-hydration הושלם.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `fn`: הפונקציה שתיקרא כששולחים את הטופס או לוחצים על כפתור. כשהפונקציה נקראת, היא מקבלת את מצב הטופס הקודם (בהתחלה ה-`initialState` העברתם, ובהמשך ערך ההחזרה הקודם שלה) כארגומנט ראשון, ואז את הארגומנטים ש-form action מקבלת בדרך כלל.
* `initialState`: הערך שתרצו שיהיה במצב בתחילה. הוא יכול להיות כל ערך לסריאליזציה. מתעלמים מהארגומנט הזה אחרי הפעלת הפעולה בפעם הראשונה.
* **אופציונלי** `permalink`: מחרוזת שמכילה את כתובת האתר העמוד הייחודי שהטופס הזה משנה. מיועדים עם תוכן דינמי (פיד) עם שיפור פרוגרסיבי: אם `fn` [פעולת שרת](/reference/react/use-server) והטופס נשלח לפני ש-JavaScript bundleten, הדפדפן הפונה ל-URL יחד של ה-permalink שצוין במקום ל-URL של העמוד הנוכחי. ודאו שאותה קומפונטת טופס מרונדרת בעמוד היעד (כולל פעולה אותה `fn` ואותו `permalink`) כדי ש-React תדע להעביר את המצב. אחרי שהטופס עובר הידרציה, לפרמטר הזה אין מעורב.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### מחזירה {/*returns*/}

`useFormState` חזירה מערך עם שני ערכים בדיוק:

1. הנוכחי הנוכחי. בזמן הרינדור הראשון הוא יתאים ל-`initialState` שהעברתם. אחרי שהפעולה הופנתה, הוא יתאים לערך שהוא חזר מהפעולה.
2. פעולה חדשה שאפשר להעביר כ-prop בשם `action` לקומפוננטת `form` שלכם, או כ-prop בשם `formAction` לכל קומפונטת `button` בתוך הטופס.

#### אזהרות {/*caveats*/}

* כשמשתמשים משתמשים שתומכת ב-React רכיבי שרת, `useFormState` יכול להפוך טפסים לאינטראקטיביים עוד לפני ש-JavaScript בוצע בלקוח. בשימוש בלי רכיבי שרת, זה שקול ל-state מקומי של קומפונטה.
* הפונקציה שמועברת ל-`useFormState` מקבלת ארגומנט נוסף — ה-state הקודם או ההתחלה — כארגומנט ראשון. החתימה שלה שונה מאשר שימוש ישיר בה כ-form action בלי `useFormState`.

---

## שימוש {/*usage*/}

### שימוש במידע שמוחזר מפעולת טופס {/*using-information-returned-by-a-form-action*/}

קראו ל-`useFormState` ברמה העליונה של הקומפוננטה כדי לגשת לערך ההחזרה של פעולה מהפעם האחרונה שהטופס הזמין.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useFormState } from 'react-dom';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useFormState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useFormState` מחזירה מערך עם שני פריטים בדיוק:

1. ה-<CodeStep step={1}>state הנוכחי</CodeStep> של הטופס. בתחילה הוא מוגדר ל-<CodeStep step={4}>state ההתחלתי</CodeStep> שסיפקתם, ואחרי הגשת הטופס הוא מוגדר לערך ההחזרה של ה-<CodeStep step={3}>action</CodeStep>.
2. <CodeStep step={2}>פעולה חדשה</CodeStep> שאתם מעבירים ל-`form` כ-prop בשם `action`.

כשהטופס נשלח, פונקציית ה-<CodeStep step={3}>action</CodeStep> שסיפקתם תיקרא. ערך ההחזרה שלה יהפוך ל-<CodeStep step={1}>state הנוכחי</CodeStep> החדש של הטופס.

ה-<CodeStep step={3}>action</CodeStep> שסיפקתם תקבל גם ארגומנט ראשון חדש: ה-<CodeStep step={1}>state הנוכחי</CodeStep> של הטופס. בפעם הראשונה שהטופס נשלח, זה יהיה ה-<CodeStep step={4}>state ההתחלה</CodeStep> שסיפקתם; בשליחות הבאות, זה יהיה ערך ההחזרה מהפעם הקודמת שהפעולה נקראה. שאר הארגומנטים זהים במצב שבו `useFormState` לא הייתה בשימוש.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Display information after submitting a form" titleId="display-information-after-submitting-a-form">

#### הצגת שגיאות טופס {/*display-form-errors*/}

כדי להציג הודעות כמו שגיאה או טווסט שמוחזרות מ-Server Action, עטפו את הפעולה בקריאה ל-`useFormState`.

<Sandpack>

```js src/App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useFormState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
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

<Solution />

#### הצגת מידע מובנה אחרי שליחת טופס {/*display-structured-information-after-submitting-a-form*/}

ערך ההחזרה מ-Server Action יכול להיות כל ערך לריאליזציה. למשל, אובייקט שכולל ערך בוליאני שמגיש אם פתרון הצליחה, הודעת שגיאה או מידע מעודכן.

<Sandpack>

```js src/App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useFormState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
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

<Solution />

</Recipes>

## פתרון בעיות {/*troubleshooting*/}

### הפעולה שלי כבר לא יכולה לקרוא את נתוני הטופס שנשלחו {/*my-action-can-no-longer-read-the-submitted-form-data*/}

כשעוטפים פעולה עם `useFormState`, היא מקבלת ארגומנט נוסף *כארגומנט ראשון*. לכן נתוני הטופס שנשלחו הופכים ל-*ארגומנט השני* במקום הראשון כפי שבדרך כלל. הארגומנט הראשון החדש שנוסף הוא מצב הטופס הנוכחי.

```js
function action(currentState, formData) {
  // ...
}
```
