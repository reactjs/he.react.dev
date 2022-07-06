---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

תבנית נפוצה ב-React עבור קומפוננטה שמחזירה אלמנטים מרובים. Fragments נותנים לך לאחד רשימה של ילדים מבלי להוסיף nodes נוספים ל-DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

קיים גם [תחביר קצר](#short-syntax) להצהרתם, אבל זה עדיין לא נתמך בידי כלים פופולאריים.

## מוטיבציה {#motivation}

תבנית נפוצה עבור קומפוננטה שמחזירה רשימה של ילדים. קח לדוגמא את הקטע הזה של React:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` יצטרך להחזיר אלמנטים `<td>` מרובים כדי שהרנדור של ה-HTML יהיה חוקי. אם ה-div ישמש כהורה ב-`render()` של `<Columns />`, אז התוצאה של ה-HTML תהיה אינה חוקית.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

התוצאה בפלט של ה-`<Table />`:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Fragments פותרים את הבעיה הזו.

## שימוש {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

מה שמביא את `<Table />` לפלט תקין.

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### תחביר קצר {#short-syntax}

קיים תחביר חדש וקצר יותר שתוכל להשתמש בו להצהרת fragments. הוא נראה כמו תגיות ריקות.

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

אתה יכול להשתמש `<></>` באותו אופן שהשתמשת בכל אלמנט אחר, אך הוא אינו תומך ב-keys או תכונות.

### Keyed Fragments {#keyed-fragments}

Fragments מוצהר `<React.Fragment>` עם התחבר המפורש יכול להכיר keys. מקרה שימושי הוא כאשר ממפים אוסף למערך של fragments - לדוגמא, ליצירת רשימה של תיאור.

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` הוא התכונה היחידה שאפשר להעביר ל-`Fragment`, בעתיד, אנו נוסיף תמיכה לתכונות נוספות, כגון event handlers.

### דוגמא חיה {#live-demo}

אתה יכול לנסות את התחביר החדש של ה-JSX fragment עם [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000) הזה.
