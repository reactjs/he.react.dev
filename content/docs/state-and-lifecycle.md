---
id: state-and-lifecycle
title: State ומחזור חיים
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

דף זה מציג את הקונספט של state ומחזור חיים בקומפוננטת React. תוכלו למצוא את [פירוט ה-API של קומפוננטה כאן](/docs/react-component.html).

הביטו על דוגמת השעון המתקתק מ[אחד מהחלקים הקודמים](/docs/rendering-elements.html#updating-the-rendered-element). ב[רינדור אלמנטים](/docs/rendering-elements.html#rendering-an-element-into-the-dom), למדנו רק דרך אחת לעדכון ממשק המשתמש. אנו קוראים ל-`ReactDOM.render()` כדי לשנות את הפלט שירונדר:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

בפרק זה נלמד כיצד להפוך את קומפוננטת ה-`Clock` (שעון) לכזאת שבאמת מאפשרת שימוש חוזר ומכומסת (מאפשרת אנקפסולציה). היא תקבע טיימר משלה ותעדכן את עצמה בכל שנייה.

אנחנו יכולים להתחיל על ידי כימוס של תצוגת השעון:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

עם זאת, אנו מפספסים דרישה חיונית: העובדה ש-`Clock` מייצר טיימר ומעדכן את ממשק המשתמש בכל שנייה צריכה להיות חלק מהמימוש של `Clock`.

באופן אידיאלי, אנחנו רוצים לכתוב את זה פעם אחת וש-`Clock` יעדכן את עצמו:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

כדי לממש את זה, עלינו להוסיף "state" לקומפוננטת ה-`Clock`.

State זהה ל-props, אבל הוא פרטי ונשלט במלואו על ידי הקומפוננטה.

## המרת פונקציה למחלקה {#converting-a-function-to-a-class}

אתם יכולים להמיר קומפוננטת פונקציה כמו `Clock` למחלקה בחמישה צעדים:

1. צרו [מחלקת ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), עם שם זהה, שמרחיבה את `React.Component`.

2. הוסיפו לה מתודה אחת ריקה בשם `render()`.

3. העבירו את גוף הפונקציה לתוך מתודת `render()`.

4. החליפו את `props` עם `this.props` בגוף ה-`render()`.

5. מחקו את הצהרת הפונקציה הריקה שנותרה.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` מוגדר כעת כמחלקה במקום כפונקציה.

מתודת `render` תקרא בכל פעם שמתרחש עדכון, אך כל עוד אנו מרנדרים את `<Clock />` אל אותה צומת DOM, נעשה שימוש רק במופע אחד של המחלקה `Clock`. זה מאפשר לנו לעשות שימוש בתכונות נוספות כגון state מקומי ומתודות מחזור חיים.

## הוספת State מקומי למחלקה {#adding-local-state-to-a-class}

נעביר את ה-`date` מ-props ל-state בשלושה שלבים:

1) החליפו את `this.props.date` עם `this.state.date` במתודת ה-`render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) הוסיפו [בנאי מחלקה](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor) שמבצע השמה ל-`this.state` ההתחלתי:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

שימו לב כיצד אנו מעבירים את `props` לבנאי הבסיסי:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

קומפוננטות מחלקה צריכות תמיד לקרוא לבנאי הבסיס עם `props`.

