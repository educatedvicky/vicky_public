
import React, { useState, useMemo } from 'react';
import { Appointment, TimeSlot, Patient } from '../types';
import { Icons } from '../constants';

interface PatientBookingProps {
  existingAppointments: Appointment[];
  onBook: (date: string, time: string, reason: string) => void;
  patient: Patient;
}

const WORKING_HOURS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

const PatientBooking: React.FC<PatientBookingProps> = ({ existingAppointments, onBook, patient }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);

  const availability: TimeSlot[] = useMemo(() => {
    return WORKING_HOURS.map(time => {
      const isTaken = existingAppointments.some(
        apt => apt.date === selectedDate && apt.time === time && apt.status !== 'cancelled'
      );
      return { time, isAvailable: !isTaken };
    });
  }, [selectedDate, existingAppointments]);

  const handleBooking = () => {
    if (selectedTime && reason) {
      onBook(selectedDate, selectedTime, reason);
      setStep(3); // Success state
    }
  };

  if (step === 3) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Requested!</h2>
        <p className="text-slate-500 mb-8">Dr. Miller will review your request shortly. You'll receive a notification once confirmed.</p>
        <button 
          onClick={() => { setStep(1); setReason(''); setSelectedTime(null); }}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold"
        >
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Select a Date</h3>
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500 font-bold text-emerald-700"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availability.map(slot => (
              <button
                key={slot.time}
                disabled={!slot.isAvailable}
                onClick={() => setSelectedTime(slot.time)}
                className={`p-4 rounded-2xl border transition-all text-center ${
                  !slot.isAvailable 
                    ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                    : selectedTime === slot.time
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <p className="text-sm font-bold">{slot.time}</p>
                <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${slot.isAvailable ? (selectedTime === slot.time ? 'text-emerald-100' : 'text-emerald-500') : 'text-slate-300'}`}>
                  {slot.isAvailable ? 'Available' : 'Booked'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {selectedTime && (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Reason for Visit</h3>
            <textarea
              placeholder="Tell us about your symptoms or goal for this session..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-emerald-500 resize-none text-emerald-700 font-medium"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleBooking}
                disabled={!reason}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
              >
                Confirm Request
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-600/20">
          <h4 className="font-bold mb-2">Clinical Note</h4>
          <p className="text-xs text-emerald-50 opacity-90 leading-relaxed">
            Please book at least 24 hours in advance. For emergency sessions, please use the WhatsApp contact directly.
          </p>
          <div className="mt-4 flex items-center gap-3 bg-emerald-700/50 p-3 rounded-xl">
             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
               <Icons.WhatsApp />
             </div>
             <span className="text-xs font-bold">Fast-track via WhatsApp</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-4">Selected Summary</h4>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Date</span>
              <span className="font-bold text-slate-700">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Time</span>
              <span className="font-bold text-slate-700">{selectedTime || '--:--'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Patient</span>
              <span className="font-bold text-slate-700">{patient.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBooking;
