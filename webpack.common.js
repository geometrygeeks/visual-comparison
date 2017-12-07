module.exports = {
    entry: './src/index.js',
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