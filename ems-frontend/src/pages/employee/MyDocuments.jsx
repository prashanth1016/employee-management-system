import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyDocuments, deleteDocument } from '../../api/documents';   // ← changed import
import { FileText, Trash2, Download } from 'lucide-react';

const MyDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getMyDocuments();   // ← no argument needed
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm('Delete this document?')) {
      await deleteDocument(docId);
      fetchDocuments();
    }
  };

  const handleDownload = (filePath, fileName) => {
    const url = `http://127.0.0.1:8000/${filePath}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="text-center py-12">Loading documents...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Documents</h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No documents uploaded yet
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4">{doc.file_name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {doc.file_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleDownload(doc.file_path, doc.file_name)} className="text-blue-600 hover:text-blue-800">
                      <Download size={18} />
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;