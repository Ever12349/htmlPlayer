
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

module.exports = {
  publicPath: IS_PROD ? './' : '/', // 默认'/'，部署应用包时的基本 URL
  lintOnSave: false,
  filenameHashing: !IS_PROD,
  productionSourceMap: false,
  outputDir: 'docs',

  configureWebpack(config) {
    if (IS_PROD) {
      config.externals = {
        vue: "Vue",
        // "element-ui": "ELEMENT",
        "vue-router": "VueRouter",
        vuex: "Vuex",
      }
    }
  },

  chainWebpack(config) {
    if (IS_PROD) {
      const cdn = {
        // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
        css: [
        ],
        js: [
          "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
          "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.3/vue-router.min.js",
          "https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.2/vuex.min.js",
        ]
      };

      // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
      config.plugin("html").tap(args => {
        // html中添加cdn
        // console.log(args, 'args')
        args[0].cdn = cdn;
        args[0].is_prod = IS_PROD;
        return args;
      });

    }
    return config
  },

  css: {
    extract: false,
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': []
      }
    },
    modules: true
  },

  assetsDir: 'static'
}
