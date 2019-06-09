---
id: forwarding-refs
title: העברת רפרנסים
permalink: docs/forwarding-refs.html
---

העברת רפרנסים היא טכניקה להעברה אוטומטית של [רפרנס](/docs/refs-and-the-dom.html) דרך קומפוננטה לאחד מקומפוננטות הילד שלה. בדרך כלל, זאת טכניקה שלא נחוצה לרוב הקומפוננטות באפליקציה, אבל יכולה להיות שימושית במצבים מסוימים, בעיקר בספריות קומפוננטות רב פעמיות. התרחישים הנפוצים ביותר מתוארים פה.

## העברת רפרנסים לקומפוננטות ב-DOM {#forwarding-refs-to-dom-components}

נקח לדוגמא קומפוננטת כפתור `FancyButton` שמרנדרת אלמנט כפתור פשוט בתוך ה-DOM:
`embed:forwarding-refs/fancy-button-simple.js`

קומפוננטות React מחביאות את פרטי הישום שלהן, כולל את הפלט המרונדר שלהן. קומפוננטות אחרות שמשתמשות ב-`FancyButton` **בדרך כלל לא יצטרכו** [להשיג רפרנס](/docs/refs-and-the-dom.html) לאלמנט הכפתור של ה-DOM שהיא מיישמת. זה דבר טוב, כי זה מונע מקומפוננטות לסמוך על מבנה ה-DOM אחת של השנייה יותר מדי.

למרות שאיקפסולציה כזאת רצויה בקומפוננטות ברמת האפליקציה כמו `FeedStory` או `Comment`, היא יכולה להפוך לפחות נוחה בזמן שימוש בקומפוננטות ״עלה״ שנועדות לשימוש חוזר כמו `FancyButton` או `MyTextInput`. השימוש בקומפוננטות האלה בדרך כלל חוזר על עצמו פעמים רבות באפליקציה, בדומה לשימוש ב- `button` ו- `input`, ולפעמים אין ברירה אלא לגשת ישירות לאלמנטי ה-DOM שלהן כדי לשנות פוקוס, בחירה או אנימציה.

**העברת רפרנסים היא פיצ׳ר שמאפשר לקומפוננטות לקחת הפניה (`רפרנס`) שהם קיבלו ולהעביר אותה הלאה לקומפוננטת ילד**

בדוגמא הנ״ל, הכפתור `FancyButton` משתמש ב-`React.forwardRef` כדי לקבל את הרפרנס שהועבר אליו, ואז מעביר אותו לאלמנט הכפתור שהוא מרנדר ב-DOM:

`embed:forwarding-refs/fancy-button-simple-ref.js`

בצורה זו, קומפוננטות שמשתמשות ב- `FancyButton` יכולות לקבל רפרנס לצומת הכפתור עצמה ולהשתמש בה בעת הצורך - כאילו הן השתמשו בכפתור ב-DOM באופן ישיר.

להלן הסבר מפורט של מה שקורה בדוגמא לעיל:

1. אנחנו יוצרים [רפרנס של React](/docs/refs-and-the-dom.html) ע״י שימוש ב- `React.createRef` ושמים אותו במשתנה ה-`ref`.
1. אנחנו מעבירים את הרפרנס למטה ל- FancyButton בעזרת השימוש במאפיין ה-JSX: `<FancyButton ref={ref}>`
1. React מעבירה את הרפרנס לפונקציית ה- `(props, ref) => ...` כפרמטר השני בתוך `forwardRef`.
1. אנחנו מעבירים את ארגומנט הרפרנס למטה לכפתור על ידי שימוש במאפיין ה-JSX: `<button ref={ref}>`
1. כשהרפרנס מחובר, `ref.current` יצביע לצומת הכפתור ב-DOM.

>הערה
>
> ארגומנט הרפרנס השני קיים רק כשמגדירים קומפוננטה עם קריאה ל- `React.forwardRef`. פונקציות רגילות או קומפוננטות מחלקה לא מקבלות את ארגומנט ה-`ref`, והוא גם לא זמין ב-props שלהן.
>
> העברת רפרנסים לא מוגבלת רק לקומפוננטות DOM. ניתן להעביר רפרנסים גם למופע של קומפוננטות מחלקה.

## הערה למתחזקי ספריות קומפוננטות {#note-for-component-library-maintainers}

**When you start using `forwardRef` in a component library, you should treat it as a breaking change and release a new major version of your library.** This is because your library likely has an observably different behavior (such as what refs get assigned to, and what types are exported), and this can break apps and other libraries that depend on the old behavior.

Conditionally applying `React.forwardRef` when it exists is also not recommended for the same reasons: it changes how your library behaves and can break your users' apps when they upgrade React itself.

## העברת רפרנסים בקומפוננטות מסדר גבוה יותר {#forwarding-refs-in-higher-order-components}

This technique can also be particularly useful with [higher-order components](/docs/higher-order-components.html) (also known as HOCs). Let's start with an example HOC that logs component props to the console:
`embed:forwarding-refs/log-props-before.js`

The "logProps" HOC passes all `props` through to the component it wraps, so the rendered output will be the same. For example, we can use this HOC to log all props that get passed to our "fancy button" component:
`embed:forwarding-refs/fancy-button.js`

There is one caveat to the above example: refs will not get passed through. That's because `ref` is not a prop. Like `key`, it's handled differently by React. If you add a ref to a HOC, the ref will refer to the outermost container component, not the wrapped component.

This means that refs intended for our `FancyButton` component will actually be attached to the `LogProps` component:
`embed:forwarding-refs/fancy-button-ref.js`

Fortunately, we can explicitly forward refs to the inner `FancyButton` component using the `React.forwardRef` API. `React.forwardRef` accepts a render function that receives `props` and `ref` parameters and returns a React node. For example:
`embed:forwarding-refs/log-props-after.js`

## הצגת שם מותאים בכלי פיתוח {#displaying-a-custom-name-in-devtools}

`React.forwardRef` accepts a render function. React DevTools uses this function to determine what to display for the ref forwarding component.

For example, the following component will appear as "*ForwardRef*" in the DevTools:

`embed:forwarding-refs/wrapped-component.js`

If you name the render function, DevTools will also include its name (e.g. "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

You can even set the function's `displayName` property to include the component you're wrapping:

`embed:forwarding-refs/customized-display-name.js`
