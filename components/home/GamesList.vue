<template>
    <div class="hero-head game-list-container">
        <div class="container has-text-centered">
            <h1 class="title is-3 has-text-weight-light"> {{$t('home.games-list')}} </h1>
            <div class="has-text-centered game-list">
                <img v-for="game in gamesList" :key="game.id" :src="'/api' + game.image" :alt="game.name" class="game-list-image no-select">
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: ["gamesList"]
};
</script>


<style scoped>
.game-list-container {
    margin: 1.5rem 0.5rem;
}
.game-list {
  margin-bottom: 1rem;
}

.game-list-image {
  max-height: 40px;
  max-width: 200px;
  margin: 0 0.5rem;
  cursor: pointer;
}
</style>
