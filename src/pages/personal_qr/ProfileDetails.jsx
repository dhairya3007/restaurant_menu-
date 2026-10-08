import React, { useState } from 'react';
import { User, Upload, Briefcase, GraduationCap, FileText } from 'lucide-react';

const ProfileDetails = ({ profile, setProfile, saving, handleSaveProfile, handlePicUpload, onClose }) => {
  return (
    <>
      <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
      <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
              <h4 className="modal-title fw-bold d-flex align-items-center gap-2">
                <User size={24} className="text-primary" /> Profile Details
              </h4>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <p className="text-muted small px-4 mt-1 mb-0">Manage your personal information, bio, and educational background.</p>
            
            <div className="modal-body p-4 custom-scrollbar" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <form onSubmit={handleSaveProfile}>
            {/* Profile Picture */}
            <div className="mb-4 d-flex align-items-center gap-4 bg-light p-3 rounded-4 border">
              <div 
                className="rounded-circle bg-white border shadow-sm d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => document.getElementById('pic-upload').click()}
              >
                {profile.profilePic ? (
                  <img src={profile.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={32} className="text-muted" />
                )}
              </div>
              <div>
                <h6 className="fw-bold mb-1">Profile Picture</h6>
                <p className="text-muted small mb-2">Upload a professional headshot. Recommended size: 500x500px.</p>
                <input type="file" id="pic-upload" className="d-none" accept="image/*" onChange={handlePicUpload} />
                <button type="button" onClick={() => document.getElementById('pic-upload').click()} className="btn btn-sm btn-outline-primary rounded-pill px-3 d-flex align-items-center gap-2">
                  <Upload size={14} /> Choose Photo
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <h6 className="fw-bold mt-4 mb-3 text-dark d-flex align-items-center gap-2">
              <Briefcase size={18} className="text-muted" /> Basic Information
            </h6>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">First Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0 p-3 rounded-3 shadow-none" placeholder="John" value={profile.firstName || ''} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Last Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0 p-3 rounded-3 shadow-none" placeholder="Doe" value={profile.lastName || ''} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required />
              </div>
              <div className="col-md-12">
                <label className="form-label text-muted small fw-bold">Designation / Title <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0 p-3 rounded-3 shadow-none" placeholder="e.g. Senior Software Engineer" value={profile.designation || ''} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} required />
              </div>
            </div>

            {/* Education Info */}
            <h6 className="fw-bold mt-4 mb-3 text-dark d-flex align-items-center gap-2">
              <GraduationCap size={18} className="text-muted" /> Education Details
            </h6>
            <div className="row g-3 mb-4 bg-light p-3 rounded-4 border">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">10th Grade (School)</label>
                <input type="text" className="form-control bg-white border-0 p-3 rounded-3 shadow-none" placeholder="e.g. St. Xavier's High School" value={profile.education10th || ''} onChange={(e) => setProfile({ ...profile, education10th: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">12th Grade (High School)</label>
                <input type="text" className="form-control bg-white border-0 p-3 rounded-3 shadow-none" placeholder="e.g. Delhi Public School" value={profile.education12th || ''} onChange={(e) => setProfile({ ...profile, education12th: e.target.value })} />
              </div>
              <div className="col-md-12">
                <label className="form-label text-muted small fw-bold">College / Bachelor's</label>
                <input type="text" className="form-control bg-white border-0 p-3 rounded-3 shadow-none" placeholder="e.g. B.Tech from MIT" value={profile.educationCollege || ''} onChange={(e) => setProfile({ ...profile, educationCollege: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Master's Degree</label>
                <input type="text" className="form-control bg-white border-0 p-3 rounded-3 shadow-none" placeholder="e.g. MBA from Harvard" value={profile.educationMasters || ''} onChange={(e) => setProfile({ ...profile, educationMasters: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">PhD / Doctorate</label>
                <input type="text" className="form-control bg-white border-0 p-3 rounded-3 shadow-none" placeholder="e.g. PhD in AI" value={profile.educationPhD || ''} onChange={(e) => setProfile({ ...profile, educationPhD: e.target.value })} />
              </div>
            </div>

            {/* Bio */}
            <h6 className="fw-bold mt-4 mb-3 text-dark d-flex align-items-center gap-2">
              <FileText size={18} className="text-muted" /> Biography
            </h6>
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold">Short Bio <span className="text-danger">*</span></label>
              <textarea 
                className="form-control bg-light border-0 p-3 rounded-3 shadow-none" 
                rows="4" 
                placeholder="Write a short description about yourself, your background, and your goals..." 
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                required
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <button type="submit" disabled={saving} className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm" style={{ backgroundColor: '#5e35b1', border: 'none' }}>
                {saving ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
