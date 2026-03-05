import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ClipboardList, Timer, CheckCircle2, User } from "lucide-react";
import { Progress } from "@/Components/ui/progress";

type StatsCardsProps = {
  stats: {
    slug: string;
    total: number;
    mine: number;
  }[];
};

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats || stats.length === 0) {
    return null;
  }

  const getStatusDetails = (slug: string) => {
    switch (slug) {
      case "pending":
        return {
          title: "Tugas Tertunda",
          icon: ClipboardList,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
        };
      case "in_progress":
        return {
          title: "Sedang Dikerjakan",
          icon: Timer,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        };
      case "completed":
        return {
          title: "Tugas Selesai",
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        };
      default:
        return {
          title: "Status",
          icon: ClipboardList,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
        };
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((status) => {
        const details = getStatusDetails(status.slug);
        const Icon = details.icon;
        const percentage = status.total > 0 ? (status.mine / status.total) * 100 : 0;

        return (
          <Card key={status.slug} className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className={`mr-3 rounded-lg p-2 ${details.bgColor}`}>
                <Icon className={`h-5 w-5 ${details.color}`} />
              </div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {details.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{status.mine}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  dari {status.total} total tugas
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <User className="h-3 w-3" /> Kontribusi Anda
                  </span>
                  <span className="font-bold">{Math.round(percentage)}%</span>
                </div>
                <Progress value={percentage} className="h-1.5" />
              </div>

              <p className="mt-4 text-[11px] leading-tight text-muted-foreground">
                Menampilkan jumlah tugas yang diberikan kepada Anda dibandingkan dengan seluruh tugas dalam proyek.
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}