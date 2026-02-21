---
title: "חילוץ לוגיקת state ל-מחמצת"
---

<Intro>

רכיבים עם עדכוני מצב רבים מהממים על פני רופאי אירועים רבים יכולים להיות מהמם. אלה, אתה יכול לאחד את כל העדכון הstate מחוץ לרכיב שלך בפונקציה אחת, הנקראת _reducer._

</Intro>

<YouWillLearn>

- מהי פונקציית מפחית
- איך לשנות את 'useState' ל-'useReducer'
מתי להשתמש במפחית
- איך לכתוב אחד טוב

</YouWillLearn>

## איחוד היגיון מצב עם מפחית {/*consolide-state-logic-with-a-reducer*/}

כמה שהרכיבים שלך גדלים במורכבות, זה יהיה קשה יותר לראות במבט אחד את כל הדרכים השונות שבהן מצב הרכיב מתעדכן. לדוגמה, הרכיב 'TaskApp' למטה מחזיק מערך של 'משימות' בstate ומשתמש בשלושה מטפלי אירועים כדי להוסיף ולערוך משימות:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

כל אחד מעובדי העסקים שלו קורא 'שואל' על מנת לעדכן את הstate. ככל שחשוב זה גדל, כך גדלה כמות ההיגיון של הstate המפוזרת בו. כדי להפחית את המורכבות הזו ולשמור את כל ההיגיון שלך במקום אחד קל לגעת, אתה יכול להעביר את הstate הזה לפונקציה יחידה מחוץ לרכיב שלך, **המכונה "מפחית".**

מפחית הם דרך אחרת בstate. אתה יכול לעבור מ'useState' ל'useReducer' בשלושה שלבים:

1. **עבור** מstate לפעולות שיגור.
2. **כתוב** פונקציית מפחית.
3. **השתמש** במפחית מהרכיב שלך.

### שלב 1: המשך מstate לפעולות שיגור {/*step-1-movefrom-setting-state-to-dispatching-actions*/}

מטפלי האירועים שלך מציינים כעת _מה לעשות_ על ידי הגדרת מצב:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

הסר את כל הלוגיקה של הגדרות הstate. מה שנותר לך הם שלושה רופאים אירועים:

- `handleAddTask(text)` נקרא כאשר משתמש לוחץ על "הוסף".
- `handleChangeTask(task)` כאשר המשתמש מחליף משימה או לוחץ על "שמור".
- `handleDeleteTask(taskId)` נקרא כאשר משתמש לוחץ על "מחק".

ניהול מצב עם מפחית שונה במקצת מstate ישיר. במקום להגיד ל-React "מה לעשות" לפי הגדרת מצב, אתה מדווח "מה משתמש בדיוק עשה" על ידי שליחת "פעולות" מי פעולות שלך. (עדכון לוגיקת הstate תתקיים במקום אחר!) אז במקום "להגדיר `משימות`" באמצעות מטפל באירועים, אתה שולח פעולת "הוסף/שונה/מחק משימה". זה מתאר יותר את הכוונת המשתמש.

