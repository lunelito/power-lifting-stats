"use client";
import Link from "next/link";
import useTheme from "../hooks/useTheme";

export default function NavBar() {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="z-10">
      <div className="w-full flex justify-center dark:bg-black bg-zinc-100">
        <div className="flex justify-between items-center w-full max-w-4xl m-2 text-dark dark:text-white p-4 rounded-xl">
          <div className="font-bold text-2xl">
            <p>Powerlifting Stats</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="hover:scale-110 p-2 transition ease-in-out"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="hover:scale-110 p-2 transition ease-in-out"
            >
              Log In
            </Link>
            <button
              onClick={toggleTheme}
              className="hover:scale-110 p-2 transition ease-in-out"
            >
              Switch to {theme === "dark" ? "light" : "dark"} mode{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="relative w-full h-16 bg-gradient-to-b from-zinc-100 dark:from-black to-transparent pointer-events-none z-0" />
    </div>
  );
}
