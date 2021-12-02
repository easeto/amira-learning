var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        app: [
            './src/app.js'
        ],
    },
    output: {
        filename: 'build/[name].[chunkhash].js',
        publicPath: '/',
    },
    resolve: {
      alias: {
        Components: path.resolve(__dirname, 'src/components'),
        Services: path.resolve(__dirname, 'src/services'),
        Constants: path.resolve(__dirname, 'src/constants'),
      }
    },
    module: {
        rules: [
            {
                test: /-worker\.js/,
                loader: 'worker-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: "css-loader!sass-loader",
                })
            },
            {
              test: /\.css$/,
              //exclude: /node_modules/,
              loaders: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpe?g|gif|png|pdf|svg)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10000
                    }
                  }
                ]
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader'
            },
        ],
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
      new ExtractTextPlugin('build/style.[chunkhash].css', {
          allChunks: true
      }),
      new HtmlWebpackPlugin({
        hash: true,
        filename: './index.html', //relative to root of the application
        template : __dirname + '/index.html',
      }),
      new HtmlWebpackPlugin({
        filename: './sessionEnded.html',
        template: __dirname + '/assets/sessionEnded.html',
        inject: false,
      }),
      new Dotenv({
        path: './src/amira.env'
      }),
      new webpack.DefinePlugin({
        'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        'VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      })
    ]
};