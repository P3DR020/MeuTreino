import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', muscleGroup: '', sets: '', reps: '', restSeconds: ''
  });

  useEffect(() => {
    fetchWorkout();
  }, []);

  const fetchWorkout = async () => {
    try {
      const res = await api.get(`/workouts`);
      const found = res.data.find((w) => w.id === Number(id));
      setWorkout(found);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/workouts/${id}/exercises`, {
        ...form,
        sets: Number(form.sets),
        reps: Number(form.reps),
        restSeconds: Number(form.restSeconds),
      });
      setForm({ name: '', muscleGroup: '', sets: '', reps: '', restSeconds: '' });
      setShowForm(false);
      fetchWorkout();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (exerciseId) => {
    if (!confirm('Deletar este exercício?')) return;
    try {
      await api.delete(`/workouts/exercises/${exerciseId}`);
      fetchWorkout();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <p className="text-gray-400 p-8">Carregando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate('/workouts')}
          className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition"
        >
          ← Voltar
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{workout?.name}</h2>
            {workout?.description && (
              <p className="text-gray-400 mt-1">{workout.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
            >
              {showForm ? 'Cancelar' : '+ Exercício'}
            </button>
            <button
              onClick={() => navigate(`/session/${id}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
            >
              Iniciar Treino
            </button>
          </div>
        </div>

        {/* Formulário novo exercício */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-gray-800 rounded-xl p-6 mb-6 space-y-4">
            <h3 className="text-white font-semibold">Novo Exercício</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Supino Reto"
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Grupo Muscular</label>
                <input
                  type="text"
                  value={form.muscleGroup}
                  onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
                  placeholder="Ex: Peito"
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Séries</label>
                <input
                  type="number"
                  value={form.sets}
                  onChange={(e) => setForm({ ...form, sets: e.target.value })}
                  placeholder="Ex: 4"
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Repetições</label>
                <input
                  type="number"
                  value={form.reps}
                  onChange={(e) => setForm({ ...form, reps: e.target.value })}
                  placeholder="Ex: 10"
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Descanso (segundos)</label>
                <input
                  type="number"
                  value={form.restSeconds}
                  onChange={(e) => setForm({ ...form, restSeconds: e.target.value })}
                  placeholder="Ex: 90"
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Adicionar Exercício
            </button>
          </form>
        )}

        {/* Lista de exercícios */}
        {workout?.exercises?.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">Nenhum exercício cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workout?.exercises?.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">{exercise.name}</h4>
                  <p className="text-gray-400 text-sm mt-1">{exercise.muscleGroup}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-gray-500 text-xs">{exercise.sets} séries</span>
                    <span className="text-gray-500 text-xs">{exercise.reps} reps</span>
                    <span className="text-gray-500 text-xs">{exercise.restSeconds}s descanso</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg text-sm transition"
                >
                  Deletar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutDetail;