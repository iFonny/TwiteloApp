<template>
    <footer class="footer is-fixed-bottom has-text-centered">

        <p class="sub-title is-6 has-text-weight-light">{{$t('home.latest-users')}}</p>
        <div>
            <a class="is-hidden-mobile no-select" v-for="(user) in latestUsers.slice(0,10)" :key='user.username' target="_blank" :href="'https://twitter.com/' + user.username">
                <img :src="user.profile_image_url" onerror="/images/errors/default_profile.png" :alt="user.name" class="round-pp-user-footer no-select">
            </a>
        </div>
        <div>
            <a class="is-hidden-tablet no-select" v-for="user in latestUsers.slice(0,5)" :key='user.username' target="_blank" :href="'https://twitter.com/' + user.username">
                <img :src="user.profile_image_url" onerror="/images/errors/default_profile.png" :alt="user.name" class="round-pp-user-footer no-select">
            </a>
        </div>
        <p class="sub-title is-8 has-text-weight-light">
            <b>Twitelo</b> by
            <a target="_blank" href="https://ifonny.fr/home">iFonny</a>
            <a target="_blank" href="https://github.com/iFonny" class="icon-footer-github">
                <b-icon icon="github" pack="fab" size="is-small"></b-icon>
            </a>
            <a target="_blank" href="https://discord.gg/F75CNy2" class="icon-footer-discord">
                <b-icon icon="discord" size="is-small"></b-icon>
            </a>
            <a target="_blank" href="https://twitter.com/iFonny_" class="icon-footer-twitter">
                <b-icon icon="twitter" size="is-small"></b-icon>
            </a>
            -
            <nuxt-link :to="'/about'">{{$t('home.more-informations')}}</nuxt-link>
        </p>
    </footer>
</template>

<script>
export default {
  props: ["latestUsers"]
};
</script>


<style scoped>
.footer {
  letter-spacing: 1px;
  background-color: #363636fa;
  padding-top: 0;
  padding-bottom: 0;
  height: 6rem;
}

.footer .icon-footer-github {
  margin-left: 4px;
  margin-right: 2px;
}
.footer .icon-footer-discord {
  margin-right: 2px;
  margin-left: 2px;
}
.footer .icon-footer-twitter {
  margin-right: 4px;
  margin-left: 2px;
}

a:hover {
  color: #81d29d;
}

.round-pp-user-footer {
  object-fit: cover;
  height: 40px;
  width: 40px;
  border-radius: 100%;
  border: 1px solid white;
  cursor: pointer;
  margin: 0 0.2rem;
}
</style>
