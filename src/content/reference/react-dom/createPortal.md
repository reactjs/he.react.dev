---
title: "ליצור פורטל"
---

<Intro>

`createPortal` מאפשר לך להפוך חלק מהילדים לחלק אחר של DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

כדי ליצור פורטל, התקשר ל-`createPortal`, העברת כמה JSX, ואת הצומת DOM שבו יש להציג אותו:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[ראה דוגמאות נוספות למטה.](#usage)

פורטל משנה רק את המיקום הפיזי של הצומת DOM. בכל דרך אחרת, ה-JSX שאתה מעבד לפורטל פועל כצומת צאצא של הרכיב React שמעבד אותו. לדוגמה, הילד יכול לגשת להקשר שמספק עץ האב, ואירועים מבעבעים מהילדים להורים לפי העץ React.

#### פרמטרים {/*parameters*/}

* `children`: כל דבר שניתן לעבד עם React, כמו חתיכה של JSX (למשל `<div />` או `<SomeComponent />`), [Fragment] (/reference/react/Fragment) (`<>...</>`), או מחרוזת או מערך.

* `domNode`: צומת DOM כלשהו, ​​כגון אלו שהוחזרו על ידי `document.getElementById()`. הצומת חייב כבר להתקיים. העברת צומת DOM אחר במהלך עדכון תגרום לuse את תוכן הפורטל שייווצר מחדש.

* **אופציונלי** `key`: מחרוזת או מספר ייחודיים להיות used בתור [מפתח.](/learn/rendering-lists/#keeping-list-items-in-order-with-key)

#### מחזירה {/*returns*/}

`createPortal` מחזירה צומת React שניתן לכלול ב-JSX או להחזירו מרכיב React. אם React נתקל בו בפלט העיבוד, הוא יציב את ה-`children` המסופק בתוך ה-`domNode` המסופק.

#### אזהרות {/*caveats*/}

* אירועים מפורטלים מתפשטים לפי עץ React ולא עץ DOM. לדוגמה, אם תלחץ בתוך פורטל, והפורטל עטוף ב-`<div onClick>`, מטפל ה-`onClick` הזה יפעל. אם ה-causes בעיות, או עצור את הפצת האירועים מתוך הפורטל, או העבר את הפורטל עצמו למעלה בעץ React.

---

## שימוש {/*usage*/}

### עיבוד לחלק אחר של DOM {/*rendering-to-a-different-part-of-the-dom*/}

*פורטלים* מאפשרים לרכיבים שלך להפוך חלק מהילדים שלהם למקום אחר ב-DOM. זה מאפשר לחלק מהרכיב שלך "לברוח" מכל מיכל שהוא נמצא בתוכם. לדוגמה, רכיב יכול להציג דו-שיח מודאלי או הסבר כלים המופיע מעל ומחוץ לשאר העמוד.

כדי ליצור פורטל, עבד את התוצאה של `createPortal` עם <CodeStep step={1}>כמה JSX</CodeStep> והצומת <CodeStep step={2}>DOM לאן שהוא אמור להגיע</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React ישים את הצמתים DOM עבור <CodeStep step={1}>JSX שהעברת</CodeStep> בתוך הצומת <CodeStep step={2}>DOM שסיפקת</CodeStep>.

ללא פורטל, `<p>` השני יוצב בתוך האב `<div>`, אבל הפורטל "טלפורט" אותו לתוך [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

שימו לב כיצד הפסקה השנייה מופיעה חזותית מחוץ להורה `<div>` עם הגבול. אם תבדוק את מבנה DOM עם כלי מפתחים, תראה שה-`<p>` השני הוכנס ישירות ל-`<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

פורטל משנה רק את המיקום הפיזי של הצומת DOM. בכל דרך אחרת, ה-JSX שאתה מעבד לפורטל פועל כצומת צאצא של הרכיב React שמעבד אותו. לדוגמה, הילד יכול לגשת להקשר שמספק עץ האב, ואירועים עדיין מבעבעים מהילדים להורים לפי העץ React.

---

### עיבוד דו-שיח מודאלי עם פורטל {/*rendering-a-modal-dialog-with-a-portal*/}

אתה יכול use פורטל כדי ליצור דיאלוג מודאלי שצף מעל שאר העמוד, גם אם הרכיב שמזמן את הדיאלוג נמצא בתוך קונטיינר עם `overflow: hidden` או סגנונות אחרים שמפריעים לדיאלוג.

בדוגמה זו, לשני הקונטיינרים יש סגנונות שמשבשים את הדו-שיח המודאלי, אך זה שעובד לפורטל אינו מושפע מכיוון שuse, ב-DOM, המודאל אינו כלול ברכיבי האב JSX.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

חשוב לוודא שהאפליקציה שלך נגישה בעת שימוש בפורטלים. לדוגמה, ייתכן שתצטרך לנהל את מיקוד המקלדת כך שה-user יוכל להזיז את המיקוד פנימה והחוצה מהפורטל בצורה טבעית.

פעל על פי [שיטות הכתיבה המודיות של WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) בעת יצירת מודלים. אם אתה use חבילת קהילה, ודא שהיא נגישה ועוקבת אחר ההנחיות האלה.

</Pitfall>

---

### עיבוד רכיבי React לתוך סימון שרת שאינו React {/*rendering-react-components-into-non-react-server-markup*/}

פורטלים יכולים להיות מלאים use אם השורש React שלך הוא רק חלק מדף סטטי או מעובד בשרת שאינו בנוי עם React. לדוגמה, אם הדף שלך בנוי עם מסגרת שרת כמו Rails, אתה יכול ליצור אזורים של אינטראקטיביות בתוך אזורים סטטיים כמו סרגלי צד. בהשוואה לפורטלים של [מספר שורשים נפרדים של React,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) מאפשרים לך להתייחס לאפליקציה כאל עץ React יחיד עם state משותף למרות שהחלקים שלה __T מעבדים __T שונים.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### עיבוד רכיבי React לצמתים שאינם React DOM {/*rendering-react-components-into-non-react-dom-nodes*/}

אתה יכול גם use פורטל לניהול התוכן של צומת DOM המנוהל מחוץ ל-React. לדוגמה, נניח שאתה משתלב עם ווידג'ט מפה שאינו React וברצונך להציג תוכן React בתוך חלון קופץ. כדי לעשות זאת, הכריז על משתנה `popupContainer` state כדי לאחסן את הצומת DOM שאליו אתה הולך לרנדר:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

כאשר אתה יוצר את הווידג'ט של צד שלישי, אחסן את הצומת DOM שהוחזר על ידי הווידג'ט כדי שתוכל לעבד אותו:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

זה מאפשר לך use `createPortal` לעבד תוכן React ל-`popupContainer` ברגע שהוא יהיה זמין:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

הנה דוגמה מלאה שתוכל לשחק איתה:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
