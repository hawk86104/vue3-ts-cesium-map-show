module.exports = {
  indexPath: '../../../../../addons/cesiummapv/view/index/vue3.html', // bulid发布后，首页html位置
  // publicPath: '/assets/addons/cesiummapv/vue3/', // 基本路径 http://map.217dan.com/assets/addons/cesiummapv/vue3/
  // outputDir: '../../../public/assets/addons/cesiummapv/vue3', // bulid发布后，资源的导出目录
  // assetsDir: '../../../../assets/addons/cesiummapv/vue3/',		// 静态资源目录 ../../../../assets/addons/cesiummapv/vue3/
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
        target: 'http://myhome.217dan.com:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/map_asset': '',
        },
      },
    },
  },
}
