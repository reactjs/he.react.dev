---
id: thinking-in-react
title: חשיבה ב-React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> The updated [Thinking in React](https://react.dev/learn/thinking-in-react) guide teaches modern React and includes live examples.

</div>

React, לפי דעתנו, היא ספריית הג'וואה-סקריפט המובילה בבניית יישומי אינטרנט. הספרייה הוכיחה את עצמה אצלנו בפייסבוק ובאינסטגרם.

אחד מהיתרונות הבולטים של React  הוא איך הוא גורם לך לחשוב על היישומים בזמן שאתה בונה אותם. במדריך זה, נלווה אותך בתהליך החשיבה של בניית טבלת נותני מוצרים באמצעות React.

## נתחיל עם דוגמא{#start-with-a-mock}

נניח שיש לנו ממשק JSON שנראה ככה:

![Mockup](../images/blog/thinking-in-react-mock.png)

הממשק מחזיר מידע בפורמט JSON שנראה ככה:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## השלב הראשון: פיצול ממשק המשתמש להיררכיית קומפוננטות {#step-1-break-the-ui-into-a-component-hierarchy}

הדבר הראשון שנעשה הוא להקיף כל קומפוננטה(ותת קומפוננטה) בקופסה, ולתת לכל אחת שם. אם אתם עובדים עם מעצב/ת , יכול להיות שהוא/היא כבר עשו את זה.

אבל איך יודעים מה צריך להיות קומפוננטה משלו? משתמשים באותה טכניקה שבה מחליטים אם ליצור מתודה או עצם.
אחת השיטות היא [עיקרון האחריות הבודדת](https://en.wikipedia.org/wiki/Single_responsibility_principle), שאומר, שאופן אידיאלי כל קומפוננטה אמורה לעשות דבר אחד בלבד. אם הקומפוננטה גדלה, נצטרך לפצל אותה לתת-קומפוננטות.

משום שלעיתים תכופות נצטרך להציג מידע בפורמט JSON למשתמש, נראה שאם המודל נבנה כראוי, ממשק המשתמש שלנו( וגם מבנה הקומפוננטות ) ימופה באופן מסודר. זה קורה מכיוון שממשק המשתמש ומודלי המידע נוטים לדבוק באותה *ארכיטקטורת מידע*. פצל את ממשק המשתמש שלך לקומפוננטות, שכל אחת מהן מתאימה לחלק אחד של מודל המידע שלך.

![תרשים המראה nesting של קומפוננטות](../images/blog/thinking-in-react-components.png)

נראה כאן שיש לנו חמש קומפוננטות ביישום שלנו. המידע שכל קומפוננטה מייצגת הוא בפונט italic

  1. **`FilterableProductTable` (כתום):** מכיל את כל תכולת הדוגמה
  2. **`SearchBar` (כחול):** *קלט המשתמש*
  3. **`ProductTable` (ירוק):** מציג ומסנן את *המידע* על סמך *קלט המשתמש*
  4. **`ProductCategoryRow` (טורקיז):** מציג כותרת לכל *קטגוריה*
  5. **`ProductRow` (אדום):** מציג שורה לכל *מוצר*

אם נסתכל על ProductTable, נראה שכותרת הטבלה( שמכילה את כותרות השם והמחיר ) היא לא קומפוננטה משלה. אפשר להפוך אותה לקומפוננטה משלה ואפשר גם שלא, זה עניין של בחירה.
בדוגמה זאת, השארנו אותו חלק מProductTable  בגלל שזה חלק מרינדור *המידע*, שהוא עבודת הקומפוננטה ProductTable.
לעומת זאת, אם הכותרת גדלה ונהיית מסובכת( לדוגמה אם היינו מוסיפים חיפוש ), זה בהחלט יעלה צורך לפצל אותה לקומפוננטה משלה( ProductTableHeader ).
עכשיו לאחר שזיהינו את הקומפוננטות בדוגמה שלנו, נסדר אותם בהיררכיה. קומפוננטות שנמצאות בתוך קומפוננטות אחרות צריכות להופיע מתחתיהן בהיררכיה:

## Step 2: בניית גרסה סטטית בReact {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a> on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

עכשיו שיש לנו את היררכיית הקומפוננטות שלנו, זה הזמן ליישם את היישום. הדרך הקלה ביותר היא לבנות גרסה שלוקחת את מודל המידע ומרנדרת את ממשק המשתמש, אבל אין לה אינטראקטיביות. מומלץ לפצל תהליכים אלו בגלל שבניית גרסה סטטית דורשת הרבה הקלדה ומינימום חשיבה, והוספת אינטראקטיביות דורשת הרבה חשיבה ומינימום הקלדה. נראה למה.

על מנת לבנות גרסה סטטית של היישום שמרנדרת את מודל המידע, נרצה לבנות קומפוננטות שמשתמשות בקומפוננטות אחרות ומעבירות מידע באמצעות props**.*props* הם דרך העברת מידע מ'הורה' ל'ילד'. אם אתם מכירים את הקונספט של  *state*, **אל תשתמשו בstate  בכלל** על מנת לבנות את הגרסה הסטטית. state  שמור רק לאינטראקטיביות, שזה מידע שמשתנה לאורך זמן. מכיוון שזאתי גרסה סטטית של היישום, לא נצטרך state.

נוכל לבנות מלמעלה למטה או מלמטה למעלה. שזה אומר שנוכל להתחיל לבנות את הקומפוננטות מלמעלה בהירככיה( נתחיל מFilterableProductTable ) או מהקומפוננטות התחתונות בהיררכיה( ProductRow  ). בדוגמות פשוטות יותר, זה קל יותר להתחיל מלמעלה למטה, ובפרויקטים גדולים, זה קל יותר להתחיל מלמטה למעלה ולכתוב tests במקביל לבנייה.

בסוף השלב הזה, יהיה לנו ספרייה של קומפוננטות שמישות שמרנדרות את מודל המידע. הקומפוננטות יכילו רק מתודות render()  מכיון שזוהי גרסה סטטית של היישום. הקומפוננטה בראש ההיררכיה(FilterableProductTable) תיקח  את מודל המידע כprop  שיועבר לה. אם נבצע שינוי למודל המידע ונקרא ל ReactDOM.render() שוב, ממשק המשתמש יעודכן. זה פשוט לראות איך ממשק המשתמש מעודכן והיכן לבצע שינויים מכיוון ששום דבר מסובך לא מתבצע. **העברת המידע בכיוון אחד** של React משאירה הכל בצורה מודולרית ומהירה.

קרא עוד ב[תיעוד של ריאקט](/docs/getting-started.html) אם תצטרך עזרה בביצוע שלב זה.

### הפוגה קצרה:  props ו- state {#a-brief-interlude-props-vs-state}

יש שני סוגים של 'מודלי' מידע בReact : props וstate. זה חשוב להבין את ההבדלים בין השניים. קרא עוד  [בתיעוד של ריאקט](/docs/state-and-lifecycle.html) אם אתה לא בטוח מה ההבדל. ראה גם [שאלות נפוצות: מה ההבדל בין state ו-props?]( /docs/faq-state.html#what-is-the-difference-between-state-and-props)

## שלב שלישי: זיהוי הייצוג המינימלי( אך מלא ) של הstate  של ממשק המשתמש {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

על מנת שממשק המשתמש יהיה אינטראקטיבי, נצטרך שיהיה לנו את היכולת לשנות את מודל המידע שלנו. React עושה זאת עם **state**.

כדי לבנות את היישום בצורה נכונה, צריך לחשוב תחילה על הכמות המינימלית של state שהיישום דורש. המפתח פה הוא [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) שאומר 'אל תמחזר קוד'. נחשוב על הכמות המינימלית ביותר של state שהיישום צריך ונחשב כל דבר אחר שהיישום צריך לפי דרישה. לדוגמה, אם אנו בונים יישום של רשימת מטלות, יהיה לנו מערך של מטלות; לא נשאיר משתנה בstate בשביל הכמות מטלות. במקום זה, כשנרצה לרנדר את מספר המטלות, פשוט ניקח את אורך המערך ונציג אותו.

נראה את פיסות המידע ביישום שלנו, יש לנו את:

  * הרשימה המקורית של המוצרים
  * מילות החיפוש שהמשתמש הקליד
  * ערך תיבת הסימון
  * הרשימה המסוננת של המוצרים

נעבור על כל אחד ונחשוב איזה פיסת מידע היא הstate. נעשה זאת באמצעות שאילת 3 שאלות על כל פיסת מידע:

  1.	האם המידע עובר מהורה באמצעות props? אם כן, זה לא state.
  2.	האם זה נשאר קבוע לאורך זמן? אם כן, זה לא state.
  3.	האם אפשר לחשב את זה לפי state אחר או props בקומפוננטה שלנו? אם כן, זה לא state.

הרשימה המקורית עוברת באמצעות props, אז היא לא הstate. טקסט החיפוש ותיבת הסימון נראים כמתאימים להיות state מכיוון שהם משתנים לאורך זמן ולא מושפעים ממשהו. ולבסוף, הרשימה המסוננת של המוצרים היא לא הstate  מכיוון שהיא מושפעת מהרשימה המקורית של המוצרים, טקסט החיפוש וערך תיבת הסימון( מסומן או לא).

אז הגענו למסקנה שהstate  שלנו הוא:

  * טקסט החיפוש שהמשתמש הקליד
  * ערך תיבת הסימון

## שלב רביעי: זיהוי המיקום המתאים לstate {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> on <a href="https://codepen.io">CodePen</a>.</p>

זיהינו מה המרכיבים המינימליים של הstate של היישום שלנו. עכשיו אנחנו צריכים לזהות איזה קומפוננטה משנה, או לוקחת *בעלות* על הstate.

זכרו:  בReact הכל סובב סביב העברת מידע למטה בהיררכיית הקומפוננטות. זה לפעמים לא ברור מיד איזה קומפוננטה הכי מתאימה לאחסן בתוכה state. **זה לעיתים קרובות החלק הכי מאתגר למתחילים ב**React, לכן נעבור על השלבים הבאים על מנת להבין:

לכל פיסת state ביישום:

  * נזהה כל קומפוננטה שמרנדרת משהו מהstate.
  * נמצא אם יש קומפוננטה אחרת למעלה בהיררכיה או קומפוננטה דומה שמתאימה לאחסן את הstate.
  * אם לא נמצא קומפוננטה שמתאימה לאחסן את הstate, ניצור אחת חדשה שכל מטרתה היא לאחסן את הstate ונכניס אותה איפשהו בהיררכיה מעל קומפוננטה אחרת שמשתמשת בstate.

נשתמש בשלבים אלה ביישום:

  * ProductTable צריכה לסנן את רשימת המוצרים לפי הstate וSearchBar צריך להציג את טקסט החיפוש ותיבת הסימון.
  * הקומפוננטה השנייה שעושה שימוש בstate היא FilterableProductTable.
  * באופן עקרוני זה הגיוני שהטקסט המסונן והערך המסומן 'יחיו' בתוך FilterableProductTable.

אז החלטנו שהstate 'חי' בתוך FilterableProductTable. ראשית, נוסיף אובייקט this.state = {filterText: '', inStockOnly: false} לFilterableProductTable קונסטרקטור שלו על מנת לשקף את הstate  הראשוני של היישום. 
אחרי זה, נעביר את filterText  וinStockOnly לProductTable ו SearchBar כprop.
לבסוף, נשתמש בprops האלה על מנת לסנן את השורות בProductTable ולהגדיר את הערכים של השדות בטופס בSearchBar.


אפשר כבר להתחיל לראות איך היישום שלנו יתנהג: נגדיר את filterText ל''כדור'' ונרענן את היישום. נראה שטבלת המידע מתעדכנת עם הערך הנכון.

## שלב חמישי: הוספת זרימת מידע הפוכה {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> on <a href="https://codepen.io">CodePen</a>.</p>

עד כה, בנינו יישום שמרנדר כפונקציה של props וstate  למטה בהיררכיה. עכשיו זה הזמן להוסיף אמצעי לזרימה הפוכה של מידע: קומפוננטות הטופס עמוק בהירככיה צריכות לעדכן את הstate בFilterableProductTable.

React הופך את זרימת המידע למפורשת על מנת לעזור לך להבין איך היישום שלנו עובד, אבל זה דורש טיפה יותר שורות קוד מאשר binding דו כיווני של נתונים.

אם ננסה לכתוב או לסמן את הקופסה בגרסה הקודמת של הדוגמא שלנו (שלב 4), נראה שReact מתעלם מהקלט שלנו. זה נעשה בכוונה, מכיוון שאנחנו הגדרנו את ערך הprop של הקלט להיות תמיד שווה לstate שמועבר מFilterableProductTable.

נחשוב לרגע על מה אנחנו רוצים שיקרה. אנחנו רוצים להיות בטוחים שכשהמשתמש משנה את הטופס, אנחנו מעדכנים את הstate שישקף את קלט המשתמש. מכיוון שרצוי שקומפוננטות יעדכנו את הstate שלהן בלבד, FilterableProductTable יעביר callbacks לSearchBar שיופעלו כשהstate יתעדכן. אנחנו יכולים להשתמש בonChange event על הקלטים. הcallbacks שעוברים דרך FilterableProductTable יקראו למתודת  setState(), והיישום יתעדכן.

אפילו שזה נשמע מסובך, זה בסך הכל מספר מצומצם של שורות קוד. והיתרון הוא שזה מציג באופן מפורש איך המידע מועבר ביישום.

## וזהו! {#and-thats-it}

הכוונה של המדריך הזה היא לתת לכם רעיון על איך לחשוב על בניית קומפוננטות ויישומים עם React. אמנם זה יכול לצרוך יותר כתיבה ממה שאתם רגילים, אבל זכרו שקוד נקרא יותר מאשר הוא נכתב, וזה נוח מאוד לקרוא את הקוד המפורש והמודולרי שכתבנו. כשתתחילו לבנות ספריות גדולות של קומפוננטות, אתם תעריכו את הפשטות והמודולריות, ועם שימוש חוזר בקוד שאתם רושמים, שורות הקוד שלכם יתחילו להתכווץ. 😊
