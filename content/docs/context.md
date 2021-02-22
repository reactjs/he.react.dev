---
id: context
title: קונטקסט
permalink: docs/context.html
---

קונטקסט מספק דרך להעביר מידע דרך עץ הקומפוננטות בלי להשתמש ב-props באופן ידני לכל קומפוננטה.

<<<<<<< HEAD
באפליקציית React טיפוסית, המידע מועבר למטה (מקומפוננטת אב לקומפוננטת ילד) דרך props, אבל עבור מידע שנדרש בהרבה קומפוננטות באפליקציה (כמו לדוגמא העדפות שפה או ערכת נושא של ממשק המשתמש) השימוש ב-props יכול להיות מסורבל. קונטקסט מספק דרך לשתף מידע כזה בין קומפוננטות בלי להעביר אותו באופן מפורש לכל קומפוננטה.
=======
In a typical React application, data is passed top-down (parent to child) via props, but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

- [מתי להשתמש בקונטקסט](#when-to-use-context)
- [לפני השימוש בקונטקסט](#before-you-use-context)
- [ממשק תכנות](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [דוגמאות](#examples)
  - [קונטקסט דינאמי](#dynamic-context)
  - [עדכון הקונטקסט מתוך קומפוננטה מקוננת](#updating-context-from-a-nested-component)
  - [שימוש ביותר מקונטקסט אחד](#consuming-multiple-contexts)
- [הסתיגויות](#caveats)
- [ממשק תכנות מדור קודם](#legacy-api)

## מתי להשתמש בקונטקסט {#when-to-use-context}

הקונטקסט נועה לשתף מידע שנחשב ״גלובאלי״ לכל הקומפוננטות בעץ, כמו מידע על המשתמש המאומת, ערכת הנושא או השפה המועדפת. בקוד הנ״ל אנחנו מעבירים את ה-prop של ״ערכת הנושא״ בשביל לעצב את קומפוננטת הכפתור:

`embed:context/motivation-problem.js`

בעזרת הקונטקסט, אפשר להמנע מלהעביר את ה-prop דרך רכיבי ביניים:

`embed:context/motivation-solution.js`

## לפני השימוש בקונטקסט {#before-you-use-context}

השימוש בקונטקסט נועד בעיקר למצב שבו חלק מהמידע צריך להיות נגיש ל*הרבה* קומפוננטות בעומקים שונים.
עדיף להשתמש בקונטקסט בחסכנות כי הוא יכול להקשות על שימוש חוזר בקומפוננטות.

**אם המטרה היחידה שלך בשימוש בקונטקסט היא להמנע מהעברת props להרבה קומפוננטות, [הכלת קומפוננטות](/docs/composition-vs-inheritance.html) היא בדרך כלל פתרון פשוט יותר.**

לדוגמא, קומפוננטת `Page` שמעבירה את ה-props `user` ו- `avatarSize` לכמה רמות עומק, כדי שקומפוננטות ילד כמו `Link` ו- `Avatar` יוכלו להשתמש בהם:

```js
<Page user={user} avatarSize={avatarSize} />
// ... שמרנדרת ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... שמרנדרת ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... שמרנדרת ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

יכול להיות שהעברת ה-props `user` ו- `avatarSize` דרך כל כך הרבה רמות עומק תרגיש מיותר, בעיקר כי בסוף רק קומפוננטת ה- `Avatar` באמת משתמשת בהם. זה גם מעצבן שכל פעם שקומפוננטת ה- `Avatar` צריכה עוד props, צריך להעביר אותם דרך כל רכיבי הביניים.

דרך אחת לפתור את הבעיה **ללא שימוש בקונטקסט** היא [להעביר את קומפוננטת ה-`Avatar` עצמה](/docs/composition-vs-inheritance.html#containment) כדי שקומפוננטות הביניים לא יצטרכו לדעת על ה-props `user` או `avatarSize`:


```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// :עכשיו, יש לנו
<Page user={user} avatarSize={avatarSize} />
// ... שמרנדרת ...
<PageLayout userLink={...} />
// ... שמרנדרת ...
<NavigationBar userLink={...} />
// ... שמרנדרת ...
{props.userLink}
```

עם השינוי הזה, רק הקומפוננטה העליונה `Page` צריכה לדעת על קומפוננטות ה- `Link` וה- `Avatar` ועל ה-props שהן דורשות.

תבנית העיצוב הזו נקראת *היפוך שליטה* והיא מאפשרת לכתוב קוד נקי יותר במקרים רבים, להפחית את מספר ה- props שצריך להעביר באפליקציה, ולהחזיר שליטה לקומפוננטה העליונה. עם זאת, היא לא תמיד הדרך הנכונה בכל מצב: העברת קוד מסובך למעלה בעץ הקומפוננטה יגרום לקומפוננטת השורש להיות יותר מסובכת ויכריח את קומפוננטות הילד להיות יותר מדי גמישות.

<<<<<<< HEAD
אין הגבלה של ילד יחיד לכל קומפוננטה. אפשר להעביר מספר ילדים, ואפילו מספר ״משבצות״ ("slots") לילדים, [כמתועד כאן](/docs/composition-vs-inheritance.html#containment):
=======
This *inversion of control* can make your code cleaner in many cases by reducing the amount of props you need to pass through your application and giving more control to the root components. Such inversion, however, isn't the right choice in every case; moving more complexity higher in the tree makes those higher-level components more complicated and forces the lower-level components to be more flexible than you may want.
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786


```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

תבנית העיצוב הזאת מספיקה במקרים רבים כשרוצים להפריד קומפוננטת ילד מקומפוננטת האב שלה. אפשר להרחיב את הפתרון עוד יותר עם [render props](/docs/render-props.html) במקרים שקומפוננטת הילד צריכה לתקשר עם קומפוננטת האב לפני הרינדור.

למרות זאת, לפעמים אותו המידע צריך להיות נגיש ע״י מספר קומפוננטות בערץ, ובעומקים שונים. במקרים כאלה, הקונטקסט מאפשר ״לשדר״ את המידע, ושינויים במידע, לכל הקומפוננטות בעץ. דוגמאות שכיחות שבן שימוש בקונטקסט פשוט יותר מהאלטרנטיבות הן כמתואר קודם - ערכות נושא, העדפות שפה או זכרון מטמון.

## ממשק תכנות {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

הקוד הזה יותר עצם קונטקסט. כש- React מרנדר את הקומפוננטות שמאזינות לקונטקסט, הוא קורא את ערך הקונטקסט מהספר הקרוב ביותר מעליו בעץ.

<<<<<<< HEAD
ערך ברירת המחדל נקרא **רק** כשאין ספק מעליו בעץ הקומפוננטות. זה יכול להיות שימושי בבדיקות אוטומטיות לקומפוננטה בבידוד - בלי צורך לעטוף אותן. הערה: העברת הערך `undefined` כערך לספק לא יגרום להחזרת ערך ברירת המחדל.
=======
The `defaultValue` argument is **only** used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* some value */}>
```

כל עצם קונטקסט מגיע עם קומפוננטת ספק (Provider) שנותנת לקומפוננטות שצורכות אותו להקשיב לשינויים בקונטקסט.
הספק מקבל prop `value` שיועבר לקומפוננטות ילד שצורכות את הספק בכל רמות העומק של העץ. ספק אחד יכול להתחבר לצרכנים רבים. אפשר להגדיר ספקים ברמות שונות של אותו העץ כדי לעקוף את הערכים המוגדרים בהם בעומקים שונים של עץ הקומפוננטות.

קומפוננטת הספק מקבלת prop `value` אשר יועבר לקומפוננטות הצורכות שהן צאצאים של ספק זה. ספק אחד יכול להיות מחובר להרבה צרכנים. ספקים יכולים להיות מקוננים כדי לדרוס ערכים עמוק יותר בתוך העץ.

שינויים נקבעים ע״י השוואת הערכים החדשים מול הישנים בעזרת אותו האלגוריתם כמו [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

> הערה
> 
> הדרך שבה שינויים נקבעים יכולה ליצור בעיות כשמעבירים עצמים כערכים: ראה [הסתיגויות](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* MyContext-בשימוש בערך ה mount-יגרום לתופעת לואי בזמן ה */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /*MyContext-ירנדר משהו שמבוסס על ערך ה */
  }
}
MyClass.contextType = MyContext;
```

<<<<<<< HEAD
מאפיין ה-`contextType` במחלקה מוקצה בעצם קונטקסט שנוצר על ידי המתודה [`React.createContext()`](#reactcreatecontext).זה נותן לנו לצרוך את ערך הקונטקסט הנוכחי הקרוב ביותר בעזרת `this.context`. אפשר להשתמש בהפניה זו בכל אחת ממתודות מחזור החיים כולל מתודת הרינדור.
=======
The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](#reactcreatecontext). Using this property lets you consume the nearest current value of that Context type using `this.context`. You can reference this in any of the lifecycle methods including the render function.
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

> הערה:
>
> אפשר לצרוך רק קונטקסט אחד בעזרת ממשק זה.
> על מנת לצרוך יותר מאחד, ראו [שימוש ביותר מקונטקסט אחד](#consuming-multiple-contexts).
>
> אם אתם משתמשים בסינטקסט הנסיוני של [מאפייני מחלקה ציבורית](https://babeljs.io/docs/plugins/transform-class-properties/), תוכלו להשתמש במאפיין מחלקה **סטטי** על מנת לאתחל את ה- `contextType`.

```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* רינדור משהו בהתאם לערך */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* רינדור משהו בהתאם לערך */}
</MyContext.Consumer>
```

<<<<<<< HEAD
קומפוננטת React שמקשיבה לשינויים בקונטקסט. מאפשרת לצרוך קונטקסט מתוך [קומפוננטת פונקציה](/docs/components-and-props.html#function-and-class-components).
=======
A React component that subscribes to context changes. Using this component lets you subscribe to a context within a [function component](/docs/components-and-props.html#function-and-class-components).
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

דורשת [פונקציה בתור ילד](/docs/render-props.html#using-props-other-than-render). הפונקציה הזאת מקבלת את ערך הקונטקסט הנוכחי ומחזירה צומת React. ערך הארגומנט שמועבר לפונקציה יהיה זהה ל- `value` prop של ספק הקונטקסט הקרוב ביותר מעלינו בעץ. אם אין ספק לקונטקס, הערך יהיה זהה לערך ברירת המחדל שנקבע בזמן יצירת הקונטקסט (עם `createContext()`).

> הערה
> 
> למידע נוסף על תבנית ״פונקציה כילד״ בקרו בעמוד [render props](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

אובייקט context מקבל מאפיין `displayName` מסוג מחרוזת. React DevTools משתמש במחרוזת זו על מנת לקבוע מה להציג ל-context.

לדוגמה, הקומפוננטה הבאה תופיע כ-MyDisplayName ב-DevTools:

```js{2}
const MyContext = React.createContext(/* ערך מסויים */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" ב-DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" ב-DevTools
```

## דוגמאות {#examples}

### קונטקסט דינאמי {#dynamic-context}

דוגמא מורכבת יותר עם ערך דינאמי של ערכת הנושא:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### עדכון הקונטקסט מתוך קומפוננטה מקוננת {#updating-context-from-a-nested-component}

לפעמים יש צורך לעדכן את הקונטקסט מתוך קומפוננטה שמוגדרת עמוק בתוך עץ הקומפוננטות. במקרה הזה, אפשר להעביר פונקציה דרך הקונטקסט כדי לתת לצרכניו לעדכן אותו:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### שימוש ביותר מקונטקסט אחד {#consuming-multiple-contexts}

כדי לודא שרינדור הקונטקסט מחדש יהיה מהיר, React צריך להפוך את כל אחד מצרכני הקונטקסט לצומת נפרדת בעץ.

`embed:context/multiple-contexts.js`

אם שני ערכי קונטקסט (או יותר) בדרך כלל משומשים ביחד, יכול להיות שתרצו לשקול יצירת קומפוננטת רינדור prop שתספק אותם ביחד.

## הסתיגויות {#caveats}

בגלל שקונטקסט משתמש בזיהוי הפניה כדי להחליט מתי לעורר רינדור מחדש, יש כל מיני מקרי קצה שיכולים לגרום לרינדור הצרכנים בטעות, כשקומפוננטת האב של הספק מרנדרת את עצמה מחדש. לדוגמא, הקוד הנ״ל ירדנר את כל הצרכנים בכל פעם שהספק מרנדר את עצמו מחדש, כיוון ש-`value` הוא עצם שנוצר מחדש כל פעם:

`embed:context/reference-caveats-problem.js`

כדי לעקוף את הבעיה הזאת, אפשר להעביר את הערך ל-state של האב:

`embed:context/reference-caveats-solution.js`

## ממשק תכנות מדור קודם {#legacy-api}

> הערה
> 
> בעבר, React הכילה ממשק תכנות נסיוני לקונטקסט. הממשק הישן ייתמך בכל גרסאות ה-16.x, אבל אפליקציות שמשתמשות בו צריכות לעבור לשימוש בגרסה החדשה. הממשק הישן יוסר בגרסה הראשית הבאה של React. עוד מידע על [ממשק הקונטקסט הישן](/docs/legacy-context.html).
