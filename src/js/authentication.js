// Fake Authentication Service
const DELAY = 600;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authentication = {
  login: async (email, password) => {
    await wait(DELAY); // Simulate loading time
    
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    
    // Check if it's a Super Admin
    if (email.toLowerCase().includes('admin')) {
      const user = { id: 'admin_1', email, role: 'super_admin', name: 'Super Admin' };
      localStorage.setItem('super_admin_user', JSON.stringify(user));
      return user;
    }
    
    // Otherwise, it's a client. Check if they exist in the DB!
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    const existingClient = clients.find(c => c.email === email && c.password === password);
    
    if (existingClient) {
      const user = { 
        id: existingClient.id, 
        email: existingClient.email, 
        role: 'client',
        name: existingClient.name,
        qrToken: existingClient.qrToken,
        theme: existingClient.theme
      };
      // We set auth_user here because ListQR uses 'auth_user' for admin auto-login. 
      // Let's use 'auth_user' or 'restaurant_user' consistently. The app uses 'restaurant_user' in isAuthenticated.
      localStorage.setItem('restaurant_user', JSON.stringify(user));
      return user;
    }

    throw new Error("Invalid email or password.");
  },
  
  logout: () => {
    localStorage.removeItem('restaurant_user');
    localStorage.removeItem('super_admin_user');
  },

  getCurrentUser: () => {
    const admin = localStorage.getItem('super_admin_user');
    const client = localStorage.getItem('restaurant_user');
    
    if (admin) return JSON.parse(admin);
    if (client) return JSON.parse(client);
    
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('restaurant_user') || !!localStorage.getItem('super_admin_user');
  }
};
