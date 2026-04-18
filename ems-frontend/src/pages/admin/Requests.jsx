// src/pages/admin/Requests.jsx
import { useEffect, useState } from 'react';
import { getRequests, updateRequestStatus } from '../../api/requests';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remark, setRemark] = useState('');
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setRemark('');
    setShowModal(true);
  };

  const submitAction = async () => {
    if (!selectedRequest) return;
    try {
      await updateRequestStatus(selectedRequest.id, {
        status: actionType,
        admin_remark: remark
      });
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      alert('Failed to update request');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>{status}</span>;
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Employee Requests</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(req => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap">{req.employee_name || `Emp #${req.employee_id}`}</td>
                <td className="px-6 py-4">{req.title}</td>
                <td className="px-6 py-4">{req.description}</td>
                <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {req.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(req, 'approved')}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleAction(req, 'rejected')}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Remark: {req.admin_remark || '—'}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for remark */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {actionType === 'approved' ? 'Approve Request' : 'Reject Request'}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Remark (optional)</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full border rounded-lg p-2"
                rows="3"
                placeholder="Add a note for the employee..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className={`px-4 py-2 text-white rounded-lg ${
                  actionType === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;