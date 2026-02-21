---
title: "<אופציה>"
---

<Intro>

רכיב הדפדפן המובנה [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) אפשרות לרנדר אפשרות בתוך תיבת [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<option>` {/*option*/}

רכיב הדפדפן המובנה [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) אפשרות לרנדר אפשרות בתוך תיבת [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[עוד דוגמאות נוספות.](#usage)

#### אבזרים {/*props*/}

`<option>` תומך בכל [מאפייני האלמנט הנפוצים.](/reference/react-dom/components/common#props)

בנוסף, `<option>` תומך ב-props האלה:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): ערך בוליאני. אם `true`, לא ניתן לבחור באפשרות היא תוצג מעומעמת.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): מחרוזת. מציינת את המשמעות אפשרות. אם לא הוגדרה, ישמש הטקסט שבתוך אפשרות.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): הערך שישמש [בעת שליחת טופס ה-`<select>` ההורה](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) אם זו נבחרה.

#### אזהרות {/*caveats*/}

* React לא תומכת במאפיין `selected` על `<option>`. במקום זאת, העבירו את ה-`value` של אפשרות ל-[`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) של ההורה עבור select לא נשלט, או ל-[`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) עבור בחר נשלט.

---

## שימוש {/*usage*/}

### הצגת תיבת בחר עם אפשרויות {/*displaying-a-select-box-with-options*/}

רנדרו `<select>` עם רשימת קומפונטות `<option>` בתוכו כדי להציג תיבת select. תנו לכל `<option>` ערך `value` שמציג את הנתון שישלח עם הטופס.

[קראו עוד על הצגת `<select>` עם רשימת קומפונטות `<option>`. ](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  