3) הסירו את ה-prop `date` מאלמנט ה-`<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

לאחר מכן נוסיף את קוד הטיימר בחזרה לקומפוננטה עצמה.

התוצאה נראית כך:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

בשלב הבא, נדאג ש-`Clock` יגדיר טיימר משלו ויעדכן את עצמו בכל שנייה.

## הוספת מתודות מחזור חיים למחלקה {#adding-lifecycle-methods-to-a-class}

באפליקציות עם קומפוננטות רבות, חשוב מאוד לשחרר משאבים שנלקחו על ידי הקומפוננטות כאשר הן מושמדות.

אנחנו רוצים [להגדיר טיימר](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) בכל פעם ש-`Clock` מרונדר לתוך ה-DOM בפעם הראשונה. זה נקרא "mounting" ב-React.

אנחנו גם רוצים [לנקות את אותו טיימר](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) בכל פעם שה-DOM שמיוצר על ידי ה-`Clock` מוסר. זה נקרא "unmounting" ב-React.

אנו יכולים להכריז על מתודות מיוחדות במחלקת הקומפוננטה כדי להריץ קוד כלשהו כאשר קומפוננטה עושה mount ו-unmount:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

מתודות אלו נקראות "מתודות מחזור חיים".

מתודת `componentDidMount()` רצה לאחר שפלט הקומפוננטה רונדר ל-DOM. זה מקום טוב להגדיר טיימר:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

<<<<<<< HEAD
שימו לב איך אנו שומרים על מזהה הטיימר על ה-`this.timerID`.
=======
Note how we save the timer ID right on `this` (`this.timerID`).
>>>>>>> 4af9f2dcd1014c18ea6ce98794ba0d63874ac9d2

בעוד ש-`this.props` מוגדר על-ידי React עצמה ול-`this.state` יש משמעות מיוחדת, אתם רשאים להוסיף שדות נוספים באופן ידני למחלקה אם עליכם לאחסן דבר כלשהו שאינו חלק מזרם הנתונים (כמו מזהה הטיימר).

אנו נחסל את הטיימר במתודת מחזור החיים `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

לבסוף, נממש מתודה הנקראת `tick()` שתקרא על ידי הקומפוננטה `Clock` בכל שנייה.

היא תשתמש ב-`this.setState()` כדי לתזמן עדכונים ל-state המקומי של הקומפוננטה:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

כעת השעון מתקתק בכל שניה.

בואו נסכם בזריזות את מה שקורה ואת הסדר שבו מתודות נקראות:

1) כאשר `<Clock />` מועבר ל-`ReactDOM.render()`, React קוראת לבנאי של הרכיב `Clock`. מכיוון ש-`Clock` צריך להציג את השעה הנוכחית, הוא מאתחל את `this.state` עם אובייקט שכולל את הזמן הנוכחי. בהמשך נעדכן את ה-state הזה.

2) אז React קוראת למתודת `render()` של קומפוננטת ה-`Clock`. באופן זה React לומדת מה צריך להיות מוצג על המסך. אז React מעדכנת את ה-DOM כדי שיהיה תואם לפלט שרונדר על ידי `Clock`.

3) כאשר הפלט של `Clock` מוכנס ל-DOM, React קוראת למתודת מחזור החיים `componentDidMount()`. בתוכה, קומפוננטת `Clock` מבקשת מהדפדפן להגדיר טיימר כדי לקרוא למתודת `tick()` של הקומפוננטה פעם בשנייה.

4) בכל שנייה הדפדפן קורא למתודה `tick()`. בתוכה, קומפוננטת `Clock` מתזמנת את עדכון ממשק המשתמש על ידי קריאה ל-`setState()` עם אובייקט המכיל את הזמן הנוכחי. הודות לקריאה ל-`setState()`, React יודעת שה-state השתנה, וקוראת למתודת `render()` שוב כדי ללמוד מה צריך להיות על המסך. הפעם, `this.state.date` במתודת `render()` יהיה שונה, ולכן הפלט המרונדר יכלול את הזמן המעודכן. React מעדכנת את ה-DOM בהתאם.

5) אם הקומפוננטה `Clock` מוסרת מה-DOM, React קוראת למתודת מחזור החיים `componentWillUnmount()` כך שהטיימר יופסק.

## שימוש נכון ב-State {#using-state-correctly}

ישנם שלושה דברים שעליכם לדעת לגבי `setState()`.

### אל תשנו את State ישירות {#do-not-modify-state-directly}

למשל, זה לא ירנדר מחדש קומפוננטה:

