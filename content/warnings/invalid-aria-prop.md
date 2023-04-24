---
title: אזהרה על ARIA Prop לא חוקי
layout: single
permalink: warnings/invalid-aria-prop.html
---

האזהרה על aria-prop לא חוקי תופיע אם אתה מנסה לרנדר DOM אלמנט עם aria-* prop שאינו קיים במפרט  Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA).

1. אם אתה מרגיש שאתה משתמש ב-prop חוקי, בדוק את האיות בקפידה. `aria-labelledby` ו-`aria-activedescendant` לעיתים קרובות מאוייתות באופן שגוי.

2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
