---
title: "רשימות עיבוד"
---

<Intro>

לעתים קרובות תרצה להציג מספר רכיבים דומים מאוסף נתונים. אתה יכול use את [JavaScript שיטות מערך](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) כדי לתפעל מערך של נתונים. בדף זה, תבצע use [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) ו-[`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) עם https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) עם https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) עם https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) עם React של רכיבי נתונים של מערך הנתונים שלך ויבצע סינון של מערך נתונים.

</Intro>

<YouWillLearn>

* כיצד לעבד רכיבים ממערך באמצעות `map()` של JavaScript
* כיצד לעבד רק רכיבים ספציפיים באמצעות `filter()` של JavaScript
* מתי ומדוע use React מפתחות

</YouWillLearn>

## עיבוד נתונים ממערכים {/*rendering-data-from-arrays*/}

אמור שיש לך רשימה של תוכן.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

ההבדל היחיד בין אותם פריטי רשימה הוא התוכן שלהם, הנתונים שלהם. לעתים קרובות תצטרך להציג מספר מופעים של אותו רכיב באמצעות נתונים שונים בעת בניית ממשקים: מרשימות של הערות ועד גלריות של תמונות פרופיל. במצבים אלה, אתה יכול לאחסן את הנתונים האלה באובייקטים ומערכים JavaScript ובשיטות use כמו [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) ו-[`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) כדי להציג רשימות של רכיבים מהם.

להלן דוגמה קצרה כיצד ליצור רשימה של פריטים ממערך:

1. **העבר** את הנתונים למערך:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **מפה** את חברי `people` למערך חדש של צמתים JSX, `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **החזר** `listItems` מהרכיב שלך עטוף ב-`<ul>`:

```js
return <ul>{listItems}</ul>;
```

הנה התוצאה:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

שימו לב שארגז החול שלמעלה מציג שגיאת מסוף:

<ConsoleBlock level="error">

אזהרה: לכל ילד ברשימה צריך להיות אביזר "מפתח" ייחודי.

</ConsoleBlock>

תלמד כיצד לתקן שגיאה זו בהמשך דף זה. לפני שנגיע לזה, בואו נוסיף קצת מבנה לנתונים שלכם.

## סינון מערכי פריטים {/*filtering-arrays-of-items*/}

ניתן לבנות את הנתונים הללו אפילו יותר.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

נניח שאתה רוצה דרך להראות רק לאנשים שהמקצוע שלהם הוא `'chemist'`. אתה יכול use JavaScript של `filter()` להחזיר רק את האנשים האלה. שיטה זו לוקחת מערך של פריטים, מעבירה אותם דרך "מבחן" (פונקציה שמחזירה `true` או `false`), ומחזירה מערך חדש של רק אותם פריטים שעברו את המבחן (החזירו `true`).

אתה רוצה רק את הפריטים שבהם `profession` הוא `'chemist'`. הפונקציה "בדיקה" עבור זה נראית כמו `(person) => person.profession === 'chemist'`. הנה איך להרכיב את זה:

1. **צור** מערך חדש של אנשים "כימאים" בלבד, `chemists`, על ידי קריאה ל-`filter()` ב-`people` סינון לפי `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. כעת **מפה** מעל `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```

3. לבסוף, **החזר** את ה-`listItems` מהרכיב שלך:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

פונקציות חץ מחזירות באופן מרומז את הביטוי מיד אחרי `=>`, כך שלא היית צריך `return` statement:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

עם זאת, **עליך לכתוב `return` במפורש אם `=>` שלך מלווה בפלטה מתולתלת `{`!**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

אומרים שפונקציות חץ המכילות `=> {` בעלות ["גוף חסום".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) הן מאפשרות לך לכתוב יותר משורת קוד בודדת, אבל אתה *חייב* לכתוב `return` statement בעצמך. אם תשכח אותו, שום דבר לא יוחזר!

</Pitfall>

## שמירה על סדר פריטי רשימה עם `key` {/*keeping-list-items-in-order-with-key*/}

