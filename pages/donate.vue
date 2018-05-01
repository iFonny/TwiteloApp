<template>
    <div class="container is-fluid has-text-centered donate-page">
        <img class="twitelo-logo" src="~/static/logo.png"><br>
        <p class="subtitle has-text-centered has-text-grey-lighter" v-html="$t('donate.donate-message-1')"></p>
        <p class="subtitle has-text-centered has-text-grey-lighter" v-html="$t('donate.donate-message-2')"></p>

        <section>
            <p class="title">{{$t('donate.paypal-donate')}}</p>
            <ul>
                <li class="align-vertical-center">
                    <img class="donate-icon" src="~/static/images/donate/paypal.png">
                    <a class="is-size-5" :href="link.paypal">{{link.paypal}}</a>
                </li>
            </ul>
        </section>
        <br>
        <section>
            <p class="title">{{$t('donate.crypto-donate')}}</p>
            <p class="subtitle has-text-centered" v-html="$t('donate.donate-crypto-message')"></p>
            <ul>
                <li v-for="(crypto, key) in cryptos" :key="key" class="align-vertical-center">
                    <img class="donate-icon" :src="crypto.icon">
                    <span class="crypto-name">{{crypto.name}} ({{crypto.symbol}})</span>
                    <a class="is-size-5">{{crypto.address}}</a>
                </li>
            </ul>
        </section>
        <br>
        <section>
            <p class="title">{{$t('donate.free-donate')}}</p>

            <ul>
                <li>
                    <a :href="link.brave"><img class="donate-banner" :src="image.brave"></a>
                </li>
            </ul>

        </section>
        <br>
        <section class="donations-list">
            <p class="title">{{$t('donate.donations-list-title')}}</p>

            <ul>
                <li v-for="donation in donations" :key="donation.id">
                    <span>
                        <b>{{donation.name || "Anonymous"}}</b>
                        <a>{{donation.address ? ` (${donation.address})` : ''}}</a> - {{donation.amount}} {{donation.symbol}} ({{donation.from}})</span>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    let donations = [];
    try {
      donations = (await app.$axios.$get("/api/other/donations")).data;
    } catch (e) {
      donations = [];
      console.error(e);
    }

    return {
      donations,
      link: {
        paypal: "https://paypal.me/iFonny",
        brave: "https://brave.com/twi595"
      },
      image: {
        brave: "/images/donate/brave.png"
      },
      cryptos: [
        {
          name: "Litecoin",
          symbol: "LTC",
          icon: "/images/donate/litecoin.png",
          address: "MGT7n22243XrjuX9FYTDA1X2wCJiBWTiPz"
        },
        {
          name: "Bitcoin",
          symbol: "BTC",
          icon: "/images/donate/bitcoin.png",
          address: "347J8WRftcQmGg7imyF88wSzqUiXA8cPfM"
        },
        {
          name: "Ethereum & ERC20 tokens",
          symbol: "ETH",
          icon: "/images/donate/ethereum.png",
          address: "0xb267ebd0fc1e99cdee48a3828037d942477a8bed"
        },
        {
          name: "Nano",
          symbol: "NANO",
          icon: "/images/donate/nano.png",
          address:
            "xrb_13hi9t156x9pt55i77gr4yfmrgme5kf96fotm6gx4hr7568sd1e69j4grtuj"
        },
        {
          name: "Dash",
          symbol: "DASH",
          icon: "/images/donate/dash.png",
          address: "Xrw6ZRzkCWKfjbZzj47hban9T8zf6RjH8D"
        },
        {
          name: "ZCoin",
          symbol: "XZC",
          icon: "/images/donate/zcoin.png",
          address: "a6RWBD87jGy2j712uz6qbKe2PpN5VrVSC6"
        },
        {
          name: "Dogecoin",
          symbol: "DOGE",
          icon: "/images/donate/dogecoin.png",
          address: "DFpspE3UXQDJ2nFHgAd3LmGMzrKmyx5WP4"
        },
        {
          name: "BCash",
          symbol: "BCH",
          icon: "/images/donate/bcash.png",
          address: "Bcash. XD"
        }
      ]
    };
  },
  methods: {}
};
</script>


<style scoped>
.container {
  margin: 1.5rem 3rem 1.5rem 3rem;
}

.donate-page .twitelo-logo {
  height: 100px;
}

.donate-page .crypto-name {
  padding-right: 0.5rem;
}

.donate-page .donate-icon {
  height: 25px;
  padding-right: 0.5rem;
  cursor: pointer;
}
.donate-page .donate-banner {
  height: 70px;
  cursor: pointer;
}
</style>
