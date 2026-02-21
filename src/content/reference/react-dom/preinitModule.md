---
title: "preinitModule"
canary: true
---

<Canary>

הפונקציה `preinitModule` זמינה כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Frameworks מבוססי React](/learn/start-a-new-react-project) מטפלים יכולים לעתים קרובות בטעינת משאבים בשבילכם, אז ייתכן שלא תצטרכו לקרוא ל-API הזה בעצמכם. לפרטים, עיינו בתיעוד של ה-framework שלכם.

</Note>

<Intro>

`preinitModule` יכול להביא מראש מודול ESM ולהעריך אותו.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

כדי לבצע מראש למודול ESM, קראו לפעולה `preinitModule` מתוך `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[עוד דוגמאות נוספות.](#usage)

הפונקציה `preinitModule` מספקת לדפדפן רמז שכדאי להתחיל להוריד ולהריץ את המודול הנתון, מה יכול לחסוך זמן. מודולים מבצעים להם `preinit` יורצו כשיסיימו לרדת.

#### פרמטרים {/*parameters*/}

* `href`: מחרוזת. ה-URL הורד את המודול שברצונכם ולהריץ.
* `options`: אובייקט. כולל את המאפיינים הבאים:
  * `as`: מחרוזת חובה. חייב להיות `'script'`.
  * `crossOrigin`: מחרוזת. [מדיניות CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) שימוש. הערכים האפשריים: `anonymous` ו-`use-credentials`.
  * `integrity`: מחרוזת. hash קריפטוגרפיה של המודול לצורך [תאימות אותנטיות]https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `nonce`: מחרוזת. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) קריפטוגרפי שמאפשר את המודול כשמשתמשים ב-Content Security Policy קשוחה.

#### מחזירה {/*returns*/}

`preinitModule` לא מחזירה דבר.

#### אזהרות {/*caveats*/}

* כמה קריאות ל-`preinitModule` עם אותו `href` משפיעות כמו קריאה אחת.
* בדפדפן אפשר לקרוא ל-`preinitModule` בכל מצב: בזמן רינדור קומפונטה, בתוך אפקט, בתוך מטפל באירועים, וכן הלאה.
* ברינדור צד שרת או ברינדור רכיבי שרת, ל-`preinitModule` יש רק רק אם קוראים לה בזמן רינדור קומפוננטה או בהקשר אסינכרון שמקורו ברינדור קומפוננטה. קריאות אחרות ייחסמו.

---

## שימוש {/*usage*/}

### טעינה מראש בזמן רינדור {/*preloading-when-rendering*/}

קראו ל-`preinitModule` בזמן רינדור קומפוננטה אם אתם יודעים שהיא או הילדים שלה ישתמשו במודול ספציפי, ואם מקובל עליכם שהמודול יוערך וייכנס לפעול מיד כשהורדתו מסתיימת.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

אם אתם רוצים שהדפדפן יוריד את המודול אבל לא יריץ אותו מייד, השתמשו ב-[`preloadModule`](/reference/react-dom/preloadModule) במקום. אם אתם רוצים לבצע preinit לקריפט שאינו מודול ESM, השתמשו ב-[`preinit`](/reference/react-dom/preinit).

### טוען מראש בתוך מטפל באירועים {/*preloading-in-an-event-handler*/}

קראו ל-`preinitModule` בתוך מטפל באירועים לפני מעבר וכנס או מצב המודול יידרש. כך מתחילים להמשך קריאה בזמן רינדור העמוד או המצב החדש.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
