import { Percent, Target } from "lucide-react";
import { Card } from "../ui/card";

interface Props {
  percentage: number;
}

export default function OpenEndedPercentage({ percentage }: Props) {
  return (
    <Card className="flex items-center p-2">
      <Target size={30} />
      <span className="ml-3 text-2xl opacity-75">{percentage}</span>
      <Percent size={25} />
    </Card>
  );
}
