"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  LineChart,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  Target,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MousePointer,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const analyticsData = {
  overview: {
    totalRevenue: 2340000,
    revenueGrowth: 23.5,
    totalLeads: 4567,
    leadsGrowth: 18.2,
    conversionRate: 12.4,
    conversionGrowth: 5.8,
    customerAcquisition: 189,
    acquisitionGrowth: 31.2,
  },
  traffic: {
    totalVisitors: 45670,
    pageViews: 123450,
    bounceRate: 34.2,
    avgSessionDuration: "3:42",
    topPages: [
      { page: "/pricing", views: 12340, conversion: 8.7 },
      { page: "/features", views: 9876, conversion: 4.2 },
      { page: "/demo", views: 8765, conversion: 15.3 },
      { page: "/contact", views: 6543, conversion: 22.1 },
    ],
  },
  sales: {
    totalDeals: 234,
    wonDeals: 89,
    lostDeals: 23,
    avgDealSize: 25600,
    salesCycle: 32,
    pipeline: [
      { stage: "Prospecting", count: 67, value: 1670000 },
      { stage: "Qualification", count: 45, value: 1125000 },
      { stage: "Proposal", count: 23, value: 575000 },
      { stage: "Negotiation", count: 12, value: 300000 },
      { stage: "Closed Won", count: 89, value: 2278400 },
    ],
  },
  marketing: {
    campaignPerformance: [
      { channel: "Google Ads", spend: 12500, leads: 234, cost: 53.4, roi: 340 },
      { channel: "LinkedIn", spend: 8900, leads: 189, cost: 47.1, roi: 280 },
      { channel: "Email", spend: 2300, leads: 456, cost: 5.0, roi: 890 },
      { channel: "Content", spend: 5600, leads: 123, cost: 45.5, roi: 210 },
    ],
    leadSources: [
      { source: "Organic", count: 1234, percentage: 27.0 },
      { source: "Paid Search", count: 1098, percentage: 24.0 },
      { source: "Social Media", count: 892, percentage: 19.5 },
      { source: "Referrals", count: 645, percentage: 14.1 },
      { source: "Direct", count: 698, percentage: 15.4 },
    ],
  },
  customer: {
    satisfaction: 4.7,
    nps: 67,
    churnRate: 3.2,
    ltv: 89600,
    supportTickets: 234,
    resolutionTime: "4.2 hours",
    segmentation: [
      { segment: "Enterprise", count: 45, revenue: 1870000 },
      { segment: "Mid-Market", count: 123, revenue: 892000 },
      { segment: "SMB", count: 456, revenue: 345000 },
      { segment: "Startup", count: 234, revenue: 123000 },
    ],
  },
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [chartType, setChartType] = useState("chart");
  const [timeRange, setTimeRange] = useState("30d");

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = "number",
  }) => {
    const formatValue = (val) => {
      if (typeof val === "string") return val;

      switch (format) {
        case "currency":
          return `$${(val / 1000000).toFixed(1)}M`;
        case "percentage":
          return `${val}%`;
        default:
          return val.toLocaleString();
      }
    };

    return (
      <Card className="backdrop-blur-sm bg-teal-500/70 dark:bg-sky-800/50 border border-slate-200/50 dark:border-white/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 break-words">
                {title}
              </p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatValue(value)}
              </p>
              {change !== undefined && (
                <div
                  className={`flex items-center text-xs sm:text-sm mt-1 ${
                    change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change > 0 ? (
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  )}
                  {Math.abs(change)}% vs last period
                </div>
              )}
            </div>
            <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  };

  const DataTable = ({ data, columns }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((col, index) => (
              <th
                key={index}
                className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-slate-100 dark:border-slate-800 hover:bg-white/50 dark:hover:bg-slate-700/50"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="py-3 px-4 text-slate-900 dark:text-white"
                >
                  {col.format ? col.format(row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const PipelineChart = () => (
    <div className="space-y-4">
      {analyticsData.sales.pipeline.map((stage, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300">
            {stage.stage}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {stage.count} deals
              </span>
              <span className="text-sm font-medium">
                ${(stage.value / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-sky-700 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(stage.value / 2500000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const LeadSourcesChart = () => (
    <div className="space-y-4">
      {analyticsData.marketing.leadSources.map((source, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-4 h-4 rounded-full bg-gradient-to-r from-blue-${
                (index + 1) * 100
              } to-purple-${(index + 1) * 100}`}
            ></div>
            <span className="font-medium">{source.source}</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{source.count.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {source.percentage}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const CustomerSegmentChart = () => (
    <div className="space-y-4">
      {analyticsData.customer.segmentation.map((segment, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50"
        >
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {segment.segment}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {segment.count} customers
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              ${(segment.revenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Revenue
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Comprehensive analytics with customizable views and data insights
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20 w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20">
                <SelectValue placeholder="View type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chart">Chart View</SelectItem>
                <SelectItem value="table">Table View</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 w-full lg:w-auto lg:col-span-2"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <MetricCard
              title="Total Revenue"
              value={analyticsData.overview.totalRevenue}
              change={analyticsData.overview.revenueGrowth}
              icon={DollarSign}
              format="currency"
            />
            <MetricCard
              title="Total Leads"
              value={analyticsData.overview.totalLeads}
              change={analyticsData.overview.leadsGrowth}
              icon={Users}
            />
            <MetricCard
              title="Conversion Rate"
              value={analyticsData.overview.conversionRate}
              change={analyticsData.overview.conversionGrowth}
              icon={Target}
              format="percentage"
            />
            <MetricCard
              title="New Customers"
              value={analyticsData.overview.customerAcquisition}
              change={analyticsData.overview.acquisitionGrowth}
              icon={CheckCircle}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <LineChart className="w-16 h-16 mr-4" />
                  <div>
                    <div className="font-medium">Revenue Chart</div>
                    <div className="text-sm">Monthly revenue progression</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadSourcesChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <MetricCard
              title="Total Visitors"
              value={analyticsData.traffic.totalVisitors}
              icon={Users}
            />
            <MetricCard
              title="Page Views"
              value={analyticsData.traffic.pageViews}
              icon={Eye}
            />
            <MetricCard
              title="Bounce Rate"
              value={analyticsData.traffic.bounceRate}
              icon={AlertTriangle}
              format="percentage"
            />
            <MetricCard
              title="Avg Session"
              value={analyticsData.traffic.avgSessionDuration}
              icon={Calendar}
            />
          </div>

          <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Top Performing Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartType === "table" || chartType === "both" ? (
                <div className="overflow-x-auto">
                  <DataTable
                    data={analyticsData.traffic.topPages}
                    columns={[
                      { header: "Page", key: "page" },
                      {
                        header: "Views",
                        key: "views",
                        format: (v) => v.toLocaleString(),
                      },
                      {
                        header: "Conversion Rate",
                        key: "conversion",
                        format: (v) => `${v}%`,
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {analyticsData.traffic.topPages.map((page, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-white/50 dark:bg-slate-700/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium break-words">
                          {page.page}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {page.views.toLocaleString()} views
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="self-start sm:self-center"
                      >
                        {page.conversion}% conv
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <MetricCard
              title="Total Deals"
              value={analyticsData.sales.totalDeals}
              icon={BarChart3}
            />
            <MetricCard
              title="Won Deals"
              value={analyticsData.sales.wonDeals}
              icon={CheckCircle}
            />
            <MetricCard
              title="Avg Deal Size"
              value={analyticsData.sales.avgDealSize}
              icon={DollarSign}
              format="currency"
            />
            <MetricCard
              title="Sales Cycle"
              value={`${analyticsData.sales.salesCycle} days`}
              icon={Calendar}
            />
          </div>

          <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <PipelineChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={analyticsData.marketing.campaignPerformance}
                columns={[
                  { header: "Channel", key: "channel" },
                  {
                    header: "Spend",
                    key: "spend",
                    format: (v) => `$${v.toLocaleString()}`,
                  },
                  { header: "Leads", key: "leads" },
                  {
                    header: "Cost per Lead",
                    key: "cost",
                    format: (v) => `$${v}`,
                  },
                  { header: "ROI", key: "roi", format: (v) => `${v}%` },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
            <CardHeader>
              <CardTitle>Lead Sources Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadSourcesChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <MetricCard
              title="Satisfaction Score"
              value={analyticsData.customer.satisfaction}
              icon={CheckCircle}
            />
            <MetricCard
              title="Net Promoter Score"
              value={analyticsData.customer.nps}
              icon={TrendingUp}
            />
            <MetricCard
              title="Churn Rate"
              value={analyticsData.customer.churnRate}
              icon={AlertTriangle}
              format="percentage"
            />
            <MetricCard
              title="Customer LTV"
              value={analyticsData.customer.ltv}
              icon={DollarSign}
              format="currency"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerSegmentChart />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
              <CardHeader>
                <CardTitle>Support Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <span>Support Tickets</span>
                  <span className="font-bold">
                    {analyticsData.customer.supportTickets}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <span>Avg Resolution Time</span>
                  <span className="font-bold">
                    {analyticsData.customer.resolutionTime}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <span>Customer Satisfaction</span>
                  <span className="font-bold">
                    {analyticsData.customer.satisfaction}/5.0
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
