---
title: "יְלָדִים"
---

<Pitfall>

השימוש ב-`Children` אינו שכיח ועלול להוביל לקוד שביר. [ראה חלופות נפוצות.](#alternatives)

</Pitfall>

<Intro>

`Children` מאפשר לך לתמרן ולשנות את ה-JSX שקיבלת בתור [`children` אבזר.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `Children.count(children)` {/*children-count*/}

התקשר ל-`Children.count(children)` כדי לספור את מספר הילדים במבנה הנתונים `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[ראה דוגמאות נוספות למטה.](#counting-children)

#### פרמטרים {/*children-count-parameters*/}

* `children`: הערך של [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) שהתקבל על ידי הרכיב שלך.

#### מחזירה {/*children-count-returns*/}

מספר הצמתים בתוך `children` אלה.

#### אזהרות {/*children-count-caveats*/}

- צמתים ריקים (`null`, `undefined` ובוליאנים), מחרוזות, מספרים ו-[React אלמנטים](/reference/react/createElement) נחשבים כצמתים בודדים. מערכים לא נחשבים כצמתים בודדים, אבל הילדים שלהם כן. **המעבר אינו מעמיק יותר מאלמנטים של React:** הם לא עוברים רינדור, ולא עוברים על הילדים שלהם. [Fragments](/reference/react/Fragment) לא עוברים.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

התקשר ל-`Children.forEach(children, fn, thisArg?)` כדי להפעיל קוד עבור כל ילד במבנה הנתונים `children`.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[ראה דוגמאות נוספות למטה.](#ריצת-כמה-קוד-לכל-ילד)

#### פרמטרים {/*children-foreach-parameters*/}

* `children`: הערך של [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) שהתקבל על ידי הרכיב שלך.
* `fn`: הפונקציה שברצונך להפעיל עבור כל ילד, בדומה לשיטת [מערך `forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) callback. היא תיקרא עם הילד כארגומנט הראשון והאינדקס שלו כארגומנט השני. האינדקס מתחיל ב-`0` ומתרחב בכל קריאה.
* **אופציונלי** `thisArg`: הערך [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) שבאמצעותו יש לקרוא לפונקציה `fn`. אם מושמט, זה `undefined`.

#### מחזירה {/*children-foreach-returns*/}

`Children.forEach` מחזירה `undefined`.

#### אזהרות {/*children-foreach-caveats*/}

- צמתים ריקים (`null`, `undefined` ובוליאנים), מחרוזות, מספרים ו-[React אלמנטים](/reference/react/createElement) נחשבים כצמתים בודדים. מערכים לא נחשבים כצמתים בודדים, אבל הילדים שלהם כן. **המעבר אינו מעמיק יותר מאלמנטים של React:** הם לא עוברים רינדור, ולא עוברים על הילדים שלהם. [Fragments](/reference/react/Fragment) לא עוברים.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

התקשר ל-`Children.map(children, fn, thisArg?)` כדי למפות או לשנות כל ילד במבנה הנתונים `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[ראה דוגמאות נוספות למטה.](#transforming-children)

#### פרמטרים {/*children-map-parameters*/}

* `children`: הערך של [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) שהתקבל על ידי הרכיב שלך.
* `fn`: פונקציית המיפוי, בדומה לשיטת [מערך `map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) התקשרות חוזרת. היא תיקרא עם הילד כארגומנט הראשון והאינדקס שלו כארגומנט השני. האינדקס מתחיל ב-`0` ומתרחב בכל קריאה. אתה צריך להחזיר https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) התקשרות ריקה מפונקציה זו, no___. `undefined`, או בוליאני), מחרוזת, מספר, אלמנט React או מערך של צמתים React אחרים.
* **אופציונלי** `thisArg`: הערך [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) שבאמצעותו יש לקרוא לפונקציה `fn`. אם מושמט, זה `undefined`.

#### מחזירה {/*children-map-returns*/}

אם `children` הוא `null` או `undefined`, מחזיר את אותו הערך.

