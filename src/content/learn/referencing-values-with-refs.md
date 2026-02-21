---
title: "הפניה לערכים עם Refs"
---

<Intro>

כאשר אתה רוצה שרכיב "יזכור" מידע מסוים, אבל אתה לא רוצה שהמידע הזה [תפעיל עיבודים חדשים](/learn/render-and-commit), אתה יכול use *ref*.

</Intro>

<YouWillLearn>

- כיצד להוסיף שופט לרכיב שלך
- כיצד לעדכן ערך של שופט
- איך השופטים שונים מ-state
- איך use שופטים בבטחה

</YouWillLearn>

## הוספת ref לרכיב שלך {/*adding-a-ref-to-your-component*/}

אתה יכול להוסיף רפר לרכיב שלך על ידי ייבוא ​​ה-`useRef` Hook מ-React:

```js
import { useRef } from 'react';
```

בתוך הרכיב שלך, קרא ל-`useRef` Hook והעביר את הערך ההתחלתי שאליו אתה רוצה להתייחס כארגומנט היחיד. לדוגמה, הנה ר"פ לערך `0`:

```js
const ref = useRef(0);
```

`useRef` מחזיר אובייקט בצורה הבאה:

```js
{ 
  current: 0 // The value you passed to useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="An arrow with 'current' written on it stuffed into a pocket with 'ref' written on it." />

אתה יכול לגשת לערך הנוכחי של אותו השופט דרך המאפיין `ref.current`. ערך זה ניתן לשינוי בכוונה, כלומר אתה יכול גם לקרוא וגם לכתוב אליו. זה כמו כיס סודי של הרכיב שלך שReact לא עוקב אחריו. (זה מה שהופך אותו ל"פתח מילוט" מזרימת הנתונים החד-כיוונית של React - עוד על כך בהמשך!)

כאן, כפתור יגדיל את `ref.current` בכל לחיצה:

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

ה-ref מצביע על מספר, אבל, כמו [state](/learn/state-a-components-memory), אתה יכול להצביע על כל דבר: מחרוזת, אובייקט או אפילו פונקציה. שלא כמו state, ref הוא אובייקט JavaScript רגיל עם המאפיין `current` שניתן לקרוא ולשנות.

שים לב ש**הרכיב לא מעבד מחדש עם כל תוספת.** כמו state, השומרים נשמרים על ידי React בין העיבוד מחדש. עם זאת, הגדרה של state מעבדת מחדש רכיב. החלפת שופט לא!

## דוגמה: בניית שעון עצר {/*example-building-a-stopwatch*/}

אתה יכול לשלב refs ו-state ברכיב אחד. לדוגמה, בואו ניצור שעון עצר שה-user יכול להפעיל או לעצור על ידי לחיצה על כפתור. על מנת להציג כמה זמן עבר מאז שה-user לחץ על "התחל", תצטרכו לעקוב מתי לחצו על כפתור התחל ומה השעה הנוכחית. **מידע זה הוא used לעיבוד, כך שתשמור אותו ב-state:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

כאשר ה-user לוחץ על "התחל", תבצע use [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) כדי לעדכן את השעה כל 10 אלפיות השנייה:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
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
    </>
  );
}
```

</Sandpack>

כאשר כפתור "עצור" נלחץ, עליך לבטל את המרווח הקיים כדי שיפסיק לעדכן את המשתנה `now` state. אתה יכול לעשות זאת על ידי קריאה ל-[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), אבל אתה צריך לתת לו את מזהה המרווח שהוחזר בעבר על ידי שיחת `setInterval` כשה-user לחץ על Start. אתה צריך לשמור את מזהה המרווח איפשהו. **מכיוון שמזהה המרווח אינו used לעיבוד, אתה יכול לשמור אותו ב-ref:**

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

כאשר פיסת מידע היא used לעיבוד, שמור אותו ב-state. כאשר פיסת מידע נחוצה רק על ידי מטפלי אירועים ושינויו אינו מצריך עיבוד מחדש, השימוש ב-ref עשוי להיות יעיל יותר.

## הבדלים בין שופטים ל-state {/*differences-between-refs-and-state*/}

אולי אתה חושב ששופטים נראים פחות "קפדניים" מ-state - אתה יכול לשנות אותם במקום תמיד להצטרך use פונקציית הגדרה של state, למשל. אבל ברוב המקרים, תרצה use state. Refs הם "פתח מילוט" שלא תצטרך לעתים קרובות. כך משווים בין state לבין השופטים:

| שופטים | state |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` מחזירה `{ current: initialValue }` | `useState(initialValue)` מחזירה את הערך הנוכחי של משתנה state ופונקציית מגדיר state (`[value, setValue]`) |
| לא מפעיל עיבוד מחדש כשאתה משנה אותו.                                         | מפעיל עיבוד מחדש כאשר אתה משנה אותו.                                                                                    |
| ניתן לשינוי - אתה יכול לשנות ולעדכן את הערך של `current` מחוץ לתהליך העיבוד. | "בלתי ניתן לשינוי" - עליך use את פונקציית ההגדרה state כדי לשנות משתנים של state כדי לעמוד בתור עיבוד מחדש.                       |
| אין לקרוא (או לכתוב) את הערך `current` במהלך העיבוד. | אתה יכול לקרוא את state בכל עת. עם זאת, לכל עיבוד יש [תמונת מצב](/learn/state-as-a-snapshot) משלו של state שאינו משתנה.

הנה כפתור מונה שמיושם עם state:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

מכיוון שהערך `count` מוצג, הגיוני להזין ערך state עבורו use. כאשר ערך המונה מוגדר עם `setCount()`, React מעבד מחדש את הרכיב והמסך מתעדכן כדי לשקף את הספירה החדשה.

אם ניסית ליישם את זה עם ref, React לעולם לא יעבד מחדש את הרכיב, כך שלעולם לא תראה את הספירה משתנה! ראה כיצד לחיצה על כפתור זה **לא מעדכנת את הטקסט שלו**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

זו הסיבה שקריאת `ref.current` במהלך העיבוד מובילה לקוד לא אמין. אם אתה צריך את זה, use state במקום זאת.

<DeepDive>

#### איך useRef עובד בפנים? {/*how-does-use-ref-work-inside*/}

למרות שגם `useState` וגם `useRef` מסופקים על ידי React, באופן עקרוני ניתן ליישם את `useRef` _על גבי_ `useState`. אתה יכול לדמיין שבתוך React, `useRef` מיושם כך:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

במהלך העיבוד הראשון, `useRef` מחזיר `{ current: initialValue }`. אובייקט זה מאוחסן על ידי React, כך שבמהלך העיבוד הבא אותו אובייקט יוחזר. שימו לב כיצד מגדיר state אינוused בדוגמה זו. זה מיותר כי use `useRef` תמיד צריך להחזיר את אותו אובייקט!

React מספק גרסה מובנית של `useRef` כי use היא נפוצה מספיק בפועל. אבל אתה יכול לחשוב על זה כעל משתנה state רגיל ללא מגדיר. אם אתה מכיר תכנות מונחה עצמים, refs עשוי להזכיר לך שדות מופע - אבל במקום `this.something` אתה כותב `somethingRef.current`.

</DeepDive>

## מתי use שופטים {/*when-to-use-refs*/}

בדרך כלל, אתה use ref כאשר הרכיב שלך צריך "לצאת החוצה" React ולתקשר עם APIs חיצוניים - לעתים קרובות דפדפן API שלא ישפיע על המראה של הרכיב. הנה כמה מהמצבים הנדירים האלה:

- אחסון [מזהי זמן קצוב](https://developer.mozilla.org/docs/Web/API/setTimeout)
- אחסון ומניפולציה של [DOM אלמנטים](https://developer.mozilla.org/docs/Web/API/Element), שאנו מכסים ב[עמוד הבא](/learn/manipulating-the-dom-with-refs)
- אחסון אובייקטים אחרים שאינם נחוצים לחישוב ה-JSX.

אם הרכיב שלך צריך לאחסן ערך מסוים, אבל זה לא משפיע על הלוגיקה של העיבוד, בחר refs.

## שיטות עבודה מומלצות לשופטים {/*best-practices-for-refs*/}

ביצוע העקרונות האלה יהפוך את הרכיבים שלך לצפויים יותר:

- **תייחסו ל-Refs כאל פתח מילוט.** Refs הם useמלאים כאשר אתם עובדים עם מערכות חיצוניות או דפדפן APIs. אם חלק גדול מהלוגיקת היישום ומזרימת הנתונים שלך מסתמכים על המלצות, אולי תרצה לחשוב מחדש על הגישה שלך.
- **אל תקרא או תכתוב `ref.current` במהלך העיבוד.** אם יש צורך במידע כלשהו במהלך העיבוד, use [state](/learn/state-a-components-memory) במקום זאת. מכיוון שReact אינו יודע מתי `ref.current` משתנה, אפילו קריאתו תוך כדי רינדור מקשה על חיזוי ההתנהגות של הרכיב שלך. (החריג היחיד לכך הוא קוד כמו `if (!ref.current) ref.current = new Thing()` שקובע את השופט פעם אחת בלבד במהלך העיבוד הראשון.)

המגבלות של React state לא חלות על שופטים. לדוגמה, state פועל כמו [תמונת מצב עבור כל עיבוד](/learn/state-as-a-snapshot) ו[לא מתעדכן באופן סינכרוני.](/learn/queueing-a-series-of-state-updates) אבל כאשר אתה משנה את הערך הנוכחי של:

```js
ref.current = 5;
console.log(ref.current); // 5
```

זה בגלל use **השופט עצמו הוא אובייקט JavaScript רגיל,** ולכן הוא מתנהג כמו אחד.

אתה גם לא צריך לדאוג לגבי [הימנעות ממוטציה](/learn/updating-objects-in-state) כשאתה עובד עם ר'. כל עוד האובייקט שאתה עושה מוטציה אינו used לעיבוד, ל-React לא אכפת מה אתה עושה עם ה-ref או התוכן שלו.

## השופטים וה-DOM {/*refs-and-the-dom*/}

אתה יכול להצביע על כל ערך. עם זאת, המקרה הנפוץ ביותר של use עבור ref הוא גישה לאלמנט DOM. לדוגמה, זה שימושי אם ברצונך למקד קלט באופן פרוגרמטי. כאשר אתה מעביר רפר למאפיין `ref` ב-JSX, כמו `<div ref={myRef}>`, React יכניס את האלמנט DOM התואם לתוך `myRef.current`. ברגע שהרכיב יוסר מה-DOM, React יעדכן את `myRef.current` להיות `null`. אתה יכול לקרוא עוד על זה ב-[מניפולציה של DOM עם Refs.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Refs הם פתח מילוט כדי להחזיק בערכים שאינם used לעיבוד. לא תזדקק להם לעתים קרובות.
- ref הוא אובייקט JavaScript רגיל עם מאפיין יחיד בשם `current`, אותו ניתן לקרוא או להגדיר.
- אתה יכול לבקש מ-React לתת לך שו"ת על ידי התקשרות ל-`useRef` Hook.
- כמו state, שופטים מאפשרים לך לשמור מידע בין עיבוד מחדש של רכיב.
- שלא כמו state, הגדרת הערך `current` של השופט לא מפעילה עיבוד מחדש.
- אין לקרוא או לכתוב `ref.current` במהלך העיבוד. זה הופך את הרכיב שלך לקשה לחזות.

</Recap>



<Challenges>

#### תקן קלט צ'אט שבור {/*fix-a-broken-chat-input*/}

הקלד הודעה ולחץ על "שלח". תבחין שיש עיכוב של שלוש שניות לפני שתראה את ההודעה "נשלח!" עֵרָנִי. במהלך עיכוב זה, אתה יכול לראות כפתור "בטל". לחץ עליו. כפתור ה"בטל" הזה אמור לעצור את ה"נשלח!" הודעה מלהופיע. הוא עושה זאת על ידי קריאה ל-[`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) עבור מזהה הזמן הקצוב שנשמר במהלך `handleSend`. עם זאת, גם לאחר לחיצה על "בטל", ההודעה "נשלח!" עדיין מופיעה. מצא מדוע זה לא עובד ותקן את זה.

