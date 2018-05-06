<template>
  <div class="container is-fluid about-page">

    <!-- Twitelo links -->
    <section class="has-text-centered">
      <img class="twitelo-logo" src="~/static/logo.png"><br>
      <ul class="is-size-5">
        <li v-for="twiteloLink in twiteloLinks" :key="twiteloLink.name">
          <span>{{twiteloLink.name}}</span>
          <b-icon :pack="twiteloLink.pack" :icon="twiteloLink.icon" size="is-small" class="icon-link"></b-icon>
          <a :href="twiteloLink.url" class="about-link">{{twiteloLink.url}}</a>
        </li>
      </ul>
    </section>

    <!-- Contributors -->
    <section class="has-text-centered">
      <p class="is-size-3 has-text-weight-bold has-text-centered">{{$t('about.contributors')}}</p>
      <ul class="is-size-5">
        <li v-for="contributor in contributors" :key="contributor.username">
          <span class="has-text-weight-semibold">{{contributor.username}} </span>
          <span class="is-italic">- {{contributor.task[locale]}} -</span>
          <a v-for="link in contributor.links" :key="link.url" :href="link.url">
            <b-icon :pack="link.pack" :icon="link.icon" class="icon-link"></b-icon>
          </a>
        </li>
      </ul>
    </section>

    <!-- Statistics -->
    <section class="has-text-centered">
      <p class="is-size-3 has-text-weight-bold has-text-centered">{{$t('navbar.statistics')}}</p>
      <ul class="is-size-5">
        <li v-for="(stat, statIndex) in stats" :key="statIndex">
          <span class="has-text-weight-bold has-text-warning is-size-4">{{stat.nb}} </span>
          <span class="has-text-weight-light">{{stat.text[locale]}} </span>
          <span class="is-size-4" v-if="stat.bonus">|
            <span class="has-text-weight-bold has-text-warning is-size-4">{{stat.bonus.nb}} </span>
            <span class="has-text-weight-light is-size-5">{{stat.bonus.text[locale]}}</span>
          </span>
        </li>
        <nuxt-link to="/stats" class="button button-more-stats is-light">
          <b-icon icon="finance" size="is-small"></b-icon>
          <span>{{$t('about.more-stats')}}</span>
        </nuxt-link>
      </ul>
    </section>

    <!-- Changelog -->
    <section class="timeline is-centered">
      <p class="is-size-3 has-text-weight-bold has-text-centered">{{$t('about.changelog')}}</p>
      <div class="timeline-item">
        <div class="timeline-marker is-icon">
          <i class="fas fa-flag-checkered has-text-dark"></i>
        </div>
        <div class="timeline-content">
          <p class="heading">{{$t('about.timeline.whats-next')}}</p>
          <p v-html="$t('about.timeline.changes.whats-next')"></p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker is-icon">
          <i class="fas fa-pencil-alt has-text-dark"></i>
        </div>
        <div class="timeline-content">
          <p class="heading">{{$t('about.timeline.months.april')}} 2018</p>
          <p v-html="$t('about.timeline.changes.second-release')"></p>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-cyan">2018</span>
      </header>
      <div class="timeline-item">
        <div class="timeline-marker is-icon">
          <i class="fas fa-flask has-text-dark"></i>
        </div>
        <div class="timeline-content">
          <p class="heading">{{$t('about.timeline.months.march')}} 2017</p>
          <p v-html="$t('about.timeline.changes.first-release')"></p>
        </div>
      </div>
      <div class="timeline-header">
        <span class="tag is-medium is-cyan">Start</span>
      </div>
    </section>

    <br>

    <!-- About me -->
    <div class="about-me-container has-text-centered">
      <div class="about-me-banner">
        <img class="pp-preview no-select" src="/images/iFonny.png" onerror="/images/errors/default_profile.png">
      </div>
      <div class="about-me-content">
        <p class="is-size-4 has-text-white text-overflow-is-ellipsis has-text-weight-bold">{{$t('about.about-me')}}</p>
        <ul class="has-text-white-ter has-text-weight-light">
          <li v-for="iFonnyLink in iFonnyLinks" :key="iFonnyLink.name">
            <span v-html="iFonnyLink.name"></span>
            <b-icon :pack="iFonnyLink.pack" :icon="iFonnyLink.icon" size="is-small" class="icon-link"></b-icon>
            <a :href="iFonnyLink.url" class="about-link">{{iFonnyLink.url}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  head() {
    return {
      meta: [
        {
          hid: "description",
          name: "description",
          content: "More informations about Twitelo"
        }
      ]
    };
  },
  async asyncData({ app }) {
    let stats = [];

    try {
      stats = (await app.$axios.$get("/api/other/stats/min")).data;
    } catch (e) {
      stats = [];
    }

    return {
      stats,
      twiteloLinks: [
        {
          name: "Twitter",
          icon: "twitter",
          pack: "mdi",
          url: "https://twitter.com/TwiteloFR"
        },
        {
          name: "Github",
          icon: "github",
          pack: "fab",
          url: "https://discord.gg/F75CNy2"
        }
      ],
      contributors: [
        {
          username: "iFonny",
          task: {
            en: "Back-end / Front-end / Design",
            fr: "Back-end / Front-end / Design"
          },
          links: [
            {
              icon: "github",
              pack: "fab",
              url: "https://github.com/ifonny"
            },
            {
              icon: "twitter",
              pack: "mdi",
              url: "https://twitter.com/iFonny_"
            }
          ]
        },
        {
          username: "Equinox",
          task: {
            en: "Mental and visual assistance",
            fr: "Assistance mentale et visuelle"
          },
          links: [
            {
              icon: "github",
              pack: "fab",
              url: "https://github.com/Equinoxbig"
            }
          ]
        }
      ],
      iFonnyLinks: [
        {
          name: "Website",
          icon: "globe",
          pack: "fas",
          url: "https://ifonny.fr/"
        },
        {
          name: "Twitter",
          icon: "twitter",
          pack: "mdi",
          url: "https://twitter.com/iFonny_"
        },
        {
          name: "Github",
          icon: "github",
          pack: "fab",
          url: "https://github.com/ifonny"
        },
        {
          name: "Discord <a>iFonny#6666</a>",
          icon: "discord",
          pack: "fab",
          url: "https://discord.gg/6BzrEdP"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale
    })
  }
};
</script>


<style scoped>
.about-me-container {
  border: 1px solid rgb(26, 26, 26);
  box-shadow: 0px 4px 16px rgb(17, 17, 17);
}

.about-me-banner {
  line-height: 0;
  padding: 1rem;
  padding-bottom: 0;
  background-image: url("/banner.jpg");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.about-me-content {
  padding: 0.5rem;
  background-color: #363636;
}

.pp-preview {
  object-fit: cover;
  height: 100px;
  width: 100px;
}

.icon-link {
  margin-left: 0.5rem;
}

.container {
  margin: 0;
  padding: 0.5rem 3rem 1.5rem 3rem;
}
.about-page .twitelo-logo {
  height: 100px;
}
.about-page section {
  padding-top: 0.8rem;
}

.about-link {
  margin-left: 0.4rem;
}

.button-more-stats {
  margin-top: 0.7rem;
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0rem 0.5rem 1.5rem 0.5rem;
  }
}
</style>
