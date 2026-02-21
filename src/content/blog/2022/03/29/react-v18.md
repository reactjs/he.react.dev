---
title: "React v18.0"
---

29 במרץ 2022 מאת [צוות React](/community/team)

---

<Intro>

React 18 זמין כעת ב-npm! בפוסט האחרון שלנו, שיתפנו הוראות שלב אחר שלב עבור [שדרוג האפליקציה שלך ל-React 18](/blog/2022/03/08/react-18-upgrade-guide). בפוסט זה, אנו נותנים סקירה כללית של מה חדש בReact 18, ומה זה אומר לעתיד.

</Intro>

---

הגרסה הבסיסית האחרונה שלנו כוללת שיפורים מהקופסה כמו אצווה אוטומטית, APIs חדשות כמו startTransition, ועיבוד זרימה בצד השרת עם תמיכה ב-Suspense.

רבות מה תכונה ב-React 18 בניות על המעבד החדש שלנו, שינוי במצב הקלעים שפותח יכול חדשות עוצמתיות. __K_1__ היא הסכמה - היא מופעלת רק כאשר אתה use תכונה מתאימה - אבל אנחנו חושבים שתהיה לה להשפיע על הדרך שבה אנשים בונים ישומים.

בילינו שנים במחקר ופיתוח תמיכה עבור מקבילות ב-React, והקפדנו על מתן נתיב אימוץ הדרגתי ל-users קיימים. בקיץ שעבר, [הקמנו את קבוצת העבודה React 18](/blog/2021/06/08/the-plan-for-react-18) כדי לא סוף משוב ממומחים בקהילה ולהבטיח חווית שדרוג חלקה לכל המערכת האקולוגית של React.

למקרה שפספסתם, חלקנו הרבה מהחזון הזה ב-React Conf 2021:

* ב[המפתח](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa), אנו מסבירים איך React 18 משתלב במשימה שלנו על מפתחים לבנות חוויות users
* [שרוטי קאפור](https://twitter.com/shrutikapoor08) [הדגימה כיצד use התכונות החדשות בReact 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [איש שונדאי](https://twitter.com/shaundai) נתן לנו סקירה כללית של [עיבוד שרת סטרימינג עם Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

להלן סקירה מלאה של מה לצפות במהדורה זו, החל מעיבוד במקביל.

<Note>

עבור React Native users, React 18 יישלח ב-React Native עם האדריכלות החדשה React Native. למידע נוסף, עיין ב[React ההרצאה המרכזית כאן](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## מה זה בעבודה React? {/*what-is-concurrent-react*/}

התוספת החשובה ביותר ב-React 18 משהו שאנו מקווים של העולם לא תצטרכו לחשוב עליו: מעשי. אנו חושבים שזה נכון עבור מנהל ספריות.

איננה תכונה, כשלעצמה. זהו מנגנון חדש מאחורי הקלעים המאפשר ל-React להכין מספר גרסאות של ממשק המשתמש שלך בו-זמנית. אתה יכול לחשוב על מקבילות כעל אפליקציית פרט - זה חשוב בגלל התכונות שהוא פותח. הטכניקות המתוחכמות של React של use בהפנייתה הפנימית, כמו תורי ואגירה מרובה. אבל לא תראה את המושגים האלה בשום מקום ב-APIs הציבוריים שלנו.

כאשר אנו מעצבים APIs, אנו מנסים להסתיר יישום פרטי מפתחים. כמפתח React, אתה מעשה *באיך* אתה רוצה שחוויית user תיראה, ו-React מטפל ב*איך* מספק את החוויה הזו. אז אנחנו לא מצפים ממפתחי React לדעת איך עובדת מתחת למכסה המנוע.

עם זאת, מתאימה React חשוב יותר מפרט יישום טיפוסי - זהו עדכון בסיסי למודל העיבוד המרכזי של React. אז אמנם זה לא סופר חשוב לדעת איך עובד בעבודה, אבל אולי כדאי לדעת מה זה ברמה גבוהה.

מאפיין מפתח של Concurrent React הוא שהרינדור ניתן להפסקה. כאשר אתה משדרג לראשונה ל-React 18, לפני הוספת תוספת נוספת, העדכונים מוצגים כמו בגרסאות קודמות של React - בעסקה אחת, ללא הפרעה, סינכרונית. עם סינכרון, דבר שעדכון מתחיל בעיבוד, שום דבר לא יכול להפריע לו עד שה-use יכול לראות את התוצאה על המסך.

בעיבוד, זה לא תמיד המקרה. React עשוי להתחיל לעבד עדכון, pause באמצע, ואז להמשיך מאוחר יותר. זה אפילו לנטוש לגמרי. React מבטיח שממשק משתמש ייראה עקבי גם אם העיבוד יופסק. כדי לעשות זאת, הוא ממתין לבצע מוטציות DOM עד הסוף, לאחר שהעץ כולו הוערך. עם יכולת זו, React יכול להכין מסכים חדשים ברקע מלבד לחסום את השרשור. משמעות הדבר היא שממשק משתמש לה יכול לגיב באופן מיידי לקלט user גם אם הוא באמצע משימת רינדור גדולה, וליצור חוויית user קולחת.

דוגמה היא נוספת state להשתמש חוזר. גם React יכול חלקים של ממשק משתמש מהמסך, ואז להוסיף אותם בחזרה מאוחר יותר תוך שימוש חוזר ב-state הקודם. לדוגמה, כאשר user מתרחק מהמסך ובחזרה, React אמור להיות מסוגל לשחזר את המסך הקודם state בו היה קודם. בקטינה הקרובה, אנו מתכננים להוסיף רכיב חדש בשם `<Offscreen>` שמיישם את הדפוס הזה. באופן דומה, תוכל לבצע use מחוץ למסך כדי להכין ממשק משתמש חדש ברקע כך שהוא מוכן לפני שה-user חשוף אותו.

רינדור עבודה הוא כלי חדש ועוצמתי ב-React ורוב התכונות החדשות שלנו כדי לנצל אותו, כולל Suspense, מעברים ועיבוד שרת סטרימינג. אבל React 18 הוא רק ההתחלה של מה שאנחנו שואפים לבנות על הבסיס החדש הזה.

## אימוץ בהדרגה פונקציה {/*gradually-adopting-concurrent-features*/}

מבחינה טכנית, עיבוד עבודה הוא שינוי שובר. Because רינדור ניתן להפסקה, רכיבים מתנות מעט שונה כאשר הוא מופעל.

בבדיקות שלנו, שדרגנו אלפי רכיבים ל-React 18. מה שמצאנו הוא שכמעט כל הרכיבים הקיימים "פשוט עובדים" עם רינדור, ללא כל שינויים. עם זאת, חלקם לדרוש מאמץ הגירה נוסף. למרות שהשינויים בדרך כלל קטנים, עדיין תעשה את זה בקצב שלך. התנהגות העיבוד החדשה ב-React 18 **מופעלת רק בחלקים של האפליקציה שלך שuse תכונות חדשות.**

אסטרטגית השדרוגת היא להפעיל את האפליקציה שלך ב-React 18 לבד לשבור את הקוד הקיים. אז אתה יכול להתחיל בהדרגה להוסיף התאמה בקצב שלך. אתה יכול use [StrictMode](/reference/react/StrictMode) כדי לעזור להעלות באגים רלוונטיים. מצב קפדני אינו משפיע על ניהול הייצור, אך ורק על הפיתוח הוא ירשום פעולות נוספות ופעולות הפעלה כפולות שצפויות להיות חסרות יכולת. זה לא יתפוס הכל ביותר, אבל זה יעיל בסוג הטעויות הנפוצים.

לאחר שתשדרג ל-React 18, תוכל להתחיל להשתמש בהתאמה מתאימה. לדוגמה, אתה יכול use startTransition כדי לנווט בין מסכים ללא לחסום קלט user. או useDeferredValue כדי למנוע עיבודים חוזרים יקרים.

עם זאת, לטווח ארוך, אנו מצפים שהדרך העיקרית שתוסיף בו זמנית לאפליקציה שלך היא באמצעות ספרייה או מסגרת המותאמת במקביל. ברוב המקרים, לא תתקשר עם APIs. לדוגמה, במקום שמפתחים יקראו ל-startTransition בכל פעם שהם מנווטים למסך חדש, ספריות הנתב יעטפו ניווטים באופן אוטומטי ב-startTransition.

אפשר לקחת זמן מה עד שהשדרוג של הספריות יהיה תואם תואם. סיפקנו APIs חדשות כדי להקל על ספריות לנצל את הפונקציה. היום, נא להתאזר בסבלנות עם התחזוקה בזמן שאנו פועלים להעברה הדרגתית של המערכת האקולוגית React.

למידע נוסף, עיין בפוסט הקודם שלנו: [כיצד לשדרג ל-React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense במסגרות נתונים {/*suspense-in-data-frameworks*/}

ב-React 18, אתה יכול להתחיל להשתמש ב-[Suspense](/reference/react/Suspense) לאיסוף נתונים במסגרות דעת כמו ממסר, Next.js, מימן או רמיקס. אחזור נתונים אד-הוק עם Suspense אפשרי מבחינה טכנית, אך עדיין לא מומלץ כאסטרטגיה כללית.

אפשר, אנו נותנים לחש פרימיטים נוספים יכולים להתחבר לגישה לנתונים שלך עם Suspense, אולי ללא use של מסגרת דעתנית. עם זאת, Suspense עובד הכי טוב משולב עמוק בארכיטקטורת האפליקציה שלך: הנתב שלך, שכבת המשרד שלך וסביבת העיבוד של השרת שלך. אז גם לטווח ארוך, אנו מצפים ספריות ומסגרות ישחקו תפקיד מכריע מערכת האקולוגית React.

כמו בגרסאות קודמות של React, אתה יכול גם use Suspense לפיצול קוד בלקוח עם React.lazy. אבל החזון שלנו עבור Suspense תמיד היה על הרבה יותר מאשר טעינת קוד - המטרה היא להרחיב את התמיכה ב-Suspense כך שבסופו של דבר, היא יכולה להתמודד עם כל פעולה אסינכרונית (טעינת קוד, נתונים, תמונות וכו').

## רכיבי שרת עדיין בפיתוח {/*server-components-is-still-in-development*/}

[**רכיבי שרת**](/blog/2020/12/21/data-fetching-with-react-server-components) היא תכונה קרובה המאפשרת למפתחים לבנות אפליקציות המשתרעות על פני השרת והלקוח, תוך שילוב של אינטראקטיביות התעשייה של אפליקציות צדדיות לקוח עם הביצועים המשופרים של שרת. רכיבי שרת אינם מחוברים מטבעם ל-Concurrent React, אבל הוא תוכנן לעבוד בצורה הטובה ביותר עם תוספת תוספת כמו Suspense ועיבוד שרת סטרימינג.

רכיבי שרת עדיין ניסיוניים, אך אנו מצפים לשחרר גרסה ראשונית במדורה משנית של 18.x. היום, אנחנו עובדים עם מסגרות כמו Next.js, מימן ורמיקס כדי לקדם את ההצעה ולהכין אותה לאימוץ רחב.

## מה חדש בReact 18 {/*whats-new-in-react-18*/}

### תכונה חדשה: אצווה אוטומטית {/*new-feature-automatic-batching*/}

אצווה היא כאשר React מקבץ עדכוני state מרובים לעיבוד מחדש יחיד לביצועים טובים יותר. ללא אצווה אוטומטית, צירפנו עדכונים רק בתוך React מטפלי אירועים. עדכונים בתוך הבטחות, setTimeout, מטפל אירועים מקוריים או כל אירוע אחר לא צורפו ב-React כברירת מחדל. עם אצווה אוטומטית, העדכונים האלה יצטברו באופן אוטומטי:


```js
// Before: only React events were batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

למידע נוסף, עיין בפוסט זה עבור [אצווה אוטומטית עבור פחות עיבודים ב-React 18](https://github.com/reactwg/react-18/discussions/21).

### תכונה חדשה: מעברים {/*new-feature-transitions*/}

מעבר הוא מושג חדש ב-React כדי להבחין בין עדכונים דחופים ללא דחופים.

* **עדכונים דחופים** משקפים אינטראקציה ישירה, כמו הקלדה, לחיצה, לחיצה וכן הלאה.
* **עדכוני מעבר** מעבירים את ממשק המשתמש מתצוגה אחת לאחרת.

עדכונים דחופים כמו הקלדה, לחיצה או לחיצה, זקוקים לתגובה מיידית כדי להתאים לאינטואציות שלנו לגבי האופן שבו אובייקטים פיזיים מתנות. אחרת הם מרגישים "לא בסדר". עם זאת, המעברים שונים שuse ה-user לא מצפה לראות כל ערך ביניים על המסך.

לדוגמה, כאשר אתה בוחר מסנן בתפריט נפתח, אתה מצפה שכפתור הסינון עצמו יגיב מיד כשתלחץ. עם זאת, התוצאות בפועל עשויות לעבור בנפרד. עיכוב קטן לא יהיה מורגש ולעתים קרובות צפוי. ואם תשנה שוב את המסנן לפני שהתוצאות מסתיימות, אכפת לך רק לראות את התוצאות האחרונות.

בדרך כלל, עבור חוויית user הטוב ביותר, קלט בודד של user אמור לגרום לעדכון דחוף וגם לא דחוף. אתה יכול use startTransition API בתוך אירוע קלט כדי לידע React אילו עדכונים דחופים כאשר הם "מעברים":


```js
import { startTransition } from 'react';

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});
```


עדכונים עטופים ב-startTransition רופאים כלא דחופים ויופסקו אם יגיעו עדכונים דחופים יותר כמו לחיצות או לחיצות מקשים. אם המעבר נקטע על ידי ה-user (דוגמה, על ידי הקלדת תווים מרובים ברצף), React יזרוק את העדכון האחרון שיציג רק את העיבוד המיושן.


* `useTransition`: Hook כדי להתחיל מעברים, כולל ערך למעקב אחר ה-state הממתין.
* `startTransition`: שיטה להתחיל מעברים כאשר ה-Hook לא יכול להיות used.

מעברים יבחרו לעיבוד פעולה, מה אפשר להפריע לעדכון. אם התוכן מושעה מחדש, מעברים גם אומרים לReact להמשיך ולהציג את התוכן הנוכחי תוך עיבוד תוכן המעבר ברקע (ראה את [Suspense RFC](Suspense למידע נוסף).

[ראה מסמכים למעברים כאן](/reference/react/useTransition).

### Suspense תכונות חדשות {/*new-suspense-features*/}

Suspense לאפשר לך לציין את הטעינה state עבור חלק מעץ הרכיבים אם הוא עדיין לא מוכן להראות:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense גורם את "טעינת משתמש state" למושג הצהרתי ממדרגה ראשונה במודל התכנות React. אנחנו יכולים לבנות עליו תכונות ברמה גבוהה יותר.

הצגנו גרסה מוגבלת של Suspense לפני מספר שנים. עם זאת, המקרה הנתמך היחיד של use היה פיסול קוד עם React.lazy, והוא לא נתמך כלל בזמן רינדור בשרת.

ב-React 18, הוספנו תמיכה עבור Suspense בשרת והרחבנו את היכולות שלו באמצעות יכולת רינדור תוספת.

Suspense ב-React 18 עובד הכי טוב בשילוב עם המעבר API. אם תשעה מעבר, React ימנע את החלפת התוכן הנראה לעין ב-fallback. במקום זאת, React יעכב את העיבוד שיטענו מספיק נתונים כדי למנוע טעינה לא טובה של state.

למידע נוסף, עיין ב-RFC עבור [Suspense ב-React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### עיבוד חדש של לקוח ושרת APIs {/*new-client-and-server-rendering-apis*/}

במהדורה זו ניצלנו את ההזדמנות לעצב מחדש את ה-APIs שאנו חושפים לעיבוד בלקוח ובשרת. שינויים אלו מאפשרים ל-users להמשיך להשתמש ב-APIs הישנים במצב React 17 בזמן שהם משדרגים ל-APIs החדשים ב-React 18.

#### React DOM לקוח {/*react-dom-client*/}

ה-API החדשים האלה מיוצאים כעת מ-`react-dom/client`:

* `createRoot`: שיטה חדשה ליצירת שורש ל-`render` או `unmount`. השתמש בו במקום `ReactDOM.render`. תכונות חדשות ב-React 18 לא עובדות בלעדיו.
* `hydrateRoot`: שיטה חדשה ללחלח יישום מעובד בשרת. השתמש בו במקום `ReactDOM.hydrate` בשילוב עם React DOM שרת APIs החדשים. תכונות חדשות ב-React 18 לא עובדות בלעדיו.

גם `createRoot` וגם `hydrateRoot` לקבל אפשרות חדשה בשם `onRecoverableError` למקרה שתקבל הודעה כאשר React מתאושש משגיאות על רינדור או הידרציה לצורך רישום. כברירת מחדל, React יהיה use [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError), או `console.error` בדפדפנים הישנים.

[ראה מסמכים עבור React DOM לקוח כאן](/reference/react-dom/client).

#### React DOM שרת {/*react-dom-server*/}

APIs החדשים האלה מיוצאים עכשיו מ-`react-dom/server` ויש להם תמיכה מלאה בהזרמת Suspense בשרת:

* `renderToPipeableStream`: לסטרימינג בסביבות Node.
* `renderToReadableStream`: עבור סביבות זמן ריצה קצה מודרניות, למשל עובדי Deno ו-Cloudflare.

שיטת `renderToString` המשיכה לעבוד אבל היא לא מעודדת.

[ראה מסמכים עבור שרת React DOM כאן](/reference/react-dom/server).

### התנהגויות חדשות במצב קפדני {/*new-strict-mode-behaviors*/}

אפשר, נרצה להוסיף תכונה המאפשרת ל-React להוסיף ולהסיר חלקים מהממשק תוך שמירה על state. לדוגמה, כאשר user מתרחק מהמסך ובחזרה, React אמור להיות מסוגל להסתכל מיד את המסך הקודם. לשם כך, React יבטל את הטעינה והרכבה מחדש של עצים באמצעות אותו רכיב state כמו קודם.

תכונה זו תעניק לאפליקציות React ביצועים טובים יותר מהקופסה, אך מחייבת רכיבים להיות עמידים בפני אפקטים שהוא תקנו והושמדו מספר פעמים. רוב האפקטים יפעלו ללא כל שינוי, אבל חלק מהאפקטים מנחים שהם מוקנים או מושמדים רק פעם אחת.

כדי לעזור לשטח את הבעיות הללו, React 18 מציג בדיקה חדשה לפיתוח בלבד מצב קפדני. הסימון החדש הזה יבטל את הטעינה והרכבה מחדש של כל רכיב, בכל פעם שרכיב נטען בפעם הראשונה, וישחזר את ה-state הקודם בהרכבה השנייה.

לפני השינוי הזה, React היה מעלה את הרכיב ויוצר את האפקטים:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```


עם מצב קפדני ב-React 18, React ידמה ביטול הרכבה והרכבה מחדש של הרכיב במצב פיתוח:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
* React simulates unmounting the component.
  * Layout effects are destroyed.
  * Effects are destroyed.
* React simulates mounting the component with the previous state.
  * Layout effects are created.
  * Effects are created.
```

[ראה מסמכים להבטחת state לשימוש חוזר](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### חדש Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` הוא Hook חדש ליצירת מזהים ייחודיים הם שרת בלקוח והן ב, תוך הימנעות מאי התאמה של הידרציה. זה בעיקר useמלא עבור ספריות רכיבים השתלבות עם APIs נגישות הדורשות מזהים ייחודיים. זה פותר בעיה קיימת ב-React 17 ומטה, אבל זה אפילו יותר חשוב ב-React 18 because של האופן שבו מעבד שרת הסטרימינג החדש מספק HTML מחוץ לסדר. [ראה מסמכים כאן](/reference/react/useId).

> הערה
>
> `useId` הוא **לא** ליצירת [מפתחות ברשימה](/learn/rendering-lists#where-to-get-your-key). מפתחות צריכים להיווצר מהנתונים שלך.

#### useTransition {/*usetransition*/}

`useTransition` ו-`startTransition` מאפשרים לך לסמן כמה עדכוני state כלא דחופים. עדכוני state אחרים נחשבים דחופים כברירת מחדל. React יאפשר עדכוני state דחופים (לדוגמה, עדכון קלט טקסט) כדי להפריע לעדכוני state לא דחופים (לדוגמה, רשימת עיבוד של תוצאות חיפוש). [ראה מסמכים כאן](/reference/react/useTransition)

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` יכול לך לדחות עיבוד מחדש של חלק לא דחוף מהעץ. זה דומה ל-debounc, אבל יש לו כמה יתרונות בהשוואה אליו. אין עיכוב זמן קבוע, אז React ינסה את העיבוד הדחוי מיד לאחר שהעיבוד הראשון ישתקף על המסך. העיבוד הנדחה ניתן להפסקה ואינו חוסם קלט user. [ראה מסמכים כאן](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` הוא Hook חדש המאפשר לחנויות חיצוניות לתמוך בקריאה פעולות על ידי אילוץ עדכ לחנות להיות סינכרוניים. זה מסיר את הצורך ב-useEffect בעת יישום מנויים למקורות נתונים חיצוניים, ומומלץ עבור כל ספרייה השתלבת עם state חיצונית ל-React. [ראה מסמכים כאן](/reference/react/useSyncExternalStore).

> הערה
>
> `useSyncExternalStore` מיועד להיות used על ידי ספריות, לא יישום קוד.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` הוא Hook חדש המאפשר לספריות CSS-in-JSfeler בבעיות ביצועים של הזרקת סגנונות בעיבוד. אלא אם כן כבר בנית ספריית CSS-in-JS, אנחנו לא מצפים ממך אי פעם use זה. Hook זה יפעל לאחר שה-DOM יעבור מוטציה, אך לפני אפקטי פריסה קראה את הפריסה החדשה. זה פותר בעיה מופיעה ב-React 17 ומטה, אבל חשובה עוד יותר ב-React 18 כי use React תשואות לדפדפן בהמשך העיבוד, מה שנותן לו הזדמנות לחשב מחדש את הפריסה. [ראה מסמכים כאן](/reference/react/useInsertionEffect).

> הערה
>
> `useInsertionEffect` מיועד להיות used על ידי ספריות, לא יישום קוד.

## איך לשדרג {/*how-to-upgrade*/}

ראה [כיצד לשדרג לReact 18](/blog/2022/03/08/react-18-upgrade-guide) לקבלת הוראות שלב אחר שלב ורשימה מלאה של שינויים פורצים ובולטים.

## יומן שינויים {/*changelog*/}

### React {/*react*/}

* הוסף `useTransition` ו-`useDeferredValue` כדי להפריד בין עדכונים דחופים למעברים. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](__#TK_8__3__3__3__3) [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](__TK_14_6 מאת https://github.com/facebook/react/pull/20672),] [____TK_3](@acdlite) [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), ו-[@sebmarkbage](https://github.com/sebmarkbage))
* הוסף `useId` ליצירת מזהים ייחודיים. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) מאת [@acdlite](__TK_4uan____ [@sebmarkbage](https://github.com/sebmarkbage))
* הוסף `useSyncExternalStore` כדי לעזור לספריות חנויות חיצוניות להשתלב עם React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](__#03__52K__T מא. [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), ו-[@drarmstr](https://github.com/drarmstr))
* הוסף `startTransition` כגרסה של `useTransition` ללא משוב ממתין. ([#19696](https://github.com/facebook/react/pull/19696) מאת [@rickhanlonii](https://github.com/rickhanlonii))
* הוסף `useInsertionEffect` עבור ספריות CSS-in-JS. ([#21913](https://github.com/facebook/react/pull/21913) מאת [@rickhanlonii](https://github.com/rickhanlonii))
* צור אפקטי פריסה מחדש של Suspense כאשר התוכן מופיע שוב.  ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) מאת [@acdlite](__TK___6K ו-__TK_6T [@lunaruan](https://github.com/lunaruan))
* הפעל מחדש את `<StrictMode>` אפקטים כדי לבדוק אם יש state אפשר לשחזר. ([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418) מאת [@bvaughn](https://github.com/bvaughn) ו-[@lunaruan](https://github.com/lunaruan))
* נניח שסמלים זמינים תמיד. ([#23348](https://github.com/facebook/react/pull/23348) מאת [@sebmarkbage](https://github.com/sebmarkbage))
* הסר `object-assign` polyfill. ([#23351](https://github.com/facebook/react/pull/23351) מאת [@sebmarkbage](https://github.com/sebmarkbage))
* הסר `unstable_changedBits` API לא נתמך.  ([#20953](https://github.com/facebook/react/pull/20953) מאת [@acdlite](https://github.com/acdlite))
* אפשר לרכיבים להפוך ללא הגדרות. ([#21869](https://github.com/facebook/react/pull/21869) מאת [@rickhanlonii](https://github.com/rickhanlonii))
* ניקוי `useEffect` הנובע מאירועים בדידים כמו קליקים באופן סינכרוני. ([#21150](https://github.com/facebook/react/pull/21150) מאת [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` מתנהג עכשיו כמו `null` ולא מתעלמים ממנו. ([#21854](https://github.com/facebook/react/pull/21854) מאת [@rickhanlonii](https://github.com/rickhanlonii))
* שקול את כל `lazy()` פתרון לאותו רכיב שווה ערך. ([#20357](https://github.com/facebook/react/pull/20357) מאת [@sebmarkbage](https://github.com/sebmarkbage))
* אל תתקן את הקונסולה הראשון. ([#22308](https://github.com/facebook/react/pull/22308) מאת [@lunaruan](https://github.com/lunaruan))
* שפר את הפעלה memory. ([#21039](https://github.com/facebook/react/pull/21039) מאת [@bgirard](https://github.com/bgirard))
* שפר הודעות אם כפיית מחרוזת זורקת (זמני.*, סמל וכו') ([#22064](https://github.com/facebook/react/pull/22064) מאת [@justingrant](https://github.com/justingrant))
* השתמש ב-`setImmediate` כאשר זמין מעל `MessageChannel`. ([#20834](https://github.com/facebook/react/pull/20834) מאת [@gaearon](https://github.com/gaearon))
* תקן הקשר שלא מצליח להתפשט בתוך עצים תלויים. ([#23095](https://github.com/facebook/react/pull/23095) מאת [@gaearon](https://github.com/gaearon))
* תקן את `useReducer` בהתבוננות ב-props שגוי על ידי הסרת מנגנון החילוץ הנלהב. ([#22445](https://github.com/facebook/react/pull/22445) מאת [@josephsavona](https://github.com/josephsavona))
* תקן את ההתעלמות של `setState` ב-Safari בעת הוספת iframes. ([#23111](https://github.com/facebook/react/pull/23111) מאת [@gaearon](https://github.com/gaearon))
* תקן קריסה בעת עיבוד `ZonedDateTime` בעץ. ([#20617](https://github.com/facebook/react/pull/20617) מאת [@dimaqq](https://github.com/dimaqq))
* תקן קריסה כאשר ההגדרה מוגדרת ל-`null` בבדיקות. ([#22695](https://github.com/facebook/react/pull/22695) מאת [@SimenB](https://github.com/SimenB))
* `onLoad` לא מופעל כאשר תקן פעולות פועלות. ([#23316](https://github.com/facebook/react/pull/23316) מאת [@gnoff](https://github.com/gnoff))
* תקן אזהרה כאשר בורר מחזיר `NaN`.  ([#23333](https://github.com/facebook/react/pull/23333) מאת [@hachibeeDI](https://github.com/hachibeeDI))
* תקן קריסה כאשר ההגדרה מוגדרת ל-`null` בבדיקות. ([#22695](https://github.com/facebook/react/pull/22695) מאת [@SimenB](https://github.com/SimenB))
* תקן את כותרת הרישיון האדם. ([#23004](https://github.com/facebook/react/pull/23004) מאת [@vitaliemiron](https://github.com/vitaliemiron))
* הוסף `package.json` כאחת מנקודות הכניסה. ([#22954](https://github.com/facebook/react/pull/22954) מאת [@Jack](https://github.com/Jack-Works))
* אפשר השעיה מחוץ לגבול Suspense. ([#23267](https://github.com/facebook/react/pull/23267) מאת [@acdlite](https://github.com/acdlite))
* רישום שגיאה הניתנת לשחזור בכל פעם שהידרציה נכשלת. ([#23319](https://github.com/facebook/react/pull/23319) מאת [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* הוסף `createRoot` ו-`hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/12117),1__16__) [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](__TK_16_2_#5__14__] [#____K_87] [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) מאת [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](__TK_Kuan_2__](@lun_21__i] [@lun_21__i] [6____TKi_2] [@trueadm](https://github.com/trueadm), ו-[@sebmarkbage](https://github.com/sebmarkbage))
* הוסף הידרציה סלקטיבית. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416),9_6](https://github.com/facebook/react/pull/22416),9_6)(https://github.com/facebook/react/pull/16880),8 [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) מאת [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), ו-[3____Tbag)
* הוסף את `aria-description` לרשימת תכונות ה-ARIA הידועות. ([#22142](https://github.com/facebook/react/pull/22142) מאת [@mahyareb](https://github.com/mahyareb))
* הוסף אירוע `onResize` לרכיבי וידאו. ([#21973](https://github.com/facebook/react/pull/21973) מאת [@rileyjshaw](https://github.com/rileyjshaw))
* הוסף `imageSizes` ו`imageSrcSet` ל-props הידוע. ([#22550](https://github.com/facebook/react/pull/22550) מאת [@eps1lon](https://github.com/eps1lon))
* אפשר `<option>` ילדים צריכים מחרוזים אם `value` מסופק.  ([#21431](https://github.com/facebook/react/pull/21431) מאת [@sebmarkbage](https://github.com/sebmarkbage))
* תיקון סגנון `aspectRatio` לא מוחל. ([#21100](https://github.com/facebook/react/pull/21100) מאת [@gaearon](https://github.com/gaearon))
* אזהרה אם נקרא `renderSubtreeIntoContainer`. ([#23355](https://github.com/facebook/react/pull/23355) מאת [@acdlite](https://github.com/acdlite))

### React DOM שרת {/*react-dom-server-1*/}

* הוסף את מעבד הסטרימינג החדש. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257),6_6](#2__7K_3__](https://github.com/facebook/react/pull/21257),6_6](#2__7K_3__](#2__44_7) [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) מאת [@sebmarkbage](https://github.com/sebmarkbage))
* תקן ספקי הקשר ב-SSR בעת טיפול בבקשות מרובות. ([#23171](https://github.com/facebook/react/pull/23171) מאת [@fandiox](https://github.com/frandiox))
* חזור לעיבוד על אי התאמה של טקסט. ([#23354](https://github.com/facebook/react/pull/23354) מאת [@acdlite](https://github.com/acdlite))
* הוצא משימוש `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359) מאת [@sebmarkbage](https://github.com/sebmarkbage))
* תקן יומן שגיאות מזויף במעבד השרת החדש. ([#24043](https://github.com/facebook/react/pull/24043) מאת [@eps1lon](https://github.com/eps1lon))
* תקן באג במעבד השרת החדש. ([#22617](https://github.com/facebook/react/pull/22617) מאת [@shuding](https://github.com/shuding))
* התעלם מערכי פונקציות וסמלים בתוך אלמנטים מותאמים אישית בשרת. ([#21157](https://github.com/facebook/react/pull/21157) מאת [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM כלי בדיקה {/*react-dom-test-utils*/}

* זרוק כאשר `act` הוא used בייצור. ([#21686](https://github.com/facebook/react/pull/21686) מאת [@acdlite](https://github.com/acdlite))
* תמיכה בהשבתת אזרות מעשה מזויף עם `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561) מאת [@acdlite](https://github.com/acdlite))
* אזהרת מעשה הרחב לכיסוי כל APIs שעלולים לתזמן עבודה של React. ([#22607](https://github.com/facebook/react/pull/22607) מאת [@acdlite](https://github.com/acdlite))
* בצע עדכוני אצווה `act`. ([#21797](https://github.com/facebook/react/pull/21797) מאת [@acdlite](https://github.com/acdlite))
* הסר אזהרה מפני השפעות פסיביות משתלשלות. ([#22609](https://github.com/facebook/react/pull/22609) מאת [@acdlite](https://github.com/acdlite))

### React רענן {/*react-refresh*/}

* עקוב אחר שורשים שהוא תקנו מאוחר ב-Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740) מאת [@anc95](https://github.com/anc95))
* הוסף את השדה `exports` ל-`package.json`. ([#23087](https://github.com/facebook/react/pull/23087) מאת [@otakustay](https://github.com/otakustay))

### רכיבי שרת (ניסיוני) {/*server-components-experimental*/}

* הוסף תמיכה בהקשר שרת. ([#23244](https://github.com/facebook/react/pull/23244) מאת [@salazarm](https://github.com/salazarm))
* הוסף תמיכה ב-`lazy`. ([#24068](https://github.com/facebook/react/pull/24068) מאת [@gnoff](https://github.com/gnoff))
* עדכן את הפלאגין webpack עבור webpack 5 ([#22739](https://github.com/facebook/react/pull/22739) מאת [@michenly](https://github.com/michenly))
* תקן טעות ב-Node loader. ([#22537](https://github.com/facebook/react/pull/22537) מאת [@btea](https://github.com/btea))
* השתמש ב-`globalThis` במקום ב-`window` עבור סביבות קצה. ([#22777](https://github.com/facebook/react/pull/22777) מאת [@huozhi](https://github.com/huozhi))