```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

האובייקט שאתה מעביר ל-'dispatch' נקרא "פעולה":

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

זהו אובייקט JavaScript רגיל. אתה מחליט מה לשים בו, אבל בדרך כלל הוא צריך להכיל את המינימלי על _מה שקרה_. (תוסיף את הפונקציית ה'שליחות' עצמה מאוחרת יותר).

<Note>

לאובייקט פעולה יכול להיות כל צורה.

לפי המוסכמה, מקובל לתת לו 'סוג' מחרוזת שמתארת ​​את מה שקרה, להעביר כל מידע נוסף בשדות אחרות. ה-`סוג` ספציפי לרכיב, אז בדוגמה או `'added'` או `'added_task'` יהיו בסדר. בחר שם שאומר מה קרה!

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Note>

### שלב 2: מפחית כתוב פונקציית {/*שלב-2-כתוב-פונקציית-reducer*/}

מפחית פונקציית הוא המקום שבו תכניס את היגיון הstate שלך. זה דורש שני ארגומנטים, הstate הנוכחי ושאיפה, והוא מחזיר את הstate הבא:

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

תגיב תגדיר את הstate למה ​​אתה מחזיר מפחיד.

כדי להעביר את הגדרת היגיון ה__TK0__ שלך מרפאת עובדים לפונקציית מפחית בדוגמה זו, תעשה:

1. הכריז על הstate הראשון הנוכחי (`משימות`) כארגומנט.
2. הכריז על אובייקט `פעולה` כארגומנט השני.
3. החזר את הstate _next_ מפחיד (אשר תגיב יגדיר את הstate אליו).

הנה כל הלוגיקה של הגדרות הstate שעברה לפונקציית מפחית:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

מה שפונקציית המפחית לוקחת את מצב (`משימות`) כארגומנט, אתה יכול **להכריז עליו מחוץ לרכיב.** זה מקטין את רמת ההזחה ויכולה שלך להתחבר לקריאת הקוד שלך.

<Note>

הקוד שלמעלה משתמש בהצהרות if/else, אבל זה מוסכמה להשתמש ב[switch statements](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) בתוך reducer. התוצאה היא, אבל יכולה להיות קל יותר לקרוא את הצהרות מתג במבט חטוף.

אנו נשתמש בהם לאורך שאר התיעוד הזה כך:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

אנו ממליצים לעטוף כל בלוק `מקרה` בסוגריים מתולתלים `{` ו`}` כך שמשתנים המוצהרים בתוך `מקרה` שונים לא יתנגשו זה בזה. כמו כן, `מקרה` אמור להסתיים בדרך כלל ב`החזרה`. אם תשכחו `להחזיר`, הקוד "יפול" ל`מקרה` הבא, מה שעלול להוביל לטעויות!

אם אתה עדיין לא מרגיש בנוח עם הצהרות החלף, השימוש ב-if/else הוא לגמרי בסדר.

</Note>

<DeepDive>

#### למה קוראים למפחיתים כך? {/*למה-reducer-בדרך-זו*/}

למרות שהמפחיתים יכולים "להפחית" את כמות הקוד בתוך הרכיב שלך, הם למעשה נקראים על שם פעולת [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) יכולים לבצע על מערכים.

פעולת `reduce()` מאפשרת לך לקחת מערך ו"לצבור" ערך בודד מתוך רבים:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

הפונקציה שאתה מעביר ל-'reduce' ידועה בתור "reducer". הוא לוקח את _התוצאה עד כה_ ואת _הפריט הנוכחי,_ ואז הוא מחזיר את _התוצאה הבאה._ מפחית תגובה הם דוגמה לא רעיון: הם לוקחים את _state עד כה_ ו_פעולה_, ומחזירים את _state הבא._ בדרך זו, הם צוברים לאורך זמן הstate.

אתה יכול אפילו להשתמש בשיטת `reduce()` עם `initialState` ומערך של `פעולות` כדי לחשב את ה__TK_3 הסופי על ידי העברת פונקציית הרדוקרה שלך אליו:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

כנראה שלא תצטרכו לעשות זאת בעצמכם, אבל זה דומה למה ש-React עושה!

</DeepDive>

### שלב 3: השתמש במחמצת מהרכיב שלך {/*step-3-use-the-reducer-from-your-component*/}

לבסוף, עליך לחבר את 'משימות מפחיתות' לרכיב שלך. ייבא את ה- 'useReducer' מ-React:

```js
import { useReducer } from 'react';
```

אז אתה יכול להחליף את 'useState':

```js
const [tasks, setTasks] = useState(initialTasks);
```

עם 'useReducer' כך:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

ה- `useReducer` Hook דומה ל-`useState` - עליך להעביר לו מצב מתחיל והוא מחזיר ערך stateפול ודרך להגדיר מצב (במקרה זה, פונקציית השילוח). אבל זה קצת שונה.

ה- 'useReducer' Hook לוקח שני ארגומנטים:

1. פונקציית מפחית
2. מצב ראשוני

וזה מחזיר:

1. ערך ממלכתי
2. פונקציית שיגור (כדי "לשלוח" פעולות משתמש לreducer)

עכשיו זה מחובר לגמרי! כאן, מפחית מוצהר בתחתית קובץ הרכיבים:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

אם תרצה, אתה יכול אפילו להעביר את המפחית לקובץ אחר:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

לוגיקה של רכיבים יכולה להיות קלה יותר לקריאה כשאתה מפריד בין חששות כמו זה. רק _מה קרה_ על ידי שיגור פעולות, ופונקציית המפחית קובעת _איך הstate מתכן_ בתגובה להן.

## השוואת `useState` ו-`useReducer` {/*comparing-usestate-and-usereducer*/}

למפחיתים אין חסרונות! הנה כמה דרכים שבהן תוכל להשוות בין:

- **גודל קוד:** בדרך כלל, עם 'useState' אתה צריך לכתוב פחות קוד מראש. עם 'useReducer', אתה צריך לכתוב גם פונקציית מפחיתים _ו_ פעולות שיגור. עם זאת, 'useReducer' יכול לעזור לצמצם את הקוד אם רופאים אירועים רבים משנים מצב בצורה דומה.
- **קריאה:** 'useState' קל מאוד לקריאה כאשר עדכוני הstate פשוטים. כשהם נעשים מורכבים יותר, הם יכולים למלא את הקוד של הרכיב והקשות על הסריקה. במקרה זה, 'useReducer' מאפשר לך להפריד בצורה נקייה את _איך_ של לוגיקת העדכון _מה _ של מטפלי אירועים.
- **ניפוי באגים:** כאשר יש לך באג עם 'useState', זה יכול להיות קשה לדעת _היכן_ הstate הוא גדר בצורה שגויה, ו-_למה_. עם `useReducer`, אתה יכול להוסיף את יומן מסוף לreducer שלך כדי לראות את כל עדכון מצב, ו-_למה_ זה קרה (בשל איזו `פעולה`). אם כל `פעולה` נכונה, תדע שהטעות היא בלוגית הרדוקרה עצמה. עם זאת, אתה צריך לעבור יותר קוד מאשר עם 'useState'.
- **בדיקה:** מפחית היא פונקציה טהורה שאינה תלויה ברכיב שלך. זה אומר שאתה לייצא ולבדוק אותו בנפרד בבידוד. למרות שבדרך כלל עדיף לבחון רכיבים בסביבה מציאותית יותר, עבור לוגיקה של עדכון מצב מורכב זה יכול שימושי לטעון מפחית שלך מחזיר להיות מצב מסוים מצב ופעולה ראשוניים לאפשרות.
- **העדפה אישית:** יש אנשים שאוהבים מפחית, אחרים לא. זה בסדר. זה עניין של העדפה. אתה תמיד יכול להמיר בין 'useState' ו-'useReducer' הלוך ושוב: הם שווים!

אנו ממלי להשתמש במחמצת אם אתה נתקל בקשר בבאגים עקב עדכוני מצב שגויים ברכיבים, וברצונך להכניס מבנה נוסף לקוד שלו. לא חייבים להשתמש במקסימום לכל דבר: חפש לערבב ולהתאים אתם! אתה יכול אפילו 'useState' ו-'useReducer' באותו רכיב.

## כתיבה מפחיתה היטב {/*reducerי-כתיבה-טוב*/}

זכור את שני הטיפים הבאים בעת כתיבת מפחית:

- **מפחית חייב להיות טהורים.** בדומה ל[עדכון מצב פונקציות](/learn/queueing-a-series-of-state-updates), מפחית פועלים על העיבוד! (פעולות עומדות לפי עד לעיבוד הבא.) משמעות הדבר היא שreducers [חייבים להיות טהורים](/learn/keeping-components-pure) - אותם כניסות תמיד מביאות לאותו פלט. אסור להם לשלוח בקשות, לתזמן פסקי זמן או לבצע פעולה לוואי כלשהן (פעולות שמרכיבות על דברים מחוץ ל). עליהם לעדכן את [objects](/learn/updating-objects-in-state) ו-[מערכים](/learn/updating-arrays-in-state) ללא מוטציות.
- **כל פעולה מתארת ​​אינטראקציה של משתמש בודד, גם אם זה מוביל לשינויים מרובים בנתונים.** לדוגמה, אם לוחץ משתמש על "איפוס" בטופס עם חמש שדות המנוהל על ידי מפחית, הגיוני יותר לשלוח פעולת `reset_form` אחת ולא חמש פעולות `set_field` נפרדות. אם אתה רושם כל פעולה במפחית, יומן זה אמור להיות ברור מספיק כדי לשחזר אילו אינטראקציות או תגובות התרחשו באיזה סדר. זה עוזר באיתור באגים!

## כתיבת מצמצמים תמציתיים עם Immer {/*כתיבה-תמצית-reducer-עם-immer*/}

בדיוק כמו עם [עדכון הstates](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) ו-[מערכים](/learn/updating-arrays-in-state#write-concise-update-immer)-. כאן, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) תוכל לשנות את הstate עם הקצאת `push` או `arr[i] =`:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

אפשר להיות טהורים, אז הם לא צריכים לעבור תנועה בstate. אבל אני מספקת לך אובייקט מיוחד `טיוטה` שבטוח מוטציה. מתחת למכסה המנוע, Immer תיצור עותק של הstate שלך עם השינויים שביצעת ב'טיוטה'. אתה יכול לשנות את הטיעון הראשון שלהם ואינם צריכים להחזיר מצב.

<Recap>

- להמיר מ'useState' ל'useReducer':
  1. שיגור פעולות ממטפלי אירועים.
2. כתוב פונקציית מפחית שמחזירה את הstate הבא עבור מצב ופעולה נתונים.
  3. החלף את 'useState' ב-'useReducer'.
- מפחית דורשים ממך לכתוב קצת יותר קוד, אבל הם עוזרים בניפוי באגים ובדיקות.
- מפחית חייב להיות טהורים.
- כל פעולה מתארת ​​אינטראקציה של משתמש בודד.
- השתמש ב-Immer אם אתה רוצה לכתוב מפחית נוסח מוטציה.

</Recap>

<Challenges>

#### שליחת פעולות ממטפלי אירועים {/*משלוח-פעולות-מ-מתמודדים-עם-אירועים*/}

נכון לעכשיו, לרופאים ב-`ContactList.js` וב-`Chat.js` יש הערות `// TODO`. זה מה שהקלדה בקלט לא עובדת, ולחיצה על הכפתורים לא משנה את הנמען שנבחר.

