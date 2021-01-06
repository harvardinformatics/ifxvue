const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

function getProdExternals() {
  return {
    axios: 'axios',
    lodash: 'lodash',
    vue: 'vue',
    vuetify: 'vuetify',
    moment: 'moment',
    vuex: 'vuex',
    'core-js': 'core-js'
  };
}

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
      extensions: ['*', '.js', '.vue', '.json']
    },
    externals: process.env.NODE_ENV === 'production' ? getProdExternals() : {}
  }
}
