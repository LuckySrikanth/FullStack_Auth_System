import { createContext, useState, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

export interface UserPayload {
  id: number;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: UserPayload | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("accessToken");

  const [user, setUser] = useState<UserPayload | null>(
    token ? jwtDecode<UserPayload>(token) : null
  );

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setUser(jwtDecode<UserPayload>(token));
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
