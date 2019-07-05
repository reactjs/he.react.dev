// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// :DOM-עכשיו תוכלו לקבל רפרנס ישירות לכפתור ב
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
