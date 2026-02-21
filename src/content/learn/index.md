---
title: התחלה מהירה
---

<Intro>

ברוכים הבאים לתיעוד של תגובה! הדף ייתן לכם היכרות עם 80% מהמושגים ב-React תשתמשו ביום-יום.

</Intro>

<YouWillLearn>

- איך ליצור קומפוננטות ולקנן ביניהן
- איך להוסיף סימון (סימון) ועיצוב (סגנונות)
- איך להציג נתונים
- איך לרנדר תנאים ורשימות
- איך להגיב לאירועים ולעדכן את המסך
- איך לשתף נתונים בין קומפוננטות

</YouWillLearn>

## יצירה אוקינון של קומפונטות {/*components*/}

אפליקציות React בנויות מ-*קומפונטות*. קומפונטה היא חלק מה-UI (ממשק משתמש) שיש לו לוגיקה ומראה משל עצמו. קומפוננטה יכולה להיות קטנה כמו כפתור, או גדולה כמו עמוד שלם.

קומפוננטות React הן פונקציות JavaScript שמחזירות סימון (סימון):

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

עכשיו אחרי שהגדרתם את `MyButton`, אפשר לקנן אותה בתוך קומפונטה אחרת:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

שימו לב ש-`<MyButton />` מתחיל באות גדולה. כך מזהים קומפונטת React. שמות קומפוננטות React חייבים להתחיל באות גדולות, בעוד שתגיות HTML חייבות להיות באותיות קטנות.

הנה התוצאה:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

