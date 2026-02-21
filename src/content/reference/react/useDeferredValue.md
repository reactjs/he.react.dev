---
title: "useDeferredValue"
---

<Intro>

`useDeferredValue` הוא React Hook המאפשר לך לדחות עדכון של חלק מהממשק.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useDeferredValue(value)` {/*usedeferredvalue*/}

התקשר ל-`useDeferredValue` ברמה העליונה של הרכיב שלך כדי לקבל גרסה נדחית של הערך הזה.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `value`: הערך שברצונך לדחות. זה יכול להיות כל סוג.

#### מחזירה {/*returns*/}

במהלך העיבוד הראשוני, הערך הדחוי המוחזר יהיה זהה לערך שסיפקת. במהלך עדכונים, React ינסה תחילה עיבוד מחדש עם הערך הישן (כך הוא יחזיר את הערך הישן), ולאחר מכן ינסה עיבוד מחדש ברקע עם הערך החדש (כך הוא יחזיר את הערך המעודכן).

#### אזהרות {/*caveats*/}

- הערכים שתעביר ל-`useDeferredValue` צריכים להיות ערכים פרימיטיביים (כמו מחרוזות ומספרים) או אובייקטים שנוצרו מחוץ לעיבוד. אם אתה יוצר אובייקט חדש במהלך הרינדור ומיד מעביר אותו ל-`useDeferredValue`, הוא יהיה שונה בכל רינדור, ויגרום לעיבוד מחדש של רקע מיותר.

- כאשר `useDeferredValue` מקבל ערך שונה (בהשוואה ל-[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), בנוסף לעיבוד הנוכחי (כאשר הוא עדיין use הוא הערך הקודם), הוא מתזמן עיבוד מחדש ברקע עם הערך החדש. העיבוד מחדש ברקע ניתן להפסקה: אם יש עדכון נוסף לרקע __K_2 יתחיל מחדש את הרקע __K_2 scratch לדוגמה, אם ה-user מקליד בקלט מהר יותר ממה שתרשים שמקבל את הערך הנדחה שלו יכול לעבד מחדש, התרשים יוצג מחדש רק לאחר שה-user יפסיק להקליד.

- `useDeferredValue` משולב עם [`<Suspense>`.](/reference/react/Suspense) אם עדכון הרקע caused על ידי ערך חדש משעה את ממשק המשתמש, ה-user לא יראה את החזרה. הם יראו את הערך הדחוי הישן עד לטעינת הנתונים.

- `useDeferredValue` אינו מונע כשלעצמו בקשות רשת נוספות.

- אין עיכוב קבוע caused על ידי `useDeferredValue` עצמו. ברגע שReact מסיים את העיבוד מחדש המקורי, React יתחיל מיד לעבוד על העיבוד מחדש ברקע עם הערך הדחוי החדש. כל עדכונים caused על ידי אירועים (כמו הקלדה) יפריעו לעיבוד מחדש ברקע ויקבלו עדיפות על פניו.

- העיבוד מחדש של הרקע caused על ידי `useDeferredValue` אינו מפעיל אפקטים עד שהוא מחויב למסך. אם העיבוד מחדש ברקע מושעה, האפקטים שלו יפעלו לאחר טעינת הנתונים ועדכוני ממשק המשתמש.

---

## שימוש {/*usage*/}

### מציג תוכן מיושן בזמן טעינת תוכן טרי {/*showing-stale-content-while-fresh-content-is-loading*/}

התקשר ל-`useDeferredValue` ברמה העליונה של הרכיב שלך כדי לדחות עדכון של חלק כלשהו מהממשק שלך.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

במהלך העיבוד הראשוני, <CodeStep step={2}>הערך הדחוי</CodeStep> יהיה זהה ל<CodeStep step={1}>ערך</CodeStep> שסיפקת.

במהלך עדכונים, <CodeStep step={2}>הערך הדחוי</CodeStep> "יפגר מאחורי" ה<CodeStep step={1}>ערך</CodeStep> האחרון. בפרט, React תחילה יעבד מחדש *ללא* לעדכן את הערך הנדחה, ולאחר מכן ינסה לעבד מחדש עם הערך החדש שהתקבל ברקע.

**בואו נעבור על דוגמה כדי לראות מתי זה מלא use.**

<Note>

דוגמה זו מניחה שאתה use מקור נתונים מאופשר Suspense:

- אחזור נתונים עם מסגרות התומכות ב-Suspense כמו [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) ו-[Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- קוד רכיב בטעינה עצלנית עם [`lazy`](/reference/react/lazy)
- קריאת הערך של הבטחה עם [`use`](/reference/react/use)

[למידע נוסף על Suspense והמגבלות שלו.](/reference/react/Suspense)

</Note>


בדוגמה זו, הרכיב `SearchResults` [משהה](/reference/react/Suspense#displaying-a-fallback-while-content-in-loading) בזמן שליפת תוצאות החיפוש. נסה להקליד `"a"`, להמתין לתוצאות, ולאחר מכן לערוך אותו ל-`"ab"`. התוצאות עבור `"a"` מוחלפות ב-fallback הטעינה.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

דפוס משתמש חלופי נפוץ הוא *לדחות* את עדכון רשימת התוצאות ולהמשיך להציג את התוצאות הקודמות עד שהתוצאות החדשות יהיו מוכנות. התקשר ל-`useDeferredValue` כדי להעביר גרסה נדחית של השאילתה:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

ה-`query` יתעדכן מיד, כך שהקלט יציג את הערך החדש. עם זאת, ה-`deferredQuery` ישמור על הערך הקודם שלו עד שהנתונים ייטענו, אז `SearchResults` יציג את התוצאות המעופשות לזמן מה.

הזן `"a"` בדוגמה למטה, המתן לטעינת התוצאות ולאחר מכן ערוך את הקלט ל-`"ab"`. שים לב כיצד במקום ה-fallback Suspense, אתה רואה כעת את רשימת התוצאות המיושנת עד לטעינת התוצאות החדשות:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### איך עובדת דחיית ערך מתחת למכסה המנוע? {/*how-does-deferring-a-value-work-under-the-hood*/}

אתה יכול לחשוב שזה קורה בשני שלבים:

1. **ראשית, React מעבד מחדש עם `query` החדש (`"ab"`) אבל עם `deferredQuery` הישן (עדיין `"a")`.** הערך `deferredQuery`, שאתה מעביר לרשימת התוצאות, *נדחה:* הוא "פוגר אחרי" הערך __TK_

2. **ברקע, React מנסה לעבד מחדש עם *גם* `query` וגם `deferredQuery` מעודכנות ל-`"ab"`.** אם העיבוד מחדש הזה יסתיים, React יציג אותו על המסך. עם זאת, אם הוא מושהה (התוצאות עבור `"ab"` עדיין לא נטענו), React ינטוש את ניסיון העיבוד הזה, וינסה שוב לבצע עיבוד מחדש לאחר טעינת הנתונים. ה-user ימשיך לראות את הערך הדחוי המעופש עד שהנתונים יהיו מוכנים.

עיבוד ה"רקע" הנדחה ניתן להפסקה. לדוגמה, אם תקליד שוב בקלט, React ינטוש אותו ויתחיל מחדש עם הערך החדש. React תמיד use הערך האחרון שסופק.

שימו לב שעדיין ישנה בקשת רשת בכל הקשה. מה שנדחה כאן הוא הצגת תוצאות (עד שהן מוכנות), לא בקשות הרשת עצמן. גם אם ה-user ממשיך להקליד, התגובות עבור כל הקשה על המקשים נשמרות במטמון, כך שהקשה על Backspace היא מיידית ואינה מביאה שוב.

</DeepDive>

---

### מציין שהתוכן מיושן {/*indicating-that-the-content-is-stale*/}

בדוגמה שלמעלה, אין אינדיקציה שרשימת התוצאות עבור השאילתה האחרונה עדיין בטעינה. זה יכול לבלבל את ה-user אם התוצאות החדשות ייקח זמן מה לטעון. כדי שיהיה ברור יותר ל-user שרשימת התוצאות אינה תואמת את השאילתה העדכנית ביותר, תוכל להוסיף אינדיקציה חזותית כאשר רשימת התוצאות המיושנת מוצגת:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

עם השינוי הזה, ברגע שאתה מתחיל להקליד, רשימת התוצאות המיושנת מתעמעמת מעט עד שרשימת התוצאות החדשה נטענת. אתה יכול גם להוסיף מעבר CSS להשהיית עמעום כך שירגיש הדרגתי, כמו בדוגמה למטה:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### דחיית עיבוד מחדש עבור חלק ממשק המשתמש {/*deferring-re-rendering-for-a-part-of-the-ui*/}

אתה יכול גם להחיל `useDeferredValue` כאופטימיזציה של ביצועים. זה useמלא כאשר חלק מהממשק שלך איטי לעיבוד מחדש, אין דרך קלה לייעל אותו ואתה רוצה למנוע ממנו לחסום את שאר ממשק המשתמש.

תאר לעצמך שיש לך שדה טקסט ורכיב (כמו תרשים או רשימה ארוכה) שמוצגים מחדש בכל הקשה:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

ראשית, בצע אופטימיזציה של `SlowList` כדי לדלג על עיבוד מחדש כאשר ה-props שלו זהים. כדי לעשות זאת, [עטפו אותו ב-`memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

