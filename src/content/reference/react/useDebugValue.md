---
title: "useDebugValue"
---

<Intro>

`useDebugValue` הוא React Hook שמאפשר להוסיף תווית ל-custom Hook בתוך [React DevTools.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

קראו ל-`useDebugValue` ברמה העליונה של [custom Hook](/learn/reusing-logic-with-custom-hooks) כדי להציע ערך דיבוג קריא:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `value`: הערך רוצה להציג ב-React DevTools. יכול להיות מכל סוג.
* **אופציונלי** `format`: פונקציית עיצוב. כשבודקים את הקומפוננטה, React DevTools תקרא לפונקציית העיצוב עם `value` כארגומנט, ואז תציג את הערך המעוצב שהוא חזר (שגם הוא יכול להיות מכל סוג). אם לא מציינים פונקציית עיצוב, יוצג הערך המקורי `value`.

#### מחזירה {/*returns*/}

`useDebugValue` לא מחזירה דבר.

## שימוש {/*usage*/}

### הוספת תווית ל-custom Hook {/*adding-a-label-to-a-custom-hook*/}

קראו ל-`useDebugValue` ברמה העליונה של [custom Hook](/learn/reusing-logic-with-custom-hooks) כדי להציע <CodeStep step={1}>ערך דיבוג</CodeStep> קריא עבור [React DevTools.](/learn/-react-de)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

כך קומפוננטות שקוראות ל-`useOnlineStatus` יקבלו תווית כמו `OnlineStatus: "Online"` כשבודקים אותם:

![צילום מסך של React DevTools המציג את ערך ניפוי הבאגים](/images/docs/react-devtools-usedebugvalue.png)

בלי הקריאה ל-`useDebugValue`, יוצגו רק את הבסיסיים (בדוגמה הזאת, `true`).

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

אל תוסיפו ערכי דיבוג לכל מותאם אישית Hook. זה הכי שימושי עבור מותאם אישית Hooks חלק מספריות משותפות ושיש להם מבנה מבנה פנימי מורכב שקשה לבדוק.

</Note>

---

### דחיית עיצוב של ערך דיבוג {/*deferring-formatting-of-a-debug-value*/}

אפשר גם להעביר פונקציית עיצוב כארגומנט שני ל-`useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

פונקציית העיצוב תקבל את <CodeStep step={1}>ערך הדיבוג</CodeStep> כפרמטר וצריכה להחזיר <CodeStep step={2}>ערך תצוגה מעוצב</CodeStep>. כשבודקים את הקומפוננטה, React DevTools תקרא לפונקציה הזו ותציג את התוצאה.

כך אפשר מהרצת לוגיקת עיצוב יקרה אלא אם הקומפוננטה באמת נבדקת. לדוגמה, אם `date` הוא ערך סוג Date, זה מונע קריאה ל-`toDateString()` בכל רינדור.
