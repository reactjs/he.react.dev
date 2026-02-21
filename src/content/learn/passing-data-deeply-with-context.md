---
title: "העברת נתונים לעומק עם ההקשר"
---

<Intro>

בדרך כלל, תעביר מידע מרכיב אב לרכיב צאצא באמצעות props. אבל העברת props יכולה להיות מילולית ולא נוחה אם תצטרך להעביר אותם דרך רכיבים רבים באמצע, או אם רכיבים רבים באפליקציה שלך זקוקים לאותו מידע. *הקשר* מאפשר לרכיב האב להפוך מידע זמין לכל רכיב בעץ שמתחתיו - לא משנה כמה עמוק - מבלי להעביר אותו במפורש דרך props.

</Intro>

<YouWillLearn>

- מה זה "קידוח פרוס".
- כיצד להחליף את העברת האביזרים החוזרים על עצמם בהקשר
- מקרים נפוצים של use להקשר
- חלופות נפוצות להקשר

</YouWillLearn>

## הבעיה בהעברת props {/*the-problem-with-passing-props*/}

[העברת props](/learn/passing-props-to-a-component) היא דרך מצוינת להעביר נתונים באופן מפורש דרך עץ הממשק שלך לרכיבים שuse אותו.

אבל העברת props יכולה להיות מילולית ולא נוחה כאשר אתה צריך להעביר אביזר עמוק דרך העץ, או אם רכיבים רבים זקוקים לאותו אביזר. האב הקדמון המשותף הקרוב ביותר יכול להיות רחוק מהרכיבים שזקוקים לנתונים, ו[העלאת state למעלה](/learn/sharing-state-between-components) כל כך גבוה יכול להוביל למצב שנקרא "קידוח פרופס".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

הרמת state למעלה

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

קידוח פרוס

</Diagram>

</DiagramGroup>

האם זה לא יהיה נהדר אם הייתה דרך "לטלפורט" נתונים לרכיבים בעץ שצריכים אותם מבלי להעביר את props? עם תכונת ההקשר של React, יש!

## הקשר: חלופה להעברת props {/*context-an-alternative-to-passing-props*/}

ההקשר מאפשר לרכיב אב לספק נתונים לכל העץ שמתחתיו. יש הרבה uses להקשר. הנה דוגמה אחת. שקול את הרכיב `Heading` הזה שמקבל `level` עבור הגודל שלו:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

נניח שאתה רוצה שמספר כותרות בתוך אותו `Section` יהיו תמיד באותו גודל:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

נכון לעכשיו, אתה מעביר את אבזר `level` לכל `<Heading>` בנפרד:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

זה יהיה נחמד אם תוכל להעביר את הפרופס `level` לרכיב `<Section>` במקום ולהסיר אותו מה-`<Heading>`. כך תוכל לאכוף שלכל הכותרות באותו סעיף יהיה אותו גודל:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

אבל איך רכיב `<Heading>` יכול לדעת את הרמה של `<Section>` הקרוב ביותר שלו? **זה ידרוש דרך כלשהי לילד "לבקש" נתונים ממקום כלשהו מעל העץ.**

אתה לא יכול לעשות את זה עם props לבד. כאן נכנס לתמונה ההקשר. אתה תעשה את זה בשלושה שלבים:

1. **צור** הקשר. (אתה יכול לקרוא לזה `LevelContext`, מכיוון שזה עבור רמת הכותרת.)
2. **השתמש** בהקשר הזה מהרכיב שצריך את הנתונים. (`Heading` יהיה use `LevelContext`.)
3. **ספק** את ההקשר הזה מהרכיב שמציין את הנתונים. (`Section` יספק `LevelContext`.)

ההקשר מאפשר להורה - אפילו רחוק! - לספק נתונים לכל העץ שבתוכו.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in orange which projects down to the two children, each highlighted in orange." >

שימוש בהקשר בילדים קרובים

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root parent node contains a bubble representing a value highlighted in orange. The value projects down directly to four leaves and one intermediate component in the tree, which are all highlighted in orange. None of the other intermediate components are highlighted.">

שימוש בהקשר בילדים רחוקים

</Diagram>

</DiagramGroup>

### שלב 1: צור את ההקשר {/*step-1-create-the-context*/}

