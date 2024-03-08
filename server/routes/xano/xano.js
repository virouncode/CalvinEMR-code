var express = require("express");
var xanoRouter = express.Router();
let authToken;
var xanoController = require("../../controllers/xanoController");

xanoRouter
  .route("/")
  .get(xanoController.getXano)
  .post(xanoController.postXano)
  .put(xanoController.putXano)
  .delete(xanoController.deleteXano);

xanoRouter.route("/auth").post(xanoController.authXano);

xanoRouter.route("/reset").post(xanoController.resetXano);

module.exports = xanoRouter;
