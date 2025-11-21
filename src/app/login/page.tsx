"use client";

import { useActionState } from "react";
import { logIn } from "@/src/lib/actions/logIn";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/src/animations/FadeAnimation";
import Input from "@/src/components/UI/Input";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

type FieldType = {
  type: "password" | "text" | "number" | "file";
  text: string;
  name: string;
  isInvalid: boolean;
  errorMessage: string[];
};

export default function LoginPage() {
  const router = useRouter();
  const [formState, action, isPending] = useActionState(logIn, { errors: {} });
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.access_token) {
        setAccessToken(sessionData.session.access_token);
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    if (accessToken || formState.success) {
      router.push("/admin");
    }
  }, [accessToken, formState.success, router]);

  const fields: FieldType[] = [
    {
      type: "text",
      name: "email",
      text: "Email",
      isInvalid: !!formState.errors.email,
      errorMessage: formState.errors.email ?? [],
    },
    {
      type: "password",
      name: "password",
      text: "Password",
      isInvalid: !!formState.errors.password,
      errorMessage: formState.errors.password ?? [],
    },
  ];

  const formError = formState.errors._form;

  return (
    <div className="text-white flex justify-center items-center h-screen w-screen">
      <form
        action={action}
        className="flex flex-col justify-center items-center gap-10 p-8 sm:p-10 bg-zinc-800 rounded-xl shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] transition-shadow ease-in-out duration-300 w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[30vw] max-w-[450px]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3 ">
          <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-center sm:text-left">
            Admin Panel
          </h1>
          <AnimatePresence mode="wait">
            {formError && (
              <FadeAnimation
                animationKey={`errorMessage-${formError?.[0] || "unknown"}`}
              >
                <p className=" text-sm sm:text-base text-center sm:text-right">
                  {formError?.[0]}
                </p>
              </FadeAnimation>
            )}
          </AnimatePresence>
        </div>
        <div className="w-full flex flex-col gap-5">
          {fields.map((el, i) => (
            <Input
              isPending={isPending}
              key={i}
              type={el.type}
              name={el.name}
              isInvalid={el.isInvalid}
              errorMessage={el.errorMessage}
              text={el.text}
            />
          ))}
        </div>
        <button
          disabled={isPending}
          type="submit"
          className={`text-lg font-bold cursor-pointer hover:text-red-600 active:text-red-600 transition ease-in-out active:scale-110 hover:scale-105 ${
            isPending ? "opacity-75" : ""
          }`}
        >
          {isPending ? "Loading..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
