/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://he.reactjs.org';
const version = '17.0.12';
=======
const urlRoot = 'https://reactjs.org';
<<<<<<< HEAD
const version = '18.0.0';
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
=======
const version = '18.1.0';
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
