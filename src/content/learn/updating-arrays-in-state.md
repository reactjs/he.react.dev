---
title: "עדכון מערכים ב-State"
---

<Intro>

מערכים ניתנים לשינוי ב-JavaScript, אך עליך להתייחס אליהם כאל ניתנים לשינוי כאשר אתה מאחסן אותם ב-state. בדיוק כמו עם אובייקטים, כאשר אתה רוצה לעדכן מערך המאוחסן ב-state, אתה צריך ליצור אחד חדש (או ליצור עותק של אחד קיים), ולאחר מכן להגדיר את state ל-use את המערך החדש.

</Intro>

<YouWillLearn>

- כיצד להוסיף, להסיר או לשנות פריטים במערך ב-React state
- כיצד לעדכן אובייקט בתוך מערך
- כיצד להפוך את העתקת המערך לפחות חוזרת על עצמה עם Immer

</YouWillLearn>

## עדכון מערכים ללא מוטציה {/*updating-arrays-without-mutation*/}

ב-JavaScript, מערכים הם רק סוג אחר של אובייקט. [כמו עם אובייקטים](/learn/updating-objects-in-state), **עליך להתייחס למערכים ב-React state כקריאה בלבד.** זה אומר שאסור לך להקצות מחדש פריטים בתוך מערך כמו `arr[0] = 'bird'`, ואתה גם אמור להשתיק את השיטה כמו `arr[0] = 'bird'`, כמו גם `arr[0] = 'bird'`. `push()` ו-`pop()`.

במקום זאת, בכל פעם שתרצה לעדכן מערך, תרצה להעביר מערך *חדש* לפונקציית ההגדרה state שלך. כדי לעשות זאת, אתה יכול ליצור מערך חדש מהמערך המקורי ב-state שלך על ידי קריאה לשיטות הלא-מוטציות שלו כמו `filter()` ו-`map()`. לאחר מכן תוכל להגדיר את state שלך למערך החדש שנוצר.

להלן טבלת התייחסות של פעולות מערך נפוצות. כאשר עוסקים במערכים בתוך React state, תצטרכו להימנע מהשיטות בעמודה השמאלית, ובמקום זאת להעדיף את השיטות בעמודה הימנית:

