const express = require("express");
const product = require("../controllers/product.controller");
const router = express.Router();
const jwt = require('../middlewares/jwt');

router.get('/', product.getAll);
router.get('/foryou', product.forYou)
router.get('/bestseller', product.bestSeller)
router.get('/search', product.searchAll);
router.get('/:id/related', product.relatedProducts)
router.get('/:id', product.findById);
router.put('/:id/plus', jwt.isAdmin, product.changeQuantity);
router.put('/:id/avatar', jwt.isAdmin, product.changeAvatar);
router.post('/', jwt.isAdmin, product.create);
router.put('/:id', jwt.isAdmin, product.update);
router.put('/delete-image/:imageId', jwt.isAdmin, product.deleteImage);
router.delete('/:id', jwt.isAdmin, product.removeById);
router.patch('/multi-delete', jwt.isAdmin, product.removeMultiRows);

module.exports = router;