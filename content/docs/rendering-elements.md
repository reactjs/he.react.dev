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
שלא כמו אלמנט DOM, אלמנטי ריאקט הם אובייקטים פשוטים וזולים ליצירה. React DOM מטפל בעדכון הDOM על מנת להתאים אותם לאלמנטים של ריאקט.

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

<<<<<<< HEAD
על מנת לצייר אלמנט ריאקטי לתוך קודקוד DOM שורשי, העבר אותם אל הפונקציה `ReactDOM.render()`:
=======
To render a React element into a root DOM node, pass both to [`ReactDOM.render()`](/docs/react-dom.html#render):
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

דוגמא זו מציגה "Hello, world" בעמוד.

## עדכון אלמנטים שצוירו {#updating-the-rendered-element}

אלמנטי ריאקט [אינם משתנים](https://en.wikipedia.org/wiki/Immutable_object). במידה ויצרת אלמנט, לא ניתן לשנות את ילדיו או מאפייניו. אלמנט הוא כמו פרים יחיד בסרט: הוא מייצג את ממשק המשתמש בנקודה מסויימת בזמן.

<<<<<<< HEAD
עם הידע שלמדנו על כה, הדרך היחידה לעדכן את ממשק המשתמש הוא על ידי יצירה של אלמנט חדש והעברה שלו ל`ReactDOM.render()`.
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to [`ReactDOM.render()`](/docs/react-dom.html#render).
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c

בהתחשב בדוגמת השעון המתקתק:

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

<<<<<<< HEAD
דוגמא זו קוראת ל`ReactDOM.render()` בכל שניה על ידי הפונקציה הנקראת על ידי [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).
=======
It calls [`ReactDOM.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c

>**הערה:**
>
<<<<<<< HEAD
>בפועל, רוב אפליקציות ריאקט קוראות ל`ReactDOM.render()` פעם אחת בלבד. בפרקים הבאים נלמד איך קוד כזה מוכמס ל[קומפוננטות בעלות state](/docs/state-and-lifecycle.html).
=======
>In practice, most React apps only call [`ReactDOM.render()`](/docs/react-dom.html#render) once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c
>
>אנו ממליצים לא לדלג על נושאים מכיוון שהם נבנו אחד על השני.

## ריאקט מעדכן רק מה שנחוץ לעדכן {#react-only-updates-whats-necessary}

React DOM משווה את האלמנט וילדיו למצב הקודם שלו ומחיל אך ורק שינויים נדרשים בDOM על מנת להביא אותו למצב הרצוי.

אתה יכול לאמת זאת על ידי התבוננות [בדוגמא](codepen://rendering-elements/update-rendered-element) באמצעות כלי הדפדפן:

![DOM inspector המציג את העדכונים הפרטניים](../images/docs/granular-dom-updates.gif)

<<<<<<< HEAD
אפילו כשאנחנו יוצרים אלמנט המתאר את עץ ממשק המשתמש המלא בכל תקתוק של השעון, רק קודקוד הטקסט שתוכנו השתנה יעודכן על ידי React DOM.
=======
Even though we create an element describing the whole UI tree on every tick, only the text node whose contents have changed gets updated by React DOM.
>>>>>>> 821e20726266bc8113353d0c2b6d885f82e584a8

<<<<<<< HEAD
מהניסיון שלנו, חשיבה על איך ממשק המשתמש צריך להראות בכל רגע נתון לעומת איך לשנות אותו לאורך זמן מבטל כמות נכבדת של באגים.
=======
In our experience, thinking about how the UI should look at any given moment, rather than how to change it over time, eliminates a whole class of bugs.
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c
