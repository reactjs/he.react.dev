---
id: rendering-elements
title: ציור אלמנטים
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

אלמנטים הם אבן הבניין הקטנה ביותר של אפליקציות ריאקט

אלמנט מתאר מה רוצים להציג במסך:

```js
const element = <h1>Hello, world</h1>;
```

Unlike browser DOM elements, React elements are plain objects, and are cheap to create. React DOM takes care of updating the DOM to match the React elements.
שלא כמו אלמנטים של DOM, אלמנטים של ריאקט הם אובייקטים פשוטים, ויצירתם אינה דורשת משאבים רבים. React DOM מטפל בעדכון הDOM על מנת להתאים אותם לאלמנטים של ריאקט.

>**:הערה**
>
>ניתן להתבלבל בין אלמנטים לבין הקונספט הידוע של קומפוננטות. נציג את רעיון הקומפוננטות [בפרק הבא](/docs/components-and-props.html). אלמנטים הם המרכיבים שמהם עשויות קומפוננטות ואנחנו מעודדים לקרוא פרק זה לפני שממשיכים הלאה.

## ציור אלמנטים לתוך הDOM {#rendering-an-element-into-the-dom}
נניח שיש `<div>` במקום כלשהו בקובץ HTML:

```html
<div id="root"></div>
```

אנחנו מכנים זאת כקודקוד DOM שורשי מכיוון שכל מה שהוא מכיל ינוהל על ידי React DOM.

בדרך כלל, אפליקציות הנבנות עם ריאקט הן בעלות קודקוד DOM שורשי אחד. במידה ואתה משלב את ריאקט לתוך אפליקציה קיימת, אתה יכול להשתמש בכמות בלתי מוגבלת של קודקודי DOM שורשיים.

על מנת לצייר אלמנט ריאקטי לתוך קודקוד DOM שורשי, העבר אותם אל הפונקציה [`ReactDOM.render()`](/docs/react-dom.html#render):

`embed:rendering-elements/render-an-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/ZpvBNJ?editors=1010)**

דוגמא זו מציגה "Hello, world" בעמוד.

## עדכון אלמנטים שצוירו {#updating-the-rendered-element}

אלמנטי ריאקט [אינם משתנים](https://en.wikipedia.org/wiki/Immutable_object). במידה ויצרת אלמנט, לא ניתן לשנות את ילדיו או מאפייניו. אלמנט הוא כמו פרים יחיד בסרט: הוא מייצג את ממשק המשתמש בנקודה מסויימת בזמן.

עם הידע שלמדנו על כה, הדרך היחידה לעדכן את ממשק המשתמש הוא על ידי יצירה של אלמנט חדש והעברה שלו ל[`ReactDOM.render()`](/docs/react-dom.html#render).

בהתחשב בדוגמת השעון המתקתק:

`embed:rendering-elements/update-rendered-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/gwoJZk?editors=1010)**

דוגמא זו קוראת ל[`ReactDOM.render()`](/docs/react-dom.html#render) בכל שניה על ידי הפונקציה הנקראת על ידי [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).

>**הערה:**
>
>בפועל, רוב אפליקציות ריאקט קוראות ל[`ReactDOM.render()`](/docs/react-dom.html#render) פעם אחת בלבד. בפרקים הבאים נלמד איך קוד כזה מוכמס ל[קומפוננטות בעלות state](/docs/state-and-lifecycle.html).

>
>אנו ממליצים לא לדלג על נושאים מכיוון שהם נבנו אחד על השני.

## ריאקט מעדכן רק מה שנחוץ לעדכן {#react-only-updates-whats-necessary}

React DOM משווה את האלמנט וילדיו למצב הקודם שלו ומחיל אך ורק שינויים נדרשים בDOM על מנת להביא אותו למצב הרצוי.

<<<<<<< HEAD
אתה יכול לאמת זאת על ידי התבוננות [בדוגמא](codepen://rendering-elements/update-rendered-element) באמצעות כלי הדפדפן:
=======
You can verify by inspecting the [last example](https://codepen.io/gaearon/pen/gwoJZk?editors=1010) with the browser tools:
>>>>>>> 6bd09fe682e18ccd7747fcd7798fa8fb4d3edc42

![DOM inspector המציג את העדכונים הפרטניים](../images/docs/granular-dom-updates.gif)

אפילו כשאנחנו יוצרים אלמנט המתאר את עץ ממשק המשתמש המלא בכל תקתוק של השעון, רק קודקוד הטקסט שתוכנו השתנה יעודכן על ידי React DOM.


מהניסיון שלנו, חשיבה על איך ממשק המשתמש צריך להראות בכל רגע נתון לעומת איך לשנות אותו לאורך זמן מבטל כמות נכבדת של באגים.