```js
// טעות
this.state.comment = 'Hello';
```

במקום, השתמשו ב-`setState()`:

```js
// נכון
this.setState({comment: 'Hello'});
```

המקום היחידי שבו אתם כן יכולים לבצע השמה ל-`this.state` הוא הבנאי.

### עדכוני State יכולים להיות אסינכרוניים {#state-updates-may-be-asynchronous}

React עשויה לקבץ מספר קריאות ל-`setState()` לתוך עדכון יחיד על מנת לשפר ביצועים.

מכיוון ש-`this.props` ו-`this.state` עשויים להתעדכן באופן אסינכרוני, עליכם לא להסתמך על הערכים שלהם לצורך חישוב ה-state הבא.

למשל, קוד זה עלול להכשל בעדכון המונה:

```js
// טעות
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

כדי לתקן זאת, השתמש בסוג השני של `setState()` שמקבל פונקציה במקום אובייקט. פונקציה זו תקבל את ה-state הקודם כארגומנט הראשון, ואת ה-props בעת החלת העדכון כארגומנט השני:

```js
// נכון
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

אנו משתמשים ב[פונקציית חץ](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) למעלה, אבל זה עובד גם עם פונקציות רגילות:

```js
// נכון
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### עדכוני State ממוזגים {#state-updates-are-merged}

כאשר אתם קוראים ל-`setState()`, React ממזגת את האובייקט שאתם מספקים ל-state הנוכחי.

למשל, ה-state שלכם עלול להכיל מספר משתנים בלתי תלויים:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

לאחר מכן תוכלו לעדכן אותם באופן בלתי תלוי באמצעות קריאות `setState()` נפרדות:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

המיזוג הוא רדוד, ולכן `this.setState({comments})` משאיר את `this.state.posts` ללא שינוי, אך מחליף לחלוטין את `this.state.comments`.

## הנתונים זורמים למטה {#the-data-flows-down}

לא קומפוננטות הורים ולא קומפוננטות ילדים יכולות לדעת אם קומפוננטה מסוימת בעלת state או ללא state, ולא צריך לשנות להן אם היא מוגדרת כפונקציה או כמחלקה.

זו הסיבה ש-state נקרא לעתים קרובות מקומי או מוכמס. הוא אינו נגיש לאף קומפוננטה אחרת פרט לזו שהוא בבעלותה ומגדירה אותו.

קומפוננטה יכולה לבחור להעביר את ה-state שלה למטה בתור props לקומפוננטות הילדים שלה:

```js
<FormattedDate date={this.state.date} />
```

הקומפוננטה `FormattedDate` תקבל את ה-`date` ב-props שלה ולא תדע אם הוא בא מה-state של `Clock`, מה-props של `Clock` או שהוקלד ידנית:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

זה נקרא בדרך כלל זרימת הנתונים "מלמעלה למטה" או "חד כיווניות". כל state הוא תמיד בבעלות קומפוננטה מסוימת, וכל נתון או ממשק משתמש הנגזר מה-state הזה יוכלו להשפיע רק על קומפוננטות שנמצאות "מתחתיהם" בעץ.

אם אתם מדמיינים עץ קומפוננטות כמפל של props, כל state של קומפוננטה היא כמו מקור מים נוסף שמצטרף אליו בנקודה שרירותית אבל גם זורם כלפי מטה.

כדי להראות שכל הקומפוננטות מבודדות באמת, אנו יכולים ליצור קומפוננטת `App` המרנדרת שלושה `<Clock>`-ים:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

כל `Clock` מקים טיימר משלו ומתעדכן באופן עצמאי.

באפליקציות React, ההחלטה אם רכיב הוא בעל state או חסר state נחשבת לפריט מימוש של הקומפוננטה שעשוי להשתנות לאורך זמן. אתם יכולים להשתמש בקומפוננטות חסרות state בתוך קומפוננטות בעלות state, ולהיפך.
