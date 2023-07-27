import SignInButton from "@/components/shared/sign-in-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Crack An Egg Of Wisdom 🥚</CardTitle>
          <CardDescription>
            Allow AI to crack n&apos; egg of wisdom on you, create and share
            your quizzes with friends!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton fullWidth text="Sign In with Google" />
        </CardContent>
      </Card>
    </div>
  );
}
