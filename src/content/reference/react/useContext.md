---
title: "useContext"
---

<Intro>

`useContext` הוא React Hook המאפשר לך לקרוא ולהירשם ל-[context](/learn/pass-data-deeply-with-context) מהרכיב שלך.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

התקשר ל-`useContext` ברמה העליונה של הרכיב שלך כדי לקרוא ולהירשם ל-[context.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `SomeContext`: ההקשר שיצרת בעבר עם [`createContext`](/reference/react/createContext). ההקשר עצמו אינו מחזיק את המידע, הוא רק מייצג את סוג המידע שאתה יכול לספק או לקרוא ממרכיבים.

#### מחזירה {/*returns*/}

`useContext` מחזיר את ערך ההקשר עבור הרכיב המתקשר. זה נקבע כשה-`value` עובר ל-`SomeContext.Provider` הקרוב ביותר מעל רכיב הקורא בעץ. אם אין ספק כזה, אז הערך המוחזר יהיה ה-`defaultValue` שהעברת ל-[`createContext`](/reference/react/createContext) עבור ההקשר הזה. הערך המוחזר תמיד מעודכן. React מעבד מחדש אוטומטית רכיבים שקוראים הקשר כלשהו אם הוא משתנה.

#### אזהרות {/*caveats*/}

* `useContext()` קריאה ברכיב לא מושפעת מספקים שהוחזרו מאותו רכיב. ה-`<Context.Provider>` התואם **צריך להיות *מעל*** לרכיב המבצע את הקריאה `useContext()`.
* React **מציג מחדש באופן אוטומטי** את כל הילדים שuse הקשר מסוים החל מהספק שמקבל `value` אחר. הערכים הקודמים והבאים מושווים עם ההשוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). דילוג על עיבוד מחדש עם [`memo`](/reference/react/memo) אינו מונע מהילדים לקבל ערכי הקשר טריים.
* אם מערכת הבנייה שלך מייצרת מודולים כפולים בפלט (מה שיכול לקרות עם קישורים סימליים), זה יכול לשבור את ההקשר. העברת משהו דרך הקשר עובד רק אם `SomeContext` שאתה use לספק הקשר ו`SomeContext` שאתה use כדי לקרוא אותו הם ***בדיוק* אותו אובייקט**, כפי שנקבע על ידי השוואה `===`.

---

## שימוש {/*usage*/}


### העברת נתונים עמוק לתוך העץ {/*passing-data-deeply-into-the-tree*/}

