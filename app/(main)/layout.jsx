"use client";

import { useState } from "react";
import {
  Home,
  Users,
  MessageSquare,
  Database,
  Send,
  Megaphone,
  Calendar,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Search,
  User,
  Mail,
  Phone,
  LogOut,
  HelpCircle,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  {
    name: "Prospects",
    href: "/prospects",
    icon: Users,
    subpages: [
      { name: "Our Prospects", href: "/prospects/our-prospects" },
      { name: "Upload Your CSV", href: "/prospects/upload-csv" },
    ],
  },
  { name: "Engagement", href: "/engagement", icon: MessageSquare },
  { name: "CRM", href: "/crm", icon: Database },
  { name: "Outreach", href: "/outreach", icon: Send },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useSearchParams().get("pathname") || "/home";

  const toggleExpanded = (name) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleItemClick = (item) => {
    if (item.subpages && item.subpages.length > 0) {
      toggleExpanded(item.name);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
        darkMode && "dark"
      )}
    >
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16",
          "hidden sm:block"
        )}
      >
        <div className="flex h-full flex-col backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-r border-white/30 dark:border-slate-700/50">
          <div className="flex h-16 items-center justify-between px-4">
            {sidebarOpen && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GTM Engine
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/30 dark:hover:bg-slate-800/50"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.subpages &&
                  item.subpages.some((sub) => location.pathname === sub.href));
              const hasSubpages = item.subpages && item.subpages.length > 0;
              const isExpanded = expandedItems.includes(item.name);

              return (
                <div key={item.name}>
                  <div
                    className={cn(
                      "flex items-center cursor-pointer rounded-lg px-2 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <Link
                      href={item.href}
                      className="group flex flex-1 items-center"
                      onClick={(e) => {
                        if (hasSubpages) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500"
                        )}
                      />
                      {sidebarOpen && (
                        <span className="ml-3 truncate max-sm:hidden">
                          {item.name}
                        </span>
                      )}
                    </Link>
                    {hasSubpages && sidebarOpen && (
                      <div className="p-1 max-sm:hidden">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {hasSubpages && isExpanded && sidebarOpen && (
                    <div className="ml-8 mt-1 space-y-1 max-sm:hidden">
                      {item.subpages.map((subpage) => (
                        <Link
                          key={subpage.href}
                          href={subpage.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-all",
                            location.pathname === subpage.href
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-800/30"
                          )}
                        >
                          {subpage.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out sm:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-r border-white/30 dark:border-slate-700/50">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GTM Engine
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 hover:bg-white/30 dark:hover:bg-slate-800/50"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.subpages &&
                  item.subpages.some((sub) => location.pathname === sub.href));
              const hasSubpages = item.subpages && item.subpages.length > 0;
              const isExpanded = expandedItems.includes(item.name);

              return (
                <div key={item.name}>
                  <div
                    className={cn(
                      "flex items-center cursor-pointer rounded-lg px-2 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <Link
                      href={item.href}
                      className="group flex flex-1 items-center"
                      onClick={(e) => {
                        if (hasSubpages) {
                          e.preventDefault();
                        } else {
                          setMobileSidebarOpen(false);
                        }
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500"
                        )}
                      />
                      <span className="ml-3 truncate">{item.name}</span>
                    </Link>
                    {hasSubpages && (
                      <div className="p-1">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {hasSubpages && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subpages.map((subpage) => (
                        <Link
                          key={subpage.href}
                          href={subpage.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-all",
                            location.pathname === subpage.href
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-800/30"
                          )}
                        >
                          {subpage.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          sidebarOpen ? "ml-64" : "ml-16",
          "max-sm:ml-0"
        )}
      >
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-white/30 dark:border-slate-700/50">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 hover:bg-white/30 dark:hover:bg-slate-800/50 sm:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 max-w-md min-w-0 ml-2 sm:ml-0">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 text-sm w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-2 hover:bg-white/30 dark:hover:bg-slate-800/50 whitespace-nowrap"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden md:inline">Contact Us</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden p-2 hover:bg-white/30 dark:hover:bg-slate-800/50"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 hover:bg-white/30 dark:hover:bg-slate-800/50"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@user" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"></AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/30 dark:border-slate-700/50"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Jhon Doe
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        jhondoe@company.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/company-details"
                      className="w-full cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Company Details</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <Link href="/" className="w-full cursor-pointer">
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-full min-w-0">{children}</div>
        </main>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
