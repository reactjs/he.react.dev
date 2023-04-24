---
id: hooks-state
title: שימוש ב-Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
> - [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
> - [`useEffect`](https://react.dev/reference/react/useEffect)

</div>

*Hooks* נוספו ב-React 16.8. הם מאפשרים לנו להשתמש ב- state ופיצ'רים נוספים של ריאקט מבלי לכתוב מחלקה.

ה-*Effect Hook* נותן לנו לבצע תופעות לוואי בתוך קומפוננטות פונקציונליות:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // דומה ל- ComponentDidMount ו- componentDidUpdate:
  useEffect(() => {
    // עדכון כותרת העמוד על ידי שימוש ב-API של הדפדפן
    document.title = `You clicked ${count} times`;
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

הקטע לעיל מבוסס על [דוגמת ה- counter מהעמוד הקודם](/docs/hooks-state.html), אבל הוספנו פיצ'ר חדש לזה: קובעים את כותרת העמוד להודעה מותאמת כשכוללת את מספר ההקלקות.

אחזור מידע, הגדרת subscription, ושינוי ידני של ה- DOM בקומפוננטות ריאקט הם כולם דוגמאות של תופעות לוואי. בין אם לאו דווקא אתה רגיל לקרוא לפעולות הללו "תופעות לוואי" (או רק "תופעות"), רוב הסיכויים שביצעת אותן בקומפוננטות שלך בעבר.

>טיפ
>
>אם יש לך נסיון עם מתודות מחזור חיים במחלקות ריאקט, אתה יכול לחשוב על `useEffect` כ- `componentDidMount`, `componentDidUpdate`, ו- `componentWillUnmount` משולבות.

ישנם שני סוגים של תופעות לוואי בקומפוננטות ריאקט: אלה שלא דורשים ניקוי, ואלה שכן. נסתכל על הבחנה זו ביתר פירוט.

## Effects ללא ניקוי {#effects-without-cleanup}

לעיתים, אנו רוצים **להריץ קוד נוסף לאחר שריאקט עדכנה את ה- DOM.** בקשות רשת, שינויים ידניים של ה- DOM, ו- logging הם דוגמאות של effects שלא דורשים ניקוי. אנו אומרים זאת בגלל שניתן להריץ אותם ומיד לשכוח מהם. הבה נשווה בין איך מחלקות ו-Hooks נותנים לנו לבטא את תופעות הלוואי הללו.

### דוגמאות עם שימוש במחלקות {#example-using-classes}

במחלקות קומפוננטות בריאקט, המתודה `render` לא אמורה ליצור תופעות לוואי. זה יהיה מוקדם מדי – בדרך כלל נרצה לבצע את ה- effects שלנו *לאחר* שריאקט עדכנה את ה- DOM.

זאת הסיבה שבמחלקות ריאקט, אנו שמים תופעות לוואי בתוך `componentDidMount` ו- `componentDidUpdate`. בחזרה לדוגמה שלנו, הנה מחלקת counter בקומפוננטה שמעדכנת את כותרת העמוד מיד לאחר שריאקט משנה את ה-DOM:

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `לחצת ${this.state.count} פעמים`;
  }

  componentDidUpdate() {
    document.title = `לחצת ${this.state.count} פעמים`;
  }

  render() {
    return (
      <div>
        <p>לחצת {this.state.count} פעמים</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          לחץ עליי
        </button>
      </div>
    );
  }
}
```

שים לב כיצד **אנו צריכים לשכפל את הקוד בין שתי מתודות מחזור החיים במחלקה.**

זה בגלל שבמקרים רבים אנו רוצים לבצע את אותה תופעת הלוואי ללא קשר לאם הקומפוננטה "הותקנה"(mounted), או אם היא עודכנה. מבחינה מושגית, אנו רוצים שזה יקרה אחרי כל רינדור – אבל לקומפוננטות מחלקתיות בריאקט אין מתודה כזאת. נוכל לחלץ מתודה נפרדת אבל נצטרך עדיין לקרוא לה בשתי מקומות. 

הבה נראה כיצד נוכל לעשות את אותו הדבר עם `useEffect`.

### דוגמא של שימוש ב- Hooks {#example-using-hooks}

ראינו כבר את הדוגמא הזו בראש העמוד, אבל הבה נסתכל עליה מקרוב:

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
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

**מה useEffect עושה?** על ידי שימוש ב-Hook הזה, אנו אומרים לריאקט שהקומפוננטה שלך צריכה לעשות משהו לאחר הרינדור. ריאקט תזכור את הפונקציה שהעברת (נתייחס אל זה כה- effect שלנו), ונקרא לה לאחר ביצוע עדכוני ה-DOM. ב-effect הזה, אנו קובעים את כותרת העמוד, אבל נוכל בנוסף לבצע אחזור מידע או לקרוא ל- API  הכרחי אחר.

**מדוע קוראים ל- useEffect בתוך קומפוננטה?** הצבת `useEffect` בתוך הקומפוננטה נותנת לנו גישה למשתנה- `count ` state (או כל prop אחר) ישר מה-effect. אנו לא צריכים API מיוחד על מנת לקרוא אותו – זה כבר בתוך ה- scope של הפונקציה. Hooks משתמשים ב- closures ונמנעים מהצגת APIs ספציפיים של ריאקט היכן ש-JavaScript נותנת פתרון.

**האם useEffect רץ אחרי כל רינדור?** כן! כברירת מחדל, זה רץ גם אחרי הרינדור הראשון *וגם* אחרי כל עדכון. (נדבר אחר כך על [להתאים אישית את זה](#tip-optimizing-performance-by-skipping-effects).) במקום לחשוב במונחים של "mounting" ו-"עדכון", יכול להיות שיהיה לך יותר קל לחשוב ש-effects קורים "אחרי רינדור". ריאקט מבטיח שה-DOM עודכן כאשר זה מריץ את ה- effects.

### הסבר מפורט {#detailed-explanation}

עכשיו כשאנו יודעים עוד על effects, השורות הבאות אמורות להיות מובנות:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `לחצת ${count} פעמים`;
  });
}
```

אנו מצהירים על המשתנה state `count`, ואז אנו אומרים לריאקט שאנחנו צריכים להשתמש ב- effect. נעביר פונקציה ל- `useEffect`. הפונקציה שאנו מעבירים היא ה-effect שלנו. בתוך ה- effect  שלנו, נקבע את כותרת העמוד על ידי שימוש ב- `document.title` שהוא חלק מה-API של הדפדפן. נוכל לקרוא את ה-`count` האחרון בתוך ה- effect בגלל שהוא בתוך ה-scope של הפונקציה שלנו. כשריאקט מרנדר את הקומפוננטה שלנו, הוא יזכור את ה- effect שבו השתמשנו, ואז יריץ את ה- effect לאחר שיעדכן את ה-DOM. זה קורה לכל רינדור, כולל הראשון.

מפתחי JavaScript מנוסים אולי ישימו לב שהפונקציה שמועברת ל- `useEffect` הולכת להיות שונה לכל רינדור. זה נעשה בכוונה. למעשה, זה מה שנותן לנו לקרוא את הערך `count` מתוך ה- effect מבלי לדאוג שהוא לא יהיה עדכני. כל זמן שאנו מרנדרים מחדש, אנחנו מתזמנים effect _אחר_, שמחליף את קודמו. במידה מסוימת, זה גורם ל- effects להתנהג יותר כמו חלק מתוצאת הרינדור – כל effect "שייך" לרינדור מסוים. נראה יותר ברור למה זה שימושי [בהמשך העמוד](#explanation-why-effects-run-on-each-update).

>טיפ
>
>בניגוד ל- `componentDidMount` או `componentDidUpdate`, effects שמתוזמנים עם `useEffect` לא חוסמים את הדפדפן מלעדכן את המסך. זה גורם ליישום שלך להרגיש יותר רספונסיבי. הרוב ה- effects לא צריכים להתקיים באופן סינכרוני. במקרים הנדירים שהם כן מתקיימים בסינכרוניות (כמו מדידת ה- layout), יש [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) נפרד עם API מקביל ל- `useEffect`.

## Effects עם ניקוי {#effects-with-cleanup}

למרות זאת, ישנם effects שכן דורשים. לדוגמא, **אולי נרצה להגדיר subscription** למקור מידע חיצוני כלשהו. במקרה זה, זה חשוב לנקות על מנת שלא תהיה דליפת זיכרון! נשווה איך ניתן לעשות זאת עם מחלקות ו- Hooks.

### דוגמה עם שימוש במחלקות {#example-using-classes-1}

במחלקת ריאקט, בדרך כלל מגדירים subscription בתוך `componentDidMount`, ומנקים אותו בתוך `componentWillUnmount`. לדוגמה, נגיד שיש לנו מודול `ChatAPI` שנותן לנו לעשות subscribe לסטטוס חיבור של חבר אונליין. הנה איך נוכל לעשות subscribe לסטטוס ולהציג אותו על ידי שימוש במחלקה:

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'טוען...';
    }
    return this.state.isOnline ? 'מחובר' : 'לא מחובר';
  }
}
```

שים לב איך `componentDidMount` ו- `componentWillUnmount` צריכים לשקף אחד את השני. מתודות מחזור חיים מכריחות אותנו לפצל את הלוגיקה למרות שבאופן מושגי הקוד בשניהם קשור לאותו effect.

>הערה
>
>קוראים חדי-עין ישימו לב שדוגמה זאת צריכה בנוסף מתודת `componentDidUpdate` כדי להיות נכונה לחלוטין. נתעלם מכך אבל נחזור לזה [בחלק אחר](#explanation-why-effects-run-on-each-update) של העמוד.

### דוגמה עם שימוש ב- Hooks {#example-using-hooks-1}

הבה נראה איך נוכל לכתוב את קומפוננטה זו בשימוש של Hooks.

יכול להיות שאתה חושב שנצטרך effect נפרד על מנת לבצע את הניקוי. אולם קוד שמיועד להוספה ולהסרה של subscription כל כך קשור ש- `useEffect` מתוכנן להשאיר אותו ביחד. אם ה-effect שלך מחזיר פונקציה, ריאקט יריץ אותה כשיגיע הזמן לנקות:

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // ציין איך לנקות אחרי ה-effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'טוען...';
  }
  return isOnline ? 'מחובר' : 'לא מחובר';
}
```