התקשר ל-`useContext` ברמה העליונה של הרכיב שלך כדי לקרוא ולהירשם ל-[context.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` מחזירה את <CodeStep step={2}>ערך ההקשר</CodeStep> עבור <CodeStep step={1}>context</CodeStep> שעברת. כדי לקבוע את ערך ההקשר, React מחפש בעץ הרכיבים ומוצא את **ספק ההקשר הקרוב ביותר לעיל** עבור ההקשר המסוים הזה.

כדי להעביר הקשר ל-`Button`, עטוף אותו או אחד ממרכיבי האב שלו לספק ההקשר המתאים:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

זה לא משנה כמה שכבות של רכיבים יש בין הספק ל-`Button`. כאשר `Button` *בכל מקום* בתוך `Form` קורא `useContext(ThemeContext)`, הוא יקבל `"dark"` כערך.

<Pitfall>

`useContext()` תמיד מחפש את הספק הקרוב ביותר *מעל* הרכיב שקורא לו. הוא מחפש כלפי מעלה ו**לא** מחשיב ספקים ברכיב שממנו אתה קורא ל-`useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### עדכון נתונים שהועברו באמצעות ההקשר {/*updating-data-passed-via-context*/}

לעתים קרובות, תרצה שההקשר ישתנה עם הזמן. כדי לעדכן את ההקשר, שלב אותו עם [state.](/reference/react/useState) הכריז על משתנה state ברכיב האב, והעביר את ה-state הנוכחי בתור <CodeStep step={2}>ערך ההקשר</CodeStep> לספק.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

כעת כל `Button` בתוך הספק יקבל את הערך הנוכחי `theme`. אם תתקשר ל-`setTheme` כדי לעדכן את הערך `theme` שתעביר לספק, כל רכיבי `Button` יעבדו מחדש עם הערך החדש `'light'`.

<Recipes titleText="Examples of updating context" titleId="examples-basic">

#### עדכון ערך באמצעות הקשר {/*updating-a-value-via-context*/}

בדוגמה זו, הרכיב `MyApp` מחזיק במשתנה state אשר מועבר לאחר מכן לספק `ThemeContext`. סימון תיבת הסימון "מצב כהה" מעדכן את ה-state. שינוי הערך שסופק מעבד מחדש את כל הרכיבים תוך שימוש בהקשר זה.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

שימו לב ש`value="dark"` מעביר את המחרוזת `"dark"`, אבל `value={theme}` מעביר את הערך של המשתנה JavaScript `theme` עם [JSX סוגרים מסולסלים.](/learn/javascript-in-jsx-with-curly-braces) תוספים מסולסלים לא מאפשרים לך להעביר גם סוגרים מסולסלים.

<Solution />

#### עדכון אובייקט באמצעות הקשר {/*updating-an-object-via-context*/}

בדוגמה זו, יש משתנה `currentUser` state שמחזיק אובייקט. אתה משלב את `{ currentUser, setCurrentUser }` לאובייקט בודד ומעביר אותו דרך ההקשר בתוך ה-`value={}`. זה מאפשר לכל רכיב למטה, כגון `LoginButton`, לקרוא גם `currentUser` וגם `setCurrentUser`, ולאחר מכן להתקשר ל-`setCurrentUser` בעת הצורך.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### הקשרים מרובים {/*multiple-contexts*/}

בדוגמה זו, ישנם שני הקשרים עצמאיים. `ThemeContext` מספק את הנושא הנוכחי, שהוא מחרוזת, בעוד `CurrentUserContext` מחזיק את האובייקט המייצג את ה-user הנוכחי.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### חילוץ ספקים לרכיב {/*extracting-providers-to-a-component*/}

ככל שהאפליקציה שלך תגדל, צפוי שתהיה לך "פירמידה" של הקשרים קרובים יותר לשורש האפליקציה שלך. אין בזה שום דבר רע. עם זאת, אם אתה לא אוהב את הקינון מבחינה אסתטית, אתה יכול לחלץ את הספקים לרכיב אחד. בדוגמה זו, `MyProviders` מסתיר את ה"צנרת" ומעבד את הילדים המועברים אליה בתוך הספקים הדרושים. שים לב שה-`theme` ו-`setTheme` state נחוצים ב-`MyApp` עצמו, כך ש-`MyApp` עדיין הבעלים של החלק הזה של ה-state.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### הגדלה עם הקשר ומפחית {/*scaling-up-with-context-and-a-reducer*/}

באפליקציות גדולות יותר, מקובל לשלב הקשר עם [מפחית](/reference/react/useReducer) כדי לחלץ את ההיגיון הקשור ל-state מסוימות מתוך רכיבים. בדוגמה זו, כל ה"חיווט" מוסתר ב-`TasksContext.js`, המכיל מפחית ושני הקשרים נפרדים.

קרא [הדרכה מלאה](/learn/scaling-up-with-reducer-and-context) של דוגמה זו.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### ציון ערך ברירת המחדל {/*specifying-a-fallback-default-value*/}

אם React לא יכול למצוא ספקים של ה<CodeStep step={1}>הקשר</CodeStep> הספציפי הזה בעץ האב, ערך ההקשר המוחזר על ידי `useContext()` יהיה שווה ל<CodeStep step={3}>ערך ברירת המחדל</CodeStep> שציינת כאשר [יצרת/י את ההקשר הזה]):(/reacted).

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

