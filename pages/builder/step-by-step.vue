<template>
  <div class="container is-fluid step-by-step">

    <div class="steps">
      <div class="step-item is-light" :class="isStep(1)">
        <div class="step-marker">1</div>
        <div class="step-details">
          <p class="step-title" :class="isStepSize(1, 'title')">{{$t('builder.step-by-step.game-account-title')}}</p>
          <p :class="isStepSize(1, 'desc')">{{$t('builder.step-by-step.game-account-desc1')}}</p>
          <p :class="isStepSize(1, 'desc')">{{$t('builder.step-by-step.game-account-desc2')}}</p>
        </div>
      </div>
      <div class="step-item is-light" :class="isStep(2)">
        <div class="step-marker">2</div>
        <div class="step-details">
          <p class="step-title" :class="isStepSize(2, 'title')">{{$t('builder.step-by-step.data-title')}}</p>
          <p :class="isStepSize(2, 'desc')">{{$t('builder.step-by-step.data-desc')}}</p>
        </div>
      </div>
      <div class="step-item is-light" :class="isStep(3)">
        <div class="step-marker">3</div>
        <div class="step-details">
          <p class="step-title" :class="isStepSize(3, 'title')">{{$t('builder.step-by-step.edit-title')}}</p>
          <p :class="isStepSize(3, 'desc')">{{$t('builder.step-by-step.edit-desc')}}</p>
        </div>
      </div>
      <div class="step-item is-light" :class="isStep(4)">
        <div class="step-marker">
          <span class="icon">
            <i class="fa fa-flag"></i>
          </span>
        </div>
        <div class="step-details">
          <p class="step-title" :class="isStepSize(4, 'title')">{{$t('builder.step-by-step.preview-title')}}</p>
          <p :class="isStepSize(4, 'desc')">{{$t('builder.step-by-step.preview-desc')}}</p>
        </div>
      </div>
      <div class="steps-content">

        <!-- PREV/TUTO/NEXT BUTTON -->
        <div class="steps-actions columns is-gapless is-mobile">
          <button :disabled="step <= 1" @click="previousStep" class="column button is-dark is-medium align-vertical-center">
            <span class="is-size-6-mobile">{{$t('builder.step-by-step.previous-step')}}</span>
          </button>
          <button @click="toggleHelp()" class="column is-2 button is-darker is-medium align-vertical-center">
            <span v-if="!help" class="is-size-6-mobile">{{$t('builder.help')}}</span>
            <b-icon v-else pack="fas" icon="times-circle"></b-icon>
          </button>
          <button :disabled="step >= 4" @click="nextStep" class="column button is-dark is-medium align-vertical-center">
            <span class="is-size-6-mobile">{{$t('builder.step-by-step.next-step')}}</span>
          </button>
        </div>

        <div class="step-content has-text-centered" :class="showStepContent(1)">
          <div v-if="!help">
            <game-select />
            <accounts />
          </div>
          <select-game-account-help v-else />
        </div>

        <div class="step-content has-text-centered" :class="showStepContent(2)">
          <game-tags-list v-if="!help" />
          <select-tags-help v-else />
        </div>

        <div class="step-content has-text-centered" :class="showStepContent(3)">
          <div v-if="!help">
            <input-builder />
            <user-tags />
          </div>
          <edit-profile-help v-else />
        </div>

        <div class="step-content has-text-centered" :class="showStepContent(4)">
          <profile-preview v-if="!help" />
          <preview-help v-else/>
        </div>
      </div>

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

import SelectGameAccountHelp from "~/components/builder/stepByStep/SelectGameAccountHelp";
import SelectTagsHelp from "~/components/builder/stepByStep/SelectTagsHelp";
import EditProfileHelp from "~/components/builder/stepByStep/EditProfileHelp";
import PreviewHelp from "~/components/builder/stepByStep/PreviewHelp";

export default {
  head() {
    return {
      titleTemplate: "Builder - Twitelo"
    };
  },
  components: {
    InputBuilder,
    GameSelect,
    GameTagsList,
    Accounts,
    UserTags,
    ProfilePreview,
    SelectGameAccountHelp,
    SelectTagsHelp,
    EditProfileHelp,
    PreviewHelp
  },
  middleware: "auth",
  async asyncData({ app, error }) {
    try {
      if (Object.keys(app.store.state.builder.games).length <= 0) {
        await app.store.dispatch("builder/fetchBuilderData");
        await app.store.dispatch("builder/transformFromUUID");
        await app.store.dispatch("builder/updateTextCounters");
        await app.store.dispatch("builder/refreshPreview");
      }
    } catch (e) {
      console.error(e);
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
  },
  data() {
    return {
      step: 1,
      help: false
    };
  },
  methods: {
    toggleHelp() {
      this.help = !this.help;
    },
    isStep(nb) {
      let classContent = "";
      if (nb == this.step) classContent += "is-active ";
      if (nb < this.step) classContent += "is-completed";
      return classContent;
    },
    isStepSize(nb, type) {
      if (type == "title" && nb == this.step)
        return "is-size-4 has-text-lightgreen";
      else if (type == "title" && nb != this.step) return "is-size-6";
      if (type == "desc" && nb == this.step)
        return "is-size-5 has-text-lightgreen";
      else if (type == "desc" && nb != this.step) return "is-size-7";
      return "";
    },
    showStepContent(nb) {
      return this.step == nb ? "is-active" : "";
    },
    nextStep() {
      this.help = false;
      this.step++;
    },
    previousStep() {
      this.help = false;
      this.step--;
    }
  }
};
</script>


<style scoped>
.container {
  text-align: center;
  margin: 0;
  margin-top: 2rem;
}
.steps-actions {
  margin: 0 !important;
  padding: 0 !important;
}
.steps-actions .button {
  border: unset;
  border-radius: 0;
}
.step-item {
  min-height: 8.2rem;
}
.steps .steps-content {
  margin-bottom: 0;
}
</style>

<style>
/* hide save button, card header */
.step-by-step .profile-preview-title,
.step-by-step .card-header,
.step-by-step .nav-buttons.columns.is-gapless.is-mobile.builder-fast-save {
  display: none;
}

.step-by-step .game-select .card-header,
.step-by-step .account-list .card-header {
  display: flex;
}

.step-by-step .confirmation-message {
  min-height: 10rem;
}

.step-by-step .accounts-container .relative-zone,
.step-by-step .game-tags-list .relative-zone,
.step-by-step .user-tags-list .relative-zone,
.step-by-step .user-tags-list .card-content {
  min-height: 15rem;
}

.step-by-step .tag-selection-list {
  min-height: 20rem;
}
</style>
