---
title: "cloneElement"
---

<Pitfall>

השימוש ב-`cloneElement` אינו שכיח ועלול להוביל לקוד שביר. [ראה חלופות נפוצות.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` מאפשר לך ליצור אלמנט React חדש באמצעות אלמנט אחר כנקודת התחלה.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

התקשר ל-`cloneElement` כדי ליצור אלמנט React המבוסס על `element`, אך עם `props` ו`children` שונים:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `element`: הארגומנט `element` חייב להיות אלמנט React חוקי. לדוגמה, זה יכול להיות צומת JSX כמו `<Something />`, תוצאה של קריאה ל-[`createElement`](/reference/react/createElement), או תוצאה של קריאה אחרת של `cloneElement`.

* `props`: הארגומנט `props` חייב להיות אובייקט או `null`. אם תעבור את `null`, האלמנט המשובט ישמור על כל ה-`element.props` המקורי. אחרת, עבור כל אביזר באובייקט `props`, האלמנט המוחזר "יעדיף" את הערך מ-`props` על פני הערך מ-`element.props`. שאר ה-props יתמלא מה-`element.props` המקורי. אם תעבור את `props.key` או `props.ref`, הם יחליפו את המקוריים.

* **אופציונלי** `...children`: אפס צמתים צאצאים או יותר. הם יכולים להיות כל צמתים React, כולל אלמנטים React, מחרוזות, מספרים, [פורטלים](/reference/react-dom/createPortal), צמתים ריקים (`null`, `undefined`, `true` ו-`false`), ומערכים של nodes._9____ אם לא תעביר שום ארגומנט `...children`, ה-`element.props.children` המקורי יישמר.

#### מחזירה {/*returns*/}

`cloneElement` מחזיר אובייקט אלמנט React עם כמה מאפיינים:

* `type`: זהה ל-`element.type`.
* `props`: התוצאה של מיזוג רדוד של `element.props` עם ה-`props` המכריע שעברת.
* `ref`: ה-`element.ref` המקורי, אלא אם כן הוא נדחק על ידי `props.ref`.
* `key`: ה-`element.key` המקורי, אלא אם כן הוא נדחק על ידי `props.key`.

בדרך כלל, אתה תחזיר את הרכיב מהרכיב שלך או תהפוך אותו לילד של אלמנט אחר. למרות שאתה יכול לקרוא את המאפיינים של האלמנט, עדיף להתייחס לכל אלמנט כאטום לאחר יצירתו, ולעבד אותו רק.

#### אזהרות {/*caveats*/}

* שיבוט של אלמנט **אינו משנה את האלמנט המקורי.**

* עליך **להעביר ילדים כארגומנטים מרובים ל-`cloneElement` רק אם כולם ידועים סטטית,** כמו `cloneElement(element, null, child1, child2, child3)`. אם הילדים שלכם דינמיים, העבר את כל המערך כארגומנט השלישי: `cloneElement(element, null, listItems)`. זה מבטיח ש-React [תזהיר אותך על חסרים `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) עבור כל רשימות דינמיות. עבור רשימות סטטיות זה לא הכרחי כיuse הם אף פעם לא מסדרים מחדש.

