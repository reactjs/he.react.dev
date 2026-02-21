---
title: "עדכון אובייקטים ב-State"
---

<Intro>

מצב יכול להחזיק כל סוג של ערך JavaScript, כולל אובייקטים. אבל אתה לא צריך לשנות אובייקטים שאתה מחזיק ב-React state ישירות. במקום זאת, כאשר ברצונך לעדכן אובייקט, עליך ליצור אובייקט חדש (או ליצור עותק של אובייקט קיים), ולאחר מכן להגדיר את ה-state ל-use העותק הזה.

</Intro>

<YouWillLearn>

- כיצד לעדכן נכון אובייקט ב-React state
- כיצד לעדכן אובייקט מקונן מבלי לשנות אותו
- מהי אי-שינוי, ואיך לא לשבור אותה
- איך להפוך את העתקת האובייקטים לפחות חוזרת על עצמה עם Immer

</YouWillLearn>

## מהי מוטציה? {/*whats-a-mutation*/}

אתה יכול לאחסן כל סוג של ערך JavaScript ב-state.

```js
const [x, setX] = useState(0);
```

עד כה עבדת עם מספרים, מחרוזות ובוליאנים. סוגים אלה של ערכי JavaScript הם "בלתי ניתנים לשינוי", כלומר בלתי ניתנים לשינוי או "לקריאה בלבד". אתה יכול להפעיל עיבוד מחדש ל-_replace_ ערך:

```js
setX(5);
```

ה-`x` state השתנה מ-`0` ל-`5`, אך ה-_מספר `0` עצמו_ לא השתנה. לא ניתן לבצע שינויים כלשהם בערכים הפרימיטיביים המובנים כמו מספרים, מחרוזות ובוליאנים ב-JavaScript.

עכשיו שקול אובייקט ב-state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

מבחינה טכנית, אפשר לשנות את התוכן של _האובייקט עצמו_. **זה נקרא מוטציה:**

```js
position.x = 5;
```

עם זאת, למרות שאובייקטים ב-React state ניתנים לשינוי מבחינה טכנית, עליך להתייחס אליהם **כאילו** הם בלתי ניתנים לשינוי - כמו מספרים, בוליאנים ומחרוזות. במקום לשנות אותם, תמיד כדאי להחליף אותם.

## התייחס ל-state כאל קריאה בלבד {/*treat-state-as-read-only*/}

במילים אחרות, עליך **להתייחס לכל אובייקט JavaScript שהכנסת ל-state כאל קריאה בלבד.**

דוגמה זו מכילה אובייקט ב-state כדי לייצג את מיקום המצביע הנוכחי. הנקודה האדומה אמורה לזוז כאשר אתה נוגע או מעביר את הסמן מעל אזור התצוגה המקדימה. אבל הנקודה נשארת במיקום ההתחלתי:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

הבעיה היא עם קטע הקוד הזה.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

קוד זה משנה את האובייקט שהוקצה ל`position` מ[העיבוד הקודם.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) אבל ללא שימוש בפונקציית ההגדרה state, לReact אין מושג שהאובייקט השתנה. אז React לא עושה שום דבר בתגובה. זה כמו לנסות לשנות את הסדר אחרי שכבר אכלת את הארוחה. למרות ששינוי state יכול לעבוד במקרים מסוימים, אנחנו לא ממליצים על זה. עליך להתייחס לערך state שיש לך גישה אליו בעיבוד כקריאה בלבד.

