---
title: אזהרה על ARIA Prop לא חוקי
layout: single
permalink: warnings/invalid-aria-prop.html
---

האזהרה על aria-prop לא חוקי תופיע אם אתה מנסה לרנדר DOM אלמנט עם aria-* prop שאינו קיים במפרט  Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. אם אתה מרגיש שאתה משתמש ב-prop חוקי, בדוק את האיות בקפידה. `aria-labelledby` ו-`aria-activedescendant` לעיתים קרובות מאוייתות באופן שגוי.

<<<<<<< HEAD
2. React עדיין לא מזהה את התכונה שציינת. זה כנראה יתוקן בגרסא עתידית של React. למרות זאת, React כרגע מסיר את כל התכונות הלא ידועות, אז לציין אותם באפליקציית ה-React שלך תגרום להם לא להתרנדר.
=======
2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
