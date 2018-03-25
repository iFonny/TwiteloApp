<template>
    <div class="builder-page">

        <div class="tile is-ancestor">
            <div class="tile is-parent top-tile left-tile">
                <game-select />
            </div>

            <div class="tile is-parent is-7 top-tile right-tile">
                <input-builder />
            </div>
        </div>

        <!-- <hr class="dropdown-divider"> -->

        <div class="tile is-ancestor">
            <div class="tile is-parent left-tile">
                <article class="tile is-child notification is-dark">
                    <p class="title">Liste de tous les tags</p>
                    <p class="subtitle">dispo pour le jeu select</p>
                    <div class="content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>

                    </div>
                </article>
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

export default {
  middleware: "auth",
  components: {
    InputBuilder,
    GameSelect
  },
  async asyncData({ app }) {
    await app.store.dispatch("builder/fetchBuilderData").catch(e => {
      this.$store.dispatch("setError", e);
      this.showNotification({
        title: this.$store.state.error.statusCode.toString(),
        message: this.$store.state.error.message,
        type: "error",
        timeout: 5000
      });
    });

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
</style>
