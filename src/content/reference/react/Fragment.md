---
title: "<Fragment> (<>...</>)"
---

<Intro>

`<Fragment>`, שלרוב משתמשים דרך בה התחביר `<>...</>`, יכול לקבץ אלמנטים בלי צומת עוטף.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<Fragment>` {/*fragment*/}

עטפו אלמנטים בתוך `<Fragment>` כדי לקבץ אותם במצבים צריכים אלמנט יחיד. קיבוץ אלמנטים בתוך `Fragment` לא משפיע על ה-DOM המתקבל; התוצאה זה מצב שבו האלמנטים לא קוב. תגית JSX ריקה `<></>` היא קיצור של `<Fragment></Fragment>` ברוב המקרים.

#### אבזרים {/*props*/}

- **אופציונלי** `key`: Fragments שמוצהרים בתחביר מפורש של `<Fragment>` יכולים לקבל [מפתחות.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### אזהרות {/*caveats*/}

- אם אתם רוצים להעביר `key` ל-Fragment, אי אפשר להשתמש בתחביר `<>...</>`. צריך לייבא מפורשות את `Fragment` מתוך `'react'` ולרנדר `<Fragment key={yourKey}>...</Fragment>`.

- React לא [מאפסת state](/learn/preserving-and-resetting-state) כשעוברים מרינדור `<><Child /></>` ל-`[<Child />]` או בחזרה, או כשעוברים מרינדור `<><Child /></>` ל-`<Child />` ובחזרה. זה עובד רק לעומק של רמה אחת: למשל, להמשיך מ-`<><><Child /></></>` ל-`<Child />` כן מאפס את ה-state. אפשר לראות את הסמנטיקה המדויקת [כאן.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## שימוש {/*usage*/}

### החזרת כמה אלמנטים {/*returning-multiple-elements*/}

השתמשו ב-`Fragment`, או בתחביר המקביל `<>...</>`, כדי לקבץ כמה אלמנטים יחד. אפשר להשתמש בזה כדי לשים כמה אלמנטים בכל מקום שבו אלמנט יחיד יכול להופיע. לדוגמה, אפשר להחזיר כמה אלמנטים ולהחזיר אותם כקבוצה:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments שימושיים כי אלמנטים עם Fragment לא משפיעים על layout או styles, האם לעיטוף הקיבוץ אלמנטים בתוך מיכל נוסף כמו אלמנט DOM. אם תבדקו את הדוגמה בכלי הדפדפן, תראו שכל ה-DOM צמתים של `<h1>` ושל `<article>` מופיעים כאחים בלי עטיפות סביבם:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### איך לכתוב Fragment בלי התחביר מיוחד? {/*how-to-write-a-fragment-without-the-special-syntax*/}

הדוגמה שקטה למעלה לייבוא ​​`Fragment` מתוך React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

בדרך כלל לא תצטרכו את זה אלא אם צריך [להעביר `key` ל-`Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### השמת כמה אלמנטים לשינוי {/*assigning-multiple-elements-to-a-variable*/}

כמו כל אלמנט אחר, אפשר לשייך Fragment אלמנטים למשתנים, להעביר אותם כ-props וכן הלאה:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### קיבוץ אלמנטים עם טקסט {/*grouping-elements-with-text*/}

אפשר להשתמש ב-`Fragment` כדי לקבץ טקסט יחד עם קומפונטות:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### רינדור רשימת Fragments {/*rendering-a-list-of-fragments*/}

זה מצב שבו צריך לכתוב `Fragment` במפורש במקום תחביר `<></>`. כש-[מרנדרים כמה אלמנטים בלולאה](/learn/rendering-lists), צריך להקצות `key` לכל אלמנט. אם האלמנטים בלולאה הם Fragments, חייבים להשתמש בתחביר JSX רגיל כדי לספק את המאפיין `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

אפשר לבדוק ב-DOM שאין אלמנטים עוטים סביב ילדי ה-Fragment:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
