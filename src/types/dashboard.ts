import { LucideIcon } from "lucide-react";

export type Stat = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
};
