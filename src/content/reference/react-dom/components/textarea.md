---
title: "<אזור טקסט>"
---

<Intro>

[רכיב הדפדפן המובנה `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) מאפשר לך לעבד קלט טקסט מרובה שורות.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<textarea>` {/*textarea*/}

כדי להציג אזור טקסט, רנדר את [הדפדפן המובנה `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) רכיב.

```js
<textarea name="postContent" />
```

[ראה דוגמאות נוספות למטה.](#usage)

#### אבזרים {/*props*/}

`<textarea>` תומך בכל [הרכיב המשותף props.](/reference/react-dom/components/common#props)

אתה יכול [להפוך אזור טקסט לשלוט](#controlling-a-text-area-with-a-state-variable) על ידי העברת אבזר `value`:

* `value`: מחרוזת. שולט בטקסט בתוך אזור הטקסט.

כאשר אתה עובר את `value`, עליך לעבור גם מטפל `onChange` שמעדכן את הערך שעבר.

אם ה-`<textarea>` שלך לא מבוקר, אתה יכול להעביר את הפרופס של `defaultValue` במקום זאת:

* `defaultValue`: מחרוזת. מציין את [הערך ההתחלתי](#providing-an-initial-value-for-a-text-area) עבור אזור טקסט.

`<textarea>` props אלו רלוונטיים הן עבור אזורי טקסט בלתי נשלטים והן עבור אזורי טקסט מבוקרים:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): או `'on'` או `'off'`. מציין את אופן ההשלמה האוטומטית.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): בוליאני. אם `true`, React ימקד את האלמנט ב-mount.
* `children`: `<textarea>` אינו מקבל ילדים. כדי להגדיר את הערך ההתחלתי, use `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): מספר. מציין את רוחב ברירת המחדל ברוחב תווים ממוצע. ברירת המחדל היא `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): בוליאני. אם `true`, הקלט לא יהיה אינטראקטיבי ויופיע מעומעם.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): מחרוזת. מציין את `id` של `<form>` שהקלט הזה שייך אליו. אם מושמט, זה טופס האב הקרוב ביותר.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): מספר. מציין את האורך המרבי של הטקסט.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): מספר. מציין את האורך המינימלי של הטקסט.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): מחרוזת. מציין את השם עבור הקלט הזה ש[נשלח עם הטופס.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: פונקציה [`Event` מטפל](/reference/react-dom/components/common#event-handler). נדרש עבור [אזורי טקסט מבוקרים.](#controlling-a-text-area-with-a-state-variable) מופעל מיד כאשר ערך הקלט משתנה על ידי ה-user (לדוגמה, הוא מופעל בכל הקשה). מתנהג כמו הדפדפן [`input` אירוע.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: גרסה של `onChange` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): מטפל [`Event`](/reference/react-dom/components/common#event-handler). מופעל מיד כשהערך משתנה על ידי ה-user. מסיבות היסטוריות, ב-React זה עובד בצורה אידיומטית ל-__TK___5.
* `onInputCapture`: גרסה של `onInput` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): מטפל [`Event`](/reference/react-dom/components/common#event-handler). מופעל אם קלט נכשל באימות בשליחת הטופס. בניגוד לאירוע המובנה `invalid`, האירוע React __TK בועות
* `onInvalidCapture`: גרסה של `onInvalid` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): מטפל [`Event`](/reference/react-dom/components/common#event-handler). מופעל לאחר שהבחירה בתוך `<textarea>` משתנה. React מרחיב את האירוע `onSelect` כך שישפיע גם על הבחירה הריקה שלו.
* `onSelectCapture`: גרסה של `onSelect` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): מחרוזת. מוצג בצבע מעומעם כאשר ערך אזור הטקסט ריק.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): בוליאני. אם `true`, אזור הטקסט אינו ניתן לעריכה על ידי ה-user.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): בוליאני. אם `true`, יש לספק את הערך כדי שהטופס יישלח.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): מספר. מציין את גובה ברירת המחדל בגבהי תווים ממוצעים. ברירת המחדל היא `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): או `'hard'`, `'soft'`, או `'off'`. מציין כיצד יש לעטוף את הטקסט בעת שליחת טופס.

