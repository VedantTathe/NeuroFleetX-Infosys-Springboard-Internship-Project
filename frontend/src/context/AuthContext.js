import { createContext, useState } from "react";
import { save, load } from "../utils/storage";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(load("user", null));

  const login = (email, password) => {
    const users = load("users", []);

    const found = users.find(
      u => u.email === email && u.password === password
    );

    if (!found) return false;

    const session = {
      ...found,
      token: Date.now() + 1000 * 60 * 60 * 24
    };

    save("user", session);
    setUser(session);
    return true;
  };

  const register = (payload) => {
    const users = load("users", []);
    users.push(payload);
    save("users", users);
  };

  const logout = () => {
    save("user", null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
