---
title: "הכירו את react.dev"
---

16 במרץ 2023 מאת [דן אברמוב](https://twitter.com/dan_abramov) ו[רחל נאבורס](https://twitter.com/rachelnabors)

---

<Intro>

היום אנחנו נרגשים להשיק את [react.dev](https://react.dev), הבית החדש של React והתיעוד שלו. בפוסט זה, ברצוננו לערוך לכם סיור באתר החדש.

</Intro>

---

## tl;dr {/*tldr*/}

* האתר React החדש ([react.dev](https://react.dev)) מלמד React מודרני עם רכיבי פונקציות וHooks.
* כללנו דיאגרמות, איורים, אתגרים ויותר מ-600 דוגמאות אינטראקטיביות חדשות.
* אתר התיעוד הקודם React עבר עכשיו אל [legacy.reactjs.org](https://legacy.reactjs.org).

## אתר חדש, דומיין חדש, דף בית חדש {/*new-site-new-domain-new-homepage*/}

ראשית, קצת שמירה על house.

כדי לחגוג את השקת המסמכים החדשים, ומשמעותיים, להפריד בבירור בין התוכן הישן והחדש, עברנו לדומיין הקצר יותר [react.dev](https://react.dev). הדומיין הישן [reactjs.org](https://reactjs.org) יפנה לכאן כעת.

המסמכים הישנים של React מאוחסנים כעת בארכיון ב-[legacy.reactjs.org](https://legacy.reactjs.org). כל הקישורים הקיימים לתוכן הישן יופנו באופן אוטומטי כדי למנוע "שבירה באינטרנט", אך האתר מדור קודם לא יקבל עדכונים רבים נוספים.

תאמינו או לא, React ימלאו בקרוב עשר שנים. בעוד JavaScript שנים, זה כמו מאה שלמה! [רעננו את דף הבית של React](https://react.dev) כדי לשקף למה אנחנו חושבים שReact היא דרך מצוינת ליצור ממשקי user כיום, ועדכנו את מדריכי ההתחלה כדי להזכיר בצורה בולטת יותר מסגרות מודרניות מבוססות React.

אם עדיין לא ראית את דף הבית החדש, בדוק אותו!

## הולך All-in על React מודרני עם Hooks {/*going-all-in-on-modern-react-with-hooks*/}

כאשר משחררנו את React Hooks בשנת 2018, המסמכים Hooks הניחו שהקורא מכיר את רכיבי המחלקה. זה עזר לקהילה לאמץ את Hooks במהירות רבה, אך לאחר זמן המסמכים הישנים לא הצליחו לשרת את הקוראים החדשים. קוראים חדשים היו צריכים ללמוד React פעמיים: פעם אחת עם רכיבי כיתה ואז שוב עם Hooks.

**המסמכים החדשים מלמדים React עם Hooks מההתחלה.** המסמכים מחולקים לשני חלקים עיקריים:

* **[Learn React](/learn)** הוא קורס בקצב עצמי המלמד React מאפס.
* **[API Reference](/reference)** מספק את הפרטים ודוגמאות השימוש עבור כל React API.

בואו נסתכל מקרוב על מה תוכלו למצוא בכל חלק.

<Note>

יש עדיין כמה מקרים נדירים של רכיבי מחלקה use שעדיין אין להם מקבילה מבוססת Hook. רכיבי הכיתה נשארים נתמכים ומתועדים בקטע [Legacy API](/reference/react/legacy) של האתר החדש.

</Note>

## התחלה מהירה {/*quick-start*/}

הקטע למד מתחיל בדף [התחלה מהירה](/learn). זהו סיור היכרות קצר של React. הוא מציג את התחביר של מושגים כמו רכיבים, props, ו-state, אבל לא מפרט איך use אותם.

אם אתה אוהב ללמוד על ידי עשייה, אנו ממליצים לבדוק את ה-[Tic-Tac-Toe Tutorial](/learn/tutorial-tic-tac-toe) הבא. זה ילמד אותך בבניית משחק קטן עם React, תוך כדי ללמד את המיומנויות use בכל יום. הנה מה שתבנה:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

ברצוננו גם להדגיש את [Thinking in React](/learn/thinking-in-react) - זה המדריך שגרם ל-React ל"קליק" עבור רבים מאיתנו. **עדכנו את שני המדריכים הקלאסיים הללו לרכיבי פונקציות use וHooks,** כך שהם טובים כמו חדשים.

<Note>

הדוגמה היא למעלה *ארגז חול*. הוספנו הרבה ארגזי חול - מעל 600! - בכל מקום באתר. אתה יכול לערוך כל ארגז חול, או ללחוץ על "מזלג" בפינה הימנית העליונה כדי לפתוח אותו בלשונית נפרדת. ארגזי חולים יכול לשחק מהר עם React APIs, לחקור את הרעיונות שלך ולבדוק את ההבנה שלך.

</Note>

## למד React שלב אחר שלב {/*learn-react-step-by-step*/}

אנו רוצים שלכולם בעולם יש הזדמנות שווה ללמוד React בחינם בעצמם.

זה מה שהקטע למד מאורגן כמו קורס בקצב עצמי המפוצל לפרקים. שני הפרקים הראשונים מתארים את היסודות של React. אם אתה חדש ב-React, או רוצה לרענן אותו ב-memory שלך, התחל כאן:

- **[מתאר את ממשק המשתמש](/learn/describing-the-ui)** מלמד כיצד להציג מידע עם רכיבים.
- **[הוספת אינטראקטיביות](/learn/adding-interactivity)** מלמד כיצד לעדכן את המסך בתגובה לקלט user.

שני הפרקים הבאים מתקדמים יותר, ויתנו לך תובנה עמוקה יותר לגבי החלקים המסובכים יותר:

- **[Managing State](/learn/managing-state)** מלמד איך לארגן את ההיגיון שלך ככל שהאפליקציה שלך גדלה במורכבות.
- **[Escape Hatches](/learn/escape-hatches)** מלמד איך אתה יכול "לצאת החוצה" React, ומתי הכי הגיוני לעשות זאת.

כל פרק מורכב מכמה דפים קשורים. רוב הדפים הללו מלמדים מיומנות או טכניקה ספציפית - לדוגמה, [כותבת סימון עם JSX](/learn/writing-markup-with-jsx), [עדכון אובייקטים במצב](/learn/updating-objects-in-state) או [Sharing State Between רכיבים](/learn/sharing-state-between-components). חלק מהדפים ממעשיים בהסבר רעיון - כמו [Render and Commit](/learn/render-and-commit), או [State as a Snapshot](/learn/state-as-a-snapshot). ויש כמה, כמו [אולי אתה לא צריך אפקט](/learn/you-might-not-need-an-effect), שחולקים את ההצעות שלנו על סמך מה שלמדנו במהלך השנים הללו.

אתה לא צריך לקרוא את הפרקים האלה כרצף. למי יש זמן לזה?! אבל אתה יכול. דפים במקטע למד מסתמכים רק על מושגים שהוצגו בדפים הקודמים. אם אתה רוצה לקרוא אותו כמו ספר, לך על זה!

### בדוק את ההבנה שלך עם אתגרים {/*check-your-understanding-with-challenges*/}

רוב הדפים בקטע למידה מסתיימים בכמה אתגרים כדי לבדוק את ההבנה שלך. לדוגמה, הנה כמה אתרים מהעמוד על [עיבוד מותנה](/learn/conditional-rendering#challenges).

אתה לא צריך לפתור אותם עכשיו! אלא אם כן אתה *באמת* רוצה.

<Challenges noTitle={true}>

#### הצג סמל עבור פריטים לא שלמים עם `? :` {/*show-an-icon-for-incomplete-items-with--*/}

השתמש באופרטור המותנה (`cond ? a : b`) כדי להציג ❌ אם `isPacked` אינו `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### הצג את חשיבות הפריט באמצעות `&&` {/*show-the-item-importance-with-*/}

בדוגמה זו, כל `Item` מקבל אבזר `importance` מספרי. השתמש באופרטור `&&` כדי להציג את "_(חשיבות: X)_" באותיות נטוי, אך רק עבור פריטים בעלי חשיבות שאינה אפס. רשימת הדברים שלך אמורה להיראות כך בסוף הדברים:

* חליפת חלל _(חשיבות: 9)_
*קסדה עם עלה זהב
* תמונה של תם _(חשיבות: 6)_

אל תשכח להוסיף רווח בין שתי התוויות!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

זה אמור לעשות את העבודה:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

שים לב שעליך לכתוב `importance > 0 && ...` ולא `importance && ...` כך שאם ה-`importance` הוא `0`, `0` לא יוצג למעשה!

בפתרון זה, שני תנאים נפרדים הם used כדי להכניס רווח בין השם ותווית החשיבות. לחלופין, תוכל להוסיף use ל-Fragment עם רווח מוביל: `importance > 0 && <> <i>...</i></>` או להוסיף רווח מיד בתוך ה-`<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

</Challenges>

שימו לב ללחצן "הצג פתרון" בפינה השמאלית התחתונה. זה שימושי אם אתה רוצה לבדוק את עצמך!

### בנה אינטואיציה עם דיאגרמות ואיורים {/*build-an-intuition-with-diagrams-and-illustrations*/}

כשלא הצלחנו להסביר משהו עם קוד ומילים בלבד, הוס דיאגרמות שעוזרות לספק קצת אינטואיציה. לדוגמה, הנה אחד מהדיאגרמות מ-[שימור ואיפוס מצב](/learn/preserving-and-resetting-state):

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

כאשר `section` משתנה ל-`div`, ה-`section` נמחק וה-`div` החדש מתווסף

</Diagram>

תראה גם כמה איורים לאורך המסמכים--הנה אחד מה-[דפדפן מצייר את המסך](/learn/render-and-commit#epilogue-browser-paint):

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

אישרנו עם ספקי הדפדפן שהתיאור הזה הוא 100% מדויק מבחינה מדעית.

## API הפניה חדשה ומפורטת {/*a-new-detailed-api-reference*/}

ב-[API Reference](/reference/react), לכל React API יש עכשיו עמוד ייעודי. זה כולל כל מיני APIs:

- Hooks מובנה כמו [useState](/reference/react/useState).
- רכיבים מובנים כמו [useState](/reference/react/Suspense).
- רכיבי דפדפן מובנים כמו [useState](/reference/react-dom/components/input).
- APIs מוכווני מסגרת כמו [useState](/reference/react-dom/server/renderToReadableStream).
- React APIs אחרים כמו [useState](/reference/react/memo).

תבחין שכל עמוד API מחולק לשני פלחים לפחות: *הפניה* ו-*שימוש*.

[Reference](/reference/react/useState#reference) מתאר את החתימה הרשמית API על ידי רישום הארגומנטים וערכי ההחזר. זה תמציתי, אבל זה יכול להרגיש קצת מופשט אם אתה לא מכיר את ה-API הזה. זה מתאר מה API עושה, אבל לא איך use אותו.

[שימוש](/reference/react/useState#usage) מראה מדוע וכיצד הייתם use זה API בפועל, כמו שעמית או חבר להסביר להסביר. זה מראה את **התרחישים הקנוניים של האופן שבו כל API נועד להיות used על ידי צוות React.** הוספנו קטעי קוד צבעוניים, דוגמאות לשימוש ב-API שונים ביחד ומתכונים שאפשרו להעתיק ולהדביק מהם:

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

בדוגמה זו, המשתנה `text` state מכיל מחרוזת. כשאתה מקליד, `handleChange`קורא את הערך האחרון ממרכיב הקלט DOM בדפדפן, וקורא ל-`setText` כדי לעדכן את ה-state. זה יכול להראות את ה-`text` הנוכחי למטה.

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

בדוגמה זו, המשתנה `liked` state מחזיק בוליאני. כאשר אתה לוחץ על הקלט, `setLiked` מעדכן את השינוי `liked` state אם קלט תיבת הסימון בדפדפן מסומן. השינוי `liked` הוא used כדי להציג את הטקסט מתחת לתיבת הסימון.

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

אתה יכול להכריז על יותר מרינג state רכיב אחד. כל ranking state הוא בלתי תלוי לחלוטין.

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

חלק מהדפים API כוללים גם [פתרון בעיות](/reference/react/useEffect#troubleshooting) (לבעיות נפוצות) ו[Alternatives](/reference/react-dom/findDOMNode#alternatives) (עבור APIs שהוצאו משימוש).

אנו מקווים שגישה זו תהפוך את ההתייחסות API לuse לממלאת לא רק כדרך לחפש טיעון, אלא כדרך לראות את כל הדברים שאתה יכול לעשות עם כל API נתון - וכיצד הוא מתחבר לחבור.

## מה הלאה? {/*whats-next*/}

זה כיסוי לסיור הקטן שלנו! עיין באתר החדש, ראה מה אתה אוהב או לא אוהב, והמשיכו לקבל את המשוב ב[סקר האנונימי](https://www.surveymonkey.co.uk/r/PYRPF3X) או ב[מעקב אחר בעיות](https://github.com/reactjs/reactjs.org/issues).) שלנו

אנו מודים שהפרויקט הזה לקח הרבה זמן לשלוח אותו. רצינו לשמור על בר איכותי שמגיע לקהילת React. על כתיבת המסמכים הללו ויצירת כל הדוגמאות, מצאנו טעויות בכמה מההסברים שלנו, באגים ב-React, ואף פערים בעיצוב React אנו פועלים כעת בהם. אנו מקווים שהתיעוד החדש יעזור לנו לעשות את React ברף גבוה יותר.

שמענו רבות מהבקשות שלך להרחיב את התוכן והפונקציונליות של האתר, למשל:

- מתן גרסת TypeScript לכל הדוגמאות;
- יצירת מדריכי הביצועים, הבדיקות והנגישות המעודכנים;
- תיעוד React רכיבי שרת ללא תלות במסגרות התומכות בהם;
- עבודה עם הקהילה הבינלאומית שלנו כדי לתרגם את המסמכים החדשים;
- הוספת תכונות חסרות לאתר החדש (לדוגמה, RSS עבור בלוג זה).

כעת, כאשר [react.dev](https://react.dev/) יצא, נוכל להעביר את המיקוד שלנו מ"להדביק" את המשאבים החינוכיים React של צד שלישי להוספת מידע חדש ושיפור נוסף של האתר החדש שלנו.

אנחנו חושבים שמעולם לא היה זמן טוב יותר ללמוד React.

## מי עבד על זה? {/*who-worked-on-this*/}

בצוות React, [רחל נבורס](https://twitter.com/dan_abramov) הובילה את הפרויקט (וסיפקה את האיורים) ו[דן אברמוב](https://twitter.com/dan_abramov) עיצבו את התכנית הלימודים. הם גם כתבו יחד את רוב התוכן.

כמובן, שום פרויקט כזה גדול לא קורה בנפרד. יש לנו הרבה אנשים להודות!

[סילביה ורגאס](https://twitter.com/SylwiaVargas) שיפרה את הדוגמאות שלנו כדי לחרוג מ"foo/bar/baz" וחתלתולים, ולהציג מדענים, אמנים וערים מרחבי העולם. [מגי אפלטון](https://twitter.com/Mappletons) הפכה את השרבוטים שלנו למערכת דיאגרמות ברורה.

תודה ל[דיוויד מקייב](https://twitter.com/mcc_abe), [סופי אלפרט](https://twitter.com/sophiebits), [ריק הנלון](https://twitter.com/rickhanlonii), [אנדרו קלארק](https://twitter.com/acdlite), ו[מאט קרול](https://twitter.com/mattcarrollcode) על כתיבה נוספת של תרומות. ברצוננו גם להודות ל[נטליה טפלוהינאבסטי]__ו-[מרק עלבסתי]__](אן-[ק-רעיונות) והמשוב שלנו.

תודה ל[דן לבוביץ](https://twitter.com/lebo) על עיצוב האתר ו-[רזבן גרדינר](https://dribbble.com/GradinarRazvan) על עיצוב ארגז החול.

בחזית הפיתוח, תודה ל[ג'ארד פאלמר](https://twitter.com/jaredpalmer) על פיתוח אב טיפוס. תודה ל[דיין גרנט](https://twitter.com/danecando) ו[דסטין גודמן](https://twitter.com/dustinsgoodman) מ-[ThisDotLabs](https://www.thisdot.co/) על תמיכתם בפיתוח ממשק משתמש. תודה ל[Ives van Hoorne](___K](___T](___T)(___T)(___T) ווזניקה](https://twitter.com/danilowoz) מ-[CodeSandbox](https://codesandbox.io/) על עבודתם עם אינטגרציה של ארגז חול. תודה ל[ריק הנלון](https://twitter.com/rickhanlonii) על עבודת פיתוח נקודתית ועיצוב, עידוד הצבעים שלנו ופרטים חדשים עדינים יותר. תודה ל-[Harish Kumar0_](__1K_1_1) בתות והוספת.

תודה ענקית לאנשים שהתנדבו מזמנם להשתתף בתוכנית בדיקות אלפא ובטא. ההתלהבות והמשוב שלא יסולא בפס יעזרו לנו לעצב את המסמכים האלה. צעקה מיוחדת לבוחן הביטא שלנו, [דבי אובריאן](https://twitter.com/debs_obrien), שנשאה הרצאה על החוויה שלה בשימוש במסמכים React ב-React Conf 2021.

לבסוף, תודה לקהילת React על היותה ההשראה מאחורי המאמץ הזה. אתה חושב שאנחנו עושים זאת, ואנו מקווים שהמסמכים החדשים יעזרו לך use React לבנות כל ממשק user שתרצו.
