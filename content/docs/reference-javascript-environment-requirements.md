---
id: javascript-environment-requirements
title: דרישות סביבת JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 תלוי באוסף הטיפוסים [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) ו-[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). אם אתה תומך בדפדפנים ישנים יותר ומכשירים אשר עדיין לא מספקים אותם (לדוגמה, IE < 11) או אשר אין להם מימושים תואמים (IE 11), שקול להוסיף polyfill גלובלי לאפליקציה הארוזה שלך, כמו [core-js](https://github.com/zloirock/core-js) או [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 5e437a10ed4e89cd5eaf990ce4f43e0857592b53

סביבת polyfilled ל-React 16 עם שימוש ב-core-js כדי לתמוך בדפדפנים ישנים עשוייה להראות כך:

```js
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React גם תלוי ב-`requestAnimationFrame` (אפילו בסביבות בדיקה).  
אתה יכול להשתמש בספריית [raf](https://www.npmjs.com/package/raf) כדי לתמוך ב-`requestAnimationFrame`:

```js
import 'raf/polyfill';
```
