// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../api/employees';
import { getRequests } from '../../api/requests';
import { Users, MessageSquare, CheckSquare, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    employees: 0,
    pendingRequests: 0,   // renamed for clarity
    tasks: 0,
    documents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const employees = await getEmployees();
        const requests = await getRequests();                      // ✅ fixed
        const pendingCount = requests.filter(r => r.status === 'pending').length;

        setStats({
          employees: employees.length,
          pendingRequests: pendingCount,                           // show pending count
          tasks: 0,
          documents: 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Employees', value: stats.employees, icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Requests', value: stats.pendingRequests, icon: MessageSquare, color: 'bg-yellow-500' },
    { title: 'Active Tasks', value: stats.tasks, icon: CheckSquare, color: 'bg-green-500' },
    { title: 'Documents', value: stats.documents, icon: FileText, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}</h1>
      <p className="text-gray-500 mb-8">Here's what's happening with your workforce today</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <p className="font-medium">Add New Employee</p>
            <p className="text-sm text-gray-500">Expand your team</p>
          </button>
          <button className="text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <p className="font-medium">Assign Task</p>
            <p className="text-sm text-gray-500">Delegate work to employees</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;