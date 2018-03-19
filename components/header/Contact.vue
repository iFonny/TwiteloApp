<template>
  <nuxt-link :to="'/contact'" class="navbar-item navbar-item-line" :class="{ 'navbar-item-line-active': ($nuxt.$route.name == 'contact' ? true : false )  }">
    <b-icon pack="fas" icon="envelope"></b-icon>
    <span class='menu-button'>{{$t('navbar.user.contact')}}</span>
  </nuxt-link>
</template>

<script>
export default {};
</script>


<style scoped>

</style>
