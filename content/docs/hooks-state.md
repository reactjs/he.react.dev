---
id: hooks-state
title: שימוש ב- State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
> - [`useState`](https://react.dev/reference/react/useState)

</div>

*Hooks* הם תוסף חדש ב-React 16.8. הם מאפשרים שימוש ב- state ופיצ'רים אחרים של React מבלי לכתוב מחלקה.

[הדף הקודם](/docs/hooks-intro.html) הדף הקודם הציג Hooks עם הדוגמה הבאה:

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // הצהר משתנה state חדש, שנקרא לו "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

נתחיל ללמוד על Hooks על ידי השווה בין קוד זה לקוד המקביל שמשתמש במחלקה.

## דוגמה מקבילה עם שימוש במחלקה {#equivalent-class-example}

אם השתמשת במחלקות ב-React בעבר, קוד זה אמור להיראות מוכר:

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

ה- state מתחיל בתור `{ count: 0 }`, ואנו מוסיפים 1 ל- `state.count` כשהמשתמש לוחץ על כפתור על ידי קריאה ל- `this.setState()`. נשתמש בחלקים מהמחלקה הזו לאורך העמוד.

>הערה
>
>אתה בטח תוהה למה אנו משתמשים ב- counter כאן במקום דוגמה יותר ריאליסטית. זה במטרה לעזור לנו להתמקד ב- API בזמן שאנחנו רק מתחילים עם Hooks.

## Hooks וקומפוננטות פונקציונליות {#hooks-and-function-components}

כתזכורת, קומפוננטות פונקציונליות ב-React נראות כך:

```js
const Example = (props) => {
  // ניתן להשתמש ב- Hooks כאן!
  return <div />;
}
```

או כך:

```js
function Example(props) {
  // ניתן להשתמש ב- Hooks כאן!
  return <div />;
}
```

יכול להיות שהכרת אותם כ- "stateless componenets". אנו עכשיו מציגים את היכולת להשתמש ב- state בתוכם, אז אנחנו מעדיפים את השם "קומפוננטות פונקציונליות".

Hooks **לא** עובדים בתוך מחלקות. אך ניתן להשתמש בהם במקום כתיבת מחלקות.

## מה זה Hook? {#whats-a-hook}

הדוגמה החדשה שלנו מתחילה בייבוא של ה- Hook `useState` מ-React:

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**מה זה Hook?** Hook זה פונקציה מיוחדת שנותנת לך "להתחבר"  לפיצ'רים של React. לדוגמה, `useState` הוא Hook שנותן לך להוסיף state לקומפוננטות פונקציונליות. אנו נלמד על Hooks אחרים בהמשך.

**מתי אשתמש ב- Hook?** אם אתה כותב קומפוננטה פונקציונלית ומגלה שאתה צריך להוסיף לה state, בעבר נדרשת להמיר אותה למחלקה. עכשיו אתה יכול להשתמש ב- Hook בתוך הקומפוננטה הפונקציונלית הקיימת. אנחנו הולכים לעשות את זה עכשיו!

>הערה:
>
>ישנם כמה חוקים מיוחדים שמכתיבים איפה אפשר ואיפה אי אפשר להשתמש ב- Hooks בתוך קומפוננטה. אנו נלמד עליהם ב- [חוקי Hooks](/docs/hooks-rules.html).

## הגדרת משתנה state {#declaring-a-state-variable}

במחלקה, אנו מאתחלים את `count` ב- state ל- `0` על ידי הגדרת `this.state` ל- `{ count: 0 } בבנאי:

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

בקומפוננטה הפונקציונלית, אין לנו `this`, אז אין לנו דרך להקצות או לקרוא באמצעות `this.state`.  במקום, נקרא ל- `useState` hook ישירות מתוך הקומפוננטה שלנו:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // הצהר משתנה state חדש, שנקרא לו "count"
  const [count, setCount] = useState(0);
```

**מה קריאה ל- useState עושה?** זה מגדיר "משתנה state". המשתנה שלנו נקרא `count` אך נוכל לקרוא לו בכל שם אחר, כמו `banana`. זוהי דרך "לשמור" על ערכים בין קריאות פונקציה -- `useState` היא דרך חדשה להשיג את אותן מטרות שהשגנו באמצעות `this.state` במחלקה. בדרך כלל, משתנים "נעלמים" כשהפונקציה מסיימת את פעולתה אבל משתני state נשמרים על ידי React.

**מה אנו מעבירים ל- useState כקלט?** הקלט היחיד ל- `useState()` hook הוא ה- state ההתחלתי. שלא כמו מחלקות, state לא חייב להיות אובייקט. אנו יכולים לשמור מספר או מחרוזת אם זה מה שאנו צריכים. בדוגמה שלנו, אנו רוצים מספר שיופיע בהתאם למספר ההקלקות של המשתמש, אז נעביר `0` כ- state התחלתי למשתנה שלנו. (אם נרצה לשמור שתי ערכים שונים ב- state, נקרא ל- `useState()` פעמיים.)

**מה `useState` מחזיר?** מחזיר זוג של ערכים: ה- state העכשווי ופונקציה שמעדכנת אותו. זוהי הסיבה שאנחנו כותבים `const [count, setCount] = useState()`. זה דומה ל- `this.state.count` ול- `this.setState` במחלקה, חוץ מהעובדה שמקבלים אותם בזוג. אם אתה לא מכיר את ה- syntax שהשתמשנו בו, נחזור אליו [בתחתית העמוד הזה](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

עכשיו שאנו יודעים מה `useState` hook עושה, הדוגמה שלנו אמורה להיראות יותר הגיונית:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // הצהר משתנה state חדש, שנקרא לו "count"
  const [count, setCount] = useState(0);
```

אנו מגדירים משתנה state חדש בשם `count`, וקובעים אותו כ- `0`. React יזכור את הערך נוכחי בין רינדורים, ויספק את הערך האחרון לפונקציה שלנו. אם אנחנו רוצים לעדכן את ה- `count` הנוכחי, נקרא ל- `setCount`.

>הערה
>
>יכול להיות שאתה תוהה: מדוע `useState` לא נקרא `createState` במקום?
>
>"Create" לא יהיה מדויק בגלל שה- state נוצר בפעם הראשונה רק כשהקומפוננטה שלנו מרונדרת. במהלך הרינדורים הבאים, `useState` נותן לנו את ה- state הנוכחי. אחרת לא זה לא היה "state" בכלל! ישנה גם סיבה למה שמות של Hooks מתחילים תמיד עם `use`. נלמד למה מאוחר יותר [בחוקי Hooks](/docs/hooks-rules.html).

## קריאת state {#reading-state}

כשאנו רוצים להציג את ה- state הנוכחי במחלקה, אנו קוראים מ- `this.state.count`:

```js
  <p>You clicked {this.state.count} times</p>
```

בפונקציה, ניתן להשתמש ב- `state` ישירות:


```js
  <p>You clicked {count} times</p>
```

## עדכון state {#updating-state}

במחלקה, אנו צריכים לקרוא ל- `this.setState()` על מנת לעדכן את `count`:

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

בפונקציה, יש לנו את `setCount` ו- `count` כמשתנים אז אנחנו לא צריכים את `this`:

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## סיכום {#recap}

עכשיו **נסכם מה למדנו שורה אחרי שורה** ונבדוק את ההבנה שלנו.

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **שורה 1:**  אנו מייבאים את `useState` hook מ-React. זה נותן לנו לשמור state מקומי בתוך קומפוננטה פונקציונלית. 
* **שורה 4:**  בתוך הקומפוננטה `Example`, אנחנו מגדירים משתנה state חדש על ידי קריאה ל- `useState` hook. זה מחזיר זוג של ערכים, שלהם ניתן שמות. אנו קוראים למשתנה שלנו `count` בגלל שהוא שומר את מספר הלחיצות על הכפתור. אנחנו מגדירים אותו כ- 0 על ידי העברת `0` כקלט היחיד של `useState`. הערך השני שחוזר הוא פונקציה. הפונקציה נותנת לנו לעדכן את `count`, כך שנקרא לה `setCount`.
* **שורה 9:** כשהמשתמש לוחץ על הכפתור, נקרא ל- `setCount` עם ערך חדש. לאחר מכן React ירנדר מחדש את הקומפוננטה `Example`, ויעביר את ערך ה- `count` החדש אליה.

יכול להיות שזה נראה כמו הרבה לעכל בפעם הראשונה. לא צריך למהר! אם אתה מרגיש אבוד בהסבר, הסתכל על הקוד לעיל ונסה שוב לקרוא אותו מלמעלה למטה. אנחנו מבטיחים שברגע שתנסה "לשכוח" כיצד state עובד במחלקות, ותסתכל על הקוד הזה עם עיניים רעננות, זה יהיה הגיוני.

### טיפ: מה המשמעות של סוגריים מרובעות? {#tip-what-do-square-brackets-mean}

יכול להיות ששמת לב לסוגריים המרובעות כשהגדרנו משתנה state חדש:

```js
  const [count, setCount] = useState(0);
```

השמות משמאל הם לא חלק מה- API של React. אתה יכול לקרוא להם בכל שם שתרצה:

```js
  const [fruit, setFruit] = useState('banana');
```

Syntax JavaScript זה נקרא ["array destructuring"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring). זה אומר שאנחנו מכינים שני משתנים חדשים `fruit` ו- `setFruit`, ו- `fruit` יהיה שווה לערך הראשון שמוחזר מ- `useState`, ו- `setFruit` הוא השני. זה מקביל לקוד הבא:

```js
  var fruitStateVariable = useState('banana'); // מחזיר זוג
  var fruit = fruitStateVariable[0]; // הפריט הראשון בזוג
  var setFruit = fruitStateVariable[1]; // הפריט השני בזוג
```

כשאנו מגדירים משתנה state עם `useState`, זה מחזיר זוג – מערך עם שני פריטים. הפריט הראשון הוא הערך הנוכחי, והשני הוא פונקציה שנותנת לנו לעדכן אותו. שימוש ב- `[0]` ו- `[1]` על מנת לגשת אליהם זה טיפה מבלבל בגלל בגלל שיש להם משמעות ספציפית. זה למה אנחנו משתמשים ב- array destructuring במקום.

>הערה
>
>יכול להיות שאתה סקרן לדעת איך React יודע איזה קומפוננטה מתאימה ל- `useState` בגלל שאנחנו לא מעבירים דברים כמו `this` חזרה ל-React. נענה על [שאלה זו](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) ואחרות רבות בעמוד שעונה על שאלות נפוצות.

### טיפ: שימוש במספר משתני state {#tip-using-multiple-state-variables}

הגדרת משתני state כזוג של `[something, setSomething]` היא גם שימושית, בגלל שהיא נותנת לנו אפשרות לתת שמות *שונים* למשתני state שונים אם אנחנו רוצים להשתמש ביותר מאחד:

```js
function ExampleWithManyStates() {
  // הגדרת מספר משתני state!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

בקומפוננטה שלעיל, יש לנו `age`, `fruit`, ו- `todos` כמשתנים מקומיים, ואנחנו יכולים לעדכן אותם לחוד:

```js
  function handleOrangeClick() {
    // דומה ל this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

אתה **לא חייב** להשתמש בהרבה משתני state. משתני state יכולים לשמור אובייקטים ומערכים מצוין, כך שאתה יכול עדיין לקבץ מידע קשור ביחד. לעומת זאת, בניגוד ל- `this.setState` במחלקה, עדכון משתנה state תמיד *מחליף* אותו במקום למזג אותו.

אנחנו מספקים המלצות נוספות על פיצול משתני state עצמאיים ב- [עמוד שאלות נפוצות](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## השלבים הבאים {#next-steps}

בעמוד זה למדנו על אחד מה- Hooks שמסופקים על ידי React, שנקרא `useState`. אנו הולכים להתייחס אליו גם כה- "State Hook". זה נותן לנו להוסיף state מקומי לקומפוננטות פונקציונליות ב-React – מה שעשינו בפעם הראשונה אי פעם!

למדנו גם קצת על מה הם Hooks. Hooks הם פונקציות שנותנות לך "להתחבר" לפיצ'רים של React מתוך קומפוננטות פונקציונליות. השמות שלהם תמיד מתחילים עם `use`, ויש עוד Hooks שלא ראינו עדיין.

**עכשיו נמשיך על ידי [למידה של ה- Hook הבא: `useEffect`.](/docs/hooks-effect.html)** הוא נותן לך לבצע "תופעות לוואי" בקומפוננטות, ודומה למתודות מחזור חיים במחלקות.
