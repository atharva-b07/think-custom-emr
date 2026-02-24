'use client';

import { createContext, useContext, useReducer } from 'react';
import { patients as initialPatients } from '@/data/patientsData';
import { appointments as initialAppointments } from '@/data/schedulingData';
import { prescriptions as initialPrescriptions } from '@/data/cpoeData';
import { encounters as initialEncounters, claims as initialClaims } from '@/data/billingData';
import { referrals as initialReferrals } from '@/data/referralData';
import { reports as initialReports } from '@/data/reportsData';

const AppContext = createContext();

const initialState = {
  patients: initialPatients,
  appointments: initialAppointments,
  prescriptions: initialPrescriptions,
  encounters: initialEncounters,
  claims: initialClaims,
  referrals: initialReferrals,
  reports: initialReports,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_PATIENT':
      return { ...state, patients: [action.payload, ...state.patients] };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [action.payload, ...state.appointments] };
    case 'ADD_PRESCRIPTION':
      return { ...state, prescriptions: [action.payload, ...state.prescriptions] };
    case 'ADD_ENCOUNTER':
      return { ...state, encounters: [action.payload, ...state.encounters] };
    case 'ADD_CLAIM':
      return { ...state, claims: [action.payload, ...state.claims] };
    case 'ADD_REFERRAL':
      return { ...state, referrals: [action.payload, ...state.referrals] };
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
