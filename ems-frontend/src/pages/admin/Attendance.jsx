// src/pages/admin/Attendance.jsx
import { useEffect, useState } from 'react';
import { getCurrentStatus, getDailyAttendance } from '../../api/attendance';
import { Users, Clock, Calendar } from 'lucide-react';

const Attendance = () => {
  const [currentStatus, setCurrentStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDaily, setLoadingDaily] = useState(false);

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  useEffect(() => {
    if (selectedDate) fetchDailyAttendance();
  }, [selectedDate]);

  const fetchCurrentStatus = async () => {
    try {
      const data = await getCurrentStatus();
      setCurrentStatus(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyAttendance = async () => {
    setLoadingDaily(true);
    try {
      const data = await getDailyAttendance(selectedDate);
      setDailyData(data);
    } finally {
      setLoadingDaily(false);
    }
  };

  const onlineCount = currentStatus.filter(e => e.status === 'online').length;
  const offlineCount = currentStatus.length - onlineCount;

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance & Login Tracking</h1>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold">{currentStatus.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm text-gray-500">Currently Online</p>
              <p className="text-2xl font-bold">{onlineCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <div>
              <p className="text-sm text-gray-500">Offline</p>
              <p className="text-2xl font-bold">{offlineCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Status Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Live Login Status</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Login Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStatus.map(emp => (
              <tr key={emp.employee_id}>
                <td className="px-6 py-4 whitespace-nowrap">{emp.emp_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 ${emp.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${emp.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {emp.login_time ? new Date(emp.login_time).toLocaleTimeString() : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.ip_address || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Attendance Summary */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Daily Attendance Record</h2>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-3 py-1"
            />
          </div>
        </div>
        {loadingDaily ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Logout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyData.map(record => (
                <tr key={record.employee_id}>
                  <td className="px-6 py-4 whitespace-nowrap">{record.emp_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.first_login ? new Date(record.first_login).toLocaleTimeString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.last_logout ? new Date(record.last_logout).toLocaleTimeString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.total_hours} hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.sessions_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;