const express = require("express");
const order = require("../controllers/order.controller");
const router = express.Router();
const jwt = require("../middlewares/jwt");

router.get("/", jwt.verifyToken, jwt.isAdmin, order.getAll);
router.get("/:id", jwt.verifyToken, order.findById);
router.put("/:id/hide", jwt.verifyToken, order.hideById);
router.put("/:id", jwt.verifyToken, jwt.isAdmin, order.changStatus);
router.delete("/:id", jwt.verifyToken, jwt.isAdmin, order.removeById);
router.patch(
  "/multi-delete",
  jwt.verifyToken,
  jwt.isAdmin,
  order.removeMultiRows
);

module.exports = router;
