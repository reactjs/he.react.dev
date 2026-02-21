---
title: "ה-UI שלכם כעץ"
---

<Intro>

אפליקציית React שלך מתעצבת כאשר רכיבים רבים מקוננים זה בזה. איך React עוקב אחר מבנה הרכיבים של האפליקציה שלך?

React, וספריות UI אחרים, דגמים את כעץ. חשיבה על האפליקציה שלך כעל עץ שימושית להבנת הקשר בין רכיבים. הבנה זו תעזור לך לנפות באגים במושגים עתידיים כמו ביצועים וניהול state.

</Intro>

<YouWillLearn>

* How React "רואה" מבנים של רכיבים
* מהו עץ טיוח ולמה הוא שימושי
* מהו עץ תלות מודול ולמה הוא שימושי

</YouWillLearn>

## ממשק המשתמש שלך כעץ {/*הממשק-שלך-כעץ*/}

עצים הם מודל קשר בין פריטים וממשק משתמש מי מוצג לרוב באמצעות מבני עצים. לדוגמה, דפדפנים משתמשים במבני עץ למודל HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) ו-CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). פלטפורמות משתמשות ניידות גם בעלות כדי להציג את התצוגה ההיררכית.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React DOM'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

React יוצר עץ ממשק משתמש מהרכיבים שלך. בדוגמה זו, עץ ה-UI משמש לאחר מכן לעיבוד ל-DOM.
</Diagram>

כמו דפדפנים ופלטפורמות ניידות, גם React משתמשת במבני עצים כדי לנהל ולדגמן את הקשר בין רכיבים באפליקציית React. עצים אלו הם כל שימושים כדי להבין כיצד נתונים זורמים דרך אפליקציית React וכיצד לייעל את העיבוד ואת גודל האפליקציה.

## עץ הרינדור {/*the-render-tree*/}

