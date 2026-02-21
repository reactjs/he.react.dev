---
title: "forwardRef"
---

<Intro>

`forwardRef` מאפשר לרכיב שלך לחשוף צומת DOM לרכיב אב עם [ref.](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

התקשר ל-`forwardRef()` כדי לאפשר לרכיב שלך לקבל ר' ולהעביר אותו לרכיב צאצא:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `render`: פונקציית העיבוד של הרכיב שלך. React קורא לפונקציה הזו עם props ו`ref` שהרכיב שלך קיבל מהאב שלו. ה-JSX שתחזיר יהיה הפלט של הרכיב שלך.

#### מחזירה {/*returns*/}

`forwardRef` מחזיר רכיב React שאתה יכול לרנדר ב-JSX. בניגוד לרכיבי React המוגדרים כפונקציות רגילות, רכיב המוחזר על ידי `forwardRef` מסוגל לקבל גם `ref` תמיכה.

#### אזהרות {/*caveats*/}

* במצב קפדני, React **תתקשר לפונקציית העיבוד שלך פעמיים** ​​על מנת [לעזור לך למצוא זיהומים מקריים.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) זוהי התנהגות לפיתוח בלבד ואינה משפיעה על הייצור. אם פונקציית העיבוד שלך טהורה (כפי שהיא צריכה להיות), זה לא אמור להשפיע על ההיגיון של הרכיב שלך. התוצאה מאחת השיחות תתעלם.


---

### `render` פונקציה {/*render-function*/}

`forwardRef` מקבל פונקציית render כארגומנט. React קורא לפונקציה הזו עם `props` ו`ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### פרמטרים {/*render-parameters*/}

* `props`: ה-props עבר על ידי רכיב האב.

* `ref`: התכונה `ref` הועברה על ידי רכיב האב. ה-`ref` יכול להיות אובייקט או פונקציה. אם רכיב האב לא עבר שופט, זה יהיה `null`. עליך להעביר את `ref` שאתה מקבל לרכיב אחר, או להעביר אותו ל-[`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### מחזירה {/*render-returns*/}

`forwardRef` מחזיר רכיב React שאתה יכול לרנדר ב-JSX. שלא כמו רכיבי React המוגדרים כפונקציות רגילות, הרכיב המוחזר על ידי `forwardRef` מסוגל לקחת אבזר `ref`.

---

## שימוש {/*usage*/}

### חשיפת צומת DOM לרכיב האב {/*exposing-a-dom-node-to-the-parent-component*/}

כברירת מחדל, הצמתים DOM של כל רכיב הם פרטיים. עם זאת, לפעמים זה useמלא לחשוף צומת DOM להורה - למשל, כדי לאפשר מיקוד שלו. כדי להצטרף, עטוף את הגדרת הרכיב שלך ב-`forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

תקבל <CodeStep step={1}>ref</CodeStep> בתור הארגומנט השני אחרי props. העבר אותו לצומת DOM שברצונך לחשוף:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

זה מאפשר לרכיב האב `Form` לגשת אל <CodeStep step={2}>`<input>` DOM הצומת</CodeStep> שנחשף על ידי `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

רכיב `Form` זה [מעביר ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) ל-`MyInput`. רכיב `MyInput` *מפנה* המפנה לתג הדפדפן `<input>`. כתוצאה מכך, הרכיב `Form` יכול לגשת לאותו צומת `<input>` DOM ולהתקשר אליו [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus).

זכור שחשיפת רפר לצומת DOM בתוך הרכיב שלך מקשה על שינוי הרכיבים הפנימיים של הרכיב שלך מאוחר יותר. בדרך כלל תחשוף צמתים DOM מרכיבים ברמה נמוכה הניתנים לשימוש חוזר כמו לחצנים או קלט טקסט, אבל לא תעשה זאת עבור רכיבים ברמת היישום כמו אווטאר או הערה.

<Recipes titleText="Examples of forwarding a ref">

#### מיקוד קלט טקסט {/*focusing-a-text-input*/}

לחיצה על הכפתור תתמקד בקלט. הרכיב `Form` מגדיר שופט ומעביר אותו לרכיב `MyInput`. הרכיב `MyInput` מעביר את המפנה לדפדפן `<input>`. זה מאפשר לרכיב `Form` למקד את ה-`<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### הפעלה והשהיה של סרטון {/*playing-and-pausing-a-video*/}

לחיצה על הכפתור תקרא ל-[`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ו-[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) בצומת `<video>` DOM. הרכיב `App` מגדיר ר"פ ומעביר אותו לרכיב `MyVideoPlayer`. הרכיב __TK_ מעביר לדפדפן __TK__ __5__" צומת זה מאפשר לרכיב `App` לשחק ול-pause את `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### העברת שופט דרך מספר רכיבים {/*forwarding-a-ref-through-multiple-components*/}

במקום להעביר `ref` לצומת DOM, אתה יכול להעביר אותו לרכיב משלך כמו `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

אם רכיב ה-`MyInput` הזה מעביר ר"פ ל-`<input>` שלו, ר"פ ל-`FormField` ייתן לך את ה-`<input>` הזה:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

הרכיב `Form` מגדיר שופט ומעביר אותו ל`FormField`. הרכיב `FormField` מעביר את הפניה הזו ל-`MyInput`, שמעביר אותו לצומת `<input>` DOM של הדפדפן. כך `Form` ניגש לאותו צומת DOM.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### חשיפת ידית ציווי במקום צומת DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

במקום לחשוף צומת DOM שלם, אתה יכול לחשוף אובייקט מותאם אישית, הנקרא *ידית ציווי,* עם קבוצה מוגבלת יותר של שיטות. כדי לעשות זאת, תצטרך להגדיר רפר נפרד שיחזיק את הצומת DOM:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

העבר את ה-`ref` שקיבלת אל [`useImperativeHandle`](/reference/react/useImperativeHandle) וציין את הערך שברצונך לחשוף ל-`ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

אם רכיב כלשהו מקבל ref ל-`MyInput`, הוא יקבל רק את האובייקט `{ focus, scrollIntoView }` שלך במקום את הצומת DOM. זה מאפשר לך להגביל את המידע שאתה חושף על הצומת DOM שלך למינימום.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[קרא עוד על שימוש בידיות ציוויות.](/reference/react/useImperativeHandle)

<Pitfall>

**לא להגזים ב-use רספים.** עליכם להשתמש ב-use רק עבור התנהגויות *חוויתי* שאינכם יכולים לבטא כ-props: למשל, גלילה לצומת, מיקוד של צומת, הפעלת אנימציה, בחירת טקסט וכן הלאה.

**אם אתה יכול לבטא משהו בתור אביזר, אתה לא צריך use ref.** למשל, במקום לחשוף ידית ציווי כמו `{ open, close }` מרכיב `Modal`, עדיף לקחת את `isOpen` כאביזר כמו `<Modal isOpen={isOpen} />`. [אפקטים](/learn/synchronizing-with-effects) יכול לעזור לך לחשוף התנהגויות הכרחיות באמצעות props.

</Pitfall>

---

## פתרון בעיות {/*troubleshooting*/}

### הרכיב שלי עטוף ב-`forwardRef`, אבל ה-`ref` אליו הוא תמיד `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

זה בדרך כלל אומר ששכחת למעשה use את `ref` שקיבלת.

לדוגמה, הרכיב הזה לא עושה כלום עם ה-`ref` שלו:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

כדי לתקן את זה, העבירו את ה-`ref` לצומת DOM או לרכיב אחר שיכול לקבל ר"פ:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

ה-`ref` ל-`MyInput` יכול להיות גם `null` אם חלק מהלוגיקה מותנית:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

אם `showInput` הוא `false`, ה-Ref לא יועבר לשום צומת, ו-Ref ל-`MyInput` יישאר ריק. זה קל במיוחד לפספס אם התנאי מוסתר בתוך רכיב אחר, כמו `Panel` בדוגמה זו:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
