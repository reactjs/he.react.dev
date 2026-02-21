---
title: "PureComponent"
---

<Pitfall>

אנחנו ממליצים להגדיר קומפוננטות כפונקציות במקום שיעורים. [ראו איך לבצע מיגרציה.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` דומה ל-[`Component`](/reference/react/Component) אבל מדלגת על רינדורים חוזרים עבורם props ו-state. כיתת קומפוננטות עדיין נתמכות ב-React, אבל אנחנו לא ממליצים להשתמש בקוד חדש.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `PureComponent` {/*purecomponent*/}

כדי לדלג על רינדור חוזר של רכיב המחלקה עבורם props ו-state, הרחיבו את `PureComponent` במקום את [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` היא תת-מחלקה של `Component` ותומכת [בכל ה-APIs של `Component`.](/reference/react/Component#reference) הרחבה של `PureComponent` שק לולה הגדרת מתודת [`shouldComponentUpdate`](/reference/hould/component את#) ווה אישי/react/Component את# ה-props וה-state.


[עוד דוגמאות נוספות.](#usage)

---

## שימוש {/*usage*/}

### דילוג על רינדורים חוזרים מיותרים עבור רכיבי הכיתה {/*skipping-unnecessary-re-renders-for-class-components*/}

React בדרך כלל מרנדרת קומפוננת מחדש בכל פעם שהורה שלה מרונדר מחדש. כאופטימיזציה, אפשר ליצור פוננטה ש-React לא תרנדר מחדש כשההורה מרונדר מחדש, כל עוד ה-props וה-state החדשים שלהן לישנים. [רכיבי כיתה](/reference/react/Component) יכולים להצטרף להתנהגות הזו על ידי הרחבת `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

לקומפוננטת React תמיד צריכה להיות [לוגיקת רינדור טהורה.](/learn/keeping-components-pure) כלומר, היא חייבת להחזיר אותו פלט אם ה-props, ה-state וה-הקשר לא השתתנו. בשימוש ב-`PureComponent` אתם מצירים בפני React שהקומפוננתה עומדת בדרישה הזו, לכן React לא צריכה לרנדר מחדש כל עוד ה-props וה-state לא השתנתנו. עם זאת, הקומפוננטה עדיין תרונדר מחדש אם ההקשר שבו היא משתמשת.

בדוגמה הזו שימו לב שקומפונטת `Greeting` מרונדרת מחדש בכל פעם ש-`name` ranking (כי זה אחד ה-props שלה), אבל לא כש-`address` (כי הוא לא מועבר ל-`Greeting` כ-prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

אנחנו ממליצים להגדיר קומפוננטות כפונקציות במקום שיעורים. [ראו איך לבצע מיגרציה.](#alternatives)

</Pitfall>

---

## חלופות {/*alternatives*/}

### מיגרציה מ-`PureComponent` class component לפונקציה {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

אנחנו ממליצים להשתמש בקומפוננטות פונקציה במקום [רכיבי כיתה](/reference/react/Component) בקוד חדש. אם יש לכם רכיבי כיתה קיימות שמשתמשות ב-`PureComponent`, כך אפשר להמיר אותן. זה הקוד המקורי:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

כש-[ממירים את הקומפוננטה הזו מ-class לפונקציה,](/reference/react/Component#alternatives) עטפו אותה ב-[`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

נדרש ל-`PureComponent`, [`memo`](/reference/react/memo) לא משווה בין state חדש לישן. בקומפוננטות פונקציה, קריאה ל-[פונקציית `set`](/reference/react/useState#setstate) עם אותו state [כבר מונעת רינדורים חוזרים כברירתם מחדל,](/reference/react/memo#updating-a-memoized-component-using-state) גם בלי `memo`.

</Note>
