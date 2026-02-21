---
title: "הסרת תלויות של אפקט"
---

<Intro>

כאשר אתה כותב אפקט, ה-linter יוודא שכללת כל ערך תגובתי (כמו props וstate) שהאפקט קורא ברשימת התלות של האפקט שלך. זה מבטיח שהאפקט שלך יישאר מסונכרן עם הprops וstate העדכניים ביותר של הרכיב שלך. תלות מיותרות עלולה לגרום לאפקט שלך לפעול בזמן, או אפילו ליצור לולאה אינסופית. עקוב אחר המדריך הזה כדי לאפשר לך להתחבר מהאפקטים שלך.

</Intro>

<YouWillLearn>

- כיצד לתקן לולאות תלות אינסופיות של אפקט
- מה לעשות כשרוצים להסיר תלות
- כיצד לקרוא ערך מהאפקט שלך מבלי "להגיב" אליו
- כיצד ומדוע להימנע מתלות באובייקט ובתפקוד
- מדוע דיכוי של קו התלות הוא מסוכן, ומה לעשות במקום זאת

</YouWillLearn>

## תלויות צריכות להתאים לקוד {/*dependencies-should-match-the-code*/}

אתה כותב אפקט, אתה מציין תחילה כיצד [להתחיל ולהפסיק](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) כל מה שאתה רוצה שהאפקט שלך יעשה:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

לאחר, אם תשאיר את התלות של אפקט ריקות (`[]`), ה-linter יציע את התלות הנכונות:

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
  }, []); // <-- Fix the mistake here!
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

מלא לפי מה שכתוב ב-linter:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[אפקטים "מגיבים" לערכים תגובתיים.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) כאשר ש-'roomId' הוא ערך תגובתי (הוא יכול להשתנות עקב עיבוד מחדש), ה-linter מאמת שציינת אותו כתלות. אם 'roomId' יקבל ערך שונה, תגיב יסנכרן מחדש את האפקט שלך. זה מבטיח שהצ'אט יישאר מחובר לחדר שנבחר ו"מגיב" לתפריט הנפתח:

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

### כדי להשלים תלות, הוכח זה לא תלות {/*to-remove-a-dependency-prove-that-its-not-a-dependence*/}

שימו לב שאינכם יכולים "לבחור" את התלות של האפקט. כל <CodeStep step={2}>ערך תגובתי</CodeStep> המשמש את הקוד של האפקט שלך חייב להיות מוצהר ברשימת התלות שלך. רשימת התלות לפי הקוד שמסביב:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[ערכים תגובתיים](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) מספקים props וכל המשתנים והפונקציות המוצהרות עצמאיות בתוך הרכיב שלך. זה ש-'roomId' הוא ערך תגובתי, אינך יכול להוציא אותו מרשימת התת. ה-Linter לא יאפשר זאת:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

והלינטר יהיה נכון! מה ש-'roomId' עשוי להשתנות עם הזמן, זה יציג באג בקוד שלך.

**כדי שלך להשלים תלות, "הוכח" ל-linter שהיא *לא צריכה* להיות תלות.** למשל, אתה יכול להעביר את 'roomId' מה רכיב כדי להוכיח שהוא לא תגובתי ולא ישתנה בעיבוד מחדש:

