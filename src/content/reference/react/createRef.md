---
title: "ליצורRef"
---

<Pitfall>

`createRef` בשימוש בעיקר עבור [class components.](/reference/react/Component) קומפוננטות פונקציה בדרך כלל נשענות על [`useRef`](/reference/react/useRef) במקום.

</Pitfall>

<Intro>

`createRef` יוצרת אובייקט [ref](/learn/referencing-values-with-refs) יכול להכיל כל ערך.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `createRef()` {/*createref*/}

קראו ל-`createRef` כדי להצהיר על [ref](/learn/referencing-values-with-refs) בתוך [רכיב כיתה.](/reference/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

`createRef` לא מקבלת פרמטרים.

#### מחזירה {/*returns*/}

`createRef` מחזירה אובייקט עם מאפיין יחיד:

* `current`: בתחילה מוגדרת ל-`null`. לאחר מכן אפשר להגדיר אותו לערך אחר. אם מעבירים את אובייקט ה-ref ל-React כמאפיין `ref` ל-JSX node, React תגדיר את המאפיין `current` שלו.

#### אזהרות {/*caveats*/}

* `createRef` תמיד מחזירה אובייקט *שונה*. זה שקול לכתיבה ידנית של `{ current: null }`.
* בקומפוננטת פונקציה, כנראה שתרצו [`useRef`](/reference/react/useRef), שמחזירה תמיד את אותו אובייקט.
* `const ref = useRef()` שקול ל-`const [ref, _] = useState(() => createRef(null))`.

---

## שימוש {/*usage*/}

### ההרהור על רכיב המחלקה {/*declaring-a-ref-in-a-class-component*/}

כדי להצהיר על ref בתוך [רכיב כיתה,](/reference/react/Component) קראו ל-`createRef` והקצו את התוצאה לשדה במחלקה:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

אם תעבירו עכשיו `ref={this.inputRef}` ל-`<input>` ב-JSX שלכם, React תאכלס את `this.inputRef.current` עם DOM node של שדה הקלט. לדוגמה, כך יוצרים כפתור שמפקס את השדה הקלט:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` בשימוש בעיקר עבור [class components.](/reference/react/Component) קומפוננטות פונקציה בדרך כלל נשענות על [`useRef`](/reference/react/useRef) במקום.

</Pitfall>

---

## חלופות {/*alternatives*/}

### המשך מכיתה עם `createRef` לפונקציה עם `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

אנחנו ממליצים להשתמש בקומפוננטות פונקציה במקום [רכיבי כיתה](/reference/react/Component) בקוד חדש. אם יש לכם רכיבי כיתה קיימות שמשתמשות ב-`createRef`, כך אפשר להמיר אותן. זה הקוד המקורי:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

כש-[ממירים את הקומפוננטה הזו מ-class לפונקציה,](/reference/react/Component#alternatives) מחליפים קריאות ל-`createRef` בקריאות ל-[`useRef`:](/reference/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>
