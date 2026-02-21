---
title: "'use client'"
titleForTitleTag: "'use client' directive"
canary: true
---

<Canary>

יש צורך ב-`'use client'` רק אם אתה [משתמש ב-React רכיבי שרת](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) או בונה ספרייה התואמת אליהם.
</Canary>


<Intro>

`'use client'` מאפשר לך לסמן איזה קוד פועל על הלקוח.

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `'use client'` {/*use-client*/}

הוסף `'use client'` בראש קובץ כדי לסמן את המודול והתלות הטרנזיטיבית שלו כקוד לקוח.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

כאשר קובץ המסומן ב-`'use client'` מיובא מרכיב שרת, [מחסנים תואמים](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) יתייחסו לייבוא ​​המודול כגבול בין קוד הפעלה של שרת ל-client.

כתלות של `RichTextEditor`, `formatDate` ו`Button` יוערכו גם על הלקוח ללא קשר אם המודולים שלהם מכילים הנחיה `'use client'`. שים לב שניתן להעריך מודול בודד בשרת כשהוא מיובא מקוד שרת ובלקוח כשהוא מיובא מקוד לקוח.

#### אזהרות {/*caveats*/}

* `'use client'` חייב להיות ממש בתחילת הקובץ, מעל כל ייבוא ​​או קוד אחר (הערות בסדר). הם חייבים להיות כתובים עם מרכאות בודדות או כפולות, אך לא עם סימנים אחוריים.
* כאשר מודול `'use client'` מיובא ממודול אחר שעובד על ידי לקוח, להנחיה אין השפעה.
* כאשר מודול רכיב מכיל הנחיית `'use client'`, כל שימוש ברכיב זה מובטח להיות רכיב לקוח. עם זאת, עדיין ניתן להעריך רכיב בלקוח גם אם אין לו הנחיית `'use client'`.
	* שימוש ברכיב נחשב רכיב לקוח אם הוא מוגדר במודול עם הנחיית `'use client'` או כאשר מדובר בתלות טרנזיטיבית של מודול המכיל הוראת `'use client'`. אחרת, זה רכיב שרת.