אחרת, מחזיר מערך שטוח המורכב מהצמתים שהחזרת מהפונקציה `fn`. המערך המוחזר יכיל את כל הצמתים שהחזרת מלבד `null` ו-`undefined`.

#### אזהרות {/*children-map-caveats*/}

- צמתים ריקים (`null`, `undefined` ובוליאנים), מחרוזות, מספרים ו-[React אלמנטים](/reference/react/createElement) נחשבים כצמתים בודדים. מערכים לא נחשבים כצמתים בודדים, אבל הילדים שלהם כן. **המעבר אינו מעמיק יותר מאלמנטים של React:** הם לא עוברים רינדור, ולא עוברים על הילדים שלהם. [Fragments](/reference/react/Fragment) לא עוברים.

- אם אתה מחזיר אלמנט או מערך של אלמנטים עם מפתחות מ-`fn`, **מפתחות האלמנטים המוחזרים ישולבו אוטומטית עם המפתח של הפריט המקורי המתאים מ-`children`.** כאשר אתה מחזיר אלמנטים מרובים מ-`fn` במערך, המפתחות שלהם צריכים להיות ייחודיים רק זה בזה מקומית.

---

### `Children.only(children)` {/*children-only*/}


התקשר ל-`Children.only(children)` כדי לקבוע ש-`children` מייצג אלמנט React בודד.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### פרמטרים {/*children-only-parameters*/}

* `children`: הערך של [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) שהתקבל על ידי הרכיב שלך.

#### מחזירה {/*children-only-returns*/}

אם `children` [הוא אלמנט חוקי,](/reference/react/isValidElement) מחזיר את הרכיב הזה.

אחרת, זורק שגיאה.

#### אזהרות {/*children-only-caveats*/}

- השיטה הזו תמיד **זורקת אם אתה מעביר מערך (כגון ערך ההחזרה של `Children.map`) בתור `children`.** במילים אחרות, היא אוכפת ש`children` הוא אלמנט React בודד, לא שזה מערך עם אלמנט בודד.

---

### `Children.toArray(children)` {/*children-toarray*/}

התקשר ל-`Children.toArray(children)` כדי ליצור מערך מתוך מבנה הנתונים `children`.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### פרמטרים {/*children-toarray-parameters*/}

* `children`: הערך של [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) שהתקבל על ידי הרכיב שלך.

#### מחזירה {/*children-toarray-returns*/}

מחזירה מערך שטוח של אלמנטים ב-`children`.

#### אזהרות {/*children-toarray-caveats*/}

- צמתים ריקים (`null`, `undefined` ובוליאנים) יושמטו במערך המוחזר. **מפתחות האלמנטים המוחזרים יחושבו לפי מפתחות האלמנטים המקוריים ורמת הקינון והמיקום שלהם.** זה מבטיח שהשטחת המערך לא תחולל שינויים בהתנהגות.

---

## שימוש {/*usage*/}

### ילדים משתנים {/*transforming-children*/}