**מדוע החזרנו פונקציה מה- effect שלנו?** זה מנגנון ניקוי אופציונאלי ל- effects. כל effect יכול להחזיר פונקציה שמנקה אחריה. זה נותן לנו להשאיר את הלוגיקות להוספה והסרה של subscriptions קרובות אחת לשניה. הן חלק מאותו effect!

**מתי בדיוק ריאקט מנקה אחרי effect?** ריאקט מבצעת את הניקיון בזמן unmounting של קומפוננטה. למרות זאת, כפי שלמדנו קודם, effects רצים אחרי כל רינדור ולא רק פעם אחת. זאת הסיבה שריאקט מנקה *גם* effects מרינדורים קודמים לפני הרצת effects בפעם הבאה. נדבר על [למה זה עוזר לנו להימנע מבאגים](#explanation-why-effects-run-on-each-update) [וגם איך להימנע מהתנהגות זו במקרה וזה יוצר בעיות מבחינת ביצועים.](#tip-optimizing-performance-by-skipping-effects) בהמשך.

>הערה
>
>אנו לא צריכים להחזיר פונקציה עם שם מ- effect זה. קראנו לה `cleanup` פה כדי להבהיר את מטרתה, אך תוכל להחזיר arrow function או לקרוא לה בשם אחר.

## סיכום {#recap}

למדנו ש- `useEffect` נותן לנו להביע סוגים שונים של תופעות לוואי לאחר רינדור קומפוננטה. בגלל ש- effects מסוימים דורשים ניקיון הם מחזירים פונקציה:

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Effects אחרים לא ידרשו שלב ניקיון, מכאן שלא יחזירו כלום.

```js
  useEffect(() => {
    document.title = `לחצת ${count} פעמים`;
  });
```

ה-Effect Hook מאחד בו את שני מקרי השימוש ב- API אחד.

-------------

**אם אתה מרגיש מרגיש שיש לך תפיסה טובה של איך Effect Hook עובד, או אם אתה מרגיש שזה יותר מדי מידע, תוכל לעבור [לעמוד הבא שמדבר על חוקי Hooks](/docs/hooks-rules.html) עכשיו.**

-------------

## טיפים לשימוש ב- Effects {#tips-for-using-effects}

נמשיך את עמוד זה עם מבט מעמיק על כמה מההיבטים של `useEffect` שיכולים לעניין משתמשי ריאקט מנוסים. אין חובה להעמיק בהם עכשיו. תוכל תמיד לחזור לעמוד זה על מנת ללמוד עוד פרטים על Effect Hook.

### טיפ: השתמש במספר effects לבעיות נפרדות {#tip-use-multiple-effects-to-separate-concerns}

אחת מהבעיות שפירטנו עליה [במוטיבציה](/docs/hooks-intro.html#complex-components-become-hard-to-understand) ל- Hooks היא שמחלקות מתודות מחזור חיים מכילות לוגיקה לא קשורה, אך לוגיקה קשורה מפוצלת לכמה מתודות. הנה קומפוננטה שמחברת את לוגיקת ה-counter ודוגמת בדיקת הסטטוס חבר אונליין מהדוגמאות הקודמות:

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `לחצת ${this.state.count} פעמים`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `לחצת ${this.state.count} פעמים`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

שים לב איך הלוגיקה שמגדירה את `document.title` מפוצלת בין `componentDidMount` ו- `componentDidUpdate`. לוגיקת הסטטוס גם היא מפוצלת בין `componentDidMount` ו- `componentWillUnmount`. ו- `componentDidMount` מכילה קוד לשתי המטלות.

אז, איך Hooks פותרים את בעיה זו? כמו [שניתן להשתמש ב- *State* Hook יותר מפעם אחת](/docs/hooks-state.html#tip-using-multiple-state-variables), ניתן להשתמש במספר effects. זה נותן לנו לפצל לוגיקה לא קשורה ל- effects שונים:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `לחצת ${count} פעמים`;
  });

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
  // ...
}
```

**Hooks נותנים לנו לפצל קוד בהתבסס על מה שהוא עושה** ולא בהתבסס על שם מתודת מחזור חיים. ריאקט יחיל *כל* effect שמשומש על ידי הקומפוננטה, בסדר שהן צוינו.

### הסבר: למה effects רצים על כל עדכון {#explanation-why-effects-run-on-each-update}

אם אתה רגיל למחלקות, יכול להיות שאתה תוהה למה שלב ניקוי ה-effect קורה לאחר כל רינדור מחדש, ולא רק פעם אחת בזמן unmounting. הבא נראה דוגמה פרקטית שמסבירה למה תכנון זה עוזר לנו ליצור קומפוננטות עם פחות באגים.

[מוקדם יותר בעמוד זה](#example-using-classes-1), הצגנו את הקומפוננטה `FriendStatus` שמציגה האם חבר מחובר או לא. המחלקה שלנו קוראת את `friend.id` מ- `this.props`, מתחברת לסטטוס החבר לאחר ה-mounting של הקומפוננטה, ומתנתקת בזמן unmounting:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**אבל מה קורה אם ה- friend prop משתנה** בזמן שהקומפוננטה על המסך? הקומפוננטה שלנו תמשיך להציג את הסטטוס של חבר אחר. זה באג. נגרום גם לדליפת זיכרון או קריסה בזמן unmounting בגלל שקריאת ההתנתקות תשתמש ב- id השגוי של החבר.

בקומפוננטת מחלקה, נצטרך גם להוסיף `componentDidUpdate` לטפל במקרה זה:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // התנתק מה- friend.id הקודם
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // התחבר ל- friend.id הבא
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

מקור נפוץ של באגים הוא מפתחים ששוכחים לטפל ב- `componentDidUpdate` ביישומי ריאקט.

עכשיו נשקול את הגרסה הזו של הקומפוננטה שמשתמשת ב- Hooks:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

היא לא סובלת מבאג זה. ( אבל לא שינינו אותה גם.)

אין קוד מיוחד לטיפול בעדכונים בגלל ש- `useEffect` מטפלת בהם *כברירת מחדל*. היא מנקה את ה-effects הקודמים לפני השמת ה-effects הבאים. על מנת להדגים זאת, הנה רצף של קריאות התחברות והתנתקות שהקומפוננטה יכולה ליצר לאורך זמן:

```js
// Mount עם { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // הרצת effect ראשון

