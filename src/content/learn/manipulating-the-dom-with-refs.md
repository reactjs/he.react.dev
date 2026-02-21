---
title: "מניפולציה של DOM עם Refs"
---

<Intro>

React מעדכן אוטומטית את ה-[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) כך שיתאים לפלט העיבוד שלך, כך שהרכיבים שלך לא יצטרכו לעתים קרובות לתפעל אותו. עם זאת, לפעמים ייתכן שתזדקק לגישה לרכיבי DOM המנוהלים על ידי React--לדוגמה, כדי למקד צומת, לגלול אליו או למדוד את הגודל והמיקום שלו. React, אז תצטרך *ref* לצומת DOM.

</Intro>

<YouWillLearn>

- כיצד לגשת לצומת DOM המנוהל על ידי React עם התכונה `ref`
- איך התכונה `ref` JSX קשורה לתכונה `useRef` Hook
- כיצד לגשת לצומת DOM של רכיב אחר
- באילו מקרים זה בטוח לשנות את DOM המנוהל על ידי React

</YouWillLearn>

## קבלת שו"ת לצומת {/*getting-a-ref-to-the-node*/}

כדי לגשת לצומת DOM המנוהל על ידי React, ראשית, ייבא את ה-`useRef` Hook:

```js
import { useRef } from 'react';
```

לאחר מכן, use זה כדי להכריז על ר"פ בתוך הרכיב שלך:

```js
const myRef = useRef(null);
```

לבסוף, העבר את ה-ref שלך בתור התכונה `ref` לתג JSX שעבורו ברצונך לקבל את הצומת DOM:

```js
<div ref={myRef}>
```

