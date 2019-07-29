// createContext-שים לב שצורת הערך של ברירת המחדל שמועבר ל
// זהה לצורת הערכים שהצרכנים מצפים לקבל!
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
