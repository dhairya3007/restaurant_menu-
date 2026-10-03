import React, { useState } from 'react';

const PlanManagement = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: "Basic", price: "$19/mo", features: ["Up to 50 dishes", "Standard Themes", "Community Support"] },
    { id: 2, name: "Premium", price: "$49/mo", features: ["Unlimited dishes", "Premium Themes", "Priority Support"] },
  ]);

  return (
    <div>
      <h2 className="fw-bold mb-4 text-dark">Subscription Plans</h2>
      
      <div className="row g-4">
        {plans.map(plan => (
          <div key={plan.id} className="col-md-6">
            <div className="card shadow-sm border-0 p-4 rounded-4 h-100">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h3 className="fw-bold text-dark">{plan.name}</h3>
                  <h4 className="text-primary fw-bold">{plan.price}</h4>
                </div>
                <button className="btn btn-outline-primary btn-sm">Edit Plan</button>
              </div>
              
              <ul className="list-group list-group-flush">
                {plan.features.map((feature, index) => (
                  <li key={index} className="list-group-item border-0 px-0 d-flex align-items-center gap-2">
                    <span className="text-success">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        
        <div className="col-md-12">
          <button className="btn btn-primary fw-bold px-4 py-2 mt-3">+ Create New Plan</button>
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;
