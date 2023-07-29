import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import WordCloud from "../word-cloud/word-cloud";

export default async function PopularTopics() {
  const topics = await db.topic.findMany({});

  const formattedTopics = topics.map((topic) => ({
    text: topic.topic,
    value: topic.count,
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Popular Topics</CardTitle>
        <CardDescription>Click on a topic to start a quiz</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <WordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
}
