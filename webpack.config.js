const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: '#eval-source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
    rules: [
    {
            test: require.resolve('snapsvg'),
            loader: 'imports-loader?this=>window,fix=>module.exports=0'
          },
    {
            test: require.resolve('snap.svg.zpd'),
            loader: 'imports-loader?Snap=snapsvg'
          }

          ]
    }
};