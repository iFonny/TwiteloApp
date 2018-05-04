<template>
  <div class="container is-fluid about-page">

    <section class="has-text-centered">
      <img class="twitelo-logo" src="~/static/logo.png"><br>

      <ul class="is-size-5">
        <li>
          <span>Twitter</span>
          <b-icon icon="twitter" size="is-small" class="icon-link"></b-icon>
          <a class="about-link">https://twitter.com/twiteloFR</a>
        </li>
        <li>
          <span>Discord</span>
          <b-icon pack="fab" icon="discord" size="is-small" class="icon-link"></b-icon>
          <a class="about-link">http://discord.gg/F75CNy2</a>
        </li>
      </ul>
    </section>

    <section class="has-text-centered">
      <p class="is-size-3 has-text-weight-bold has-text-centered">{{$t('about.contributors')}}</p>
      <ul class="is-size-5">
        <li>
          <span class="is-italic">{{$t('about.contrib.back-front-design')}}
            <span class="has-text-weight-semibold">iFonny</span>
          </span>
          <a>
            <b-icon pack="fab" icon="github" class="icon-link"></b-icon>
          </a>
          <a class="about-link">
            <b-icon icon="twitter"></b-icon>
          </a>
        </li>
        <li>
          <span class="is-italic">{{$t('about.contrib.mental-assistance')}}
            <span class="has-text-weight-semibold">Equinox</span>
          </span>
          <a>
            <b-icon pack="fab" icon="github" class="icon-link"></b-icon>
          </a>
        </li>
      </ul>
    </section>

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

    <div class="about-me-container has-text-centered">
      <div class="about-me-banner">
        <img class="pp-preview no-select" src="/images/iFonny.png" onerror="/images/errors/default_profile.png">
      </div>
      <div class="about-me-content">
        <p class="is-size-4 has-text-white text-overflow-is-ellipsis has-text-weight-bold">{{$t('about.about-me')}}</p>
        <ul class="has-text-white-ter has-text-weight-light">
          <li>
            <span>Website</span>
            <b-icon pack="fas" icon="globe" size="is-small" class="icon-link"></b-icon>
            <a class="about-link">https://ifonny.fr/</a>
          </li>
          <li>
            <span>Twitter</span>
            <b-icon icon="twitter" size="is-small" class="icon-link"></b-icon>
            <a class="about-link">https://twitter.com/iFonny_</a>
          </li>
          <li>
            <span>Github</span>
            <b-icon pack="fab" icon="github" size="is-small" class="icon-link"></b-icon>
            <a class="about-link">https://github.com/ifonny</a>
          </li>
          <li>
            <span>Discord</span>
            <b-icon pack="fab" icon="discord" size="is-small" class="icon-link"></b-icon>
            <a class="about-link">http://discord.gg/6BzrEdP</a>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script>
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
  padding: 1.5rem 3rem 1.5rem 3rem;
}
.about-page .twitelo-logo {
  height: 100px;
}
.about-page .timeline {
  padding-top: 0.5rem;
}

.about-link {
  margin-left: 0.4rem;
}
@media screen and (max-width: 768px) {
  .container {
    padding: 1.5rem 0.5rem 1.5rem 0.5rem;
  }
}
</style>
