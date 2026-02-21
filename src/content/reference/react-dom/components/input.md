---
title: "<קלט>"
---

<Intro>

[רכיב הדפדפן המובנה `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) מאפשר לך להציג סוגים שונים של קלט טפסים.

```js
<input />
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<input>` {/*input*/}

כדי להציג קלט, רנדר את [הדפדפן המובנה `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) רכיב.

```js
<input name="myInput" />
```

[ראה דוגמאות נוספות למטה.](#usage)

#### אבזרים {/*props*/}

`<input>` תומך בכל [הרכיב המשותף props.](/reference/react-dom/components/common#props)

<Canary>

ההרחבות של React לאביזר `formAction` זמינות כרגע רק בערוצים הקנריים והניסיוניים של React. במהדורות יציבות של React, `formAction` פועל רק כ[רכיב HTML דפדפן מובנה](/reference/react-dom/components#all-html-components). למידע נוסף על ערוצי ההפצה של [React כאן](/community/versioning-policy#all-release-channels).

</Canary>

[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): מחרוזת או פונקציה. עוקפת את האב `<form action>` עבור `type="submit"` ו`type="image"`. כאשר כתובת URL מועברת ל-`action` הטופס יתנהג כמו טופס HTML סטנדרטי. כאשר פונקציה תועבר ל-`formAction` הפונקציה תטפל בטופס ההגשה. [`<form action>`](/reference/react-dom/components/form#props).

אתה יכול [להפוך קלט מבוקר](#controlling-an-input-with-a-state-variable) על ידי העברת אחד מה-props הבאים:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): בוליאני. עבור קלט תיבת סימון או לחצן בחירה, שולט אם הוא נבחר.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): מחרוזת. עבור קלט טקסט, שולט בטקסט שלו. (עבור לחצן בחירה, מציין את נתוני הטופס שלו.)

כאשר אתה עובר אחד מהם, עליך לעבור גם מטפל `onChange` שמעדכן את הערך שעבר.

`<input>` props אלו רלוונטיים רק לכניסות לא מבוקרות:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): בוליאני. מציין את [הערך ההתחלתי](#providing-an-initial-value-for-an-input) עבור כניסות `type="checkbox"` ו`type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): מחרוזת. מציין את [הערך ההתחלתי](#providing-an-initial-value-for-an-input) עבור קלט טקסט.

`<input>` props אלו רלוונטיים הן לכניסות לא מבוקרות והן לכניסות מבוקרות:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): מחרוזת. מציין אילו סוגי קבצים מתקבלים על ידי קלט `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): מחרוזת. מציין את טקסט התמונה החלופי עבור קלט `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): מחרוזת. מציין את המדיה (מיקרופון, וידאו או מצלמה) שנלכדה על ידי קלט `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): מחרוזת. מציינת אחת מ[התנהגויות השלמה אוטומטית] האפשריות.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): בוליאני. אם `true`, React ימקד את האלמנט ב-mount.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): מחרוזת. מציין את שם שדה הטופס עבור הכיווניות של האלמנט.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): בוליאני. אם `true`, הקלט לא יהיה אינטראקטיבי ויופיע מעומעם.
* `children`: `<input>` אינו מקבל ילדים.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): מחרוזת. מציין את `id` של `<form>` שהקלט הזה שייך אליו. אם מושמט, זה טופס האב הקרוב ביותר.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): מחרוזת. עוקף את ההורה `<form action>` עבור `type="submit"` ו`type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): מחרוזת. עוקף את ההורה `<form enctype>` עבור `type="submit"` ו`type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): מחרוזת. עוקף את ההורה `<form method>` עבור `type="submit"` ו`type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): מחרוזת. עוקף את ההורה `<form noValidate>` עבור `type="submit"` ו`type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): מחרוזת. עוקף את ההורה `<form target>` עבור `type="submit"` ו`type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): מחרוזת. מציין את גובה התמונה עבור `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): מחרוזת. מציין את ה-`id` של ה-`<datalist>` עם אפשרויות ההשלמה האוטומטית.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): מספר. מציין את הערך המרבי של קלט מספרי ותאריך-שעה.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): מספר. מציין את האורך המרבי של טקסט וקלטים אחרים.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): מספר. מציין את הערך המינימלי של קלט מספרי ותאריך-שעה.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): מספר. מציין את האורך המינימלי של טקסט וקלטים אחרים.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): ערך בוליאני. מציין אם מותרים ערכים מרובים עבור `<type="file"` ו`type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): מחרוזת. מציין את השם לקלט זה [נשלח עם הטופס.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: פונקציה [`Event` מטפל](/reference/react-dom/components/common#event-handler). נדרש עבור [כניסות מבוקרות.](#controlling-an-input-with-a-state-variable) מופעל מיד כאשר ערך הקלט משתנה על ידי ה-user (לדוגמה, הוא מופעל בכל הקשה). מתנהג כמו הדפדפן [`input` אירוע.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: גרסה של `onChange` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): מטפל [`Event`](/reference/react-dom/components/common#event-handler). מופעלת מיד כאשר הערך משתנה על ידי ה-user. מסיבות היסטוריות, ב-__TK_124_124__, במקום זאת, __TK_124_3__ הוא __TK_124_0__ הוא __K__13__. עובד באופן דומה.
* `onInputCapture`: גרסה של `onInput` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): מטפל [`Event`](/reference/react-dom/components/common#event-handler). מופעל אם קלט נכשל באימות בשליחת הטופס. בניגוד לאירוע המובנה `invalid`, האירוע React בועות React __3
* `onInvalidCapture`: גרסה של `onInvalid` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): מטפל ב-[`Event`](/reference/react-dom/components/common#event-handler). מופעל לאחר שהבחירה בתוך ה-`<input>` משתנה. React מרחיב את `onSelect` __ ויכול להשפיע על הבחירה הריקה שלו.
* `onSelectCapture`: גרסה של `onSelect` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): מחרוזת. מציין את התבנית שה-`value` חייב להתאים.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): מחרוזת. מוצג בצבע מעומעם כאשר ערך הקלט ריק.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): בוליאני. אם `true`, הקלט אינו ניתן לעריכה על ידי ה-user.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): בוליאני. אם `true`, יש לספק את הערך כדי שהטופס יישלח.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): מספר. דומה להגדרת רוחב, אבל היחידה תלויה בבקרה.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): מחרוזת. מציין את מקור התמונה עבור קלט `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): מספר חיובי או מחרוזת `'any'`. מציין את המרחק בין ערכים חוקיים.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): מחרוזת. אחד מ[סוגי הקלט.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): מחרוזת. מציין את רוחב התמונה עבור קלט `type="image"`.

#### אזהרות {/*caveats*/}

- תיבות סימון צריכות `checked` (או `defaultChecked`), לא `value` (או `defaultValue`).
- אם קלט טקסט מקבל מחרוזת `value` אבזר, הוא יטופל כנשלט.](#controlling-an-input-with-a-state-variable)
- אם תיבת סימון או כפתור בחירה מקבלים אבזר בוליאני `checked`, זה יטופל כנשלט.](#controlling-an-input-with-a-state-variable)
- קלט לא יכול להיות נשלט ובלתי נשלט בו זמנית.
- קלט לא יכול לעבור בין להיות נשלט או בלתי נשלט במהלך חייו.
- כל קלט מבוקר צריך מטפל אירועים `onChange` שמעדכן באופן סינכרוני את ערך הגיבוי שלו.

---

## שימוש {/*usage*/}

### הצגת קלט מסוגים שונים {/*displaying-inputs-of-different-types*/}

כדי להציג קלט, רנדר רכיב `<input>`. כברירת מחדל, זה יהיה קלט טקסט. אתה יכול להעביר את `type="checkbox"` עבור תיבת סימון, `type="radio"` עבור לחצן בחירה, [או אחד מסוגי הקלט האחרים.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### מתן תווית לקלט {/*providing-a-label-for-an-input*/}

בדרך כלל, תציב כל `<input>` בתוך תג [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). זה אומר לדפדפן שהתווית הזו משויכת לקלט הזה. כאשר ה-user לוחץ על התווית, הדפדפן ימקד את הקלט באופן אוטומטי. זה גם חיוני לנגישות: קורא מסך יכריז על כיתוב התווית המשויך ל-K4__5__T__T

אם אינך יכול לקנן את `<input>` לתוך `<label>`, שייך אותם על ידי העברת אותו מזהה ל-`<input id>` ו-[`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) כדי למנוע התנגשויות בין מופעים מרובים של רכיב אחד, צור מזהה כזה עם [`useId`.](/__TK_6_react/reference)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### מתן ערך התחלתי עבור קלט {/*providing-an-initial-value-for-an-input*/}

