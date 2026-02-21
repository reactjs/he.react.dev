---
title: "הדרכה: טיק-טק-טו"
---

<Intro>

אתה תבנה משחק קטן עם תקלות במהלך הדרכה זו. הדרכה זו אינה מניחה שום ידע קיים React. הטכניקות שתלמדו במדריך הן בסיסיות לבניית כל אפליקציית React, והבנה מלאה שלה תעניק לכם הבנה עמוקה של React.

</Intro>

<Note>

הדרכה זו מיועדת לאנשים שמעדיפים **ללמוד מעשה** ורוצים לנסות במהירות לעשות משהו מוחשי. אם אתה מעדיף ללמוד כל מושג שלב אחר שלב, התחל עם [תיאור ממשק המשתמש.](/learn/describing-the-ui)

</Note>

המדריך מחולק למספר חלקים:

- [הגדרה של המדריך](#הגדרה-עבור-המדריך) ייתן לך **נקודת התחלה** לעקוב אחר המדריך.
- [סקירה כללית](#overview) ילמד אותך את **היסודות** של React: רכיבים, props וstate.
- [השלמת המשחק](#completing-the-game) ילמד אותך את **הטכניקות הנפוצות ביותר** בפיתוח React.
- [הוספת מסע בזמן](#adding-time-travel) יעניק לך **תובנה עמוקה יותר** לגבי החוזקות הייחודיות של React.

### מה אתה בונה? {/*what-are-you-building*/}

במדריך זה, תבנה משחק טיק-טק אינטראקטיבי עם React.

אתה יכול לראות איך זה ייראה כשתסיים כאן:

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

אם הקוד עדיין לא נשמע לכם הגיוני, או אם אינכם מכירים את התחביר של הקוד, אל דאגה! המטרה של מדריך זה היא לעזור לך להבין את React ואת התחביר שלו.

אנו ממליצים שתבדוק את משחק הטיק-טק-בוהן למעלה לפני שתמשיך עם ההדרכה. אחת התכונות שתבחין בהן היא שיש רשימה ממוספרת מימין ללוח המשחק. רשימה זו נותנת לך היסטוריה של כל המהלכים שהתרחשו במשחק, והיא מתעדכנת ככל שהמשחק מתקדם.

לאחר ששיחקת עם המשחק המוגמר, המשך לגלול. תתחיל עם תבנית פשוטה יותר במדריך זה. הצעד הבא שלנו הוא להגדיר אותך כך שתוכל להתחיל לבנות את המשחק.

## הגדרה של המדריך {/*setup-for-the-tutorial*/}

בעורך הקוד החי למטה, לחץ על **Fork** בפינה השמאלית העליונה כדי לפתוח את העורך בכרטיסייה חדשה באמצעות אתר האינטרנט CodeSandbox. CodeSandbox מאפשר לך לכתוב קוד בדפדפן שלך ולראות בתצוגה מקדימה כיצד ה-users שלך יראו את האפליקציה שיצרת. הכרטיסייה החדשה אמורה להציג ריבוע ריק ואת קוד ההתחלה עבור הדרכה זו.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
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

<Note>

אתה יכול גם לעקוב אחר הדרכה זו באמצעות סביבת הפיתוח המקומית שלך. כדי לעשות זאת, עליך:

1. התקן את [Node.js](https://nodejs.org/en/)
1. בלשונית CodeSandbox שפתחת קודם לכן, לחץ על לחצן הפינה השמאלית העליונה כדי לפתוח את התפריט, ולאחר מכן בחר **הורד ארגז חול** בתפריט זה כדי להוריד ארכיון של הקבצים באופן מקומי
1. פתח את הארכיון, ולאחר מכן פתח מסוף ו`cd` לספרייה שפתחת
1. התקן את התלות עם `npm install`
1. הפעל את `npm start` כדי להפעיל שרת מקומי ופעל לפי ההנחיות כדי להציג את הקוד הפועל בדפדפן

אם אתה נתקע, אל תיתן לזה לעצור אותך! עקבו אחרי מקוון במקום זאת ונסה הגדרה מקומית שוב מאוחר יותר.

</Note>

## סקירה כללית {/*overview*/}

כעת, לאחר שהגדרתם, בואו לקבל סקירה כללית של React!

### בדיקת קוד ההתחלה {/*inspecting-the-starter-code*/}

ב-CodeSandbox תראה שלושה חלקים עיקריים:

![CodeSandbox עם קוד מתחיל](../images/tutorial/react-starter-code-codesandbox.png)

1. הקטע _קבצים_ עם רשימה של קבצים כמו `App.js`, `index.js`, `styles.css` ותיקיה בשם `public`
1. _עורך הקוד_ שבו תראה את קוד המקור של הקובץ שבחרת
1. הקטע _browser_ שבו תראה כיצד הקוד שכתבת יוצג

יש לבחור את הקובץ `App.js` בקטע _קבצים_. התוכן של הקובץ הזה ב_עורך הקוד_ צריך להיות:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

הקטע _browser_ אמור להציג ריבוע עם X בתוכו כך:

![ריבוע מלא ב-x](../images/tutorial/x-filled-square.png)

עכשיו בואו נסתכל על הקבצים בקוד המתנע.

#### `App.js` {/*appjs*/}

הקוד ב-`App.js` יוצר _רכיב_. ב-React, רכיב הוא פיסת קוד לשימוש חוזר המייצג חלק מממשק user. הרכיבים הם used כדי לעבד, לנהל ולעדכן את רכיבי ממשק המשתמש באפליקציה שלך. בואו נסתכל על הרכיב שורה אחר שורה כדי לראות מה קורה:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

השורה הראשונה מגדירה פונקציה בשם `Square`. מילת המפתח `export` JavaScript הופכת את הפונקציה הזו לנגישה מחוץ לקובץ הזה. מילת המפתח `default` אומרת לקבצים אחרים באמצעות הקוד שלך שזו הפונקציה העיקרית בקובץ שלך.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

השורה השנייה מחזירה כפתור. מילת המפתח `return` JavaScript פירושה שכל מה שבא לאחר מכן מוחזר כערך לקורא של הפונקציה. `<button>` הוא אלמנט *JSX*. אלמנט JSX הוא שילוב של קוד JavaScript ותגיות HTML שמתאר את מה שתרצה להציג. `className="square"` הוא מאפיין כפתור או *prop* שאומר לCSS איך לסגנן את הכפתור. `X` הוא הטקסט המוצג בתוך הכפתור ו-`</button>` סוגר את האלמנט JSX כדי לציין שאסור למקם את התוכן הבא בתוך הכפתור.

#### `styles.css` {/*stylescss*/}

לחץ על הקובץ שכותרתו `styles.css` בקטע _Files_ של CodeSandbox. קובץ זה מגדיר את הסגנונות עבור האפליקציה React שלך. שני הבוררים CSS הראשונים_ (`*` ו`body`) מגדירים את הסגנון של חלקים גדולים מהאפליקציה שלך בעוד שהבורר `.square` מגדיר את הסגנון של כל רכיב שבו המאפיין `className` מוגדר ל-`square`. בקוד שלך, זה יתאים ללחצן מרכיב ה- Square שלך ​​בקובץ `App.js`.

#### `index.js` {/*indexjs*/}

לחץ על הקובץ שכותרתו `index.js` בקטע _Files_ של CodeSandbox. לא תערוך את הקובץ הזה במהלך המדריך, אבל זה הגשר בין הרכיב שיצרת בקובץ `App.js` לדפדפן האינטרנט.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

שורות 1-5 מפגישות את כל החלקים הדרושים:

* React
* הספרייה של React כדי לדבר עם דפדפני אינטרנט (React DOM)
* הסגנונות עבור הרכיבים שלך
* הרכיב שיצרת ב-`App.js`.

שאר הקובץ מאחד את כל החלקים ומחדיר את התוצר הסופי לתוך `index.html` בתיקייה `public`.

### בניית הלוח {/*building-the-board*/}

בוא נחזור ל-`App.js`. זה המקום שבו תבלה את שאר ההדרכה.

כרגע הלוח הוא רק ריבוע בודד, אבל אתה צריך תשעה! אם רק תנסה להעתיק הדבק את הריבוע שלך כדי ליצור שני ריבועים כמו זה:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

תקבל את השגיאה הזו:

<ConsoleBlock level="error">

/src/App.js: רכיבי JSX סמוכים חייבים להיות עטופים בתג מקיף. האם רצית JSX Fragment `<>...</>`?

</ConsoleBlock>

רכיבי React צריכים להחזיר אלמנט JSX בודד ולא מספר רכיבי JSX סמוכים כמו שני כפתורים. כדי לתקן זאת אתה יכול use *Fragments* (`<>` ו`</>`) כדי לעטוף מספר רכיבי JSX סמוכים כך:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

עכשיו אתה אמור לראות:

![שני ריבועים מלאי x](../images/tutorial/two-x-filled-squares.png)

גָדוֹל! עכשיו אתה רק צריך להעתיק-הדבק כמה פעמים כדי להוסיף תשעה ריבועים ו...

![תשעה ריבועים מלאי X בשורה](../images/tutorial/nine-x-filled-squares.png)

הו לא! הריבועים כולם בשורה אחת, לא ברשת כמו שאתה צריך עבור הלוח שלנו. כדי לתקן זאת תצטרך לקבץ את הריבועים שלך לשורות עם `div`s ולהוסיף כמה מחלקות CSS. בזמן שאתה עושה את זה, אתה תיתן לכל ריבוע מספר כדי לוודא שאתה יודע היכן כל ריבוע מוצג.

בקובץ `App.js`, עדכן את רכיב `Square` כך שייראה כך:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

ה-CSS המוגדר ב-`styles.css` מסגנן את ה-divs עם ה-`className` של `board-row`. כעת, לאחר שקיבוץטת את הרכיבים שלך לשורות עם ה-`div`s המעוצבות, יש לך את לוח הטיק-טק שלך:

![לוח טיק-טאק-בוהן מלא במספרים 1 עד 9](../images/tutorial/number-filled-board.png)

אבל עכשיו יש לך בעיה. הרכיב שלך בשם `Square`, באמת כבר לא ריבוע. בוא נתקן את זה על ידי שינוי השם ל-`Board`:

```js {1}
export default function Board() {
  //...
}
```

בשלב זה הקוד שלך אמור להיראות בערך כך:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
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

<Note>

Psssst... זה הרבה להקליד! זה בסדר להעתיק ולהדביק קוד מדף זה. עם זאת, אם אתה מוכן לאתגר קטן, אנו ממליצים להעתיק רק קוד שהקלדת ידנית לפחות פעם אחת בעצמך.

</Note>

### העברת נתונים דרך props {/*passing-data-through-props*/}

לאחר מכן, תרצה לשנות את הערך של ריבוע מריק ל-"X" כאשר ה-user לוחץ על הריבוע. לפי איך שבנית את הלוח עד כה, תצטרך להעתיק ולהדביק את הקוד שמעדכן את הריבוע תשע פעמים (פעם אחת עבור כל ריבוע שיש לך)! במקום העתק-הדבק, ארכיטקטורת הרכיבים של React מאפשרת לך ליצור רכיב לשימוש חוזר כדי למנוע קוד מבולגן ומשוכפל.

ראשית, אתה הולך להעתיק את הקו המגדיר את הריבוע הראשון שלך (`<button className="square">1</button>`) מהרכיב `Board` שלך לתוך רכיב `Square` חדש:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

לאחר מכן תעדכן את רכיב הלוח כדי לעבד את אותו רכיב `Square` באמצעות תחביר JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

שימו לב שבניגוד ל-`div`s של הדפדפן, הרכיבים שלכם `Board` ו-`Square` חייבים להתחיל באות גדולה.

בואו נסתכל:

![לוח מלא אחד](../images/tutorial/board-filled-with-ones.png)

הו לא! איבדת את הריבועים הממוספרים שהיו לך קודם. כעת כל ריבוע אומר "1". כדי לתקן זאת, תבצע use *props* כדי להעביר את הערך שכל ריבוע צריך להיות ממרכיב האב (`Board`) לילד שלו (`Square`).

עדכן את רכיב `Square` כדי לקרוא את האביזר `value` שתעביר מה-`Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` מציין שניתן להעביר את רכיב הריבוע עם אבזר בשם `value`.

עכשיו אתה רוצה להציג את ה-`value` במקום `1` בתוך כל ריבוע. נסה לעשות את זה ככה:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

אופס, זה לא מה שרצית:

![לוח מלא ב-value](../images/tutorial/board-filled-with-value.png)

רצית לעבד את המשתנה JavaScript בשם `value` מהרכיב שלך, לא את המילה "ערך". כדי "לברוח לתוך JavaScript" מ-JSX, אתה צריך פלטה מתולתלת. הוסף פלטה מתולתלת סביב `value` ב-JSX כך:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

לעת עתה, אתה אמור לראות לוח ריק:

![לוח ריק](../images/tutorial/empty-board.png)

זה בגלל שuse הרכיב `Board` עדיין לא העביר את הפרופס של `value` לכל רכיב `Square` שהוא מעבד. כדי לתקן את זה, תוסיף את הפרופט `value` לכל רכיב `Square` המעובד על ידי הרכיב `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

כעת אתה אמור לראות שוב רשת של מספרים:

![לוח טיק-טאק-בוהן מלא במספרים 1 עד 9](../images/tutorial/number-filled-board.png)

הקוד המעודכן שלך אמור להיראות כך:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
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

### יצירת רכיב אינטראקטיבי {/*making-an-interactive-component*/}

בוא נמלא את הרכיב `Square` ב-`X` כשתלחץ עליו. הכריז על פונקציה בשם `handleClick` בתוך ה-`Square`. לאחר מכן, הוסף את `onClick` ל-props של רכיב הלחצן JSX שהוחזר מה-`Square`:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

אם תלחץ על ריבוע כעת, אתה אמור לראות יומן שאומר `"clicked!"` בלשונית _Console_ בתחתית הקטע _Drowser_ ב-CodeSandbox. לחיצה על הריבוע יותר מפעם אחת תירשם שוב את `"clicked!"`. יומני מסוף חוזרים עם אותה הודעה לא ייצרו יותר שורות במסוף. במקום זאת, תראה מונה הולך וגדל ליד יומן ה-`"clicked!"` הראשון שלך.

<Note>

אם אתה עוקב אחר הדרכה זו באמצעות סביבת הפיתוח המקומית שלך, עליך לפתוח את המסוף של הדפדפן שלך. לדוגמה, אם אתה use דפדפן Chrome, תוכל להציג את המסוף באמצעות מקשי הקיצור **Shift + Ctrl + J** (ב-Windows/Linux) או **Option + ⌘ + J** (ב-macOS).

</Note>

כשלב הבא, אתה רוצה שרכיב הריבוע "יזכור" שנלחץ עליו וימלא אותו בסימון "X". כדי "לזכור" דברים, רכיבים use *state*.

React מספק פונקציה מיוחדת בשם `useState` שתוכל לקרוא מהרכיב שלך כדי לאפשר לו "לזכור" דברים. בואו נאחסן את הערך הנוכחי של ה-`Square` ב-state, ונשנה אותו כאשר ה-`Square` נלחץ.

ייבא `useState` בחלק העליון של הקובץ. הסר את אביזר `value` מהרכיב `Square`. במקום זאת, הוסף שורה חדשה בתחילת ה-`Square` הקוראת `useState`. בקש ממנו להחזיר משתנה state בשם `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` מאחסן את הערך ו`setValue` היא פונקציה שיכולה להיות used כדי לשנות את הערך. ה-`null` המועבר ל-`useState` הוא used כערך ההתחלתי של משתנה state זה, כך ש-`value` כאן מתחיל שווה ל-`null`.

מכיוון שהרכיב `Square` כבר לא מקבל יותר את props, תסיר את הפרוטוקול `value` מכל תשעת רכיבי הריבוע שנוצרו על ידי רכיב הלוח:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

כעת תשנה את `Square` להצגת "X" כאשר תלחץ. החלף את מטפל האירועים `console.log("clicked!");` ב-`setValue('X');`. כעת רכיב ה-`Square` שלך נראה כך:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

על ידי קריאה לפונקציה `set` זו ממטפל `onClick`, אתה אומר לReact לעבד מחדש את ה-`Square` הזה בכל פעם שנלחץ על ה-`<button>` שלו. לאחר העדכון, ה-`value` של ה-`Square` יהיה `'X'`, כך שתראה את ה-"X" על לוח המשחק. לחץ על ריבוע כלשהו, ​​ו"X" אמור להופיע:

![הוספת xes ללוח](../images/tutorial/tictac-adding-x-s.gif)

לכל ריבוע יש state משלו: ה-`value` המאוחסן בכל ריבוע אינו תלוי לחלוטין באחרים. כאשר אתה קורא לפונקציה `set` ברכיב, React מעדכן אוטומטית גם את רכיבי הצאצא בפנים.

לאחר שביצעת את השינויים לעיל, הקוד שלך ייראה כך:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
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

### React כלים למפתחים {/*react-developer-tools*/}

React DevTools מאפשרים לך לבדוק את props ואת state של רכיבי React שלך. אתה יכול למצוא את הכרטיסייה React DevTools בתחתית הקטע _דפדפן_ ב-CodeSandbox:

![React DevTools ב-CodeSandbox](../images/tutorial/codesandbox-devtools.png)

כדי לבדוק רכיב מסוים על המסך, use הלחצן בפינה השמאלית העליונה של React DevTools:

![בחירת רכיבים בדף עם React DevTools](../images/tutorial/devtools-select.gif)

<Note>

לפיתוח מקומי, React DevTools זמין כ-[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), ו-[Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) סיומת דפדפן. התקן אותה, והכרטיסייה *רכיבים* תופיע בכלי המפתחים של הדפדפן שלך עבור אתרים המשתמשים ב-React.

</Note>

## השלמת המשחק {/*completing-the-game*/}

בשלב זה, יש לך את כל אבני הבניין הבסיסיות למשחק הטיק-טק שלך. כדי שיהיה לך משחק שלם, כעת עליך להציב לסירוגין "X" ו-"O" על הלוח, ואתה צריך דרך לקבוע מנצח.

### הרמת state למעלה {/*lifting-state-up*/}

נכון לעכשיו, כל רכיב `Square` שומר על חלק מה-state של המשחק. כדי לבדוק אם יש מנצח במשחק, ה-`Board` יצטרך לדעת איכשהו את ה-state של כל אחד מ-9 רכיבי ה-`Square`.

איך הייתם ניגשים לזה? בהתחלה, אתה עשוי לנחש שה-`Board` צריך "לבקש" מכל `Square` את ה-state של `Square`. למרות שגישה זו אפשרית מבחינה טכנית ב-React, אנו לא מעודדים אותה מכיוון שuse הקוד הופך להיות קשה להבנה, רגיש לבאגים וקשה לשינוי. במקום זאת, הגישה הטובה ביותר היא לאחסן את state של המשחק ברכיב האב `Board` במקום בכל `Square`. הרכיב `Board` יכול להגיד לכל `Square` מה להציג על ידי העברת אביזר, כמו שעשית כשהעברת מספר לכל ריבוע.

**כדי לאסוף נתונים ממספר ילדים, או כדי ששני רכיבי צאצא יתקשרו זה עם זה, הכריז במקום זאת על ה-state המשותף ברכיב האב שלהם. רכיב האב יכול להעביר את ה-state בחזרה לילדים דרך props. זה שומר על רכיבי הילד מסונכרנים זה עם זה ועם ההורה שלהם.**

העלאת state לרכיב אב היא נפוצה כאשר רכיבי React עוברים מחדש.

בואו ננצל את ההזדמנות כדי לנסות את זה. ערוך את הרכיב `Board` כך שיכריז על משתנה state בשם `squares` שברירת המחדל הוא מערך של 9 null המתאימים ל-9 הריבועים:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` יוצר מערך עם תשעה אלמנטים ומגדיר כל אחד מהם ל-`null`. הקריאה `useState()` מסביבו מכריזה על משתנה `squares` state שמוגדר בתחילה למערך הזה. כל ערך במערך מתאים לערך של ריבוע. כאשר אתה ממלא את הלוח מאוחר יותר, מערך `squares` ייראה כך:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

כעת רכיב ה-`Board` שלך צריך להעביר את משענת `value` לכל `Square` שהוא מעבד:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

לאחר מכן, תערוך את הרכיב `Square` כדי לקבל את הפרופורציה `value` מרכיב הלוח. זה ידרוש הסרה של state המעקב המלא של `value` של רכיב ה-Square ושל הרכיב `onClick` של הכפתור:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

בשלב זה אתה אמור לראות לוח טיק-טק ריק:

![לוח ריק](../images/tutorial/empty-board.png)

והקוד שלך אמור להיראות כך:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
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

כל ריבוע יקבל כעת אבזר `value` שיהיה `'X'`, `'O'` או `null` עבור ריבועים ריקים.

לאחר מכן, עליך לשנות את מה שקורה כאשר לוחצים על `Square`. הרכיב `Board` שומר כעת אילו ריבועים ממולאים. תצטרך ליצור דרך עבור ה-`Square` לעדכן את ה-state של ה-`Board`. מכיוון שstate הוא פרטי לרכיב שמגדיר אותו, לא ניתן לעדכן את ה-state של ה-`Board` ישירות מ-`Square`.

במקום זאת, תעביר פונקציה מהרכיב `Board` לרכיב `Square`, ויהיה לך `Square` לקרוא לפונקציה הזו כאשר לוחצים על ריבוע. תתחיל עם הפונקציה שהרכיב `Square` יקרא כשילחץ עליו. אתה תקרא לפונקציה הזו `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

לאחר מכן, תוסיף את הפונקציה `onSquareClick` ל-props של רכיב `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

כעת תחבר את האביזר `onSquareClick` לפונקציה ברכיב `Board` שתקרא לה `handleClick`. כדי לחבר את `onSquareClick` ל-`handleClick` תעביר פונקציה ל-`onSquareClick` אבזר של רכיב ה-`Square` הראשון:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

לבסוף, תגדיר את הפונקציה `handleClick` בתוך רכיב הלוח כדי לעדכן את מערך `squares` המחזיק את ה-state של הלוח שלך:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

הפונקציה `handleClick` יוצרת עותק של מערך `squares` (`nextSquares`) בשיטת JavaScript `slice()` מערך. לאחר מכן, `handleClick` מעדכן את מערך `nextSquares` כדי להוסיף `X` לריבוע הראשון (`[0]` אינדקס).

קריאה לפונקציה `setSquares` מאפשרת ל-React לדעת שה-state של הרכיב השתנה. זה יפעיל עיבוד מחדש של הרכיבים שuse ה-`squares` state (`Board`) וכן רכיבי הצאצא שלו (רכיבי `Square` המרכיבים את הלוח).

<Note>

JavaScript תומך ב-[סגירות](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) כלומר לפונקציה פנימית (למשל `handleClick`) יש גישה למשתנים ופונקציות המוגדרות בפונקציה חיצונית (למשל `Board`). הפונקציה `handleClick` יכולה לקרוא את `squares` `handleClick` הן השיטה __TK__ca___ והן קוראים לשיטה __TK__ca___ מוגדר בתוך הפונקציה `Board`.

</Note>

עכשיו אתה יכול להוסיף איקסים ללוח... אבל רק לריבוע השמאלי העליון. הפונקציה `handleClick` שלך מקודדת קשה כדי לעדכן את האינדקס עבור הריבוע השמאלי העליון (`0`). בואו נעדכן את `handleClick` כדי שנוכל לעדכן כל ריבוע. הוסף ארגומנט `i` לפונקציה `handleClick` שלוקח את האינדקס של הריבוע לעדכון:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

לאחר מכן, תצטרך להעביר את ה-`i` ל-`handleClick`. אתה יכול לנסות להגדיר את משענת `onSquareClick` של הריבוע להיות `handleClick(0)` ישירות ב-JSX כך, אבל זה לא יעבוד:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

הנה הסיבה שזה לא עובד. הקריאה `handleClick(0)` תהיה חלק מהעיבוד של רכיב הלוח. Because `handleClick(0)` משנה את state של רכיב הלוח על ידי קריאה ל-`setSquares`, כל רכיב הלוח שלך יעובד מחדש שוב. אבל זה מריץ את `handleClick(0)` שוב, מה שמוביל ללולאה אינסופית:

<ConsoleBlock level="error">

יותר מדי עיבודים חוזרים. React מגביל את מספר העיבודים כדי למנוע לולאה אינסופית.

</ConsoleBlock>

למה הבעיה הזו לא קרתה קודם?

כשעברת את `onSquareClick={handleClick}`, העברת את הפונקציה `handleClick` למטה בתור אביזר. לא קראת לזה! אבל עכשיו אתה *קורא* לפונקציה הזו מיד - שימו לב לסוגריים ב-`handleClick(0)` - וזו הסיבה שהיא פועלת מוקדם מדי. אתה לא *רוצה* להתקשר ל-`handleClick` עד שה-user ילחץ!

אתה יכול לתקן זאת על ידי יצירת פונקציה כמו `handleFirstSquareClick` שקוראת ל`handleClick(0)`, פונקציה כמו `handleSecondSquareClick` שקוראת ל`handleClick(1)`, וכן הלאה. אתה תעביר (במקום לקרוא) את הפונקציות האלה בתור props כמו `onSquareClick={handleFirstSquareClick}`. זה יפתור את הלולאה האינסופית.

עם זאת, הגדרת תשע פונקציות שונות ומתן שם לכל אחת מהן היא מילולית מדי. במקום זאת, בוא נעשה את זה:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

שימו לב לתחביר `() =>` החדש. כאן, `() => handleClick(0)` היא *פונקציית חץ,* שהיא דרך קצרה יותר להגדרת פונקציות. כשלוחצים על הריבוע, הקוד שאחרי ה"חץ" `=>` יפעל, ויקרא `handleClick(0)`.

עכשיו אתה צריך לעדכן את שמונה הריבועים האחרים כדי לקרוא `handleClick` מפונקציות החצים שאתה מעביר. ודא שהארגומנט עבור כל קריאה של `handleClick` מתאים לאינדקס של הריבוע הנכון:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
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
};
```

כעת תוכל שוב להוסיף איקסים לכל ריבוע בלוח על ידי לחיצה עליהם:

![מילוי הלוח ב-X](../images/tutorial/tictac-adding-x-s.gif)

אבל הפעם כל ניהול state מטופל על ידי רכיב `Board`!

כך אמור להיראות הקוד שלך:

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

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
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

כעת, כשהטיפול ב-state שלך נמצא ברכיב `Board`, רכיב האב `Board` מעביר את props לרכיבי ה-`Square` הצאצא כדי שניתן יהיה להציג אותם בצורה נכונה. בעת לחיצה על `Square`, הרכיב `Square` הילד מבקש כעת מהרכיב `Board` האב לעדכן את ה-state של הלוח. כאשר ה-state של `Board` משתנה, גם הרכיב `Board` וגם כל ילד `Square` מעבדים מחדש אוטומטית. שמירת ה-state של כל המשבצות ברכיב `Board` תאפשר לה לקבוע את המנצח בעתיד.

בואו נסכם מה קורה כאשר user לוחץ על הריבוע השמאלי העליון בלוח שלך כדי להוסיף לו `X`:

1. לחיצה על הריבוע השמאלי העליון מפעילה את הפונקציה שה-`button` קיבל בתור ה-`onClick` שלו מה-`Square`. הרכיב `Square` קיבל את הפונקציה הזו בתור ה-`onSquareClick` שלו מה-`Board`. הרכיב `Board` הגדיר את הפונקציה הזו ישירות ב-JSX. זה קורא ל-`handleClick` עם ארגומנט של `0`.
1. `handleClick` uses הארגומנט (`0`) לעדכון האלמנט הראשון של מערך `squares` מ`null` ל`X`.
1. ה-`squares` state של הרכיב `Board` עודכן, כך שה-`Board` וכל ילדיו מעבדים מחדש. זה כuse הוא הפרופס של `value` של הרכיב `Square` עם אינדקס `0` לשינוי מ`null` ל`X`.

בסופו של דבר ה-user רואה שהריבוע השמאלי העליון השתנה מריק ל-`X` לאחר לחיצה עליו.

<Note>

לתכונה `onClick` של האלמנט DOM `<button>` יש משמעות מיוחדת ל-React מכיוון שהוא רכיב מובנה. עבור רכיבים מותאמים אישית כמו Square, השם תלוי בך. אתה יכול לתת כל שם לפונקציה `onSquareClick` של `Square` או לפונקציה `handleClick` של `Board`, והקוד יעבוד אותו הדבר. ב-React, מקובל ל-use `onSomething` שמות עבור props המייצגים אירועים ו`handleSomething` עבור הגדרות הפונקציות המטפלות באותם אירועים.

</Note>

### מדוע אי-שינוי חשוב {/*why-immutability-is-important*/}

שים לב כיצד ב-`handleClick`, אתה קורא ל-`.slice()` כדי ליצור עותק של מערך `squares` במקום לשנות את המערך הקיים. כדי להסביר מדוע, עלינו לדון בחוסר משתנה ומדוע חשוב ללמוד חוסר משתנה.

יש בדרך כלל שתי גישות לשינוי נתונים. הגישה הראשונה היא לבצע _מוטציה_ של הנתונים על ידי שינוי ישיר של ערכי הנתונים. הגישה השנייה היא להחליף את הנתונים בעותק חדש שיש בו את השינויים הרצויים. כך זה ייראה אם ​​תשנה את מערך `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

וכך זה ייראה אם ​​תשנה נתונים מבלי לשנות את מערך `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

התוצאה זהה אבל אם לא עוברים מוטציה (שינוי הנתונים הבסיסיים) ישירות, אתה מרוויח מספר יתרונות.

חוסר שינוי הופכת תכונות מורכבות להרבה יותר קלות ליישום. בהמשך המדריך הזה, תטמיעו תכונה של "מסע בזמן" המאפשרת לכם לסקור את היסטוריית המשחק ו"לקפוץ אחורה" למהלכי העבר. פונקציונליות זו אינה ספציפית למשחקים - היכולת לבטל ולבצע מחדש פעולות מסוימות היא דרישה נפוצה עבור אפליקציות. הימנעות ממוטציה ישירה של נתונים מאפשרת לך לשמור על גרסאות קודמות של הנתונים ללא פגע, ולחזורuse אותן מאוחר יותר.

יש גם יתרון נוסף של חוסר שינוי. כברירת מחדל, כל רכיבי הצאצא מעבדים מחדש אוטומטית כאשר state של רכיב אב משתנה. זה כולל אפילו את רכיבי הצאצא שלא הושפעו מהשינוי. למרות שעיבוד מחדש אינו מורגש כשלעצמו ל-user (לא כדאי לנסות באופן אקטיבי להימנע ממנו!), ייתכן שתרצה לדלג על עיבוד מחדש של חלק מהעץ שברור שלא הושפע ממנו מסיבות ביצועים. חוסר השינוי עושה את זה זול מאוד עבור רכיבים להשוות בין אם הנתונים שלהם השתנו או לא. תוכל ללמוד עוד על האופן שבו React בוחר מתי לעבד מחדש רכיב ב[ההפניה `memo` API](/reference/react/memo).

### מתחלפים {/*taking-turns*/}

הגיע הזמן לתקן פגם גדול במשחק התקתק הזה: לא ניתן לסמן את ה"O" על הלוח.

אתה תגדיר את המהלך הראשון להיות "X" כברירת מחדל. בוא נעקוב אחר זה על ידי הוספת חלק נוסף של state לרכיב הלוח:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

בכל פעם ששחקן זז, `xIsNext` (בוליאן) יתהפך כדי לקבוע מי השחקן הבא וה-state של המשחק יישמר. תעדכן את הפונקציה `handleClick` של `Board` כדי להפוך את הערך של `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

כעת, כאשר אתה לוחץ על ריבועים שונים, הם יתחלפו בין `X` ל-`O`, כמו שצריך!

אבל רגע, יש בעיה. נסה ללחוץ על אותו ריבוע מספר פעמים:

![O מדרוס X](../images/tutorial/o-replaces-x.gif)

ה-`X` מוחלף על ידי `O`! למרות שזה יוסיף טוויסט מאוד מעניין למשחק, אנחנו הולכים לדבוק בכללים המקוריים לעת עתה.

כאשר אתה מסמן ריבוע עם `X` או `O` אתה לא בודק תחילה אם לריבוע כבר יש ערך `X` או `O`. אתה יכול לתקן זאת על ידי *חזרה מוקדמת*. תבדוק אם בריבוע כבר יש `X` או `O`. אם הריבוע כבר מלא, תבצע `return` בפונקציה `handleClick` מוקדם--לפני שהיא תנסה לעדכן את הלוח state.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

עכשיו אתה יכול להוסיף רק `X` או `O` לריבועים ריקים! כך אמור להיראות הקוד שלך בשלב זה:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
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

### הכרזת זוכה {/*declaring-a-winner*/}

עכשיו כשהשחקנים יכולים להתחלף, תרצה להראות מתי המשחק מנצח ואין יותר תורים לעשות. לשם כך תוסיף פונקציית מסייעת בשם `calculateWinner` שלוקחת מערך של 9 ריבועים, בודקת מנצח ומחזירה `'X'`, `'O'`, או `null` לפי המתאים. אל תדאג יותר מדי לגבי הפונקציה `calculateWinner`; זה לא ספציפי ל-React:

```js src/App.js
export default function Board() {
  //...
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
    [2, 4, 6]
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

<Note>

זה לא משנה אם אתה מגדיר `calculateWinner` לפני או אחרי ה-`Board`. בוא נשים את זה בסוף כדי שלא תצטרך לגלול מעבר לזה בכל פעם שאתה עורך את הרכיבים שלך.

</Note>

אתה תקרא `calculateWinner(squares)` בפונקציית `handleClick` של רכיב `Board` כדי לבדוק אם שחקן ניצח. אתה יכול לבצע בדיקה זו באותו זמן שאתה בודק אם user לחץ על ריבוע שכבר יש לו `X` או ו`O`. נרצה לחזור מוקדם בשני המקרים:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

כדי ליידע את השחקנים מתי המשחק נגמר, אתה יכול להציג טקסט כגון "זוכה: X" או "מנצח: O". לשם כך תוסיף קטע `status` לרכיב `Board`. הסטטוס יציג את המנצח אם המשחק יסתיים ואם המשחק נמשך תציג את התור הבא של השחקן:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

מזל טוב! עכשיו יש לך משחק טיק-טק-בוהן עובד. וזה עתה למדת גם את היסודות של React. אז _אתה_ הזוכה האמיתי כאן. כך אמור להיראות הקוד:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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

## הוספת מסע בזמן {/*adding-time-travel*/}

כתרגיל אחרון, בואו נאפשר "לחזור אחורה בזמן" למהלכים הקודמים במשחק.

### אחסון היסטוריה של מהלכים {/*storing-a-history-of-moves*/}

אם שיניתם את מערך `squares`, יישום מסע בזמן יהיה קשה מאוד.

עם זאת, used `slice()` כדי ליצור עותק חדש של מערך `squares` לאחר כל מהלך, והתייחסת אליו כבלתי ניתן לשינוי. זה יאפשר לך לאחסן כל גרסה קודמת של מערך `squares`, ולנווט בין הפניות שכבר קרו.

אתה תשמור את מערכי `squares` הקודמים במערך אחר בשם `history`, אותו תשמור כמשתנה state חדש. מערך `history` מייצג את כל ה-states של הלוח, מהמהלך הראשון ועד האחרון, ויש לו צורה כזו:

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### הרמת state למעלה, שוב {/*lifting-state-up-again*/}

כעת תכתוב רכיב חדש ברמה העליונה בשם `Game` כדי להציג רשימה של מהלכים קודמים. זה המקום שבו תציב את `history` state שמכיל את כל היסטוריית המשחק.

הצבת `history` state לתוך הרכיב `Game` תאפשר לך להסיר את `squares` state מהרכיב הצאצא `Board` שלו. בדיוק כמו ש"הרמת state למעלה" מהרכיב `Square` לרכיב `Board`, כעת תעלה אותו מה-`Board` לרכיב `Game` ברמה העליונה. זה נותן לרכיב `Game` שליטה מלאה על הנתונים של `Board` ומאפשר לו להורות ל`Board` לעבד פניות קודמות מה-`history`.

ראשית, הוסף רכיב `Game` עם `export default`. בקש ממנו לעבד את הרכיב `Board` וסימון מסוים:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

שים לב שאתה מסיר את מילות המפתח `export default` לפני הצהרת `function Board() {` ומוסיף אותן לפני הצהרת `function Game() {`. זה אומר לקובץ `index.js` שלך use את רכיב `Game` כרכיב ברמה העליונה במקום רכיב `Board` שלך. `div`s הנוספים המוחזרים על ידי רכיב `Game` מפנים מקום למידע המשחק שתוסיף ללוח מאוחר יותר.

הוסף קצת state לרכיב `Game` כדי לעקוב אחר השחקן הבא ואחר ההיסטוריה של המהלכים:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

שימו לב כיצד `[Array(9).fill(null)]` הוא מערך עם פריט בודד, שהוא עצמו מערך של 9 `null`s.

כדי להציג את הריבועים עבור המהלך הנוכחי, תרצה לקרוא את מערך הריבועים האחרון מה-`history`. אתה לא צריך `useState` בשביל זה - כבר יש לך מספיק מידע כדי לחשב אותו במהלך העיבוד:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

לאחר מכן, צור פונקציה `handlePlay` בתוך הרכיב `Game` שייקרא על ידי הרכיב `Board` כדי לעדכן את המשחק. העבר את `xIsNext`, `currentSquares` ו`handlePlay` בתור props לרכיב `Board`:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

בואו נהפוך את הרכיב `Board` לשלוט מלא על ידי ה-props שהוא מקבל. שנה את הרכיב `Board` כדי לקחת שלושה props: `xIsNext`, `squares`, ופונקציה חדשה `onPlay` ש-`Board` יכול לקרוא עם מערך הריבועים המעודכן כאשר שחקן מבצע תנועה. לאחר מכן, הסר את שתי השורות הראשונות של הפונקציה `Board` שקוראות ל-`useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

כעת החלף את הקריאות `setSquares` ו`setXIsNext` ב-`handleClick` ברכיב `Board` בקריאה בודדת לפונקציית `onPlay` החדשה שלך כך שרכיב `Game` יוכל לעדכן את ה-`Board` כאשר ה-user לוחץ על ריבוע:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

הרכיב `Board` נשלט במלואו על ידי ה-props המועבר אליו על ידי הרכיב `Game`. עליך ליישם את הפונקציה `handlePlay` ברכיב `Game` כדי שהמשחק יפעל שוב.

מה צריך `handlePlay` לעשות כשקוראים לו? זכור כי לוח used להתקשר ל-`setSquares` עם מערך מעודכן; כעת הוא מעביר את מערך `squares` המעודכן ל-`onPlay`.

הפונקציה `handlePlay` צריכה לעדכן את state של `Game` כדי להפעיל רינדור מחדש, אבל אין לך פונקציה `setSquares` שתוכל לקרוא לה יותר - אתה משתמש כעת במשתנה `history` state כדי לאחסן מידע זה. תרצה לעדכן את `history` על ידי הוספת מערך `squares` המעודכן כערך היסטוריה חדש. אתה גם רוצה לשנות את `xIsNext`, בדיוק כפי שהלוח used צריך לעשות:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

כאן, `[...history, nextSquares]` יוצר מערך חדש המכיל את כל הפריטים ב-`history`, ואחריו `nextSquares`. (תוכל לקרוא את `...history` [*תחביר התפשטות*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) בתור "למנות את כל הפריטים ב-`history`".)

לדוגמה, אם `history` הוא `[[null,null,null], ["X",null,null]]` ו`nextSquares` הוא `["X",null,"O"]`, אז המערך `[...history, nextSquares]` החדש יהיה `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

בשלב זה, העברת את ה-state לחיות ברכיב `Game`, והממשק משתמש אמור לפעול במלואו, בדיוק כפי שהיה לפני ה-refactor. כך אמור להיראות הקוד בשלב זה:

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
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

### מציג את המהלכים העבר {/*showing-the-past-moves*/}

מכיוון שאתה מתעד את ההיסטוריה של משחק התקתק, כעת תוכל להציג רשימה של מהלכי העבר לשחקן.

React אלמנטים כמו `<button>` הם אובייקטים JavaScript רגילים; אתה יכול להעביר אותם באפליקציה שלך. כדי להציג מספר פריטים ב-React, אתה יכול use מערך של אלמנטים React.

כבר יש לך מערך של `history` מהלכים ב-state, אז עכשיו אתה צריך להפוך אותו למערך של אלמנטים React. ב-JavaScript, כדי להפוך מערך אחד למשנהו, אתה יכול use בשיטת [מערך `map`:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

אתה use `map` כדי להפוך את `history` המהלכים שלך לאלמנטים React המייצגים כפתורים על המסך, ותציג רשימה של כפתורים כדי "לקפוץ" למהלכים קודמים. בואו נעבור `map` על ה-`history` ברכיב המשחק:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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
```

אתה יכול לראות איך הקוד שלך צריך להיראות למטה. שים לב שאתה אמור לראות שגיאה במסוף כלי המפתחים האומרת:

<ConsoleBlock level="warning">
אזהרה: לכל ילד במערך או באיטרטור צריך להיות אביזר "מפתח" ייחודי. בדוק את שיטת העיבוד של 'משחק'.
</ConsoleBlock>
  
אתה תתקן את השגיאה הזו בסעיף הבא.

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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

בזמן שאתה חוזר על מערך `history` בתוך הפונקציה שהעברת ל-`map`, הארגומנט `squares` עובר דרך כל אלמנט של `history`, והארגומנט `move` עובר דרך כל אינדקס מערך: `0`, `1`, `2`, …. (ברוב המקרים, תזדקק לרכיבי המערך בפועל, אך כדי לעבד רשימה של מהלכים תצטרך רק אינדקסים.)

עבור כל מהלך בהיסטוריה של משחק הטיק-טק, אתה יוצר פריט רשימה `<li>` המכיל כפתור `<button>`. לכפתור יש מטפל `onClick` אשר קורא לפונקציה בשם `jumpTo` (שעדיין לא יישמתם).

לעת עתה, אתה אמור לראות רשימה של המהלכים שהתרחשו במשחק ושגיאה בקונסולת כלי המפתחים. בואו נדון במשמעות השגיאה "מפתח".

### בחירת מפתח {/*picking-a-key*/}

כאשר אתה מעבד רשימה, React מאחסן מידע על כל פריט רשימה שעובד. כאשר אתה מעדכן רשימה, React צריך לקבוע מה השתנה. יכולת להוסיף, להסיר, לסדר מחדש או לעדכן את פריטי הרשימה.

תאר לעצמך מעבר מ

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

בנוסף לספירות המעודכנות, אדם שקורא את זה כנראה יגיד שהחלפת את ההזמנה של אלכסה ובן והכנסת את קלאודיה בין אלכסה ובן. עם זאת, React היא תוכנת מחשב ואינה יודעת למה התכוונת, לכן עליך לציין מאפיין _key_ עבור כל פריט רשימה כדי להבדיל כל פריט רשימה מאחיו. אם הנתונים שלך היו ממסד נתונים, מזהי מסד הנתונים של אלקסה, בן וקלאודיה יכולים להיות used כמפתחות.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

כאשר רשימה מעובדת מחדש, React לוקח את המפתח של כל פריט רשימה ומחפש בפריטים של הרשימה הקודמת מפתח תואם. אם לרשימה הנוכחית יש מפתח שלא היה קיים קודם לכן, React יוצר רכיב. אם ברשימה הנוכחית חסר מפתח שהיה קיים ברשימה הקודמת, React הורס את הרכיב הקודם. אם שני מקשים תואמים, הרכיב המתאים מועבר.

מפתחות מספרים לReact על הזהות של כל רכיב, מה שמאפשר לReact לשמור על state בין רינדור מחדש. אם מפתח של רכיב משתנה, הרכיב ייהרס ויווצר מחדש עם state חדש.

`key` הוא נכס מיוחד ושמור בReact. כאשר אלמנט נוצר, React מחלץ את המאפיין `key` ומאחסן את המפתח ישירות על האלמנט המוחזר. למרות ש-`key` עשוי להיראות כאילו הוא מועבר כ-props, React אוטומטית uses `key` כדי להחליט אילו רכיבים לעדכן. אין דרך לרכיב לשאול מה `key` ההורה שלו ציין.

**מומלץ מאוד להקצות מפתחות מתאימים בכל פעם שאתה בונה רשימות דינמיות.** אם אין לך מפתח מתאים, מומלץ לשקול ארגון מחדש של הנתונים שלך כך שתעשה זאת.

אם לא צוין מפתח, React ידווח על שגיאה וuse אינדקס המערך כמפתח כברירת מחדל. השימוש באינדקס המערך כמפתח הוא בעייתי כאשר מנסים לסדר מחדש פריטי רשימה או הכנסה/הסרה של פריטי רשימה. מעבר מפורש של `key={i}` משתיק את השגיאה אך יש לו אותן בעיות כמו מדדי מערך ואינו מומלץ ברוב המקרים.

מפתחות אינם צריכים להיות ייחודיים בעולם; הם רק צריכים להיות ייחודיים בין רכיבים לאחים שלהם.

### יישום מסע בזמן {/*implementing-time-travel*/}

בהיסטוריה של משחק התקלות, לכל מהלך עבר יש מזהה ייחודי המשויך אליו: זה המספר הרציף של המהלך. מהלכים לעולם לא יסודרו מחדש, יימחקו או יוכנסו באמצע, כך שבטוח use אינדקס המהלך כמפתח.

בפונקציה `Game`, אתה יכול להוסיף את המפתח בתור `<li key={move}>`, ואם תטען מחדש את המשחק המעובד, השגיאה "מפתח" של React אמורה להיעלם:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

לפני שתוכל ליישם את `jumpTo`, אתה צריך את הרכיב `Game` כדי לעקוב אחר השלב שבו ה-user מציג כעת. כדי לעשות זאת, הגדר משתנה state חדש בשם `currentMove`, ברירת המחדל הוא `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

לאחר מכן, עדכן את הפונקציה `jumpTo` בתוך `Game` כדי לעדכן את ה-`currentMove` הזה. תגדיר גם את `xIsNext` ל-`true` אם המספר שאליו אתה משנה את `currentMove` הוא זוגי.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

כעת תבצע שני שינויים בפונקציית `handlePlay` של `Game` שנקראת כאשר אתה לוחץ על ריבוע.

- אם אתה "חוזר אחורה בזמן" ואז עושה מהלך חדש מאותה נקודה, אתה רק רוצה לשמור את ההיסטוריה עד לנקודה זו. במקום להוסיף `nextSquares` אחרי כל הפריטים (`...` תחביר מפוזר) ב-`history`, תוסיף אותו אחרי כל הפריטים ב-`history.slice(0, currentMove + 1)` כך שתשמור רק את החלק הזה מההיסטוריה הישנה.
- בכל פעם שמתבצע מהלך, עליך לעדכן את `currentMove` כדי להצביע על ערך ההיסטוריה האחרון.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

לבסוף, תשנה את הרכיב `Game` כדי להציג את המהלך שנבחר כעת, במקום לעבד תמיד את המהלך הסופי:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

אם אתה לוחץ על שלב כלשהו בהיסטוריית המשחק, לוח הטיק-טאק-בוהן אמור להתעדכן מיד כדי להראות איך הלוח נראה לאחר השלב הזה.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
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

### ניקוי סופי {/*final-cleanup*/}

אם תסתכל על הקוד מקרוב, ייתכן שתבחין ש`xIsNext === true` כאשר `currentMove` הוא זוגי ו`xIsNext === false` כאשר `currentMove` הוא אי זוגי. במילים אחרות, אם אתה יודע את הערך של `currentMove`, אז אתה תמיד יכול להבין מה צריך להיות `xIsNext`.

אין סיבה שתשמור את שניהם ב-state. למעשה, נסה תמיד להימנע מ-state מיותר. הפישוט של מה שאתה מאחסן ב-state מפחית באגים ומקל על ההבנה של הקוד שלך. שנה את `Game` כך שהוא לא יאחסן את `xIsNext` כמשתנה state נפרד ובמקום זאת יבין אותו על סמך ה-`currentMove`:

```js {4,11,15}
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
  // ...
}
```

אינך זקוק עוד להצהרת `xIsNext` state או את הקריאות אל `setXIsNext`. כעת, אין סיכוי ל-`xIsNext` לצאת מסנכרון עם `currentMove`, גם אם תעשו טעות בזמן קידוד הרכיבים.

### מסיימים את {/*wrapping-up*/}

מזל טוב! יצרת משחק תקלות ש:

- מאפשר לך לשחק טיק-טק,
- מציין מתי שחקן ניצח במשחק,
- מאחסן את ההיסטוריה של המשחק עם התקדמות המשחק,
- מאפשר לשחקנים לסקור את היסטוריית המשחק ולראות גרסאות קודמות של לוח המשחק.

עבודה יפה! אנו מקווים שעכשיו אתה מרגיש שיש לך הבנה טובה של איך React עובד.

בדוק את התוצאה הסופית כאן:

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

אם יש לך זמן נוסף או אם אתה רוצה לתרגל את כישורי ה-React החדשים שלך, הנה כמה רעיונות לשיפורים שתוכל לעשות במשחק הטיק-טק-בוהן, המפורטים לפי סדר הקושי הגובר:

1. עבור המהלך הנוכחי בלבד, הראה "אתה בתנועה מס'..." במקום כפתור.
1. שכתבו מחדש את `Board` ל-use שתי לולאות כדי ליצור את הריבועים במקום לקודד אותם.
1. הוסף לחצן החלפת מצב המאפשר לך למיין את המהלכים בסדר עולה או יורד.
1. כאשר מישהו מנצח, הדגש את שלושת המשבצות שעשו את הניצחון (וכאשר אף אחד לא מנצח, הצג הודעה על כך שהתוצאה היא תיקו).
1. הצג את המיקום עבור כל מהלך בפורמט (שורה, קול) ברשימת היסטוריית המעבר.

לאורך המדריך הזה, נגעת במושגים של React כולל אלמנטים, רכיבים, props וstate. כעת, לאחר שראית כיצד המושגים הללו עובדים בעת בניית משחק, בדוק את [Thinking in React](/learn/thinking-in-react) כדי לראות כיצד אותם מושגים React פועלים בעת בניית ממשק משתמש של אפליקציה.
