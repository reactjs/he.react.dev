---
title: הקומפוננטה הראשונה שלכם
---

<Intro>

*רכיבים* הם אחד ממושגי הליבה של React. הם הבסיס שעליו אתה בונה ממשקי user (UI), מה שהופך אותם למקום המושלם להתחיל את המסע שלך ב-React!

</Intro>

<YouWillLearn>

* מהו רכיב
* איזה תפקיד ממלאים רכיבים ביישום React
* איך לכתוב את הרכיב React הראשון שלך

</YouWillLearn>

## רכיבים: אבני הבניין של ממשק המשתמש {/*components-ui-building-blocks*/}

באינטרנט, HTML מאפשר לנו ליצור מסמכים מובנים עשירים עם ערכת התגים המובנית שלו כמו ``<h1>`` ו-``<li>``:

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

סימון זה מייצג את המאמר `<article>`, את הכותרת שלו ``<h1>``, ותוכן עניינים (מקוצר) כרשימה מסודרת ``<ol>``. סימון כזה, בשילוב עם CSS עבור סגנון, ו-JavaScript עבור אינטראקטיביות, נמצא מאחורי כל סרגל צד, דמות, מודאל, תפריט נפתח - כל פיסת ממשק משתמש שאתה רואה באינטרנט.

React מאפשר לך לשלב את הסימון שלך, CSS ו-JavaScript ל"רכיבים" מותאמים אישית, **רכיבי ממשק משתמש ניתנים לשימוש חוזר עבור האפליקציה שלך.** ניתן להפוך את קוד תוכן העניינים שראית למעלה לרכיב `<TableOfContents />` שתוכל לעבד בכל דף. מתחת למכסה המנוע, זה עדיין use אותם תגיות HTML כמו `<article>`, ``<h1>`` וכו'.

בדיוק כמו עם תגיות HTML, אתה יכול לחבר, להזמין ולקנן רכיבים כדי לעצב דפים שלמים. לדוגמה, דף התיעוד שאתה קורא מורכב ממרכיבי React:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

