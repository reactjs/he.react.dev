---
title: Importing and Exporting Components
---

<Intro>

הקסם של קומפוננטות טמון בשימוש החוזר שלהם: ניתן ליצור קומפנטטות המורכבות מקומפוננטות אחרות. אבל ככל שאתה מתחיל לקנן יותר ויותר קומפוננטות, לעתים קרובות הגיוני יותר להתחיל לפצל אותם לקבצים שונים. זה מאפשר לך לשמור על הקבצים שלך קריאים ולעשות שימוש חוזר בקומפוננטות במקומות נוספים.
</Intro>

<YouWillLearn>

* מה היא קומפוננטת שורש
* איך לייבא ולייצא קומפוננטה
* מתי נשתמש ביבוא וייצוא דיפולטיבי, ומתי ביבוא וייצוא שמי
* איך ליבא ולייצא מספר קומפוננטות מאותו הקובץ
* איך לפצל קומפוננטות למספר קבצים

</YouWillLearn>

## קומפוננטת השורש {/*the-root-component-file*/}

[בקומפוננטה הראשונה שלך](/learn/your-first-component) בנית את הקומפוננטה  `Profile` ואת הקומפוננטה `Gallery` שמרדנרדת אותה: 
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

הקופמפוננטות האלו כרגע יושבות **בקובץ קומפוננטת השורש** שנקרא `App.js` בדוגמא הזאת. ב[Create React App](https://create-react-app.dev/), האפליקציה שלך יושבת ב`src/App.js`. כתלות בקונפיקורציה שלך, קומפוננטת השורש יכולה לשבת בקובץ אחר. אם אתה משתמש בפריימוורק עם ראוטינג שמתבסס על מבנה הקבצים, כמו למשל Next.js, קומפוננטת השורש שלך תהיה שונה עבור כל עמוד.
## ייצוא ויבוא של קומפוננטה {/*exporting-and-importing-a-component*/}

What if you want to change the landing screen in the future and put a list of science books there? Or place all the profiles somewhere else? It makes sense to move `Gallery` and `Profile` out of the root component file. This will make them more modular and reusable in other files. You can move a component in three steps:

מה אם תרצו לשנות את דף הנחיתה בעתיד, ולשים שם רשימה של ספרי מדע? או  להשתמש בפרופילים במקום אחר באפליקציה? צעד סביר יהיה להזיז את קומפוננטות:  `Gallery` ו-`Profile` מחוץ לקומפוננטת השורש שלך. צעד זה יהפוך אותם ליותר מודולריים  וריוזביליים בקבצים אחרים. ניתן להזיז קופמפוננטה בשלושה צעדים:
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


ייתכן ותיתקל בקבצים המשמיטים את סיומת הקובץ `.js` כך:
```js 
import Gallery from './Gallery';
```
שתי הצורות יעבדו עם ריאקט, `'./Gallery.js'` או `'./Gallery'` למרות שהצורה הראשונה קרובה יותר לצורה שבה זה נעשה ב-[native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).


</Note>

<DeepDive title="Default vs Named Exports">

There are two primary ways to export values with JavaScript: default exports and named exports. So far, our examples have only used default exports. But you can use one or both of them in the same file. **A file can have no more than one _default_ export, but it can have as many _named_ exports as you like.**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

How you export your component dictates how you must import it. You will get an error if you try to import a default export the same way you would a named export! This chart can help you keep track:

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

When you write a _default_ import, you can put any name you want after `import`. For example, you could write `import Banana from './button.js'` instead and it would still provide you with the same default export. In contrast, with named imports, the name has to match on both sides. That's why they are called _named_ imports!

**People often use default exports if the file exports only one component, and use named exports if it exports multiple components and values.** Regardless of which coding style you prefer, always give meaningful names to your component functions and the files that contain them. Components without names, like `export default () => {}`, are discouraged because they make debugging harder.

</DeepDive>

## Exporting and importing multiple components from the same file {/*exporting-and-importing-multiple-components-from-the-same-file*/}

What if you want to show just one `Profile` instead of a gallery? You can export the `Profile` component, too. But `Gallery.js` already has a *default* export, and you can't have _two_ default exports. You could create a new file with a default export, or you could add a *named* export for `Profile`. **A file can only have one default export, but it can have numerous named exports!**

> To reduce the potential confusion between default and named exports, some teams choose to only stick to one style (default or named), or avoid mixing them in a single file. It's a matter of preference. Do what works best for you!

First, **export** `Profile` from `Gallery.js` using a named export (no `default` keyword):

```js
export function Profile() {
  // ...
}
```

Then, **import** `Profile` from `Gallery.js` to `App.js` using a named import (with the curly braces):

```js
import { Profile } from './Gallery.js';
```

Finally, **render** `<Profile />` from the `App` component:

```js
export default function App() {
  return <Profile />;
}
```

Now `Gallery.js` contains two exports: a default `Gallery` export, and a named `Profile` export. `App.js` imports both of them. Try editing `<Profile />` to `<Gallery />` and back in this example:

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

Now you're using a mix of default and named exports:

* `Gallery.js`:
  - Exports the `Profile` component as a **named export called `Profile`**.
  - Exports the `Gallery` component as a **default export**.
* `App.js`:
  - Imports `Profile` as a **named import called `Profile`** from `Gallery.js`.
  - Imports `Gallery` as a **default import** from `Gallery.js`.
  - Exports the root `App` component as a **default export**.

<Recap>

On this page you learned:

* What a root component file is
* How to import and export a component
* When and how to use default and named imports and exports
* How to export multiple components from the same file

</Recap>



<Challenges>

### Split the components further {/*split-the-components-further*/}

Currently, `Gallery.js` exports both `Profile` and `Gallery`, which is a bit confusing.

Move the `Profile` component to its own `Profile.js`, and then change the `App` component to render both `<Profile />` and `<Gallery />` one after another.

You may use either a default or a named export for `Profile`, but make sure that you use the corresponding import syntax in both `App.js` and `Gallery.js`! You can refer to the table from the deep dive above:

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

Don't forget to import your components where they are called. Doesn't `Gallery` use `Profile`, too?

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

After you get it working with one kind of exports, make it work with the other kind.

<Solution>

This is the solution with named exports:

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

This is the solution with default exports:

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