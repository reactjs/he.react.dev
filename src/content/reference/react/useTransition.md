---
title: "useTransition"
---

<Intro>

`useTransition` הוא React Hook המאפשר לך לעדכן את state מבלי לחסום את ממשק המשתמש.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useTransition()` {/*usetransition*/}

התקשר ל-`useTransition` ברמה העליונה של הרכיב שלך כדי לסמן כמה עדכוני state כמעברים.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

`useTransition` אינו לוקח פרמטרים כלשהם.

#### מחזירה {/*returns*/}

`useTransition` מחזיר מערך עם שני פריטים בדיוק:

1. הדגל `isPending` שאומר לך אם יש מעבר ממתין.
2. הפונקציה [`startTransition`](#starttransition) המאפשרת לסמן עדכון state כמעבר.

---

### `startTransition` פונקציה {/*starttransition*/}

הפונקציה `startTransition` המוחזרת על ידי `useTransition` מאפשרת לך לסמן עדכון state כמעבר.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### פרמטרים {/*starttransition-parameters*/}

* `scope`: פונקציה שמעדכנת חלק מה-state על ידי קריאה לפונקציה אחת או יותר של [`set`.](/reference/react/useState#setstate) React מתקשרת מיד ל`scope` ללא פרמטרים ומסמנת את כל `set` פונקציה אחת או יותר כפונקציה __TK_8_ מעדכנת באופן סינכרוני את לוח הזמנים __T_3. הם יהיו [לא חוסמים](#marking-a-state-update-as-a-non-blocking-transition) ו[לא יציגו מחווני טעינה לא רצויים.](#preventing-unwanted-loading-indicators)

#### מחזירה {/*starttransition-returns*/}

`startTransition` לא מחזיר כלום.

#### אזהרות {/*starttransition-caveats*/}

* `useTransition` הוא Hook, כך שניתן לקרוא לו רק בתוך רכיבים או Hooks מותאם אישית. אם אתה צריך להתחיל מעבר במקום אחר (לדוגמה, מספריית נתונים), התקשר ל-[`startTransition`](/reference/react/startTransition) העצמאי במקום זאת.

* אתה יכול לעטוף עדכון למעבר רק אם יש לך גישה לפונקציית `set` של אותו state. אם אתה רוצה להתחיל במעבר בתגובה לאביזר כלשהו או לערך Hook מותאם אישית, נסה את [`useDeferredValue`](/reference/react/useDeferredValue) במקום זאת.

* הפונקציה שאתה מעביר ל-`startTransition` חייבת להיות סינכרונית. React מבצע מיד את הפונקציה הזו, ומסמן את כל העדכונים state שקורים בזמן ביצועה כמעברים. אם תנסה לבצע יותר עדכוני state מאוחר יותר (לדוגמה, בזמן קצוב), הם לא יסומנו כמעברים.

* עדכון state המסומן כמעבר יופסק על ידי עדכוני state אחרים. לדוגמה, אם תעדכן רכיב תרשים בתוך מעבר, אבל אז תתחיל להקליד בקלט בזמן שהתרשים נמצא באמצע רינדור מחדש, React יתחיל מחדש את עבודת העיבוד ברכיב התרשים לאחר טיפול בעדכון הקלט.

* עדכוני מעבר לא יכולים להיות used כדי לשלוט בקלט טקסט.

* אם יש מספר מעברים מתמשכים, React כרגע מקבץ אותם יחד. זוהי מגבלה שככל הנראה תוסר במהדורה עתידית.

---

## שימוש {/*usage*/}

### סימון עדכון state כמעבר לא חוסם {/*marking-a-state-update-as-a-non-blocking-transition*/}

התקשר ל-`useTransition` ברמה העליונה של הרכיב שלך כדי לסמן עדכונים של state כ*מעברים* שאינם חוסמים.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` מחזיר מערך עם שני פריטים בדיוק:

1. הדגל <CodeStep step={1}>`isPending`</CodeStep> שאומר לך אם יש מעבר בהמתנה.
2. הפונקציה <CodeStep step={2}>`startTransition`</CodeStep> המאפשרת לך לסמן עדכון state כמעבר.

לאחר מכן תוכל לסמן עדכון state כמעבר כך:

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

מעברים מאפשרים לך לשמור על עדכוני ממשק user מגיבים אפילו במכשירים איטיים.

