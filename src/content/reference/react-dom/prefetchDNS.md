---
title: "אחזור מראש של DNS"
canary: true
---

<Canary>

הפונקציה `prefetchDNS` זמינה כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`prefetchDNS` יכול לבצע חיפוש מוקדם של כתובת ה-IP של שרת את מצפים לטעון ממנו משאבים.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

כדי לבצע חיפוש למארח, קראו לפעולה `prefetchDNS` מתוך `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[עוד דוגמאות נוספות.](#usage)

הפונקציה `prefetchDNS` מספקת לדפדפן רמז שכדאי לו לבצע חיפוש לכתובת ה-IP של שרת נתון. אם הדפדפן בוחר לעשות זאת, זה יכול להאיץ טעינה של משאבים מהשרת הזה.

#### פרמטרים {/*parameters*/}

* `href`: מחרוזת. ה-URL של השרת שאליו רוצים להתחבר.

#### מחזירה {/*returns*/}

`prefetchDNS` לא מחזירה דבר.

#### אזהרות {/*caveats*/}

* כמה קריאות ל-`prefetchDNS` עם אותו שרת משפיעות כמו קריאה אחת.
* בדפדפן אפשר לקרוא ל-`prefetchDNS` בכל מצב: בזמן רינדור קומפונטה, בתוך אפקט, בתוך מטפל באירועים, וכן הלאה.
* ברינדור צד שרת או ברינדור רכיבי שרת, ל-`prefetchDNS` יש רק רק אם קוראים לה בזמן רינדור קומפוננטה או בהקשר אסינכרון שמקורו ברינדור קומפוננטה. קריאות אחרות ייחסמו.
* אם אתם יודעים אילו משאבים ספציפיים תצטרכו, אפשר לקרוא [לפונקציות אחרות](/reference/react-dom/#resource-preloading-apis) שמתחילות לטעון את המשאבים מיד.
* אין תועלת ב-prefetch לאותו שרת שעליו מתארח דף הווב עצמו, כי בדיקת אליו כבר בוצעה עד לשלו היה ניתן הרמז.
* בהשוואה ל-[`preconnect`](/reference/react-dom/preconnect), יכול ש-`prefetchDNS` עדיף אם אתם מתחברים ספקולטיבית למספר גדול של דומיינים, מצב שבו העלות של preconnections עלולה לעלות על התועלת.

---

## שימוש {/*usage*/}

### DNS Prefetch בזמן רינדור {/*prefetching-dns-when-rendering*/}

קראו ל-`prefetchDNS` בזמן רינדור קומפוננטה אם אתם יודעים שהילדים שלהם יטענו משאבים חיצוניים מאותו מארח.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### אחזור DNS מראש בתוך מטפל באירועים {/*prefetching-dns-in-an-event-handler*/}

קראו ל-`prefetchDNS` בתוך מטפל באירועים לפני מעבר או מצב יידרשו משאבים חיצוניים. כך מתחילים להמשך קריאה בזמן רינדור העמוד או המצב החדש.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
