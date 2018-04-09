const config = {
  env: 'production',
  server: {
    host: 'twitelo.me',
    port: 3020,
    baseURL: 'https://twitelo.me'
  },
  api: {
    baseURL: 'https://api.twitelo.me'
  },
  db: {
    name: 'twitelo'
  },
  passport: {
    twitter: {
      callbackURL: 'https://twitelo.me/auth/twitter/return'
    }
  }
};

// Exports module
module.exports = config;
