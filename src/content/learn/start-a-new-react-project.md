---
title: "התחלת פרויקט React חדש"
---

<Intro>

אם אתם רוצים לבנות אפליקציה חדשה או אתר חדש שמבוססים על React, אנחנו ממליצים לבחור אחד מה-frameworks הפופולריים שמונעים על ידי React.

</Intro>


אפשר להשתמש ב-React גם בלי מסגרת, אבל ראינו שרוב האפליקציות והאתרים בסוף בונים פתרונות לבעיות נפוצות כמו פיסול קוד, ניתוב, שליפת נתונים ויצירת HTML. אלה בעיות משותפות לכל ספריות ה-UI, לא רק ל-React.

אם מתחילים עם מסגרת אפשר להתחיל לעבוד מהר עם React, ולהימנע מstate שבו אנו תבנו מסגרת משלכם בהמשך.

<DeepDive>

#### האם אפשר להשתמש ב-React בלי מסגרת? {/*אני-יכול-להשתמש-להגיב-ללא-מסגרת*/}

אפשר להשתמש ב-React בלי framework, כך בדיוק [משתמשים ב-React רק עבור חלק מהעמוד.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **אבל אם אתם בהחלט בונים אפליקציה חדשה או מ2__, ב-TK_

הנה למה.

גם אם בהתחלה לא צריך ניתוב או שליפת נתונים, סביר שבהמשך תרצו להוסיף ספריות לכך. ככל שחבילת ה-JavaScript שלכם תגדל עם כל יכולת חדשה, שתצטרכו להבין איך לפצל קוד לכל מסלול אפשר בנפרד. שצורכי שליפת מסתכלים, סביר שתיתקלו ב-waterfalls של רשת בין שרת ללקוח שיגרמו לאפליקציה להרגיש איטית מאוד. ככל שהקהל יכלול יותר משתמשים עם חלשה ומכשירים חלשים, אפשר שתצטרכו רשת HTML מהקומפונט כדי להציג תוכן מוקדם, בשרת או בזמן לבנות. שינוי ה-setup כך שחלק מה ירוץ בשרת או בזמן לבנות יכול להיות מורכב מאוד.

**הבעיות האלה לא ייחודיות ל-React. לכן ל-Svelte יש SvelteKit, ל-Vue יש Nuxt וכן הלאה.** כדי לפתור זאת לבד, תצטרכו לשלב בין הבאנדלר לראוטר ולספריית שליפת הארגון. לא קשה להגיע לראשוני שעובד, אבל ניואנסים ביצירת אפליקציה שננתה מהר גם כשהיא גדלה לאורך זמן. תרצו לשלוח את הפעולות הנכנסות לקוד האפליקציה, אבל זאת בסבב לקוח-שרת אחד ובמקביל לכל הדרושים. כנראה תרצו שהעמוד יהיה אינטראקטיבי עוד לפני שה-JavaScript רץ בפועל, כדי לתמוך בשיפור מתקדם. אפשר לאחסן בכל מקום ועד יעבדו גם כש-JavaScript כבוי. בנייה עצמית של היכולות האלה דורשת עבודה אמיתית.

**ה-frameworks של React בעמוד הזה פותרים בעיות כאלה כברירת מחדל, עבודה נוספת מצדכם.** הם יכולים להתחיל בצורה רזה מאוד ואז להגדיל את האפליקציה לפי הצורך. לכל מסגרת יש קהילה, יש קל יותר תשובות ולשדרג כלי עבודה. frameworks גם נותנים מבנה לקוד ועוזרים לכם לשמור על הקשר וידע בין פרויקטים שונים. לעומת זאת, ב-setup מותאם אישית קל יותר להיתקע על גרסאות תלויות לא נתמכות, ובפועל תמצאו את עצמכם בונים מסגרת משלכם, רק בלי קהילה ובלי נתיב שדרוג (ואם זה כמו הדברים בנינו בעבר, גם פחות מסודר).

אם לאפליקציה שלכם יש אילוצים חריגים שה-frameworks האלה לא משרתים טוב, או שאתם מעדיפים לפתור את הכול בעצמכם, אפשר לבנות אישית אישית עם React. קחו `react-dom` ו-`react-dom` מ-npm, הגדירו עבור לבנות עם bundler כמו [Vite](https://vitejs.dev/) או [Parcel](https://parceljs.org/), והוסיפו כלים נוספים ניתוב, יצירה סטטית, רינדור צד שרת ועוד.

</DeepDive>

## React מסגרות ברמת פרודקשן {/*production-grade-react-frameworks*/}

ה-frameworks האלה תומכים בכל היכולות שצריך לפרוס ולהגדיל אפליקציה בפרודקשן, ופועלים לקראת תמיכה ב-[חזון ארכיטקטורת ה-full-stack שלנו](#which-features-make-up-the-react-teams-full-stack-architecture-vision). כל ה-frameworks הם ממליצים אותם הם קוד פתוח עם קהילות לתמיכה, אוניות לפריסה על השרת שלכם או אצל ספק אירוח. אם אתם מחברי מסגרת ורוצים להיכלל ברשימה הזו, [ספרו לנו](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[נתב דפי Next.js](https://nextjs.org/) הוא React framework מלא.** הוא גמיש ומאפשר לבנות אפליקציות React בכל גודל, מבלוג סטטי רובו ועד אפליקציה דינמית מורכבת. כדי ליצור פרויקט Next.js חדש, הריצו בטרמינל:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

אם אתם חדשים ב-Next.js, מומלץ לעבור על [קורס הלימוד של Next.js.](https://nextjs.org/learn)

Next.js מתוחזק על ידי [Vercel](https://vercel.com/). אפשר [לפרוס אפליקציית Next.js](https://nextjs.org/docs/app/building-your-application/deploying) לכל אירוח Node.js או serverless, או לשרת משלכם. Next.js תומך גם ב-[ייצוא סטטי](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) שלא דורש )

### רמיקס {/*רמיקס*/}

**[רמיקס](https://remix.run/) הוא React framework מלא עם ניתוב מקונן.** הוא יכול לפרק את האפליקציה לחלקים מקוונים לטעון נתונים תגובה תגובה ולהתרענן בת לפעולות משתמש. כדי ליצור פרויקט Remix חדש, הריצו:

<TerminalBlock>
npx ליצור-רמיקס
</TerminalBlock>

אם אתם חדשים ב-Remix, מומלץ לעבור על מדריך ה-[blog](https://remix.run/docs/en/main/tutorials/blog) (קצר) ועל מדריך ה-[app](https://remix.run/docs/en/main/tutorials/jokes) (ארוך).

רמיקס מתוחזק על ידי [Shopify](https://www.shopify.com/). כשיוצרים פרויקט Remix צריך [לבחור יעד פריסה](https://remix.run/docs/en/main/guides/deployment). אפשר לפרוס אפליקציית Remix לכל אירוח Node.js או ללא שרת באמצעות [adapter](https://remix.run/docs/en/main/other-api/adapter) קיים או כזה שתכתבו בעצמכם.

### גטסבי {/*גטסבי*/}

**[גטסבי](https://www.gatsbyjs.com/) הוא React framework לאתרים מהירים שמבוססי CMS.** אקו-סיסטם התוספים העשיר ושכבת מבוסס GraphQL שלו מפשטים שילוב תוכן לאתר, APIs ושירותים שונים. כדי ליצור פרויקט Gatsby חדש, הריצו:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

אם אתם חדשים ב-Gatsby, בדקו את [מדריך גטסבי.](https://www.gatsbyjs.com/docs/tutorial/)

גטסבי מתוחזק על ידי [Netlify](https://www.netlify.com/). אפשר [לפרוס אתר Gatsby סטטי לחלוטין](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) לכל אירוח סטטי. אם אתם משתמשים ביכולות שמוגבלות לשרת, ודאו שספק תומך עבור גטסבי.

### Expo (לאפליקציות native) {/*expo*/}

**[Expo](https://expo.dev/) הוא React framework שמאפשר ליצור אפליקציות אוניברסליות ל-Android, iOS והווב עם ממשק משתמש מקורי אמיתי.** הוא מספק SDK עבור [React Native](https://reactnative.dev/) שמקל שימוש בחלקים ה-native. כדי ליצור פרויקט Expo חדש, הריצו:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

אם אתם חדשים ב-Expo, בדקו את [מדריך Expo](https://docs.expo.dev/tutorial/introduction/).

Expo מתוחזק על ידי [Expo (החברה)](https://expo.dev/about). בניית אפליקציות עם Expo היא ללא עלויות, ואפשר לפרסם אותן לחנויות האפליקציות של Google ו-Apple ללא מגבלות. Expo מספקת גם שירותי ענן בתשלום כאפשרות להצטרף.

## React frameworks בחזית הטכנולוגיה {/*bleeding-edge-react-frameworks*/}

כשהמשכנו לבחון איך לשפר את React, ההזדמנות שלנו להשפעה הגדולה ביותר היא אינטגרציה הדוקה יותר בין React ל-frameworks, במיוחד בניתוב, חיבור וטכנולוגיות שרת. צוות Next.js הסכים משתפים איתנו פעולה במחקר, פיתוח, אינטגרציה ובדיקות שלמות React מתקדמות שאינן תלויות framework, כמו [React רכיבי שרת.](/blog/2023/03/22/react-labs-what-we-have-been-component-on-20-server)

היכולות האלו מתקרבות כל יום למוכנות לפרודקשן, ואנחנו בשיחות גם עם מפתחי באנדלרים ו-frameworks נוספים כדי לשלב. התקווה היא שלנו שבתוך שנה או שנתיים כל ה-frameworks שמופיעים בעמוד הזה יתמכו בצורה מלאה. (אם אתם מחברי מסגרת ועזרה איתנו פעולות בניסויים האלה, ספרו לנו.)

### Next.js (נתב אפליקציות) {/*nextjs-app-router*/}

**[נתב האפליקציות של Next.js](https://nextjs.org/docs) הוא עיצוב מחדש של ממשקי API ב-Next.js שמטרתו לממש את חזון ארכיטקטורת ה-full-stack של צוות React.** הוא יכול לשלוט בנתונים בקומפוננטות אסינריות בזמן שרצות בשרת או אפילו.

Next.js מתוחזק על ידי [Vercel](https://vercel.com/). אפשר [לפרוס אפליקציית Next.js](https://nextjs.org/docs/app/building-your-application/deploying) לכל אירוח Node.js או serverless, או לשרת משלכם. Next.js תומך גם ב-[ייצוא סטטי](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) שלא דורש )

<DeepDive>

#### אולי ירצו את חזון ארכיטקטורת ה-full-stack של צוות להגיב? {/*אשר-התכונות-מרכיבות-ה-react-teams-full-stack-architecture-vision*/}

ה-bundler של Next.js App Router ממש מלא את [פרט React Server Components הרשמי](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). זה יכול לשלב בעץ תגובה אחת קומפונטות של זמן לבנות, קומפוננטות שרת בלבד וקומפוננטות אינטראקטיביות.

לדוגמה, אפשר לכתוב קומפוננת תגובה בצד שרת כפונקציית `async` שקוראת ממסד נתונים או מקובץ. אחר כך אפשר להעביר דרך נתונים לקומפונטות אינטראקטיביות:

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js נתב אפליקציה משלב גם [משיפי נתונים עם מתח](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). כך אפשר להגדיר מצב טעינה (כמו חלק מיקום שלד) עבור אנשים שונים ב-UI מבוסס בעץ תגובה:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

רכיבי שרת ו-Suspense יכולים להיות של React ולא של Next.js. עם זאת, אימוץ שלהן ברמת המסגרת דורשת מחויבות ועבודת מימוש לא טריאלית. כרגע Next.js נתב האפליקציה הוא המימוש השלם ביותר. צוות תגיב עובד עם מפתחי bundlers כדי להקל על מימוש היכולות האלה בדור הבא של מסגרות.

</DeepDive>
