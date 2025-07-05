import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { Palette, User, Shield, Bell, Moon, Sun } from 'lucide-react';

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();

  // Available DaisyUI themes with their color previews
  const themes = [
    { name: 'light', label: 'Light', colors: ['#ffffff', '#f8fafc', '#64748b', '#1e293b'] },
    { name: 'dark', label: 'Dark', colors: ['#1e293b', '#334155', '#64748b', '#f1f5f9'] },
    { name: 'cupcake', label: 'Cupcake', colors: ['#faf7f5', '#fef3c7', '#f59e0b', '#92400e'] },
    { name: 'bumblebee', label: 'Bumblebee', colors: ['#fefce8', '#fef3c7', '#f59e0b', '#92400e'] },
    { name: 'emerald', label: 'Emerald', colors: ['#ecfdf5', '#d1fae5', '#10b981', '#065f46'] },
    { name: 'corporate', label: 'Corporate', colors: ['#ffffff', '#f8fafc', '#3b82f6', '#1e40af'] },
    { name: 'synthwave', label: 'Synthwave', colors: ['#2d1b69', '#a855f7', '#f59e0b', '#ffffff'] },
    { name: 'retro', label: 'Retro', colors: ['#e4d8b4', '#d4c4a8', '#a67c52', '#8b4513'] },
    { name: 'cyberpunk', label: 'Cyberpunk', colors: ['#f9f000', '#000000', '#ff7598', '#ffffff'] },
    { name: 'valentine', label: 'Valentine', colors: ['#fdf2f8', '#fce7f3', '#ec4899', '#be185d'] },
    { name: 'halloween', label: 'Halloween', colors: ['#f97316', '#ea580c', '#dc2626', '#7c2d12'] },
    { name: 'garden', label: 'Garden', colors: ['#f0fdf4', '#dcfce7', '#22c55e', '#15803d'] },
    { name: 'forest', label: 'Forest', colors: ['#064e3b', '#065f46', '#16a34a', '#f0fdf4'] },
    { name: 'aqua', label: 'Aqua', colors: ['#f0f9ff', '#e0f2fe', '#0ea5e9', '#0369a1'] },
    { name: 'pastel', label: 'Pastel', colors: ['#fef2f2', '#fecaca', '#f87171', '#dc2626'] },
    { name: 'fantasy', label: 'Fantasy', colors: ['#fdf4ff', '#f3e8ff', '#a855f7', '#7c3aed'] },
    { name: 'wireframe', label: 'Wireframe', colors: ['#ffffff', '#e5e7eb', '#6b7280', '#1f2937'] },
    { name: 'black', label: 'Black', colors: ['#000000', '#1f2937', '#6b7280', '#f9fafb'] },
    { name: 'luxury', label: 'Luxury', colors: ['#1a1a1a', '#2d2d2d', '#gold', '#ffffff'] },
    { name: 'dracula', label: 'Dracula', colors: ['#282a36', '#44475a', '#bd93f9', '#f8f8f2'] },
    { name: 'cmyk', label: 'CMYK', colors: ['#ffffff', '#e0e0e0', '#000000', '#ff0000'] },
    { name: 'autumn', label: 'Autumn', colors: ['#fef3c7', '#f59e0b', '#d97706', '#92400e'] },
    { name: 'business', label: 'Business', colors: ['#ffffff', '#f8fafc', '#1e293b', '#0f172a'] },
    { name: 'acid', label: 'Acid', colors: ['#f0fdf4', '#bbf7d0', '#22c55e', '#15803d'] },
    { name: 'lemonade', label: 'Lemonade', colors: ['#fefce8', '#fef3c7', '#f59e0b', '#92400e'] },
    { name: 'night', label: 'Night', colors: ['#1a1a1a', '#2d2d2d', '#4a4a4a', '#ffffff'] },
    { name: 'coffee', label: 'Coffee', colors: ['#f5f5dc', '#deb887', '#8b4513', '#654321'] },
    { name: 'winter', label: 'Winter', colors: ['#f0f9ff', '#e0f2fe', '#0ea5e9', '#0369a1'] },
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">Settings</h1>
          <p className="text-base-content/70">Customize your chat experience</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Settings */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Theme Settings</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-base-content/70 mb-4">
                Choose a theme to customize the appearance of your chat application.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((themeOption) => (
                  <div
                    key={themeOption.name}
                    onClick={() => handleThemeChange(themeOption.name)}
                    className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all hover:scale-105 ${
                      theme === themeOption.name
                        ? 'border-primary bg-primary/10'
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                  >
                    {/* Theme Color Preview */}
                    <div className="flex gap-1 mb-2">
                      {themeOption.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-base-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    {/* Theme Name */}
                    <div className="text-center">
                      <span className={`text-sm font-medium ${
                        theme === themeOption.name ? 'text-primary' : 'text-base-content'
                      }`}>
                        {themeOption.label}
                      </span>
                    </div>
                    
                    {/* Active Indicator */}
                    {theme === themeOption.name && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={authUser?.profilepic || '/default-avatar.png'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-base-300"
                />
                <div>
                  <h3 className="text-lg font-semibold text-base-content">
                    {authUser?.fullname || 'User Name'}
                  </h3>
                  <p className="text-base-content/70">{authUser?.email || 'user@example.com'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="text-base-content">Name</span>
                  <span className="text-base-content/70">{authUser?.fullname || 'User Name'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300">
                  <span className="text-base-content">Status</span>
                  <span className="text-success">Online</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-base-content">Member Since</span>
                  <span className="text-base-content/70">
                    {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base-content">Two-Factor Authentication</h3>
                  <p className="text-sm text-base-content/70">Add an extra layer of security</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base-content">Read Receipts</h3>
                  <p className="text-sm text-base-content/70">Show when messages are read</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base-content">Online Status</h3>
                  <p className="text-sm text-base-content/70">Show when you're online</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base-content">Message Notifications</h3>
                  <p className="text-sm text-base-content/70">Get notified for new messages</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base-content">Friend Requests</h3>
                  <p className="text-sm text-base-content/70">Notify when someone sends a friend request</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base-content">Group Invitations</h3>
                  <p className="text-sm text-base-content/70">Notify when invited to groups</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Current Theme Display */}
        <div className="mt-8 bg-base-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-base-content">Current Theme</h3>
              <p className="text-base-content/70">
                You are currently using the <span className="font-medium text-primary">{themes.find(t => t.name === theme)?.label}</span> theme
              </p>
            </div>
            <div className="flex items-center gap-2">
              {theme === 'dark' || theme === 'night' || theme === 'black' || theme === 'dracula' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <span className="text-base-content/70 capitalize">{theme}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;