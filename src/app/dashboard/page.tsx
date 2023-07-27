import HistoryCard from "@/components/dashboard/history-card";
import QuizMeCard from "@/components/dashboard/quiz-me-card";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | Egg Of Wisdom",
};

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7"></div>
    </main>
  );
}
