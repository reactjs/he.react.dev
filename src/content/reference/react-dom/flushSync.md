---
title: "flushSync"
---

<Pitfall>

שימוש ב-`flushSync` אינו נפוץ ועלול בביצועים של האפליקציה.

</Pitfall>

<Intro>

`flushSync` מאפשרת לאלץ את React לבצע שטיפה לכל עדכון בתוך התקשרות חזרה שסופק באופן סינכרוני. כך מובטח שה-DOM מתעדכן מיידית.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

קראו ל-`flushSync` כדי לאלץ את React לבצע שטיפה לעבודה ממתינה ולעדכן את ה-DOM באופן סינכרוני.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

ברוב המקרים אפשר לכתוב מ-`flushSync`. השתמשו בה כמוצא אחרון.

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}


* `callback`: פונקציה. React תקרא ל-callback הזה מיד ותבצע פלאש סינכרוני לכל עדכון שהוא מכיל. אפשר לשטוף גם לעדכונים ממתינים, ל-Effects, או לעדכונים מתוך אפקטים. אם עדכון מבצע השהה כמו מקריאת `flushSync`, ייתכן שה-fallbacks יוצגו שוב.

#### מחזירה {/*returns*/}

`flushSync` מחזירה `undefined`.

#### אזהרות {/*caveats*/}

* __K_0__ יכולה לפגוע בביצועים. השתמש במשורה.
* `flushSync` עשויה לאלץ גבולות Suspense ממתינים להציג את מצב ה-`fallback` שלהם.
* `flushSync` עשוי להריץ אפקטים ממתינים ולהחיל באופן סינכרוני כל עדכון שהם מכילים לפני החזרה.
* `flushSync` עשויה לבצע שטף לעדכונים מחוץ ל-callback כשנדרש כדי לבצע שטף לעדכונים שבתוך ה-callback. לדוגמה, אם יש עדכונים ממתינים מקליק, React יכול לבצע אותם לפני ה-flush לעדכונים שבתוך ה-callback.

---

## שימוש {/*usage*/}

### ביצוע פלאש לעדכונים עבור אינטגרציות צד שלישי {/*flushing-updates-for-third-party-integrations*/}

בזמן אינטגרציה עם קוד צד שלישי כמו APIs של דפדפן או ספריות UI. השתמשו ב-`flushSync` כדי לאלץ את React לבצע שטיפה סינכרוני לכל <CodeStep step={1}>עדכון state</CodeStep> בתוך ה-callback:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// By this line, the DOM is updated.
```

כך מובטח שעד שהשורה הבאה בקוד רצה, React כבר עדכנה את ה-DOM.

**שימוש ב-`flushSync` אינו נפוץ, ושימוש תכוף בהכרח אפשרי בביצועים של האפליקציה.** אם האפליקציה שלכם משתמשת רק ב-React APIs, ולא מבצעת אינטגרציה עם ספריות צד שלישי, לרוב `flushSync` לא עובדת.

עם זאת, היא יכולה להיות שימושית לאינטגרציה עם קוד צד שלישי כמו APIs של דפדפן.

מ-APIs של דפדפן מצפים שתוצאות בתוך callbacks ייכתבו ל-DOM בצורה סינכרונית עד סוף ה-callback, כדי שהדפדפן יוכל לפעול על ה-DOM המרונדר. ברוב המקרים React מטפלת בזה אוטומטית. אבל בקשת אישור אפשרות שיהיה צורך לאלץ עדכוןכרוני.

לדוגמה, ה-API של הדפדפן `onbeforeprint` יכול לשנות את העמוד רגע לפני שנפתח חלון ההדפסה. זה שימושי ליישום סגנונות הדפסה מותאמים שמשפרים את תצוגת המסמך להדפסה. בדוגמה הבאה משתמשים ב-`flushSync` בתוך ה-callback של `onbeforeprint` כדי לבצע "flush" מיידי של state של React ל-DOM. כך, בזמן שחלון ההדפסה נפתחת, `isPrinting` מוצג כ-"כן":

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

בלי `flushSync`, חלון ההדפסה יציג `isPrinting` כ-"לא". למה היא ש-React מאגדת עדכונים באופן אסינכרוני וחלון ההדפסה מוצגת לפני שה-state מתעדכן.

<Pitfall>

`flushSync` יכולה להתמודד בביצועים, ועלולה באופן בלתי צפוי לאלץ גבולות Suspense ממתינים להציג את מצב ה-fallback.

ברוב הזמן אפשר מ-`flushSync`, לכן השתמשו בה כמוצא אחרון.

</Pitfall>
