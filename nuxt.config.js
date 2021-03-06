module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      class: 'has-navbar-fixed-top',
    },
    titleTemplate: 'Twitelo',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Link your twitter account and your favorite online games! Display your ranks, stats, and more in your twitter profile. Updated automatically!'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Twitelo'
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://twitelo.me'
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://twitelo.me/logo.png'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Twitelo - Link your twitter account and your favorite online games! Display your ranks, stats, and more in your twitter profile. Updated automatically!'
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Rubik'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://use.fontawesome.com/releases/v5.0.6/css/all.css'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css'
      }
    ],
    script: []
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#167df0'
  },
  /*
   ** Modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/google-analytics'
  ],

  'google-analytics': {
    id: 'UA-115012125-1'
  },

  axios: {
    debug: false,
    proxy: true
  },

  /*
   ** Build configuration
   */
  build: {

    vendor: ['axios', 'lodash', 'moment', 'vue-i18n', 'vue-notifications'],

    /*
     ** Run ESLint on save
     */
    extend(config, {
      isDev,
      isClient
    }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    }
  },


  plugins: [
    '~plugins/buefy',
    '~/plugins/i18n.js',
    {
      src: '~/plugins/vue-notifications',
      ssr: false
    },
    {
      src: '~/plugins/vue-native-websocket',
      ssr: false
    },
    {
      src: '~plugins/ga.js',
      ssr: false
    }
  ],
}
