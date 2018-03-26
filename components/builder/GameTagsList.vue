<template>
  <article class="tile is-child has-text-centered game-tags-list">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header no-select">
        <div class="card-header-title">
          <h1 class="title is-size-6-tablet is-size-5-desktop is-size-5">{{$t('builder.select-game-tag')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">
        <div class="is-full-height" v-if="selectedGame">
          <div class="is-full-height" v-if="tagCreation">
            <button @click="cancelAddGameTag()" type="button" class="delete tag-creation-cancel"></button>
            <div class="is-full-height align-vertical-center">
              <div class="tag-creation-popup">
                <section class="has-text-left">
                  <b-field v-for="(setting, settingKey) in tagCreation.fieldSettings" :key="settingKey" grouped group-multiline expanded>
                    <p class="control">
                      <label class="label">
                        {{setting.label[locale]}}
                        <b-tooltip v-if="setting.tooltip" :label="setting.tooltip[locale]" type="is-light" position="is-right" size="is-small" multilined>
                          <b-icon pack="far" icon="question-circle" size="is-small" class="has-text-grey-light">
                          </b-icon>
                        </b-tooltip>
                      </label>
                    </p>
                    <!-- // TODO en fonction des types toussa toussa -->
                    <b-input expanded placeholder="Name" size="is-small"></b-input>
                    <!-- // TODO bouton next -> vers choisir ou mettre le tag -->
                  </b-field>

                </section>
              </div>
            </div>

          </div>
          <div v-else>
            <div v-for="(gameTags, gameCategory) in gameTagsCategory" :key="gameCategory" class="category-tags">
              <p>{{gameCategory}}</p>
              <b-field grouped group-multiline class="align-tags no-select">
                <div v-for="gameTag in gameTags" :key="gameTag.id" class="control">
                  <b-taglist attached @click.native="addGameTag(gameTag)" class="game-tag">
                    <b-tag class="game-tag-name" type="is-twitter">{{gameTag.name}}</b-tag>
                    <b-tag class="game-tag-add">
                      <b-icon icon="plus" size="is-small"></b-icon>
                    </b-tag>
                  </b-taglist>
                </div>
              </b-field>
            </div>
          </div>
        </div>
        <div v-else class="is-full-height no-selected-game">
          <p class="is-size-4 has-text-lightgreen">ADD LANG Please choose a game</p>
        </div>
      </div>
    </b-collapse>
  </article>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      tagCreation: null
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      selectedGame: state => state.builder.selectedGame,
      games: state => state.builder.games,
      gameTagsCategory: state => state.builder.gameTagsCategory
    })
  },
  methods: {
    addGameTag(gameTag) {
      this.tagCreation = gameTag;
    },
    cancelAddGameTag(gameTag) {
      this.tagCreation = null;
    }
  }
};
</script>


<style scoped>
.align-tags {
  display: flex;
  justify-content: center !important;
}
.game-tag-add {
  background-color: #77e49c;
  color: #363636;
}
.game-tag-name,
.game-tag-add {
  cursor: pointer;
  margin: 0;
}
.category-tags {
  margin-top: 0.2rem;
  margin-bottom: 0.5rem;
}
.no-selected-game {
  display: flex;
  justify-content: center;
  align-items: center;
}
.is-full-height {
  height: 100%;
}
.tag-creation-popup {
  border-radius: 3px;
  padding: 1rem 3.3rem 1rem 0.7rem;
  position: relative;
  width: 100%;
}
.delete.tag-creation-cancel {
  position: absolute;
  right: 0.5rem !important;
  top: 3.5rem !important;
  height: 35px !important;
  width: 35px !important;
  max-height: 35px !important;
  max-width: 35px !important;
  min-height: 35px !important;
  min-width: 35px !important;
  z-index: 1;
}
.game-tag:hover {
  -webkit-filter: drop-shadow(0px 0px 1px #ecde5d);
  filter: drop-shadow(0px 0px 1px #ecde5d);
}
</style>

<style>
.game-tags-list .card {
  height: 86%;
}
.game-tags-list .collapse-content {
  height: 100%;
}
.game-tags-list .card-content {
  height: 100%;
  padding: 0.1rem;
}
</style>

