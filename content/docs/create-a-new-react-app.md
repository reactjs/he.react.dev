---
id: create-a-new-react-app
title: יצירת אפליקציית React חדשה
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

השתמש בסט של כלים משולבים על מנת לקבל את חווית המשתמש והמפתח הטובה ביותר.

עמוד זה מסביר על מספר סטים של כלי React פופולריים שמקלים על משימות כמו:

* גדילה לקבצים וקומפוננטות מרובות.
* שימוש בספריות צד שלישי מ-npm.
* איתור טעויות נפוצות מוקדם.
* עריכה בזמן אמת של CSS ו-JavaScript בפיתוח.
* אופטימיזציה של המוצר לפרודקשן.

הסטים של הכלים שאנו ממליצים עליהם בעמוד זה **לא דורשים קונפיגורציה על מנת להתחיל**.

## ייתכן שלא תזדקק לסט כלים {#you-might-not-need-a-toolchain}

אם לא חווית את הבעיות המתוארות לעיל או שאינך מרגיש בנוח להשתמש בכלי JavaScript עדיין, שקול [להוסיף את ריאקט כתגית `<script>` פשוטה בדף HTML](/docs/add-react-to-a-website.html), [עם JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx) או בלי.

זאת גם **הדרך הפשוטה ביותר לשלב את React לתוך אתר קיים.** תמיד קיימת האפשרות להוסיף סט כלים גדול יותר אם תמצא שזה יכול לעזור!

## סטים של כלים מומלצים {#recommended-toolchains}

הצוות של React ממליץ על הפתרונות הבאים:

- אם אתה **לומד React** או **יוצר אפליקציית [דף-יחיד](/docs/glossary.html#single-page-application) חדשה** השתמש ב-[Create React App](#create-react-app).
- אם אתה בונה **אתר server-rendered עם Node.js**, נסה את [Next.js](#nextjs).
- אם אתה בונה **אתר סטטי מבוסס תוכן**, נסה את [Gatsby](#gatsby).
- אתה אתה בונה **ספריית קומפוננטות** או **משלב עם קוד קיים**, נסה [נסה כלים גמישים יותר](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) יוצר סביבה נוחה למטרת **למידה של ריאקט**, והוא הדרך הטובה ביותר להתחיל לבנות **אפליקציית [דף-יחיד](/docs/glossary.html#single-page-application) חדשה** ב-React.

הוא מארגן לך את סביבת העבודה כך שתוכל להשתמש בפיצ'רים החדשים ביותר של JavaScript, מספק חווית מפתח נוחה, ועושה אופטימיזציה על האפליקצייה שלך עבור פרודקשן. תצטרך להתקין את Node [בגרסה](https://nodejs.org/en/) 14.0.0 ומעלה ו-npm בגרסה 5.6 ומעלה. על מנת ליצור פרויקט, הרץ:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>הערה
>
>`npx` בשורה הראשונה זה לא שגיאת כתיב – זה [כלי הרצת חבילות שמגיע עם npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App לא מטפל בלוגיקת backend או במסדי נתונים; הוא רק יוצר מערכת בניית פרונט-אנד, שניתן להשתמש בה עם כל backend שנרצה. מאחורי הקלעים, הוא משתמש ב-[Babel](https://babeljs.io/) ו-[webpack](https://webpack.js.org/), אבל אין צורך לדעת עליהם.

כשאתה מוכן להעלות לפרודקשן, הרצת `npm run build` תיצור גרסה יעילה של האפליקציה שלך בתיקיית ה-`build`. ניתן ללמוד עוד על Create React App [מה-README שלו](https://github.com/facebookincubator/create-react-app#create-react-app-) ומ[מדריך המשתמש](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) הוא פריימוורק פופולרי וקל משקל ל**אפליקציות סטטיות ומרונדרות-שרת** הנבנות עם React. הוא מכיל **פתרונות עיצוב וניתוב** ישר מהקופסא, ומניח שאתה משתמש ב- [Node.js](https://nodejs.org/) כסביבת השרת.

למד על Next.js [מהמדריך הרשמי](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) הוא הדרך הכי טובה ליצירת **אתרים סטטים* עם React. הוא נותן לך להשתמש בקומפוננטות React, אבל פולט HTML ו-CSS שרונדרו מראש על מנת להבטיח את זמני טעינה המהירים ביותר.

למד על Gatsby [מהמדריך הרשמי](https://www.gatsbyjs.org/docs/) [ומגלרית ערכות ההתחלה](https://www.gatsbyjs.org/docs/gatsby-starters/).

### עוד סטים של כלים גמישים {#more-flexible-toolchains}

סט הכלים הבאים מציע יותר גמישות ובחירה. אנו ממליצים עליהם למשתמשים מתקדמים יותר:

- **[Neutrino](https://neutrinojs.org/)** משלב את הכוח של [webpack](https://webpack.js.org/) עם הפשטות של presets, ומכיל preset [לאפליקציות React](https://neutrinojs.org/packages/react/) [וקומפוננטות React](https://neutrinojs.org/packages/react-components/).

- **[Nx](https://nx.dev/react)** הוא ערכת כלים לפיתוח monorepo פול-סטאק, עם תמיכה מובנית לריאקט, Next.js, [Express](https://expressjs.com/) ועוד.

- **[Parcel](https://parceljs.org/)** הוא אפליקציית ווב מהירה, נטולת קונפיגורציות שמשמשת כ-bundler [שעובד עם React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** הוא פרייוורק שמשמש לרינדור צד-שרת ולא דורש שום קונפיגורציה, אך מציע יותר גמישות מ-Next.js.

## יצירת סט כלים מאפס {#creating-a-toolchain-from-scratch}

בדרך כלל סט כלי JavaScript מורכב מ:

* **מנהל חבילות**, כמו [Yarn](https://yarnpkg.com/) או [npm](https://www.npmjs.com/). זה מאפשר לך לנצל אקוסיסטם רחב של חבילות צד-שלישי, ולהתקין או לעדכן אותן בקלות.

* **bundler**, כמו [webpack](https://webpack.js.org/) או [Parcel](https://parceljs.org/). זה מאפשר לך לכתוב קוד מודולרי ולקבץ אותו לחבילות קטנות על מנת לשפר זמני טעינה.

* **compiler** כמו [Babel](https://babeljs.io/). זה מאפשר לך לכתוב קוד JavaScript מודרני שעדיין עובד בדפדפנים ישנים.

אם אתה מעדיף לתכנן את סט הכלים שלך מאפס, [קרא את המדריך הזה](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) שיוצר מחדש כמה מהפונקציונליות של Create React App.

אל תשכח לוודא שסט הכלים שלך [מוגדר באופן נכון לפרודקשן](/docs/optimizing-performance.html#use-the-production-build).
