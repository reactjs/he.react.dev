---
id: test-renderer
title: מרנדר טסטים
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**יבוא**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## סקירה כללית {#overview}

חבילה זו מספקת מרנדר React שניתן להשתמש בו כדי לעבד קומפוננטות React לאובייקטי JavaScript טהורים, ללא תלות ב-DOM או בסביבת מובייל טבעית.

בעיקרו של דבר, חבילה זו מאפשרת לנו לתפוס תצלום של היררכיית תצוגת הפלטפורמה (הדומה לעץ DOM) בקלות שמרונדרת על ידי React DOM או קומפוננטת React Native ללא שימוש בדפדפן או [jsdom](https://github.com/tmpvar/jsdom).

דוגמה:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

ניתן להשתמש בתכונת בדיקות תצלום של Jest כדי לשמור באופן אוטומטי עותק של עץ ה-JSON לקובץ ולבדוק בתוך הטסטים שלך שהוא לא השתנה: [למידע נוסף על כך](https://jestjs.io/docs/en/snapshot-testing).

אתם יכולים גם לעבור על הפלט כדי למצוא צמתים ספציפיים ולבצע בדיקות לגביהם.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">שלום</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">תחתית</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['תחתית']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)
* [`TestRenderer.act()`](#testrendereract)

### מופע TestRenderer {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## סימוכין {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

צור מופע `TestRenderer` עם קומפוננטת ה-React שהועברה. הוא לא משתמש ב-DOM האמיתי, אך הוא עדיין מרנדר את עץ הקומפוננטה לזיכרון באופן מלא, כך שתוכלו לבצע השוואות לגביו. מחזיר [מופע TestRenderer](#testrenderer-instance).

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

Similar to the [`act()` helper from `react-dom/test-utils`](/docs/test-utils.html#act), `TestRenderer.act` prepares a component for assertions. Use this version of `act()` to wrap calls to `TestRenderer.create` and `testRenderer.update`.

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // The component being tested

// render the component
let root; 
act(() => {
  root = create(<App value={1}/>)
});

// make assertions on root 
expect(root.toJSON()).toMatchSnapshot();

// update with some different props
act(() => {
  root = root.update(<App value={2}/>);
})

// make assertions on root 
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

החזר אובייקט המייצג את העץ שרונדר. עץ זה מכיל רק את הצמתים הספציפיים לפלטפורמה כגון `<div>` או `<View>` ואת ה-props שלהם, אך אינו מכיל קומפוננטות שנכתבו על ידי המשתמש. זה שימושי עבור [בדיקות תמונת מצב](https://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

החזר אובייקט המייצג את העץ שרונדר.  הייצוג מפורט יותר מזה שניתן על ידי `toJSON()`, והוא כולל את הקומפוננטות שנכתבו על ידי המשתמש. אתם כנראה לא תצטרכו להשתמש במתודה זו, אלא אם אתם כותבים ספריית בדיקות משלכם הטענה הפועלת מעל מרנדר הטסטים.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

מרנדר מחדש את העץ בתוך הזיכרון עם אלמנט שורש חדש. פעולה זו מדמה עדכון React בשורש. אם לאלמנט החדש יש את אותו סוג ואותו מפתח כמו האלמנט הקודם, העץ יעודכן; אחרת, הוא יעשה mount מחדש לעץ חדש.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

בטל את טעינת העץ בזיכרון, תוך הפעלת אירועי מחזור החיים המתאימים.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

החזר את המופע התואם לאלמנט השורש, אם זמין. פעולה זו לא תעבוד אם אלמנט השורש הוא קומפוננטת פונקציה מכיוון שאין להם מופעים.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

מחזיר את אובייקט השורש "test instance" שהינו שימושי להכנת השוואות לגבי צמתים ספציפיים בעץ. אתם יכולים להשתמש בו כדי למצוא "test instances" אחרים עמוק יותר בעץ.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

מצא מופע צאצא של טסט בודד שעבורו `test(testInstance)` מחזירה `true`. אם `test(testInstance)` אינה מחזירה `true` עבור מופע בדיקה אחד בדיוק, תזרק שגיאה.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

מצא מופע צאצא של טסט בודד עם ה-`type` שסופק. אם אין בדיוק מופע מבחן אחד עם ה-`type` שסופק, תזרק שגיאה.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

מצא מופע צאצא של טסט בודד עם ה-`props` שסופק. אם אין בדיוק מופע מבחן אחד עם ה-`props` שסופק, תזרק שגיאה.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

מצא את כל צאצאי מופע הטסט שעבורם `test(testInstance)` מחזירה `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

מצא את כל צאצאי מופע הטסט עם ה-`type` שסופק.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

מצא את כל צאצאי מופע הטסט עם ה-`props` שסופק.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

מופע הקומפוננטה התואמת למופע טסט זה. זמין רק עבור קומפוננטות מחלקה, מכיוון שלקומפוננטות פונקציה אין מופעים. כמו כן, מתאים את הערך של `this` בתוך הקומפוננטה שניתנה.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

סוג הקומפוננטה התואם למופע טסט זה. לדוגמה, לקומפוננטת `<Button />` יהיה ערך סוג `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

ה-props המתאימים למופע טסט זה. לדוגמה, לקומפוננטה `<Button size="small" />` יש `{size: 'small'}` בתור props.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

מופע טסט האב של מופע טסט זה.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

מופעי ילדי הטסטים של מופע טסט זה.

## רעיונות {#ideas}

ניתן להעביר את הפונקציה `createNodeMock` ל-`TestRenderer.create` בתור option, המאפשרת שימוש בהפניות מדומות מותאמים אישית.
`createNodeMock` מקבלת את האלמנט הנוכחי ואמורה להחזיר אובייקט הפנייה מדומה.
אפשרות זו שימושית בעת בדיקת קומפוננטה המסתמכת על הפניות.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
