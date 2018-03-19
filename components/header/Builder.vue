<template>

  <div class="navbar-item has-dropdown is-hoverable" :class="{ 'navbar-item-line-active': ($nuxt.$route.name && $nuxt.$route.name.match(/^builder*/) ? true : false )  }">
    <nuxt-link class="navbar-link" to="/builder/classic">
      <b-icon pack="fas" icon="paint-brush" type="is-light"></b-icon>
      <span class='menu-button'>{{$t('navbar.builder.builder')}}</span>
    </nuxt-link>
    <div class="navbar-dropdown navbar-dropdown-menu">
      <nuxt-link :to="'/builder/step-by-step'" class="navbar-item navbar-item-menu">
        {{$t('navbar.builder.step-by-step')}}
      </nuxt-link>
      <nuxt-link :to="'/builder/classic'" class="navbar-item navbar-item-menu">
        {{$t('navbar.builder.classic')}}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>


<style scoped>

</style>
