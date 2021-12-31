const express = require("express");
const category = require("../controllers/category.controller");
const router = express.Router();
const jwt = require('../middlewares/jwt');

router.get('/', category.getAll);
router.get('/:id', category.findById);
router.post('/', jwt.isAdmin, category.create);
router.put('/:id',jwt.isAdmin,  category.update);
router.delete('/:id', jwt.isAdmin, category.removeById);
router.patch('/multi-delete', jwt.isAdmin, category.removeMultiRows);

module.exports = router;