---
title: התקנת עורך קוד
---

<Intro>

עורך קוד שמקונפג כראוי עוזר לקרוא ולכתוב קוד בקלות ובמהירות. בנוסף הוא יכול לעזור לנו לתפוס באגים בזמן שאנחנו כותבים אותם! אם זאת הפעם הראשונה שאתה מתקין עורך קוד או שאתה מחפש לשפר את שלך, יש לנו כמה המלצות.
  
</Intro>

<YouWillLearn>

* אילו עורכי קוד הם הכי פופולריים
* איך לסדר את הקוד שלך אוטומטית

</YouWillLearn>

## העורך שלך {/*your-editor*/}

אחד מעורכי הקוד הפופולריים ביותר (אם לא הכי) הוא [VS Code](https://code.visualstudio.com/). יש לו תוספים רבים שניתן להתקין והוא מתממשק טוב עם שירותים כמו גיטהאב. ניתן להוסיף את רוב הפיצ׳רים הכתובים כאן בהמשך ל-VS Code כתוספים. 

עורכי קוד נוספים שמשתמשים בהם בקהילת ריאקט כוללים:

* וובסטורם - [WebStorm](https://www.jetbrains.com/webstorm/) הוא סביבת פיתוח שעוצבה במיוחד לפיתוח בעזרת JavaScript.
* סאבליים טקסט - [Sublime Text](https://www.sublimetext.com/) תומך ב-syntax highlighting של JSX ו-TypeScript.
* וים - [Vim](https://www.vim.org/) הוא עורך קוד גמיש מאוד שנבנה על מנת לאפשר פיתוח מהיר. הוא כלול ברוב מערכות ההפעלה מבוססות Unix וב-MacOS.  

## פיצ׳רים מומלצים בעורכי קוד {/*recommended-text-editor-features*/}

חלק מעורכי הקוד מגיעים עם פיצ׳רים אלה ישר מהקופסה, אבל אחרים דורשים את הוספתם באמצעות תוסף. בדוק מה מובנה בעורך הקוד שלך ליתר ביטחון.

### Linting {/*linting*/}

לינטרים מוצאים בעיות בקוד שלך בזמן שאתה כותב אותו, מה שמאפשר תיקון מוקדם. לינטר פופולרי ומומלץ הוא [ESLint](https://eslint.org/). 

* [התקן ESLint עם האופציות המומלצות לריאקט](https://www.npmjs.com/package/eslint-config-react-app) (וודא שיש לך [Node מותקן!](https://nodejs.org/en/download/current/))
* [Integrate ESLint in VSCode with the official extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Formatting {/*formatting*/}

הדרך האחרון שאתה רוצה כשאתה משתף קוד עם מפתח אחר הוא להיכנס לוויכוח [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces). למזלנו, [prettier](https://prettier.io/)) ינקה את הקוד שלך על ידי התאמתו לחוקים קיימים. בעת הרצת prettier, כל ה-tabs יהפכו ל-spaces, וגרשיים כפולים או יחידים ישונו בהתאם לקונפיגורציה. בסביבת פיתוח אידיאלית, Prettier ירוץ בעת שמירת קובץ, ויעשה את כל השינויים הללו אוטומטית.

ניתן להתקין את Prettier ב[VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) בעזרת הצעדים הבאים:

1. פתח את VS Code
2. הרץ את Quick Open (בעזרת Ctrl/Cmd+p)
3. הדבק בפנים את `ext install esbenp.prettier-vscode` 
4. לחץ Enter

#### Formatting on save {/*formatting-on-save*/}

באופן אידיאלי, כדאי לאפשר לתוסף לסדר את הקוד בכל שמירת קובץ. מזל ש-VS Code מאפשר לנו את זה!

1. ב-VS Code, לחץ `CTRL/CMD + SHIFT + P`. 
2. כתוב "settings"
3. לחץ Enter
4. בשורת החיפוש, כתוב "format on save"
5. וודא כי האופצייה "format on save" מסומנת

> אם קונפיג הESLint שלך מכיל חוקים שקשורים לסידור קוד, הם עלולים להתנגש עם Prettier. אנחנו ממליצים לכבות את חוקים אלו בקונפיג הESLint שלך באמצעות [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier), ככה שESLint עובד רק על מנת לתפוס שגיאות לוגיות. אם אתה רוצה להחיל סידור קוד לפני מירג׳וג׳ PR, השתמש ב-[`prettier --check`](https://prettier.io/docs/en/cli.html#--check) ב-CI שלך.
