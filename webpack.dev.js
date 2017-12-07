const path = require('path');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: '#eval-source-map',
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'visualComparison'
    }
});