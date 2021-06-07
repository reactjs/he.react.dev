---
id: forms
title: טפסים
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

<<<<<<< HEAD
אלמנטים של טפסיHTML עובדים מעט שונה מאשר אלמנטים אחרים של ה-DOM ב-React, מכיוון שאלמנטים של טפסים באופן טבעי שומרים על state פנימי. למשל, הטופס הבא ב-HTML פשוט מקבל שם אחד:
=======
HTML form elements work a bit differently from other DOM elements in React, because form elements naturally keep some internal state. For example, this form in plain HTML accepts a single name:
>>>>>>> 68e4efcf93b6e589355f6aa3cbc3f3c811c0ad37

```html
<form>
  <label>
    שם:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

לטופס זה יש את התנהגות ברירת המחדל של טפסי HTML של מעבר לדף חדש כאשר המשתמש שולח את הטופס. אם אתם רוצים את התנהגות זו ב-React, ככה זה עובד. אבל ברוב המקרים, זה נוח שיש פונקצית JavaScript המטפלת בשליחת הטופס ויש לה גישה לנתונים שהמשתמש הכניס לטופס. הדרך הסטנדרטית להשיג זאת היא באמצעות טכניקה הנקראת "קומפוננטות מבוקרות".

## קומפוננטות מבוקרות {#controlled-components}

ב-HTML, אלמנטים של טופס כגון `<input>`, `<textarea>`, ו-`<select>`שומרים בדרך כלל על מצבם ומעדכנים אותו על סמך קלט מהמשתמש. ב-React, `state` בר-שינוי נשמר בדרך כלל במאפייני ה-state של קומפוננטות, ומעודכן רק עם [`setState()`](/docs/react-component.html#setstate).

אנחנו יכולים לשלב את השניים על ידי הפיכת ה-state של React להיות "single source of truth" (מקור אמת יחיד). לאחר מכן קומפוננטת ה-React שמרנדרת טופס גם שולטת במה שקורה באותו טופס על קלט המשתמש הבא. קלט מאלמנט טופס שערכו נשלט על ידי React בדרך זו נקרא "קומפוננטה מבוקרת".

לדוגמה, אם אנחנו רוצים לשנות את הדוגמה הקודמת כך שתרשום ל-log את השם כאשר הטופס נשלח, אנחנו יכולים לרשום את הטופס כקומפונטה מבוקרת:

```javascript{4,10-12,21,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('שם חדש נשלח: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          שם:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="שלח" />
      </form>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

עם קומפוננטה נשלטת, ערך הקלט תמיד מונע על ידי ה-state. למרות שזה אומר שיש צורך בכתיבת יותר קוד, עכשיו ניתן להעביר את הערך לאלמנטי UI אחרים גם, או לאתחל אותו מ-event handlers אחרים.

## תגית ה-textarea {#the-textarea-tag}

ב-HTML, אלמנט `<textarea>` מגדיר את הטקסט שלו על ידי הילדים שלו:

```html
<textarea>
  היי, זה מעט טקסט ב-textarea
</textarea>
```

ב-React, `<textarea>` משתמש במאפיין `value` במקום. בדרך זו, טופס המשתמש ב-`<textarea>` יכול להכתב באופן מאוד דומה לטופס המשתמש ב-input של שורה אחת:

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'אנא כתבו מאמר אודות אלמנט ה-DOM האהוב עליכם.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('מאמר נשלח: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="שלח" />
      </form>
    );
  }
}
```

שימו לב ש-`this.state.value` מאותחל בבנאי, כך שה-text area מאותחל עם קצת טקסט בתוכו.

## תגית select {#the-select-tag}

ב-HTML, `<select>` מייצר רשימה נפתחת. למשל, ה-HTML הבא מייצר רשימה נפתחת של טעמים:

```html
<select>
  <option value="grapefruit">אשכולית</option>
  <option value="lime">ליים</option>
  <option selected value="coconut">קוקוס</option>
  <option value="mango">מנגו</option>
