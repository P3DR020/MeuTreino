import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function Progress() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/workouts");
        setWorkouts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  const handleSelectExercise = async (exercise) => {
    setSelectedExercise(exercise);
    setLoading(true);
    try {
      const res = await api.get(`/sessions/progress/${exercise.id}`);
      const data = res.data.map((item) => ({
        data: new Date(item.date).toLocaleDateString("pt-BR"),
        peso: item.weightKg,
        reps: item.repsDone,
      }));
      setProgress(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const allExercises = workouts.flatMap((w) => w.exercises);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-8">Progresso</h2>

        {/* Seletor de exercício */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-4">
            Selecione um exercício
          </h3>
          <div className="flex flex-wrap gap-2">
            {allExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleSelectExercise(exercise)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  selectedExercise?.id === exercise.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {exercise.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gráfico */}
        {selectedExercise && (
          <div className="bg-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-6">
              {selectedExercise.name} — Evolução de peso (kg)
            </h3>

            {loading ? (
              <p className="text-gray-400">Carregando...</p>
            ) : progress.length === 0 ? (
              <p className="text-gray-400">
                Nenhum dado registrado ainda para este exercício.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="data"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="peso"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Progress;
