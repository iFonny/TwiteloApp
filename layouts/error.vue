<template>
  <div class="container">
    <div v-if="parseInt(error.statusCode, 10)" class="page-error-code">{{error.statusCode}}</div>
    <div v-if="error.statusCode == 404" class="page-error-message">{{$t('error.page-not-found')}}</div>
    <div v-else-if="error.statusCode == 403" class="page-error-message">{{$t('error.forbidden')}}</div>
    <div v-else-if="error.statusCode == 500" class="page-error-message">{{$t('error.internal-server-error')}}</div>
    <div v-else-if="error.statusCode == 503" class="page-error-message">{{$t('error.service-unavailable')}}</div>
    <div v-else-if="error.statusCode == 504" class="page-error-message">{{$t('error.gateway-time-out')}}</div>
    <div v-else class="page-error-message">{{$t('error.unknown-error')}}</div>
    <br>
    <nuxt-link to="/" class="button is-light">
      <span class="icon is-small">
        <i class="fas fa-home"></i>
      </span>
      <span>{{$t('error.back-home')}}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: ["error"]
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 2rem;
}
.page-error-code {
  font-weight: bolder;
  font-size: 8rem;
  text-align: center;
  font-family: "Neucha", "Avenir Next", Avenir, Helvetica, Arial, sans-serif;
  line-height: normal;
}
.page-error-message {
  font-size: 1.5rem;
  text-align: center;
  font-family: "Neucha", "Avenir Next", Avenir, Helvetica, Arial, sans-serif;
}
</style>
