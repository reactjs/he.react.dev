---
id: hooks-custom
title: בניית Hooks משלך
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

</div>

*Hooks* הם תוספת חדשה ב-React 16.8. הם נותנים לנו להשתמש ב-state ופיצ'רים אחרים של React מבלי לכתוב מחלקה.

בניית Hooks משלך נותנת לך לחלץ לוגיקת קומפוננטות לפונקציות שניתן לעשות בהן שימוש חוזר.

כשלמדנו על [שימוש ב-Effect Hook](/docs/hooks-effect.html#example-using-hooks-1),ראינו את קומפוננטה זו מיישום צ'אט שמציג הודעה שמציינת האם חבר מחובר או מנותק:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'טוען...';
  }
  return isOnline ? 'מחובר' : 'מנותק';
}
```

עכשיו נגיד שיישום הצ'אט שלנו מכיל רשימת אנשי קשר, ואנו רוצים לרנדר שמות של משתמשים מחוברים עם צבע ירוק. נוכל להעתיק ולהדביק לוגיקה דומה לעיל לתוך הקומפוננטה `FriendListItem` אבל זה לא יהיה אידיאלי:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

במקום, נרצה לשתף את לוגיקה זו בין `FriendStatus` ו-`FriendListItem`.

באופן מסורתי ב-React, היו לנו שתי דרכים פופולריות לשתף לוגיקה שהיא stateful בין קומפוננטות: [render props](/docs/render-props.html) [וקומפוננטות מסדר גבוה יותר](/docs/higher-order-components.html). כעת נסתכל על איך Hooks פותרים הרבה מאותן בעיות מבלי להכריח אותנו להוסיף עוד קומפוננטות לעץ.

## חילוץ Hook מותאם אישית {#extracting-a-custom-hook}

כשאנו רוצים לשתף לוגיקה בין שתי פונקציות JavaScript, אנו מחלצים אותה לפונקציה שלישית. שתי הקומפוננטות וה-Hooks הם פונקציות, אז זה עובד גם בשבילם!

**Hook מותאם אישית הוא פונקציית JavaScript ששמה מתחיל עם "use" והיא יכולה לקרוא ל-Hooks אחרים.** לדוגמה, `useFriendStatus` היא ה-Hook המותאם אישית הראשון שלנו:

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

אין שום דבר חדש בתוכו – הלוגיקה מועתקת מהקומפוננטות לעיל. בדיוק כמו בתוך קומפוננטה, תוודא שאתה קורא ל-Hooks אחרים ללא תנאי ברמה העליונה של ה-Hook המותאם אישית שלך.

בשונה מקומפוננטת React, Hook מותאם אישית לא צריך שתהיה לו חתימה ספציפית. אנחנו יכולים להחליט מה הוא לוקח כארגומנטים, ומה, אם בכלל, הוא אמור להחזיר. במילים אחרות, זה בדיוק כמו פונקציה רגילה. השם שלה צריך להתחיל תמיד עם `use` כך שתמיד נוכל לדעת [שחוקי Hooks](/docs/hooks-rules.html) תקפים לגביה.

המטרה של ה-Hook `useFriendStatus` היא לעשות לנו subscribe לסטטוס של חבר. זאת הסיבה שהוא מקבל את `friendID` כארגומנט, ומחזיר האם החבר מחובר או לא:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

עכשיו נראה כיצד נוכל להשתמש ב-Hook המותאם אישית.

## שימוש ב-Hook מותאם אישית {#using-a-custom-hook}

בהתחלה, המטרה המוצהרת שלנו הייתה להסיר את הלוגיקה הכפולה מהקומפוננטות `FriendStatus` ו-`FriendListItem`. שניהם רצו לדעת האם חבר מחובר.

עכשיו כשחילצנו את הלוגיקה הזו ל-Hook `useFriendStatus`, אנחנו יכולים *פשוט להשתמש בה:*

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'טוען...';
  }
  return isOnline ? 'מנותק' : 'מחובר';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**האם קוד זה שווה ערך לדוגמאות המקוריות?** כן, הוא עובד בדיוק באותה דרך. אם נסתכל קרוב יותר, נראה שלא ביצענו שינויים להתנהגות. כל מה שעשינו הוא לחלץ קוד נפוץ בין שני פונקציות לתוך פונקציה נפרדת. **Hooks מותאמים אישית הם מוסכמה שנובעת מהעיצוב של Hooks, מאשר פיצ'ר של React.

**האם אני צריך להוסיף לשם של ה-Hooks המותאמים אישית "use" בהתחלה?** בבקשה עשה זאת. המוסכמה הזו היא חשובה מאוד. בלעדיה, לא נוכל לבדוק באופן אוטומטי הפרות של [חוקי Hooks](/docs/hooks-rules.html) בגלל שלא נוכל לדעת אם פונקציה מסוימת מכילה קריאות ל-Hooks בתוכה.

**האם שני קומפוננטות שמשתמשות באותו Hook חולקות state?** לא. Hooks מותאמים אישית הם מנגנון לשימוש חוזר *בלוגיקה שהיא stateful* (כמו הגדרת subscription ולזכור את הערך הנוכחי), אבל בכל פעם שאתה משתמש ב-Hook מותאם אישית, כל ה-state וה-effects בתוכן הם מבודדים לגמרי.

**איך Hook מותאם אישית מקבל state מבודד?** כל *קריאה* ל-Hook מקבל state מבודד. בגלל שאנו קוראים ל-`useFriendStatus` ישירות, מנקודת המבט של React הקומפוננטה שלנו קוראת ל-`useState` ו-`useEffect`. וכמו [שלמדנו](/docs/hooks-state.html#tip-using-multiple-state-variables) [קודם](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), אנו יכולים לקרוא ל-`useState` ו-`useEffect` פעמים רבות בקומפוננטה אחת, והם יהיו עצמאים לגמרי.

### טיפ: העבר מידע בין Hooks {#tip-pass-information-between-hooks}

מכיוון ש-Hooks הם פונקציות, ניתן להעביר מידע ביניהם.

להדגים זאת, נשתמש בקומפוננטה אחת מדוגמת הצ'אט ההיפותטית שלנו. זה בורר נמען של הודעות צ'אט שמציג האם החבר הנבחר הוא מחובר:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

אנחנו שומרים את ה-ID חבר הנבחר במשתנה state `recipientID`, ומעדכנים אותו אם המשתמש בוחר חבר אחר ב-`<select>`.

בגלל שהקריאה ל-Hook `useState` נותנת לנו את הערך האחרון של המשתנה state `recipientID`, אנחנו יכולים להעביר את זה ל-Hook המותאם אישית שלנו `useFriendStatus` כארגומנט:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

זה נותן לנו לדעת האם החבר *שכרגע נבחר* הוא מחובר. אם אנחנו בוחרים חבר אחר ומעדכנים את המשתנה `recipientID`, ה-Hook `useFriendStatus` שלנו יבצע unsubscribe מהחבר שנבחר קודם לכן, ויעשה subscribe לסטטוס של הנבחר החדש.

## `useYourImagination()` {#useyourimagination}

Hooks מותאמים אישית מציעים את הגמישות של שיתוף לוגיקה שלא היה אפשרי בקומפוננטות React בעבר. אתה יכול לכתוב Hooks מותאמים אישית שמכסים מגוון רחב של מקרי שימוש כמו טיפול בטפסים, אנימציה, declarative subscriptions, טיימרים, וכנראה הרבה עוד שלא שקלנו עדיין. ובנוסף, אתה יכול לבנות Hooks שהם קלים לשימוש כמו פיצ'רים של React.

נסה לא להוסיף הפשטות מוקדם מדי. עכשיו שקומפוננטות פונקציה יכולות לעשות יותר, סביר להניח שקומפוננטת הפונקציה הממוצעת בקוד שלך תהפוך לארוכה יותר. זה נורמלי – אל תרגיש שאתה *חייב* ישר לפצל אותה ל-Hooks. אבל אנחנו גם מעודדים אותך להתחיל לאתר מקרים שבהם Hook מותאם אישית יוכל להסתיר לוגיקה מורכבת מאחורי ממשק פשוט, או לעזור לפרום קומפוננטה בעייתית.

לדוגמה, אולי יש לך קומפוננטה מורכבת שמכילה הרבה local state שמנוהל בדרך של גופו של עניין. `useState` אינו מרכז את לוגיקת העדכון בקלות כך שיכול להיות שתעדיף לכתוב את זה בתור [Redux](https://redux.js.org/) reducer:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... פעולות אחרות ...
    default:
      return state;
  }
}
```

Reducers הם נוחים לבדיקה בבידוד, ובקנה מידה כדי לבטא לוגיקת עדכון מורכבת. ניתן לפרק אותם ל-reducers קטנים יותר במידת הצורך. למרות זאת, תוכל גם ליהנות מהיתרונות של שימוש ב-local state ב-React, או שלא תרצה להתקין ספרייה נוספת.

אז מה אם נוכל לכתוב `useReducer` Hook שמאפשר לנו לנהל *local state* של הקומפוננטה שלנו עם reducer? גרסה מופשטת של זה יכולה להיראות כמו זה:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

עכשיו נוכל להשתמש בזה בתוך הקומפוננטה שלנו, ולתת ל-reducer לטפל בניהול state:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

הצורך לנהל local state עם reducer בקומפוננטה מורכבת הוא נפוץ מספיק כך שבנינו את `useReducer` Hook לתוך React. תוכל למצוא אותו עם Hooks מובנים אחרים [בתיעוד של Hooks API](/docs/hooks-reference.html).
