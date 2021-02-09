// const path = require('path');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

// function getProdExternals() {
//   return {
//     axios: 'axios',
//     lodash: 'lodash',
//     vue: 'vue',
//     vuetify: 'vuetify',
//     moment: 'moment',
//     vuex: 'vuex',
//     'core-js': 'core-js'
//   };
// }

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config
      .plugin('speed-measure-webpack-plugin')
      .use(SpeedMeasurePlugin)
      .end()
  },
  configureWebpack: {
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      // alias: {
      //   /* Use vuetify from the app, not from fence-vue */
      //   vuetify: path.resolve(__dirname, 'node_modules/vuetify'),
      // },
    },
    // externals: process.env.NODE_ENV === 'production' ? getProdExternals() : {}
  }
}
