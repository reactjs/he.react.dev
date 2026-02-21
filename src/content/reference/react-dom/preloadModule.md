---
title: "preloadModule"
canary: true
---

<Canary>

הפונקציה `preloadModule` זמינה כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Frameworks מבוססי React](/learn/start-a-new-react-project) מטפלים יכולים לעתים קרובות בטעינת משאבים בשבילכם, אז ייתכן שלא תצטרכו לקרוא ל-API הזה בעצמכם. לפרטים, עיינו בתיעוד של ה-framework שלכם.

</Note>

<Intro>

`preloadModule` מאפשרת להביא מראש מודול ESM כאשר מצפים להשתמש בו.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

כדי לבצע טעינה מוקדמת של למודול ESM, קראו לפעולה `preloadModule` מתוך `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[עוד דוגמאות נוספות.](#usage)

הפונקציה `preloadModule` מספקת לדפדפן רמז שכדאי להתחיל להוריד את המודול הנתון, מה יכול לחסוך זמן.

#### פרמטרים {/*parameters*/}

* `href`: מחרוזת. ה-URL של המודול שברצונכם הורד.
* `options`: אובייקט. כולל את המאפיינים הבאים:
  * `as`: מחרוזת חובה. חייב להיות `'script'`.
  * `crossOrigin`: מחרוזת. [מדיניות CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) שימוש. הערכים האפשריים: `anonymous` ו-`use-credentials`.
  * `integrity`: מחרוזת. hash קריפטוגרפיה של המודול לצורך [תאימות אותנטיות]https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: מחרוזת. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) קריפטוגרפי שמאפשר את המודול כשמשתמשים ב-Content Security Policy קשוחה.


#### מחזירה {/*returns*/}

`preloadModule` לא מחזירה דבר.

#### אזהרות {/*caveats*/}

* כמה קריאות ל-`preloadModule` עם אותו `href` משפיעות כמו קריאה אחת.
* בדפדפן אפשר לקרוא ל-`preloadModule` בכל מצב: בזמן רינדור קומפונטה, בתוך אפקט, בתוך מטפל באירועים, וכן הלאה.
* ברינדור צד שרת או ברינדור רכיבי שרת, ל-`preloadModule` יש רק רק אם קוראים לה בזמן רינדור קומפוננטה או בהקשר אסינכרון שמקורו ברינדור קומפוננטה. קריאות אחרות ייחסמו.

---

## שימוש {/*usage*/}

### טעינה מראש בזמן רינדור {/*preloading-when-rendering*/}

קראו ל-`preloadModule` בזמן רינדור קומפוננטה אם אתם יודעים שהיא או הילדים שלה ישתמשו במודול ספציפי.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

אם אתם רוצים שהדפדפן יתחיל גם להריץ את המודול מיד (ולא רק להוריד אותו), השתמשו ב-[`preinitModule`](/reference/react-dom/preinitModule) במקום. אם אתם רוצים לטעון סקריפט שאינו מודול ESM, השתמשו ב-[`preload`](/reference/react-dom/preload).

### טוען מראש בתוך מטפל באירועים {/*preloading-in-an-event-handler*/}

קראו ל-`preloadModule` בתוך מטפל באירועים לפני מעבר וכנס או מצב המודול יידרש. כך מתחילים להמשך קריאה בזמן רינדור העמוד או המצב החדש.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
