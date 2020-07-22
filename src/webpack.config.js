const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require("autoprefixer");

module.exports = {
    mode: process.env.MODE,
    entry: "./assets/ts/index.ts",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss?$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.MODE === "development",
                            reloadAll: true
                        }
                    }, "css-loader", {
                        loader: "postcss-loader",
                        options: {
                            plugins() {
                                return [autoprefixer({ overrideBrowserslist: "cover 99.5%" })]
                            }
                        }
                    }, "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                }
            },
        ]
    },
    node: {
        crypto: 'empty',
    },
    plugins: [new MiniCssExtractPlugin({ filename: "styles.css" })],
    optimization: {
        minimize: true
    }
};