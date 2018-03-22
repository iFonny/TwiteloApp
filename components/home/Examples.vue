<template>
    <div>
        <div class="hero-head has-text-centered bio-example">
            <div class="container">
                <h1 class="has-text-weight-light">{{$t('home.example')}}</h1>
                <article class="media align-vertical-center">
                    <a class="media-left no-select has-text-centered is-hidden-mobile">
                        <img class="round-pp-preview no-select" :src="$store.state.user.info ? $store.state.user.info.profile_image_url : '/images/iFonny.jpg'" onerror="/images/errors/default_profile.png">
                        <p class="title has-text-centered">{{$t('home.preview')}}</p>
                    </a>
                    <div class="media-content">
                        <img src="/images/iFonny.jpg" onerror="/images/errors/default_profile.png" class="is-hidden-tablet round-pp-preview-mobile no-select" />
                        <p class="title is-4 has-text-white text-overflow-is-ellipsis">Joris -
                            <b-tag type="is-cyan">iFonny</b-tag>
                        </p>
                        <p class="subtitle is-5 has-text-white-ter has-text-weight-light is-italic">
                            {{$t('home.description-example.l1')}}
                            <br>{{$t('home.description-example.l2')}}
                            <b-tag type="is-cyan">Diamond</b-tag>
                            <b-tag type="is-cyan">IV</b-tag>
                            <b-tag type="is-cyan">86 LP</b-tag>{{$t('home.description-example.l3')}}
                            <br> Speedrun
                            <b-tag type="is-cyan">Super Mario Odyssey</b-tag>
                            <b-tag type="is-cyan">Any%</b-tag>{{$t('home.description-example.l4')}}</p>
                        <p class="title is-6 has-text-grey-lighter text-overflow-is-ellipsis">
                            <b-icon icon="map-marker" size="is-small" class="icon-bio-example"></b-icon>
                            <span>PB :
                                <b-tag type="is-cyan">1h 05m 37s</b-tag> -
                                <b-tag type="is-cyan">12th</b-tag>
                            </span>
                        </p>
                        <p class="subtitle is-6 has-text-info text-overflow-is-ellipsis">
                            <b-icon pack="fas" icon="link" size="is-small" class="icon-bio-example"></b-icon>
                            <span>https://www.speedrun.com/user/</span>
                            <b-tag type="is-cyan" size="is-small">iFonny</b-tag>
                        </p>

                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>


<style scoped>
.bio-example {
  padding: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgb(219, 219, 219);
  border-bottom: 1px solid rgb(219, 219, 219);
  background-color: #1c293796;
}
.bio-example .media-left {
  padding: 0.5rem;
}
.bio-example .media-content {
  overflow: unset;
  flex-grow: 0;
  padding: 0 1rem;
}

.bio-example .media-content .tag {
  margin: 0 0.1rem;
}
.bio-example .media-content .title,
.bio-example .media-content .subtitle {
  padding-bottom: 0.2rem;
}

.icon-bio-example {
  margin-right: 0.2rem;
}

.round-pp-preview {
  object-fit: cover;
  height: 100px;
  width: 100px;
  border-radius: 100%;
  border: 1px solid white;
  cursor: pointer;
}

.round-pp-preview-mobile {
  object-fit: cover;
  height: 50px;
  width: 50px;
  border-radius: 100%;
  border: 1px solid white;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .media-content {
    text-align: center;
  }
}
</style>
