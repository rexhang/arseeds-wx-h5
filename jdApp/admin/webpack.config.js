module.exports = {

    entry: {
        indexOne: './index.js'
    },
    output: {
        path: __dirname + '/data',
        filename: '[name].js'
    },
    devServer:{
    historyApiFallback: true,
  },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    }
}