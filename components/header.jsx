import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  StarsIcon,
  FileText,
  PenBox,
} from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="w-full bg-white shadow-md dark:bg-gray-900">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/elevatepath.png"
            alt="ElevatePath Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            ElevatePath
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            {/* Dashboard Button */}
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 cursor-pointer">
                  <StarsIcon className="w-4 h-4" />
                  <span className="hidden md:block">Growth Tools</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="w-4 h-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/interview"
                    className="flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Interview Preparation
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            {/* FIXED: Remove asChild from SignInButton */}
            <SignInButton mode="redirect">
              <Button className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-300 transition-colors">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          {/* User Button */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;