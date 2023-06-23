/**express*/
const express = require('express');
const app = express();

const PORT = 18000;

/**json parser*/
const bodyParser = require('body-parser')

/**variable of environnement*/
require('dotenv').config();

/**cors restrictions*/
const cors = require('cors');
app.use(cors());

/**mongo db*/
const MongoDBClient = require('./database');

/**routes */
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

/**socket io*/
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


/**parse application/json
 * app.use called for all routes
 *  middelware
*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


/**implementation socket io server side*/
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  
  
  socket.on('disconnect', () => {
    console.log('user disconnected'+  socket.id);
  });

});

/**routes must be outside of io.on  */
  userRoutes(app);
  authRoutes(app);
  messageRoutes(app, io);
  notificationRoutes(app, io)

/**start server WITH socket , so server.listen and not app.listen*/
server.listen(PORT, () => {
  console.log('Connecté au port' + PORT)
  /**mongo db*/
  MongoDBClient.initialize()
})