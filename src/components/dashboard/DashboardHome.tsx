
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, MousePointerClick, ArrowUpRight, Clock, Timer, ArrowDownToLine, Map, Users, Download, LineChart as LineChartIcon } from "lucide-react";
import { addDays, format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Analytics {
  visits: any[];
  conversions: any[];
  sources: Record<string, number>;
  locations: Record<string, number>;
  bounce_rate: number;
  page_time: Record<string, number>;
  goals: {
    visit_goal: number;
    conversion_goal: number;
  };
  daily_stats: Record<string, any>;
  weekly_stats: Record<string, any>;
  monthly_stats: Record<string, any>;
  real_time?: {
    active_visitors: number;
    current_page_views: any[];
  };
  benchmarks?: {
    industry_bounce_rate: number;
    industry_conversion_rate: number;
    industry_avg_time: number;
  };
}

interface LandingPageStats {
  id: string;
  title: string;
  analytics: Analytics;
  last_conversion_at: string | null;
  goals_config: {
    visit_goal: number;
    conversion_goal: number;
    notification_threshold: number;
  };
}

type TimePeriod = 'day' | 'week' | 'month' | 'custom';

export default function DashboardHome() {
  const [stats, setStats] = useState<LandingPageStats[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [averageTimeOnPage, setAverageTimeOnPage] = useState(0);
  const [bounceRate, setBounceRate] = useState(0);
  const [topSources, setTopSources] = useState<{ name: string; value: number }[]>([]);
  const [topLocations, setTopLocations] = useState<{ name: string; value: number }[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [dateRange, setDateRange] = useState({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date())
  });
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [industryBenchmarks, setIndustryBenchmarks] = useState({
    bounceRate: 0,
    conversionRate: 0,
    avgTime: 0
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exportMetrics, setExportMetrics] = useState<string[]>(['all']);
  const { toast } = useToast();

  const updateDateRangeByPeriod = (period: TimePeriod) => {
    const today = new Date();
    switch (period) {
      case 'day':
        setDateRange({
          from: startOfDay(today),
          to: endOfDay(today)
        });
        break;
      case 'week':
        setDateRange({
          from: startOfWeek(today),
          to: endOfWeek(today)
        });
        break;
      case 'month':
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today)
        });
        break;
      // 'custom' period is handled by the DatePickerWithRange component
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("landing_pages")
          .select("id, title, analytics, last_conversion_at, goals_config")
          .eq("profile_id", user.id);

        if (error) throw error;

        const parsedData: LandingPageStats[] = data.map(page => ({
          ...page,
          analytics: typeof page.analytics === 'string' ? JSON.parse(page.analytics) : page.analytics || {
            visits: [],
            conversions: [],
            sources: {},
            locations: {},
            bounce_rate: 0,
            page_time: {},
            goals: {
              visit_goal: 0,
              conversion_goal: 0
            },
            daily_stats: {},
            weekly_stats: {},
            monthly_stats: {}
          },
          goals_config: page.goals_config || {
            visit_goal: 1000,
            conversion_goal: 100,
            notification_threshold: 80
          }
        }));

        setStats(parsedData);

        // Calculate totals and metrics
        let visits = 0;
        let conversions = 0;
        let totalBounceRate = 0;
        let totalTime = 0;
        let allSources: Record<string, number> = {};
        let allLocations: Record<string, number> = {};

        parsedData.forEach(page => {
          const analytics = page.analytics;
          visits += analytics?.visits?.length || 0;
          conversions += analytics?.conversions?.length || 0;
          totalBounceRate += analytics?.bounce_rate || 0;
          
          // Aggregate time on page
          Object.values(analytics?.page_time || {}).forEach(time => {
            totalTime += (time as number) || 0;
          });

          // Aggregate sources
          Object.entries(analytics?.sources || {}).forEach(([source, count]) => {
            allSources[source] = (allSources[source] || 0) + (count as number);
          });

          // Aggregate locations
          Object.entries(analytics?.locations || {}).forEach(([location, count]) => {
            allLocations[location] = (allLocations[location] || 0) + (count as number);
          });
        });

        setTotalVisits(visits);
        setTotalConversions(conversions);
        setConversionRate(visits > 0 ? (conversions / visits) * 100 : 0);
        setBounceRate(parsedData.length > 0 ? totalBounceRate / parsedData.length : 0);
        setAverageTimeOnPage(visits > 0 ? totalTime / visits : 0);

        // Set top sources and locations
        setTopSources(
          Object.entries(allSources)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
        );

        setTopLocations(
          Object.entries(allLocations)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
        );

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      }
    };

    fetchStats();
  }, [toast, selectedPeriod, dateRange]);

  useEffect(() => {
    const channel = supabase
      .channel('real-time-analytics')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'landing_pages',
          filter: `analytics->>'real_time' is not null`
        },
        (payload) => {
          if (payload.new) {
            const analytics = payload.new.analytics as any;
            if (analytics?.real_time?.active_visitors) {
              setActiveVisitors(analytics.real_time.active_visitors);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const exportAnalytics = async () => {
    try {
      const { data: pages } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('profile_id', (await supabase.auth.getUser()).data.user?.id);

      if (!pages) return;

      const exportData = pages.map(page => ({
        title: page.title,
        visits: page.analytics?.visits?.length || 0,
        conversions: page.analytics?.conversions?.length || 0,
        bounceRate: page.analytics?.bounce_rate || 0,
        avgTimeOnPage: Object.values(page.analytics?.page_time || {}).reduce((a: number, b: number) => a + b, 0) / 
          (page.analytics?.visits?.length || 1),
        sources: Object.entries(page.analytics?.sources || {}).map(([source, count]) => `${source}: ${count}`).join(', '),
        locations: Object.entries(page.analytics?.locations || {}).map(([location, count]) => `${location}: ${count}`).join(', ')
      }));

      const content = exportFormat === 'csv' 
        ? convertToCSV(exportData)
        : generatePDFContent(exportData);

      const blob = new Blob([content], { type: exportFormat === 'csv' ? 'text/csv' : 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Analytics data has been exported as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data",
        variant: "destructive",
      });
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  const generatePDFContent = (data: any[]) => {
    // Simplified PDF content generation - in real implementation, 
    // you would use a library like pdfmake or jspdf
    return JSON.stringify(data, null, 2);
  };

  const performanceData = stats.map(page => ({
    name: page.title,
    visits: page.analytics?.visits?.length || 0,
    conversions: page.analytics?.conversions?.length || 0,
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#af19ff'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="flex gap-4">
          <Select value={selectedPeriod} onValueChange={(value: TimePeriod) => {
            setSelectedPeriod(value);
            if (value !== 'custom') {
              updateDateRangeByPeriod(value);
            }
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {selectedPeriod === 'custom' && (
            <DatePickerWithRange
              date={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onDateChange={setDateRange}
            />
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Visits
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <div className="text-xs text-muted-foreground">
              Target: {stats[0]?.goals_config.visit_goal || 1000}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversions
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <div className="text-xs text-muted-foreground">
              Target: {stats[0]?.goals_config.conversion_goal || 100}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Conversion
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {stats.some(page => page.last_conversion_at)
                ? new Date(Math.max(...stats
                    .filter(page => page.last_conversion_at)
                    .map(page => new Date(page.last_conversion_at!).getTime())))
                    .toLocaleDateString()
                : 'No conversions yet'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bounce Rate
            </CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bounceRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Time on Page
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Top Location
            </CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topLocations[0]?.name || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              {topLocations[0]?.value || 0} visits
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Source
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topSources[0]?.name || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              {topSources[0]?.value || 0} visits
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVisitors}</div>
            <p className="text-xs text-muted-foreground">Real-time tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Benchmarks
            </CardTitle>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="pt-6">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8884d8" name="Visits" />
                  <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="pt-6">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => setShowExportModal(true)}>
          <Download className="mr-2 h-4 w-4" />
          Export Analytics
        </Button>
      </div>

      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Analytics Data</DialogTitle>
            <DialogDescription>
              Choose your export format and metrics
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'pdf') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Include Metrics</Label>
              <div className="space-y-2">
                <Checkbox
                  checked={exportMetrics.includes('all')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setExportMetrics(['all']);
                    } else {
                      setExportMetrics([]);
                    }
                  }}
                />
                <span className="ml-2">All Metrics</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button onClick={exportAnalytics}>
                Export
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
