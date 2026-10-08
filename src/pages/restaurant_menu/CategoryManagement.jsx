import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { fakeBackend } from '../../js/fakebackend';
import { auth } from '../../js/auth';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const user = auth.getCurrentUser();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    if (user?.id) {
      const data = await fakeBackend.getCategoriesByClientId(user.id);
      setCategories(data);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.trim() && user?.id) {
      await fakeBackend.addCategory(user.id, newCategory.trim());
      setNewCategory('');
      fetchCategories();
    }
  };

  const handleDelete = async (id) => {
    await fakeBackend.deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="container-fluid p-0">
      <h2 className="fw-bold mb-4">Category Management</h2>
      
      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <h4 className="fw-bold mb-3">Add New Category</h4>
            <form onSubmit={handleAddCategory} className="d-flex gap-2">
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Beverages" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
              />
              <button type="submit" className="btn btn-primary fw-bold px-4">Add</button>
            </form>
          </div>
        </div>
        
        <div className="col-md-7">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <h4 className="fw-bold mb-3">All Categories</h4>
            {categories.length === 0 ? (
              <p className="text-muted">No categories added yet.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {categories.map((cat) => (
                  <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center px-0 border-bottom">
                    <span className="fw-bold">{cat.name}</span>
                    <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-outline-danger">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
