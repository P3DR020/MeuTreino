import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/sessions/history");
        setHistory(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-8">
          Histórico de Treinos
        </h2>

        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : history.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">Nenhum treino registrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((session) => (
              <div key={session.id} className="bg-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">
                    {session.workout.name}
                  </h3>
                  <span className="text-gray-400 text-sm">
                    {new Date(session.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {session.sessionSets.length} séries realizadas
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    ...new Set(session.sessionSets.map((s) => s.exercise.name)),
                  ].map((name) => (
                    <span
                      key={name}
                      className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
