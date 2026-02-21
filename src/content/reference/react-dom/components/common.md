---
title: "רכיבים נפוצים (למשל <div>)"
---

<Intro>

כל רכיבי הדפדפן המובנים, כגון [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), תומכים בכמה props ואירועים נפוצים.

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### רכיבים נפוצים (למשל `<div>`) {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[ראה דוגמאות נוספות למטה.](#usage)

#### אבזרים {/*common-props*/}

React props מיוחדים אלה נתמכים עבור כל הרכיבים המובנים:

* `children`: צומת React (אלמנט, מחרוזת, מספר, [פורטל,](/reference/react-dom/createPortal) צומת ריק כמו `null`, `undefined` ובוליאנים, או מערך של צמתים React אחרים). מציין את התוכן בתוך הרכיב. כאשר אתה use JSX, בדרך כלל תציין את אבזר `children` באופן מרומז על ידי קינון תגיות כמו `<div><span /></div>`.

* `dangerouslySetInnerHTML`: אובייקט בצורת `{ __html: '<p>some html</p>' }` עם מחרוזת HTML גולמית בפנים. עוקף את המאפיין [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) של הצומת DOM ומציג את ה-HTML שעבר בפנים. זה צריך להיות used בזהירות יתרה! אם ה-HTML בפנים אינו מהימן (לדוגמה, אם הוא מבוסס על HTML בסיכון), אתה [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) פגיעות. [קרא עוד על השימוש ב-`dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: אובייקט ref מ-[`useRef`](/reference/react/useRef) או [`createRef`](/reference/react/createRef), או [`ref` פונקציית התקשרות חוזרת,](#ref-callback) או מחרוזת עבור [Refs מדור קודם.]_‎ צומת [קרא עוד על מניפולציה של DOM עם refs.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: בוליאני. אם `true`, מדחיק את האזהרה שReact מציגה עבור רכיבים שיש להם `children` ו`contentEditable={true}` (שבדרך כלל אינם פועלים יחד). השתמש בזה אם אתה בונה ספריית קלט טקסט שמנהלת את התוכן `contentEditable` באופן ידני.

* `suppressHydrationWarning`: בוליאני. אם אתה use [עיבוד שרת,](/reference/react-dom/server) בדרך כלל יש אזהרה כאשר השרת והלקוח מציגים תוכן שונה. במקרים נדירים מסוימים (כמו חותמות זמן), קשה מאוד או בלתי אפשרי להבטיח התאמה מדויקת. אם תגדיר את `suppressHydrationWarning` ל-`true`, React לא יזהיר אותך על אי התאמה בתכונות ובתוכן של רכיב זה. זה עובד רק ברמה אחת בעומק, ומיועד להיות used כפתח מילוט. אל תגזים עםuse. [קרא על דיכוי שגיאות הידרציה.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: אובייקט עם סגנונות CSS, למשל `{ fontWeight: 'bold', margin: 20 }`. בדומה למאפיין DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style), שמות המאפיינים CSS צריכים להיכתב כ-`camelCase`, למשל `fontWeight` במקום `font-weight`. ניתן להעביר מחרוזות או מספרים כערכים. אם תעביר מספר __K___ __4 באופן אוטומטי, TK___1 `px` ("פיקסלים") לערך אלא אם כן מדובר במאפיין [יחידה ללא יחידות.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) אנו ממליצים להשתמש ב-`style` רק עבור סגנונות דינמיים שבהם אינכם יודעים את ערכי הסגנון מראש. במקרים אחרים, יישום מחלקות CSS רגילות עם https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) יעיל יותר לגבי `className`. `style`.](#applying-css-styles)

DOM props סטנדרטיים אלה נתמכים גם עבור כל הרכיבים המובנים:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): מחרוזת. מציינת קיצור מקשים עבור האלמנט. [לא מומלץ בדרך כלל.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): תכונות ARIA מאפשרות לך לציין את מידע עץ הנגישות עבור רכיב זה. ראה [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) לעיון מלא. ב-React, כל שמות המאפיינים של ARIA זהים לחלוטין לאלו ב-HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): מחרוזת. מציין אם וכיצד יש להשתמש באותיות רישיות בקלט user.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): מחרוזת. מציינת את שם המחלקה CSS של האלמנט. [קרא עוד על החלת סגנונות CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): בוליאני. אם `true`, הדפדפן מאפשר ל-user לערוך את האלמנט המעובד ישירות. זהו used ליישם ספריות קלט טקסט עשיר כמו [Lexical.](https://lexical.dev/) user React אזהרות אם תנסה להעביר לילדים React `contentEditable={true}` because React לא יוכל לעדכן את התוכן שלו לאחר עריכות user.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): תכונות נתונים מאפשרות לך לצרף כמה נתוני מחרוזת לאלמנט, למשל `data-fruit="banana"`. ב-React, הם לא בדרך כלל used מכיוון שuse בדרך כלל היית קורא נתונים מ-props או state במקום זאת.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): או `'ltr'` או `'rtl'`. מציין את כיוון הטקסט של האלמנט.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): ערך בוליאני. מציין אם האלמנט ניתן לגרירה. חלק מ-[HTML גרור ושחרר API.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): מחרוזת. מציינת איזו פעולה להציג עבור מקש Enter במקלדות וירטואליות.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): מחרוזת. עבור [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) ו-[`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), מאפשרת לך [לשייך את התווית לשליטה מסוימת.](/reference/react-dom/components/input#providing-a-label-K_for-an-input-T) Sam__ for-an-__0 attribute.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React uses שמות המאפיינים הסטנדרטיים DOM (`htmlFor`) במקום HTML שמות המאפיינים.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): בוליאני או מחרוזת. מציין אם יש להסתיר את האלמנט.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): מחרוזת. מציין מזהה ייחודי לרכיב זה, שיכול להיות used כדי למצוא אותו מאוחר יותר או לחבר אותו עם אלמנטים אחרים. צור אותו עם [`useId`](/reference/react/useId) כדי למנוע התנגשויות בין מופעים מרובים של אותו רכיב.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): מחרוזת. אם צוין, הרכיב יתנהג כמו [אלמנט מותאם אישית.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): מחרוזת. מציינת איזה סוג מקלדת להציג (לדוגמה, טקסט, מספר או טלפון).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): מחרוזת. מציין איזה מאפיין האלמנט מייצג עבור סורקי נתונים מובנים.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): מחרוזת. מציינת את השפה של האלמנט.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): פונקציה [`AnimationEvent` מטפל](#animationevent-handler). מופעל כאשר אנימציה CSS מסתיימת.
* `onAnimationEndCapture`: גרסה של `onAnimationEnd` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): [`AnimationEvent` מטפל](#animationevent-handler). מופעל כאשר איטרציה של אנימציה CSS מסתיימת ומתחילה אחת נוספת.
* `onAnimationIterationCapture`: גרסה של `onAnimationIteration` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): פונקציה [`AnimationEvent` מטפל](#animationevent-handler). מופעל כאשר אנימציה CSS מתחילה.
* `onAnimationStartCapture`: `onAnimationStart`, אבל יורה ב-[שלב הלכידה.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): פונקציית [`MouseEvent` מטפל](#mouseevent-handler). מופעלת כאשר לוחצים על כפתור מצביע שאינו ראשי.
* `onAuxClickCapture`: גרסה של `onAuxClick` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: פונקציה [`InputEvent` מטפל](#inputevent-handler). מופעל לפני שינוי הערך של רכיב הניתן לעריכה. React *עדיין לא* use את האירוע ה
* `onBeforeInputCapture`: גרסה של `onBeforeInput` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: פונקציה [`FocusEvent` מטפל](#focusevent-handler). Fires when an element lost focus. שלא כמו הדפדפן המובנה [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) אירוע, ב-React האירוע `onBlur` בועות.
* `onBlurCapture`: גרסה של `onBlur` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): פונקציית [`MouseEvent` מטפל](#mouseevent-handler). מופעל כאשר הלחצן הראשי נלחץ על התקן ההצבעה.
* `onClickCapture`: גרסה של `onClick` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): פונקציה [`CompositionEvent` מטפל](#compositionevent-handler). מופעל כאשר [עורך שיטת קלט](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) מתחיל הפעלה חדשה של חיבור.
* `onCompositionStartCapture`: גרסה של `onCompositionStart` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): פונקציית [`CompositionEvent` מטפל](#compositionevent-handler). מופעל כאשר [עורך שיטת קלט](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) משלים או מבטל הפעלה של קומפוזיציה.
* `onCompositionEndCapture`: גרסה של `onCompositionEnd` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): פונקציה [`CompositionEvent` מטפל](#compositionevent-handler). מופעל כאשר [עורך שיטת קלט](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) מקבל תו חדש.
* `onCompositionUpdateCapture`: גרסה של `onCompositionUpdate` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): מטפל [`MouseEvent`](#mouseevent-handler). מופעל כאשר ה-user מנסה לפתוח תפריט הקשר.
* `onContextMenuCapture`: גרסה של `onContextMenu` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): פונקציה [`ClipboardEvent` מטפל](#clipboardevent-handler). מופעלת כאשר ה-user מנסה להעתיק משהו ללוח.
* `onCopyCapture`: גרסה של `onCopy` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): פונקציה [`ClipboardEvent` מטפל](#clipboardevent-handler). מופעלת כאשר ה-user מנסה לחתוך משהו לתוך הלוח.
* `onCutCapture`: גרסה של `onCut` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: פונקציה [`MouseEvent` מטפל](#mouseevent-handler). נדלק כאשר ה-user לוחץ פעמיים. מתאים לדפדפן [`dblclick` אירוע.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
* `onDoubleClickCapture`: גרסה של `onDoubleClick` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): פונקציה [`DragEvent` מטפל](#dragevent-handler). מופעלת בזמן שה-user גורר משהו.
* `onDragCapture`: גרסה של `onDrag` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): פונקציה [`DragEvent` מטפל](#dragevent-handler). מופעל כאשר ה-user מפסיק לגרור משהו.
* `onDragEndCapture`: גרסה של `onDragEnd` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): פונקציה [`DragEvent` מטפל](#dragevent-handler). מופעלת כאשר התוכן הנגרר נכנס ליעד שחרור חוקי.
* `onDragEnterCapture`: גרסה של `onDragEnter` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): פונקציה [`DragEvent` מטפל](#dragevent-handler). יורה על יעד שחרור חוקי בזמן שהתוכן הנגרר נגרר מעליו. עליך לקרוא ל-`e.preventDefault()` כאן כדי לאפשר שחרור.
* `onDragOverCapture`: גרסה של `onDragOver` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): פונקציה [`DragEvent` מטפל](#dragevent-handler). מופעלת כאשר ה-user מתחיל לגרור אלמנט.
* `onDragStartCapture`: גרסה של `onDragStart` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): פונקציה [`DragEvent` מטפל](#dragevent-handler). נורה כאשר משהו נשמט על יעד שחרור חוקי.
* `onDropCapture`: גרסה של `onDrop` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: פונקציה [`FocusEvent` מטפל](#focusevent-handler). נורה כאשר אלמנט מקבל מיקוד. שלא כמו הדפדפן המובנה [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) אירוע, ב-React האירוע `onFocus` בועות.
* `onFocusCapture`: גרסה של `onFocus` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעלת כאשר רכיב לוכד מצביע באופן תוכנתי.
* `onGotPointerCaptureCapture`: גרסה של `onGotPointerCapture` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): פונקציה [`KeyboardEvent` מטפל](#keyboardevent-handler). מופעלת בעת לחיצה על מקש.
* `onKeyDownCapture`: גרסה של `onKeyDown` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): פונקציה [`KeyboardEvent` מטפל](#keyboardevent-handler). הוצאה משימוש. השתמש ב-`onKeyDown` או `onBeforeInput` במקום זאת.
* `onKeyPressCapture`: גרסה של `onKeyPress` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): פונקציה [`KeyboardEvent` מטפל](#keyboardevent-handler). מופעלת כאשר מקש משוחרר.
* `onKeyUpCapture`: גרסה של `onKeyUp` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעלת כאשר רכיב מפסיק ללכוד מצביע.
* `onLostPointerCaptureCapture`: גרסה של `onLostPointerCapture` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): פונקציית [`MouseEvent` מטפל](#mouseevent-handler). מופעל כאשר המצביע נלחץ כלפי מטה.
* `onMouseDownCapture`: גרסה של `onMouseDown` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): פונקציה [`MouseEvent` מטפל](#mouseevent-handler). מופעלת כאשר המצביע זז בתוך אלמנט. אין לו שלב לכידה. במקום זאת, `onMouseLeave` ו`onMouseEnter` מתפשטים מהאלמנט הנשאר לזה הנכנס.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): פונקציה [`MouseEvent` מטפל](#mouseevent-handler). מופעלת כאשר המצביע זז מחוץ לאלמנט. אין לו שלב לכידה. במקום זאת, `onMouseLeave` ו`onMouseEnter` מתפשטים מהאלמנט הנשאר לזה הנכנס.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): פונקציה [`MouseEvent` מטפל](#mouseevent-handler). מופעל כאשר המצביע משנה קואורדינטות.
* `onMouseMoveCapture`: גרסה של `onMouseMove` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): פונקציה [`MouseEvent` מטפל](#mouseevent-handler). מופעל כאשר המצביע זז מחוץ לאלמנט, או אם הוא עובר לרכיב צאצא.
* `onMouseOutCapture`: גרסה של `onMouseOut` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): פונקציית [`MouseEvent` מטפל](#mouseevent-handler). מופעלת כאשר המצביע משתחרר.
* `onMouseUpCapture`: גרסה של `onMouseUp` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעל כאשר הדפדפן מבטל אינטראקציה עם מצביע.
* `onPointerCancelCapture`: גרסה של `onPointerCancel` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעלת כאשר מצביע הופך לפעיל.
* `onPointerDownCapture`: גרסה של `onPointerDown` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעלת כאשר מצביע זז בתוך אלמנט. אין לו שלב לכידה. במקום זאת, `onPointerLeave` ו`onPointerEnter` מתפשטים מהאלמנט הנשאר לזה הנכנס.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): פונקציה [`PointerEvent` handler](#pointerevent-handler). מופעלת כאשר מצביע זז מחוץ לאלמנט. אין לו שלב לכידה. במקום זאת, `onPointerLeave` ו`onPointerEnter` מתפשטים מהאלמנט הנשאר לזה הנכנס.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעל כאשר מצביע משנה קואורדינטות.
* `onPointerMoveCapture`: גרסה של `onPointerMove` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעלת כאשר מצביע זז מחוץ לאלמנט, אם אינטראקציית המצביע מבוטלת, ו[עוד כמה סיבות.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: גרסה של `onPointerOut` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): פונקציה [`PointerEvent` מטפל](#pointerevent-handler). מופעל כאשר מצביע אינו פעיל יותר.
* `onPointerUpCapture`: גרסה של `onPointerUp` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): פונקציה [`ClipboardEvent` מטפל](#clipboardevent-handler). מופעלת כאשר ה-user מנסה להדביק משהו מהלוח.
* `onPasteCapture`: גרסה של `onPaste` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): פונקציה [`Event` מטפל](#event-handler). מופעלת כאשר אלמנט נגלל. אירוע זה אינו מבעבע.
* `onScrollCapture`: גרסה של `onScroll` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): פונקציה [`Event` מטפל](#event-handler). מופעלת לאחר הבחירה בתוך אלמנט הניתן לעריכה כמו קלט משתנה. React מרחיב את האירוע `onSelect` כך שיעבוד גם עבור אלמנטים `contentEditable={true}`. בנוסף, React עשוי להשפיע על הבחירה הריקה שלו ועל הבחירה שלו.
* `onSelectCapture`: גרסה של `onSelect` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): פונקציית [`TouchEvent` מטפל](#touchevent-handler). מופעל כאשר הדפדפן מבטל אינטראקציית מגע.
* `onTouchCancelCapture`: גרסה של `onTouchCancel` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): פונקציה [`TouchEvent` מטפל](#touchevent-handler). נורה כאשר נקודת מגע אחת או יותר מוסרות.
* `onTouchEndCapture`: גרסה של `onTouchEnd` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): פונקציה [`TouchEvent` מטפל](#touchevent-handler). יורה נקודת מגע אחת או יותר מוזזות.
* `onTouchMoveCapture`: גרסה של `onTouchMove` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): פונקציית [`TouchEvent` מטפל](#touchevent-handler). נורה כאשר ממוקמות נקודת מגע אחת או יותר.
* `onTouchStartCapture`: גרסה של `onTouchStart` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): פונקציה [`TransitionEvent` מטפל](#transitionevent-handler). מופעל כאשר מעבר CSS מסתיים.
* `onTransitionEndCapture`: גרסה של `onTransitionEnd` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): פונקציה [`WheelEvent` מטפל](#wheelevent-handler). נורה כאשר ה-user מסובב כפתור גלגל.
* `onWheelCapture`: גרסה של `onWheel` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): מחרוזת. מציין את תפקיד האלמנט במפורש עבור טכנולוגיות מסייעות.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): מחרוזת. מציין את שם המשבצת בעת שימוש בצל DOM. ב-React, בדרך כלל מושגת דפוס שווה ערך על ידי העברת JSX בתור props, למשל `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): בוליאני או null. אם מוגדר במפורש ל-`true` או `false`, מפעיל או משבית את בדיקת האיות.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): מספר. עוקף את התנהגות ברירת המחדל של לחצן Tab. [הימנע משימוש בערכים אחרים מלבד `-1` ו`0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): מחרוזת. מציין את טקסט הסבר הכלי עבור האלמנט.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): או `'yes'` או `'no'`. מעבר של `'no'` לא כולל את תוכן הרכיב מתרגום.

אתה יכול גם להעביר מאפיינים מותאמים אישית בתור props, למשל `mycustomprop="someValue"`. זה יכול להיות use מלא בעת שילוב עם ספריות של צד שלישי. שם התכונה המותאמת אישית חייב להיות באותיות קטנות ואסור להתחיל ב-`on`. הערך יומר למחרוזת. אם תעבור את `null` או `undefined`, המאפיין המותאם אישית יוסר.

אירועים אלה פועלים רק עבור [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) אלמנטים:

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): פונקציה [`Event` מטפל](#event-handler). מופעלת כאשר טופס מתאפס.
* `onResetCapture`: גרסה של `onReset` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): פונקציה [`Event` מטפל](#event-handler). מופעלת כאשר טופס נשלח.
* `onSubmitCapture`: גרסה של `onSubmit` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)

אירועים אלו מופעלים רק עבור האלמנטים [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). בניגוד לאירועי דפדפן, הם מבעבעים ב-React:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): פונקציה [`Event` מטפל](#event-handler). מופעלת כאשר ה-user מנסה לבטל את תיבת הדו-שיח.
* `onCancelCapture`: גרסה של `onCancel` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): פונקציית [`Event` מטפל](#event-handler). מופעלת כאשר דו-שיח נסגר.
* `onCloseCapture`: גרסה של `onClose` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)

אירועים אלו מופעלים רק עבור האלמנטים [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details). בניגוד לאירועי דפדפן, הם מבעבעים ב-React:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): פונקציית [`Event` מטפל](#event-handler). מופעלת כאשר ה-user מחליף את הפרטים.
* `onToggleCapture`: גרסה של `onToggle` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)

