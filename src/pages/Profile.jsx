import React, { useState, useEffect } from 'react';
import { auth } from '../js/auth';
import { fakeBackend } from '../js/fakebackend';
import { User, Mail, Shield, CheckCircle, Edit2, Save, X, Lock } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(auth.getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', password: '' });
    }
  }, [user]);

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setSuccessMsg('');
      
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      
      if (formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      if (user.role === 'super_admin') {
        // Just update local storage for admin mock
        const updatedUser = { ...user, ...updateData };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        // Update client via fakeBackend
        const updatedClient = await fakeBackend.updateClient(user.id, updateData);
        const newAuthUser = { 
          ...user, 
          name: updatedClient.name, 
          email: updatedClient.email 
        };
        localStorage.setItem('auth_user', JSON.stringify(newAuthUser));
        setUser(newAuthUser);
      }

      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setFormData({ ...formData, password: '' }); // Clear password field after save
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark m-0">My Profile</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-outline-primary d-flex align-items-center gap-2 rounded-pill px-4">
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button onClick={() => setIsEditing(false)} className="btn btn-light d-flex align-items-center gap-2 rounded-pill px-4">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} disabled={isLoading} className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4">
              {isLoading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      {successMsg && <div className="alert alert-success border-0 shadow-sm rounded-3 mb-4">{successMsg}</div>}
      
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mt-3" style={{ maxWidth: '600px' }}>
        <div className="bg-primary px-4 py-5 text-white d-flex align-items-center gap-4" style={{ background: 'linear-gradient(135deg, #5e35b1 0%, #3949ab 100%)' }}>
          <div 
            className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: '80px', height: '80px', fontSize: '32px', fontWeight: 'bold' }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : (user.role === 'super_admin' ? 'A' : 'U')}
          </div>
          <div>
            <h4 className="fw-bold mb-1">{user.name || (user.role === 'super_admin' ? 'Super Admin' : 'Restaurant Owner')}</h4>
            <span className="badge bg-white text-primary rounded-pill px-3 py-1 fw-bold">
              {user.role === 'super_admin' ? 'Administrator' : 'Client Account'}
            </span>
          </div>
        </div>
        
        <div className="card-body p-4">
          <ul className="list-group list-group-flush">
            {/* Name Field */}
            <li className="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-bottom border-light">
              <div className="p-2 bg-light rounded text-muted"><User size={20} /></div>
              <div className="flex-grow-1">
                <small className="text-muted d-block fw-bold" style={{ fontSize: '12px' }}>Full Name</small>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="form-control form-control-sm mt-1" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                ) : (
                  <span className="fw-bold text-dark">{user.name || 'Not set'}</span>
                )}
              </div>
            </li>

            {/* Email Field */}
            <li className="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-bottom border-light">
              <div className="p-2 bg-light rounded text-muted"><Mail size={20} /></div>
              <div className="flex-grow-1">
                <small className="text-muted d-block fw-bold" style={{ fontSize: '12px' }}>Email Address</small>
                {isEditing ? (
                  <input 
                    type="email" 
                    className="form-control form-control-sm mt-1" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                ) : (
                  <span className="fw-bold text-dark">{user.email}</span>
                )}
              </div>
            </li>

            {/* Password Field (Only show when editing) */}
            {isEditing && (
              <li className="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-bottom border-light">
                <div className="p-2 bg-light rounded text-muted"><Lock size={20} /></div>
                <div className="flex-grow-1">
                  <small className="text-muted d-block fw-bold" style={{ fontSize: '12px' }}>New Password (leave blank to keep current)</small>
                  <input 
                    type="password" 
                    className="form-control form-control-sm mt-1" 
                    placeholder="Enter new password..."
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
              </li>
            )}

            {/* Role (Read only) */}
            <li className="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-bottom border-light">
              <div className="p-2 bg-light rounded text-muted"><Shield size={20} /></div>
              <div>
                <small className="text-muted d-block fw-bold" style={{ fontSize: '12px' }}>Role Level</small>
                <span className="fw-bold text-dark text-capitalize">{user.role.replace('_', ' ')}</span>
              </div>
            </li>

            {/* Status (Read only) */}
            <li className="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-bottom border-light">
              <div className="p-2 bg-light rounded text-muted"><CheckCircle size={20} className="text-success" /></div>
              <div>
                <small className="text-muted d-block fw-bold" style={{ fontSize: '12px' }}>Account Status</small>
                <span className="fw-bold text-success">Active & Verified</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
