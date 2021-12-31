const express = require("express");
const review = require("../controllers/review.controller");
const router = express.Router();
const jwt = require("../middlewares/jwt");

router.get("/", review.getAll);
router.get("/:id", review.findById);
router.post("/", jwt.verifyToken, review.create);
router.put("/:id",jwt.verifyToken, review.update);
router.delete("/:id", jwt.verifyToken, review.removeById);
router.patch("/multi-delete", jwt.verifyToken, review.removeMultiRows);

module.exports = router;