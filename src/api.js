// Fake Backend Service simulating network requests
const DELAY = 500; // Simulated network delay in milliseconds

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fakeApi = {
  // --- AUTHENTICATION ---
  login: async (email, password) => {
    await wait(DELAY);
    if (!email || !password) throw new Error("Email and password required");
    const user = { id: '1', email, role: 'admin' };
    localStorage.setItem('restaurant_user', JSON.stringify(user));
    return user;
  },

  // --- BUSINESS DETAILS ---
  getBusinessDetails: async () => {
    await wait(DELAY);
    return JSON.parse(localStorage.getItem('restaurant_business') || '{}');
  },
  
  saveBusinessDetails: async (details) => {
    await wait(DELAY);
    localStorage.setItem('restaurant_business', JSON.stringify(details));
    return details;
  },

  // --- CATEGORIES ---
  getCategories: async () => {
    await wait(DELAY);
    return JSON.parse(localStorage.getItem('restaurant_categories') || '[]');
  },

  addCategory: async (category) => {
    await wait(DELAY);
    const categories = JSON.parse(localStorage.getItem('restaurant_categories') || '[]');
    const newCategory = { ...category, id: Date.now().toString() };
    const updated = [...categories, newCategory];
    localStorage.setItem('restaurant_categories', JSON.stringify(updated));
    return newCategory;
  },

  deleteCategory: async (id) => {
    await wait(DELAY);
    const categories = JSON.parse(localStorage.getItem('restaurant_categories') || '[]');
    const updated = categories.filter(c => c.id !== id);
    localStorage.setItem('restaurant_categories', JSON.stringify(updated));
    return { success: true };
  },

  // --- DISHES ---
  getDishes: async () => {
    await wait(DELAY);
    return JSON.parse(localStorage.getItem('restaurant_dishes') || '[]');
  },

  addDish: async (dish) => {
    await wait(DELAY);
    const dishes = JSON.parse(localStorage.getItem('restaurant_dishes') || '[]');
    const newDish = { ...dish, id: Date.now().toString() };
    const updated = [...dishes, newDish];
    localStorage.setItem('restaurant_dishes', JSON.stringify(updated));
    return newDish;
  },

  deleteDish: async (id) => {
    await wait(DELAY);
    const dishes = JSON.parse(localStorage.getItem('restaurant_dishes') || '[]');
    const updated = dishes.filter(d => d.id !== id);
    localStorage.setItem('restaurant_dishes', JSON.stringify(updated));
    return { success: true };
  },

  // --- THEMES ---
  getTheme: async () => {
    await wait(DELAY);
    return localStorage.getItem('restaurant_theme') || 'modern';
  },

  saveTheme: async (theme) => {
    await wait(DELAY);
    localStorage.setItem('restaurant_theme', theme);
    return theme;
  }
};
