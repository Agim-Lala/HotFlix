import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, User } from "../api/userApi";

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const fetchedUser = await getMe(); // ← call the function
        localStorage.setItem("userInfo", JSON.stringify(fetchedUser));
        setUser(fetchedUser);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
