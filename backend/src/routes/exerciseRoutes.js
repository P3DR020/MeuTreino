const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/:workoutId/exercises', exerciseController.create);
router.put('/exercises/:id', exerciseController.update);
router.delete('/exercises/:id', exerciseController.remove);

module.exports = router;