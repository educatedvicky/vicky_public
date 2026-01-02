
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
  registeredUsers: User[];
  onRegister: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, registeredUsers, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // Registration Logic
      const existing = registeredUsers.find(u => u.email === email);
      if (existing) {
        setError('User already exists with this email.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        password, // Store password in mock state
        isApproved: role === 'patient', // Patients approved by default, others need admin
        patientProfileId: role === 'patient' ? `p-${Date.now()}` : undefined,
      };
      onRegister(newUser);
      onLogin(newUser);
    } else {
      // Login Logic
      // 1. Check for Admin
      if (email === 'admin' && password === 'admin123') {
        onLogin({
          id: 'admin-id',
          email: 'admin',
          name: 'System Admin',
          role: 'admin',
          isApproved: true
        });
        return;
      }

      // 2. Check for normal users with password verification
      const user = registeredUsers.find(u => u.email === email);
      if (user) {
        if (user.password === password) {
          onLogin(user);
        } else {
          setError('Incorrect password.');
        }
      } else {
        setError('User not found.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-600/20">
            <Icons.App />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">PhysioSync Pro</h1>
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'Create your professional account' : 'Sign in to your dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none focus:border-emerald-500 transition-all text-sm text-emerald-700 font-medium"
                placeholder="Dr. Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">
              {isRegistering ? 'Email Address' : 'Email or Username'}
            </label>
            <input
              type={isRegistering ? "email" : "text"}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none focus:border-emerald-500 transition-all text-sm text-emerald-700 font-medium"
              placeholder={isRegistering ? "name@email.com" : "admin / email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none focus:border-emerald-500 transition-all text-sm text-emerald-700 font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none focus:border-emerald-500 transition-all text-sm text-emerald-700 font-medium"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'patient', label: 'Patient', color: 'bg-emerald-600' },
                    { id: 'staff', label: 'Staff', color: 'bg-indigo-600' },
                    { id: 'doctor', label: 'Doctor', color: 'bg-blue-600' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as UserRole)}
                      className={`py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-tighter transition-all border ${
                        role === r.id ? `${r.color} text-white border-transparent shadow-md` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 mt-2 italic px-1">
                  {role === 'patient' ? 'Instant access granted.' : 'Requires admin approval after registration.'}
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
          >
            {isRegistering ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <button
            onClick={() => { 
              setIsRegistering(!isRegistering); 
              setError(''); 
              setPassword(''); 
              setConfirmPassword('');
            }}
            className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest"
          >
            {isRegistering ? 'Already have an account? Sign In' : "New user? Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
