---
title: "תור של עדכוני state"
---

<Intro>

הגדרת משתנה מצב תעמיד עיבוד נוסף לפי. אבל לפעמים אולי תרצה לבצע מספר פעולות על הערך לפני עמידה בתור לעיבוד הבא. כדי לעשות זאת, זה עוזר להבין איך להגיב מקבץ עדכוני מצב.

</Intro>

<YouWillLearn>

* מה זה "אצווה" וכיצד React משתמשת בו כדי לעבוד עדכוני מצב מרובים
* כיצד להחיל מספר עדכונים על אותו משתנה מצב ברצף

</YouWillLearn>

## עדכוני מצב React קבוצות {/*react-batches-state-updates*/}

אתה עשוי לצפות שלחיצה על כפתור "+3" תגדיל את המונה שלוש פעמים שבו הוא קורא ל'setumber(number + 1)' שלוש פעמים:

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

עם זאת, כפי שהם אולי זוכרים מהסעיף הקודם, [ערכי הstate של כל רינדור קבועים](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), כך שהערך של `number` בתוך הרופאים של לא משנהדור הוא תמיד תקרא `0`: כמה פעמים הראשון(1):

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

אבל יש כאן גורם נוסף שמשחק. **הגיב ממתין עד ש*כל* הקוד רופאי מומחי יפעל לפני עיבוד עדכוני הstate שלך.** זו הסיבה שהעיבוד מחדש יתרחש רק *אחרי* כל הריאות של `setNumber()` הללו.

זה עשוי להזכיר לך מלצר שמקבל הזמנה במסעדה. מלצר לא רץ למטבח עם אזכור המנה הראשונה שלך! במקום זאת, הם מאפשרים לך לסיים את ההזמנה שלך, מאפשרים לך לבצע בה שינויים, ואפילו לקבל הזמנות מאנשים אחרים ליד השולחן.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

