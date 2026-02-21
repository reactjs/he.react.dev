---
title: "useState"
---

<Intro>

`useState` הוא React Hook המאפשר לך להוסיף משתנה [state](/learn/state-a-components-memory) לרכיב שלך.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useState(initialState)` {/*usestate*/}

התקשר ל-`useState` ברמה העליונה של הרכיב שלך כדי להכריז על משתנה [state.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

המוסכמה היא לתת שם למשתנים state כמו `[something, setSomething]` באמצעות [הרס מערך.](https://javascript.info/destructuring-assignment)

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `initialState`: הערך שאתה רוצה שה-state יהיה בהתחלה. זה יכול להיות ערך מכל סוג, אבל יש התנהגות מיוחדת לפונקציות. טענה זו מתעלמת לאחר העיבוד הראשוני.
  * אם תעביר פונקציה בתור `initialState`, היא תטופל כאל _פונקציית התחלה_. זה צריך להיות טהור, לא צריך לקחת טיעונים, וצריך להחזיר ערך מכל סוג שהוא. React יקרא לפונקציית האתחול שלך בעת אתחול הרכיב, ויאחסן את ערך ההחזר שלו כ-state הראשוני. [ראה דוגמה למטה.](#avoiding-recreating-the-initial-state)

#### מחזירה {/*returns*/}

`useState` מחזיר מערך עם שני ערכים בדיוק:

1. ה-state הנוכחי. במהלך העיבוד הראשון, הוא יתאים ל-`initialState` שעברת.
2. הפונקציה [`set`](#setstate) המאפשרת לך לעדכן את ה-state לערך אחר ולהפעיל עיבוד מחדש.

#### אזהרות {/*caveats*/}

* `useState` הוא Hook, אז אתה יכול לקרוא לו רק **ברמה העליונה של הרכיב שלך** או Hooks משלך. אתה לא יכול לקרוא לזה בתוך לולאות או תנאים. אם אתה צריך את זה, חלץ רכיב חדש והעביר את ה-state לתוכו.
* במצב קפדני, React **יתקשר לפונקציית האתחול שלך פעמיים** ​​כדי [לעזור לך למצוא זיהומים מקריים.](#my-initializer-or-updater-function-runs-twice) זוהי התנהגות לפיתוח בלבד ואינה משפיעה על הייצור. אם פונקציית האתחול שלך טהורה (כפי שהיא צריכה להיות), זה לא אמור להשפיע על ההתנהגות. התוצאה מאחת השיחות תתעלם.

---

### פונקציות `set`, כמו `setSomething(nextState)` {/*setstate*/}

הפונקציה `set` המוחזרת על ידי `useState` מאפשרת לך לעדכן את ה-state לערך אחר ולהפעיל עיבוד מחדש. אתה יכול להעביר את ה-state הבא ישירות, או פונקציה שמחשבת אותו מה-state הקודם:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### פרמטרים {/*setstate-parameters*/}

* `nextState`: הערך שאתה רוצה שה-state יהיה. זה יכול להיות ערך מכל סוג, אבל יש התנהגות מיוחדת לפונקציות.
  * אם תעביר פונקציה בתור `nextState`, היא תטופל כאל _פונקציית עדכון_. זה חייב להיות טהור, צריך לקחת את ה-state הממתין כארגומנט היחיד שלו, ועליו להחזיר את ה-state הבא. React ישים את פונקציית העדכון שלך בתור ותעבד מחדש את הרכיב שלך. במהלך העיבוד הבא, React יחשב את ה-state הבא על ידי החלת כל העדכונים בתור על ה-state הקודם. [ראה דוגמה למטה.](#updating-state-based-on-the-previous-state)

#### מחזירה {/*setstate-returns*/}

לפונקציות `set` אין ערך החזרה.

#### אזהרות {/*setstate-caveats*/}

* הפונקציה `set` **מעדכנת רק את המשתנה state עבור העיבוד *הבא***. אם תקרא את המשתנה state לאחר קריאה לפונקציה `set`, [אתה עדיין תקבל את הערך הישן](#ive-updated-the-state-but-logging-gives-me-the-old-value) שהיה על המסך לפני השיחה שלך.

* אם הערך החדש שתספק זהה ל-`state` הנוכחי, כפי שנקבע על ידי [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) השוואה, React **ידלג על עיבוד מחדש של הרכיב והילדים שלו.** זוהי אופטימיזציה. למרות שבמקרים מסוימים ייתכן שReact יצטרך להשפיע על הקוד לפני שהקוד ישפיע.

* React [אצות state עדכונים.](/learn/queueing-a-series-of-state-updates) הוא מעדכן את המסך **לאחר שכל מטפלי האירועים פעלו** וקראו לפונקציות `set` שלהם. זה מונע רינדורים חוזרים מרובים במהלך אירוע בודד. במקרה הנדיר שאתה צריך לאלץ את React לעדכן את המסך מוקדם יותר, למשל כדי לגשת ל-DOM, אתה יכול use [`flushSync`.](/reference/react-dom/flushSync)

* קריאה לפונקציה `set` *במהלך העיבוד* מותרת רק מתוך רכיב העיבוד הנוכחי. React ימחק את הפלט שלו וינסה מיד לעבד אותו שוב עם ה-state החדש. דפוס זה נדרש רק לעתים רחוקות, אך אתה יכול use אותו כדי **לשמור מידע מהעיבודים הקודמים**. [ראה דוגמה למטה.](#storing-information-from-previous-renders)

* במצב קפדני, React **תתקשר לפונקציית העדכון שלך פעמיים** ​​כדי [לעזור לך למצוא זיהומים מקריים.](#my-initializer-or-updater-function-runs-twice) זוהי התנהגות לפיתוח בלבד ואינה משפיעה על הייצור. אם פונקציית העדכון שלך טהורה (כפי שהיא צריכה להיות), זה לא אמור להשפיע על ההתנהגות. התוצאה מאחת השיחות תתעלם.

---

## שימוש {/*usage*/}

### הוספת state לרכיב {/*adding-state-to-a-component*/}

התקשר ל-`useState` ברמה העליונה של הרכיב שלך כדי להכריז על אחד או יותר משתני [state.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

המוסכמה היא לתת שם למשתנים state כמו `[something, setSomething]` באמצעות [הרס מערך.](https://javascript.info/destructuring-assignment)

`useState` מחזיר מערך עם שני פריטים בדיוק:

1. <CodeStep step={1}>הנוכחי state</CodeStep> של משתנה state זה, מוגדר תחילה ל-<CodeStep step={3}>state</CodeStep> הראשוני שסיפקת.
2. הפונקציה <CodeStep step={2}>`set`</CodeStep> המאפשרת לך לשנות אותה לכל ערך אחר בתגובה לאינטראקציה.

כדי לעדכן את מה שמופיע על המסך, קרא לפונקציה `set` עם state הבא:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React יאחסן את ה-state הבא, יעבד את הרכיב שלך שוב עם הערכים החדשים ויעדכן את ממשק המשתמש.

<Pitfall>

קריאה לפונקציה `set` [**לא** משנה את ה-state הנוכחי בקוד שכבר מבצע](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

זה משפיע רק על מה ש`useState` יחזיר החל מהעיבוד *הבא*.

</Pitfall>

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### מונה (מספר) {/*counter-number*/}

בדוגמה זו, המשתנה `count` state מכיל מספר. לחיצה על הכפתור מגדילה אותו.

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
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### שדה טקסט (מחרוזת) {/*text-field-string*/}

בדוגמה זו, המשתנה `text` state מכיל מחרוזת. כשאתה מקליד, `handleChange` קורא את ערך הקלט האחרון מאלמנט הקלט DOM בדפדפן, וקורא ל-`setText` כדי לעדכן את ה-state. זה מאפשר לך להציג את ה-`text` הנוכחי למטה.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### תיבת סימון (בוליאנית) {/*checkbox-boolean*/}

בדוגמה זו, המשתנה `liked` state מחזיק בוליאני. כאשר אתה לוחץ על הקלט, `setLiked` מעדכן את המשתנה `liked` state אם קלט תיבת הסימון בדפדפן מסומן. המשתנה `liked` הוא used כדי להציג את הטקסט מתחת לתיבת הסימון.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### טופס (שני משתנים) {/*form-two-variables*/}

אתה יכול להכריז על יותר ממשתנה state אחד באותו רכיב. כל משתנה state הוא בלתי תלוי לחלוטין.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### עדכון state בהתבסס על state {/*updating-state-based-on-the-previous-state*/} הקודם

נניח שה-`age` הוא `42`. המטפל הזה קורא ל-`setAge(age + 1)` שלוש פעמים:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

עם זאת, לאחר לחיצה אחת, `age` יהיה רק ​​`43` ולא `45`! זה בגלל שuse קורא לפונקציה `set` [לא מתעדכנת](/learn/state-as-a-snapshot) למשתנה `age` state בקוד שכבר פועל. אז כל קריאת `setAge(age + 1)` הופכת ל-`setAge(43)`.

כדי לפתור בעיה זו, **תוכל להעביר *פונקציית עדכון*** ל-`setAge` במקום ל-state הבא:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

כאן, `a => a + 1` היא פונקציית העדכון שלך. זה לוקח את <CodeStep step={1}>בהמתנה state</CodeStep> ומחשב את <CodeStep step={2}>הבא state</CodeStep> ממנו.

React מכניס את פונקציות העדכון שלך ל-[תור.](/learn/queueing-a-series-of-state-updates) ואז, במהלך העיבוד הבא, הוא יקרא להם באותו סדר:

1. `a => a + 1` יקבל `42` כ-state הממתין ויחזיר את `43` כ-state הבא.
1. `a => a + 1` יקבל `43` כ-state הממתין ויחזיר את `44` כ-state הבא.
1. `a => a + 1` יקבל `44` כ-state הממתין ויחזיר את `45` כ-state הבא.

אין עדכונים אחרים בתור, אז React יאחסן `45` כ-state הנוכחי בסופו של דבר.

לפי המוסכמה, מקובל לתת שם לארגומנט הממתין state עבור האות הראשונה של שם המשתנה state, כמו `a` עבור `age`. עם זאת, אתה יכול גם לקרוא לזה כמו `prevAge` או משהו אחר שנראה לך ברור יותר.

React עשויה [להתקשר לעדכונים שלך פעמיים](#my-initializer-or-updater-function-runs-twice) בפיתוח כדי לוודא שהם [טהורים.](/learn/keeping-components-pure)

<DeepDive>

#### האם השימוש במעדכן תמיד מועדף? {/*is-using-an-updater-always-preferred*/}

ייתכן שתשמע המלצה לכתוב תמיד קוד כמו `setAge(a => a + 1)` אם ה-state שאתה מגדיר מחושב מה-state הקודם. אין בזה שום נזק, אבל זה גם לא תמיד הכרחי.

ברוב המקרים, אין הבדל בין שתי הגישות הללו. React תמיד מוודא שעבור פעולות user מכוונות, כמו קליקים, המשתנה `age` state יתעדכן לפני הקליק הבא. משמעות הדבר היא שאין סיכון שמטפל בלחיצות יראה `age` "מיושן" בתחילת המטפל באירועים.

עם זאת, אם אתה מבצע עדכונים מרובים באותו אירוע, עדכונים יכולים להיות מועילים. הם גם מועילים אם הגישה למשתנה state עצמו אינה נוחה (אתה עלול להיתקל בזה בעת אופטימיזציה של עיבוד מחדש).

אם אתה מעדיף עקביות על פני תחביר מעט יותר מילולי, סביר לכתוב תמיד עדכון אם ה-state שאתה מגדיר מחושב מה-state הקודם. אם זה מחושב מה-state הקודם של משתנה *אחר* state כלשהו, ​​אולי כדאי לשלב אותם לאובייקט אחד ו-[use למפחית.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="The difference between passing an updater and passing the next state directly" titleId="examples-updater">

#### העברת פונקציית העדכון {/*passing-the-updater-function*/}

דוגמה זו מעבירה את פונקציית העדכון, כך שכפתור "+3" עובד.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### העברת state הבא ישירות {/*passing-the-next-state-directly*/}

דוגמה זו **לא** עוברת את פונקציית העדכון, כך שכפתור "+3" **לא עובד כמתוכנן**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### עדכון אובייקטים ומערכים ב-state {/*updating-objects-and-arrays-in-state*/}

אתה יכול לשים אובייקטים ומערכים לתוך state. ב-React, state נחשב לקריאה בלבד, אז **עליך *להחליף* אותו במקום *לשנות* את האובייקטים הקיימים שלך**. לדוגמה, אם יש לך אובייקט `form` ב-state, אל תשנה אותו:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

במקום זאת, החלף את כל האובייקט על ידי יצירת אחד חדש:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

קרא את [עדכון אובייקטים ב-state](/learn/updating-objects-in-state) ו-[עדכון מערכים ב-state](/learn/updating-arrays-in-state) למידע נוסף.

<Recipes titleText="Examples of objects and arrays in state" titleId="examples-objects">

#### טופס (אובייקט) {/*form-object*/}

בדוגמה זו, המשתנה `form` state מכיל אובייקט. לכל קלט יש מטפל בשינוי שקורא ל-`setForm` עם ה-state הבא של הטופס כולו. תחביר התפשטות `{ ...form }` מבטיח שהאובייקט state מוחלף במקום מוטציה.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### טופס (אובייקט מקונן) {/*form-nested-object*/}

בדוגמה זו, ה-state מקונן יותר. כאשר אתה מעדכן את state המקונן, עליך ליצור עותק של האובייקט שאתה מעדכן, כמו גם כל אובייקט ש"מכיל" אותו בדרך כלפי מעלה. קרא את [עדכון אובייקט מקונן](/learn/updating-objects-in-state#updating-a-nested-object) למידע נוסף.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### רשימה (מערך) {/*list-array*/}

בדוגמה זו, המשתנה `todos` state מכיל מערך. כל מטפל בכפתור קורא ל-`setTodos` עם הגרסה הבאה של המערך הזה. תחביר התפשטות `[...todos]`, `todos.map()` ו-`todos.filter()` מבטיחים שהמערך state מוחלף במקום מוטציה.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### כתיבת היגיון עדכון תמציתי עם Immer {/*writing-concise-update-logic-with-immer*/}

אם עדכון מערכים ואובייקטים ללא מוטציה מרגיש מייגע, אתה יכול use ספרייה כמו [Immer](https://github.com/immerjs/use-immer) כדי להפחית קוד חוזר. Immer מאפשר לך לכתוב קוד תמציתי כאילו אתה משנה אובייקטים, אבל מתחת למכסה המנוע הוא מבצע עדכונים בלתי ניתנים לשינוי:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### הימנעות מיצירה מחדש של ה-state הראשוני {/*avoiding-recreating-the-initial-state*/}

React שומר את ה-state הראשוני פעם אחת ומתעלם ממנו בעיבודים הבאים.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

למרות שהתוצאה של `createInitialTodos()` היא רק used עבור העיבוד הראשוני, אתה עדיין קורא לפונקציה הזו בכל עיבוד. זה יכול להיות בזבזני אם זה יוצר מערכים גדולים או ביצוע חישובים יקרים.

כדי לפתור זאת, תוכל **להעביר אותה כפונקציית _initializer_** ל-`useState` במקום זאת:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

שימו לב שאתם מעבירים את `createInitialTodos`, שהיא *הפונקציה עצמה*, ולא את `createInitialTodos()`, שהיא התוצאה של הקריאה לה. אם תעביר פונקציה ל-`useState`, React יקרא לה רק במהלך האתחול.

React עשויה [להתקשר לאתחולים שלך פעמיים](#my-initializer-or-updater-function-runs-twice) בפיתוח כדי לוודא שהם [טהורים.](/learn/keeping-components-pure)

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">

#### העברת פונקציית האתחול {/*passing-the-initializer-function*/}

דוגמה זו מעבירה את פונקציית האתחול, כך שהפונקציה `createInitialTodos` פועלת רק במהלך האתחול. זה לא פועל כאשר רכיב מעבד מחדש, כגון כאשר אתה מקליד בקלט.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### העברת ה-state הראשונית ישירות {/*passing-the-initial-state-directly*/}

דוגמה זו **לא** עוברת את פונקציית האתחול, אז הפונקציה `createInitialTodos` פועלת בכל עיבוד, כמו למשל כשאתה מקליד בקלט. אין הבדל ניכר בהתנהגות, אבל הקוד הזה פחות יעיל.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### איפוס state עם מפתח {/*resetting-state-with-a-key*/}

לעתים קרובות אתה תיתקל בתכונה `key` כאשר [עיבוד רשימות.](/learn/rendering-lists) עם זאת, זה משרת גם מטרה אחרת.

אתה יכול **לאפס state של רכיב על ידי העברת `key` אחר לרכיב.** בדוגמה זו, כפתור האיפוס משנה את המשתנה `version` state, אותו אנו מעבירים כ`key` ל`Form`. כאשר ה-`key` משתנה, React יוצר מחדש את הרכיב `Form` (וכל הילדים שלו) מאפס, כך שה-state שלו מתאפס.

קרא את [שמירה ואיפוס state](/learn/preserving-and-resetting-state) למידע נוסף.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### אחסון מידע מעיבודים קודמים {/*storing-information-from-previous-renders*/}

בדרך כלל, תעדכן את state במטפלי אירועים. עם זאת, במקרים נדירים ייתכן שתרצה להתאים את state בתגובה לעיבוד -- לדוגמה, ייתכן שתרצה לשנות משתנה state כאשר אבזר משתנה.

ברוב המקרים, אתה לא צריך את זה:

* **אם ניתן לחשב את הערך שאתה צריך כולו מה-props הנוכחי או אחר state אחר, [הסר את ה-state המיותר הזה לגמרי.](/learn/choosing-the-state-structure#avoid-redundant-stateTroued about the re__0 Hook](/reference/react/useMemo) יכול לעזור.
* אם ברצונך לאפס את כל ה-state של עץ הרכיבים, [העבירו `key` אחר לרכיב שלכם.](#resetting-state-with-a-key)
* אם אתה יכול, עדכן את כל ה-state הרלוונטיים במטפלי האירועים.

במקרה הנדיר שאף אחד מאלה לא חל, יש דפוס שאתה יכול use לעדכן את state בהתבסס על הערכים שעובדו עד כה, על ידי קריאה לפונקציה `set` בזמן שהרכיב שלך מעבד.

הנה דוגמה. רכיב `CountLabel` זה מציג את משענת `count` שהועברה אליו:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

נניח שאתה רוצה להראות אם המונה *עלה או ירד* מאז השינוי האחרון. הפריט `count` לא אומר לך את זה -- אתה צריך לעקוב אחר הערך הקודם שלו. הוסף את המשתנה `prevCount` state כדי לעקוב אחריו. הוסף משתנה state נוסף בשם `trend` כדי להחזיק אם הספירה גדלה או ירדה. השווה את `prevCount` ל-`count`, ואם הם לא שווים, עדכן גם את `prevCount` וגם את `trend`. עכשיו אתה יכול להראות גם את אבזר הספירה הנוכחי וגם *איך הוא השתנה מאז העיבוד האחרון*.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

שים לב שאם אתה קורא לפונקציה `set` תוך כדי רינדור, היא חייבת להיות בתוך תנאי כמו `prevCount !== count`, וחייבת להיות קריאה כמו `setPrevCount(count)` בתוך התנאי. אחרת, הרכיב שלך יעבד מחדש בלולאה עד שהוא יקרוס. כמו כן, אתה יכול לעדכן רק את ה-state של רכיב *המעבד כעת* בצורה זו. קריאה לפונקציה `set` של רכיב *אחר* במהלך העיבוד היא שגיאה. לבסוף, הקריאה `set` שלך עדיין צריכה [לעדכן state ללא מוטציה](#updating-objects-and-arrays-in-state) -- זה לא אומר שאתה יכול לשבור כללים אחרים של [פונקציות טהורות.](/learn/keeping-components-pure)

דפוס זה יכול להיות קשה להבנה ובדרך כלל עדיף להימנע ממנו. עם זאת, זה עדיף מאשר לעדכן את state באפקט. כאשר אתה קורא לפונקציה `set` במהלך העיבוד, React יעבד מחדש את הרכיב הזה מיד לאחר יציאת הרכיב שלך עם `return` statement, ולפני רינדור הילדים. בדרך זו, ילדים לא צריכים לעבד פעמיים. שאר פונקציית הרכיב שלך עדיין תתבצע (והתוצאה תיזרק). אם המצב שלך נמוך מכל הקריאות Hook, תוכל להוסיף `return;` מוקדם כדי להתחיל מחדש את העיבוד מוקדם יותר.

---

## פתרון בעיות {/*troubleshooting*/}

### עדכנתי את ה-state, אבל רישום נותן לי את הערך הישן {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

קריאה לפונקציה `set` **לא משנה את state בקוד הפועל**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

זה בגלל use [states מתנהגים כמו תמונת מצב.](/learn/state-as-a-snapshot) עדכון state מבקש עיבוד נוסף עם הערך החדש state, אך אינו משפיע על המשתנה `count` JavaScript הרץ שלך במשתנה המטפל שלך.

אם אתה צריך use את state הבא, אתה יכול לשמור אותו במשתנה לפני שתעביר אותו לפונקציה `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### עדכנתי את state, אבל המסך לא מתעדכן {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React **יתעלם מהעדכון שלך אם ה-state הבא שווה ל-state הקודם,** כפי שנקבע על ידי השוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). זה קורה בדרך כלל כאשר אתה משנה אובייקט או מערך ב-state ישירות:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

