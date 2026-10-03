import React from 'react';
import { auth } from '../js/auth';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';

const Profile = () => {
  const user = auth.getCurrentUser();

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div>
      <h3 className="fw-bold mb-4 text-dark m-0">My Profile</h3>
      
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
            <li className="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-bottom border-light">
              <div className="p-2 bg-light rounded text-muted"><Mail size={20} /></div>
              <div>
                <small className="text-muted d-block fw-bold" style={{ fontSize: '12px' }}>Email Address</small>
                <span className="fw-bold text-dark">{user.email}</span>
              </div>
            </li>
            <li className="list-group-item d-flex align-items-center gap-3 py-3 px-0 border-bottom border-light">
              <div className="p-2 bg-light rounded text-muted"><Shield size={20} /></div>
              <div>
                <small className="text-muted d-block fw-bold" style={{ fontSize: '12px' }}>Role Level</small>
                <span className="fw-bold text-dark text-capitalize">{user.role.replace('_', ' ')}</span>
              </div>
            </li>
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
