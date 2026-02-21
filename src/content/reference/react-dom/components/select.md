---
title: "<בחר>"
---

<Intro>

[רכיב הדפדפן המובנה `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) מאפשר לך להציג תיבת בחירה עם אפשרויות.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<select>` {/*select*/}

כדי להציג תיבת בחירה, עבד את [הדפדפן המובנה `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) רכיב.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[ראה דוגמאות נוספות למטה.](#usage)

#### אבזרים {/*props*/}

`<select>` תומך בכל [הרכיב המשותף props.](/reference/react-dom/components/common#props)

אתה יכול [להפוך תיבת בחירה לשולטת](#controlling-a-select-box-with-a-state-variable) על ידי העברת אבזר `value`:

* `value`: מחרוזת (או מערך של מחרוזות עבור [`multiple={true}`](#enabling-multiple-selection)). שולט באיזו אפשרות נבחרה. כל מחרוזת ערכים תואמת את `value` של כמה `<option>` המקוננות בתוך ה-`<select>`.

כאשר אתה עובר את `value`, עליך לעבור גם מטפל `onChange` שמעדכן את הערך שעבר.

אם ה-`<select>` שלך לא מבוקר, אתה יכול להעביר את הפרופס של `defaultValue` במקום זאת:

* `defaultValue`: מחרוזת (או מערך של מחרוזות עבור [`multiple={true}`](#enabling-multiple-selection)). מציין את [האפשרות שנבחרה בתחילה.](#providing-an-initially-selected-option)

`<select>` props אלו רלוונטיות הן עבור תיבות בחירה בלתי מבוקרות והן עבור תיבות בחירה מבוקרות:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): מחרוזת. מציינת את אחת מההתנהגויות האפשריות של השלמה אוטומטית.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): בוליאני. אם `true`, React ימקד את האלמנט ב-mount.
* `children`: `<select>` מקבל את [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), ו-[`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) רכיבים בתור ילדים. אתה יכול גם להעביר רכיבים משלך כל עוד הם בסופו של דבר מעבדים את אחד מהרכיבים המותרים ___8 מעבדים את הרכיבים המותרים שלך. __ `<option>` שאתה מעבד חייב להיות `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): בוליאני. אם `true`, תיבת הבחירה לא תהיה אינטראקטיבית ותופיע מעומעמת.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): מחרוזת. מציינת את ה-`id` של התיבה `<form>` שאליה שייכת תיבת הבחירה. אם הושמטה, היא טופס האב הקרוב ביותר.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): בוליאני. אם `true`, הדפדפן מאפשר [בחירה מרובה.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): מחרוזת. מציינת את השם של תיבת הבחירה הזו ש[נשלחה עם הטופס.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: פונקציה [`Event` מטפל](/reference/react-dom/components/common#event-handler). נדרש עבור [תיבות בחירה מבוקרות.](#controlling-a-select-box-with-a-state-variable) מופעל מיד כאשר ה-user בוחר אפשרות אחרת. מתנהג כמו הדפדפן [`input` אירוע.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: גרסה של `onChange` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): מטפל [`Event`](/reference/react-dom/components/common#event-handler). מופעל מיד כשהערך משתנה על ידי ה-user. מסיבות היסטוריות, ב-React זה עובד בצורה אידיומטית ל-__TK___0.
* `onInputCapture`: גרסה של `onInput` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציית [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): מטפל [`Event`](/reference/react-dom/components/common#event-handler). מופעל אם קלט נכשל באימות בשליחת הטופס. בניגוד לאירוע המובנה `invalid`, האירוע React __TK בועות
* `onInvalidCapture`: גרסה של `onInvalid` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): בוליאני. אם `true`, יש לספק את הערך כדי שהטופס יישלח.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): מספר. עבור `multiple={true}` נבחר, מציין את המספר המועדף של פריטים גלויים בתחילה.

#### אזהרות {/*caveats*/}

- שלא כמו ב-HTML, העברת תכונה `selected` ל-`<option>` אינה נתמכת. במקום זאת, use [`<select defaultValue>`](#providing-an-initially-selected-option) עבור תיבות בחירה בלתי מבוקרות ו-[`<select value>`](#controlling-a-select-box-with-a-state-variable) עבור תיבות בחירה מבוקרות.
- אם תיבת בחירה מקבלת אבזר `value`, היא תטופל כמבוקרה.](#controlling-a-select-box-with-state-variable)
- תיבת בחירה לא יכולה להיות נשלטת ובלתי נשלטת בו-זמנית.
- תיבת בחירה לא יכולה לעבור בין להיות מבוקרת או בלתי נשלטת במהלך חייה.
- כל תיבת בחירה מבוקרת זקוקה למטפל אירועים `onChange` שמעדכן באופן סינכרוני את ערך הגיבוי שלו.

---

## שימוש {/*usage*/}

### הצגת תיבת בחירה עם אפשרויות {/*displaying-a-select-box-with-options*/}

עבד `<select>` עם רשימה של רכיבי `<option>` בפנים כדי להציג תיבת בחירה. תן לכל `<option>` `value` המייצג את הנתונים שיישלחו עם הטופס.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### מתן תווית עבור תיבת בחירה {/*providing-a-label-for-a-select-box*/}

בדרך כלל, תציב כל `<select>` בתוך תג [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). זה אומר לדפדפן שהתווית הזו משויכת לאותה תיבת בחירה. כאשר ה-user לוחץ על התווית, הדפדפן ימקד אוטומטית את תיבת הבחירה. זה גם חיוני לנגישות: קורא מסך יכריז על כיתוב התווית __T__c_t_K

אם אינך יכול לקנן את `<select>` לתוך `<label>`, שייך אותם על ידי העברת אותו מזהה ל-`<select id>` ו-[`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) כדי למנוע התנגשויות בין מופעים מרובים של רכיב אחד, צור מזהה כזה עם [`useId`.](/__TK_6_react/reference)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### מתן אפשרות שנבחרה תחילה {/*providing-an-initially-selected-option*/}