שינית אובייקט `obj` קיים והעברת אותו בחזרה ל-`setObj`, אז React התעלם מהעדכון. כדי לתקן זאת, עליך לוודא שאתה תמיד [_מחליף_ אובייקטים ומערכים ב-state במקום _משנה_ אותם](#updating-objects-and-arrays-in-state):

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### אני מקבל שגיאה: "יותר מדי עיבודים חוזרים" {/*im-getting-an-error-too-many-re-renders*/}

אתה עשוי לקבל שגיאה שאומרת: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` בדרך כלל, זה אומר שאתה מגדיר ללא תנאי את state *במהלך העיבוד*, כך שהרכיב שלך נכנס ללולאה: render, set state (שמאפשר עיבוד use), render, set state (וכן state), וכן __T. לעתים קרובות מאוד, זהו caused בטעות בציון מטפל באירוע:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

אם אינך מוצא את ה-cause של שגיאה זו, לחץ על החץ שליד השגיאה במסוף ועיין בערימת JavaScript כדי למצוא את קריאת הפונקציה הספציפית `set` האחראית לשגיאה.

---

### פונקציית האתחול או העדכון שלי פועלת פעמיים {/*my-initializer-or-updater-function-runs-twice*/}

ב[מצב קפדני](/reference/react/StrictMode), React יקרא לחלק מהפונקציות שלך פעמיים במקום פעם אחת:

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

זה צפוי ולא אמור לשבור את הקוד שלך.

התנהגות זו של **פיתוח בלבד** עוזרת לך [לשמור על רכיבים טהורים.](/learn/keeping-components-pure) React uses התוצאה של אחת הקריאות, ומתעלמת מהתוצאה של השיחה השנייה. כל עוד פונקציות הרכיב, האתחול והעדכון שלך טהורות, זה לא אמור להשפיע על ההיגיון שלך. עם זאת, אם הם בטעות טמאים, זה עוזר לך לשים לב לטעויות.

לדוגמה, פונקציית העדכון הלא טהורה הזו משנה מערך ב-state:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

Because React קורא לפונקציית העדכון שלך פעמיים, אתה תראה שהמטלה נוספה פעמיים, כדי שתדע שיש טעות. בדוגמה זו, אתה יכול לתקן את הטעות על ידי [החלפת המערך במקום לשנות אותו](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

כעת, כשפונקציית העדכון הזו טהורה, לקרוא לזה זמן נוסף לא משנה בהתנהגות. זו הסיבה שReact קורא לזה פעמיים עוזר לך למצוא טעויות. **רק פונקציות הרכיבים, האתחול והעדכון צריכות להיות טהורות.** מטפלי אירועים אינם צריכים להיות טהורים, לכן React לעולם לא יתקשר למטפלי האירועים שלך פעמיים.

קרא את [שמירה על רכיבים טהורים](/learn/keeping-components-pure) למידע נוסף.

---

### אני מנסה להגדיר את state לפונקציה, אבל היא נקראת במקום זאת {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

אתה לא יכול להכניס פונקציה לתוך state בצורה הבאה:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

מכיוון שuse אתה מעביר פונקציה, React מניח ש`someFunction` היא [פונקציית initializer](#avoiding-recreating-the-initial-state), וש`someOtherFunction` היא [פונקציית עדכון](#עדכון-state-המבוסס על זה קודם לכן), התקשר אליהם ואחסן את התוצאה. כדי באמת *לאחסן* פונקציה, אתה צריך לשים לפניהם `() =>` בשני המקרים. לאחר מכן React יאחסן את הפונקציות שאתה מעביר.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
