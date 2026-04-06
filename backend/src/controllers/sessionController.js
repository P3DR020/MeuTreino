const prisma = require('../config/prisma');

const create = async (req, res) => {
  try {
    const { workoutId, sets } = req.body;
    // sets = [{ exerciseId, setNumber, weightKg, repsDone }]

    const session = await prisma.workoutSession.create({
      data: {
        userId: req.userId,
        workoutId,
        sessionSets: {
          create: sets,
        },
      },
      include: { sessionSets: true },
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar sessão' });
  }
};

const getHistory = async (req, res) => {
  try {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId: req.userId },
      include: {
        workout: true,
        sessionSets: {
          include: { exercise: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};

const getProgress = async (req, res) => {
  try {
    const sets = await prisma.sessionSet.findMany({
      where: {
        exerciseId: Number(req.params.exerciseId),
        session: { userId: req.userId },
      },
      include: { session: true },
      orderBy: { session: { date: 'asc' } },
    });

    const progress = sets.map((set) => ({
      date: set.session.date,
      weightKg: set.weightKg,
      repsDone: set.repsDone,
      setNumber: set.setNumber,
    }));

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
};

module.exports = { create, getHistory, getProgress };