ניתן לציין באופן אופציונלי את הערך ההתחלתי עבור כל קלט. העבר אותו כמחרוזת `defaultValue` עבור קלט טקסט. תיבות סימון ולחצני בחירה צריכים לציין את הערך ההתחלתי עם הערך הבוליאני `defaultChecked` במקום זאת.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### קריאת ערכי הקלט בעת שליחת טופס {/*reading-the-input-values-when-submitting-a-form*/}

הוסף [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) מסביב לכניסות שלך עם [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) בפנים. זה יקרא למטפל האירועים `<form onSubmit>` שלך. כברירת מחדל, הדפדפן ישלח את נתוני הטופס לכתובת ה-URL הנוכחית וירענן את הדף. תוכל לעקוף התנהגות זו על ידי קריאה ל-`new FormData(e.target)`](__K__נתוני הטופס עם [__K_7).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

תן `name` לכל `<input>`, למשל `<input name="firstName" defaultValue="Taylor" />`. ה-`name` שציינת יהיה used כמפתח בנתוני הטופס, למשל `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

כברירת מחדל, *כל* `<button>` בתוך `<form>` ישלח אותו. זה יכול להפתיע! אם יש לך רכיב `Button` React מותאם אישית משלך, שקול להחזיר [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) במקום `<button>`. לאחר מכן, כדי להיות מפורש, use `<button type="submit">` עבור לחצנים ש*אמורים* לשלוח את הטופס.

</Pitfall>

---

### שליטה בקלט עם משתנה state {/*controlling-an-input-with-a-state-variable*/}

קלט כמו `<input />` הוא *לא מבוקר.* גם אם אתה [מעביר ערך התחלתי](#providing-an-initial-value-for-an-input) כמו `<input defaultValue="Initial text" />`, ה-JSX שלך מציין רק את הערך ההתחלתי. זה לא שולט מה הערך צריך להיות עכשיו.

**כדי להציג קלט _מבוקר_, העבירו אליו את הפרופס `value` (או `checked` עבור תיבות סימון ומכשירי רדיו).** React יאלץ את הקלט לכלול תמיד את ה-`value` שעברתם. בדרך כלל, תעשה זאת על ידי הכרזה על משתנה [state:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare a state variable...
  // ...
  return (
    <input
      value={firstName} // ...force the input's value to match the state variable...
      onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

קלט מבוקר הגיוני אם בכל מקרה היית צריך state - לדוגמה, כדי לעבד מחדש את ממשק המשתמש שלך בכל עריכה:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

זה גם useמלא אם ברצונך להציע מספר דרכים להתאים את הקלט state (לדוגמה, על ידי לחיצה על כפתור):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

ה-`value` שתעביר לרכיבים מבוקרים לא אמור להיות `undefined` או `null`. אם אתה צריך שהערך ההתחלתי יהיה ריק (כגון עם השדה `firstName` למטה), אתחל את המשתנה state שלך למחרוזת ריקה (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**אם אתה מעביר את `value` ללא `onChange`, זה יהיה בלתי אפשרי להקליד בקלט.** כאשר אתה שולט בקלט על ידי העברת כמה `value` אליו, אתה *מאלץ* אותו לקבל תמיד את הערך שהעברת. אז אם תעביר משתנה state בתור `value` אבל תשכח לעדכן את המשתנה state באופן סינכרוני במהלך מטפל האירועים `onChange`, React יחזיר את הקלט לאחר כל הקשה בחזרה ל-`value` שציינת.

</Pitfall>

---

### אופטימיזציה של עיבוד מחדש בכל הקשה {/*optimizing-re-rendering-on-every-keystroke*/}

כאשר אתה use קלט מבוקר, אתה מגדיר את state בכל הקשה. אם הרכיב המכיל את state שלך מעבד מחדש עץ גדול, זה יכול להיות איטי. יש כמה דרכים שבהן תוכל לייעל את ביצועי העיבוד מחדש.

לדוגמה, נניח שאתה מתחיל בטופס המציג מחדש את כל תוכן הדף בכל הקשה:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

מכיוון ש`<PageContent />` אינו מסתמך על הקלט state, אתה יכול להעביר את הקלט state לרכיב משלו:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

זה משפר משמעותית את הביצועים מכיוון שuse כעת רק `SignupForm` מעבד מחדש בכל הקשה.

אם אין דרך להימנע מעיבוד מחדש (לדוגמה, אם `PageContent` תלוי בערך קלט החיפוש), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) מאפשר לך לשמור על הקלט הנשלט תגובה אפילו באמצע עיבוד מחדש גדול.

---

## פתרון בעיות {/*troubleshooting*/}

### קלט הטקסט שלי לא מתעדכן כשאני מקליד בו {/*my-text-input-doesnt-update-when-i-type-into-it*/}

אם תציג קלט עם `value` אך ללא `onChange`, תראה שגיאה במסוף:

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

סיפקת אבזר `value` לשדה טופס ללא מטפל `onChange`. זה יציג שדה לקריאה בלבד. אם השדה צריך להיות ניתן לשינוי use `defaultValue`. אחרת, הגדר `onChange` או `readOnly`.

</ConsoleBlock>

כפי שמציעה הודעת השגיאה, אם רק רצית [לציין את הערך *התחלתי*,](#providing-an-initial-value-for-an-input) העבר את `defaultValue` במקום זאת:

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

אם אתה רוצה [לשלוט בקלט זה עם משתנה state,](#controlling-an-input-with-a-state-variable) ציין מטפל `onChange`:

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

אם הערך הוא בכוונה לקריאה בלבד, הוסף אבזר `readOnly` כדי לדכא את השגיאה:

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### תיבת הסימון שלי לא מתעדכנת כשאני לוחצת עליה {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

אם תציג תיבת סימון עם `checked` אך ללא `onChange`, תראה שגיאה במסוף:

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

סיפקת אבזר `checked` לשדה טופס ללא מטפל `onChange`. זה יציג שדה לקריאה בלבד. אם השדה צריך להיות ניתן לשינוי use `defaultChecked`. אחרת, הגדר `onChange` או `readOnly`.

</ConsoleBlock>

כפי שמציעה הודעת השגיאה, אם רק רצית [לציין את הערך *התחלתי*,](#providing-an-initial-value-for-an-input) העבר את `defaultChecked` במקום זאת:

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

אם אתה רוצה [לשלוט בתיבת הסימון הזו עם משתנה state,](#controlling-an-input-with-state-variable) ציין מטפל `onChange`:

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

עליך לקרוא `e.target.checked` במקום `e.target.value` עבור תיבות סימון.

</Pitfall>

אם תיבת הסימון היא בכוונה לקריאה בלבד, הוסף אבזר `readOnly` כדי לדכא את השגיאה:

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### הקלט שלי קופץ להתחלה בכל הקשה {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

אם אתה [שולט בקלט,](#controlling-an-input-with-a-state-variable) עליך לעדכן את המשתנה state שלו לערך הקלט מה-DOM במהלך `onChange`.

אתה לא יכול לעדכן אותו למשהו אחר מלבד `e.target.value` (או `e.target.checked` עבור תיבות סימון):

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

אתה גם לא יכול לעדכן אותו באופן אסינכרוני:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

כדי לתקן את הקוד שלך, עדכן אותו באופן סינכרוני ל-`e.target.value`:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

אם זה לא פותר את הבעיה, ייתכן שהקלט יוסר ויתווסף מחדש מה-DOM בכל הקשה. זה יכול לקרות אם אתה [מאפס בטעות state](/learn/preserving-and-resetting-state) בכל עיבוד מחדש, למשל אם הקלט או אחד מההורים שלו תמיד מקבלים תכונה שונה `key`, או אם מקננים הגדרות של פונקציית רכיבים (שאינם נתמכים תמיד לרכיב K_4 וכא__T) עץ).

---

### אני מקבל שגיאה: "רכיב משנה קלט לא מבוקר כדי להיות נשלט" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


אם אתה מספק `value` לרכיב, הוא חייב להישאר מחרוזת לאורך כל חייו.

אתה לא יכול לעבור את `value={undefined}` קודם ומאוחר יותר לעבור את `value="some string"` כי use React לא תדע אם אתה רוצה שהרכיב יהיה לא מבוקר או נשלט. רכיב מבוקר צריך תמיד לקבל מחרוזת `value`, לא `null` או `undefined`.

אם ה-`value` שלך מגיע ממשתנה API או state, ייתכן שהוא מאותחל ל-`null` או `undefined`. במקרה כזה, הגדר אותו למחרוזת ריקה (`''`) בתחילה, או העבר את `value={someValue ?? ''}` כדי לוודא ש`value` היא מחרוזת.

באופן דומה, אם תעביר את `checked` לתיבת סימון, ודא שהיא תמיד בוליאני.
