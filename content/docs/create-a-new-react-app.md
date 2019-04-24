---
id: create-a-new-react-app
title: צור יישום ריאקט חדש
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

השתמש בכלים משולבים על מנת לקבל את חווית המשתמש והמפתח הטובה ביותר.

עמוד זה מסביר על כמה מכלי ריאקט הפופולריים ביותר שמקלים על משימות כמו:

* שינוי קנה מידה לקבצים רבים וקומפוננטות.
* שימוש בספריות צד שלישי מ- npm.
* איתור טעויות נפוצות מוקדם.
* עריכה בזמן אמת של CSS וג'אווהסקריפט בפיתוח.
* אופטימיזציה של המוצר לפרודקשן.

הכלים שאנו ממליצים עליהם בעמוד זה **לא דורשים קונפיגורציה על מנת להתחיל.**

## ייתכן שלא תזדקק לכלים {#you-might-not-need-a-toolchain}

אם לא חווית את הבעיות המתוארות לעיל או שאינך מרגיש בנוח להשתמש בכלי ג'אווהסקריפט עדיין, שקול [להוסיף את ריאקט כתגית <script> בדף HTML](/docs/add-react-to-a-website.html), עם [או בלי JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

זוהי גם **הדרך הקלה ביותר לשלב את ריאקט עם אתר קיים.** תמיד קיימת האפשרות להוסיף כלים גמישים יותר אם אתה מרגיש שזה יכול לעזור!

## כלים מומלצים {#recommended-toolchains}

המפתחים של ריאקט ממליצים על הפתרונות הבאים:

- אם אתה **לומד ריאקט** או **יוצר [יישום דף יחיד](/docs/glossary.html#single-page-application)** השתמש ב- [Create React App](#create-react-app).
- אם אתה בונה **אתר server-rendered עם Node.js**, נסה את [Next.js](#nextjs).
- אם אתה בונה **אתר סטטי מבוסס תוכן**, נסה את [Gatsby](#gatsby).
- אתה אתה בונה **ספריית קומפוננטות** או **משלב עם קוד קיים**, נסה [נסה כלים גמישים יותר](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) יוצר סביבה נוחה למטרת **למידה של ריאקט**, וסביבה זו היא הדרך הטובה ביותר להתחיל לבנות **[יישום דף יחיד](/docs/glossary.html#single-page-application) חדש** בריאקט.

Create React App מארגן לך את סביבת העבודה כך שתוכל להשתמש בפיצ'רים החדשים ביותר של ג'אווהסקריפט, מספק חווית מפתח נחמדה, ועושה אופטימיזציה על היישום שלך בשביל פרודקשן.
תצטרך להתקין גרסה 6 ומעלה של Node ו- 5.2 ומעלה של npm. על מנת ליצור פרויקט, הרץ:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>הערה
>
>`npx` בשורה הראשונה זה לא שגיאת כתיב – זה [כלי הרצת חבילות שמגיע עם npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App לא מטפל ב- backend או במסדי נתונים, הוא רק יוצר פרונט-אנד גמיש, שניתן להשתמש בו עם כל backend שנרצה. מאחורי הקלעים, הוא משתמש ב- [Babel](https://babeljs.io/) ו- [webpack](https://webpack.js.org/), אבל אין צורך לדעת עליהם.

כשאתה מוכן להעלות לפרודקשן, הרצת `npm run build` ייצור גרסה יעילה של היישום שלך בתיקיית ה- `build`. ניתן ללמוד עוד על Create React App מה- [README שלו](https://github.com/facebookincubator/create-react-app#create-react-app-) ו- [מדריך המשתמש](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) הוא פריימוורק פופולרי וקל(מבחינת גודל) ל**יישומים סטטים ו- server-rendered** הנבנים עם ריאקט. הוא מכיל **פתרונות עיצוב וניתוב**, ומניח שאתה משתמש ב- [Node.js](https://nodejs.org/) כסביבת שרת.

למד על Next.js [מהמדריך הרשמי](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) הוא הדרך הכי טובה ליצירת **אתרים סטטים* עם ריאקט. הוא נותן לך להשתמש בקומפוננטות ריאקט, אבל פולט HTML ו- CSS שרונדרו מבעוד מועד על מנת להבטיח זמני טעינה מהירים.

למד על Gatsby [מהמדריך הרשמי](https://www.gatsbyjs.org/docs/) [ומגלריה של ערכות התחלה](https://www.gatsbyjs.org/docs/gatsby-starters/).

### עוד כלים גמישים {#more-flexible-toolchains}

הכלים הבאים מציעים יותר גמישות ובחירה. אנו ממליצים עליהם למשתמשים מתקדמים יותר:

- **[Neutrino](https://neutrinojs.org/)** משלב את הכוח של [webpack](https://webpack.js.org/) עם הפשטות של presets, ומכיל preset [ליישומי ריאקט](https://neutrinojs.org/packages/react/) [וקומפוננטות ריאקט](https://neutrinojs.org/packages/react-components/).

- **[nwb](https://github.com/insin/nwb)** מעולה במיוחד [להעלאת קומפוננטות ריאקט ל- npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). [הוא יכול לשמש](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) ליצירת יישומי ריאקט גם. 

- **[Parcel](https://parceljs.org/)** הוא יישום מהיר, נטול קונפיגורציות שמשמש כ- bundler [ועובד עם ריאקט](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** הוא פרייוורק שמשמש ל- server-rendering ולא דורש קונפיגורציה, אך מציע יותר גמישות מ- Next.js.

## יצירת כלי מאפס {#creating-a-toolchain-from-scratch}

בדרך כלל כלי ג'אווהסקריפט מכיל:

* **מנהל חבילות**, כמו [Yarn](https://yarnpkg.com/) או [npm](https://www.npmjs.com/). נותן לך אפשרות להתקין או לעדכן בקלות חבילות צד שלישי.

* **bundler**, כמו [webpack](https://webpack.js.org/) או [Parcel](https://parceljs.org/). נותן לך לכתוב קוד מודולרי ולקבץ אותו לחבילות קטנות על מנת לשפר זמני טעינה.

* **compiler** כמו [Babel](https://babeljs.io/). נותן לך לכתוב קוד ג'אווהסקריפט מודרני שעדיין עובד בדפדפנים ישנים.

אם אתה מעדיף לתכנן את הכלי שלך מאפס, [קרא את המדריך הזה](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) שיוצר מחדש כמה מהפונקציונליות של Create React App.

אל תשכח לבדוק שהכלי שלך [מתוכנן באופן נכון לפרודקשן](/docs/optimizing-performance.html#use-the-production-build).