החלף את שני `// TODO` אלה בקוד כדי `לשלוח` את התאימות לפעולות. ראה את הרצון כדי ואת סוג הפעולות, בדוק את המפחית ב-`messengerReducer.js`. המפחית כבר כתוב כך שלא תתאים אותו. אתה רק צריך לשלוח את הפעולות ב-'ContactList.js' ו-'Chat.js'.

<Hint>

הפונקציה 'שיגור' כבר זמינה בשני הרכיבים הללו מכיוון שהיא הועברה כעזר. אז אתה צריך לקרוא 'שיגור' עם אובייקט הפעולה המתאים.

כדי לבדוק את צורת הפעולה, אתה יכול להסתכל על המפחית ולראות אילו שדות 'פעולה' הוא מצפה לראות. לדוגמה, מקרה 'changed_selection' ב-reducer נראה כך:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

זה אומר של העניין שלך צריך להיות 'סוג: 'changed_selection''. אתה גם רואה את 'action.contactId' בשימוש, עליך לכלול את המאפיין 'contactId' בפעולה שלך.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

מקוד המפחית, אתה יכול להסיק שפעולות צריכות להיראות כך:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

הנה הדוגמה שעודכנה לשליחת ההודעות המתאימות:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### נקה את הקלט בשליחת הודעה {/*clear-the-input-on-שליחת-הודעה*/}

