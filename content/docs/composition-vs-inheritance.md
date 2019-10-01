---
id: composition-vs-inheritance
title: הכלה לעומת הורשה
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React היא בעלת מודל הכלה רב עוצמה ואנו ממליצים להשתמש בהכלה במקום הורשה על מנת לבצע שימוש חוזר בקוד בין קומפוננטות.

בפרק זה נעסוק במספר בעיות שקורות כאשר מתכנתי React חדשים בוחרים לעיתים קרובות להשתמש בהורשה ונציג איך ניתן לפתור בעיות אלו באמצעות הכלה.

## Containment {#containment}

ישנן קומפוננטות אשר אינן מכירות את ילדיהן מראש. מצב זה נפוץ בעיקר בקומפוננטות כמו `Sidebar` או `Dialog` אשר מציגות קופסאות גנריות.

אנו ממליצים שקומפוננטות כאלו יעשו שימוש בprop `children` על מנת להעביר אלמנטי ילדים ישירות כפלט שלהן:

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

דבר זה מאפשר לקומפוננטות אחרות להעביר אלמנטי ילדים שרירותיים על ידי קינון ה-JSX:

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

**[נסה זאת ב-CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

כל דבר בתוך תגית ה-JSX של `<FancyBorder>` מועבר לקומפוננטה `FancyBorder`-כprop בשם `children`.-מכיוון ש`FancyBorder` מרנדר `{props.children}` בתוך אלמנט ה-`<div>`, האלמנטים המועברים מופיעים בפלט הסופי.

לעיתים באופן פחות נפוץ נדרשים מספר ״חורים״ בקומפוננטה. במקרים הללו אתה יכול לבחור בקונבנציה שלך במקום להשתמש ב-`children`:

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**נסה זאת ב-CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

אלמנטי React כמו `<Contacts />` ו`<Chat />` הם פשוט אובייקטים, אז אתה יכול להעביר אותם כ-props כמו כל מידע אחר. גישה זאת יכולה להזכיר ״slots" בספריות אחרות, אבל אין הגבלות לגבי מה שניתן להעביר כ-props -בReact.

## Specialization {#specialization}

לעיתים אנו חושבים על קומפוננטות כ״מקרים מיוחדים״ של קומפוננטות אחרות. לדוגמא, אנחנו יכולים להגיד ש-`WelcomeDialog` הוא מקרה מיוחד של `Dialog`.

-בReact, זה מושג גם על ידי הכלה, היכן שקומפוננטה ״ספציפית״ מרנדרת קומפוננטה ״גנרית״ יותר ומקנפגת אותה עם props:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[**נסה זאת ב-CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

הכלה עובדת טוב בצורה שווה עבור קומפוננטות המוגדרות כמחלקות:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[**נסה זאת ב-CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## אז מה לגבי הורשה? {#so-what-about-inheritance}

בפייסבוק אנחנו משתמשים ב-React באלפי קומפוננטות, ולא מצאנו שימושים כלשהם בהם אנו ממליצים על יצירת היררכיית הורשת קומפוננטות.

Props והכלה נותנים את כל הגמישות שצריך על מנת להתאים נראות והתנהגות של קומפוננטה בצורה מפורשת ובטוחה יותר. זכור כי קומפוננטות יכולות לקבל props שרירותיים, כולל ערכים פרימיטיביים, אלמנטי React או פונקציות.

אם ברצונך לבצע שימוש חוזר בפונקציונליות, שאינה של ממשק משתמש, אנו מציעים להוציא אותה למודול JavaScript נפרד. הקומפוננטות יכולות לייבא זאת ולהשתמש בפונקציה, באובייקט או במחלקה מבלי להרחיב אותם.
