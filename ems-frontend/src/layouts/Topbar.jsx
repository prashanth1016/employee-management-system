import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <User size={20} className="text-gray-500" />
        <span className="text-gray-700 font-medium">{user?.name}</span>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
          {user?.role === 'admin' ? 'Administrator' : 'Employee'}
        </span>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </header>
  );
};

export default Topbar;