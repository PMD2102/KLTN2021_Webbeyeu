if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const logger = require("morgan");
const passport = require("passport");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const combineRoute = require("./routes");
const rootSocket = require("./sockets");
const { passportConfig, mongooseConfig } = require("./config");
const { FRONTEND_URI } = require("./config/keys");


// // config socketio
var server = http.createServer(app);
var io = socketIO(server, {
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origin: [FRONTEND_URI, "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});
app.locals.socketIo = io;
rootSocket(io);

// // cors config domain
// var corsOptions = {
//   origin: [FRONTEND_URI, "http://localhost:3000"],
//   credentials: true,
// };

// connectDB
mongooseConfig.connectDB();

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// passport config
passportConfig(passport);

// init route
app.get("/", (req, res) => {
  res.send("Server is running...!");
});
combineRoute(app);

// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static('client/build'))
//   app.get('*', (req, res) => {
//       res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
//   })
// }

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
