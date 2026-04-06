import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-xl">
          💪 MeuTreino
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white text-sm transition"
          >
            Dashboard
          </Link>
          <Link
            to="/workouts"
            className="text-gray-300 hover:text-white text-sm transition"
          >
            Treinos
          </Link>
          <Link
            to="/history"
            className="text-gray-300 hover:text-white text-sm transition"
          >
            Histórico
          </Link>
          <Link
            to="/progress"
            className="text-gray-300 hover:text-white text-sm transition"
          >
            Progresso
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Olá, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
