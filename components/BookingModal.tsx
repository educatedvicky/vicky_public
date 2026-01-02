
import React, { useState } from 'react';
import { parseUnstructuredMessage } from '../services/geminiService';
import { Appointment, ParsedBooking } from '../types';
import { Icons } from '../constants';

interface BookingModalProps {
  onClose: () => void;
  // Fix: Omit patientId from the appointment object since it's determined in handleAddAppointment in App.tsx
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'patientId'>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose, onAddAppointment }) => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedBooking>({
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    reason: '',
    confidence: 1
  });
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<Appointment['source']>('app');

  const handleParse = async () => {
    if (!inputText) return;
    setIsParsing(true);
    try {
      const result = await parseUnstructuredMessage(inputText);
      setParsedData(result);
      setShowAIPanel(false); // Hide panel once parsed
    } catch (error) {
      alert("AI failed to parse the message. Please enter details manually.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment({
      patientName: parsedData.patientName,
      patientPhone: phone,
      date: parsedData.date,
      time: parsedData.time,
      reason: parsedData.reason,
      source: source,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Appointment Intake</h2>
            <p className="text-xs text-slate-500">Enter session details for the clinical record</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto no-scrollbar">
          {!showAIPanel ? (
            <button 
              onClick={() => setShowAIPanel(true)}
              className="w-full mb-8 py-3 px-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-all group"
            >
              <span className="text-emerald-500 group-hover:scale-110 transition-transform">✨</span>
              Auto-fill from WhatsApp/SMS text
            </button>
          ) : (
            <div className="mb-8 space-y-3 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Paste Raw Message</label>
                <button 
                  onClick={() => setShowAIPanel(false)}
                  className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline"
                >
                  Cancel AI Import
                </button>
              </div>
              <textarea
                className="w-full h-32 p-4 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 outline-none transition-all resize-none text-emerald-700 font-medium placeholder:text-slate-300 text-sm"
                placeholder="Paste the message content here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                onClick={handleParse}
                disabled={isParsing || !inputText}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {isParsing ? 'Processing...' : 'Run AI Extraction'}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Appointment Source</label>
                <div className="grid grid-cols-4 gap-2">
                  {['whatsapp', 'sms', 'app', 'call'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSource(s as any)}
                      className={`py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                        source === s 
                          ? 'bg-slate-900 text-white border-transparent shadow-md' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Patient Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-emerald-700 font-bold"
                  value={parsedData.patientName}
                  onChange={(e) => setParsedData({ ...parsedData, patientName: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 234 567 890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-emerald-700 font-bold"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-emerald-700 font-bold"
                  value={parsedData.date}
                  onChange={(e) => setParsedData({ ...parsedData, date: e.target.value })}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Time</label>
                <input
                  type="time"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-emerald-700 font-bold"
                  value={parsedData.time}
                  onChange={(e) => setParsedData({ ...parsedData, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-widest">Reason / Symptoms</label>
              <textarea
                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 resize-none text-emerald-700 font-medium"
                value={parsedData.reason}
                onChange={(e) => setParsedData({ ...parsedData, reason: e.target.value })}
                placeholder="e.g. Chronic back pain, post-op checkup..."
              />
            </div>

            <div className="flex gap-4 pt-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all border border-slate-100"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                Create Clinical Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
