---
title: "אזהרת לא ידוע פרופס"
---

האזהרה unknown-prop תופיע אם תנסו לרנדר אלמנט DOM עם prop ש-React לא מזהה כ-DOM attribute/property חוקי. חשוב לשמור על האלמנטים שלכם ב-props מיותרים שמועברים בטעות.

יש כמה סיבות נפוצות לאזהרה הזו:

1. האם אתם משתמשים ב-`{...props}` או `cloneElement(element, props)`? כשמעתיקים props לקומפוננטת ילד, צריך לוודא שלא מעבירים בטעות props שנועדו רק לקומפוננטת הורה. מופיעים תיקונים נפוצים לבעיה הזו.

2. אתם משתמשים ב-DOM תכונה לא סטנדרטי על DOM no רגיל, אולי כדי להציג נתונים מותאמים אישית. אם צריך להצמיד נתונים מותאמים לאלמנט DOM סטנדרטי, כדאי להשתמש ב-custom data attribute כפי שמוסבר [ב-MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

3. React עדיין לא מזהה את המאפיין שציינתם. סביר שזה יטוקן בגרסה עתידית של React. React תאפשר להעביר אותו בלי אזהרה אם תכתבו את שם המאפיין באותיות קטנות.

4. אתם משתמשים בקומפונטת React בלי אות ראשית השם, למשל `<myButton />`. React מפרשת את זה כתגית DOM כי ה-JSX טרנספורמציה של React משתמש בכלל אותיות גדולות/קטנות כדי להבדיל בין קומפונטות מוגדרות-משתמש על תגיות DOM. לקומפוננטות שלכם השתמשו ב-PascalCase. לדוגמה, כתבו `<MyButton />` במקום `<myButton />`.

---

אם עניין את האזהרה כי העברתם props כמו `{...props}`, קומפוננטת ה-parent צריכה "לצרוך" כל פרופס שמיועד ל-parent ולא ל-child. דוגמה:

**רע:** ה-prop הלא צפוי `layout` מועבר לתגית `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**טוב:** אפשר להשתמש ב-spread תחביר כדי לחלץ משתנים מ-props, ולהכניס את השאר ה-props לשינוי נפרד.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**טוב:** אפשר גם להעתיק את props לאובייקט חדש ולמחוק ממנו את המפתחות עם משתמשים. חשוב לא למחוק props מה אובייקט המקורי `this.props`, כי צריך להתייחס אליו כ-בלתי ניתן לשינוי.

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
