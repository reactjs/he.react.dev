import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// .LogProps שיבאנו היא הקומפוננטה מסדר גבוה יותר FancyButton-קומפוננטת ה
// LogProps-למרות שהפלט ירונדר בצורה זהה, הרפרנס שלנו יצביא ל
// !הפנימית FancyButton-במקום לקומפוננטת ה
// ref.current.focus()-ולכן אנחנו לא יכולים לקרוא לדוגמא ל
// highlight-range{4}
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
