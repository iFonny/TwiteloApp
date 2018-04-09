<template>
    <div class="container is-fluid">
        <div class="page-error-title">{{$t('error.login-error-title')}}</div>
        <br>
        <div class="page-error-message">{{$t('error.login-error-text')}}</div>
        <br>
        <a href="/auth/twitter" class="button button-error-login is-light">
            <span class="icon is-small">
                <i class="fab fa-twitter"></i>
            </span>
            <span>{{$t('navbar.login-with-twitter')}}</span>
        </a>
        <nuxt-link to="/" class="button button-error-login is-light">
            <span class="icon is-small">
                <i class="fas fa-home"></i>
            </span>
            <span>{{$t('error.back-home')}}</span>
        </nuxt-link>
    </div>
</template>

<script>
export default {
  head() {
    return {
      titleTemplate: "Error - Twitelo"
    };
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 2rem;
}
.page-error-title {
  font-weight: bolder;
  font-size: 2.5rem;
  text-align: center;
  font-family: "Neucha", "Avenir Next", Avenir, Helvetica, Arial, sans-serif;
  line-height: normal;
}
.page-error-message {
  font-size: 1.3rem;
  text-align: center;
  font-family: "Neucha", "Avenir Next", Avenir, Helvetica, Arial, sans-serif;
}

.button-error-login {
  margin: 1rem;
}
</style>
