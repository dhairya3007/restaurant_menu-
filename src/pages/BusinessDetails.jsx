import React, { useState, useEffect } from 'react';

const BusinessDetails = () => {
  const [business, setBusiness] = useState({ name: '', phone: '', address: '', logo: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('restaurant_business') || '{}');
    if (data) setBusiness(data);
  }, []);

  const handleChange = (e) => {
    setBusiness({ ...business, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('restaurant_business', JSON.stringify(business));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusiness({ ...business, logo: reader.result });
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-fluid p-0">
      <h2 className="fw-bold mb-4">Business Details</h2>
      
      <div className="glass-card p-4">
        {saved && <div className="alert alert-success">Business details saved successfully!</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Business Name</label>
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                value={business.name || ''} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Contact Phone</label>
              <input 
                type="text" 
                className="form-control" 
                name="phone" 
                value={business.phone || ''} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="col-12 mb-3">
              <label className="form-label fw-bold">Address</label>
              <textarea 
                className="form-control" 
                name="address" 
                value={business.address || ''} 
                onChange={handleChange} 
                rows="3" 
                required 
              ></textarea>
            </div>
            
            <div className="col-12 mb-4">
              <label className="form-label fw-bold">Logo Upload</label>
              <input 
                type="file" 
                className="form-control" 
                accept="image/*" 
                onChange={handleLogoUpload} 
              />
              {business.logo && (
                <div className="mt-3">
                  <p className="text-muted mb-2">Logo Preview:</p>
                  <img src={business.logo} alt="Logo" style={{ height: '100px', borderRadius: '8px', objectFit: 'contain', background: '#fff', padding: '10px' }} />
                </div>
              )}
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary px-4 py-2 fw-bold">
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetails;