נכון לעכשיו, לחיצה על "שלח" לא עושה כלום. הוסף מטפל באירועים ללחצן "שלח" שיבצע:

1. הצג `התראה` עם האימייל של הנמען וההודעה.
2. נקה את קלט ההודעה.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

ישנן מספר דרכים שבהן תוכל לעשות זאת במטפל באירועים של כפתור "שלח". גישה אחת היא להציג התראה ולאחר מכן לשלוח פעולת `עריכה_הודעה` עם `הודעה` ריקה:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

זה עובד ומנקה את הקלט כאשר אתה לוחץ על "שלח".

עם זאת, _מנקודת המבט של המשתמש_, שליחת הודעה היא פעולה שונה מאשר עריכת השדה. כדי לשקף, אתה יכול במקום לעשות זאת _חדשה_ בשם 'הודעה_שלחה', ולטפל בה בנפרד ב-reducer:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

ההתנהגות המתקבלת זהה. אבל זכור שסוגי פעולה צריכים לתאר באופן אידיאלי "מה המשתמש עשה" ולא "איך אתה רוצה שstate תשתנה". זה מקל להוסיף מאוחר יותר תכונות נוספות.

עם כל אחד מהפתרונות, חשוב ש**לא** תציב את ה'התראה' בתוך מפחית. הוא צריך לחשב רק את הstate הבא. זה לא צריך "לעשות" שום דבר, כולל הצגת הודעות למשתמש. זה אמור לקרות בטיפול. (כדי לעזור לתפוס טעויות כמו זו, תגיב יתקשר למפחיתים שלך מכניסים מספר פעמים בstate קפדני.

</Solution>

#### שחזור ערכי קלט בזמן מעבר בין כרטיסיות {/*restore-input-values-when-switching-between-tabs*/}

בדוגמה זו, מעבר בין נמענים שונים תמיד מנקה את קלט הטקסט:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

הסיבה לכך היא שאינך רוצה לשתף טיוטת הודעה אחת בין מספר נמענים. אבל זה יהיה טוב יותר אם האפליקציה שלך "תזכור" טיוטה עבור כל איש קשר בנפרד, ותשחזר אותם כאשר אתה מחליף אנשי קשר.

המשימה היא שלך לשנות את האופן שבו הstate בנוי כך שתזכור תיבת הודעה נפרדת _לכל איש קשר_. תצטרך לבצע כמה שינויים ב-reducer, בstate ההתחלתי וברכיבים.

<Hint>

אתה יכול לבנות את הstate כך:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
};
```

התחביר `[key]: value` [מאפיין ממוחשב](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) יכול לעזור לך לעדכן את אובייקט `הודעות`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

יהיה עליך לעדכן את המפחית כדי לאחסן ולעדכן הודעה נפרדת לכל איש קשר:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

תעדכן גם את רכיב 'מסנג'ר' כדי לקרוא את ההודעה של איש הקשר שנבחר כעת:

```js
const message = state.messages[state.selectedId];
```

הנה הפתרון המלא:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

יש לציין שלא היית צריך לשנות אף אחד מהמטפלים באירועים כדי ליישם את ההתנהגות הזו הזו. ללא מפחית, תצטרך לשנות כל מטפל באירועים שמעדכן את הstate.

</Solution>

#### הטמעת 'useReducer' מאפס {/*implement-usereducer-from-scratch*/}

בדוגמאות הקודמות, ייבאת את ה- 'useReducer' מ-React. הפעם, אתה תטמיע את _ה-'useReducer' Hook עצמו!_ הנה בדל שיעזור לך להתחיל. זה לא אמור לקחת יותר מ-10 שורות קוד.

כדי לבדוק את השינויים שלך, נסה להקליד בקלט או בחר איש קשר.

<Hint>

להלן סקיצה מפורטת יותר של היישום:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

נזכיר שפונקציית מפחית לוקחת שני ארגומנטים - הstate הנוכחית ופעולה - והיא מחזירה את הstate הבא. מה צריך לעשות עם יישום ה'שליחות'?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

שיגור פעולה קורא למפחית עם הstate הנוכחי והפעולה, ומחסן את התוצאה כstate הבא. כך זה נראה בקוד:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

למרות שזה לא משנה ברוב המקרים, יישום קצת יותר מדויק נראה כך:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

מה היא הסיבה שהפעולות שנשלחו לפי עד לעיבוד הבא, [בדומה לפונקציות העדכון.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>

