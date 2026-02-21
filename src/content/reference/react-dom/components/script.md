---
script: "<script>"
canary: true
---

<Canary>

ההרחבות של React ל-`<script>` זמינות כרגע רק בערוצי canary ו-experimental של React. בגרסאות יציבות של React, `<script>` פועל רק כ-[רכיב HTML מובנה של הדפדפן](https://react.dev/reference/react-dom/components#all-html-components). מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

רכיב הדפדפן המובהנה [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) אפשר להוסיף סקריפט למסמך.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<script>` {/*script*/}

כדי להוסיף סקריפטים inline או חיצוניים למסמך, רנדרו את רכיב הדפדפן המובנה [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). אפשר לרנדר `<script>` מכל קומפוננטה, ו-React [במקרים רצונות כפי](#special-rendering-behavior) תמקם את אלמנט ה-__TK_4 head בסקר-4 זהים.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[עוד דוגמאות נוספות.](#usage)

#### אבזרים {/*props*/}

`<script>` תומך בכל [מאפייני האלמנט הנפוצים.](/reference/react-dom/components/common#props)

הוא צריך לכלול *או* `children` *או* אביזר בשם `src`.

* `children`: מחרוזת. קוד המקור של סקריפט מוטבע.
* `src`: מחרוזת. ה-URL של סקריפט חיצוני.

אביזרים נתמכים נוספים:

* `async`: ערך בוליאני. לאפשר לדפדפן לדחות את הר הסקרפט עד ששאר המסמך עובד — זו ההתנהגות המועדפת לביצועים.
* `crossOrigin`: מחרוזת. [מדיניות CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) שימוש. הערכים האפשריים: `anonymous` ו-`use-credentials`.
* `fetchPriority`: מחרוזת. אפשר לדפדפן לדרג עדיפות לסקריפטים בזמן טעינה של כמה סקריפטים יחד. יכול להיות `"high"`, `"low"`, או `"auto"` (ברירת מחדל).
* `integrity`: מחרוזת. hash קריפטוגרפיה של הסקריפט לצורך [התאמה אותנטיות](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: ערך בוליאני. מבטל את הסקריפט בדפדפנים שתומכים ב-ES modules — ומאפשר סקריפט חלופי לדפדפנים שלא.
* `nonce`: מחרוזת. [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) קריפטוגרפי שמאפשר את המשאב כשמשתמשים ב-Content Security Policy קשוחה.
* `referrer`: מחרוזת. מציינת [איזו כותרת מפנה הודעה](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) בעת טעינת הסקריפט וכל משאב שהסקריפט טוען לאחר מכן.
* `type`: מחרוזת. מציינת אם הסקריפט הוא [סקריפט קלאסי, מודול ES, או מפת ייבוא](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Props שמבטלים את [הטיפול היחיד של React בסקריפטים](#special-rendering-behavior):

* `onError`: פונקציה. נקראת כשהקריפט נכשל בטעינה.
* `onLoad`: פונקציה. נקראת כשהקריפט מסתיים להיטען.

אבזרים ש-**לא מומלץ** להשתמש בהם עם React:

* `blocking`: מחרוזת. אם מוגדר ל-`"render"`, מורה לדפדפן לא לרנדר את העמוד עד שה-scriptsheet נטען. React מספקת שליטה מדויקת יותר דרך Suspense.
* `defer`: מחרוזת. מניע מהדפדפן להריץ את הסקריפט עד שמסמך סיים להיטען. לא תואם לסטרימינג של קומפונטות מרונדרות שרת. השתמשו ב-prop `async` במקום.

#### התנהגות רינדור מיוחדת __K_0__

React יכולה להזיז רכיבי `<script>` ל-`<head>` של המסמך, מניעת כפילות של סקריפטים זהים, ולבצע [suspend](/reference/react/Suspense) בזמן שהקריפט נטען.

כדי להפעיל את ההתנהגות הזו, ספקו את ה-props `src` ו-`async={true}`. React תמנע כפילות של סקריפטים אם יש להם אותו `src`. ‏`async` חייב להיות אמיתי כדי שיהיה בטוח להזיז סקריפטים.

אם מספקים אחד מה-props `onLoad` או `onError`, אין התנהגות מיוחדת, כי props אלה מציינים שאתם מנהלים ידנית את טעינת הסקריפט בתוך הקומפוננטה.

לטיפול המיוחד הזה יש שתי הסתייגויות:

* React תתעלם משינויים ב-props אחרי שהקריפט רונדר. (React תציג אזהרה בזמן פיתוח אם זה קורה.)
* React עשויה להשאיר את הסקריפט ב-DOM גם אחרי שהקומפונטה שרנדרה אותו הוסרה. (אין מורחים לזה כי סקריפטים רק פעם אחת כשהם מוכנסים ל-DOM.)

---

## שימוש {/*usage*/}

### רינדור סקריפט חיצוני {/*rendering-an-external-script*/}

אם קומפוננטה תלויה בקריפטים צריך להיות מוצגת נכון, אפשר לרנדר `<script>` בתוך הקומפוננטה.

אם תספקו props של `src` ו-`async`, הקומפוננטה שלכם תבצע suspend בזמן שהקריפט נטען. React תמנע כפילות של סקריפטים עם אותו `src`, ותכניס רק אחד מהם ל-DOM גם אם כמה קומפוננטות מרנדרות אותו.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
כאשר הם רוצים להשתמש בסקריפט, יכול להיות מועיל לקרוא לפונקציה [preinit](/reference/react-dom/preinit). קריאה לפעולה הזו עשויה לאפשרפדפן להתחיל להביא את הסקריפט יותר מאשר ברינדור רגיל של `<script>`, למשל לד באמצעות [HTTP תגובת רמזים מוקדמים](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

### רינדור סקריפט מוטבע {/*rendering-an-inline-script*/}

כדי לכלול סקריפט בשורה, רנדרו את הרכיב `<script>` עם קוד המקור של הסקריפט כ-children שלו. סקריפים מוטבעים עוברים דה-כפילות ואינם מועברים ל-`<head>` של המסמך, וכיוון שהם לא טוענים משאבים חיצוניים הם לא יגרמו לקומפוננטה לבצע suspend.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
