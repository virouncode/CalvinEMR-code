var express = require("express");
var twilioRouter = express.Router();
var twilioController = require("../../controllers/twilioController");

twilioRouter.route("/").post(twilioController.postTwilio);

module.exports = twilioRouter;
