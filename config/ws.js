// Datas
const env = process.env.NODE_ENV || 'development';
let config = {};

// Switch between env
switch (env) {
  case 'prod': // Production
  case 'beta':
  case 'production':
    config = config = {
      ws: 'ws://',
      host: 'ws.twitelo.me:80',
      port: 4000
    };
    break;

  case 'dev': // Development
  case 'development':
    config = {
      ws: 'ws://',
      host: 'localhost:4000',
      port: 4000
    };
    break;

}

// Exports module
module.exports = config;
