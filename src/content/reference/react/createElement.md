---
title: "createElement"
---

<Intro>

`createElement` להצליח ליצור אלמנט React. היא משמשת חלופה לכתיבת [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

קראו ל-`createElement` כדי ליצור אלמנט React עם נתונים `type`, `props` ו-`children`.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `type`: הארגומנט `type` חייב להיות סוג קומפונטת React תקין. למשל, מחרוזת שם תגית (כמו `'div'` או `'span'`), או קומפונטת React (פונקציה, class, או קומפונטה מיוחדת כמו [`Fragment`](/reference/react/Fragment)).

* `props`: הארגומנט `props` חייב להיות אובייקט או `null`. אם תעבירו `null`, הוא יטופל כמו ריק. React תיצור אלמנט עם props תואמים ל-`props` שהעברתם. שימו לב ש-`ref` ו-`key` מתוך אובייקט ה-`props` שלכם הם מיוחדים, אז *לא* יהיו זמינים כ-`element.props.ref` ו-`element.props.key` על ה-`element` המוחזר. הם יהיו זמינים כ-`element.ref` ו-`element.key`.

* **אופציונלי** `...children`: אפס או יותר צמתים ילדים. הם יכולים להיות כל סוג של React צמתים, כולל React אלמנטים, מחרוזות, מספרים, [פורטלים](/reference/react-dom/createPortal), צמתים ריקים (`null`, `undefined`, `true`, ו-`false`), וערכים של __T.

#### מחזירה {/*returns*/}

`createElement` מחזירה אובייקט React אלמנט עם כמה מאפיינים:

* `type`: ה-`type` העברתם.
* `props`: ה-`props` העברתם, למעט `ref` ו-`key`. אם `type` היא קומפוננטה עם legacy `type.defaultProps`, אז כל `props` חסרים או `undefined` יקבלו את הערכים מתוך `type.defaultProps`.
* `ref`: ה-`ref` העברתם. אם חסר, `null`.
* `key`: ה-`key` העברתם, מומר למחרוזת. אם חסר, `null`.

בדרך כלל תחזירו את ה-element מהקומפוננטה שלכם או תהפכו אותו ל-child של אלמנט אחר. אם אפשר לקרוא את מאפייני ה-element, עדיף להתייחס לכל האלמנט כלא שקוף אחרי יצירתו ורק לרנדר אותו.

#### אזהרות {/*caveats*/}

* צריך **להתייחס ל-React elements ול-props שלהם כ-[בלתי ניתן לשינוי](https://en.wikipedia.org/wiki/Immutable_object)** ולעולם לא לשנות את התוכן שלהם אחרי יצירה. בזמן פיתוח, React תבצע [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) רדוד ל-אלמנט המוחזר ולכומאפיין `props` זאת שלו.

* כשמשתמשים ב-JSX, **חייבים להתחיל תגית באות גדולה כדי לרנדר רכיב מותאם אישית.** כלומר, `<Something />` שקול ל-`createElement(Something)`, אבל `<something />` (אותיות קטנות) שקול ל-`createElement('something')` (שימו לבש מחרוזת, כך תטופל כתגי__ת __T).

* כדאי **להעביר ילדים כארגומנטים מרובים ל-`createElement` רק אם ידועים סטטיים,** כמו `createElement('h1', {}, child1, child2, child3)`. אם הילדים דינמיים, העבירו את כל המערך כארגומנט שלישי: `createElement('ul', {}, listItems)`. כך React תוכל [להזהיר על `key`s חסרים](/learn/rendering-lists#keeping-list-items-in-order-with-key) עבור רשימות דינמיות. לרשימות סטטיות אין צורך כי הן לא משנות סדר.

---

## שימוש {/*usage*/}

### יצירת אלמנט בלי JSX {/*creating-an-element-without-jsx*/}

אם אתם לא אוהבים [JSX](/learn/writing-markup-with-jsx) או לא יכולים להשתמש בה בפרויקט, אפשר להשתמש ב-`createElement` כחלופה.

כדי ליצור אלמנט בלי JSX, קראו ל-`createElement` עם <CodeStep step={1}>סוג</CodeStep>, <CodeStep step={2}>props</CodeStep>, ו-<CodeStep step={3}>ילדים</CodeStep>:

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

ה-<CodeStep step={3}>children</CodeStep> אופציונליים, ואפשר להעביר כמה דברים (בדוגמה למעלה יש שלושה ילדים). הקוד הזה יציג כותרת `<h1>` עם ברכה. להשוואה, הנה אותה דוגמה שנכתבה עם JSX:

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

כדי לרנדר קומפוננתת React משלכם, העבירו פונקציה כמו `Greeting` כ-<CodeStep step={1}>type</CodeStep> במקום מחרוזת כמו `'h1'`:

```js
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

עם JSX זה היה נראה כך:

```js
export default function App() {
  return <Greeting name="Taylor" />;
}
```

הנה דוגמה מלאה שנכתבה עם `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

והנה אותה דוגמה כשהיא כתובה עם JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

שני סגנונות הקוד תקינים, ואפשר להשתמש במה מתאים לפרויקט שלכם. זהו המרכזי של JSX לעומת `createElement` הוא שקל לראות איזו תגית סוגרת שייכת לאיזו תגית פותחת.

<DeepDive>

#### בעצם __TK_אלמנט? {/*what-is-a-react-element-exactly*/}

האלמנט הוא תיאור קל משקל של חלק מממשק המשתמש. למשל, גם `<Greeting name="Taylor" />` וגם `createElement(Greeting, { name: 'Taylor' })` מייצרים אובייקט כזה:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**שימו לב שיצירת האובייקט הזה לא מרנדרת את הקומפוננטה `Greeting` ולא יוצרת אלמנטים ב-DOM.**

React element דומה יותר לתיאור - הוראה ל-React לרנדר מאוחר יותר את הקומפוננטה `Greeting`. על ידי החזרת האובייקט הזה מקומפונטת `App`, אתם אומרים ל-React מה לעשות בהמשך.

פעולות יצירתיות זולה מאוד, כך שאין צורך לנסות לבצע לה אופטימיזציה או כוח ממנה.

</DeepDive>