עם מעבר, ממשק המשתמש שלך נשאר מגיב באמצע עיבוד מחדש. לדוגמה, אם ה-user לוחץ על כרטיסייה אבל אז משנה את דעתו ולוחץ על כרטיסייה אחרת, הם יכולים לעשות זאת מבלי לחכות לסיום העיבוד המחודש הראשון.

<Recipes titleText="The difference between useTransition and regular state updates" titleId="examples">

#### עדכון הכרטיסייה הנוכחית במעבר {/*updating-the-current-tab-in-a-transition*/}

בדוגמה זו, הכרטיסייה "פוסטים" **האטה באופן מלאכותי** כך שלוקח שנייה לפחות לעיבוד.

לחץ על "פוסטים" ולאחר מכן לחץ מיד על "צור קשר". שימו לב שזה מפריע לעיבוד האיטי של "פוסטים". הכרטיסייה "צור קשר" מופיעה מיד. מכיוון שעדכון state זה מסומן כמעבר, רינדור איטי מחדש לא הקפיא את ממשק user.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### עדכון הכרטיסייה הנוכחית ללא מעבר {/*updating-the-current-tab-without-a-transition*/}

בדוגמה זו, גם הכרטיסייה "פוסטים" **האטה באופן מלאכותי** כך שלוקח שנייה לפחות לעיבוד. שלא כמו בדוגמה הקודמת, עדכון state זה הוא **לא מעבר.**

לחץ על "פוסטים" ולאחר מכן לחץ מיד על "צור קשר". שימו לב שהאפליקציה קופאת תוך כדי רינדור הכרטיסייה האטה, והממשק משתמש לא מגיב. עדכון state זה אינו מעבר, כך שעיבוד איטי מחדש הקפיא את ממשק user.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### עדכון רכיב האב במעבר {/*updating-the-parent-component-in-a-transition*/}

אתה יכול לעדכן את state של רכיב אב גם מהקריאה `useTransition`. לדוגמה, רכיב `TabButton` זה עוטף את ההיגיון `onClick` שלו במעבר:

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

מכיוון שרכיב האב מעדכן את state שלו בתוך מטפל האירועים `onClick`, עדכון state יסומן כמעבר. זו הסיבה, כמו בדוגמה הקודמת, אתה יכול ללחוץ על "פוסטים" ולאחר מכן ללחוץ מיד על "צור קשר". עדכון הכרטיסייה שנבחרה מסומן כמעבר, כך שהוא אינו חוסם אינטראקציות user.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### הצגת חזותית ממתינה state במהלך המעבר {/*displaying-a-pending-visual-state-during-the-transition*/}

אתה יכול use את הערך הבוליאני `isPending` המוחזר על ידי `useTransition` כדי לציין ל-user שמתבצע מעבר. לדוגמה, לחצן הכרטיסייה יכול להיות חזותי מיוחד "בהמתנה" state:

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

שימו לב כיצד לחיצה על "פוסטים" מרגישה כעת יותר מגיבה מכיוון שכפתור הכרטיסייה עצמו מתעדכן מיד:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### מניעת מחווני טעינה לא רצויים {/*preventing-unwanted-loading-indicators*/}

בדוגמה זו, הרכיב `PostsTab` מביא נתונים מסוימים באמצעות מקור נתונים [Suspense-enabled](/reference/react/Suspense). כאשר אתה לוחץ על הכרטיסייה "פוסטים", הרכיב `PostsTab` *מושעה*, מה שגורם להופעת החזרת הטעינה הקרובה ביותר:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

הסתרת כל מיכל הכרטיסיות כדי להציג מחוון טעינה מובילה לחוויית user צורמת. אם תוסיף את `useTransition` ל-`TabButton`, במקום זאת תוכל לציין את ה-state הממתין בלחצן הכרטיסייה במקום זאת.