// עדכון עם { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // ניקוי effect קודם
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // הרצת ה-effect הבא

// עדכון עם { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // ניקוי effect קודם
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // הרצת ה-effect הבא

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // ניקוי ה- effect האחרון
```

התנהגות זאת מבטיחה עקביות כברירת מחדל ומונעת באגים נפוצים בקומפוננטות מחלקה בגלל לוגיקת עדכון חסרה.

### טיפ: מיטוב ביצועים על ידי דילוג על effects {#tip-optimizing-performance-by-skipping-effects}

במקרים מסוימים, ניקיון או השמת effect לאחר כל רינדור יכולה ליצור בעיות ביצועים. בקומפוננטות מחלקה, נוכל לפתור בעיה זו על ידי כתיבה של השוואה נוספת עם `prevProps` או `prevState` בתוך `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `לחצת ${this.state.count} פעמים`;
  }
}
```

דרישה זו היא נפוצה מספיק שהיא כבר בנויה לתוך `useEffect`. אתה יכול לומר לריאקט *לדלג* על השמת effect אם ערכים מסוימים לא השתנו בין רינדורים. על מנת לעשות זאת, העבר מערך כארגומנט שני אופציונאלי ל- `useEffect`:

```js{3}
useEffect(() => {
  document.title = `לחצת ${count} פעמים`;
}, [count]); // הרץ מחדש את ה-effect אם count משתנה
```

בדוגמה לעיל, אנו מעבירים `[count]` כארגומנט שני. מה זה אומר? אם `count` שווה ל- `5`, ואז הקומפוננטה שלנו מתרנדרת מחדש עם `count` שעדיין שווה ל- `5`, ריאקט תשווה את `[5]` מהרינדור הקודם ו- `[5]` מהרינדור הבא. בגלל שכל הערכים במערך הם אותו `(5 === 5)`, ריאקט ידלג על ה-effect. זוהי האופטימיזציה שלנו.

כשאנו מרנדרים עם `count` שמעודכן ל- `6`, ריאקט תשווה את הערכים בתוך מערך ה- `[5]` מהרינדור הקודם לערכים במערך ה- `[6]` ברינדור הבא. בפעם הזו, ריאקט יישם מחדש את ה-effect בגלל ש- `5 !== 6`. אם ישנם ערכים נוספים במערך, ריאקט יריץ את ה-effect מחדש גם אם אחד מהם שונה.

זה גם עובד על effects בעלי שלב ניקיון:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // התחבר מחדש רק אם props.friend.id משתנה
```

