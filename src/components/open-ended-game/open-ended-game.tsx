"use client";

import { cn, formatTimeDelta } from "@/lib/utils";
import { checkAnswerSchema, endGameSchema } from "@/schemas/form/quiz";
import { Game, Question } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";
import BlankAnswerInput from "./blank-answer-input";
import OpenEndedPercentage from "./open-ended-percentage";

type OpenEndedGameProps = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

export default function OpenEnded({ game }: OpenEndedGameProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [blankAnswer, setBlankAnswer] = useState("");
  const [averagePercentage, setAveragePercentage] = useState(0);
  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const [hasEnded, setHasEnded] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const { toast } = useToast();

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };

      const res = await axios.post("/api/game/end", payload);
      return res.data;
    },
  });

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll("#user-blank-input").forEach((input) => {
        // @ts-ignore
        filledAnswer = filledAnswer.replace("_____", input.value);
        // @ts-ignore
        input.value = "";
      });

      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };
      console.log(filledAnswer);
      const res = await axios.post("/api/game/check", payload);
      return res.data;
    },
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer.`,
          description:
            "answers are matched based on similarity comparaparability",
          variant: "success",
        });

        setAveragePercentage((percent) => {
          return (percent + percentageSimilar) / (questionIndex + 1);
        });

        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }

        setQuestionIndex((index) => index + 1);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  }, [
    checkAnswer,
    toast,
    isChecking,
    endGame,
    questionIndex,
    game.questions.length,
  ]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleNext]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [hasEnded]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
          href={`/statistics/${game.id}`}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 sm:mt-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400 mr-2">Topic</span>
            <span className="px-2 py-1 text-white bg-slate-800 rounded-lg">
              {game.topic}
            </span>
          </p>

          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            <span className="mt-[2px]">
              {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
            </span>
          </div>
        </div>

        <OpenEndedPercentage percentage={averagePercentage} />
      </div>

      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-800/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4">
        <BlankAnswerInput
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
        />
        <Button
          variant="outline"
          disabled={isChecking}
          onClick={handleNext}
          className="mt-4"
        >
          {isChecking && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
