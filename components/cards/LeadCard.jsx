"use client";

import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Sheet,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
  SheetHeader,
  SheetContent,
} from "../ui/sheet";
import { Mail, Phone, LucideUpload, Eye, Trash2, Edit } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
} from "@radix-ui/react-dropdown-menu";
import Updateleads from "../Updateleads";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import EmailTemplate from "../EmailTemplate";

export default function LeadCard({
  lead,
  setId,
  onChange,
  fetchLeads,
  fetchDeals,
}) {
  const leadStatus = [
    "New",
    "In progress",
    "Contact Attempted",
    "Contacted",
    "Meeting Booked",
    "Qualified",
    "Unqualified",
  ];

  const [newState, setNewState] = useState("");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(false);
  const [description, setDescription] = useState("");
  const today = new Date();

  const handleStatusUpdate = async () => {
    const stage_history = lead.stage_history || [];
    const length = stage_history.length;
    const start_date = stage_history[length - 1]?.end_date || lead.created_at;
    const current_history = {
      old_status: lead.status,
      new_status: newState,
      start_date: start_date.split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      state_description: description,
    };
    stage_history.push(current_history);
    const { data: LeadsData, error } = await supabase
      .from("Leads")
      .update({
        stage_history: stage_history,
        status: newState,
      })
      .select("*")
      .eq("id", lead.id)
      .single();

    if (error) {
      console.error("Error updating lead:", error);
      toast.error("Error updating lead");
    } else {
      toast.success("Lead updated successfully");
      if (newState === "Qualified") {
        const leadToDeal = {
          name: LeadsData.name,
          number: LeadsData.number,
          email: LeadsData.email,
          status: "New",
          created_at: today.toISOString().split("T")[0],
          closeDate: today.toISOString().split("T")[0],
          user_email: LeadsData.user_email,
        };
        const { data: deal, error } = await supabase
          .from("Deals")
          .insert({
            ...leadToDeal,
          })
          .select("*")
          .single();
      }

      if (error) {
        console.error("Error moving lead to deal:", error);
        toast.error("Error moving lead to deal");
      } else {
        toast.success("Lead moved to deal successfully");

        await fetchDeals();
        await fetchLeads();
      }
    }
  };

  const handleDeleteLead = async (leadId) => {
    const { error } = await supabase.from("Leads").delete().eq("id", leadId);

    if (error) {
      console.error("Error deleting lead:", error);
      toast.error("Error deleting lead");
    } else {
      toast.success("Lead deleted successfully");
      onChange();
    }
  };

  return (
    <>
      <Card className="backdrop-blur-sm bg-white/70 h-auto w-full sm:max-w-md md:max-w-full  z-0  hover:shadow-lg dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-1000 group mx-auto ">
        <CardContent>
          <div className="flex sm:flex-row sm:items-start sm:justify-between gap-4">
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
                <AvatarFallback className="bg-gradient-to-r from-sky-700 to-teal-500 text-white md:text-xl font-semibold xs:text-md">
                  {lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 w-full">
                <Sheet>
                  <SheetTrigger asChild key={lead.id}>
                    <Label className="mt-2 ml-2 flex items-center gap-2 hover:text-blue-400 text-md md:text-[16px] min-w-full bg-transparent font-semibold text-slate-900 dark:text-white break-words  hover:bg-transparent">
                      {lead.name}
                      <Edit className="h-4 w-4 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer ml-1" />
                    </Label>
                  </SheetTrigger>
                  <SheetContent className="space-y-6 overflow-y-auto min-h-[80vh] md:min-w-[85vw] min-w-screen ">
                    <SheetHeader>
                      <SheetTitle>Lead Data</SheetTitle>
                      <SheetDescription>
                        <Updateleads
                          lead_id={lead.id}
                          onChange={onChange}
                          fetchLeads={fetchLeads}
                          fetchDeals={fetchDeals}
                        />
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">
                  {lead.contact}
                </p>
              </div>
            </div>
            <Badge
              variant={lead.source === "Email" ? "Qualified" : "hidden"}
              className={`mt-3 ${
                lead.source === "Email" ? "visible" : "invisible"
              }`}
            >
              Automated
            </Badge>
            <div className="flex mt-2 sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
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
          <div className="flex items-center justify-center mt-4 opacity-100 sm:opacity-100">
            <div className="flex items-center justify-between w-full">
              <div className="flex justify-center gap-6">
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
                    type="Leads"
                    id={lead.id}
                    email={lead.email}
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Lead</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this lead?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => {
                          handleDeleteLead(lead.id);
                          setOpen(false);
                          onChange();
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DropdownMenu className="relative">
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className={`bg-gradient-to-r from-sky-700 to-teal-500 text-white flex-1 sm:flex-none cursor-pointer ${
                          lead.status === "Qualified" ? "hidden" : "block"
                        } `}
                        onClick={() => setId(lead.id)}
                      >
                        Update Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 absolute top-[100%] bg-gray-700 text-white transform translate-x-[38%] translate-y-[-80%] z-1000 rounded-lg p-2 mt-2">
                      {leadStatus.map((statu) => (
                        <DialogTrigger asChild key={statu}>
                          <DropdownMenuItem
                            className="cursor-pointer border-b border-gray-300"
                            key={statu}
                            onClick={() => {
                              setNewState(statu);
                              setOpen(true);
                            }}
                          >
                            {statu}
                          </DropdownMenuItem>
                        </DialogTrigger>
                      ))}
                    </DropdownMenuContent>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Status Info</DialogTitle>
                        <DialogDescription>
                          You are currently updating the status from{" "}
                          <span className="font-semibold">{lead.status}</span>{" "}
                          to <span className="font-semibold">{newState}</span>.
                          <>
                            <Textarea
                              placeholder="Explain in  detail about the actions performed in this stage. Along with reason for updating the status"
                              className="mt-1"
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={() => {
                            handleStatusUpdate();
                            setOpen(false);
                            onChange();
                          }}
                          className="border cursor-pointer border-green-500 bg-transparent hover:bg-green-200 hover:text-green-700 text-green-500"
                        >
                          <LucideUpload className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </DropdownMenu>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
