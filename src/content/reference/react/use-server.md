---
title: "'use server'"
titleForTitleTag: "'use server' directive"
canary: true
---

<Canary>

`'use server'` רק אם אתם [משתמשים ב-React רכיבי שרת](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) או בונים ספרייה שתואמת.

</Canary>


<Intro>

`'use server'` מסמן פונקציות בצד השרת אפשר לקרוא להן מקוד בצד הלקוח.

</Intro>

<InlineToc />

---

## עיון ב-API {/*reference*/}

### `'use server'` {/*use-server*/}

הוסיפו `'use server'` התחיל גוף של פונקציה אסינכרונית כדי לסמן אותה כפונקציה שהלקוח יכול לקרוא לה. לפונקציות האלו אנחנו קוראים _פעולות שרת_.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

כשקוראים ל-Server Action מהלקוח, בקשת רשת לשרת שכוללת עותק מסודר (בסדרה) של כל הארגומנטים שעברו. אם ה-Server Action מחזיר ערך, הערך הזה יעבור בסידרה ויוחזר ללקוח.

במקום לסמן כל פונקציה בנפרד עם `'use server'`, אפשר להוסיף את ההנחיה בראש קובץ כדי לסמן שכל ה-exports בקובץ הם פעולות שרת שאפשר להשתמש בהם בכל מקום, כולל ייבוא ​​מתוך קוד לקוח.

