const prisma = require('../config/prisma');

const getAll = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.userId },
      include: { exercises: true },
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar treinos' });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workout = await prisma.workout.create({
      data: { name, description, userId: req.userId },
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar treino' });
  }
};

const update = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workout = await prisma.workout.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar treino' });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.workout.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: 'Treino deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar treino' });
  }
};

module.exports = { getAll, create, update, remove };