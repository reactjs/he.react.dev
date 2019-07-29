/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

import names from '../../content/acknowledgements.yml';

const Acknowlegements = ({data, location}) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Acknowledgements</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/acknowledgements.html`}
            title="React - Acknowledgements"
          />

          <div css={sharedStyles.markdown}>
            <p>אנו נשמח להודות לכל התורמים:</p>

            <ul
              css={{
                display: 'flex',
                flexWrap: 'wrap',
              }}>
              {names.map((name, index) => (
                <li
                  css={{
                    flex: '1 0 200px',
                  }}
                  key={index}>
                  {name}
                </li>
              ))}
            </ul>

            <p>בנוסף, אנו מוקירים תודה ל</p>
            <ul>
              <li>
                <a href="https://github.com/jeffbski">Jeff Barczewski</a> שאפשר לנו להשתמש בשם החבילה{' '}
                <a href="https://www.npmjs.com/package/react">react</a> בnpm.
              </li>
              <li>
                <a href="https://christopheraue.net/">Christopher Aue</a> שאפשר לנו להשתמש בשם הדומיין{' '}
                <a href="https://reactjs.com/">reactjs.com</a> ובשם המשתמש <a href="https://twitter.com/reactjs">@reactjs</a> בטטויטר
                on Twitter.
              </li>
              <li>
                <a href="https://github.com/ProjectMoon">ProjectMoon</a> שאפשרו לנו להשתמש בשם החבילה{' '}
                <a href="https://www.npmjs.com/package/flux">flux</a> בnpm.
              </li>
              <li>
                Shane Anderson שאפשר לנו להשתמש במשתמש{' '}
                <a href="https://github.com/react">react</a> org בGitHub.
              </li>
              <li>
                <a href="https://github.com/voronianski">Dmitri Voronianski</a>{' '}
                שאפשר להו להשתמש בסכימת הצבעים{' '}
                <a href="https://labs.voronianski.com/oceanic-next-color-scheme/">
                  Oceanic Next
                </a>{' '}
                באתר.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Acknowlegements;
