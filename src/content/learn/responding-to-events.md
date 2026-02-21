---
title: "תגובה לאירועים"
---

<Intro>

React מאפשר לך להוסיף *מטפלי אירועים* ל-JSX שלך. מטפלי אירועים הם פונקציות משלך שיופעלו בתגובה לאינטראקציות כמו לחיצה, ריחוף, מיקוד של קלט טופס וכן הלאה.

</Intro>

<YouWillLearn>

* דרכים שונות לכתוב מטפל באירועים
* איך להעביר לוגיקת טיפול באירועים מרכיב אב
* איך אירועים מתפשטים וכיצד לעצור אותם

</YouWillLearn>

## הוספת מטפלי אירועים {/*adding-event-handlers*/}

כדי להוסיף מטפל באירועים, תחילה תגדיר פונקציה ולאחר מכן [תעביר אותה כעזר](/learn/passing-props-to-a-component) לתג JSX המתאים. לדוגמה, הנה כפתור שעדיין לא עושה כלום:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

אתה יכול לגרום לזה להציג הודעה כאשר user לוחץ על ידי ביצוע שלושת השלבים הבאים:

1. הכריז על פונקציה בשם `handleClick` *בתוך* רכיב ה-`Button` שלך.
2. יישם את ההיגיון בתוך אותה פונקציה (use `alert` כדי להציג את ההודעה).
3. הוסף `onClick={handleClick}` ל-`<button>` JSX.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

הגדרת את הפונקציה `handleClick` ולאחר מכן [העברת אותה כעזר](/learn/passing-props-to-a-component) ל-`<button>`.  `handleClick` הוא **מטפל באירועים.** פונקציות של מטפל באירועים:

* בדרך כלל מוגדרים *בתוך* הרכיבים שלך.
* יש שמות שמתחילים ב-`handle`, ואחריו שם האירוע.

לפי המוסכמה, מקובל לתת שם למטפלי אירועים כ-`handle` ואחריו שם האירוע. לעתים קרובות תראה `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` וכן הלאה.

לחלופין, אתה יכול להגדיר מטפל אירועים מוטבע ב-JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

או, באופן תמציתי יותר, באמצעות פונקציית חץ:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

כל הסגנונות הללו שווים. מטפלי אירועים מוטבעים נוחים לפונקציות קצרות.

<Pitfall>

יש להעביר פונקציות המועברות למטפלי אירועים, לא לקרוא. לְדוּגמָה:

| העברת פונקציה (נכון) | קריאה לפונקציה (שגויה) |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

ההבדל הוא דק. בדוגמה הראשונה, הפונקציה `handleClick` מועברת כמטפל באירועים `onClick`. זה אומר לReact לזכור אותו ולהתקשר לפונקציה שלך רק כאשר ה-user לוחץ על הכפתור.

בדוגמה השנייה, ה-`()` בסוף `handleClick()` מפעיל את הפונקציה *מייד* במהלך [עיבוד](/learn/render-and-commit), ללא כל קליקים. זה בגלל שuse JavaScript בתוך [JSX `{` ו`}`](/learn/javascript-in-jsx-with-curly-braces) מבוצעים מיד.

כשאתה כותב קוד בשורה, אותה בור מציגה את עצמה בצורה שונה:

| העברת פונקציה (נכון) | קריאה לפונקציה (שגויה) |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


העברת קוד מוטבע כזה לא מופעלת בלחיצה - היא מופעלת בכל פעם שהרכיב מעבד:

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

אם אתה רוצה להגדיר את מטפל האירועים שלך בשורה, עטוף אותו בפונקציה אנונימית כך:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

במקום לבצע את הקוד בפנים עם כל רינדור, זה יוצר פונקציה שתיקרא מאוחר יותר.

בשני המקרים, מה שאתה רוצה להעביר הוא פונקציה:

* `<button onClick={handleClick}>` מעביר את הפונקציה `handleClick`.
* `<button onClick={() => alert('...')}>` מעביר את הפונקציה `() => alert('...')`.

