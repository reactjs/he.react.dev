---
id: conditional-rendering
title: רינדור מותנה
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

ב-React, אתם יכולים ליצור קומפוננטות יחודיות אשר מכמסות את ההתנהגות שאתם מחפשים. לאחר מכן, אתם יכולים לרנדר רק חלק מהן, על פי תלות ב-state של האפליקציה שלכם.

רינדור מותנה ב-React פועל באותו אופן שבו עובדים תנאים ב-JavaScript. השתמשו באופרטורים של JavaScript כמו [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) או [האופרטו המותנה](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) כדי ליצור אלמנטים המייצגים את ה-state הנוכחי, ותנו ל-React לעדכן את ממשק המשתמש כדי שיהיה תואם אליהם.

הביטו בשתי הקומפוננטות האלו:

```js
function UserGreeting(props) {
  return <h1>ברוך הבא!</h1>;
}

function GuestGreeting(props) {
  return <h1>אנא הירשם.</h1>;
}
```

ניצור קומפוננטת `Greeting` שמציגה אחת מהקומפוננטות האלו כתלות באם משתמש מחובר:

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

דוגמא זו מרנדרת ברכה שונה כתלות בערך של ה-prop `isLoggedIn`.

### משתני אלמנט {#element-variables}

אתם יכולים להשתמש במשתנים כדי לשמור אלמנטים. זה יכול לעזור לכם לרנדר חלק מהקומפוננטה באופן מותנה בעוד ששאר הפלט אינו משתנה.

הביטו בשתי הקומפוננטות החדשות המייצגות כפתורי התנתקות והתחברות:

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      התחבר
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      התנתק
    </button>
  );
}
```

בדוגמה הבאה, ניצור [קומפוננטה התלויה ב-state](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) שנקראת `LoginControl`.

היא תרנדר `<LoginButton />` או `<LogoutButton />` כתלות ב-state הנוכחי שלה. בנוסף היא תרנדר `<Greeting />` מהדוגמה הקודמת:

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

בעוד שהכרזה על משתנה ושימוש בהצהרה `if` היא דרך מצוינת להתנות רינדור קומפוננטה, לפעמים ייתכן שתרצו להשתמש בתחביר קצר יותר. ישנן מספר דרכים להטמיע תנאים ב-JSX, שמוסברות בהמשך.

### הטמעת תנאי If עם אופרטור && לוגי {#inline-if-with-logical--operator}

ייתכן שתרצו [להטמיע כל ביטוי ב-JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) על ידי עטיפתם בסוגריים מסולסלים. זה כולל את האופרטור הלוגי `&&` של JavaScript. זה יכול להיות שימושי עבור הוספה מותנית של אלמנט:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          יש לך {unreadMessages.length} הודעות שלא נקראו.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

זה עובד בגלל שב-JavaScript, `true && expression` תמיד שווה ערך ל-`expression`, ו-`false && expression` תמיד שווה ערך ל-`false`.

לכן, אם התנאי הוא `true`, האלמנט מימין אחרי `&&` יופיע בפלט. אם הוא `false`, React תתעלם ממנו ותדלג עליו.

### הטמעת If-Else עם אופרטור ההתנייה {#inline-if-else-with-conditional-operator}

שיטה נוספת להטמעת רינדור אלמנטים מותנה היא להשתמש באופרטור ההתנייה של JavaScript [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

בדוגמה הבאה, אנו משתמשים בו כדי לרנדר באופן מותנה בלוק קטן של טקסט.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      המשתמש <b>{isLoggedIn ? 'כרגע' : 'לא'}</b> מחובר.
    </div>
  );
}
```

זה יכול לשמש גם עבור ביטויים גדולים יותר למרות שכך פחות ברור מה קורה:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

בדיוק כמו ב-JavaScript, זה באחריותכם לבחור סגנון מתאים על סמך מה שאתם והצוות שלכם מחשיבים יותר קריא. כמו כן זכרו שבכל פעם שתנאים נהיים מורכבים מדי, זה יכול להיות זמן טוב [לחלץ קומפוננטה](/docs/components-and-props.html#extracting-components).

### מניעת רינדור של קומפוננטה {#preventing-component-from-rendering}

במקרים נדירים ייתכן שתרצו שקומפוננטה תסתיר את עצמה למרות שהיא רונדרה על ידי קומפוננטה אחרת. כדי לעשות זאת החזירו `null` במקום את הפלט שאותו היא אמורה לרנדר.

בדוגמה הבאה, ה-`<WarningBanner />` מרונדר בהתאם לערך של ה-prop שנקרא `warn`. אם ערך ה-prop הוא `false`, אזי הרכיב אינו מתרנדר:

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      אזהרה!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'הסתר' : 'הצג'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

החזרת `null` ממתודת `render` של קומפוננטה לא משפיעה על הרצת מתודות מחזור החיים של קומפוננטה. למשל `componentDidUpdate` עדיין יקרא.