```js {2,9}
const serverUrl = 'https://localhost:1234';
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

עכשיו, כאשר `roomId` אינו ערך תגובתי (ולא יכול להשתנות בעיבוד), זה לא צריך להיות תלות:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

זה מה יכול שאתה לציין רשימת תלות [ריקה (`[]`).](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) האפקט שלך *באמת לא* תלוי בשום ערך תגובתי יותר, אז הוא *בלא* כאשר_ צריך להפעיל את הstateK כל2.

### כדי לשנות את התלות, שנה את הקוד {/*to-change-the-dependencies-change-the-code*/}

אולי שמת לב לדפוס בזרימת העבודה שלך:

1. ראשית, אתה **שנה את הקוד** של האפקט שלך או איך הערכים התגובתיים שלך מוצהרים.
2. לאחר מכן, אתה עוקב אחר ה-linter ומתאים את התלות כדי **להתאים לקוד ששינית.**
3. אם אינך מרוצה מרשימת התלות, אתה **חוזר לשלב הראשון** (ושנה שוב את הקוד).

החלק האחרון חשוב. **אראם ברצונך לשנות את התלות, שנה תחילה את הקוד שמסביב.** אתה יכול לחשוב על רשימת התלות כעל [רשימה של כל הערכים התגובתיים המשמשים את הקוד של האפקט שלך.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specificated-every-reactive הרשימה *a-reactive-a-value-reactive* שלך. כדי לשנות את רשימת התלות, שנה את הקוד.

זה עשוי להרגיש כמו לפתור משוואה. ייתכן שתתחיל עם יעד (לדוגמה, כדי להסיר תלות), ואתה צריך "למצוא" את הקוד התואם למטרה זו. לא לכולם פתרון משוואות כיף, וניתן לומר אותו דבר על כתיבת אפקטים! למרבה המזל, יש רשימה של מתכונים נפוצים שתוכלו לנסות למטה.

<Pitfall>

אם יש לך בסיס קוד קיים, אולי יהיו לך כמה אפקטים שמדכאים את ה-linter כך:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**כאשר התלות אינן תואמות לקוד, יש סיכון גבוה מאוד להחדרת באגים.** על ידי דיכוי ה-linter, אתה "משקר" כדי להגיב לגבי הערכים שהאפקט שלך תלוי בהם.

במקום זאת, השתמש בטכניקות שלהלן.

</Pitfall>

<DeepDive>

#### מדוע דיכוי קו התלות כל כך מסוכן? {/*למה-מדכא-דיכוי-התלות-לבנת-כל-כך-מסוכן*/}

דיכוי ה-linter מוביל לבאגים מאוד לא אינטואיטיביים שקשה למצוא ולתקן. הנה דוגמה אחת:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

נניח שרצית להפעיל את האפקט "רק על הר". קראת ש-[ריקות (`[]`) תלויות](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) עושות את זה, אז החלטתי להתעלם מה-linter, וציינת בכוח `[]` לפי התלות.

המונה הזה היה אמור לעלות כל שנייה בכמות לאפשר להגדיר עם שני הכפתורים. עם זאת, השתמש ב"שיקרת" ל-React שהאפקט הזה לא תלוי בשום דבר, תגיב לנצח ממשיך בפעולה 'onTick' מהרינדור הראשוני. [במהלך העיבוד הזה,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `ספירה` הייתה `0` ו`increment` הייתה `1`. זה מה ש'onTick' זה תמיד קורא ל'setCount(0 + 1)' כל שנייה, ואתה תמיד רואה '1'. קשה יותר לתקן באגים כאלה כשהם מרוזרים על מספר רכיבים.

תמיד יש פתרון טוב יותר מאשר התעלמות מהלינטר! כדי לתקן את הקוד הזה, עליך להוסיף 'onTick' לרשימת התלות. (כדי בכלל שהמרווח מוגדר פעם אחת בלבד, [הפוך את 'onTick' לאירוע אפקט.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**אנו ממליצים להתייחס לשגיאת מוך התלות כשגיאת קומפילציה. אם לא תדחיק את זה, לעולם לא תראה באגים כאלה.** שאר העמוד הזה מתעד את החלופות למקרים זה ואחרים.

</DeepDive>

## הסרת תלות מיותרת {/*הסרת-תלות-מיותרת*/}

בכל פעם שאתה מכוון את התלות של האפקט כדי לשקף את הקוד, עיין ברשימת התלות. האם הגיוני שהאפקט יפעל מחדש כאשר אחת מהתלות הללו משתנה? לפעמים התשובה היא "לא":

* אולי תרצה לבצע מחדש *חלקים שונים* מהאפקט שלך בתנאים שונים.
* אולי תרצה לקרוא רק את *הערך האחרון* של תלות כלשהי במקום "להגיב" לשינויים שלה.
* תלות עשויה להשתנות לעתים קרובות מדי *לא בכוונה* מכיוון שהיא אובייקט או פונקציה.

כדי למצוא את הפתרון הנכון, תצטרך לענות על כמה שאלות לגבי האפקט שלך. בואו נעבור דרכם.

### האם הקוד הזה צריך לעבור למטפל באירועים? {/*הקוד-הזה-צריך-לעבור-ל-an-event-handler*/}

הדבר הראשון שאתה צריך לחשוב עליו הוא האם הקוד הזה צריך להיות אפקט בכלל.

דמיינו צורה. בזמן השליחה, אתה מגדיר את הstate 'נשלח' ל-'true'. עליך לשלוח בקשת POST ולהציג הודעה. שמת את ההיגיון הזה בתוך אפקט ש"מגיב" בגלל ש'נשלח' הוא 'נכון':

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

מאוחר יותר, תרצה לעצב את הדעת ההתראה לנושא הנוכחי, כך שתקרא את הנושא הנוכחי. מה ש'theme' מוצהר בגוף הרכיב, זה ערך תגובתי, אז אתה מוסיף אותו כתלות:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

על ידי כך, הצגת באג. תארו לעצמכם שאתם שולחים את הטופס תחילה ואז עוברים בין ערכות נושא כהות לבהירות. 'הנושא' ישתנה, האפקט יפעל מחדש, וכך הוא יציג שוב את אותה הודעה!

**הבעיה כאן היא שזה לא אמור להיות אפקט מלכתחילה.** אתה רוצה לפרסם את בקשת ה-POST הזו ולהציג את ההודעה בת תגובה ל*שליחת הטופס,* שהיא אינטראקציה מסוימת. כדי להריץ נקודה בתגובה לאינטראקציה, הכנס את ההיגיון הזה למטפל המתאים:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

עכשיו, הוא נמצא באירוע, הוא אינו תגובתי - כך שהוא יפעל רק כאשר ישלח את הטופס. קרא עוד על [בחירה בין רופאי אירועים לאפקטים](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) ו[איך למחוק אפקטים מיותרים.](/learn/you-might-not-need-an-effect)

### האם האפקט שלך עושה כמה דברים לא קשורים? {/*האם-האפקט-שלך-עושה-כמה-לא-קשורים-דברים*/}

השאלה הבאה שאתה צריך לשאול את עצמך היא האם האפקט שלך עושה כמה דברים לא קשורים.

אתה צריך לבחור את העיר והאזור שלו. אתה מביא את רשימת ה'ערים' מהשרת לפי ה'state' בחרה כדי להציג אותם בתפריט נפתח:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ All dependencies declared

  // ...
```

