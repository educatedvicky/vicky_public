
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AppointmentCard from './components/AppointmentCard';
import BookingModal from './components/BookingModal';
import PatientRecords from './components/PatientRecords';
import PatientBooking from './components/PatientBooking';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import { Appointment, DashboardStats, User, Patient } from './types';
import { Icons } from './constants';
import { DatabaseService } from './services/database';

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Liam Johnson',
    phone: '+1 555-0101',
    email: 'liam@example.com',
    medicalHistory: ['Lower Back Pain', 'L5 Dislocation'],
    lastVisit: '2024-05-15',
  },
  {
    id: 'p2',
    name: 'Emma Watson',
    phone: '+1 555-0102',
    email: 'emma@example.com',
    medicalHistory: ['Rotator Cuff', 'Shoulder Instability'],
    lastVisit: '2024-05-12',
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientId: 'p1',
    patientName: 'Liam Johnson',
    patientPhone: '+1 555-0101',
    date: '2024-05-20',
    time: '09:00',
    reason: 'Chronic lower back pain check-up.',
    source: 'app',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize from Local Database
  const [appointments, setAppointments] = useState<Appointment[]>(() => DatabaseService.loadAppointments(INITIAL_APPOINTMENTS));
  const [patients, setPatients] = useState<Patient[]>(() => DatabaseService.loadPatients(INITIAL_PATIENTS));
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => DatabaseService.loadUsers([]));
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persistence Hooks
  useEffect(() => { DatabaseService.syncAppointments(appointments); }, [appointments]);
  useEffect(() => { DatabaseService.syncPatients(patients); }, [patients]);
  useEffect(() => { DatabaseService.syncUsers(registeredUsers); }, [registeredUsers]);

  const stats: DashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      totalAppointments: appointments.length,
      confirmedToday: appointments.filter(a => a.date === today && a.status === 'confirmed').length,
      pendingRequests: appointments.filter(a => a.status === 'pending').length,
      sourceDistribution: [
        { name: 'WhatsApp', value: appointments.filter(a => a.source === 'whatsapp').length },
        { name: 'SMS', value: appointments.filter(a => a.source === 'sms').length },
        { name: 'App', value: appointments.filter(a => a.source === 'app').length },
        { name: 'Call', value: appointments.filter(a => a.source === 'call').length },
      ],
    };
  }, [appointments]);

  const handleRegister = (user: User) => {
    setRegisteredUsers(prev => [...prev, user]);
  };

  const handleApproveUser = (userId: string) => {
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isApproved: true } : null);
    }
  };

  const handleRejectUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAddAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'patientId'>) => {
    let patient = patients.find(p => p.name.toLowerCase() === data.patientName.toLowerCase());
    if (!patient) {
      const newPatient: Patient = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.patientName,
        phone: data.patientPhone,
        email: 'newpatient@example.com',
        medicalHistory: ['Pending Intake'],
      };
      setPatients(prev => [...prev, newPatient]);
      patient = newPatient;
    }

    const newApt: Appointment = {
      ...data,
      patientId: patient.id,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setAppointments([newApt, ...appointments]);
  };

  const handlePatientSelfBook = (date: string, time: string, reason: string) => {
    if (!currentUser) return;
    let patient = patients.find(p => p.id === currentUser.patientProfileId);
    if (!patient) patient = patients[0];
    
    const newApt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date,
      time,
      reason,
      source: 'app',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setAppointments([newApt, ...appointments]);
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const userAppointments = useMemo(() => {
    if (!currentUser || currentUser.role !== 'patient') return [];
    return appointments.filter(a => a.patientId === currentUser.patientProfileId);
  }, [appointments, currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') setActiveTab('admin');
      else if (currentUser.role === 'patient') setActiveTab('booking');
      else setActiveTab('dashboard');
    }
  }, [currentUser?.id, currentUser?.role]);

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} registeredUsers={registeredUsers} onRegister={handleRegister} />;
  }

  if (!currentUser.isApproved && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Awaiting Approval</h1>
          <p className="text-slate-500 mb-8 text-sm">
            Hi {currentUser.name}, your professional account request is pending. Our system administrator needs to approve your access.
          </p>
          <button onClick={() => setCurrentUser(null)} className="text-emerald-600 font-bold text-sm uppercase tracking-widest hover:underline">Sign Out</button>
        </div>
      </div>
    );
  }

  const roleColor = currentUser.role === 'doctor' ? 'bg-blue-600' : currentUser.role === 'staff' ? 'bg-indigo-600' : currentUser.role === 'admin' ? 'bg-slate-900' : 'bg-emerald-600';

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar: Fixed position, width 64 (16rem) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser}
        onLogout={() => { setCurrentUser(null); setActiveTab('dashboard'); }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container: Offset by sidebar width on desktop (lg:ml-64) */}
      <div className="flex-1 flex flex-col h-screen lg:ml-64 transition-all duration-300 relative overflow-y-auto overflow-x-hidden">
        
        {/* Mobile Header: Visible only on <lg */}
        <div className="lg:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${roleColor}`}><Icons.App /></div>
            <span className="font-bold text-slate-900">PhysioSync</span>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' ? 'Practice Overview' 
                  : activeTab === 'booking' ? 'Book a Session' 
                  : activeTab === 'appointments' ? 'Appointment Manager'
                  : activeTab === 'patients' ? 'Patient Registry'
                  : activeTab === 'admin' ? 'Administration'
                  : 'My Activity'}
              </h1>
              <p className="text-slate-500 font-medium text-sm md:text-base">
                {currentUser.role === 'admin' ? 'System administrator dashboard for user approvals.' :
                 currentUser.role === 'doctor' ? `Dr. ${currentUser.name.split(' ').pop()}, ${stats.pendingRequests} items for review.` :
                 currentUser.role === 'staff' ? `Active Shift: ${currentUser.name}. Managing ${stats.totalAppointments} records.` :
                 `Hello ${currentUser.name}, let's manage your recovery path.`}
              </p>
            </div>
            {(currentUser.role === 'doctor' || currentUser.role === 'staff') && (
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className={`${roleColor} text-white font-bold py-3 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95`}
              >
                <span className="text-lg">+</span>
                New Intake
              </button>
            )}
          </header>

          <div className="pb-10">
            {activeTab === 'dashboard' && currentUser.role !== 'patient' && currentUser.role !== 'admin' && (
              <Dashboard stats={stats} recentAppointments={appointments} role={currentUser.role} />
            )}
            {activeTab === 'admin' && currentUser.role === 'admin' && (
              <AdminPanel users={registeredUsers} onApprove={handleApproveUser} onReject={handleRejectUser} />
            )}
            {activeTab === 'booking' && currentUser.role === 'patient' && (
              <PatientBooking existingAppointments={appointments} onBook={handlePatientSelfBook} patient={patients.find(p => p.id === currentUser.patientProfileId) || patients[0]} />
            )}
            {(activeTab === 'appointments' || (activeTab === 'dashboard' && currentUser.role === 'admin')) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                {(currentUser.role === 'patient' ? userAppointments : appointments).length > 0 ? (
                  (currentUser.role === 'patient' ? userAppointments : appointments).map(apt => (
                    <AppointmentCard key={apt.id} appointment={apt} onStatusChange={handleStatusChange} />
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4"><Icons.Calendar /></div>
                    <h3 className="text-lg font-bold text-slate-800">No sessions found</h3>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'patients' && currentUser.role !== 'patient' && (
              <PatientRecords patients={patients} />
            )}
          </div>
        </main>
      </div>

      {isBookingModalOpen && <BookingModal onClose={() => setIsBookingModalOpen(false)} onAddAppointment={handleAddAppointment} />}
    </div>
  );
};

export default App;
