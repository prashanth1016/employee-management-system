import { useEffect, useState } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../../api/employees';
import { resetUserPassword } from '../../api/auth';
import { Plus, Trash2, Loader, KeyRound } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emp_id: '',
    phone: '',
    department: '',
    salary: '',
    joining_date: '',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = {
      ...formData,
      salary: Number(formData.salary),
    };
    try {
      await createEmployee(payload);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        emp_id: '',
        phone: '',
        department: '',
        salary: '',
        joining_date: '',
        status: 'active',
      });
      fetchEmployees();
    } catch (err) {
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail.map(d => d.msg).join(', '));
        } else {
          setError(detail);
        }
      } else {
        setError(err.message || 'Failed to create employee');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleResetPassword = async (userId, empName) => {
    const newPassword = prompt(`Enter new password for ${empName}:`);
    if (newPassword && newPassword.length >= 4) {
      try {
        await resetUserPassword(userId, newPassword);
        alert('Password reset successfully. User must change on next login.');
      } catch (err) {
        alert('Reset failed: ' + (err.response?.data?.detail || err.message));
      }
    } else {
      alert('Password must be at least 4 characters');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="px-6 py-4">{emp.emp_id || '-'}</td>
                <td className="px-6 py-4">{emp.name || `Employee ${emp.user_id}`}</td>
                <td className="px-6 py-4">{emp.email || 'N/A'}</td>
                <td className="px-6 py-4">{emp.department}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleResetPassword(emp.user_id, emp.name)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Reset Password"
                  >
                    <KeyRound size={18} />
                  </button>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="text"
                placeholder="Employee ID (e.g., SPE001)"
                value={formData.emp_id}
                onChange={(e) => setFormData({...formData, emp_id: e.target.value})}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="date"
                placeholder="Joining Date"
                value={formData.joining_date}
                onChange={(e) => setFormData({...formData, joining_date: e.target.value})}
                className="w-full border rounded-lg p-2"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border rounded-lg p-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Employee'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;