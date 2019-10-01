// highlight-range{1-4}
// קונטקס נותן לנו להעביר ערך עמוק לתוך עץ הקומפוננטות
// בלי להעביר אותו באופן מפורש לכל קומפוננטה.
// (צור קונטקס לערכת הנושא (עם ברירת מחדל ״בהירה״
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // כדי להעביר את ערכת הנושא לעץ הקומפוננטות Provider-נשתמש ב
    // כל קומפוננטה יכולה להשתמש בו, לא משנה באיזה עומק.
    // בדוגמא הבאה, נעביר ״כהה״ כערך לערכת הנושא.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
// קומפוננטת ביניים כבר לא צריכה להעביר
// את ערכת הנושא.
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // contextType-נקרא את ערך ערכת הנושא מהקונטקס ב.
  // ימצא את ספק ערכת הנושא הקרוב ויקרא את ערך ערכת הנושא React
  // בדוגמא הזאת, הערך הוא ״כהה״.
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
