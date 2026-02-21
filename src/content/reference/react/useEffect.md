---
title: "useEffect"
---

<Intro>

`useEffect` הוא React Hook המאפשר לך [לסנכרן רכיב עם מערכת חיצונית.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

התקשר ל-`useEffect` ברמה העליונה של הרכיב שלך כדי להכריז על אפקט:

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `setup`: הפונקציה עם ההיגיון של האפקט שלך. פונקציית ההגדרה שלך עשויה גם להחזיר פונקציית *ניקוי*. כאשר הרכיב שלך יתווסף ל-DOM, React יפעיל את פונקציית ההגדרה שלך. לאחר כל רינדור מחדש עם שינויים תלויים, React יריץ תחילה את פונקציית הניקוי (אם סיפקת אותה) עם הערכים הישנים, ולאחר מכן יריץ את פונקציית ההתקנה שלך עם הערכים החדשים. לאחר הסרת הרכיב שלך מה-DOM, React יפעיל את פונקציית הניקוי שלך.
 
* **אופציונלי** `dependencies`: רשימת כל הערכים התגובתיים שאליהם מתייחסים בתוך הקוד `setup`. הערכים Reactive כוללים את props, state, ואת כל המשתנים והפונקציות המוצהרות ישירות בתוך גוף הרכיב שלך. אם ה-linter שלך הוא [מוגדר עבור React](/learn/editor-setup#linting), הוא יוודא שכל ערך תגובתי צוין כהלכה כתלות. רשימת התלות חייבת לכלול מספר קבוע של פריטים ולהיכתב בשורה כמו `[dep1, dep2, dep3]`. React ישווה כל תלות עם הערך הקודם שלה באמצעות ההשוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). אם תשמיט ארגומנט זה, האפקט שלך יופעל מחדש לאחר כל רינדור מחדש של הרכיב. [ראה את ההבדל בין העברת מערך של תלות, מערך ריק וללא תלות כלל.](#)examples.

#### מחזירה {/*returns*/}

`useEffect` מחזירה `undefined`.

#### אזהרות {/*caveats*/}

* `useEffect` הוא Hook, אז אתה יכול לקרוא לו רק **ברמה העליונה של הרכיב שלך** או Hooks משלך. אתה לא יכול לקרוא לזה בתוך לולאות או תנאים. אם אתה צריך את זה, חלץ רכיב חדש והעביר את ה-state לתוכו.

* אם אתה **לא מנסה לסנכרן עם מערכת חיצונית כלשהי,** [כנראה לא צריך אפקט.](/learn/you-might-not-need-an-effect)

* כאשר מצב קפדני מופעל, React **יריץ הגדרה אחת נוספת לפיתוח בלבד+מחזור ניקוי** לפני ההגדרה האמיתית הראשונה. זהו מבחן מאמץ המבטיח שהלוגיקת הניקוי שלך "משקפת" את היגיון ההתקנה שלך ושהוא עוצר או מבטל את כל מה שההגדרה עושה. אם זה use הוא בעיה, [הטמיע את פונקציית הניקוי.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* אם חלק מהתלות שלך הם אובייקטים או פונקציות שהוגדרו בתוך הרכיב, קיים סיכון שהם **cause יפעלו מחדש את האפקט לעתים קרובות יותר מהנדרש.** כדי לתקן זאת, הסר תלות מיותרות [object](#removing-unnecessary-object-dependencies) ו-[function](#removing-unnecessary-dependencies-dependencies. אתה יכול גם [לחלץ עדכונים של state](#עדכונים-state-based-on-previous-state-from-an-effect) ו-[היגיון לא תגובתי](#reading-the-latest-props-and-state-from-an-effect) מחוץ לאפקט שלך.

* אם האפקט שלך לא היה caused על ידי אינטראקציה (כמו קליק), React בדרך כלל יאפשר לדפדפן **לצבוע את המסך המעודכן תחילה לפני הפעלת האפקט שלך.** אם האפקט שלך עושה משהו ויזואלי (לדוגמה, מיקום הסבר כלים), והעיכוב מורגש (לדוגמה, הוא מהבהב), החלף את `useEffect` ב-`useEffect` [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* גם אם האפקט שלך היה caused על ידי אינטראקציה (כמו קליק), **הדפדפן עשוי לצבוע מחדש את המסך לפני עיבוד עדכוני state בתוך האפקט שלך.** בדרך כלל, זה מה שאתה רוצה. עם זאת, אם עליך לחסום את הדפדפן מלצבוע מחדש את המסך, עליך להחליף את `useEffect` ב-[`useLayoutEffect`.](/reference/react/useLayoutEffect)

* אפקטים **פועלים רק על הלקוח.** הם לא פועלים במהלך עיבוד השרת.

---

## שימוש {/*usage*/}

### התחברות למערכת חיצונית {/*connecting-to-an-external-system*/}

חלק מהרכיבים צריכים להישאר מחוברים לרשת, חלק מהדפדפן API, או ספריית צד שלישי, בזמן שהם מוצגים בדף. מערכות אלו אינן נשלטות על ידי React, ולכן הן נקראות *חיצוניות.*

כדי [לחבר את הרכיב שלך למערכת חיצונית כלשהי,](/learn/synchronizing-with-effects) התקשר ל-`useEffect` ברמה העליונה של הרכיב שלך:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

עליך להעביר שני טיעונים ל-`useEffect`:

1. *פונקציית הגדרה* עם <CodeStep step={1}>קוד הגדרה</CodeStep> שמתחברת לאותה מערכת.
   - היא אמורה להחזיר *פונקציית ניקוי* עם <CodeStep step={2}>קוד ניקוי</CodeStep> שמתנתקת ממערכת זו.
2. <CodeStep step={3}>רשימת תלות</CodeStep> הכוללת כל ערך מהרכיב used שלך בתוך הפונקציות הללו.

**React קורא לפונקציות ההגדרה והניקוי שלך בכל פעם שנדרש, מה שעשוי לקרות מספר פעמים:**

1. <CodeStep step={1}>קוד ההגדרה</CodeStep> שלך פועל כאשר הרכיב שלך מתווסף לדף *(mounts)*.
2. לאחר כל עיבוד מחדש של הרכיב שלך שבו השתנו <CodeStep step={3}>התלות</CodeStep>:
   - ראשית, <CodeStep step={2}>קוד הניקוי</CodeStep> שלך פועל עם props וstate הישנים.
   - לאחר מכן, <CodeStep step={1}>קוד ההגדרה</CodeStep> שלך פועל עם props וstate החדשים.
3. <CodeStep step={2}>קוד הניקוי</CodeStep> שלך פועל פעם אחת אחרונה לאחר הסרת הרכיב שלך מהדף *(מבוטל).*

**בואו נמחיש את הרצף הזה עבור הדוגמה שלמעלה.**

כאשר הרכיב `ChatRoom` למעלה יתווסף לדף, הוא יתחבר לחדר הצ'אט עם ה-`serverUrl` וה-`roomId` הראשוניים. אם `serverUrl` או `roomId` משתנים כתוצאה מעיבוד מחדש (נניח, אם ה-user בוחר חדר צ'אט אחר בתפריט נפתח), האפקט שלך *יתנתק מהחדר הקודם, ויתחבר לחדר הבא.* כאשר הרכיב `ChatRoom` יוסר מהדף, האפקט שלך יתנתק פעם אחרונה.

**כדי [לעזור לך למצוא באגים,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) בפיתוח React מפעיל את <CodeStep step={1}>setup</CodeStep> ו-<CodeStep step={2}>cleanup</CodeStep> פעם נוספת אחת לפני <CodeStep> step={1}>setup</CodeStep>.** זהו מבחן מאמץ המוודא שהלוגיקה של האפקט שלך מיושמת כהלכה. אם יש בעיות גלויות לעין, פונקציית הניקוי שלך חסרה היגיון מסוים. פונקציית הניקוי צריכה להפסיק או לבטל את כל מה שפונקציית ההגדרה עשתה. כלל האצבע הוא שה-user לא אמור להבחין בין ההתקנה שנקראת פעם אחת (כמו בייצור) לבין רצף *התקנה* → *ניקוי* → *התקנה* (כמו בפיתוח). [ראה פתרונות נפוצים.](/learn/synchronizing-with-effects#how-to-handle-the-effect-fire-twoice-in-development)

**נסה [לכתוב כל אפקט כתהליך עצמאי](/learn/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separat-synchronization-process) ו[לחשוב על מחזור הגדרה/ניקוי יחיד בכל פעם.](/learn/lifecycle-of-reactive-of-reactive-effects-reactive-from-thinking)' הרכיב שלך מותקן, מתעדכן או מבטל. כאשר היגיון הניקוי שלך "משקף" את היגיון ההגדרה בצורה נכונה, האפקט שלך עמיד להפעלת הגדרות וניקוי בתדירות הנדרשת.

<Note>

אפקט מאפשר לך [לשמור על הרכיב שלך מסונכרן](/למד/סנכרון-עם-אפקטים) עם מערכת חיצונית כלשהי (כמו שירות צ'אט). כאן, *מערכת חיצונית* פירושה כל פיסת קוד שאינה נשלטת על ידי React, כגון:

* טיימר המנוהל באמצעות <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> ו-<CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* מנוי לאירוע באמצעות <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> ו-<CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* ספריית אנימציה של צד שלישי עם API כמו <CodeStep step={1}>`animation.start()`</CodeStep> ו-<CodeStep step={2}>`animation.reset()`</CodeStep>.

**אם אינך מתחבר לשום מערכת חיצונית, [כנראה אינך זקוק לאפקט.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Examples of connecting to an external system" titleId="examples-connecting">

#### מתחבר לשרת צ'אט {/*connecting-to-a-chat-server*/}

בדוגמה זו, הרכיב `ChatRoom` use הוא אפקט כדי להישאר מחובר למערכת חיצונית המוגדרת ב-`chat.js`. לחץ על "פתח צ'אט" כדי לגרום לרכיב `ChatRoom` להופיע. ארגז החול הזה פועל במצב פיתוח, כך שיש מחזור חיבור וניתוק נוסף, כפי [הסבר כאן.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) נסה לשנות את `roomId` ו`serverUrl` באמצעות התפריט הנפתח והקלט, וראה כיצד האפקט מתחבר מחדש לצ'אט. לחץ על "סגור צ'אט" כדי לראות את האפקט מתנתק בפעם האחרונה.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
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
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### האזנה לאירוע דפדפן גלובלי {/*listening-to-a-global-browser-event*/}

בדוגמה זו, המערכת החיצונית היא הדפדפן DOM עצמו. בדרך כלל, היית מציין מאזינים לאירועים עם JSX, אבל אינך יכול להאזין לאובייקט הגלובלי [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) בצורה זו. אפקט מאפשר לך להתחבר לאובייקט `window` ולהאזין לאירועים שלו. האזנה לאירוע `pointermove` מאפשרת לך לעקוב אחר הסמן (או האצבע האדומה) כדי לעדכן את המיקום שלו.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### הפעלת אנימציה {/*triggering-an-animation*/}

בדוגמה זו, המערכת החיצונית היא ספריית האנימציה ב-`animation.js`. הוא מספק מחלקה JavaScript בשם `FadeInAnimation` שלוקחת צומת DOM כארגומנט וחושפת שיטות `start()` ו`stop()` לשלוט בהנפשה. הרכיב הזה [uses a ref](/learn/manipulating-the-dom-with-refs) כדי לגשת לצומת DOM הבסיסי. האפקט קורא את הצומת DOM מה-ref ומתחיל אוטומטית את האנימציה עבור אותו צומת כאשר הרכיב מופיע.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### שליטה בתיבת דו-שיח מודאלית {/*controlling-a-modal-dialog*/}

בדוגמה זו, המערכת החיצונית היא הדפדפן DOM. הרכיב `ModalDialog` מעבד אלמנט [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). זה use הוא אפקט לסנכרן את הפרופס של `isOpen` ל-[`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) ו-[`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) קריאות השיטה.

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### נראות רכיב מעקב {/*tracking-element-visibility*/}

בדוגמה זו, המערכת החיצונית היא שוב הדפדפן DOM. הרכיב `App` מציג רשימה ארוכה, לאחר מכן רכיב `Box`, ולאחר מכן רשימה ארוכה נוספת. גלול את הרשימה למטה. שימו לב שכאשר כל הרכיב `Box` גלוי במלואו בנקודת התצוגה, צבע הרקע משתנה לשחור. כדי ליישם זאת, רכיב `Box` use הוא אפקט לניהול [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). דפדפן זה API מודיע לך כאשר אלמנט DOM גלוי בשדה התצוגה.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### אפקטי גלישה ב-Hooks {/*wrapping-effects-in-custom-hooks*/} מותאם אישית

אפקטים הם ["פתח בריחה":](/learn/escape-hatches) אתה use אותם כאשר אתה צריך "לצאת החוצה React" וכאשר אין פתרון מובנה טוב יותר עבור מקרה use שלך. אם אתה מוצא את עצמך לעתים קרובות צריך לכתוב אפקטים באופן ידני, זה בדרך כלל סימן שאתה צריך לחלץ כמה [custom Hooks](/learn/reusing-logic-with-custom-hooks) להתנהגויות נפוצות שהרכיבים שלך מסתמכים עליהן.

לדוגמה, `useChatRoom` מותאם אישית Hook זה "מסתיר" את ההיגיון של האפקט שלך מאחורי API הצהרתי יותר:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

אז אתה יכול use אותו מכל רכיב כמו זה:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

יש גם הרבה Hooks מותאמים אישית מצוינים לכל מטרה הזמינים במערכת האקולוגית React.

[למידע נוסף על גלישת אפקטים ב-Hooks מותאם אישית.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Examples of wrapping Effects in custom Hooks" titleId="examples-custom-hooks">

#### מותאם אישית `useChatRoom` Hook {/*custom-usechatroom-hook*/}

דוגמה זו זהה לאחת [הדוגמאות המוקדמות יותר,](#examples-connecting) אך ההיגיון חולץ ל-Hook מותאם אישית.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
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

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### מותאם אישית `useWindowListener` Hook {/*custom-usewindowlistener-hook*/}

דוגמה זו זהה לאחת [הדוגמאות המוקדמות יותר,](#examples-connecting) אך ההיגיון חולץ ל-Hook מותאם אישית.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### מותאם אישית `useIntersectionObserver` Hook {/*custom-useintersectionobserver-hook*/}

דוגמה זו זהה לאחת [הדוגמאות המוקדמות יותר,](#examples-connecting) אך ההיגיון חולץ חלקית ל-Hook מותאם אישית.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### שליטה בווידג'ט שאינו React {/*controlling-a-non-react-widget*/}

לפעמים, אתה רוצה לשמור על מערכת חיצונית מסונכרנת לאביזר כלשהו או state של הרכיב שלך.

לדוגמה, אם יש לך ווידג'ט מפה של צד שלישי או רכיב נגן וידאו שנכתב ללא React, אתה יכול use אפקט להתקשר לשיטות עליו שגורמות ל-state שלו להתאים ל-state הנוכחי של רכיב React שלך. אפקט זה יוצר מופע של מחלקה `MapWidget` המוגדרת ב-`map-widget.js`. כאשר אתה משנה את הפרופס של `zoomLevel` של הרכיב `Map`, האפקט קורא ל-`setZoom()` במופע המחלקה כדי לשמור אותו מסונכרן:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

בדוגמה זו, אין צורך בפונקציית ניקוי מכיוון שuse המחלקה `MapWidget` מנהלת רק את הצומת DOM שהועבר אליה. לאחר הסרת הרכיב `Map` React מהעץ, גם הצומת DOM וגם מופע המחלקה `MapWidget` ייאספו אוטומטית אשפה על ידי מנוע JavaScript של הדפדפן.

---

### שליפת נתונים עם Effects {/*fetching-data-with-effects*/}

אתה יכול use אפקט כדי להביא נתונים עבור הרכיב שלך. שים לב ש[אם אתה use מסגרת,](/learn/start-a-new-react-project#production-grade-react-frameworks) שימוש במנגנון אחזור הנתונים של המסגרת שלך יהיה הרבה יותר יעיל מאשר כתיבת אפקטים באופן ידני.

אם אתה רוצה להביא נתונים מאפקט באופן ידני, הקוד שלך עשוי להיראות כך:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

שימו לב למשתנה `ignore` שמאוחל ל-`false`, ומוגדר ל-`true` במהלך הניקוי. זה מבטיח [הקוד שלך לא סובל מ"תנאי מירוץ":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) תגובות הרשת עשויות להגיע בסדר שונה ממה ששלחת להן.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

אתה יכול גם לכתוב מחדש באמצעות [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) תחביר, אך עדיין עליך לספק פונקציית ניקוי:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

כתיבת אחזור נתונים ישירות באפקט חוזרת על עצמה ומקשה על הוספת אופטימיזציות כמו שמירה במטמון ועיבוד שרת מאוחר יותר. [קל יותר use Hook מותאם אישית--בעצמך או שמתוחזק על ידי הקהילה.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### מהן חלופות טובות לאיסוף נתונים ב- Effects? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

כתיבת `fetch` שיחות בתוך Effects היא [דרך פופולרית להביא נתונים](https://www.robinwieruch.de/react-hooks-fetch-data/), במיוחד באפליקציות צד לקוח לחלוטין. עם זאת, זוהי גישה מאוד ידנית ויש לה חסרונות משמעותיים:

- **השפעות אינן פועלות על השרת.** משמעות הדבר היא שהשרת הראשוני שניתנו HTML יכלול רק טעינה state ללא נתונים. מחשב הלקוח יצטרך להוריד את כל JavaScript ולעבד את האפליקציה שלך רק כדי לגלות שעכשיו הוא צריך לטעון את הנתונים. זה לא מאוד יעיל.
- **שליפה ישירות באפקטים מקלה על יצירת "מפלי רשת".** אתה מעבד את רכיב האב, הוא שואב נתונים מסוימים, מעבד את רכיבי הצאצא, ואז הם מתחילים לאחזר את הנתונים שלהם. אם הרשת לא מהירה במיוחד, זה איטי משמעותית מאשר שליפת כל הנתונים במקביל.
- **שליפה ישירה באפקטים משמעה בדרך כלל שאינך טוען מראש או מאחסן נתונים.** לדוגמה, אם הרכיב מתנתק ואז נטען שוב, הוא יצטרך לאחזר את הנתונים שוב.
- **זה לא מאוד ארגונומי.** יש לא מעט קוד בוילפלייס מעורב בעת כתיבת קריאות `fetch` בצורה שאינה סובלת מבאגים כמו [תנאי מירוץ.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

רשימה זו של חסרונות אינה ספציפית ל-React. זה חל על שליפת נתונים ב-mount עם כל ספרייה. כמו בניתוב, אחזור נתונים אינו טריוויאלי כדי לעשות זאת בצורה טובה, ולכן אנו ממליצים על הגישות הבאות:

- **אם אתה use [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use מנגנון אחזור הנתונים המובנה שלו.** במסגרות React מודרניות יש מנגנוני שליפת נתונים משולבים שהם יעילים ואינם סובלים מהמגבלה שלעיל.
- **אחרת, שקול להשתמש או לבנות מטמון בצד הלקוח.** פתרונות קוד פתוח פופולריים כוללים [React שאילתה](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), ו-[React נתב 6.4+.](https://beta.reactrouter.com/en/main/start/overview) אתה יכול לבנות פתרון משלך גם כן, ובמקרה כזה אתה תוסיף __TK_ic עבור ____ ביטול כפילויות של בקשות, שמירת תגובות במטמון והימנעות ממפלי מים ברשת (על ידי טעינת נתונים מראש או הנפת דרישות נתונים למסלולים).

אתה יכול להמשיך להביא נתונים ישירות ב- Effects אם אף אחת מהגישות הללו לא מתאימה לך.

</DeepDive>

---

### ציון תלות תגובתית {/*specifying-reactive-dependencies*/}

**שים לב שאינך יכול "לבחור" את התלות של האפקט שלך.** כל <CodeStep step={2}>ערך תגובתי</CodeStep> used לפי הקוד של האפקט שלך חייב להיות מוכרז כתלות. רשימת התלות של האפקט שלך נקבעת על ידי הקוד שמסביב:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // This is a reactive value
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // This is a reactive value too

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads these reactive values
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ So you must specify them as dependencies of your Effect
  // ...
}
```

אם `serverUrl` או `roomId` ישתנו, האפקט שלך יתחבר מחדש לצ'אט באמצעות הערכים החדשים.

**[Reactive values](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) כוללים את props ואת כל המשתנים והפונקציות המוצהרות ישירות בתוך הרכיב שלך.** מכיוון ש`roomId` ו`serverUrl` הם ערכים תגובתיים, אינך יכול להסיר אותם מהתלות. אם תנסה להשמיט אותם ו[ה-linter שלך מוגדר כהלכה עבור React,](/learn/editor-setup#linting) ה-linter יסמן זאת כטעות שעליך לתקן:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**כדי להסיר תלות, אתה צריך ["להוכיח" ל-linter שהיא *לא צריכה* להיות תלות.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** לדוגמה, אתה יכול להעביר את `serverUrl` מהרכיב שלך כדי להוכיח שהוא לא משתנה ב-Reactive and ישתנה:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

כעת, כאשר `serverUrl` אינו ערך תגובתי (ולא יכול להשתנות בעיבוד מחדש), זה לא צריך להיות תלות. **אם הקוד של האפקט שלך אינו use ערכים תגובתיים כלשהם, רשימת התלות שלו צריכה להיות ריקה (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

[אפקט עם תלות ריקות](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) אינו פועל מחדש כאשר כל אחד מהרכיבים props או state משתנה.

<Pitfall>

אם יש לך בסיס קוד קיים, אולי יהיו לך כמה אפקטים שמדכאים את ה-linter כך:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**כאשר התלות אינן תואמות לקוד, קיים סיכון גבוה להחדרת באגים.** על ידי דיכוי ה-linter, אתה "משקר" ל-React לגבי הערכים שהאפקט שלך תלוי בהם. [במקום זאת, הוכח שהם מיותרים.](/learn/removing-effect-dependencies#removing-unecessary-dependencies)

</Pitfall>

<Recipes titleText="Examples of passing reactive dependencies" titleId="examples-dependencies">

#### העברת מערך תלות {/*passing-a-dependency-array*/}

אם תציין את התלות, האפקט שלך יפעל **לאחר הרינדור הראשוני _ו_ לאחר רינדור מחדש עם התלות שהשתנו.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Runs again if a or b are different
```

בדוגמה למטה, `serverUrl` ו-`roomId` הם [ערכים תגובתיים,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) ולכן יש לציין את שניהם כתלות. כתוצאה מכך, בחירת חדר אחר בתפריט הנפתח או עריכת קלט כתובת ה-URL של השרת מאפשרת לצ'אט להתחבר מחדש. עם זאת, מכיוון ש`message` אינו used באפקט (ולכן זה לא תלות), עריכת ההודעה לא מתחברת מחדש לצ'אט.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### העברת מערך תלות ריק {/*passing-an-empty-dependency-array*/}

אם האפקט שלך באמת לא use ערכים תגובתיים, הוא יפעל רק **אחרי העיבוד הראשוני.**

```js {3}
useEffect(() => {
  // ...
}, []); // Does not run again (except once in development)
```

**אפילו עם תלות ריקות, ההתקנה והניקוי [יפעלו פעם נוספת בפיתוח](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) כדי לעזור לך למצוא באגים.**


בדוגמה זו, גם `serverUrl` וגם `roomId` מקודדים קשה. מכיוון שהם מוכרזים מחוץ לרכיב, הם אינם ערכים תגובתיים, ולכן הם אינם תלות. רשימת התלות ריקה, כך שהאפקט אינו פועל מחדש בעיבוד מחדש.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### לא עובר מערך תלות בכלל {/*passing-no-dependency-array-at-all*/}

אם אתה לא עובר מערך תלות בכלל, האפקט שלך פועל **אחרי כל רינדור (ועיבוד מחדש)** של הרכיב שלך.

```js {3}
useEffect(() => {
  // ...
}); // Always runs again
```

בדוגמה זו, האפקט פועל מחדש כאשר אתה משנה את `serverUrl` ואת `roomId`, וזה הגיוני. עם זאת, זה *גם* פועל מחדש כאשר אתה משנה את ה-`message`, וזה כנראה לא רצוי. זו הסיבה שבדרך כלל תציין את מערך התלות.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // No dependency array at all

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### עדכון state בהתבסס על state קודם מאפקט {/*updating-state-based-on-previous-state-from-an-effect*/}

כאשר אתה רוצה לעדכן את state בהתבסס על state קודם מאפקט, אתה עלול להיתקל בבעיה:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // You want to increment the counter every second...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
  // ...
}
```

מכיוון ש`count` הוא ערך תגובתי, יש לציין אותו ברשימת התלות. עם זאת, זה נותן את האפקט לניקוי והגדרה מחדש בכל פעם שה-`count` משתנה. זה לא אידיאלי.

כדי לתקן זאת, [העבירו את עדכון `c => c + 1` state](/reference/react/useState#updating-state-based-on-the-previous-state) אל `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

כעת, כשאתה מעביר את `c => c + 1` במקום `count + 1`, [האפקט שלך כבר לא צריך להיות תלוי ב-`count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-לחשב-הבא-`count`. זה זכה שוב לתיקון והגדר את התיקון הזה. בכל פעם שה-`count` משתנה.

---


### הסרת תלות מיותרת באובייקט {/*removing-unnecessary-object-dependencies*/}

אם האפקט שלך תלוי באובייקט או בפונקציה שנוצרה במהלך העיבוד, הוא עלול לפעול לעתים קרובות מדי. לדוגמה, אפקט זה מתחבר מחדש לאחר כל רינדור מכיוון שהאובייקט `options` הוא [שונה עבור כל רינדור:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

הימנע משימוש באובייקט שנוצר במהלך העיבוד כתלות. במקום זאת, צור את האובייקט בתוך האפקט:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

עכשיו שאתה יוצר את האובייקט `options` בתוך האפקט, האפקט עצמו תלוי רק במחרוזת `roomId`.

עם התיקון הזה, הקלדה בקלט לא מחברת מחדש את הצ'אט. שלא כמו אובייקט שנוצר מחדש, מחרוזת כמו `roomId` לא משתנה אלא אם כן תגדיר אותה לערך אחר. [קרא עוד על הסרת תלות.](/learn/removing-effect-dependencies)

---

### הסרת תלות מיותרת בפונקציות {/*removing-unnecessary-function-dependencies*/}

אם האפקט שלך תלוי באובייקט או בפונקציה שנוצרה במהלך העיבוד, הוא עלול לפעול לעתים קרובות מדי. לדוגמה, אפקט זה מתחבר מחדש לאחר כל רינדור מכיוון שהפונקציה `createOptions` היא [שונה עבור כל רינדור:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 This function is created from scratch on every re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // It's used inside the Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

כשלעצמה, יצירת פונקציה מאפס בכל עיבוד מחדש אינה בעיה. אתה לא צריך לייעל את זה. עם זאת, אם אתה use זה כתלות של האפקט שלך, זה use האפקט שלך יפעל מחדש לאחר כל עיבוד מחדש.

הימנע משימוש בפונקציה שנוצרה במהלך העיבוד כתלות. במקום זאת, הכריז על זה בתוך האפקט:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

עכשיו כשאתה מגדיר את הפונקציה `createOptions` בתוך האפקט, האפקט עצמו תלוי רק במחרוזת `roomId`. עם התיקון הזה, הקלדה בקלט לא מחברת מחדש את הצ'אט. שלא כמו פונקציה שנוצרת מחדש, מחרוזת כמו `roomId` לא משתנה אלא אם כן תגדיר אותה לערך אחר. [קרא עוד על הסרת תלות.](/learn/removing-effect-dependencies)

---

### קריאת ה-props וה-state העדכניים מאפקט {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

סעיף זה מתאר **ניסוי API שעדיין לא שוחרר** בגרסה יציבה של React.

</Wip>

כברירת מחדל, כאשר אתה קורא ערך תגובתי מאפקט, עליך להוסיף אותו כתלות. זה מבטיח שהאפקט שלך "מגיב" לכל שינוי של הערך הזה. עבור רוב התלות, זו ההתנהגות שאתה רוצה.

**עם זאת, לפעמים תרצו לקרוא את *האחרונות* props וstate מתוך אפקט מבלי "להגיב" אליהם.** לדוגמה, דמיינו שאתם רוצים לרשום את מספר הפריטים בעגלת הקניות עבור כל ביקור בדף:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ All dependencies declared
  // ...
}
```

**מה אם אתה רוצה לרשום ביקור חדש בדף אחרי כל שינוי `url`, אבל *לא* אם רק ה-`shoppingCart` משתנה?** אינך יכול לכלול את `shoppingCart` מתלות מבלי לשבור את [כללי התגובה.](#specificing-reactive-dependencies) עם זאת, אתה יכול להביע שאתה *לא רוצה לשנות את הקוד ל"אפקט" אפילו ל"אפקט". [הכרז על אירוע *אפקט*](/learn/separating-events-from-effects#declaring-an-effect-event) עם ה-[`useEffectEvent`](/reference/react/experimental_useEffectEvent) Hook, והזז בתוכו את הקוד שקורא `shoppingCart`:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

**אירועי אפקט אינם תגובתיים ויש להשמיט אותם תמיד מהתלות של האפקט שלך.** זה מה שמאפשר לך לשים קוד לא תגובתי (שם תוכל לקרוא את הערך האחרון של כמה props וstate) בתוכם. על ידי קריאת `shoppingCart` בתוך `onVisit`, אתה מבטיח ש`shoppingCart` לא יפעיל מחדש את האפקט שלך.

[קרא עוד על האופן שבו אפקט אירועים מאפשרים לך להפריד בין קוד תגובתי ולא תגובתי.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### הצגת תוכן שונה בשרת ובלקוח {/*displaying-different-content-on-the-server-and-the-client*/}

אם האפליקציה שלך use עיבוד שרת (או [ישיר](/reference/react-dom/server) או באמצעות [framework](/learn/start-a-new-react-project#production-grade-react-frameworks)), הרכיב שלך יוצג בשתי סביבות שונות. בשרת, הוא יעבד כדי לייצר את ה-HTML הראשוני. בלקוח, React יריץ שוב את קוד העיבוד כדי שיוכל לצרף את מטפלי האירועים שלך לאותו HTML. זו הסיבה שכדי ש-[hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) יעבוד, פלט העיבוד הראשוני שלך חייב להיות זהה בלקוח ובשרת.

במקרים נדירים, ייתכן שיהיה עליך להציג תוכן שונה בלקוח. לדוגמה, אם האפליקציה שלך קוראת כמה נתונים מ-[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), היא לא יכולה לעשות זאת בשרת. כך תוכל ליישם זאת:

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

בזמן שהאפליקציה נטענת, ה-user יראה את פלט העיבוד הראשוני. לאחר מכן, כאשר הוא נטען ומיועד לחות, האפקט שלך יפעל ויגדיר את `didMount` ל-`true`, ויפעיל עיבוד מחדש. פעולה זו תעבור לפלט העיבוד ללקוח בלבד. אפקטים לא פועלים על השרת, אז זו הסיבה ש`didMount` היה `false` במהלך העיבוד הראשוני של השרת.

השתמש בתבנית זו במשורה. זכור ש-users עם חיבור איטי יראו את התוכן הראשוני במשך לא מעט זמן - פוטנציאלי, שניות רבות - כך שאינך רוצה לבצע שינויים צורמים במראה הרכיב שלך. במקרים רבים, אתה יכול להימנע מהצורך בכך על ידי הצגה מותנית של דברים שונים עם CSS.

---

## פתרון בעיות {/*troubleshooting*/}

### My Effect פועל פעמיים כאשר הרכיב נטען {/*my-effect-runs-twice-when-the-component-mounts*/}

כאשר מצב קפדני מופעל, בפיתוח, React מריץ את ההגדרה והניקוי פעם נוספת לפני ההגדרה בפועל.

זהו מבחן מאמץ המוודא שהלוגיקה של האפקט שלך מיושמת כהלכה. אם יש בעיות גלויות לעין, פונקציית הניקוי שלך חסרה היגיון מסוים. פונקציית הניקוי צריכה להפסיק או לבטל את כל מה שפונקציית ההגדרה עשתה. כלל האצבע הוא שה-user לא אמור להיות מסוגל להבחין בין ההגדרה שנקראת פעם אחת (כמו בייצור) לבין הגדרה → ניקוי → רצף התקנה (כמו בפיתוח).

קרא עוד על [איך זה עוזר למצוא באגים](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) ו[איך לתקן את ההיגיון שלך.](/learn/synchronizing-with-effects#how-to-handle-the-effect-fire-twice-in-development)

---

### האפקט שלי פועל לאחר כל עיבוד מחדש {/*my-effect-runs-after-every-re-render*/}

ראשית, בדוק שלא שכחת לציין את מערך התלות:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every render!
```

אם ציינת את מערך התלות אבל האפקט שלך עדיין פועל מחדש בלולאה, זה בגלל שאחת מהתלות שלך שונה בכל רינדור מחדש.

אתה יכול לנפות באגים בבעיה זו על ידי רישום ידני של התלות שלך למסוף:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

לאחר מכן תוכל ללחוץ לחיצה ימנית על המערכים מעיבודים חוזרים שונים בקונסולה ולבחור "אחסן כמשתנה גלובלי" עבור שניהם. בהנחה שהראשון נשמר כ-`temp1` והשני נשמר כ-`temp2`, לאחר מכן תוכל use למסוף הדפדפן כדי לבדוק אם כל תלות בשני המערכים זהה:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

כאשר אתה מוצא את התלות השונה בכל עיבוד מחדש, אתה יכול בדרך כלל לתקן אותה באחת מהדרכים הבאות:

- [עדכון state בהתבסס על state קודמת מאפקט] (#עדכון-state-based-on-previous-state-from-an-effect)
- [הסרת תלות מיותרת של אובייקטים](#removing-unnecessary-object-dependencies)
- [הסרת תלות מיותרת בפונקציות](#הסרת-תלות-בלתי נחוצות בפונקציות)
- [קורא את ה-props וה-state העדכניים ביותר מתוך אפקט](#reading-the-latest-props-and-state-from-an-effect)

כמוצא אחרון (אם שיטות אלו לא עזרו), עטפו את יצירתו ב-[`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) או [`useCallback`](/reference/react/useCallback#preventing-of-firing)-foo).

---

### האפקט שלי ממשיך לפעול מחדש במחזור אינסופי {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

אם האפקט שלך פועל במחזור אינסופי, שני הדברים האלה חייבים להיות נכונים:

- האפקט שלך מעדכן כמה state.
- state זה מוביל לעיבוד מחדש, אשר גורם לשינוי התלות של האפקט.

לפני שתתחיל לתקן את הבעיה, שאל את עצמך אם האפקט שלך מתחבר למערכת חיצונית כלשהי (כמו DOM, רשת, ווידג'ט של צד שלישי וכן הלאה). מדוע האפקט שלך צריך להגדיר state? האם זה מסתנכרן עם אותה מערכת חיצונית? או שאתה מנסה לנהל איתו את זרימת הנתונים של האפליקציה שלך?

אם אין מערכת חיצונית, שקול אם [הסרת האפקט לגמרי](/learn/you-might-not-need-an-effect) תפשט את ההיגיון שלך.

אם אתה באמת מסתנכרן עם מערכת חיצונית כלשהי, חשב למה ובאילו תנאים האפקט שלך צריך לעדכן את ה-state. האם השתנה משהו שמשפיע על הפלט החזותי של הרכיב שלך? אם אתה צריך לעקוב אחר נתונים מסוימים שאינם used על ידי רינדור, [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (שאינו מפעיל עיבוד מחדש) עשוי להיות מתאים יותר. ודא שהאפקט שלך לא מעדכן את state (ומפעיל עיבוד מחדש) יותר מהנדרש.

לבסוף, אם האפקט שלך מעדכן את state בזמן הנכון, אבל עדיין יש לולאה, זה בגלל שuse עדכון state מוביל לשינוי אחד מהתלות של האפקט. [קרא כיצד לנפות באגים בשינויי תלות.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### לוגיקת הניקוי שלי פועלת למרות שהרכיב שלי לא ביטל את הטעינה {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

פונקציית הניקוי פועלת לא רק במהלך ביטול הרכבה, אלא לפני כל רינדור מחדש עם השתנות תלויות. בנוסף, בפיתוח, React [מריץ את ההתקנה+ניקוי פעם נוספת מיד לאחר הרכבה של הרכיב.](#my-effect-runs-twice-when-the-component-mounts)

אם יש לך קוד ניקוי ללא קוד הגדרה מתאים, זה בדרך כלל ריח של קוד:

```js {2-5}
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

היגיון הניקוי שלך צריך להיות "סימטרי" ללוגיקת ההגדרה, ועליו לעצור או לבטל את כל מה שההגדרה עשתה:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[למד כיצד מחזור החיים של אפקט שונה ממחזור החיים של הרכיב.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### האפקט שלי עושה משהו ויזואלי, ואני רואה הבהוב לפני שהוא מריץ {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

אם האפקט שלך חייב לחסום את הדפדפן מ[צביעת המסך,](/learn/render-and-commit#epilogue-browser-paint) החלף את `useEffect` ב-[`useLayoutEffect`](/reference/react/useLayoutEffect). שים לב ש**זה לא אמור להיות נחוץ עבור הרוב המכריע של האפקטים.** תזדקק לזה רק אם זה חיוני להפעיל את האפקט שלך לפני ציור הדפדפן: למשל, למדוד ולמקם הסבר כלים לפני שה-user יראה אותו.
