
import { Appointment, Patient, User } from '../types';

const DB_KEYS = {
  APPOINTMENTS: 'physiosync_appointments',
  PATIENTS: 'physiosync_patients',
  USERS: 'physiosync_users',
};

export const DatabaseService = {
  // Generic save
  save: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Generic fetch
  fetch: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  },

  // Specialized loaders
  loadAppointments: (initial: Appointment[]) => DatabaseService.fetch(DB_KEYS.APPOINTMENTS, initial),
  loadPatients: (initial: Patient[]) => DatabaseService.fetch(DB_KEYS.PATIENTS, initial),
  loadUsers: (initial: User[]) => DatabaseService.fetch(DB_KEYS.USERS, initial),

  // Persistence triggers
  syncAppointments: (data: Appointment[]) => DatabaseService.save(DB_KEYS.APPOINTMENTS, data),
  syncPatients: (data: Patient[]) => DatabaseService.save(DB_KEYS.PATIENTS, data),
  syncUsers: (data: User[]) => DatabaseService.save(DB_KEYS.USERS, data),

  // Clear DB (Emergency/Reset)
  resetDatabase: () => {
    Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }
};
