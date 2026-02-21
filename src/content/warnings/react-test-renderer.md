---
title: "אזהרת הוצאה שימוש של react-test-renderer"
---

`react-test-renderer` הוצאה משימוש. אזהרה תופי בכל קריאה ל-`ReactTestRenderer.create()` או `ReactShallowRender.render()`. החבילה `react-test-renderer` תישאר זמינה ב-NPM, אבל לא תתוחזק ועלולה להישבר עם פיצ'רים חדשים של React או עם שינויים פנימיים של React.

צוות React ממליץ להעביר את הבדיקות ל-[`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/) או ל-[`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/docs/getting-started) עבור חוויית בדיקות מודרנית ונתמכת היטב.
