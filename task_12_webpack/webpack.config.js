const debug = process.env.NODE_ENV !== 'production';
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname + '/static',
    devtool: 'inline-sourcemap',
    entry: './scripts/app.js',
    output: {
        path: __dirname + '/static',
        filename: 'scripts.js'
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: 'index.template.ejs',
            inject: 'body',
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ],
    },
};
console.log(process.env.NODE_ENV);
