const path = require('path'),
    webpack = require('webpack'),
    extractText = require('extract-text-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'terminality.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.jsx?$/, loader: 'babel-loader' },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            { 
                test: /\.s?css$/, 
                exclude: /node_modules/,
                loader: extractText.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        modules: [ 
            path.resolve(__dirname, 'src'),
            'node_modules',
            path.resolve(__dirname, 'styles')
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('develop'),
            __DEV__: JSON.stringify(true)
        }),
        new extractText('terminality.css')
    ]
}