---
id: dom-elements
title: DOM Elements
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Common components (e.g. `<div>`)](https://react.dev/reference/react-dom/components/common)
> - [`<input>`](https://react.dev/reference/react-dom/components/input)
> - [`<option>`](https://react.dev/reference/react-dom/components/option)
> - [`<progress>`](https://react.dev/reference/react-dom/components/progress)
> - [`<select>`](https://react.dev/reference/react-dom/components/select)
> - [`<textarea>`](https://react.dev/reference/react-dom/components/textarea)

</div>

React מיישמת מערכת DOM ללא-תלות בדפדפן עבור ביצועים ותאימות לדפדפנים שונים. ניצלנו את ההזדמנות על מנת לנקות מספר בעיות במימוש ה-DOM של הדפדפן.

ב-React, כל המאפיינים (properties) והתכונות (attributes) של ה-DOM (כולל מנהלי אירועים) צריכים להיות camelCased. לדוגמה, תכונת ה-`tabindex` של HTML מקבילה לתכונה `tabIndex` ב-React. המקרים היוצאים מן הכלל הם `aria-*` ו-`data-*`, שצריכים להיות באותיות קטנות. לדוגמה, נוכל להשאיר את `aria-label` בתור `aria-label`.

## הבדלים בתכונות {#differences-in-attributes}

ישנן מספר תכונות שעובדות בצורה שונה בין HTML ו-React:

### checked {#checked}

התכונה `checked` נתמכת בקומפוננטות `<input>` מסוג `checkbox` או `radio`. אתה יכול להשתמש בה על מנת לקבוע האם הקומפוננטה מסומנת. דבר זה שימושי לבניית קומפוננטות נשלטות. `defaultChecked` היא המקבילה הלא נשלטת, שקובעת האם הקומפוננטה מסומנת בזמן שהיא mounted בפעם הראשונה.

### className {#classname}

כדי להוסיף מחלקת CSS, נשתמש בתכונת ה-`className`. העניין נוגע לכל אלמנטי ה-DOM וה-SVG הרגילים כמו `<div>`, `<a>` ואחרים.

אם אתה משתמש ב-React עם Web Components (דבר שאיננו נפוץ כל כך), השתמש בתכונת ה-`class` במקום.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` היא החלופה של React לשימוש ב-`innerHTML` ב-DOM של הדפדפן. באופן כללי, קביעת HTML מהקוד היא מסוכנת מכיוון שזה קל בטעות לחשוף את המשתמשים שלך ל[מתקפת XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) .לעומת זאת, אפשר לכתוב HTML ישירות מ-React, אבל אתה צריך לכתוב `dangerouslySetInnerHTML` ולהעביר אובייקט עם מפתח `__html`, על מנת להזכיר לעצמך שזה מסוכן. לדוגמה:

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

מאחר ו-`for` היא מילה שמורה ב-JavaScript, אלמנטי React משתמשים ב-`htmlFor` במקום.

### onChange {#onchange}

אירוע ה-`onChange` מתנהג כמו שהיית מצפה: בכל פעם ששדה טופס משתנה, אירוע זה נורה. אנחנו בכוונה לא משתמשים בהתנהגות המובנית בדפדפן בגלל ש-`onChange` לא מתנהג כמו שהוא אמור להתנהג, ו-React מסתמכת על אירוע זה שיטפל בקלטי משתמש בזמן אמת.

### selected {#selected}

אם אתה רוצה לסמן `<option>` כמסומן, התייחס לערך של האופציה ב- `<value>` של ה`<select>` שלו במקום.
ראה ["The select Tag"](/docs/forms.html#the-select-tag) לקבלת מידע מפורט

### style {#style}

>שימו לב:
>
>כמה דוגמאות בתיעוד משתמשות ב-`style` מטעמי נוחות, אבל **שימוש בתכונה `style` בתור האפשרות העיקרית לעיצוב קומפוננטות איננה מומלצת באופן כללי.** ברוב המקרים, [`className`](#classname) צריכה להיות בשימוש כדי להתייחס למחלקות CSS שהוגדרו בקבצי CSS חיצוניים. ברוב המקרים שמשתמשים ב-`style` באפליקציות React המטרה היא להוסיף עיצובים שחושבו באופן דינמי בזמן הרינדור. ראה [FAQ: עיצוב ו-CSS](/docs/faq-styling.html).

תכונת ה-`style` מקבלת אובייקט JavaScript עם מאפייני camelCased במקום מחרוזת CSS. התנהגות התכונה עקבית עם מאפיין `style` של ה-DOM ב-JavaScript, אך היא יותר יעילה, ומונעת חורי אבטחת XSS. לדוגמה:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

הערה:  styles הם לא autoprefixed. על מנת לתמוך בדפדפנים ישנים, אתה צריך לספק  style properties מקבילים:

```js
const divStyle = {
  WebkitTransition: 'all', // שים לב לאות 'W' הגדולה
  msTransition: 'all' // 'ms' הוא ה-prefix היחיד באותיות קטנות
};

function ComponentWithTransition() {
  return <div style={divStyle}>זה צריך לעבוד בין דפדפנים</div>;
}
```

מפתחות עיצוב הם camelCased על מנת להיות עקביים עם גישה למאפיינים על צמתי ה-DOM מ-JavaScript (לדוגמה `node.style.backgroundImage`). קדימויות של ספקים [ששונים מ-`ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) צריכים להתחיל עם אות גדולה. זו הסיבה ש-`WebkitTransition` מתחיל עם אות גדולה.

React תוסיף באופן אוטומטי סיומת  "px" לכמה מאפייני סגנון. אם אתה רוצה להשתמש ביחידות מידה אחרות חוץ מ-"px", נקוב בערך כמחרוזת עם יחידת המידה הרצויה. לדוגמה:

```js
// תוצאה: '10px'
<div style={{ height: 10 }}>
  שלום עולם!
</div>

// תוצאה: '10%'
<div style={{ height: '10%' }}>
  שלום עולם!
</div>
```

לא כל מאפייני העיצוב מומרים למחרוזות פיקסלים. כמה מהם נשארים ללא יחידת מידה (לדוגמה `zoom`, `order`, `flex`). רשימה מלאה של מאפיינים ללא יחידות מידה נמצאת [כאן](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

בדרך כלל, ישנה אזהרה כשאלמנט עם ילדים מסומן כ-`contentEditable`, בגלל שזה לא יעבוד. תכונה זו עוצרת את האזהרה. אל תשתמש בזה אלא אם אתה בונה ספרייה כמו [Draft.js](https://facebook.github.io/draft-js/) שמנהלת `contentEditable` באופן ידני.

### suppressHydrationWarning {#suppresshydrationwarning}

אם אתה משתמש ברינדור בצד-שרת ב-React, בדרך כלל יש אזהרה כשהשרת והלקוח מרנדרים תוכן שונה. לעומת זאת, במקרים נדירים, זה קשה מאוד עד בלתי אפשרי להבטיח תוצאה זהה. לדוגמה, חותמות זמן אמורות להיות שונות בשרת ובלקוח.

<<<<<<< HEAD
אם אתה קובע את `suppressHydrationWarning` כ-`true`, React לא תזהיר אותך לגבי אי התאמה בתכונות ובתוכן של האלמנט. דבר זה עובד בעומק של רמה אחת בלבד, ומיועד לשימוש כפתח מילוט. אל תשתמש בזה יותר מדי. ניתן לקרוא עוד על hydration ב-[`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate).
=======
If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. You can read more about hydration in the [`ReactDOM.hydrateRoot()` documentation](/docs/react-dom-client.html#hydrateroot).
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

### value {#value}

תכונת ה-`value` נתמכת על ידי הקומפוננטות `<input>`,  `<select>` ו-`<textarea>`. ניתן להשתמש בה כדי לקבוע את ערך הקומפוננטה. זה שימושי לבניית קומפוננטות נשלטות. `defaultValue` הוא המקביל הבלתי נשלט, שקובע את ערך הקומפוננטה כשהיא mounted לראשונה.

## כל תכונות ה-HTML הנתמכות: {#all-supported-html-attributes}

החל מ-React 16, כל תכונת DOM סטנדרטית או [מותאמת אישית](/blog/2017/09/08/dom-attributes-in-react-16.html), נתמכת באופן מלא.

React תמיד סיפקה ממשק משתמש ממוקד JavaScript ל-DOM. מכיוון שקומפוננטות React בדרך כלל מקבלות גם props מותאמות אישית וגם כאלה שקשורות ל-DOM, React משתמשת במוסכמת ה-`camelCase` בדיוק כמו ממשקי המשתמש של ה-DOM:

```js
<div tabIndex={-1} />      // כמו node.tabIndex DOM API
<div className="Button" /> // כמו node.className DOM API
<input readOnly={true} />  // כמו node.readOnly DOM API
```

ה-props הללו עובדים באופן דומה לתכונות ה-HTML המקבילות, עם הוצאה מן הכלל של המקרים המיוחדים המתועדים לעיל.

חלק מתכונות ה-DOM הנתמכות על ידי React כוללות:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

באופן דומה, כל תכונות ה-SVG נתמכות באופן מלא:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

ניתן גם להשתמש בתכונות שמותאמות באופן אישי, כל עוד הן באותיות קטנות. 
