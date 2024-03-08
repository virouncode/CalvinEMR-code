var express = require("express");
var xmlToJsRouter = express.Router();
var xmlToJsController = require("../../controllers/xmlToJsController");

xmlToJsRouter.route("/").post(xmlToJsController.postXmlToJs);

module.exports = xmlToJsRouter;
