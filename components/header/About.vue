<template>
  <nuxt-link :to="'/about'" class="navbar-item navbar-item-line" :class="{ 'navbar-item-line-active': ($nuxt.$route.name == 'about' ? true : false )  }">
    <b-icon pack="fas" icon="info-circle"></b-icon>
    <span class='menu-button'>{{$t('navbar.user.about')}}</span>
  </nuxt-link>
</template>

<script>
export default {};
</script>


<style scoped>

</style>
