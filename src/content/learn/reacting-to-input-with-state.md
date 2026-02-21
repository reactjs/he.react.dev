---
title: "תגובה לקלט עם state"
---

<Intro>

React מספקת דרך הצהרתית לתפעל את ממשק המשתמש. במקום לתפעל חלקים בודדים של ממשק את המשתמש ממש, מתאר את הstate, אתה יכול להיות הרכיב שלך ומחליף בתגובה למשתמש. זה דומה לאופן שבו מעצבים על ממשק המשתמש.

</Intro>

<YouWillLearn>

* איך תכנות UI הצהרתי שונה מתכנות UI הכרחי
* איך למנות את הstates הוויזואליים שיש להם הרכיב שלך יכול להיות
* איך להפעיל את השינויים בין הstates החזותיים מקוד

</YouWillLearn>

## איך ממשק משתמש הצהרתי משתווה לציווי {/*how-declarative-ui-compares-to-imerative*/}

כשאתה מעצב אינטראקציות של ממשק משתמש, אתה כנראה חושב על איך ממשק המשתמש *משתנה* בתגובה לפעולות המשתמש. שקול טופס המאפשר למשתמש לשלוח תשובה:

* כשאתה מקליד משהו בטופס, הלחצן "שלח" **הופך לזמין.**
* כאשר אתה לוחץ על "שלח", גם הטופס וגם הכפתור ** הופכים מושבתים,** ומופיע ספינר **.**
* אם בקשת הרשת מצליחה, הטופס **מוסתר,** והודעת "תודה" **תופיע.**
* אם בקשת הרשת נכשלת, הודעת שגיאה **תופיע** והטופס **מופעל** שוב.

ב**תכנות חובה,** האמור לעיל מתאים ישירות לאופן שבו אתה מיישם אינטראקציה. אתה צריך לכתוב את ההוראות המדויקות כדי לתפעל את ממשק המשתמש בהתאם למה שקרה זה עתה. הנה עוד דרך לחשוב על זה: דמיינו לעצמכם נוסעים ליד מישהו במכונית ואומרים לו סבבה לאן ללכת.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In a car driven by an anxious-looking person representing JavaScript, a passenger orders the driver to execute a sequence of complicated turn by turn navigations." />

הם לא יודעים לאן אתה רוצה, הם פשוט פועלים לפי הפקודות שלך. (ואם אתה טועה בהוראות, אתה מגיע למקום הנכון!) זה נקרא *חוויתי* כי אתה צריך "לפקודה" על כל אלמנט, מהספינר ועד הכפתור, להגיד למחשב *איך* לעדכן את ה-UI.