שימו לב שלחיצה על "פוסטים" כבר לא מחליפה את כל מיכל הכרטיסיות בספינר:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[קרא עוד על שימוש במעברים עם Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

מעברים רק "ימתינו" מספיק זמן כדי להימנע מהסתרת תוכן *שנחשף כבר* (כמו מיכל הכרטיסיות). אם לכרטיסייה 'פוסטים' היה גבול [מקונן `<Suspense>`,](/reference/react/Suspense#revealing-nested-content-as-it-loads) המעבר לא היה "מחכה" לו.

</Note>

---

### בניית נתב תומך Suspense {/*building-a-suspense-enabled-router*/}

אם אתה בונה מסגרת React או נתב, אנו ממליצים לסמן ניווטים בדפים כמעברים.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

זה מומלץ משתי סיבות:

- [מעברים ניתנים להפסקה,](#marking-a-state-update-as-a-non-blocking-transition) המאפשר ל-user ללחוץ משם מבלי לחכות לסיום העיבוד מחדש.
- [מעברים מונעים מחווני טעינה לא רצויים,](#preventing-unwanted-loading-indicators) המאפשר ל-user להימנע מקפיצות צורמות בניווט.

הנה דוגמה זעירה לנתב פשוטה המשתמשת במעברים לניווטים.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[Suspense-enabled](/reference/react/Suspense) נתבים צפויים לעטוף את עדכוני הניווט למעברים כברירת מחדל.

</Note>

---

### הצגת שגיאה לusers עם גבול שגיאה {/*displaying-an-error-to-users-with-error-boundary*/}

<Canary>

גבול שגיאה עבור useTransition זמין כרגע רק בערוצים הקנריים והניסיוניים של React. למידע נוסף על ערוצי ההפצה של [React כאן](/community/versioning-policy#all-release-channels).

</Canary>

אם פונקציה שהועברה ל-`startTransition` זורקת שגיאה, תוכל להציג שגיאה ל-user שלך עם [גבול שגיאה](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). כדי use גבול שגיאה, עטוף את הרכיב שבו אתה קורא ל-`useTransition` בגבול שגיאה. לאחר שהפונקציה תועבר לשגיאות `startTransition`, תוצג החזרה לגבול השגיאה.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## פתרון בעיות {/*troubleshooting*/}

### עדכון קלט במעבר לא עובד {/*updating-an-input-in-a-transition-doesnt-work*/}

אתה לא יכול use מעבר עבור משתנה state השולט בקלט:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

הסיבה לכך היא שמעבריםuse אינם חוסמים, אך עדכון קלט בתגובה לאירוע השינוי אמור להתרחש באופן סינכרוני. אם ברצונך להפעיל מעבר בתגובה להקלדה, יש לך שתי אפשרויות:

1. ניתן להכריז על שני משתנים נפרדים של state: אחד עבור הקלט state (שתמיד מתעדכן באופן סינכרוני), ואחד שתעדכן במעבר. זה מאפשר לך לשלוט בקלט באמצעות ה-state הסינכרוני, ולהעביר את משתנה המעבר state (ש"ישאר אחרי" הקלט) לשאר הלוגיקה של העיבוד שלך.
2. לחלופין, אתה יכול לקבל משתנה state אחד, ולהוסיף [`useDeferredValue`](/reference/react/useDeferredValue) ש"יפגר מאחורי" הערך האמיתי. זה יפעיל עיבוד מחדש לא חוסם כדי "להדביק" את הערך החדש באופן אוטומטי.

---

### React לא מתייחס לעדכון state שלי כאל מעבר {/*react-doesnt-treat-my-state-update-as-a-transition*/}

כאשר אתה עוטף עדכון state במעבר, ודא שהוא קורה *במהלך* הקריאה `startTransition`:

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

הפונקציה שאתה מעביר ל-`startTransition` חייבת להיות סינכרונית.

לא ניתן לסמן עדכון כמעבר כך:

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

במקום זאת, תוכל לעשות זאת:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

באופן דומה, אינך יכול לסמן עדכון כמעבר כך:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Setting state *after* startTransition call
  setPage('/about');
});
```

עם זאת, זה עובד במקום זאת:

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

---

### אני רוצה לקרוא ל`useTransition` מחוץ לרכיב {/*i-want-to-call-usetransition-from-outside-a-component*/}

אתה לא יכול לקרוא ל-`useTransition` מחוץ לרכיב כי use זה Hook. במקרה זה, use השיטה העצמאית [`startTransition`](/reference/react/startTransition) במקום זאת. זה עובד באותו אופן, אבל זה לא מספק את מחוון `isPending`.

---

### הפונקציה שאני מעביר ל`startTransition` מבצעת מיד {/*the-function-i-pass-to-starttransition-executes-immediately*/}

אם תפעיל את הקוד הזה, הוא ידפיס 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**זה צפוי להדפיס 1, 2, 3.** הפונקציה שתעביר ל-`startTransition` לא מתעכבת. שלא כמו בדפדפן `setTimeout`, הוא לא מפעיל את ההתקשרות חזרה מאוחר יותר. React מבצע את הפונקציה שלך באופן מיידי, אבל כל עדכוני state המתוזמנים *בזמן שהוא פועל* מסומנים כמעברים. אתה יכול לדמיין שזה עובד ככה:

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```
