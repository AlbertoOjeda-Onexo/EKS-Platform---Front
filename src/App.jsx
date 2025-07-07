import react from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Vacantes from './pages/Vacantes';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateLayout from './layouts/PrivateLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/" element={<ProtectedRoute><PrivateLayout><Vacantes /></PrivateLayout></ProtectedRoute>}/>
        <Route path="*" element={<ProtectedRoute><PrivateLayout><Vacantes /></PrivateLayout></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
