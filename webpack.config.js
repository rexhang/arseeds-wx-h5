const WEBPACK = require('webpack');

const CONFIG = {
    entry: __dirname + '/entry.js',
    output: {
        path: __dirname + '/webpack_build/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/, loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.js|jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {   test: /\.(gif|png|jpg|jpeg|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new WEBPACK.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]

};

module.exports = CONFIG;