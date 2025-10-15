import { healthcare } from "googleapis/build/src/apis/healthcare";
import {
  BarChart3,
  Calendar,
  Cog,
  Database,
  DollarSign,
  FileText,
  Home,
  Megaphone,
  SquareUser,
  UserRoundCog,
  Users,
  Wrench,
} from "lucide-react";

export const analyticsData = {
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
    healthcare: "HealthCare - 40",
    churnRate: 3.2,
    ltv: 260,
    supportTickets: 234,
    resolutionTime: "4.2 hours",
    
    pipeline: [
      { stage: "Prospecting", count: 67, value: 1670000 },
      { stage: "Qualification", count: 45, value: 1125000 },
      { stage: "Proposal", count: 23, value: 575000 },
      { stage: "Negotiation", count: 12, value: 300000 },
      { stage: "Closed Won", count: 89, value: 2278400 },
    ],
  },
};

export const mockMeetings = [
  {
    id: 1,
    title: "Product Demo - TechFlow Inc",
    attendees: ["Sarah Johnson", "Michael Chen"],
    type: "demo",
    platform: "Zoom",
    date: "2024-12-20",
    time: "10:00 AM",
    duration: "45 min",
    status: "scheduled",
    description: "Product demonstration for TechFlow Inc procurement team",
    location: "Virtual",
    priority: "high",
  },
  {
    id: 2,
    title: "Follow-up Call - DataDrive Solutions",
    attendees: ["Emily Rodriguez"],
    type: "call",
    platform: "Phone",
    date: "2024-12-20",
    time: "2:30 PM",
    duration: "30 min",
    status: "scheduled",
    description: "Discuss pricing and implementation timeline",
    location: "Phone Call",
    priority: "medium",
  },
  {
    id: 3,
    title: "Proposal Presentation - GrowthCorp",
    attendees: ["David Kim", "Lisa Thompson", "James Wilson"],
    type: "presentation",
    platform: "Google Meet",
    date: "2024-12-20",
    time: "4:00 PM",
    duration: "60 min",
    status: "scheduled",
    description: "Final proposal presentation to executive team",
    location: "Virtual",
    priority: "high",
  },
  {
    id: 4,
    title: "Discovery Call - InnovateLab",
    attendees: ["Alex Morgan"],
    type: "discovery",
    platform: "Teams",
    date: "2024-12-21",
    time: "9:00 AM",
    duration: "30 min",
    status: "scheduled",
    description: "Initial discovery call to understand requirements",
    location: "Virtual",
    priority: "medium",
  },
  {
    id: 5,
    title: "Contract Review - ScaleUp Ventures",
    attendees: ["Rachel Green", "Tom Anderson"],
    type: "review",
    platform: "In-person",
    date: "2024-12-21",
    time: "11:00 AM",
    duration: "90 min",
    status: "confirmed",
    description: "Final contract review and signing",
    location: "ScaleUp Ventures Office, Chicago",
    priority: "high",
  },
  {
    id: 6,
    title: "Customer Success Check-in - Enterprise Co",
    attendees: ["Samantha Davis"],
    type: "checkin",
    platform: "Zoom",
    date: "2024-12-22",
    time: "3:00 PM",
    duration: "30 min",
    status: "scheduled",
    description: "Quarterly business review and feature feedback",
    location: "Virtual",
    priority: "low",
  },
  {
    id: 7,
    title: "Sales Training Session",
    attendees: ["Sales Team"],
    type: "training",
    platform: "Conference Room",
    date: "2024-12-23",
    time: "10:00 AM",
    duration: "120 min",
    status: "scheduled",
    description: "Monthly sales training on new features and methodologies",
    location: "Conference Room A",
    priority: "medium",
  },
];

export const summaryStats = {
  customers: { total: 1247, new: 89, growth: 12 },
  leads: { total: 2456, qualified: 567, growth: 18 },
  deals: { total: 189, won: 67, growth: 15, value: 2340000 },
};

export const customerStatus = ["Active", "Inactive", "At Risk"];

export const leadStatus = [
  "New",
  "In progress",
  "Contact Attempted",
  "Contacted",
  "Meeting Booked",
  "Qualified",
  "Unqualified",
];

export const dealStatus = [
  "New",
  "Proposal Sent",
  "Negotiation",
  "Closed-won",
  "Closed-lost",
  "On-hold",
  "Abandoned",
];

export const leadSources = [
  "Advertisement",
  "Chat",
  "Email",
  "Employee referral",
  "External referral",
  "Cold call",
  "Organic",
];

export const monthFilters = [
  "All time",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const navigation = [
  { key: "home", name: "Home", href: "/home", icon: <Home /> },
  { key: "prospects", name: "Prospects", href: "/prospects", icon: <Users /> },
  // { name: "Engagement", href: "/engagement", icon: MessageSquare },
  { key: "crm", name: "CRM", href: "/crm", icon: <Database /> },
  // { key: "pricing", name: "Pricing", href: "/pricing", icon: <Send /> },
  {
    key: "campaigns",
    name: "Campaigns",
    href: "/campaigns",
    icon: <Megaphone />,
  },
  // { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: <BarChart3 /> },
  // {
  //   key: "configureproducts",
  //   name: "Configure Products",
  //   href: "/revenueengine/configureproducts",
  //   icon: <Wrench />,
  // },
  {
    name: "HRMS",
    href: "/hrms",
    icon: <SquareUser />,
    subpages: [
      {
        name: "Calendar",
        href: "/hrms/Calendar",
        icon: <Calendar />,
      },
      { name: "Employee", href: "/hrms/Employee", icon: <UserRoundCog /> },
      { name: "Payroll", href: "/hrms/Payroll", icon: <UserRoundCog /> },
    ],
  },
  {
    key: "revenueengine",
    name: "Revenue Engine",
    href: "/revenueengine/configureproducts",
    icon: <Wrench />,
    subpages: [
      {
        name: "Configure Products",
        href: "/revenueengine/configureproducts",
        icon: <Cog />,
      },
      { name: "Pricing", href: "/revenueengine/pricing", icon: <DollarSign /> },
      { name: "Quotes", href: "/revenueengine/quotes", icon: <FileText /> },
    ],
  },
];

export const employeeNavigation = [
  {
    name: "HRMS",
    href: "/hrms",
    icon: <SquareUser />,
    subpages: [
      {
        name: "Calendar",
        href: "/hrms/Calendar",
        icon: <Calendar />,
      },
    ],
  },
];
