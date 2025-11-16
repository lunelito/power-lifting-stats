"use client";

import UploadForm from "@/src/components/AdminPanel/UploadForm";
import { supabase } from "@/src/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session) {
        window.location.href = "/login";
      } else {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-4">AdminPage</h1>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {isLoggingOut ? "Wylogowywanie..." : "Wyloguj się"}
      </button>
      <UploadForm/>
    </div>
  );
}
