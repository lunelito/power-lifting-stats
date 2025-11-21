import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/main");
  return <div>future landing page</div>;
}
