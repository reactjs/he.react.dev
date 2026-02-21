---
title: "אולי לא צריך השפעה"
---

<Intro>

אפקטים הם פתח מילוט מפרדיגמת React. הם מאפשרים לך "לצאת החוצה" של React ולסנכרן את הרכיבים שלך עם מערכת חיצונית כלשהי כמו ווידג'ט שאינו React, רשת או הדפדפן DOM. אם אין מערכת חיצונית מעורבת (לדוגמה, אם אתה רוצה לעדכן את state של רכיב כאשר props או state משתנים), אינך אמור להזדקק לאפקט. הסרת אפקטים מיותרים תהפוך את הקוד שלך לקל יותר לעקוב, מהר יותר להפעלה ונוטה פחות לשגיאות.

</Intro>

<YouWillLearn>

* מדוע וכיצד להסיר אפקטים מיותרים מהרכיבים שלך
* איך לשמר חישובים יקרים ללא אפקטים
* כיצד לאפס ולהתאים את הרכיב state ללא אפקטים
* איך לשתף לוגיקה בין מטפלי אירועים
* איזה לוגיקה צריך להעביר למטפלי אירועים
* כיצד להודיע לרכיבי הורה על שינויים

</YouWillLearn>

## כיצד להסיר אפקטים מיותרים {/*how-to-remove-unnecessary-effects*/}

ישנם שני מקרים נפוצים שבהם אתה לא צריך אפקטים:

* **אינך צריך אפקטים כדי להפוך נתונים לעיבוד.** לדוגמה, נניח שאתה רוצה לסנן רשימה לפני הצגתה. אולי תתפתו לכתוב אפקט שמעדכן משתנה state כשהרשימה משתנה. עם זאת, זה לא יעיל. כאשר אתה מעדכן את state, React יקרא תחילה לפונקציות הרכיבים שלך כדי לחשב מה צריך להיות על המסך. לאחר מכן React ["תחייב"](/learn/render-and-commit) את השינויים הללו ל-DOM, תוך עדכון המסך. לאחר מכן React יפעיל את האפקטים שלך. אם האפקט שלך *גם* מעדכן מיד את state, זה מפעיל מחדש את כל התהליך מאפס! כדי להימנע ממעברי רינדור מיותרים, שנה את כל הנתונים ברמה העליונה של הרכיבים שלך. הקוד הזה יופעל מחדש באופן אוטומטי בכל פעם ש-props או state ישתנו.
* **אינך צריך אפקטים כדי לטפל באירועי user.** לדוגמה, נניח שאתה רוצה לשלוח בקשת `/api/buy` POST ולהציג הודעה כאשר ה-user קונה מוצר. במטפל באירוע לחיצה על לחצן קנה, אתה יודע בדיוק מה קרה. עד שהאפקט רץ, אתה לא יודע *מה* ה-user עשה (לדוגמה, על איזה כפתור לחצו). זו הסיבה שבדרך כלל תטפל באירועי user במטפלי האירועים המתאימים.