* קוד המסומן להערכת לקוח אינו מוגבל לרכיבים. כל הקוד המהווה חלק מתת-עץ מודול הלקוח נשלח אל הלקוח ומופעל על ידי הלקוח.
* כאשר מודול מוערך בשרת מייבא ערכים ממודול `'use client'`, הערכים חייבים להיות רכיב React או [ערכי עזר הניתנים לסידרה נתמכים](#passing-props-from-server-to-client-components) כדי לעבור לרכיב לקוח. כל מקרה אחר של use יגרום לחריגה.

### כיצד `'use client'` מסמן את קוד הלקוח {/*how-use-client-marks-client-code*/}

באפליקציית React, רכיבים מפוצלים לרוב לקבצים נפרדים, או [מודולים](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

עבור אפליקציות שuse React רכיבי שרת, האפליקציה מעובדת בשרת כברירת מחדל. `'use client'` מציג גבול שרת-לקוח ב-[עץ התלות של המודול](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), יוצר למעשה תת-עץ של מודולי לקוח.

כדי להמחיש זאת טוב יותר, שקול את אפליקציית רכיבי השרת React הבאה.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

בעץ התלות במודול של אפליקציה לדוגמה זו, ההנחיה `'use client'` ב-`InspirationGenerator.js` מסמנת את המודול הזה ואת כל התלות הטרנזיטיבית שלו כמודולים של לקוח. תת העץ שמתחיל ב-`InspirationGenerator.js` מסומן כעת כמודולי לקוח.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` מפלח את עץ התלות של המודול של אפליקציית רכיבי השרת React, מסמן את `InspirationGenerator.js` ואת כל התלות שלו כמעובדים בלקוח.
</Diagram>

במהלך הרינדור, המסגרת תעבד בשרת את רכיב השורש ותמשיך דרך [עץ העיבוד](/learn/understanding-your-ui-as-a-tree#the-render-tree), תבטל את הסכמתו להערכת כל קוד שיובא מקוד שסומן על ידי הלקוח.

החלק המעובד בשרת של עץ העיבוד נשלח לאחר מכן ללקוח. הלקוח, עם הורדת קוד הלקוח שלו, משלים את עיבוד שאר העץ.

<Diagram name="use_client_render_tree" height={250} width={500} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">
עץ העיבוד של האפליקציה React רכיבי שרת. `InspirationGenerator` והרכיב הצאצא שלו `FancyText` הם רכיבים המיוצאים מקוד מסומן על ידי לקוח ונחשב כרכיבי לקוח.
</Diagram>

אנו מציגים את ההגדרות הבאות:

* **רכיבי לקוח** הם רכיבים בעץ רינדור המעובדים בלקוח.
* **רכיבי שרת** הם רכיבים בעץ רינדור המעובדים בשרת.

בעבודה דרך האפליקציה לדוגמה, `App`, `FancyText` ו-`Copyright` הם כולם מעובדים בשרת ונחשבים לרכיבי שרת. מכיוון ש`InspirationGenerator.js` והתלות הטרנזיטיבית שלו מסומנים כקוד לקוח, הרכיב `InspirationGenerator` והרכיב הצאצא שלו `FancyText` הם רכיבי לקוח.

<DeepDive>
#### איך `FancyText` הוא גם שרת וגם רכיב לקוח? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

לפי ההגדרות לעיל, הרכיב `FancyText` הוא גם רכיב שרת וגם רכיב לקוח, איך זה יכול להיות?

ראשית, נבהיר שהמונח "רכיב" אינו מדויק במיוחד. הנה רק שתי דרכים שבהן ניתן להבין "רכיב":

1. "רכיב" יכול להתייחס ל**הגדרת רכיב**. ברוב המקרים זו תהיה פונקציה.

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

2. "רכיב" יכול להתייחס גם ל-**שימוש ברכיב** בהגדרתו.
```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

לעתים קרובות, חוסר הדיוק אינו חשוב כאשר מסבירים מושגים, אבל במקרה זה כן.

כאשר אנו מדברים על רכיבי שרת או לקוח, אנו מתייחסים לשימושים ברכיבים.

* אם הרכיב מוגדר במודול עם הוראת `'use client'`, או שהרכיב מיובא ונקרא ב-Client Component, אז השימוש ברכיב הוא Client Component.
* אחרת, השימוש ברכיב הוא רכיב שרת.


<Diagram name="use_client_render_tree" height={150} width={450} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">A render tree illustrates component usages.</Diagram>

בחזרה לשאלת `FancyText`, אנו רואים שלהגדרת הרכיב אין _אין_ הנחיית `'use client'` ויש לה שני שימושים.

השימוש ב-`FancyText` כילד של `App`, מסמן את השימוש הזה כרכיב שרת. כאשר `FancyText` מיובא ונקרא תחת `InspirationGenerator`, השימוש הזה ב-`FancyText` הוא רכיב לקוח שכן `InspirationGenerator` מכיל הנחיה `'use client'`.

המשמעות היא שהגדרת הרכיב עבור `FancyText` תוערך בשרת וגם תוריד על ידי הלקוח כדי להציג את השימוש ברכיב הלקוח שלו.

</DeepDive>

<DeepDive>

#### מדוע `Copyright` הוא רכיב שרת? {/*why-is-copyright-a-server-component*/}

מכיוון שuse `Copyright` מוצג כילד של רכיב הלקוח `InspirationGenerator`, אתה עשוי להיות מופתע שזהו רכיב שרת.

נזכיר כי `'use client'` מגדיר את הגבול בין קוד השרת והלקוח ב-_עץ התלות של המודול_, לא בעץ הרינדור.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` מגדיר את הגבול בין קוד השרת ללקוח בעץ התלות של המודול.
</Diagram>

בעץ התלות של המודול, אנו רואים ש`App.js` מייבא וקורא `Copyright` מהמודול `Copyright.js`. מכיוון ש`Copyright.js` אינו מכיל הנחיה `'use client'`, השימוש ברכיב מוצג בשרת. `App` מוצג בשרת מכיוון שהוא רכיב השורש.

רכיבי לקוח יכולים לעבד רכיבי שרת מכיוון שuse אתה יכול להעביר את JSX בתור props. במקרה זה, `InspirationGenerator` מקבל `Copyright` בתור [ילדים](/learn/passing-props-to-a-component#passing-jsx-as-children). עם זאת, מודול `InspirationGenerator` לעולם לא מייבא ישירות את מודול `Copyright` וגם לא קורא לרכיב, כל זה נעשה על ידי `App`. למעשה, הרכיב `Copyright` מבוצע במלואו לפני תחילת העיבוד של `InspirationGenerator`.

ההנחה היא שיחסי עיבוד הורה-ילדים בין רכיבים אינם מבטיחים את אותה סביבת עיבוד.

</DeepDive>

### מתי use `'use client'` {/*when-to-use-use-client*/}

עם `'use client'`, אתה יכול לקבוע מתי רכיבים הם רכיבי לקוח. מכיוון שרכיבי שרת הם ברירת מחדל, הנה סקירה קצרה של היתרונות והמגבלות של רכיבי שרת כדי לקבוע מתי עליך לסמן משהו כלקוח מעובד.

לשם הפשטות, אנחנו מדברים על רכיבי שרת, אבל אותם עקרונות חלים על כל הקוד באפליקציה שלך שמופעל על ידי שרת.

#### היתרונות של רכיבי שרת {/*advantages*/}
* רכיבי שרת יכולים להפחית את כמות הקוד שנשלח ופועל על ידי הלקוח. רק מודולי לקוח מאגדים ומוערכים על ידי הלקוח.
* רכיבי שרת נהנים מהפעלה על השרת. הם יכולים לגשת למערכת הקבצים המקומית ועשויים לחוות זמן אחזור נמוך עבור שליפות נתונים ובקשות רשת.

#### מגבלות של רכיבי שרת {/*limitations*/}
* רכיבי שרת אינם יכולים לתמוך באינטראקציה מכיוון שמטפלי אירועים חייבים להיות רשומים ומופעלים על ידי לקוח.
	* לדוגמה, ניתן להגדיר מטפלי אירועים כמו `onClick` רק ברכיבי לקוח.
* רכיבי שרת אינם יכולים use רוב Hooks.
	* כאשר רכיבי שרת מעובדים, הפלט שלהם הוא בעצם רשימה של רכיבים עבור הלקוח לעיבוד. רכיבי שרת אינם נמשכים ב-memory לאחר העיבוד ואינם יכולים לקבל state משלהם.

### סוגים ניתנים להסדרה המוחזרים על ידי רכיבי שרת {/*serializable-types*/}

כמו בכל אפליקציה React, רכיבי אב מעבירים נתונים לרכיבי צאצא. מכיוון שהם מוצגים בסביבות שונות, העברת נתונים מרכיב שרת לרכיב לקוח דורשת שיקול נוסף.

ערכי עזר המועברים מרכיב שרת לרכיב לקוח חייבים להיות ניתנים לסידרה.

props הניתנים לסידרה כוללים:
* פרימיטיבים
	* [מחרוזת](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [מספר](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [גדול](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [בוליאנית](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [לא מוגדר](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [סמל](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), רק סמלים הרשומים ברישום הסמלים העולמי דרך [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* איטרבלים המכילים ערכים הניתנים לסידרה
	* [מחרוזת](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [מערך](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [מפה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [סט](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ו-[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [תאריך](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [אובייקטים] רגילים(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): אלו שנוצרו עם [מאתחלי אובייקטים](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), עם מאפיינים הניתנים לסידרה
* פונקציות שהן [פעולות שרת](/reference/react/use-שרת)
* רכיבי לקוח או שרת (JSX)
* [מבטיח](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

יש לציין, אלה אינם נתמכים:
* [פונקציות](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) שאינן מיוצאות ממודולים המסומנים על ידי לקוח או מסומנות באמצעות [`'use server'`](/reference/react/use-שרת)
* [שיעורים](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* אובייקטים שהם מופעים של כל מחלקה (מלבד המובנים שהוזכרו) או אובייקטים עם [אב טיפוס null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* סמלים שאינם רשומים ברחבי העולם, למשל. `Symbol('my new symbol')`


## שימוש {/*usage*/}

### בניה עם אינטראקטיביות וstate {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

מכיוון ש`Counter` מחייב גם את `useState` Hook וגם את מטפלי האירועים להגדיל או להקטין את הערך, רכיב זה חייב להיות רכיב לקוח וידרוש הנחיה `'use client'` בחלק העליון.

לעומת זאת, רכיב שיוצר ממשק משתמש ללא אינטראקציה לא יצטרך להיות רכיב לקוח.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

לדוגמה, רכיב האב של `Counter`, `CounterContainer`, אינו דורש `'use client'` מכיוון שהוא אינו אינטראקטיבי ואינו use state. בנוסף, `CounterContainer` חייב להיות רכיב שרת כפי שהוא קורא ממערכת הקבצים המקומית בשרת, מה שמתאפשר רק ברכיב שרת.

ישנם גם רכיבים שאינם use תכונות שרת או לקוח בלבד ויכולים להיות אגנוסטיים למקום שבו הם מעבדים. בדוגמה הקודמת שלנו, `FancyText` הוא רכיב כזה.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

במקרה זה, איננו מוסיפים את ההנחיה `'use client'`, וכתוצאה מכך ה-_פלט_ של `FancyText` (ולא קוד המקור שלו) יישלח לדפדפן בעת ​​הפניה מרכיב שרת. כפי שהודגם בדוגמה הקודמת של אפליקציית Inspirations, `FancyText` הוא used גם בתור שרת וגם כרכיב לקוח, תלוי איפה הוא מיובא וused.

אבל אם הפלט HTML של `FancyText` היה גדול יחסית לקוד המקור שלו (כולל תלות), ייתכן שיהיה יעיל יותר לאלץ אותו להיות תמיד רכיב לקוח. רכיבים שמחזירים מחרוזת נתיב SVG ארוכה הם מקרה אחד שבו עשוי להיות יעיל יותר לאלץ רכיב להיות רכיב לקוח.

### שימוש ב-APIs {/*using-client-apis*/} של הלקוח

אפליקציית React שלך עשויה use client ספציפיים APIs, כגון APIs של הדפדפן עבור אחסון אינטרנט, מניפולציה של אודיו ווידאו וחומרת המכשיר, בין [אחרים] (https://developer.mozilla.org/en-US/docs/Web/API).

בדוגמה זו, הרכיב uses [DOM APIs](https://developer.mozilla.org/en-US/docs/Glossary/DOM) כדי לתפעל אלמנט [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). מכיוון שאותם APIs זמינים רק בדפדפן, יש לסמן אותו כרכיב לקוח.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### שימוש בספריות של צד שלישי {/*using-third-party-libraries*/}

לעתים קרובות באפליקציית React, תמנף ספריות של צד שלישי כדי לטפל בדפוסי ממשק משתמש נפוצים או בהיגיון.

ספריות אלו עשויות להסתמך על רכיב Hooks או APIs של לקוח. רכיבי צד שלישי שuse כל אחד מה-React APIs הבאים חייבים לפעול בלקוח:
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) ו-[`react-dom`](/reference/react-dom/hooks) Hooks, לא כולל [`use`](/reference/react/use) ו-[`useId`](/K_12/__)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* אם הם use client APIs, למשל. DOM הכנסה או תצוגות פלטפורמה מקוריות

אם ספריות אלו עודכנו כדי להיות תואמות לרכיבי שרת React, אז הם כבר יכללו סמני `'use client'` משלהם, מה שיאפשר לך use אותם ישירות מרכיבי השרת שלך. אם ספרייה לא עודכנה, או אם רכיב צריך props כמו מטפלי אירועים שניתן לציין רק בלקוח, ייתכן שיהיה עליך להוסיף קובץ רכיב לקוח משלך בין רכיב לקוח של צד שלישי לרכיב השרת שלך שבו תרצה use אותו.

[TODO]: <> (פתרון בעיות - צריך use-cases)
