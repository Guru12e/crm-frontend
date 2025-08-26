import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import {
  MapPin,
  Building2,
  Eye,
  Mail,
  Phone,
  MoreHorizontal,
  Edit,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SheetTrigger } from "./ui/sheet";

export default function CustomerCard({ customer }) {
  return (
    <Sheet>
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
        <CardContent className="p-4 sm:p-6">
          <SheetTrigger as Child>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
                    {customer.name}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">
                    {customer.email}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400 gap-1 sm:gap-0">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="break-words">{customer.industry}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="break-words">{customer.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                <div className="text-left sm:text-right">
                  <div className="text-base sm:text-lg font-bold text-green-600">
                    {customer.value}
                  </div>
                  <Badge
                    variant={
                      customer.status === "Active"
                        ? "default"
                        : customer.status === "At Risk"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {customer.status}
                  </Badge>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                    Created At: {customer.created_at.split("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          </SheetTrigger>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
            </div>
            <div className="flex space-x-2 justify-center sm:justify-end">
              <Button size="sm" variant="ghost" className="p-2">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Sheet>
  );
}
