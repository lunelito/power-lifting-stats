import React, { SetStateAction } from "react";

type SearchContainer = {
  setInputVal: React.Dispatch<SetStateAction<string>>;
};

export default function SearchContainer({
  setInputVal,
}: SearchContainer) {
  return (
    <div className="text-black bg-zinc-200/60 dark:bg-zinc-900/60 dark:text-white  w-[80vw] text-'[clamp(0.55rem,1.2vw,0.75rem)]' overflow-x-hidden backdrop-blur-md m-5 p-5 rounded-lg">
      <input
      onChange={(e) => setInputVal(e.target.value)}
        className="w-full border-none bg-transparent p-2 outline-none focus:ring-2 focus:ring-orange-400 rounded-md"
        placeholder="find your powerlifter..."
      />
    </div>
  );
}
