---
title: "<התקדמות>"
---

<Intro>

רכיב הדפדפן המובנה [`<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) יכול לרנדר מחוון התקדמות.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<progress>` {/*progress*/}

כדי להציג מחוון התקדמות, רנדרו את רכיב הדפדפן המובנה [`<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[עוד דוגמאות נוספות.](#usage)

#### אבזרים {/*props*/}

`<progress>` תומך בכל [מאפייני האלמנט הנפוצים.](/reference/react-dom/components/common#props)

בנוסף, `<progress>` תומך ב-props האלה:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): מספר. מציין את הערך ה-`value` המקסימלי. ברירת המחדל היא `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): מספר בין `0` ל-`max`, או `null` להתקדמות לא-מוגדרת. מציין כמה כבר הושלם.

---

## שימוש {/*usage*/}

### שליטה במחוון התקדמות {/*controlling-a-progress-indicator*/}

כדי להציג מחוון התקדמות, רנדרו קומפונטת `<progress>`. אפשר להעביר מספר ב-`value` בין `0` לערך ה-`max` שתגדירו. אם לא תעבירו `max`, ברירת המחדל תהיה `1`.

אם פעולה אינה מתקדמת כרגע, העבירו `value={null}` כדי להעביר את מחוון ההתקדמות מצב לא-מוגדר.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
