"use client";

import { sidebarItems } from "@/constants/nav-items";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "./icon";

export const DashboardWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const item = sidebarItems.find((item) => pathname.startsWith(item.href));
  return (
    <div className="flex-1 flex items-stretch w-full">
      {!!item?.innerSidebar?.length && (
        <section className="flex-1 max-w-61.5 border-r border-border py-3.75 px-3.25 flex flex-col gap-2.75">
          {item.innerSidebar.map((innerItem) => (
            <Link
              key={innerItem.href}
              href={innerItem.href}
              className={cn(
                "flex items-center gap-2 rounded-[0.5rem] py-1.5 px-1 transition-[background-color] duration-400 text-sm",
                pathname === innerItem.href
                  ? "bg-muted font-semibold text-foreground"
                  : "bg-transparent hover:bg-muted text-(--text--sub-600)",
              )}
            >
              <Icon name={innerItem.icon} size={20} />
              {innerItem.label}
            </Link>
          ))}
        </section>
      )}
      <div
        className={cn(
          "p-8 flex-1",
          item?.innerSidebar?.length && "pl-4",
          item?.noPadding && "p-0",
        )}
      >
        {children}
      </div>
    </div>
  );
};
