const express = require("express");
const city = require("../controllers/city.controller");
const router = express.Router();
const jwt = require('../middlewares/jwt');

router.get('/', city.getAll);
router.get('/:id', city.findById);
router.post('/', jwt.isAdmin, city.create);
router.put('/:id', jwt.isAdmin, city.update)
router.delete('/:id', jwt.isAdmin, city.removeById);
router.patch('/multi-delete', jwt.isAdmin, city.removeMultiRows);

module.exports = router;