---
title: "React DOM APIs"
---

<Intro>

החבילה `react-dom` כוללת מתודות שנתמכות רק באפליקציות ווב (פועלות בסביבת DOM של הדפדפן). הן לא נתמכות ב-React יליד.

</Intro>

---

## APIs {/*apis*/}

את ה-APIs האלה אפשר לייבא מתוך הקומפוננטות. הם בשימוש נדיר:

* [`createPortal`](/reference/react-dom/createPortal) מאפשר לרנדר קומפוננטות ילדים בחלק אחר של עץ ה-DOM.
* [`flushSync`](/reference/react-dom/flushSync) יכול לאלץ את React לבצע שטיפה לעדכון state ולעדכן את ה-DOM בצורה סינכרונית.

## APIs לטעינה מוקדמת של משאבים {/*resource-preloading-apis*/}

אפשר להשתמש ב-APIs האלה כדי להאיץ אפליקציות באמצעות טעינה מוקדמת של משאבים כמו סקריפטים, קובצי סגנון גופנים, מיד כשידוע שתצטרכו אותם, למשל לפני ניווט אחר שבו המשאבים האלה יידרשו.

[מסגרות מבוססות React](/learn/start-a-new-react-project) מטפלים לעתים קרובות בטעינת משאבים בשבילכם, אז ייתכן שלא תצטרכו לקרוא ל-APIs האלה באופן עצמאי. לפרטים, עיינו בתיעוד של ה-framework שלכם.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) יכול לבצע prefetch לכתובת ה-IP של שם דומיין DNS כשאתם מצפים להתחבר אליו.
* [`preconnect`](/reference/react-dom/preconnect) אפשר להתחבר מראש לשרת שמנו אתם מצפים לבקש משאבים, גם אם עדיין לא ידוע אילו משאבים תצטרכו.
* [`preload`](/reference/react-dom/preload) יכול להביא מראש גיליון סגנונות, גופן, תמונה, או סקריפט חיצוני אם מצפים להשתמש בהם.
* [`preloadModule`](/reference/react-dom/preloadModule) יכול להביא מראש מודול ESM כאשר מצפים להשתמש בו.
* [`preinit`](/reference/react-dom/preinit) יכול להביא ולהכניס גיליון סגנונות.
* [`preinitModule`](/reference/react-dom/preinitModule) יכול להביא ולהעריך מודול ESM.

---

## נקודות כניסה {/*entry-points*/}

החבילה `react-dom` מספקת שתי נקודות כניסה נוספות:

* [`react-dom/client`](/reference/react-dom/client) כולל APIs לרינדור קומפונטות React בצד לקוח (בדפדפן).
* [`react-dom/server`](/reference/react-dom/server) כולל APIs לרינדור קומפונטות React בצד שרת.

---

## APIs שהוצאו שימוש {/*deprecated-apis*/}

<Deprecated>

ה-APIs האלה יוסרו בגרסה ראשית עתידית של React.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) מוצא את DOM node הקרוב ביותר שמקביל למופע class component.
* [`hydrate`](/reference/react-dom/hydrate) עם עץ לתוך DOM __1 מ-`findDOMNode` של שרת. הוצא משימוש לטובת [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) כולל עץ לתוך ה-DOM. הוצא משימוש לטובת [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) מסיר עץ מה-DOM. הוצא משימוש לטובת [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).
