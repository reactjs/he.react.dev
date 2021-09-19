---
id: test-utils
title: כלי בדיקה
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**ייבוא**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 עם npm
```

## סקירה כללית {#overview}

`ReactTestUtils` מקל על תהליך בדיקת קומפוננטות React בכל פריימוורק בדיקה שתבחר. ב-Facebook אנו משתמשים ב-[Jest](https://facebook.github.io/jest/) לבדיקות JavaScript בצורה קלה. למד איך להתחיל עם Jest דרך [מדריך React](https://jestjs.io/docs/tutorial-react) באתר האינטרנט של Jest.

> הערה:
>
> לגרסאות ריאקט מתחת או בגרסה 16, ספריית [Enzyme](https://airbnb.io/enzyme/) עוזרת לעשות מניפולציות על פלטי קומפוננטות בקלות.


>>>>>>> e60bca04f3da690256ce019bd8907c2b368589ee

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## סימוכין {#reference}

### `act()` {#act}

כדי להכין קומפוננטה לווידוא, עטוף את הקוד שמרנדר אותה ומבצע עליה עדכונים בתוך קריאת `act()`. פעולה זו גורמת לבדיקה שלך לרוץ באופן דומה לצורה שבה React עובדת בדפדפן.

>הערה
>
>אם אתה משתמש ב-`react-test-renderer`, הספרייה גם מספקת מתודת `act` שמתנהגת באותה צורה.

לדוגמה, נגיד שיש לנו את קומפוננטת `Counter` הבאה:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>
          Click me
        </button>
      </div>
    );
  }
}
```

ככה נוכל לבדוק אותה:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // בדיקת רינדור ראשון ו-componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // בדיקת רינדור שני ו-componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

אסור לשכוח ששיגור אירועי DOM עובד רק כשקונטיינר ה-DOM נוסף ל-`document`.  ניתן להשתמש בעזר כמו [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) על מנת להפחית קוד תבנית קבועה.

המסמך [`recipes`](/docs/testing-recipes.html) מכיל עוד מידע על ההתנהגות של `()act`, עם דוגמאות ודרכי שימוש.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

העבר מודול קומפוננטה "מזוייפת" למתודה זו על מנת להרחיב אותה עם מתודות שימושיות שנותנות את האפשרות להשתמש בה כקומפוננטת React מדומה. במקום לרנדר כרגיל, הקומפוננטה תהפוך ל-`<div>` פשוט (או תג אחר אם סופק גם `mockTagName`) שמכיל את הילדים שסופקו.

> הערה:
>
> `mockComponent()` הוא API ישן. אנו ממליצים להשתמש ב-[רינדור רדוד](/docs/shallow-renderer.html) או ב-[`jest.mock()`](https://jestjs.io/docs/tutorial-react-native#mock-native-modules-using-jestmock) במקום.

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

מחזיר `true` אם `element` הוא אלמנט React כלשהו.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

מחזיר `true` אם `element` הוא אלמנט React מסוג `componentClass` של React.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

מחזיר `true` אם `instance` הוא קומפוננטת DOM (כמו `<div>` או `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

מחזיר `true` אם `instance` הוא קומפוננטה שהוגדרה על ידי המשתמש, לדוגמה מחלקה או פונקצייה.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

מחזיר `true` אם `instance` הוא קומפוננטה מסוג `componentClass` של React.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

חוצה את כל הקומפוננטות ב-`tree` וצובר את כל הקומפוננטות שבהן `test(component)` הוא `true`. זה לא כל כך שימושי בפני עצמו, אבל זה משמש כבסיס לכלי בדיקה אחרים.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

מאתר את כל אלמנטי ה-DOM של קומפוננטות בעץ המרונדר שהן קומפוננטות DOM עם שם המחלקה התואם `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

כמו [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) אבל מצפה שתהיה תוצאה אחת, ומחזיר את התוצאה האחת הזו, או זורק שגיאה אם יש מספר אחר של תוצאות מעבר לאחת.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

מאתר את כל אלמנטי ה-DOM של קומפוננטות בעץ המרונדר שהן קומפוננטות DOM עם שם תג התואם את `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

כמו [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) אבל מצפה לתוצאה אחת, ומחזיר את התוצאה האחת הזו, או זורק שגיאה אם יש מספר אחר של תוצאות מעבר לאחת.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

מאתר את כל מופעי הקומפוננטות שהסוג שלהן שווה ל-`componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

כמו [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) אבל מצפה לתוצאה אחת, ומחזיר את התוצאה האחת הזו, או זורק שגיאה אם יש מספר אחר של תוצאות מעבר לאחת.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

מרנדר אלמנט React לצומת DOM מנותקת בדף. **פונקצייה זו דורשת DOM נוכח.** זה שווה ערך ל:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> הערה:
>
> יש צורך ב-`window`, `window.document` ו-`window.document.createElement` זמינים באופן גלובלי **לפני** שמייבאים את `React`. אחרת React תחשוב שאין לה גישה ל-DOM ומתודות כמו `setState` לא יעבדו.

* * *

## כלים אחרים {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

מדמה שיגור אירוע על צומת DOM עם נתוני אירוע `eventData` אופציונאליים.

ל-`Simulate` יש מתודה ל[כל אירוע שReact מבינה](/docs/events.html#supported-events).

**לחיצה על אלמנט**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**שינוי ערך של שדה קלט ואז לחיצת ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> הערה
>
> תצטרך לספק כל מאפיין אירוע שאתה משתמש בו בקומפוננטה שלך (כמו keyCode, which וכו') מכיון ש-React לא יוצרת אף אחד מהם עבורך.

* * *
