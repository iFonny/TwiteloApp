const config = {
  env: 'dev',
  server: {
    host: 'localhost',
    port: 3022,
    baseURL: 'http://localhost:3022'
  },
  api: {
    baseURL: 'http://localhost:3032'
  },
  db: {
    name: 'twitelo_dev'
  },
  passport: {
    twitter: {
      callbackURL: 'http://localhost:3022/auth/twitter/return'
    }
  }
};

// Exports module
module.exports = config;
