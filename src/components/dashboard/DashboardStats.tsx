
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, MousePointerClick, ArrowUpRight, Clock, Timer, ArrowDownToLine, Map, Users, LineChart } from "lucide-react";

interface DashboardStatsProps {
  totalVisits: number;
  totalConversions: number;
  conversionRate: number;
  bounceRate: number;
  averageTimeOnPage: number;
  activeVisitors: number;
  lastConversionAt: string | null;
  topLocations: { name: string; value: number }[];
  topSources: { name: string; value: number }[];
  visitGoal: number;
  conversionGoal: number;
  industryBenchmarks: {
    bounceRate: number;
    conversionRate: number;
    avgTime: number;
  };
}

export default function DashboardStats({
  totalVisits,
  totalConversions,
  conversionRate,
  bounceRate,
  averageTimeOnPage,
  activeVisitors,
  lastConversionAt,
  topLocations,
  topSources,
  visitGoal,
  conversionGoal,
  industryBenchmarks,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisits}</div>
          <div className="text-xs text-muted-foreground">Target: {visitGoal}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalConversions}</div>
          <div className="text-xs text-muted-foreground">Target: {conversionGoal}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Conversion</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {lastConversionAt ? new Date(lastConversionAt).toLocaleDateString() : 'No conversions yet'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bounceRate.toFixed(1)}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(averageTimeOnPage / 60)}m {Math.floor(averageTimeOnPage % 60)}s
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Location</CardTitle>
          <Map className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topLocations[0]?.name || 'N/A'}</div>
          <div className="text-xs text-muted-foreground">{topLocations[0]?.value || 0} visits</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Source</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topSources[0]?.name || 'N/A'}</div>
          <div className="text-xs text-muted-foreground">{topSources[0]?.value || 0} visits</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeVisitors}</div>
          <p className="text-xs text-muted-foreground">Real-time tracking</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Industry Benchmarks</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Bounce Rate: </span>
              <span className="font-medium">{industryBenchmarks.bounceRate}%</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Conversion Rate: </span>
              <span className="font-medium">{industryBenchmarks.conversionRate}%</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Avg Time: </span>
              <span className="font-medium">{Math.floor(industryBenchmarks.avgTime / 60)}m</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
