import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Stat } from "../../types/dashboard";

type StatCardProps = {
  stat: Stat;
  index: number;
};

function StatCard({ stat, index }: StatCardProps) {
  return (
    <div
      className="animate-slide-up rounded-xl border border-border bg-card p-4 transition hover:shadow-lg"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <stat.icon className="h-5 w-5 text-primary" />
        </div>

        <div
          className={`flex items-center gap-1 text-sm ${
            stat.trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {stat.trend === "up" ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {stat.change}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm text-muted-foreground">{stat.title}</p>
        <p className="text-2xl font-bold">{stat.value}</p>
      </div>
    </div>
  );
}

export default StatCard;
