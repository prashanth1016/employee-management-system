import { useEffect, useState } from 'react';
import { getMyTasks, completeTask } from '../../api/tasks';
import { CheckCircle } from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState(null);

  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = async () => {
    const data = await getMyTasks();
    setTasks(data);
  };
  const handleComplete = async (e) => {
    e.preventDefault();
    await completeTask(selectedTask.id, notes, attachment);
    setShowModal(false);
    fetchTasks();
    setNotes('');
    setAttachment(null);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between">
              <div><h3 className="font-bold">{task.title}</h3><p className="text-gray-600">{task.description}</p><p className="text-sm text-gray-500">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p></div>
              {task.status !== 'completed' && <button onClick={() => { setSelectedTask(task); setShowModal(true); }} className="bg-green-600 text-white px-3 py-1 rounded">Mark Complete</button>}
              {task.status === 'completed' && <span className="text-green-600 flex items-center"><CheckCircle size={16} className="mr-1"/> Completed</span>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Complete Task: {selectedTask?.title}</h2>
            <form onSubmit={handleComplete}>
              <textarea placeholder="Completion Notes" value={notes} onChange={e => setNotes(e.target.value)} className="w-full border p-2 rounded mb-3" rows="3" required />
              <input type="file" onChange={e => setAttachment(e.target.files[0])} className="mb-4" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyTasks;