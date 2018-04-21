<template>
    <div class="container is-fluid">
        <p class="subtitle has-text-centered" v-html="$t('contact.contact-me-message')"></p>
        <section>
            <b-field :label="$t('contact.form.twitter-username')">
                <b-input v-model="dataForm.username" placeholder="iFonny_" icon="twitter" :disabled="user ? true : false" required></b-input>
            </b-field>

            <b-field :label="$t('contact.form.request-type')">
                <b-select v-model="dataForm.type" :placeholder="$t('contact.form.request-type')" icon="folder-open" icon-pack="fas" expanded required>
                    <option value="bug-report">{{$t('contact.form.bug-report')}}</option>
                    <option value="suggestion">{{$t('contact.form.suggestion')}}</option>
                    <option value="request">{{$t('contact.form.request')}}</option>
                    <option value="other">{{$t('contact.form.other')}}</option>
                </b-select>
            </b-field>

            <b-field :label="$t('contact.form.title')">
                <b-input v-model="dataForm.title" :placeholder="$t('contact.form.title')" maxlength="50" required></b-input>
            </b-field>

            <b-field :label="$t('contact.form.message')">
                <b-input v-model="dataForm.message" :placeholder="$t('contact.form.message')" maxlength="500" type="textarea" required></b-input>
            </b-field>

            <b-field class="has-text-centered">
                <button @click="submitContact()" class="button submit-contact" :class="submitButtonClass" :disabled=" sent || !(dataForm.username && dataForm.type && dataForm.title && dataForm.message)">

                    <b-icon v-if="sent" icon="check"></b-icon>
                    <span v-if="sent">{{$t('contact.form.sent')}}</span>
                    <span v-else>{{$t('contact.form.send')}}</span>
                </button>
            </b-field>
        </section>
    </div>
</template>

<script>
import { mapState } from "vuex";
import VueNotifications from "vue-notifications";

export default {
  async asyncData({ app, error }) {
    return {
      dataForm: {
        username: app.store.state.user.info ? app.store.state.user.info.username : null,
        type: "bug-report",
        title: null,
        message: null
      },
      sent: false,
      loading: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.info
    }),
    submitButtonClass() {
      let btnClass = "";
      if (this.loading) btnClass += "is-loading ";
      if (this.sent) btnClass += "is-lightgreen";
      else btnClass += "is-light";
      return btnClass;
    }
  },
  methods: {
    submitContact() {
      this.loading = true;
      this.$axios
        .$post("/api/other/contact", this.dataForm)
        .then(() => {
          this.sent = true;
          this.loading = false;
        })
        .catch(e => {
          this.sent = false;
          setTimeout(() => {
            this.loading = false;
          }, 1000);
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
.container {
  margin: 1.5rem 3rem 1.5rem 3rem;
}
.submit-contact {
  width: 100%;
}
</style>
