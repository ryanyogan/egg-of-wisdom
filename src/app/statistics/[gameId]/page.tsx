import AccuracyCard from "@/components/stats/accuracy-card";
import QuestionList from "@/components/stats/question-list";
import ResultsCard from "@/components/stats/results-card";
import TimeTakenCard from "@/components/stats/time-taken-card";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type IParams = {
  params: {
    gameId: string;
  };
};

export default async function Statistics({ params: { gameId } }: IParams) {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await db.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: true,
    },
  });
  if (!game) {
    return redirect("/");
  }

  let accuracy = 0;
  if (game.gameType === "mcq") {
    const totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / game.questions.length) * 100;
  }
  if (game.gameType === "open_ended") {
    const totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / game.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(game.timeEnded ?? 0)}
            timeStarted={new Date(game.timeStarted ?? 0)}
          />
        </div>
        <QuestionList questions={game.questions} />
      </div>
    </>
  );
}