ה-`useRef` Hook מחזיר אובייקט עם מאפיין יחיד בשם `current`. בתחילה, `myRef.current` יהיה `null`. כאשר React יוצר צומת DOM עבור `<div>` זה, React יכניס הפניה לצומת זה לתוך `myRef.current`. לאחר מכן תוכל לגשת לצומת DOM זה מה[מטפלים באירועים](/learn/responding-to-events) וuse ה-[דפדפן APIs](https://developer.mozilla.org/docs/Web/API/Element)) המובנה המוגדר בו.

```js
// You can use any browser APIs, for example:
myRef.current.scrollIntoView();
```

### דוגמה: מיקוד קלט טקסט {/*example-focusing-a-text-input*/}

בדוגמה זו, לחיצה על הכפתור תתמקד בקלט:

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

כדי ליישם זאת:

1. הכריז על `inputRef` עם ה-`useRef` Hook.
2. העבר אותו בתור `<input ref={inputRef}>`. זה אומר לReact **להכניס את הצומת DOM של `<input>` זה לתוך `inputRef.current`.**
3. בפונקציה `handleClick`, קרא את צומת הקלט DOM מ-`inputRef.current` וקרא ל-[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) עליו עם `inputRef.current.focus()`.
4. העבירו את מטפל האירועים `handleClick` אל `<button>` עם `onClick`.

בעוד מניפולציה DOM היא מקרה use הנפוץ ביותר עבור שופטים, ה-`useRef` Hook יכול להיות used לאחסון דברים אחרים מחוץ לReact, כמו מזהי טיימר. בדומה ל-state, שומרים נשארים בין העיבודים. Refs הם כמו state משתנים שאינם מפעילים עיבוד מחדש כאשר אתה מגדיר אותם. קרא על refs ב-[Referencing Values ​​with Refs.](/learn/referencing-values-with-refs)

### דוגמה: גלילה לרכיב {/*example-scrolling-to-an-element*/}

אתה יכול לקבל יותר מ-Ref בודד ברכיב. בדוגמה זו, יש carousel של שלוש תמונות. כל כפתור מרכז תמונה על ידי קריאה לדפדפן [`scrollIntoView()`](שיטת https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) בצומת DOM המתאים:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### כיצד לנהל רשימת נציגים באמצעות התקשרות חוזרת {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

בדוגמאות שלעיל, יש מספר מוגדר מראש של שופטים. עם זאת, לפעמים אתה עשוי להזדקק לשופט לכל פריט ברשימה, ואינך יודע כמה יהיו לך. משהו כזה **לא יעבוד**:

```js
<ul>
  {items.map((item) => {
    // Doesn't work!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

זה בגלל שuse **Hooks חייב להיקרא רק ברמה העליונה של הרכיב שלך.** אינך יכול לקרוא ל`useRef` בלולאה, בתנאי או בתוך קריאה `map()`.

אחת הדרכים האפשריות לעקוף את זה היא להשיג רפי בודד לאלמנט האב שלהם, ולאחר מכן use DOM שיטות מניפולציה כמו [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) כדי "למצוא" את הצמתים הבודדים של הילד ממנו. עם זאת, זה שביר ויכול להישבר אם מבנה ה-DOM שלך משתנה.

פתרון נוסף הוא **העברת פונקציה לתכונה `ref`.** זה נקרא [`ref` התקשרות חוזרת.](/reference/react-dom/components/common#ref-callback) React יתקשר אל ה-ref callback שלך עם הצומת DOM כשיגיע הזמן להגדיר את ה-ref.__T'_, ו__ זה מאפשר לך לתחזק מערך משלך או [מפה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), ולגשת לכל ref על ידי האינדקס שלו או סוג של מזהה.

דוגמה זו מראה כיצד אתה יכול use גישה זו לגלול לצומת שרירותי ברשימה ארוכה:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const itemsRef = useRef(null);

  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>
          Tom
        </button>
        <button onClick={() => scrollToId(5)}>
          Maru
        </button>
        <button onClick={() => scrollToId(9)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          {catList.map(cat => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat.id, node);
                } else {
                  map.delete(cat.id);
                }
              }}
            >
              <img
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

בדוגמה זו, `itemsRef` אינו מחזיק אף צומת DOM אחד. במקום זאת, הוא מכיל [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) ממזהה פריט לצומת DOM. ([Refs can hold כל ערכים!](/learn/referencing-values-with-refs)) ה-[`ref` callback](/reference/react-dom/components/common care) על כל פריט המפה לוקח לעדכן את הרשימה #ref-c:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Add to the Map
      map.set(cat.id, node);
    } else {
      // Remove from the Map
      map.delete(cat.id);
    }
  }}
>
```

זה מאפשר לך לקרוא צמתים DOM בודדים מהמפה מאוחר יותר.

</DeepDive>

## גישה לצמתי DOM של רכיב אחר {/*accessing-another-components-dom-nodes*/}

כאשר אתה שם ref על רכיב מובנה שמוציא רכיב דפדפן כמו `<input />`, React יגדיר את המאפיין `current` של ref לצומת DOM המקביל (כגון ה-`<input />` בפועל בדפדפן).

עם זאת, אם תנסה לשים ר"פ על רכיב **שלך**, כמו `<MyInput />`, כברירת מחדל תקבל `null`. הנה דוגמה שמדגימה זאת. שימו לב כיצד לחיצה על הכפתור **לא** ממקדת את הקלט:

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

כדי לעזור לך לשים לב לבעיה, React מדפיס גם שגיאה למסוף:

<ConsoleBlock level="error">

אזהרה: לא ניתן לתת רפים לרכיבי פונקציה. ניסיונות לגשת לשופט זה ייכשלו. האם התכוונת לuse React.forwardRef()?

</ConsoleBlock>

זה קורה מכיוון שuse כברירת מחדל React לא מאפשר לרכיב לגשת לצמתי DOM של רכיבים אחרים. אפילו לא לילדים שלה! זה מכוון. Refs הם פתח מילוט שאמור להיות used במשורה. מניפולציה ידנית של צמתי DOM של _אחר_ רכיב הופך את הקוד שלך לשביר עוד יותר.

במקום זאת, רכיבים ש_רוצים_ לחשוף את הצמתים DOM שלהם צריכים **להצטרף** להתנהגות זו. רכיב יכול לציין שהוא "מעביר" את ה-ref שלו לאחד מילדיו. הנה איך `MyInput` יכול use את `forwardRef` API:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

כך זה עובד:

1. `<MyInput ref={inputRef} />` אומר לReact להכניס את הצומת DOM המתאים לתוך `inputRef.current`. עם זאת, זה תלוי ברכיב `MyInput` להצטרף לכך - כברירת מחדל, הוא לא עושה זאת.
2. הרכיב `MyInput` מוצהר באמצעות `forwardRef`. **זה מצטרפת לקבל את `inputRef` מלמעלה כארגומנט `ref` השני** המוכרז אחרי `props`.
3. `MyInput` עצמו מעביר את ה-`ref` שקיבל ל-`<input>` שבתוכו.

כעת לחיצה על הכפתור כדי למקד את הקלט פועלת:

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

במערכות עיצוב, זהו דפוס נפוץ עבור רכיבים ברמה נמוכה כמו לחצנים, כניסות וכן הלאה, להעביר את ה-refs שלהם לצמתי DOM שלהם. מצד שני, רכיבים ברמה גבוהה כמו טפסים, רשימות או קטעי עמודים בדרך כלל לא יחשפו את הצמתים DOM שלהם כדי למנוע תלות מקרית במבנה DOM.

<DeepDive>

#### חשיפת תת-קבוצה של API עם ידית חובה {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

בדוגמה שלמעלה, `MyInput` חושף את רכיב הקלט DOM המקורי. זה מאפשר לרכיב האב לקרוא עליו `focus()`. עם זאת, זה גם מאפשר לרכיב האב לעשות משהו אחר--לדוגמה, לשנות את סגנונות ה-CSS שלו. במקרים נדירים, ייתכן שתרצה להגביל את הפונקציונליות החשופה. אתה יכול לעשות את זה עם `useImperativeHandle`:

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

כאן, `realInputRef` בתוך `MyInput` מחזיק בצומת הקלט DOM בפועל. עם זאת, `useImperativeHandle` מורה לReact לספק אובייקט מיוחד משלך כערך של ref לרכיב האב. אז ל-`inputRef.current` בתוך הרכיב `Form` תהיה רק ​​שיטת `focus`. במקרה זה, ה-ref "handle" אינו הצומת DOM, אלא האובייקט המותאם אישית שאתה יוצר בתוך הקריאה `useImperativeHandle`.

</DeepDive>

## כאשר React מצרף את השופטים {/*when-react-attaches-the-refs*/}

ב-React, כל עדכון מפוצל ב-[שני שלבים](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* במהלך **עיבוד,** React קורא לרכיבים שלך כדי להבין מה צריך להיות על המסך.
* במהלך **התחייבות,** React מחיל שינויים על DOM.

באופן כללי, אתה [לא רוצה](/learn/referencing-values-with-refs#best-practices-for-refs) לגשת למשו"פים במהלך העיבוד. זה נכון גם לגבי שופטים המחזיקים בצמתים DOM. במהלך העיבוד הראשון, הצמתים DOM עדיין לא נוצרו, אז `ref.current` יהיה `null`. ובמהלך עיבוד העדכונים, הצמתים DOM עדיין לא עודכנו. אז מוקדם מדי לקרוא אותם.

React מגדיר `ref.current` במהלך ה-commit. לפני עדכון ה-DOM, React מגדיר את ערכי `ref.current` המושפעים ל-`null`. לאחר עדכון ה-DOM, React מגדיר אותם מיד לצמתי DOM המתאימים.

**בדרך כלל, תקבל גישה לשופטים ממטפלי אירועים.** אם אתה רוצה לעשות משהו עם שופט, אבל אין אירוע מסוים לעשות את זה בו, ייתכן שתצטרך אפקט. נדון בהשפעות בעמודים הבאים.

<DeepDive>

#### שטיפת עדכוני state באופן סינכרוני עם flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

שקול קוד כזה, שמוסיף מטלה חדשה וגולל את המסך מטה עד לילד האחרון ברשימה. שימו לב איך, מסיבה כלשהי, הוא תמיד גולל אל המשימה ש*ממש לפני* המשימה האחרונה שנוספה:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

הבעיה היא בשתי השורות האלה:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

ב-React, [state עדכונים נמצאים בתור.](/learn/queueing-a-series-of-state-updates) בדרך כלל, זה מה שאתה רוצה. עם זאת, כאן יש בעיה מכיוון שuse `setTodos` לא מעדכנת מיד את ה-DOM. אז ברגע שאתה גולל את הרשימה לרכיב האחרון שלה, ה-todo עדיין לא התווסף. זו הסיבה שגלילה תמיד "נשארת מאחור" בפריט אחד.

כדי לתקן בעיה זו, אתה יכול לאלץ את React לעדכן ("לשטוף") את ה-DOM באופן סינכרוני. לשם כך, ייבא את `flushSync` מ-`react-dom` ו**עטוף את עדכון state** בשיחה `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

זה ינחה את React לעדכן את ה-DOM באופן סינכרוני מיד לאחר ביצוע הקוד העטוף ב-`flushSync`. כתוצאה מכך, המטלה האחרונה כבר תהיה ב-DOM בזמן שתנסה לגלול אליו:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## שיטות עבודה מומלצות למניפולציה של DOM עם השופטים {/*best-practices-for-dom-manipulation-with-refs*/}

שופטים הם פתח מילוט. אתה צריך use אותם רק כאשר אתה צריך "לצאת החוצה React". דוגמאות נפוצות לכך כוללות ניהול מיקוד, מיקום גלילה או קריאה ל-APIs של הדפדפן ש-React אינו חושף.

אם אתה מקפיד על פעולות לא הרסניות כמו התמקדות וגלילה, אתה לא אמור להיתקל בבעיות. עם זאת, אם תנסה **לשנות** את DOM באופן ידני, אתה יכול להסתכן בסתירה עם השינויים שReact מבצע.

כדי להמחיש בעיה זו, דוגמה זו כוללת הודעת פתיחה ושני כפתורים. הכפתור הראשון מחליף את נוכחותו באמצעות [עיבוד מותנה](/learn/conditional-rendering) ו-[state](/learn/state-a-components-memory), כפי שהיית עושה בדרך כלל ב-React. הכפתור השני use הוא ה-[`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) כדי להסיר אותו בכוח מה-DOM מחוץ לשליטתו של React.

נסה ללחוץ על "החלף עם setState" כמה פעמים. ההודעה אמורה להיעלם ולהופיע שוב. לאחר מכן לחץ על "הסר מה-DOM". זה יסיר אותו בכוח. לבסוף, לחץ על "החלף עם setState":

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

לאחר שהסרת באופן ידני את הרכיב DOM, ניסיון use `setState` כדי להציג אותו שוב יוביל לקריסה. זה בגלל שuse שינית את ה-DOM, ו-React לא יודע איך להמשיך לנהל אותו נכון.

**הימנע משינוי צמתים DOM המנוהלים על ידי React.** שינוי, הוספת ילדים או הסרה של ילדים מאלמנטים המנוהלים על ידי React עלולים להוביל לתוצאות חזותיות לא עקביות או לקריסות כמו לעיל.

עם זאת, זה לא אומר שאתה לא יכול לעשות את זה בכלל. זה דורש זהירות. **אתה יכול לשנות בבטחה חלקים מה-DOM של-React אין _שום סיבה_ לעדכן.** לדוגמה, אם חלק מה-`<div>` תמיד ריק ב-JSX, ל-React לא תהיה סיבה לגעת ברשימת הילדים שלו. לכן, בטוח להוסיף או להסיר שם אלמנטים באופן ידני.

<Recap>

- Refs הם מושג גנרי, אבל לרוב אתה use אותם כדי להחזיק DOM אלמנטים.
- אתה מורה ל-React להכניס צומת DOM לתוך `myRef.current` על ידי העברת `<div ref={myRef}>`.
- בדרך כלל, תקבל use נקודות עבור פעולות לא הרסניות כמו מיקוד, גלילה או מדידת אלמנטים DOM.
- רכיב אינו חושף את הצמתי DOM שלו כברירת מחדל. אתה יכול להצטרף לחשיפת צומת DOM באמצעות `forwardRef` והעברת הארגומנט `ref` השני לצומת ספציפי.
- הימנע משינוי צמתים DOM המנוהלים על ידי React.
- אם תשנה צמתים של DOM המנוהלים על ידי React, שנה חלקים של-React אין סיבה לעדכן.

</Recap>



<Challenges>

#### הפעל והבאuse את הסרטון {/*play-and-pause-the-video*/}

בדוגמה זו, הכפתור מחליף משתנה state כדי לעבור בין משחק ל-paused state. עם זאת, כדי להפעיל או להפעיל את הסרטון בפועל, החלפת state אינה מספיקה. אתה צריך גם להתקשר ל-[`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ו-[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) באלמנט DOM עבור `<video>`. הוסף לזה ר''פ, ותגרום לכפתור לעבוד.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

לאתגר נוסף, שמור על כפתור "הפעל" מסונכרן עם הפעלת הסרטון גם אם ה-user לוחץ לחיצה ימנית על הסרטון ומפעיל אותו באמצעות פקדי המדיה המובנים בדפדפן. אולי תרצה להאזין ל-`onPlay` ו-`onPause` בסרטון כדי לעשות זאת.

<Solution>

הכריז על ref והצב אותו על אלמנט `<video>`. לאחר מכן התקשר ל-`ref.current.play()` ו-`ref.current.pause()` במטפל האירוע בהתאם ל-state הבא.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

על מנת לטפל בפקדי הדפדפן המובנים, ניתן להוסיף מטפלים `onPlay` ו`onPause` לאלמנט `<video>` ולהתקשר מהם `setIsPlaying`. בדרך זו, אם ה-user מנגן את הסרטון באמצעות פקדי הדפדפן, ה-state יתכוונן בהתאם.

</Solution>

#### מיקוד בשדה החיפוש {/*focus-the-search-field*/}

הפוך את זה כך שלחיצה על כפתור "חיפוש" מכניסה את המיקוד לשדה.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

הוסף רפר לקלט, וקרא ל-`focus()` בצומת DOM כדי למקד אותו:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### גלילה תמונה carousel {/*scrolling-an-image-carousel*/}

לתמונה הזו carousel יש כפתור "הבא" שמחליף את התמונה הפעילה. הפוך את הגלריה לגלישה אופקית לתמונה הפעילה בלחיצה. תרצה להתקשר ל-[`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) בצומת DOM של התמונה הפעילה:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

אתה לא צריך להיות רפרנט לכל תמונה עבור התרגיל הזה. זה אמור להספיק להיות רפרנט לתמונה הפעילה כרגע, או לרשימה עצמה. השתמש ב-`flushSync` כדי לוודא שה-DOM מעודכן *לפני* הגלילה.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

אתה יכול להכריז על `selectedRef` ולאחר מכן להעביר אותו בתנאי רק לתמונה הנוכחית:

```js
<li ref={index === i ? selectedRef : null}>
```

כאשר `index === i`, כלומר התמונה היא הנבחרת, ה-`<li>` יקבל את ה-`selectedRef`. React יוודא ש`selectedRef.current` יצביע תמיד על הצומת DOM הנכון.

שימו לב שהקריאה `flushSync` נחוצה כדי לאלץ את React לעדכן את ה-DOM לפני הגלילה. אחרת, `selectedRef.current` תמיד יצביע על הפריט שנבחר קודם לכן.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### מיקוד שדה החיפוש עם רכיבים נפרדים {/*focus-the-search-field-with-separate-components*/}

הפוך את זה כך שלחיצה על כפתור "חיפוש" מכניסה את המיקוד לשדה. שימו לב שכל רכיב מוגדר בקובץ נפרד ואין להעביר ממנו. איך מחברים אותם ביחד?

<Hint>

תזדקק ל-`forwardRef` כדי להצטרף לחשיפת צומת DOM מהרכיב שלך כמו `SearchInput`.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

תצטרך להוסיף אבזר `onClick` ל-`SearchButton`, ולגרום ל-`SearchButton` להעביר אותו לדפדפן `<button>`. אתה גם תעביר שופט למטה ל-`<SearchInput>`, שיעביר אותו ל-`<input>` האמיתי ויאכלס אותו. לבסוף, במטפל הקליקים, תתקשר ל-`focus` בצומת DOM המאוחסן בתוך ה-ref.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
