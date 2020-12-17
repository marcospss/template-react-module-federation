const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin;
const Dotenv = require('dotenv-webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
// const { GenerateSW } = require('workbox-webpack-plugin');

const dependencies = require('./package.json').dependencies;

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/index',
    mode: isDevelopment ? 'development' : 'production',
    devServer: {
        //contentBase: path.join(__dirname, 'dist'),
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
    output: {
        publicPath: 'http://localhost:3000/',
        path: path.resolve(process.cwd(), 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /bootstrap\.tsx$/,
                loader: 'bundle-loader',
                options: {
                    lazy: true,
                },
            },
            {
                test: /\.[jt]sx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                    plugins: ['@babel/plugin-transform-runtime', isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        isDevelopment && new HotModuleReplacementPlugin(),
        isDevelopment && new ReactRefreshWebpackPlugin(),
        isDevelopment && new Dotenv(),
        new ModuleFederationPlugin({
            name: 'container',
            remotes: {},
            shared: [
                {
                    ...dependencies,
                    react: {
                        singleton: true,
                        requiredVersion: dependencies.react,
                    },
                    'react-dom': {
                        singleton: true,
                        requiredVersion: dependencies['react-dom'],
                    },
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        // new GenerateSW(), TODO: Config PWA
    ].filter(Boolean),
};
