---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

מדריך עזר זה מסביר על מעטפת ה-`SyntheticEvent` המהווה חלק ממערכת האירועים של React. ראה את מדריך [טיפול באירועים](/docs/handling-events.html) על מנת ללמוד עוד.

## סקירה כללית {#overview}

<<<<<<< HEAD
מטפלי האירועים שלך מקבלים מופעים של `SyntheticEvent`, מעטפת תאימות בין דפדפנים מסביב לאירוע המקורי של הדפדפן. יש לה את אותו ממשק כמו האירוע המקורי, כולל `stopPropagation()` ו-`preventDefault()`, למעט זה שהאירועים עובדים באופן זהה בין כל הדפדפנים.

אם אתה מגלה שאתה זקוק לאירוע הדפדפן הבסיסי מסיבה כלשהי, פשוט השתמש במאפיין `nativeEvent` על מנת לקבל אותו. כל אובייקט `SyntheticEvent` מכיל את התכונות הבאות:
=======
Your event handlers will be passed instances of `SyntheticEvent`, a cross-browser wrapper around the browser's native event. It has the same interface as the browser's native event, including `stopPropagation()` and `preventDefault()`, except the events work identically across all browsers. 

If you find that you need the underlying browser event for some reason, simply use the `nativeEvent` attribute to get it. The synthetic events are different from, and do not map directly to, the browser's native events. For example in `onMouseLeave` `event.nativeEvent` will point to a `mouseout` event. The specific mapping is not part of the public API and may change at any time. Every `SyntheticEvent` object has the following attributes:
>>>>>>> 657658aa1f19c65e35055ddca4452c98d569552f

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> הערה:
>
> החל מגרסה 0.14, החזרת `false` ממטפל אירועים כבר לא תעצור התפשטות אירועים. לחלופין, `e.stopPropagation()` או `e.preventDefault()` צריכים להיות מופעלים ידנית, בהתאם לצורך.

### איגוד אירועים {#event-pooling}

`SyntheticEvent` הוא מאוגד. זה אומר שייעשה שימוש חוזר באובייקט ה-`SyntheticEvent` וכל מאפייניו יבוטלו לאחר שה-callback של האירוע יופעל.
- דבר זה קורה בגלל סיבות שקשורות לביצועים.
- כתוצאה מכך, לא ניתן לגשת לאירוע בצורה אסינכרונית. 


```javascript
function onClick(event) {
  console.log(event); // => אובייקט מבוטל.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // לא יעבוד. this.state.clickEvent יכיל רק ערכי null.
  this.setState({clickEvent: event});

  // עדיין ניתן לייצא את מאפייני האירוע.
  this.setState({eventType: event.type});
}
```

> הערה:
>
> אם אתה רוצה לגשת למאפייני האירוע בצורה אסינכרונית, עליך לעשות זאת באמצעות קריאה ל-`event.persist()` על האירוע, דבר שיסיר את האירוע הסינתטי מהאיגוד ויאפשר הפניות לאירוע להישמר על ידי קוד המשתמש.

## אירועים נתמכים {#supported-events}

React מנרמלת אירועים כך שיהיו להם מאפיינים עקביים בין דפדפנים שונים.

מטפלי האירועים שלהלן מופעלים על ידי אירוע בשלב הבעבוע. על מנת לרשום מטפל אירועים לשלב הלכידה, הוסף `Capture` לשם האירוע; לדוגמה, במקום שימוש ב-`onClick`, עליך להשתמש ב-`onClickCapture` על מנת לטפל באירוע ההקלקה בשלב הלכידה.

