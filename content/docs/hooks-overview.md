---
id: hooks-overview
title: הצצה ל- Hooks
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hooks* הם תוספת חדשה ב-React 16.8. הם נותנים לנו להשתמש ב-state ובפיצ'רים נוספים של React מבלי לכתוב מחלקה.

Hooks הם [בעלי תאימות לאחור](/docs/hooks-intro.html#no-breaking-changes). עמוד זה מספק סקירה כללית של Hooks למשתמשי React מנוסים. זוהי סקירה מהירה. אם אתה מתבלבל במהלכה, חפש תיבה צהובה כמו זו:

>הסבר מפורט
>
>קרא את [המניע](/docs/hooks-intro.html#motivation) כדי ללמוד מדוע אנו מציגים את Hooks ל-React.

**↑↑↑ כל סעיף נגמר עם תיבה צהובה כמו זו.** התיבות מפנות להסברים מפורטים.

## 📌 State Hook {#state-hook}

דוגמה זו מרנדרת counter. כשלוחצים על הכפתור, הוא מגדיל את הערך:

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // הגדרת משתנה state חדש, שיקרא "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>לחצת {count} פעמים</p>
      <button onClick={() => setCount(count + 1)}>
        לחץ עליי
      </button>
    </div>
  );
}
```

כאן, `useState` הוא *Hook* (נדבר על מה זה אומר בעוד רגע). אנחנו קוראים לו בתוך קומפננטת פונקציה על מנת להוסיף לו state מקומי. React תשמר את ה-state הזה בין רינדורים. `useState` מחזירה זוג: ערך ה- state *העכשווי* ופונקציה שמאפשרת לנו לעדכן אותו. ניתן לקרוא לה מתוך event handler או ממקום אחר. זה דומה ל- `this.setState` במחלקה, מלבד שזה לא ממזג את ה-state הישן עם החדש. (נראה דוגמה שמשווה בין `useState` ל-`this.state` ב-[שימוש ב- State Hook](/docs/hooks-state.html).)

הקלט היחיד ל-`useState` הוא ה-state ההתחלתי. בדוגמה שלעיל, זה `0` מכיון שה-counter שלנו מתחיל מאפס. שים לב שבניגוד ל-`this.state`, ה-state כאן לא חייב להיות עצם -- למרות שהוא יכול אם תרצה. נעשה שימוש בקלט ה-state ההתחלתי רק בזמן הרינדור הראשון.

#### הגדרת משתני state מרובים {#declaring-multiple-state-variables}

ניתן להשתמש ב-State Hook יותר מפעם אחת בקומפוננטה יחידה:

```js
function ExampleWithManyStates() {
  // הגדר מספר משתני state!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

[תחביר ההשמה המפורקת](https://developer.mozilla.org/he/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) נותן לנו אפשרות לתת שמות שונים למשתני ה-state שהגדרנו על ידי קריאה ל-`useState`. שמות אלו אינם חלק מה-API של `useState`. במקום זאת, React מניחה שאם אתה קורא ל-`useState` פעמים מרובות, אתה עושה זאת באותו סדר בזמן כל רינדור. נחזור חזרה ללמה זה עובד ומתי זה שימושי מאוחר יותר.

#### אבל מה זה Hook? {#but-what-is-a-hook}

Hooks הם פונקציות שנותנות לך “להתחבר” ל-state של React ותכונות מחזור חיים מתוך קומפוננטות פונקציה. Hooks לא עובדים בתוך מחלקות -- הם נותנים לך להשתמש ב-React מבלי לכתוב מחלקות. (אנחנו [לא ממליצים](/docs/hooks-intro.html#gradual-adoption-strategy) לשכתב את הקומפוננטות הקיימות שלך בין לילה, אבל תוכל להתחיל להשתמש ב-Hooks בקומפוננטות חדשות אם תרצה.)

React מספקת מספר Hooks מובנים כמו `useState`. אתה יכול בנוסף ליצור Hooks משלך ולעשות שימוש חוזר בלוגיקה שהיא stateful בין קומפוננטות שונות. נעיף מבט ב-Hooks המובנים לפני הכל.

>הסבר מפורט
>
>תוכל ללמוד עוד על State Hook בעמוד ייעודי: [שימוש ב-State Hook](/docs/hooks-state.html).

## ⚡️ Effect Hook {#effect-hook}

רוב הסיכויים שביצעת בעבר data fetching, subscriptions או שינוי ידני של ה-DOM מתוך קומפוננטות ב-React. אנחנו קוראים לפעולות אלו "תופעות לוואי (side effects)" (או "אפקטים") בגלל שהם יכולים להשפיע על קומפוננטות אחרות ולא יכולים לקרות בזמן רינדור.

ה-Effect Hook, `useEffect`, מוסיף את היכולת לבצע תופעות לוואי מתוך קומפוננטת פונקציה. זה משרת את אותה מטרה כמו `componentDidMount`, `componentDidUpdate`, ו- `componentWillUnmount` במחלקות React, אבל מאוחד לתוך API יחיד. (נראה דוגמאות שמשוות בין `useEffect` למתודות אלו ב[שימוש ב-Effect Hook](/docs/hooks-effect.html).)

לדוגמה, קומפוננטה זו קובעת את כותרת העמוד לאחר ש-React מעדכנת את ה-DOM:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // דומה ל-componentDidMount ו-componentDidUpdate:
  useEffect(() => {
    // עדכון כותרת העמוד על ידי שימוש ב-API הדפדפן
    document.title = `לחצת ${count} פעמים`;
  });

  return (
    <div>
      <p>לחצת {count} פעמים</p>
      <button onClick={() => setCount(count + 1)}>
        לחץ עליי
      </button>
    </div>
  );
}
```

כשאתה קורא ל-`useEffect`, אתה אומר ל-React להריץ את פונקציית ה"אפקט" שלך לאחר הזרמת השינויים ל-DOM. אפקטים מוגדרים בתוך הקומפוננטה כך שיש להם גישה ל-props ול-state שלה. כברירת מחדל, React מריצה את האפקטים לאחר כל רינדור -- *כולל* הרינדור הראשון. (נדבר עוד בהמשך על כיצד זה משתווה למחזור החיים במחלקות ב[שימוש ב-Effect Hook](/docs/hooks-effect.html).)

אפקטים יכולים גם לציין איך "לנקות" אחרי עצמם על ידי החזרת פונקציה. לדוגמה, קומפוננטה זו משתמש באפקט על מנת לעשות subscribe לסטטוס אונליין של חבר, ומנקה על ידי ביצוע unsubscribe ממנו:

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
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

בדוגמה זו, React תבצע unsubscribe מ-`chatAPI` שלנו כשהקומפוננטה מבצעת unmounting, כמו גם לפני הרצה מחדש של האפקט בגלל רינדור עוקב. (אם אתה רוצה, יש דרך [לומר ל-React לדלג על re-subscribing ](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) אם `props.friend.id` שהעברנו ל-`ChatAPI` לא השתנה.)

בדיוק כמו עם `useState`, אתה יכול להשתמש ביותר מאפקט אחד בתוך קומפוננטה:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `לחצת ${count} פעמים`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

Hooks נותנים לך לארגן תופעות לוואי בקומפוננטה לפי החלקים הקשורים (כגון הוספת והסרת subscription), במקום לאלץ פיצול המבוסס על מתודות מחזור חיים.

>הסבר מפורט
>
>תוכל ללמוד עוד על `useEffect` בעמוד ייעודי: [שימוש ב-Effect Hook](/docs/hooks-effect.html).

## ✌️ חוקי Hooks {#rules-of-hooks}

JavaScript הם פונקציות Hooks, אך הם מטילים שני חוקים נוספים:

* ניתן לקרוא ל-Hooks **רק ברמה העליונה**. אל תקרא ל-Hooks בתוך לולאות, פקודות תנאי, או פונקציות מקוננות.
* קרא ל-Hooks **רק מתוך קומפוננטות פונקציה של React**. אל תקרא ל-Hooks מתוך פונקציות JavaScript רגילות. (יש רק מקום אחד נוסף שניתן לקרוא ל-Hooks ממנו -- Hooks מותאמים אישית משלך. נלמד עליהם בעוד רגע.)

אנחנו מספקים [תוסף linting](https://www.npmjs.com/package/eslint-plugin-react-hooks) שאוכף חוקים אלו אוטומטית. אנו מבינים שחוקים אלו עלולים להיראות כמגבילים או מבלבלים בהתחלה, אך הם חיוניים כדי לגרום ל-Hooks לעבוד היטב.

>הסבר מפורט
>
>ניתן ללמוד עוד על חוקים אלו בעמוד ייעודי: [חוקי Hooks](/docs/hooks-rules.html).

## 💡 בניית Hooks משלך {#building-your-own-hooks}

לעיתים, אנו רוצים לעשות שימוש חוזר בלוגיקה שהיא stateful בין קומפוננטות. באופן מסורתי, היו שני פתרונות נפוצים לבעיה זו: [קומפוננטות מסדר גבוה](/docs/higher-order-components.html) ו-[render props](/docs/render-props.html). Hooks מותאמים אישית נותנים לך לעשות זאת, אבל מבלי להוסיף עוד קומפוננטות לעץ שלך.

מוקדם יותר בעמוד זה, הצגנו את קומפוננטה `FriendStatus` שקוראת ל-`useState` ו-`useEffect` על מנת לעשות subscribe לסטטוס חיבור אונליין של חבר. נגיד שנרצה בנוסף לבצע שימוש חוזר בלוגיקה זו בקומפוננטה אחרת.

ראשית, נחלץ לוגיקה זו לתוך Hook מותאם אישית שנקרא לו `useFriendStatus`:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

הוא לוקח את `friendID` כקלט, ומחזיר האם החבר שלנו מחובר או לא.

עכשיו נוכל להשתמש בזה מתוך שתי הקומפוננטות:


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'טוען...';
  }
  return isOnline ? 'מחובר' : 'מנותק';
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

<<<<<<< HEAD
ה-state של קומפוננטות אלה הוא עצמאי לחלוטין. Hooks הם דרך לעשות שימוש חוזר ב*לוגיקה שהיא stateful*, לא ב-state עצמו. למעשה, לכל *קריאה* ל-Hook יש state מבודד לגמרי -- כך שניתן להשתמש באותו Hook מותאם אישית פעמיים בקומפוננטה אחת.
=======
The state of each component is completely independent. Hooks are a way to reuse *stateful logic*, not state itself. In fact, each *call* to a Hook has a completely isolated state -- so you can even use the same custom Hook twice in one component.
>>>>>>> 63332462bb5afa18ac7a716975b679f4c23cc8a1

Hooks מותאמים אישית הם יותר מוסכמה מאשר פיצ'ר. אם שם של פונקציה מתחיל עם "`use`" והיא קוראת ל-Hooks אחרים, אנחנו אומרים שהיא Hook מותאם אישית. המוסכמה של לתת שמות כמו `useSomething` היא הסיבה שתוסף ה- linting שלנו מסוגל לאתר באגים בקוד שמשתמש ב-Hooks.

ניתן לכתוב Hooks מותאמים אישית שמכסים טווח רחב של תרחישי שימוש כגון טיפול בטפסים, אנימציה, declarative subscriptions, טיימרים וכנראה עוד מקרים שלא לקחנו בחשבון עדיין. אנחנו נרגשים לראות אילו Hooks מותאמים אישית הקהילה תמציא.

>הסבר מפורט
>
>ניתן ללמוד עוד על Hooks מותאמים אישית בעמוד ייעודי: [בניית Hooks משלך](/docs/hooks-custom.html).

## 🔌 Hooks אחרים {#other-hooks}

ישנם כמה Hooks מובנים שאולי תמצא שימושיים. לדוגמה, [`useContext`](/docs/hooks-reference.html#usecontext) נותן לך לעשות subscribe ל-context ב-React מבלי להשתמש בקינון:

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

ו-[`useReducer`](/docs/hooks-reference.html#usereducer) נותן לך לנהל state מקומי של קומפוננטות מורכבות עם reducer:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>הסבר מפורט
>
>ניתן ללמוד עוד על Hooks מובנים בעמוד ייעודי: [עיון ב-Hooks API](/docs/hooks-reference.html).

## הצעדים הבאים {#next-steps}

זה היה מהיר! אם יש כמה דברים שלא כל כך הגיוניים לך או שתרצה ללמוד יותר לעומק, תוכל לקרוא את העמודים הבאים, התחל מתיעוד של [State Hook](/docs/hooks-state.html).

תוכל לבחון גם את העיון של [Hooks API](/docs/hooks-reference.html) ואת [Hooks FAQ](/docs/hooks-faq.html).

לבסוף, אל תחמיץ את [עמוד ההקדמה](/docs/hooks-intro.html) שמסביר *למה* אנחנו מוסיפים Hooks ואיך נתחיל להשתמש בהם לצד מחלקות -- מבלי לשכתב את האפליקציות שלנו.
