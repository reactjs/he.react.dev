---
id: error-boundaries
title: גבולות שגיאות
permalink: docs/error-boundaries.html
---

בעבר, שגיאות בתוך קומפוננטות ב-JavaScript הובילו להשחתת המצב הפנימי של React וגרמו ל[פליטת](https://github.com/facebook/react/issues/4026) [שגיאות](https://github.com/facebook/react/issues/6895) [אניגמטיות](https://github.com/facebook/react/issues/8579) ברינדור המסך הבא. מקור הבעיה תמיד נבע משגיאות קודמות בקוד האפליקציה, אבל React לא סיפק דרך לטפל בהם בחן בתוך הקומפוננטות, ולא מצא דרך להתאושש מהם.

## גובלי השגיאות {#introducing-error-boundaries}

שגיאת JavaScript בחלק מממשק המשתמש לא אמורה לשבור את כל האפליקציה. כדי לפתור את הבעיה למשתמשי React, גרסה 16 מציגה קונספט חדש של ״גובלי שגיאות״.

גובלי שגיאות הם בעצם קומפוננטות ש**תופסות שגיאות JavaScript שקורות בכל אחד מקומפוננטות הילד שלהן, מתעדות אותן ומציגות ממשק חלופי.** במקום להציג את הקומפוננטה השבורה. הן תופסות שגיאות בזמן רינדור, במתודות מחזור חיים ובבנאי הקומפוננטות עבור כל אחת מקומפוננטות הילד שלהן.

> הערה
>
> גובלי שגיאות **לא** תופסים שגיאות ב:
>
> * מטפלי אירועים ([מידע נוסף](#how-about-event-handlers))
> * קוד אסינכרוני (לדוגמא `setTimeout` או `requestAnimationFrame`)
> * רינדור בצד השרת
> * שגיאות שקורות בגובל השגיאות עצמו

קומפוננטת מחלקה הופכת לגובל שגיאות אם היא מגדירה לפחות אחת ממתודות מחזור החיים [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) או [`componentDidCatch()`](/docs/react-component.html#componentdidcatch).
המתודה `static getDerivedStateFromError()` משמשת לרנדור ממשק חלופי לאחר שגיאה שנתפסה, ו- `componentDidCatch()` עוזרת בתיעוד השגיאה.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // כדי שהרינדור הבא יציג ממשק חלופי state מעדכנת את ה
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // אפשר גם לתעד את השגיאה לשירות לוגר
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // מגדירים ממשק חלופי מותאם
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

השימוש בגובל השגיאות זהה לשימוש בכל קומפוננטה רגילה:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

גובלי שגיאות עובדים בצורה דומה לבלוק `catch {}` ב-JavaScript, אבל בתוך הקומפוננטה.
רק קומפוננטות מחלקה יכולות לגבול שגיאות. בפועל, מגדירים בדרך כלל גובל שגיאות אחד ונשתמש בו בצורה אחידה בכל האפליקציה.

שימו לב ש**גובלי שגיאות תופסים אך ורק שגיאות בקומפוננטות הילד שלהם**, ולא בתוך עצמם. אם מתרחשת שגיאה בקוד ה- `render` של גובל השגיאות לדוגמא, השגיאות תעלה לגובל השגיאות הבא מעליה, בדיוק כמצופה מההתנהגות של בלוק ה- `catch {}` ב-JavaScript.

## הדגמה חיה {#live-demo}

שימו לב ל[דוגמא הבאה של הגדרה ושימוש בגובל שגיאות](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) עם [גרסה 16 של React](/blog/2017/09/26/react-v16.0.html).


## איפה למקם את גובל השגיאות {#where-to-place-error-boundaries}

אפשר להגדיר גובלי שגיאות ברמה גבוהה או נמוכה לפי הצורך או לפי ההעדפה אישית. לדוגמא, בשורש הצומת של עץ הקומפוננטות עם ממשק חלופי של ״משהו השתבש..״ (כמו שלרוב מנוהלות התרסקויות בצד השרת), או לחלופין לעטוף כל קומפוננטה או ווידג׳ט בגובל שגיאות אישי כדי למנוע התרסקות של שאר האפליקציה.

## התנהגות חדשה לשגיאות שלא נתפסו {#new-behavior-for-uncaught-errors}

גרסה 16 של React מציגה שינוי בהתנהגות עם השלכות חשובות. **שגיאות של נתפסות על ידי גובל שגיאות יביאו לפירוק מוחלט של עץ הקומפוננטות הראשי**.

דנו בהחלטה זו לא מעט, אבל מנסיונינו תמיד כדאי שלא להשתמש בממשק מושחת, אלא להפטר ממנו לגמרי. לדוגמא, באפליקציה כמו מסנג׳ר, להשאיר ממשק שבור בצורה גלויה לעין יכול להוביל לשליחת הודעה לאדם הלא נכון. באותה מידה, באפליקציה שמנהלת כספים עדיף לא להציג כלום מאשר להציג סכום שגוי.

השינוי הזה אומר שכשמשדרגים לגרסה 16, בדרך כלל מגלים שגיאות באפליקציה שעד אז לא שמנו לב אליהן. הוספת גובלי שגיאות מאפשר לנו לספק חווית משתמש טובה יותר בכל מצב.

לדוגמא, המסנג׳ר של Facebook עוטף תוכן מהסרגל הצידי, חלונית המידע, חלונית השיחה ושדה הקלט של ההודעה בגובלי שגיאות נפרדים. במקרה ואחד מהם קורס, האחרים נשארים זמינים ואינטרקטיביים.

אנחנו ממליצים גם להשתמש בשירותי דיווח השגיאות של JavaScript (או לבנות שירותים דומים בעצמכם), על מנת למצוא בעיות בסביבת הייצור ולתקן אותן בקלות ובמהירות.


## Component Stack Traces {#component-stack-traces}

React 16 prints all errors that occurred during rendering to the console in development, even if the application accidentally swallows them. In addition to the error message and the JavaScript stack, it also provides component stack traces. Now you can see where exactly in the component tree the failure has happened:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error caught by Error Boundary component">

You can also see the filenames and line numbers in the component stack trace. This works by default in [Create React App](https://github.com/facebookincubator/create-react-app) projects:

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

If you don’t use Create React App, you can add [this plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manually to your Babel configuration. Note that it’s intended only for development and **must be disabled in production**.

> Note
>
> Component names displayed in the stack traces depend on the [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) property. If you support older browsers and devices which may not yet provide this natively (e.g. IE 11), consider including a `Function.name` polyfill in your bundled application, such as [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Alternatively, you may explicitly set the [`displayName`](/docs/react-component.html#displayname) property on all your components.


## How About try/catch? {#how-about-trycatch}

`try` / `catch` is great but it only works for imperative code:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

However, React components are declarative and specify *what* should be rendered:

```js
<Button />
```

Error boundaries preserve the declarative nature of React, and behave as you would expect. For example, even if an error occurs in a `componentDidUpdate` method caused by a `setState` somewhere deep in the tree, it will still correctly propagate to the closest error boundary.

## How About Event Handlers? {#how-about-event-handlers}

Error boundaries **do not** catch errors inside event handlers.

React doesn't need error boundaries to recover from errors in event handlers. Unlike the render method and lifecycle methods, the event handlers don't happen during rendering. So if they throw, React still knows what to display on the screen.

If you need to catch an error inside event handler, use the regular JavaScript `try` / `catch` statement:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <div onClick={this.handleClick}>Click Me</div>
  }
}
```

Note that the above example is demonstrating regular JavaScript behavior and doesn't use error boundaries.

## Naming Changes from React 15 {#naming-changes-from-react-15}

React 15 included a very limited support for error boundaries under a different method name: `unstable_handleError`. This method no longer works, and you will need to change it to `componentDidCatch` in your code starting from the first 16 beta release.

For this change, we’ve provided a [codemod](https://github.com/reactjs/react-codemod#error-boundaries) to automatically migrate your code.
