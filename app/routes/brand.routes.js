const express = require("express");
const brand = require("../controllers/brand.controller");
const router = express.Router();
const jwt = require('../middlewares/jwt');

router.get('/', brand.getAll);
router.get('/:id', brand.findById);
router.post('/',jwt.isAdmin, brand.create);
router.put('/:id',jwt.isAdmin, brand.update)
router.delete('/:id',jwt.isAdmin, brand.removeById);
router.patch('/multi-delete',jwt.isAdmin, brand.removeMultiRows);

module.exports = router;