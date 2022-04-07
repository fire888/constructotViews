const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, { mode }) => ({
    entry: './src/index.js',
    devtool: mode === 'development' ? 'source-map' : undefined,
    output: {
        path: path.resolve(__dirname, '../dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin()
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
});
