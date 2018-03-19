<template>
  <div class="general-settings">
    <ul>
      <li>
        <div class="columns is-mobile">
          <div class="column is-three-quarters-desktop is-three-quarters-touch settings-name">{{$t('settings.general.global-switch-profile')}}</div>
          <div class="column has-text-right settings-content">
            <b-switch @change.native="changeSwitchGlobal()" :value="$store.state.user.info.switch" type="is-sucess" size="is-medium" :disabled="$store.state.switch.disabled"></b-switch>
          </div>
        </div>
      </li>
      <hr class="dropdown-divider divider-settings">
      <li>
        <div class="columns is-mobile">
          <div class="column is-three-quarters-desktop is-three-quarters-touch settings-name is-sub">{{$t('settings.general.name-switch-profile')}}</div>
          <div class="column has-text-right settings-content">
            <b-switch @change.native="changeSwitch('name')" :value="$store.state.user.info.twitelo.name.status" type="is-sucess" size="is-medium" :disabled="!$store.state.user.info.switch || switchDisabled.name"></b-switch>
          </div>
        </div>
      </li>
      <hr class="dropdown-divider divider-settings">
      <li>
        <div class="columns is-mobile">
          <div class="column is-three-quarters-desktop is-three-quarters-touch settings-name is-sub">{{$t('settings.general.description-switch-profile')}}</div>
          <div class="column has-text-right settings-content">
            <b-switch @change.native="changeSwitch('description')" :value="$store.state.user.info.twitelo.description.status" type="is-sucess" size="is-medium" :disabled="!$store.state.user.info.switch || switchDisabled.description"></b-switch>
          </div>
        </div>
      </li>
      <hr class="dropdown-divider divider-settings">
      <li>
        <div class="columns is-mobile">
          <div class="column is-three-quarters-desktop is-three-quarters-touch settings-name is-sub">{{$t('settings.general.url-switch-profile')}}</div>
          <div class="column has-text-right settings-content">
            <b-switch @change.native="changeSwitch('url')" :value="$store.state.user.info.twitelo.url.status" type="is-sucess" size="is-medium" :disabled="!$store.state.user.info.switch || switchDisabled.url"></b-switch>
          </div>
        </div>
      </li>
      <hr class="dropdown-divider divider-settings">
      <li>
        <div class="columns is-mobile">
          <div class="column is-three-quarters-desktop is-three-quarters-touch settings-name is-sub">{{$t('settings.general.location-switch-profile')}}</div>
          <div class="column has-text-right settings-content">
            <b-switch @change.native="changeSwitch('location')" :value="$store.state.user.info.twitelo.location.status" type="is-sucess" size="is-medium" :disabled="!$store.state.user.info.switch || switchDisabled.location"></b-switch>
          </div>
        </div>
      </li>
    </ul>

    <hr class="dropdown-divider divider-settings">

    <div class="account-settings card-content columns">
      <div class="column account-info">
        <div class="media media-menu">
          <div class="media-content has-text-right">
            <p class="is-6 has-text-white text-overflow-is-ellipsis">{{ $store.state.user.info.name }}</p>
            <p class="is-6 has-text-grey-lighter has-text-weight-light is-italic text-overflow-is-ellipsis user-at">@{{ $store.state.user.info.username }}</p>
          </div>
          <a class="media-center no-select" :href="profileUrl">
            <img class="round-pp-user no-select" :src="$store.state.user.info.profile_image_url" onerror="/images/errors/default_profile.png">
          </a>
        </div>
      </div>
      <div class="column delete-setting">
        <button @click="confirmDeleteAccount()" class="button is-red is-small">{{$t('settings.general.delete-account')}}</button>
      </div>
    </div>

  </div>
</template>

<script>
import VueNotifications from "vue-notifications";

export default {
  data() {
    return {
      switchDisabled: {
        name: false,
        description: false,
        url: false,
        location: false
      },
      profileUrl: this.$store.state.user.info
        ? "http://twitter.com/" + this.$store.state.user.info.username
        : null
    };
  },
  methods: {
    changeSwitchGlobal() {
      if (!this.$store.state.switch.disabled) {
        this.$store
          .dispatch("changeSwitch", !this.$store.state.user.info.switch)
          .catch(e => {
            this.$store.dispatch("setError", e);
            this.showNotification({
              title: this.$store.state.error.statusCode.toString(),
              message: this.$store.state.error.message,
              type: "error",
              timeout: 5000
            });
          });
      }
    },
    async changeSwitch(name) {
      if (!this.switchDisabled[name]) {
        this.switchDisabled[name] = true;

        try {
          await this.$store.dispatch(
            "settings/changeTwiteloSettingSwitch",
            name
          );
        } catch (e) {
          this.$store.dispatch("setError", e);
          this.showNotification({
            title: this.$store.state.error.statusCode.toString(),
            message: this.$store.state.error.message,
            type: "error",
            timeout: 5000
          });
        }

        setTimeout(() => {
          this.switchDisabled[name] = false;
        }, 800);
      }
    },
    confirmDeleteAccount() {
      this.$dialog.confirm({
        title: this.$t(
          "settings.general.popup-delete-account.deleting-account"
        ),
        message: this.$t(
          "settings.general.popup-delete-account.deleting-account-message"
        ),
        confirmText: this.$t(
          "settings.general.popup-delete-account.deleting-account-confirm-text"
        ),
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          const confirmationDeletedAccount = this.$t(
            "settings.general.popup-delete-account.account-deleted"
          );
          this.$router.push("/");
          await this.$store.dispatch("settings/deleteAccount"); // Delete Account
          this.$toast.open({
            message: confirmationDeletedAccount,
            type: "is-success",
            duration: 5000
          });
        }
      });
    }
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
.round-pp-user {
  object-fit: cover;
  height: 50px;
  width: 50px;
  border-radius: 100%;
  border: 1px solid white;
  cursor: pointer;
  margin-left: 1rem;
}
.settings-name {
  display: flex;
  text-align: left;
  align-items: center;
  font-weight: 500;
  font-size: 1.1rem;
}
.delete-setting {
  display: flex;
  align-items: center;
  text-align: right;
  justify-content: center;
}
.settings-content {
  display: flex;
  text-align: right;
  align-items: center;
  justify-content: flex-end;
}
.account-settings.card-content {
  padding: 0.5rem;
}
.user-at {
  padding-right: 2px;
}
.account-settings .account-info {
  display: flex;
  text-align: center;
  justify-content: center;
}
.is-sub {
  padding-left: 2rem;
}
</style>
