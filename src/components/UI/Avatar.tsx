"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { UploadAvatar } from "@/src/lib/actions/UploadAvatar";

type AvatarProps = { img: string | null; userId: string };

export default function Avatar({ img, userId }: AvatarProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(img);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await UploadAvatar({ errors: {} }, formData);

    if (result.success && result.publicUrl) {
      setAvatar(result.publicUrl);
      setFormError(null);
    } else {
      setFormError(result.errors?._form?.[0] ?? "Kurwa, coś się zjebało");
    }
  };

  return (
    <div>
      <div
        className="relative w-16 h-16 rounded-full bg-zinc-600 cursor-pointer overflow-hidden hover:opacity-80 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
      >
        {avatar && (
          <Image src={avatar} alt="avatar" fill className="object-cover" />
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
    </div>
  );
}
