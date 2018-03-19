<template>
  <nuxt-link :to="'/settings'" class="navbar-item navbar-item-line" :class="{ 'navbar-item-line-active': ($nuxt.$route.name == 'settings' ? true : false )  }">
    <b-icon pack="fas" icon="cog" :custom-class="$nuxt.$route.name == 'settings' ? 'fa-spin' : ''"></b-icon>
  </nuxt-link>
</template>

<script>
export default {};
</script>


<style scoped>

</style>
