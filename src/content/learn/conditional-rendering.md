---
title: "עיבוד מותנה"
---

<Intro>

הרכיבים שלך יצטרכו לעתים קרובות להציג דברים שונים בהתאם לתנאים שונים. ב-React, אתה יכול לעבד JSX באופן מותנה באמצעות תחביר JavaScript כמו `if` statements, `&&` ו`? :` אופרטורים.

</Intro>

<YouWillLearn>

* כיצד להחזיר JSX שונה בהתאם לתנאי
* כיצד לכלול או לא לכלול חלק של JSX באופן מותנה
* קיצורי דרך תחביר מותנים נפוצים שתתקלו בבסיסי קוד React

</YouWillLearn>

## החזרת JSX {/*conditionally-returning-jsx*/} על תנאי

נניח שיש לך רכיב `PackingList` המציג מספר `Item`s, שניתן לסמן כארוז או לא:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

שימו לב שלחלק מהרכיבים `Item` יש `isPacked` אבזר שלהם מוגדר ל-`true` במקום `false`. אתה רוצה להוסיף סימן ביקורת (✔) לפריטים ארוזים אם `isPacked={true}`.

אתה יכול לכתוב את זה בתור [`if`/`else` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) כך:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

אם הפריט `isPacked` הוא `true`, הקוד הזה **מחזיר עץ JSX אחר.** עם השינוי הזה, חלק מהפריטים מקבלים סימן ביקורת בסוף:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

נסה לערוך את מה שמוחזר בכל מקרה, וראה כיצד התוצאה משתנה!

שימו לב כיצד אתם יוצרים לוגיקה מסועפת עם `if` ו-`return` state של JavaScript. ב-React, זרימת הבקרה (כמו תנאים) מטופלת על ידי JavaScript.

### לא מחזיר דבר על תנאי עם `null` {/*conditionally-returning-nothing-with-null*/}

במצבים מסוימים, לא תרצה לרנדר שום דבר בכלל. לדוגמה, תגיד שאתה לא רוצה להציג פריטים ארוזים בכלל. רכיב חייב להחזיר משהו. במקרה זה, תוכל להחזיר את `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

אם `isPacked` נכון, הרכיב לא יחזיר דבר, `null`. אחרת, הוא יחזיר את JSX לעיבוד.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

בפועל, החזרת `null` מרכיב אינה נפוצה מכיוון שuse היא עשויה להפתיע מפתח שמנסה לרנדר אותו. לעתים קרובות יותר, תכלול או לא תכלול את הרכיב ב-JSX של רכיב האב. הנה איך לעשות את זה!

## כולל JSX {/*conditionally-including-jsx*/} באופן מותנה

בדוגמה הקודמת, שלטת איזה (אם בכלל!) עץ JSX יוחזר על ידי הרכיב. ייתכן שכבר שמת לב לשכפול מסוים בפלט העיבוד:

```js
<li className="item">{name} ✔</li>
```

דומה מאוד ל

```js
<li className="item">{name}</li>
```

שני הענפים המותנים מחזירים `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

אמנם שכפול זה אינו מזיק, אך הוא עלול להקשות על תחזוקת הקוד שלך. מה אם אתה רוצה לשנות את ה-`className`? תצטרך לעשות זאת בשני מקומות בקוד שלך! במצב כזה, אתה יכול לכלול מעט JSX כדי להפוך את הקוד שלך ליותר [יבש.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### אופרטור מותנה (שלישי) (`? :`) {/*conditional-ternary-operator--*/}

ל-JavaScript יש תחביר קומפקטי לכתיבת ביטוי מותנה -- האופרטור המותנה](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) או "אופרטור טרירי".

במקום זה:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

אתה יכול לכתוב את זה:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

אתה יכול לקרוא את זה בתור *"אם `isPacked` הוא אמיתי, אז (`?`) render `name + ' ✔'`, אחרת (`:`) render `name`"*.

<DeepDive>

#### האם שתי הדוגמאות הללו שוות לחלוטין? {/*are-these-two-examples-fully-equivalent*/}

