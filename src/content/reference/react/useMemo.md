---
title: "useMemo"
---

<Intro>

`useMemo` הוא React Hook המאפשר לך לשמור את התוצאה של חישוב בין רינדורים מחדש.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

התקשר ל-`useMemo` ברמה העליונה של הרכיב שלך כדי לשמור חישוב במטמון בין עיבוד מחדש:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `calculateValue`: הפונקציה המחשבת את הערך שברצונך לשמור במטמון. זה צריך להיות טהור, לא צריך לקחת טיעונים, וצריך להחזיר ערך מכל סוג שהוא. React יקרא לפונקציה שלך במהלך העיבוד הראשוני. בעיבוד הבא, React יחזיר את אותו הערך שוב אם ה-`dependencies` לא השתנה מאז העיבוד האחרון. אחרת, הוא יקרא ל-`calculateValue`, יחזיר את התוצאה שלו ויאחסן אותה כך שניתן יהיה להused מחדש מאוחר יותר.

* `dependencies`: רשימת כל הערכים התגובתיים שאליהם מתייחסים בתוך הקוד `calculateValue`. הערכים Reactive כוללים את props, state, ואת כל המשתנים והפונקציות המוצהרות ישירות בתוך גוף הרכיב שלך. אם ה-linter שלך הוא [מוגדר עבור React](/learn/editor-setup#linting), הוא יוודא שכל ערך תגובתי צוין כהלכה כתלות. רשימת התלות חייבת לכלול מספר קבוע של פריטים ולהיכתב בשורה כמו `[dep1, dep2, dep3]`. React ישווה כל תלות עם הערך הקודם שלה באמצעות ההשוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### מחזירה {/*returns*/}

בעיבוד הראשוני, `useMemo` מחזיר את התוצאה של קריאה ל-`calculateValue` ללא ארגומנטים.

במהלך הרינדור הבא, הוא יחזיר ערך שכבר מאוחסן מהעיבוד האחרון (אם התלות לא השתנו), או יתקשר שוב ל-`calculateValue`, ויחזיר את התוצאה ש-`calculateValue` החזיר.

#### אזהרות {/*caveats*/}

* `useMemo` הוא Hook, אז אתה יכול לקרוא לו רק **ברמה העליונה של הרכיב שלך** או Hooks משלך. אתה לא יכול לקרוא לזה בתוך לולאות או תנאים. אם אתה צריך את זה, חלץ רכיב חדש והעביר את ה-state לתוכו.
* במצב קפדני, React **תתקשר לפונקציית החישוב שלך פעמיים** ​​על מנת [לעזור לך למצוא זיהומים מקריים.](#my-calculation-runs-twoice-on-every-re-render) זוהי התנהגות לפיתוח בלבד ואינה משפיעה על הייצור. אם פונקציית החישוב שלך טהורה (כפי שהיא צריכה להיות), זה לא אמור להשפיע על ההיגיון שלך. התוצאה מאחת השיחות תתעלם.
* React **לא יזרוק את הערך המאוחסן במטמון אלא אם יש סיבה ספציפית לעשות זאת.** לדוגמה, בפיתוח, React זורק את המטמון כשאתה עורך את הקובץ של הרכיב שלך. גם בפיתוח וגם בייצור, React יזרוק את המטמון אם הרכיב שלך יושעה במהלך ההרכבה הראשונית. בעתיד, React עשוי להוסיף תכונות נוספות המנצלות את זריקת המטמון - לדוגמה, אם React יוסיף בעתיד תמיכה מובנית עבור רשימות וירטואליות, יהיה הגיוני לזרוק את המטמון עבור פריטים שגוללים מתוך יציאת התצוגה הווירטואלית של הטבלה. זה אמור להיות בסדר אם אתה מסתמך על `useMemo` אך ורק כאופטימיזציה של ביצועים. אחרת, משתנה [state](/reference/react/useState#avoiding-recreating-the-initial-state) או [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) עשויים להיות מתאימים יותר.

<Note>

ערכי החזרה במטמון כמו זה ידועים גם בשם [*memoization*,](https://en.wikipedia.org/wiki/Memoization) וזו הסיבה שה-Hook הזה נקרא `useMemo`.

</Note>

---

## שימוש {/*usage*/}

### דילוג על חישובים מחדש יקרים {/*skipping-expensive-recalculations*/}

כדי לשמור חישוב במטמון בין עיבוד מחדש, עטוף אותו בקריאה `useMemo` ברמה העליונה של הרכיב שלך:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

אתה צריך להעביר שני דברים ל-`useMemo`:

1. <CodeStep step={1}>פונקציית חישוב</CodeStep> שאינה לוקחת ארגומנטים, כמו `() =>`, ומחזירה את מה שרצית לחשב.
2. <CodeStep step={2}>רשימת תלות</CodeStep> הכוללת כל ערך בתוך הרכיב שלך שהוא used בחישוב שלך.

בעיבוד הראשוני, <CodeStep step={3}>ערך</CodeStep> שתקבל מ-`useMemo` יהיה התוצאה של קריאה ל<CodeStep step={1}>חישוב</CodeStep> שלך.

בכל רינדור עוקב, React ישווה את <CodeStep step={2}>התלות</CodeStep> עם התלות שהעברת במהלך העיבוד האחרון. אם אף אחת מהתלות לא השתנתה (בהשוואה ל-[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` יחזיר את הערך שכבר חישבת בעבר. אחרת, React יפעיל מחדש את החישוב שלך ויחזיר את הערך החדש.

במילים אחרות, `useMemo` מאחסן תוצאת חישוב במטמון בין רינדור מחדש עד להשתנות התלות שלה.

**בואו נעבור על דוגמה כדי לראות מתי זה מלא use.**

כברירת מחדל, React יפעיל מחדש את כל הגוף של הרכיב שלך בכל פעם שהוא מעבד מחדש. לדוגמה, אם `TodoList` זה מעדכן את state שלו או מקבל props חדש מהאב שלו, הפונקציה `filterTodos` תפעיל מחדש:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

בדרך כלל, זו לא בעיה כי use רוב החישובים מהירים מאוד. עם זאת, אם אתה מסנן או משנה מערך גדול, או עושה חישוב יקר, אולי תרצה לדלג על ביצוע זה שוב אם הנתונים לא השתנו. אם גם `todos` וגם `tab` זהים לאלו שהיו במהלך העיבוד האחרון, עטיפה של החישוב ב-`useMemo` כמו קודם מאפשרת לך מחדשuse `visibleTodos` שכבר חישבת בעבר.

סוג זה של שמירה במטמון נקרא *[memoization.](https://en.wikipedia.org/wiki/Memoization)*

<Note>

**עליך להסתמך רק על `useMemo` כאופטימיזציה של ביצועים.** אם הקוד שלך לא עובד בלעדיו, מצא את הבעיה הבסיסית ותקן אותה תחילה. לאחר מכן תוכל להוסיף `useMemo` כדי לשפר את הביצועים.

</Note>

<DeepDive>

#### איך לדעת אם חישוב יקר? {/*how-to-tell-if-a-calculation-is-expensive*/}

באופן כללי, אלא אם כן אתה יוצר או עובר בלולאה על אלפי אובייקטים, זה כנראה לא יקר. אם אתה רוצה לקבל יותר ביטחון, אתה יכול להוסיף יומן מסוף כדי למדוד את הזמן המושקע בקטע קוד:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

בצע את האינטראקציה שאתה מודד (לדוגמה, הקלדה בקלט). לאחר מכן תראה יומנים כמו `filter array: 0.15ms` במסוף שלך. אם הזמן הכולל שנרשם מסתכם בכמות משמעותית (נניח, `1ms` או יותר), זה עשוי להיות הגיוני memoלשנות את החישוב הזה. כניסוי, לאחר מכן תוכל לעטוף את החישוב ב-`useMemo` כדי לוודא אם הזמן הכולל שנרשם ירד עבור האינטראקציה הזו או לא:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Skipped if todos and tab haven't changed
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` לא יהפוך את העיבוד *הראשון* למהיר יותר. זה רק עוזר לך לדלג על עבודה מיותרת על עדכונים.

זכור שהמכשיר שלך כנראה מהיר יותר מה-users' שלך, אז מומלץ לבדוק את הביצועים עם האטה מלאכותית. לדוגמה, Chrome מציע אפשרות [מחסום CPU](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) עבור זה.

שימו לב גם שמדידת ביצועים בפיתוח לא תיתן לכם את התוצאות המדויקות ביותר. (לדוגמה, כאשר [מצב קפדני](/reference/react/StrictMode) פועל, תראה כל רכיב מעובד פעמיים ולא פעם אחת.) כדי לקבל את התזמונים המדויקים ביותר, בנה את האפליקציה שלך לייצור ובדוק אותה במכשיר כמו שיש ל-users שלך.

</DeepDive>

<DeepDive>

#### האם להוסיף useMemo בכל מקום? {/*should-you-add-usememo-everywhere*/}

אם האפליקציה שלך דומה לאתר הזה, ורוב האינטראקציות הן גסות (כמו החלפת דף או קטע שלם), memoאיזון בדרך כלל מיותר. מצד שני, אם האפליקציה שלך דומה יותר לעורך ציור, ורוב האינטראקציות הן פרטניות (כמו צורות זזות), אז אתה עשוי למצוא memoization מועיל מאוד.

אופטימיזציה עם `useMemo` היא בעלת ערך רק במקרים בודדים:

- החישוב שאתה מכניס ל-`useMemo` איטי במידה ניכרת, והתלות שלו משתנות רק לעתים רחוקות.
- אתה מעביר אותו כעזר לרכיב עטוף ב-[`memo`.](/reference/react/memo) אתה רוצה לדלג על עיבוד מחדש אם הערך לא השתנה. שינון זיכרון מאפשר לרכיב שלך לבצע רינדור מחדש רק כאשר התלות אינן זהות.
- הערך שאתה מעביר הוא מאוחר יותר used כתלות בכמה Hook. לדוגמה, אולי ערך חישוב אחר של `useMemo` תלוי בו. או אולי אתה תלוי בערך הזה מ-[`useEffect.`](/reference/react/useEffect)

אין תועלת לעטוף חישוב ב-`useMemo` במקרים אחרים. גם לעשות את זה אין שום נזק משמעותי, אז חלק מהצוותים בוחרים לא לחשוב על מקרים בודדים, וmemoלבצע כמה שיותר. החיסרון של גישה זו הוא שהקוד הופך פחות קריא. כמו כן, לא כל memoization יעיל: מספיק ערך בודד שהוא "חדש תמיד" כדי לשבור memoization עבור רכיב שלם.

**בפועל, אתה יכול להפוך הרבה memoאיזון למיותר על ידי ביצוע מספר עקרונות:**

1. כאשר רכיב עוטף רכיבים אחרים באופן ויזואלי, תן ​​לו [לקבל את JSX כילדים.](/learn/passing-props-to-a-component#passing-jsx-as-children) בדרך זו, כאשר רכיב העטיפה מעדכן את state משלו, React לא צריך React שלו.
1. העדיפו state מקומי ואל ת [להרים את state למעלה](/learn/sharing-state-between-components) מעבר למה שצריך. לדוגמה, אל תשמור טפסים חולפים כמו state והאם פריט מרחף בראש העץ שלך או בספריית state גלובלית.
1. שמור על [לוגיקת העיבוד שלך טהורה.](/learn/keeping-components-pure) אם עיבוד מחדש של רכיב גורם לבעיה או מייצר חפץ חזותי בולט, זה באג ברכיב שלך! תקן את הבאג במקום להוסיף memoization.
1. הימנע מ[אפקטים מיותרים שמעדכנים state.](/learn/you-might-not-need-an-effect) רוב בעיות הביצועים באפליקציות React ניתנות ל-used על ידי שרשראות של עדכונים שמקורן באפקטים שמאפשרים use לעבד את הרכיבים שלך שוב ושוב.
1. נסה [להסיר תלות מיותרת מהאפקטים שלך.](/learn/removing-effect-dependencies) לדוגמה, במקום memoization, לעתים קרובות יותר פשוט להעביר אובייקט או פונקציה בתוך אפקט או מחוץ לרכיב.

אם אינטראקציה ספציפית עדיין מרגישה בפיגור, [use הפרופיל של React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) כדי לראות אילו רכיבים ירוויחו הכי הרבה מ-memoization, והוסיפו memoization במידת הצורך. עקרונות אלו מקלים על ניפוי באגים והבנה של הרכיבים שלכם, אז כדאי לעקוב אחריהם בטווח הארוך, בכל מקרה.' memoization באופן אוטומטי](https://www.youtube.com/watch?v=lGEMwh32soc) כדי לפתור את זה אחת ולתמיד.

</DeepDive>

<Recipes titleText="The difference between useMemo and calculating a value directly" titleId="examples-recalculation">

#### דילוג על חישוב מחדש עם `useMemo` {/*skipping-recalculation-with-usememo*/}

בדוגמה זו, היישום `filterTodos` הוא **האטה באופן מלאכותי** כך שתוכל לראות מה קורה כאשר פונקציית JavaScript כלשהי שאתה קורא במהלך העיבוד היא איטית באמת. נסה להחליף את הכרטיסיות ולהחליף את ערכת הנושא.

החלפת הכרטיסיות מרגישה איטי מכיוון שuse היא מאלצת את ה-`filterTodos` המואט לבצע מחדש. זה צפוי בגלל שuse ה-`tab` השתנה, ולכן כל החישוב *צריך* להפעיל מחדש. (אם אתה סקרן למה זה פועל פעמיים, זה מוסבר [כאן.](#my-calculation-runs-twice-on-every-rerender))

החלף את ערכת הנושא. **תודה ל`useMemo`, זה מהיר למרות ההאטה המלאכותית!** הקריאה האיטית `filterTodos` נדחתה מכיוון שuse הן `todos` והן `tab` (שאותם מעבירים כתלות ל-`useMemo`) לא השתנו מאז העיבוד האחרון.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### תמיד חישוב מחדש של ערך {/*always-recalculating-a-value*/}

בדוגמה זו, היישום `filterTodos` הוא גם **האטה באופן מלאכותי** כך שתוכל לראות מה קורה כאשר פונקציית JavaScript כלשהי שאתה קורא במהלך העיבוד היא איטית באמת. נסה להחליף את הכרטיסיות ולהחליף את ערכת הנושא.

שלא כמו בדוגמה הקודמת, החלפת ערכת הנושא אטית גם כעת! זה בגלל use **אין קריאת `useMemo` בגרסה הזו,** אז הקצב שהאט באופן מלאכותי `filterTodos` נקרא בכל עיבוד מחדש. זה נקרא גם אם רק `theme` השתנה.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

עם זאת, הנה אותו קוד **עם הסרת ההאטה המלאכותית.** האם החוסר ב-`useMemo` מרגיש מורגש או לא?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

לעתים קרובות למדי, קוד ללא memoization עובד מצוין. אם האינטראקציות שלך מהירות מספיק, ייתכן שלא תזדקק ל-memoization.

אתה יכול לנסות להגדיל את מספר פריטי המטלות ב-`utils.js` ולראות כיצד ההתנהגות משתנה. החישוב הספציפי הזה לא היה מאוד יקר מלכתחילה, אבל אם מספר המשימות יגדל באופן משמעותי, רוב התקורה תהיה בעיבוד מחדש ולא בסינון. המשך לקרוא למטה כדי לראות כיצד תוכל לייעל את העיבוד מחדש עם `useMemo`.

<Solution />

</Recipes>

---

### דילוג על עיבוד מחדש של רכיבים {/*skipping-re-rendering-of-components*/}

במקרים מסוימים, `useMemo` יכול גם לעזור לך לייעל את הביצועים של עיבוד מחדש של רכיבי צאצא. כדי להמחיש זאת, נניח שרכיב `TodoList` זה מעביר את ה-`visibleTodos` כעזר לרכיב `List` הילד:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

שמת לב שהחלפת משענת `theme` מקפיאה את האפליקציה לרגע, אבל אם תסיר את `<List />` מה-JSX שלך, זה מרגיש מהיר. זה אומר לך שכדאי לנסות לייעל את רכיב `List`.

**כברירת מחדל, כאשר רכיב מעבד מחדש, React מעבד מחדש את כל הילדים שלו באופן רקורסיבי.** זו הסיבה שכאשר `TodoList` מעבד מחדש עם `theme` שונה, הרכיב `List` *גם* מעבד מחדש. זה בסדר עבור רכיבים שאינם דורשים חישוב רב כדי לרנדר מחדש. אבל אם אימתת שעיבוד מחדש איטי, אתה יכול להגיד ל-`List` לדלג על רינדור מחדש כאשר ה-props שלו זהים לעיבוד האחרון על-ידי עטיפה ב-[`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**עם השינוי הזה, `List` ידלג על עיבוד מחדש אם כל ה-props שלו הם *זהים* לאלו בעיבוד האחרון.** זה המקום שבו שמירה במטמון של החישוב הופכת חשובה! תאר לעצמך שחשבת `visibleTodos` ללא `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**בדוגמה שלמעלה, הפונקציה `filterTodos` תמיד יוצרת מערך *שונה*,** בדומה לאופן שבו האובייקט `{}` מילולי תמיד יוצר אובייקט חדש. בדרך כלל, זו לא תהיה בעיה, אבל זה אומר ש`List` props לעולם לא יהיה אותו הדבר, והאופטימיזציה של [`memo`](/reference/react/memo) שלך לא תעבוד. זה המקום שבו `useMemo` שימושי:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**על ידי גלישת חישוב `visibleTodos` ב-`useMemo`, אתה מבטיח שיש לו את אותו ערך בין העיבודים החוזרים** (עד שישתנו תלות). אינך *חייב* לעטוף חישוב ב-`useMemo` אלא אם כן אתה עושה זאת מסיבה מסוימת. בדוגמה זו, הסיבה היא שאתה מעביר אותו לרכיב עטוף ב-[`memo`,](/reference/react/memo) וזה מאפשר לו לדלג על עיבוד מחדש. יש עוד כמה סיבות להוסיף את `useMemo` המתוארות בהמשך דף זה.

<DeepDive>

#### זיכרון צמתים בודדים JSX {/*memoizing-individual-jsx-nodes*/}

במקום לעטוף את `List` ב-[`memo`](/reference/react/memo), תוכל לעטוף את הצומת `<List />` JSX עצמו ב-`useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

ההתנהגות תהיה זהה. אם ה-`visibleTodos` לא השתנה, `List` לא יעובד מחדש.

צומת JSX כמו `<List items={visibleTodos} />` הוא אובייקט כמו `{ type: List, props: { items: visibleTodos } }`. יצירת האובייקט הזה זולה מאוד, אבל React לא יודע אם התוכן שלו זהה לפעם הקודמת או לא. זו הסיבה שבברירת המחדל, React יעבד מחדש את הרכיב `List`.

עם זאת, אם React רואה את אותו JSX בדיוק כמו במהלך העיבוד הקודם, הוא לא ינסה לעבד מחדש את הרכיב שלך. זה בגלל שuse JSX צמתים הם [בלתי ניתנים לשינוי.](https://en.wikipedia.org/wiki/Immutable_object) אובייקט צומת JSX לא יכול היה להשתנות לאורך זמן, אז React יודע שבטוח לדלג על רינדור מחדש. עם זאת, כדי שזה יעבוד, הצומת צריך *למעשה להיות אותו אובייקט*, לא רק זה נראה אותו אובייקט ב-___ בקוד. דוגמה.

עטיפה ידנית של צמתים JSX לתוך `useMemo` אינה נוחה. לדוגמה, אתה לא יכול לעשות זאת בתנאי. זו בדרך כלל הסיבה שאתה עוטף רכיבים עם [`memo`](/reference/react/memo) במקום לעטוף JSX צמתים.

</DeepDive>

<Recipes titleText="The difference between skipping re-renders and always re-rendering" titleId="examples-rerendering">

#### דילוג על עיבוד מחדש עם `useMemo` ו`memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

בדוגמה זו, הרכיב `List` מואט באופן מלאכותי** כך שתוכל לראות מה קורה כאשר רכיב React שאתה מעבד איטי באמת. נסה להחליף את הכרטיסיות ולהחליף את ערכת הנושא.

החלפת הלשוניות מרגישה איטי מכיוון שuse היא מאלצת את ה-`List` שהאטו לבצע מחדש. זה צפוי בגלל שuse ה-`tab` השתנה, ולכן עליכם לשקף את הבחירה החדשה של ה-user על המסך.

לאחר מכן, נסה לשנות את ערכת הנושא. **תודות ל-`useMemo` יחד עם [`memo`](/reference/react/memo), זה מהיר למרות ההאטה המלאכותית!** ה-`List` דילג על עיבוד מחדש מכיוון שuse מערך `visibleTodos` לא השתנה מאז העיבוד האחרון. מערך `visibleTodos` לא השתנה מכיוון שuse גם `todos` וגם `tab` (שאותם מעבירים כתלות ל-`useMemo`) לא השתנו מאז העיבוד האחרון.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### תמיד עיבוד מחדש של רכיב {/*always-re-rendering-a-component*/}

בדוגמה זו, היישום `List` הוא גם **האטה באופן מלאכותי** כך שתוכל לראות מה קורה כאשר רכיב React כלשהו שאתה מעבד איטי באמת. נסה להחליף את הכרטיסיות ולהחליף את ערכת הנושא.

שלא כמו בדוגמה הקודמת, החלפת ערכת הנושא אטית גם כעת! This is because **there is no `useMemo` call in this version,** so the `visibleTodos` is always a different array, and the slowed down `List` component can't skip re-rendering.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

עם זאת, הנה אותו קוד **עם הסרת ההאטה המלאכותית.** האם החוסר ב-`useMemo` מרגיש מורגש או לא?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

לעתים קרובות למדי, קוד ללא memoization עובד מצוין. אם האינטראקציות שלך מהירות מספיק, אינך זקוק ל-memoization.

זכור שעליך להפעיל את React במצב ייצור, להשבית את [React Developer Tools](/learn/react-developer-tools), ו-use מכשירים דומים לאלו שיש ל-users של האפליקציה שלך כדי לקבל תחושה מציאותית של מה בעצם מאט את האפליקציה שלך.

<Solution />

</Recipes>

---

### שינון תלות של Hook {/*memoizing-a-dependency-of-another-hook*/} אחר

נניח שיש לך חישוב שתלוי באובייקט שנוצר ישירות בגוף הרכיב:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

Depending on an object like this defeats the point of memoization. When a component re-renders, all of the code directly inside the component body runs again. **שורות הקוד שיוצרות את האובייקט `searchOptions` יפעלו גם בכל עיבוד מחדש.** מכיוון ש`searchOptions` היא תלות של הקריאה `useMemo` שלך, והיא שונה בכל פעם, React יודע שהתלות שונה, ומחשב מחדש את `searchItems` בכל פעם.

כדי לתקן זאת, אתה יכול memo לשנות את האובייקט `searchOptions` *עצמו* לפני שתעביר אותו כתלות:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

בדוגמה למעלה, אם ה-`text` לא השתנה, גם האובייקט `searchOptions` לא ישתנה. עם זאת, תיקון אפילו טוב יותר הוא להעביר את הצהרת האובייקט `searchOptions` *בתוך* של פונקציית החישוב `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

כעת החישוב שלך תלוי ב-`text` באופן ישיר (שהוא מחרוזת ואינו יכול "בטעות" להיות שונה).

---

### שינון פונקציה {/*memoizing-a-function*/}

נניח שהרכיב `Form` עטוף ב-[`memo`.](/reference/react/memo) אתה רוצה להעביר אליו פונקציה בתור אבזר:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

בדיוק כפי ש`{}` יוצר אובייקט אחר, הצהרות פונקציות כמו `function() {}` וביטויים כמו `() => {}` מייצרים פונקציה *שונה* בכל עיבוד מחדש. כשלעצמו, יצירת פונקציה חדשה אינה בעיה. זה לא משהו שצריך להימנע ממנו! עם זאת, אם הרכיב `Form` הוא memoized, יש להניח שברצונך לדלג על עיבוד מחדש כאשר לא השתנה props. אביזר שהוא *תמיד* שונה יביס את נקודת ה-memoization.

כדי memoלהפוך פונקציה עם `useMemo`, פונקציית החישוב שלך תצטרך להחזיר פונקציה אחרת:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

זה נראה מגושם! **פונקציות זיכרון נפוצות מספיק כדי ל-React יש Hook מובנה במיוחד בשביל זה. עטוף את הפונקציות שלך ב-[`useCallback`](/reference/react/useCallback) במקום `useMemo`** כדי למנוע צורך לכתוב פונקציה מקוננת נוספת:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

שתי הדוגמאות לעיל שוות לחלוטין. היתרון היחיד של `useCallback` הוא שהוא מאפשר לך להימנע מכתיבת פונקציה מקוננת נוספת בפנים. זה לא עושה שום דבר אחר. [קרא עוד על `useCallback`.](/reference/react/useCallback)

---

## פתרון בעיות {/*troubleshooting*/}

### החישוב שלי פועל פעמיים בכל עיבוד מחדש {/*my-calculation-runs-twice-on-every-re-render*/}

ב[מצב קפדני](/reference/react/StrictMode), React יקרא לחלק מהפונקציות שלך פעמיים במקום פעם אחת:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

זה צפוי ולא אמור לשבור את הקוד שלך.

התנהגות זו של **פיתוח בלבד** עוזרת לך [לשמור על רכיבים טהורים.](/learn/keeping-components-pure) React uses התוצאה של אחת הקריאות, ומתעלמת מהתוצאה של השיחה השנייה. כל עוד הרכיבים ופונקציות החישוב שלך טהורות, זה לא אמור להשפיע על ההיגיון שלך. עם זאת, אם הם בטעות טמאים, זה עוזר לך לשים לב ולתקן את הטעות.

לדוגמה, פונקציית חישוב לא טהורה זו משנה את המערך שקיבלת כאביזר:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React קורא לפונקציה שלך פעמיים, כך שתבחין שהמטלה מתווספת פעמיים. החישוב שלך לא אמור לשנות אובייקטים קיימים, אבל זה בסדר לשנות אובייקטים *חדשים* שיצרת במהלך החישוב. לדוגמה, אם הפונקציה `filterTodos` תמיד מחזירה מערך *שונה*, אתה יכול לבצע מוטציה במערך *זה* במקום זאת:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

קרא את [שמירה על רכיבים טהורים](/learn/keeping-components-pure) כדי ללמוד עוד על טוהר.

כמו כן, עיין במדריכים בנושא [עדכון אובייקטים](/learn/updating-objects-in-state) ו-[עדכון מערכים](/learn/updating-arrays-in-state) ללא מוטציה.

---

### הקריאה `useMemo` שלי אמורה להחזיר אובייקט, אבל מחזירה {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/} לא מוגדרת

הקוד הזה לא עובד:

```js {1-2,5}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

ב-JavaScript, `() => {` מתחיל את גוף פונקציית החץ, כך שהסוגר `{` אינו חלק מהאובייקט שלך. זו הסיבה שהוא לא מחזיר חפץ, ומוביל לטעויות. אתה יכול לתקן את זה על ידי הוספת סוגריים כמו `({` ו-`})`:

```js {1-2,5}
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

עם זאת, זה עדיין מבלבל וקל מדי עבור מישהו לשבור על ידי הסרת הסוגריים.

כדי למנוע טעות זו, כתוב `return` statement במפורש:

```js {1-3,6-7}
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### בכל פעם שהרכיב שלי מעבד, החישוב ב-`useMemo` רץ מחדש {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

ודא שציינת את מערך התלות כארגומנט שני!

אם תשכח את מערך התלות, `useMemo` יריץ מחדש את החישוב בכל פעם:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

זו הגרסה המתוקנת שמעבירה את מערך התלות כארגומנט שני:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

אם זה לא עוזר, אז הבעיה היא שלפחות אחת מהתלות שלך שונה מהעיבוד הקודם. אתה יכול לנפות באגים בבעיה זו על ידי רישום ידני של התלות שלך למסוף:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

לאחר מכן תוכל ללחוץ לחיצה ימנית על המערכים מעיבודים חוזרים שונים בקונסולה ולבחור "אחסן כמשתנה גלובלי" עבור שניהם. בהנחה שהראשון נשמר כ-`temp1` והשני נשמר כ-`temp2`, לאחר מכן תוכל use למסוף הדפדפן כדי לבדוק אם כל תלות בשני המערכים זהה:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

כאשר אתה מגלה איזו תלות שוברת את memoization, או מצא דרך להסיר אותה, או [memoהגדל אותה גם כן.](#memoizing-a-dependency-of-other-hook)

---

### אני צריך להתקשר ל-`useMemo` עבור כל פריט רשימה בלולאה, אבל זה אסור {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

נניח שהרכיב `Chart` עטוף ב-[`memo`](/reference/react/memo). אתה רוצה לדלג על רינדור מחדש של כל `Chart` ברשימה כאשר הרכיב `ReportList` מעבד מחדש. עם זאת, אינך יכול לקרוא ל-`useMemo` בלולאה:

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

במקום זאת, חלץ רכיב עבור כל פריט ו-memoשנה נתונים עבור פריטים בודדים:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

לחלופין, תוכל להסיר את `useMemo` ובמקום זאת לעטוף את `Report` עצמו ב-[`memo`.](/reference/react/memo) אם הפרופס של `item` לא ישתנה, `Report` ידלג על עיבוד מחדש, אז `Chart` ידלג גם על עיבוד מחדש:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
