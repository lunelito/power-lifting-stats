"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import type { InferSelectModel } from "drizzle-orm";
import { profiles } from "@/src/lib/db/schema";

type User = InferSelectModel<typeof profiles>;

interface UserDataContextType {
  userData: User | null;
  error: string | null;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isPending: boolean;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context)
    throw new Error(
      "useUserDataContext must be used within a UserDataProvider"
    );
  return context;
};

interface Props {
  children: ReactNode;
}

export const UserDataProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  });

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("userData");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        localStorage.removeItem("userId");
      }
    }
  }, [userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userData) {
        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        localStorage.removeItem("userData");
      }
    }
  }, [userData]);

  const value: UserDataContextType = useMemo(() => ({
    userData,
    error,
    userId,
    setUserId,
    setUserData,
    setError,
    isPending,
    setIsPending,
    isAdmin: userData?.role === "admin" || false,
  }), [userData, error, userId, isPending]);

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};