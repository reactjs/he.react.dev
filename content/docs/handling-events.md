---
id: handling-events
title: טיפול באירועים
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

<<<<<<< HEAD
טיפול באירועים עם אלמנטים של React דומה מאוד לטיפול באירועים באלמנטים של DOM. ישנם כמה הבדלים תחביריים:
=======
Handling events with React elements is very similar to handling events on DOM elements. There are some syntax differences:
>>>>>>> 2ef0ee1e4fc4ce620dce1f3e0530471195dc64d1

* שמות אירועים של React נכתבים באמצעות תחביר camelCase (כל תחילת מילה באות גדולה פרט לראשונה), ולא באותיות קטנות.
* ב-JSX מעבירים פונקציה כמטפל האירוע, ולא מחרוזת.

למשל, ה-HTML:

```html
<button onclick="activateLasers()">
  הפעל לייזרים
</button>
```

הוא מעט שונה ב-React:

```js{1}
<button onClick={activateLasers}>
  הפעל לייזרים
</button>
```

הבדל נוסף הוא שאינכם יכולים להחזיר `false` כדי למנוע התנהגות ברירת מחדל ב-React. אתם חייבים לקרוא ל-`preventDefault` במפורש. לדוגמה, עם HTML רגיל, כדי למנוע את התנהגות ברירת המחדל עבור קישור של פתיחת דף חדש, אתם יכולים לכתוב:

```html
<a href="#" onclick="console.log('הקישור נלחץ.'); return false">
  לחץ עלי
</a>
```

ב-React, זה יכול להיות במקום זאת:

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

כאן, `e` הוא אירוע סינתטי. React מגדיר אירועים סינתטיים אלה בהתאם ל[מפרט W3C](https://www.w3.org/TR/DOM-Level-3-Events/), כך שאתם לא צריכים לדאוג לתאימות בין דפדפנים. עיינו בהפנייה למדריך [`SyntheticEvent`](/docs/events.html) כדי ללמוד עוד.

<<<<<<< HEAD
בעת שימוש ב-React אתם בדרך כלל לא צריכים לקרוא ל-`addEventListener` כדי להוסיף מאזינים לאלמנט DOM לאחר שנוצר. במקום זאת, רק ספקו מאזין כאשר האלמנט רונדר בהתחלה.
=======
When using React, you generally don't need to call `addEventListener` to add listeners to a DOM element after it is created. Instead, just provide a listener when the element is initially rendered.
>>>>>>> 5b6ad388804aaa5cf5504ccd04329f52960e17ae

כאשר אתם מגדירים קומפוננטה באמצעות [מחלקת ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), זהו דפוס נפוץ שמטפל אירוע הוא מתודה במחלקה. למשל, רכיב `Toggle` זה מרנדר כפתור המאפשר למשתמש לעבור בין מצבי "ON" ו-"OFF":

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // ה-binding הזה הכרחי כדי לגרום לכך ש-`this` יעבוד בתוך ה-callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

עליכם להיות זהירים לגבי המשמעות של `this` בקריאות JSX. ב-JavaScript, מתודות מחלקה אינן [bound](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) כברירת מחדל. אם תשכחו לעשות bind ל-`this.handleClick` ותעבירו אותה ל-`onClick`, `this` יהיה `undefined` כאשר הפונקציה תקרא למעשה.

זו אינה התנהגות ספציפית ל-React; זה חלק מ[איך שפונקציות פועלות ב-JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). באופן כללי, אם אתם מתייחסים למתודה ללא `()` אחריה, כגון `onClick={this.handleClick}`, עליכם לעשות bind לאותה מתודה.

אם קריאה ל-`bind` מפריעה לכם, יש שתי דרכים לעקוף את זה. אם אתם משתמשים ב[תחביר שדות ציבוריים של מחלקה](https://babeljs.io/docs/plugins/transform-class-properties/) הנסיוני, תוכלו להשתמש בשדות המחלקה כדי לעשות bind ל-callbacks בדרך הנכונה:

```js{2-6}
class LoggingButton extends React.Component {
  // תחביר זה מבטיח ש-`this` הוא bound בתוך handleClick.
  // אזהרה: זהו תחביר *ניסיוני*.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

תחביר זה מופעל כברירת מחדל ב-[Create React App](https://github.com/facebookincubator/create-react-app).
אם אינכם משתמשים בתחביר שדות של מחלקה, באפשרותכם להשתמש ב[פונקצית חץ](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ב-callback:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // תחביר זה מבטיח ש-`this` הוא bound בתוך handleClick
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

הבעיה עם תחביר זה היא שנוצר callback שונה בכל פעם שה-`LoggingButton` מרונדר. ברוב המקרים, זה בסדר. עם זאת, אם callback זה מועבר כ-prop לקומפוננטות נמוכות יותר, קומפוננטות אלו עשויות לבצע רינדור מחדש נוסף. באופן כללי אנו ממליצים על ביצוע binding בבנאי או באמצעות תחביר שדות מחלקה, כדי למנוע בעית ביצועים זו.

## העברת ארגומנטים למטפלי אירועים {#passing-arguments-to-event-handlers}

<<<<<<< HEAD
בתוך לולאה זהו דבר נפוץ לרצות להעביר פרמטר נוסף למטפל האירוע. לדוגמה, אם `id` הוא מזהה השורה, כל אחת מהאפשרויות הבאות תעבוד:
=======
Inside a loop, it is common to want to pass an extra parameter to an event handler. For example, if `id` is the row ID, either of the following would work:
>>>>>>> 5b6ad388804aaa5cf5504ccd04329f52960e17ae

```js
<button onClick={(e) => this.deleteRow(id, e)}>מחק שורה</button>
<button onClick={this.deleteRow.bind(this, id)}>מחק שורה</button>
```

שתי השורות למעלה שוות, ומשתמשות ב[פונקציות חץ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ו-[`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) בהתאמה.

בשני המקרים, הארגומנט `e` שמייצג את אירוע ה-React יועבר כארגומנט שני לאחר המזהה. עם פונקציית חץ, אנחנו צריכים להעביר אותו במפורש, אבל עם `bind` כל הארגומנטים הנוספים מועברים באופן אוטומטי.
