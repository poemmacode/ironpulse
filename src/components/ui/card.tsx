import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-4",
        "dark:border-zinc-700 dark:bg-zinc-900",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardSectionProps) {
  return (
    <div
      className={cn("mb-3 border-b border-zinc-200 pb-3 dark:border-zinc-700", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: CardSectionProps) {
  return (
    <div className={cn("py-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardSectionProps) {
  return (
    <div
      className={cn(
        "mt-3 flex items-center border-t border-zinc-200 pt-3 dark:border-zinc-700",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
