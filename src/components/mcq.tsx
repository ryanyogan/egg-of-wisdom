"use client";

import { cn, formatTimeDelta } from "@/lib/utils";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { Game, Question } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import McqCounter from "./mcq-counter";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";

interface MCQProps {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
}

export default function MCQ({ game }: MCQProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const { toast } = useToast();

  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      };
      const res = await axios.post("/api/game/check", payload);
      return res.data;
    },
  });

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [game.questions, questionIndex]);

  const options = useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) {
      return [];
    }

    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: "Correct",
            description: "Correct Answer",
            variant: "success",
          });
          setCorrectAnswers((count) => count + 1);
        } else {
          toast({
            title: "Incorrect",
            description: "Incorrect Answer",
            variant: "destructive",
          });
          setIncorrectAnswers((count) => count + 1);
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }

        setQuestionIndex((index) => index + 1);
      },
    });
  }, [checkAnswer, toast, isChecking, questionIndex, game.questions]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (Number(event.key) < 5) {
        setSelectedChoice(Number(event.key) - 1);
      }

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
          className={cn(buttonVariants(), "mt-2")}
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

        <McqCounter
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
        />
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
        {options.map((option, idx) => (
          <Button
            onClick={() => setSelectedChoice(idx)}
            variant={selectedChoice === idx ? "default" : "secondary"}
            className="justify-start w-full py-8 mb-4"
            key={idx}
          >
            <div className="flex items-center justify-start">
              <div className="p-2 px-3 mr-5 border rounded-md">{idx + 1}</div>
              <div className="text-start">{option}</div>
            </div>
          </Button>
        ))}

        <Button disabled={isChecking} onClick={handleNext} className="mt-2">
          {isChecking && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
