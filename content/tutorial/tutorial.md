---
id: tutorial
title: "מדריך: מבוא ל-React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

מדריך זה לא מחייב שום ידע קודם ב-React.

## לפני שאנחנו מתחילים במדריך {#before-we-start-the-tutorial} 

במהלך מדריך זה אנחנו נבנה משחק קטן , **יתכן שתתפתו לדלג עליו מכיוון שאינכם בונים משחקים -- אבל תנו לו סיכוי.** הטכניקות שתלמדו במדריך הם הבסיס לבניית ריאקט , 
והשליטה בהן תיתן לכם הבנה עמוקה בריאקט .

>טיפ
>
>מדריך זה מיועד לאנשים שמעדיפים **ללמוד תוך-כדי עשייה**. אם אתם מעדיפים ללמוד קונספט מלמטה למעלה, בדקו את [מדריך צעד-אחר-צעד](/docs/hello-world.html). יתכן שתמצאו את מבוא זה ואת המדריך כמשלימים אחד את השני.

מדריך זה מחולק למספר חלקים:

* [הכנה למדריך](#setup-for-the-tutorial) תיתן לכם **נקודת התחלה** להמשך המדריך.
* [סקירה כללית](#overview) תלמד אתכם את **היסודות** של React: components, props ו-state.
* [השלמת המשחק](#completing-the-game) בו תלמדו את **הטכניקות הנפוצות ביותר** בפיתוח React.
* [הוספת Time Travel](#adding-time-travel) ייתן לכם **תובנה עמוקה יותר** אל תוך החוזקות הייחודיות של React.

אין צורך להשלים את כל הסעיפים בבת אחת כדי לקבל את ערך ממדריך זה. נסו להגיע רחוק ככל שתוכלו -- גם אם זה רק חלק אחד או שניים.

### מה אנחנו בונים? {#what-are-we-building}

במדריך זה, אנו נראה כיצד לבנות משחק איקס-עיגול אינטראקטיבי עם React.

תוכלו לראות מה נבנה כאן: **[תוצאה סופית](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. אם הקוד אינו עושה לכם הגיון, או אם אינכם מכירים את תחביר הקוד, אל תדאגו! מטרתו של מדריך זה היא לעזור לכם להבין את React ואת התחביר שלה.

אנו ממליצים לכם לבדוק את משחק איקס-עיגול לפני שתמשיך עם הדרכה. אחת התכונות בהן תבחינו היא שיש רשימה ממוספרת בצד ימין של לוח המשחק. רשימה זו נותנת לכם היסטוריה של כל המהלכים שהתרחשו במשחק, והיא מתעדכנת עם התקדמות המשחק.

תוכלו לסגור את משחק האיקס-עיגול ברגע שאתם מבינים אותו. אנו מתחילים מתבנית פשוטה יותר במדריך זה. השלב הבא שלנו הוא לארגן אתכם כך שתוכלו להתחיל לבנות את המשחק.

### דרישות קדם {#prerequisites}

אנחנו יוצאים מנקודת הנחה שיש לכם היכרות כלשהי עם HTML ו-JavaScript, אבל אתם אמורים להיות מסוגלים לעקוב גם אם אתם באים משפת תכנות אחרת. נניח גם שאתם מכירים מושגים מעולם התכנות כמו פונקציות, אובייקטים, מערכים, ובמידה פחותה יותר, מחלקות.

אם עליך להתרענן ב-JavaScript, אנו ממליצים לקרוא את ה[מדריך הבא](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). שימו לב שאנו משתמשים גם בכמה תכונות מ-ES6 -- גרסה חדשה של JavaScript. במדריך זה, אנו משתמשים ב[פונקציות חץ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [מחלקות](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), והצהרות [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), ו-[`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). אתם יכולים להשתמש ב-[Babel REPL](babel://es5-syntax-example) כדי לבדוק לאיזה קוד מתקמפל קוד ה-ES6.

## הכנה למדריך {#setup-for-the-tutorial}

ישנן שתי דרכים להשלמת מדריך זה: באפשרותכם לכתוב את הקוד בדפדפן שלכם, או שתוכלו להגדיר סביבת פיתוח מקומית על המחשב שלכם.

### אפשרות התקנה 1: כתיבת קוד בדפדפן {#setup-option-1-write-code-in-the-browser}

זו הדרך המהירה ביותר כדי להתחיל!

תחילה פתחו את **[קוד ההתחלה הזה](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** בטאב חדש בדפדפן. הטאב החדש אמור להציג לוח משחק איקס-עיגול ריק וקוד React. אנו נערוך את קוד ה-React במדריך זה.

כעת באפשרותך לדלג על אפשרות ההתקנה השנייה וללכת אל הקטע [סקירה כללית](#overview) כדי לקבל סקירה כללית של React.

### אפשרות התקנה 2: סביבת פיתוח מקומית {#setup-option-2-local-development-environment}

זה אופציונלי לחלוטין ולא נדרש עבור מדריך זה!

<br>

<details>

<summary><b>אופציונלי: הוראות להתקדמות באמצעות עורך הטקסט המועדף עליכם מקומית</b></summary>

התקנה זו דורשת יותר עבודה, אבל מאפשר לכם להשלים את המדריך באמצעות עורך על פי בחירתכם. הנה השלבים אותם יש לבצע:

1. וודאו שיש ברשותכם גרסה עדכנית של [Node.js](https://nodejs.org/en/) מותקנת.
2. עקבו אחר [הוראות ההתקנה ליצירת אפליקציית React](/docs/create-a-new-react-app.html#create-react-app) כדי ליצור פרוייקט חדש.

```bash
npx create-react-app my-app
```

3. מחקו את כל הקבצים בתיקיית `src/` של הפרוייקט החדש 

> שימו לב:
>
>**אל תמחקו את כל תיקיית `src`, רק את קבצי המקור המקוריים בתוכה.** We'll החליפו את קבצי המקור המוגדרים כברירת מחדל עם הדוגמאות לפרויקט זה בשלב הבא.

```bash
cd my-app
cd src

# אם אתם משמשים במק או לינוקס:
rm -f *

# או, אם אתם משתמשים בווינדוס:
del *

# אז, חזרו לתיקיית הפרוייקט
cd ..
```

4. הוסיפו את הקובץ שנקרא `index.css` בתקיית `src/` עם [קוד ה-CSS הזה](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. הוסיפו את הקובץ שנקרא `index.js` בתקיית `src/` עם [קוד ה-JS הזה](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. הוסיפו את השורות הבאות בתחילת הקובץ `index.js` בתיקיית `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

כעת אם תריצו  `npm start` בתיקיית הפרוייקט ותפתחו את `http://localhost:3000` בדפדפן, אתם אמורים לראות לוח איקס-עיגול ריק.

אנו ממליצים לעקוב אחר [ההוראות האלו](https://babeljs.io/docs/editors/) כדי להגדיר הדגשת תחביר עבור העורך שלך.

</details>

### הצילו, אני תקוע! {#help-im-stuck}

אם אתם נתקעים, בדקו את [משאבי התמיכה בקהילה](/community/support.html). בפרט, [צ'אט Reactiflux](https://discord.gg/reactiflux) הוא דרך מצוינת לקבל עזרה במהירות. אם אתם לא מקבלים תשובה, או אם נשארתם תקועים, אנא שלחו לנו את הבעיה בה נתקלתם, ואנו נעזור לכם.

## סקירה כללית {#overview}

כעת שאתם מוכנים, בואו נקבל סקירה כללית של React!

### מה זה React? {#what-is-react}

React היא ספריית JavaScript הצהרתית, יעילה וגמישה של לבניית ממשקי משתמש. היא מאפשרת לייצר ממשקי משתמש מורכבים מחתיכות קטנות ומבודדות של קוד בשם קומפוננטות ("components").

ל-React יש מספר קומפוננטות שונות, אבל נתחיל מתת-המחלקה `React.Component`

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Example usage: <ShoppingList name="Mark" />
```

נגיע לתגיות המצחיקות שמזכירות XML בהמשך. אנו משתמשים בקומפוננטות כדי לומר ל-React מה אנחנו רוצים לראות על המסך. כאשר הנתונים שלנו ישתנו, React יעדכן וירנדר מחדש את הקומפוננטות שלנו.


כאן, ShoppingList היא **מחלקת קומפוננטת React**, או **מסוג קומפוננטת React**. קומפוננטה לוקחת פרמטרים, הנקראים `props` (פרופס, קיצור עבור "מאפיינים", properties), ומחזיר היררכיה של תצוגות (views) להצגה דרך המתודה `render`.

המתודה `render` מחזירה *תיאור* של מה שאתם רוצים לראות על המסך. React לוקחת את התיאור ומציגה את התוצאה. בפרט, `render` מחזירה **אלמנט React**, שהוא תיאור מופשט של מה שצריך לרנדר. רוב מפתחי React משתמשים בתחביר מיוחד בשם "JSX" שהופך את המבנים האלה לקלים יותר לכתיבה. התחביר `<div />`  משתנה בזמן הבנייה (build time) ל-`React.createElement('div')`. הדוגמה שלמעלה שקולה לקוד:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[ראו גרסה מורחבת מלאה.](babel://tutorial-expanded-version)

אם אתם סקרנים, `createElement()` מתוארת ביתר פירוט [במסמך ה-API](/docs/react-api.html#createelement), אך לא נשתמש בה במדריך זה. במקום זאת, נמשיך להשתמש ב-JSX.

JSX מגיעה עם מלוא העוצמה של JavaScript. תוכלו לשים *כל* ביטוי JavaScript בין סוגריים מסולסלים בתוך JSX. כל אלמנט React הוא אובייקט JavaScript שניתן לאחסן במשתנה או להעביר בתוך התוכנית שלך.

הקומפוננטה `ShoppingList` למעלה רק מרנדרת קומפוננטות מובנות ב-DOM כמו `<div />` ו-`<li />`. אבל ניתן לבנות ולרנדר קומפוננטות React מותאמות אישית באותו אופן. לדוגמה, כעת אנו יכולים להתייחס לקומפוננטת רשימת הקניות כולה על ידי כתיבת `<ShoppingList />`. כל קומפוננטת React היא מוכמסת (encapsulated) והיא יכולה לפעול באופן עצמאי; זה מאפשר לנו לבנות ממשקי משתמש מורכבים מקומפוננטות פשוטות.

### בדיקת קוד הבסיס {#inspecting-the-starter-code}

אם אתם מתכוונים לעבוד על המדריך **בדפדפן שלכם,** פתחו את הקוד הבא בטאב חדש: **[קוד בסיס](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. אם אתם הולכים לעבוד על המדריך **מקומית,** במקום זאת פתחו את `src/index.js` בתיקייה הפרויקט שלכם (כבר נגעתם בקובץ זה במהלך [ההתקנה](#setup-option-2-local-development-environment)).

קוד בסיס זה הוא הבסיס למה שאנחנו בונים. סיפקנו את קוד הסגנון (CSS) כך שאתם צריכים להתמקד רק בלמידת React ותכנות משחק האיקס-עיגול.

בעת בדיקת הקוד, תבחינו שיש לנו שלוש קומפוננטות React:

* ריבוע (Square)
* לוח (Board)
* משחק (Game)

קומפוננטת הריבוע מרנדרת `<button>` (כפתור) אחד והלוח מציג 9 ריבועים. קומפוננטת המשחק מרנדרת לוח עם ערכי שומרי מקום, שאותם נשנה מאוחר יותר. אין כרגע קומפוננטות אינטראקטיביות.

### העברת נתונים באמצעות Props {#passing-data-through-props}

כדי ללכלך את הידיים, בואו ננסה להעביר כמה נתונים מתוך קומפוננטת הלוח שלנו לקומפוננטת הריבוע שלנו.

אנו ממליצים בחום להקליד את הקוד ביד בזמן שאתם עוברים על המדריך ולא באמצעות העתק/הדבק. זה יעזור לכם לפתח זיכרון שריר והבנה חזקה יותר.

במתודת `renderSquare` של הלוח, שנו את הקוד על מנת להעביר את הערך שנקרא `value` לריבוע:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
```

שנו את מתודת `render` של ריבוע כדי להציג את הערך על-ידי החלפת `{/* TODO */}` עם `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

לפני:

![React Devtools](../images/tutorial/tictac-empty.png)

אחרי: אתם אמורים לראות מספר התוך כל אחד מהריבועים בפלט המוצג.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

מזל טוב! בדיוק "העברתם prop" מקומפוננטת האב לוח לקומפוננטת הבן ריבוע. העברת props היא הדרך בה זורם מידע באפליקציות React, מהורים לילדיהם.

### יצירת קומפוננטה אינטראקטיבית {#making-an-interactive-component}

בואו נמלא את הקומפוננטה ריבוע עם "X" כאשר אנו לוחצים עליה.
ראשית, שנו את תג הכפתור שמוחזר מפונקצית `render()` של קומפוננטת הריבוע לזה:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

אם תלחצו על ריבוע עכשיו, אתם אמורים לקבל התראה מהדפדפן שלכם.

>שימו לב
>
>כדי לחסוך בהקלדות ולהמנע מ[התנהגות מבלבלת של `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), אנחנו נשתמש ב[תחביר פונקציית חץ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) עבור פונקציות מנהלי אירועים מכאן והלאה:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>שימו לב איך עם `onClick={() => alert('click')}`, אנו מעבירים *פונקציה* בתור ה-prop `onClick`. React תקרא לפונקציה זו רק אחרי לחיצה. לשכוח את `() =>` ולכתוב רק `onClick={alert('click')}` היא טעות נפוצה, והיא תגרום להקפצת ההתראה בכל פעם שהקומפוננטה מתרנדרת מחדש.

בצעד הבא, אנחנו רוצים שהקומפוננטה ריבוע "תזכור" שהיא נלחצה, ותמלא את עצמה עם 
הסימן "X". כדי "לזכור" דברים, קומפוננטות משתמשות ב-**state (מצב)**.

קומפוננטות React יכולות להשתמש ב-state על ידי הגדרת `this.state` בבנאים (constructor) שלהם. `this.state` צריך להיחשב כפרטי לקומפוננטת ה-React שבה הוא מוגדר. בואו נאחסן את הערך הנוכחי של הריבוע ב-`this.state`, ונשנה אותו כאשר נלחץ על הריבוע.

תחילה, נוסיף בנאי למחלקה כדי לאתחל את ה-state.

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>שימו לב
>
>ב-[מחלקות של JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), עליכם תמיד לקרוא לפונקציה `super` בעת הגדרת בנאי של תת-מחלקה. בכל מחלקה של קומפוננטת React שיש לה `constructor` עליו להתחיל עם קריאה ל-`super(props)`.

כעת נשנה את מתודת `render` של ריבוע כך שתציג את הערך שמוגדר ב-state בעת לחיצה:

* החליפו את `this.props.value` עם `this.state.value` בתוך התגית `<button>`.
* החליפו את מנהל האירוע `onClick={...}` עם `onClick={() => this.setState({value: 'X'})}`.
* שימו את ה-props `className` ו-`onClick` בשורות נפרדות על מנת שתהיה לנו קריאות טובה יותר.

לאחר ביצוע שינויים אלה, תגית הכפתור `<button>` שמוחזרת ממתודת `render` של ריבוע אמורה להיראות כך:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

על ידי קריאה ל-`this.setState` מהאירוע `onClick` במתודה `render` של ריבוע, אנו אומרים ל-React לרנדר מחדש את ריבוע זה בכל פעם שהכפתור `<button>` שלו נלחץ. לאחר העדכון, הערך `this.state.value` של הריבוע יהיה `'X'`, כך שנראה את ה-`X` על לוח המשחק. אם תלחצו על כל אחד מהריבועים, `X` אמור להופיע.

כאשר אנו קוראים ל-`setState` בקומפוננטה כלשהי, React מעדכנת אוטומטית גם את קומפוננטות הבנים בתוכה.

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### כלי פיתוח {#developer-tools}

התוסף React Devtools עבור [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) ו-[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) מאפשר לכם לבדוק עץ קומפוננטות של React עם כלי הפיתוח של הדפדפן שלכם.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

ה-React DevTools מאפשר לכם לבדוק את ה-`props` וה-`state` של קומפוננטות ה-React שלכם.

לאחר התקנת React DevTools, באפשרותכם ללחוץ לחיצה ימנית על כל אלמנט בדף, ללחוץ על "בדוק" ("Inspect") כדי לפתוח את כלי הפיתוח, והכרטיסיות React("⚛️ Components" ו- "⚛️ Profiler") יופיעו כאחרונות מימין. השתמש ב-"⚛️ Components" על מנת לבדוק(inspect) את עץ הקומפוננטות.

**עם זאת, שימו לב כי ישנם כמה צעדים נוספים כדי לגרום לזה לעבוד עם CodePen:**

1. היכנסו או הירשמו ואשרו את הדוא"ל שלכם (נדרש כדי למנוע דואר זבל).
2. לחצו על הלחצן "פצל" ("Fork").
3. לחצו על "שנה תצוגה" ("Change View") ולאחר מכן בחרו "מצב דיבאג" ("Debug mode").
4. בכרטיסייה החדשה שנפתחת, ל-devtools כעת אמורה להיות הכרטיסייה React.

## השלמת המשחק {#completing-the-game}

עכשיו יש לנו את אבני הבניין הבסיסיים שלנו למשחק האיקס-עיגול. כדי לקבל משחק שלם, עכשיו אנחנו צריכים להחליף לסירוגין בין השמת "X"-ים ו-"O"-ים על הלוח, ואנחנו צריכים דרך כדי לקבוע את הזוכה.

### הרמת ה-State למעלה {#lifting-state-up}

נכון לעכשיו, כל קומפוננטת ריבוע שומרת על מצב המשחק. כדי לבדוק מי הזוכה, נשמור על הערך של כל אחד מ-9 הריבועים במקום אחד.

אנחנו יכולים לחשוב כי הלוח צריך רק לשאול כל ריבוע על ה-state שלו. למרות שגישה זו אפשרית ב-React, אנו נרתעים ממנה משום ששימוש בה הופך את הקוד להיות קשה להבנה, רגיש לבאגים וקשה לשכתוב. במקום זאת, הגישה הטובה יותר היא לאחסן את ה-state של המשחק בקומפוננטת האב לוח במקום בכל ריבוע. קומפוננטת הלוח יכולה להגיד לכל ריבוע מה להציג על ידי העברת prop, [בדיוק כמו שעשינו כאשר העברנו מספר לכל ריבוע](#passing-data-through-props).

**כדי לאסוף נתונים ממספר ילדים, או כדי לאפשר לשני קומפוננטות ילדים לתקשר אחת עם השניה, עלינו להכריז על state משותף בקומפוננטת האב שלהם במקום. קומפוננטת האב יכולה להעביר את ה-state שלה בחזרה לילדים באמצעות שימוש ב-props; פעולה זו שומרת על קומפוננטות הילדים מסונכרנות זו עם זו ועם קומפוננטת האב.**

הרמת ה-state לקומפוננטת האב היא פעולה נפוצה כאשר משכתבים קומפוננטות React -- בואו ניקח הזדמנות זו כדי לנסות זאת.

הוסיפו בנאי ללוח וקבעו את ה-state הראשוני של הלוח כך שיכיל מערך עם 9 ערכים ריקים (nulls) התואמים ל-9 הריבועים:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }
```

כאשר נמלא את הלוח בשלב מאוחר יותר, המערך `this.state.squares` ייראה כמו משהו כזה:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

מתודת "renderSquare" של הלוח כרגע נראית כך:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

בתחילה, [העברנו את props ה-`value` למטה](#passing-data-through-props) מהלוח כדי להראות מספרים מ-0 ועד 8 בכל ריבוע. בשלב קודם שונה, החלפנו את המספרים עם סימן "X" [שנקבע על ידי ה-state של ריבוע עצמו](#making-an-interactive-component). זו הסיבה שריבוע מתעלם כעת מהערך `value` שהלוח מעביר אליו.

כעת נשתמש במנגנון העברת ה-props שוב. אנו נשנה את הלוח כדי להורות לכל ריבוע בן באופן אינדיבידואלי על הערך הנוכחי שלו (`"X"`, `"O"`, או `null`). כבר הגדרנו את מערך הריבועים `squares` בבנאי הלוח, ואנו נשנה את מתודת `renderSquare` של הלוח כדי לקרוא ממנו:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

כל ריבוע יקבל כעת props `value` אשר יהיה אחד מן הערכים `'X'`, `'O'`, או `null` עבור ריבועים ריקים.

כעת, אנחנו צריכים לשנות את מה שקורה כאשר ריבוע כלשהו נלחץ. קומפוננטת הלוח עכשיו שומרת אילו ריבועים מולאו. אנחנו צריכים ליצור דרך לריבוע לעדכן את ה-state של הלוח. מאחר שה-state נחשב פרטי לקומפוננטה המגדירה אותו, אין באפשרותנו לעדכן את ה-state של הלוח ישירות מהריבוע.

במקום זאת, נעביר למטה פונקציה מהלוח לריבוע, ונדאג לכך שריבוע יקרא לפונקציה זו כאשר הריבוע נלחץ. נשנה את המתודה `renderSquare` בלוח למתודה הבאה:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>שימו לב
>
>אנו מחלקים את האלמנט שהוחזר למספר שורות לשיפור הקריאות, ומוסיפים סוגריים כדי ש-JavaScript לא תוסיף נקודה-פסיק לאחר ה-`return` ותשבור את הקוד שלנו.

עכשיו אנחנו מעבירים למטה שני props מהלוח לריבוע: `value` ו-`onClick`. ה-props `onClick` היא פונקציה שאליה יכול ריבוע לקרוא כאשר לוחצים עליו. נערוך את השינויים הבאים בריבוע:

* נחליף את `this.state.value` עם `this.props.value` במתודת `render` של ריבוע
* נחליף את `this.setState()` עם `this.props.onClick()` במתודת `render` של ריבוע
* נמחק את הבנאי `constructor` מריבוע מכיון שריבוע כבר לא עוקב אחר ה-state של המשחק

לאחר ביצוע שינויים אלו, קומפוננטת הריבוע נראה כך:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

כאשר לוחצים על ריבוע, נקראת פונקציית `onClick` שמסופקת על ידי הלוח. הנה סקירה של איך התנהגות זו מושגת:

1. ה-prop `onClick` בקומפוננטה המובנה של ה-DOM `<button>` גורם ל-React להגדיר מאזין לאירועי לחיצות.
2. כאשר לוחצים על הכפתור, React יקרא למטפל האירועים `onClick` המוגדר במתודה `render()` של ריבוע.
3. מטפל אירוע זה קורא ל-`this.props.onClick()`. ה-props `onClick` של ריבוע הוגדר על ידי הלוח.
4. מאחר שהלוח העביר את `onClick={() => this.handleClick(i)}` לריבוע, הריבוע קורא ל-`this.handleClick(i)` בעת לחיצה עליו.
5. עדיין לא הגדרנו את המתודה `handleClick()`, ולכן שהקוד שלנו קורס. אם תלחצו על ריבוע עכשיו, אתם אמורים לראות מסך שגיאה אדום שאומר משהו כמו "this.handleClick is not a function".

>שימו לב
>
>לתכונה `onClick` של אלמנט `<button>` של ה-DOM יש משמעות מיוחדת עבור React מכיוון שהיא קומפוננטה מובנה. עבור קומפוננטות מותאמות אישית כמו ריבוע, הגדרת השמות תלויה בנו. אנו יכולים להגדיר כל שם ל-prop `onClick` של ריבוע או למתודת `handleClick` של לוח, והקוד יעבוד באותו אופן. ב-React, זוהי קונבנציה להשתמש בשמות כמו `on[Event]` עבור props אשר מייצגים אירועים ו-`handle[Event]` עבור המתודות אשר מטפלות באירועים.

כאשר אנו מנסים ללחוץ על ריבוע, אנחנו אמורים לקבל שגיאה כי עדיין לא הגדרנו את `handleClick`. כעת נוסיף את `handleClick` למחלקה לוח:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

לאחר ביצוע שינויים אלה, נוכל שוב ללחוץ על הריבועים כדי למלא אותם, כפי שיכלנו קודם. למרות זאת, כעת ה-state מאוחסן בקומפוננטת הלוח במקום בקומפוננטות הריבועים עצמם. כאשר ה-state של הלוח משתנה, קומפוננטות הריבוע מרונדרות מחדש באופן אוטומטי. שמירת מצב כל הריבועים בקומפוננטת הלוח תאפשר לו לקבוע את הזוכה בעתיד.

מאחר שקומפוננטות הריבוע אינן מתחזקות state יותר, קומפוננטות הריבוע מקבלות ערכים מקומפוננטת הלוח ומעדכנות את קומפוננטת הלוח כאשר לוחצים עליהן. במונחי React, קומפוננטות הריבוע הן כעת **קומפוננטות מבוקרות**. הלוח הוא בעל שליטה מלאה עליהן.

שימו לב כיצד ב-`handleClick` אנו קוראים ל-`.slice()` כדי לייצר עותק של מערך `squares` על מנת לשנותו במקום לשנות את המערך הקיים. נסביר מדוע אנו יוצרים עותק של מערך `squares` בחלק הבא.

### מהי החשיבות של אי-יכולת השתנות  {#why-immutability-is-important}

בדוגמת הקוד הקודמת, הצענו להשתמש במתודה `.slice()` כדי ליצור עותק של מערך `squares` על מנת להעתיקו במקום לשנות את המערך הקיים. כעת נדון באי-יכולת השתנות (Immutability) ומדוע חשוב ללמוד על אי-יכולת השתנות.

יש בדרך כלל שתי גישות לשינוי נתונים. הגישה הראשונה היא *לשנות* את הנתונים על ידי שינוי ישיר של ערכי הנתונים. הגישה השנייה היא להחליף את הנתונים עם עותק חדש שבו יש את השינויים הרצויים.

#### שינוי נתונים עם מוטציה {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### שינוי נתונים ללא מוטציה {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

התוצאה הסופית היא זהה, אך על ידי העתקה ללא מוטציה (או שינוי הנתונים הבסיסיים) ישירות, אנו מרוויחים מספר יתרונות המתוארים בהמשך.

#### פיצ'רים מורכבים הופכים לפשוטים {#complex-features-become-simple}

אי-יכולת השתנות הופכת פיצ'רים מורכבים להרבה יותר קלים ליישום. מאוחר יותר במדריך זה, נוכל ליישם פיצ'ר של "נסיעה בזמן" ("time travel") המאפשר לנו לסקור את היסטוריית משחק האיקס-עיגול ו"לקפוץ בחזרה" למהלכים קודמים במשחק. פונקציונליות זו אינה ספציפית למשחקים -- היכולת לבטל ולבצע מחדש פעולות מסוימות היא דרישה נפוצה בתוכנות. הימנעות ממוטציה ישירה של נתונים מאפשרת לנו לשמור על גירסאות קודמות של היסטוריית המשחק ללא שינוי, ולהשתמש בהן שוב במועד מאוחר יותר.

#### זיהוי שינויים {#detecting-changes}

זיהוי שינויים באובייקטים משתנים היא קשה מכיוון שהם משתנים ישירות. זיהוי זה מחייב את האובייקט המשתנה להיות מושווה לעותקים קודמים של עצמו ומעבר על עץ האובייקט כולו.

זיהוי שינויים באובייקטים בלתי ניתנים לשינוי הוא הרבה יותר קל. אם האובייקט הבלתי משתנה שאליו אנחנו מתייחסים שונה מהקודם, אזי האובייקט השתנה.

#### ההחלטה מתי לרנדר מחדש ב-React {#determining-when-to-re-render-in-react}

היתרון העיקרי של אי-יכולת השתנות הוא שהיא עוזר לנו לבנות _קומפוננטות טהורות (pure components)_ ב-React. נתונים בלתי ניתנים לשינוי מאפשרים לקבוע בקלות אם בוצעו שינויים, דבר אשר מסייע לקבוע מתי קומפוננטה דורשת רינדור מחדש.

אתם יכולים ללמוד עוד על `shouldComponentUpdate()` וכיצד ניתן לבנות *קומפוננטות טהורות* על ידי קריאת [אופטימיזציה של ביצועים](/docs/optimizing-performance.html#examples).

### קומפוננטות פונקציה {#function-components}

כעת נשנה את הריבוע כך שיהיה **קומפוננטת פונקציה (function component)**.

ב-React, **קומפוננטות פונקציה** הן דרך פשוטה יותר לכתוב קומפוננטות המכילות רק מתודת `render` ואין להן state משלהן. במקום להגדיר מחלקה המרחיבה את `React.Component`, אנו יכולים לכתוב פונקציה שמקבלת `props` כקלט ומחזירה את מה שצריך להיות מרונדר. קומפוננטות פונקציה הן פחות מייגעות לכתיבה מאשר מחלקות, וקומפוננטות רבות יכולות לבוא לידי ביטוי בדרך זו.

החליפו את מחלקת ריבוע בפונקציה הבאה:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

החלפנו את `this.props` ב-`props` בשתי הפעמים שהוא מופיע.

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>שימו לב
>
>כאשר שינינו את הריבוע והפכנו אותו לקומפוננטת פונקציה, שינינו גם את `onClick={() => this.props.onClick()}` לגירסה קצרה יותר `onClick={props.onClick}` (שימו לב לחיסרון בסוגריים *משני* הצדדים).

### חלוקה לתורות {#taking-turns}

עכשיו אנחנו צריכים לתקן פגם ברור במשחק האיקס-עיגול שלנו: ה-"O"ים לא יכולים להיות מסומנים על הלוח.

אנו נקבע את המהלך הראשון להיות "X" כברירת מחדל. אנו יכולים להגדיר את ברירת המחדל הזו על ידי שינוי ה-state ההתחלתי בבנאי הלוח שלנו:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

בכל פעם ששחקן מבצע מהלך, `xIsNext` (בוליאני) יתהפך כדי לקבוע איזה שחקן משחק בתור הבא ומצב המשחק יישמר. אנו נעדכן את הפונקציה `handleClick` של הלוח כדי להפוך את הערך של `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

עם שינוי זה, "X"ים ו"O"ים יכולים להתחלף בתורות. נסו זאת!
 
 בואו נשנה גם את טקסט שורת המצב (ה-"status") בפונקציית `render` של הלוח כך שתציג איזה שחקן משחק את התור הבא:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // ההמשך לא השתנה
```

לאחר החלת שינויים אלה, קומפוננטת הלוח שלכם אמורה להיראות כך:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### הכרזת הזוכה {#declaring-a-winner}

עכשיו שאנחנו כבר מראים איזה שחקן הבא בתור, אנחנו צריכים להראות גם כאשר המשחק הסתיים ואין יותר תורות לעשות. העתיקו את פונקצית העזר הבאה והדביקו אותה בסוף הקובץ:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

בהינתן מערך של 9 ריבועים, פונקציה זו תבדוק מי הזוכה ותחזיר `'X'`, `'O'`, או `null` בהתאמה.

נקרא לפונקציה `calculateWinner(squares)` מתוך הפונקציה `render` של הלוח כדי לבדוק אם שחקן זכה. אם שחקן זכה, אנו יכולים להציג טקסט כגון "הזוכה: X" או "הזוכה: O". אנו מחליפים את הצהרת "שורת המצב" (`status`) בפונקציה `render` של הלוח באמצעות קוד זה:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

כעת אנו יכולים לשנות את הפונקציה `handleClick` של הלוח כדי שתחזור מהר יותר על ידי התעלמות מקליק אם מישהו זכה במשחק או אם ריבוע כבר מלא:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

מזל טוב! עכשיו יש לנו משחק איקס-עיגול עובד. וזה עתה גם למדתם את היסודות של React. אז *אתם* כנראה המנצחים האמיתיים כאן.

## הוספת מסע בזמן {#adding-time-travel}

בתור תרגיל אחרון, בואו נאפשר "לחזור אחורה בזמן" (time travel) למהלכים הקודמים במשחק.

### אחסון היסטוריה של מהלכים {#storing-a-history-of-moves}

אם היינו משנים ערכים במערך `squares`, יישום הנסיעה בזמן היה קשה מאוד.

לעומת זאת, מאחר שהשתמשנו ב-`slice()` כדי ליצור עותק חדש של מערך הריבועים `squares` לאחר כל מהלך, ו[התייחסנו אליו כבלתי ניתן לשינוי](#why-immutability-is-important). הדבר יאפשר לנו לאחסן כל גרסה קודמת של מערך הריבועים `squares`, ולנווט בין התורות שכבר התרחשו.

נשמור את מערכי הריבועים `squares` הקודמים במערך אחר שלו נקרא היסטוריה (`history`). מערך ההיסטוריה מייצג את כל מצבי הלוח, מהצעד הראשון ועד האחרון, ויש לו צורה כזאת:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

עכשיו אנחנו צריכים להחליט איזה קומפוננטה צריכה להיות הבעלים של הסטוריית המצב (`history`).

### הרמת ה-State למעלה, שוב {#lifting-state-up-again}

נרצה שקומפוננטת המשחק ברמה העליונה ביותר תציג רשימה של מהלכים קודמים. היא תזדקק לגישה למשתנה ההיסטוריה `history` כדי לעשות זאת, לכן נציב את היסטוריית המצבים `history` בקומפוננטת המשחק ברמה העליונה.

הצבת מצב ההיסטוריה `history` בקומפוננטת המשחק מאפשרת לנו להסיר את מצב הריבועים `squares` מהבן שלה, קומפוננטת הלוח. בדיוק כמו ש["הרמנו את ה-state למעלה"](#lifting-state-up) מקומפוננטת הריבוע לתוך קומפוננטת הלוח, עכשיו נרים אותו מהלוח לתוך הרמה העליונה שהיא קומפוננטת המשחק. זה נותן לקומפוננטת המשחק שליטה מלאה בנתוני הלוח, ומאפשר לה להנחות את הלוח לרנדר תורים קודמים ממתוך ההיסטוריה `history`.

ראשית, עלינו להגדיר את ה-state הראשוני של קומפוננטת המשחק בתוך הבנאי שלה:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

הדבר הבא שיהיה עלינו לעשות הוא לדאוג שקומפוננטת הלוח תקבל את props הריבועים (`squares`) ו-`onClick` מקומפוננטת המשחק. מכיוון שיש לנו כעת מנהל אירוע לחיצה יחיד בלוח עבור מספר רב של ריבועים, נצטרך להעביר את המיקום של כל ריבוע לתוך מנהל האירוע `onClick` כדי לציין איזה ריבוע נלחץ. לפניכם השלבים הנדרשים כדי לשנות את קומפוננטת הלוח:

* מחיקת הבנאי `constructor` מהלוח.
* החלפת `this.state.squares[i]` ב-`this.props.squares[i]` בפונקציית `renderSquare` של הלוח.
* החלפת `this.handleClick(i)` ב-`this.props.onClick(i)` בפונקציית `renderSquare` של הלוח.

קומפוננטת הלוח נראית עכשיו כך:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

אנו נעדכן את הפונקציה `render` של קומפוננטת המשחק כך שתשתמש בערך ההיסטוריה העדכני ביותר כדי לקבוע ולהציג את מצב המשחק:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

מאחר שקומפוננטת המשחק מרנדרת עכשיו את מצב המשחק, אנו יכולים להסיר את הקוד התואם ממתודת `render` של הלוח. לאחר שכתוב הקוד, הפונקציה `render` של הלוח נראית כך:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

לסיום, אנחנו צריכים להעביר את המתודה `handleClick` מקומפוננטת הלוח אל קומפוננטת המשחק. אנחנו צריכים גם לשנות את `handleClick` כי ה-state של קומפוננטת המשחק הוא בעל מבנה בצורה שונה. בתוך מתודת `handleClick` של המשחק, אנו משרשרים ערכי היסטוריה חדשים לתוך ההיסטוריה `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>שימו לב
>
>שלא כמו המתודה `push()` של מערך שיתכן שאתם מכירים טוב יותר, המתודה `concat()` אינה משנה את המערך המקורי, לכן אנו מעדיפים אותה.

בשלב זה, קומפוננטת הלוח צריכה רק את מתודות ה-`renderSquare` ו-`render`. ה-state של המשחק והמתודה `handleClick` צריכים להיות בקומפוננטת המשחק.

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### הצגת המהלכים הקודמים {#showing-the-past-moves}

מכיוון שאנו מקליטים את ההיסטוריה של משחק האיקס-עיגול, אנו יכולים כעת להציג אותה לשחקן כרשימה של מהלכים קודמים.

למדנו מוקדם יותר כי קומפוננטות React הן אובייקטי JavaScript מדרגה ראשונה; אנחנו יכולים להעביר אותם בין מחלקות ופונקציות ביישומים שלנו. כדי לרנדר פריטים מרובים ב- React, אנו יכולים להשתמש במערך של קומפוננטות React.

ב-JavaScript, למערכים יש את [`מתודת map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) אשר נעשה בה שימוש לעתים קרובות כדי למפות מידע למידע אחר, למשל:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

על ידי שימוש במתודה `map`, אנו יכולים למפות את היסטוריית המהלכים שלנו לקומפוננטות React המייצגות לחצנים על המסך, ולהציג רשימה של לחצנים כדי "לקפוץ" למהלכים קודמים.

בואו נמפה בעזרת `map` את ההיסטוריה `history` במתודה `render` של המשחק:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

עבור כל מהלך בהיסטוריית משחק האיקס-עיגול, אנו יוצרים פריט רשימה `<li>` המכיל כפתור `<button>`. לכפתור יש מנהל אירוע `onClick` אשר קורא למתודה הנקראת `this.jumpTo()`. לא יישמנו את המתודה `jumpTo()` עדיין. לעת עתה, אנחנו צריכים לראות רשימה של המהלכים שהתרחשו במשחק ואזהרה במסוף כלי הפיתוח (developer tools console) שאומרת:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

תרגום:

>  אזהרה:
>  כל ילד במערך או איטרטור צריך להיות בעל "מפתח" ייחודי. בדוק את מתודת רנדר של "משחק".

בואו נדבר על משמעות האזהרה למעלה.

### בחירת מפתח {#picking-a-key}

כאשר אנו מרנדרים רשימה, React מאחסן מידע על כל פריט רשימה שרונדר. כאשר אנו מעדכנים רשימה, React צריכה לקבוע מה השתנה. יכולנו להוסיף, להסיר, לסדר מחדש או לעדכן את הפריטים ברשימה.

תארו לעצמכם מעבר ממצב

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

למצב

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

בנוסף לספירות המעודכנות, בן-אדם שקורא קוד זה בוודאי יגיד שהחלפנו את הסדר של אלקסה ובן והכניסנו את קלאודיה בין אלקסה ובן. לעומת זאת, React היא תוכנת מחשב ואינה יודעת מה התכוונו. מכיוון ש-React אינה יכולה לדעת את כוונותינו, אנו צריכים לציין props *מפתח (key)* עבור כל פריט ברשימה כדי להבדיל כל פריט רשימה מהאחים שלו. אפשרות אחת היא להשתמש במחרוזות `alexa`, `ben`, `claudia`. אם היינו מציגים נתונים ממסד נתונים, היינו יכולים להשתמש במזהי מסד הנתונים של Alexa, Ben ו-Claudia.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

כאשר רשימה מרונדרת מחדש, React לוקחת כל מפתח של פריט ברשימה ומחפשת עבור מפתח תואם בפריטים ברשימה הקודמת. אם הרשימה הנוכחית כוללת מפתח שלא היה קיים קודם לכן, React יוצרת קומפוננטה חדשה. אם ברשימה הנוכחית חסר מפתח שהיה קיים ברשימה הקודמת, React משמידה את הקומפוננטה הקודמת. אם שני מפתחות תואמים, הקומפוננטה המתאימה מועברת. מפתחות מספרים ל-React על הזהות של כל קומפוננטה, דבר המאפשר ל-React לשמור על ה-state בין רינדורים מחדש. אם מפתח של קומפוננטה משתנה, הקומפוננטה תושמד ותיווצר מחדש עם state חדש.

ה-props `key` (מפתח) הוא props מיוחד ושמור ב- React (יחד עם `ref`, תכונה מתקדמת יותר). כאשר נוצר אלמנט, React מחלץ את ה-props `key` ומאחסן את המפתח ישירות על האלמנט המוחזר. למרות ש-`key` נראה כאילו הוא שייך ל-`props`, לא ניתן לפנות אל `key` באמצעות `this.props.key`. React משתמשת אוטומטית ב-`key` כדי להחליט אילו קומפוננטות לעדכן. קומפוננטה לא תוכל לתשאל על ה-`key` שלה.

**מומלץ מאוד להקצות מפתחות הולמים בכל פעם שאתם בונה רשימות דינמיות.** אם אין לכם מפתח הולם, מומלץ לשקול ארגון מחדש של הנתונים שלכם כך שיהיו לכם כאלו.

אם לא צוין מפתח, React תציג אזהרה ותשתמש באינדקס של המערך כמפתח כברירת מחדל. שימוש באינדקס המערך כמפתח הוא בעייתי בעת ניסיון לבצע סידור מחדש של פריטי רשימה או הוספה/הסרה של פריטי רשימה. הגדרת `key={i}` במפורש משתיקה את האזהרה אבל משאירה את אותן בעיות כמו אינדקסים של מערך והיא לא מומלצת ברוב המקרים.

מפתחות לא צריכים להיות ייחודיים גלובלית; הם רק צריכים להיות ייחודיים בין קומפוננטות לבין האחים שלהן.


### מימוש מסע בזמן {#implementing-time-travel}

בהיסטוריה של משחק האיקס-עיגול, לכל מהלך קודם יש מזהה ייחודי הקשור אליו: זהו המספר הסידורי של המהלך. המהלכים לעולם אינם מסודרים מחדש, נמחקים, או מוכנסים באמצע, לכן בטוח להשתמש באינדקס המהלך כמפתח.

במתודת `render` של קומפוננטת המשחק, נוכל להוסיף את המפתח כ-`<li key={move}>` והאזהרה של React בנוגע למפתחות אמורה להיעלם:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

לחיצה על כל אחד מכפתורי פריטי הרשימה זורקת שגיאה מכיוון שמתודת `jumpTo` אינה מוגדרת. לפני שאנו מיישמים את `jumpTo`, נוסיף את מספר התור `stepNumber` ל-state של קומפוננטת המשחק כדי לציין באיזה צעד אנו צופים כעת.

ראשית, הוסיפו את `stepNumber: 0` ל-state ההתחלתי בבנאי של המשחק:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

בשלב הבא, נגדיר את מתודת `jumpTo` במשחק כדי לעדכון את מספר הצעד `stepNumber`. בנוסף נקבע את `xIsNext` ל-`true` אם המספר שאנו משנים את `stepNumber` להיות הוא זוגי:

```javascript{5-10}
  handleClick(i) {
    // המתודה לא השתנתה
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // המתודה לא השתנתה
  }
```

כעת נערוך מספר שינויים במתודת `handleClick` של המשחק אשר נקראת כאשר השחקן לוחץ על ריבוע.

מצב `stepNumber` שהוספנו משקף את המהלך המוצג למשתמש כעת. לאחר שנעשה מהלך חדש, עלינו לעדכן את `stepNumber` על-ידי הוספת `stepNumber: history.length` כחלק מהארגומנטים של `this.setState`. זה מבטיח שאנחנו לא נתקע כשאנחנו מראים את אותו מהלך אחרי שמהלך חדש כבר בוצע.

בנוסף נחליף את הקריאה מ-`this.state.history` עם `this.state.history.slice(0, this.state.stepNumber + 1)`. זה מבטיח שאם אנחנו "חוזרים אחורה בזמן" ולאחר מכן עושים מהלך חדש מנקודה זו, אנו זורקים את כל ההיסטוריה "העתידית" שעכשיו תיהפך לשגויה.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

לסיום, נשנה את מתודת `render` של קומפוננטת המשחק מרינדור קבוע של המהלך האחרון לרינדור של המהלך שבחור כעת לפי `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

אם נלחץ על כל צעד בהיסטורית המשחק, לוח האיקס-עיגול צריך להתעדכן באופן מיידי כדי להראות איך הלוח נראה לאחר שצעד זה התרחש.

**[צפו בקוד המלא עד נקודה זו](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### לסיום {#wrapping-up}

ברכותינו! יצרתם משחק איקס-עיגול אשר:

* מאפשר לכם לשחק איקס-עיגול,
* מציין מתי ששחקן ניצח במשחק,
* שומר הסטוריית משחק ככל שהמשחק מתקדם,
* מאפשר לשחקנים לסקור את היסטוריית המשחק ולראות גרסאות קודמות של לוח המשחק.

עבודה טובה! אנו מקווים כי עכשיו אתם מרגישים שיש לכם הבנה טובה על איך עובד React.

בדקו את התוצאה הסופית כאן: **[תוצאה סופית](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

אם יש לכם זמן נוסף או שתרצו לתרגל את מיומנויות React החדשות שלכם, הנה כמה רעיונות לשיפורים שאתם יכולים לעשות למשחק האיקס-עיגול אשר מוצגים בסדר קושי עולה:

1. הציגו את המיקום עבור כל מהלך בתבנית (עמודה, שורה) ברשימת ההיסטוריה של המהלכים.
2. הדגישו את הפריט שבחור כעת ברשימת המהלכים.
3. שכתבו את הלוח כך שישתמש בשתי לולאות כדי לייצר את הריבועים במקום שיהיו כתובים בקידוד קשיח (hardcoded).
4. הוספת כפתור "החלפה" המאפשר למיין את המהלכים בסדר עולה או יורד.
5. כאשר מישהו זוכה, הדגישו את שלושת הריבועים שגרמו לניצחון.
6. כאשר אין זוכה, הציגו הודעה על כך שהתוצאה היא תיקו.

במהלך מדריך זה, נגענו בקונספטים של React כולל אלמנטים, קומפוננטות, props, ו-state. לקבלת הסבר מפורט יותר על כל אחד מהנושאים הללו, עיינו ב[שאר התיעוד](/docs/hello-world.html). כדי ללמוד עוד אודות הגדרת קומפוננטות, עיינו ב-[`React.Component` API reference](/docs/react-component.html).
