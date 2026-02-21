---
title: "useImperativeHandle"
---

<Intro>

`useImperativeHandle` הוא React Hook שמאפשר להתאים אישית את ה-handle שנחשף כ-[ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

קראו ל-`useImperativeHandle` ברמה העליונה של הקומפוננטה כדי להתאים אישית את ה-Ref handle שהיא חושפת:

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `ref`: ה-`ref` קיבלתם כארגומנט השני מתוך [`forwardRef` render function.](/reference/react/forwardRef#render-function)

* `createHandle`: פונקציה שלא מקבלת ארגומנטים ומחזירה את ref handle שתרצו לחשוף. ה-handle יכול הזה להיות מכל סוג. בדרך כלל תחזירו אובייקט עם המתודות שתרצו לחשוף.

* **אופציונלי** `dependencies`: רשימה של כל הערכים הריאקטיביים שמופנים בתוך קוד ה-`createHandle`. ערכים ריאקטיביים כוללים props, state וכל המשתנים והפונקציות שמוגדרים באופן עצמאי בתוך גוף הקומפוננטה. אם ה-linter שלכם [מוגדר ל-React](/learn/editor-setup#linting), הוא יוודא שכל ערך ריאקטיבי מצוין נכון כ-dependency. רשימת התלות חייבת להיות מספר פריטים קבועים וכתב מוטבע כמו `[dep1, dep2, dep3]`. React תשווה כל התלות לערך קודמת שלו באמצעות [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). אם מחדש גרם לשינוי ב-dependency, או אם השמטתם את הארגומנט הזה, פונקציית `createHandle` תרוץ מחדש, וה-handle החדש שייווצר יוקצה ל-ref.

#### מחזירה {/*returns*/}

`useImperativeHandle` מחזיר `undefined`.

---

## שימוש {/*usage*/}

### חשיפת ref handle מותאם לקומפוננטת ההורה {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

כברירת מחדל, קומפונטות לא חושפות את ה-DOM צמתים שלהן לקומפוננטות הורה. למשל, אם אתם רוצים שלקומפונטת ההורה של `MyInput` תהיה [גישה](/learn/manipulating-the-dom-with-refs) ל-`<input>` DOM צומת, צריך לבצע הסכמה עם [`forwardRef`:](/reference/react/forwardRef)

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

עם הקוד למעלה, [ref L-`MyInput` יקבל את הצומת `<input>` DOM.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) אבל אפשר גם לחשוף ערך מותאם אישית במקום. כדי להתאים את הידית שנחשף, קראו ל-`useImperativeHandle` ברמה העליונה של הקומפוננטה:

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input {...props} />;
});
```

שימו לב שבקוד למעלה, ה-`ref` כבר לא מועבר ל-`<input>`.

לדוגמה, נניח שאתה לא רוצה לחשוף את כל הצומת `<input>` DOM, אלא רק שתי מתודות: `focus` ו-`scrollIntoView`. כדי לעשות זאת, שמרו את ה-DOM האמיתי של הדפדפן ב-ref נפרד. אחר כך השתמשו ב-`useImperativeHandle` כדי לחשוף את הידית שמכילה רק את המתודות שההורה תוכל לקרוא להן:

```js {7-14}
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

עכשיו, אם קומפוננתת ההורה מקבלת ref ל-`MyInput`, היא תוכל לקרוא למתודות `focus` ו-`scrollIntoView`. עם זאת, לא תהיה גישה מלאה ל-`<input>` DOM צומת עצמו.

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

---

### חשיפת מתודות ציווי משלכם {/*exposing-your-own-imperative-methods*/}

המתודות שלך חושפים דרך ציווי ידית לא חייבות להתאים בדיוק למתודות DOM. לדוגמה, קומפונטת `Post` הזו חושפת מתודה בשם `scrollAndFocusAddComment` דרך ציווי אחיזה. זה יכול ל-`Page` ההורה לגלול את רשימת התגובות *וגם* לפקס את שדה הקלט כשהם לוחצים על הכפתור:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { forwardRef, useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});

export default Post;
```


```js src/CommentList.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CommentList = forwardRef(function CommentList(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export default CommentList;
```

```js src/AddComment.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Add comment..." ref={ref} />;
});

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**אל תשתמשו ב-refs המשך לנדרש.** כדאי להשתמש ב-refs רק להתנהגויות *ציווי* ניתן לבטא כ-props: למשל שלא גלילה ל-node, פוקוס ל-node, הפעלת אנימציה, בחירת טקסט, וכן הלאה.

**אם אפשר לבטא משהו כ-prop, לא כדאי להשתמש ב-ref.** לדוגמה, במקום לחשוף imperative handle כמו `{ open, close }` מתוך קומפוננטת `Modal`, עדיף לקבל `isOpen` כ-prop כמו `<Modal isOpen={isOpen} />`. [אפקטים](/learn/synchronizing-with-effects) יכולים לעזור לחשוף התנהגויות ציווי דרך props.

</Pitfall>
