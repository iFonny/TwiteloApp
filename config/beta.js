const config = {
  env: 'beta',
  server: {
    host: 'beta.twitelo.me',
    port: 3021,
    baseURL: 'https://beta.twitelo.me'
  },
  api: {
    baseURL: 'https://api-beta.twitelo.me'
  },
  db: {
    name: 'twitelo_beta'
  },
  passport: {
    twitter: {
      callbackURL: 'https://beta.twitelo.me/auth/twitter/return'
    }
  },
};

// Exports module
module.exports = config;
