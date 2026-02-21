---
title: "isValidElement"
---

<Intro>

`isValidElement` בודקת האם ערך הוא React אלמנט.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

קראו ל-`isValidElement(value)` כדי לבדוק האם `value` הוא React אלמנט.

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Not React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `value`: הערך שברצונכם לבדוק. הוא יכול להיות מכל סוג.

#### מחזירה {/*returns*/}

`isValidElement` מחזירה `true` אם `value` הוא React אלמנט. אחרת היא מחזירה `false`.

#### אזהרות {/*caveats*/}

* **רק [JSX תגיות](/learn/writing-markup-with-jsx) ואובייקטים שמוחזרים מ-[`createElement`](/reference/react/createElement) נחשבים ל-React אלמנטים.** למשל, למרות שמספר כמו __MK_1__ הוא לא `42` הוא *ו`42` תחזיר אותו, אלמנט React תקין. גם מערכים ו-פורטלים מיוחדים עם [`createPortal`](/reference/react-dom/createPortal) *לא* נחשבים React אלמנטים.

---

## שימוש {/*usage*/}

### בדיקה אם משהו הוא React element {/*checking-if-something-is-a-react-element*/}

קראו ל-`isValidElement` כדי לבדוק אם ערך הוא *React אלמנט*.

React אלמנטים הם:

- ערכים יוצרים מכתיבת [JSX tag](/learn/writing-markup-with-jsx)
- ערכים יוצרים מקריאה ל-[`createElement`](/reference/react/createElement)

עבור אלמנטים React, `isValidElement` מחזירה `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX tags are React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Values returned by createElement are React elements
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

כל ערך אחר, כמו מחרוזות, מספרים או אובייקטים וערכים שרירותיים, אינו React אלמנט.

עבורם, `isValidElement` מחזירה `false`:

```js
// ❌ These are *not* React elements
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

נדיר מאוד שצריך `isValidElement`. לרוב שימושי רק כשקוראים ל-API אחר ש*מקבל רק אלמנטים* (כמו [`cloneElement`](/reference/react/cloneElement)) ורוצים ממש משגיאה כשהארגומנט אינו React אלמנט.

אלא אם יש לכם סיבה מאוד ספציפית להוסיף בדיקת `isValidElement`, כנראה שאין צורך.

<DeepDive>

#### React אלמנטים לעומת React צמתים {/*react-elements-vs-react-nodes*/}

כשכותבים קומפונטה, אפשר להחזיר ממנה כל סוג של צומת *React*:

```js
function MyComponent() {
  // ... you can return any React node ...
}
```

צומת React יכול להיות:

- React אלמנט עיצוב כמו `<div />` או `createElement('div')`
- פורטל מיוחד עם [`createPortal`](/reference/react-dom/createPortal)
- מחרוזת
- מספר
- `true`, `false`, `null`, או `undefined` (שאינם מוצגים)
- מערך של React צמתים אחרים

**שימו לב ש-`isValidElement` בודקת האם הארגומנט הוא *React element*, ולא האם הוא React node.** לדוגמה, `42` אינו React אלמנט תקין. עם זאת, הוא React צומת תקין לחלוטין:

```js
function MyComponent() {
  return 42; // It's ok to return a number from component
}
```

לא כדאי להשתמש ב-`isValidElement` כדי לברר אם משהו ניתן לרינדור.

</DeepDive>
