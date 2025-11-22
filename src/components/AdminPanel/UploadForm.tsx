"use client"
import React, { useActionState } from "react";
import { UploadData } from "@/src/lib/actions/UploadData";
import FileInput from "../UI/FileInput";

export default function UploadForm() {
  const [formData, action, isPending] = useActionState(UploadData, {
    errors: {},
  });
  const formError = formData.errors._form;

  return (
    <form action={action}>
      {formError}
      <FileInput
        errorMessage={formData.errors?.csvData}
        isInvalid={!!formData.errors?.csvData}
        isPending={isPending}
        text="powerlifting data in csv format"
        name={"csvData"}
        fileType=".csv"
      />

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isPending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
