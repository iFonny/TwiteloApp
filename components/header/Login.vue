<template>
  <a href="/auth/twitter" class="navbar-item navbar-item-line">
    <span class='login-button'>{{$t('navbar.login-with-twitter')}}</span>
    <b-icon icon="twitter" type="is-info"></b-icon>
  </a>
</template>

<script>
export default {};
</script>


<style scoped>
.login-button {
  margin-right: 5px;
}
</style>