כברירת מחדל, הדפדפן יבחר את ה-`<option>` הראשון ברשימה. כדי לבחור אפשרות אחרת כברירת מחדל, העבר את ה-`value` של `<option>` זה בתור `defaultValue` לרכיב `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

שלא כמו ב-HTML, העברת תכונה `selected` לאדם `<option>` אינה נתמכת.

</Pitfall>

---

### הפעלת בחירה מרובה {/*enabling-multiple-selection*/}

העבר את `multiple={true}` ל-`<select>` כדי לאפשר ל-user לבחור אפשרויות מרובות. במקרה כזה, אם אתה מציין גם `defaultValue` כדי לבחור את האפשרויות שנבחרו בתחילה, זה חייב להיות מערך.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### קריאת ערך תיבת הבחירה בעת שליחת טופס {/*reading-the-select-box-value-when-submitting-a-form*/}

הוסף [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) סביב תיבת הבחירה שלך עם [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) בפנים. זה יקרא למטפל האירועים `<form onSubmit>` שלך. כברירת מחדל, הדפדפן ישלח את נתוני הטופס לכתובת ה-URL הנוכחית וירענן את הדף. תוכל לעקוף התנהגות זו על ידי קריאה ל-`new FormData(e.target)`](__K__נתוני הטופס עם [__K_7)
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) This doesn't include multiple select values
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

תן `name` ל-`<select>` שלך, למשל `<select name="selectedFruit" />`. ה-`name` שציינת יהיה used כמפתח בנתוני הטופס, למשל `{ selectedFruit: "orange" }`.

אם אתה use `<select multiple={true}>`, ה-[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) שתקרא מהטופס יכלול כל ערך שנבחר כצמד שם-ערך נפרד. עיין מקרוב ביומני המסוף בדוגמה למעלה.

</Note>

<Pitfall>

כברירת מחדל, *כל* `<button>` בתוך `<form>` ישלח אותו. זה יכול להפתיע! אם יש לך רכיב `Button` React מותאם אישית משלך, שקול להחזיר [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) במקום `<button>`. לאחר מכן, כדי להיות מפורש, use `<button type="submit">` עבור לחצנים ש*אמורים* לשלוח את הטופס.

</Pitfall>

---

### שליטה בתיבת בחירה עם משתנה state {/*controlling-a-select-box-with-a-state-variable*/}

תיבת בחירה כמו `<select />` היא *לא מבוקרת.* גם אם אתה [עבר ערך שנבחר תחילה](#providing-an-initially-selected-option) כמו `<select defaultValue="orange" />`, ה-JSX שלך מציין רק את הערך ההתחלתי, לא את הערך כרגע.

**כדי להציג תיבת בחירה _מבוקרת_, העבירו אליה את האביזר `value`.** React יאלץ את תיבת הבחירה לכלול תמיד את ה-`value` שעברת. בדרך כלל, תוכל לשלוט בתיבת בחירה על ידי הכרזה על משתנה [state:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declare a state variable...
  // ...
  return (
    <select
      value={selectedFruit} // ...force the select's value to match the state variable...
      onChange={e => setSelectedFruit(e.target.value)} // ... and update the state variable on any change!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

זה useמלא אם ברצונך לעבד מחדש חלק כלשהו ממשק המשתמש בתגובה לכל בחירה.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**אם תעבירו את `value` ללא `onChange`, זה יהיה בלתי אפשרי לבחור אפשרות.** כאשר אתם שולטים בתיבת בחירה על ידי העברת כמה `value` אליה, אתם *מאלצים* אותה לקבל תמיד את הערך שהעברת. אז אם תעביר משתנה state בתור `value` אבל תשכח לעדכן את המשתנה state באופן סינכרוני במהלך מטפל האירועים `onChange`, React יחזיר את תיבת הבחירה לאחר כל הקשה בחזרה ל-`value` שציינת.

שלא כמו ב-HTML, העברת תכונה `selected` לאדם `<option>` אינה נתמכת.

</Pitfall>
