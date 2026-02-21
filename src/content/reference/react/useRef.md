---
title: "useRef"
---

<Intro>

`useRef` הוא React Hook המאפשר לך להתייחס לערך שאינו נחוץ לעיבוד.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

התקשר ל-`useRef` ברמה העליונה של הרכיב שלך כדי להכריז על [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `initialValue`: הערך שאתה רוצה שמאפיין `current` של אובייקט ref יהיה בהתחלה. זה יכול להיות ערך מכל סוג שהוא. טענה זו מתעלמת לאחר העיבוד הראשוני.

#### מחזירה {/*returns*/}

`useRef` מחזיר אובייקט עם מאפיין יחיד:

* `current`: בתחילה, הוא מוגדר ל-`initialValue` שעברת. מאוחר יותר תוכל להגדיר אותו למשהו אחר. אם תעביר את אובייקט ref ל-React כתכונה `ref` לצומת JSX, React יגדיר את המאפיין `current` שלו.

בעיבודים הבאים, `useRef` יחזיר את אותו אובייקט.

#### אזהרות {/*caveats*/}

* אתה יכול לשנות את המאפיין `ref.current`. שלא כמו state, זה ניתן לשינוי. עם זאת, אם הוא מכיל אובייקט שהוא used לעיבוד (לדוגמה, חלק מה-state שלך), אז אל תעשה מוטציה לאובייקט זה.
* כאשר אתה משנה את המאפיין `ref.current`, React אינו מעבד מחדש את הרכיב שלך. React לא מודע מתי אתה משנה את זה מכיוון שuse רפר הוא אובייקט JavaScript רגיל.
* אל תכתוב _או קרא_ `ref.current` במהלך העיבוד, למעט [אתחול.](#avoiding-recreating-the-ref-contents) זה הופך את התנהגות הרכיב שלך לבלתי צפויה.
* במצב קפדני, React **תתקשר לפונקציית הרכיב שלך פעמיים** ​​כדי [לעזור לך למצוא זיהומים מקריים.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) זוהי התנהגות לפיתוח בלבד ואינה משפיעה על הייצור. כל אובייקט ref ייווצר פעמיים, אך אחת מהגרסאות תימחק. אם פונקציית הרכיב שלך טהורה (כפי שהיא צריכה להיות), זה לא אמור להשפיע על ההתנהגות.

---

## שימוש {/*usage*/}

### הפניית ערך עם ref {/*referencing-a-value-with-a-ref*/}

התקשר ל-`useRef` ברמה העליונה של הרכיב שלך כדי להכריז על אחד או יותר [refs.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` מחזירה <CodeStep step={1}>ref object</CodeStep> עם <CodeStep step={2}>`current` מאפיין בודד</CodeStep> שהוגדר תחילה ל<CodeStep step={3}>ערך ההתחלתי</CodeStep> שסיפקת.

בעיבודים הבאים, `useRef` יחזיר את אותו אובייקט. אתה יכול לשנות את המאפיין `current` שלו כדי לאחסן מידע ולקרוא אותו מאוחר יותר. זה עשוי להזכיר לך את [state](/reference/react/useState), אבל יש הבדל חשוב.

**החלפת רפ' לא מפעילה עיבוד מחדש.** פירוש הדבר שהשו"פים מושלמים לאחסון מידע שאינו משפיע על הפלט החזותי של הרכיב שלך. לדוגמה, אם אתה צריך לאחסן [מזהה מרווח](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) ולאחזר אותו מאוחר יותר, אתה יכול לשים אותו ב-ref. כדי לעדכן את הערך בתוך ה-ref, עליך לשנות באופן ידני את <CodeStep step={2}>`current` המאפיין שלו</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

מאוחר יותר, תוכל לקרוא את מזהה המרווח הזה מהשופט כדי שתוכל להתקשר [לנקות את המרווח הזה](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

על ידי שימוש ב-Ref, אתה מבטיח כי:

- ניתן **לאחסן מידע** בין רינדור מחדש (בניגוד למשתנים רגילים, שמתאפסים בכל עיבוד).
- שינוי זה **לא מפעיל רינדור מחדש** (בניגוד למשתנים state, שמפעילים עיבוד מחדש).
- **המידע הוא מקומי** לכל עותק של הרכיב שלך (בניגוד למשתנים שבחוץ, המשותפים).

שינוי רפ אינו מפעיל רינדור מחדש, כך ששו"פים אינם מתאימים לאחסון מידע שברצונך להציג על המסך. השתמש ב-state עבור זה במקום זאת. קרא עוד על [בחירה בין `useRef` ל-`useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Examples of referencing a value with useRef" titleId="examples-value">

#### מונה קליקים {/*click-counter*/}

רכיב זה use הוא רשופט כדי לעקוב אחר מספר הפעמים שנלחץ על הכפתור. שימו לב שזה בסדר לכתוב use ר"פ במקום state כאן כי use ספירת הקליקים נקראת ונכתבת רק במטפל באירועים.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

אם תראה `{ref.current}` ב-JSX, המספר לא יתעדכן בלחיצה. זוהי מכיוון שהגדרת `ref.current` לא מפעילה עיבוד מחדש. מידע שהוא used לעיבוד צריך להיות state במקום זאת.

<Solution />

#### שעון עצר {/*a-stopwatch*/}

דוגמה זו use היא שילוב של state ו-refs. גם `startTime` וגם `now` הם משתנים state מכיוון שהם used לעיבוד. אבל אנחנו צריכים גם להחזיק [Interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) כדי שנוכל לעצור את המרווח בלחיצת כפתור. מכיוון שמזהה המרווח אינו used לעיבוד, זה מתאים לשמור אותו ב-Ref, ולעדכן אותו באופן ידני.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**אל תכתוב _או קרא_ `ref.current` במהלך העיבוד.**

React מצפה שהגוף של הרכיב שלך [יתנהג כמו פונקציה טהורה](/learn/keeping-components-pure):

- אם הקלט ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), ו-[context](/learn/pass-data-deeply-deeply-with-the-context,__) צריכים להחזיר בדיוק אותו הקשר,__))
- קריאה לזה בסדר אחר או בטיעונים שונים לא אמורה להשפיע על תוצאות שיחות אחרות.

