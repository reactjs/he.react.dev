---
title: "הפרדת אירועים מ-אפקטים"
---

<Intro>

מטפלי אירועים פועלים מחדש רק כאשר אתה מבצע שוב את אותה אינטראקציה. שלא כמו מטפלים באירועים, אפקטים מסתנכרנים מחדש אם ערך כלשהו שהם קוראים, כמו אב או משתנה מצב, שונה ממה שהיה במהלך העיבוד האחרון. לפעמים, אתה גם רוצה שילוב של שתי ההתנהגויות: אפקט המופעל מחדש בתגובה לערכים מסוימים אך לא לאחרים. הדף הזה ילמד אותך איך לעשות זאת.

</Intro>

<YouWillLearn>

- כיצד לבחור בין מטפל באירועים לבין אפקט
- מדוע אפקטים מגיבים, ומטפלי אירועים אינם
- מה לעשות כאשר אתה רוצה שחלק מהקוד של האפקט שלך לא יהיה תגובתי
- מהם אירועי אפקט וכיצד לחלץ אותם מהאפקטים שלך
- הכי לקרוא את הprops וstate העדכניים מאפקטים באמצעות אפקט אירועים

</YouWillLearn>

## בחירה בין מטפלי אירועים לאפקטים {/*בחירה-בין-event-handlers-and-effects*/}

ראשית, בואו נסכם את ההבדל בין מטפלי אירועים לאפקטים.

תאר לעצמך שאתה מיישם רכיב של חדר צ'אט. הדרישות שלך נראות כך:

1. הרכיב שלך אמור להתחבר אוטומטית לחדר הצ'אט הנבחר.
1. כאשר אתה לוחץ על כפתור "שלח", זה אמור לשלוח הודעה לצ'אט.

נניח את הקודם אבל אתה לא בטוח איפה לשים אותו. האם להשתמש ברופאי אירועים או אפקטים? בכל פעם שאתה צריך לענות על שאלה זו, שקול*למה* הקוד צריך לפעול.](/learn/synchronizing-with-effects#what-are-effects-and-how-the-the-different-from-events)

### מטפלי אירועים פועלים בתגובה לאינטראקציות {/*event-handlers-run-in-response-to-specific-interactions*/}

מנקודת המבט של המשתמש, שליחת הודעה צריכה להתרחש *מכיוון* שנלחצה על כפתור ה"שלח" המסוים. המשתמש יתעצבן למדי אם תשלח את ההודעה שלו בכל זמן אחר או מכל סיבה אחרת. זו הסיבה ששליחת הודעה צריכה להיות מטפל באירועים. מטפלי אירועים מאפשרים לך לטפל באינטראקציות ספציפיות:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>;
    </>
  );
}
```

עם מטפל באירועים, אתה יכול להיות בטוח ש'סendMessage(message)' יפעל *רק* אם המשתמש ילחץ על הכפתור.

### אפקטים פועלים בכל פעם שיש צורך בסנכרון {/*effects-run-whenever-synchronization-is-needed*/}

זכור כי אתה גם צריך לשמור את הרכיב מחובר לחדר הצ'אט. לאן הולך הקוד הזה?

*הסיבה* להפעיל את הקוד הזה אינה אינטראקציה מסוימת. זה לא משנה למה או איך המשתמש נווט למסך חדר הצ'אט. כעת, כשהם מסתכלים עליו ויכולים ליצור איתו אינטראקציה, הרכיב צריך להישאר מחובר לשרת הצ'אט שנבחר. גם אם רכיב חדר הצ'אט היה המסך הראשוני של האפליקציה שלך, והמשתמש לא ביצע אינטראקציות כלל, תצטרך *עדיין* להתחבר. זו הסיבה שזה אפקט:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

עם קוד זה, אתה יכול להיות בטוח שתמיד יש חיבור פעיל לשרת הצ'אט שנבחר כעת, *ללא קשר* לאינטראקציות הספציפיות שמבצע משתמש. בין אם משתמש רק פתח את האפליקציה שלך, בחר חדר אחר או ניווט למסך אחר ובחזרה, האפקט שלך מבטיח שהרכיב *יישאר מסונכרן* עם החדר שנבחר עכשיו, ו[יתחבר מחדש בכל פעם שנדרש.](/learn/lifecycle-of-reactive-effects#why-synchronization-cany-reactive-to-han

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
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
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

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
input, select { margin-right: 20px; }
```

