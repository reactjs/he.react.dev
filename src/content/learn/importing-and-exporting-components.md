---
title: ייבוא וייצוא קומפוננטות
---

<Intro>

הקסם של קומפוננטות טמון בשימוש החוזר בהן: אפשר ליצור קומפוננטות שמורכבות מקומפוננטות אחרות. אבל ככל שמקננים יותר קומפוננטות, בדרך כלל כדאי להתחיל לפצל אותן לקבצים נפרדים. כך הקבצים נשארים קריאים יותר, ואפשר להשתמש באותן קומפוננטות במקומות נוספים.

</Intro>

<YouWillLearn>

* מהו קובץ קומפוננטת שורש
* איך לייבא ולייצא קומפוננטה
* מתי להשתמש בייבוא/ייצוא סטייל ברירת מחדל ומתי סטייל בשם
* איך לייבא ולייצא כמה קומפוננטות מאותו קובץ
* איך לפצל קומפוננטות לכמה קבצים

</YouWillLearn>

## קובץ קומפונט השורש {/*the-root-component-file*/}

ב-[הקומפונטה הראשונה שלכם](/learn/your-first-component), יצרתם קומפונטת `פרופיל` וקומפונטת `גלריה` שמרנדרת אותה:

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

כרגע שתיהן נמצאות ב-** קובץ קומפונטת השורש**, שנקרא בדוגמה הזו `App.js`. בהתאם ל-setup שלכם, קומפונטת השורש יכולה להיות בקובץ אחר. אם אתם משתמשים ב-framework עם ניתוב מבוסס קבצים, כמו Next.js, קומפוננטת השורש תהיה שונה בכל עמוד.

## ייצוא וייבוא ​​של קומפוננטה {/*ייצוא-ויבוא-רכיב*/}

מה אם תרצו גם לשנות את הפתיחה ולשים שם רשימת ספרי מדע? או להעביר את כל הפרופילים למקום אחר? במקרה כזה הגיוני להעביר את `גלריה` ו`פרופיל` מחוץ לקובץ השורש. כך הן יהיו מודולריות יותר וקל יותר לעשות שימוש חוזר בקבצים אחרים. אפשר להעביר קומפוננטה בשלושה צעדים:

