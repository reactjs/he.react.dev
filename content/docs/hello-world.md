---
id: hello-world
title: שלום עולם
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

הדוגמה הקטנה ביותר ב-React נראית כך:

```js
ReactDOM.render(
  <h1>שלום עולם</h1>,
  document.getElementById('root')
);
```

היא מראה את הכותרת ״שלום עולם״ על הדף.

[נסו את זה ב-CodePen](codepen://hello-world)

לחצו על הקישור למעלה כדי לפתוח עורך אונליין. תרגישו בנוח לעשות כמה שינויים כדי שתראו איך הם משנים את התוצאה. לרוב העמודים במדריך הזה יהיו דוגמאות שניתנות לעריכה.


## כיצד לקרוא מדריך זה {#how-to-read-this-guide}

במדריך אנו נבחן את החלקים של אפליקציות React: יסודות וקומפוננטות. ברגע שתשלטו בהם תוכלו ליצור אפליקציות מורכבות בעזרת חלקים קטנים ועל ידי שימוש חוזר בהם.

>עצה
>
>מדריך זה נועד לאנשים שמעדיפים **ללמוד רעיונות צעד אחר צעד**. אם הנכם מעדיפים ללמוד על ידי עשייה, בדקו את [המדריך המעשי](/tutorial/tutorial.html) שלנו. ייתכן שתמצאו שהמדריך וההדרכה המעשית משלימים אחד את השני.

זה הפרק הראשון במדריך שמלמד צעד אחר צעד על הרעיונות העיקריים של React. תוכלו למצוא רשימה של כל הפרקים בסרגל הניווט. אם אתם קוראים את זה ממכשיר נייד, אתם יכולים להיכנס לניווט על ידי לחיצה על הכפתור הנמצא בצד הימני של תחתית המסך.

כל פרק במדריך זה נבנה על הידע שהוצג בפרקים קודמים. **אתם יכולים ללמוד את רוב React על ידי קריאת פרקי ״קונספטים עיקריים״ לפי סדר הופעתם בסרגל**. לדוגמא, ["היכרות עם JSX"](/docs/introducing-jsx.html) הוא הפרק הבא.

## הערכת רמת הידע {#knowledge-level-assumptions}

React היא ספריית JavaScript, לכן אנו מניחים שיש לכם הבנה בסיסית של שפת JavaScript. **אם אינכם מרגישים בטוחים בעצמכם אנו ממליצים [שתעברו על מדריך JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) על מנת לבדוק רמת הידע שלכם** ולאפשר לכם לעקוב אחר המדריך בלי ללכת לאיבוד. זה יכול לקחת 30 דקות עד שעה, אבל כתוצאה, לא תרגישו שאתם לומדים גם React וגם JavaScript באותו הזמן.

>הערה
>
<<<<<<< HEAD
>מדי פעם, המדריך הזה משתמש בתחביר JavaScript חדש בדוגמאות. אם לא עבדתם עם JavaScript בשנים האחרונות, [שלושת הנקודות האלו](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c) אמורות לעדכן אתכם. 
=======
>This guide occasionally uses some newer JavaScript syntax in the examples. If you haven't worked with JavaScript in the last few years, [these three points](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c) should get you most of the way.
>>>>>>> f3baa6d075c8de475b688abf035d7054bc8a9606


## בואו נתחיל! {#lets-get-started}

המשיכו לגלול ותמצאו את הקישור [לפרק הבא במדריך זה](/docs/introducing-jsx.html), מיד לפניי התחתית של האתר.
