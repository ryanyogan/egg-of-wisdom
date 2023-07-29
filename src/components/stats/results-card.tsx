import { Award, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ResultsCardProps {
  accuracy: number;
}

export default function ResultsCard({ accuracy }: ResultsCardProps) {
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-3/5">
        {accuracy > 75 ? (
          <>
            <div className="flex flex-col items-center font-semibold text-yellow-400">
              <Trophy stroke="gold" size={50} />
              <span>Impressive!</span>
              <span className="text-xs text-center text-gray-400">
                {"Greater than 75% accuracy"}
              </span>
            </div>
          </>
        ) : accuracy > 25 ? (
          <>
            <div className="flex flex-col items-center font-2xl font-semibold text-stone-400">
              <Trophy className="mr-4" stroke="silver" size={50} />
              <span>Good Job!</span>
              <span className="text-xs text-center text-gray-400">
                {"Greater than 25% accuracy"}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col text-2xl items-center font-semibold text-yellow-800">
              <Trophy className="mr-4" stroke="brown" size={50} />
              <span className="">Nice try!</span>
              <span className="text-xs text-center text-gray-400">
                {"Less than 25% accuracy"}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
