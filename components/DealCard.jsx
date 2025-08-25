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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Updateleads from "./Updateleads";
import EmailTemplate from "./EmailTemplate";
import { useState } from "react";
import UpdateDeals from "./UpdateDeals";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogTrigger } from "./ui/dialog";

export default function DealCard({ deal, setId, onChange }) {
  const dealStatus = [
    "New",
    "Proposal Sent",
    "Negotiation",
    "Closed-won",
    "Closed-lost",
    "On-hold",
    "Abandoned",
  ];
  const [email, setEmail] = useState(false);
  return (
    <Sheet>
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 hover:scale-103 hover:shadow-lg cursor-pointer dark:hover:bg-slate-800/60 transition-all duration-300 group">
        <CardContent className="p-4 sm:p-6">
          <SheetTrigger asChild key={deal.id}>
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
          </SheetTrigger>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-100  transition-opacity">
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1 sm:flex-none cursor-pointer`}
                  >
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 absolute top-[100%] bg-gray-700 text-white transform translate-x-[-50%] translate-y-[-120%] rounded-lg p-2 mt-2">
                  {dealStatus
                    .slice(dealStatus.indexOf(deal.status) + 1)
                    .map((status) => (
                      <DropdownMenuItem
                        className="cursor-pointer border-b border-gray-300"
                        key={status}
                        onClick={async () => {
                          await supabase
                            .from("deals")
                            .update({ status: status })
                            .eq("id", deal.id);
                        }}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/50 cursor-pointer dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
                    onClick={() => setEmail(true)}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </DialogTrigger>

                <EmailTemplate
                  email={deal.email}
                  open={email}
                  onOpenChange={setEmail}
                />
              </Dialog>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <SheetTrigger asChild>
                <button className="bg-white/50 dark:bg-slate-800/50 border p-1 rounded cursor-pointer hover:scale-105 transition-transform border-black/10 flex-1 sm:flex-none">
                  <Eye className="h-4 w-4" />
                </button>
              </SheetTrigger>
            </div>
          </div>
        </CardContent>
      </Card>

      <SheetContent className="space-y-6 overflow-y-auto min-h-[80vh] md:min-w-[85vw] min-w-screen ">
        <SheetHeader>
          <SheetTitle>Deal Data</SheetTitle>
          <SheetDescription>
            <UpdateDeals deal_id={deal.id} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
