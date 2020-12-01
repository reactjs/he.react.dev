---
id: uncontrolled-components
title: קומפוננטות לא מבוקרות
permalink: docs/uncontrolled-components.html
---

ברוב המקרים, אנו ממליצים להשתמש [בקומפוננטות מבוקרות](/docs/forms.html#controlled-components) למימוש טפסים. בקומפוננטה מבוקרת, נתוני הטופס מנוהלים על ידי קומפוננטת React. האלטרנטיבה היא קומפוננטה לא מבוקרת, איפה שנתוני הטופס מנוהלים על ידי ה-DOM עצמו.

כדי לכתוב קומפוננטה לא מבוקרת, במקום לרשום event handler לכל עדכון state, אתה יכול [להשתמש ב-ref](/docs/refs-and-the-dom.html) כדי לקבל את ערכי הטופס מה-DOM.

לדוגמא, הקוד הזה מקבל שם יחיד בקומפוננטה לא מבוקרת:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

מכיוון קומפוננטה לא מבוקרת שומרת את מקור האמת ב-DOM, לפעמים זה קל יותר לשלב React ולא React קוד מתי שמשתמשים בקומפוננטה לא מבוקרת. זה גם יכול להיות מעט קוד אם אתה רוצה להיות מהיר ומלוכלך, אחרת, אתה צריך קומפוננטה מבוקרת.

אם זה עדיין לא ברור איזה סוג של קומפוננטה אתה צריך להשתמש בסיטואציה מסויימת, אתה עשוי למצוא את [המאמר הזה על קלט מבוקר נגד לא מבוקר](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) מאוד שימושי.

### ערכי ברירת מחדל {#default-values}

ברנדור מחזור החיים של React, התכונה `value` באלמנטי טופס ידרסו את הערך ב-DOM. עם קומפוננטה לא מבוקרת, לעיתים קרובות תרצה ש-React יספק את הערך הראשוני, אבל ישאיר את העדכונים הבאים לא מבוקרים. כדי לטפל במקרה כזה, אתה יכול לציין את תכונת `defaultValue` במקום `value`. שינוי הערך של `defaultValue` אחרי שקומפוננטה עלתה לא יגרום לעדכון של הערך ב-DOM.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

כך גם, `<input type="checkbox">` ו-`<input type="radio">` תומכים ב-`defaultChecked`, ו-`<select>` ו-`<textarea>` תומכים ב-`defaultValue`.

## התג file input {#the-file-input-tag}

ב-HTML , `<input type="file">` נותן למשתמשים לבחור קובץ אחד או יותר מהמכשיר שלהם לעלות לשרת או לתפעול על ידי JavaScript דרך [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

ב-React, `<input type="file" />` הוא תמיד קומפוננטה לא מבוקרת בגלל שהערך שלו ניתן על ידי המשתמש, ולא באופן תכנותי.

אתה צריך להשתמש ב-File API כדי לתקשר עם קבצים. הדוגמא הבאה מראה איך ליצור [ref ל-DOM node](/docs/refs-and-the-dom.html) כדי לגשת לקובץ(ים) ב-submit handler:

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

