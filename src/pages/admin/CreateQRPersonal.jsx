import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fakeBackend } from '../../js/fakebackend';
import { Plus, Edit, ExternalLink, QrCode, Download, Trash2, ToggleRight, ToggleLeft } from 'lucide-react';

const CreateQRPersonal = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editClient, setEditClient] = useState(null);
  const [viewQR, setViewQR] = useState(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    const data = await fakeBackend.getClients();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
    
    // Listen for changes from other tabs to auto-refresh
    const handleStorageChange = (e) => {
      if (e.key === 'restaurant_db_clients') {
        fetchClients();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (editClient && editClient.id) {
      await fakeBackend.updateClient(editClient.id, editClient);
      setEditClient(null);
      fetchClients();
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      await fakeBackend.deleteClient(id);
      await fetchClients();
    }
  };

  const handleToggleStatus = async (id) => {
    await fakeBackend.toggleClientServiceSuspension(id);
    fetchClients();
  };

  const handleDownloadQR = async () => {
    if (!viewQR) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(window.location.origin + '/' + viewQR.qrToken)}`;
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

  const handleAdminAutoLogin = (client) => {
    const user = {
      id: client.id,
      email: client.email,
      role: 'client',
      name: client.name,
      qrToken: client.qrToken,
      theme: client.theme
    };
    localStorage.setItem('auth_user', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <div>
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark m-0">QR List</h3>
      </div>

      {/* Table Area */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mt-2">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light text-muted">
              <tr>
                <th className="py-3 border-0">S.No.</th>
                <th className="py-3 border-0">CUSTOMER NAME</th>
                <th className="py-3 border-0">QR CODE</th>
                <th className="py-3 border-0">EMAIL & PASS</th>
                <th className="py-3 border-0">LOGIN</th>
                <th className="py-3 border-0">MENU LINK</th>
                <th className="py-3 border-0">STATUS</th>
                <th className="py-3 border-0">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3 border-0 text-muted">{idx + 1}</td>
                  <td className="py-3 text-primary fw-bold border-0">{item.name}</td>
                  <td className="py-3 border-0">
                    <button 
                      onClick={() => setViewQR(item)}
                      className="btn btn-sm btn-light border-0 d-flex align-items-center gap-1 text-primary fw-bold"
                    >
                      <QrCode size={16} /> View QR
                    </button>
                  </td>
                  <td className="py-3 text-dark border-0">
                    {item.email ? (
                      <div className="text-dark">
                        {item.email}<br /><span className="text-muted">{item.password}</span>
                      </div>
                    ) : (
                      <button
                        className="btn btn-sm text-primary bg-light border-0 fw-bold"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/setup/${item.qrToken}`);
                          alert('Setup link copied! Send this to the client.');
                        }}
                      >
                        Copy Setup Link
                      </button>
                    )}
                  </td>
                  <td className="py-3 border-0">
                    <button
                      onClick={() => handleAdminAutoLogin(item)}
                      className="btn text-white px-3 py-1 border-0"
                      style={{ backgroundColor: '#5e35b1', fontSize: '13px', borderRadius: '4px', fontWeight: '500', minWidth: '90px' }}
                    >
                      Login
                    </button>
                  </td>
                  <td className="py-3 text-dark border-0">
                    <a href={`/${item.qrToken}`} target="_blank" rel="noreferrer" className="text-dark text-decoration-none hover-primary d-flex align-items-center gap-1">
                      <ExternalLink size={18} className="text-primary" /> View
                    </a>
                  </td>
                  <td className="py-3 border-0">
                    <button onClick={() => handleToggleStatus(item.id)} className="btn btn-link p-0 text-decoration-none shadow-none border-0" title={item.isServiceSuspended ? "Activate Client" : "Deactivate Client"}>
                      {!item.isServiceSuspended ? <ToggleRight size={26} className="text-primary" /> : <ToggleLeft size={26} className="text-muted" />}
                    </button>
                  </td>
                  <td className="py-3 border-0">
                    <button className="btn btn-sm text-muted px-2" onClick={() => setEditClient(item)}><Edit size={16} /></button>
                    <button className="btn btn-sm text-danger px-2" onClick={() => handleDeleteClient(item.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted border-0">No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Client Modal */}
      {editClient && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                <h5 className="modal-title fw-bold">Update Client</h5>
                <button type="button" className="btn-close" onClick={() => setEditClient(null)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleUpdateClient}>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>Customer Name</label>
                    <input
                      type="text"
                      className="form-control p-2"
                      value={editClient.name}
                      onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>Email</label>
                    <input
                      type="email"
                      className="form-control p-2"
                      value={editClient.email || ''}
                      onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>Password</label>
                    <input
                      type="text"
                      className="form-control p-2"
                      value={editClient.password || ''}
                      onChange={(e) => setEditClient({ ...editClient, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-light bg-white border" onClick={() => setEditClient(null)}>Cancel</button>
                    <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#5e35b1' }}>Update Client</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
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
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/' + viewQR.qrToken)}`} 
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

export default CreateQRPersonal;
