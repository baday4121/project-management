import { Link } from "@inertiajs/react";
import { Project } from "@/types/project";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { PieChart, Pie, Label as RechartsLabel, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart";
import { ChartPie, CheckCircle2, Trophy, Target } from "lucide-react";

// Konfigurasi warna yang lebih modern
const chartConfig = {
  count: { label: "Proyek" },
  completed: { label: "Selesai", color: "hsl(var(--chart-2))" },
  in_progress: { label: "Berjalan", color: "hsl(var(--chart-1))" },
  pending: { label: "Tertunda", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

interface ProjectStatsProps {
  projects: Project[];
}

export default function ProjectStats({ projects }: ProjectStatsProps) {
  const prepareChartData = (projects: Project[]) => {
    const statusCounts = {
      completed: projects.filter((p) => p.status === "completed").length,
      in_progress: projects.filter((p) => p.status === "in_progress").length,
      pending: projects.filter((p) => p.status === "pending").length,
    };

    return [
      { status: "completed", count: statusCounts.completed, fill: "var(--color-completed)" },
      { status: "in_progress", count: statusCounts.in_progress, fill: "var(--color-in_progress)" },
      { status: "pending", count: statusCounts.pending, fill: "var(--color-pending)" },
    ];
  };

  const completedCount = projects.filter((p) => p.status === "completed").length;
  const totalProjects = projects.length;
  const completionRate = totalProjects > 0 ? ((completedCount / totalProjects) * 100).toFixed(0) : 0;

  return (
    <div className={`grid flex-1 gap-8 ${completedCount > 0 ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
      {totalProjects > 0 && (
        <Card className="flex flex-col border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-0 sm:items-center border-b border-primary/5 bg-muted/20 py-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <ChartPie className="h-5 w-5 text-primary" />
              <span>Ringkasan Status Proyek</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0 pt-6">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[280px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <ChartLegend content={<ChartLegendContent className="mt-4" />} />
                <Pie
                  data={prepareChartData(projects)}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={75}
                  outerRadius={100}
                  strokeWidth={5}
                  paddingAngle={5}
                >
                  <RechartsLabel
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-black"
                            >
                              {completionRate}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-xs font-bold uppercase tracking-wider"
                            >
                              Selesai
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t border-primary/5 bg-muted/10 p-6">
            <div className="grid w-full grid-cols-2 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-black text-primary">{totalProjects}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Proyek</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-green-500">{completedCount}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Berhasil Selesai</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}

      {completedCount > 0 && (
        <Card className="flex flex-col border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-primary/5 bg-muted/20 py-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>Wall of Fame</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 font-medium">
              <Target className="h-4 w-4" />
              Hebat! Kamu telah menyelesaikan {completedCount} proyek sejauh ini.
            </div>
            <ul className="space-y-3">
              {projects
                .filter((project) => project.status === "completed")
                .slice(0, 5)
                .map((project) => (
                  <li
                    key={project.id}
                    className="group flex items-center gap-3 rounded-xl border border-transparent bg-muted/30 p-3 transition-all hover:border-green-500/30 hover:bg-green-500/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <Link
                      href={route("project.show", project.id)}
                      className="flex-1 font-semibold text-foreground/80 decoration-green-500/30 transition-all group-hover:text-green-600"
                      title={project.name}
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter className="border-t border-primary/5 bg-muted/10 p-4 text-center justify-center">
             <p className="text-xs font-medium text-muted-foreground italic">
                “Produktivitas adalah hasil dari komitmen terhadap keunggulan.”
             </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}