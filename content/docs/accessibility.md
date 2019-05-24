---
id: accessibility
title: נגישות
permalink: docs/accessibility.html
---

## למה נגישות? {#why-accessibility}

נגישות ברשת (ידועה גם כ [**a11y**](https://en.wiktionary.org/wiki/a11y)) היא יצירה ועיצוב אתרים שמתאימים לשימוש ע״י כולם. תמיכה בנגישות נדרשת ע״י טכנולוגית מסייעת כדי לפרש דפי אינטרנט.

React מספקת תמיכה מלאה בבניית אתרים נגישים, בדרך כלל ע״י שימוש בטכניקות HTML סטנדרטיות.

## סטנדרטים וקווים מנחים {#standards-and-guidelines}

### WCAG {#wcag}

ניתן למצוא קוים מנחים ליצירת אתרים נגישים ב[Web Content Accessibility Guidelines](https://www.w3.org/WAI/intro/wcag).

הרשימה הבאה מ WCAG מספקת סקירה כללית:

- [WCAG checklist from Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [WCAG checklist from WebAIM](https://webaim.org/standards/wcag/checklist)
- [Checklist from The A11Y Project](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

המסמך מ [Web Accessibility Initiative - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) מכיל טכניקות לבניית ווידג׳טים נגישים ב Javascript.

שימו לב שJSX תומך לחלוטין בכל תכונות הHTML `aria-*`.
בשונה מרוב תכונות הDOM בReact שנקראות בcamelCase, תכונות אלה נקראות בhyphen-cased (שמוכר גם בשמות אחרים כמו kebab-case, lisp-case וכו׳), בדיוק כמו בHTML רגיל:

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## סמנטי HTML {#semantic-html}
HTML סמנטי (או דקדוקי) הוא הבסיס לנגישות באפליקציות ואתרי אינטרנט.
השימוש באלמנטים שונים על מנת לחזק את המשמעות של המידע שמוצג באתרים, בדרך כלל יוביל לנגישות בפני עצמו.

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

לפעמים הסמנטיקה נשברת כשאנחנו מוסיפים אלמנטים כמו `<div>` לJSX כדי לגרום לReact לעבוד כמו שצריך, בעיקר בזמן שימוש ברשימות וטבלאות (`<ol>`, `<ul>`, `<dl>`, `<table>` וכו׳)
במקרים האלה ניתן להשתמש ב[פרגמנטים בReact](/docs/fragments.html) במקום `div`, כדי לאחד מספר אלמנטים.

לדוגמא,
```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

ניתן כמובן למפות רשימת פריטים למערך של פרגמנטים באותה צורה שממפים כל אלמנט אחר:

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // גם לפרגמנטים prop `key` בזמן מיפוי רשימות צריך להוסיף את ה
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

כשאין צורך בהוספת props ניתן להשתמש ב[סינטקס מקוצר](/docs/fragments.html#short-syntax), בהנחה ושאר הכלים תומכים בו:

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

לעוד מידע, ראו את עמוד [תיעוד הפרגמנטים](/docs/fragments.html).

## טפסים נגישים {#accessible-forms}

### תיוג {#labeling}

כל אלמנט או form ב HTML, (כמו `<input>` ו `<textarea>`), צריכים לקבל תיוג נגיש. עלינו לספק תגיות שמתארות אותם בשביל קוראי המסך.

המשאבים הנ״ל מראים לנו איך לספק תגיות מתאימות:

- [ה W3C מראה לנו איך לתייג אלמנטים](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM מראה לנו איך לתייג אלמנטים](https://webaim.org/techniques/forms/controls)
- [Paciello Group מסבירים על שמות נגישים](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

למרות שבדרך כלל אנחנו יכולים להשתמש בסטנדרטים הנהוגים בHTML ישירות בReact, שימו לב שהתכונה `for` למשל נכתבת בJSX כ`htmlFor`:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### ידוע המשתמש במקרה של שגיאות {#notifying-the-user-of-errors}

שגיאות צריכות להיות מובנות לכל משתמש. הלינק הבא מראה לנו איך להעביר את תוכן השגיאה גם לקורא המסך:

- [הW3C מדגים הודעות למשתמש](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM מסביר על ולידציה של דפים](https://webaim.org/techniques/formvalidation/)

## בקרת פוקוס {#focus-control}

חשוב לבנות אפליקציות שניתנות לשימוש בעזרת המקלדת בלבד (ללא עזרת העכבר):

- [WebAIM מסביר על נגישות מקלדת](https://webaim.org/techniques/keyboard/)

### פוקוס מקלדת ומסגרת פוקוס {#keyboard-focus-and-focus-outline}

פוקוס המקלדת מתאר את האלמנט בDOM שבחור ומוכן לקבל נתונים מהמקלדת. ניתן לראות את הפוקוס במסגרת או הדגש, כמו בתמונה הבאה:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

מומלץ להסיר את ההדגש הנ״ל אך ורק בכדי להחליף אותו בצורת הדגש אחרת (לדוגמא בעזרת הקונפיגורציה `outline: 0`)

### דילוג לתוכן מבוקש {#mechanisms-to-skip-to-desired-content}

על מנת שהשימוש באתר יהיה מהיר ואופטימלי עם המקלדת, ניתן לספק דרך לדלג בעזרת אזורי ניווט לתוכן מבוקש

לינקים לדילוג ניווט (SkipLinks) הם לינקים נסתרים שמתגלים בזמן אינטרקציה עם האתר באמצעות המקלדת בלבד. הם פשוטים לפיתוח בעצמאות קישורים עוגנים (anchors) וסגנונות עיצוב:

- [WebAIM - לינקים לדילוג ניווט](https://webaim.org/techniques/skipnav/)

בנוסף, אפשר להשתמש באלמנטים לציון דרך כמו `<main>` ו `<aside>`, על מנת לציין אזורים בדף בשביל להרשות למשתמש לנווט אליהם בקלות ובמהירות בעזרת טכנולוגיה מסייעת.

קרא עוד על אלמנטים לציון דרך לשיפור נגישות בלינק הבא:

- [ציוני דרך נגישים](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### שליטה מבוקרת בפוקוס {#programmatically-managing-focus}

אפליקציות React משנות את הDOM בזמן ריצה באופן מתמשך, מה שגורם לפעמים למקלדת לאבד פוקוס או לפוקוס לעבור למקום בלתי צפוי. על מנת למנוע זאת, ביכולתנו להחזיר את פוקוס המקלדת למקום הנכון באופן תוכניתי. לדוגמא, ע״י החזרת הפוקוס לכפור שפתח טופס מודאלי, אחרי סגירתו.

התיעוד בMDN Web Docs מתאר איך לבנות [ניווט מקלדת בווידג׳טים ב JavaScript](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

כדי לתת פוקוס בReact, אנחנו יכולים להשתמש ב[קישור לאלמנטים בDOM](/docs/refs-and-the-dom.html).

נתחיל ביצירת קישור לאלמנט בJSX של מחלקת קומפוננטה:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // DOM ב textInput צור קישור לאלמנט
    this.textInput = React.createRef();
  }
  render() {
  // על מנת לאחסן את ההפניה `ref` callback השתמש בפונקצית ה
  // (this.textInput) בשדה מופע textInput לאלמנט
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

לאחר מכן נוכל לשנות את הפוקוס למקום אחר בקומפוננטה לפי הצורך:

 ```javascript
 focus() {
   // DOMשל ה API שנה את הפוקוס של שדה הטקסט באופן מכוון בעזרת ה
   // DOMכדי לקבל גישה לצומת ה "current" שימו לב שאנחנו משתמשים ב
   this.textInput.current.focus();
 }
 ```

לפעמים אלמנט אב צריך לשנות פוקוס לקומפוננטת ילד. ניתן לעזאת זאת ע״י [חשיפות הפנית הDOM לאלמנט האב](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)
בעזרת prop מיוחד בקומפוננטת הילד שמעבירה לאלמנט האב את צומת הDOM של הילד.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// עכשיו תוכלו להעביר פוקוס לפי הצורך
this.inputElement.current.focus();
```

בזמן השימוש בHOC להרחבת קומפוננטות, מומלץ ל[העביר את ההפניה](/docs/forwarding-refs.html) לקומפוננטה הנעטפת בעזרת הפונקציה `forwardRef` של React.
במקרה וקומפוננטת HOC שלא בשליטתכם (צד שלישי) לא מממשת את ההעברת ההפניה, השיטה לעיל יכולה בכל זאת לעזור.

דוגמא טובה לשליטה בפוקוס אפשר למצוא ב[react-aria-modal](https://github.com/davidtheclark/react-aria-modal). זאת דוגמא יחסית נדירה של חלון מודאלי נגיש לגמרי. לא רק שהוא שם פוקוס התחלתי בכפתור הביטול (כדי למנוע ממשתמש המקלדת להתחיל את פעולת האישור בטעות) ושומר את פוקוס המקלדת בתוך החלון, הוא גם מחזיר את הפוקוס לאלמנט שפתח את החלון מלכתחילה לאחר סגירתו.

>הערה:
>
>למרות שזאת תכונת נגישות חשובה מאוד, חשוב להשתמש בשיפוט בזמן השימוש בטכניקה. המטרה צריכה להיות החזרת הפוקוס למקלדת, ולא לנסות לחזות את דרישות המשתמש
>ואופן השימוש שלו/ה באתר.

## אירועי עכבר וסמן {#mouse-and-pointer-events}

יש לדאוג שכל פונקציונאליות שזמינה דרך שימוש בעכבר, נגישה באותה מידה בשימוש במקלדת בלבד.
תלות בסמן (דרך עכבר או משטח מגע) מובילה להרבה מקרים לא נגישים למשתמשי מקלדת, שכותצאה מכך לא יוכלו להשתמש באפליקציה.

כדוגמא, נציג מקרה שכיח ביותר של נגישות שבורה כתוצאה מאירועי לחיצה - כשהמשתמש יכול לסגור חלון צץ באמצעות לחיצה מחוץ לחלון.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

בדרך כלל התנהגות זו מיושמת ע״י קישור אירוע הלחיצה `click` לעצם החלון `window` שסוגר את החלון הצץ:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```
למרות שהתנהגות זו לא מהווה בעיה למשתמשים שיכולים להעזר בסמן, היא מובילה להתנהלות שבורה למשתמשים שתלוים במקלדת כדי לנווט בין אלמנטים, כי עצם החלון לא מקבל את אירוע הלחיצה. ובסופו של דבר גם מונעת ממשתמשים גישה לפונקציונאליות באתר.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

אפשר במקום זאת להגיע להתנהגות זהה בעזרת מטפלי אירועים כמו `onBlur` ו `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }


  // setTimeout סוגרים את החלון הצץ בטיק הבא בעזרת.
  // זה חשוב כי אנחנו צריכים קודם כל לבדוק אם ילד אחר של האלמנט
  // קורה לפני אירוע הפוקוס blurקיבל פוקוס, כיוון שהאירוע של ה
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // כדי לא לסגור Timeout מסירים את ה
  // את החלון הצץ כשילד אחר מקבל פוקוס
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // לאב focus וה blur עוזר לנו בהעלאת אירועי ה React
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

הקוד הזה חושף פונקציונאליות למשתמשי המקלדת בלי להפקיר את הסמן. בנוסף, שימו לב לתוספת ה`aria-*` props שתומכים במשתמשים שנעזרים בקוראי מסך.
על מנת להשאיר את הדוגמא פשוטה, לא כללנו את אירועי המקלדת שמאפשרים אינטרקציית `arrow key` עם החלון הצץ.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

זאת דוגמא שבה מספר מקרים שתלויים רק בסמן מונעים ממשתמשים שתלויים במקלדת נגישות לפונקציונאליות.
תמיד בדקו את האתר עם המקלדת כדי למצוא את האזורים הבעיתיים ולתקן אותם בעזרת מטפלי אירועים שזמינים למקלדת.

## ווידג׳טים מסובכים יותר {#more-complex-widgets}

חוויית משתמש מסובכת יותר לא צריכה להיות פחות נגישה. הדרך הפשוטה ביותר לפתח אתר נגיש היא לפתח קוד קרוב ככל האפשר לHTML, אבל גם ווידג׳טים מסובכים יותר אפשר לפתח בצורה נגישה.

כאן נדרשת הבנה של [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) ו[ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).

אלה מספקות ארגז כלים מלא בתכונות HTML עם תמיכה מלאה בJSX' שעוזרים לנו לבנות קומפוננטות React פונקציונאליות.

כל סוג ווידג׳ט ממומש בצורה ותבנית עיצוב שונה, אבל המשתמש וסוכני המשתמש מצפים ממנו להתנהגות מסוימת:

- [WAI-ARIA Authoring Practices - תבניות עיצוב ווידג׳טים](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA דוגמאות](https://heydonworks.com/practical_aria_examples/)
- [קומפוננטות אינקלוסיביות](https://inclusive-components.design/)

## עוד נקודות למחשבה {#other-points-for-consideration}

### קביעת שפה {#setting-the-language}

ציין את השפה שבה כתובים הטקסטים בדף על מנת לאפשר לקוראי המסך לבחור את הגדרות הקול בהתאים:

- [WebAIM - תיעוד שפה](https://webaim.org/techniques/screenreader/#language)

### קביעת כותרת הדף {#setting-the-document-title}

דאג לציין את כותרת הדף בעזרת האלמנט `<title>` על מנת לתאר את תוכן ומטרת הדף המוצג באופן מדויק למשתמש:

- [WCAG - הבנת דרישות כותרת הדף](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

אנחנו יכולים לציין זאת בReact בעזרת [קומפוננטת כותרת הדף](https://github.com/gaearon/react-document-title)

### ניגוד צבעים {#color-contrast}

ודאו שלכל הטקסטים באתר יש ניגוד צבעים מספק, על מנת להקל על משתמשים עם יכולות ראייה פחותות לקרוא אותם:

- [WCAG - הבנת דרישות ניגוד צבעים](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [כל מה שתרצו לדעת על ניגוד צבעים וסיבות לחשוב עליהם שוב](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - מה הוא ניגוד צבעים](https://a11yproject.com/posts/what-is-color-contrast/)

חישוב הניגוד לכל קומבינצית צבעים באתר יכול לקחת הרבה זמן. דרך יותר פשוטה היא לחשב באופן אוטומטי [פלטת צבעים מלאה לאתר בעזרת Colorable](https://jxnblk.com/colorable/).

הכלים המצוין להלן (aXe ו WAVE) מספקים בדיקות אוטומטיות ומדווחים על שגיאות בניגודי צבעים:

- [WebAIM - בודק ניגודי צבעים](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - מוודא ניגודי צבעים](https://www.paciellogroup.com/resources/contrastanalyser/)

## Development and Testing Tools {#development-and-testing-tools}

There are a number of tools we can use to assist in the creation of accessible web applications.

### The keyboard {#the-keyboard}

By far the easiest and also one of the most important checks is to test if your entire website can be reached and used with the keyboard alone. Do this by:

1. Plugging out your mouse.
1. Using `Tab` and `Shift+Tab` to browse.
1. Using `Enter` to activate elements.
1. Where required, using your keyboard arrow keys to interact with some elements, such as menus and dropdowns.

### Development assistance {#development-assistance}

We can check some accessibility features directly in our JSX code. Often intellisense checks are already provided in JSX aware IDE's for the ARIA roles, states and properties. We also
have access to the following tool:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

The [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin for ESLint provides AST linting feedback regarding accessibility issues in your JSX. Many
IDE's allow you to integrate these findings directly into code analysis and source code windows.

[Create React App](https://github.com/facebookincubator/create-react-app) has this plugin with a subset of rules activated. If you want to enable even more accessibility rules,
you can create an `.eslintrc` file in the root of your project with this content:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Testing accessibility in the browser {#testing-accessibility-in-the-browser}

A number of tools exist that can run accessibility audits on web pages in your browser. Please use them in combination with other accessibility checks mentioned here as they can only
test the technical accessibility of your HTML.

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque Systems offers [aXe-core](https://github.com/dequelabs/axe-core) for automated and end-to-end accessibility tests of your applications. This module includes integrations for Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) or aXe, is an accessibility inspector browser extension built on `aXe-core`.

You can also use the [react-axe](https://github.com/dylanb/react-axe) module to report these accessibility findings directly to the console while developing and debugging.

#### WebAIM WAVE {#webaim-wave}

The [Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) is another accessibility browser extension.

#### Accessibility inspectors and the Accessibility Tree {#accessibility-inspectors-and-the-accessibility-tree}

[The Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) is a subset of the DOM tree that contains accessible objects for every DOM element that should be exposed
to assistive technology, such as screen readers.

In some browsers we can easily view the accessibility information for each element in the accessibility tree:

- [Using the Accessibility Inspector in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Activate the Accessibility Inspector in Chrome](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [Using the Accessibility Inspector in OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Screen readers {#screen-readers}

Testing with a screen reader should form part of your accessibility tests.

Please note that browser / screen reader combinations matter. It is recommended that you test your application in the browser best suited to your screen reader of choice.

### Commonly Used Screen Readers {#commonly-used-screen-readers}

#### NVDA in Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) or NVDA is an open source Windows screen reader that is widely used.

Refer to the following guides on how to best use NVDA:

- [WebAIM - Using NVDA to Evaluate Web Accessibility](https://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver in Safari {#voiceover-in-safari}

VoiceOver is an integrated screen reader on Apple devices.

Refer to the following guides on how activate and use VoiceOver:

- [WebAIM - Using VoiceOver to Evaluate Web Accessibility](https://webaim.org/articles/voiceover/)
- [Deque - VoiceOver for OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver for iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS in Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) or JAWS, is a prolifically used screen reader on Windows.

Refer to the following guides on how to best use JAWS:

- [WebAIM - Using JAWS to Evaluate Web Accessibility](https://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Other Screen Readers {#other-screen-readers}

#### ChromeVox in Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) is an integrated screen reader on Chromebooks and is available [as an extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) for Google Chrome.

Refer to the following guides on how best to use ChromeVox:

- [Google Chromebook Help - Use the Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](https://www.chromevox.com/keyboard_shortcuts.html)
