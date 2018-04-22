const hat = require('hat');
const jwt = require('jwt-simple');
const axios = require('axios');

module.exports = {

  async checkOrCreateTable(r) {
    try {
      await r.dbList().run().then(async (databases) => {
        if (!databases.includes(_config.db.name)) {
          await r.dbCreate(_config.db.name);
          console.log(`RethinkDB: '${_config.db.name}' db created.`);
        }

        await r.tableList().run().then(async (tables) => {
          if (!tables.includes('user')) {
            await r.tableCreate('user').run().then(async () => {
              console.log("RethinkDB: 'user' table created.");
              await r.table("user").indexCreate("twitter_id").run();
              await r.table("user").indexCreate("username").run();
              await r.table("user").indexCreate("twitelo_token").run();
              await r.table("user").indexCreate("api_key").run();
              await r.table('user').indexCreate('created').run();
              await r.table('user').indexCreate('updated').run();
              console.log("RethinkDB: 'user' indexes created.");
            });
          }
          if (!tables.includes('deleted_user')) {
            await r.tableCreate('deleted_user').run().then(async () => {
              console.log('RethinkDB: "deleted_user" table created.');
              await r.table('deleted_user').indexCreate('twitter_id').run();
              await r.table('deleted_user').indexCreate('username').run();
              await r.table('deleted_user').indexCreate('twitelo_token').run();
              await r.table('deleted_user').indexCreate('api_key').run();
              await r.table('deleted_user').indexCreate('created').run();
              await r.table('deleted_user').indexCreate('updated').run();
              console.log('RethinkDB: "deleted_user" indexes created.');
            });
          }
          if (!tables.includes('notification')) {
            await r.tableCreate('notification').run().then(async () => {
              console.log("RethinkDB: 'notification' table created.");
              await r.table("notification").indexCreate("destination").run();
              console.log("RethinkDB: 'notification' indexes created.");
            });
          }
          if (!tables.includes('trigger')) {
            await r.tableCreate('trigger').run().then(async () => {
              console.log('RethinkDB: "trigger" table created.');
              await r.table('trigger').indexCreate('game_id').run();
              console.log('RethinkDB: "trigger" indexes created.');
            });
          }
          if (!tables.includes('setting')) {
            await r.tableCreate('setting').run().then(async () => {
              console.log('RethinkDB: "setting" table created.');
              await r.table('setting').indexCreate('user_id').run();
              await r.table('setting').indexCreate('type').run();
              await r.table('setting').indexCreate('trigger_id').run();
              console.log('RethinkDB: "setting" indexes created.');
            });
          }
          if (!tables.includes('log')) {
            await r.tableCreate('log').run();
            console.log('RethinkDB: "log" table created.');
          }
          if (!tables.includes('tag')) {
            await r.tableCreate('tag').run().then(async () => {
              console.log('RethinkDB: "tag" table created.');
              await r.table('tag').indexCreate('user_id').run();
              await r.table('tag').indexCreate('game_id').run();
              await r.table('tag').indexCreate('tag_id').run();
              await r.table('tag').indexCreate('account_id').run();
              await r.table('tag').indexCreate('created').run();
              await r.table('tag').indexCreate('updated').run();
              console.log('RethinkDB: "tag" indexes created.');
            });
          }
          if (!tables.includes('account')) {
            await r.tableCreate('account').run().then(async () => {
              console.log('RethinkDB: "account" table created.');
              await r.table('account').indexCreate('user_id').run();
              await r.table('account').indexCreate('game_id').run();
              await r.table('account').indexCreate('created').run();
              console.log('RethinkDB: "account" indexes created.');
            });
          }
          if (!tables.includes('game_data')) {
            await r.tableCreate('game_data').run().then(async () => {
              console.log('RethinkDB: "game_data" table created.');
              await r.table('game_data').indexCreate('game_id').run();
              await r.table('game_data').indexCreate('tag_id').run();
              await r.table('game_data').indexCreate('updated').run();
              console.log('RethinkDB: "game_data" indexes created.');
            });
          }
          if (!tables.includes('contact')) {
            await r.tableCreate('contact').run().then(async () => {
              console.log('RethinkDB: "contact" table created.');
              await r.table('contact').indexCreate('type').run();
              await r.table('contact').indexCreate('username').run();
              await r.table('contact').indexCreate('created').run();
              console.log('RethinkDB: "contact" indexes created.');
            });
          }
        });
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
            profile_image_url: profile._json.profile_image_url_https.replace('_normal', '_400x400'),
            description: profile._json.description,
            switch: false,
            freshUser: true,
            disabled: 0,
            settings: {
              locale: profile._json.lang.toLowerCase() == 'fr' ? 'fr' : 'en',
              notifications: {
                mp_twitter: true
              },
              pp_trigger: false
            },
            twitelo: {
              name: {
                status: false,
                content: profile._json.name || ''
              },
              description: {
                status: false,
                content: profile._json.description || ''
              },
              location: {
                status: false,
                content: profile._json.location || ''
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
              profile_image_url: profile._json.profile_image_url_https.replace('_normal', '_400x400'),
              description: profile._json.description,
              disabled: 0,
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
