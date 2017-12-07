const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        })
    ],
    output: {
        filename: 'visual-comparison.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'visualComparison'
    }
});