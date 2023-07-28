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
          error: "You must be logged in to create a quiz.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    const questions = await gptRequest({ amount, topic, type });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      );
    }
  }
}
