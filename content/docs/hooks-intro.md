---
id: hooks-intro
title: היכרות עם Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks* הם תוספת חדשה ב-React 16.8. הם נותנים לך להשתמש ב-state ובתכונות של React מבלי לכתוב מחלקה.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // “count” חדש, אשר נקרא state הצהר על משתנה
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

הפונקציה החדשה הזאת `useState` היא ה-“Hook" הראשון שנלמד. דוגמא זו היא רק הצצה, אל תדאג אם זה עדיין לא נשמע הגיוני!

**אתה יכול להתחיל ללמוד Hooks [בעמוד הבא](/docs/hooks-overview.html).** בעמוד זה, נמשיך להסביר למה הוספנו את Hooks ל-React ואיך הם יכולים לעזור לך לכתוב אפליקציות מעולות.

>הערה
>
>React 16.8.0 היא הגרסה הראשונה שתומכת ב-Hooks. בעת שדרוג, אל תשכח לעדכן את כל הספריות, כולל React DOM.
>React Native תומכת ב-Hooks מאז [שחרור גרסה 0.59](reactnative.de/blog/2019/03/12/releasing-react-native-059).

## מבוא וידאו {#video-introduction}

ב-Sophie Alpert, React Conf 2018  ו-Dan Abramov הציגו את Hooks, אחרייהם Ryan Florence הדגים איך לשכתב אפליקציה ולהשתמש בהם. צפו בסרטון כאן:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## אינו שובר תאימות לאחור {#no-breaking-changes}

לפני שנמשיך, שים לב ש-Hooks הם:

* **בחירה לחלוטין.** אתה יכול לנסות את Hooks בכמה קומפוננטות מבלי לשכתב שורת קוד. אבל אתה לא חייב ללמוד או להשתמש ב-Hooks כרגע אם אתה לא רוצה.
* **100% תואם לאחור.** Hooks אינם מכילים עדכונים שוברי תאימות לאחור.
* **זמין כעת.** Hooks כעת זמינים עם גרסא v16.8.0.

