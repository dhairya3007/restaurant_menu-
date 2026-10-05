import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fakeBackend } from '../js/fakebackend';

const MenuPreview = () => {
  const { token } = useParams();
  const [data, setData] = useState({ client: null, categories: [], dishes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTabId, setActiveTabId] = useState(null);

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
      // Increment scan count only once when the page initially loads
      fakeBackend.incrementScanCount(token);
      
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

        <div className="container-fluid mt-4 px-3 pb-5">
          {categories.length === 0 && dishes.length === 0 ? (
            <div className="text-center mt-5 p-4 glass-card">
              <h3>Menu is empty.</h3>
            </div>
        ) : (
          <>
            {/* Render Tabs if theme is Luxury or Elegant */}
            {(client?.theme === 'luxury' || client?.theme === 'elegant') && (
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4 px-1">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveTabId(cat.id)}
                    className="btn rounded-pill px-4 py-2 fw-bold"
                    style={{ 
                      backgroundColor: (activeTabId || categories[0].id) === cat.id ? 'var(--primary-color)' : 'transparent',
                      color: (activeTabId || categories[0].id) === cat.id ? '#fff' : 'var(--text-color)',
                      border: '2px solid var(--primary-color)'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {categories.filter(cat => (client?.theme === 'luxury' || client?.theme === 'elegant') ? cat.id === (activeTabId || categories[0].id) : true).map(category => {
              const categoryDishes = dishes.filter(d => d.categoryId === category.id);
              if (categoryDishes.length === 0) return null;

              return (
                <div key={category.id} className="mb-5">
                  {client?.theme !== 'luxury' && client?.theme !== 'elegant' && (
                    <div className="text-center">
                      <h2 className="menu-category-title fw-bold fs-3">{category.name}</h2>
                    </div>
                  )}
                  
                  <div className="d-flex flex-column gap-4">
                    {categoryDishes.map(dish => (
                      <div key={dish.id} className="w-100">
                        <div className="glass-card dish-card p-4 w-100">
                          {dish.image && (
                            <img src={dish.image} alt={dish.name} className="dish-image" />
                          )}
                          <div className="d-flex flex-column h-100 justify-content-center">
                            <h4 className="fw-bold mb-0 d-flex align-items-start" style={{ fontSize: '1.2rem' }}>
                              <span className={dish.type === 'Veg' ? 'veg-icon flex-shrink-0' : 'non-veg-icon flex-shrink-0'} style={{ marginTop: '5px' }}></span>
                              <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{dish.name}</span>
                            </h4>
                            <div className="d-flex justify-content-between align-items-end mt-3">
                              <p className="mb-0 opacity-75 text-truncate pe-3">{dish.quantity || ''}</p>
                              <span className="fw-bold text-primary flex-shrink-0" style={{ fontSize: '1.3rem' }}>₹{dish.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
