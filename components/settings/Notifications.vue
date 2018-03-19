<template>
  <div class="notifications-settings">
    <ul>
      <li>
        <div class="columns is-mobile">
          <div class="column is-three-quarters-desktop is-three-quarters-touch settings-name">
            {{$t('settings.notifications.send-mp-notifs')}}
            <b-tooltip :label="$t('settings.notifications.send-mp-notifs-tooltip')" type="is-light" position="is-right" class="is-hidden-touch" size="is-large" multilined>
              <span class="icon">
                <i class="fas fa-question-circle"></i>
              </span>
            </b-tooltip>

            <b-tooltip :label="$t('settings.notifications.send-mp-notifs-tooltip')" type="is-light" position="is-left" class="is-hidden-desktop" multilined>
              <span class="icon">
                <i class="fas fa-question-circle"></i>
              </span>
            </b-tooltip>
          </div>
          <div class="column has-text-right settings-content">
            <b-switch @change.native="changeSwitchNotifications('mp_twitter')" :value="$store.state.user.info.settings.notifications.mp_twitter" type="is-sucess" size="is-medium" :disabled="switchDisabled.mp_twitter"></b-switch>
          </div>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
import VueNotifications from "vue-notifications";

export default {
  data() {
    return {
      switchDisabled: {
        mp_twitter: false
      }
    };
  },
  methods: {
    async changeSwitchNotifications(name) {
      if (!this.switchDisabled[name]) {
        this.switchDisabled[name] = true;

        try {
          await this.$store.dispatch(
            "settings/changeNotificationsSwitch",
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
.settings-name {
  display: flex;
  text-align: left;
  align-items: center;
  font-weight: 500;
  font-size: 1.1rem;
}
.settings-content {
  display: flex;
  text-align: right;
  align-items: center;
  justify-content: flex-end;
}
.settings-name .icon {
  margin-left: 0.5rem;
}
</style>
