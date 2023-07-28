import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface McqCounterProps {
  correctAnswers: number;
  incorrectAnswers: number;
}

export default function McqCounter({
  correctAnswers,
  incorrectAnswers,
}: McqCounterProps) {
  return (
    <Card className="flex flex-row items-center justify-center p-2">
      <CheckCircle2 color="green" size={30} />
      <span className="mx-3 text-2xl text-[green]">{correctAnswers}</span>
      <Separator orientation="vertical" />
      <span className="mx-3 text-2xl text-[red]">{incorrectAnswers}</span>
      <XCircle color="red" size={30} />
    </Card>
  );
}
