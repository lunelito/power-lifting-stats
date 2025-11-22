"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useUserDataContext } from "@/src/context/userContext";
import AdminPage from "@/src/components/AdminPanel/AdminPage";
import ErrorContainer from "@/src/components/UI/ErrorContainer";

export default function AccountPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAdmin, setUserId, setUserData, userData } = useUserDataContext();

  useEffect(() => {
    if (!userData) {
      setTimeout(() => router.replace("login"), 2000);
    } else {
      setIsPending(false);
    }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await supabase.auth.signOut();

    // supabase cant do it lol, i will do it on my onw
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (name.startsWith("sb-")) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });

    setUserId(null);
    setUserData(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");

    router.replace("/main");
  };

  if (isPending) {
    return <ErrorContainer message={"You need to log in to see this page."} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Account Page</h1>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {isLoggingOut ? "Wylogowywanie..." : "Wyloguj się"}
      </button>
      {isMounted && isAdmin && <AdminPage />}
    </div>
  );
}
