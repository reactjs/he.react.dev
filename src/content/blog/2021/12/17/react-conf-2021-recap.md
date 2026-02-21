---
title: "סיכום React Conf 2021"
---

17 בדצמבר 2021 מאת [ג'סלין טנאדי](https://twitter.com/jtannady) ו[ריק הנלון](https://twitter.com/rickhanlonii)

---

<Intro>

בשבוע שעבר אירחנו את React Conf השישי שלנו. מקומי קודמות השתמשנו בבמה של React Conf כדי למסור הכרזות ששינו את הדרג התעשייה, כמו [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) ו-[_React Hooks_](https://reactjs.org/docs/hooks-intro.html). השנה שיתפנו את החזון הרב- שטחי-מו שלנו ל-____T ואי_7 שלנו. __,T זה יכול להתמודד.

</Intro>

---

זו הייתה הפעם הראשונה ש-React Conf התארח אונליין, והוא שודר בחינם עם תרגום ל-8 שפות שונות. משתתפים מכל העולם הצטרפו ל-Discord של הכנס ולאירוע השידור החוזר, כדי לאפשר נגישות בכל אזורי הזמן. יותר מ-50,000 אנשים נרשמו, עם מעל 60,000 צפיות ב-19 הרצאות, ו-5,000 משתתפים ב-Discord בשניים ביחד.

כל ההרצאות [זמינות לצפייה אונליין](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

הנה סיכום של מה שעלה על הבמה:

## React 18 ויכולות להתמודד {/*react-18-and-concurrent-features*/}

בהרצאת הפתיחה שיתפנו את החזון שלנו לעתיד React, שמתחיל ב-React 18.

React 18 מוסיף את מנוע ה-renderer של בו-זמנית שחיכו לו זמן, יחד עם עדכונים ל-__TK_0 רב__, שינויים שוברים משמעותיים. אפליקציות יכולות לשדרג ל-React 18 ולהתחיל לאמץ יכול להגיע בהדרגה, במאמץ דומה לכל שחרור major אחר.

**זה אומר שאין מצב בו זמנית, יש רק תכונות במקביל.**

בהרצאת הפתיחה שיתפנו גם את החזון שלנו לגבי Suspense, רכיבי שרת, קבוצות עבודה חדשות של React, וחזון רב- פלטפורמה ארוכה טווח עבור React Native.

צפו בהרצאת הפתיחה המלאה של [Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), and [Rick Hanlon](https://twitter.com/rickhanlonii):

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## React 18 למפתחי אפליקציות {/*react-18-for-application-developers*/}

בהרצאת הפתיחה הכרזנו גם ש-React 18 RC זמין לניסיון כבר עכשיו. בכפוף למשוב נוסף, זו תהיה בדיוק גרסת React לפרסם כי הופיעו בתחילת השנה הבאה.

כדי לנסות את React 18 RC, שדרגו את התלויות:

```bash
npm install react@rc react-dom@rc
```

ועברו ל-API החדש של `createRoot`:

```js
// before
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// after
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

להדגמה של שדרוג ל-React 18, ראו את ההרצאה של [שרוטי קאפור](https://twitter.com/shrutikapoor08):

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## עיבוד שרת סטרימינג עם Suspense {/*streaming-server-rendering-with-suspense*/}

React 18 כולל גם שיפורים לביצועי רינדור צד שרת באמצעות Suspense.

עיבוד שרת זרימה יכול להשתמש HTML מקומפוננטות React בשרת, ולהזרים את ה-HTML הזה למשתמשים. ב-React 18 אפשר להשתמש ב-`Suspense` כדי לפרק את האפליקציה ליחידות קטנות ועצמאיות שאפשר להזרים בנפרד בלי לחסום את שאר האפליקציה. כלומר, משתמשים יראו תוכן מוקדם יותר ויוכלו להתחיל אינטראקציה הרבה יותר מהר.

לצלילה עמוקה, ראו את ההרצאה של [איש שונדאי](https://twitter.com/shaundai):

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## קבוצת העבודה הראשונה של React {/*the-first-react-working-group*/}

עבור React 18 יצרנו את קבוצת העבודה הראשונה שלנו כדי לשתף פעולה עם פאנל של מומחים, מפתחים, מתחזקי ספריות ומדריכים. יחד בנינו את אסטרטגיית האימוץ ההדרגתי שלנו ושייפנו APIs חדשים כמו `useId`, `useSyncExternalStore`, ו-`useInsertionEffect`.

לסקירה של העבודה הזו, ראו את ההרצאה של [Aakansha' Doshi](https://twitter.com/aakansha1216):

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## כלי פיתוח עבור React {/*react-developer-tooling*/}

כדי לתמוך ביכולות החדשות של השחרור הזה, הכרזנו גם על צוות React DevTools החדש ועל ציר הזמן Profiler חדש שיעזור מפתחים לדבג אפליקציות React.

למידע נוסף ולהדגמה של יכול DevTools חדשות, ראו את ההרצאה של [בריאן ווהן](https://twitter.com/brian_d_vaughn):

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## React בלי memo {/*react-without-memo*/}

במבט רחוק יותר לעתיד, [Xuan Huang (黄玄)](https://twitter.com/Huxpro) עדכון ממחקר React Labs שלנו על קומפיילר עם auto-memoization. לצפייה במידע ובהדגמה של אבטיפוס הקומפיילר:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## הרצאת תיעוד React {/*react-docs-keynote*/}

[רייצ'ל נאבורס](React פתחה מקבץ הרצאות על למידה ועיצוב עם React, עם keynote על ההשקעה שלנו בתיעוד React החדש ([שכיום הושק כ-react.dev](/blog/2023/03/16/introducing-react-dev)):

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## ועוד... {/*and-more*/}

**שמענו גם הרצאות על למידה ועיצוב עם React:**

* דבי אובריאן: [דברים שלמדתי מהמסמכים החדשים של React](https://youtu.be/-7odLW_hG7s).
* שרה ריינברגר: [למידה בדפדפן](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [החזר ה-ROI של עיצוב עם React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [מגרשי משחקים אינטראקטיביים עם React](https://youtu.be/zL8cz2W0z34).

**הרצאות מצוותי ממסר, React Native ו-PyTorch:**

* רוברט באליצקי: [מציג מחדש את הממסר](https://youtu.be/lhVGdErZuN4).
* אריק רוזל וסטיבן מויס: [React שולחן עבודה מקורי](https://youtu.be/9L4FFrvwJwY).
* רומן ראדל: [למידה מכונה במכשיר עבור React Native](https://youtu.be/NLj73vrc2I8)

**וגם הרצאות קהילה על נגישות, כלי פיתוח ו-Server Components:**

* Daishi Kato: [React 18 עבור ספריות חנות חיצוניות](https://youtu.be/oPfSC5bQPR8).
* דייגו האז: [בניית רכיבים נגישים ב-React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [רכיבי טופס יפני נגישים עם React](https://youtu.be/S4a0QlsH0pU).
* לייל טרוקסל: [כלי ממשק משתמש לאמנים](https://youtu.be/b3l4WxipFsE).
* הלן לין: [מימן + React 18](https://youtu.be/HS6vIYkSNks).

## תודה {/*thank-you*/}

זו הייתה השנה הראשונה שבה תכננו כנס בעצמנו, ויש לנו הרבה אנשים להודות להם.

קודם כל תודה לכל הדוברים שלנו [Aakansha Doshi](https://twitter.com/Huxpro). [אנדרו קלארק](__TK_1__ [Brian Vaughn](__TK_2__ [Daishi Kato](__TK_3__ [דבי אובריאן](__TK_4__ [Delba de Oliveira](E__TK_6__] [__TK_6__] Rozell](__TK_7__ [Helen Lin](__TK_8__ [Juan Tejada](__TK_9__ [Lauren Tan](__TK_10__ [Linton Ye](__TK_11__ [Lyle Troxell](__TK_12__ [רייצ'ל Nabors](__TK_13]4 [__TK_13]__ [__TK_13] Balicki](__TK_15__ [Roman Rädle](__TK_16__ [שרה ריינברגר](__TK_17__ [Shaundai Person](__TK_18__ [Shruti Kapoor](__TK_19__ [סטיבן מויס](__TK_20__ [Huang_21](__TK_20__ ו-נקזאקיאן) (黄玄)](https://twitter.com/Huxpro).

תודה לכל מי שעזרו לתת פידבק על ההרצק, כולל [אנדרו קלארק](https://twitter.com/acdlite), [דן אברמוב](https://twitter.com/dan_abramov), [דייב מקייב](https://twitter.com/mcc_abe), [אלי ווייט](https://twitter.com/Eli_White), [ג'ו סאבונה](https://twitter.com/en_JS), [לורן טאן](https://twitter.com/potetotes),]6) [https://twitter.com/potetotes),]6](https://twitter.com/potetotes),]6) [https://twitter.com/potetotes),] [https://twitter.com/potetotes),] יונג](https://twitter.com/yungsters).

תודה ל-[Lauren Tan](https://twitter.com/potetotes) על הקמת Discord של הכנס ועל התפקיד כ-Discord admin שלנו.

תודה ל-[סת' וובסטר](https://twitter.com/sethwebster) לגבי הכיוון הכללי ועל כך שווידא שנשארנו ממוקדים בגיוון והכלה.

תודה ל-[רחל נאבורס](https://twitter.com/rachelnabors) על הובלת מאמץ המודרציה שלנו, ול-[עיישה בלייק](https://twitter.com/AishaBlake) על יצירת מדריך המודרציה, הובלת צוות המודרציה, הכשרת המתרגמים והמודרטים, וסיוע במודרציה של שני המבצעים.

תודה למודרטורים שלנו [Jesslyn Tannady](https://twitter.com/Huxpro). [Suzie Grange](__TK_1__ [בקה ביילי](__TK_2__ [Luna Wei](__TK_3__ [Joe Previte](__TK_4__ [Nicola Corti](__TK_5__ [GijsKdio Weterings](__TK_5__ [Clau__Kdio Weterings]___] ג'וליה נוימן, מנגדי צ'ן, ז'אן ז'אנג, ריקי לי ו[שואן הואנג (黄玄)](https://twitter.com/Huxpro).

תודה ל-[Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0), וויהאנג פאטל מהודו [React](https://www.reactindia.io/), ול-[Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15), ו-[YanLun Li](__TK___5](__TK___ 5) מ-[__K___8) China](https://twitter.com/ReactChina) על עזרה במודרציה של אירוע השידור החוזר ושמירה על מעורבות גבוהה בקהילה.

תודה ל-Vercel על פרסום [Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit), שעליו נבנה אתר הכנס, ול-[Lee Robinson](https://twitter.com/leeerob) ו-[Delba de Oliveira](https://twitter.com/delba_oliveira) על שיתוף ניסיון מהפקת Next.js Conf.

תודה ל-[לאה זילבר](https://twitter.com/wifelette) על שיתוף פעולה בהפקת כנסים, תובנות מ-[RustConf](https://rustconf.com/), ועל הספר שלה [Event Driven](https://leanpub.com/eventdriven/) והעצות שבו הפקת על הכנסים.

תודה ל-[קווין לואיס](https://twitter.com/_phzn) ול-[רחל נאבורס](https://twitter.com/rachelnabors) על שיתוף ניסיון מהפקת Women of React Conf.

תודה ל-[Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic), and [Shaundai Person](https://twitter.com/shaundai) על העצות והרעיונות לאורך כל התכנון.

תודה ל-[דן לבוביץ](https://twitter.com/lebo) על עזרה בעיצוב ובניית אתר הכנס והכרטיסים.

תודה ל-Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman ואחרים מצוות Facebook Video Productions על הקלטת הסרטונים ל-Keynote ולהרצאות עובדי Meta.

תודה לשותפים שלנו ב-HitPlay על עזרה בארגון הכנס, עריכת כל סרטוני השידור, תרגום כל ההרצאות ומודרציה של Discord בכמה שפות.

ולבסוף, תודה לכל המשתתפים שלנו שהפכה את זה ל-React Conf נהדר.
