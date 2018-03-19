<template>
  <nuxt-link :to="'/donate'" class="navbar-item navbar-item-line" :class="{ 'navbar-item-line-active': ($nuxt.$route.name == 'donate' ? true : false )  }">
    <b-icon pack="fab" icon="bitcoin" type="is-warning"></b-icon>
    <span class='menu-button'>{{$t('navbar.donate')}}</span>
  </nuxt-link>
</template>

<script>
export default {};
</script>


<style scoped>

</style>