בדוגמה זו של תכנות UI חיוני, הטופס בנוי *ללא* תגובה. הוא משתמש רק בדפדפן [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

מניפולציה של ממשק המשתמש פועלת באופן הכרחי מספיק טוב עבור דוגמאות בודדות, אך היא הופכת קשה יותר לניהול במערכות מורכבות יותר. דמיינו לעצמכם עדכון של דף מלא בצורות שונות כמו זה. הוספת רכיב ממשק משתמש חדש או אינטראקציה חדשה תדרוש בדיקה קפדנית של כל הקוד הקיים כדי לוודא שלא הצגת באג (לדוגמה, שכחת להציג או להסתיר משהו).

תגיב נבנה כדי לפתור בעיה זו.

ב-React, אינך מבצע מניפולציה ישירה של ממשק משתמש - כלומר מפעיל, משבית, אינך מציג מסתיר רכיבים יחיד. במקום זאת, אתה **מצהיר מה אתה רוצה להציג,** ו-React מגלה כיצד לעדכן את ממשק המשתמש. תחשוב להיכנס למונית ולהנהג לא אתה רוצה להגיד לו בדיוק לא לפנות. זה התפקיד של הנהג להביא אותך לשם, אולי הם אפילו מכירים קיצורי דרך שלא שקלת!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## חושבים על ממשק משתמש הצהרתי {/*thinking-about-ui-declaratively*/}

ראית איך ליישם את האדם האישי למעלה. כדי להבין טוב יותר איך לחשוב ב-React, תעבור על היישום מחדש של ממשק המשתמש הזה ב-React להלן:

1. **זהה** את הstates החזותיים של הרכיב שלך
2. **קבע** מה גורם לשינויי מצב אלה
3. **להציג** את הstate בזיכרון באמצעות 'useState'
4. **הסר** כל משתני מצב שאינם חיוניים
5. **חבר** את הרופא המטפלים כדי להגדיר את הstate

### שלב 1: זה את הstates החזותיים של הרכיב שלך {/*step-1-identify-your-components-different-visual-states*/}

במדעי המחשב, אתה שומע על ["מכונת state"](https://en.wikipedia.org/wiki/Finite-state_machine) ישת באחת מכמה "מצבים". אם אתה עובד עם מעצב, אפשר שראית מוקאפים עבור "מצבים חזותיים" שונים. תגובה עומדת בצומת של מחשב עיצוב ומדעי, כך ששני הרעיונות הללו הם מקורות השראה.

ראשית, עליך לדמיין את כל ה"מצבים" השונים של ממשק המשתמש שהמשתמש עשוי לראות:

* **ריק**: בטופס יש כפתור "שלח" מושבת.
* **הקלדה**: לטופס יש כפתור "שלח" מופעל.
* **שליחה**: הטופס מושבת לחלוטין. ספינר מוצג.
* **הצלחה**: הודעת "תודה" מוצגת במקום טופס.
* **שגיאה**: זהה לstate ההקלדה, אבל עם הודעת שגיאה נוספת.

בדיוק כמו מעצב, תרצה "לעגוג" או ליצור "לעג" עבור הstates לפני שתוסיף את היגיון. לדוגמה, הנה לעג רק לחלק את הוויזואל של הטופס. הדמה הזו נשלטת על ידי props שנקרא `סטטוס` עם ערך ברירת המחדל של `'ריק'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

אתה יכול לקרוא לprops הזה כל דבר שתרצה, השם לא חשוב. נסה לערוך את `status = 'ריק'` ל-`status = 'הצלחה'` כדי לראות את הודעת ההצלחה מופיעה. אתה יכול ללכת מהר על ממשק המשתמש לפני מחבר היגיון. הנה אב טיפוס יותר מושכל של אותו רכיב, שעדיין "נשלט" על ידי props ה'סטטוס':

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### הצגת מצבים חזותיים רבים בו-זמנית {/*הצגת-רבים-וויזואליים-מצבים-בבת-אחת*/}

אם לרכיב יש הרבה מצבים חזותיים, זה יכול להיות נוח להציג את כולם בעמוד אחד:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

דפים כמו זה נקראים לעתים קרובות "מדריכי סגנון חיים" או "ספרי סיפורים".

</DeepDive>

### שלב 2: קבע מה גורם לשינוי הstate האלה {/*שלב-2-קבע-מה-מפעיל-השינויים-הstates-האלה*/}

אתה יכול להפעיל עדכוני מצב בתגובה לשני סוגים של קלט:

* **תשומות אנושיות,** כמו לחיצה על כפתור, הקלדה בשדה, ניווט בקישור.
* **כניסות מחשב,** כמו תגובת רשת שמגיעה, השלמת פסק זמן, טעינת תמונה.

<IllustrationBlock>
  <Illustration caption="Human inputs" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

בשני המקרים, **עליך להגדיר [משתני מצב](/learn/state-a-components-memory#anatomy-of-usestate) כדי לעדכן את המשתמש ממש.** עבור הטופס שאתה מפתח, לשנות את הstate בתגובה: לכמה כניסות.

* **שינוי קלט הטקסט** (אנושי) אמור להעביר אותו מstate *ריק* לstate *הקלדה* או חזרה, תלוי אם תיבת הטקסט ריקה או לא.
* **לחיצה על כפתור שלח** (אנושית) אמורה להעביר אותו לstate *מגיש*.
* **תגובת רשת מוצלחת** (מחשב) אמורה להעביר אותה לstate *הצלחה*.
* **תגובת רשת נכשלה** (מחשב) אמורה להעביר אותה לstate *שגיאה* עם הודעת השגיאה התואמת.

<Note>

שימו לב שקלט אנושי דורש טיפול [מטפלי אירועים](/למד/מגיבים לאירועים)!

</Note>

כדי לעזור לדמיין את הזרימה הזו, נסה לצייר כל מצב על נייר כעיגול מסומן, וכל שינוי בין שני מצבים כחץ. אתה יכול לשרטט זרימות רבות בדרך זו ולסדר באגים הרבה לפני היישום.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Flow chart moving left to right with 5 nodes. The first node labeled 'empty' has one edge labeled 'start typing' connected to a node labeled 'typing'. That node has one edge labeled 'press submit' connected to a node labeled 'submitting', which has two edges. The left edge is labeled 'network error' connecting to a node labeled 'error'. The right edge is labeled 'network success' connecting to a node labeled 'success'.">

מצבי טופס

</Diagram>

</DiagramGroup>

### שלב 3: להציג את הstate בזיכרון באמצעות `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

בשלב הבא תעבוד להצגת הstates הוויזואליים של הרכיב שלך בזיכרון עם [`useState`.](/reference/react/useState) הפשטות היא הפתח: כל חלק של מצב הוא "חלק נע", ו**אתה רוצה כמה שפחות "חלקים זזים" ככל האפשר.** יותר מורכבות מובילים ליותר באגים!

תתחיל מstate ש*בהחלט חייבת* להיות שם. לדוגמה, תצטרך לאחסן את ה'תשובה' עבור הקלט, ואת ה'שגיאה' (אם היא קיימת) כדי לאחסן את השגיאה האחרונה:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

לאחר מכן, תזדקק לשינוי מצב המציג את אחד מstates החזותיים שברצונך להציג. בדרך כלל יש יותר מדרך אחת להצגת זה בזיכרון, אז תרצו להתנסות עם זה.

אם אתה מתקשה לחשוב על הדרך הטובה ביותר, התחל בהוספת מספיק מצבים שאתה *בהחלט* בטוח שכל הstates החזותיים האפשריים מכוסים:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

סביר להניח שהרעיון הראשון שלך לא יהיה הטוב ביותר, אבל זה בסדר - מצב החזרה הוא חלק מהתהליך!

### שלב 4: הסר משתני מצב חיוניים {/*step-4-remove-any-non-essential-state-variables*/}

אתה רוצה למנוע כפילות בתוכן הstate אז אתה עוקב רק אחר מה שחשוב. השקעת זמן קצרה בשינוי מבנה הstate שלך יקל על ההבנה של הרכיבים שלך, יאפשר כפילות ויימנע ממשמעויות לא מכוונות. המטרה היא שלך **למנוע את המקרים הstate בזיכרון אינו מייצג שום ממשק משתמש חוקי ( רוצה שמשתמש יראה.** לדוגמא, לעולם לא תרצה להציג הודעת שגיאה ולהשבית את הקלט בו-זמנית, או שהמשתמש לא יוכל לתקן את השגיאה!)

הנה כמה שאלות שאתה יכול לשאול לגבי משתני הstate שלך:

* **האם מצב זה גורם לפרדוקס?** לדוגמה, `isTyping` ו-`issubmitting` לא יכולים להיות שניהם `נכונים`. פרדוקס פירושו בדרך כלל שstate אינה מוגבלת מספיק. יש ארבעה שילובים אפשריים של שני בוליאנים, אך רק שלושה תואמים מצבים תקפים. להוציא את הstate ה"כדי בלתי אפשרי", אתה יכול לשלב אותם ל'סטטוס' שחייב להיות ערכים משלו אחדים: ''הקלדה'`, ''שליחת'` או ''הצלחה'`.
* **האם אותו מידע זמין כבר בשינוי מצב אחר?** פרדוקס נוסף: `isEmpty` ו-`isTyping` לא יכולים להיות `true` בו-זמנית. על ידי הפיכתם למשתני מצב נפרדים, אתה מסתכן שהם יצאו מסנכרון ויגרמו לבאגים. למרבה המזל, אתה יכול להוציא את `isEmpty_= __TK_8th.`
* **האם אתה יכול לקבל אותו מידע מהיפוך של שינוי מצב אחר?** אין צורך ב-'isError' כי אתה יכול לבדוק את 'error !== null' במקום זאת.

לאחר הניקוי הזה, נשארו לך 3 (ירידה מ-7!) *חיוניים* משתני מצב:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

אתה יודע שהם חיוניים, כי אתה לא יכול להסיר אף אחד מהם מבלי לשבור את הפונקציונליות.

<DeepDive>

#### ביטול מצבים "בלתי אפשריים" עם מפחית {/*ביטול-בלתי-אפשרי-מצבים-עם-reducer*/}

שלושת המשתנים הללו הם ייצוג מספיק טוב של מצב הצורה הזו. עם זאת, יש לי ממש כמה מצבי. לדוגמה, `שגיאה` אינה אפס אינה הגיונית כאשר `סטטוס` הוא ``הצלחה``. כדי לדגמן את הstate בצורה מדויקת יותר, אתה [לחלץ אותו לתוך המפחית.](/learn/extracting-state-logic-into-a-reducer) reducer לך לאחד שני מרובים למצב אחד ולאחד את כל ההיגיון הקשור!

</DeepDive>

### שלב 5: חברו את המטפלים לעדכון מצב TK_0__

לבסוף, צורפי אירועים שמעדכנים את הstate. להלן הטופס הסופי, עם כל מטפלים מחוברים:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

למרות שהקוד הזה ארוך יותר מהדוגמה המקורית של הציווי, הוא הרבה פחות שביר. ביטוי כל האינטראקציות כשינויי מצב יכול להראות מאוחר יותר. זה גם יכול לשנות את מה שצריך להיות מוצג בכל מצב את ההיגיון של האינטראקציה עצמה.

<Recap>

* תכנות הצהרתי פירושו תיאור ממשק המשתמש עבור כל מצב ויזואלי במקום ניהול מיקרו של ממשק המשתמש (הכרח).
* בעת פיתוח רכיב:
1. זהה את כל הstates החזותיים שלו.
  2. קבע את הטריגרים האנושיים והמחשבים לשינויי מצב.
3. דגם את הstate באמצעות 'useState'.
  4. הסר מצב לא חיוני כדי למנוע באגים ופרדוקסים.
5. חבר את המטפלים לstate מוגדר.

</Recap>



<Challenges>

#### הוסף והסר מחלקת CSS {/*add-and-remove-a-css-class*/}

הפוך את זה כך שלחיצה על התמונה *תסיר* את המחלקה ה-CSS `background--active` מהמחלקה החיצונית ``<div>``, אך *מוסיפה* את המחלקה `picture--active` למחלקה ``<img>``. לחיצה נוספת על הרקע אמורה לשחזר את מחלקות ה-CSS המקוריות.

מבחינה ויזואלית, אתה צריך לצפות שלחיצה על התמונה תסיר את הרקע הסגול ותדגיש את גבול התמונה. לחיצה מחוץ לתמונה מדגישה את הרקע, אך מסירה את סימון גבול התמונה.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

לרכיב זה שני מצבים חזותיים: כאשר התמונה פעילה וכאשר התמונה אינה פעילה:

* כשהתמונה פעילה, מחלקות ה-CSS הן `רקע` ו`תמונה תמונה--פעילה`.
* כאשר התמונה אינה פעילה, מחלקות ה-CSS הן `רקע--פעיל` ו`תמונה`.

מספיק ניהול מצב בוליאני אחד כדי לזכור אם התמונה פעילה. המשימה המקורית הייתה להוציא או להוסיף מחלקות CSS. עם זאת, ב-React אתה צריך *לתאר* את מה שאתה רוצה לראות במקום *להשפיע* על רכיבי ממשק משתמש. אתה צריך לחשב את שתי מחלקות ה-CSS על סמך הstate הנוכחית. אתה גם צריך [להפסיק את ההפצה](/learn/responding-to-events#stopping-propagation) כדי שהלחיצה על התמונה לא תירשם כלחיצה על הרקע.

ודא שגרסה זו פועלת על ידי לחיצה על התמונה ולאחר מכן מחוצה לה:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

לחלופין, אתה יכול להחזיר שני נתחים נפרדים של JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

זכור שאם שני נתחי JSX שונים מתארים את אותו עץ, הקינון שלהם (ראשון ``<div>`` → הראשון ``<img>``) צריך להתאים. אחרת, החלפת 'isActive' תיצור מחדש את כל העץ למטה ו[יאפס את מצבו.](/learn/preserving-and-resetting-state) אפשר יהיה לחשוב על יוחזר עץ JSX דומה בשני המקרים, עדיף לכתוב אותם כחלק אחד של JSX.

</Solution>

#### עורך פרופילים {/*עורך-פרופיל*/}

הנה טופס קטן מיושם עם JavaScript ו-DOM רגילים. שחקו איתו כדי להבין את ההתנהגות שלו:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

טופס זה עובר בין שני מצבים: בstate העריכה רואים את הקלטים ובstate הצפייה רואים רק את התוצאה. תווית הכפתור ranking בין "ערוך" ל"שמור" בהתאם לstate שבו אתה נמצא. אתה משנה את הקלט, הודעת הפתיחה בתחתית מתעדכנת בזמן אמת.

המשימה שלך היא ליישם אותו מחדש ב-React בארגז החול למטה. לנוחיותך, הסימון כבר הומר ל-JSX, אבל תעזור לו להופיע ולהסתיר את הקלט כמו שהמקור עושה.

ודא שהוא מעדכן גם את הטקסט בתחתית!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

תזדקק לשני משתני מצב כדי לאחסן את ערכי הקלט: `firstName` ו-`lastName`. אתה גם תצטרך לשנות את המצב 'isEditing' שמחזיק אם מציג את הקלט או לא. אתה צריך _לא_ להזדק לשינוי `שם מלא` כי ניתן לחשב את השם המלא תמיד מתוך `שם פרטי` ו`שם משפחה`.

לבסוף, עליך להשתמש ב[עיבוד מותנה](/learn/conditional-rendering) כדי להציג או להסתיר את הקלט בהתאם ל-'isEditing'.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

השווה פתרון זה לקוד הציווי המקורי. במה הם שונים?

</Solution>

#### שחזר את הפתרון החיוני ללא React {/*refactor-the-imerative-solution-without-react*/}

הנה ארגז החול המקורי מהאתגר הקודם, שנכתב בהכרח ללא תגובה:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

תארו לעצמכם ש-React לא היה קיים. האם אתה יכול לשחזר את הקוד הזה יכול לעשות את ההיגיון לפחות שביר ודומה לגרסת להגיב? איך זה היה נראה אם ​​הstate הייתה מפורשת, כמו ב-React?

אם אתה מתקשה לחשוב מאיפה להתחיל, הבדל למטה כבר מכיל את רוב המבנה במקום. אם תתחיל כאן, מלא את ההיגיון החסר בפונקציית `updateDOM`. (עיין בקוד המקורי בתנאי הצורך.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

ההיגיון החסר כלל החלפת תצוגת הקלט והתוכן, ועדכון התוויות:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

הפונקציה 'updateDOM' כתבת מראה מה תגובה עושה מתחת למכסה המנוע כאשר אתה מגדיר את הstate. (עם הגיבו גם נמנעת מלגעת ב-DOM עבור מאפיינים שלא השתנו זאת אחרון שהם הוגדרו.)

</Solution>

</Challenges>

