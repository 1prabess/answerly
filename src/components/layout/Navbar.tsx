"use client";

import { Input } from "@/components/ui/input";
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
import UserDropDown from "../ui/user-dropdown";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  console.log(session);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-background border-b"
      style={{ height: "64px" }}
    >
      <div className="mx-auto max-w-[90rem] h-full px-4 sm:px-8 flex items-center justify-between">
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

          <div className="text-xl font-semibold">Answerly</div>
        </div>

        <div className="hidden md:flex flex-1 px-6 max-w-md">
          <Input type="text" placeholder="Search..." className="w-full" />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserDropDown
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
