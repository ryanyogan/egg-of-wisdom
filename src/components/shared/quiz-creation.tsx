"use client";

import { quizCreationSchema } from "@/schemas/form/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { BookOpen, CopyCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingQuestions from "../loading-questions";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";

interface QuizCreationProps {
  topic: string;
}

type Input = z.infer<typeof quizCreationSchema>;

export default function QuizCreation({ topic: topicParam }: QuizCreationProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const router = useRouter();
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const res = await axios.post("/api/game", {
        amount,
        topic,
        type,
      });

      return res.data;
    },
  });

  const form = useForm<Input>({
    defaultValues: {
      amount: 3,
      topic: topicParam,
      type: "mcq",
    },
    resolver: zodResolver(quizCreationSchema),
  });

  const onSubmit = (input: Input) => {
    setShowLoader(true);
    getQuestions(
      {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      },
      {
        onError: (error) => {
          setShowLoader(false);
          if (error instanceof AxiosError) {
            if (error.response?.status === 500) {
              toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
              });
            }
          }
        },
        onSuccess: ({ gameId }) => {
          setFinishedLoading(true);
          setTimeout(() => {
            if (form.getValues("type") === "open_ended") {
              router.push(`/play/open-ended/${gameId}`);
            } else {
              router.push(`/play/mcq/${gameId}`);
            }
          }, 2_000);
        },
      }
    );
  };

  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic..." {...field} />
                    </FormControl>
                    <FormDescription>Please provide a topic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an amount..."
                        {...field}
                        type="number"
                        min="1"
                        max="10"
                        onChange={(e) =>
                          form.setValue("amount", parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 w-full">
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                  className="flex justify-start items-center"
                >
                  <CopyCheck className="h-4 w-4 mr-2" />
                  Multiple Choice
                </Button>
                <Separator />
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("type", "open_ended");
                  }}
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                  className="flex justify-start items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Open Ended
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