#### אזהרות {/*caveats*/}

- אסור להעביר ילדים כמו `<textarea>something</textarea>`. [השתמש ב-`defaultValue` לתוכן ראשוני.](#providing-an-initial-value-for-a-text-area)
- אם אזור טקסט מקבל מחרוזת `value` אבזר, הוא יטופל כבולט.](#controlling-a-text-area-with-a-state-variable)
- אזור טקסט לא יכול להיות נשלט ובלתי נשלט בו זמנית.
- אזור טקסט לא יכול לעבור בין נשלט או בלתי נשלט במהלך חייו.
- כל אזור טקסט מבוקר צריך מטפל אירועים `onChange` שמעדכן באופן סינכרוני את ערך הגיבוי שלו.

---

## שימוש {/*usage*/}

### הצגת אזור טקסט {/*displaying-a-text-area*/}

עיבוד `<textarea>` כדי להציג אזור טקסט. אתה יכול לציין את גודל ברירת המחדל שלו עם המאפיינים [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) ו-[`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols), אך כברירת מחדל ה-user יוכל לשנות את גודלו. כדי לבטל שינוי גודל, ניתן לציין `resize: none` ב-CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### מתן תווית לאזור טקסט {/*providing-a-label-for-a-text-area*/}

בדרך כלל, תציב כל `<textarea>` בתוך תג [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). זה אומר לדפדפן שהתווית הזו משויכת לאזור הטקסט הזה. כאשר ה-user לוחץ על התווית, הדפדפן ימקד את אזור הטקסט. זה גם חיוני לנגישות: קורא מסך יכריז על הכיתוב של התווית כאשר ה- user ילחץ על התווית.

אם אינך יכול לקנן את `<textarea>` לתוך `<label>`, שייך אותם על ידי העברת אותו מזהה ל-`<textarea id>` ו-[`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) כדי למנוע התנגשויות בין מופעים של רכיב אחד, צור מזהה כזה עם [`useId`.](/reference/react/react)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### מתן ערך ראשוני עבור אזור טקסט {/*providing-an-initial-value-for-a-text-area*/}

ניתן לציין באופן אופציונלי את הערך ההתחלתי עבור אזור הטקסט. העבר אותו כמחרוזת `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

שלא כמו ב-HTML, העברת טקסט ראשוני כמו `<textarea>Some content</textarea>` אינה נתמכת.

</Pitfall>

---

### קריאת ערך אזור הטקסט בעת שליחת טופס {/*reading-the-text-area-value-when-submitting-a-form*/}

הוסף [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) מסביב לאזור הטקסט שלך עם [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) בפנים. זה יקרא למטפל האירועים `<form onSubmit>` שלך. כברירת מחדל, הדפדפן ישלח את נתוני הטופס לכתובת ה-URL הנוכחית וירענן את הדף. תוכל לעקוף התנהגות זו על ידי קריאה ל-`new FormData(e.target)`] (__K_ נתוני הטופס עם [__K_)
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

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
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

תן `name` ל-`<textarea>` שלך, למשל `<textarea name="postContent" />`. ה-`name` שציינת יהיה used כמפתח בנתוני הטופס, למשל `{ postContent: "Your post" }`.

</Note>

<Pitfall>

כברירת מחדל, *כל* `<button>` בתוך `<form>` ישלח אותו. זה יכול להפתיע! אם יש לך רכיב `Button` React מותאם אישית משלך, שקול להחזיר [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) במקום `<button>`. לאחר מכן, כדי להיות מפורש, use `<button type="submit">` עבור לחצנים ש*אמורים* לשלוח את הטופס.

</Pitfall>

---

### שליטה באזור טקסט עם משתנה state {/*controlling-a-text-area-with-a-state-variable*/}

אזור טקסט כמו `<textarea />` הוא *לא מבוקר.* גם אם אתה [עובר ערך התחלתי](#providing-an-initial-value-for-a-text-area) כמו `<textarea defaultValue="Initial text" />`, JSX שלך מציין רק את הערך ההתחלתי, לא את הערך כרגע.

**כדי לעבד אזור טקסט _נשלט_, העבירו אליו את האביזר `value`.** React יאלץ את אזור הטקסט לכלול תמיד את ה-`value` שעברת. בדרך כלל, תוכל לשלוט באזור טקסט על ידי הכרזה על משתנה [state:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

זה useמלא אם ברצונך לעבד מחדש חלק כלשהו ממשק המשתמש בתגובה לכל הקשה.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**אם תעביר את `value` ללא `onChange`, זה יהיה בלתי אפשרי להקליד באזור הטקסט.** כאשר אתה שולט באזור טקסט על ידי העברת כמה `value` אליו, אתה *מאלץ* אותו לקבל תמיד את הערך שעברת. אז אם תעביר משתנה state בתור `value` אבל תשכח לעדכן את המשתנה state באופן סינכרוני במהלך מטפל האירועים `onChange`, React יחזיר את אזור הטקסט לאחר כל הקשה בחזרה ל-`value` שציינת.

</Pitfall>

---

## פתרון בעיות {/*troubleshooting*/}

### אזור הטקסט שלי לא מתעדכן כשאני מקליד בו {/*my-text-area-doesnt-update-when-i-type-into-it*/}

אם אתה מעבד אזור טקסט עם `value` אך ללא `onChange`, תראה שגיאה במסוף:

```js
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
```

<ConsoleBlock level="error">

סיפקת אבזר `value` לשדה טופס ללא מטפל `onChange`. זה יציג שדה לקריאה בלבד. אם השדה צריך להיות ניתן לשינוי use `defaultValue`. אחרת, הגדר `onChange` או `readOnly`.

</ConsoleBlock>

כפי שמציעה הודעת השגיאה, אם רק רצית [לציין את הערך *התחלתי*,](#providing-an-initial-value-for-a-text-area) העבר את `defaultValue` במקום זאת:

```js
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
```

אם אתה רוצה [לשלוט באזור הטקסט הזה עם משתנה state,](#controlling-a-text-area-with-a-state-variable) ציין מטפל `onChange`:

```js
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

אם הערך הוא בכוונה לקריאה בלבד, הוסף אבזר `readOnly` כדי לדכא את השגיאה:

```js
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />
```

---

### אזור הטקסט שלי קופץ להתחלה בכל הקשה {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

אם אתה [שולט באזור טקסט,](#controlling-a-text-area-with-a-state-variable) עליך לעדכן את המשתנה state שלו לערך של אזור הטקסט מה-DOM במהלך `onChange`.

אתה לא יכול לעדכן אותו למשהו אחר מלבד `e.target.value`:

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

אם זה לא פותר את הבעיה, ייתכן שאזור הטקסט יוסר ויתווסף מחדש מה-DOM בכל הקשה. זה יכול לקרות אם אתה [מאפס בטעות את state](/learn/preserving-and-resetting-state) בכל עיבוד מחדש. לדוגמה, זה יכול לקרות אם אזור הטקסט או אחד מההורים שלו תמיד מקבלים תכונה שונה של `key`, או אם אתה מקנן הגדרות רכיבים (מה שאסור ב-React וב-causes של הרכיב ה"פנימי" להתקין מחדש בכל עיבוד).

---

### אני מקבל שגיאה: "רכיב משנה קלט לא מבוקר כדי להיות נשלט" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


אם אתה מספק `value` לרכיב, הוא חייב להישאר מחרוזת לאורך כל חייו.

אתה לא יכול לעבור את `value={undefined}` קודם ומאוחר יותר לעבור את `value="some string"` כי use React לא תדע אם אתה רוצה שהרכיב יהיה לא מבוקר או נשלט. רכיב מבוקר צריך תמיד לקבל מחרוזת `value`, לא `null` או `undefined`.

אם ה-`value` שלך מגיע ממשתנה API או state, ייתכן שהוא מאותחל ל-`null` או `undefined`. במקרה כזה, הגדר אותו למחרוזת ריקה (`''`) בתחילה, או העבר את `value={someValue ?? ''}` כדי לוודא ש`value` היא מחרוזת.
