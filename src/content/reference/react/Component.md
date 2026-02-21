---
title: "רְכִיב"
---

<Pitfall>

אנו ממליצים להגדיר רכיבים כפונקציות במקום מחלקות. [ראה כיצד להעביר.](#alternatives)

</Pitfall>

<Intro>

`Component` היא המחלקה הבסיסית עבור רכיבי React המוגדרים כ-[JavaScript מחלקות.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) רכיבי מחלקה עדיין נתמכים על ידי React, אך אנו לא ממליצים להשתמש בהם בקוד חדש.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `Component` {/*component*/}

כדי להגדיר רכיב React כמחלקה, הרחב את המחלקה המובנית `Component` והגדר שיטה [`render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

נדרשת רק שיטת `render`, שיטות אחרות הן אופציונליות.

[ראה דוגמאות נוספות למטה.](#usage)

---

### `context` {/*context*/}

ה-[הקשר](/learn/passing-data-deeply-with-context) של רכיב מחלקה זמין בתור `this.context`. זה זמין רק אם אתה מציין *איזה* הקשר אתה רוצה לקבל באמצעות [`static contextType`](#static-contexttype) (מודרני) או [`static contextTypes`](#static-contexttypes) (הוצא משימוש).

רכיב מחלקה יכול לקרוא רק הקשר אחד בכל פעם.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

קריאת `this.context` ברכיבי כיתה שווה ערך ל-[`useContext`](/reference/react/useContext) ברכיבי פונקציה.

[ראה כיצד להעביר.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

ה-props שהועברו לרכיב מחלקה זמינים בתור `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

קריאת `this.props` ברכיבי הכיתה שווה ערך ל[הכרזה על props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) ברכיבי פונקציה.

[ראה כיצד להעביר.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

API זה יוסר בגרסה עיקרית עתידית של React. [השתמש במקום זאת ב-`createRef`.](/reference/react/createRef)

</Deprecated>

מאפשר לך לגשת ל[מחרוזת מדור קודם](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) עבור רכיב זה.

---

### `state` {/*state*/}

ה-state של רכיב מחלקה זמין בתור `this.state`. השדה `state` חייב להיות אובייקט. אל תשנה את ה-state ישירות. אם ברצונך לשנות את ה-state, התקשר ל-`setState` עם ה-state החדש.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

הגדרת `state` ברכיבי מחלקה שווה ערך לקריאה [`useState`](/reference/react/useState) ברכיבי פונקציה.

[ראה כיצד להעביר.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[קונסטרוקטור](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) פועל לפני שרכיב המחלקה שלך *מועלה* (מתווסף למסך). בדרך כלל, בנאי הוא רק used לשתי מטרות ב-React. הוא מאפשר לך להכריז על state ו-[bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) שיטות המחלקה שלך למופע המחלקה:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

אם אתה use תחביר JavaScript מודרני, לעתים נדירות יש צורך בבנאים. במקום זאת, אתה יכול לשכתב את הקוד הזה למעלה באמצעות [תחביר שדה הכיתה הציבורי](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) שנתמך הן על ידי דפדפנים מודרניים והן על ידי כלים כמו [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

בנאי לא אמור להכיל תופעות לוואי או מנויים.

#### פרמטרים {/*constructor-parameters*/}

* `props`: ה-props הראשוני של הרכיב.

#### מחזירה {/*constructor-returns*/}

`constructor` לא אמור להחזיר כלום.

#### אזהרות {/*constructor-caveats*/}

* אל תפעיל תופעות לוואי או מנויים בבנאי. במקום זאת, use [`componentDidMount`](#componentdidmount) עבור זה.

* בתוך קונסטרוקטור, אתה צריך לקרוא `super(props)` לפני כל statement אחר. אם לא תעשה זאת, `this.props` יהיה `undefined` בזמן שהקונסטרוקטור פועל, מה שיכול להיות מבלבל ו-cause באגים.

* Constructor הוא המקום היחיד שבו אתה יכול להקצות את [`this.state`](#state) ישירות. בכל שאר השיטות, אתה צריך use [`this.setState()`](#setstate) במקום זאת. אל תקרא ל-`setState` בקונסטרוקטור.

* כאשר אתה use [עיבוד שרת,](/reference/react-dom/server) הבנאי יפעל גם על השרת, ואחריו השיטה [`render`](#render). עם זאת, שיטות מחזור חיים כמו `componentDidMount` או `componentWillUnmount` לא יפעלו בשרת.

* כאשר [מצב קפדני](/reference/react/StrictMode) מופעל, React יתקשר ל-`constructor` פעמיים בפיתוח ולאחר מכן יזרוק את אחד מהמופעים. זה עוזר לך להבחין בתופעות הלוואי המקריות שיש להעביר מה-`constructor`.

<Note>

אין מקבילה מדויקת עבור `constructor` ברכיבי פונקציה. כדי להכריז על state ברכיב פונקציה, התקשר ל-[`useState`.](/reference/react/useState) כדי להימנע מחישוב מחדש של ה-state הראשוני, [העבירו פונקציה ל-`useState`.](/reference/react/useState#avoiding-initial-7____)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

אם תגדיר `componentDidCatch`, React יקרא לזה כאשר רכיב צאצא כלשהו (כולל ילדים רחוקים) זורק שגיאה במהלך העיבוד. זה מאפשר לך לרשום את השגיאה לשירות דיווח שגיאות בייצור.

בדרך כלל, זה used יחד עם [`static getDerivedStateFromError`](#static-getderivedstatefromerror) המאפשר לך לעדכן את state בתגובה לשגיאה ולהציג הודעת שגיאה ל-user. רכיב עם שיטות אלה נקרא *גבול שגיאה.*

[ראה דוגמה.](#catching-rendering-errors-with-an-error-boundary)

#### פרמטרים {/*componentdidcatch-parameters*/}

* `error`: השגיאה שנזרקה. בפועל, זה בדרך כלל יהיה מופע של [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) אבל זה לא מובטח כיuse JavaScript מאפשר [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) כל ערך, כולל מחרוזות או אפילו `null`.

* `info`: אובייקט המכיל מידע נוסף על השגיאה. השדה `componentStack` שלו מכיל עקבות מחסנית עם הרכיב שזרק, כמו גם את השמות ומיקומי המקור של כל רכיבי האב שלו. בייצור, שמות הרכיבים יוקטנו. אם תגדיר דיווח על שגיאות ייצור, תוכל לפענח את ערימת הרכיבים באמצעות מפות מקור באותו אופן כפי שהיית עושה עבור ערימות שגיאות JavaScript רגילות.

#### מחזירה {/*componentdidcatch-returns*/}

`componentDidCatch` לא אמור להחזיר כלום.

#### אזהרות {/*componentdidcatch-caveats*/}

* בעבר, היה מקובל לקרוא ל-`setState` בתוך `componentDidCatch` על מנת לעדכן את ממשק המשתמש ולהציג את הודעת השגיאה החלפה. זה הוצא משימוש לטובת הגדרת [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* ייצור ופיתוח של React שונים מעט באופן שבו `componentDidCatch` מטפל בשגיאות. בפיתוח, השגיאות יבעבעו עד `window`, מה שאומר שכל `window.onerror` או `window.addEventListener('error', callback)` יירטו את השגיאות שנתפסו על ידי `componentDidCatch`. בייצור, במקום זאת, השגיאות לא יבעבעו, מה שאומר שכל מטפל בשגיאות קדמון יקבל רק שגיאות שלא נתפסו במפורש על ידי `componentDidCatch`.

<Note>

עדיין אין מקבילה ישירה עבור `componentDidCatch` ברכיבי פונקציה. אם תרצה להימנע מיצירת רכיבי מחלקה, כתוב רכיב `ErrorBoundary` יחיד כמו למעלה וuse אותו בכל האפליקציה שלך. לחלופין, אתה יכול use את החבילה [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) שעושה את זה בשבילך.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

אם תגדיר את שיטת `componentDidMount`, React יקרא לה כאשר הרכיב שלך יתווסף *(רכוב)* למסך. זהו מקום נפוץ להתחיל איסוף נתונים, הגדרת מנויים או מניפולציה של צמתים DOM.

אם אתה מיישם `componentDidMount`, אתה בדרך כלל צריך ליישם שיטות מחזור חיים אחרות כדי למנוע באגים. לדוגמה, אם `componentDidMount` קורא כמה state או props, אתה גם צריך ליישם את [`componentDidUpdate`](#componentdidupdate) כדי לטפל בשינויים שלהם, ו-[`componentWillUnmount`](#componentwillunmount) כדי לנקות את כל מה ש`componentDidMount` עשה.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[ראה דוגמאות נוספות.](#adding-lifecycle-methods-to-a-class-component)

#### פרמטרים {/*componentdidmount-parameters*/}

`componentDidMount` אינו לוקח פרמטרים כלשהם.

#### מחזירה {/*componentdidmount-returns*/}

`componentDidMount` לא אמור להחזיר כלום.

#### אזהרות {/*componentdidmount-caveats*/}

- כאשר [מצב קפדני](/reference/react/StrictMode) פועל, בפיתוח React יתקשר ל-`componentDidMount`, ואז יתקשר מיד ל-[`componentWillUnmount`,](#componentwillunmount) ואז יתקשר שוב ל-`componentDidMount`. זה עוזר לך לשים לב אם שכחת ליישם את `componentWillUnmount` או שהלוגיקה שלו לא "משקפת" את מה ש`componentDidMount` עושה.

- למרות שאתה יכול להתקשר ל-[`setState`](#setstate) מיד ב-`componentDidMount`, עדיף להימנע מכך כשאפשר. זה יפעיל עיבוד נוסף, אבל זה יקרה לפני שהדפדפן יעדכן את המסך. זה מבטיח שלמרות שה-[`render`](#render) ייקרא פעמיים במקרה זה, ה-user לא יראה את state הביניים. השתמש בדפוס זה בזהירות מכיוון שuse לעתים קרובות יש בעיות בביצועים. ברוב המקרים, אתה אמור להיות מסוגל להקצות את ה-state הראשוני ב-[`constructor`](#קונסטרוקטור) במקום זאת. עם זאת, זה יכול להיות נחוץ עבור מקרים כמו מודלים ועצות כלים כאשר אתה צריך למדוד צומת DOM לפני עיבוד משהו שתלוי בגודל או במיקומו.

<Note>

עבור מקרים רבים של use, הגדרת `componentDidMount`, `componentDidUpdate` ו`componentWillUnmount` יחד ברכיבי מחלקה שווה ערך לקריאה ל-[`useEffect`](/reference/react/useEffect) ברכיבי פונקציה. במקרים נדירים שבהם חשוב שהקוד ירוץ לפני צבע הדפדפן, [`useLayoutEffect`](/reference/react/useLayoutEffect) הוא התאמה קרובה יותר.

[ראה כיצד להעביר.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

אם תגדיר את שיטת `componentDidUpdate`, React יקרא לה מיד לאחר שהרכיב שלך יעובד מחדש עם props או state מעודכן.  שיטה זו אינה נקראת עבור העיבוד הראשוני.

אתה יכול use אותו כדי לתפעל את ה-DOM לאחר עדכון. זהו גם מקום נפוץ לבצע בקשות רשת כל עוד אתה משווה את ה-props הנוכחי ל-props הקודם (למשל, בקשת רשת לא תהיה נחוצה אם ה-props לא השתנה). בדרך כלל, use זה יחד עם [`componentDidMount`](#componentdidmount) ו-[`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[ראה דוגמאות נוספות.](#adding-lifecycle-methods-to-a-class-component)


#### פרמטרים {/*componentdidupdate-parameters*/}

* `prevProps`: אביזרים לפני העדכון. השווה את `prevProps` ל-[`this.props`](#props) כדי לקבוע מה השתנה.

* `prevState`: מצב לפני העדכון. השווה את `prevState` ל-[`this.state`](#state) כדי לקבוע מה השתנה.

* `snapshot`: אם יישמת את [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` יכיל את הערך שהחזרת משיטה זו. אחרת, זה יהיה `undefined`.

#### מחזירה {/*componentdidupdate-returns*/}

`componentDidUpdate` לא אמור להחזיר כלום.

#### אזהרות {/*componentdidupdate-caveats*/}

- `componentDidUpdate` לא ייקרא אם הוגדר [`shouldComponentUpdate`](#shouldcomponentupdate) ויחזיר את `false`.

- ההיגיון בתוך `componentDidUpdate` בדרך כלל צריך להיות עטוף בתנאים המשווים `this.props` עם `prevProps`, ו`this.state` עם `prevState`. אחרת, יש סיכון ליצירת לולאות אינסופיות.

- למרות שאתה יכול להתקשר ל-[`setState`](#setstate) מיד ב-`componentDidUpdate`, עדיף להימנע מכך כשאפשר. זה יפעיל עיבוד נוסף, אבל זה יקרה לפני שהדפדפן יעדכן את המסך. זה מבטיח שלמרות שה-[`render`](#render) ייקרא פעמיים במקרה זה, ה-user לא יראה את state הביניים. דפוס זה גורם לרוב לבעיות ביצועים של __TK_7, אך ייתכן שיהיה צורך במקרים נדירים כמו מודלים וטיפים של כלים כאשר אתה צריך למדוד צומת DOM לפני עיבוד משהו שתלוי בגודלו או במיקומו.

<Note>

עבור מקרים רבים של use, הגדרת `componentDidMount`, `componentDidUpdate` ו`componentWillUnmount` יחד ברכיבי מחלקה שווה ערך לקריאה ל-[`useEffect`](/reference/react/useEffect) ברכיבי פונקציה. במקרים נדירים שבהם חשוב שהקוד ירוץ לפני צבע הדפדפן, [`useLayoutEffect`](/reference/react/useLayoutEffect) הוא התאמה קרובה יותר.

[ראה כיצד להעביר.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

שם ה-API הזה שונה מ-`componentWillMount` ל-[`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) השם הישן הוצא משימוש. בגרסה עיקרית עתידית של React, רק השם החדש יעבוד.

הפעל את [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) כדי לעדכן אוטומטית את הרכיבים שלך.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

השם ה-API הזה שונה מ-`componentWillReceiveProps` ל-[`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) השם הישן הוצא משימוש. בגרסה עיקרית עתידית של React, רק השם החדש יעבוד.

הפעל את [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) כדי לעדכן אוטומטית את הרכיבים שלך.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

שם ה-API הזה שונה מ-`componentWillUpdate` ל-[`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) השם הישן הוצא משימוש. בגרסה עיקרית עתידית של React, רק השם החדש יעבוד.

הפעל את [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) כדי לעדכן אוטומטית את הרכיבים שלך.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

אם תגדיר את שיטת `componentWillUnmount`, React יקרא לה לפני שהרכיב שלך יוסר *(לא מותקן)* מהמסך. זהו מקום נפוץ לביטול אחזור נתונים או הסרת מינויים.

ההיגיון בתוך `componentWillUnmount` צריך "לשקף" את ההיגיון בתוך [`componentDidMount`.](#componentdidmount) לדוגמה, אם `componentDidMount` מגדיר מנוי, `componentWillUnmount` צריך לנקות את המנוי הזה. אם לוגיקת הניקוי ב-`componentWillUnmount` שלך קוראת כמה props או state, בדרך כלל תצטרך ליישם גם [`componentDidUpdate`](#componentdidupdate) כדי לנקות משאבים (כגון מנויים) התואמים ל-props ול-state הישנים.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[ראה דוגמאות נוספות.](#adding-lifecycle-methods-to-a-class-component)

#### פרמטרים {/*componentwillunmount-parameters*/}

`componentWillUnmount` אינו לוקח פרמטרים כלשהם.

#### מחזירה {/*componentwillunmount-returns*/}

`componentWillUnmount` לא אמור להחזיר כלום.

#### אזהרות {/*componentwillunmount-caveats*/}

- כאשר [מצב קפדני](/reference/react/StrictMode) פועל, בפיתוח React יתקשר ל-[`componentDidMount`,](#componentdidmount) ואז יתקשר מיד ל-`componentWillUnmount`, ואז יתקשר שוב ל-`componentDidMount`. זה עוזר לך לשים לב אם שכחת ליישם את `componentWillUnmount` או שהלוגיקה שלו לא "משקפת" את מה ש`componentDidMount` עושה.

<Note>

עבור מקרים רבים של use, הגדרת `componentDidMount`, `componentDidUpdate` ו`componentWillUnmount` יחד ברכיבי מחלקה שווה ערך לקריאה ל-[`useEffect`](/reference/react/useEffect) ברכיבי פונקציה. במקרים נדירים שבהם חשוב שהקוד ירוץ לפני צבע הדפדפן, [`useLayoutEffect`](/reference/react/useLayoutEffect) הוא התאמה קרובה יותר.

[ראה כיצד להעביר.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

מאלץ רכיב לעיבוד מחדש.

בדרך כלל, זה לא הכרחי. אם השיטה [`render`](#render) של הרכיב שלך קוראת רק מ-[`this.props`](#props), [`this.state`](#state), או [`this.context`,](#context) היא תוצג מחדש באופן אוטומטי כאשר תקרא ל-[`setState`](#props](#__)__K של אחד מההורים שלך. עם זאת, אם שיטת `render` של הרכיב שלך קוראת ישירות ממקור נתונים חיצוני, עליך להורות לReact לעדכן את ממשק user כאשר מקור נתונים זה משתנה. זה מה ש`forceUpdate` מאפשר לך לעשות.

נסו להימנע מכל uses של `forceUpdate` וקראו רק מ`this.props` ו`this.state` ב`render`.

#### פרמטרים {/*forceupdate-parameters*/}

* **אופציונלי** `callback` אם צוין, React יתקשר ל-`callback` שסיפקת לאחר ביצוע העדכון.

#### מחזירה {/*forceupdate-returns*/}

`forceUpdate` לא מחזיר כלום.

#### אזהרות {/*forceupdate-caveats*/}

- אם תתקשר ל-`forceUpdate`, React יעבד מחדש מבלי לקרוא ל-[`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

קריאת מקור נתונים חיצוני ואילץ רכיבי מחלקה לעיבוד מחדש בתגובה לשינויים שלו עם `forceUpdate` הוחלפה על ידי [`useSyncExternalStore`](/reference/react/useSyncExternalStore) ברכיבי פונקציה.

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

API זה יוסר בגרסה עיקרית עתידית של React. [השתמש במקום זאת ב-`Context.Provider`.](/reference/react/createContext#provider)

</Deprecated>

מאפשר לך לציין את הערכים עבור [הקשר מדור קודם](https://reactjs.org/docs/legacy-context.html) מסופק על ידי רכיב זה.

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

אם תטמיע את `getSnapshotBeforeUpdate`, React יתקשר אליו מיד לפני ש-React יעדכן את ה-DOM. זה מאפשר לרכיב שלך ללכוד מידע מה-DOM (למשל מיקום הגלילה) לפני שהוא משתנה באופן פוטנציאלי. כל ערך שיוחזר על ידי שיטת מחזור חיים זו יועבר כפרמטר אל [`componentDidUpdate`.](#componentdidupdate)

לדוגמה, אתה יכול use אותו בממשק משתמש כמו שרשור צ'אט שצריך לשמור על מיקום הגלילה שלו במהלך עדכונים:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

בדוגמה לעיל, חשוב לקרוא את המאפיין `scrollHeight` ישירות ב-`getSnapshotBeforeUpdate`. זה לא בטוח לקרוא אותו ב-[`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), או [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) כי use קיים פער זמן פוטנציאלי בין התקשרות לשיטות אלו לבין עדכון KReact.

#### פרמטרים {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: אביזרים לפני העדכון. השווה את `prevProps` ל-[`this.props`](#props) כדי לקבוע מה השתנה.

* `prevState`: מצב לפני העדכון. השווה את `prevState` ל-[`this.state`](#state) כדי לקבוע מה השתנה.

#### מחזירה {/*getsnapshotbeforeupdate-returns*/}

עליך להחזיר ערך תמונת מצב מכל סוג שתרצה, או `null`. הערך שהחזרת יועבר כארגומנט השלישי אל [`componentDidUpdate`.](#componentdidupdate)

#### אזהרות {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` לא ייקרא אם הוגדר [`shouldComponentUpdate`](#shouldcomponentupdate) ויחזיר את `false`.

<Note>

כרגע, אין מקבילה ל-`getSnapshotBeforeUpdate` עבור רכיבי פונקציה. מקרה use זה נדיר מאוד, אבל אם יש לך צורך בו, לעת עתה תצטרך לכתוב רכיב מחלקה.

</Note>

---

### `render()` {/*render*/}

שיטת `render` היא השיטה הנדרשת היחידה ברכיב מחלקה.

השיטה `render` צריכה לציין מה ברצונך שיופיע על המסך, לדוגמה:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React עשוי להתקשר ל-`render` בכל רגע, אז אל תניח שהוא פועל בזמן מסוים. בדרך כלל, השיטה `render` צריכה להחזיר חתיכה של [JSX](/learn/writing-markup-with-jsx), אבל כמה [סוגי החזרות אחרים](#render-returns) (כמו מחרוזות) נתמכים. כדי לחשב את ה-JSX המוחזר, שיטת `render` יכולה לקרוא [`this.props`](#props), [`this.state`](#state) ו-[`this.context`](#context).

עליך לכתוב את שיטת `render` כפונקציה טהורה, כלומר היא צריכה להחזיר את אותה תוצאה אם ​​props, state והקשר זהים. זה גם לא אמור להכיל תופעות לוואי (כמו הגדרת מנויים) או לקיים אינטראקציה עם APIs של הדפדפן. תופעות לוואי צריכות להתרחש במטפלי אירועים או בשיטות כמו [`componentDidMount`.](#componentdidmount)

#### פרמטרים {/*render-parameters*/}

`render` אינו לוקח פרמטרים כלשהם.

#### מחזירה {/*render-returns*/}

`render` יכול להחזיר כל צומת React חוקי. זה כולל אלמנטים React כגון `<div />`, מחרוזות, מספרים, [פורטלים](/reference/react-dom/createPortal), צמתים ריקים (`null`, `undefined`, `true` ו-`false`), ומערכים של React nodes.

#### אזהרות {/*render-caveats*/}

- יש לכתוב את `render` כפונקציה טהורה של props, state והקשר. לא אמורות להיות לזה תופעות לוואי.

- `render` לא ייקרא אם הוגדר [`shouldComponentUpdate`](#shouldcomponentupdate) ויחזיר את `false`.

- כאשר [מצב קפדני](/reference/react/StrictMode) פועל, React יתקשר ל-`render` פעמיים בפיתוח ולאחר מכן יזרוק אחת מהתוצאות. זה עוזר לך להבחין בתופעות הלוואי המקריות שיש להזיז משיטת `render`.

- אין התכתבות של אחד על אחד בין שיחת `render` לשיחת `componentDidMount` או `componentDidUpdate` שלאחר מכן. חלק מתוצאות השיחה `render` עשויות להימחק על ידי React כאשר זה מועיל.

---

### `setState(nextState, callback?)` {/*setstate*/}

התקשר ל-`setState` כדי לעדכן את ה-state של רכיב ה-React שלך.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` מציב שינויים בתורים ברכיב state. זה אומר לReact שהרכיב הזה והילדים שלו צריכים לעבד מחדש עם ה-state החדש. זו הדרך העיקרית שבה תעדכן את ממשק user בתגובה לאינטראקציות.

<Pitfall>

קריאה ל-`setState` **לא** משנה את ה-state הנוכחי בקוד שכבר מבצע:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

זה משפיע רק על מה ש`this.state` יחזיר החל מהעיבוד *הבא*.

</Pitfall>

אתה יכול גם להעביר פונקציה ל-`setState`. זה מאפשר לך לעדכן את state על סמך ה-state הקודם:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

אתה לא חייב לעשות זאת, אבל זה שימושי אם אתה רוצה לעדכן את state מספר פעמים במהלך אותו אירוע.

#### פרמטרים {/*setstate-parameters*/}

* `nextState`: או אובייקט או פונקציה.
  * אם תעביר אובייקט בתור `nextState`, הוא יתמזג בצורה רדודה לתוך `this.state`.
  * אם תעביר פונקציה בתור `nextState`, היא תטופל כאל _פונקציית עדכון_. זה חייב להיות טהור, צריך לקחת את state וprops הממתינים כארגומנטים, ועליו להחזיר את האובייקט למיזוג רדוד לתוך `this.state`. React ישים את פונקציית העדכון שלך בתור ותעבד מחדש את הרכיב שלך. במהלך העיבוד הבא, React יחשב את ה-state הבא על ידי החלת כל העדכונים בתור על ה-state הקודם.

* **אופציונלי** `callback`: אם צוין, React יתקשר ל-`callback` שסיפקת לאחר ביצוע העדכון.

#### מחזירה {/*setstate-returns*/}

`setState` לא מחזיר כלום.

#### אזהרות {/*setstate-caveats*/}

- חשבו על `setState` כעל *בקשה* ולא על פקודה מיידית לעדכון הרכיב. כאשר רכיבים מרובים מעדכנים את state שלהם בתגובה לאירוע, React יבצע אצווה של העדכונים שלהם ויעבד אותם מחדש יחד במעבר אחד בסוף האירוע. במקרה הנדיר שאתה צריך לאלץ עדכון state מסוים להיות מיושם באופן סינכרוני, אתה יכול לעטוף אותו ב-[`flushSync`,](/reference/react-dom/flushSync) אבל זה עלול לפגוע בביצועים.

- `setState` does not update `this.state` immediately. זה הופך את הקריאה של `this.state` מיד לאחר הקריאה ל-`setState` למלכודת פוטנציאלית. במקום זאת, use [`componentDidUpdate`](#componentdidupdate) או הארגומנט setState `callback`, שכל אחד מהם מובטח יופעל לאחר החלת העדכון. אם אתה צריך להגדיר את state בהתבסס על ה-state הקודם, תוכל להעביר פונקציה ל-`nextState` כמתואר לעיל.

<Note>

קריאה ל-`setState` ברכיבי מחלקה דומה לקריאה לפונקציה [`set`](/reference/react/useState#setstate) ברכיבי פונקציה.

[ראה כיצד להעביר.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

אם תגדיר `shouldComponentUpdate`, React יקרא לזה כדי לקבוע אם ניתן לדלג על עיבוד מחדש.

אם אתה בטוח שאתה רוצה לכתוב את זה ביד, אתה יכול להשוות את `this.props` עם `nextProps` ו`this.state` עם `nextState` ולהחזיר את `false` כדי לומר לReact שניתן לדלג על העדכון.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

React קורא ל-`shouldComponentUpdate` לפני העיבוד כאשר props או state חדשים מתקבלים. ברירת המחדל היא `true`. שיטה זו אינה נקראת עבור העיבוד הראשוני או כאשר [`forceUpdate`](#forceupdate) הוא used.

#### פרמטרים {/*shouldcomponentupdate-parameters*/}

- `nextProps`: ה-props הבא שאיתו הרכיב עומד לרנדר. השווה את `nextProps` ל-[`this.props`](#props) כדי לקבוע מה השתנה.
- `nextState`: ה-state הבא שאיתו הרכיב עומד לרנדר. השווה את `nextState` ל-[`this.state`](#props) כדי לקבוע מה השתנה.
- `nextContext`: ההקשר הבא שאיתו הרכיב עומד לרנדר. השווה את `nextContext` ל-[`this.context`](#context) כדי לקבוע מה השתנה. זמין רק אם אתה מציין [`static contextType`](#static-contexttype) (מודרני) או [`static contextTypes`](#static-contexttypes) (מדור קודם).

#### מחזירה {/*shouldcomponentupdate-returns*/}

החזר `true` אם אתה רוצה שהרכיב יעבד מחדש. זו התנהגות ברירת המחדל.

החזר `false` כדי לומר לReact שניתן לדלג על עיבוד מחדש.

#### אזהרות {/*shouldcomponentupdate-caveats*/}

- שיטה זו קיימת *רק* כאופטימיזציה של ביצועים. אם הרכיב שלך נשבר בלעדיו, תקן את זה קודם.

- שקול להשתמש ב-[`PureComponent`](/reference/react/PureComponent) במקום לכתוב `shouldComponentUpdate` ביד. `PureComponent` משווה באופן רדוד בין props ל-state, ומקטינה את הסיכוי שתדלג על עדכון הכרחי.

- איננו ממליצים לבצע בדיקות שוויון עמוקות או להשתמש ב-`JSON.stringify` ב-`shouldComponentUpdate`. זה הופך את הביצועים לבלתי צפויים ותלויים במבנה הנתונים של כל אביזר ו-state. במקרה הטוב, אתה מסתכן בהחדרת דוכנים של מספר שניות לאפליקציה שלך, ובמקרה הגרוע אתה מסתכן בקריסתה.

- החזרת `false` אינה מונעת רכיבי צאצא לבצע רינדור מחדש כאשר state *שלהם* משתנה.

- החזרת `false` אינה *מבטיחה* שהרכיב לא יעבד מחדש. React יעשה use את ערך ההחזרה כרמז, אבל הוא עדיין עשוי לבחור לעבד מחדש את הרכיב שלך אם יש טעם לעשות זאת מסיבות אחרות.

<Note>

אופטימיזציה של רכיבי כיתה עם `shouldComponentUpdate` דומה לאופטימיזציה של רכיבי פונקציה עם [`memo`.](/reference/react/memo) רכיבי פונקציה מציעים גם אופטימיזציה פרטנית יותר עם [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

אם תגדיר `UNSAFE_componentWillMount`, React יקרא לו מיד אחרי ה-[`constructor`.](#קונסטרוקטור) זה קיים רק מסיבות היסטוריות ולא צריך להיות used בשום קוד חדש. במקום זאת, use אחת מהחלופות:

- כדי לאתחל את state, הכריז על [`state`](#state) כשדות מחלקה או הגדר `this.state` בתוך [`constructor`.](#קונסטרוקטור)
- אם אתה צריך להפעיל תופעת לוואי או להגדיר מנוי, העבר את ההיגיון הזה ל-[`componentDidMount`](#componentdidmount) במקום זאת.

[ראה דוגמאות להגירה הרחק ממחזורי חיים לא בטוחים.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### פרמטרים {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` אינו לוקח פרמטרים כלשהם.

#### מחזירה {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` לא אמור להחזיר כלום.

#### אזהרות {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` לא ייקרא אם הרכיב מיישם [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) או [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- למרות השם שלו, `UNSAFE_componentWillMount` לא מבטיח שהרכיב *יותקן* אם האפליקציה שלך תכלול את התכונות המודרניות React של האפליקציה שלך כמו [`Suspense`.](/reference/react/Suspense) אם ניסיון עיבוד מושעה (לדוגמה, בגלל שהקוד לא טען עדיין use עבור חלק מהילד) React יזרוק את העץ שנמצא בתהליך וינסה לבנות את הרכיב מאפס במהלך הניסיון הבא. זו הסיבה שהשיטה הזו "לא בטוחה". קוד שמסתמך על הרכבה (כמו הוספת מנוי) צריך להיכנס אל [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` היא שיטת מחזור החיים היחידה שפועלת במהלך [עיבוד שרת.](/reference/react-dom/server) לכל המטרות המעשיות, היא זהה ל-[`constructor`,](#constructor) אז כדאי use את `constructor` עבור סוג זה של לוגיקה במקום זאת.

<Note>

קריאה ל-[`setState`](#setstate) בתוך `UNSAFE_componentWillMount` ברכיב מחלקה לאתחול state שווה ערך להעברת state זה בתור state ההתחלתי ל-[`useState`](/reference/react/useState) ברכיב פונקציה

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

אם תגדיר `UNSAFE_componentWillReceiveProps`, React יקרא לו כאשר הרכיב יקבל props חדש. זה קיים רק מסיבות היסטוריות ולא אמור להיות used בשום קוד חדש. במקום זאת, use אחת מהחלופות:

- אם אתה צריך **להפעיל תופעת לוואי** (לדוגמה, להביא נתונים, להפעיל אנימציה או לאתחל מחדש מנוי) בתגובה לשינויים באביזרי, העבר את ההיגיון הזה ל-[`componentDidUpdate`](#componentdidupdate) במקום זאת.
- אם אתה צריך **להימנע מחישוב מחדש של חלק מהנתונים רק כאשר אבזר משתנה,** use [memoמסייע לאיזון](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) במקום זאת.
- אם אתה צריך **"לאפס" כמה state כאשר אבזר משתנה,** שקול ליצור רכיב [בשליטה מלאה](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) או [לא מבוקר לחלוטין עם מפתח](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) במקום זאת.
- אם אתה צריך **"להתאים" כמה state כאשר אבזר משתנה,** בדוק אם אתה יכול לחשב את כל המידע הדרוש מ-props לבד במהלך העיבוד. אם אינך יכול, use [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) במקום זאת.

[ראה דוגמאות להגירה הרחק ממחזורי חיים לא בטוחים.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### פרמטרים {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: ה-props הבא שהרכיב עומד לקבל מהרכיב האב שלו. השווה את `nextProps` ל-[`this.props`](#props) כדי לקבוע מה השתנה.
- `nextContext`: ההקשר הבא שהרכיב עומד לקבל מהספק הקרוב ביותר. השווה את `nextContext` ל-[`this.context`](#context) כדי לקבוע מה השתנה. זמין רק אם אתה מציין [`static contextType`](#static-contexttype) (מודרני) או [`static contextTypes`](#static-contexttypes) (מדור קודם).

#### מחזירה {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` לא אמור להחזיר כלום.

#### אזהרות {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` לא ייקרא אם הרכיב מיישם [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) או [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- למרות השם שלו, `UNSAFE_componentWillReceiveProps` אינו מבטיח שהרכיב *יקבל* את ה-props האלה אם האפליקציה שלך use של התכונות המודרניות של React כמו [`Suspense`.](/reference/react/Suspense) אם ניסיון רינדור הושעה (לדוגמה, רכיב __9 של האפליקציה עדיין לא הושעה, למשל, רכיב K __T לא הושעה), React יזרוק את העץ שנמצא בתהליך וינסה לבנות את הרכיב מאפס במהלך הניסיון הבא. עד לניסיון העיבוד הבא, ה-props עשוי להיות שונה. זו הסיבה שהשיטה הזו "לא בטוחה". קוד שאמור לפעול רק עבור עדכונים מחויבים (כמו איפוס מנוי) צריך להיכנס אל [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` לא אומר שהרכיב קיבל props *שונה* מהפעם הקודמת. אתה צריך להשוות את `nextProps` ו`this.props` בעצמך כדי לבדוק אם משהו השתנה.

- React לא קורא `UNSAFE_componentWillReceiveProps` עם props ראשוני במהלך ההרכבה. זה קורא לשיטה זו רק אם חלק מה-props של הרכיב עומדים להתעדכן. לדוגמה, קריאה ל-[`setState`](#setstate) לא מפעילה בדרך כלל את `UNSAFE_componentWillReceiveProps` בתוך אותו רכיב.

<Note>

קריאה ל-[`setState`](#setstate) בתוך `UNSAFE_componentWillReceiveProps` ברכיב מחלקה כדי "להתאים" state שווה ערך ל[קריאה לפונקציה `set` מ`useState` במהלך העיבוד](/reference/react/useState#rendering-information inv-component previous-component)

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


אם תגדיר `UNSAFE_componentWillUpdate`, React יקרא לזה לפני עיבוד עם props או state החדשים. זה קיים רק מסיבות היסטוריות ולא אמור להיות used בשום קוד חדש. במקום זאת, use אחת מהחלופות:

- אם אתה צריך להפעיל תופעת לוואי (לדוגמה, להביא נתונים, להפעיל אנימציה או לאתחל מחדש מנוי) בתגובה לשינויים ב-prop או state, העבר את ההיגיון הזה ל-[`componentDidUpdate`](#componentdidupdate) במקום זאת.
- אם אתה צריך לקרוא מידע מה-DOM (לדוגמה, כדי לשמור את מיקום הגלילה הנוכחי) כדי שתוכל use אותו ב-[`componentDidUpdate`](#componentdidupdate) מאוחר יותר, קרא אותו בתוך [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) במקום זאת.

[ראה דוגמאות להגירה הרחק ממחזורי חיים לא בטוחים.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### פרמטרים {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: ה-props הבא שהרכיב עומד לעבד איתו. השווה את `nextProps` ל-[`this.props`](#props) כדי לקבוע מה השתנה.
- `nextState`: ה-state הבא שהרכיב עומד לעבד איתו. השווה את `nextState` ל-[`this.state`](#state) כדי לקבוע מה השתנה.

#### מחזירה {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` לא אמור להחזיר כלום.

#### אזהרות {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` לא ייקרא אם הוגדר [`shouldComponentUpdate`](#shouldcomponentupdate) ויחזיר את `false`.

- `UNSAFE_componentWillUpdate` לא ייקרא אם הרכיב מיישם [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) או [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- אין תמיכה להתקשר ל-[`setState`](#setstate) (או כל שיטה שמובילה לקריאה של `setState`, כמו שליחת פעולת Redux) במהלך `componentWillUpdate`.

- למרות השם שלו, `UNSAFE_componentWillUpdate` אינו מבטיח שהרכיב *יתעדכן* אם האפליקציה שלך use תכונות מודרניות של React כמו [`Suspense`.](/reference/react/Suspense) אם ניסיון רינדור מושעה (לדוגמה, בגלל use של האפליקציה שלך use הרכיב הילד __5 עדיין לא יטען __T רכיב __5__) הרחק את העץ בתהליך ונסה לבנות את הרכיב מאפס במהלך הניסיון הבא. עד לניסיון העיבוד הבא, props וstate עשויים להיות שונים. זו הסיבה שהשיטה הזו "לא בטוחה". קוד שאמור לפעול רק עבור עדכונים מחויבים (כמו איפוס מנוי) צריך להיכנס אל [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` לא אומר שהרכיב קיבל props או state *שונה* מהפעם הקודמת. אתה צריך להשוות את `nextProps` עם `this.props` ו`nextState` עם `this.state` בעצמך כדי לבדוק אם משהו השתנה.

- React לא קורא `UNSAFE_componentWillUpdate` עם props וstate ראשוני במהלך ההרכבה.

<Note>

אין מקבילה ישירה ל-`UNSAFE_componentWillUpdate` ברכיבי פונקציה.

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

API זה יוסר בגרסה עיקרית עתידית של React. [השתמש במקום זאת ב-`static contextType`.](#static-contexttype)

</Deprecated>

מאפשר לך לציין איזה [הקשר מדור קודם](https://reactjs.org/docs/legacy-context.html) מסופק על ידי רכיב זה.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

API זה יוסר בגרסה עיקרית עתידית של React. [השתמש במקום זאת ב-`static contextType`.](#static-contexttype)

</Deprecated>

מאפשר לך לציין איזה [הקשר מדור קודם](https://reactjs.org/docs/legacy-context.html) נצרך על ידי רכיב זה.

---

### `static contextType` {/*static-contexttype*/}

אם אתה רוצה לקרוא את [`this.context`](#context-instance-field) מרכיב הכיתה שלך, עליך לציין איזה הקשר הוא צריך לקרוא. ההקשר שאתה מציין בתור `static contextType` חייב להיות ערך שנוצר בעבר על ידי [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

קריאת `this.context` ברכיבי כיתה שווה ערך ל-[`useContext`](/reference/react/useContext) ברכיבי פונקציה.

[ראה כיצד להעביר.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

אתה יכול להגדיר `static defaultProps` כדי להגדיר את ברירת המחדל props עבור המחלקה. הם יהיו used עבור `undefined` וחסרים props, אך לא עבור `null` props.

לדוגמה, כך אתה מגדיר שהאבזר `color` צריך כברירת מחדל ל-`'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

אם הפריט `color` אינו מסופק או שהוא `undefined`, הוא יוגדר כברירת מחדל ל-`'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

הגדרת `defaultProps` ברכיבי מחלקה דומה לשימוש ב-[ערכי ברירת מחדל](/learn/passing-props-to-a-component#specificing-a-default-value-for-a-prop) ברכיבי פונקציה.

</Note>

---

### `static propTypes` {/*static-proptypes*/}

אתה יכול להגדיר `static propTypes` יחד עם ספריית [`prop-types`](https://www.npmjs.com/package/prop-types) כדי להצהיר על סוגי ה-props המקובלים על הרכיב שלך. סוגים אלו ייבדקו במהלך העיבוד ובפיתוח בלבד.

```js
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
```

<Note>

אנו ממליצים להשתמש ב-[TypeScript](https://www.typescriptlang.org/) במקום לבדוק סוגי אביזרים בזמן ריצה.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

אם תגדיר `static getDerivedStateFromError`, React יקרא לזה כאשר רכיב צאצא (כולל ילדים רחוקים) זורק שגיאה במהלך העיבוד. זה מאפשר לך להציג הודעת שגיאה במקום לנקות את ממשק המשתמש.

בדרך כלל, זה used יחד עם [`componentDidCatch`](#componentdidcatch) המאפשרים לשלוח את דוח השגיאה לשירות ניתוח כלשהו. רכיב עם שיטות אלה נקרא *גבול שגיאה.*

[ראה דוגמה.](#catching-rendering-errors-with-an-error-boundary)

#### פרמטרים {/*static-getderivedstatefromerror-parameters*/}

* `error`: השגיאה שנזרקה. בפועל, זה בדרך כלל יהיה מופע של [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) אבל זה לא מובטח כיuse JavaScript מאפשר [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) כל ערך, כולל מחרוזות או אפילו `null`.

#### מחזירה {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` צריך להחזיר את ה-state ואומר לרכיב להציג את הודעת השגיאה.

#### אזהרות {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` צריכה להיות פונקציה טהורה. אם אתה רוצה לבצע תופעת לוואי (לדוגמה, להתקשר לשירות ניתוח), עליך ליישם גם [`componentDidCatch`.](#componentdidcatch)

<Note>

עדיין אין מקבילה ישירה עבור `static getDerivedStateFromError` ברכיבי פונקציה. אם תרצה להימנע מיצירת רכיבי מחלקה, כתוב רכיב `ErrorBoundary` יחיד כמו למעלה וuse אותו בכל האפליקציה שלך. לחלופין, use החבילה [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) שעושה את זה.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

אם תגדיר `static getDerivedStateFromProps`, React יקרא לזה ממש לפני הקריאה ל-[`render`,](#render) הן בהרכבה הראשונית והן בעדכונים הבאים. זה אמור להחזיר אובייקט כדי לעדכן את ה-state, או `null` כדי לעדכן כלום.

שיטה זו קיימת עבור [מקרים נדירים של use](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) כאשר ה-state תלוי בשינויים ב-props לאורך זמן. לדוגמה, רכיב `Form` זה מאפס את ה-`email` state כאשר מאפיין `userID` משתנה:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

שים לב שתבנית זו מחייבת אותך לשמור ערך קודם של הפרופס (כמו `userID`) ב-state (כמו `prevUserID`).

<Pitfall>

גזירת state מובילה לקוד מילולי ומקשה על המחשבה על הרכיבים שלך. [ודא שאתה מכיר חלופות פשוטות יותר:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- אם אתה צריך **לבצע תופעת לוואי** (לדוגמה, שליפת נתונים או אנימציה) בתגובה לשינוי בשיטת props, use [`componentDidUpdate`](#componentdidupdate) במקום זאת.
- אם אתה רוצה **לחשב מחדש נתונים מסוימים רק כאשר אבזר משתנה,** [use עוזר memoאיזון במקום זאת.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- אם אתה רוצה **"לאפס" כמה state כאשר אבזר משתנה,** שקול ליצור רכיב [בשליטה מלאה](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) או [לא נשלט לחלוטין עם מפתח](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) במקום זאת.

</Pitfall>

#### פרמטרים {/*static-getderivedstatefromprops-parameters*/}

- `props`: ה-props הבא שאיתו הרכיב עומד לרנדר.
- `state`: ה-state הבא שהרכיב עומד לעשות איתו.

#### מחזירה {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` להחזיר אובייקט כדי לעדכן את ה-state, או `null` כדי לעדכן כלום.

#### אזהרות {/*static-getderivedstatefromprops-caveats*/}

- שיטה זו מופעלת על *כל* רינדור, ללא קשר ל-cause. זה שונה מ-[`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), המופעל רק כאשר האב מבצע עיבוד מחדש ולא כתוצאה מ-`setState` מקומי.

- לשיטה זו אין גישה למופע הרכיב. אם תרצה, תוכל מחדשuse קוד כלשהו בין `static getDerivedStateFromProps` לשיטות המחלקה האחרות על ידי חילוץ פונקציות טהורות של הרכיב props וstate מחוץ להגדרת המחלקה.

<Note>

יישום `static getDerivedStateFromProps` ברכיב מחלקה שווה ערך ל[קריאה לפונקציה `set` מ-`useState` במהלך העיבוד](/reference/react/useState#storing-information-from-previous-renders) ברכיב פונקציה.

</Note>

---

## שימוש {/*usage*/}

### הגדרת רכיב מחלקה {/*defining-a-class-component*/}

כדי להגדיר רכיב React כמחלקה, הרחב את המחלקה המובנית `Component` והגדר שיטה [`render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React יקרא לשיטת [`render`](#render) שלך בכל פעם שהוא צריך להבין מה להציג על המסך. בדרך כלל, תחזיר כמה [JSX](/learn/writing-markup-with-jsx) ממנו. שיטת `render` שלך צריכה להיות [פונקציה טהורה:](https://en.wikipedia.org/wiki/Pure_function) היא צריכה לחשב רק את ה-JSX.

בדומה ל[רכיבי פונקציה,](/learn/your-first-component#definining-a-component) רכיב מחלקה יכול [לקבל מידע על ידי props](/learn/your-first-component#definining-a-component) מהרכיב האב שלו. עם זאת, התחביר לקריאת props שונה. לדוגמה, אם רכיב האב מעבד את `<Greeting name="Taylor" />`, אז אתה יכול לקרוא את האביזר `name` מ-[`this.props`](#props), כמו `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

שים לב ש-Hooks (פונקציות שמתחילות ב-`use`, כמו [`useState`](/reference/react/useState)) אינן נתמכות בתוך רכיבי מחלקה.

<Pitfall>

אנו ממליצים להגדיר רכיבים כפונקציות במקום מחלקות. [ראה כיצד להעביר.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### הוספת state לרכיב מחלקה {/*adding-state-to-a-class-component*/}

כדי להוסיף [state](/learn/state-a-components-memory) למחלקה, הקצה אובייקט למאפיין בשם [`state`](#state). כדי לעדכן את state, התקשר אל [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

אנו ממליצים להגדיר רכיבים כפונקציות במקום מחלקות. [ראה כיצד להעביר.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### הוספת שיטות מחזור חיים לרכיב מחלקה {/*adding-lifecycle-methods-to-a-class-component*/}

יש כמה שיטות מיוחדות שאתה יכול להגדיר בכיתה שלך.

אם תגדיר את שיטת [`componentDidMount`](#componentdidmount), React יקרא לה כאשר הרכיב שלך יתווסף *(רכוב)* למסך. React יקרא ל-[`componentDidUpdate`](#componentdidupdate) לאחר שהרכיב שלך יעבד מחדש עקב שינוי ב-props או state. React יקרא ל-[`componentWillUnmount`](#componentwillunmount) לאחר שהרכיב שלך הוסר *(לא מותקן)* מהמסך.

אם אתה מיישם `componentDidMount`, אתה בדרך כלל צריך ליישם את כל שלושת מחזורי החיים כדי למנוע באגים. לדוגמה, אם `componentDidMount` קורא כמה state או props, אתה גם צריך ליישם את `componentDidUpdate` כדי לטפל בשינויים שלהם, ואת `componentWillUnmount` כדי לנקות את כל מה ש`componentDidMount` עשה.

לדוגמה, רכיב `ChatRoom` זה שומר על חיבור צ'אט מסונכרן עם props וstate:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

שים לב שבפיתוח כאשר [מצב קפדני](/reference/react/StrictMode) פועל, React יתקשר ל-`componentDidMount`, יתקשר מיד ל-`componentWillUnmount`, ואז יתקשר שוב ל-`componentDidMount`. זה עוזר לך לשים לב אם שכחת ליישם את `componentWillUnmount` או שהלוגיקה שלו לא "משקפת" את מה ש`componentDidMount` עושה.

<Pitfall>

אנו ממליצים להגדיר רכיבים כפונקציות במקום מחלקות. [ראה כיצד להעביר.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### תופסת שגיאות רינדור עם גבול שגיאה {/*catching-rendering-errors-with-an-error-boundary*/}

כברירת מחדל, אם האפליקציה שלך זורקת שגיאה במהלך העיבוד, React יסיר את ממשק המשתמש שלו מהמסך. כדי למנוע זאת, אתה יכול לעטוף חלק ממשק המשתמש שלך לתוך *גבול שגיאה*. גבול שגיאה הוא רכיב מיוחד המאפשר לך להציג ממשק משתמש חלופי במקום החלק שקרס - לדוגמה, הודעת שגיאה.

כדי ליישם רכיב גבול שגיאה, עליך לספק [`static getDerivedStateFromError`](#static-getderivedstatefromerror) המאפשר לך לעדכן את state בתגובה לשגיאה ולהציג הודעת שגיאה ל-user. אתה יכול גם ליישם אופציונלי [`componentDidCatch`](#componentdidcatch) כדי להוסיף קצת היגיון נוסף, למשל, כדי להתחבר לשגיאה לשירות ניתוח.

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

לאחר מכן תוכל לעטוף בו חלק מעץ הרכיבים שלך:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

אם `Profile` או הרכיב הצאצא שלו יגרמו שגיאה, `ErrorBoundary` "יתפוס" את השגיאה הזו, יציג ממשק משתמש חלופי עם הודעת השגיאה שסיפקת, וישלח דוח שגיאות ייצור לשירות דיווח השגיאות שלך.

אתה לא צריך לעטוף כל רכיב לתוך גבול שגיאה נפרד. כאשר אתה חושב על [הפירוט של גבולות השגיאה,](https://www.brandondail.com/posts/fault-tolerance-react) שקול היכן הגיוני להציג הודעת שגיאה. לדוגמה, באפליקציית הודעות, הגיוני למקם גבול שגיאה סביב רשימת השיחות. זה גם הגיוני למקם אחת סביב כל הודעה בודדת. עם זאת, לא יהיה הגיוני להציב גבול סביב כל אווטאר.

<Note>

כרגע אין דרך לכתוב גבול שגיאה כרכיב פונקציה. עם זאת, אינך צריך לכתוב את מחלקת גבול השגיאה בעצמך. לדוגמה, אתה יכול use [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) במקום זאת.

</Note>

---

## חלופות {/*alternatives*/}

### העברת רכיב פשוט ממחלקה לפונקציה {/*migrating-a-simple-component-from-a-class-to-a-function*/}

בדרך כלל, אתה [תגדיר רכיבים כפונקציות](/learn/your-first-component#definining-a-component) במקום זאת.

לדוגמה, נניח שאתה ממיר את רכיב המחלקה `Greeting` הזה לפונקציה:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

הגדר פונקציה בשם `Greeting`. זה המקום שבו תעביר את גוף הפונקציה `render` שלך.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

במקום `this.props.name`, הגדר את הפרופס `name` [באמצעות תחביר ההרס](/learn/passing-props-to-a-component) וקרא אותו ישירות:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

הנה דוגמה מלאה:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### העברת רכיב עם state ממחלקה לפונקציה {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

נניח שאתה ממיר את רכיב המחלקה `Counter` הזה לפונקציה:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

התחל בהכרזה על פונקציה עם המשתנים הנחוצים [state:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

לאחר מכן, המר את מטפלי האירועים:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

לבסוף, החלף את כל ההפניות שמתחילות ב-`this` במשתנים ובפונקציות שהגדרת ברכיב שלך. לדוגמה, החלף את `this.state.age` ב-`age`, והחלף את `this.handleNameChange` ב-`handleNameChange`.

להלן רכיב שעבר המרה מלאה:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### העברת רכיב עם שיטות מחזור חיים ממחלקה לפונקציה {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

נניח שאתה ממיר את רכיב המחלקה `ChatRoom` עם שיטות מחזור חיים לפונקציה:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

ראשית, ודא שה-[`componentWillUnmount`](#componentwillunmount) שלך עושה את ההיפך מ-[`componentDidMount`.](#componentdidmount) בדוגמה שלמעלה, זה נכון: הוא מנתק את החיבור ש`componentDidMount` יוצר. אם היגיון כזה חסר, הוסף אותו תחילה.

לאחר מכן, ודא ששיטת ה-[`componentDidUpdate`](#componentdidupdate) שלך מטפלת בשינויים בכל props וstate שבה אתה משתמש ב-`componentDidMount`. בדוגמה שלמעלה, `componentDidMount` קורא ל-`setupConnection` שקורא `this.state.serverUrl` ו-`this.props.roomId`. זו הסיבה ש`componentDidUpdate` בודק אם `this.state.serverUrl` ו`this.props.roomId` השתנו, ומאפס את החיבור אם כן. אם ההיגיון `componentDidUpdate` שלך חסר או לא מטפל בשינויים בכל props וstate הרלוונטיים, תקן זאת תחילה.

בדוגמה שלמעלה, ההיגיון בתוך שיטות מחזור החיים מחבר את הרכיב למערכת מחוץ ל-React (שרת צ'אט). כדי לחבר רכיב למערכת חיצונית, [תאר את ההיגיון הזה כאפקט יחיד:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

הקריאה [`useEffect`](/reference/react/useEffect) זו מקבילה להיגיון בשיטות מחזור החיים שלמעלה. אם שיטות מחזור החיים שלך עושות מספר דברים לא קשורים, [חלק אותם למספר אפקטים עצמאיים.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) הנה דוגמה מלאה שתוכל לשחק איתה:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

אם הרכיב שלך לא מסתנכרן עם מערכות חיצוניות כלשהן, [ייתכן שלא תצטרך אפקט.](/learn/you-might-not-need-an-effect)

</Note>

---

### העברת רכיב עם הקשר ממחלקה לפונקציה {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

בדוגמה זו, רכיבי הכיתה `Panel` ו`Button` קוראים את [הקשר](/learn/העברת-data-deeply-with-context) מ-[`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

כאשר אתה ממיר אותם לרכיבי פונקציה, החלף את `this.context` בקריאות [`useContext`](/reference/react/useContext):

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
