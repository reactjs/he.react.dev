---
id: code-splitting
title: פיצול-קוד
permalink: docs/code-splitting.html
---

## איגוד {#bundling}

בדרך כלל, הקבצים באפליקציות React ״מאוגדים״ באמצעות כלים כמו [Webpack](https://webpack.js.org/) , [Rollup](https://rollupjs.org/guide/en/#code-splitting) ו-[Browserify](http://browserify.org/) או [Browserify](http://browserify.org/).
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
> הדוגמא להמחשה בלבד, וקובץ הבאנדל במציאות נראה שונה לגמרי.

אם יצרתם את האפליקציה בעזרת כלי כמו [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/) וכדומה, תוכלו להשתמש בהתקנה המובנית של Webpack כדי לאגד את האפליקציה.

אם לא, תצטרכו להתקין כלי איגוד בעצמכם. לדוגמא, קראו את המדריכים [להתקנת](https://webpack.js.org/guides/installation/) ו[למשתמש המתחיל](https://webpack.js.org/guides/getting-started/) בדוקומנטציה של Webpack.

## פיצול קוד {#code-splitting}

איגוד הוא תהליך נחמד, אבל כשהאפליקציה שלכם גדלה, קובץ הבאנדל גדל איתה. בעיקר אם אתם משתמשים בספריות צד שלישי גדולות. תצטרכו לשים עין על הקוד שכלול בבאנדל כדי שהקובץ לא יגיע לגודל שיגרום לאפליקציה שלכם להטען לאט מדי.

כדי שלא נגיע למצב שהבאנדל שלנו גדול מדי, כדאי להקדים את הבעיה ולהתחיל ״לפצל״ את הבאנדל.
פיצול קוד הוא פיצ׳ר שנתמך על ידי באנדלרים כמו [Webpack](https://webpack.js.org/guides/code-splitting/) ו- Browserify (בעזרת [factor-bundle](https://github.com/browserify/factor-bundle)), שמאפשר ליצור מספר קבצי באנדל שיטענו באופן דינאמי בזמן ריצה.

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

כש- Webpack מוצא סינטקס כזה, הוא מתחיל לפצל את הקוד באפליקציה באופן אוטומטי.
אם השתמשתם ב- Create React App, תוכלו [להתחיל להשתמש בפיצול קוד](https://create-react-app.dev/docs/code-splitting/) באופן מיידי. זה נתמך גם באופן מובנה ב- [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

אם התקנתם Webpack בעצמכם, כנראה תרצו לקרוא את [המדריך לפיצול קוד](https://webpack.js.org/guides/code-splitting/). קובץ קונפיגורציית ה- Webpack שלכם אמור להראות בערך [ככה](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

בזמן השימוש ב- [Babel](https://babeljs.io/), תצטרכו לוודא ש- Babel יכול לפרסר את סינטקס ה- import הדינאמי בלי לתרגם אותו. בשביל זה, תצטרכו להוסיף את החבילה [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> הערה:
>
> `React.lazy` ו- Suspense לא זמינים בינתיים למימוש בצד השרת.
> אם תרצו לפצל קוד שמרונדר בצד השרת, מומלץ להשתמש ב- [קומפוננטות נטענות](https://github.com/gregberge/loadable-components).
> הנה [מדריך נחמד לשימוש בפיצול קוד בצד השרת](https://loadable-components.com/docs/server-side-rendering/).

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
```

הקוד יטען את הבאנדל שמכיל אל הקומפוננטה `OtherComponent` בצורה אוטומטית כשהקומפוננטה מרונדרת לראשונה.

`React.lazy` מקבל פונקציה שחייבת לקרוא ל-`import()` דינאמי. הוא חייב להחזיר `Promise` שמתפרשת למודול עם `default export` שמכיל קומפוננטת React.

### Suspense {#suspense}

הקומפוננטה צריכה להתרנדר בתוך קומפוננטת `Suspense`, שמאפשרת לנו להציג תוכן בסיס(כגון מחון טעינה) בזמן שאנו מחכים לקומפוננטה שתטען.

אם המודול שמכיל את הקומפוננטה `OtherComponent` עדיין לא נטען כשהקומפוננטה `MyComponent` מרונדרת, צריך להראות תוכן חלופי עד שהיא תהיה מוכנה - כמו מחוון טעינה. אפשר לעשות זאת בעזרת קומפוננטת `Suspense`.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

ה-`fallback` prop מקבל אלמנט React כלשהו שירונדר עד לטעינת הקומפוננטה. ניתן לשים את קומפוננטת ה-`Suspense` בכל מקום מעל לקומפוננטה העצלה. אפשר אפילו לעטוף מספר קומפוננטות עצלות עם קומפוננטת `Suspense` אחת.

```js
import React, { Suspense } from 'react';

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
import React, { Suspense } from 'react';
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

## פיצול קוד לפי route {#route-based-code-splitting}

ההחלטה איפה לפצל את הקוד יכולה להיות קצת בעייתית. תרצו לוודא מצד אחד שהבאנדלים יפוצלו באופן אחיד אבל גם שלא תפגע בחוויית המשתמש.

מקום טוב להתחיל בו הוא ה-routes. רוב האנשים ברשת רגילים שמעבר בין דפים לוקח זמן טעינה מסוים. בנוסף, הדף כולו מרונדר מחדש בבת אחת, ולכן המשתמשים לא יהיו באמצע אינטראקציה עם אלמנטים בדף בזמן הטעינה.

<<<<<<< HEAD
הנה דוגמא של פיצול קוד לפי routes בעזרת ספריות כמו [React Router](https://reacttraining.com/react-router/) עם `React.lazy`.
=======
Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reactrouter.com/) with `React.lazy`.
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## ייצוא בשם {#named-exports}

נכון לעכשיו `React.lazy` תומך רק בייצוא ברירת מחדל. אם המודול שרציתם להשתמש בו משתמש בייצוא בשם, תוכלו ליצור מודול ביניים שמייצוא את המודול כברירת מחדל. זה מוודא שניעור עצים (tree shaking) ימשיך לעבוד ושקומפוננטות מיובאות רק כשהן בשימוש.

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
