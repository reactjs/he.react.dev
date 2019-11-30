---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> הערה:
>
>`React.PropTypes` הועבר לחבילה אחרת מאז ריאקט גרסה 15.5. אנא השתמש [בספרייה `prop-types` במקום](https://www.npmjs.com/package/prop-types).
>
>אנו מספקים [סקריפט codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) כדי להפוך את ההמרה לאוטומטית.

בשחרור גרסה עיקרית של ריאקט בעתיד, הקוד שמיישם ולידציה של פונקציות PropType יוסר ב-production. כשזה יקרה, כל קוד שקורא לפונקציות אלה באופן ידני (שלא מוסר ב-production) יחזיר שגיאה.

### הצהרת PropType זה עדיין בסדר {#declaring-proptypes-is-still-fine}

אופן השימוש הנורמלי ב-PropTypes עדיין נתמך:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

כלום לא השתנה פה.

### אל תקרא ל-PropTypes ישירות {#dont-call-proptypes-directly}

שימוש ב-PropTypes בכל דרך אחרת חוץ מלפרש קומפוננטות ריאקט איתם לא נתמכת יותר:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// לא נתמך!
var error = apiShape(json, 'response');
```

אם אתה תלוי בשימוש ב-PropTypes כמו בדוגמה, אנו ממליצים לך להשתמש או ליצור fork של PropTypes ([כמו](https://github.com/aackerman/PropTypes) [שתי](https://github.com/developit/proptypes) החבילות האלו).

אם אתה לא מתקן את האזהרה, הקוד יקרוס ב-production עם ריאקט 16.

### אם אתה לא קורא ל-PropTypes ישירות אבל עדיין מקבל את האזהרה {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

בחן את ה-stack trace שנוצר על ידי האזהרה. אתה תמצא את הגדרת הקומפוננטה שאחראית לקריאה הישירה של PropTypes. סביר להניח שהבעיה קשורה ל-PropTypes צד שלישי שעוטף את PropTypes של ריאקט, לדוגמה:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

במקרה זה, הוא מעטפת שקוראת ל- . תבנית זו היא בסדר, אבל מפעילה אזהרה כוזבת בגלל שריאקט חושב שאתה קורא ל-PropTypes ישירות. הקטע הבא יסביר על איך לתקן את בעיה זו בספריה שמיישמת משהו כמו ---. אם זו לא ספריה שכתבת, אתה יכול לפתוח issue על נושא זה.

### תיקון האזהרה הכוזבת ב-PropTypes צד שלישי {#fixing-the-false-positive-in-third-party-proptypes}

ם אתה מחבר של ספריית PropTypes צד שלישי ואתה נותן למשתמשים לעטוף PropTypes קיימים של ריאקט, יכול להיות שהם יתחילו לראות אזהרות שבאות מהספרייה שלך. זה קורה בגלל שריאקט לא רואה ארגומנט "סודי" אחרון [שהוא מעביר](https://github.com/facebook/react/pull/7132) על מנת לזהות קריאות ידניות של PropTypes.

הנה איך לתקן את זה. נשתמש ב-`deprecated` מ-[react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) כדוגמה. היישום הנוכחי מעביר מטה רק את הארגומנטים `props`, `propName` ו-`componentName`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

על מנת לתקן את האזהרה הכוזבת, וודא כי אתה מעביר את **כל** הארגומנטים מטה ל-PropType העטוף. זה קל לביצוע בעזרת `…rest` של ES6:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // שים לב ל-…rest פה
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // וגם פה
  };
}
```

זה ישתיק את האזהרה.
