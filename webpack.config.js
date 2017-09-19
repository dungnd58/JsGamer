var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'), 
    pixi = path.join(phaserModule, 'build/custom/pixi.js'),
    p2 = path.join(phaserModule, 'build/custom/p2.js');

// allowing different behavior between development builds and release builds
const definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, './src/index.js')
        ],
        vendor: ['pixi', 'p2', 'phaser']
    },
    devtool: 'source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'index.js'
    },
    watch: true,
    plugins: [
        definePlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'/* chunkName= */,
            filename: 'vendor.bundle.js'/* filename= */,
            minChunks: Infinity
        }),
        new UglifyJsPlugin({
            test: /\.js$/,
            sourceMap: false,
            parallel: true
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './build']
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/,
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                      presets: [['es2015', {modules: false}]],
                      plugins: ['syntax-dynamic-import']
                    }
                }]
            }, {
                test: /pixi\.js/,
                use: ['expose-loader?PIXI'] 
            }, {
                test: /phaser-split\.js$/, 
                use: ['expose-loader?Phaser'] 
            }, {
                test: /p2\.js/, 
                use: ['expose-loader?p2'] 
            }, {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [{
                      loader: "css-loader"
                  },
                  {
                      loader: "sass-loader"
                  }],
                }),
            }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
}


