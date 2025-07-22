// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Wallet,
  Search,
  ShoppingBag,
  MessageSquare,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip.tsx";
import { useRef } from "react";
import Dropdown from "./DropdownMenu.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications.ts";
import { getProfile } from "@/api/auth.ts";

const NavbarMax = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { notifications, isLoading, hasUnread } = useNotifications();

  const popularServices = [
    "logo design",
    "data entry",
    "video editing",
    "website development",
    "social media manager",
    "youtube thumbnail",
    "seo",
    "facebook ads",
    "shopify store design",
    "virtual assistant",
  ];

    useEffect(() => {
      const userId = localStorage.getItem("user_id");
  
      const fetchProfile = async () => {
        if (!userId) return;
        try {
          const res = await getProfile(userId);
          setUsername(res.username);
        } catch (err) {
          console.error("Failed to fetch profile", err);
        } 
      };
  
      fetchProfile();
    }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?keyword=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location, hasUnread]);

  const iconWithTooltip = (
    IconComponent: any,
    label: string,
    hasWarning = false,
    route?: string,
    hasDot = false
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Button
              variant="ghost"
              className="text-text-secondary"
              onClick={() => {
                if (route) navigate(route);
              }}
            >
              <IconComponent className="h-5 w-5" />
            </Button>
            {hasDot && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
            {hasWarning && (
              <AlertTriangle className="absolute -top-1 -right-1 h-4 w-4 text-red-600" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      {/* Overlay covers everything except navbar */}
      {isSearchOpen && <div className="fixed inset-0 bg-black/40 z-10" />}

      <nav className="bg-secondary border-b border-border relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-text-primary">
                Freelancia
              </span>
            </Link>

            <div className="relative w-full z-30 mx-4">
              {/* Search input */}
              <form onSubmit={handleSearch} className="relative z-30">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  ref={searchRef}
                  placeholder="What service are you looking for today?"
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
              </form>

              {/* Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-full bg-secondary border rounded-lg shadow z-40 p-4 animate-fade-in max-h-[300px] overflow-y-auto"
                  >
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      POPULAR RIGHT NOW
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularServices.map((service) => (
                        <Button
                          key={service}
                          variant="outline"
                          size="sm"
                          className="rounded-full capitalize"
                          onClick={() => {
                            setSearchQuery(service);
                            navigate(`/jobs/${encodeURIComponent(service)}`);
                            setIsSearchOpen(false);
                          }}
                        >
                          {service}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* The rest of your navbar content here... */}
            <div className="hidden md:flex items-center space-x-2">
              {iconWithTooltip(ShoppingBag, "Workspace", undefined, "/workspace")}
              {iconWithTooltip(
                MessageSquare,
                "Messages",
                undefined,
                "/messages"
              )}
              {iconWithTooltip(
                Bell,
                "Notifications",
                undefined,
                "/notifications",
                hasUnread
              )}

              <Dropdown username={username} />
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-text-secondary hover:text-text-primary"
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-secondary hover:text-text-primary"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarMax;