#### הבהרות {/*caveats*/}
* __TK_0 חייב להופיע ממש בתחילת הפונקציה או המודול, לפני כל קוד אחר כולל ייבוא (מותרות הערות מעל ההנחיה). יש לכתוב אותו במרכאות יחידות או כפולות, לא עם תקלות.
* אפשר להשתמש ב-`'use server'` רק בקבצים שרצים בצד השרת. את ה-Server Actions אפשר להעביר ל-Client Components דרך props. ראו [סוג נתמכים ל-serialization](#serializable-parameters-and-return-values).
* כדי לייבא פעולת שרת מתוך [קוד לקוח](/reference/react/use-client), ההנחיה חייבת להיות ברמת מודול.
* מה שקשור הרשת מתחת למכסה המנוע הן תמיד אסינכרוניות, אפשר להשתמש ב-`'use server'` רק על פונקציות אסינכרון.
*כתובו תמיד לארגומנטים של פעולות שרת כקלט לא מהימן ובצעו הרשאה לכל שינוי מצב. ראו [שיקולי אבטחה](#security).
* מומלץ לקרוא ל-Server Actions בתוך [transition](/reference/react/useTransition). פעולות שרת שמועברות ל-[`<form action>`](/reference/react-dom/components/form#props) או ל-[`formAction`](/reference/react-dom/components/input#props) ירוצו אוטומטית בתוך המעבר.
* פעולות שרת מיועדות למוטציות שמעדכנות מצב בצד השרת; הם לא מומלצים לשליפת נתונים. בהתאם לכך, מסגרות שמממשים פעולות שרת מעבדים פועלים אחת בכל פעם ואין להם דרך למטמן את ערך החזרה.

### שיקולי אבטחה {/*security*/}

הארגוים ל-Server Actions נשלטים לגמרי על ידי הלקוח. מטעמי אבטחה, רק שאל את זה תמיד כקלט לא מהימן, ודאו שאתה מאמתים ומבצעים escaping לארגומנטים לפי הצורך.

בכל פעולת שרת, ודאו שהמשתמש המחובר מורשה לבצע את הפעולה.

<Wip>

כדי למנוע שליחה של רגישות מתוך פעולת שרת, קיים מידע APIs ניסיוניים מסוג גוון שמונעים העברת ערכים ייחודיים ואובייקטים לקוד לקוח.

ראו [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) ו-[experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### ארגומנטים וערכי החזרה שניתנים ל-serialization {/*serializable-parameters-and-return-values*/}

מה שקוד לקוח קורא ל-Server Action דרך הרשת, כל הארגומנטים שמועברים חייבים להיות ניתנים ל-Serialization.

אלה הסוגים הנתמכים לארגומנטים של פעולת שרת:

* פרימיטיביים
* [מחרוזת](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [מספר](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [גדול](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [בוליאנית](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [לא מוגדר](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [סמל](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), רק סמלים שנרשמו ב-Global Symbol Registry דרך [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* איטרטורים שמכילים ערכים שניתנים ל-serialization
	* [מחרוזת](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [מערך](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [מפה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [סט](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ו-[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [תאריך](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* מופעי [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) פשוטים: אנשים מיוחדים עם [אתחולי אובייקטים](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), עם מאפיינים שניתנים ל-serialization
* פונקציות שהן פעולות שרת
* [הבטחות](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

לעומת זאת, אלה אינם נתמכים:
* אלמנטים React או [JSX](/learn/writing-markup-with-jsx)
* פונקציות, כולל פונקציות קומפונטה או כל פונקציה אחרת שאינה Server Action
* [שיעורים](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* אובייקטים שהם מופעים של כל class (מלבד ה-built-ins שהוא זכרו) או אובייקטים עם [null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* סמלים שלא נרשמו גלובלית, למשל: `Symbol('my new symbol')`


ערכי חזרה נתמכים ב-serialization זהים ל-[ניתן להמשכה props](/reference/react/use-client#passing-props-from-server-to-client-components) עבור רכיב לקוח בגבול.


## שימוש {/*usage*/}

### פעולות שרת בתוך טפסים {/*server-actions-in-forms*/}

מקרה הפעלה הנפוץ ביותר ל-Server Actions הוא קריאה לפונקציות שרת שמבצעות מוטציה בנתונים. בדפדפן, אלמנט [HTML form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) הוא הדרך המסורתית לשלוח מוטציה מצד המשתמש. עם React Server Components, React מוסיף תמיכה הסבר ראשונה ב-Server Actions בתוך [forms](/reference/react-dom/components/form).

הנה טופס שמאפשר למשתמש לבקש שם משתמש.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

בדוגמה הזו `requestUsername` הוא שרת פעולה שמועבר ל-`<form>`. כשמשתמש הטופס, שולחת את בקשת רשת לפונקציית השרת `requestUsername`. כשקוראים ל-Server Action מתוך טופס, React יעביר את <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> של הטופס כארגומנט ראשון ל-Server Action.

על העברת שרת פעולה ל-`action` של הטופס, React יכול [לבצע שיפור פרוגרסיבי](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) לטופס. אנו יכולים לשלוח טפסים גם לפני שחבילת JavaScript נאמר.

#### טיפול בערכי חזרה בטפסים {/*handling-return-values*/}

בטופס בקשת שם משתמש יכול שהשם לא זמין. `requestUsername` צריך להחזיר לנו אם לפעול או נכשלה.

כדי לעדכן את ה-UI לפי תוצאת פעולת שרת תוך תמיכה ב-progressive enhancement, השתמשו ב-[`useFormState`](/reference/react-dom/hooks/useFormState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useFormState } from 'react-dom';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [returnValue, action] = useFormState(requestUsername, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {returnValue}</p>
    </>
  );
}
```

שימו לב שכמו רוב ה-Hooks, `useFormState` יכול להיקרא רק מתוך <CodeStep step={1}>[קוד לקוח](/reference/react/use-client)</CodeStep>.

### קריאה ל-Server Action מחוץ ל-`<form>` {/*calling-a-server-action-outside-of-form*/}

פעולות שרת הן נקודות הקצה בשרת, ואפשר לקרוא אותם מכל מקום בקוד לקוח.

כשמשתמשים ב-Server Action מחוץ ל-[form](/reference/react-dom/components/form), קראו לו בתוך [transition](/reference/react/useTransition), כדי לאפשר להציג אינדיקציית טעינה, להראות [עדכוני state אופטימיים](/reference/react/useOptimistic), ולטפל. טפסים עוטפים פעולות שרת אוטומטית בתוך מעברים.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

כדי לקרוא את הערך החזרה של פעולת שרת צריך לבצע `await` להבטחת שמוחזר.
