import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { apiChangePassword } from '../../services/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
        // Reset form state when modal is closed
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
    }

    setLoading(true);
    try {
        const result = await apiChangePassword(currentUser.id, currentPassword, newPassword);
        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => {
                onClose();
            }, 2000); // Close modal after 2 seconds on success
        } else {
            setError(result.message);
        }
    } catch (err) {
        setError('An unexpected error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">Current Password</label>
              <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">New Password</label>
              <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm New Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>
          <div className="p-4 bg-gray-900 bg-opacity-50 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
