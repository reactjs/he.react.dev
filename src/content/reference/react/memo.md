---
title: "memo"
---

<Intro>

`memo` מאפשר לך לדלג על עיבוד מחדש של רכיב כאשר ה-props שלו לא השתנה.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

עטוף רכיב ב-`memo` כדי לקבל גרסה *memoized* של רכיב זה. גרסה זו memo שעברה עיבוד מחדש של הרכיב שלך בדרך כלל לא תעובד מחדש כאשר רכיב האב שלו יעובד מחדש כל עוד ה-props שלו לא השתנה. אבל React עדיין עשוי לעבד אותו מחדש: memoization הוא אופטימיזציה של ביצועים, לא ערובה.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[ראה דוגמאות נוספות למטה.](#usage)

#### פרמטרים {/*parameters*/}

* `Component`: הרכיב שברצונך לשנות memo. ה-`memo` אינו משנה את הרכיב הזה, אלא מחזיר במקום זאת רכיב חדש, memo. כל רכיב React חוקי, כולל פונקציות ורכיבי [`forwardRef`](/reference/react/forwardRef), מתקבל.

* **אופציונלי** `arePropsEqual`: פונקציה שמקבלת שני ארגומנטים: ה-props הקודם של הרכיב, וה-props החדש שלו. זה אמור להחזיר `true` אם ה-props הישן והחדש שווים: כלומר, אם הרכיב יציג את אותו פלט ויתנהג באותו אופן עם props החדש כמו עם הישן. אחרת הוא אמור להחזיר `false`. בדרך כלל, לא תציין פונקציה זו. כברירת מחדל, React ישווה כל אבזר עם [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### מחזירה {/*returns*/}

`memo` מחזיר רכיב React חדש. הוא מתנהג כמו הרכיב שסופק ל-`memo`, אלא ש-React לא תמיד יעבד אותו מחדש כאשר האב שלו עובר עיבוד מחדש, אלא אם כן ה-props שלו השתנה.

---

## שימוש {/*usage*/}

### דילוג על עיבוד מחדש כאשר props אינם משתנים {/*skipping-re-rendering-when-props-are-unchanged*/}

React בדרך כלל מעבד מחדש רכיב בכל פעם שהאב שלו מעבד מחדש. עם `memo`, אתה יכול ליצור רכיב ש-React לא יעבד מחדש כאשר האב שלו מעבד מחדש כל עוד ה-props החדש שלו זהה ל-props הישן. אומרים שרכיב כזה הוא *memoized*.

כדי memoלהפוך רכיב, עטוף אותו ב-`memo` וב-use הערך שהוא מחזיר במקום הרכיב המקורי שלך:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

לרכיב React צריך תמיד להיות [לוגיקת רינדור טהורה.](/learn/keeping-components-pure) פירוש הדבר שהוא חייב להחזיר את אותו פלט אם ה-props, state וההקשר שלו לא השתנו. על ידי שימוש ב-`memo`, אתה אומר ל-React שהרכיב שלך תואם לדרישה זו, כך ש-React לא צריך לבצע רינדור מחדש כל עוד ה-props שלו לא השתנה. אפילו עם `memo`, הרכיב שלך יעבד מחדש אם ה-state שלו משתנה או אם ישתנה הקשר שהוא משתמש בו.

בדוגמה זו, שימו לב שהרכיב `Greeting` מעבד מחדש בכל פעם ש-`name` משתנה (because זה אחד מה-props שלו), אבל לא כאשר `address` משתנה (בגלל use הוא לא מועבר ל-`Greeting` בתור אבזר):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**עליך להסתמך רק על `memo` כאופטימיזציה של ביצועים.** אם הקוד שלך לא עובד בלעדיו, מצא את הבעיה הבסיסית ותקן אותה תחילה. לאחר מכן תוכל להוסיף `memo` כדי לשפר את הביצועים.

</Note>

<DeepDive>

#### האם להוסיף memo בכל מקום? {/*should-you-add-memo-everywhere*/}

אם האפליקציה שלך דומה לאתר הזה, ורוב האינטראקציות הן גסות (כמו החלפת דף או קטע שלם), memoאיזון בדרך כלל מיותר. מצד שני, אם האפליקציה שלך דומה יותר לעורך ציור, ורוב האינטראקציות הן פרטניות (כמו צורות זזות), אז אתה עשוי למצוא memoization מועיל מאוד.

אופטימיזציה עם `memo` היא בעלת ערך רק כאשר הרכיב שלך מעבד מחדש לעתים קרובות עם אותו props בדיוק, והלוגיקת העיבוד מחדש שלו יקרה. אם אין השהייה מורגשת כאשר הרכיב שלך מעבד מחדש, `memo` מיותר. זכור ש-`memo` הוא use פחות לחלוטין אם ה-props המועבר לרכיב שלך הוא *תמיד שונה,* כמו למשל אם תעביר אובייקט או פונקציה רגילה שהוגדרה במהלך העיבוד. זו הסיבה שתצטרך לעתים קרובות את [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) ו-[`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) יחד עם `memo`.

אין שום תועלת לעטוף רכיב ב-`memo` במקרים אחרים. גם לעשות את זה אין שום נזק משמעותי, אז חלק מהצוותים בוחרים לא לחשוב על מקרים בודדים, וmemoלבצע כמה שיותר. החיסרון של גישה זו הוא שהקוד הופך פחות קריא. כמו כן, לא כל memoization יעיל: מספיק ערך בודד שהוא "חדש תמיד" כדי לשבור memoization עבור רכיב שלם.

**בפועל, אתה יכול להפוך הרבה memoאיזון למיותר על ידי ביצוע מספר עקרונות:**

1. כאשר רכיב עוטף רכיבים אחרים באופן ויזואלי, תן ​​לו [לקבל את JSX כילדים.](/learn/passing-props-to-a-component#passing-jsx-as-children) בדרך זו, כאשר רכיב העטיפה מעדכן את state משלו, React לא צריך React שלו.
1. העדיפו state מקומי ואל ת [להרים את state למעלה](/learn/sharing-state-between-components) מעבר למה שצריך. לדוגמה, אל תשמור טפסים חולפים כמו state והאם פריט מרחף בראש העץ שלך או בספריית state גלובלית.
1. שמור על [לוגיקת העיבוד שלך טהורה.](/learn/keeping-components-pure) אם עיבוד מחדש של רכיב גורם לבעיה או מייצר חפץ חזותי בולט, זה באג ברכיב שלך! תקן את הבאג במקום להוסיף memoization.
1. הימנע מ[אפקטים מיותרים שמעדכנים state.](/learn/you-might-not-need-an-effect) רוב בעיות הביצועים באפליקציות React ניתנות ל-used על ידי שרשראות של עדכונים שמקורן באפקטים שמאפשרים use לעבד את הרכיבים שלך שוב ושוב.
1. נסה [להסיר תלות מיותרת מהאפקטים שלך.](/learn/removing-effect-dependencies) לדוגמה, במקום memoization, לעתים קרובות יותר פשוט להעביר אובייקט או פונקציה בתוך אפקט או מחוץ לרכיב.

אם אינטראקציה ספציפית עדיין מרגישה בפיגור, [use הפרופיל של React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) כדי לראות אילו רכיבים ירוויחו הכי הרבה מ-memoization, והוסיפו memoization במידת הצורך. עקרונות אלו מקלים על ניפוי באגים והבנה של הרכיבים שלכם, אז כדאי לעקוב אחריהם בטווח הארוך, בכל מקרה.' memoization באופן אוטומטי](https://www.youtube.com/watch?v=lGEMwh32soc) כדי לפתור את זה אחת ולתמיד.

</DeepDive>

---

### עדכון רכיב memoized באמצעות state {/*updating-a-memoized-component-using-state*/}

גם כאשר רכיב הוא memoized, הוא עדיין יעבד מחדש כאשר state משלו ישתנה. שינון קשור רק ל-props שמועברים לרכיב מהאב שלו.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

אם תגדיר משתנה state לערך הנוכחי שלו, React ידלג על עיבוד מחדש של הרכיב שלך גם ללא `memo`. ייתכן שעדיין תראה שפונקציית הרכיב שלך נקראת פעם נוספת, אך התוצאה תימחק.

---

### עדכון רכיב memoעובר באמצעות הקשר {/*updating-a-memoized-component-using-a-context*/}

גם כאשר רכיב הוא memoized, הוא עדיין יוצג מחדש כאשר ההקשר שבו הוא משתמש משתנה. שינון קשור רק ל-props שמועברים לרכיב מהאב שלו.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

כדי להפוך את הרכיב שלך לעיבוד מחדש רק כאשר _חלק_ מהקשר מסוים משתנה, פצל את הרכיב שלך לשניים. קרא את מה שאתה צריך מהקשר ברכיב החיצוני, והעבר אותו לילד memo כאביזר.

---

### צמצום props שינויים {/*minimizing-props-changes*/}

כאשר אתה use `memo`, הרכיב שלך מעבד מחדש בכל פעם שעזר כלשהו אינו *שווה באופן רדוד* למה שהיה קודם. המשמעות היא ש-React משווה כל אביזר ברכיב שלך עם הערך הקודם שלו באמצעות ההשוואה [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). שימו לב ש`Object.is(3, 3)` הוא `true`, אבל `Object.is({}, {})` הוא `false`.


כדי להפיק את המרב מ-`memo`, צמצם את הזמנים שבהם ה-props משתנה. לדוגמה, אם האביזר הוא אובייקט, מנע מהרכיב האב ליצור מחדש את האובייקט הזה בכל פעם באמצעות [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

דרך טובה יותר למזער שינויים ב-props היא לוודא שהרכיב מקבל את המידע המינימלי הדרוש ב-props שלו. לדוגמה, הוא יכול לקבל ערכים בודדים במקום אובייקט שלם:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

אפילו ערכים בודדים יכולים לפעמים להיות מוקרנים לאלה שמשתנים בתדירות נמוכה יותר. לדוגמה, כאן רכיב מקבל ערך בוליאני המציין את נוכחותו של ערך ולא את הערך עצמו:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

כאשר אתה צריך להעביר פונקציה לרכיב memoized, או הכריז עליה מחוץ לרכיב שלך כך שהוא לעולם לא ישתנה, או [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) כדי לשמור את ההגדרה שלה בין רינדורים מחדש.

---

### ציון פונקציית השוואה מותאמת אישית {/*specifying-a-custom-comparison-function*/}

במקרים נדירים זה לא אפשרי למזער את השינויים props של רכיב memo. במקרה כזה, אתה יכול לספק פונקציית השוואה מותאמת אישית, אשר React תעשה use כדי להשוות את הישן והחדש props במקום להשתמש בשוויון רדוד. פונקציה זו מועברת כארגומנט שני ל-`memo`. זה אמור להחזיר את `true` רק אם ה-props החדש יביא לאותו פלט כמו ה-props הישן; אחרת הוא אמור להחזיר `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

אם תעשה זאת, use חלונית הביצועים בכלי המפתחים של הדפדפן שלך כדי לוודא שפונקציית ההשוואה שלך למעשה מהירה יותר מאשר עיבוד מחדש של הרכיב. אולי תופתעו.

כאשר אתה מבצע מדידות ביצועים, ודא שReact פועל במצב הייצור.

<Pitfall>

אם אתה מספק יישום `arePropsEqual` מותאם אישית, **עליך להשוות כל אבזר, כולל פונקציות.** פונקציות לעתים קרובות [סגורות מעל](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) ה-props וstate של רכיבי האב. אם תחזירו `true` כאשר `oldProps.onClick !== newProps.onClick`, הרכיב שלכם ימשיך "לראות" את ה-__K_8 הקודמת ו____T המטפל `onClick` שלו, מה שמוביל לבאגים מבלבלים מאוד.

הימנע מביצוע בדיקות שוויון עמוקות בתוך `arePropsEqual` אלא אם כן אתה בטוח ב-100% שלמבנה הנתונים איתו אתה עובד יש עומק מוגבל ידוע. **בדיקות שוויון עמוקות יכולות להיות איטיות להפליא** ויכולות להקפיא את האפליקציה שלך למשך שניות רבות אם מישהו משנה את מבנה הנתונים מאוחר יותר.

</Pitfall>

---

## פתרון בעיות {/*troubleshooting*/}
### הרכיב שלי מעבד מחדש כאשר אבזר הוא אובייקט, מערך או פונקציה {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React משווה בין props ישן לחדש לפי שוויון רדוד: כלומר, הוא שוקל אם כל אבזר חדש שווה להתייחסות לאביזר הישן. אם אתה יוצר אובייקט או מערך חדשים בכל פעם שהאב מעובד מחדש, גם אם כל האלמנטים הבודדים זהים, React עדיין ישקול אותו כשינוי. באופן דומה, אם תיצור פונקציה חדשה בעת רינדור רכיב האב, React יחשב אותה כשונתה גם אם לפונקציה יש אותה הגדרה. כדי להימנע מכך, [פשוט props או memoize props ברכיב האב] (#minimizing-props-changes).
