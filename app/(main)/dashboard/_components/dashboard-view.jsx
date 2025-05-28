'use client';
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((item) => ({
    name: item.role,
    min: item.min / 1000,
    max: item.max / 1000,
    median: item.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toUpperCase()) {
      case 'HIGH':
        return 'bg-green-600';
      case 'MEDIUM':
        return 'bg-yellow-400';
      case 'LOW':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toUpperCase()) {
      case 'POSITIVE':
        return {
          icon: TrendingUp,
          color: 'text-green-400',
          text: 'Positive Outlook',
        };
      case 'NEUTRAL':
        return {
          icon: LineChart,
          color: 'text-yellow-400',
          text: 'Neutral Outlook',
        };
      case 'NEGATIVE':
        return {
          icon: TrendingDown,
          color: 'text-red-400',
          text: 'Negative Outlook',
        };
      default:
        return { icon: LineChart, color: 'text-gray-400' };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(insights.marketOutlook);
  const lastUpdateDate = format(new Date(insights.lastUpdated), 'MM/dd/yyyy');
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), {
    addSuffix: true,
  });

  return (
    <div className="space-y-6 p-4 lg:p-8 text-foreground">
      <div className="text-sm">
        <Badge className="bg-background border border-muted text-muted-foreground shadow-sm">
          Last updated: {lastUpdateDate}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-muted/20 border border-muted/30 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Market Outlook
              <OutlookIcon className={`w-5 h-5 ${outlookColor}`} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium capitalize mb-1">{insights.marketOutlook}</div>
            <p className="text-sm text-muted-foreground">Next update {nextUpdateDistance}</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/20 border border-muted/30 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Industry Growth
              <LineChart className="w-5 h-5 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold mb-2">{insights.growthRate.toFixed(1)}%</div>
            <Progress value={insights.growthRate} className="bg-muted/40" />
          </CardContent>
        </Card>

        <Card className="bg-muted/20 border border-muted/30 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Demand Level
              <BriefcaseIcon className="w-5 h-5 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium capitalize">{insights.demandLevel}</div>
            <div className={`w-full h-3 mt-3 rounded-full ${getDemandLevelColor(insights.demandLevel)}`} />
          </CardContent>
        </Card>

        <Card className="bg-muted/20 border border-muted/30 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Top Skills
              <Brain className="w-5 h-5 text-indigo-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} className="capitalize bg-background text-foreground border border-muted-foreground">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/20 border border-muted/30 shadow-lg rounded-2xl hover:shadow-xl transition">
        <CardHeader>
          <CardDescription>
            Displaying minimum, maximum, and median salary ranges for common roles in the industry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-800 text-white border border-zinc-600 rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#3b82f6" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#10b981" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#f59e0b" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-muted/20 border border-muted/30 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-muted/20 border border-muted/30 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} className="bg-background text-foreground border border-muted-foreground">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