אם אתה מגיע מרקע תכנות מונחה עצמים, אתה עשוי להניח ששתי הדוגמאות שלמעלה שונות בתכלית מכיוון שuse אחת מהן עשויה ליצור שני "מופעים" שונים של `<li>`. אבל אלמנטים JSX אינם "מופעים" מכיוון שuse הם אינם מכילים שום state פנימי ואינם צמתים DOM אמיתיים. הם תיאורים קלים, כמו שרטוטים. כך ששתי הדוגמאות הללו, למעשה, *שוות* לחלוטין. [מצב שימור ואיפוס](/learn/preserving-and-resetting-state) מפרט כיצד זה עובד.

</DeepDive>

כעת נניח שאתה רוצה לעטוף את הטקסט של הפריט שהושלם בתג HTML אחר, כמו `<del>` כדי למחוק אותו. אתה יכול להוסיף עוד שורות חדשות וסוגריים כדי שיהיה קל יותר לקנן עוד JSX בכל אחד מהמקרים:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

סגנון זה עובד היטב עבור תנאים פשוטים, אבל use אותו במידה. אם הרכיבים שלך מבולגנים עם יותר מדי סימון מותנה מקונן, שקול לחלץ רכיבי צאצא כדי לנקות דברים. ב-React, סימון הוא חלק מהקוד שלך, אז אתה יכול use כלים כמו משתנים ופונקציות כדי לסדר ביטויים מורכבים.

### אופרטור AND לוגי (`&&`) {/*logical-and-operator-*/}

