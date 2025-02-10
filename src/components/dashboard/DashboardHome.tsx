
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, MousePointerClick, ArrowUpRight, Clock } from "lucide-react";

interface Analytics {
  visits: any[];
  conversions: any[];
  sources: Record<string, number>;
  locations: Record<string, number>;
}

interface LandingPageStats {
  id: string;
  title: string;
  analytics: Analytics;
  last_conversion_at: string | null;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<LandingPageStats[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("landing_pages")
          .select("id, title, analytics, last_conversion_at")
          .eq("profile_id", user.id);

        if (error) throw error;

        // Parse JSONB data from Supabase into the correct type
        const parsedData: LandingPageStats[] = data.map(page => ({
          ...page,
          analytics: page.analytics ? JSON.parse(JSON.stringify(page.analytics)) : {
            visits: [],
            conversions: [],
            sources: {},
            locations: {}
          }
        }));

        setStats(parsedData);

        // Calculate totals
        let visits = 0;
        let conversions = 0;

        parsedData.forEach(page => {
          visits += page.analytics?.visits?.length || 0;
          conversions += page.analytics?.conversions?.length || 0;
        });

        setTotalVisits(visits);
        setTotalConversions(conversions);
        setConversionRate(visits > 0 ? (conversions / visits) * 100 : 0);

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      }
    };

    fetchStats();
  }, [toast]);

  // Prepare data for the chart
  const chartData = stats.map(page => ({
    name: page.title,
    visits: page.analytics?.visits?.length || 0,
    conversions: page.analytics?.conversions?.length || 0,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
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
      </div>

      <Card className="pt-6">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
    </div>
  );
}
