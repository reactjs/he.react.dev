---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
אם אתם טוענים את React מתגית `<script>`, ה-APIs מהרמה העליונה הבאים זמינים תחת המשתנה הגלובלי `ReactDOM`. אם אתם משתמשים ב-ES6 עם npm, אתם יכולים לכתוב `import ReactDOM from 'react-dom'`. אם אתם משתמשים ב-ES5 עם npm, תוכלו לכתוב `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

## סקירה כללית {#overview}

<<<<<<< HEAD
החבילה `react-dom` מספקת מתודות ספציפיות ל-DOM שניתן להשתמש בהן ברמה העליונה של האפליקציה שלכם וכפתח מילוט כדי להגיע אל מחוץ למודל React אם יש לכם צורך בכך. לרוב הקומפוננטות שלכם לא אמור להיות צורך להשתמש במודול זה.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### תמיכה בדפדפנים {#browser-support}

<<<<<<< HEAD
React תומכת בכל הדפדפנים הפופולריים, כולל Internet Explorer 9 ומעלה, אם כי [כמה polyfills נדרשים](/docs/javascript-environment-requirements.html) עבור דפדפנים ישנים יותר כגון IE 9 ו-IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

> הערה
>
<<<<<<< HEAD
> אנו לא תומכים בדפדפנים ישנים יותר שאינם תומכים במתודות ES5, אך ייתכן שתגלו שהאפליקציות שלכם פועלות בדפדפנים ישנים יותר אם תכללו בעמוד polyfills כגון [es5-shim ו- es5-sham](https://github.com/es-shims/es5-shim). אתם לבדכם במערכה אם תבחרו לקחת את הנתיב הזה.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

## סימוכין {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
מרנדרת אלמנטי React לתוך ה-DOM ב-`container` שסופק ומחזירה [הפנייה (reference)](/docs/more-about-refs.html) לקומפוננטה (או מחזירה `null` עבור [קומפוננטות חסרות state](/docs/components-and-props.html#function-and-class-components)).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

אם קומפוננטת ה-React רונדרה קודם לכן ל-`container`, פעולה זו תבצע עדכון עבורה ורק תשנה את ה-DOM לפי הצורך כדי לשקף את אלמנט ה-React האחרון.

אם ארגומנט ה-callback האופציונלי מסופק, הוא יורץ לאחר שהקומפוננטה רונדרה או עודכנה.



> הערה:
>
<<<<<<< HEAD
> `ReactDOM.render()` שולטת בתוכן של הצומת המכיל שאתם מעבירים. כל אלמנטי ה-DOM הקיימים בתוכו מוחלפים בקריאה הראשונה. קריאות מאוחרות יותר משתמשות באלגוריתם הבדלת ה-DOM של React לביצוע עדכונים יעילים.
>
> `ReactDOM.render()` לא משנה את הצומת המכיל (רק משנה את הילדים של המכיל). ייתכן שיהיה אפשר להכניס קומפוננטה לצומת DOM קיים מבלי לדרוס את הילדים הקיימים.
>
> [הפנייה ל-callback](/docs/refs-and-the-dom.html#callback-refs) לאלמנט השורש.
>
> שימוש ב-`ReactDOM.render()` כדי לנקות תוכן אלמנט שנשלח על-ידי השרת הוצא משימוש והאפשרות תוסר ב-React 17. השתמשו ב-[`hydrate()`](#hydrate) במקום.
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
כמו [`render()`](#render), אבל משמשת לניקוי של צומת מכיל שתוכן ה-HTML שלו רונדר על-ידי [`ReactDOMServer`](/docs/react-dom-server.html). React תנסה לצרף מנהלי אירועים ל-markup הקיים.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

React מצפה שהתוכן המרונדר יהיה זהה בין השרת לבין הלקוח. היא יכולה לתקן את ההבדלים בתוכן טקסט, אבל אתם צריכים לטפל באי-התאמות כפי שאתם מטפלים בבאגים ולתקן אותם. במצב פיתוח, React מזהירה מפני אי התאמות במהלך הניקוי. אין הבטחות כי הבדלי מאפיינים יתוקנו במקרה של אי-התאמה. זה חשוב מסיבות של ביצועים כי ברוב האפליקציות, אי-התאמות הן דבר נדיר, ולכן אימות כל ה-markup יהיה יקר מדי כך שנרצה להמנע ממנו.

אם מאפיין או תוכן טקסט של אלמנט בודד שונה באופן בלתי נמנע בין השרת לבין הלקוח (לדוגמה, חותמת זמן), תוכלו להשתיק את האזהרה על ידי הוספת `suppressHydrationWarning={true}` לאלמנט. זה עובד רק עבור רמת עומק אחת, ונועד להיות רק כפתח מילוט. אל תשתמשו בזה יותר מדי. אלא אם כן מדובר בתוכן טקסט, React עדיין לא תנסה לתקן אותו, לכן ייתכן שהוא יישאר בלתי עקבי עד לעדכונים עתידיים.

אם אתם בכוונה צריכים לרנדר משהו שונה בצד השרת ובצד הלקוח, אתם יכולים לבצע רינדור בשני מעברים. קומפוננטות המרנדרות משהו אחר בצד הלקוח יכולות לקרוא משתנה מה-state כמו `this.state.isClient`, שאותו תוכלו להגדיר ל-`true` ב-`componentDidMount()`. בדרך זו מעבר הרינדור הראשוני ירנדר את אותו תוכן כמו השרת, תוך הימנעות מאי-התאמות, אבל מעבר נוסף יקרה באופן סינכרוני מיד לאחר הניקוי. שימו לב כי גישה זו תהפוך את הקומפוננטות שלכם לאיטיות יותר כי הן צריכות להתרנדר פעמיים, אז השתמשו בה בזהירות.

זכרו להיות מודעים לחוויית המשתמש על חיבורים איטיים. קוד ה-JavaScript עלול להטען מאוחר יותר באופן משמעותי מאשר רינדור ה-HTML הראשוני, כך שאם אתם מרנדרים משהו שונה ברינדור אצל הלקוח בלבד, המעבר יכול להיות צורם. עם זאת, אם מבוצע היטב, זה עשוי להיות מועיל לרנדר "מעטפת" של האפליקציה בשרת, ורק להראות כמה ווידג'טים נוספים אצל הלקוח. כדי ללמוד כיצד לעשות זאת מבלי לקבל בעיות אי-ההתאמה ב-markup, עיינו בהסבר בפסקה הקודמת.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
מסירה קומפונטה React מתופעלת מה-DOM ומנקה את מנהלי האירועים ואת ה-state. אם הקומפוננטה לא הופעלה על ה-container, קריאה לפונקציה זו אינה עושה דבר. מחזירה `true` אם ביטול תפעול הקומפוננטה צלח ו-`false` אם לא היתה קומפוננטה כדי לבטל את הפעלתה.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

* * *

### `findDOMNode()` {#finddomnode}

> הערה:
>
> `findDOMNode` היא פתח מילוט המשמשת כדי לגשת לצומת ה-DOM הבסיסי. ברוב המקרים, שימוש בפתח מילוט זה הוא לא מומלץ מכיוון שזה חודר את האבסטרקציה של הקומפוננטה. [היא הוצאה משימוש ב-`StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)



