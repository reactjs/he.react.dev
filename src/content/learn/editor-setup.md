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

## העורך שלך {/*העורך-שלך*/}

אחד מעורכי הקוד הפופולריים (אם לא הכי) הוא [קוד VS](https://code.visualstudio.com/). יש לו תוספים רבים להתקין והוא מתממשק טוב עם שירותים כמו גיטהאב. ניתן להוסיף את רוב הפיצ'רים הכתובים כאן בהמשך ל-VS Code כתוספים.

עורכי קוד נוספים שמשתמשים בהם בקהילת ריאקט כוללים:

* וובסטורם - [WebStorm](https://www.jetbrains.com/webstorm/) הוא סביבת פיתוח שעוצבה במיוחד לפיתוח בעזרת JavaScript.
* סאבליים טקסט - [טקסט נשגב](https://www.sublimetext.com/) תומך ב-syntax highlighting של JSX ו-TypeScript.
* וים - [Vim](https://www.vim.org/) הוא עורך קוד גמיש מאוד שנבנה על מנת לאפשר פיתוח מהיר. הוא כולל מערכות מבוססות Unix וב-MacOS.

## פיצ'רים מומלצים בעורכי קוד {/*תכונות-עורך-טקסט-מומלץ*/}

חלק מעורכי הקוד מגיעים עם היכולות האלה כבר מהקופסה, אבל אחרים דורשים להוסיף אותן דרך תוסף. מומלץ לבדוק מה כבר מובנה בעורך הקוד שלכם.

### מוך {/*מוך*/}

לינטרים מוצאים בעיות בקוד שלך בזמן שאתה כותב אותו מוקדם, מה שמאפשר תיקון. לינטר פופולרי ומומלץ הוא [ESLint](https://eslint.org/).

* [התקן ESLint עם האופציות המומלצות לריאקט](https://www.npmjs.com/package/eslint-config-react-app) (וודא שיש לך [צומת מותקן!](https://nodejs.org/en/download/current/))
* [שלבו את ESLint ב-VS Code עם התוסף הרשמי](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**ודאו הפעלתם הכללים של [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) בפרויקט שלכם.** הכללים האלה חיוניים ותופסים באגים חמורים קודם. המומלץ המוגדר מראש [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) כבר כולל אותם.

### עיצוב {/*עיצוב*/}

האחרון האחרון שאתה מפתח עם אחר הוא רוצה להיכנס לוויכוח [טאבים לעומת רווחים](https://www.google.com/search?q=tabs+vs+spaces). למדברנו, [יפה יותר](https://prettier.io/) יסדר את הקוד האוטומטי לפי שמירה על עקביות. בעת הרצת Prettier, טאבים יומרו לרווחים, וסגנון המירכאות יותאם לקונפיגורציה.

ניתן להתקין את Prettier ב[VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) בעזרת הצעדים הבאים:

1. פתח את הקוד VS
2. הרץ את פתיחה מהירה (בעזרת Ctrl/Cmd+p)
3. הדבק בפנים את `ext install esbenp.prettier-vscode` 
4. לחץ על Enter

#### עיצוב בשמירה {/*פורמט-ב-שמירה*/}

באופן אידיאלי, כדאי לאפשר לתוסף לסדר את הקוד בכל שמירת קובץ. מזל ש-VS Code מאפשר לנו את זה!

1. ב-VS Code, לחץ על `CTRL/CMD + SHIFT + P`.
2. כתוב "הגדרות"
3. לחץ על Enter
4. בשורת החיפוש, כתוב "פורמט בשמירה"
5. וודא כי האופצייה "פורמט בשמירה" מסומנת

> אם קונפיגורצית ESLint כולל כללים לעיצוב קוד, היא עלולה להתנגש עם Prettier. אנחנו ממליצים לכבות את הכללים האלה באמצעות [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier), כך ש-ESLint יפעל בזיהוי שגיאות לוגיות. אם אתם רוצים לאכוף עיצוב קוד לפני מיזוג Pull Request, השתמשו ב-[`prettier --check`](https://prettier.io/docs/en/cli.html#--check) בתוך CI.