עם זאת, זה עוזר רק אם `SlowList` props הם *זהים* כמו במהלך העיבוד הקודם. הבעיה שאת מתמודדת איתה עכשיו היא שזה איטי כשהם *שונים* וכשאתה באמת צריך להראות פלט חזותי שונה.

באופן קונקרטי, בעיית הביצועים העיקרית היא שבכל פעם שאתה מקליד בקלט, ה-`SlowList` מקבל props חדש, ורינדור מחדש של כל העץ שלו גורם להקלדה להרגיש מופרכת. במקרה זה, `useDeferredValue` מאפשר לך לתעדף את עדכון הקלט (שחייב להיות מהיר) על פני עדכון רשימת התוצאות (אשר מותר להיות איטי יותר):

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

זה לא הופך את העיבוד מחדש של ה-`SlowList` למהיר יותר. עם זאת, הוא אומר ל-React שניתן לבטל את סדר העדיפויות של עיבוד מחדש של הרשימה כך שלא יחסום את ההקשות. הרשימה "תעכב מאחורי" הקלט ולאחר מכן "תדביק". כמו קודם, React ינסה לעדכן את הרשימה בהקדם האפשרי, אך לא יחסום את user מהקלדה.

<Recipes titleText="The difference between useDeferredValue and unoptimized re-rendering" titleId="examples">

