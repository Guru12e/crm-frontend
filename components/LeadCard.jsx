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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Updateleads from "./Updateleads";
import { supabase } from "@/utils/supabase/client";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

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
  const fetchLeadData = async () => {
    const { data, error } = await supabase
      .from("Leads")
      .select("*")
      .eq("id", lead.id)
      .single();

    if (error) {
      console.error("Error fetching lead data:", error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    fetchLeadData();
  }, [lead.id]);

  return (
    <Card className="backdrop-blur-sm bg-white/70 h-[23vh] w-[42vh] z-0 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-3 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start space-x-0 flex-1 min-w-0">
            <div>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
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
                <SheetTrigger asChild key={lead.id}>
                  <Button className="mt-1 text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words bg-transparent hover:bg-transparent cursor-pointer hover:text-blue-500 ">
                    {lead.name}
                  </Button>
                </SheetTrigger>
                <SheetContent className="space-y-6 overflow-y-auto min-h-[80vh] min-w-[85vw]">
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
                  lead.status === "New"
                    ? "default"
                    : lead.status === "In progress"
                    ? "secondary"
                    : lead.status === "Contact Attempted"
                    ? "secondary"
                    : lead.status === "Contacted"
                    ? "secondary"
                    : lead.status === "Meeting Booked"
                    ? "info"
                    : lead.status === "Qualified"
                    ? "success"
                    : lead.status === "Unqualified"
                    ? "destructive"
                    : "secondary"
                }
              >
                {lead.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-100">
          <div className="flex items-center justify-around gap-4">
            <div>
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
            </div>
            <div>
              <DropdownMenu className="relative">
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1 sm:flex-none cursor-pointer ${
                      lead.status === "Qualified" ? "hidden" : "block"
                    } `}
                    onClick={() => setId(lead.id)}
                  >
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 absolute top-[100%] bg-gray-700 text-white transform translate-x-[38%] translate-y-[-80%] z-1000 rounded-lg p-2 mt-2">
                  {leadStatus.map((statu) => (
                    <DropdownMenuItem
                      className="cursor-pointer border-b border-gray-300"
                      key={statu}
                      onClick={async () => {
                        await supabase
                          .from("Leads")
                          .update({ status: statu })
                          .eq("id", lead.id);
                        toast.success("Lead status updated", {
                          autoClose: 3000,
                          position: "top-right",
                        });
                        await fetchLeadData();
                        window.location.reload();
                      }}
                    >
                      {statu}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