קריאה או כתיבה של שופט **במהלך עיבוד** שוברים את הציפיות הללו.

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

במקום זאת, אתה יכול לקרוא או לכתוב שופטים **ממטפלי אירועים או אפקטים**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

אם אתה *חייב* לקרוא [או לכתוב](/reference/react/useState#storing-information-from-previous-renders) משהו במהלך העיבוד, [use state](/reference/react/useState) במקום זאת.

כאשר אתה מפר את הכללים האלה, ייתכן שהרכיב שלך עדיין יעבוד, אבל רוב התכונות החדשות שאנו מוסיפים ל-React יסתמכו על הציפיות הללו. קרא עוד על [שמירה על טהרת הרכיבים שלך.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### מניפולציה של DOM עם שו"ת {/*manipulating-the-dom-with-a-ref*/}

זה נפוץ במיוחד ל-use שופט כדי לתפעל את [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) React יש תמיכה מובנית לכך.

ראשית, הכריז על <CodeStep step={1}>ref object</CodeStep> עם <CodeStep step={3}>ערך התחלתי</CodeStep> של `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

לאחר מכן העבר את אובייקט ה-ref שלך כתכונה `ref` ל-JSX של הצומת DOM שברצונך לתפעל:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

לאחר React יוצר את הצומת DOM ומעלה אותו על המסך, React יגדיר את <CodeStep step={2}>`current` המאפיין</CodeStep> של אובייקט ה-ref שלך לצומת DOM זה. עכשיו אתה יכול לגשת לצומת DOM של `<input>` ולשיטות קריאה כמו [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React יחזיר את המאפיין `current` ל-`null` כאשר הצומת יוסר מהמסך.

קרא עוד על [מניפולציה של DOM עם refs.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Examples of manipulating the DOM with useRef" titleId="examples-dom">

#### מיקוד קלט טקסט {/*focusing-a-text-input*/}

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

<Solution />

#### גלילה של תמונה לתצוגה {/*scrolling-an-image-into-view*/}

בדוגמה זו, לחיצה על הכפתור תגלול תמונה לתצוגה. זה use הוא רפרנס לצומת DOM ברשימה, ולאחר מכן קורא DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API כדי למצוא את התמונה שאליה אנחנו רוצים לגלול.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
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

<Solution />

#### הפעלה והשהיה של סרטון {/*playing-and-pausing-a-video*/}

דוגמה זו use היא מורה להתקשרות [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ו-[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) על צומת `<video>` DOM.

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
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### חשיפת שופט לרכיב משלך {/*exposing-a-ref-to-your-own-component*/}

לפעמים, ייתכן שתרצה לתת לרכיב האב לתפעל את ה-DOM בתוך הרכיב שלך. לדוגמה, אולי אתה כותב רכיב `MyInput`, אבל אתה רוצה שההורה יוכל למקד את הקלט (שאין להורה גישה אליו). אתה יכול use שילוב של `useRef` כדי להחזיק את הקלט ו-[`forwardRef`](/reference/react/forwardRef) כדי לחשוף אותו לרכיב האב. קרא [הדרכה מפורטת](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) כאן.

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

<Solution />

</Recipes>

---

### הימנעות מיצירה מחדש של תוכן השופט {/*avoiding-recreating-the-ref-contents*/}

React שומר את ערך ה-ref הראשוני פעם אחת ומתעלם ממנו בעיבודים הבאים.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

למרות שהתוצאה של `new VideoPlayer()` היא רק used עבור העיבוד הראשוני, אתה עדיין קורא לפונקציה הזו בכל עיבוד. זה יכול להיות בזבזני אם זה יוצר חפצים יקרים.

כדי לפתור את זה, אתה יכול לאתחל את השופט כך במקום זאת:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

בדרך כלל, כתיבה או קריאה של `ref.current` במהלך העיבוד אינם מותרים. עם זאת, זה בסדר במקרה הזה כי התוצאה היא תמיד זהה, והתנאי מופעלת רק במהלך האתחול, כך שהוא ניתן לחיזוי מלא.

<DeepDive>

#### כיצד להימנע מבדיקות ריק בעת אתחול useRef מאוחר יותר {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

אם אתה use בודק סוגים ולא רוצה לבדוק תמיד את `null`, אתה יכול לנסות דפוס כזה במקום זאת:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

כאן, ה-`playerRef` עצמו ניתן ל- null. עם זאת, אתה אמור להיות מסוגל לשכנע את בודק הסוג שלך שאין מקרה שבו `getPlayer()` מחזיר `null`. ואז use `getPlayer()` במטפלי האירועים שלך.

</DeepDive>

---

## פתרון בעיות {/*troubleshooting*/}

### אני לא יכול לקבל רפרנט לרכיב מותאם אישית {/*i-cant-get-a-ref-to-a-custom-component*/}

אם תנסה להעביר `ref` לרכיב משלך כך:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

ייתכן שתקבל שגיאה בקונסולה:

<ConsoleBlock level="error">

אזהרה: לא ניתן לתת רפים לרכיבי פונקציה. ניסיונות לגשת לשופט זה ייכשלו. האם התכוונת לuse React.forwardRef()?

</ConsoleBlock>

כברירת מחדל, הרכיבים שלך אינם חושפים רפרנסים לצמתים DOM שבתוכם.

כדי לתקן זאת, מצא את הרכיב שאליו ברצונך לקבל רפרנט:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

ואז עטפו אותו ב-[`forwardRef`](/reference/react/forwardRef) כך:

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

אז רכיב האב יכול לקבל ר''פ אליו.

קרא עוד על [גישה לצמתי DOM של רכיב אחר.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
