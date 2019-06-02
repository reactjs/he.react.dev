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


## Where to Place Error Boundaries {#where-to-place-error-boundaries}

The granularity of error boundaries is up to you. You may wrap top-level route components to display a “Something went wrong” message to the user, just like server-side frameworks often handle crashes. You may also wrap individual widgets in an error boundary to protect them from crashing the rest of the application.


## New Behavior for Uncaught Errors {#new-behavior-for-uncaught-errors}

This change has an important implication. **As of React 16, errors that were not caught by any error boundary will result in unmounting of the whole React component tree.**

We debated this decision, but in our experience it is worse to leave corrupted UI in place than to completely remove it. For example, in a product like Messenger leaving the broken UI visible could lead to somebody sending a message to the wrong person. Similarly, it is worse for a payments app to display a wrong amount than to render nothing.

This change means that as you migrate to React 16, you will likely uncover existing crashes in your application that have been unnoticed before. Adding error boundaries lets you provide better user experience when something goes wrong.

For example, Facebook Messenger wraps content of the sidebar, the info panel, the conversation log, and the message input into separate error boundaries. If some component in one of these UI areas crashes, the rest of them remain interactive.

We also encourage you to use JS error reporting services (or build your own) so that you can learn about unhandled exceptions as they happen in production, and fix them.


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
