"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import D3WordCloud from "react-d3-cloud";

const data = [
  {
    text: "Hi",
    value: 3,
  },
  {
    text: "React",
    value: 10,
  },
  {
    text: "Next.js",
    value: 8,
  },
  {
    text: "live",
    value: 7,
  },
  {
    text: "Angular",
    value: 1,
  },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

export default function WordCloud() {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <D3WordCloud
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "white" : "black"}
        data={data}
      />
    </>
  );
}
