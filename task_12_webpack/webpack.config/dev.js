const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
    return {
        context: __dirname + './../static',
        devtool: 'inline-sourcemap',
        entry: './scripts/app.js',
        output: {
            path: __dirname + './../static/',
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
        devServer: {
            contentBase: path.resolve(__dirname, './../static/'),
            port:8083
        }
    };
};