import React, { SetStateAction } from "react";

type Paginationtype = {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  count: number;
};

export default function Pagination({
  pageIndex,
  setPageIndex,
  count,
}: Paginationtype) {
  const totalPages = Math.ceil(count / 100);

  const getVisiblePages = (
    pageIndex: number,
    totalPages: number,
    delta = 5
  ) => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= pageIndex - delta && i <= pageIndex + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages(pageIndex, totalPages);
  return (
    <div className="text-black dark:text-white backdrop-blur-md  bg-zinc-200/60 dark:bg-zinc-900/60 rounded-xl m-5 p-5 text-xl flex gap-5">
      {visiblePages.map((el, idx) =>
        el === "…" ? (
          <span key={idx}>…</span>
        ) : (
          <button
            key={idx}
            onClick={() => setPageIndex(el as number)}
            className={`${
              pageIndex === el
                ? "border-b-2 border-black dark:border-white"
                : ""
            } hover:scale-120 transition-all ease-in-out`}
          >
            {el}
          </button>
        )
      )}
    </div>
  );
}
