---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

מדריך עזר זה מסביר על מעטפת ה-`SyntheticEvent` המהווה חלק ממערכת האירועים של React. ראה את מדריך [טיפול באירועים](/docs/handling-events.html) על מנת ללמוד עוד.

## סקירה כללית {#overview}

מטפלי האירועים שלך מקבלים מופעים של `SyntheticEvent`, מעטפת תאימות בין דפדפנים מסביב לאירוע המקורי של הדפדפן. יש לה את אותו ממשק כמו האירוע המקורי, כולל `stopPropagation()` ו-`preventDefault()`, למעט זה שהאירועים עובדים באופן זהה בין כל הדפדפנים.

אם אתה מגלה שאתה זקוק לאירוע הדפדפן הבסיסי מסיבה כלשהי, פשוט השתמש במאפיין `nativeEvent` על מנת לקבל אותו. האירועים הסינטטיים שונים ולא ממפים לאירועים של הדפדפן. לדוגמה ב`onMouseLeave`, האירוע `event.nativeEvent` יצביע על האירוע `mouseout`. המיפוי הספציפי הוא לא חלק מהpublic API ויכול להשתנות בכל זמן. כל אובייקט `SyntheticEvent` מכיל את התכונות הבאות:

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
> מגרסה v17, שימוש ב- `e.persist()` לא עושה כלום בגלל שה- `SyntheticEvent` לא [מצורף יותר](/docs/legacy-event-pooling.html).

> הערה:
>
> נכון לגרסה v0.14, החזרת `false` מ-event handler יותר לא יפסיק התרבות event. במקום זאת, `e.stopPropagation()` או `e.preventDefault()` אמורים לפעול ידנית, כראוי. 

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

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

נקרא ל-`onFocus` כשהאלמנט (או אלמנט כלשהו בתוכו) מקבל פוקוס. לדוגמה, נקרא לו כשהמשתמש לוחץ על קלט טקסט.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

נקרא ל-`onBlur` כשהפוקוס עזב את האלמנט (או אלמנט כלשהו בתוכו). לדוגמה, נקרא לו כשהמשתמש לוחץ על נקודה מחוץ לקלט הטקסט שבפוקוס. 

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

<<<<<<< HEAD
#### זיהוי כניסה ויציאה של פוקוס {#detecting-focus-entering-and-leaving}
=======
#### Detecting Focus Entering and Leaving {#detecting-focus-entering-and-leaving}
>>>>>>> 30baecf59de28a8cd3c91a2cd878e3822f864061

ניתן להשתמש ב-`currentTarget` וב-`relatedTarget` להבדיל אם מקורם של אירועי הפוקוס או הטשטוש _מחוץ_ לאלמנט ההורה. הנה דמו שתוכל להעתיק ולהדביק שמראה איך לזהות פוקוס על אלמנט צאצא, פוקוס על האלמנט עצמו, ופוקוס כשנכנסים או עוזבים את כל התת-עץ. 

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // לא מופעל כשמחליפים פוקוס בין ילדים
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // לא מופעל כשמחליפים פוקוס בין ילדים
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
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
>הערה
>
>החל מגרסה 17, `onScroll` **לא מבעבע** בריאקט. זה תואם את התנהגות הדפדפן ומונע בלבול כשתת אלמנט שהוא scrollable יורה events על הורה רחוק.


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
