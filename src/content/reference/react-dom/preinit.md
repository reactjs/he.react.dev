---
title: "preinit"
canary: true
---

<Canary>

הפונקציה `preinit` זמינה כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Frameworks מבוססי React](/learn/start-a-new-react-project) מטפלים יכולים לעתים קרובות בטעינת משאבים בשבילכם, אז ייתכן שלא תצטרכו לקרוא ל-API הזה בעצמכם. לפרטים, עיינו בתיעוד של ה-framework שלכם.

</Note>

<Intro>

`preinit` מותר להביא מראש ולהעריך גיליון סגנונות או סקריפט חיצוני.

```js
preinit("https://example.com/script.js", {as: "style"});
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

כדי לבצע התחלה לסקרפט או גיליון סגנונות, קראו לפונקציה `preinit` מתוך `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[עוד דוגמאות נוספות.](#usage)

הפונקציה `preinit` מספקת לדפדפן רמז שכדאי להתחיל להוריד ולהריץ את המשאב הנתון, מה יכול לחסוך זמן. סקריפטים מבצעים להם `preinit` יורצו כשהורדתם תסתיים. גיליונות סגנונות שמבצעים להם מראש יוכנסו למסמך וייכנסו לפעול מיד.

#### פרמטרים {/*parameters*/}

* `href`: מחרוזת. ה-URL הורד של המשאב שברצונכם ולהריץ.
* `options`: אובייקט. כולל את המאפיינים הבאים:
  * `as`: מחרוזת חובה. סוג המשאב. הערכים האפשריים: `script` ו-`style`.
  * `precedence`: מחרוזת. חובה עבור גיליונות סגנונות. מציינת איפה להכניס את ה-stylesheet לחוות. גיליונות סגנונות עם קדימות גבוהות יותר יכולות לעקוף כאלה עם קדימות נמוכה יותר. הערכים האפשריים: `reset`, `low`, `medium`, `high`.
  * `crossOrigin`: מחרוזת. [מדיניות CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) שימוש. הערכים האפשריים: `anonymous` ו-`use-credentials`. חובה כשהערך של `as` הוא `"fetch"`.
  * `integrity`: מחרוזת. hash קריפטוגרפי של המשאב לצורך [תאימות אותנטיות]https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: מחרוזת. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) קריפטוגרפי שמאפשר את המשאב כשמשתמשים ב-Content Security Policy קשוחה.
  * `fetchPriority`: מחרוזת. מציעה עדיפות יחסית לטעינת המשאב. הערכים האפשריים: `auto` (ברירת מחדל), `high`, ו-`low`.

#### מחזירה {/*returns*/}

`preinit` לא מחזירה דבר.

#### אזהרות {/*caveats*/}

* כמה קריאות ל-`preinit` עם אותו `href` משפיעות כמו קריאה אחת.
* בדפדפן אפשר לקרוא ל-`preinit` בכל מצב: בזמן רינדור קומפונטה, בתוך אפקט, בתוך מטפל באירועים, וכן הלאה.
* ברינדור צד שרת או ברינדור רכיבי שרת, ל-`preinit` יש רק רק אם קוראים לה בזמן רינדור קומפוננטה או בהקשר אסינכרון שמקורו ברינדור קומפוננטה. קריאות אחרות ייחסמו.

---

## שימוש {/*usage*/}

### Preinit בזמן רינדור {/*preiniting-when-rendering*/}

קראו ל-`preinit` בזמן רינדור קומפוננטה אם אתם יודעים שהיא או הילדים שלהן ישתמשו במשאב ספציפי, ואם מקובל עליכם שהמשאב יוערך ויכנס לפעול מיד כשהורדתו מסתיימת.

<Recipes titleText="Examples of preiniting">

#### Preinit לסקריפט חיצוני {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

אם אתם רוצים שהדפדפן יוריד את הסקריפט אבל לא יריץ אותו מיד, השתמשו ב-[`preload`](/reference/react-dom/preload) במקום. אם רוצים לטעון מודול ESM, השתמשו ב-[`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Preinit ל-stylesheet {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

אפשרות `precedence`, שהיא חובה, יכולה לשלוט בסדר של גיליונות סגנונות בתוך המסמך. גיליונות סגנונות עם קדימות גבוהות יותר יכולות לעקוף כאלה עם קדימות נמוכה יותר.

אם אתם רוצים להוריד את ה-stylesheet אבל לא להכניס אותו למסמך מיד, השתמשו ב-[`preload`](/reference/react-dom/preload) במקום.

<Solution />

</Recipes>

### Preinit בתוך מטפל באירועים {/*preiniting-in-an-event-handler*/}

קראו ל-`preinit` בתוך מטפל באירועים לפני מעבר או מצב יידרשו משאבים חיצוניים. כך מתחילים להמשך קריאה בזמן רינדור העמוד או המצב החדש.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
