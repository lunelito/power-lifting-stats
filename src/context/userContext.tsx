"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import useFetch from "@/src/hooks/useFetch";
import type { InferSelectModel } from "drizzle-orm";
import { profiles } from "@/src/lib/db/schema";

type User = InferSelectModel<typeof profiles>;

interface UserDataContextType {
  userData: User | null;
  error: string | null;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  setUserData:React.Dispatch<React.SetStateAction<User | null>>;
  isPending: boolean;
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
  const [userId, setUserId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("userId") : null
  );

  const [userData, setUserData] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userData");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const { data, error, isPending } = useFetch<User>(
    userId ? `/api/user/${userId}` : null
  );

  useEffect(() => {
    if (data) {
      setUserData(data);
      localStorage.setItem("userData", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      setUserData(null);
    }
  }, [userId]);

  const value: UserDataContextType = {
    userData: userData,
    error,
    userId,
    setUserId,
    setUserData,
    isPending,
    isAdmin: userData?.role === "admin" || false,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