ראשית, עליך ליצור את ההקשר. תצטרך **לייצא אותו מקובץ** כדי שהרכיבים שלך יוכלו use אותו:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

הארגומנט היחיד ל-`createContext` הוא ערך _default_. כאן, `1` מתייחס לרמת הכותרת הגדולה ביותר, אבל אתה יכול להעביר כל סוג של ערך (אפילו אובייקט). תראה את המשמעות של ערך ברירת המחדל בשלב הבא.

### שלב 2: השתמש בהקשר {/*step-2-use-the-context*/}

ייבא את `useContext` Hook מ-React ואת ההקשר שלך:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

נכון לעכשיו, הרכיב `Heading` קורא `level` מתוך props:

```js
export default function Heading({ level, children }) {
  // ...
}
```

במקום זאת, הסר את האביזר `level` וקרא את הערך מההקשר שזה עתה ייבאת, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` הוא Hook. בדיוק כמו `useState` ו-`useReducer`, אתה יכול לקרוא רק ל-Hook מיד בתוך רכיב React (לא בתוך לולאות או תנאים). **`useContext` אומר לReact שהרכיב `Heading` רוצה לקרוא את ה-`LevelContext`.**

כעת, כאשר לרכיב `Heading` אין אבזר `level`, אינך צריך להעביר את אבזר הרמה ל-`Heading` ב-JSX שלך כך יותר:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

עדכן את ה-JSX כך שה-`Section` הוא שמקבל אותו במקום זאת:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

כזכור, זה הסימון שניסית להפעיל:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

שימו לב שהדוגמה הזו לא ממש עובדת, עדיין! לכל הכותרות יש את אותו גודל מכיוון שuse **למרות שאתה *משתמש* בהקשר, עדיין לא *סיפקת* אותו.** React לא יודע איפה להשיג אותו!

אם לא תספק את ההקשר, React use ערך ברירת המחדל שציינת בשלב הקודם. בדוגמה זו, ציינת את `1` כארגומנט ל-`createContext`, אז `useContext(LevelContext)` מחזיר את `1`, ומגדיר את כל הכותרות האלה ל-`<h1>`. בואו נתקן את הבעיה על ידי כך שכל `Section` יספק את ההקשר שלו.

### שלב 3: ספק את ההקשר {/*step-3-provide-the-context*/}

הרכיב `Section` מציג כעת את הילדים שלו:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**עטפו אותם עם ספק הקשר** כדי לספק להם את ה-`LevelContext`:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

זה אומר ל-React: "אם רכיב כלשהו בתוך ה-`<Section>` הזה מבקש `LevelContext`, תן לו את ה-`level` הזה." הרכיב use הערך של `<LevelContext.Provider>` הקרוב ביותר בעץ ה-UI שמעליו.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

זו אותה תוצאה כמו הקוד המקורי, אבל לא היית צריך להעביר את הפרופס `level` לכל רכיב `Heading`! במקום זאת, הוא "מבין" את רמת הכותרת שלו על ידי שאילת ה-`Section` הקרוב ביותר למעלה:

1. אתה מעביר אביזר `level` ל-`<Section>`.
2. `Section` עוטף את ילדיו ב-`<LevelContext.Provider value={level}>`.
3. `Heading` שואל את הערך הקרוב ביותר של `LevelContext` למעלה עם `useContext(LevelContext)`.

## שימוש ומתן הקשר מאותו רכיב {/*using-and-providing-context-from-the-same-component*/}

נכון לעכשיו, אתה עדיין צריך לציין את ה-`level` של כל חלק באופן ידני:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

מכיוון שההקשר מאפשר לך לקרוא מידע מרכיב למעלה, כל `Section` יכול לקרוא את ה-`level` מה-`Section` שלמעלה, ולהעביר את `level + 1` למטה באופן אוטומטי. הנה איך אתה יכול לעשות את זה:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

עם השינוי הזה, אינך צריך להעביר את משענת `level` *לא* ל-`<Section>` או ל-`<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

עכשיו גם `Heading` וגם `Section` קראו את ה-`LevelContext` כדי להבין עד כמה הם "עמוקים". וה-`Section` עוטף את ילדיו ב-`LevelContext` כדי לציין שכל דבר בתוכו נמצא ברמה "עמוקה" יותר.

<Note>

