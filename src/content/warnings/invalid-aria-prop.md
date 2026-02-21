---
title: "אזהרת Invalid ARIA Prop"
---

האזהרה הזו תופיע אם תנסו לרנדר אלמנט DOM עם `aria-*` prop שלא קיים במפרט Accessible Rich Internet Application (ARIA) של Web Accessibility Initiative (WAI), כפי שמוגדר ב-[מפרט](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. אם נראה לכם משתמשים ב-prop תקין, בדקו היטב את האיות. לעתים קרובות יש שגיאות כתיב ב-`aria-labelledby` וב-`aria-activedescendant`.

2. אם כתבתם `aria-role`, ייתכן שהתכוונתם ל-`role`.

3. אחרת, אם אתם בגרסה העדכנית של React DOM ואישרתם המשתמשים בשם מאפיין חוקי שמופיע במפרט ARIA, אנא [דיווח על באג](https://github.com/facebook/react/issues/new/choose).
