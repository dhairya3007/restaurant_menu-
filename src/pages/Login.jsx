import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../js/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await auth.login(email, password);
      if (user.role === 'super_admin') {
        navigate('/admin');
      } else {
        if (user.services?.includes('restaurant_menu')) {
          navigate('/restaurant_menu_dashboard');
        } else if (user.services?.includes('personal_qr')) {
          navigate('/personal_qr_dashboard');
        } else {
          navigate('/restaurant_menu_dashboard');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center flex-grow-1" style={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <div className="card shadow-sm p-5 border-0 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Login</h2>
          <p className="text-muted">Sign in to your dashboard</p>
        </div>
        
        {error && <div className="alert alert-danger p-2">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. admin@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px' }}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold" style={{ padding: '12px', borderRadius: '8px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <div className="text-muted small">
            <strong>Admin Login:</strong> admin@test.com / any password<br />
            <strong>Demo Client Login:</strong> admin@pizzahouse.com / password123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
