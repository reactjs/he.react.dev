---
title: דרכי מילוט
---

<Intro>

יכול לחלק מהרכיבים שלך יצטרכו לשלוט ולסנכרן עם מערכות מחוץ ל-React. לדוגמא, אפשר ללא צורך למקד קלט באמצעות ה-API של הדפן, להפעיל ולהשהות נגן וידאו מיושם React, או להתחבר ולהאזין להודעות משרת מרוחק. בפרק זה תלמדו את פתחי המילוט המאפשרים לכם "לצאת החוצה" להגיב ולהתחבר למערכות חיצוניות. רוב ההיגיון של היישום והזרימה שלך לא צריך להסתמך על תכונות אלה.

</Intro>

<YouWillLearn isChapter={true}>

* [כיצד "לזכור" מידע ללא עיבוד מחדש](/learn/referencing-values-with-refs)
* [כיצד לגשת לרכיבי DOM המנוהל על ידי React](/learn/manipulating-the-dom-with-refs)
* [כיצד לסנכרן רכיבים עם מערכות חיצוניות](/למד/סנכרון-עם-אפקטים)
* [כיצד להוציא אפקטים מיותרים מהרכיבים שלך](/learn/you-might-not-need-an-effect)
* [איך מחזור החיים של אפקט שונה ממחזור החיים של הרכיב](/learn/lifecycle-of-reactive-effects)
* [כיצד למנוע מכמה ערכים להפעיל מחדש אפקטים](/learn/separating-events-from-effects)
* [כיצד לגרום לאפקט שלך להופיע מחדש בתדירות נמוכה יותר](/learn/removing-effect-dependencies)
* [כיצד שיתוף לוגיקה בין רכיבים](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## הפניה לערכים עם refs {/*referencing-values-with-refs*/}

כאשר אתה רוצה רכיב "יזכור" מידע מסוים, אבל אתה לא רוצה שהמידע הזה [תפעיל עיבודים חדשים](/learn/render-and-commit), אתה יכול להשתמש ב-*ref*:

```js
const ref = useRef(0);
```

בדומה לstate, השופטים נשמרים על ידי תגובה בין עיבודים חוזרים. עם זאת, הגדרת מצב מעבד מחדש רכיב. החלפת שופט לא! אתה יכול לגשת לערך הנוכחי של אותו ref דרך המאפיין 'ref.current'.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

שופט הוא כמו כיס סודי של הרכיב שלך ש-React לא עוקב אחריו. לדוגמה, אתה יכול להשתמש ב-refs כדי לאחסן [מזהי זמן קצוב](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [רכיבי DOM](https://developer.mozilla.org/en-US/docs רכיב/Web/API/Element פעילים), ואובייקטים עיבוד אחרים

<LearnMore path="/learn/referencing-values-with-refs">

קרא את **[התייחסות לערכים עם Refs](/learn/referencing-values-with-refs)** כדי ללמוד להשתמש ב-Refs כדי לזכור מידע.

</LearnMore>

## מניפולציה של ה-DOM עם שו"פים {/*מניפולציה-של-הדום-עם-שופים*/}

תגיב מותאם אוטומטית את העיבוד, כך שהרכיבים שלך לא יצטרכו בטווח זמן לתפעל אותו. עם זאת, לפעמים אפשר שתזדקק לגישה לרכיבי ה-DOM המנוהל על ידי React - לדוגמה, כדי למקד צומת, לגלול אליו או למדוד את גודלו ומיקומו. אין דרך מובנית לעשות את הדברים האלה ב-React, אז תצטרך ref לצומת DOM. לדוגמה, לחיצה על הכפתור תעסוק בקלט באמצעות ref:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

קרא את **[מניפולציה של ה-DOM עם Refs](/learn/manipulating-the-dom-with-refs)** כדי ללמוד כיצד לגשת לרכיבי DOM המנוהל על ידי React.

</LearnMore>

## סנכרון עם אפקטים {/*סנכרון-עם-אפקטים*/}

חלק מהרכיבים צריכים להסתנכרן עם מערכות חיצוניות. לדוגמה, אפשר שתרצה לשלוט ברכיב שאינו React בהתבסס על מצב React, להגדיר חיבור לשרת, או לשלוח יומן ניתוח כאשר הוא מופיע על המסך. מטפל באירועים, המאפשרים לך להריץ באירועים, *אפקטים* מאפשרים לך להריץ קוד מסוים לאחר העיבוד. השתמש בהם כדי לסנכרן את הרכיב שלך עם מערכת מחוץ ל-React.

הקש על הפעל/השהה כמה פעמים וראה כיצד נגן הווידאו נשאר מסונכרן לערך ה-'isPlaying':

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

אפקטים רבים גם "מנקים" אחרי אנשים. לדוגמה, אפקט שמגדיר חיבור לשרת צ'אט צריך להחזיר *פונקציית ניקוי* שאומרת ל-React איך לנתק את הרכיב שלך מהשרת הזה:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

בפיתוח, React יפעיל מיד ותנקה את האפקט שלך פעם נוספת. אתה רואה את `"✅ מתחבר..."` מודפס פעמיים. זה מבטיח שלא תשכח ליישם את פונקציית הניקוי.

<LearnMore path="/learn/synchronizing-with-effects">

קרא את **[סנכרון עם אפקטים](/learn/synchronizing-with-effects)** כדי ללמוד כיצד לסנכרן רכיבים עם מערכות חיצוניות.

</LearnMore>

## אולי לא תזדקק לאפקט {/*ייתכן-לא-תצטרך-אפקט*/}

אפקטים הם פתח מילוט מפרדיגמת React. הם מאפשרים לך "לצאת החוצה" מ-React ולסנכרן את הרכיבים שלך עם מערכת חיצונית. אם אין מערכת חיצונית מעורבת (לדוגמה, אם רוצה לעדכן מצב של רכיב כאשר אתה props או מצב משתנים), אתה לא אמור להזדק לאפקט. הסרת אפקטים מיותרים תהפוך את הקוד שלך לקל יותר לעקוב, מהר יותר להפעלה ונוטה פחות לשגיאות.

ישנם שני מקרים נפוצים שבהם אתה לא צריך אפקטים:
- **לא צריך אפקטים כדי להפוך נתונים לעיבוד.**
- **לא צריך אפקטים כדי לטפל באירועי משתמש.**

לדוגמה, אתה לא צריך אפקט כדי להתאים מצב מסוים על סמך מצב אחר:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

במקום זאת, חשב כמה שאתה יכול תוך כדי רינדור:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

עם זאת, אתה *דווקא* צריך אפקטים כדי לסנכרן עם מערכות חיצוניות. 

<LearnMore path="/learn/you-might-not-need-an-effect">

קרא את **[ייתכן שלא תזדק לאפקט](/learn/you-might-not-need-an-effect)** כדי לממש אפקטים מיותרים.

</LearnMore>

## מחזור חיים של אפקטים תגובתיים {/*מחזור-חיים-של-אפקטים-תגובתיים*/}

לאפקטים יש מחזור חיים. רכיבים רכיבים לעלות, לעד או לטעינה. אפקט יכול לעשות רק שני דברים: להתחיל לסנכרן משהו, ובהמשך להפסיק לסנכרן אותו. מחזור זה יכול לקרות מספר פעמים אם ההשפעה שלך תלויה בprops ובstates המשתנים עם הזמן.

אפקט זה תלוי בערך של הפרופס של `roomId`. props הם * ערכים תגובתיים,* מה שאומר שהם יכולים להשתנות בעיבוד מחדש. שימו לב שהאפקט *מסנכרן מחדש* (ומתחבר מחדש לשרת) אם דירוג `roomId`:

<Sandpack>

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

React מספק כלל linter כדי לבדוק את התלות של האפקט שלך בצורה נכונה. אם תשכח לציין 'roomId' ברשימת התלות בדוגמה לעיל, ה-linter יביא את הבאג הזה באופן אוטומטי.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

קרא את **[מחזור חיים של אירועים תגובתיים](/learn/lifecycle-of-reactive-effects)** כדי ללמוד מחזור החיים של אפקט שונה מזה של רכיב.

</LearnMore>

## הפרדת אירועים מהאפקטים {/*הפרדת-אירועים-מהאפקטים*/}

<Wip>

סעיף זה מתאר **API ניסיוני שעדיין לא שוחרר** בגרסה יציבה של React.

</Wip>

פועלי אירועים מחדש רק כאשר אתה מבצע שוב את אותה אינטראקציה. שלא כמו מטפלי אירועים, אפקטים מסתנכרנים מחדש אם אחד מהערכים שהם קוראים, כמו props או מצב, שונה מעבר לעיבוד האחרון. לפעמים, אתה רוצה שילוב של שתי ההתנהגויות: אפקט המופעל מחדש בתגובה להגדרה אך לא מתאימה.

כל הקוד בתוך אפקטים הוא *reactive.* הוא יפעל שוב אם הוא קורא השתנה עקב עיבוד מחדש. לדוגמה, אפקט זה יתחבר מחדש לצ'אט אם 'roomId' או 'theme' השתנו:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

זה לא אידיאלי. אתה רוצה להתחבר מחדש לצ'אט רק אם ה-'roomId' השתנה. החלפת `נושא` לא אמורה להתחבר מחדש לצ'אט! העבר את הקוד שקורא את ה-'theme' מהאפקט שלך ל-*Effect Event*:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

הקוד בתוך אירועי אפקט אינו תגובתי, כך ששינוי `הנושא` כבר לא גורם לאפקט להתחבר מחדש.

<LearnMore path="/learn/separating-events-from-effects">

קרא את **[הפרדת אירועים מאפקטים](/learn/separating-events-from-effects)** כדי ללמוד כיצד למנוע מכמה ערכים להפעיל מחדש אפקטים.

</LearnMore>

## הסרת תלויות אפקט {/*הסרת-אפקט-תלות*/}

כאשר אתה כותב אפקט, ה-linter יוודא שכללת כל ערך תגובתי (כמו props וstate) שהאפקט קורא ברשימת התלות של האפקט שלך. זה מבטיח שהאפקט שלך יישאר מסונכרן עם הprops וstate העדכניים ביותר של הרכיב שלך. תלות מיותרות עלולה לגרום לאפקט שלך לפעול בזמן, או אפילו ליצור לולאה אינסופית. הדרך תלויה במקרה.

לדוגמה, אפקט זה תלוי באובייקט 'אפשרויות' שנוצר מחדש בכל פעם שאתה עורך את הקלט:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

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

אתה לא רוצה שהצ'אט יתחבר מחדש בכל פעם שאתה מתחיל להקליד הודעה בצ'אט זה. כדי לתקן זו בעיה, העבר את היצירה של אובייקט ה-'options' בתוך האפקט כך שהאפקט תלוי רק במחרוזת 'roomId':

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

שים לב שלא התחלת בעריכת רשימת התלות כדי להסיר את התלות 'אפשרויות'. זה יהיה שגוי. במקום זאת, שינית את הקוד שמסביב כך שהתלות הפכה ל*מיותרת.* תחשוב על רשימת התלות כעל רשימה של כל הערכים התגובתיים המשמשים את הקוד של האפקט שלך. אתה לא בוחר בכוונה מה לשים ברשימה הזו. הרשימה מתארת ​​את הקוד שלך. כדי לשנות את רשימת התלות, שנה את הקוד.

<LearnMore path="/learn/removing-effect-dependencies">

קרא את **[הסרת תלות אפקט](/learn/removing-effect-dependencies)** כדי ללמוד כיצד לגרום לאפקט לפעול שוב בתדירות נמוכה יותר.

</LearnMore>

## שימוש חוזר בהיגיון עם ווים מותאמים אישית {/*שימוש-חוזר-בהיגיון-עם-ווים-מותאמים-אישית*/}

תגובה מגיעה עם Hooks מובנים כמו `useState`, `useContext` ו-`useEffect`. לפעמים, תרצה שיהיה Hook למטרה ספציפית יותר: למשל, נתונים, לעקוב אם אתה משתמש מקומי או להתחבר לחדר צ'אט. כדי לעשות זאת, אתה יכול ליצור Hooks משלך לצרכי האפליקציה שלך.

בדוגמה זו, ה-Hook המותאם אישית `usePointerPosition` עוקב אחר מיקום הסמן, בעוד `useDelayedValue` Hook המותאם אישית מחזיר ערך ש"פוגר מאחורי" הערך שעברה מספר מסוימות של אלפיות שניות. הזז את ההסמן מעל אזור התצוגה המקדימה של ארגז החול כדי לראות שובל נע של נקודות בעקבות ההסמן:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

אתה יכול ליצור הHooks מותאמים באופן אישי, לחבר אותם, להעביר, ולעשות בהם שימוש חוזר בין רכיבים. ככל שהאפליקציה שלך תגדל, תכתוב פחות אפקטים ביד אם תעשה שימוש חוזר ב-Hooks מותאמים אישית כתבת. יש גם הרבה הHooks מותאמים אישיים מצוינים שמתוחזקים על ידי קהילת React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

קרא את **[השתמש בבלוגיקה עם ווים מותאמים אישית](/learn/reusing-logic-with-custom-hooks)** כדי ללמוד כיצד לשתף לוגיקה בין רכיבים.

</LearnMore>

## מה הלאה? {/*מה-הבא*/}

עברו אל [התייחסות לערכים עם Refs](/learn/referencing-values-with-refs) כדי להתחיל לקרוא פרק זה עמוד אחר עמוד!

