---
title: "כתיבת סימון עם JSX"
---

<Intro>

*JSX* הוא סיומת תחביר עבור JavaScript המאפשרת לך לכתוב סימון דמוי HTML בתוך קובץ JavaScript. למרות שיש דרכים אחרות לכתוב רכיבים, רוב מפתחי React מעדיפים את התמציתיות של JSX, ורוב בסיסי הקוד use זה.

</Intro>

<YouWillLearn>

* מדוע React מערבב סימון עם היגיון רינדור
* איך JSX שונה מHTML
* כיצד להציג מידע עם JSX

</YouWillLearn>

## JSX: הכנסת סימון ל-JavaScript {/*jsx-putting-markup-into-javascript*/}

האינטרנט נבנה על HTML, CSS וJavaScript. במשך שנים רבות, מפתחי אתרים שמרו על תוכן ב-HTML, עיצוב ב-CSS והיגיון ב-JavaScript - לרוב בקבצים נפרדים! התוכן סומן בתוך HTML בעוד ההיגיון של הדף חי בנפרד ב-JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

אבל ככל שהרשת הפכה לאינטראקטיבית יותר, ההיגיון קבע יותר ויותר את התוכן. JavaScript היה אחראי על HTML! זו הסיבה ש**ב-React, רינדור ההיגיון והסימון חיים יחד באותו מקום - רכיבים.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

`Sidebar.js` React רכיב

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

`Form.js` React רכיב

</Diagram>

</DiagramGroup>

שמירה על היגיון העיבוד והסימון של כפתור יחד מבטיחה שהם יישארו מסונכרנים זה עם זה בכל עריכה. לעומת זאת, פרטים שאינם קשורים, כגון סימון הלחצן וסימון סרגל הצד, מבודדים זה מזה, מה שהופך את זה לבטוח יותר לשנות כל אחד מהם בעצמו.

כל רכיב React הוא פונקציה JavaScript שעשויה להכיל סימון כלשהו ש-React מעבד לדפדפן. React רכיבים use סיומת תחביר בשם JSX כדי לייצג את הסימון הזה. JSX דומה מאוד ל-HTML, אבל הוא קצת יותר מחמיר ויכול להציג מידע דינמי. הדרך הטובה ביותר להבין זאת היא להמיר כמה סימון HTML לסימון JSX.

<Note>

JSX ו-React הם שני דברים נפרדים. לעתים קרובות הם used ביחד, אבל אתה *יכול* [use אותם באופן עצמאי](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) זה מזה. JSX היא הרחבה תחבירית, בעוד React היא ספריית JavaScript.

</Note>

## המרת HTML ל-JSX {/*converting-html-to-jsx*/}

נניח שיש לך כמה (תקף לחלוטין) HTML:

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

ואתה רוצה להכניס את זה לרכיב שלך:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

אם תעתיק ותדביק אותו כפי שהוא, זה לא יעבוד:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

זה בגלל שuse JSX מחמיר יותר ויש לו כמה כללים יותר מHTML! אם תקרא את הודעות השגיאה למעלה, הן ידריכו אותך לתקן את הסימון, או שאתה יכול לעקוב אחר המדריך למטה.

<Note>

לרוב, הודעות השגיאה של React על המסך יעזרו לך למצוא היכן הבעיה. תן להם לקרוא אם אתה נתקע!

</Note>

## הכללים של JSX {/*the-rules-of-jsx*/}

### 1. החזר אלמנט שורש בודד {/*1-return-a-single-root-element*/}

כדי להחזיר רכיבים מרובים מרכיב, **עטפו אותם בתג אב יחיד.**

לדוגמה, אתה יכול use a ``<div>``:

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


אם אינך רוצה להוסיף ``<div>`` לסימון שלך, אתה יכול לכתוב `<>` ו-`</>` במקום זאת:

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

תג ריק זה נקרא *[Fragment.](/reference/react/Fragment)* Fragments מאפשרים לך לקבץ דברים מבלי להשאיר עקבות בעץ HTML של הדפדפן.

<DeepDive>

#### מדוע צריך לעטוף תגיות JSX מרובות? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX נראה כמו HTML, אבל מתחת למכסה המנוע הוא הופך לאובייקטים JavaScript פשוטים. לא ניתן להחזיר שני אובייקטים מפונקציה מבלי לעטוף אותם במערך. זה מסביר מדוע אתה גם לא יכול להחזיר שני תגיות JSX מבלי לעטוף אותם בתג אחר או Fragment.

</DeepDive>

### 2. סגור את כל התגים {/*2-close-all-the-tags*/}

JSX מחייב סגירה מפורשת של תגים: תגיות סגירות עצמיות כמו ``<img>`` חייבים להפוך ל`<img />`, ותגי גלישה כמו ``<li>`oranges` חייבים להיכתב כ-``<li>`oranges`</li>`oranges`.

כך התמונה והרשימה של הדי למאר נראים סגורים:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase <s>כל</s> רוב הדברים! {/*3-camelcase-salls-most-of-the-things*/}

JSX הופך לJavaScript ותכונות הכתובות ב-JSX הופכות למפתחות של JavaScript אובייקטים. ברכיבים שלך, לעתים קרובות תרצה לקרוא את התכונות הללו למשתנים. אבל ל-JavaScript יש מגבלות על שמות משתנים. לדוגמה, השמות שלהם לא יכולים להכיל מקפים או להיות מילים שמורות כמו `class`.

זו הסיבה שב-React, תכונות HTML ו-SVG רבות נכתבות ב-camelCase. לדוגמה, במקום `stroke-width` אתה use `strokeWidth`. מכיוון ש`class` היא מילה שמורה, ב-React אתה כותב במקום זאת `className`, על שם [המאפיין DOM המקביל](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

אתה יכול [למצוא את כל המאפיינים האלה ברשימה של DOM רכיב props.](/reference/react-dom/components/common) אם אתה טועה באחד, אל דאגה - React ידפיס הודעה עם תיקון אפשרי ל[מסוף הדפדפן.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

מסיבות היסטוריות, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) ו-[`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) תכונות נכתבות כמו ב-HTML עם מקפים.

</Pitfall>

### טיפ מקצועי: השתמש בממיר JSX {/*pro-tip-use-a-jsx-converter*/}

המרת כל התכונות הללו בסימון קיים יכול להיות מייגע! אנו ממליצים להשתמש ב[ממיר](https://transform.tools/html-to-jsx) כדי לתרגם את HTML ואת SVG הקיימים ל-JSX. ממירים הם use מלאים בפועל, אבל עדיין כדאי להבין מה קורה כדי שתוכל לכתוב בנוחות JSX בעצמך.

הנה התוצאה הסופית שלך:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

עכשיו אתה יודע למה JSX קיים וכיצד use אותו ברכיבים:

* לוגיקה של עיבוד רכיבים React יחד עם סימון כי הם קשורים.
* JSX דומה ל-HTML, עם כמה הבדלים. אתה יכול use [ממיר](https://transform.tools/html-to-jsx) אם אתה צריך.
* הודעות שגיאה יפנו אותך לרוב בכיוון הנכון לתיקון הסימון שלך.

</Recap>



<Challenges>

#### המר כמה HTML לJSX {/*convert-some-html-to-jsx*/}

HTML זה הודבק ברכיב, אך הוא אינו חוקי JSX. תקן את זה:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

אם לעשות זאת ביד או להשתמש בממיר זה תלוי בך!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>

