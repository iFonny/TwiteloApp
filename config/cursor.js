const devConfig = require('./dev');
const prodConfig = require('./production');
const betaConfig = require('./beta');

// Datas
const env = process.env.NODE_ENV || devConfig.env;
let config = {};

// Switch between env
switch (env) {

  case 'dev': // Development
  case 'development':
    config = devConfig;
    break;

  case 'prod': // Production
  case 'production':
    config = prodConfig;
    break;

  case 'beta': // Beta prod
    config = betaConfig;
    break;
}

// Generic config


// secret configs
config.secret = require(`./secret`);

// Exports module
module.exports = config;
