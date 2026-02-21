---
title: "סנכרון עם אפקטים"
---

<Intro>

חלק מהרכיבים צריכים להסתנכרן עם מערכות חיצוניות. לדוגמה, ייתכן שתרצה לשלוט ברכיב שאינו React בהתבסס על React state, להגדיר חיבור לשרת, או לשלוח יומן ניתוח כאשר רכיב מופיע על המסך. *אפקטים* מאפשרים לך להריץ קצת קוד לאחר רינדור כדי שתוכל לסנכרן את הרכיב שלך עם מערכת כלשהי מחוץ ל-React.

</Intro>

<YouWillLearn>

- מהם אפקטים
- כיצד אפקטים שונים מאירועים
- כיצד להכריז על אפקט ברכיב שלך
- כיצד לדלג על הפעלה מחדש של אפקט שלא לצורך
- מדוע אפקטים פועלים פעמיים בפיתוח וכיצד לתקן אותם

</YouWillLearn>

## מה הם אפקטים ובמה הם שונים מאירועים? {/*what-are-effects-and-how-are-they-different-from-events*/}

לפני שתגיעו לאפקטס, עליכם להכיר שני סוגים של לוגיקה בתוך רכיבי React:

- **קוד רינדור** (הוצג ב-[תיאור ממשק המשתמש](/learn/describing-the-ui)) נמצא ברמה העליונה של הרכיב שלך. זה המקום שבו אתה לוקח את props ואת state, להפוך אותם, ולהחזיר את JSX שאתה רוצה לראות על המסך. [קוד הרינדור חייב להיות טהור.](/learn/keeping-components-pure) כמו נוסחה מתמטית, הוא צריך רק _לחשב_ את התוצאה, אבל לא לעשות שום דבר אחר.

