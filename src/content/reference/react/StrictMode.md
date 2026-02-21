---
title: "<StrictMode>"
---


<Intro>

`<StrictMode>` מאפשר לך למצוא באגים נפוצים ברכיבים שלך בשלב מוקדם במהלך הפיתוח.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

השתמש ב-`StrictMode` כדי לאפשר התנהגויות פיתוח נוספות ואזהרות עבור עץ הרכיבים בפנים:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[ראה דוגמאות נוספות למטה.](#usage)

מצב קפדני מאפשר את ההתנהגויות הבאות לפיתוח בלבד:

- הרכיבים שלך [יעבדו מחדש זמן נוסף](#fixing-bugs-found-by-double-rendering-in-development) כדי למצוא באגים caused על ידי עיבוד לא טהור.
- הרכיבים שלך [יפעילו מחדש את אפקטים פעם נוספת](#fixing-bugs-found-by-re-running-effects-in-development) כדי למצוא באגים caused על ידי חסר אפקט ניקוי.
- הרכיבים שלך [ייבדקו עבור שימוש ב-APIs שהוצא משימוש.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### אבזרים {/*props*/}

`StrictMode` לא מקבל props.

#### אזהרות {/*caveats*/}

* אין דרך לבטל את הסכמתך למצב קפדני בתוך עץ עטוף ב-`<StrictMode>`. זה נותן לך ביטחון שכל הרכיבים בתוך `<StrictMode>` מסומנים. אם שני צוותים שעובדים על מוצר אינם מסכימים אם הם מוצאים שההמחאות חשובות, הם צריכים להגיע לקונצנזוס או להעביר את `<StrictMode>` למטה בעץ.

---

## שימוש {/*usage*/}

### הפעלת מצב קפדני עבור האפליקציה כולה {/*enabling-strict-mode-for-entire-app*/}

מצב קפדני מאפשר בדיקות נוספות לפיתוח בלבד עבור כל עץ הרכיבים בתוך הרכיב `<StrictMode>`. בדיקות אלו עוזרות לך למצוא באגים נפוצים ברכיבים שלך בשלב מוקדם של תהליך הפיתוח.


כדי להפעיל מצב קפדני עבור כל האפליקציה שלך, עטוף את רכיב השורש שלך ב-`<StrictMode>` כשאתה מעבד אותו:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

אנו ממליצים לעטוף את האפליקציה כולה במצב קפדני, במיוחד עבור אפליקציות חדשות שנוצרו. אם אתה use מסגרת שקוראת ל-[`createRoot`](/reference/react-dom/client/createRoot) עבורך, בדוק את התיעוד שלה כיצד להפעיל מצב קפדני.

למרות ש-Strict Mode בודקים **פועלים רק בפיתוח,** הם עוזרים לך למצוא באגים שכבר קיימים בקוד שלך אבל יכול להיות מסובך לשכפול מהימן בייצור. מצב קפדני מאפשר לך לתקן באגים לפני שה-users שלך מדווחים עליהם.

<Note>

מצב קפדני מאפשר את הבדיקות הבאות בפיתוח:

- הרכיבים שלך [יעבדו מחדש זמן נוסף](#fixing-bugs-found-by-double-rendering-in-development) כדי למצוא באגים caused על ידי עיבוד לא טהור.
- הרכיבים שלך [יפעילו מחדש את אפקטים פעם נוספת](#fixing-bugs-found-by-re-running-effects-in-development) כדי למצוא באגים caused על ידי חסר אפקט ניקוי.
- הרכיבים שלך [ייבדקו עבור שימוש ב-APIs שהוצא משימוש.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**כל הבדיקות הללו הן לפיתוח בלבד ואינן משפיעות על בניית הייצור.**

</Note>

---

### הפעלת מצב קפדני עבור חלק מהאפליקציה {/*enabling-strict-mode-for-a-part-of-the-app*/}

אתה יכול גם להפעיל מצב קפדני עבור כל חלק ביישום שלך:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

בדוגמה זו, בדיקות מצב קפדניות לא יפעלו כנגד הרכיבים `Header` ו`Footer`. עם זאת, הם יפעלו על `Sidebar` ו`Content`, כמו גם על כל הרכיבים שבתוכם, לא משנה כמה עמוק.

---

### תיקון באגים שנמצאו על ידי רינדור כפול בפיתוח {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React מניח שכל רכיב שאתה כותב הוא פונקציה טהורה.](/learn/keeping-components-pure) פירוש הדבר שרכיבי React שאתה כותב חייבים תמיד להחזיר את אותו JSX בהינתן אותם כניסות (props, state והקשר).

רכיבים המפרים את הכלל הזה מתנהגים בצורה בלתי צפויה ובאגים cause. כדי לעזור לך למצוא בטעות קוד לא טהור, Strict Mode קורא לחלק מהפונקציות שלך (רק אלו שאמורות להיות טהורות) **פעמיים בפיתוח.** זה כולל:

- גוף פונקציית הרכיב שלך (רק לוגיקה ברמה העליונה, כך שזה לא כולל קוד בתוך מטפלי אירועים)
- פונקציות שאתה מעביר ל-[`useState`](/reference/react/useState), [`set` functions](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), או [`set`reference](TK__3/8__)
- שיטות מסוימות של רכיבי מחלקה כמו [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([ראה את כל הרשימה](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

אם פונקציה טהורה, הפעלתה פעמיים לא משנה את התנהגותה מכיוון שפונקציה טהורה מפיקה את אותה תוצאה בכל פעם. עם זאת, אם פונקציה אינה טהורה (לדוגמה, היא משנה את הנתונים שהיא מקבלת), הפעלתה פעמיים נוטה להיות מורגשת (זה מה שהופך אותה לאטהורה!) זה עוזר לך לזהות ולתקן את הבאג מוקדם.

**הנה דוגמה כדי להמחיש כיצד עיבוד כפול במצב קפדני עוזר לך למצוא באגים מוקדם.**

רכיב `StoryTray` זה לוקח מערך של `stories` ומוסיף פריט "צור סיפור" אחרון בסוף:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

יש טעות בקוד למעלה. עם זאת, קל לפספס מכיוון שהפלט הראשוני נראה נכון.

טעות זו תהפוך בולטת יותר אם הרכיב `StoryTray` יעבד מחדש מספר פעמים. לדוגמה, בוא נגרום ל-`StoryTray` לעבד מחדש עם צבע רקע שונה בכל פעם שאתה מרחף מעליו:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

שים לב איך בכל פעם שאתה מרחף מעל הרכיב `StoryTray`, "צור סיפור" יתווסף שוב לרשימה. הכוונה של הקוד הייתה להוסיף אותו פעם אחת בסוף. אבל `StoryTray` משנה ישירות את מערך `stories` מה-props. בכל פעם ש`StoryTray` מעבד, הוא מוסיף "צור סיפור" שוב בסוף אותו מערך. במילים אחרות, `StoryTray` אינה פונקציה טהורה - הפעלתה מספר פעמים מניבה תוצאות שונות.

כדי לפתור בעיה זו, אתה יכול ליצור עותק של המערך, ולשנות את העותק במקום המקורי:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

זה יהפוך את הפונקציה `StoryTray` לטהורה.](/learn/keeping-components-pure) בכל פעם שהיא נקראת, היא תשנה רק עותק חדש של המערך, ולא תשפיע על אובייקטים או משתנים חיצוניים. זה פותר את הבאג, אבל היית צריך לעשות את הרכיב מחדש בתדירות גבוהה יותר לפני שהתברר שמשהו לא בסדר בהתנהגות שלו.

**בדוגמה המקורית, הבאג לא היה ברור. עכשיו בואו נעטוף את הקוד המקורי (באגי) ב-`<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**מצב קפדני *תמיד* קורא לפונקציית העיבוד שלך פעמיים, כך שתוכל לראות את הטעות מיד** ("צור סיפור" מופיע פעמיים). זה מאפשר לך להבחין בטעויות כאלה בשלב מוקדם של התהליך. כאשר אתה מתקן את הרכיב שלך לרינדור במצב קפדני, אתה *גם* מתקן באגים אפשריים בעתיד בייצור כמו פונקציונליות הריחוף מלפני כן:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

ללא מצב קפדני, קל היה לפספס את הבאג עד שהוספת עוד עיבודים מחדש. מצב קפדני גרם לאותו באג להופיע מיד. מצב קפדני עוזר לך למצוא באגים לפני שאתה דוחף אותם לצוות שלך ול-users שלך.

[קרא עוד על שמירה על ניקיון רכיבים.](/learn/keeping-components-pure)

<Note>

אם מותקן אצלך [React DevTools](/learn/react-developer-tools), כל קריאות `console.log` במהלך קריאת העיבוד השנייה יופיעו מעומעמות מעט. React DevTools מציע גם הגדרה (כבוי כברירת מחדל) כדי לדכא אותם לחלוטין.

</Note>

---

### תיקון באגים שנמצאו על ידי הפעלה מחדש של אפקטים בפיתוח {/*fixing-bugs-found-by-re-running-effects-in-development*/}

מצב קפדני יכול גם לעזור למצוא באגים ב-[אפקטים.](/learn/synchronizing-with-effects)

לכל אפקט יש קוד הגדרה ויכול להיות שיש לו קוד ניקוי כלשהו. בדרך כלל, React קורא להגדרה כאשר הרכיב *מועלה* (נוסף למסך) וקורא לניקוי כאשר הרכיב *מתבטל* (מוסר מהמסך). React אז קורא לניקוי והתקנה שוב אם התלות שלו השתנתה מאז העיבוד האחרון.

כאשר מצב קפדני מופעל, React יפעיל גם **מחזור הגדרה+ניקוי נוסף בפיתוח עבור כל אפקט.** זה עשוי להרגיש מפתיע, אבל זה עוזר לחשוף באגים עדינים שקשה לתפוס ידנית.

**הנה דוגמה כדי להמחיש כיצד הפעלה מחדש של אפקטים במצב קפדני עוזרת לך למצוא באגים מוקדם.**

שקול את הדוגמה הזו שמחברת רכיב לצ'אט:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

יש בעיה עם הקוד הזה, אבל ייתכן שהיא לא ברורה מיד.

כדי להפוך את הבעיה לברורה יותר, בואו ליישם תכונה. בדוגמה למטה, `roomId` אינו מקודד. במקום זאת, ה-user יכול לבחור את ה-`roomId` שאליו הם רוצים להתחבר מתוך תפריט נפתח. לחץ על "פתח צ'אט" ולאחר מכן בחר חדרי צ'אט שונים אחד אחד. עקוב אחר מספר החיבורים הפעילים במסוף:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

תבחין שמספר החיבורים הפתוחים תמיד ממשיך לגדול. באפליקציה אמיתית, זה עלול לגרום לבעיות ביצועים ורשת. הבעיה היא ש[לאפקט שלך חסרה פונקציית ניקוי:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

עכשיו כשהאפקט שלך "מנקה" אחרי עצמו והורס את החיבורים המיושנים, הדליפה נפתרה. עם זאת, שים לב שהבעיה לא נראתה עד שהוספת תכונות נוספות (תיבת הבחירה).

**בדוגמה המקורית, הבאג לא היה ברור. עכשיו בואו נעטוף את הקוד המקורי (באגי) ב-`<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**עם Strict Mode רואים מיד שיש בעיה** (מספר החיבורים הפעילים קופץ ל-2). מצב קפדני מפעיל מחזור הגדרה+ניקוי נוסף עבור כל אפקט. לאפקט הזה אין הגיון ניקוי, אז הוא יוצר חיבור נוסף אבל לא הורס אותו. זהו רמז לכך שחסרה לך פונקציית ניקוי.

מצב קפדני מאפשר לך להבחין בטעויות כאלה בשלב מוקדם של התהליך. כאשר אתה מתקן את האפקט שלך על ידי הוספת פונקציית ניקוי במצב קפדני, אתה *גם* מתקן הרבה באגי ייצור עתידיים אפשריים כמו תיבת הבחירה מקודם:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

שימו לב איך ספירת החיבורים הפעילים בקונסולה לא ממשיכה לגדול יותר.

ללא מצב קפדני, קל היה לפספס שהאפקט שלך זקוק לניקוי. על ידי הפעלת *setup → cleanup → setup* במקום *setup* עבור האפקט שלך בפיתוח, מצב קפדני הפך את היגיון הניקוי החסר ליותר בולט.

[קרא עוד על יישום אפקט ניקוי.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twoice-in-development)

---

### תיקון אזהרות הוצאה משימוש מופעל על ידי מצב קפדני {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React מזהיר אם רכיב כלשהו בתוך עץ `<StrictMode>` uses אחד מה-APIs שהוצא משימוש:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [ראה חלופות.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* שיטות מחזור חיים בכיתה `UNSAFE_` כמו [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [ראה חלופות.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* הקשר מדור קודם ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), ו-[`getChildContext`](/reference/react/Component#getchildcontext)). [ראה חלופות.](/reference/react/createContext)
* רשמי מחרוזת מדור קודם ([`this.refs`](/reference/react/Component#refs)). [ראה חלופות.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

APIs אלה הם בעיקר used ב[רכיבי מחלקה] ישנים יותר (/reference/react/Component) ולכן הם מופיעים רק לעתים רחוקות באפליקציות מודרניות.
