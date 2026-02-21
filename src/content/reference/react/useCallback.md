---
title: "useCallback"
---

<Intro>

`useCallback` הוא React Hook המאפשר לך לשמור הגדרה של פונקציה במטמון בין עיבוד מחדש.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

התקשר ל-`useCallback` ברמה העליונה של הרכיב שלך כדי לשמור הגדרה של פונקציה במטמון בין עיבוד מחדש:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `fn`: ערך הפונקציה שברצונך לשמור במטמון. זה יכול לקחת כל ארגומנט ולהחזיר כל ערכים. React יחזיר (לא יקרא!) את הפונקציה שלך בחזרה אליך במהלך העיבוד הראשוני. בעיבוד הבא, React ייתן לך שוב את אותה פונקציה אם ה-`dependencies` לא השתנה מאז העיבוד האחרון. אחרת, הוא ייתן לך את הפונקציה שעברת במהלך הרינדור הנוכחי, ויאחסן אותה למקרה שניתן יהיה להחזיר אותה מאוחר יותר. React לא יקרא לפונקציה שלך. הפונקציה מוחזרת אליך כך שתוכל להחליט מתי ואם להתקשר אליה.

* `dependencies`: רשימת כל הערכים התגובתיים שאליהם מתייחסים בתוך הקוד `fn`. הערכים Reactive כוללים את props, state, ואת כל המשתנים והפונקציות המוצהרות ישירות בתוך גוף הרכיב שלך. אם ה-linter שלך הוא [מוגדר עבור React](/learn/editor-setup#linting), הוא יוודא שכל ערך תגובתי צוין כהלכה כתלות. רשימת התלות חייבת לכלול מספר קבוע של פריטים ולהיכתב בשורה כמו `[dep1, dep2, dep3]`. React ישווה כל תלות עם הערך הקודם שלה באמצעות [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) אלגוריתם ההשוואה.

#### מחזירה {/*returns*/}

בעיבוד הראשוני, `useCallback` מחזיר את הפונקציה `fn` שעברת.

במהלך העיבודים הבאים, הוא יחזיר פונקציית `fn` שכבר מאוחסנת מהעיבוד האחרון (אם התלות לא השתנו), או יחזיר את הפונקציה `fn` שהעברת במהלך העיבוד הזה.

#### אזהרות {/*caveats*/}

* `useCallback` הוא Hook, אז אתה יכול לקרוא לו רק **ברמה העליונה של הרכיב שלך** או Hooks משלך. אתה לא יכול לקרוא לזה בתוך לולאות או תנאים. אם אתה צריך את זה, חלץ רכיב חדש והעביר את ה-state לתוכו.
* React **לא יזרוק את הפונקציה המאוחסנת במטמון אלא אם יש סיבה ספציפית לעשות זאת.** לדוגמה, בפיתוח, React זורק את המטמון כשאתה עורך את הקובץ של הרכיב שלך. גם בפיתוח וגם בייצור, React יזרוק את המטמון אם הרכיב שלך יושעה במהלך ההרכבה הראשונית. בעתיד, React עשוי להוסיף תכונות נוספות המנצלות את זריקת המטמון - לדוגמה, אם React יוסיף בעתיד תמיכה מובנית ברשימות וירטואליות, יהיה זה הגיוני לזרוק את המטמון עבור פריטים שגוללים מתוך יציאת התצוגה של הטבלה הווירטואלית. זה אמור להתאים לציפיות שלך אם אתה מסתמך על `useCallback` כאופטימיזציה של ביצועים. אחרת, משתנה [state](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) או [ref](/reference/react/useRef#avoiding-recontent-recontents-ref) עשויים להיות מתאימים יותר.

---

## שימוש {/*usage*/}

### דילוג על עיבוד מחדש של רכיבים {/*skipping-re-rendering-of-components*/}

כאשר אתה מייעל את ביצועי הרינדור, לפעמים תצטרך לאחסן את הפונקציות שאתה מעביר לרכיבי צאצא. בואו נסתכל תחילה על התחביר כיצד לעשות זאת, ולאחר מכן נראה באילו מקרים הוא useמלא.

כדי לשמור פונקציה במטמון בין עיבוד מחדש של הרכיב שלך, עטוף את ההגדרה שלה לתוך `useCallback` Hook:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

אתה צריך להעביר שני דברים ל-`useCallback`:

1. הגדרת פונקציה שברצונך לשמור במטמון בין רינדורים מחדש.
2. <CodeStep step={2}>רשימת תלות</CodeStep> הכוללת כל ערך בתוך הרכיב שלך שהוא used בתוך הפונקציה שלך.

בעיבוד הראשוני, <CodeStep step={3}>פונקציה שהוחזרה</CodeStep> שתקבל מ-`useCallback` תהיה הפונקציה שעברת.

בעיבודים הבאים, React ישווה את <CodeStep step={2}>תלות</CodeStep> עם התלות שהעברת במהלך העיבוד הקודם. אם אף אחת מהתלות לא השתנתה (לעומת [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` תחזיר את אותה פונקציה כמו קודם. אחרת, `useCallback` תחזיר את הפונקציה שהעברת בעיבוד *זה*.

במילים אחרות, `useCallback` מאחסן פונקציה במטמון בין רינדור מחדש עד להשתנות התלות שלה.

**בואו נעבור על דוגמה כדי לראות מתי זה מלא use.**

נניח שאתה מעביר פונקציה `handleSubmit` למטה מהרכיב `ProductPage` לרכיב `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

שמת לב שהחלפת משענת `theme` מקפיאה את האפליקציה לרגע, אבל אם תסיר את `<ShippingForm />` מה-JSX שלך, זה מרגיש מהיר. זה אומר לך שכדאי לנסות לייעל את רכיב `ShippingForm`.

**כברירת מחדל, כאשר רכיב מעבד מחדש, React מעבד מחדש את כל הילדים שלו באופן רקורסיבי.** זו הסיבה שכאשר `ProductPage` מעבד מחדש עם `theme` שונה, הרכיב `ShippingForm` *גם* מעבד מחדש. זה בסדר עבור רכיבים שאינם דורשים חישוב רב כדי לרנדר מחדש. אבל אם אימתת שעיבוד מחדש איטי, אתה יכול להגיד ל-`ShippingForm` לדלג על רינדור מחדש כאשר ה-props שלו זהים לעיבוד האחרון על-ידי עטיפה ב-[`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**עם השינוי הזה, `ShippingForm` ידלג על רינדור מחדש אם כל ה-props שלו הם *זהים* לאלו בעיבוד האחרון.** זה כאשר שמירה במטמון הופכת להיות חשובה! נניח שהגדרת `handleSubmit` ללא `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Every time the theme changes, this will be a different function...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**ב-JavaScript, `function () {}` או `() => {}` תמיד יוצר פונקציה _שונה,** בדומה לאופן שבו האובייקט `{}` מילולי תמיד יוצר אובייקט חדש. בדרך כלל, זו לא תהיה בעיה, אבל זה אומר ש`ShippingForm` props לעולם לא יהיה אותו הדבר, והאופטימיזציה של [`memo`](/reference/react/memo) שלך לא תעבוד. זה המקום שבו `useCallback` שימושי:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...so as long as these dependencies don't change...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**על ידי גלישת `handleSubmit` ב-`useCallback`, אתה מבטיח שזו אותה פונקציה *זהה* בין העיבודים החוזרים** (עד שישתנו תלות). אתה לא *חייב* לעטוף פונקציה ב-`useCallback` אלא אם כן אתה עושה זאת מסיבה מסוימת. בדוגמה זו, הסיבה היא שאתה מעביר אותו לרכיב עטוף ב-[`memo`,](/reference/react/memo) וזה מאפשר לו לדלג על עיבוד מחדש. ישנן סיבות אחרות שאולי תזדקק ל-`useCallback` המתוארות בהמשך דף זה.

<Note>

**עליך להסתמך רק על `useCallback` כאופטימיזציה של ביצועים.** אם הקוד שלך לא עובד בלעדיו, מצא את הבעיה הבסיסית ותקן אותה תחילה. לאחר מכן תוכל להוסיף את `useCallback` בחזרה.

</Note>

<DeepDive>

#### איך useCallback קשור לuseMemo? {/*how-is-usecallback-related-to-usememo*/}

לעתים קרובות תראה את [`useMemo`](/reference/react/useMemo) לצד `useCallback`. שניהם מלאים use כשאתה מנסה לבצע אופטימיזציה של רכיב צאצא. הם מאפשרים לך [memoize](https://en.wikipedia.org/wiki/Memoization) (או, במילים אחרות, מטמון) משהו שאתה מעביר:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Calls your function and caches its result
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Caches your function itself
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

ההבדל הוא *במה* הם מאפשרים לך לשמור במטמון:

* **[`useMemo`](/reference/react/useMemo) מאחסן את *התוצאה* של קריאת הפונקציה שלך.** בדוגמה זו, הוא מאחסן את התוצאה של הקריאה `computeRequirements(product)` כך שהיא לא תשתנה אלא אם כן `product` השתנה. זה מאפשר לך להעביר את האובייקט `requirements` ללא צורך בעיבוד מחדש של `ShippingForm`. בעת הצורך, React יקרא לפונקציה שעברת במהלך העיבוד כדי לחשב את התוצאה.
* **`useCallback` מטמון *הפונקציה עצמה.*** בניגוד ל-`useMemo`, היא לא קוראת לפונקציה שאתה מספק. במקום זאת, הוא מאחסן את הפונקציה שסיפקת כך ש`handleSubmit` *עצמה* לא ישתנה אלא אם כן `productId` או `referrer` השתנו. זה מאפשר לך להעביר את הפונקציה `handleSubmit` ללא צורך בעיבוד מחדש של `ShippingForm`. הקוד שלך לא יפעל עד שה-user ישלח את הטופס.

אם אתה כבר מכיר את [`useMemo`,](/reference/react/useMemo) אולי יעזור לך לחשוב על `useCallback` כך:

```js
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[קרא עוד על ההבדל בין `useMemo` ל-`useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### האם להוסיף useCallback בכל מקום? {/*should-you-add-usecallback-everywhere*/}

אם האפליקציה שלך דומה לאתר הזה, ורוב האינטראקציות הן גסות (כמו החלפת דף או קטע שלם), memoאיזון בדרך כלל מיותר. מצד שני, אם האפליקציה שלך דומה יותר לעורך ציור, ורוב האינטראקציות הן פרטניות (כמו צורות זזות), אז אתה עשוי למצוא memoization מועיל מאוד.

אחסון במטמון עם `useCallback` הוא בעל ערך רק במקרים בודדים:

- אתה מעביר אותו כעזר לרכיב עטוף ב-[`memo`.](/reference/react/memo) אתה רוצה לדלג על עיבוד מחדש אם הערך לא השתנה. שינון זיכרון מאפשר לרכיב שלך לבצע רינדור מחדש רק אם השתנו תלות.
- הפונקציה שאתה מעביר היא מאוחר יותר used כתלות בכמה Hook. לדוגמה, פונקציה אחרת עטופה ב-`useCallback` תלויה בה, או שאתה תלוי בפונקציה הזו מ-[`useEffect.`](/reference/react/useEffect)

אין שום תועלת לעטוף פונקציה ב-`useCallback` במקרים אחרים. גם לעשות את זה אין שום נזק משמעותי, אז חלק מהצוותים בוחרים לא לחשוב על מקרים בודדים, וmemoלבצע כמה שיותר. החיסרון הוא שהקוד הופך פחות קריא. כמו כן, לא כל memoization יעיל: מספיק ערך בודד שהוא "חדש תמיד" כדי לשבור memoization עבור רכיב שלם.

שימו לב ש`useCallback` לא מונע *יצירת* הפונקציה. אתה תמיד יוצר פונקציה (וזה בסדר!), אבל React מתעלם ממנה ומחזיר לך פונקציה שמורה במטמון אם שום דבר לא השתנה.

**בפועל, אתה יכול להפוך הרבה memoאיזון למיותר על ידי ביצוע מספר עקרונות:**

1. כאשר רכיב עוטף רכיבים אחרים באופן ויזואלי, תן ​​לו [לקבל את JSX כילדים.](/learn/passing-props-to-a-component#passing-jsx-as-children) לאחר מכן, אם רכיב העטיפה מעדכן את state משלו, React לא צריך למסור לילדיו מחדש.
1. העדיפו state מקומי ואל ת [להרים את state למעלה](/learn/sharing-state-between-components) מעבר למה שצריך. אל תשמור על טפסים חולפים כמו state והאם פריט מרחף בראש העץ שלך או בספריית state גלובלית.
1. שמור על [לוגיקת העיבוד שלך טהורה.](/learn/keeping-components-pure) אם עיבוד מחדש של רכיב גורם לבעיה או מייצר חפץ חזותי בולט, זה באג ברכיב שלך! תקן את הבאג במקום להוסיף memoization.
1. הימנע מ[אפקטים מיותרים שמעדכנים state.](/learn/you-might-not-need-an-effect) רוב בעיות הביצועים באפליקציות React ניתנות ל-used על ידי שרשראות של עדכונים שמקורן באפקטים שמאפשרים use לעבד את הרכיבים שלך שוב ושוב.
1. נסה [להסיר תלות מיותרת מהאפקטים שלך.](/learn/removing-effect-dependencies) לדוגמה, במקום memoization, לעתים קרובות יותר פשוט להעביר אובייקט או פונקציה בתוך אפקט או מחוץ לרכיב.

אם אינטראקציה ספציפית עדיין מרגישה בפיגור, [use הפרופיל של React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) כדי לראות אילו רכיבים מרוויחים הכי הרבה מ-memoization, ולהוסיף memoization במידת הצורך. עקרונות אלו מקלים על ניפוי באגים והבנה של הרכיבים שלכם, אז כדאי לעקוב אחריהם בטווח הארוך, בכל מקרה, __T. אוטומטית](https://www.youtube.com/watch?v=lGEMwh32soc) כדי לפתור את זה אחת ולתמיד.

</DeepDive>

<Recipes titleText="The difference between useCallback and declaring a function directly" titleId="examples-rerendering">

#### דילוג על עיבוד מחדש עם `useCallback` ו`memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

בדוגמה זו, הרכיב `ShippingForm` מואט באופן מלאכותי** כך שתוכל לראות מה קורה כאשר רכיב React שאתה מעבד איטי באמת. נסה להגדיל את המונה ולהחליף את ערכת הנושא.

הגדלה של המונה מרגישה איטית מכיוון שuse היא מאלצת את ה-`ShippingForm` המואט לבצע רינדור מחדש. זה צפוי בגלל שuse המונה השתנה, ולכן עליך לשקף את הבחירה החדשה של ה-user על המסך.

לאחר מכן, נסה לשנות את ערכת הנושא. **תודה ל`useCallback` יחד עם [`memo`](/reference/react/memo), זה מהיר למרות ההאטה המלאכותית!** `ShippingForm` דילג על עיבוד מחדש מכיוון שuse הפונקציה `handleSubmit` לא השתנתה. הפונקציה `handleSubmit` לא השתנתה מכיוון שuse גם `productId` וגם `referrer` (התלות `useCallback` שלך) לא השתנו מאז העיבוד האחרון.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### תמיד עיבוד מחדש של רכיב {/*always-re-rendering-a-component*/}

בדוגמה זו, היישום `ShippingForm` הוא גם **האטה באופן מלאכותי** כך שתוכל לראות מה קורה כאשר רכיב React כלשהו שאתה מעבד איטי באמת. נסה להגדיל את המונה ולהחליף את ערכת הנושא.

שלא כמו בדוגמה הקודמת, החלפת ערכת הנושא אטית גם כעת! זה בגלל use **אין קריאה `useCallback` בגרסה הזו,** אז `handleSubmit` היא תמיד פונקציה חדשה, והרכיב `ShippingForm` האטה לא יכול לדלג על עיבוד מחדש.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


עם זאת, הנה אותו קוד **עם הסרת ההאטה המלאכותית.** האם החוסר ב-`useCallback` מרגיש מורגש או לא?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


לעתים קרובות למדי, קוד ללא memoization עובד מצוין. אם האינטראקציות שלך מהירות מספיק, אינך זקוק ל-memoization.

זכור שעליך להפעיל את React במצב ייצור, להשבית את [React Developer Tools](/learn/react-developer-tools), ו-use מכשירים דומים לאלו שיש ל-users של האפליקציה שלך כדי לקבל תחושה מציאותית של מה בעצם מאט את האפליקציה שלך.

<Solution />

</Recipes>

---

### עדכון state מ-memoהתקשרות חוזרת {/*updating-state-from-a-memoized-callback*/}

לפעמים, ייתכן שיהיה עליך לעדכן את state בהתבסס על state קודם מהתקשרות חוזרת memo.

פונקציית `handleAddTodo` זו מציינת את `todos` כתלות מכיוון שuse היא מחשבת ממנה את הפעולות הבאות:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

בדרך כלל תרצה לפונקציות memoized יהיו כמה שפחות תלות. כאשר אתה קורא כמה state רק כדי לחשב את ה-state הבא, אתה יכול להסיר את התלות הזו על ידי העברת [פונקציית עדכון](/reference/react/useState#updating-state-based-on-the-previous-state) במקום זאת:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

כאן, במקום להפוך את `todos` לתלות ולקרוא אותו בפנים, אתה מעביר הוראה לגבי *איך* לעדכן את ה-state (`todos => [...todos, newTodo]`) ל-React. [קרא עוד על פונקציות העדכון.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### מניעת ירי מאפקט לעתים קרובות מדי {/*preventing-an-effect-from-firing-too-often*/}

לפעמים, אולי תרצה לקרוא לפונקציה מתוך [Effect:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

זה יוצר בעיה. [יש להצהיר על כל ערך תגובתי כתלות של האפקט שלך.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specificated-every-reactive-value-as-a-dependency) עם זאת, אם תכריז על `createOptions` כתלות, הוא יחבר מחדש את ה-ca__T לחדר האפקט_1__


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

כדי לפתור את זה, אתה יכול לעטוף את הפונקציה שאתה צריך לקרוא מאפקט לתוך `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

זה מבטיח שהפונקציה `createOptions` זהה בין רינדור מחדש אם ה-`roomId` זהה. **עם זאת, עדיף אפילו להסיר את הצורך בתלות בפונקציה.** הזז את הפונקציה שלך *בתוך* האפקט:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

כעת הקוד שלך פשוט יותר ואינו זקוק ל-`useCallback`. [למידע נוסף על הסרת תלות אפקט.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### אופטימיזציה של Hook {/*optimizing-a-custom-hook*/} מותאמת אישית

אם אתה כותב [custom Hook,](/learn/reusing-logic-with-custom-hooks) מומלץ לעטוף את כל הפונקציות שהוא מחזיר לתוך `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

זה מבטיח שהצרכנים של ה-Hook שלך יכולים לבצע אופטימיזציה של הקוד שלהם בעת הצורך.

---

## פתרון בעיות {/*troubleshooting*/}

### בכל פעם שהרכיב שלי מעבד, `useCallback` מחזיר פונקציה אחרת {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

ודא שציינת את מערך התלות כארגומנט שני!

אם תשכח את מערך התלות, `useCallback` יחזיר פונקציה חדשה בכל פעם:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

זו הגרסה המתוקנת שמעבירה את מערך התלות כארגומנט שני:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
  // ...
```

אם זה לא עוזר, אז הבעיה היא שלפחות אחת מהתלות שלך שונה מהעיבוד הקודם. אתה יכול לנפות באגים בבעיה זו על ידי רישום ידני של התלות שלך למסוף:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

לאחר מכן תוכל ללחוץ לחיצה ימנית על המערכים מעיבודים חוזרים שונים בקונסולה ולבחור "אחסן כמשתנה גלובלי" עבור שניהם. בהנחה שהראשון נשמר כ-`temp1` והשני נשמר כ-`temp2`, לאחר מכן תוכל use למסוף הדפדפן כדי לבדוק אם כל תלות בשני המערכים זהה:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

כאשר אתה מגלה איזו תלות מפריעה את memoization, או מצא דרך להסיר אותה, או [memoלשנות אותה גם כן.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### אני צריך להתקשר ל-`useCallback` עבור כל פריט רשימה בלולאה, אבל זה אסור {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

נניח שהרכיב `Chart` עטוף ב-[`memo`](/reference/react/memo). אתה רוצה לדלג על רינדור מחדש של כל `Chart` ברשימה כאשר הרכיב `ReportList` מעבד מחדש. עם זאת, אינך יכול לקרוא ל-`useCallback` בלולאה:

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

במקום זאת, חלץ רכיב עבור פריט בודד, ושם שם `useCallback`:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

לחלופין, תוכל להסיר את `useCallback` בקטע הקוד האחרון ובמקום זאת לעטוף את `Report` עצמו ב-[`memo`.](/reference/react/memo) אם הפריט `item` לא ישתנה, `Report` ידלג על עיבוד מחדש, כך שגם `Chart` ידלג על עיבוד מחדש:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
