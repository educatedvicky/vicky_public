
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import { DashboardStats, Appointment, UserRole } from '../types';
import { Icons, COLORS } from '../constants';

interface DashboardProps {
  stats: DashboardStats;
  recentAppointments: Appointment[];
  role: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, recentAppointments, role }) => {
  const StatCard = ({ title, value, sub, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-slate-200 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={role === 'doctor' ? "Total Patients" : "Total Bookings"} 
          value={stats.totalAppointments} 
          sub={role === 'doctor' ? "+4 new this week" : "WhatsApp: 45% of inflow"} 
          icon={Icons.Calendar} 
          colorClass={role === 'doctor' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"} 
        />
        <StatCard 
          title={role === 'doctor' ? "Today's Schedule" : "Confirmed Today"} 
          value={stats.confirmedToday} 
          sub={role === 'doctor' ? "Next session in 15m" : "2 slots available before 5PM"} 
          icon={Icons.App} 
          colorClass={role === 'doctor' ? "bg-emerald-50 text-emerald-600" : "bg-cyan-50 text-cyan-600"} 
        />
        <StatCard 
          title={role === 'doctor' ? "Awaiting Review" : "Pending Intake"} 
          value={stats.pendingRequests} 
          sub={role === 'doctor' ? "Check clinical notes" : "Immediate action required"} 
          icon={Icons.Users} 
          colorClass={role === 'doctor' ? "bg-amber-50 text-amber-600" : "bg-orange-50 text-orange-600"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">{role === 'doctor' ? "Caseload Distribution" : "Channel Inflow"}</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Last 30 Days</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.sourceDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#8884d8'} 
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} 
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">{role === 'doctor' ? "Patient Retention" : "Booking Volume"}</h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', count: 12 },
                { name: 'Tue', count: 18 },
                { name: 'Wed', count: 15 },
                { name: 'Thu', count: 22 },
                { name: 'Fri', count: 19 },
                { name: 'Sat', count: 8 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar 
                  dataKey="count" 
                  fill={role === 'doctor' ? "#3b82f6" : "#0891b2"} 
                  radius={[8, 8, 0, 0]} 
                  barSize={32} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">{role === 'doctor' ? "Upcoming Consultations" : "Recent Intake Log"}</h3>
          <button className={`text-sm font-semibold transition-colors ${role === 'doctor' ? 'text-blue-600 hover:text-blue-700' : 'text-cyan-600 hover:text-cyan-700'}`}>
            View Queue
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentAppointments.slice(0, 5).map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${role === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-cyan-100 text-cyan-600'}`}>
                        {apt.patientName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{apt.patientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-slate-500 text-xs font-semibold px-2 py-1 bg-slate-100 rounded-md tracking-tight">
                      {apt.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
                      apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {apt.date} • <span className="text-slate-900 font-bold">{apt.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
