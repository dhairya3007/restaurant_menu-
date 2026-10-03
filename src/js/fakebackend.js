// Fake Backend Service simulating database/network requests
const DELAY = 0; // Simulated network delay in milliseconds
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeDB = () => {
  const dummyClients = [
    {
      id: 'client-1',
      name: 'The Pizza House',
      email: 'admin@pizzahouse.com',
      password: 'password123',
      plan: 'Premium Plan',
      planDuration: 12,
      qrToken: 'demo-pizza-token',
      theme: 'modern',
      createdAt: new Date().toISOString(),
      expireAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      businessDetails: { name: 'The Pizza House', phone: '+1 234 567 8900', address: '123 Pizza Street, Food City', logo: '' },
      isActive: true,
      scanCount: 42
    },
    {
      id: 'client-2',
      name: 'Burger Queen',
      email: 'admin@burgerqueen.com',
      password: 'password123',
      plan: 'Basic Plan',
      planDuration: 6,
      qrToken: 'demo-burger-token',
      theme: 'classic',
      createdAt: new Date().toISOString(),
      expireAt: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
      businessDetails: { name: 'Burger Queen', phone: '+1 987 654 3210', address: '456 Burger Avenue, Food City', logo: '' },
      isActive: true,
      scanCount: 15
    }
  ];

  const dummyCategories = [
    { id: 'cat-1', name: 'Wood Fired Pizzas', clientId: 'client-1' },
    { id: 'cat-2', name: 'Beverages & Sides', clientId: 'client-1' },
    { id: 'cat-3', name: 'Gourmet Burgers', clientId: 'client-2' }
  ];

  const dummyDishes = [
    { id: 'dish-1', name: 'Classic Margherita', price: '299', quantity: '10 inch', type: 'Veg', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-1', isActive: true },
    { id: 'dish-2', name: 'Pepperoni Feast', price: '399', quantity: '12 inch', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-1', isActive: true },
    { id: 'dish-3', name: 'Garlic Breadsticks', price: '149', quantity: '4 pieces', type: 'Veg', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-2', isActive: true },
    { id: 'dish-4', name: 'Double Cheese Burger', price: '249', quantity: '250gm', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-3', isActive: true }
  ];

  if (!localStorage.getItem('restaurant_db_clients')) {
    localStorage.setItem('restaurant_db_clients', JSON.stringify(dummyClients));
  }
  if (!localStorage.getItem('restaurant_db_categories')) {
    localStorage.setItem('restaurant_db_categories', JSON.stringify(dummyCategories));
  }
  if (!localStorage.getItem('restaurant_db_dishes')) {
    localStorage.setItem('restaurant_db_dishes', JSON.stringify(dummyDishes));
  }
};
initializeDB();

export const fakeBackend = {
  // --- ADMIN METHODS (Manage Clients) ---
  getClients: async () => {
    await wait(DELAY);
    return JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
  },

  createClient: async (clientData) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');

    // Auto-generate QR Token
    const qrToken = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    const createdAt = new Date().toISOString();
    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + parseInt(clientData.planDuration || 1));
    const expireAt = expireDate.toISOString();

    const newClient = {
      ...clientData,
      id: Date.now().toString(),
      qrToken: qrToken,
      theme: 'modern',
      createdAt: createdAt,
      expireAt: expireAt
    };

    clients.push(newClient);
    localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
    return newClient;
  },

  updateClient: async (id, updatedData) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id == id);
    if (index > -1) {
      let updatedClient = { ...clients[index], ...updatedData };
      
      // Handle legacy clients missing createdAt
      if (!updatedClient.createdAt) {
        updatedClient.createdAt = new Date().toISOString();
      }
      
      // Recalculate expireAt based on planDuration
      const expireDate = new Date(updatedClient.createdAt);
      expireDate.setMonth(expireDate.getMonth() + parseInt(updatedClient.planDuration || 1));
      updatedClient.expireAt = expireDate.toISOString();

      clients[index] = updatedClient;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
      return clients[index];
    }
    throw new Error('Client not found');
  },

  deleteClient: async (id) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const updated = clients.filter(c => c.id != id);
    localStorage.setItem('restaurant_db_clients', JSON.stringify(updated));
    return { success: true };
  },

  updateClientTheme: async (clientId, theme) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id === clientId);
    if (index > -1) {
      clients[index].theme = theme;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
      return clients[index];
    }
    throw new Error('Client not found');
  },

  // --- CLIENT METHODS (Manage Categories & Dishes) ---
  getBusinessDetails: async (clientId) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const client = clients.find(c => c.id === clientId);
    return client?.businessDetails || { name: '', phone: '', address: '', logo: '' };
  },

  saveBusinessDetails: async (clientId, details) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id === clientId);
    if (index > -1) {
      clients[index].businessDetails = details;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
      return clients[index];
    }
    throw new Error('Client not found');
  },

  toggleClientStatus: async (clientId) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id === clientId);
    if (index > -1) {
      clients[index].isActive = clients[index].isActive === undefined ? false : !clients[index].isActive;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
      return clients[index].isActive;
    }
    throw new Error('Client not found');
  },

  getClientStatus: async (clientId) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const client = clients.find(c => c.id === clientId);
    return client?.isActive === undefined ? true : client.isActive;
  },

  getScanCount: async (clientId) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const client = clients.find(c => c.id === clientId);
    return client?.scanCount || 0;
  },

  incrementScanCount: async (qrToken) => {
    // No wait delay here to make it fast for public menu
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.qrToken === qrToken);
    if (index > -1) {
      clients[index].scanCount = (clients[index].scanCount || 0) + 1;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
    }
  },

  getCategoriesByClientId: async (clientId) => {
    await wait(DELAY);
    const categories = JSON.parse(localStorage.getItem('restaurant_db_categories') || '[]');
    return categories.filter(c => c.clientId === clientId);
  },

  addCategory: async (clientId, name) => {
    await wait(DELAY);
    const categories = JSON.parse(localStorage.getItem('restaurant_db_categories') || '[]');
    const newCategory = { id: Date.now().toString(), name, clientId };
    categories.push(newCategory);
    localStorage.setItem('restaurant_db_categories', JSON.stringify(categories));
    return newCategory;
  },

  deleteCategory: async (id) => {
    await wait(DELAY);
    const categories = JSON.parse(localStorage.getItem('restaurant_db_categories') || '[]');
    const updated = categories.filter(c => c.id !== id);
    localStorage.setItem('restaurant_db_categories', JSON.stringify(updated));

    // Also delete dishes in this category
    const dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
    const updatedDishes = dishes.filter(d => d.categoryId !== id);
    localStorage.setItem('restaurant_db_dishes', JSON.stringify(updatedDishes));

    return { success: true };
  },

  getDishesByClientId: async (clientId) => {
    await wait(DELAY);
    // Dishe filter: first get categories for client, then dishes for those categories
    const categories = JSON.parse(localStorage.getItem('restaurant_db_categories') || '[]');
    const clientCategoryIds = categories.filter(c => c.clientId === clientId).map(c => c.id);

    const dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
    return dishes.filter(d => clientCategoryIds.includes(d.categoryId));
  },

  addDish: async (dishData) => {
    await wait(DELAY);
    const dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
    const newDish = { ...dishData, id: Date.now().toString() };
    dishes.push(newDish);
    localStorage.setItem('restaurant_db_dishes', JSON.stringify(dishes));
    return newDish;
  },

  deleteDish: async (id) => {
    await wait(DELAY);
    const dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
    const updated = dishes.filter(d => d.id !== id);
    localStorage.setItem('restaurant_db_dishes', JSON.stringify(updated));
    return { success: true };
  },

  updateDish: async (id, updatedData) => {
    await wait(DELAY);
    const dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
    const index = dishes.findIndex(d => d.id == id);
    if (index > -1) {
      dishes[index] = { ...dishes[index], ...updatedData };
      localStorage.setItem('restaurant_db_dishes', JSON.stringify(dishes));
      return dishes[index];
    }
    throw new Error('Dish not found');
  },

  toggleDishStatus: async (id) => {
    await wait(DELAY);
    const dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
    const index = dishes.findIndex(d => d.id == id);
    if (index > -1) {
      dishes[index].isActive = dishes[index].isActive === false ? true : false;
      localStorage.setItem('restaurant_db_dishes', JSON.stringify(dishes));
      return dishes[index].isActive;
    }
    throw new Error('Dish not found');
  },

  // --- END USER VIEW (Public Menu) ---
  getMenuByToken: async (qrToken) => {
    await wait(DELAY);

    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const client = clients.find(c => c.qrToken === qrToken);

    if (!client) throw new Error('Invalid QR Token');
    if (client.isActive === false) throw new Error('This menu is currently deactivated by the restaurant owner.');

    // Increment scan count in background
    setTimeout(() => fakeBackend.incrementScanCount(qrToken), 0);

    const categories = await fakeBackend.getCategoriesByClientId(client.id);
    let dishes = await fakeBackend.getDishesByClientId(client.id);
    // Filter out deactivated dishes for public view
    dishes = dishes.filter(d => d.isActive !== false);

    return { client, categories, dishes };
  }
};