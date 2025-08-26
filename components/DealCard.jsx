import { Card, CardContent } from "./ui/card";
import {
  Sheet,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
  SheetHeader,
  SheetContent,
} from "./ui/sheet";
import { Mail, Phone, Eye, LucideUpload, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import EmailTemplate from "./EmailTemplate";
import { useState } from "react";
import UpdateDeals from "./UpdateDeals";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

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
  const today = new Date().toISOString().split("T")[0];
  const [email, setEmail] = useState(false);
  const [newState, setNewState] = useState("");
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");

  const handleStatusUpdate = async () => {
    const stage_history = deal.stage_history || [];
    const length = stage_history.length;
    const start_date = stage_history[length - 1]?.end_date || deal.created_at;
    const current_history = {
      old_status: deal.status,
      new_status: newState,
      start_date: start_date.split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      state_description: description,
    };
    stage_history.push(current_history);
    const { error } = await supabase
      .from("Deals")
      .update({
        stage_history: stage_history,
        status: newState,
      })
      .eq("id", deal.id);

    if (error) {
      console.error("Error updating deal:", error);
      toast.error("Error updating deal");
    } else {
      if (deal.status === "Closed-won") {
        const customerData = {
          name: deal.name,
          phone: deal.phone,
          email: deal.email,
          linkedIn: deal.linkedIn,
          price: deal.value,
          location: deal.location,
          purchase_history: {
            product: deal.product,
            price: deal.value,
            purchase_date: today,
          },
          industry: deal.industry,
          status: "Active",
          created_at: today,
          user_email: deal.user_email,
        };
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("email", deal.email)
          .eq("user_email", deal.user_email)
          .maybeSingle();
        if (error) {
          console.error("Error checking existing customer:", error);
        }
        if (!data) {
          await fetch("/api/addCustomer", {
            method: "POST",
            body: JSON.stringify({
              ...customerData,
              session: session,
            }),
          });
        } else {
          const { error } = await supabase
            .from("customers")
            .update({
              ...customerData,
              price: data.price + deal.value,
              status: "Active",
              created_at: data.created_at,
              purchase_history: [
                ...data.purchase_history,
                {
                  product: deal.product,
                  price: deal.value,
                },
              ],
            })
            .eq("email", deal.email)
            .eq("user_email", userEmail);
          if (error) {
            console.error("Error updating existing customer:", error);
          }
        }
        onChange();
      }
      toast.success("Deal updated successfully");
    }
  };

  const handleDeleteDeal = async (dealId) => {
    const { error } = await supabase.from("Deals").delete().eq("id", dealId);

    if (error) {
      console.error("Error deleting deal:", error);
      toast.error("Error deleting deal");
    } else {
      toast.success("Deal deleted successfully");
      onChange();
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 hover:scale-103 hover:shadow-lg cursor-pointer dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Sheet>
              <SheetTrigger asChild key={deal.id}>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 hover:text-blue-500 dark:text-white break-words">
                  {deal.name}
                </h3>
              </SheetTrigger>
              <SheetContent className="space-y-6 overflow-y-auto min-h-[80vh] md:min-w-[85vw] min-w-screen ">
                <SheetHeader>
                  <SheetTitle>Deal Data</SheetTitle>
                  <SheetDescription>
                    <UpdateDeals deal_id={deal.id} onChange={onChange} />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
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
                Close: {deal?.closeDate?.split("T")[0] ?? ""}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-100  transition-opacity">
          <div className="flex flex-wrap gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DropdownMenu className="relative">
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1 sm:flex-none cursor-pointer ${
                      deal.status === "Closed-won" ||
                      deal.status === "Closed-lost"
                        ? "hidden"
                        : "block"
                    } `}
                    onClick={() => setId(deal.id)}
                  >
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 absolute top-[100%] bg-gray-700 text-white transform translate-x-[38%] translate-y-[-80%] z-1000 rounded-lg p-2 mt-2">
                  {dealStatus
                    .filter((statu) => statu !== deal.status)
                    .map((statu) => (
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
                      <span className="font-semibold">{deal.status}</span> to{" "}
                      <span className="font-semibold">{newState}</span>.
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
                type="Deals"
                id={deal.id}
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
                  <DialogTitle>Delete Deal</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this deal?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      handleDeleteDeal(deal.id);
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
        </div>
      </CardContent>
    </Card>
  );
}
