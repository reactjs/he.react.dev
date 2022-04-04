---
id: lists-and-keys
title: רשימות ומפתחות
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

ראשית, בואו נסקור איך לשנות רשימות ב-JavaScript.

בהתחשב בקוד שלהלן, אנחנו משתמשים בפונקציית [`()map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) כדי לקחת מערך של מספרים `numbers` ולהכפיל את הערכים שלהם. אנו מקצים את המערך החדש שחוזר מ-`map()` למשתנה `doubled` ומדפיסים אותו.

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

הקוד הזה ידפיס `[2, 4, 6, 8, 10]` לקונסול.

ב-React שינוי מערכים לרשימות של [אלמנטים](/docs/rendering-elements.html) הוא כמעט זהה.

### רינדור קומפוננטות מרובות {#rendering-multiple-components}

אתה יכול לבנות אוסף של אלמנטים ו[לכלול אותם ב-JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) באמצעות סוגריים מסולסלים `{}`.

למטה, אנו רצים על `numbers` מערך המספרים באמצעות פונקציית [`()map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) ב-JavaScript. אנו מחזירים `<li>` אלמנט לכל פריט. לבסוף, אנו מקצים את המערך החוזר ל-`listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

<<<<<<< HEAD
אנו מכלילים את המערך `listItems` כולו לתוך אלמנט `<ul>`, ו[מרדנדרים את ה-DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom).
=======
Then, we can include the entire `listItems` array inside a `<ul>` element:
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

```javascript{2}
<ul>{listItems}</ul>
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

הקוד הזה מציג רשימה של מספרים מ-1 עד 5.

### קומפוננטת רשימה בסיסית {#basic-list-component}

בדרך כלל אנו נרנדר רשימה בתוך [קומפוננטה](/docs/components-and-props.html).

אנחנו יכולים לשכתב את הדוגמה הקודמת לקומפוננטה שמקבלת `numbers` מערך של מספרים ומדפיסה רשימה של אלמנטים.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NumberList numbers={numbers} />);
```

כאשר תריץ את הקוד הזה, תופיע אזהרה שמפתח צריך להיות מסופק לפריטים ברשימה. "מפתח" הוא תכונה מיוחדת מסוג מחרוזת שאתה צריך להכליל מתי שאתה יוצר רשימה של אלמנטים. נדון מדוע זה חשוב בחלק הבא.

בואו נקצה `key` לרשימת הפריטים שלנו בתוך `numbers.map()` ונתקן את בעיית חסרון המפתח.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## מפתחות {#keys}

מפתחות עוזרים ל-React לזהות אילו פריטים השתנו, נוספו או נמחקו. מפתחות אמורים להינתן לאלמנטים בתוך המערך כדי לתת לאלמנטים זהות קבועה:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

הדרך הטובה ביותר לבחור מפתח היא להשתמש במחרוזת שמזהה באופן ייחודי פריט מהרשימה בין אחיו. לרוב תבחר ID מהנתונים שלך כמפתח:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

כאשר אין לך ID קבוע לרנדור הפריטים, אתה רשאי להשתמש באינדקס של האיבר כמפתח בתור מוצא אחרון:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // קבוע ID עשה זאת אך ורק אם לפריט אין 
  <li key={index}>
    {todo.text}
  </li>
);
```

אנחנו לא ממליצים להשתמש באינדקסים עבור מפתחות אם סדר הפריטים ישתנה. זה יכול להשפיע לרעה על הביצועים ולגרום לבעיות ב-state של הקומפוננטה. עיין במאמר של Robin Pokorny בשביל [הסבר מעמיק על ההשפעות השליליות של שימוש באינדקס כמפתח](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). אם תבחר לא להקצות מפתח מפורש לפריט ברשימה אז React ישתמש כברירת מחדל באינדקס כמפתח.

הנה [הסבר מעמיק על למה מפתחות נחוצים](/docs/reconciliation.html#recursing-on-children) אם אתה מעוניין ללמוד יותר.

### חילוץ קומפוננטות עם מפתחות {#extracting-components-with-keys}

מפתחות הגיוניים רק בהקשר של מערכים.

לדוגמה, אם אתה [מחלץ](/docs/components-and-props.html#extracting-components) קומפוננטת `ListItem`, אתה תעדיף לשמור את המפתח באלמנט `<ListItem />` שבמערך מאשר באלמנט `<li>` שב-`ListItem ` עצמו.

**דוגמה: שימוש לא נכון במפתח**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // טעות! אין צורך לציין את המפתח כאן
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // טעות! אתה צריך לציין את המפתח כאן
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

**דוגמה: שימוש נכון במפתח**

```javascript{2,3,9,10}
function ListItem(props) {
  // נכון! אין צורך לציין את המפתח כאן
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // נכון! יש לציין את המפתח בתוך המערך
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

כלל אצבע טוב הוא שאלמנטים בתוך `map()` צריכים מפתחות.

### מפתחות חייבים להיות ייחודיים בין אחים. {#keys-must-only-be-unique-among-siblings}

מפתחות חייבים להיות ייחודיים בין אחים. למרות זאת הם לא צריכים להיות ייחודיים באופן גלובאלי. אנחנו יכולים להשתמש באותם מפתחות כאשר אנו מייצרים שני מערכים שונים.

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'שלום עולם', content: '!React ברוכים הבאים ללמידת'},
  {id: 2, title: 'התקנה', content: 'npm-מ React אתה יכול להתקין את'}
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Blog posts={posts} />);
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

מפתחות משרתים כרמז ל-React אבל הם אינם עוברים לקומפוננטות שלך. אם אתה צריך את אותו הערך בקומפוננטה שלך, העבר אותו בצורה מפורשת כ-prop עם שם אחר.

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

עם הדוגמה למטה, קומפוננטת `Post` יכולה לקרוא את `props.id` אבל לא את `props.key`.

### הטמעת ()map בתוך JSX {#embedding-map-in-jsx}

בדוגמאות למעלה הצהרנו על משתנה נפרד `listItems` וכללנו אותו ב-JSX:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX מאפשר [להטמיע כל ביטוי](/docs/introducing-jsx.html#embedding-expressions-in-jsx) בסוגריים מסולסלים כדי שנוכל להטביע את תוצאת `map()`:

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**נסו זאת ב-CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

לפעמים התוצאה היא קוד ברור יותר, אבל סגנון זה יכול להיות גם לרעה. כמו ב-JavaScript, זה תלוי בהחלטתך האם כדאי לחלץ משתנה למען שיפור קריאתו. זכור כי אם גוף פונקציית `map()` יותר מידי מקונן, זה יכול להיות זמן טוב [לחלץ קומפוננטה](/docs/components-and-props.html#extracting-components).
