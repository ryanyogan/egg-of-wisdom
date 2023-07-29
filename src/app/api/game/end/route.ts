import { db } from "@/lib/db";
import { endGameSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gameId } = endGameSchema.parse(body);

    const game = await db.game.findUnique({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      return NextResponse.json(
        {
          message: "Game not found",
        },
        {
          status: 400,
        }
      );
    }

    await db.game.update({
      where: { id: gameId },
      data: { timeEnded: new Date() },
    });
    return NextResponse.json(
      {
        message: "Game Ended",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
