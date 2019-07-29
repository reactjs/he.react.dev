/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const JsxCompiler = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>JSX Compiler Service</Header>
          <div css={sharedStyles.markdown}>
            <p>
              <strong>
                הכלי הזה הוסר כאשר JSXTransformer בוטל.
              </strong>
            </p>
            <p>
              אנו ממליצים להשתמש בכלי אחר כדוגמת{' '}
              <a href="https://babeljs.io/repl/">the Babel REPL</a>.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default JsxCompiler;
