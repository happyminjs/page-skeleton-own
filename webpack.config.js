const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const {SkeletonPlugin} = require('./skeleton')
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [ "@babel/preset-env", "@babel/preset-react"]
        }
      }],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new SkeletonPlugin({
      // 启动一个静态服务器，去显示dist目录里的页面
      staticDir: resolve(__dirname, 'dist'),
      port: '9000',
      origin: 'http://localhost:9000',
      device: 'iPhone 6', // 模拟设备
      defer: 3000, // 等待脚本执行时间
      button: {
        color: '#efefef',
      },
      image: {
        color: '#efefef'
      }
    })
  ],
  devServer: {
    // contentBase: resolve(__dirname, 'dist'),
  }
}