שימו לב שכל ארגזי החול שלמעלה מציגים שגיאה במסוף:

<ConsoleBlock level="error">

אזהרה: לכל ילד ברשימה צריך להיות אביזר "מפתח" ייחודי.

</ConsoleBlock>

אתה צריך לתת לכל פריט מערך `key` -- מחרוזת או מספר המזהה אותו באופן ייחודי בין שאר הפריטים במערך זה:

```js
<li key={person.id}>...</li>
```

<Note>

אלמנטים JSX ישירות בתוך שיחת `map()` תמיד צריכים מפתחות!

</Note>

מקשים אומרים React לאיזה פריט מערך כל רכיב מתאים, כך שהוא יוכל להתאים אותם מאוחר יותר. זה הופך להיות חשוב אם פריטי המערך שלך יכולים לזוז (למשל עקב מיון), להכנס או להימחק. `key` שנבחר היטב עוזר לReact להסיק מה בדיוק קרה, ולבצע את העדכונים הנכונים לעץ DOM.

במקום ליצור מפתחות תוך כדי תנועה, עליך לכלול אותם בנתונים שלך:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### הצגת מספר צמתים DOM עבור כל פריט רשימה {/*displaying-several-dom-nodes-for-each-list-item*/}

מה אתה עושה כאשר כל פריט צריך לרנדר לא אחד, אלא כמה צמתים DOM?

התחביר הקצר [`<>...</>` Fragment](/reference/react/Fragment) לא יאפשר לך להעביר מפתח, אז אתה צריך לקבץ אותם ל-`<div>` בודד, או use את התחביר `<Fragment>` המפורש יותר:](/__reference_TK/reference/referenceK/reference/referenceK/reference)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragments נעלמים מה-DOM, אז זה ייצור רשימה שטוחה של `<h1>`, `<p>`, `<h1>`, `<p>`, וכן הלאה.

</DeepDive>

### היכן ניתן להשיג את `key` {/*where-to-get-your-key*/} שלך

מקורות נתונים שונים מספקים מקורות מפתח שונים:

