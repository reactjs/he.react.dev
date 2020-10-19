---
id: faq-ajax
title: AJAX ו-APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### איך אני יכול ליצור בקשת ?AJAX {#how-can-i-make-an-ajax-call}

אתה יכול להשתמש בכל ספריית AJAX שבחר עם React. כמה פופלאריות הן [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/) והמובנית בדפדפן [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### איפה במחזור החיים של הקומפוננטה אני צריך ליצור בקשת AJAX? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

אתה צריך לאכלס נתונים ובקשות AJAX במתודה [`componentDidMount`](/docs/react-component.html#mounting) במחזור החיים.
זה בשביל שתוכל להשתמש ב-`setState` כדי לעדכן את הקומפוננטה שלך מתי שהנתונים חוזרים.

### דוגמא: שימוש כתוצאה מ-AJAX כדי להגדיר state מקומי {#example-using-ajax-results-to-set-local-state}

הקומפוננטה למטה מדגימה איך ליצור בקשת AJAX ב-`componentDidMount` לאכלס state מקומי בקומפוננטה.

דוגמת ה-API מחזירה אובייקט JSON כזה:

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // שים לב: חשוב לטפל בשגיאות כאן
        // כדי שלא נפספס catch()-במקום הבלוק
        // על מנת שלא "נבלע" חריגות מבאגים בקומפוננטות שלנו.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```

Here is the equivalent with [Hooks](https://reactjs.org/docs/hooks-intro.html): 

```js
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.name}>
            {item.name} {item.price}
          </li>
        ))}
      </ul>
    );
  }
}
```