תכונה עיקרית של רכיבים היא כוללת להרכיב רכיבים של רכיבים אחרים. כפי שאנו [רכיבי הקן](/learn/your-first-component#nesting-and-organizing-components), יש לנו את הרעיון של רכיבי אב וילד, שבו כל רכיב הורה עשוי להיות בעצמו ילד של רכיב אחר.

כאשר אנו מעבדים אפליקציית React, אנו יכולים לדגמן את הקשר הזה בעץ, המכונה עץ העיבוד.

הנה אפליקציית React שמציגה ציטוטים מעוררי השראה.

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
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

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

```js src/quotes.js
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

<Diagram name="render_tree" height={250} width={500} alt="Tree graph with five nodes. Each node represents a component. The root of the tree is App, with two arrows extending from it to 'InspirationGenerator' and 'FancyText'. The arrows are labelled with the word 'renders'. 'InspirationGenerator' node also has two arrows pointing to nodes 'FancyText' and 'Copyright'.">

React יוצר *עץ רינדור*, עץ ממשק משתמש, המורכב מהרכיבים המעובדים.


</Diagram>

מהאפליקציה לדוגמה, נוכל לבנות את עץ הרינדור לעיל.

העץ מורכב מצמתים, שכל אחד מהם מייצג רכיב. `אפליקציה`, `FancyText`, `זכויות יוצרים`, אם להזכיר כמה, הם כולם צמתים בעץ שלנו.

צומת השורש בעץ רינדור React הוא [רכיב השורש](/learn/importing-and-exporting-components#the-root-component-file) של האפליקציה. במקרה זה, רכיב השורש הוא 'אפליקציה' והרכיב הראשון ש-React מעבד. כל חץ בעץ מצביע מרכיב אב לרכיב צאצא.

<DeepDive>

#### היכן נמצא תגי ה-HTML בעץ הרינדור? {/*היכן-ה-html-elements-in-the-render-tree*/}

תבחין בעץ הרינדור לעיל, אין אזכור לתגיות HTML שכל רכיב מעבד. למה היא שעץ הרינדור מורכבת רק מ-React [רכיבים](למד/הרכיב-הראשון שלך#רכיבי-UI-אבני-בניין).

React, כמסגרת ממשק משתמש, היא אגנוסטית לפלטפורמה. ב-.dev, אנו מציגים דוגמאות לעיבוד משתמשים, משתמש בסימון HTML כפרימיטיביות ממשק המשתמש שלו. אבל אפליקציית React יכולה באותה מידה להיות עיבוד לפלטפורמה ניידת או שולחנית, שעשויה להשתמש בפרימיטיבים שונים של ממשק משתמש כמו [UIView](https://developer.apple.com/documentation/uikit/uiview) או [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.windows-element.desktop=windows.frameworkelement.de?hl=iw).

הפרימיטיבים האלה של ממשק המשתמש של הפלטפורמה הזו חלק מ-React. עצי רינדור React יכולים לספק תובנות לאפליקציית React שלנו ללא קשר לאיזו פלטפורמה האפליקציה שלך מעבדת.

</DeepDive>

עץ רינדור מנקודת מבט רינדור בודד של יישום React. עם [עיבוד מותנה](/learn/conditional-rendering), רכיב אב עשוי לעבד ילדים שונים לנתונים המועברים.

אנחנו יכולים לעדכן את האפליקציה כדי להציג ציטוט או צבע בצורה מותנית.

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

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

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
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
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
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Tree graph with six nodes. The top node of the tree is labelled 'App' with two arrows extending to nodes labelled 'InspirationGenerator' and 'FancyText'. The arrows are solid lines and are labelled with the word 'renders'. 'InspirationGenerator' node also has three arrows. The arrows to nodes 'FancyText' and 'Color' are dashed and labelled with 'renders?'. The last arrow points to the node labelled 'Copyright' and is solid and labelled with 'renders'.">

עם עיבוד מותנה, על פני עיבודים שונים, עץ העיבוד עשוי לעבד רכיבים שונים.

</Diagram>

בדוגמה זו, בהתאם למה זה `inspiration.type`, אנו `<FancyText>` או `<Color>`. עיבוד עץ עשוי להיות שונה עבור כל המשך עיבוד.

למרות שעצי רינדור משתנים בין מעברי רינדור, עצים אלה מועילים בדרך רמה כללית לזיהוי מה הם *ה העליונה* ורכיבי *העלים* באפליקציית React. רכיבים ברמה העליונה הם הרכיבים הקרובים ביותר לרכיב השורש ומשפיעים על ביצועי הרינדור של כל הרכיבים שמתחתיהם ולעיתים מכילים את המורכבות ביותר. רכיבי העלים נמצאים קרוב לתחתית העץ ואין להם רכיבי צאצא ולעתים קרבות הם עובדים מחדש.

זיהוי קטגוריות אלו של רכיבים שימושי להבנת זרימת הנתונים והביצועים של האפליקציה שלך.

## עץ התלות של המודול {/*the-module-dependency-tree*/}

מערכת יחסים נוספת באפליקציית React ניתן לעצב עם עץ היא התלות במודול של אפליקציה. כאשר אנו [מפרקים את הרכיבים שלנו](/learn/importing-and-exporting-components#exporting-and-importing-a-component) והלוגיקה לקבצים נפרדים, אנו יוצרים [מודולי JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) אנו מספקים תועלת, או לייצא רכיבים קבועים, פונקציות.

כל צומת בעץ התלות של מודול הוא מודול וכל ענף מייצג הצהרת 'ייבוא' במודול זה.

אם ניקח את אפליקציית Inspirations הקודמת, נוכל לבנות עץ תלות של מודול, או בקיצור עץ תלות.

<Diagram name="module_dependency_tree" height={250} width={658} alt="A tree graph with seven nodes. Each node is labelled with a module name. The top level node of the tree is labelled 'App.js'. There are three arrows pointing to the modules 'InspirationGenerator.js', 'FancyText.js' and 'Copyright.js' and the arrows are labelled with 'imports'. From the 'InspirationGenerator.js' node, there are three arrows that extend to three modules: 'FancyText.js', 'Color.js', and 'inspirations.js'. The arrows are labelled with 'imports'.">

עץ התלות במודול עבור אפליקציית Inspirations.

</Diagram>

צומת השורש של העץ הוא מודול השורש, הידוע גם כקובץ נקודת הכניסה. לעתים קרובות זה המודול שמכיל את רכיב השורש.

בהשוואה לעץ הרינדור של אותה אפליקציה, ישנם מבנים דומים אך כמה הבדלים בולטים:

* הצמתים המרכיבים את העץ מייצגים מודולים, לא רכיבים.
* מודולים רכיבים, כמו `inspirations.js`, מי מוצגים גם הם בעץ זה. עץ העיבוד מקפל רק רכיבים.
* `Copyright.js` מופיע תחת `App.js` אך בעץ הרינדור, `Copyright`, הרכיב, מופיע כצאצא של `InspirationGenerator`. למה היא ש-'InspirationGenerator' מקבלת את JSX כ-[children props](/learn/passing-props-to-a-component#passing-jsx-as-children), אז הוא יוצר את 'זכויות יוצרים' כרכיב צאצא אך אינו מייבא את המודול.

עצי תלות שימושיים כדי לקבוע אילו מודולים נחוצים להפעלת אפליקציית React שלך. כאשר בונים אפליקציית React לייצור, יש בדרך כלל שלב בנייה שיצרף את כל ה-JavaScript הדרוש למשלוח ללקוח. הכלי שאחראי לשם נקרא [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), ו-bunlers ישתמשו בעץ התלות כדי לקבוע אילו מודולים יש לכלול.

ככל שהאפליקציה שלך גדלה, לעתים קרובות גם גודל החבילה עושה זאת. גדלי חבילות גדולים יקרים ללקוח להוריד ולהפעיל. גדלים גדולים של חבילות יכולים לעכב את זמן הציור של ממשק המשתמש שלך. קבלת תחושה של עץ התלות של האפליקציה שלך עשויה לעזור באיתור בעיות אלו.

[הערה]: <> (אולי עלינו לצלול לעומק גם ביבוא מותנה)

<Recap>

* עצים הם דרך נפוצה לייצג את היחסים בין ישויות. הם משמשים לעתים קרובות למודל ממשק משתמש.
* עצי רינדור מייצגים את הקשר המקנן בין רכיבי React על פני רינדור בודד.
* עם עיבוד מותנה, עץ העיבוד עשוי להשתנות בין עיבודים שונים. עם ערכי אב שונים, רכיבים עשויים להציג רכיבי ילדים שונים.
* עצי עיבוד עוזרים לזהות מהם הרכיבים ברמה העליונה והעלים. רכיבים ברמה העליונה משפיעים על ביצועי הרינדור של כל הרכיבים שמתחתיהם ורכיבי עלים מעובדים לעתים קרובות מחדש. זיהוים שימושי להבנת ביצועי רינדור וניפוי באגים.
* עצי תלות מייצגים את התלות במודול באפליקציית React.
* עצי תלות משמשים כלי בנייה כדי לאגד את הקוד הדרוש למשלוח אפליקציה.
* עצי תלות שימושיים לאיתור באגים בגדלים גדולים של חבילות שמאטות את זמן הצביעה וחושפים הזדמנויות לאופטימיזציה של הקוד שמצורף.

</Recap>

[TODO]: <> (הוסף אתגרים)
