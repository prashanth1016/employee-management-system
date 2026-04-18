import { useState, useEffect } from 'react';
import { createLeaveRequest, getMyLeaveRequests } from '../../api/leave';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LeaveRequest = () => {
  const [category, setCategory] = useState('casual');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getMyLeaveRequests();
      setRequests(data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLeaveRequest({ category, from_date: fromDate.toISOString().split('T')[0], to_date: toDate.toISOString().split('T')[0], reason });
      setMessage('Leave request submitted');
      fetchRequests();
      setReason('');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leave Request</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2 rounded">
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="earned">Earned Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
          <div><label>From Date</label><DatePicker selected={fromDate} onChange={date => setFromDate(date)} className="w-full border p-2 rounded" /></div>
          <div><label>To Date</label><DatePicker selected={toDate} onChange={date => setToDate(date)} className="w-full border p-2 rounded" /></div>
          <textarea placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} rows="3" className="w-full border p-2 rounded" required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Submit Request</button>
          {message && <p className="text-green-600">{message}</p>}
        </form>
      </div>
      <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-2">Category</th><th>From</th><th>To</th><th>Status</th><th>Admin Remark</th></tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td className="px-4 py-2">{req.category}</td>
                <td>{new Date(req.from_date).toLocaleDateString()}</td>
                <td>{new Date(req.to_date).toLocaleDateString()}</td>
                <td><span className={`px-2 py-1 rounded-full text-xs ${req.status === 'approved' ? 'bg-green-100 text-green-800' : req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{req.status}</span></td>
                <td>{req.admin_remark || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequest;