import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyTasks } from '../../api/tasks';
import { getMyDocuments } from '../../api/documents';   // ✅ add this import
import { CheckSquare, FileText, Send } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ tasks: 0, documents: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tasks = await getMyTasks();
        const docs = await getMyDocuments();   // ✅ now defined
        setStats({ tasks: tasks.length, documents: docs.length });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { title: 'My Tasks', count: stats.tasks, icon: CheckSquare, color: 'bg-green-500', path: '/employee/my-tasks' },
    { title: 'My Documents', count: stats.documents, icon: FileText, color: 'bg-purple-500', path: '/employee/my-documents' },
    { title: 'Send Request', icon: Send, color: 'bg-blue-500', path: '/employee/send-request' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}</h1>
      <p className="text-gray-500 mb-8">Your work dashboard</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <div key={action.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{action.title}</p>
                {action.count !== undefined && (
                  <p className="text-3xl font-bold text-gray-800 mt-1">{action.count}</p>
                )}
              </div>
              <div className={`${action.color} p-3 rounded-full`}>
                <action.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;