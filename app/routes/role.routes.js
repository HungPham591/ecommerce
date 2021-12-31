const express = require("express");
const role = require("../controllers/role.controller");
const router = express.Router();

router.get('/', role.getAll);
router.get('/:id', role.findById);
router.get('/:id/users', role.getAllUsers);
router.post('/:id/users', role.addUserRoles);
router.put('/:id/users', role.deleteUserRoles);
router.put('/:id', role.update);

// router.post('/', role.create);
// router.delete('/:id', role.removeById);
// router.patch('/multi-delete', role.removeMultiRows);

module.exports = router;