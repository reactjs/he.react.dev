/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Layout from 'components/Layout';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>הדף לא נמצא</Header>
          <TitleAndMetaTags title="React - הדף אינו נמצא" />
          <div css={sharedStyles.markdown}>
            <p>לא יכולנו למצוא את הדף שאתה מחפש</p>
            <p>
              אנא פנה לבעל האתר שסיפק לך את הקישור, והודע לו שהכתובת שגויה.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