</Sandpack>

## ערכים ריאקטיביים והיגיון תגובתי {/*reactive-values-and-reactive-logic*/}

באופן אינטואיטיבי, אפשר לומר שמטפלי אירועים תמיד מופעלים "ידנית", למשל על ידי לחיצה על כפתור. האפקטים, לעומת זאת, הם "אוטומטיים": הם פועלים ומופעלים מחדש בתדירות הנדרשת כדי להישאר מסונכרנים.

יש דרך יותר מדויקת לחשוב על זה.

props, מצב ומשתנים המוצהרים בתוך גוף הרכיב שלך נקראים <CodeStep step={2}> ערכים תגובתיים</CodeStep>. בדוגמה זו, `serverUrl` אינו ערך תגובתי, אבל `roomId` ו-`message` כן. הם משתתפים בעיבוד:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

ערכים תגובתיים כמו אלה יכולים להשתנות עקב עיבוד מחדש. לדוגמה, יכול להשתמש לערוך את ההודעה' או לבחור 'roomId' אחר בתפריט נפתח. מטפלי אירועים ואפקטים מגיבים לשינויים בצורה שונה:

- **ההיגיון בתוך מטפלי אירועים הוא *לא תגובתי.*** זה לא יפעל שוב אלא אם המשתמש יבצע שוב את אותה אינטראקציה (למשל, קליק). מטפלי אירועים יכולים לקרוא ערכים תגובתיים מבלי "להגיב" לשינויים שלהם.
- **ההיגיון בתוך אפקטים הוא *reactive.*** אם האפקט שלך קורא ערך תגובתי, [עליך לציין אותו כתלות.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) לאחר מכן, אם עיבוד גורם לערך זה החדש החידוש, React יפעיל את החידוש החדש שלך.

בואו נחזור על הדוגמה הקודמת כדי להמחיש את ההבדל הזה.

### ההיגיון בתוך רופא אירועים אינו תגובתי {/*logic-inside-event-handlers-is-not-reactive*/}

תסתכל על שורת הקוד הזו. האם ההיגיון הזה צריך להיות תגובתי או לא?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

מנקודת המבט של המשתמש, **שינוי ב'הודעה' _לא_ אומר שהוא רוצה לשלוח הודעה.** זה רק שהמשתמש מקליד. במילים אחרים, ההיגיון ששולח הודעה לא צריך להיות תגובתי. זה לא אמור לפעול רק בגלל ש<CodeStep step={2}>ערך התגובה</CodeStep> השתנה. בשביל זה שייך לרופא באירועים:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

מרפאה אירועים אירועים ריאקטיביים, כך ששלחו הודעה(הודעה)' יפעל רק כאשר המשתמש ילחץ על כפתור השליחה.

### ההיגיון בתוך אפקטים הוא תגובתי {/*logic-inside-effects-is-reactive*/}

כעת נחזור לשורות אלו:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

מנקודת המבט של המשתמש, **שינוי ב-`roomId` *משמעו* שהם רוצים להתחבר לחדר אחר.** במילים אחרות, ההיגיון לחיבור לחדר צריך להיות תגובתי. אתה *רוצה* ששורות הקוד האלה "יעמדה בקצב" עם <CodeStep step={2}>הערך הריאקטיבי</CodeStep>, ויפעלו שוב אם הערך הזה שונה. בשביל זה שייך לאפקט:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

האפקטים הם תגובתיים, אז `createConnection(serverUrl, roomId)` ו-`connection.connect()` יפעלו עבור כל ערך מובחן של `roomId`. האפקט שלך שומר על חיבור הצ'אט מסונכרן לחדר שנבחר עכשיו.

## חילוץ לוגיקה לא-ריאקטיבית מתוך אפקטים {/*חילוץ-לא-ריאקטיבי-לוגיקה-מחוץ-להשפעות*/}

דברים נעשים מסובכים יותר כאשר אתה רוצה לערבב לוגיקה תגובתית עם לוגיקה לא תגובתית.

