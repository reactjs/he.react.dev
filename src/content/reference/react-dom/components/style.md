---
style: "<style>"
canary: true
---

<Canary>

ההרחבות של React ל-`<style>` זמינות כרגע רק בערוצי canary ו-experimental של React. בגרסאות יציבות של React, `<style>` פועל רק כ-[רכיב HTML מובנה של הדפדפן](https://react.dev/reference/react-dom/components#all-html-components). מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

רכיב הדפדפן המובנה [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) אפשר להוסיף גיליונות סגנונות של CSS מוטבעים למסמך.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<style>` {/*style*/}

כדי להוסיף סגנונות מוטבעים למסמך, רנדרו את רכיב הדפדפן המובנה [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). אפשר לרנדר `<style>` מכל קומפוננטה ו-React [במקרים אישור](#special-rendering-behavior) תמקם את הרכיבים המתאימים למסמך ה-DOM המתאים בתוך זה.

```js
<style>{` p { color: red; } `}</style>
```

[עוד דוגמאות נוספות.](#usage)

#### אבזרים {/*props*/}

`<style>` תומך בכל [מאפייני האלמנט הנפוצים.](/reference/react-dom/components/common#props)

* `children`: מחרוזת, חובה. תוכן גיליון הסגנונות.
* `precedence`: מחרוזת. אומרת ל-React איך לדרג את `<style>` DOM node איזה מתנגד בתוך `<head>` של המסמך, מה שקובע סגנונות יכול לעקוף איזה. הערכים האפשריים (לפי סדר קדימות): `"reset"`, `"low"`, `"medium"`, `"high"`. סגנונות עם קדימות מקובצים יחד בין אם הם תגיות `<link>`, תגיות inline `<style>`, או כאלה שנטענו בעזרת [`preload`](/reference/react-dom/preload) או [`preinit`](/reference/react-dom/preinit).
* `href`: מחרוזת. מאפשרת ל-React [למנוע כפילות של סגנונות](#special-rendering-behavior) שיש להם אותו `href`.
* `media`: מחרוזת. מגבילה את ה-spreadsheet ל-[שאילתת מדיה](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) מסוימות.
* `nonce`: מחרוזת. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) קריפטוגרפי שמאפשר את המשאב כשמשתמשים ב-Content Security Policy קשוחה.
* `title`: מחרוזת. מציינת שם של [גיליון סגנונות חלופי](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

אבזרים ש-**לא מומלץ** להשתמש בהם עם React:

* `blocking`: מחרוזת. אם מוגדר ל-`"render"`, מורה לדפדפן לא לרנדר את העמוד עד שה-stylesheet נטען. React מספקת שליטה מדויקת יותר דרך Suspense.

#### התנהגות רינדור מיוחדת __K_0__

React יכולה להזיז רכיבי `<style>` ל-`<head>` של המסמכים, מניעת כפילות של stylesheets זהים, ולבצע [suspend](http://localhost:3000/reference/react/Suspense) בזמן שה-stylesheet נטען.

כדי להפעיל את ההתנהגות הזו, ספקו את ה-props `href` ו-`precedence`. React תמנע כפילות של סגנונות אם יש להם אותו `href`. ה-prop `precedence` אומר ל-React איך לדרג את `<style>` DOM node ביחס בתוך `<head>` של המסמך, מה שקובע איזה גיליון סגנונות יכול לעקוף איזה.

לטיפול המיוחד הזה יש שתי הסתייגויות:

* React תתעלם משינויים ב-props אחרי שה-style רונדר. (React תציג אזהרה בזמן פיתוח אם זה קורה.)
* React עשויה להשאיר את הסגנון ב-DOM גם אחרי שהקומפונטה שרנדרה אותו הוסרה.

---

## שימוש {/*usage*/}

### גיליון סגנונות רינדור של CSS מוטבע {/*rendering-an-inline-css-stylesheet*/}

אם קומפוננטה תלויה בסגנונות CSS כדי להיות מוצגת נכון, אפשר גיליון סגנונות לרנדר בתוך הקומפוננטה.

אם מספקים `href` ו-`precedence`, הקומפוננטה תבצע suspend בזמן שה-stylesheet נטען. (גם עם גיליונות סגנונות מוטבעים, אפשר זמן טעינה בגלל פונטים ותמונות שה-stylesheet מפנה.) ה-`href` צריך לזהות בצורה ייחודית את גיליון הסגנונות, כי React תמנע כפילות של גיליונות סגנונות עם אותו `href`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
