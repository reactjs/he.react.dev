---
title: "טעינה מראש"
canary: true
---

<Canary>

הפונקציה `preload` זמינה כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Frameworks מבוססי React](/learn/start-a-new-react-project) מטפלים יכולים לעתים קרובות בטעינת משאבים בשבילכם, אז ייתכן שלא תצטרכו לקרוא ל-API הזה בעצמכם. לפרטים, עיינו בתיעוד של ה-framework שלכם.

</Note>

<Intro>

`preload` מותר להביא מראש משאב כמו גיליון סגנונות, גופן, או סקריפט חיצוני עם מצפים להשתמש בו.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `preload(href, options)` {/*preload*/}

כדי לבצע טעינה מראש למשאב, קראו לפונקציה `preload` מתוך `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[עוד דוגמאות נוספות.](#usage)

הפונקציה `preload` מספקת לדפדפן רמז שכדאי להתחיל להוריד את המשאב הנתון, מה יכול לחסוך זמן.

#### פרמטרים {/*parameters*/}

* `href`: מחרוזת. ה-URL של המשאב שברצונכם הורד.
* `options`: אובייקט. כולל את המאפיינים הבאים:
  * `as`: מחרוזת חובה. סוג המשאב. [הערכים האפשריים](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as): `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, __TK_12, `track`, `track`.
  * `crossOrigin`: מחרוזת. [מדיניות CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) שימוש. הערכים האפשריים: `anonymous` ו-`use-credentials`. חובה כשהערך של `as` הוא `"fetch"`.
  * `referrerPolicy`: מחרוזת. [כותרת מפנה](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) שתישלח בזמן הטעינה. הערכים האפשריים: `no-referrer-when-downgrade` (ברירת מחדל), `no-referrer`, `origin`, `origin-when-cross-origin`, ו-`unsafe-url`.
  * `integrity`: מחרוזת. hash קריפטוגרפיה של המשאב לצורך [תאימות אותנטיות]https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * `type`: מחרוזת. סוג ה-MIME של המשאב.
  * `nonce`: מחרוזת. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) קריפטוגרפי שמאפשר את המשאב כשמשתמשים ב-Content Security Policy קשוחה.
  * `fetchPriority`: מחרוזת. מציעה עדיפות יחסית לטעינת המשאב. הערכים האפשריים: `auto` (ברירת מחדל), `high`, ו-`low`.
  * `imageSrcSet`: מחרוזת. שימוש רק עם `as: "image"`. מציינת את [ערכת מקור של התמונה](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  * `imageSizes`: מחרוזת. שימוש רק עם `as: "image"`. מציינת את [הגדלים של התמונה](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### מחזירה {/*returns*/}

`preload` לא מחזירה דבר.

#### אזהרות {/*caveats*/}

* כמה קריאות שקולות ל-`preload` משפיעות כמו קריאה אחת. קריאות ל-`preload` נחשבות שקולות לפי הכללים האלה:
  * שתי קריאות שקולות אם יש להן אותו `href`, חוץ מהמקרה הבא:
  * אם `as` מוגדר כ-`image`, שתי קריאות שקולות אם יש להן אותו `href`, `imageSrcSet`, ו-`imageSizes`.
* בדפדפן אפשר לקרוא ל-`preload` בכל מצב: בזמן רינדור קומפונטה, בתוך אפקט, בתוך מטפל באירועים, וכן הלאה.
* ברינדור צד שרת או ברינדור רכיבי שרת, ל-`preload` יש רק רק אם קוראים לה בזמן רינדור קומפוננטה או בהקשר אסינכרון שמקורו ברינדור קומפוננטה. קריאות אחרות ייחסמו.

---

## שימוש {/*usage*/}

### טעינה מראש בזמן רינדור {/*preloading-when-rendering*/}

קראו ל-`preload` בזמן רינדור קומפוננטה אם אתם יודעים שהיא או הילדים שלה ישתמשו במשאב ספציפי.

<Recipes titleText="Examples of preloading">

#### טעינה מראש לסקריפט חיצונית {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

אם אתם רוצים שהדפדפן יתחיל להריץ את הסקריפט מיד (ולא רק להוריד אותו), השתמשו ב-[`preinit`](/reference/react-dom/preinit) במקום. אם רוצים לטעון מודול ESM, השתמשו ב-[`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### טעינה מראש לגיליון סגנונות {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

אם אתם רוצים שה-stylesheet יוכנס למסמך מיד (כלומר שהדפדפן יתחיל לפרש אותו מייד ולא רק להוריד אותו), השתמשו ב-[`preinit`](/reference/react-dom/preinit) במקום.

<Solution />

#### טעינה מראש לפונט {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

אם אתם מבצעים טען מראש ל-stylesheet, חכם לבצע טען מראש גם לפונטים שה-stylesheet מפנה אליהם. כך הדפדפן להתחיל להוריד את הפונט עוד לפני שה-stylesheet יורד ומפורש.

<Solution />

#### טעינה מראש לתמונה {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

כשמבצעים לטעון מראש לתמונה, האפשרויות `imageSrcSet` ו-`imageSizes` עוזרות לדפדפן [להביא את התמונה בגודל הנכון לגודל המסך](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### טוען מראש בתוך מטפל באירועים {/*preloading-in-an-event-handler*/}

קראו ל-`preload` בתוך מטפל באירועים לפני מעבר או מצב יידרשו משאבים חיצוניים. כך מתחילים להמשך קריאה בזמן רינדור העמוד או המצב החדש.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
