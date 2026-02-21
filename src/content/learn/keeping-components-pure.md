---
title: "שמירה על טהרת הרכיבים"
---

<Intro>

חלק מפונקציות JavaScript הן *טהורות.* פונקציות טהורות מבצעות רק חישוב ותו לא. על ידי כתיבת הרכיבים שלך כפונקציות טהורות בלבד, אתה יכול למנוע מחלקה שלמה של באגים מביכים והתנהגות בלתי צפויה ככל שבסיס הקוד שלך גדל. עם זאת, כדי לקבל את ההטבות הללו, יש כמה כללים שעליך לעקוב אחריהם.

</Intro>

<YouWillLearn>

* מהי טוהר וכיצד זה עוזר לך להימנע מבאגים
* איך לשמור על רכיבים טהורים על ידי שמירת שינויים משלב העיבוד
* איך use מצב קפדני כדי למצוא טעויות ברכיבים שלך

</YouWillLearn>

## טוהר: רכיבים כנוסחאות {/*purity-components-as-formulas*/}

במדעי המחשב (ובמיוחד בעולם התכנות הפונקציונלי), [פונקציה טהורה](https://wikipedia.org/wiki/Pure_function) היא פונקציה בעלת המאפיינים הבאים:

* **זה מתעסק בעניינים שלו.** זה לא משנה אובייקטים או משתנים שהיו קיימים לפני שהוא נקרא.
* **אותן כניסות, אותו פלט.** בהינתן אותן כניסות, פונקציה טהורה צריכה תמיד להחזיר את אותה תוצאה.

אולי אתה כבר מכיר דוגמה אחת לפונקציות טהורות: נוסחאות במתמטיקה.

שקול את הנוסחה המתמטית הזו: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

אם <Math><MathI>x</MathI> = 2</Math> אז <Math><MathI>y</MathI> = 4</Math>. תָמִיד.

אם <Math><MathI>x</MathI> = 3</Math> אז <Math><MathI>y</MathI> = 6</Math>. תָמִיד.

אם <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> לפעמים לא יהיה <Math>9</Math> או <Math>–1</Math> או <Math>2.5</Math> בהתאם לשעה ביום או ל-state של שוק המניות.

אם <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> ו-<Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> יהיה _תמיד_ <Math>6</Math>.

אם נהפוך את זה לפונקציה JavaScript, זה ייראה כך:

```js
function double(number) {
  return 2 * number;
}
```

בדוגמה שלמעלה, `double` היא **פונקציה טהורה.** אם תעביר אותה `3`, היא תחזיר `6`. תָמִיד.

React עוצב סביב הרעיון הזה. **React מניח שכל רכיב שאתה כותב הוא פונקציה טהורה.** זה אומר שרכיבי React שאתה כותב חייבים תמיד להחזיר את אותו JSX בהינתן אותן כניסות:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

כאשר תעביר את `drinkers={2}` ל-`Recipe`, הוא יחזיר את JSX המכיל `2 cups of water`. תָמִיד.

אם תעבור את `drinkers={4}`, הוא יחזיר את JSX המכיל `4 cups of water`. תָמִיד.

ממש כמו נוסחה מתמטית.

אתה יכול לחשוב על הרכיבים שלך כעל מתכונים: אם תעקבו אחריהם ולא תכניסו מרכיבים חדשים בתהליך הבישול, תקבלו את אותה המנה בכל פעם. ה"צלחת" הזו היא ה-JSX שהרכיב מגיש ל-React ל-[עיבוד.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## תופעות לוואי: השלכות (לא) מתוכננות {/*side-effects-unintended-consequences*/}

תהליך העיבוד של React חייב להיות טהור תמיד. רכיבים צריכים רק *להחזיר* את JSX שלהם, ולא *לשנות* אובייקטים או משתנים שהיו קיימים לפני העיבוד - מה שיהפוך אותם לטמאים!

הנה רכיב ששובר את הכלל הזה:

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

רכיב זה קורא וכותב משתנה `guest` המוצהר מחוץ לו. זה אומר ש**קריאה לרכיב זה מספר פעמים תפיק JSX שונה!** ויותר מכך, אם _שאר_ רכיבים יקראו `guest`, הם יפיקו גם JSX שונה, בהתאם למועד העיבוד שלהם! זה לא צפוי.

אם נחזור לנוסחה שלנו <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, כעת גם אם <Math><MathI>x</MathI> = 2</Math>, איננו יכולים לסמוך על כך ש<Math><MathI>y</MathI> = 4</Math>. הבדיקות שלנו עלולות להיכשל, ה-users שלנו יהיו מבולבלים, מטוסים ייפלו מהשמיים - אתם יכולים לראות איך זה יוביל לבאגים מבלבלים!

אתה יכול לתקן את הרכיב הזה על ידי [העברת `guest` כאביזר במקום](/learn/passing-props-to-a-component):

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

כעת הרכיב שלך טהור, מכיוון שה-JSX שהוא מחזיר תלוי רק באביזר `guest`.

באופן כללי, אין לצפות שהרכיבים שלך יוצגו בסדר מסוים. זה לא משנה אם אתה קורא <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> לפני או אחרי <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: שתי הנוסחאות ייפתרו ללא תלות זו בזו. באותו אופן, כל רכיב צריך רק "לחשוב על עצמו", ולא לנסות לתאם או להיות תלוי באחרים במהלך העיבוד. עיבוד הוא כמו בחינה בבית הספר: כל רכיב צריך לחשב JSX בעצמו!

<DeepDive>

#### זיהוי חישובים לא טהורים עם StrictMode {/*detecting-impure-calculations-with-strict-mode*/}

למרות שאולי עדיין לא useד את כולם, ב-React ישנם שלושה סוגים של קלט שניתן לקרוא תוך כדי רינדור: [props](/learn/passing-props-to-a-component), [state](/learn/state__-a-component) [הקשר.](/learn/passing-data-deeply-with-context) אתה תמיד צריך להתייחס לקלט אלה כאל קריאה בלבד.

כאשר אתה רוצה *לשנות* משהו בתגובה לקלט user, עליך [להגדיר state](/learn/state-a-components-memory) במקום לכתוב למשתנה. לעולם אל תשנה משתנים או אובייקטים קיימים בזמן שהרכיב שלך מעבד.

React מציע "מצב קפדני" בו הוא קורא לפונקציה של כל רכיב פעמיים במהלך הפיתוח. **על ידי קריאה לפונקציות הרכיב פעמיים, מצב קפדני עוזר למצוא רכיבים שמפרים את הכללים האלה.**

שימו לב כיצד הדוגמה המקורית הציגה "אורח מס' 2", "אורח מס' 4" ו"אורח מס' 6" במקום "אורח מס' 1", "אורח מס' 2" ו"אורח מס' 3". הפונקציה המקורית הייתה לא טהורה, אז הקריאה לה פעמיים שברה אותה. אבל הגרסה הטהורה הקבועה עובדת גם אם הפונקציה נקראת פעמיים בכל פעם. **פונקציות טהורות מחושבות רק, כך שקריאה להן פעמיים לא תשנה שום דבר**--בדיוק כמו שקריאה ל-`double(2)` פעמיים לא משנה את מה שמוחזר, ופתרון <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> פעמיים לא משנה מה זה <MathI>y</MathI>. אותן כניסות, אותן יציאות. תָמִיד.

למצב קפדני אין השפעה בייצור, כך שהוא לא יאט את האפליקציה עבור ה-users שלכם. כדי להצטרף למצב קפדני, אתה יכול לעטוף את רכיב השורש שלך לתוך `<React.StrictMode>`. מסגרות מסוימות עושות זאת כברירת מחדל.

</DeepDive>

### מוטציה מקומית: הסוד הקטן של הרכיב שלך {/*local-mutation-your-components-little-secret*/}

בדוגמה שלמעלה, הבעיה הייתה שהרכיב שינה משתנה *קיים* בזמן הרינדור. זה נקרא לעתים קרובות **"מוטציה"** כדי לגרום לזה להישמע קצת יותר מפחיד. פונקציות טהורות אינן מבצעות מוטציה של משתנים מחוץ להיקף הפונקציה או לאובייקטים שנוצרו לפני הקריאה - מה שהופך אותם לטמאים!

עם זאת, **זה בסדר גמור לשנות משתנים ואובייקטים שיצרת *רק* תוך כדי רינדור.** בדוגמה זו, אתה יוצר מערך `[]`, מקצה אותו למשתנה `cups` ולאחר מכן `push` תריסר כוסות לתוכו:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

אם המשתנה `cups` או מערך `[]` נוצרו מחוץ לפונקציה `TeaGathering`, זו תהיה בעיה ענקית! היית משנה אובייקט *קיים* על ידי דחיפת פריטים למערך הזה.

עם זאת, זה בסדר כי use יצרת אותם *במהלך אותו עיבוד*, בתוך `TeaGathering`. אף קוד מחוץ ל-`TeaGathering` לא יידע לעולם שזה קרה. זה נקרא **"מוטציה מקומית"** - זה כמו הסוד הקטן של הרכיב שלך.

## איפה אתה _יכול_ לתתuse תופעות לוואי {/*where-you-_can_-cause-side-effects*/}

בעוד שתכנות פונקציונלי מסתמך במידה רבה על טוהר, בשלב מסוים, איפשהו, _משהו_ חייב להשתנות. זו בדיוק הנקודה של התכנות! השינויים האלה - עדכון המסך, התחלת אנימציה, שינוי הנתונים - נקראים **תופעות לוואי.** אלו דברים שקורים _"בצד"_, לא במהלך העיבוד.

ב-React, **תופעות הלוואי בדרך כלל שייכות ל[מטפלים באירועים.](/learn/reponding-to-events)** מטפלי אירועים הם פונקציות ש-React פועלות כאשר אתה מבצע פעולה כלשהי - לדוגמה, כאשר אתה לוחץ על כפתור. למרות שמטפלי אירועים מוגדרים *בתוך* הרכיב שלך, הם לא פועלים *במהלך* רינדור! **אז מטפלי אירועים לא צריכים להיות טהורים.**

אם מיצית את כל האפשרויות האחרות ואינך מוצא את המטפל המתאים לאירועים עבור תופעת הלוואי שלך, אתה עדיין יכול לצרף אותו ל-JSX שהוחזר באמצעות קריאה [`useEffect`](/reference/react/useEffect) ברכיב שלך. זה אומר לReact לבצע אותו מאוחר יותר, לאחר רינדור, כאשר תופעות לוואי מותרות. **עם זאת, גישה זו צריכה להיות המוצא האחרון שלך.**

במידת האפשר, נסה להביע את ההיגיון שלך באמצעות רינדור בלבד. תופתעו כמה רחוק זה יכול לקחת אתכם!

<DeepDive>

#### למה ל-React אכפת מהטוהר? {/*why-does-react-care-about-purity*/}

כתיבת פונקציות טהורות דורשת קצת הרגל ומשמעת. אבל זה גם פותח הזדמנויות נפלאות:

* הרכיבים שלך יכולים לפעול בסביבה אחרת - לדוגמה, בשרת! מכיוון שהם מחזירים את אותה תוצאה עבור אותן קלט, רכיב אחד יכול לשרת בקשות user רבות.
* אתה יכול לשפר את הביצועים על ידי [דילוג על רינדור](/reference/react/memo) רכיבים שהקלט שלהם לא השתנה. זה בטוח מכיוון שפונקציות טהורות תמיד מחזירות את אותן תוצאות, כך שהן בטוחות לאחסון במטמון.
* אם נתונים מסוימים משתנים באמצע רינדור עץ רכיבים עמוק, React יכול להתחיל את הרינדור מבלי לבזבז זמן כדי לסיים את הרינדור המיושן. טוהר מבטיח להפסיק את החישוב בכל עת.

כל תכונה חדשה של React שאנו בונים מנצלת את הטוהר. מאחזור נתונים ועד אנימציות ועד ביצועים, שמירה על ניקיון הרכיבים פותחת את הכוח של פרדיגמת React.

</DeepDive>

<Recap>

* רכיב חייב להיות טהור, כלומר:
  * **זה דואג לעניינים שלו.** זה לא אמור לשנות אובייקטים או משתנים שהיו קיימים לפני העיבוד.
  * **אותן כניסות, אותו פלט.** בהינתן אותן כניסות, רכיב צריך תמיד להחזיר את אותו JSX. 
* עיבוד יכול להתרחש בכל עת, כך שרכיבים לא צריכים להיות תלויים ברצף העיבוד של זה.
* אסור לשנות אף אחת מהכניסות שהרכיבים שלך use לעיבוד. זה כולל props, state והקשר. כדי לעדכן את המסך, ["הגדר" state](/learn/state-a-components-memory) במקום לבצע מוטציה של אובייקטים קיימים.
* השתדל לבטא את ההיגיון של הרכיב שלך ב-JSX שאתה מחזיר. כאשר אתה צריך "לשנות דברים", בדרך כלל תרצה לעשות זאת במטפל באירועים. כמוצא אחרון, אתה יכול `useEffect`.
* כתיבת פונקציות טהורות דורשת מעט תרגול, אבל היא פותחת את הכוח של הפרדיגמה של React.

</Recap>


  
<Challenges>

#### תקן שעון מקולקל {/*fix-a-broken-clock*/}

רכיב זה מנסה להגדיר את המחלקה CSS של `<h1>` ל-`"night"` במהלך הזמן מחצות עד שש שעות בבוקר, ו`"day"` בכל הזמנים האחרים. עם זאת, זה לא עובד. האם אתה יכול לתקן את הרכיב הזה?

תוכל לוודא אם הפתרון שלך עובד על ידי שינוי זמני של אזור הזמן של המחשב. כאשר השעה הנוכחית היא בין חצות לשש בבוקר, השעון צריך להיות בצבעים הפוכים!

<Hint>

רינדור הוא *חישוב*, הוא לא צריך לנסות "לעשות" דברים. האם אתה יכול לבטא את אותו רעיון אחרת?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

אתה יכול לתקן את הרכיב הזה על ידי חישוב ה-`className` והכללתו בפלט העיבוד:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

בדוגמה זו, תופעת הלוואי (שינוי ה-DOM) לא הייתה הכרחית כלל. אתה רק צריך להחזיר JSX.

</Solution>

#### תקן פרופיל שבור {/*fix-a-broken-profile*/}

שני רכיבי `Profile` מוצגים זה לצד זה עם נתונים שונים. לחץ על "כווץ" בפרופיל הראשון ולאחר מכן "הרחב" אותו. תבחין ששני הפרופילים מציגים כעת את אותו אדם. זהו באג.

מצא את ה-cause של הבאג ותקן אותו.

<Hint>

קוד הבאגי נמצא ב-`Profile.js`. הקפד לקרוא הכל מלמעלה למטה!

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

הבעיה היא שהרכיב `Profile` כותב למשתנה קיים שנקרא `currentPerson`, והרכיבים `Header` ו`Avatar` קוראים ממנו. זה הופך את *שלושתם* לטמאים וקשים לניבוי.

כדי לתקן את הבאג, הסר את המשתנה `currentPerson`. במקום זאת, העבר את כל המידע מ-`Profile` ל-`Header` ו-`Avatar` דרך props. תצטרך להוסיף אבזר `person` לשני הרכיבים ולהעביר אותו עד הסוף.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

זכור שReact אינו מבטיח שפונקציות רכיבים יבוצעו בסדר מסוים, כך שלא תוכל לתקשר ביניהן על ידי הגדרת משתנים. כל תקשורת חייבת להתרחש דרך props.

</Solution>

#### תקן מגש סיפור שבור {/*fix-a-broken-story-tray*/}

המנכ"ל של החברה שלך מבקש ממך להוסיף "סיפורים" לאפליקציית השעון המקוון שלך, ואתה לא יכול להגיד לא. כתבת רכיב `StoryTray` שמקבל רשימה של `stories`, ואחריו מציין מיקום "צור סיפור".

יישמת את מציין המיקום "צור סיפור" על ידי דחיפה של סיפור מזויף אחד נוסף בסוף מערך `stories` שאתה מקבל כאביזר. אבל משום מה, "צור סיפור" מופיע יותר מפעם אחת. תקן את הבעיה.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

שימו לב איך בכל פעם שהשעון מתעדכן, "צור סיפור" מתווסף *פעמיים*. זה משמש כרמז לכך שיש לנו מוטציה במהלך העיבוד - מצב קפדני קורא לרכיבים פעמיים כדי להפוך את הבעיות הללו לבולטות יותר.

פונקציית `StoryTray` אינה טהורה. על ידי קריאה ל-`push` במערך `stories` שהתקבל (אחיזה!), זה משנה אובייקט שנוצר *לפני* `StoryTray` התחיל לעבד. זה הופך אותו לכרכרי וקשה מאוד לחזות אותו.

התיקון הפשוט ביותר הוא לא לגעת במערך כלל, ולעבד את "צור סיפור" בנפרד:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

לחלופין, תוכל ליצור מערך _new_ (על ידי העתקת הקיים) לפני שאתה דוחף פריט לתוכו:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

זה שומר על המוטציה שלך מקומית ופונקציית העיבוד שלך טהורה. עם זאת, אתה עדיין צריך להיות זהיר: למשל, אם ניסית לשנות כל אחד מהפריטים הקיימים של המערך, תצטרך לשכפל גם את הפריטים האלה.

זה useמלא לזכור אילו פעולות על מערכים מבצעות מוטציה שלהם, ואילו לא. לדוגמה, `push`, `pop`, `reverse` ו-`sort` ישתנו את המערך המקורי, אבל `slice`, `filter` ו`map` ייצרו מערך חדש.

</Solution>

</Challenges>
