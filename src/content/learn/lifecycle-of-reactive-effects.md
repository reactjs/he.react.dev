---
title: "מחזור החיים של אפקטים תגובתיים"
---

<Intro>

לאפקטים יש מחזור חיים. רכיבים רכיבים לעלות, לעד או לטעינה. אפקט יכול לעשות רק שני דברים: להתחיל לסנכרן משהו, ובהמשך להפסיק לסנכרן אותו. מחזור זה יכול לקרות מספר פעמים אם ההשפעה שלך תלויה בprops ובstates המשתנים עם הזמן. React מספק כלל linter כדי לבדוק את התלות של האפקט שלך בצורה נכונה. זה שומר על האפקט שלך מסונכרן עם הprops וstate העדכניים ביותר.

</Intro>

<YouWillLearn>

- כיצד מחזור החיים של אפקט שונה ממחזור החיים של רכיב
- איך לחשוב על כל אפקט בנפרד
- מתי האפקט שלך צריך לסנכרן מחדש, ומדוע
- כיצד נקבעות התלות של האפקט שלך
- מה המשמעות של ערך להיות תגובתי
- מה המשמעות של מערך תלות ריק
איך תגיב מוודא שהתלות שלך נכונות עם סרגל
- מה לעשות כאשר אתה לא מסכים עם הלינטר

</YouWillLearn>

## מחזור החיים של אפקט {/*מחזור-החיים-של-אפקט*/}

כל הרכיב של React עובר את אותו מחזור חיים:

- רכיב _מועלה_ כאשר הוא מתווסף למסך.
- רכיב _מתעדכן_ כאשר הוא מקבל props או מצב חדשים, בדרך כלל בתגובה לאינטראקציה.
- רכיב _מתבטל_ כאשר הוא מוסר מהמסך.

**זו דרך טובה לחשוב על רכיבים, אבל _לא_ על אפקטים.** במקום זאת, תנסה לחשוב על כל אפקט באופן עצמאי ממחזור החיים של הרכיב שלך. אפקט מתאר כיצד [לסנכרן מערכת חיצונית](/ללמוד/סנכרון-עם-אפקטים) לprops ולstate הנוכחיים. ככל שהקוד שלך משתנה, הסנכרון יצטרך להתרחש פחות או יותר.

כדי להמחיש נקודה זו, שקול את האפקט הזה המחבר את הרכיב שלך לשרת צ'אט:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

גוף האפקט שלך מציין כיצד **להתחיל לסנכרן:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

פונקציית הניקוי המוחזרת מהאפקט שלך מציינת כיצד **להפסיק את הסנכרון:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

באופן אינטואיטיבי, אתה יכול לחשוב ש-React **יתחיל לסנכרן** כאשר הרכיב שלך נטען ו**תפסיק לסנכרן** כאשר הרכיב שלך יתבטל. עם זאת, זה לא סוף הסיפור! לפעמים, ייתכן שיהיה צורך גם **להתחיל ולהיות את הסינכרון מספר פעמים** בזמן שהרכיב נשאר מותקן.

בואו נסתכל על _למה_ זה הכרחי, _מתי_ זה קורה, ו_איך_ אתה יכול לשלוט בהתנהגות הזו.

<Note>

חלק מהאפקטים לא מחזירים פונקציית ניקוי כללי. [לעתים קרובות יותר מאשר לא,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) תרצה להחזיר אחד--אבל אם לא, תגיב תתנהג כאילו החזרת פונקציית ניקוי ריקה.

</Note>

### מדוע ייתכן שהסנכרון צריך להתרחש יותר מפעם אחת {/*למה-למה-סנכרון-ייתכן-צריך-להתרחש-יותר-מפעם-אחת*/}

תא לעצמך שרכיב `ChatRoom` זה מקבל props `roomId` שהמשתמש בוחר בתפריט נפתח. נניח שבתחילה משתמש בוחר את החדר `"כללי"` בתור `roomId`. האפליקציה שלך מציגה את חדר הצ'אט `"כללי"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

לאחר הצגת ממשק משתמש, React יפעיל את האפקט שלך כדי **להתחיל לסנכרן.** הוא מתחבר לחדר `"כללי"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

עד כאן, כל כך טוב.

מאוחר יותר, משתמש בוחר חדר אחר בתפריט הנפתח (לדוגמה, `"נסיעות"`). ראשית, הגיבו יעדכן את ממשק משתמש:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

תחשוב מה צריך לקרות אחר כך. משתמש רואה ש`"נסיעות"` הוא חדר הצ'אט הנבחר בממשק משתמש. עם זאת, האפקט שרץ בזמן הקודמת עדיין מחובר לחדר `"כללי"`. **props `roomId` השתנה, אז מה שהאפקט שלך עשה אז (התחברות לחדר `"כללי"`) כבר לא תואם למשק המשתמש.**

בתוך זה, אתה רוצה ש-React תעשה שני דברים:

1. הפסק לסנכרן עם `roomId` הישן (נתק מהחדר `"כללי"`)
2. התחל לסנכרן עם `roomId` החדש (התחבר לחדר `"נסיעות"`)

**למרבה המזל, כבר לימדת את React איך לעשות את שני הדברים האלה!** הגוף של האפקט שלך צריך להתחיל לסנכרן, ופונקציית הניקוי שלך מציינת איך להפסיק את הסנכרון. כל מה ש-React צריך לעשות עכשיו זה לקרוא להם נכון ועם הprops וstate הנכונים. בוא נראה בדיוק זה קורה.

### איך מגיב מסנכרן מחדש את האפקט שלך {/*how-react-re-synchronizes-your-effect*/}

זכור שרכיב ה-ChatRoom שלך קיבל ערך חדש עבור ה-roomId שלו. פעם זה היה `"כללי"`, ועכשיו זה `"נסיעות"`. תגיב צריך לסנכרן מחדש את האפקט שלך כדי לחבר אותך מחדש לחדר אחר.

כדי **להפסיק לסנכרן,** תגובה תקרא לפונקציית הניקוי שהאפקט שלך החזיר לאחר התחברות לחדר `"כללי"`. מה ש-`roomId` היה `"כללי"`, פונקציית הניקוי מתנתקת מהחדר `"כללי"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
    // ...
