<template>
  <b-dropdown position="is-bottom-left" class="dropdown-notif">
    <nuxt-link :to="''" v-if="$store.state.user.info" class="navbar-item navbar-item-line" slot="trigger">
      <span v-if="getUnarchivedNotifications()" class="badge is-badge-warning is-badge-small badge-notif" :data-badge="getUnarchivedNotifications()">
        <b-icon pack="fas" icon="bell"></b-icon>
      </span>
      <b-icon v-else pack="fas" icon="bell"></b-icon>
    </nuxt-link>

    <nuxt-link :to="''" @click.native="closePopupNotif()" id="dropdown-notif-button-close" class="button dropdown-notif-button is-dark is-hidden-desktop">
      <b-icon pack="fas" icon="times-circle"></b-icon>
      <span class="sub-menu-button">{{$t('navbar.close-popup')}}</span>
    </nuxt-link>

    <b-dropdown-item class="columns is-gapless is-multiline is-mobile" custom>
      <div class="column align-vertical is-four-fifths ">
        <b class="text-overflow-is-ellipsis">Notifications</b>
      </div>
      <div class="column has-text-right">
        <b-tooltip :label="$t('navbar.notification.old-notifications-tooltip')" type="is-light" position="is-left">
          <button @click="getAllNotifications()" class="get-all-notifs-button button is-rounded is-dark is-small">
            <b-icon pack="fas" icon="history"></b-icon>
          </button>
        </b-tooltip>
      </div>
    </b-dropdown-item>
    <hr class="dropdown-divider divider-under-notif">

    <b-dropdown-item v-if="$store.state.notifications.list.length === 0" custom>
      <div class="content has-text-grey-lighter align-vertical-center empty-notif">
        <b-icon icon="emoticon-sad" size="is-large"></b-icon>
        <span class="sub-menu-button">{{$t('navbar.notification.no-notifications')}}</span>
      </div>
    </b-dropdown-item>

    <b-dropdown-item class="notif-list" v-if="$store.state.notifications.list.length > 0" custom>
      <ul>
        <li v-for="notification in orderedNotificationsDesc" :key="notification.id" class="media align-vertical notif-elem">
          <div class="media-left">
            <b-icon pack='fas' :icon="notification.icon" :type="notification.color" size="is-medium"></b-icon>
          </div>
          <div class="media-content">
            <span class="title is-6"> {{notification[$store.state.locale].title}}
              <span class="subtitle is-7 has-text-weight-normal">
                <b-icon v-if="notification.archived" pack="fas" icon="history" size="is-small"></b-icon>
                <b-icon v-if="notification.destination === 'global'" pack="fas" icon="globe" size="is-small"></b-icon>
                {{getTimeAgo(notification.created)}}
              </span>
            </span>

            <div class="notif-content">{{notification[$store.state.locale].content}}</div>
          </div>
        </li>
      </ul>

    </b-dropdown-item>

    <a v-if="$store.state.notifications.list.length > 0" @click="clearNotifications()" id="dropdown-notif-button-archive" class="column button dropdown-notif-button is-twitter">
      <b-icon pack="fas" icon="archive"></b-icon>
      <span class="sub-menu-button text-overflow-is-ellipsis">{{$t('navbar.notification.clear')}}</span>
    </a>
  </b-dropdown>
</template>

<script>
import VueNotifications from "vue-notifications";
import moment from "moment";
import _ from "lodash";

export default {
  computed: {
    orderedNotificationsDesc: function() {
      return _.orderBy(
        _.values(this.$store.state.notifications.list),
        "timestamp",
        "desc"
      );
    }
  },
  methods: {
    getTimeAgo(timestamp) {
      moment.locale(this.$store.state.locale);
      return moment(timestamp).fromNow();
    },
    closePopupNotif() {
      if (document.getElementsByClassName("background").length) {
        document.getElementsByClassName("background")[0].click();
      }
    },
    getUnarchivedNotifications() {
      return this.$store.state.notifications.list.filter(
        notif => !notif.archived
      ).length;
    },
    clearNotifications() {
      this.$store.dispatch("notifications/clearNotifications").catch(e => {
        this.$store.dispatch("setError", e);
        this.showNotification({
          title: this.$store.state.error.statusCode.toString(),
          message: this.$store.state.error.message,
          type: "error",
          timeout: 5000
        });
      });
    },
    async getAllNotifications() {
      let buttons = document.getElementsByClassName("get-all-notifs-button");
      _.each(buttons, button => button.classList.add("is-loading"));

      try {
        await this.$store.dispatch("notifications/getAllNotifications");
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
        _.each(buttons, button => button.classList.remove("is-loading"));
      }, 800);
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
#dropdown-notif-button-archive {
  border-radius: 0px 0px 15px 15px;
}
.empty-notif {
  margin-bottom: 0.5rem;
}
.notif-list {
  padding: 0rem 1rem 0 1rem;
  line-height: 1.2;
}
.notif-content {
  margin-top: 0.15rem;
}
.notif-elem {
  padding-top: 0.3rem;
  margin-top: 0;
  padding-bottom: 0.4rem;
}
.align-vertical {
  display: flex;
  align-items: center;
}

.dropdown-notif-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px;
}
.divider-under-notif {
  margin: 0;
}
.dropdown-notif-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px;
}
.badge-notif.is-badge-small::after {
  top: calc(0px - (1rem / 2));
  left: calc(100% - (1.5rem / 2));
}
/* mobile */
@media screen and (max-width: 1023px) {
  #dropdown-notif-button-close {
    border-radius: 15px 15px 0 0;
  }
}
</style>

<style>
.dropdown-notif .dropdown-menu {
  padding-top: 0px;
  z-index: 100;
  width: 25rem;
  right: -20px !important;
}
.dropdown-notif .dropdown-content {
  padding-top: 0;
  border-radius: 0px 0px 15px 15px;
  box-shadow: none;
  padding-bottom: 0px;
  opacity: 0.98;
  background-color: #3d3d3d;
}
.notif-list {
  max-height: 17rem;
  overflow: scroll;
}

.dropdown-notif .columns.is-gapless {
  margin-bottom: 0px;
}

/* mobile */
@media screen and (max-width: 1023px) {
  .dropdown-notif .dropdown-content {
    border-radius: 15px 15px 15px 15px;
  }
}
</style>
