---
title: "useLayoutEffect"
---

<Pitfall>

`useLayoutEffect` יכול לפגוע בביצועים. העדיפו [`useEffect`](/reference/react/useEffect) במידת האפשר.

</Pitfall>

<Intro>

`useLayoutEffect` היא גרסה של [`useEffect`](/reference/react/useEffect) שנדלקת לפני שהדפדפן צובע מחדש את המסך.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

התקשר ל-`useLayoutEffect` כדי לבצע את מדידות הפריסה לפני שהדפדפן צובע מחדש את המסך:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `setup`: הפונקציה עם ההיגיון של האפקט שלך. פונקציית ההגדרה שלך עשויה גם להחזיר פונקציית *ניקוי*. לפני הוספת הרכיב שלך ל-DOM, React יפעיל את פונקציית ההגדרה שלך. לאחר כל רינדור מחדש עם שינויים תלויים, React יריץ תחילה את פונקציית הניקוי (אם סיפקת אותה) עם הערכים הישנים, ולאחר מכן יריץ את פונקציית ההתקנה שלך עם הערכים החדשים. לפני הסרת הרכיב שלך מה-DOM, React יפעיל את פונקציית הניקוי שלך.
 
* **אופציונלי** `dependencies`: רשימת כל הערכים התגובתיים שאליהם מתייחסים בתוך הקוד `setup`. הערכים Reactive כוללים את props, state, ואת כל המשתנים והפונקציות המוצהרות ישירות בתוך גוף הרכיב שלך. אם ה-linter שלך הוא [מוגדר עבור React](/learn/editor-setup#linting), הוא יוודא שכל ערך תגובתי צוין כהלכה כתלות. רשימת התלות חייבת לכלול מספר קבוע של פריטים ולהיכתב בשורה כמו `[dep1, dep2, dep3]`. React ישווה כל תלות עם הערך הקודם שלה באמצעות ההשוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). אם תשמיט ארגומנט זה, האפקט שלך יפעל מחדש לאחר כל רינדור מחדש של הרכיב.

#### מחזירה {/*returns*/}

`useLayoutEffect` מחזירה `undefined`.

#### אזהרות {/*caveats*/}

* `useLayoutEffect` הוא Hook, אז אתה יכול לקרוא לו רק **ברמה העליונה של הרכיב שלך** או Hooks משלך. אתה לא יכול לקרוא לזה בתוך לולאות או תנאים. אם אתה צריך את זה, חלץ רכיב והעבר את האפקט לשם.

* כאשר מצב קפדני מופעל, React **יריץ הגדרה אחת נוספת לפיתוח בלבד+מחזור ניקוי** לפני ההגדרה האמיתית הראשונה. זהו מבחן מאמץ המבטיח שהלוגיקת הניקוי שלך "משקפת" את היגיון ההתקנה שלך ושהוא עוצר או מבטל את כל מה שההגדרה עושה. אם זה use הוא בעיה, [הטמיע את פונקציית הניקוי.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* אם חלק מהתלות שלך הם אובייקטים או פונקציות המוגדרות בתוך הרכיב, קיים סיכון שהם **cause האפקט יפעל מחדש לעתים קרובות יותר מהנדרש.** כדי לתקן זאת, הסר את [object](/reference/react/useEffect#removing-unnecessary-object-dependencies) ו [פונקציה](/reference/react/useEffect#הסרת-תלות-פונקציות מיותרות). אתה יכול גם [לחלץ עדכונים state](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) ו-[non-reactive לוגיקה](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) מחוץ לאפקט שלך.

* אפקטים **פועלים רק על הלקוח.** הם לא פועלים במהלך עיבוד השרת.

* הקוד בתוך `useLayoutEffect` וכל עדכוני state המתוזמנים ממנו **חוסמים את הדפדפן מלצבוע מחדש את המסך.** כאשר used יתר על המידה, זה גורם לאפליקציה שלך לאט. במידת האפשר, העדיפו את [`useEffect`.](/reference/react/useEffect)

---

## שימוש {/*usage*/}

### מדידת פריסה לפני שהדפדפן צובע מחדש את המסך {/*measuring-layout-before-the-browser-repaints-the-screen*/}

רוב הרכיבים לא צריכים לדעת את מיקומם וגודלם על המסך כדי להחליט מה לרנדק. הם מחזירים רק כמה JSX. לאחר מכן הדפדפן מחשב את *פריסה* שלהם (מיקום וגודל) וצובע מחדש את המסך.

לפעמים, זה לא מספיק. תארו לעצמכם הסבר כלים שמופיע ליד אלמנט כלשהו ברחף. אם יש מספיק מקום, הסבר הכלי אמור להופיע מעל האלמנט, אבל אם הוא לא מתאים, הוא אמור להופיע מתחת. כדי להציג את קצה הכלים במיקום הסופי הנכון, עליך לדעת את הגובה שלו (כלומר אם הוא מתאים לחלק העליון).

כדי לעשות זאת, עליך לבצע רינדור בשני מעברים:

1. עבד את קצה הכלים בכל מקום (גם במיקום שגוי).
2. מדדו את גובהו והחליטו היכן למקם את קצה הכלי.
3. רנדר את תיאור הכלים *שוב* במקום הנכון.

**כל זה צריך לקרות לפני שהדפדפן יצבע מחדש את המסך.** אתה לא רוצה שה-user יראה את הסבר הכלי זז. התקשר ל-`useLayoutEffect` כדי לבצע את מדידות הפריסה לפני שהדפדפן צובע מחדש את המסך:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render now that you know the real height
  }, []);

  // ...use tooltipHeight in the rendering logic below...
}
```

הנה איך זה עובד צעד אחר צעד:

1. `Tooltip` מעבד עם ה-`tooltipHeight = 0` הראשוני (לכן תיאור הכלי עשוי להיות ממוקם לא נכון).
2. React ממקם אותו ב-DOM ומריץ את הקוד ב-`useLayoutEffect`.
3. ה-`useLayoutEffect` שלך [מודד את הגובה](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) של תוכן הסבר הכלים ומפעיל עיבוד מחדש מיידי.
4. `Tooltip` מעבד שוב עם ה-`tooltipHeight` האמיתי (כך שהסבר הכלי ממוקם נכון).
5. React מעדכן אותו ב-DOM, והדפדפן מציג לבסוף את הסבר הכלי.

רחפו מעל הכפתורים למטה וראו איך ה-tooltip מתאים את המיקום שלו לפי המקום הזמין:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

שימו לב שלמרות שהרכיב `Tooltip` צריך לרנדר בשתי מעברים (ראשית, עם `tooltipHeight` אתחול ל-`0` ולאחר מכן עם הגובה הנמדד האמיתי), אתם רואים רק את התוצאה הסופית. זו הסיבה שאתה צריך `useLayoutEffect` במקום [`useEffect`](/reference/react/useEffect) עבור הדוגמה הזו. בואו נסתכל על ההבדל בפירוט להלן.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` חוסמת את הדפדפן מלצבוע מחדש את {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React מבטיח שהקוד בתוך `useLayoutEffect` וכל עדכוני state המתוזמנים בתוכו יעובדו **לפני שהדפדפן יצבע מחדש את המסך.** זה מאפשר לך לרנדר את הסבר הכלי, למדוד אותו ולעבד שוב את הסבר הכלי מבלי שה-user ישים לב לעיבוד הנוסף הראשון. במילים אחרות, `useLayoutEffect` חוסם את הדפדפן מציור.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` אינו חוסם את הדפדפן {/*useeffect-does-not-block-the-browser*/}

הנה אותה דוגמה, אבל עם [`useEffect`](/reference/react/useEffect) במקום `useLayoutEffect`. אם אתה משתמש במכשיר איטי יותר, ייתכן שתבחין שלפעמים קצה הכלים "מהבהב" ואתה רואה לרגע את המיקום ההתחלתי שלו לפני המיקום המתוקן.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

כדי להקל על שחזור הבאג, גרסה זו מוסיפה עיכוב מלאכותי במהלך העיבוד. React יאפשר לדפדפן לצבוע את המסך לפני שהוא יעבד את עדכון state בתוך `useEffect`. כתוצאה מכך, תיאור הכלים מהבהב:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // This artificially slows down rendering
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

ערוך דוגמה זו ל-`useLayoutEffect` ושם לב שהיא חוסמת את הצבע גם אם העיבוד מואט.

<Solution />

</Recipes>

<Note>

עיבוד בשני מעברים וחסימת הדפדפן פוגע בביצועים. נסו להימנע מכך כאשר אתם יכולים.

</Note>

---

## פתרון בעיות {/*troubleshooting*/}

### אני מקבל שגיאה: "`useLayoutEffect` לא עושה כלום בשרת" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

המטרה של `useLayoutEffect` היא לאפשר לרכיב שלך [use מידע פריסה לעיבוד:](#measuring-layout-before-the-browser-repaints-the-screen)

1. עבד את התוכן הראשוני.
2. מדדו את הפריסה *לפני שהדפדפן צובע מחדש את המסך.*
3. עבד את התוכן הסופי באמצעות מידע הפריסה שקראת.

כאשר אתה או המסגרת שלך uses [עיבוד שרת](/reference/react-dom/server), אפליקציית React שלך מעבדת ל-HTML בשרת עבור העיבוד הראשוני. זה מאפשר לך להציג את ה-HTML הראשוני לפני שהקוד JavaScript נטען.

הבעיה היא שבשרת, אין מידע על פריסה.

ב[דוגמה הקודמת](#measuring-layout-before-the-browser-paints-the-screen), הקריאה `useLayoutEffect` ברכיב `Tooltip` מאפשרת לו למקם את עצמו בצורה נכונה (מעל או מתחת לתוכן) בהתאם לגובה התוכן. אם ניסית לעבד את `Tooltip` כחלק מהשרת הראשוני HTML, זה יהיה בלתי אפשרי לקבוע. בשרת, אין עדיין פריסה! לכן, גם אם תציג אותו בשרת, המיקום שלו "יקפוץ" על הלקוח לאחר שה-JavaScript נטען ופועל.

בדרך כלל, רכיבים המסתמכים על מידע פריסה אינם צריכים להופיע בשרת בכל מקרה. לדוגמה, כנראה שזה לא הגיוני להציג `Tooltip` במהלך העיבוד הראשוני. זה מופעל על ידי אינטראקציה עם הלקוח.

עם זאת, אם אתה נתקל בבעיה זו, יש לך כמה אפשרויות שונות:

- החלף את `useLayoutEffect` ב-[`useEffect`.](/reference/react/useEffect) זה אומר לReact שזה בסדר להציג את תוצאת העיבוד הראשונית מבלי לחסום את הצבע (מכיוון שuse המקורי HTML יהפוך לגלוי לפני שהאפקט שלך ירוץ).

- לחלופין, [סמן את הרכיב שלך כלקוח בלבד.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) זה אומר לReact להחליף את התוכן שלו עד ל-[`<Suspense>`](/`<Suspense>`](/`<Suspense>`](/`<Suspense>`](/`<Suspense>`)(/`<Suspense>`](/`<Suspense>`)(/`<Suspense>`)(/`<Suspense>`)(/`<Suspense>`)(/`<Suspense>`)(/`<Suspense>`)(/`<Suspense>`2/) ספינר או נצנוץ) במהלך עיבוד השרת.

- לחלופין, אתה יכול לרנדר רכיב עם `useLayoutEffect` רק לאחר הידרציה. שמור על `isMounted` state בוליאני שמאוחל ל-`false`, והגדר אותו ל-`true` בתוך קריאה של `useEffect`. היגיון הרינדור שלך יכול להיות כמו `return isMounted ? <RealContent /> : <FallbackContent />`. בשרת ובמהלך ההידרציה, ה-user יראה `FallbackContent` שלא אמור לקרוא ל-`useLayoutEffect`. לאחר מכן React יחליף אותו ב-`RealContent` שפועל על הלקוח בלבד ויכול לכלול קריאות `useLayoutEffect`.

- אם אתה מסנכרן את הרכיב שלך עם מאגר נתונים חיצוני ומסתמך על `useLayoutEffect` מסיבות שונות מאשר מדידת פריסה, שקול את [`useSyncExternalStore`](/reference/react/useSyncExternalStore) במקום זאת [תומך בעיבוד שרת.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
