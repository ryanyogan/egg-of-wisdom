import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import HistoryList from "./history-list";

export default async function Recent() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  const gameCount = await db.game.count({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Recent Activities</CardTitle>
        <CardDescription>
          You have played a total of {gameCount} games.
        </CardDescription>
      </CardHeader>

      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryList limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  );
}
