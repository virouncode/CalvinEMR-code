var express = require("express");
var extractToTextRouter = express.Router();
var extractToTextController = require("../../controllers/extractToTextController");

extractToTextRouter.route("/").post(extractToTextController.postExtractToText);

module.exports = extractToTextRouter;
