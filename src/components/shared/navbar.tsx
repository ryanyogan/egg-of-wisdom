import { getAuthSession } from "@/lib/next-auth";
import Link from "next/link";
import SignInButton from "./sign-in-button";
import ThemeToggle from "./theme-toggle";
import UserAccountNav from "./user-account-nav";

export default async function Navbar() {
  const session = await getAuthSession();
  console.log(session?.user);

  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-[80px] border-b border-zinc-300 py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl transition-all font-bold hover:-translate-y-[2px] md:block dark:border-white">
            Egg Of Wisdom
          </p>
        </Link>

        <div className="flex items-center">
          <ThemeToggle />

          <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton text="Sign In" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
