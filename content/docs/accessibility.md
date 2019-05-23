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

## Mouse and pointer events {#mouse-and-pointer-events}

Ensure that all functionality exposed through a mouse or pointer event can also be accessed using the keyboard alone. Depending only on the pointer device will lead to many cases where
keyboard users cannot use your application.

To illustrate this, let's look at a prolific example of broken accessibility caused by click events. This is the outside click pattern, where a user can disable an opened popover by clicking outside the element.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

This is typically implemented by attaching a `click` event to the `window` object that closes the popover:

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

This may work fine for users with pointer devices, such as a mouse, but operating this with the keyboard alone leads to broken functionality when tabbing to the next element
as the `window` object never receives a `click` event. This can lead to obscured functionality which blocks users from using your application.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

The same functionality can be achieved by using an appropriate event handlers instead, such as `onBlur` and `onFocus`:

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

  // We close the popover on the next tick by using setTimeout.
  // This is necessary because we need to first check if
  // another child of the element has received focus as
  // the blur event fires prior to the new focus event.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // If a child receives focus, do not close the popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React assists us by bubbling the blur and
    // focus events to the parent.
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

This code exposes the functionality to both pointer device and keyboard users. Also note the added `aria-*` props to support screen-reader users. For simplicity's sake
the keyboard events to enable `arrow key` interaction of the popover options have not been implemented.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

This is one example of many cases where depending on only pointer and mouse events will break functionality for keyboard users. Always testing with the keyboard will immediately
highlight the problem areas which can then be fixed by using keyboard aware event handlers.

## More Complex Widgets {#more-complex-widgets}

A more complex user experience should not mean a less accessible one. Whereas accessibility is most easily achieved by coding as close to HTML as possible,
even the most complex widget can be coded accessibly.

Here we require knowledge of [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) as well as [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).
These are toolboxes filled with HTML attributes that are fully supported in JSX and enable us to construct fully accessible, highly functional React components.

Each type of widget has a specific design pattern and is expected to function in a certain way by users and user agents alike:

- [WAI-ARIA Authoring Practices - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/practical_aria_examples/)
- [Inclusive Components](https://inclusive-components.design/)

## Other Points for Consideration {#other-points-for-consideration}

### Setting the language {#setting-the-language}

Indicate the human language of page texts as screen reader software uses this to select the correct voice settings:

- [WebAIM - Document Language](https://webaim.org/techniques/screenreader/#language)

### Setting the document title {#setting-the-document-title}

Set the document `<title>` to correctly describe the current page content as this ensures that the user remains aware of the current page context:

- [WCAG - Understanding the Document Title Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

We can set this in React using the [React Document Title Component](https://github.com/gaearon/react-document-title).

### Color contrast {#color-contrast}

Ensure that all readable text on your website has sufficient color contrast to remain maximally readable by users with low vision:

- [WCAG - Understanding the Color Contrast Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Everything About Color Contrast And Why You Should Rethink It](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - What is Color Contrast](https://a11yproject.com/posts/what-is-color-contrast/)

It can be tedious to manually calculate the proper color combinations for all cases in your website so instead, you can [calculate an entire accessible color palette with Colorable](https://jxnblk.com/colorable/).

Both the aXe and WAVE tools mentioned below also include color contrast tests and will report on contrast errors.

If you want to extend your contrast testing abilities you can use these tools:

- [WebAIM - Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

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
