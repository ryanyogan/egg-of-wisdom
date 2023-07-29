import OpenEnded from "@/components/open-ended-game/open-ended-game";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type IParams = {
  params: {
    gameId: string;
  };
};

export default async function OpenEndedGame({ params: { gameId } }: IParams) {
  const game = await db.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true,
        },
      },
    },
  });

  if (!game || game.gameType !== "open_ended") {
    return redirect("/quiz");
  }

  return <OpenEnded game={game} />;
}