המילים `ייצוא ברית מחדל` מציינות את הקומפוננטה טפסים בקובץ. אם חלק מתחביר JavaScript לא מוכר לכם, ל-[MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) ול-[javascript.info](https://javascript.info/import-export) יש מקורות מעולים.

## כתיבת סימון עם JSX {/*writing-markup-with-jsx*/}

תחביר הסימון (סימון) שראיתם למעלה נקראת *JSX*. הוא אופציונלי, אבל רוב פרויקטי React users בו בגלל הנוחות שלו. כל [הכלים שאנו ממליצים עליהם לפיתוח מקומי](/learn/installation) תומך ב-JSX מהקופסה.

JSX מחמיר יותר מ-HTML. צריך לסגור תגיות כמו `<br />`. הקומפוננטה שלכם גם לא יכולה להחזיר כמה תגיות JSX נפרדות. צריך לתת להם בהורה משותף, כמו ``<div>`...`</div>`` או עטיפה ריקה `<>...</>`:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

אם יש לכם הרבה HTML להמיר ל-JSX, אפשר להשתמש ב-[ממיר אונליין](https://transform.tools/html-to-jsx).

## הוספת עיצובים {/*adding-styles*/}

ב-React מגדירים מחלקת CSS בעזרת `className`. זה עובד כמו המאפיין [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) של HTML:

```js
<img className="avatar" />
```

לאחר כותבים את הכללי ה-CSS בקובץ CSS נפרד:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

תגובה לא כתיבה איך להוסיף קובצי CSS. במקרה הפשוט ביותר, תגית [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) ל-HTML. אם אתם משתמשים בכלי בנייה (כלי בנייה) או בפריימורק (מסגרת), בדקו בתיעוד שלהם איך להוסיף קובץ CSS לפרויקט.

## הצגת נתונים {/*displaying-data*/}

JSX יכול להכניס סימון (סימון) ל-JavaScript. סוגרים מסולסלים מאפשרים "לחזור" ל-JavaScript כדי להטמיע מהקוד ולהציג אותו למשתמש. לדוגמה, זה יציג את `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

אפשר גם "לברוח ל-JavaScript" מתוך מאפיינים JSX, אבל צריך להשתמש בסוגריים מסולסלים *במקום* מירכאות. למשל, `className="avatar"` מעביר את המחרוזת `"avatar"` כמחלקת CSS, אבל `src={user.imageUrl}` קורא את הערך של השינוי `user.imageUrl` ב-JavaScript, ואז מעביר אותו למאפיין `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

אפשר לשים גם ביטויים מורכבים יותר סוגריים מסולסלים של JSX, למשל [שרשור מחרוזות](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

בדוגמה למעלה, `style={{}}` הוא לא תחביר מיוחד, אלא אובייקט `{}` בתוך סוגריים מסולסלים של `style={ }` ב-JSX. אפשר להשתמש במאפיין `סגנון` עיצובים תלויים במשתני JavaScript.

## רינדור מותנה {/*עיבוד-מותנה*/}

ב-React אין תחביר מיוחד לתנאי תנאי. במקום זה משתמשים באותן טכניקות של JavaScript רגיל. לדוגמה, אפשר להשתמש במשפט [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) כדי לכלול את JSX בתנאי:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

אם מעדיפים קוד תמציתי יותר, אפשר להשתמש ב-[אופרטור תנאי `?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). צריך ל-`אם`, הוא עובד בתוך JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

כשלא צריך ענף `else`, אפשר להשתמש גם בתחביר קצר של [אופרטור לו `&&`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

כל ההגישות האלה עובדות גם למנות של מאפיינים (תכונות). אם חלק מהתחביר הזה של JavaScript לא מוכר לכם, אפשר להתחיל תמיד עם `אם...אחר`.

## רינדור רשימות {/*רשימות-עיבוד*/}

תשתמשו ביכולות JavaScript כמו [`for` לולאה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) ופונקציית [מערך `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Ob/Global lists_Ob) קומספו/Global_Ob רשימות/Global_Ob רשימות.

לדוגמה, נניח שיש לכם מערך של מוצרים:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

בתוך הקומפוננטה, השתמשו ב-`map()` כדי ליצור עוד מוצרים למערך פריטי ``<li>``:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

שימו לב של-``<li>`` יש מאפיין (תכונה) בשם `מפתח`. עבור כל פריט ברשימה, צריך להעביר מחרוזת או מספר שמזה את הפריט בצורה ייחודית לאחים שלו. בדרך כלל `מפתח` מגיע מהנתונים, כמו ID ממסד נתונים. React Usert ב-keys לדעת מה קרה אם ירצה עוד, מוחקים או שנים סדר של פריטים.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## תגובה לאירועים {/*מגיבים-לאירועים*/}

אפשר להגיב לאירועים על ידי הגדרת פונקציות *מטפל באירועים* בתוך הקומפוננטות:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

שימו לב של-`onClick={handleClick}` אין סוגרים בסוף. אל _תקראו_ לפונקציית המטפל בעצמכם, צריך רק *להעביר אותה*. תגיב תקרא לרופא כשהמשתמש ילחץ על הכפתור.

## עדכון המסך {/*עדכון-המסך*/}

קרוב תרצו שהקומפונטה "תזכור" מידע ותציג אותו. למשל, אפשר לספור כמה פעמים נלחץ כפתור. כדי לעשות את זה, משתמשים ב-*state*.

קודם מייבאים את [`useState`](/reference/react/useState) מ-React:

```js
import { useState } from 'react';
```

עכשיו אפשר להגדיר מדרג `state` בתוך הקומפוננטה:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState` מחזיר שני דברים: ה-`state` הנוכחי (`count`) ופונקציה שמעדכנת אותו (`setCount`). אפשר לתת להם כל שם, אבל הקונבנציה היא `[משהו, setSomething]`.

בפעם הראשונה שהכפתור מוצג, `count` יהיה `0` כי העברתם `0` ל-`useState()`. כשרוצים לשנות, קוראים ל`setCount()` ומעבירים אליו את הערך החדש. לחיצה על הכפתור תגדיל את המונה:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

תגובה תקרא לפונקציית הקומפוננטה שוב. הפעם `ספירה` תהיה `1`. אחר כך `2`, וכן הלאה.

אם מרנדרים את אותה קומפוננטה כמה פעמים, כל מופע יקבל `state` משלו. נסו ללחוץ על כל כפתור בנפרד:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

לב שכל כפתור "זוכר" את ה-`count` שלו, ולא משפיע על הכפתורים אחרים.

## שימוש ב-Hooks {/*using-hooks*/}

לפונקציות שמתחילות ב-`use` קוראים *Hooks*. `useState` הוא Hook מובנה ש-React מספקת. אפשר למצוא Hooks מובנים נוספים ב-[מדריך ה-API](/reference/react). אפשר גם לכתוב Hooks משלכם על ידי שילוב Hooks קיימים.

ל-Hooks יש מגבלות מחמירות יותר מפונקציות אחרות. אפשר לקרוא ל-Hooks רק *בראש* הקומפוננטות (או Hooks אחרים). אם להשתמש ב-`useState` בתוך תנאי או לולאה, צריך לחלץ קומפונטה חדשה ולהשתמש בו שם.

## שיתוף נתונים בין קומפונטות {/*sharing-data-between-components*/}

בדוגמה הקודמת, לכל `MyButton` היה `count` עצמאי, וכשלחצו על כפתור רק ה-`count` של אותו כפתור השתנה:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="תרשים שמציג עץ של שלוש קומפוננטות: הורה אחד בשם MyApp ושני ילדים בשם MyButton. שתי קומפוננטות MyButton מכילות count בערך אפס.">

בהתחלה, ה-`count` של כל `MyButton` הוא `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="אותו תרשים כמו קודם, עם הדגשה על count של קומפוננטת MyButton הראשונה כדי לציין לחיצה שהגדילה את הערך לאחד. קומפוננטת MyButton השנייה עדיין בערך אפס." >

ה-`MyButton` הראשון מעדכן את ה-`count` שלו ל-`1`

</Diagram>

</DiagramGroup>

עם זאת, הרבה פעמים צריך שקומפוננטות *ישתפו נתונים ויתעדכנו יחד תמיד*.

כדי לשתות קומפוננטות `MyButton` יציגו אותו `count` ויתעדכנו יחד, צריך להרים את ה-`state` מהכפתורים למעלה אל הקומפוננטה הקרובה שמכילה את שתיהן.

בדוגמה הזו זו `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="תרשים שמציג עץ של שלוש קומפוננטות: הורה אחד בשם MyApp ושני ילדים בשם MyButton. ל-MyApp יש count בערך אפס שמועבר לשתי קומפוננטות MyButton, וגם הן מציגות ערך אפס." >

בהתחלה, ה-`count` של `MyApp` הוא `0`, והוא מועבר לשני הילדים

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="אותו תרשים כמו קודם, עם הדגשה על count של קומפוננטת ההורה MyApp שמציינת לחיצה והגדלה של הערך לאחד. גם הזרימה לשתי קומפוננטות MyButton מודגשת, וערך ה-count בכל ילד מוגדר לאחד כדי להראות שהערך הועבר מלמעלה." >

בלחיצה, `MyApp` מעדכנת את ה-`count` ל-`1` ומעבירה אותו לשני הילדים

</Diagram>

</DiagramGroup>

עכשיו, כשלוחצים על אחד הכפתורים, ה-`ספירה` ב-`MyApp` מסתובבת, וזה משנה את שני ה-counts בתוך `MyButton`. כך עושים את זה בקוד.

קודם *מעבירים את ה-state למעלה* מ-`MyButton` ל-`MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

לאחר *מעבירים את ה-state למטה* מ-`MyApp` לכל `MyButton`, יחד עם מטפל בלחיצה משותף. אפשר להעביר מידע ל-`MyButton` באמצעות סוגריים מסולסלים ב-JSX, בדיוק כמו שעשינו קודם עם תגיות מובנות כמו ``<img>``:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

למידע שמעבירים כך קוראים _props_. עכשיו `MyApp` מחזיקה את ה-`state` בשם `count` ואת מטפל `handleClick`, ו-*מעבירה את שניהם כ-props* לכל אחד מהכפתורים.

לבסוף, משנים את `MyButton` כך ש-*תקרא* את ה-`props` שעברו מקומפוננטת ההורה שלה:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

כאשר לוחצים על כפתור, מטפל `onClick` מופעל. ה-prop `onClick` של כל כפתור מצביע לפונקציה `handleClick` בתוך `MyApp`, אז הקוד שלה רץ. הקוד הזה קורא ל-`setCount(count + 1)` ומעדכן את ה-`state` בשם `count`. הערך החדש של `count` מועבר כ-prop לכל כפתור, כך שכולם מציגים אותו ערך. לזה קוראים "להרים state למעלה" (הרמת state למעלה).

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## השלבים הבאים {/*next-steps*/}

הזה אתם כבר מכירים את היסודות של כתיבת קוד ב-React!

עברו ל-[המדריך](/learn/tutorial-tic-tac-toe) כדי לתרגל ולבנות את המיני-אפליקציה הראשונה שלכם ב-React.
