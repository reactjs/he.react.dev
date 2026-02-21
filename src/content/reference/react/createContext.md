---
title: "ליצור הקשר"
---

<Intro>

`createContext` מאפשרת ליצור [הקשר](/learn/passing-data-deeply-with-context) שקומפונטות יכול לספק או לקרוא.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

קראו ל-`createContext` מחוץ לכל קומפוננטה כדי ליצור הקשר.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `defaultValue`: הערך שתרצו של-הקשר יהיה כשאין ספק ההקשר תואם בעץ מעל הקומפוננטה שקוראת את ההקשר. אם אין לכם ערך ברירת מחדל משמעותי, ציינו `null`. ערך ברירת המחדל מיועד כ-fallback של "מוצא אחרון". הוא סטטי ולעולם לא משתנה לאורך הזמן.

#### מחזירה {/*returns*/}

`createContext` מחזירה אובייקט הקשר.

**מעצם-הקשר עצמו לא מידע.** הוא מכוון *איזה* הקשר קומפונטות אחרות קוראות או מספקות. בדרך כלל תשתמשו ב-[`SomeContext.Provider`](#provider) בקומפוננטות למעלה כדי לציין את ערך ההקשר, ותקראו ל-[`useContext(SomeContext)`](/reference/react/useContext) בקומפוננטות למטה כדי לקרוא אותו. לאובייקט ה-context יש כמה מאפיינים:

* `SomeContext.Provider` לאפשר את ערך ה-context לקומפוננטות.
* `SomeContext.Consumer` הוא דרך חלופית ודירה לקרוא את ערך ההקשר.

---

### `SomeContext.Provider` {/*provider*/}

עטפו את הקומפוננטות שלכם בספק ההקשר כדי לציין את ערך ההקשר הזה לכל הקומפוננטות בתוכו:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### אבזרים {/*provider-props*/}

* `value`: הערך שברצונכם להעביר לכל הקומפוננטות שקוראות את ההקשר הזה בתוך ה-provider הזה, לא משנה כמה עמוק. ערך ההקשר יכול להיות מכל סוג. קומפונטה שקוראת ל-[`useContext(SomeContext)`](/reference/react/useContext) בתוך ה-provider תקבל את ה-`value` של ספק ההקשר התואם הכי פנימי שמעליה.

---

### `SomeContext.Consumer` {/*consumer*/}

לפני ש-`useContext` קיימת, הייתה דרך ישנה יותר לקרוא את ההקשר:

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

למרות שהדרך הישנה הזו עדיין עובדת, **קוד חדש צריך לקרוא את ההקשר בעזרת [`useContext()`](/reference/react/useContext) במקום:**

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### אבזרים {/*consumer-props*/}

* `children`: פונקציה. React תקרא לפונקציה שתעבירו עם ערך ה-context הנוכחי שנקבע על ידי אותו אלגוריתם שבו משתמשת [`useContext()`](/reference/react/useContext), ותרנדר את התוצאה שתחזירו מהפונקציה הזו. React גם תריץ את הפונקציה הזו שוב ותעדכן את ה-UI בכל פעם שה-context מהקומפונטות ההורה משתנה.

---

## שימוש {/*usage*/}

### יצירת הקשר {/*creating-context*/}

הקשר יכול לקומפוננטות [להעביר מידע עמוק יותר בעץ](/learn/passing-data-deeply-with-context) בלי להעביר props במפורש.

קראו ל-`createContext` מחוץ לכל קומפוננטה כדי ליצור הקשר אחד או יותר.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` מחזירה <CodeStep step={1}>אובייקט הקשר</CodeStep>. קומפוננטות יכול לקרוא את ההקשר על ידי העברתו ל-[`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

כברירת מחדל, הערכים שהן יקבלו יהיו <CodeStep step={3}>ערכי ברירת המחדל</CodeStep> שציינתם בעת יצירת ה-context. אבל בפני עצמו זה לא שימושי, כי ערכי ברירת המחדל לעולם לא משתנים.

ההקשר שימושי כי אפשר **לספק ערכים אחרים, דינמיים, מתוך הקומפוננטות שלכם:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

עכשיו קומפוננטת `Page` וכל קומפוננטה בתוכה, לא משנה כמה עמוק, "יראו" את ערכי ההקשר שהוא עבר. אם ערכי ההקשר משתנים, React תרנדר מחדש גם את הקומפוננטות שקוראות את ההקשר.

[קראו עוד על קריאה וסיפוק הקשר וראו דוגמאות.](/reference/react/useContext)

---

### ייבוא ​​וייצוא הקשר מקובץ {/*importing-and-exporting-context-from-a-file*/}

לעתים קרובות קומפונטות בקבצים שונים צריכות גישה לאותו הקשר. אז מקובל להצהיר על הקשרים בקובץ נפרד. לאחר מכן אפשר להשתמש ב-[`export` statement](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) כדי להפוך את ההקשר לזמין לקבצים אחרים:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

קומפונטות שמוצהרות בקבצים אחרים יכולים להשתמש ב-[`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) כדי לקרוא או לספק את ההקשר הזה:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

זה עובד בדומה ל-[ייבוא ​​וייצוא קומפונטות.](/learn/importing-and-exporting-components)

---

## פתרון תקלות {/*troubleshooting*/}

### אני לא מוצא דרך לשנות את ערך ה-context {/*i-cant-find-a-way-to-change-the-context-value*/}


קוד כזה מפרט את ערך ההקשר *ברירת המחדל*:

```js
const ThemeContext = createContext('light');
```

הערך הזה לעולם לא מתרוצץ. React משתמשת בו רק כ-fallback אם היא לא מוצאת ספק תואם מעל.

כדי לגרום ל-context להשתנות לאורך הזמן, [הוסיפו state ועטפו קומפונטות ב-context provider.](/reference/react/useContext#updating-data-passed-via-context)
