---
title: "<Profiler>"
---

<Intro>

`<Profiler>` מקסימום למדוד ביצועי רינדור של עץ React באופן פרוגרמטי.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## הפניה {/*reference*/}

### `<Profiler>` {/*profiler*/}

עטפו עץ קומפונטות ב-`<Profiler>` כדי למדוד את ביצועי הרינדור שלו.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### אבזרים {/*props*/}

* `id`: מחרוזת שמזהה את החלק ב-UI שאתם מודדים.
* `onRender`: [`onRender` callback](#onrender-callback) ש-React קוראת לו בכל פעם שקומפונטות בתוך העץ המנוטר מתעדכנות. הוא מקבל מידע על מה רונדר כמה זמן זה לקח.

#### אזהרות {/*caveats*/}

* פרופיל מוסיף מעט תקורה, לכן **הוא כבוי כברירת מחדל ב-build של הייצור.** כדי להפעיל פרופיל ב-production צריך להפעיל [בנה מיוחד עם פרופיל פעיל.](https://fb.me/react-profiling)

---

### `onRender` התקשרות חוזרת {/*onrender-callback*/}

React תקרא ל-`onRender` callback שלכם עם מידע על מה שרונדר.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### פרמטרים {/*onrender-parameters*/}

* `id`: מחרוזת ה-`id` prop של עץ ה-`<Profiler>` שבוצע לו commit now. זה יכול לזהות איזה חלק בעץ עבר להתחייב אם אתם משתמשים בכמה פרופילים.
* `phase`: אחד מהערכים `"mount"`, `"update"` או `"nested-update"`. כך אפשר לדעת האם העץ הורכב עכשיו לראשונה או רונדר מחדש בגלל שינוי ב-props, state או הוקס.
* `actualDuration`: מספר המילישניות שהושקעו ברינדור ה-`<Profiler>` וצאצאיו בעדכון הנוכחי. זה מצביע עד כמה תת-העץ משתמש היטב ב-memoization (לפני כן [`memo`](/reference/react/memo) ו-[`useMemo`](/reference/react/useMemo)). אידיאלית, הערך הזה אמור להיפגע אחרי ה-mount הראשוני כי רוב הצאצאים יצטרכו לרנדר מחדש אם ה-props הרלו שלהם משתנים.
* `baseDuration`: מספר המילישניות שמריך כמה זמן היה לוקח לרנדר מחדש את כל תת-העץ של `<Profiler>` בלי אופטימיזציות. הוא מחושב כשכר זמני הרינדור לאחר של כל קומפונטה בעץ. הערך הזה יותר את המחיר במקרה הגרוע של רינדור (מקל ראשוני או עץ בלי memoization). השוו אותו ל-`actualDuration` כדי לראות האם memoization עובדת.
* `startTime`: חותמת זמן מספרית לרגע שבו React התחילה לרנדר את העדכון הנוכחי.
* `commitTime`: חותמת זמן מספרית לרגע שבו React ביצעה commit לעדכון הנוכחי. הערך הזה שותף לכל הפרופילים באותו התחייבות, מה שמאפשר לקבץ אותם אני רוצה.

---

## שימוש {/*usage*/}

### מדידת ביצועי רינדור באופן פרוגרמטי {/*measuring-rendering-performance-programmatically*/}

עטפו את קומפונטת `<Profiler>` סביב עץ React כדי למדוד את ביצועי הרינדור שלו.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

דרושים שני props: `id` (מחרוזת) ו-`onRender` callback (פונקציה) ש-React קוראת לה בכל פעם שקומפוננתה בתוך העץ מבצעת עדכון עם "commit".

<Pitfall>

פרופיל מוסיף מעט מעל הראש, לכן **הוא כבוי כברירת מחדל ב-build של ייצור.** כדי להפעיל פרופיל ב-production צריך להפעיל [בנה מיוחד עם פרופיל פעיל.](https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>` לאסוף מדידות באופן פרוגרמטי. אם אתם מחפשים פרופיל אינטראקטיבי, נסו את השפה Profiler בתוך [React כלים למפתחים](/learn/react-developer-tools). היא חושפת יכולה דומות כהרחבת דפן.

</Note>

---

### מדידת חלקים שונים באפליקציה {/*measuring-different-parts-of-the-application*/}

אפשר להשתמש בכמה קומפונטות `<Profiler>` כדי למדוד חלקים שונים באפליקציה:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

אפשר גם לקנן קומפונטות `<Profiler>`:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

למרות ש-`<Profiler>` היא קומפוננת קלת משקל, כדאי להשתמש בה רק כשצריך. כל שימוש מוסיף מעט עומס CPU וזיכרון לאפליקציה.

---
