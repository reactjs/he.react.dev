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

## מעקבי ערימות לקומפוננטות {#component-stack-traces}

בגרסה 16 של React כל השגיאות שקורות בזמן הרינדור בסביבת הפיתוח מודפסות למסוף בדפדפן, אפילו אם האפליקציה בולעת אותם בטעות. בנוסף להודעת השגיאה ומעקב העירומת של JavaScript, מודפס גם מעקר הערימה של הקומפפוננטה. עכשיו אפשר לראות בדיוק איפה בקומפוננטה קרתה השגיאה:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="שיגאה שנתפסה על ידי גובל השגיאות">

אפשר גם לראות את שם הקובץ ומספר השורה בקוד הקומפוננטה בעזרת מעקב הערימות. זה עובד בברירת המחדל בפרויקטים שנוצרו עם [אפליקצית Create React](https://github.com/facebookincubator/create-react-app):

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="שגיאה שנתפסה על ידי גובל השגיאות עם מספר שורה">

אם לא יצרתם את הפרויקט עם אפליקצית Create React, תוכלו להשתמש [בתוסף הזה](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) - הוסיפו אותו לתצורת ה-Babel בפרויקט. שימו לב שהוא מיועד רק לשימוש בסביבת הפיתוח ו**חובה לנטרל אותו בסביבת הייצור**.

> הערה
>
> שמות הקומפוננטות שמוצגים במעקב הערימות תלוי בשם שהוגדר במאפיין [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name). אם אתם צריכים לתמוך בדפדפנים או מכשירים ישנים יותר שלא תומכים בזה באופן סטנדרטי (כמו IE 11 למשל), תוכלו להוסיף את המאפיין כ- polyfill שיוכלל ב-bundle האפליקציה, כמו [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). דרך נוספת היא לספק באופן ישיר את המאפיין [`displayName`](/docs/react-component.html#displayname) בכל קומפוננטה.


## מה עם בלוק try/catch? {#how-about-trycatch}

בלוק `try/catch` זה מצוין אבל עובד רק בקוד אימפרטיבי (קוד שמשנה את מצב האפליקציה):

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

לעומת זאת, קומפוננטות React הן דקלרטיביות ורק מציינות *מה* צריך לרנדר באפליקציה:

```js
<Button />
```

גובלי שגיאות משמרים את האופן הדקלרטיבי של React ומספקים התנהגות דומה. לדוגמא, אפילו אם שגיאה צצה במתודת ה-`componentDidUpdate` שנגרמה איפשהו עמוק בתוך העץ בתוך `setState`, היא תוצף לגובל השגיאות הקרוב ביותר.

## מה עם מטפלי אירועים? {#how-about-event-handlers}

גובלי שגיאות **לא** תופסים שגיאות מתוך מטפלי אירועים.

React לא צריך גובלי שגיאות כדי להתאושש משגיאות במטפלי אירועים. בשונה מהמתודת הרינדור ומתודות מחזור החיים, שגיאות שצצות במטפלי האירועים לא קורות בזמן הרינדור. אז אם צצה שגיאה, React עדיין ידע מה להציג.

כשיש צורך לתפוס שגיאה במטפל האירועים, השתמשו בבלוק ה-`try` / `catch` כרגיל:


```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // קוד שזורק שגיאה
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

שימו לב שהדוגמא הנ״ל מדגימה קוד JavaScript סטנדרטי לטיפול בשגיאות ולא קשורה בשום אופן לגבולות שגיאות.

## שינוי שם מגרסה 15 {#naming-changes-from-react-15}

גרסה 15 של React כללה תמיכה מוגבלת ביותר לגבולות שגיאות תחת מתודה בשם אחר: `unstable_handleError`. המתודה הזאת כבר לא נתמכת, ותאלצו לשנות אותה ל- `componentDidCatch` בקוד שלכם החל מגרסת הביתא הראשונה של React 16.

בשביל השינוי הזה, כללנו [משנה קוד (codemod)](https://github.com/reactjs/react-codemod#error-boundaries) כדי לעדכן באופן אוטומטי את הקוד הרלוונטי.
