/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/**
 * @type {import('next').NextConfig}
 **/
// detect when we're building for GitHub Pages so we can set the
// correct base path. the workflow sets GITHUB_REPOSITORY which looks
// like "user/repo"; the repository name is used as the basePath.
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = isGitHubActions
  ? '/' + process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';

const nextConfig = {
  // when exporting we need to tell Next.js to write to `out` and also
  // make sure all asset references are prefixed with the base path
  output: 'export',
  basePath: repoName,
  assetPrefix: repoName,
  trailingSlash: true,
  images: {
    // Required for static export (GitHub Pages).
    unoptimized: true,
  },
  env: {
    // if we don't set this explicitly, the value would be empty at
    // runtime in the browser. components that build their own
    // `<img src="/…"/>` paths rely on this to know the correct prefix.
    NEXT_PUBLIC_BASE_PATH: repoName,
  },

  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: true,
  experimental: {
    // TODO: Remove after https://github.com/vercel/next.js/issues/49355 is fixed
    appDir: false,
    scrollRestoration: true,
    legacyBrowsers: false,
  },
  webpack: (config, {dev, isServer, ...options}) => {
    if (process.env.ANALYZE) {
      const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    // Don't bundle the shim unnecessarily.
    config.resolve.alias['use-sync-external-store/shim'] = 'react';

    const {IgnorePlugin, NormalModuleReplacementPlugin} = require('webpack');
    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /^raf$/,
        require.resolve('./src/utils/rafShim.js')
      ),
      new NormalModuleReplacementPlugin(
        /^process$/,
        require.resolve('./src/utils/processShim.js')
      ),
      new IgnorePlugin({
        checkResource(resource, context) {
          if (
            /\/eslint\/lib\/rules$/.test(context) &&
            /\.\/[\w-]+(\.js)?$/.test(resource)
          ) {
            // Skips imports of built-in rules that ESLint
            // tries to carry into the bundle by default.
            // We only want the engine and the React rules.
            return true;
          }
          return false;
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