```javascript
findDOMNode(component)
```
אם קומפוננטה זו כבר הופעלה לתוך ה-DOM, קריאה זו מחזירה את אלמנט ה-DOM התואם המקורי של הדפדפן. מתודה זו שימושית עבור קריאת ערכים מתוך ה-DOM, כגון ערכי שדות טופס וביצוע מדידות DOM. **ברוב המקרים, ניתן לצרף הפנייה לצומת DOM ולהימנע לגמרי משימוש ב-`findDOMNode`.**

כאשר קומפוננטה מרונדרת ל-`null` או `false`, `findDOMNode` מחזירה `null`. כאשר קומפוננטה מרונדרת למחרוזת, `findDOMNode` מחזירה צומת DOM מסוג טקסט המכילה את הערך. החל מ-React 16, קומפוננטה יכולה להחזיר קטע עם מספר ילדים, ובמקרה כזה `findDOMNode` תחזיר את צומת ה-DOM התואם לילד הראשון שאינו ריק.

> הערה:
>
> `findDOMNode` עובדת רק על קומפוננטות שהופעלו (כלומר, קומפוננטות שכבר הוכנסו ל-DOM). אם אתם מנסים לקרוא לה על קומפוננטות שעדיין לא הופעלו (כמו קריאה ל-`findDOMNode()` מתוך `render()` על קומפוננטה שעדיין לא נוצרה) תזרק שגיאה.
>
> `findDOMNode` לא יכולה להקרא על קומפוננטות פונקציה.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

מייצרת פורטל. פורטלים מספקים דרך [לרנדר ילדים לתוך צומת DOM שקיים מחוץ להיררכיה של קומפוננטת ה-DOM](/docs/portals.html).
=======
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
