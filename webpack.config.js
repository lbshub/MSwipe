const path = require('path')

module.exports = {
    mode: 'production', // production development 
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'mswipe.js',
        library: 'MSwipe',
        libraryExport: 'default',
        globalObject: 'this',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/transform-runtime']
                }
            }
        }]
    }
}