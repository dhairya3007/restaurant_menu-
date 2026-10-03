// Authentication Mock Service
const DELAY = 400;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const auth = {
  login: async (email, password) => {
    await wait(DELAY); 
    
    if (!email || !password) throw new Error("Email and password are required.");
    
    // Super Admin check
    if (email.toLowerCase() === 'admin@test.com') {
      const user = { id: 'admin-001', email, role: 'super_admin' };
      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    }
    
    // Client check
    const clients = JSON.parse(localStorage.getItem('restaurant_db_clients') || '[]');
    let client = clients.find(c => c.email === email && c.password === password);
    
    // First-time login: If admin set the email but left password blank
    if (!client) {
      const firstTimeClient = clients.find(c => c.email === email && (!c.password || c.password.trim() === ''));
      if (firstTimeClient) {
        // Automatically save their new password
        firstTimeClient.password = password;
        localStorage.setItem('restaurant_db_clients', JSON.stringify(clients));
        client = firstTimeClient;
      }
    }
    
    if (client) {
      const user = { id: client.id, email: client.email, role: 'client', name: client.name, qrToken: client.qrToken, theme: client.theme };
      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    }
    
    throw new Error("Invalid credentials. If you are a client, ensure the admin has created your account.");
  },
  
  logout: () => {
    localStorage.removeItem('auth_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_user');
  }
};