* **נתונים ממסד נתונים:** אם הנתונים שלך מגיעים ממסד נתונים, אתה יכול use את מפתחות/מזהי מסד הנתונים, שהם ייחודיים מטבעם.
* **נתונים שנוצרו באופן מקומי:** אם הנתונים שלך נוצרים ונמשכים באופן מקומי (למשל הערות באפליקציה לרישום הערות), use מונה גדל, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) או חבילה כמו [`uuid`](https://www.npmjs.com/package/uuid) בעת יצירת פריטים.

### כללי המפתחות {/*rules-of-keys*/}

* **מפתחות חייבים להיות ייחודיים בין אחים.** עם זאת, זה בסדר use אותם מפתחות עבור צמתים JSX ב-_מערכים_ שונים.
* ** אסור לשנות את המפתחות** או שזה מביס את מטרתם! אל תיצור אותם בזמן העיבוד.

### למה React צריך מפתחות? {/*why-does-react-need-keys*/}

תאר לעצמך שלקבצים בשולחן העבודה שלך לא היו שמות. במקום זאת, תתייחס אליהם לפי הסדר שלהם -- הקובץ הראשון, הקובץ השני וכן הלאה. אתה יכול לקבל used אליו, אבל ברגע שתמחק קובץ, זה היה מבלבל. הקובץ השני יהפוך לקובץ הראשון, הקובץ השלישי יהיה הקובץ השני וכן הלאה.

שמות קבצים בתיקייה ומפתחות JSX במערך משרתים מטרה דומה. הם מאפשרים לנו לזהות באופן ייחודי פריט בין אחיו. מפתח שנבחר היטב מספק מידע רב יותר מהמיקום בתוך המערך. גם אם ה_מיקום_ משתנה עקב הזמנה מחדש, ה-`key` מאפשר לReact לזהות את הפריט לאורך כל חייו.

<Pitfall>

אתה עלול להתפתות ל-use אינדקס של פריט במערך כמפתח שלו. למעשה, זה מה שReact יעשה use אם לא תציין `key` בכלל. אבל הסדר שבו אתה מעבד פריטים ישתנה עם הזמן אם פריט יוכנס, יימחק, או אם המערך יסודר מחדש. אינדקס כמפתח מוביל לרוב לבאגים עדינים ומבלבלים.

באופן דומה, אל תיצור מפתחות תוך כדי תנועה, למשל. עם `key={Math.random()}`. זה יגרום למפתחות use לעולם לא להתאים בין עיבודים, מה שיוביל לכך שכל הרכיבים שלך וDOM ייצרו מחדש בכל פעם. לא רק שזה איטי, אלא שהוא גם יאבד כל קלט user בתוך פריטי הרשימה. במקום זאת, use מזהה יציב המבוסס על הנתונים.

שים לב שהרכיבים שלך לא יקבלו `key` כאביזר. זה רק used כרמז על ידי React עצמו. אם הרכיב שלך צריך מזהה, עליך להעביר אותו כאביזר נפרד: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

בעמוד זה למדת:

* איך להעביר נתונים מתוך רכיבים לתוך מבני נתונים כמו מערכים ואובייקטים.
* כיצד ליצור סטים של רכיבים דומים עם ה-`map()` של JavaScript.
* כיצד ליצור מערכים של פריטים מסוננים עם `filter()` של JavaScript.
* למה ואיך להגדיר `key` על כל רכיב באוסף כדי שReact יוכל לעקוב אחר כל אחד מהם גם אם המיקום או הנתונים שלו משתנים.

</Recap>



<Challenges>

#### פיצול רשימה לשניים {/*splitting-a-list-in-two*/}

דוגמה זו מציגה רשימה של כל האנשים.

שנה אותו כדי להציג שתי רשימות נפרדות בזו אחר זו: **כימאים** ו**כל השאר.** כמו בעבר, תוכל לקבוע אם אדם הוא כימאי על ידי בדיקה אם `person.profession === 'chemist'`.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

אתה יכול use `filter()` פעמיים, ליצור שני מערכים נפרדים, ולאחר מכן `map` על שניהם:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

בפתרון זה, הקריאות `map` ממוקמות ישירות בשורה ברכיבי האב `<ul>`, אבל אתה יכול להציג עבורם משתנים אם אתה מוצא את זה יותר קריא.

עדיין יש מעט כפילות בין הרשימות המעובדות. אתה יכול ללכת רחוק יותר ולחלץ את החלקים החוזרים על עצמם לתוך רכיב `<ListSection>`:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

קורא קשוב מאוד עשוי לשים לב שבשתי שיחות `filter`, אנו בודקים את המקצוע של כל אדם פעמיים. בדיקת נכס היא מהירה מאוד, אז בדוגמה זו זה בסדר. אם ההיגיון שלך היה יקר מזה, אתה יכול להחליף את הקריאות `filter` בלולאה שבונה ידנית את המערכים ובודקת כל אדם פעם אחת.

למעשה, אם `people` לעולם לא ישתנה, תוכל להעביר את הקוד הזה מהרכיב שלך. מנקודת המבט של React, כל מה שחשוב הוא שתיתן לו מערך של JSX צמתים בסופו של דבר. לא אכפת לי איך אתה מייצר את המערך הזה:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### רשימות מקוננות ברכיב אחד {/*nested-lists-in-one-component*/}

הכינו רשימה של מתכונים מהמערך הזה! עבור כל מתכון במערך, הצג את שמו כ-`<h2>` ורשום את המרכיבים שלו ב-`<ul>`.

<Hint>

זה ידרוש קינון של שתי קריאות `map` שונות.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

הנה דרך אחת שתוכל לעשות את זה:

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

כל אחד מה-`recipes` כבר כולל שדה `id`, אז זה מה שהלולאה החיצונית uses עבור `key` שלה. אין תעודה מזהה שאתה יכול use לגלגל מעל מרכיבים. עם זאת, סביר להניח שאותו מרכיב לא יופיע פעמיים באותו מתכון, כך ששמו יכול לשמש כ-`key`. לחלופין, תוכל לשנות את מבנה הנתונים כדי להוסיף מזהים, או לאינדקס use בתור `key` (עם אזהרה שלא תוכל לסדר מחדש בבטחה מרכיבים).

</Solution>

#### חילוץ רכיב פריט רשימה {/*extracting-a-list-item-component*/}

רכיב `RecipeList` זה מכיל שתי קריאות `map` מקוננות. כדי לפשט אותו, חלץ ממנו רכיב `Recipe` שיקבל `id`, `name` ו`ingredients` props. היכן ממקמים את ה-`key` החיצוני ומדוע?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

אתה יכול להעתיק ולהדביק את JSX מה-`map` החיצוני לתוך רכיב `Recipe` חדש ולהחזיר את ה-JSX הזה. לאחר מכן תוכל לשנות את `recipe.name` ל-`name`, `recipe.id` ל-`id` וכן הלאה, ולהעביר אותם כ-props ל-`Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

כאן, `<Recipe {...recipe} key={recipe.id} />` הוא קיצור תחביר שאומר "העבירו את כל המאפיינים של האובייקט `recipe` כ-props לרכיב `Recipe`". אתה יכול גם לכתוב כל אבזר במפורש: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**שימו לב שה-`key` מצוין ב-`<Recipe>` עצמו ולא בשורש `<div>` שהוחזר מ-`Recipe`.** זה בגלל שuse יש צורך ב-`key` ישירות בהקשר של המערך שמסביב. בעבר, היה לך מערך של `<div>`s אז כל אחד מהם היה צריך `key`, אבל עכשיו יש לך מערך של `<Recipe>`s. במילים אחרות, כאשר אתה מחלץ רכיב, אל תשכח להשאיר את `key` מחוץ ל-JSX שאתה מעתיק והדבק.

</Solution>

#### רשימה עם מפריד {/*list-with-a-separator*/}

דוגמה זו מציגה הייקו מפורסם מאת Tachibana Hokushi, כאשר כל שורה עטופה בתג `<p>`. התפקיד שלך הוא להכניס מפריד `<hr />` בין כל פסקה. המבנה שהתקבל צריך להיראות כך:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

הייקו מכיל רק שלוש שורות, אבל הפתרון שלך צריך לעבוד עם כל מספר של שורות. שימו לב שאלמנטים `<hr />` מופיעים רק *בין* האלמנטים `<p>`, לא בהתחלה או בסוף!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(זהו מקרה נדיר שבו אינדקס כמפתח הוא מקובל שכן use שורות של שיר לעולם לא יסדרו מחדש.)

<Hint>

תצטרך להמיר `map` ללולאה ידנית, או use ל-Fragment.

</Hint>

<Solution>

אתה יכול לכתוב לולאה ידנית, תוך הכנסת `<hr />` ו`<p>...</p>` למערך הפלט תוך כדי:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

השימוש באינדקס השורה המקורי בתור `key` לא עובד יותר מכיוון שuse כל מפריד ופסקה נמצאים כעת באותו מערך. עם זאת, אתה יכול לתת לכל אחד מהם מפתח מובחן באמצעות סיומת, למשל. `key={i + '-text'}`.

לחלופין, תוכל לעבד אוסף של Fragments המכילים `<hr />` ו-`<p>...</p>`. עם זאת, תחביר הקיצור `<>...</>` אינו תומך בהעברת מפתחות, אז תצטרך לכתוב `<Fragment>` במפורש:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

זכור, Fragments (נכתב לעתים קרובות כ-`<> </>`) מאפשרים לך לקבץ צמתים JSX מבלי להוסיף `<div>`s נוספים!

</Solution>

</Challenges>
