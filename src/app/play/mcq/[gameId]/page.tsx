import MCQ from "@/components/mcq";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";

type IParams = {
  params: {
    gameId: string;
  };
};

export default async function MCQGame({ params: { gameId } }: IParams) {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await db.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!game || game.gameType !== "mcq") {
    return redirect("/quiz");
  }

  return <MCQ game={game} />;
}
