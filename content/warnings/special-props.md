---
title: אזהרה על props מיוחדים
layout: single
permalink: warnings/special-props.html
---

רוב ה-props ב-JSX אלמנט מועברים לקומפוננטה, למרות זאת, יש שני props מיוחדים (`ref` ו- `key`) אשר משמשים את React, ולכן הם לא מועברים לקומפוננטה.

לדוגמא, לנסות לגשת ל-`this.props.key` מהקומפוננטה (כלומר פונקציית render או [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) אינו מוגדר. אם אתה צריך לגשת לאותו ערך בתוך הקומפוננטת ילד, אתה צריך להעביר אותו כ-prop אחר (לדגומא: `<ListItemWrapper key={result.id} id={result.id} />`).  למרות זה נראה מיותר, זה חשוב להפריד את הלוגיקה של האפליקציה מרמזי reconciling.
