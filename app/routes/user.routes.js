const express = require("express");
const user = require("../controllers/user.controller");
const router = express.Router();

router.get('/', user.getAll);
router.get('/:id', user.findById);
router.post('/', user.create);
router.put('/:id', user.update);
router.delete('/:id', user.removeById);
router.patch('/multi-delete', user.removeMultiRows);

module.exports = router;