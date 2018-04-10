//=======================================================================//
//     Node packages                                                     //
//=======================================================================//

const config = require('../config/cursor');
global._config = config;
const {
  Nuxt,
  Builder
} = require('nuxt');
const express = require('express');
const session = require('express-session');
const WebSocket = require('ws');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require('passport');
const compression = require('compression');
const Strategy = require('passport-twitter').Strategy;
const r = require('rethinkdbdash')({
  db: config.db.name
});
const RDBStore = require('session-rethinkdb')(session);
const dbFunc = require('./db');


// Check or create if needed db/tables doesn't exist
dbFunc.checkOrCreateTable(r).then(() => {

  //=======================================================================//
  //     Passport                                                          //
  //=======================================================================//

  passport.use(new Strategy({
      consumerKey: config.secret.twitter.consumerKey,
      consumerSecret: config.secret.twitter.consumerSecret,
      callbackURL: config.passport.twitter.callbackURL
    },
    function (token, tokenSecret, profile, done) {
      dbFunc.findOrCreate(r, profile, token, tokenSecret, config)
        .then((user) => done(null, user))
        .catch((err) => done(err))
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    dbFunc.findUserByID(r, id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });


  //=======================================================================//
  //     Express & Session                                                 //
  //=======================================================================//

  const store = new RDBStore(r, {
    browserSessionsMaxAge: 60000, // optional, default is 60000. After how much time should an expired session be cleared from the database
    clearInterval: 60000, // optional, default is 60000. How often do you want to check and clear expired sessions
  });

  const app = express();

  app.use(compression())

  app.disable('x-powered-by');
  app.use(helmet());

  let sessionParser = session({
    secret: config.secret.server.secret,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 31536000000 // 1 year
    }
  });

  app.use(sessionParser);


  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());

  // (middleware) Handle passport errors
  app.use(function (err, req, res, next) {
    if (err) {
      console.error(err);
      req.logout(); // So deserialization won't continue to fail.
      req.session.destroy(function (serr) {
        if (req.originalUrl == "/login-error") next(); // never redirect login page to itself
        else res.redirect("/login-error");
      });
    } else next();
  });


  //=======================================================================//
  //     Auth Routes                                                       //
  //=======================================================================//

  app.get('/auth/twitter',
    passport.authenticate('twitter'));

  app.get('/auth/twitter/return',
    passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    function (req, res) {
      console.error('BITCH');
      res.redirect('/');
    });

  app.get('/auth/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });


  //=======================================================================//
  //     Websocket                                                         //
  //=======================================================================//

  try {
    const wss = new WebSocket.Server({
      port: 4000
    });
    require('./ws')(config, wss, r, dbFunc);
  } catch (e) {
    console.error(e)
  }

  //=======================================================================//
  //     Nuxt.js                                                           //
  //=======================================================================//

  /* Peut servir si la merde du proxy revient
  var restream = function(proxyReq, req, res, options) {
  if (req.body) {
      let bodyData = JSON.stringify(req.body);
      // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
      proxyReq.setHeader('Content-Type','application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      // stream the content
      proxyReq.write(bodyData);
  }
  }*/

  // Import and Set Nuxt.js options
  let nuxtConfig = require('../nuxt.config.js');
  nuxtConfig.axios.baseURL = config.server.baseURL;
  nuxtConfig.proxy = {
    '/api': {
      //onProxyReq: restream,
      target: config.api.baseURL,
      pathRewrite: {
        '^/api': ''
      }
    },
    '/media': {
      //onProxyReq: restream,
      target: config.api.baseURL,
      pathRewrite: {
        '^/media': 'public/media'
      }
    },
  };

  nuxtConfig.dev = !(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta')

  // Nous instancions Nuxt.js avec les options
  const isProd = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta');
  const nuxt = new Nuxt(nuxtConfig);

  // Pas de build en production
  if (!isProd) {
    const builder = new Builder(nuxt)
    builder.build()
  }
  app.use(nuxt.render);
  app.use(bodyParser.json({
    limit: '2mb'
  }));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '2mb'
  }));
  app.listen(config.server.port);
  console.log(`Server is listening on ${config.server.host}:${config.server.port}`);


});
