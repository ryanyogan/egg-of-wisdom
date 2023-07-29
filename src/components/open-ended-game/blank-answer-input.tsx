"use client";
import extractor from "keyword-extractor";
import { useMemo } from "react";

interface BlankAnswerInputProps {
  answer: string;
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
}

const BLANKS = "_____";

export default function BlankAnswerInput({
  answer,
  setBlankAnswer,
}: BlankAnswerInputProps) {
  const keywords = useMemo(() => {
    const words = extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    return words.sort(() => Math.random() - 0.6).slice(0, 2);
  }, [answer]);

  const answeredWithBlanks = useMemo(() => {
    const awb = keywords.reduce((acc, keyword) => {
      return acc.replace(keyword, BLANKS);
    }, answer);
    setBlankAnswer(awb);
    return awb;
  }, [keywords, answer, setBlankAnswer]);

  return (
    <div className="flex justify-start w-full mt-4">
      <h1 className="text-xl font-semibold">
        {answeredWithBlanks.split(BLANKS).map((part, index) => {
          return (
            <>
              {part}
              {index === answeredWithBlanks.split(BLANKS).length - 1 ? null : (
                <input
                  id="user-blank-input"
                  className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
                ></input>
              )}
            </>
          );
        })}
      </h1>
    </div>
  );
}
