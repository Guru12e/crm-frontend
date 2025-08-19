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
import { MapPin, Building2, Mail, Phone } from "lucide-react";
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

export default function LeadCard({ lead, setId }) {
  const leadStatus = [
    "New",
    "In progress",
    "Contact Attempted",
    "Contacted",
    "Meeting Booked",
    "Qualified",
    "Unqualified",
  ];
  return (
    <Card className="backdrop-blur-sm bg-white/70 h-[23vh] w-[58vh] z-0 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-3 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start space-x-0 flex-1 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-semibold">
                {lead.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="mt-1 text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words bg-transparent hover:bg-transparent cursor-pointer hover:text-blue-500 ">
                    {lead.name}
                  </Button>
                </SheetTrigger>
                <SheetContent className="space-y-6 overflow-y-auto min-h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Lead Data</SheetTitle>
                    <SheetDescription>
                      <Updateleads lead_id={lead.id} />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">
                {lead.contact}
              </p>
            </div>
          </div>
          <div className="flex mt-1 sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <div className="text-left">
              <Badge
                variant={
                  lead.status === "Hot"
                    ? "destructive"
                    : lead.status === "Qualified"
                    ? "default"
                    : "secondary"
                }
              >
                {lead.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-100">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Select>
              <SelectTrigger className="w-48 bg-gray-200 flex justify-between items-center rounded-md px-3 py-2 cursor-pointer text-blue-500">
                <h1 className="text-black">Update Status</h1>
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                sideOffset={4}
                className="w-48 bg-gray-200 text-black rounded-lg p-2"
              >
                {leadStatus
                  .slice(leadStatus.indexOf(lead.status) + 1)
                  .map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="cursor-pointer border-b border-gray-300 last:border-0"
                      onClick={async () => {
                        await supabase
                          .from("Leads")
                          .update({ status })
                          .eq("id", lead.id);
                      }}
                    >
                      {status}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