```

לאחר מכן, תגיב תריץ את האפקט שסיפקת על העיבוד הזה. הפעם, `roomId` `"travel"` כך שהוא **יתחיל להסתנכרן** לחדר הצ'אט `"travel"` (עד שפונקציית הניקוי שלו תיקרא בסוף דבר):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
    connection.connect();
    // ...
```

הודות לכך, אתה מחובר כעת לאותו חדר שהמשתמש בחר בממשק המשתמש. נמנע אסון!

בכל פעם לאחר שהרכיב שלך יוצג מחדש עם `roomId` אחר, האפקט שלך יסונכרן מחדש. לדוגמה, נניח שהמשתמש משנה את `roomId` מ`"travel"` ל`"music"`. תגיב שוב **תפסיק לסנכרן** את האפקט שלך על ידי קריאת פונקציית הניקוי שלו (תנתק אותך מחדר ה`"נסיעות"`). אז הוא **יתחיל לסנכרן** שוב על ידי הפעלת הגוף שלו עם props `roomId` החדש (חבר אותך לחדר `"מוזיקה").

לבסוף, כאשר המשתמש עובר למסך אחר, `ChatRoom` מתבטל. עכשיו אין צורך להישאר מחובר בכלל. תגיב **תפסיק לסנכרן** את האפקט שלך בפעם האחרונה ותנתק אותך מחדר הצ'אט `"מוזיקה"`.

### חשיבה מנקודת המבט של האפקט {/*חשיבה-מנקודת-המבט-של-ההשפעות*/}

בואו נסכם את כל מה שקרה מנקודת המבט של רכיב ה-ChatRoom:

1. `ChatRoom` מותקן כאשר `roomId` מוגדר ל`"כללי"`
1. `ChatRoom` עודכן עם `roomId` מוגדר ל`"נסיעות"`
1. `ChatRoom` עודכן עם `roomId` מוגדר ל`"מוזיקה"`
1. 'ChatRoom' בוטה

במהלך כל אחת מהנקודות הללו במחזור החיים של הרכיב, האפקט שלך עשה דברים שונים:

1. האפקט שלך מחובר לחדר `"כללי"`
1. האפקט שלך התנתק מהחדר `"כללי"` והתחבר לחדר `"נסיעות"`
1. האפקט שלך התנתק מחדר `"נסיעות"` והתחבר לחדר `"מוזיקה"`
1. האפקט שלך מנותק מחדר `"מוזיקה"`

עכשיו בואו נחשוב על מה שקרה מנקודת המבט של האפקט עצמו:

```js
  useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...until it disconnected
      connection.disconnect();
    };
  }, [roomId]);
```

המבנה של הקוד הזה עשוי לתת לך השראה לראות מה קרה כרצף של פרקי זמן שאינם חופפים:

1. האפקט שלך התחבר לחדר `"כללי"` (עד שהוא התנתק)
1. האפקט שלך התחבר לחדר `"נסיעות"` (עד שהוא התנתק)
1. האפקט שלך התחבר לחדר `"מוזיקה"` (עד שהוא התנתק)

בעבר, חשבת מנקודת המבט של הרכיב. כשהסתכלת מנקודת המבט של הרכיב, זה היה מפתה לחשוב על אפקטים כעל "התקשרות חוזרת" או "אירועי מחזור חיים" שנורים בזמן מסוים כמו "לאחר עיבוד" או "לפני ביטול ההרכבה". צורת החשיבה הזו מסתבכת מהר מאוד, ולכן עדיף להימנע.

** במקום זאת, התמקד תמיד במחזור התחלה/עצירה בודד בכל פעם. אין זה משנה אם רכיב מותקן, מתעדכן או מבטל. כל מה שאתה צריך לעשות הוא לתאר כיצד להתחיל סנכרון וכיצד לעצור אותו. אם תעשה את זה טוב, האפקט שלך יהיה עמיד בפני הפעלה ועצירה כמה פעמים שיידרש.**

זה יכול להאמין לך איך אתה לא אם רכיב מועלה או מתעדכן שאתה כותב את לוגיקת הרינדור יוצר JSX. אתה מתאר מה צריך להיות על המסך, ומגיב [מבין את השאר.](/learn/reacting-to-input-with-state)

### איך React מאמת שהאפקט שלך יכול להסתנכרן מחדש {/*how-react-verifies-that-your-react-can-re-synchronize*/}

הנה דוגמה חיה אתה צריך לשחק איתה. לחץ על "פתח צ'אט" כדי לטעון את הרכיב `ChatRoom`:

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

שים לב שכאשר הרכיב נטען בפעם הראשונה, אתה רואה שלושה יומנים:

1. `✅ מתחבר לחדר "כללי" בכתובת https://localhost:1234...` *(לפיתוח בלבד)*
1. `❌ מנותק מהחדר "כללי" בכתובת https://localhost:1234.` *(לפיתוח בלבד)*
1. `✅ מתחבר לחדר "כללי" בכתובת https://localhost:1234...`

