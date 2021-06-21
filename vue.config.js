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
    },
  },
}
