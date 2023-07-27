import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Recent() {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Recent Activities</CardTitle>
        <CardDescription>You have played a total of 7 games.</CardDescription>
      </CardHeader>

      <CardContent className="max-h-[580px] overflow-scroll">
        History
      </CardContent>
    </Card>
  );
}
