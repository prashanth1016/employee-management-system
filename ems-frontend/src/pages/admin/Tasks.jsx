import { useEffect, useState } from 'react';
import { getAllTasks, assignTask } from '../../api/tasks';
import { getEmployees } from '../../api/employees';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employee_id: '', title: '', description: '', deadline: '' });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };
  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };
  const handleAssign = async (e) => {
    e.preventDefault();
    await assignTask(form);
    setShowModal(false);
    fetchTasks();
    setForm({ employee_id: '', title: '', description: '', deadline: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={18}/> Assign Task</button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr><th>Title</th><th>Assigned To</th><th>Deadline</th><th>Status</th><th>Completed At</th></tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="px-4 py-2">{task.title}</td>
                <td>{task.employee_name}</td>
                <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</td>
                <td>{task.status}</td>
                <td>{task.completed_at ? new Date(task.completed_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Assign New Task</h2>
            <form onSubmit={handleAssign}>
              <select required value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})} className="w-full border p-2 rounded mb-3">
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <input type="text" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded mb-3" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded mb-3" rows="3" />
              <input type="date" required value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full border p-2 rounded mb-4" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Tasks;