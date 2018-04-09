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
      <div class="tile is-parent top-tile left-tile">
        <accounts />
      </div>
      <div class="tile is-parent is-7 top-tile right-tile">
        <user-tags />
      </div>
    </div>

    <div class="tile is-ancestor">
      <article class="tile is-parent bottom-tile">
        <profile-preview />
      </article>
    </div>

  </div>

</template>

<script>
import VueNotifications from "vue-notifications";

import InputBuilder from "~/components/builder/InputBuilder";
import GameSelect from "~/components/builder/GameSelect";
import GameTagsList from "~/components/builder/GameTagsList";
import Accounts from "~/components/builder/Accounts";
import UserTags from "~/components/builder/UserTags";
import ProfilePreview from "~/components/builder/ProfilePreview";

export default {
  middleware: "auth",
  components: {
    InputBuilder,
    GameSelect,
    GameTagsList,
    Accounts,
    UserTags,
    ProfilePreview
  },
  async asyncData({ app, error }) {
    try {
      await app.store.dispatch("builder/fetchBuilderData");
      await app.store.dispatch("builder/transformFromUUID");
      await app.store.dispatch("builder/updateTextCounters");
      await app.store.dispatch("builder/refreshPreview");
    } catch (e) {
      console.log(e);
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
.bottom-tile {
  padding-right: 0;
  padding-left: 0;
  padding-bottom: 0;
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
