---
title: "JavaScript ב-JSX עם סוגרים מסולסלים"
---

<Intro>

JSX יכול לכתוב סימון דמוי HTML בתוך קובץ JavaScript, תוך שמירה על רינדור ההיגיון והתוכן באותו מקום. לפעמים תרצה להוסיף קצת הגיון JavaScript או להתייחס למאפיין דינמי בתוך הסימון הזה. בstate זה, אתה יכול להשתמש בסוגים מסולסלים ב-JSX שלך כדי לפתוח את החלון ל-JavaScript.

</Intro>

<YouWillLearn>

* איך להעביר מחרוזות עם מרכאות
* בתוך איך תייחס לשינוי JavaScript JSX עם פלטה מסולסלת
* איך לקרוא לפונקציית JavaScript בתוך JSX עם פלטה מסולסלת
* איך להשתמש באובייקט בתוך JSX עם פלטה מסולסלת

</YouWillLearn>

## מחרוזות עוברות עם מרכאות {/*מעבר-מחרוזות-עם-מרכאות*/}

כאשר אתה רוצה להעביר תכונה מחרוזת ל-JSX, אתה במירכאות בודדות אותה או כפולות:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

כאן, `"https://i.imgur.com/7vQD0fPs.jpg"` ו`"Gregorio Y. Zara"` מועברים כמחרוזות.

אבל מה אם אתה רוצה לציין באופן דינמי את הטקסט 'src' או 'alt'? תוכל **להשתמש בערך מ-JavaScript על ידי החלפת `"` ו-`"` ב-`{` ו-`}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

שימו לב להבדל בין `className="avatar"`, המציין את שם מחלקה `"avatar"` שיצר את התמונה עגולה, וכי הוא `src={avatar}` שקורא את הערך של מדרג JavaScript הנקרא `avatar`. למה היא צריכה לעבוד עם JavaScript ממש שם בסימון שלך!

## שימוש בפלטה מתולתת: חלון אל עולם ה-JavaScript {/*באמצעות-מתולתל-פלטה-חלון-לעולם-ה-javascript*/}

JSX היא דרך מיוחדת לכתיבת JavaScript. זה אומר שאפשר להשתמש ב-JavaScript בתוכו - עם סוגים מסולסלים `{ }`. הדוגמה שלהלן מכריזה תחילה על שם למדן, `שם`, והגיעה מטמיעה אותו בסוגריים מסולסלים בתוך ``<h1>``:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

נסה לשנות את הערך של ה`שם` מ``גרגוריו Y. Zara`` ל``הדי לאמאר``. ראה איך כותרת הרשימה?

כל ביטוי JavaScript יעבוד בין סוג מסולסלים, כולל קריאות לפונקציות כמו `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### היכן להשתמש בפלטה מתולתלת {/*היכן-לשימוש-פלטה-מתולתלת*/}

אתה יכול להשתמש בסוגרים מתולתלים רק בשתי דרכים בתוך JSX:

1. **כטקסט** בתוך תג JSX: ``<h1>`{name}'s to Do List`</h1>`` עובד, אבל `<{tag}>רשימת המשימות של גרגוריו Y. Zara</{tag}>` לא.
2. **כמאפיינים** מיד אחרי הסימן `=`: `src={avatar}` יקרא את השינוי `avatar`, אבל `src="{avatar}"` יעביר את המחרוזת __K_8__.

## שימוש ב-"double curlies": CSS ואובייקטים אחרים ב-JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

בנוסף למחרוזות, מספרים וביטויי JavaScript אחרים, אתה יכול אפילו להעביר אובייקטים ב-JSX. אובייקטים מסומנים גם בסוגרים מסולסלים, כמו `{ שם: "הדי לאמאר", המצאות: 5 }`. לכן, כדי להעביר אובייקט JS ב-JSX, עליך לתת את האובייקט בזוג אחר של סוגי מתולתלים: `person={{ name: "Hedy Lamarr", המצאות: 5 }}`.

אפשר שתראה זאת עם סגנונות CSS מוטבעים ב-JSX. תגיב לא מחייב אותך להשתמש בסגנונות מוטבעים (שיעורי CSS עובדים מצוין ברוב המקרים). אבל כאשר אתה צריך סגנון מוטבע, אתה מעביר אובייקט לתכונה 'סגנון':

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

נסה לשנות את הערכים של `צבע רקע` ו`צבע`.

אתה באמת יכול לראות את האובייקט ה-JavaScript בתוך הפלטה המתולתת כאשר אתה כותב את זה כך:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

