import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { fakeBackend } from '../js/fakebackend';
import { auth } from '../js/auth';

const ThemeSelection = () => {
  const [currentTheme, setCurrentTheme] = useState('modern');
  const user = auth.getCurrentUser();

  useEffect(() => {
    if (user?.theme) {
      setCurrentTheme(user.theme);
    }
  }, [user]);

  const updateTheme = async (newTheme) => {
    if (user?.id) {
      setCurrentTheme(newTheme);
      await fakeBackend.updateClientTheme(user.id, newTheme);
      
      // Update local storage auth user theme to reflect immediately
      user.theme = newTheme;
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  };

  const themes = [
    { id: 'modern', name: 'Modern Dark', desc: 'Sleek, dark aesthetic with vibrant accents.' },
    { id: 'classic', name: 'Classic Elegance', desc: 'Warm, earthy tones with serif typography.' },
    { id: 'light', name: 'Light & Clean', desc: 'Minimalist white background with crisp text.' }
  ];

  return (
    <div className="container-fluid p-0">
      <h2 className="fw-bold mb-4">Theme Selection</h2>
      
      <div className="row g-4">
        {themes.map(t => (
          <div key={t.id} className="col-md-4">
            <div 
              className={`card shadow-sm border-0 p-4 h-100 rounded-4 cursor-pointer`}
              style={{ 
                cursor: 'pointer',
                borderWidth: currentTheme === t.id ? '2px' : '0',
                borderStyle: 'solid',
                borderColor: currentTheme === t.id ? 'var(--primary-color)' : 'transparent',
                boxShadow: currentTheme === t.id ? '0 0 0 2px var(--primary-color)' : ''
              }}
              onClick={() => updateTheme(t.id)}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0 text-dark">{t.name}</h4>
                {currentTheme === t.id && <div className="bg-primary text-white rounded-circle p-1 d-flex"><Check size={16} /></div>}
              </div>
              <p className="text-muted">{t.desc}</p>
              
              <div className="mt-4 p-3 rounded" style={{ background: t.id === 'modern' ? '#111827' : t.id === 'classic' ? '#fff8dc' : '#f3f4f6', border: '1px solid #ccc' }}>
                <div style={{ width: '50%', height: '8px', background: t.id === 'classic' ? '#8b5a2b' : '#ec4899', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ width: '80%', height: '8px', background: '#9ca3af', borderRadius: '4px', marginBottom: '16px' }}></div>
                <div className="d-flex gap-2">
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#d1d5db' }}></div>
                  <div>
                    <div style={{ width: '60px', height: '6px', background: '#9ca3af', borderRadius: '3px', marginBottom: '4px' }}></div>
                    <div style={{ width: '40px', height: '6px', background: '#9ca3af', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelection;
