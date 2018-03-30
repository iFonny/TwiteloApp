<template>
  <article class="tile is-child has-text-centered account-list">
    <b-collapse class="card">
      <div slot="trigger" slot-scope="props" class="card-header no-select">
        <div class="card-header-title">
          <h1 class="title is-size-6-mobile is-size-5-desktop is-size-5">{{$t('builder.accounts')}}</h1>
        </div>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
          </b-icon>
        </a>
      </div>
      <div class="card-content">
      
      </div>
    </b-collapse>
  </article>
</template>

<script>
import { mapState } from "vuex";
import VueNotifications from "vue-notifications";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      games: state => state.builder.games,
      accounts: state => state.builder.accounts,
      selectedGame: state => state.builder.selectedGame
    })
  },
  methods: {},
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

</style>

<style>
.account-list .card {
  height: 100%;
}
.account-list .collapse-content {
  height: calc(100% - 48px);
}
.account-list .card-content {
  height: 100%;
  padding: 0;
}
</style>

