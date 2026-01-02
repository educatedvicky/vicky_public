
export type AppointmentSource = 'whatsapp' | 'sms' | 'app' | 'call';
export type UserRole = 'doctor' | 'staff' | 'patient' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  password?: string; // Added for mock login verification
  patientProfileId?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  medicalHistory: string[];
  lastVisit?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; 
  patientPhone: string;
  date: string;
  time: string;
  reason: string;
  source: AppointmentSource;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalAppointments: number;
  confirmedToday: number;
  pendingRequests: number;
  sourceDistribution: { name: string; value: number }[];
}

export interface ParsedBooking {
  patientName: string;
  date: string;
  time: string;
  reason: string;
  confidence: number;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}
