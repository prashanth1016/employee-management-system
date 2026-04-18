// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeByUserId } from '../api/employees';
import axiosInstance from '../api/axiosInstance';   // needed for logout API call

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('user_id');
    const employeeId = localStorage.getItem('employee_id');
    const sessionId = localStorage.getItem('session_id');
    
    if (token && role) {
      setUser({ 
        token, 
        role, 
        name, 
        userId: userId ? parseInt(userId) : null,
        employeeId: employeeId ? parseInt(employeeId) : null,
        sessionId: sessionId ? parseInt(sessionId) : null
      });
    }
    setLoading(false);
  }, []);

  const login = async (token, role, name, userId, firstLogin, sessionId) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('user_id', userId);
    if (sessionId) localStorage.setItem('session_id', sessionId);
    
    setUser({ token, role, name, userId, sessionId });

    if (firstLogin) {
      navigate('/change-password');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      // Fetch employee id for employee
      try {
        const empData = await getEmployeeByUserId(userId);
        localStorage.setItem('employee_id', empData.id);
        setUser(prev => ({ ...prev, employeeId: empData.id }));
      } catch (e) { console.error(e); }
      navigate('/employee/dashboard');
    }
  };

  const logout = async () => {
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
      try {
        // Call logout endpoint to update logout_time
        await axiosInstance.post('/auth/logout', null, { 
          params: { session_id: sessionId } 
        });
      } catch (e) {
        console.error('Logout API error:', e);
      }
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('employee_id');
    localStorage.removeItem('session_id');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};