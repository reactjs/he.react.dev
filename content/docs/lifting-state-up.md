---
id: lifting-state-up
title: הרמת ה-State למעלה
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

לעתים קרובות, מספר קומפוננטות צריכות לשקף את אותם נתונים משתנים. אנו ממליצים להרים את ה-state המשותף עד לאב הקדמון הקרוב ביותר. בואו נראה איך זה עובד.

בחלק זה, ניצור מחשבון טמפרטורה המחשב אם המים ירתחו בטמפרטורה נתונה.

נתחיל עם קומפוננטה שנקראת `BoilingVerdict`. היא מקבלת את הטמפרטורה ב-`celsius` בתור props, ומדפיסה אם הטמפרטורה מספיקה כדי להרתיח את המים:

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>המים ירתחו.</p>;
  }
  return <p>המים לא ירתחו.</p>;
}
```

לאחר מכן, ניצור קומפוננטה שנקראת `Calculator`. היא מרנדרת `<input>` המאפשר לכם להזין את הטמפרטורה, ושומר על הערך שלה ב-`this.state.temperature`.

בנוסף, היא מרנדרת את `BoilingVerdict` עבור ערך הקלט הנוכחי.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>הכנס טמפרטורה בצלזיוס:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## הוספת קלט שני {#adding-a-second-input}

הדרישה החדשה שלנו היא, בנוסף לקלט בצלזיוס, אנו מספקים קלט בפרנהייט, והם נשארים מסונכרנים.

אנחנו יכולים להתחיל על ידי חילוץ קומפוננטת `TemperatureInput` מתוך `Calculator`. אנו נוסיף אליה prop חדש `scale` שיכול להיות `"c"` או `"f"`:

```js{1-4,19,22}
const scaleNames = {
  c: 'צלזיוס',
  f: 'פרנהייט'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>הכנס טמפרטורה ב{scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

כעת אנו יכולים לשנות את `Calculator` כדי שירנדר שתי קלטי טמפרטורה נפרדים:

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

יש לנו שני קלטים עכשיו, אבל כאשר אתם מכניסים את הטמפרטורה באחד מהם, השני אינו מתעדכן. זה סותר את הדרישה שלנו: אנחנו רוצים לשמור אותם מסונכרנים.

אנחנו גם לא יכולים להציג את `BoilingVerdict` מ-`Calculator`. ה-`Calculator` אינו יודע את הטמפרטורה הנוכחית משום שהיא מוסתרת בתוך ה-`TemperatureInput`.

## כתיבת פונקציית המרה {#writing-conversion-functions}

ראשית, נכתוב שתי פונקציות כדי להמיר מצלזיוס לפרנהייט ובחזרה:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

שתי הפונקציות ממירות מספרים. נכתוב פונקציה אחרת שלוקחת מחרוזת `temperature` ופונקציית המרה כארגומנטים ומחזירה מחרוזת. נשתמש בה כדי לחשב את הערך של קלט אחד על סמך קלט אחר.

היא מחזירה מחרוזת ריקה עבור טמפרטורה (`temperature`) לא חוקית, והיא שומרת את הפלט מעוגל לספרה העשרונית השלישית לאחר הנקודה:

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

לדוגמה, `tryConvert('abc', toCelsius)` מחזיר מחרוזת ריקה, ו-`tryConvert('10.22', toFahrenheit)` מחזיר `'50.396'`.

## הרמת ה-State למעלה {#lifting-state-up}

כרגע, שתי קומפוננטות ה-`TemperatureInput` מחזיקות את הערך שלהן באופן עצמאי ב-state מקומי:

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

למרות זאת, אנחנו רוצים ששני הקלטים האלו יהיו מסונכרנים אחד עם השני. כאשר אנו מעדכנים את קלט צלזיוס, קלט פרנהייט צריך לשקף את הטמפרטורה המומרת, ואותו דבר בכיוון השני.

ב-React, שיתוף ה-state נעשה על ידי העברתו אל האב הקדמון המשותף הקרוב ביותר של הקומפוננטות הזקוקות לו. זה נקרא "הרמת ה-state למעלה". אנו נסיר את ה-state המקומי מ-`TemperatureInput` ולנעביר אותו לתוך `Calculator` במקום.

אם `Calculator` הוא הבעלים של ה-state המשותף, הוא הופך להיות "מקור האמת" ("source of truth") לטמפרטורה הנוכחית בשני הקלטים. זה יכול להנחות את שניהם להשתמש בערכים כך שיהיו עקביים אחד עם השני. מכיוון שה-props של שתי קומפוננטות `TemperatureInput` מגיעים מאותה קומפוננטת אב `Calculator`, שני הקלטים יהיו תמיד מסונכרנים.

בואו נראה איך זה עובד צעד אחר צעד.

ראשית, אנו מחליפים את `this.state.temperature` עם `this.props.temperature` בקומפוננטת `TemperatureInput`. לעת עתה, בואו נמשיך להעמיד פנים ש`this.props.temperature` כבר קיים, למרות שנצטרך להעביר אותו מ-`Calculator` בעתיד:

```js{3}
  render() {
    // קודם לכן: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

אנחנו יודעים ש-[props הם לקריאה בלבד](/docs/components-and-props.html#props-are-read-only). כאשר ה-`temperature` היה ב-state המקומי, ה-`TemperatureInput` יכל פשוט לקרוא ל-`this.setState()` כדי לשנות אותו. למרות זאת, עכשיו כאשר `temperature` מגיע מההורה בתור prop, ל-`TemperatureInput` אין שליטה עליו.

ב-React, זה בדרך כלל נעשה על ידי הפיכת קומפוננטה ל-"נשלטת". בדיוק כמו ב-DOM `<input>` מקבל גם `value` וגם prop של `onChange`, כך יכול גם ה-`TemperatureInput` המותאם אישית לקבל גם `temperature` וגם props של `onTemperatureChange` מההורה שלו `Calculator`.

עכשיו, שה-`TemperatureInput` רוצה לעדכן את הטמפרטורה שלו, הוא יקרא ל-`this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // קודם לכן: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>שימו לב:
>
>אין משמעות מיוחדת לשמות ה-props `temperature` או `onTemperatureChange` בקומפוננטות מותאמות אישית. יכולנו לקרוא להם כל דבר אחר, כמו לקרוא להם `value` ו-`onChange` שהיא קונבנציה נפוצה.

ה-prop `onTemperatureChange` יועבר יחד עם ה-prop `temperature` על ידי קומפוננטת ההורה `Calculator`. היא תטפל בשינוי על ידי שינוי ה-state המקומי שלה, ובכך תרנדר מחדש את שני הקלטים עם ערכים חדשים. אנו נסתכל על המימוש החדש של `Calculator` בקרוב מאוד.

לפני שנצלול לתוך השינויים ב-`Calculator`, בואו נסכם את השינויים שלנו לקומפוננטת `TemperatureInput`. הסרנו ממנו את ה-state המקומי, ובמקום לקרוא את `this.state.temperature`, אנחנו קוראים עכשיו את `this.props.temperature`. במקום לקרוא ל-`this.setState()` כאשר אנחנו רוצים לעשות שינוי, עכשיו אנחנו קוראים ל-`this.props.onTemperatureChange()`, אשר יסופק על ידי `Calculator`:

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>הכנס טמפרטורה ב{scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

עכשיו בואו נפנה לקומפוננטת `Calculator`.

אנו נשמור את הקלטים הנוכחיים `temperature` ו-`scale` ב-state המקומי שלה. זהו ה-state ש-"הרמנו" מהקלטים, והוא ישמש "מקור האמת" עבור שניהם. זהו ייצוג מינימלי של כל הנתונים שאנחנו צריכים לדעת על מנת לרנדר את שני הקלטים.

לדוגמה, אם נכניס 37 לתוך הקלט של צלזיוס, ה-state של קומפוננטת `Calculator` יהיה:

```js
{
  temperature: '37',
  scale: 'c'
}
```

אם מאוחר יותר נערוך את השדה פרנהייט כך שיהיה 212, ה-state של `Calculator` יהיה:

```js
{
  temperature: '212',
  scale: 'f'
}
```

היינו יכולים לאחסן את הערך של שני הקלטים אבל מסתבר שזה יהיה מיותר. זה מספיק לאחסן את הערך של הקלט האחרון שהשתנה, ואת המדד שהוא מייצג. לאחר מכן אנו יכולים להסיק את הערך של הקלט האחר בהתבסס על ערכי `temperature` ו-`scale` הנוכחיים בלבד.

הקלטים נשארים מסונכרנים מכיוון שהערכים שלהם מחושבים מאותו state:

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

עכשיו, לא משנה איזה קלט אתם עורכים, `this.state.temperature` ו-`this.state.scale` ב-`Calculator` מתעדכנים. אחד הקלטים מקבל את הערך כפי שהוא, ולכן כל קלט משתמש נשמר, וערך הקלט האחר תמיד מחושב מחדש על בסיס הערך.

בואו נסכם את מה שקורה בעת עריכת קלט:

* React קוראת לפונקציה שצוינה כ-`onChange` על ה-`<input>` ב-DOM. במקרה שלנו, זוהי המתודה `handleChange` בקומפוננטה `TemperatureInput`.
* המתודה `handleChange` בקומפוננטה `TemperatureInput` קוראת ל-`this.props.onTemperatureChange()` עם הערך הרצוי החדש. ה-props שלה, כולל `onTemperatureChange`, סופקו על ידי רכיב האב שלה, `Calculator`.
* כאשר הוא רונדר קודם לכן, `Calculator` ציין כי `onTemperatureChange` של `TemperatureInput` צלזיוס היא המתודה `handleCelsiusChange` של `Calculator`, ו-`onTemperatureChange` של `TemperatureInput` פרנהייט היא המתודה `handleFahrenheitChange` של `Calculator`. אז אחת משתי מתודות אלה של `Calculator` תקרא כתלות בקלט אשר ערכנו.
* בתוך המתודות הללו, הקומפוננטה `Calculator` מבקשת מ-React לרנדר מחדש את עצמה על ידי קריאה ל-`this.setState()` עם ערך הקלט החדש והמדד הנוכחי של הקלט שערכנו זה עתה.
* React קוראת למתודת `render` של קומפוננטת `Calculator`כדי ללמוד איך ממשק המשתמש צריך להיראות. הערכים של שני הקלטים מחושבים מחדש בהתאם לטמפרטורה הנוכחית ולמדד הפעיל. ההמרה של הטמפרטורה מבוצעת כאן.
* React קוראת למתודות `render` של כל אחת מקומפוננטות `TemperatureInput` עם ה-props החדשים שלהן שמצויינים על ידי `Calculator`. היא לומדת איך ממשק המשתמש שלהם צריך להיראות.
* React קוראת למתודת `render` של קומפוננטת `BoilingVerdict`, כשהיא מעבירה את הטמפרטורה בצלזיוס כ-props שלה.
* React DOM מעדכן את ה-DOM עם הכרעת מצב הרתיחה ועם התאמת הערכים הרצויים בקלט. הקלט שערכנו זה עתה מקבל את הערך הנוכחי שלו, והקלט האחר מתעדכן לטמפרטורה לאחר ההמרה.

כל עדכון עובר את אותם השלבים כך שהקלטים יישארו מסונכרנים.

## לקחים שנלמדו {#lessons-learned}

צריך להיות "מקור אמת" יחיד עבור כל נתון המשתנה באפליקציית React. בדרך כלל, ה-state מתווסף לראשונה לקומפוננטה הזקוקה לו. לאחר מכן, אם קומפוננטות אחרות גם צריכות אותו, אתם יכולים להרים אותו אל האב הקדמון המשותף הקרוב ביותר. במקום לנסות לסנכרן את ה-state בין קומפוננטות שונות, עליכם להסתמך על [זרימת הנתונים מלמעלה למטה](/docs/state-and-lifecycle.html#the-data-flows-down).

הרמת ה-state כרוכה יותר בכתיבת קוד "boilerplate" מאשר בגישות binding דו-כיווני, אך הרווח הוא שנדרשת פחות עבודה כדי לאתר ולבודד באגים. מאחר שכל state "חי" בתוך איזשהי קומפוננטה וקומפוננטה זו בלבד יכולה לשנות אותו, שטח הפנים לבאגים מופחת באופן משמעותי. בנוסף, באפשרותכם לממש כל לוגיקה מותאמת אישית כדי לדחות או לשנות קלט משתמש.

אם אנחנו יכולים לגזור משהו מה-props או מה-state, זה כנראה לא צריך להיות ב-state. לדוגמה, במקום לאחסן גם את `celsiusValue` וגם את `fahrenheitValue`, אנו מאחסנים רק את הטמפרטורה (`temperature`) האחרונה ואת המדד (`scale`) שלה. הערך של הקלט האחר יכול תמיד להיות מחושב מהם במתודה `render()`. זה מאפשר לנו לנקות או להחיל עיגול לשדה האחר מבלי לאבד כל דיוק בקלט המשתמש.

<<<<<<< HEAD
כאשר אתם רואים משהו שגוי בממשק המשתמש, תוכלו להשתמש ב[כלי הפיתוח של React](https://github.com/facebook/react/tree/master/packages/react-devtools) כדי לבדוק את ה-props ולעבור למעלה בעץ עד שתמצאו את הקומפוננטה האחראית לעדכון ה-state. זה מאפשר לכם לעקוב אחר הבאגים עד למקור שלהם:
=======
When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

<img src="../images/docs/react-devtools-state.gif" alt="מעקב אחר State ב-React DevTools" max-width="100%" height="100%">

