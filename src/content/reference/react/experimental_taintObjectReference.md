---
title: "experimental_taintObjectReference"
---

<Wip>

**ה-API הזה ניסיוני ועדיין לא זמין בגרסה יציבה של React.**

אפשר לנסות אותו על ידי שדרוג חבילות React לגרסה הניסיונית העדכנית ביותר:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

גרסאות ניסיוניות של React עשויות להכיל באגים. אל תשתמשו בהפקה.

ה-API הזה זמין רק בתוך React רכיבי שרת.

</Wip>


<Intro>

`taintObjectReference` מאפשרת למנוע העברה של מופע אובייקט ל-Client Component, כמו אובייקט `user`.

```js
experimental_taintObjectReference(message, object);
```

כדי למנוע העברה של מפתח, hash או token, ראו [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

קראו ל-`taintObjectReference` עם אובייקט כדי לרשום אותו ב-React כמשהו שאסור להעביר ללקוח כפי שהוא:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `message`: ההודעה שתמסור אם האובייקט יועבר ל-Client Component. ההודעה הזו תוצג כחלק מה-שגיאה שיושלך אם השאילתה יועבר ל-Client Component.

* `object`: האובייקט שיסומן כ-tainted. אפשר להעביר פעולות ומופעי מחלקות ל-`taintObjectReference` כ-`object`. פונקציות ומחלקות כבר חסומות להעברה ל-Client Components, אבל הודעת השגיאה ברירת המחדל של React תוחלף במה שהגדרתם ב-`message`. כאשר מופע ספציפי של מערך הקלד מועבר ל-`taintObjectReference` כ-`object`, עותקים אחרים של אותה מערך הקלד לא יסומנו כ-tainted.

#### מחזירה {/*returns*/}

`experimental_taintObjectReference` מחזירה `undefined`.

#### אזהרות {/*caveats*/}

- יצירה מחדש או שכפול של אובייקט אובייקט אובייקט חדש שאינו tainted וייתכן שמכיל מידע רגיש. לדוגמה, אם יש אובייקט `user` שמסומן כ-tainted, הקוד `const userInfo = {name: user.name, ssn: user.ssn}` או `{...user}` ייצור אובייקטים חדשים לכם ממש מוכתמים. ‏`taintObjectReference` מגינה רק מפני טעויות פשוטות שבהן האובייקט מועבר ל-Client Component ללא שינוי.

<Pitfall>

**אל תסתמכו רק על tainting לאבטחה.** סימון אובייקט כ-tainted לא מונע דליפה של כל ערך נגזר אפשרי. לדוגמה, שכפול של אובייקט tainted יוצר אובייקט חדש שאינו tainted. שימוש בנתונים מתוך אובייקט tainted (כלומר `{secret: taintedObj.secret}`) יוצר ערך או אובייקט חדש שאינו tainted. Tainting היא שכבת הגנה אחת; אפליקציה מאובטחת תכלול כמה שכבות הגנה, APIs מתוכננים היטב ודפוסי בידוד.

</Pitfall>

---

## שימוש {/*usage*/}

### מניעה לא מכוונת של נתוני משתמש ללקוח {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

רכיב לקוח לעולם לא אמור לקבל אובייקטים שמכילים מידע רגיש. אידיאלית, פעולות הבאות הן לא אמורות לחשוף מידע של הנוכחית אין הרשאה אליו. קורות טעויות על ריפקטורינג. להתגונן מפני טעויות כאלה בהמשך, אפשר "לסמן" את המשתמש ב-API ליום שלנו.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

עכשיו, בכל פעם שמישהו ינסה להעביר את האובייקט הזה לרכיב לקוח, תיזרק שגיאה עם הודעת השגיאה שהועברה.

<DeepDive>

#### הגנה מפני דליפות בהבאת נתונים {/*protecting-against-leaks-in-data-fetching*/}

אם אתם מריצים סביבת רכיבי שרת יש להגיש גישה למידע רגיש, צריך להיזהר לא להעביר אובייקטים כמות:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

אידיאלית, `getUser` לא אמורה לחשוף מידע של המשתמש אין הרשאה אליו. כדי למנוע העברה של אובייקט `user` ל-Client Component בהמשך הדרך, אפשר "לסמן" אותו כ-tainted:


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

עכשיו, אם מישהו ינסה להעביר את האובייקט `user` ל-Client Component, תיזרק שגיאה עם ההודעה שהוגדרה.

</DeepDive>
