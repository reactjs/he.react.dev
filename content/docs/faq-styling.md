---
id: faq-styling
title: סגנון ו-CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### איך אני מוסיף CSS classes לקומפוננטה שלי? {#how-do-i-add-css-classes-to-components}

העבר מחרוזת ל-prop `className`:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

זה נפוץ ש-CSS classes תלויים ב-props או state של הקומפוננטה:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>טיפ
>
>אם לעיתים קרובות אתה מוצא את עצמך כותב קוד כזה, ספריית [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) יכולה לפשט זאת.

### האם אני יכול לכתוב סגנון בשורה? {#can-i-use-inline-styles}

כן, ראה את התיעוד על סגנון [כאן](/docs/dom-elements.html#style).

### סגנון בשורה הוא רע? {#are-inline-styles-bad}

CSS classes בדרך כלל טובים יותר לביצועים מאשר סגנון בשורה.

### מה זה CSS ב-JS? {#what-is-css-in-js}

“CSS ב-JS” מתייחס לתבנית שבה CSS מורכב מ-JavaScript במקום קובץ שמוגדר חיצונית. קרא את ההשוואה של ספריות CSS ב-JS [כאן](https://github.com/MicheleBertoli/css-in-js).

_שים לב שהפונקציונאליות הזאת היא לא חלק מ-React, אך מסופקת מספריות צד שלישי._ ל-React אין דיעה על איך סגנון מוגדר; אם יש ספק, נקודת התחלה טובה היא להגדיר את הסגנון שלך קובץ `*.css` חיצוני כרגיל לפנות אלייהם באמצעות [`className`](/docs/dom-elements.html#classname).

### האם אני יכול לעשות אנימציות ב-React? {#can-i-do-animations-in-react}

ניתן להשתמש ב-React להנפשת אנימציות. ראה [React Transition Group](https://reactcommunity.org/react-transition-group/) ו-[React Motion](https://github.com/chenglou/react-motion) לדוגמא.
