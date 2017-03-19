const path = require('path');
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
            new HtmlWebpackPlugin({
                template: 'index.template.ejs',
                inject: 'body',
            })
        ],
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ],
        },
        devServer: {
            contentBase: path.resolve(__dirname, './../static/'),
            port:8083
        }
    };
};