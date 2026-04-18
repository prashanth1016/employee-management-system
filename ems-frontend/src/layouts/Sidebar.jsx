// src/layouts/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Bell,
  Calendar,
  User,
  Upload,
  Send,
  LogOut,
  Clock,           // <-- ADD THIS IMPORT
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/employees', icon: <Users size={20} />, label: 'Employees' },
    { path: '/admin/tasks', icon: <ClipboardList size={20} />, label: 'Tasks' },
    { path: '/admin/requests', icon: <Bell size={20} />, label: 'Requests' },
    { path: '/admin/documents', icon: <FileText size={20} />, label: 'Documents' },
    { path: '/admin/leave-requests', icon: <Calendar size={20} />, label: 'Leave Requests' },
    { path: '/admin/attendance', icon: <Clock size={20} />, label: 'Attendance' },  // <-- NEW
  ];

  const employeeMenuItems = [
    { path: '/employee/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/employee/tasks', icon: <ClipboardList size={20} />, label: 'My Tasks' },
    { path: '/employee/upload', icon: <Upload size={20} />, label: 'Upload Document' },
    { path: '/employee/documents', icon: <FileText size={20} />, label: 'My Documents' },
    { path: '/employee/send-request', icon: <Send size={20} />, label: 'Send Request' },
    { path: '/employee/leave-request', icon: <Calendar size={20} />, label: 'Leave Request' },
    { path: '/employee/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">SPARK INTELLECT</h1>
        <p className="text-xs text-gray-500 mt-1">Employee Management</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;