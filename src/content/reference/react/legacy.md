---
title: "מדור קודם React APIs"
---

<Intro>

ה-APIs האלה מיוצאים מחבילת `react`, אבל לא מומלצים להשתמש בקוד חדש. ראו את עמודי ה-API המקושרים עבור חלופות מומלצות.

</Intro>

---

## מדור קודם APIs {/*legacy-apis*/}

* [`Children`](/reference/react/Children) יכול לבצע מניפולציה וטרנספורמציה ל-JSX שהתקבלו דרך פרופס בשם `children`. [ראו חלופות.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) יכול ליצור React אלמנט מנקודת התחלה של אלמנט אחר. [ראו חלופות.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) יכול להגדיר קומפונטת React כ-class ב-JavaScript. [ראו חלופות.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) יכול ליצור אלמנט React. בדרך כלל תשתמשו ב-JSX במקום.
* [`createRef`](/reference/react/createRef) יוצר אובייקט יכול להכיל את כל הערך. [ראו חלופות.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) בודק האם הערך הוא React אלמנט. בדרך כלל בשימוש עם [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) דומה ל-[`Component`,](/reference/react/Component) אבל מדלג על רינדורים חוזרים עם אותם props. [ראו חלופות.](/reference/react/PureComponent#alternatives)


---

## APIs שהוצאו שימוש {/*deprecated-apis*/}

<Deprecated>

ה-APIs האלה יוסרו בגרסה ראשית עתידית של React.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) יכול ליצור פונקציית שמייצרת React אלמנטים ספציפיים.
