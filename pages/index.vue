<template>
  <div class="container is-fluid">
    <h1>HOME</h1>
    <div v-if="$store.state.user.info">
      Route : {{$nuxt.$route.name}} Hello {{ $store.state.user.info.username }}!
      
      <pre>I am the secret content, I am shown only when the use is connected.</pre>
      <p>
        <i>Langue : {{$t('locale')}}</i>
      </p>
      <button class="button badge" data-badge="8">Button</button>
      <div class="is-divider" data-content="OR"></div>
      <input class="slider is-fullwidth" step="1" min="0" max="100" value="50" type="range">

      <input class="slider is-fullwidth is-success" step="1" min="0" max="100" value="50" type="range">

      <input class="slider is-fullwidth is-warning" step="1" min="0" max="100" value="50" type="range">

      <input class="slider is-fullwidth is-danger" step="1" min="0" max="100" value="50" type="range">

      <input class="slider is-fullwidth is-info" step="1" min="0" max="100" value="50" type="range">

      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <div class="timeline is-centered">
        <header class="timeline-header">
          <span class="tag is-medium is-primary">Start</span>
        </header>
        <div class="timeline-item is-primary">
          <div class="timeline-marker is-primary"></div>
          <div class="timeline-content">
            <p class="heading">January 2016</p>
            <p>Timeline content - Can include any HTML element</p>
          </div>
        </div>
        <div class="timeline-item is-warning">
          <div class="timeline-marker is-warning is-image is-32x32">
            <img src="http://bulma.io/images/placeholders/32x32.png">
          </div>
          <div class="timeline-content">
            <p class="heading">February 2016</p>
            <p>Timeline content - Can include any HTML element</p>
          </div>
        </div>
        <header class="timeline-header">
          <span class="tag is-primary">2017</span>
        </header>
        <div class="timeline-item is-danger">
          <div class="timeline-marker is-danger is-icon">
            <i class="fa fa-flag"></i>
          </div>
          <div class="timeline-content">
            <p class="heading">March 2017</p>
            <p>Timeline content - Can include any HTML element</p>
          </div>
        </div>
        <header class="timeline-header">
          <span class="tag is-medium is-primary">End</span>
        </header>
      </div>

      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <pre>I am the secret content, I am shown only when the use is connected.</pre>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>

      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <pre>I am the secret content, I am shown only when the use is connected.</pre>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>

      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>
      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>

      <p>
        <i>You can also refresh this page, you'll still be connected!</i>
      </p>

      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
    }
  }
};
</script>

<style scoped>

</style>
