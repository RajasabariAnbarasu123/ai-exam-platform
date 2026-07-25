const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = !isProduction;

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
            chunkFilename: isProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
            assetModuleFilename: 'static/media/[name].[hash:8][ext]',
            publicPath: '/',
            clean: true
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@hooks': path.resolve(__dirname, 'src/hooks'),
                '@context': path.resolve(__dirname, 'src/context'),
                '@services': path.resolve(__dirname, 'src/services'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@config': path.resolve(__dirname, 'src/config')
            },
            fallback: {
                "crypto": false,
                "stream": false,
                "os": false,
                "path": false
            }
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: '>0.2%, not dead, not op_mini all',
                                    modules: false
                                }],
                                ['@babel/preset-react', {
                                    runtime: 'automatic'
                                }]
                            ],
                            plugins: [
                                ['@babel/plugin-transform-runtime', {
                                    regenerator: true
                                }]
                            ],
                            cacheDirectory: true,
                            cacheCompression: false
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: isDevelopment,
                                postcssOptions: {
                                    config: true
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ico)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/images/[name].[hash:8][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/fonts/[name].[hash:8][ext]'
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/media/[name].[hash:8][ext]'
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                favicon: './public/favicon.ico',
                manifest: './public/manifest.json',
                inject: true,
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                } : undefined
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
                chunkFilename: isProduction ? 'static/css/[name].[contenthash:8].chunk.css' : 'static/css/[name].chunk.css'
            }),
            new webpack.DefinePlugin({
                'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:8080/api'),
                'process.env.REACT_APP_VERSION': JSON.stringify(require('./package.json').version),
                'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
            }),
            new webpack.EnvironmentPlugin({
                'REACT_APP_API_URL': 'http://localhost:8080/api',
                'REACT_APP_VERSION': require('./package.json').version
            }),
            isProduction && new webpack.HashedModuleIdsPlugin({
                hashFunction: 'sha256',
                hashDigest: 'hex',
                hashDigestLength: 8
            }),
            isProduction && new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'bundle-report.html',
                openAnalyzer: false
            })
        ].filter(Boolean),
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction,
                            drop_debugger: isProduction
                        },
                        format: {
                            comments: false
                        }
                    },
                    parallel: true,
                    extractComments: false
                }),
                new CssMinimizerPlugin()
            ],
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: 20,
                maxAsyncRequests: 20,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `vendor.${packageName.replace('@', '')}`;
                        },
                        priority: 10,
                        chunks: 'all'
                    },
                    common: {
                        minChunks: 2,
                        priority: 5,
                        reuseExistingChunk: true
                    },
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            },
            runtimeChunk: {
                name: 'runtime'
            }
        },
        devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
        devServer: {
            port: 3000,
            hot: true,
            open: true,
            historyApiFallback: true,
            compress: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false
                },
                progress: true
            },
            proxy: {
                '/api': {
                    target: process.env.REACT_APP_API_URL || 'http://localhost:8080',
                    changeOrigin: true,
                    secure: false,
                    pathRewrite: {
                        '^/api': ''
                    }
                }
            },
            static: {
                directory: path.join(__dirname, 'public'),
                publicPath: '/'
            }
        },
        performance: {
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
            hints: isProduction ? 'warning' : false
        },
        stats: {
            children: false,
            modules: false,
            moduleTrace: false,
            warnings: false,
            errorDetails: true,
            colors: true
        }
    };
};