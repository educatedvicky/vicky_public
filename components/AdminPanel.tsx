
import React from 'react';
import { User } from '../types';

interface AdminPanelProps {
  users: User[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, onApprove, onReject }) => {
  const pendingUsers = users.filter(u => !u.isApproved && u.role !== 'patient');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">User Access Control</h2>
        <p className="text-sm text-slate-500">Manage professional access requests for Doctors and Staff.</p>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="bg-white py-16 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">All clear!</h3>
          <p className="text-slate-500 text-sm">No pending approval requests at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  className="w-12 h-12 rounded-full border-2 border-slate-100" 
                  alt={user.name} 
                />
                <div>
                  <h3 className="font-bold text-slate-800">{user.name}</h3>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <span className="font-bold">Email:</span> {user.email}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(user.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10"
                >
                  Approve Access
                </button>
                <button
                  onClick={() => onReject(user.id)}
                  className="flex-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
