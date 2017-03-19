var debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSASS = new ExtractTextPlugin('style.css');

module.exports = {
    context: __dirname + '/static',
    devtool: 'inline-sourcemap',
    entry: './scripts/app.js',
    output: {
        path: __dirname + '/static',
        filename: 'scripts.js'
    },
    plugins: [extractSASS],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [/scripts/],
                enforce:'pre',
                use:[{loader:'eslint-loader'}]
            },
            {
                test: /\.scss$/,
                use: extractSASS.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ],
    },
};