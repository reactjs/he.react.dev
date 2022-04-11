---
id: shallow-renderer
title: מרנדר רדוד
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**ייבוא**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // npm עם ES5 
```

## סקירה כללית {#overview}

בעת כתיבת בדיקות יחידה עבור React, מרנדר רדוד יכול לעזור. מרנדר רדוד נותן לך לרנדר קומפוננטה “רמת עומק אחת”, ולוודא על מה המתודה רנדר מחזירה, מבלי לדאוג על התנהגותם של קומפוננטות הילדים שלה, אשר לא מייצרים מופע חדש או מתרנדרים. זה לא דורש DOM.

לדוגמה, אם יש לך את הקומפוננטה הבאה: 

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">כותרת</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

אז אתה יכול לוודא: 

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// בבדיקה שלך:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">כותרת</span>,
  <Subcomponent foo="bar" />
]);
```

למרנדר רדוד כרגע יש כמה מגבלות, למשל חוסר תמיכה ב-refs.

> הערה:
>
> אנחנו גם ממליצים לבדוק את ה-[API של המרנדר הרדוד](https://airbnb.io/enzyme/docs/api/shallow.html) של Enzyme. הוא מספק API מרמה-גבוהה יותר על אותה פונקציונליות.

## עיון {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

אתה יכול לחשוב על shallowRenderer כ-“מקום” לרנדור קומפוננטה שאתה בודק, וממנו ניתן להוציא את הפלט של הקומפוננטה.

<<<<<<< HEAD
`shallowRenderer.render()` דומה ל-[`()ReactDOM.render`](/docs/react-dom.html#render) אבל לא דורש DOM ומרנדר רק רמת עומק אחת. זה אומר שאתה יכול לבדוק קומפוננטות מבודדות מבלי לדעת איך הילדים שלהם ממומשים.
=======
`shallowRenderer.render()` is similar to [`root.render()`](/docs/react-dom-client.html#createroot) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

אחרי ש-`shallowRenderer.render()` נקרא, אתה יכול להשתמש ב-`shallowRenderer.getRenderOutput()` כדי לקבל את הפלט הרדוד שרונדר.

אחרי זה אתה יכול להתחיל לתשאל עובדות על הפלט.
