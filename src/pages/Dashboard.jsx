import React, { useEffect, useState } from 'react';
import { Store, Layers, Utensils, QrCode, ExternalLink, Download, Palette, ToggleRight, ToggleLeft, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { fakeBackend } from '../js/fakebackend';
import { auth } from '../js/auth';

const Dashboard = () => {
  const [stats, setStats] = useState({ categories: 0, dishes: 0, scanCount: 0 });
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isServiceSuspended, setIsServiceSuspended] = useState(false);

  // Modals state
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Forms state
  const [business, setBusiness] = useState({ name: '', phone: '', address: '', logo: '' });
  const [newCategory, setNewCategory] = useState('');
  const [newDish, setNewDish] = useState({ name: '', price: '', quantity: '', type: 'Veg', categoryId: '', image: '' });
  const [editDishId, setEditDishId] = useState(null);

  const user = auth.getCurrentUser();
  const [currentTheme, setCurrentTheme] = useState(user?.theme || 'modern');

  useEffect(() => {
    fetchData();

    // Listen to cross-tab local storage changes for real-time updates!
    const handleStorageChange = (e) => {
      if (e.key === 'restaurant_db_clients') {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchData = async () => {
    if (user?.id) {
      const cats = await fakeBackend.getCategoriesByClientId(user.id);
      const d = await fakeBackend.getDishesByClientId(user.id);
      const bDetails = await fakeBackend.getBusinessDetails(user.id);
      const scans = await fakeBackend.getScanCount(user.id);
      const statusObj = await fakeBackend.getClientStatus(user.id);

      setCategories(cats);
      setStats({ categories: cats.length, dishes: d.length, scanCount: scans });
      setDishes(d);
      setIsActive(statusObj.isActive);
      setIsServiceSuspended(statusObj.isServiceSuspended);

      if (bDetails.name) setBusiness(bDetails);
      if (cats.length > 0 && !newDish.categoryId) {
        setNewDish(prev => ({ ...prev, categoryId: cats[0].id }));
      }
    }
  };

  // --- BUSINESS LOGIC ---
  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    if (user?.id) {
      try {
        await fakeBackend.saveBusinessDetails(user.id, business);
        setShowBusinessModal(false);
      } catch (err) {
        alert("Failed to save business details: " + err.message);
      }
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBusiness({ ...business, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // --- CATEGORY LOGIC ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.trim() && user?.id) {
      await fakeBackend.addCategory(user.id, newCategory.trim());
      setNewCategory('');
      fetchData();
    }
  };

  const handleDeleteCategory = async (id) => {
    await fakeBackend.deleteCategory(id);
    fetchData();
  };

  // --- DISH LOGIC ---
  const handleDishImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewDish({ ...newDish, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    
    // Ensure categoryId is set to at least the first category if missing
    const finalCategoryId = newDish.categoryId || (categories.length > 0 ? categories[0].id : '');

    if (newDish.name && newDish.price && finalCategoryId && user?.id) {
      const dishToSave = { ...newDish, categoryId: finalCategoryId };
      if (editDishId) {
        await fakeBackend.updateDish(editDishId, dishToSave);
      } else {
        await fakeBackend.addDish(dishToSave);
      }
      setNewDish({ name: '', price: '', quantity: '', type: 'Veg', categoryId: categories[0]?.id || '', image: '' });
      setEditDishId(null);
      setShowDishModal(false);
      await fetchData();
    }
  };

  const handleEditDish = (dish) => {
    setNewDish({
      name: dish.name,
      price: dish.price,
      quantity: dish.quantity || '',
      type: dish.type || 'Veg',
      categoryId: dish.categoryId,
      image: dish.image || ''
    });
    setEditDishId(dish.id);
    setShowDishModal(true);
  };

  const handleToggleDishStatus = async (id) => {
    await fakeBackend.toggleDishStatus(id);
    fetchData();
  };

  const handleDeleteDish = async (id) => {
    await fakeBackend.deleteDish(id);
    fetchData();
  };

  // --- TOGGLE & THEME ---
  const handleToggleStatus = async () => {
    if (user?.id) {
      const newStatus = await fakeBackend.toggleClientStatus(user.id);
      setIsActive(newStatus);
    }
  };

  const handleUpdateTheme = async (themeId) => {
    if (user?.id) {
      setCurrentTheme(themeId);
      await fakeBackend.updateClientTheme(user.id, themeId);
      user.theme = themeId;
      localStorage.setItem('auth_user', JSON.stringify(user));
      setShowThemeModal(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark m-0">Restaurant Menu Dashboard</h3>
      </div>

      {/* Cards Layout */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3 cursor-pointer" onClick={() => setShowBusinessModal(true)} style={{ cursor: 'pointer' }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold d-flex align-items-center gap-2"><Store size={18} className="text-primary" /> Business Profile</span>
              <ExternalLink size={16} className="text-muted" />
            </div>
            <small className="text-muted mt-1 d-block">(Step-1)</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3 cursor-pointer" onClick={() => setShowCategoryModal(true)} style={{ cursor: 'pointer' }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold d-flex align-items-center gap-2"><Layers size={18} className="text-primary" /> Manage Categories</span>
              <Plus size={16} className="text-muted" />
            </div>
            <small className="text-muted mt-1 d-block">(Step-2)</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3 cursor-pointer" onClick={() => setShowDishModal(true)} style={{ cursor: 'pointer' }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold d-flex align-items-center gap-2"><Utensils size={18} className="text-primary" /> Add Dishes (Items)</span>
              <Plus size={16} className="text-muted" />
            </div>
            <small className="text-muted mt-1 d-block">(Step-3)</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3 cursor-pointer" onClick={() => setShowThemeModal(true)} style={{ cursor: 'pointer' }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold d-flex align-items-center gap-2"><Palette size={18} className="text-primary" /> Update Theme</span>
            </div>
            <small className="text-muted mt-1 d-block">Theme: {currentTheme}</small>
          </div>
        </div>

        <div className="col-md-3">
          <a href={`/menu/${user?.qrToken}`} target="_blank" rel="noreferrer" className="text-decoration-none">
            <div className="card shadow-sm border-0 h-100 p-3 rounded-3 text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold d-flex align-items-center gap-2"><ExternalLink size={18} className="text-primary" /> View Public Menu</span>
                <ExternalLink size={16} className="text-muted" />
              </div>
            </div>
          </a>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3 cursor-pointer" onClick={() => setShowQrModal(true)} style={{ cursor: 'pointer' }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold d-flex align-items-center gap-2"><QrCode size={18} className="text-primary" /> View / Download QR</span>
              <Download size={16} className="text-muted" />
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold d-flex align-items-center gap-2">View / Scan Count</span>
              <span className="fw-bold text-dark fs-5">{stats.scanCount}</span>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 p-3 rounded-3" onClick={isServiceSuspended ? null : handleToggleStatus} style={{ cursor: isServiceSuspended ? 'not-allowed' : 'pointer', opacity: isServiceSuspended ? 0.6 : 1 }}>
            <div className="d-flex flex-column justify-content-center h-100">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold d-flex align-items-center gap-2">Activate / Deactivate</span>
                {isActive ? <ToggleRight size={28} className="text-primary" /> : <ToggleLeft size={28} className="text-muted" />}
              </div>
              {isServiceSuspended && <small className="text-danger mt-1 fw-bold">Service Suspended by Admin</small>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dishes Table */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mt-2">
        <div className="d-flex justify-content-end mb-3">
          <button onClick={() => {
            setEditDishId(null);
            setNewDish({ name: '', price: '', quantity: '', type: 'Veg', categoryId: categories[0]?.id || '', image: '' });
            setShowDishModal(true);
          }} className="btn btn-primary fw-bold d-flex align-items-center gap-1" style={{ backgroundColor: '#5e35b1', border: 'none' }}>
            <Plus size={16} /> Add New Dish
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light text-muted">
              <tr>
                <th></th>
                <th>Dish Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish, idx) => (
                <tr key={dish.id}>
                  <td className="text-muted">::</td>
                  <td className="fw-bold">{dish.name}</td>
                  <td>₹{dish.price}</td>
                  <td>{categories.find(c => c.id === dish.categoryId)?.name || 'Unknown'}</td>
                  <td>
                    <button onClick={() => handleToggleDishStatus(dish.id)} className="btn btn-link p-0 text-decoration-none shadow-none border-0">
                      {dish.isActive !== false ? <ToggleRight size={26} className="text-primary" /> : <ToggleLeft size={26} className="text-muted" />}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEditDish(dish)} className="btn btn-sm text-muted me-2"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteDish(dish.id)} className="btn btn-sm text-danger"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {dishes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No dishes added yet. Click Add New Dish.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Business Details Modal */}
      {showBusinessModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold">Add Business Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowBusinessModal(false)}></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <div className="mb-4 position-relative d-inline-block">
                    <label htmlFor="logo-upload" style={{ cursor: 'pointer' }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-light border" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                        {business.logo ? <img src={business.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span className="fw-bold fs-3 text-secondary">V</span>}
                      </div>
                    </label>
                    <input id="logo-upload" type="file" accept="image/*" className="d-none" onChange={handleLogoUpload} />
                  </div>
                  <form onSubmit={handleSaveBusiness} className="text-start">
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Company Name*</label>
                        <input type="text" className="form-control" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Contact Phone*</label>
                        <input type="text" className="form-control" value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Full Address*</label>
                      <input type="text" className="form-control" value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} required />
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button type="button" className="btn btn-light bg-white border" onClick={() => setShowBusinessModal(false)}>Cancel</button>
                      <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#5e35b1' }}>Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. Manage Categories Modal */}
      {showCategoryModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold">Manage Categories</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <form onSubmit={handleAddCategory} className="d-flex gap-2 mb-4">
                    <input type="text" className="form-control" placeholder="New category (e.g. Beverages)" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button type="submit" className="btn text-white fw-bold px-4" style={{ backgroundColor: '#5e35b1' }}>Add</button>
                  </form>
                  <h6 className="fw-bold mb-3 text-muted">Existing Categories</h6>
                  <ul className="list-group">
                    {categories.map((cat) => (
                      <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 border-bottom">
                        <span className="fw-bold">{cat.name}</span>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-sm text-danger"><Trash2 size={16} /></button>
                      </li>
                    ))}
                    {categories.length === 0 && <p className="text-muted small">No categories added yet.</p>}
                  </ul>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-light bg-white border" onClick={() => setShowCategoryModal(false)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 3. Add Dish Modal */}
      {showDishModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold">{editDishId ? 'Update Dish' : 'Add New Dish'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDishModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <form onSubmit={handleAddDish}>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Dish Name*</label>
                      <input type="text" className="form-control" value={newDish.name} onChange={(e) => setNewDish({ ...newDish, name: e.target.value })} required />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Price*</label>
                        <input type="number" className="form-control" value={newDish.price} onChange={(e) => setNewDish({ ...newDish, price: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Quantity (gm/ml)</label>
                        <input type="text" className="form-control" value={newDish.quantity} onChange={(e) => setNewDish({ ...newDish, quantity: e.target.value })} />
                      </div>
                    </div>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Type*</label>
                        <select className="form-select" value={newDish.type} onChange={(e) => setNewDish({ ...newDish, type: e.target.value })}>
                          <option value="Veg">Veg</option>
                          <option value="Non-Veg">Non-Veg</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Category*</label>
                        <select className="form-select" value={newDish.categoryId} onChange={(e) => setNewDish({ ...newDish, categoryId: e.target.value })} required>
                          <option value="">-- Select Category --</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-muted small">Upload Image</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleDishImageUpload} />
                      {newDish.image && <img src={newDish.image} alt="Preview" className="mt-3 rounded border" style={{ height: '80px', width: '80px', objectFit: 'cover' }} />}
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button type="button" className="btn btn-light bg-white border" onClick={() => setShowDishModal(false)}>Cancel</button>
                      <button type="submit" className="btn text-white px-4" style={{ backgroundColor: '#5e35b1' }}>{editDishId ? 'Update Dish' : 'Add Dish'}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. Update Theme Modal */}
      {showThemeModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold">Select Menu Theme</h5>
                  <button type="button" className="btn-close" onClick={() => setShowThemeModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {[{ id: 'modern', name: 'Modern Dark' }, { id: 'classic', name: 'Classic Elegance' }, { id: 'light', name: 'Light & Clean' }].map(t => (
                      <div key={t.id} className="col-md-4">
                        <div
                          className="card border p-3 rounded-4 h-100 text-center"
                          style={{ cursor: 'pointer', borderColor: currentTheme === t.id ? '#5e35b1' : '#e0e0e0', borderWidth: currentTheme === t.id ? '2px' : '1px' }}
                          onClick={() => handleUpdateTheme(t.id)}
                        >
                          <h6 className="fw-bold">{t.name}</h6>
                          {currentTheme === t.id && <div className="mt-2 text-primary"><Check size={20} className="mx-auto" /></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-light bg-white border" onClick={() => setShowThemeModal(false)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 5. View QR Modal */}
      {showQrModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold">Your Public QR Link</h5>
                  <button type="button" className="btn-close" onClick={() => setShowQrModal(false)}></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <div className="bg-light p-3 rounded-4 d-inline-block border mb-4">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/menu/' + user?.qrToken)}`} 
                      alt="QR Code" 
                      className="img-fluid rounded" 
                      style={{ width: '150px', height: '150px' }}
                    />
                  </div>
                  <p className="text-muted mb-2">Users can scan this to view your menu.</p>
                  <a href={`/menu/${user?.qrToken}`} target="_blank" rel="noreferrer" className="form-control text-primary text-decoration-none fw-bold bg-light">
                    {window.location.origin}/menu/{user?.qrToken}
                  </a>
                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <button type="button" className="btn btn-primary px-4" style={{ backgroundColor: '#5e35b1' }} onClick={() => setShowQrModal(false)}>Done</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
