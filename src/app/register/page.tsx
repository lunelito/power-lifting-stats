"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserDataContext } from "@/src/context/userContext";
import ErrorContainer from "@/src/components/UI/ErrorContainer";
import { register } from "@/src/lib/actions/Register";
import { AnimatePresence } from "framer-motion";
import FadeAnimation from "@/src/animations/FadeAnimation";
import Input from "@/src/components/UI/Input";
import PrimaryButton from "@/src/components/UI/PrimaryButton";

type FieldType = {
  type: "password" | "text" | "number" | "file";
  text: string;
  name: string;
  isInvalid: boolean;
  errorMessage: string[];
};

export default function LoginPage() {
  const { userData } = useUserDataContext();
  const router = useRouter();
  const [isPending2, setIsPending] = useState(true);
  const [formState, action, isPending] = useActionState(register, {
    errors: {},
  });

  useEffect(() => {
    if (userData) {
      setTimeout(() => router.replace("account"), 2000);
    } else {
      setIsPending(false);
    }
  }, []);

  const fields: FieldType[] = [
    {
      type: "text",
      name: "firstName",
      text: "First Name",
      isInvalid: !!formState.errors.firstName,
      errorMessage: formState.errors.firstName ?? [],
    },
    {
      type: "text",
      name: "lastName",
      text: "Last Name",
      isInvalid: !!formState.errors.lastName,
      errorMessage: formState.errors.lastName ?? [],
    },
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
    {
      type: "password",
      name: "repeatPassword",
      text: "Repeat Password",
      isInvalid: !!formState.errors.repeatPassword,
      errorMessage: formState.errors.repeatPassword ?? [],
    },
  ];

  const formError = formState.errors._form;

  if (isPending2)
    return <ErrorContainer message={"First log out to create new account."} />;

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        action={action}
        className="text-black bg-zinc-200/60 dark:bg-zinc-900/60 dark:text-white backdrop-blur-sm flex flex-col justify-center  items-center gap-10 p-8 sm:p-10  rounded-xl w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[30vw] max-w-[450px]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3 ">
          <h1 className="text-[clamp(1rem,6vw,2rem)] font-bold text-center sm:text-left">
            Create Account
          </h1>
          <AnimatePresence mode="wait">
            {formError && (
              <FadeAnimation
                animationKey={`errorMessage-${formError?.[0] || "unknown"}`}
              >
                <p className="text-orange-400 text-sm sm:text-base text-center sm:text-right">
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
        <PrimaryButton isPending={isPending}>Sign Up</PrimaryButton>
      </form>
    </div>
  );
}
