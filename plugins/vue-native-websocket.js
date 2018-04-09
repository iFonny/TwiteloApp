import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'
import config from '~/config/ws'

export default function ({
  store,
}) {
  Vue.use(VueNativeSock, `${config.ws}${config.host}`, {
    store: store,
    format: 'json',
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 2000, // (Number) how long to initially wait before attempting a new (1000)
  })
}
