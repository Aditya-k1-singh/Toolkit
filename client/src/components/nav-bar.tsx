import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mountain, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { handleSectionNavigation, scrollToSection } from "@/lib/scroll-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Check for hash in URL on page load and scroll to that section
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        scrollToSection(id);
      }, 500); // A bit longer delay to ensure all content is loaded
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary text-2xl mr-2">
                <Mountain className="h-6 w-6" />
              </span>
              <span className="font-heading font-bold text-xl sm:text-2xl text-primary">
                TrekIndia
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-heading font-medium hover:text-primary border-b-2 ${
                isActive("/") ? "border-primary text-primary" : "border-transparent"
              } hover:border-primary px-1`}
            >
              Home
            </Link>
            <Link
              href="/treks"
              className={`font-heading font-medium hover:text-primary border-b-2 ${
                isActive("/treks") ? "border-primary text-primary" : "border-transparent"
              } hover:border-primary px-1`}
            >
              Treks
            </Link>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleSectionNavigation('about')();
              }}
              className="font-heading font-medium hover:text-primary border-b-2 border-transparent hover:border-primary px-1"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleSectionNavigation('contact')();
              }}
              className="font-heading font-medium hover:text-primary border-b-2 border-transparent hover:border-primary px-1"
            >
              Contact
            </a>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-heading font-medium">
                    {user.name || user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="font-heading font-bold text-black bg-white px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 shadow-md border-2 border-primary">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-6 pt-6">
                  <Link href="/" className="flex items-center">
                    <span className="text-primary text-2xl mr-2">
                      <Mountain className="h-6 w-6" />
                    </span>
                    <span className="font-heading font-bold text-xl text-primary">
                      TrekIndia
                    </span>
                  </Link>
                  <div className="space-y-4">
                    <Link
                      href="/"
                      className={`block py-2 px-3 text-base font-medium ${
                        isActive("/") ? "text-primary border-l-4 border-primary" : "text-gray-700 hover:text-primary border-l-4 border-transparent hover:border-primary"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/treks"
                      className={`block py-2 px-3 text-base font-medium ${
                        isActive("/treks") ? "text-primary border-l-4 border-primary" : "text-gray-700 hover:text-primary border-l-4 border-transparent hover:border-primary"
                      }`}
                    >
                      Treks
                    </Link>
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSectionNavigation('about')();
                      }}
                      className="block py-2 px-3 text-base font-medium text-gray-700 hover:text-primary border-l-4 border-transparent hover:border-primary"
                    >
                      About
                    </a>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSectionNavigation('contact')();
                      }}
                      className="block py-2 px-3 text-base font-medium text-gray-700 hover:text-primary border-l-4 border-transparent hover:border-primary"
                    >
                      Contact
                    </a>
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="block py-2 px-3 text-base font-medium text-gray-700 hover:text-primary border-l-4 border-transparent hover:border-primary"
                        >
                          Dashboard
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start py-2 px-3 text-base font-medium text-gray-700 hover:text-primary"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link href="/auth" className="block">
                        <Button className="w-full bg-white text-black font-bold py-4 px-4 rounded-lg shadow-md border-2 border-primary text-lg">
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
