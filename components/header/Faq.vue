<template>
  <nuxt-link :to="'/faq'" class="navbar-item navbar-item-line" :class="{ 'navbar-item-line-active': ($nuxt.$route.name == 'faq' ? true : false )  }">
    <b-icon pack="far" icon="question-circle" type="is-lightblue"></b-icon>
    <span class='menu-button'>{{$t('navbar.faq')}}</span>
  </nuxt-link>
</template>

<script>
export default {};
</script>


<style scoped>

</style>
