---
title: "שימוש חוזר בלוגיקה עם ווים מותאמים"
---

<Intro>

React מגיע עם כמה Hooks מובנים כמו `useState`, `useContext` ו-`useEffect`. לפעמים, תרצה Hook למטרה ספציפית יותר: למשל, להביא נתונים, לעקוב אם יהיה מחובר או להתחבר לחדר צ'אט. אולי לא תמצא את ה-Hooks ב-React, אבל אתה יכול ליצור __TK_7 משלך לצרכי האפליקציה שלך.

</Intro>

<YouWillLearn>

- מה הם הHooks מותאמים אישית ואיך לכתוב בעצמך
- כיצד לעשות שימוש חוזר בלוגיקה בין רכיבים
- איך לתת שם ולבנות את הווים המותאמים אישית שלך
- מתי ומדוע לחלץ ווים מותאמים אישית

</YouWillLearn>

## ווים מותאמים אישית: שיתוף היגיון בין רכיבים {/*custom-hooks-sharing-logic-between-components*/}

תארו לעצמכם שאתם מפתחים אפליקציה שנשענת במידה רבה על הרשת (כמו שרוב האפליקציות עושות). אתה רוצה להזהיר את המשתמש אם חיבור הרשת שלו כבה בטעות בזמן שהוא השתמש באפליקציה שלך. איך היית מתנהלת? נראה שתצטרך שני דברים ברכיב שלך:

