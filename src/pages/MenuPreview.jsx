import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fakeBackend } from '../js/fakebackend';

const MenuPreview = () => {
  const { token } = useParams();
  const [data, setData] = useState({ client: null, categories: [], dishes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      setError(''); // Clear any previous errors
      try {
        const result = await fakeBackend.getMenuByToken(token);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchMenu();
      
      // Listen for local storage changes to auto-update the menu
      const handleStorageChange = (e) => {
        if (e.key && e.key.startsWith('restaurant_db_')) {
          fetchMenu();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [token]);

  if (loading) return <div className="p-5 text-center">Loading menu...</div>;
  if (error) return <div className="p-5 text-center text-danger"><h2>{error}</h2><p>Please check your QR link.</p></div>;
  
  const { client, categories, dishes } = data;
  document.body.className = `theme-${client?.theme || 'modern'}`;

  return (
    <div className="min-vh-100 d-flex justify-content-center" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="pb-5 shadow-lg position-relative" style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', overflowX: 'hidden' }}>
        {/* Header */}
        <div className="menu-header shadow-sm text-center">
          <h1 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>{client.name || 'Our Menu'}</h1>
        </div>

        <div className="container-fluid mt-4 px-3">
          {categories.length === 0 && dishes.length === 0 ? (
            <div className="text-center mt-5 p-4 glass-card">
              <h3>Menu is empty.</h3>
            </div>
        ) : (
          categories.map(category => {
            const categoryDishes = dishes.filter(d => d.categoryId === category.id);
            if (categoryDishes.length === 0) return null;

            return (
              <div key={category.id} className="mb-5">
                <div className="text-center">
                  <h2 className="menu-category-title fw-bold fs-3">{category.name}</h2>
                </div>
                
                <div className="row g-3">
                  {categoryDishes.map(dish => (
                    <div key={dish.id} className="col-12">
                      <div className="glass-card dish-card h-100">
                        {dish.image && (
                          <img src={dish.image} alt={dish.name} className="dish-image" />
                        )}
                        <div className="p-4">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h4 className="fw-bold mb-0 d-flex align-items-center">
                              <span className={dish.type === 'Veg' ? 'veg-icon' : 'non-veg-icon'}></span>
                              {dish.name}
                            </h4>
                            <span className="fw-bold fs-5 text-primary">₹{dish.price}</span>
                          </div>
                          {dish.quantity && <p className="text-muted mb-0">{dish.quantity}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
