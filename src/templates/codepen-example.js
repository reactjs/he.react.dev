import React, {Component} from 'react';
import Container from 'components/Container';
import Layout from 'components/Layout';
import {colors} from 'theme';

// Copied over styles from ButtonLink for the submit btn
const primaryStyle = {
  backgroundColor: colors.brand,
  color: colors.black,
  padding: '10px 25px',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.2s ease-out',
  outline: 0,
  border: 'none',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: colors.white,
  },

  display: 'inline-block',
  fontSize: 16,
};

class CodepenExample extends Component {
  componentDidMount() {
    this.codepenForm.submit();
  }

  render() {
    const {location, pageContext} = this.props;
    const {action, payload} = pageContext;

    return (
      <Layout location={location}>
        <Container>
          <h1>מפנה לCodePen...</h1>
          <form
            style={{paddingBottom: '50px'}}
            ref={form => {
              this.codepenForm = form;
            }}
            action={action}
            method="POST">
            <input type="hidden" name="data" value={payload} />

            <p>
              לא מפונה אוטומטית??
              <br />
              <br />
              <input style={primaryStyle} type="submit" value="לחץ כאן" />
            </p>
          </form>
        </Container>
      </Layout>
    );
  }
}

export default CodepenExample;
