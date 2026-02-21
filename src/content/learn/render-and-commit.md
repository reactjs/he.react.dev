---
title: "רינדור ו-Commit"
---

<Intro>

לפני שהקומפוננטות שלך מוצגות על המסך, הם חייבים רינדור על ידי React. הבנת שלבי תרופות זה תעזור לכם איך הקוד שלכם רץ ולהסביר את ההתנהגות שלו.

</Intro>

<YouWillLearn>

* מה גורם של רינדור ב-React
* מתי ולמה תגובה מרנדרת קומפוננטה
* מהם השלבים שכוללים הצגה של קומפוננטה על המסך
* למה רינדור לא תמיד מייצר עדכון DOM

</YouWillLearn>

דמיינו שהקומפונטות שלכם טבחים במטבח שהן מהן מנות טעימות מהן. בתרחיש הזה, React הוא המלצר שמקבל הזמנות מהלקוחות ומביא להם את המנות. בקשה של בקשה והגשה של UI כולל שלושה שלבים:

1. **הפעלה (הפעלה)** רינדור (העברת הזמנת הלקוח למטבח)
2. **רינדור (עיבוד)** הקומפוננטה (הכנת ההזמנה במטבח)
3. **ביצוע Commit L-DOM (Committing)** (הנחת ההזמנה על השולחן)

<IllustrationBlock sequential>
  <Illustration caption="טריגר" alt="React בתור מלצר במסעדה: לוקח הזמנות מהמשתמשים ומעביר אותן למטבח הקומפוננטות." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="רינדור" alt="השף של כרטיס (Card) נותן ל-React קומפוננטת Card חדשה." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="קומיט" alt="React מגישה את כרטיס ה-Card למשתמש בשולחן." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## שלב 1: טריגר לרינדור {/*step-1-trigger-a-render*/}

יש שתי סיבות לרינדור של קומפוננטה:

1. זהו **הרינדור הראשוני** של הקומפוננטה.
2. ה-**מצב של הקומפוננטה** (או של אחד מהאבות שלה) עודכן.

### רינדור ראשוני {/*initial-render*/}

כשהאפליקציה מתחילה, צריך להפעיל את הרינדור הראשוני. מסגרות ו-sandboxes לפעמים מסתירים את הקוד הזה, אבל הוא מתקדם על ידי קריאה ל-[`createRoot`](/reference/react-dom/client/createRoot) עם צומת DOM יעד, ואז קריאה קודמת שלו עם הקומפוננטה שלכם:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

נסו להעיר את הקריאה ל-`root.render()` ותראו את הקומפוננטה נעלמת!

### רינדורים חוזרים כש-state מתעדכן {/*re-renders-when-state-updates*/}

