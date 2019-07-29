class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// LogProps-נייצא את ה,FancyButton-במקום לייצא את ה.
// FancyButton אבל הוא עדיין ירנדר
// highlight-next-line
export default logProps(FancyButton);