אתה *דווקא* צריך אפקטים כדי [לסנכרן](/למד/לסנכרן-עם-אפקטים#מה-הם-אפקטים-ואיך-הם-שונים-מאירועים) עם מערכות חיצוניות. לדוגמה, אתה יכול לכתוב אפקט ששומר על יישומון jQuery מסונכרן עם ה-React state. אתה יכול גם להביא נתונים עם אפקטים: לדוגמה, אתה יכול לסנכרן את תוצאות החיפוש עם שאילתת החיפוש הנוכחית. זכור ש-[frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) מודרניות מספקות מנגנוני אחזור נתונים מובנים יעילים יותר מאשר כתיבת אפקטים ישירות ברכיבים שלך.

כדי לעזור לך להשיג את האינטואיציה הנכונה, בואו נסתכל על כמה דוגמאות קונקרטיות נפוצות!

### עדכון state מבוסס על props או state {/*updating-state-based-on-props-or-state*/}

נניח שיש לך רכיב עם שני משתני state: `firstName` ו-`lastName`. אתה רוצה לחשב מהם `fullName` על ידי שרשורם. יתרה מכך, תרצה ש-`fullName` יתעדכן בכל פעם ש-`firstName` או `lastName` ישתנו. האינסטינקט הראשון שלך עשוי להיות להוסיף משתנה `fullName` state ולעדכן אותו באפקט:

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

זה יותר מסובך ממה שצריך. זה גם לא יעיל: הוא מעביר רינדור שלם עם ערך מיושן עבור `fullName`, ואז מיד מעבד מחדש עם הערך המעודכן. הסר את המשתנה state ואת האפקט:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**כאשר ניתן לחשב משהו מה-props או state הקיימים, [אל תכניס אותו ל-state.](/learn/choosing-the-state-structure#avoid-redundant-state) במקום זאת, חשב את זה במהלך העיבוד.** (אתה מסיר קוד מסוים), ופחות נוטה לשגיאות (אתה נמנע מבאגים caused על ידי משתנים שונים של state שיוצאים מסונכרנים זה עם זה). אם הגישה הזו מרגישה לך חדשה, [Thinking in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) מסביר מה צריך להיכנס ל-state.

### אחסון חישובים יקרים {/*caching-expensive-calculations*/}

רכיב זה מחשב את `visibleTodos` על ידי לקיחת ה-`todos` שהוא מקבל על ידי props וסינונם לפי ה-`filter` מאפיין. אולי תתפתו לאחסן את התוצאה ב-state ולעדכן אותה מאפקט:

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

כמו בדוגמה הקודמת, זה גם מיותר וגם לא יעיל. ראשית, הסר את ה-state ואת האפקט:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

בדרך כלל, הקוד הזה בסדר! אבל אולי `getFilteredTodos()` איטי או שיש לך הרבה `todos`. במקרה כזה אינך רוצה לחשב מחדש את `getFilteredTodos()` אם משתנה state לא קשור כמו `newTodo` השתנה.

אתה יכול לשמור במטמון (או ["memoize"](https://en.wikipedia.org/wiki/Memoization)) חישוב יקר על ידי עטיפתו ב-[`useMemo`](/reference/react/useMemo) Hook:

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

או, כתוב כשורה אחת:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**זה אומר לReact שאתה לא רוצה שהפונקציה הפנימית תפעל מחדש אלא אם כן `todos` או `filter` השתנו.** React יזכור את ערך ההחזרה של `getFilteredTodos()` במהלך העיבוד הראשוני. במהלך העיבודים הבאים, הוא יבדוק אם `todos` או `filter` שונים. אם הם זהים לפעם הקודמת, `useMemo` יחזיר את התוצאה האחרונה שהוא מאוחסן. אבל אם הם שונים, React יקרא שוב לפונקציה הפנימית (ויאחסן את התוצאה שלה).

הפונקציה שאתה עוטף ב-[`useMemo`](/reference/react/useMemo) פועלת במהלך העיבוד, כך שזה עובד רק עבור [חישובים טהורים.](/learn/keeping-components-pure)

<DeepDive>

#### איך לדעת אם חישוב יקר? {/*how-to-tell-if-a-calculation-is-expensive*/}

באופן כללי, אלא אם כן אתה יוצר או עובר בלולאה על אלפי אובייקטים, זה כנראה לא יקר. אם אתה רוצה לקבל יותר ביטחון, אתה יכול להוסיף יומן מסוף כדי למדוד את הזמן המושקע בקטע קוד:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

בצע את האינטראקציה שאתה מודד (לדוגמה, הקלדה בקלט). לאחר מכן תראה יומנים כמו `filter array: 0.15ms` במסוף שלך. אם הזמן הכולל שנרשם מסתכם בכמות משמעותית (נניח, `1ms` או יותר), זה עשוי להיות הגיוני memoלשנות את החישוב הזה. כניסוי, לאחר מכן תוכל לעטוף את החישוב ב-`useMemo` כדי לוודא אם הזמן הכולל שנרשם ירד עבור האינטראקציה הזו או לא:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` לא יהפוך את העיבוד *הראשון* למהיר יותר. זה רק עוזר לך לדלג על עבודה מיותרת על עדכונים.

זכור שהמכשיר שלך כנראה מהיר יותר מה-users' שלך, אז מומלץ לבדוק את הביצועים עם האטה מלאכותית. לדוגמה, Chrome מציע אפשרות [מחסום CPU](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) עבור זה.

שימו לב גם שמדידת ביצועים בפיתוח לא תיתן לכם את התוצאות המדויקות ביותר. (לדוגמה, כאשר [מצב קפדני](/reference/react/StrictMode) פועל, תראה כל רכיב מעובד פעמיים ולא פעם אחת.) כדי לקבל את התזמונים המדויקים ביותר, בנה את האפליקציה שלך לייצור ובדוק אותה במכשיר כמו שיש ל-users שלך.

</DeepDive>

### איפוס כל state כאשר אבזר משתנה {/*resetting-all-state-when-a-prop-changes*/}

רכיב `ProfilePage` זה מקבל אבזר `userId`. הדף מכיל קלט הערה, ואתה use משתנה `comment` state כדי להחזיק את הערך שלו. יום אחד, אתה מבחין בבעיה: כשאתה מנווט מפרופיל אחד לאחר, ה-`comment` state לא מתאפס. כתוצאה מכך, קל לפרסם בטעות הערה בפרופיל שגוי של user. כדי לתקן את הבעיה, אתה רוצה לנקות את המשתנה `comment` state בכל פעם שה-`userId` משתנה:

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

זה לא יעיל כי use `ProfilePage` והילדים שלו יעבדו תחילה עם הערך המעופש, ואז יעבדו שוב. זה גם מסובך מכיוון שuse תצטרך לעשות זאת ב*כל* רכיב שיש לו כמה state בתוך `ProfilePage`. לדוגמה, אם ממשק המשתמש של ההערות מקונן, תרצה לנקות גם את ההערה המקוננת state.

במקום זאת, אתה יכול לומר ל-React שכל פרופיל של user הוא מושגי פרופיל _שונה_ על ידי מתן מפתח מפורש. פצל את הרכיב שלך לשניים והעבר תכונה `key` מהרכיב החיצוני אל הפנימי:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

בדרך כלל, React משמר את ה-state כאשר אותו רכיב מוצג באותו נקודה. **בהעברת `userId` בתור `key` לרכיב `Profile`, אתם מבקשים מReact להתייחס לשני רכיבי `Profile` עם `userId` שונים כשני רכיבים שונים שלא אמורים לחלוק אף state.** בכל פעם שהמפתח (אשר הגדרתם) __T __T משתנה ל-K____, יצור מחדש את DOM ו[יאפס את state](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) של רכיב `Profile` וכל ילדיו. כעת השדה `comment` יתבטל אוטומטית בעת ניווט בין פרופילים.

שימו לב שבדוגמה זו, רק הרכיב החיצוני `ProfilePage` מיוצא וגלוי לקבצים אחרים בפרויקט. רכיבים המציגים `ProfilePage` לא צריכים להעביר את המפתח אליו: הם מעבירים את `userId` כאביזר רגיל. העובדה `ProfilePage` מעביר אותו כ`key` לרכיב `Profile` הפנימי היא פרט יישום.

### התאמת כמה state כאשר אבזר משתנה {/*adjusting-some-state-when-a-prop-changes*/}

לפעמים, ייתכן שתרצה לאפס או להתאים חלק מה-state בשינוי אבזר, אבל לא את כולו.

רכיב `List` זה מקבל רשימה של `items` כאביזר, ושומר על הפריט הנבחר במשתנה `selection` state. אתה רוצה לאפס את `selection` ל-`null` בכל פעם שהאבזר `items` מקבל מערך אחר:

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

גם זה לא אידיאלי. בכל פעם שה-`items` משתנה, ה-`List` ורכיבי הצאצא שלו יעבדו בהתחלה עם ערך `selection` מיושן. לאחר מכן React יעדכן את ה-DOM ויפעיל את האפקטים. לבסוף, הקריאה `setSelection(null)` תעשה use עיבוד מחדש של ה-`List` ורכיבי הצאצא שלו, ותפעיל מחדש את כל התהליך הזה שוב.

התחל על ידי מחיקת האפקט. במקום זאת, התאם את ה-state ישירות במהלך העיבוד:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[אחסון מידע מעיבודים קודמים](/reference/react/useState#storing-information-from-previous-renders) כמו זה יכול להיות קשה להבנה, אבל זה עדיף מאשר לעדכן את אותו state באפקט. בדוגמה שלמעלה, `setSelection` נקרא ישירות במהלך עיבוד. React יעבד מחדש את ה-`List` *מיד* לאחר שיצא עם `return` statement. React עדיין לא עבד את הילדים `List` או עדכן את ה-DOM, אז זה מאפשר לילדים `List` לדלג על רינדור הערך `selection` המעופש.

כאשר אתה מעדכן רכיב במהלך העיבוד, React זורק את ה-JSX המוחזר ומיד מנסה לבצע עיבוד מחדש. כדי למנוע נסיונות חוזרים מדורגים איטיים מאוד, React מאפשר לך לעדכן רק את ה-state של *אותו* הרכיב במהלך רינדור. אם תעדכן את ה-state של רכיב אחר במהלך רינדור, תראה שגיאה. תנאי כמו `items !== prevItems` נחוץ כדי למנוע לולאות. אתה יכול להתאים את state כך, אבל כל תופעות לוואי אחרות (כמו שינוי ה-DOM או קביעת פסק זמן) צריכות להישאר במטפלי אירועים או אפקטים כדי [לשמור על רכיבים נקיים.](/learn/keeping-components-pure)

**למרות שתבנית זו יעילה יותר מאפקט, גם רוב הרכיבים לא צריכים להזדקק לו.** לא משנה איך תעשו זאת, התאמת state על בסיס props או state אחר הופכת את זרימת הנתונים שלכם לקשה יותר להבנה ולניפוי באגים. בדוק תמיד אם אתה יכול [לאפס את כל state עם מפתח](#resetting-all-state-when-a-prop-changes) או [לחשב הכל במהלך העיבוד](#updating-state-based-on-props-or-state) במקום זאת. לדוגמה, במקום לאחסן (ולאפס) את *פריט* שנבחר, ניתן לאחסן את *מזהה פריט:* שנבחר

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

כעת אין צורך "להתאים" את ה-state כלל. אם הפריט עם המזהה שנבחר נמצא ברשימה, הוא יישאר נבחר. אם לא, ה-`selection` שחושב במהלך העיבוד יהיה `null` מכיוון שלא נמצא פריט תואם. התנהגות זו שונה, אך ניתן לטעון כי עדיף כי use רוב השינויים ב-`items` משמרים את הבחירה.

### שיתוף היגיון בין מטפלי אירועים {/*sharing-logic-between-event-handlers*/}

נניח שיש לך דף מוצר עם שני כפתורים (קנייה ויציאה) ששניהם מאפשרים לך לקנות את המוצר הזה. אתה רוצה להציג התראה בכל פעם שה-user מכניס את המוצר לעגלת הקניות. הקריאה ל-`showNotification()` במטפלי הלחיצה של שני הלחצנים מרגישה חוזרת על עצמה ולכן ייתכן שתתפתו למקם את ההיגיון הזה באפקט:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

האפקט הזה מיותר. סביר להניח שזה גם יביא באגים ל-cause. לדוגמה, נניח שהאפליקציה שלך "זוכרת" את עגלת הקניות בין טעינת הדף מחדש. אם תוסיף מוצר לעגלת הקניות פעם אחת ותרענן את העמוד, ההודעה תופיע שוב. זה ימשיך להופיע בכל פעם שאתה מרענן את הדף של המוצר הזה. זה בגלל שuse `product.isInCart` כבר יהיה `true` בטעינת העמוד, כך שהאפקט שלמעלה יקרא `showNotification()`.

**כשאתה לא בטוח אם קוד מסוים צריך להיות ב-Effect או ב-event handler, שאל את עצמך *מדוע* הקוד הזה צריך לפעול. השתמש באפקטים רק עבור קוד שאמור להריץ *because* הרכיב הוצג ל-user.** בדוגמה זו, ההודעה צריכה להופיע בגלל שה-user *לחץ על הכפתור*, לא בגלל שהעמוד הוצג! מחק את האפקט והכנס את ההיגיון המשותף לפונקציה שנקראת משני מטפלי האירועים:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

זה גם מסיר את האפקט המיותר וגם מתקן את הבאג.

### שליחת בקשת POST {/*sending-a-post-request*/}

רכיב `Form` זה שולח שני סוגים של בקשות POST. הוא שולח אירוע ניתוח כאשר הוא עולה. כאשר אתה ממלא את הטופס ולחץ על כפתור שלח, זה ישלח בקשת POST לנקודת הקצה `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

בוא ניישם את אותם קריטריונים כמו בדוגמה שלפני.

בקשת ה-POST לניתוח צריכה להישאר באפקט. זוהי _הסיבה_ לשליחת אירוע הניתוח היא שהטופס הוצג. (זה יפעל פעמיים בפיתוח, אבל [ראה כאן](/learn/synchronizing-with-effects#sending-analytics) כיצד להתמודד עם זה.)

עם זאת, בקשת `/api/register` POST לא ניתנת ל-used על ידי _הצגה_ של הטופס. אתה רוצה לשלוח את הבקשה רק ברגע מסוים אחד בזמן: כאשר ה-user לוחץ על הכפתור. זה צריך לקרות רק _באינטראקציה הספציפית הזו_. מחק את האפקט השני והעבר את בקשת ה-POST למטפל באירועים:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

כשאתה בוחר אם להכניס קצת היגיון למטפל באירועים או לאפקט, השאלה העיקרית שאתה צריך לענות עליה היא _איזה סוג של היגיון_ זה מנקודת המבט של ה-user. אם ההיגיון הזה הוא caused על ידי אינטראקציה מסוימת, שמור אותו במטפל האירוע. אם זה caused על ידי user _רואה_ את הרכיב על המסך, שמור אותו באפקט.

### שרשראות חישובים {/*chains-of-computations*/}

לפעמים אתה עלול להתפתות לשרשר אפקטים שכל אחד מהם מתאים חלק של state על סמך state אחר:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

יש שתי בעיות עם הקוד הזה.

בעיה אחת היא שזה מאוד לא יעיל: הרכיב (וילדיו) צריכים לבצע רינדור מחדש בין כל קריאת `set` בשרשרת. בדוגמה שלמעלה, במקרה הגרוע ביותר (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) ישנם שלושה רינדורים מיותרים של העץ למטה.

גם אם זה לא היה איטי, ככל שהקוד שלך מתפתח, תיתקל במקרים שבהם ה"שרשרת" שכתבת לא מתאימה לדרישות החדשות. תאר לעצמך שאתה מוסיף דרך לעבור בהיסטוריה של מהלכי המשחק. תוכל לעשות זאת על ידי עדכון כל משתנה state לערך מהעבר. עם זאת, הגדרת `card` state לערך מהעבר תפעיל שוב את שרשרת האפקט ותשנה את הנתונים שאתה מציג. קוד כזה הוא לרוב נוקשה ושביר.

במקרה זה, עדיף לחשב מה אתה יכול במהלך העיבוד, ולהתאים את ה-state במטפל האירוע:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

זה הרבה יותר יעיל. כמו כן, אם תטמיעו דרך לצפות בהיסטוריית המשחקים, כעת תוכלו להגדיר כל משתנה state למעבר מהעבר מבלי להפעיל את שרשרת האפקט שמתאים כל ערך אחר. אם אתה צריך מחדש use לוגיקה בין מספר מטפלי אירועים, אתה יכול [לחלץ פונקציה](#sharing-logic-between-event-handlers) ולקרוא לה מאותם מטפלים.

זכור שבפנים מטפלים באירועים, [state מתנהג כמו תמונת מצב.](/learn/state-as-a-snapshot) לדוגמה, גם לאחר שתתקשר ל-`setRound(round + 1)`, המשתנה `round` ישקף את הערך בזמן שה-user לחץ על הכפתור. אם אתה צריך use את הערך הבא לחישובים, הגדר אותו באופן ידני כמו `const nextRound = round + 1`.

במקרים מסוימים, אתה *לא יכול* לחשב את ה-state הבא ישירות במטפל האירוע. לדוגמה, דמיינו טופס עם מספר תפריטים נפתחים שבו האפשרויות של התפריט הנפתח הבא תלויות בערך הנבחר של התפריט הנפתח הקודם. לאחר מכן, שרשרת אפקטים מתאימה כיuse אתה מסנכרן עם הרשת.

### אתחול האפליקציה {/*initializing-the-application*/}

לוגיקה מסוימת אמורה לפעול רק פעם אחת כשהאפליקציה נטענת.

אתה עלול להתפתות למקם אותו באפקט ברכיב ברמה העליונה:

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

עם זאת, תגלו מהר שהוא [פועל פעמיים בפיתוח.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) זה יכול לגרום לבעיותuse--לדוגמה, אולי זה מבטל את תוקף אסימון האימות מכיוון שuse תוכננה להיקרא twicet. באופן כללי, הרכיבים שלך צריכים להיות עמידים להרכבה מחדש. זה כולל את רכיב ה-`App` ברמה העליונה שלך.

למרות שייתכן שהוא לעולם לא יותקן מחדש בפועל בייצור, הקפדה על אותם אילוצים בכל הרכיבים מקלה על העברה וקוד מחדשuse. אם לוגיקה כלשהי חייבת לפעול *פעם אחת לכל טעינת אפליקציה* ולא *פעם אחת לכל רכיב הרכבה*, הוסף משתנה ברמה העליונה כדי לעקוב אחר האם הוא כבר הופעל:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

אתה יכול גם להפעיל אותו במהלך אתחול המודול ולפני שהאפליקציה מעבדת:

```js {1,5}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

קוד ברמה העליונה פועל פעם אחת כאשר הרכיב שלך מיובא - גם אם הוא לא בסופו של דבר יעובד. כדי למנוע האטה או התנהגות מפתיעה בעת ייבוא ​​רכיבים שרירותיים, אל תגזים עםuse דפוס זה. שמור על היגיון אתחול כלל האפליקציה למודולי רכיבי שורש כמו `App.js` או בנקודת הכניסה של האפליקציה שלך.

### הודעה לרכיבי אב על שינויים state {/*notifying-parent-components-about-state-changes*/}

נניח שאתה כותב רכיב `Toggle` עם `isOn` state פנימי שיכול להיות `true` או `false`. ישנן מספר דרכים שונות להחלפתו (על ידי לחיצה או גרירה). אתה רוצה להודיע ​​לרכיב האב בכל פעם שה-`Toggle` הפנימי state משתנה, אז אתה חושף אירוע `onChange` וקורא לו מאפקט:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

כמו קודם, זה לא אידיאלי. ה-`Toggle` מעדכן תחילה את ה-state שלו, ו-React מעדכן את המסך. ואז React מריץ את האפקט, שקורא לפונקציה `onChange` המועברת מרכיב אב. כעת רכיב האב יעדכן את state משלו, יתחיל מעבר רינדור נוסף. עדיף לעשות הכל במעבר אחד.

מחק את האפקט ובמקום זאת עדכן את ה-state של *שני* הרכיבים בתוך אותו מטפל באירועים:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

בגישה זו, גם רכיב `Toggle` וגם רכיב האב שלו מעדכנים את ה-state שלהם במהלך האירוע. React [עדכוני אצוות](/learn/queueing-a-series-of-state-updates) ממרכיבים שונים יחד, כך שיהיה רק ​​מעבר רינדור אחד.

ייתכן שתוכל גם להסיר את ה-state לגמרי, ובמקום זאת לקבל `isOn` מהרכיב האב:

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["הרמת state למעלה"](/learn/sharing-state-between-components) מאפשר לרכיב האב לשלוט באופן מלא על `Toggle` על ידי החלפת state של ההורה עצמו. זה אומר שרכיב האב יצטרך להכיל יותר היגיון, אבל יהיה פחות state בסך הכל לדאוג. בכל פעם שאתה מנסה לשמור שני משתנים שונים של state מסונכרנים, נסה להרים את state במקום זאת!

### העברת נתונים להורה {/*passing-data-to-the-parent*/}

רכיב `Child` זה מביא נתונים מסוימים ואז מעביר אותם לרכיב `Parent` באפקט:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

ב-React, נתונים זורמים ממרכיבי האב אל ילדיהם. כאשר אתה רואה משהו לא בסדר על המסך, אתה יכול לעקוב אחר מאיפה המידע מגיע על ידי עלייה בשרשרת הרכיבים עד שתמצא איזה רכיב עובר את הפרופס הלא נכון או בעל state שגוי. כאשר רכיבי צאצא מעדכנים את state של רכיבי האב שלהם ב- Effects, זרימת הנתונים הופכת קשה מאוד למעקב. מכיוון שגם הילד וגם ההורה זקוקים לאותם נתונים, תן לרכיב ההורה להביא את הנתונים האלה, ו*להעביר אותם* לילד במקום זאת:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

זה פשוט יותר ושומר על זרימת הנתונים צפויה: הנתונים זורמים מההורה לילד.

### הרשמה לחנות חיצונית {/*subscribing-to-an-external-store*/}

לפעמים, ייתכן שהרכיבים שלך יצטרכו להירשם לכמה נתונים מחוץ ל-React state. נתונים אלה יכולים להיות מספריית צד שלישי או מדפדפן מובנה API. מכיוון שהנתונים האלה יכולים להשתנות ללא ידיעתו של React, עליך להירשם אליהם באופן ידני לרכיבים שלך. זה נעשה לעתים קרובות עם אפקט, למשל:

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

כאן, הרכיב נרשם למאגר נתונים חיצוני (במקרה זה, הדפדפן `navigator.onLine` API). מכיוון שה-API הזה לא קיים בשרת (כך שהוא לא יכול להיות used עבור ה-HTML הראשוני), בתחילה ה-state מוגדר ל-`true`. בכל פעם שהערך של מאגר הנתונים הזה משתנה בדפדפן, הרכיב מעדכן את ה-state שלו.

למרות שזה נפוץ ל-use אפקטים בשביל זה, ל-React יש Hook ייעודי להרשמה לחנות חיצונית שמועדפת במקום זאת. מחק את האפקט והחלף אותו בקריאה אל [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

גישה זו מועדת פחות לשגיאות מסנכרון ידני של נתונים הניתנים לשינוי ל-React state עם אפקט. בדרך כלל, תכתוב Hook מותאם אישית כמו `useOnlineStatus()` לעיל, כך שלא תצטרך לחזור על קוד זה ברכיבים הבודדים. [קרא עוד על הרשמה לחנויות חיצוניות מרכיבי React.](/reference/react/useSyncExternalStore)

### מביא נתונים {/*fetching-data*/}

יישומים רבים use אפקטים להתחלה של אחזור נתונים. זה די נפוץ לכתוב אפקט של איסוף נתונים כמו זה:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

אתה *לא* צריך להעביר את האחזור הזה למטפל באירועים.

זה עשוי להיראות כמו סתירה עם הדוגמאות הקודמות שבהן היית צריך להכניס את ההיגיון למטפלי האירועים! עם זאת, קחו בחשבון שלא *אירוע ההקלדה* הוא הסיבה העיקרית לשליפה. לעתים קרובות קלט חיפוש מאוכלס מראש מכתובת האתר, וה-user עשוי לנווט אחורה וקדימה מבלי לגעת בקלט.

זה לא משנה מאיפה מגיעים `page` ו`query`. בזמן שרכיב זה גלוי, אתה רוצה לשמור את `results` [מסונכרן](/learn/synchronizing-with-effects) עם נתונים מהרשת עבור `page` ו`query` הנוכחיים. זו הסיבה שזה אפקט.

עם זאת, בקוד למעלה יש באג. תאר לעצמך שאתה מקליד `"hello"` מהר. אז ה-`query` ישתנה מ-`"h"`, ל-`"he"`, `"hel"`, `"hell"` ו-`"hello"`. זה יפעיל שליפות נפרדות, אבל אין ערובה לגבי הסדר שבו יגיעו התגובות. לדוגמה, תגובת `"hell"` עשויה להגיע *אחרי* תגובת `"hello"`. מכיוון שהוא יקרא `setResults()` אחרון, אתה תציג את תוצאות החיפוש השגויות. זה נקרא ["תנאי מירוץ"](https://en.wikipedia.org/wiki/Race_condition): שתי בקשות שונות "התרוצצו" זו מול זו והגיעו בסדר שונה ממה שציפית.

**כדי לתקן את מצב המירוץ, עליך [הוסף פונקציית ניקוי](/learn/synchronizing-with-effects#fetching-data) כדי להתעלם מתגובות מעופשות:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

זה מבטיח שכאשר האפקט שלך מביא נתונים, כל התגובות פרט לזו המבוקשת האחרונה יתעלמו.

טיפול בתנאי מירוץ אינו הקושי היחיד ביישום אחזור נתונים. כדאי גם לחשוב על שמירה במטמון (כדי שה-user יוכל ללחוץ על 'הקודם' ולראות את המסך הקודם באופן מיידי), כיצד להביא נתונים בשרת (כדי שהשרת המעובד HTML יכיל את התוכן שאוחזר במקום ספינר), וכיצד להימנע ממפלי רשת (כדי שילד יוכל להביא נתונים מבלי לחכות לכל הורה).

**בעיות אלה חלות על כל ספריית ממשק משתמש, לא רק React. הפתרון שלהם אינו טריוויאלי, וזו הסיבה שה[frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) מודרניות מספקות מנגנוני אחזור נתונים מובנים יעילים יותר מאשר שליפת נתונים באפקטים.**

אם אינך use מסגרת (ואינך רוצה לבנות משלך) אבל תרצה להפוך את שליפת הנתונים מ- Effects ליותר ארגונומית, שקול לחלץ את היגיון האחזור שלך לתוך Hook מותאם אישית כמו בדוגמה זו:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
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
  }, [url]);
  return data;
}
```

סביר להניח שתרצה להוסיף קצת היגיון לטיפול בשגיאות וכדי לעקוב אם התוכן נטען. אתה יכול לבנות Hook כזה בעצמך או use אחד מהפתרונות הרבים שכבר זמינים במערכת האקולוגית React. **למרות שזה לבדו לא יהיה יעיל כמו שימוש במנגנון אחזור נתונים מובנה של מסגרת, העברת לוגיקה של אחזור הנתונים לתוך Hook מותאמת אישית תקל על אימוץ אסטרטגיית אחזור נתונים יעילה מאוחר יותר.**

באופן כללי, בכל פעם שאתה צריך לנקוט בכתיבת אפקטים, שים לב מתי אתה יכול לחלץ חלק של פונקציונליות לתוך Hook מותאם אישית עם API הצהרתי ומיועד יותר כמו `useData` לעיל. ככל שיש לך פחות קריאות `useEffect` גולמיות ברכיבים שלך, כך יהיה לך קל יותר לתחזק את היישום שלך.

<Recap>

- אם אתה יכול לחשב משהו במהלך העיבוד, אתה לא צריך אפקט.
- כדי לשמור חישובים יקרים במטמון, הוסף `useMemo` במקום `useEffect`.
- כדי לאפס את state של עץ רכיב שלם, העבירו אליו `key` אחר.
- כדי לאפס קטע מסוים של state בתגובה לשינוי אבזר, הגדר אותו במהלך העיבוד.
- קוד שרץ because רכיב הוצג * צריך להיות ב- Effects, השאר צריך להיות באירועים.
- אם אתה צריך לעדכן את state של מספר רכיבים, עדיף לעשות זאת במהלך אירוע בודד.
- בכל פעם שאתה מנסה לסנכרן משתני state ברכיבים שונים, שקול להרים את state למעלה.
- אתה יכול להביא נתונים עם Effects, אבל אתה צריך ליישם ניקוי כדי להימנע מתנאי מירוץ.

</Recap>

<Challenges>

#### שינוי נתונים ללא אפקטים {/*transform-data-without-effects*/}

ה-`TodoList` למטה מציג רשימה של מטלות. כאשר תיבת הסימון "הצג פעולות פעילות בלבד" מסומנת, מטלות שהושלמו לא יוצגו ברשימה. לא משנה אילו מטלות גלויות, הכותרת התחתונה מציגה את ספירת הפעולות שעדיין לא הושלמו.

פשט את הרכיב הזה על ידי הסרת כל ה-state והאפקטים המיותרים.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

אם אתה יכול לחשב משהו במהלך העיבוד, אתה לא צריך state או אפקט שמעדכן אותו.

</Hint>

<Solution>

יש רק שני חלקים חיוניים של state בדוגמה זו: הרשימה של `todos` והמשתנה `showActive` state המייצג אם תיבת הסימון מסומנת. כל המשתנים האחרים state הם [מיותרים](/learn/choosing-the-state-structure#avoid-redundant-state) וניתן לחשב אותם במהלך העיבוד במקום זאת. זה כולל את `footer` שתוכלו להעביר ישירות אל JSX שמסביב.

התוצאה שלך אמורה להיראות כך:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### שמור חישוב ללא אפקטים {/*cache-a-calculation-without-effects*/}

בדוגמה זו, סינון ה-todos חולץ לפונקציה נפרדת בשם `getVisibleTodos()`. פונקציה זו מכילה קריאה `console.log()` בתוכה שעוזרת לך לשים לב מתי היא נקראת. החלף את "הצג רק פעולות פעילות" ושם לב שזה יכול uses `getVisibleTodos()` להפעיל מחדש. זה צפוי מכיוון שuse פעולות גלויות משתנות כאשר אתה מחליף אילו מהם להציג.

המשימה שלך היא להסיר את האפקט שמחשב מחדש את רשימת `visibleTodos` ברכיב `TodoList`. עם זאת, עליך לוודא ש-`getVisibleTodos()` *לא* פועל מחדש (ולכן לא מדפיס יומנים כלשהם) כשאתה מקליד בקלט.

<Hint>

פתרון אחד הוא להוסיף קריאה `useMemo` כדי לשמור במטמון את המשימות הגלויות. יש גם פתרון אחר, פחות ברור.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

הסר את המשתנה state ואת האפקט, ובמקום זאת הוסף קריאה `useMemo` כדי לשמור במטמון את התוצאה של הקריאה `getVisibleTodos()`:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

עם שינוי זה, `getVisibleTodos()` ייקרא רק אם `todos` או `showActive` ישתנו. הקלדה בקלט משנה רק את המשתנה `text` state, כך שהיא לא מפעילה קריאה ל-`getVisibleTodos()`.

יש גם פתרון אחר שלא צריך `useMemo`. מכיוון שהמשתנה `text` state לא יכול להשפיע על רשימת המשימות, אתה יכול לחלץ את הטופס `NewTodo` לרכיב נפרד, ולהזיז את המשתנה `text` state בתוכו:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

גישה זו עונה גם על הדרישות. כאשר אתה מקליד בקלט, רק המשתנה `text` state מתעדכן. מכיוון שהמשתנה `text` state נמצא ברכיב הבן `NewTodo`, רכיב האב `TodoList` לא יעובד מחדש. זו הסיבה ש-`getVisibleTodos()` לא מתקשר כשאתה מקליד. (זה עדיין ייקרא אם ה-`TodoList` יוצג מחדש מסיבה אחרת.)

</Solution>

#### איפוס state ללא אפקטים {/*reset-state-without-effects*/}

רכיב `EditContact` זה מקבל אובייקט איש קשר בצורת `{ id, name, email }` בתור `savedContact` אבזר. נסה לערוך את שדות הקלט של השם והאימייל. כאשר אתה לוחץ על שמור, כפתור איש הקשר מעל הטופס מתעדכן לשם הערוך. כאשר אתה לוחץ על איפוס, כל השינויים הממתינים בטופס נמחקים. שחק עם ממשק המשתמש הזה כדי לקבל תחושה לגביו.

כאשר אתה בוחר איש קשר עם הכפתורים בחלק העליון, הטופס מתאפס כדי לשקף את פרטי איש הקשר. זה נעשה עם אפקט בתוך `EditContact.js`. הסר את האפקט הזה. מצא דרך אחרת לאפס את הטופס כאשר `savedContact.id` משתנה.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

זה יהיה נחמד אם הייתה דרך לומר ל-React שכאשר `savedContact.id` שונה, הטופס `EditContact` הוא מבחינה רעיונית _טופס איש קשר אחר_ ולא אמור לשמר את state. האם אתה זוכר דרך כזו?

</Hint>

<Solution>

פצל את רכיב `EditContact` לשניים. העבר את כל הטופס state לרכיב `EditForm` הפנימי. ייצא את רכיב `EditContact` החיצוני, וגרם לו להעביר את `savedContact.id` בתור `key` לרכיב `EditForm` הפנימי. כתוצאה מכך, הרכיב `EditForm` הפנימי מאפס את כל הטופס state ויוצר מחדש את ה-DOM בכל פעם שאתה בוחר איש קשר אחר.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### שלח טופס ללא אפקטים {/*submit-a-form-without-effects*/}

רכיב `Form` זה מאפשר לך לשלוח הודעה לחבר. כאשר אתה שולח את הטופס, המשתנה `showForm` state מוגדר ל-`false`. זה מפעיל אפקט הקורא `sendMessage(message)`, אשר שולח את ההודעה (תוכל לראות אותה במסוף). לאחר שליחת ההודעה, אתה רואה תיבת דו-שיח "תודה" עם כפתור "פתח צ'אט" המאפשר לך לחזור לטופס.

users של האפליקציה שלך שולחים יותר מדי הודעות. כדי להקשות מעט יותר על הצ'אט, החלטת להציג את תיבת הדו-שיח "תודה" *תחילה* ולא את הטופס. שנה את המשתנה `showForm` state לאתחל ל-`false` במקום `true`. ברגע שתבצע את השינוי הזה, המסוף יראה שנשלחה הודעה ריקה. משהו בהיגיון הזה לא בסדר!

מה השורש cause של בעיה זו? ואיך אפשר לתקן את זה?

<Hint>

האם יש לשלוח את ההודעה _because_ ה-user ראה את תיבת הדו-שיח "תודה"? או שזה הפוך?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

המשתנה `showForm` state קובע אם להציג את הטופס או את תיבת הדו-שיח "תודה". עם זאת, אתה לא שולח את ההודעה כי _הוצגה_ תיבת הדו-שיח "תודה" use. אתה רוצה לשלוח את ההודעה כי user _שלח את הטופס._ מחק את האפקט המטעה והעבר את הקריאה `sendMessage` לתוך מטפל האירועים `handleSubmit`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

שימו לב כיצד בגרסה זו, רק _שליחת הטופס_ (שהוא אירוע) גורמת להודעה שתישלח. זה עובד באותה מידה ללא קשר לשאלה אם `showForm` מוגדר בהתחלה ל-`true` או `false`. (הגדר אותו ל-`false` ולא שים לב להודעות מסוף נוספות.)

</Solution>

</Challenges>

