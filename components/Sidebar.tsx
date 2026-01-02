
import React from 'react';
import { Icons } from '../constants';
import { UserRole, User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout, isOpen, onClose }) => {
  const getMenuItems = () => {
    if (user.role === 'admin') {
      return [
        { id: 'admin', label: 'User Controls', icon: Icons.Users },
        { id: 'appointments', label: 'All Sessions', icon: Icons.Calendar },
      ];
    }
    if (user.role === 'patient') {
      return [
        { id: 'booking', label: 'Book Session', icon: Icons.Calendar },
        { id: 'appointments', label: 'My Bookings', icon: Icons.Dashboard },
      ];
    }
    return [
      { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
      { id: 'appointments', label: 'Appointments', icon: Icons.Calendar },
      { id: 'patients', label: 'Patients', icon: Icons.Users },
    ];
  };

  const menuItems = getMenuItems();

  const sidebarClasses = `
    w-64 h-full fixed left-0 top-0 text-white p-6 shadow-2xl z-40 transition-transform duration-300 ease-in-out
    ${user.role === 'doctor' ? 'bg-slate-900' : user.role === 'staff' ? 'bg-indigo-950' : user.role === 'admin' ? 'bg-slate-950' : 'bg-emerald-950'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Overlay: Higher index than header but lower than sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${user.role === 'doctor' ? 'bg-blue-500' : user.role === 'staff' ? 'bg-indigo-500' : user.role === 'admin' ? 'bg-slate-700' : 'bg-emerald-500'}`}>
              <Icons.App />
            </div>
            <h1 className="text-xl font-bold tracking-tight">PhysioSync<span className={user.role === 'doctor' ? 'text-blue-400' : user.role === 'staff' ? 'text-indigo-400' : user.role === 'admin' ? 'text-slate-400' : 'text-emerald-400'}>Pro</span></h1>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? (user.role === 'doctor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : user.role === 'staff' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : user.role === 'admin' ? 'bg-slate-800 text-white shadow-lg shadow-slate-700/30' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30')
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
             <span className="text-[9px] uppercase font-bold tracking-tighter text-emerald-400/80">Local Database Connected</span>
          </div>

          <div className={`p-4 rounded-2xl border transition-colors ${user.role === 'doctor' ? 'bg-slate-800 border-slate-700' : user.role === 'staff' ? 'bg-indigo-900 border-indigo-800' : user.role === 'admin' ? 'bg-slate-900 border-slate-800' : 'bg-emerald-900 border-emerald-800'}`}>
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                className={`w-10 h-10 rounded-full border-2 ${user.role === 'doctor' ? 'border-blue-500' : user.role === 'staff' ? 'border-indigo-500' : user.role === 'admin' ? 'border-slate-500' : 'border-emerald-500'}`} 
                alt="Profile" 
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2 text-[10px] font-bold text-slate-400 uppercase hover:text-rose-400 transition-colors flex items-center justify-center gap-2 tracking-widest"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
