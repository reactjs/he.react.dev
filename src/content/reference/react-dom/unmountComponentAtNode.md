---
title: "unmountComponentAtNode"
---

<Deprecated>

ה-API הזה יוסר בגרסה ראשית עתידית של React.

ב-React 18, `unmountComponentAtNode` הוחלפה ב-[`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComponentAtNode` מסירה קומפונטת React שהורכבה מה-DOM.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

קראו ל-`unmountComponentAtNode` כדי להשלים קומפונטת React שהורכבה מה-DOM ולנקות את מטפלי האירועים וה-state שלה.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `domNode`: [ element DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React תסיר ממנו קומפונטת React שהורכבה.

#### מחזירה {/*returns*/}

`unmountComponentAtNode` מחזירה `true` אם קומפוננטה הוסרה ו-`false` אחרת.

---

## שימוש {/*usage*/}

קראו ל-`unmountComponentAtNode` כדי להוציא <CodeStep step={1}>קומפונטת React שהורכבה</CodeStep> מ-<CodeStep step={2}>DOM nodeפדפן</CodeStep>, ולנקות את מטפלי האירועים וה-state שלה.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### הסרת אפליקציית React מאלמנט DOM {/*removing-a-react-app-from-a-dom-element*/}

רצוי תרצו "לפזר" React בתוך עמוד קיים, או עמוד שלא נכתב כולו ב-React. שאליו היא רונדרה.

בדוגמה הזו, לחיצה על "Render React App" תרנדר אפליקציית React. לחצו על "הסר את האפליקציה React" כדי להשמיד אותה:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>