#### עיבוד מחדש נדחה של הרשימה {/*deferred-re-rendering-of-the-list*/}

בדוגמה זו, כל פריט ברכיב `SlowList` מואט באופן מלאכותי** כך שתוכל לראות כיצד `useDeferredValue` מאפשר לך לשמור על הקלט תגובה. הקלד את הקלט ושם לב שההקלדה מרגישה מהירה בזמן שהרשימה "נגררת" אחריה.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### עיבוד מחדש ללא אופטימיזציה של הרשימה {/*unoptimized-re-rendering-of-the-list*/}

בדוגמה זו, כל פריט ברכיב `SlowList` הוא **האטה באופן מלאכותי**, אך אין `useDeferredValue`.

שים לב איך הקלדה בקלט מרגישה מאוד מטופשת. זה בגלל use ללא `useDeferredValue`, כל הקשה מאלצת את הרשימה כולה לעיבוד מחדש באופן מיידי בצורה בלתי ניתנת להפסקה.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

אופטימיזציה זו מחייבת את `SlowList` לעטוף ב-[`memo`.](/reference/react/memo) זה בגלל use בכל פעם שה-`text` משתנה, React צריך להיות מסוגל לעבד מחדש את רכיב האב במהירות. במהלך העיבוד מחדש, ל-`deferredText` עדיין יש את הערך הקודם שלו, כך ש-`SlowList` מסוגל לדלג על רינדור מחדש (props שלו לא השתנה). ללא [`memo`,](/reference/react/memo) הוא יצטרך בכל מקרה לעבד מחדש, ולהביס את נקודת האופטימיזציה.

</Pitfall>

<DeepDive>

#### במה שונה דחיית ערך מהקפצה ומצערת? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

ישנן שתי טכניקות אופטימיזציה נפוצות שעשויות להיות לך used בעבר בתרחיש זה:

- *הקפצה* פירושה שתמתין עד שה-user יפסיק להקליד (למשל לשנייה) לפני שתעדכן את הרשימה.
- *מחסנת* פירושה שתעדכן את הרשימה מדי פעם (למשל, לכל היותר פעם בשנייה).

בעוד שטכניקות אלו מועילות במקרים מסוימים, `useDeferredValue` מתאימה יותר לאופטימיזציה של רינדור מכיוון שהיא משולבת עמוקות עם React עצמה ומסתגלת למכשיר של user.

בניגוד להקפצה או מצערת, זה לא מצריך בחירת השהיה קבועה כלשהי. אם המכשיר של ה-user מהיר (לדוגמה, מחשב נייד חזק), הרינדור החוזר הנדחה יתרחש כמעט מיד ולא יהיה מורגש. אם המכשיר של ה-user איטי, הרשימה "תפגר מאחורי" הקלט באופן פרופורציונלי לאיטי המכשיר.

כמו כן, בשונה מהקפצה או מצערת, עיבוד מחדש דחוי שנעשה על ידי `useDeferredValue` ניתנים להפסקה כברירת מחדל. זה אומר שאם React נמצא באמצע עיבוד מחדש של רשימה גדולה, אבל ה-user מבצע הקשה נוספת, React ינטוש את העיבוד המחודש הזה, יטפל בהקשה ואז יתחיל לעבד ברקע שוב. לעומת זאת, ניתוק ומצערת עדיין מייצרים חוויה מטורפת מכיוון שהם *חוסמים:* הם פשוט דוחים את הרגע שבו העיבוד חוסם את הקשה.

אם העבודה שאתה מבצע אופטימיזציה לא מתרחשת במהלך הרינדור, ההקפצה והמצערת עדיין מלאות use. לדוגמה, הם יכולים לאפשר לך להפעיל פחות בקשות רשת. אתה יכול גם use טכניקות אלה ביחד.

</DeepDive>
