import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Sheet,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
  SheetHeader,
  SheetContent,
} from "./ui/sheet";
import { MapPin, Building2, Mail, Phone, Eye, Edit } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Updateleads from "./Updateleads";

export default function DealCard({ deal, setId }) {
  const dealStatus = [
    "New",
    "Proposal Sent",
    "Negotiation",
    "Closed-won",
    "Closed-lost",
    "On-hold",
    "Abandoned",
  ];
  return (
    <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
              {deal.name}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">
              {deal.company}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400 gap-1 sm:gap-0">
              <span className="break-words">Owner: {deal.owner}</span>
              <span className="break-words">Source: {deal.source}</span>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {deal.value}
              </div>
              <Badge variant="outline">{deal.status}</Badge>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                Close: {deal.closeDate}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">
              Probability
            </span>
            <span className="font-medium">{deal.probability}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${deal.probability}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-100  transition-opacity">
          <div className="flex flex-wrap gap-2">
            <Select>
              <SelectTrigger className="w-48 bg-gray-400 text-white flex justify-between items-center rounded-md px-3 py-2 cursor-pointer">
                <h1 className="text-black">Update Status</h1>
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                sideOffset={4}
                className="w-48 bg-gray-200 text-white rounded-lg p-2"
              >
                {dealStatus
                  .slice(dealStatus.indexOf(deal.status) + 1)
                  .map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="cursor-pointer border-b border-gray-300 last:border-0"
                      onClick={async () => {
                        await supabase
                          .from("deals")
                          .update({ status })
                          .eq("id", deal.id);
                      }}
                    >
                      {status}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              Add Note
            </Button>
          </div>
          <div className="flex space-x-2 justify-center sm:justify-end">
            <Button size="sm" variant="ghost" className="p-2">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
