"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { sidebarItems } from "@/constants/nav-items";

const AppSidebar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="size-full w-71 p-8">
      <Logo width={57.5} height={23} />
      <div className="grid grid-cols-1 gap-3 mt-5">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2 py-1.5 px-1 rounded-[0.5rem] paragraph-small text-(--text--sub-600) hover:bg-white/80 transition-colors duration-500",
              isActive(item.href) && "bg-white text-(--text-strong-950)",
            )}
          >
            <Icon
              name={item.icon}
              className={cn(
                isActive(item.href)
                  ? "text-(--primary-green)"
                  : "text-(--icon--sub-600)",
              )}
            />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default AppSidebar;