לאחר שהקומפוננטה רונדרה לראשונה, אפשר להרינדורים נוספים על ידי עדכון מצב עם [פונקציית `set`.](/reference/react/useState#setstate) עדכון ה-state של הקומפוננטה מכניס רינדור לתור אוטומטי אוטומטי. (אפשר להדמיין זאת כאורח במסעדה שמזמין תה, קינוח ועוד דברים אחרי ההזמנה הראשונה, לפי רמת הצמא או הרעב שלו.)

<IllustrationBlock sequential>
  <Illustration caption="עדכון state..." alt="React כמלצר במסעדה מגיש למשתמש ממשק Card. המשתמש מבקש כרטיס ורוד במקום שחור." src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...מפעיל..." alt="React חוזרת למטבח הקומפוננטות ואומרת לשף של Card שצריך כרטיס ורוד." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...רינדור!" alt="שף ה-Card נותן ל-React את הכרטיס הוורוד." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## שלב 2: תגובה מרנדרת את הקומפוננטות שלכם {/*step-2-react-renders-your-components*/}

אחרי שהפעלתם רינדור, הגיבו קוראת לקומפוננטות שלכם כדי להבין מה להציג על המסך. **"עיבוד" הוא תגובה שקוראת לקומפוננטות שלכם.**

* **ברינדור הראשוני,** React תקרא לקומפוננת השורש.
* **ברינדורים הבאים,** תגובה תקרא לקומפוננטת הפונקציה שעדכון ה-state שלה הפעיל את הרינדור.

עשה רקורסיביות: אם הקומפוננטה שעודכנה מחזירה קומפוננטה אחרת, React תרנדר *אותה* בהמשך, ואם גם הקומפוננטה הזו מחזירה משהו, React תרנדר *גם אותו* בהמשך, וכן הלאה. צריך יימשך עד שאין יותר קומפוננטות קוננות ו-React יודע בדיוק מה צריך להיות מוצג על המסך.

בדוגמה הבאה, React תקרא ל-`Gallery()` ול-`Image()` כמה פעמים:

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **ברינדור הראשוני,** React תיצור את [DOM nodes](https://developer.mozilla.org/docs/Web/API/Document/createElement) עבור ``<section>``, ``<h1>``, ושלוש תגיות ``<img>``.
* **בריינדור חוזר,** React תחשב אילו מאפיינים מאז (אם בכלל) השתנו הרינדור הקודם. היא לא תעשה עם זה דבר עד לשלב הבא, שלב ה-commit.

<Pitfall>

עיבוד חייב תמיד להיות [חישוב טהור](/learn/keeping-components-pure):

* **אותם קלטים, אותו פלט.** בהינתן אותם קלטים, קומפונטה צריכה תמיד להחזיר אותו JSX. (אם מישהו יזמין סלט עם עגבניות, הוא לא אמור לקבל סלט עם בצל!)
* **היא מתעסקת בעניינים שלה.** היא לא צריכה לשנות אובייקטים או משתנים שהיו קיימים לפני הרינדור. (הזמנה אחת לא אמורה לשנות את ההזמנה של מישהו אחר.)

אחרת, אתם צריכים להיתקל בבאגים מבלבלים ובהתנהגות לא צפויה ככל הקוד שלכם גדלים ומסתבך. בפיתוח ב-"Strict Mode", תגובה קוראת לפונקציה של כל קומפונטה פעמיים, מה שיכול לעזור לחשוף טעויות שנובעות מפונקציות לא טהורות.

</Pitfall>

<DeepDive>

#### אופטימיזציית ביצועים {/*אופטימיזציה-ביצועים*/}

התנהגות ברירת המחדל של רינדור. אם אתם נתקלים בבעיית ביצועים, יש כמה דרכים אופציונליות לפתור כפי שמת אותה מתואר בחלק [ביצועים](https://reactjs.org/docs/optimizing-performance.html). **אל תבצעו אופטימיזציה מוקדם מדי!**

</DeepDive>

## שלב 3: React מבצעת commit לשינויים ב-DOM {/*step-3-react-commits-changes-to-the-dom*/}

אחרי רינדור (קריאה) של הקומפוננטות, תגיב תשנה את ה-DOM.

* **ברינדור הראשוני,** React תשתמש ב-API של DOM בשם [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) כדי לשים על המסך את כל ה-DOM צמתים שיצרה.
* **ברינדורים חוזרים,** React תחיל את הפעולות המינימליות בזמן (שחושבו הרינדור!) כדי ל-DOM להתאים להתאים הרינדור העדכני.

**הגיב משנה DOM צמתי רק אם יש הבדל בין רינדורים.** לדוגמה, הנה קומפוננטה שמרונדרת מחדש עם props שונים שמועברים מהורה כל השניה. שימו לב שאפשר לאפשר טקסט בתוך ``<input>``, ולעדכן את ה-`value` שלו, אבל הטקסט לא נעלם כשהקומפונטה מרונדרת מחדש:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

זה עובד כי זה האחרון הזה תגובה מעדכנת רק את התוכן של ``<h1>`` עם `זמן` החדש. היא רואה ש-`<input>`` מופיעה ב-JSX באותו מקום כמו פעם הקודמת, אז תגיב לא נוגעת ב-``<input>`` — או ב-`value` שלו!
## אפילוג: צביעת הדפדפן {/*epilogue-browser-paint*/}

אחרי שהרינדור הסתיים ו-React עדכנה את ה-DOM, הדפדפן יצבע מחדש את המסך. למרות שהתהליך הזה מוכר כ-"עיבוד דפדפן", אנחנו קוראים לו "ציור" כדי למנוע בלבול בתיעוד.

<Illustration alt="דפדפן שמבצע צביעה מחדש של המסך לאחר עדכון DOM." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* כל עדכון מסך באפליקציית תגובה מתרחשת בשלושה שלבים:
  1. טריגר (טריגר)
  2. רנדר (רינדור)
3. Commit (קומיט)
* אפשר להשתמש ב-Strict Mode כדי למצוא טעויות בקומפוננטות
* תגיב לא נוגעת ב-DOM אם תוצאת הרינדור זה לפעם הקודמת

</Recap>