**אין תוכניות להסיר את המחלקות מ-React.** אתה יכול לקרוא על אסטרטגיית אימוץ הדרגתית בשביל Hooks [בחלק התחתון](#gradual-adoption-strategy) של הדף.

**Hooks אינם מחליפים את הידע שלך בקונספטים של React.** במקום זאת, Hooks מספקים API ישיר יותר לקונספטים של React שאתה כבר מכיר: props, state, context, refs ומחזור חיים. כפי שנראה בהמשך, Hooks גם מציעים דרך חדשה וחזקה כדי לשלב אותם.

**אם אתה רק רוצה להתחיל ללמוד Hooks, תרגיש חופשי [לקפוץ ישירות לעמוד הבא!](/docs/hooks-overview.html)** אתה יכול גם להמשיך לקרוא את העמוד הזה וללמוד למה אנחנו מוסיפים את Hooks, ואיך אנחנו הולכים להשתמש בהם מבלי לשכתב את האפליקציה שלנו.

## מוטיבציה {#motivation}

Hooks פותר מגוון רחב לכאורה של בעיות שלא קשורות אחת לשנייה ב-React אשר נתקלנו בהן במשך חמש שנים של כתיבה ותחזוקה של עשרות אלפי קומפוננטות. בין אם אתה לומד React, משתמש על בסיס יום יומי,  או אפילו מעדיף ספרייה אחרת עם מודל קומפוננטה דומה, ייתכן שתזהה חלק מבעיות אלו.

### קשה לעשות שימוש חוזר בלוגיקה בין קומפוננטות {#its-hard-to-reuse-stateful-logic-between-components}

React אינו מציע דרך ״לצרף״ התנהגות חוזרת לקומפוננטה (לדוגמא,  לחבר אותה לstore). אם עבדת עם React זמן מה, אתה עשוי להכיר תבניות כמו [render props](/docs/render-props.html) ו-[higher-order components](/docs/higher-order-components.html) אשר מנסות לפתור זאת. אבל תבניות אילו דורשות ממך לארגן מחדש את הקומפוננטה שלך כאשר אתה משתמש בהן, אשר יכול להיות מסורבל והופך את הקוד לקשה יותר לעקיבה. אם תסתכל על אפלייקצית React טיפוסית ב-React DevTools, סביר להניח שתמצא ״wrapper hell״ של קומפוננטות שמוקפות בשכבות של providers, consumers, higher-order components, render props ועוד. בזמן שיכלנו [לסנן אותם מDevTools](https://github.com/facebook/react-devtools/pull/503), זה מצביע על בעיה עמוקה יותר: React זקוק לפרימיטיב טוב יותר בשביל שיתוף הלוגיקה.

עם Hooks, אתה יכול לחלץ לוגיקה מקומפוננטה כך שתוכל להבדק בצורה עצמאית ולהשתמש בה שנית. **Hooks מאפשר לך לעשות שימוש חוזר בלוגיקה מבלי לשנות את ההירכייה בקומפוננטה.** זה הופך את Hooks לפשוט יותר לשיתוף בין קומפוננטות והקהילה.

נדון על כך יותר ב[בניית Hooks משלך](/docs/hooks-custom.html).

### קומפוננטות מורכבות הופכות קשות להבנה {#complex-components-become-hard-to-understand}

לעיתים קרובות נאלצנו לתחזק קומפוננטות שהתחילו כפשוטות וגדלו לבלאגן בלתי נשלט של לוגיקה ו-side effects. כל מתודה במחזור החיים לעיתים קרובות הכילה ערבוב של לוגיקה לא קשורה. לדוגמא, קומפוננטות עשויות לבצע משיכת נתונים ב`componentDidMount`  וב-`componentDidUpdate`. למרות זאת, `componentDidMount` עשויה להכיל גם לוגיקה לא קשורה אשר מגדירה מנהלי אירועים, עם ביצוע ניקוי ב-`componentWillUnmount`. קטעי קוד שקשורים אחד לשני מתפצלים, אבל קוד שלחלוטין איננו קשור מתאחד למתודה אחת. זה הופך את זה לקל יותר להצגת באגים וחוסר עקביות.

במקרים רבים זה לא אפשרי להפריד קומפוננטות אלו לקטנות יותר מכיוון שהלוגיקה נמצאת בכל מקום. זה גם קשה לבדוק אותן. זאת אחת הסיבות שהרבה אנשים מעדיפים לשלב את React עם ספריית ניהול state נפרדת. למרות זאת, לעיתים קרובות זה גם מציג יותר מידי אבסטרקציה, דורש ממך לקפוץ בין קבצים, ויוצר את ההמצב בושימוש חוזר בקומפוננטות קשה יותר.

כדי לפתור זאת, **Hooks נותן לנו לפצל קומפוננטה אחת לכמה פונקציות קטנות יותר בהתבסס על הקשרם (כמו להגדיר subscription או משיכת נתונים)**, במקום להכריח פיצול המבוסס מתודות במחזור החיים.  תוכל לבחור  לנהל ה-state המקומי של הקומפוננטה בעזרת reducer כדי להפוך אותה לצפוייה יותר.

נדון על כך יותר ב[שימוש ב-Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### מחלקות מבלבלות גם אנשים וגם את המכונות {#classes-confuse-both-people-and-machines}

בנוסף לכתיבת קוד לשימוש חוזר וארגון קוד קשה יותר, מצאנו שמחלקות יכולות להיות מכשול גדול בלמידת React. אתה חייב להבין איך `this` עובד ב-JavaScript, אשר שונה מאוד מאיך שהוא עובד ברוב השפות. אתה חייב לזכור לעשות bind למנהלי אירועים. מבלי [תחביר מוצע](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) לא יציב, הקוד מאוד מבולגן. אנשים יכולים להבין props, state וזרימת מידע מלמעלה-למטה בצורה טובה אבל עדיין מתקשים עם מחלקות. ההבחנה בין קומפוננטת מחלקה או פונקציה ב-React ומתי להשתמש בכל אחת הובילה לחילוקי דעות בין מתכנתי React מנוסים.

בנוסף, React כבר 5 שנים בחוץ, ואנחנו רוצים שישאר רלוונטי ל-5 שנים הבאות. כפי ש-[Svelte](https://svelte.dev/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), ואחרים הציגו, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) של קומפוננטות יש עתיד פוטנציאלי. במיוחד אם זה לא מגביל לתבניות. לאחרונה התחלנו להתנסות עם [component folding](https://github.com/facebook/react/issues/7323) באמצעות [Prepack](https://prepack.io/), וראינו תוצאות מוקדמות מבטיחות. למרות זאת,  מצאנו שקומפוננטת מחלקה יכולה לעודד תבניות לא מכוונות אשר יוצרות אופטימיזציה שיוצרת נתיב איטי. מחלקות מציגות את הבעיות עבור הכלים של היום. לדוגמא, מחלקות לא מצטמצמות כל כך טוב, והופכות את hot reloading לשברירי ולא אמין. אנחנו רוצים להציג API אשר נותן לקוד להשאר על נתיב האופטימיזציה.

כדי לפתור בעיות אילו, Hooks נותן לך להשתמש ביותר תכונות של React בלי מחלקות. מבחינת תפיסתית, קומפוננטות React תמיד היו יותר קרובות לפונקציות. Hooks אימץ את הפונקציות, מבלי להקריב את הרוח המעשית של Hooks .React מספק לנו גישה לפתחי מילוט הכרחיים ולא מכריח אותנו ללמוד טכניקות תכנות ריאקטיביות או פונקציונאליות מסובכות.

>דוגמאות
>
>[Hooks במבט מהיר](/docs/hooks-overview.html) הוא מקום טוב להתחיל ללמוד Hooks.

## אסטרטגיית אימוץ הדרגתית {#gradual-adoption-strategy}

>**אמ;לק: אין תוכניות להסיר את המחלקות מ-React.**

אנחנו יודעים שמפתחי React ממוקדים ביצירת מוצרים ואין להם זמן להסתכל על כל API חדש שאנו משחררים. Hooks חדש מאוד, וזה יהיה טוב יותר לחכות ליותר דוגמאות ומדריכים לפני ששוקלים ללמוד או לאמץ אותם.

אנו גם מבינים שהרף להוספת פרימיטיב חדש ל-React הוא ממש גבוה. לקוראים סקרנים, הכנו [RFC מפורט](https://github.com/reactjs/rfcs/pull/68) אשר צולל ליותר פרטים, ומספק פרספקטיבה נוספת על החלטות העיצוב הספציפיות ואומנות קודמת בנושא.

<<<<<<< HEAD
**באופן מכריע, Hooks עובד לצד קוד קיים אז אתה יכול לאמץ אותם בהדרגה.** אין צורך למהר לעבור ל-Hooks. אנו ממליצים להמנע מכל ״שכתוב גדול״, במיוחד בשביל קומפוננטה מחלקה מסובכת קיימת. זה לוקח קצת זמן בשינוי מחשבתי להתחיל ״לחשוב ב-Hooks״. מנסיונינו, זה הכי טוב להתרגל להשתמש בהתחלה ב-Hooks בקומפוננטה חדשה ולא קריטית, ולהבטיח שכולם בצוות שלך מרגישים בנוח איתם. אחרי שנתתם ל-Hooks ניסיון בבקשה תרגישו חופשי [לשלוח אלינו משוב](https://github.com/facebook/react/issues/new), חיובי או שלילי.
=======
**Crucially, Hooks work side-by-side with existing code so you can adopt them gradually.** There is no rush to migrate to Hooks. We recommend avoiding any "big rewrites", especially for existing, complex class components. It takes a bit of a mind shift to start "thinking in Hooks". In our experience, it's best to practice using Hooks in new and non-critical components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to [send us feedback](https://github.com/facebook/react/issues/new), positive or negative.
>>>>>>> 95e15d063b205007a92c52efb5311f76ad5a0b6c

אנחנו מתכוונים ב-Hooks לכסות את כל מקרי השימוש שיש במחלקות, אבל **אנו נמשיך לתמוך בקומפוננטת מחלקה בשביל העתיד הצפוי**. בפייסבוק, יש לנו עשרות אלפים של קומפוננטות שנכתבו במחלקות, ואין לנו בהחלט אף תוכנית לשכתב אותם. במקום זאת אנו מתחילים להשתמש ב-Hooks בקוד החדש לצד המחלקות.

## שאלות נפוצות {#frequently-asked-questions}

הכנו  [עמוד Hooks FAQ](/docs/hooks-faq.html) אשר עונה על רוב השאלות הנפוצות על Hooks.

## הצעדים הבאים {#next-steps}

בסופו של דף זה, צריך להיות לך מושג מה הבעיה ש-Hooks פותרים, אבל פרטים רבים עדיין לא ברורים, אל דאגה! **בואו נמשיך [לעמוד הבא](/docs/hooks-overview.html), בו אנו נתחיל ללמוד על Hooks על פי דוגמאות.**
