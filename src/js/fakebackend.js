// Fake Backend Service simulating database/network requests
const DELAY = 0; // Simulated network delay in milliseconds
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeDB = () => {
  // Auto-clear old database to apply the new system with dual services
  if (localStorage.getItem('db_version') !== 'v5') {
    localStorage.removeItem('restaurant_db_clients');
    localStorage.removeItem('restaurant_db_categories');
    localStorage.removeItem('restaurant_db_dishes');
    localStorage.removeItem('restaurant_db_personal_qr');
    localStorage.setItem('db_version', 'v5');
  }

  // MIGRATION: Remove 'card-' prefix from any existing personal QR tokens in DB
  try {
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    let updated = false;
    pqrDb.forEach(p => {
      if (p.qrToken && p.qrToken.startsWith('card-')) {
        p.qrToken = p.qrToken.replace('card-', '');
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(pqrDb));
    }
  } catch (e) {
    console.error(e);
  }

  const dummyClients = [
    {
      id: 'client-1',
      name: 'The Pizza House',
      email: 'admin@pizzahouse.com',
      password: 'password123',
      services: ['restaurant_menu'],
      serviceDurations: { 'restaurant_menu': 12 },
      qrToken: 'demo-pizza-token',
      theme: 'modern',
      createdAt: new Date().toISOString(),
      businessDetails: { name: 'The Pizza House', phone: '+1 234 567 8900', address: '123 Pizza Street, Food City', logo: '' },
      isActive: true,
      isServiceSuspended: false,
      scanCount: 154,
      themeUpdated: true,
      completedSetups: ['restaurant_menu']
    },
    {
      id: 'client-2',
      name: 'John Doe Enterprise',
      email: 'john@enterprise.com',
      password: 'password123',
      services: ['personal_qr'],
      serviceDurations: { 'personal_qr': 24 },
      qrToken: 'demo-john-token',
      personalQrToken: 'card-johndoe',
      theme: 'classic',
      createdAt: new Date().toISOString(),
      businessDetails: {},
      isActive: true,
      isServiceSuspended: false,
      scanCount: 42,
      themeUpdated: false,
      completedSetups: ['personal_qr']
    },
    {
      id: 'client-3',
      name: 'Elite Cafe & Chef Jane',
      email: 'jane@elitecafe.com',
      password: 'password123',
      services: ['restaurant_menu', 'personal_qr'],
      serviceDurations: { 'restaurant_menu': 6, 'personal_qr': 6 },
      qrToken: 'demo-elite-token',
      personalQrToken: 'card-jane',
      theme: 'luxury',
      createdAt: new Date().toISOString(),
      businessDetails: { name: 'Elite Cafe', phone: '+1 555 123 4567', address: '789 Luxury Ave, Food City', logo: '' },
      isActive: true,
      isServiceSuspended: false,
      scanCount: 89,
      themeUpdated: true,
      completedSetups: ['restaurant_menu', 'personal_qr']
    }
  ];

  const dummyCategories = [
    { id: 'cat-1', name: 'Wood Fired Pizzas', clientId: 'client-1' },
    { id: 'cat-2', name: 'Beverages & Sides', clientId: 'client-1' },
    { id: 'cat-3', name: 'Signature Coffees', clientId: 'client-3' },
    { id: 'cat-4', name: 'Artisan Pastries', clientId: 'client-3' }
  ];

  const dummyDishes = [
    { id: 'dish-1', name: 'Classic Margherita', price: '299', quantity: '10 inch', type: 'Veg', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-1', isActive: true },
    { id: 'dish-2', name: 'Pepperoni Feast', price: '399', quantity: '12 inch', type: 'Non-Veg', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-1', isActive: true },
    { id: 'dish-3', name: 'Garlic Breadsticks', price: '149', quantity: '4 pieces', type: 'Veg', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-2', isActive: true },
    { id: 'dish-4', name: 'Caramel Macchiato', price: '199', quantity: '350ml', type: 'Veg', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-3', isActive: true },
    { id: 'dish-5', name: 'Butter Croissant', price: '129', quantity: '1 piece', type: 'Veg', image: 'https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?w=500&auto=format&fit=crop&q=60', categoryId: 'cat-4', isActive: true }
  ];

  const dummyPersonalQR = [
    {
      id: 'pqr-1',
      clientId: 'client-2',
      qrToken: 'card-johndoe',
      bio: 'Hi, I am John Doe. CEO at Enterprise Solutions. Let us connect!',
      profilePic: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'pqr-2',
      clientId: 'client-3',
      qrToken: 'card-jane',
      bio: 'Hi, I am Chef Jane. Founder of Elite Cafe. Passionate about culinary arts.',
      profilePic: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&auto=format&fit=crop&q=60'
    }
  ];

  const dummyPersonalQRLinks = [
    { id: 'l1', profileId: 'pqr-1', title: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', clicks: 0, displayOrder: 1, isActive: true },
    { id: 'l2', profileId: 'pqr-1', title: 'Personal Website', url: 'https://example.com', icon: 'globe', clicks: 0, displayOrder: 2, isActive: true },
    { id: 'l3', profileId: 'pqr-2', title: 'Instagram', url: 'https://instagram.com', icon: 'instagram', clicks: 0, displayOrder: 1, isActive: true },
    { id: 'l4', profileId: 'pqr-2', title: 'Book a Masterclass', url: 'https://example.com/class', icon: 'calendar', clicks: 0, displayOrder: 2, isActive: true }
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
  if (!localStorage.getItem('restaurant_db_personal_qr')) {
    localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(dummyPersonalQR));
  }
  if (!localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks')) {
    localStorage.setItem('restaurant_db_personal_qr_calltoactionlinks', JSON.stringify(dummyPersonalQRLinks));
  }
};
initializeDB();

export const fakeBackend = {
  // --- ADMIN METHODS (Manage Clients) ---
  getClients: async () => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const categories = JSON.parse(localStorage.getItem('restaurant_db_categories') || '[]');
    const dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    
    let dbUpdated = false;
    const updatedClients = clients.map(c => {
      if (!c.completedSetups) c.completedSetups = [];

      // Sync legacy isSetupComplete -> completedSetups
      if (c.isSetupComplete && !c.completedSetups.includes('restaurant_menu')) {
        c.completedSetups.push('restaurant_menu');
        dbUpdated = true;
      }

      if (!c.completedSetups.includes('restaurant_menu')) {
        const hasBusiness = !!(c.businessDetails && c.businessDetails.name);
        const clientCategoryIds = categories.filter(cat => cat.clientId === c.id).map(cat => cat.id);
        const hasCategories = clientCategoryIds.length > 0;
        const hasDishes = dishes.some(d => clientCategoryIds.includes(d.categoryId));
        const hasTheme = c.themeUpdated === true;
        
        if (hasBusiness && hasCategories && hasDishes && hasTheme) {
          c.isSetupComplete = true;
          c.completedSetups.push('restaurant_menu');
          dbUpdated = true;
        }
      }

      // Link Personal QR Database info
      const pqrInfo = pqrDb.find(p => p.clientId === c.id);
      if (pqrInfo) {
        c.personalQrToken = pqrInfo.qrToken;
        const linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
        const pqrLinks = linksDb.filter(l => l.profileId === pqrInfo.id);
        // Check if setup is actually complete (e.g., they have a bio, pic, and links)
        if (pqrInfo.bio && pqrInfo.profilePic && pqrLinks.length > 0) {
          if (!c.completedSetups.includes('personal_qr')) {
            c.completedSetups.push('personal_qr');
            dbUpdated = true;
          }
        }
      }
      
      return c;
    });

    if (dbUpdated) {
      localStorage.setItem('restaurant_db_clients', JSON.stringify(updatedClients));
    }
    
    return updatedClients;
  },

  createClient: async (clientData) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');

    // Auto-generate QR Token
    const qrToken = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    const createdAt = new Date().toISOString();
    
    const serviceExpiries = {};
    if (clientData.serviceDurations) {
      Object.keys(clientData.serviceDurations).forEach(sId => {
        const d = new Date();
        d.setMonth(d.getMonth() + parseInt(clientData.serviceDurations[sId] || 1));
        serviceExpiries[sId] = d.toISOString();
      });
    }
    const maxExpiry = Object.values(serviceExpiries).sort().reverse()[0] || (new Date(new Date().setMonth(new Date().getMonth() + 1))).toISOString();

    const newClient = {
      ...clientData,
      id: Date.now().toString(),
      qrToken: qrToken,
      theme: 'modern',
      themeUpdated: false,
      createdAt: createdAt,
      expireAt: maxExpiry,
      serviceExpiries: serviceExpiries,
      completedSetups: []
    };

    clients.push(newClient);
    localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));

    if (newClient.services && newClient.services.includes('personal_qr')) {
      const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
      pqrDb.push({
        id: Date.now().toString() + '-pqr',
        clientId: newClient.id,
        qrToken: Math.random().toString(36).substring(2, 8) + Date.now().toString(36).substring(4),
        bio: '',
        profilePic: ''
      });
      localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(pqrDb));
    }

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
      
      // Recalculate expireAt based on serviceDurations
      const serviceExpiries = updatedClient.serviceExpiries || {};
      if (updatedClient.serviceDurations) {
        Object.keys(updatedClient.serviceDurations).forEach(sId => {
          const d = new Date(updatedClient.createdAt);
          d.setMonth(d.getMonth() + parseInt(updatedClient.serviceDurations[sId] || 1));
          serviceExpiries[sId] = d.toISOString();
        });
      }
      updatedClient.serviceExpiries = serviceExpiries;
      const maxExpiry = Object.values(serviceExpiries).sort().reverse()[0];
      updatedClient.expireAt = maxExpiry || updatedClient.expireAt || (new Date(new Date().setMonth(new Date().getMonth() + 1))).toISOString();

      clients[index] = updatedClient;
      clients[index] = updatedClient;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));

      if (updatedClient.services && updatedClient.services.includes('personal_qr')) {
        const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
        if (!pqrDb.find(p => p.clientId === updatedClient.id)) {
          pqrDb.push({
            id: Date.now().toString() + '-pqr',
            clientId: updatedClient.id,
            qrToken: 'card-' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36).substring(4),
            bio: '',
            profilePic: ''
          });
          localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(pqrDb));
        }
      }

      return clients[index];
    }
    throw new Error('Client not found');
  },

  markSetupComplete: async (clientId) => {
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id === clientId);
    if (index > -1 && !clients[index].isSetupComplete) {
      clients[index].isSetupComplete = true;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
    }
  },

  toggleClientServiceSuspension: async (id, serviceName) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id == id);
    if (index > -1) {
      if (!clients[index].suspendedServices) clients[index].suspendedServices = [];
      const isSuspended = clients[index].suspendedServices.includes(serviceName);
      if (isSuspended) {
        clients[index].suspendedServices = clients[index].suspendedServices.filter(s => s !== serviceName);
      } else {
        clients[index].suspendedServices.push(serviceName);
      }
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
      return clients[index];
    }
    throw new Error('Client not found');
  },

  removeServiceFromClient: async (id, serviceName) => {
    await wait(DELAY);
    let clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id == id);
    if (index > -1) {
      clients[index].services = (clients[index].services || []).filter(s => s !== serviceName);
      
      if (clients[index].completedSetups) {
        clients[index].completedSetups = clients[index].completedSetups.filter(s => s !== serviceName);
      }
      if (clients[index].suspendedServices) {
        clients[index].suspendedServices = clients[index].suspendedServices.filter(s => s !== serviceName);
      }

      // Deep delete associated data
      if (serviceName === 'restaurant_menu') {
        delete clients[index].businessDetails;
        delete clients[index].themeUpdated;
        clients[index].isSetupComplete = false;
        
        let categories = JSON.parse(localStorage.getItem('restaurant_db_categories') || '[]');
        const clientCategoryIds = categories.filter(c => c.clientId === id).map(c => c.id);
        categories = categories.filter(c => c.clientId !== id);
        localStorage.setItem('restaurant_db_categories', JSON.stringify(categories));

        let dishes = JSON.parse(localStorage.getItem('restaurant_db_dishes') || '[]');
        dishes = dishes.filter(d => !clientCategoryIds.includes(d.categoryId));
        localStorage.setItem('restaurant_db_dishes', JSON.stringify(dishes));
      } else if (serviceName === 'personal_qr') {
        let pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
        const pqrProfile = pqrDb.find(p => p.clientId === id);
        if (pqrProfile) {
           let linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
           linksDb = linksDb.filter(l => l.profileId !== pqrProfile.id);
           localStorage.setItem('restaurant_db_personal_qr_calltoactionlinks', JSON.stringify(linksDb));
        }

        pqrDb = pqrDb.filter(p => p.clientId !== id);
        localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(pqrDb));
        
        delete clients[index].bio;
        delete clients[index].profilePic;
      }

      if (clients[index].services.length === 0) {
        clients.splice(index, 1);
      }
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
    }
  },

  deleteClient: async (id) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const updated = clients.filter(c => c.id != id);
    localStorage.setItem('restaurant_db_clients', JSON.stringify(updated));

    let pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    pqrDb = pqrDb.filter(p => p.clientId != id);
    localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(pqrDb));

    return { success: true };
  },

  updateClientTheme: async (clientId, theme) => {
    await wait(DELAY);
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const index = clients.findIndex(c => c.id === clientId);
    if (index > -1) {
      clients[index].theme = theme;
      clients[index].themeUpdated = true;
      localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
      return clients[index];
    }
    throw new Error('Client not found');
  },

  updatePersonalQrTheme: async (clientId, themeId) => {
    await wait(DELAY);
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    const index = pqrDb.findIndex(p => p.clientId === clientId);
    if (index > -1) {
      pqrDb[index].theme = themeId;
      localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(pqrDb));
      return pqrDb[index];
    }
    throw new Error('Profile not found');
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
    return { 
      isActive: client?.isActive === undefined ? true : client.isActive,
      suspendedServices: client?.suspendedServices || [] 
    };
  },



  getPersonalQRDetails: async (clientId) => {
    await wait(DELAY);
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    const profile = pqrDb.find(p => p.clientId === clientId);
    if (profile) {
      const linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
      profile.links = linksDb.filter(l => l.profileId === profile.id).sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      return profile;
    }
    return null;
  },

  updatePersonalQRDetails: async (clientId, updatedData) => {
    await wait(DELAY);
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    const index = pqrDb.findIndex(p => p.clientId === clientId);
    if (index > -1) {
      const { links, ...profileData } = updatedData;
      pqrDb[index] = { ...pqrDb[index], ...profileData };
      localStorage.setItem('restaurant_db_personal_qr', JSON.stringify(pqrDb));
      
      let pqrLinks = [];
      if (links && Array.isArray(links)) {
        let linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
        linksDb = linksDb.filter(l => l.profileId !== pqrDb[index].id);
        pqrLinks = links.map((l, i) => ({
          ...l,
          id: l.id && !l.id.toString().startsWith('temp') ? l.id : Date.now().toString() + '-' + i,
          profileId: pqrDb[index].id,
          displayOrder: i,
          clicks: l.clicks || l.clickCount || 0,
          isActive: l.isActive !== undefined ? l.isActive : true
        }));
        linksDb = [...linksDb, ...pqrLinks];
        localStorage.setItem('restaurant_db_personal_qr_calltoactionlinks', JSON.stringify(linksDb));
        pqrDb[index].links = pqrLinks;
      } else {
        const linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
        pqrLinks = linksDb.filter(l => l.profileId === pqrDb[index].id);
      }

      // Also mark setup complete in clients if necessary
      const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
      const cIndex = clients.findIndex(c => c.id === clientId);
      if (cIndex > -1) {
        if (!clients[cIndex].completedSetups) clients[cIndex].completedSetups = [];
        if (pqrDb[index].bio && pqrDb[index].profilePic && pqrLinks.length > 0) {
          if (!clients[cIndex].completedSetups.includes('personal_qr')) {
            clients[cIndex].completedSetups.push('personal_qr');
            localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
          }
        }
      }
      return pqrDb[index];
    }
    throw new Error('Personal QR profile not found');
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

  incrementLinkClick: async (qrToken, linkId) => {
    // Find the profile id via qrToken
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    const profile = pqrDb.find(p => p.qrToken === qrToken);
    if (!profile) return; // not found

    const linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
    const linkIndex = linksDb.findIndex(l => l.id === linkId);
    if (linkIndex > -1) {
      linksDb[linkIndex].clicks = (linksDb[linkIndex].clicks || 0) + 1;
      localStorage.setItem('restaurant_db_personal_qr_calltoactionlinks', JSON.stringify(linksDb));
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
    if (client.suspendedServices && client.suspendedServices.includes('restaurant_menu')) throw new Error('Service Suspended by Admin');
    if (client.isActive === false) throw new Error('This menu is currently deactivated by the restaurant owner.');

    const categories = await fakeBackend.getCategoriesByClientId(client.id);
    let dishes = await fakeBackend.getDishesByClientId(client.id);
    // Filter out deactivated dishes for public view
    dishes = dishes.filter(d => d.isActive !== false);

    return { client, categories, dishes };
  },

  getPersonalCardByToken: async (qrToken) => {
    await wait(DELAY);
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    const profile = pqrDb.find(p => p.qrToken === qrToken);
    
    if (!profile) throw new Error('Invalid QR Token');
    
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const client = clients.find(c => c.id === profile.clientId);
    
    if (!client) throw new Error('Account not found');
    if (client.suspendedServices && client.suspendedServices.includes('personal_qr')) throw new Error('Service Suspended by Admin');
    if (client.isActive === false) throw new Error('This profile is currently deactivated.');

    const linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
    profile.links = linksDb.filter(l => l.profileId === profile.id && l.isActive !== false).sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return { client, profile };
  },

  identifyToken: async (token) => {
    await wait(DELAY);
    
    // Search Personal QR Database
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    if (pqrDb.some(p => p.qrToken === token)) {
      return 'personal_qr';
    }

    // Search Restaurant Menu Database
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    if (clients.some(c => c.qrToken === token)) {
      return 'restaurant_menu';
    }

    // Future services can be added here
    
    throw new Error('Invalid Token');
  },

  incrementLinkClick: async (qrToken, linkId) => {
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    const profile = pqrDb.find(p => p.qrToken === qrToken);
    
    if (profile) {
      const linksDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_calltoactionlinks') || '[]');
      const linkIndex = linksDb.findIndex(l => l.id === linkId && l.profileId === profile.id);
      if (linkIndex > -1) {
        linksDb[linkIndex].clicks = (linksDb[linkIndex].clicks || 0) + 1;
        localStorage.setItem('restaurant_db_personal_qr_calltoactionlinks', JSON.stringify(linksDb));
      }
    }
    return { success: true };
  },

  submitPersonalQRInquiry: async (qrToken, inquiryData) => {
    await wait(DELAY);
    const pqrDb = JSON.parse(localStorage.getItem('restaurant_db_personal_qr') || '[]');
    const profile = pqrDb.find(p => p.qrToken === qrToken);
    if (!profile) throw new Error('Invalid QR Token');

    const inquiries = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_inquiries') || '[]');
    const newInquiry = {
      id: Date.now().toString(),
      clientId: profile.clientId,
      ...inquiryData,
      createdAt: new Date().toISOString()
    };
    inquiries.push(newInquiry);
    localStorage.setItem('restaurant_db_personal_qr_inquiries', JSON.stringify(inquiries));
    return { success: true };
  },

  getPersonalQRInquiries: async (clientId) => {
    await wait(DELAY);
    const inquiries = JSON.parse(localStorage.getItem('restaurant_db_personal_qr_inquiries') || '[]');
    return inquiries.filter(i => i.clientId === clientId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};
