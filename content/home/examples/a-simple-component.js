class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        שלום {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="יהונתן" />,
  document.getElementById('hello-example')
);
