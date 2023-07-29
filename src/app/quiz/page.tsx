import QuizCreation from "@/components/shared/quiz-creation";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Quiz | Egg Of Wisdom",
};

interface QuizPageProps {
  searchParams: {
    topic?: string;
  };
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  return <QuizCreation topic={searchParams.topic ?? ""} />;
}