1. פיסת state שעוקבת אחר האם הרשת מקוונת.
2. אפקט שנרשם לאירועים הגלובליים [`מקוון`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) ו-[`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event).

זה ישמור את הרכיב שלך [מסונכרן](/learn/synchronizing-with-effects) עם סטטוס הרשת. אתה יכול להתחיל עם משהו כזה:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

נסה להפעיל ולכבות את הרשת שלך, ושם לב איך 'סרגל הstate' הזה מתעדכן בתגובה שלך לפעולות.

עכשיו דמיינו שאתם *גם* רוצים להשתמש באותו היגיון ברכיב אחר. ברצונך ליישם כפתור שמירה שיהפוך לבלתי זמין ויראה "מתחבר מחדש..." במקום "שמור" בזמן שהרשת כבויה.

כדי להתחיל, אתה יכול להעתיק את המצב `isOnline` ואת האפקט לתוך `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

ודא שאם תכבה את הרשת, הכפתור ישנה את מראהו.

שני הרכיבים האלה עובדים מצוין, אבל הכפילות בלוגיקה ביניהם היא מצערת. נראה שלמרות שיש להם *מראה חזותי* שונה, אתה רוצה לעשות שימוש חוזר בהיגיון ביניהם.

### חילוץ Hook מותאם אישית משלך גורם {/*חילוץ-שלך-מתאים-מותאם-אישית-מ-a-component*/}

תארו לעצמכם לרגע שבדומה ל-[`useState`](/reference/react/useState) ו-[`useEffect`](/reference/react/useEffect), היה Hook של `useOnlineStatus` מובנה. אז ניתן יהיה לפשט את שני הרכיבים הללו ולהסיר את הכפילות ביניהם:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

למרות שאין Hook מובנה כזה, אתה יכול לכתוב את זה בעצמך. הכריז על פונקציה בשם `useOnlineStatus` והעבר לתוכה את כל הקוד המשוכפל מהרכיבים שכתבת קודם:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

בסוף הפונקציה, החזר `isOnline`. זה יכול לרכיבים שלך לקרוא את הערך הזה:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

ודא כי הפעלה וכיבוי של הרשת מעדכנת את שני הרכיבים.

כעת לרכיבים שלך אין כל כך הרבה היגיון חוזר. **חשוב מכך, הקוד בתוכם מתאר *מה הם רוצים לעשות* (השתמשו בסטטוס המקוון!) במקום *איך לעשות זאת* (על ידי הרשמה לאירועי הדפדפן).**

כאשר אתה מחלץ היגיון לתוך Hooks מותאמים אישית, אתה יכול להסתיר את הפרטים המסובים של איך אתה מתמודד עם מערכת חיצונית או API של דפדפן. הקוד של הרכיבים שלך מבטא את הכוונתך, לא את היישום.

### שמות Hook תמיד מתחילים ב-`use` {/*hook-names-always-start-with-use*/}

ישומי React בנויים מהנים. רכיבים בנויים מ-Hooks, בין אם מובנים או מותאמים אישית. סביר להניח שלעתים קרובות תשתמש ב-Hooks מותאמים אישיים אישיים על ידי אחרים, אבל לפעמים אתה יכול לכתוב אחד בעצמך!

עליך לפעול לפי מוסכמות השמות הבאות:

1. **שמות רכיבי React חייבים להתחיל באות גדולה,** כמו 'StatusBar' ו-'SaveButton'. משהו רכיבי React צריכים גם להחזיר שראקט יודע להציג, כמו חתיכת JSX.
2. **שמות Hook חייבים להתחיל ב-`use` ואחריו באות גדולה,** כמו [`useState`](/reference/react/useState) (מובנה) או `useOnlineStatus` (מותאם אישית, כמו קודם בדף). הHooks להחזיר ערכים שרירותיים.

מוסכמה זו מבטיחה שתמיד תוכל להסתכל על רכיב ולדעת היכן מצבו, אפקטים ושאר תכונות React עשויות "להסתתר". לדוגמה, אם אתה רואה את פעולות היצירה `getColor()` בתוך הרכיב שלך, אתה יכול להיות בטוח שהיא לא יכולה להכיל מצב React בפנים כי השם שלה לא מתחיל ב-`use`. עם זאת, קריאת פונקציה כמו `useOnlineStatus()` תכיל ככל הנראה קריאות ל-Hooks אחרים בפנים!

<Note>

אם ה-linter שלך הוא [מוגדר עבור React,](/learn/editor-setup#linting) הוא יאכוף את מוסכמות השמות הזו. גלול למעלה אל ארגז החול למעלה ושנה את השם של 'useOnlineStatus' ל'getOnlineStatus'. שימו לב שה-linter לא יאפשר לכם לקרוא 'useState' או 'useEffect' בתוכו יותר. רק הHooks ורכיבים יכולים לקרוא לHooks אחרים!

</Note>

<DeepDive>

#### האם כל הפונקציות שנקראות עיבוד צריכות להתחיל בקידומת הפעלה? {/*צריך-כל-הפונקציות-שנקראות-במהלך-רינדור-להתחיל-עם-the-use-prefix*/}

לא. פונקציות שלא *קוראות* לHooks לא צריכות *להיות* Hooks.

אם הפונקציה שלך לא קוראת לאף Hooks, הימנע מקידומת 'שימוש'. במקום זאת, כתוב אותה כפונקציה רגילה *ללא* הקידומת 'שימוש'. לדוגמה, 'useSorted' למטה לא קורא Hooks, אז קרא לזה 'getSorted' במקום זאת:

```js
// 🔴 Avoid: A Hook that doesn't use Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

זה מבטיח שהקוד שלך יכול לקרוא לפונקציה הרגילה הזו בכל מקום, כולל תנאים:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

עליך לתת קידומת 'use' לפונקציה (ובכך להפוך ל-Hook) אם היא משתמשת לה לפחות Hook אחת בתוכה:

```js
// ✅ Good: A Hook that uses other Hooks
function useAuth() {
  return useContext(Auth);
}
```

מבחינה טכנית, זה לא צריך לדעת React. באופן עקרוני, אתה יכול לעשות Hook שלא קורא לHook אחרים. זה קרוב מקרב ומגביל הזה עדיף בל מהדפוס הזה. עם זאת, ייתכנו מקרים נדירים. לדוגמה, אולי הפונקציה שלך לא משתמשת באף Hooks כרגע, אבל אתה מתכנן להוסיף כמה שיחות Hook אולי. אז הגיוני לתת לזה שם עם הקידומת 'שימוש':

```js {3-4}
// ✅ Good: A Hook that will likely use some other Hooks later
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // return useContext(Auth);
  return TEST_USER;
}
```

אז רכיבים לא לקרוא לקרוא מותנה. זה יהפוך חשוב כאשר אתה באמת מוסיף שיחות Hook פנימה. אם אינכם מתכננים להשתמש בHooks בתוכו (עכשיו או מאוחר יותר), אל תהפכו אותו לHook.

</DeepDive>

### ווים מותאמים מאפשרים לך לשתף את היגיון מצבי, לא להגדיר את עצמו {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

בדוגמה הקודמת, בעת הפעלת וכיבית את הרשת, שני הרכיבים עודכנו יחד. עם זאת, זה לא נכון שמשתנה מצב 'isOnline' יחיד שותף ביניהם. תסתכל על הקוד הזה:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

זה עובד באותו אופן כמו לפני שחילצת את הכפילות:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

אלו שני משתני מצב ואפקטים בלתי תלויים לחלוטין! במקרה היה להם אותו ערך בו-זמנית כי סינכרנתם אותם עם אותו ערך חיצוני (בין אם הרשת מופעלת).

כדי להמחיש זאת טוב יותר, נצטרך דוגמה אחרת. שקול את רכיב ה'טופס' הזה:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

יש היגיון שחוזר על עצמו עבור כל שדה טופס:

1. יש פיסת state (`שם פרטי` ו`שם משפחה`).
1. יש למטפל בשינוי (`handleFirstNameChange` ו-`handleLastNameChange`).
1. יש קטע של JSX שמציין את התכונה 'ערך' ו-'onChange' עבור הקלט הזה.

אתה יכול לחלץ את ההיגיון החוזר על ה-Hook המותאם האישי של 'useFormInput':

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

שימו לב שהוא מכריז רק על משתנה מצב *אחד* בשם 'ערך'.

עם זאת, הרכיב 'Form' קורא 'useFormInput' *פעמיים:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

זו הסיבה שזה עובד כמו הכרזה על שני משתני מצב נפרדים!

**Custom Hooks מאפשרים לך לשתף *היגיון מצבי* אבל לא *לציין את עצמו.* כל קריאה ל-Hook עצמאית לחלוטין מכל קריאה אחרת לאותו Hook.** זו מחפשת ששתי ארגזי החול שלמעלה שוות לחלוטין. אם תרצה, חזרה למעלה והשווה בין גלובל. ההתנהגות לפני ואחרי חילוץ Hook מותאם אישית זהה.

כאשר אתה צריך לחלק את הstate עצמו בין רכיבים מרובים, [הרם אותו והעביר אותו למטה](/learn/sharing-state-between-components) במקום זאת.

## העברת ערכים תגוב ביןתיים Hooks {/*העברת-reactive-values-between-hooks*/}

הקוד בתוך Hooks המותאמים האישיים שלך יפעל מחדש כל רינדור מחדש של הרכיב שלך. זו הסיבה, כמו רכיבים, Hooks מותאמים אישית [צריכים להיות טהורים.](/learn/keeping-components-pure) חשבו על הקוד המותאם האישי של Hooks כחלק מגוף הרכיב שלכם!

מה שה-Hooks מותאמים מעבדים אישיים מחדש יחד עם הרכיב שלך, הם תמיד מקבלים את הprops וstate העדכניות ביותר. כדי לראות מה זה אומר, שקול את הדוגמה הזו לחדר צ'אט. שנה את כתובת האתר של השרת או את חדר הצ'אט:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

כאשר אתה משנה `serverUrl` או `roomId`, האפקט ["מגיב" לשינויים שלך](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) ומסתנכרן מחדש. אתה יכול לראות לפי הודעות המסוף שהצ'אט מתחבר מחדש בכל פעם שאתה משנה את התלות של האפקט שלך.

העבר את הקוד של האפקט ל-Hook מותאם אישית:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

זה יכול לרכיב `ChatRoom` שלך לקרוא ל-Hook המותאם אישית שלך לבד לדאוג איך זה עובד בפנים:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

זה נראה הרבה יותר פשוט! (אבל זה עושה את אותו הדבר.)

שימו לב שההיגיון *עדיין מגיב* לשינויי תמיכה וstate. נסה לערוך את כתובת האתר של השרת או את החדר שנבחר:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

שים לב איך אתה לוקח את הערך ההחזר של Hook אחד:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

והעבירו אותו כקלט לHook אחר:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

בכל פעם שרכיב שלך `ChatRoom` מעבד מחדש, הוא מעביר את `roomId` ואת `serverUrl` העדכניים ביותר ל-Hook שלך. אתה מתחבר מחדש לצ'אט בכל פעם שהערכים שלהם שונים לאחר עיבוד מחדש. (אם אי פעם עבדת עם תוכנת עיבוד אודיו או וידאו, שרשור Hooks כזה עשוי להזכיר לך שרשור אפקטים ויזואליים או אודיו. זה כאילו הפלט של `useState` "מוזן" לקלט של `useChatRoom`.)

### מטפלי אירועים ל-Hooks מותאמים אישית {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

סעיף זה מתאר **API ניסיוני שעדיין לא שוחרר** בגרסה יציבה של React.

</Wip>

ככל שתתחיל להשתמש ב-'useChatRoom' ברכיבים נוספים, אולי תרצה לאפשר לרכיבים להתאים אישית את ההתנהגות שלו. לדוגמה, נכון לעכשיו, ההיגיון של מה לעשות כשמגיעה הודעה מקודד בתוך ה-Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

נניח שאתה רוצה להעביר את ההיגיון הזה בחזרה לרכיב שלך:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

כדי לגרום לזה לעבוד, שנה את ה-Hook המותאם האישי שלך כדי לקחת את 'onReceiveMessage' כאחת מהאפשרויות הנקראות שלו:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

זה יעבוד, אבל יש עוד שיפור אחד שאתה יכול לעשות כאשר ה-Hook המותאם האישי שלך מקבל מטפל אירועים.

הוספת תלות ב-'onReceiveMessage' אינה אידיאלית שהיא תגרום לצ'אט להתחבר מחדש בכל פעם שהרכיב מעבד מחדש. [עטפו את הטיפול הזה לתוך אירוע אפקט כדי להוציא מהתלות:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
}
```

עכשיו הצ'אט לא יתחבר מחדש בכל פעם שרכיב `ChatRoom` מעבד מחדש. הנה הדגמה עובדת מלאה של העברת מטפל באירועים לHook מותאם אישית לשחק איתו:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

שים לב איך אתה כבר לא צריך לדעת *איך* `useChatRoom` עובד כדי להשתמש בו. אתה יכול להוסיף אותו לכל רכיב אחר, להעביר כל אופציה אחרת, וזה יעבוד באותה צורה. זה הכוח של הHooks מותאמים אישית.

## מתי להשתמש ב-Hooks מותאמים אישית {/*when-to-use-custom-hooks*/}

אינך צריך לחלץ Hook מותאם אישית עבור כל פיסת קוד משוכפלת קטנה. כמה כפילות זה בסדר. לדוגמה, חילוץ `useFormInput` Hook כדי לכרוך קריאת `useState` בודדת כמו קודם הוא כנראה מיותר.

עם זאת, בכל פעם שאתה כותב אפקט, שקול אם יהיה ברור יותר לתווף אותו גם בHook מותאם אישית. [לא צריך אפקטים קרובות מאוד,](/learn/you-might-not-need-an-effect) אז אם אתה כותב אחד, זה אומר שאתה צריך "לצאת מחוץ ל-React" כדי להסתנכרן עם מערכת חיצונית או לעשות משהו של-React אין API מובנה עבור. תעביר אותו לתוך Hook מותאם אישית יכול לך לתקשר במדויק את הכוונתך.

לדוגמה, שקול רכיב `ShippingForm` המציג שתי תפריטים נפתחים: אחד מציג את רשימת הערים, ומציג את רשימת האזורים בעיר שנבחרה. אתה יכול להתחיל עם איזה קוד שנראה כך:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

למרות שהקוד הזה חוזר על עצמו, [נכון לשמור על אפקטים אלה נפרדים זה מזה.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) הם מסנכרנים שני דברים שונים, אז לא כדאי למזג אותם לאפקט אחד. במקום זאת, אתה יכול לפשט את הרכיב `ShippingForm` למעלה על ידי חילוץ ההיגיון המשותף בין ה-`useData` שלך:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

עכשיו אתה יכול להחליף את שני הפקטים ברכיבי `ShippingForm` בקריאות ל-`useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

חילוץ Hook מותאם אישית מבצע את זרימת למפורשת. אתה מזין את ה'כתובת' פנימה ואתה מוציא את ה'נתונים'. על ידי "הסתרת" האפקט שלך בתוך `useData`, אתה גם מונע ממישהו שעובד על רכיב `ShippingForm` להוסיף לו [תלות מיותרות](/learn/removing-effect-dependencies). עם הזמן, רוב האפקטים של האפליקציה שלך יהיו ב-Hooks מותאמים אישית.

<DeepDive>

#### שמור את ה-Hooks המותאמים האישיים שלך ממוקדים של שימוש בטון ברמה גבוהה {/*לשמור-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

התחל בבחירת השם המותאם אישית של Hook. אם אתה מתבקש לבחור שם ברור, זה יכול להיות שהאפקט שלך מחובר מדי לשאר ההיגיון של הרכיב שלך, ועדיין אינו מוכן לחילוץ.

בדרך כלל אידיאלי, השם של ה-Hook המותאם אישית צריך להיות ברור מספיק כדי שאפילו אדם שלא כותבים קודים כאלה שיכולים לנחש היטב מה ה-Hook המותאם האישי שלך עושה, מה הוא דורש ומה הוא מחזיר:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `שימוש בצ'אט (אפשרויות)`

כאשר אתה מסתנכרן עם מערכת חיצונית, השם Hook המותאם האישי שלך עשוי להיות טכני יותר להשתמש בז'רגון ספציפי לאותה מערכת. זה טוב כל עוד זה יהיה ברור לאדם שמכיר את הזו הזו:

* ✅ `useMediaQuery(שאילתה)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**שמור על הHooks מותאמים אישית ממוקדים של שימוש בטון ברמה גבוהה.** הימנע מיצירה ושימוש ב-Hooks מותאמים אישית של "מחזור חיים" הפועלים כאלטרנטיבות ועטיפות נוחות עבור ממשק ה-API של 'useEffect' עצמו:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

לדוגמה, ה-'useMount' Hook הזה מנסה שקוד מסוים רץ רק "על mount":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**Hooks של "מחזור חיים" מותאם אישית כמו `useMount` הם מתאימים היטב לפרדיגמת React.** זו לדוגמה, דוגמה של קוד יש טעות (הוא לא "מגיב" לשינויים של `roomId` או `serverUrl`), זה לא ידע על Hook שלך.

אם אתה כותב אפקט, התחל על ידי שימוש ב-React API:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

לאחר מכן, אתה יכול (אך לא חייב) לחלץ Hooks מותאמים אישית עבור מקרי שימוש שונים ברמה גבוהה:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Hook מותאם אישית טוב יוצר את הקוד הקורא להצהרתי יותר על ידי הגבלה של מה שהוא עושה.** לדוגמה, `useChatRoom(options)` יכול להתחבר רק לחדר הצ'אט, בעוד ש-`useImpressionLog(eventName, extraData)` יכול לפרסם רק יומן הופעות לניתוח. אם ה-API המותאם אישית של Hook לא מגביל את מקרי השימוש והוא מאוד מופשט, בטווח הארוך הוא צפוי להציע יותר בעיות ממה שהוא פותר.

</DeepDive>

### ווים מותאמים אישיים עוזרים לך לעבור לדפוסים טובים יותר {/*custom-hooks-help-you-migrate-to-better-patterns*/}

אפקטים הם ["פתח מילוט"](/learn/escape-hatches): אתה משתמש בהם כאשר אתה צריך "לצאת החוצה React" וכאשר אין פתרון מובנה טוב יותר עבור שימוש במקרה שלך. עם הזמן, המטרה של צוות React היא לצמצם את מספר האפקטים באפליקציה שלך למינימום על ידי מתן פתרונות ספציפיים יותר לבעיות מדוייקות יותר. עטיפה של האפקטים שלך ב-Hooks מותאמים אישית מקלה על שדרוג הקוד שלך כאשר הפתרונות האלה יהיו זמינים.

נחזור לדוגמא הזו:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

בדוגמה שלמעלה, `useOnlineStatus` מיושם עם זוג של [`useState`](/reference/react/useState) ו-[`useEffect`.](/reference/react/useEffect) עם זאת, זה לא הפתרון הטוב ביותר האפשרי. יש מספר מקרי קצה שהיא לא לוקחת בחשבון. לדוגמה, הוא מניח שכאשר הרכיב נטען, `isOnline` כבר `נכון`, אבל זה עשוי להיות שגוי אם הרשת כבר יצאה לstate לא מקוון. אתה יכול להשתמש בממשק ה-API של הדפדפן [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) כדי לבדוק זאת, אך יישום בו אוטומטי לא יעבוד בשרת ליצירת ה-HTML הראשוני. בקיצור, ניתן לשפר את הקוד הזה.

למרבה המזל, React 18 כולל API ייעודי בשם [`useSyncExternalStore`](/reference/react/useSyncExternalStore) מטפל בכל הבעיות הללו עבורך. הנה איך ה-'useOnlineStatus' שלך נכתב מחדש כדי לנצל את ה-API החדש הזה:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

```

</Sandpack>

שימו לב כיצד **לא היית צריך לשנות אף אחד מהרכיבים** כדי לבצע את ההגירה הזו:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

זו סיבה נוספת לכך שעטיפה של בHooks מותאמים באופן אישי היא אפקטית בשעה מועילה:

1. אתה הופך את זרימת הנתונים אל האפקטים שלך וממנו בצורה מאוד מפורשת.
2. אתה נותן לרכיבים שלך להתמקד בכוונה ולא ביישום המדויק של האפקטים שלך.
3. כאשר React מוסיף תכונות חדשות, אתה יכול להוציא את האפקטים האלה מבלי לשנות אף אחד מהרכיבים שלך.

בדומה ל[מערכת עיצוב,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)K יעזור לך להתחיל לחלץ ניבים נפוצים מכניסי האפליקציה שלך לתוך Hooks מותאמים אישית.

<DeepDive>

#### האם React יספק כל פתרון מובנה לאיסוף נתונים? {/*תגיב-לספק-כל-פתרון-מובנה-לשליפת-נתונים*/}

אנחנו עדיין עובדים על הפרטים, אבל אנו מצפים שבעתיד תכתוב איסוף נתונים כך:

```js {1,4,6}
import { use } from 'react'; // Not available yet!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

אם אתה משתמש ב-Hooks מותאמים אישיים כמו 'useData' למעלה באפליקציה שלך, זה ידרוש שינויים קטנים כדי להגיע לגישה המומלצת בסופו של דבר אם תכתוב אפקטים גולמיים בכל רכיב באופן ידני. עם זאת, הגישה הישנה עדיין תעבוד בסדר, אז אם אתה מרגיש שמח לכתוב אפקטים גולמיים, אתה יכול להמשיך לעשות זאת.

</DeepDive>

### יש יותר מדרך אחת לעשות את זה {/*יש-יותר-מאחת-דרך-לעשות-זה*/}

נניח שאתה ליישם אנימציה דהייה *מאפס* באמצעות דפדפן [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API. אתה יכול להתחיל עם אפקט שמגדיר לולאת אנימציה. על כל פריים של האנימציה, אתה יכול לשנות את התנאים של צומת ה-DOM שאתה [מחזיק ב-ref-dom] ל-`1` הקוד שלך עשוי להתחיל כך:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
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

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

כדי להפוך את הרכיב לקריאה יותר, תוכל להחלץ את ההיגיון לתוך Hook מותאם אישית של 'useFadeIn':

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

אתה יכול לשמור את הקוד 'useFadeIn' כפי שהוא, אבל אתה יכול גם לשחזר אותו יותר. לדוגמה, אתה יכול לחלץ את ההיגיון להגדרת לולאת האנימציה מתוך `useFadeIn` ל-`useAnimationLoop` Hook מותאם אישית:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

עם זאת, לא *חייב* לעשות זאת. כמו בפונקציות רגילות, בסוף אתה מחליט היכן לשרת את הגבולות בין חלקים שונים של הקוד שלך. אתה יכול גם לנקוט בגישה שונה מאוד. במקום לשמור על ההיגיון באפקט, אתה יכול להעביר את רוב ההיגיון החיוני בתוך JavaScript [מחלקה:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

אפקטים מאפשרים לך לחבר את React למערכות חיצוניות. ככל שנדרש יותר תיאום בין אפקטים (לדוגמה, לשרשרת אנימציות מרובות), יותר הגיוני לחלץ את ההיגיון הזה מתוך אפקטים וHooks *לגמרי* כמו בארגז החול שלמעלה. לאחר מכן, הקוד שחילצת *גורם* ל"מערכת החיצונית". זה יכול לפרסם הודעות למערכת שהעברת מחוץ ל-React.

הדוגמאות לעיל מניחות שהלוגיקת ה-Fade-in צריכה להיות כתובה ב-JavaScript. עם זאת, אני מציית הדה-אין הספציפית הזו פשוטה יותר והרבה יותר יעילה ליישום עם [CSS אנימציה:](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
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

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

לפעמים אתה אפילו לא צריך Hook!

<Recap>

- ווים מותאמים אישית מאפשרים לך לשתף היגיון בין רכיבים.
- יש לתת שם ל-Custom Hooks שמתחיל ב-'use' ואחריו באות גדולה.
- ווים מותאמים אישית חולקים רק היגיון מצבי, לא מצב עצמו.
- אתה יכול להעביר ערכים תגובתיים מHook אחד למשנהו, הם נשארים מעודכנים.
- כל הHooks פועלים מחדש בכל פעם שהרכיב שלך מעבד מחדש.
- הקוד של Hooks המותאמים האישי שלך צריך להיות טהור, כמו הקוד של הרכיב שלך.
- עטוף רופאי אירועים שהתקבלו על ידי Hooks מותאמים אישית לאירועי אפקט.
- אל תיצור ווים מותאמים אישית כמו `useMount`. שמור על ייעודם ספציפי.
- זה תלוי בך איך והיכן לבחור את גבולות הקוד שלך.

</Recap>

<Challenges>

#### חלץ Hook של `useCounter` {/*extract-a-usecounter-hook*/}

רכיב זה משתמש בשינוי מצב ובאפקט כדי להציג מספר שגדל כל שנייה. חלץ את ההיגיון הזה בתוך Hook מותאם אישית בשם `useCounter`. המטרה שלך היא לגרום למימוש רכיב 'Counter' להיראות בדיוק כך:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

תצטרך לכתוב את ה-Hook המותאם האישי שלך ב-`useCounter.js` ולייבא אותו לקובץ `Counter.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

הקוד שלך אמור להיראות כך:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

שימו לב ש-'App.js' לא צריך לייבא יותר את 'useState' או 'useEffect'.

</Solution>

#### הפוך את השהיית המונה לניתנת להגדרה {/*הפוך-את-הדלפק-להגדרה*/}

בדוגמה זו, קיים משתנה מצב 'עיכוב' שנשלט על ידי מחוון, אך הערך שלו אינו בשימוש. העבר את הערך ה-'delay' ל-'useCounter'-Hook המותאם האישי שלך, ושנו את ה-'useCounter'-Hook כדי להשתמש ב-'delay' שעבר במקום לקודד קשה של '1000' אלפיות שניות.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

העבר את ה-'delay' לHook שלך עם 'useCounter(delay)'. לאחר, בתוך ה-Hook, השתמש ב-'delay' בערך '1000' המקודד. תצטרך להוסיף 'עיכוב' לתלות של האפקט שלך. זה מבטיח שינוי ב'עיכוב' יאפס את המרווח.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### חלץ `useInterval` מתוך `useCounter` {/*extract-useinterval-out-of-usecounter*/}

נכון לעכשיו, ה-'useCounter' Hook שלך עושה שני דברים. הוא מגדיר מרווח, והוא גם מגדיל את המצב על כל סימון מרווח. חלקו את ההיגיון שמגדיר את הרווח ל-Hook נפרד שנקרא `useInterval`. זה צריך לקחת שני ארגומנטים: ה-'onTick' callback, וה-'delay'. לאחר השינוי הזה, היישום 'useCounter' שלך אמור להיראות כך:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

כתוב 'useInterval' בקובץ 'useInterval.js' וייבא אותו לקובץ 'useCounter.js'.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

ההיגיון בתוך 'useInterval' צריך להגדיר ולנקות את המרווח. זה לא צריך לעשות שום דבר אחר.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

שימו לב שיש קצת בעיה עם הפתרון הזה, אותה תפתרו באתגר הבא.

</Solution>

#### תקן מרווח איפוס {/*fix-a-resetting-interval*/}

בדוגמה זו, יש *שני* מרווחים נפרדים.

רכיב ה'אפליקציה' קורא ל'useCounter', שקורא ל'useInterval' כדי לעדכן את המונה בכל שנייה. אבל רכיב ה'אפליקציה' *גם* קורא 'useInterval' כדי לעדכן באופן אקראי את צבע הרקע של העמוד כל שתי שניות.

מסיבה כלשהי, ה-callback שמעדכן את רקע העמוד אף פעם לא פועל. הוסף כמה יומנים בתוך 'useInterval':

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

האם היומנים תואמים למה שאתה מצפה שיקרה? אם אתה נראה שחלק מהאפקטים שלך מסתנכרנים מחדש שלא לצורך, האם אתה יכול לנחש איזו תלות גורמת לזה לקרות? האם יש דרך אחרת [להסיר את התלות הזו](/Learn/removing-effect-dependencies) מה אפקט שלך?

לאחר שתתקן את הבעיה, עליך לצפות שרקע הדף יתעדכן כל שתי שניות.

<Hint>

זה נראה כאילו ה-'useInterval' שלך מקבל מאזין אירועים כטיעון. האם אתה יכול לחשוב על איזושהי דרך לעטוף את המאזין לאירועים כך שהוא לא צריך להיות תלוי באפקט שלך?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

בתוך `useInterval`, עטפו את ה-Tick Callback לאירוע אפקט, כפי שעשיתם [קודם בדף זה.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

זה יאפשר לך להשמיט את 'onTick' מהתלות של האפקט שלך. האפקט לא יסונכרן מחדש בכל עיבוד מחדש של הרכיב, כך שמרווח שינוי צבע הרקע של הדף לא יתאפס כל שנייה לפני שתהיה לו הזדמנות להפעיל.

עם שינוי זה, שני המרווחים פועלים כמצופה ואינם מפריעים זה לזה:

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### יישם תנועה מדהימה {/*יישם-תנועה-מדהימה*/}

בדוגמה זו, Hook `usePointerPosition()` עוקב אחר מיקום הstateיע הנוכחי. נסה להזיז את הסמן או את האצבע שלך על אזור התצוגה המקדימה וראה את הנקודה האדומה עוקבת אחר התנועה שלך. המיקום שלו נשמר בשינוי `pos1`.

למעשה, יש חמש (!) נקודות אדומות שונות המוצגות. אתה לא רואה אותם כי כרגע כולם מופיעים באותו מיקום. זה מה שאתה צריך לתקן. מה שאתה רוצה ליישם במקום זאת הוא תנועה "מדורגת": כל נקודה צריכה "לעקוב אחרי" הנתיב של הנקודה הקודמת. לדוגמה, אם תזיז במהירות את הסמן, הנקודה הראשונה צריכה לעקוב אחריו מיד, הנקודה השנייה צריכה לעקוב אחרי הנקודה הראשונה בהשהייה קטנה, הנקודה השלישית צריכה לעקוב אחרי הנקודה השנייה, וכן הלאה.

עליך ליישם את ה-Hook המותאם אישית 'useDelayedValue'. האפליקציה הנוכחית שלו מחזירה את ה'ערך' שסופק לו. במקום זאת, אתה רוצה להחזיר את הערך בחזרה מלפני אלפיות שנייה של 'עיכוב'. ייתכן שתזדקק לאיזשהו מצב ואפקט כדי לעשות זאת.

לאחר הטמעת 'useDelayedValue', אתה אמור לראות את הנקודות זזות אחת אחרי השנייה.

<Hint>

יהיה עליך לאחסן את `delayedValue` כמשתנה מצב בתוך ה-Hook המותאם האישי שלך. כאשר ה'ערך' ranking, תרצה להפעיל אפקט. אפקט זה אמור לעדכן את 'delayedValue' לאחר ה-'delay'. אולי יעזור לך לקרוא ל'setTimeout'.

האם האפקט הזה צריך ניקוי? למה או למה לא?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

הנה גרסה עובדת. אתה שומר את ה-'delayedValue' כמשתנה מצב. כאשר 'ערך' מתעדכן, האפקט שלך מתזמן פסק זמן לעדכון ה-'delayedValue'. זה מה שה-`delayedValue` תמיד "נגרר מאחורי" ה`ערך` בפועל.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

שימו לב שהאפקט הזה *לא* צריך לניקוי. אם קראת 'clearTimeout' בפונקציית הניקוי, אז בכל פעם שה'ערך' משתנה, זה יאפס את הזמן הקצוב תוך זמן. כדי לשמור על התנועה רציפה, אתה רוצה שכל פסקי הזמן יפעלו.

</Solution>

</Challenges>

