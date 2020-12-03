const path = require('path')

module.exports = {
  publicPath: process.env.VUE_APP_BASEURL,
  // 生产环境sourceMap
  productionSourceMap: false,
  devServer: {
    hot: true,
    open: true,
    port: 3000
    // proxy: {
    //   '/api': {
    //     target: `${process.env.VUE_APP_API}:${process.env.VUE_APP_API_PORT}/`, //API服务器的地址
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  transpileDependencies: [
    /\/node_modules\/vuetify\//,
    /\/node_modules\/vue-echarts\//,
    /\/node_modules\/resize-detector\//
  ],
  configureWebpack: config => {
    config.resolve = {
      alias: {
        '@': path.resolve(__dirname, 'src'),

        // Vuely alias
        Api: path.resolve(__dirname, 'src/api/'),
        Components: path.resolve(__dirname, 'src/components/'),
        Views: path.resolve(__dirname, 'src/views/'),
        Common: path.resolve(__dirname, 'src/pages/ims/common'),
        Ims: path.resolve(__dirname, 'src/pages/ims')
      },
      extensions: ['*', '.js', '.vue', '.json']
    }
    // config.entry.app = ['babel-polyfill', './src/main.js']
  }
}
