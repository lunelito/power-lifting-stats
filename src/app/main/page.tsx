"use client";
import DataContainer from "@/src/components/main/DataContainer";
import Pagination from "@/src/components/main/Pagination";
import SkeletonLoader from "@/src/components/main/SkeletonLoader";
import useFetch from "@/src/hooks/useFetch";
import { powerliftingResults } from "@/src/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useState } from "react";

export default function MainPage() {
  const [pageIndex, setPageIndex] = useState<number>(1);

  const { data, error, isPending } = useFetch<{
    data: InferSelectModel<typeof powerliftingResults>[];
    count: number;
  }>(`/api/powerlifting-stats?page=${pageIndex}`);

  if (isPending) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      <DataContainer data={data?.data ?? []} />
      <Pagination
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        count={data?.count ?? 0}
      />
    </div>
  );
}
