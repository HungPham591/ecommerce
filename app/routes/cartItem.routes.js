const express = require("express");
const cartItem = require("../controllers/cartItem.controller");
const router = express.Router();
const jwt = require("../middlewares/jwt");

router.get("/", cartItem.getAll);
router.get('/myorder', cartItem.getMyOrder);
router.get("/:id", cartItem.findById);
router.post("/", cartItem.create);
router.put("/:id", cartItem.update);
router.delete("/:id", cartItem.removeById);
router.patch("/multi-delete", cartItem.removeMultiRows);

module.exports = router;
