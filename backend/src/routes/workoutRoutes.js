const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Todas as rotas precisam de token

router.get('/', workoutController.getAll);
router.post('/', workoutController.create);
router.put('/:id', workoutController.update);
router.delete('/:id', workoutController.remove);

module.exports = router;