</select>
```

שימו לב שהאפשרות קוקוס נבחרה תחילה, בגלל השימוש במאפיין`selected`. React, במקום להשתמש במאפיין `selected`, משתמשת במאפיין `value` של תגית השורש `select`. זה נוח יותר בקומפוננטה מבוקרת מכיוון שאתם צריכים לעדכן אותו רק במקום אחד. לדוגמה:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('הטעם האהוב עליך: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">אשכולית</option>
            <option value="lime">ליים</option>
            <option value="coconut">קוקוס</option>
            <option value="mango">מנגו</option>
          </select>
        </label>
        <input type="submit" value="שלח" />
      </form>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

באופן  כללי, זה גורם לכך ש-`<input type="text">`, `<textarea>`, ו-`<select>` כולם עובדים באופן מאוד דומה - כולם מקבלים מאפיין `value` שבו ניתן להשתמש כדי לממש קומפוננטה מבוקרת.

> הערה
>
> ניתן להעביר למאפיין `value` מערך, המאפשר לכם לבחור אפשרויות מרובות בתגית `select`:
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## תגית ה-file input {#the-file-input-tag}

ב-HTML, תגית `<input type="file">` מאפשרת למשתמש לבחור קובץ אחד או יותר מזכרון המכשיר שלהם להעלאה לשרת או לביצוע מניפולציות על ידי JavaScript דרך ה-[File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```



מכיוון שהערך שלו הוא לקריאה בלבד, זוהי קומפוננטה **שאינה מבוקרת** ב-React. היא נדונה בהרחבה יחד עם קומפוננטות בלתי מבוקרות אחרות [בשלב מאוחר יותר בתיעוד](/docs/uncontrolled-components.html#the-file-input-tag).

## טיפול בקלטים מרובים {#handling-multiple-inputs}

כאשר אתם צריכים להתמודד עם מספר אלמנטי `input` מבוקרים, אתם יכולים להוסיף מאפיין `name` לכל אלמנט ולתת לפונקציה המטפלת לבחור מה לעשות על סמך הערך של `event.target.name`.

לדוגמה:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          מגיעים:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          מספר אורחים:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

שימו לב כיצד אנו משתמשים בתחביר [שם מאפיין מחושב](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) של ES6 כדי לעדכן את מפתח ה-state בהתאמה לשם הקלט שהתקבל:

```js{2}
this.setState({
  [name]: value
});
```

זה שווה ערך לקוד ה-ES5 הזה:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

בנוסף, מאחר ש-`setState()` [ממזגת state חלקי ל-state הנוכחי](/docs/state-and-lifecycle.html#state-updates-are-merged) אוטומטית, אנחנו רק צריכים לקרוא לה עם החלקים השתנו.

## ערך ריק בקלט מבוקר {#controlled-input-null-value}

ציון ערך ה-prop על [קומפוננטה מבוקרת](/docs/forms.html#controlled-components) מונעת מהמשתמש לשנות את הקלט אלא אם כן אתם חפצים בכך. אם ציינתם ערך `value` אבל ה-input עדיין ניתן לעריכה, יכול להיות שבטעות הגדרתם את `value` ל-`undefined` או `null`.

הקוד הבא מדגים זאת. (ה-input נעול בהתחלה, אך הופך לניתן לעריכה לאחר עיכוב קצר).

```javascript
ReactDOM.render(<input value="היי" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## אלטרנטיבות לקומפוננטות מבוקרות {#alternatives-to-controlled-components}

זה יכול לפעמים להיות מייגע להשתמש בקומפוננטות מבוקרות, כי אתם צריכים לכתוב מטפל אירוע עבור כל דרך בה הנתונים שלכם יכולים להשתנות ולשרשר את כל מצבי הקלט באמצעות קומפוננטת React. זה יכול להיות מעצבן במיוחד כאשר אתם ממירים קוד קוד קיים ל-React, או משלבים אפליקציית React עם ספרייה שאינה React. במצבים אלו, ייתכן שתרצו לבדוק על [קומפוננטות בלתי מבוקרות](/docs/uncontrolled-components.html), טכניקה חלופית למימוש טפסי קלט.

## פתרונות כוללים {#fully-fledged-solutions}

אם אתם מחפשים פתרון מלא הכולל אימות, מעקב אחר שדות שבוקרו, וטיפול בשליחת טופס, [Formik](https://jaredpalmer.com/formik) היא אחת האפשרויות הפופולריות. עם זאת, הוא בנוי על אותם עקרונות של קומפוננטות מבוקרות וניהול state — אז אל תזניחו לימוד שלהם.
