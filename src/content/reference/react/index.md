---
title: "סקירת הפניה של React"
---

<Intro>

החלק הזה מספק תיעוד הפניה מפורט לעבודה עם React. להיכרות עם React, עברו לחלק [Learn](/learn).

</Intro>

תיעוד ה-reference של React מחולק לתתי-חלקים פונקציונליים:

## React {/*react*/}

אפשר React ברמת API:

* [Hooks](/reference/react/hooks) - שימוש ביכולות שונות של React מתוך הקומפוננטות.
* [רכיבים](/reference/react/components) - תיעוד הקומפוננטות המובנות שאפשר להשתמש ב-JSX.
* [APIs](/reference/react/apis) - APIs שימושים להגדרת קומפונטות.
* [הנחיות](/reference/react/directives) - הנחיות ל-bundlers שתואמים ל-React רכיבי שרת.

## React DOM {/*react-dom*/}

`react-dom` כולל אפשרות שנתמכות רק באפליקציות ווב (שרצות בסביבת DOM של הדפדפן). החלק הזה מחולק ל:

* [Hooks](/reference/react-dom/hooks) - Hooks לאפליקציות ווב שרצות בסביבת DOM של הדפדפן.
* [רכיבים](/reference/react-dom/components) - React תומכת בכל רכיבי HTML ו-SVG המובנים בדפדפן.
* [APIs](/reference/react-dom) - החבילה `react-dom` כולל מתודות שנתמכות רק באפליקציות ווב.
* [Client APIs](/reference/react-dom/client) - ה-APIs של `react-dom/client` מאפשרים לרנדר קומפוננטות React בצד לקוח (בדפדפן).
* [שרת APIs](/reference/react-dom/server) - ה-APIs של `react-dom/server` מאפשרים לרנדר קומפוננטות React ל-HTML בצד שרת.

## מדור קודם APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - יוצאים מחבילת `react`, אבל לא מומלצים להשתמש בקוד חדש.
