import Vue from 'vue'
import VueNotifications from 'vue-notifications'
import iziToast from 'izitoast' // https://github.com/dolce/iziToast
import 'izitoast/dist/css/iziToast.min.css'

function toast({
  title,
  message,
  type,
  timeout,
  cb
}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return iziToast[type]({
    title,
    message,
    timeout,
    position: "topCenter"
  })
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)
