---
title: "תיאור ה-UI"
---

<Intro>

React היא ספריית JavaScript לעיבוד ממשקי משתמש (UI). ממשק משתמש בנוי מיחידות קטנות כמו לחצנים, טקסט ותמונות. תגובה מאפשרת לך לשלב אותם לכדי *רכיבים ניתנים חוזרים, ניתנים לקינון.* מאטרי אינטרנט ועד אפליקציות טלפון, ניתן לפרק כל דבר על המסך לרכיבים. תגיב.

</Intro>

<YouWillLearn isChapter={true}>

* [כיצד לכתוב את הרכיב ה-React הראשון שלך](/learn/your-first-component)
* [מתי וכיצד ליצור קבצים מרובי רכיבים](/learn/importing-and-exporting-components)
* [כיצד להוסיף סימון ל-JavaScript עם JSX](/learn/writing-markup-with-jsx)
* [להשתמש בסוגרים מסולסלים עם JSX כדי לגשת לפונקציונליות שלך JavaScript מהרכיבים](/learn/javascript-in-jsx-with-curly-braces)
* [כיצד להגדיר רכיבים עם props](/learn/passing-props-to-a-component)
* [כיצד לעבד רכיבים באופן מותנה](/learn/conditional-rendering)
* [כיצד לעבד מספר רכיבים בו-זמנית](/learn/rendering-lists)
* [כיצד מבלבול באגים על ידי שמירה על רכיבים טהורים](/learn/keeping-components-pure)
* [מדוע הבנת ממשק המשתמש שלך כעצים היא שימושית](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## הרכיב הראשון שלך {/*הרכיב-הראשון-שלך*/}

ישומי React בנויים מחלקים מבודדים של ממשק משתמש הנקראים *רכיבים*. רכיב React הוא פונקציית JavaScript אתה יכול לפזר עם סימון. רכיבים יכולים להיות קטנים כמו כפתור, או גדולים כמו עמוד שלם. הנה רכיב 'גלריה' המציג שלושה רכיבי 'פרופיל':

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

קרא את **[הרכיב הראשון](/learn/your-first-component)** כדי ללמוד להשתמש ברכיבי React.

</LearnMore>

## ייבוא ​​וייצוא רכיבים {/*ייבוא-וייצוא-רכיבים*/}

אתה יכול להצהיר על רכיבים רבים בקובץ אחד, אבל קבצים גדולים יכולים להיות קשים לניווט. כדי לפתור זאת, אתה יכול *לייצא* רכיב לקובץ משלו, ולאחר מכן *לייבא* את הרכיב הזה מקובץ אחר:


<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

קרא את **[ייבוא ​​וייצוא רכיבים](/learn/importing-and-exporting-components)** כדי ללמוד כיצד לפצל רכיבים לקבצים משלהם.

</LearnMore>

## כתיבת סימון עם JSX {/*writing-markup-with-jsx*/}

כל הרכיב React הוא פונקציית JavaScript שעשויה להכיל סימון ש-React מעבד לדפדפן. רכיבי הגיבו משתמשים בסיומת תחביר הנקראת JSX כדי להציג את הסימון הזה. JSX נראה הרבה כמו HTML, אבל הוא קצת יותר מחמיר ויכול להציע מידע דינמי.

אם נדביק סימון HTML קיים ברכיב React, זה לא תמיד יעבוד:

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
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

אם יש לך HTML קיים כזה, אתה יכול לתקן אותו באמצעות [ממיר](https://transform.tools/html-to-jsx):

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
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

קרא את **[כתיבת סימון עם JSX](/learn/writing-markup-with-jsx)** כדי ללמוד איך לכתוב JSX חוקי.

</LearnMore>

## JavaScript ב-JSX עם פלטה מתולתת {/*javascript-in-jsx-with-curly-braces*/}

JSX יכול לכתוב סימון דמוי HTML בתוך קובץ JavaScript, תוך שמירה על רינדור ההיגיון והתוכן באותו מקום. לפעמים תרצה להוסיף קצת הגיון JavaScript או להתייחס למאפיין דינמי בתוך הסימון הזה. בstate זה, אתה יכול להשתמש בסוגרים מסולסלים ב-JSX שלך כדי "לפתוח חלון" ל-JavaScript:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

קרא את **[JavaScript ב-JSX עם פלטה מתולתת](/learn/javascript-in-jsx-with-curly- braces)** כדי ללמוד איך לגשת לנתוני JavaScript מ-JSX.

</LearnMore>

## העברת props לרכיב {/*העברת-props-לרכיב*/}

רכיבי React users ב-*props* כדי לתקשר עם זה. כל רכיב הורה יכול להעביר מידע מסוים לרכיבי על ידי מתן props. props יכולים להכיל תכונות HTML, אבל להעביר דרכם כל ערך JavaScript, כולל אובייקטים, מערכים, פונקציות אפילו JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

קרא את **[ העברה props לרכיב](/learn/passing-props-to-a-component)** כדי ללמוד להעביר ולקרוא props.

</LearnMore>

## עיבוד מותנה {/*עיבוד-מותנה*/}

הרכיבים שלך יצטרכו מסופקים שונים. ב-React, אתה יכול לבצע עיבוד מותנה של JSX באמצעות תחביר JavaScript כמו הצהרות `if`, `&&` ו`? :` מפעילים.

בדוגמה זו, האופרטור '&&' של JavaScript שימוש לעיבוד מותנה של סימן ביקורת:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

קרא את **[עיבוד מותנה](/learn/conditional-rendering)** כדי ללמוד את הדרכים השונות לעיבוד תוכן מותנה.

</LearnMore>

## רשימות עיבוד {/*רשימות-עיבוד*/}

קרוב תרצה להציג מספר רכיבים דומים מאוסף נתונים. אתה יכול להשתמש ב-'filter()' ו-'map()' של JavaScript עם React כדי לסנן ולהפוך את המערך שלך לרכיבים.

עבור כל פריט מערך, תפרט 'מפתח'. בדרך כלל, תרצה להשתמש במזהה ממסד עבור `מפתח`. קשים מסוגלים ל-React לעקוב אחר מקומו של כל פריט ברשימה גם אם הרשימה משתנה.

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
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

קרא את **[רשימות עיבוד](/learn/rendering-lists)** כדי ללמוד כיצד לעבד רשימה של רכיבים וכיצד לבחור מפתח.

</LearnMore>

## שמירה על טהרת הרכיבים {/*שמירה-הרכיבים-טהורים*/}

חלק פונקציות JavaScript הן *טה.* פונקציה טהורה:

* ** דואג לעניינים שלו.** זה לא משנה אובייקטים או משתנים שהיו קיימים לפני שנקרא.
* **אותן כניסות, אותו פלט.** בהינתן אותן כניסות, פונקציה טהורה צריכה תמיד להחזיר את אותה תוצאה.

על ידי כתיבת הרכיבים שלך כפונקציות טהורות בלבד, אתה יכול למנוע מחלקה שלמה של באגים מביכים והתנהגות בלתי צפויה ככל שבסיס הקוד שלך גדל. הנה דוגמה לרכיב לא טהור:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

אתה יכול להפוך את הרכיב הזה לטהור על ידי העברת props במקום שינוי משתנה קיים:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

קרא את **[Keeping Components Pure](/learn/keeping-components-pure)** כדי ללמוד כיצד לכתוב רכיבים כפונקציות טהורות וניתנות לחיזוי.

</LearnMore>

## ממשק המשתמש שלך כעץ {/*הממשק-שלך-כעץ*/}

תגובה משתמש בצים כדי לדגמן את היחסים בין רכיבים ומודולים. 

עץ רינדור React הוא ייצוג של יחסי ההורה והילד בין רכיבים.

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

עץ רינדור תגובה לדוגמה.

</Diagram>

רכיבים ליד ראש העץ, ליד מרכיב השורש, נחשבים לרכיבים ברמה העליונה. רכיבים ללא רכיבי צאצא הם רכיבי עלים. סיווג זה של רכיבים שימושי להבנת זרימת הנתונים וביצועי העיבוד.

מודלים של הקשר בין מודולי JavaScript היא דרך שימושית נוספת להבין את האפליקציה שלך. אנו מתחרים אליו כאל עץ תלות מודול.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

עץ תלות מודול לדוגמה.

</Diagram>

עץ תל כלי משמש כדרך בנייה כדי לאגד את כל הקוד ה-JavaScript הרלונטי עבור הלקוח להורדה ולעיבוד. גודל חבילה גדול מחזיר את חוויית המשתמש עבור אפליקציות React. הבנת עץ התלות של המודול מועיל לאיתור באגים מסוג זה.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

קרא את **[ממשק המשתמש שלך כעץ](/learn/understanding-your-ui-as-a-tree)** כדי ללמוד כיצד ליצור עיבוד ועצי תלות במודול עבור אפליקציית.

</LearnMore>


## מה הלאה? {/*מה-הבא*/}

עברו אל [הרכיב הראשון שלך](/learn/your-first-component) כדי להתחיל לקרוא את זה עמוד אחר עמוד!

או, אם אתה כבר מכיר את הנושאים האלה, למה שלא תקרא על [הוספת אינטראקטיביות](/learn/adding-interactivity)?

