---
title: "renderToPipeableStream"
---

<Intro>

`renderToPipeableStream` מעבד עץ React לזרם [Node.js שניתן להזרים.](https://nodejs.org/api/stream.html)

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API זה ספציפי ל-Node.js. סביבות עם [זרמי אינטרנט,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) כמו Deno וזמני ריצה מודרניים קצה, צריכות use [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) במקום זאת.

</Note>

---

## הפניה {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

התקשר ל-`renderToPipeableStream` כדי להפוך את עץ ה-React שלך כ-HTML לזרם [Node.js.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

בלקוח, התקשר ל-[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) כדי להפוך את ה-HTML שנוצר על ידי השרת לאינטראקטיבי.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `reactNode`: צומת React שברצונך להציג ל-HTML. לדוגמה, אלמנט JSX כמו `<App />`. הוא צפוי לייצג את המסמך כולו, ולכן הרכיב `App` צריך לעבד את התג `<html>`.

* **אופציונלי** `options`: אובייקט עם אפשרויות סטרימינג.
  * **אופציונלי** `bootstrapScriptContent`: אם צוין, מחרוזת זו תמוקם בתג `<script>` מוטבע.
  * **אופציונלי** `bootstrapScripts`: מערך של כתובות אתרים של מחרוזות לתגיות `<script>` לפליטה בדף. השתמש בזה כדי לכלול את `<script>` שקורא ל-[`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) השמט אותו אם אינך רוצה להפעיל את React על הלקוח בכלל.
  * **אופציונלי** `bootstrapModules`: כמו `bootstrapScripts`, אבל פולט [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) במקום זאת.
  * **אופציונלי** `identifierPrefix`: קידומת מחרוזת React uses עבור מזהים שנוצרו על ידי [`useId`.](/reference/react/useId) שימושי כדי למנוע התנגשויות בעת שימוש במספר שורשים באותו עמוד. חייבת להיות אותה קידומת כמו שהועברה ל-[`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **אופציונלי** `namespaceURI`: מחרוזת עם השורש [שם URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) עבור הזרם. ברירת המחדל היא HTML רגילה. עוברים `'http://www.w3.org/2000/svg'` עבור SVG או `'http://www.w3.org/1998/Math/MathML'` עבור MathML.
  * **אופציונלי** `nonce`: מחרוזת [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) כדי לאפשר סקריפטים עבור [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **אופציונלי** `onAllReady`: התקשרות חוזרת המופעלת כאשר כל העיבוד הושלם, כולל הן את [המעטפת](#specificing-what-goes-into-the-shell) והן את כל ה-[content] הנוסף.(#streaming-more-content-as-it-loads) אתה יכול useK this place of [useK this] generation.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) אם תתחיל להזרים כאן, לא תקבל שום טעינה מתקדמת. הזרם יכיל את ה-HTML הסופי.
  * **אופציונלי** `onError`: התקשרות חוזרת המופעלת בכל פעם שיש שגיאת שרת, בין אם [ניתנת לשחזור](#מתאושש-from-errors-outside-the-shell) או [לא.](#recovering-from-errors-inside-the-shell) כברירת מחדל, זה קורא רק __22__.K אם תעקוף אותו ל[יומן דוחות קריסה,](#logging-crashes-on-the-server) ודא שאתה עדיין קורא ל-`console.error`. אתה יכול גם use את זה כדי [להתאים את קוד המצב](#setting-the-status-code) לפני פליטת המעטפת.
  * **אופציונלי** `onShellReady`: התקשרות חוזרת המופעלת מיד לאחר עיבוד [המעטפת הראשונית](#specificing-what-goes-into-the-shell). אתה יכול [להגדיר את קוד הסטטוס](#setting-the-status-code) ולהתקשר ל-`pipe` כאן כדי להתחיל בסטרימינג. React [תזרים את התוכן הנוסף](#streaming-more-content-as-it-loads) אחרי המעטפת יחד עם תגיות ה-`<script>` המוטבעות שמחליפות את נפילות הטעינה של HTML בתוכן.
  * **אופציונלי** `onShellError`: התקשרות חוזרת המופעלת אם הייתה שגיאה בעיבוד המעטפת הראשונית.  הוא מקבל את השגיאה כארגומנט. עדיין לא נפלטו בתים מהזרם, ולא `onShellReady` וגם `onAllReady` לא ייקראו, אז אתה יכול [להוציא מעטפת HTML fallback.](#מתאושש-from-errors-inside-the-shell)
  * **אופציונלי** `progressiveChunkSize`: מספר הבתים בנתח. [קרא עוד על היוריסטית ברירת המחדל.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### מחזירה {/*returns*/}

`renderToPipeableStream` מחזיר אובייקט בשתי שיטות:

* `pipe` מוציא את ה-HTML לזרם [ניתן לכתיבה Node.js.](https://nodejs.org/api/stream.html#writable-streams) התקשר ל-`pipe` ב-`onShellReady` אם ברצונכם לאפשר סטרימינג, או ב-`onAllReady` עבור סורקים ויצירה סטטית.
* `abort` מאפשר לך [להפסיק את עיבוד השרת](#aborting-server-rendering) ולעבד את השאר בלקוח.

---

## שימוש {/*usage*/}

### עיבוד עץ React כ-HTML לזרם Node.js {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

התקשר ל-`renderToPipeableStream` כדי להפוך את עץ ה-React שלך כ-HTML לזרם [Node.js:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

יחד עם <CodeStep step={1}>רכיב השורש</CodeStep>, עליך לספק רשימה של <CodeStep step={2}>נתיבי bootstrap `<script>`</CodeStep>. רכיב השורש שלך צריך להחזיר את **המסמך כולו כולל תג השורש `<html>`.**

לדוגמה, זה עשוי להיראות כך:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React יזריק את [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) ואת <CodeStep step={2}>תגי bootstrap `<script>`</CodeStep> שלך לזרם HTML שיתקבל:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

בלקוח, סקריפט האתחול שלך צריך [לייבש את כל `document` עם קריאה ל-`hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

פעולה זו תצרף מאזיני אירועים ל-HTML שנוצר על ידי השרת ויהפוך אותו לאינטראקטיבי.

<DeepDive>

#### קריאת נתיבי נכסי CSS ו-JS מפלט ה-build {/*reading-css-and-js-asset-paths-from-the-build-output*/}

כתובות ה-URL הסופיות של הנכסים (כמו קבצי JavaScript וCSS) עוברות גיבוב לעתים קרובות לאחר הבנייה. לדוגמה, במקום `styles.css` אתה עלול לקבל `styles.123456.css`. גיבוב של שמות קבצים סטטיים של נכסים מבטיח שלכל מבנה נפרד של אותו נכס יהיה שם קובץ שונה. זהו useמלא כי use הוא מאפשר לך לאפשר בבטחה שמירת מטמון לטווח ארוך עבור נכסים סטטיים: קובץ עם שם מסוים לעולם לא ישנה תוכן.

עם זאת, אם אינך מכיר את כתובות ה-URL של הנכסים עד לאחר הבנייה, אין לך דרך להכניס אותם לקוד המקור. לדוגמה, קידוד קשיח של `"/styles.css"` ל-JSX כמו קודם לא יעבוד. כדי להרחיק אותם מקוד המקור שלך, רכיב השורש שלך יכול לקרוא את שמות הקבצים האמיתיים ממפה שהועברה כאביזר:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

בשרת, עבד את `<App assetMap={assetMap} />` והעביר את ה-`assetMap` שלך עם כתובות ה-URL של הנכס:

```js {1-5,8,9}
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

מכיוון שהשרת שלך מעבד כעת `<App assetMap={assetMap} />`, עליך לרנדר אותו עם `assetMap` גם בלקוח כדי למנוע שגיאות הידרציה. אתה יכול לעשות סדרה ולהעביר את `assetMap` ללקוח כך:

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

בדוגמה שלמעלה, האפשרות `bootstrapScriptContent` מוסיפה תג `<script>` מוטבע נוסף שקובע את המשתנה הגלובלי `window.assetMap` בלקוח. זה מאפשר לקוד הלקוח לקרוא את אותו `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

גם הלקוח וגם השרת מעבדים את `App` עם אותו אבזר `assetMap`, כך שאין שגיאות הידרציה.

</DeepDive>

---

### הזרמת תוכן נוסף תוך כדי טעינתו {/*streaming-more-content-as-it-loads*/}

סטרימינג מאפשר ל-user להתחיל לראות את התוכן עוד לפני שכל הנתונים נטענו על השרת. לדוגמה, שקול דף פרופיל המציג שער, סרגל צד עם חברים ותמונות ורשימת פוסטים:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

תאר לעצמך שטעינת נתונים עבור `<Posts />` לוקחת קצת זמן. באופן אידיאלי, תרצה להציג את שאר תוכן דף הפרופיל ל-user מבלי לחכות לפוסטים. לשם כך, [עטפו את `Posts` בגבול `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

זה אומר לReact להתחיל להזרים את ה-HTML לפני ש`Posts` יטען את הנתונים שלו. React ישלח תחילה את ה-HTML עבור החזרת הטעינה (`PostsGlimmer`), ולאחר מכן, כאשר `Posts` יסיים לטעון את הנתונים שלו, React ישלח את ה-HTML הנותר יחד עם תג `<script>` מוטבע שמחליף את ה-fallback הטעינה ב-__TK_12 הזה. מנקודת המבט של ה-user, הדף יופיע תחילה עם ה-`PostsGlimmer`, מאוחר יותר מוחלף ב-`Posts`.

אתה יכול להמשיך [לקנן `<Suspense>` גבולות](/reference/react/Suspense#revealing-nested-content-as-it-loads) כדי ליצור רצף טעינה מפורט יותר:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

בדוגמה זו, React יכול להתחיל להזרים את הדף אפילו מוקדם יותר. רק `ProfileLayout` ו`ProfileCover` חייבים לסיים את הרינדור תחילה כיuse הם אינם עטופים בשום גבול `<Suspense>`. עם זאת, אם `Sidebar`, `Friends`, או `Photos` צריכים לטעון נתונים מסוימים, React ישלח את ה-HTML עבור `BigSpinner` החזרה במקום זאת. לאחר מכן, ככל שיהיו יותר נתונים זמינים, תוכן נוסף ימשיך להיחשף עד שכולו יהיה גלוי.

סטרימינג לא צריך לחכות לטעינת React עצמה בדפדפן, או שהאפליקציה שלך תהפוך לאינטראקטיבית. תוכן HTML מהשרת ייחשף בהדרגה לפני טעינת כל אחד מהתגים `<script>`.

[קרא עוד על אופן הפעולה של סטרימינג HTML.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**רק מקורות נתונים התומכים ב-Suspense יפעילו את רכיב Suspense.** הם כוללים:

- אחזור נתונים עם מסגרות התומכות ב-Suspense כמו [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) ו-[Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- קוד רכיב בטעינה עצלנית עם [`lazy`](/reference/react/lazy)
- קריאת הערך של הבטחה עם [`use`](/reference/react/use)

Suspense **לא** מזהה כאשר נתונים מובאים בתוך אפקט או מטפל באירועים.

הדרך המדויקת שתטען נתונים ברכיב `Posts` לעיל תלויה במסגרת שלך. אם אתה use מסגרת התומכת ב-Suspense, תמצא את הפרטים בתיעוד איסוף הנתונים שלה.

עדיין אין תמיכה באחזור נתונים עם Suspense ללא use של מסגרת דעתנית. הדרישות להטמעת מקור נתונים התומך ב-Suspense אינן יציבות ואינן מתועדות. API רשמי לשילוב מקורות נתונים עם Suspense ישוחרר בגרסה עתידית של React.

</Note>

---

### ציון מה נכנס למעטפת {/*specifying-what-goes-into-the-shell*/}

החלק של האפליקציה שלך מחוץ לכל גבולות `<Suspense>` נקרא *המעטפת:*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

זה קובע את הטעינה המוקדמת ביותר של state שה-user עשוי לראות:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

אם תעטפו את האפליקציה כולה לתוך גבול `<Suspense>` בשורש, המעטפת תכיל רק את הספינר הזה. עם זאת, זו לא חווית user נעימה מכיוון שuse לראות ספינר גדול על המסך יכול להרגיש איטי יותר ומעצבן יותר מאשר לחכות עוד קצת ולראות את הפריסה האמיתית. זו הסיבה שבדרך כלל תרצה למקם את גבולות `<Suspense>` כך שהמעטפת תרגיש *מינימלית אך שלמה* - כמו שלד של פריסת העמוד כולה.

ההתקשרות חזרה `onShellReady` מופעלת כאשר כל המעטפת טופלה. בדרך כלל תתחיל להזרים אז:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

עד שה-`onShellReady` יופעל, ייתכן שרכיבים בגבולות `<Suspense>` מקוננים עדיין טוענים נתונים.

---

### הרישום קורס בשרת {/*logging-crashes-on-the-server*/}

כברירת מחדל, כל השגיאות בשרת נרשמות למסוף. אתה יכול לעקוף התנהגות זו כדי לרשום דוחות קריסה:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

אם אתה מספק יישום `onError` מותאם אישית, אל תשכח גם לרשום שגיאות למסוף כמו לעיל.

---

### שחזור משגיאות בתוך המעטפת {/*recovering-from-errors-inside-the-shell*/}

בדוגמה זו, המעטפת מכילה `ProfileLayout`, `ProfileCover` ו-`PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

אם מתרחשת שגיאה בזמן רינדור הרכיבים האלה, ל-React לא יהיה שום HTML משמעותי לשלוח ללקוח. עוקף את `onShellError` כדי לשלוח מיתוס HTML שאינו מסתמך על עיבוד שרת כמוצא אחרון:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

אם יש שגיאה במהלך יצירת המעטפת, גם `onError` וגם `onShellError` יופעלו. השתמש ב-`onError` לדיווח על שגיאות וב-use `onShellError` כדי לשלוח את המסמך HTML החלופי. HTML לא חייב להיות דף שגיאה. במקום זאת, תוכל לכלול מעטפת חלופית שמציגה את האפליקציה שלך בלקוח בלבד.

---

### שחזור משגיאות מחוץ למעטפת {/*recovering-from-errors-outside-the-shell*/}

בדוגמה זו, הרכיב `<Posts />` עטוף ב-`<Suspense>` כך שהוא *לא* חלק מהקליפה:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

אם מתרחשת שגיאה ברכיב `Posts` או במקום כלשהו בתוכו, React [ינסה להתאושש ממנו:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. הוא יפלוט את החזרת הטעינה עבור גבול `<Suspense>` הקרוב ביותר (`PostsGlimmer`) לתוך HTML.
2. זה "יוותר" על הניסיון לרנדר את התוכן `Posts` בשרת יותר.
3. כאשר הקוד JavaScript נטען על הלקוח, React *תנסה* לעבד את `Posts` בלקוח.

אם ניסיון חוזר לעיבוד `Posts` בלקוח *גם* נכשל, React יזרוק את השגיאה על הלקוח. כמו בכל השגיאות שנזרקו במהלך העיבוד, [גבול שגיאת האב הקרובה ביותר](/reference/react/Component#static-getderivedstatefromerror) קובע כיצד להציג את השגיאה ל-user. בפועל, זה אומר שה-user יראה מחוון טעינה עד שיהיה בטוח שלא ניתן לשחזר את השגיאה.

אם ניסיון חוזר לעיבוד `Posts` בלקוח יצליח, הטעינה הנפילה מהשרת תוחלף בפלט העיבוד של הלקוח. ה-user לא יידע שהייתה שגיאת שרת. עם זאת, ההתקשרות חזרה של השרת `onError` והלקוח [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) יופעלו כדי שתוכל לקבל הודעה על השגיאה.

---

### הגדרת קוד המצב {/*setting-the-status-code*/}

סטרימינג מציג פשרה. אתה רוצה להתחיל להזרים את הדף מוקדם ככל האפשר כדי שה-user יוכל לראות את התוכן מוקדם יותר. עם זאת, ברגע שתתחיל להזרים, לא תוכל עוד להגדיר את קוד סטטוס התגובה.

על ידי [חלוקת האפליקציה שלך](#specificing-what-goes-into-the-shell) לתוך המעטפת (מעל כל גבולות `<Suspense>`) ושאר התוכן, כבר פתרת חלק מהבעיה הזו. אם המעטפת שגיאה, תקבל את ההתקשרות חזרה `onShellError` המאפשרת לך להגדיר את קוד מצב השגיאה. אחרת, אתה יודע שהאפליקציה עשויה להתאושש בלקוח, כך שתוכל לשלוח "אישור".

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

אם רכיב *מחוץ* למעטפת (כלומר בתוך גבול `<Suspense>`) זורק שגיאה, React לא יפסיק לעבד. המשמעות היא שההתקשרות חוזרת `onError` תפעל, אבל עדיין תקבל `onShellReady` במקום `onShellError`. הסיבה לכך היאuse React ינסה להתאושש מהשגיאה הזו בלקוח, [כמתואר לעיל.](#מתאושש-from-errors-outside-the-shell)

עם זאת, אם תרצה, תוכל use את העובדה שמשהו השתבש כדי להגדיר את קוד המצב:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

זה יתפוס רק שגיאות מחוץ למעטפת שקרו בזמן יצירת תוכן המעטפת הראשוני, כך שזה לא ממצה. אם לדעת אם אירעה שגיאה עבור תוכן מסוים היא קריטית, אתה יכול להעביר אותה למעלה לתוך המעטפת.

---

### טיפול בשגיאות שונות בדרכים שונות {/*handling-different-errors-in-different-ways*/}

אתה יכול [ליצור תת-מחלקות `Error` משלך](https://javascript.info/custom-errors) ו-use האופרטור [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) כדי לבדוק איזו שגיאה נגררת. לדוגמה, אתה יכול להגדיר `NotFoundError` מותאם אישית ולזרוק אותו מהרכיב שלך. ואז __TK_3_4__, __K שלך יכולים להתקשר בחזרה, `onError`, __K שונים על סוג השגיאה:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

זכור שברגע שאתה פולט את המעטפת ומתחיל להזרים, לא תוכל לשנות את קוד הסטטוס.

---

### ממתין עד שכל התוכן ייטען עבור סורקים ויצירת סטטי {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

סטרימינג מציע חוויית user טובה יותר מכיוון שuse ה-user יכול לראות את התוכן כשהוא הופך זמין.

עם זאת, כאשר סורק מבקר בדף שלך, או אם אתה יוצר את הדפים בזמן הבנייה, ייתכן שתרצה לתת לכל התוכן להיטען תחילה ולאחר מכן להפיק את הפלט הסופי HTML במקום לחשוף אותו בהדרגה.

אתה יכול להמתין עד שכל התוכן ייטען באמצעות ההתקשרות חזרה `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

מבקר קבוע יקבל זרם של תוכן שנטען בהדרגה. סורק יקבל את הפלט הסופי HTML לאחר כל טעינת הנתונים. עם זאת, זה גם אומר שהסורק יצטרך להמתין ל*כל* הנתונים, שחלקם עשוי להיות איטי בטעינה או שגיאה. בהתאם לאפליקציה שלך, תוכל לבחור לשלוח את המעטפת גם לסורקים.

---

### ביטול עיבוד השרת {/*aborting-server-rendering*/}

אתה יכול לאלץ את העיבוד של השרת "לוותר" לאחר פסק זמן:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React ישחק את שאר הטעינה הנפילות כ-HTML, וינסה לעבד את השאר בלקוח.
