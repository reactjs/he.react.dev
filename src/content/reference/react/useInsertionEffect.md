---
title: "useInsertionEffect"
---

<Pitfall>

`useInsertionEffect` מיועד למחברי ספריות CSS-in-JS. אלא אם אתם עובדים על ספריית CSS-in-JS וצריכים מקום להזרקת סגנונות, כנראה שתרצו להשתמש ב-[`useEffect`](/reference/react/useEffect) או ב-[`useLayoutEffect`](/reference/react/useLayoutEffect) במקום.

</Pitfall>

<Intro>

`useInsertionEffect` יכול להכניס אלמנטים ל-DOM לפני מופעים של אפקטים של שכל layout.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

קראו ל-`useInsertionEffect` כדי להכניס סגנונות לפני שמופעלים אפקטים שעלולים להזדקק לקריאת פריסת:

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inject <style> tags here ...
  });
  return rule;
}
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `setup`: פונקציה עם לוגיקת ה-Effect שלכם. פונקציית ה-setup יכולה גם להחזיר אופציונלית פונקציית *ניקוי*. כשהקומפונטה מתווספת ל-DOM, אבל לפני שכל אפקטים של layout רצים, React תריץ את הפונקציית ההתקנה שלכם. אחרי כל עיבוד מחדש עם תלות שהשתנו, React תריץ קודם את הפונקציית ה-cleanup (אם סיפקתם כאלה) עם הערכים הישנים, ואז תריץ את הפונקציית ההתקנה עם הערכים החדשים. כשהקומפוננטה מוסרת מה-DOM, React תריץ את פונקציית ה-cleanup שלכם.

* **אופציונלי** `dependencies`: רשימה של כל הערכים הריאקטיביים שמופנים בתוך קוד ה-`setup`. ערכים ריאקטיביים כוללים props, state, וכל המשתנים והפונקציות שמוגדרים באופן עצמאי בתוך גוף הקומפוננטה. אם ה-linter שלכם [מוגדר ל-React](/learn/editor-setup#linting), הוא יוודא שכל ערך ריאקטיבי מצוין נכון כ-dependency. רשימת התלות חייבת להיות מספר פריטים קבועים וכתב מוטבע כמו `[dep1, dep2, dep3]`. React תשווה כל תלות לערך הקודם שלו באמצעות אלגוריתם ההשוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). אם לא תציינו dependencies בכלל, ה-Effect ירוץ מחדש אחרי כל עיבוד מחדש של הקומפוננטה.

#### מחזירה {/*returns*/}

`useInsertionEffect` מחזיר `undefined`.

#### אזהרות {/*caveats*/}

* אפקטים רצים רק בצד הלקוח. הם לא רצים בזמן רינדור שרת.
* אי אפשר לעדכן state מתוך `useInsertionEffect`.
* בזמן ש-`useInsertionEffect` רץ, רצים עדיין לא מחוברים.
* `useInsertionEffect` עשוי לרוץ לפני או אחרי שה-DOM מתעדכן. לא כדאי להסתמך על כך שה-DOM יתעדכן בזמן מסוים.
* סוג לסוגי אפקטים אחרים, שמריצים ניקוי לכל אפקט והתקנה לכל אפקט, `useInsertionEffect` תריץ גם ניקוי וגם התקנה קומפוננתה-אחר-קומפונטה. זה יוצר "interleaving" של פונקציות ה-cleanup וה-setup.
---

## שימוש {/*usage*/}

### הזרקת סגנונות דינמיים מספריות CSS-in-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

באופן טבעי, הייתם מעצבים קומפונטות React בעזרת CSS רגיל.

```js
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
```

חלק מהצוותים מעדיפים לכתוב סגנונות למעשה בקוד JavaScript במקום בקובצי CSS. זה בדרך כלל דורש שימוש בספריית CSS-in-JS או בכל מתאים. יש שלוש גישות נפוצות ל-CSS-in-JS:

1. חילוץ סטטי לקובצי CSS באמצעות קומפיילר
2. סגנונות מוטבעים, למשל `<div style={{ opacity: 1 }}>`
3. הזרקה בזמן ריצה של תגיות `<style>`

אם אתם משתמשים ב-CSS-in-JS, אנחנו ממליצים על שילוב של שתי הגישות הראשונות (קובצי CSS לסגנונות סטטיים, סגנונות מוטבעים לסגנונות דינמיים). **אנחנו לא ממליצים על הזרקת תגיות `<style>` בזמן ריצה משתי סיבות:**

1. הזרקה בזמן ריצה מאלצת את הדפדפן לחשב סגנונות בתדירות גבוהה יותר.
2. הזרקה בזמן ריצה יכולה להיות איטית מאוד אם היא מתרחשת בזמן לא נכון במחזור החיים של React.

את הבעיה הראשונה אי אפשר לפתור, אבל `useInsertionEffect` עוזרת לפתור את הבעיה השנייה.

קראו ל-`useInsertionEffect` כדי להכניס סגנונות לפני אפקטים של שכל פריסה מופעים:

```js {4-11}
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // As explained earlier, we don't recommend runtime injection of <style> tags.
    // But if you have to do it, then it's important to do in useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

בדומה ל-`useEffect`, `useInsertionEffect` לא רצה בשרת. אם אתם צריכים לאסוף אילו כללי CSS שימשו בשרת, אפשר לעשות זאת בזמן הרינדור:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[קראו עוד על שדרוג ספריות CSS-in-JS עם הזרקה בזמן ריצה ל-`useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### איך זה עדיף על הזרקת סגנונות בזמן רינדור או useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

אם מכניסים סגנונות בזמן רינדור ו-React מעבדת [עדכון לא חוסם,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) הדפדפן יחשוב מחדש סגנונות בכל מסגרת בזמן רינדור קומפוננטות, מאוד יכול להיות.

`useInsertionEffect` עדיפה על הזרקת סגנונות בזמן [`useLayoutEffect`](/reference/react/useLayoutEffect) או [`useEffect`](/reference/react/useEffect), כי היא מבטיחה שעד שה-Effects אחרים בקומפוננטות שלכם רצים, תגיות __כנסTK_3__ כבר. אחרת, פריסת חישובי ב-Effects רגילים יהיו שגויים בגלל סגנונות לא מעודכנים.

</DeepDive>
