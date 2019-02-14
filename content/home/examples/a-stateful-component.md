---
title: קומפוננטה עם state
order: 1
domid: timer-example
---

בנוסף ללקיחת מידע קלט (הנגיש באמצעות `this.props`), קומפוננטה יכולה לשמור מידע על state פנימי (הנגיש באמצעות `this.state`). כאשר הstate של הקומפוננטה משתנה, הmarkup המעובד יעודכן על ידי קריאה מחדש ל `render()`.
In addition to taking input data (accessed via `this.props`), a component can maintain internal state data (accessed via `this.state`). When a component's state data changes, the rendered markup will be updated by re-invoking `render()`.