* `cloneElement` מקשה על המעקב אחר זרימת הנתונים, אז **נסה את [חלופות](#alternatives) במקום זאת.**

---

## שימוש {/*usage*/}

### עקיפת props של אלמנט {/*overriding-props-of-an-element*/}

כדי לעקוף את props של רכיב <CodeStep step={1}>React</CodeStep> כלשהו, ​​העבר אותו ל-`cloneElement` עם <CodeStep step={2}>props שברצונך לעקוף</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

כאן, <CodeStep step={3}>הרכיב המשובט</CodeStep> שנוצר יהיה `<Row title="Cabbage" isHighlighted={true} />`.

**בואו נעבור על דוגמה כדי לראות מתי היא מלאה use.**

תארו לעצמכם רכיב `List` שמעבד את [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) שלו כרשימה של שורות לבחירה עם כפתור "הבא" שמשנה איזו שורה נבחרה. הרכיב `List` צריך לעבד את ה-`Row` שנבחר בצורה שונה, אז הוא משכפל כל ילד `<Row>` שהוא קיבל, ומוסיף `isHighlighted: true` או `isHighlighted: false` תוספת נוספת:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

נניח שה-JSX המקורי שהתקבל על-ידי `List` נראה כך:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

על ידי שיבוט ילדיו, ה-`List` יכול להעביר מידע נוסף לכל `Row` בפנים. התוצאה נראית כך:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

שימו לב כיצד לחיצה על "הבא" מעדכנת את ה-state של ה-`List`, ומדגישה שורה אחרת:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

לסיכום, ה-`List` שיבט את האלמנטים `<Row />` שקיבל והוסיף להם אבזר נוסף.

<Pitfall>

שיבוט ילדים מקשה לדעת כיצד הנתונים זורמים דרך האפליקציה שלך. נסה אחת מה[חלופות.](#alternatives)

</Pitfall>

---

## חלופות {/*alternatives*/}

### העברת נתונים עם אבזר עיבוד {/*passing-data-with-a-render-prop*/}

במקום להשתמש ב-`cloneElement`, שקול לקבל *מאפיין עיבוד* כמו `renderItem`. כאן, `List` מקבל `renderItem` בתור אביזר. `List` קורא ל-`renderItem` עבור כל פריט ומעביר את `isHighlighted` כטיעון:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

הפרופס של `renderItem` נקרא "רנדור פרופס" מכיוון שuse זה אבזר שמציין כיצד לרנדר משהו. לדוגמה, אתה יכול להעביר יישום `renderItem` המציג `<Row>` עם הערך הנתון `isHighlighted`:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

התוצאה הסופית זהה לזו של `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

עם זאת, אתה יכול לעקוב בבירור מאיפה מגיע הערך `isHighlighted`.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

תבנית זו מועדפת על `cloneElement` כי use היא מפורשת יותר.

---

### העברת נתונים דרך ההקשר {/*passing-data-through-context*/}

חלופה נוספת ל-`cloneElement` היא [להעביר נתונים דרך הקשר.](/learn/passing-data-deeply-with-context)


לדוגמה, אתה יכול לקרוא ל-[`createContext`](/reference/react/createContext) כדי להגדיר `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

רכיב `List` שלך יכול לעטוף כל פריט שהוא מעבד לספק `HighlightContext`:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

בגישה זו, `Row` אינו צריך לקבל אבזר `isHighlighted` כלל. במקום זאת, הוא קורא את ההקשר:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

זה מאפשר לרכיב הקורא לא לדעת או לדאוג לגבי העברת `isHighlighted` ל-`<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

במקום זאת, `List` ו-`Row` מתאמים את היגיון ההדגשה באמצעות הקשר.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[למידע נוסף על העברת נתונים דרך הקשר.](/reference/react/useContext#passing-data-deeply-in-the-tree)

---

### חילוץ לוגיקה לתוך Hook {/*extracting-logic-into-a-custom-hook*/} מותאם אישית

גישה נוספת שאתה יכול לנסות היא לחלץ את ההיגיון ה"לא חזותי" לתוך Hook משלך, וuse את המידע המוחזר על ידי Hook שלך כדי להחליט מה לעבד. לדוגמה, אתה יכול לכתוב `useList` מותאם אישית Hook כך:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

אז אתה יכול use את זה ככה:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

זרימת הנתונים מפורשת, אבל ה-state נמצא בתוך `useList` המותאם אישית Hook שתוכלו use מכל רכיב:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

גישה זו היא useמלאה במיוחד אם ברצונך לשנותuse את ההיגיון הזה בין רכיבים שונים.
