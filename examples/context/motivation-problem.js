class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // "ערכת נושא" prop-קומפוננטת התפריט צריכה לקבל את ה
  // זה יכול להפוך את הקוד ."ThemedButton" ולהעביר אותו לכפתור
  // למסורבל אם כל כפתור באפליקציה צריך לדעת על ערכת הנושא בצורה זו
  // כי נאלץ להעביר אותה דרך כל הקומפוננטות.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
