const prisma = require('../config/prisma');

const create = async (req, res) => {
  try {
    const { name, muscleGroup, sets, reps, restSeconds } = req.body;
    const exercise = await prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        sets,
        reps,
        restSeconds,
        workoutId: Number(req.params.workoutId),
      },
    });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar exercício' });
  }
};

const update = async (req, res) => {
  try {
    const { name, muscleGroup, sets, reps, restSeconds } = req.body;
    const exercise = await prisma.exercise.update({
      where: { id: Number(req.params.id) },
      data: { name, muscleGroup, sets, reps, restSeconds },
    });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar exercício' });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.exercise.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: 'Exercício deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar exercício' });
  }
};

module.exports = { create, update, remove };