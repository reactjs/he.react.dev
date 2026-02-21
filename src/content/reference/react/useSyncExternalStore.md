---
title: "useSyncExternalStore"
---

<Intro>

`useSyncExternalStore` הוא React Hook המאפשר לך להירשם לחנות חיצונית.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

התקשר ל-`useSyncExternalStore` ברמה העליונה של הרכיב שלך כדי לקרוא ערך ממאגר נתונים חיצוני.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

זה מחזיר את תמונת המצב של הנתונים בחנות. עליך להעביר שתי פונקציות כארגומנטים:

1. הפונקציה `subscribe` צריכה להירשם לחנות ולהחזיר פונקציה שמבטלת את המנוי.
2. הפונקציה `getSnapshot` צריכה לקרוא תמונת מצב של הנתונים מהחנות.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `subscribe`: פונקציה שלוקחת ארגומנט `callback` בודד ומרשימה אותו לחנות. כאשר החנות משתנה, היא צריכה להפעיל את ה-`callback` שסופק. זה יעשה use הרכיב לעיבוד מחדש. הפונקציה `subscribe` צריכה להחזיר פונקציה שמנקה את המנוי.

* `getSnapshot`: פונקציה שמחזירה תמונת מצב של הנתונים בחנות הדרושים לרכיב. בעוד שהחנות לא השתנתה, שיחות חוזרות אל `getSnapshot` חייבות להחזיר את אותו הערך. אם החנות משתנה והערך המוחזר שונה (בהשוואה לפי [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React מעבד מחדש את הרכיב.

* **אופציונלי** `getServerSnapshot`: פונקציה שמחזירה את תמונת המצב הראשונית של הנתונים בחנות. זה יהיה used רק במהלך רינדור השרת ובמהלך הידרציה של תוכן שניתנו על ידי השרת בלקוח. תמונת המצב של השרת חייבת להיות זהה בין הלקוח לשרת, ובדרך כלל עוברת בסידרה ומועברת מהשרת ללקוח. אם תשמיט ארגומנט זה, רינדור הרכיב בשרת יגרום לשגיאה.

#### מחזירה {/*returns*/}

תמונת המצב הנוכחית של החנות שבה אתה יכול use בלוגיקת העיבוד שלך.

#### אזהרות {/*caveats*/}

* תמונת המצב של החנות שהוחזרה על ידי `getSnapshot` חייבת להיות בלתי ניתנת לשינוי. אם למאגר הבסיסי יש נתונים שניתנים לשינוי, החזר תמונת מצב חדשה בלתי ניתנת לשינוי אם הנתונים השתנו. אחרת, החזר תמונת מצב אחרונה במטמון.

* אם תועבר פונקציית `subscribe` אחרת במהלך רינדור מחדש, React יירשם מחדש לחנות באמצעות הפונקציה `subscribe` שעברה לאחרונה. אתה יכול למנוע זאת על ידי הצהרת `subscribe` מחוץ לרכיב.

* אם החנות עוברת מוטציה במהלך [עדכון מעבר לא חוסם](/reference/react/useTransition), React יחזור לבצע עדכון זה כחסימה. באופן ספציפי, עבור כל עדכון מעבר, React יתקשר ל-`getSnapshot` פעם שנייה רגע לפני החלת שינויים ב-DOM. אם הוא מחזיר ערך שונה ממה שהוא נקרא במקור, React יפעיל מחדש את העדכון מאפס, והפעם יחיל אותו כעדכון חוסם, כדי להבטיח שכל רכיב על המסך משקף את אותה גרסה של החנות.

* לא מומלץ _להשהות_ רינדור על סמך ערך חנות שהוחזר על ידי `useSyncExternalStore`. הסיבה היא שלא ניתן לסמן מוטציות בחנות החיצונית כ[עדכוני מעבר לא חוסמים](/reference/react/useTransition), כך שהן יפעילו את [`Suspense` fallback](/reference/react/Suspense) הקרובה ביותר, תוך החלפת תוכן שכבר מעובד על המסך בספינר טעינה, שבדרך כלל יוצר UX גרוע.

לדוגמה, לא מעודדים את הדברים הבאים:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## שימוש {/*usage*/}

### הרשמה לחנות חיצונית {/*subscribing-to-an-external-store*/}

רוב רכיבי ה-React שלכם יקראו רק נתונים מה-[props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) ו-[context.](/reference/react/useContext) עם זאת, לפעמים לקרוא חלק מהמחסן של useContext מ-__. שמשתנה עם הזמן. זה כולל:

* ספריות ניהול state של צד שלישי שמחזיקות state מחוץ ל-React.
* דפדפנים APIs שחושפים ערך בר שינוי ואירועים כדי להירשם לשינויים שלו.

התקשר ל-`useSyncExternalStore` ברמה העליונה של הרכיב שלך כדי לקרוא ערך ממאגר נתונים חיצוני.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

הוא מחזיר את <CodeStep step={3}>תמונת מצב</CodeStep> של הנתונים בחנות. עליך להעביר שתי פונקציות כארגומנטים:

1. הפונקציה <CodeStep step={1}>`subscribe`</CodeStep> צריכה להירשם לחנות ולהחזיר פונקציה שמבטלת את המנוי.
2. הפונקציה <CodeStep step={2}>`getSnapshot`</CodeStep> צריכה לקרוא תמונת מצב של הנתונים מהחנות.

React יבצע use פונקציות אלה כדי לשמור על הרכיב שלך כמנוי לחנות ולעבד אותו מחדש בשינויים.

לדוגמה, בארגז החול למטה, `todosStore` מיושם כחנות חיצונית המאחסנת נתונים מחוץ ל-React. רכיב `TodosApp` מתחבר לאותו חנות חיצונית עם `useSyncExternalStore` Hook.

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

במידת האפשר, אנו ממליצים להשתמש במקום זאת ב-React state המובנה עם [`useState`](/reference/react/useState) ו-[`useReducer`](/reference/react/useReducer). ה-`useSyncExternalStore` API הוא לרוב useמלא אם אתה צריך לשלב עם קוד קיים שאינו React.

</Note>

---

### הרשמה לדפדפן API {/*subscribing-to-a-browser-api*/}

סיבה נוספת להוסיף `useSyncExternalStore` היא כאשר אתה רוצה להירשם לערך כלשהו שנחשף על ידי הדפדפן ומשתנה עם הזמן. לדוגמה, נניח שאתה רוצה שהרכיב שלך יציג אם חיבור הרשת פעיל. הדפדפן חושף מידע זה באמצעות מאפיין בשם [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

ערך זה יכול להשתנות ללא ידיעתו של React, אז כדאי לקרוא אותו עם `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

כדי ליישם את הפונקציה `getSnapshot`, קרא את הערך הנוכחי מהדפדפן API:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

לאחר מכן, עליך ליישם את הפונקציה `subscribe`. לדוגמה, כאשר `navigator.onLine` משתנה, הדפדפן יפעיל את האירועים [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) ו-[`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) באובייקט `window`. אתה צריך לרשום את הארגומנט `callback` לאירועים המתאימים, ולאחר מכן להחזיר פונקציה שמנקה את המינויים:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

כעת React יודע לקרוא את הערך מה-`navigator.onLine` החיצוני API וכיצד להירשם לשינויים שלו. נתק את המכשיר מהרשת ושם לב שהרכיב מעבד מחדש בתגובה:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### חילוץ ההיגיון ל-Hook {/*extracting-the-logic-to-a-custom-hook*/} מותאם אישית

בדרך כלל לא תכתוב `useSyncExternalStore` ישירות ברכיבים שלך. במקום זאת, בדרך כלל תקרא לזה מ-Hook המותאם אישית שלך. זה מאפשר לך use אותה חנות חיצונית ממרכיבים שונים.

לדוגמה, `useOnlineStatus` Hook מותאם אישית זה עוקב אחר האם הרשת מחוברת:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

כעת רכיבים שונים יכולים לקרוא ל-`useOnlineStatus` מבלי לחזור על היישום הבסיסי:

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
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### הוספת תמיכה בעיבוד שרת {/*adding-support-for-server-rendering*/}

אם האפליקציה React שלך uses [עיבוד שרת,](/reference/react-dom/server) רכיבי React שלך יפעלו גם מחוץ לסביבת הדפדפן כדי ליצור את ה-HTML הראשוני. זה יוצר כמה אתגרים בעת חיבור לחנות חיצונית:

- אם אתה מתחבר לדפדפן בלבד API, זה לא יעבוד כי use הוא לא קיים בשרת.
- אם אתה מתחבר למאגר נתונים של צד שלישי, תזדקק לנתונים שלו כדי להתאים בין השרת ללקוח.

כדי לפתור בעיות אלה, העבר פונקציה `getServerSnapshot` כארגומנט השלישי ל-`useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

הפונקציה `getServerSnapshot` דומה ל-`getSnapshot`, אך היא פועלת רק בשני מצבים:

- הוא פועל על השרת בעת יצירת ה-HTML.
- הוא פועל על הלקוח במהלך [hydration](/reference/react-dom/client/hydrateRoot), כלומר כאשר React לוקח את השרת HTML והופך אותו לאינטראקטיבי.

זה מאפשר לך לספק את ערך תמונת המצב הראשוני שיהיה used לפני שהאפליקציה תהפוך לאינטראקטיבית. If there is no meaningful initial value for the server rendering, omit this argument to [force rendering on the client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

ודא ש`getServerSnapshot` מחזיר את אותם נתונים מדויקים בעיבוד הלקוח הראשוני כפי שהם הוחזרו בשרת. לדוגמה, אם `getServerSnapshot` החזיר תוכן חנות מאוכלס מראש בשרת, עליך להעביר את התוכן הזה ללקוח. אחת הדרכים לעשות זאת היא לפלוט תג `<script>` במהלך רינדור השרת שמגדיר גלובל כמו `window.MY_STORE_DATA`, ולקרוא מהגלובל הזה על הלקוח ב-`getServerSnapshot`. החנות החיצונית שלך צריכה לספק הנחיות כיצד לעשות זאת.

</Note>

---

## פתרון בעיות {/*troubleshooting*/}

### אני מקבל הודעת שגיאה: "התוצאה של `getSnapshot` צריכה להיות מאוחסנת במטמון" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

שגיאה זו פירושה שהפונקציה `getSnapshot` שלך מחזירה אובייקט חדש בכל פעם שהוא נקרא, לדוגמה:

```js {2-5}
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  return {
    todos: myStore.todos
  };
}
```

React יעבד מחדש את הרכיב אם ערך ההחזרה `getSnapshot` שונה מהפעם הקודמת. זו הסיבה שאם תחזיר תמיד ערך אחר, תיכנס ללולאה אינסופית ותקבל את השגיאה הזו.

האובייקט `getSnapshot` שלך צריך להחזיר אובייקט אחר רק אם משהו השתנה בפועל. אם החנות שלך מכילה נתונים בלתי ניתנים לשינוי, אתה יכול להחזיר את הנתונים האלה ישירות:

```js {2-3}
function getSnapshot() {
  // ✅ You can return immutable data
  return myStore.todos;
}
```

אם נתוני החנות שלך ניתנים לשינוי, הפונקציה `getSnapshot` שלך אמורה להחזיר תמונת מצב בלתי ניתנת לשינוי שלה. זה אומר שהוא *צריך* ליצור אובייקטים חדשים, אבל הוא לא צריך לעשות זאת עבור כל קריאה בודדת. במקום זאת, עליו לאחסן את תמונת המצב המחושבת האחרונה ולהחזיר את אותה תמונת מצב כמו בפעם הקודמת אם הנתונים בחנות לא השתנו. האופן שבו אתה קובע אם הנתונים הניתנים לשינוי השתנו תלוי בחנות הניתנת לשינוי שלך.

---

### הפונקציה `subscribe` שלי נקראת לאחר כל עיבוד מחדש {/*my-subscribe-function-gets-called-after-every-re-render*/}

פונקציית `subscribe` זו מוגדרת *בתוך* רכיב ולכן היא שונה בכל עיבוד מחדש:

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Always a different function, so React will resubscribe on every re-render
  function subscribe() {
    // ...
  }

  // ...
}
```
  
React יירשם מחדש לחנות שלך אם תעביר פונקציית `subscribe` אחרת בין עיבוד מחדש. אם יש בעיות בביצועים של CAuse וברצונך להימנע מרישום מחדש, הזז את הפונקציה `subscribe` החוצה:

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
  // ...
}
```

לחלופין, עטוף את `subscribe` לתוך [`useCallback`](/reference/react/useCallback) כדי להירשם מחדש רק כאשר ארגומנט מסוים משתנה:

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```
