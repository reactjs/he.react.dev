---
title: "React Labs: על מה עבדנו - פברואר 2024"
---

15 בפברואר 2024 מאת [Joseph Savona](https://twitter.com/en_JS), [ריקי הנלון](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), and [Dan Abramov](https://twitter.com/dan_abramov).

---

<Intro>

בפוסטים של React Labs אנחנו כותבים על פרויקטים שנמצאים במחקר ופיתוח פעילים. התקדמנו מאז __TK__, ורצינו לשתף בהדמות.

</Intro>

<Note>

React Conf 2024 מתוכנן ל-15-16 במאי ב-Henderson, Nevada! אם מעניין להגיע פיזית ל-React Conf, אפשר [להירשם להגרלת כרטיסים](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK) עד 28 בפברואר.

למידע נוסף על כרטיסים, סטרימינג בחינם, חסויות ועוד, ראו את [אתר React Conf](https://conf.react.dev).

</Note>

---

## React מהדר {/*react-compiler*/}

React Compiler כבר לא פרויקט מחקר: הקומפיילר מריץ עכשיו את instagram.com בפרודקשן, ואנחנו עובדים כדי לפרוס אותו למשטחים נוספים ב-Meta ולהכין את השחרור הקוד הפתוח הראשון.

כפי שדיברנו [בפוסט הקודם](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), React יכול *לפעמים* לבצע יותר מדי רינדורים מחדש כשמצב משתנה. מאז הימים הראשונים של React הפתרון שלנו למקרים כאלה היה memoization ידני. ב-APIs הנוכחיים שלנו זה אומר ב-[useCallback](/reference/react/useMemo), [useMemo](/reference/react/useCallback), ו-[React](/reference/react/memo) כדי לכוונן יד_ מחדש כמה __. אבל memoization ידני הוא פשרה: הוא מעמיס על הקוד, קל לטעות בו, ודורש עבודה נוספת כדי לשמור אותו מעודכן.

memoization ידני הוא פשרה סבירה, אבל לא היינו מרוצים. החזון שלנו הוא ש-React ירנדר מחדש *אוטומטית* רק את החלקים הנכונים ב-UI כשמצב משתנה, *להתפשר על המודל המחשבתי המרכזי של React*. אנחנו מאמינים שהגישה של React, UI כפונקציה פשוטה של ​​מצב עם ערכי JavaScript סטנדרטיים ואידיומים מוכרים, היא חלק מרכזי בסיבה לכך ש-React נגיש לכל הרבה מפתחים. לכן השקענו בבניית מהדר אופטימיזציה עבור React.

JavaScript היא שפה מאתגרת במיוחד לאופטימיזציה בגלל החוקים הרופפים והאופי הדינמי שלה. React מהדר מסוגל לקמפל קוד בצורה בטוחה על ידי מודל של גם חוקי JavaScript *וגם* "החוקים של React". לדוגמה, קומנטות React חייבות להיות idempotent, כלומר להחזיר אותו לערך עבורם קלטים, ואסור להן לשנות props או ערכי state. החוקים האלה מגבילים מה מפתחים יכולים לעשות, וגם יוצרים מרחב בטוח שבו הקומפיילר יכול לבצע אופטימיזציה.

כמובן, אנחנו מבינים שלפעמים מפתחים מכופפים את החוקים קצת, והמטרה שלנו היא ש-React מהדר יעבוד מהקופסה על כמה שיותר קוד. הקומפיילר מנסה לזהות מתי קוד לא עומד לגמרי בחוקי React, ואז או יקמפל אותו אם זה בטוח או ידלג על הקומפילציה אם זה לא בטוח. אנחנו בודקים מול בסיס הקוד ומגוון של Meta כדי לאמת את הגישה הזו.

מפתחים שרוצים לוודא שהקוד עומד בחוקי React, אנחנו ממליצים [להפעיל Strict Mode](/reference/react/StrictMode) ו-[להגדיר את תוסף ESLint של React](/learn/editor-setup#linting). הכלים האלה יכולים לתפוס באגים עדינים בקוד React, לשפר את איכות האפליקציות כבר היום, ולחזק את לעתיד מול יכולות עתידיות כמו React מהדר. אנחנו גם עובדים על תיעוד מאוחד של חוקי React ועל עדכונים לתוסף ESLint כדי לעזור לצוותים להבין ולליישם את החוקים האלה ולבנות אפליקציות חזקות יותר.

כדי לראות את הקומפיילר בפעולה, אפשר לצפות ב-[הרצאה שלנו מהסתיו האחרון](https://www.youtube.com/watch?v=qOQClO3g8-Y). בזמן ההרצאה היו לנו נתונים ניסיוניים מוקדמים מניסיון React מהדר על עמוד אחד ב-instagram.com.

## פעולות {/*actions*/}

[שיתפנו בעבר](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) אנו בוחנים פתרונות להעברת נתונים מהלקוח לשרת עם שרת פעולות, כך אפשר לבצע מוטציות במסד נתונים ולממש טפסים. על הפיתוח של פעולות שרת הרחבנו את ה-APIs האלה כדי לתמוך גם בטיפול בנתונים באפליקציות בלבד.

לקבוצת היכולות הרחבה הזו אנחנו קוראים פשוט "פעולות". פעולות המאפשרים להעביר פונקציה למרכיבים ב-DOM כמו [DOM](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

הפונקציה `action` יכולה לפעול סינכרונית או אסינכרונית. אפשר להגדיר פעולות בצד הלקוח עם JavaScript רגיל או בצד השרת עם ההנחיה [JavaScript](/reference/react/use-server). כשמשתמשים ב-action, React מנהל עבור מחזור החיים שלכם ומספק הוקס כמו [React](/reference/react-dom/hooks/useFormStatus) ו-[use](/reference/react-dom/hooks/useFormState) כדי לפענח את המצב הנוכחי של היום.

כברירת מחדל, נשארות פעולות נשלחים בתוך [transition](/reference/react/useTransition), כך שהעמוד הנוכחי אינטראקטיבי בזמן פעילות מעובדת. באילו ש-פעולות תומכים בפונקציות אסינכרון, הוספנו גם אפשרות להשתמש ב-`async/await` בתוך מעברים. זה יכול להציג ממשק משתמש בהמתנה עם מצב `isPending` של להמשיך כשהבקשה האסינכרונית (כמו `fetch`) מתחילה, ולהמשיך להציג בהמתנה למשש משתמש עד שהעדכון מוחל.

יחד עם פעולות אנחנו מציגים יכולת בשם [`async`](/reference/react/useOptimistic) לניהול עדכוני state אופטימיים. עם הוק זה אפשר להחיל עדכונים זמניים שחוזרים אוטומטית אחורה ברגע שהמצב הסופי נכתב. עבור פעולות, זה יכול לקבוע את המצב הסופי אפשרי בהנחה שהשליחה הצליחה, ולחזור לערך שהתקבל מהשרת אם צריך. זה עובד עם `async`/`await` רגיל, מתנהג אותו בין אם משתמשים ב-`fetch` בצד לקוח או ב-Server Action בצד השרת.

מחברי ספריות יכולים לממש props מותאמים סטייל `action={fn}` בקומפוננטות שלהם עם `useTransition`. הכוונה שלנו היא ספריות יאמצו את דפוס פעולות בזמן תכנון APIs של קומפונטות, כדי לספק חוויה עקבית למפתחי React. לדוגמה, אם הספרייה שלכם מספקת קומפונטה `<Calendar onSelect={eventHandler}>`, שקלו לחשוף גם API של `<Calendar selectAction={action}>`.

למרות שבתחילת הניתוח ב-Server Actions להעברת נתונים לקוח-שרת, הפילוסופיה שלנו ב-React היא מספקת אותו מודל תכנות בכל הפלטפורמה והסביבות. כשאפשר, אם אנחנו מציגים יכולת בצד הלקוח, אנחנו שואפים שתעבוד גם בשרת ולהפך. הפילוסופיה הזו יכולה ליצור סט APIs אחיד שעובד לא משנה איפה האפליקציה רצה, ומקלה על שדרוג לסביבות שונות.

פעולות זמינים עכשיו בערוץ Canary ויישלחו בגרסת React הבאה.

## אפשר חדשות ב-React Canary {/*new-features-in-react-canary*/}

הצגנו את [React Canaries](/blog/2023/05/03/react-canaries) כאפשרות לאמץ יכולות יציבות חדשות בודדות שהעיצוב שלהן קרוב לסופי, עוד שהן משתחררות בגרסת סבר יציבה.

Canaries הם שינויים באופן שבו אנחנו מפתחים את React. בעבר אפשר נחקרו ונבנו פנימית Meta, כך שמשתמשים ראו רק את התוצר בתוך המלוטש הסופי בזמן שוחרר ל-Stable. עם Canaries אנחנו בונים בפומבי בעזרת הקהילה בסדר כדי לסגור את האפשרות להשתלבות פוסטי React Labs. זה אומר שאתה שומעים על יכול להיות חדשות יותר, בזמן שהן נסגרות ולא רק אחרי שהכול הושלם.

React רכיבי שרת, טעינת נכסים, מטא נתונים של מסמכים ו-Actions כבר נכנסו ל-React Canary, והוספנו תיעוד ליכולות האלה ב-react.dev:

- ** הנחיות**: [`"use client"`](/reference/react/use-client) ו-[`<script>`](/reference/react/use-server) יכולות לצרור שמיועדות ל-full-stack React frameworks. הן מסמנות את "נקודות הפיצול" בין שתי הסביבות: `"use client"` מנחה את הבאנדלר מניעה תגית `<script>` (בדומה ל-[איי אסטרו](https://docs.astro.build/en/concepts/islands/#creating-an-island)), ו-`"use server"` ו-`"use server"` אומר לבאנדלר שלב קצה חוזר של POST (דומה ל-__6)(https://docs.astro.build/en/concepts/islands/#creating-an-island)), ו-`"use server"` ו-`"use server"` אומר לבאנדלר שלב קצה חוזר של POST (דומה ל__6) המתאימה לשרת.

- **Document Metadata**: הוספנו תמיכה מובנית ברינדור תגיות [https://github.com/nfl/react-helmet)](/reference/react-dom/components/title), [React](/reference/react-dom/components/meta), ו-[__TK_2__](/reference/react-dom/component) של met. הן עובדות אותו בכל הסביבה, כולל קוד לקוח מלא, SSR ו-RSC. כך מתקבלת תמיכה מובנית ביכולות ספריות כמו [React Helmet](https://github.com/nfl/react-helmet) הובילו בעבר.

- **טעינת נכסים**: שילבנו Suspense במחזור החיים של טעינת משאבים כמו גיליונות סגנונות, פונטים וסקריפים כך ש-React לוקח אותם בחשבון כדי לקבוע אם תוכן ברכיבים כמו [`preload`](/reference/react-dom/components/style), [`preinit`/react], [`preinit`](-dom/link), ו-[Suspense](/reference/react-dom/components/script) מוכן להצגה. הוספנו גם [Resource Loading APIs](/reference/react-dom#resource-preloading-apis) חדשים כמו `preload` ו-`preinit` כדי לאפשר שליטה טובה יותר מתי משאב צריך להיטען ולעבור את חול.

- ** פעולות**: כפי ששיתפנו למעלה, הוספנו פעולות לניהול שליחת נתונים מהלקוח לשרת. אפשר להוסיף `action` לאלמנטים כמו [useOptimistic](/reference/react-dom/components/form), לגשת לסטטוס עם [use](/reference/react-dom/hooks/useFormStatus),להגיע עם [use](/reference/react-dom/hooks) אופטימי עם [__TK_4__](/reference/react/useOptimistic).

כל היכולות האלה עובדות יחד, קשה לשחרר את בנפרד בערוץ יציב. שחרור פעולות בלי ה-hooks המשלים לגישה למצב טויפס היה מגביל את הפעלת המעשי ב-Actions. הכנסת React רכיבי שרת בלי אינטגרציה של פעולות שרת הייתה מסבכת עדכוני נתונים בשרת.

לפני שאפשר לשחרר, לוודא שהן עובדות יחד בצורה קוהרנטית ושיש מפתחים את כל מה שצריך כדי להשתמש בפרודקשן. React Canaries מאפשרים לנו לפתח את היכולות האלה בנפרד ולשחרר APIs יציבים בהדרגה עד שכל סט היכולות שלם.

סט היכולות הנוכחי ב-React Canary שלם ומוכן לשחרור.

## גרסת ה-major הבאה של React {/*the-next-major-version-of-react*/}

אחרי כמה שנים של איטרציה, `react@canary` עכשיו להישלח ל-`react@latest`. היכולות החדשות שצוינו למעלה תואמות לכל הסביבה שבה האפליקציה שלכם רצה ומספקת את כל מה שנדרש לשימוש בפרודקשן. היכן ש-טעינת נכסים ו-Document Metadata יתבצע שינוי שובר עבור חלק מהאפליקציות, הגרסה הבאה של React תהיה גרסה עיקרית: **React 19**.

עדיין נשארה לעבודה לקראת השחרור. ב-React 19 אנחנו מציעים גם שיפורים מבוקשים שדורשים שינויים, כמו תמיכה ב-Web Components. הפוקוס שלנו עכשיו הוא להכניס את השינויים האלה, להכין את השחרור, לסיים את התיעוד ליכולות החדשות ולפרסם הכרזות על כל מה שנכלל.

נשתף בימים הקרובים עוד מידע על מה ש-React 19 כולל, איך לאמץ את יכולה לרכוש את החדשות, ואיך לבנות כל תמיכה ב-React רכיבי שרת.

## מחוץ למסך (שמו שונה ל-Activity) {/*offscreen-renamed-to-activity*/}

מאז העדכון הקודם שינינו שם ליכולת שלנו מחקר מ-"Offscreen" ל-"Activity". השם "מחוץ למסך" רמז שזה חל רק על חלקים באפליקציה שלא נראים, אבל תוך כדי מחקר הבניינים להיות חלקים גלויים אך לא פעילים, כמו התוכן נמצא מאחורי מודל. החדש השם ף טוב יותר את התנהגות סימון חלקים המשק באפליקציה כ-"פעיל" או "לא פעיל".

פעילות במחקר, והעבודה שנותרה היא לסגור סופית את הנחשפים הפרימיטיביים למפתחי ספריות. הורדנו עדיפות זמניים לאזור זה בזמן שאנחנו עובדים בשחרור יכולים בשלות יותר.

* * *

בנוסף לעדכון הזה, הצוות שלנו הרצה בכנסים והתארח בפודקאסטים כדי לדבר יותר על העבודה שלנו ולענות על שאלות.

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) דיבר על React מהדר בכנס [React הודו](https://www.youtube.com/watch?v=kjOacmVsLSE)

- [Dan Abramov](/community/team#dan-abramov) נתן הרצאה ב-[RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) בשם "React from Another Dimension" שחוקרת היסטוריה חלופית של יצירת React רכיבי שרת ו-פעולות

- [דן אברמוב](/community/team#dan-abramov) התראיין ב-[פודקוסט JS Party של Changelog](https://changelog.com/jsparty/311) על React רכיבי שרת

- [Matt Carroll](/community/team#matt-carroll) התראיין ב-[פודקסט Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) ושם דיבר על [The Two Reacts](https://overreacted.io/the-two-reacts/)

תודה ל-[לורן טאן](https://twitter.com/potetotes), [סופי אלפרט](https://twitter.com/sophiebits), [ג'ייסון בונטה](https://threads.net/someextent), [אלי ווייט](https://twitter.com/Eli_White), ו[סאתיה גונאסקרן](https://twitter.com/_gsathya) על סקירת הפוסט הזה.

תודה שקראתם, ו-[נתראה ב-React Conf](https://conf.react.dev/)!
