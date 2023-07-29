import { db } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { compareTwoStrings } from "string-similarity";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAnswer, questionId } = checkAnswerSchema.parse(body);

    const question = await db.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return NextResponse.json(
        {
          error: "Question not found",
        },
        {
          status: 400,
        }
      );
    }

    await db.question.update({
      where: { id: questionId },
      data: {
        userAnswer,
      },
    });

    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();

      await db.question.update({
        where: { id: questionId },
        data: {
          isCorrect,
        },
      });

      return NextResponse.json({ isCorrect }, { status: 200 });
    }

    if (question.questionType === "open_ended") {
      let percentageSimilar = compareTwoStrings(
        userAnswer.toLowerCase().trim(),
        question.answer.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);

      await db.question.update({
        where: {
          id: questionId,
        },
        data: {
          percentageCorrect: percentageSimilar,
        },
      });

      return NextResponse.json(
        {
          percentageSimilar,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
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
  }
  return NextResponse.json({ message: "ok" });
}
