"use client";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const loginSchema = z.object({
  email: z.string().min(5).max(100).email(),
  password: z
    .string()
    .min(8)
    .max(64)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
});

type LoginType = {
  success?: boolean;
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function logIn(
  formState: LoginType,
  formData: FormData
): Promise<LoginType> {
  try {

    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const formatted = result.error.format();
      return {
        errors: {
          email: formatted.email?._errors,
          password: formatted.password?._errors,
        },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    console.log(data,error)

    if (error) {
      let message = "Nie udało się zalogować użytkownika";

      if (error.message.includes("Invalid login credentials")) {
        message = "Nieprawidłowy email lub hasło";
      }

      if (error.message.includes("Email not confirmed")) {
        message = "Musisz potwierdzić swój adres email przed zalogowaniem";
      }

      return { errors: { _form: [message] } };
    }

    return { success: true, errors: { _form: ["Zalogowano pomyślnie!"] } };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    }
    return { errors: { _form: ["Something went wrong..."] } };
  }
}
