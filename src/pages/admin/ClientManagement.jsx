import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle } from 'lucide-react';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Mock clients data
    const mockClients = [
      { id: 1, name: "Spicy Grill", email: "contact@spicygrill.com", plan: "Premium", status: "Active" },
      { id: 2, name: "Cafe Mocha", email: "hello@cafemocha.com", plan: "Basic", status: "Active" },
      { id: 3, name: "Burger Hub", email: "admin@burgerhub.com", plan: "Premium", status: "Suspended" },
    ];
    setClients(mockClients);
  }, []);

  const toggleStatus = (id) => {
    setClients(clients.map(client => {
      if (client.id === id) {
        return { ...client, status: client.status === "Active" ? "Suspended" : "Active" };
      }
      return client;
    }));
  };

  return (
    <div>
      <h2 className="fw-bold mb-4 text-dark">Manage Clients (Restaurants)</h2>
      
      <div className="card shadow-sm border-0 p-4 rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Restaurant Name</th>
                <th>Email</th>
                <th>Current Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td className="fw-bold">{client.name}</td>
                  <td>{client.email}</td>
                  <td><span className="badge bg-secondary">{client.plan}</span></td>
                  <td>
                    <span className={`badge ${client.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleStatus(client.id)}
                      className={`btn btn-sm ${client.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'} d-flex align-items-center gap-1`}
                    >
                      {client.status === 'Active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                      {client.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
