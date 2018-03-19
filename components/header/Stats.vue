<template>
  <nuxt-link :to="'/stats'" class="navbar-item navbar-item-line" :class="{ 'navbar-item-line-active': ($nuxt.$route.name == 'stats' ? true : false )  }">
    <b-icon icon="finance"></b-icon>
    <span class='menu-button'>{{$t('navbar.stats')}}</span>
  </nuxt-link>
</template>

<script>
export default {};
</script>


<style>

</style>
