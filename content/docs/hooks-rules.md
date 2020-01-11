---
id: hooks-rules
title: חוקי Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*Hooks* הם תוספת חדשה ב- React 16.8. הם נותנים לנו להשתמש ב- state ופיצ'רים אחרים של ריאקט מבלי לכתוב מחלקה.

Hooks הם פונקציות ג'אווהסקריפט, אבל אתה צריך לנהוג על פי שני חוקים כשאתה משתמש בהם. אנו מספקים [פלאגין linting](https://www.npmjs.com/package/eslint-plugin-react-hooks) שאוכף חוקים אלו אוטומטית:

### ניתן לקרוא ל- Hooks רק ברמה העליונה {#only-call-hooks-at-the-top-level}

**אל תקרא ל- Hooks בתוך לופים, conditions כמו if או פונקציות מקוננות.** במקום זאת, תמיד השתמש ב- Hooks ברמה העליונה של פונקציית הריאקט שלך. על ידי ביצוע כלל זה, אתה מבטיח ש- Hooks נקראים באותו סדר כל פעם שקומפוננטה מתרנדרת. זה מה שמאפשר לריאקט לשמור את ה- state של Hooks בין קריאות מרובות של `useState` ו- `useEffect`. (אם אתה סקרן, נסביר זאת לעומק [למטה](#explanation).)

###ניתן לקרוא ל- Hooks רק מתוך פונקציות ריאקט{#only-call-hooks-from-react-functions}

**אל תקרא ל- Hooks מתוך פונקציות ג'אווהסקריפט רגילות.** במקום זאת, אתה יכול:

* ✅ לקרוא ל- Hooks מתוך קומפוננטות פונקציה של ריאקט.
* ✅ לקרוא ל- Hooks מתוך Hooks מותאמים אישית( נלמד עליהם [בעמוד הבא](/docs/hooks-custom.html)).

על ידי ביצוע כלל זה, אתה מבטיח שכל לוגיקה שהיא stateful בתוך קומפוננטה היא ברורה לעין מקוד המקור שלה.

## פלאגין ESLint {#eslint-plugin}

שחררנו פלאגין ESLint שנקרא [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) האוכף אוטומטית שני חוקים אלה. אתה יכול להוסיף את הפלאגין הזה לפרויקט שלך אם תרצה לנסות אותו:

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```js
// קונפיגורציית ה- ESLint שלך
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // בודק חוקי Hooks
    "react-hooks/exhaustive-deps": "warn" // בודק effect dependencies
  }
}
```

פלאגין זה כלול כברירת מחדל ב-[Create React App](/docs/create-a-new-react-app.html#create-react-app)

**אתה יכול לדלג לעמוד הבא שמסביר איך לכתוב [Hooks משלך](/docs/hooks-custom.html) עכשיו.** בעמוד זה, נמשיך בלהסביר את הסיבות שמאחורי חוקים אלה.

## הסבר {#explanation}

כמו [שלמדנו מקודם](/docs/hooks-state.html#tip-using-multiple-state-variables), אנחנו יכולים להשתמש במספר State או Effect Hooks בתוך קומפוננטה יחידה:

```js
function Form() {
  // 1.	שימוש במשתנה name ב- state
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3.	שימוש במשתנה surname ב- state
  const [surname, setSurname] = useState('Poppins');

  // 4.	שימוש באפקט על מנת לעדכן את הכותרת
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

אז איך ריאקט יודע איזה state מתאים לאיזו קריאת `useState`? התשובה היא **שריאקט מסתמך על סדר קריאת ה- Hooks.** הדוגמה שלנו עובדת בגלל שסדר קריאות ה- Hooks הוא אותו דבר בכל רינדור:

```js
// ------------
// רינדור ראשון
// ------------
useState('Mary')           // 1. איתחול המשתנה name ב- state עם 'Mary'
useEffect(persistForm)     // 2. Add an effect for persisting the form
useState('Poppins')        // 3. איתחול המשתנה surname ב- state עם 'Poppins'
useEffect(updateTitle)     // 4. הוספת אפקט על מנת לעדכן את הכותרת

// -------------
// Second render
// -------------
useState('Mary')           // 1. קריאת המשתנה name ב- state (מתעלמים מהקלט)
useEffect(persistForm)     // 2. Replace the effect for persisting the form
useState('Poppins')        // 3. קוראים את המשתנה surname ב- state (מתעלמים מהקלט)
useEffect(updateTitle)     // 4. מחליפים את האפקט על מנת לעדכן את הכותרת

// ...
```

כל עוד הסדר של קריאות Hook הוא שווה בין רינדורים, ריאקט יכול לצרף state מקומי עם כל אחד מהם. אבל מה קורה אם אנחנו שמים קריאת Hook (לדוגמה, האקפט `persistForm`) בתוך condition?

```js
  // 🔴 אנחנו עוברים על החוק הראשון על ידי שימוש ב- Hook בתוך condition
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

ה- condition `name !== ' '` הוא `true` ברינדור הראשון, אז אנחנו מריצים Hook זה. למרות זאת, יכול להיות שברינדור הבא המשתמש ינקה את הטופס, וכתוצאה מכך ה- condition יהפוך ל- `false`. עכשיו שאנחנו מדלגים על Hook זה בזמן רינדור, הסדר של קריאות Hook משתנה:

```js
useState('Mary')           // 1. קריאת המשתנה name ב- state (מתעלמים מהקלט)
// useEffect(persistForm)  // 🔴 דילגנו על Hook זה!
useState('Poppins')        // 🔴 2 (אבל היה 3). נכשל בלקרוא את המשתנה surname
useEffect(updateTitle)     // 🔴 3 (אבל היה 4). נכשל בלהחליף את האפקט
```

ריאקט לא ידע מה להחזיר לקריאה השנייה של ה- Hook `useState`. ריאקט ציפה שקריאת ה- Hook השנייה בקומפוננטה הזו תהיה תואמת לאפקט `persistForm`, בדיוק כמו ברינדור הקודם, אבל זה לא דומה יותר. מנקודה זו, כל קריאת Hook אחרי האחת שדילגנו עליה תזוז באחד, דבר שיוביל לבאגים.

**זאת הסיבה שחייב לקרוא ל- Hooks ברמה העליונה של הקומפוננטות שלנו.** אם אנחנו רוצים להריץ אפקט מותנה, אנחנו יכולים לשים תנאי זה *בתוך* ה- Hook שלנו:

```js
  useEffect(function persistForm() {
    // 👍 אנחנו לא עוברים על החוק הראשון יותר
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**שים לב שאתה לא צריך לדאוג מבעיה זו אם אתה משתמש [בחוק lint](https://www.npmjs.com/package/eslint-plugin-react-hooks).** אבל עכשיו אתה גם יודע *למה* Hooks עובדים בדרך זו, ואילו בעיות החוק הזה מונע.

## הצעדים הבאים {#next-steps}

סוף כל סוף, אנו מוכנים ללמוד על כתיבת [Hooks משלנו](/docs/hooks-custom.html)! Hooks מותאמים אישית נותנים לך לשלב Hooks שמסופקים על ידי ריאקט לתוך האבסטרקציות שלך, ולעשות שימוש חוזר בלוגיקה שהיא stateful בין קומפוננטות שונות.
