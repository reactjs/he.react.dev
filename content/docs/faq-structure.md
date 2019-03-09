---
id: faq-structure
title: File Structure
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### האם ישנה דרך מומלצת לבנות פרויקטי React? {#is-there-a-recommended-way-to-structure-react-projects}

ל- React אין דעה לדרך שבה אתה מסדר קבצים בתיקיות. עם זאת ישנם כמה דרכים נפוצות שאולי תרצה לקחת בחשבון.

#### קיבוץ לפי תכונות או routes {#grouping-by-features-or-routes}

דרך נפוצה אחת בבניית פרויקטים היא לקבץ קבצי CSS, JS ובדיקות ביחד בתוך תיקיות לפי תכונות או routes.

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

ההגדרה של תכונה היא לא אוניברסלית, וזה תלוי בך לבחור את המשמעות. אם אתה לא יכול לחשוב על רשימה של תיקיות top-level, אתה יכול לשאול את משתמשי המוצר שלך מה לדעתם החלקים החשובים ביותר במוצר, ולהשתמש בתשובה שלהם כתבנית לפרויקט.

#### קיבוץ לפי סוג קובץ {#grouping-by-file-type}

דרך פופולרית נוספת לבנית פרויקטים היא קיבוץ קבצים מסוג דומה יחדיו, לדוגמה: 

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

ישנם אנשים שמעדיפים ללכת רחוק יותר, ולהפריד קומפוננטות לתוך תיקיות על פי התפקיד שלהן ביישום. לדוגמה, [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) היא מתודולוגיית עיצוב שנבנתה על עיקרון זה. זכור שזה לעיתים יותר פרודוקטיבי לנהוג במתודולוגיות כאלה כדוגמות שיכולות לעזור מאשר כחוקים שצריך לציית להם.

#### הימנע מיותר מדי nesting {#avoid-too-much-nesting}

ישנם כמה בעיות שקשורות עם nesting עמוק בפרויקטי JavaScript. זה נהיה קשה לכתוב relative imports ביניהם, או לעדכן את ה imports הללו כשהקבצים זזים. אלא אם יש לך סיבה מוצדקת להשתמש במבנה תיקיות עמוק, עדיף שיהיה עומק של מקסימום שלוש או ארבע תיקיות בפרויקט אחד. עם זאת, זוהי רק המלצה, ויכול להיות שהיא לא רלוונטית לפרויקט שלך.

#### אין צורך להשקיע מחשבה רבה בנושא {#dont-overthink-it}

אם אתה רק מתחיל פרויקט, [אל תבזבז יותר מחמש דקות](https://en.wikipedia.org/wiki/Analysis_paralysis) אם אתה רק מתחיל פרויקט, אל תבזבז יותר מחמש דקות על בחירת מבנה הפרויקט. בחר אחת מהגישות שלמעלה(או שתחשוב על אחת משלך) ותתחיל לכתוב קוד! אתה כנראה תרצה לחשוב על זה מחדש אחרי שתכתוב קוד אמיתי.

אם אתה מרגיש תקוע לגמרי, תתחיל בלהשאיר את כל הקבצים בתיקייה אחת. בסופו של דבר היא תגדל מספיק עד שתרגיש את הצורך להפריד כמה קבצים מהתיקייה. בעת ההיא יהיה לך מספיק ידע על אילו קבצים אתה עורך בתדירות הכי גבוהה. באופן כללי, זה רעיון טוב להשאיר קבצים שמשתנים בתדירות גבוהה קרובים אחד לשני. עיקרון זה נקרא ''קולוקציה''.

כשפרויקטים גדלים, רוב הזמן הם משלבים את שתי הגישות שהראנו מקודם. מכאן נובע שבחירת הגישה ה''נכונה'' בתחילת הפרויקט היא לא חשובה. 