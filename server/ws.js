module.exports = function (config, wss, r, dbFunc) {

  // Websocket Broadcast to all.
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(data);
    });
  };
  // Websocket send to a specific client
  wss.sendTo = function sendTo(id, data) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1 && client.twiteloUser && client.twiteloUser.id == id)
        client.send(data);
    });
  };

  /* RethinkDB change events */

  r.table('notification').changes()
    .filter(r.row('old_val').eq(null))
    .run()
    .then(function (feed) {
      feed.each((err, change) => {
        const notification = {
          type: 'NOTIFICATION',
          data: change.new_val
        };

        console.log(`Notification sent to ${notification.data.destination}`);

        if (notification.data.destination == 'global') wss.broadcast(JSON.stringify(notification));
        else wss.sendTo(notification.data.destination, JSON.stringify(notification));
      });
    }).error((err) => console.log)


  try {
    wss.on('connection', function connection(ws, req) {

      ws.on('message', function incoming(message) {
        try {
          message = JSON.parse(message);

          switch (message.type) {
            case 'AUTH':

              if (message.data.twiteloToken) {
                dbFunc.findUserByIndex(r, 'twitelo_token', message.data.twiteloToken)
                  .then((user) => {
                    ws.twiteloUser = user;
                    console.log(`New user connected: ${user.username} (${user.id})`)
                  })
                  .catch(console.error);
              }
              break;

            default:
              console.log('Websocket on message unknown type: ' + message)
              break;
          }
        } catch (error) {
          console.log('Websocket on message error: ' + error + '\n data:  ' + message)
        }
      });

      ws.on('close', (reason) => console.log('Websocket closed: ' + reason));

      ws.on('error', (err) => {
        ws.terminate();
        console.log('Websocket onerror: ' + err)
      });

      /* setInterval(() => {
       console.log(wss.clients.size)
       wss.clients.forEach((ws) => {
         console.log(ws.twiteloToken);
       });
     }, 5000);*/

    });

  } catch (error) {
    console.log('Websocket error: ' + error)
  }

}