בפעם הבאה שתראה את `{{` ו-`}}` ב-JSX, זה לא יותר מאשר אובייקט בתוך ה-JSX curlies!

<Pitfall>

מאפיינים `סגנון` מוטבעים כתובים ב-camelCase. לדוגמה, HTML `<ul style="background-color: black">` ייכתב לפי `<ul style={{ backgroundColor: 'black' }}>` ברכיב שלך.

</Pitfall>

## יותר כיף עם אובייקטי JavaScript וסוגרים מסולסלים {/*יותר-כיף-עם-javascript-objects-and-curly-braces*/}

אתה יכול להעביר מספר ביטויים לתוך אובייקט אחד, ולהתייחס אליהם ב-JSX שלך בתוך סוגים מסולסלים:

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

בדוגמה זו, אובייקט ה-JavaScript 'אדם' מכיל מחרוזת 'שם' ואובייקט 'נושא':

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

הרכיב יכול להשתמש בערכים אלה מ'אדם' כך:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX היא מינימלית כשפת תבניות שמאפשרת לך לארגן נתונים והיגיון באמצעות JavaScript.

<Recap>

עכשיו אתה יודע כמעט הכל על JSX:

* תכונות JSX בתוך מרכאות מועברות מחרוזות.
* סוגרים מסולסלים מאפשרים לך להכניס לוגיקה ומשתנים של JavaScript לתוך הסימון שלך.
* הם פועלים בתוך תוכן תג JSX או מיד אחרי `=` בתכונות.
* `{{` ו`}}` אינו תחביר מיוחד: זהו חפץ תחוב בתוך סוגרים מסולסלים של JSX.

</Recap>

<Challenges>

#### תקן את הטעות {/*תקן-הטעות*/}

קוד זה קורס עם שגיאה האומרת 'אובייקטים לא תקפים כילד תגובה':

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
      <h1>{person}'s Todos</h1>
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

האם אתה יכול למצוא את הבעיה?

<Hint>Look for what's inside the curly braces. Are we putting the right thing there?</Hint>

<Solution>

זה קורה בגלל שהדוגמה הזו מעבדת * אובייקט עצמו* בתוך הסימון ולא למחרוזת: ``<h1>`{person}'s Todos`</h1>`` מנסה לעבד את כל האובייקט `person`! הכללת אובייקטים גולמיים כתוכן טקסט זורק שגיאה מה ש-React לא יודע איך אתה רוצה להציג אותם.

כדי לתקן את זה, החלף את ``<h1>`המטלות של {person}`</h1>`` ב-``<h1>`{person.name}'s Todos`</h1>``:

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

</Solution>

#### חילוץ מידע לתוך אובייקט {/*חלץ-מידע-לאובייקט*/}

חלץ את כתובת האתר של התמונה לאובייקט 'אדם'.

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

<Solution>

העבר את כתובת האתר של התמונה למאפיין בשם `person.imageUrl` וקרא אותו מהתג ``<img>`` באמצעות התלתלים:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
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
        src={person.imageUrl}
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

</Solution>

#### כתוב ביטוי בתוך סוגרים מתולתלים של JSX {/*כתוב-ביטוי-בפנים-jsx-מתולתל-פלטה*/}

באובייקט שלמטה, כתובת האתר המלאה של התמונה מפוצלת לארבעה חלקים: כתובת אתר בסיסית, `imageId`, `imageSize` וסיומת קובץ.

אנו שכתובת ה-URL של התמונה תשלב את התכונות הללו: כתובת אתר בסיס (תמיד `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), וסיומת קובץ (תמיד `'.jpg'`). עם זאת, משהו לא בסדר עם האופן שבו התג ``<img>`` מציין את `src` שלו.

אתה יכול לתקן את זה?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
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
.avatar { border-radius: 50%; }
```

</Sandpack>

כדי לבדוק את התיקון שלך עבד, נסה לשנות את הערך של `imageSize` ל-`'b'`. התמונה צריכה לשנות את גודלה לאחר העריכה.

<Solution>

אתה יכול לכתוב את זה בתור `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` פותח את הביטוי JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` מייצרת את מחרוזת כתובת האתר הנכונה
3. `}` סוגר את הביטוי JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
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
.avatar { border-radius: 50%; }
```

</Sandpack>

אתה יכול גם להעביר את הביטוי הזה לפונקציה נפרדת כמו `getImageUrl` למטה:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={getImageUrl(person)}
        alt={person.name}
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

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

משתנים ופונקציות יכולים לעזור לך לשמור על הסימון פשוט!

</Solution>

</Challenges>

