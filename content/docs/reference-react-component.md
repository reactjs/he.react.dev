---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
>
> These new documentation pages teach modern React:
>
> - [`React.Component`](https://react.dev/reference/react/Component)

</div>

הדף הזה מכיל הפניית API מפורטת עבור ההגדרה של קומפוננטת מחלקה ב-React. הוא מניח שאתם מכירים קונספטים בסיסיים ב-React, כדוגמת [קומפוננטות ו-Props](/docs/components-and-props.html), בנוסף גם [State ומעגל-חיים](/docs/state-and-lifecycle.html). אם אתם לא, קראו אותם תחילה.

## סקירה-כללית {#overview}

React מאפשרת להגדיר קומפוננטות כמחלקות או כפונקציות. קומפוננטות המוגדרות כמחלקות כרגע מספקות יותר אפשרויות אשר מתוארות בפירוט בדף זה. כדי להגדיר קומפוננטת מחלקה ב-React, נדרש להרחיב ל-`React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

המתודה היחידה *שחייב* להגדיר בתת-מחלקה מסוג `React.Component` נקראת [`render()`](#render). כל שאר המתודות המתוארות בדף זה הן אופציונליות.

**אנחנו ממליצים בחום נגד יצירת קומפוננטות-בסיס משלכם.** בקומפוננטות React, [שימוש חוזר בקוד מושג בעיקר על-ידי קומפוזיציה מאשר על-ידי הורשה](/docs/composition-vs-inheritance.html).

>הערה:
>
>React לא כופה על שימוש בתחביר מחלקות של גרסת ES6. אם אתם מעדיפים להימנע ממנו, אתם רשאיים להשתמש במודול `create-react-class` או הרחבה מותאמת דומה, במקום. העיפו מבט ב-[שימוש ב-React ללא גרסת ES6](/docs/react-without-es6.html) כדי ללמוד עוד.

### קומפוננטת מעגל-החיים {#the-component-lifecycle}

לכל קומפוננטה קיימות מספר "מתודות של מעגל חיים" שניתן לדרוס כדי להריץ קוד בזמנים מסוימים בתהליך. **אתם יכולים להשתמש [בדיאגרמת מעגל-החיים הזו](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) כשליף.** ברשימה מטה, מתודות מעגל-חיים שבשימוש נפוץ יותר, מסומנות **במודגש**. שאר המתודות קיימות עבור שימושים נדירים יותר.

#### עיגון (Mounting) {#mounting}

קריאה למתודות הבאות מתבצעות בסדר הזה כאשר מופע של קומפוננטה נוצר ומוכנס לתוך ה-DOM:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>הערה:
>
>המתודות האלו נחשבות לישנות וכדאי [להימנע מהן](/blog/2018/03/27/update-on-async-rendering.html) בקוד חדש:
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### עדכון {#updating}

עדכון יכול להיגרם על ידי שינוי props או state. המתודות האלו נקראות בסדר להלן כאשר קומפוננטה מרונדרת מחדש:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)


>הערה:
>
>המתודות להלן נחשבות ישנות ועדיף [להמנע משימוש בהן](/blog/2018/03/27/update-on-async-rendering.html) בקוד חדש:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### הסרה (Unmounting) {#unmounting}

קריאה למתודה הזו מתבצעת כאשר קומפוננטה מוסרת מה-DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### ניהול שגיאות {#error-handling}

קריאה למתודות האלו מתבצעת כאשר קיימת שגיאה ברינדור, במתודת מעגל-חיים, או בבנאי של קומפוננטת ילד כלשהי.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### API-ים אחרים {#other-apis}

כל קומפוננטה מספקת בנוסף מספר API-ים אחרים.

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Properties של מחלקה {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Properties של מופע {#instance-properties}
  
  - [`props`](#props)
  - [`state`](#state)

* * *

## עיון {#reference}

### מתודות מעגל-חיים שבשימוש נפוץ {#commonly-used-lifecycle-methods}

המתודות בחלק הזה מכסות את החלק הנרחב של שימושים שתתקלו בהם כאשר תיצרו קומפוננטות ב-React. **להפנייה ויזואלית, בידקו [את דיאגרת מעגל-החיים הזו](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

מתודת ה-`render()` היא המתודה הנדרשת היחידה בשימוש של קומפוננטת מחלקה.

בקריאה אליה, המתודה תבחן את `this.props` ואת `this.state` ותחזיר את אחד הסוגים הבאים:

- **אלמנטים של React.** בדרך כלל נוצרים על ידי [JSX](/docs/introducing-jsx.html). לדוגמא, `<div />` ו- `<MyComponent />` הם אלמנטים של React שמנחים את React לרנדר צומת של DOM, או קומפוננטת משתמש אחרת, בהתאמה.
- **מערכים ו-Fragments.** מאפשרים להחזיר אלמנטים מרובים מ-render. קראו את התיעוד ב-[fragments](/docs/fragments.html) מידע נוסף.
- **Portals**. מאפשרים לרנדר ילדים לתוך תת-עץ DOM שונה. קראו את התיעוד ב-[portals](/docs/portals.html) למידע נוסף. 
- **מחרוזות ומספרים.** מרונדרים כצמתי טקסט בתוך ה-DOM.
- **משתנים בולאנים או `null`**. מרנדר כלום. (בעיקר קיים כדי לתמוך בתבנית `return test && <Child />`, כאשר `test` הוא משתנה בולאני.)
  
הפונקציה `render()` צריכה להיות טהורה, כלומר היא לא משנה את ה-state של הקומפוננטה, היא מחזירה את אותה התוצאה בכל פעם שהיא מתבצעת, והיא לא מדברת ישירות עם הדפדפן.

כאשר יש צורך לדבר עם הדפדפן, יש להשתמש ב- `componentDidMount()` או במתודות האחרות של מעגל-החיים במקום. שמירה על כך ש- `render` תשמר טהורה, הופכת את החשיבה על קומפוננות ליותר קלה.

> הערה
>
> `render()` לא תתבצע אם [`shouldComponentUpdate()`](#shouldcomponentupdate) מחזירה 'false'.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**אם אין צורך באתחול state ו-binding עבור מתודות, אין צורך לממש בנאי עבור קומפוננטת ה-React שלכם.**

קריאה לבנאי של קומפוננטת ה-React שלכם מתבצעת לפני ה-Mounting של הקומפוננטה. כאשר מממשים את הבנאי עבור תת-מחלקה מסוג `React.Component`, נדרשת קריאה ל- `super(props)` לפני כל ביטוי אחר. אחרת, `this.props` יהפוך להיות לא-מוגדר (undefined) בבנאי, מה שיכול להוביל לבאגים.

בדרך כלל ב-React, בנאים נכתבים עבור שתי מטרות בלבד:
 
* איתחול [local state](/docs/state-and-lifecycle.html) על ידי הקצאת אוביקט ל- `this.state`.
* Binding [event handler](/docs/handling-events.html) של מתודות למופע כלשהו.

**לא אמורה להתבצע קריאה ל- `setState()`** בתוך ה- `constructor()`. במקום זאת, אם קומפוננטה צריכה להשתמש ב-state מקומי, **עליכם להקצות את ה-state הראשוני ל- `this.state`** ישירות בתוך הבנאי:

```js
constructor(props) {
  super(props);
  // לא לקרוא ל-this.setState() כאן!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

הבנאי הוא המקום היחידי שאמורה להתבצע בו הקצאה ישירה ל- `this.state`. בכל שאר המתודות, צריך להתבצע שימוש ב- `this.setState()` במקום.

יש להימנע מהצהרה ראשונית על side-effects כלשהן או מינויים (subscriptions) בתוך הבנאי. עבור שימושים אלו, יש להשתמש ב- `componentDidMount()` במקום.

>הערה
>
>**יש להימנע מהעתקת props לתוך state!, זוהי טעות נפוצה:**
>
>```js
>constructor(props) {
>  super(props);
>  // אל תעשו זאת!
>  this.state = { color: props.color };
>}
>```
>
>הבעיה היא שזה גם לא נחוץ (אפשר להשתמש ב- `this.props.color` ישירות במקום), וגם יוצר באגים (עדכונים ל- `color` prop לא ישוקפו ב-state).
>
>**השתמשו בתבנית הזו אם רוצים באופן מכוון להתעלם מעדכוני prop.** במקרים האלו, הגיוני יותר לשנות את שם ה-prop ל- `initialColor` או `defaultColor`. אז תוכלו לגרום לקומפוננטה לבצע "איפוס" ל-state הפנימי באופן כפוי על-ידי [שינוי `המהפתח` שלו](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) כאשר יש צורך בכך.
>
>קראו את [הפוסט בבלוג שלנו על הימנעות מ- derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html) כדי ללמוד על מה לעשות אם אתם חושבים שאתם צריכים state שיהיה תלוי ב-props.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

המתודה `componentDidMount()` מתבצעת מידית לאחר ה-Mounting של הקומפוננטה (כאשר היא מוכנסת לתוך העץ). איתחול שדורש צמתי DOM יתאים להיות כאן. אם יש צורך לטעון מידע מקצה מרוחק, זה מקום טוב ליצור את בקשת הרשת.

המתודה הזו היא מקום טוב להגדיר מינויים (subscription). אם אכן אתם מבצעים זאת, לא לשכוח לבטל מינוי ב- `componentWillUnmount()`.

אתם יכולים **לקרוא ל- `setState()` באופן מידי** ב- `componentDidMount()`. זה יגרום לרינדור נוסף, אבל הוא יקרה לפני שהדפדפן יעדכן את המסך. זה מבטיח שאפילו למרות שקריאה ל- `render()` תתבצע פעמיים במקרה זה, המשתמש לא יוכל לראות את state הביניים. השתמשו בתבנית זו עם יתר זהירות מכיוון שלעתים היא יוצרת בעיות בביצועים. ברוב המקרים, ניתן לבצע הקצאה ל-state ההתחלתי בתוך ה- `constructor()` במקום. עם זאת, יכול להיות שהתבנית הזו תהיה הכרחית במקרים כמו modals ו-tooltips כאשר יש צורך למדוד צומת ב-DOM לפני רינדור משהו שתלוי בגודלו או מיקומו.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

המתודה `componentDidUpdate()` מתבצעת מידית לאחר שהעידכון קורה. אין קריאה למתודה הזו ברינדור הראשוני.

השתמשו בזה כהזדמנות לנהל את ה-DOM כאשר הקומפוננטה עודכנה. זה גם מקום טוב לבצע בקשות רשת כל עוד אתם משווים את ה-props הנוכחיים ל-props הקודמים (לדוגמא, יכול להיות שבקשת רשת אינה הכרחית אם ה-props לא השתנו).

```js
componentDidUpdate(prevProps) {
  // שימוש טיפוסי (לא לשכוח להשוות את ה-props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

ניתן **לקרוא באופן מידי ל- `setState()`** ב- `componentDidUpdate()` אבל שימו לב שקריאה כזו **מחויבת להיות עטופה במשפט תנאי** כמו בדוגמא מעלה, אחרת תהיה לולאה אינסופית. בנוסף, רינדור נוסף יתבצע, שלמרות שלא יהיה גלוי לעינו של המשתמש, יוכל להשפיע על ביצועיה של הקומפוננטה. אם אתם מנסים "לשקף" state ל- prop, שיקלו שימוש ב- prop ישירות, במקום. קראו עוד על [למה העתקת props לתוך state גורם לבאגים](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

אם הקומפוננטה שלכם מממשת את מתודת מעגל-החיים `getSnapshotBeforeUpdate()` (שזה מקרה נדיר),  הערך שהיא תחזיר יועבר כפרמטר "תמונת-מצב" שלישי ל- `componentDidUpdate()`. אחרת, הפרמטר הזה יהיה לא-מוגדר.
 
> הערה
>
> המתודה `componentDidUpdate()` לא תתבצע אם [`shouldComponentUpdate()`](#shouldcomponentupdate) תחזיר 'false'.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

המתודה `componentWillUnmount()` מתבצעת באופן מידי לפני Unmounting של קומפוננטה והריסתה. בצעו כל ניקוי חיוני במתודה הזו, כדוגמת ביטול טיימרים, ביטול בקשות רשת, או ניקוי של כל מינוי שנוצר ב- `componentDidMount()`. 

**קריאה ל- `setState()` לא אמורה להתבצע** ב- `componentWillUnmount` מכיוון שהקומפוננטה לעולם לא תרונדר שוב. ברגע שמופע של קומפוננטה ביצע Unmounting, הוא לעולם לא יבצע Mounting שוב.

* * *

### מתודות מעגל-חיים שבשימוש נדיר {#rarely-used-lifecycle-methods}

המתודות בחלק הזה מתכתבות עם שימושים פחות נפוצים. הן נוחות לשימוש לעתים, אבל רוב הקומפוננטות ככל הנראה לא זקוקות להן. **אתם יכולים לראות את רוב המתודות להלן [בדיאגרמת מעגל-החיים הזו](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) על ידי לחיצה על תיבת הסימון - "הראה מתודות מעגל-חיים פחות נפוצות" בראשה.**

 
### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

השתמשו ב- `shouldComponentUpdate` כדי לגרום ל-React לדעת אם פלט של קומפוננטה לא מושפע על ידי השינוי הנוכחי ב-state או props. התנהגות ברירת המחדל היא לרנדר שוב בכל שינוי של state, וברוב המקרים עליכם להסתמך על התנהגות זו.

המתודה `shouldComponentUpdate()` מתבצעת לפני רינדור בעקבות קבלת props או state חדשים. ברירת המחדל היא `true`. לא מתבצעת קריאה למתודה זו ברינדור הראשוני או כאשר יש שימוש ב- `forceUpdate()`.

המתודה הזו קיימת רק כ-**[אופטימיזציה בביצועים](/docs/optimizing-performance.html).** אל תסתמכו עליה כדי "למנוע" רינדור, זה יכול להוביל לבאגים. **שיקלו להשתמש ב-[`PureComponent`](/docs/react-api.html#reactpurecomponent)** במקום לכתוב את `shouldComponentUpdate()` בעצמכם. `PureComponent` מבצע השוואה רדודה של props ו-state, ומפחית את הסיכוי שנדלג על עדכון הכרחי.

אם אתם בטוחים בעצמכם שאתם רוצים לכתוב אותה בעצמכם, רצוי שתשוו את `this.props` עם `nextProps` ואת `this.state` עם `nextState` ולהחזיר `ביטוי שקר` וכך בעצם לומר ל-React שאפשר לדלג על העידכון. שימו לב שהחזרת `false` לא מונע מקומפוננטות-ילד לבצע רינדור חוזר, כאשר ה-state *שלהם* משתנה.

אנחנו לא ממליצים לבצע בדיקות איכות עמוקות או שימוש ב- `JSON.stringify()` ב- `shouldComponentUpdate()`. זה מאוד לא יעיל ויכול לגרוע בביצועים.

כרגע, אם `shouldComponentUpdate()` מחזירה `false`, אז [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), ו- [`componentDidUpdate()`](#componentdidupdate) לא יתבצעו. בעתיד React אולי תתייחס ל- `shouldComponentUpdate()` כאל רמז, מאשר כאל directive נוקשה, והחזרת `false` אולי תוביל לרינדור נוסף של הקומפוננטה.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

המתודה `getDerivedStateFromProps` מופעלת רגע לפני הקריאה למתודת הרינדור, גם ב-mount הראשוני וגם על עדכונים לאחר מכן. עליה להחזיר אובייקט על מנת לעדכן את ה-state, או `null` כדי לא לעדכן כלום.

המתודה הזו קיימת [לשימושים נדירים](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) בהם ה-state תלוי בשינויים ב-props במהלך הזמן. לדוגמא, ייתכן שיהיה זה שימושי לשימוש במימוש של קומפוננטת `<Transition>` שמשווה את הילדים הקודמים והבאים שלה כדי להחליט איזה מהם להנפיש.

שימוש ב- deriving state מוביל לקוד ארוך ומקשה על חשיבה על הקומפוננטות שלכם.
[ודאו שאתם מכירים מימוש עם אלטרנטיבות פשוטות יותר:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* אם אתם צריכים **ליצור side-effect** (לדוגמא, קבלת מידע או הנפשה) כתגובה לשינוי ב-props, השתמשו ב- [`componentDidUpdate`](#componentdidupdate) מעגל-החיים במקום.

* אם אתם רוצים **לחשב מחדש מידע מסוים רק כאשר prop משתנה**, [השתמשו ב-memoization helper במקום](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* אם אתם רוצים **לאפס state כלשהו כאשר prop משתנה**, שקלו לייצר קומפוננטה [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) או [fully uncontrolled with a `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) במקום.

למתודה הזו אין גישה למופעים של קומפוננטות. אם תרצו, אתם יכולים לעשות שימוש חוזר בקוד בין `getDerivedStateFromProps()` ושאר המתודות במחלקה על-ידי חילוץ פונקציות טהורות מתוך ה-props וה-state של הקומפוננטה מחוץ להגדרת המחלקה.

שימו לב שהמתודה הזו מתבצעת בכל רינדור, ללא קשר לסיבה שהיא הופעלה. זה בניגוד ל- `UNSAFE_componentWillReceiveProps`, שמתבצעת רק כאשר ההורה גורם לרינדור מחדש ולא כתוצאה של `setState` מקומי.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

המתודה `getSnapshotBeforeUpdate()` מתבצעת רגע לפני שהפלט של הרינדור האחרון ביותר הועבר ל-DOM לדוגמא. זה מאפשר לקומפוננטה ללכוד מידע מסוים מה-DOM (לדוגמא, מיקום הגלילה) לפני שהוא עשוי להשתנות. כל ערך שיוחזר על-ידי מתודת מעגל-החיים הזו יועבר כפרמטר ל-`componentDidUpdate()`.

השימוש הזה לא נפוץ, אבל יכול להתרחש ב-UI-ים כמו גדיל של צ'אט שצריך לנהל מיקום גלילה בדרך מיוחדת.

ערך של תמונת-מצב (או `null`) אמור להיות מוחזר 

לדוגמא:

`embed:react-component-reference/get-snapshot-before-update.js`

בדוגמאות למעלה, חשוב לקרוא את ה- `scrollHeight` property ב- `getSnapshotBeforeUpdate` בגלל שיכולים להיות עיכובים בין שלב "הרינדור" במעגל-החיים (כמו `render`) לבין שלב ה- "commit" במעגל-החיים (כמו ב- `getSnapshotBeforeUpdate` וב- `componentDidUpdate`).

* * *

### Error boundaries {#error-boundaries}

[Error boundaries](/docs/error-boundaries.html) הם קומפוננטות של React שתופסות שגיאות של JavaScript בכל מקום בעץ קומפוננטות הילד שלהם, מתעדת את השגיאות האלו, ומציגה UI מגובה של עץ הקומפוננטה שהתרסקה. Error boundaries תופסת שגיאות במהלך רינדור, במתודות מעגל-החיים, ובבנאים של כל העץ שמתחתיהם.

קומפוננטת מחלקה הופכת ל- error boundary אם היא מגדירה את אחת המתודות הבאות של מעגל-החיים (או שתיהן): `static getDerivedStateFromError()`, `componentDidCatch()`. עדכון של state ממעגל-החיים הזה מאפשר לנו ללכוד שגיאת JavaScript לא מטופלת בעץ מתחת ולהציג UI מגובה.

השתמשו ב-error boundaries להתאושש מחריגות לא צפויות בלבד; **אל תנסו להשתמש בהם עבור בקרת זרימה.**

לפרטים נוספים, הסתכלו ב- [*טיפול בשגיאות ב-React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> הערה
>
> Error boundaries תופסים שגיאות בקומפוננטות **מתחתיהם** בעץ בלבד. error boundary לא יכול לתפוס שגיאה בתוך עצמו.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

מעגל-חיים זה מתבצע לאחר ששגיאה נזרקה על ידי קומפוננטת-צאצא.
הוא מקבל את השגיאה שנזרקה כפרמטר ואמור להחזיר ערך כדי לעדכן את state.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // מעדכן את ה-state כדי שהרינדור הבא יראה את ה-UI המגובה.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // ניתן לרנדר כל גיבוי UI מותאם.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

> הערה
> 
> המתודה `getDerivedStateFromError()` נקראת במהלך שלב "הרינדור", לכן side-effects לא מורשים.
בשביל מקרים כאלו, השתמשו ב- `componentDidCatch()` במקום.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

מתודת מעגל-החיים הזו מתבצעת לאחר ששגיאה נזרקה על-ידי קומפוננת צאצא.
היא מקבל שני פרמטרים:

1. `שגיאה (error)` - השגיאה שנזרקה.
2. `מידע (info)` - אובייקט עם מפתח `componentStack` המכיל [מידע לגבי איזו קומפוננטה זרקה את השגיאה](/docs/error-boundaries.html#component-stack-traces).


קריאה ל- `componentDidCatch()` מתבצעת במהלך שלב ה-"commit", לכן side-effects מורשים.
רצוי להשתמש בה לדברים כמו תיעוד שגיאות:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // מעדכן את ה-state כדי שהרינדור הבא יראה את ה-UI המגובה.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // דוגמה ל-"componentStack":
    //   ב-ComponentThatThrows (נוצר על-ידי App)
    //   ב-ErrorBoundary (נוצר על-ידי App)
    //   ב-div (נוצר על-ידי App)
    //   ב-App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // ניתן לרנדר כל UI גיבוי מותאם.
      return <h1>משהו השתבש.<h1/>;
    }

    return this.props.children;
  }
}
```

בגרסאות production ו- development יש הבדל שולי בדרך שבה `componentDidCatch()` מטפלת בשגיאות.

בפיתוח, השגיאות יבעבעו ל-`window`, זה אומר שכל `window.onerror` או `window.addEventListener('error', callback)` יירטו את השגיאות שנתפסו על ידי `componentDidCatch()`.

ב-production, במקום, השגיאות לא יבעבעו מעלה, מה שאומר שכל error handler קודם יקבל רק שגיאות שלא נתפסו במפורש על ידי `componentDidCatch()`.

> הערה
>
> באירוע השגיאה, ניתו לרנדר גיבוי UI עם `componentDidCatch()` על ידי קריאה ל- `setState`, אבל תכונה זו תצא משימוש בגרסא עתידית.
> השתמשו ב- `static getDerivedStateFromError()` על מנת לטפל ברינדור מגובה במקום.

* * *

### Legacy Lifecycle Methods {#legacy-lifecycle-methods}

מתודות מעגל-החיים להלן מסומן כ"ישנות". הן עדיין יעבדו, אבל אנחנו לא ממליצים להשתמש בהם בקוד חדש. אתם יכולים ללמוד עוד על מעבר ממתודות מעגל-חיים המוגדרות כ"מורשת" ב-[פוסט הזה](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> הערה
> 
> 

`UNSAFE_componentWillMount()` מתבצעת רגע לפני שה-mounting מתרחש. היא נקראת לפני `render()`, לכן קריאה ל- `setState()` סנכרונית במתודה הזו לא תייצר רינדור נוסף. בכלליות, אנחנו ממליצים על שימוש ב- `constructor()` במקום בשביל איתחול state.

המנעו מהגדרת כל side-effects או מינויים במתודה הזו. למקרים האלו, השתמשו ב- `componentDidMount()` במקום.

זו מתודת מעגל-החיים היחידה שנקראת ברינדור שרת.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> הערה
> 
> מעגל-החיים הזה נקרא בעבר `componentWillReceiveProps`. השם הזה ימשיך לעבוד עד גרסא 17. השתמשו ב-[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) כדי לעדכן את הקומפוננטות שלכם אוטומטית.

> הערה:
>
> שימוש במתודת מעגל-החיים הזו לעתים תכופות מוביל לבאגים ולחוסר עקביות.
>
> * אם אתם צריכים **ליצור side-effect** (לדוגמא, קבלת מידע או הנפשה) כתגובה לשינוי ב-props, השתמשו ב-[`componentDidUpdate`](#componentdidupdate) במקום.
> * אם השתמשתם ב- `componentWillReceiveProps` עבור **חישוב מחדש של מידע כלשהו רק כאשר prop השתנה**, [השתמשו ב-memoization helper במקום](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * אם השתמשתם ב- `componentWillReceiveProps` על מנת **"לאפס" state כאשר prop השתנה**, שיקלו ליצור קומפוננטה [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) או [fully uncontrolled with a `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) במקום.
>
> למקרים אחרים, [עקבו אחר ההמלצות בפוסט הזה מתוך הבלוג על derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` מתבצעת לפני שקומפוננטה שעברה mounting מקבלת props חדשים. אם אתם צריכים לעדכן את ה-state כתגובה לשינוי props (לדוגמא, כדי לאפס אותו), אתם יכולים להשוות את `this.props` ואת `nextProps` ולבצע חילופי state באמצעות `this.setState()` במתודה הזו.

שימו לב שאם קומפוננטת הורה גורמת לקומפוננטה שלכם להתרנדר מחדש, תתבצע קריאה למתודה הזו אפילו אם props לא השתנו. ודאו להשוות את הערכים הנוכחיים והבאים אם אתם רוצים רק לטפל בשינויים.

React לא קוראת ל- `UNSAFE_componentWillReceiveProps()` עם props התחלתיים במהלך [mounting](#mounting). היא קוראת למתודה הזו רק אם מספר props של הקומפוננטה עשויים להתעדכן. קריאה ל- `this.setState()` בדרך כלל לא מעוררת קריאה ל- `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> הערה
>
> מתודת מעגל-החיים הזו נקרא בעבר `componentWillUpdate`. השם הזה ימשיך לעבוד עד לגרסא 17. השתמשו ב-[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) לעדכון אוטומטי של הקומפוננטות שלכם.

`UNSAFE_componentWillUpdate()` מתבצעת רגע לפני רינדור כתוצאה מקבלת props או state חדשים. השתמשו בה כהזדמנות לבצע הכנות לפני שעדכון מתבצע. המתודה הזו לא נקראת ברינדור הראשוני.

שימו לב שאתם לא יכולים לקרוא ל- `this.setState()` כאן; גם אתם לא אמורים לעשות דבר שיגרום לעדכון קומפוננטה ב-React לפני ש- `UNSAFE_componentWillUpdate()` חוזרת.

בדרך כלל, המתודה הזו יכולה להיות מוחלפת על-ידי `componentDidUpdate()`. אם קראתם מה-DOM במתודה הזו (לדוגמא, כדי לשמור מיקום גלילה), אתם יכולים להעביר את הלוגיקה הזו ל-`getSnapshotBeforeUpdate()`.

> הערה
>
> `UNSAFE_componentWillUpdate()` לא תתבצע אם [`shouldComponentUpdate()`](#shouldcomponentupdate) מחזירה false.

* * *

## API-ים אחרים {#other-apis-1}

לא כמו מתודות מעגל-החיים למעלה (אשר React קוראת להן עבורנו), המתודות להלן הן מתודות *שאנחנו* יכולים לקרוא להן מהקומפוננטות שאנו יוצרים.

יש רק שניים כאלו: `setState()` ו- `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` מכניסה לתור שינויים ב-state של הקומפוננטה ואומרת ל-React שהקומפוננטה הזו והילדים שלה צריכים להיות מרונדרים מחדש עם ה-state המעודכן. זו המתודה הראשית שבה משתמשים כדי לעדכן את ממשק המשתמש בתגובה למנהלי אירועים ותגובות שרת.

<<<<<<< HEAD
חישבו על `setState()` כאל *בקשה* מאשר כאל פקודה מידית לעדכון הקומפוננטה. למען ביצועים טובים יותר, React עשויה לעכב את ביצועה של הפקודה, ואז לעדכן מספר קומפוננטות במעבר אחד. React לא מבטיחה ששינוי ה-state יתבצעו מידית.
=======
Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in [`flushSync`](/docs/react-dom.html#flushsync), but this may hurt performance.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

`setState()` לא תמיד מעדכנת באופן מידי את הקומפוננטה. היא עשויה לדחות את העידכון לאחר כך. זה גורם לכך שקריאה מ- `this.state` ישר אחרי קריאה ל-`setState()` למלכודת פוטנציאלית. במקום, השתמשו ב- `componentDidUpdate` או בפונקצית ה-callback ב-`setState` (`setState(updater, callback)`), בכל אחד מהמקרים מובטח כי יתבצע לאחד שהעדכון יקרה. אם יש צורך להגדיר את ה-state בהתבסס על ה-state הקודם, קראו על הארגומנט `updater` מטה.

`setState()` תמיד יוביל לרינדור מחדש אלא אם `shouldComponentUpdate()` תחזיר `false`. אם אובייקטים שניתנים לשינוי (mutable) נמצאים בשימוש ולוגיקת רינדור מותנה לא יכולה להיות ממומשת ב- `shouldComponentUpdate()`, קריאה ל- `setState()` רק כאשר ה-state החדש שונה מהקודם תמנע רינדור מחדש מיותר.

הארגומנט הראשון הוא פונקציית `updater` עם החתימה:

```javascript
(state, props) => stateChange
```

`state` הוא הפנייה ל-state של הקומפוננטה בזמן שהשינוי היה מבוצע. לא אמורים לבצע שינויים ישירות. במקום, שינויים צריכים להיות מיוצגים על ידי בניית אוביקט חדש המבוסס על הקלט מ-`state` ו-`props`. למשל, נניח שרצינו להגדיל ערך ב-state על-ידי `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

גם `state` וגם `props` שהתקבלו על ידי פונציית העדכון מובטחים להיות מעודכנים. הפלט של העדכון מתאחד באופן רדוד עם `state`.

הפרמטר השני ל- `setState()` הוא פונקציית callback אופציונלית שתתבצע ברגע ש- `setState` תושלם והקומפוננטה תרונדר מחדש. בכלליות, אנחנו ממליצים על שימוש ב- `componentDidUpdate()` ללוגיקות כאלו, במקום.

אופציונלית, ניתן להעביר אובייקט כארגומנט הראשון ל- `setState()` במקום פונקציה:

```javascript
setState(stateChange[, callback])
```

דרך זו מבצעת איחוד רדוד של `stateChange` לתוך ה-state החדש, לדוגמא כדי לשנות כמות של פריט בעגלת קניות:

```javascript
this.setState({quantity: 2})
```

הצורה הזו של `setState()` היא גם אסינכרונית, וקריאות מרובות במהלך אותו מעגל-חיים עלולים להתנגש. לדוגמא, אם ננסה להגדיל כמות של פריט יותר מפעם אחת באותו מעגל, זה יגרום לתוצאה השקולה ל:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

קריאות עוקבות יגרמו לדריסה של ערכים מקריאות קודמות באותו מעגל, לכן הכמות תגדל פעם אחת בלבד. אם ה-state הבא תלוי ב-state הנוכחי, אנחנו ממליצים להשתמש בצורה של פונקציית עדכון, במקום:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

למידע נוסף, עיינו:

* [State and Lifecycle guide](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

בתור ברירת מחדל, כאשר ה-state או ה-props של הקומפוננטה שלכם משתנים, הקומפוננטה שלכם תרונדר מחדש. אם מתודת ה- `render()` שלכם תלויה במידע נוסף אחר, אתם יכולים להגיד ל-React שהקומפוננטה זקוקה לרינדור מחדש על-ידי קריאה ל- `forceUpdate()`.

קריאה ל- `forceUpdate()` תגרום לכך שתתבצע קריאה ל- `render()` בקומפוננטה, תוך כדי דילוג על `shouldComponentUpdate()`. זה יעורר תגובה של מתודות מעגל-החיים הרגיל לקומפוננטות ילד, לרבות מתודת ה- `shouldComponentUpdate()` של כל ילד. React עדיין רק תעדכן את ה-DOM ה-markup ישתנה.

הדרך הנכונה היא לנסות להמנע משימוש ב- `forceUpdate()` ורק לקרוא מ- `this.props` ו- `this.state` ב- `render()`.

* * *

## Properties של מחלקות (Class Properties) {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` יכול להיות מוגדר כ-property במחלקת הקומפוננטה עצמה, כדי להגדיר את props ברירת-המחדל עבור המחלקה. השימוש בזה הוא עבור props שהם `undefined`, אבל לא עבור props שהם `null`. לדוגמא:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

אם אין ערך ל-`props.color`, ערכו ייקבע לפי ברירת המחדל `'blue'`:
 
```js
  render() {
    return <CustomButton /> ; // props.color ייקבע להיות כחול
  }
```

אם `props.color` מוגדר להיות `null`, הוא יישאר `null`:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color ישאר null
  }
```

* * *

### `displayName` {#displayname}

המחרוזת `displayName` בשימוש בהודעות דיבאגינג. בדרך כלל, אנחנו לא צריכים להגדיר אותה באופן מפורש בגלל שהשם שלה נגזר מהשם של הפונקציה או המחלקה שמגדירה את הקומפוננטה. ייתכן שנרצה להגדיר אותה מפורשות אם נרצה להציג שם אחר עבור מטרות דיבאגינג או כאשר ניצור קומפוננטה מסדר גבוה יותר, עיינו ב-[לעטוף את שם התצוגה עבור דיבאגינג פשוט](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) בשביל מידע נוסף.

* * *

## Properties של מופע (Instance Properties) {#instance-properties-1}

### `props` {#props}

`this.props` מכין את ה-props שהוגדרו על ידי המפעיל של הקומפוננטה הזו. עיינו ב-[קומפוננטות ו-props](/docs/components-and-props.html) עבור הקדמה ל-props.

`this.props.children` הוא prop מיוחד, בדרך כלל מוגדר על ידי הטאגים של הילד בביטוי ה-JSX  מאשר בטאג עצמו.

### `state` {#state}

ה-state מכיל מידע ספציפי לקומפוננטה הזאת שעשוי להשתנות במהלך הזמן. ה-state מוגדר על-ידי המשתמש, והוא אמור להיות אוביקט JavaScript פשוט.

אם ערך כלשהו לא בשימוש עבור רינדור או עבור זרימת מידע (לדוגמא, timer ID), אין חובה לשים אותו בתוך ה-state. ערכים כאלו יכולים להיות מוגדרים כשדות בקומפוננטת המופע.

עיינו ב-[State ומחזור חיים](/docs/state-and-lifecycle.html) עבור מידע נוסף על ה-state.

לעולם אל תשנו את `this.state` ישירות, מכיוון שקריאה ל- `setState()` לאחר מכן עלולה להחליף את השינוי שביצעתם. התייחסו ל- `this.state` כאילו היה אימיוטבל.
