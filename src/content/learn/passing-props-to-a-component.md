---
title: "העברת אביזרים לרכיב"
---

<Intro>

React רכיבים use *props* כדי לתקשר אחד עם השני. כל רכיב אב יכול להעביר מידע מסוים לרכיבי הצאצא שלו על ידי מתן props. אביזרים עשויים להזכיר לך את תכונות HTML, אבל אתה יכול להעביר דרכם כל ערך JavaScript, כולל אובייקטים, מערכים ופונקציות.

</Intro>

<YouWillLearn>

* איך להעביר את props לרכיב
* איך לקרוא props מתוך רכיב
* כיצד לציין ערכי ברירת מחדל עבור props
* איך להעביר כמה JSX לרכיב
* איך props משתנה עם הזמן

</YouWillLearn>

## מוכר props {/*familiar-props*/}

אביזרים הם המידע שאתה מעביר לתג JSX. לדוגמה, `className`, `src`, `alt`, `width` ו-`height` הם חלק מה-props שתוכלו להעביר ל-`<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

ה-props שאתה יכול להעביר לתג `<img>` מוגדרים מראש (ReactDOM תואם [לתקן HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). אבל אתה יכול להעביר כל props לרכיבים *שלכם*, כמו `<Avatar>`, כדי להתאים אותם. הנה איך להתאים אותם!

## העברת props לרכיב {/*passing-props-to-a-component*/}

בקוד זה, הרכיב `Profile` אינו מעביר שום props לרכיב הצאצא שלו, `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

אתה יכול לתת ל-`Avatar` כמה props בשני שלבים.

### שלב 1: העבר props לרכיב הצאצא {/*step-1-pass-props-to-the-child-component*/}

ראשית, העבירו כמה props ל-`Avatar`. לדוגמה, בוא נעביר שניים props: `person` (אובייקט), ו-`size` (מספר):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

אם סוגרים כפולים מתולתלים אחרי `person=` confuse אותך, זכור [הם רק אובייקט](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) בתוך ה-JSX.

</Note>

עכשיו אתה יכול לקרוא את props אלה בתוך רכיב `Avatar`.

### שלב 2: קרא את props בתוך רכיב הילד {/*step-2-read-props-inside-the-child-component*/}

אתה יכול לקרוא את props אלה על ידי רישום שמותיהם `person, size` מופרדים בפסיקים בתוך `({` ו`})` ישירות אחרי `function Avatar`. זה מאפשר לך use אותם בתוך קוד `Avatar`, כמו שהיית עושה עם משתנה.

```js
function Avatar({ person, size }) {
  // person and size are available here
}
```

הוסף קצת היגיון ל`Avatar` שuse הוא `person` ו`size` props לעיבוד, וסיימתם.

כעת אתה יכול להגדיר את `Avatar` לעיבוד בדרכים רבות ושונות עם props שונה. נסה לשנות את הערכים!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

אביזרים מאפשרים לך לחשוב על מרכיבי הורה וילד באופן עצמאי. לדוגמה, אתה יכול לשנות את ה-`person` או את ה-`size` props בתוך `Profile` מבלי שתצטרך לחשוב איך `Avatar` use מפעיל אותם. באופן דומה, אתה יכול לשנות את האופן שבו `Avatar` use הם props, מבלי להסתכל על `Profile`.

