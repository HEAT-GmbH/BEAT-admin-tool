"use client";

import { useAuth } from "@/contexts/auth.context";
import { initials } from "@/lib/helpers";
import Image from "next/image";

export const ProfilePic = () => {
  const { user, isLoading } = useAuth();

  return (
    <div className="relative size-6 rounded-full overflow-hidden bg-primary grid grid-cols-1 place-items-center shrink-0">
      {isLoading ? (
        "..."
      ) : user ? (
        user.image ? (
          <Image
            src={user.image}
            alt={user.firstName}
            fill
            className="object-cover"
          />
        ) : (
          <>{`${initials(user.firstName, user.middleName, user.lastName)}`}</>
        )
      ) : null}
    </div>
  );
};
