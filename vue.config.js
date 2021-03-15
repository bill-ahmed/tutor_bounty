module.exports = {
    /** Config for dev env */
    devServer: {
        /**
         * Proxy API requests to different port.
         * 
         * @see https://cli.vuejs.org/config/#devserver-proxy
         */
        proxy: {
            '^/api': {
              target: 'http://127.0.0.1:3000',
              changeOrigin: true
            },
            '^/peerjs': {
              target: 'http://127.0.0.1:3000',
              ws: true,
              changeOrigin: true
            }
        }
    },

    transpileDependencies: [
      'vuetify'
    ]
}
