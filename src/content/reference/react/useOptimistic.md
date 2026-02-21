---
title: "useOptimistic"
canary: true
---

<Canary>

ה-Hook `useOptimistic` זמין כרגע רק בערוצי Canary ו-experimental של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useOptimistic` הוא React Hook שמאפשר לעדכן את ה-UI באופן אופטימי.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` הוא React Hook שמאפשר להציג state שונה בזמן שפעולה אסינכרונית. הוא מקבל state כארגומנט ומחזיר עותק של אותו state יכול להיות שונה לפעולה האסינכרונית, למשל בקשת להיות רשת. אתם מספקים פונקציה שמקבלת את ה-state הנוכחית ואת קלט פעולה, ומחזירה את ה-state שהאופטימי שישמש בזמן ממתינה.

ה-state הזה נקרא "אופטימי" כי בדרך כלל משתמשים בו כדי להציג למשתמש מיד את תוצאת הפעולה, למרות שבפועל נוקטת זמן להשלים.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `state`: הערך שיוחזר בתחילה ובכל פעם שאין פעולה ממתינה.
* `updateFn(currentState, optimisticValue)`: פונקציה שמקבלת את ה-state הנוכחית ואת הערך האופטימי שמועבר ל-`addOptimistic`, ומחזירה את ה-state האופטימי המתקבל. זו חייבת להיות פונקציה טהורה. `updateFn` מקבלת שני פרמטרים: `currentState` ו-`optimisticValue`. הערך המוחזר יהיה הערך העיצוב של `currentState` ו-`optimisticValue`.


#### מחזירה {/*returns*/}

* `optimisticState`: ה-state האופטימי המתקבל. הוא שווה ל-`state` אלא אם יש פעולה ממתינה, ובמקרה כזה הוא שווה לערך שהוחזר מ-`updateFn`.
* `addOptimistic`: פונקציית שליחת לקריאה כשיש עדכון אופטימי. היא מקבלת ארגומנט אחד, `optimisticValue`, מכל סוג, ותיקרא ל-`updateFn` עם `state` ו-`optimisticValue`.

---

## שימוש {/*usage*/}

### עדכון אופטימי של טפסים {/*optimistically-updating-with-forms*/}

ה-Hook `useOptimistic` מספק דרך לעדכן את ממשק המשתמש באופן אופטימי לפני שפעולת רקע, כמו בקשת רשת, מסתיימת. בהקשר של טפסים, הטכניקה הזו עוזרת לאפליקציות להרגיש תגובתיות יותר. כשמשתמש טופס, במקום להמתין לתמהשרת כדי לשקף את השינויים, הממשק מתעדכן מיד עם התוצאה צפויה.

לדוגמה, כשמשתמש מקליד הודעה בטופס ולוחץ על כפתור "Send", ה-Hook `useOptimistic` יכול להודעה להופיע מיד ברשימה עם תווית "Sending...", עוד לפני שההודעה באמת נשלחת לשרת. הגישה ה"אופטימית" הזו יוצרת תחושת מהירות ותגובתיות. לאחר שהצליח לכתוב את ההודעה ברקע. כשהשרת מאשר שההודעה התקבלה, תווית "שולח..." מוסרת.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
