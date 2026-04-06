import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workouts');
      setWorkouts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workouts', { name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      fetchWorkouts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deletar este treino?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Meus Treinos</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : '+ Novo Treino'}
          </button>
        </div>

        {/* Formulário de criação */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-gray-800 rounded-xl p-6 mb-6 space-y-4">
            <h3 className="text-white font-semibold text-lg">Novo Treino</h3>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Treino B - Costas e Bíceps"
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Descrição (opcional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Foco em hipertrofia"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Criar Treino
            </button>
          </form>
        )}

        {/* Lista de treinos */}
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : workouts.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">Nenhum treino cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-gray-800 rounded-xl p-5 flex items-center justify-between">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                >
                  <h4 className="text-white font-semibold">{workout.name}</h4>
                  {workout.description && (
                    <p className="text-gray-400 text-sm mt-1">{workout.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {workout.exercises.length} exercício(s)
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/session/${workout.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Iniciar
                  </button>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg text-sm transition"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;