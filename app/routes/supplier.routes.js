const express = require("express");
const supplier = require("../controllers/supplier.controller");
const router = express.Router();

router.get('/', supplier.getAll);
router.get('/:id', supplier.findById);
router.post('/', supplier.create);
router.put('/:id', supplier.update)
router.delete('/:id', supplier.removeById);
router.patch('/multi-delete', supplier.removeMultiRows);

module.exports = router;