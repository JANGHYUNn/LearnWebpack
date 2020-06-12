const path = require('path');
const MyWebpackPlugin = require('./my-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtreactPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'development',
    entry: {
        main: './babel.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [path.resolve('./my-webpack-loader.js')]
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production' ?
                    MiniCssExtreactPlugin.loader
                    :'style-loader', 
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    // publicPath: './dist/',
                    name: '[name].[ext]?[hash]',
                    limit: 20000// 2kb
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new MyWebpackPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        ...(process.env.NODE_ENV === 'production' ?
        [new MiniCssExtreactPlugin({
            filename: '[name].css'
        })]
        :[])
    ]
}