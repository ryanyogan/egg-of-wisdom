"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

type Props = {
  text: string;
};

export default function SignInButton({ text }: Props) {
  return (
    <Button
      onClick={() => {
        signIn("google").catch(console.error);
      }}
    >
      {text}
    </Button>
  );
}
