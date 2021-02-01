---
id: faq-functions
title: העברת פונקציות לקומפוננטות
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### איך אני מעביר מטפל אירוע (כמו onClick) לקומפוננטה? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

העבר מטפל אירוע ופונקציות אחרות כ-props לקומפוננטות ילדים:

```jsx
<button onClick={this.handleClick}>
```

אם אתה צריך גישה לקומפוננטת האב מתוך מטפל האירוע, אתה צריך גם לעשות bind לפונקציה לדוגמת הקומפוננטה (ראה למטה).

### איך אני עושה לפונקציה bind למופע של קומפוננטה? {#how-do-i-bind-a-function-to-a-component-instance}

יש כמה דרכים לוודא שלפונקציות יש גישה לתכונות של קומפוננטה כמו `this.props` ו-`this.state`, תלוי באיזה תחביר ושלב בנייה אתה משתמש.

#### bind בתוך בנאי (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('הכפתור נלחץ');
  }
  render() {
    return <button onClick={this.handleClick}>לחץ עליי</button>;
  }
}
```

#### תכונות מערכה (הצעה בשלב 3) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // הערה: התחביר ניסיוני ואינו חלק מהתקן בינתיים
  handleClick = () => {
    console.log('הכפתור נלחץ');
  }
  render() {
    return <button onClick={this.handleClick}>לחץ עליי</button>;
  }
}
```

#### bind ב-render {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('הכפתור נלחץ');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>לחץ עליי</button>;
  }
}
```

>**הערה:**
>
>שימוש ב`function.prototype.bind` בתוך render יוצר פונקציה חדשה בכל פעם שהקומפוננטה מרונדרת, מה שיכול לגרום להשלכות על הביצועים (ראה למטה).

#### פונקציית חץ ב-render {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('הכפתור נלחץ');
  }
  render() {
    return <button onClick={() => this.handleClick()}>לחץ עליי</button>;
  }
}
```

>**הערה:**
>
> שימוש בפונקציית חץ בתוך render יוצר פונקציה חדשה בכל פעם שהקומפוננטה מרונדרת, מה שיכול לשבור אופטימיזציות שמבוססות על השוואת זהות נוקשית.

### האם זה בסדר להשתמש בפונקציות חץ בתוך מתודות render? {#is-it-ok-to-use-arrow-functions-in-render-methods}

באופן כללי כן, זה בסדר, ולעיתים קרובות זו הדרך הכי קלה להעביר פרמטרים לפונקציות callback.

אם יש לך בעיות ביצועים, בהחלט, בצע אופטימיזציה!

### מדוע נחוץ לעשות binding בכלל? {#why-is-binding-necessary-at-all}

ב-JavaScript, שני קטעי הקוד האלה **אינם** שווי ערך:

```js
obj.method();
```

```js
var method = obj.method;
method();
```

לעשות binding למתודות עוזר לוודא שקטע הקוד השני יעבוד באותה צורה כמו הראשון.

עם React, בדרך כלל צריך לעשות bind רק למתודות שאתה *מעביר* לקומפוננטות אחרות. לדוגמה, `<button onClick={this.handleClick}>` מעביר את המתודה `this.handleClick` כך שתרצה לעשות לה bind. עם זאת, אין צורך לעשות bind למתודת `render` או למתודות מעגל החיים: איננו מעבירים אותם לקומפוננטות אחרות.

[הפוסט הזה של Yehuda Katz](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) מסביר מה זה binding, ואיך פונקציות עובדות בJavaScript, בצורה מפורטת.

### מדוע הפונקציה שלי מקבלת קריאה בכל פעם שהקומפוננטה מרונדרת? {#why-is-my-function-being-called-every-time-the-component-renders}

וודא שאתה לא _קורא לפונקציה_ כשאתה מעביר אותה לקומפוננטה:

