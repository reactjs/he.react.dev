// קונטקסט ערכת הנושא עם ברירת מחדל בהירה
const ThemeContext = React.createContext('light');

// קונטקסט המשתמש המאומת
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // קומפוננטה שמספקת ערכי ברירת מחדל לקונטקסט
    // highlight-range{2-3,5-6}
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// קומפוננטה יכולה לצרוך יותר מקונטקסט אחד
function Content() {
  // highlight-range{2-10}
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
