---
id: code-splitting
title: פיצול-קוד
permalink: docs/code-splitting.html
---

## איגוד {#bundling}

בדרך כלל, הקבצים באפליקציות React ״מאוגדים״ באמצעות כלים כמו [Webpack](https://webpack.js.org/) או [Browserify](http://browserify.org/).
איגוד הוא תהליך שעוקב אחרי קבצים מיובאים ומאחד אותם לקובץ יחיד: ״באנדל״. את הבאנדל אפשר לצרף לדף אינטרנט כדי לטעון אפליקציה שלמה בבת אחת.

#### דוגמא {#example}

**אפליקציה:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**באנדל:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> הערה:
>
> הדוגמא להמחשה בלבל, וקובץ הבאנדל במציאות נראה שונה לגמרי.

אם יצרתם את האפליקציה בעזרת כלי כמו [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/) וכדומה, תוכלו להשתמש בהתקנה המובנית של Webpack כדי לאגד את האפליקציה.

אם לא, תצטרכו להתקין כלי איגוד בעצמכם. התיעוד הנ״ל לדוגמא, יעזור לכם [להתקין](https://webpack.js.org/guides/installation/) ו[להתחיל להשתמש](https://webpack.js.org/guides/getting-started/) ב- Webpack.


## פיצול קוד {#code-splitting}

איגוד הוא תהליך נחמד, אבל כשהאפליקציה שלכם גדלה, קובץ הבאנדל גדל איתה. בעיקר אם אתם משתמשים בספריות צד שלישי גדולות. תצטרכו לשים עין על הקוד שכלול בבאנדל כדי שהקובץ לא יגיע לגודל שיגרום לאפלקיציה שלכם להטען לאט מדי.

כדי שלא נגיע למצב שהבאנדל שלנו גדול מדי, כדאי להקדים את הבעיה ולהתחיל ״לפצל״ את הבאנדל.
[פיצול קוד](https://webpack.js.org/guides/code-splitting/) הוא פיצ׳ר שנתמך על ידי באנדלרים כמו Weback ו- Browserify (בעזרת [factor-bundle](https://github.com/browserify/factor-bundle)), שמאפשר ליצור מספר קבצי באנדל שיטענו באופן דינאמי בזמן ריצה.

פיצול קוד יכול לעזור לנו לממש ״טעינה עצלה״ של הדברים באפליקציה שהמשתמש צריך, וטעינה כזאת יכולה לשפר באופן משמעותי את הביצועים של האפליקציה. בצורה כזאת לא נאלץ להפחית את כמות הקוד, רק לא לטעון קוד שהמשתמש אולי לא יצטרך לעולם, ונפחית את כמות הקוד שנדרשת בזמן הטעינה הראשונה של האפליקציה.

## `import()` {#import}

הדרך הטובה ביותר לפצל קוד באפליקציה היא דרך סינטקס ה- `import()` הדינאמי.

**לפני:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**אחרי:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

> הערה:
>
> סינטקס ה- `import()` הדינאמי הוא [הצעת](https://github.com/tc39/proposal-dynamic-import)
> ECMAScript
> ונכון לעכשיו לא חלק סטנדרטי של השפה. סביר להניח שהיא תתקבל בעתיד הקרוב.

כש- Webpack מוצא סינטקס כזה, הוא מתחיל לפצל את הקוד באפליקציה באופן אוטומטי.
אם השתמשתם ב- Create React App, תוכלו [להתחיל להשתמש בפיצול קוד](https://facebook.github.io/create-react-app/docs/code-splitting) באופן מיידי. זה נתמך גם באופן מובנה ב- [Next.js](https://github.com/zeit/next.js/#dynamic-import).

אם התקנתם Webpack בעצמכם, כנראה תרצו לקרוא את [המדריך לפיצול קוד](https://webpack.js.org/guides/code-splitting/). קובץ הקונפיגורצית Webpack שלכם אמור להראות בערך [ככה](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

בזמן השימוש ב- [Babel](https://babeljs.io/), תצטרכו לוודא ש- Babel יכול לפרסר את סינטקס ה- import הדינאמי בלי לתרגם אותו. בשביל זה, תצטרכו להוסיף את החבילה [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> הערה:
>
> `React.lazy` ו- Suspense לא זמינים בינתיים למימוש בצד השרת.
> אם תרצו לפצל קוד שמרונדר בצד השרת, מומלץ להשתמש ב- [קומפוננטות נטענות](https://github.com/smooth-code/loadable-components).
> הנה [מדריך נחמד לשימוש בפיצול קוד בצד השרת](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).

פונקצית ה- `React.lazy` עוזרת לרנדר יבוא דינאמי כקומפוננטה רגילה

**לפני:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**אחרי:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

הקוד יטען את הבאנדל שמכיל אל הקומפוננטה `OtherComponent` בצורה אוטומטית כשהקומפוננטה מרונדרת.

`React.lazy` מקבל פונקציה שחייבת לקרוא ל-`import()` דינאמי. הוא חייב להחזיר `Promise` שמתפרשת למודול עם `default export` שמכיל קומפוננטת React.

### Suspense {#suspense}

אם המודול שמכיל את הקומפוננטה `OtherComponent` עדיין לא נטען כשהקומפוננטה `MyComponent` מרונדרת, צריך להראות תוכן חלופי עד שהיא תהיה מוכנה - כמו מחוון טעינה. אפשר לעשות זאת בעזרת קומפוננטת `Suspense`.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

ה-prop `fallback` מקבל אלמנט React כלשהו שירונדר עד לטעינת הקומפוננטה. ניתן לשים את קומפוננטת ה-`Suspense` בכל מקום מעל לקומפוננטה העצלה. אפשר אפילו לעטוף מספר קומפוננטות עצלות עם קומפוננטת `Suspense` אחת.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### גבולות שגיאה {#error-boundaries}

במקרה והמודול לא נטען בהצלחה (בגלל תקלה ברשת לדוגמא) תתקבל שגיאה. תוכלו לטפל בשגיאות כאלו באמצעות [גבולות שגיאה](/docs/error-boundaries.html) כדי לספק חווית משתמש טובה יותר. ניתן להגדיר ולהשתמש בגבול שגיאה בכל מקום מעל הקומפוננטה העצלה כדי להציג מצב שגיאה בזמן תקלה ברשת.

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Route-based code splitting {#route-based-code-splitting}

Deciding where in your app to introduce code splitting can be a bit tricky. You
want to make sure you choose places that will split bundles evenly, but won't
disrupt the user experience.

A good place to start is with routes. Most people on the web are used to
page transitions taking some amount of time to load. You also tend to be
re-rendering the entire page at once so your users are unlikely to be
interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using
libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Named Exports {#named-exports}

`React.lazy` currently only supports default exports. If the module you want to import uses named exports, you can create an intermediate module that reexports it as the default. This ensures that tree shaking keeps working and that you don't pull in unused components.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