1. **צרו** קובץ JS חדש שיכיל את הקומפוננטות.
2. **ייצאו** את קומפוננטת הפונקציה מהקובץ (באמצעות ייצוא [ברירת מחדל](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) או [שם](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)).
3. **ייבאו** אותה בקובץ שבו תשתמשו בה (באמצעות תחביר הייבוא המתאים לייצוא [ברירת מחדל](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) או [שם](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

כאן גם `פרופיל` וגם `Gallery` הועברו מ-`App.js` לקובץ חדש בשם `Gallery.js`. עכשיו אפשר לעדכן את `App.js` כך שייבא את `Gallery` מתוך `Gallery.js`:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
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

שימו לב איך הדוגמה מחולקת עכשיו לשני קובצי קומפוננטות:

1. `Gallery.js`:
     - מגדיר את הקומפוננטה `פרופיל`, שמשמשת רק בתוך אותו קובץ זה לא יוצאת.
     - מייצא את הקומפוננטה `גלריה` כ-**ייצוא ברירת מחדל**.
2. 'App.js':
     - מייבא את `Gallery` לפי **ייבוא ברירת מחדל** מתוך `Gallery.js`.
     - מייצא את קומפונטת השורש `App` כ-**ייצוא ברית מחדל**.


<Note>

אפשר שתיתקלו בקבצים שמשמיטים את סיומת `.js`, למשל:

```js 
import Gallery from './Gallery';
```

גם `'./Gallery.js'` וגם `'./Gallery'` יעבדו ב-React, אבל אפשרות ראשונה קרובה יותר לאופן של [Native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).

</Note>

<DeepDive>

#### ייצוא ברית מחדל לעומת ייצוא בשם {/*default-vs-named-exports*/}

יש שתי דרכים עיקריות לייצא ערכים ב-JavaScript: ייצוא ברית מחדל וייצוא בשם. עד עכשיו הדוגמאות השתמשו רק ב-default, אבל אפשר להשתמש באחת מהשיטות אושתיהן בקובץ. **ל יכול קובץ להיות לכל היותר ייצוא _default_ אחד, אבל אפשר שיהיו בו כמה ייצואי _named_ שרוצים.**

![ייצוא ברית מחדל וייצוא בשם](/images/docs/illustrations/i_import-export.svg)

האופן שבו אתם מייצאים קומפוננטה קובעים איך צריך לייבא אותה. אם תנסו לייבא ברירת מחדל כמו בשם, תקבלו שגיאה. הטבלה הבאה עוזרת לעשות סדר:

| תחביר | הצהרת ייצוא | הצהרת ייבוא ​​|
| -----------      | -----------                                | -----------                               |
| ברית מחדל | `יצוא פונקציית ברירת המחדל Button() {}` | `לחצן ייבוא ​​מ'./Button.js';` |
| בשם | `Export function Button() {}` | `ייבוא{ Button } מ-'./Button.js';` |

כשכותבים ייבוא_default_, אפשר לבחור כל שם אחרי `יבוא`. אפשר למשל לכתוב `יבוא בננה מ'./Button.js'`, ועדיין תקבל את אותו ייצוא ברירת המחדל. זאת, בשם חייב להיות זה לעומת זאת. לכן קוראים לו ייבוא_named_.

**בדרך כלל משתמשים ב-default export כשם מייצא קומפוננטה אחת בלבד, וב-named exports תוך כמה קומפונטות או ערכים שת.** בלי קשר לסגנון בחירה, חשוב לתת שמות תגובות לפונקציות הקומפוננטה והקבצים שמכילים אותם. קומפונטות ללא שם, כמו `ייצוא ברירת מחדל () => {}`, פחות מומלצות כי הן מקשות על דיבוג.

</DeepDive>

## ייצוא וייבוא ​​של כמה קומפוננטות מאותו קובץ {/*ייצוא-ויבוא-רכיבים-מרובים-מה-אותו-קובץ*/}

מה אם תרצו להציג רק `פרופיל` אחד במקום גלריה שלמה? אפשר גם לייצא את `פרופיל`. אבל ל-`Gallery.js` כבר יש ייצוא *ברירת מחדל*, ואי אפשר שיהיו שני ייצואי ברירת מחדל בקובץ. אפשר ליצור קובץ חדש עם ייצוא ברירת מחדל, או להוסיף ייצוא *שם* עבור `פרופיל`. **ל יכול להיות רק יצוא ברירת מחדל אחד, אבל הוא יכול להכיל הרבה יצוא בשם.**

<Note>

לצמצם בלבול בין ברית מחדל ל-named, יש צוותים שעובדים רק במבנה אחד, או חזק בתוך אותו קובץ. בחרו את מה שעובד הכי טוב אצלכם.

</Note>

הקודם **ייצאו** את `פרופיל` מתוך `Gallery.js` באמצעות ייצוא שם (בלי מילת המפתח `ברירת מחדל`):

```js
export function Profile() {
  // ...
}
```

לאחר **ייבאו** את `פרופיל` מ-`Gallery.js` אל `App.js הוא` באמצעות יבוא בשם (עם סוגרים מסולסלים):

```js
import { Profile } from './Gallery.js';
```

לבסוף, **רנדרו** את `<פרופיל />` מתוך הקומפוננטה `אפליקציה`:

```js
export default function App() {
  return <Profile />;
}
```

עכשיו `Gallery.js` כולל שני ייצואים: ייצוא ברירת מחדל של `Gallery`, ויצוא בשם `פרופיל`. הקובץ `App.js` מייבא את שניהם. נסו להחליף בדוגמה בין `<Profile />` ל-`<Gallery />` וחזרה:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
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

עכשיו אתם משתמשים בשילוב של יצוא ברירת מחדל ושמו:

* `Gallery.js`:
  - מייצא את הקומפוננטה `פרופיל` כ-** בשם ייצוא בשם `פרופיל`**.
  - מייצא את הקומפוננטה `גלריה` כ-**ייצוא ברירת מחדל**.
* `App.js`:
  - מייבא את `פרופיל` לפי **ייבואבשם `פרופיל`** מתוך `Gallery.js`.
  - מייבא את `Gallery` לפי **ייבוא ​​ברירת מחדל** מתוך `Gallery.js`.
  - מייצא את קומפוננת השורש `App` כ-**ייצוא ברית מחדל**.

<Recap>

בעמוד הזה למדתם:

* מהו קובץ קומפוננטת שורש
* איך לייבא ולייצא קומפוננטה
* מתי ואיך להשתמש בייבוא/ייצוא ברירת מחדל ו-named
* איך לייצא כמה קומפוננטות מאותו קובץ

</Recap>



<Challenges>

#### פצלו את הקומפוננטות עוד יותר {/*פיצול-הרכיבים-לאחר*/}

כרגע `Gallery.js` מייצא גם את `פרופיל` וגם את `Gallery`, וזה מעט מבלבל.

העבירו את הקומפוננטה `פרופיל` לקובץ נפרד בשם `Profile.js`, ואז עדכנו את הקומפוננטה `אפליקציה` כך שתרנדר גם את `<Profile />` וגם את `<Gallery />` אחד אחרי השני.

אפשר להשתמש בייצוא ברירת מחדל או בשם עבור `פרופיל`, אבל ודאו את המשתמשים בתחביר הייבוא ​​המתאים גם ב-`App.js` וגם ב-`Gallery.js`. אפשר להיעזר בטבלה מה-Deep Dive למעלה:

| תחביר | הצהרת ייצוא | הצהרת ייבוא ​​|
| -----------      | -----------                                | -----------                               |
| ברית מחדל | `יצוא פונקציית ברירת המחדל Button() {}` | `לחצן ייבוא ​​מ'./Button.js';` |
| בשם | `Export function Button() {}` | `ייבוא{ Button } מ-'./Button.js';` |

<Hint>

אל תשכחו לייבא קומפוננטות במקום שבו קוראים להן. גם `גלריה` משתמשת ב-`פרופיל`, נכון?

</Hint>

<Sandpack>

```js src/App.js
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

```js src/Gallery.js active
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

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

אחרי שזה עובד עם סוג ייצוא אחד, נסו לגרום לזה לעבוד גם עם הסוג השני.

<Solution>

זהו הפתרון עם יצוא בשם:

<Sandpack>

```js src/App.js
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

```js src/Gallery.js
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

```js src/Profile.js
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

זהו הפתרון עם יצוא ברירת מחדל:

<Sandpack>

```js src/App.js
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

```js src/Gallery.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>