דוגמה זו של רמות הכותרת של use מכיוון שuse הן מציגות חזותית כיצד רכיבים מקוננים יכולים לעקוף את ההקשר. אבל ההקשר useמלא גם עבור מקרים רבים אחרים של use. אתה יכול להעביר כל מידע הדרוש לכל תת-עץ: ערכת הצבע הנוכחית, user המחוברת כעת, וכן הלאה.

</Note>

## ההקשר עובר דרך רכיבי ביניים {/*context-passes-through-intermediate-components*/}

אתה יכול להכניס כמה רכיבים שתרצה בין הרכיב שמספק הקשר לזה שuse הוא זה. זה כולל גם רכיבים מובנים כמו `<div>` וגם רכיבים שאתה עשוי לבנות בעצמך.

בדוגמה זו, אותו רכיב `Post` (עם גבול מקווקו) מוצג בשתי רמות קינון שונות. שימו לב שה-`<Heading>` שבתוכו מקבל את הרמה שלו אוטומטית מה-`<Section>` הקרוב ביותר:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

לא עשית שום דבר מיוחד כדי שזה יעבוד. `Section` מציין את ההקשר של העץ שבתוכו, כך שתוכל להכניס `<Heading>` בכל מקום, והוא יקבל את הגודל הנכון. נסה את זה בארגז החול למעלה!

**הקשר מאפשר לך לכתוב רכיבים ש"מתאימים לסביבתם" ומציגים את עצמם בצורה שונה בהתאם ל-_היכן_ (או, במילים אחרות, _באיזה הקשר_) הם מעובדים.**

אופן הפעולה של ההקשר עשוי להזכיר לך את [CSS ירושה של נכס.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) ב-CSS, אתה יכול לציין `color: blue` עבור `<div>`, וכל צומת DOM בתוכו, לא משנה כמה עמוק, יירש את הצבע הזה, אלא אם כן `color: blue` אחר יתחיל עם ה-K_2 האמצעי. באופן דומה, ב-React, הדרך היחידה לעקוף הקשר כלשהו שמגיע מלמעלה היא לעטוף ילדים לספק הקשר עם ערך שונה.

ב-CSS, מאפיינים שונים כמו `color` ו-`background-color` אינם עוקפים זה את זה. אתה יכול להגדיר את כל `color` של `<div>` לאדום מבלי להשפיע על `background-color`. באופן דומה, **הקשרי React שונים אינם עוקפים זה את זה.** כל הקשר שאתה יוצר עם `createContext()` נפרד לחלוטין מהקשרים אחרים, ומקשר בין רכיבים תוך שימוש ומספק *הקשר המסוים הזה* הזה. רכיב אחד עשוי use או לספק הקשרים רבים ושונים ללא בעיה.

## לפני שאתה use הקשר {/*before-you-use-context*/}

ההקשר מאוד מפתה use! עם זאת, זה גם אומר שקל מדי להגזיםuse מזה. **רק בגלל שuse אתה צריך לעבור כמה props בעומק של כמה רמות לא אומר שאתה צריך להכניס את המידע הזה להקשר.**

הנה כמה חלופות שכדאי לשקול לפני השימוש בהקשר:

