import {ThemeContext, themes} from './theme-context';
import ThemedButton from './themed-button';

// ThemedButton-רכיב ביניים שמשתמש ב
function Toolbar(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light,
    };

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };
  }

  render() {
    //highlight-range{1-3}
    // בתוך ספק ערכת הנושא ThemedButton-כפתור ה
    // והכפתור החיצוני ,state-משתמש בערכת הנושא מה
    // משתמש בברירת המחדל של ערכת הנושא הכהה
    //highlight-range{3-5,7}
    return (
      <Page>
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <Section>
          <ThemedButton />
        </Section>
      </Page>
    );
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(<App />);
