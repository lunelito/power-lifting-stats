"use client";

import { supabase } from "@/src/lib/supabase";
import { z } from "zod";

// Zod schema dla avatara
const avatarSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, "Nieprawidłowy plik")
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "Plik nie może być większy niż 2MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Tylko pliki JPG, PNG i WEBP są dozwolone"
    ),
});

type AvatarType = {
  success?: boolean;
  publicUrl?: string;
  errors: {
    _form?: string[];
    file?: string[];
    userId?: string[];
  };
};

// Funkcja uploadu jako server action
export async function UploadAvatar(
  formState: AvatarType,
  formData: FormData
): Promise<AvatarType> {
  const file = formData.get("file");

  const result = avatarSchema.safeParse({ file });

  if (!result.success) {
    const formatted = result.error.format();
    return {
      errors: {
        file: formatted.file?._errors,
      },
    };
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("Nie znaleziono użytkownika");

    const { data: oldAvatarData } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (oldAvatarData?.avatar_url) {
      try {
        const url = oldAvatarData.avatar_url;
        const path = url.split("/avatars/")[1];

        if (path) {
          await supabase.storage.from("avatars").remove([path]);
        }
      } catch (err) {
        console.warn("Nie udało się usunąć starego avatara:", err);
      }
    }

    const fileName = `${userId}_${Date.now()}_${result.data.file.name}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, result.data.file);

    if (uploadError) {
      return {
        errors: {
          _form: [uploadError.message || "Nie udało się przesłać pliku"],
        },
      };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", userId);

    if (profileError) {
      return {
        errors: {
          _form: [
            profileError.message || "Nie udało się zaktualizować profilu",
          ],
        },
      };
    }

    return {
      success: true,
      publicUrl: data.publicUrl,
      errors: {},
    };
  } catch (err: unknown) {
    return {
      errors: {
        _form: [err instanceof Error ? err.message : "Coś poszło nie tak..."],
      },
    };
  }
}