[קרא עוד על פונקציות חצים.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### קריאת props במטפלי אירועים {/*reading-props-in-event-handlers*/}

Because מטפלי אירועים מוכרזים בתוך רכיב, יש להם גישה ל-props של הרכיב. הנה כפתור שכאשר לוחצים עליו, מציג התראה עם אביזר ה-`message` שלו:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

זה מאפשר לשני הכפתורים האלה להציג הודעות שונות. נסה לשנות את ההודעות שהועברו אליהם.

### העברת מטפלי אירועים בתור props {/*passing-event-handlers-as-props*/}

לעתים קרובות תרצה שרכיב האב יציין מטפל באירועים של ילד. שקול לחצנים: תלוי איפה אתה משתמש ברכיב `Button`, אולי תרצה לבצע פונקציה אחרת - אולי אחד מנגן סרט ואחר מעלה תמונה.

כדי לעשות זאת, העבירו אבזר שהרכיב מקבל מהאב שלו כמטפל באירועים כך:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

כאן, הרכיב `Toolbar` מעבד `PlayButton` ו`UploadButton`:

- `PlayButton` מעביר את `handlePlayClick` כמשענת `onClick` ל`Button` שבפנים.
- `UploadButton` מעביר את `() => alert('Uploading!')` כמשענת `onClick` ל`Button` שבפנים.

לבסוף, רכיב `Button` שלך מקבל אבזר שנקרא `onClick`. הוא מעביר את העזר הזה ישירות לדפדפן המובנה `<button>` עם `onClick={onClick}`. זה אומר לReact לקרוא לפונקציה שעברה בלחיצה.

אם אתה use [מערכת עיצוב](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), זה נפוץ שרכיבים כמו כפתורים מכילים סגנון אבל לא מציינים התנהגות. במקום זאת, רכיבים כמו `PlayButton` ו-`UploadButton` יעבירו מטפלים באירועים.

### מתן שם לאירוע מטפל props {/*naming-event-handler-props*/}

רכיבים מובנים כמו `<button>` ו-`<div>` תומכים רק ב[שמות אירועי דפדפן](/reference/react-dom/components/common#common-props) כמו `onClick`. עם זאת, כאשר אתה בונה רכיבים משלך, אתה יכול לקרוא למטפל האירועים שלהם props בכל דרך שתרצה.

לפי המוסכמה, מטפל באירועים props צריך להתחיל ב-`on`, ואחריו באות גדולה.

לדוגמה, הרכיב `onClick` של הרכיב `Button` יכול היה להיקרא `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

בדוגמה זו, `<button onClick={onSmash}>` מראה שהדפדפן `<button>` (אותיות קטנות) עדיין זקוק לאביזר בשם `onClick`, אבל שם האביזר שמתקבל על ידי רכיב ה-`Button` המותאם אישית שלך תלוי בך!

כאשר הרכיב שלך תומך באינטראקציות מרובות, אתה יכול לקרוא למטפל באירועים props עבור מושגים ספציפיים לאפליקציה. לדוגמה, רכיב `Toolbar` זה מקבל מטפלי אירועים `onPlayMovie` ו`onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

שימו לב איך הרכיב `App` לא צריך לדעת *מה* `Toolbar` יעשה עם `onPlayMovie` או `onUploadImage`. זה פרט יישום של `Toolbar`. כאן, `Toolbar` מעביר אותם כמטפלי `onClick` ל-`Button`s שלו, אבל זה יכול מאוחר יותר גם להפעיל אותם על קיצור מקשים. מתן שם ל-props לאחר אינטראקציות ספציפיות לאפליקציה כמו `onPlayMovie` נותן לך את הגמישות לשנות את האופן שבו הם used מאוחר יותר.
  
<Note>

ודא שאתה use את התגים HTML המתאימים עבור מטפלי האירועים שלך. לדוגמה, כדי לטפל בלחיצות, use [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) במקום `<div onClick={handleClick}>`. שימוש בדפדפן אמיתי `<button>` מאפשר התנהגויות מובנות בדפדפן כמו ניווט במקלדת. אם אינך אוהב את סגנון הדפדפן המוגדר כברירת מחדל של כפתור וברצונך לגרום לו להיראות יותר כמו קישור או אלמנט כתיבה אחר על ___, תוכל לקבל גישה אליו יותר על ___. סימון.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
  
</Note>

## הפצת אירוע {/*event-propagation*/}

מטפלי אירועים יתפסו גם אירועים מכל הילדים שעשויים להיות לרכיב שלך. אנו אומרים שאירוע "בוע" או "מתפשט" במעלה העץ: הוא מתחיל במקום בו התרחש האירוע, ואז עולה בעץ.

`<div>` זה מכיל שני כפתורים. גם `<div>` *ו* לכל כפתור יש מטפל `onClick` משלהם. אילו מטפלים לדעתך יירו כשתלחץ על כפתור?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

אם תלחץ על אחד מהלחצנים, ה-`onClick` שלו יפעל ראשון, ואחריו ה-`onClick` של האב `<div>`. אז יופיעו שתי הודעות. אם תלחץ על סרגל הכלים עצמו, רק ה-`onClick` של האב `<div>` יפעל.

<Pitfall>

כל האירועים מתפשטים ב-React מלבד `onScroll`, שפועל רק על התג JSX שאליו אתה מצרף אותו.

</Pitfall>

### הפסקת ההפצה {/*stopping-propagation*/}

מטפלי אירועים מקבלים **אובייקט אירוע** כארגומנט היחיד שלהם. לפי המוסכמה, זה נקרא בדרך כלל `e`, אשר מייצג "אירוע". אתה יכול use אובייקט זה כדי לקרוא מידע על האירוע.

אובייקט האירוע הזה גם מאפשר לך לעצור את ההפצה. אם ברצונך למנוע מאירוע להגיע לרכיבי אב, עליך להתקשר ל-`e.stopPropagation()` כמו שרכיב `Button` זה עושה:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

כאשר אתה לוחץ על כפתור:

1. React קורא למטפל `onClick` שהועבר ל`<button>`. 
2. המטפל הזה, המוגדר ב-`Button`, עושה את הפעולות הבאות:
   * מתקשר ל-`e.stopPropagation()`, מונע מהאירוע לבעבע עוד יותר.
   * קורא לפונקציה `onClick`, שהיא אבזר המועבר מהרכיב `Toolbar`.
3. פונקציה זו, המוגדרת ברכיב `Toolbar`, מציגה את ההתראה של הכפתור עצמו.
4. מאז שההפצה הופסקה, המטפל `onClick` של האב `<div>` *לא* פועל.

כתוצאה מ-`e.stopPropagation()`, לחיצה על הכפתורים מציגה כעת רק התראה בודדת (מה-`<button>`) ולא את שניהם (מ-`<button>` ומסרגל הכלים של האב `<div>`). לחיצה על כפתור אינה זהה ללחיצה על סרגל הכלים שמסביב, לכן עצירת ההפצה הגיונית עבור ממשק המשתמש הזה.

<DeepDive>

#### אירועי שלב לכידת {/*capture-phase-events*/}

במקרים נדירים, ייתכן שיהיה עליך לתפוס את כל האירועים ברכיבי צאצא, *גם אם הם הפסיקו את ההפצה*. לדוגמה, אולי אתה רוצה לרשום כל קליק לניתוח, ללא קשר להיגיון ההפצה. אתה יכול לעשות זאת על ידי הוספת `Capture` בסוף שם האירוע:

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

כל אירוע מתפשט בשלושה שלבים:

1. זה נוסע למטה, קורא לכל המטפלים `onClickCapture`.
2. הוא מריץ את המטפל `onClick` של הרכיב שנלחץ. 
3. הוא נוסע כלפי מעלה, קורא לכל המטפלים `onClick`.

אירועי לכידה הם use מלאים עבור קוד כמו נתבים או ניתוחים, אבל כנראה שלא use אותם בקוד האפליקציה.

</DeepDive>

### העברת מטפלים כחלופה להפצה {/*passing-handlers-as-alternative-to-propagation*/}

שים לב כיצד מטפל הקליקים הזה מריץ שורת קוד _ולאחר מכן_ קורא לאוזר `onClick` שהועבר על ידי האב:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

אתה יכול להוסיף עוד קוד למטפל הזה לפני שתקרא גם למטפל `onClick` האב. דפוס זה מספק *אלטרנטיבה* להפצה. זה מאפשר לרכיב הילד לטפל באירוע, ובמקביל מאפשר לרכיב האב לציין התנהגות נוספת. בניגוד להפצה, זה לא אוטומטי. אבל היתרון של הדפוס הזה הוא שאתה יכול לעקוב בבירור אחר כל שרשרת הקוד שמתבצעת כתוצאה מאירוע כלשהו.

אם אתה מסתמך על התפשטות וקשה לאתר אילו מטפלים מבצעים ומדוע, נסה את הגישה הזו במקום זאת.

### מניעת התנהגות ברירת מחדל {/*preventing-default-behavior*/}

לאירועי דפדפן מסוימים יש התנהגות ברירת מחדל הקשורה אליהם. לדוגמה, אירוע שליחה `<form>`, המתרחש כאשר לוחצים על כפתור בתוכו, יטען מחדש את כל העמוד כברירת מחדל:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

אתה יכול להתקשר ל-`e.preventDefault()` באובייקט האירוע כדי למנוע את זה:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

אל תסובב use `e.stopPropagation()` ו`e.preventDefault()`. שניהם useמלאים, אך אינם קשורים:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) עוצר את ההפעלה של מטפלי האירועים המצורפים לתגים למעלה.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) מונעת את התנהגות הדפדפן המוגדרת כברירת מחדל עבור כמה אירועים שיש להם את זה.

