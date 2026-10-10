import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fakeBackend } from '../js/fakebackend';
import { auth } from '../js/auth';

const ClientSetup = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const clients = await fakeBackend.getClients();
        const foundClient = clients.find(c => c.qrToken === token);

        if (!foundClient) {
          setError("Invalid setup link. Please contact your administrator.");
        } else if (foundClient.email && foundClient.password) {
          setError("This account has already been set up. Please go to the Login page.");
        } else {
          setClient(foundClient);
        }
      } catch (err) {
        setError("Error verifying link.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSetup = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // 0. Check for email uniqueness
      const clients = await fakeBackend.getClients();
      const emailExists = clients.some(c => c.email === email && c.id !== client.id);

      if (emailExists) {
        setError("This email is already taken. Please use a different email.");
        setSaving(false);
        return;
      }

      // 1. Update the client in the database with the new email and password
      await fakeBackend.updateClient(client.id, { email, password });

      // 2. Automatically log them in
      await auth.login(email, password);

      // 3. Redirect to dashboard
      if (client.services?.includes('restaurant_menu')) {
        navigate('/restaurant_menu_dashboard');
      } else if (client.services?.includes('personal_qr')) {
        navigate('/personal_qr_dashboard');
      } else {
        navigate('/restaurant_menu_dashboard');
      }
    } catch (err) {
      setError(err.message || "Failed to set up account.");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-5 mt-5">Loading...</div>;

  return (
    <div className="d-flex align-items-center justify-content-center flex-grow-1" style={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <div className="card shadow-sm p-5 border-0 rounded-4" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Account Setup</h2>
          {client && <p className="text-muted fs-5">Welcome, <span className="fw-bold text-dark">{client.name}</span>!</p>}
          <p className="text-muted small">Please create your login credentials below to access your dashboard.</p>
        </div>

        {error ? (
          <div className="alert alert-warning text-center border-0 rounded-3">
            <p className="mb-3 fw-bold">{error}</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">Go to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSetup}>
            <div className="mb-3">
              <label className="form-label fw-bold text-muted">Set Your Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '8px' }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-muted">Set Your Password</label>
              <input
                type="text"
                className="form-control"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '8px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#7b5be4', border: 'none' }} disabled={saving}>
              {saving ? 'Saving...' : 'Save & Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClientSetup;
