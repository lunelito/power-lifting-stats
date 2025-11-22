import { ReactNode } from "react";

type primaryButtonType = {
  isPending?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export default function PrimaryButton({
  isPending,
  children,
  onClick,
}: primaryButtonType) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      type="submit"
      className={`text-lg font-bold cursor-pointer text-white hover:text-orange-400 hover:bg-transparent bg-orange-400 border-2 pl-16 pr-16 p-2 border-orange-400 rounded-3xl transition ease-in-out active:scale-110 hover:scale-105 ${
        isPending ? "opacity-75" : ""
      }`}
    >
      {isPending ? "Loading..." : children}
    </button>
  );
}