- **מטפלי אירועים** (הוצגו ב-[הוספת אינטראקטיביות](/learn/adding-interactivity)) הם פונקציות מקוננות בתוך הרכיבים שלך ש*עושים* דברים במקום רק מחשבות אותם. מטפל באירועים עשוי לעדכן שדה קלט, לשלוח בקשת HTTP POST לקניית מוצר, או לנווט את ה-user למסך אחר. מטפלי אירועים מכילים ["תופעות לוואי"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (הם משנים את ה-state של התוכנית) caused על ידי פעולת user ספציפית (לדוגמה, לחיצה על כפתור או הקלדה).

לפעמים זה לא מספיק. שקול רכיב `ChatRoom` שחייב להתחבר לשרת הצ'אט בכל פעם שהוא גלוי על המסך. חיבור לשרת הוא לא חישוב טהור (זו תופעת לוואי) ולכן זה לא יכול לקרות במהלך העיבוד. עם זאת, אין אירוע מסוים כמו קליק שמאפשר להציג uses `ChatRoom`.

***השפעות* מאפשרות לך לציין תופעות לוואי שהן caused על ידי עיבוד עצמו, ולא על ידי אירוע מסוים.** שליחת הודעה בצ'אט היא *אירוע* מכיוון שuse היא מתבצעת ישירות על ידי user לחיצה על כפתור ספציפי. עם זאת, הגדרת חיבור לשרת היא *אפקט* מכיוון שuse זה אמור לקרות לא משנה באיזו אינטראקציה יופיע הרכיב. אפקטים פועלים בסוף [commit](/learn/render-and-commit) לאחר עדכון המסך. זה זמן טוב לסנכרן את רכיבי React עם מערכת חיצונית כלשהי (כמו רשת או ספריית צד שלישי).

<Note>

כאן ומאוחר יותר בטקסט זה, "אפקט" באותיות רישיות מתייחס להגדרה הספציפית React לעיל, כלומר תופעת לוואי caused על ידי עיבוד. כדי להתייחס למושג התכנות הרחב יותר, נגיד "תופעת לוואי".

</Note>


## ייתכן שלא תצטרך אפקט {/*you-might-not-need-an-effect*/}

**אל תמהר להוסיף אפקטים לרכיבים שלך.** זכור כי אפקטים הם בדרך כלל used כדי "לצאת" מהקוד React שלך ולהסתנכרן עם מערכת *חיצונית* כלשהי. זה כולל APIs של דפדפן, ווידג'טים של צד שלישי, רשת וכן הלאה. אם האפקט שלך מתאים רק חלק מה-state על סמך state אחר, [ייתכן שלא תצטרך אפקט.](/learn/you-might-not-need-an-effect)

## איך לכתוב אפקט {/*how-to-write-an-effect*/}

כדי לכתוב אפקט, בצע את שלושת השלבים הבאים:

1. **הכרז על אפקט.** כברירת מחדל, האפקט שלך יפעל לאחר כל רינדור.
2. **ציין את התלות של אפקט.** רוב האפקטים צריכים להפעיל מחדש רק *במידת הצורך* ולא אחרי כל רינדור. לדוגמה, אנימציית דהייה צריכה להפעיל רק כאשר מופיע רכיב. חיבור וניתוק לחדר צ'אט אמור לקרות רק כאשר הרכיב מופיע ונעלם, או כאשר חדר הצ'אט משתנה. תלמד כיצד לשלוט בכך על ידי ציון *תלות.*
3. **הוסף ניקוי במידת הצורך.** חלק מהאפקטים צריכים לציין כיצד לעצור, לבטל או לנקות את כל מה שהם עשו. לדוגמה, "התחבר" צריך "נתק", "הירשם" צריך "בטל מנוי", ו"אחזור" צריך "בטל" או "התעלם". תלמד כיצד לעשות זאת על ידי החזרת *פונקציית ניקוי*.

בואו נסתכל על כל אחד מהשלבים הללו בפירוט.

### שלב 1: הכרזה על אפקט {/*step-1-declare-an-effect*/}

כדי להכריז על אפקט ברכיב שלך, ייבא את [`useEffect` Hook](/reference/react/useEffect) מ-React:

```js
import { useEffect } from 'react';
```

לאחר מכן, קרא לזה ברמה העליונה של הרכיב שלך והכנס קצת קוד בתוך האפקט שלך:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

בכל פעם שהרכיב שלך מעבד, React יעדכן את המסך *ואז* יפעיל את הקוד בתוך `useEffect`. במילים אחרות, **`useEffect` "מעכב" קטע קוד מהפעלתו עד שהעיבוד הזה ישתקף על המסך.**

בוא נראה איך אתה יכול use אפקט לסנכרן עם מערכת חיצונית. שקול רכיב `<VideoPlayer>` React. זה יהיה נחמד לשלוט אם זה משחק או paused על ידי העברת אביזר `isPlaying` אליו:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

רכיב `VideoPlayer` המותאם אישית שלך מעבד את הדפדפן המובנה [`<video>`] (תג https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video):

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

עם זאת, לתג הדפדפן `<video>` אין אבזר `isPlaying`. הדרך היחידה לשלוט בו היא לקרוא ידנית לשיטות [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ו-[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) באלמנט DOM. **עליך לסנכרן את הערך של `isPlaying` prop, שאומר אם הסרטון _צריך_ להתנגן כרגע, עם שיחות כמו __TK___ ו__TK_5

נצטרך תחילה [לשיג ref](/learn/manipulating-the-dom-with-refs) לצומת `<video>` DOM.

ייתכן שתתפתה לנסות להתקשר ל-`play()` או `pause()` במהלך העיבוד, אבל זה לא נכון:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

הסיבה שהקוד הזה לא נכון היא שהוא מנסה לעשות משהו עם הצומת DOM במהלך העיבוד. ב-React, [העיבוד צריך להיות חישוב טהור](/learn/keeping-components-pure) של JSX ולא אמור להכיל תופעות לוואי כמו שינוי ה-DOM.

יתרה מכך, כאשר קוראים ל-`VideoPlayer` בפעם הראשונה, ה-DOM שלו עדיין לא קיים! אין עדיין צומת DOM להתקשר ל-`play()` או `pause()`, כי use React לא יודע איזה DOM ליצור עד שתחזיר את ה-JSX.

הפתרון כאן הוא **לעטוף את תופעת הלוואי ב-`useEffect` כדי להוציא אותה מחישוב העיבוד:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

על ידי עטיפה של עדכון DOM באפקט, אתה נותן ל-React לעדכן את המסך תחילה. ואז האפקט שלך פועל.

כאשר רכיב ה-`VideoPlayer` שלך יוצג (בפעם הראשונה או אם הוא מעבד מחדש), יקרו כמה דברים. ראשית, React יעדכן את המסך, ויוודא שהתג `<video>` נמצא ב-DOM עם ה-props הנכון. ואז React יפעיל את האפקט שלך. לבסוף, האפקט שלך יקרא `play()` או `pause()` בהתאם לערך של `isPlaying`.

לחץ על Play/Pause מספר פעמים וראה כיצד נגן הווידאו נשאר מסונכרן לערך `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

בדוגמה זו, "המערכת החיצונית" שסינכרנת ל-React state הייתה מדיה הדפדפן API. אתה יכול use גישה דומה לעטוף קוד מדור קודם שאינו React (כמו תוספי jQuery) לתוך רכיבי React הצהרתיים.

שימו לב ששליטה בנגן וידאו היא הרבה יותר מורכבת בפועל. קריאת `play()` עלולה להיכשל, ה-user עשוי לשחק או pause באמצעות פקדי הדפדפן המובנים, וכן הלאה. דוגמה זו היא מאוד פשוטה ולא שלמה.

<Pitfall>

כברירת מחדל, אפקטים פועלים לאחר *כל* רינדור. זו הסיבה שקוד כזה **ייצר לולאה אינסופית:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

אפקטים פועלים כ*תוצאה* של רינדור. הגדרת state *מפעילה* רינדור. הגדרה של state מיד באפקט היא כמו לחבר שקע חשמל לתוך עצמו. האפקט פועל, הוא מגדיר את state, אשר causes עיבוד מחדש, אשר causes את האפקט לרוץ, הוא מגדיר את state שוב, זה causes עוד עיבוד מחדש, וכן הלאה.

אפקטים צריכים בדרך כלל לסנכרן את הרכיבים שלך עם מערכת *חיצונית*. אם אין מערכת חיצונית ואתה רוצה להתאים רק חלק מה-state על סמך state אחר, [ייתכן שלא תזדקק לאפקט.](/learn/you-might-not-need-an-effect)

</Pitfall>

### שלב 2: ציין את תלות האפקט {/*step-2-specify-the-effect-dependencies*/}

כברירת מחדל, אפקטים פועלים לאחר *כל* רינדור. לעתים קרובות, זה **לא מה שאתה רוצה:**

- לפעמים זה איטי. סנכרון עם מערכת חיצונית אינו תמיד מיידי, אז אולי כדאי לך לדלג על ביצועו אלא אם כן יש צורך בכך. לדוגמה, אינך רוצה להתחבר מחדש לשרת הצ'אט בכל הקשה.
- לפעמים זה לא בסדר. לדוגמה, אינך רוצה להפעיל אנימציית דהיית רכיב בכל הקשה. האנימציה אמורה להפעיל פעם אחת בלבד כאשר הרכיב מופיע בפעם הראשונה.

כדי להדגים את הבעיה, הנה הדוגמה הקודמת עם כמה קריאות `console.log` וקלט טקסט שמעדכן את ה-state של רכיב האב. שימו לב כיצד הקלדת cause תגרום להפעלה מחדש של האפקט:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

אתה יכול להגיד לReact **לדלג על הפעלה מחדש שלא לצורך של האפקט** על ידי ציון מערך של *תלות* כארגומנט השני לקריאה `useEffect`. התחל על ידי הוספת מערך `[]` ריק לדוגמה לעיל בשורה 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

אתה אמור לראות שגיאה האומרת `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

הבעיה היא שהקוד שבתוך האפקט שלך *תלוי* באבזר `isPlaying` כדי להחליט מה לעשות, אבל התלות הזו לא הוכרזה במפורש. כדי לתקן בעיה זו, הוסף את `isPlaying` למערך התלות:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

כעת כל התלות מוצהרות, כך שאין שגיאה. ציון `[isPlaying]` כמערך התלות אומר לReact שעליו לדלג על הפעלת האפקט מחדש אם `isPlaying` זהה לזה שהיה במהלך העיבוד הקודם. עם השינוי הזה, הקלדה בקלט לא מאפשרת ל-TK_3__ להפעיל מחדש את האפקט, אבל לחיצה על Play/Pause עושה:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

מערך התלות יכול להכיל מספר תלות. React ידלג על הפעלה מחדש של האפקט רק אם *כל* התלות שאתה מציין הם בעלי אותם ערכים בדיוק כמו שהיו להם במהלך העיבוד הקודם. React משווה את ערכי התלות באמצעות ההשוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). עיין בהפניה [`useEffect`](/reference/react/useEffect#reference) לפרטים.

**שים לב שאינך יכול "לבחור" את התלות שלך.** תקבל שגיאת מוך אם התלות שציינת אינן תואמות למה שReact מצפה בהתבסס על הקוד בתוך האפקט שלך. זה עוזר לתפוס באגים רבים בקוד שלך. אם אינך רוצה שקוד כלשהו יפעל מחדש, [*ערוך את קוד האפקט עצמו* כדי שלא "יזדקק" לתלות הזו.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

ההתנהגויות ללא מערך התלות ועם מערך התלות *ריק* `[]` שונות:

```js {3,7,11}
useEffect(() => {
  // This runs after every render
});

useEffect(() => {
  // This runs only on mount (when the component appears)
}, []);

useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
```

נסתכל מקרוב על המשמעות של "הר" בשלב הבא.

</Pitfall>

<DeepDive>

#### מדוע ה-Ref הושמט ממערך התלות? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

אפקט זה uses _גם_ `ref` ו`isPlaying`, אבל רק `isPlaying` מוכרז כתלות:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

זה בגלל שuse לאובייקט `ref` יש *זהות יציבה:* React מבטיח [תמיד תקבל את אותו אובייקט](/reference/react/useRef#returns) מאותה קריאה `useRef` בכל עיבוד. זה אף פעם לא משתנה, אז זה לעולם לא יגרום כשלעצמו להפעיל מחדש את האפקט. לכן, זה לא משנה אם אתה כולל את זה או לא. כולל זה גם בסדר:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

לפונקציות [`set`](/reference/react/useState#setstate) המוחזרות על ידי `useState` יש גם זהות יציבה, כך שלעתים קרובות תראו אותן מושמטות גם מהתלות. אם ה-linter מאפשר לך להשמיט תלות ללא שגיאות, זה בטוח לעשות.

השמטת תלות יציבה תמיד עובדת רק כאשר ה-linter יכול "לראות" שהאובייקט יציב. לדוגמה, אם `ref` הועבר מרכיב אב, יהיה עליך לציין אותו במערך התלות. עם זאת, זה טוב כי_TK_1__ אתה לא יכול לדעת אם רכיב האב תמיד עובר את אותו השופט, או עובר אחד מכמה שופטים בתנאי. אז האפקט שלך _יהיה_ תלוי באיזה שופט מועבר.

</DeepDive>

### שלב 3: הוסף ניקוי במידת הצורך {/*step-3-add-cleanup-if-needed*/}

שקול דוגמה אחרת. אתה כותב רכיב `ChatRoom` שצריך להתחבר לשרת הצ'אט כשהוא מופיע. ניתן לך `createConnection()` API שמחזיר אובייקט בשיטות `connect()` ו`disconnect()`. איך שומרים על הרכיב מחובר בזמן שהוא מוצג ב-user?

התחל בכתיבת הלוגיקה של אפקט:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

זה יהיה איטי להתחבר לצ'אט אחרי כל עיבוד מחדש, אז אתה מוסיף את מערך התלות:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**הקוד בתוך האפקט אינו use כל props או state, כך שמערך התלות שלך הוא `[]` (ריק). זה אומר ל-React להפעיל את הקוד הזה רק כאשר הרכיב "מתעלה", כלומר מופיע על המסך בפעם הראשונה.**

בוא ננסה להריץ את הקוד הזה:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

אפקט זה פועל רק בהתקנה, כך שאתה עשוי לצפות ש-`"✅ Connecting..."` יודפס פעם אחת במסוף. **עם זאת, אם תבדוק את המסוף, `"✅ Connecting..."` מודפס פעמיים. למה זה קורה?**

תארו לעצמכם שהרכיב `ChatRoom` הוא חלק מאפליקציה גדולה יותר עם מסכים רבים ושונים. ה-user מתחיל את המסע שלהם בדף `ChatRoom`. הרכיב נטען וקורא ל-`connection.connect()`. לאחר מכן דמיינו שה-user מנווט למסך אחר - לדוגמה, לדף ההגדרות. הרכיב `ChatRoom` מתבטל. לבסוף, ה-user לוחץ על חזרה ו-`ChatRoom` עולה שוב. זה ייצור חיבור שני - אבל החיבור הראשון מעולם לא נהרס! בזמן שה-user מנווט על פני האפליקציה, החיבורים ימשיכו להצטבר.

קל לפספס באגים כאלה ללא בדיקה ידנית מקיפה. כדי לעזור לך לזהות אותם במהירות, בפיתוח React מעלה מחדש כל רכיב פעם אחת מיד לאחר הטעינה הראשונית שלו.

לראות את היומן `"✅ Connecting..."` פעמיים עוזר לך לשים לב לבעיה האמיתית: הקוד שלך לא סוגר את החיבור כאשר הרכיב מתנתק.

כדי לתקן את הבעיה, החזר *פונקציית ניקוי* מהאפקט שלך:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React יקרא לפונקציית הניקוי שלך בכל פעם לפני שהאפקט יפעל שוב, ופעם אחרונה כאשר הרכיב יתנתק (יוסר). בואו נראה מה קורה כאשר פונקציית הניקוי מיושמת:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

כעת אתה מקבל שלושה יומני מסוף בפיתוח:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**זו ההתנהגות הנכונה בפיתוח.** על ידי הרכבה מחדש של הרכיב שלך, React מאמת שניווט הרחק ואחורה לא ישבור את הקוד שלך. ניתוק ואז חיבור שוב זה בדיוק מה שצריך לקרות! כאשר אתה מיישם את הניקוי היטב, לא אמור להיות הבדל גלוי של user בין הפעלת האפקט פעם אחת לעומת הפעלתו, ניקויו והפעלתו שוב. יש צמד שיחות נוסף לחיבור/ניתוק מכיוון שuse React בודק את הקוד שלך לאיתור באגים בפיתוח. זה נורמלי - אל תנסה לגרום לזה להיעלם!

**בייצור, תראה את `"✅ Connecting..."` מודפס פעם אחת בלבד.** הרכבה מחדש של רכיבים מתרחשת רק בפיתוח כדי לעזור לך למצוא אפקטים שדורשים ניקוי. אתה יכול לכבות את [מצב קפדני](/reference/react/StrictMode) כדי לבטל את הסכמתך להתנהגות הפיתוח, אך אנו ממליצים להשאיר אותה פועלת. זה מאפשר לך למצוא באגים רבים כמו זה שלמעלה.

## כיצד להתמודד עם ירי האפקט פעמיים בפיתוח? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React מעלה מחדש את הרכיבים שלך בפיתוח כדי למצוא באגים כמו בדוגמה האחרונה. **השאלה הנכונה היא לא "איך להפעיל אפקט פעם אחת", אלא "איך לתקן את האפקט שלי כך שיעבוד לאחר הרכבה מחדש".**

בדרך כלל, התשובה היא ליישם את פונקציית הניקוי.  פונקציית הניקוי צריכה להפסיק או לבטל את כל מה שהאפקט עשה. כלל האצבע הוא שה-user לא אמור להיות מסוגל להבחין בין האפקט הפועל פעם אחת (כמו בהפקה) לבין _setup → cleanup → setup_ רצף (כפי שהייתם רואים בפיתוח).

רוב האפקטים שתכתוב יתאימו לאחת מהדפוסים הנפוצים למטה.

### שליטה בווידג'טים שאינם React {/*controlling-non-react-widgets*/}

לפעמים אתה צריך להוסיף ווידג'טים של ממשק משתמש שלא נכתבו ל-React. לדוגמה, נניח שאתה מוסיף רכיב מפה לדף שלך. יש לו שיטת `setZoomLevel()`, ואתה רוצה לשמור על רמת הזום מסונכרנת עם משתנה `zoomLevel` state בקוד React שלך. האפקט שלך ייראה דומה לזה:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

שימו לב שאין צורך בניקוי במקרה זה. בפיתוח, React יקרא לאפקט פעמיים, אבל זו לא בעיה כי use קורא `setZoomLevel` פעמיים באותו ערך לא עושה כלום. זה אולי קצת יותר איטי, אבל זה לא משנה כי use הוא לא יותקן מחדש מיותר בייצור.

ייתכן שחלק מה-APIs לא יאפשרו לך להתקשר אליהם פעמיים ברציפות. לדוגמה, שיטת [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) של האלמנט המובנה [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) זורקת אם תקרא לזה פעמיים. הפעל את פונקציית הניקוי וגרמי לה לסגור את הדו-שיח:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

בפיתוח, האפקט שלך יקרא `showModal()`, ואז מיד `close()`, ואז `showModal()` שוב. יש לזה אותה התנהגות גלויה של user כמו קריאה ל-`showModal()` פעם אחת, כפי שהיית רואה בהפקה.

### הרשמה לאירועים {/*subscribing-to-events*/}

אם האפקט שלך נרשם למשהו, פונקציית הניקוי צריכה לבטל את המנוי:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

בפיתוח, האפקט שלך יקרא `addEventListener()`, ואז מיד `removeEventListener()`, ואז `addEventListener()` שוב עם אותו מטפל. אז יהיה רק ​​מנוי פעיל אחד בכל פעם. יש לזה אותה התנהגות גלויה של user כמו קריאה ל-`addEventListener()` פעם אחת, כמו בהפקה.

### הפעלת אנימציות {/*triggering-animations*/}

אם האפקט שלך מפעיל משהו, פונקציית הניקוי צריכה לאפס את האנימציה לערכים ההתחלתיים:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

בפיתוח, האטימות תוגדר ל-`1`, לאחר מכן ל-`0`, ולאחר מכן ל-`1` שוב. זה אמור להיות בעל אותה התנהגות גלויה של user כמו הגדרתו ישירות ל-`1`, וזה מה שיקרה בייצור. אם אתה use ספריית אנימציה של צד שלישי עם תמיכה בטווינינג, פונקציית הניקוי שלך צריכה לאפס את ציר הזמן ל-state הראשוני שלו.

### מביא נתונים {/*fetching-data*/}

אם האפקט שלך מביא משהו, פונקציית הניקוי צריכה [להפסיק את האחזור](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) או להתעלם מהתוצאה שלה:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

אינך יכול "לבטל" בקשת רשת שכבר התרחשה, אך פונקציית הניקוי שלך אמורה להבטיח שהאחזור ש_לא רלוונטי יותר_ לא ימשיך להשפיע על היישום שלך. אם ה-`userId` משתנה מ-`'Alice'` ל-`'Bob'`, הניקוי מבטיח שמתעלמת מתגובת `'Alice'` גם אם היא מגיעה לאחר `'Bob'`.

**בפיתוח, תראה שני אחזורים בלשונית רשת.** אין בזה שום דבר רע. עם הגישה שלמעלה, האפקט הראשון יתנקה מיד כך שהעותק שלו של המשתנה `ignore` יוגדר ל-`true`. אז למרות שיש בקשה נוספת, זה לא ישפיע על ה-state הודות לבדיקת `if (!ignore)`.

**בייצור, תהיה רק ​​בקשה אחת.** אם הבקשה השנייה בפיתוח מטרידה אותך, הגישה הטובה ביותר היא use פתרון שמבטל כפילות של בקשות ושומר את התגובות שלהן בין רכיבים:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

זה לא רק ישפר את חווית הפיתוח, אלא גם יגרום לאפליקציה שלך להרגיש מהירה יותר. לדוגמה, ה-user הלחיצה על כפתור הקודמת לא תצטרך לחכות לטעינת נתונים שוב מכיוון שuse הם יישמרו במטמון. אתה יכול לבנות מטמון כזה בעצמך או use אחת מהחלופות הרבות לאחזור ידני ב- Effects.

<DeepDive>

#### מהן חלופות טובות לאיסוף נתונים ב- Effects? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

כתיבת `fetch` שיחות בתוך Effects היא [דרך פופולרית להביא נתונים](https://www.robinwieruch.de/react-hooks-fetch-data/), במיוחד באפליקציות צד לקוח לחלוטין. עם זאת, זוהי גישה מאוד ידנית ויש לה חסרונות משמעותיים:

- **השפעות אינן פועלות על השרת.** משמעות הדבר היא שהשרת הראשוני שניתנו HTML יכלול רק טעינה state ללא נתונים. מחשב הלקוח יצטרך להוריד את כל JavaScript ולעבד את האפליקציה שלך רק כדי לגלות שעכשיו הוא צריך לטעון את הנתונים. זה לא מאוד יעיל.
- **שליפה ישירות באפקטים מקלה על יצירת "מפלי רשת".** אתה מעבד את רכיב האב, הוא שואב נתונים מסוימים, מעבד את רכיבי הצאצא, ואז הם מתחילים לאחזר את הנתונים שלהם. אם הרשת לא מהירה במיוחד, זה איטי משמעותית מאשר שליפת כל הנתונים במקביל.
- **שליפה ישירה באפקטים משמעה בדרך כלל שאינך טוען מראש או מאחסן נתונים.** לדוגמה, אם הרכיב מתנתק ואז נטען שוב, הוא יצטרך לאחזר את הנתונים שוב.
- **זה לא מאוד ארגונומי.** יש לא מעט קוד בוילפלייס מעורב בעת כתיבת קריאות `fetch` בצורה שאינה סובלת מבאגים כמו [תנאי מירוץ.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

רשימה זו של חסרונות אינה ספציפית ל-React. זה חל על שליפת נתונים ב-mount עם כל ספרייה. כמו בניתוב, אחזור נתונים אינו טריוויאלי כדי לעשות זאת בצורה טובה, ולכן אנו ממליצים על הגישות הבאות:

- **אם אתה use [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use מנגנון אחזור הנתונים המובנה שלו.** במסגרות React מודרניות יש מנגנוני שליפת נתונים משולבים שהם יעילים ואינם סובלים מהמגבלה שלעיל.
- **אחרת, שקול להשתמש או לבנות מטמון בצד הלקוח.** פתרונות קוד פתוח פופולריים כוללים [React שאילתה](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), ו-[React נתב 6.4+.](https://beta.reactrouter.com/en/main/start/overview) אתה יכול לבנות גם פתרון משלך, אבל במקרה זה תוכל להוסיף פתרון משלך, ובמקרה זה תוסיף ______ ביטול כפילויות של בקשות, שמירת תגובות במטמון והימנעות ממפלי מים ברשת (על ידי טעינת נתונים מראש או הנפת דרישות נתונים למסלולים).

אתה יכול להמשיך להביא נתונים ישירות ב- Effects אם אף אחת מהגישות הללו לא מתאימה לך.

</DeepDive>

### שליחת ניתוח נתונים {/*sending-analytics*/}

שקול את הקוד הזה ששולח אירוע ניתוח בביקור בדף:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

בפיתוח, `logVisit` ייקרא פעמיים עבור כל כתובת אתר, אז אולי תתפתו לנסות לתקן את זה. **אנו ממליצים לשמור את הקוד הזה כפי שהוא.** כמו בדוגמאות קודמות, אין הבדל התנהגות *user-visible* בין הפעלתו פעם אחת לבין הפעלתו פעמיים. מנקודת מבט מעשית, `logVisit` לא צריך לעשות שום דבר בפיתוח כי use אתה לא רוצה שהלוגים ממכונות הפיתוח ישטטו את מדדי הייצור. הרכיב שלך מופעל מחדש בכל פעם שאתה שומר את הקובץ שלו, כך שהוא רושם ביקורים נוספים בפיתוח בכל מקרה.

**בייצור, לא יהיו יומני ביקור כפולים.**

כדי לנפות באגים באירועי הניתוח שאתה שולח, אתה יכול לפרוס את האפליקציה שלך לסביבת סטיג'ינג (שפועלת במצב ייצור) או לבטל את ההצטרפות זמנית ל[מצב קפדני](/reference/react/StrictMode) ובדיקות ההתקנה מחדש שלה לפיתוח בלבד. אתה יכול גם לשלוח ניתוחים ממטפלי אירועי שינוי המסלול במקום אפקטים. לניתוח מדויק יותר, [צופים בצמתים](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) יכולים לעזור לעקוב אחר הרכיבים שנמצאים בנקודת התצוגה וכמה זמן הם נשארים גלויים.

### לא משפיע: אתחול האפליקציה {/*not-an-effect-initializing-the-application*/}

לוגיקה מסוימת צריכה לפעול רק פעם אחת כאשר היישום מתחיל. אתה יכול לשים אותו מחוץ לרכיבים שלך:

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

זה מבטיח שהיגיון כזה פועל רק פעם אחת לאחר שהדפדפן טוען את הדף.

### לא משפיע: קניית מוצר {/*not-an-effect-buying-a-product*/}

לפעמים, גם אם אתה כותב פונקציית ניקוי, אין דרך למנוע השלכות גלויות של user של הפעלת האפקט פעמיים. לדוגמה, אולי האפקט שלך שולח בקשת POST כמו קניית מוצר:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

לא היית רוצה לקנות את המוצר פעמיים. עם זאת, זו גם הסיבה שלא כדאי לשים את ההיגיון הזה באפקט. מה אם ה-user עובר לדף אחר ואז לוחץ על חזרה? האפקט שלך יפעל שוב. אתה לא רוצה לקנות את המוצר כאשר ה-user *מבקר* בדף; אתה רוצה לקנות אותו כאשר ה-user *לוחץ* על כפתור הקנה.

הקנייה אינה כused על ידי עיבוד; זה caused על ידי אינטראקציה ספציפית. זה אמור לפעול רק כאשר ה-user לוחץ על הכפתור. **מחק את האפקט והעבר את בקשת `/api/buy` שלך למטפל באירועים של לחצן קנה:**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**זה ממחיש שאם התקנה מחדש שוברת את ההיגיון של היישום שלך, זה בדרך כלל מגלה באגים קיימים.** מנקודת המבט של user, ביקור בדף לא אמור להיות שונה מביקור בו, לחיצה על קישור ולאחר מכן לחיצה על חזרה כדי להציג את הדף שוב. React מאמת שהרכיבים שלך עומדים בעקרון זה על ידי הרכבה מחדש פעם אחת בפיתוח.

## מרכיבים את הכל ביחד {/*putting-it-all-together*/}

מגרש משחקים זה יכול לעזור לך "להרגיש" כיצד אפקטים פועלים בפועל.

דוגמה זו uses [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) לתזמן יומן מסוף עם טקסט הקלט שיופיע שלוש שניות לאחר הפעלת האפקט. פונקציית הניקוי מבטלת את פסק הזמן הממתין. התחל בלחיצה על "התקן את הרכיב":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

תראה שלושה יומנים בהתחלה: `Schedule "a" log`, `Cancel "a" log` ו-`Schedule "a" log` שוב. שלוש שניות לאחר מכן יהיה גם יומן שאומר `a`. כפי שלמדת קודם לכן, צמד התזמון/ביטול הנוסף הוא מכיוון שuse React מטעין מחדש את הרכיב פעם אחת בפיתוח כדי לוודא שיישמת את הניקוי בצורה טובה.

כעת ערוך את הקלט כדי לומר `abc`. If you do it fast enough, you'll see `Schedule "ab" log` immediately followed by `Cancel "ab" log` and `Schedule "abc" log`. **React תמיד מנקה את האפקט של העיבוד הקודם לפני האפקט של העיבוד הבא.** זו הסיבה שגם אם אתה מקליד בקלט מהר, יש לכל היותר פסק זמן אחד מתוזמן בכל פעם. ערוך את הקלט כמה פעמים וצפה בקונסולה כדי לקבל תחושה כיצד אפקטים מתנקים.

הקלד משהו בקלט ולאחר מכן לחץ מיד על "בטל את הרכבת הרכיב". שימו לב כיצד ביטול הרכבה מנקה את האפקט של העיבוד האחרון. כאן, הוא מנקה את פסק הזמן האחרון לפני שתהיה לו הזדמנות לירות.

לבסוף, ערוך את הרכיב שלמעלה והעיר את פונקציית הניקוי כדי שפסקי הזמן לא יבוטלו. נסה להקליד `abcde` מהר. מה אתה מצפה שיקרה בעוד שלוש שניות? האם `console.log(text)` בתוך הזמן הקצוב ידפיס את *האחרון* `text` ויפיק חמישה יומני `abcde`? נסה לבדוק את האינטואיציה שלך!

שלוש שניות לאחר מכן, אתה אמור לראות רצף של יומנים (`a`, `ab`, `abc`, `abcd` ו-`abcde`) במקום חמישה יומני `abcde`. **כל אפקט "לוכד" את הערך `text` מהעיבוד המתאים לו.** זה לא משנה שה-`text` state השתנה: אפקט מהעיבוד עם `text = 'ab'` תמיד יראה `'ab'`. במילים אחרות, אפקטים מכל רינדור מבודדים זה מזה. אם אתה סקרן איך זה עובד, אתה יכול לקרוא על [סגירות](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### לכל עיבוד יש אפקטים משלו {/*each-render-has-its-own-effects*/}

אתה יכול לחשוב על `useEffect` כעל "צירוף" קטע של התנהגות לפלט העיבוד. שקול את ההשפעה הזו:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

בוא נראה מה בדיוק קורה כשה-user מנווט ברחבי האפליקציה.

#### עיבוד ראשוני {/*initial-render*/}

ה-user מבקר ב-`<ChatRoom roomId="general" />`. בואו [נחליף מנטלית](/learn/state-as-a-snapshot#rendering-takes-snapshot-in-time) `roomId` עם `'general'`:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**האפקט הוא *גם* חלק מפלט העיבוד.** האפקט של העיבוד הראשון הופך:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React מפעיל את האפקט הזה, שמתחבר לחדר הצ'אט `'general'`.

#### עיבוד מחדש עם אותן תלות {/*re-render-with-same-dependencies*/}

נניח ש`<ChatRoom roomId="general" />` מעבד מחדש. הפלט JSX זהה:

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React רואה שפלט העיבוד לא השתנה, ולכן הוא לא מעדכן את ה-DOM.

האפקט מהעיבוד השני נראה כך:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React משווה את `['general']` מהעיבוד השני ל-`['general']` מהעיבוד הראשון. **בגלל use כל התלות זהים, React *מתעלם* מהאפקט מהעיבוד השני.** זה אף פעם לא נקרא.

#### עיבוד מחדש עם תלות שונות {/*re-render-with-different-dependencies*/}

לאחר מכן, ה-user מבקר ב-`<ChatRoom roomId="travel" />`. הפעם, הרכיב מחזיר JSX שונה:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React מעדכן את DOM כדי לשנות את `"Welcome to general"` ל`"Welcome to travel"`.

האפקט מהעיבוד השלישי נראה כך:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React משווה את `['travel']` מהעיבוד השלישי ל-`['general']` מהעיבוד השני. תלות אחת שונה: `Object.is('travel', 'general')` הוא `false`. לא ניתן לדלג על האפקט.

**לפני שReact יכול להחיל את האפקט מהרינדור השלישי, הוא צריך לנקות את האפקט האחרון ש_כן_ רץ.** האפקט של העיבוד השני דילג, אז React צריך לנקות את האפקט של העיבוד הראשון. אם תגלול עד לעיבוד הראשון, תראה שהניקוי שלו קורא `disconnect()` בחיבור שנוצר עם `createConnection('general')`. פעולה זו מנתקת את האפליקציה מחדר הצ'אט `'general'`.

לאחר מכן, React מריץ את האפקט של העיבוד השלישי. הוא מתחבר לחדר הצ'אט `'travel'`.

#### בטל את הטעינה {/*unmount*/}

לבסוף, נניח שה-user מנווט משם, והרכיב `ChatRoom` מתבטל. React מריץ את פונקציית הניקוי של האפקט האחרון. האפקט האחרון היה מהעיבוד השלישי. הניקוי של העיבוד השלישי הורס את החיבור `createConnection('travel')`. אז האפליקציה מתנתקת מהחדר `'travel'`.

#### התנהגויות לפי פיתוח בלבד {/*development-only-behaviors*/}

כאשר [מצב קפדני](/reference/react/StrictMode) מופעל, React מבצע התקנה מחדש של כל רכיב פעם אחת לאחר הטעינה (state וDOM נשמרים). זה [עוזר לך למצוא אפקטים שצריכים ניקוי](#step-3-add-cleanup-if-needed) וחושף באגים כמו תנאי מירוץ מוקדם. בנוסף, React יערוך מחדש את האפקטים בכל פעם שתשמור קובץ בפיתוח. שתי ההתנהגויות הללו הן להתפתחות בלבד.

</DeepDive>

<Recap>

- בניגוד לאירועים, אפקטים הם caused על ידי עיבוד עצמו ולא אינטראקציה מסוימת.
- אפקטים מאפשרים לך לסנכרן רכיב עם מערכת חיצונית כלשהי (צד שלישי API, רשת וכו').
- כברירת מחדל, אפקטים פועלים לאחר כל רינדור (כולל הראשון).
- React ידלג על האפקט אם לכל התלות שלו יש את אותם ערכים כמו במהלך העיבוד האחרון.
- אתה לא יכול "לבחור" את התלות שלך. הם נקבעים על ידי הקוד שבתוך האפקט.
- מערך תלות ריק (`[]`) מתאים לרכיב "הרכבה", כלומר מתווסף למסך.
- במצב קפדני, React מעלה רכיבים פעמיים (בפיתוח בלבד!) כדי לבדוק את האפקטים שלך.
- אם האפקט שלך נשבר בגלל התקנה מחדש, עליך ליישם פונקציית ניקוי.
- React יקרא לפונקציית הניקוי שלך לפני שהאפקט יפעל בפעם הבאה, ובמהלך ביטול ההרכבה.

</Recap>

<Challenges>

#### מיקוד שדה בהר {/*focus-a-field-on-mount*/}

בדוגמה זו, הטופס מעבד רכיב `<MyInput />`.

השתמש בשיטת [`focus()`] (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)) של הקלט כדי לגרום ל-`MyInput` להתמקד אוטומטית כשהוא מופיע על המסך. יש כבר יישום שהועל, אבל זה לא ממש עובד. גלה למה זה לא עובד ותקן את זה. (אם אתה מכיר את `autoFocus` זה לא קיים בתכונה מחדש, העמיד פנים שהפונקציה אינה קיימת: שריטה.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


כדי לוודא שהפתרון שלך עובד, לחץ על "הצג טופס" וודא שהקלט מקבל פוקוס (הופך להיות מודגש והסמן ממוקם בפנים). לחץ שוב על "הסתר טופס" ו"הצג טופס". ודא שהקלט מסומן שוב.

`MyInput` צריך להתמקד רק _על mount_ ולא אחרי כל עיבוד. כדי לוודא שההתנהגות נכונה, הקש על "הצג טופס" ולאחר מכן לחץ שוב ושוב על תיבת הסימון "הפוך אותו לאותיות רישיות". לחיצה על תיבת הסימון אמורה _לא_ למקד את הקלט מעליה.

<Solution>

הקריאה ל-`ref.current.focus()` במהלך העיבוד היא שגויה מכיוון שuse היא *תופעת לוואי*. יש להציב תופעות לוואי בתוך מטפל באירועים או להצהיר עם `useEffect`. במקרה זה, תופעת הלוואי היא _caused_ על ידי הופעת הרכיב ולא על ידי כל אינטראקציה ספציפית, ולכן הגיוני לשים אותה באפקט.

כדי לתקן את הטעות, עטוף את הקריאה `ref.current.focus()` בהצהרת אפקט. לאחר מכן, כדי להבטיח שהאפקט הזה יפעל רק על mount ולא אחרי כל רינדור, הוסף לו את התלות הריקות `[]`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### מיקוד שדה באופן מותנה {/*focus-a-field-conditionally*/}

טופס זה מציג שני רכיבי `<MyInput />`.

לחץ על "הצג טופס" ושם לב שהשדה השני מקבל focused אוטומטית. זה בגלל ששני רכיבי `<MyInput />` מנסים למקד את השדה פנימה. כאשר אתה קורא ל-`focus()` עבור שני שדות קלט ברצף, האחרון תמיד "מנצח".

נניח שאתה רוצה למקד את השדה הראשון. הרכיב `MyInput` הראשון מקבל כעת אבזר בוליאני `shouldFocus` שהוגדר ל-`true`. שנה את ההיגיון כך ש`focus()` ייקרא רק אם התמיכה `shouldFocus` שהתקבלה על ידי `MyInput` היא `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

כדי לאמת את הפתרון שלך, לחץ על "הצג טופס" ו"הסתר טופס" שוב ושוב. כאשר הטופס מופיע, רק הקלט *הראשון* אמור לקבל focused. זה בגלל use שרכיב האב מעבד את הקלט הראשון עם `shouldFocus={true}` ואת הקלט השני עם `shouldFocus={false}`. בדוק גם ששתי הכניסות עדיין פועלות ותוכל להקליד בשתיהן.

<Hint>

אתה לא יכול להכריז על אפקט באופן מותנה, אבל האפקט שלך יכול לכלול לוגיקה מותנית.

</Hint>

<Solution>

שים את ההיגיון המותנה בתוך האפקט. תצטרך לציין `shouldFocus` כתלות מכיוון שuse אתה משתמש בו בתוך האפקט. (משמעות הדבר היא שאם `shouldFocus` של קלט כלשהו משתנה מ-`false` ל-`true`, הוא יתמקד לאחר הטעינה.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### תקן מרווח שנדלק פעמיים {/*fix-an-interval-that-fires-twice*/}

רכיב `Counter` זה מציג מונה שאמור לעלות כל שנייה. בטעינה, הוא קורא ל-[`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) זה causes `onTick` לפעול כל שנייה. הפונקציה `onTick` מגדילה את המונה.

עם זאת, במקום לעלות פעם בשנייה, הוא גדל פעמיים. למה זה? מצא את ה-cause של הבאג ותקן אותו.

<Hint>

זכור ש-`setInterval` מחזיר מזהה מרווח, אותו תוכל להעביר אל [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) כדי לעצור את המרווח.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

כאשר [מצב קפדני](/reference/react/StrictMode) פועל (כמו בארגזי החול באתר זה), React מטעין מחדש כל רכיב פעם אחת בפיתוח. זהו המרווח שיש להגדיר פעמיים, וזו הסיבה שבכל שנייה המונה גדל פעמיים.

עם זאת, ההתנהגות של React אינה *cause* של הבאג: הבאג כבר קיים בקוד. ההתנהגות של React הופכת את הבאג לבולט יותר. ה-cause האמיתי הוא שהאפקט הזה מתחיל תהליך אבל לא מספק דרך לנקות אותו.

כדי לתקן את הקוד הזה, שמור את מזהה המרווח שהוחזר על ידי `setInterval`, והטמיע פונקציית ניקוי עם [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

במהלך הפיתוח, React עדיין יתקין מחדש את הרכיב שלך פעם אחת כדי לוודא שיישמת את הניקוי היטב. אז תהיה קריאה `setInterval`, מיד אחריה `clearInterval`, ושוב `setInterval`. בהפקה, תהיה רק ​​קריאת `setInterval` אחת. ההתנהגות הנראית ל-user בשני המקרים זהה: המונה גדל פעם בשנייה.

</Solution>

#### תקן אחזור בתוך אפקט {/*fix-fetching-inside-an-effect*/}

רכיב זה מציג את הביוגרפיה של האדם הנבחר. זה טוען את הביוגרפיה על ידי קריאה לפונקציה אסינכרונית `fetchBio(person)` ב-mount ובכל פעם ש`person` משתנה. הפונקציה האסינכרונית הזו מחזירה [הבטחה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) שבסופו של דבר פותרת למחרוזת. כאשר השליפה מתבצעת, היא קוראת ל-`setBio` כדי להציג את המחרוזת הזו מתחת לתיבת הבחירה.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>


יש באג בקוד הזה. התחל בבחירת "אליס". לאחר מכן בחר "בוב" ומיד לאחר מכן בחר "טיילור". אם תעשה זאת מהר מספיק, תבחין בבאג הזה: טיילור נבחר, אבל הפיסקה למטה אומרת "זהו הביוגרפיה של בוב".

למה זה קורה? תקן את הבאג בתוך האפקט הזה.

<Hint>

אם אפקט מביא משהו באופן אסינכרוני, הוא בדרך כלל זקוק לניקוי.

</Hint>

<Solution>

כדי להפעיל את הבאג, דברים צריכים לקרות בסדר הזה:

- בחירה ב-`'Bob'` מפעילה את `fetchBio('Bob')`
- בחירה ב-`'Taylor'` מפעילה את `fetchBio('Taylor')`
- **שליפת `'Taylor'` מסתיימת *לפני* שליפת `'Bob'`**
- האפקט מהעיבוד `'Taylor'` קורא `setBio('This is Taylor’s bio')`
- השליפה של `'Bob'` הושלמה
- ההשפעה מהעיבוד `'Bob'` קורא `setBio('This is Bob’s bio')`

זו הסיבה שאתה רואה את הביוגרפיה של בוב למרות שטיילור נבחרה. באגים כמו זה נקראים [תנאי מירוץ](https://en.wikipedia.org/wiki/Race_condition) because שתי פעולות אסינכרוניות "דוהרות" אחת עם השנייה, והן עשויות להגיע בסדר לא צפוי.

כדי לתקן את מצב המירוץ הזה, הוסף פונקציית ניקוי:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

לאפקט של כל עיבוד יש משתנה `ignore` משלו. בתחילה, המשתנה `ignore` מוגדר ל-`false`. עם זאת, אם אפקט מתנקה (כגון כשאתה בוחר אדם אחר), המשתנה `ignore` שלו הופך ל-`true`. אז עכשיו זה לא משנה באיזה סדר השלמות הבקשות. רק לאפקט של האדם האחרון יהיה `ignore` מוגדר ל-`false`, אז הוא יקרא `setBio(result)`. אפקטים קודמים נוקו, אז הסימון `if (!ignore)` ימנע מהם לקרוא `setBio`:

- בחירה ב-`'Bob'` מפעילה את `fetchBio('Bob')`
- בחירה ב-`'Taylor'` מפעילה את `fetchBio('Taylor')` **ומנקה את האפקט הקודם (של בוב**)
- שליפת `'Taylor'` מסתיימת *לפני* שליפת `'Bob'`
- האפקט מהעיבוד `'Taylor'` קורא `setBio('This is Taylor’s bio')`
- השליפה של `'Bob'` הושלמה
- האפקט מהעיבוד `'Bob'` **לא עושה כלום מכיוון שuse הדגל שלו `ignore` הוגדר ל-`true`**

בנוסף להתעלמות מהתוצאה של קריאת API מיושנת, אתה יכול גם use [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) כדי לבטל את הבקשות שאינן נחוצות יותר. עם זאת, כשלעצמו זה לא מספיק כדי להגן מפני תנאי מרוץ. שלבים אסינכרוניים נוספים יכולים להיות משורשרים לאחר השליפה, כך ששימוש בדגל המפורש ביותר של K_1 כמו __T פתרון בעיות זה.

</Solution>

</Challenges>

