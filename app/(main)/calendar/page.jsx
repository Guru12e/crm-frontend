"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Search,
  Plus,
  Video,
  Phone,
  MapPin,
  Users,
  Edit,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { mockMeetings } from "@/constants/constant";

export default function Calendar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredMeetings = mockMeetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.attendees.some((attendee) =>
        attendee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType =
      !typeFilter || typeFilter === "all-types" || meeting.type === typeFilter;
    const matchesMonth =
      !monthFilter ||
      monthFilter === "all-time" ||
      meeting.date.includes(monthFilter);
    const matchesStatus =
      !statusFilter ||
      statusFilter === "all-statuses" ||
      meeting.status === statusFilter;

    return matchesSearch && matchesType && matchesMonth && matchesStatus;
  });

  const today = new Date().toISOString().split("T")[0];
  const todaysMeetings = filteredMeetings.filter(
    (meeting) => meeting.date === today
  );
  const upcomingMeetings = filteredMeetings.filter(
    (meeting) => meeting.date > today
  );
  const pastMeetings = filteredMeetings.filter(
    (meeting) => meeting.date < today
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "demo":
        return <Video className="w-4 h-4" />;
      case "call":
        return <Phone className="w-4 h-4" />;
      case "presentation":
        return <Users className="w-4 h-4" />;
      case "discovery":
        return <Search className="w-4 h-4" />;
      case "review":
        return <CheckCircle className="w-4 h-4" />;
      case "checkin":
        return <Clock className="w-4 h-4" />;
      case "training":
        return <Users className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "confirmed":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-slate-500";
    }
  };

  const MeetingCard = ({ meeting, isUpcoming = true }) => (
    <Card className="backdrop-blur-sm bg-teal-200/70 dark:bg-sky-800/50 border border-teal-200/50 dark:border-sky-700/20 hover:bg-teal-400/80 dark:hover:bg-sky-800/60 transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white`}
              >
                {getTypeIcon(meeting.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
                  {meeting.title}
                </h3>
                <div
                  className={`w-2 h-2 rounded-full ${getPriorityColor(
                    meeting.priority
                  )} flex-shrink-0`}
                ></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-2 gap-1 sm:gap-0">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {meeting.time} • {meeting.duration}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {meeting.platform}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div className="flex -space-x-2">
                    {meeting.attendees.slice(0, 3).map((attendee, index) => (
                      <Avatar
                        key={index}
                        className="w-6 h-6 border-2 border-white dark:border-slate-800"
                      >
                        <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {attendee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {meeting.attendees.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          +{meeting.attendees.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {meeting.attendees.length === 1
                    ? meeting.attendees[0]
                    : `${meeting.attendees.length} attendees`}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 break-words">
                {meeting.description}
              </p>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:space-y-2">
            <div className="flex flex-col sm:items-end gap-1">
              <Badge variant={getStatusColor(meeting.status)}>
                {meeting.status}
              </Badge>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {meeting.date}
              </div>
            </div>
            <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="p-2">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Edit className="h-4 w-4" />
              </Button>
              {isUpcoming && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SummaryCard = ({ title, count, subtitle, icon: Icon }) => (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {count}
            </p>
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-blue-500" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Meeting Timeline
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Manage your scheduled meetings with advanced filtering options
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <SummaryCard
          title="Today's Meetings"
          count={todaysMeetings.length}
          subtitle="Scheduled for today"
          icon={CalendarIcon}
        />
        <SummaryCard
          title="Upcoming"
          count={upcomingMeetings.length}
          subtitle="This week"
          icon={Clock}
        />
        <SummaryCard
          title="High Priority"
          count={filteredMeetings.filter((m) => m.priority === "high").length}
          subtitle="Requires attention"
          icon={AlertCircle}
        />
        <SummaryCard
          title="This Month"
          count={filteredMeetings.length}
          subtitle="Total meetings"
          icon={Users}
        />
      </div>

      <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All types</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="checkin">Check-in</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All time</SelectItem>
                <SelectItem value="2024-12">December 2024</SelectItem>
                <SelectItem value="2024-11">November 2024</SelectItem>
                <SelectItem value="2024-10">October 2024</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 w-full lg:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {todaysMeetings.length > 0 && (
        <div className="space-y-4">
          <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Today's Meetings
            </h2>
          </div>
          {todaysMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      {upcomingMeetings.length > 0 && (
        <div className="space-y-4">
          <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Upcoming Meetings
            </h2>
          </div>
          {upcomingMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      {pastMeetings.length > 0 && (
        <div className="space-y-4">
          <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Past Meetings
            </h2>
          </div>
          {pastMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              isUpcoming={false}
            />
          ))}
        </div>
      )}

      {filteredMeetings.length === 0 && (
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
          <CardContent className="p-12 text-center">
            <CalendarIcon className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No meetings found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Try adjusting your filters or schedule a new meeting.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
