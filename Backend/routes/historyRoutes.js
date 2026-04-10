const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getUserHistory);

module.exports = router;