בעתיד, יכול להיות שהארגומנט השני יוסף אוטומטית על ידי טרנספורמציה בזמן בנייה. ( build-time).

>הערה
>
>אם אתה משתמש באופטימיזציה זו, ודא שהמערך מכיל **את כל הערכים מה- scope של הקומפוננטה (כמו props ו- state) שמשתנים לאורך זמן ומשומשים על ידי ה- effect.** אחרת, הקוד שלך יתייחס לערכים ישנים מרינדורים קודמים. למד עוד על [איך לטפל בפונקציות](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) ומה [לעשות כשהמערך משתנה בתדירות גבוהה מדי](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>אם אתה רוצה להריץ effect ולנקות אותו רק פעם אחת (ב- mount ו- unmount), תוכל להעביר מערך ריק (`[]`) כארגומנט שני. זה אומר לריאקט שה- effect שלך לא תלוי *בשום* ערך מ- props או state, אז הוא לא צריך לרוץ מחדש. זה לא מטופל על ידי מקרה מיוחד – הדבר ממשיך ישירות מאיך מערך ה-dependencies תמיד עובד.
>
>אם אתה מעביר מערך ריק (`[]`), ה-props ו- state בתוך ה-effect תמיד יכילו את הערכים ההתחלתיים שלהם. בזמן שהעברת (`[]`) כארגומנט שני היא קרובה יותר למודלים המוכרים `componentDidMount` ו- `componentWillUnmount`, ישנם בדרך כלל [פתרונות טובים](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [יותר](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) על מנת להימנע מהרצה מחדש של effects מהר מדי. בנוסף, אל תשכח שריאקט דוחה את הרצת `useEffect` עד לאחר שהדפדפן "צייר" את ה-effect, אז ביצוע עבודה נוספת היא לא בעיה.
>
>אנו ממליצים על שימוש בחוק [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) כחלק מחבילת ה- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) זה מזהיר כש- dependencies מצוינים באופן לא נכון ומציעה פתרון.

## השלבים הבאים {#next-steps}

מזל טוב! זה היה עמוד ארוך, אבל אנו מקווים שבסופו רוב השאלות שלך בקשר ל- effects נענו. למדת גם על ה-state hook וגם על effect hook, ויש עוד *הרבה* שניתן לעשות עם שניהם ביחד. הם מכסים את רוב מקרי השימוש למחלקות – והיכן שהם לא, יכול להיות שתמצא את [Hooks נוספים](/docs/hooks-reference.html) שימושי.

אנו גם מתחילים לראות איך Hooks פותרים בעיות שהוצגו במוטיבציה [במוטיבציה](/docs/hooks-intro.html#motivation). ראינו איך ניקיון effect מונע שכפול ב- `componentDidUpdate` ו- `componentWillUnmount`, מביא קוד קשור קרוב יותר, ועוזר לנו להימנע מבאגים. ראינו גם איך ניתן לפצל effects לפי מטרתם, שזה משהו שלא יכולנו לעשות במחלקות כלל.

בנקודה זו יכול להיות שאתה עדיין תוהה איך Hooks עובדים. איך ריאקט יודעת איזה קריאת `useState` מתאים לאיזה משתנה state בין רינדורים? איך ריאקט "מתאימה" effects קודמים והבאים על כל עדכון? **בעמוד הבא נלמד עוד על [Rules of Hooks](/docs/hooks-rules.html) -- הם חיוניים על מנת לגרום ל- Hooks לעבוד.**
