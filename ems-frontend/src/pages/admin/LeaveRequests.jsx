import { useEffect, useState } from 'react';
import { getAllLeaveRequests, updateLeaveStatus } from '../../api/leave';

const AdminLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getAllLeaveRequests();
      setLeaves(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    const adminRemark = remark[id] || '';
    await updateLeaveStatus(id, status, adminRemark);
    fetchLeaves();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leave Requests</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr><th>Employee</th><th>Emp ID</th><th>Category</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Admin Remark</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave.id}>
                <td className="px-4 py-2">{leave.employee_name}</td>
                <td>{leave.emp_id}</td>
                <td>{leave.category}</td>
                <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                <td><input type="text" placeholder="Remark" value={remark[leave.id] || ''} onChange={e => setRemark({...remark, [leave.id]: e.target.value})} className="border p-1 rounded" /></td>
                <td>
                  {leave.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(leave.id, 'approved')} className="bg-green-500 text-white px-2 py-1 rounded mr-1">Approve</button>
                      <button onClick={() => handleAction(leave.id, 'rejected')} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaveRequests;