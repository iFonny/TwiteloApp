<template>
  <nuxt-link :to="'/'" class="navbar-item navbar-item-line logo-twitelo" :class="{ 'navbar-item-line-active': ($nuxt.$route.name == 'index' ? true : false )  }">
    <img id="menu-logo" src="~/static/logo.png">
    <span class='home-button has-text-weight-bold is-uppercase is-hidden-mobile'>Twitelo</span>
  </nuxt-link>
</template>

<script>
export default {};
</script>


<style scoped>
.logo-twitelo {
  margin-left: auto;
}
.home-button {
  margin-left: 5px;
}
</style>
