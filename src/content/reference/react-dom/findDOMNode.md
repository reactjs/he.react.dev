---
title: "findDOMNode"
---

<Deprecated>

API זה יוסר בגרסה עיקרית עתידית של React. [ראה את החלופות.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode` מוצא את הצומת DOM של הדפדפן עבור מופע React [מחלקה](/reference/react/Component).

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

התקשר ל-`findDOMNode` כדי למצוא את צומת הדפדפן DOM עבור מופע נתון של React [רכיב מחלקה](/reference/react/Component).

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `componentInstance`: מופע של תת-המעמד [`Component`](/reference/react/Component). לדוגמה, `this` בתוך רכיב מחלקה.


#### מחזירה {/*returns*/}

`findDOMNode` מחזיר את צומת הדפדפן DOM הראשון הקרוב ביותר בתוך `componentInstance` הנתון. כאשר רכיב מעבד ל-`null`, או מעבד `false`, `findDOMNode` מחזיר `null`. כאשר רכיב מעבד למחרוזת, `findDOMNode` מחזיר צומת טקסט DOM המכיל את הערך הזה.

#### אזהרות {/*caveats*/}

* רכיב עשוי להחזיר מערך או [Fragment](/reference/react/Fragment) עם מספר ילדים. במקרה זה `findDOMNode`, יחזיר את הצומת DOM המתאים לילד הראשון שאינו ריק.

* `findDOMNode` עובד רק על רכיבים רכובים (כלומר, רכיבים שהוצבו ב-DOM). אם תנסה לקרוא לזה על רכיב שעדיין לא הותקן (כמו קריאה ל-`findDOMNode()` ב-`render()` על רכיב שטרם נוצר), ייגרם חריג.

* `findDOMNode` מחזיר את התוצאה רק בזמן השיחה שלך. אם רכיב צאצא יציג צומת אחר מאוחר יותר, אין שום דרך לקבל הודעה על שינוי זה.

* `findDOMNode` מקבל מופע של רכיבי מחלקה, כך שהוא לא יכול להיות used עם רכיבי פונקציה.

---

## שימוש {/*usage*/}

### מציאת צומת השורש DOM של רכיב מחלקה {/*finding-the-root-dom-node-of-a-class-component*/}

התקשר ל-`findDOMNode` עם מופע [מחלקה](/reference/react/Component) (בדרך כלל, `this`) כדי למצוא את הצומת DOM שהוא הציג.

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}
```

כאן, המשתנה `input` יוגדר לאלמנט `<input>` DOM. זה מאפשר לך לעשות עם זה משהו. לדוגמה, כאשר לחיצה על "הצג דוגמה" למטה מעלה את הקלט, [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) בוחר את כל הטקסט בקלט:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## חלופות {/*alternatives*/}

### קריאת צומת DOM של הרכיב עצמו מ-ref {/*reading-components-own-dom-node-from-a-ref*/}

קוד באמצעות `findDOMNode` הוא שביר מכיוון שהקשר בין הצומת JSX לקוד המפעיל את הצומת DOM המתאים אינו מפורש. לדוגמה, נסה לעטוף את ה-`<input />` הזה לתוך `<div>`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

זה ישבור את הקוד מכיוון שuse עכשיו, `findDOMNode(this)` מוצא את הצומת `<div>` DOM, אבל הקוד מצפה לצומת `<input>` DOM. כדי למנוע בעיות מסוג זה, use [`createRef`](/reference/react/createRef) כדי לנהל צומת DOM ספציפי.

בדוגמה זו, `findDOMNode` אינו עוד used. במקום זאת, `inputRef = createRef(null)` מוגדר כשדות מופע במחלקה. כדי לקרוא את הצומת DOM ממנו, אתה יכול use `this.inputRef.current`. כדי לצרף אותו ל-JSX, אתה מעבד את `<input ref={this.inputRef} />`. זה מחבר את הקוד באמצעות הצומת DOM ל-JSX שלו:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hello" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

ב-React המודרנית ללא רכיבי מחלקה, הקוד המקביל יקרא [`useRef`](/reference/react/useRef) במקום זאת:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Hello" />
}
```

</Sandpack>

[קרא עוד על מניפולציה של DOM עם refs.](/learn/manipulating-the-dom-with-refs)

---

### קריאת צומת DOM של רכיב צאצא מ-Ref מועבר {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

בדוגמה זו, `findDOMNode(this)` מוצא צומת DOM ששייך לרכיב אחר. ה-`AutoselectingInput` מעבד את `MyInput`, שהוא הרכיב שלך שמציג דפדפן `<input>`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
export default function MyInput() {
  return <input defaultValue="Hello" />;
}
```

</Sandpack>

שימו לב שקריאה ל-`findDOMNode(this)` בתוך `AutoselectingInput` עדיין מעניקה לכם את ה-DOM `<input>`--למרות שה-JSX עבור `<input>` זה מוסתר בתוך רכיב `MyInput`. זה נראה נוח עבור הדוגמה שלעיל, אבל זה מוביל לקוד שביר. תאר לעצמך שרצית לערוך `MyInput` מאוחר יותר ולהוסיף עטיפה `<div>` סביבו. זה ישבור את הקוד של `AutoselectingInput` (שמצפה למצוא `<input>`).

כדי להחליף את `findDOMNode` בדוגמה זו, שני הרכיבים צריכים לתאם:

1. `AutoSelectingInput` צריך להכריז על ref, כמו [בדוגמה הקודמת](#reading-components-own-dom-node-from-a-ref), ולהעביר אותו ל-`<MyInput>`.
2. יש להצהיר על `MyInput` עם [`forwardRef`](/reference/react/forwardRef) כדי לקחת את השופט הזה ולהעביר אותו למטה לצומת `<input>`.

הגרסה הזו עושה את זה, אז היא כבר לא צריכה `findDOMNode`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

כך ייראה הקוד הזה עם רכיבי פונקציה במקום מחלקות:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Hello" />
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

---

### הוספת אלמנט מעטפת `<div>` {/*adding-a-wrapper-div-element*/}

לפעמים רכיב צריך לדעת את המיקום והגודל של ילדיו. זה עושה את זה מפתה למצוא את הילדים עם `findDOMNode(this)`, ולאחר מכן use DOM שיטות כמו [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) למדידות.

כרגע אין מקבילה ישירה למקרה use זה, ולכן `findDOMNode` הוצא משימוש אך עדיין לא הוסר לחלוטין מReact. בינתיים, אתה יכול לנסות לעבד צומת עוטף `<div>` סביב התוכן כפתרון לעקיפת הבעיה, ולקבל רפרנט לצומת זה. עם זאת, עטיפות נוספות יכולות לשבור את הסטיילינג.

```js
<div ref={someRef}>
  {children}
</div>
```

זה חל גם על התמקדות וגלילה לילדים שרירותיים.
