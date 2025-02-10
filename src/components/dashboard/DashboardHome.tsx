
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { addDays, format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { type DateRange } from "react-day-picker";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import ExportModal from "./ExportModal";

interface GoalsConfig {
  visit_goal: number;
  conversion_goal: number;
  notification_threshold: number;
}

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
  goals_config: GoalsConfig;
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
  const [dateRange, setDateRange] = useState<DateRange>({
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
          goals_config: typeof page.goals_config === 'string' 
            ? JSON.parse(page.goals_config) 
            : page.goals_config || {
                visit_goal: 1000,
                conversion_goal: 100,
                notification_threshold: 80
              }
        }));

        setStats(parsedData);

        let visits = 0;
        let conversions = 0;
        let totalBounceRate = 0;
        let totalTime = 0;
        let allSources: Record<string, number> = {};
        let allLocations: Record<string, number> = {};

        parsedData.forEach(page => {
          const analytics = page.analytics;
          visits += analytics.visits?.length || 0;
          conversions += analytics.conversions?.length || 0;
          totalBounceRate += analytics.bounce_rate || 0;
          
          Object.values(analytics.page_time || {}).forEach(time => {
            totalTime += Number(time) || 0;
          });

          Object.entries(analytics.sources || {}).forEach(([source, count]) => {
            allSources[source] = (allSources[source] || 0) + Number(count);
          });

          Object.entries(analytics.locations || {}).forEach(([location, count]) => {
            allLocations[location] = (allLocations[location] || 0) + Number(count);
          });
        });

        setTotalVisits(visits);
        setTotalConversions(conversions);
        setConversionRate(visits > 0 ? (conversions / visits) * 100 : 0);
        setBounceRate(parsedData.length > 0 ? totalBounceRate / parsedData.length : 0);
        setAverageTimeOnPage(visits > 0 ? totalTime / visits : 0);

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
            const analytics = typeof payload.new.analytics === 'string' 
              ? JSON.parse(payload.new.analytics) 
              : payload.new.analytics;
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

  const performanceData = stats.map(page => ({
    name: page.title,
    visits: page.analytics?.visits?.length || 0,
    conversions: page.analytics?.conversions?.length || 0,
  }));

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
    return JSON.stringify(data, null, 2);
  };

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

      <DashboardStats
        totalVisits={totalVisits}
        totalConversions={totalConversions}
        conversionRate={conversionRate}
        bounceRate={bounceRate}
        averageTimeOnPage={averageTimeOnPage}
        activeVisitors={activeVisitors}
        lastConversionAt={stats.find(page => page.last_conversion_at)?.last_conversion_at || null}
        topLocations={topLocations}
        topSources={topSources}
        visitGoal={stats[0]?.goals_config.visit_goal || 1000}
        conversionGoal={stats[0]?.goals_config.conversion_goal || 100}
        industryBenchmarks={industryBenchmarks}
      />

      <DashboardCharts
        performanceData={performanceData}
        topSources={topSources}
      />

      <div className="mt-6 flex justify-end">
        <Button onClick={() => setShowExportModal(true)}>
          <Download className="mr-2 h-4 w-4" />
          Export Analytics
        </Button>
      </div>

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        exportFormat={exportFormat}
        onExportFormatChange={(format) => setExportFormat(format)}
        exportMetrics={exportMetrics}
        onExportMetricsChange={setExportMetrics}
        onExport={exportAnalytics}
      />
    </div>
  );
}
