---
title: "שיתוף state בין קומפונטות"
---

<Intro>

לפעמים, אתה רוצה שstateם של שני רכיבים ישתנה תמיד ביחד. כדי לעשות זאת, להעביר אותו להורה המשותף הקרוב, הוא העביר אותו ביותר_3 באמצעות __TK__. זה ידוע בתור *הרמת state למעלה* וזה אחד הדברים הנפוצים ביותר שתעשו בכתיבת קוד React.

</Intro>

<YouWillLearn>

- כיצד לחלוק מצב בין רכיבים על ידי הרמתו למעלה
- מהם רכיבים מבוקרים ובלתי מבוקרים

</YouWillLearn>

## מצב הרמה למעלה לפי דוגמה {/*הרמה-מצב-מעלה-לפי-דוגמה*/}

בדוגמה זו, רכיב 'אקורדיון' אב יוצר שני 'פאנלים' נפרדים:

* `אקורדיון`
  - `פאנל`
  - `פאנל`

לכל רכיב 'פאנל' יש מצב 'isActive' בוליאני שקובע אם התוכן שלו גלוי.

לחץ על כפתור הצג עבור שני הפאנלים:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

שימו לב כיצד לחיצה על כפתור של לוח אחד לא משפיעה על הלוח השני - הם עצמאיים.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

בתחילה, מצב ה-'isActive' של כל 'פאנל' הוא 'שקר', כך ששניהם נראים מכווצים

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

לחיצה על כפתורי ה'פאנל' תעדכן רק את מצב ה'isActive' של אותו 'פאנל' בלבד

</Diagram>

</DiagramGroup>

**אבל עכשיו נניח שאתה רוצה לשנות אותו כך שרק לוח אחד יורחב בכל זמן נתון.** עם העיצוב הזה, הרחבת הפאנל השני אמורה לכווץ את הלוח הראשון. איך היית עושה את זה?

כדי לתאם את שני הלוחות הללו, עליך "להרים את מצבם" לרכיב אב בשלושה שלבים:

1. **הסר** מצב ממרכיבי הצאצא.
2. **עבר** נתונים מקודדים מההורה המשותף.
3. **הוסף** מצב להורה המשותף והעביר אותו יחד עם מטפלי האירועים.

זה יאפשר לרכיב 'אקורדיון' לתאם את שני ה'פאנלים' ולהרחיב רק אחד בכל פעם.

### שלב 1: הסר מצב מהרכיבים הצאצאים {/*step-1-remove-state-from-the-child-components*/}

אתה תיתן שליטה ב-'isActive' של ה-Panel לרכיב האב שלו. המשמעות היא שרכיב העביר את 'isActive' ל'פאנל' לפי props במקום. התחל על ידי **הסרת השורה הזו** מהרכיב 'פאנל':

```js
const [isActive, setIsActive] = useState(false);
```

ובמקום זאת, הוסף את 'isActive' לרשימת הprops של ה'פאנל':

```js
function Panel({ title, children, isActive }) {
```

רכיב האב של `הפאנל` יכול *לשלוט* ב`isActive` על ידי [העברתו לפי אב.](/learn/passing-props-to-a-component) לעומת זאת, לרכיב `Panel` אין כרגע *שליטה* על הערך של `isActive`--זה תלוי עכשיו ברכיב האב!

### שלב 2: העבר נתונים מקודדים קשיחים מההורה המשותף {/*שלב-2-מעבר-המקודד-הקשה-נתונים-מההורה-המשותף*/}

כדי להעלות את הstate למעלה, עליך לאתר את הרכיב האב המשותף הקרוב ביותר של *שני* רכיבי הצאצא שברצונך לתאם:

* `אקורדיון` *(הורה המשותף הקרוב ביותר)*
  - `פאנל`
  - `פאנל`

בדוגמה זו, זה רכיב 'אקורדיון'. הוא יהפוך ל"מקור האמת" שעבורו הפאנל פעיל כרגע. הפוך את הרכיב 'אקורדיון' להעביר ערך מקודד של 'isActive' (לדוגמה, 'true') לשני הפאנלים:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