זו דוגמה טובה של [משיפת נתונים באפקט.](/learn/you-might-not-need-an-effect#fetching-data) אתה מסנכרן את מצב ה'ערים' עם הרשת לפי ה-country prop. אתה לא יכול לעשות זאת בטיפול באירוע כי אתה צריך לשלוף ברגע ש'ShippingForm' מוצג בכל פעם ש'הstate' משתנה (לא משנה איזו אינטראקציה גורמת לזה).

כעת נניח שאתה מוסיף תיבת בחירה שנייה עבור אזורי ערים, שאמורה להביא את ה'אזורים' עבור ה'עיר' שנבחרה כעת. אתה יכול להתחיל בהוספת קריאת 'אחזור' שנייה עבור רשימת האזורים בתוך אותו אפקט:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

עם זאת, מה שהאפקט משתמש עכשיו בstate 'עיר' היית צריך להוסיף 'עיר' לרשימת התלות. זה, בתורו, הציג בעיה: כאשר המשתמש בוחר עיר אחרת, האפקט יפעל מחדש ויקרא 'fetchCities(country)'. כתוצאה מכך, תחזרו ללא רשימת הערים פעמים רבות.

**הבעיה עם הקוד הזה היא שאתה מסנכרן שני דברים שונים שאינם קשורים:**

1. אתה רוצה לסנכרן את מצב 'ערים' לרשת בהתבס על מאפיין 'state'.
1. אתה רוצה לסנכרן את מצב `אזורים` לרשת בהתבסס על מצב `עיר`.

פצל את ההיגיון לשני אפקטים, שכל אחד מהם מגיב לprops שהוא צריך להסתנכרן איתו:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ All dependencies declared

  // ...
```

האפקט הראשון פועל מחדש רק אם ה'state' ranking, בעוד שהאפקט השני פועל מחדש כאשר ה'עיר' ranking. הפרדתם לפי מטרה: שני דברים שונים מסונכרנים על ידי שני אפקטים נפרדים. לשני אפקטים נפרדים יש שתי רשימות תלות נפרדות, כך שהם לא יפעילו את זה בלי כוונה.

הקוד הסופי ארוך יותר מהמקור, אך פיסול האפקטים הללו עדיין נכון. [כל אפקט צריך לעשות סנכרון עצמאי.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) בדוגמה זו, מחיקת אפקט אחת אינה שוברת את ההיגיון של האפקט השני. זה אומר שהם *מסנכרנים דברים שונים,* וטוב לפצל אותם. אם אתה מודאג לגבי כפילות, אתה יכול לשפר את הקוד הזה על ידי [חילוץ לוגיקה חוזרת לתוך Hook מותאם אישית.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### האם אתה קורא מצב כדי לחשב את ה__K_1__ הבא? {/*אתה-קורא-איזה-מצב-לחשב-את-הstate-הבא*/}

אפקט זה מעדכן את ה__TK_0 'הודעות' עם מערך חדש בכל פעם שמגיעה הודעה חדשה:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

הוא משתמש בשינוי 'הודעות' כדי [לייצר מערך חדש](/learn/updating-arrays-in-state) החל מכל ההודעות הגיש ומוסיף את ההודעה החדשה בסוף. עם זאת, מה ש'הודעות' הוא ערך תגובתי הנקרא על ידי אפקט, זה חייב להיות תלות:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

והפיכת 'הודעות' לתלות מציגה בעיה.

בכל פעם שאתה מקבל הודעה, `setMessages()` גורם להודעה לעיבוד מחדש עם מערך `הודעות` חדש המחובר את התקבלה. עם זאת, מה שהאפקט הזה תלוי עכשיו ב'הודעות', זה *גם* יסנכרן מחדש את האפקט. אז כל הודעה חדשה תגרום לצ'אט להתחבר מחדש. המשתמש לא היה אוהב את זה!

כדי לתקן את הבעיה, אל תקראו 'הודעות' בתוך האפקט. במקום זאת, העבר [עדכון פונקציית](/reference/react/useState#updating-state-based-on-the-previous-state) אל `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**שימו לב איך האפקט שלך לא קורא את השינוי 'הודעות' בכלל.** אתה רק צריך להעביר עכשיו פונקציית עדכון כמו 'msgs => [...msgs, receivedMessage]'. הגיבו [מכניסים את פונקציית העדכון שלך בתור](/learn/queueing-a-series-of-state-updates) ותספק לו את הארגומנט 'msgs' על העיבוד הבא. זה מה שהאפקט עצמו לא צריך להיות תלוי יותר ב'הודעות'. כמו תיקון זה, קבלת הודעת צ'אט לא תגרום עוד לצ'אט להתחבר מחדש.

### האם אתה רוצה לקרוא ערך מבלי "להגיב" לשינויים שלו? {/*האם-אתה-רוצה-לקרוא-ערך-בלי-להגיב-לשינויים-שלו*/}

<Wip>

סעיף זה מתאר **API ניסיוני שעדיין לא שוחרר** בגרסה יציבה של React.

</Wip>

נניח שאתה רוצה להשמיע צליל כשהמשתמש מקבל הודעה חדשה אלא אם כן `isMuted` הוא `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

מה שהאפקט שלך עכשיו ב-'isMuted' בקוד שלו, עליך להוסיף אותו לתלות:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

הבעיה היא שבכל פעם ש`isMuted` ranking (לדוגמה, כאשר לוחץ על הלחצן "מושתק"), האפקט יסונכרן מחדש, ויתחבר מחדש לצ'אט. זו לא חוית משתמש הרצויה! (בדוגמה זו, אפילו השבתת ה-linter לא תעבוד - אם תעשה זאת, `isMuted` ייתקע עם הערך הישן שלו.)

כדי לפתור בעיה זו, עליך לחלץ את ההיגיון שלא אמור להיות תגובתי מתוך האפקט. אתה לא רוצה שהאפקט הזה "יגיב" לשינויים ב-'isMuted'. [העבר את פיסת ההיגיון הלא תגובתית הזו לאירוע אפקט:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

אפקט אירועים מאפשרים לך לפצל אפקט לחלקים תגובתיים (שאמורים "להגיב" לערכים תגובתיים כמו `roomId` והשינויים שלהם) וחלקים לא תגובתיים (שקוראים רק את הערכים שלהם, כמו `onMessage` קורא `isMuted`). **עכשיו כשהקורא 'isMuted' בתוך אירוע אפקט, זה לא צריך להיות תלות של האפקט שלך.** כתוצאה מכך, הצ'אט לא יתחבר מחדש כאשר תפעיל או תכבה את ה"מושתק", ויפתור את הבעיה המקורית!

#### עטיפת רופא באירועים מprops {/*לתוף-an-event-handler-from-the-props*/}

אתה יכול להיתקל בבעיה דומה כאשר הרכיב שלך מקבל באירוע כprops:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

נניח שרכיב מעביר פונקציית 'onReceiveMessage' *שונה* בכל עיבוד:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

מה ש-'onReceiveMessage' הוא תלות, זה יגרום לאפקט להסתנכרן מחדש לאחר כל עיבוד מחדש של הורה. זה יגרום לו להתחבר מחדש לצ'אט. כדי לפתור זאת, עטוף את השיחה באירוע אפקט:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

אירועי אפקט אינם ריאקטיביים, כך שאין צורך לציין אותם כתלות. כתוצאה מכך, הצ'אט כבר לא יתחבר מחדש גם אם רכיב האב יעביר פונקציה שונה בכל רינדור מחדש.

#### הפרדת קוד תגובתי וקוד לא תגובתי {/*מפריד-תגובתי-ולא-תגובתי-קוד*/}

בדוגמה זו, אתה רוצה לרשום ביקור בכל פעם ש-'roomId' מסתובב. אתה רוצה לכלול את ה-'notificationCount' הנוכחי עם כל יומן, אבל אתה *לא* רוצה לשנות ל-'notificationCount' כדי להפעיל אירוע יומן.

הפתרון הוא שוב לפצל את הקוד הלא תגובתי לאירוע אפקט:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

אתה רוצה שההיגיון שלך יהיה תגובתי להתנגד ל-'roomId', אז אתה קורא 'roomId' בתוך האפקט שלך. עם זאת, אינך רוצה לשנות את 'notificationCount' כדי לרשום ביקור נוסף, אז אתה קורא את 'notificationCount' בתוך אירוע האפקט. [למידע נוסף על קריאת הprops וstate העדכניים ביותר מאפקטים באמצעות אפקט אירועים.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### האם ערך תגובתי כלשהו משתנה ללא כוונה? {/*הערך-איזה-תגובתי-משתנה-ללא-כוונה*/}

לפעמים, אתה *דווקא* רוצה שהאפקט שלך "יגיב" לערך מסוים, אבל הערך הזה משתנה לעתים קרובות יותר ממה שאתה רוצה - ואולי לא ישקף שום שינוי ממשי מנקודת המבט של המשתמש. לדוגמה, נניח שאתה יוצר אובייקט 'אפשרויות' בגוף הרכיב שלך, ולאחר מכן קורא את האובייקט הזה מתוך האפקט שלך:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

אובייקט זה מוצהר בגוף הרכיב, כך שהוא [ערך תגובתי.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) כאשר אתה קורא ערך תגובתי כזה בתוך אפקט, אתה מכריז עליו כתלות. זה מבטיח שהאפקט שלך "מגיב" לשינויים שלו:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

חשוב להכריז על כך כתלות! זה מבטיח, למשל, שאם ה-'roomId' משתנה, האפקט שלך יתחבר מחדש לצ'אט עם ה'אפשרויות' החדשות. עם זאת, יש גם בעיה עם הקוד שלמעלה. כדי לראות את זה, נסה להקליד את הקלט בארגז החול למטה, וצפה במה שקורה בקונסולה:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

בארגז החול למעלה, הקלט מעדכן רק את rendering הstate 'הודעה'. מנקודת המבט של המשתמש, זה לא אמור להשפיע על חיבור הצ'אט. עם זאת, בכל פעם שאתה מעדכן את ההודעה, הרכיב שלך מעבד מחדש. כאשר הרכיב שלך מעבד מחדש, הקוד שבתוכו פועל שוב מאפס.

אובייקט `אפשרויות` חדש נוצר מאפס בכל עיבוד מחדש של רכיב `ChatRoom`. React רואה שאובייקט ה-'options' הוא *אובייקט שונה* מעצם ה-'options' חומר על העיבוד האחרון. אני חושב שהוא מסנכרן מחדש את האפקט שלך (התלוי ב'אפשרויות'), והצ'אט מתחבר מחדש תוך כדי הקלדה.

**בעיה זו משפיעה רק על אובייקטים ופונקציות. ב-JavaScript, כל אובייקט ופונקציה שהינו נחשבים שונים מכל האחרים. זה לא משנה שהתוכן בתוכם עשוי להיות זהה!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**תלות באובייקט ובפונקציה יכולה לגרום לאפקט שלך להסתנכרן מחדש לעתים קרובות יותר ממה שאתה צריך.** 

זו הסיבה שבמידת האפשר, עליך לנסות להימנע מאובייקטים ומתפקדים כתלות של האפקט שלך. במקום זאת, נסה להעביר אותם מחוץ לרכיב, בתוך האפקט, או לחלץ מהם ערכים פרימיטיביים.

#### הזז אובייקטים ופונקציות סטטיות מחוץ לרכיב שלך {/*move-static-objects-and-functions-outside-your-component*/}

אם האובייקט אינו תלוי בprops ובstate__, את יכולה להעביר את האובייקט אל מחוץ לרכיב שלך:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

בדרך זו, אתה *מוכיח* ללינטר שהוא לא תגובתי. זה לא יכול להשתנות כמו שצריך עיבוד מחדש, אז זה לא יכול להיות תלות. עיבוד מחדש של `ChatRoom` לא יגרום לאפקט מחדש.

זה עובד גם עבור פונקציות:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

מה ש-'createOptions' מוצהר מחוץ לרכיב שלך, זה לא ערך תגובתי. אתה צריך לציין אותו בתלות של האפקט, ומדוע זה לעולם לא יגרום לאפקט להסתנכרן מחדש.

#### הזז אובייקטים ופונקציות דינמיות בתוך האפקט שלך {/*move-dynamic-objects-and-functions-inside-your-effect*/}

אם האובייקט שלך תלוי בערך תגובתי שעשוי להשתנות כמו עיבוד מחדש, כמו props `roomId`, אתה לא יכול למשוך אותו *מחוץ* לרכיב שלך. עם זאת, אתה יכול להעביר את היצירה שלו *בתוך* הקוד של האפקט:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

עכשיו, כאשר 'אפשרויות' מוכרזות בתוך האפקט שלך, זה כבר לא תלוי באפקט שלך. במקום זאת, הערך התגובתי היחיד המשמש את האפקט שלך הוא `roomId`. מה ש-'roomId' אינו אובייקט או פונקציה, אתה יכול להיות בטוח שהוא לא יהיה שונה *בלי כוונה*. ב-JavaScript, מספרים ומחרוזות מושווים לפי התוכן שלהם:

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

הודות לתיקון הזה, הצ'אט כבר לא מתחבר מחדש אם תערוך את הקלט:

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

עם זאת, הוא *מתחבר* מחדש כאשר אתה משנה את התפריט הנפתח 'roomId', כפי שהיית מצפה.

זה עובד גם עבור פונקציות:

```js {7-12,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

אתה יכול לכתוב פונקציות משלך כדי לקבץ חלקי היגיון בתוך האפקט שלך. כל עוד אתה גם מצהיר עליהם *בתוך* האפקט שלך, הם לא ערכים תגובתיים, ולכן הם לא צריכים להיות תלות של האפקט שלך.

#### קרא ערכים פרימיטיביים מאובייקטים {/*קרא-פרימיטיבי-ערכים-מ-אובייקטים*/}

לפעמים אתה יכול לקבל חפץ מprops:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

הסיכון כאן הוא שרכיב האב יצור את האובייקט במהלך העיבוד:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

זה יגרום לאפקט שלך להתחבר מחדש בכל פעם שרכיב האב מעבד מחדש. כדי לתקן זאת, קרא מידע מהאובייקט *מחוץ* לאפקט, והימנע מתלות של אובייקט ופונקציה:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

ההיגיון חוזר על עצמו מעט (אתה קורא כמה ערכים מחוץ לאפקט, ואז יוצר אובייקט עם ערכים בתוך האפקט). אבל זה מבהיר מאוד באיזה מידע האפקט שלך *למעשה* תלוי. אם נוצר מחדש ללא כוונה על ידי רכיב האב, הצ'אט לא יתחבר מחדש. עם זאת, אם `options.roomId` או `options.serverUrl` באמת שונים, הצ'אט יתחבר מחדש.

#### חשב ערכים פרימיטיביים מפונקציות {/*חשב-פרימיטיבי-ערכים-מ-פונקציות*/}

אותה גישה יכולה לעבוד עבור פונקציות. לדוגמה, נניח שרכיב האב מעביר פונקציה:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

כדי ללמוד מהפיכתו לתלות (ולגרום לו להתחבר מחדש בעיבוד מחדש), קרא לזה מחוץ לאפקט. זה נותן לך את הערכים `roomId` ו- `serverUrl` מבקשים, ותוכל לקרוא מתוך האפקט שלך:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

זה עובד רק עבור פעולות [pure](/learn/keeping-components-pure) מה שבטוח לקרוא את העיבוד. אם הפונקציה שלך היא מטפלת באירועים, אך אינך רוצה לשנות את האפקט שלך.

<Recap>

- תלויות תמיד צריכות להתאים לקוד.
- כאשר אתה לא מרוצה מהתלות שלך, מה שאתה צריך לערוך זה את הקוד.
- דיכוי ה-linter מוביל לבאגים מאוד לבדם, ותמיד כדאי מאוד.
- כדי להסיר תלות, אתה צריך "להוכיח" לבלינטר שזה לא הכרחי.
- אם קוד מסוים אמור לפעול בתגובה לאינטראקציה ספציפית, העבר את הקוד למטפל באירועים.
- אם חלקים שונים של האפקט שלך צריכים לפעול מחדש מסיבות שונות, פצל אותו למספר אפקטים.
- אם ברצונך לעדכן מצב במצב בהתבסס על הstate הקודם, העבר פונקציית עדכון.
- אם אתה רוצה לקרוא את הערך העדכני ביותר מבלי "להגיב" עליו, חלץ אירוע אפקט מהאפקט שלך.
- ב-JavaScript, אובייקטים ופונקציות שונות אם הם נוצרו שונים.
- נסו להימנע מתלות באובייקט ובתפקוד. הזז אותם מחוץ לרכיב או בתוך האפקט.

</Recap>

<Challenges>

#### תקן מרווח איפוס {/*fix-a-resetting-interval*/}

אפקט זה מגדיר מרווח שמתקתק כל שנייה. שמתם לב שמשהו מוזר קורה: נראה שהמרווח נהרס ונוצר מחדש בכל פעם שהוא מתקתק. תקן את הקוד כך שהמרווח לא ייווצר מחדש כל הזמן.

<Hint>

נראה שהקוד של אפקט זה תלוי ב'ספירה'. האם יש דרך לא להזדקק לתלות הזו? צריכה להיות דרך לעדכן את מצב 'ספירה' על סמך הערך הקודם שלו מבלי להוסיף תלות בערך זה.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

אתה רוצה לעדכן את מצב 'ספירה' להיות 'ספירה + 1' מתוך האפקט. עם זאת, זה גורם לאפקט שלך להיות תלוי ב'ספירה', שמשתנה עם כל סימון, וזו הסיבה שהמרווח שלך נוצר מחדש בכל סימון.

כדי לפתור זאת, השתמש ב-[פונקציית העדכון](/reference/react/useState#updating-state-based-on-the-previous-state) וכתוב `setCount(c => c + 1)` במקום `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

במקום לקרוא 'ספירה' האפקט, אתה מעביר בתוך הוראה 'c => c + 1' ("הגדל את המספר הזה!") ל-React. תגיב תחיל אותו בעיבוד הבא. ומכיוון שאינך צריך לקרוא יותר את הערך של `ספירה` בתוך האפקט שלך, אז אתה יכול לשמור על התלות של האפקט שלך (`[]`). זה מונע מהאפקט שלך ליצור מחדש את הרווח בכל סימון.

</Solution>

#### תקן אנימציה מפעילה מחדש {/*fix-a-retriggering-animation*/}

בדוגמה זו, כאשר אתה לוחץ על "הצג", הודעת פתיחה נמוגה פנימה. ההנפשה נמשכת שניה. כאשר אתה לוחץ על "הסר", הודעת הפתיחה נעלמת מיד. ההיגיון של הנפשה הדהייה מיושמת בקובץ `animation.js` כ-JavaScript רגיל [לולאת אנימציה.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) אינך צריך לשנות את ההיגיון הזה. אתה יכול להתייחס אליו כאל ספריית צד שלישי. ה'משך' נשלט על ידי מחוון.

הקוד הזה כבר עובד, אבל יש משהו שאתה רוצה לשנות. נכון לעכשיו, כאשר אתה מזיז את המחוון השולט בשינוי הstate 'משך', הוא מפעיל מחדש את האנימציה. שנה את ההתנהגות כך שהאפקט לא "יגיב" לשינוי `משך`. כאשר אתה לוחץ על "הצג", האפקט להשתמש בזמן הנוכחי במחוון. עם זאת, הזזת המחוון עצמו לא אמורה כשלעצמה להפעיל את האנימציה.

<Hint>

האם יש שורת קוד בתוך האפקט שלא אמורה להיות תגובתית? איך אתה יכול להעביר קוד לא תגובתי מהאפקט?

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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

<Solution>

האפקט שלך צריך לקרוא את הערך האחרון של `duration`, אבל אתה לא רוצה שהוא "יגיב" לשינויים ב-`duration`. אתה משתמש ב-'duration' כדי להתחיל את האנימציה, אבל התחלת האנימציה אינה תגובתית. חלץ את שורת הקוד הלא תגובתית ל- Effect Event, וקרא לפונקציה הזו מהאפקט שלך.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
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

אירועי אפקט כמו 'onAppear' הם ריאקטיביים, כך קראו 'משך' בפנים שלא להפעיל מחדש את האנימציה.

</Solution>

#### תקן צ'אט שמתחבר מחדש {/*fix-a-reconnecting-chat*/}

בדוגמה זו, בכל פעם שאתה לוחץ על "החלפת נושא", הצ'אט מתחבר מחדש. למה זה קורה? תקן את הטעות כך שהצ'אט יתחבר מחדש כאשר אתה רק עורך את כתובת ה-URL של השרת או בוחר חדר צ'אט אחר.

פשוט אל `chat.js` ספריית צד שלישי חיצונית: אתה יכול להתייעץ בה כדי לבדוק את ה-API שלה, אך אל תערוך אותו.

<Hint>

יש יותר מדרך אחת לתקן את זה, אבל בסופו של דבר אתה רוצה להימנע מעצם התלות שלך.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

האפקט שלך פועל מחדש מכיוון שהוא תלוי באובייקט 'אפשרויות'. ניתן ליצור מחדש אובייקטים ללא כוונה, אתה צריך לנסות להימנע מהם כתלות של האפקטים שלך במידת האפשר.

התיקון הכי פחות פולשני הוא לקרוא את `roomId` ו`serverUrl` ממש מחוץ לאפקט, כאשר הוא לגרום לאפקט להיות תלוי בערכים הפרימיטיביים הללו (שלא יכול להשתנות ללא כוונה). בתוך האפקט, צור אובייקט והעביר אותו ל-'createConnection':

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

עדיף אפילו להחליף את הprops ה-'options' של האובייקט בprops הספציפיים יותר של 'roomId' ו-'serverUrl':

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

היצמדות לprops פרימיטיביים במידת האפשר מקל על אופטימיזציה של הרכיבים שלך מאוחר יותר.

</Solution>

#### תקן צ'אט שמתחבר מחדש, שוב {/*fix-a-reconnecting-chat-again*/}

דוגמה זו מתחברת לצ'אט עם או בלי הצפנה. החלף את תיבת הסימון והבחין בהודעות השונות במסוף כאשר ההצפנה מופעלת ומכבה. נסה לשנות את החדר. לאחר מכן, נסה לשנות את ערכת הנושא. כאשר אתה מחובר לחדר צ'אט, תקבל הודעות חדשות כל כמה שניות. ודא שהצבע שלהם מתאים לנושא שבחרת.

בדוגמה זו, הצ'אט מתחבר מחדש בכל פעם שאתה מנסה לשנות את הנושא. תקן את זה. לאחר התיקון, שינוי ערכת הנושא לא אמור לחבר מחדש את הצ'אט, אבל החלפת הגדרות ההצפנה או שינוי החדר אמורה להתחבר מחדש.

אל תשנה שום קוד ב- `chat.js`. מלבד זאת, אתה יכול לשנות את כל הקוד. לדוגמה, יכול שיעזור לך לשנות אילו props מועברים.

<Hint>

אתה מעביר שתי פונקציות: `onMessage` ו-`createConnection`. שניהם נוצרים מאפס בכל פעם ש'אפליקציה' מעבדת מחדש. הם חשובים לערכים חדשים בכל פעם, וחושבים שהם מפעילים מחדש את האפקט שלך.

אחת מהפונקציות הללו היא מטפל באירועים. האם אתה מכיר דרך כלשהי לקרוא למטפל באירועים אפקט מבלי "להגיב" לערכים החדשים של פונקציית מטפל האירועים? זה יהיה שימושי!

עוד אחת מהפונקציות הללו קיימת רק כדי לספק מצב לשיטת API מיובאת. האם הפונקציה הזו באמת נחוצה? מהו החיוני שמועבר? אתה צריך להעביר חלק מהי יבוא מ-'App.js' ל-'ChatRoom.js'.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

יש יותר מדרך אחת נכונה לפתור את זה, אבל הנה פתרון אפשרי אחד.

בדוגמה המקורית, החלפת ערכת הנושא גרמה להעביר פונקציות שונות של 'onMessage' ו-'createConnection'. מה שהאפקט הוא תלוי בפונקציות הללו, זה יתחבר בכל פעם שתחליף את הנושא.

כדי לתקן את הבעיה עם 'onMessage', היית צריך לתת אותה באירוע אפקט:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

קיים לprops 'onMessage', אירוע אפקט 'onReceiveMessage' אינו תגובתי. זה מה שזה לא צריך להיות תלות של האפקט שלך. כתוצאה מכך, שינויים ב-'onMessage' לא יגרמו לצ'אט להתחבר מחדש.

אתה לא יכול לעשות את זה עם `createConnection` כי זה *צריך* להיות תגובתי. אתה *רוצה* שהאפקט יופעל מחדש אם המשתמש עובר בין חיבור מוצפן לחיבור ללא הצפנה, או אם המשתמש יחליף את החדר הנוכחי. עם זאת, מה ש-'createConnection' היא בדיקה, אתה לא יכול שהיא קוראת השתנה *בפועל* או לא. כדי לפתור זאת, במקום להעביר את 'createConnection' מהרכיב 'אפליקציה', העבירו את הערכים הגולמיים של 'roomId' ו-'isEncrypted':

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

עכשיו אתה יכול להעביר את הפונקציה 'createConnection' *בתוך* האפקט במקום להעביר אותה מ'האפליקציה':

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

לאחר שני השינויים האלה, האפקט שלך כבר לא תלוי בערכי פונקציה כלשהם:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

כתוצאה מכך, הצ'אט מתחבר מחדש רק כאשר משהו משמעותי (`roomId` או `isEncrypted`) דירוג:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>

