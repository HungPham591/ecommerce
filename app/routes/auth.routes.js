const express = require("express");
const jwt = require("../middlewares/jwt")
const auth = require("../controllers/auth.controller");
const router = express.Router();

router.post('/signin', auth.signIn);
router.post('/signup', auth.signUp);
router.post('/signout', jwt.verifyToken, auth.signOut);
router.get('/info',jwt.verifyToken, auth.getInfo);
router.get('/allinfo',jwt.verifyToken, auth.getAllInfo);
router.put('/changepass', jwt.verifyToken, auth.changePassword);
router.put('/changeinfo', jwt.verifyToken, auth.changeInfo);

module.exports = router;