כדי להפוך את הילדים JSX שהרכיב שלך [מקבל כאביזר `children`,](/learn/passing-props-to-a-component#passing-jsx-as-children) קרא `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

בדוגמה שלמעלה, ה-`RowList` עוטף כל ילד שהוא מקבל לתוך מיכל `<div className="Row">`. לדוגמה, נניח שרכיב האב מעביר שלושה תגיות `<p>` בתור התמיכה `children` ל-`RowList`:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

לאחר מכן, עם היישום `RowList` לעיל, התוצאה הסופית המעובדת תיראה כך:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` דומה ל-[להמרת מערכים עם `map()`.](/learn/rendering-lists) ההבדל הוא שמבנה הנתונים `children` נחשב ל*אטום.* זה אומר שגם אם זה לפעמים מערך, לא צריך להניח שזה מערך או כל סוג נתונים מסוים אחר. זו הסיבה שאתה צריך use `Children.map` אם אתה צריך לשנות את זה.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### מדוע אביזר הילדים אינו תמיד מערך? {/*why-is-the-children-prop-not-always-an-array*/}

ב-React, אבזר `children` נחשב למבנה נתונים *אטום*. זה אומר שאתה לא צריך להסתמך על איך זה בנוי. כדי להפוך, לסנן או לספור ילדים, עליך use את שיטות `Children`.

בפועל, מבנה הנתונים `children` מיוצג לעתים קרובות כמערך פנימי. עם זאת, אם יש רק ילד בודד, אז React לא יצור מערך נוסף מכיוון שזה יוביל לתקורת memory מיותרת. כל עוד אתה use את שיטות `Children` במקום לבחון ישירות את הפרופס של `children`, הקוד שלך לא ישבר גם אם React ישנה את האופן שבו מבנה הנתונים מיושם בפועל.

גם כאשר `children` הוא מערך, ל-`Children.map` יש use התנהגות מיוחדת מלאה. לדוגמה, `Children.map` משלב את ה-[keys](/learn/rendering-lists#keeping-list-items-in-order-with-key) ברכיבים המוחזרים עם המפתחות ב-`children` שהעברת אליו. זה מבטיח שילדי JSX המקוריים לא "יאבדו" מפתחות גם אם הם עטופים כמו בדוגמה למעלה.

</DeepDive>

<Pitfall>

מבנה הנתונים `children` **לא כולל פלט מעובד** של הרכיבים שאתה מעביר בתור JSX. בדוגמה למטה, ה-`children` שהתקבל על-ידי ה-`RowList` מכיל רק שני פריטים במקום שלושה:

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

זו הסיבה שרק שתי עטיפות שורות נוצרות בדוגמה זו:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**אין דרך לקבל את הפלט המעובד של רכיב פנימי** כמו `<MoreRows />` בעת מניפולציה של `children`. זו הסיבה שבדרך כלל עדיף use אחד מהפתרונות האלטרנטיביים.](#alternatives)

</Pitfall>

---

### הפעלת קוד עבור כל ילד {/*running-some-code-for-each-child*/}

התקשר ל-`Children.forEach` כדי לחזור על כל ילד במבנה הנתונים `children`. זה לא מחזיר שום ערך והוא דומה לשיטת [מערך `forEach`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) אתה יכול use להפעיל לוגיקה מותאמת אישית כמו בניית מערך משלך.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

כפי שהוזכר קודם לכן, אין דרך לקבל את הפלט המעובד של רכיב פנימי בעת מניפולציה של `children`. זו הסיבה שבדרך כלל עדיף use אחד מהפתרונות האלטרנטיביים.](#alternatives)

</Pitfall>

---

### ספירת ילדים {/*counting-children*/}

התקשר ל-`Children.count(children)` כדי לחשב את מספר הילדים.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

כפי שהוזכר קודם לכן, אין דרך לקבל את הפלט המעובד של רכיב פנימי בעת מניפולציה של `children`. זו הסיבה שבדרך כלל עדיף use אחד מהפתרונות האלטרנטיביים.](#alternatives)

</Pitfall>

---

### המרת ילדים למערך {/*converting-children-to-an-array*/}

התקשר ל-`Children.toArray(children)` כדי להפוך את מבנה הנתונים `children` למערך JavaScript רגיל. זה מאפשר לך לתפעל את המערך עם שיטות מערך מובנות כמו [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), או [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

כפי שהוזכר קודם לכן, אין דרך לקבל את הפלט המעובד של רכיב פנימי בעת מניפולציה של `children`. זו הסיבה שבדרך כלל עדיף use אחד מהפתרונות האלטרנטיביים.](#alternatives)

</Pitfall>

---

## חלופות {/*alternatives*/}

<Note>

סעיף זה מתאר חלופות ל-`Children` API (עם רישיות `C`) המיובאים כך:

```js
import { Children } from 'react';
```

אל תסובב את use עם [באמצעות אביזר `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) (אותיות קטנות `c`), וזה טוב ומעודד.

</Note>

### חשיפת רכיבים מרובים {/*exposing-multiple-components*/}

מניפולציה של ילדים בשיטות `Children` מובילה לרוב לקוד שביר. כאשר אתה מעביר ילדים לרכיב ב-JSX, אתה בדרך כלל לא מצפה שהרכיב יבצע מניפולציה או שינוי של הילדים הבודדים.

