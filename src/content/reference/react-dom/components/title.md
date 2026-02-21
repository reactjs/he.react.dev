---
title: "<כותרת>"
canary: true
---

<Canary>

ההרחבות של React ל-`<title>` זמינות כרגע רק בערוצי canary ו-experimental של React. בגרסאות יציבות של React, `<title>` פועל רק כ-[רכיב HTML מובנה של הדפדפן](https://react.dev/reference/react-dom/components#all-html-components). מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

רכיב הדפדפן המובהנה [`<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) מאפשר את כותרת המסמך.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<title>` {/*title*/}

כדי לקבוע את הכותרת המסמך, רנדרו את רכיב הדפדפן המובנה [`<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). אפשר לרנדר `<title>` מכל קומפוננטה ו-React תמיד תמקם את האלמנט ה-DOM המתאים בתוך ראש המסמך.

```js
<title>My Blog</title>
```

[עוד דוגמאות נוספות.](#usage)

#### אבזרים {/*props*/}

`<title>` תומך בכל [מאפייני האלמנט הנפוצים.](/reference/react-dom/components/common#props)

* `children`: רכיב `<title>` מקבל רק טקסט כ-ילד. הטקסט יהפוך לכותרת המסמך הזה. אפשר גם להעביר קומפונטות משלכם כל עוד הן מרנדרות רק טקסט.

#### התנהגות רינדור מיוחדת __K_0__

React תמיד תמקם את האלמנט ה-DOM מתאים ל-`<title>` בתוך `<head>` של המסמך, בלי קשר למקום שבו הוא מרונדר בעץ React. `<head>` הוא החוק היחיד ל-`<title>` בתוך ה-DOM, ובכל זאת נוח ושומר על קומפוזיציות אם קומפונטה שמציגה עמוד מסויים יכולה לרנדר בעצמה את `<title>` שלה.

יש שני חריגים לכך:
* אם `<title>` נמצא בתוך רכיב `<svg>`, אין התנהגות מיוחדת, כי בהקשר הזה הוא לא מייצג את כותרת המסמך אלא [הערת נגישות לגרפיקת ה-SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* אם ל-`<title>` יש פרופס סטייל [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), אין התנהגות מיוחדת, כי במקרה הזה הוא לא מייצג את הכותרת המסמך אלא מטא נתונים על חלק מסוים בעמוד.

<Pitfall>

רנדרו רק `<title>` יחיד בכל רגע. אם יותר מקומפוננטה אחת מרנדרת תגית `<title>` באותו זמן, React תמקם את כל הכותרות האלה בתוך הראש של המסמך. במצב כזה ההתנהגות של דפדפנים ומנועי חיפוש מוגדרת.

</Pitfall>

---

## שימוש {/*usage*/}

### הגדרת כותרת המסמך {/*set-the-document-title*/}

רנדרו את רכיב `<title>` מכל קומפוננטה עם טקסט כ-ילדים שלו. React תשים DOM צומת של `<title>` בתוך `<head>` של המסמך.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### שימוש במשתנים בתוך הכותרת {/*use-variables-in-the-title*/}

ה-children של רכיב `<title>` חייבים להיות מחרוזת טקסט יחידה. (או מספר יחיד, או אובייקט יחיד עם מתודת `toString`.) זה יכול להיות לא ברור, אבל שימוש בסוגריים מסולסלים של JSX כך:

```js
<title>Results page {pageNumber}</title> // 🔴 Problem: This is not a single string
```

... בעצם גורם לרכיב `<title>` לקבל מערך של שני אלמנטים כ-children (המחרוזת `"Results page"` והערך של `pageNumber`). זה יגרום לשגיאה. במקום זאת, השתמשו ב-string interpolation כדי להעביר ל-`<title>` מחרוזת יחידה:

```js
<title>{`Results page ${pageNumber}`}</title>
```
