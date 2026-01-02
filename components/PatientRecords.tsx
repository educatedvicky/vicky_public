
import React from 'react';
import { Patient } from '../types';
import { Icons } from '../constants';

interface PatientRecordsProps {
  patients: Patient[];
}

const PatientRecords: React.FC<PatientRecordsProps> = ({ patients }) => {
  const handleExport = () => {
    // CSV Headers
    const headers = ['Name', 'Email', 'Phone', 'Last Visit', 'Medical History'];
    
    // Process rows
    const rows = patients.map(p => [
      p.name,
      p.email,
      p.phone,
      p.lastVisit || 'N/A',
      p.medicalHistory.join('; ')
    ]);

    // Construct CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PhysioSync_Patients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Clinical Patient Registry</h2>
          <p className="text-xs text-slate-400 mt-1">Manage and export your clinic's patient database</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button 
            onClick={handleExport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </button>

          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 outline-none focus:border-emerald-500 text-emerald-700 font-medium text-sm"
            />
            <div className="absolute left-3 top-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(patient => (
          <div key={patient.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                <p className="text-xs text-slate-400">{patient.email}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Icons.App />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Icons.Calendar />
                <span>Last session: {patient.lastVisit || 'N/A'}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">History Highlights</p>
              <div className="flex flex-wrap gap-1">
                {patient.medicalHistory.map((tag, i) => (
                  <span key={i} className="bg-white border border-slate-200 text-[10px] px-2 py-0.5 rounded-full text-slate-600 font-medium capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors">
              Open Full Clinical Record
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientRecords;
