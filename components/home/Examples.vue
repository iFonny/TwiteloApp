<template>
    <div>

        <div class="hero-head has-text-centered">
            <div class="container bio-example-container">
                <div class="bio-example-banner">
                    <img class="round-pp-preview no-select" src="/images/iFonny.jpg" onerror="/images/errors/default_profile.png">
                </div>
                <div class="bio-example-desc">
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
                        <span>http://speedrun.com/user/iFonny</span>
                    </p>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {};
</script>


<style scoped>
.bio-example-container {
  border: 1px solid rgb(26, 26, 26);
  box-shadow: 0px 4px 16px rgb(17, 17, 17);
}

.bio-example-banner {
  padding: 1rem;
  background-image: url("/banner.jpg");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.bio-example-desc {
  padding: 0.5rem;
  background-color: #363636;
}

@media screen and (max-width: 1023px) {
  .bio-example-container {
    border: 0;
  }
}

.bio-example-desc .title,
.bio-example-desc .subtitle {
  line-height: 1.5rem;
}

.bio-example-desc .tag {
  margin: 0 0.1rem;
}

.icon-bio-example {
  margin-right: 0.2rem;
}

.round-pp-preview {
  object-fit: cover;
  height: 100px;
  width: 100px;
  border-radius: 100%;
  border: 1px solid rgb(26, 26, 26);
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
</style>