## האם למטפלים באירועים יכולים להיות תופעות לוואי? {/*can-event-handlers-have-side-effects*/}

בְּהֶחלֵט! מטפלי אירועים הם המקום הטוב ביותר לתופעות לוואי.

שלא כמו פונקציות רינדור, מטפלי אירועים לא צריכים להיות [טהורים](/learn/keeping-components-pure), אז זה מקום מצוין *לשנות* משהו - לדוגמה, לשנות ערך של קלט בתגובה להקלדה, או לשנות רשימה בתגובה ללחיצת כפתור. עם זאת, כדי לשנות מידע מסוים, תחילה עליך דרך כלשהי לאחסן אותו. ב-React, זה נעשה באמצעות [state, memory של רכיב.](/learn/state-a-components-memory) תלמד הכל על זה בעמוד הבא.

<Recap>

* אתה יכול לטפל באירועים על ידי העברת פונקציה כעזר לאלמנט כמו `<button>`.
* מטפלי אירועים חייבים לעבור, **לא נקרא!** `onClick={handleClick}`, לא `onClick={handleClick()}`.
* ניתן להגדיר פונקציית מטפל באירועים בנפרד או בשורה.
* מטפלי אירועים מוגדרים בתוך רכיב, כך שהם יכולים לגשת ל-props.
* ניתן להכריז על מטפל באירועים בהורה ולהעביר אותו כאביזר לילד.
* אתה יכול להגדיר מטפל אירועים משלך props עם שמות ספציפיים ליישום.
* אירועים מתפשטים כלפי מעלה. התקשר ל-`e.stopPropagation()` בטיעון הראשון כדי למנוע זאת.
* ייתכן שלאירועים יש התנהגות לא רצויה של דפדפן ברירת מחדל. התקשר ל-`e.preventDefault()` כדי למנוע זאת.
* קריאה מפורשת לאביזר של מטפל באירועים ממטפל צאצא היא חלופה טובה להפצה.