האירועים האלה מופעלים עבור [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), ו-[SVG `<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), ו-[SVG `<image>`] לא אוהבות את האלמנטים של הדפדפן, __TK_ React:

* `onLoad`: פונקציה [`Event` מטפל](#event-handler). נדלק כאשר המשאב נטען.
* `onLoadCapture`: גרסה של `onLoad` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר לא ניתן היה לטעון את המשאב.
* `onErrorCapture`: גרסה של `onError` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)

אירועים אלו מופעלים עבור משאבים כמו [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) ו-[`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). בניגוד לאירועי דפדפן, הם מבעבעים ב-React:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): פונקציה [`Event` מטפל](#event-handler). מופעל כאשר המשאב לא נטען במלואו, אך לא עקב שגיאה.
* `onAbortCapture`: גרסה של `onAbort` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר יש מספיק נתונים כדי להתחיל לשחק, אבל לא מספיק כדי לשחק עד הסוף ללא חציצה.
* `onCanPlayCapture`: גרסה של `onCanPlay` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): פונקציית [`Event` מטפל](#event-handler). מופעלת כאשר יש מספיק נתונים שסביר להניח שניתן להתחיל לשחק ללא חציצה עד הסוף.
* `onCanPlayThroughCapture`: גרסה של `onCanPlayThrough` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): פונקציה [`Event` מטפל](#event-handler). מופעל כאשר משך המדיה מתעדכן.
* `onDurationChangeCapture`: גרסה של `onDurationChange` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר המדיה התרוקנה.
* `onEmptiedCapture`: גרסה של `onEmptied` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): פונקציית [`Event` מטפל](#event-handler). מופעלת כאשר הדפדפן נתקל במדיה מוצפנת.
* `onEncryptedCapture`: גרסה של `onEncrypted` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): פונקציית [`Event` מטפל](#event-handler). מופעלת כשההשמעה נעצרת כי לא נותר מה לשחק.
* `onEndedCapture`: גרסה של `onEnded` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר לא ניתן היה לטעון את המשאב.
* `onErrorCapture`: גרסה של `onError` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר פריים ההשמעה הנוכחי נטען.
* `onLoadedDataCapture`: גרסה של `onLoadedData` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): פונקציית [`Event` מטפל](#event-handler). מופעלת כאשר מטא נתונים נטענו.
* `onLoadedMetadataCapture`: גרסה של `onLoadedMetadata` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): פונקציה [`Event` מטפל](#event-handler). מופעלת כשהדפדפן התחיל לטעון את המשאב.
* `onLoadStartCapture`: גרסה של `onLoadStart` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר המדיה הייתה paused.
* `onPauseCapture`: גרסה של `onPause` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר המדיה כבר לא paused.
* `onPlayCapture`: גרסה של `onPlay` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר המדיה מתחילה או מתחילה לפעול מחדש.
* `onPlayingCapture`: גרסה של `onPlaying` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): פונקציית [`Event` מטפל](#event-handler). מופעלת מעת לעת בזמן שהמשאב נטען.
* `onProgressCapture`: גרסה של `onProgress` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): פונקציית [`Event` מטפל](#event-handler). מופעלת כאשר קצב ההשמעה משתנה.
* `onRateChangeCapture`: גרסה של `onRateChange` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* `onResize`: פונקציה [`Event` מטפל](#event-handler). מופעל כאשר הסרטון משנה גודל.
* `onResizeCapture`: גרסה של `onResize` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): פונקציית [`Event` מטפל](#event-handler). מופעלת כאשר פעולת חיפוש מסתיימת.
* `onSeekedCapture`: גרסה של `onSeeked` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר פעולת חיפוש מתחילה.
* `onSeekingCapture`: גרסה של `onSeeking` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* פונקציה [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): מטפל [`Event`](#event-handler). מופעלת כשהדפדפן ממתין לנתונים אבל הוא לא ממשיך לטעון.
* `onStalledCapture`: גרסה של `onStalled` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): פונקציית [`Event` מטפל](#event-handler). מופעל בעת טעינת המשאב הושעתה.
* `onSuspendCapture`: גרסה של `onSuspend` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר זמן ההשמעה הנוכחי מתעדכן.
* `onTimeUpdateCapture`: גרסה של `onTimeUpdate` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): פונקציה [`Event` מטפל](#event-handler). מופעל כאשר עוצמת הקול השתנתה.
* `onVolumeChangeCapture`: גרסה של `onVolumeChange` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): פונקציית [`Event` מטפל](#event-handler). מופעל כאשר ההשמעה נעצרה עקב חוסר זמני בנתונים.
* `onWaitingCapture`: גרסה של `onWaiting` שנורה בשלב [לכידה.](/learn/responding-to-events#capture-phase-events)

#### אזהרות {/*common-caveats*/}

- אתה לא יכול לעבור גם את `children` וגם את `dangerouslySetInnerHTML` בו-זמנית.
- אירועים מסוימים (כמו `onAbort` ו-`onLoad`) אינם מבעבעים בדפדפן, אלא מבעבעים ב-React.

---

### `ref` פונקציית התקשרות חוזרת {/*ref-callback*/}

במקום אובייקט ref (כמו זה שמוחזר על ידי [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), אתה יכול להעביר פונקציה לתכונה `ref`.

```js
<div ref={(node) => console.log(node)} />
```

[ראה דוגמה לשימוש בהתקשרות חוזרת `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

כאשר הצומת `<div>` DOM יתווסף למסך, React יתקשר ל-`ref` השיחה חזרה עם ה-DOM `node` כארגומנט. כאשר הצומת `<div>` DOM יוסר, React יתקשר ל-`ref` השיחה חזרה שלך עם `null`.

React יתקשר גם ל-`ref` השיחה חזרה שלך בכל פעם שתעבור *שונה* `ref` התקשרות חוזרת. בדוגמה שלמעלה, `(node) => { ... }` היא פונקציה שונה בכל עיבוד. כאשר הרכיב שלך מעבד מחדש, הפונקציה *הקודמת* תיקרא עם `null` בתור הארגומנט, והפונקציה *הבאה* תיקרא עם הצומת DOM.

#### פרמטרים {/*ref-callback-parameters*/}

* `node`: צומת DOM או `null`. React יעביר לך את הצומת DOM כשהשופט יתחבר, ו`null` כשהשופט יתנתק. אלא אם תעביר את אותה הפניה לפונקציה עבור ה-`ref` ההתקשרות חזרה בכל עיבוד, ה-callback ינותק באופן זמני ויצורף מחדש במהלך כל רינדור מחדש של הרכיב.

#### מחזירה {/*returns*/}

אל תחזיר דבר מההתקשרות חזרה `ref`.

---

### React אובייקט אירוע {/*react-event-object*/}

מטפלי האירועים שלך יקבלו אובייקט אירוע *React.* זה ידוע גם כ"אירוע סינתטי".

```js
<button onClick={e => {
  console.log(e); // React event object
}} />
```

זה תואם את אותו תקן כמו אירועי ה-DOM הבסיסיים, אך מתקן כמה אי-התאמות בדפדפן.

חלק מאירועי React אינם ממופים ישירות לאירועים המקוריים של הדפדפן. לדוגמה ב-`onMouseLeave`, `e.nativeEvent` יצביע על אירוע `mouseout`. המיפוי הספציפי אינו חלק מה-API הציבורי ועשוי להשתנות בעתיד. אם אתה צריך את אירוע הדפדפן הבסיסי מסיבה כלשהי, קרא אותו מ-`e.nativeEvent`.

#### מאפיינים {/*react-event-object-properties*/}

React אובייקטי אירועים מיישמים חלק מהמאפיינים הסטנדרטיים של [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): בוליאני. מחזירה אם האירוע מבעבע דרך ה-DOM. 
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): בוליאני. מחזירה אם ניתן לבטל את האירוע.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): צומת DOM. מחזיר את הצומת אליו מחובר המטפל הנוכחי בעץ React.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): בוליאני. מחזירה אם נקרא `preventDefault`.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): מספר. מחזיר באיזה שלב האירוע נמצא כעת.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): ערך בוליאני. מחזירה אם האירוע יזם על ידי user.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): צומת DOM. מחזירה את הצומת שבו התרחש האירוע (שיכול להיות ילד מרוחק).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): מספר. מחזירה את הזמן שבו התרחש האירוע.

בנוסף, אובייקטי אירוע React מספקים את המאפיינים הבאים:

* `nativeEvent`: A DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). אובייקט אירוע הדפדפן המקורי.

#### שיטות {/*react-event-object-methods*/}

React אובייקטי אירועים מיישמים חלק מהשיטות הסטנדרטיות [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): מונע את פעולת ברירת המחדל של הדפדפן עבור האירוע.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): עוצר את התפשטות האירוע דרך עץ React.

בנוסף, אובייקטי אירוע React מספקים את השיטות הבאות:

* `isDefaultPrevented()`: מחזירה ערך בוליאני המציין אם `preventDefault` נקרא.
* `isPropagationStopped()`: מחזירה ערך בוליאני המציין אם `stopPropagation` נקרא.
* `persist()`: לא used עם React DOM. עם React Native, קרא לזה כדי לקרוא את מאפייני האירוע לאחר האירוע.
* `isPersistent()`: לא used עם React DOM. עם React Native, מחזיר אם `persist` נקרא.

#### אזהרות {/*react-event-object-caveats*/}

* הערכים של `currentTarget`, `eventPhase`, `target` ו-`type` משקפים את הערכים שמצפה לו הקוד React. מתחת למכסה המנוע, React מצרף מטפלי אירועים בשורש, אך זה לא בא לידי ביטוי באובייקטי אירוע React. לדוגמה, ייתכן ש-`e.currentTarget` לא יהיה זהה ל-`e.nativeEvent.currentTarget` הבסיסי. עבור אירועים ממולאים, `e.type` (React סוג אירוע) עשוי להיות שונה מ-`e.nativeEvent.type` (סוג בסיס).

---

### `AnimationEvent` פונקציית מטפל {/*animationevent-handler*/}

סוג מטפל באירועים עבור האנימציה [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) אירועים.

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### פרמטרים {/*animationevent-handler-parameters*/}

* `e`: אובייקט [React אירוע](#react-event-object) עם [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) מאפיינים נוספים:
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` פונקציית מטפל {/*clipboadevent-handler*/}

סוג מטפל באירועים עבור [לוח API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) אירועים.

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### פרמטרים {/*clipboadevent-handler-parameters*/}

* `e`: אובייקט [React אירוע](#react-event-object) עם [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) מאפיינים נוספים:

* [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` פונקציית מטפל {/*compositionevent-handler*/}

סוג מטפל באירועים עבור [עורך שיטת הקלט (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) אירועים.

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### פרמטרים {/*compositionevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`CompositionEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) מאפיינים נוספים:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` פונקציית מטפל {/*dragevent-handler*/}

סוג מטפל באירועים עבור [HTML גרור ושחרר API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) אירועים.

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### פרמטרים {/*dragevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`DragEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) מאפיינים נוספים:
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

הוא כולל גם את המאפיינים [`MouseEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) שעברו בירושה:

* [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

הוא כולל גם את המאפיינים [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)) שעברו בירושה:

* [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` פונקציית מטפל {/*focusevent-handler*/}

סוג מטפל באירועים עבור אירועי המיקוד.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[ראה דוגמה.](#handling-focus-events)

#### פרמטרים {/*focusevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`FocusEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) מאפיינים נוספים:
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

הוא כולל גם את המאפיינים [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)) שעברו בירושה:

* [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` פונקציית מטפל {/*event-handler*/}

סוג מטפל באירועים עבור אירועים גנריים.

#### פרמטרים {/*event-handler-parameters*/}

* `e`: אובייקט [React אירוע](#react-event-object) ללא מאפיינים נוספים.

---

### `InputEvent` פונקציית מטפל {/*inputevent-handler*/}

סוג מטפל באירוע עבור האירוע `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### פרמטרים {/*inputevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`InputEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) מאפיינים נוספים:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` פונקציית מטפל {/*keyboardevent-handler*/}

סוג מטפל באירועים עבור אירועי מקלדת.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[ראה דוגמה.](#handling-keyboard-events)

#### פרמטרים {/*keyboardevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) מאפיינים נוספים:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

הוא כולל גם את המאפיינים [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)) שעברו בירושה:

* [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` פונקציית מטפל {/*mouseevent-handler*/}

סוג מטפל באירועים עבור אירועי mouse.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[ראה דוגמה.](#handling-mouse-events)

#### פרמטרים {/*mouseevent-handler-parameters*/}

* `e`: אובייקט [React אירוע](#react-event-object) עם [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) מאפיינים נוספים:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

הוא כולל גם את המאפיינים [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)) שעברו בירושה:

* [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` פונקציית מטפל {/*pointerevent-handler*/}

סוג מטפל באירועים עבור [אירועי מצביע.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[ראה דוגמה.](#handling-pointer-events)

#### פרמטרים {/*pointerevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) מאפיינים נוספים:
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

הוא כולל גם את המאפיינים [`MouseEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) שעברו בירושה:

* [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

הוא כולל גם את המאפיינים [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)) שעברו בירושה:

* [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` פונקציית מטפל {/*touchevent-handler*/}

סוג מטפל באירועים עבור [מגע אירועים.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### פרמטרים {/*touchevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`TouchEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) מאפיינים נוספים:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
הוא כולל גם את המאפיינים [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)) שעברו בירושה:

* [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` פונקציית מטפל {/*transitionevent-handler*/}

סוג מטפל באירועים עבור אירועי המעבר CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### פרמטרים {/*transitionevent-handler-parameters*/}

* `e`: אובייקט [React אירוע](#react-event-object) עם [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) מאפיינים נוספים:
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` פונקציית מטפל {/*uievent-handler*/}

סוג מטפל באירועים עבור אירועי ממשק משתמש כלליים.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### פרמטרים {/*uievent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) מאפיינים נוספים:
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` פונקציית מטפל {/*wheelevent-handler*/}

סוג מטפל באירוע עבור האירוע `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### פרמטרים {/*wheelevent-handler-parameters*/}

* `e`: [React אובייקט אירוע](#react-event-object) עם [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) מאפיינים נוספים:
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


הוא כולל גם את המאפיינים [`MouseEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)) שעברו בירושה:

* [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

הוא כולל גם את המאפיינים [`UIEvent`] (https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)) שעברו בירושה:

* [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## שימוש {/*usage*/}

### החלת CSS סגנונות {/*applying-css-styles*/}

ב-React, אתה מציין מחלקה CSS עם [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) זה עובד כמו התכונה `class` ב-HTML:

```js
<img className="avatar" />
```

לאחר מכן אתה כותב את הכללים CSS עבורו בקובץ CSS נפרד:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React אינו קובע כיצד להוסיף קבצי CSS. במקרה הפשוט ביותר, תוסיף תג [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) ל-HTML שלך. אם אתה use כלי בנייה או מסגרת, עיין בתיעוד שלו כדי ללמוד כיצד להוסיף קובץ CSS לפרויקט שלך.

לפעמים, ערכי הסגנון תלויים בנתונים. השתמש בתכונה `style` כדי להעביר כמה סגנונות באופן דינמי:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


בדוגמה שלמעלה, `style={{}}` אינו תחביר מיוחד, אלא אובייקט `{}` רגיל בתוך `style={ }` [JSX סוגרים מסולסלים.](/learn/javascript-in-jsx-with-curly-braces) אנו ממליצים להשתמש רק בתכונה `style` 4__ כאשר המשתנים __T שלך תלויים בסגנונות TK.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### כיצד להחיל מספר מחלקות CSS באופן מותנה? {/*how-to-apply-multiple-css-classes-conditionally*/}

כדי להחיל שיעורים CSS באופן מותנה, עליך להפיק את המחרוזת `className` בעצמך באמצעות JavaScript.

לדוגמה, `className={'row ' + (isSelected ? 'selected': '')}` יפיק `className="row"` או `className="row selected"` תלוי אם `isSelected` הוא `true`.

כדי להפוך את זה לקריאה יותר, אתה יכול use ספריית עוזר זעירה כמו [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

זה נוח במיוחד אם יש לך מספר שיעורים מותנים:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### מניפולציה של צומת DOM עם ref {/*manipulating-a-dom-node-with-a-ref*/}

לפעמים, תצטרך להשיג את צומת הדפדפן DOM המשויך לתג ב-JSX. לדוגמה, אם ברצונך למקד `<input>` בעת לחיצה על כפתור, עליך לקרוא ל-[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) בצומת `<input>` DOM של הדפדפן.

כדי להשיג את הצומת DOM של הדפדפן עבור תג, [הכרז על ref](/reference/react/useRef) והעביר אותו כתכונה `ref` לתג זה:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React יכניס את הצומת DOM לתוך `inputRef.current` לאחר שהוא יועבר למסך.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

קרא עוד על [מניפולציה של DOM עם refs](/learn/manipulating-the-dom-with-refs) ועל [בדוק דוגמאות נוספות.](/reference/react/useRef#examples-dom)

למקרים מתקדמים יותר של use, התכונה `ref` מקבלת גם [פונקציית התקשרות חוזרת.](#ref-callback)

---

### הגדרה מסוכנת של HTML {/*dangerously-setting-the-inner-html*/} הפנימית

אתה יכול להעביר מחרוזת HTML גולמית לאלמנט כך:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**זה מסוכן. בדומה למאפיין הבסיסי DOM [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), עליך לנקוט משנה זהירות! אלא אם כן הסימון מגיע ממקור מהימן לחלוטין, זה טריוויאלי להציג פגיעות [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) בדרך זו.**

לדוגמה, אם אתה use ספריית Markdown הממירה את Markdown ל-HTML, אתה סומך על כך שהמנתח שלה אינו מכיל באגים, וה-user רואה רק את הקלט שלו, אתה יכול להציג את ה-HTML שנוצר כך:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

יש ליצור את האובייקט `{__html}` קרוב ככל האפשר למקום שבו ה-HTML נוצר, כמו שהדוגמה לעיל עושה בפונקציה `renderMarkdownToHTML`. זה מבטיח שכל HTML הגולמי שהוא used בקוד שלך מסומן באופן מפורש ככזה, ושרק משתנים שאתה מצפה שיכילו HTML מועברים אל `dangerouslySetInnerHTML`. לא מומלץ ליצור את האובייקט בשורה כמו `<div dangerouslySetInnerHTML={{__html: markup}} />`.

כדי לראות מדוע עיבוד שרירותי של HTML הוא מסוכן, החלף את הקוד למעלה בזה:

```js {1-4,7,8}
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

הקוד המוטמע ב-HTML יפעל. האקר יכול use את חור האבטחה הזה כדי לגנוב מידע user או לבצע פעולות בשמם. **רק use `dangerouslySetInnerHTML` עם נתונים מהימנים ומחוטאים.**

---

### טיפול באירועי mouse {/*handling-mouse-events*/}

דוגמה זו מציגה כמה [mouse אירועים] נפוצים (#mouseevent-handler) ומתי הם יורים.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### טיפול באירועי מצביע {/*handling-pointer-events*/}

דוגמה זו מציגה כמה [אירועי מצביע] נפוצים (#pointerevent-handler) ומתי הם פועלים.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### טיפול באירועי מיקוד {/*handling-focus-events*/}

ב-React, בועה [פוקוס אירועים](#focusevent-handler). אתה יכול use את `currentTarget` ואת `relatedTarget` כדי להבדיל אם אירועי המיקוד או הטשטוש מקורם מחוץ לאלמנט האב. הדוגמה מראה כיצד לזהות מיקוד של ילד, מיקוד של אלמנט האב וכיצד לזהות מיקוד שנכנס או עוזב את כל המשנה.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### טיפול באירועי מקלדת {/*handling-keyboard-events*/}

דוגמה זו מציגה כמה [אירועי מקלדת] נפוצים (#keyboardevent-handler) ומתי הם פועלים.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
