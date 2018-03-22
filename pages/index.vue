<template>
  <div class="has-footer">
    <section class="hero">
      <div class="hero-body twitelo-description">
        <div class="container has-text-centered">
          <a v-if="!$store.state.user.info" href="/auth/twitter" class="control align-vertical-center start-now-tags">
            <b-taglist class="is-hidden-mobile" attached>
              <b-tag type="is-large is-twitter">
                <b-icon icon="twitter" type="is-dark"></b-icon>
                <span>{{$t('home.start-now')}}</span>
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

      <examples />

      <games-list :games-list="gamesList" />

    </section>

    <footer class="footer is-fixed-bottom has-text-centered">
      <p class="sub-title is-6 has-text-weight-light">{{$t('home.latest-users')}}</p>
      <div>
        <a class="is-hidden-mobile no-select" v-for="(user) in latestUsers.slice(0,10)" :key='user.username' :href="'http://twitter.com/' + user.username">
          <img :src="user.pp" onerror="/images/errors/default_profile.png" class="round-pp-user-footer no-select">
        </a>
      </div>
      <div>
        <a class="is-hidden-tablet no-select" v-for="user in latestUsers.slice(0,5)" :key='user.username' :href="'http://twitter.com/' + user.username">
          <img :src="user.pp" onerror="/images/errors/default_profile.png" class="round-pp-user-footer no-select">
        </a>
      </div>
      <p class="sub-title is-8 has-text-weight-light">
        <b>Twitelo</b> by
        <a>iFonny</a>
        <a class="icon-footer-github">
          <b-icon icon="github" pack="fab" size="is-small"></b-icon>
        </a>
        <a class="icon-footer-twitter">
          <b-icon icon="twitter" size="is-small"></b-icon>
        </a>-
        <a>{{$t('home.more-informations')}}</a>
      </p>
    </footer>
  </div>
</template>

<script>
import Examples from "~/components/home/Examples";
import GamesList from "~/components/home/GamesList";

export default {
  components: {
    Examples,
    GamesList
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
    }
  },
  data() {
    return {
      gamesList: [
        {
          icon: "/public/images/game/lol/icon.png",
          id: "lol",
          image: "/public/images/game/lol/image.png",
          name: "League Of Legends",
          small_name: "LoL"
        },
        {
          icon: "/public/images/game/speedrun/icon.png",
          id: "speedrun",
          image: "/public/images/game/speedrun/image.png",
          name: "Speedrun.com",
          small_name: "Speedrun"
        }
      ],
      latestUsers: [
        {
          username: "iFonny_",
          pp:
            "http://pbs.twimg.com/profile_images/963649016004272129/VhbWWXT__normal.jpg" // TODO: remplacer '_400x400' par '_normal' server-side
        }
      ]
    };
  }
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
.footer .icon-footer-twitter {
  margin-right: 4px;
  margin-left: 2px;
}

a:hover {
  color: #81d29d;
}

@media screen and (max-width: 768px) {
  .start-now-tags {
    padding-bottom: 2rem;
  }
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

.has-footer {
  padding-bottom: 6rem;
}

.twitelo-description {
  padding-bottom: 2rem;
  padding-top: 2.5rem;
}
</style>