- [אירועי clipboard](#clipboard-events)
- [אירועי קומפוזיציה](#composition-events)
- [אירועי מקלדת](#keyboard-events)
- [אירועי פוקוס](#focus-events)
- [אירועי טפסים](#form-events)
- [אירועים גנריים](#generic-events)
- [אירועי עכבר](#mouse-events)
- [אירועי מצביע](#pointer-events)
- [אירועי בחירה](#selection-events)
- [אירועי טאץ'](#touch-events)
- [אירועי ממשק משתמש](#ui-events)
- [אירועי גלגל](#wheel-events)
- [אירועי מדיה](#media-events)
- [אירועי תמונה](#image-events)
- [אירועי אנימציה](#animation-events)
- [אירועי מעבר](#transition-events)
- [אירועים אחרים](#other-events)

* * *

## סימוכין {#reference}

### אירועי clipboard {#clipboard-events}

שמות אירועים:

```
onCopy onCut onPaste
```

מאפיינים:

```javascript
DOMDataTransfer clipboardData
```

* * *

### אירועי קומפוזיציה {#composition-events}

שמות אירועים:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

מאפיינים:

```javascript
string data

```

* * *

### אירועי מקלדת {#keyboard-events}

שמות אירועים:

```
onKeyDown onKeyPress onKeyUp
```

מאפיינים:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

מאפיין ה-`key` יכול לקבל כל ערך שמתועד ב[מפרט אירועי ה-DOM בשלב 3](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### אירועי פוקוס {#focus-events}

שמות אירועים:

```
onFocus onBlur
```

אירועי הפוקוס הללו עובדים על כל האלמנטים ב-DOM של React, לא רק אלמנטי טפסים.

מאפיינים:

```javascript
DOMEventTarget relatedTarget
```

* * *

### אירועי טפסים {#form-events}

שמות אירועים:

```
onChange onInput onInvalid onReset onSubmit 
```

לקבלת מידע נוסף על אירוע ה-onChange, ראה [טפסים](/docs/forms.html).

* * *

### אירועיים גנריים {#generic-events}

Event names:

```
onError onLoad
```

* * *


### אירועי עכבר {#mouse-events}

שמות אירועים:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

אירועי ה-`onMouseEnter` ו-`onMouseLeave` מופצים מהאלמנט שהעכבר עזב אל האלמנט שאליו העכבר נכנס במקום בעבוע רגיל ואין להם שלב לכידה.

מאפיינים:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### אירועי מצביע {#pointer-events}

שמות אירועים:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

אירועי ה-`onPointerEnter` ו-`onPointerLeave` מופצים מהאלמנט שהעכבר עזב אל האלמנט שאליו העכבר נכנס במקום בעבוע רגיל ואין להם שלב לכידה.

מאפיינים:

כמו שהוגדר ב-[W3 spec](https://www.w3.org/TR/pointerevents/), אירועי מצביע מרחיבים [אירועי עכבר](#mouse-events) עם המאפיינים הבאים:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

הערה לגבי תמיכה בדפדנים:

אירועי מצביע עדיין לא נתמכים בכל הדפדפנים (בזמן כתיבת מאמר זה, הדפדנים הנתמכים הם: Chrome, Firefox, Edge, ו-Internet Explorer). באופן מכוון React לא מממשת polyfill לתמיכה בדפדפנים אחרים כי polyfill תאימות סטנדרטית יגדיל משמעותית את גודל הבאנדל של `react-dom`.

אם האפליקצייה שלך דורשת אירועי מצביע, אנו ממליצים שתוסיף polyfill אירועי מצביע מצד שלישי.

* * *

### אירועי בחירה {#selection-events}

שמות אירועים:

```
onSelect
```

* * *

### אירועי טאץ' {#touch-events}

שמות אירועים:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

מאפיינים:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### אירועי ממשק משתמש {#ui-events}

שמות אירועים:

```
onScroll
```

מאפיינים:

```javascript
number detail
DOMAbstractView view
```

* * *

### אירועי גלגל {#wheel-events}

שמות אירועים:

```
onWheel
```

מאפיינים:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### אירועי מדיה {#media-events}

שמות אירועים:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### אירועי תמונה {#image-events}

שמות אירועים:

```
onLoad onError
```

* * *

### אירועי אנימציה {#animation-events}

שמות אירועים:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

מאפיינים:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### אירועי מעבר {#transition-events}

שמות אירועים:

```
onTransitionEnd
```

מאפיינים:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### אירועים אחרים {#other-events}

שמות אירועים:

```
onToggle
```