1. **התחל ב[מעבר props.](/learn/passing-props-to-a-component)** אם הרכיבים שלך אינם טריוויאליים, זה לא יוצא דופן להעביר תריסר props דרך תריסר רכיבים. זה אולי מרגיש כמו סיסמה, אבל זה מבהיר מאוד אילו רכיבים use אילו נתונים! האדם ששומר על הקוד שלך ישמח שהפכת את זרימת הנתונים למפורשת עם props.
2. **חלץ רכיבים ו[העברת JSX בתור `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) אליהם.** אם אתה מעביר חלק מהנתונים דרך שכבות רבות של רכיבי ביניים שלא use פירושו שלעתים קרובות אתה מעביר את הנתונים האלה בהמשך (ובדרך זו אתה מעביר את הנתונים האלה בדרך נוספת). לדוגמה, אולי אתה מעביר נתונים props כמו `posts` לרכיבים חזותיים שאינם use אותם ישירות, כמו `<Layout posts={posts} />`. במקום זאת, גרם ל-`Layout` לקחת את `children` כאביזר, ולעבד את `<Layout><Posts posts={posts} /></Layout>`. זה מפחית את מספר השכבות בין הרכיב המציין את הנתונים לזה שזקוק להם.

אם אף אחת מהגישות הללו לא עובדת טוב עבורך, שקול את ההקשר.

## שימוש במקרים עבור הקשר {/*use-cases-for-context*/}

* **עיצוב:** אם האפליקציה שלך מאפשרת ל-user לשנות את המראה שלו (למשל במצב כהה), תוכל לשים ספק הקשר בחלק העליון של האפליקציה שלך, וuse ההקשר הזה ברכיבים שצריכים להתאים את המראה החזותי שלהם.
* **חשבון נוכחי:** ייתכן שרכיבים רבים צריכים לדעת את user המחובר כעת. הצבתו בהקשר מאפשרת לקרוא אותו בכל מקום בעץ. אפליקציות מסוימות גם מאפשרות לך להפעיל מספר חשבונות בו-זמנית (למשל להשאיר הערה בתור user אחר). במקרים אלה, זה יכול להיות נוח לעטוף חלק ממשק המשתמש לספק מקונן עם ערך חשבון שוטף שונה.
* **ניתוב:** רוב פתרונות הניתוב use הקשר פנימי כדי להחזיק את המסלול הנוכחי. כך כל קישור "יודע" אם הוא פעיל או לא. אם אתה בונה נתב משלך, אולי תרצה לעשות את זה גם.
* **ניהול state:** ככל שהאפליקציה שלך תגדל, אתה עלול בסופו של דבר לקבל הרבה state קרוב יותר לראש האפליקציה שלך. רכיבים רחוקים רבים להלן עשויים לרצות לשנות אותו. מקובל ל-[use מפחית יחד עם הקשר](/learn/scaling-up-with-reducer-and-context) לנהל state מורכבים ולהעביר אותו לרכיבים מרוחקים בלי יותר מדי טרחה.
  
ההקשר אינו מוגבל לערכים סטטיים. אם תעביר ערך אחר בעיבוד הבא, React יעדכן את כל הרכיבים שקוראים אותו למטה! זו הסיבה שהקשר הוא לעתים קרובות used בשילוב עם state.

באופן כללי, אם יש צורך במידע מסוים על ידי רכיבים מרוחקים בחלקים שונים של העץ, זה אינדיקציה טובה שהקשר יעזור לך.

<Recap>

* ההקשר מאפשר לרכיב לספק מידע כלשהו לכל העץ שמתחתיו.
* כדי להעביר את ההקשר:
  1. צור וייצא אותו באמצעות `export const MyContext = createContext(defaultValue)`.
  2. העבירו אותו ל-`useContext(MyContext)` Hook כדי לקרוא אותו בכל רכיב צאצא, לא משנה כמה עמוק.
  3. עטפו ילדים לתוך `<MyContext.Provider value={...}>` כדי לספק אותו מהורה.
* ההקשר עובר דרך כל רכיב באמצע.
* ההקשר מאפשר לך לכתוב רכיבים ש"מתאימים לסביבתם".
* לפני שאתה use הקשר, נסה להעביר את props או להעביר את JSX בתור `children`.

</Recap>

<Challenges>

#### החלף את קידוח התמיכה בהקשר {/*replace-prop-drilling-with-context*/}

בדוגמה זו, החלפת תיבת הסימון משנה את התמיכה `imageSize` המועברת לכל `<PlaceImage>`. תיבת הסימון state מוחזקת ברכיב `App` ברמה העליונה, אך כל `<PlaceImage>` צריך להיות מודע לכך.

נכון לעכשיו, `App` מעביר את `imageSize` ל`List`, שמעביר אותו לכל `Place`, שמעביר אותו ל`PlaceImage`. הסר את האביזר `imageSize`, ובמקום זאת העביר אותו מהרכיב `App` ישירות אל `PlaceImage`.

אתה יכול להכריז על הקשר ב-`Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

הסר את אבזר `imageSize` מכל הרכיבים.

צור וייצא `ImageSizeContext` מ-`Context.js`. לאחר מכן עטפו את הרשימה ב-`<ImageSizeContext.Provider value={imageSize}>` כדי להעביר את הערך למטה, ו-`useContext(ImageSizeContext)` כדי לקרוא אותה ב-`PlaceImage`:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

שימו לב איך רכיבים באמצע לא צריכים לעבור את `imageSize` יותר.

</Solution>

</Challenges>
