import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutsRes, historyRes] = await Promise.all([
          api.get('/workouts'),
          api.get('/sessions/history'),
        ]);
        setWorkouts(workoutsRes.data);
        setHistory(historyRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const lastSession = history[0];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-1">
          Olá, {user?.name}! 👋
        </h2>
        <p className="text-gray-400 mb-8">Pronto para treinar hoje?</p>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total de treinos</p>
            <p className="text-3xl font-bold text-white mt-1">{workouts.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Sessões realizadas</p>
            <p className="text-3xl font-bold text-white mt-1">{history.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Último treino</p>
            <p className="text-lg font-bold text-white mt-1">
              {lastSession
                ? new Date(lastSession.date).toLocaleDateString('pt-BR')
                : 'Nenhum ainda'}
            </p>
          </div>
        </div>

        {/* Treinos disponíveis */}
        <h3 className="text-lg font-semibold text-white mb-4">Seus treinos</h3>

        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : workouts.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-4">Você ainda não tem treinos cadastrados.</p>
            <button
              onClick={() => navigate('/workouts')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Criar primeiro treino
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-gray-800 rounded-xl p-5 flex justify-between items-center">
                <div>
                  <h4 className="text-white font-semibold">{workout.name}</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {workout.exercises.length} exercício(s)
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/session/${workout.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Iniciar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;