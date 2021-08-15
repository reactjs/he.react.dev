---
id: higher-order-components
title: קומפוננטות מסדר גבוה יותר
permalink: docs/higher-order-components.html
---

קומפוננטה מסדר גבוה יותר (HOC) היא טכניקה מתקדמת של React שעוזרת למחזר קוד קומפוננטות.
ה-HOCs הן לא בדיוק חלק מהממשק של React, אלא תבנית עיצוב שהתפתחה מהטבע הקומפוזיציוני של React.

מבחינת היישום, **קומפוננטה מסדר גבוה יותר היא פונקציה שלוקחת קומפוננטה ומחזירה קומפוננטה אחרת**.


```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

בשונה מקומפוננטה רגילה שמתרגמת מאפיינים לממשק משתמש, קומפוננטה מסדר גבוה יותר מתרגמת קומפוננטה לקומפוננטה אחרת.

<<<<<<< HEAD
ה-HOCs שכיחות בספריות צד שלישי של React, כמו למשל ה- [`connect`](https://github.com/reduxjs/react-redux/blob/main/docs/api/connect.md#connect) של Redux וה- `createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer) של Relay.
=======
HOCs are common in third-party React libraries, such as Redux's [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) and Relay's [`createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer).
>>>>>>> 95e15d063b205007a92c52efb5311f76ad5a0b6c

כאן נסביר למה קומפוננטות מסדר גבוה יותר שימושיות, ואיך ליצור כאלה בעצמנו.

## שימוש ב-HOCs לפעולות בשימוש נרחב {#use-hocs-for-cross-cutting-concerns}

> **הערה**
>
> המלצנו בעבר על mixins כדרך לטפל בפעולות בשימוש נרחב.
> מאז, הבנו שהן גורמות ליותר בעיות משהן מביאות תועלת.
> [קראו כאן](/blog/2016/07/13/mixins-considered-harmful.html) למה עזבנו את השימוש ב-mixins ואיך תוכלו למגר את הקומפוננטות הקיימות שלכם.

קומפוננטות הן יחידות הקוד הכי ממוחזרות ב- React. למרות זאת, יש לא מעט תבניות עיצוב שקשה לממש בעזרת קומפוננטות מסורתיות.

לדוגמא, נניח שיש לנו קומפוננטת `CommentList` שמתחברת למקור נתונים חיצוני כדי להציג רשימה של הערות:


```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // הוא מקור נתונים חיצוני גלובאלי "DataSource"
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // מקשיבים לשינויים במקור הנתונים
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // מפסיקים להקשיב לשינויים
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // מעדכנים את רשימת הערות כשמתקבל שינוי
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

לאחר מכן, נכתוב קומפוננטה שתאזין לבלוג פוסט יחיד, שממומשת בצורה דומה:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` ו- `BlogPost` לא זהות - הן משתמשות במתודות שונות במקור הנתונים ומציגות מידע שונה. אבל רוב השימוש שלהן דומה:


- אחרי ה-mount, מתחילים להאזין לשינויים במקור המידע
- כשמתקבל שינוי, קוראים ל- `setState`
- ב-unmount, מפסיקים להאזין לשינויים

באפליקציה גדולה, התבנית הזאת של האזנה למקור נתונים ועדכון ה-state תחזור שוב ושוב. סביר להניח שנרצה ליצור הפשטה שתאפשר לנו להגדיר את הפעולה הזאת במקום אחד ולהשתמש בה במספר קומפוננטות שונות. קומפוננטות מסדר גבוה יותר מצוינות בדיוק במצבים כאלה.

אפשר לכתוב פונקציה שיוצרת קומפוננטה כמו `CommentList` ו- `BlogPost`, שמאזינה למקור הנתונים `DataSource`.
הפונקציה תקבל כאחד מהארגומנטים, קומפוננטת ילד שמקבלת את המידע המקושר כ-prop.
נקרא לפונקציה `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

הפרמטר הראשון הוא הקומפוננטה העטופה. הפרמטר השני מחזיר את המידע שאנחנו צריכים, באמצעות מקור הנתונים וה-props הנוכחיים.

כשהקומפוננטות CommentListWithSubscription ו- BlogPostWithSubscription מרונדרות, CommentList ו-  BlogPostיקבלו את ה-prop data עם המידע העדכני ביותר שהתקבל ממקור הנתונים:

```js
// הפונקציה מקבלת קומפוננטה...
function withSubscription(WrappedComponent, selectData) {
  // ...ומחזירה קומפוננטה אחרת...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... שדואגת להאזנה למקור המידע...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... ומרנדרת את הקומפוננטה העטופה עם המידע החדש
      // הלאה props-שימו לב שאנחנו מעבירים את כל ה
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

שימו לב שה-HOC לא משנה את קלט הקומפוננטה, וגם לא מעתיקה את ההתנהגות שלה באמצעות הורשה. במקום זאת, ה-HOC *עוטפת* את הקומפוננטה המקורית בקומפוננטה מכילה. ה-HOC היא פונקציה טהורה שלא גורמת לשום תופעות לוואי.

וזהו! הקומפוננטה העטופה מקבלת את כל ה- props מהקומפוננטה המכילה, וגם prop חדש בשם `data` שבעזרתו היא מרנדרת את הפלט שלה. כך ה-HOC לא צריכה לדעת מה ולמה עושים עם המידע, והקומפוננטה העטופה לא צריכה לדעת מאיפה המידע הגיע.

כיוון שהפונקציה `withSubscription` היא פונקציה רגילה, תוכלו להעביר לה יותר או פחות ארגומנטים לפי הצורך.
לדוגמא, תוכלו לשנות את השם של ה-prop `data` כדי להפריד את ה- HOC עוד יותר מתוכן הקומפוננטה העטופה. או שתוכלו לקבל ארגומנט שמשנה את התצורה של `shouldComponentUpdate` או של מקור הנתונים. כל השינויים האלה אפשריים כי ל-HOC יש שליטה מלאה על הגדרת הקומפוננטה העטופה.

כמו קומפוננטות, ה״חוזה״ בין הפונקציה `withSubscription` והקומפוננטה העטופה נשלט לגמרי על ידי props.
כך ניתן להחליף מימוש HOC אחת באחרת בקלות, כל עוד הן מספקות את אותם ה- props לקומפוננטה העטופה. תכונה שמאוד מועילה כשמשנים ספרייה לטעינת מידע, לדוגמא.

## השתמשו בקומפוזיציה במקום מוטציה של הקומפוננטה המקורית. {#dont-mutate-the-original-component-use-composition}

עמדו בפני הפיתוי לשנות את ה- prototype של הקומפוננטה (וכל מוטציה אחרת) בתוך ה- HOC.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // עצם זה שאנחנו מחזירים את הקלט כפלט מראה שהקלט עבר מוטציה כלשהי.
  return InputComponent;
}

// שמתקבל prop יתעד כל EnhancedComponent
const EnhancedComponent = logProps(InputComponent);
```

יש כמה בעיות עם מוטציה. הבעיה הראשונה היא שאי אפשר להשתמש בקומפוננטה שהועברה כקלט בנפרד. מעבר לזה, אם תיישמו HOC נוספת ל- `EnhancedComponent` ש*גם* משנה את `componentDidUpdate`, התפקוד של ה-HOC הראשונה יירמס! ה- HOC גם לא יעבוד עם קומפוננטות פונקציה ללא מתודות מחזור חיים.

מוטציה ב- HOCs יוצרת הפשטה דולפת - המשתמש צריך לדעת איך מה קורה בתוך הקוד כדי להמנע מעימות עם HOCs אחרות.

במקום מוטציה, עדיף לכתוב HOCs שמשתמשות בקומפוזיציה, ע״י עטיפת קומפוננטת הקלט בקומפוננטה מכילה:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // עוטפים את קומפוננטת הקלט בקומפוננטה מכילה, בלי מוטציה. מעולה!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

ה-HOC בדוגמא מספקת את אותה הפונקציונאליות של הגרסה שעברה מוטציה שהצגנו קודם, בלי הפוטנציאל ליצור עימותים עם קומפוננטות אחרות. בנוסף, היא תעבוד כמו שצריך גם עם קומפוננטות פונקציה וקומפוננטות מחלקה. כיוון שהיא פונקציה טהורה, אפשר לשלב אותה עם HOCs אחרות או אפילו עם עצמה.

יכול להיות ששמתם לב לדמיון בין HOCs ותבנית עיצוב בשם **קומפוננטות מכילות** (container components).
קומפוננטות מכילות הן חלק מאסטרטגיית פיצול אחריות בין פעולות ברמה גבוהה וברמה נמוכה. הן מנהלות דברים כמו האזנה ו- state, ומעבירות props לקומפוננטות שמטפלות בדברים כמו רינדור ממשק משתמש. HOCs משתמשות בקומפוננטות מכילות כחלק מהמימוש שלהן. אפשר לחשוב עליהן כקומפוננטות מכילות עם פרמטרים.

## מוסכמות לגבי העברת props לא קשורים לקומפוננטות עטופות {#convention-pass-unrelated-props-through-to-the-wrapped-component}

קומפוננטות מסדר גבוה יותר מוסיפות פיצ׳רים לקומפוננטה. הן לא אמורות לשנות את התפקוד של הקומפוננטה באופן משמעותי. ניתן לצפות שקומפוננטה המוחזרת מ-HOC תספק ממשק דומה לקומפוננטה העטופה.

ה- HOC צריכה להעביר props שלא בהכרח קשורים אליה הלאה לקומפוננטה העטופה. בדרך כלל ניתן למצוא בהן מתודת render שנראית פחות או יותר ככה:

```js
render() {
  // שלא אמורים לעבור הלאה לקומפוננטה העטופה HOC-הקשורים ל props-קודם כל נמצא את ה
  const { extraProp, ...passThroughProps } = this.props;

  // instance או מתודות state-לתוך הקומפוננטה העטופה. בדרך כלל אלו ערכים מה props נעביר
  const injectedProp = someStateOrInstanceMethod;

  // לקומפוננטה העטופה props-ועכשיו נוכל להעביר את ה
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

המוסכמה הזאת עוזרת לוודא שה- HOCs נשארות גמישות כדי שנוכל למחזר אותן במקומות רבים באפליקציה.

## מוסכמות למקסום קומפוזיציה {#convention-maximizing-composability}

לא כל ה- HOCs נראות אותו הדבר. לפעמים הן מקבלות ארגומנט אחד בלבד, הקומפוננטה העטופה:

```js
const NavbarWithRouter = withRouter(Navbar);
```

בדרך כלל הן מקבלות ארגומנטים נוספים. בדוגמא הזאת מ- Relay, מועבר אובייקט קונפיגורציה שמציין את המידע שהקומפוננטה תלויה בו:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

החתימה השכיחה ביותר ל- HOCs נראית כך:

```js
// React Redux של `connect`-פונקציית ה
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*מה?!* פשוט יותר להבין מה קורה כאן כשמפצלים את שני החלקים.

```js
// היא פונקציה שמחזירה פונקציה אחרת connect
const enhance = connect(commentListSelector, commentListActions);
// Redux store-שמחזירה קומפוננטה שמחוברת ל ,HOC הפונקציה המוחזרת היא
const ConnectedComment = enhance(CommentList);
```
במילים אחרות, `connect` היא פונקציה מסדר גבוה יותר שמחזירה קומפוננטה מסדר גבוה יותר!

יכול להיות שזה נראה מבלבל או לא נחוץ, אבל יש בזה מאפיינים שימושיים. HOCs עם ארגומנט אחד כמו זה שמוחזר על ידי פונקציית ה- `connect` משתמש בחתימה `Component => Component`. קל מאוד לשלב פונקציות שיש להן פלט מסוג זהה לסוג הקלט שלהן.

```js
// במקום זה...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... תוכלו להשתמש בפונקציית שירות קומפוזיציה
// compose(f, g, h) -זהה ל (...args) => f(g(h(...args)))
const enhance = compose(
  // עם ארגומנט יחיד HOCs שתי אלה הן
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(המאפיין הזה מרשה לנו להשתמש ב- `connect` ו- HOCs מסוג דומה כ-`decorators` - עוד הצעה נסיונית של JavaScript.)

פונקציית השירות `compose` מסופקת על ידי ספריות צד שלישי רבות כגון lodash (כ- [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose) ו- [Ramda](https://ramdajs.com/docs/#compose).

## מוסכמות לעיטוף השם המוצג בשביל דיבאגינג {#convention-wrap-the-display-name-for-easy-debugging}

הקומפוננטות המכילות שמיוצרות על ידי HOCs מוצגות ב- [React Developer Tools](https://github.com/facebook/react-devtools) כמו כל קומפוננטה אחרת. בשביל להקל על דיבאגינג, כדאי לתת לקומפוננטה שם שמסביר שהיא נוצרה כתוצאה משימוש ב- HOC.

<<<<<<< HEAD
הטכניקה הנפוצה ביותר היא לעטוף את השם (displayName) של הקומפוננטה העטופה. לדוגמא, אם הקומפוננטה מסדר גבוה יותר נקראת `withSubscription`, והקומפוננטה העטופה נקראת `CommentList`, נעטוף את השם המוצג ונחזיר `WithSubscription(CommentList)`:
=======
The container components created by HOCs show up in the [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) like any other component. To ease debugging, choose a display name that communicates that it's the result of a HOC.
>>>>>>> 95e15d063b205007a92c52efb5311f76ad5a0b6c


```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## הסתיגויות {#caveats}

קומפוננטות מסדר גבוה יותר באות עם מספר הסתיגויות שלא מובנות מאליו, במיוחד לאלה שחדשים ל- React.

### אל תשמשו ב- HOCs בתוך מתודת ה- render {#dont-use-hocs-inside-the-render-method}

אלגוריתם ההבדלה של React (שנקרא [Reconciliation](/docs/reconciliation.html)) משתמש בזהות קומפוננטה כדי להחליט אם לעדכן את עץ הקומפוננטות או לזרוק אותו וליצור חדש במקומו. אם הקומפוננטה המוחזרת מ- `render` זהה (`===`) לקומפוננטה מהרינדור הקודם, React יעדכן באופן רקורסיבי את עץ הקומפוננטות על ידי השוואתו עם העץ החדש. אם הם לא זהים, עץ הקומפוננטות הקיים יזרק.

בדרך כלל, לא צריך לחשוב על זה. אבל זה חשוב בזמן שימוש בקומפוננטות מסדר גבוה יותר כי זה אומר שאי אפשר לשים HOC בקומפוננטה בעזרת מתודת ה- render:

```js
render() {
  // נוצרות בכל רינדור EnhancedComponent גרסה חדשה של
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // זה גורם לכל עץ הקומפוננטה להיזרק ולהיווצר מחדש כל פעם!
  return <EnhancedComponent />;
}
```

הבעיה היא לא רק ביצועית - היא גם תגרום ל- state של הקומפוננטות ושל כל קומפוננטות הילד שלה להעלם.

במקום זאת, הגדירו את ה- HOCs מחוץ להגדרת הקומפוננטות כך שהקומפוננטה תווצר רק פעם אחת. לאחר מכן, הזהות שלה תישאר עקבית עם כל רינדור, שזה מה שבדרך כלל נרצה בכל מקרה.

במקרים הנדירים שהם תרצו ליצור קומפוננטה מסדר גבוה יותר באופן דינאמי, תוכלו לעשות זאת מתוך אחת ממתודות מחזור החיים של הקומפוננטה, או ה- constructor שלה.

### חובה להעתיק מתודות סטאטיות {#static-methods-must-be-copied-over}

לפעמים יש צורך בהגדרת מתודה סטאטית בקומפוננטת React. לדוגמא, קומפוננטות מכילות של Relay חופשות מתודה סטאטית בשם `getFragment` כדי לאפשר קומפוזיציה של פרגמנטית של GraphQL.

כשמשתמשים ב- HOC על קומפוננטה, הקומפוננטה המקורית נעטפת על ידי הקומפוננטה המכילה. זאת אומרת שהקומפוננטה החדשה לא כוללת את המתודות הסטאטיות של הקומפוננטה המקורית.

```js
// נגדיר מתודה סטאטית
WrappedComponent.staticMethod = function() {/*...*/}
// על הקומפוננטה HOC -עכשיו נשתמש ב
const EnhancedComponent = enhance(WrappedComponent);

// הקומפוננטה שנקבל לא מגדירה את המתודה הסטאטית
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

כדי לפתור את הבעיה הזאת, ניתן להעתיק את המתודות לתוך הקומפוננטה המכילה לפני שמחזירים אותה:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // נאלץ לדעת בדיוק איזה מתודות להעתיק :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

החיסרון הוא שנאלץ לדעת בדיוק איזה מתודות להעתיק. אפשר להשתמש ב- [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) כדי להעתיק באופן אוטומטי את כל המתודות הסטאטיות (מלבד אלה שמוגדרות על ידי React):

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

פתרון נוסף הוא לייצא את המתודות הסטאטיות בנפרד מתוך הקומפוננטה עצמה.

```js
// במקום...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...נייצא את המתודות בנפרד...
export { someFunction };

// ...ואז נייבא את שתיהן כדי לשלב אותן
import MyComponent, { someFunction } from './MyComponent.js';
```

### הרפרנסים לא מועברים {#refs-arent-passed-through}

למרות שהמוסכמה לקומפוננטות מסדר גבוה יותר היא להעביר את כל ה- props הלאה לקומפוננטה העטופה, זה לא עובד עבור רפרנסים (refs). הסיבה לכך היא שה- `ref` הוא לא בדיוק prop - כמו `key`, React מטפלת בו באופן מיוחד. אם תוסיפו רפרנס לאלמנט שהקומפוננטה שלו נוצרה על ידי HOC, הרפרנס מתייחס למופע הקומפוננטה המכילה החיצונית ביותר, ולא לקומפוננטה העטופה.

הפתרון לבעיה הזאת הוא להשתמש בממשק `React.forwardRef` (שניתן לשימוש החל מגרסה 16.3). [תוכלו למצוא עוד מידע בעמוד העברת רפרנסים](/docs/forwarding-refs.html).
