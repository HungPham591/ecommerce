const express = require("express");
const payment = require("../controllers/payment.controller");
const router = express.Router();
const jwt = require("../middlewares/jwt");

router.post("/new", jwt.verifyToken, payment.createNew);
router.get("/success", payment.success);
router.get("/cancel", payment.cancel);
router.post("/newoffline", payment.createNewOffline);

module.exports = router;