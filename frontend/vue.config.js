module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://52.79.169.66:3000/',
          changeOrigin: true, 
          ws: true
        } 
      } 
    },
    outputDir: '../backend/public'
}