שני היומנים הם הראשונים לפיתוח בלבד. בפיתוח, תגיב תמיד מחזיר כל רכיב פעם אחת.

**הגיב מאמת שהאפקט שלך יכול להסתנכרן מחדש על ידי אילוץ לעשות זאת מיד בפיתוח.** זה עשוי להזכיר לך לפתוח דלת ולסגור אותה פעם נוספת כדי לבדוק אם מנעול הדלת עובד. תגובה מתחילה ומפסיקה את האפקט שלך פעם נוספת בפיתוח כדי לבדוק [ישמת את הניקוי שלו היטב.](/למד/סנכרן-עם-אפקטים#איך- לטפל באפקט-ירי-פעמיים-בפיתוח)

מהי התנהלות העבודה שלך. בארגז החול למעלה, שנה את חדר הצ'אט שנבחר. שים לב איך שלך, כאשר ה-'roomId' מתהפך, האפקט מסתנכרן מחדש.

עם זאת, יש גם מקרים חריגים יותר יש צורך בסנכרון מחדש. לדוגמה, נסה לערוך את `serverUrl` בארגז החול למעלה בזמן שהצ'אט פתוח. שימו לב איך האפקט מסתנכרן מחדש בתגובה לעריכות שלכם בקוד. אם אפשר, React עשויה להוסיף תכונה נוספת של הסנכרון מחדש.

### איך React יודע שהוא צריך לסנכרן מחדש את האפקט {/*how-react-יודע-שצריך-לחדש-לסנכרן-את-האפקט*/}

אולי אתה תוהה איך React ידע שהאפקט שלך צריך להסתנכרן מחדש לאחר שינויים ב-'roomId'. זה בגלל ש*אמרת ל-React* שהקוד שלו תלוי ב-'roomId' על ידי הכללתו ב-[רשימת התלות:](/learn/synchronizing-with-effects#step-2-specific-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // The roomId prop may change over time
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
  // ...
```

הנה איך זה עובד:

1. ידעת ש'roomId' הוא props, מה שאומר שהוא יכול להשתנות עם הזמן.
2. ידעת שהאפקט שלך קורא `roomId` (כך שהלוגיקה שלו תלויה בערך שעשוי להשתנות מאוחר יותר).
3. אתה מחפש את זה בתור התלות של האפקט (כך שהוא יסונכרן מחדש כאשר `roomId` מתרוצץ).

בכל פעם לאחר עיבוד מחדש של הרכיב שלך, תגיב יסתכל על מערך התלות שעברו. אם אחד מהערכים במערך שונה מהערך בנקודה שעברה בעיבוד הקודם, תגיב יסנכרן מחדש את האפקט שלך.

לדוגמה, אם עברת את `["כללי"]`בהמשך הרנדור הראשוני, ובהמשך עברת את `["נסיעות"]`על הרינדור הבא, הגיבו ישווה את `"כללי"` ו`"נסיעות"`. אלו הם ערכים שונים (בהשוואה ל-[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), אז React יסנכרן מחדש את האפקט שלך. מצד שני, אם הרכיב שלך מעבד מחדש אבל `roomId` לא השתתנה, האפקט שלך יישאר מחובר לאותו חדר.

### כל אפקט מייצג תהליך סנכרון נפרד {/*כל-אפקט-מייצג-תהליך-סינכרון-נפרד*/}

הימנע מהוספת היגיון לא קשור לאפקט שלך רק בגלל שהלוגיקה הזו צריכה לפעול לפקודת כתבת. לדוגמה, אני רוצה לשלוח אירוע ניתוח כאשר אתה מבקר בחדר. כבר יש לך אפקט שתלוי ב-'roomId', אז אולי תתפתה להוסיף לשם את קריאת הניתוח:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

אבל תארו לעצמכם שלאחר הוא תוסיפו תלות נוספות לאפקט הזה שצריכה ליצור מחדש את הקשר. אם אפקט זה יסונכרן מחדש, הוא יקרא גם `logVisit(roomId)` עבור אותו חדר, שלא התכוונת. רישום הביקור **הוא תהליך נפרד** מהחיבור. כתוב אותם כשני אפקטים נפרדים:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**כל אפקט בקוד שלך צריך לייצג תהליך סנכרון נפרד ובלתי תלוי.**

בדוגמה שלמעלה, מחיקת אפקט אחד לא תשבור את ההיגיון של האפקט השני. זו אינדיקציה טובה שהם מסנכרנים דברים שונים, זה היה הגיוני לפצל אותם. שני, אם תפצל פיסת היגיון מגובשת לאפקטים נפרדים, הקוד עשוי להיראות "נקי" יותר אבל [קשה יותר לתחזוקה.](/learn/you-might-not-need-an-effect#chains-of-computations) אתה צריך לחשוב אם התהליכים האלה או נפרדים, לא אם הקוד נראה נקי יותר.

## אפקטים "מגיבים" לערכים תגובתים {/*effects-react-to-reactive-values*/}

האפקט שלך קורא שני משתנים (`serverUrl` ו-`roomId`), אך ציינת רק `roomId` כתלות:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

למה `serverUrl` לא צריך להיות תלות?

למה היא חושבת ש-'serverUrl' לעולם לא מדרגת עקב עיבוד מחדש. זה תמיד אותו הדבר, לא משנה כמה פעמים הרכיב יוצג מחדש ולמה. זה ש-'serverUrl' לעולם לא משתנה, לא יהיה הגיוני לציין זאת כתלות. אחרי הכל, תלות עושה משהו רק כשהן משתנות עם הזמן!

מצד שני, `roomId` עשוי להיות שונה בעיבוד מחדש. **props, מצב וערכים אחרים המוצהרים בתוך הרכיב הם _reactive_ מה שהם מחושבים על העיבוד והמשתתפים בזרימת יום של React.**

אם `serverUrl` היה משתנה מצב, הוא היה מגיב. ערכים תגובתיים חייבים להיכלל בתלות:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props change over time
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State may change over time

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
  // ...
}
```

על ידי הכללת 'serverUrl' כתלות, אתה מבטיח שהאפקט יסונכרן מחדש לאחר שהוא משתנה.

נסה לשנות את חדר הצ'אט שנבחר או לערוך את כתובת האתר של השרת בארגז החול הזה:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
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

בכל פעם שאתה משנה ערך תגובתי כמו `roomId` או `serverUrl`, האפקט מתחבר מחדש לשרת הצ'אט.

### המשמעות של אפקט עם תלות ריקות {/*מה-משמעות-אפקט-עם-תלות-ריקות*/}

מה קורה אם אתה מעביר גם `serverUrl` וגם `roomId` מחוץ לרכיב?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

כעת הקוד של האפקט שלך אינו משתמש ב*שום* ערכים תגובתיים, ולכן התלות שלו יכולה להיות ריקות (`[]`).

בחשיבה מנקודת המבט של הרכיב, מערך התלות הריק `[]` אומר שהאפקט הזה מתחבר לחדר הצ'אט רק כאשר הרכיב עולה, ומתנתק רק כאשר הרכיב מתנתק. (זכור ש-React עדיין [יסנכרן אותו שוב פעם נוספת](#how-react-verifies-that-your-react-can-re-synchronize) בפיתוח כדי לבחון את ההיגיון שלך.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

עם זאת, אם אתה [חושב מנקודת המבט של האפקט,](#חשיבה-מ-the-effects-perspective) אינך צריך לחשוב על הרכבה וביטול כללי. מה שחשוב הוא שציינת מה האפקט שלך עושה כדי להתחיל להפסיק את הסנכרון. היום, אין לו תלות תגוית. אבל אם אי פעם תרצה שהמשתמש ישנה את `roomId` או `serverUrl` לאורך זמן (והם יהפכו לתגובתי), הקוד של האפקט שלך לא ישתנה. תצטרך רק להוסיף אותם לתלות.

### כל המשתנים המוצהרים בגוף הרכיב הם תגובתיים {/*כל-המשתנים-מוצהרים-בגוף-הרכיב-הם-ריאקטיביים*/}

props וstate הם לא הערכים התגובתיים היחידים. ערכים מחשבים שהם גם ריאקטיביים. אם הprops או הstate ישתנו, הרכיב שלך יוצג מחדש, וגם הערכים המחושבים מהם ישתנו. צריך להיות ברשימת התלות של אפקט.

נניח שהמשתמש יכול לבחור שרת צ'אט בתפריט הנפתח, אבל הוא יכול גם להגדיר שרת ברירת מחדל בהגדרות. נניח שמת את מצב ההגדרות ב-[הקשר](/learn/scaling-up-with-reducer-and-context) אז אתה קורא את ההגדרות' מהקשר זה. עכשיו אתה מחשב את ה-serverUrl על סמך השרת שנבחר מprops ושרת ברירת המחדל:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
  // ...
}
```

בדוגמה זו, `serverUrl` אינו מאפין או שינוי מצב. זה ranking רגיל שאתה מחשב את העיבוד. אבל זה מחושב על העיבוד, כך שהוא יכול להשתנות עקב עיבוד מחדש. אני חושב שהוא מגיב.

**כל הערכים בתוך הרכיב (כולל props, מצב ומשתנים בגוף הרכיב שלך) הם תגובתיים. כל ערך תגובתי יכול להשתנות בעיבוד מחדש, לכן עליך לכלול ערכים תגובתיים כתלות של אפקט.**

במילים אחרות, אפקטים "מגיבים" לכל הערכים מגוף הרכיב.

<DeepDive>

#### האם ערכים גלובליים או ניתנים לשינוי יכולים להיות תלות? {/*יכולות-גלובליות-או-שינוי-ערכים-להיות-תלות*/}

ערכים הניתנים לשינוי (כולל משתנים גלובליים) אינם מגיבים.

**ערך שינוי כמו [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) לא יכול להיות תלות.** הוא יכול להשתנות, כך שהוא יכול להשתנות בכל עת מחוץ לזרימה של React. שינוי זה לא פעיל עיבוד מחדש של הרכיב שלך. לשינוי העיבוד (שזה כאשר אתה מחשב את התלות) שובר את [טוהר העיבוד.](/learn/keeping-components-pure) במקום זאת, עליך לקרוא ולהירשם לערך חיצוני לשינוי עם [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**ערך ניתן לשינוי כמו [`ref.current`](/reference/react/useRef#reference) או שאתה קורא ממנו גם לא להיות תלות.** דברים רפר שמוחזר על ידי `useRef` עצמו יכול להיות תלות, אבל המאפיין `current` הוא יכול לשנות בכוונה. זה יכול לך להפעיל רינדור מחדש.](/learn/referencing-values-with-refs)

כפי שתלמד להלן בדף זה, סרגל יבדוק בעיות אלו באופן אוטומטי.

</DeepDive>

### React מאמת שציינת כל ערך תגובתי כתלות {/*react-verifies-that-you-speed-every-reactive-value-as-a-dependency*/}

אם ה-linter שלך הוא [מוגדר עבור React,](/learn/editor-setup#linting) הוא יבדוק שכל ערך תגובתי המשמש את הקוד של האפקט שלך מוכרז כתלות שלו. לדוגמה, זו שגיאת מוך זה גם `roomId` וגם `serverUrl` מגיבים:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

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

זה אולי נראה כמו שגיאת React, אבל באמת React מצביע על באג בקוד שלך. גם `roomId` וגם `serverUrl` משתלבות להשתנות עם הזמן, אבל אתה שוכח לסנכרן מחדש את האפקט שלך כשהם משתנים. אתה תישאר מחובר ל-'roomId' ו-'serverUrl' הראשוניים גם לאחר שהמשתמש יבחר ערכים שונים בממשק המשתמש.

כדי לתקן את הבאג, עקוב אחר ההצעה של ה-linter כדי לציין `roomId` ו- `serverUrl` כתלות של האפקט שלך:

```js {9}
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

נסה את התיקון הזה בארגז החול למעלה. ודא ששגיאת ה-linter נעלמה, והצ'אט מתחבר מחדש בעת הצורך.

<Note>

אפשרות, תגובה *יודע* שערך לעולם לא משתנה למרות שהוא מוצהר בתוך הרכיב. לדוגמה, הפונקציה [`set`](/reference/react/useState#setstate) המוחזרת מ`useState` ואובייקט ref המוחזר על ידי [`useRef`](/reference/react/useRef) הם *יציבים*--מובטח שהם לא ישנו בעיבוד מחדש. ערכים יציבים אינם מגיבים, אז אתה יכול להשמיט אותם מהרשימה. לרבות אותם מותר: לא ישתנו, אז זה לא משנה.

</Note>

### מה לעשות כשאתה לא רוצה לסנכרן מחדש {/*מה-לעשות-כשאתה-אינך-רוצה-לסנכרן-מחדש*/}

בדוגמה הקודמת, תיקנת את שגיאת המוך על ידי רישום 'roomId' ו-'serverUrl' כתלות.

**עם זאת, אתה יכול במקום "להוכיח" ל-Linter שערכים אלה הם ערכים תגוב,** כלומר שהם *לא יכולים* להשתנות כמו עיבוד מחדש. לדוגמה, אם `serverUrl` ו`roomId` לא תלויים בעיבוד ותמיד יש להם ערכים, אתה יכול להעביר אותם מחוץ לרכיב. עכשיו הם לא צריכים להיות תלות:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

אתה יכול גם להזיז אותם *בתוך האפקט.* הם לא מחושבים במהלך העיבוד, כך שהם לא מגיבים:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**אפקטים הם בלHooks תגובתיים של קוד.** הם מסתנכרנים מחדש כאשר הערכים שאתה קורא בתוכם משתנים. שלא כמו מטפלי אירועים, פועלים רק פעם אחת בכל אינטראקציה, אפקטים פועלים בכל פעם שצריך בסנכרון.

**אתה לא יכולה "לבחור" את התלות שלך.** התלות שלך חייבת לכלול את כל [ערך תגובתי](#all-variables-declared-in-the-component-body-are-reactive) אתה קורא באפקט. הליטר אוכף את זה. לפעמים זה יכול להוביל לבעיות כמו אינסופיות ולסנכרון מחדש של האפקט שלך בטווח מדי. אל תתקן את הבעיות הללו על ידי דיכוי ה-linter! הנה מה לנסות במקום:

* **בדוק שהאפקט שלך מייצג לעבוד סנכרון עצמאי.** אם האפקט שלך לא מסנכרן שום דבר, [ייתכן שהוא מיותר.](/learn/you-might-not-need-an-effect)

* **אם אתה רוצה לקרוא את הערך העדכני של props או מצב מצב "להגיב" אליו ולסנכרן מחדש את האפקט,** אתה יכול לפצל את האפקט שלך לחלק תגובתי (שאותו תשמור באפקט) וחלק לא תגובתי (שאותו תחלץ למשהו שנקרא _Effect Event_). [קרא על הפרדת אירועים מהאפקטים.](/learn/separating-events-from-effects)

* **הימנע מהסתמכות על אובייקטים ופונקציות כתלות.** אם אתה יוצר אובייקטים ופונקציות העיבוד הוא קורא אותם מאפקט, הם יהיו שונים בכל עיבוד. זה יגרום לאפקט שלך להסתנכרן מחדש בכל פעם. [קרא עוד על הסרת תלות מיותרת מ- Effects.](/learn/removing-effect-dependencies)

<Pitfall>

ה-Linter הוא חבר שלך, אבל כוחותיו מוגבלים. ה-לינטר יודע רק מתי התלות *שגויה*. הוא לא יודע הדרך *הכי טובה* לפתור את כל המקרה. אם ה-linter מציע תלות, אבל הוספה שלו גורמת ללולאה, זה לא אומר להתעלם מה-linter. אתה צריך לשנות את הקוד בתוך (או מחוץ) האפקט כך שהערך הזה לא יהיה תגובתי ולא *צריך* להיות תלות.

אם יש לך בסיס קוד קיים, אולי יהיו לך כמה אפקטים שמדכאים את ה-linter כך:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

ב-[הבא](/learn/separating-events-from-effects) [pages](/learn/removing-effect-dependencies), תלמד כיצד לתקן את הקוד הזה לבד לשבור את הכללים. תמיד כדאי לתקן!

</Pitfall>

<Recap>

- רכיבים יכולים לעלות, לעדכן ולבטל את הטעינה.
- לכל אפקט יש מחזור חיים נפרד מהרכיב שמסביב.
- כל אפקט מתאר תהליך סנכרון נפרד שיכול *להתחיל* ו*להפסיק*.
- כשאתה כותב וקורא אפקטים, חשבו מנקודת המבט של כל אפקט בנפרד (איך להתחיל ולהפסיק את הסנכרון) ולא מנקודת המבט של הרכיב (איך הוא נטען, מתעדכן או מבטל).
- ערכים המוצהרים בתוך גוף הרכיב הם "ריאקטיביים".
- ערכים ריאקטיביים צריכים לסנכרן מחדש את האפקט מכיוון שהם יכולים להשתנות עם הזמן.
- ה-Linter מוודא שכל הערכים התגובתיים המשמשים בתוך האפקט מצוינים כתלות.
- כל השגיאות המסומנות על ידי ה-linter הן לגיטימיות. תמיד יש דרך לתקן את הקוד כדי לא לשבור את הכללים.

</Recap>

<Challenges>

#### תיקון חיבור מחדש בכל הקשה {/*תיקון-חיבור-מחדש-בכל-הקשה*/}

בדוגמה זו, רכיב `ChatRoom` מתחבר לחדר הצ'אט כאשר הרכיב עולה, מתנתק כאשר הוא מתנתק ומתחבר מחדש כאשר אתה בוחר חדר צ'אט אחר. התנהגות זו נכונה, אז אתה צריך להמשיך לעבוד.

עם זאת, יש בעיה. בכל פעם שאתה מקליד בתיבת ההודעה בתחתית, `ChatRoom` *גם* מתחבר מחדש לצ'אט. (תוכל להבחין עם על ידי ניקוי המסוף והקלדה בקלט.) תקן את הבעיה כך שזה לא יקרה.

<Hint>

ייתכן שיהיה עליך להוסיף מערך תלות עבור אפקט זה. אילו תלות צריכות להיות שם?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

לאפקט הזה לא היה מערך תלות בכלל, אז הוא הסתנכרן מחדש אחרי כל רינדור מחדש. ראשית, הוסף מערך תלות. לאחר מכן, ודא שכל ערך תגובתי המשמש את האפקט מצוין במערך. לדוגמה, `roomId` הוא תגובתי (בגלל שהוא props), אז יש לכלול אותו במערך. זה מבטיח שכאשר משתמש בוחר חדר אחר, הצ'אט מתחבר מחדש. מצד שני, `serverUrl` מוגדר מחוץ לרכיב. למה אני לא צריך להיות במערך.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### הפעל וכיבוי הסנכרון {/*הפעל-וכיבוי-סנכרון*/}

בדוגמה זו, אפקט נרשם לאירוע החלון [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) כדי להזיז נקודה ורודה על המסך. נסה לרחף מעל אזור התצוגה המקדימה (או לגעת במסך אם אתה במכשיר נייד), וראה כיצד הנקודה הוורודה עוקבת אחר התנועה.

יש גם תיבת סימון. סימון תיבת הסימון מפעיל את מצב הstate `canMove`, אך מדרג מצב זה אינו בשימוש בשום מקום בקוד. המשימה היא שלך לשנות את הקוד כך שכאשר `canMove` הוא `false` (תיבת הסימון מסומנת), הנקודה צריכה להפסיק לזוז. לאחר שתפעיל מחדש את תיבת הסימון (ותגדיר את 'canMove' ל'true'), התיבה אמורה לעקוב שוב אחר התנועה. במילים אחרות, האם הנקודה יכולה לזוז או לא צריכה להישאר מסונכרנת אם תיבת הסימון מסומנת.

<Hint>

אתה לא יכול להכריז על אפקט באופן מותנה. עם זאת, הקוד בתוך האפקט יכול להשתמש בתנאים!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

פתרון אחד הוא לטוף את הקריאה `setPosition` מצב `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

לחלופין, תוכל לתת את ההיגיון של *מנוי לאירוע* בתנאי `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

שני המקרים, `canMove` הוא מחליף תגובתי שאתה קורא בתוך האפקט. יש לציין אותו ברשימת התלות של אפקט. זה מבטיח שהאפקט יסנכרן מחדש לאחר כל שינוי בערך שלו.

</Solution>

#### חקור באג עם ערך מיושן {/*investigate-a-stale-value-bug*/}

בדוגמה זו, הנקודה הוורודה צריכה לזוז כאשר תיבת הסימון מופעלת, ועליה להפסיק לזוז כאשר תיבת הסימון כבויה. ההיגיון לכך כבר יושם: המטפל באירוע `handleMove` בודק את סדר הstate `canMove`.

עם זאת, מסיבה כלשהי, מדרג את הstate `canMove` בתוך `handleMove` "מיושן": הוא תמיד `נכון`, גם לאחר סימון תיבת הסימון. איך זה אפשרי? מצא את הטעות בקוד ותקן אותה.

<Hint>

אם אתה רואה חוק מדוכא, הסר את הדיכוי! שם נמצאות הטעויות בדרך כלל.

</Hint>

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

<Solution>

הבעיה עם הקוד המקורי הייתה דיכוי ה-dependency linter. אם תסיר את הדיכוי, תראה שהאפקט הזה תלוי בפונקציה 'handleMove'. זה הגיוני: `handleMove` מוצהר בתוך גוף הרכיב, מה שהופך אותו לערך תגובתי. כל ערך תגובתי חייב להיות מוגדר כתלות, אחרת הוא להתייאש עם הזמן!

מחבר הקוד המקורי "שיקר" ל-React באומרו שהאפקט אינו תלוי (`[]`) בערכים תגובתים כלשהם. זה מה ש-React לא סינכרן מחדש את האפקט לאחר ש-'canMove' השתנה (ו-'handleMove' איתו). איך ש-React לא סינכרן מחדש את האפקט, ה-'handleMove' המצורף כמאזין הוא הפונקציה 'handleMove' בשימוש העיבוד הראשוני. על העיבוד הראשוני, `canMove` היה `נכון`, וזוהי ש`handleMove` מהרינדור הראשוני יראה לנצח את הערך הזה.

**אם לעולם לא תדחיק את ה-linter, לעולם לא תראה בעיות עם ערכים מיושנים.** יש כמה דרכים שונות לפתור את הבאג הזה, אבל תמיד כדאי להתחיל בהסרת ה-linter. לאחר שנה את הקוד כדי לתקן את שגיאת המוך.

אתה יכול לשנות את התלות של אפקט ל-`[handleMove]`, אבל אתה יכול לשנות את כל רינדור. ואז האפקט *יסנכרן* מחדש אחרי כל רינדור מחדש:

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
  });

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

הפתרון הזה עובד, אבל הוא לא אידיאלי. אם תכניס את `console.log('Resubscribing')` בתוך האפקט, תבחין שהוא נרשם מחדש לאחר כל עיבוד מחדש. ההרשמה מחדש מהירה, אבל היא תהיה נחמדה.

תיקון טוב יותר יהיה להעביר את הפונקציה 'handleMove' *בתוך* האפקט. אז `handleMove` לא יהיה ערך תגובתי, זה האפקט שלך לא יהיה תלוי בפונקציה. במקום זאת, זה יצטרך להיות תלוי ב-'canMove' שהקוד שלך קורא עכשיו מתוך האפקט. זה תואם הכרחי שרצית, מה שהאפקט שלך יישאר מסונן עכשיו עם הערך של `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

נסה להוסיף `console.log('Resubscribing')` בתוך גוף האפקט ושימו לב שכעת הוא נרשם מחדש רק כאשר אתה מחליף את תיבת הסימון (`canMove` שינויים) או עורך את הקוד. זה עושה את זה טוב יותר מהגישה הקודמת שתמיד נרשמה מחדש.

תלמדו גישה כללית יותר לסוג זה של בעיות ב-[הפרדת אירועים מאפקטים.](/learn/separating-events-from-effects)

</Solution>

#### תקן מתג חיבור {/*fix-a-connection-switch*/}

בדוגמה זו, שירות הצ'אט ב- `chat.js` חושף שני ממשקי API שונים: `createEncryptedConnection` ו-`createUencryptedConnection`. יכול רכיב ה-Root `App` למשתמש לבחור אם להשתמש בהצפנה או לא, הוא מעביר את שיטת ה-API המקבילה לרכיב `ChatRoom` הבן בתור הפרופס של `createConnection`.

שימו לב שבתחילה, יומני המסוף אומרים שהחיבור אינו מוצפן. נסה להפעיל את תיבת הסימון: שום דבר לא יקרה. עם זאת, אם תשנה את החדר הנבחר לאחר מכן, הצ'אט יתחבר מחדש *ו* יאפשר הצפנה (כפי שתראה מהודעות המסוף). זהו באג. תקן את הבאג כך שהחלפת תיבת הסימון *גם* תגרום לצ'אט להתחבר מחדש.

<Hint>

דיכוי ה-linter הוא תמיד פעיל. האם זה יכול להיות באג?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

אם תסיר את דיכוי המוך, תראה שגיאת מוך. הבעיה היא ש-'createConnection' הוא props, אז זה ערך תגובתי. זה יכול להשתנות עם הזמן! (ואכן, זה צריך--כשה משתמש מסמן את תיבת הסימון, רכיב האב יעביר ערך אחר של ה-'createConnection' מאפיין.) זה מה שזה צריך להיות תלות. כלול אותו ברשימה כדי לתקן את הבא:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

נכון ש-'createConnection' הוא תלות. עם זאת, קוד זה מעט שביר מה שמישהו לערוך את הרכיב האפליקציה כדי להעביר פונקציה מוטבעת בתור props זה. במקרה, הערך יהיה שונה פעם אחת רכיב האפליקציה כזה בכל מעבד מחדש, כך שהאפקט הוא להסתנכרן מחדש. כדי להשפיע, אתה מעביר את 'מוצפן' במקום זאת:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

בגרסה זו, הרכיב 'אפליקציה' מעביר props בוליאני במקום פונקציה. בתוך האפקט, אתה מחליט באיזו פונקציה להשתמש. גם `createEncryptedConnection` וגם `createUencryptedConnection` מוכרזים מחוץ לרכיב, הם אינם מגיבים, ואינם צריכים להיות תלות. תוכל ללמוד עוד על כך ב-[הסרת תלויות אפקטים.](/learn/removing-effect-dependencies)

</Solution>

#### אכלס שרשרת של תיבות נבחרות {/*אכלוס-שרשרת-של-נבחר-תיבות*/}

בדוגמה זו, יש שתי תיבות בחירה. תיבת בחירה אחת מאפשרת למשתמש לבחור כוכב לכת. תיבת בחירה נוספת מאפשרת למשתמש לבחור מקום *בכוכב זה.* התיבה השנייה עדיין לא עובדת. המשימה שלך היא לגרום לזה להראות את המקומות על הפלנטה הנבחרה.

תראה איך פועלת תיבת הבחירה הראשונה. הוא מאכל את המצב `planetList` בתוצאה מקריאת ה-API `"/planets"`. המזהה של כוכב הלכת הנבחר כרגע נשמר בשינוי הstate `planetId`. עליך למצוא היכן להוסיף קוד נוסף כדי לשנות את הstate `placeList` יאוכלס בתוצאה של הקריאה `"/planets/" + planetId + "/places"` ל-API.

אם אתה מיישם זכות זו, בחירת כוכב לכת אמורה לאכלס את רשימת המקומות. שינוי כוכב לכת אמור לשנות את רשימת המקומות.

<Hint>

אם יש לך שני תהליכי סנכרון עצמאיים, עליך לכתוב שני אפקטים נפרדים.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

ישנם שני תהליכי סנכרון עצמאיים:

- תיבת הבחירה הראשונה מסונכרנת לרשימת כוכבי הלכת המרוחקת.
- תיבת הבחירה השנייה מסנכרנת לרשימת המקומות המרוחקת עבור `planetId` הנוכחית.

זו הסיבה שזה הגיוני לתאר אותם כשני אפקטים נפרדים. הנה דוגמה כיצד תוכל לעשות זאת:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

הקוד הזה קצת חוזר על עצמו. עם זאת, זו לא סיבה טובה לשלב אותו לאפקט אחד! אם תעשה זאת, תצטרך לשלב את שתי התלות של אפקט לרשימה אחת, ואז שינוי כוכב הלכת יביא מחדש את רשימת כל כוכבי הלכת. אפקטים אינם כלי לשימוש חוזר בקוד.

במקום יכול זאת, כדי להפחית את החזרות, אתה לחלץ קצת היגיון לתוך Hook מותאם אישית כמו 'useSelectOptions' למטה:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

בדוק את הכרטיסייה 'useSelectOptions.js' בארגז החול כדי לראות איך זה עובד. בדרך כלל אידיאלי, רוב הפקטים באפליקציה שלך צריכים להיות מוחלפים לאחר דבר ב-Hooks מותאמים אישית, בין אם נכתבו על ידך או על ידי הקהילה. ה-Custom Hooks מסתירים את ההיגיון הסנכרון, כך שהרכיב המתקשר לא יודע על האפקט. שתמשיך לעבוד על האפליקציה שלך, תפתח פלטת הHooks לבחירה, ובסוף דבר לא תצטרך לכתוב אפקטים ברכיבים שלך קרוב מאוד.

</Solution>

</Challenges>

