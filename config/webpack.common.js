const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
module.exports = {
  // entry: '../src/index.tsx',
  entry: path.join(__dirname, '../src/index.tsx'),
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', 'json', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              plugins: (loader) => []
            }
          },
          'sass-loader',
        ],
      }, {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      }, {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/,
      }, {
        test: /\.tsx?$/,
        // use: {
        //   loader: 'ts-loader'
        //   // loader:'ts-loader'
        // },
        use: [
          {
            loader: 'ts-loader'
          }
        ],
        exclude: /node_modules/,
      }, {
        test: /\.(png|jpg|gif|jpeg|svg)/,  //是匹配图片文件后缀名称
        use: [{
          loader: 'url-loader', //是指定使用的loader和loader的配置参数
          options: {
            limit: 500,  //是把小于500B的文件打成Base64的格式，写入JS
            outputPath: 'images/',
          }
        }]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: devMode ? '[name].[hash:8].js' : '[name].[chunkhash:8].js',       //数字8表示取hash标识符的前八位
    chunkFilename: devMode ? '[name].[hash:8].js' : '[name].[chunkhash:8].js',  //异步模块的文件输出名
  },
  optimization: {
    runtimeChunk: 'single',        //分离webpack运行时的引导代码
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};