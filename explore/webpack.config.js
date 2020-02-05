const PATHS = require('path');

const WEBPACK = require('webpack');

const CONFIG = {
    entry: PATHS.resolve(__dirname, 'entry.js'),
    /*entry: {
        home: './home.js',
        events: './events.js'
    },*/
    output: {
        path: PATHS.resolve(__dirname, 'webpack_build'),
        filename: 'build.js',
        publicPath:'./'
    },
    /*output: {
        path: PATHS.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },*/
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?minimize'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader?minimize!sass-loader',
            },
            {
                test: /\.js|jsx|rexjs$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?cacheDirectory',
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
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
              // 在UglifyJs删除没有用到的代码时不输出警告
              warnings: false,
              // 删除所有的 `console` 语句
              // 还可以兼容ie浏览器
              drop_console: false,
              // 内嵌定义了但是只用到一次的变量
              collapse_vars: true,
              // 提取出出现多次但是没有定义成变量去引用的静态值
              reduce_vars: true,
            }
        })
    ],
    resolve: {
        modules: [PATHS.resolve(__dirname, 'node_modules')]
    }
};

module.exports = CONFIG;