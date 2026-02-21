---
title: "useReducer"
---

<Intro>

`useReducer` הוא React Hook המאפשר לך להוסיף [reducer](/learn/extracting-state-logic-into-a-reducer) לרכיב שלך.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

התקשר ל-`useReducer` ברמה העליונה של הרכיב שלך כדי לנהל את ה-state שלו עם [מפחית.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `reducer`: פונקציית המפחית שמציינת כיצד ה-state מתעדכן. זה חייב להיות טהור, צריך לקחת את state ואת הפעולה כטיעונים, ועליו להחזיר את ה-state הבא. מצב ופעולה יכולים להיות מכל סוג. 
* `initialArg`: הערך שממנו מחושב ה-state הראשוני. זה יכול להיות ערך מכל סוג שהוא. אופן החישוב של ה-state ההתחלתי ממנו תלוי בארגומנט `init` הבא.
* **אופציונלי** `init`: פונקציית האתחול שאמורה להחזיר את ה-state הראשוני. אם זה לא צוין, ה-state הראשוני מוגדר ל-`initialArg`. אחרת, ה-state הראשוני מוגדר לתוצאה של קריאה ל-`init(initialArg)`.

#### מחזירה {/*returns*/}

`useReducer` מחזיר מערך עם שני ערכים בדיוק:

1. ה-state הנוכחי. במהלך העיבוד הראשון, הוא מוגדר ל-`init(initialArg)` או `initialArg` (אם אין `init`).
2. הפונקציה [`dispatch`](#dispatch) המאפשרת לך לעדכן את ה-state לערך אחר ולהפעיל עיבוד מחדש.

#### אזהרות {/*caveats*/}

* `useReducer` הוא Hook, אז אתה יכול לקרוא לו רק **ברמה העליונה של הרכיב שלך** או Hooks משלך. אתה לא יכול לקרוא לזה בתוך לולאות או תנאים. אם אתה צריך את זה, חלץ רכיב חדש והעביר את ה-state לתוכו.
* במצב קפדני, React **יתקשר למפחית ולאתחול שלך פעמיים** ​​כדי [לעזור לך למצוא זיהומים מקריים.](#my-reducer-or-initializer-function-runs-twice) זוהי התנהגות לפיתוח בלבד ואינה משפיעה על הייצור. אם המפחית והמאתחל שלך טהורים (כפי שהם צריכים להיות), זה לא אמור להשפיע על ההיגיון שלך. התוצאה מאחת השיחות מתעלמת.

---

### `dispatch` פונקציה {/*dispatch*/}

הפונקציה `dispatch` המוחזרת על ידי `useReducer` מאפשרת לך לעדכן את ה-state לערך אחר ולהפעיל עיבוד מחדש. עליך להעביר את הפעולה כארגומנט היחיד לפונקציה `dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React יגדיר את ה-state הבא לתוצאה של קריאה לפונקציה `reducer` שסיפקת עם ה-`state` הנוכחי והפעולה שהעברת ל-`dispatch`.

#### פרמטרים {/*dispatch-parameters*/}

* `action`: הפעולה שבוצעה על ידי ה-user. זה יכול להיות ערך מכל סוג שהוא. לפי המוסכמה, פעולה היא בדרך כלל אובייקט עם מאפיין `type` המזהה אותו, ובאופן אופציונלי, מאפיינים אחרים עם מידע נוסף.

#### מחזירה {/*dispatch-returns*/}

לפונקציות `dispatch` אין ערך החזרה.

#### אזהרות {/*setstate-caveats*/}

* הפונקציה `dispatch` **מעדכנת רק את המשתנה state עבור העיבוד *הבא***. אם תקרא את המשתנה state לאחר קריאה לפונקציה `dispatch`, [אתה עדיין תקבל את הערך הישן](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) שהיה על המסך לפני השיחה שלך.

* אם הערך החדש שאתה מספק זהה ל-`state` הנוכחי, כפי שנקבע על ידי [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) השוואה, React **ידלג על עיבוד מחדש של הרכיב והילדים שלו.** זוהי אופטימיזציה. ייתכן שReact עדיין צריך לקרוא לרכיב שלך, אבל זה אמור להשפיע על התוצאה.

* React [אצות state עדכונים.](/learn/queueing-a-series-of-state-updates) הוא מעדכן את המסך **לאחר שכל מטפלי האירועים פעלו** וקראו לפונקציות `set` שלהם. זה מונע רינדורים חוזרים מרובים במהלך אירוע בודד. במקרה הנדיר שאתה צריך לאלץ את React לעדכן את המסך מוקדם יותר, למשל כדי לגשת ל-DOM, אתה יכול use [`flushSync`.](/reference/react-dom/flushSync)

---

## שימוש {/*usage*/}

### הוספת מפחית לרכיב {/*adding-a-reducer-to-a-component*/}

התקשר ל-`useReducer` ברמה העליונה של הרכיב שלך כדי לנהל את state עם [מפחית.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` מחזיר מערך עם שני פריטים בדיוק:

1. <CodeStep step={1}>הנוכחי state</CodeStep> של משתנה state זה, מוגדר תחילה ל-<CodeStep step={3}>state</CodeStep> הראשוני שסיפקת.
2. הפונקציה <CodeStep step={2}>`dispatch`</CodeStep> המאפשרת לך לשנות אותה בתגובה לאינטראקציה.

כדי לעדכן את מה שמופיע על המסך, קרא ל-<CodeStep step={2}>`dispatch`</CodeStep> עם אובייקט המייצג את מה שה-user עשה, הנקרא *action*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React יעביר את ה-state הנוכחי ואת הפעולה ל<CodeStep step={4}>פונקציית המפחית</CodeStep> שלך. המפחית שלך יחשב ויחזיר את ה-state הבא. React יאחסן את ה-state הבא, יעבד איתו את הרכיב שלך ויעדכן את ממשק המשתמש.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` דומה מאוד ל-[`useState`](/reference/react/useState), אבל הוא מאפשר לך להעביר את לוגיקת העדכון state ממטפלי אירועים לפונקציה יחידה מחוץ לרכיב שלך. קרא עוד על [בחירה בין `useState` ל-`useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### כתיבת פונקציית המפחית {/*writing-the-reducer-function*/}

פונקציית מפחית מוצהרת כך:

```js
function reducer(state, action) {
  // ...
}
```

לאחר מכן עליך למלא את הקוד שיחשב ויחזיר את ה-state הבא. לפי המוסכמה, מקובל לכתוב אותו כ-[`switch` statement.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) עבור כל `case` ב-`switch`, חשב והחזר כמה state הבא.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

לפעולות יכולות להיות כל צורה. לפי המוסכמה, מקובל להעביר אובייקטים עם מאפיין `type` המזהה את הפעולה. זה צריך לכלול את המידע המינימלי הדרוש שהמפחית צריך כדי לחשב את ה-state הבא.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

שמות סוגי הפעולה הם מקומיים לרכיב שלך. [כל פעולה מתארת ​​אינטראקציה בודדת, גם אם זה מוביל לשינויים מרובים בנתונים.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) הצורה של state היא שרירותית, אבל בדרך כלל זה יהיה אובייקט או מערך.

קרא את [חילוץ state היגיון למפחית](/learn/extracting-state-logic-into-reducer) כדי ללמוד עוד.

<Pitfall>

המדינה היא לקריאה בלבד. אל תשנה אובייקטים או מערכים ב-state:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

במקום זאת, תמיד החזר חפצים חדשים מהמפחית שלך:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

קרא את [עדכון אובייקטים ב-state](/learn/updating-objects-in-state) ו-[עדכון מערכים ב-state](/learn/updating-arrays-in-state) למידע נוסף.

</Pitfall>

<Recipes titleText="Basic useReducer examples" titleId="examples-basic">

#### טופס (אובייקט) {/*form-object*/}

בדוגמה זו, המפחית מנהל אובייקט state עם שני שדות: `name` ו-`age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### רשימת מטלות (מערך) {/*todo-list-array*/}

בדוגמה זו, המפחית מנהל מערך של משימות. יש לעדכן את המערך [ללא מוטציה.](/learn/updating-arrays-in-state)

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### כתיבת היגיון עדכון תמציתי עם Immer {/*writing-concise-update-logic-with-immer*/}

אם עדכון מערכים ואובייקטים ללא מוטציה מרגיש מייגע, אתה יכול use ספרייה כמו [Immer](https://github.com/immerjs/use-immer#useimmerreducer) כדי להפחית קוד חוזר. Immer מאפשר לך לכתוב קוד תמציתי כאילו אתה משנה אובייקטים, אבל מתחת למכסה המנוע הוא מבצע עדכונים בלתי ניתנים לשינוי:

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
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

<Solution />

</Recipes>

---

### הימנעות מיצירה מחדש של ה-state הראשוני {/*avoiding-recreating-the-initial-state*/}

React שומר את ה-state הראשוני פעם אחת ומתעלם ממנו בעיבודים הבאים.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

למרות שהתוצאה של `createInitialState(username)` היא רק used עבור העיבוד הראשוני, אתה עדיין קורא לפונקציה הזו בכל עיבוד. זה יכול להיות בזבזני אם זה יוצר מערכים גדולים או ביצוע חישובים יקרים.

כדי לפתור זאת, אתה יכול **להעביר אותה כפונקציית _initializer_** ל-`useReducer` בתור הארגומנט השלישי במקום זאת:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

שימו לב שאתם מעבירים את `createInitialState`, שהיא *הפונקציה עצמה*, ולא את `createInitialState()`, שהיא התוצאה של הקריאה לה. בדרך זו, ה-state הראשוני לא נוצר מחדש לאחר האתחול.

בדוגמה שלמעלה, `createInitialState` לוקח ארגומנט `username`. אם המאתחל שלך אינו זקוק למידע כלשהו כדי לחשב את ה-state הראשוני, תוכל להעביר את `null` כארגומנט השני ל-`useReducer`.

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">

#### העברת פונקציית האתחול {/*passing-the-initializer-function*/}

דוגמה זו מעבירה את פונקציית האתחול, כך שהפונקציה `createInitialState` פועלת רק במהלך האתחול. זה לא פועל כאשר רכיב מעבד מחדש, כגון כאשר אתה מקליד בקלט.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### העברת ה-state הראשונית ישירות {/*passing-the-initial-state-directly*/}

דוגמה זו **לא** עוברת את פונקציית האתחול, אז הפונקציה `createInitialState` פועלת בכל עיבוד, כמו למשל כשאתה מקליד בקלט. אין הבדל ניכר בהתנהגות, אבל הקוד הזה פחות יעיל.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## פתרון בעיות {/*troubleshooting*/}

### שלחתי פעולה, אבל רישום מעניק לי את הערך הישן state {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

קריאה לפונקציה `dispatch` **לא משנה את state בקוד הפועל**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!

  setTimeout(() => {
    console.log(state.age); // Also 42!
  }, 5000);
}
```

זה בגלל use [states מתנהגים כמו תמונת מצב.](/learn/state-as-a-snapshot) עדכון state מבקש עיבוד נוסף עם הערך החדש state, אך אינו משפיע על המשתנה `state` JavaScript הרץ שלך במשתנה המטפל שלך.

אם אתה צריך לנחש את הערך הבא של state, אתה יכול לחשב אותו באופן ידני על ידי קריאה למפחית בעצמך:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### שלחתי פעולה, אבל המסך לא מתעדכן {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React **יתעלם מהעדכון שלך אם ה-state הבא שווה ל-state הקודם,** כפי שנקבע על ידי השוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). זה קורה בדרך כלל כאשר אתה משנה אובייקט או מערך ב-state ישירות:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

שיניתם אובייקט `state` קיים והחזרתם אותו, אז React התעלם מהעדכון. כדי לתקן זאת, עליך לוודא שאתה תמיד [מעדכן אובייקטים ב-state](/learn/updating-objects-in-state) ו-[מעדכן מערכים ב-state](/learn/updating-arrays-in-state) במקום לשנות אותם:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### חלק מהמפחית שלי state הופך ללא מוגדר לאחר שליחת {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

ודא שכל סניף `case` **מעתיק את כל השדות הקיימים** בעת החזרת ה-state החדש:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

ללא `...state` לעיל, ה-state הבא המוחזר יכיל רק את השדה `age` ולא שום דבר אחר.

---

### כל המפחית שלי state הופך ללא מוגדר לאחר שליחת {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

אם ה-state שלך הופך באופן בלתי צפוי ל-`undefined`, סביר להניח שאתה שוכח לכתוב `return` state באחד המקרים, או שסוג הפעולה שלך אינו תואם לאף אחד מה-`case` state. כדי למצוא למה, זרוק שגיאה מחוץ ל-`switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

אתה יכול גם use בודק סוג סטטי כמו TypeScript כדי לתפוס טעויות כאלה.

---

### אני מקבל שגיאה: "יותר מדי עיבודים חוזרים" {/*im-getting-an-error-too-many-re-renders*/}

אתה עשוי לקבל שגיאה האומרת: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` בדרך כלל, זה אומר שאתה שולח פעולה ללא תנאי *במהלך העיבוד*, אז הרכיב שלך נכנס ללולאה: render, dispatch (שמייצג rendering), render, dispatch (שמאפשר עיבוד) וכן הלאה. לעתים קרובות מאוד, זהו caused בטעות בציון מטפל באירוע:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

אם אינך מוצא את ה-cause של שגיאה זו, לחץ על החץ שליד השגיאה במסוף ועיין בערימת JavaScript כדי למצוא את קריאת הפונקציה הספציפית `dispatch` האחראית לשגיאה.

---

### פונקציית המפחית או האתחול שלי פועלת פעמיים {/*my-reducer-or-initializer-function-runs-twice*/}

ב-[מצב קפדני](/reference/react/StrictMode), React יקרא לפונקציות המפחית והמאתחל שלך פעמיים. זה לא אמור לשבור את הקוד שלך.

התנהגות זו של **פיתוח בלבד** עוזרת לך [לשמור על רכיבים טהורים.](/learn/keeping-components-pure) React uses התוצאה של אחת הקריאות, ומתעלמת מהתוצאה של השיחה השנייה. כל עוד פונקציות הרכיב, האתחול והמפחית שלך טהורות, זה לא אמור להשפיע על ההיגיון שלך. עם זאת, אם הם בטעות טמאים, זה עוזר לך לשים לב לטעויות.

לדוגמה, פונקציית מפחית לא טהורה זו משנה מערך ב-state:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Because React קורא לפונקציית המפחית שלך פעמיים, אתה תראה שהמטלה נוספה פעמיים, כדי שתדע שיש טעות. בדוגמה זו, תוכל לתקן את הטעות על ידי [החלפת המערך במקום לשנות אותו](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

כעת, כשפונקציית המפחית הזו טהורה, לקרוא לזה זמן נוסף לא משנה את ההתנהגות. זו הסיבה שReact קורא לזה פעמיים עוזר לך למצוא טעויות. **רק פונקציות הרכיב, האתחול והמפחית צריכות להיות טהורות.** מטפלי אירועים אינם צריכים להיות טהורים, לכן React לעולם לא יתקשר למטפלי האירועים שלך פעמיים.

קרא את [שמירה על רכיבים טהורים](/learn/keeping-components-pure) למידע נוסף.
