function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      // highlight-next-line
      const {forwardedRef, ...rest} = this.props;

      // כרפרנס "forwardedRef" prop-ניישם את ה
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // React.forwardRef סופק על ידי "ref" שימו לב שהפרמטר השני
  // רגיל prop כמו LogProps-אנחנו יכולים להעביר אותו הלאה ל
  // ולקשר אותו לקומפוננטה "forwardedRef" לדוגמא
  // highlight-range{1-3}
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
