---
title: "ניהול הstate"
---

<Intro>

ככל שהאפליקציה שלך גדלה, זה עוזר להיות יותר מכוון לגבי האופן שבו הstate שלך מאורגנת ואיך זורמים בין הרכיבים שלך. מצב מיותר או כפול הוא מקור נפוץ לבאגים. בפרק זה, תלמד כיצד לבנות את הstate שלך היטב, כיצד לשמור על לוגיקה של עדכון הstate שלך ניתנת לתחזוקה וכיצד לשתף מצב בין רכיבים מרוחקים.

</Intro>

<YouWillLearn isChapter={true}>

* [איך לחשוב על שינויים בממשק משתמש כשינויים בstate](/learn/reacting-to-input-with-state)
* [איך לבנות מצב טוב](/learn/choosing-the-state-structure)
* [עזרה "להרים את הstate למעלה" כדי לשתף אותו בין רכיבים](/learn/sharing-state-between-components)
* [כיצד לשלוט אם הstate ישמר או יאופס](/learn/preserving-and-resetting-state)
* [כיצד לאחד היגיון מצב מורכב בפונקציה](/learn/extracting-state-logic-into-a-reducer)
* [כיצד להעביר מידע ללא "קידוח props"](/learn/passing-data-deeply-with-context)
* [כיצד להרחיב את ניהול הstate ככל שהאפליקציה שלך גדלה](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## מגיבה לקלט עם מצב {/*מגיב-לקלט-עם-מצב*/}

עם React, לא תשנה את ממשק משתמש מהקוד בעצם. לדוגמה, לא תכתוב פקודות כמו "השבת את הלחצן", "הפעל את הלחצן", "הצג את הודעת ההצלחה" וכו'. במקום זאת, תתאר את ממשק המשתמש שאתה רוצה עבור הstates החזותיים לראות את הרכיב שלך ("מצב התחלתי", "מצב הקלדה", "מצב הצלחה"), תפעיל את שינוי הstate בתגובה למשתמש. זה דומה לאופן שבו מעצבים על ממשק משתמש.

להלן טופס חידון שנבנה באמצעות React. שים לב איך הוא משתמש בשינוי הstate 'סטטוס' כדי לקבוע אם להפעיל או להשלים את לחצן השליחה, ואם להגיש את הדעת ההצלחה במקום זאת.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

קרא את **[להגיב לקלט עם מצב](/learn/reacting-to-input-with-state)** כדי ללמוד כיצד לגשת לאינטראקציות עם חשיבה מונעת לפי מצב.

</LearnMore>

## בחירת מבנה הstate {/*בחירת-מבנה-הstate*/}

מבנה מצב טוב לעשות הבדל בין רכיב שנעים לשינוי וניפוי באגים, כזה שמהווה מקור קבוע לבאגים. העיקרון העיקרי הוא שstate לא צריך להכיל מידע מיותר או משוכפל. אם יש מצב מיותר, קל לשכוח לעדכן אותו ולהציג באגים!

לדוגמה, לטופס זה יש משתנה מצב **מיותר** 'מלא שם':

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

אתה יכול להסיר אותו ולפשט את הקוד על ידי חישוב 'שם מלא' בזמן שהרכיב מעבד:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

זה אולי נראה כמו שינוי קטן, אבל באגים רבים באפליקציות הגיבו מתוקנים בדרך זו.

<LearnMore path="/learn/choosing-the-state-structure">

קרא את **[Choosing the State Structure](/learn/choosing-the-state-structure)** כדי ללמוד לעצב את צורת הstate כדי למנוע באגים.

</LearnMore>

## מצב שיתוף בין רכיבים {/*sharing-state-between-components*/}

לפעמים אתה רוצה שstateם של שני רכיבים ישתנה תמיד ביחד. כדי לעשות זאת, הם יעבירו אותו להורה המשותף הקרוב. זה ידוע בשם "רמת מצב למעלה", וזה אחד הדברים הנפוצים ביותר שתעשה בכתיבת קוד React.

בדוגמה זו, רק חלונית אחת צריכה להיות פעילה בכל פעם. כדי להשיג זאת, במקום לשמור על הstate הstate הprops עבור ילדיו.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

קרא את **[מצב שיתוף בין רכיבים](/learn/sharing-state-between-components)** כדי ללמוד כיצד להעלות מצב ולשמור על רכיבים מסונכרנים.

</LearnMore>

## שמירה ואיפוס מצב {/*שמירה-ו-איפוס-מצב*/}

כאשר אתה מעבד מחדש רכיב, React צריך להחליט אילו חלקים בעץ (ולעדכן), אילו חלקים לזרוק או ליצור מחדש מאפס. רוב המקרים, ההתנהגות האוטומטית של React עובדת מספיק טוב. כברירת מחדל, תגובה משמר את חלקי העץ מתאים" לעץ הרכיבים שעובד קודם לכן.

עם זאת, לפעמים זה לא מה שאתה רוצה. באפליקציית הצ'אט הזו, הקלדת הודעה ואז החלפת הנמען לא מאפסת את הקלט. זה יכול לגרום למשתמש לשלוח בטעות הודעה לאדם הלא נכון:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

תגובה מאפשרת לך לעקוף את התנהגות ברירת המחדל, ו*להכריח* רכיב לאפס את מצבו על ידי העברה לו `מפתח` אחר, כמו `<Chat key={email} />`. זה ל-React שאם הנמען שונה, זה צריך להיחשב כרכיב 'צ'אט' *שונה* שצריך ליצור מחדש מאפס עם החדשים (וכניסות כמו ממשק משתמש). עדיין בין הנמענים מאפס את שדה הקלט - למרות שאתה מעבד אותו רכיב.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

קרא את **[שימור ואיפוס מצב](/learn/preserving-and-resetting-state)** כדי ללמוד את משך החיים של הstate וכיצד לשלוט בו.

</LearnMore>

## חילוץ היגיון מצב לתוך מפחית {/*חילוץ-מצב-לוגיקה-לreducer*/}

רכיבים עם עדכוני מצב רבים מהמפוארים על פני רופאי אירועים רבים יכולים להיות מהמם. אלה, אתה יכול לאחד את כל הלוגיקה של עדכון הstate מחוץ לרכיב שלך בפונקציה אחת, הנקראת "מפחית". המטפלים שלך הופכים תמצי שהם מציינים רק את המשתמש "פעולות". בתחתית הקובץ, פונקציית המפחית מציינת כיצד הstate צריך להתעדכן בתגובה לכל פעולה!

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

קרא את **[חילוץ היגיון בstate reducer](/learn/extracting-state-logic-into-a-reducer)** כדי ללמוד איך לאחד את ההיגיון בפונקציית הרדוקרה.

</LearnMore>

## העברת נתונים עמוקה עם הקשר {/*העברת-נתונים-עמוק-עם-הקשר*/}

בדרך כלל, תעביר מידע לגבי אב רכיב ילד באמצעות props. אבל להעביר props יכולה להיות לא נוחה אם אתה צריך להעביר props דרך רכיבים רבים, או אם רכיבים רבים זקוקים למידע. ההקשר היכול לרכיב האב יצור מידע לזמין לכל רכיב בעץ שמתחתיו - לא משנה כמה הוא עמוק - לא להעביר אותו במפורש דרך props.

כאן, רכיב `Heading` קובע את רמת הכותרת שלו על ידי "שאילת" ה`Section` הקרוב ביותר לרמתו. כל 'מדור' עוקב אחר רמה משלו על ידי שאילת 'מדור' האב והוספת אחד אליו. כל 'מדור' מספק מידע לכל הרכיבים שמתחתיו להעברת props - הוא עושה זאת באמצעות הקשר.

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

<LearnMore path="/learn/passing-data-deeply-with-context">

קרא את **[העברת נתונים עמHooks עם ההקשר](/learn/passing-data-deeply-with-context)** כדי ללמוד לפעול בהקשר כחלופה לprops המועברים.

</LearnMore>

## הגדלה עם מפחית והקשר {/*הגדלה-עם-reducer-והקשר*/}

מפחית מאפשרים לך לאחד את לוגיקת עדכון הstate של רכיב. ההקשר האפשרי להעביר מידע אחר למטה לרכיבים. אתה יכול להפחית את השלב והקשר יחד כדי לנהל מצב של כמות מורכבת.

בגישה זו, רכיב אב עם מצב מורכב מנהל אותו עם מפחית. רכיבים אחרים בכל מקום עמוק בעץ יכולים לקרוא את המצב באמצעות הקשר. הם יכולים גם לשלוח פעולות לעדכון מצב זה.

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
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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

export default function AddTask({ onAddTask }) {
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

קרא את **[הגדלה עם מפחית והקשר](/learn/scaling-up-with-reducer-and-context)** כדי ללמוד ניהול מצב מתרחב באפליקציה צומחת.

</LearnMore>

## מה הלאה? {/*מה-הבא*/}

עבור אל [מגיב לקלט עם מצב](/learn/reacting-to-input-with-state) כדי להתחיל לקרוא פרק זה עמוד אחר עמוד!

או, אם אתה כבר מכיר את הנושאים האלה, למה שלא תקרא על [Escape Hatches](/learn/escape-hatches)?
