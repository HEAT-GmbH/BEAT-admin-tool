"use client";

import { IconName } from "@/models/icons";
import { Button } from "./ui/button";
import { Icon } from "./icon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Badge } from "./ui/badge";
import { ProfilePic } from "./profile-pic";
import { useAuth } from "@/contexts/auth.context";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/constants/nav-items";

const extra: { id: string; icon: IconName; href: string }[] = [
  { id: "help", icon: "question-line", href: "#" },
  { id: "notification", icon: "bell-simple", href: "#" },
  { id: "setting", icon: "settings-5-line", href: "#" },
];

export const Header = ({
  startContent,
}: {
  startContent?: React.ReactNode;
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const item = sidebarItems.find((item) => pathname.startsWith(item.href));

  return (
    <header className="w-full py-5 px-8 flex items-center gap-2">
      <div className="flex-1">
        {startContent ? (
          startContent
        ) : (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="flex items-center">
                  <Icon name="home-smile-2-line" color="var(--icon--sub-600)" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              {item ? (
                <>
                  <BreadcrumbSeparator className="text-(--icon--diasbled-300)" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                      <span className="flex items-center gap-1.5 text-foreground label-small">
                        <Icon
                          name={item.breadcrumbIcon || item.icon}
                          color="var(--icon--strong-950)"
                        />
                        {item.label}
                      </span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              ) : null}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="flex items-center gap-3.5">
        {extra.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="size-8 p-0 grid place-items-center shrink-0"
          >
            <Icon name={item.icon} size={24} />
          </Button>
        ))}
        <Badge className="px-2 py-1.5 h-8.75 bg-background">
          <ProfilePic />
          <span className="text-foreground">
            {user?.firstName + " " + user?.lastName.charAt(0)}
          </span>
          <Icon name="caret-down" size={13} color="var(--icon--strong-950)" />
        </Badge>
      </div>
    </header>
  );
};
