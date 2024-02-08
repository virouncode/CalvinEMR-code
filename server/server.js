//Imports
const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const axios = require("axios");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { join } = require("path");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const extractTextFromDoc = require("./extractTextFromDoc");
// const bodyParser = require("body-parser");
const convertJStoXML = require("./jsxml.js");
const getExtension = require("./getExtension.js");

const PORT = process.env.PORT || 4000;

//****************** APP ***************************//
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "..", "client", "build")));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
const httpServer = createServer(app); //my http server
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
  },
}); //Web socket server

//***************** Endpoint TWILIO ******************//
app.post("/api/twilio/messages", async (req, res) => {
  try {
    res.header("Content-Type", "application/json");
    await twilio.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body,
    });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
});
//****************************************************//

//**************** Endpoint DOCUMENT AI **************//
app.post("/api/extractToText", async (req, res) => {
  try {
    const { docUrl, mime } = req.body;
    const result = await extractTextFromDoc(docUrl, mime);
    res.send(result);
    // res.send(JSON.stringify({ success: true }));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
    // res.send(JSON.stringify({ success: false }));
  }
});

//***********************************************************//

//**************** Endpoint write XML File ****************//

app.post("/api/writeXML", async (req, res) => {
  try {
    const {
      xmlFinal,
      patientFirstName,
      patientLastName,
      patientId,
      patientDob,
      doctorFirstName,
      doctorLastName,
      doctorOHIP,
      authorName,
      dateOfExport,
      reportsFiles,
    } = req.body;

    //Names
    const exportFolderName = `CalvinEMR_Export_${dateOfExport}`;
    const folderName = `${doctorFirstName}_${doctorLastName}_${doctorOHIP}`;
    const fileName = `${patientFirstName}_${patientLastName}_${patientId}_${patientDob}.xml`;
    const reportsFilesFolderName = "Reports_files";

    //Paths
    const downloadsPath = path.join(os.homedir(), "Downloads");
    const exportFolderPath = path.join(downloadsPath, exportFolderName);
    const folderPath = path.join(downloadsPath, exportFolderName, folderName);
    const filePath = path.join(folderPath, fileName);
    const reportsFilesPath = path.join(folderPath, reportsFilesFolderName);

    //Create folders
    if (!fs.existsSync(exportFolderPath)) {
      fs.mkdirSync(exportFolderPath);
    }
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    if (!fs.existsSync(reportsFilesPath)) {
      fs.mkdirSync(reportsFilesPath);
    }

    //Create ReadMe text
    const readMeContent = `This EMR export from CalvinEMR software was performed by ${authorName} on ${new Date().toUTCString()}`;
    const readMePath = path.join(folderPath, "README.md");

    //Write file asynchronously
    fs.writeFile(filePath, xmlFinal, (err) => {
      if (err) {
        console.error("Error when writing XML file: ", err);
      } else {
        console.log("XML file saved successfully in Downloads folder.");
      }
    });
    fs.writeFile(readMePath, readMeContent, (err) => {
      if (err) {
        console.error("Error when writing README file: ", err);
      } else {
        console.log("README file saved successfully in Downloads folder.");
      }
    });

    console.log(reportsFiles);
    for (let reportFile of reportsFiles) {
      console.log(reportFile.url);
      const url = reportFile.url;
      const destinationPath = path.join(reportsFilesPath, `${reportFile.name}`);
      try {
        const response = await axios.get(url, { responseType: "stream" });

        const fileStream = fs.createWriteStream(destinationPath);
        response.data.pipe(fileStream);

        await new Promise((resolve, reject) => {
          fileStream.on("finish", resolve);
          fileStream.on("error", reject);
        });

        console.log("File downloaded successfully.");
      } catch (error) {
        console.error(`Error downloading file: ${error.message}`);
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
//****************************************************//

// //*************** Endpoint to connect to Xano **********//
// // Create a custom API endpoint to receive data
// app.post("/xano-message", (req, res) => {
//   // Extract the message from the request body
//   const message = req.body;
//   // Broadcast the message to all connected clients
//   io.emit(`xano message`, message);
//   // Respond to the HTTP request
//   res.status(200).send("Message sent successfully");
// });

//****************** MY APP *****************/

//Dans les autres cas on renvoie la single page app
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
