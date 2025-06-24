import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";


interface AuthContextType {
  isDoctorLoggedIn: boolean;
  setIsDoctorLoggedIn: (val: boolean) => void;
}


const AuthContext = createContext<AuthContextType>({
  isDoctorLoggedIn: false,
  setIsDoctorLoggedIn: () => {}, 
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);

  useEffect(() => {
    setIsDoctorLoggedIn(!!Cookies.get("accessToken")); 
  }, []);

  return (
    <AuthContext.Provider value={{ isDoctorLoggedIn, setIsDoctorLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
