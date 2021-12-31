const express = require("express");
const buy = require("../controllers/buy.controller");
const router = express.Router();
const jwt = require('../middlewares/jwt');

router.get('/', buy.getAll);
router.get('/:id', buy.findById);
router.post('/', buy.create);
router.put('/:id', buy.update)
router.delete('/:id', buy.removeById);
router.patch('/multi-delete', buy.removeMultiRows);
router.put('/remove-buy-item/:buyItemId', buy.removeBuyItem);
router.post('/:id', buy.addMoreBuyItem);

module.exports = router;