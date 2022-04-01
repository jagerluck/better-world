import * as Dotenv from 'dotenv-webpack';
import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ProgressBarPlugin from 'progress-bar-webpack-plugin';
import 'webpack-dev-server';
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config: webpack.Configuration = {
  mode: 'development',
  context: __dirname,
  entry: './src/app.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // ... for default extensions
    extensions: ['.ts', '.js', '.json', '...'],
    fallback: {
      os: false,
      path: false,
      fs: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        use: [
          // fallback to style-loader in development
          // process.env.NODE_ENV !== 'production'
          //   ? 'style-loader'
          //   : MiniCssExtractPlugin.loader,
          'style-loader', //3. Inject styles into DOM
          'css-loader', //2. Turns css into commonjs
          'sass-loader', //1. Turns sass into css
        ],
      },
      {
        test: /\.(png|jpe?g|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      filename: 'index.html',
      inject: 'body',
    }),
    new Dotenv(),
    //@ts-ignore
    new ProgressBarPlugin(),
  ],
  devServer: {
    hot: true,
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
  },
  optimization: {
    noEmitOnErrors: true,
  },
};

export default config;
