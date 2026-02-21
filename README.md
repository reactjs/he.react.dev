# react.dev

מאגר זה מכיל את קוד המקור והתיעוד שמפעילים את [react.dev](https://react.dev/).

## התחלה מהירה

### דרישות מקדימות

1. Git
2. Node: כל גרסה מסדרת 12.x החל מ-`v12.0.0` ומעלה
3. Yarn: הוראות התקנה באתר של Yarn
4. Fork לריפו (אם מתכוונים לתרום)
5. Clone מקומי של מאגר `react.dev`

### התקנה

1. היכנסו לשורש הפרויקט:
   - `cd react.dev`
2. התקינו תלויות:
   - `yarn`

### הרצה מקומית

1. הפעלת שרת פיתוח (Next.js):
   - `yarn dev`
2. פתיחה בדפדפן:
   - `http://localhost:3000`

## תרומה

### קווים מנחים

התיעוד מחולק למספר אזורים עם טון ומטרה שונים. אם אתם כותבים יותר מכמה משפטים, מומלץ לעבור על [הנחיות התרומה](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) של האזור המתאים.

### יצירת ענף עבודה

1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b the-name-of-my-branch`

### ביצוע השינוי

1. עבדו לפי הוראות ההרצה המקומית
2. שמרו קבצים ובדקו בדפדפן
3. Hot reload:
   - שינויים בקומפוננטות React תחת `src`
   - שינויים בקבצי Markdown תחת `src/content`
4. אם עובדים עם plugins, ייתכן שתצטרכו למחוק `.cache` ולהפעיל מחדש את השרת

### בדיקות

1. מומלץ לבדוק שינויים ויזואליים בדפדפנים נפוצים (דסקטופ ומובייל)
2. הריצו:
   - `yarn check-all`

### העלאה ל-GitHub

1. `git add -A && git commit -m "My message"`
2. `git push my-fork-name the-name-of-my-branch`
3. היכנסו ל-repo ב-GitHub והמשיכו לפי ההוראות לפתיחת PR
4. מומלץ לצרף צילומי מסך לשינויים ויזואליים

## תרגום

אם אתם מעוניינים לתרגם את `react.dev`, אפשר לראות את מאמצי התרגום הפעילים כאן:
https://github.com/reactjs/react.dev/issues/4135

## רישיון

תוכן שנשלח ל-`react.dev` מופץ תחת CC-BY-4.0 כפי שמוגדר ב-`LICENSE-DOCS.md`.
