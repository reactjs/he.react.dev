---
id: context
title: קונטקסט
permalink: docs/context.html
---

קונטקסט מספק דרך להעביר מידע דרך עץ הקומפוננטות בלי להשתמש בprops באופן ידני לכל קומפוננטה.

באפליקציית React טיפוסית, המידע מועבר למטה (מקומפוננטת אב לקומפוננטת ילד) דרך props, אבל עבור מידע שנדרש בהרבה קומפוננטות באפליקציה (כמו לדוגמא העדפות שפה או ערכת נושא של ממשק המשתמש) השימוש ב-props יכול להיות מסורבל. קונטקסט מספק דרך לשתף מידע כזה בין קומפוננטות בלי להעביר אותו באופן מפורש לכל קומפוננטה.

- [מתי להשתמש בקונטקסט](#when-to-use-context)
- [לפני השימוש בקונטקסט](#before-you-use-context)
- [ממשק תכנות](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
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

אין הגבלה של ילד יחיד לכל קומפוננטה. אפשר להעביר מספר ילדים, ואפילו מספר ״משבצות״ ("slots") לילדים, [כמתועד כאן](/docs/composition-vs-inheritance.html#containment):


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

Creates a Context object. When React renders a component that subscribes to this Context object it will read the current context value from the closest matching `Provider` above it in the tree.

The `defaultValue` argument is **only** used when a component does not have a matching Provider above it in the tree. This can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* some value */}>
```

Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.

Accepts a `value` prop to be passed to consuming components that are descendants of this Provider. One Provider can be connected to many consumers. Providers can be nested to override values deeper within the tree.

All consumers that are descendants of a Provider will re-render whenever the Provider's `value` prop changes. The propagation from Provider to its descendant consumers is not subject to the `shouldComponentUpdate` method, so the consumer is updated even when an ancestor component bails out of the update.

Changes are determined by comparing the new and old values using the same algorithm as [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description). 

> Note
> 
> The way changes are determined can cause some issues when passing objects as `value`: see [Caveats](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
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
    /* render something based on the value of MyContext */
  }
}
MyClass.contextType = MyContext;
```

The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](#reactcreatecontext). This lets you consume the nearest current value of that Context type using `this.context`. You can reference this in any of the lifecycle methods including the render function.

> Note:
>
> You can only subscribe to a single context using this API. If you need to read more than one see [Consuming Multiple Contexts](#consuming-multiple-contexts).
>
> If you are using the experimental [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/), you can use a **static** class field to initialize your `contextType`.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* render something based on the value */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

A React component that subscribes to context changes. This lets you subscribe to a context within a [function component](/docs/components-and-props.html#function-and-class-components).

Requires a [function as a child](/docs/render-props.html#using-props-other-than-render). The function receives the current context value and returns a React node. The `value` argument passed to the function will be equal to the `value` prop of the closest Provider for this context above in the tree. If there is no Provider for this context above, the `value` argument will be equal to the `defaultValue` that was passed to `createContext()`.

> הערה
> 
> For more information about the 'function as a child' pattern, see [render props](/docs/render-props.html).

## דוגמאות {#examples}

### קונטקסט דינאמי {#dynamic-context}

A more complex example with dynamic values for the theme:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### עדכון הקונטקסט מתוך קומפוננטה מקוננת {#updating-context-from-a-nested-component}

It is often necessary to update the context from a component that is nested somewhere deeply in the component tree. In this case you can pass a function down through the context to allow consumers to update the context:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### שימוש ביותר מקונטקסט אחד {#consuming-multiple-contexts}

To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree. 

`embed:context/multiple-contexts.js`

If two or more context values are often used together, you might want to consider creating your own render prop component that provides both.

## הסתיגויות {#caveats}

Because context uses reference identity to determine when to re-render, there are some gotchas that could trigger unintentional renders in consumers when a provider's parent re-renders. For example, the code below will re-render all consumers every time the Provider re-renders because a new object is always created for `value`:

`embed:context/reference-caveats-problem.js`


To get around this, lift the value into the parent's state:

`embed:context/reference-caveats-solution.js`

## ממשק תכנות מדור קודם {#legacy-api}

> הערה
> 
> React previously shipped with an experimental context API. The old API will be supported in all 16.x releases, but applications using it should migrate to the new version. The legacy API will be removed in a future major React version. Read the [legacy context docs here](/docs/legacy-context.html).
 
