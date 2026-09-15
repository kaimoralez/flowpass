import { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('flowpass_teacher_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const saveSession = (teacherName, room) => {
    const newSession = { teacherName, room };
    setSession(newSession);
    localStorage.setItem('flowpass_teacher_session', JSON.stringify(newSession));
  };

  const clearSession = () => {
    setSession(null);
    localStorage.removeItem('flowpass_teacher_session');
  };

  return (
    <SessionContext.Provider value={{ session, saveSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