ערך ברירת המחדל **לעולם לא משתנה**. אם אתה רוצה לעדכן את ההקשר, use אותו עם state כפי [מתואר לעיל.](#updating-data-passed-via-context)

לעתים קרובות, במקום `null`, יש ערך משמעותי יותר שאתה יכול use כברירת מחדל, לדוגמה:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

בדרך זו, אם תעבד בטעות רכיב כלשהו ללא ספק מתאים, הוא לא יישבר. זה גם עוזר לרכיבים שלך לעבוד היטב בסביבת בדיקה מבלי להגדיר הרבה ספקים בבדיקות.

בדוגמה שלמטה, כפתור "החלפת נושא" תמיד בהיר כיuse הוא **מחוץ לכל ספק הקשר ערכת נושא** וערך ערכת נושא ההקשר המוגדר כברירת מחדל הוא `'light'`. נסה לערוך את ערכת הנושא המוגדרת כברירת מחדל להיות `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### עקיפת הקשר עבור חלק מהעץ {/*overriding-context-for-a-part-of-the-tree*/}

אתה יכול לעקוף את ההקשר של חלק מהעץ על ידי עטיפה של חלק זה בספק בעל ערך שונה.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

אתה יכול לקנן ולעקוף ספקים כמה פעמים שאתה צריך.

<Recipes titleText="Examples of overriding context">

#### עקיפה של ערכת נושא {/*overriding-a-theme*/}

כאן, הכפתור *בתוך* ה-`Footer` מקבל ערך הקשר שונה (`"light"`) מהכפתורים שבחוץ (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### כותרות מקוננות אוטומטית {/*automatically-nested-headings*/}

אתה יכול "לצבור" מידע כאשר אתה מקנן ספקי הקשר. בדוגמה זו, הרכיב `Section` עוקב אחר ה-`LevelContext` המציין את עומק קינון הקטע. הוא קורא את ה-`LevelContext` מקטע האב, ומספק את המספר `LevelContext` המוגדל באחד לילדים שלו. כתוצאה מכך, הרכיב `Heading` יכול להחליט אוטומטית איזה מהתגים `<h1>`, `<h2>`, `<h3>`, ..., תגיות ל-use על סמך כמה רכיבי `Section` הוא מקונן בתוכם.

קרא [הדרכה מפורטת](/learn/pass-data-deeply-with-context) של דוגמה זו.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### אופטימיזציה של עיבוד מחדש בעת העברת אובייקטים ופונקציות {/*optimizing-re-renders-when-passing-objects-and-functions*/}

אתה יכול להעביר כל ערכים דרך הקשר, כולל אובייקטים ופונקציות.

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

כאן, <CodeStep step={2}>ערך ההקשר</CodeStep> הוא אובייקט JavaScript עם שני מאפיינים, שאחד מהם הוא פונקציה. בכל פעם ש-`MyApp` מעבד מחדש (לדוגמה, בעדכון מסלול), זה יהיה אובייקט *שונה* המצביע על פונקציה *שונה*, כך שגם React יצטרך לעבד מחדש את כל הרכיבים עמוק בעץ שקוראים ל-`useContext(AuthContext)`.

באפליקציות קטנות יותר, זו לא בעיה. עם זאת, אין צורך לעבד אותם מחדש אם הנתונים הבסיסיים, כמו `currentUser`, לא השתנו. כדי לעזור ל-React לנצל את העובדה הזו, תוכלו לעטוף את הפונקציה `login` ב-[`useCallback`](/reference/react/useCallback) ולעטוף את יצירת האובייקט ב-[`useMemo`](/reference/react/useMemo). זוהי אופטימיזציה של ביצועים:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

כתוצאה משינוי זה, גם אם `MyApp` צריך לבצע רינדור מחדש, הרכיבים הקוראים `useContext(AuthContext)` לא יצטרכו לבצע רינדור מחדש אלא אם כן `currentUser` השתנה.

קרא עוד על [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) ועל [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## פתרון בעיות {/*troubleshooting*/}

### הרכיב שלי לא רואה את הערך מהספק שלי {/*my-component-doesnt-see-the-value-from-my-provider*/}

ישנן כמה דרכים נפוצות שבהן זה יכול לקרות:

1. אתה מעבד את `<SomeContext.Provider>` באותו רכיב (או מתחת) שבו אתה קורא ל-`useContext()`. העבר את `<SomeContext.Provider>` *מעל ומחוץ* את הרכיב הקורא `useContext()`.
2. ייתכן ששכחת לעטוף את הרכיב שלך ב-`<SomeContext.Provider>`, או ששמת אותו בחלק אחר של העץ ממה שחשבתם. בדוק אם ההיררכיה נכונה באמצעות [React DevTools.](/learn/react-developer-tools)
3. ייתכן שנתקלת בבעיית בנייה כלשהי בכלי העבודה שלך שuses `SomeContext` כפי שנראה מהרכיב המספק ו`SomeContext` כפי שנראה על ידי רכיב הקריאה כשני אובייקטים שונים. זה יכול לקרות אם אתה use קישורים סימליים, למשל. אתה יכול לאמת זאת על ידי הקצאתם לגלובלים כמו `window.SomeContext1` ו-`window.SomeContext2` ולאחר מכן בדיקה אם `window.SomeContext1 === window.SomeContext2` במסוף. אם הם לא זהים, תקן את הבעיה ברמת כלי הבנייה.

### אני תמיד מקבל `undefined` מההקשר שלי למרות שערך ברירת המחדל שונה {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

יכול להיות שיש לך ספק בלי `value` בעץ:

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

אם תשכח לציין `value`, זה כמו להעביר את `value={undefined}`.

ייתכן שבטעות useתת שם אבזר אחר בטעות:

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

בשני המקרים הללו אתה אמור לראות אזהרה מ-React במסוף. כדי לתקן אותם, קרא לאביזר `value`:

```js {1,2}
// ✅ Passing the value prop
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

שים לב ש-[ערך ברירת המחדל מהקריאה `createContext(defaultValue)` שלך](#specificing-a-fallback-default-value) הוא רק used **אם אין ספק תואם למעלה בכלל.** אם יש רכיב `<SomeContext.Provider value={undefined}>` איפשהו בעץ האב, הרכיב שקורא את הערך *__*TK___ יקבל את הערך *__*TK___2_K.