לדוגמה, דמיינו רוצים להציג את המשתמש כאשר אתה מתחבר לצ'אט. אתה קורא את הנושא הנוכחי (כהה או בהיר) מprops כדי להציג את ההודעה בהתאמה נכונה:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

עם זאת, `theme` הוא ערך תגובתי (הוא יכול להשתנות כמו עיבוד מחדש), ו[כל ערך תגובתי הנקרא על ידי אפקט חייב להיות מוכרז כתלות שלו.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specificated-every-reactive-value-the-reactive-me-the-dependence:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

שחק עם הדוגמה הזו וראה אם ​​אתה יכול לזהות את הבעיה בחוויית המשתמש הזו:

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

כאשר ה-'roomId' משתנה, הצ'אט מתחבר מחדש כפי שהיית מצפה. אבל תלמת ש'נושא' הוא גם תות, הצ'אט *גם* מתחבר מחדש בכל פעם שאתה מחליף בין הנושא הכהה והבהיר. זה לא נהדר!

במילים אחרות, אתה *לא* רוצה שהשורה הזו תהיה תגובתית, למרות שהיא בתוך אפקט (שהוא תגובתי):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

אתה צריך דרך להפריד את ההיגיון הלא תגובתי הזה מהאפקט התגובתי סביבו.

### הכרזה על אירוע אפקט {/*הכרזה-על-אירוע-אפקט*/}

<Wip>

סעיף זה מתאר **API ניסיוני שעדיין לא שוחרר** בגרסה יציבה של React.

</Wip>

השתמש בהוק מיוחד בשם [`useEffectEvent`](/reference/react/experimental_useEffectEvent) כדי לחלץ את ההיגיון הלא תגובתי הזה מהאפקט שלך:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

כאן, `onConnected` נקרא *Effect Event.* זה חלק מהלוגיקת האפקט שלך, אבל הוא מתנהג הרבה יותר כמו מטפל באירועים. ההיגיון בתוכו אינו תגובתי, והוא תמיד "רואה" את הערכים העדכניים ביותר של הprops וstate שלך.

עכשיו אתה יכול לקרוא לאירוע 'onConnected' אפקט מתוך האפקט שלך:

```js {2-4,9,13}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

זה פותר את הבעיה. שים לב שהיית צריך *להסיר* את 'onConnected' מרשימת התלות של האפקט שלך. **אירועי אפקט הם ריאקטיביים ויש להשמיט אותם מהתלות.**

ודא שההתנהגות החדשה פועלת כפי שהיית מצפה:

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

אתה יכול לחשוב על אפקט אירועים כדומים מאוד למטפלי אירועים. היבט עיקרי הוא שרופאי אירועים פועלים בתגובה לאינטראקציות של משתמש, בעוד שאירועי אפקט מופעלים על ידך מ- Effects. אפקט אירועים מאפשרים לך "לשבור את השרשרת" בין התגובתיות של אפקטים לקוד שלא אמור להיות תגובתי.

### קריאת הprops אחר וstate עם אפקט אירועים {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

סעיף זה מתאר **API ניסיוני שעדיין לא שוחרר** בגרסה יציבה של React.

</Wip>

אירועי אפקט מאפשרים לך לתקן דפוסים רבים שבהם אתה עלול להתפתות לדכא את קו התלות.

לדוגמה, נניח שיש לך אפקט לרישום הביקורים בדף:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

מאוחר יותר, אתה מוסיף מספר מסלולים לאתר. רכיב ה'דף' שלך מקבל props 'כתובת אתר' עם הנתיב הנוכחי. אתה רוצה להעביר את ה-URL כחלק משיחת ה-'logVisit' שלך, אבל קו התלות מתלונן:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

תחשוב מה אתה רוצה שהקוד יעשה. אתה *רוצה* לרשום ביקור עבור כתובות אתרים שונות זו שכל כתובת אתר מייצגת דף אחר. במילים אחרות, קריאת `logVisit` זו *צריכה* להיות תגובתית לכתוב לכתובת ה-URL. זו הסיבה, שבמקרה זה, הגיוני לעקוב אחר קו התלות ולהוסיף 'כתובת אתר' בתור תלות:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

כעת נניח שברצונך לכלול את מספר הפריטים בעגלת הקניות יחד עם כל ביקור בדף:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

השתמשת ב-'numberOfItems' בתוך האפקט, אז ה-Linter מבקש ממך להוסיף אותו כתלות. עם זאת, אתה *לא* רוצה שהקריאה 'logVisit' תהיה תגובתית ביחס ל'numberOfItems'. אם משתמש מכניס משהו לעגלת הקניות, ו-'numberOfItems' ranking, זה *לא* אומר שהמשתמש ביקר שוב בעמוד. במילים אחרות, *ביקור בדף* הוא, במידה מסוימת, "אירוע". זה קורה בדיוק בזמן.

פצל את הקוד לשני חלקים:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

כאן, 'onVisit' הוא אירוע אפקט. הקוד שבתוכו אינו מגיב. אתה יכול להשתמש ב-'numberOfItems' (או בכל ערך תגובתי אחר!) אלא לדאוג שזה יגרום לקוד שמסביב להפעיל מחדש בשינויים.

מצד שני, האפקט נשאר עצמו תגובתי. הקוד בתוך האפקט משתמש בprops `url`, כך שהאפקט יפעל מחדש לאחר כל רינדור מחדש עם `url` אחר. זה, בתורו, יקרא את אירוע אפקט 'onVisit'.

כתוצאה מכך, תתקשר ל-'logVisit' עבור כל שינוי ב-'url', ותמיד תקרא את ה-'numberOfItems' העדכני ביותר. עם זאת, אם 'numberOfItems' משתנה מעצמו, זה לא יגרום לאף אחד מהקודים להפעיל מחדש.

<Note>

אולי אתה תוהה אם אתה יכול לקרוא ל- `onVisit()` ללא ארגומנטים, ולקרוא את ה-URL שבתוכו:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

זה יעבוד, אבל עדיף להעביר את ה-URL הזה לאירוע אפקט במפורש. **על ידי העברת שלך 'כתובת אתר' כטיעון לאירוע האפקט, אתה אומר שביקור בדף עם 'כתובת אתר' שונה שונה "אירוע" נפרד מנקודת המבט של המשתמש.** ה-'visitedUrl' *חלק* מה"אירוע" שקרה:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

זה שאירוע הקט שלך "מבקש" במפורש את ה-'visitedUrl', כעת אינך יכול לפתוח בטעות 'url' מהתלות של האפקט. אם תסיר את התלות של 'כתובת האתר' (מה ששלח לביקורים נפרדים בדפים להיספר כאחד), ה-linter יזהיר אותך על כך. אתה רוצה ש-'onVisit' יהיה תגובתי ביחס ל-'url', אז במקום לקרוא את ה-'url' בפנים (היכן שהוא לא יהיה תגובתי), אתה מעביר אותו *מה* אפקט שלך.

זה הופך להיות חשוב במיוחד אם יש היגיון אסינכרוני כלשהו בתוך האפקט:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

כאן, `url` בתוך `onVisit` תואם ל`כתובת האתר` *האחרונה* (שיכולה כבר הייתה להשתנות), אבל `visitedUrl` תואמת את ה-url שבמקור גרמה לאפקט הזה (ולקריאת `onVisit` זו) לפעול.

</Note>

<DeepDive>

#### האם זה בסדר לדכא את קו התלות במקום זאת? {/*האם-זה-בסדר-להדכא-לנטרל-תלות-במקום-זאת*/}

בבסיסי הקוד הקיימים, לפעמים אתה עשוי לראות את כלל המוך מודחק כך:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

לאחר ש-'useEffectEvent' גורם לחלק יציב ב-React, אנו ממליצים **לעולם לא לדכא את ה-linter**.

החיסרון הראשון של דיכוי הכלל הוא ש-React כבר לא מזהיר אותך כשהאפקט שלך צריך "להגיב" לתלות תגובתית חדשה שהכנסת לקוד שלך. בדוגמה הקודמת, הוספת 'url' לתלויות *כי* React הזכיר לך לעשות זאת. לא תקבל עוד תזכורות כאלה עבור כל עריכה עתידית של אפקט זה אם תשבית את ה-linter. זה מוביל לבאגים.

הנה דוגמה לבאג מבלבל שנגרם על ידי דיכוי ה-linter. בדוגמה זו, הפונקציה `handleMove` אמורה לקרוא את הערך משתנה הstate הנוכחית `canMove` על מנת להחליט אם הנקודה צריכה לעקוב אחר הסמן. עם זאת, `canMove` תמיד `נכון` בתוך `handleMove`.

אתה יכול לראות למה?

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


הבעיה עם הקוד הזה היא בדיכוי. אם תסיר את הדיכוי, תראה שהאפקט הזה צריך להיות תלוי בפעולה 'handleMove'. זה הגיוני: `handleMove` מוצהר בתוך גוף הרכיב, מה שהופך אותו לערך תגובתי. כל ערך תגובתי חייב להיות מוגדר כתלות, אחרת הוא להתייאש עם הזמן!

מחבר הקוד המקורי "שיקר" ל-React באומרו שהאפקט אינו תלוי (`[]`) בערכים תגובתים כלשהם. זה מה ש-React לא סינכרן מחדש את האפקט לאחר ש-'canMove' השתנה (ו-'handleMove' איתו). איך ש-React לא סינכרן מחדש את האפקט, ה-'handleMove' המצורף כמאזין הוא הפונקציה 'handleMove' עיבוד עיבוד הראשוני. על העיבוד הראשוני, `canMove` היה `נכון`, וזוהי ש`handleMove` מהרינדור הראשוני יראה לנצח את הערך הזה.

**אם לעולם לא תדחיק את ה-linter, לעולם לא תראה בעיות עם ערכים מיושנים.**

עם `useEffectEvent`, אין צורך "לשקר" ל-linter, והקוד עובד כפי שהיית מצפה:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

זה לא ש-'useEffectEvent' הוא *תמיד* אומר הפתרון הנכון. עליך להחיל אותו רק על שורות הקוד שאינך רוצה שיהיו תגובתיים. בארגז החול שלמעלה, לא רצית שהקוד של האפקט יהיה תגובתי לגבי `canMove`. זה היה הגיוני לחלץ אירוע אפקט.

קרא את [הסרת תלות אפקט](/learn/removing-effect-dependencies) לקבלת חלופות נכונות אחרות לדיכוי ה-linter.

</DeepDive>

### מגבלות של אירוע אפקט {/*limitations-of-effect-events*/}

<Wip>

סעיף זה מתאר **API ניסיוני שעדיין לא שוחרר** בגרסה יציבה של React.

</Wip>

אירועי אפקט מוגבלים מאוד איך אתה יכול להשתמש בהם:

* **התקשר אליהם רק מתוך אפקטים.**
* **לעולם אל תעביר אותם לרכיבים אחרים או לווים.**

לדוגמה, אל תצהיר ותעביר אירוע אפקט בצורה הבאה:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

במקום זאת, תמיד הכריז על אפקט אירועים ישירות ליד האפקטים המשתמשים בהם:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

אירועי אפקט הם "חלקים" לא תגובתיים של קוד האפקט שלך. הם צריכים להיות ליד האפקט המשתמש בהם.

<Recap>

- מטפלי אירועים פועלים בתגובה לאינטראקציות ספציפיות.
- אפקטים פועלים בכל פעם שיש צורך בסנכרון.
- ההיגיון בתוך מטפלי אירועים אינו תגובתי.
- ההיגיון בתוך אפקטים הוא תגובתי.
- אתה יכול להעביר לוגיקה לא תגובתית מאפקטים לאירועי אפקט.
- התקשר רק ל-Effect Events מתוך אפקטים.
- אל תעביר אירועי אפקט לרכיבים אחרים או הHooks.

</Recap>

<Challenges>

#### תקן משתנה שלא מתעדכן {/*תקן-משתנה-שלא-מעדכן*/}

רכיב 'טימר' זה שומר על ranking מצב 'ספירה' אשר גדל כל שנייה. הערך שבאמצעותו הוא גדל מאוחסן בהstate 'increment'. אתה יכול לשלוט בשינוי 'increment' עם לחצני הפלוס והמינוס.

עם זאת, לא משנה כמה פעמים תלחץ על כפתור הפלוס, המונה עדיין גדל באחד בכל שנייה. מה רע בקוד הזה? למה `increment` תמיד שווה ל`1` בתוך הקוד של האפקט? מצא את הטעות ותקן אותה.

<Hint>

כדי לתקן את הקוד הזה, מספיק לעקוב אחר הכללים.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

כרגיל, אתה מחפש באגים ב- Effects, התחל בחיפוש אחר דיכוי לנטר.

אם תסיר את הערת הדיכוי, React יגיד לך שהקוד של אפקט זה תלוי ב-`increment`, אבל "שיקרת" ל-React בטענה שהאפקט הזה אינו תלוי בשום ערכים תגובתיים (`[]`). הוסף 'increment' למערך התלות:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

כעת, כאשר ה'increment' משתנה, React יסנכרן מחדש את האפקט שלך, מה שיפעיל מחדש את המרווח.

</Solution>

#### תקן מונה הקפאה {/*תיקון-א-הקפאה-מונה*/}

רכיב 'טימר' זה שומר על ranking מצב 'ספירה' אשר גדל כל שנייה. הערך שבאמצעותו הוא גדל מאוחסן בהstate 'increment', שבו אתה יכול לשלוט בו באמצעות לחצני הלוס והמינוס. לדוגמה, נסה ללחוץ על כפתור הפלוס תשע פעמים, ושם לב שה'ספירה' גדלה עכשיו בכל שנייה בשאר במקום באחת.

יש בעיה קטנה בממשק המשתמש הזה. אולי תשים לב שאם תמשיך ללחוץ על כפתורי הפלוס או המינוס מהר יותר מפעם בשנייה, נראה שהטיימר עצמו נעצר. זה מתחדש רק לאחר שעוברת שנייה מאז הפעם האחרונה שלחצת על אחד מהלחצנים. מצא מדוע זה קורה, ותקן את הבעיה כך שהטיימר יפעל *כל* שנייה ללא הפרעות.

<Hint>

זה נראה כאילו האפקט שמגדיר את הטיימר "מגיב" לערך ה'increment'. האם השורה שמשתמשת בערך ה-'increment' הנוכחי כדי לקרוא ל-'setCount' באמת צריכה להיות תגובתית?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

הבעיה היא משתנה בתוך האפקט משתמש ב-Hstate 'increment'. מה שגורם למרווח להתנקות. אם תמשיך לנקות את הרווח בכל פעם לפני שתהיה לו הזדמנות לירות, זה נראה כאילו הטיימר נתקע.

כדי לפתור את הבעיה, חלץ אירוע אפקט 'onTick' מהאפקט:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

מה ש-'onTick' הוא אירוע אפקט, הקוד שבתוכו אינו מגיב. השינוי ל'increment' אינו מפעיל אפקטים.

</Solution>

#### תקן השהייה שאינה ניתנת להתאמה {/*fix-a-non-adjustable-delay*/}

בדוגמה זו, אתה יכול להתאים אישית את השהיית המרווחים. הוא מאוחסן במשתנה מצב 'עיכוב' שמתעדכן על ידי שני כפתורים. עם זאת, גם אם תלחץ על כפתור "פלוס 100 ms" עד שה-`השהיה` תהיה 1000 אלפיות השנייה (כלומר, שנייה), תבחין שהטיימר עדיין עולה מהר מאוד (כל 100 אלפיות השנייה). זה כאילו שמתעלמים מהשינויים שלך ב-`השהיה`. מצא ותקן את הבאג.

<Hint>

הקוד בתוך אירועי אפקט אינו תגובתי. האם יש מקרים דורשים _תרצה_ שהקריאה 'setInterval' תפעל מחדש?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

הבעיה עם הדוגמה שלמעלה היא חילצה אירוע אפקט שנ 'onMount' מבלי לשקול מה הקוד אמור לעשות. עליך לחלץ אירוע אפקט רק מסיבה מסוימת: כאשר אתה רוצה להפוך חלק מהקוד שלך ללא תגובתי. עם זאת, הקריאה 'setInterval' *צריכה* להיות תגובתית לשינוי הstate 'השהיה'. אם 'השהיה' מתרוצץ, אתה רוצה להגדיר את המרווח מאפס! כדי לתקן את הקוד הזה, משוך את כל הקוד התגובתי בחזרה לתוך האפקט:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

באופן כללי, אתה צריך לחשוד בפונקציות 'onMount' המעשה כמוות ב*תזמון* ולא ב*מטרה* של קטע קוד. זה אולי מרגיש "יותר תיאורי" בהתחלה אבל זה מטשטש את הכוונה שלך. כל אצבע, אירועי אפקט צריכים להתאים למשהו שקורה מנקודת המבט של *המשתמש*. לדוגמה, `onMessage`, `onTick`, `onVisit` או `onConnected` הם שמות אירועי אפקט טובים. סביר להניח שהקוד בתוכם לא יצטרך להיות תגובתי. מצד שני, `onMount`, `onUpdate`, `onUnmount` או `onAfterRender` הם כל כך גנריים שקל להכניס בהם בטעות קוד ש*צריך* להיות תגובתי. אתה צריך לקרוא ל-Effect Events שלך על שם *מה שהמשתמש חושב שקרה,* לא כאשר במקרה רץ קודש.

</Solution>

#### תקן התראה מושהית {/*fix-a-delayed-notification*/}

כאשר אתה מצטרף לחדר צ'אט, רכיב זה מציג התראה. עם זאת, זה לא מציג את ההודעה מיד. במקום זאת, ההודעה מתעכבת באופן מלאכותי בשתי שניות, כך שלמשתמש יש הזדמנות להסתכל סביב ממשק המשתמש.

זה כמעט עובד, אבל יש באג. נסה לשנות את התפריט הנפתח מ"כללי" ל"נסיעות" ואז ל"מוזיקה" מהר מאוד. אם תעשה את זה מספיק מהר, תראה שתי התראות (כצפוי!) אבל *שתיהן* יגידו "ברוכים הבאים למוזיקה".

תקן את זה כך שכשאתה עובר מ"כללי" ל"נסיעות" ואז ל"מוזיקה" מהר מאוד, תראה שתי התראות, הראשונה היא "ברוכים הבאים לנסיעה" והשנייה היא "ברוכים הבאים למוזיקה". (לאתגר נוסף, בהנחה ש*כבר* גרמת להודעות להציג את החדרים הנכונים, שנה את הקוד כך שרק ההודעה האחרונה תוצג).

<Hint>

האפקט שלך יודע לאיזה חדר הוא התחבר. האם יש מידע שאולי תרצה להעביר לאירוע האפקט שלך?

</Hint>

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
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
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

<Solution>

בתוך אירוע האפקט שלך, 'roomId' הוא הערך *בזמן הקריאה לאירוע אפקט.*

אירוע האפקט שלך נקרא בהשהייה של שתי שניות. אם אתה עובר במהירות מהנסיעה לחדר המוזיקה, כאשר מופיעה ההתראה של חדר הנסיעות, `roomId` הוא כבר `"מוזיקה"`. זו שאלה ששתיתי ההתראות אומרות "ברוכים הבאים למוזיקה".

כדי לתקן את הבעיה, במקום לקרוא את ה'roomId' *האחרון* בתוך אירוע האפקט, הפוך אותו לפרמטר של אירוע האפקט שלך, כמו 'connectedRoomId' למטה. לאחר שהעביר את 'roomId' מהאפקט שלך על ידי קריאה ל'onConnected(roomId)':

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
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

האפקט ש-'roomId' הוגדר ל-'"travel"' (כך שהוא מתחבר לחדר ה-''travel'') יציג את ההתראה עבור ''travel''. האפקט שבו הוא גדר `roomId` ל-`"מוזיקה"` (כך שהוא מתחבר לחדר `"מוזיקה"`) יציג את ההתראה עבור `"מוזיקה"`. במילים אחרים, `connectedRoomId` מגיע מהאפקט שלך (שהינו תגובתי), בעוד `theme` משתמש תמיד בערך האחרון.

כדי לפתור את האתגר הנוסף, שמור את מזהה הזמן הקצוב להודעה ונקה אותו בפונקציית הניקוי של האפקט שלך:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
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

זה מבטיח שהתראות שכבר מתוזמנות (אך עדיין לא הוצגו) יבוטלו כאשר אתה מחליף חדר.

</Solution>

</Challenges>

