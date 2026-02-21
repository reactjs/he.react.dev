---
title: "מטמון"
canary: true
---

<Canary>
* `cache` מיועד רק עבור use עם [React רכיבי שרת](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components). ראה [frameworks](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) התומכים ב-React רכיבי שרת.

* `cache` זמין רק בערוצים [Canary](/community/versioning-policy#canary-channel) ו-[ניסיוני](/community/versioning-policy#experimental-channel) של React. אנא ודא שאתה מבין את המגבלות לפני השימוש ב-`cache` בייצור. למידע נוסף על ערוצי ההפצה של [React כאן](/community/versioning-policy#all-release-channels).
</Canary>

<Intro>

`cache` מאפשר לך לשמור במטמון את התוצאה של אחזור נתונים או חישוב.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `cache(fn)` {/*cache*/}

התקשר ל-`cache` מחוץ לרכיבים כלשהם כדי ליצור גרסה של הפונקציה עם שמירה במטמון.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

כאשר `getMetrics` נקרא לראשונה עם `data`, `getMetrics` יקרא ל-`calculateMetrics(data)` ויאחסן את התוצאה במטמון. אם `getMetrics` נקרא שוב עם אותו `data`, הוא יחזיר את התוצאה המאוחסנת במטמון במקום לקרוא שוב ל`calculateMetrics(data)`.

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

- `fn`: הפונקציה שעבורה ברצונך לשמור תוצאות במטמון. `fn` יכול לקחת כל ארגומנט ולהחזיר כל ערך.

#### מחזירה {/*returns*/}

`cache` מחזירה גרסה שמור של `fn` עם חתימת סוג זהה. זה לא קורא ל-`fn` בתהליך.

כאשר קוראים ל-`cachedFn` עם ארגומנטים נתונים, הוא בודק תחילה אם קיימת תוצאה במטמון במטמון. אם קיימת תוצאה במטמון, היא מחזירה את התוצאה. אם לא, הוא קורא ל-`fn` עם הארגומנטים, מאחסן את התוצאה במטמון ומחזיר את התוצאה. הפעם היחידה שנקראת `fn` היא כשיש פספוס מטמון.

<Note>

האופטימיזציה של ערכי החזרת מטמון המבוססים על קלט ידועה בשם [memoization_](https://en.wikipedia.org/wiki/Memoization). אנו מתייחסים לפונקציה המוחזרת מ`cache` כפונקציה memoized.

</Note>

#### אזהרות {/*caveats*/}

[//]: # 'מטלות: הוסף קישורים להפניה לרכיב שרת/לקוח לאחר מיזוג https://github.com/reactjs/react.dev/pull/6177'

- React יבטל את תוקף המטמון עבור כל הפונקציות memoized עבור כל בקשת שרת. 
- כל קריאה ל-`cache` יוצרת פונקציה חדשה. המשמעות היא שקריאה ל-`cache` עם אותה פונקציה מספר פעמים תחזיר פונקציות שונות memoized שאינן חולקות את אותו מטמון.
- `cachedFn` ישמור גם שגיאות במטמון. אם `fn` זורק שגיאה עבור ארגומנטים מסוימים, היא תישמר במטמון, ואותה שגיאה נזרקת מחדש כאשר `cachedFn` נקרא עם אותם ארגומנטים.
- `cache` מיועד ל-use ב-[רכיבי שרת](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) בלבד.

---

## שימוש {/*usage*/}

### שמור חישוב יקר {/*cache-expensive-computation*/}

השתמש ב-`cache` כדי לדלג על עבודה כפולה.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

אם אותו אובייקט `user` מוצג גם ב-`Profile` וגם ב-`TeamReport`, שני הרכיבים יכולים לשתף עבודה ולהתקשר ל-`calculateUserMetrics` רק פעם אחת עבור אותו `user`.

נניח ש-`Profile` מוצג ראשון. זה יקרא ל<CodeStep step={1}>`getUserMetrics`</CodeStep>, ויבדוק אם יש תוצאה במטמון. מכיוון שזו הפעם הראשונה ש`getUserMetrics` נקרא עם ה-`user` הזה, תהיה פספוס מטמון. לאחר מכן `getUserMetrics` יקרא ל-`calculateUserMetrics` עם ה-`user` הזה ויכתוב את התוצאה למטמון.

כאשר `TeamReport` מעבד את רשימת ה-`users` שלו ומגיע לאותו אובייקט `user`, הוא יקרא ל<CodeStep step={2}>`getUserMetrics`</CodeStep> ויקרא את התוצאה מהמטמון.

<Pitfall>

##### קריאה לפונקציות שונות memoized תקרא ממטמונים שונים. {/*pitfall-different-memoized-functions*/}

כדי לגשת לאותו מטמון, רכיבים חייבים לקרוא לאותה פונקציה memoized.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Wrong: Calling `cache` in component creates new `getWeekReport` for each render
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Wrong: `getWeekReport` is only accessible for `Precipitation` component.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

בדוגמה שלמעלה, <CodeStep step={2}>`Precipitation`</CodeStep> ו-<CodeStep step={1}>`Temperature`</CodeStep> קוראים לכל `cache` כדי ליצור פונקציה חדשה memo עם חיפוש מטמון משלהם. אם שני הרכיבים יעבדו עבור אותו `cityData`, הם יבצעו עבודה כפולה כדי לקרוא ל-`calculateWeekReport`.

בנוסף, `Temperature` יוצר <CodeStep step={1}>פונקציה חדשה memoized</CodeStep> בכל פעם שהרכיב מעובד, מה שלא מאפשר שיתוף מטמון כלשהו.

כדי למקסם את כניסות המטמון ולהפחית את העבודה, שני הרכיבים צריכים לקרוא לאותה פונקציה memoized כדי לגשת לאותו מטמון. במקום זאת, הגדר את הפונקציה memoized במודול ייעודי שיכול להיות [`import`-ed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) על פני רכיבים.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
כאן, שני הרכיבים קוראים ל-<CodeStep step={3}>אותה פונקציה memoized</CodeStep> המיוצאת מ-`./getWeekReport.js` כדי לקרוא ולכתוב לאותו מטמון.
</Pitfall>

### שתף תמונת מצב של נתונים {/*take-and-share-snapshot-of-data*/}

כדי לשתף תמונת מצב של נתונים בין רכיבים, התקשר ל-`cache` עם פונקציית שליפת נתונים כמו `fetch`. כאשר מספר רכיבים מבצעים את אותו אחזור נתונים, רק בקשה אחת מתבצעת והנתונים המוחזרים נשמרים במטמון ומשותפים בין רכיבים. כל הרכיבים מתייחסים לאותה תמונת מצב של נתונים על פני עיבוד השרת.

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

אם `AnimatedWeatherCard` ו-`MinimalWeatherCard` שניהם יעבדו עבור אותה <CodeStep step={1}>עיר</CodeStep>, הם יקבלו את אותה תמונת מצב של נתונים מהפונקציה <CodeStep step={2}>memoized</CodeStep>.

אם `AnimatedWeatherCard` ו-`MinimalWeatherCard` מספקים ארגומנטים שונים של <CodeStep step={1}>city</CodeStep> ל-<CodeStep step={2}>`getTemperature`</CodeStep>, אזי `fetchTemperature` ייקרא פעמיים וכל אתר שיחה יקבל נתונים שונים.

<CodeStep step={1}>city</CodeStep> פועל כמפתח מטמון.

<Note>

[//]: # 'מטלות: הוסף קישורים לרכיבי שרת בעת מיזוג.'

<CodeStep step={3}>Asynchronous rendering</CodeStep> is only supported for Server Components.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'מטלות: הוסף קישור ואזכור לתיעוד use בעת מיזוג'
[//]: # 'לעיבוד רכיבים שuse נתונים אסינכרוניים ברכיבי לקוח, עיין בתיעוד `use`.'

</Note>

### טען מראש נתונים {/*preload-data*/}

על ידי שמירה במטמון של אחזור נתונים ארוך טווח, אתה יכול להתחיל בעבודה אסינכרונית לפני רינדור הרכיב.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
}

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Good: start fetching the user data
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

בעת רינדור `Page`, הרכיב קורא ל<CodeStep step={1}>`getUser`</CodeStep> אך שים לב שהוא לא use הנתונים המוחזרים. קריאת <CodeStep step={1}>`getUser`</CodeStep> המוקדמת הזו מתחילה את שאילתת מסד הנתונים האסינכרונית שמתרחשת בזמן ש`Page` עושה עבודה חישובית אחרת ומציגה ילדים.

בעת עיבוד `Profile`, אנו קוראים שוב <CodeStep step={2}>`getUser`</CodeStep>. אם הקריאה הראשונית <CodeStep step={1}>`getUser`</CodeStep> כבר חזרה ושומרה את נתוני user, כאשר `Profile` <CodeStep step={2}>שואל ומחכה לנתונים אלו</CodeStep>, הוא יכול פשוט לקרוא מהמטמון מבלי להידרש לקריאת הליך מרחוק נוסף. אם <CodeStep step={1}> בקשת הנתונים הראשונית</CodeStep> לא הושלמה, טעינת נתונים מראש בדפוס זה מפחיתה את העיכוב באחזור הנתונים.

<DeepDive>

#### עבודה אסינכרונית במטמון {/*caching-asynchronous-work*/}

בעת הערכת [פונקציה אסינכרונית](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), תקבלו [הבטחה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) עבור אותה עבודה. ההבטחה מחזיקה ב-state של אותה עבודה (_בהמתנה_, _מומש_, _נכשל_) והתוצאה הסופית שלה.

בדוגמה זו, הפונקציה האסינכרונית <CodeStep step={1}>`fetchData`</CodeStep> מחזירה הבטחה שמחכה ל-`fetch`.

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... some computational work  
  await getData();
  // ...
}
```

בקריאה ל-<CodeStep step={2}>`getData`</CodeStep> בפעם הראשונה, ההבטחה שהוחזרה מ-<CodeStep step={1}>`fetchData`</CodeStep> נשמרת במטמון. חיפושים הבאים יחזירו את אותה הבטחה.

שימו לב שהקריאה הראשונה ל-<CodeStep step={2}>`getData`</CodeStep> אינה כוללת `await`, ואילו <CodeStep step={3}>השנייה</CodeStep> כן. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) ממתין לפתרון ההבטחה ומחזיר את הערך שלה. הקריאה הראשונה ל-<CodeStep step={2}>`getData`</CodeStep> מתחילה את `fetch` כדי לשמור את ההבטחה עבור הקריאה השנייה.

אם בזמן <CodeStep step={3}>הקריאה השנייה</CodeStep> ההבטחה עדיין _בהמתנה_, אז `await` ימתין לתוצאה. האופטימיזציה היא שבזמן ההמתנה ל-`fetch`, React יכול להמשיך בעבודה חישובית, וכך לקצר את זמן ההמתנה של הקריאה השנייה.

אם ההבטחה כבר יושבה (או לשגיאה או לתוצאה _ממומשת_), `await` יחזיר את הערך מיד. בשני המצבים מתקבל שיפור ביצועים.
</DeepDive>

<Pitfall>

##### קריאה לפונקציה memoized מחוץ לרכיב לא use המטמון. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React מספק רק גישה למטמון לפונקציה memoized ברכיב. בעת קריאה ל-<CodeStep step={1}>`getUser`</CodeStep> מחוץ לרכיב, הוא עדיין יעריך את הפונקציה אך לא יקרא או יעדכן את המטמון.

זוהי כיוון שגישה למטמון ניתנת דרך [הקשר](/learn/העברת-data-deeply-with-context) אשר נגיש רק מרכיב.

</Pitfall>

<DeepDive>

#### מתי עלי use `cache`, [`memo`](/reference/react/memo), או [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

כל ה-APIs המוזכרים מציעים memoization אבל ההבדל הוא מה הם נועדו לmemoize, מי יכול לגשת למטמון, וכאשר המטמון שלהם אינו חוקי.

#### `useMemo` {/*deep-dive-use-memo*/}

באופן כללי, אתה צריך use [`useMemo`](/reference/react/useMemo) עבור שמירה במטמון של חישוב יקר ברכיב לקוח על פני עיבודים. כדוגמה, כדי memoלבצע טרנספורמציה של נתונים בתוך רכיב.

```jsx {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record)), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
בדוגמה זו, `App` מעבד שני `WeatherReport`s עם אותה רשומה. למרות ששני הרכיבים עושים את אותה עבודה, הם לא יכולים לחלוק עבודה. המטמון של `useMemo` הוא מקומי רק לרכיב.

עם זאת, `useMemo` אכן מבטיח שאם `App` יעבד מחדש והאובייקט `record` לא ישתנה, כל מופע של רכיב ידלג על עבודה וuse הערך memoized של `avgTemp`. `useMemo` ישמור רק את החישוב האחרון של `avgTemp` עם התלות הנתונה.

#### `cache` {/*deep-dive-cache*/}

באופן כללי, עליך להזין use `cache` ברכיבי שרת כדי memoלעצב עבודה שניתן לשתף בין רכיבים.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
כתיבה מחדש של הדוגמה הקודמת ל-use `cache`, במקרה זה <CodeStep step={3}>המופע השני של `WeatherReport`</CodeStep> יוכל לדלג על עבודה כפולה ולקרוא מאותו מטמון כמו <CodeStep step={1}>המופע הראשון של `WeatherReport`</CodeStep>. הבדל נוסף מהדוגמה הקודמת הוא ש-`cache` מומלץ גם עבור <CodeStep step={2}>memoizing של שליפות נתונים</CodeStep>, בניגוד ל-`useMemo` שאמור להיות used רק עבור חישובים.

בשלב זה, `cache` צריך להיות רק used ברכיבי שרת והמטמון יבוטל בכל בקשות השרת.

#### `memo` {/*deep-dive-memo*/}

עליך use [`memo`](reference/react/memo) כדי למנוע עיבוד מחדש של רכיב אם ה-props שלו לא השתנה.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record); 
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

בדוגמה זו, שני הרכיבים `MemoWeatherReport` יקראו ל-`calculateAvg` כאשר הם יעבדו לראשונה. עם זאת, אם `App` מעבד מחדש, ללא שינויים ב-`record`, אף אחד מה-props לא השתנה ו-`MemoWeatherReport` לא יעבד מחדש.

בהשוואה ל-`useMemo`, `memo` memoמגדיל את עיבוד הרכיבים בהתבסס על props לעומת חישובים ספציפיים. בדומה ל-`useMemo`, הרכיב memoized מאחסן רק את העיבוד האחרון עם ערכי העזר האחרונים. ברגע שהשינוי props, המטמון מבטל והרכיב מעבד מחדש.

</DeepDive>

---

## פתרון בעיות {/*troubleshooting*/}

### הפונקציה memoized שלי עדיין פועלת למרות שקראתי לה עם אותם ארגומנטים {/*memoized-function-still-runs*/}

ראה מלכודות שהוזכרו קודם לכן
* [קריאה לפונקציות memoized שונות תקרא ממטמונים שונים.](#pitfall-different-memoized-functions)
* [קריאה לפונקציה memoized מחוץ לרכיב לא תגרום use למטמון.](#pitfall-memoized-call-outside-component)

אם אף אחד מהאמור לעיל אינו רלוונטי, ייתכן שזו בעיה עם האופן שבו React בודק אם משהו קיים במטמון.

אם הארגומנטים שלך אינם [פרימיטיביים](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (למשל אובייקטים, פונקציות, מערכים), ודא שאתה מעביר את אותה הפניה לאובייקט.

בעת קריאה לפונקציה memoized, React יחפש את ארגומנטי הקלט כדי לראות אם התוצאה כבר נמצאת במטמון. React יעשה use שוויון רדוד של הארגומנטים כדי לקבוע אם יש פגיעה במטמון.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Wrong: props is an object that changes every render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

במקרה זה שני `MapMarker`s נראים כאילו הם עושים את אותה עבודה וקוראים `calculateNorm` עם אותו ערך של `{x: 10, y: 10, z:10}`. למרות שהאובייקטים מכילים את אותם ערכים, הם אינם אותה הפניה לאובייקט מכיוון שכל רכיב יוצר אובייקט `props` משלו.

React יתקשר ל-[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) בקלט כדי לוודא אם יש פגיעה במטמון.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass primitives to memoized function
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

דרך אחת לטפל בזה יכולה להיות להעביר את הממדים הווקטוריים ל-`calculateNorm`. זה עובד מכיוון שuse הממדים עצמם הם פרימיטיביים.

פתרון נוסף עשוי להיות להעביר את האובייקט הווקטור עצמו כעזר לרכיב. נצטרך להעביר את אותו אובייקט לשני מופעי הרכיבים.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass the same `vector` object
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
