import { create } from 'zustand';

export const useHealthStore = create((set) => ({
  patient: null,
  reports: [],
  reminders: [],
  emergencyAccess: null,
  loading: false,
  error: null,

  // Patient actions
  setPatient: (patient) => set({ patient }),
  updatePatient: (updates) => set((state) => ({
    patient: { ...state.patient, ...updates }
  })),

  // Reports actions
  setReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({
    reports: [report, ...state.reports]
  })),
  removeReport: (reportId) => set((state) => ({
    reports: state.reports.filter(r => r.id !== reportId)
  })),

  // Reminders actions
  setReminders: (reminders) => set({ reminders }),
  addReminder: (reminder) => set((state) => ({
    reminders: [reminder, ...state.reminders]
  })),
  removeReminder: (reminderId) => set((state) => ({
    reminders: state.reminders.filter(r => r.id !== reminderId)
  })),

  // Emergency access
  setEmergencyAccess: (access) => set({ emergencyAccess: access }),

  // Loading and error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Clear all
  clearAll: () => set({
    patient: null,
    reports: [],
    reminders: [],
    emergencyAccess: null,
    error: null
  })
}));

export const useUIStore = create((set) => ({
  showModal: false,
  activeTab: 'health',
  sidebarOpen: true,
  theme: 'light',

  setShowModal: (show) => set({ showModal: show }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}));
