"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useUserDataContext } from "@/src/context/userContext";
import AdminPage from "@/src/components/AdminPanel/AdminPage";
import ErrorContainer from "@/src/components/UI/ErrorContainer";
import Avatar from "@/src/components/UI/Avatar";

export default function AccountPage() {
  const router = useRouter();
  const [isPendingWeb, setIsPending] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAdmin, setUserId, setUserData, userData, isPending } =
    useUserDataContext();

  useEffect(() => {
    if (!userData) {
      setTimeout(() => router.replace("login"), 2000);
    } else {
      setIsPending(false);
    }
  },[]);

  console.log(userData);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await supabase.auth.signOut();

    // // supabase cant do it lol, i will do it on my onw
    // document.cookie.split(";").forEach((c) => {
    //   const name = c.split("=")[0].trim();
    //   if (name.startsWith("sb-")) {
    //     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    //   }
    // });

    setUserId(null);
    setUserData(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");

    router.replace("/main");
  };

  if (isPendingWeb || !userData) {
    return <ErrorContainer message={"You need to log in to see this page."} />;
  }

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="text-black bg-zinc-200/60 dark:bg-zinc-900/60 dark:text-white  w-[80vw] text-'[clamp(0.55rem,1.2vw,0.75rem)]' overflow-x-hidden backdrop-blur-md m-5 p-5 rounded-lg h-fit">
        <h1 className="text-xl font-bold mb-4">Your Account</h1>
        {userData && <Avatar img={userData.avatar_url} userId={userData?.id} />}

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-orange-400 text-white px-4 py-2 rounded hover:scale-110 transition ease-in-out disabled:opacity-50"
        >
          {isLoggingOut ? "Wylogowywanie..." : "Wyloguj się"}
        </button>
        {/* {isMounted && isAdmin && <AdminPage />} */}
      </div>
    </div>
  );
}