```jsx
render() {
  // טעות: קריאה לפונקציה במקום להעביר אותה כרפרנס!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

במקום, *העבר את הפונקציה עצמה* (ללא סוגריים):

```jsx
render() {
  // נכון: הפונקציה מועברת כרפרנס!
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### איך אני מעביר פרמטר למטפל אירוע או ל-callback? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

אתה יכול להשתמש בפונקציית חץ כדי לעטוף את מטפל האירוע ולהעביר פרמטרים:

```jsx
<button onClick={() => this.handleClick(id)} />
```

זה שווה ערך לקריאה ל-`.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### דוגמה: העברת פרמטרים על ידי שימוש בפונקציות חץ {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // קוד תו ב-ASCII

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### דוגמה: העברת פרמטרים על ידי שימוש במאפייני-מידע (data-attributes) {#example-passing-params-using-data-attributes}

לחילופין, אתה יכול להשתמש ב-DOM APIs בשביל לאכסן מידע שנחוץ למטפלי אירועים. שקול את הגישה הזו אם אתה צריך לעשות אופטימיזציה למספר רב של אלמנטים או שיש לך עץ רינדור שמסתמך על בדיקות השוואה של React.PureComponent.

```jsx
const A = 65 // קוד תו ב-ASCII

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### איך אני יכול למנוע מפונקציה להיקרא יותר מדי מהר או יותר מדי פעמים ברצף? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

אם יש לך מטפל אירוע כמו `onClick` או `onScroll` ואתה רוצה למנוע מה-callback להיקרא מהר מדי, אתה יכול להגביל את הקצב שבו ה-callback מוצא לפועל. זה יכול להעשות על ידי:

- **throttling**: דגום שינויים על בסיס תדירות (למשל [`_.throttle`](https://lodash.com/docs#throttle))
- **debouncing**: פרסם שינויים לאחר פרק זמן של אי-פעילות (למשל [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` throttling**: דגום שינויים על בסיס [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (למשל [`raf-schd`](https://github.com/alexreardon/raf-schd))

ראה את [הויזואליזציה הזאת](http://demo.nimius.net/debounce_throttle/) לשם השוואה בין פונקציות `throttle` ו-`debounce`.

> הערה:
>
> בכדי לבטל callbacks מעוכבים, `_.debounce`, `_.throttle` ו-`raf-schd` מספקים מתודת `cancel`. עליך לקרוא למתודה הזאת מתוך `componentWillUnmount` _או_ לוודא מתוך הפונקציה המעוכבת שהקומפוננטה עדיין מעוגנת (mounted).

#### Throttle {#throttle}

'Throttling' מונע מפונקציה להיקרא יותר מפעם אחת בתוך חלון זמן נתון. הדוגמה למטה עושה throttle למטפל אירוע לחיצה כדי למנוע מקריאה לפונקציה יותר מפעם אחת בשנייה.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>טען עוד</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

'Debouncing' מוודא שהפונקציה לא תוצא לפועל עד שפרק זמן מסוים חלף מאז הפעם האחרונה בה היא נקראה. זה יכול להיות שימושי כאשר אתה צריך לבצע חישוב יקר כלשהו בתגובה לאירוע שעלול להיות משוגר במהירות (למשל אירועי גלילה או הקלדה). הדוגמה למטה עושה debounce לקלט טקסט עם דיליי של 250ms.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="חיפוש..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) היא דרך לקביעת תור להוצאה לפועל של פונקציה בתוך הדפדפן בזמן האופטימלי מבחינת ביצועי רינדור. פונקציה שממתינה בתור עם `requestAnimationFrame` תשוגר בפריים הבא. הדפדפן יעבוד קשה בכדי לוודא שישנם 60 פריימים לשנייה (60 fps). יחד עם זאת, אם הדפדפן לא מסוגל לעשות זאת, הוא *יגביל* באופן טבעי את כמות הפריימים בשנייה. לדוגמה, מכשיר מסוים עלול להיות מסוגל להתמודד רק עם 30 פריימים לשנייה כך שתקבל רק 30 פריימים באותה שנייה. שימוש ב-`requestAnimationFrame` בשביל לבצע throttling הוא טכניקה שימושית בכך שזה מונע ממך לבצע יותר מ60 עידכונים בשנייה. אם אתה מבצע 100 עידכונים בשנייה זה יוצר עבודה נוספת לדפדפן שהמשתמש בכל מקרה לא ייראה.

> הערה:
>
>שימוש בטכניקה הזאת ילכוד רק את הערך האחרון שפורסם בפריים. אתה יכול לראות דוגמה לאיך האופטימיזציה הזאת עובדת ב-[`MDN`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // צור פונקציה חדשה לקביעת עידכונים.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // כאשר אנחנו מקבלים אירוע גלילה, קבע עידכון.
    // אם אנחנו מקבלים עידכונים רבים בפרק זמן קצוב, נפרסם רק את הערך העדכני ביותר.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // בטל את כל העידכונים הממתינים מפני שאנחנו לא מעוגנים (unmounted).
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/התמונה-הענקית-שלי.jpg" />
      </div>
    );
  }
}
```

#### בדיקת הגבלות קצב {#testing-your-rate-limiting}

כאשר אתה בודק שקוד הגבלות הקצב עובד בצורה נכונה, היכולת להריץ זמן קדימה עוזרת. אם אתה משתמש ב-[`jest`](https://facebook.github.io/jest/) אתה יכול להשתמש ב-[`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) בשביל להריץ קדימה זמן. אם אתה משתמש ב-throttling עם `requestAnimationFrame` ייתכן שתמצא ש-[`raf-stub`](https://github.com/alexreardon/raf-stub) הוא כלי שימושי לשליטה בתקתוק הפריימים של אנימציות.