כדי למעשה [להפעיל עיבוד מחדש](/learn/state-as-a-snapshot#setting-state-triggers-renders) במקרה זה, **צור אובייקט *חדש* והעביר אותו לפונקציית ההגדרה state:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

עם `setPosition`, אתה אומר לReact:

* החלף את `position` באובייקט חדש זה
* ועבד את הרכיב הזה שוב

שים לב כיצד הנקודה האדומה עוקבת כעת אחר המצביע שלך כאשר אתה נוגע או מרחף מעל אזור התצוגה המקדימה:

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### מוטציה מקומית בסדר {/*local-mutation-is-fine*/}

קוד כזה הוא בעיה כיuse הוא משנה אובייקט *קיים* בstate:

```js
position.x = e.clientX;
position.y = e.clientY;
```

אבל קוד כזה הוא **בהחלט בסדר** כיuse אתה עושה מוטציה לאובייקט חדש שיצרת *זה עתה*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

למעשה, זה שווה לחלוטין לכתוב את זה:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

מוטציה היא בעיה רק ​​כאשר אתה משנה אובייקטים *קיימים* שכבר נמצאים ב-state. שינוי של אובייקט שזה עתה יצרת זה בסדר מכיוון שעדיין אין קוד אחר שמפנה אליו.* שינוי זה לא ישפיע בטעות על משהו שתלוי בו. זה נקרא "מוטציה מקומית". אתה יכול אפילו לעשות מוטציה מקומית [תוך כדי רינדור.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) מאוד נוח ובסדר לגמרי!

</DeepDive>  

## העתקת אובייקטים עם תחביר הפיזור {/*copying-objects-with-the-spread-syntax*/}

בדוגמה הקודמת, האובייקט `position` נוצר תמיד טרי ממיקום הסמן הנוכחי. אבל לעתים קרובות, תרצה לכלול נתונים *קיימים* כחלק מהאובייקט החדש שאתה יוצר. לדוגמה, ייתכן שתרצה לעדכן *רק אחד* שדה בטופס, אך השאר את הערכים הקודמים עבור כל שאר השדות.

שדות קלט אלה אינם פועלים מכיוון שuse המטפלים `onChange` משנים את ה-state:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

לדוגמה, שורה זו משנה את ה-state מעיבוד עבר:

```js
person.firstName = e.target.value;
```

הדרך האמינה לקבל את ההתנהגות שאתה מחפש היא ליצור אובייקט חדש ולהעביר אותו ל-`setPerson`. אבל כאן, אתה רוצה גם **להעתיק את הנתונים הקיימים לתוכו** מכיוון שרק אחד מהשדות השתנה:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

אתה יכול use את התחביר `...` [תחביר אובייקט](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) כך שלא תצטרך להעתיק כל מאפיין בנפרד.

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

עכשיו הטופס עובד!

שימו לב איך לא הכרזתם על משתנה state נפרד עבור כל שדה קלט. עבור טפסים גדולים, שמירה על כל הנתונים מקובצים באובייקט נוחה מאוד - כל עוד אתה מעדכן אותו כראוי!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

שימו לב שהתחביר התפשטות `...` הוא "רדוד" - הוא מעתיק רק דברים לעומק ברמה אחת. זה הופך אותו למהיר, אבל זה גם אומר שאם אתה רוצה לעדכן מאפיין מקונן, תצטרך use אותו יותר מפעם אחת.

<DeepDive>

#### שימוש במטפל אירוע יחיד עבור שדות מרובים {/*using-a-single-event-handler-for-multiple-fields*/}

אתה יכול גם use את הסוגרים `[` ו`]` בתוך הגדרת האובייקט שלך כדי לציין מאפיין עם שם דינמי. הנה אותה דוגמה, אבל עם מטפל באירוע בודד במקום שלושה שונים:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

כאן, `e.target.name` מתייחס למאפיין `name` שניתן לרכיב ``<input>`` DOM.

</DeepDive>

## עדכון אובייקט מקונן {/*updating-a-nested-object*/}

שקול מבנה אובייקט מקונן כמו זה:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

אם רצית לעדכן את `person.artwork.city`, ברור איך לעשות את זה עם מוטציה:

```js
person.artwork.city = 'New Delhi';
```

אבל ב-React, אתה מתייחס ל-state כבלתי ניתן לשינוי! כדי לשנות את `city`, תחילה יהיה עליך לייצר את האובייקט `artwork` החדש (מאוכלס מראש בנתונים מהקודם), ולאחר מכן לייצר את האובייקט `person` החדש שמצביע על `artwork` החדש:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

או, כתוב כקריאת פונקציה אחת:

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

זה נהיה קצת מלל, אבל זה עובד מצוין עבור מקרים רבים:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### אובייקטים לא ממש מקוננים {/*objects-are-not-really-nested*/}

אובייקט כמו זה מופיע "מקנן" בקוד:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

עם זאת, "קינון" הוא דרך לא מדויקת לחשוב על איך חפצים מתנהגים. כאשר הקוד מופעל, אין דבר כזה אובייקט "קנן". אתה באמת מסתכל על שני אובייקטים שונים:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

האובייקט `obj1` אינו "בתוך" `obj2`. לדוגמה, `obj3` יכול "להצביע" גם על `obj1`:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

אם היית משנה את `obj3.artwork.city`, זה ישפיע גם על `obj2.artwork.city` וגם על `obj1.city`. זה בגלל שuse `obj3.artwork`, `obj2.artwork` ו`obj1` הם אותו אובייקט. קשה לראות את זה כשחושבים על חפצים כ"מקוננים". במקום זאת, הם אובייקטים נפרדים "המצביעים" זה על זה עם מאפיינים.

</DeepDive>  

### כתוב היגיון עדכון תמציתי עם Immer {/*write-concise-update-logic-with-immer*/}

אם ה-state שלך מקונן עמוק, אולי תרצה לשקול [לשטח אותו.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) אבל, אם אינך רוצה לשנות את מבנה ה-state שלך, אולי תעדיף קיצור דרך למכשולים מקוננים. [Immer](https://github.com/immerjs/use-immer) היא ספרייה פופולרית המאפשרת לך לכתוב באמצעות התחביר הנוח אך המשתנה ודואגת לייצר עבורך את העותקים. עם Immer, הקוד שאתה כותב נראה כאילו אתה "שובר את הכללים" ומשנה אובייקט:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

אבל בניגוד למוטציה רגילה, היא לא מחליפה את העבר state!

<DeepDive>

#### איך Immer עובד? {/*how-does-immer-work*/}

ה-`draft` שמסופק על ידי Immer הוא סוג מיוחד של אובייקט, הנקרא [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), ש"מתעד" את מה שאתה עושה איתו. זו הסיבה שאתה יכול לבצע מוטציה חופשית ככל שתרצה! מתחת למכסה המנוע, Immer מגלה אילו חלקים של `draft` שונו, ומייצר אובייקט חדש לחלוטין שמכיל את ה-its שלך.

</DeepDive>

כדי לנסות את Immer:

1. הפעל את `npm install use-immer` כדי להוסיף Immer כתלות
2. לאחר מכן החלף את `import { useState } from 'react'` ב-`import { useImmer } from 'use-immer'`

להלן הדוגמה שלמעלה המרה ל-Immer:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

שימו לב לכמה יותר תמציתיים הפכו מטפלי האירועים. אתה יכול לערבב ולהתאים את `useState` ו`useImmer` ברכיב בודד כמה שתרצה. Immer היא דרך מצוינת לשמור על מטפלי העדכונים תמציתיים, במיוחד אם יש קינון ב-state שלך, והעתקת אובייקטים מובילה לקוד שחוזר על עצמו.

<DeepDive>

#### מדוע לא מומלץ לבצע מוטציה ב-state ב-React? {/*why-is-mutating-state-not-recommended-in-react*/}

יש כמה סיבות:

* **ניפוי באגים:** אם תעשה use `console.log` ולא תשנה את state, יומני העבר שלך לא יקבלו את השינויים האחרונים ב-state. אז אתה יכול לראות בבירור כיצד state השתנה בין עיבודים.
* **אופטימיזציות:** React נפוצות [אסטרטגיות אופטימיזציה](/reference/react/memo) מסתמכות על דילוג על עבודה אם props או state קודמים זהים לאלה הבאים. אם אף פעם לא תבצע מוטציה ב-state, זה מהר מאוד לבדוק אם היו שינויים כלשהם. אם `prevObj === obj`, אתה יכול להיות בטוח ששום דבר לא יכול היה להשתנות בתוכו.
* **תכונות חדשות:** התכונות החדשות של React שאנו בונים מסתמכות על כך ש-state יטופלו כמו תמונת מצב.](/learn/state-as-a-snapshot) אם אתה משנה גרסאות קודמות של state, זה עלול למנוע ממך להשתמש בתכונות החדשות.
* **שינויי דרישה:** תכונות מסוימות של יישום, כמו הטמעת ביטול/בצע מחדש, הצגת היסטוריית שינויים או מתן אפשרות ל-user לאפס טופס לערכים קודמים יותר, קלות יותר לביצוע כאשר שום דבר לא משתנה. זה בגלל use אתה יכול לשמור עותקים קודמים של state ב-memory, ולחדשuse אותם כאשר מתאים. אם אתה מתחיל עם גישה מוטטיבית, תכונות כמו זו יכול להיות קשה להוסיף מאוחר יותר.
* **יישום פשוט יותר:** Because React אינו מסתמך על מוטציה, הוא לא צריך לעשות שום דבר מיוחד עם החפצים שלך. זה לא צריך לחטוף את המאפיינים שלהם, תמיד לעטוף אותם לתוך Proxies, או לעשות עבודה אחרת באתחול כפי שעושים הרבה פתרונות "ריאקטיביים". זו גם הסיבה ש-React מאפשר לך להכניס כל אובייקט לתוך state--לא משנה כמה גדול--ללא מלכודות ביצועים נוספות או נכונות.

בפועל, לעתים קרובות אתה יכול "לברוח" עם מוטציה של state ב-React, אך אנו ממליצים בחום לא לעשות זאת כדי שתוכלו use תכונות חדשות של React שפותחו תוך מחשבה על גישה זו. תורמים עתידיים ואולי אפילו העצמי העתידי שלך יודו לך!

</DeepDive>

<Recap>

* התייחס לכל state ב-React כבלתי ניתנים לשינוי.
* כאשר אתה מאחסן אובייקטים ב-state, מוטציה שלהם לא תפעיל עיבודים ותשנה את ה-state ב-"תצלומי מצב" קודמים.
* במקום לבצע מוטציה של אובייקט, צור גרסה *חדשה* שלו, והפעל עיבוד מחדש על ידי הגדרת state אליו.
* אתה יכול use את תחביר הפצת האובייקט `{...obj, something: 'newValue'}` כדי ליצור עותקים של אובייקטים.
* תחביר התפשטות רדוד: הוא מעתיק רק רמה אחת לעומק.
* כדי לעדכן אובייקט מקונן, עליך ליצור עותקים עד למעלה מהמקום שאתה מעדכן.
* כדי להפחית קוד העתקה חוזרת, use Immer.

</Recap>



<Challenges>

#### תקן עדכוני state שגויים {/*fix-incorrect-state-updates*/}

בטופס הזה יש כמה באגים. לחץ על הכפתור שמעלה את הניקוד כמה פעמים. שימו לב שזה לא עולה. לאחר מכן ערכו את השם הפרטי, ושימו לב שהניקוד פתאום "הדביק" את השינויים שלכם. לבסוף, ערכו את שם המשפחה ושימו לב שהניקוד נעלם לחלוטין.

המשימה שלך היא לתקן את כל הבאגים האלה. כשתתקן אותם, הסביר מדוע כל אחד מהם קורה.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

הנה גרסה עם שני הבאגים שתוקנו:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

הבעיה עם `handlePlusClick` הייתה שהוא שינה את האובייקט `player`. כתוצאה מכך, React לא ידע שיש סיבה לעיבוד מחדש, ולא עדכן את הניקוד על המסך. זו הסיבה שכאשר ערכת את השם הפרטי, ה-state עודכן, והפעיל עיבוד מחדש אשר _גם_ עדכן את הניקוד על המסך.

הבעיה עם `handleLastNameChange` הייתה שהוא לא העתיק את שדות `...player` הקיימים לאובייקט החדש. זו הסיבה שהניקוד הלך לאיבוד לאחר שערכת את שם המשפחה.

</Solution>

#### מצא ותקן את המוטציה {/*find-and-fix-the-mutation*/}

יש תיבה הניתנת לגרירה על רקע סטטי. אתה יכול לשנות את צבע התיבה באמצעות קלט הבחירה.

אבל יש באג. אם תזיז קודם את הקופסה, ולאחר מכן תשנה את צבעה, הרקע (שאינו אמור לזוז!) "יקפוץ" למיקום התיבה. אבל זה לא אמור לקרות: התמיכה `position` של `Background` מוגדרת ל-`initialPosition`, שהיא `{ x: 0, y: 0 }`. מדוע הרקע זז לאחר שינוי הצבע?

מצא את הבאג ותקן אותו.

<Hint>

אם משהו לא צפוי משתנה, יש מוטציה. מצא את המוטציה ב-`App.js` ותקן אותה.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

הבעיה הייתה במוטציה בתוך `handleMove`. זה שינה את `shape.position`, אבל זה אותו אובייקט ש`initialPosition` מצביע עליו. זו הסיבה שגם הצורה וגם הרקע זזים. (זו מוטציה, כך שהשינוי לא משתקף על המסך עד שעדכון לא קשור - שינוי הצבע - מפעיל עיבוד מחדש.)

התיקון הוא להסיר את המוטציה מ`handleMove`, וuse את תחביר התפשטות כדי להעתיק את הצורה. שימו לב ש-`+=` היא מוטציה, לכן עליכם לשכתב אותה ל-use פעולת `+` רגילה.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### עדכן אובייקט באמצעות Immer {/*update-an-object-with-immer*/}

זו אותה דוגמה באגי כמו באתגר הקודם. הפעם, תקן את המוטציה באמצעות Immer. לנוחיותך, `useImmer` כבר מיובא, אז עליך לשנות את המשתנה `shape` state ל-use אותו.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

זה הפתרון שנכתב מחדש עם Immer. שימו לב כיצד המטפלים באירועים נכתבים בצורה משתנה, אך הבאג אינו מתרחש. זה בגלל use מתחת למכסה המנוע, Immer אף פעם לא משנה את האובייקטים הקיימים.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</Solution>

</Challenges>

