import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadDocument } from '../../api/documents';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

const UploadDocument = () => {
  const { user } = useAuth();
  const [fileType, setFileType] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const documentTypes = [
    { value: 'resume', label: 'Resume' },
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'marksheet', label: 'Marksheet' },
    { value: 'certificate', label: 'Certificate' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileType || !file) {
      setMessage({ type: 'error', text: 'Please select document type and file' });
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(user.userId, fileType, file);
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setFileType('');
      setFile(null);
      e.target.reset();
      // Clear file input value
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Document</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? <FileCheck size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select type</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File (PDF, JPG, PNG)
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadDocument;