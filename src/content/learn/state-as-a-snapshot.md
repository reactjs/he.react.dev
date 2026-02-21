---
title: "state כ-תמונת מצב"
---

<Intro>

משתני מצב להיראות כמו משתני JavaScript רגילים. עם זאת, הstate מתנת יותר כמו תמונת מצב. הגדר את זה לא משנה את השינוי הstate יש לך, אלא מפעילה עיבוד מחדש.

</Intro>

<YouWillLearn>

* איך הגדרת מצב מפעילה עיבוד מחדש
* מתי וכיצד עדכוני הstate
*למה הstate לא מתעדכנת מיד לאחר הגדרתו
* איך רופא אירועים ניגשים ל"תמונה מצב" של הstate

</YouWillLearn>

## הגדרת מצב מפעילים מעבד {/*setting-state-triggers-renders*/}

אתה עשוי לחשוב על ממשק המשתמש שלך כדי לקבוע את התגובה לאירוע משתמש כמו קליק. ב-React, זה עובד קצת אחרת מהמודל המנטלי הזה. בעמוד הקודם, ראית ש[ הגדרה מצב מבקשת עיבוד מחדש](/learn/render-and-commit#step-1-trigger-a-render) מ-React. זה שכדי שממשק יגיב לאירוע, צריך *לעדכן את הstate*.

בדוגמה זו, כאשר אתה לוחץ על "שלח", `setIsSent(true)` אומר ל-React לעבד מחדש את ממשק המשתמש:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

זה מה שקורה כשאתה לוחץ על הכפתור:

1. המטפל באירוע 'onSubmit' מבצע.
2. `setIsSent(true)` מגדיר את `isSent` ל-`true` ומעמיד בתור עיבוד חדש.
3. React מעבד מחדש את הרכיב לערך 'isSent' החדש.

בואו נסתכל מקרוב על הקשר בין מצב לעיבוד.

## העיבוד מצלם תמונת מצב בזמן {/*העיבוד-לוקח-תמונת-מצב-בזמן*/}

["עיבוד"](/learn/render-and-commit#step-2-react-renders-your-components) פירושו ש-React קורא לרכיב שלך, שהוא פונקציה. ה-JSX שאתה מחזיר מהפונקציה הזו הוא כמו תמונת מצב של ממשק המשתמש בזמן. הprops, רופאי המומחים והמשתנים המקומיים חושבים כולם **באמצעות מצבו בזמן העיבוד.**

שלא כמו תמונה או פריים של סרט, "תמונה הstate" של ממשק המשתמש שאתה מחזיר הוא אינטראקטיבי. זה כולל לוגיקה כמו מטפלי אירועים שמציינים מה קורה בתגובה לקלט. React מעדכנת את המסך כך שיתאים לתמונה מצב זו ומחברת את המטפלים. כתוצאה מכך, לחיצה על כפתור תפעיל את הרופא הקליקים מה-JSX שלך.

כאשר React מעבד מחדש רכיב:

1. React קורא לפונקציה שלך שוב.
2. הפונקציה שלך מחזירה תמונת מצב חדשה של JSX.
3. React מעדכן את המסך כך שיתאים לתמונה הstate שהפונקציה שלך החזירה.

<IllustrationBlock sequential>
    <Illustration caption="React executing the function" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calculating the snapshot" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Updating the DOM tree" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

זיכרון של משתנה רכיב, מצב אינו כמו רגיל דיווחים לאחר החזרה של הפונקציה שלך. הstate למעשה "חיה" ב-React עצמה - כאילו על הדף! - מחוץ לתפקידך. כאשר React קורא לרכיב שלך, הוא נותן לך תמונת מצב של העיבוד המסוים הזה. הרכיב שלך מחזיר מצב של ממשק משתמש עם קבוצה חדשה של props ומטפל אירועים ב-JSX שלו, כולם מחושבים **באמצעות ערכי הstate מהעיבוד הזה!**

<IllustrationBlock sequential>
  <Illustration caption="You tell React to update the state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React updates the state value" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passes a snapshot of the state value into the component" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

הנה ניסוי קטן כדי להראות לך איך זה עובד. בדוגמה זו, אתה עשוי למצוא שלחיצה על כור "+3" תגדיל את המונה שלוש פעמים שהוא קורא ל'setNumber(מספר + 1)' שלוש פעמים.

ראה מה קורה כשאתה לוחץ על כפתור "+3":

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

שימו לב ש'מספר' עולה רק פעם אחת בכל קליק!

**מצב המשנה את זה רק עבור העיבוד *הבא*.** לאחר העיבוד הראשון, 'מספר' היה '0'. זה מה, ברופא`onClick` של *הרינדור הזה, הערך של `number` עדיין `0` גם לאחר שנקרא `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

הנה מה שרופא הלחיצה של הכפתור הזה ל-React אומר:

1. `setNumber(number + 1)`: `number` הוא `0`הוא `setNumber(0 + 1)`.
    - React מתכונן את 'מספר' ל-'1' בעיבוד הבא.
2. `setNumber(number + 1)`: `number` הוא `0`הוא `setNumber(0 + 1)`.
    - React מתכונן את 'מספר' ל-'1' בעיבוד הבא.
3. `setNumber(number + 1)`: `number` הוא `0`הוא `setNumber(0 + 1)`.
    - React מתכונן לשנות את 'מספר' ל-'1' בעיבוד הבא.

למרות שקראת 'setNumber(number + 1)' שלוש פעמים, בטיפולים של *העיבוד הזה* הוא תמיד '0', אז אתה מגדיר את הstate ל-'1' שלוש פעמים. זה מה שאחרי המטפל באירועים שלך מסיים, React מעבד מחדש את הרכיב עם 'מספר' שווה ל-'1' במקום '3'.

אתה יכול גם לדמיין זאת על ידי החלפה מנטלי של שני מצב עם הערכים שלהם בקוד שלך. מה שמשתנה הstate 'מספר' הוא '0' עבור *עיבוד הזה*, רופא מטפלים שלו נראה כך:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

עבור העיבוד הבא, `מספר` הוא `1`, כך שמטפל הקליקים של *העיבוד* הזה נראה כך:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

זו הסיבה שלחיצה נוספת על הכפתור תגדיר את המונה ל-'2', ואז ל-'3' בלחיצה הבאה, וכן הלאה.

## מצב לאורך זמן {/*מצב-על-זמן*/}

ובכן, זה היה כיף. נסה לנחש מה תתריע לחיצה על הכפתור הזה:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

אם אתה משתמש בשיטת ההחלפה מקודם, אתה יכול לנחש שההתראה מציגה "0":

```js
setNumber(0 + 5);
alert(0);
```

אבל מה אם תכניס טיימר להתראה, אז הוא יופעל רק _לאחר_ שהרכיב יוצג מחדש? האם יהיה כתוב "0" או "5"? יש לנחש!

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

מוּפתָע? אם אתה משתמש בשיטת ההחלפה, אתה יכול לראות את "תמונה הstate" של הstate שהועברה להתראה.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

ייתכן שstate המאוחסן ב-React השתנה עד למועד הפעלת ההתראה, אבל זה תוכנן באמצעות תמונת מצב של הstate בזמן שהמשתמש קיים אינטראקציה!

**הערך של שינוי מצב לעולם לא משתנה בתוך רינדור,** גם אם הקוד של רופא הרופאים שלו הוא אסינכרוני. בתוך `onClick` של *העיבוד*, הערך של `number` ממשיך להיות `0` גם לאחר שנקרא `setNumber(number + 5)`. הערך שלו "תוקן" כאשר React "לקח את תמונת הstate" של ממשק משתמש על ידי קריאה לרכיב שלך.

הנה דוגמה לאופן שבו זה גורם למטפלי האירועים שלך להיות פחות מועדים לטעויות תזמון. להלן טופס ששולח הודעה באיחור של חמש שניות. דמיינו את התרחיש הזה:

1. אתה לוחץ על כפתור "שלח", שולח "שלום" לאליס.
2. לפני שהשהייה של חמש שניות מסתיימת, אתה משנה את הערך של השדה "To" ל-"Bob".

מה אתה מצפה שה'התראה' תציג? האם זה יציג, "אמרת שלום לאליס"? או שהוא יציג, "אמרת שלום לבוב"? עשה ניחוש על סמך מה שאתה יודע, ואז נסה את זה:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React שומר על ערכי הstateקבועים" בתוך "רופאי קודים של רינדור אחד.** אינך צריך לדאוג אם הstate השתנה בזמן שהפעיל.

אבל מה אם תרצה לקרוא את הstate האחרון לפני עיבוד מחדש? תרצה להשתמש ב[פונקציית עדכון מצב](/learn/queueing-a-series-of-state-updates), המכוסה בעמוד הבא!

<Recap>

* הגדרת מצב מבקשת עיבוד חדש.
* חנויות מצב React מחוץ לרכיב שלך, כאילו על הדף.
* כאשר אתה קורא 'useState', React נותן לך תמונת מצב של הstate *עבור העיבוד הזה*.
* משתנים ומטפלי אירועים אינם "שורדים" עיבוד מחדש. לכל עיבוד יש מטפלי אירועים משלו.
* כל עיבוד (ומתפקד בתוכו) תמיד "יראה" את תמונת הstate של React נתנה לעיבוד *זה*.
* אתה יכול להחליף מצב נפשית במטפלי אירועים, בדומה לאופן שבו אתה חושב על ה-JSX המעובד.
* למטפלי אירועים עסקיים בעבר יש את ערכי הstate מה שבו הם נוצרו.

</Recap>



<Challenges>

#### יישם רמזור {/*יישם-רמזור*/}

להלן רכיב תאורה של מעבר חציה שמתחלף בעת לחיצה על הכפתור:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

הוסף 'התראה' למטפל בלחיצה. כאשר האור ירוק ואומר "הליכה", לחיצה על הכפתור אמורה לומר "עצירה היא הבאה". כאשר האור אדום ואומר "עצור", לחיצה על הכפתור אמורה לומר "הליכה היא הבאה".

האם זה משנה אם אתה שם את 'התראה' לפני או אחרי שיחת 'setWalk'?

<Solution>

ה'התראה' שלך צריכה להיראות כך:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

אם אתה שם את זה לפני או אחרי שיחת `setWalk` לא משנה. הערך 'הליכה' של העיבוד הזה קבוע. קריאה ל-'setWalk' תשנה אותו רק עבור העיבוד *הבא*, אבל לא תשפיע על מטפלים מהעיבוד הקודם.

השורה הזו עשויה להיראות מנוגדת לאינטואיציה בהתחלה:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

אבל זה הגיוני אם אתה קורא את זה כך: "אם הרמזור מראה 'ללכת עכשיו', ההודעה אמורה לומר 'העצור זה הבא'." המשתנה 'הליכה' בתוך מטפל האירועים שלך תואם את הערך של העיבוד הזה של 'הליכה' ואינו משתנה.

אתה יכול לוודא שזה נכון על ידי יישום שיטת ההחלפה. כאשר 'הליכה' הוא 'נכון', אתה מקבל:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

אז לחיצה על "שנה לעצירה" מעמידה בתור עיבוד עם 'הליכה' מוגדרת ל'שקר', ומתריעה על "העצירה היא הבאה".

</Solution>

</Challenges>