קיצור דרך נפוץ נוסף שתתקל בו הוא האופרטור [JavaScript לוגי AND (`&&`).](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) בתוך רכיבי React, הוא מופיע לעתים קרובות כאשר אתה רוצה לעבד כמה JSX כשהתנאי נכון, **או לעבד שום דבר אחרת.** עם https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) ברכיבי React, אתה יכול לסמן את התנאי K2 רק_1__ `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

אתה יכול לקרוא את זה בתור *"אם `isPacked`, אז (`&&`) עבד את סימן הביקורת, אחרת, לא עבד כלום"*.

הנה זה בפעולה:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

ביטוי [JavaScript &&](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) מחזיר את הערך של הצד הימני שלו (במקרה שלנו, סימן הביקורת) אם הצד השמאלי (המצב שלנו) הוא `true`. אבל אם התנאי הוא `false`, הביטוי כולו הופך ל`false`. React מחשיב את __TK__3 כמו __TK__3 בעץ, בדיוק כמו __TK__3 `null` או `undefined`, ואינו מעבד שום דבר במקומו.


<Pitfall>

**אל תשים מספרים בצד שמאל של `&&`.**

כדי לבדוק את התנאי, JavaScript ממיר את הצד השמאלי לבוליאני באופן אוטומטי. עם זאת, אם הצד השמאלי הוא `0`, אז הביטוי כולו מקבל את הערך הזה (`0`), ו-React יציג בשמחה את `0` ולא כלום.

לדוגמה, טעות נפוצה היא לכתוב קוד כמו `messageCount && <p>New messages</p>`. קל להניח שהוא לא מציג כלום כאשר `messageCount` הוא `0`, אבל זה באמת מעבד את `0` עצמו!

כדי לתקן את זה, הפוך את הצד השמאלי לבוליאני: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### הקצאה מותנית של JSX למשתנה {/*conditionally-assigning-jsx-to-a-variable*/}

כאשר קיצורי הדרך מפריעים לכתיבת קוד רגיל, נסה להשתמש ב-`if` statement ובמשתנה. אתה יכול להקצות מחדש משתנים שהוגדרו באמצעות [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), אז התחל על ידי מתן תוכן ברירת המחדל שברצונך להציג, השם:

```js
let itemContent = name;
```

השתמש ב-`if` statement כדי להקצות מחדש ביטוי JSX ל-`itemContent` אם `isPacked` הוא `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[סוגריים מתולתלים פותחים את "החלון אל JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) הטמע את המשתנה עם סוגרים מתולתלים בסוג JSX שהוחזר בתוך העץ __K_2 שחושב קודם לכן ב-__K: __K

```js
<li className="item">
  {itemContent}
</li>
```

סגנון זה הוא המלל ביותר, אך הוא גם הגמיש ביותר. הנה זה בפעולה:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

כמו קודם, זה עובד לא רק עבור טקסט, אלא גם עבור JSX שרירותי:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

אם אינך מכיר את JavaScript, מגוון הסגנונות הזה עשוי להיראות מהמם בהתחלה. עם זאת, לימוד אותם יעזור לך לקרוא ולכתוב כל קוד JavaScript -- ולא רק רכיבי React! בחר את זה שאתה מעדיף בתור התחלה, ולאחר מכן עיין בהפניה זו שוב אם אתה שוכח איך האחרים עובדים.

<Recap>

* ב-React, אתה שולט בלוגיקת הסתעפות עם JavaScript.
* אתה יכול להחזיר ביטוי JSX באופן מותנה עם `if` statement.
* אתה יכול לשמור כמה JSX במשתנה ואז לכלול אותו בתוך JSX אחר על ידי שימוש בסוגריים המתולתלים.
* ב-JSX, `{cond ? <A /> : <B />}` פירושו *"אם `cond`, עיבוד `<A />`, אחרת `<B />`"*.
* ב-JSX, `{cond && <A />}` פירושו *"אם `cond`, render `<A />`, אחרת כלום"*.
* קיצורי הדרך נפוצים, אבל אתה לא צריך use אותם אם אתה מעדיף `if` רגיל.

</Recap>



<Challenges>

#### הצג סמל עבור פריטים לא שלמים עם `? :` {/*show-an-icon-for-incomplete-items-with--*/}

השתמש באופרטור המותנה (`cond ? a : b`) כדי להציג ❌ אם `isPacked` אינו `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### הצג את חשיבות הפריט באמצעות `&&` {/*show-the-item-importance-with-*/}

בדוגמה זו, כל `Item` מקבל אבזר `importance` מספרי. השתמש באופרטור `&&` כדי להציג את "_(חשיבות: X)_" באותיות נטוי, אך רק עבור פריטים בעלי חשיבות שאינה אפס. רשימת הפריטים שלך אמורה להיראות כך בסופו של דבר:

* חליפת חלל _(חשיבות: 9)_
*קסדה עם עלה זהב
* תמונה של תם _(חשיבות: 6)_

אל תשכח להוסיף רווח בין שתי התוויות!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

זה אמור לעשות את העבודה:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

שים לב שעליך לכתוב `importance > 0 && ...` ולא `importance && ...` כך שאם ה-`importance` הוא `0`, `0` לא יוצג כתוצאה!

בפתרון זה, שני תנאים נפרדים הם used כדי להוסיף רווח בין השם לתווית החשיבות. לחלופין, תוכל להוסיף use ל-Fragment עם רווח מוביל: `importance > 0 && <> <i>...</i></>` או להוסיף רווח מיד בתוך ה-`<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

#### משנה סדרה של `? :` עד `if` ומשתנים {/*refactor-a-series-of---to-if-and-variables*/}

רכיב `Drink` זה use הוא סדרה של `? :` תנאים כדי להציג מידע שונה בהתאם לשאלה אם התמיכה `name` היא `"tea"` או `"coffee"`. הבעיה היא שהמידע על כל משקה מתפזר על פני מספר תנאים. Refactor this code to use a single `if` statement instead of three `? :` conditions.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

לאחר שחזרת את הקוד ל-use `if`, האם יש לך רעיונות נוספים כיצד לפשט אותו?

<Solution>

ישנן מספר דרכים שבהן תוכל לעשות זאת, אך הנה נקודת התחלה אחת:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

כאן המידע על כל משקה מקובץ יחד במקום להתפזר על פני מספר תנאים. זה מקל על הוספת משקאות נוספים בעתיד.

פתרון אחר יהיה להסיר את המצב לחלוטין על ידי העברת המידע לאובייקטים:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
