"use client";

import { Input } from "@/components/ui/input";
import UserMenu from "../ui/user-dropdown-01";
import { ThemeToggle } from "../ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Navbar = () => {
  const { data: session } = authClient.useSession();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background border-b">
      <div className="flex items-center justify-between px-8 py-3">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger className="lg:hidden">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left" className="py-8 pl-8 w-64">
              <SheetTitle>
                <VisuallyHidden>Sidebar Navigation</VisuallyHidden>
              </SheetTitle>

              <Sidebar mobile />
            </SheetContent>
          </Sheet>

          <div className="text-xl font-semibold  ">
            <span className="">Answerly</span>..
          </div>
        </div>

        <div className="hidden md:block flex-1 px-6 max-w-md">
          <Input type="text" placeholder="Search..." className="w-full" />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu
            name={session?.user.name}
            email={session?.user.email}
            avatar={session?.user.image}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
