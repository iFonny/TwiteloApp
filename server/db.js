const hat = require('hat');
const jwt = require('jwt-simple');
const axios = require('axios');

module.exports = {

  checkOrCreateTable(r) {
    try {
      r.tableList().run().then((tables) => {
        if (!tables.includes('user')) {
          console.log("RethinkDB: 'user' table created.");
          r.tableCreate('user').run().then(() => {
            r.table("user").indexCreate("twitter_id").run();
            r.table("user").indexCreate("username").run();
            r.table("user").indexCreate("twitelo_token").run();
            r.table("user").indexCreate("api_key").run();
            console.log("RethinkDB: 'user' indexes created.");
          });
        }
        if (!tables.includes('deleted_user')) {
          console.log('RethinkDB: "deleted_user" table created.');
          r.tableCreate('deleted_user').run().then(() => {
            r.table('deleted_user').indexCreate('twitter_id').run();
            r.table('deleted_user').indexCreate('username').run();
            r.table('deleted_user').indexCreate('twitelo_token').run();
            r.table('deleted_user').indexCreate('api_key').run();
            console.log('RethinkDB: "deleted_user" indexes created.');
          });
        }
        if (!tables.includes('notification')) {
          console.log("RethinkDB: 'notification' table created.");
          r.tableCreate('notification').run().then(() => {
            r.table("notification").indexCreate("destination").run();
            console.log("RethinkDB: 'notification' indexes created.");
          });
        }
        if (!tables.includes('trigger')) {
          console.log('RethinkDB: "trigger" table created.');
          r.tableCreate('trigger').run().then(() => {
            r.table('trigger').indexCreate('game_id').run();
            console.log('RethinkDB: "trigger" indexes created.');
          });
        }
        if (!tables.includes('game')) {
          console.log('RethinkDB: "game" table created.');
          r.tableCreate('game').run().then(() => {
            r.table('game').indexCreate('small_name').run();
            r.table('game').indexCreate('name').run();
            console.log('RethinkDB: "game" indexes created.');
          });
        }
        if (!tables.includes('setting')) {
          console.log('RethinkDB: "setting" table created.');
          r.tableCreate('setting').run().then(() => {
            r.table('setting').indexCreate('user_id').run();
            r.table('setting').indexCreate('type').run();
            r.table('setting').indexCreate('trigger_id').run();
            console.log('RethinkDB: "setting" indexes created.');
          });
        }
        if (!tables.includes('log')) {
          console.log('RethinkDB: "log" table created.');
          r.tableCreate('log').run().then(() => {
            //r.table('log').indexCreate('user_id').run();
            console.log('RethinkDB: "log" indexes created.');
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  },

  findOrCreate(r, profile, token, tokenSecret, config) {
    return new Promise((resolve, reject) => {

      r.table('user').filter({
        twitter_id: profile.id
      }).run().then((users) => {
        if (users.length <= 0) { // Create new user
          r.table('user').insert({
            role: 'USER',
            twitter_id: profile._json.id_str,
            twitelo_token: `${hat(16)}${profile._json.id_str}-${hat(256)}`,
            api_key: `${hat(16)}${profile._json.id_str}-${hat(256)}`,
            tokens: jwt.encode({
              token,
              tokenSecret,
              id: profile.id
            }, config.secret.server.jwtSecret),
            username: profile._json.screen_name,
            name: profile._json.name,
            protected: profile._json.protected,
            verified: profile._json.verified,
            followers: profile._json.followers_count,
            lang: profile._json.lang.toLowerCase(),
            profile_image_url: profile._json.profile_image_url.replace('_normal', '_400x400'),
            description: profile._json.description,
            switch: false,
            settings: {
              locale: profile._json.lang.toLowerCase() == 'fr' ? 'fr' : 'en',
              notifications: {
                mp_twitter: false
              },
              pp_trigger: false
            },
            twitelo: {
              name: {
                status: false,
                content: profile._json.name
              },
              description: {
                status: false,
                content: profile._json.description
              },
              url: {
                status: false,
                content: profile._json.url
              },
              location: {
                status: false,
                content: profile._json.location
              }
            },
            created: Date.now(),
            updated: Date.now()
          }, {
            returnChanges: true
          }).run().then((result) => {
            if (result && result.inserted == 1) {

              // Send webhook discord and welcome private message
              axios.get(`${_config.api.baseURL}/user/me/welcome`, {
                headers: {
                  Authorization: result.changes[0].new_val.twitelo_token
                }
              }).catch(console.error);

              return resolve(result.changes[0].new_val);
            } else return reject("DB: User not created");
          }).catch((e) => reject(e))

        } else { // Update and get user
          r.table('user').get(users[0].id).update({
              tokens: jwt.encode({
                token,
                tokenSecret,
                id: profile.id
              }, config.secret.server.jwtSecret),
              username: profile._json.screen_name,
              name: profile._json.name,
              protected: profile._json.protected,
              verified: profile._json.verified,
              followers: profile._json.followers_count,
              lang: profile._json.lang,
              profile_image_url: profile._json.profile_image_url.replace('_normal', '_400x400'),
              description: profile._json.description,
              updated: Date.now()
            }, {
              returnChanges: true
            }).run()
            .then((result) => resolve(result.changes[0].new_val))
            .catch((e) => reject(e))
          resolve(users[0])
        }
      }).catch((e) => reject(e));

    })
  },

  findUserByID(r, id) {
    return new Promise((resolve, reject) => {
      r.table('user').get(id).run()
        .then((user) => (user ? resolve(user) : reject('User not found')))
        .catch((e) => reject(e));
    });
  },

  findUserByIndex(r, index, content) {
    return new Promise((resolve, reject) => {
      r.table('user').getAll(content, {
          index: index
        }).run()
        .then((user) => (user.length > 0 ? resolve(user[0]) : reject('User not found')))
        .catch((e) => reject(e));
    });
  }

}
