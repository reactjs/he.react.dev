---
title: "React DOM Hooks מובנים"
---

<Intro>

החבילה `react-dom` כוללת Hooks שנתמכים רק באפליקציות ווב (שרצות בסביבת DOM של הדפדפן). Hooks אלה לא נתמכים בסביבות שאינן דפדפן, כמו אפליקציות iOS, Android או Windows. אם אתם מחפשים Hooks שנתמכים גם בדפדפנים *וגם בסביבות נוספות*, ראו [את עמוד React Hooks](/reference/react). העמוד הזה מציג את כל ה-Hooks בחבילת `react-dom`.

</Intro>

---

## טופס Hooks {/*form-hooks*/}

<Canary>

טופס Hooks זמינים כרגע רק בערוצי קנרי ו-ניסיוני של React. מידע נוסף ב-[ערוצי השחרור של React](/community/versioning-policy#all-release-channels).

</Canary>

*טפסים* מאפשרים ליצור רכיבים אינטראקטיביים לשליחת מידע. כדי לנהל טפסים בתוך הקומפוננטות, השתמשו באחד מה-Hooks הבאים:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) יכול לבצע עדכוני UI לפי הסטטוס של טופס.
* [`useFormState`](/reference/react-dom/hooks/useFormState) יכול לנהל state בתוך טופס.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useFormState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
