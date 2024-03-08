var express = require("express");
var writeXMLRouter = express.Router();
var writeXMLController = require("../../controllers/writeXMLController");

writeXMLRouter.route("/").post(writeXMLController.postWriteXML);

module.exports = writeXMLRouter;
