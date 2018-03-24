<template>
    <div class="hero-body twitelo-description">
        <div class="container has-text-centered">
            <a v-if="!$store.state.user.info" href="/auth/twitter" class="control align-vertical-center start-now-tags">
                <b-taglist class="is-hidden-mobile" attached>
                    <b-tag type="is-large is-info">
                        <b-icon icon="twitter" type="is-black"></b-icon>
                        <span class="has-text-black">{{$t('home.start-now')}}</span>
                    </b-tag>
                    <b-tag type="is-large is-warning">
                        <span>Beta</span>
                        <b-icon icon="flask" type="is-dark"></b-icon>
                    </b-tag>
                </b-taglist>
                <b-tag type="is-large is-twitter is-hidden-tablet">
                    <span>{{$t('home.start-now')}}</span>
                    <b-icon icon="twitter" type="is-dark"></b-icon>
                </b-tag>
            </a>
            <h1 class="title is-3 has-text-weight-light" v-html="$t('home.twitelo-description-l1')"> </h1>
            <h1 class="title is-5 has-text-weight-light" v-html="$t('home.twitelo-description-l2')"> </h1>
        </div>
    </div>
</template>

<script>
export default {};
</script>


<style scoped>

@media screen and (max-width: 768px) {
  .start-now-tags {
    padding-bottom: 2rem;
  }
}

.twitelo-description {
  padding-bottom: 2rem;
  padding-top: 2.5rem;
}

</style>
