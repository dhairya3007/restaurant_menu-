import React, { useState, useEffect } from 'react';
import { X, QrCode, Download, Edit, Trash2, Plus, Copy } from 'lucide-react';
import { fakeBackend } from '../../js/fakebackend';

const CreateQR = () => {
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', email: '', password: '', plan: 'Basic Plan', planDuration: 1 });
  const [loading, setLoading] = useState(false);
  const [viewQR, setViewQR] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchClients();
    
    const handleStorageChange = (e) => {
      if (e.key === 'restaurant_db_clients') {
        fetchClients();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchClients = async () => {
    const data = await fakeBackend.getClients();
    setClients(data);
  };

  const handleSaveClient = async () => {
    if (newClient.email) {
      const emailExists = clients.some(c => c.email === newClient.email && c.id !== newClient.id);
      if (emailExists) {
        alert('This email is already registered to another client. Please use a unique email.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isEdit) {
        await fakeBackend.updateClient(newClient.id, newClient);
      } else {
        await fakeBackend.createClient(newClient);
      }
      await fetchClients();
      setShowModal(false);
      setNewClient({ name: '', email: '', password: '', plan: 'Basic Plan', planDuration: 1 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      await fakeBackend.deleteClient(id);
      await fetchClients();
    }
  };

  const openModalForNew = () => {
    setIsEdit(false);
    setNewClient({ name: '', email: '', password: '', plan: 'Basic Plan', planDuration: 1 });
    setShowModal(true);
  };

  const openModalForEdit = (client) => {
    setIsEdit(true);
    setNewClient({ ...client, planDuration: client.planDuration || 1 });
    setShowModal(true);
  };

  const handleDownloadQR = async () => {
    if (!viewQR) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(window.location.origin + '/menu/' + viewQR.qrToken)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${viewQR.name}-QRCode.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download QR code');
    }
  };

  return (
    <div>
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark m-0">Order List</h3>
        <button onClick={openModalForNew} className="btn text-white fw-bold px-4 py-2 d-flex align-items-center gap-1" style={{ backgroundColor: '#5e35b1', border: 'none', borderRadius: '8px' }}>
          <Plus size={18} /> Create QR / Client
        </button>
      </div>

      {/* Table Area */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mt-2">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light text-muted">
              <tr>
                <th className="py-3 border-0">S.No.</th>
                <th className="py-3 border-0">CUSTOMER NAME</th>
                <th className="py-3 border-0">EMAIL</th>
                <th className="py-3 border-0">PLAN</th>
                <th className="py-3 border-0">CREATED AT</th>
                <th className="py-3 border-0">EXPIRE AT</th>
                <th className="py-3 border-0">QR CODE</th>
                <th className="py-3 border-0">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client.id}>
                  <td className="py-3 border-0 text-muted">{index + 1}</td>
                  <td className="py-3 text-primary fw-bold border-0">{client.name}</td>
                  <td className="py-3 text-dark border-0">{client.email || <span className="text-muted">Not provided</span>}</td>
                  <td className="py-3 text-dark border-0">{client.plan}</td>
                  <td className="py-3 text-dark border-0">{client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="text-muted">N/A</span>}</td>
                  <td className="py-3 text-dark border-0">{client.expireAt ? new Date(client.expireAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="text-muted">N/A</span>}</td>
                  <td className="py-3 border-0">
                    <div className="d-flex align-items-center gap-2">
                      <button 
                        onClick={() => setViewQR(client)}
                        className="btn btn-sm btn-light border-0 d-flex align-items-center gap-1 text-primary fw-bold"
                      >
                        <QrCode size={16} /> View QR
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.origin + '/menu/' + client.qrToken);
                          alert('Menu link copied to clipboard!');
                        }}
                        className="btn btn-sm btn-light border-0 text-secondary"
                        title="Copy Menu Link"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 border-0">
                    <button className="btn btn-sm text-muted px-2" onClick={() => openModalForEdit(client)}><Edit size={16} /></button>
                    <button className="btn btn-sm text-danger px-2" onClick={() => handleDeleteClient(client.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted border-0">No clients generated yet. Click + to start.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h4 className="modal-title fw-bold">{isEdit ? 'Update Client' : 'Create QR & Client'}</h4>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Customer Business Name</label>
                      <input type="text" className="form-control bg-light border-0" value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Plan name</label>
                      <select className="form-select bg-light border-0" value={newClient.plan} onChange={(e) => setNewClient({...newClient, plan: e.target.value})}>
                        <option value="Basic Plan">Basic Plan (₹800/month)</option>
                        <option value="Premium Plan">Premium Plan (₹1200/month)</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Plan Validation (Months)</label>
                      <input type="number" min="1" className="form-control bg-light border-0" value={newClient.planDuration} onChange={(e) => setNewClient({...newClient, planDuration: parseInt(e.target.value) || ''})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Total Amount (₹)</label>
                      <input type="text" className="form-control bg-light border-0 fw-bold text-success" readOnly value={`₹${(newClient.plan === 'Premium Plan' ? 1200 : 800) * (newClient.planDuration || 0)}`} />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Client Email (Optional - setup later)</label>
                      <input type="email" className="form-control bg-light border-0" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Client Password (Optional - setup later)</label>
                      <input type="text" className="form-control bg-light border-0" value={newClient.password} onChange={(e) => setNewClient({...newClient, password: e.target.value})} />
                    </div>
                  </div>

                  <div className="text-center pb-2 mt-4">
                    <button onClick={handleSaveClient} disabled={loading} className="btn text-white px-5 py-2 fw-bold" style={{ backgroundColor: '#5e35b1', borderRadius: '8px', minWidth: '200px' }}>
                      {loading ? 'Saving...' : (isEdit ? 'Update Client' : 'Generate QR & Create Client')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View & Download QR Modal */}
      {viewQR && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <h5 className="modal-title fw-bold text-center w-100">{viewQR.name}</h5>
                <button type="button" className="btn-close position-absolute" style={{ right: '20px' }} onClick={() => setViewQR(null)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <div className="bg-light p-3 rounded-4 mb-4 d-inline-block">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/menu/' + viewQR.qrToken)}`} 
                    alt="QR Code" 
                    className="img-fluid rounded" 
                    style={{ width: '200px', height: '200px' }}
                  />
                </div>
                <button 
                  onClick={handleDownloadQR}
                  className="btn text-white w-100 fw-bold py-2 d-flex justify-content-center align-items-center gap-2"
                  style={{ backgroundColor: '#5e35b1', borderRadius: '8px' }}
                >
                  <Download size={18} /> Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQR;