</Recap>



<Challenges>

#### תקן מטפל באירועים {/*fix-an-event-handler*/}

לחיצה על כפתור זה אמורה להחליף את רקע העמוד בין לבן לשחור. עם זאת, שום דבר לא קורה כאשר אתה לוחץ עליו. תקן את הבעיה. (אל תדאג לגבי ההיגיון שבתוך `handleClick` - החלק הזה בסדר.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

הבעיה היא ש`<button onClick={handleClick()}>` _קורא_ לפונקציה `handleClick` תוך כדי רינדור במקום _העברת_ אותה. הסרת הקריאה `()` כך שתהיה `<button onClick={handleClick}>` פותרת את הבעיה:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

לחלופין, תוכל לעטוף את השיחה לפונקציה אחרת, כמו `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### קשר את האירועים {/*wire-up-the-events*/}

רכיב `ColorSwitch` זה יוצר כפתור. זה אמור לשנות את צבע העמוד. חבר אותו ל-`onChangeColor` אבזר מטפל באירועים שהוא מקבל מההורה כך שלחיצה על הכפתור משנה את הצבע.

לאחר שתעשה זאת, שים לב שלחיצה על הכפתור גם מגדילה את מונה הקליקים של העמוד. עמיתך שכתב את רכיב האב מתעקש ש`onChangeColor` לא יגדיל מונים. מה עוד עלול לקרות? תקן את זה כך שלחיצה על הכפתור *רק* תשנה את הצבע, ו_לא_ תגדיל את המונה.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

ראשית, עליך להוסיף את המטפל באירועים, כמו `<button onClick={onChangeColor}>`.

עם זאת, זה מציג את הבעיה של מונה ההגדלה. אם `onChangeColor` לא עושה זאת, כפי שעמיתך מתעקש, אז הבעיה היא שהאירוע הזה מתפשט, ואיזה מטפל למעלה עושה את זה. כדי לפתור בעיה זו, עליך להפסיק את ההפצה. אבל אל תשכח שאתה עדיין צריך להתקשר ל-`onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