נסה לערוך את ערכי ה-'isActive' המקודדים ברכיב 'אדיון' וראה את התוצאה על המסך.

### שלב 3: הוסף מצב להורה המשותף {/*step-3-add-state-to-the-common-parent*/}

רמת מצב חוץ מזה שאתה עושה את האופי של מה מאחסן כstate.

במקרה זה, רק פאנל אחד צריך להיות פעיל בכל פעם. המשמעות היא שרכיב האב הנפוץ 'אקורדיון' צריך לעקוב אחר *איזה* פאנל הוא הפאנל הפעיל. במקום ערך 'בוליאני', הוא יכול להשתמש בפאפא עבור האינדקס של ה'נל' הפעיל עבור ranking הstate:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

כאשר `activeIndex` הוא `0`, החלונית הראשונה פעילה, וכאשר היא `1`, היא השנייה.

לחיצה על כפתור "הצג" בכל אחד מה'פאנלים' צריכה לשנות את האינדקס הפעיל ב'אקורדיון'. `פאנל` לא יכול להגדיר את המצב __K_1__ לפי זה שהוא מוגדר בתוך `האקורדיון`. הרכיב 'אקורדיון' צריך *לאפשר* במפורש לרכיב ה'פאנל' לשנות את המצב על ידי [העברת מטפל באירועים כעזר](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

ה-`<button>` בתוך ה-Panel ישתמש ב-'onShow' כמטפל באירוע קליק שלו:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

זה משלים את מצב הרמה למעלה! העברת הstate לרכיב האב המשותף אפשרה לך לתאם את שני הפאנלים. שימוש באינדקס הפעיל במקום שני דגלים "מוצג" הבטיח שרק פאנל אחד פעיל בזמן נתון. והעברת מטפל לילד אפשר לילד לשנות את מצב ההורה.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

בתחילה, `activeIndex` של `Accordion` הוא `0`, כך שה`פאנל` הראשון מקבל `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

כאשר מצב `activeIndex` של `Accordion` משתנה ל`1`, ה`פאנל` השני מקבל במקום זאת `isActive = true`

</Diagram>

</DiagramGroup>

<DeepDive>

#### רכיבים מבוקרים ובלתי מבוקרים {/*רכיבים-מבוקרים-ובלתי-מבוקרים*/}

מקובל לקרוא לרכיב עם state מקומית "לא מבוקר". לדוגמה, רכיב ה-'Panel' המקורי עם ranking הstate 'isActive' אינו מבוקר מה שהאב שלו אינו יכול להשפיע אם הפאנל פעיל או לא.

לעומת זאת, אפשר לומר שרכיב "נשלט" כאשר הוא חייב מונע על ידי props ולא על ידי הstate המקומית שלו. זה יכול להכיל את ההתנהגות שלו. רכיב ה'פאנל' הסופי עם הprops 'isActive' נשלט על ידי רכיב ה'אקורדיון'.

רכיבים לא מבוקרים קלים יותר לשימוש בתוך הוריהם שהם דורשים פחות תצורה. אבל הם פחות גמישים כשרוצים לתאם אותם יחד. רכיבים מבוקרים הם גמישים בצורה מקסימלית, אך הם דורשים מהן צריך להגדיר אותם לגמרי עם props.

בפועל, "נשלט" ו"בלתי מבוקר" קיפדים טכניים - לכל רכיב יש בדרך כלל שילוב מסוים של state מקומית ושל props. עם זאת, זו דרך שימושית לדבר על האופן שבו רכיבים מתוכננים והיכולות שהם מציעים.

בעת כתיבת רכיב, שקול איזה מידע בו יש לשלוט (באמצעות props), ואיזה מידע צריך להיות בלתי מבוקר (דרך הstate). אבל אתה תמיד יכול לשנות את דעתך ולהתחיל מחדש מאוחר יותר.

</DeepDive>

## מקור אמת יחיד לכל state {/*מקור-יחיד-של-אמת-לכל-state*/}

ביישום React, לרכיבים רבים יהיו מצב משלהם. מצב מסוים עשוי "לחיות" קרוב לרכיבי העלים (רכיבים בתחתית העץ) כמו תשומות. מצב אחר עשוי "לגור" קרוב יותר לחלק העליון של האפליקציה. לדוגמה, אפילו ספריות ניתוב נוסף הלקוח מיו שמות בדרך כלל על ידי אחסון המסלול הנוכחי בstate React והעברתו על ידי props!

**לעבור כל פיסת state ייחודית, תבחר את הרכיב ש"הבעלים" שלו.** עיקרון זה ידוע גם כבעל ["מקור אחד של אמת".](https://en.wikipedia.org/wiki/Single_source_of_truth) זה לא אומר שכל הstate חיה במקום אחד - אבל שלכל רכיב זה ישנה נתח מידע ו.במקום לשכפל מצב שותף אותו בין רכיבים*, *להם שותפים אותו*,*להם.

האפליקציה שלך תשתנה תוך כדי עבודה עליה. זה נפוץ שתזוז את הstate למטה או בחזרה למעלה בזמן שאתה עדיין מגלה היכן כל חלק של הstate "חי". כל זה חלק מהתהליך!

כדי לראות איך זה מרגיש עם עוד כמה רכיבים, קרא את [Thinking in React.](/learn/thinking-in-react)

<Recap>

* כאשר אתה רוצה לתאם שני מרכיבים, העבר את מצבם להורה המשותף שלהם.
* לאחר שהעבירו את המידע דרך props מהורה המשותף שלהם.
* לבסוף, העבירו את מטפלי האירועים כדי שהילדים יוכלו לשנות את מצב ההורה.
* כדאי להתייחס לרכיבים כ"מבוקרים" (מונעים על ידי props) או "בלתי נשלטים" (מונעים על ידי state).

</Recap>

<Challenges>

#### כניסות מסונכרנות {/*כניסות-מסונכרנות*/}

שתי כניסות אלו אינן תלויות. לגרום להם להישאר מסונכרנים: עריכת קלט אחד אמורה לעדכן את הקלט השני באותו טקסט, ולהיפך. 

<Hint>

תצטרך להעלות את הstate שלהם בתוך רכיב האב.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

העבר את דירוג הstate 'טקסט' ברכיב האב יחד עם המטפל 'handleChange'. לאחר העבירו אותם כprops לשני רכיבי ה'קלט'. זה ישמור אותם מסונכרנים.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### רשימת סינון {/*filtering-a-list*/}

בדוגמה זו, ל-SearchBar יש מצב 'שאילתה' משלו השולט בקלט הטקסט. רכיב האב 'FilterableList' שלו מציג 'רשימה' של פריטים, אבל הוא לא לוקח בחשבון את שאילתת החיפוש.

השתמש בפעולה 'filterItems(foods, query)' כדי לסנן את הרשימה לפי שאילתת החיפוש. כדי לבדוק את השינויים שלך, ודא שהקלדת "s" במסנני הקלט מסננת למטה ברשימה "סושי", "שיש קבב" ו"דים סאם".

שים לב ש-'filterItems' כבר מיושם ומיובא כך שאתה לא צריך לכתוב את זה בעצמך!

<Hint>

תרצה להשתמש במצב ה-'שאילתה' ואת המטפל 'handleChange' מ'סרגל החיפוש', ולהעביר אותם ל-'FilterableList'. לאחר העבירו אותם אל 'סרגל לחפש' בתור props 'שאילתה' ו-'onChange'.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

הרם את המצב ה-'שאילתה' למעלה לתוך הרכיב 'FilterableList'. התקשר ל'filterItems(מזונות, שאילתה)' כדי לקבל את הרשימה המסוננת ולהעביר את הרשימה. שינוי קלט השאילתה בא לידי ביטוי ברשימה:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>

