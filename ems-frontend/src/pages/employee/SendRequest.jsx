// src/pages/employee/SendRequest.jsx
import { useState, useEffect } from 'react';
import { createRequest, getMyRequests } from '../../api/requests';
import { Send, Loader, CheckCircle, XCircle, Clock } from 'lucide-react';

const SendRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const data = await getMyRequests();
      setMyRequests(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRequest({ title, description });
      setTitle('');
      setDescription('');
      fetchMyRequests();
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={18} />;
      case 'rejected': return <XCircle className="text-red-500" size={18} />;
      default: return <Clock className="text-yellow-500" size={18} />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Send Request</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">New Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {submitting ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
            Submit Request
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
        {loading ? (
          <div className="text-center py-8"><Loader className="animate-spin mx-auto" /></div>
        ) : myRequests.length === 0 ? (
          <p className="text-gray-500">No requests yet.</p>
        ) : (
          <div className="space-y-4">
            {myRequests.map(req => (
              <div key={req.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{req.title}</h3>
                    <p className="text-gray-600 mt-1">{req.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(req.status)}
                    <span className="capitalize text-sm">{req.status}</span>
                  </div>
                </div>
                {req.admin_remark && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm">
                    <span className="font-medium">Admin Remark:</span> {req.admin_remark}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendRequest;