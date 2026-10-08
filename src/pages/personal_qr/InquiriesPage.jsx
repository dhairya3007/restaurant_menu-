import React, { useEffect, useState } from 'react';
import { fakeBackend } from '../../js/fakebackend';
import { auth } from '../../js/auth';
import { MessageSquare, Calendar, Mail, User, Phone } from 'lucide-react';
import { Spinner } from 'reactstrap';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = auth.getCurrentUser();

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(() => {
      fetchInquiries();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchInquiries = async () => {
    if (user?.id) {
      try {
        const data = await fakeBackend.getPersonalQRInquiries(user.id);
        setInquiries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="w-100 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 d-flex align-items-center gap-2">
            <MessageSquare size={28} className="text-primary" />
            Inquiries
          </h2>
          <p className="text-muted mt-1 mb-0">Manage messages received through your Personal QR Card</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 rounded-4 p-4 mt-2">
        <div className="table-responsive border rounded" style={{ height: '350px', overflowY: 'auto' }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="text-muted position-sticky top-0" style={{ zIndex: 10 }}>
              <tr>
                <th style={{ width: '20%', backgroundColor: '#f8f9fa', borderBottom: '2px solid #e2e8f0' }}>Date & Time</th>
                <th style={{ width: '20%', backgroundColor: '#f8f9fa', borderBottom: '2px solid #e2e8f0' }}>Name</th>
                <th style={{ width: '25%', backgroundColor: '#f8f9fa', borderBottom: '2px solid #e2e8f0' }}>Email / Phone</th>
                <th style={{ width: '35%', backgroundColor: '#f8f9fa', borderBottom: '2px solid #e2e8f0' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="text-muted mb-3"><MessageSquare size={48} className="mx-auto" /></div>
                    <h5 className="fw-bold text-dark">No Inquiries Yet</h5>
                    <p className="text-muted mb-0">When people fill out the Inquiry Form on your card, their messages will appear here.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td className="text-muted small">
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(inq.createdAt)}
                      </div>
                    </td>
                    <td className="fw-bold text-dark">
                      <div className="d-flex align-items-center gap-2">
                        <User size={16} className="text-primary" />
                        {inq.name}
                      </div>
                    </td>
                    <td className="text-dark">
                      <div className="d-flex align-items-center gap-2">
                        <Mail size={16} className="text-muted" />
                        {inq.email}
                      </div>
                    </td>
                    <td>
                      <div className="bg-light p-2 rounded text-secondary small" style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>
                        {inq.message}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;
