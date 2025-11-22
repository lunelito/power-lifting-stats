"use client";
import { ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { UserDataProvider } from "../context/userContext";
import ThemeProvider from "../providers/ThemeProviders";

interface Props {
  children: ReactNode;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const Providers = ({ children }: Props) => {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <UserDataProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </UserDataProvider>
    </SessionContextProvider>
  );
};
