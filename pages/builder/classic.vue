<template>
    <div class="builder-page">

        <div class="tile is-ancestor">
            <div class="tile is-parent top-tile">
                <game-select />
            </div>
        </div>

        <div class="tile is-ancestor">
            <div class="tile is-parent top-tile left-tile">
                <game-tags-list />
            </div>

            <div class="tile is-parent is-7 top-tile right-tile">
                <input-builder />
            </div>
        </div>

        <!-- <hr class="dropdown-divider"> -->

        <div class="tile is-ancestor">
            <div class="tile is-parent left-tile">

            </div>
            <div class="tile is-parent is-7 right-tile">
                <article class="tile is-child notification is-dark">
                    <p class="title">Liste des tags ajoutés</p>
                    <p class="subtitle">2 onglets: tags ajoutés (settings des tags) et comptes (gerer ses comptes)</p>
                    <div class="content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                    </div>
                </article>
            </div>
        </div>

        <div class="tile is-ancestor">
            <article class="tile is-child notification is-dark">
                <p class="title">Preview</p>
                <p class="subtitle">Preview et boutons pour save, history etc...</p>
                <div class="content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                </div>
            </article>
        </div>

    </div>

</template>

<script>
import VueNotifications from "vue-notifications";

import InputBuilder from "~/components/builder/InputBuilder";
import GameSelect from "~/components/builder/GameSelect";
import GameTagsList from "~/components/builder/GameTagsList";

export default {
  middleware: "auth",
  components: {
    InputBuilder,
    GameSelect,
    GameTagsList
  },
  async asyncData({ app, error }) {
    try {
      await app.store.dispatch("builder/fetchBuilderData");
      await app.store.dispatch("builder/transformFromUUID");
    } catch (e) {
      app.store.dispatch("setError", e);
      error(app.store.state.error);
    }

    return {};
  },
  notifications: {
    showNotification: {
      type: VueNotifications.types.success,
      title: "Default",
      message: "That's the success!"
    }
  }
};
</script>


<style scoped>
.top-tile {
  padding-bottom: 0;
}
.right-tile {
  padding-left: 0.35rem;
}
.left-tile {
  padding-right: 0.35rem;
}
.builder-page {
  margin-top: 0.5rem;
  padding: 0.7rem;
}
@media screen and (max-width: 768px) {
  .right-tile {
    padding-left: 0.75rem;
  }
  .left-tile {
    padding-right: 0.75rem;
  }
}
</style>
