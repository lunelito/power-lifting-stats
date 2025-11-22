import Link from "next/link";
import React from "react";

export default function notFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div
        className="w-[30vw] h-[30vw] bg-orange-400 flex  justify-center items-center text-4xl rounded-full
             animate-[pulseShadow_3s_infinite]"
      >
        <Link href={"/main"} className="text-center">Page Not Found <br/> Go Back</Link>
        <style>
          {`
      @keyframes pulseShadow {
        0%, 100% { box-shadow: 0 0 20px rgba(255,165,0,0.5); }
        50% { box-shadow: 0 0 60px rgba(255,165,0,1); }
      }
    `}
        </style>
      </div>
    </div>
  );
}