<Hint>

משתנים רגילים כמו `let timeoutID` לא "שורדים" בין רינדורים מחדש מכיוון שכל רינדור מריץ את הרכיב שלך (ומאתחל את המשתנים שלו) מאפס. האם לשמור את מזהה הזמן הקצוב במקום אחר?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

בכל פעם שהרכיב שלך מעבד מחדש (כגון כשאתה מגדיר state), כל המשתנים המקומיים מאותחלים מאפס. זו הסיבה שאינך יכול לשמור את מזהה הזמן הקצוב במשתנה מקומי כמו `timeoutID` ולאחר מכן לצפות שמטפל אחר באירועים "יראה" אותו בעתיד. במקום זאת, אחסן אותו ב-ref, אשר React ישמר בין עיבוד.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### תקן רכיב שנכשל בעיבוד מחדש {/*fix-a-component-failing-to-re-render*/}

כפתור זה אמור לעבור בין הצגת "מופעל" ו"כבוי". עם זאת, זה תמיד מציג "כבוי". מה רע בקוד הזה? תקן את זה.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

בדוגמה זו, הערך הנוכחי של ref הוא used כדי לחשב את פלט העיבוד: `{isOnRef.current ? 'On' : 'Off'}`. זהו סימן שהמידע הזה לא צריך להיות ב-Ref, ובמקום זאת היה צריך להכניס אותו ל-state. כדי לתקן את זה, הסר את ה-ref ו-use state במקום זאת:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### תקן את ההקפצה {/*fix-debouncing*/}

