import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, uploadProfilePic, changePassword } from '../../api/employees';
import { Camera, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadProfilePic(file);
      await fetchProfile(); // refresh
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassError('Passwords do not match');
      return;
    }
    try {
      await changePassword(oldPass, newPass);
      alert('Password changed successfully');
      setShowPasswordModal(false);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setPassError('');
    } catch (err) {
      setPassError(err.response?.data?.detail || 'Failed to change password');
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;
  if (!profile) return <div className="text-center py-12 text-red-600">Failed to load profile</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profile?.profile_pic ? `http://127.0.0.1:8000/${profile.profile_pic}` : 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer">
              <Camera size={16} className="text-white" />
              <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div>
            <p className="text-xl font-semibold">{profile.name}</p>
            <p className="text-gray-600">Employee ID: {profile.emp_id}</p>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div><label className="font-medium">Department</label><p>{profile.department}</p></div>
          <div><label className="font-medium">Phone</label><p>{profile.phone}</p></div>
          <div><label className="font-medium">Joining Date</label><p>{new Date(profile.joining_date).toLocaleDateString()}</p></div>
          <div><label className="font-medium">Salary</label><p>₹{profile.salary}</p></div>
          <div><label className="font-medium">Total Leaves</label><p>{profile.total_leaves}</p></div>
          <div><label className="font-medium">Used Leaves</label><p>{profile.used_leaves}</p></div>
          <div><label className="font-medium">Pending Leaves</label><p>{profile.pending_leaves}</p></div>
        </div>
        <button onClick={() => setShowPasswordModal(true)} className="mt-4 bg-gray-200 px-4 py-2 rounded">
          Change Password
        </button>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            {passError && <div className="text-red-600 mb-2">{passError}</div>}
            <form onSubmit={handlePasswordChange}>
              <input type="password" placeholder="Old Password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full border p-2 rounded mb-3" required />
              <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border p-2 rounded mb-3" required />
              <input type="password" placeholder="Confirm New Password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full border p-2 rounded mb-4" required />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;