אתה יכול לחשוב על props כמו "כפתורים" שאתה יכול להתאים. הם משרתים את אותו תפקיד שבו ארגומנטים משמשים עבור פונקציות - למעשה, props _הם_ הארגומנט היחיד לרכיב שלך! פונקציות רכיב React מקבלים ארגומנט בודד, אובייקט `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

בדרך כלל אתה לא צריך את כל האובייקט `props` עצמו, אז אתה מפרק אותו ל-props בודד.

<Pitfall>

**אל תפספסו את צמד התלתלים `{` ו`}`** בתוך `(` ו`)` בעת הצהרה על props:

```js
function Avatar({ person, size }) {
  // ...
}
```

תחביר זה נקרא ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) והוא שווה ערך לקריאת מאפיינים מפרמטר פונקציה:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## ציון ערך ברירת מחדל עבור אבזר {/*specifying-a-default-value-for-a-prop*/}

אם אתה רוצה לתת לפרופס ערך ברירת מחדל לחזור עליו כאשר לא צוין ערך, אתה יכול לעשות זאת עם הרס על ידי הצבת `=` וערך ברירת המחדל מיד אחרי הפרמטר:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

כעת, אם `<Avatar person={...} />` מוצג ללא אבזר `size`, ה-`size` יוגדר ל-`100`.

ערך ברירת המחדל הוא used בלבד אם האביזר `size` חסר או אם עוברים את `size={undefined}`. אבל אם תעבור את `size={null}` או `size={0}`, ערך ברירת המחדל יהיה **לא** used.

## העברת props עם תחביר התפשטות JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

לפעמים, מעבר props חוזר על עצמו מאוד:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

אין שום דבר רע בקוד שחוזר על עצמו - הוא יכול להיות קריא יותר. אבל לפעמים אתה עשוי להעריך תמציתיות. חלק מהרכיבים מעבירים את כל ה-props שלהם לילדים שלהם, כמו איך שה-`Profile` הזה עושה עם `Avatar`. בגלל use הם לא use שום props שלהם ישירות, זה יכול להיות הגיוני use תחביר "מפוזר" תמציתי יותר:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

זה מעביר את כל ה-props של `Profile` ל-`Avatar` מבלי לרשום כל אחד מהשמות שלהם.

**השתמש בתחביר התפשטות עם איפוק.** אם אתה משתמש בו בכל רכיב אחר, משהו לא בסדר. לעתים קרובות, זה מציין שאתה צריך לפצל את הרכיבים שלך ולהעביר ילדים בתור JSX. עוד על כך בהמשך!

## עוברים JSX בתור ילדים {/*passing-jsx-as-children*/}

מקובל לקנן תגיות דפדפן מובנות:

```js
<div>
  <img />
</div>
```

לפעמים תרצה לקנן את הרכיבים שלך באותו אופן:

```js
<Card>
  <Avatar />
</Card>
```

כאשר אתה מקנן תוכן בתוך תג JSX, רכיב האב יקבל את התוכן הזה באביזר שנקרא `children`. לדוגמה, הרכיב `Card` להלן יקבל אבזר `children` שנקבע ל-`<Avatar />` ויעבד אותו ב-diver wrapper:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

נסה להחליף את `<Avatar>` בתוך `<Card>` בטקסט כלשהו כדי לראות כיצד הרכיב `Card` יכול לעטוף כל תוכן מקונן. זה לא צריך "לדעת" מה מוצג בתוכו. אתה תראה את הדפוס הגמיש הזה במקומות רבים.

אתה יכול לחשוב על רכיב עם אבזר `children` כבעל "חור" שניתן "למלא" על ידי רכיבי האב שלו עם JSX שרירותי. לעתים קרובות אתה use אביזר `children` עבור עטיפות חזותיות: לוחות, רשתות וכו'.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## איך props משתנה עם הזמן {/*how-props-change-over-time*/}

הרכיב `Clock` למטה מקבל שני props מהרכיב האב שלו: `color` ו-`time`. (קוד רכיב האב מושמט בגלל uses [state](/learn/state-a-components-memory), שעדיין לא נצלול אליו.)

נסה לשנות את הצבע בתיבת הבחירה למטה:

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

דוגמה זו ממחישה כי **רכיב עשוי לקבל props שונה לאורך זמן.** האביזרים אינם תמיד סטטיים! כאן, אביזר `time` משתנה כל שנייה, ואביזר `color` משתנה כאשר אתה בוחר צבע אחר. אביזרים משקפים נתונים של רכיב בכל נקודת זמן, ולא רק בהתחלה.

עם זאת, props הם [בלתי ניתנים לשינוי](https://en.wikipedia.org/wiki/Immutable_object)—a מונח ממדעי המחשב שפירושו "בלתי ניתן לשינוי". כאשר רכיב צריך לשנות את props שלו (לדוגמה, בתגובה לאינטראקציה user או נתונים חדשים), הוא יצטרך "לבקש" מהרכיב האב שלו להעביר אותו __K_4__ אובייקט ישן!___ לאחר מכן props יושלך הצידה, ובסופו של דבר מנוע JavaScript ידרוש בחזרה את memory שנלקח על ידם.

**אל תנסה "לשנות את props".** כאשר אתה צריך להגיב לקלט user (כמו שינוי הצבע שנבחר), תצטרך "להגדיר state", עליו תוכל ללמוד ב-[State: A Component's Memory.](/learn/state-TK_3____)ry

<Recap>

* כדי לעבור את props, הוסף אותם ל-JSX, בדיוק כמו שהיית עושה עם תכונות HTML.
* כדי לקרוא את props, use את תחביר ההסרה של `function Avatar({ person, size })`.
* אתה יכול לציין ערך ברירת מחדל כמו `size = 100`, שהוא used עבור חסר ו`undefined` props.
* אתה יכול להעביר את כל props עם `<Avatar {...props} />` JSX התחביר התפשט, אבל אל תגזים עםuse!
* JSX מקונן כמו `<Card><Avatar /></Card>` יופיע בתור רכיב `children` של רכיב `Card`.
* אביזרים הם צילומי מצב לקריאה בלבד בזמן: כל עיבוד מקבל גרסה חדשה של props.
* אתה לא יכול לשנות את props. כאשר אתה צריך אינטראקטיביות, תצטרך להגדיר state.

</Recap>



<Challenges>

#### חלץ רכיב {/*extract-a-component*/}

רכיב `Gallery` זה מכיל סימון דומה מאוד עבור שני פרופילים. חלץ ממנו רכיב `Profile` כדי להפחית את הכפילות. תצטרך לבחור איזה props להעביר אליו.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

התחל בחילוץ הסימון עבור אחד המדענים. לאחר מכן מצא את החלקים שאינם תואמים לו בדוגמה השנייה, והפוך אותם לניתנים להגדרה באמצעות props.

</Hint>

<Solution>

בפתרון זה, הרכיב `Profile` מקבל props מרובות: `imageId` (מחרוזת), `name` (מחרוזת), `profession` (מחרוזת), `awards` (מערך של מחרוזות), `discovery` (מחרוזת), ו__TK_6).

שימו לב שלפרוט `imageSize` יש ערך ברירת מחדל, וזו הסיבה שאנחנו לא מעבירים אותו לרכיב.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

שים לב כיצד אינך זקוק לאביזר `awardCount` נפרד אם `awards` הוא מערך. אז אתה יכול use `awards.length` לספור את מספר הפרסים. זכור שprops יכול לקחת כל ערכים, וזה כולל גם מערכים!

פתרון אחר, שדומה יותר לדוגמאות המוקדמות יותר בדף זה, הוא לקבץ את כל המידע על אדם באובייקט בודד, ולהעביר את האובייקט הזה כאביזר אחד:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

למרות שהתחביר נראה מעט שונה מכיוון שuse אתה מתאר מאפיינים של אובייקט JavaScript ולא אוסף של תכונות JSX, דוגמאות אלו מקבילות ברובן, ואתה יכול לבחור בכל אחת מהשיטות.

</Solution>

#### התאם את גודל התמונה על סמך אביזר {/*adjust-the-image-size-based-on-a-prop*/}

בדוגמה זו, `Avatar` מקבל אבזר `size` מספרי שקובע את הרוחב והגובה של `<img>`. התמיכה `size` מוגדרת ל-`40` בדוגמה זו. עם זאת, אם תפתחו את התמונה בלשונית חדשה, תבחינו שהתמונה עצמה גדולה יותר (`160` פיקסלים). גודל התמונה האמיתי נקבע לפי גודל התמונה הממוזערת שאתה מבקש.

שנה את הרכיב `Avatar` כדי לבקש את גודל התמונה הקרוב ביותר בהתבסס על `size` מאפיין. באופן ספציפי, אם ה-`size` קטן מ-`90`, העבר את `'s'` ("קטן") ולא `'b'` ("גדול") לפונקציה `getImageUrl`. ודא שהשינויים שלך פועלים על ידי רינדור אווטרים עם ערכים שונים של האביזר `size` ופתיחת תמונות בכרטיסייה חדשה.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

הנה איך אתה יכול ללכת על זה:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

תוכל גם להציג תמונה חדה יותר עבור מסכי DPI גבוהים על ידי התחשבות ב-[`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

אביזרים מאפשרים לך לכלול לוגיקה כזו בתוך רכיב `Avatar` (ולשנות אותו מאוחר יותר במידת הצורך) כך שכולם יוכלו use את רכיב `<Avatar>` מבלי לחשוב על איך התמונות מתבקשות וגודלן.

</Solution>

#### העברת JSX באבזר `children` {/*passing-jsx-in-a-children-prop*/}

חלץ רכיב `Card` מהסימון שלמטה, ו-use את האביזר `children` כדי להעביר אליו JSX שונה:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

כל JSX שתשים בתוך תג של רכיב יועבר כאביזר `children` לאותו רכיב.

</Hint>

<Solution>

כך תוכל use את הרכיב `Card` בשני המקומות:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

אתה יכול גם להפוך את `title` לאביזר נפרד אם אתה רוצה שלכל `Card` יהיה תמיד כותרת:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
