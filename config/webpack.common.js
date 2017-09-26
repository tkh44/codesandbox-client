const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const WatchMissingNodeModulesPlugin = require('../scripts/utils/WatchMissingNodeModulesPlugin');
const env = require('./env');

const babelDev = require('./babel.dev');
const babelProd = require('./babel.prod');

const NODE_ENV = JSON.parse(env['process.env.NODE_ENV']);
const __DEV__ = NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle
const __PROD__ = NODE_ENV === 'production'; // eslint-disable-line no-underscore-dangle
const babelConfig = __DEV__ ? babelDev : babelProd;

module.exports = {
  entry: {
    app: [require.resolve('./polyfills'), path.join(paths.appSrc, 'index.js')],
    sandbox: [
      require.resolve('./polyfills'),
      path.join(paths.sandboxSrc, 'index.js'),
    ],
    embed: [
      require.resolve('./polyfills'),
      path.join(paths.embedSrc, 'index.js'),
    ],
    vendor: ['react', 'react-dom', 'react-emotion'],
  },
  target: 'web',
  node: {
    fs: 'empty',
    module: 'empty',
    child_process: 'empty',
  },
  output: {
    path: paths.appBuild,
    pathinfo: true,
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [paths.appSrc, paths.embedSrc],
      },
      {
        test: /\.js$/,
        include: paths.src,
        exclude: [
          /eslint\.4\.1\.0\.min\.js$/,
          /typescriptServices\.js$/,
          // Don't do the node modules of the codesandbox module itself
          /codesandbox-api\/node_modules/,
        ],
        loader: 'happypack/loader',
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      // For importing README.md
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: [/\/favicon.ico$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // A special case for favicon.ico to place it into build root directory.
      {
        test: /\/favicon.ico$/,
        include: [paths.src],
        loader: 'file-loader',
        options: {
          name: 'favicon.ico?[hash:8]',
        },
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // "html" loader is used to process template page (index.html) to resolve
      // resources linked with <link href="./relative/path"> HTML tags.
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          attrs: ['link:href'],
        },
      },
    ],

    noParse: [/eslint\.4\.1\.0\.min\.js$/, /typescriptServices\.js$/],
  },

  resolve: {
    mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    modules: ['src', 'node_modules'],

    extensions: ['.js', '.json'],

    alias: {
      moment: 'moment/moment.js',
    },
  },

  plugins: [
    new HappyPack({
      loaders: [
        {
          path: 'babel-loader',
          query: babelConfig,
        },
      ],
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'common', 'app'],
      filename: 'app.html',
      template: paths.appHtml,
      minify: __PROD__ && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'common', 'sandbox'],
      filename: 'frame.html',
      template: paths.sandboxHtml,
      minify: __PROD__ && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'embed'],
      filename: 'embed.html',
      template: path.join(paths.embedSrc, 'index.html'),
      minify: __PROD__ && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `env.js`.
    new webpack.DefinePlugin(env),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Make the monaco editor work
    new CopyWebpackPlugin(
      [
        {
          from: __DEV__
            ? 'node_modules/monaco-editor/dev/vs'
            : 'node_modules/monaco-editor/min/vs',
          to: 'public/vs',
        },
        __PROD__ && {
          from: 'node_modules/monaco-editor/min-maps',
          to: 'public/min-maps',
        },
        {
          from: 'node_modules/monaco-vue/release/min',
          to: 'public/vs/language/vue',
        },
        {
          from: 'static',
          to: 'static',
        },
        {
          from: 'src/homepage/static',
          to: 'static',
        },
      ].filter(x => x)
    ),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'sandbox'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 2,
    }),
    new webpack.NamedModulesPlugin(),
  ],
};
