function getProdExternals() {
  return {
    axios: 'axios',
    lodash: 'lodash',
    vue: 'Vue',
    vuetify: 'vuetify',
    moment: 'moment',
    vuex: 'vuex',
    'core-js': 'core-js'
  };
}

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['*', '.js', '.vue', '.json']
    },
    externals: process.env.NODE_ENV === 'production' ? getProdExternals() : {}
  }
}