כאשר אתה יכול, נסה להימנע משימוש בשיטות `Children`. לדוגמה, אם אתה רוצה שכל ילד של `RowList` יהיה עטוף ב-`<div className="Row">`, ייצא רכיב `Row`, ועטוף ידנית כל שורה לתוכו כך:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

בניגוד לשימוש ב-`Children.map`, גישה זו אינה עוטפת כל ילד באופן אוטומטי. **עם זאת, לגישה זו יש יתרון משמעותי בהשוואה [לדוגמה הקודמת עם `Children.map`](#transforming-children) מכיוון שuse היא עובדת גם אם אתה ממשיך לחלץ עוד רכיבים.** לדוגמה, זה עדיין עובד אם אתה מחלץ את רכיב ה-`MoreRows` משלך:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

זה לא יעבוד עם `Children.map` כי use הוא "יראה" את `<MoreRows />` כילד יחיד (ושורה בודדת).

---

### קבלת מערך של אובייקטים כאביזר {/*accepting-an-array-of-objects-as-a-prop*/}

אתה יכול גם להעביר מערך באופן מפורש בתור אביזר. לדוגמה, `RowList` זה מקבל מערך `rows` בתור אבזר:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

מכיוון ש`rows` הוא מערך JavaScript רגיל, הרכיב `RowList` יכול use שיטות מערך מובנות כמו [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) עליו.

דפוס זה useמלא במיוחד כאשר אתה רוצה להיות מסוגל להעביר מידע נוסף כנתונים מובנים יחד עם ילדים. בדוגמה שלהלן, הרכיב `TabSwitcher` מקבל מערך של אובייקטים בתור `tabs` אבזר:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

בניגוד להעברת הילדים בתור JSX, גישה זו מאפשרת לך לשייך כמה נתונים נוספים כמו `header` לכל פריט. Because אתה עובד עם `tabs` ישירות, וזה מערך, אתה לא צריך את שיטות `Children`.

---

### קריאה לאביזר עיבוד כדי להתאים אישית את העיבוד {/*calling-a-render-prop-to-customize-rendering*/}

במקום לייצר JSX עבור כל פריט בודד, אתה יכול גם להעביר פונקציה שמחזירה JSX, ולקרוא לפונקציה הזו בעת הצורך. בדוגמה זו, הרכיב `App` מעביר פונקציה `renderContent` לרכיב `TabSwitcher`. הרכיב `TabSwitcher` קורא ל-`renderContent` רק עבור הכרטיסייה שנבחרה:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

אבזר כמו `renderContent` נקרא *render prop* because זהו אבזר שמציין כיצד לרנדר חלק מהממשק user. עם זאת, אין בזה שום דבר מיוחד: זה אביזר רגיל שהוא במקרה פונקציה.

עיבוד props הן פונקציות, כך שתוכל להעביר אליהן מידע. לדוגמה, רכיב `RowList` זה מעביר את ה-`id` וה-`index` של כל שורה ל-`renderRow` עיבוד אבזר, אשר uses `index` כדי להדגיש שורות זוגיות:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

זוהי דוגמה נוספת לאופן שבו מרכיבי הורה וילד יכולים לשתף פעולה מבלי לתמרן את הילדים.

---

## פתרון בעיות {/*troubleshooting*/}

### אני מעביר רכיב מותאם אישית, אבל שיטות `Children` לא מציגות את תוצאת העיבוד שלו {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

נניח שאתה מעביר שני ילדים ל-`RowList` כך:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

אם תעשה `Children.count(children)` בתוך `RowList`, תקבל `2`. גם אם `MoreRows` מעבד 10 פריטים שונים, או אם הוא מחזיר `null`, `Children.count(children)` עדיין יהיה `2`. מנקודת המבט של ה-`RowList`, הוא "רואה" רק את ה-JSX שהוא קיבל. הוא לא "רואה" את החלק הפנימי של רכיב `MoreRows`.

המגבלה מקשה על חילוץ רכיב. זו הסיבה שהעדיפות [חלופות](#alternatives) על פני שימוש ב-`Children`.
