module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://map.217dan.com/addons/cesiummapv', // 跨域目标主机，自行修改
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // 重写地址
        },
      },
      '/map_asset': {
        target: 'http://map.217dan.com/assets/map', // 跨域目标主机，自行修改
        changeOrigin: true,
        pathRewrite: {
          '^/map_asset': '', // 重写地址
        },
      },
      '/marsgis': {
        target: 'http://data.marsgis.cn', // 跨域目标主机，自行修改
        changeOrigin: true,
        pathRewrite: {
          '^/marsgis': '', // 重写地址
        },
      },
    },
  },
}