ככל שהפרויקט שלך יגדל, אתה תבחין שניתן להרכיב רבים מהעיצובים שלך על ידי שימוש חוזר ברכיבים שכבר כתבת, לזרז את הפיתוח שלך. ניתן להוסיף את תוכן העניינים שלנו לעיל לכל מסך עם `<TableOfContents />`! אתה יכול אפילו להזניק את הפרויקט שלך עם אלפי הרכיבים המשותפים לקהילת הקוד הפתוח React כמו [Chakra UI](https://chakra-ui.com/) ו-[Material UI.](https://material-ui.com/)

## הגדרת רכיב {/*defining-a-component*/}

באופן מסורתי בעת יצירת דפי אינטרנט, מפתחי אינטרנט סימנו את התוכן שלהם ולאחר מכן הוסיפו אינטראקציה על ידי פיזור על כמה JavaScript. זה עבד מצוין כשהאינטראקציה הייתה נחמדה לביצוע באינטרנט. כעת הוא צפוי לאתרים רבים ולכל האפליקציות. React שם את האינטראקטיביות במקום הראשון תוך שימוש באותה טכנולוגיה: **רכיב React הוא פונקציית JavaScript שניתן _לפזר עליה סימון_.** כך זה נראה (תוכל לערוך את הדוגמה למטה):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

והנה איך לבנות רכיב:

### שלב 1: ייצא את הרכיב {/*step-1-export-the-component*/}

הקידומת `export default` היא [תחביר JavaScript סטנדרטי](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (לא ספציפית לReact). היא מאפשרת לסמן את הפונקציה הראשית בקובץ, כך שתוכל לייבא אותה מאוחר יותר מקבצים אחרים. (עוד על ייבוא ​​ב-[ייבוא ​​וייצוא רכיבים](/learn/ייבוא)-ו-ייצוא!

### שלב 2: הגדר את הפונקציה {/*step-2-define-the-function*/}

עם `function Profile() { }` אתה מגדיר פונקציה JavaScript עם השם `Profile`.

<Pitfall>

רכיבי React הם פונקציות JavaScript רגילות, אבל **השמות שלהם חייבים להתחיל באות גדולה** אחרת הם לא יעבדו!

</Pitfall>

### שלב 3: הוסף סימון {/*step-3-add-markup*/}

הרכיב מחזיר תג `<img />` עם תכונות `src` ו`alt`. `<img />` כתוב כמו HTML, אבל הוא למעשה JavaScript מתחת למכסה המנוע! תחביר זה נקרא [JSX](/learn/writing-markup-with-jsx), והוא מאפשר להטמיע סימון בתוך JavaScript.

ניתן לכתוב statements להחזרה כולם בשורה אחת, כמו ברכיב זה:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

אבל אם הסימון שלך לא נמצא באותה שורה כמו מילת המפתח `return`, עליך לעטוף אותה בזוג סוגריים:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

ללא סוגריים, כל קוד בשורות שאחרי `return` [יתעלם](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## שימוש ברכיב {/*using-a-component*/}

כעת לאחר שהגדרת את רכיב `Profile` שלך, אתה יכול לקנן אותו בתוך רכיבים אחרים. לדוגמה, אתה יכול לייצא רכיב `Gallery` שuse של רכיבי `Profile` מרובים:

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

### מה הדפדפן רואה {/*what-the-browser-sees*/}

שימו לב להבדל במארז:

* ``<section>`` הוא אותיות קטנות, אז React יודע שאנחנו מתייחסים לתג HTML.
* `<Profile />` מתחיל באות גדולה `P`, אז React יודע שאנחנו רוצים use הרכיב שלנו שנקרא `Profile`.

ו-`Profile` מכיל אפילו יותר HTML: `<img />`. בסופו של דבר, זה מה שהדפדפן רואה:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### קינון וארגון רכיבים {/*nesting-and-organizing-components*/}

רכיבים הם פונקציות JavaScript רגילות, כך שתוכל לשמור רכיבים מרובים באותו קובץ. זה נוח כאשר רכיבים קטנים יחסית או קשורים זה לזה באופן הדוק. אם הקובץ הזה נהיה צפוף, אתה תמיד יכול להעביר את `Profile` לקובץ נפרד. תלמד כיצד לעשות זאת בקרוב ב[דף על ייבוא.](/learn/importing-and-exporting-components)

Because רכיבי `Profile` מוצגים בתוך `Gallery` - אפילו כמה פעמים! - אנו יכולים לומר ש`Gallery` הוא **רכיב אב,** המציג כל `Profile` כ"ילד". זה חלק מהקסם של React: אתה יכול להגדיר רכיב פעם אחת, ואז use אותו בכמה מקומות וכמה פעמים שתרצה.

<Pitfall>

רכיבים יכולים לעבד רכיבים אחרים, אבל **אסור לקנן את ההגדרות שלהם:**

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

הקטע שלמעלה הוא [מאוד איטי ו-causes באגים.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) במקום זאת, הגדר כל רכיב ברמה העליונה:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

כאשר רכיב צאצא זקוק לכמה נתונים מהורה, [העבירו אותם על ידי props](/learn/passing-props-to-a-component) במקום הגדרות קינון.

</Pitfall>

<DeepDive>

#### רכיבים עד הסוף {/*components-all-the-way-down*/}

היישום React שלך מתחיל ברכיב "שורש". בדרך כלל, הוא נוצר באופן אוטומטי כאשר אתה מתחיל פרויקט חדש. לדוגמה, אם אתה use [CodeSandbox](https://codesandbox.io/) או אם אתה use את המסגרת [Next.js](https://nextjs.org/), רכיב השורש מוגדר ב-`pages/index.js`. בדוגמאות אלה, ייצאת רכיבי בסיס.

רוב האפליקציות React use רכיבים עד הסוף. משמעות הדבר היא שלא רק use רכיבים עבור חלקים לשימוש חוזר כמו כפתורים, אלא גם עבור חלקים גדולים יותר כמו סרגלי צד, רשימות, ובסופו של דבר, דפים שלמים! רכיבים הם דרך שימושית לארגון קוד UI ותגיות, גם אם חלקם used פעם אחת בלבד.

[React-based frameworks](/learn/start-a-new-react-project) לוקחים את זה צעד קדימה. במקום להשתמש בקובץ HTML ריק ולתת לReact "להשתלט" על ניהול הדף עם JavaScript, הם *גם* מייצרים את HTML באופן אוטומטי ממרכיבי React שלכם. זה מאפשר לאפליקציה שלך להציג תוכן מסוים לפני שהקוד JavaScript נטען.

ובכל זאת, אתרי אינטרנט רבים רק use React כדי [הוסף אינטראקטיביות לדפי HTML קיימים.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) יש להם רכיבי בסיס רבים במקום אחד עבור דף אחד. אתה יכול use כמה-או מעט-React כפי שאתה צריך.

</DeepDive>

<Recap>

זה עתה קיבלת את הטעם הראשון שלך מ-React! בואו נסכם כמה נקודות מפתח.

* React מאפשר לך ליצור רכיבים, **רכיבי ממשק משתמש ניתנים לשימוש חוזר עבור האפליקציה שלך.**
* באפליקציית React, כל פיסת ממשק משתמש היא רכיב.
* רכיבי React הם פונקציות JavaScript רגילות למעט:

1. שמותיהם מתחילים תמיד באות גדולה.
  2. הם מחזירים סימון JSX.

</Recap>



<Challenges>

#### ייצא את הרכיב {/*export-the-component*/}

ארגז החול הזה לא עובד מכיוון שuse רכיב השורש לא מיוצא:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

נסה לתקן את זה בעצמך לפני שתסתכל על הפתרון!

<Solution>

הוסף `export default` לפני הגדרת הפונקציה כך:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

אולי אתה תוהה מדוע כתיבת `export` לבדה אינה מספיקה כדי לתקן את הדוגמה הזו. אתה יכול ללמוד את ההבדל בין `export` ל-`export default` ב-[יבוא וייצוא רכיבים.](/learn/importing-and-exporting-components)

</Solution>

#### תקן את ההחזר statement {/*fix-the-return-statement*/}

משהו לא בסדר ב-`return` statement הזה. אתה יכול לתקן את זה?

<Hint>

ייתכן שתקבל שגיאת "אסימון בלתי צפוי" בעת ניסיון לתקן זאת. במקרה כזה, בדקו שהנקודה-פסיק מופיע *אחרי* הסוגריים הסוגרים. השארת נקודה-פסיק בתוך `return ( )` תגרום לשגיאהuse.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

אתה יכול לתקן את הרכיב הזה על ידי הזזת statement ההחזרה לשורה אחת כך:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

או על ידי עטיפה של הסימון JSX המוחזר בסוגריים שנפתחים מיד אחרי `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### גלה את הטעות {/*spot-the-mistake*/}

משהו לא בסדר עם ההכרזה על הרכיב `Profile` וused. האם אתה יכול לזהות את הטעות? (נסה לזכור כיצד React מבדיל רכיבים מהתגיות HTML הרגילות!)

<Sandpack>

```js
function profile() {
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
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

שמות רכיבים React חייבים להתחיל באות גדולה.

שנה את `function profile()` ל-`function Profile()`, ולאחר מכן שנה כל `<profile />` ל-`<Profile />`:

<Sandpack>

```js
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
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### רכיב משלך {/*your-own-component*/}

כתוב רכיב מאפס. אתה יכול לתת לו כל שם חוקי ולהחזיר כל סימון. אם נגמרו לך הרעיונות, תוכל לכתוב רכיב `Congratulations` המציג את ``<h1>`Good job!`</h1>``. אל תשכח לייצא אותו!

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>

