
import React from 'react';
import { Appointment } from '../types';
import { Icons, COLORS } from '../constants';

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange: (id: string, status: Appointment['status']) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onStatusChange }) => {
  const getSourceIcon = (source: Appointment['source']) => {
    switch (source) {
      case 'whatsapp': return <Icons.WhatsApp />;
      case 'sms': return <Icons.SMS />;
      case 'app': return <Icons.App />;
      default: return <Icons.Users />;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img 
            src={`https://picsum.photos/seed/${appointment.patientName}/48/48`} 
            className="w-12 h-12 rounded-xl object-cover" 
            alt={appointment.patientName} 
          />
          <div>
            <h4 className="font-bold text-slate-800">{appointment.patientName}</h4>
            <p className="text-sm text-slate-500">{appointment.patientPhone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-blue-500 transition-colors">
            {getSourceIcon(appointment.source)}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(appointment.status)} uppercase tracking-wide`}>
            {appointment.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Icons.Calendar />
          <span>{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {appointment.time}</span>
        </div>
        <div className="text-sm bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200 text-slate-600">
          <span className="font-semibold block text-xs text-slate-400 uppercase mb-1">Condition/Reason</span>
          {appointment.reason}
        </div>
      </div>

      <div className="flex gap-2">
        {appointment.status === 'pending' && (
          <>
            <button 
              onClick={() => onStatusChange(appointment.id, 'confirmed')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              Confirm
            </button>
            <button 
              onClick={() => onStatusChange(appointment.id, 'cancelled')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              Decline
            </button>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <button 
            onClick={() => onStatusChange(appointment.id, 'completed')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
