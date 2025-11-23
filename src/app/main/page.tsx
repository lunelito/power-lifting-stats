"use client";
import DataContainer from "@/src/components/main/DataContainer";
import Pagination from "@/src/components/main/Pagination";
import SearchContainer from "@/src/components/main/SearchContainer";
import SkeletonLoader from "@/src/components/main/SkeletonLoader";
import useFetch from "@/src/hooks/useFetch";
import { powerliftingResults } from "@/src/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React, { useEffect, useState } from "react";

export default function MainPage() {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [inputVal, setInputVal] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState(inputVal);
  const [shouldFetchByVal, setShouldFetchByVal] = useState(false);

  console.log(inputVal);
  const [data, setData] = useState<{
    data: InferSelectModel<typeof powerliftingResults>[];
    count: number;
  }>();

  const shouldFetch = shouldFetchByVal || pageIndex > 0;
  const {
    data: fetchData,
    error,
    isPending,
  } = useFetch<{
    data: InferSelectModel<typeof powerliftingResults>[];
    count: number;
  }>(
    shouldFetch
      ? shouldFetchByVal
        ? `/api/powerlifting-stats/${debouncedQuery}`
        : `/api/powerlifting-stats?page=${pageIndex}`
      : null
  );

  useEffect(() => {
    if (fetchData) {
      setData(fetchData);
    }
  }, [fetchData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputVal);
      setShouldFetchByVal(inputVal.length > 0);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputVal]);

  return (
    <div className="flex justify-center flex-col items-center overflow-x-auto">
      <SearchContainer setInputVal={setInputVal} />
      {isPending ? (
        <SkeletonLoader />
      ) : (
        <>
          <DataContainer data={data?.data ?? []} />
          <Pagination
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            count={data?.count ?? 0}
          />
        </>
      )}
    </div>
  );
}
