"use client"

import React from "react";

type ErrorContainerType = {
  message: string;
};

export default function ErrorContainer({ message }: ErrorContainerType) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="bg-zinc-200/60 text-orange-400 dark:bg-zinc-900/60 backdrop-blur-sm flex flex-col justify-center  items-center gap-10 p-8 sm:p-10  rounded-xl w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] xl:w-[30vw] max-w-[450px]">
        {message}
      </div>
    </div>
  );
}
