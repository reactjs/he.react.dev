---
title: "startTransition"
---

<Intro>

`startTransition` יכול לעדכן state בלי לחסום את ה-UI.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

הפונקציה `startTransition`ת אפשרות לסמן עדכון state כ-transition.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[עוד דוגמאות נוספות.](#usage)

#### פרמטרים {/*parameters*/}

* `scope`: פונקציה שמעדכנת state על ידי קריאה לפונקציית `set` אחת או יותר.[`set` functions.](/reference/react/useState#setstate) React זמן קוראת ל-`scope`1__ט כל עדכון, ומ__ט ארגו_1__ באופן עצמאי הקריאה ל-`scope` כ-מעבר. העדכונים יהיו [לא-חוסמים](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) ו-[לא יציגו מחווני טעינה לא רצויים.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### מחזירה {/*returns*/}

`startTransition` לא מחזירה דבר.

#### אזהרות {/*caveats*/}

* `startTransition` לא מספקת דרך לעקוב אם מעבר ממתין. צריך להשתמש ב-[`useTransition`](/reference/react/useTransition).

* אפשר לתת עדכון בתוך מעבר רק אם יש לכם גישה לפונקציית ה-`set` של אותו state. אם להתחיל המעבר בתגובה ל-prop או לערך שמוחזר מ-custom Hook, נשתמש ב-[`useDeferredValue`](/reference/react/useDeferredValue).

* הפונקציה שמעבירים ל-`startTransition` חייבת להיות סינכרונית. React מבצעת אותה מיד ומסמנת כ-transition את כל עדכוני ה-state שמתרחשים בזמן הביצוע. אם תנסו לבצע עדכוני __TK3__ נוספים מאוחרים יותר (כמו ב-timeout), הם לא יסומנו כ-transition.

* עדכון state שסומן כ-transition יופרע על ידי עדכוני state אחרים. לדוגמה, אם מעדכנים קומפונטת גרף בתוך transition ואז מתחילים להתחבר בשדה קלט בזמן שהגרף באמצע רינדור מחדש, React תתחיל מחדש את עבודת הרינדור על הגרף אחרי טיפול בעדכון ה-state של הקלט.

* אי אפשר להשתמש בעדכוני מעבר כדי לשלוט בשדות קלט טקסט.

* אם יש כמה מעברים בו-זמנית, React כרגע מאגדת אותם יחד. זו מגבלה שככל הנראה תוסר בגרסה עתידית.

---

## שימוש {/*usage*/}

### עדכון סימון state כ-transition לא חוסם {/*marking-a-state-update-as-a-non-blocking-transition*/}

אפשר לסמן עדכון state כ-*מעבר* על ידי עטיפה שלו בקריאה ל-`startTransition`:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

מעברים מאפשרים לשמור על תגובתיות עדכוני ממשק משתמש גם במכשירים איטיים.

עם מעבר, ה-UI תגובתי גם בזמן רינדור מחדש. למשל, אם משתמש לוחץ על טאב ואז משנה את דעתו ולוחץ על טאב אחר, הוא יכול לעשות זאת בלי להמתין שהרינדור מחדש הראשון יסתיים.

<Note>

`startTransition` מאוד דומה ל-[`useTransition`](/reference/react/useTransition), חוץ מזה שהיא לא מספקת את הדגל `isPending` למעקב אחרי המעבר שמתבצע. אפשר לקרוא ל-`startTransition` כש-`useTransition` לא זמין. לדוגמה, `startTransition` עובדת מחוץ לקומפוננטות, כמו מתוך ספריית הנתונים.

[למדו על מעברים וראו דוגמאות בעמוד של `useTransition`.](/reference/react/useTransition)

</Note>
