---
title: התקנה
---

<Intro>

React תוכנה מלכתחילה לאימוץ הדרגתי. אפשר להשתמש במעט React או בהרבה React לפי הצורך. בין אם אתם רוצים טעימה מ-React, להוסיף אינטראקטיביות HTML, או להתחיל אפליקציה מורכבת להכנסת שמבוססת על React, החלק הזה יעזור לכם להתחיל.

</Intro>

<YouWillLearn isChapter={true}>

* [איך מתחילים פרויקט React חדש](/learn/start-a-new-react-project)
* [איך למצוא React לפרויקט ](/learn/add-react-to-an-existing-project)
* [איך מגדירים את העורך](/learn/editor-setup)
* [איך מתקינים React כלים למפתחים](/learn/react-developer-tools)

</YouWillLearn>

## נסו את React {/*try-react*/}

לא צריך להתקין שום דבר כדי להתנסות ב-React. נסו לערוך את סביבת העבודה הזו (ארגז חול)!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

אפשר לערוך אותו או לפתוח אותו בלשונית חדשה דרך כפתור "פורק" שבפינה הימנית העליונה.

רוב העמודים בתיעוד של תגובה סביבות ארגז חול כאלה. מחוץ לתיעוד של React יש עוד הרבה סביבות מקוונות שתומכות ב-React, למשל [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), או [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### נסו את React מקומית {/*try-react-locally*/}

כדי לנסות את הגיבו המקומית במחשב, [הורידו את דף ה-HTML הזה.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee17083be40bdff) ובומפו פתחד.html בעורך

## התחילו פרויקט React חדש {/*start-a-new-react-project*/}

אם אתם רוצים לבנות אפליקציה או אתר שמבוסים לגמרי על React, [התחילו פרויקט React חדש.](/learn/start-a-new-react-project)

## הוסיפו React לפרויקט קיים {/*add-react-to-an-existing-project*/}

אם אתם רוצים לנסות להשתמש ב-React באפליקציה או באתר קיים, [הוסיפו React לפרויקט קיים.](/learn/add-react-to-an-existing-project)

## השלבים הבאים {/*next-steps*/}

עברו ביותר למדריך [התחלה מהירה](/learn) לסיור ברעיונות חשובים של React שתפגשו ביום-יום.
