const express = require("express");
const statistic = require("../controllers/statistic.controller");
const router = express.Router();

router.get('/category', statistic.getByCategory);
router.get('/top-product', statistic.getTopProduct);
router.get('/low-product', statistic.getLowProduct);
router.get('/over-time', statistic.getByTime);
router.get('/inventory',statistic.getInventory )


module.exports = router;