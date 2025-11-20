import { z } from "zod";
import Papa from "papaparse";

const UploadDataSchema = z.object({
  csvData: z
    .instanceof(File, { message: "Musisz przesłać plik" })
    .refine(
      (file) => file?.name.toLowerCase().endsWith(".csv"),
      "Plik musi mieć rozszerzenie .csv"
    ),
});

type UploadType = {
  success?: boolean;
  errors: {
    csvData?: string[];
    _form?: string[];
  };
};

const CHUNK_SIZE = 100;

export async function UploadData(
  formState: UploadType,
  FormData: FormData
): Promise<UploadType> {
  const result = UploadDataSchema.safeParse({
    csvData: FormData.get("csvData"),
  });

  if (!result.success) {
    const formatted = result.error.format();
    return { errors: { csvData: formatted.csvData?._errors } };
  }

  try {
    const file = result.data.csvData as File;
    const chunks: Record<string, string>[][] = [];
    let currentChunk: Record<string, string>[] = [];

    await new Promise<void>((resolve, reject) => {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        worker: true,
        step: (results) => {
          currentChunk.push(results.data);

          if (currentChunk.length >= CHUNK_SIZE) {
            chunks.push(currentChunk);
            currentChunk = [];
          }
        },
        complete: () => {
          if (currentChunk.length > 0) {
            chunks.push(currentChunk);
          }
          resolve();
        },
        error: (err) => reject(err),
      });
    });

    for (let i = 0; i < chunks.length; i++) {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: chunks[i], chunkNumber: i }),
      });

      if (!res.ok) {
        const responseData = await res.json();
        return {
          errors: {
            _form: [responseData.error || `Failed to upload chunk ${i}`],
          },
        };
      }
    }

    return {
      success: true,
      errors: { _form: [`Data added successfully in ${chunks.length} chunks`] },
    };
  } catch (err) {
    return {
      errors: {
        _form: [err instanceof Error ? err.message : "Something went wrong..."],
      },
    };
  }
}
