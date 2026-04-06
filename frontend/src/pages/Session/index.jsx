import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

function Session() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchWorkout();
  }, []);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const fetchWorkout = async () => {
    try {
      const res = await api.get('/workouts');
      const found = res.data.find((w) => w.id === Number(workoutId));
      setWorkout(found);

      // Inicializa os sets para cada exercício
      const initialSets = found.exercises.flatMap((exercise) =>
        Array.from({ length: exercise.sets }, (_, i) => ({
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          setNumber: i + 1,
          weightKg: '',
          repsDone: exercise.reps,
          done: false,
        }))
      );
      setSets(initialSets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...sets];
    updated[index][field] = value;
    setSets(updated);
  };

  const toggleDone = (index) => {
    const updated = [...sets];
    updated[index].done = !updated[index].done;
    setSets(updated);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const payload = sets.map((s) => ({
        exerciseId: s.exerciseId,
        setNumber: s.setNumber,
        weightKg: Number(s.weightKg) || 0,
        repsDone: Number(s.repsDone) || 0,
      }));
      await api.post('/sessions', { workoutId: Number(workoutId), sets: payload });
      navigate('/history');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900"><Navbar />
      <p className="text-gray-400 p-8">Carregando...</p>
    </div>
  );

  const doneSets = sets.filter((s) => s.done).length;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{workout?.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{doneSets}/{sets.length} séries concluídas</p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-white">{formatTime(timer)}</p>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`text-xs px-3 py-1 rounded-lg mt-1 transition ${timerRunning ? 'bg-red-600/30 text-red-400' : 'bg-green-600/30 text-green-400'}`}
            >
              {timerRunning ? 'Pausar' : 'Iniciar'}
            </button>
          </div>
        </div>

        {/* Progresso */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${sets.length > 0 ? (doneSets / sets.length) * 100 : 0}%` }}
          />
        </div>

        {/* Séries por exercício */}
        {workout?.exercises?.map((exercise) => (
          <div key={exercise.id} className="bg-gray-800 rounded-xl p-5 mb-4">
            <h3 className="text-white font-semibold mb-1">{exercise.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{exercise.muscleGroup}</p>

            <div className="space-y-3">
              {sets
                .map((set, index) => ({ ...set, index }))
                .filter((set) => set.exerciseId === exercise.id)
                .map((set) => (
                  <div key={set.index} className={`flex items-center gap-3 p-3 rounded-lg transition ${set.done ? 'bg-green-600/10 border border-green-600/30' : 'bg-gray-700'}`}>
                    <span className="text-gray-400 text-sm w-16">Série {set.setNumber}</span>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="number"
                        value={set.weightKg}
                        onChange={(e) => handleChange(set.index, 'weightKg', e.target.value)}
                        placeholder="kg"
                        className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={set.repsDone}
                        onChange={(e) => handleChange(set.index, 'repsDone', e.target.value)}
                        placeholder="reps"
                        className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => toggleDone(set.index)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${set.done ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400 hover:bg-gray-500'}`}
                    >
                      {set.done ? '✓' : '○'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleFinish}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50 mt-4"
        >
          {saving ? 'Salvando...' : '🏁 Finalizar Treino'}
        </button>
      </div>
    </div>
  );
}

export default Session;