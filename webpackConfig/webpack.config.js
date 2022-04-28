const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = (env, { mode }) => {
    const BACKEND_HOST = (process && process.env && process.env.BACKEND_HOST) || null
    console.log('%%%%%%% BACKEND_HOST %%%%%%%:', BACKEND_HOST)

    return {
        entry: './src/index.js',
        devtool: mode === 'development' ? 'source-map' : undefined,
        devServer: {
            host: 'localhost',
            port: 9000,
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            clean: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new MiniCssExtractPlugin(),
            new webpack.DefinePlugin({
                'BACKEND_HOST': JSON.stringify('' + BACKEND_HOST),
            }),
        ],
        module: {
            rules: [
                // {
                //     test: /\.(jsx|js)$/,
                //     include: path.resolve(__dirname, 'src'),
                //     exclude: /node_modules/,
                //     use: [
                //         {
                //             loader: 'babel-loader',
                //             options: {
                //                 presets: [
                //                     [
                //                         '@babel/preset-env',
                //                         {   "targets": "defaults" }
                //                     ],
                //                     '@babel/preset-react'
                //                 ]
                //             }
                //         }
                //     ]
                // },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: "babel-loader"
                },

                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
    }
}
