---
title: "שמירה ואיפוס מצב"
---

<Intro>

המדינה מבודדת בין הרכיבים. React עוקב אחרי איזה state שייך לאיזה רכיב על סמך מקומו בעץ ה-UI. אתה יכול לשלוט מתי לשמר את state ומתי לאפס אותו בין רינדור מחדש.

</Intro>

<YouWillLearn>

* כאשר React בוחר לשמר או לאפס את ה-state
* איך לאלץ את React לאפס את ה-state של הרכיב
* כיצד מפתחות וסוגים משפיעים על האם ה-state נשמר

</YouWillLearn>

## המדינה קשורה למיקום בעץ העיבוד {/*state-is-tied-to-a-position-in-the-tree*/}

React בונה [עיבוד עצים](למד/הבנת-את-UI-as-a-tree#the-render-tree) עבור מבנה הרכיבים בממשק המשתמש שלך.

כאשר אתה נותן לרכיב state, אתה עלול לחשוב שה-state "חי" בתוך הרכיב. אבל ה-state למעשה מוחזק בתוך React. React משייך כל חלק של state שהוא מחזיק עם הרכיב הנכון לפי המקום שבו הרכיב יושב בעץ העיבוד.

כאן, יש רק תג `<Counter />` JSX אחד, אבל הוא מוצג בשני מיקומים שונים:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

הנה איך אלה נראים כעץ:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

עץ React

</Diagram>

</DiagramGroup>

**אלו שני מונים נפרדים מכיוון שכל אחד מהם מוצג במיקום שלו בעץ.** בדרך כלל לא צריך לחשוב על המיקומים האלה כדי use React, אבל זה יכול להיות use מלא כדי להבין איך זה עובד.

ב-React, כל רכיב על המסך בידד לחלוטין את state. לדוגמה, אם תעבדו שני רכיבי `Counter` זה לצד זה, כל אחד מהם יקבל `score` ו`hover` state משלו, עצמאיים.

נסה ללחוץ על שני המונים ושימו לב שהם לא משפיעים זה על זה:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

כפי שאתה יכול לראות, כאשר מונה אחד מתעדכן, רק ה-state עבור רכיב זה מתעדכן:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

מעדכן את state

</Diagram>

</DiagramGroup>


React ישמור את ה-state בסביבה כל עוד תעבד את אותו רכיב באותו מיקום בעץ. כדי לראות זאת, הגדל את שני המונים, ולאחר מכן הסר את הרכיב השני על ידי ביטול הסימון של תיבת הסימון "רנד את המונה השני", ולאחר מכן הוסף אותו בחזרה על ידי סימון זה שוב:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

שימו לב איך ברגע שאתם מפסיקים לעבד את המונה השני, ה-state שלו נעלם לחלוטין. זה בגלל שuse כאשר React מסיר רכיב, הוא הורס את state שלו.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

מחיקת רכיב

</Diagram>

</DiagramGroup>

כאשר אתה מסמן "עיבוד המונה השני", `Counter` שני וה-state שלו מאותחלים מאפס (`score = 0`) ומתווספים ל-DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

הוספת רכיב

</Diagram>

</DiagramGroup>

**React שומר על state של רכיב כל עוד הוא מוצג במיקום שלו בעץ ה-UI.** אם הוא יוסר, או שרכיב אחר יעובד באותו מיקום, React משליך את state שלו.

## אותו רכיב באותו מיקום שומר על state {/*same-component-at-the-same-position-preserves-state*/}

בדוגמה זו, ישנם שני תגי `<Counter />` שונים:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

כאשר אתה מסמן או מנקה את תיבת הסימון, המונה state לא מתאפס. בין אם `isFancy` הוא `true` או `false`, תמיד יש לך `<Counter />` בתור הילד הראשון של `div` שהוחזר ממרכיב השורש `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

עדכון ה-`App` state אינו מאפס את ה-`Counter` שכןuse `Counter` נשאר באותו מיקום

</Diagram>

</DiagramGroup>


זה אותו רכיב באותו מיקום, אז מנקודת המבט של React, זה אותו מונה.

<Pitfall>

זכור ש**זה המיקום בעץ ממשק המשתמש - לא בסימון JSX - שחשוב ל-React!** לרכיב זה יש שני `return` clauses עם תגיות `<Counter />` JSX שונות בתוך ומחוץ ל-`if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

אתה עשוי לצפות שה-state יתאפס כאשר תסמן את תיבת הסימון, אבל הוא לא! זה בגלל שuse **שני תגי `<Counter />` אלו מוצגים באותו מיקום.** React לא יודע היכן אתה מציב את התנאים בפונקציה שלך. כל מה שהוא "רואה" זה את העץ שאתה מחזיר.

בשני המקרים, הרכיב `App` מחזיר `<div>` עם `<Counter />` כילד ראשון. ל-React, לשני המונים הללו יש את אותה "כתובת": הילד הראשון של הילד הראשון של השורש. כך React מתאים אותם בין העיבוד הקודם והבא, ללא קשר לאופן שבו אתה בונה את ההיגיון שלך.

</Pitfall>

## רכיבים שונים באותו מיקום איפוס state {/*different-components-at-the-same-position-reset-state*/}

בדוגמה זו, סימון תיבת הסימון יחליף את `<Counter>` ב-`<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

כאן, אתה עובר בין סוגי רכיבים _שונים_ באותו מיקום. בתחילה, הילד הראשון של ה-`<div>` הכיל `Counter`. אבל כשהחלפת `p`, React הסיר את `Counter` מעץ ה-UI והרס את state שלו.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

כאשר `Counter` משתנה ל-`p`, ה-`Counter` נמחק וה-`p` מתווסף

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

בעת המעבר חזרה, ה-`p` נמחק וה-`Counter` מתווסף

</Diagram>

</DiagramGroup>

כמו כן, **כאשר אתה מעבד רכיב אחר באותו מיקום, הוא מאפס את state של כל המשנה שלו.** כדי לראות איך זה עובד, הגדל את המונה ולאחר מכן סמן את תיבת הסימון:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

המונה state מתאפס כאשר אתה לוחץ על תיבת הסימון. למרות שאתה מעבד `Counter`, הצאצא הראשון של ה-`div` משתנה מ-`div` ל-`section`. כשהילד `div` הוסר מה-DOM, כל העץ שמתחתיו (כולל ה-`Counter` וה-state שלו) נהרס גם כן.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

כאשר `section` משתנה ל-`div`, ה-`section` נמחק וה-`div` החדש מתווסף

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

בעת המעבר חזרה, ה-`div` נמחק וה-`section` החדש מתווסף

</Diagram>

</DiagramGroup>

ככלל אצבע, **אם אתה רוצה לשמר את state בין רינדור מחדש, המבנה של העץ שלך צריך "להתאים"** מעיבוד אחד למשנהו. אם המבנה שונה, ה-state נהרס מכיוון שuse React הורס את state כאשר הוא מסיר רכיב מהעץ.

<Pitfall>

זו הסיבה שלא כדאי לקנן הגדרות פונקציות של רכיבים.

כאן, פונקציית הרכיב `MyTextField` מוגדרת *בתוך* `MyComponent`:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


Every time you click the button, the input state disappears! This is because a *different* `MyTextField` function is created for every render of `MyComponent`. You're rendering a *different* component in the same position, so React resets all state below. זה מוביל לבאגים ולבעיות ביצועים. כדי להימנע מבעיה זו, **הכריז תמיד על פונקציות רכיב ברמה העליונה, ואל תקנן את ההגדרות שלהן.**

</Pitfall>

## איפוס state באותו מיקום {/*resetting-state-at-the-same-position*/}

כברירת מחדל, React שומר על state של רכיב בזמן שהוא נשאר באותו מיקום. בדרך כלל, זה בדיוק מה שאתה רוצה, אז זה הגיוני בתור התנהגות ברירת המחדל. אבל לפעמים, ייתכן שתרצה לאפס את ה-state של רכיב. שקול את האפליקציה הזו המאפשרת לשני שחקנים לעקוב אחר התוצאות שלהם בכל תור:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

נכון לעכשיו, כאשר אתה מחליף שחקן, הניקוד נשמר. שני `Counter`s מופיעים באותו מיקום, אז React רואה אותם כ*זהה* `Counter` שה-`person` שלו השתנה.

אבל מבחינה רעיונית, באפליקציה הזו הם צריכים להיות שני מונים נפרדים. הם עשויים להופיע באותו מקום בממשק המשתמש, אבל אחד הוא מונה עבור טיילור, ואחר הוא מונה עבור שרה.

ישנן שתי דרכים לאפס את state בעת המעבר ביניהן:

1. עיבוד רכיבים במיקומים שונים
2. תן לכל רכיב זהות מפורשת עם `key`


### אפשרות 1: עיבוד רכיב במיקומים שונים {/*option-1-rendering-a-component-in-different-positions*/}

אם אתה רוצה ששני `Counter`s אלה יהיו עצמאיים, אתה יכול לעבד אותם בשתי עמדות שונות:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* בתחילה, `isPlayerA` הוא `true`. אז המיקום הראשון מכיל `Counter` state, והשנייה ריקה.
* כאשר אתה לוחץ על כפתור "השחקן הבא" המיקום הראשון מתבטל אך השני מכיל כעת `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

state ראשוני

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

לחיצה על "הבא"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

לוחצים שוב על "הבא".

</Diagram>

</DiagramGroup>

state של כל `Counter` מושמד בכל פעם שהוא מוסר מה-DOM. זו הסיבה שהם מתאפסים בכל פעם שאתה לוחץ על הכפתור.

פתרון זה נוח כאשר יש לך רק כמה רכיבים עצמאיים המעובדים באותו מקום. בדוגמה זו, יש לך רק שניים, כך שזה לא טרחה לעבד את שניהם בנפרד ב-JSX.

### אפשרות 2: איפוס state עם מפתח {/*option-2-resetting-state-with-a-key*/}

ישנה גם דרך נוספת, גנרית יותר, לאפס את ה-state של רכיב.

אולי ראית `key`s כאשר [עיבוד רשימות.](/learn/rendering-lists#keeping-list-items-in-order-with-key) מפתחות אינם מיועדים רק לרשימות! אתה יכול use מפתחות כדי לגרום לReact להבחין בין כל רכיב. כברירת מחדל, הסדר של React use בתוך האב ("מונה ראשון", "מונה שני") כדי להבחין בין רכיבים. אבל מקשים מאפשרים לך לומר ל-React שזה לא רק מונה *ראשון*, או מונה *שני*, אלא מונה ספציפי - למשל, המונה של *טיילור*. כך, React יכיר את המונה של *טיילור* בכל מקום שהוא מופיע בעץ!

בדוגמה זו, שני `<Counter />`s אינם חולקים state למרות שהם מופיעים באותו מקום ב-JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

מעבר בין טיילור לשרה אינו משמר את ה-state. זה בגללuse **נתת להם `key`s שונים:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

ציון `key` אומר React לuse את `key` עצמו כחלק מהעמדה, במקום הסדר שלהם בתוך האב. זו הסיבה שלמרות שאתה מציג אותם באותו מקום ב-JSX, React רואה אותם כשני מונים שונים, ולכן הם לעולם לא ישתפו את state. בכל פעם שמונה מופיע על המסך, ה-state שלו נוצר. בכל פעם שהוא מוסר, ה-state שלו מושמד. החלפה ביניהם מאפסת את state שלהם שוב ושוב.

<Note>

זכור כי המפתחות אינם ייחודיים בעולם. הם מציינים רק את המיקום *בתוך ההורה*.

</Note>

### איפוס טופס עם מפתח {/*resetting-a-form-with-a-key*/}

איפוס state עם מפתח הוא use מלא במיוחד כאשר עוסקים בטפסים.

באפליקציית הצ'אט הזו, הרכיב `<Chat>` מכיל את קלט הטקסט state:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

נסה להזין משהו בקלט, ולאחר מכן לחץ על "אליס" או "בוב" כדי לבחור נמען אחר. תבחין שהקלט state נשמר מכיוון שuse ה-`<Chat>` מוצג באותו מיקום בעץ.

**באפליקציות רבות, זו עשויה להיות ההתנהגות הרצויה, אבל לא באפליקציית צ'אט!** אינך רוצה לתת ל-user לשלוח הודעה שהוא כבר הקליד לאדם שגוי עקב לחיצה מקרית. כדי לתקן את זה, הוסף `key`:

```js
<Chat key={to.id} contact={to} />
```

זה מבטיח שכאשר אתה בוחר נמען אחר, הרכיב `Chat` ייווצר מחדש מאפס, כולל כל state בעץ שמתחתיו. React גם יצור מחדש את האלמנטים DOM במקום לעשות בהם שימוש חוזר.

כעת החלפת הנמען תמיד מנקה את שדה הטקסט:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### שימור state עבור רכיבים שהוסרו {/*preserving-state-for-removed-components*/}

באפליקציית צ'אט אמיתית, סביר להניח שתרצה לשחזר את הקלט state כאשר ה-user יבחר שוב את הנמען הקודם. ישנן מספר דרכים לשמור על ה-state "חי" עבור רכיב שאינו גלוי עוד:

- אתה יכול להציג את _כל_ הצ'אטים במקום רק את הנוכחי, אבל להסתיר את כל האחרים עם CSS. הצ'אטים לא יוסרו מהעץ, כך שה-state המקומי שלהם יישמר. פתרון זה עובד נהדר עבור ממשקי משתמש פשוטים. אבל זה יכול להיות איטי מאוד אם העצים המוסתרים גדולים ומכילים הרבה צמתים DOM.
- תוכל [להרים את state למעלה](/learn/sharing-state-between-components) ולהחזיק את ההודעה הממתינה עבור כל נמען ברכיב האב. בדרך זו, כאשר רכיבי הצאצא מוסרים, זה לא משנה, כי use זה ההורה ששומר את המידע החשוב. זהו הפתרון הנפוץ ביותר.
- אתה יכול גם use מקור אחר בנוסף ל-React state. לדוגמה, אתה כנראה רוצה שטיוטת הודעה תימשך גם אם ה-user סוגר בטעות את הדף. כדי ליישם זאת, אתה יכול לגרום לרכיב `Chat` לאתחל את ה-state שלו על ידי קריאה מה-[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), ולשמור את הטיוטות גם שם.

לא משנה באיזו אסטרטגיה תבחר, צ'אט _עם אליס_ נבדל רעיונית מצ'אט _עם בוב_, ולכן הגיוני לתת `key` לעץ `<Chat>` על סמך הנמען הנוכחי.

</DeepDive>

<Recap>

- React שומר על state כל עוד אותו רכיב מוצג באותו מיקום.
- המדינה לא נשמרת בתגיות JSX. זה משויך למיקום העץ שבו אתה שם את ה-JSX הזה.
- אתה יכול לאלץ תת-עץ לאפס את state שלו על ידי מתן מפתח אחר.
- אל תקנן הגדרות של רכיבים, אחרת תאפס את state בטעות.

</Recap>



<Challenges>

#### תקן טקסט קלט נעלם {/*fix-disappearing-input-text*/}

דוגמה זו מציגה הודעה כאשר אתה לוחץ על הכפתור. עם זאת, לחיצה על הכפתור גם מאפסת בטעות את הקלט. למה זה קורה? תקן זאת כך שלחיצה על הכפתור לא תאפס את טקסט הקלט.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

הבעיה היא ש`Form` מוצג במיקומים שונים. בסניף `if` זה הילד השני של ה-`<div>`, אבל בסניף `else` זה הילד הראשון. לכן, סוג הרכיב בכל עמדה משתנה. המיקום הראשון משתנה בין החזקת `p` ל-`Form`, ואילו המיקום השני משתנה בין החזקת `Form` ו`button`. React מאפס את ה-state בכל פעם שסוג הרכיב משתנה.

הפתרון הקל ביותר הוא לאחד את הענפים כך ש`Form` יציג תמיד באותו מיקום:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


מבחינה טכנית, תוכל גם להוסיף `null` לפני `<Form />` בענף `else` כדי להתאים למבנה הענף `if`:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

בדרך זו, `Form` הוא תמיד הילד השני, כך שהוא נשאר באותה תנוחה ושומר על state שלו. אבל גישה זו הרבה פחות ברורה ומציגה סיכון שמישהו אחר יסיר את ה-`null` הזה.

</Solution>

#### החלף שני שדות טופס {/*swap-two-form-fields*/}

טופס זה מאפשר לך להזין שם פרטי ושם משפחה. יש לו גם תיבת סימון השולטת איזה שדה נכנס ראשון. כאשר אתה מסמן את תיבת הסימון, השדה "שם משפחה" יופיע לפני השדה "שם פרטי".

זה כמעט עובד, אבל יש באג. אם תמלא את הקלט "שם פרטי" ותסמן את תיבת הסימון, הטקסט יישאר בקלט הראשון (שהוא כעת "שם משפחה"). תקן את זה כך שטקסט הקלט *גם* יזוז כאשר אתה הופך את הסדר.

<Hint>

נראה שעבור תחומים אלו, המיקום שלהם בתוך ההורה אינו מספיק. האם יש דרך כלשהי לומר ל-React כיצד להתאים את ה-state בין עיבודים חוזרים?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

תן `key` לשני רכיבי `<Field>` בסניפים `if` וגם `else`. זה אומר לReact כיצד "להתאים" את ה-state הנכון עבור `<Field>` גם אם הסדר שלהם בתוך האב משתנה:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### אפס טופס פירוט {/*reset-a-detail-form*/}

זוהי רשימת אנשי קשר הניתנת לעריכה. אתה יכול לערוך את הפרטים של איש הקשר שנבחר ולאחר מכן לחץ על "שמור" כדי לעדכן אותו, או על "אפס" כדי לבטל את השינויים שלך.

כאשר אתה בוחר איש קשר אחר (לדוגמה, אליס), ה-state מתעדכן אך הטופס ממשיך להציג את הפרטים של איש הקשר הקודם. תקן זאת כך שהטופס יתאפס כאשר איש הקשר שנבחר משתנה.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

תן `key={selectedId}` לרכיב `EditContact`. בדרך זו, מעבר בין אנשי קשר שונים יאפס את הטופס:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### נקה תמונה בזמן שהיא נטענת {/*clear-an-image-while-its-loading*/}

כאשר אתה לוחץ על "הבא", הדפדפן מתחיל לטעון את התמונה הבאה. עם זאת, מכיוון שuse היא מוצגת באותו תג `<img>`, כברירת מחדל עדיין תראה את התמונה הקודמת עד שהבאה תיטען. זה עשוי להיות לא רצוי אם חשוב שהטקסט תמיד יתאים לתמונה. שנה אותו כך שברגע שתלחץ על "הבא", התמונה הקודמת תתבטל מיד.

<Hint>

האם יש דרך לומר ל-React ליצור מחדש את ה-DOM במקום לעשות בו שימוש חוזר?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

אתה יכול לספק `key` לתג `<img>`. כאשר `key` זה ישתנה, React יצור מחדש את הצומת `<img>` DOM מאפס. זה cause הוא הבזק קצר כאשר כל תמונה נטענת, כך שזה לא משהו שהיית רוצה לעשות עבור כל תמונה באפליקציה שלך. אבל זה הגיוני אם אתה רוצה להבטיח שהתמונה תמיד מתאימה לטקסט.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### תקן state שגוי ברשימה {/*fix-misplaced-state-in-the-list*/}

ברשימה זו, לכל `Contact` יש state שקובע אם "הצג אימייל" נלחץ עבורו. לחץ על "הצג אימייל" עבור אליס, ולאחר מכן סמן את תיבת הסימון "הצג בסדר הפוך". אתה תבחין שזהו האימייל של _טיילור_ שמורחב כעת, אבל זה של אליס - שעבר לתחתית - נראה קרס.

תקן זאת כך שה-state המורחב ישויך לכל איש קשר, ללא קשר לסדר שנבחר.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

הבעיה היא שהדוגמה הזו השתמשה באינדקס בתור `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

עם זאת, אתה רוצה שה-state ישויך ל-_כל איש קשר מסוים_.

שימוש במזהה איש הקשר בתור `key` במקום זה פותר את הבעיה:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

המדינה קשורה למיקום העץ. `key` מאפשר לך לציין מיקום בעל שם במקום להסתמך על הזמנה.

</Solution>

</Challenges>
