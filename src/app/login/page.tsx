"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserDataContext } from "@/src/context/userContext";
import ErrorContainer from "@/src/components/UI/ErrorContainer";
import { logIn } from "@/src/lib/actions/logIn";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/src/animations/FadeAnimation";
import Input from "@/src/components/UI/Input";
import PrimaryButton from "@/src/components/UI/PrimaryButton";
import { User } from "@supabase/supabase-js";
import useFetch from "@/src/hooks/useFetch";
import { profiles } from "@/src/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

type AppUser = InferSelectModel<typeof profiles>;

type FieldType = {
  type: "password" | "text" | "number" | "file";
  text: string;
  name: string;
  isInvalid: boolean;
  errorMessage: string[];
};

export default function LoginPage() {
  const router = useRouter();
  const [isPending2, setIsPending2] = useState(true);
  const [formState, action, isPending] = useActionState(logIn, { errors: {} });
  const { userData, setUserId, setUserData, setError, setIsPending: setUserPending } =
    useUserDataContext();

  const { data, error, isPending: userPending } = useFetch<AppUser>(
    formState.success && formState.userId
      ? `/api/user/${formState.userId}`
      : null
  );

  useEffect(() => {
    if (formState.success && formState.userId) {
      setUserId(formState.userId);
    }
  }, [formState.success, formState.userId,setUserId]);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data,setUserData]);

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error,setError]);

  useEffect(() => {
    setUserPending(userPending);
  }, [userPending,setUserPending]);

  useEffect(() => {
    if (userData) {
      const timer = setTimeout(() => router.replace("/account"), 2000);
      return () => clearTimeout(timer);
    }
  }, [userData, router]);

  useEffect(() => {
    if (userData) {
      const timer = setTimeout(() => router.replace("/account"), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsPending2(false);
    }
  }, [userData, router]);

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

  if (isPending2)
    return <ErrorContainer message={"You are already logged in."} />;

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        action={action}
        className="text-black bg-zinc-200/60 dark:bg-zinc-900/60 dark:text-white backdrop-blur-sm flex flex-col justify-center  items-center gap-10 p-8 sm:p-10  rounded-xl w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[30vw] max-w-[450px]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3 ">
          <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-center sm:text-left">
            Login
          </h1>
          <AnimatePresence mode="wait">
            {formError && (
              <FadeAnimation
                animationKey={`errorMessage-${formError?.[0] || "unknown"}`}
              >
                <p className=" text-sm sm:text-base text-center sm:text-right text-orange-400">
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
        <PrimaryButton isPending={isPending}>Log In</PrimaryButton>
      </form>
    </div>
  );
}
