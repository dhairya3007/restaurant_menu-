import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { fakeBackend } from '../js/fakebackend';
import { auth } from '../js/auth';

const DishManagement = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newDish, setNewDish] = useState({ name: '', price: '', quantity: '', type: 'Veg', categoryId: '', image: '' });
  const user = auth.getCurrentUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (user?.id) {
      const cats = await fakeBackend.getCategoriesByClientId(user.id);
      setCategories(cats);
      
      const d = await fakeBackend.getDishesByClientId(user.id);
      setDishes(d);

      if (cats.length > 0 && !newDish.categoryId) {
        setNewDish(prev => ({ ...prev, categoryId: cats[0].id }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDish({ ...newDish, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (newDish.name && newDish.price && newDish.categoryId && user?.id) {
      await fakeBackend.addDish(newDish);
      setNewDish({ name: '', price: '', quantity: '', type: 'Veg', categoryId: categories[0]?.id || '', image: '' });
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    await fakeBackend.deleteDish(id);
    fetchData();
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Unknown';
  };

  return (
    <div className="container-fluid p-0">
      <h2 className="fw-bold mb-4">Dish Management</h2>
      
      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <h4 className="fw-bold mb-3">Add New Dish</h4>
            <form onSubmit={handleAddDish}>
              <div className="mb-3">
                <label className="form-label fw-bold">Dish Name</label>
                <input type="text" className="form-control" value={newDish.name} onChange={(e) => setNewDish({...newDish, name: e.target.value})} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Price</label>
                  <input type="number" className="form-control" value={newDish.price} onChange={(e) => setNewDish({...newDish, price: e.target.value})} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Quantity (gm/ml)</label>
                  <input type="text" className="form-control" value={newDish.quantity} onChange={(e) => setNewDish({...newDish, quantity: e.target.value})} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Type</label>
                  <select className="form-select" value={newDish.type} onChange={(e) => setNewDish({...newDish, type: e.target.value})}>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Category</label>
                  <select className="form-select" value={newDish.categoryId} onChange={(e) => setNewDish({...newDish, categoryId: e.target.value})} required>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Dish Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
                {newDish.image && <img src={newDish.image} alt="Preview" className="mt-3 rounded" style={{ height: '80px', objectFit: 'cover' }} />}
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">Add Dish</button>
            </form>
          </div>
        </div>
        
        <div className="col-md-7">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <h4 className="fw-bold mb-3">All Dishes</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Dish</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map(dish => (
                    <tr key={dish.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {dish.image && <img src={dish.image} alt={dish.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />}
                          <span className="fw-bold">{dish.name}</span>
                        </div>
                      </td>
                      <td>{getCategoryName(dish.categoryId)}</td>
                      <td>₹{dish.price}</td>
                      <td>
                        <span className={`badge ${dish.type === 'Veg' ? 'bg-success' : 'bg-danger'}`}>{dish.type}</span>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(dish.id)} className="btn btn-sm btn-outline-danger">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dishes.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No dishes added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishManagement;
