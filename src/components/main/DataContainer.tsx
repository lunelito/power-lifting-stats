import { powerliftingResults } from "@/src/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";

type DataContainerType = {
  data: InferSelectModel<typeof powerliftingResults>[] | [];
};

export default function DataContainer({ data }: DataContainerType) {
  return (
    <div>
      {data.map((powerlifter) => (
        <div key={powerlifter.id}>
          <p>{powerlifter.name}</p>
        </div>
      ))}
    </div>
  );
}
