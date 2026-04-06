import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Session from './pages/Session';
import History from './pages/History';
import Progress from './pages/Progress';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
      <Route path="/workouts/:id" element={<PrivateRoute><WorkoutDetail /></PrivateRoute>} />
      <Route path="/session/:workoutId" element={<PrivateRoute><Session /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
    </Routes>
  );
}

export default App;