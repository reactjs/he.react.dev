---
link: "<link>"
canary: true
---

<Canary>

ההרחבות של React ל-`<link>` זמינות כרגע רק בערוצים הקנריים והניסיוניים של React. במהדורות יציבות של React `<link>` פועל רק כ[רכיב דפדפן HTML מובנה](https://react.dev/reference/react-dom/components#all-html-components). למידע נוסף על ערוצי ההפצה של [React כאן](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[רכיב הדפדפן המובנה `<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) מאפשר לך use משאבים חיצוניים כגון גיליונות סגנונות או להוסיף הערות למסמך במטא נתונים של קישורים.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<link>` {/*link*/}

כדי לקשר למשאבים חיצוניים כגון גיליונות סגנונות, גופנים ואייקונים, או כדי להוסיף הערות למסמך במטא נתונים של קישורים, רנדר את [רכיב הדפדפן המובנה `<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). ניתן לעבד `<link>` מכל רכיב וReact יבצע [ברוב המקרים]-__מתאים את האלמנט __TK ב-4. ראש מסמך.

```js
<link rel="icon" href="favicon.ico" />
```

[ראה דוגמאות נוספות למטה.](#usage)

#### אבזרים {/*props*/}

`<link>` תומך בכל [הרכיב המשותף props.](/reference/react-dom/components/common#props)

* `rel`: מחרוזת, חובה. מציין את [הקשר למשאב](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [מטפל בקישורים עם `rel="stylesheet"` באופן שונה](#special-rendering-behavior) מקישורים אחרים.

props אלה חלים כאשר `rel="stylesheet"`:

* `precedence`: מחרוזת. אומר React היכן לדרג את הצומת `<link>` DOM ביחס לאחרים במסמך `<head>`, שקובע איזה גיליון סגנונות יכול לעקוף את השני. הערך שלו יכול להיות (לפי סדר העדיפות) `"reset"`, `"low"`, `"medium"`, `"high"`. גיליונות סגנונות עם אותה קדימות הולכים יחד בין אם הם תגי `<link>` או מוטבעים `<style>` או נטענים באמצעות הפונקציות [`preload`](/reference/react-dom/preload) או [`preinit`](/reference/react-dom/preinit).
* `media`: מחרוזת. מגביל את הגיליון האלקטרוני ל[שאילתת מדיה] מסוימת (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `title`: מחרוזת. מציין את השם של [גיליון סגנונות חלופי](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

props אלו חלים כאשר `rel="stylesheet"` אך משביתים את [הטיפול המיוחד של גיליונות הסגנונות] של React(#special-rendering-behavior):

* `disabled`: בוליאני. משבית את הגיליון האלקטרוני.
* `onError`: פונקציה. נקרא כאשר גיליון הסגנונות לא מצליח להיטען.
* `onLoad`: פונקציה. נקרא כאשר גיליון הסגנונות מסיים להיטען.

props אלה חלים כאשר `rel="preload"` או `rel="modulepreload"`:

* `as`: מחרוזת. סוג המשאב. הערכים האפשריים שלו הם `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `video`, `video`.
* `imageSrcSet`: מחרוזת. תקף רק כאשר `as="image"`. מציין את [קבוצת המקור של התמונה](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: מחרוזת. תקף רק כאשר `as="image"`. מציין את [גדלים של התמונה](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

props אלה חלים כאשר `rel="icon"` או `rel="apple-touch-icon"`:

* `sizes`: מחרוזת. ה[גדלים של הסמל](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

props אלה חלים בכל המקרים:

* `href`: מחרוזת. כתובת האתר של המשאב המקושר.
* `crossOrigin`: מחרוזת. [מדיניות CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) עד use. הערכים האפשריים שלה הם `anonymous` ו-`use-credentials`. היא נדרשת כאשר `as` מוגדר ל-`"fetch"`.
* `referrerPolicy`: מחרוזת. [הכותרת המפנה](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) לשליחה בעת השליפה. הערכים האפשריים שלה הם `no-referrer-when-downgrade` (ברירת המחדל), `no-referrer`, `origin`, `origin-when-cross-origin` ו-`unsafe-url`.
* `fetchPriority`: מחרוזת. מציע עדיפות יחסית להבאת המשאב. הערכים האפשריים הם `auto` (ברירת המחדל), `high` ו-`low`.
* `hrefLang`: מחרוזת. השפה של המשאב המקושר.
* `integrity`: מחרוזת. גיבוב קריפטוגרפי של המשאב, כדי [לאמת את האותנטיות שלו](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: מחרוזת. סוג MIME של המשאב המקושר.

אביזרים **לא מומלצים** עבור use עם React:

* `blocking`: מחרוזת. אם מוגדר ל-`"render"`, מורה לדפדפן לא לעבד את הדף עד שגיליון הסגנונות ייטען. React מספק שליטה עדינה יותר באמצעות Suspense.

#### התנהגות עיבוד מיוחדת {/*special-rendering-behavior*/}

React תמיד ימקם את האלמנט DOM המתאים לרכיב `<link>` בתוך `<head>` של המסמך, ללא קשר לאיפה בעץ React הוא מוצג. ה-`<head>` הוא המקום התקף היחיד ל-`<link>` להתקיים בתוך ה-DOM, ובכל זאת הוא נוח ושומר על חיבור דברים אם רכיב המייצג עמוד ספציפי יכול להציג רכיבי `<link>` בעצמו.

יש כמה חריגים לכך:

* אם ל-`<link>` יש אבזר `rel="stylesheet"`, אז צריך להיות לו גם אבזר `precedence` כדי לקבל את ההתנהגות המיוחדת הזו. זה בגלל שuse סדר גיליונות הסגנונות בתוך המסמך הוא משמעותי, ולכן React צריך לדעת איך להזמין את גיליון הסגנונות הזה ביחס לאחרים, שאותם אתה מציין באמצעות הפרופט `precedence`. אם התמיכה `precedence` מושמטת, אין התנהגות מיוחדת.
* אם ל-`<link>` יש [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) מאפיין, אין התנהגות מיוחדת, כי use במקרה זה היא לא חלה על המסמך אלא מייצגת מטא נתונים לגבי חלק מסוים של הדף.
* אם ל-`<link>` יש אבזר `onLoad` או `onError`, אזיuse במקרה כזה אתה מנהל את הטעינה של המשאב המקושר באופן ידני בתוך רכיב React שלך.

#### התנהגות מיוחדת עבור גיליונות סגנונות {/*special-behavior-for-stylesheets*/}

בנוסף, אם ה-`<link>` הוא לגיליון סגנונות (כלומר, יש לו `rel="stylesheet"` ב-props שלו), React מתייחס אליו במיוחד בדרכים הבאות:

* הרכיב שמעבד את `<link>` [הושעה](http://localhost:3000/reference/react/Suspense) בזמן שגיליון הסגנונות נטען.
* אם מספר רכיבים מעבדים קישורים לאותו גיליון סגנונות, React יבטל את הכפילות שלהם ויכניס רק קישור בודד ל-DOM. שני קישורים נחשבים זהים אם יש להם אותו אבזר `href`.

ישנם שני חריגים להתנהגות המיוחדת הזו:

* אם לקישור אין אבזר `precedence`, אין התנהגות מיוחדת, מכיוון שuse סדר גיליונות הסגנונות בתוך המסמך הוא משמעותי, אז React צריך לדעת איך להזמין את גיליון הסגנונות הזה ביחס לאחרים, אותו אתה מציין באמצעות הפריט `precedence`.
* אם אתה מספק אחד מה-`onLoad`, `onError` או `disabled` props, אין התנהגות מיוחדת, מכיוון שuse props אלו מציינים שאתה מנהל את הטעינה של גיליון הסגנונות באופן ידני בתוך הרכיב שלך.

טיפול מיוחד זה מגיע עם שתי אזהרות:

* React יתעלם משינויים ב-props לאחר עיבוד הקישור. (React יוציא אזהרה בפיתוח אם זה יקרה.)
* React עשוי להשאיר את הקישור ב-DOM גם לאחר ביטול ההרכבה של הרכיב שעשה אותו.

---

## שימוש {/*usage*/}

### קישור למשאבים קשורים {/*linking-to-related-resources*/}

אתה יכול להוסיף הערות למסמך עם קישורים למשאבים קשורים כגון סמל, כתובת אתר קנונית או pingback. React ימקם את המטא-נתונים האלה בתוך המסמך `<head>` ללא קשר לאיפה בעץ React הוא מוצג.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### קישור לגיליון סגנונות {/*linking-to-a-stylesheet*/}

אם רכיב תלוי בגיליון סגנונות מסוים על מנת להופיע כהלכה, אתה יכול לעבד קישור לגיליון סגנונות זה בתוך הרכיב. הרכיב שלך [יושעה](http://localhost:3000/reference/react/Suspense) בזמן שגיליון הסגנונות נטען. עליך לספק את הפרוטוקול `precedence`, שאומר ל-React היכן למקם את גיליון הסגנונות הזה ביחס לאחרים - גיליונות סגנונות בעלי עדיפות גבוהה יותר יכולים לעקוף את אלו עם עדיפות נמוכה יותר.

<Note>
כאשר אתה רוצה use גיליון סגנונות, זה יכול להיות מועיל לקרוא לפונקציה [preinit](/reference/react-dom/preinit). קריאה לפונקציה זו עשויה לאפשר לדפדפן להתחיל לאחזר את גיליון הסגנונות מוקדם יותר מאשר אם אתה רק מעבד רכיב `<link>`, למשל על ידי שליחת [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### שליטה בעדיפות גיליון סגנונות {/*controlling-stylesheet-precedence*/}

גיליונות סגנונות יכולים להתנגש זה עם זה, וכשהם עושים זאת, הדפדפן הולך עם זה שמגיע מאוחר יותר במסמך. React מאפשר לך לשלוט על סדר גיליונות הסגנונות עם הפרוטוקול `precedence`. בדוגמה זו, שני רכיבים מעבדים גיליונות סגנונות, וזה עם העדיפות הגבוהה יותר הולך מאוחר יותר במסמך למרות שהרכיב שמעבד אותו מגיע מוקדם יותר.

{/*FIXME: this doesn't appear to actually work -- I guess precedence isn't implemented yet?*/}

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### עיבוד גיליון סגנונות משוכפל {/*deduplicated-stylesheet-rendering*/}

אם תעבד את אותו גיליון סגנונות ממספר רכיבים, React ימקם רק `<link>` בודד בראש המסמך.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### הערת פריטים ספציפיים בתוך המסמך באמצעות קישורים {/*annotating-specific-items-within-the-document-with-links*/}

אתה יכול use את הרכיב `<link>` עם מאפיין `itemProp` כדי להוסיף הערות לפריטים ספציפיים בתוך המסמך עם קישורים למשאבים קשורים. במקרה זה, React *לא* ימקם את ההערות הללו בתוך המסמך `<head>` אלא ימקם אותן כמו כל רכיב React אחר.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
