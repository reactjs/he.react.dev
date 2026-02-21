---
title: "לקוח React DOM APIs"
---

<Intro>

ה-APIs של `react-dom/client` מאפשרים לרנדר קומפונטות React בצד לקוח (בדפדפן). בדרך כלל משתמשים ב-APIs האלה ברמה העליונה של האפליקציה כדי לא להתחיל את עץ ה-React. [Framework](/learn/start-a-new-react-project#production-grade-react-frameworks) יכול לקרוא להם עבורכם. רוב הקומפוננטות שלכם לא צריכות לייבא או להשתמש בהם.

</Intro>

---

## לקוח APIs {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) יכול ליצור שורש להצגת קומפונטות React בתוך DOM צומת בדפדפן.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) מאפשר להציג קומפוננטות React בתוך DOM צומת בדפדפן, כאשר התוכן ה-HTML נוצר קודם על ידי [`react-dom/server`.](/reference/react-dom/server)

---

## תמיכה בדפדפנים {/*browser-support*/}

React תומכת בכל הדפדפנים הנפוצים, כולל Internet Explorer 9 ומעלה. עבור דפדפנים ישנים יותר כמו IE 9 ו-IE 10 ישנים polyfills חוקי.
