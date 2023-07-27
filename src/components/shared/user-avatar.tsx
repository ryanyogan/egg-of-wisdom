import { User } from "next-auth";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";

type Props = {
  user: Pick<User, "name" | "image">;
};

export default function UserAvatar({ user }: Props) {
  return (
    <Avatar>
      {user.image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            src={user.image}
            alt="user image"
            fill
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
}
