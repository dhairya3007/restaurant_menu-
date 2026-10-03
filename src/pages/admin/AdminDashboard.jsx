import React, { useEffect, useState } from 'react';
import { Users, CreditCard, Activity } from 'lucide-react';
import { fakeBackend } from '../../js/fakebackend';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    revenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchData();
    const handleStorageChange = (e) => {
      if (e.key === 'restaurant_db_clients') {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchData = async () => {
    const clients = await fakeBackend.getClients();
    
    const total = clients.length;
    const active = clients.filter(c => c.isActive !== false).length;
    
    // Estimate revenue based on plan (e.g., Premium = $50, Basic = $20, Free = $0)
    const revenue = clients.reduce((acc, c) => {
      if (c.plan?.toLowerCase() === 'premium') return acc + 50;
      if (c.plan?.toLowerCase() === 'standard' || c.plan?.toLowerCase() === 'basic') return acc + 20;
      return acc + 10; // Default fallback estimate
    }, 0);

    setStats({ total, active, revenue });

    // Get 3 most recent clients
    const recent = [...clients].reverse().slice(0, 3);
    setRecentActivity(recent);
  };

  return (
    <div>
      <h3 className="fw-bold mb-4 text-dark m-0">Super Admin Dashboard</h3>

      <div className="row g-4 mt-2">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100 p-4 rounded-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted fw-bold mb-1">Total Restaurants</p>
                <h2 className="fw-bold text-dark mb-0">{stats.total}</h2>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 rounded-circle text-primary">
                <Users size={32} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100 p-4 rounded-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted fw-bold mb-1">Active Subscriptions</p>
                <h2 className="fw-bold text-dark mb-0">{stats.active}</h2>
              </div>
              <div className="p-3 bg-success bg-opacity-10 rounded-circle text-success">
                <CreditCard size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 card shadow-sm border-0 p-4 rounded-4">
        <h4 className="fw-bold mb-4 text-dark">Recent Activity</h4>
        <ul className="list-group list-group-flush">
          {recentActivity.map((client, index) => (
            <li key={client.id || index} className={`list-group-item d-flex justify-content-between align-items-center border-0 py-3 ${index % 2 !== 0 ? 'bg-light rounded' : ''}`}>
              <span><strong>{client.name}</strong> joined as a new client.</span>
              <small className="text-muted">Plan: {client.plan || 'N/A'}</small>
            </li>
          ))}
          {recentActivity.length === 0 && (
            <li className="list-group-item border-0 py-3 text-muted">No recent activity found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