|           | למנוע (משנה את המערך) | מעדיף (מחזיר מערך חדש) |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| מוסיף | `push`, `unshift` | `concat`, `[...arr]` התחביר התפשט ([דוגמה](#הוספת-למערך)) |
| הסרת | `pop`, `shift`, `splice` | `filter`, `slice` ([דוגמה](#removing-from-an-array)) |
| מחליף | `splice`, `arr[i] = ...` מטלה | `map` ([דוגמה](#replaceing-items-in-an-array)) |
| מיון | `reverse`, `sort` | תחילה העתק את המערך ([דוגמה](#ביצוע-אחר-שינויים-למערך)) |

לחלופין, אתה יכול [use Immer](#write-concise-update-logic-with-immer) המאפשר לך use שיטות משתי העמודות.

<Pitfall>

למרבה הצער, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) ו-[`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) נקראות באופן דומה אך שונות מאוד:

* `slice` מאפשר לך להעתיק מערך או חלק ממנו.
* `splice` **משנה** את המערך (כדי להכניס או למחוק פריטים).

ב-React, אתה תשתמש ב-`slice` (ללא `p`!) לעתים קרובות יותר מכיוון שuse אינך רוצה לבצע מוטציה של אובייקטים או מערכים ב-state. [עדכון אובייקטים](/learn/updating-objects-in-state) מסביר מהי מוטציה ומדוע היא לא מומלצת עבור state.

</Pitfall>

### הוספה למערך {/*adding-to-an-array*/}

`push()` יבצע מוטציה של מערך, שאינך רוצה:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

במקום זאת, צור מערך *חדש* המכיל את הפריטים הקיימים *ו* פריט חדש בסוף. ישנן מספר דרכים לעשות זאת, אבל הקלה שבהן היא use את `...` [פיזור המערך](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) תחביר:

```js
setArtists( // Replace the state
  [ // with a new array
    ...artists, // that contains all the old items
    { id: nextId++, name: name } // and one new item at the end
  ]
);
```

עכשיו זה עובד כמו שצריך:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

תחביר התפשטות המערך מאפשר לך להוסיף פריט מראש על ידי הצבתו *לפני* ה-`...artists` המקורי:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```

בדרך זו, התפשטות יכולה לעשות את העבודה של `push()` גם על ידי הוספה לסוף מערך וגם של `unshift()` על ידי הוספה לתחילת מערך. נסה את זה בארגז החול למעלה!

### הסרה ממערך {/*removing-from-an-array*/}

הדרך הקלה ביותר להסיר פריט ממערך היא *לסנן אותו*. במילים אחרות, תייצר מערך חדש שלא יכיל את הפריט הזה. לשם כך, use שיטת `filter`, לדוגמה:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

לחץ על כפתור "מחק" כמה פעמים, והסתכל על מטפל הקליקים שלו.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

כאן, `artists.filter(a => a.id !== artist.id)` פירושו "צור מערך המורכב מאותם `artists` שהזיהויים שלהם שונים מ`artist.id`". במילים אחרות, כפתור "מחק" של כל אמן יסנן את _אותו_ האמן מחוץ למערך, ולאחר מכן יבקש עיבוד מחדש עם המערך שיתקבל. שימו לב ש`filter` לא משנה את המערך המקורי.

### שינוי מערך {/*transforming-an-array*/}

אם ברצונך לשנות חלק או את כל הפריטים של המערך, אתה יכול use `map()` כדי ליצור מערך **חדש**. הפונקציה שתעביר ל-`map` יכולה להחליט מה לעשות עם כל פריט, על סמך הנתונים שלו או האינדקס שלו (או שניהם).

בדוגמה זו, מערך מכיל קואורדינטות של שני עיגולים וריבוע. כאשר אתה לוחץ על הכפתור, הוא מזיז רק את העיגולים למטה ב-50 פיקסלים. זה עושה זאת על ידי הפקת מערך חדש של נתונים באמצעות `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### החלפת פריטים במערך {/*replacing-items-in-an-array*/}

נפוץ במיוחד לרצות להחליף פריט אחד או יותר במערך. מטלות כמו `arr[0] = 'bird'` מבצעות מוטציה של המערך המקורי, אז במקום זאת תרצה use `map` גם עבור זה.

כדי להחליף פריט, צור מערך חדש עם `map`. בתוך הקריאה `map` שלך, תקבל את אינדקס הפריט כארגומנט השני. השתמש בו כדי להחליט אם להחזיר את הפריט המקורי (הארגומנט הראשון) או משהו אחר:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### הכנסה למערך {/*inserting-into-an-array*/}

לפעמים, ייתכן שתרצה להוסיף פריט במיקום מסוים שהוא לא בהתחלה ולא בסוף. כדי לעשות זאת, אתה יכול use את תחביר התפשטות המערך `...` יחד עם שיטת `slice()`. שיטת `slice()` מאפשרת לך לחתוך "פרוסה" מהמערך. כדי להכניס פריט, תיצור מערך שמפיץ את הפרוסה _לפני_ נקודת ההכנסה, לאחר מכן את הפריט החדש, ולאחר מכן את שאר המערך המקורי.

בדוגמה זו, כפתור הוספה תמיד מוסיף באינדקס `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### ביצוע שינויים אחרים במערך {/*making-other-changes-to-an-array*/}

יש כמה דברים שאתה לא יכול לעשות עם תחביר התפשטות ושיטות ללא מוטציה כמו `map()` ו`filter()` לבד. לדוגמה, ייתכן שתרצה להפוך או למיין מערך. השיטות JavaScript `reverse()` ו`sort()` מבצעות מוטציה של המערך המקורי, כך שאינך יכול use אותם ישירות.

**עם זאת, תוכל להעתיק את המערך תחילה, ולאחר מכן לבצע בו שינויים.**

לְדוּגמָה:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

כאן, אתה use את תחביר התפשטות `[...list]` כדי ליצור תחילה עותק של המערך המקורי. כעת, לאחר שיש לך עותק, תוכל לבצע use מוטציה בשיטות כמו `nextList.reverse()` או `nextList.sort()`, או אפילו להקצות פריטים בודדים עם `nextList[0] = "something"`.

עם זאת, **גם אם תעתיק מערך, לא תוכל לבצע מוטציה ישירה של פריטים קיימים _בתוך_ שלו.** זה בגלל שההעתקה use היא רדודה--המערך החדש יכיל את אותם פריטים כמו המקורי. אז אם אתה משנה אובייקט בתוך המערך המועתק, אתה משנה את ה-state הקיים. לדוגמה, קוד כזה הוא בעיה.

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

למרות ש`nextList` ו`list` הם שני מערכים שונים, **`nextList[0]` ו`list[0]` מצביעים על אותו אובייקט.** אז על ידי שינוי `nextList[0].seen`, אתם גם משנים את `list[0].seen`. זוהי מוטציה state, שכדאי להימנע ממנה! אתה יכול לפתור בעיה זו בצורה דומה ל-[עדכון JavaScript אובייקטים מקוננים](/learn/updating-objects-in-state#updating-a-nested-object)--על ידי העתקת פריטים בודדים שברצונך לשנות במקום לשנות אותם. הנה איך.

## עדכון אובייקטים בתוך מערכים {/*updating-objects-inside-arrays*/}

אובייקטים אינם _באמת_ ממוקמים "בתוך" מערכים. הם עשויים להיראות "בפנים" בקוד, אבל כל אובייקט במערך הוא ערך נפרד, שאליו המערך "מצביע". זו הסיבה שאתה צריך להיות זהיר בעת שינוי שדות מקוננים כמו `list[0]`. רשימת יצירות האמנות של אדם אחר עשויה להצביע על אותו אלמנט של המערך!

**כאשר מעדכנים את state המקוננות, אתה צריך ליצור עותקים מהנקודה שבה אתה רוצה לעדכן, וכל הדרך עד לרמה העליונה.** בואו נראה איך זה עובד.

בדוגמה זו, לשתי רשימות גרפיקה נפרדות יש את אותו ההתחלה state. הם אמורים להיות מבודדים, אבל בגלל use של מוטציה, ה-state שלהם משותף בטעות, וסימון תיבה ברשימה אחת משפיע על הרשימה השנייה:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

הבעיה היא בקוד כזה:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

למרות שמערך `myNextList` עצמו חדש, *הפריטים עצמם* זהים למערך `myList` המקורי. אז שינוי `artwork.seen` משנה את פריט הגרפיקה *המקורי*. פריט הגרפיקה הזה נמצא גם ב-`yourList`, מה שuse הוא הבאג. קשה לחשוב על באגים כאלה, אבל למרבה המזל הם נעלמים אם נמנעים משינוי של state.

**אתה יכול use `map` להחליף פריט ישן בגרסה המעודכנת שלו ללא מוטציה.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

כאן, `...` הוא תחביר הפצת האובייקט used ל[יצירת עותק של אובייקט.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

עם גישה זו, אף אחד מהפריטים state הקיימים לא עובר מוטציה, והבאג תוקן:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

באופן כללי, **עליך לבצע מוטציה רק ​​של אובייקטים שזה עתה יצרת.** אם היית מוסיף יצירת אמנות *חדשה*, אתה יכול לשנות אותה, אבל אם יש לך עסק עם משהו שכבר נמצא ב-state, עליך ליצור עותק.

### כתוב היגיון עדכון תמציתי עם Immer {/*write-concise-update-logic-with-immer*/}

עדכון מערכים מקוננים ללא מוטציה יכול לחזור על עצמו מעט. [בדיוק כמו עם אובייקטים](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- בדרך כלל, לא צריך לעדכן את state יותר מכמה רמות עמוקות. אם האובייקטים state שלך עמוקים מאוד, אולי תרצה [לבנות אותם מחדש](/learn/choosing-the-state-structure#avoid-deeply-nested-state) כך שהם יהיו שטוחים.
- אם אינך רוצה לשנות את מבנה ה-state שלך, אולי תעדיף use [Immer](https://github.com/immerjs/use-immer), המאפשר לך לכתוב באמצעות התחביר הנוח אך המשתנה ודואג להפיק עבורך את העותקים.

הנה הדוגמה של רשימת דלי האמנות שנכתבה מחדש עם Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

שימו לב איך עם Immer, **מוטציה כמו `artwork.seen = nextSeen` היא עכשיו בסדר:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

זה בגלל שuse אתה לא משנה את ה_מקורי_ state, אלא אתה משנה אובייקט `draft` מיוחד שסופק על ידי Immer. באופן דומה, אתה יכול להחיל שיטות מוטציה כמו `push()` ו-`pop()` על התוכן של ה-`draft`.

מאחורי הקלעים, Immer תמיד בונה את ה-state הבא מאפס בהתאם לשינויים שעשיתם ב-`draft`. זה שומר על מטפלי האירועים שלך תמציתיים מאוד מבלי לשנות את state.

<Recap>

- אתה יכול להכניס מערכים לתוך state, אבל אתה לא יכול לשנות אותם.
- במקום לבצע מוטציה של מערך, צור גרסה *חדשה* שלו, ועדכן את ה-state אליו.
- אתה יכול use את תחביר התפשטות המערך `[...arr, newItem]` כדי ליצור מערכים עם פריטים חדשים.
- אתה יכול use `filter()` ו `map()` כדי ליצור מערכים חדשים עם פריטים מסוננים או שעבר טרנספורמציה.
- אתה יכול use לשקוע כדי לשמור על הקוד שלך תמציתי.

</Recap>



<Challenges>

#### עדכן פריט בעגלת הקניות {/*update-an-item-in-the-shopping-cart*/}

מלא את ההיגיון `handleIncreaseClick` כך שהקשה על "+" תגדיל את המספר המתאים:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

אתה יכול use את הפונקציה `map` כדי ליצור מערך חדש, ולאחר מכן use את תחביר הפצת האובייקט `...` כדי ליצור עותק של האובייקט שהשתנה עבור המערך החדש:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### הסר פריט לעגלת הקניות {/*remove-an-item-from-the-shopping-cart*/}

לעגלת הקניות הזו יש כפתור "+" עובד, אבל הכפתור "–" לא עושה כלום. עליך להוסיף לו מטפל באירועים כדי שהלחיצה עליו תפחית את ה-`count` של המוצר המתאים. אם תלחץ על "–" כאשר הספירה היא 1, המוצר אמור להסיר אוטומטית מהסל. ודא שהוא לעולם לא מראה 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

אתה יכול תחילה use `map` כדי לייצר מערך חדש, ולאחר מכן `filter` כדי להסיר מוצרים עם `count` מוגדר ל-`0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### תקן את המוטציות באמצעות שיטות לא-מוטטיביות {/*fix-the-mutations-using-non-mutative-methods*/}

בדוגמה זו, כל המטפלים באירועים במוטציה `App.js` use. כתוצאה מכך, עריכה ומחיקה של מטלות לא עובדות. כתוב מחדש את `handleAddTodo`, `handleChangeTodo` ו`handleDeleteTodo` ל-use את השיטות הלא-מוטטיביות:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

ב-`handleAddTodo`, אתה יכול use את תחביר הפצת המערך. ב-`handleChangeTodo`, אתה יכול ליצור מערך חדש עם `map`. ב-`handleDeleteTodo`, אתה יכול ליצור מערך חדש עם `filter`. עכשיו הרשימה עובדת כמו שצריך:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### תקן את המוטציות באמצעות Immer {/*fix-the-mutations-using-immer*/}

זו אותה דוגמה כמו באתגר הקודם. הפעם, תקן את המוטציות באמצעות Immer. לנוחיותך, `useImmer` כבר מיובא, אז עליך לשנות את המשתנה `todos` state ל-use אותו.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

עם Immer, אתה יכול לכתוב קוד בצורה מוטטיבית, כל עוד אתה משנה רק חלקים מה-`draft` ש-Immer נותן לך. כאן, כל המוטציות מבוצעות ב-`draft` כך שהקוד עובד:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

אתה יכול גם לערבב ולהתאים את הגישות המוטטיביות והלא-מוטטיביות עם Immer.

לדוגמה, בגרסה זו `handleAddTodo` מיושם על ידי שינוי ב-Immer `draft`, בעוד `handleChangeTodo` ו-`handleDeleteTodo` use השיטות `map` ו`filter` הלא-מוטטיביות:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

עם Immer, אתה יכול לבחור את הסגנון שמרגיש הכי טבעי עבור כל מקרה נפרד.

</Solution>

</Challenges>

