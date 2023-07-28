"use client";

import { quizCreationSchema } from "@/schemas/form/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BookOpen, CopyCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

type Input = z.infer<typeof quizCreationSchema>;

export default function QuizCreation() {
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
      topic: "",
      type: "mcq",
    },
    resolver: zodResolver(quizCreationSchema),
  });

  const onSubmit = (input: Input) => {
    getQuestions(
      {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      },
      {
        onSuccess: ({ gameId }) => {
          if (form.getValues("type") === "open_ended") {
            router.push(`/play/open-ended/${gameId}`);
          } else {
            router.push(`/play/mcq/${gameId}`);
          }
        },
      }
    );
  };

  form.watch();

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