בדוגמה זו, כל המטפלים בלחיצה על הלחצנים הם ["מוחזרים".](https://redd.one/blog/debounce-vs-throttle) כדי לראות מה זה אומר, לחץ על אחד מהלחצנים. שימו לב כיצד ההודעה מופיעה שנייה לאחר מכן. אם תלחצו על הלחצן בזמן ההמתנה להודעה, הטיימר יתאפס. כך שאם תמשיך ללחוץ על אותו כפתור מהר פעמים רבות, ההודעה לא תופיע עד שנייה *אחרי* שתפסיק לבטל את פעולת הלחיצה. user "מפסיק לעשות דברים".

הדוגמה הזו עובדת, אבל לא בדיוק כפי שהתכוונו. הכפתורים אינם עצמאיים. כדי לראות את הבעיה, לחץ על אחד הכפתורים, ולאחר מכן לחץ מיד על כפתור אחר. אתה מצפה שאחרי עיכוב, תראה את ההודעות של שני הכפתורים. אבל רק ההודעה של הכפתור האחרון מופיעה. ההודעה של הכפתור הראשון הולכת לאיבוד.

למה הכפתורים מפריעים זה לזה? מצא ותקן את הבעיה.

<Hint>

משתנה מזהה הזמן הקצוב האחרון משותף בין כל רכיבי `DebouncedButton`. זו הסיבה שלחיצה על כפתור אחד מאפסת את הזמן הקצוב של כפתור אחר. האם אתה יכול לאחסן מזהה פסק זמן נפרד עבור כל כפתור?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

משתנה כמו `timeoutID` משותף בין כל הרכיבים. זו הסיבה שלחיצה על הכפתור השני מאפסת את פסק הזמן הממתין של הכפתור הראשון. כדי לתקן זאת, אתה יכול לשמור פסק זמן ב-Ref. כל כפתור יקבל רפ משלו, כך שהם לא יתנגשו זה בזה. שימו לב כיצד לחיצה מהירה על שני כפתורים תציג את שתי ההודעות.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### קרא את ה-state העדכני ביותר {/*read-the-latest-state*/}

בדוגמה זו, לאחר הלחיצה על "שלח", יש עיכוב קטן לפני הצגת ההודעה. הקלד "שלום", הקש על שלח ולאחר מכן ערוך שוב את הקלט במהירות. למרות העריכות שלך, ההתראה עדיין תציג "שלום" (שהיה הערך של state [בזמנו](/learn/state-as-a-snapshot#state-לאורך זמן) הלחצן נלחץ).

בדרך כלל, התנהגות זו היא מה שאתה רוצה באפליקציה. עם זאת, ייתכנו מקרים מזדמנים שבהם אתה רוצה קוד אסינכרוני כלשהו כדי לקרוא את הגרסה *האחרונה* של state. האם אתה יכול לחשוב על דרך לגרום להתראה להציג את טקסט הקלט *נוכחי* ולא את מה שהיה בזמן הקליק?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

מצב עובד [כמו תמונת מצב](/learn/state-as-a-snapshot), כך שאינך יכול לקרוא את ה-state האחרון מפעולה אסינכרונית כמו פסק זמן. עם זאת, אתה יכול לשמור את טקסט הקלט העדכני ביותר ב-ref. Ref ניתן לשינוי, כך שתוכל לקרוא את המאפיין `current` בכל עת. מכיוון שהטקסט הנוכחי הוא גם used לעיבוד, בדוגמה זו, תזדקק ל-*גם* משתנה state (לעיבוד), *ו* ref (כדי לקרוא אותו בזמן הקצוב). יהיה עליך לעדכן את ערך ה-Ref הנוכחי באופן ידני.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
