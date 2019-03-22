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

React מיישם ממשק DOM בשביל ביצועים ותמיכה בין דפדפנים. ניצלנו את ההזדמנות על מנת לתקן כמה בעיות ביישום הDOM של הדפדפן.

בReact, כל התכונות והproperties- ( כולל event handles) צריכים להיות camelCased. לדוגמה, תכונת הHTML tabindex מקבילה לתכונה tabIndex בReact. המקרים היוצאים מן הכלל הם aria-* וdata-*, שצריכים להיות באותיות קטנות. לדוגמה, נוכל להשאיר את aria-label כaria-label.

## הבדלים בתכונות {#differences-in-attributes}

ישנן מספר תכוננות שעובדות בצורה שונה בין HTML וReact:

### checked {#checked}

התכונה `checked` נתמכת בקומפוננטות `<input>` מסוג `checkbox` או `radio`. אתה יכול להשתמש בזה על מנת לקבוע האם הקומפוננטה מסומנת. דבר זה שימושי לבניית קומפוננטות נשלטות. `defaultChecked` היא המקבילה הלא נשלטת, שקובעת האם הקומפוננטה מסומנת בזמן שהיא mounted.

### className {#classname}

כדי להוסיף מחלקת CSS, נשתמש בתכונת ה `className`. זה נוגע לכל אלמנטי הDOM וSVG כמו `<div>`,  `<a>` ועוד.
אם אתה משתמש בReact עם Web Components (דבר שלא נפוץ כל כך), השתמש בתכונת הclass במקום.


### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` היא התחלופה של React לשימוש ב`innerHTML` בDOM של הדפדפן. באופן כללי, קביעת HTML לא בקוד היא מסוכנת מכיוון שזה קל בטעות לחשוף את המשתמשים שלך ל[מתקפת XSS))] (https://en.wikipedia.org/wiki/Cross-site_scripting). לעומת זאת, אפשר לכתוב HTML ישירות מReact, אבל אתה צריך לכתוב `dangerouslySetInnerHTML` ולהעביר אובייקט עם מפתח `__html`, על מנת להזכיר לעצמך שזה מסוכן. לדוגמה:

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

מאחר ו`for` היא מילה שמורה בJavaScript, אלמנטי React משתמשים בhtmlFor במקום.

### onChange {#onchange}

Event ה`onChange` מתנהג כמו שהיית מצפה: כששדה טופס משתנה, event זה נורה. אנחנו בכוונה לא משתמשים בהתנהגות הבנויה בדפדפן בגלל ש`onChange` הוא לא מתנהג כמו שהוא אמור להתנהג, וReact מסתמכת עליו שיטפל בקלטי משתמש בזמן אמת.

### selected {#selected}

התכונה selected נתמכת על ידי קומפוננטות `<option>`. ניתן להשתמש בתכונה על מנת לקבוע האם קומפוננטה נבחרה. דבר זה הוא שימושי לבניית קומפוננטות נשלטות.

### style {#style}

>שימו לב:
>
>כמה דוגמאות בדוקומנטציה משתמשות ב`style` מטעמי נוחות, אבל **שימוש ב`style` תמיד על מנת לעצב קומפוננטות הוא לא מומלץ.** ברוב המקרים, [`className`](#classname) צריכה להיות זאתי שמתייחסת למחלקות CSS שהוגדרו בקבצי CSS חיצוניים. ברוב המקרים שמשתמשים ב`style` בReact המטרה היא להוסיף עיצובים שחושבו באופן דינמי בזמן הרינדור. ראה [FAQ: Styling and CSS](/docs/faq-styling.html).

תכונת ה`style` מקבלת אובייקט JavaScript עם camelCased properties במקום מחרוזת CSS. התנהגות התכונה דומה לstyle של הDOM, אך זאתי של React היא יותר אפקטיבית, ומונעת חורי אבטחת XSS. לדוגמה:

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
  WebkitTransition: 'all', // שים לב לאות 'W'
  msTransition: 'all' // 'ms' הוא הprefix באותיות קטנות היחיד
};

function ComponentWithTransition() {
  return <div style={divStyle}>זה צריך לעבוד בין דפדפנים</div>;
}
```

Style keys הם camelCased על מנת להיות עקביים עם גישה לproperties על הDOM nodes מJavaScript( לדוגמה `node.style.backgroundImage`). ספקי prefixes  [ששונים מ `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) צריכים להתחיל עם אות גדולה. לכן `WebkitTransition` מתחיל עם אות גדולה.

React תוסיף באופן אוטומטי סיומת  "px" לכמה מאפייני סגנון. אם אתה רוצה להשתמש ביחידות מידה אחרות חוץ מ"px", נקוב בערך כמחרוזת עם יחידת המידה הרצויה. לדוגמה:

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

לא כל הstyle properties מומרים למחרוזות פיקסלים. כמה מהם נשארים ללא יחידת מידה( לדוגמה `zoom`, `order`, `flex`). רשימה מלאה נמצאת [כאן](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

בדרך כלל, ישנה אזהרה כשאלמנט עם ילדים מסומן כ`contentEditable`, בגלל שהוא לא יעבוד. תכונה זו עוצרת את האזהרה. לא מומלץ להשתמש בזה אלא אם אתה בונה ספרייה כמו [Draft.js](https://facebook.github.io/draft-js/) שמנהלת `contentEditable` באופן ידני.

### suppressHydrationWarning {#suppresshydrationwarning}

אם אתה משתמש ברינדור server-side בReact, בדרך כלל יש אזהרה כשהשרת והלקוח מרנדרים תוכן שונה. לעומת זאת, במקרים נדירים, זה קשה מאוד עד בלתי אפשרי להבטיח תוצאה זהה. לדוגמה, חותמות זמן אמורות להיות שונות בשרת ובלקוח.

אם אתה קובע את `suppressHydrationWarning` כtrue, React לא תזהיר אותך לגבי אי התאמה בתכונות ובתוכן של האלמנט. דבר זה עובד בעומק של אלמנט אחד בלבד, ומיועד לשימוש כדרך מוצא. לא מומלץ להשתמש בזה יותר מדי. ניתן לקרוא עוד על hydration ב  [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate).

### value {#value}

תכונת ה`value` נתמכת על ידי הקומפוננטות `<input>` `<textarea>`. ניתן להשתמש בזה לקבוע את ערך הקומפוננטה. זה שימושי לבניית קומפוננטות נשלטות. `defaultValue` הוא המקביל הלא נשלט, שקובע את ערך הקומפוננטה כשהיא לראשונה mounted.

## כל תכונות הHTML הנתמכות: {#all-supported-html-attributes}

החל מReact 16, כל תכונת DOM סטנדרטית או מותאמת אישית, נתמכת באופן מלא.

React תמיד סיפקה ממשק משתמש ממוקד JavaScript לDOM. מכיוון שקומפוננטות React מקבלות props מותאמות אישית וגם כאלה שקשורות לDOM, React משתמש במוסכמת ה`camelCase` כמו ממשקי משתמש של הDOM:

```js
<div tabIndex="-1" />      // כמו node.tabIndex DOM API
<div className="Button" /> // כמו node.className DOM API
<input readOnly={true} />  // כמו node.readOnly DOM API
```

הprops הללו עובדים באופן דומה לתכונות הHTML המקבילות, עם חריגה של מקרים מיוחדים שנמצאים לעיל.

חלק מתכונות הDOM הנתמכות על ידי React כוללות:

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

באופן דומה, כל תכונות הSVG נתמכות באופן מלא:

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