זה אפשרי לעדכן מספר משתני מצב לך - אפילו מספר רכיבים - פשוט להפעיל יותר מדי [עיבודים חוזרים.](/learn/render-and-commit#re-renders-when-state-updates) אבל זה גם אומר שממשק לא יתעדכן עד ש_אחרי_ המטפל באירוע שלך, וכל קוד בו, יס. התנהגות זו, המכונה גם **אצווה,** גורמת לאפליקציית. זה גם נמנע מהחציות עם עיבודים "גמורים" מבלבלים רק חלק מהמשתנים עודכנו.

**React אינו מתארך באירועים מכוונים *מרובים* כמו קליקים**-כל קליק מטופל בנפרד. היה סמוך ובטוח ש-React עושה אצווה רק כאשר זה בטוח בדרך כלל. זה מבטיח, למשל, אם הלחיצה הראשונה על הלחצן מבטלת טופס, הלחיצה השנייה לא תשלח אותו שוב.

## עדכון אותו מצב מספר פעמים לפני העיבוד הבא {/*עדכון-אותו-מצב-מספר-פעמים-לפני-העיבוד-הבא*/}

זהו מקרה שימוש לא נפוץ, אבל אם תרצה לעדכן את הstate מספר פעמים לפני העיבוד הבא, במקום להעביר את הstate הבא* כמו `setNumber(מספר + 1)`, אתה יכול להעביר *פונקציה* שמח שבת את הstate הבא על הstate הקודם, כמו `setNumber(n => n + 1). זה דרך לומר ל-React "ששות משהו עם ערך הstate" במקום פשוט להחליף אותו.

נסה להגדיל את המונה כעת:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
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

כאן, `n => n + 1` נקראת **פונקציית עדכון.** כאשר אתה מעביר אותה לקובע מצב:

1. תורי תגובה פונקציה זו לעיבוד לאחר הפעלת כל הקוד האחר במטפל.
2. המשך העיבוד, תגובה עוברת על התורנות לך את הstate המעודכן הסופי.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

כך פועלת React דרך שורות הקוד הללו בזמן ביצוע המטפל באירועים:

1. `setNumber(n => n + 1)`: `n => n + 1` היא פונקציה. תגיב מוסיף אותו לתור.
1. `setNumber(n => n + 1)`: `n => n + 1` היא פונקציה. תגיב מוסיף אותו לתור.
1. `setNumber(n => n + 1)`: `n => n + 1` היא פונקציה. תגיב מוסיף אותו לתור.

כאשר אתה קורא 'useState' על העיבוד הבא, תגובה עוברת בתור. מצב ה'מספר' הקודם היה '0', אז זה מה ש-React מעבירה לפונקציית העדכון הראשון בהארגומנט 'n'. ואז להגיב לוקח את הערך ההחזרה של פונקציית העדכון הקודמת שלך ומעביר אותו לעדכון הבא בתור 'n', וכן הלאה:

|  עדכון בתור | `n` | מחזיר |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

הגיבו מאחסן '3' לפי התוצאה הסופית ומחזיר אותו מ-'useState'.

זו הסיבה שלחיצה על "+3" בדוגמה שלמעלה מעלה את הערך בצורה נכונה ב-3.
### מה קורה אם אתה מעדכן את הstate לאחר החלפתו {/*what-happens-if-you-update-state-after-replacing-it*/}

מה עם מטפל האירוע הזה? מה לדעתך יהיה 'מספר' בעיבוד הבא?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

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
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

מה שמטפל זה אומר ל-React לעשות:

1. `setNumber(number + 5)`: `number` הוא `0`, אז `setNumber(0 + 5)`. תגיב מוסיף את *"החלף ב-`5`"* לתור שלו.
2. `setNumber(n => n + 1)`: `n => n + 1` היא פונקציית עדכון. תגיב מוסיף את *הפונקציה הזו* לתור שלו.

על העיבוד הבא, תגובה עוברת דרך תור הstate:

|   עדכון בתור | `n` | מחזיר |
|--------------|---------|-----|
| "החלף ב-`5`" | `0` (לא בשימוש) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

הגיבו מאחסן '6' בתור התוצאה הסופית ומחזיר אותו מ-'useState'.

<Note>

יכול להיות ששמתם לב ש-'setState(5)' עובד למעשה כמו 'setState(n => 5)', אבל 'n' אינו בשימוש!

</Note>

### מה יקרה אם תחליף מצב לאחר עדכון שלו {/*what-happens-if-you-replace-state-after-updating-it*/}

בואו ננסה דוגמה נוספת. מה לדעתך יהיה 'מספר' בעיבוד הבא?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

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
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

כך פועלת React דרך שורות הקוד הללו בזמן ביצוע המטפל באירועים:

1. `setNumber(number + 5)`: `number` הוא `0`, אז `setNumber(0 + 5)`. תגיב מוסיף את *"החלף ב-`5`"* לתור שלו.
2. `setNumber(n => n + 1)`: `n => n + 1` היא פונקציית עדכון. תגיב מוסיף את *הפונקציה הזו* לתור שלו.
3. `setNumber(42)`: הגיבו מוסיף את *"החלף ב`42`"* לתור שלו.

על העיבוד הבא, תגובה עוברת דרך תור הstate:

|   עדכון בתור | `n` | מחזיר |
|--------------|---------|-----|
| "החלף ב-`5`" | `0` (לא בשימוש) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "החלף ב-`42`" | `6` (לא בשימוש) | `42` |

לאחר מכן, תגיב מאחסן את '42' בתור התוצאה הסופית ומחזיר אותו מ-'useState'.

לסיכום, הנה איך אתה יכול לחשוב על מה שאתה מעביר למגדיר הstate `setNumber`:

* **פונקציית עדכון** (למשל `n => n + 1`) מתווספת לתור.
* **כל ערך אחר** (למשל מספר `5`) מוסיף "החלף ב-`5`" לתור, תוך התעלמות ממה שכבר נמצא בתור.

לאחר השלמת המטפל באירועים, React תפעיל עיבוד מחדש. על העיבוד, תגיב תעבד את התור. פונקציות העדכון חייבות לפעול, אז **פונקציות העדכון יהיו [טהורות](/learn/keeping-components-pure)** ורק *להחזיר* את התוצאה. אל תנסה להגדיר מצב מתוכם או להפעיל לוואי. בstate קפדני, תגיב תריץ כל פונקציית עדכון פעמיים (אך תמחק את התוצאה השנייה) כדי לעזור לך למצוא טעויות.

### מוסכמות מתן שמות {/*מוסכמות-שמות*/}

מקובל לתת שם לארגומנט פונקציית העדכון באותיות הראשונות של ranking הstate המתאים:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

אם אתה מעדיף קוד מילולי יותר, מוסכמה נפוצה נוספת היא לחזור על שם ranking הstate המלאה, כמו `setEnabled(enabled => !enabled)`, או להשתמש בקידומת כמו `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* מצב ההגדרה אינו משנה את המשתנה בעיבוד הקיים, אך הוא מבקש עיבוד חדש.
* React מעבד עדכוני מצב לאחר מטפל אירועים סיימו לפעול. זה נקרא אצווה.
* כדי לעדכן מצב מספר פעמים באירוע אחד, אתה משתמש בפונקציית העדכון של `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### תקן מונה בקשות {/*fix-a-request-counter*/}

אתה עובד על אפליקציית Art Marketplace המאפשרת למשתמש לשלוח מספר הזמנות לפריט אמנות בו זמנית. בכל פעם שהמשתמש לוחץ על כפתור ה"קנה", מונה ה"ממתין" אמור לגדול באחד. לאחר שלוש שניות, המונה "בהמתנה" אמור לרדת, והמונה "הסתיים" אמור לעלות.

עם זאת, מונה "בהמתנה" אינו מתנהג כמתוכנן. כאשר אתה לוחץ על "קנה", הוא יורד ל-1-(מה שלא אמור להיות אפשרי!). ואם אתה לוחץ מהר פעמיים, נראה ששני המונים מתנהגים בצורה בלתי צפויה.

למה זה קורה? תקן את שני המונים.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

בתוך המטפל באירוע `handleClick`, הערכים של `pending` ו`completed` תואמים למה שהם היו בזמן אירוע הקליק. עבור העיבוד הראשון, `pending` היה `0`, אז `setPending(pending - 1)` יוצר להיות `setPending(-1)`, וזה שגוי. מה שאתה רוצה *להגדיל* או *להקטין* את המונים, במקום להגדיר אותם לערך קונקרטי שנקבע הקליק, אתה יכול להעביר את הפונקציות העדכון:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

זה מבטיח שכאשר אתה מגדיל או מקטין מונה, אתה עושה זאת לstate *האחרון* שלו ולא לstate שהיה בזמן הקליק.

</Solution>

#### יישם את תור הstate בעצמך {/*יישם-את-ה-state-queue-yourself*/}

באתגר הזה, יש ליישם מחדש חלק זעיר של React מאפס! זה לא קשה כמו שזה נשמע.

גלול דרך התצוגה המקדימה של ארגז החול. שימו לב שהוא מציג **ארבעה מקרי בדיקה.** הם תואמים לדוגמאות שראיתם קודם לכן בדף זה. המשימה שלך היא ליישם את הפונקציה 'getFinalState' כך שהיא תחזיר את התוצאה הנכונה עבור כל אחד מהמקרים הללו. אם אתה שם את זה נכון, כל ארבעת המבחנים אמורים לעבור.

תקבלו שני ארגומנטים: `baseState` הוא הstate ההתחלה (כמו `0`), וה`תור` הוא מערך המכיל שילוב של מספרים (כמו `5`) עדכון ופונקציות (כמו `n => n + 1`) לפי סדר הוספתם.

המשימה היא שלך להחזיר את הstate הסופי, בדיוק כמו שהטבלאות בדף זה מציגות!

<Hint>

אם אתה מרגיש תקוע, התחל עם מבנה הקוד הזה:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

מלא את השורות החסרות!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

זהו האלגוריתם המדויק המתואר בדף זה שבו משתמשת הגיבו כדי לחשב את הstate הסופי:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

עכשיו אתה יודע איך החלק הזה של React עבודה!

</Solution>

</Challenges>
