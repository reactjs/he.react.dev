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

ReactTestUtils` מקל על תהליך בדיקת קומפוננטות ריאקט בכל פריימוורק בדיקה שתבחר. בפייסבוק אנו משתמשים ב- [Jest](https://facebook.github.io/jest/) לבדיקות ג'אווהסקריפט. למד איך להתחיל עם Jest דרך [למד איך להתחיל עם Jest דרך](https://jestjs.io/docs/tutorial-react).

> הערה:
>
> אנו ממליצים להשתמש ב- [`react-testing-library`](https://git.io/react-testing-library) מכיוון שתוכננה לאפשר ולעודד כתיבת בדיקות שמשתמשות בקומפוננטות שלך בצורה זהה למשתמשים.
>
> לחלופין, Airbnb שחררו כלי בדיקה שנקרא [Enzyme](https://airbnb.io/enzyme/), שמקל על טעינת, תפעול וחצייה של פלט קומפוננטות ריאקט.

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

## עיון {#reference}

### `act()` {#act}

כדי להכין קומפוננטה לטעינה, עטוף את הקוד שמרנדר אותה ומעדכן אותה בתוך קריאת `act()`. זה גורם לבדיקה שלך לרוץ קרוב לצורה שבה ריאקט עובדת בדפדפן.

>הערה
>
>אם אתה משתמש ב- `react-test-renderer`, הספרייה גם מספקת מתודת `act` שמתנהגת באותה צורה.

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

פה נראה כיצד להריץ עליה בדיקה:

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
  // בדיקת רינדור ראשון ו- componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // בדיקת רינדור שני ו- componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

אסור לשכוח ששיגור אירועי DOM עובד רק כשקונטיינר ה- DOM נוסף ל-  `document`.  ניתן להשתמש בעזר כמו [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) על מנת להפחית קוד.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

העבר מודול קומפוננטה ''מזוייפת'' למתודה זו על מנת להרחיב אותה עם מתודות שימושיות שנותנות את האפשרות להשתמש בה כקומפוננטת דמה. במקום לרנדר כרגיל, הקומפוננטה תהפוך ל- `<div>` פשוט(או תג אחר אם `mockTagName` מועברת גם) שמכיל את ה''ילדים'' המועברים.

> הערה:
>
> `mockComponent()` הוא API ישן. אנו ממליצים להשתמש ב- [רינדור רדוד](/docs/shallow-renderer.html) או [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) במקום.

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

מחזיר `true` אם `element` הוא אלמנט ריאקט כלשהו.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

מחזיר `true` אם `element` הוא אלמנט ריאקט מסוג`componentClass` של ריאקט.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

מחזיר `true` אם `instance` הוא קומפוננטת DOM(   כמו  `<div>` או `<span>`).

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

מחזיר `true` אם `instance` הוא קומפוננטה מסוג `componentClass` של ריאקט.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

חוצה את כל הקומפוננטות ב- `tree` וצובר את כל הקומפוננטות שבהן `test(component)` הוא `true`. זה לא כל כך שימושי בפני עצמו, אבל זה משמש כבסיס לכלי בדיקה אחרים.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

מאתר את כל אלמנטי ה- DOM של קומפוננטות בעץ המרונדר שהן קומפוננטות DOM עם שם המחלקה התואם `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

כמו [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) אבל מצפה לתוצאה אחת, ומחזיר את התוצאה האחת הזו, או מחזיר שגיאה אם יש מספר אחר של תוצאות.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

מאתר את כל אלמנטי ה- DOM של קומפוננטות בעץ המרונדר שהן קומפוננטות DOM עם שם התג התואם `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

כמו [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) אבל מצפה לתוצאה אחת, ומחזיר את התוצאה האחת הזו, או מחזיר שגיאה אם יש מספר אחר של תוצאות.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

מאתר את כל מופעי הקומפוננטות שלהן סוג שווה ל- `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

כמו [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) אבל מצפה לתוצאה אחת, ומחזיר את התוצאה האחת הזו, או מחזיר שגיאה אם יש מספר אחר של תוצאות.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

מרנדר אלמנט ריאקט ל- DOM node מנותק בדף. **פונקצייה זו דורשת DOM נוכח.** זה שווה ערך ל:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> הערה:
>
> יש צורך ב- `window`, `window.document` ו- `window.document.createElement` **לפני** שמייבאים את ריאקט. אחרת ריאקט יחשוב שאין גישה ל- DOM ומתודות כמו `setState` לא יעבדו.

* * *

## כלים אחרים {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

מדמה שיגור אירוע על DOM node עם `eventData` אופציונאלי.

ל- `Simulate` יש מתודה לכל [אירוע שריאקט מבין](/docs/events.html#supported-events).

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
> תצטרך לספק כל מאפיין אירוע שאתה משתמש בקומפוננטה שלך( כמו keyCode, which וכדומה) מכיון שריאקט לא יוצר אותם בשבילך.

* * *
