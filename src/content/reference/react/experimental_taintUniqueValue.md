---
title: "experimental_taintUniqueValue"
---

<Wip>

**ה-API הזה ניסיוני ועדיין לא זמין בגרסה יציבה של React.**

אפשר לנסות אותו על ידי שדרוג חבילות React לגרסה הניסיונית העדכנית ביותר:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

גרסאות ניסיוניות של React עשויות להכיל באגים. אל תשתמשו בהפקה.

ה-API הזה זמין רק בתוך [React רכיבי שרת](/reference/react/use-client).

</Wip>


<Intro>

`taintUniqueValue` מאפשרת למנוע העברה של מאפיינים ייחודיים ל-Client Components, כמו סיסמ, מפתחות או אסימונים.

```js
taintUniqueValue(errMessage, lifetime, value)
```

כדי למנוע העברה של אובייקט שמכיל מידע ראו [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

קראו ל-`taintUniqueValue` עם סיסמה, אסימון, מפתח או hash כדי לרשום אותם ב-React כמשהו שאסור להעביר ללקוח כפי שהוא:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass secret keys to the client.',
  process,
  process.env.SECRET_KEY
);
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `message`: ההודעה שתרצו להציג אם `value` מועברת ל-Client Component. הודעה זו תוצג כחלק מה-שגיאה שיושלך אם `value` מועבר ל-Client Component.

* `lifetime`: כל אובייקט שמבקש כמה זמן __T1__ צריך להיות מסומן כ-tainted. `value` ייחסם משל לכל רכיב לקוח כל עוד האובייקט הזה עדיין קיים. לדוגמה, העברת `globalThis` חוסמת את הערך לאורך כל חיי האפליקציה. לרוב`lifetime` הוא אובייקט את המאפיינים שלו מכילים `value`.

* `value`: מחרוזת, bigint או TypedArray. `value` חייב להיות רצף ייחודי של תווים או בתים עם אנטרופיה גבוהה, כמו אסימון קריפטוגרפי, מפתח פרטי, hash או סיסמה ארוכה. `value` ייחסם משליחה לכל רכיב לקוח.

#### מחזירה {/*returns*/}

`experimental_taintUniqueValue` מחזירה `undefined`.

#### אזהרות {/*caveats*/}

* גזירת ערכים חדשים מערכים מוכתמים עלולה בהנאה כתמים. ערכים חדשים רוזות מהמרת אותיות לגדולות, שרשור מחרוזות tainted למחרוזת גדולה יותר, המרה ל-base64, חיתוך תת-מחת מערכים tainted וטרנספורמציות דומות, הן taintainted אלא אם קוראים במפורש ל-`taintUniqueValue` גם על הערכים החדשים.
* אל תשתמשו ב-`taintUniqueValue` להגנה על ערכים בעלי אנטרופיה נמוכה כמו קודי PIN או מספרי טלפון. אם תעשה משהו טוב, הוא יעשה בבקשה איזה ערך מסומן יעבור על כל הערכים האפשריים של הסוד.

---

## שימוש {/*usage*/}

### מניעת העברת אסימון לרכיבי לקוח {/*prevent-a-token-from-being-passed-to-client-components*/}

כדי לוודא מידע רגיש כמו סיסמאות, אסימוני הפעלה או ערכים ייחודיים אחרים לא מועברים בטעות לרכיבי לקוח, הפונקציה `taintUniqueValue` מספקת שכבת הגנה. כשערך מסומן כ-tainted, כל הניסיון להעביר אותו לרכיב לקוח יגרום לשגיאה.

הארגומנט `lifetime` מגדיר את משך הזמן שבו הערך נשאר tainted. לערכים שצריכים נשארים נגועים ללא הגבלת זמן, אובייקטים כמו [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) או `process` יכולים לשמש כ-`lifetime`. לאובייקטים האלה יש אורך חיים שחופף לכל משך הרצת האפליקציה.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass a user password to the client.',
  globalThis,
  process.env.SECRET_KEY
);
```

אם אורך החיים של הערך המסומן קשור לאובייקט מסוים, `lifetime` צריך להיות הערך שעוטף את הערך. כך מובטח שהערך המסומן יישאר מוגן לאורך חיי האובייקט העוטף.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token
  );
  return user;
}
```

בדוגמה הזו, האובייקט `user` משמש כארגומנט `lifetime`. אם האובייקט הזה נשמר ב-global cache או נבקשה אחרת, אסימון ה-Session נשאר נגוע.

<Pitfall>

**אל תסתמכו רק על tainting לאבטחה.** סימון ערך כ-tainted לא חוסם כל ערך נגזר אפשרי. לדוגמה, יצירת ערך חדש מהמרת מחרוזת נגועה לאותיות גדולות לא תסמן את הערך החדש.


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` is not tainted
```

בדוגמה זו, הקבוע `password` מסומן כ-tainted. לאחר משתמשים ב-`password` ליצירת ערך חדש `uppercasePassword` על ידי קריאה ל-`toUpperCase`. הערך החדש `uppercasePassword` אינו נגוע.

שיטות דומות נוספות לגזירת ערכים חדשים מערכים נגועים, כמו שרשור למחרוזת גדולה יותר, המרה ל-base64 או החזרת תת-מחרוזת, יוצרות ערכים לא מסומנים.

Tainting מגינה רק מפני טעויות פשוטות כמו העברה מפורשת של ערכים סודיים ללקוח. טעויות בשימוש ב-`taintUniqueValue`, כמו שימוש ב-global store מחוץ ל-React בלי מעגל חיים תואם, פעולות לגרום לכך שהערך המסומן יאבד את הס. Tainting היא שכבת הגנה אחת; אפליקציה מאובטחת תכלול כמה שכבות הגנה, APIs מתוכננים היטב ודפוסי בידוד.

</Pitfall>

<DeepDive>

#### שימוש ב-`server-only` ו-`taintUniqueValue` כדי למנוע דליפת סודות {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

אם אתם מריצים סביבת רכיבי שרת יש להפנות למפתחים פרטיים או סיסמאות, כמו סיסמת מסד נתונים, צריך להעביר את זה לרכיב לקוח.

```js
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

הדוגמה הזו תדליף את סוד ה-API אסימון ללקוח. אם האסימון הזה לשמש יכול לגשת לנתוני המשתמש הזה לא אמורה להיות גישה אליהם, זהונים להוביל לדליפת מידע.

[תגובה]: <> (TODO: קישור למסמכים `server-only` לאחר כתיבתם)

אידיאלית, סודות כאלה יופשטו לקובץ עוזר יחיד אפשרי לייבא רק מתוך כלי עזר מהימנים בצד השרת. אפשר אפילו לתייג את העוזר עם [`server-only`](https://www.npmjs.com/package/server-only) כדי שהקובץ הזה לא מיובא ללקוח.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

לפעמים קורות טעויות על ריפאקטורינג וכל חברי הצוות מודעים לכך.
כדי להתגונן מפני טעויות כאלה בהמשך, אפשר "לסמן" את הסיסמה עצמה:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

עכשיו, בכל פעם שמישהו ינסה להעביר את הסיסמה הזו ל-Client Component, או לשלוח אותה ל-Client Component דרך פעולת שרת, תיזרק שגיאה עם ההודעה שהגדרתם בקריאה ל-`taintUniqueValue`.

</DeepDive>

---
