import { db } from "@/lib/db";
import { gptRequest } from "@/lib/gpt-request";
import { getAuthSession } from "@/lib/next-auth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }
    const body = await request.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    const game = await db.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });

    const questions = await gptRequest({ amount, topic, type });
    console.log(questions, "QUESTIONS");

    if (type === "mcq") {
      type mapQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };
      const data = questions.map((question: mapQuestion) => {
        let opts = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ].sort(() => Math.random() - 0.5);

        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(opts),
          gameId: game.id,
          questionType: "mcq",
        };
      });

      await db.question.createMany({
        data,
      });
    } else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };

      const data = questions.map((question: openQuestion) => ({
        question: question.question,
        answer: question.answer,
        gameId: game.id,
        questionType: "open_ended",
      }));

      await db.question.createMany({
        data,
      });
    }

    return NextResponse.json({ gameId: game.id });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Something Went Wrong" },
      { status: 500 }
    );
  }
}
