//Imports
var express = require("express");
var { createServer } = require("http");
var { Server } = require("socket.io");
require("dotenv").config();
var { join } = require("path");
const PORT = process.env.PORT || 4000;
var cookieParser = require("cookie-parser");

var xanoRouter = require("./routes/xano/xano");
var twilioRouter = require("./routes/twilio/twilio");
var writeXMLRouter = require("./routes/writeXML/writeXML");
var extractToTextRouter = require("./routes/extractToText/extractToText");
// var xmlToJSRouter = require("./routes/xmlToJs/xmlToJs");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.static(join(__dirname, "..", "client", "build")));
app.use(cookieParser());
app.use("/xano", xanoRouter);
app.use("/twilio", twilioRouter);
app.use("/writeXML", writeXMLRouter);
app.use("/extractToText", extractToTextRouter);
// app.use("/xmlToJs", xmlToJsRouter);
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

const httpServer = createServer(app); //my http server
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
  },
}); //Web socket server

app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "..", "client", "build", "index.html"));
});

//****************** SOCKET CONECTION/DECONNECTION EVENT LISTENERS ****************//

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.on("disconnect", (reason) => {
    console.log(`User ${socket.id} disconnected`);
    console.log(reason);
  });
  socket.on("message", (message) => {
    io.emit("message", message);
  });
});
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

//*******************************************************************//

httpServer.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT}`);
});
