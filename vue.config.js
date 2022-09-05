module.exports = {
  pwa: {
    name: process.env.VUE_APP_NAME,
    themeColor: '#4d1c32',
    msTileColor: '#021e2a',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    assetsVersion: '1.0.1',
    manifestOptions: {
      name: process.env.VUE_APP_NAME + ' - loVINyouforeFER',
      theme_color: '#4d1c32',
      background_color: '#021e2a'
    }
  }
};
