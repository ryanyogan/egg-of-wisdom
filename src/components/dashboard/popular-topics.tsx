import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function PopularTopics() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Popular Topics</CardTitle>
        <CardDescription>Click on a topic to start a quiz</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">word cloud</CardContent>
    </Card>
  );
}
