<template>
    <div class="container is-fluid">
        <div class="wip-title">Work In Progress</div>
        <br>
        <nuxt-link to="/" class="button button-back-home is-light">
            <span class="icon is-small">
                <i class="fas fa-home"></i>
            </span>
            <span>{{$t('error.back-home')}}</span>
        </nuxt-link>
    </div>
</template>

<script>
export default {
  middleware: "auth"
};
</script>


<style scoped>
.container {
  text-align: center;
  margin-top: 5rem;
}
.wip-title {
  font-weight: lighter;
  font-size: 2.5rem;
  text-align: center;
  font-family: "Neucha", "Avenir Next", Avenir, Helvetica, Arial, sans-serif;
  line-height: normal;
}

.button-back-home {
  margin: 1rem;
}
</style>
