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
            <p>נשמח להודות לכל התורמים:</p>

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

            <p>בנוסף לכך, אנו אסירי תודה ל:</p>
            <ul>
              <li>
                ל<a href="https://github.com/jeffbski">ג'ף ברסווסקי</a> שאפשר לנו להשתמש בשם{' '}
                <a href="https://www.npmjs.com/package/react">react</a> לחבילה בnpm
              </li>
              <li>
                ל<a href="https://christopheraue.net/">קריסטופר יו</a> שאפשר לנו להשתמש בדומיין{' '}
                <a href="https://reactjs.com/">reactjs.com</a> 
                ובשם <a href="https://twitter.com/reactjs">@reactjs</a> בטוויטר.
              </li>
              <li>
                ל<a href="https://github.com/ProjectMoon">ProjectMoon</a> שנתנו לנו להשתמש בשם{' '}
                <a href="https://www.npmjs.com/package/flux">flux</a> לחבילה בnpm
              </li>
              <li>
                לשיין אנדרסון שאפשר לנו להשתמש בשם{' '}
                <a href="https://github.com/react">react</a> בGitHub
              </li>
              <li>
                ל<a href="https://github.com/voronianski">לדמטירי וורוניאנסקי</a>{' '}
                שאפשר לנו להשתמש בסכמת הצבעים{' '}
                <a href="https://labs.voronianski.com/oceanic-next-color-scheme/">
                  Oceanic Next
                </a>{' '}
                שלו באתר שלנו.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Acknowlegements;
