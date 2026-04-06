const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', sessionController.create);
router.get('/history', sessionController.getHistory);
router.get('/progress/:exerciseId', sessionController.getProgress);

module.exports = router;