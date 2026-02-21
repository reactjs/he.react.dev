---
meta: "<meta>"
canary: true
---

<Canary>

ההרחבות של React ל-`<meta>` זמינות כרגע רק בערוצי canary ו-experimental של React. בגרסאות יציבות של React, `<meta>` פועל רק כ-[רכיב HTML מובנה של הדפדפן](https://react.dev/reference/react-dom/components#all-html-components). מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

רכיב הדפדפן המובהנה [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) אפשר להוסיף מטא נתונים למסמך.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<meta>` {/*meta*/}

כדי להוסיף מטא נתונים למסמך, רנדרו את רכיב הדפדפן המובנה [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). אפשר לרנדר `<meta>` מכל קומפוננטה ו-React תמיד תמקם את האלמנט ה-DOM המתאים בתוך ראש המסמך.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[עוד דוגמאות נוספות.](#usage)

#### אבזרים {/*props*/}

`<meta>` תומך בכל [מאפייני האלמנט הנפוצים.](/reference/react-dom/components/common#props)

הוא צריך לקבל *בדיוק אחד* מה-props הבאים: `name`, `httpEquiv`, `charset`, `itemProp`. רכיב `<meta>` פועל אחרת לפעול ל-prop שמצוין.

* `name`: מחרוזת. מציינת את [סוג ה-metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) שיצורף למסמך.
* `charset`: מחרוזת. מציינת קידוד התווים של המסמך את. הערך התקין היחיד הוא `"utf-8"`.
* `httpEquiv`: מחרוזת. הנחיית מציינת לעיבוד המסמך.
* `itemProp`: מחרוזת. מציינת מטא נתונים על פריט מסוים בתוך המסמך, ולא על המסמך הכללי.
* `content`: מחרוזת. מציינת את ה-metadata לצירוף כשמשתמשים ב-`name` או `itemProp`, או את התנהגות ה-directive כשמשתמשים ב-`httpEquiv`.

#### התנהגות רינדור מיוחדת __K_0__

React תמיד תמקם את האלמנט ה-DOM מתאים ל-`<meta>` בתוך `<head>` של המסמך, בלי קשר למקום שבו הוא מרונדר בעץ React. `<head>` הוא החוק היחיד ל-`<meta>` בתוך ה-DOM, ובכל זאת נוח ושומר על קומפוזיציות אם קומפונטה שמייצגת עמוד מסוים יכול לרנדר בעצמה רכיבי `<meta>`.

יש חריג אחד לכך: אם ל-`<meta>` יש פרופסור מסוג [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), אין התנהגות מיוחדת, כי במקרה הזה הוא לא מייצג מטא נתונים על המסמך אלא מטא נתונים על חלק מסוים של העמוד.

---

## שימוש {/*usage*/}

### הוספת מטא נתונים למסמך {/*annotating-the-document-with-metadata*/}

אפשר להוסיף למסמך metadata כמו מילות מפתח, תקציר או שם המחבר. React תמקם את ה-metadata הזו בתוך `<head>` של המסמך, בלי קשר למקום שבו הוא מרונדר בעץ React.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

אפשר לרנדר את הרכיב `<meta>` מכל קומפונטה. React תשים DOM צומת של `<meta>` בתוך `<head>` של המסמך.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### הוספת מטא נתונים לפרטים מיוחדים במסמך {/*annotating-specific-items-within-the-document-with-metadata*/}

אפשר להשתמש ברכיב `<meta>` עם מאפיין מסוג `itemProp` כדי להוסיף מטא נתונים לפרטים ספציפיים בתוך המסמך. במקרה כזה, React *לא* תמקם את ההערות האלה בתוך `<head>` של המסמך, אלא תמקם אותם כמו כל קומפונטת React אחרת.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
