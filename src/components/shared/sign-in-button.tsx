"use client";

import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

type Props = {
  text: string;
  fullWidth?: boolean;
};

export default function SignInButton({ text, fullWidth = false }: Props) {
  return (
    <Button
      className={cn(fullWidth && "w-full")}
      onClick={() => {
        signIn("google").catch(console.error);
      }}
    >
      {text}
    </Button>
  );
}
