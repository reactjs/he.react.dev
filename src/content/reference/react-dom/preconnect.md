---
title: "להתחבר מראש"
canary: true
---

<Canary>

הפונקציה `preconnect` זמינה כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`preconnect` מאפשרת להתחבר מראש לשרת את מצפים לטעון ממנו משאבים.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

כדי לבצע חיבור מראש למארח, קראו לפעולה `preconnect` מתוך `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[עוד דוגמאות נוספות.](#usage)

הפונקציה `preconnect` מספקת לדפדפן רמז שכדאי לפתוח חיבור לשרת הנתון. אם הדפדפן בוחר לעשות זאת, זה יכול להאיץ טעינה של משאבים מהשרת הזה.

#### פרמטרים {/*parameters*/}

* `href`: מחרוזת. ה-URL של השרת שאליו רוצים להתחבר.


#### מחזירה {/*returns*/}

`preconnect` לא מחזירה דבר.

#### אזהרות {/*caveats*/}

* כמה קריאות ל-`preconnect` עם אותו שרת משפיעות כמו קריאה אחת.
* בדפדפן אפשר לקרוא ל-`preconnect` בכל מצב: בזמן רינדור קומפונטה, בתוך אפקט, בתוך מטפל באירועים, וכן הלאה.
* ברינדור צד שרת או ברינדור רכיבי שרת, ל-`preconnect` יש רק רק אם קוראים לה בזמן רינדור קומפוננטה או בהקשר אסינכרון שמקורו ברינדור קומפוננטה. קריאות אחרות ייחסמו.
* אם אתם יודעים אילו משאבים ספציפיים תצטרכו, אפשר לקרוא [לפונקציות אחרות](/reference/react-dom/#resource-preloading-apis) שמתחילות לטעון את המשאבים מיד.
* אין תועלת ב-preconnect לאותו שרת שעליו מתארח דף הווב עצמו, כי החיבור אליו כבר פתוח עד לרגע שבו היה ניתן הרמז.

---

## שימוש {/*usage*/}

### התחבר מראש בזמן רינדור {/*preconnecting-when-rendering*/}

קראו ל-`preconnect` בזמן רינדור קומפוננטה אם אתם יודעים שהילדים שלהם יטענו משאבים חיצוניים מאותו מארח.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### התחבר מראש בתוך מטפל באירועים {/*preconnecting-in-an-event-handler*/}

קראו ל-`preconnect` בתוך מטפל באירועים לפני מעבר או מצב יידרשו משאבים חיצוניים. כך מתחילים להמשך קריאה בזמן רינדור העמוד או המצב החדש.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
