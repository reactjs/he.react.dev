function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez',
};

const element = <h1>שלום, {formatName(user)}!</h1>;

ReactDOM.render(element, document.getElementById('root'));
