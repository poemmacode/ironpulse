"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Dumbbell, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
] as const;

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
        className,
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="flex items-stretch">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[48px] flex-col items-center justify-center gap-0.5 px-2 py-2",
                  "text-xs font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn("h-6 w-6", isActive && "stroke-[2.5px]")}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
