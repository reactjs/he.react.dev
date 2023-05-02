---
title: Importing and Exporting Components
---

<Intro>

הקסם של קומפוננטות טמון בשימוש החוזר שלהם: ניתן ליצור קומפנטטות המורכבות מקומפוננטות אחרות. אבל ככל שאתם מתחילים לקנן יותר ויותר קומפוננטות, לעתים קרובות הגיוני יותר להתחיל לפצל אותם לקבצים שונים. זה יאפשר לכם לשמור על הקבצים שלכם קריאים ולעשות שימוש חוזר בקומפוננטות במקומות נוספים.
</Intro>

<YouWillLearn>

* מה היא קומפוננטת root?
* איך לייבא ולייצא קומפוננטה
* מתי נשתמש default import/export, ומתי named import/export
* איך לייבא ולייצא מספר קומפוננטות מאותו הקובץ
* איך לפצל קומפוננטות למספר קבצים

</YouWillLearn>

## קומפוננטת ה-root {/*the-root-component-file*/}

[בקומפוננטה הראשונה שלכם](/learn/your-first-component) בנית את הקומפוננטה  `Profile` ואת הקומפוננטה `Gallery` שמרדנרדת אותה: 
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

הקומפוננטות האלו כרגע יושבות **בקובץ קומפוננטת השורש** שנקרא `App.js` בדוגמא הזאת. ב[Create React App](https://create-react-app.dev/), האפליקציה שלכם יושבת ב`src/App.js`. כתלות בקונפיגורציה שלכם, קומפוננטת השורש יכולה לשבת בקובץ אחר. אם אתם משתמשים בפריימוורק עם ראוטינג שמתבסס על מבנה הקבצים, כמו למשל Next.js, קומפוננטת השורש שלכם תהיה שונה עבור כל עמוד.
## ייצוא ויבוא של קומפוננטה {/*exporting-and-importing-a-component*/}

מה אם תרצו לשנות את דף הנחיתה בעתיד, ולשים שם רשימה של ספרי מדע? או  להשתמש בפרופילים במקום אחר באפליקציה? צעד סביר יהיה להזיז את קומפוננטות:  `Gallery` ו-`Profile` מחוץ לקומפוננטת השורש שלכם. צעד זה יהפוך אותם ליותר מודולריים  וריוזביליים בקבצים אחרים. ניתן להזיז קומפוננטה בשלושה צעדים:
1. **ליצור** קובץ JS חדש כדי לשים בו את הקומפוננטה
2. **לייצא** את הקומפוננטה מהקובץ החדש (בייצוא [דיפולטיבי](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) או [שמי](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports))
3. **לייבא** את הקומפוננטה שייצאת לתוך הקובץ שבו תשתמש בה (בייבוא  [דיפולטיבי](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) או [שמי](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) בהתאם לצורה שבה הקומפוננטה יוצאה )

כאן גם `Profile` וגם `Gallery` הוזזו אל מחוץ לקומפוננטת `App.js` אל תוך קובץ חדש שנקרא `Gallery.js`. עכשיו אפשר לייבא ב-`App.js` את `Gallery` מתוך `Gallery.js`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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
שימו לב איך בדוגמא הזאת, פירקנו את קומפוננטת השורש, לשני קבצים שונים:

1. `Gallery.js`:
     - מגדיר את קומפוננטת `Profile`, בה אנחנו עושים שימוש רק באותו הקובץ, ולא מייצאים אותה.
     - מייצא את קומפוננטת `Gallery` **בייצוא דיפולטיבי**
2. `App.js`:
     - מייבא את קומפוננטת `Gallery` **ביבוא דיפולטיבי** מתוך `Gallery.js`.
     - מייצא את קומפוננטת השורש `App` **בייצוא דיפולטיבי**


<Note>


ייתכן ותיתקלו בקבצים המשמיטים את סיומת הקובץ `.js` כך:
```js 
import Gallery from './Gallery';
```
שתי הצורות יעבדו עם ריאקט, `'./Gallery.js'` או `'./Gallery'` למרות שהצורה הראשונה קרובה יותר לצורה שבה זה נעשה ב-[native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).


</Note>

<DeepDive title="Default vs Named Exports">
****

יש שני דרכים עיקריות לייצא ערכים בג׳אווסקריפט. ייצוא דיפולטיבי, וייצוא שמי. עד עכשיו, בכל הדוגמאות שהצגנו, השתמשנו רק בייצוא שמי. אבל, ניתן להשתמש באחד או בשניהם באותו הקובץ.
**בקובץ ניתן לייצא באופן _דיפולטיבי_, רק ערך אחד, אבל ניתן לייצא כמה ערכים _שמיים_ שתרצו.**


![Default and named exports](/images/docs/illustrations/i_import-export.svg)

האופן שבו אתם מייצאים את הקומפוננטה שלכם מכתיב כיצד עליכם לייבא אותה. תקבלו שגיאה אם תנסו לייבא ייצוא דיפולטיבי באותו אופן שהיית עושה לייצוא שמי! טבלה זו יכולה לעזור לכם בהבנה:


| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

כאשר אתם כותבים ייבוא _דיפולטיבי_, אתם יכולים לשים כל שם שתרצו לאחר ה`import`. לדוגמה, אתם יכולים לכתוב `import Banana from './button.js'` במקום זאת, וזה עדיין יספק לכם את אותו ייצוא דיפולטיבי. לעומת זאת, עם יבוא שמי, השם צריך להתאים משני הצדדים. לכן זה נקרא יבוא _שמי_!

**אנשים משתמשים לעתים קרובות בייצוא ברירת מחדל אם הקובץ מייצא רק קומפוננטה אחד, ומשתמשים בייצוא שמי אם הוא מייצא מספר קומפוננטות וערכים.** לא משנה איזה סגנון קידוד אתם מעדיפים, תמיד תנו שמות משמעותיים לפונקציות הקומפננטות  שלכם ולקבצים המכילים אותם. אנחנו לא ממליצים לייצא קומפוננטות כך: `export default () => {}`, בשל הקושי לדבג קומפוננטות כאלו. 

</DeepDive>

## יבוא וייצוא של מספר קומפוננטות מאותו הקובץ {/*exporting-and-importing-multiple-components-from-the-same-file*/}

מה אם נרצה להראות רק `Profile` אחד במקום גלריה של פרופילים? אפשר גם לייצא רק את קומפוננטת `Profile`. אבל בקובץ `Gallery.js` כבר יש ייצוא *דיפולטיבי* אחד, ואי אפשר שיהיו _שני_ יצואים דיפולטיבים. אפשר לייצר קובץ חדש עם ייצוא דיפולטיבי, או להוסיף בקובץ הקיים ייצוא *שמי* עבור `Profile`. **בכל קובץ יכול להיות רק ייצוא דיפולטיבי אחד אבל ייצוא שמי ללא הגבלה.**


> בכדי להפחית את הבלבול שבין יצוא דיפולטיבי ליצוא שמי, ישנם צוותים שבחורים רק בסגנון אחד, או שנמנעים מלערבב באותו קובץ את סוגי היצוא השונים. הכל שאלה של העדפה. תעשו מה שמתאים לכם!

קודם כל **יצאו** את קומפוננטת `Profile` מתוך `Gallery.js` בעזרת יצוא שמי (ללא שימוש במילה `default`):

```js
export function Profile() {
  // ...
}
```
לאחר מכן, **יבאו** את קומפוננטת `Profile` מתוך `Gallery.js` אל `App.js` בעזרת יבוא שמי (עם סוגריים מסולסלים):

```js
import { Profile } from './Gallery.js';
```
לבסוף, **רנדרו** את קומפוננטת `</ Profile>` בתוך קומפוננטת `App`:

```js
export default function App() {
  return <Profile />;
}
```

עכשיו `Gallery.js` מכילה שני ייצואים: דיפולטיבי, של קומפוננטת `Gallery` ושמי של קומפוננטת `Profile`. `App.js` מייבא את שניהם. נסו לערוך את `<Profile />` ל- `<Gallery />` ובחזרה בדוגמה הבאה:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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

עכשיו אתם משתמשים בשילוב של יצוא דיפולטיבי ויצוא שמי:

* `Gallery.js`:
  - מייצא את `Profile` בתור **ייצוא שמי בשם `Profile`**
  - מייצא את `Gallery` **בייצוא דיפוטליבי**
* `App.js`:
  - מייבא את `Profile` בתור **ייבוא שמי בשם `Profile`** מתוך קובץ `Gallery.js`.
  - מייבא את `Gallery` בתור **יבוא דיפולטיבי** מתוך `Gallery.js`.
  - מייצא את קומפננטת השורש `App` בתור **ייצוא דיפולטיבי**.

<Recap>

בעמוד זה למדנו:

* מהו קובץ קומפוננטת השורש
* איך לייצא ולייבא קומפוננטה
* מתי ואיך להשתמש ביבוא ויצוא דיפוטליבי ושמי
* איך לייצא מספר קומפוננטות מאותו הקובץ

</Recap>



<Challenges>

### המשך פיצול הקומפוננטות {/*split-the-components-further*/}


כרגע, `Gallery.js` מייצאת גם את `Profile` וגם את `Gallery`, דבר שעשוי קצת לבלבל.

בואו נזיז את קומפוננטת `Profile` לקובץ נפרד, בשם `Profile.js`, ואז נשנה את קומפוננטת `App` כך שתרנדר גם את  `<Profile />` וגם את `<Gallery />` אחת אחרי השנייה.

ניתן להשתמש בייצוא דיפולטיבי או בייצוא שמי על מנת לייצא את קומפוננטת `Profile`, מה שחשוב זה לוודא שסינטקס היבוא תואם גם ב-`App.js` וגם ב-`Gallery.js`! אפשר להסתכל בטבלה למטה כדי לקבל סיכום.

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

אל תשכחו לייבא את הקומפוננטות כשאתם מרנדרים אותם. גם `Gallery` מרנדר את `Profile`, נכון?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

אחרי שאתם מצליחים לעבוד עם סוג אחד של יצוא, תנסו עם הסוג השני.

<Solution>

זה הפיתרון עם יצוא שמי:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

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

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

זה הפיתרון עם יצוא דיפולטיבי:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
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

```js Profile.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>