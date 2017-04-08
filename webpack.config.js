
'use strict';

var path = require('path');

/*
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
   template: './public/index.html',
   filename: 'index.html',
   inject: 'body'
});

var config = {
   entry: './public/main.js',
	
   output: {
      path: path.join(__dirname, 'public', 'build'),
      filename: 'index.js',
      publicPath: '/build/'
   },
	
   devServer: {
      contentBase: './public/',
      historyApiFallback: {
         index: 'index.html'
      },
      inline: true,
      port: 8080
   },
	
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
				
            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   },

   plugins: [HtmlWebpackPluginConfig]
}

module.exports = config;
*/
/*
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
   template: './public/index.html',
   filename: 'index.html',
   inject: 'body'
});
*/

module.exports = {

   entry: {
      app: ['./public/main.js']
   },
   
   output: {
      path: __dirname + '/public/build',
      filename: 'index.js',
      publicPath: '/build/'
   },

   devServer: {
      contentBase: 'public/',
      inline: true,
      port: 8090
   },

   module: {
      loaders: [
         { test: /\.js$/, loader: 'babel-loader', exclude: [/node_modules/, /uploads/] },
         { test: /\.jsx?$/, loader: 'babel-loader', exclude: [/node_modules/, /uploads/] }
      ]
   }
}